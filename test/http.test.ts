import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { startHttp } from "../src/http.js";

const TOKEN = "t".repeat(32);
const rpc = (id: number, method: string, params: object = {}) => JSON.stringify({ jsonrpc: "2.0", id, method, params });
const INIT = { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0" } };

describe("hosted endpoint (src/http.ts)", () => {
  let base = "";
  let close: () => Promise<void>;
  beforeAll(async () => {
    process.env.MARKETING_EXPERT_UPDATE_CHECK = "0";
    process.env.MARKETING_EXPERT_DATA_DIR = mkdtempSync(join(tmpdir(), "me-http-"));
    const s = await startHttp({ token: TOKEN, port: 0, host: "127.0.0.1" });
    base = `http://127.0.0.1:${s.port}`;
    close = s.close;
  });
  afterAll(async () => close?.());

  const post = (body: string, auth = `Bearer ${TOKEN}`) =>
    fetch(`${base}/mcp`, { method: "POST", headers: { authorization: auth, "content-type": "application/json", accept: "application/json, text/event-stream" }, body });

  it("answers /healthz without a token", async () => {
    const r = await fetch(`${base}/healthz`);
    expect([r.status, await r.text()]).toEqual([200, "ok"]);
  });

  it("refuses /mcp without the right token", async () => {
    expect((await post(rpc(1, "initialize", INIT), "")).status).toBe(401);
    expect((await post(rpc(1, "initialize", INIT), `Bearer ${"x".repeat(32)}`)).status).toBe(401);
  });

  it("leaves out the tools that read the host's directories", async () => {
    const init = await (await post(rpc(1, "initialize", INIT))).json();
    expect(init.result.serverInfo.name).toBe("marketing-expert");
    expect(init.result.instructions).toMatch(/hosted endpoint/);
    const tools = await (await post(rpc(2, "tools/list"))).json();
    const names = tools.result.tools.map((t: { name: string }) => t.name);
    expect(names).not.toContain("scan_source");
    expect(names).not.toContain("verify_quotes");
    expect(names).toContain("search_playbooks");
    const hit = await (await post(rpc(3, "tools/call", { name: "ab_test_sample_size", arguments: { baselineRate: 0.05, mde: 0.2 } }))).json();
    expect(hit.result.isError).toBeFalsy();
  });

  it("rejects a body over 1 MB and a GET", async () => {
    expect((await post("x".repeat(1_000_001))).status).toBe(413);
    expect((await fetch(`${base}/mcp`, { headers: { authorization: `Bearer ${TOKEN}` } })).status).toBe(405);
  });
});
