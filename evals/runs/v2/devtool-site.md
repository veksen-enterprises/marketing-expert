## Answer

**Short version.** The first thing to fix is not SEO. Your marketing site describes an older version of the product. Your docs say the MCP server, alerts, query rewrites and self-hosting have all shipped. The site calls them "soon" or "on our radar". The site's setup steps, its Pro price and what it says about your data also contradict each other. That costs trust with developers, and AI assistants repeat what your site says. On ChatGPT and Perplexity: nothing in the repo blocks their crawlers, and every page is plain server-rendered HTML that they can read. Whether they actually *name* you when someone asks for a Postgres tool, I could not check. That needs a prompt test (move 2).

**How I reviewed it.** dbtool.example is blocked from my sandbox (audit_page got a 403 from the sandbox proxy, which says nothing about your site). The site also can't be built here, because it depends on a private npm package (`@dbtool/pglite@1.0.7`). So I reviewed it from source: `apps/blog` (pages, landing components, `BaseHead.astro`, `astro.config.mjs`, `Caddyfile`, `public/`), plus `VISION.md`, `README.md`, `apps/docs` and the ADRs. I ran audit_page on HTML I rebuilt by hand from the Astro source for the home and pricing pages. That HTML is close to the real page, but it is not the real build: no CSS, a placeholder logo, GA left out, and I assumed `links.app` = `https://cloud.dbtool.example`. I did not run crawl_site, render checks or speed tests, and I checked nothing live.

### Questions I'd ask (answered here with assumptions)
1. What are your traffic, signup rate, signup → connected database rate and free → Pro rate? **Assumed:** low traffic (a few hundred visits a day) and an early-stage company (lifetime deal, "we're small"). If traffic is much higher, the A/B advice below changes.
2. Which Pro price is current, $16 or $20? **Not assumed.** You need to pick one.
3. Who is the best-fit customer? **Assumed:** backend teams on Postgres using a Node/TypeScript ORM (Drizzle, Prisma), more and more of them working through coding agents. This comes from VISION.md and the docs.
4. Is the code that does the analysis still open source? ADR 0019 moved analysis to the platform, so the Collector "analyzes none of it". **Assumed:** only the Collector is open source.
5. Do Render or your CDN have bot blocking turned on? Unknown.

### What the docs show vs what the site says

| Capability | Status in docs/code | What the site says |
|---|---|---|
| MCP server | **Shipped.** `guides/mcp-server.md`, `packages/mcp-server` v0.18.2. VISION calls it the first gate | "Soon", Pro only, "On our radar" (`index.astro`, `pricing.astro`) |
| Alerts (Slack, webhook) | **Shipped.** `guides/alerts.md` (schema_drift alerts are "coming soon") | "On our radar" |
| Query rewrites | **Shipped.** `how-optimization-works.md`, ADR 0031/0032 | "Soon" |
| Self-hosting | **Shipped.** `guides/self-hosting.md` | "Working on a fully self-hosted / offline mode"; "Local-only mode" on the radar |
| Setup | Connect in the app, "no `docker run` command and nothing to install"; first launch takes "a few minutes" | Homepage step 1 is `docker run …collector`, "60 seconds". `/getting-started` lists 4 Docker/Deno options |
| Data sent | Schema, statistics (which include sampled column values) and query text; "your rows never reach it"; "No setting keeps the data on your machine" | `/getting-started`: "extract 10 sample rows per table". Pricing FAQ: "we never see your full rows" |
| Pro price | Stripe has monthly, yearly and lifetime price IDs (amounts not in the repo) | **$20/month** on the homepage, **$16/mo** on /pricing. No yearly price shown |
| Scale prediction (10×/1000×) | **Partial.** A CI "Statistics scale" setting, default 1×, that only works with production statistics on file | Headline feature, "simulated planner choices". The pricing tooltip says "not a simulator" |
| Team plan | **Partial.** Teams exist in code (ADR 0004); there is no team billing | Homepage: "shipping next". Pricing: "Not yet… figuring out what teams need" |
| Stack | SQLCommenter guides for Drizzle, Prisma, TypeORM, MikroORM, EF Core; CI auto-setup "Node-only today" | The hero example is Ruby on Rails (`orders_controller.rb`) |
| Name | The docs never say "PlanView" | The site sells "PlanView" |

The "10 sample rows" line and the "nothing leaves your network" radar item are the most serious. A security reviewer will catch those.

### Positioning gap
VISION.md describes four checkpoints where a slow query gets caught: the agent writing the code (MCP), CI on the pull request, CI on the main branch, and production. It says "the agent is a first-class reader." The site leads with "See the queries your ORM is actually running" and calls the agent part "soon". Your most distinctive capability, which you have already shipped, is missing from the homepage.

**Alternatives buyers compare you with** (from my own knowledge, unverified): pganalyze, pgMustard, explain.dalibo.com, Datadog Database Monitoring, PgHero, Supabase's index advisor, HypoPG/Dexter, LLM "SQL copilots", and doing nothing until an incident. Your comparison table names only `EXPLAIN ANALYZE` and LLM copilots.

### Copy and SEO
- Hero copy reads fine: analyze_copy gives grade 7.1, "you" 7 times vs "we" once. The homepage title (48 characters) and meta description (133) are within limits.
- **No `og:image` on any page.** `BaseHead.astro` only sets it when a page passes `image`, and no page does. audit_page flagged it. `public/images/share.png` already exists.
- `/getting-started` has a typo in its meta description ("Getting strted"), no H1, and outdated setup steps. It competes with the docs. The homepage footer's "Docs" link goes there, while the header's "Docs" link goes to docs.dbtool.example.
- Two blog titles are over 60 characters because of the "DBTool |" prefix. Four of the six posts date from 2023.

### Can ChatGPT and Perplexity find you?
- **Crawler access:** check_ai_crawler_access shows every AI bot allowed, including GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot and Perplexity-User. That is only because **there is no robots.txt** (none in `public/`, none generated), so it also lists no sitemap. I couldn't check your CDN or firewall.
- **Probable bug (from the Caddyfile, not checked live):** `try_files {path} {path}/index.html index.html` returns the homepage with status 200 for any path that doesn't exist. That includes `/robots.txt`, `/llms.txt` and every broken URL. Your `404.astro` page is never served, so dead links look like real pages to crawlers. Each page's canonical tag still points at `/`, which limits the damage.
- **Readability:** pages are static Astro HTML. That matters because, per Vercel/MERJ (vendor data), GPTBot and PerplexityBot don't run JavaScript.
- **Being named is a separate question.** ChatGPT search uses OpenAI's own index plus third-party search engines (Bing is widely reported to be one). Perplexity uses its own index. Most citations come from third-party sites like Reddit and comparison articles (Profound and Semrush studies, vendor data). Today, an assistant reading your site would conclude you **don't** have an MCP server.

### What to do, in order

**1. Make the site match the shipped product (this week).**
- **Why it works:** developers stop trusting a site that contradicts the docs, and AI assistants quote the site.
- **What to do:** fix every row in the table above, choose one price, and redirect `/getting-started` to the docs quickstart.
- **Ship it, don't A/B test it.** At a 3% signup rate and an assumed 300 visits a day, detecting a 20% lift takes about 93 days (ab_test_sample_size). Within 4 weeks you could only detect a lift of about 38%.
- **Measure:** visit → signup and signup → connected database, 4 weeks before vs 4 weeks after. Treat this as a direction check, not proof.
- **Stop condition:** none. Factual fixes ship regardless. If activation doesn't move, the constraint is somewhere else.

**2. Fix crawl basics, then measure AI visibility (2 weeks, a few hours of work).**
- Add `public/robots.txt` that allows all bots and includes `Sitemap: https://www.dbtool.example/sitemap-index.xml`. Make Caddy serve `404.html` with a real 404 status. Add `og:image`. Confirm that `dbtool.example` redirects to `www` with a 301.
- Submit the sitemap in Bing Webmaster Tools.
- Set up a GA4 channel group for AI referrers (ChatGPT tags its links with `utm_source=chatgpt.com`).
- Run 20–30 real buyer questions ("Postgres MCP server for Claude Code", "catch missing indexes in CI") 3–5 times each in ChatGPT and Perplexity. Record your **mention rate** and which sources get cited.
- **Check that it worked:** `curl -I /robots.txt` returns `text/plain`, and `curl -I /nope` returns 404. Repeat the prompt panel monthly.
- **Stop condition:** if your mention rate stays near zero after 2 monthly runs, shift effort to the third-party sources that get cited (Reddit, comparison posts).

**3. Lead the homepage with the agent and CI checkpoints (after #1, about 4 weeks).**
- **Hypothesis:** because VISION.md and the shipped MCP server put the agent checkpoint first, while the site hides it, leading with "catch slow queries while your agent writes them, and block them in CI" will raise signup → connected-database rate for TypeScript/agent-heavy teams.
- **Cheapest test:** a 5-second test of two hero versions, plus 5–8 interviews with your best current users (this is a positioning question, so run the positioning_workshop first).
- **Stop condition:** if users describe their reason for buying as "seeing ORM queries", keep the current angle.

**Not yet:** paid ads, schema markup or llms.txt as an AI tactic (no evidence they work), Show HN before #1 ships, and A/B tests at your current traffic.

I haven't saved a business profile because you haven't confirmed these facts. Tell me if you want me to.

## Tool log

MCP commands (all run with `cd /home/user/marketing-expert && export MARKETING_EXPERT_DATA_DIR=…/evals/data/v2-devtool-site`):
1. `node scripts/mcp.mjs instructions`: operating rules (context first, docs vs site contradictions are findings, tools for numbers, ≤3 ranked moves, plain language). Followed them throughout.
2. `node scripts/mcp.mjs tools`: listed the 21 tools. Picked audit_page (html), analyze_copy, check_copy_limits, check_ai_crawler_access (robotsTxt), playbooks and ab_test_sample_size.
3. `node scripts/mcp.mjs prompts`: listed 11 workflow prompts.
4. `call list_business_profiles '{}'`: returned `[]`, no stored profile. Worked from the repo instead.
5. `prompt landing_page_teardown '{"url":"https://dbtool.example",…}'`: teardown structure (facts check first, 5-second read, analyze_copy, offer, proof, friction, ≤3 hypotheses). Used it as the answer's skeleton.
6. `prompt technical_seo_review '{"repo":"/home/user/site","localUrl":"n/a"}'`: full technical SEO checklist. Applied it from source (robots, 404 status, canonical, OG, sitemap), since there was no build.
7. `call get_playbook '{}'`: list of playbooks. Chose developer-tools as the business-type playbook.
8. `call search_playbooks '{"query":"landing page checklist developer tool"}'`: teardown checklist, plus dev-tools sections on docs and trust.
9. `call get_playbook '{"slug":"developer-tools"}'`: docs as the main marketing surface, AI agents as users, MCP registry, trust. Used it for the positioning and docs points.
10. `call get_playbook '{"slug":"ai-assistant-visibility"}'`: bot roles, JS non-rendering (Vercel/MERJ), sources of citations, prompt-panel method, Bing. Used it for the ChatGPT/Perplexity section and move 2.
11. `call check_ai_crawler_access '{"url":"https://www.dbtool.example","robotsTxt":"",paths:[/,/pricing,/blog/]}'`: no robots.txt, all bots allowed, no sitemaps; llms.txt not checked. Quoted in the answer.
12. `call check_ai_crawler_access` with `robotsTxt` set to homepage-like HTML (what the Caddy fallback would serve): all bots allowed. The tool reported "robotsTxtFound: true" and did not flag that the file was HTML, so I relied on the Caddyfile reading for that point.
13. `call audit_page '{"html": <rebuilt home.html>}'`: title 48 characters, meta description 133, canonical `/`, one H1, 1,072 words, no JSON-LD, flagged "Incomplete Open Graph (og:image)". The H1 shows "isactually" because the extraction drops the space at the source line break; that is not a real defect.
14. `call audit_page '{"html": <rebuilt pricing.html>}'`: title "Pricing | DBTool", H1 "Simple pricing. Start free.", same og:image flag, no JSON-LD.
15. `call analyze_copy` on the homepage hero and benefits copy: Flesch 75.6, grade 7.1, you 7 / we 1, one passive construction, longest sentence 37 words.
16. `call check_copy_limits '{"platform":"serp",…}'`: home, pricing, getting-started and blog titles OK; 2 blog-post titles over 60 characters (71 and 66); all descriptions within length. I flagged the "strted" typo myself.
17. `call audit_page '{"url":"https://www.dbtool.example/"}'`: "expected HTML, got content-type text/plain (status 403)". This confirms the sandbox block; nothing was checked live.
18. `call search_playbooks '{"query":"llms.txt evidence AI search technical checklist"}'`: llms.txt evidence is weak (Google doesn't use it; Ahrefs found 97% of these files get zero requests). Used for "not yet".
19. `call search_playbooks '{"query":"pricing page inconsistent price trust claim substantiation"}'`: claim substantiation rules. Supported treating the price and data contradictions as urgent.
20. `call search_playbooks '{"query":"positioning category developer tool alternatives"}'`: Dunford order (start from alternatives), common mistakes. Used for the alternatives list and move 3.
21. `call ab_test_sample_size '{"baselineRate":0.03,"mde":0.2,"dailyTrafficTotal":300}'` (assumed inputs): 13,914 per arm, about 93 days; with 4 weeks the smallest detectable lift is ~37.8%. Used for "ship, don't A/B test".

Repo files read (not modified). Throwaway HTML was written only to the scratchpad:
- `/home/user/site/VISION.md`, `/home/user/site/README.md`
- `apps/blog/astro.config.mjs`, `Caddyfile`, `Dockerfile`, `package.json`, `src/consts.ts`, `src/config.ts`, `src/content.config.ts`
- `apps/blog/src/components/BaseHead.astro`, `MarketingHeader.astro`, `MarketingFooter.astro`, `PricingComponents.tsx`, `landing/RunInDev.tsx`, `BlogPost.astro` (grep)
- `apps/blog/src/layouts/SiteLayout.astro`, `layouts/BlogPost.astro`
- `apps/blog/src/pages/index.astro`, `pricing.astro`, `getting-started.astro`, `404.astro`, `privacy-policy.astro`, `blog/index.astro`, `blog/[...slug].astro`, `rss.xml.js`
- `apps/blog/src/content/blog/*.mdx` (frontmatter/opening lines of all 6)
- `apps/blog/public/` listing (no robots.txt, no llms.txt; `images/share.png` present)
- `packages/lib/src/common/links.ts` (DISCORD_LINK)
- `apps/docs/README.md`, `apps/docs/astro.config.mjs` (starlight-llms-txt, docs site URL), docs file listing (public/skill.md)
- `apps/docs/src/content/docs/guides/mcp-server.md`, `alerts.md`, `self-hosting.md`, `using-with-llms.md`, `introduction.md`, `getting-started.md`, `live-queries.md`, `ci-integration.md`, `how-optimization-works.md` (grep), `reference/analyzer.mdx`, `reference/statistics.mdx` (grep), `index.mdx`
- `docs/adr/0019-analysis-runs-on-the-platform-the-collector-only-sends.md`, `docs/adr/0004-projects-are-held-by-teams.md` (heads), ADR listing
- `packages/mcp-server/CHANGELOG.md` (head), `apps/api/src/config/validator.ts` (grep: Stripe monthly/yearly/lifetime price IDs)
