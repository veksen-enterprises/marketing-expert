## Answer

**Short version:** Google and AI assistants see an almost empty page on every URL of GameX Companion. Every page sends a crawler 9 words of server HTML (the nav bar) and no H1; the real content appears only after JavaScript runs. Google renders JavaScript later, so it can still index you slowly. Most AI crawlers (GPTBot, ClaudeBot, PerplexityBot) don't run JavaScript, so to them GameX Companion has no content at all. robots.txt is not the problem: it allows every bot. Fix rendering on the two pages that can win searches (the IAS and imbue calculators) before anything else.

I checked the production build of your repo running locally, not companion.example itself (blocked from my sandbox). It had no API behind it, so item and search pages showed error or empty states.

**What I measured**
- `/search`, `/ias-calculator`, `/imbue-calculator`, `/items/:id`: server HTML has 9 words and no H1. After rendering: 89, 341, 1,193 and (item, no API) 25 words. Cause: `ssr: false` on each page route (`ias-calculator.tsx:7`, `imbue-calculator.tsx:7`, `search.tsx:120`); item pages use `ssr: "data-only"` (`items.$id.tsx:27`), so they get a title and description but no body.
- All three public pages share one meta description (`__root.tsx:45`). No page has a canonical tag.
- `/` returns a **307** (temporary) redirect to `/search` (`index.tsx:5`). `/search/` also returns 307; `/SEARCH` returns 200 (a duplicate URL).
- `/items/does-not-exist` returns **200**, with the title "Item · GameX Companion". `items.$id.tsx:46` gives a missing item the same generic head and never returns a 404. Google calls this a "soft 404".
- robots.txt allows all bots but has **no Sitemap line**, and `og:image` was missing. Both depend on `VITE_SITE_URL` (`page-title.ts:8`, `sitemap.ts:16,46`). The Dockerfile marks it optional (`Dockerfile:5-8`), and I found nothing else in the repo that sets it. If production doesn't set it, `/sitemap.xml` returns 404 and Discord link previews have no image.
- The comment at `robots[.]txt.ts:5-6` says "Private pages opt out with a noindex tag". I found no noindex anywhere in `apps/app/src`. `/admin`, `/watches`, `/design-system` and `/components` all return 200 with no noindex. These docs and the code disagree.
- Speed: the raw HTML of `/search` loads about 413 KB of gzipped JavaScript (about 1.3 MB unzipped) before anything shows. I did not run Lighthouse, so I have no lab speed scores.

**Assumptions (labelled)**
- A1: This is a hobby or side project with no revenue goal. The repo has no pricing.
- A2: Production uses the same build as the local one, plus the env vars from the Dockerfile.
- A3: Most of your users arrive from Discord, not search. Your vision says "not a forced destination", so search is a second way in, not the main one.
- A4: People search for "gamex ias calculator", "assassin ias breakpoints" and "imbue calculator". This is inferred; I have no keyword data. The competitors for those searches would be PlannerSite's GameX planner and older breakpoint calculators. For trading searches, they would be TradeSite, d2jsp and fansite.example (unverified, from my own knowledge).

If A3 is wrong and search already brings real traffic, the order stays the same but the payoff is bigger.

**Three moves, in order**

1. **Check the live site and register it with search engines (small).** Run `curl -s https://companion.example/robots.txt` and `curl -sI https://companion.example/sitemap.xml`. Then add the sitemap in Google Search Console and Bing Webmaster Tools. (Copilot answers from Bing's index.)
   - *Why:* without `VITE_SITE_URL` you have no sitemap, no Sitemap line and no preview image.
   - *Test:* robots.txt shows `Sitemap: https://companion.example/sitemap.xml`, and the sitemap returns 200 with XML.
   - *Metric:* Search Console "indexed pages" count. *Time box:* this week.
   - *Stop:* if both checks already pass, skip this move.

2. **Server-render the IAS and imbue calculators (medium).** Remove `ssr: false` from both routes.
   - *Why:* these two pages answer searches a summary can't replace. The SEO playbook says to go for tools and calculators where you can still win the click.
   - *Cost:* the calculators work only from item data, with no API calls. I found no `window`, `localStorage` or `document` use in `ias-calculator.tsx` or `imbue-calculator.tsx`. The child components may differ, and the URL-based settings could cause a mismatch when the page loads in the browser, so test that.
   - *Check:* `curl -s https://companion.example/ias-calculator | grep -c "<h1"` returns 1 or more, and the raw HTML has more than 300 words.
   - *Metric:* Search Console impressions and clicks for calculator searches, plus visits referred by chatgpt.com, perplexity.ai and claude.ai. *Time box:* 8 weeks after it is indexed.
   - *Stop:* if there are still almost no impressions after 8 weeks, the problem is demand or competition, not rendering. Stop spending effort on search.
   - *What would prove me wrong:* Search Console's URL Inspection already shows the full calculator text, and the pages already rank. Then this move matters only for AI assistants.

3. **Return a real 404 (or 410 for removed items) when an item doesn't exist (small).** In `items.$id.tsx`, throw `notFound()` when the loader gets `null`.
   - *Why:* 200 "gone" pages waste crawling and can be indexed as empty pages. Item lifecycle is open question 1 in VISION.md, and the API sitemap lists every item with no sold or expired filter (`apps/api/src/routes/items.ts:202-206`).
   - *Check:* `curl -o /dev/null -w "%{http_code}" https://companion.example/items/does-not-exist` returns 404.
   - *Time box:* one week. *Stop:* nothing to stop; this is a fix, not a test.

**Small fixes to do alongside (one line each)**
- Give each page its own description and a self-referencing canonical tag, with the calculators pointing to their clean URL. The calculators rewrite the URL with about 20 settings.
- Make `/` a 308 (permanent) redirect instead of 307.
- Put noindex on admin, watches, resolve, design-system and components. The robots.txt comment already promises this.
- Retitle the IAS page "Assassin IAS calculator" to match its H1.

**What not to do yet**
- llms.txt: the playbook says 97% of llms.txt files got zero requests (Ahrefs, vendor data).
- FAQ or other structured data.
- Blocking AI bots.
- Server-rendering search or item pages, which need the API and are worth little in search (about 141 items in production per ADR 0006).
- Mass item pages for search ("programmatic SEO"): Google treats thin, short-lived pages as low-value content.
- A blog, or paid ads.

**Timing.** Players look for new tools and builds around new ladder seasons and patches (practitioner rule of thumb). Season 13 started with the expansion on 20-21 Feb 2026, according to the repo's knowledge notes. Ship move 2 before the next season. I didn't verify its date.

**How strong the evidence is.** "AI crawlers don't run JavaScript" comes from a Vercel/MERJ study (Dec 2024, vendor data). The click-rate figures in the SEO playbook are "largely from search snippets", and the community playbook's sources are "all read via search snippets". The bot rules come from platform documentation. Everything about rendering and status codes, I measured myself.

**Open questions**
1. Is `VITE_SITE_URL` set in production? Is `VITE_CALC_ONLY` set? (If it is, `/` goes to the calculator and the nav changes.)
2. Do you have Search Console access? What queries and pages does it show?
3. What is your goal: hobby, covering costs, or more?
4. Does a CDN or firewall (for example Cloudflare bot blocking) sit in front of the site?
5. When should a sold item's page disappear?

I can save these facts as a business profile once you confirm them.

## Tool log

MCP calls (in order; env MARKETING_EXPERT_DATA_DIR=evals/data/v4-companion-site, ALLOW_PRIVATE=1, CHROMIUM set):
1. `instructions`: server rules read (context first, measure, playbooks, at most 3 moves, check_answer before sending).
2. `tools` / `prompts`: listed 24 tools and 11 prompts, including technical_seo_review.
3. `call list_business_profiles {}`: `[]`, no stored profile.
4. `prompt technical_seo_review {"repo":"/home/user/gamex-companion","localUrl":"http://127.0.0.1:4173/"}`: returned the review checklist (inventory, raw vs rendered, status codes, canonicals, robots, sitemap, noindex, ranked fixes with checks).
5. `call scan_source {"dir":"/home/user/gamex-companion/apps/app/src"}`: 118 files; 31 data, 0 price, 19 availability, 6 setup, 30 proof hits (mostly code comments, no public data-handling claims). Env flags: VITE_API_BASE_URL, VITE_CALC_ONLY, VITE_SITE_URL, VITE_UMAMI_URL, VITE_UMAMI_WEBSITE_ID, all affecting output.
6. `call scan_source {"dir":"/home/user/gamex-companion/docs"}`: 11 files; 18 data hits (ADR storage notes), 3 proof hits (ADR 0006: 25 duplicate rows, 18% of rare/crafted), no env flags.
7. `call audit_page {"url":"http://127.0.0.1:4173/ias-calculator"}`: 200, title "IAS calculator · GameX Companion", no H1, 9 words, no canonical, no og:image, shared description.
8. `call audit_page {"url":"http://127.0.0.1:4173/ias-calculator","render":true}`: H1 "Assassin IAS calculator", 9 to 341 words (97% client-only), scripts rewrite the URL with about 20 query params, so a canonical is needed.
9. `call audit_page {"url":"http://127.0.0.1:4173/search"}`: 200, no H1, 9 words, no canonical.
10. `call audit_page {"url":"http://127.0.0.1:4173/search","render":true}`: H1 "Search GameX items for trade", 9 to 89 words (90% client-only), 8 internal links rendered vs 4 raw (common-search links), "Search failed" state (no API).
11. `call audit_page {"url":"http://127.0.0.1:4173/imbue-calculator"}`: 200, no H1, 9 words.
12. `call audit_page {"url":"http://127.0.0.1:4173/imbue-calculator","render":true}`: H1 "Imbue Calculator", 9 to 1,193 words (99% client-only).
13. `call audit_page {"url":"http://127.0.0.1:4173/items/1"}`: 200, title "Item · GameX Companion", no H1, 9 words.
14. `call audit_page {"url":"http://127.0.0.1:4173/items/1","render":true}`: 25 words, "Couldn't load this item." error state shown with status 200 (no API).
15. `call crawl_site {"url":"http://127.0.0.1:4173/","maxPages":50}`: start 307 to /search (temporary-redirect note); 3 pages crawled (search, ias, imbue), all client-rendered (9 words); duplicate meta description on all 3; sitemap 503; 0 sitemap URLs; item pages not reachable by links.
16. `call check_ai_crawler_access {"url":"http://127.0.0.1:4173/","paths":["/","/search","/ias-calculator","/imbue-calculator","/items/1"]}`: robots.txt found; no bots blocked (training, search or user); no Sitemap line; no llms.txt (tool says not a problem); CDN/WAF caveat.
17. `call get_playbook {}`: listed playbooks; chose community-and-hobby-products as the business-type playbook.
18. `call search_playbooks {"query":"JavaScript rendering AI crawlers server-side rendering","limit":5}`: ai-assistant-visibility checklist and crawler sections (Vercel/MERJ Dec 2024 [vendor]: GPTBot, ClaudeBot and PerplexityBot don't run JS); seo-and-ai-search technical checklist.
19. `call get_playbook {"slug":"community-and-hobby-products"}`: goal-first advice, time launches to the game calendar (patches, ladder resets) [practitioner]; sources "All read via search snippets."
20. `call get_playbook {"slug":"seo-and-ai-search"}`: target tool/calculator intents; llms.txt has no evidence (Ahrefs: 97% of files got zero requests); technical checklist; "Figures largely from search snippets".
21. `call search_playbooks {"query":"programmatic pages thin listings expired soft 404 canonical query parameters","limit":4}`: faceted-navigation guidance; programmatic pages need real unique supply, otherwise noindex [practitioner].
22. `call check_answer {draft}`: 1,167 words; flagged "CTR" unexplained. Fixed it, but the shared scratchpad copy had been overwritten by another process, so I rewrote the draft to a unique path.
23. `call check_answer {draft, 2nd run}`: flagged "HN". This was run on the overwritten foreign file, not my draft, so I disregarded it.
24. `call check_answer {final draft}`: 1,167 words, no problems.

Shell checks (curl, against http://127.0.0.1:4173 only):
- Status sweep: `/` 307 to /search; /search, /ias-calculator, /imbue-calculator, /items/1, /items/does-not-exist, /watches, /admin, /create, /planner, /stash, /design-system, /components and /items/1/resolve all 200; /nope 404; /robots.txt 200 (23 bytes); /sitemap.xml 503; /llms.txt 404; /search/ 307; /SEARCH 200; /index.html 404; ?utm_source 200.
- `curl /robots.txt | cat -A`: `User-agent: *` / `Allow: /` only.
- Head extraction per page (grep title/meta/canonical/h1): shared description everywhere; no canonical, no robots meta, no H1 in raw HTML; /items/does-not-exist has title "Item · GameX Companion" but og:title "GameX Companion".
- `curl -I` with gzip: content-encoding gzip, no X-Robots-Tag.
- Python body word count: 11 whitespace tokens (nav only, including "[" and "]") on /search, /ias-calculator, /imbue-calculator and /items/1. This matches the tool's 9 words. 4 `<a>` links.
- Googlebot UA on /search: 200, same size (7407 bytes), so no bot-specific serving. GPTBot UA on /: 307.
- Asset sizes: 20 JS files referenced by /search raw HTML, about 413 KB gzipped total (index 183 KB, format-modifier 85 KB, select 38 KB…), CSS 13.5 KB gzipped. Lighthouse not run.

Repo files opened (/home/user/gamex-companion, read-only; nothing modified):
- VISION.md, CONTEXT.md, README.md, apps/app/README.md, apps/app/server.mjs, apps/app/vite.config.ts, apps/app/package.json (head), apps/app/Dockerfile (head 40)
- apps/app/src/routes/__root.tsx, index.tsx, robots[.]txt.ts, sitemap[.]xml.ts, ias-calculator.tsx, items.$id.tsx (lines 1-140)
- apps/app/src/lib/sitemap.ts, lib/page-title.ts
- docs/adr/* (first 5 lines each), docs/adr/0006-item-identity-is-global-and-versioned.md (lines 1-30)
- knowledge/warlock-expansion.md (first 25 lines)
- apps/api/src/routes/items.ts (sitemap endpoint, around lines 28-31 and 202-219)

Searches run:
- `ls` of repo root, docs, docs/adr, apps, apps/app, apps/app/public, src, src/routes, knowledge, research; `git status --short` (pre-existing changes only)
- grep in route files for createFileRoute/ssr/head/noindex/canonical/title/meta (search, items.$id, items.$id_.resolve, ias, imbue, watches, _admin-only, admin, components, design-system)
- `grep -rni "noindex|canonical|robots|ld+json"` in apps/app/src: no noindex or canonical found
- `grep -rn VITE_SITE_URL|VITE_CALC_ONLY|VITE_API_BASE_URL` over the whole repo (excluding node_modules and dist): only source, tests and the Dockerfile; nothing sets VITE_SITE_URL
- grep for `to="/items/$id"` and `navigate(` in app src; COMMON_SEARCHES in search.tsx; listItemSitemap in lib/api.ts
- grep "sitemap" in apps/api/src
- grep window/localStorage/document/matchMedia in components/ias-calculator.tsx and components/imbue-calculator.tsx: none found
- `git log -S"ssr: false"` on ias-calculator.tsx
- grep ladder/season in knowledge/ and research/
