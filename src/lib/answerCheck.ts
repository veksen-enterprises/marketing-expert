// Mechanical checks on the advisor's own draft before it is sent. Round-2 and round-3 evals showed
// that instructions alone don't keep answers under the length limit or free of unexplained jargon:
// models don't count words reliably. This counts them, and checks moves, labels and jargon the same way.

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { checkLabels, type LabelFinding } from "./labelCheck.js";
import { KNOWLEDGE_DIR } from "./knowledge.js";
import { lintMoves } from "./moveCheck.js";

export interface AnswerCheck {
  /** Identifies the checked text: first words plus a hash of the whitespace-normalised text. Log it, so a reviewer can confirm the text sent is the text checked. */
  fingerprint: string;
  /** Words as a reader counts them: a code span or URL is one word. Excludes an "## Evidence" or "## Appendix" section. */
  words: number;
  /** Words as `wc -w` counts them (anything between spaces, an em dash included), same sections excluded. */
  whitespaceWords: number;
  /** Words in "## Evidence" / "## Appendix" sections, which don't count toward maxWords. */
  appendixWords: number;
  maxWords: number;
  /** Over the limit by the larger of the two counts. */
  overBy: number;
  bannedWords: string[];
  unexplainedTerms: string[];
  /** Common words with a marketing meaning (churn, cohort) used without a gloss. A reminder only; not in problems. */
  considerExplaining: string[];
  /** Parts the server instructions ask for that weren't found by keyword. Phrasing varies, so treat these as reminders. */
  missingParts: string[];
  /** Evidence labels that look stronger than, or less qualified than, the playbook passage they come from. */
  labelIssues: LabelFinding[];
  /** Moves that bundle actions, lack a field of the move format, or have a stop line with no number. */
  moveIssues: string[];
  problems: string[];
  /** Steps to take once, such as verify_quotes for repo citations. Not in problems: the check can't see that they were done. */
  reminders: string[];
}

/** Default word limits: a direct answer, and a 90-day plan, which has more required parts. */
export const WORD_LIMITS = { answer: 1200, plan: 1800 } as const;
const APPENDIX_MAX = 600;

const PARTS: Array<[string, RegExp]> = [
  ["what would prove the diagnosis wrong", /prove[sd]? (me|this|it|that) wrong|I'?m wrong if|I'?d be wrong|would change my mind|this is wrong if|disprove|falsif/i],
  ["open questions for the founder", /open questions|questions for you|what I need from you|to confirm:/i],
  // An offer of the business profile, not any "profile": "keep your ideal customer profile narrow" isn't one.
  // \b fails inside save_business_profile, so it is named.
  ["the offer to save confirmed facts as a business profile", /save_business_profile|\b(save|store)\b[^.?!\n]{0,40}\b(business|your) profile\b|\bbusiness profile\b/i],
];

const BANNED = ["moat", "moats", "flywheel", "synergy", "game-changer", "game changer", "best-in-class", "world-class"];
// Abbreviations and terms a non-native reader may not know.
const JARGON = ["ICP", "LTV", "CAC", "ARR", "MRR", "NRR", "GRR", "SAM", "SOM", "TAM", "PLG", "PQL", "MQL", "SQL lead", "ABM", "CRO", "ROAS", "CPA", "CPC", "CTR", "SERP", "GTM", "JTBD", "P&L", "HN", "DTC", "CPG", "SKU", "AOV", "RMT", "counter-positioning", "atomic network", "core loop", "growth loop", "north star", "dark social", "incrementality", "H1", "noindex", "canonical", "SSR", "CSR", "hydration", "hreflang", "LCP", "CLS", "INP", "soft 404", "structured data",
  // Flagged by graders, and missing from the glossary.
  "overlay model", "aggregator", "liquidity", "webhook", "OCR", "UTM", "ORM", "CI gate", "DM", "gzip", "lastmod", "switch interview", "win/loss", "re:Invent", "absorption", "301 redirect", "302 redirect", "307 redirect", "308 redirect"];
// Common words with a marketing meaning: worth a gloss, but too common to list as problems.
const CONSIDER = ["positioning", "activation", "churn", "cohort", "sustaining"];
// All-caps words most readers know, emphasis words, times and currency codes. Any other 2-5 capital letters
// (ADR, SSO, MCP) count as an abbreviation.
const KNOWN = new Set(["API", "URL", "CI", "PR", "AI", "SQL", "JSON", "CLI", "SDK", "US", "EU", "UK", "HTML", "CSS", "PDF", "CSV", "FAQ", "ID", "HTTP", "KB", "MB", "GB", "OK", "TV", "NOT", "NO", "DO", "OR", "AND", "ALL", "ONLY",
  "MUST", "NEVER", "NOTE", "TL", "DR", "AM", "PM", "USD", "EUR", "GBP", "SEO", "CEO", "CTO", "UI", "UX", "AWS"]);
const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let glossaryCache: Map<string, string> | null = null;
/** Abbreviations in knowledge/glossary.md ("- **ABM (account-based marketing)**", "- **Confidence interval (CI)**") and their expansions. */
function glossary(): Map<string, string> {
  if (glossaryCache) return glossaryCache;
  glossaryCache = new Map();
  let raw = "";
  try {
    raw = readFileSync(join(KNOWLEDGE_DIR, "glossary.md"), "utf8");
  } catch {
    return glossaryCache;
  }
  for (const m of raw.matchAll(/^- \*\*([^*(]+?)\s*\(([^)*]+)\)\*\*/gm)) {
    const [head, paren] = [m[1].trim(), m[2].trim()];
    const abbr = /^[A-Z][A-Z0-9&]{1,5}$/;
    if (abbr.test(head) && !KNOWN.has(head)) glossaryCache.set(head, paren);
    else if (abbr.test(paren) && !KNOWN.has(paren)) glossaryCache.set(paren, head);
  }
  return glossaryCache;
}

/** True if the words of `s` include a run whose initials spell `abbr` ("Hacker News" for HN). Two letters match by
 * chance ("directly mentioning" for DM), so those need capitalised words. */
function initialsIn(s: string, abbr: string): boolean {
  const words = s.match(/[\p{L}\p{N}]+/gu) ?? [];
  const a = abbr.toUpperCase();
  for (let i = 0; a.length > 1 && i + a.length <= words.length; i++)
    if (words.slice(i, i + a.length).every((w, j) => w[0].toUpperCase() === a[j] && (a.length > 2 || /^\p{Lu}/u.test(w)))) return true;
  return false;
}

/** A use counts as explained when a gloss follows it in the same sentence ("ORM (a database library)", "LTV: meaning…",
 * "CI gate — a check…"), when it is the whole bracket after its expansion ("… (ICP)"), when the expansion is near it in
 * the same sentence or the initials' words come up to 12 words before it, or when the next sentence starts "That means".
 * Only text near the use is read, so a long sentence with many uses doesn't take time growing with its square. */
function explained(sentence: string, idx: number, len: number, expansion: string | undefined, next: string, abbr: boolean): boolean {
  const before = sentence.slice(Math.max(0, idx - 300), idx);
  const after = sentence.slice(idx + len, idx + len + 300);
  if (/\(\s*$/.test(before) && /^\s*\)/.test(after)) return true;
  if (/^(?:[\s-]+[\p{L}\p{N}'’-]+)?\s*(?:\(|[—–]\s|-\s|,?\s*(?:meaning|which means|means|i\.e\.|that is)\b|:\s*(?:meaning|the|a|an)\b)/iu.test(after)) return true;
  const rest = (before + " " + after).toLowerCase();
  if (expansion && rest.includes(expansion.toLowerCase().replace(/\s*\(.*$/, ""))) return true;
  if (abbr && initialsIn(before.split(/\s+/).slice(-13).join(" "), sentence.slice(idx, idx + len).replace(/e?s$/, ""))) return true;
  return /^(that|this|it) means\b|^i\.e\.|^in other words\b/i.test(next.trim());
}

/** Terms used with no explanation at any use. */
function unexplained(text: string): { terms: string[]; consider: string[] } {
  // Code, URLs and file paths aren't prose. A path has a file extension or two slashes; "win/loss" has neither.
  const prose = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\b[\w-]+(?:\/[\w.-]+)+/g, (p) => (/\.\w|\/.*\//.test(p) ? " " : p));
  const sentences = prose.split(/\n+|(?<=[.!?])\s+/);
  const gloss = glossary();
  const found = new Set<string>();
  // Not a name like "OAI-SearchBot". Each term is looked up in the whole text, so stop at 50.
  for (const m of prose.matchAll(/(?<![\p{L}\p{N}_])([A-Z]{2,5})s?(?![\p{L}\p{N}_]|-\p{L})/gu)) if (!KNOWN.has(m[1]) && found.size < 50) found.add(m[1]);
  const candidates = [...new Set([...JARGON, ...gloss.keys(), ...found])];
  const check = (terms: string[]) =>
    terms.filter((t) => {
      const abbr = /^[A-Z0-9&]+$/.test(t);
      // Abbreviations match case-sensitively; other terms in any case. Either may be plural ("MQLs").
      const re = new RegExp(`(?<![\\p{L}\\p{N}_])${esc(t)}(?:s|es)?(?![\\p{L}\\p{N}_])`, abbr ? "gu" : "giu");
      let uses = 0;
      for (let i = 0; i < sentences.length; i++) {
        for (const m of sentences[i].matchAll(re)) {
          if (explained(sentences[i], m.index!, m[0].length, gloss.get(t), sentences[i + 1] ?? "", abbr)) return false;
          // An explanation comes at or near the first use; reading every use of a common term is slow on long text.
          if (++uses === 20) return true;
        }
      }
      return uses > 0;
    });
  return { terms: check(candidates), consider: check(CONSIDER) };
}

/** Removes "## Evidence" / "## Appendix" sections (to the next heading of the same or higher level). */
function splitAppendix(text: string): { body: string; appendix: string } {
  const lines = text.split("\n");
  const body: string[] = [];
  const appendix: string[] = [];
  let level = 0;
  for (const line of lines) {
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h && level && h[1].length <= level) level = 0;
    if (h && !level && h[1].length <= 3 && /^(evidence|appendix)\b/i.test(h[2].replace(/[*_]/g, ""))) level = h[1].length;
    (level ? appendix : body).push(line);
  }
  return { body: body.join("\n"), appendix: appendix.join("\n") };
}

export function checkAnswer(text: string, maxWords?: number, deliverable: keyof typeof WORD_LIMITS = "answer"): AnswerCheck {
  const limit = maxWords ?? WORD_LIMITS[deliverable];
  const { body, appendix } = splitAppendix(text);
  // Count prose words; code spans and URLs count as one word each, like a reader sees them.
  const count = (t: string) => {
    const plain = t.replace(/```[\s\S]*?```/g, " code ").replace(/`[^`]*`/g, " x ").replace(/https?:\/\/\S+/g, " url ");
    return (plain.match(/[\p{L}\p{N}][\p{L}\p{N}'’.%$-]*/gu) ?? []).length;
  };
  const words = count(body);
  // Graders count with wc -w, which also counts dashes and symbols between spaces and every word in a code span.
  const whitespaceWords = body.split(/\s+/).filter(Boolean).length;
  const appendixWords = appendix.split(/\s+/).filter(Boolean).length;
  const lower = text.toLowerCase();
  const bannedWords = BANNED.filter((w) => new RegExp(`\\b${w.replace(/[-\s]/g, "[-\\s]")}\\b`, "i").test(lower));
  const { terms: unexplainedTerms, consider: considerExplaining } = unexplained(text);
  const problems: string[] = [];
  const counted = Math.max(words, whitespaceWords);
  const overBy = Math.max(0, counted - limit);
  if (overBy)
    problems.push(
      `${counted} words, ${overBy} over the ${limit}-word limit. Cut status tables to the rows that change the advice, competitor lists to the few that matter, and secondary findings to one line each, then check again. Never cut privacy or private-page-indexing findings; a one-line finding keeps its mechanism and scope.`
    );
  if (appendixWords > APPENDIX_MAX) problems.push(`The Evidence/Appendix section has ${appendixWords} words; keep it under ${APPENDIX_MAX}, one line per file:line finding.`);
  if (bannedWords.length) problems.push(`Replace: ${bannedWords.join(", ")} (say what you mean in plain words).`);
  if (unexplainedTerms.length) problems.push(`Explain on first use, in brackets, or replace: ${unexplainedTerms.join(", ")}.`);
  const norm = text.replace(/\s+/g, " ").trim();
  const fingerprint = `${createHash("sha256").update(norm).digest("hex").slice(0, 10)} "${norm.split(" ").slice(0, 6).join(" ")}…"`;
  const missingParts = PARTS.filter(([, re]) => !re.test(text)).map(([name]) => name);
  if (missingParts.length) problems.push(`Not found (ignore if it's there in other words): ${missingParts.join("; ")}.`);
  const labelIssues = checkLabels(text).filter((l) => l.status !== "ok" && l.status !== "no-source");
  for (const l of labelIssues) {
    const claim = `"${l.claim.slice(0, 80)}…"`;
    const src = `${l.source}: [${l.sourceLabels.join("], [")}]`;
    if (l.status === "upgraded") problems.push(`Label [${l.answerLabel}] is stronger than the source (${src}): ${claim}`);
    else if (l.status === "merged") problems.push(`Label [${l.answerLabel}] mixes two evidence levels; copy the playbook's label as written: ${claim}`);
    else if (l.status === "unlabelled-reuse" || !l.answerLabel) problems.push(`Add the playbook's label [${l.sourceLabels.join("; ")}] (${l.source}): ${claim}`);
    else problems.push(`Label [${l.answerLabel}] drops the source's qualifier (${src}): ${claim}. Copy the whole bracket.`);
  }
  const { issues: moveIssues } = lintMoves(body);
  problems.push(...moveIssues);
  // A repo citation (pricing.astro:263, ADR 0006) means quotes to check; a host and port (api.example.com:443) doesn't.
  const reminders: string[] = [];
  const cite = /\b[\w./-]+\.(?!(?:com|org|net|io|dev|ai|co|app)\b)[a-z][a-z0-9]{0,4}:\d+|\bADR[\s-]?\d{2,4}\b/i.exec(text.replace(/https?:\/\/\S+/g, " "));
  if (cite) reminders.push(`Cites the repo (${cite[0]}); run verify_quotes on this exact text, if you haven't.`);
  return { fingerprint, words, whitespaceWords, appendixWords, maxWords: limit, overBy, bannedWords, missingParts, labelIssues, moveIssues, unexplainedTerms, considerExplaining, problems, reminders };
}
