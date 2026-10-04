## Answer

**Short version.** Fix this first: your marketing site describes an older product than the one your docs describe. On setup, data handling and price it now says things the docs (and in one case the app) contradict. For a read-only database tool, getting "what leaves my database and who holds my credentials" wrong costs you trust, and the developers who read your docs will see the gap. Copy polish and SEO come after that.

On ChatGPT and Perplexity: nothing in the repo blocks their crawlers, and your marketing pages are plain server-rendered HTML they can read. But "can crawl you" is not the same as "recommends you", and I could not check the live site or run any prompts. Details below.

**How I reviewed (assumptions).** dbtool.example is blocked from my sandbox: `audit_page`, `crawl_site` and the live `check_ai_crawler_access` all got a 403. The site also can't be built here (a private npm package returns 404). So I reviewed from source in `apps/blog` (the Astro marketing site, `site: https://www.dbtool.example`) and `apps/docs`, and audited a homepage HTML file I put together by hand. That file differs from the real build: it has no CSS or JS bundles, no favicon or font preloads, no GA tag, the Logo component is replaced by text, and I assumed `links.app` = `https://app.dbtool.example`. I don't have your traffic or signup numbers, so this is a review of accuracy and positioning, not of conversion.

### What the site says vs. what docs/code say

| Topic | Site | Docs / code | Status per docs |
|---|---|---|---|
| Setup | "Pull the Docker image, point it at your Postgres" (`pages/index.astro:259`); "One `docker run`…" (`:495`) | "There is no `docker run` command and nothing to install on your side" (`docs/guides/getting-started.md:18`); the platform starts the Collector (ADR 0026, built) | Shipped |
| Credentials | "a Docker container *you* run, with credentials *you* control" (`pages/pricing.astro:364`; also `:49`) | "Connecting a database in the app stores the connection string, and the instance runs the container itself" (`docs/reference/analyzer.mdx:12`) | Shipped |
| Data local | "run it on your own machine" (`index.astro:483`) | "No setting keeps the data on your machine" (`analyzer.mdx:30`); analysis runs on the platform (ADR 0019) | Shipped |
| Rows | Getting-started page: utility will "extract 10 sample rows per table" (`pages/getting-started.astro:35`) | "Your rows never reach it" (`analyzer.mdx:38`); the pricing FAQ also says "we never see your full rows" (`pricing.astro:365`). The site disagrees with itself. | — |
| Pro price | $20/month (`index.astro:403`) | Pricing page: "$16 /mo · Billed monthly" (`pricing.astro:65,68`). The app charges "$20/month" or "$192/year" (`apps/app/.../form-payment.component.tsx:87-88`). So $16 is the yearly rate per month, labelled as monthly. | — |
| MCP | "On our radar" / "(soon)" (`index.astro:331,412`; `pricing.astro:71`) | "Every DBTool instance serves an MCP server at `/mcp`" (`docs/guides/mcp-server.md:6`) | Shipped (ADR 0003 per-query triage: "not fully built") |
| Alerts | "On our radar" (`index.astro:327`) | Slack + webhook alerts documented (`docs/guides/alerts.md`); schema_drift, Discord, Email and PagerDuty are "coming soon" | Shipped, partly |
| Rewrites | "On our radar" / "(soon)" | Rewrites appear in alert payloads (`alerts.md:33-50`); ADRs 0031/0032 accepted | Partial |
| Self-host / local-only | "Local-only mode" on radar (`index.astro:339`); "working on a fully self-hosted / offline mode" (`pricing.astro:365`) | Self-hosting guide with compose file (`docs/guides/self-hosting.md`); several self-host ADRs (0020, 0021, 0023, 0028) say "not built" | Partial |
| Hero promise | "Point it at a Postgres URL and it flags… the indexes that fix them" (`index.astro:48`), shown with a Rails example | "Plans come from CI" (`getting-started.md:40`); "Detection is Node-only today" (`ci-integration.md:11`) | — |
| 10×/1000× | Main hero claim | `packages/core/src/optimizer/statistics.ts:155` has a `scale` factor. I found no docs page for it in `apps/docs/src/content`. | Unclear |

Smaller items, one line each:
- Nav "Docs" goes to docs.dbtool.example, but the footer's "Docs" / "Getting started" / "CI integration" links go to the outdated `/getting-started` page (`MarketingFooter.astro:28,33`; homepage footer too).
- `consts.ts` description ("Care for your database") and the homepage footer line ("dynamic visualizations") are older positioning.
- The getting-started meta description has a typo ("Getting strted").
- `audit_page` flagged no og:image.
- The homepage has no structured data.

### Can ChatGPT and Perplexity find you?

- **Crawling: probably yes, with caveats.** There is no `robots.txt` in `apps/blog/public`, and the Caddyfile's `try_files {path} {path}/index.html index.html` serves the homepage HTML at `/robots.txt`. `check_ai_crawler_access` on that: "Crawlers find no rules, so every bot is allowed." That includes OAI-SearchBot, ChatGPT-User, PerplexityBot and Perplexity-User. The same catch-all means any wrong URL returns your homepage with status 200 instead of a 404 (a "soft 404"), and your built `404.astro` is never served. There's also no robots.txt `Sitemap:` line pointing to your sitemap. I could not check Render's or any CDN's or firewall's bot rules, and those can block AI bots even when robots.txt allows them.
- **Readability: yes.** The homepage is static Astro with no client-side rendering; the text is in the server HTML (about 1,080 words). That matters because "no evidence that GPTBot, ClaudeBot, PerplexityBot… execute JavaScript" (Vercel/MERJ 2024, vendor data).
- **Being recommended: unknown, and probably weak.** You have 6 blog posts (4 from 2023), no comparison pages and no structured data. Assistant answers lean heavily on third-party sources. In Profound's data (vendor), Wikipedia was ~48% of ChatGPT's top-10 source share and Reddit ~47% of Perplexity's. The playbook notes "Most items came from search snippets." There is also a real chance that an assistant reading your site repeats the outdated claims above ("you run the container", "MCP coming soon"). That is one more reason to fix accuracy first.

Main alternatives buyers compare you to (my own knowledge, not checked): pganalyze (index advisor and query monitoring), Datadog Database Monitoring, PgHero, plan visualisers (pgMustard, explain.dalibo.com, explain.depesz.com), the index advisors built into hosted Postgres (e.g. Supabase), pasting EXPLAIN into ChatGPT/Copilot, and doing nothing until production gets slow.

### Three moves, in order

**1. Make every setup, data-handling and price claim on the site match the docs.** Use `docs/reference/analyzer.mdx` and the app's checkout as the only sources. Rewrite the homepage "How it works" steps, the values block, the pricing FAQ "What happens to my data?" and the Free-plan bullet. Fix $16 vs $20. Redirect `/getting-started` to the docs.
- *Why it works:* trust. A read-only DB tool that contradicts itself on credentials and data loses careful buyers.
- *Cheapest test:* none needed; this is a correctness fix. Ask 3 Discord users to read the new data section and say back what leaves their database.
- *Metric:* signup → connected database or first CI run within 7 days.
- *Time box:* ship within 1 week, then watch for 4 weeks.
- *Stop/rethink if:* activation doesn't move after 4 weeks. Then the problem is onboarding, not the site.

**2. Rewrite the hero and "What you get" around what ships today.** Lead with the CI gate on the pull request plus the MCP server for coding agents. Move MCP, alerts and (partial) rewrites out of "On our radar". Swap the Rails example for a Node/Drizzle one, since CI detection is Node-only. This follows your VISION ("run as close to the developer as possible, and stay readable to an agent"), which the homepage barely mentions today.
- *Cheapest test:* a 5-second test with 5–10 Node/Postgres developers: "what does this do, and where does it run?"
- *Metric:* homepage → signup click rate, and the share of signups that reach a CI run.
- *Time box:* 4 weeks.
- *Stop if:* fewer than half of testers can say "it checks queries in CI / in my agent". Then rework the wording before you ship it.

**3. Start a monthly AI-answer baseline before doing any "AI SEO".** Write 20 real questions, e.g. "my Postgres query is slow, how do I find a missing index", "catch slow queries in CI", "pganalyze alternatives". Run each one several times in ChatGPT, Perplexity and a coding agent in a clean project. Record your mention rate across runs, not a single rank, and note any wrong facts. Do the hygiene fixes alongside it: a real text/plain `robots.txt` with a Sitemap line, a 404 fallback in the Caddyfile, and submitting the site to Bing Webmaster Tools.
- *Metric:* mention rate, and assistant referrals (utm_source=chatgpt.com, perplexity.ai) in GA.
- *Time box:* baseline now, re-check in 8 weeks.
- *Stop if:* you're named in 0 runs after two rounds. Then invest in third-party presence (a technical post on Hacker News or Reddit, comparison content) rather than on-site changes.

What would prove me wrong: if your analytics show visitors who sign up do activate at a healthy rate, the site isn't your constraint. Then reach (traffic) is the problem, and moves 1–2 become housekeeping.

### What not to do yet

- No A/B tests until I know your traffic. Small sites usually can't power them.
- No paid ads.
- No Show HN or launch post until the site matches the docs. If Postgres 19 is landing around now (unverified), don't time a launch to it before fixing this.
- No llms.txt on www as a "channel": "no evidence it is used for citations". Your docs site already generates one via `starlight-llms-txt`.
- No mass "best X" pages, and no paid or undisclosed mentions.

### Open questions

1. Monthly visitors, signups, and the share that connect a database or run CI?
2. Which is correct: $20/month, or $16/month billed yearly? Should the $192/year plan appear on the site?
3. Is MCP free on every plan (the docs imply yes) or Pro-only (the site says so)?
4. Is `www` canonical, and does the bare `dbtool.example` redirect to it?
5. Is there a CDN or firewall in front of Render with bot rules?
6. What does the 10×/1000× feature do in the product today?
7. Is the DBTool/analyzer repo still the open-source Collector, and under which license?
8. Is self-hosting generally available?
9. Who is the target customer: Node/TypeScript teams on Drizzle? And are you building for venture scale or bootstrapping?

If you confirm these, I can save them to a DBTool business profile so future advice starts from them.

## Tool log

MCP calls (in order; all via `node scripts/mcp.mjs` with `MARKETING_EXPERT_DATA_DIR=evals/data/v3-devtool-site`):
1. `instructions`: read the server instructions (context first, diagnose, tools for numbers, playbooks, ≤3 moves, plain language).
2. `tools`: listed 18 tools.
3. `prompts`: listed 11 prompts (not used).
4. `call list_business_profiles {}`: `[]`, no stored profile.
5. `call get_playbook {}`: list of 48 playbooks.
6. `call search_playbooks {"query":"AI assistant visibility ChatGPT Perplexity citations robots.txt","limit":5}`: returned ai-assistant-visibility sections (common mistakes, crawler access, speculation, sources).
7. `call get_playbook {"slug":"developer-tools"}`: devtools playbook (docs as the main marketing surface, MCP/agents, Show HN rules, self-hosting, trust).
8. `call get_playbook {"slug":"ai-assistant-visibility"}`: full playbook (retrieval vs training, bot tokens, JS rendering [vendor], citation sources [vendor], prompt panel, measurement, "Most items came from search snippets").
9. `call audit_page {"url":"https://www.dbtool.example/"}`: failed: `expected HTML, got content-type "text/plain" (status 403)` (sandbox block).
10. `call crawl_site {"url":"https://www.dbtool.example/","maxPages":50}`: 1 page, the start URL returned 403. Nothing was actually crawled.
11. `call check_ai_crawler_access {"url":"https://www.dbtool.example"}`: robotsTxtFound false because the fetch was blocked. Not used as evidence.
12. `call check_ai_crawler_access {"url":"https://www.dbtool.example","paths":["/","/pricing","/blog/"],"robotsTxt":"<!doctype html>… homepage HTML stub …"}` (what Caddy's `try_files … index.html` would serve at /robots.txt): finding "robots.txt content is an HTML page… every bot is allowed… soft 404s. Serve a real text/plain robots.txt". All 23 bots allowed; no sitemaps.
13. `call check_ai_crawler_access {"url":"https://app.dbtool.example","robotsTxt":"User-agent: *\nAllow: /\n"}` (apps/app/public/robots.txt): all bots allowed; no Sitemap line.
14. `call audit_page {"html": <hand-built homepage HTML from apps/blog/src/pages/index.astro + MarketingHeader + BaseHead>}`: title 48 chars, meta description 133, canonical www, one H1, no JSON-LD, ~1,081 words, 8 CTA candidates, flag: no og:image.
15. `call analyze_copy {"text": <hero + "What you get" lede>}`: Flesch 86.6, grade 5.1, 0 "we", 4 "you", longest sentence 37 words. Readability is fine.
16. `call search_playbooks {"query":"claim substantiation privacy data handling security page trust developer","limit":4}`: privacy-and-marketing-law claims section (hold evidence before objective claims), devtools "publish a security page".
17. `call search_playbooks {"query":"llms.txt robots.txt soft 404 sitemap Bing IndexNow","limit":3}`: ai-assistant-visibility checklist; seo-and-ai-search technical checklist.

Repo files opened (/home/user/site):
- VISION.md, README.md
- apps/blog: astro.config.mjs, package.json, Caddyfile, Dockerfile, src/consts.ts, src/config.ts, src/pages/index.astro, src/pages/pricing.astro, src/pages/getting-started.astro, src/pages/404.astro, src/layouts/SiteLayout.astro, src/components/BaseHead.astro, src/components/MarketingHeader.astro, src/components/MarketingFooter.astro, frontmatter of the 6 posts in src/content/blog/*.mdx, src/content.config.ts
- apps/app: public/robots.txt, netlify.toml, Caddyfile
- packages/lib/src/common/redirect.ts
- docs/adr: README.md (status table), 0019, 0026 (first 60 lines)
- apps/docs: astro.config.mjs (top); src/content/docs/guides/introduction.md, mcp-server.md (top 70 lines), alerts.md (top 70 lines), self-hosting.md (top 40 lines), getting-started.md (top 60 lines); reference/analyzer.mdx
- grep hits: apps/app/src/components/auth-forms/form-select-plan.component.tsx and form-payment.component.tsx (prices); packages/core/src/optimizer/statistics.ts:155-167 (scale factor); apps/docs/src/content/docs/guides/ci-integration.md:11 (Node-only)

Searches run:
- `find` over the repo (excluding node_modules and .git)
- `grep -ril robots` and `grep -ril llms` across the repo (only robots.txt found: apps/app/public; llms.txt generated by starlight-llms-txt in apps/docs)
- `grep dbtool.example` across the repo
- `client:` directives in apps/blog/src (none on the homepage or pricing page)
- `json-ld|schema.org` in apps/blog/src (none)
- prices ($16/$20/$192/$100) in apps/app/src and apps/api/src/payment
- `1000|scale|growth` in apps/docs content (no docs page for scaling) and `scaleFactor` in core
- line-number greps for the cited claims in index.astro, pricing.astro, getting-started.astro, MarketingFooter.astro, docs getting-started.md, mcp-server.md, ci-integration.md, analyzer.mdx
