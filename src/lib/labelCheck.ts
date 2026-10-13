// Check the evidence labels in an answer against the playbook passage each labelled claim comes from.
// Graders in every eval round marked answers down for labels upgraded ("practitioner" became "research")
// or qualifiers dropped ("seen via search snippets", "not re-verified", "self-selected sample").

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { sections, tokenize, loadPlaybooks, KNOWLEDGE_DIR, type Section, type SearchHit } from "./knowledge.js";

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
  /** "slug:line › heading" of the playbook paragraph the claim was matched to. */
  source: string | null;
  sourceLabels: string[];
  /** The start of that paragraph, so a reader can see whether the match is right. */
  sourceText?: string;
  /** How the source was found: a phrase quoted from it, the playbook the sentence names, or keyword search. */
  matchedBy?: "exact-quote" | "named-playbook" | "search";
  /** merged: one bracket mixes two evidence levels ("practitioner rule of thumb"). unlabelled-reuse: a sentence with no
   * label repeats a labelled playbook claim. */
  status: "ok" | "upgraded" | "qualifier-dropped" | "no-source" | "merged" | "unlabelled-reuse";
}

// Parentheses that start with an evidence level ("(practitioner rule of thumb)"); not prose that mentions one
// ("(the vendor's own research, …)").
const PAREN_LABEL = /^\s*((controlled )?research|peer-reviewed|first-party|platform documentation|official docs?|practitioner|vendor|rule[- ]of[- ]thumb)\b/i;
// Labels in brackets, or in parentheses that start with an evidence level.
function labelsIn(s: string): string[] {
  return [...s.matchAll(/\[([^\]\n]{3,80})\]|\(([^()\n]{3,80})\)/g)]
    .filter((m) => m[1] !== undefined || PAREN_LABEL.test(m[2]))
    .map((m) => m[1] ?? m[2])
    .filter((l) => STRENGTH.some(([, re]) => re.test(l)));
}

const norm = (l: string) => l.toLowerCase().replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
const bracketsIn = (t: string) => [...t.matchAll(/\[([^\]\n]{3,80})\]/g)].map((m) => m[1]);
// Top search hit must beat the second by this much to count as the source.
const LEAD = 1.25;

let playbookLabels: Set<string> | null = null;
const knownLabel = (l: string) => (playbookLabels ??= new Set(paragraphs().flatMap((p) => bracketsIn(p.text).map(norm)))).has(norm(l));

const fileLines = new Map<string, string[]>();
function sourceOf(p: { slug: string; heading: string; text: string }): string {
  let lines = fileLines.get(p.slug);
  if (!lines) {
    try {
      lines = readFileSync(join(KNOWLEDGE_DIR, `${p.slug}.md`), "utf8").split("\n");
    } catch {
      lines = [];
    }
    fileLines.set(p.slug, lines);
  }
  const first = p.text.split("\n")[0].trim().slice(0, 60);
  const i = lines.findIndex((l) => l.includes(first));
  return `${p.slug}${i >= 0 ? `:${i + 1}` : ""} › ${p.heading}`;
}

/** The playbook a sentence names: "the developer-tools playbook", "(seo-and-ai-search)". */
function namedSlug(claim: string): string | null {
  const slugs = new Set(loadPlaybooks().map((b) => b.slug));
  for (const m of claim.matchAll(/\b([a-z0-9]+(?:-[a-z0-9]+)*)(?= playbook\b)|\b([a-z0-9]+(?:-[a-z0-9]+)+)\b/gi)) {
    const slug = (m[1] ?? m[2]).toLowerCase();
    if (slugs.has(slug)) return slug;
  }
  return null;
}

/** The labelled paragraph that contains a phrase quoted in the claim. */
function quotedSource(claim: string): Section | null {
  for (const m of claim.matchAll(/["“]([^"”\n]{12,200})["”]/g)) {
    const q = norm(m[1]);
    const p = paragraphs().find((p) => norm(p.text).includes(q));
    if (p) return p;
  }
  return null;
}

const words = (t: string) => norm(t.replace(/\[[^\]\n]*\]/g, " ")).match(/[a-z0-9]+/g) ?? [];
const STOPWORD = /^(a|an|and|are|as|at|be|by|for|from|in|is|it|of|on|or|that|the|this|to|with|you|your|can|will|they|them|their|not|but)$/;

/** For a sentence with no label: the labelled playbook passage it repeats, by a shared run of five words or by
 * 60% of its content words, and the label that passage carries. */
function unlabelled(claim: string, minScore: number): LabelFinding | null {
  const text = claim.replace(/[*_`]/g, " ");
  // A strength word or caveat written out ("practitioner advice", "not re-verified") is a label in words.
  if (STRENGTH.some(([, re]) => re.test(text)) || QUALIFIER.test(text)) return null;
  const quoted = quotedSource(claim);
  const slug = quoted ? null : namedSlug(claim);
  // The playbook's name is not part of the claim.
  const bare = slug ? text.replace(new RegExp(`\\b${slug}( playbook)?`, "gi"), " ") : text;
  const cw = words(bare);
  const content = [...new Set(tokenize(bare))].filter((t) => t.length > 2);
  if (cw.length < 5) return null;
  const found = quoted ? [] : searchParagraphs(bare, 3, slug ?? undefined).filter((h) => h.score >= (slug ? minScore / 2 : minScore));
  // From search alone, only the top hit, and only with a clear lead, as for labelled sentences.
  const hits: Array<{ slug: string; heading: string; text: string }> = quoted
    ? [quoted]
    : slug
      ? found
      : found.slice(0, 1).filter((h) => found.length < 2 || h.score >= LEAD * found[1].score);
  for (const h of hits) {
    // Find the passage sentence it repeats, then take the first label at or after it.
    const sentences = h.text.split(/(?<=[.!?\]])\s+(?=[A-Z*(\[])/);
    let best = -1;
    let bestScore = 0;
    sentences.forEach((s, i) => {
      const pw = words(s);
      const grams = new Set(pw.map((_, j) => pw.slice(j, j + 5).join(" ")).filter((g) => g.split(" ").length === 5));
      const run = cw.some((_, j) => {
        const g = cw.slice(j, j + 5);
        return g.length === 5 && g.filter((w) => !STOPWORD.test(w) && w.length > 2).length >= 2 && grams.has(g.join(" "));
      });
      const toks = new Set(tokenize(s));
      const overlap = content.length ? content.filter((t) => toks.has(t)).length / content.length : 0;
      const score = run ? 2 : content.length >= 6 && overlap >= 0.6 ? overlap : 0;
      if (score > bestScore) [best, bestScore] = [i, score];
    });
    if (best < 0 && !quoted) continue;
    const label = sentences.slice(Math.max(0, best)).flatMap(bracketsIn)[0];
    if (!label) continue;
    const matchedBy = quoted ? "exact-quote" : slug ? "named-playbook" : "search";
    const status = QUALIFIER.test(label) && matchedBy !== "search" ? "qualifier-dropped" : "unlabelled-reuse";
    return { claim: claim.trim().slice(0, 200), answerLabel: "", source: sourceOf(h), sourceLabels: [label], sourceText: h.text.slice(0, 200), matchedBy, status };
  }
  return null;
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
export function searchParagraphs(query: string, limit = 5, slug?: string): SearchHit[] {
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
    .filter(([i, score]) => score > 0 && (!slug || docs[i].s.slug === slug))
    .sort(([i], [j]) => i - j)
    .map(([i, score]) => ({ slug: docs[i].s.slug, playbookTitle: docs[i].s.playbookTitle, heading: docs[i].s.heading, score, text: docs[i].s.text, summary: docs[i].s.summary, pointer: docs[i].s.pointer }));
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function checkLabels(text: string, minScore = 6): LabelFinding[] {
  const out: LabelFinding[] = [];
  const claims = text.split("\n").flatMap((line) => line.split(/(?<=[.!?])\s+(?=[A-Z*(\[])/));
  for (const claim of claims) {
    const labels = labelsIn(claim);
    if (!labels.length) {
      const f = unlabelled(claim, minScore);
      if (f) out.push(f);
      continue;
    }
    const answerLabel = labels.join("; ");
    const base = { claim: claim.trim().slice(0, 200), answerLabel };
    // Two evidence levels in one bracket, unless a playbook uses that exact bracket ("first-party; practitioner").
    if (labels.some((l) => STRENGTH.filter(([, re]) => re.test(l)).length >= 2 && !knownLabel(l))) {
      out.push({ ...base, source: null, sourceLabels: [], status: "merged" });
      continue;
    }
    // [^[\]], not [^\]]: from every "[" with no "]" after it, the scan ran to the end of the sentence.
    const query = labels.reduce((q, l) => q.split(`(${l})`).join(" "), claim).replace(/\[[^[\]]*\]/g, " ").replace(/[*_`]/g, " ");
    // The source, in order of trust: the paragraph a quoted phrase comes from, the best hit in the playbook the
    // sentence names, then search over all playbooks.
    const quoted = quotedSource(claim);
    const slug = quoted ? null : namedSlug(claim);
    const matchedBy: LabelFinding["matchedBy"] = quoted ? "exact-quote" : slug ? "named-playbook" : "search";
    const hits: Array<{ slug: string; heading: string; text: string; score: number }> = quoted
      ? [{ ...quoted, score: Infinity }]
      : searchParagraphs(query, 5, slug ?? undefined).filter((h) => h.score >= (slug ? minScore / 2 : minScore));
    if (!hits.length) {
      out.push({ ...base, source: null, sourceLabels: [], status: "no-source" });
      continue;
    }
    // A source label that starts with the answer's label and goes on ("first-party survey; self-selected sample")
    // is the clearest sign of a dropped qualifier.
    const extended = hits.flatMap((h) => bracketsIn(h.text).map((l) => ({ h, l }))).find(({ l }) => labels.some((a) => norm(l).startsWith(norm(a)) && norm(l).length > norm(a).length + 3 && QUALIFIER.test(l)));
    if (extended && !labels.some((l) => QUALIFIER.test(l))) {
      out.push({ ...base, source: sourceOf(extended.h), sourceLabels: [extended.l], sourceText: extended.h.text.slice(0, 200), matchedBy, status: "qualifier-dropped" });
      continue;
    }
    const hit = hits[0];
    const found = { source: sourceOf(hit), sourceLabels: bracketsIn(hit.text), sourceText: hit.text.slice(0, 200), matchedBy };
    const allLabels = hits.flatMap((h) => bracketsIn(h.text));
    // An exact match with a label in any close passage is fine.
    if (labels.some((a) => allLabels.some((l) => norm(l) === norm(a)))) {
      out.push({ ...base, ...found, status: "ok" });
      continue;
    }
    const ansStrength = Math.max(...labels.map(strength));
    // Upgraded only when no close passage carries a label that strong (search can miss the true source).
    const strongestNearby = Math.max(-1, ...allLabels.map(strength));
    if (strongestNearby >= 0 && ansStrength > strongestNearby) {
      out.push({ ...base, ...found, status: "upgraded" });
      continue;
    }
    // Comparing with one passage needs that passage to be the source: a quote from it, or a clear search lead.
    if (matchedBy === "search" && hits.length > 1 && hit.score < LEAD * hits[1].score) {
      out.push({ ...base, source: null, sourceLabels: [], status: "no-source" });
      continue;
    }
    const srcQualified = found.sourceLabels.some((l) => QUALIFIER.test(l));
    const ansQualified = labels.some((l) => QUALIFIER.test(l)) || QUALIFIER.test(query);
    const status: LabelFinding["status"] = srcQualified && !ansQualified && strength(found.sourceLabels.find((l) => QUALIFIER.test(l)) ?? "") === ansStrength ? "qualifier-dropped" : "ok";
    out.push({ ...base, ...found, status });
  }
  return out;
}
