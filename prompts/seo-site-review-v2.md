# SEO site review (v2)

Review how each public page of this site looks to Google and to AI crawlers, and give me a ranked list of fixes. This is a review: don't open PRs, don't commit, and don't change the app's code until I say so. Throwaway files (stub API, scripts, notes) go outside the repo or are deleted at the end.

## Rules

- **Measure, don't infer.** Every claim needs evidence: a command and its output, or `file:line`. Anything you couldn't verify (live site, real data, keyword volume, Search Console) is labelled **inferred**.
- **Production build, production server.** Build the app and run it the way production runs it (not the dev server). If pages need data, point it at a stub API or a seeded DB, and say which data each page saw. Note any env vars production sets that you didn't (site URL, API URL, feature flags), because head tags and sitemaps often depend on them.
- **Don't load the live site** beyond a handful of requests, and only if I've said it's OK.

## 1. Inventory: find every URL a crawler could reach

Build the URL list from three sources and compare them:
1. **Router**: every route in the code (file paths, route config).
2. **Sitemap**: every URL in `sitemap.xml` (and any sitemap index).
3. **Links**: a crawl from `/` following real `<a href>` links, in both raw HTML and rendered DOM.

Report:
- **Orphans**: in the router or sitemap, but no crawlable link reaches them.
- **Sitemap-only URLs.**
- **Links to redirects or errors.**
- **URL variants that return 200 for the same content:**
  - trailing slash
  - uppercase
  - `/index.html`
  - `http` vs `https`
  - `www` vs bare domain
  - tracking parameters (`?utm_*`, `?ref=`)
  - filter or sort parameters

Group routes into **templates** (home, listing, record, calculator, docs, blog post, account…). For record pages generated from data, review the template with **3–5 sample records** (newest, oldest, one with missing fields, one deleted) rather than every URL.

## 2. Per URL: what a crawler gets

For each sampled URL:
1. **Raw HTML** (`curl -sSL -D -`): status, redirect chain with codes, `<title>`, meta description, canonical, robots meta, `X-Robots-Tag`, `Content-Type`, compression, word count of visible body text, H1, and whether the body is real content or an app shell.
2. **As Googlebot**: repeat with Googlebot's user agent. Flag any difference in status, content or redirects; bot-specific serving can look like cloaking.
3. **Rendered**: headless Chromium at phone width (Google indexes the mobile render). Record:
   - title, H1 and H2s
   - word count
   - `<a href>` links, and navigation done by `onClick` without an `<a href>`, which crawlers don't follow
   - console errors
   - failed requests
   - how long until the main content appears
4. **Raw vs rendered diff**: what exists only after JavaScript runs. Google renders later; most AI crawlers (GPTBot, ClaudeBot, PerplexityBot) appear not to run JavaScript at all, so raw HTML is all they see.

## 3. Checks

- **Status codes**
  - Homepage: serve content at `/`, or use a permanent redirect (301/308), not 302/307.
  - Missing records: a real 404, or 410 for removed ones; never a 200 "not found" page (soft 404).
  - Unknown paths: 404.
  - Backend down or slow: 503 with `Retry-After`, never a 200 error page and never a 404. A 404 tells Google the page is gone.
- **Titles, descriptions, H1s**
  - Unique per page, written in the words people search.
  - Flag descriptions shared across pages, titles longer than about 60 characters, and an H1 that differs from what the page is about.
- **Canonicals**
  - Self-referencing on indexable pages.
  - Canonical to the clean URL on pages with query-string state (filters, calculators, shareable links).
  - Never pointing at a redirect, a 404 or a noindex page.
- **Crawl paths**
  - Every indexable record page is reachable through real links within a few clicks.
  - Check the default sort order and pagination: real links, not "load more" buttons only.
  - Look for infinite URL spaces (filter combinations, calendars, search results pages). Those should be noindex, blocked, or not linked.
- **robots.txt**
  - Exists.
  - Doesn't block CSS or JS needed for rendering.
  - Includes a `Sitemap:` line with an absolute URL.
  - Show which AI bots it allows. Training bots (GPTBot, Google-Extended, ClaudeBot) are a separate decision from search and answer bots (OAI-SearchBot, Claude-SearchBot, PerplexityBot), and blocking the search ones keeps you out of AI answers.
- **sitemap.xml**
  - Exists and is valid.
  - Lists only canonical, indexable URLs with a 200 status.
  - `lastmod` is accurate or absent.
  - No sold, expired or deleted records.
- **noindex**
  - On admin, dev, design-system, logged-in-only, staging and preview pages.
  - Check that staging and preview deployments can't be indexed at all.
- **Rendering**
  - SSR vs client-only per template.
  - For each client-only template that should rank: what server-rendering it would cost (data needed, browser-only APIs, hydration risk).
- **Structured data**
  - Judge it only by whether it earns a visible rich result Google still shows for this page type. FAQ and HowTo results were mostly removed in 2023.
  - Check that it matches visible content.
- **Images**
  - The main (LCP) image isn't lazy-loaded.
  - Images that matter have `alt` text.
  - Open Graph image URLs are absolute (needed for link previews).
- **Speed (Core Web Vitals risk)**
  - Run Lighthouse on mobile settings for each template and report LCP, CLS and TBT (TBT is the lab stand-in for INP).
  - Report gzipped JS preloaded before first content paint.
  - Report data round-trips before the main content can paint.
  - Report build warnings about chunk size or code splitting.
  - Call these lab numbers. Field data (CrUX, Search Console) is what Google uses.
- **Internationalisation** (only if the site has languages or regions): hreflang with return links and x-default; no automatic IP redirects.

## 4. Decide what should rank

For each template, say whether it is:
- **a realistic search target**: why, and for which queries (inferred unless you have keyword data);
- **indexable but low value**; or
- **should stay out of the index**: noindex, or not linked.

Programmatic pages (one per record) are a risk if most of them are thin or short-lived; say so.

## 5. Deliverables

1. **Crawler table**: one row per sampled URL. Columns:
   - status and redirect chain
   - title
   - description (shared? yes/no)
   - canonical
   - robots
   - raw words / rendered words
   - H1 raw / rendered
   - in sitemap
   - inlinks
   - search target / low value / keep out
2. **Per-template assessment** with `file:line` for every claim.
3. **Ranked fix list.** Order by what each fix unblocks:
   1. stops pages being indexed wrongly or not at all
   2. wastes crawling or creates duplicates
   3. improves how results look and what they rank for
   4. speed

   For each fix give:
   - its size (small / medium / large)
   - the files it touches
   - **a check that proves it's fixed**: a curl command and expected output, or a rendered-page assertion I can rerun after the change
4. **Open questions and inferred items**: what needs the live site, real data, Search Console or keyword volume to confirm.

If the marketing-expert MCP server is connected, also run `crawl_site` on the local URL, `audit_page` with and without `render: true` on one URL per template, and `check_ai_crawler_access` with the repo's robots.txt. Compare their output with your own measurements, and report any disagreement.
