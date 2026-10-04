import { describe, it, expect } from "vitest";
import { marketSize } from "../src/lib/marketSize.js";

describe("marketSize", () => {
  const base = {
    segments: [
      { name: "agencies 10-50", accounts: 20000, annualValue: 3000, serviceableShare: 0.5, source: "census" },
      { name: "agencies 50-200", accounts: 5000, annualValue: 12000, serviceableShare: 0.4, source: "census" },
    ],
  };
  it("computes TAM/SAM", () => {
    const r = marketSize(base);
    expect(r.tam).toBe(20000 * 3000 + 5000 * 12000);
    expect(r.sam).toBe(10000 * 3000 + 2000 * 12000);
    expect(r.serviceableAccounts).toBe(12000);
    expect(r.blendedAnnualValue).toBeCloseTo(54e6 / 12000);
    expect(r.warnings.join(" ")).toMatch(/No capacity constraint/);
  });
  it("binds SOM by the tighter constraint, with churn", () => {
    const r = marketSize({ ...base, horizonYears: 3, salesCapacity: { reps: 5, dealsPerRepPerYear: 40 }, acquisitionBudget: { annualBudget: 100000, cac: 2000 }, annualChurn: 0.2 });
    // budget: 50/yr → 50, 90, 122
    expect(r.obtainable.customersByBudget).toBeCloseTo(122);
    expect(r.obtainable.bindingConstraint).toBe("acquisition budget");
    expect(r.obtainable.customersAtHorizon).toBeCloseTo(122);
  });
  it("flags impossible revenue targets and top-down mismatch", () => {
    const r = marketSize({ ...base, revenueTarget: 100e6, topDownAnnualSpend: 1e9 });
    expect(r.target!.customersNeeded).toBeGreaterThan(r.serviceableAccounts);
    const w = r.warnings.join(" ");
    expect(w).toMatch(/only 12.0k accounts are serviceable/);
    expect(w).toMatch(/differ by/);
  });
  it("flags missing sources", () => {
    const r = marketSize({ segments: [{ name: "x", accounts: 100, annualValue: 10 }] });
    expect(r.warnings.join(" ")).toMatch(/no source/);
  });
});
