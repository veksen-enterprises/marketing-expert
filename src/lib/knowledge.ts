// Loads the Markdown playbooks in /knowledge and provides section-level keyword search (BM25).
// Kept deliberately simple: the corpus is small and hand-written, so lexical search is enough
// and keeps the server dependency- and network-free.

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface Playbook {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  body: string;
}

export interface Section {
  slug: string;
  playbookTitle: string;
  heading: string;
  text: string;
  /** Playbook-level tags from frontmatter; they describe what the whole playbook is about. */
  tags: string[];
  /** The section's "_In short:_" line, or else its first sentence: what a newcomer reads before choosing to go deeper. */
  summary: string;
  /** What learn_more takes to expand this section: playbook:<slug>#<heading>. */
  pointer: string;
}

const SUMMARY_MAX_WORDS = 40;
/** The written "_In short:_" line, or the section's first sentence of prose, cut at SUMMARY_MAX_WORDS. */
export function summaryOf(text: string): string {
  const written = /^_In short:_\s*(.+)$/m.exec(text);
  if (written) return written[1].trim();
  const prose = text
    .replace(/^## .*$/m, "")
    .split("\n")
    .map((l) => l.replace(/^\s*(?:[-*]|\d+\.)\s+/, "").trim())
    .filter((l) => l && !l.startsWith("|") && !l.startsWith("#"))
    .join(" ")
    .replace(/\*\*|__|`/g, "")
    .replace(/\s*\[[^\]\n]{3,120}\]/g, "");
  let first = prose.split(/(?<=[.!?])\s+(?=[A-Z])/)[0] ?? "";
  // A section that is only a table: its first data row, cells joined.
  if (!first.trim()) {
    const rows = text.split("\n").filter((l) => l.trim().startsWith("|") && !/^\s*\|[\s:|-]+\|\s*$/.test(l));
    first = (rows[1] ?? rows[0] ?? "").split("|").map((c) => c.replace(/\*\*/g, "").trim()).filter(Boolean).join("; ");
  }
  const words = first.split(/\s+/).filter(Boolean);
  return words.length > SUMMARY_MAX_WORDS ? `${words.slice(0, SUMMARY_MAX_WORDS).join(" ")}…` : first;
}

export const KNOWLEDGE_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "knowledge");

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  // A Windows checkout (core.autocrlf) has CRLF line ends; some editors add a BOM.
  raw = raw.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(raw);
  if (!m) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: raw.slice(m[0].length) };
}

let cache: Playbook[] | null = null;

export function loadPlaybooks(dir = KNOWLEDGE_DIR): Playbook[] {
  if (cache && dir === KNOWLEDGE_DIR) return cache;
  const books = readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .sort()
    .map((f) => {
      const { meta, body } = parseFrontmatter(readFileSync(join(dir, f), "utf8"));
      return {
        slug: f.replace(/\.md$/, ""),
        title: meta.title ?? f,
        summary: meta.summary ?? "",
        tags: (meta.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
        body,
      };
    });
  if (dir === KNOWLEDGE_DIR) cache = books;
  return books;
}

export function getPlaybook(slug: string): Playbook | undefined {
  return loadPlaybooks().find((p) => p.slug === slug);
}

export function sections(books = loadPlaybooks()): Section[] {
  const out: Section[] = [];
  for (const b of books) {
    const parts = b.body.split(/^(?=## )/m);
    for (const part of parts) {
      const h = /^## (.+)$/m.exec(part);
      const heading = h ? h[1].trim() : b.title;
      const text = part.trim();
      out.push({ slug: b.slug, playbookTitle: b.title, heading, text, tags: b.tags, summary: summaryOf(text), pointer: `playbook:${b.slug}#${heading}` });
    }
  }
  return out.filter((s) => s.text.length > 0);
}

const STOP = new Set("a an and are as at be by for from how i in is it of on or our should that the this to we what when which who why with you your do does can my".split(" "));

export function tokenize(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((t) => !STOP.has(t)).map(stem);
}

function stem(t: string): string {
  if (t.length > 5 && t.endsWith("ing")) return t.slice(0, -3);
  if (t.length > 4 && t.endsWith("ies")) return t.slice(0, -3) + "y";
  if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) return t.slice(0, -1);
  return t;
}

export interface SearchHit {
  slug: string;
  playbookTitle: string;
  heading: string;
  score: number;
  text: string;
  summary: string;
  pointer: string;
}

/** Query terms beyond this are ignored: each one costs a scan of the whole corpus. */
export const MAX_QUERY_TERMS = 32;

export function searchKnowledge(query: string, limit = 5, corpus = sections()): SearchHit[] {
  const q = [...new Set(tokenize(query))].slice(0, MAX_QUERY_TERMS);
  if (q.length === 0) return [];
  const docs = corpus.map((s) => {
    const head = tokenize(`${s.playbookTitle} ${s.heading}`);
    // Heading terms count triple: a section titled "Pricing" is about pricing.
    // Tags count once per section: they tie every section to its playbook's topic.
    return { s, toks: [...tokenize(s.text), ...head, ...head, ...tokenize(s.tags.join(" "))] };
  });
  const N = docs.length;
  const avg = docs.reduce((n, d) => n + d.toks.length, 0) / Math.max(1, N);
  const df = new Map<string, number>();
  for (const t of q) df.set(t, docs.filter((d) => d.toks.includes(t)).length);
  const k1 = 1.2;
  const b = 0.75;
  return docs
    .map((d) => {
      let score = 0;
      for (const t of q) {
        const f = d.toks.filter((x) => x === t).length;
        if (!f) continue;
        const n = df.get(t) ?? 0;
        const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
        score += (idf * f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.toks.length) / avg));
      }
      return { slug: d.s.slug, playbookTitle: d.s.playbookTitle, heading: d.s.heading, score, text: d.s.text, summary: d.s.summary, pointer: d.s.pointer };
    })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
