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
  it("fingerprints the text, ignoring whitespace differences", () => {
    const a = checkAnswer("Fix the price first.\n\nThen the docs.");
    expect(a.fingerprint).toBe(checkAnswer("Fix the price  first. Then the docs.").fingerprint);
    expect(a.fingerprint).not.toBe(checkAnswer("Fix the docs first. Then the price.").fingerprint);
    expect(a.fingerprint).toMatch(/^[0-9a-f]{10} "Fix the price first\. Then the…"$/);
  });
  it("passes a clean short answer that has the required parts", () => {
    const t = "Fix the homepage price first. It says $20; the pricing page says $16. I'm wrong if fewer than 1 in 10 buyers see the pricing page. Open questions: which price is current? I can save these facts as a business profile.";
    expect(checkAnswer(t).problems).toEqual([]);
  });
  it("lists required parts it can't find", () => {
    const r = checkAnswer("Fix the homepage price first.");
    expect(r.missingParts).toHaveLength(3);
    expect(r.problems.join(" ")).toMatch(/ignore if it's there in other words/);
  });

  it("finds plural abbreviations, and '(' before a term isn't an explanation", () => {
    // repo:correctness#11
    const r = checkAnswer("Track MQLs and SQLs weekly. Cut SKUs. Your CTRs are fine. Cut spend (CAC is too high).");
    expect(r.unexplainedTerms).toEqual(expect.arrayContaining(["MQL", "SKU", "CTR", "CAC"]));
    expect(checkAnswer("Your ideal customer profile (ICP) is too broad.").unexplainedTerms).toEqual([]);
  });
  it("matches lower-case terms in any case", () => {
    expect(checkAnswer("North star: weekly active projects.").unexplainedTerms).toEqual(["north star"]);
  });
  it("finds abbreviations not on any list, and terms graders flagged in round 5", () => {
    const r = checkAnswer("If no server accepts it, the overlay model is the problem. Record it as an ADR. Add SSO later. Mapping guides cover Node-ORM. Add a CI gate.");
    expect(r.unexplainedTerms).toEqual(expect.arrayContaining(["overlay model", "ADR", "SSO", "ORM", "CI gate"]));
    expect(checkAnswer("Use the API, a URL and the CLI from the US or EU.").unexplainedTerms).toEqual([]);
  });
  it("counts a dash gloss, a gloss in the next sentence, or the expansion in the same sentence as explained", () => {
    expect(checkAnswer("Add a CI gate — a check that runs on every pull request.").unexplainedTerms).toEqual([]);
    expect(checkAnswer("Use an ORM. That means a library that maps tables to code.").unexplainedTerms).toEqual([]);
    expect(checkAnswer('Post once on Hacker News as a "Show HN".').unexplainedTerms).toEqual([]);
    expect(checkAnswer("Your customer acquisition cost is high, so CAC payback is long.").unexplainedTerms).toEqual([]);
  });
  it("lists common words with a marketing meaning separately, not as problems", () => {
    const r = checkAnswer("Churn is high. Fix the price first. I'm wrong if fewer than 1 in 10 buyers see the pricing page. Open questions: which price is current? I can save these facts as a business profile.");
    expect(r.considerExplaining).toEqual(["churn"]);
    expect(r.problems).toEqual([]);
  });
  it("needs an offer to save a profile, not any 'profile'", () => {
    // repo:correctness#11: "ideal customer profile" passed as the offer.
    expect(checkAnswer("Your ideal customer profile is too broad. Open questions: what is churn? This is wrong if trials convert.").missingParts).toEqual(["the offer to save confirmed facts as a business profile"]);
    // \bprofile\b fails after the underscore.
    expect(checkAnswer("Once you confirm these, I'll call save_business_profile.").missingParts).not.toContain("the offer to save confirmed facts as a business profile");
  });
  it("counts words the way wc -w does too, and reports the larger overrun", () => {
    // 1,000 reader words; a code span, a URL and 250 em dashes add 252 wc -w words.
    const t = "word ".repeat(998) + "`a b c` https://example.com/x " + "— ".repeat(250);
    const r = checkAnswer(t);
    expect(r.words).toBe(1000);
    expect(r.whitespaceWords).toBe(1252);
    expect(r.overBy).toBe(52);
    expect(r.problems[0]).toMatch(/^1252 words, 52 over the 1200-word limit.*Never cut privacy or private-page-indexing findings/);
  });
  it("doesn't count an Evidence or Appendix section, and sets the limit by deliverable", () => {
    const t = "word ".repeat(1100) + "\n\n## Evidence\n" + "- pricing.astro:12 says $20\n".repeat(100) + "\n## Open questions\nWhich price?";
    const r = checkAnswer(t);
    expect(r.appendixWords).toBe(402);
    expect(r.words).toBe(1100 + 4);
    expect(r.overBy).toBe(0);
    expect(checkAnswer("word ".repeat(1500)).overBy).toBe(300);
    expect(checkAnswer("word ".repeat(1500), undefined, "plan")).toMatchObject({ maxWords: 1800, overBy: 0 });
  });
  it("reminds to run verify_quotes when the text cites the repo", () => {
    expect(checkAnswer("The homepage says $20 (pricing.astro:263).").reminders.join(" ")).toMatch(/run verify_quotes/);
    expect(checkAnswer("ADR 0006 rules this out.").reminders.join(" ")).toMatch(/run verify_quotes/);
    expect(checkAnswer("See https://example.com:8080 now.").reminders.join(" ")).not.toMatch(/verify_quotes/);
  });
  it("checks jargon in time that grows with the text, not its square", () => {
    // 96 KB of one abbreviation, or of different ones, with no sentence break: 76 s before the uses were capped.
    const distinct = Array.from({ length: 12000 }, (_, i) => "Q" + String.fromCharCode(65 + (i % 26), 65 + ((i / 26) % 26 | 0), 65 + ((i / 676) % 26 | 0))).join(" ");
    for (const t of ["ABC ".repeat(24000), "CAC ".repeat(24000), distinct]) {
      const start = Date.now();
      checkAnswer(t);
      expect(Date.now() - start).toBeLessThan(3000);
    }
  });
  it("doesn't take a profile mentioned in advice as the profile offer", () => {
    const offer = "the offer to save confirmed facts as a business profile";
    expect(checkAnswer("Keep your ideal customer profile narrow.").missingParts).toContain(offer);
    expect(checkAnswer("Record the buyer profile in your CRM.").missingParts).toContain(offer);
    expect(checkAnswer("I can store these facts in your business profile.").missingParts).not.toContain(offer);
    expect(checkAnswer("Want me to save this as your profile?").missingParts).not.toContain(offer);
  });
  it("reads initials only from capitalised or adjacent words before the term", () => {
    expect(checkAnswer("Send a DM to each maintainer directly, mentioning the bug.").unexplainedTerms).toEqual(["DM"]);
    expect(checkAnswer("Add SSO so security officers stop asking.").unexplainedTerms).toEqual(["SSO"]);
    expect(checkAnswer("Record each architecture decision record as an ADR.").unexplainedTerms).toEqual([]);
  });
  it("finds 'win/loss', and still skips file paths", () => {
    expect(checkAnswer("Run win/loss interviews with 5 buyers.").unexplainedTerms).toEqual(["win/loss"]);
    expect(checkAnswer("See src/lib/ICP.ts and docs/CAC/x for details.").unexplainedTerms).toEqual([]);
  });
  it("doesn't flag emphasis words, times, currency codes or abbreviations most readers know", () => {
    const r = checkAnswer("TL;DR: You MUST fix SEO first. NEVER pay in USD. The CEO and CTO agree. Ship at 9 AM. Use AWS. The UI and UX need a CTA.");
    expect(r.unexplainedTerms).toEqual(["CTA"]);
  });
  it("keeps the verify_quotes reminder out of problems, and doesn't read host:port as a citation", () => {
    const r = checkAnswer("The homepage says $20 (pricing.astro:263). I'm wrong if 3 of 5 buyers pay. Open questions: which price? I can save these facts as a business profile.");
    expect(r.problems).toEqual([]);
    expect(r.reminders.join(" ")).toMatch(/run verify_quotes/);
    expect(checkAnswer("Point it at api.example.com:443 first.").reminders).toEqual([]);
    expect(checkAnswer("Open the docs at docs.stripe.com:1 now.").reminders).toEqual([]);
  });
});
