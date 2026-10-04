import { describe, it, expect } from "vitest";
import { welchTest, tTwoSidedP, tCrit, sampleSizeMeans } from "../src/lib/means.js";

// Reference values from scipy.stats.
describe("t distribution", () => {
  it("matches scipy", () => {
    expect(tTwoSidedP(2.1, 7.3)).toBeCloseTo(0.0722467, 6);
    expect(tCrit(0.05, 7.3)).toBeCloseTo(2.345067, 5);
  });
});

describe("welchTest", () => {
  const a = [0, 0, 0, 12, 0, 30, 0, 0, 45, 0, 0, 8, 0, 0, 0, 22, 0, 0, 15, 0];
  const b = [0, 10, 0, 12, 0, 30, 0, 40, 45, 0, 0, 8, 0, 25, 0, 22, 0, 0, 15, 60];
  it("raw values match scipy ttest_ind(equal_var=False)", () => {
    const r = welchTest({ values: a }, { values: b });
    expect(r.tStatistic).toBeCloseTo(1.3738256, 6);
    expect(r.pValue).toBeCloseTo(0.178538, 5);
    expect(r.significant).toBe(false);
    expect(r.warnings.join(" ")).toMatch(/Fewer than 30/);
  });
  it("summary stats match scipy ttest_ind_from_stats", () => {
    const r = welchTest({ n: 10000, mean: 4.9, sd: 13.8 }, { n: 10000, mean: 5.2, sd: 14.1 });
    expect(r.tStatistic).toBeCloseTo(1.5205718, 5);
    expect(r.pValue).toBeCloseTo(0.1283831, 5);
    expect(r.diffCI[0]).toBeLessThan(0);
  });
  it("caps outliers", () => {
    const c = Array.from({ length: 200 }, (_, i) => (i % 10 === 0 ? 50 : 0));
    const v = [...c.slice(0, 199), 100000];
    const raw = welchTest({ values: c }, { values: v });
    expect(raw.warnings.join(" ")).toMatch(/Heavy tail/);
    const capped = welchTest({ values: c }, { values: v }, 0.05, 0.99);
    expect(capped.cappedAt).toBeLessThan(100000);
    expect(Math.abs(capped.absoluteDiff)).toBeLessThan(Math.abs(raw.absoluteDiff));
  });
  it("validates", () => {
    expect(() => welchTest({ n: 10, mean: 1 }, { n: 10, mean: 1, sd: 1 })).toThrow(/provide values/);
    expect(() => welchTest({ n: 10, mean: 1, sd: 1 }, { n: 10, mean: 1, sd: 1 }, 0.05, 0.99)).toThrow(/raw values/);
  });
});

describe("sampleSizeMeans", () => {
  it("standard formula", () => {
    // n = 2 (z_{α/2} + z_β)^2 σ² / δ²
    const r = sampleSizeMeans({ baselineMean: 5, baselineSd: 20, mde: 0.05 });
    expect(r.perArm).toBe(Math.ceil((2 * (1.959964 + 0.841621) ** 2 * 400) / 0.0625));
    expect(r.notes.join(" ")).toMatch(/Coefficient of variation/);
  });
  it("variance reduction lowers n", () => {
    const base = sampleSizeMeans({ baselineMean: 5, baselineSd: 15, mde: 0.05 }).perArm;
    const cuped = sampleSizeMeans({ baselineMean: 5, baselineSd: 15, mde: 0.05, varianceReduction: 0.5 }).perArm;
    expect(cuped / base).toBeCloseTo(0.5, 2);
  });
});
