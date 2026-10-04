import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Exercises the built server over real stdio. Run `npm run build` first.
const built = existsSync("dist/index.js");

describe.skipIf(!built)("MCP server over stdio", () => {
  const client = new Client({ name: "test", version: "0.0.0" });
  beforeAll(async () => {
    await client.connect(new StdioClientTransport({
        command: process.execPath,
        args: ["dist/index.js"],
        env: { ...(process.env as Record<string, string>), MARKETING_EXPERT_DATA_DIR: mkdtempSync(join(tmpdir(), "me-e2e-")) },
      }));
  });
  afterAll(async () => client.close());

  const call = async (name: string, args: Record<string, unknown>) => {
    const r = await client.callTool({ name, arguments: args });
    const text = (r.content as Array<{ text: string }>)[0].text;
    return { isError: r.isError, text, json: r.isError ? null : JSON.parse(text) };
  };

  it("advertises instructions, tools, prompts, resources", async () => {
    expect(client.getInstructions()).toMatch(/Diagnose before prescribing/);
    const tools = (await client.listTools()).tools.map((t) => t.name).sort();
    expect(tools).toEqual([
      "ab_test_evaluate", "ab_test_means_evaluate", "ab_test_means_sample_size", "ab_test_sample_size", "ab_test_sequential", "analyze_copy",
      "audit_page", "build_utm_link", "check_ai_crawler_access", "check_copy_limits", "crawl_site", "funnel_analysis", "get_business_profile", "get_playbook",
      "list_business_profiles", "market_size", "paid_media_math", "save_business_profile", "search_playbooks", "unit_economics",
    ]);
    const prompts = (await client.listPrompts()).prompts.map((p) => p.name);
    expect(prompts).toContain("landing_page_teardown");
    const resources = (await client.listResources()).resources;
    expect(resources.length).toBeGreaterThanOrEqual(13);
    const r = await client.readResource({ uri: "marketing://playbook/pricing" });
    expect((r.contents[0] as { text: string }).text).toMatch(/^# Pricing/);
  });

  it("runs calculators", async () => {
    const s = await call("ab_test_sample_size", { baselineRate: 0.02, mde: 0.1, dailyTrafficTotal: 500 });
    expect(s.json.perArm).toBeGreaterThan(70000);
    expect(s.json.notes.join(" ")).toMatch(/4 weeks/);
    const e = await call("ab_test_evaluate", { control: { visitors: 10000, conversions: 300 }, variant: { visitors: 9000, conversions: 330 } });
    expect(e.json.srm.mismatch).toBe(true);
    expect(e.json.warnings[0]).toMatch(/Sample ratio mismatch/);
  });

  it("returns tool errors, not crashes", async () => {
    const r = await call("unit_economics", { arpaMonthly: 100, grossMargin: 0.8, monthlyChurn: 0.02 });
    expect(r.isError).toBe(true);
    expect(r.text).toMatch(/provide cac/);
    const p = await call("get_playbook", { slug: "nope" });
    expect(p.isError).toBe(true);
  });

  it("saves and reads a business profile", async () => {
    const s = await call("save_business_profile", { name: "acme", product: "x", metrics: { mrr: { value: 100, asOf: "2026-09" } } });
    expect(s.json.saved.metrics.mrr.value).toBe(100);
    const g = await call("get_business_profile", { name: "acme" });
    expect(g.json.missingFields).toContain("bestFitCustomers");
    expect((await call("list_business_profiles", {})).json).toHaveLength(1);
    const r = await client.readResource({ uri: "marketing://profile/acme" });
    expect((r.contents[0] as { text: string }).text).toMatch(/"product": "x"/);
  });

  it("audits raw html and renders prompts", async () => {
    const a = await call("audit_page", { html: "<html><head><title>x</title></head><body><h1>Hi</h1></body></html>" });
    expect(a.json.h1s).toEqual(["Hi"]);
    const p = await client.getPrompt({ name: "experiment_plan", arguments: { idea: "new headline" } });
    expect((p.messages[0].content as { text: string }).text).toMatch(/ab_test_sample_size/);
  });
});
