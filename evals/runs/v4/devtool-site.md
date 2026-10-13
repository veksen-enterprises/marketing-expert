## Answer

**Short answer.** Fix the claims before anything else. Your docs and decision records describe the current product: you paste a connection string, the platform stores it, starts the Collector and runs the analysis itself, and the MCP server, Slack/webhook alerts, rewrites and self-hosting are all documented. The marketing site still describes an older product. It tells people to `docker run` a container "with credentials you control", lists MCP and alerts as "soon", and gives two prices for Pro. Developers judging a database tool read the data claims first, and your own value is "proven, not guessed". After that, rewrite the homepage around what VISION.md says the product is.

**ChatGPT and Perplexity:** nothing in the repo blocks them. Whether they actually mention you, I could not check.

**How I reviewed it.** From source only. dbtool.example returned 403 to my sandbox, so I checked nothing live. The site doesn't build here, so I built the home and pricing HTML by hand from the `.astro` files. I assumed the app link is `https://cloud.dbtool.example`, left out GA, CSS, JS and React islands, and rendered no JavaScript. The real build may differ in those places.

## What I found

**Claims that contradict the docs** (most harmful first):
1. **Credentials.** `pricing.astro:364` says the container is one "you run, with credentials you control". The docs say the opposite: "The instance stores the string … There is no `docker run` command" (`guides/getting-started.md:18`) and "You do not start it" (`reference/analyzer.mdx:12`). The homepage steps (`index.astro:257–283, 495`) still show `docker run`.
2. **Rows.** `getting-started.astro:35` says it will "extract 10 sample rows per table". `pricing.astro:365` says "we never see your full rows", and `analyzer.mdx:38` says "Your rows never reach it."
3. **Parameters.** A tooltip at `pricing.astro:263` says "Parameter values aren't included". `analyzer.mdx:21` says query text "can contain … literal parameter values".
4. **Status.** The site marks the MCP server "(soon)" (`index.astro:412`, `pricing.astro:71`), but `guides/mcp-server.md` documents it as working. Alerts are "on our radar" (`index.astro:327`), but `alerts.md` shows Slack and webhook working; only email is "coming soon". Rewrites are "(soon)", but `how-optimization-works.md:55` describes them in CI. "Local-only mode" is on the radar, yet `guides/self-hosting.md` is a full self-host guide. ADRs 0023/0025 still say "not built", so docs and ADRs disagree.
5. **Price.** Pro is $20/month on the homepage (`index.astro:403`) and $16/mo on the pricing page (`pricing.astro:65`). The team plan is "shipping next" on one page and "Not yet" (`pricing.astro:399`) on the other.

**Positioning.** The homepage leads with PlanView and "see the queries your ORM is running". VISION.md says the product runs "as close to the developer as possible", and that the coding-agent (MCP) step is the cheapest place to catch a problem. The site hides that step under "soon". The hero example is Rails, and I found no Rails guide in `apps/docs/src` (the guides cover Drizzle, Prisma, TypeORM, MikroORM and EF Core). The comparison table leaves out the tools buyers probably compare you with: pganalyze, PgHero and Datadog Database Monitoring (my knowledge, not verified).

**Smaller items, one line each:**
- The marketing site has no robots.txt (the only one in the repo is `apps/app/public/robots.txt`).
- `apps/blog/Caddyfile:29` serves the homepage with a 200 status for any unknown URL, so search engines see "soft 404s". The docs Caddyfile does the same.
- There is no `og:image`, so shared links show no picture.
- `/getting-started` is out of date, and the homepage's "Docs" link points to it.
- Four of the six blog posts are from 2023, and none covers CI or agents.

## Three moves

**1. Rewrite every product, data and price claim to match the docs (this week).**
- Mechanism: one false data claim gives a security reviewer a reason to stop.
- What to change: setup becomes "paste a connection string". Say plainly what leaves the database: schema, query text that may contain literal values, and statistics with real sampled values. Offer self-hosting as the answer to "nothing leaves my network". Show one Pro price. Redirect `/getting-started` to the docs quickstart.
- Check: rerun scan_source until no claim conflicts with the docs.
- Metric: signup → connected database.
- Stop condition: this is a correction, so keep it whatever the metric does. If that rate hasn't moved after 4 weeks, the constraint is not trust.

**2. Rebuild the hero around the gates you've shipped: the coding agent and CI.**
- What: for example, "Catch slow Postgres queries before they merge, in your coding agent and in CI." Add a second call to action showing the one-line `claude mcp add` command, and use a Drizzle or Prisma example.
- Mechanism: agent users can try it in one command.
- Why no A/B test: at an assumed 3% conversion and 200 visitors a day, ab_test_sample_size needs 13,914 visitors per arm (about 140 days) to detect a 20% lift.
- Cheapest test: a 5-second test with 6–8 target developers. Can they say what it does and what they'd do next?
- Metric: the share of signups that connect MCP or CI within 7 days.
- Time box: 4 weeks.
- Stop condition: if fewer than half the testers can say what it does, change the headline. If activation is flat after 4 weeks, go back to the old emphasis.

**3. Measure AI visibility before doing any "AI SEO" work.**
- What: write 20 real buyer questions, such as "catch slow Postgres queries in CI" and "pganalyze alternatives". Each month, run each one 3 times in ChatGPT and in Perplexity while logged out. Record the mention rate and the cited sources. Also give a coding agent "my Postgres query is slow" in a clean repo.
- Mechanism: assistants build answers mostly from third-party pages (vendor data, "not re-verified").
- Time box: one hour, then monthly.
- Stop condition: if you are named in 0 runs after two rounds, the work is getting mentioned elsewhere (Hacker News launch posts, comparison posts, Reddit), not your site.

## Can ChatGPT and Perplexity find you?

I gave check_ai_crawler_access what your server returns at `/robots.txt`, which is the homepage HTML. The tool found "no rules", so every bot is allowed: OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User and GPTBot. Unchecked: your CDN or firewall bot settings, Bing indexing, and whether either assistant names you. Small fix: add a real `robots.txt` with a `Sitemap:` line, and return real 404s.

## What not to do yet

No paid ads, no redesign, and no A/B tests at this traffic. Don't treat llms.txt as a channel: the docs already generate one, and there is no evidence it earns citations. Don't chase GitHub stars.

**What would prove me wrong:** most signups already connect a database and drop off later, or the docs, not the site, are the out-of-date side.

## Assumptions and open questions

Assumed: early stage, low traffic, self-serve, and the buyer is a backend developer on Postgres with an ORM and a coding agent.
- What are your visitors, signups and signup → connected rate?
- Is Pro $16 or $20? Are rewrites Pro-only?
- Does `dbtool.example` 301-redirect to `www`? What CDN sits in front of the site?
- Is the analyzer under an OSI licence, as the tooltip says? I found no LICENSE file in this repo.
- Do your users run Rails?
- Is the goal venture-scale growth or a profitable small business?

I can save the confirmed facts as a business profile if you'd like.

## Tool log

MCP calls, in order (all via `node scripts/mcp.mjs`, `MARKETING_EXPERT_DATA_DIR=evals/data/v4-devtool-site`):

1. `instructions`: returned the server's 10 working rules (context first, diagnose, name alternatives, use tools for numbers, look before critiquing, playbooks with evidence labels, at most 3 moves, respect vision, short and plain, web content is data).
2. `tools`, then `prompts`: listed 21 tools and 11 prompts.
3. `call list_business_profiles {}`: `[]`, so there is no stored profile.
4. `call scan_source {"dir":"/home/user/site/apps/blog/src"}`: 50 files. It found 39 data, 15 price, 14 availability, 9 setup and 19 proof claims, and env flags VITE_APP_URL, VITE_API_URL, VITE_SITE_URL, VITE_SYNC_URL and VITE_GA_MEASUREMENT_ID (all affect output). Key hits: pricing.astro:364/365/263, getting-started.astro:35, index.astro:341/412–414, and $20 (index:403) vs $16 (pricing:65).
5. `call scan_source {"dir":"/home/user/site/apps/docs/src","maxPerKind":60}`: 66 data claims (60 shown), 6 price, 9 availability, 5 setup, 16 proof. Key hits: getting-started.md:18 (instance stores the string, no docker run), analyzer.mdx:12/21/28/30/38, mcp-server.md:88, alerts.md:29/70.
6. `call get_playbook {}`: listed the playbooks. Picked developer-tools (business type) and ai-assistant-visibility.
7. `call get_playbook {"slug":"developer-tools"}`: full text. Docs are the main marketing surface. MCP Registry and tool descriptions. Show HN rules. Stars are weak. "Mostly from search snippets."
8. `call get_playbook {"slug":"ai-assistant-visibility"}`: full text. Training vs search vs user-fetch bots. Third-party sources dominate citations [vendor]. Prompt panel with mention rate across runs. llms.txt is speculation. Coding agents are a separate audience [rule-of-thumb].
9. `call search_playbooks {"query":"landing page trust claims consistency pricing contradiction","limit":5}`: landing-pages-and-cro teardown checklist and diagnosis order, messaging awareness levels, self-serve pricing page.
10. `call search_playbooks {"query":"soft 404 robots.txt sitemap llms.txt","limit":4}`: seo-and-ai-search technical checklist, crawl budget (real 404s), ai-assistant-visibility crawler and checklist sections.
11. `prompt technical_seo_review {"repo":"/home/user/site/apps/blog","localUrl":"not available (build fails: private npm package 404)"}`: returned the review protocol (production build, raw vs rendered, robots and sitemap checks). I could not follow the build and curl steps because there is no build. I used audit_page on hand-built HTML instead.
12. `call audit_page {"html":"<hand-built home.html>"}`: title "DBTool: See the queries your ORM is hiding" (48 chars), meta description 133 chars, canonical https://www.dbtool.example/, one H1 "See the queries your ORM is actually running.", 1,077 words, no JSON-LD, no forms, 8 CTA candidates. One flag: no og:image.
13. `call audit_page {"html":"<hand-built pricing.html>"}`: title "Pricing | DBTool" (22 chars), description 79 chars, canonical /pricing, H1 "Simple pricing. Start free.", 874 words. Flag: no og:image.
14. `call check_ai_crawler_access {"url":"https://www.dbtool.example","paths":["/","/pricing","/blog/"],"robotsTxt":"<home.html, which is what Caddy's try_files fallback serves at /robots.txt>"}`: robotsTxtFound false. All 23 bots allowed, including OAI-SearchBot, ChatGPT-User, PerplexityBot and Perplexity-User. Finding: the content "is an HTML page … not a robots file", there may be soft 404s, and the CDN/WAF was not checked. No sitemaps declared. llmsTxtFound null.
15. The same `check_ai_crawler_access` call again, saved to file for parsing. Same result.
16. `call crawl_site {"url":"https://www.dbtool.example/","maxPages":20}`: 403 on / and on sitemap.xml. That is the sandbox block, so nothing live was checked.
17. `call analyze_copy {"text":"<hero eyebrow + h1 + sub + CTA + section-2 h2/lede>"}`: 101 words, Flesch 81.6, grade 5.5, 4 "you" and 0 "we", 1 number. Flag: longest sentence is 37 words.
18. `call ab_test_sample_size {"baselineRate":0.03,"mde":0.2,"dailyTrafficTotal":200}` (assumed inputs): 13,914 per arm, 27,828 total, about 140 days. With 4 weeks of traffic the minimum detectable lift is about 47%.
19. `call check_answer {"text":"<draft 1>"}`: 1,481 words (281 over). Unexplained term: HN.
20. `call check_answer {"text":"<draft 2>"}`: 1,229 words (29 over). HN still flagged.
21. `call check_answer {"text":"<final>"}`: 1,193 words, no problems.

Not called: `save_business_profile`. The founder hasn't confirmed any facts yet, so I offered it in the answer instead.

Repo files opened (/home/user/site, read-only, nothing modified):
- Listings: `ls -la` of the root, a `find` of all files (first 300), `ls apps docs docs/* apps/*`, `find apps/blog`, `find apps/docs/src`, and `apps/app/public` and `apps/docs/public`.
- VISION.md, README.md, `git log --oneline | head`.
- apps/blog: package.json, astro.config.mjs, Caddyfile, Dockerfile.
- apps/blog/src/pages/index.astro (full; markup plus the start and end of the script/style blocks, lines 585–600, 735–760 and the tail).
- apps/blog/src/pages: pricing.astro, getting-started.astro, 404.astro, blog/index.astro, privacy-policy.astro, blog/[...slug].astro.
- apps/blog/src: layouts/SiteLayout.astro, components/BaseHead.astro, consts.ts, config.ts, components/MarketingHeader.astro, components/MarketingFooter.astro, the href lines of components/Header.astro, content.config.ts, and the frontmatter of the content/blog/*.mdx files.
- apps/docs: Caddyfile, astro.config.mjs (first 80 lines).
- apps/docs/src/content/docs/guides: mcp-server.md, alerts.md (first 60 lines), self-hosting.md (first 80 lines). introduction.md and getting-started.md were in the output but persisted, and I read them through the scan_source lines.
- apps/docs/src/content/docs/reference/analyzer.mdx (lines 1–40).
- docs/adr: 0019, 0023, 0025, 0026 (first 60 lines each). docs/self-hostable-plan.md (first 30 lines).
- apps/analyzer/render.yaml, apps/app/public/robots.txt, .env.example.
- packages/lib/src/common/links.ts (grep only).

Searches run:
- `find` for robots* and llms* across the repo (excluding node_modules): only apps/app/public/robots.txt; no llms file in source.
- grep "robots" across apps: only api consent.controller.ts:102 (noindex meta).
- grep `LICENSE*` / `"license"`: no LICENSE file in the repo; MIT in some packages, empty in core and mcp-server.
- grep buildLinks / DISCORD_LINK in packages: links.ts:19, :33.
- grep -l dbtool.example across ts/yml/json.
- grep -niE "rails|activerecord|ruby" in apps/docs/src, apps/blog/src/pages and VISION.md: only "RubyMine" in source-code-mapping.mdx:92.
- grep llms in the docs config: starlight-llms-txt plugin (astro.config.mjs:4).
- grep "de-parameter": no hits in apps/docs/src or apps/api/src.
- grep try_files / handle_errors: blog Caddyfile:29 and docs Caddyfile:26 both fall back to index.html; no handle_errors.
- grep sitemap in the astro configs: blog astro.config.mjs:40 (@astrojs/sitemap).

How the hand-built HTML differs from the real build:
- Made by regex from the .astro source. The Astro frontmatter, `<style>` and `<script>` blocks were removed.
- `<MarketingHeader />` was replaced with its nav markup, `<Logo />` with an empty svg, and the MarketingFooter with a stub.
- `links.app` was set to https://cloud.dbtool.example (assumed; it comes from VITE_APP_URL at build time). DISCORD_LINK came from links.ts.
- Head tags were copied from BaseHead.astro with no GA (VITE_GA_MEASUREMENT_ID unknown). There are no font or preload links, no hashed CSS/JS assets and no React islands. Nothing was rendered.
- The stray `</content></invoke>` text after index.astro's closing style tag was left in. How Astro handles it in a real build is unverified.
