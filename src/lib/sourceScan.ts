// Scan a site's or app's source tree for the two things eval rounds 1–3 kept missing even when the
// instructions named them: (1) claims about data handling, price, availability and setup, wherever they
// sit (tooltips, FAQ answers, attributes, string literals), so they can be checked against the docs and
// against each other; (2) build-time env flags that change what gets built.
// Reads local files only, by extension, under the directory given. Returns text as data.

import { readdirSync, readFileSync, statSync, lstatSync, realpathSync } from "node:fs";
import { join, relative, extname } from "node:path";

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
  /** From the record itself: frontmatter "status:", a "Status:" line, or the first paragraph under "## Status". */
  status: string | null;
  /** From the decision index table (e.g. docs/adr/README.md), when there is one. */
  indexStatus: string | null;
  file: string;
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
  notes: string[];
}

const ADR_FILE = /^(\d{3,4})-[\w.-]+\.md$/;

function decisionStatus(src: string): string | null {
  const fm = /^---\n[\s\S]*?^status:\s*(.+)$[\s\S]*?^---/m.exec(src);
  if (fm) return fm[1].trim();
  // [ \t]*, not \s*, where it meets a newline: \s* takes all the blank lines that follow and backtracks, which on a record
  // with many blank lines is quadratic.
  const line = /^[ \t]*(?:\*\*)?status(?:\*\*)?\s*:\s*(.+)$/im.exec(src);
  if (line) return line[1].replace(/\*\*/g, "").trim().slice(0, 240);
  const sec = /^#{2,3}\s*status[ \t\r]*\n+([\s\S]*?)(?:\n\s*\n|\n#)/im.exec(src);
  return sec ? sec[1].replace(/\s+/g, " ").trim().slice(0, 240) : null;
}

function readDecisions(root: string, files: string[]): Decision[] {
  const out = new Map<string, Decision>();
  for (const f of files) {
    const rel = relative(root, f);
    const name = rel.split("/").pop() ?? "";
    const m = ADR_FILE.exec(name);
    if (!m || !/(^|\/)(adr|adrs|decisions)\//i.test(rel)) continue;
    let src = "";
    try {
      src = readFileSync(f, "utf8");
    } catch {
      continue;
    }
    const title = (/^#\s+(.+)$/m.exec(src)?.[1] ?? name).trim();
    out.set(m[1], { id: m[1], title, status: decisionStatus(src), indexStatus: null, file: rel });
  }
  // Index tables: | [0003](0003-....md) | Decision | Date | Status |
  for (const f of files) {
    const rel = relative(root, f);
    if (!/(^|\/)(adr|adrs|decisions)\/(README|index)\.md$/i.test(rel)) continue;
    let src = "";
    try {
      src = readFileSync(f, "utf8");
    } catch {
      continue;
    }
    for (const row of src.split("\n")) {
      const cells = row.split("|").map((c) => c.trim());
      const id = /\[?(\d{3,4})\]?/.exec(cells[1] ?? "")?.[1];
      if (!id || cells.length < 5) continue;
      const d = out.get(id);
      const status = cells[cells.length - 2].replace(/\[(\d+)\]\([^)]*\)/g, "$1");
      if (d) d.indexStatus = status;
    }
  }
  return [...out.values()].sort((a, b) => a.id.localeCompare(b.id));
}

const EXTS = new Set([".astro", ".html", ".htm", ".md", ".mdx", ".tsx", ".jsx", ".ts", ".js", ".mjs", ".vue", ".svelte"]);
const SKIP_DIRS = new Set(["node_modules", "dist", "build", "out", "coverage", "vendor", "target", "__snapshots__"]);
export const MAX_FILES = 4000;
const MAX_BYTES = 512 * 1024;
// Longer lines are minified code or data, not copy; only the start of them is read.
const MAX_LINE = 2000;

// Tried on every line, so no part may rescan the rest of the line from many starting points ("curl curl curl ...",
// "1,1,1,..."): the pipe of "curl ... | sh" is found first, and a count starts only at the start of a number.
const PATTERNS: Record<ClaimKind, RegExp> = {
  data: /\b(stores?|stored|storing|collects?|collected|sends?|sent|uploads?|uploaded|read-only|never (see|read|store|touch|leaves?|sends?)|leaves? (your|the)|locally|on your (own )?(machine|computer|laptop|infrastructure|servers?|network)|credentials?|connection strings?|passwords?|encrypt\w*|retain\w*|retention|sample (rows|values)|parameter values|literal values|PII|personal data|GDPR|SOC ?2|HIPAA|rows? of (your )?data|query text|we (never|don't|do not) (see|read|store|access)|your data)\b/i,
  price: /([$€£]\d[\d,]*(\.\d{2})?(?![\d.]))|(\b\d+(\.\d+)?\s?(\/|per\s)(mo|month|year|yr|seat|user|host|server|project)\b)|\b(free forever|free plan|free tier|lifetime|money-back|refund|trial)\b/i,
  availability: /\b(coming soon|soon|on (our|the) radar|roadmap|planned|in beta|beta|alpha|preview|early access|waitlist|not yet|launching|available now|now available|shipped|deprecated|retired|sunset)\b/i,
  setup: /(\bdocker (run|compose)\b|\bnpm (i|install)\b|\bnpx\b|\bpnpm (add|dlx)\b|\bpip install\b|\bbrew install\b|\|(?<=curl [^|]*\|)\s*(sh|bash)|\b\d+\s?(seconds?|secs?|minutes?|mins?)\b|\bone (click|command|line)\b|\bno (install|installation|signup|sign-up|credit card|code changes)\b)/i,
  proof: /(\b\d+(\.\d+)?\s?(%|x|×)(?![\w-])|\b(fastest|the only|first ever|#1|trusted by|used by|loved by|(?<![\d,])\d[\d,]*\+? (teams|companies|developers|users|customers)))/i,
};

// Attributes whose values are visible or read as copy: tooltips, labels, alt text, meta content.
const TEXT_ATTRS = /\b(data-tip|data-tooltip|title|aria-label|alt|placeholder|content|description|label|tooltip|summary)\s*=\s*(["'`])(.*?)\2/gi;

function visibleParts(line: string): string {
  const attrs: string[] = [];
  for (const m of line.matchAll(TEXT_ATTRS)) attrs.push(m[3]);
  // [^<>], not [^>]: from every "<" with no ">" after it, the scan ran to the end of the line.
  const text = line
    .replace(/<[^<>]*>/g, " ")
    .replace(/\{[^{}]*\}/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ");
  return [text, ...attrs].join(" ").replace(/\s+/g, " ").trim();
}

export function walk(root: string, out: string[], state: { truncated: boolean }, exts: Set<string> = EXTS, names: Set<string> = new Set()) {
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
    if (name.startsWith(".") || SKIP_DIRS.has(name)) continue;
    const p = join(root, name);
    let st;
    try {
      // lstat, so symbolic links are skipped: one can point outside the directory (/proc/self/environ) or back up the tree, which never ends.
      st = lstatSync(p);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(p, out, state, exts, names);
    else if (st.isFile() && (exts.has(extname(name).toLowerCase()) || names.has(name)) && st.size <= MAX_BYTES && !/\.(test|spec|d)\.[tj]sx?$/.test(name)) out.push(p);
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
  const state = { truncated: false };
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
    src.split("\n").forEach((full, i) => {
      const raw = full.slice(0, MAX_LINE);
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
      const literals = (raw.match(/(["'`])((?:(?!\1).){2,})\1/g) ?? []).map((l) => l.slice(1, -1)).join(" ");
      const text = isCode ? literals : visibleParts(raw);
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
  for (const k of Object.keys(counts) as ClaimKind[]) if (counts[k] > maxPerKind) notes.push(`${k}: ${counts[k]} matches, first ${maxPerKind} shown; pass a narrower directory to see the rest.`);
  const decisions = readDecisions(root, files);
  if (decisions.length) {
    notes.push("Decision statuses such as \"not fully built\", \"superseded\", \"open\" or \"proposed\" mean the feature is partial, replaced or undecided. Use them when you say whether something is shipped, and prefer the index status when it differs from the record.");
  }
  return { dir: root, filesScanned: files.length, truncated: state.truncated, claims, claimCounts: counts, envFlags, decisions, notes };
}
