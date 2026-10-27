import { describe, it, expect, beforeAll } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
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
  it("asks for traction, not a stage in words: Stage is worked out from traction", () => {
    const p = getProfile("acme")!;
    expect(missingFields(p)).toContain("traction");
    expect(missingFields(p)).not.toContain("stage");
    expect(missingFields(p)).not.toContain("selfDescribedStage");
  });
  it("reads profiles saved with the old names (constraints, stage) under the glossary names, and saves only the new ones", () => {
    const dir = join(process.env.MARKETING_EXPERT_DATA_DIR!, "profiles");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "old.json"), JSON.stringify({ name: "old", constraints: ["5 hours a week"], stage: "private beta" }));
    const p = getProfile("old")!;
    expect(p.limits).toEqual(["5 hours a week"]);
    expect(p.selfDescribedStage).toBe("private beta");
    expect(p).not.toHaveProperty("constraints");
    expect(p).not.toHaveProperty("stage");
    saveProfile("old", { product: "x" });
    const file = JSON.parse(readFileSync(join(dir, "old.json"), "utf8"));
    expect(file.limits).toEqual(["5 hours a week"]);
    expect(file.selfDescribedStage).toBe("private beta");
    expect(file).not.toHaveProperty("constraints");
    expect(file).not.toHaveProperty("stage");
  });
  it("keeps the new name when a file holds both", () => {
    const dir = join(process.env.MARKETING_EXPERT_DATA_DIR!, "profiles");
    writeFileSync(join(dir, "both.json"), JSON.stringify({ name: "both", constraints: ["old"], limits: ["new"] }));
    expect(getProfile("both")!.limits).toEqual(["new"]);
  });
  it("rejects path traversal", () => {
    expect(() => saveProfile("../evil", {})).toThrow(/lowercase/);
    expect(getProfile).toBeDefined();
  });
});
