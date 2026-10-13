// Regression tests for the second review of the calculator package. Each test failed before its fix.
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";
import { twoProportionTest } from "../src/lib/stats.js";
import { sequentialTest } from "../src/lib/sequential.js";
import { paidMediaMath, unitEconomics } from "../src/lib/economics.js";

const connect = async () => {
  const [a, b] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "t", version: "0" });
  await Promise.all([createServer().connect(a), client.connect(b)]);
  return async (name: string, args: Record<string, unknown>) => {
    const r = await client.callTool({ name, arguments: args });
    const text = (r.content as Array<{ text: string }>)[0].text;
    return { isError: !!r.isError, text, json: r.isError ? null : JSON.parse(text) };
  };
};

describe("sequential: interval and decision agree", () => {
  it("CI excludes 0 exactly when the test stops, once each arm has enough data", () => {
    const bad: string[] = [];
    for (const [n, step] of [[50, 1], [200, 5], [1000, 30]] as const) {
      for (let c = 10; c <= n - 10; c += step) {
        for (let v = 10; v <= n - 10; v += step) {
          const r = sequentialTest({ visitors: n, conversions: c }, { visitors: n, conversions: v }, 0.05, 0.05);
          const excludes = r.diffCI[0] > 0 || r.diffCI[1] < 0;
          if (excludes !== (r.decision !== "keep running")) bad.push(`${c}/${n} vs ${v}/${n}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
  it("control 10/50 vs variant 33/50: interval and p tell the same story", () => {
    const r = sequentialTest({ visitors: 50, conversions: 10 }, { visitors: 50, conversions: 33 }, 0.05, 0.05);
    expect(r.diffCI[0] > 0).toBe(r.alwaysValidP <= 0.05);
  });
  it("says why it keeps running when the data gate blocks a stop", async () => {
    const r = sequentialTest({ visitors: 40, conversions: 0 }, { visitors: 40, conversions: 9 }, 0.05, 0.2);
    expect(r.decision).toBe("keep running");
    expect(r.enoughData).toBe(false);
    const call = await connect();
    const t = await call("ab_test_sequential", { control: { visitors: 40, conversions: 0 }, variant: { visitors: 40, conversions: 9 }, expectedEffect: 0.2 });
    expect(t.json.citeAs).toMatch(/keep running \(too few conversions or non-conversions/);
  });
});

describe("twoProportionTest p-value", () => {
  it("never goes above 1", () => {
    expect(twoProportionTest({ visitors: 40, conversions: 40 }, { visitors: 40, conversions: 40 }).pValue).toBeLessThanOrEqual(1);
    expect(twoProportionTest({ visitors: 1000, conversions: 100 }, { visitors: 1000, conversions: 100 }).pValue).toBeLessThanOrEqual(1);
  });
});

describe("paid_media_math subscription without ltvGrossProfit", () => {
  it("leads with payback, not a loss verdict", () => {
    const r = paidMediaMath({ aov: 30, margin: 0.8, cpm: 10, ctr: 0.01, cvr: 0.02, monthlyChurn: 0.05 });
    expect(r.verdict).not.toMatch(/loses money/);
    expect(r.verdict).toMatch(/pays back in 3 months/);
  });
  it("says 1 month, not 1 months", () => {
    const r = paidMediaMath({ aov: 360, margin: 0.8, cpm: 10, ctr: 0.01, cvr: 0.02, billingModel: "subscription" });
    expect(r.verdict).toMatch(/1 month\b/);
    expect(r.verdict).not.toMatch(/1 months/);
  });
  it("states that aov is one month's revenue, since payback and churn are monthly", () => {
    const r = paidMediaMath({ aov: 30, margin: 0.8, cpc: 1, cvr: 0.02, billingModel: "subscription" });
    expect(r.warnings.join(" ")).toMatch(/one month's revenue/);
  });
  it("citeAs headline is payback-based, not 'over'", async () => {
    const call = await connect();
    const t = await call("paid_media_math", { aov: 30, margin: 0.8, cpm: 10, ctr: 0.01, cvr: 0.02, monthlyChurn: 0.05 });
    expect(t.json.citeAs).not.toMatch(/\(over\)/);
    expect(t.json.citeAs).toMatch(/payback 3 months/);
  });
});

describe("unit_economics scenarios keep their own warnings and deal result", () => {
  it("a churn scenario under a lifetime deal shows the deal figures", () => {
    const r = unitEconomics({ arpaMonthly: 20, grossMargin: 0.8, monthlyChurn: 0.03, oneTimePrice: 59, scenarios: [{ name: "low churn", monthlyChurn: 0.01 }] });
    const s = r.scenarios![0];
    expect(s.warnings.length).toBeGreaterThan(0);
    expect(s.lifetimeDealNetValuePerUnit).not.toBeNull();
    expect(s.lifetimeDealNetValuePerUnit).toBeLessThan(r.lifetimeDeal!.netValuePerUnit);
  });
});

describe("funnel_analysis refuses inputs from the other mode", () => {
  it("spend or improvement with stepRates", async () => {
    const call = await connect();
    const t = await call("funnel_analysis", { stepRates: [0.3], targetOutput: 5, spend: 100, improvement: 0.2 });
    expect(t.isError).toBe(true);
    expect(t.text).toMatch(/spend|improvement/);
  });
  it("stageNames with stages", async () => {
    const call = await connect();
    const t = await call("funnel_analysis", { stages: [{ name: "a", count: 100 }, { name: "b", count: 10 }], stageNames: ["x", "y"] });
    expect(t.isError).toBe(true);
    expect(t.text).toMatch(/stageNames/);
  });
});

describe("ab_test_evaluate significant with no relative-lift interval", () => {
  it("control 0/1000 vs variant 30/1000 still gets direction-aware planning advice", async () => {
    const call = await connect();
    const t = await call("ab_test_evaluate", { control: { visitors: 1000, conversions: 0 }, variant: { visitors: 1000, conversions: 30 }, plannedSamplePerArm: 1000 });
    expect(t.json.significant).toBe(true);
    expect(t.json.warnings.join(" ")).toMatch(/Plan around the low end of the interval/);
  });
});

describe("peeking figure matches the tool note", () => {
  it.each(["knowledge/experimentation.md", "research/landscape-2026.md"])("%s says about 19% for 10 looks", (f) => {
    const text = readFileSync(f, "utf8");
    expect(text).not.toMatch(/10 times inflates[^.]*~26%/);
    expect(text).toMatch(/10 times inflates[^.]*19%/);
  });
});
