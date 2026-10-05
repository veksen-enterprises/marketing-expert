// Check the evidence labels in an answer against the playbook passage each labelled claim comes from.
// Graders in every eval round marked answers down for labels upgraded ("practitioner" became "research")
// or qualifiers dropped ("seen via search snippets", "not re-verified", "self-selected sample").

import { sections, searchKnowledge, type Section } from "./knowledge.js";

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
function paragraphs(): Section[] {
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

export function checkLabels(text: string, minScore = 6): LabelFinding[] {
  const out: LabelFinding[] = [];
  const claims = text.split("\n").flatMap((line) => line.split(/(?<=[.!?])\s+(?=[A-Z*(\[])/));
  for (const claim of claims) {
    const labels = labelsIn(claim);
    if (!labels.length) continue;
    const query = claim.replace(/\[[^\]]*\]/g, " ").replace(/[*_`]/g, " ");
    const hits = searchKnowledge(query, 5, paragraphs()).filter((h) => h.score >= minScore);
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
    const ansQualified = labels.some((l) => QUALIFIER.test(l)) || QUALIFIER.test(claim.replace(/\[[^\]]*\]/g, ""));
    const status: LabelFinding["status"] =
      strongestNearby >= 0 && ansStrength > strongestNearby ? "upgraded" : srcQualified && !ansQualified && strength(sourceLabels.find((l) => QUALIFIER.test(l)) ?? "") === ansStrength ? "qualifier-dropped" : "ok";
    out.push({ claim: claim.trim().slice(0, 200), answerLabel, source: `${hit.slug} › ${hit.heading}`, sourceLabels, status });
  }
  return out;
}
