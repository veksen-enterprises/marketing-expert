// Layered reading: search_playbooks and match_small_bets give a short summary and a pointer; learn_more expands one
// pointer (a section, a playbook, one small bet, a glossary term, or plain words) into the detail, the business
// terms it uses with their plain meaning, its evidence and where to go next.
import { describe, it, expect } from "vitest";
import { sections, searchKnowledge } from "../src/lib/knowledge.js";
import { learnMore } from "../src/lib/learnMore.js";
import { plainGloss } from "../src/lib/answerCheck.js";
import { BETS } from "../src/lib/smallBetsCatalog.js";
import { checkAnswer } from "../src/lib/answerCheck.js";

describe("section summaries and pointers", () => {
  it("every section has a short summary and a pointer", () => {
    for (const s of sections()) {
      expect(s.summary.length, `${s.slug} › ${s.heading}`).toBeGreaterThan(0);
      expect(s.summary.split(/\s+/).length, `${s.slug} › ${s.heading}`).toBeLessThanOrEqual(60);
      expect(s.pointer).toBe(`playbook:${s.slug}#${s.heading}`);
    }
  });
  it("uses the written '_In short:_' line when the section has one", () => {
    for (const s of sections().filter((x) => /^_In short:_/m.test(x.text))) {
      expect(s.text, s.pointer).toContain(`_In short:_ ${s.summary}`);
    }
  });
  it("search results carry the summary and pointer", () => {
    const [hit] = searchKnowledge("paid pilot security questionnaire", 1);
    expect(hit.slug).toBe("founder-led-sales");
    expect(hit.summary).toBeTruthy();
    expect(hit.pointer).toMatch(/^playbook:founder-led-sales#/);
  });
});

describe("learn_more", () => {
  it("expands a section: detail, plain meaning of its terms, evidence, and where next", () => {
    const s = sections().find((x) => x.slug === "metrics-and-measurement" && /CAC|payback|unit/i.test(x.text))!;
    const r = learnMore(s.pointer);
    expect(r).toMatchObject({ kind: "section", title: `${s.playbookTitle} › ${s.heading}`, inShort: s.summary });
    expect(r.details).not.toMatch(/^## /);
    expect(r.terms.length).toBeGreaterThan(0);
    for (const t of r.terms) expect(t.plain).toBe(plainGloss().get(t.term) ?? plainGloss().get(t.term.toLowerCase()));
    expect(r.learnMore.length).toBeGreaterThan(0);
    expect(r.learnMore.every((p) => p.pointer !== s.pointer)).toBe(true);
  });
  it("expands a whole playbook into its section summaries", () => {
    const r = learnMore("playbook:small-bets");
    expect(r.kind).toBe("playbook");
    expect(r.learnMore.length).toBeGreaterThan(3);
    expect(r.learnMore.every((p) => p.pointer.startsWith("playbook:small-bets#"))).toBe(true);
  });
  it("expands one small bet: its catalog entry, the playbook paragraph and the closest research", () => {
    const b = BETS.find((x) => x.id === "founder-emails")!;
    const r = learnMore("bet:founder-emails");
    expect(r).toMatchObject({ kind: "bet", title: b.name, inShort: b.what });
    expect(r.details).toContain(b.stop);
    expect(r.details).toMatch(/Effort: \d+ hours/);
    expect(r.details).toContain("Email every new sign-up");
    expect(r.sources).toMatch(/research\/small-bets-direct\.md/);
  });
  it("matches abbreviations only in capitals, so a path like early-stage-gtm isn't GTM", () => {
    expect(learnMore("bet:fix-famous-projects").terms.map((t) => t.term)).not.toContain("gtm");
  });
  it("expands a glossary term", () => {
    const r = learnMore("term:CAC");
    expect(r).toMatchObject({ kind: "term", inShort: plainGloss().get("CAC") });
    expect(r.learnMore.length).toBeGreaterThan(0);
  });
  it("expands plain words to the best match and offers the others", () => {
    const r = learnMore("how do I run a paid pilot");
    expect(r.kind).toBe("section");
    expect(r.title).toMatch(/Founder-led sales|First customers/i);
    expect(r.note).toMatch(/best match/);
  });
  it("says what exists when a pointer is wrong", () => {
    expect(() => learnMore("bet:nope")).toThrow(/founder-emails/);
    expect(() => learnMore("playbook:nope#x")).toThrow(/small-bets/);
  });
  it("match_small_bets verdicts carry a pointer", async () => {
    const { matchSmallBets } = await import("../src/lib/smallBets.js");
    expect(matchSmallBets({}).fitsNow[0].learnMore).toMatch(/^bet:/);
  });
});

describe("check_answer: learn-more lines", () => {
  it("reminds when an answer with sections offers nothing to expand", () => {
    const text = "## The constraint\nIt's activation.\n\n## Moves\nOne move.";
    expect(checkAnswer(text).reminders.join(" ")).toMatch(/Learn more/);
    expect(checkAnswer(`${text}\nLearn more: activation, paid pilots`).reminders.join(" ")).not.toMatch(/Learn more/);
  });
});
