// Check the quotes and file citations in a draft answer against the repository they claim to come from.
// Rounds 2–4 of the evals: the most common error was a quote, file or line that didn't match the repo
// (wrong line, quote put in the wrong ADR, words changed inside quotation marks). Instructions didn't stop it;
// this checks it mechanically.

import { readFileSync, realpathSync, statSync } from "node:fs";
import { relative, basename } from "node:path";
import { walk, MAX_FILES } from "./sourceScan.js";

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
  /** Limits reached while reading the directories: quotes from files not read show as not found. */
  notes: string[];
}

const EXTS = new Set([".astro", ".html", ".htm", ".md", ".mdx", ".tsx", ".jsx", ".ts", ".js", ".mjs", ".cjs", ".vue", ".svelte", ".json", ".yaml", ".yml", ".toml", ".sql", ".txt", ".css"]);
const NAMES = new Set(["Dockerfile", "Caddyfile", "Makefile", "Procfile"]);
// A citation is a path-like token, the file name it ends with, then an optional line or range. In two steps, because one
// pattern with two overlapping repeats before the extension backtracked cubically on a long hash or slug.
const TOKEN_RE = /[\w@./$\[\]-]+/g;
const PATH_RE = /^[\w@./$\[\]-]*(?:[\w\]-]\.(?:astro|html?|mdx?|tsx?|jsx?|mjs|cjs|vue|svelte|json|ya?ml|toml|sql|txt|css)|Dockerfile|Caddyfile|Makefile)(?!\w)/;
const LINES_RE = /(?::| lines? | L)(\d+)(?:\s?[-–]\s?L?(\d+))?/y;
const ADR_RE = /\b(?:ADR[- ]?|adr\/)(\d{3,4})\b(?:[^.\n]{0,12}?lines? (\d+)(?:\s?[-–]\s?(\d+))?)?|\((\d{4}) lines? (\d+)(?:\s?[-–]\s?(\d+))?\)/g;

function norm(s: string): string {
  return s
    // Drop tags but keep their quoted attribute values (tooltips, alt text, titles). [^<>], not [^>]: from every "<"
    // with no ">" after it, the scan ran to the end of the line.
    .replace(/<[^<>]+>/g, (tag) => [...tag.matchAll(/=\s*"([^"]*)"/g)].map((m) => ` ${m[1]} `).join(""))
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
  /** The normalised lines, joined with spaces. */
  joined: string;
  /** Character offset in `joined` where each line starts. */
  starts: number[];
}

// A quote not found in its cited file is searched for in every file, so the time grows with quotes x repository size.
const MAX_QUOTES = 100;
// Text held in memory across all dirs. Up to 5 dirs of 4000 files each could otherwise exhaust memory and end the server.
const MAX_TOTAL = 50 * 1024 * 1024;

function index(dirs: string[], notes: string[]): Indexed[] {
  const out: Indexed[] = [];
  // Dirs and files already read: the same dir passed twice, or a file reached through two dirs (one inside the other), is read once.
  const seen = new Set<string>();
  let total = 0;
  for (const d of dirs) {
    const root = realpathSync(d);
    if (!statSync(root).isDirectory()) throw new RangeError(`${d} is not a directory`);
    if (root === "/") throw new RangeError("refusing to scan the filesystem root");
    if (seen.has(root)) continue;
    seen.add(root);
    const files: string[] = [];
    const state = { truncated: false };
    walk(root, files, state, EXTS, NAMES);
    if (state.truncated) notes.push(`Only the first ${MAX_FILES} files in ${d} were read. Quotes from other files show as not found; pass a narrower directory.`);
    for (const f of files) {
      if (seen.has(f)) continue;
      seen.add(f);
      let src: string;
      try {
        src = readFileSync(f, "utf8");
      } catch {
        continue;
      }
      total += src.length;
      if (total > MAX_TOTAL) {
        notes.push("Stopped reading after 50 MB of files. Quotes from files not read show as not found; pass a narrower directory.");
        return out;
      }
      const raw = src.split("\n");
      const lines = raw.map(norm);
      const starts: number[] = [];
      let pos = 0;
      for (const l of lines) {
        starts.push(pos);
        pos += l.length + 1;
      }
      out.push({ rel: relative(root, f), raw, joined: lines.join(" "), starts });
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
  // Where each later fragment was last found. `at` only grows from one start to the next, so a position at or after it
  // is still the next match: each fragment is searched for once through the file, not once per start.
  const next: number[] = [];
  let from = 0;
  for (;;) {
    const first = ix.joined.indexOf(fragments[0], from);
    if (first < 0) break;
    let ok = true;
    let at = first + fragments[0].length;
    for (let k = 1; k < fragments.length; k++) {
      if (next[k] === undefined || next[k] < at) next[k] = ix.joined.indexOf(fragments[k], at);
      // Not anywhere after this start, so not after any later one either.
      if (next[k] < 0) return hits;
      if (next[k] - at > 600) {
        ok = false;
        break;
      }
      at = next[k] + fragments[k].length;
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
  for (const t of segment.matchAll(TOKEN_RE)) {
    const path = PATH_RE.exec(t[0])?.[0];
    if (!path) continue;
    LINES_RE.lastIndex = (t.index ?? 0) + path.length;
    const m = LINES_RE.exec(segment);
    out.push({ path, start: m ? Number(m[1]) : undefined, end: m?.[2] ? Number(m[2]) : undefined, pos: t.index ?? 0 });
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
  const notes: string[] = [];
  const files = index(dirs, notes);
  const results: QuoteResult[] = [];
  let skipped = 0;
  // Many quotes in one sentence often cite the same file: resolve each citation once per call.
  const resolved = new Map<string, Indexed[]>();
  const targetsOf = (c: Citation) => {
    const key = c.adr ? `adr ${c.adr}` : c.path;
    let t = resolved.get(key);
    if (!t) resolved.set(key, (t = resolve(files, c)));
    return t;
  };
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
      if (results.length >= MAX_QUOTES) {
        skipped++;
        continue;
      }
      // And search each file once per quote, however many citations point to it.
      const found = new Map<Indexed, number[]>();
      const findIn = (f: Indexed) => {
        let hits = found.get(f);
        if (!hits) found.set(f, (hits = find(f, fragments)));
        return hits;
      };
      const qStart = m.index ?? 0;
      const qEnd = qStart + m[0].length;
      const dist = (c: Citation) => (c.pos >= qEnd ? c.pos - qEnd : Math.max(0, qStart - c.pos - c.path.length));
      // Prefer a citation in the sentence whose file holds the quote; otherwise the nearest one.
      const holder = [...cites].sort((a, b) => dist(a) - dist(b)).find((c) => targetsOf(c).some((f) => findIn(f).length));
      const cite = holder ?? (cites.length ? cites.reduce((a, b) => (dist(b) < dist(a) ? b : a)) : null);
      const everywhere = () => files.flatMap((f) => findIn(f).map((l) => `${f.rel}:${l}`)).slice(0, 5);
      if (!cite) {
        const at = everywhere();
        results.push({ quote, cited: null, status: at.length ? "uncited-found" : "uncited-not-found", foundAt: at });
        continue;
      }
      const label = `${cite.adr ? `ADR ${cite.adr}` : cite.path}${cite.start ? `:${cite.start}${cite.end ? `-${cite.end}` : ""}` : ""}`;
      const targets = targetsOf(cite);
      if (!targets.length) {
        const at = everywhere();
        results.push({ quote, cited: label, status: at.length ? "other-file" : "cited-file-missing", foundAt: at });
        continue;
      }
      const inCited = targets.flatMap((f) => findIn(f).map((l) => ({ f, l })));
      if (inCited.length) {
        const s = cite.start;
        const e = cite.end ?? s;
        const near = s === undefined || inCited.some(({ l }) => l >= s - lineTolerance && l <= (e ?? s) + lineTolerance);
        const { f, l } = inCited[0];
        // The nearest non-blank line before and after the match, plus the match itself.
        let before = l - 2;
        while (before >= 0 && !f.raw[before].trim()) before--;
        let after = l;
        while (after < f.raw.length && !f.raw[after].trim()) after++;
        const context = [before >= 0 ? f.raw[before] : "", f.raw[l - 1], after < f.raw.length ? f.raw[after] : ""].map((x) => x.trim()).filter(Boolean).join(" / ").slice(0, 400);
        results.push({ quote, cited: label, status: near ? "verified" : "wrong-line", foundAt: inCited.slice(0, 5).map(({ f, l }) => `${f.rel}:${l}`), context });
        continue;
      }
      const at = everywhere();
      results.push({ quote, cited: label, status: at.length ? "other-file" : "not-found", foundAt: at });
    }
  }
  if (skipped) notes.push(`Only the first ${MAX_QUOTES} quotes were checked; ${skipped} more were not. Check them in another call.`);
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
  return { checked: results.length, counts, results, problems, notes };
}
