// Which build is this server, and is it the latest on GitHub main? An MCP server starts with the agent session
// and keeps running the code it started with, so after main changes an old session talks to old code with
// nothing to say so. scripts/build-info.mjs records the commit at build time; this module compares it with main.
// The lookup goes to one fixed GitHub URL built from our own commit, never from tool input.

import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO = "veksen-enterprises/marketing-expert";
const HERE = dirname(fileURLToPath(import.meta.url));
// dist/lib/version.js -> dist/build-info.json; in the plugin's bundle, bundle/build-info.json next to the code. Run from
// src (tests), neither exists and the commit is unknown.
const BUILD_INFO = [join(HERE, "build-info.json"), join(HERE, "..", "build-info.json")].find((p) => existsSync(p)) ?? join(HERE, "..", "build-info.json");

/**
 * `bundle`: the plugin's bundle has no commit of its own (it is committed with the source it was built from, so the
 * commit doesn't exist when it is built). It records a hash of its files instead, compared with the bundle on main.
 */
export type BuildInfo = { commit: string | null; dirty: boolean | null; builtAt: string | null; bundle?: string };

export function readBuildInfo(path = BUILD_INFO): BuildInfo {
  try {
    const j = JSON.parse(readFileSync(path, "utf8"));
    if (typeof j.bundle === "string" && /^[0-9a-f]{64}$/.test(j.bundle)) return { commit: null, dirty: null, builtAt: null, bundle: j.bundle };
    const commit = typeof j.commit === "string" && /^[0-9a-f]{40}$/.test(j.commit) ? j.commit : null;
    return { commit, dirty: typeof j.dirty === "boolean" ? j.dirty : null, builtAt: typeof j.builtAt === "string" ? j.builtAt : null };
  } catch {
    return { commit: null, dirty: null, builtAt: null };
  }
}

/** npx keeps installs under ~/.npm/_npx/; the Claude Code plugin runs bundle/; anything else is a local checkout that
 * needs a pull and a build. */
export type InstallKind = "npx" | "bundle" | "local" | "hosted";

export function installKind(dir = HERE): "npx" | "bundle" | "local" {
  if (/[\\/]_npx[\\/]/.test(dir)) return "npx";
  return basename(dir) === "bundle" ? "bundle" : "local";
}

export type MainCheck =
  | { state: "latest"; main: string; checkedAt: string }
  | { state: "behind" | "ahead" | "diverged"; main: string; behindBy: number; aheadBy: number; checkedAt: string }
  | { state: "not-on-github"; main: string; checkedAt: string }
  /** The bundle differs from the bundle on main (bundle installs only: no commit count). */
  | { state: "changed"; main: string; checkedAt: string }
  | { state: "not-checked"; reason: string; checkedAt: string };

type Fetch = (url: string, init: { headers: Record<string, string>; signal: AbortSignal }) => Promise<{ ok: boolean; status: number; text(): Promise<string> }>;

/**
 * A GET with node:https, not the global fetch. This check runs in every session at start, and the first fetch() loads
 * undici: a server's memory went from 48 to 78 MB for it (macOS footprint, 2026-11-17), against about 8 MB for node:https.
 * No redirects are followed (a 3xx is not ok). A body over MAX_BODY is dropped and the answer is not ok.
 */
const MAX_BODY = 10 * 1024 * 1024;
export const httpGet: Fetch = async (url, { headers, signal }) => {
  const { request } = url.startsWith("https:") ? await import("node:https") : await import("node:http");
  return new Promise((resolve, reject) => {
    const req = request(url, { headers, signal }, (res) => {
      const chunks: Buffer[] = [];
      let size = 0;
      res.on("data", (c: Buffer) => {
        size += c.length;
        if (size <= MAX_BODY) chunks.push(c);
        else res.destroy();
      });
      res.on("close", () => {
        const status = res.statusCode ?? 0;
        const body = Buffer.concat(chunks).toString("utf8");
        resolve({ ok: size <= MAX_BODY && status >= 200 && status < 300, status, text: async () => body });
      });
      res.on("error", reject);
    });
    req.on("error", reject);
    req.end();
  });
};

export async function compareWithMain(commit: string | null, fetchImpl: Fetch = httpGet, timeoutMs = 3000): Promise<MainCheck> {
  const checkedAt = new Date().toISOString();
  if (!commit) return { state: "not-checked", reason: "this build has no recorded commit (built without git)", checkedAt };
  const get = async (path: string, accept: string) => {
    const r = await fetchImpl(`https://api.github.com/repos/${REPO}/${path}`, {
      headers: { Accept: accept, "User-Agent": "marketing-expert-mcp" },
      signal: AbortSignal.timeout(timeoutMs),
    });
    return { status: r.status, ok: r.ok, body: await r.text() };
  };
  try {
    const head = await get("commits/main", "application/vnd.github.sha");
    const main = head.body.trim();
    if (!head.ok || !/^[0-9a-f]{40}$/.test(main)) return { state: "not-checked", reason: `GitHub answered ${head.status} for main`, checkedAt };
    if (main === commit) return { state: "latest", main, checkedAt };
    const cmp = await get(`compare/${commit}...${main}`, "application/vnd.github+json");
    if (cmp.status === 404 || cmp.status === 422) return { state: "not-on-github", main, checkedAt };
    if (!cmp.ok) return { state: "not-checked", reason: `GitHub answered ${cmp.status} for the comparison`, checkedAt };
    // compare/base...head: "ahead" means main (head) has commits this build (base) lacks.
    const j = JSON.parse(cmp.body) as { status?: string; ahead_by?: number; behind_by?: number };
    const state = j.status === "ahead" ? "behind" : j.status === "behind" ? "ahead" : j.status === "diverged" ? "diverged" : null;
    if (!state) return { state: "not-checked", reason: `unexpected comparison status "${j.status}"`, checkedAt };
    return { state, main, behindBy: j.ahead_by ?? 0, aheadBy: j.behind_by ?? 0, checkedAt };
  } catch (e) {
    return { state: "not-checked", reason: `GitHub lookup failed (${e instanceof Error ? e.message : String(e)})`, checkedAt };
  }
}

/** The plugin's bundle against main's: same files, same hash. Fetches one fixed file from GitHub, never tool input. */
export async function compareBundleWithMain(hash: string, fetchImpl: Fetch = httpGet, timeoutMs = 3000): Promise<MainCheck> {
  const checkedAt = new Date().toISOString();
  try {
    const r = await fetchImpl(`https://raw.githubusercontent.com/${REPO}/main/bundle/build-info.json`, {
      headers: { "User-Agent": "marketing-expert-mcp" },
      signal: AbortSignal.timeout(timeoutMs),
    });
    const body = await r.text();
    const main = r.ok ? (JSON.parse(body) as { bundle?: unknown }).bundle : undefined;
    if (typeof main !== "string" || !/^[0-9a-f]{64}$/.test(main)) return { state: "not-checked", reason: `GitHub answered ${r.status} for main's bundle`, checkedAt };
    return main === hash ? { state: "latest", main, checkedAt } : { state: "changed", main, checkedAt };
  } catch (e) {
    return { state: "not-checked", reason: `GitHub lookup failed (${e instanceof Error ? e.message : String(e)})`, checkedAt };
  }
}

const short = (sha: string) => sha.slice(0, 7);

/** What to do to load main, for this kind of install. */
export function updateSteps(kind: InstallKind): string {
  if (kind === "bundle") return "Update the plugin (claude plugin update marketing-expert@marketing-expert, or /plugin in a session), then start a new session.";
  if (kind === "hosted") return "This is the hosted endpoint: whoever runs it redeploys it (Dokploy: Deploy on the marketing-expert app) to load main. Nothing to do in the client.";
  return kind === "npx"
    ? "To load it without a new session in Claude Code: run /mcp, pick marketing-expert, choose Reconnect (npx fetches main again on start). Other clients: restart the server or the client."
    : "This is a local copy: git pull and npm run build in it, then reconnect the server (Claude Code: /mcp, pick marketing-expert, Reconnect).";
}

export function describeCheck(build: BuildInfo, check: MainCheck | null, kind: InstallKind): string {
  const running = build.bundle
    ? `the plugin bundle ${short(build.bundle)}`
    : build.commit
      ? `commit ${short(build.commit)}${build.dirty ? " with uncommitted changes" : ""}, built ${build.builtAt}`
      : "an unknown commit";
  if (!check) return `Running ${running}. The comparison with GitHub main has not finished yet.`;
  switch (check.state) {
    case "latest":
      return `Up to date: running ${running}, which is main on GitHub (checked ${check.checkedAt}).${build.dirty ? " The uncommitted changes are not on main." : ""}`;
    case "behind":
      return `Out of date: running ${running}; main is ${short(check.main)}, ${check.behindBy} commit${check.behindBy === 1 ? "" : "s"} newer (checked ${check.checkedAt}). ${updateSteps(kind)}`;
    case "ahead":
      return `Running ${running}, ${check.aheadBy} commit${check.aheadBy === 1 ? "" : "s"} ahead of main ${short(check.main)}: a branch not merged yet, not an old version.`;
    case "diverged":
      return `Running ${running}, a branch that split from main: ${check.behindBy} commit${check.behindBy === 1 ? "" : "s"} on main are missing here and ${check.aheadBy} here are not on main. ${updateSteps(kind)}`;
    case "changed":
      return `Out of date: running ${running}; the bundle on main is ${short(check.main)} (checked ${check.checkedAt}). ${updateSteps(kind)}`;
    case "not-on-github":
      return `Running ${running}, a commit GitHub doesn't have (a local commit not pushed). Main is ${short(check.main)}; whether this build includes it was not checked.`;
    case "not-checked":
      return `Running ${running}. Couldn't check against GitHub main: ${check.reason}. To compare by hand: git ls-remote https://github.com/${REPO} main`;
  }
}

export const TTL_MS = 60 * 60 * 1000;

/**
 * Caches the comparison. Never awaited by tool calls: they read whatever result is in and start a refresh when it's old.
 * The hosted endpoint builds a server per request with no session to tell callers apart, so src/http.ts shares one
 * instance per process and it, not the server, remembers when the out-of-date notice was last given.
 */
export class UpdateCheck {
  private result: MainCheck | null = null;
  private inflight: Promise<MainCheck> | null = null;
  private warnedAt: number | null = null;
  constructor(readonly build: BuildInfo, private readonly fetchImpl?: Fetch, readonly enabled = process.env.MARKETING_EXPERT_UPDATE_CHECK !== "0") {}

  /** Starts a lookup if none is running and the last one is missing or older than an hour. */
  refresh(force = false): Promise<MainCheck> {
    if (!this.enabled) {
      this.result = { state: "not-checked", reason: "update check turned off (MARKETING_EXPERT_UPDATE_CHECK=0)", checkedAt: new Date().toISOString() };
      return Promise.resolve(this.result);
    }
    if (this.inflight) return this.inflight;
    if (!force && this.result && Date.now() - Date.parse(this.result.checkedAt) < TTL_MS) return Promise.resolve(this.result);
    const compare = this.build.bundle ? compareBundleWithMain(this.build.bundle, this.fetchImpl) : compareWithMain(this.build.commit, this.fetchImpl);
    this.inflight = compare.then((r) => {
      this.result = r;
      this.inflight = null;
      return r;
    });
    return this.inflight;
  }

  latest(): MainCheck | null {
    if (!this.result || Date.now() - Date.parse(this.result.checkedAt) >= TTL_MS) void this.refresh();
    return this.result;
  }

  /**
   * The check result when main is newer and no notice was given in the last `every` ms; null otherwise.
   * Stdio has one client, so it warns once. Hosted warns once an hour, so other clients of a stale host hear it too.
   */
  takeNotice(every = Infinity): MainCheck | null {
    const c = this.latest();
    if (!c || (c.state !== "behind" && c.state !== "diverged" && c.state !== "changed")) return null;
    if (this.warnedAt !== null && Date.now() - this.warnedAt < every) return null;
    this.warnedAt = Date.now();
    return c;
  }
}
