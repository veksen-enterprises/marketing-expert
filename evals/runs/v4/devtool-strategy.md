# DBTool: 90-day marketing strategy

## Answer

**Short version.** For the next 90 days, marketing should not be about reach. You don't yet know who keeps using the product, and your website describes an older product than your docs do. So: (1) this week, make the site match the product and how it handles data; (2) spend most of the 90 days getting 10–15 teams onto the CI check, set up by you personally, and learning which ones keep it; (3) then do one public launch and list the MCP server where coding agents look. No paid ads yet.

**What I'm assuming (I couldn't ask you):**
- A1: Few or no paying users. Your own plan said "Zero customers" in August (docs/self-hostable-plan.md:98). If you already have 20+ active teams, do move 3 sooner.
- A2: No budget beyond your own time.
- A3: Best-fit user: a small backend team on Node (Drizzle/Prisma), Postgres 13–19, GitHub Actions and a coding agent. Agent CI setup is "Node-only today" (apps/docs/.../ci-integration.md:11).
- A4: Pro at $16–20/month, about 5% of customers cancelling each month. This is a guess.

**What I found in the repo (business type: developer tools)**

What the docs show:
- Shipped: the CI check, the MCP server (mcp-server.md), query rewrites (how-optimization-works.md:55) and Slack/webhook alerts (alerts.md).
- Partly built: production monitoring (ADR 0019, "monitor mode open") and self-hosting (ADR 0025 "partially built").
- Planned: schema-drift alerts (alerts.md:29).

Where the site contradicts the docs. A technical buyer will check these:
- **Credentials:** the pricing FAQ says the analyzer runs "with credentials *you* control" (blog/src/pages/pricing.astro:364). The docs say the instance stores your connection string and starts the Collector itself (getting-started.md:18, analyzer.mdx:12).
- **Rows:** the site says "extract 10 sample rows per table" (getting-started.astro:35). The docs say "Your rows never reach it" (analyzer.mdx:38).
- **Parameter values:** a pricing tooltip says "Parameter values aren't included" (pricing.astro:263). The docs say pg_stat_statements can contain them (analyzer.mdx:21).
- **The docs disagree with each other:** statistics.mdx:14 says running locally keeps data on your computer, but analyzer.mdx:30 says "No setting keeps the data on your machine". statistics.mdx:16 says a superuser is needed; analyzer.mdx:64 says read access is enough.
- **Setup:** the homepage sells "docker run" (index.astro:265). The docs say "There is no `docker run` command" (getting-started.md:18).
- **Shipped features labelled "soon":** MCP and rewrites (index.astro:412–413, pricing.astro:71–72), plus alerts and self-hosting listed as future work.
- **Price:** Pro costs $20 on the homepage (index.astro:403) and $16 on the pricing page (pricing.astro:65).
- **Positioning:** the homepage leads with "point it at a Postgres URL" and a Ruby example. VISION.md leads with agents and CI, and the docs say plans come from CI (getting-started.md:40).

**What buyers use instead (my knowledge, unverified):** EXPLAIN read by hand or with pgMustard; pganalyze; the free advisors from their database host (Supabase, Neon, AWS RDS); asking an AI assistant; and most often nothing until production gets slow. Your edge is checking queries *before merge*, in a form an agent can call. Compete there, not on dashboards, where database hosts can copy you for free.

**The economics rule out paid ads.** With A4, unit_economics gives about $244 lifetime gross profit per customer. That means you can afford to spend $81–118 to win each customer. paid_media_math, with a guessed $4 per click and 1% of clicks becoming paid customers, gives $400 per customer: "Each conversion loses money on this basis." Your $100 lifetime deal is below that $244 and includes "everything Pro does, forever". Give "Limited spots" a real number, or close the deal.

**Diagnosis:** the bottleneck is positioning and having no feedback from users, not reach. **What would prove me wrong:** if teams already run the check on most PRs for 4+ weeks, reach is the bottleneck. Start with move 3.

### This week (a fix, not a strategy)
Make the homepage, pricing page and getting-started page match the docs on each point above. Use one price and one "what leaves your database" paragraph everywhere. introduction.md:59 already says it well. VISION.md says "Proven, not guessed", and the site should meet that standard.

### Three moves, in order

**1. Set up the CI check personally for 10–15 design partners (weeks 1–6).** Design partners are early users who get your help and give feedback in return.
- Mechanism: founder-led setup brings first users and shows you their objections [practitioner].
- Cheapest test: personal messages to A3-type teams from your Discord and from GitHub threads about slow ORM queries. Ask each what made them look and what nearly stopped them ("switch interview" questions [practitioner]).
- Metric: teams running the check on most PRs for 4 weeks.
- Stop condition: if fewer than 3 of 10 still run it after 30 days, fix the product or the target user before going public.

**2. Rewrite the homepage in your partners' words (weeks 5–8).** For example: "a pre-merge check for Postgres queries, for teams and their coding agents."
- Mechanism: fix positioning before copy. Developers judge a tool by its docs and quickstart [first-party survey].
- Cheapest test: don't A/B test it, because your traffic is too low. Ask five target developers to say back what the product does.
- Metric: share of signups reaching a first CI run within 7 days.
- Stop condition: if 3 of 5 can't explain it, rewrite again.

**3. Launch once with a "Show" post on Hacker News, and list the MCP server in the official MCP Registry (weeks 9–12).**
- Mechanism: Hacker News rules for Show posts require that people can try it "without barriers such as signups" [first-party]. The registry is where agents find tools [first-party].
- Cheapest test: each month, give a coding agent "my Postgres query is slow" in a clean repo and see whether it finds you [rule-of-thumb].
- Metric: first CI runs within 14 days of the launch. Ignore upvotes and stars.
- Stop condition: if fewer than 10% of launch signups reach a first CI run, fix onboarding.

The developer-tools playbook warns that its sources are "Mostly from search snippets; see caveats there."

**Timing:** a new Postgres major usually ships in the autumn and PGConf.EU is usually in late October. Check the dates. A talk about the problem could support move 3.

**Not yet:** paid ads; a content calendar (write posts from partner conversations instead); a team plan or SSO; more lifetime deals; counting GitHub stars.

### Open questions
1. Signups, weekly active projects and paying accounts? Is Google Analytics on in production (BaseHead.astro:15)?
2. Who are your current users, and how did they find you?
3. Lifetime deals sold, and the cap?
4. Is the platform open source, or only the Collector? packages/core has an empty license field.
5. Does a connected database alone produce index recommendations? live-queries.md and getting-started.md:40 read differently.
6. Venture-scale or a sustainable small business?

I can save the facts you confirm as a business profile.

## Tool log

MCP calls, in order. All were run with `node scripts/mcp.mjs` and `MARKETING_EXPERT_DATA_DIR=evals/data/v4-devtool-strategy`.

1. `instructions`: read the server instructions (steps 0–10: context first, diagnose, name alternatives, use tools for numbers, playbooks with evidence labels, at most 3 moves, check_answer).
2. `tools`, then `prompts`: listed 22 tools and 11 prompts.
3. `call list_business_profiles {}`: returned `[]`, so there is no stored profile.
4. `call scan_source {"dir":"/home/user/site/apps/blog/src"}`: 50 files scanned. It listed data, price, availability, setup and proof claims, which surfaced the $20/$16 price conflict, the "credentials you control" FAQ, the "Parameter values aren't included" tooltip, "extract 10 sample rows per table", MCP/rewrites "(soon)", "docker run" setup, and the env flags (VITE_GA_MEASUREMENT_ID and the URL flags).
5. `call scan_source {"dir":"/home/user/site/apps/docs/src","maxPerKind":40}`: 50 files scanned. It surfaced "no docker run" (getting-started.md:18), "No setting keeps the data on your machine" (analyzer.mdx:30), and statistics.mdx:14/16, which contradict it (run locally; superuser needed). It also showed schema_drift and Discord/Email/PagerDuty as "coming soon" and the PG 13–19 window.
6. `prompt marketing_strategy {"business":"DBTool: Postgres query performance tool ...","goal":"Marketing strategy for the next 90 days","budget":"Unknown; assume near-zero cash, founder time only"}`: returned the strategy procedure (pick a business-type playbook, alternatives, constraint, economics, 3 channels, 90-day plan, evidence, what not to do).
7. `prompt marketing_diagnosis {"context":"DBTool, early-stage ... zero customers ... site lags product."}`: returned the diagnosis procedure (business model, missing numbers, constraint order, at most 2 moves, what not to do).
8. `call get_playbook {}`: listed 47 playbooks; I chose `developer-tools`.
9. `call get_playbook {"slug":"developer-tools"}`: full playbook covering who uses vs who pays, open source, docs as the main surface, Show HN rules [first-party], MCP Registry [first-party], the coding-agent channel, metrics, and what works by stage. Its sources note says "Mostly from search snippets; see caveats there."
10. `call search_playbooks {"query":"early stage first customers founder-led sales do things that don't scale","limit":4}`: b2b-saas-sales-led and content-marketing stage sections; founder-led sales and content [practitioner]; outbound founder-led is for learning conversations.
11. `call search_playbooks {"query":"positioning competitive alternatives category","limit":4}`: positioning (Dunford order, outputs, common mistakes, components) [practitioner].
12. `call search_playbooks {"query":"activation time to value freemium onboarding","limit":4}`: self-serve-saas (freemium, common mistakes, onboarding) and retention-and-expansion (time to value).
13. `call search_playbooks {"query":"customer research interviews switch jobs to be done","limit":4}`: customer-research (jobs-to-be-done camps, switch interview script, 8–12 interviews per segment, method table) [practitioner].
14. `call search_playbooks {"query":"Show HN launch spike developer","limit":4}`: developer-tools channels and "what works by stage".
15. `call search_playbooks {"query":"platform bundles feature risk hosting provider builds it","limit":3}`: platform-and-feature-risk (risk questions, what reduces absorption risk, the AI version).
16. `call search_playbooks {"query":"coding agents separate audience developer tools AI assistant","limit":3}`: ai-assistant-visibility (coding-agent test, monthly, [rule-of-thumb]) and developer-tools agents section.
17. `call search_playbooks {"query":"lifetime deal pricing early adopters","limit":3}`: pricing "Lifetime deals [rule-of-thumb]": cap number and end date, compare with modelled lifetime value.
18. `call search_playbooks {"query":"deceptive claims data handling privacy accuracy marketing","limit":3}`: privacy-and-marketing-law (price claims, claim substantiation, dark patterns/fake urgency).
19. `call search_playbooks {"query":"launch sizing tiers relaunch timing","limit":3}`: market-sizing-and-timing sections (not directly useful).
20. `call search_playbooks {"query":"launches product launch tiers before during after","limit":3}`: launches-and-gtm (launch tiers, after-launch plan, before-launch checklist).
21. `call search_playbooks {"query":"activation metric define from retention data small sample","limit":3}`: self-serve-saas "Define activation from your data", developer-tools metrics, email metrics.
22. `call search_playbooks {"query":"competitive alternatives incumbents small company where to fight","limit":3}`: competitive-analysis (price wars), competing-with-incumbents (fight on a different axis, [research, snippet-only]), positioning category frames.
23. `call unit_economics {"arpaMonthly":16,"grossMargin":0.8,"monthlyChurn":0.05,"targetPaybackMonths":12}`: ltvSimple 256, ltvBounded 244.21, affordable cost per customer 117.67 (12-month payback) / 81.40 (3:1 ratio). Warning: no CAC given.
24. `call unit_economics {"arpaMonthly":20,"grossMargin":0.8,"monthlyChurn":0.03,"targetPaybackMonths":12,"horizonMonths":36}`: optimistic case: ltvBounded 355.19, affordable 163.28 / 118.40. The answer quotes "$81–118", the range across the two cases at the 3:1 ratio.
25. `call paid_media_math {"ltvGrossProfit":244,"cvr":0.01,"cpc":4,"targetCpa":81}`: implied cost per customer 400 against a break-even of 244. Verdict: "Each conversion loses money on this basis"; max CPC at break-even 2.44.
26. `call analyze_copy {"text":"See the queries your ORM is actually running. PlanView shows ..."}`: Flesch 88.3, grade 4.8, no flags. The hero copy is readable, so the problem is positioning, not wording.
27. `call check_answer {draft}`: 1,431 words (231 over); "HN" unexplained.
28. `call check_answer {revised draft}`: 1,146 words; "HN" still unexplained.
29. `call check_answer {final draft}`: 1,151 words, no problems.

Not called: audit_page, crawl_site and check_ai_crawler_access. dbtool.example is blocked from this sandbox, so no live page was checked. I found no robots.txt in apps/blog/public or apps/docs/public, so there was nothing to pass to check_ai_crawler_access. save_business_profile was not called because the founder hasn't confirmed any facts; the answer offers it instead.

Repo files opened (/home/user/site):
- VISION.md (full), README.md (full), CONTEXT.md (lines 1–140), docs/adr/README.md (ADR index with status column, lines 1–80)
- apps/blog/src/pages/index.astro (lines 1–520), apps/blog/src/pages/pricing.astro (lines 55–100, 215–270, 335–405), apps/blog/src/pages/getting-started.astro (lines 20–130), apps/blog/src/config.ts (head)
- apps/docs/src/content/docs/index.mdx, guides/introduction.md, guides/getting-started.md, guides/mcp-server.md (lines 1–120), guides/alerts.md, guides/ci-integration.md (lines 1–40), guides/using-with-llms.md (lines 1–40), guides/live-queries.md (lines 1–30), guides/self-hosting.md (lines 1–30), reference/analyzer.mdx (lines 1–64), reference/statistics.mdx (lines 1–30)
- docs/self-hostable-plan.md (lines 1–30, 95–100, 124–132, 174–178), docs/self-hostable-tickets.md (lines 15–26)

Searches and listings run on the repo:
- `ls` of the repo root, apps/, docs/ and docs/adr/
- `find apps/blog apps/docs -type f` (non-image files), and `ls` of apps/blog/public and apps/docs/public (no robots.txt found)
- `grep` for title/pubDate in apps/blog/src/content/blog/*.mdx: 6 posts, no date fields matched
- `git log` count and dates: one commit, dated 2026-10-03, so there is no history to read traction from
- `grep DISCORD_LINK` in packages/
- `ls docs/research docs/explorations docs/agents`, and `grep -i` for customer/pganalyze/competitor/marketing/pricing/ICP/user across docs/research, docs/explorations and the docs/*.md plans. This found "Zero customers" in self-hostable-plan.md:98 and no marketing or competitor research.
- `grep -i archiv` in docs/self-hostable-tickets.md; `grep` for open source/license in VISION.md and self-hosting.md; `license` field in package.json and packages/core/package.json (empty in core). No LICENSE file at the repo root.
