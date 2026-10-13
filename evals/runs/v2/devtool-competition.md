## Answer

**Short version.** You don't win by being a better pganalyze, Datadog or Performance Insights. Those tools watch production and tell you what already went wrong. DBTool's own docs describe something else: a check that runs before merge and inside the coding agent. It costs a query against a real Postgres planner using production statistics, maps it to the line of code that wrote it, and gates the pull request. That is a different job with a different buyer moment. Yes, there is real risk of being a feature. It comes mostly from database hosts (Supabase, Neon, PlanetScale) and from agents running `EXPLAIN` on a dev database, not from Datadog. Your strongest protection is something the agent cannot do alone: a planner that sees production-scale statistics (your patched Postgres fork, ADR 0022), the history of past runs, and a verdict that does not guess. You need to prove that in public and build switching costs before someone copies it. Before any of that, though: your own site undersells exactly the parts that set you apart. That is the cheapest thing to fix.

I had no numbers (users, paying accounts, activation, retention), so the stage check below rests on assumptions. Competitor facts come from my own knowledge, not from a live check. Treat them as unverified.

### 1. Is competition the constraint right now?

Probably not. The site still sells a $100 lifetime deal and says "no team tier yet". That points to an early company. At that stage the usual constraint is that people don't understand the product, or they never get to a first CI run. Losing deals to pganalyze is less likely. **Assumption A1:** fewer than ~100 paying accounts, and no repeatable acquisition channel yet. If you already have steady paid growth, give more weight to moves 2 and 3 below.

### 2. What buyers actually use instead (from the buyer's view, unverified)

- **Do nothing / find out in production.** This is the biggest competitor. The slow query shows up as an incident months later.
- **The coding agent alone** (Claude Code, Cursor, Codex) guessing at indexes, or running `EXPLAIN` on a 200-row dev database.
- **Production monitors:** pganalyze (index and query advice, priced per server), Datadog DBM (part of a suite the team may already pay for), AWS Performance Insights. As far as I know, AWS is folding PI into CloudWatch Database Insights. Verify this.
- **What the host ships:** Supabase's index advisor (built on hypopg) and the database MCP servers from Supabase and Neon. There are also open-source "Postgres MCP" servers that use hypothetical indexes.
- **Manual work:** `EXPLAIN ANALYZE` plus a senior engineer's review.

### 3. What your own repo says is shipped, partial or planned

| Capability | Status in docs/ADRs | What the marketing site says |
|---|---|---|
| CI gate + PR comment, baseline per branch | Shipped (CI guide, ADR 0019/0024) | Shipped |
| MCP server (`optimize_query`, CI read/triage, `doctor`, provisioning) | Shipped (mcp-server guide, skill.md) | **"Soon", and listed as Pro-only** |
| Alerts (Slack, webhook) | Shipped (alerts guide) | **"On our radar"** |
| Query rewrites | Shipped in engine and alerts (ADR 0030–0032) | **"Soon"** |
| Self-hosting | Guide exists; parts not built (ADR 0020/0021/0023/0028) | **"Working on a fully self-hosted mode"** |
| Production statistics on a forked planner | Built, image publishing still open (ADR 0022) | Underplayed as "1000× simulation" |
| CI auto-setup by the agent | Partial: Node-only detection | Not mentioned |
| Team plan, SSO | Planned | Planned |

Other contradictions that count as findings:
- Pro costs **$20 on the homepage and $16 on /pricing**.
- The homepage tells people to `docker run` the collector, but the docs say the instance starts it for you.
- The site says "the analyzer is open source, run it on your own machine". Under ADR 0019, analysis now runs on the platform and the Collector "analyzes none of it". Check what is still open source and under which license. The root `package.json` license field is empty.
- The docs hook example calls `analyze_query` / `recommend_indexes`, and /pricing lists `explain_query` / `suggest_indexes` / `predict_at_scale`. The documented tool is `optimize_query`. An agent following the hook will call tools that don't exist.
- The product name switches between "PlanView" and "DBTool".

The site's comparison table ("EXPLAIN ANALYZE / LLM SQL copilots / DBTool") leaves out the alternatives your question is about.

### 4. Would the incumbents copy you? (in their own revenue terms)

- **Datadog:** Copying costs them almost nothing, so assume they can. A pre-merge check doesn't fit how they make money (per host, on production). Their distribution is huge, so if they add it, they can bundle it at zero extra price.
- **pganalyze:** The closest in spirit. A CI or agent check fits their roadmap and doesn't eat their revenue. Assume they could copy it within a year.
- **AWS:** Single-cloud, console-first, and focused on production. AWS won't build per-repo PR gates that also work on Cloud SQL or Neon.
- **Coding agents and model companies:** They won't run a Postgres fork for each major version that holds each customer's production statistics. That is too much effort in a narrow niche, the kind of space platforms avoid (Zhu & Liu, Amazon study, research). The risk is that they get "good enough" by running `EXPLAIN` on whatever database they can reach.
- **Database hosts (Supabase, Neon, PlanetScale):** These are **the most dangerous**. They already hold production statistics and already ship MCP servers. But each one only covers its own customers. Your defensible position is to be **neutral across hosts and across agents** (RDS, Cloud SQL, self-managed; Claude Code, Cursor, Codex). That is how Dropbox survived "you're a feature" (platform playbook, first-party filings).

Honest read: your product is **sustaining** for teams that care about Postgres performance, and incumbents usually win those fights (competing-with-incumbents playbook, Chandy & Tellis, research). Where you are partly protected: (a) pre-merge use by small teams who don't pay for Datadog or pganalyze; (b) self-hosting where statistics never leave the network, which a SaaS-telemetry business won't do; (c) the "proven, not guessed" stance, which a model company can't credibly copy. Feature / product / company test: index advice alone **is a feature** (pganalyze, Supabase and Azure all have one). The full loop is a **product**: query, then source line, then planner verdict, then PR gate, then triage, then agent, plus history.

### 5. Three moves, in order

**1. Publish a reproducible "agent alone vs agent + planner" benchmark.** This directly tests your existential question.
- *Mechanism:* agents getting better at SQL is only a threat if they reach the right answer without production statistics. Show where they don't.
- *Cheapest test:* take 3 open-source Postgres apps (one Drizzle). Have Claude Code and Cursor write or change 30–50 queries. Compare each agent's index or "this is fast" claim with `optimize_query` under production-scale statistics. Publish the code, versions and the cases you lose (developer-tools playbook: honest benchmarks).
- *Metric:* share of agent claims the planner contradicts.
- *Time box:* 3 weeks.
- *Stop condition:* if agents alone match the planner on most queries, the "agents need a planner" pitch is weak. Shift weight to the production and history side, and re-run the benchmark every quarter. This doubles as your main warning sign.

**2. Reposition the site as "the pre-merge check your production monitor can't be", and fix the contradictions.**
- *Mechanism:* a positioning fix, not a copy tweak. Buyers file you next to pganalyze and Datadog and ask "why both?".
- *Cheapest test:* rewrite the hero and comparison table with columns for "production monitors" and "your agent alone". Mark MCP, alerts and rewrites as shipped. Use one price and one product name.
- *Metric:* visitor → project with a first CI run, compared over 4 weeks before and after. I can't size an A/B test without your traffic and conversion numbers; send them and I'll run the calculator.
- *Stop condition:* no movement after 4 weeks means the problem is activation, not the message.

**3. Make the agent the main entry point, and build switching costs on top of it.**
- *Mechanism:* "set up DBTool CI for this repo" through MCP is a channel the incumbents don't have. Once a project has history, baselines, triage state and a retained series of statistics, leaving costs something real, without trapping anyone's data.
- *Cheapest test:* list the server in the official MCP Registry and the client directories. Track the MCP client name for each project.
- *Metric:* projects with a second CI run in week 2, comparing agent-provisioned with manual setups.
- *Time box:* 6 weeks.
- *Stop condition:* if agent-provisioned projects keep running clearly less often than manual ones, fix setup before pushing the channel.

**Not yet:**
- No production-dashboard feature parity with pganalyze or Datadog.
- No price cuts. You're already cheap, and matching a bundler's zero price loses.
- No LLM-generated verdicts. That breaks your "proven, not guessed" value and is the one thing agents already do.
- No license change once a community forms.

### 6. Pre-planned responses

- **Datadog or pganalyze ships a CI gate:** defend small teams, self-hosters and agent-first teams. Give up accounts already standardised on Datadog. Don't match price; answer with depth (rewrites, production statistics on unmerged schema).
- **An agent vendor ships "DB-aware" review:** integrate and become the tool it calls. Neutrality is the point.
- **A host ships planner-backed PR checks:** stay the cross-host option. Lead with RDS and Cloud SQL users.
- **Platform exposure (your current dependencies):** GitHub Actions only, HTTP MCP clients only, Node-only auto-setup. Know which terms clause could cut each one off.

### 7. Warning signs and who watches (one founder, monthly)

- Changelogs from pganalyze, Datadog DBM and AWS Database Insights.
- Supabase, Neon and PlanetScale launch weeks.
- Anthropic, Cursor and OpenAI developer days, plus their MCP terms.
- Your re-run benchmark score.
- Win/loss notes: "we already have pganalyze" versus "we didn't know we needed this".

**Who might rather buy than build** (my view, unverified): pganalyze, Datadog, the database hosts.

### Questions I would have asked (assumptions used instead)

1. Paying accounts, weekly active projects with CI runs, and churn? (A1: early, <~100 paying.)
2. Who are the best-fit customers today: small product teams on Node/Drizzle, or platform teams? (A2: small Node teams using coding agents, chosen because auto-setup is Node-only.)
3. Goal: venture scale or a sustainable small company? (A3: venture-curious. If it's a lifestyle business, the acquisition and host risk matters less.)
4. Which parts are open source, under which license? (A4: unknown. Check this before claiming it on the site.)
5. Have you lost a deal to pganalyze or Datadog, or only to "do nothing"? (A5: mostly "do nothing".)

Once you confirm these facts, I can save them as a business profile so later advice starts from them.

## Tool log

MCP commands (all run with `cd /home/user/marketing-expert && MARKETING_EXPERT_DATA_DIR=.../v2-devtool-competition`):
- `node scripts/mcp.mjs instructions`: operating rules (context first, name alternatives, use tools for numbers, ≤3 ranked moves, no "moat", check vision). Followed throughout.
- `node scripts/mcp.mjs tools`: listed calculators, audits, profiles and playbooks. No numeric tool used, because the user supplied no numbers. I said the A/B sizing needs their traffic.
- `node scripts/mcp.mjs prompts`: found `competitive_strategy`.
- `node scripts/mcp.mjs call list_business_profiles '{}'`: returned `[]` (no profile). Offered to save one later.
- `node scripts/mcp.mjs prompt competitive_strategy '{"company":"see repo","competitors":"pganalyze, Datadog DBM, AWS Performance Insights, coding agents"}'`: 8-step workflow (stage check, alternatives, copy cost, sustaining vs disruptive, platform risk, protections, where to fight, responses, warning signs). Used as the answer's structure.
- `node scripts/mcp.mjs call get_playbook '{"slug":"competing-with-incumbents"}'`: counter-positioning, sustaining fights favour incumbents, P&L copy test, bundling. Used in section 4 and the decision rules.
- `node scripts/mcp.mjs call get_playbook '{"slug":"platform-and-feature-risk"}'`: feature/product/company test, neutrality (Dropbox), Zhu & Liu, risk questions, warning signs. Used in sections 4, 6 and 7.
- `node scripts/mcp.mjs call get_playbook '{"slug":"competitive-analysis"}'`: buyer-view alternatives, "do nothing", switching costs, price-war sequence. Used in sections 2 and 6.
- `node scripts/mcp.mjs call get_playbook '{}'`: list of playbooks, used to pick the business-type playbook.
- `node scripts/mcp.mjs call search_playbooks '{"query":"developer tool open source bottom-up AI coding agents distribution","limit":5}'`: pointed to the `developer-tools` playbook.
- `node scripts/mcp.mjs call get_playbook '{"slug":"developer-tools"}'`: MCP Registry, tool descriptions, honest reproducible benchmarks, license-change lessons, stage advice. Used in moves 1 and 3 and in "not yet".

Repo files read (/home/user/site):
- VISION.md, README.md, CONTEXT.md (first ~400 lines), AGENTS.md (head)
- docs/adr/README.md (status table), docs/adr/0022-the-fork-is-a-per-major-patch-series-with-a-declared-window.md
- apps/blog/src/pages/index.astro, apps/blog/src/pages/pricing.astro (text content)
- apps/docs/src/content/docs/guides/introduction.md, mcp-server.md, alerts.md, using-with-llms.md, self-hosting.md (head), ci-integration.md (head), getting-started.md (head)
- apps/docs/src/content/docs/reference/analyzer.mdx (headings/grep), apps/docs/public/skill.md (head)
- grep for license fields (package.json, packages/core) and for tool names / stack support across docs
