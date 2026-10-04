import { describe, it, expect, afterEach, vi } from "vitest";
import { isBlockedIp, assertPublicUrl, guardedFetch } from "../src/lib/netguard.js";

describe("isBlockedIp", () => {
  it.each(["127.0.0.1", "10.1.2.3", "172.16.0.1", "172.31.255.255", "192.168.1.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "224.0.0.1", "::1", "::", "fc00::1", "fd12::1", "fe80::1", "::ffff:127.0.0.1", "::ffff:10.0.0.1"])("blocks %s", (ip) => {
    expect(isBlockedIp(ip)).toBe(true);
  });
  it.each(["8.8.8.8", "172.32.0.1", "1.1.1.1", "2606:4700:4700::1111", "::ffff:8.8.8.8"])("allows %s", (ip) => {
    expect(isBlockedIp(ip)).toBe(false);
  });
});

describe("assertPublicUrl", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("refuses private literals, local names and non-http", async () => {
    await expect(assertPublicUrl("http://169.254.169.254/latest/meta-data/")).rejects.toThrow(/non-public address/);
    await expect(assertPublicUrl("http://[::1]:8080/")).rejects.toThrow(/non-public/);
    await expect(assertPublicUrl("http://localhost:3000/")).rejects.toThrow(/local\/internal hostname/);
    await expect(assertPublicUrl("http://db.internal/")).rejects.toThrow(/local\/internal/);
    await expect(assertPublicUrl("file:///etc/passwd")).rejects.toThrow(/only http/);
  });
  it("can be overridden for local testing", async () => {
    vi.stubEnv("MARKETING_EXPERT_ALLOW_PRIVATE", "1");
    await expect(assertPublicUrl("http://127.0.0.1/")).resolves.toBeUndefined();
  });
});

describe("guardedFetch", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });
  it("re-checks every redirect hop", async () => {
    // First hop is a public literal IP; it redirects to the metadata address.
    vi.stubGlobal("fetch", async () => new Response("", { status: 302, headers: { location: "http://169.254.169.254/" } }));
    await expect(guardedFetch("http://8.8.8.8/")).rejects.toThrow(/169.254.169.254/);
  });
  it("follows public redirects and sets the final url", async () => {
    let n = 0;
    vi.stubGlobal("fetch", async () => (n++ === 0 ? new Response("", { status: 301, headers: { location: "http://1.1.1.1/b" } }) : new Response("ok", { status: 200 })));
    const r = await guardedFetch("http://8.8.8.8/a");
    expect(r.status).toBe(200);
    expect(r.url).toBe("http://1.1.1.1/b");
  });
});
