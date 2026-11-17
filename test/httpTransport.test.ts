import { describe, it, expect, afterAll } from "vitest";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { brotliCompressSync, deflateRawSync, deflateSync, gzipSync } from "node:zlib";
import { httpTransport, readCapped } from "../src/lib/netguard.js";

// The page tools' real transport (setup.ts routes to it whenever fetch isn't stubbed).
const seen: IncomingMessage[] = [];
const routes: Record<string, (q: IncomingMessage, s: ServerResponse) => void> = {
  "/gzip": (_q, s) => s.writeHead(200, { "content-encoding": "gzip", "content-type": "text/html" }).end(gzipSync("hello gzip")),
  "/deflate": (_q, s) => s.writeHead(200, { "content-encoding": "deflate" }).end(deflateSync("hello deflate")),
  "/br": (_q, s) => s.writeHead(200, { "content-encoding": "br" }).end(brotliCompressSync("hello br")),
  "/unknown": (_q, s) => s.writeHead(200, { "content-encoding": "compress" }).end("raw bytes"),
  "/redirect": (_q, s) => s.writeHead(301, { location: "/gzip" }).end(),
  "/empty": (_q, s) => s.writeHead(204).end(),
  "/two": (_q, s) => s.writeHead(200, [["x-a", "1"], ["x-a", "2"]]).end("ok"),
  "/slow": () => undefined,
  "/raw-deflate": (_q, s) => s.writeHead(200, { "content-encoding": "deflate" }).end(deflateRawSync("hello raw deflate")),
  "/bad-gzip": (_q, s) => s.writeHead(200, { "content-encoding": "gzip" }).end("not gzip at all"),
  "/cut": (q, s) => {
    s.writeHead(200, { "content-length": "100" }).write("only part");
    setTimeout(() => q.socket.destroy(), 50);
  },
  "/trickle": (q, s) => {
    s.writeHead(200).write("x");
    const t = setInterval(() => s.write("x"), 50);
    q.socket.on("close", () => clearInterval(t));
  },
};
const server = createServer((q, s) => {
  seen.push(q);
  (routes[q.url ?? ""] ?? ((_q: IncomingMessage, r: ServerResponse) => r.writeHead(404).end()))(q, s);
});
const port = await new Promise<number>((r) => server.listen(0, "127.0.0.1", () => r((server.address() as { port: number }).port)));
afterAll(() => server.close());
const local = [{ address: "127.0.0.1", family: 4 }];
const get = (path: string, host = "127.0.0.1", init = {}) => httpTransport(new URL(`http://${host}:${port}${path}`), init, local);
const text = async (path: string) => (await readCapped(await get(path), 1000)).text;

describe("httpTransport", () => {
  it("decodes gzip, deflate and br, and passes an unknown encoding through", async () => {
    expect(await text("/gzip")).toBe("hello gzip");
    expect(await text("/deflate")).toBe("hello deflate");
    expect(await text("/br")).toBe("hello br");
    expect(await text("/unknown")).toBe("raw bytes");
  });

  it("decodes raw deflate (no zlib header) as fetch() does", async () => {
    expect(await text("/raw-deflate")).toBe("hello raw deflate");
  });

  // A failed body read must say why: the tools put the message in their output ("body download failed: ...").
  it("fails a body read like fetch: the timeout's reason, or TypeError 'terminated' with the cause", async () => {
    const slow = await get("/trickle", "127.0.0.1", { signal: AbortSignal.timeout(300) });
    const t = await readCapped(slow, 1e6).catch((x) => x);
    expect([t.name, t.message]).toEqual(["TimeoutError", "The operation was aborted due to timeout"]);
    for (const path of ["/bad-gzip", "/cut"]) {
      const e = await readCapped(await get(path), 1000).catch((x) => x);
      expect(e).toBeInstanceOf(TypeError);
      expect(e.message).toBe("terminated");
      expect(e.cause).toBeInstanceOf(Error);
    }
  });

  it("refuses a URL with credentials, as fetch() does, instead of sending them", async () => {
    const before = seen.length;
    const e = await get("/gzip", "user:pw@127.0.0.1").catch((x) => x);
    expect(e).toBeInstanceOf(TypeError);
    expect(seen.length).toBe(before);
  });

  it("connects only to the checked address, whatever the name resolves to", async () => {
    // .invalid never resolves; the request reaches the server because the transport uses the given address.
    const r = await get("/gzip", "rebind.invalid");
    expect(r.status).toBe(200);
    expect(seen.at(-1)?.headers.host).toBe(`rebind.invalid:${port}`);
  });

  it("sends the caller's headers and asks for compressed bodies", async () => {
    await get("/gzip", "127.0.0.1", { headers: { "User-Agent": "test-agent" } });
    expect(seen.at(-1)?.headers["user-agent"]).toBe("test-agent");
    expect(seen.at(-1)?.headers["accept-encoding"]).toBe("gzip, deflate, br");
    // fetch() sent these when the caller didn't; some firewalls answer differently without them.
    expect([seen.at(-1)?.headers.accept, seen.at(-1)?.headers["accept-language"]]).toEqual(["*/*", "*"]);
    await get("/gzip", "127.0.0.1", { headers: { Accept: "text/html" } });
    expect(seen.at(-1)?.headers.accept).toBe("text/html");
  });

  it("does not follow a redirect, has no body for 204, and joins repeated headers", async () => {
    const r = await get("/redirect");
    expect([r.status, r.ok, r.headers.get("Location")]).toEqual([301, false, "/gzip"]);
    expect((await get("/empty")).body).toBeNull();
    expect((await get("/two")).headers.get("x-a")).toBe("1, 2");
    expect((await get("/two")).headers.get("x-missing")).toBeNull();
  });

  it("fails like fetch: TypeError 'fetch failed' with the network error as cause", async () => {
    const closed = createServer();
    const p = await new Promise<number>((r) => closed.listen(0, "127.0.0.1", () => r((closed.address() as { port: number }).port)));
    closed.close();
    const e = await httpTransport(new URL(`http://127.0.0.1:${p}/`), {}, local).catch((x) => x);
    expect(e).toBeInstanceOf(TypeError);
    expect(e.message).toBe("fetch failed");
    expect((e.cause as NodeJS.ErrnoException).code).toBe("ECONNREFUSED");
  });

  it("refuses the ports fetch() refuses, with fetch's message", async () => {
    for (const p of [1, 22, 25, 6667]) {
      const e = await httpTransport(new URL(`http://127.0.0.1:${p}/`), {}, local).catch((x) => x);
      expect([e.message, e.cause?.message]).toEqual(["fetch failed", "bad port"]);
    }
  });

  it("gives up when the signal times out", async () => {
    const e = await get("/slow", "127.0.0.1", { signal: AbortSignal.timeout(200) }).catch((x) => x);
    expect(e.name).toBe("TimeoutError");
  });
});
