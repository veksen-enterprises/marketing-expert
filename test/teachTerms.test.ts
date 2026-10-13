// The readers want to learn business, so the advisor uses the real term and explains it in plain words on first
// use. check_answer hands back the glossary's plain one-liner for every term it flags, so the explanation is the
// same everywhere and correct.
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { checkAnswer, plainGloss } from "../src/lib/answerCheck.js";

const glossary = readFileSync("knowledge/glossary.md", "utf8");
/** The first sentence of a glossary entry, as a reader sees it. */
const firstSentence = (term: string) => {
  const line = glossary.split("\n").find((l) => l.startsWith(`- **${term}`))!;
  return line.replace(/^- \*\*[^*]+\*\*:\s*/, "").split(/(?<=\.)\s/)[0].replace(/\.$/, "");
};

describe("teaching business terms", () => {
  it("returns the glossary's plain one-liner for an unexplained abbreviation", () => {
    const r = checkAnswer("Your CAC is too high for this price.");
    expect(r.unexplainedTerms).toContain("CAC");
    expect(r.explainWith).toContainEqual({ term: "CAC", plain: firstSentence("CAC") });
    expect(r.problems.join(" ")).toContain(firstSentence("CAC"));
  });
  it("reads every entry, not only abbreviations", () => {
    expect(plainGloss().get("cohort")).toBe(firstSentence("Cohort"));
    expect(plainGloss().get("churn")).toBeTruthy();
  });
  it("says nothing when the term is explained", () => {
    const r = checkAnswer("Your CAC (customer acquisition cost: what it costs to win one customer) is too high.");
    expect(r.unexplainedTerms).not.toContain("CAC");
    expect(r.explainWith.find((e) => e.term === "CAC")).toBeUndefined();
  });
  it("gives no one-liner for a term the glossary lacks, and says so", () => {
    const r = checkAnswer("Check the XYZQ before launch.");
    expect(r.unexplainedTerms).toContain("XYZQ");
    expect(r.explainWith.find((e) => e.term === "XYZQ")).toBeUndefined();
    expect(r.problems.join(" ")).toMatch(/not in the glossary: XYZQ/);
  });
});
