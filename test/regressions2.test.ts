// Regression tests for the second code review (2026-10-04).
import { describe, it, expect, vi, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { crawlSite, type FetchFn } from "../src/lib/crawl.js";
import { checkAiCrawlerAccess } from "../src/lib/aiCrawlers.js";

const page = (body: string) => `<html><head><title>t</title></head><body><h1>h</h1>${body}</body></html>`;
const mk = (routes: Record<string, { status?: number; body?: string | (() => never); headers?: Record<string, string> }>): FetchFn => async (url) => {
  const u = new URL(url);
  const r = routes[u.host + u.pathname] ?? { status: 404, body: "" };
  if (typeof r.body === "function") {
    // A response whose body fails while downloading.
    const stream = new ReadableStream({ start: (c) => c.error(new Error("connection reset")) });
    return new Response(stream, { status: 200, headers: { "content-type": "text/html" } });
  }
  return new Response(r.body ?? "", { status: r.status ?? 200, headers: { "content-type": "text/html", ...r.headers } });
};

describe("crawl review fixes", () => {
  it("follows a redirecting robots.txt", async () => {
    const r = await crawlSite({
      startUrl: "https://a.test/",
      fetchFn: mk({
        "a.test/robots.txt": { status: 301, headers: { location: "https://a.test/robots-real.txt" } },
        "a.test/robots-real.txt": { body: "User-agent: *\nDisallow: /secret", headers: { "content-type": "text/plain" } },
        "a.test/": { body: page('<a href="/secret">s</a><a href="/ok">o</a>') },
        "a.test/ok": { body: page("") },
      }),
    });
    expect(r.robotsDisallowed).toBe(1);
    expect(r.pages.map((p) => p.url)).not.toContain("https://a.test/secret");
  });
  it("records a failed body download instead of failing the crawl", async () => {
    const r = await crawlSite({
      startUrl: "https://b.test/",
      fetchFn: mk({ "b.test/": { body: page('<a href="/bad">x</a><a href="/good">y</a>') }, "b.test/bad": { body: () => { throw new Error(); } }, "b.test/good": { body: page("") } }),
    });
    expect(r.pagesCrawled).toBe(3);
    expect(r.issues.find((i) => i.id === "fetch-errors")!.examples[0]).toMatch(/bad: body download failed/);
  });
  it("crawls the host the start URL redirects to", async () => {
    const r = await crawlSite({
      startUrl: "https://c.test/",
      fetchFn: mk({
        "c.test/": { status: 301, headers: { location: "https://www.c.test/" } },
        "www.c.test/": { body: page('<a href="/x">x</a>') },
        "www.c.test/x": { body: page("") },
      }),
    });
    expect(r.startUrl).toBe("https://www.c.test/");
    expect(r.pagesCrawled).toBe(2);
    expect(r.notes.join(" ")).toMatch(/redirects to https:\/\/www.c.test\//);
  });
});

describe("ai crawler review fix", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });
  it("treats a 5xx robots.txt as block-all", async () => {
    vi.stubGlobal("fetch", async () => new Response("err", { status: 503, headers: { "content-type": "text/plain" } }));
    vi.stubEnv("MARKETING_EXPERT_ALLOW_PRIVATE", "1"); // fake host has no DNS
    const r = await checkAiCrawlerAccess("https://d.test");
    expect(r.bots.every((b) => !b.allowed)).toBe(true);
    expect(r.findings[0]).toMatch(/HTTP 503/);
  });
});

describe("profile review fix", () => {
  it("lists profiles even if one file is malformed", async () => {
    const dir = mkdtempSync(join(tmpdir(), "me-bad-"));
    mkdirSync(join(dir, "profiles"));
    writeFileSync(join(dir, "profiles", "good.json"), JSON.stringify({ name: "good", product: "x" }));
    writeFileSync(join(dir, "profiles", "bad.json"), "{ trailing, }");
    process.env.MARKETING_EXPERT_DATA_DIR = dir;
    const { listProfiles } = await import("../src/lib/profile.js");
    const list = listProfiles();
    expect(list.find((p) => p.name === "good")!.product).toBe("x");
    expect(list.find((p) => p.name === "bad")!.product).toMatch(/UNREADABLE/);
  });
});
