import { describe, it, expect, beforeAll } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

beforeAll(() => {
  process.env.MARKETING_EXPERT_DATA_DIR = mkdtempSync(join(tmpdir(), "me-test-"));
});

describe("business profiles", async () => {
  const { saveProfile, getProfile, listProfiles, missingFields, staleMetrics } = await import("../src/lib/profile.js");

  it("creates, merges, deletes", () => {
    saveProfile("acme", { product: "Invoicing for agencies", competitiveAlternatives: ["spreadsheets"], metrics: { mrr: { value: 12000, asOf: "2026-09" } } });
    saveProfile("acme", { metrics: { churn: { value: 0.03, asOf: "2025-01" } }, voice: { dont: ["hype"] } });
    let p = getProfile("acme")!;
    expect(p.product).toBe("Invoicing for agencies");
    expect(Object.keys(p.metrics!)).toEqual(["mrr", "churn"]);
    expect(p.voice!.dont).toEqual(["hype"]);
    saveProfile("acme", { metrics: { mrr: null }, product: null });
    p = getProfile("acme")!;
    expect(p.product).toBeUndefined();
    expect(Object.keys(p.metrics!)).toEqual(["churn"]);
    expect(listProfiles().map((x) => x.name)).toEqual(["acme"]);
  });
  it("reports missing and stale", () => {
    const p = getProfile("acme")!;
    expect(missingFields(p)).toContain("bestFitCustomers");
    expect(staleMetrics(p, 6, new Date("2026-10-04"))).toEqual(["churn (as of 2025-01)"]);
  });
  it("rejects path traversal", () => {
    expect(() => saveProfile("../evil", {})).toThrow(/lowercase/);
    expect(getProfile).toBeDefined();
  });
});
