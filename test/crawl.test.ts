import { describe, it, expect } from "vitest";
import { crawlSite, parseRobots, robotsAllows, type FetchFn } from "../src/lib/crawl.js";

const B = "https://site.test";
const html = (title: string, body: string, head = "") =>
  `<html><head><title>${title}</title>${head}</head><body>${body}</body></html>`;
const words = (n: number) => "word ".repeat(n);

type R = { status?: number; body?: string; headers?: Record<string, string> };
const site: Record<string, R> = {
  "/robots.txt": { body: "User-agent: *\nDisallow: /private\nAllow: /private/ok\nSitemap: https://site.test/sitemap.xml", headers: { "content-type": "text/plain" } },
  "/sitemap.xml": {
    body: `<urlset>${["/", "/a", "/orphan", "/noidx", "/old"].map((p) => `<loc>${B}${p}</loc>`).join("")}</urlset>`,
    headers: { "content-type": "application/xml" },
  },
  "/": { body: html("Home", `<h1>Home</h1>${words(300)}<a href="/a">a</a><a href="/b">b</a><a href="/old">old</a><a href="/missing">x</a><a href="/private/x">p</a><a href="https://other.test/">ext</a>`) },
  "/a": { body: html("Same title", `<h1>A</h1>${words(300)}<a href="/c">c</a>`, `<link rel="canonical" href="${B}/old">`) },
  "/b": { body: html("Same title", `<h1>B</h1>${words(50)}`, `<link rel="alternate" hreflang="en" href="${B}/b"><link rel="alternate" hreflang="fr" href="${B}/c">`) },
  "/c": { body: html("C", `<h1>C</h1>${words(300)}<a href="/d">d</a>`) },
  "/d": { body: html("D", `<h1>D</h1>${words(300)}<a href="/e">e</a>`) },
  "/e": { body: html("E", `<h1>E</h1>${words(300)}`) },
  "/old": { status: 301, headers: { location: "/older" } },
  "/older": { status: 302, headers: { location: "/a" } },
  "/orphan": { body: html("Orphan", `<h1>O</h1>${words(300)}`) },
  "/noidx": { body: html("NoIdx", `<h1>N</h1>${words(300)}`, `<meta name="robots" content="noindex">`) },
};

const fetchFn: FetchFn = async (url) => {
  const u = new URL(url);
  const r = site[u.pathname];
  if (!r) return new Response("not found", { status: 404, headers: { "content-type": "text/html" } });
  return new Response(r.body ?? "", { status: r.status ?? 200, headers: { "content-type": "text/html", ...r.headers } });
};

describe("robots", () => {
  it("longest match wins, allow wins ties", () => {
    const r = parseRobots("User-agent: Googlebot\nDisallow: /\n\nUser-agent: *\nDisallow: /private\nAllow: /private/ok\nDisallow: /*.pdf$");
    expect(robotsAllows(r, `${B}/`)).toBe(true);
    expect(robotsAllows(r, `${B}/private/x`)).toBe(false);
    expect(robotsAllows(r, `${B}/private/ok/1`)).toBe(true);
    expect(robotsAllows(r, `${B}/file.pdf`)).toBe(false);
    expect(robotsAllows(r, `${B}/file.pdf?x=1`)).toBe(true);
  });
});

describe("crawlSite", async () => {
  const r = await crawlSite({ startUrl: `${B}/`, fetchFn });
  const issue = (id: string) => r.issues.find((i) => i.id === id);

  it("crawls same-host pages within robots rules", () => {
    expect(r.sitemapSource).toBe(`${B}/sitemap.xml`);
    expect(r.robotsDisallowed).toBe(1);
    expect(r.pages.map((p) => p.url)).not.toContain("https://other.test/");
  });
  it("computes shortest click depth breadth-first", () => {
    const depth = Object.fromEntries(r.pages.map((p) => [new URL(p.url).pathname, p.depth]));
    expect(depth["/"]).toBe(0);
    expect(depth["/a"]).toBe(1);
    expect(depth["/c"]).toBe(2);
    expect(depth["/e"]).toBe(4);
    expect(depth["/orphan"]).toBeNull();
  });
  it("finds the planted problems", () => {
    expect(issue("broken-internal")!.examples[0]).toMatch(/\/missing \(404\) ← linked from https:\/\/site.test\//);
    expect(issue("redirect-chains")!.examples[0]).toMatch(/\/old 301 → .*\/older 302 → .*\/a/);
    expect(issue("links-to-redirects")!.count).toBe(1);
    expect(issue("duplicate-titles")!.examples[0]).toMatch(/"Same title" on 2 pages/);
    expect(issue("orphans")!.examples).toEqual([`${B}/orphan`]);
    expect(issue("noindex-in-sitemap")!.examples).toEqual([`${B}/noidx`]);
    expect(issue("non200-in-sitemap")!.examples[0]).toMatch(/\/old \(redirects to https:\/\/site.test\/a\)/);
    expect(issue("canonical-broken")!.examples).toEqual([`${B}/a → ${B}/old`]);
    expect(issue("deep-pages")!.examples).toEqual([`${B}/e (depth 4)`]);
    expect(issue("thin")!.examples[0]).toMatch(/\/b \(51 words\)/);
    expect(issue("hreflang")!.examples.join(" ")).toMatch(/target doesn't link back/);
    expect(r.issues[0].severity).toBe("error");
  });
  it("respects maxPages", async () => {
    const small = await crawlSite({ startUrl: `${B}/`, fetchFn, maxPages: 3 });
    expect(small.pagesCrawled).toBe(3);
    expect(small.limitReached).toBe(true);
    expect(small.notes.join(" ")).toMatch(/Stopped at maxPages=3/);
  });
});
