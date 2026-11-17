import { describe, it, expect, afterAll } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "../src/server.js";
import { installKind, readBuildInfo } from "../src/lib/version.js";

// The Claude Code plugin runs bundle/index.js, committed with the source. A bundle left behind after a source change
// would ship old code to every plugin user, so rebuild it and compare byte for byte.
describe("bundle/", () => {
  const fresh = mkdtempSync(join(tmpdir(), "me-bundle-"));
  afterAll(() => rmSync(fresh, { recursive: true, force: true }));

  it("matches the source: run `npm run bundle` and commit bundle/ when this fails", () => {
    execFileSync(process.execPath, ["scripts/bundle.mjs", fresh], { stdio: "ignore" });
    const files = readdirSync(fresh).sort();
    expect(readdirSync("bundle").sort()).toEqual(files);
    for (const f of files) expect(readFileSync(join("bundle", f), "utf8") === readFileSync(join(fresh, f), "utf8"), f).toBe(true);
  });

  it("reads its own build info and knows it is the plugin's bundle", () => {
    expect(readBuildInfo("bundle/build-info.json").bundle).toMatch(/^[0-9a-f]{64}$/);
    expect(installKind(join(process.cwd(), "bundle"))).toBe("bundle");
  });

  it("serves the same instructions, tools and prompts as the source, and finds the playbooks", async () => {
    const [a, b] = InMemoryTransport.createLinkedPair();
    const src = new Client({ name: "t", version: "0" });
    await Promise.all([createServer().connect(a), src.connect(b)]);
    const bundled = new Client({ name: "t", version: "0" });
    await bundled.connect(new StdioClientTransport({ command: process.execPath, args: ["bundle/index.js"], env: { ...(process.env as Record<string, string>), MARKETING_EXPERT_UPDATE_CHECK: "0" }, stderr: "ignore" }));
    try {
      const names = async (c: Client) => [(await c.listTools()).tools.map((t) => t.name), (await c.listPrompts()).prompts.map((p) => p.name)];
      expect(await names(bundled)).toEqual(await names(src));
      expect(bundled.getInstructions()).toBe(src.getInstructions());
      const book = await bundled.callTool({ name: "get_playbook", arguments: { slug: "pricing" } });
      expect(JSON.parse((book.content as Array<{ text: string }>)[0].text).title).toBe("Pricing and packaging");
    } finally {
      await bundled.close();
      await src.close();
    }
  });
});
