import { describe, it, expect } from "vitest";
import { checkAnswer } from "../src/lib/answerCheck.js";

describe("checkAnswer", () => {
  it("counts words and reports the overrun", () => {
    const r = checkAnswer("word ".repeat(1250));
    expect(r.words).toBe(1250);
    expect(r.overBy).toBe(50);
    expect(r.problems[0]).toMatch(/50 over/);
  });
  it("counts a code span or URL as one word", () => {
    expect(checkAnswer("See `apps/app/src/routes/index.tsx:4` and https://example.com/a/b now").words).toBe(5);
  });
  it("flags banned words and unexplained abbreviations, not explained ones", () => {
    const r = checkAnswer("Your moat is weak. Raise ARR. Your ICP (ideal customer profile) is clear. LTV: meaning lifetime value.");
    expect(r.bannedWords).toEqual(["moat"]);
    expect(r.unexplainedTerms).toEqual(["ARR"]);
  });
  it("handles terms with regex characters", () => {
    expect(checkAnswer("Check the P&L first.").unexplainedTerms).toEqual(["P&L"]);
  });
  it("passes a clean short answer", () => {
    expect(checkAnswer("Fix the homepage price first. It says $20; the pricing page says $16.").problems).toEqual([]);
  });
});
