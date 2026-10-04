import { describe, it, expect } from "vitest";
import { normCdf, normInv, sampleSizeTwoProportions, twoProportionTest, sampleRatioMismatch, minimumDetectableEffect } from "../src/lib/stats.js";

describe("normal distribution", () => {
  it("matches reference values", () => {
    expect(normInv(0.975)).toBeCloseTo(1.959964, 5);
    expect(normInv(0.8)).toBeCloseTo(0.841621, 5);
    expect(normInv(0.001)).toBeCloseTo(-3.090232, 5);
    expect(normCdf(1.96)).toBeCloseTo(0.975002, 5);
    expect(normCdf(-1)).toBeCloseTo(0.158655, 5);
  });
});

describe("sample size", () => {
  it("matches the standard two-proportion formula", () => {
    // 5% → 6%, alpha .05 two-sided, power .8: ~8,158 per arm (Fleiss, no continuity correction)
    expect(sampleSizeTwoProportions({ baselineRate: 0.05, mde: 0.01, mdeIsAbsolute: true }).perArm).toBe(8158);
    expect(sampleSizeTwoProportions({ baselineRate: 0.1, mde: 0.2 }).perArm).toBe(3841);
  });
  it("Bonferroni increases sample size with more arms", () => {
    const two = sampleSizeTwoProportions({ baselineRate: 0.1, mde: 0.1 });
    const four = sampleSizeTwoProportions({ baselineRate: 0.1, mde: 0.1, variants: 4, correctForMultipleComparisons: true });
    expect(four.alphaUsed).toBeCloseTo(0.05 / 3);
    expect(four.perArm).toBeGreaterThan(two.perArm);
    expect(four.total).toBe(four.perArm * 4);
  });
  it("rejects impossible targets", () => {
    expect(() => sampleSizeTwoProportions({ baselineRate: 0.6, mde: 1 })).toThrow();
  });
  it("MDE inverts sample size", () => {
    const n = sampleSizeTwoProportions({ baselineRate: 0.04, mde: 0.15 }).perArm;
    expect(minimumDetectableEffect(0.04, n)!).toBeCloseTo(0.15, 2);
  });
});

describe("two-proportion test", () => {
  it("computes z and p", () => {
    const r = twoProportionTest({ visitors: 1000, conversions: 100 }, { visitors: 1000, conversions: 130 });
    expect(r.zScore).toBeCloseTo(2.1027, 3);
    expect(r.pValue).toBeCloseTo(0.0355, 3);
    expect(r.significant).toBe(true);
    expect(r.diffCI[0]).toBeGreaterThan(0);
    expect(r.probabilityVariantBetter).toBeGreaterThan(0.97);
  });
  it("no difference → p = 1", () => {
    const r = twoProportionTest({ visitors: 500, conversions: 50 }, { visitors: 500, conversions: 50 });
    expect(r.pValue).toBeCloseTo(1, 5);
    expect(r.probabilityVariantBetter).toBeCloseTo(0.5, 5);
  });
  it("validates input", () => {
    expect(() => twoProportionTest({ visitors: 10, conversions: 11 }, { visitors: 10, conversions: 1 })).toThrow();
  });
});

describe("SRM", () => {
  it("df=1 matches chi-square", () => {
    const r = sampleRatioMismatch([50500, 49500]);
    expect(r.chiSquare).toBeCloseTo(10);
    expect(r.pValue).toBeCloseTo(0.001565, 5);
    expect(r.mismatch).toBe(false);
  });
  it("df=2 is exact", () => {
    const r = sampleRatioMismatch([10000, 10000, 10500]);
    expect(r.pValue).toBeCloseTo(Math.exp(-r.chiSquare / 2), 10);
    expect(r.mismatch).toBe(true);
  });
  it("respects unequal allocation", () => {
    expect(sampleRatioMismatch([9000, 1000], [9, 1]).mismatch).toBe(false);
  });
});
