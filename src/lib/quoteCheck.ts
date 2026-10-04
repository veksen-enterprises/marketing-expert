// Check the quotes and file citations in a draft answer against the repository they claim to come from.
// Rounds 2–4 of the evals: the most common error was a quote, file or line that didn't match the repo
// (wrong line, quote put in the wrong ADR, words changed inside quotation marks). Instructions didn't stop it;
// this checks it mechanically.

import { readFileSync, realpathSync, statSync } from "node:fs";
import { relative, basename } from "node:path";
import { walk } from "./sourceScan.js";

export type QuoteStatus = "verified" | "wrong-line" | "other-file" | "cited-file-missing" | "not-found" | "uncited-found" | "uncited-not-found";

export interface QuoteResult {
  quote: string;
  cited: string | null;
  status: QuoteStatus;
  /** Where the quote actually is (first few matches). */
  foundAt: string[];
  /** The source line before, at and after the first match, so the quote's scope is visible (e.g. "of the rare and crafted table"). */
  context?: string;
}

export interface QuoteCheck {
  checked: number;
  counts: Record<QuoteStatus, number>;
  results: QuoteResult[];
  problems: string[];
}

const EXTS = new Set([".astro", ".html", ".htm", ".md", ".mdx", ".tsx", ".jsx", ".ts", ".js", ".mjs", ".cjs", ".vue", ".svelte", ".json", ".yaml", ".yml", ".toml", ".sql", ".txt", ".css"]);
const NAMES = new Set(["Dockerfile", "Caddyfile", "Makefile", "Procfile"]);
const FILE_RE = /([\w@./$\[\]-]*[\w\]-]+\.(?:astro|html?|mdx?|tsx?|jsx?|mjs|cjs|vue|svelte|json|ya?ml|toml|sql|txt|css)|Dockerfile|Caddyfile|Makefile)(?:(?::| lines? | L)(\d+)(?:\s?[-–]\s?L?(\d+))?)?/g;
const ADR_RE = /\b(?:ADR[- ]?|adr\/)(\d{3,4})\b(?:[^.\n]{0,12}?lines? (\d+)(?:\s?[-–]\s?(\d+))?)?|\((\d{4}) lines? (\d+)(?:\s?[-–]\s?(\d+))?\)/g;

function norm(s: string): string {
  return s
    // Drop tags but keep their quoted attribute values (tooltips, alt text, titles).
    .replace(/<[^>]+>/g, (tag) => [...tag.matchAll(/=\s*"([^"]*)"/g)].map((m) => ` ${m[1]} `).join(""))
    .toLowerCase()
    .replace(/[‘’`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[*_]/g, "")
    .replace(/&nbsp;|\s+/g, " ")
    .trim();
}

interface Indexed {
  rel: string;
  raw: string[];
  lines: string[];
  joined: string;
  /** Character offset in `joined` where each line starts. */
  starts: number[];
}

function index(dirs: string[]): Indexed[] {
  const out: Indexed[] = [];
  for (const d of dirs) {
    const root = realpathSync(d);
    if (!statSync(root).isDirectory()) throw new RangeError(`${d} is not a directory`);
    if (root === "/") throw new RangeError("refusing to scan the filesystem root");
    const files: string[] = [];
    walk(root, files, { truncated: false }, EXTS, NAMES);
    for (const f of files) {
      let src: string;
      try {
        src = readFileSync(f, "utf8");
      } catch {
        continue;
      }
      const raw = src.split("\n");
      const lines = raw.map(norm);
      const starts: number[] = [];
      let pos = 0;
      for (const l of lines) {
        starts.push(pos);
        pos += l.length + 1;
      }
      out.push({ rel: relative(root, f), raw, lines, joined: lines.join(" "), starts });
    }
  }
  return out;
}

function lineAt(ix: Indexed, offset: number): number {
  let lo = 0;
  let hi = ix.starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (ix.starts[mid] <= offset) lo = mid;
    else hi = mid - 1;
  }
  return lo + 1;
}

/** Every line where all fragments of the quote occur (fragments split on "…"/"..."), in order, within a short span. */
function find(ix: Indexed, fragments: string[]): number[] {
  const hits: number[] = [];
  let from = 0;
  for (;;) {
    const first = ix.joined.indexOf(fragments[0], from);
    if (first < 0) break;
    let ok = true;
    let at = first + fragments[0].length;
    for (const fr of fragments.slice(1)) {
      const next = ix.joined.indexOf(fr, at);
      if (next < 0 || next - at > 600) {
        ok = false;
        break;
      }
      at = next + fr.length;
    }
    if (ok) hits.push(lineAt(ix, first));
    from = first + 1;
    if (hits.length >= 5) break;
  }
  return hits;
}

interface Citation {
  path: string;
  adr?: string;
  start?: number;
  end?: number;
  pos: number;
}

function citationsIn(segment: string): Citation[] {
  const out: Citation[] = [];
  for (const m of segment.matchAll(FILE_RE)) {
    out.push({ path: m[1], start: m[2] ? Number(m[2]) : undefined, end: m[3] ? Number(m[3]) : undefined, pos: m.index ?? 0 });
  }
  for (const m of segment.matchAll(ADR_RE)) {
    const num = m[1] ?? m[4];
    const s = m[2] ?? m[5];
    const e = m[3] ?? m[6];
    out.push({ path: `adr/${num}`, adr: num, start: s ? Number(s) : undefined, end: e ? Number(e) : undefined, pos: m.index ?? 0 });
  }
  return out.sort((a, b) => a.pos - b.pos);
}

function resolve(files: Indexed[], c: Citation): Indexed[] {
  if (c.adr) return files.filter((f) => /(^|\/)adr\//i.test(f.rel) && basename(f.rel).startsWith(c.adr!.padStart(4, "0")));
  const p = c.path.replace(/^\.?\//, "");
  const exact = files.filter((f) => f.rel === p || f.rel.endsWith("/" + p));
  return exact.length ? exact : files.filter((f) => basename(f.rel) === basename(p));
}

export function checkQuotes(text: string, dirs: string[], lineTolerance = 2): QuoteCheck {
  const files = index(dirs);
  const results: QuoteResult[] = [];
  // A segment is a line of the answer (a bullet, table row or paragraph); a citation applies to quotes in the same segment.
  // A quote's citation is the nearest one in the same sentence.
  const sentences = text.split("\n").flatMap((line) => line.split(/(?<=[.!?]["”)]?)\s+(?=[`A-Z(*\[])/));
  for (const segment of sentences) {
    const cites = citationsIn(segment);
    for (const m of segment.matchAll(/["“]([^"”\n]{12,400})["”]/g)) {
      const quote = m[1];
      // Text between two different quotes ("a" (`file`), "b") is not a quote.
      if (/^[\s,.;:)\]]/.test(quote) || /[\s(\[]$/.test(quote) || quote.includes("`")) continue;
      const fragments = quote
        .split(/\s*(?:…|\.\.\.)\s*/)
        .map((f) => norm(f).replace(/^[\s,.;:!?]+|[\s,.;:!?]+$/g, ""))
        .filter((f) => f.split(" ").length >= 2 || f.length >= 8);
      if (!fragments.length || quote.split(/\s+/).length < 3) continue;
      const qStart = m.index ?? 0;
      const qEnd = qStart + m[0].length;
      const dist = (c: Citation) => (c.pos >= qEnd ? c.pos - qEnd : Math.max(0, qStart - c.pos - c.path.length));
      // Prefer a citation in the sentence whose file holds the quote; otherwise the nearest one.
      const holder = [...cites].sort((a, b) => dist(a) - dist(b)).find((c) => resolve(files, c).some((f) => find(f, fragments).length));
      const cite = holder ?? (cites.length ? cites.reduce((a, b) => (dist(b) < dist(a) ? b : a)) : null);
      const everywhere = () => files.flatMap((f) => find(f, fragments).map((l) => `${f.rel}:${l}`)).slice(0, 5);
      if (!cite) {
        const at = everywhere();
        results.push({ quote, cited: null, status: at.length ? "uncited-found" : "uncited-not-found", foundAt: at });
        continue;
      }
      const label = `${cite.adr ? `ADR ${cite.adr}` : cite.path}${cite.start ? `:${cite.start}${cite.end ? `-${cite.end}` : ""}` : ""}`;
      const targets = resolve(files, cite);
      if (!targets.length) {
        const at = everywhere();
        results.push({ quote, cited: label, status: at.length ? "other-file" : "cited-file-missing", foundAt: at });
        continue;
      }
      const inCited = targets.flatMap((f) => find(f, fragments).map((l) => ({ f, l })));
      if (inCited.length) {
        const s = cite.start;
        const e = cite.end ?? s;
        const near = s === undefined || inCited.some(({ l }) => l >= s - lineTolerance && l <= (e ?? s) + lineTolerance);
        const { f, l } = inCited[0];
        const context = f.raw.slice(Math.max(0, l - 2), l + 1).map((x) => x.trim()).filter(Boolean).join(" / ").slice(0, 400);
        results.push({ quote, cited: label, status: near ? "verified" : "wrong-line", foundAt: inCited.slice(0, 5).map(({ f, l }) => `${f.rel}:${l}`), context });
        continue;
      }
      const at = everywhere();
      results.push({ quote, cited: label, status: at.length ? "other-file" : "not-found", foundAt: at });
    }
  }
  const counts = { verified: 0, "wrong-line": 0, "other-file": 0, "cited-file-missing": 0, "not-found": 0, "uncited-found": 0, "uncited-not-found": 0 } as Record<QuoteStatus, number>;
  for (const r of results) counts[r.status]++;
  const problems = results
    .filter((r) => ["wrong-line", "other-file", "cited-file-missing", "not-found"].includes(r.status))
    .map((r) => {
      const q = `"${r.quote.slice(0, 80)}${r.quote.length > 80 ? "…" : ""}"`;
      if (r.status === "wrong-line") return `${q}: in ${r.cited?.split(":")[0]} but at ${r.foundAt.join(", ")}, not ${r.cited}. Fix the line.`;
      if (r.status === "other-file") return `${q}: not in ${r.cited}; found at ${r.foundAt.join(", ")}. Fix the citation.`;
      if (r.status === "cited-file-missing") return `${q}: no file matching ${r.cited} in the repo, and the words aren't anywhere else either.`;
      return `${q}: not found verbatim in ${r.cited}. Quote the exact words or drop the quotation marks.`;
    });
  return { checked: results.length, counts, results, problems };
}
