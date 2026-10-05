// Scan a site's or app's source tree for the two things eval rounds 1–3 kept missing even when the
// instructions named them: (1) claims about data handling, price, availability and setup, wherever they
// sit (tooltips, FAQ answers, attributes, string literals), so they can be checked against the docs and
// against each other; (2) build-time env flags that change what gets built.
// Reads local files only, by extension, under the directory given. Returns text as data.

import { readdirSync, readFileSync, statSync, lstatSync, realpathSync, existsSync } from "node:fs";
import { join, relative, extname, sep, dirname } from "node:path";

export type ClaimKind = "data" | "price" | "availability" | "setup" | "proof";

export interface Claim {
  file: string;
  line: number;
  text: string;
  /** For short lines (a bare price), the nearest preceding copy, usually the plan or heading it belongs to. */
  context?: string;
}

export interface EnvFlag {
  name: string;
  uses: Array<{ file: string; line: number; text: string; affectsOutput: boolean }>;
}

export interface Decision {
  id: string;
  title: string;
  /** From the record itself: frontmatter "status:", a "Status:" line, or the whole "## Status" section. */
  status: string | null;
  /** Sentences of the status that carry a date (2026-08-21), newest first: later lines often amend the first one. */
  datedStatus: Array<{ text: string; date: string }>;
  /** From the decision index table (e.g. docs/adr/README.md) in the same folder, when there is one. */
  indexStatus: string | null;
  /** The record and the index give different statuses (open vs built, proposed vs accepted). */
  statusConflict: boolean;
  file: string;
}

/** An issue number (#4037) named by more than one decision record or index row. */
export interface DecisionIssue {
  issue: string;
  /** One line says it is open or not built, another says it is built or done. */
  conflict: boolean;
  mentions: Array<{ file: string; line: number; text: string; state: "open" | "done" | null }>;
}

export interface SourceScan {
  dir: string;
  filesScanned: number;
  truncated: boolean;
  claims: Record<ClaimKind, Claim[]>;
  claimCounts: Record<ClaimKind, number>;
  envFlags: EnvFlag[];
  /** Decision records (ADRs) with their recorded status, so features aren't described as shipped when the record says otherwise. */
  decisions: Decision[];
  /** Set when no records were under dir and they were read from this folder higher up in the same git repo. */
  decisionsFrom?: string;
  decisionIssues: DecisionIssue[];
  notes: string[];
}

const ADR_FILE = /^(\d{3,4})-[\w.-]+\.md$/;
const ADR_DIR = /(^|\/)(adr|adrs|decisions)\//i;

function decisionStatus(src: string): { status: string; body: string } | null {
  // Frontmatter only at the start of the file. With /m, every "---" line was a start that searched to the end of the file.
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(src)?.[1];
  const fm = block && /^status:[ \t]*(.+)$/m.exec(block);
  if (fm) return { status: fm[1].trim(), body: fm[1] };
  // [ \t]*, not \s*, where it meets a newline: \s* takes all the blank lines that follow and backtracks, which on a record
  // with many blank lines is quadratic.
  const line = /^[ \t]*(?:\*\*)?status(?:\*\*)?\s*:\s*(.+)$/im.exec(src);
  if (line) return { status: line[1].replace(/\*\*/g, "").trim().slice(0, 240), body: line[1] };
  // The whole section, up to the next heading: amendments ("Monitor mode built 2026-08-21") often follow the first paragraph.
  const head = /^#{2,3}[ \t]*status[ \t\r]*$/im.exec(src);
  if (!head) return null;
  const rest = src.slice(head.index + head[0].length);
  const end = rest.search(/\n#/);
  const body = end < 0 ? rest : rest.slice(0, end);
  const status = body.replace(/\s+/g, " ").trim().slice(0, 600);
  return status ? { status, body } : null;
}

function datedLines(body: string): Decision["datedStatus"] {
  const out: Decision["datedStatus"] = [];
  for (const part of body.split(/(?<=[.!?])\s+|\n\s*\n|\n\s*[-*]\s+/)) {
    const date = /\b(\d{4}-\d{2}-\d{2})\b/.exec(part)?.[1];
    if (date && out.length < 10) out.push({ text: part.replace(/\s+/g, " ").trim().slice(0, 200), date });
  }
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

// Status words, folded so "not fully built" and "open" compare equal.
const STATUS_WORDS = /\b(not (?:fully |yet )?(?:built|implemented|done)|partial(?:ly built)?|in progress|open|built|shipped|done|implemented|complete[d]?|accepted|proposed|draft|rejected|superseded|deprecated|deferred|withdrawn)\b/gi;
function statusWords(s: string): string {
  const fold = (w: string) => (/^(not|partial|in progress|open)/.test(w) ? "open" : /^(built|shipped|done|implemented|complete)/.test(w) ? "built" : w);
  return [...new Set([...s.toLowerCase().matchAll(STATUS_WORDS)].map((m) => fold(m[1])))].sort().join(",");
}
function statusesDiffer(a: string, b: string): boolean {
  const wa = statusWords(a);
  const wb = statusWords(b);
  if (wa && wb) return wa !== wb;
  const n = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return !n(a).includes(n(b)) && !n(b).includes(n(a));
}

const ISSUE = /#(\d{2,6})(?![\w-])/g;
function issueState(line: string): "open" | "done" | null {
  if (/\b(open|todo|pending|not (?:fully |yet )?(?:built|done|started|implemented)|planned|deferred|in progress|blocked)\b/i.test(line)) return "open";
  return /\b(built|shipped|done|closed|fixed|implemented|merged|released|landed)\b/i.test(line) ? "done" : null;
}

// Table cells, with or without the outer pipes: "| a | b |" and "a | b" are both rows.
function tableCells(row: string): string[] | null {
  if (!row.includes("|")) return null;
  const cells = row.split("|").map((c) => c.trim());
  if (/^\s*\|/.test(row)) cells.shift();
  if (/\|\s*$/.test(row)) cells.pop();
  return cells;
}

function readDecisions(root: string, files: string[]): { decisions: Decision[]; issues: DecisionIssue[]; numbered: number } {
  // Keyed by file: two folders (docs/adr, billing/adr) can both have a 0001.
  const out = new Map<string, Decision>();
  const mentions = new Map<string, DecisionIssue["mentions"]>();
  const noteIssues = (rel: string, src: string) => {
    src.split("\n").forEach((line, i) => {
      for (const m of line.matchAll(ISSUE)) {
        const list = mentions.get(m[1]) ?? [];
        if (list.length < 6 && !list.some((x) => x.file === rel && x.line === i + 1)) list.push({ file: rel, line: i + 1, text: line.trim().slice(0, 200), state: issueState(line) });
        mentions.set(m[1], list);
      }
    });
  };
  let numbered = 0;
  for (const f of files) {
    const rel = relative(root, f);
    const name = rel.split("/").pop() ?? "";
    const m = ADR_FILE.exec(name);
    if (!m) continue;
    numbered++;
    let src = "";
    try {
      src = readFileSync(f, "utf8");
    } catch {
      continue;
    }
    // Outside an adr/ or decisions/ folder (or when that folder is the one scanned, which the full path shows), a
    // numbered file is a record only when it has a status.
    const st = decisionStatus(src);
    if (!st && !ADR_DIR.test(f)) continue;
    const title = (/^#\s+(.+)$/m.exec(src)?.[1] ?? name).trim();
    out.set(rel, { id: m[1], title, status: st?.status ?? null, datedStatus: st ? datedLines(st.body) : [], indexStatus: null, statusConflict: false, file: rel });
    noteIssues(rel, src);
  }
  const byFolder = new Map([...out.values()].map((d) => [`${dirname(d.file)}/${d.id}`, d]));
  const folders = new Set([...out.values()].map((d) => dirname(d.file)));
  // Index tables: | [0003](0003-....md) | Decision | Date | Status |. The status is the column headed "Status", and a
  // table applies only to the records in its own folder.
  for (const f of files) {
    const rel = relative(root, f);
    if (!/^(README|index)\.md$/i.test(rel.split("/").pop() ?? "") || !folders.has(dirname(rel))) continue;
    let src = "";
    try {
      src = readFileSync(f, "utf8");
    } catch {
      continue;
    }
    noteIssues(rel, src);
    const folder = dirname(rel);
    let statusCol = -1;
    let inTable = false;
    for (const row of src.split("\n")) {
      const cells = tableCells(row);
      if (!cells) {
        inTable = false;
        continue;
      }
      if (!inTable) {
        // The first row of a table is its header.
        inTable = true;
        statusCol = cells.findIndex((c) => /status/i.test(c));
        continue;
      }
      const id = /\[?(\d{3,4})\]?/.exec(cells[0] ?? "")?.[1];
      if (!id || statusCol < 1 || statusCol >= cells.length) continue;
      const d = byFolder.get(`${folder}/${id}`);
      // [^()], not [^)]: from every "[1](" with no ")" after it, the scan ran to the end of the row.
      const status = cells[statusCol].replace(/\[(\d+)\]\([^()]*\)/g, "$1");
      if (d) {
        d.indexStatus = status;
        d.statusConflict = d.status !== null && statusesDiffer(d.status, status);
      }
    }
  }
  const issues = [...mentions.entries()]
    .filter(([, list]) => new Set(list.map((x) => x.file)).size > 1)
    .map(([n, list]) => ({
      issue: `#${n}`,
      conflict: list.some((x) => x.state === "open") && list.some((x) => x.state === "done"),
      mentions: list.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line),
    }))
    .sort((a, b) => Number(b.conflict) - Number(a.conflict) || a.issue.localeCompare(b.issue))
    .slice(0, 20);
  return { decisions: [...out.values()].sort((a, b) => a.file.localeCompare(b.file)), issues, numbered };
}

// When the scanned folder has no decision records (apps/docs), the repo's own docs/adr is often higher up.
const ADR_HOMES = ["docs/adr", "docs/adrs", "docs/decisions", "doc/adr", "adr", "adrs", "decisions"];
function findDecisionsAbove(root: string): string | null {
  let git: string | null = null;
  for (let p = root; ; p = dirname(p)) {
    if (existsSync(join(p, ".git"))) {
      git = p;
      break;
    }
    if (dirname(p) === p) return null;
  }
  for (let p = root; p !== git; ) {
    p = dirname(p);
    for (const h of ADR_HOMES) {
      const d = join(p, h);
      try {
        if (statSync(d).isDirectory()) return d;
      } catch {
        // not there
      }
    }
  }
  return null;
}

const EXTS = new Set([".astro", ".html", ".htm", ".md", ".mdx", ".tsx", ".jsx", ".ts", ".js", ".mjs", ".vue", ".svelte"]);
const SKIP_DIRS = new Set(["node_modules", "dist", "build", "out", "coverage", "vendor", "target", "__snapshots__"]);
export const MAX_FILES = 4000;
const MAX_BYTES = 512 * 1024;

// Tried on every line, read in full, so no part may rescan the rest of the line from many starting points ("curl curl
// curl ...", "1,1,1,..."): the pipe of "curl ... | sh" is found first, and a count starts only at the start of a number.
const PATTERNS: Record<ClaimKind, RegExp> = {
  data: /\b(stores?|stored|storing|collects?|collected|sends?|sent|uploads?|uploaded|read-only|never (see|read|store|touch|leaves?|sends?)|leaves? (your|the)|locally|on your (own )?(machine|computer|laptop|infrastructure|servers?|network)|credentials?|connection strings?|passwords?|encrypt\w*|retain\w*|retention|sample (rows|values)|parameter values|literal values|PII|personal data|GDPR|SOC ?2|HIPAA|rows? of (your )?data|query text|we (never|don't|do not) (see|read|store|access)|your data)\b/i,
  price: /([$€£]\d[\d,]*(\.\d{2})?(?!\d|\.\d))|(\b\d+(\.\d+)?\s?(\/|per\s)(mo|month|year|yr|seat|user|host|server|project)\b)|\b(free forever|free plan|free tier|lifetime|money-back|refund|trial)\b/i,
  availability: /\b(coming soon|soon|on (our|the) radar|roadmap|planned|in beta|beta|alpha|preview|early access|waitlist|not yet|launching|available now|now available|shipped|deprecated|retired|sunset)\b/i,
  setup: /(\bdocker (run|compose)\b|\bnpm (i|install)\b|\bnpx\b|\bpnpm (add|dlx)\b|\bpip install\b|\bbrew install\b|\|(?<=curl [^|]*\|)\s*(sh|bash)|\b\d+\s?(seconds?|secs?|minutes?|mins?)\b|\bone (click|command|line)\b|\bno (install|installation|signup|sign-up|credit card|code changes)\b)/i,
  proof: /(\b\d+(\.\d+)?\s?(%|x|×)(?![\w-])|\b(fastest|the only|first ever|#1|trusted by|used by|loved by|(?<![\d,])\d[\d,]*\+? (teams|companies|developers|users|customers)))/i,
};

// Attributes whose values are visible or read as copy: tooltips, labels, alt text, meta content.
const TEXT_ATTRS = /\b(data-tip|data-tooltip|title|aria-label|alt|placeholder|content|description|label|tooltip|summary)\s*=\s*(["'`])(.*?)\2/gi;

function stringLiterals(s: string): string {
  return (s.match(/(["'`])((?:(?!\1).){2,})\1/g) ?? []).map((l) => l.slice(1, -1)).join(" ");
}

function visibleParts(line: string): string {
  const attrs: string[] = [];
  for (const m of line.matchAll(TEXT_ATTRS)) attrs.push(m[3]);
  // [^<>], not [^>]: from every "<" with no ">" after it, the scan ran to the end of the line.
  const text = line
    .replace(/<[^<>]*>/g, " ")
    // Keep the string literals inside {...}: <p>{"We don't store it."}</p> and { a: "..." } are copy.
    .replace(/\{[^{}]*\}/g, (b) => " " + stringLiterals(b) + " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ");
  return [text, ...attrs].join(" ").replace(/\s+/g, " ").trim();
}

// The only dot-folders read when `dot` is set. A list of what to read, not of what to skip: other dot-folders hold version
// control data, build caches that fill the file limit before src/ (.angular/cache), or credentials (.config/gh, .docker).
export const DOT_DIRS = new Set([".github", ".claude", ".cursor", ".vscode", ".changeset", ".storybook"]);

/**
 * `state.links` counts the symbolic links not followed. `top` is the real path of the directory being scanned.
 * `dot` also reads the dot-folders in DOT_DIRS (.github, .claude, .cursor), never dotfiles: verify_quotes
 * said a correct citation of .github/workflows/deploy.yml was missing from the repo.
 */
export function walk(root: string, out: string[], state: { truncated: boolean; links?: number }, exts: Set<string> = EXTS, names: Set<string> = new Set(), top = root, dot = false) {
  let entries: string[];
  try {
    entries = readdirSync(root);
  } catch {
    return;
  }
  for (const name of entries.sort()) {
    if (out.length >= MAX_FILES) {
      state.truncated = true;
      return;
    }
    if ((name.startsWith(".") && !(dot && DOT_DIRS.has(name))) || SKIP_DIRS.has(name)) continue;
    const p = join(root, name);
    const wanted = (exts.has(extname(name).toLowerCase()) || names.has(name)) && !/\.(test|spec|d)\.[tj]sx?$/.test(name);
    let st;
    try {
      st = lstatSync(p);
      // A symbolic link is read only when it points to a file inside the scanned directory (AGENTS.md -> CLAUDE.md), under
      // its own path. Links to folders are not followed: one can point back up the tree, which never ends. Links out of
      // the directory could read any file (/proc/self/environ).
      if (st.isSymbolicLink()) {
        const real = realpathSync(p);
        st = statSync(real);
        if (!st.isFile() || !real.startsWith(top + sep)) {
          if (st.isDirectory() || wanted) state.links = (state.links ?? 0) + 1;
          continue;
        }
      }
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(p, out, state, exts, names, top, dot);
    else if (st.isFile() && wanted && st.size <= MAX_BYTES) out.push(p);
  }
}

const ENV_RE = /import\.meta\.env\.([A-Z][A-Z0-9_]*)|process\.env\.([A-Z][A-Z0-9_]*)|process\.env\[["']([A-Z][A-Z0-9_]*)["']\]|Deno\.env\.get\(["']([A-Z][A-Z0-9_]*)["']\)/g;
// A keyword, then a quote or "$" anywhere after the first one (one pattern rescanned the line after every keyword).
const SQL = /\b(select|insert into|order by|where|group by)\b/i;
const CSS = /^[.#@][\w-].*\{\s*$|^[\w-]+\s*:[^:]+;\s*$/;
const BUILTIN_ENV = new Set(["NODE_ENV", "DEV", "PROD", "SSR", "MODE", "BASE_URL", "CI", "PORT", "HOME", "PATH", "TZ"]);
const OUTPUT_HINT = /redirect|navigate|\bto:|<h1|head\(|<head|title|meta|canonical|robots|noindex|route|sitemap|\?\s*["'`/]|&&\s*\(|render/i;

export function scanSource(dir: string, maxPerKind = 60): SourceScan {
  const root = realpathSync(dir);
  if (!statSync(root).isDirectory()) throw new RangeError(`${dir} is not a directory`);
  if (root === "/") throw new RangeError("refusing to scan the filesystem root; pass the repo or app directory");
  const files: string[] = [];
  const state: { truncated: boolean; links?: number } = { truncated: false };
  walk(root, files, state);
  const claims: Record<ClaimKind, Claim[]> = { data: [], price: [], availability: [], setup: [], proof: [] };
  const counts: Record<ClaimKind, number> = { data: 0, price: 0, availability: 0, setup: 0, proof: 0 };
  const env = new Map<string, EnvFlag["uses"]>();
  for (const f of files) {
    let src: string;
    try {
      src = readFileSync(f, "utf8");
    } catch {
      continue;
    }
    const rel = relative(root, f);
    const isCode = /\.(ts|js|mjs)$/.test(f);
    let inStyle = false;
    const recent: string[] = [];
    src.split("\n").forEach((raw, i) => {
      // Skip CSS and code samples (<pre>, fenced blocks): their "$1" and "select" aren't copy.
      if (/<style[\s>]|<pre[\s>]|^\s*```/i.test(raw) && !inStyle) {
        inStyle = !/<\/style>|<\/pre>/i.test(raw) && !/^\s*```.*```/.test(raw);
        return;
      }
      if (inStyle) {
        if (/<\/style>|<\/pre>|^\s*```/i.test(raw)) inStyle = false;
        return;
      }
      for (const m of raw.matchAll(ENV_RE)) {
        const name = m[1] ?? m[2] ?? m[3] ?? m[4];
        if (!name || BUILTIN_ENV.has(name)) continue;
        const uses = env.get(name) ?? [];
        if (uses.length < 15) uses.push({ file: rel, line: i + 1, text: raw.trim().slice(0, 200), affectsOutput: OUTPUT_HINT.test(raw) || /routes?\/|pages\//.test(rel) });
        env.set(name, uses);
      }
      // In plain code files only string literals can be copy; elsewhere take visible text and text attributes.
      const text = isCode ? stringLiterals(raw) : visibleParts(raw);
      // SQL examples ("$1", "select ...") and CSS rules are not copy.
      const sql = SQL.exec(text);
      if ((sql && /["$]/.test(text.slice(sql.index))) || CSS.test(raw.trim())) return;
      const words = (text.match(/[A-Za-z]{2,}/g) ?? []).length;
      const ctx = recent.slice(-2).join(" / ");
      if (words >= 2) {
        recent.push(text.slice(0, 120));
        if (recent.length > 4) recent.shift();
      }
      for (const kind of Object.keys(PATTERNS) as ClaimKind[]) {
        if (!PATTERNS[kind].test(text)) continue;
        // A bare price on its own line counts; anything else needs a few words to be a claim.
        if (words < 3 && kind !== "price") continue;
        counts[kind]++;
        if (claims[kind].length < maxPerKind) claims[kind].push({ file: rel, line: i + 1, text: text.slice(0, 300), ...(words < 3 && ctx ? { context: ctx } : {}) });
      }
    });
  }
  const envFlags = [...env.entries()]
    .map(([name, uses]) => ({ name, uses }))
    .sort((a, b) => Number(b.uses.some((u) => u.affectsOutput)) - Number(a.uses.some((u) => u.affectsOutput)) || a.name.localeCompare(b.name));
  const notes = [
    "Lines are matched by keyword; some are not claims. Check each data, price and availability claim against the docs and against the other files: the same thing stated differently in two places is a finding.",
    "Tooltips, FAQ answers and attribute text are included because visitors read them. Docs folders are scanned too if they are under this directory; docs that disagree with each other are a finding.",
    "Env flags marked affectsOutput appear in routing, head or conditional rendering. Say which value the build you reviewed used.",
  ];
  if (state.truncated) notes.push(`Stopped after ${MAX_FILES} files; pass a narrower directory.`);
  if (state.links) notes.push(`Did not follow ${state.links} symbolic link${state.links === 1 ? "" : "s"}: they point to a folder or to a file outside this directory.`);
  for (const k of Object.keys(counts) as ClaimKind[]) if (counts[k] > maxPerKind) notes.push(`${k}: ${counts[k]} matches, first ${maxPerKind} shown; pass a narrower directory to see the rest.`);
  let { decisions, issues: decisionIssues, numbered } = readDecisions(root, files);
  let decisionsFrom: string | undefined;
  if (!decisions.length && numbered >= 3) notes.push(`${numbered} files are numbered like decision records (0001-name.md) but none has a status line, so no decision records found in ${root}.`);
  const above = decisions.length ? null : findDecisionsAbove(root);
  if (above) {
    const adrFiles: string[] = [];
    walk(above, adrFiles, { truncated: false }, new Set([".md"]), new Set(), realpathSync(above));
    ({ decisions, issues: decisionIssues } = readDecisions(root, adrFiles));
    if (decisions.length) {
      decisionsFrom = above;
      notes.push(`No decision records under this folder; read ${decisions.length} from ${above}. Their paths are relative to this folder.`);
    }
  }
  if (decisionIssues.some((x) => x.conflict)) notes.push("decisionIssues: records or index rows disagree about the same issue (one says open, another built). Check the issue and the code.");
  if (decisions.length) {
    notes.push("Decision statuses such as \"not fully built\", \"superseded\", \"open\" or \"proposed\" mean the feature is partial, replaced or undecided. Use them when you say whether something is shipped. When the record and the index differ, report both; settle it from the feature's docs and code; the newest dated line usually wins.");
  }
  return { dir: root, filesScanned: files.length, truncated: state.truncated, claims, claimCounts: counts, envFlags, decisions, ...(decisionsFrom ? { decisionsFrom } : {}), decisionIssues, notes };
}
