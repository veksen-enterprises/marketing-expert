// Checks a sitemap and a robots.txt passed as text, for sites not deployed yet or not reachable from here (a
// staging server on a private address). Read on 2026-10-27 from the sitemap protocol and Google's pages below.
// Nothing is fetched: child sitemaps in an index and the pages listed are not checked.

import { parseRobotsFile, rulesFor, robotsAllows } from "./robots.js";

const SITEMAP_PROTOCOL = "https://www.sitemaps.org/protocol.html";
const GOOGLE_SITEMAP = "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap";
const GOOGLE_ROBOTS = "https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt";
const NS = "http://www.sitemaps.org/schemas/sitemap/0.9";
const MAX_URLS = 50_000;
const MAX_BYTES = 50 * 1024 * 1024;
const MAX_ROBOTS_BYTES = 500 * 1024;

export interface TextIssue {
  id: string;
  severity: "error" | "warning" | "info";
  message: string;
  examples: string[];
  source: string;
}

const looksHtml = (t: string) => /^\s*(<!doctype html|<html|<head|<body)/i.test(t);
const W3C_DATETIME = /^\d{4}(-\d{2}(-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?)?)?$/;

export interface SitemapReport {
  kind: "urlset" | "sitemapindex" | null;
  urls: number;
  issues: TextIssue[];
}

/** `sitemapUrl`: where the file will be served, to check that the URLs it lists sit on the same host and under its folder. */
export function checkSitemapXml(xml: string, sitemapUrl?: string): SitemapReport {
  const issues: TextIssue[] = [];
  const add = (id: string, severity: TextIssue["severity"], message: string, examples: string[], source: string) => {
    if (examples.length) issues.push({ id, severity, message, examples: examples.slice(0, 10), source });
  };
  if (looksHtml(xml)) {
    add("sitemap-is-html", "error", "This is an HTML page, not an XML sitemap (often an app's catch-all route). Crawlers find no URLs in it.", ["<html>"], SITEMAP_PROTOCOL);
    return { kind: null, urls: 0, issues };
  }
  const root = xml.replace(/<\?xml[^>]*\?>/, "").replace(/<!--[\s\S]*?-->/g, "").match(/<\s*(urlset|sitemapindex)\b([^>]*)>/i);
  if (!root) {
    add("sitemap-no-root", "error", "No <urlset> or <sitemapindex> element: this is not a sitemap.", [xml.slice(0, 80)], SITEMAP_PROTOCOL);
    return { kind: null, urls: 0, issues };
  }
  const kind = root[1].toLowerCase() === "urlset" ? "urlset" : "sitemapindex";
  if (!root[2].includes(NS)) add("sitemap-namespace", "warning", `The <${root[1]}> element lacks xmlns="${NS}", which the protocol requires.`, [root[0].slice(0, 120)], SITEMAP_PROTOCOL);
  const bytes = Buffer.byteLength(xml, "utf8");
  if (bytes > MAX_BYTES) add("sitemap-too-big", "error", `The file is ${(bytes / 1048576).toFixed(1)} MB; one sitemap may be at most 50 MB uncompressed. Split it and list the parts in a sitemap index.`, [`${bytes} bytes`], GOOGLE_SITEMAP);

  const entries = [...xml.matchAll(new RegExp(`<${kind === "urlset" ? "url" : "sitemap"}\\b[^>]*>([\\s\\S]*?)<\\/${kind === "urlset" ? "url" : "sitemap"}\\s*>`, "gi"))].map((m) => m[1]);
  const locs: string[] = [];
  const noLoc: string[] = [];
  const badLastmod: string[] = [];
  const ignored = new Set<string>();
  for (const e of entries) {
    const loc = e.match(/<loc>\s*(?:<!\[CDATA\[\s*([\s\S]*?)\s*\]\]>|([\s\S]*?))\s*<\/loc>/i);
    if (!loc) noLoc.push(e.trim().slice(0, 80));
    else locs.push((loc[1] ?? loc[2]).trim());
    const lm = e.match(/<lastmod>\s*([^<]*?)\s*<\/lastmod>/i)?.[1];
    if (lm !== undefined && !W3C_DATETIME.test(lm)) badLastmod.push(lm);
    for (const t of ["priority", "changefreq"]) if (new RegExp(`<${t}>`, "i").test(e)) ignored.add(`<${t}>`);
  }
  if (kind === "urlset" && locs.length > MAX_URLS) add("sitemap-too-many-urls", "error", `${locs.length.toLocaleString("en-US")} URLs; one sitemap may list at most 50,000. Split it and list the parts in a sitemap index.`, [String(locs.length)], GOOGLE_SITEMAP);
  if (!entries.length) add("sitemap-empty", "warning", `The sitemap lists no ${kind === "urlset" ? "<url>" : "<sitemap>"} entries.`, [root[0]], SITEMAP_PROTOCOL);
  add("sitemap-missing-loc", "error", "Entries without <loc>, which every entry needs.", noLoc, SITEMAP_PROTOCOL);
  add("sitemap-relative-loc", "error", "<loc> values that are not full URLs (with https:// and the host). Google crawls URLs exactly as listed.", locs.filter((l) => !/^https?:\/\/[^/]/i.test(l)), GOOGLE_SITEMAP);
  add("sitemap-unescaped", "error", 'Unescaped "&" in <loc>: XML needs "&amp;". The file may fail to parse.', locs.filter((l) => /&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);)/i.test(l)), GOOGLE_SITEMAP);
  add("sitemap-loc-too-long", "error", "<loc> values of 2,048 characters or more; the protocol requires fewer.", locs.filter((l) => l.length >= 2048).map((l) => `${l.slice(0, 80)}…`), SITEMAP_PROTOCOL);
  const seen = new Set<string>();
  add("sitemap-duplicates", "warning", "URLs listed more than once.", [...new Set(locs.filter((l) => (seen.has(l) ? true : (seen.add(l), false))))], SITEMAP_PROTOCOL);
  add("sitemap-bad-lastmod", "warning", "<lastmod> values not in W3C Datetime format (e.g. 2026-10-27 or 2026-10-27T09:00:00+00:00).", badLastmod, SITEMAP_PROTOCOL);
  if (ignored.size) add("sitemap-ignored-tags", "info", `Google ignores ${[...ignored].join(" and ")}. They do no harm; don't spend time tuning them.`, [...ignored], GOOGLE_SITEMAP);
  if (sitemapUrl) {
    let base: URL | null = null;
    try {
      base = new URL(sitemapUrl);
    } catch {
      base = null;
    }
    if (base) {
      const dir = base.href.slice(0, base.href.lastIndexOf("/") + 1);
      const outside = locs.filter((l) => /^https?:\/\//i.test(l)).filter((l) => {
        try {
          const u = new URL(l);
          return u.host !== base!.host || u.protocol !== base!.protocol || !u.href.startsWith(dir);
        } catch {
          return false;
        }
      });
      add("sitemap-outside-scope", "warning", `URLs not under ${dir}. The protocol only allows URLs on the sitemap's own host, protocol and folder; Google accepts other hosts only when they are verified in the same Search Console account.`, outside, SITEMAP_PROTOCOL);
    }
  }
  if (kind === "sitemapindex") add("sitemap-index-children", "info", "This is a sitemap index. The child sitemaps it lists were not read; pass each one to check it.", locs.slice(0, 3), SITEMAP_PROTOCOL);
  return { kind, urls: locs.length, issues };
}

export interface RobotsReport {
  groups: number;
  sitemaps: string[];
  issues: TextIssue[];
}

/** `siteUrl`: the site the file is for, to check whether its home page and the listed sitemaps may be crawled. */
export function checkRobotsTxt(txt: string, siteUrl?: string): RobotsReport {
  const issues: TextIssue[] = [];
  const add = (id: string, severity: TextIssue["severity"], message: string, examples: string[]) => {
    if (examples.length) issues.push({ id, severity, message, examples: examples.slice(0, 10), source: GOOGLE_ROBOTS });
  };
  if (looksHtml(txt)) {
    add("robots-is-html", "error", "This is an HTML page, not a robots.txt (often an app's catch-all route). Crawlers find no rules and no Sitemap lines in it. Serve a text/plain file.", ["<html>"]);
    return { groups: 0, sitemaps: [], issues };
  }
  const bytes = Buffer.byteLength(txt, "utf8");
  if (bytes > MAX_ROBOTS_BYTES) add("robots-too-big", "warning", `The file is ${Math.round(bytes / 1024)} KiB. Google reads the first 500 KiB and ignores the rest.`, [`${bytes} bytes`]);
  const unsupported: string[] = [];
  const unknown: string[] = [];
  const noColon: string[] = [];
  const beforeAgent: string[] = [];
  const badPath: string[] = [];
  let sawAgent = false;
  for (const raw of txt.split(/\r\n|\r|\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const i = line.indexOf(":");
    if (i < 0) {
      noColon.push(line);
      continue;
    }
    const key = line.slice(0, i).trim().toLowerCase();
    const val = line.slice(i + 1).trim();
    if (key === "user-agent") sawAgent = true;
    else if (key === "allow" || key === "disallow") {
      if (!sawAgent) beforeAgent.push(line);
      if (val && !val.startsWith("/") && !val.startsWith("*")) badPath.push(line);
    } else if (key === "crawl-delay" || key === "noindex" || key === "host" || key === "clean-param") unsupported.push(line);
    else if (key !== "sitemap") unknown.push(line);
  }
  const file = parseRobotsFile(txt);
  add("robots-before-user-agent", "warning", "Allow or Disallow lines before any User-agent line. They belong to no group, so crawlers ignore them.", beforeAgent);
  add("robots-bad-path", "warning", 'Rules whose path does not start with "/". Google requires the path to start at the root.', badPath);
  add("robots-unsupported", "info", "Lines Google does not support (crawl-delay, noindex, host, clean-param). Google ignores them; some other crawlers read crawl-delay.", unsupported);
  add("robots-unknown", "info", "Lines with a field Google doesn't know. Google ignores them; check for typos.", unknown);
  add("robots-no-colon", "info", 'Lines without a ":" are not rules and are ignored.', noColon);
  add("robots-sitemap-relative", "error", "Sitemap lines must be full URLs, with https:// and the host. These are ignored.", file.sitemaps.filter((s) => !/^https?:\/\/[^/]/i.test(s)));
  if (siteUrl) {
    try {
      const home = new URL("/", siteUrl).toString();
      const all = rulesFor(file, "*");
      const google = rulesFor(file, "googlebot");
      if (!robotsAllows(google, home)) add("robots-blocks-site", "error", `Googlebot may not crawl ${home}. Fine on a staging server; on the live site it keeps pages out of Google.`, [google.matchedGroup === "googlebot" ? "User-agent: Googlebot" : "User-agent: *"]);
      else if (!robotsAllows(all, home)) add("robots-blocks-site", "warning", `Crawlers without their own group may not crawl ${home} (Googlebot may). Check that this is intended.`, ["User-agent: *"]);
      const blockedMaps = file.sitemaps.filter((s) => /^https?:\/\//i.test(s) && new URL(s).host === new URL(siteUrl).host && !robotsAllows(google, s));
      add("robots-blocks-sitemap", "warning", "Sitemaps that the rules themselves stop Googlebot from fetching.", blockedMaps);
    } catch {
      // A siteUrl that isn't a URL: the checks that need it are skipped, and the caller is told below.
      add("robots-site-url", "info", "siteUrl is not a valid URL, so whether the home page and sitemaps may be crawled was not checked.", [siteUrl]);
    }
  }
  if (!file.sitemaps.length) add("robots-no-sitemap", "info", 'No Sitemap line. Add "Sitemap: https://<host>/sitemap.xml" so crawlers find it without Search Console.', ["(none)"]);
  return { groups: file.groups.length, sitemaps: file.sitemaps, issues };
}
