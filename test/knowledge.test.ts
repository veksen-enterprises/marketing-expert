import { describe, it, expect } from "vitest";
import { loadPlaybooks, searchKnowledge, getPlaybook } from "../src/lib/knowledge.js";

describe("knowledge base", () => {
  const books = loadPlaybooks();
  it("loads every playbook with frontmatter", () => {
    expect(books.length).toBeGreaterThanOrEqual(19);
    for (const b of books) {
      expect(b.title, b.slug).not.toBe(`${b.slug}.md`);
      expect(b.summary.length, b.slug).toBeGreaterThan(20);
      expect(b.body.length, b.slug).toBeGreaterThan(1500);
    }
  });
  it("excludes underscore files", () => {
    expect(getPlaybook("_conventions")).toBeUndefined();
  });
  it("playbooks referenced by prompts and tools exist", () => {
    for (const slug of ["positioning", "experimentation", "launches-and-gtm", "metrics-and-measurement"]) {
      expect(getPlaybook(slug), slug).toBeDefined();
    }
  });
  it.each([
    ["how many visitors do I need for an a/b test", "experimentation"],
    ["open rates after apple privacy", "email-and-lifecycle"],
    ["should we use freemium or a free trial", "pricing"],
    ["brand search ads incrementality", "metrics-and-measurement"],
    ["AI overviews click through rate", "seo-and-ai-search"],
    ["competitive alternatives category", "positioning"],
    ["switch interview forces anxiety habit", "customer-research"],
    ["60/40 brand activation split", "brand-and-demand"],
    ["checkout form fields abandonment", "landing-pages-and-cro"],
    ["tam sam som bottom-up market size", "market-sizing-and-timing"],
    ["first mover pioneer advantage", "market-sizing-and-timing"],
    ["counter-positioning incumbent copy", "competing-with-incumbents"],
    ["sherlocking platform entry api access", "platform-and-feature-risk"],
    ["feature not a product dropbox", "platform-and-feature-risk"],
    ["acquihire liquidation preference waterfall", "acquisition-and-exits"],
    ["startup failure base rates survival", "startup-risk-and-opportunity"],
    ["pre-mortem kill criteria", "startup-risk-and-opportunity"],
    ["win loss interviews switching costs", "competitive-analysis"],
  ])("%s → %s", (q, slug) => {
    const hits = searchKnowledge(q, 3);
    expect(hits.map((h) => h.slug)).toContain(slug);
  });
});
