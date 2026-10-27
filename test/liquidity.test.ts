import { describe, it, expect } from "vitest";
import { liquidity, reciprocalLiquidity } from "../src/lib/liquidity.js";

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
  it("shows a very narrow share without rounding it to 0.0%", () => {
    const r = liquidity({ listingsPerDay: 30, matchShares: [0.0003, 0.003], windowDays: 7 });
    expect(r.verdict).toMatch(/narrowest \(0\.03% of listings\)/);
    expect(r.verdict).not.toMatch(/0\.0% of listings/);
  });
  it("handles zero listings and rejects bad input", () => {
    expect(liquidity({ listingsPerDay: 0, matchShares: [0.01], windowDays: 7 }).rows[0].expectedDaysToFirstMatch).toBe(Infinity);
    expect(() => liquidity({ listingsPerDay: 10, matchShares: [0], windowDays: 7 })).toThrow(/matchShare/);
    expect(() => liquidity({ listingsPerDay: 10, matchShares: [], windowDays: 7 })).toThrow();
    expect(() => liquidity({ listingsPerDay: 10, matchShares: [0.1], windowDays: 7, targetProbability: 1 })).toThrow();
  });
});

describe("reciprocalLiquidity", () => {
  it("needs both people's likes, and flags the short side when like rates differ 5x or more", () => {
    const r = reciprocalLiquidity({
      sides: [{ name: "men", newPerDay: 15, likeRate: 0.5 }, { name: "women", newPerDay: 15, likeRate: 0.02 }],
      filterShare: 0.3,
      windowDays: 7,
      conversationRate: 0.2,
    });
    // 15 x 0.3 x 0.5 x 0.02 = 0.045 a day
    expect(r.rows[0].matchesPerWeek).toBeCloseTo(0.315, 10);
    expect(r.rows[0].probabilityWithinWindow).toBeCloseTo(1 - Math.exp(-0.315), 10);
    expect(r.rows[0].matchesPerLike).toBe(0.02);
    expect(r.rows[1].matchesPerLike).toBe(0.5);
    expect(r.rows[0].conversationsPerWeek).toBeCloseTo(0.063, 10);
    expect(r.verdict).toMatch(/On the men side, a user gets about 0\.32 matches a week, a 27% chance/);
    expect(r.warnings.join(" ")).toMatch(/Users on the men side like 25 times as often as users on the women side.*The women side is the short side/);
  });
  it("gives no side-gap warning when like rates are close, and handles one pool", () => {
    const two = reciprocalLiquidity({
      sides: [{ name: "a", newPerDay: 15, likeRate: 0.3 }, { name: "b", newPerDay: 15, likeRate: 0.3 }],
      filterShare: 0.3,
      windowDays: 7,
    });
    expect(two.warnings.join(" ")).not.toMatch(/short side/);
    expect(two.rows[0].matchesPerWeek).toBeCloseTo(15 * 0.3 * 0.09 * 7, 10);
    const one = reciprocalLiquidity({ sides: [{ name: "member", newPerDay: 10, likeRate: 0.2 }], filterShare: 0.5, windowDays: 7 });
    expect(one.rows).toHaveLength(1);
    expect(one.rows[0].matchesPerWeek).toBeCloseTo(10 * 0.5 * 0.04 * 7, 10);
  });
  it("warns that like rates fall as the pool grows, and that sign-ups aren't active users", () => {
    const r = reciprocalLiquidity({ sides: [{ name: "member", newPerDay: 30, likeRate: 0.1 }], filterShare: 0.2, windowDays: 7 });
    expect(r.warnings.join(" ")).toMatch(/choosier as the pool grows/);
    expect(r.warnings.join(" ")).toMatch(/active users, not sign-ups/);
  });
  it("rejects bad input", () => {
    expect(() => reciprocalLiquidity({ sides: [], filterShare: 0.3, windowDays: 7 })).toThrow(/one side/);
    expect(() => reciprocalLiquidity({ sides: [{ name: "a", newPerDay: 1, likeRate: 0 }], filterShare: 0.3, windowDays: 7 })).toThrow(/likeRate/);
  });
});
