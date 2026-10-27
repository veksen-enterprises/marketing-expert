// Reading and writing evaluation files: run files, grade score tables, blind batches. Pure apart from the
// readers marked as such. Tested in test/evalGrading.test.ts.

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { rng, shuffle } from "./stats.mjs";

/** Items scored 0–2 and summed into the total. Items 2 and 6 are pass/fail gates (rubric.md says why). */
export const SCORED_ITEMS = [1, 3, 4, 5, 7, 8, 9, 10];
export const GATES = ["G2", "G6"];
/** Rounds 1–4 summed all ten items. */
export const LEGACY_ITEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/** Rows of the tables whose header names a "Score" or "Result" column; other tables in a grade are ignored. */
function scoreTableRows(markdown) {
  const rows = [];
  let header = null;
  for (const line of markdown.split("\n")) {
    if (!line.startsWith("|")) {
      header = null;
      continue;
    }
    if (header === null) header = /\|\s*(Score|Result)\s*\|/i.test(line);
    else if (header) rows.push(line);
  }
  return rows;
}

/**
 * Reads the score table of a grade. Current grades have a gates table (G2, G6) and the total is the sum of
 * SCORED_ITEMS; legacy grades (no gates) sum all ten items. The "Total" line the grader wrote is not trusted:
 * the total is recomputed. Throws on a missing, repeated or out-of-range row, naming it.
 */
export function parseGrade(markdown) {
  const items = {};
  const gates = {};
  for (const line of scoreTableRows(markdown)) {
    const m = line.match(/^\|\s*(G?\d+)\s*\|[^|]*\|\s*([^|]*?)\s*\|/);
    if (!m) continue;
    const [, id, raw] = m;
    const value = raw.replace(/[*_`]/g, "").trim().toLowerCase();
    if (id.startsWith("G")) {
      if (id in gates) throw new Error(`gate ${id} appears twice`);
      if (value !== "pass" && value !== "fail") throw new Error(`gate ${id}: "${raw}" is not pass or fail`);
      gates[id] = value;
    } else {
      const n = Number(id);
      if (n in items) throw new Error(`item ${n} appears twice`);
      if (!/^[0-2]$/.test(value)) throw new Error(`item ${n}: "${raw}" is not 0, 1 or 2`);
      items[n] = Number(value);
    }
  }
  const legacy = Object.keys(gates).length === 0;
  const expected = legacy ? LEGACY_ITEMS : SCORED_ITEMS;
  const missing = [...expected.filter((n) => !(n in items)), ...(legacy ? [] : GATES.filter((g) => !(g in gates)))];
  if (missing.length) throw new Error(`score table is missing ${missing.join(", ")}`);
  const extra = Object.keys(items).map(Number).filter((n) => !expected.includes(n));
  if (extra.length) throw new Error(`score table has items the rubric doesn't score: ${extra.join(", ")}`);
  return { legacy, items, gates, total: expected.reduce((a, n) => a + items[n], 0), max: 2 * expected.length };
}

/** The answer part of a run file: after "## Answer" (if present), before "## Tool log". */
export function answerSection(run) {
  const start = run.match(/^## Answer[^\n]*\n/m);
  let text = start ? run.slice(start.index + start[0].length) : run;
  const end = text.match(/^## Tool log\b/m);
  if (end) text = text.slice(0, end.index);
  return text.trim();
}

/**
 * Whether the run's tool log carries the check_answer fingerprint of its saved answer section (same hash as
 * src/lib/answerCheck.ts: sha256 of the whitespace-normalised text, first 10 hex digits). "differs" means a logged
 * fingerprint is there but none matches, so the saved text is not the checked text; "none logged" checks nothing.
 */
export function fingerprintStatus(run) {
  const hash = createHash("sha256").update(answerSection(run).replace(/\s+/g, " ").trim()).digest("hex").slice(0, 10);
  if (run.includes(hash)) return "match";
  return /fingerprint\W{0,3}[0-9a-f]{10}\b/i.test(run) ? "differs" : "none logged";
}

/** Case ids from evals/cases.md tables, with the fixture folder where the table has one. */
export function parseCases(casesMd) {
  const cases = new Map();
  for (const line of casesMd.split("\n")) {
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length < 5 || !/^[a-z][a-z0-9-]+$/.test(cells[1]) || cells[1] === "id") continue;
    // Real-business table: | id | business | message |. Fictional: | id | business | fixture | message |.
    const fictional = cells.length >= 6;
    cases.set(cells[1], { id: cells[1], business: cells[2], fixture: fictional ? cells[3] : undefined, message: cells[fictional ? 4 : 3], row: line });
  }
  return cases;
}

/**
 * Maps a run file to its case. Accepted: <case>.md, <case>-<n>.md, <case>-run<n>.md, <case>/<anything>.md.
 * Files marked contaminated are returned as skipped, never graded (evals/README.md, round 4).
 */
export function caseOfRun(relPath, caseIds) {
  const parts = relPath.split(/[\\/]/);
  if (parts.length === 2 && caseIds.has(parts[0])) return { case: parts[0] };
  const stem = basename(relPath).replace(/\.md$/, "");
  if (/contaminated/i.test(relPath)) return { skip: "marked contaminated" };
  const m = stem.match(/^(.*?)(?:-(?:run)?(\d+))?$/);
  if (m && caseIds.has(m[1])) return { case: m[1] };
  return { skip: "not a case id from evals/cases.md" };
}

/** Reads every run under `dir` (one level of subfolders). Reads the file system. */
export function listRuns(dir, caseIds) {
  const files = [];
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      for (const sub of readdirSync(p).sort()) if (sub.endsWith(".md")) files.push(join(name, sub));
    } else if (name.endsWith(".md")) files.push(name);
  }
  const runs = [];
  const skipped = [];
  for (const rel of files) {
    const c = caseOfRun(rel, caseIds);
    if (c.skip) skipped.push({ file: join(dir, rel), reason: c.skip });
    else runs.push({ case: c.case, file: join(dir, rel), text: readFileSync(join(dir, rel), "utf8") });
  }
  return { runs, skipped };
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Hides which version a run came from. Replaces per-run data folders (`evals/data/<name>`, which name the round),
 * the run folders' paths, and any extra patterns given. Version labels are not replaced as words ("baseline" is
 * also a marketing word); pass a pattern for a label that the advisors wrote into their answers. Returns the text and
 * how many replacements each rule made. It cannot hide differences in the content itself (a tool that only one
 * version has, a different tool count): blinding is of labels, not of behaviour.
 */
export function redact(text, { paths = [], patterns = [] } = {}) {
  const rules = [
    [/evals\/data\/[^\s`'")\],:*]+/g, "evals/data/<hidden>"],
    [/MARKETING_EXPERT_DATA_DIR=[^\s`'")\],]+/g, "MARKETING_EXPERT_DATA_DIR=<hidden>"],
    ...[...new Set(paths)].filter((p) => p.length >= 3).sort((a, b) => b.length - a.length).map((p) => [new RegExp(escape(p), "g"), "<hidden>"]),
    ...patterns.map((p) => [new RegExp(p, "g"), "<hidden>"]),
  ];
  const counts = [];
  let out = text;
  for (const [re, by] of rules) {
    let n = 0;
    out = out.replace(re, () => (n++, by));
    counts.push({ rule: String(re), n });
  }
  return { text: out, counts };
}

/**
 * Plans a blind batch: every run of every version, `copies` times each, under a random id, in shuffled order.
 * `versions`: [{ label, paths: [folder paths to hide], runs: [{ case, file, text }] }]. Graders see `<case>--<id>.md`: the case (they need it)
 * but not the version, round or copy. Returns the files to write and the key that maps ids back.
 */
export function planBatch(versions, { copies = 1, seed = Date.now() % 2 ** 31, patterns = [] } = {}) {
  const random = rng(seed);
  const paths = versions.flatMap((v) => v.paths ?? []);
  const entries = [];
  for (const v of versions) for (const r of v.runs) for (let copy = 1; copy <= copies; copy++) entries.push({ version: v.label, case: r.case, source: r.file, copy, text: r.text });
  const used = new Set();
  const newId = () => {
    for (;;) {
      const id = Math.floor(random() * 36 ** 6).toString(36).padStart(6, "0");
      if (!used.has(id)) return used.add(id), id;
    }
  };
  const order = shuffle(entries, random);
  const files = [];
  const key = [];
  for (const e of order) {
    const id = newId();
    const { text, counts } = redact(e.text, { paths, patterns });
    files.push({ name: `${e.case}--${id}.md`, text });
    key.push({ id, file: `${e.case}--${id}.md`, case: e.case, version: e.version, source: e.source, copy: e.copy, fingerprint: fingerprintStatus(e.text), sha256: createHash("sha256").update(e.text).digest("hex"), redactions: counts.reduce((a, c) => a + c.n, 0) });
  }
  // Same answer under two versions: the comparison would be of a file with itself.
  const seen = new Map();
  const identical = [];
  for (const k of key) {
    if (k.copy !== 1) continue;
    const other = seen.get(k.sha256);
    if (other && other.version !== k.version) identical.push([other.source, k.source].sort());
    else seen.set(k.sha256, k);
  }
  return { seed, files, key, identical };
}

/**
 * Overlap of errors.json entries between two grades of the same answer, matched by class and answer line.
 * Raw counts only: with two graders, capture–recapture estimates of the total are not reliable
 * (research/grader-reliability.md section 6).
 */
export function errorsOverlap(a, b) {
  const keyOf = (e) => `${e.class}@${e.answerLine ?? "?"}`;
  const ka = new Set(a.map(keyOf));
  const kb = new Set(b.map(keyOf));
  const both = [...ka].filter((k) => kb.has(k)).length;
  const union = new Set([...ka, ...kb]).size;
  return { a: ka.size, b: kb.size, both, union, shareBoth: union ? both / union : NaN };
}

/** Reads a grade and its errors file from a batch. Reads the file system. */
export function readGrade(gradesDir, id) {
  const md = join(gradesDir, `${id}.md`);
  if (!existsSync(md)) return { missing: true };
  const errorsPath = join(gradesDir, `${id}.errors.json`);
  try {
    const grade = parseGrade(readFileSync(md, "utf8"));
    const errors = existsSync(errorsPath) ? JSON.parse(readFileSync(errorsPath, "utf8")) : null;
    return { ...grade, errors };
  } catch (e) {
    return { invalid: `${relative(process.cwd(), md)}: ${e.message}` };
  }
}
