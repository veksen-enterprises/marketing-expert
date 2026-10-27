// Which build is this server, and is it the latest on GitHub main? An MCP server starts with the agent session
// and keeps running the code it started with, so after main changes an old session talks to old code with
// nothing to say so. scripts/build-info.mjs records the commit at build time; this module compares it with main.
// The lookup goes to one fixed GitHub URL built from our own commit, never from tool input.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO = "veksen-enterprises/marketing-expert";
const HERE = dirname(fileURLToPath(import.meta.url));
// dist/lib/version.js -> dist/build-info.json. Run from src (tests), the file is absent and the commit is unknown.
const BUILD_INFO = join(HERE, "..", "build-info.json");

export type BuildInfo = { commit: string | null; dirty: boolean | null; builtAt: string | null };

export function readBuildInfo(path = BUILD_INFO): BuildInfo {
  try {
    const j = JSON.parse(readFileSync(path, "utf8"));
    const commit = typeof j.commit === "string" && /^[0-9a-f]{40}$/.test(j.commit) ? j.commit : null;
    return { commit, dirty: typeof j.dirty === "boolean" ? j.dirty : null, builtAt: typeof j.builtAt === "string" ? j.builtAt : null };
  } catch {
    return { commit: null, dirty: null, builtAt: null };
  }
}

/** npx keeps installs under ~/.npm/_npx/; anything else is a local checkout that needs a pull and a build. */
export function installKind(dir = HERE): "npx" | "local" {
  return /[\\/]_npx[\\/]/.test(dir) ? "npx" : "local";
}

export type MainCheck =
  | { state: "latest"; main: string; checkedAt: string }
  | { state: "behind" | "ahead" | "diverged"; main: string; behindBy: number; aheadBy: number; checkedAt: string }
  | { state: "not-on-github"; main: string; checkedAt: string }
  | { state: "not-checked"; reason: string; checkedAt: string };

type Fetch = (url: string, init: { headers: Record<string, string>; signal: AbortSignal }) => Promise<{ ok: boolean; status: number; text(): Promise<string> }>;

export async function compareWithMain(commit: string | null, fetchImpl: Fetch = fetch as unknown as Fetch, timeoutMs = 3000): Promise<MainCheck> {
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

const short = (sha: string) => sha.slice(0, 7);

/** What to do to load main, for this kind of install. */
export function updateSteps(kind: "npx" | "local"): string {
  return kind === "npx"
    ? "To load it without a new session in Claude Code: run /mcp, pick marketing-expert, choose Reconnect (npx fetches main again on start). Other clients: restart the server or the client."
    : "This is a local copy: git pull and npm run build in it, then reconnect the server (Claude Code: /mcp, pick marketing-expert, Reconnect).";
}

export function describeCheck(build: BuildInfo, check: MainCheck | null, kind: "npx" | "local"): string {
  const running = build.commit ? `commit ${short(build.commit)}${build.dirty ? " with uncommitted changes" : ""}, built ${build.builtAt}` : "an unknown commit";
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
    case "not-on-github":
      return `Running ${running}, a commit GitHub doesn't have (a local commit not pushed). Main is ${short(check.main)}; whether this build includes it was not checked.`;
    case "not-checked":
      return `Running ${running}. Couldn't check against GitHub main: ${check.reason}. To compare by hand: git ls-remote https://github.com/${REPO} main`;
  }
}

const TTL_MS = 60 * 60 * 1000;

/** Caches the comparison. Never awaited by tool calls: they read whatever result is in and start a refresh when it's old. */
export class UpdateCheck {
  private result: MainCheck | null = null;
  private inflight: Promise<MainCheck> | null = null;
  constructor(readonly build: BuildInfo, private readonly fetchImpl?: Fetch, readonly enabled = process.env.MARKETING_EXPERT_UPDATE_CHECK !== "0") {}

  /** Starts a lookup if none is running and the last one is missing or older than an hour. */
  refresh(force = false): Promise<MainCheck> {
    if (!this.enabled) {
      this.result = { state: "not-checked", reason: "update check turned off (MARKETING_EXPERT_UPDATE_CHECK=0)", checkedAt: new Date().toISOString() };
      return Promise.resolve(this.result);
    }
    if (this.inflight) return this.inflight;
    if (!force && this.result && Date.now() - Date.parse(this.result.checkedAt) < TTL_MS) return Promise.resolve(this.result);
    this.inflight = compareWithMain(this.build.commit, this.fetchImpl).then((r) => {
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
}
