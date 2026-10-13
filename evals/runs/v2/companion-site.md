## Answer

**Short version:** Google and AI assistants can reach every page (robots.txt allows all bots), but they find almost nothing on them. Every page except the item page renders only in the browser (`ssr: false`), so the HTML a crawler downloads has 6 words of text, no `<h1>` and the same meta description on every page. Google may render the JavaScript later. ChatGPT, Claude and Perplexity's crawlers generally don't run JavaScript, so to them the site is an empty menu. Fix that first, starting with the two calculators. They are the pages most likely to rank, and they cost the least to server-render.

**Setup note:** companion.example is blocked from my sandbox. I tested the production build of the same code running locally at http://127.0.0.1:4173/. The API and database weren't running there, so item pages and search results were empty, and `/sitemap.xml` returned 503. That 503 comes from the local setup, not from a bug. Anything that depends on data or on production settings is marked **check on production**.

### What I measured

| URL | Status | Words in raw HTML / after JavaScript | H1 in raw HTML | Notes |
|---|---|---|---|---|
| `/` | **307** → `/search` | – | – | temporary redirect (`routes/index.tsx:4-7`) |
| `/search` | 200 | 6 / 82 | none (rendered: "Search GameX items for trade") | 93% of the text needs JavaScript |
| `/ias-calculator` | 200 | 6 / 316 | none (rendered H1 is `sr-only`, `components/ias-calculator.tsx:528`) | 98% needs JavaScript |
| `/imbue-calculator` | 200 | 6 / 1,172 | none | 99% needs JavaScript |
| `/items/<missing id>` | **200** | 6 / 21 ("Couldn't load this item.") | none | a "soft 404" (a 200 page that says nothing is there); no `notFound()` anywhere in `src/routes` |
| `/watches`, `/admin`, `/design-system`, `/components` | 200 | 6 | none | **no noindex** |
| `/Search`, `/search?utm_source=x` | 200 | – | – | duplicate URLs, and no canonical tag on any page |
| `/nope` | 404 | – | – | correct |

- `crawl_site` found only 3 pages: `/search` and the two calculators. Item pages are linked only from search results, which are drawn in the browser (`components/ui/collection.tsx:94,144`). In raw HTML they can only be found through the sitemap.
- All pages share one meta description ("Search GameX items posted for trade…", `lib/page-title.ts:3`), including the calculators. Titles are short and generic ("IAS calculator · GameX Companion").
- `check_ai_crawler_access`: every AI search, training and user-fetch bot is allowed. That's fine for you. The local robots.txt had **no `Sitemap:` line** and pages had **no `og:image`**, because both depend on `VITE_SITE_URL` (`lib/page-title.ts:8`, `lib/sitemap.ts:44-50`). The Dockerfile makes the build fail when `VITE_API_BASE_URL` is missing, but not when `VITE_SITE_URL` is missing (`Dockerfile:7-8,31`). **Check on production** that `https://companion.example/robots.txt` has a Sitemap line and that `/sitemap.xml` returns 200.
- The code contradicts itself: `routes/robots[.]txt.ts:5-6` says "Private pages opt out with a noindex tag", but no route sets one.
- The item page is the one template that loads data on the server (`ssr: "data-only"`, `items.$id.tsx:27`). Its title, description and preview image are therefore in the HTML, which is good for Discord link previews. Its body is still drawn only in the browser.
- I did not run Lighthouse, so I have no speed numbers. `/search` preloads 20 JS files before it shows anything, which is worth measuring.

### Who this is for and what can rank

Assumptions, because I couldn't ask you:
- (a) This is a free hobby or side project, not a business seeking investment.
- (b) Search matters as a second way in. Discord is the main channel, and VISION.md says the site is "not a forced destination".
- (c) You have no Search Console or keyword data yet.

If you do have Search Console data, it should replace my guesses below.

What players currently use instead (my knowledge, **unverified**): d2jsp, TradeSite and fansite.example for trading, trade-channel searches inside Discord, PlannerSite and various breakpoint tables or calculators for IAS, and spreadsheets.

- **Calculators: realistic search targets.** People search things like "assassin ias calculator", "whirlwind ias breakpoints" or "gamex imbue odds" (inferred, no volume data). A summary can't replace a working tool, so these pages earn the click. This is the ranking opportunity the playbook points to (seo-and-ai-search, "tools, calculators": practitioner guidance).
- **`/search`: low value.** A search page with no results in its HTML has little to rank for.
- **Item pages: risky.** They are thousands of short-lived listings built from one template, and you haven't yet decided when an item leaves the market (VISION.md, open question 1). Pages like that can count as thin, low-value content. Google's spam policies cover them, and they can drag down how Google judges the whole site (seo-and-ai-search: Google's own guidance plus practitioner experience). Their real job is link previews in Discord, and that already works.
- **Watches, admin, resolve, design-system, components: keep out of the index.**

### Three fixes, in order

**1. Server-render the two calculators and give them their own titles and descriptions.** Size: medium. Files: `routes/ias-calculator.tsx:7`, `routes/imbue-calculator.tsx:7`, `components/ias-calculator.tsx:528`, `lib/page-title.ts`.
- **Why it works:** crawlers that don't run JavaScript start seeing 300–1,200 words of real content, and Google no longer has to wait to render the page. The calculators read static item data and only use `window` behind guards (`lib/use-media-query.ts:7,13`), so removing `ssr: false` should be cheap. Check that the server HTML matches the browser output so React doesn't throw hydration errors.
- **Also:** make the IAS H1 visible. Add a `<link rel="canonical">` pointing to the clean URL, because both calculators keep their settings in query parameters (`lib/ias-search-params.ts`).
- **Titles:** I checked these with `check_copy_limits`. "GameX Imbue Calculator: Charsi Imbue Odds by Level · GameX Companion" is 58 characters, which is fine. The IAS version came out at 64, so shorten it to about "Assassin IAS Calculator: WW & Trap Breakpoints". Add a one-paragraph plain-text explanation above each tool. AI assistants can quote it.
- **Test:** `curl -s https://companion.example/ias-calculator | grep -c '<h1'` should return ≥1. Running `audit_page` without render should show more than 200 words.
- **Metric:** Search Console impressions and clicks for the two URLs, plus AI referrals (chatgpt.com, perplexity.ai) in Umami.
- **Time box:** ship within 2 weeks, then judge after 8–12 weeks. Indexing is slow.
- **Stop or change:** if impressions are still near zero after 12 weeks, the problem is demand or competition, not rendering. Stop investing in SEO for these pages and put the effort into Discord and creators.
- **Timing:** ladder resets and patches drive tool searches (community-and-hobby-products, practitioner guidance), so ship before the next ladder season, not after.

**2. Stop wrong pages getting indexed.** Size: small. Files: `__root.tsx` or each route's `head`, and `items.$id.tsx`.
- **(a) noindex** on `/watches`, `/admin/*`, `/items/*/resolve`, `/design-system`, `/components`, `/create`, `/planner` and `/stash`. Or remove `/components` and `/design-system` from production builds. Today only the nav link is hidden outside DEV (`__root.tsx:234`).
- **(b) A real 404 for missing items.** Throw `notFound()` when the loader gets `null`, and return 410 ("gone") once items can be removed.
- **(c) Make `/` a 308** (permanent) instead of a 307, or serve the search page at `/`.
- **(d) Self-referencing canonical tags** on indexable pages. This also folds `/Search` and `?utm_` variants into one URL.
- **Test:** `curl -sI https://companion.example/items/does-not-exist | head -1` should show 404. `curl -s https://companion.example/watches | grep noindex` should match. `curl -sI https://companion.example/ | head -1` should show 308.

**3. Decide on purpose whether item pages are meant to rank.** Size: small to decide, large to do well.
- **My recommendation:** until item lifecycle exists, set `noindex` on item pages and drop them from the sitemap. Keep the server-side title and preview for Discord. Today the sitemap lists every item ever posted, up to 50,000 of them, with nothing filtering out sold items (`apps/api/src/routes/items.ts:28,202`).
- **Why:** this avoids filling the index with stale, thin pages.
- **When to revisit:** once sold or expired items drop out, server-render the item body and let live items back into the index.
- **Stop condition for keeping them indexed:** if you keep them, Search Console showing most item URLs as "Crawled – currently not indexed" means Google doesn't want them either.

**Also do** (minutes, not a ranked move):
- Make the build fail when `VITE_SITE_URL` is missing.
- Give each page its own description.
- Submit the sitemap in Google Search Console and Bing Webmaster Tools. Copilot uses Bing (ai-assistant-visibility: platform documentation).
- Check that your CDN or firewall doesn't block AI bots that robots.txt allows.

**Not yet:** llms.txt (no evidence assistants use it), FAQ or HowTo structured data (Google mostly stopped showing those rich results in 2023), and writing blog content.

**To confirm on production:**
- Is `VITE_SITE_URL` set (Sitemap line, og:image)?
- Does `/sitemap.xml` return 200, and how many URLs does it list?
- What does a real item's raw HTML contain?
- Do your CDN or firewall rules block bots?
- What do Search Console coverage and queries show?

If you want, I can save these facts as a business profile so later advice starts from them.

## Tool log

MCP commands (all run from /home/user/marketing-expert with the given env vars):

1. `node scripts/mcp.mjs instructions`: operating rules (context first, measure, at most three ranked moves, plain language). Followed them.
2. `node scripts/mcp.mjs tools`: tool list. Chose crawl_site, audit_page, check_ai_crawler_access, playbooks, check_copy_limits.
3. `node scripts/mcp.mjs prompts`: found `technical_seo_review`.
4. `node scripts/mcp.mjs prompt technical_seo_review '{"repo":"/home/user/gamex-companion","localUrl":"http://127.0.0.1:4173/"}'`: review checklist (inventory, raw vs rendered, status codes, noindex, canonicals, ranked fixes with checks). Used as the structure.
5. `call list_business_profiles '{}'`: `[]`, no stored profile. Worked from the repo plus labelled assumptions.
6. `call check_ai_crawler_access '{"url":"http://127.0.0.1:4173/","paths":["/","/search","/items/x","/ias-calculator"]}'`: all AI bots allowed; no sitemap in robots.txt; no llms.txt (not needed). Used in the AI-access finding.
7. `call crawl_site '{"url":"http://127.0.0.1:4173/","maxPages":100}'`: `/` 307 → `/search`; only 3 pages found; missing h1 ×3; duplicate description ×3; 6 words each; sitemap 503. Used in the table and the orphan finding.
8. `call audit_page '{"url":"http://127.0.0.1:4173/search"}'` and the same with `render:true`: 6 words raw / 82 rendered; no h1 or canonical raw; h1 appears only after JavaScript.
9. `call audit_page '{"url":"http://127.0.0.1:4173/ias-calculator"}'` and the same with `render:true`: 6 / 316 words; h1 only after JavaScript; no canonical.
10. `call audit_page '{"url":"http://127.0.0.1:4173/items/example-id"}'` and the same with `render:true`: 200 with "Couldn't load this item." (soft 404 locally, since there is no API); title "Item · GameX Companion".
11. `call audit_page '{"url":"http://127.0.0.1:4173/imbue-calculator","render":true}'`: 1,172 rendered words; h1 only after JavaScript.
12. `call audit_page '{"url":"http://127.0.0.1:4173/design-system"}'`: 200, no noindex.
13. `call audit_page '{"url":"http://127.0.0.1:4173/watches","render":true}'`: 200, sign-in prompt, no noindex.
14. `call get_playbook '{}'`: list of playbooks; picked community-and-hobby-products as the business-type playbook.
15. `call search_playbooks '{"query":"client-side rendering JavaScript AI crawlers raw HTML","limit":5}'`: ai-assistant-visibility checklist and crawler sections, seo-and-ai-search technical checklist (the source for "AI crawlers don't run JS", Bing/Copilot and CDN checks).
16. `call get_playbook '{"slug":"community-and-hobby-products"}'`: goal-first framing, base rates, ladder/patch timing, RMT rules. Used for the assumptions and timing.
17. `call search_playbooks '{"query":"programmatic pages thin listings expired soft 404 sitemap lastmod","limit":4}'`: marketplaces "SEO on supply pages" (noindex thin pages), crawl budget, pruning (404/410). Used for fix 3.
18. `call search_playbooks '{"query":"free tool calculator keyword search intent game","limit":3}'`: seo-and-ai-search "What to do" (tools and calculators win the click). Used for "what should rank".
19. `call check_copy_limits '{"platform":"serp",...}'`: proposed IAS title 64 characters (over 60), imbue title 58 OK, descriptions OK. Quoted in fix 1.

Supplementary checks (not MCP): `curl` against http://127.0.0.1:4173 for robots.txt (no Sitemap line), status codes of `/`, `/search/`, `/Search`, `?utm_source`, `/items/<missing>`, `/nope`, `/admin`, `/watches`, `/design-system` and `/components`, raw `/search` head, and `/sitemap.xml` (503).

Repo files read (/home/user/gamex-companion, read-only):
- VISION.md
- apps/app/package.json, vite.config.ts, server.mjs, Dockerfile (ENV/ARG lines), .github/workflows/ci.yml (grep only)
- apps/app/src/routes/: __root.tsx, index.tsx, search.tsx (head), items.$id.tsx, items.$id_.resolve.tsx, ias-calculator.tsx, imbue-calculator.tsx, watches.tsx, admin.tsx, _admin-only.tsx, components.tsx, design-system.tsx, robots[.]txt.ts, sitemap[.]xml.ts; grep over admin.*.tsx
- apps/app/src/lib/: sitemap.ts, page-title.ts, common-searches.ts (head), ias-search-params.ts (head), use-media-query.ts (grep)
- apps/app/src/components/: ias-calculator.tsx and imbue-calculator.tsx (grep for h1 and browser APIs), ui/collection.tsx (grep for item links)
- apps/api/src/routes/items.ts (sitemap endpoint)
- apps/app/public/ (listing: no robots.txt there; served by a route)
