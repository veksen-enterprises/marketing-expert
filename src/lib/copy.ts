// Deterministic copy signals. These are cheap proxies, not a quality score:
// they catch the things editors catch first (vagueness, hype, writer-centric framing, length).

import { PLATFORM_LIMITS, countChars, CHECKED_ON } from "./platformLimits.js";

const VAGUE_TERMS: Record<string, string> = {
  "revolutionary": "claims novelty without evidence",
  "revolutionize": "claims novelty without evidence",
  "game-changing": "claims impact without evidence",
  "game changer": "claims impact without evidence",
  "cutting-edge": "says nothing a competitor couldn't say",
  "state-of-the-art": "says nothing a competitor couldn't say",
  "next-generation": "says nothing a competitor couldn't say",
  "next-gen": "says nothing a competitor couldn't say",
  "innovative": "self-applied label; show the innovation instead",
  "world-class": "unverifiable superlative",
  "best-in-class": "unverifiable superlative",
  "industry-leading": "unverifiable unless you cite the ranking",
  "leading": "unverifiable unless you cite the ranking",
  "seamless": "the reader doesn't believe it; describe the actual steps or time",
  "seamlessly": "the reader doesn't believe it; describe the actual steps or time",
  "effortless": "the reader doesn't believe it; describe the actual steps or time",
  "effortlessly": "the reader doesn't believe it; describe the actual steps or time",
  "robust": "vague; name the property (uptime, limits, failure handling)",
  "powerful": "vague; name what it can do",
  "leverage": "jargon for 'use'",
  "synergy": "jargon",
  "synergies": "jargon",
  "unlock": "overused metaphor; name the outcome",
  "unleash": "overused metaphor; name the outcome",
  "empower": "vague; name what the reader can now do",
  "supercharge": "overused metaphor; quantify",
  "elevate": "vague; name the change",
  "streamline": "vague; say what step disappears or how much time is saved",
  "optimize": "vague without a metric",
  "solution": "category noun that hides what the product is",
  "all-in-one": "often signals unclear positioning; name the 2–3 jobs it replaces",
  "end-to-end": "often signals unclear positioning",
  "holistic": "vague",
  "transform": "vague; name the before/after",
  "transformative": "vague; name the before/after",
  "ai-powered": "feature label, not a benefit; say what the AI does for the reader",
  "simple": "claim it by showing the steps",
  "easy": "claim it by showing the steps or setup time",
  "fast": "quantify",
  "scalable": "vague; give the limit or the customer size you serve",
};

// Words that are fine when backed up on the page; flag softly.
const SOFT_TERMS = new Set(["simple", "easy", "fast", "powerful", "leading", "optimize", "solution"]);

const HEDGES = ["may help", "can help", "helps you", "could potentially", "might", "aims to", "strives to", "designed to help"];
const HEDGE_RES = HEDGES.map((h) => [h, new RegExp(`(?<![a-z])${h}(?![a-z])`)] as const);

// Reader and writer pronouns, contractions included (you'll, you've, we'd, yourself).
const YOU_RE = /^(?:you(?:['’](?:re|ll|ve|d))?|yours?|yourself|yourselves)$/;
const WE_RE = /^(?:we(?:['’](?:re|ll|ve|d))?|us|our|ours|ourselves)$/;

const PASSIVE_RE = /\b(is|are|was|were|be|been|being)\s+(\w+ed|built|made|done|given|shown|known|seen|taken|written|chosen)\b/gi;

export function countSyllables(word: string): number {
  let w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = w.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

export interface Readability {
  words: number;
  sentences: number;
  avgWordsPerSentence: number;
  longestSentenceWords: number;
  /** null when the text is mostly not in Latin script: Flesch formulas are for English. */
  fleschReadingEase: number | null;
  fleschKincaidGrade: number | null;
  note?: string;
}

export function splitSentences(text: string): string[] {
  // Lines first: headlines and bullets usually have no end punctuation.
  return text
    .split(/\n+/)
    .flatMap((l) => l.replace(/\s+/g, " ").split(/(?<=[.!?])\s+|(?<=[。！？])/))
    .map((s) => s.trim())
    .filter((s) => /[\p{L}\p{N}]/u.test(s));
}

export function words(text: string): string[] {
  return text.match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}'’-]*/gu) ?? [];
}

export function readability(text: string): Readability {
  const sents = splitSentences(text);
  const ws = words(text);
  const nW = Math.max(1, ws.length);
  const nS = Math.max(1, sents.length);
  const syl = ws.reduce((s, w) => s + countSyllables(w), 0);
  const letters = (text.match(/\p{L}/gu) ?? []).length;
  const latin = letters > 0 && (text.match(/\p{Script=Latin}/gu) ?? []).length / letters >= 0.5;
  return {
    words: ws.length,
    sentences: sents.length,
    avgWordsPerSentence: ws.length / nS,
    longestSentenceWords: sents.reduce((m, s) => Math.max(m, words(s).length), 0),
    fleschReadingEase: latin ? 206.835 - 1.015 * (nW / nS) - 84.6 * (syl / nW) : null,
    fleschKincaidGrade: latin ? 0.39 * (nW / nS) + 11.8 * (syl / nW) - 15.59 : null,
    ...(latin ? {} : { note: "Most of this text is not in Latin script. Flesch scores work for English only, so they are not given; word counts are rough." }),
  };
}

export interface CopyFlag {
  type: "vague" | "hedge" | "passive" | "length" | "punctuation" | "framing" | "specificity";
  severity: "error" | "warning" | "info";
  message: string;
  excerpt?: string;
}

export interface CopyAnalysis {
  readability: Readability;
  youCount: number;
  weCount: number;
  numbersCount: number;
  flags: CopyFlag[];
}

export function analyzeCopy(text: string): CopyAnalysis {
  const flags: CopyFlag[] = [];
  const lower = text.toLowerCase();
  for (const [term, why] of Object.entries(VAGUE_TERMS)) {
    const base = term.replace(/[-]/g, "[- ]?");
    const inflected = term.endsWith("e") ? `${base.slice(0, -1)}(?:e|es|ed|ing)` : `${base}(?:s|es|ed|ing)?`;
    const re = new RegExp(`(?<![a-z-])${inflected}(?![a-z-])`, "gi");
    const m = lower.match(re);
    if (m) flags.push({ type: "vague", severity: SOFT_TERMS.has(term) ? "info" : "warning", message: `"${term}" ×${m.length}: ${why}`, excerpt: excerptAround(text, re) });
  }
  for (const [h, re] of HEDGE_RES) {
    if (re.test(lower)) flags.push({ type: "hedge", severity: "info", message: `Hedge "${h}" weakens the claim; state what happens, or drop it.` });
  }
  const passives = text.match(PASSIVE_RE) ?? [];
  if (passives.length) {
    flags.push({ type: "passive", severity: "info", message: `${passives.length} likely passive construction(s) (heuristic): ${passives.slice(0, 5).join("; ")}` });
  }
  const excl = (text.match(/!/g) ?? []).length;
  if (excl > 1) flags.push({ type: "punctuation", severity: "info", message: `${excl} exclamation marks. Enthusiasm in punctuation reads as low confidence.` });

  const ws = words(lower);
  const you = ws.filter((w) => YOU_RE.test(w)).length;
  const we = ws.filter((w) => WE_RE.test(w)).length;
  if (we > you && we >= 3) {
    flags.push({ type: "framing", severity: "warning", message: `Writer-centric: ${we} we/our vs ${you} you/your. Copy is about the company, not the reader's problem.` });
  }
  const numbers = (text.match(/\b\d[\d,.]*\s*(%|x|×|k|m|min|minutes|hours|days|seconds|s)?\b/gi) ?? []).length;
  const r = readability(text);
  if (r.words >= 40 && numbers === 0) {
    flags.push({ type: "specificity", severity: "info", message: "No numbers in 40+ words. Concrete figures (time saved, customers, price, limits) are the cheapest credibility you can add." });
  }
  if (r.longestSentenceWords > 30) {
    flags.push({ type: "length", severity: "info", message: `Longest sentence is ${r.longestSentenceWords} words; consider splitting.` });
  }
  return { readability: r, youCount: you, weCount: we, numbersCount: numbers, flags };
}

function excerptAround(text: string, re: RegExp): string | undefined {
  const m = new RegExp(re.source, "i").exec(text);
  if (!m) return undefined;
  const start = Math.max(0, m.index - 30);
  return (start > 0 ? "…" : "") + text.slice(start, m.index + m[0].length + 30).replace(/\s+/g, " ") + "…";
}

export interface LimitCheck {
  platform: string;
  field: string;
  text: string;
  length: number;
  max?: number;
  recommended?: number;
  status: "ok" | "over_recommended" | "over_max" | "unverified_limit" | "no_known_limit";
  note?: string;
}

export function checkLimits(platform: string, fields: Record<string, string | string[]>): { checks: LimitCheck[]; source: string; checkedOn: string } {
  // Own properties only: "constructor" or "toString" are not platforms or fields.
  const spec = Object.hasOwn(PLATFORM_LIMITS, platform) ? PLATFORM_LIMITS[platform] : undefined;
  if (!spec) throw new RangeError(`unknown platform "${platform}". Known: ${Object.keys(PLATFORM_LIMITS).join(", ")}`);
  if (Object.keys(fields).length === 0) throw new RangeError(`no fields to check. Known fields for ${platform}: ${Object.keys(spec.fields).join(", ")}`);
  const checks: LimitCheck[] = [];
  for (const [field, value] of Object.entries(fields)) {
    const lim = Object.hasOwn(spec.fields, field) ? spec.fields[field] : undefined;
    if (!lim) throw new RangeError(`unknown field "${field}" for ${platform}. Known: ${Object.keys(spec.fields).join(", ")}`);
    for (const t of Array.isArray(value) ? value : [value]) {
      const len = countChars(t, spec.counting);
      let status: LimitCheck["status"] = lim.max === undefined && lim.recommended === undefined ? "no_known_limit" : "ok";
      if (lim.max !== undefined && len > lim.max) status = lim.verified ? "over_max" : "unverified_limit";
      else if (lim.recommended !== undefined && len > lim.recommended) status = "over_recommended";
      checks.push({ platform, field, text: t, length: len, max: lim.max, recommended: lim.recommended, status, note: lim.note });
    }
  }
  return { checks, source: spec.source, checkedOn: CHECKED_ON };
}
