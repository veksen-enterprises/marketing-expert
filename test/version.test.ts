// The server says which commit it runs and whether main on GitHub is newer, so a session started before main
// changed can find out it is running old code.
import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";
import { compareWithMain, describeCheck, installKind, UpdateCheck } from "../src/lib/version.js";

const OLD = "a".repeat(40);
const MAIN = "b".repeat(40);

// A stand-in for GitHub: main's commit, and the comparison of OLD with it.
const github = (compare: { status: number; body?: object } = { status: 200, body: { status: "ahead", ahead_by: 3, behind_by: 0 } }) => {
  const urls: string[] = [];
  const f = async (url: string) => {
    urls.push(url);
    if (url.endsWith("/commits/main")) return { ok: true, status: 200, text: async () => MAIN };
    return { ok: compare.status < 300, status: compare.status, text: async () => JSON.stringify(compare.body ?? {}) };
  };
  return { f, urls };
};

describe("compareWithMain", () => {
  it("reports a build behind main with the commit count", async () => {
    const { f, urls } = github();
    expect(await compareWithMain(OLD, f)).toMatchObject({ state: "behind", main: MAIN, behindBy: 3 });
    expect(urls[1]).toBe(`https://api.github.com/repos/veksen-enterprises/marketing-expert/compare/${OLD}...${MAIN}`);
  });
  it("needs one request when the build is main", async () => {
    const { f, urls } = github();
    expect(await compareWithMain(MAIN, f)).toMatchObject({ state: "latest" });
    expect(urls).toHaveLength(1);
  });
  it("tells an unmerged branch apart from an old version", async () => {
    const { f } = github({ status: 200, body: { status: "behind", ahead_by: 0, behind_by: 2 } });
    const c = await compareWithMain(OLD, f);
    expect(c).toMatchObject({ state: "ahead", aheadBy: 2 });
    expect(describeCheck({ commit: OLD, dirty: false, builtAt: "t" }, c, "npx")).toMatch(/not merged yet, not an old version/);
  });
  it("says a commit GitHub doesn't know is unpublished, without claiming it is current", async () => {
    const { f } = github({ status: 404 });
    const c = await compareWithMain(OLD, f);
    expect(c.state).toBe("not-on-github");
    expect(describeCheck({ commit: OLD, dirty: false, builtAt: "t" }, c, "local")).toMatch(/was not checked/);
  });
  it("says it couldn't check, and how to check by hand, when GitHub can't be reached", async () => {
    const c = await compareWithMain(OLD, async () => { throw new Error("offline"); });
    expect(c).toMatchObject({ state: "not-checked" });
    expect(describeCheck({ commit: OLD, dirty: false, builtAt: "t" }, c, "npx")).toMatch(/Couldn't check.*offline.*git ls-remote https:\/\/github.com\/veksen-enterprises\/marketing-expert main/);
  });
  it("doesn't ask GitHub when the build has no commit", async () => {
    const { f, urls } = github();
    expect((await compareWithMain(null, f)).state).toBe("not-checked");
    expect(urls).toEqual([]);
  });
  it("gives update steps that fit the install", () => {
    expect(installKind("/home/u/.npm/_npx/abc/node_modules/marketing-expert-mcp/dist/lib")).toBe("npx");
    expect(installKind("/home/u/code/marketing-expert/dist/lib")).toBe("local");
  });
});

const connect = async (updates: UpdateCheck, hosted = false) => {
  const [a, b] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "t", version: "0" });
  await Promise.all([createServer({ updates, hosted }).connect(a), client.connect(b)]);
  const texts = async (name: string, args: Record<string, unknown> = {}) =>
    ((await client.callTool({ name, arguments: args })).content as Array<{ text: string }>).map((c) => c.text);
  return { client, texts };
};

describe("server", () => {
  it("puts the commit in serverInfo and answers server_version", async () => {
    const updates = new UpdateCheck({ commit: OLD, dirty: false, builtAt: "2026-10-27T00:00:00Z" }, github().f, true);
    const { client, texts } = await connect(updates);
    expect(client.getServerVersion()?.version).toBe("0.1.0+aaaaaaa");
    const out = JSON.parse((await texts("server_version"))[0]);
    expect(out).toMatchObject({ commit: OLD, builtAt: "2026-10-27T00:00:00Z", main: { state: "behind", behindBy: 3 } });
    expect(out.summary).toMatch(/^Out of date: running commit aaaaaaa.*main is bbbbbbb, 3 commits newer/);
  });

  it("adds a one-time notice to the first tool result once it knows main is newer", async () => {
    const updates = new UpdateCheck({ commit: OLD, dirty: false, builtAt: "t" }, github().f, true);
    await updates.refresh();
    const { texts } = await connect(updates);
    const first = await texts("get_playbook");
    expect(first).toHaveLength(2);
    expect(first[1]).toMatch(/^Notice from the marketing-expert server.*Out of date.*Tell the user once\.$/);
    expect(await texts("get_playbook")).toHaveLength(1);
  });

  it("adds nothing when the build is main, or when the check is off", async () => {
    for (const updates of [
      new UpdateCheck({ commit: MAIN, dirty: false, builtAt: "t" }, github().f, true),
      new UpdateCheck({ commit: OLD, dirty: false, builtAt: "t" }, github().f, false),
    ]) {
      await updates.refresh();
      const { texts } = await connect(updates);
      expect(await texts("get_playbook")).toHaveLength(1);
    }
  });

  it("never makes a tool call wait for GitHub", async () => {
    let release = () => {};
    const slow = async (url: string) => {
      await new Promise<void>((r) => (release = r));
      return github().f(url);
    };
    const { texts } = await connect(new UpdateCheck({ commit: OLD, dirty: false, builtAt: "t" }, slow, true));
    expect(await texts("get_playbook")).toHaveLength(1);
    release();
  });
});

describe("hosted", () => {
  it("one lookup per process however many servers, one notice, and it says redeploy", async () => {
    const { f, urls } = github();
    const updates = new UpdateCheck({ commit: OLD, dirty: false, builtAt: "t" }, f, true);
    await updates.refresh();
    // src/http.ts builds a server per request around one shared check; it must not warn on each.
    const first = await (await connect(updates, true)).texts("get_playbook");
    const second = await (await connect(updates, true)).texts("get_playbook");
    expect(first[1]).toMatch(/redeploys it/);
    expect(second).toHaveLength(1);
    expect(urls).toHaveLength(2);
  });
});

describe("build-info script", () => {
  it("records the checked-out commit", () => {
    execFileSync(process.execPath, ["scripts/build-info.mjs"], { stdio: "ignore" });
    const info = JSON.parse(readFileSync("dist/build-info.json", "utf8"));
    expect(info.commit).toBe(execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim());
    expect(typeof info.dirty).toBe("boolean");
    expect(Number.isNaN(Date.parse(info.builtAt))).toBe(false);
  });

  // The Docker build: no git binary on PATH, only .git/HEAD and the refs in the context (.dockerignore).
  it("reads the commit from .git files when git can't run", () => {
    for (const loose of [true, false]) {
      const dir = mkdtempSync(join(tmpdir(), "me-buildinfo-"));
      cpSync("scripts", join(dir, "scripts"), { recursive: true });
      mkdirSync(join(dir, ".git", "refs", "heads"), { recursive: true });
      writeFileSync(join(dir, ".git", "HEAD"), "ref: refs/heads/main\n");
      if (loose) writeFileSync(join(dir, ".git", "refs", "heads", "main"), `${OLD}\n`);
      else writeFileSync(join(dir, ".git", "packed-refs"), `# pack-refs with: peeled\n${OLD} refs/heads/main\n`);
      execFileSync(process.execPath, [join(dir, "scripts", "build-info.mjs")], { cwd: dir, stdio: "ignore", env: { PATH: "/nonexistent" } });
      expect(JSON.parse(readFileSync(join(dir, "dist", "build-info.json"), "utf8"))).toMatchObject({ commit: OLD, dirty: null });
    }
  });
});
