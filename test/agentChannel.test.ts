// Round-6 finding: 2 of 3 strategy runs for a product that ships an MCP server ignored coding agents as a channel.
// scan_source now reports the MCP server, and check_answer requires an agent-channel line when told to.
import { describe, it, expect } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { scanSource } from "../src/lib/sourceScan.js";
import { checkAnswer } from "../src/lib/answerCheck.js";

function repo(files: Record<string, string>) {
  const d = mkdtempSync(join(tmpdir(), "mcp-"));
  for (const [p, body] of Object.entries(files)) {
    mkdirSync(join(d, p, ".."), { recursive: true });
    writeFileSync(join(d, p), body);
  }
  return d;
}

describe("scan_source: MCP server", () => {
  it("finds the MCP SDK in package.json and a tool registration in code", () => {
    const d = repo({
      "package.json": JSON.stringify({ name: "x", dependencies: { "@modelcontextprotocol/sdk": "^1.0.0" } }),
      "src/server.ts": 'import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";\nserver.registerTool("analyze", {}, run);\n',
    });
    const r = scanSource(d);
    expect(r.mcpServer).toMatchObject({ file: "package.json" });
    expect(r.mcpServer!.tools).toBe(1);
    expect(r.notes.join("\n")).toMatch(/ships an MCP server.*agentChannel/s);
  });
  it("finds an MCP server in a sub-package of a monorepo", () => {
    const d = repo({ "packages/mcp/package.json": JSON.stringify({ dependencies: { fastmcp: "1.0.0" } }), "packages/mcp/index.ts": "export {};\n" });
    expect(scanSource(d).mcpServer).toMatchObject({ file: "packages/mcp/package.json" });
  });
  it("reports null when there is none, and does not count a page that only mentions MCP", () => {
    const d = repo({ "package.json": JSON.stringify({ dependencies: { react: "19" } }), "pages/index.md": "Our MCP server is coming soon.\n" });
    const r = scanSource(d);
    expect(r.mcpServer).toBeNull();
    expect(r.notes.join("\n")).not.toMatch(/ships an MCP server/);
  });
});

describe("check_answer: agent channel", () => {
  const base = "Open questions: who pays? I'm wrong if trials don't convert. Shall I save this as your business profile?";
  it("is not required by default", () => {
    expect(checkAnswer(base).missingParts).toEqual([]);
  });
  it("is required when agentChannel is set", () => {
    const r = checkAnswer(base, undefined, "answer", { agentChannel: true });
    expect(r.missingParts.join(" ")).toMatch(/agent channel/);
  });
  it("accepts a line on how coding agents find and choose the tool", () => {
    for (const line of [
      "Coding agents are a channel: list the server in the MCP Registry.",
      "Rewrite the tool descriptions so agents pick it for slow-query questions.",
      "Agents choose tools by reading their descriptions, so test that Claude Code finds it.",
    ]) {
      expect(checkAnswer(`${base} ${line}`, undefined, "answer", { agentChannel: true }).missingParts, line).toEqual([]);
    }
  });
  it("does not count a passing mention of AI", () => {
    expect(checkAnswer(`${base} AI is changing how people write SQL.`, undefined, "answer", { agentChannel: true }).missingParts.join(" ")).toMatch(/agent channel/);
  });
});
