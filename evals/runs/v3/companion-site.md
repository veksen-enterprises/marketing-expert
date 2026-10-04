## Answer

**Short version.** Google and AI assistants see almost nothing of GameX Companion. Every public page sends crawlers the same 9-word shell: the nav bar, no H1 (main heading), and the same meta description. The real content (search, the IAS and imbue calculators, item pages) is built in the browser. Google may render it later. Most AI crawlers (GPTBot, ClaudeBot, PerplexityBot) don't run JavaScript, so for them the calculators are empty. Meanwhile the pages that should stay out of search (admin, design system, logged-in pages, missing items, probably staging) can all be indexed. Fix those two things first. Speed and structured data can wait.

I checked the production build of the app running locally, not companion.example itself, and it had no API or database behind it. Anything that depends on live data or your production settings is marked **inferred**.

**Assumptions (labelled, since I couldn't ask you):**
- A1. This is a hobby or side project. Growth comes mainly from Discord servers (VISION.md: "augment, don't disrupt"). Search is a supporting channel, not the main one. If you want a business, the order of the moves stays the same, but search becomes more important.
- A2. Your realistic search targets are the two calculators: queries like "d2r assassin ias calculator" and "charsi imbue odds" (**inferred**, I have no keyword data). Item pages are a long tail, and a risky one (see move 3).
- A3. People who search for these tools today use, unverified: plannersite.example's GameX planner, fansite.example, TradeSite and d2jsp for trading, and the Discord trade channels themselves.

### What I measured

- Every page returns 9 words of server HTML and no H1. Rendered in a browser, the same pages have 89 words (/search), 341 (/ias-calculator) and 1,193 (/imbue-calculator). That means 90–99% of the text exists only after JavaScript runs (audit_page render=true). The cause is `ssr: false` (browser-only rendering) on search.tsx:120, ias-calculator.tsx:7 and imbue-calculator.tsx:7.
- The meta description is the same on every page (__root.tsx:45, crawl_site "duplicate-descriptions"). No page has a canonical tag (the tag that names the preferred URL). The H1 "Assassin IAS calculator" is more specific than the title "IAS calculator".
- Nothing in the app sets noindex (the tag that keeps a page out of search). I searched apps/app/src and found no noindex, X-Robots-Tag or canonical. /admin, /create, /planner, /stash, /watches, /design-system and /components all return 200 with no noindex. That contradicts the comment in robots[.]txt.ts:5-6 ("Private pages opt out with a noindex tag"). A route-level tag wouldn't reach crawlers anyway for these routes: the server stops building `<head>` at the first `ssr: false` route (__root.tsx:75-78).
- Missing items return **200**: /items/00000000-… shows "Couldn't load this item." Google calls this a "soft 404" (an error page served as if it were real). The sitemap API lists every item ever stored, newest first, with no sold or expired filter (apps/api/src/routes/items.ts:236-241). VISION.md:128 leaves item lifecycle as an open question.
- **Contradiction:** VISION.md:64-65 says "The owner is anonymous until contacted." Item pages show "Owned by <Discord display name>" with the avatar (items.$id.tsx Provenance, around lines 249-303), and the sitemap submits those pages to search engines.
- `/` redirects to /search with a temporary **307**, which should be a permanent 301/308. /SEARCH also returns 200 as a duplicate page.
- robots.txt allows every AI bot, which is right for being cited (check_ai_crawler_access). The local robots.txt has no `Sitemap:` line and no og:image, because the build lacks `VITE_SITE_URL`. The Dockerfile marks that variable "Optional", and I found no value for it in the repo. Whether production sets it is **inferred**.
- Speed (lab, local, unthrottled, not Lighthouse): the H1 appears at about 0.5 s. Each page loads about 400 KB of gzipped JavaScript before it shows anything. On mid-range phones that is a real risk, but a later one.

### Three moves, in order

**1. Take private and junk pages out of search with one server rule.** In server.mjs, add an `X-Robots-Tag: noindex` header for /admin*, /create, /planner, /stash, /watches, /design-system, /components and /items/*/resolve. Send the same header on every response from staging.companion.example (that host name appears in .claude/skills/debug-capture/SKILL.md:20).
- Why: a header reaches crawlers even where the browser-only routes never render a tag. Staging is a full copy of the site, so if it gets indexed it competes with production.
- Test: `curl -sI https://companion.example/admin | grep -i x-robots-tag` should print `noindex`, and /search should not.
- Metric: the Search Console "Pages" report, using a `site:` search for these URLs. Time box: 2–4 weeks.
- Stop condition: none. This is hygiene. Small change, one file.

**2. Server-render the two calculators, and give each its own title and description.** Remove `ssr: false` from ias-calculator.tsx and imbue-calculator.tsx. Give each a description that says what it calculates, for example "Assassin IAS breakpoints for claws and Whirlwind in GameX". Add a canonical pointing at the clean URL, because the IAS calculator rewrites the address with about 20 query parameters on load.
- Why: these are the pages a searcher or an AI assistant could actually cite, and today they send 9 words. Cost looks small (**inferred**). I found no top-level `window` or `localStorage` use in components/ias-calculator.tsx or imbue-calculator.tsx; the address rewrite runs inside a `useEffect` (line 393), so it doesn't run on the server. Hydration (the browser taking over the server-rendered page) still needs testing.
- Test: `curl -s https://companion.example/imbue-calculator | grep -c '<h1'` returns 1, and the raw HTML has more than 300 words.
- Metric: Search Console impressions and clicks for calculator queries, plus referrals from chatgpt.com and perplexity.ai in Umami.
- Time box: 8–12 weeks after indexing. Stop condition: if impressions don't rise after a full recrawl, the demand isn't there. Don't server-render the rest of the site for search.
- Timing: ship it before the next ladder reset, when players look for tools again. Season 13 started with the Warlock expansion in Feb 2026 (knowledge/warlock-expansion.md). I don't know the next reset date.

**3. Keep item pages out of the index for now.** Add `noindex` to /items/* and drop items from sitemap.xml. Keep /search, /ias-calculator and /imbue-calculator in the sitemap.
- Why: the item pages, as they stand, are browser-rendered and short-lived, with no defined way to retire sold items. They return 200 when an item is missing, and they publish Discord names your own vision says stay anonymous. Google's spam policies treat masses of thin pages built from a template as low value. The playbook says such pages only work with "real, unique supply" and recommends noindex until there is enough [practitioner].
- Shared links keep working: the Discord preview comes from og tags, not from indexing.
- Test: `curl -s https://companion.example/sitemap.xml | grep -c /items/` returns 0.
- Revisit when item lifecycle is defined, the owner display is decided, and missing items return a real 404/410.

### What not to do yet

- llms.txt: check_ai_crawler_access says there is no evidence that major assistants use it.
- Structured data (schema markup) and FAQ markup: Google no longer shows FAQ rich results for most sites.
- Blocking AI training bots by accident: it's a separate decision from the search bots.
- A blog, or bulk pages per affix or per item.
- Lighthouse tuning before moves 1–2.
- Don't rely on SEO to replace Discord moderators as your main channel. The playbook ("Community and hobby products", sources "All read via search snippets") treats moderators and shareable outputs as the main growth loop [practitioner].

**What would prove this wrong:** Search Console shows the calculators already indexed with their full text and getting impressions. That would mean Google's rendering is enough, and move 2 matters only for AI assistants.

**Small items, one line each:** `/` should use 308 instead of 307 (index.tsx). The search page's H1 is screen-reader-only (search.tsx:437). Source maps are publicly served (/assets/*.js.map returns 200). Leftover `console.log` at ias-calculator.tsx:388.

### Open questions

1. Is `VITE_SITE_URL` set in the production build? Run `curl https://companion.example/robots.txt` and check for a `Sitemap:` line.
2. Is staging.companion.example public, and is it indexed (`site:staging.companion.example`)?
3. Do you have Search Console and Bing Webmaster Tools set up? What do they show as indexed?
4. Is your goal hobby, side income or business (A1)?
5. Did posters and server admins agree to their names appearing on public, indexed pages?
6. Is a CDN or firewall in front of the site blocking AI bots? robots.txt alone doesn't tell.
7. When is the next ladder season?

I can save these facts as a GameX Companion business profile once you confirm them.

## Tool log

MCP (via `node scripts/mcp.mjs`, env as instructed), in order:
1. `instructions`: server rules (context first, diagnose, tools for numbers, playbooks, ≤3 moves, plain language).
2. `tools`: listed 22 tools.
3. `prompts`: listed 11 prompts incl. technical_seo_review.
4. `call list_business_profiles {}`: `[]`, no stored profile.
5. `prompt technical_seo_review {"repo":"/home/user/gamex-companion","localUrl":"http://127.0.0.1:4173/"}`: checklist: inventory, raw vs rendered, status codes, noindex, sitemap, ranked fixes with checks.
6. `call crawl_site {"url":"http://127.0.0.1:4173/","maxPages":100}`: `/` 307→/search; 3 pages crawled (/search, /ias-calculator, /imbue-calculator), all 9 server words ("client-rendered"), duplicate description on all 3; sitemap 503.
7. `call audit_page {"url":"http://127.0.0.1:4173/search"}`: 200, 9 words, no h1, no canonical, shared description, no og:image.
8. `call audit_page {"url":"http://127.0.0.1:4173/search","render":true}`: rendered 89 words, h1 "Search GameX items for trade" only after JS (90% client-only).
9. `call audit_page {"url":"http://127.0.0.1:4173/ias-calculator","render":true}`: 341 rendered words vs 9; h1 "Assassin IAS calculator"; URL rewritten with ~20 query params → suggests canonical.
10. `call audit_page {"url":"http://127.0.0.1:4173/imbue-calculator","render":true}`: 1,193 rendered words vs 9 (99% client-only); h1 "Imbue Calculator".
11. `call audit_page {"url":"http://127.0.0.1:4173/items/00000000-0000-0000-0000-000000000000","render":true}`: 200, "Couldn't load this item." (soft 404), no h1.
12. `call audit_page {"url":"http://127.0.0.1:4173/admin","render":true}`: 200, no noindex, title differs server "Admin" vs rendered "Bot parses".
13. `call audit_page {"url":"http://127.0.0.1:4173/design-system","render":true}`: 200, indexable, 1,486 rendered words, 2 h1s, "reachable by URL, not linked in the nav".
14. `call check_ai_crawler_access {"url":"http://127.0.0.1:4173/","paths":["/","/search","/ias-calculator","/items/x"]}`: all AI bots allowed (full bot list output).
15. `call check_ai_crawler_access {"url":"https://companion.example/","robotsTxt":"User-agent: *\nAllow: /\nSitemap: https://companion.example/sitemap.xml\n"}`: evaluated what robots[.]txt.ts would emit with VITE_SITE_URL set (inferred production); all allowed, sitemap found; notes CDN/WAF caveat.
16. `call check_ai_crawler_access` (same args as 14, re-run to read summary): no blocks; no Sitemap line; no llms.txt ("not a problem").
17. `call get_playbook {}`: playbook list; chose community-and-hobby-products as business type.
18. `call search_playbooks {"query":"client-side rendering JavaScript SEO AI crawlers server-side rendering","limit":5}`: seo-and-ai-search technical checklist; ai-assistant-visibility crawler section (AI crawlers don't run JS, Vercel/MERJ [vendor]).
19. `call get_playbook {"slug":"community-and-hobby-products"}`: goal-first, moderators as gatekeepers, consent for republishing member posts, game-calendar timing; sources "All read via search snippets".
20. `call search_playbooks {"query":"programmatic pages thin content soft 404 free tools calculators rank","limit":5}`: marketplaces "SEO on supply pages" (noindex until real supply), pruning options, faceted navigation guidance, "what to do" (tools/calculators win clicks).
21. `call audit_page {"url":"http://127.0.0.1:4173/ias-calculator"}`: 200, 9 words, no h1/canonical/robots.
22. `call audit_page {"url":"http://127.0.0.1:4173/items/00000000-0000-0000-0000-000000000000"}`: 200, 9 words, title "Item · GameX Companion".
23. `call audit_page {"url":"http://127.0.0.1:4173/admin"}`: 200, 9 words, robots null, X-Robots-Tag null.

Non-MCP checks (curl / local scripts, against http://127.0.0.1:4173 only):
- curl status/redirects for 23 paths: `/` 307→/search; /search/ 307→/search; /SEARCH 200; /index.html 404; unknown path 404; /sitemap.xml 503; /robots.txt 200 (`User-agent: * / Allow: /`, no Sitemap); all admin/private routes 200; /items/abc and /items/0000… 200.
- curl raw head/body parse of 7 pages: identical description, no canonical/robots, 11 whitespace tokens of body text (tools report 9; the difference is the "[" "]" around the logo). 0 h1.
- Googlebot UA vs default UA diff on /search: only timestamps differ (no bot-specific serving). GPTBot UA → 200.
- Headers: HTML gzipped when requested (server.mjs), no X-Robots-Tag.
- JS weight: ~409 KB (/search), ~416 KB (/ias-calculator), ~386 KB (/items) gzip-9 of referenced /assets/*.js; /assets/index-*.js.map served 200 (2.9 MB).
- Playwright (marketing-expert's playwright-core, 412px mobile viewport, unthrottled, local): h1 at 459/524/566 ms; FCP ~110 ms; LCP 432/516/556 ms; console errors are only refused API calls to localhost:3001.

Repo files opened (/home/user/gamex-companion): VISION.md, README.md, CLAUDE.md, AGENTS.md, CONTEXT.md (lines 1-120), docs/adr/0001-0007 (first 12 lines each), apps/app/README.md, apps/app/server.mjs, apps/app/package.json, apps/app/Dockerfile, apps/app/vite.config.ts, apps/app/src/routes/__root.tsx, robots[.]txt.ts, sitemap[.]xml.ts, index.tsx, items.$id.tsx (1-240, 284-320), ias-calculator.tsx (route), apps/app/src/lib/page-title.ts, lib/sitemap.ts, lib/api.ts (82-94), apps/api/src/routes/items.ts (195-250), apps/app/src/components/ias-calculator.tsx (388-402), .claude/skills/debug-capture/SKILL.md (15-25), knowledge/warlock-expansion.md (head).

Searches run: `ls` of repo, docs, apps/app, src/routes, knowledge, research; grep of every route for ssr/head/title/description/canonical/notFound; grep `VITE_|import.meta.env` in apps/app/src + vite.config.ts; grep `noindex|nofollow|X-Robots|canonical|application/ld+json|og:url` in apps/app/src, apps/api/src, packages/ui/src (no noindex/canonical found); grep item links (`/items/$id`) in routes/components; grep `VITE_SITE_URL|companion.example|IAS_ONLY` across repo configs (found only ci.yml dt.companion.example and staging.companion.example in .claude/skills; no VITE_SITE_URL value); grep `sitemap` in apps/api/src; grep DM sending in apps/bot/src and apps/api/src (bot.ts:75 `user.send`, internal-notifications route, so DM watch notifications are shipped); grep `window|localStorage|useEffect` in calculator components; `git log` (shallow clone, 1 commit).
