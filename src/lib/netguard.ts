// Outbound request guard. The audit and crawl tools fetch URLs chosen by the model, and the model may be
// steered by text on web pages it has read (prompt injection). Without a guard, a page could get the
// server to request internal addresses (routers, admin panels, cloud metadata at 169.254.169.254).
// Private, loopback, link-local and similar ranges are refused unless MARKETING_EXPERT_ALLOW_PRIVATE=1.
// Limitation: for fetch(), DNS could change between this check and the request (DNS rebinding); this guard
// raises the bar, it is not a network firewall. Render mode connects only to the checked addresses.

import type { LookupAddress } from "node:dns";
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

/** The eight 16-bit groups of an IPv6 address. Expands "::" and a dotted IPv4 tail (::ffff:1.2.3.4). */
function ipv6Groups(ip: string): number[] {
  let a = ip.toLowerCase().replace(/%.*$/, "");
  const tail = /(\d+\.\d+\.\d+\.\d+)$/.exec(a);
  if (tail) {
    const n = ipv4ToInt(tail[1]);
    a = a.slice(0, tail.index) + (n >>> 16).toString(16) + ":" + (n & 0xffff).toString(16);
  }
  const [head, rest] = a.split("::");
  const h = head ? head.split(":") : [];
  const t = rest ? rest.split(":") : [];
  const zeros = rest === undefined ? [] : Array<string>(8 - h.length - t.length).fill("0");
  return [...h, ...zeros, ...t].map((x) => parseInt(x, 16));
}

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
    // Compare the 16-bit groups, not the text: URL parsing writes [::ffff:127.0.0.1] as [::ffff:7f00:1].
    const g = ipv6Groups(ip);
    const v4 = (hi: number, lo: number) => isBlockedIp(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`);
    const zero = (from: number, to: number) => g.slice(from, to).every((x) => x === 0);
    // Forms that carry an IPv4 address are judged by that address.
    if (zero(0, 5) && (g[5] === 0xffff || g[5] === 0)) return v4(g[6], g[7]); // ::ffff:0:0/96 mapped, ::/96 compatible (also :: and ::1)
    if (zero(0, 4) && g[4] === 0xffff && g[5] === 0) return v4(g[6], g[7]); // ::ffff:0:0:0/96 SIIT translated
    if (g[0] === 0x64 && g[1] === 0xff9b) return zero(2, 6) ? v4(g[6], g[7]) : true; // 64:ff9b::/96 NAT64; the rest of 64:ff9b::/32 is local-use or unassigned
    if (g[0] === 0x2002) return v4(g[1], g[2]); // 2002::/16 6to4
    if (g[0] === 0x2001 && (g[1] === 0 || g[1] === 0xdb8)) return true; // 2001::/32 Teredo, 2001:db8::/32 documentation
    if (g[0] === 0x100 && zero(1, 4)) return true; // 100::/64 discard-only
    if ((g[0] & 0xfe00) === 0xfc00) return true; // fc00::/7 unique local
    if ((g[0] & 0xffc0) === 0xfe80) return true; // fe80::/10 link-local
    if ((g[0] & 0xffc0) === 0xfec0) return true; // fec0::/10 site-local (deprecated)
    if ((g[0] & 0xff00) === 0xff00) return true; // ff00::/8 multicast
    return false;
  }
  return true; // not an IP: refuse
}

/**
 * The addresses of `host` (a name or an IP literal), for connecting to exactly what was checked.
 * Throws BlockedAddressError for local names or if any address is non-public, unless private addresses are allowed.
 */
export async function resolvePublic(host: string): Promise<LookupAddress[]> {
  const h = host.replace(/^\[|\]$/g, "");
  const check = !privateAllowed();
  if (check && (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal"))) {
    throw new BlockedAddressError(`refusing to fetch ${h}: local/internal hostname (set MARKETING_EXPERT_ALLOW_PRIVATE=1 to allow)`);
  }
  const addrs: LookupAddress[] = isIP(h) ? [{ address: h, family: isIP(h) }] : await lookup(h, { all: true, verbatim: true });
  const bad = check && addrs.find((a) => isBlockedIp(a.address));
  if (bad) {
    throw new BlockedAddressError(`refusing to fetch ${h}: resolves to non-public address ${bad.address} (set MARKETING_EXPERT_ALLOW_PRIVATE=1 to allow)`);
  }
  return addrs;
}

/** Throws BlockedAddressError if the URL is not http(s) or resolves to a non-public address. */
export async function assertPublicUrl(url: string | URL): Promise<void> {
  const u = typeof url === "string" ? new URL(url) : url;
  if (!/^https?:$/.test(u.protocol)) throw new BlockedAddressError(`only http(s) URLs are allowed (got ${u.protocol})`);
  if (privateAllowed()) return;
  await resolvePublic(u.hostname);
}

/** The most HTML the audit and crawl tools read from one page (parsing 5 MB of tags takes about 0.7 GB of memory). */
export const MAX_HTML_BYTES = 5 * 1024 * 1024;
/** The most of a robots.txt file the tools read. Google reads the first 500 KiB and ignores the rest. */
export const MAX_ROBOTS_BYTES = 500 * 1024;

/**
 * Reads at most maxBytes of a response body (after gzip/brotli decoding) as UTF-8, like res.text(), then
 * stops the download. A few KB of gzip can inflate to gigabytes, and parsing that would crash the server.
 */
export async function readCapped(res: Response, maxBytes: number): Promise<{ text: string; truncated: boolean }> {
  if (!res.body) return { text: "", truncated: false };
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  let bytes = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return { text: text + decoder.decode(), truncated: false };
    if (bytes + value.byteLength > maxBytes) {
      text += decoder.decode(value.subarray(0, maxBytes - bytes), { stream: true });
      reader.cancel().catch(() => undefined);
      return { text, truncated: true };
    }
    bytes += value.byteLength;
    text += decoder.decode(value, { stream: true });
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
