import { describe, it, expect } from "vitest";
import { checkAnswer } from "../src/lib/answerCheck.js";
import { cpuNow } from "./cpuTime.js";

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
    // A short answer to one narrow question: no stage map (tested below).
    expect(checkAnswer(t, undefined, "answer", { stageMap: false }).problems).toEqual([]);
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
    const r = checkAnswer("Churn is high. Fix the price first. I'm wrong if fewer than 1 in 10 buyers see the pricing page. Open questions: which price is current? I can save these facts as a business profile.", undefined, "answer", { stageMap: false });
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
      const start = cpuNow();
      checkAnswer(t);
      expect(cpuNow() - start).toBeLessThan(3000);
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
    const r = checkAnswer("The homepage says $20 (pricing.astro:263). I'm wrong if 3 of 5 buyers pay. Open questions: which price? I can save these facts as a business profile.", undefined, "answer", { stageMap: false });
    expect(r.problems).toEqual([]);
    expect(r.reminders.join(" ")).toMatch(/run verify_quotes/);
    expect(checkAnswer("Point it at api.example.com:443 first.").reminders).toEqual([]);
    expect(checkAnswer("Open the docs at docs.stripe.com:1 now.").reminders).toEqual([]);
  });
});

describe("checkAnswer: stage map", () => {
  // The parts every short answer above needs, so only the stage map is under test.
  const parts = "I'm wrong if fewer than 3 of 20 buyers reply. Open questions: which price is current? I can save these facts as a business profile.";
  const MAP = `## Stage map
- Positioning: constraint. Nobody can tell who it's for; see positioning.
- Offer and price: fine. $20 a month matches what buyers pay for the alternatives.
- Presence: unknown. I didn't open the app store listing.
- Discovery: later. Reach matters once the page says who it's for.
- Direct outreach: later. Worth it after positioning is fixed.
- Conversion: unknown. No sign-up numbers yet.
- Retention and referrals: fine. 4 of 5 early users still log in weekly.
- Legal limits: fine. No email lists yet, so no consent rules apply.
- Founder's time: constraint. Five hours a week; one move at a time.
- Measurement: unknown. No sign-up source is recorded; see check_tracking_events.`;
  const answer = (map: string) => `Fix positioning first. ${parts}\n\n${map}\n`;
  const issues = (map: string) => checkAnswer(answer(map)).stageMapIssues;

  it("passes a full map, and doesn't count it toward the word limit", () => {
    const r = checkAnswer(answer(MAP));
    expect(r.stageMapIssues).toEqual([]);
    expect(r.problems).toEqual([]);
    expect(r.stageMapWords).toBeGreaterThan(100);
    expect(r.words).toBe(checkAnswer(`Fix positioning first. ${parts}`, undefined, "answer", { stageMap: false }).words);
  });
  it("accepts the plain-words names and a table", () => {
    const plain = `## Stage map
- Who it's for and against what: constraint. No named buyer.
- Price: fine. Matches the alternatives.
- Site and profiles: unknown. Not opened.
- How strangers find you: later. After positioning.
- Cold outreach: later. After positioning.
- Sign-up or sales call: unknown. No numbers.
- Retention: fine. Users stay.
- Privacy and law: fine. No email list.
- Founder hours: fine. Ten hours a week.
- Tracking: unknown. Nothing recorded.`;
    expect(issues(plain)).toEqual([]);
    const table =
      `## Stage map\n\n| Stage | Status | Reason |\n|---|---|---|\n` +
      MAP.split("\n")
        .slice(1)
        .map((l) => {
          const [, stage, status, reason] = /^- (.+?): (\w+)\. (.*)$/.exec(l)!;
          return `| ${stage} | ${status} | ${reason} |`;
        })
        .join("\n");
    expect(issues(table)).toEqual([]);
  });
  it("asks for the section when the heading is missing", () => {
    const r = checkAnswer(`Fix positioning first. ${parts}`);
    expect(r.stageMapIssues).toHaveLength(1);
    expect(r.problems.join(" ")).toMatch(/No "## Stage map" section/);
    // A plan needs one too; a short single-question answer can opt out.
    expect(checkAnswer(`Fix positioning first. ${parts}`, undefined, "plan").stageMapIssues).toHaveLength(1);
    expect(checkAnswer(`Fix positioning first. ${parts}`, undefined, "answer", { stageMap: false })).toMatchObject({ stageMapIssues: [], problems: [] });
  });
  it("names the stages that have no line", () => {
    const r = issues(MAP.split("\n").filter((l) => !/Direct outreach|Measurement/.test(l)).join("\n"));
    expect(r).toHaveLength(1);
    expect(r[0]).toMatch(/direct outreach/);
    expect(r[0]).toMatch(/measurement/);
  });
  it("needs exactly one status per line", () => {
    const two = issues(MAP.replace("Conversion: unknown.", "Conversion: fine / unknown."));
    expect(two).toHaveLength(1);
    expect(two[0]).toMatch(/Conversion.*2 statuses \(fine, unknown\)/);
    const none = issues(MAP.replace("Conversion: unknown. No sign-up numbers yet.", "Conversion: no sign-up numbers yet."));
    expect(none).toHaveLength(1);
    expect(none[0]).toMatch(/Conversion.*no status/);
    // A status word in the reason is not a second status.
    expect(issues(MAP.replace("Worth it after positioning is fixed.", "Fine once positioning is fixed; revisit later."))).toEqual([]);
  });
  it("allows at most two constraints", () => {
    const r = issues(MAP.replace("Measurement: unknown.", "Measurement: constraint."));
    expect(r).toHaveLength(1);
    expect(r[0]).toMatch(/3 stages are marked constraint \(positioning, founder's time, measurement\)/);
  });
  it("caps each line at 30 words", () => {
    const long = "Nobody can tell who it's for, because the homepage lists every feature and names no buyer, no use and no alternative, so visitors leave within seconds of arriving on a phone.";
    const r = issues(MAP.replace("Nobody can tell who it's for; see positioning.", long));
    expect(r).toHaveLength(1);
    expect(r[0]).toMatch(/Positioning line has 3\d words; keep it to 30/);
  });
  it("passes a real-looking full answer with a valid map", () => {
    const full = `You have 4 paying customers and no clear buyer on the homepage. Fix who it's for before spending on reach.

## Moves

1. **Rewrite the homepage headline for one buyer.**
   Mechanism: visitors who see their own job in the headline stay to read the rest.
   Cheapest test: show two headlines to 5 past trial users on a call (cost: 2 hours).
   Metric: how many of the 5 can say who it's for after 10 seconds.
   Time box: 2 weeks.
   Stop: fewer than 3 of 5 can say it.

## Not yet

Skip paid ads until the headline test passes. Learn more: paid acquisition.

I'm wrong if 3 of 5 users already describe the same buyer. Open questions: which customer pays most? I can save these facts as a business profile.

${MAP}

Learn more: positioning, first customers.`;
    const r = checkAnswer(full);
    expect(r.stageMapIssues).toEqual([]);
    expect(r.moveIssues).toEqual([]);
    expect(r.problems).toEqual([]);
  });
});

// Improvement doc avenue 6 (2026-10-28): a Spanish answer got no move issues with its stop line deleted, and was told
// its falsifier and open questions were missing though both were there. The checks match English words; they now
// say so instead of passing the answer or reporting parts missing.
describe("checks that match English words say when they didn't run", () => {
  const spanish = `## Diagnóstico

Tu consulta tiene clientes, pero nadie fuera de tu círculo sabe que existe. El problema no es el precio.

## Movimientos

1. **Escribe a 20 colegas que derivan pacientes.** Mecanismo: un colega que te conoce manda pacientes. Prueba más barata: cinco mensajes esta semana. Métrica: respuestas. Plazo: 3 semanas.

## Qué demostraría que me equivoco

Si menos de 2 de 20 colegas responden, el problema no es que no te conozcan.

## Preguntas abiertas

¿Cuántos pacientes nuevos tuviste en los últimos 28 días? ¿Quieres que guarde estos datos en tu perfil?`;
  it("a Spanish answer: no parts reported missing, no move issues, and a line saying why", () => {
    const r = checkAnswer(spanish, undefined, "answer", { stageMap: false });
    expect(r.missingParts).toEqual([]);
    expect(r.moveIssues).toEqual([]);
    expect(r.problems.join(" ")).not.toMatch(/Not found/);
    expect(r.notChecked.join(" ")).toMatch(/doesn't look like English.*moves, the parts the instructions ask for.*did not run/);
    expect(r.notChecked.join(" ")).toMatch(/Checked: word count, evidence labels/);
  });
  it("tells Portuguese and French from English, and English with tables and terms from both", async () => {
    const { englishShare } = await import("../src/lib/answerCheck.js");
    const pt = "Seu consultório tem clientes, mas ninguém fora do seu círculo sabe que você existe. O problema não é o preço. Escreva para vinte colegas que encaminham pacientes, e peça a cada um que indique o seu trabalho a quem precisa. Se menos de dois responderem em três semanas, o problema não é que não conhecem você. Quantos pacientes novos você teve nos últimos 28 dias? Quer que eu salve esses dados no seu perfil?";
    const fr = "Votre cabinet a des clients, mais personne en dehors de votre cercle ne sait que vous existez. On ne règle pas ça par le prix. Écrivez à vingt confrères qui orientent des patients, et demandez à chacun de vous recommander. Si moins de deux répondent en trois semaines, le problème ne vient pas de la notoriété. Combien de nouveaux patients avez-vous eu ces 28 derniers jours? Voulez-vous que je garde ces données dans votre profil?";
    expect(englishShare(pt)).toBeLessThan(0.08);
    expect(englishShare(fr)).toBeLessThan(0.08);
    expect(englishShare(spanish)).toBeLessThan(0.08);
    const en = "| Stage | Status |\n|---|---|\n| SEO | fine |\n\nThe site is fine; the problem is reach. Write to the ten people who use it and ask how they found it, then compare their answers with what the homepage says. If fewer than 2 of 10 reply, the problem is not reach but the offer itself, and that would change which move comes first.";
    expect(englishShare(en)).toBeGreaterThan(0.15);
  });
  it("an English answer whose moves aren't found says the move check didn't run", () => {
    const r = checkAnswer("## Diagnosis\n\nThe site is fine; the problem is reach.\n\n## What to do\n\nWrite to the ten people who use it and ask how they found it.\n\n## Risks\n\nIt might not work. What would prove me wrong: fewer than 2 of 10 reply.", undefined, "answer", { stageMap: false });
    expect(r.notChecked.join(" ")).toMatch(/No moves found/);
  });
  it("says nothing when the answer is English and its moves are found", () => {
    const r = checkAnswer("## Moves\n\n1. **Interview 5 users.** Mechanism: x. Cheapest test: 5 calls. Metric: replies. Time box: 2 weeks. Stop: fewer than 3 of 5 reply.\n\n## Risks\n\nNone.\n\n## Open questions\n\nHow many pay?", undefined, "answer", { stageMap: false });
    expect(r.notChecked).toEqual([]);
  });
});
