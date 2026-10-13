import { describe, it, expect } from "vitest";
import { liquidity } from "../src/lib/liquidity.js";

describe("liquidity", () => {
  it("computes Poisson match probabilities and the listings needed", () => {
    const r = liquidity({ listingsPerDay: 100, matchShares: [0.01], windowDays: 7 });
    // 1 match/day for 7 days: P = 1 - e^-7
    expect(r.rows[0].matchesPerDay).toBeCloseTo(1, 10);
    expect(r.rows[0].probabilityWithinWindow).toBeCloseTo(1 - Math.exp(-7), 10);
    expect(r.rows[0].expectedDaysToFirstMatch).toBeCloseTo(1, 10);
    // 80% within 7 days at 1% share: -ln(0.2)/(0.01*7) ≈ 229.9
    expect(r.rows[0].listingsPerDayNeeded).toBeCloseTo(-Math.log(0.2) / 0.07, 6);
  });
  it("averages across watch widths and names the narrowest in the verdict", () => {
    const r = liquidity({ listingsPerDay: 50, matchShares: [0.001, 0.01, 0.05], windowDays: 7 });
    expect(r.shareOfWatchesFiring).toBeCloseTo(r.rows.reduce((a, x) => a + x.probabilityWithinWindow, 0) / 3, 10);
    expect(r.verdict).toMatch(/narrowest \(0\.1% of listings\)/);
  });
  it("handles zero listings and rejects bad input", () => {
    expect(liquidity({ listingsPerDay: 0, matchShares: [0.01], windowDays: 7 }).rows[0].expectedDaysToFirstMatch).toBe(Infinity);
    expect(() => liquidity({ listingsPerDay: 10, matchShares: [0], windowDays: 7 })).toThrow(/matchShare/);
    expect(() => liquidity({ listingsPerDay: 10, matchShares: [], windowDays: 7 })).toThrow();
    expect(() => liquidity({ listingsPerDay: 10, matchShares: [0.1], windowDays: 7, targetProbability: 1 })).toThrow();
  });
});
