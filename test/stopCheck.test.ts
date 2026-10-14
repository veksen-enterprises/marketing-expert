// Stop check in paid_media_math. Built from the rule in a public ad-skills pack:
// "spend > 2× target CPA with 0 conversions → instant pause", which kills about 1 in 7 ads that are at target.
import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";
import { paidMediaMath, poissonCdf } from "../src/lib/economics.js";

describe("poissonCdf", () => {
  it("matches closed forms", () => {
    expect(poissonCdf(0, 2)).toBeCloseTo(Math.exp(-2), 12);
    expect(poissonCdf(1, 3)).toBeCloseTo(4 * Math.exp(-3), 12);
    expect(poissonCdf(400, 400)).toBeGreaterThan(0.5);
    expect(poissonCdf(400, 400)).toBeLessThan(0.52);
  });
});

describe("paid_media_math stop check", () => {
  it("2× target CPA with no conversions is not enough to stop: 13.5% of at-target ads look like this", () => {
    const r = paidMediaMath({ targetCpa: 20, spend: 40, conversions: 0 });
    const s = r.stopCheck!;
    expect(s.chanceThisFewIfAtBenchmark).toBeCloseTo(Math.exp(-2), 6);
    expect(s.decision).toBe("keep spending: not enough evidence");
    // ln(20) ≈ 3.0: about 3× the target with no conversion before it is a 95% call.
    expect(s.spendToJudgeAtThisCount / 20).toBeCloseTo(Math.log(20), 4);
    expect(s.note).toMatch(/no conversions on 40\.00 14% of the time.*59\.91 total spend \(3\.0× the benchmark\)/);
    expect(s.note).toMatch(/delayed reporting/);
    expect(s.note).toMatch(/Checking every day/);
  });
  it("$17 on an ad with a $20 target says almost nothing", () => {
    const s = paidMediaMath({ targetCpa: 20, spend: 17, conversions: 0 }).stopCheck!;
    expect(s.chanceThisFewIfAtBenchmark).toBeCloseTo(Math.exp(-0.85), 6);
  });
  it("stops once the count is under 5% for an at-target ad", () => {
    const s = paidMediaMath({ targetCpa: 20, spend: 200, conversions: 3 }).stopCheck!;
    // Expected 10 at target; P(X ≤ 3 | 10) ≈ 1.03%.
    expect(s.chanceThisFewIfAtBenchmark).toBeCloseTo(0.0103, 3);
    expect(s.decision).toBe("stop: worse than benchmark");
    expect(s.observedCpa).toBeCloseTo(200 / 3);
  });
  it("spendToJudge is exactly where the chance crosses 5%", () => {
    for (const c of [0, 1, 2, 5, 20]) {
      const at = paidMediaMath({ targetCpa: 10, spend: 1, conversions: c }).stopCheck!.spendToJudgeAtThisCount;
      expect(poissonCdf(c, at / 10)).toBeCloseTo(0.05, 6);
      expect(paidMediaMath({ targetCpa: 10, spend: at * 1.001, conversions: c }).stopCheck!.decision).toBe("stop: worse than benchmark");
      expect(paidMediaMath({ targetCpa: 10, spend: at * 0.999, conversions: c }).stopCheck!.decision).toBe("keep spending: not enough evidence");
    }
  });
  it("gives an exact 95% CPA interval: 25 conversions still leaves CPA uncertain by about ±40%", () => {
    const s = paidMediaMath({ targetCpa: 20, spend: 500, conversions: 25 }).stopCheck!;
    // Garwood bounds on 25: 16.18 and 36.90.
    expect(s.cpaInterval95[0]).toBeCloseTo(500 / 36.9, 1);
    expect(s.cpaInterval95[1]!).toBeCloseTo(500 / 16.18, 1);
    expect(paidMediaMath({ targetCpa: 20, spend: 50, conversions: 0 }).stopCheck!.cpaInterval95[1]).toBeNull();
  });
  it("falls back to lifetime gross profit, then first-order gross profit for one-time sales", () => {
    expect(paidMediaMath({ ltvGrossProfit: 90, spend: 100, conversions: 1 }).stopCheck!.benchmarkBasis).toBe("ltvGrossProfit");
    expect(paidMediaMath({ aov: 80, margin: 0.5, spend: 100, conversions: 1 }).stopCheck!.benchmarkCpa).toBe(40);
  });
  it("won't judge a subscription against one month's gross profit", () => {
    const r = paidMediaMath({ aov: 30, margin: 0.8, monthlyChurn: 0.05, spend: 100, conversions: 0 });
    expect(r.stopCheck).toBeNull();
    expect(r.warnings.join(" ")).toMatch(/Stop check skipped/);
  });
  it("rejects half an input", () => {
    expect(() => paidMediaMath({ targetCpa: 20, spend: 40 })).toThrow(/both spend and conversions/);
  });
  it("leaves results without spend unchanged", () => {
    expect("stopCheck" in paidMediaMath({ aov: 80, margin: 0.4, cvr: 0.025, cpc: 1.2 })).toBe(false);
  });
  it("tool output leads with the decision", async () => {
    const [a, b] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "t", version: "0" });
    await Promise.all([createServer().connect(a), client.connect(b)]);
    const r = await client.callTool({ name: "paid_media_math", arguments: { targetCpa: 20, spend: 40, conversions: 0 } });
    const text = (r.content as Array<{ text: string }>)[0].text;
    expect(r.isError).toBeFalsy();
    expect(text).toMatch(/keep spending: not enough evidence \(14% chance of none at CPA 20\)/);
  });
});
