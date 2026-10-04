// Small site crawler for SEO health checks. Same-host only, polite (limited concurrency, respects
// robots.txt for "*"), bounded (maxPages). Finds the problems that need many pages to see:
// broken internal links, redirect chains, duplicates, orphan pages, noindex/sitemap conflicts,
// canonical problems, link depth and hreflang errors.

import { parse } from "node-html-parser";
import { guardedFetch } from "./netguard.js";
import { countWords } from "./text.js";
import { parseRobots, robotsAllows, type RobotsRules } from "./robots.js";

export { parseRobots, robotsAllows };

export type FetchFn = (url: string, init: { redirect: "manual"; headers: Record<string, string>; signal: AbortSignal }) => Promise<Response>;

export interface CrawlOptions {
  startUrl: string;
  maxPages?: number;
  useSitemap?: boolean;
  concurrency?: number;
  timeoutMs?: number;
  respectRobots?: boolean;
  fetchFn?: FetchFn;
}

export interface CrawledPage {
  url: string;
  status: number | null;
  error?: string;
  redirectChain: string[];
  finalUrl: string;
  depth: number | null;
  inSitemap: boolean;
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  canonical: string | null;
  noindex: boolean;
  wordCount: number;
  internalLinksOut: number;
  inlinks: number;
  hreflang: Array<{ lang: string; href: string }>;
  scriptCount?: number;
}

export interface Issue {
  id: string;
  severity: "error" | "warning" | "info";
  message: string;
  count: number;
  examples: string[];
}

export interface CrawlResult {
  startUrl: string;
  pagesCrawled: number;
  limitReached: boolean;
  sitemapUrls: number;
  sitemapSource: string | null;
  robotsDisallowed: number;
  issues: Issue[];
  pages: Array<Pick<CrawledPage, "url" | "status" | "depth" | "inlinks" | "title" | "wordCount" | "noindex" | "inSitemap">>;
  notes: string[];
}

const UA = "Mozilla/5.0 (compatible; marketing-expert-mcp/0.1; site crawl)";
const HREFLANG_RE = /^(x-default|[a-z]{2,3}(-[A-Za-z]{4})?(-([A-Za-z]{2}|\d{3}))?)$/;

function normalize(href: string, base: string): string | null {
  try {
    const u = new URL(href, base);
    if (!/^https?:$/.test(u.protocol)) return null;
    u.hash = "";
    return u.toString();
  } catch {
    return null;
  }
}

function extractLocs(xml: string): string[] {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1].replace(/&amp;/g, "&"));
}

export async function crawlSite(opts: CrawlOptions): Promise<CrawlResult> {
  const maxPages = Math.min(opts.maxPages ?? 100, 1000);
  const concurrency = Math.min(opts.concurrency ?? 4, 8);
  const timeoutMs = opts.timeoutMs ?? 15000;
  const fetchFn: FetchFn = opts.fetchFn ?? ((u, init) => guardedFetch(u, init));
  const requested = normalize(opts.startUrl, opts.startUrl);
  if (!requested) throw new RangeError("startUrl must be an http(s) URL");
  const notes: string[] = [];

  const get = async (url: string) =>
    fetchFn(url, { redirect: "manual", headers: { "user-agent": UA, accept: "text/html,application/xml,text/xml,*/*;q=0.8" }, signal: AbortSignal.timeout(timeoutMs) });
  // For robots.txt, sitemaps and the start URL: follow up to 5 redirects (any host).
  const getFollow = async (url: string): Promise<{ res: Response; url: string; chain: string[] }> => {
    let current = url;
    const chain: string[] = [];
    for (let hop = 0; hop < 5; hop++) {
      const res = await get(current);
      const loc = res.headers.get("location");
      if (res.status >= 300 && res.status < 400 && loc) {
        const next = normalize(loc, current);
        if (!next) return { res, url: current, chain };
        chain.push(`${res.status} → ${next}`);
        current = next;
        continue;
      }
      return { res, url: current, chain };
    }
    return { res: await get(current), url: current, chain };
  };

  // Resolve the start URL first: example.com → www.example.com redirects are common.
  let start = requested;
  try {
    const r = await getFollow(requested);
    if (r.url !== requested) {
      start = r.url;
      const temporary = r.chain.some((c) => /^30[27] /.test(c));
      notes.push(
        `Start URL redirects: ${requested} ${r.chain.join(" ")}; crawling ${start}.` +
          (temporary ? " A temporary redirect (302/307) on the start URL: if it's permanent, use 301/308 or serve content at the start URL." : "")
      );
    }
  } catch {
    // Leave start as requested; the page fetch will record the error.
  }
  const host = new URL(start).host;

  // robots.txt
  let robots: RobotsRules = { allow: [], disallow: [], sitemaps: [] };
  try {
    const { res: r } = await getFollow(new URL("/robots.txt", start).toString());
    if (r.ok) robots = parseRobots(await r.text());
    else if (r.status >= 500) notes.push(`robots.txt returned HTTP ${r.status}. Google treats a server error on robots.txt as "block everything" until it recovers. Fix this first.`);
  } catch {
    notes.push("robots.txt could not be fetched.");
  }
  const respectRobots = opts.respectRobots ?? true;

  // Sitemaps (one level of sitemap index).
  const sitemapSet = new Set<string>();
  let sitemapSource: string | null = null;
  if (opts.useSitemap ?? true) {
    const candidates = robots.sitemaps.length ? robots.sitemaps : [new URL("/sitemap.xml", start).toString()];
    for (const sm of candidates.slice(0, 5)) {
      try {
        const { res: r } = await getFollow(sm);
        if (!r.ok) {
          notes.push(`Sitemap ${sm} returned HTTP ${r.status}${r.status >= 500 ? " (server error: crawlers can't read it until it recovers)" : ""}.`);
          continue;
        }
        const xml = await r.text();
        sitemapSource ??= sm;
        if (/<sitemapindex/i.test(xml)) {
          for (const child of extractLocs(xml).slice(0, 20)) {
            try {
              const { res: cr } = await getFollow(child);
              if (cr.ok) extractLocs(await cr.text()).forEach((l) => sitemapSet.add(normalize(l, l) ?? l));
            } catch {
              notes.push(`Child sitemap failed: ${child}`);
            }
          }
        } else {
          extractLocs(xml).forEach((l) => sitemapSet.add(normalize(l, l) ?? l));
        }
      } catch {
        notes.push(`Sitemap could not be fetched: ${sm}`);
      }
    }
    if (!sitemapSource && !notes.some((n) => n.startsWith("Sitemap "))) notes.push("No XML sitemap found (checked robots.txt Sitemap lines and /sitemap.xml).");
  }

  const pages = new Map<string, CrawledPage>();
  const inlinkSources = new Map<string, Set<string>>();
  const depthOf = new Map<string, number>([[start, 0]]);
  // Two FIFO queues: link-discovered URLs first (breadth-first, so depth = shortest click path),
  // then sitemap-only URLs.
  const linkQueue: string[] = [start];
  const sitemapQueue: string[] = [];
  const queued = new Set<string>([start]);
  let robotsDisallowed = 0;
  for (const s of sitemapSet) {
    if (new URL(s).host === host && !queued.has(s)) {
      sitemapQueue.push(s);
      queued.add(s);
    }
  }
  const nextUrl = () => linkQueue.shift() ?? sitemapQueue.shift();
  const pending = () => linkQueue.length + sitemapQueue.length;

  const fetchPage = async (url: string): Promise<{ page: CrawledPage; links: string[] }> => {
    const page: CrawledPage = {
      url,
      status: null,
      redirectChain: [],
      finalUrl: url,
      depth: depthOf.get(url) ?? null,
      inSitemap: sitemapSet.has(url),
      title: null,
      metaDescription: null,
      h1Count: 0,
      canonical: null,
      noindex: false,
      wordCount: 0,
      internalLinksOut: 0,
      inlinks: 0,
      hreflang: [],
    };
    let current = url;
    let res: Response | null = null;
    try {
      for (let hop = 0; hop < 6; hop++) {
        res = await get(current);
        if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
          const next = normalize(res.headers.get("location")!, current);
          if (!next) break;
          page.redirectChain.push(`${res.status} → ${next}`);
          current = next;
          if (new URL(current).host !== host) break;
          continue;
        }
        break;
      }
    } catch (e) {
      page.error = e instanceof Error ? e.message : String(e);
      return { page, links: [] };
    }
    page.status = res!.status;
    page.finalUrl = current;
    const xr = res!.headers.get("x-robots-tag");
    if (xr && /noindex/i.test(xr)) page.noindex = true;
    const ct = res!.headers.get("content-type") ?? "";
    if (!res!.ok || !ct.includes("html") || new URL(current).host !== host) return { page, links: [] };
    let html: string;
    try {
      html = await res!.text();
    } catch (e) {
      page.error = `body download failed: ${e instanceof Error ? e.message : String(e)}`;
      return { page, links: [] };
    }
    const root = parse(html, { blockTextElements: { script: true, style: true, noscript: true } });
    page.title = root.querySelector("title")?.text.trim() || null;
    page.metaDescription = root.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || null;
    page.h1Count = root.querySelectorAll("h1").length;
    const can = root.querySelector('link[rel="canonical"]')?.getAttribute("href");
    page.canonical = can ? normalize(can, current) : null;
    const robotsMeta = root.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
    if (/noindex/i.test(robotsMeta)) page.noindex = true;
    page.hreflang = root
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .map((l) => ({ lang: l.getAttribute("hreflang") ?? "", href: normalize(l.getAttribute("href") ?? "", current) ?? "" }));
    // Count before removing scripts from the body; frameworks often put their module scripts there.
    page.scriptCount = root.querySelectorAll('script[src],script[type="module"],link[rel="modulepreload"]').length;
    const body = root.querySelector("body") ?? root;
    for (const el of body.querySelectorAll("script,style,noscript,svg,template")) el.remove();
    page.wordCount = countWords(body);
    const nofollowPage = /nofollow/i.test(robotsMeta);
    const links = new Set<string>();
    if (!nofollowPage) {
      for (const a of body.querySelectorAll("a[href]")) {
        if (/nofollow/i.test(a.getAttribute("rel") ?? "")) continue;
        const n = normalize(a.getAttribute("href") ?? "", current);
        if (n && new URL(n).host === host) links.add(n);
      }
    }
    page.internalLinksOut = links.size;
    return { page, links: [...links] };
  };

  while (pending() > 0 && pages.size < maxPages) {
    const batch: string[] = [];
    while (pending() > 0 && batch.length < concurrency && pages.size + batch.length < maxPages) {
      const u = nextUrl()!;
      if (respectRobots && !robotsAllows(robots, u)) {
        robotsDisallowed++;
        continue;
      }
      batch.push(u);
    }
    const results = await Promise.all(batch.map(fetchPage));
    for (const { page, links } of results) {
      pages.set(page.url, page);
      const d = depthOf.get(page.url);
      for (const l of links) {
        if (!inlinkSources.has(l)) inlinkSources.set(l, new Set());
        inlinkSources.get(l)!.add(page.url);
        if (d !== undefined && !depthOf.has(l)) depthOf.set(l, d + 1);
        if (!queued.has(l)) {
          queued.add(l);
          linkQueue.push(l);
        }
      }
    }
  }
  const limitReached = pending() > 0;
  for (const p of pages.values()) {
    p.inlinks = inlinkSources.get(p.url)?.size ?? 0;
    p.depth = depthOf.get(p.url) ?? null;
  }

  const issues = buildIssues([...pages.values()], inlinkSources, sitemapSet, host);
  if (limitReached) notes.push(`Stopped at maxPages=${maxPages}; ${pending()} more URLs were queued. Site-wide counts are partial.`);
  if (robotsDisallowed) notes.push(`${robotsDisallowed} URL(s) skipped because robots.txt disallows them.`);

  return {
    startUrl: start,
    pagesCrawled: pages.size,
    limitReached,
    sitemapUrls: sitemapSet.size,
    sitemapSource,
    robotsDisallowed,
    issues,
    pages: [...pages.values()]
      .slice(0, 300)
      .map((p) => ({ url: p.url, status: p.status, depth: p.depth, inlinks: p.inlinks, title: p.title, wordCount: p.wordCount, noindex: p.noindex, inSitemap: p.inSitemap })),
    notes,
  };
}

function buildIssues(pages: CrawledPage[], inlinks: Map<string, Set<string>>, sitemap: Set<string>, host: string): Issue[] {
  const issues: Issue[] = [];
  const add = (id: string, severity: Issue["severity"], message: string, examples: string[]) => {
    if (examples.length) issues.push({ id, severity, message, count: examples.length, examples: examples.slice(0, 10) });
  };
  const byUrl = new Map(pages.map((p) => [p.url, p]));
  const ok = pages.filter((p) => p.status === 200 && !p.redirectChain.length);
  const indexable = ok.filter((p) => !p.noindex);

  const broken = pages.filter((p) => p.status !== null && p.status >= 400);
  add(
    "broken-internal",
    "error",
    "Internal URLs returning 4xx/5xx. Fix or remove the links pointing to them.",
    broken.map((p) => `${p.url} (${p.status}) ← linked from ${[...(inlinks.get(p.url) ?? [])].slice(0, 3).join(", ") || "sitemap only"}`)
  );
  add("fetch-errors", "error", "URLs that failed to load (timeout, DNS, connection).", pages.filter((p) => p.error).map((p) => `${p.url}: ${p.error}`));

  const linkedRedirects = pages.filter((p) => p.redirectChain.length && (inlinks.get(p.url)?.size ?? 0) > 0);
  add("links-to-redirects", "warning", "Internal links pointing at redirects. Link straight to the final URL.", linkedRedirects.map((p) => `${p.url} ${p.redirectChain.join(" ")}`));
  add(
    "temporary-redirects",
    "info",
    "Internal URLs using temporary redirects (302/307). If the move is permanent, use 301/308 so search engines consolidate signals on the target.",
    pages.filter((p) => p.redirectChain.some((c) => /^30[27] /.test(c))).map((p) => `${p.url} ${p.redirectChain.join(" ")}`)
  );
  add("redirect-chains", "warning", "Redirect chains with more than one hop.", pages.filter((p) => p.redirectChain.length > 1).map((p) => `${p.url} ${p.redirectChain.join(" ")}`));

  const dup = (key: (p: CrawledPage) => string | null, id: string, label: string) => {
    const groups = new Map<string, string[]>();
    for (const p of indexable) {
      const k = key(p);
      if (!k) continue;
      groups.set(k, [...(groups.get(k) ?? []), p.url]);
    }
    add(id, "warning", `Duplicate ${label} across indexable pages.`, [...groups.entries()].filter(([, us]) => us.length > 1).map(([k, us]) => `"${k.slice(0, 80)}" on ${us.length} pages: ${us.slice(0, 3).join(", ")}`));
  };
  dup((p) => p.title, "duplicate-titles", "titles");
  dup((p) => p.metaDescription, "duplicate-descriptions", "meta descriptions");
  add("missing-title", "error", "Indexable pages without a <title>.", indexable.filter((p) => !p.title).map((p) => p.url));
  add("missing-description", "info", "Indexable pages without a meta description.", indexable.filter((p) => !p.metaDescription).map((p) => p.url));
  const shell = (p: CrawledPage) => p.wordCount < 50 && (p.scriptCount ?? 0) > 0;
  add(
    "client-rendered",
    "warning",
    "Pages whose server HTML is nearly empty (< 50 words) but loads scripts: content is probably built in the browser. Crawlers that don't run JavaScript (most AI crawlers) see an empty page; Google sees it only after rendering. Confirm with audit_page render=true. These pages are left out of the missing-h1 and thin findings, which would only restate this one.",
    indexable.filter(shell).map((p) => `${p.url} (${p.wordCount} words in server HTML)`)
  );
  add("missing-h1", "warning", "Indexable pages without an <h1> in the server HTML (for client-rendered pages, check the rendered page).", indexable.filter((p) => p.h1Count === 0 && !shell(p)).map((p) => p.url));

  add("noindex-in-sitemap", "error", "Pages in the sitemap that are noindex: the sitemap asks Google to index pages that refuse it.", ok.filter((p) => p.noindex && p.inSitemap).map((p) => p.url));
  add("non200-in-sitemap", "warning", "Sitemap URLs that redirect or error. Sitemaps should list final, 200-status URLs only.", pages.filter((p) => p.inSitemap && (p.status !== 200 || p.redirectChain.length)).map((p) => (p.redirectChain.length ? `${p.url} (redirects to ${p.finalUrl})` : `${p.url} (${p.status})`)));
  add(
    "orphans",
    "warning",
    "Sitemap pages with no internal links pointing to them (orphans). Google finds and values pages largely through internal links.",
    indexable.filter((p) => p.inSitemap && (inlinks.get(p.url)?.size ?? 0) === 0 && p.depth !== 0).map((p) => p.url)
  );
  add("not-in-sitemap", "info", "Indexable pages found by links but missing from the sitemap.", sitemap.size ? indexable.filter((p) => !p.inSitemap).map((p) => p.url) : []);

  add(
    "canonical-elsewhere",
    "info",
    "Pages whose canonical points to another URL (fine for duplicates; a problem if unintended).",
    indexable.filter((p) => p.canonical && p.canonical !== p.url).map((p) => `${p.url} → ${p.canonical}`)
  );
  add(
    "canonical-broken",
    "error",
    "Canonical points to a URL that redirects, errors or is noindex.",
    indexable
      .filter((p) => p.canonical && p.canonical !== p.url && byUrl.has(p.canonical))
      .filter((p) => {
        const t = byUrl.get(p.canonical!)!;
        return t.status !== 200 || t.redirectChain.length > 0 || t.noindex;
      })
      .map((p) => `${p.url} → ${p.canonical}`)
  );
  add("deep-pages", "info", "Pages more than 3 clicks from the start URL. Important pages should be reachable in a few clicks.", ok.filter((p) => p.depth !== null && p.depth > 3).map((p) => `${p.url} (depth ${p.depth})`));
  add("single-inlink", "info", "Indexable pages with only one internal link pointing to them.", indexable.filter((p) => (inlinks.get(p.url)?.size ?? 0) === 1).map((p) => p.url));
  add("thin", "info", "Indexable pages under 200 words (heuristic; fine for some page types).", indexable.filter((p) => p.wordCount < 200 && !shell(p)).map((p) => `${p.url} (${p.wordCount} words)`));

  // hreflang
  const hreflangIssues: string[] = [];
  for (const p of ok) {
    if (!p.hreflang.length) continue;
    for (const h of p.hreflang) if (!HREFLANG_RE.test(h.lang)) hreflangIssues.push(`${p.url}: invalid hreflang code "${h.lang}"`);
    if (!p.hreflang.some((h) => h.href === p.url)) hreflangIssues.push(`${p.url}: no self-referencing hreflang`);
    for (const h of p.hreflang) {
      const target = byUrl.get(h.href);
      if (!target || h.href === p.url || new URL(h.href).host !== host) continue;
      if (!target.hreflang.some((t) => t.href === p.url)) hreflangIssues.push(`${p.url} → ${h.href} (${h.lang}): target doesn't link back`);
    }
  }
  add("hreflang", "warning", "hreflang problems (invalid codes, missing self-reference, missing return links). Google ignores hreflang pairs that don't link back.", hreflangIssues);

  const order = { error: 0, warning: 1, info: 2 };
  return issues.sort((a, b) => order[a.severity] - order[b.severity] || b.count - a.count);
}
