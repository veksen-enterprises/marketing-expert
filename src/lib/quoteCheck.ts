// Check the quotes and file citations in a draft answer against the repository they claim to come from.
// Rounds 2–4 of the evals: the most common error was a quote, file or line that didn't match the repo
// (wrong line, quote put in the wrong ADR, words changed inside quotation marks). Instructions didn't stop it;
// this checks it mechanically.

import { readFileSync, realpathSync, statSync } from "node:fs";
import { relative, basename, join, sep } from "node:path";
import { walk, MAX_FILES, DOT_DIRS } from "./sourceScan.js";
import { getPlaybook } from "./knowledge.js";

/** cited-file-not-read: the cited file is in the repo but was not read (too large, or the 50 MB limit for the call was reached), so the quote was not checked. */
export type QuoteStatus = "verified" | "wrong-line" | "other-file" | "cited-file-missing" | "cited-file-not-read" | "not-found" | "uncited-found" | "uncited-not-found";

export interface QuoteResult {
  quote: string;
  /** The citation the quote was checked against: the one right after the closing quote, else one in the same sentence. */
  cited: string | null;
  status: QuoteStatus;
  /** Where the quote actually is (first few matches, nearest the cited line first). */
  foundAt: string[];
  /** The source line before, at and after the match nearest the cited line, so the quote's scope is visible (e.g. "of the rare and crafted table"). */
  context?: string;
}

export interface QuoteCheck {
  checked: number;
  counts: Record<QuoteStatus, number>;
  results: QuoteResult[];
  problems: string[];
  /** Quotes not checked, and why, so none is dropped without a word. */
  skipped: Array<{ quote: string; reason: string }>;
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
const ADR_RE = /\b(?:ADR[- ]?|adr\/|[Dd]ecision [Rr]ecord )(\d{3,4})\b(?:[^.\n]{0,12}?lines? (\d+)(?:\s?[-–]\s?(\d+))?)?|\((\d{4}) lines? (\d+)(?:\s?[-–]\s?(\d+))?\)/g;

const PLAYBOOK_RE = /\(([a-z0-9]+(?:-[a-z0-9]+)*) playbook\)|\bplaybook:([a-z0-9]+(?:-[a-z0-9]+)*)/g;
const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
  mdash: "—", ndash: "–", hellip: "…", copy: "©", reg: "®", trade: "™", middot: "·", times: "×", euro: "€", pound: "£",
};

function entity(e: string, k: string): string {
  if (k[0] !== "#") return ENTITIES[k.toLowerCase()] ?? e;
  const n = k[1] === "x" || k[1] === "X" ? parseInt(k.slice(2), 16) : Number(k.slice(1));
  return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : e;
}

// Applied the same way to source lines and to quotes, so a quote of the rendered words matches the markup.
function norm(s: string): string {
  return s
    // JSX writes a space at a line break as {" "}.
    .replace(/\{\s*(["'])\s\1\s*\}/g, " ")
    // Drop tags but keep their quoted attribute values (tooltips, alt text, titles). [^<>], not [^>]: from every "<"
    // with no ">" after it, the scan ran to the end of the line.
    .replace(/<[^<>]+>/g, (tag) => [...tag.matchAll(/=\s*"([^"]*)"/g)].map((m) => ` ${m[1]} `).join(""))
    // Markdown links and images show only their text.
    .replace(/!?\[([^\[\]]*)\]\([^()\s]*\)/g, "$1")
    // After the tags are dropped, so a decoded "&lt;b&gt;" stays as text.
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, entity)
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface Indexed {
  rel: string;
  raw: string[];
  /** The normalised lines, joined with spaces. */
  joined: string;
  /** Character offset in `joined` where each line starts. */
  starts: number[];
  /** The directory `rel` is relative to. */
  base?: string;
}

// A quote not found in its cited file is searched for in every file, so the time grows with quotes x repository size.
const MAX_QUOTES = 100;
// Text held in memory across all dirs. Up to 5 dirs of 4000 files each could otherwise exhaust memory and end the server.
const MAX_TOTAL = 50 * 1024 * 1024;

// A cited file left out of the index (too large, a test file, past the file limit) is read directly up to this size.
const MAX_DIRECT = 5 * 1024 * 1024;

function indexed(rel: string, src: string, base?: string): Indexed {
  const raw = src.split("\n");
  const lines = raw.map(norm);
  const starts: number[] = [];
  let pos = 0;
  for (const l of lines) {
    starts.push(pos);
    pos += l.length + 1;
  }
  return { rel, raw, joined: lines.join(" "), starts, base };
}

function index(dirs: string[], notes: string[], read: { roots: string[]; total: number }): Indexed[] {
  const out: Indexed[] = [];
  const roots = dirs.map((d) => {
    const root = realpathSync(d);
    if (!statSync(root).isDirectory()) throw new RangeError(`${d} is not a directory`);
    if (root === "/") throw new RangeError("refusing to scan the filesystem root");
    return root;
  });
  read.roots = roots;
  // Dirs and files already read: the same dir passed twice, or a file reached through two dirs (one inside the other), is read once.
  const seen = new Set<string>();
  let total = 0;
  for (const [i, d] of dirs.entries()) {
    const root = roots[i];
    if (seen.has(root)) continue;
    seen.add(root);
    // Paths are relative to the outermost dir listed, whatever the order: with [repo/docs, repo], docs/README.md is
    // "docs/README.md", not "README.md", which a citation of the top README.md would also match.
    const base = roots.filter((r) => root.startsWith(r + sep)).sort((a, b) => a.length - b.length)[0] ?? root;
    const files: string[] = [];
    const state: { truncated: boolean; links?: number } = { truncated: false };
    walk(root, files, state, EXTS, NAMES, root, true);
    if (state.truncated) notes.push(`Only the first ${MAX_FILES} files in ${d} were read. Quotes from other files show as not found; pass a narrower directory.`);
    if (state.links) notes.push(`Did not follow ${state.links} symbolic link${state.links === 1 ? "" : "s"} in ${d}: they point to a folder or to a file outside it. Quotes from files behind them show as not found.`);
    for (const f of files) {
      if (seen.has(f)) continue;
      seen.add(f);
      let src: string;
      try {
        src = readFileSync(f, "utf8");
      } catch {
        continue;
      }
      read.total += src.length;
      if (read.total > MAX_TOTAL) {
        notes.push("Stopped reading after 50 MB of files. Quotes from files not read show as not found; pass a narrower directory.");
        return out;
      }
      out.push(indexed(relative(base, f), src, base));
    }
  }
  return out;
}

/**
 * A cited path that exists under one of the dirs but was not indexed: read it, or say why not ("too-large" for the file,
 * "budget" when the 50 MB for this call is used up). Never outside the dirs, and in no dot-folder but those walk reads,
 * checked on the real path, so ".." or a symbolic link can't reach .git or a credentials file.
 */
function direct(p: string, read: { roots: string[]; total: number }): Indexed | "too-large" | "budget" | null {
  for (const root of read.roots) {
    try {
      const real = realpathSync(join(root, p));
      const st = statSync(real);
      if (!real.startsWith(root + sep) || !st.isFile()) continue;
      if (relative(root, real).split(sep).some((s) => s.startsWith(".") && !DOT_DIRS.has(s))) continue;
      if (st.size > MAX_DIRECT) return "too-large";
      if (read.total + st.size > MAX_TOTAL) return "budget";
      const src = readFileSync(real, "utf8");
      read.total += src.length;
      return indexed(relative(root, join(root, p)), src, root);
    } catch {
      continue;
    }
  }
  return null;
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

const isWord = (c: string | undefined) => c !== undefined && /[\p{L}\p{N}]/u.test(c);

/** The next place `frag` occurs as whole words: a short fragment ("forever", "Team") must not match inside a longer word. */
function seek(hay: string, frag: string, from: number): number {
  for (let i = hay.indexOf(frag, from); i >= 0; i = hay.indexOf(frag, i + 1)) {
    if (isWord(frag[0]) && isWord(hay[i - 1])) continue;
    if (isWord(frag[frag.length - 1]) && isWord(hay[i + frag.length])) continue;
    return i;
  }
  return -1;
}

/** Every line where all fragments of the quote occur (fragments split on "…"/"..."), in order, within a short span. */
function find(ix: Indexed, fragments: string[]): number[] {
  const hits: number[] = [];
  // Where each later fragment was last found. `at` only grows from one start to the next, so a position at or after it
  // is still the next match: each fragment is searched for once through the file, not once per start.
  const next: number[] = [];
  let from = 0;
  for (;;) {
    const first = seek(ix.joined, fragments[0], from);
    if (first < 0) break;
    let ok = true;
    let at = first + fragments[0].length;
    for (let k = 1; k < fragments.length; k++) {
      if (next[k] === undefined || next[k] < at) next[k] = seek(ix.joined, fragments[k], at);
      // Not anywhere after this start, so not after any later one either.
      if (next[k] < 0) return hits;
      if (next[k] - at > 600) {
        ok = false;
        break;
      }
      at = next[k] + fragments[k].length;
    }
    if (ok) hits.push(lineAt(ix, first));
    // No cap on hits: a correct citation of the 7th copy of a repeated tooltip was "wrong-line" when only 5 were kept.
    from = first + 1;
  }
  return hits;
}

interface Citation {
  path: string;
  adr?: string;
  playbook?: string;
  start?: number;
  end?: number;
  pos: number;
}

function citationsIn(segment: string): Citation[] {
  const out: Citation[] = [];
  for (const t of segment.matchAll(TOKEN_RE)) {
    let path = PATH_RE.exec(t[0])?.[0];
    if (!path) continue;
    // "[pricing.astro:9]": the bracket opens the citation. A "[" with its "]" in the path is part of it ([slug].astro).
    const lead = path[0] === "[" && !path.includes("]") ? 1 : 0;
    path = path.slice(lead);
    LINES_RE.lastIndex = (t.index ?? 0) + lead + path.length;
    const m = LINES_RE.exec(segment);
    out.push({ path, start: m ? Number(m[1]) : undefined, end: m?.[2] ? Number(m[2]) : undefined, pos: (t.index ?? 0) + lead });
  }
  for (const m of segment.matchAll(ADR_RE)) {
    const num = m[1] ?? m[4];
    const s = m[2] ?? m[5];
    const e = m[3] ?? m[6];
    out.push({ path: `adr/${num}`, adr: num, start: s ? Number(s) : undefined, end: e ? Number(e) : undefined, pos: m.index ?? 0 });
  }
  // "(developer-tools playbook)" only when that playbook exists ("(the playbook)" is not a citation); "playbook:x" always.
  for (const m of segment.matchAll(PLAYBOOK_RE)) {
    const slug = m[1] ?? m[2];
    if (m[1] && !getPlaybook(slug)) continue;
    out.push({ path: `playbook:${slug}`, playbook: slug, pos: m.index ?? 0 });
  }
  return out.sort((a, b) => a.pos - b.pos);
}

interface Lookup {
  /** Files by name. A citation's exact path, or any path ending with it, has the same name. */
  byName: Map<string, Indexed[]>;
  /** Decision records under adr/, adrs/ or decisions/ by their number (7 for 007 and 0007). */
  byAdr: Map<string, Indexed[]>;
}

// Built once per call, so a citation is looked up and not compared with every file (5000 citations x 4000 files took 2 s).
function lookup(files: Indexed[]): Lookup {
  const byName = new Map<string, Indexed[]>();
  const byAdr = new Map<string, Indexed[]>();
  const add = (m: Map<string, Indexed[]>, k: string, f: Indexed) => {
    const list = m.get(k);
    if (list) list.push(f);
    else m.set(k, [f]);
  };
  for (const f of files) {
    const name = basename(f.rel);
    add(byName, name, f);
    const num = /^(\d{3,4})(?!\d)/.exec(name)?.[1];
    if (num && /(^|\/)(adr|adrs|decisions)\//i.test(f.rel)) add(byAdr, String(Number(num)), f);
  }
  return { byName, byAdr };
}

function resolve(by: Lookup, c: Citation): Indexed[] {
  if (c.adr) return by.byAdr.get(String(Number(c.adr))) ?? [];
  const p = c.path.replace(/^\.?\//, "");
  // The path cited, a longer path ending with it, or a shorter one when the rest is where the dir passed sits (apps/web
  // passed, apps/web/src/a.astro cited). Not any other file of the same name: apps/marketing/pages/index.astro was
  // "verified" from apps/app/src/pages/index.astro.
  const above = (f: Indexed) => p.endsWith("/" + f.rel) && !!f.base?.endsWith(sep + p.slice(0, -f.rel.length - 1));
  return (by.byName.get(basename(p)) ?? []).filter((f) => f.rel === p || f.rel.endsWith("/" + p) || above(f));
}

// A quote: a pair of quotation marks on one line. A mark right after a digit is an inch mark (27"), not an opening quote.
const QUOTE_RE = /(?<!\d)["“]([^"”\n]{1,400})["”]/g;
// A citation this close after the closing quote (punctuation, a bracket, a backtick) belongs to that quote.
const ADJACENT = /^[\s.,;:!?(\[`*—–-]{0,4}$/;

/** Split an answer line into sentences, but never inside a quote or between a closing quote and the bracketed citation after it. */
function sentencesOf(line: string): string[] {
  const spans = [...line.matchAll(QUOTE_RE)].map((m) => [m.index ?? 0, (m.index ?? 0) + m[0].length]);
  const out: string[] = [];
  let from = 0;
  for (const m of line.matchAll(/(?<=[.!?]["”)]?)\s+(?=[`A-Z(*\[])/g)) {
    const at = m.index ?? 0;
    if (spans.some(([s, e]) => at > s && at < e)) continue;
    // '."' or '".' then "(file:9)", or a citation in backticks or brackets.
    const next = line.slice(at + m[0].length);
    if (/["”][.!?]?$/.test(line.slice(0, at)) && (next[0] === "(" || (/^[`\[]/.test(next) && citationsIn(next.slice(1, 200)).some((c) => c.pos === 0)))) continue;
    out.push(line.slice(from, at));
    from = at + m[0].length;
  }
  out.push(line.slice(from));
  return out;
}

/** `tools`: the names of the server's tools. A quote from a sentence that names one, with no file cited, quotes tool output. */
export function checkQuotes(text: string, dirs: string[], lineTolerance = 2, tools: Iterable<string> = []): QuoteCheck {
  const notes: string[] = [];
  const read = { roots: [] as string[], total: 0 };
  const files = index(dirs, notes, read);
  const filesBy = lookup(files);
  const results: QuoteResult[] = [];
  const skippedList: Array<{ quote: string; reason: string }> = [];
  let skipped = 0;
  const toolRe = [...tools].length ? new RegExp(`\\b(${[...tools].join("|")})\\b`) : null;
  // Cited files that are in a dir but were not read, and why: too large, or the 50 MB for this call was used up.
  const notRead = new Map<string, "too-large" | "budget">();
  const budgetHit = new Set<QuoteResult>();
  const unpaired: string[] = [];
  // Many quotes in one sentence often cite the same file: resolve each citation once per call.
  const resolved = new Map<string, Indexed[]>();
  const targetsOf = (c: Citation) => {
    const key = c.adr ? `adr ${c.adr}` : c.path;
    let t = resolved.get(key);
    if (!t) {
      if (c.playbook) {
        const book = getPlaybook(c.playbook);
        t = book ? [indexed(c.path, book.body)] : [];
      } else {
        t = resolve(filesBy, c);
        if (!t.length && !c.adr) {
          const d = direct(c.path.replace(/^\.?\//, ""), read);
          if (d === "too-large" || d === "budget") notRead.set(key, d);
          else if (d) t = [d];
        }
      }
      resolved.set(key, t);
    }
    return t;
  };
  // A segment is a sentence of a line of the answer (a bullet, table row or paragraph). A quote's citation is the one
  // right after its closing quote; otherwise one in the same sentence.
  const sentences = text.split("\n").flatMap(sentencesOf);
  for (const segment of sentences) {
    const cites = citationsIn(segment);
    const quotes = [...segment.matchAll(QUOTE_RE)];
    const rest = quotes.reduceRight((s, m) => s.slice(0, m.index) + " ".repeat(m[0].length) + s.slice((m.index ?? 0) + m[0].length), segment);
    const open = rest.search(/(?<!\d)["“”]/);
    if (open >= 0) {
      skippedList.push({ quote: segment.slice(open, open + 80), reason: "no closing quotation mark within 400 characters on the same line, so it was not checked" });
      // A stray mark shifts the pairs, so a quote with a citation can go unchecked: say so where the advisor looks.
      if (cites.length) unpaired.push(`${segment.trim().slice(0, 120)}: a quotation mark in this sentence has no partner, so a quote in it may not have been checked. Fix the quotation marks and check again.`);
    }
    for (const m of quotes) {
      const quote = m[1];
      // Text between two different quotes ("a" (`file`), "b") is not a quote.
      if (/^[\s,.;:)\]]/.test(quote) || /[\s(\[]$/.test(quote)) continue;
      // Every fragment is checked, however short: dropping "forever" from "We store query logs … forever" verified a misquote.
      const fragments = quote
        .split(/\s*(?:…|\.\.\.)\s*/)
        .map((f) => norm(f).replace(/^[\s,.;:!?]+|[\s,.;:!?]+$/g, ""))
        .filter(Boolean);
      if (!fragments.length) {
        skippedList.push({ quote, reason: "no words to check" });
        continue;
      }
      const qStart = m.index ?? 0;
      const qEnd = qStart + m[0].length;
      const adjacent = cites.find((c) => c.pos >= qEnd && ADJACENT.test(segment.slice(qEnd, c.pos)));
      // One or two words are often a name or a scare quote; checked only when a file:line citation follows right after.
      if (quote.trim().split(/\s+/).length < 3 && !(adjacent && (adjacent.start !== undefined || adjacent.playbook))) {
        skippedList.push({ quote, reason: "fewer than 3 words and no file:line citation right after it, so it was not checked" });
        continue;
      }
      const tool = cites.length ? null : (/\(tool:\s*([\w-]+)\)/.exec(segment) ?? (toolRe && toolRe.exec(segment)));
      if (tool) {
        skippedList.push({ quote, reason: `quotes the output of ${tool[1]}, not a file, so it was not checked; compare it with that tool's output` });
        continue;
      }
      if (results.length >= MAX_QUOTES) {
        skipped++;
        skippedList.push({ quote, reason: `over the limit of ${MAX_QUOTES} quotes per call; check it in another call` });
        continue;
      }
      // And search each file once per quote, however many citations point to it.
      const found = new Map<Indexed, number[]>();
      const findIn = (f: Indexed) => {
        let hits = found.get(f);
        if (!hits) found.set(f, (hits = find(f, fragments)));
        return hits;
      };
      const dist = (c: Citation) => (c.pos >= qEnd ? c.pos - qEnd : Math.max(0, qStart - c.pos - c.path.length));
      // The citation right after the quote, if any. Otherwise prefer a citation in the sentence whose file holds the
      // quote, then the nearest one.
      const holder = adjacent ?? [...cites].sort((a, b) => dist(a) - dist(b)).find((c) => targetsOf(c).some((f) => findIn(f).length));
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
        const why = notRead.get(cite.adr ? `adr ${cite.adr}` : cite.path);
        const r: QuoteResult = { quote, cited: label, status: at.length ? "other-file" : why ? "cited-file-not-read" : "cited-file-missing", foundAt: at };
        if (why === "budget") budgetHit.add(r);
        results.push(r);
        continue;
      }
      const inCited = targets.flatMap((f) => findIn(f).map((l) => ({ f, l })));
      if (inCited.length) {
        const s = cite.start;
        const e = cite.end ?? s;
        // Lines away from the cited range. Context and foundAt come from the nearest match, not the first in the file.
        const off = (l: number) => (s === undefined || e === undefined ? 0 : l < s ? s - l : l > e ? l - e : 0);
        inCited.sort((a, b) => off(a.l) - off(b.l));
        const near = off(inCited[0].l) <= lineTolerance;
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
  const counts = { verified: 0, "wrong-line": 0, "other-file": 0, "cited-file-missing": 0, "cited-file-not-read": 0, "not-found": 0, "uncited-found": 0, "uncited-not-found": 0 } as Record<QuoteStatus, number>;
  for (const r of results) counts[r.status]++;
  const problems = results
    .filter((r) => ["wrong-line", "other-file", "cited-file-missing", "cited-file-not-read", "not-found"].includes(r.status))
    .map((r) => {
      const q = `"${r.quote.slice(0, 80)}${r.quote.length > 80 ? "…" : ""}"`;
      if (r.status === "wrong-line") return `${q}: in ${r.cited?.split(":")[0]} but at ${r.foundAt.join(", ")}, not ${r.cited}. Fix the line.`;
      if (r.status === "other-file") return `${q}: not in ${r.cited}; found at ${r.foundAt.join(", ")}. Fix the citation.`;
      if (r.status === "cited-file-missing")
        return `${q}: no file matching ${r.cited} in the repo, and the words aren't anywhere else either.${notes.length ? " Some files were not read (see notes)." : ""}`;
      if (r.status === "cited-file-not-read" && budgetHit.has(r))
        return `${q}: ${r.cited?.split(":")[0]} was not read because the 50 MB limit for this call was reached, so this quote was not checked. Check it in a call with a narrower directory.`;
      if (r.status === "cited-file-not-read") return `${q}: ${r.cited?.split(":")[0]} is in the repo but too large to read, so this quote was not checked. Check it by hand or drop the quotation marks.`;
      return `${q}: not found verbatim in ${r.cited}. Quote the exact words or drop the quotation marks.`;
    });
  return { checked: results.length, counts, results, problems: [...problems, ...unpaired], skipped: skippedList, notes };
}
