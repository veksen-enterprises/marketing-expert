// Check the evidence labels in an answer against the playbook passage each labelled claim comes from.
// Graders in every eval round marked answers down for labels upgraded ("practitioner" became "research")
// or qualifiers dropped ("seen via search snippets", "not re-verified", "self-selected sample").

import { sections, tokenize, type Section, type SearchHit } from "./knowledge.js";

const STRENGTH: Array<[string, RegExp, number]> = [
  ["research", /\b(controlled )?research\b|\bpeer-reviewed\b|\brct\b|\bpreprint\b/i, 4],
  ["first-party", /\bfirst-party\b|\bplatform documentation\b|\bofficial docs?\b/i, 3],
  ["practitioner", /\bpractitioner\b/i, 2],
  ["vendor", /\bvendor\b/i, 1],
  ["rule-of-thumb", /\brule[- ]of[- ]thumb\b/i, 0],
];
const QUALIFIER = /snippet|not re-?verified|self-selected|small sample|preprint|secondary|survivor|vendor-adjacent|unverified|not read in full|summar(y|ies)/i;

export interface LabelFinding {
  claim: string;
  answerLabel: string;
  source: string | null;
  sourceLabels: string[];
  status: "ok" | "upgraded" | "qualifier-dropped" | "no-source";
}

function labelsIn(s: string): string[] {
  return [...s.matchAll(/\[([^\]\n]{3,80})\]/g)].map((m) => m[1]).filter((l) => STRENGTH.some(([, re]) => re.test(l)));
}

function strength(label: string): number {
  return Math.max(-1, ...STRENGTH.filter(([, re]) => re.test(label)).map(([, , n]) => n));
}

let paragraphCache: Section[] | null = null;
export function paragraphs(): Section[] {
  if (paragraphCache) return paragraphCache;
  // Search paragraphs and bullets, not whole sections: a section mixes several labels.
  paragraphCache = sections().flatMap((s) =>
    s.text
      .split(/\n\s*\n|\n(?=\s*[-*]\s|\s*\d+\.\s|\|)/)
      .map((t) => t.trim())
      .filter((t) => t.length > 30 && /\[[^\]\n]{3,80}\]/.test(t))
      .map((t) => ({ ...s, text: t }))
  );
  return paragraphCache;
}

let searchIndex: { docs: Array<{ s: Section; len: number }>; postings: Map<string, Array<[number, number]>>; avg: number } | null = null;

/** searchKnowledge(query, limit, paragraphs()) with each paragraph tokenised once: searchKnowledge tokenises the whole
 * corpus on every call, and check_answer searches once per labelled sentence. Same tokens, weights and ranking. */
export function searchParagraphs(query: string, limit = 5): SearchHit[] {
  if (!searchIndex) {
    // For each token, the paragraphs that hold it (by index) and how often. A query then reads only those paragraphs;
    // counting each token's paragraphs by reading all of them took 1.3 s for 500 sentences of different words.
    const postings = new Map<string, Array<[number, number]>>();
    const docs = paragraphs().map((s, i) => {
      const head = tokenize(`${s.playbookTitle} ${s.heading}`);
      const toks = [...tokenize(s.text), ...head, ...head, ...tokenize(s.tags.join(" "))];
      const tf = new Map<string, number>();
      for (const t of toks) tf.set(t, (tf.get(t) ?? 0) + 1);
      for (const [t, f] of tf) {
        const list = postings.get(t);
        if (list) list.push([i, f]);
        else postings.set(t, [[i, f]]);
      }
      return { s, len: toks.length };
    });
    searchIndex = { docs, postings, avg: docs.reduce((n, d) => n + d.len, 0) / Math.max(1, docs.length) };
  }
  const { docs, postings, avg } = searchIndex;
  const q = [...new Set(tokenize(query))];
  if (q.length === 0) return [];
  const N = docs.length;
  const k1 = 1.2;
  const b = 0.75;
  // Added up in query-token order, as searchKnowledge does, so the scores are the same to the last digit.
  const scores = new Map<number, number>();
  for (const t of q) {
    const list = postings.get(t);
    if (!list) continue;
    const n = list.length;
    const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
    for (const [i, f] of list) scores.set(i, (scores.get(i) ?? 0) + (idf * f * (k1 + 1)) / (f + k1 * (1 - b + (b * docs[i].len) / avg)));
  }
  // In paragraph order before the sort, so equal scores rank as in searchKnowledge.
  const hits: SearchHit[] = [...scores]
    .filter(([, score]) => score > 0)
    .sort(([i], [j]) => i - j)
    .map(([i, score]) => ({ slug: docs[i].s.slug, playbookTitle: docs[i].s.playbookTitle, heading: docs[i].s.heading, score, text: docs[i].s.text }));
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function checkLabels(text: string, minScore = 6): LabelFinding[] {
  const out: LabelFinding[] = [];
  const claims = text.split("\n").flatMap((line) => line.split(/(?<=[.!?])\s+(?=[A-Z*(\[])/));
  for (const claim of claims) {
    const labels = labelsIn(claim);
    if (!labels.length) continue;
    // [^[\]], not [^\]]: from every "[" with no "]" after it, the scan ran to the end of the sentence.
    const query = claim.replace(/\[[^[\]]*\]/g, " ").replace(/[*_`]/g, " ");
    const hits = searchParagraphs(query, 5).filter((h) => h.score >= minScore);
    const answerLabel = labels.join("; ");
    if (!hits.length) {
      out.push({ claim: claim.trim().slice(0, 200), answerLabel, source: null, sourceLabels: [], status: "no-source" });
      continue;
    }
    const norm = (l: string) => l.toLowerCase().replace(/\s+/g, " ").trim();
    // A source label that starts with the answer's label and goes on ("first-party survey; self-selected sample")
    // is the clearest sign of a dropped qualifier.
    const extended = hits.flatMap((h) => [...h.text.matchAll(/\[([^\]\n]{3,80})\]/g)].map((m) => ({ h, l: m[1] }))).find(({ l }) => labels.some((a) => norm(l).startsWith(norm(a)) && norm(l).length > norm(a).length + 3 && QUALIFIER.test(l)));
    if (extended && !labels.some((l) => QUALIFIER.test(l))) {
      out.push({ claim: claim.trim().slice(0, 200), answerLabel, source: `${extended.h.slug} › ${extended.h.heading}`, sourceLabels: [extended.l], status: "qualifier-dropped" });
      continue;
    }
    const hit = hits[0];
    const sourceLabels = [...hit.text.matchAll(/\[([^\]\n]{3,80})\]/g)].map((m) => m[1]);
    const allLabels = hits.flatMap((h) => [...h.text.matchAll(/\[([^\]\n]{3,80})\]/g)].map((m) => m[1]));
    // An exact match with a label in any close passage is fine.
    if (labels.some((a) => allLabels.some((l) => norm(l) === norm(a)))) {
      out.push({ claim: claim.trim().slice(0, 200), answerLabel, source: `${hit.slug} › ${hit.heading}`, sourceLabels, status: "ok" });
      continue;
    }
    const ansStrength = Math.max(...labels.map(strength));
    // Upgraded only when no close passage carries a label that strong (search can miss the true source).
    const strongestNearby = Math.max(-1, ...allLabels.map(strength));
    const srcQualified = sourceLabels.some((l) => QUALIFIER.test(l));
    const ansQualified = labels.some((l) => QUALIFIER.test(l)) || QUALIFIER.test(claim.replace(/\[[^[\]]*\]/g, ""));
    const status: LabelFinding["status"] =
      strongestNearby >= 0 && ansStrength > strongestNearby ? "upgraded" : srcQualified && !ansQualified && strength(sourceLabels.find((l) => QUALIFIER.test(l)) ?? "") === ansStrength ? "qualifier-dropped" : "ok";
    out.push({ claim: claim.trim().slice(0, 200), answerLabel, source: `${hit.slug} › ${hit.heading}`, sourceLabels, status });
  }
  return out;
}
