// Scan a site's or app's source tree for the two things eval rounds 1–3 kept missing even when the
// instructions named them: (1) claims about data handling, price, availability and setup, wherever they
// sit (tooltips, FAQ answers, attributes, string literals), so they can be checked against the docs and
// against each other; (2) build-time env flags that change what gets built.
// Reads local files only, by extension, under the directory given. Returns text as data.

import { readdirSync, readFileSync, statSync, lstatSync, realpathSync, existsSync } from "node:fs";
import { join, relative, extname, sep, dirname } from "node:path";

export type ClaimKind = "data" | "price" | "availability" | "setup" | "proof" | "oss" | "access";
const KINDS: ClaimKind[] = ["data", "price", "availability", "setup", "proof", "oss", "access"];

export interface Claim {
  file: string;
  line: number;
  text: string;
  /** For short lines (a bare price), the nearest preceding copy, usually the plan or heading it belongs to. For items
   * listed under a roadmap or "on our radar" heading, that heading. */
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

export interface LicenseState {
  files: Array<{ file: string; license: string }>;
  packages: Array<{ file: string; name: string | null; license: string | null; private: boolean }>;
}

export interface ClaimRef {
  file: string;
  line: number;
  text: string;
}

/** Two claims that may disagree: one plan at two prices, a feature marketed as upcoming that a docs page covers, or one
 * subject (credentials, rows, local, install) stated both ways. modeHint names a mode (self-host, CI, cloud, annual
 * billing) either side mentions: the claim may be true in that mode only. */
export interface ClaimConflict {
  topic: "price" | "availability" | "data";
  subject: string;
  a: ClaimRef;
  b: ClaimRef;
  modeHint: string | null;
}

export type Entity = "user" | "team" | "project";

/** Plans, limits and upgrade copy in the app's code, to check the pricing page's promises against. */
export interface BillingScan {
  /** Code lines about subscriptions, plans, seats, quotas, limits or entitlements, with the entity they name. */
  hits: Array<ClaimRef & { entity: Entity | null }>;
  /** How many of those lines name each entity: a "team plan" on the site needs a plan stored on a team. */
  planAttachesTo: Record<Entity, number>;
  /** Plan checks and limit constants, with the places outside tests that use them. 0 means not enforced in the product. */
  gates: Array<{ name: string; definedAt: string; callsOutsideTests: number; callers: string[] }>;
  /** Upgrade and limit messages shown in the app. */
  upgradeCopy: Claim[];
}

export interface SourceScan {
  dir: string;
  filesScanned: number;
  truncated: boolean;
  claims: Record<ClaimKind, Claim[]>;
  claimCounts: Record<ClaimKind, number>;
  envFlags: EnvFlag[];
  /** Claims in dir (and in compareWith) that may disagree, in pairs with both file:line refs. Paths are relative to dir. */
  conflicts: ClaimConflict[];
  /** The compareWith folders, as read. */
  compared: Array<{ dir: string; filesScanned: number; claimCounts: Record<ClaimKind, number> }>;
  /** LICENSE files and each package.json's license and private fields, to check open-source claims against. */
  licenseState: LicenseState;
  /** Decision records (ADRs) with their recorded status, so features aren't described as shipped when the record says otherwise. */
  decisions: Decision[];
  /** null when no billing code was found. */
  billing: BillingScan | null;
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

// A currency amount needs 2 or more digits, cents, or a period after it ("$9/mo"): "$1" is a SQL parameter or a
// shell variable. Never after "=", and not as "($1)" or "ANY($1, ...)".
const AMOUNT = /(?<!=[ \t]*)(?:(?<!\()|(?![$€£]\d+[),]))[$€£](?:\d[\d,]*\d(?:\.\d{2})?|\d\.\d{2}|\d(?=[ \t]?(?:\/|per\b|a month)))(?!\d|\.\d)/;

// Tried on every line, read in full, so no part may rescan the rest of the line from many starting points ("curl curl
// curl ...", "1,1,1,..."): the pipe of "curl ... | sh" is found first, and a count starts only at the start of a number.
const PATTERNS: Record<ClaimKind, RegExp> = {
  data: /\b(stores?|stored|storing|collects?|collected|sends?|sent|uploads?|uploaded|read-only|never (see|read|store|touch|leaves?|sends?)|leaves? (your|the)|locally|on your (own )?(machine|computer|laptop|infrastructure|servers?|network)|credentials?|connection strings?|passwords?|encrypt\w*|retain\w*|retention|sample (rows|values)|parameter values|literal values|PII|personal data|GDPR|SOC ?2|HIPAA|rows? of (your )?data|query text|we (never|don't|do not) (see|read|store|access)|your data)\b/i,
  price: new RegExp(`(${AMOUNT.source})|(\\b\\d+(\\.\\d+)?\\s?(\\/|per\\s)(mo|month|year|yr|seat|user|host|server|project)\\b)|\\b(free forever|free plan|free tier|lifetime|money-back|refund|trial)\\b`, "i"),
  availability: /\b(coming soon|soon|on (our|the) radar|roadmap|shipping next|planned|in beta|beta|alpha|preview|early access|waitlist|not yet|launching|available now|now available|shipped|deprecated|retired|sunset)\b/i,
  setup: /(\bdocker (run|compose)\b|\bnpm (i|install)\b|\bnpx\b|\bpnpm (add|dlx)\b|\bpip install\b|\bbrew install\b|\|(?<=curl [^|]*\|)\s*(sh|bash)|\b\d+\s?(seconds?|secs?|minutes?|mins?)\b|\bone (click|command|line)\b|\bno (install|installation|signup|sign-up|credit card|code changes|agents? to install)\b)/i,
  proof: /(\b\d+(\.\d+)?\s?(%|x|×)(?![\w-])|\b(fastest|the only|first ever|#1|trusted by|used by|loved by|(?<![\d,])\d[\d,]*\+? (teams|companies|developers|users|customers)))/i,
  // Case matters for the license names: "mit" and "osi" are parts of other words.
  oss: /\b([Oo]pen[- ][Ss]ource[d]?|MIT|Apache[- ]2(\.0)?|A?GPL(v\d)?|BU?SL|OSI|[Ll]icen[cs](e[ds]?|ing)|[Ss]ource[- ]available|[Ff]air[- ]source|read the code)\b/,
  access: /\b(anonymous(ly)?|no (sign-?in|sign-?up|login|account) (needed|required)|without (signing|logging) in|unauthenticated|open instance|public (link|page|instance|url|dashboard|demo)s?|publicly|shareable links?|invite-only|OAuth|super ?user|least privilege|privileges?|admin rights|RBAC|roles? and permissions)\b/i,
};

// Under a heading like these, each list item is something not shipped yet.
const UPCOMING_HEADING = /radar|roadmap|coming|planned|soon|next/i;
const LICENSE_FILE = /^(LICEN[CS]E|COPYING|UNLICENSE)([-.][\w.-]+)?$/i;
const META_NAMES = new Set(["package.json", "LICENSE", "LICENSE.txt", "LICENSE.md", "LICENCE", "LICENCE.txt", "LICENCE.md", "COPYING", "COPYING.txt", "LICENSE-MIT", "LICENSE-APACHE", "UNLICENSE"]);
// "UNLICENSED" in package.json means not licensed for use; "Unlicense" is public domain.
const OSI = /(^|[(\s])(MIT|Apache|0?BSD|ISC|MPL|A?GPL|LGPL|EPL|CC0|Unlicense(?!d))/i;

function licenseOf(text: string): string {
  const t = text.slice(0, 4000);
  if (/MIT License|Permission is hereby granted, free of charge/i.test(t)) return "MIT";
  if (/Apache License/i.test(t)) return "Apache-2.0";
  if (/GNU AFFERO/i.test(t)) return "AGPL-3.0";
  if (/GNU LESSER/i.test(t)) return "LGPL";
  if (/GNU GENERAL PUBLIC/i.test(t)) return "GPL";
  if (/Business Source License/i.test(t)) return "BUSL-1.1";
  if (/Elastic License/i.test(t)) return "Elastic";
  if (/Mozilla Public License/i.test(t)) return "MPL-2.0";
  if (/Functional Source License/i.test(t)) return "FSL";
  if (/Redistribution and use in source and binary forms/i.test(t)) return "BSD";
  if (/ISC License/i.test(t)) return "ISC";
  if (/unlicense\.org|This is free and unencumbered software/i.test(t)) return "Unlicense";
  return /all rights reserved|proprietary/i.test(t) ? "proprietary" : "not recognized";
}

function readLicenseState(root: string, meta: string[]): LicenseState {
  const state: LicenseState = { files: [], packages: [] };
  for (const f of meta) {
    let src = "";
    try {
      src = readFileSync(f, "utf8");
    } catch {
      continue;
    }
    const file = relative(root, f);
    if (LICENSE_FILE.test(file.split(sep).pop() ?? "")) {
      if (state.files.length < 20) state.files.push({ file, license: licenseOf(src) });
      continue;
    }
    let pkg: { name?: unknown; license?: unknown; private?: unknown };
    try {
      pkg = JSON.parse(src);
    } catch {
      continue;
    }
    const license = typeof pkg.license === "string" ? pkg.license : null;
    if (state.packages.length < 20) state.packages.push({ file, name: typeof pkg.name === "string" ? pkg.name : null, license, private: pkg.private === true });
  }
  return state;
}

// Notes for open-source claims that the license files and package.json fields don't back.
function licenseNotes(oss: Claim[], ls: LicenseState): string[] {
  const named = [...ls.files.map((f) => `${f.file}: ${f.license}`), ...ls.packages.map((p) => `${p.file}: ${p.license ?? "no license field"}${p.private ? ", private" : ""}`)];
  const open = oss.filter((c) => /open[- ]source/i.test(c.text) && !/not open[- ]source/i.test(c.text));
  const osi = [...ls.files.map((f) => f.license), ...ls.packages.map((p) => p.license ?? "")].some((l) => OSI.test(l));
  if (!open.length || osi) return [];
  return [`The copy says open source (${open.slice(0, 3).map((c) => `${c.file}:${c.line}`).join(", ")}), but no open-source license was found: ${named.slice(0, 6).join("; ") || "no LICENSE file and no package.json license"}. Source-available licenses (BUSL, Elastic, FSL) are not open source.`];
}

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

// Claims kept per kind for pairing; only maxPerKind of them are returned.
const KEEP = 1000;

const PLAN = /\b(free|hobby|starter|basic|personal|indie|developer|pro|plus|premium|teams?|business|growth|scale|startup|enterprise)\b/i;
const UPCOMING = /\b(soon|radar|coming|not yet|planned|roadmap|shipping next|waitlist|early access)\b/i;
// Words a claim can name a mode with: the claim may be true in that mode only.
const MODE = /\b(self[- ]host(ed|ing)?|on[- ]prem\w*|CI|monitor mode|cloud|hosted|SaaS|annual(ly)?|yearly|monthly|billed \w+|per (seat|user)|trial|beta)\b/i;
const NEGATIVE = /\b(never|not|no|without|nothing|none|zero)\b|n't\b/i;
// Subjects of data and setup claims that sites and docs most often state both ways.
const SUBJECTS: Array<[string, RegExp]> = [
  ["credentials", /credential|password|connection strings?|secret|api key/i],
  ["rows", /\brows?\b|sample (rows|values)|query text|parameter values|literal values/i],
  ["local", /\blocally\b|on your (own )?(machine|computer|laptop|infrastructure|servers?|network)|\bleaves?\b/i],
  ["install", /\binstall|\bdocker\b|\bagents?\b|\bnpx\b/i],
  ["open source", /open[- ]source|source[- ]available/i],
];
const STOP = new Set("the and for with your our you how use using all any can get new now set via from into this that are was will docs guide overview introduction about coming soon radar roadmap planned next shipping yet not beta preview".split(" "));

function tokens(s: string): string[] {
  return (s.match(/[A-Za-z0-9]+/g) ?? []).filter((w) => (w.length >= 3 || /^[A-Z0-9]{2}$/.test(w)) && !STOP.has(w.toLowerCase())).map((w) => w.toLowerCase());
}

function amountOf(text: string): string | null {
  const m = AMOUNT.exec(text.replace(/`[^`]*`/g, " "));
  return m ? m[0][0] + String(parseFloat(m[0].slice(1).replace(/,/g, ""))) : null;
}

function modeHint(a: Claim, b: Claim): string | null {
  const parts = [a, b].flatMap((c) => {
    const m = MODE.exec(`${c.text} ${c.context ?? ""}`);
    return m ? [`${c.file}:${c.line}: ${m[0]}`] : [];
  });
  return parts.length ? parts.join("; ") : null;
}

function ref(c: Claim): ClaimRef {
  return { file: c.file, line: c.line, text: c.text.slice(0, 200) };
}

/** Pairs of claims that may disagree. Found by keyword, so each pair is something to check, not a finding. */
function pairClaims(claims: Record<ClaimKind, Claim[]>, titles: Claim[]): ClaimConflict[] {
  const out: ClaimConflict[] = [];
  const add = (topic: ClaimConflict["topic"], subject: string, a: Claim, b: Claim) => out.push({ topic, subject, a: ref(a), b: ref(b), modeHint: modeHint(a, b) });
  // (a) One plan at two prices.
  const plans = new Map<string, Map<string, Claim>>();
  for (const c of claims.price) {
    const amount = amountOf(c.text);
    const plan = (PLAN.exec(c.text) ?? PLAN.exec(c.context?.split(" / ").pop() ?? "") ?? PLAN.exec(c.context ?? ""))?.[1].toLowerCase().replace(/^teams$/, "team");
    if (!amount || !plan) continue;
    const byAmount = plans.get(plan) ?? new Map<string, Claim>();
    if (!byAmount.has(amount)) byAmount.set(amount, c);
    plans.set(plan, byAmount);
  }
  for (const [plan, byAmount] of plans) {
    const [first, ...rest] = [...byAmount.values()];
    for (const c of rest.slice(0, 3)) add("price", plan, first, c);
  }
  // (b) Marketed as upcoming, but a docs page or section has its name.
  let found = 0;
  // A title of two or more words, or one name like "SSO": one ordinary word ("Pricing") matches too much.
  const named = titles.map((h) => ({ h, tw: tokens(h.text) })).filter(({ h, tw }) => !UPCOMING.test(h.text) && (tw.length >= 2 || (tw.length === 1 && /\b[A-Z]{2,}\b/.test(h.text))));
  for (const c of claims.availability) {
    if (found >= 15) break;
    if (!UPCOMING.test(c.text) && !(c.context && UPCOMING.test(c.context))) continue;
    const words = new Set(tokens(c.text));
    const t = named.find(({ h, tw }) => h.file !== c.file && tw.every((w) => words.has(w)))?.h;
    if (t) {
      add("availability", t.text.slice(0, 80), c, t);
      found++;
    }
  }
  // (c) The same subject stated both ways ("rows never leave" vs "sends 10 sample rows").
  const pool = [...claims.data, ...claims.setup, ...claims.oss];
  for (const [subject, re] of SUBJECTS) {
    const about = pool.filter((c) => re.test(c.text));
    const neg = about.filter((c) => NEGATIVE.test(c.text));
    const pos = about.filter((c) => !NEGATIVE.test(c.text));
    let n = 0;
    for (const a of neg) {
      const b = pos.find((p) => p.file !== a.file);
      if (b && n++ < 2) add("data", subject, a, b);
    }
  }
  return out.slice(0, 40);
}

const APP_CODE = /\.(ts|tsx|js|jsx|mjs|vue|svelte|astro)$/;
const TEST_PATH = /(^|\/)(test|tests|__tests__|spec|e2e|fixtures?)\//;
const BILLING = /\b(stripe|subscriptions?|premium|entitle(ment|d)?s?|quotas?|seats?|(is|has)(Premium|Pro|Paid|Plan)\w*|\w*(Plan|Seat|Usage|Project|Member|Free|Pro)Limits?\w*|\w*_LIMIT\w*)\b|\bplan(Id|Tier|_id|_tier)?\s*(===?|!==?|:)/i;
const ENTITY = /(user|account|member)|(team|org|workspace|company)|(project|repo|site)/i;
// Plan checks (isPremium, hasProPlan, checkSeatLimit) and constants (FREE_PROJECT_LIMIT, MAX_PRO_SEATS).
const GATE = /\b(?:is|has|can|check|require|assert|enforce|ensure|within|exceeds?)(?=[A-Z])\w*?(?:Premium|Pro|Plan|Paid|Seat|Quota|Limit|Entitle|Subscri|Tier|Trial)\w*|\b[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+\b/g;
const GATE_CONST = /(LIMIT|QUOTA|SEATS?|MAX)/;
const GATE_PLAN = /(FREE|PRO|PLAN|PREMIUM|TRIAL|PAID|TEAM|SEAT|QUOTA|TIER)/;
const UPGRADE = /\b(upgrade|unlock|go pro|pro gives|premium (feature|plan)|requires? (a |the )?(pro|paid|premium|team|business) plan|(plan|usage|seat|project) limit|limit reached|out of (credits|quota)|available on (the )?(pro|paid|premium|team|business))\b/i;

function entityOf(s: string): Entity | null {
  const m = ENTITY.exec(s);
  return m ? (m[1] ? "user" : m[2] ? "team" : "project") : null;
}

function billingOf(hits: BillingScan["hits"], uses: Map<string, Array<{ at: string; def: boolean; test: boolean }>>, upgradeCopy: Claim[]): BillingScan | null {
  const gates: BillingScan["gates"] = [];
  for (const [name, list] of uses) {
    const def = list.find((u) => u.def);
    if (!def) continue;
    const callers = list.filter((u) => !u.def && !u.test).map((u) => u.at);
    gates.push({ name, definedAt: def.at, callsOutsideTests: callers.length, callers: callers.slice(0, 3) });
  }
  gates.sort((a, b) => a.callsOutsideTests - b.callsOutsideTests || a.name.localeCompare(b.name));
  if (!hits.length && !gates.length && !upgradeCopy.length) return null;
  const planAttachesTo: Record<Entity, number> = { user: 0, team: 0, project: 0 };
  for (const h of hits) if (h.entity) planAttachesTo[h.entity]++;
  return { hits: hits.slice(0, 40), planAttachesTo, gates: gates.slice(0, 20), upgradeCopy: upgradeCopy.slice(0, 20) };
}

function realDir(dir: string): string {
  const root = realpathSync(dir);
  if (!statSync(root).isDirectory()) throw new RangeError(`${dir} is not a directory`);
  if (root === "/") throw new RangeError("refusing to scan the filesystem root; pass the repo or app directory");
  return root;
}

function collect(root: string) {
  const all: string[] = [];
  const state: { truncated: boolean; links?: number } = { truncated: false };
  walk(root, all, state, EXTS, META_NAMES);
  // package.json and LICENSE files give the license state; they are not copy.
  const isMeta = (f: string) => /(^|\/)package\.json$/.test(f) || LICENSE_FILE.test(f.split(sep).pop() ?? "");
  const files = all.filter((f) => !isMeta(f));
  const licenseState = readLicenseState(root, all.filter(isMeta));
  const claims = Object.fromEntries(KINDS.map((k) => [k, []])) as unknown as Record<ClaimKind, Claim[]>;
  const counts = Object.fromEntries(KINDS.map((k) => [k, 0])) as unknown as Record<ClaimKind, number>;
  const env = new Map<string, EnvFlag["uses"]>();
  // Docs page titles and top headings, to pair with features the site calls upcoming.
  const titles: Claim[] = [];
  const hits: BillingScan["hits"] = [];
  const gateUses = new Map<string, Array<{ at: string; def: boolean; test: boolean }>>();
  const upgradeCopy: Claim[] = [];
  for (const f of files) {
    let src: string;
    try {
      src = readFileSync(f, "utf8");
    } catch {
      continue;
    }
    const rel = relative(root, f);
    const isCode = /\.(ts|js|mjs)$/.test(f);
    const isDoc = /\.mdx?$/.test(f);
    const isApp = APP_CODE.test(f);
    const inTest = TEST_PATH.test(rel);
    let inStyle = false;
    const recent: string[] = [];
    let upcoming: string | null = null;
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
      if (isApp && !/^\s*(import|export \{[^}]*\} from)\b/.test(raw)) {
        if (!inTest && hits.length < KEEP && BILLING.test(raw)) hits.push({ file: rel, line: i + 1, text: raw.trim().slice(0, 200), entity: entityOf(raw) ?? entityOf(rel) });
        let seen = 0;
        for (const m of raw.matchAll(GATE)) {
          const name = m[0];
          if (/^[A-Z]/.test(name) && !(GATE_CONST.test(name) && GATE_PLAN.test(name))) continue;
          // At most 20 names a line, and only the 40 characters before each: a line of 80,000 names was read 80,000 times.
          if (++seen > 20) break;
          const before = raw.slice(Math.max(0, m.index - 40), m.index);
          const after = raw.length < 400 ? raw.slice(m.index + name.length) : "";
          const def = /(function\*?|const|let|var|class)\s+$/.test(before) || (m.index < 40 && /^\s*((public|private|protected|static|async|export|readonly)\s+)*$/.test(before) && /^\s*\(.*\)\s*(:[^=;]*)?\{\s*$/.test(after));
          const list = gateUses.get(name) ?? [];
          if (list.length < 50 || def) list.push({ at: `${rel}:${i + 1}`, def, test: inTest });
          if (gateUses.size < 500 || gateUses.has(name)) gateUses.set(name, list);
        }
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
      // List items under "On our radar", "Roadmap" or "Coming soon" are not shipped, whatever their words.
      const heading = !isCode && (/^\s*#{1,6}\s/.test(raw) || /<h[1-6][\s>]/i.test(raw));
      if (heading) upcoming = UPCOMING_HEADING.test(text) ? text.replace(/^#+\s*/, "").slice(0, 120) : null;
      if (isDoc && titles.length < KEEP && (/^#{1,2}\s/.test(raw) || (i < 30 && /^title:/.test(raw)))) {
        const t = (/^title:[ \t]*(.+)$/.exec(raw)?.[1] ?? text.replace(/^#+\s*/, "")).replace(/^["']|["']$/g, "").trim();
        if (t) titles.push({ file: rel, line: i + 1, text: t.slice(0, 120) });
      }
      if (isApp && !inTest && words >= 2 && upgradeCopy.length < KEEP && UPGRADE.test(text)) upgradeCopy.push({ file: rel, line: i + 1, text: text.slice(0, 200) });
      const listed = !heading && upcoming !== null && words > 0 && (/^\s*([-*+]|\d+\.)\s+\S/.test(raw) || /<li[\s>]/i.test(raw));
      // Access rules are often only in code comments ("connects as a superuser").
      const comment = isCode ? (/^\s*(?:\/\/|\/?\*+)\s?(.*)$/.exec(raw)?.[1] ?? /\s\/\/\s?(.*)$/.exec(raw)?.[1] ?? "") : "";
      for (const kind of KINDS) {
        let t = text;
        let w = words;
        if (kind === "access" && !PATTERNS.access.test(text) && comment) {
          t = comment.trim();
          w = (t.match(/[A-Za-z]{2,}/g) ?? []).length;
        }
        // Inline code (`$5`, `= $1`) is not a price.
        const hit = kind === "price" ? PATTERNS.price.test(t.replace(/`[^`]*`/g, " ")) : PATTERNS[kind].test(t);
        const item = kind === "availability" && listed;
        if (!hit && !item) continue;
        // A bare price on its own line counts; anything else needs a few words to be a claim.
        if (w < 3 && kind !== "price" && !item) continue;
        counts[kind]++;
        const context = item ? upcoming : w < 3 && ctx ? ctx : null;
        if (claims[kind].length < KEEP) claims[kind].push({ file: rel, line: i + 1, text: t.slice(0, 300), ...(context ? { context } : {}) });
      }
    });
  }
  return { files, state, claims, counts, env, licenseState, titles, billing: billingOf(hits, gateUses, upgradeCopy) };
}

export function scanSource(dir: string, maxPerKind = 60, compareWith: string[] = []): SourceScan {
  const root = realDir(dir);
  const { files, state, claims, counts, env, licenseState, titles, billing } = collect(root);
  // Claims from the other folders, with paths relative to dir, so each pair reads the same way.
  const compared: SourceScan["compared"] = [];
  const pool = Object.fromEntries(KINDS.map((k) => [k, [...claims[k]]])) as unknown as Record<ClaimKind, Claim[]>;
  const allTitles = [...titles];
  for (const d of compareWith) {
    const other = realDir(d);
    if (other === root) continue;
    const c = collect(other);
    const rebase = (x: Claim) => ({ ...x, file: relative(root, join(other, x.file)) });
    for (const k of KINDS) pool[k].push(...c.claims[k].map(rebase));
    allTitles.push(...c.titles.map(rebase));
    compared.push({ dir: other, filesScanned: c.files.length, claimCounts: c.counts });
  }
  const conflicts = pairClaims(pool, allTitles);
  const envFlags = [...env.entries()]
    .map(([name, uses]) => ({ name, uses }))
    .sort((a, b) => Number(b.uses.some((u) => u.affectsOutput)) - Number(a.uses.some((u) => u.affectsOutput)) || a.name.localeCompare(b.name));
  const notes = [
    "Lines are matched by keyword; some are not claims. conflicts pairs claims that may disagree (one plan at two prices, a feature called upcoming that a docs page covers, one subject stated both ways); open both lines before you call it a contradiction. A claim that is true in one mode (self-host, CI, cloud, annual billing) and not another is unclear, not false: say which mode. conflicts finds only matching plans, subjects and page titles, so still check the other claims against the docs.",
    "Tooltips, FAQ answers and attribute text are included because visitors read them. Docs folders are scanned too if they are under this directory; docs that disagree with each other are a finding.",
    "Env flags marked affectsOutput appear in routing, head or conditional rendering. Say which value the build you reviewed used.",
  ];
  if (state.truncated) notes.push(`Stopped after ${MAX_FILES} files; pass a narrower directory.`);
  if (state.links) notes.push(`Did not follow ${state.links} symbolic link${state.links === 1 ? "" : "s"}: they point to a folder or to a file outside this directory.`);
  notes.push(...licenseNotes(claims.oss, licenseState));
  for (const k of KINDS) if (counts[k] > maxPerKind) notes.push(`${k}: ${counts[k]} matches, first ${maxPerKind} shown; pass a narrower directory to see the rest.`);
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
  if (billing) notes.push("billing: planAttachesTo counts the code lines about plans that name a user, team or project; a team plan on the site needs a plan stored on a team. A gate with callsOutsideTests 0 is defined but not used in the product. Compare upgradeCopy with the pricing page.");
  if (decisionIssues.some((x) => x.conflict)) notes.push("decisionIssues: records or index rows disagree about the same issue (one says open, another built). Check the issue and the code.");
  if (decisions.length) {
    notes.push("Decision statuses such as \"not fully built\", \"superseded\", \"open\" or \"proposed\" mean the feature is partial, replaced or undecided. Use them when you say whether something is shipped. When the record and the index differ, report both; settle it from the feature's docs and code; the newest dated line usually wins.");
  }
  return { dir: root, filesScanned: files.length, truncated: state.truncated || KINDS.some((k) => counts[k] > maxPerKind), claims: Object.fromEntries(KINDS.map((k) => [k, claims[k].slice(0, maxPerKind)])) as unknown as Record<ClaimKind, Claim[]>, claimCounts: counts, envFlags, conflicts, compared, licenseState, billing, decisions, ...(decisionsFrom ? { decisionsFrom } : {}), decisionIssues, notes };
}
