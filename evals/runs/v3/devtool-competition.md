## Answer

**Short answer.** You don't beat pganalyze, Datadog or Performance Insights by being a better production monitor; that fight is about money and sales staff, and they win it. You compete *before the merge*: while the agent writes the query and in CI on the pull request, using production statistics, with no production access needed. The monitors start too late in the cycle for that, and the coding agents don't have the planner, the statistics or the history. Some of what you do is already a feature: "explain this one query and suggest an index" will be done well enough by agents plus free Postgres tools. The product is the pre-merge gate. It costs queries with a real planner under production statistics, compares them with a stored baseline, maps them to the line of code and runs inside whichever agent the developer uses. Sell that, and stop marketing the parts that are only a feature.

One caution first. I have no numbers from you (users, paying accounts, activation, churn). If you are still early, competition is probably not what limits your growth today. Reach and a clear position are more likely limits, and the moves below are chosen to work either way.

**What the repo shows (shipped / partial / planned)**
- Shipped per docs and code: CI gate with PR comment (docs `guides/ci-integration.md`); MCP server, both hosted at `/mcp` (`guides/mcp-server.md` lines 6–9) and a local package with `explain_query`, `optimize_query`, `simulate_with_index` (`packages/mcp-server/src/server.ts` line 68); agent guardrail hooks (`guides/using-with-llms.md`); production statistics (ADR 0007 status: "has since shipped, apart from the Site cron"); rewrites (ADRs 0031/0032; docs intro line 37 "or the rewritten SQL"); Slack/webhook alerts (`guides/alerts.md`); self-hosting (`guides/self-hosting.md`); source mapping for Drizzle, EF Core and others.
- **Your site says much of this doesn't exist yet.** Homepage "On our radar" lists Alerts, MCP, Query rewrites and Local-only mode (`apps/blog/src/pages/index.astro` ~lines 320–345). Pricing marks MCP and rewrites "(soon)" (`pricing.astro` lines 74–75, 279–290). The FAQ says "We're working on a fully self-hosted / offline mode" (line 365). The two things that answer your question best, agent integration and self-hosting, are hidden from the people deciding between you and Datadog.
- Other contradictions to fix:
  - Pro costs **$20** on the homepage (`index.astro` line 403) and **$16** on pricing (`pricing.astro` line 65).
  - Credentials: the FAQ says the analyzer is "a Docker container *you* run, with credentials *you* control" (line 364), and the homepage says "No agents to install on prod" (line 241). The docs say that in monitor mode "Connecting a database in the app stores the connection string, and the instance runs the container itself" (`reference/analyzer.mdx` line 12; `mcp-server.md` lines 87–89; ADR 0026).
  - Parameters: a pricing tooltip says "Parameter values aren't included" (line 263). The docs warn that `pg_stat_statements` "can contain real query text, including literal parameter values" (`analyzer.mdx` line 21).
  - The pricing tooltip says "Real Postgres planner… not a simulator" (line 167). The homepage table says "simulated planner choices" (line 216).
  - Pricing claims an OSI-approved open-source analyzer (line 302). I found no LICENSE file in `apps/analyzer/` or at the repo root, and the MCP package has `"license": ""`. It may live in another repo; check it.
  These matter competitively. A buyer comparing you with Datadog asks about data handling first. Today your docs are more honest than your site.

**The alternatives that matter (my knowledge, unverified)**
- **pganalyze**: Postgres specialist with an index advisor. It is the most likely to copy you, because adding pre-merge checks fits its product and nothing it earns would suffer. Assume it could.
- **Datadog DBM**: sold per monitored host to platform/SRE teams. A free check at development time doesn't grow its host count, so it has little reason to build one. It is a weak barrier, not a strong one.
- **AWS Performance Insights**: RDS/Aurora only and production-only. I believe AWS is moving it into CloudWatch Database Insights; check this.
- **Coding agents (Claude Code, Cursor)**, plus free Postgres MCP servers and database platforms' own index advisors (Supabase, Neon). These are the real "feature" risk, for the single-query step.
- **Doing nothing**: run `EXPLAIN` by hand and find out in production. This is probably your biggest competitor.

**Are you a feature?** Use the playbook's test (synthesis, "seen via search snippets"): a *feature* is "one step of a workflow the platform already owns"; a *product* "owns a full job". The single-query optimizer is a step the agent owns, and the agent vendors will improve it every month. The pre-merge job is not owned by the agent vendors: production statistics without production access, a baseline per project, a repo-owned severity and triage, and the same verdict in the agent and in CI (VISION.md lines 80–83, 111–122). Two things lower the risk. You are neutral across agents (Claude Code, Cursor, Zed), "something no single platform owner would build well" (the Dropbox pattern). And MCP is an open standard. One thing raises it: your own docs admit "agents often don't" call the tool (`using-with-llms.md` lines 5–8), so you depend on the agent choosing you.

What protects you now: a different place in the cycle (before the merge), neutrality across agents, and self-hosting with the planner, which SaaS monitors don't offer. What to build next, in order: switching costs from stored baselines and triage history (real value, not trapped data), team-wide use per repo, then reputation. Evidence strength: the incumbent and platform research is real but mostly "seen via search snippets"; counter-positioning and "fight on a different axis" are practitioner frameworks, not tested rules.

**Three moves, in order**

1. **Ten switch interviews in two weeks** (5 active users, 5 who signed up and stopped). Ask what they used before, what they compared you with, and what they would do if Claude Code or Cursor did this alone. *Mechanism:* it tells you whether you are fighting the monitors, the agents or "do nothing". *Metric:* how many name a monitor vs an agent vs nothing. *Stop/change:* if most never considered a monitor, drop monitor comparisons from the site completely.

2. **A reproducible agent benchmark.** Take 20–30 real slow queries with production-shaped statistics. Run Claude Code and Cursor alone, then with the DBTool MCP, and judge each answer by the planner cost. Publish the code, versions and settings, including the cases where you lose. *Mechanism:* it turns "are we a feature?" into evidence, and it becomes your best technical content and a sales argument. *Time box:* 3 weeks. *Metric:* share of tasks where the agent alone reaches the same plan cost. *Stop/change:* if agents alone match you on most tasks, stop charging for single-query optimization and price and market only the CI gate, baselines and history. Re-run it after each major agent release.

3. **Rewrite the homepage and pricing around the pre-merge gate, for the developer and their agent.** Show MCP, rewrites, alerts and self-hosting as shipped, and make the data and credential claims match `analyzer.mdx` line by line. The factual corrections shouldn't wait for moves 1–2. *Mechanism:* buyers can't choose a capability you tell them doesn't exist. *Cheapest test:* ship it and compare the 4 weeks before with the 4 weeks after (not an A/B test, because traffic is unknown). *Metric:* share of new sign-ups that connect MCP or CI within 7 days. *Stop/change:* if that share doesn't move, the problem is activation, not positioning.

**What not to do yet**
- Don't build production dashboards to match pganalyze or Datadog feature for feature. That is the axis where their money wins.
- Don't cut price to compete. At $16–20 price isn't the issue.
- Don't add model-generated answers to "keep up" with agents. It breaks "Proven, not guessed" (VISION.md line 129), which is your main difference.
- Don't present "No LLMs" as an attack on agents. You are the tool agents call, not their rival.
- No paid acquisition until activation is measured.

**Watch** (founder, monthly): Anthropic, Cursor and GitHub release notes for built-in database tooling; pganalyze's changelog for CI or pre-merge features; AWS re:Invent (early December) for Database Insights; MCP client terms. Pre-decide: if a big player ships a pre-merge check, defend agent-plus-CI teams on Drizzle/Prisma and self-hosted instances, cede pure production monitoring, and don't match their price.

**Assumptions (labelled):** early stage, fewer than about 100 paying accounts (A1); the buyer is a backend team on Postgres using an ORM, with the developer deciding (A2); the founder's goal is a sustainable company rather than venture scale (A3). If A3 is wrong and you are raising, absorption risk weighs more and move 2 becomes urgent. If A1 is wrong and you have many paying teams, add win/loss analysis on real deals.

**Open questions**
1. Users, paying accounts, MRR, monthly churn, and how many accounts use MCP or CI?
2. Who pays today: individual developers or teams? Have security reviews blocked any deals?
3. Where is the analyzer licensed, and what is that license?
4. Is the homepage or the pricing page the current price?
5. Do deals or sign-ups mention pganalyze or Datadog by name?
6. What is your goal: venture-scale, bootstrapped or lifestyle?

I can save the confirmed facts as a business profile once you check them.

## Tool log

MCP calls (all with `MARKETING_EXPERT_DATA_DIR=.../evals/data/v3-devtool-competition`), in order:
1. `instructions`: server rules (context first, shipped/partial/planned, at most 3 moves, plain words, no "moat").
2. `tools`: listed 19 tools (calculators, audits, profiles, playbooks).
3. `prompts`: listed 11 prompts incl. `competitive_strategy`.
4. `call list_business_profiles {}`: `[]`, no stored profile.
5. `prompt competitive_strategy {"company":"DBTool: Postgres query cost analysis (real planner, production statistics) in MCP for coding agents, CI on PRs, and live monitoring; open-source collector; free + $16-20/mo Pro","competitors":"pganalyze, Datadog Database Monitoring, AWS Performance Insights, coding agents (Claude Code, Cursor)"}`: steps: stage check, alternatives, copy cost, sustaining vs not, platform risk questions, protections, where to fight, pre-planned responses, warning signs; read three playbooks.
6. `call get_playbook {}`: listed 46 playbooks.
7. `call get_playbook {"slug":"platform-and-feature-risk"}`: absorption vs access risk; feature/product/company test; Dropbox neutrality; warning signs; 10 risk questions; "All sources seen via search snippets".
8. `call get_playbook {"slug":"competing-with-incumbents"}`: "what stops them copying, in P&L terms"; counter-positioning; different axis; incumbent responses; decision rules.
9. `call get_playbook {"slug":"developer-tools"}`: business-type playbook: docs as marketing, honest reproducible benchmarks, MCP/agents as users, self-hosting, metrics.
10. `call get_playbook {"slug":"competitive-analysis"}`: buyer-view alternatives incl. "do nothing", win/loss interviews, switching costs, bundling, price-war sequence.
11. `call search_playbooks {"query":"coding agents MCP feature risk model provider","limit":5}`: developer-tools agents section; ai-assistant-visibility "coding agents are a separate audience" (test directly with an agent); absorption-reduction list.
12. `call search_playbooks {"query":"early stage constraint competition not the problem diagnosis","limit":3}`: retention playbook sections only, not used.
No calculators run: no numbers were available to compute.

Repo files opened (/home/user/site, read-only, not modified):
- `VISION.md` (full), `README.md` (full), `CONTEXT.md` (lines 1–150)
- `apps/blog/src/pages/index.astro` (lines 1–~420)
- `apps/blog/src/pages/pricing.astro` (lines 1–404)
- `apps/docs/src/content/docs/guides/introduction.md` (1–59), `guides/mcp-server.md` (1–100), `guides/self-hosting.md` (1–40), `guides/using-with-llms.md` (1–40), `guides/alerts.md` (1–25), `guides/source-code-mapping.mdx` (grep only)
- `apps/docs/src/content/docs/reference/analyzer.mdx` (1–50)
- `docs/adr/0019-...md` (1–30), `docs/adr/0026-...md` (1–20), `docs/adr/0007-...md` (1–12)
- `packages/mcp-server/package.json` (grep), `packages/mcp-server/src/server.ts` (60–75), `packages/mcp-server/src/tools/index.ts` (grep hits)

Searches run:
- `ls` of repo root, `docs`, `docs/adr`, `apps`, `apps/blog`, `apps/docs`; `find apps/docs -name "*.md*"`
- `grep -rniE "pganalyze|datadog|performance insights|cursor|claude code"` (whole repo, file list)
- `grep -rniE "pganalyze|datadog|performance insights|pgMustard|pghero|depesz|dalibo"` (whole repo excl. node_modules): only pgMustard and depesz in a blog post and a docs page; no pganalyze/Datadog/Performance Insights mentions found
- `grep -rniE "Claude Code|\bCursor\b|Windsurf|Copilot"` in apps/blog, apps/docs, docs, VISION.md
- grep in index.astro / pricing.astro for price, credential, parameter, simulator, LLM claims (line numbers)
- grep of FAQ blocks in pricing.astro
- `ls packages/mcp-server/src/tools`; grep for tool names (`explain_query|suggest_indexes|predict_at_scale|optimize_query`): `suggest_indexes` and `predict_at_scale` (shown on pricing) not found as tool names; `explain_query`/`optimize_query`/`simulate_with_index` exist
- `ls apps/analyzer`, `ls LICENSE*` at root: no LICENSE file found in either place
- `git log -5` (latest commit 2026-10-03); `git status` (branch staging, clean)
