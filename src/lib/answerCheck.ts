// Mechanical checks on the advisor's own draft before it is sent. Round-2 and round-3 evals showed
// that instructions alone don't keep answers under the length limit or free of unexplained jargon:
// models don't count words reliably. This counts them.

import { createHash } from "node:crypto";

export interface AnswerCheck {
  /** Identifies the checked text: first words plus a hash of the whitespace-normalised text. Log it, so a reviewer can confirm the text sent is the text checked. */
  fingerprint: string;
  words: number;
  maxWords: number;
  overBy: number;
  bannedWords: string[];
  unexplainedTerms: string[];
  problems: string[];
}

const BANNED = ["moat", "moats", "flywheel", "synergy", "game-changer", "game changer", "best-in-class", "world-class"];
// Abbreviations and terms a non-native reader may not know. Explained = followed within a few words by "(" or ", meaning", or preceded by an expansion in parentheses.
const JARGON = ["ICP", "LTV", "CAC", "ARR", "MRR", "NRR", "GRR", "SAM", "SOM", "TAM", "PLG", "PQL", "MQL", "SQL lead", "ABM", "CRO", "ROAS", "CPA", "CPC", "CTR", "SERP", "GTM", "JTBD", "P&L", "HN", "DTC", "CPG", "SKU", "AOV", "RMT", "counter-positioning", "atomic network", "core loop", "growth loop", "north star", "dark social", "incrementality", "H1", "noindex", "canonical", "SSR", "CSR", "hydration", "hreflang", "LCP", "CLS", "INP", "soft 404", "structured data"];

export function checkAnswer(text: string, maxWords = 1200): AnswerCheck {
  // Count prose words; code spans and URLs count as one word each, like a reader sees them.
  const plain = text.replace(/```[\s\S]*?```/g, " code ").replace(/`[^`]*`/g, " x ").replace(/https?:\/\/\S+/g, " url ");
  const words = (plain.match(/[\p{L}\p{N}][\p{L}\p{N}'’.%$-]*/gu) ?? []).length;
  const lower = text.toLowerCase();
  const bannedWords = BANNED.filter((w) => new RegExp(`\\b${w.replace(/[-\s]/g, "[-\\s]")}\\b`, "i").test(lower));
  const unexplainedTerms = JARGON.filter((t) => {
    const re = new RegExp(`(^|[^\\p{L}])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}])`, "gu");
    const m = re.exec(text);
    if (!m) return false;
    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 16);
    const before = text.slice(Math.max(0, m.index - 3), m.index + 1);
    return !/^\s*\(/.test(after) && !/^\s*[:,]\s*(meaning|i\.e\.|the )/i.test(after) && !/\(\s*$/.test(before);
  });
  const problems: string[] = [];
  const overBy = Math.max(0, words - maxWords);
  if (overBy) problems.push(`${words} words, ${overBy} over the ${maxWords}-word limit. Cut status tables to the rows that change the advice, competitor lists to the few that matter, and secondary findings to one line each, then check again.`);
  if (bannedWords.length) problems.push(`Replace: ${bannedWords.join(", ")} (say what you mean in plain words).`);
  if (unexplainedTerms.length) problems.push(`Explain on first use, in brackets, or replace: ${unexplainedTerms.join(", ")}.`);
  const norm = text.replace(/\s+/g, " ").trim();
  const fingerprint = `${createHash("sha256").update(norm).digest("hex").slice(0, 10)} "${norm.split(" ").slice(0, 6).join(" ")}…"`;
  return { fingerprint, words, maxWords, overBy, bannedWords, unexplainedTerms, problems };
}
