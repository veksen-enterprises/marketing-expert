// Round 4: problems found by running the tools against live sites (2026-10-05).
import { describe, it, expect, afterEach, vi } from "vitest";
import { crawlSite, type FetchFn } from "../src/lib/crawl.js";
import { fetchAndAudit } from "../src/lib/pageAudit.js";

const B = "https://site.test";
const W = "https://www.site.test";
const page = (title: string, body: string, head = "") => `<html><head><title>${title}</title>${head}</head><body><h1>${title}</h1>${"word ".repeat(300)}${body}</body></html>`;
type R = { status?: number; body?: string; headers?: Record<string, string> };
const serve =
  (site: Record<string, R>): FetchFn =>
  async (url) => {
    const u = new URL(url);
    const r = site[u.host === "site.test" ? u.pathname : `${u.host}${u.pathname}`];
    if (!r) return new Response("not found", { status: 404, headers: { "content-type": "text/html" } });
    return new Response(r.body ?? "", { status: r.status ?? 200, headers: { "content-type": "text/html", ...r.headers } });
  };

describe("crawl_site on a site whose canonicals and sitemap point at a dead www host", async () => {
  // Shaped like dbtool.example: apex serves pages, every canonical and sitemap URL is on www, and www is 404.
  const site: Record<string, R> = {
    "/robots.txt": { body: "<!doctype html><html><body>app</body></html>" },
    "/sitemap.xml": { body: "<!doctype html><html><body>app</body></html>" },
    "/sitemap-index.xml": { body: `<sitemapindex><sitemap><loc>${W}/sitemap-0.xml</loc></sitemap></sitemapindex>`, headers: { "content-type": "text/xml" } },
    "www.site.test/sitemap-0.xml": { body: `<urlset><loc>${W}/</loc><loc>${W}/pricing/</loc></urlset>`, headers: { "content-type": "text/xml" } },
    "/": {
      body: page("Home", `<a href="/pricing">pricing</a><a href="/cdn-cgi/l/email-protection#abc">email</a>`, `<link rel="sitemap" href="/sitemap-index.xml"><link rel="canonical" href="${W}/">`),
    },
    "/pricing": { body: page("Pricing", "", `<link rel="canonical" href="${W}/pricing/">`) },
  };
  const r = await crawlSite({ startUrl: `${B}/`, fetchFn: serve(site) });
  const issue = (id: string) => r.issues.find((i) => i.id === id);

  it("checks canonical targets on another host and reports the 404s", () => {
    expect(issue("canonical-broken")!.examples).toEqual([`${B}/ → ${W}/ (HTTP 404)`, `${B}/pricing → ${W}/pricing/ (HTTP 404)`]);
  });
  it("finds the sitemap named in <head> and says robots.txt should name it", () => {
    expect(r.sitemapSource).toBe(`${B}/sitemap-index.xml`);
    expect(r.notes.join("\n")).toMatch(/Found the sitemap at https:\/\/site\.test\/sitemap-index\.xml \(named in the start page's <head>\)/);
    expect(r.notes.join("\n")).not.toMatch(/sitemap\.xml is an HTML page/);
  });
  it("says the sitemap lists URLs on another host", () => {
    expect(r.notes.join("\n")).toMatch(/2 of 2 sitemap URLs are on www\.site\.test, not on site\.test/);
  });
  it("does not treat Cloudflare /cdn-cgi/ links as broken pages", () => {
    expect(issue("broken-internal")).toBeUndefined();
    expect(r.pages.some((p) => p.url.includes("/cdn-cgi/"))).toBe(false);
  });
});

describe("crawl_site sitemap guessing", () => {
  it("finds /sitemap_index.xml without a robots.txt line, and keeps quiet about the guessed names that 404", async () => {
    const r = await crawlSite({
      startUrl: `${B}/`,
      fetchFn: serve({
        "/": { body: page("Home", "") },
        "/sitemap_index.xml": { body: `<urlset><loc>${B}/</loc></urlset>`, headers: { "content-type": "application/xml" } },
      }),
    });
    expect(r.sitemapSource).toBe(`${B}/sitemap_index.xml`);
    expect(r.notes.join("\n")).not.toMatch(/sitemap\.xml returned HTTP 404|sitemap-index\.xml/);
  });
  it("reports a missing /sitemap.xml once when no guess works", async () => {
    const r = await crawlSite({ startUrl: `${B}/`, fetchFn: serve({ "/": { body: page("Home", "") } }) });
    expect(r.sitemapSource).toBeNull();
    expect(r.notes.filter((n) => /sitemap/i.test(n))).toEqual([`Sitemap ${B}/sitemap.xml returned HTTP 404.`]);
  });
});

describe("audit_page canonical target", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });
  const stub = (wwwStatus: number) => {
    vi.stubEnv("MARKETING_EXPERT_ALLOW_PRIVATE", "1");
    vi.stubGlobal("fetch", async (u: URL | string) =>
      new URL(u).host === "www.site.test"
        ? new Response("gone", { status: wwwStatus, headers: { "content-type": "text/plain" } })
        : new Response(page("Home", "", `<link rel="canonical" href="${W}/">`), { headers: { "content-type": "text/html" } })
    );
  };
  it("flags a canonical that returns 404 as an error", async () => {
    stub(404);
    const f = await fetchAndAudit(`${B}/`);
    expect(f.flags[0]).toMatchObject({ severity: "error" });
    expect(f.flags[0].message).toMatch(/Canonical points to https:\/\/www\.site\.test\/, which returns HTTP 404/);
    expect(f.flags.some((x) => x.message.startsWith("Canonical ("))).toBe(false);
  });
  it("keeps the info note when the canonical target is live", async () => {
    stub(200);
    const f = await fetchAndAudit(`${B}/`);
    expect(f.flags.some((x) => x.severity === "error")).toBe(false);
    expect(f.flags.some((x) => x.message.startsWith("Canonical ("))).toBe(true);
  });
});
