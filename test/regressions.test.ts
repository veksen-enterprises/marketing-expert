// Regression tests for code-review findings (2026-10-04).
import { describe, it, expect } from "vitest";
import { marketSize } from "../src/lib/marketSize.js";
import { welchTest } from "../src/lib/means.js";
import { analyzeCopy } from "../src/lib/copy.js";
import { buildUtm } from "../src/lib/utm.js";
import { auditHtml } from "../src/lib/pageAudit.js";
import { unitEconomics } from "../src/lib/economics.js";

describe("review regressions", () => {
  it("market is the binding constraint when capacity exceeds it", () => {
    const r = marketSize({ segments: [{ name: "x", accounts: 100, annualValue: 1000, serviceableShare: 1, source: "s" }], salesCapacity: { reps: 50, dealsPerRepPerYear: 100 } });
    expect(r.obtainable.bindingConstraint).toBe("serviceable market");
    expect(r.obtainable.customersAtHorizon).toBe(100);
  });
  it("heavy-tail warning fires on small samples", () => {
    const c = [0, 0, 5, 0, 10, 0, 0, 8, 0, 0, 0, 12, 0, 0, 0, 6, 0, 0, 0, 9];
    const v = [0, 0, 5, 0, 10, 0, 0, 8, 0, 0, 0, 12, 0, 0, 0, 6, 0, 0, 0, 5000];
    expect(welchTest({ values: c }, { values: v }).warnings.join(" ")).toMatch(/Heavy tail/);
  });
  it("plurals are counted once", () => {
    const vague = analyzeCopy("Our solutions empowers teams.").flags.filter((f) => f.type === "vague");
    expect(vague).toHaveLength(2);
  });
  it("medium with spaces is normalised before the GA4 check", () => {
    const r = buildUtm({ url: "https://ex.com", source: "linkedin", medium: "paid social", campaign: "q4" });
    expect(r.url).toMatch(/utm_medium=paid-social/);
    expect(r.warnings.join(" ")).not.toMatch(/channel grouping recognises/);
  });
  it("protocol-relative links are classified by host", () => {
    const r = auditHtml(`<html><body><a href="//other.com/x">a</a><a href="//acme.test/y">b</a></body></html>`, "https://acme.test/");
    expect(r.links).toEqual({ internal: 1, external: 1, nofollow: 0 });
  });
  it("zero churn gets its own warning", () => {
    const r = unitEconomics({ arpaMonthly: 100, grossMargin: 0.8, monthlyChurn: 0, cac: 1000 });
    expect(r.warnings.join(" ")).toMatch(/churn of 0/);
    expect(r.warnings.join(" ")).not.toMatch(/expansion offsets/);
  });
});
