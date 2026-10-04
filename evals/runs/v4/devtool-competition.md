## Answer

**Short answer.** pganalyze, Datadog Database Monitoring and AWS Performance Insights tell a team what was slow after it ran in production. DBTool's own docs describe a different job: cost each query against a real Postgres planner, using production statistics, before the change merges, in the pull request and inside the coding agent. That is the axis to fight on. Yes, you are at risk of being a feature, in two places: a standalone "suggest an index" check is a feature any of them, or an agent with database access, can add. The pre-merge gate across clouds and agents, with your planner setup and run history, is closer to a product. But your website undersells that product and contradicts your docs on data handling, a bigger problem today than any competitor.

**Assumptions (labelled, not confirmed):**
- A1: Early stage: a small number of paying users, no repeatable channel yet. The pricing page ("We're small", a $100 lifetime deal, no team tier) fits this. If you already have steady paid growth, competition matters more and move 2 comes first.
- A2: Your best-fit customer is a small or mid-size team on Postgres, writing much of its data-layer code with agents, using an ORM (Drizzle, Prisma, TypeORM), and not paying for Datadog Database Monitoring.
- A3 (my own knowledge, unverified): pganalyze and Datadog price per monitored database host and sell mainly to teams that already run production monitoring. pganalyze has an index advisor. AWS has been moving Performance Insights into CloudWatch Database Insights. Performance Insights only covers AWS databases.

**What the repo shows (shipped, partial, planned):**
- CI gate on pull requests: shipped (docs/guides/ci-integration.md; ADR 0019 says the CI half was built 2026-08-24).
- MCP server for agents, with hooks for Claude Code and Cursor: shipped in the docs (guides/mcp-server.md, guides/using-with-llms.md; packages/mcp-server). **The website marks it "(soon)"** (index.astro:412, pricing.astro:71).
- Query rewrites: shipped in the docs (guides/how-optimization-works.md:51-57). The site says "(soon)" (pricing.astro:72).
- Local-only mode: planned on the site (index.astro:341). The docs say "No setting keeps the data on your machine" (reference/analyzer.mdx:30); self-hosting is shipped.

**Data-handling contradictions to fix before you pitch against Datadog:**
- getting-started.astro:35 says the analyzer will "extract 10 sample rows per table". The docs say the planner "holds no rows of yours" (how-optimization-works.md:16; analyzer.mdx:38).
- pricing.astro:263 tooltip says "Parameter values aren't included". analyzer.mdx:21 says pg_stat_statements can contain literal values.
- pricing.astro:364 says the analyzer is "a Docker container you run, with credentials you control", and the homepage tells users to `docker run` it. The docs say the instance stores the connection string and starts the Collector itself, with "no docker run command" (getting-started.md:18).
- Pro is $20 on the homepage (index.astro:403) and $16 on the pricing page (pricing.astro:65).
Database owners buy on trust; these lose the buyer before features come up.

**How each alternative compares (copying cost in their own revenue terms):**
- **pganalyze**: the closest fit for your buyer and the most likely to add a CI check. Nothing in its business model stops it. What stops it today is effort: ORM query extraction, a planner that matches each Postgres major version, injecting statistics. Assume it could copy you within a year if your category becomes visible.
- **Datadog**: bundling risk. If it adds a pre-merge check to what customers already pay for, the effective price is zero for its customers. Cede that segment. Datadog has little reason to serve small teams that don't buy it.
- **AWS**: AWS only. It won't build your neutrality across clouds, Supabase, Neon and self-hosted.
- **Coding agents**: these are your channel more than your competitor. An agent can run `EXPLAIN`, but against a dev database with 200 rows the answer is wrong. The real risk is an agent connected to a production replica, plus a free extension like HypoPG (it tests hypothetical indexes). Your answer is the CI gate, regression history and triage, which an agent session doesn't keep.
- **Do nothing** (run `EXPLAIN` by hand, or find out at 3 a.m.): probably your largest competitor.

This is a sustaining fight (better tools for teams who already care), which incumbents usually win, unless you stay where monitors don't go: before merge, across agents and clouds, priced for small teams.

**Three moves, in order:**

1. **Make the site match the docs.** Change the MCP and rewrites lines from "(soon)" to shipped. Rewrite every data-handling line to say what analyzer.mdx says. Pick one price.
   Mechanism: trust, and buyers see your real edge.
   Cheapest test: one edit pass, then rescan apps/blog.
   Metric: zero claims that conflict with the docs.
   Time box: one week.
   Stop condition: none; this is hygiene.

2. **Test the positioning with interviews.** Run 8-10 switch interviews with Postgres teams that use one of the three monitors or write most of their SQL with agents. Ask what they did the last time a slow query reached production, and whether a pull-request check would have changed it.
   Mechanism: it confirms or kills "before merge" as the reason to buy.
   Metric: how many name a pre-merge incident they would have paid to catch.
   Time box: four weeks.
   Stop condition: if most say their monitor plus an agent running `EXPLAIN` is enough, you are a feature for that segment. Look for the segment that disagrees before spending on reach.

3. **Get DBTool in front of agents.** List the MCP server in the official MCP Registry and the client directories, and lead the homepage with the agent-plus-CI loop instead of the PlanView visual.
   Mechanism: agents are where data-layer code is now written, and no monitor sits there.
   Metric: weekly active projects with a CI run, split by MCP client (guardrails.ts already detects Claude Code and Cursor).
   Time box: six weeks.
   Stop condition: no rise above your current weekly baseline (set it before you start).

**What not to do yet:** don't build a production monitoring dashboard to match pganalyze or Datadog feature for feature. Don't cut prices to compete. Don't promise local-only mode while the docs say the opposite. Don't put an LLM in the verdict; "proven, not guessed" is your difference. Don't change the open-source license.

**If a big player ships a pre-merge check:** defend small agent-heavy teams and multi-cloud setups. Cede Datadog's existing enterprise accounts. Don't match on price; answer with depth (rewrites, schema-change approval, triage). One person checks monthly: pganalyze's changelog, Datadog's DASH conference, AWS re:Invent (early December), and Anthropic and Cursor release notes.

**Evidence strength:** the platform-risk playbook's research is "seen via search snippets; nothing read in full". Competitor details are my own knowledge, unverified. I ran no calculators: I had no numbers.

**Open questions:**
1. How many active projects, paying users and CI runs per week do you have, and which source did they come from?
2. Have you lost a deal or user to pganalyze, Datadog or "the agent is enough"?
3. What share of new projects start from the MCP server?
4. Which statement about sample rows is true today: getting-started.astro or the docs?
5. Is your goal venture scale or a profitable small company? It changes how hard to fight pganalyze for the same buyer.
6. Shall I save these facts as a business profile?

## Tool log

MCP calls (in order; env MARKETING_EXPERT_DATA_DIR=evals/data/v4b-devtool-competition):
1. `instructions` — server instructions read (context first, diagnose, name alternatives, tools for numbers, playbooks, max three moves, check_answer).
2. `tools` — listed 22 tools.
3. `prompts` — listed 11 prompts, including competitive_strategy.
4. `call list_business_profiles {}` — returned `[]`; no stored profile.
5. `call scan_source {"dir":"/home/user/site/apps/blog"}` — 53 files; 39 data, 15 price, 14 availability, 9 setup, 19 proof claims. Flagged MCP/rewrites "(soon)", "Local-only mode", "extract 10 sample rows per table", "Parameter values aren't included", "container you run, with credentials you control", $20 vs $16 Pro price.
6. `call scan_source {"dir":"/home/user/site/apps/docs"}` — docs claims: Collector uploads schema, query text and pg_statistic values; "No setting keeps the data on your machine"; instance stores connection string and starts Collector, "no docker run"; MCP server and rewrites documented as shipped; alerts schema_drift/Discord/Email/PagerDuty "coming soon"; env flag DOCS_PORT only.
7. `call get_playbook {}` — list of playbooks.
8. `call search_playbooks {"query":"platform feature risk incumbents bundling","limit":6}` — 6 sections from platform-and-feature-risk (two risks, warning signs, feature/product tests, risk questions; sources "seen via search snippets").
9. `call get_playbook {"slug":"developer-tools"}` — business-type playbook: bottom-up adoption, docs as marketing, MCP Registry, agents as users, track MCP client usage, don't chase stars.
10. `call get_playbook {"slug":"platform-and-feature-risk"}` — absorption vs access risk, feature/product/company tests, what reduces risk (depth, neutrality, own the customer), warning signs; "All sources seen via search snippets; nothing read in full."
11. `call get_playbook {"slug":"competing-with-incumbents"}` — copy cost in P&L terms, sustaining fights favour incumbents, fight on a different axis, bundling (Teams), decision rules.
12. `prompt competitive_strategy {"company":"DBTool: Postgres query cost checks ... $16-20/mo Pro and $100 lifetime","competitors":"pganalyze, Datadog Database Monitoring, AWS Performance Insights, coding agents (Claude Code, Cursor)"}` — 9-step template (stage check, alternatives with shipped/partial/planned, copy cost, sustaining vs not, platform risk, protection, where to fight, pre-planned responses, warning signs).
13. `call search_playbooks {"query":"proprietary data switching costs defensibility bundling","limit":4}` — competitive-analysis sections: bundling vs point solutions, advantages don't last, price wars, procedure.
14. `call get_playbook {"slug":"competitive-analysis"}` — buyer-view alternatives incl. do nothing, defensibility evidence, data scale effects, bundling, price wars.
15. `call check_answer {text: draft v1}` — 1277 words, 77 over; no banned or unexplained terms.
16. `call check_answer {text: draft v2}` — 1221 words, 21 over.
17. `call check_answer {text: draft v3}` — 1214 words, 14 over.
18. `call check_answer {text: draft v4}` — 1205 words, 5 over.
19. `call check_answer {text: final}` — 1197 words, no problems (fingerprint 7b1c649681). The Answer section above is that exact text (sha256 abb0c177…).

No calculators run (no numbers available). No save_business_profile call (founder unavailable to confirm facts; offered in open questions).

Repo files opened (/home/user/site):
- VISION.md (whole), README.md (whole), CONTEXT.md (lines 1-150)
- apps/blog/src/pages/index.astro (lines 30-60, 195-220, 255-290, 330-350, 395-440, 455-500)
- apps/blog/src/pages/pricing.astro (lines 60-75, 258-266, 360-367, 395-400)
- apps/blog/src/pages/getting-started.astro (lines 28-50)
- apps/docs/src/content/docs/guides/mcp-server.md (lines 1-140)
- apps/docs/src/content/docs/guides/using-with-llms.md (lines 1-40)
- apps/docs/src/content/docs/reference/analyzer.mdx (lines 20-40)
- apps/docs/src/content/docs/guides/how-optimization-works.md (grep "rewrite": lines 51-57)
- apps/docs/src/content/docs/guides/self-hosting.md (lines 1-20)
- docs/adr/0019-analysis-runs-on-the-platform-the-collector-only-sends.md (lines 1-25)
- docs/adr/0026-the-platform-starts-the-monitor-collector.md (lines 1-15)

Searches run:
- `ls` of repo root, docs/adr, apps; `find` of apps/blog and apps/docs source files.
- `grep -rniE "pganalyze|datadog|performance insights|dbtune|pgmustard|explain.dalibo|cursor|claude code|copilot"` across the repo (md/mdx/astro/tsx/ts) — agent mentions in packages/mcp-server (guardrails.ts detects Claude Code and Cursor).
- `grep -rliE "pganalyze|datadog|performance insights|pgmustard"` across the whole repo — only apps/blog/src/content/blog/postgresql-explain-quirks.mdx (pgMustard credited); I found no mention of pganalyze, Datadog or Performance Insights anywhere in the repo.
- `grep -niE "pganalyze|datadog|pgmustard"` in postgresql-explain-quirks.mdx.
- `find -maxdepth 3 -iname 'LICENSE*'` — none found at that depth; `ls packages`.
