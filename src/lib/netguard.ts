// Outbound request guard. The audit and crawl tools fetch URLs chosen by the model, and the model may be
// steered by text on web pages it has read (prompt injection). Without a guard, a page could get the
// server to request internal addresses (routers, admin panels, cloud metadata at 169.254.169.254).
// Private, loopback, link-local and similar ranges are refused unless MARKETING_EXPERT_ALLOW_PRIVATE=1.
// Limitation: DNS could change between this check and the request (DNS rebinding); this guard
// raises the bar, it is not a network firewall.

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export class BlockedAddressError extends Error {}

export function privateAllowed(): boolean {
  return process.env.MARKETING_EXPERT_ALLOW_PRIVATE === "1";
}

function ipv4ToInt(ip: string): number {
  return ip.split(".").reduce((n, o) => n * 256 + Number(o), 0);
}

const V4_BLOCKS: Array<[string, number]> = [
  ["0.0.0.0", 8], // "this network"
  ["10.0.0.0", 8], // private
  ["100.64.0.0", 10], // carrier-grade NAT
  ["127.0.0.0", 8], // loopback
  ["169.254.0.0", 16], // link-local, cloud metadata
  ["172.16.0.0", 12], // private
  ["192.0.0.0", 24], // IETF protocol assignments
  ["192.168.0.0", 16], // private
  ["198.18.0.0", 15], // benchmarking
  ["224.0.0.0", 4], // multicast
  ["240.0.0.0", 4], // reserved, broadcast
];

export function isBlockedIp(ip: string): boolean {
  const v = isIP(ip);
  if (v === 4) {
    const n = ipv4ToInt(ip);
    return V4_BLOCKS.some(([base, bits]) => {
      const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
      return ((n & mask) >>> 0) === ((ipv4ToInt(base) & mask) >>> 0);
    });
  }
  if (v === 6) {
    const a = ip.toLowerCase();
    if (a === "::" || a === "::1") return true;
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(a);
    if (mapped) return isBlockedIp(mapped[1]);
    const first = parseInt(a.split(":")[0] || "0", 16);
    if ((first & 0xfe00) === 0xfc00) return true; // fc00::/7 unique local
    if ((first & 0xffc0) === 0xfe80) return true; // fe80::/10 link-local
    if ((first & 0xff00) === 0xff00) return true; // ff00::/8 multicast
    return false;
  }
  return true; // not an IP: refuse
}

/** Throws BlockedAddressError if the URL is not http(s) or resolves to a non-public address. */
export async function assertPublicUrl(url: string | URL): Promise<void> {
  const u = typeof url === "string" ? new URL(url) : url;
  if (!/^https?:$/.test(u.protocol)) throw new BlockedAddressError(`only http(s) URLs are allowed (got ${u.protocol})`);
  if (privateAllowed()) return;
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new BlockedAddressError(`refusing to fetch ${host}: local/internal hostname (set MARKETING_EXPERT_ALLOW_PRIVATE=1 to allow)`);
  }
  const addrs = isIP(host) ? [{ address: host }] : await lookup(host, { all: true, verbatim: true });
  const bad = addrs.find((a) => isBlockedIp(a.address));
  if (bad) {
    throw new BlockedAddressError(`refusing to fetch ${host}: resolves to non-public address ${bad.address} (set MARKETING_EXPERT_ALLOW_PRIVATE=1 to allow)`);
  }
}

/**
 * fetch() that checks every URL, including each redirect hop, against assertPublicUrl.
 * With redirect "manual", the caller handles redirects (and must call this again for each hop).
 */
export async function guardedFetch(url: string | URL, init: RequestInit = {}, maxRedirects = 5): Promise<Response> {
  let current = new URL(url);
  const manual = init.redirect === "manual";
  const chain: string[] = [];
  for (let hop = 0; ; hop++) {
    await assertPublicUrl(current);
    const res = await fetch(current, { ...init, redirect: "manual" });
    const loc = res.headers.get("location");
    if (manual || !(res.status >= 300 && res.status < 400 && loc)) {
      if (!manual) {
        Object.defineProperty(res, "url", { value: current.toString() });
        Object.defineProperty(res, "redirectChain", { value: chain });
      }
      return res;
    }
    chain.push(`${res.status} → ${new URL(loc, current).toString()}`);
    if (hop >= maxRedirects) throw new Error(`too many redirects (> ${maxRedirects})`);
    current = new URL(loc, current);
  }
}
