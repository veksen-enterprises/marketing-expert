import { describe, it, expect } from "vitest";
import { unitEconomics, paidMediaMath, analyzeFunnel } from "../src/lib/economics.js";

describe("unit economics", () => {
  it("computes LTV, ratio, payback", () => {
    const r = unitEconomics({ arpaMonthly: 100, grossMargin: 0.8, monthlyChurn: 0.02, cac: 1200 });
    expect(r.ltvSimple).toBeCloseTo(4000);
    expect(r.ltvToCacSimple).toBeCloseTo(3.333, 2);
    expect(r.paybackMonthsSimple).toBeCloseTo(15);
    // churn-adjusted payback is later than simple payback
    expect(r.paybackMonthsChurnAdjusted!).toBeGreaterThan(15);
    // bounded LTV over 60 months < simple
    expect(r.ltvBounded).toBeLessThan(4000);
    expect(r.ltvBounded).toBeCloseTo((80 * (1 - Math.pow(0.98, 60))) / 0.02, 6);
  });
  it("handles negative net churn", () => {
    const r = unitEconomics({ arpaMonthly: 100, grossMargin: 0.8, monthlyChurn: 0.01, monthlyExpansion: 0.02, cac: 1000 });
    expect(r.ltvSimple).toBeNull();
    expect(r.warnings.join(" ")).toMatch(/infinite/);
  });
  it("derives CAC from spend", () => {
    const r = unitEconomics({ arpaMonthly: 50, grossMargin: 0.7, monthlyChurn: 0.05, salesAndMarketingSpend: 10000, newCustomers: 20 });
    expect(r.cac).toBe(500);
  });
  it("flags never-paid-back", () => {
    const r = unitEconomics({ arpaMonthly: 10, grossMargin: 0.5, monthlyChurn: 0.2, cac: 1000 });
    expect(r.paybackMonthsChurnAdjusted).toBeNull();
  });
});

describe("paid media", () => {
  it("break-even and implied numbers", () => {
    const r = paidMediaMath({ aov: 80, margin: 0.4, cvr: 0.025, cpm: 12, ctr: 0.01, budget: 3000 });
    expect(r.breakEvenRoasFirstOrder).toBeCloseTo(2.5);
    expect(r.breakEvenCpaFirstOrder).toBeCloseTo(32);
    expect(r.impliedCpc).toBeCloseTo(1.2);
    expect(r.impliedCpa).toBeCloseTo(48);
    expect(r.maxCpcAtBreakEven).toBeCloseTo(0.8);
    expect(r.verdict).toMatch(/exceeds/);
    expect(r.budgetProjection!.clicks).toBeCloseTo(2500);
  });
});

describe("funnel", () => {
  it("analyses stages", () => {
    const r = analyzeFunnel([
      { name: "visit", count: 10000 },
      { name: "signup", count: 800 },
      { name: "activated", count: 300 },
      { name: "paid", count: 60 },
    ], 5000);
    expect(r.overallRate).toBeCloseTo(0.006);
    expect(r.largestAbsoluteDrop).toBe("visit → signup");
    expect(r.lowestStepRate).toBe("visit → signup");
    expect(r.gainFromImprovingAnyStep).toBeCloseTo(6);
    expect(r.stages[3].costPer).toBeCloseTo(83.333, 2);
  });
  it("flags growing stages", () => {
    const r = analyzeFunnel([{ name: "a", count: 10 }, { name: "b", count: 20 }]);
    expect(r.notes[0]).toMatch(/larger than the previous/);
  });
});
