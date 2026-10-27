#!/usr/bin/env node
/**
 * Hosted marketing-expert over Streamable HTTP, behind a bearer token.
 * Leaves out scan_source and verify_quotes (see createServer's `hosted`), which read directories on the host.
 *
 *   MARKETING_EXPERT_TOKEN=<at least 24 chars> PORT=3000 node dist/http.js
 *
 * GET /healthz answers "ok" without a token. Everything under /mcp needs `Authorization: Bearer <token>`.
 * Stateless: each POST gets its own server and transport, so no session survives between requests.
 */
import { createServer as createHttpServer, type IncomingMessage, type ServerResponse } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "./server.js";
import { readBuildInfo, UpdateCheck } from "./lib/version.js";

const MAX_BODY = 1_000_000;

export function startHttp(opts: { token: string; port: number; host?: string }) {
  // One check shared by every request, so GitHub is asked at most once an hour, not once per call.
  const updates = new UpdateCheck(readBuildInfo());
  const expected = Buffer.from(`Bearer ${opts.token}`);
  const authorised = (h: string | undefined) => !!h && h.length === expected.length && timingSafeEqual(Buffer.from(h), expected);

  const server = createHttpServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");
      if (url.pathname === "/healthz") return void res.writeHead(200, { "content-type": "text/plain" }).end("ok");
      if (url.pathname !== "/mcp") return void res.writeHead(404).end();
      if (!authorised(req.headers.authorization)) return void res.writeHead(401, { "www-authenticate": 'Bearer realm="marketing-expert"' }).end();
      // Stateless mode has no stream to resume and no session to end.
      if (req.method !== "POST") return void res.writeHead(405, { allow: "POST" }).end();
      const chunks: Buffer[] = [];
      let size = 0;
      for await (const c of req) {
        size += (c as Buffer).length;
        if (size > MAX_BODY) return void res.writeHead(413).end();
        chunks.push(c as Buffer);
      }
      let body: unknown;
      try {
        body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      } catch {
        return void res.writeHead(400, { "content-type": "application/json" }).end(JSON.stringify({ jsonrpc: "2.0", error: { code: -32700, message: "Parse error" }, id: null }));
      }
      const mcp = createServer({ updates, hosted: true });
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
      res.on("close", () => void transport.close().then(() => mcp.close()));
      await mcp.connect(transport);
      await transport.handleRequest(req, res, body);
    } catch (e) {
      console.error("[marketing-expert http]", e instanceof Error ? e.message : e);
      if (!res.headersSent) res.writeHead(500);
      res.end();
    }
  });
  return new Promise<{ port: number; close: () => Promise<void> }>((resolve) =>
    server.listen(opts.port, opts.host ?? "0.0.0.0", () => {
      const addr = server.address();
      resolve({ port: typeof addr === "object" && addr ? addr.port : opts.port, close: () => new Promise<void>((r) => server.close(() => r())) });
    }),
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const token = process.env.MARKETING_EXPERT_TOKEN ?? "";
  // Refuse to start unconfigured: an endpoint without a token would be open to anyone with the URL.
  if (token.length < 24) {
    console.error("MARKETING_EXPERT_TOKEN must be set to at least 24 characters.");
    process.exit(1);
  }
  startHttp({ token, port: Number(process.env.PORT ?? 3000) }).then(({ port }) => console.error(`[marketing-expert http] listening on :${port}`));
}
