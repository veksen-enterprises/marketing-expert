// Render mode must apply the address guard to every connection Chromium makes, not only to the
// requests page.route sees: redirects, WebSockets and service workers included.
// Runs only where a Chromium binary is configured (MARKETING_EXPERT_CHROMIUM).
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { createServer, type Server } from "node:http";
import { createSocket, type Socket as UdpSocket } from "node:dgram";
import { existsSync } from "node:fs";
import { renderAndAudit } from "../src/lib/pageAudit.js";

// In this file "localhost" stands for a public site and the literal 127.0.0.1 for a private address.
// Both reach the same test server, which records the Host header of every request it gets.
vi.mock("../src/lib/netguard.js", async (importOriginal) => {
  const real = await importOriginal<typeof import("../src/lib/netguard.js")>();
  const check = (host: string) => {
    if (host.replace(/^\[|\]$/g, "") !== "localhost") throw new real.BlockedAddressError(`refusing to fetch ${host}: resolves to non-public address ${host}`);
  };
  return {
    ...real,
    privateAllowed: () => false,
    assertPublicUrl: async (url: string | URL) => check(new URL(url).hostname),
    resolvePublic: async (host: string) => {
      check(host);
      return [{ address: "127.0.0.1", family: 4 }];
    },
  };
});

const chrome = process.env.MARKETING_EXPERT_CHROMIUM;
const enabled = !!chrome && existsSync(chrome);

describe.skipIf(!enabled)("render mode address guard", () => {
  let server: Server;
  let port = 0;
  let udp: UdpSocket;
  let udpPort = 0;
  const datagrams: string[] = [];
  const hits: string[] = [];
  const privateHits = () => hits.filter((h) => /^(ws )?127\.0\.0\.1/.test(h));
  const html = (body: string) => `<!doctype html><html><head><title>Page</title></head><body><h1>Hello there</h1>${body}</body></html>`;

  beforeAll(async () => {
    server = createServer((req, res) => {
      hits.push(`${req.headers.host}${req.url}`);
      const priv = `http://127.0.0.1:${port}`;
      const send = (body: string, type = "text/html") => {
        res.writeHead(200, { "content-type": type, "access-control-allow-origin": "*" });
        res.end(body);
      };
      if (req.url === "/redirect") {
        res.writeHead(302, { location: `${priv}/secret` });
        return res.end();
      }
      if (req.url === "/secret") return send(`<html><head><title>SECRET</title></head><body><h1>internal</h1></body></html>`);
      if (req.url === "/sub-redirect") {
        res.writeHead(302, { location: `${priv}/secret-data` });
        return res.end();
      }
      if (req.url === "/secret-data") return send("SECRET DATA", "text/plain");
      if (req.url === "/sub") return send(html(`<p id="out">waiting</p><script>fetch("/sub-redirect").then((r) => r.text()).then((t) => (document.getElementById("out").textContent = t), () => (document.getElementById("out").textContent = "failed"));</script>`));
      if (req.url === "/ws") return send(html(`<script>new WebSocket("ws://127.0.0.1:${port}/socket"); new WebSocket("ws://localhost:${port}/socket-ok");</script>`));
      if (req.url === "/sw") return send(html(`<script>navigator.serviceWorker && navigator.serviceWorker.register("/sw.js").catch(() => {});</script>`));
      if (req.url === "/hang") return; // never answers
      if (req.url === "/slow") return send(html(`<img src="${priv}/pixel.png"><img src="/hang">`));
      if (req.url === "/webrtc") {
        return send(html(`<script>const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:127.0.0.1:${udpPort}" }] }); pc.createDataChannel("x"); pc.createOffer().then((o) => pc.setLocalDescription(o));</script>`));
      }
      if (req.url === "/sw.js") return send(`self.addEventListener("install", (e) => e.waitUntil(fetch("${priv}/from-worker", { mode: "no-cors" }).catch(() => {})));`, "text/javascript");
      send(html("<p>Plain page</p>"));
    });
    server.on("upgrade", (req, socket) => {
      hits.push(`ws ${req.headers.host}${req.url}`);
      socket.destroy();
    });
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", () => r()));
    const addr = server.address();
    port = typeof addr === "object" && addr ? addr.port : 0;
    udp = createSocket("udp4").on("message", (_m, from) => datagrams.push(`${from.address}:${from.port}`));
    await new Promise<void>((r) => udp.bind(0, "127.0.0.1", () => r()));
    udpPort = udp.address().port;
  });
  afterAll(() => {
    server.closeAllConnections();
    server.close();
    udp.close();
  });

  it("renders an allowed page through the guard", async () => {
    const r = await renderAndAudit(`http://localhost:${port}/`);
    expect(r.h1s).toEqual(["Hello there"]);
    expect(r.status).toBe(200);
  }, 60000);

  it("refuses a navigation that redirects to a private address", async () => {
    hits.length = 0;
    await expect(renderAndAudit(`http://localhost:${port}/redirect`)).rejects.toThrow(/non-public address/);
    expect(privateHits()).toEqual([]);
  }, 60000);

  it("blocks a page request that redirects to a private address", async () => {
    hits.length = 0;
    const r = await renderAndAudit(`http://localhost:${port}/sub`);
    expect(r.leadText).not.toMatch(/SECRET/);
    expect(privateHits()).toEqual([]);
    expect(r.flags.map((f) => f.message).join("\n")).toMatch(/tried to reach private or local network addresses.*non-public address/);
  }, 60000);

  it("blocks WebSockets to a private address and lets others through", async () => {
    hits.length = 0;
    await renderAndAudit(`http://localhost:${port}/ws`);
    expect(privateHits()).toEqual([]);
    expect(hits).toContain(`ws localhost:${port}/socket-ok`);
  }, 60000);

  it("reports a navigation timeout as a timeout when only a subresource was blocked", async () => {
    const err = await renderAndAudit(`http://localhost:${port}/slow`, 3000).then(
      () => null,
      (e: Error) => e
    );
    expect(err?.message).toMatch(/Timeout/);
    expect(err?.message).not.toMatch(/non-public/);
  }, 60000);

  it("says why the connection failed when the page's server refuses it", async () => {
    const closed = createServer();
    await new Promise<void>((r) => closed.listen(0, "127.0.0.1", () => r()));
    const addr = closed.address();
    const closedPort = typeof addr === "object" && addr ? addr.port : 0;
    await new Promise((r) => closed.close(r));
    await expect(renderAndAudit(`http://localhost:${closedPort}/`)).rejects.toThrow(/ECONNREFUSED/);
    await expect(renderAndAudit(`https://localhost:${closedPort}/`)).rejects.toThrow(/ECONNREFUSED/);
  }, 60000);

  it("keeps WebRTC from sending UDP around the guard", async () => {
    datagrams.length = 0;
    await renderAndAudit(`http://localhost:${port}/webrtc`);
    expect(datagrams).toEqual([]);
  }, 60000);

  it("blocks service workers", async () => {
    hits.length = 0;
    await renderAndAudit(`http://localhost:${port}/sw`);
    expect(hits.filter((h) => h.endsWith("/sw.js") || h.endsWith("/from-worker"))).toEqual([]);
  }, 60000);
});
