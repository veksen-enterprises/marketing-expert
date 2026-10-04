# DBTool: 90-day marketing strategy

## Answer

**Short version:** For the next 90 days, don't build a marketing machine. Do three things, in this order:
1. **Weeks 1–3:** decide what DBTool *is* and who it is for, then make the website say that, accurately.
2. **Weeks 3–8:** make "my coding agent set up DBTool CI on my repo" the main way people try it.
3. **Weeks 6–12:** write technical posts yourself (as founder) and do one Show HN, sent to the Postgres and TypeScript ORM communities by hand.

Skip paid ads, an SEO content calendar and enterprise sales for now. The numbers below show why.

### What I couldn't get from you, and what I assumed

I'd normally ask these first. Here are the assumptions I used instead. Each is labelled so you can correct it:
- **Current numbers** (signups per week, how many projects reach a first CI run, paying Pro and Lifetime users, churn). *Assumed:* under ~50 active projects, a handful of paying users, no reliable funnel data yet.
- **Goal.** *Assumed:* venture-style growth, meaning you want bottom-up adoption that later turns into a team plan. If this is a lifestyle business, moves 1 and 3 stay the same and the team-plan focus goes away.
- **Team and budget.** *Assumed:* founders only, about 30% of one founder's time, under $1k of cash spend.
- **Best current users.** *Assumed:* TypeScript/Node teams on Postgres using Drizzle or Prisma, running GitHub Actions. The docs say CI auto-detection is "Node-only today".

### What I found in your repo (these findings matter more than tactics)

Your VISION.md is clear. The product is a feedback loop for the data layer: an MCP server while the agent writes code, then a CI gate, then the comparison branch, then production. The marketing site tells a different and older story:
- **Two names.** The homepage sells "PlanView", a visualizer you point at a Postgres URL. The vision and docs sell "DBTool", the CI and agent gate. Visitors can't tell which one is the product.
- **Shipped features labelled "soon".** The site marks the MCP server as "(soon)" and Alerts as "on our radar". The docs show both as **shipped**: `guides/mcp-server.md` lists the tools, and `guides/alerts.md` covers Slack and webhook delivery. Schema-drift alerts are still "coming soon". Rewrites are marked "soon" on the site, but the docs glossary and ADRs 0031/0032 describe them as part of the engine, so I'd call them **partial**. Local-only mode and the team plan are **planned**. Self-hosting is **shipped**.
- **Price mismatch.** The homepage says Pro is $20/month. `/pricing` says $16/month.
- **Example mismatch.** The hero example is Rails (`orders_controller.rb`). Your sqlcommenter guides cover Drizzle, Prisma, TypeORM, MikroORM and EF Core, and CI setup detects Node only.

You are underselling the most distinctive part of the product: the agent and CI loop, backed by a real planner and no LLM guessing. That makes **positioning, not reach, the first constraint.** More traffic sent to a confusing page wastes your one Show HN.

### What people use instead (from my own knowledge, not verified)

- **Manual tools:** `EXPLAIN ANALYZE` plus plan visualizers (explain.dalibo.com, depesz), `auto_explain`, pg_stat_statements read by hand.
- **Monitoring products:** pganalyze (it has an index advisor), Datadog Database Monitoring, PgHero, and the advisors built into Supabase, Neon and other hosts.
- **Index tools:** HypoPG with Dexter.
- **Migration linters:** squawk, Atlas.
- **Asking an LLM** to read the SQL.
- **Most common of all:** doing nothing until there's an incident.

Almost all of these work after the fact or need production access. Your edge is *before merge, inside the agent, proven by the planner*. Say that.

### The economics (tool output, using assumed numbers)

Inputs: `unit_economics` with $16/month, 80% gross margin and 5% monthly churn (all assumptions). Results: lifetime gross profit about **$244–256**, and the most you can afford to pay per customer is **$118** (for a 12-month payback) or **$81** (for a 3:1 LTV:CAC ratio).

Inputs: `paid_media_math` with a $5 cost per click (CPC) and 1% of clicks becoming paying users (both guesses). Result: CPA (cost per paying customer) of **$500** against break-even of $244. The tool's verdict: *"Each conversion loses money."*

At $16 a month, only near-free channels work: agents, docs, community, founder content. Two more points from the same output:
- **The $100 Lifetime deal is below the modelled lifetime value of a Pro user ($256).** Keep it capped as an early-backer offer.
- **The real money is a team plan.** You'll need one before any paid channel can make sense.

### The three moves

**1. Positioning and site accuracy (weeks 1–3)**
- *Mechanism:* developers judge the product by its homepage and docs. If the page says MCP is "soon", people who would use it through an agent leave.
- *Cheapest test:*
  - Hold 8–10 short calls with your most active users. Ask "When did a slow query last bite you? What did you do?" (Mom Test style: ask about past events, not opinions on your idea).
  - Pick one name and one story. My suggestion: *"Postgres query review for your coding agent and CI. A real planner, not a guess."* Aim it at TypeScript teams on Postgres.
  - Fix the four mismatches above. Make the hero example Drizzle or Prisma.
- *Metric:* the share of site visitors who start the quickstart, plus whether 5 of the 8–10 interviewees describe the product back to you in your words.
- *Stop or change if:* the interviews show the people who stay care about the production dashboard, not CI or agents. Then position around that instead.
- *Evidence:* April Dunford's positioning method and Mom Test interviewing. Both are practitioner methods, not controlled research.

**2. The agent and CI path as your main way in (weeks 3–8)**
- *Mechanism:* your docs already say "ask your agent to set up DBTool CI for this repo." Agents are both your users and a channel.
- *Cheapest test:*
  - List the MCP server in the official MCP Registry and in client directories.
  - Publish the GitHub Action on GitHub Marketplace.
  - Make `skill.md` the first step of the quickstart.
  - Time 5 clean-machine runs from "nothing installed" to the first PR comment.
- *Metric:* activation, defined as the share of new projects that get a first CI run with a PR comment within 7 days. Also track **weekly active projects** (not signups or GitHub stars). Log the MCP client name so agent-sourced use shows up as its own channel.
- *Stop or change if:* after 6 weeks, fewer than about 1 in 4 new projects reach a first CI run. Then fix setup friction before adding any traffic. That threshold is my judgement, not a benchmark.
- *Evidence:* MCP Registry and GitHub Marketplace rules come from the platforms' own documentation. "Docs are the marketing" is practitioner advice.

**3. Founder-led technical content and one Show HN (weeks 6–12)**
- *Mechanism:* your Codex/SQLite tracing post shows you can write deep, credible engineering posts, and developers trust those.
- *Cheapest test:*
  - Write 3 posts. Each takes a real query that is fast at 200 rows and slow at 10M rows, in Drizzle or Prisma code. Use **reproducible** methods: publish the schema, statistics and versions, and say "cost", not "time", as VISION.md requires.
  - Post each by hand to r/PostgreSQL and the Drizzle and Prisma communities, following each community's self-promotion rules.
  - Run Show HN only after move 2 makes trying the product take minutes, with no sign-up wall in front of the playground. HN rules require that someone can actually play with it.
- *Metric:* activated projects whose "How did you hear about us?" answer names a post or HN.
- *Stop or change if:* 3 posts bring fewer than ~10 activated projects. Then change the topic angle before writing more.
- *Evidence:* practitioner advice plus HN's own posting rules.

**Timing (from my own knowledge, not verified):** PostgreSQL's yearly major release usually ships in late September or October, and PGConf.EU is usually in late October. A "what changed in the planner in PG 19" post fits this window. Avoid launching in US Thanksgiving week or late December.

### Not yet
- **Paid ads.** The tool's verdict above says they lose money.
- **SEO volume content.** It's slow, and nobody searches for your category yet.
- **Enterprise or outbound sales,** or announcing the team plan before it ships.
- **AI-written posts.** They would undercut "proven, not guessed".
- **Counting stars or downloads as traction.**
- **Running more than these three things at once.**

Want me to save these facts (product, ICP, alternatives, pricing, the open questions) as a business profile? Then the next session can start from your real numbers.

## Tool log

MCP commands (all run with `MARKETING_EXPERT_DATA_DIR=/home/user/marketing-expert/evals/data/v2-devtool-strategy`, from /home/user/marketing-expert):
1. `node scripts/mcp.mjs instructions`: returned the operating rules (context first, diagnose, name alternatives, use tools for numbers, playbooks, at most 3 moves, respect vision, under ~1,200 words). I followed them for the answer's structure.
2. `node scripts/mcp.mjs tools`: returned the list of calculators, audits, profile and playbook tools. I used it to choose the tools below.
3. `node scripts/mcp.mjs prompts`: returned the workflow prompts. I chose `marketing_strategy`.
4. `node scripts/mcp.mjs call list_business_profiles '{}'`: returned `[]`, so there was no stored profile. I gathered context from the repo and offered to save a profile at the end.
5. `node scripts/mcp.mjs prompt marketing_strategy '{"business":"DBTool","goal":"90-day marketing strategy","budget":"unknown"}'`: returned the steps (playbook, alternatives, constraint, economics, 3 channels, 90-day plan, evidence, not-yet). This set the answer's structure.
6. `node scripts/mcp.mjs call get_playbook '{}'`: returned the list of playbooks. I picked `developer-tools`.
7. `node scripts/mcp.mjs call get_playbook '{"slug":"developer-tools"}'`: covered docs as marketing, Show HN rules, MCP Registry, GitHub Marketplace, agents as users, stars as a weak signal, and what works by stage. This is the basis for moves 2 and 3 and for "not yet".
8. `node scripts/mcp.mjs call get_playbook '{"slug":"channel-strategy"}'`: covered Bullseye, channel-model fit (low ARPU needs low-CAC channels) and "one channel over five". I used it to rule out paid ads and sales and to limit the plan to three moves.
9. `node scripts/mcp.mjs call search_playbooks '{"query":"early stage diagnose constraint positioning before acquisition few users","limit":5}'`: returned diagnosis sections (landing page: wrong traffic or unclear offer). This supported calling positioning the first constraint.
10. `search_playbooks` "positioning competitive alternatives April Dunford order": returned Dunford's components and 10-step order. I used it in move 1.
11. `search_playbooks` "Show HN launch spike activation plan": said the spike fades and the launch cohort's activation should be planned. I used it for the sequencing in move 3.
12. `search_playbooks` "activation definition freemium product qualified": covered self-serve activation mistakes and product-qualified leads. I used it for the activation metric and to say "team plan later".
13. `search_playbooks` "founder-led content distribution before creation": said founder-led posts and hand distribution suit the early stage. I used it in move 3.
14. `search_playbooks` "platform risk feature absorbed by platform": covered feature vs product tests. Used as background for "hosts' built-in advisors" among the alternatives.
15. `search_playbooks` "customer interviews switch interviews Mom Test": returned Mom Test rules and the 8–12 interview guideline. I used it in move 1.
16. `node scripts/mcp.mjs call unit_economics '{"arpaMonthly":16,"grossMargin":0.8,"monthlyChurn":0.05,"targetPaybackMonths":12}'`: returned LTV of $256 (simple) and $244 (bounded), with max CAC of $117.67 (12-month payback) or $81.40 (3:1). Quoted in the economics section.
17. `node scripts/mcp.mjs call unit_economics '{"arpaMonthly":16,"grossMargin":0.8,"monthlyChurn":0.05,"cac":300,"horizonMonths":36}'`: with a $300 CAC, LTV:CAC is 0.85 and the warning was "CAC is never paid back". This confirmed that high-CAC channels are out.
18. `node scripts/mcp.mjs call paid_media_math '{"aov":16,"margin":0.8,"ltvGrossProfit":244,"cvr":0.01,"cpc":5,"targetCpa":117}'`: returned an implied CPA of $500 against a $244 break-even, a max CPC of $2.44, and the verdict "Each conversion loses money". Quoted to rule out paid ads.

Repo files read (/home/user/site):
- `VISION.md`: product, the four gates, values ("proven, not guessed", "actionable, not noisy"). Used for the positioning and the vision checks.
- `README.md`: monorepo layout.
- `CONTEXT.md` (first ~200 lines): glossary, including Rewrite and Index Search, which is the evidence that rewrites are partly shipped.
- `docs/adr/` (file list only), with ADR titles 0019, 0026, 0031 and 0032 consulted by name.
- `apps/blog/src/pages/index.astro`: homepage. Found the PlanView naming, MCP "(soon)", Alerts "on radar", $20 Pro, the Rails example, and the $100 Lifetime offer.
- `apps/blog/src/pages/pricing.astro` (grepped): found $16/month Pro, and MCP and rewrites marked "soon".
- `apps/blog/src/content/blog/*.mdx` (front matter), plus the start of `tracing-codexs-640tb-year-sqlite-writes.mdx`.
- `apps/docs/src/content/docs/guides/mcp-server.md`: MCP shipped.
- `apps/docs/src/content/docs/guides/alerts.md`: alerts shipped, schema_drift "coming soon".
- `apps/docs/src/content/docs/guides/introduction.md`: what the product does and what it uploads.
- `apps/docs/src/content/docs/guides/ci-integration.md` (start): GitHub Actions; agent setup is "Node-only today".
- Grep over `apps/docs/src/content` for other stacks (Rails, Django and so on): none found.
- `apps/blog/public` and `apps/docs/public` listings: no robots.txt in the repo, and `skill.md` exists.

Not used: no live site audit (websites are blocked), no WebSearch or WebFetch. Competitor names and conference and release timing come from my own knowledge and are labelled unverified.
