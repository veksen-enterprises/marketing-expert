// Readers are learning business and search in everyday words. searchPlain adds the business terms those words
// stand for before searching, and leaves out the glossary's letter sections (learn_more term: covers terms).
import { describe, it, expect } from "vitest";
import { searchPlain, expandQuery, searchKnowledge } from "../src/lib/knowledge.js";

const top3 = (q: string) => searchPlain(q, 3).map((h) => h.slug);
const anyOf = (q: string, slugs: string[]) => expect(top3(q).some((s) => slugs.includes(s)), `${q}: ${top3(q).join(", ")}`).toBe(true);

describe("plain-language search", () => {
  it.each([
    ["how much should we charge", "pricing"],
    ["how do I get people to pay", "pricing"],
    ["my ads are not making money", "paid-acquisition"],
    ["how do I know if marketing works", "metrics-and-measurement"],
    ["what should I put on my website", "landing-pages-and-cro"],
    ["how do I get my first customers", "first-customers"],
    ["is my idea any good", "startup-risk-and-opportunity"],
    ["should I hire a salesperson", "founder-led-sales"],
    ["cheap ways to get users with no money", "small-bets"],
  ])("%s → %s", (q, slug) => {
    expect(top3(q)).toContain(slug);
  });
  it("people stop using my app → a retention section (general or for apps)", () => anyOf("people stop using my app after a week", ["retention-and-expansion", "consumer-apps"]));
  it("never returns glossary letter sections", () => {
    for (const q of ["is my idea any good", "where do I find users", "how do I get people to pay"]) expect(top3(q)).not.toContain("glossary");
  });
  it("adds business terms for everyday words, and keeps the original words", () => {
    const e = expandQuery("how much should we charge");
    expect(e).toMatch(/charge/);
    expect(e).toMatch(/pricing/);
  });
  it("leaves exact searches alone: only searchPlain expands the query", () => {
    const q = "how much should we charge";
    const plain = searchPlain(q, 5).map((h) => h.pointer);
    expect(plain).toEqual(searchKnowledge(expandQuery(q), 11).filter((h) => h.slug !== "glossary").slice(0, 5).map((h) => h.pointer));
    expect(searchKnowledge(q, 5).map((h) => h.pointer)).not.toEqual(plain);
  });
});
