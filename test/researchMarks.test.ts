import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// A fetch tool that returns a model's summary and chosen quotes (WebFetch) is not a read of the page: figures and
// quotes are the tool's, unchecked against the text. Such reads carry "fetch summary" in their access mark
// (knowledge/_conventions.md), so they aren't mistaken for a direct read when a claim moves into a playbook.
const notes = readdirSync("research")
  .filter((f) => f.endsWith(".md"))
  .map((f) => ({ f, text: readFileSync(join("research", f), "utf8") }));
// An access mark: a bracket or parenthesis that says how a source was read ("[read 2026-10-27; …]",
// "[first-party, read via …]", "(read through …)").
const READ_MARK = /[[(][^\]()\n]*\bread\b[^\]()\n]*[\])]/gi;
const VIA_SUMMARY = /webfetch|fetch tool|fetch summary|page summari[sz]er|summari[sz]ing fetch/i;
// A note's access line that says its pages came through a summarising fetch tool, so every read mark in it did,
// unless the mark names another way ("PDF text": extracted text read directly).
const DECLARED = /(texts|pages) were read through (a|the) fetch tool|read through a fetch tool that summarises|fetch tool's (summar|extraction)|returns a model-written summary/i;

describe("research access marks", () => {
  it("say \"fetch summary\" wherever a read went through a summarising fetch tool", () => {
    const bad = notes.flatMap(({ f, text }) => [...text.matchAll(READ_MARK)].map((m) => m[0]).filter((m) => VIA_SUMMARY.test(m) && !/fetch summary/i.test(m)).map((m) => `${f}: ${m}`));
    expect(bad).toEqual([]);
  });
  it("mark every read in a note whose access line says all pages came through the fetch tool", () => {
    const declared = notes.filter(({ text }) => DECLARED.test(text.split("\n").slice(0, 25).join("\n")));
    expect(declared.map((n) => n.f)).toEqual(expect.arrayContaining(["channel-and-retention.md", "crowded-markets.md", "design-and-marketing-in-crowded-markets.md", "forecasting-and-calibration.md", "founder-test-samples.md", "marketplace-and-registry-listings.md", "outside-view-business.md", "partial-support-judges.md"]));
    const bad = declared.flatMap(({ f, text }) => [...text.matchAll(READ_MARK)].map((m) => m[0]).filter((m) => /^\[read/i.test(m) && !/fetch summary|PDF text/i.test(m)).map((m) => `${f}: ${m}`));
    expect(bad).toEqual([]);
  });
  it("define the mark where the evidence tags are", () => {
    expect(readFileSync("knowledge/_conventions.md", "utf8")).toMatch(/fetch summary/);
  });
});
