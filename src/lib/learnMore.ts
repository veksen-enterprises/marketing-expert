// learn_more: expand one pointer into the detail behind a summary. Pointers come from search_playbooks
// (playbook:<slug>#<heading>), match_small_bets (bet:<id>) and the glossary (term:<term>); anything else is read as
// plain words and matched to the best section. Readers are learning business, so each expansion also gives the plain
// meaning of the business terms it uses, and where to go next.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { KNOWLEDGE_DIR, loadPlaybooks, sections, searchKnowledge, tokenize, type Section } from "./knowledge.js";
import { plainGloss } from "./answerCheck.js";
import { BETS } from "./smallBetsCatalog.js";

export interface Expansion {
  pointer: string;
  kind: "section" | "playbook" | "bet" | "term";
  title: string;
  /** One or two plain sentences. */
  inShort: string;
  details: string;
  /** Business terms in the details, each with the glossary's plain meaning. */
  terms: Array<{ term: string; plain: string }>;
  /** Evidence tags found in the details, as written. */
  evidence: string[];
  /** Where the claims come from. */
  sources?: string;
  /** Pointers to go deeper or sideways. */
  learnMore: Array<{ title: string; pointer: string }>;
  note?: string;
}

const RESEARCH_DIR = join(KNOWLEDGE_DIR, "..", "research");
const MAX_TERMS = 10;
const MAX_DETAILS = 6000;

/** Glossary terms used in a text, longest first, each once. Abbreviations match case-sensitively. */
function termsIn(text: string): Expansion["terms"] {
  const gloss = plainGloss();
  const seen = new Set<string>();
  const out: Expansion["terms"] = [];
  const keys = [...gloss.keys()].filter((k) => k.length > 2 || /^[A-Z]{2}$/.test(k)).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    const plain = gloss.get(k)!;
    if (seen.has(plain)) continue;
    const abbr = /^[A-Z0-9&]+$/.test(k);
    if (!abbr && k !== k.toLowerCase()) continue; // each non-abbreviation is also stored lower-cased; match that one
    // The lower-cased copy of an abbreviation ("gtm") would match inside words and paths ("early-stage-gtm").
    if (!abbr && /^[A-Z0-9&]+$/.test(k.toUpperCase()) && gloss.has(k.toUpperCase()) && !/\s/.test(k)) continue;
    const re = new RegExp(`(?<![\\p{L}\\p{N}_])${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:s|es)?(?![\\p{L}\\p{N}_])`, abbr ? "u" : "iu");
    if (re.test(text)) {
      seen.add(plain);
      out.push({ term: k, plain });
      if (out.length >= MAX_TERMS) break;
    }
  }
  return out;
}

const tagsIn = (text: string) => [...new Set([...text.matchAll(/\[([^\]\n]{3,120})\]/g)].map((m) => m[1]).filter((t) => /research|first-party|practitioner|vendor|rule[- ]of[- ]thumb/i.test(t)))];
const clip = (t: string) => (t.length > MAX_DETAILS ? `${t.slice(0, MAX_DETAILS)}… (cut at ${MAX_DETAILS} characters; get_playbook has the rest)` : t);
const sourcesOf = (slug: string) => sections().find((s) => s.slug === slug && /^sources?$/i.test(s.heading))?.text.replace(/^## .*\n+/, "").trim();

function related(query: string, exclude: string, limit = 4): Expansion["learnMore"] {
  return searchKnowledge(query, limit + 3)
    .filter((h) => h.pointer !== exclude && !/^sources?$/i.test(h.heading))
    .slice(0, limit)
    .map((h) => ({ title: `${h.playbookTitle} › ${h.heading}`, pointer: h.pointer }));
}

function expandSection(s: Section, note?: string): Expansion {
  const details = clip(s.text.replace(/^## .*\n+/, "").replace(/^_In short:_.*\n+/m, "").trim());
  return {
    pointer: s.pointer,
    kind: "section",
    title: `${s.playbookTitle} › ${s.heading}`,
    inShort: s.summary,
    details,
    terms: termsIn(details),
    evidence: tagsIn(details),
    sources: sourcesOf(s.slug),
    learnMore: related(`${s.heading} ${s.summary}`, s.pointer),
    ...(note ? { note } : {}),
  };
}

/** The research note section closest to a query, among the given note files. */
function closestResearch(query: string, files: string[]): { file: string; text: string } | null {
  const q = new Set(tokenize(query));
  let best: { file: string; text: string; score: number } | null = null;
  for (const f of files) {
    const path = join(RESEARCH_DIR, f);
    if (!existsSync(path)) continue;
    for (const part of readFileSync(path, "utf8").split(/^(?=#{2,3} )/m)) {
      const toks = tokenize(part.slice(0, 4000));
      const score = toks.filter((t) => q.has(t)).length / Math.sqrt(toks.length + 20);
      if (!best || score > best.score) best = { file: `research/${f}`, text: part.trim(), score };
    }
  }
  return best && best.score > 0 ? { file: best.file, text: best.text } : null;
}

function expandBet(id: string): Expansion {
  const b = BETS.find((x) => x.id === id);
  if (!b) throw new RangeError(`no small bet "${id}". Known: ${BETS.map((x) => x.id).join(", ")}`);
  const book = sections().filter((s) => s.slug === "small-bets");
  const para = book.flatMap((s) => s.text.split("\n")).find((l) => l.includes(`**${b.name}`)) ?? "";
  const fields = [
    `Earliest stage: ${b.stage}${b.dataSkipsStage ? " (0 if you hold data nobody else has published)" : ""}${b.budgetSkipsStage !== undefined ? ` (0 with about $${b.budgetSkipsStage} a month)` : ""}`,
    `Effort: ${b.effortHours} hours until it can be judged`,
    `Ceiling: ${b.ceiling}${b.tries ? `; run ${b.tries} tries and judge by the best one` : ""}`,
    `Cost: ${b.cost}`,
    `Judge after: ${b.judgeAfter}`,
    `Measure: ${b.measure}`,
    `Stop: ${b.stop}`,
    `Evidence: ${b.evidence}`,
  ].join("\n");
  const research = closestResearch(`${b.name} ${b.what}`, readdirSync(RESEARCH_DIR).filter((f) => /^small-bets/.test(f)));
  const details = clip([fields, para.replace(/^\s*-\s*/, ""), research ? `Closest research (${research.file}):\n${research.text.slice(0, 2500)}` : ""].filter(Boolean).join("\n\n"));
  const section = book.find((s) => s.heading === b.section);
  const siblings = BETS.filter((x) => x.section === b.section && x.id !== b.id).slice(0, 3);
  return {
    pointer: `bet:${b.id}`,
    kind: "bet",
    title: b.name,
    inShort: b.what,
    details,
    terms: termsIn(details),
    evidence: tagsIn(details),
    sources: research ? research.file : "research/small-bets.md",
    learnMore: [
      ...(section ? [{ title: `Small bets › ${section.heading}`, pointer: section.pointer }] : []),
      ...siblings.map((x) => ({ title: x.name, pointer: `bet:${x.id}` })),
    ],
  };
}

function expandTerm(term: string): Expansion {
  const raw = readFileSync(join(KNOWLEDGE_DIR, "glossary.md"), "utf8");
  const plain = plainGloss().get(term) ?? plainGloss().get(term.toLowerCase());
  const entry = raw.split("\n").find((l) => {
    const head = /^- \*\*([^*]+)\*\*/.exec(l)?.[1] ?? "";
    return head.toLowerCase() === term.toLowerCase() || head.toLowerCase().startsWith(`${term.toLowerCase()} (`) || head.toLowerCase().includes(`(${term.toLowerCase()})`);
  });
  if (!plain || !entry) throw new RangeError(`"${term}" is not in the glossary. Try plain words instead, or search_playbooks.`);
  const details = entry.replace(/^- /, "");
  return { pointer: `term:${term}`, kind: "term", title: term, inShort: plain, details, terms: [], evidence: tagsIn(details), learnMore: related(term, "") };
}

function expandPlaybook(slug: string): Expansion {
  const p = loadPlaybooks().find((b) => b.slug === slug);
  if (!p) throw new RangeError(`no playbook "${slug}". Known: ${loadPlaybooks().map((b) => b.slug).join(", ")}`);
  const secs = sections().filter((s) => s.slug === slug && s.heading !== p.title && !/^sources?$/i.test(s.heading));
  const details = secs.map((s) => `${s.heading}: ${s.summary}`).join("\n");
  return { pointer: `playbook:${slug}`, kind: "playbook", title: p.title, inShort: p.summary, details, terms: termsIn(details), evidence: [], sources: sourcesOf(slug), learnMore: secs.map((s) => ({ title: s.heading, pointer: s.pointer })) };
}

export function learnMore(pointer: string): Expansion {
  const p = pointer.trim();
  if (p.startsWith("bet:")) return expandBet(p.slice(4));
  if (p.startsWith("term:")) return expandTerm(p.slice(5));
  if (p.startsWith("playbook:")) {
    const [slug, heading] = p.slice(9).split("#");
    if (heading === undefined) return expandPlaybook(slug);
    const s = sections().find((x) => x.slug === slug && x.heading.toLowerCase() === heading.toLowerCase());
    if (!s) {
      if (!loadPlaybooks().some((b) => b.slug === slug)) throw new RangeError(`no playbook "${slug}". Known: ${loadPlaybooks().map((b) => b.slug).join(", ")}`);
      throw new RangeError(`no section "${heading}" in ${slug}. Sections: ${sections().filter((x) => x.slug === slug).map((x) => x.heading).join("; ")}`);
    }
    return expandSection(s);
  }
  const [hit, ...rest] = searchKnowledge(p, 4).filter((h) => !/^sources?$/i.test(h.heading));
  if (!hit) throw new RangeError(`nothing in the playbooks matches "${p}". Try other words, or a pointer from search_playbooks.`);
  const s = sections().find((x) => x.pointer === hit.pointer)!;
  const e = expandSection(s, `"${p}" was read as plain words; this is the best match. Other matches are in learnMore.`);
  e.learnMore = [...rest.map((h) => ({ title: `${h.playbookTitle} › ${h.heading}`, pointer: h.pointer })), ...e.learnMore].slice(0, 6);
  return e;
}
