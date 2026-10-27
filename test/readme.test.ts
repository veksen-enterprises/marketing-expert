// Keeps README.md true: every tool and prompt it names exists and every one the server registers is listed,
// it states no counts that nothing checks, and the example's calculator line is what the tool returns today.
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const readme = readFileSync("README.md", "utf8");
const server = readFileSync("src/server.ts", "utf8");
const prompts = readFileSync("src/prompts.ts", "utf8");
const tools = new Set([...server.matchAll(/registerTool\(\s*"([a-z_]+)"/g)].map((m) => m[1]));
const promptNames = new Set([...prompts.matchAll(/registerPrompt\(\s*"([a-z_]+)"/g)].map((m) => m[1]));
const named = new Set([...readme.matchAll(/`([a-z]+(?:_[a-z]+)+)`/g)].map((m) => m[1]));

describe("README names", () => {
  it("names only tools and prompts that exist", () => {
    expect([...named].filter((n) => !tools.has(n) && !promptNames.has(n))).toEqual([]);
  });
  it("lists every tool and prompt the server registers", () => {
    expect([...tools, ...promptNames].filter((n) => !named.has(n))).toEqual([]);
  });
  it("states no counts of playbooks, notes, bets, tools or prompts", () => {
    // These drifted before (40 small bets when there were 47, 51 research notes when there were 58).
    const counts = [...readme.matchAll(/\b\d[\d,]*\s+(?:sourced\s+)?(?:playbooks|research notes|files|cheap marketing moves|small bets|tools|prompts|cases)\b/gi)].map((m) => m[0]);
    expect(counts).toEqual([]);
  });
});

describe.skipIf(!existsSync("dist/index.js"))("README example", () => {
  const client = new Client({ name: "readme-test", version: "0.0.0" });
  beforeAll(async () => {
    await client.connect(new StdioClientTransport({
      command: process.execPath,
      args: ["dist/index.js"],
      env: { ...(process.env as Record<string, string>), MARKETING_EXPERT_DATA_DIR: mkdtempSync(join(tmpdir(), "me-readme-")) },
    }));
  });
  afterAll(async () => client.close());

  const sampleSize = async (mde: number) => {
    const r = await client.callTool({ name: "ab_test_sample_size", arguments: { baselineRate: 0.025, mde, dailyTrafficTotal: 3000 } });
    return JSON.parse((r.content as Array<{ text: string }>)[0].text);
  };

  it("quotes the calculator line exactly, and the numbers the answer and the check step use", async () => {
    const ten = await sampleSize(0.1);
    expect(readme).toContain(ten.citeAs);
    expect(readme).toContain("64,199 per arm, 128,398 total, 43 days");
    expect(ten.notes.join(" ")).toMatch(/plan 7 week/);
    expect(ten.notes.join(" ")).toMatch(/5 looks give about 14% false positives/);
    const twenty = await sampleSize(0.2);
    expect([twenty.perArm, twenty.estimatedDays]).toEqual([16792, 12]);
    expect(readme).toContain("16,792 visitors per version, 12 days");
  });
});
