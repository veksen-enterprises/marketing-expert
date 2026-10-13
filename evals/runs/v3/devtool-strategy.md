# DBTool: 90-day marketing strategy

## Answer

**Short answer:** For the next 90 days, don't spend money on reaching more people. Your site sells a product that is no longer the one in your docs. The homepage says "docker run", "credentials you control", "run it on your own machine" and "MCP (soon)". The docs say the hosted service stores your connection string, analysis runs on your servers, and MCP has already shipped. So the first job is to make one clear promise that is true. Then find out from real users whether that promise brings people to a working CI check. Only after that, do one launch to developers. I'm guessing at your numbers, so the assumptions come first.

**Assumptions (correct me and the plan changes):**
- A1. You have few users and few paying customers, and fewer than about 100 site visitors a day. If you already have dozens of projects with CI runs every week, skip to Move 3.
- A2. You are bootstrapping, or want revenue before raising. The $20/mo and $100 lifetime prices suggest this. If you're raising venture money, the order stays the same but you'd add a team plan sooner.
- A3. Your best-fit users are TypeScript/Node teams (Drizzle or Prisma) on Postgres who use GitHub Actions and often have an AI agent writing their data-layer code. My reasons: VISION.md says Drizzle is the reference adapter, and ci-integration.md L11 says "Detection is Node-only today".
- A4. The Pro price is $20/mo at an assumed 80% gross margin.

**What your repo shows (status as your docs describe it; I did not run the app):**
- Shipped: the CI gate on GitHub Actions (ADR 0019, "CI half built 2026-08-24"), the MCP server over HTTP (docs guides/mcp-server.md), alerts except schema drift (alerts.md L29), and self-hosting (guides/self-hosting.md).
- Partial: live monitoring. You get queries and call counts, but getting-started.md L99 says "Plans come from CI". So connecting a database URL alone gives no index advice.
- Shown as shipped in the docs but "soon" on the site: MCP, rewrites (introduction.md L37, ADRs 0031–0032) and alerts.
- Planned: local-only mode, and a team plan. The team plan is "shipping next" on the homepage, but pricing.astro L414 says "We don't have a team tier yet".

**Claims on the site that the docs contradict. Fix these first; they are trust and legal problems, not copy tweaks:**
1. Who holds the database password. Pricing FAQ (pricing.astro L364): "a Docker container you run, with credentials you control". The docs say otherwise: getting-started.md L77 says "The instance stores the string… There is no `docker run` command", and analyzer.mdx L12 says "You do not start it". The homepage still shows `docker run` (index.astro L265, L495).
2. Where your data goes. Homepage L481–483 says you can "run it on your own machine" and "audit the output". The docs disagree: analyzer.mdx L30 says "No setting keeps the data on your machine", and ADR 0019 says the Collector "never analyses", so the open-source part produces no output to audit. The only way to keep data in-house is self-hosting the whole platform. apps/api/package.json L6 is "UNLICENSED". I found no LICENSE file in the repo root, apps/ or packages/, and I could not check the separate analyzer repo.
3. What a database URL alone gets you. The hero (index.astro L47–49) says "Point it at a Postgres URL and it flags… the indexes that fix them". The docs say index advice comes from CI runs only (getting-started.md L99).
4. MCP. The site lists stdio tools named `explain_query`/`suggest_indexes` as "soon" (pricing.astro L120–126). The docs describe a shipped HTTP server with `doctor`, `optimize_query` and other tools.
5. Stack. The hero example is Rails (`orders_controller.rb`, index.astro L62). I found no Rails setup guide in apps/docs, and CI detection is Node-only.
- To check: mcp-server.md L70–71 says the CI read tools "work anonymously". Make sure that can't expose another project's CI data.

**The diagnosis.** The constraint is positioning plus activation, not reach. Activation means a new user getting their first real result: here, a CI comment on a pull request. The homepage promises a 60-second docker install; the real path is a GitHub Actions setup that needs a test suite. **What would prove me wrong:** if most signups already reach a CI run and keep running it weekly, then the problem is reach, and you should start with Move 3.

**What buyers use instead** (from my own knowledge, not verified): pganalyze; Datadog or AWS Performance Insights; Supabase's index advisor; Dexter/HypoPG; pasting EXPLAIN into ChatGPT or Claude; most often, nothing until production is slow. Your difference: the planner checks queries before merge and inside the agent's loop.

### Three moves, in order

**1. Talk to 10 people who connected CI (weeks 1–3).** Query your database for everyone who got a CI comment, and do switch interviews: what happened the day they went looking, what they tried, what nearly stopped them. The customer-research playbook suggests 8–12 interviews per segment (that line has no evidence tag). Turn the answers into one positioning document using April Dunford's order: alternatives → what only you have → value → who cares most → category. The playbook labels this [practitioner], wording from secondary summaries.
- Cost: your time.
- Metric: how many interviewees name the same trigger (for example "an agent-written query was slow in prod").
- Stop condition: if fewer than 5 people ever reached a CI run, interview 10 Drizzle/Node teams from Discord and the Drizzle community instead, and offer to wire up CI for them yourself.

**2. Rewrite the homepage and pricing page to match the positioning and the shipped product (weeks 3–6).** Make one call to action: "ask your agent to set up DBTool CI" (the MCP plus skill.md path). Put an accurate data-flow section on the page, and fix items 1–5 above.
- Metric: share of new signups with a first CI comment within 7 days, compared weekly against the pre-change cohort.
- Don't A/B test this. At an assumed 100 visitors a day and 2% conversion, ab_test_sample_size needs 9,798 visitors per variant (196 days) to detect a 30% lift. Its own note says to "ship on judgement and monitor".
- Stop condition: if 7-day activation hasn't moved after 4 weeks of signups, the blocker is setup, not the message. Hand-hold setups instead.

**3. One developer launch once setup takes under 15 minutes on a clean repo (weeks 7–10, aim for mid-November, before US Thanksgiving).** Post a Show HN with a reproducible technical write-up, for example "queries an AI agent wrote that pass in dev and degrade at 10M rows", with the code. In the same week, list the MCP server in the official MCP Registry and post in the Drizzle community.
- HN rules require that people can try it "without barriers such as signups" [first-party]. The anonymous MCP CI tools or a public demo run could serve.
- Metric: activated projects from the launch cohort and their week-4 retention, not upvotes or stars.
- Stop condition: if fewer than 10% of launch signups reach a CI comment, go back to Move 2. Don't launch again.

Evidence note: the developer-tools playbook is marked "Mostly from search snippets; see caveats there". The activation method is [practitioner: Lenny Rachitsky's method]. Bullseye ("one channel working well beats five") is [practitioner].

### What not to do yet
- **Paid ads.** With an assumed 6% monthly churn, unit_economics puts lifetime gross profit at $238 per Pro customer (36-month horizon). At an assumed $3 cost per click and 1% click-to-paid, paid_media_math's verdict is: "Implied CPA 300.00 exceeds break-even (237.92…). Each conversion loses money." The affordable acquisition cost was $52–$163 across 3–10% churn.
- **Selling more Lifetime deals.** $100 is below the modelled lifetime gross profit in every scenario I ran ($156–$355). "Everything Pro does, forever" also gives away MCP, rewrites and unlisted shares. Playbook [rule-of-thumb]: cap the number and end date, and say exactly what is covered.
- **A team plan, enterprise sales, conference sponsorships, SEO programs, or support for new stacks (Rails).**
- **A rebrand.** Just pick one of "PlanView"/"DBTool" in Move 2.

### Open questions
1. Your numbers: signups, projects with ≥1 CI run, weekly active projects, Pro and Lifetime counts, monthly churn, site visitors per day.
2. Is this venture-scale or bootstrapped, and is it you alone?
3. On the hosted service, is the stored connection string encrypted, and who can read it?
4. Is the analyzer/Collector repo open source, and under which license?
5. Can anonymous MCP calls read any project's CI runs?
6. Are rewrites and alerts actually live in production, or only in the docs?

Want me to save the confirmed facts as a business profile once you've answered?

## Tool log

MCP (cwd /home/user/marketing-expert, MARKETING_EXPERT_DATA_DIR=evals/data/v3-devtool-strategy):
1. `instructions`: server rules (context first, check claims line by line, tools for numbers, at most 3 moves, under ~1,200 words).
2. `tools`: listed 19 tools.
3. `prompts`: listed 11 prompts.
4. `call list_business_profiles {}`: `[]`, no stored profile.
5. `prompt marketing_strategy {"business":"DBTool: Postgres query-performance tool… Free (2 projects), Pro $20/mo, Lifetime $100…","goal":"90-day marketing strategy; first paying/active users","budget":"unknown, assumed near-zero cash, founder time"}`: 8-step method (playbook, alternatives, constraint, economics, 3 channels, 90-day plan, evidence, what not to do).
6. `call get_playbook {}`: list of 47 playbooks; picked developer-tools.
7. `call get_playbook {"slug":"developer-tools"}`: who uses vs pays, docs as the main marketing surface, Show HN rules [first-party], MCP Registry [first-party], stage guidance; sources "Mostly from search snippets".
8. `call search_playbooks {"query":"first customers early stage developer tool diagnose constraint positioning before acquisition","limit":6}`: retention diagnosis, devtools by stage, landing-page diagnosis order, devtools trust.
9. `call search_playbooks {"query":"customer interviews switch JTBD early users","limit":4}`: customer-research method table, switch interview script (8–12 per segment), common mistakes.
10. `call search_playbooks {"query":"positioning competitive alternatives category Dunford when nobody understands what the product is","limit":4}`: Dunford components [practitioner], order, "when positioning is the problem"; sources note "secondary summaries".
11. `call search_playbooks {"query":"activation defined from retention data freemium onboarding time to value","limit":4}`: freemium/trial summary, time-to-value [practitioner], self-serve sources caveat (search snippets).
12. `call search_playbooks {"query":"Bullseye channel testing small budget cheap tests sequencing","limit":3}`: sequencing rules, Bullseye [practitioner], beachhead GTM.
13. `call search_playbooks {"query":"define activation metric aha moment self-serve correlation retention","limit":2}`: activation method [practitioner: Rachitsky], benchmarks with caveats.
14. `call search_playbooks {"query":"lifetime deal early adopters pricing discount risk","limit":3}`: lifetime deals [rule-of-thumb] (financing decision; cap; "everything coming" risk).
15. `call unit_economics {"arpaMonthly":20,"grossMargin":0.8,"monthlyChurn":0.03,"horizonMonths":36,"targetPaybackMonths":12}`: LTV simple $533, bounded $355; max CAC $163 (payback) / $118 (3:1).
16. `call unit_economics {… "monthlyChurn":0.06 …}`: LTV bounded $238; max CAC $140 / $79.
17. `call unit_economics {… "monthlyChurn":0.10 …}`: LTV bounded $156; max CAC $115 / $52.
18. `call paid_media_math {"ltvGrossProfit":237.92,"cvr":0.01,"cpc":3}`: implied CPA $300 vs break-even $237.92; verdict: each conversion loses money.
19. `call ab_test_sample_size {"baselineRate":0.02,"mde":0.3,"dailyTrafficTotal":100}`: 9,798 per arm, 196 days; "ship on judgement and monitor".

No audit_page/crawl_site was run: dbtool.example is blocked from this sandbox, so nothing on the live site was checked. I found no robots.txt in apps/blog/public or apps/docs/public, so check_ai_crawler_access was not run. No save_business_profile call (facts not confirmed by the founder).

Repo files opened (/home/user/site, read only):
- VISION.md, README.md, CONTEXT.md (first ~150 lines)
- apps/blog/src/pages/index.astro (text extracted with line numbers), apps/blog/src/pages/pricing.astro (text extracted; FAQ L358–366), apps/blog/src/config.ts, apps/blog/src/consts.ts
- apps/blog/src/content/blog/*.mdx frontmatter (6 posts; latest 2026-06-25, PlanView intro 2023-07-08)
- apps/docs/src/content/docs/guides/introduction.md, getting-started.md, mcp-server.md (L1–120), alerts.md (L1–30), ci-integration.md (L1–60), self-hosting.md (L1–80); reference/analyzer.mdx; index.mdx (L1–40)
- docs/adr/0019-analysis-runs-on-the-platform-the-collector-only-sends.md, docs/adr/0023-cloud-integrations-are-optional-modules-with-honest-absence.md
- docs/nametbd-design.md (head), docs/research/nametbd-analyze-sources.md (head), docs/self-hostable-plan.md (headings/status)
- package.json, packages/core/package.json, apps/api/package.json (license/private fields)

Searches and listings run:
- `ls` of repo root, docs/, docs/adr/, apps/, docs/research, docs/explorations, docs/agents, apps/blog/public, apps/docs/public
- `find apps/blog apps/docs` for .astro/.md/.mdx/.ts/.json/.txt files
- `ls LICENSE*` in root, apps/*, packages/*: none found
- `grep "license"|"private"` in the three package.json files
- `git log` (1 commit, 2026-10-03), `git shortlog`
- `grep -i 'status|^## '` in docs/self-hostable-plan.md
- `grep -rni 'rails|activerecord|ruby'` in apps/blog/src and apps/docs/src: only "RubyMine" in source-code-mapping.mdx L92
- `cat robots.txt` in apps/blog/public and apps/docs/public: not present
