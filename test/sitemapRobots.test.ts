// Sitemap and robots.txt checked from text, for sites that aren't deployed or can't be reached from here.
import { describe, it, expect } from "vitest";
import { checkSitemapXml, checkRobotsTxt } from "../src/lib/sitemapRobots.js";

const NS = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
const urlset = (...entries: string[]) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${NS}>${entries.join("")}</urlset>`;
const ids = (r: { issues: Array<{ id: string }> }) => r.issues.map((i) => i.id);

describe("checkSitemapXml", () => {
  it("passes a clean sitemap", () => {
    const r = checkSitemapXml(urlset("<url><loc>https://x.test/</loc><lastmod>2026-10-01</lastmod></url>", "<url><loc>https://x.test/a?b=1&amp;c=2</loc></url>"), "https://x.test/sitemap.xml");
    expect(r).toEqual({ kind: "urlset", urls: 2, issues: [] });
  });
  it("flags relative, unescaped, duplicate, out-of-scope URLs, bad lastmod and ignored tags", () => {
    const r = checkSitemapXml(
      `<urlset>${["<url><loc>/about</loc></url>", "<url><loc>https://x.test/a?b=1&c=2</loc><lastmod>27/10/2026</lastmod><priority>0.8</priority></url>", "<url><loc>https://x.test/d</loc></url>", "<url><loc>https://x.test/d</loc></url>", "<url><loc>https://other.test/</loc></url>", "<url><lastmod>2026-01-01</lastmod></url>"].join("")}</urlset>`,
      "https://x.test/sitemap.xml"
    );
    expect(ids(r).sort()).toEqual(["sitemap-bad-lastmod", "sitemap-duplicates", "sitemap-ignored-tags", "sitemap-missing-loc", "sitemap-namespace", "sitemap-outside-scope", "sitemap-relative-loc", "sitemap-unescaped"]);
    expect(r.issues.find((i) => i.id === "sitemap-outside-scope")?.examples).toEqual(["https://other.test/"]);
  });
  it("recognises an HTML page served as the sitemap", () => {
    expect(ids(checkSitemapXml("<!doctype html><html><body>app</body></html>"))).toEqual(["sitemap-is-html"]);
  });
  it("counts the 50,000-URL limit", () => {
    const many = urlset(...Array.from({ length: 50_001 }, (_, i) => `<url><loc>https://x.test/${i}</loc></url>`));
    expect(ids(checkSitemapXml(many))).toEqual(["sitemap-too-many-urls"]);
  });
  it("says a sitemap index's children were not read", () => {
    const r = checkSitemapXml(`<sitemapindex ${NS}><sitemap><loc>https://x.test/s1.xml</loc></sitemap></sitemapindex>`);
    expect(r.kind).toBe("sitemapindex");
    expect(ids(r)).toEqual(["sitemap-index-children"]);
  });
});

describe("checkRobotsTxt", () => {
  it("passes a clean robots.txt", () => {
    expect(checkRobotsTxt("User-agent: *\nDisallow: /admin/\n\nSitemap: https://x.test/sitemap.xml\n", "https://x.test/").issues).toEqual([]);
  });
  it("flags a file that blocks the whole site for Google", () => {
    const r = checkRobotsTxt("User-agent: *\nDisallow: /\nSitemap: https://x.test/sitemap.xml", "https://x.test/");
    expect(r.issues.map((i) => [i.id, i.severity])).toEqual([["robots-blocks-site", "error"], ["robots-blocks-sitemap", "warning"]]);
  });
  it("flags rules before any user-agent, paths without a slash, unsupported fields and relative sitemaps", () => {
    const r = checkRobotsTxt("Disallow: /x\nUser-agent: *\nDisallow: private\nCrawl-delay: 10\nNoindex: /y\nDisalow: /z\nSitemap: /sitemap.xml");
    expect(ids(r)).toEqual(["robots-before-user-agent", "robots-bad-path", "robots-unsupported", "robots-unknown", "robots-sitemap-relative"]);
  });
  it("recognises an HTML page served as robots.txt", () => {
    expect(ids(checkRobotsTxt("<!DOCTYPE html><html></html>"))).toEqual(["robots-is-html"]);
  });
});
