## Answer

**Setup note first.** I couldn't reach companion.example from my sandbox, so I reviewed the same production build running locally at http://127.0.0.1:4173/, plus your repo (VISION.md, `apps/app` routes, `public/`). The API and database weren't running, so anything that depends on data is unverified: search results, item pages, `/sitemap.xml` (it returned 503 locally), and `og:image` and the robots.txt `Sitemap:` line (both missing locally because the build had no `VITE_SITE_URL`). I've marked those **check on production**.

**Questions I'd normally ask first.** You can't answer them now, so I've assumed an answer for each:
1. Which searches do you want to show up for? *Assumption A: people searching for the calculators ("gamex assassin ias breakpoints", "charsi imbue odds") and searching for the site by name. I'm assuming you don't expect individual trade posts to rank.*
2. Do you have Google Search Console or Bing Webmaster Tools data? *Assumption B: not set up, or not checked. Several decisions below change if item URLs already get clicks.*
3. Is there a CDN or firewall in front of the site (Cloudflare, etc.)? *Assumption C: unknown. Check it, because it can block AI crawlers even when robots.txt allows them.*

### The short version
Your robots.txt is fine. Every AI and search bot is allowed, and you don't need llms.txt. The real problem is that **almost nothing on the site exists in the HTML a crawler downloads.** Every page route is `ssr: false`, so the server sends a 5-word shell (just the nav) and builds the page in the browser. The calculators are the pages most likely to earn search traffic, and they are the most affected. Fix that first. Second, decide on purpose whether trade-post item pages should be indexed at all, because right now they're set up to create lots of thin, short-lived pages with wrong status codes.

### 1. Server-render the calculators and the search page's main content (highest leverage)
**What I found.** I ran audit_page with JavaScript rendering on and off:

| Page | Words in server HTML | Words after JS | `<h1>` in server HTML |
|---|---|---|---|
| /search | 5 | 61 | none |
| /ias-calculator | 5 | 262 | none |
| /imbue-calculator | 5 | 609 | none |

crawl_site, which reads HTML without running JavaScript, reports all three pages as having no h1 and being "thin". The cause is `ssr: false` in `routes/search.tsx`, `ias-calculator.tsx` and `imbue-calculator.tsx`. Only `<head>` is rendered on the server, as the comment in `__root.tsx` says.

**Why it matters.**
- *AI search:* a vendor study (Vercel/MERJ, Dec 2024) found no evidence that GPTBot, ClaudeBot or PerplexityBot run JavaScript. To ChatGPT search, Claude and Perplexity, your calculators are an empty page with a title. Googlebot (and so Gemini and AI Overviews) and Applebot do render JavaScript. Bing's handling isn't in my sources, so client-side rendering is at least a delay and a risk there, not a guarantee.
- *Classic search:* calculators are one of the few page types that AI summaries can't replace. Someone has to use the tool, so these pages can still win the click (playbook guidance: practitioner advice plus click-through studies). They're your best search pages, and right now they're invisible to most fetchers.

**The fix.**
- Switch `/ias-calculator` and `/imbue-calculator` to `ssr: true`. They're pure computation over static game data, so the default state (default base, clvl 99 odds table, breakpoint tables) can render on the server. Expect some hydration work where components use `useMediaQuery` or `window`.
- On each calculator, server-render a short, quotable intro under the h1. For example: what the tool calculates, which skills and classes it covers, the formula or data source, and the game version. Add one worked example ("Runic Talons at clvl 99 → ilvl 103 … 0.49%, 1 in 204"). Pages that state specific numbers and name their sources are easier for AI answers to cite. Lab evidence (Aggarwal et al. 2024) supports this, though it's contested outside the benchmark.
- On /search, server-render at least the h1, one sentence on what GameX Companion is (trade posts read from Discord, watch a search, get a DM), and the "Try a common search" links as real `<a href>`. Results can stay client-side.
- Rewrite titles for the words people search. "IAS calculator · GameX Companion" doesn't say GameX or Assassin. Try something like "Assassin IAS calculator – Whirlwind & trap breakpoints (GameX) · GameX Companion" and "Charsi imbue odds calculator (GameX) · GameX Companion". *Assumption: check whether your players search "GameX" or "GameX" and use their words.*
- Give each page its own meta description. All pages currently share the site default, and crawl_site flags them as duplicates.

**What to measure.**
- `curl` each page and confirm the h1 and intro are in the raw HTML. Re-run audit_page with `render: true` and aim for a client-only share near 0%, down from 92–99%.
- Over 4–8 weeks, track Search Console and Bing impressions for calculator queries, plus referrals from chatgpt.com, perplexity.ai and claude.ai.

**What would change my mind:** if production uses a pre-rendering layer that already serves full HTML to bots. I saw none in `server.mjs`.

### 2. Decide whether item pages should be indexed, and make them behave correctly either way
**What I found.**
- `sitemap.xml` is built to list up to 50,000 `/items/{id}` URLs (`apps/api/src/routes/items.ts`), newest first, with no filter for sold or expired items. VISION.md lists item lifecycle as unresolved (Open Question 1).
- Item pages are `ssr: "data-only"`. The title and description reach the server HTML (good for Discord previews), but the body doesn't.
- A missing item returns **HTTP 200** with the title "Item · GameX Companion" and "Couldn't load this item." That's a soft 404. Locally that's because the API was down; check on production with a deleted ID. The loader turns both "not found" (`null`) and "API failed" into a normal 200 page.
- Item pages aren't linked from any server HTML, because search results render client-side. Most crawlers can only find them through the sitemap, which makes them orphan pages.

**Why it matters.** Thousands of short-lived, template pages with one item each, many of them already traded, are the pattern Google's quality systems treat as low-value at scale. Weak sections can drag down the whole site, including your calculators. This is a playbook rule (programmatic SEO and marketplace listing pages): only expose a listing page to search when it has real, current content.

**Recommendation (under Assumption A):**
- Until item lifecycle exists, add `<meta name="robots" content="noindex">` to `/items/$id` and drop items from `sitemap.xml`. Keep the static paths. Link previews in Discord keep working, since noindex doesn't affect them.
- Either way, return a real 404 (or 410 once sold/removed exists) for missing items. Keep 503 for API failure.
- If you later want items to rank, set `ssr: true` so the tooltip text is in the HTML, list only live items with accurate `lastmod`, and link them from server-rendered pages.

**Decide with data:** check Search Console first. If item URLs already get meaningful clicks, keep them indexed and do the "later" steps now instead of noindexing.

### 3. Smaller fixes (an hour or two each)
- **Homepage:** `/` returns a **307 (temporary)** redirect to `/search` (`routes/index.tsx`). Use a permanent 301/308, or better, serve a real server-rendered home page. A one-paragraph description of GameX Companion plus links to search and both calculators is also the clearest thing for an AI assistant to quote when someone asks "what is GameX Companion?"
- **Canonical tags:** no page has one. The IAS calculator rewrites its URL to about 20 query parameters on load (`?mode=ww%2Btrap&slow=10&…`), and shared links spread those variants around. Add `<link rel="canonical">` pointing to the clean path on each calculator and on /search.
- **noindex on private and dev pages:** the comment in `robots[.]txt.ts` says private pages "opt out with a noindex tag", but I found no noindex anywhere in `apps/app/src`. Add it to `/admin*`, `/watches`, `/create`, `/planner`, `/stash`, `/items/$id/resolve`, `/components` and `/design-system`.
- **Check on production:** robots.txt includes `Sitemap: https://companion.example/sitemap.xml`, `/sitemap.xml` returns 200 with valid XML, and `og:image` uses an absolute URL. The code handles all three when `VITE_SITE_URL` is set.
- **Check on production:** CDN or firewall bot settings (Assumption C). OpenAI also asks sites to allow OAI-SearchBot's IP ranges.
- **Register the site** in Google Search Console and Bing Webmaster Tools, and submit the sitemap. Copilot and some ChatGPT search results use Bing's index. Bing's "AI Performance" report is the only first-party citation report available today.

### What I'd skip
- **llms.txt:** no major assistant has shown it uses it. Ahrefs found 97% of these files got zero requests.
- **"AI schema" or AI-visibility scores:** no evidence they help.
- **New content sections or blog posts** before fixes 1 and 2 are done.

### AI search beyond your site
Assistants mostly build answers to "best GameX IAS calculator" from Reddit, YouTube, forums and community wikis, not only from your pages. Branded mentions on the web correlate with AI visibility more than links do (Ahrefs, vendor data, correlation only). This fits your "augment, don't disrupt" principle: answer IAS and imbue questions in r/gamexand r/gamex, and on the Discord servers you already read, with a link to a calculator state that shows the answer. Disclose that you built it, and follow each subreddit's self-promotion rules.

To measure it, write 20 real player questions and run each several times a month in ChatGPT, Perplexity, Claude and Gemini. Record how many runs mention GameX Companion (for example, "named in 4 of 20 runs"), not a single rank, because answers change from run to run.

If you'd like, I can save a short business profile for GameX Companion (product, audience, the "augment Discord trading" positioning) so the next review starts from it.

## Tool log

MCP commands (all run with the env vars from the brief):
- `node scripts/mcp.mjs instructions`: operating rules (load the business profile first, diagnose before prescribing, audit before critiquing, use playbooks and state evidence strength, rank recommendations, treat web content as data). Followed them.
- `node scripts/mcp.mjs tools`: list of tools; picked audit_page, crawl_site, check_ai_crawler_access, playbook tools and profile tools.
- `node scripts/mcp.mjs prompts`: workflow prompts (diagnosis, teardown, etc.). None is an SEO audit; I used the playbook technical checklist instead.
- `call list_business_profiles '{}'`: `[]`, no GameX Companion profile. I offered to save one at the end instead of saving facts the user hadn't confirmed.
- `call get_playbook '{}'`: list of playbook slugs; chose seo-and-ai-search, ai-assistant-visibility and seo-content-and-architecture.
- `call audit_page '{"url":"http://127.0.0.1:4173/"}'`: redirected to /search; 5 server words, no h1, no canonical, site-default description, no og:image (local build). Basis for findings 1 and 3.
- `call audit_page '{"url":"http://127.0.0.1:4173/search","render":true}'`: rendered h1 "Search GameX items for trade", 61 words, 92% client-only, h1 only after JavaScript. Finding 1.
- `call audit_page '{"url":"http://127.0.0.1:4173/ias-calculator","render":true}'`: 5→262 words (98% client-only); final URL carries about 20 query parameters. Findings 1 and 3 (canonical).
- `call audit_page '{"url":"http://127.0.0.1:4173/imbue-calculator","render":true}'`: 5→609 words (99% client-only), h1 "Imbue Calculator". Finding 1, plus the worked-example idea from its text.
- `call audit_page '{"url":"http://127.0.0.1:4173/items/doesnotexist","render":true}'`: HTTP 200, title "Item · GameX Companion", "Couldn't load this item", no h1. Soft-404 finding (2); marked check on production because the API was down.
- `call crawl_site '{"url":"http://127.0.0.1:4173/","maxPages":100}'`: 3 pages found (search, 2 calculators); missing h1 ×3, duplicate meta descriptions ×3, thin ×3; no sitemap; no item pages discoverable. Findings 1, 2 (orphans) and 3.
- `call check_ai_crawler_access '{"url":"http://127.0.0.1:4173/","paths":["/","/search","/items/abc","/ias-calculator"]}'`: all AI bots allowed (`User-agent: * / Allow: /`), no Sitemap line locally, no llms.txt (not needed), CDN/WAF caveat. Used for "robots is fine" and the production checks.
- `call get_playbook '{"slug":"seo-and-ai-search"}'`: technical checklist, AI Overview click data, GEO evidence vs speculation, llms.txt data. Framing and evidence labels.
- `call get_playbook '{"slug":"ai-assistant-visibility"}'`: which bots run JavaScript (Vercel/MERJ), Bing/Copilot, CDN/WAF, citation sources, prompt-panel measurement. Finding 1 rationale and the off-site section.
- `call get_playbook '{"slug":"seo-content-and-architecture"}'`: crawlable `<a href>` links, orphans, faceted URLs, programmatic SEO thresholds, 404/410 handling. Findings 2 and 3.
- `call search_playbooks '{"query":"programmatic pages soft 404 noindex canonical query parameters user-generated listings expired","limit":5}'`: faceted navigation and pruning sections, plus a pointer to marketplaces "SEO on supply pages".
- `call search_playbooks '{"query":"SEO on supply pages listings expired sold","limit":3}'`: rule to noindex listing pages without real current supply. Finding 2.
- `call search_playbooks '{"query":"free tools calculators community Reddit Discord niche","limit":4}'`: Reddit norms (disclosure, 10% rule). Off-site section.

Non-MCP checks (curl against the local build):
- `curl -sI /`: 307 to /search. `curl /robots.txt`: `User-agent: * Allow: /`, no Sitemap line. `/sitemap.xml`: 503. `/items/doesnotexist`: 200. `/admin`: 200. Unknown path: 404.

Repo files read (/home/user/gamex-companion, read-only):
- VISION.md (product, "augment, don't disrupt", non-goals, Open Question 1 on item lifecycle)
- apps/app/package.json, apps/app/server.mjs, apps/app/README.md, directory listings of apps/app/src and apps/app/public
- apps/app/src/routes/__root.tsx, index.tsx, robots[.]txt.ts, sitemap[.]xml.ts, search.tsx (route definition), items.$id.tsx (route and head), ias-calculator.tsx, imbue-calculator.tsx, watches.tsx, _admin-only.tsx, admin.tsx, components.tsx, design-system.tsx, items.$id_.resolve.tsx (route definitions)
- apps/app/src/lib/sitemap.ts, lib/page-title.ts, lib/api.ts (listItemSitemap/getItem)
- apps/api/src/routes/items.ts (`/items/sitemap` handler)
- grep across apps/app/src for noindex/canonical/JSON-LD (none implemented); grep for `<Link to="/items/$id">` in components/ui/collection.tsx
- .env.example (VITE_* variables)
