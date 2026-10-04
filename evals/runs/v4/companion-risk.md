## Answer

## Answer

**Short version.** For the next 90 days, marketing should not be about reach. You don't yet know who sticks with the product, and your website describes an older product than the one in your docs. So: (1) this week, make the site say what the product actually does and how it handles data; (2) spend most of the 90 days getting 10–15 teams to use the CI check, set up by you personally, and learning which ones keep it; (3) only then do one public launch, plus listing the MCP server where coding agents look. No paid ads, no content calendar yet.

**What I'm assuming (I couldn't ask you):**
- A1: Few or no paying users. Your own plan said "Zero customers" in August (docs/self-hostable-plan.md:98). If you have 20+ active teams, skip to move 3 sooner.
- A2: No marketing budget, founder time only.
- A3: Best-fit user: a small backend team on Node (Drizzle/Prisma), Postgres 13–19, GitHub Actions, using a coding agent. This is where the product is strongest today: agent CI setup is "Node-only today" (apps/docs/.../ci-integration.md:11).
- A4: Pro buyers pay about $16–20/month and stay about 20 months (5% monthly churn). This is a guess.

**What I found in the repo (business type: developer tools, which builds on self-serve SaaS)**

What's shipped, according to the docs: the CI check on pull requests, the MCP server (mcp-server.md), query rewrites (how-optimization-works.md:55), and Slack/webhook alerts (alerts.md). Partly built: production monitoring (ADR 0019: "monitor mode open"), self-hosting (ADRs 0020/0021/0023 "not built", 0025 "partially built"), and the PR comment hand-off to the agent (ADR 0003 "not fully built"). Planned: schema-drift alerts (alerts.md:29).

The site contradicts the product in ways that cost trust with a technical buyer:
- **Credentials:** the pricing FAQ says the analyzer is "a Docker container *you* run, with credentials *you* control" (blog/src/pages/pricing.astro:364). The docs say the instance stores your connection string and starts the Collector itself (docs guides/getting-started.md:18; reference/analyzer.mdx:12).
- **Rows:** the getting-started page says the tool will "extract 10 sample rows per table" (blog/src/pages/getting-started.astro:35). The docs say "Your rows never reach it" (analyzer.mdx:38).
- **Parameter values:** a pricing tooltip says "Parameter values aren't included" (pricing.astro:263). The docs say pg_stat_statements "can contain... literal parameter values" (analyzer.mdx:21).
- **Docs disagree with each other:** statistics.mdx:14 says "Run the analyzer locally to prevent the data from leaving your computer". analyzer.mdx:30 says "No setting keeps the data on your machine". statistics.mdx:16 also says a superuser is required, while analyzer.mdx:64 says read access is enough.
- **Setup:** the homepage sells "docker run" (index.astro:265, :495). The docs say "There is no `docker run` command" (getting-started.md:18).
- **Shipped features marked "soon" or "on our radar":** MCP, rewrites and alerts (index.astro:412–413, pricing.astro:71–72). The "self-hosted mode" you say you're "working on" (pricing.astro:365) has a full guide (self-hosting.md).
- **Price:** Pro is $20 on the homepage (index.astro:403) and $16 on the pricing page (pricing.astro:65).
- **Positioning:** the homepage leads with "PlanView, point it at a Postgres URL" and a Ruby example. Your VISION.md leads with the agent and CI ("Run as close to the developer as possible"), and the docs say plans come from CI (getting-started.md:40).

**What buyers use instead (from my own knowledge, unverified):** reading EXPLAIN by hand (or with pgMustard or explain.depesz.com); pganalyze; the free advisors built into their database host (Supabase, Neon, AWS RDS Performance Insights); asking an AI assistant; and most often, doing nothing until production gets slow. You have something the free hosted advisors lack: you check queries *before merge*, on the PR, and an agent can call the check. Compete on that, not on monitoring dashboards. Those hosts can add features cheaply, and that is the main risk of absorption (being copied for free by a platform).

**The economics rule out paid ads.** With A4, unit_economics gives a lifetime gross profit of about $244 per customer and an affordable cost per customer of $81 (for a 3:1 lifetime-value-to-cost ratio) or $118 (for 12-month payback). With a guessed $4 click and 1% click-to-paid, paid_media_math gives a cost per customer of $400: "Each conversion loses money on this basis." Also, your $100 lifetime deal is below that $244 estimate and includes "everything Pro does, forever". Put a real number on "Limited spots", or end it.

**Diagnosis:** the problem is positioning plus no feedback from users, not reach. **What would prove me wrong:** you already have teams running CI on most PRs for 4+ weeks. Then the problem is reach, and move 3 comes first.

### This week (fixes, not a strategy)
Make the homepage, pricing page and getting-started page match the docs on the points above. Pick one price. Write one plain "what leaves your database" paragraph and use it everywhere. Your docs already say it well (introduction.md:59). Your vision is "Proven, not guessed", and the site should meet the same standard.

### The three moves, in order

**1. Recruit 10–15 design partners and set up the CI check for each yourself (weeks 1–6).** Design partners are early users who get your help and give feedback in return.
- Mechanism: founder-led, hands-on setup gets the first users and teaches you their objections [practitioner].
- Cheapest test: personal messages to teams that fit A3. Find them through your Discord and through people who discuss slow Postgres or ORM queries in GitHub issues and threads. Do a short interview (what triggered the search, what nearly stopped them), using the "switch interview" questions [practitioner].
- Metric: teams whose CI check runs on most PRs for 4 weeks. Treat that as your first guess at activation, then check it against who stays.
- Stop condition: if fewer than 3 of 10 teams are still running it after 30 days, fix the product or the target user before doing anything public.

**2. Rewrite the homepage around what those partners say (weeks 5–8).** One positioning statement, for example "a pre-merge check for Postgres queries, for teams and their coding agents", with their words as proof.
- Mechanism: positioning before copy. Most people judge a developer tool by its docs and quickstart [first-party survey].
- Cheapest test: don't A/B test it, because your traffic can't support one. Show the new page to five target developers and ask them to say back what it does.
- Metric: share of new signups reaching a first CI run within 7 days.
- Stop condition: if 3 of 5 can't explain it, rewrite before launching.

**3. One public launch: a Show HN, plus listing the MCP server in the official MCP Registry (weeks 9–12).**
- Mechanism: Show HN rules ask that people can try it "without barriers such as signups" and that the maker is in the thread [first-party]. The official MCP Registry is where agents find tools [first-party]. Both depend on move 1 having cut setup time.
- Cheapest test: once a month, give a coding agent "my Postgres query is slow" in a clean repo and see whether it finds you [rule-of-thumb].
- Metric: first CI runs from that launch's users within 14 days. Ignore upvotes and stars.
- Stop condition: if fewer than 10% of launch signups reach a first CI run, the problem is onboarding, not reach.

Evidence note: the developer-tools playbook says its sources are "Mostly from search snippets; see caveats there."

**Timing:** Postgres usually releases a new major version in the autumn, and PGConf.EU is usually in late October. Check the dates. A talk about the problem, not the product, could support move 3.

**What not to do yet:** paid ads (the numbers above); a content calendar (your six blog posts are deep and good, so write more only from partner conversations); a team plan or SSO; more lifetime deals; counting GitHub stars.

### Open questions
1. How many signups, weekly active projects and paying accounts do you have? Is Google Analytics on in production (BaseHead.astro:15 reads VITE_GA_MEASUREMENT_ID)?
2. Who are your current users: stack, team size, and how did they find you?
3. How many lifetime deals have you sold, and what is the cap?
4. Is the platform code open source, or only the analyzer/Collector? packages/core has an empty license field.
5. Does a connected database alone produce index recommendations, or only CI? live-queries.md and getting-started.md:40 read differently.
6. Is the goal venture-scale or a sustainable small business? It changes how fast move 3 should come.

I can save the facts you confirm as a business profile so we can track progress next time.

## Tool log

Environment: `cd /home/user/marketing-expert`, `MARKETING_EXPERT_DATA_DIR=/home/user/marketing-expert/evals/data/v4-companion-risk`, client `node scripts/mcp.mjs`.

### MCP calls, in order
1. `instructions` — server rules: context first (profiles, repo, scan_source), diagnose before prescribing, tools for all numbers, playbook evidence labels, max three moves, under 1,200 words, run check_answer.
2. `tools` — listed 24 tools (calculators, audits, scan_source, check_answer, profiles, playbooks).
3. `prompts` — listed 11 prompts incl. opportunity_assessment, competitive_strategy, exit_options.
4. call `list_business_profiles` `{}` — `[]`, no stored profile for GameX Companion.
5. call `scan_source` `{"dir":"/home/user/gamex-companion/apps/app"}` — 129 files; 31 data, 0 price, 19 availability, 8 setup, 30 proof matches (mostly code comments; site copy: "Upload a screenshot of an item tooltip to auto-fill the form."); env flags VITE_CALC_ONLY (redirects home to IAS calculator), VITE_UMAMI_URL/WEBSITE_ID (analytics), VITE_SITE_URL, VITE_API_BASE_URL. No price claims.
6. call `scan_source` `{"dir":"/home/user/gamex-companion/docs"}` — 11 files; 18 data, 1 setup, 3 proof matches, all ADR storage statements (images stored once, captures kept); proof line ADR 0006 "25 of them, 18% of the rare and crafted table".
7. call `get_playbook` `{}` — list of playbooks; picked community-and-hobby-products as the business-type playbook.
8. call `search_playbooks` `{"query":"startup risk base rates hobby side project","limit":5}` — community playbook goal table and side-project base rates; startup-risk base rates and kill criteria.
9. call `search_playbooks` `{"query":"platform risk dependency Discord API","limit":5}` — platform-and-feature-risk sections (absorption vs access, access-cut cases, warning signs; "All sources seen via search snippets; nothing read in full").
10. call `search_playbooks` `{"query":"monetization gaming community tool fan site","limit":5}` — community playbook: common mistakes, measuring, growth inside communities.
11. call `get_playbook` `{"slug":"community-and-hobby-products"}` — full text: goal-first, overlay/aggregator mechanics, Discord data rules (no AI training on message content, delete on request), monetization ladder (donations, Premium Apps 85% of first $1M, extras, ads), Blizzard/Riot/Valve terms, RMT, privileged intent now 10,000 users; sources "All read via search snippets".
12. call `get_playbook` `{"slug":"platform-and-feature-risk"}` — full text incl. risk questions, "what reduces absorption risk".
13. call `get_playbook` `{"slug":"startup-risk-and-opportunity"}` — base rates, failure reasons, onion risks, Graham tests, pre-mortem, kill criteria.
14. prompt `opportunity_assessment` `{"idea":"GameX Companion: free Discord bot + site that OCRs GameX trade-channel item screenshots into a rules-validated searchable database, with watch/DM notifications and IAS/imbue calculators","evidence":"Repo only: production table ~141 items (Aug 2026 ADR); no revenue, no user counts found; founder goal unknown"}` — structure: goal, base rates, urgent group, market_size, why now, risks by layer, pre-mortem, leap-of-faith tests, verdict.
15. call `search_playbooks` `{"query":"market sizing bottom-up niche game players paying share","limit":4}` — market-sizing sanity checks, $100M ARR test, venture-scale rules.
16. call `get_playbook` `{"slug":"market-sizing-and-timing"}` — full text (methods, why now, venture-scale vs bootstrapped).
17. call `search_playbooks` `{"query":"incumbent response small company niche defensibility network effects","limit":3}` — competitive-analysis procedure, "advantages don't last", price wars.
18. call `market_size` `{"segments":[{"name":"Individual GameX Discord traders (supporter tier $3/mo)","accounts":50000,"annualValue":36,"serviceableShare":0.3,"payingShare":0.02,"source":"ASSUMPTION, unsourced: active GameX players who trade via Discord"},{"name":"GameX trade-server owners (per-server Premium Apps $5/mo)","accounts":200,"annualValue":60,"serviceableShare":0.5,"payingShare":0.1,"source":"ASSUMPTION, unsourced: active GameX trading Discord servers"}],"horizonYears":3,"annualChurn":0.4,"revenueTarget":50000}` — TAM $1.812M, SAM $11,400, 310 serviceable paying accounts; $50k needs 1,359.6 customers = 4.386× SAM; warnings: no capacity constraint, "only 310 accounts are serviceable".
19. call `market_size` `{"segments":[{"name":"GameX Discord traders, optimistic (supporter $5/mo)","accounts":200000,"annualValue":60,"serviceableShare":0.5,"payingShare":0.05,"source":"ASSUMPTION, optimistic, unsourced"},{"name":"GameX trade-server owners, optimistic ($10/mo per server)","accounts":500,"annualValue":120,"serviceableShare":0.6,"payingShare":0.2,"source":"ASSUMPTION, optimistic, unsourced"}],"horizonYears":3,"annualChurn":0.4,"revenueTarget":50000}` — TAM $12.06M, SAM $307,200; $50k needs 823.6 customers = 16.3% of SAM; warning: no capacity constraint.
20. call `check_answer` `{"text":"<draft answer>"}` — 1,155 words, no banned words, no unexplained terms, no problems. (After that only two small edits: corrected line range to 105–109, added "a" to move 2 title.)

Not run: audit_page / crawl_site / check_ai_crawler_access (companion.example blocked from sandbox; the answer says nothing on the live site was checked). save_business_profile not called (founder unavailable to confirm facts; offer stands).

### Repo files opened (/home/user/gamex-companion, read-only)
- `VISION.md`, `CONTEXT.md`, `README.md`, `.claude/vision-digest.md`
- `docs/adr/0001` … `0007` (first ~1,500 chars of each)
- `research/plannersite-planner.md` (first 150 of 1,168 lines)
- `apps/app/README.md`, `apps/bot/README.md`, `apps/bot/src/config.ts`
- `apps/app/src/routes/index.tsx`, `apps/app/src/routes/__root.tsx` (lines 20–140), `apps/app/src/lib/page-title.ts`, `apps/app/src/index.css` (line 8)
- `knowledge/warlock-expansion.md` (head)
- `packages/ocr/training/retrain-all.sh` (lines 1–40), `packages/ocr/training/link-corpus-images.mjs` (1–40), `packages/ocr/training/README.md` (95–110)
- `packages/cli/corpus/README.md` (1–30), `packages/cli/corpus/corpus.json` (entry count + first entry)
- `apps/api/src/routes/user-items.ts` (300–340)

### Searches and listings run
- `ls -R` of repo root (truncated), `git ls-files` (first 300 of 2,275), `ls docs docs/adr research knowledge`, `ls apps/bot apps/bot/src apps/app/src apps/app/src/routes`, `ls apps/app/public apps/app/public/images`, `ls packages/ocr/training packages/cli`
- Grep whole repo (excluding node_modules): `monetiz|revenue|pricing|subscription|premium|patreon|donat|ads|advertis|stripe|paid tier|ko-fi` — no monetization plans found (only VISION non-goal "no pricing" and unrelated matches)
- grep `privacy|terms of service|blizzard|tos|gdpr|delete my|opt-out` in .md/.ts/.tsx — only Blizzard skill/item names; no privacy or terms page found
- grep `in production|production (table|has)|[0-9]+ items` in docs, VISION.md, .claude/rules — ADR 0006 figures
- grep `Exocet` in apps/packages css/ts — `apps/app/src/index.css` lines 4, 8, 17
- grep `ladder|season` in VISION.md and warlock-expansion.md
- grep `.delete/.get/.post` in `apps/api/src/routes/user-items.ts`, `items.ts`, `user-watches.ts` — deletes only for user's own stash link (user-items.ts:329) and watches (user-watches.ts:151)
- grep `real money|rmt|usd|paypal|$` in `apps/bot/src`, `apps/api/src/services` — one false-positive file (capture-store.ts, `$inferSelect`); no RMT handling found
- grep `isAdmin|/planner|/stash|/create` in `__root.tsx` — lines 105–109 (admin-only nav)
