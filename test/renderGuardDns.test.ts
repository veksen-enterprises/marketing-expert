// Render mode with the real address guard (resolvePublic, isBlockedIp): only DNS answers and the proxy's final
// connect are faked, so bracketed IPv6 hosts, names that resolve to private addresses and DNS rebinding are
// tested end to end. Runs only where a Chromium binary is configured (MARKETING_EXPERT_CHROMIUM).
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { createServer, type Server } from "node:http";
import { existsSync } from "node:fs";
import { renderAndAudit } from "../src/lib/pageAudit.js";

// site.test resolves to a public documentation address, which the faked connect sends to the local test server.
// private.test resolves to 127.0.0.1. rebind.test resolves to the public address once, then to 127.0.0.1.
const dns = vi.hoisted(() => ({ PUBLIC: "203.0.113.10", lookups: new Map<string, number>() }));

vi.mock("node:dns/promises", async (importOriginal) => {
  const real = await importOriginal<typeof import("node:dns/promises")>();
  const lookup = async (host: string, opts?: { all?: boolean }) => {
    const n = (dns.lookups.get(host) ?? 0) + 1;
    dns.lookups.set(host, n);
    const address = host === "site.test" || (host === "rebind.test" && n === 1) ? dns.PUBLIC : host === "private.test" || host === "rebind.test" ? "127.0.0.1" : null;
    if (!address) throw Object.assign(new Error(`getaddrinfo ENOTFOUND ${host}`), { code: "ENOTFOUND" });
    return opts?.all ? [{ address, family: 4 }] : { address, family: 4 };
  };
  return { ...real, lookup, default: { ...real, lookup } };
});

vi.mock("node:net", async (importOriginal) => {
  const real = await importOriginal<typeof import("node:net")>();
  type Cb = (err: Error | null, address: unknown, family?: number) => void;
  const local = (a: string) => (a === dns.PUBLIC ? "127.0.0.1" : a);
  // The proxy connects with a lookup that returns the checked addresses; only the public one is redirected.
  const connect = (opts: { lookup: (h: string, o: object, cb: Cb) => void }) =>
    real.connect({
      ...opts,
      lookup: (h: string, o: object, cb: Cb) =>
        opts.lookup(h, o, (err, a, f) => cb(err, Array.isArray(a) ? a.map((x) => ({ ...x, address: local(x.address) })) : local(a as string), f)),
    } as never);
  return { ...real, connect, default: { ...real, connect } };
});

const chrome = process.env.MARKETING_EXPERT_CHROMIUM;
const enabled = !!chrome && existsSync(chrome);

describe.skipIf(!enabled)("render mode address guard with real address checks", () => {
  let server: Server;
  let port = 0;
  const hits: string[] = [];
  const otherHosts = () => hits.filter((h) => !h.startsWith("site.test:"));

  beforeAll(async () => {
    vi.stubEnv("MARKETING_EXPERT_ALLOW_PRIVATE", "0");
    server = createServer((req, res) => {
      hits.push(`${req.headers.host}${req.url}`);
      const redirect = (to: string) => {
        res.writeHead(302, { location: to });
        res.end();
      };
      if (req.url === "/to-mapped") return redirect(`http://[::ffff:127.0.0.1]:${port}/secret`);
      if (req.url === "/to-private-name") return redirect(`http://private.test:${port}/secret`);
      res.writeHead(200, { "content-type": "text/html" });
      res.end(`<!doctype html><html><head><title>${req.url === "/secret" ? "SECRET" : "Page"}</title></head><body><h1>Hello there</h1></body></html>`);
    });
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", () => r()));
    const addr = server.address();
    port = typeof addr === "object" && addr ? addr.port : 0;
  });
  afterAll(() => {
    vi.unstubAllEnvs();
    server.closeAllConnections();
    server.close();
  });

  it("renders a page whose name resolves to a public address", async () => {
    const r = await renderAndAudit(`http://site.test:${port}/`);
    expect(r.h1s).toEqual(["Hello there"]);
    expect(r.status).toBe(200);
  }, 60000);

  it("refuses a redirect to an IPv4-mapped IPv6 loopback address", async () => {
    hits.length = 0;
    await expect(renderAndAudit(`http://site.test:${port}/to-mapped`)).rejects.toThrow(/non-public address/);
    expect(hits).toEqual([`site.test:${port}/to-mapped`]);
  }, 60000);

  it("refuses a redirect to a name that resolves to 127.0.0.1", async () => {
    hits.length = 0;
    await expect(renderAndAudit(`http://site.test:${port}/to-private-name`)).rejects.toThrow(/private\.test: resolves to non-public address 127\.0\.0\.1/);
    expect(otherHosts()).toEqual([]);
  }, 60000);

  it("refuses a start URL whose DNS answer changes to a private address after the first check", async () => {
    hits.length = 0;
    dns.lookups.delete("rebind.test");
    await expect(renderAndAudit(`http://rebind.test:${port}/`)).rejects.toThrow(/rebind\.test: resolves to non-public address 127\.0\.0\.1/);
    expect(dns.lookups.get("rebind.test")).toBeGreaterThan(1);
    expect(hits).toEqual([]);
  }, 60000);
});
