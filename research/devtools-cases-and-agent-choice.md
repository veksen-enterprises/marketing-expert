# Research notes: agent tool choice, developer-tool first customers, and how developers describe slow queries

**Scope note.** Note 1 tested one real developer tool (a Postgres query-analysis product with an MCP server) whose name and tool names are withheld here; competing tools are named because their descriptions are public. Notes 2 and 3 use public sources only.

5 October 2026. There are three notes, followed by a section on what to change.

**How to read the tags.**
- [research] means a study.
- [first-party] means the company's own docs, blog, code or founder interview.
- [vendor] means a company or investor with a stake in the claim.
- [practitioner] means the words or rules of developers and operators.
- "our experiment" and "our coding" mark results produced in this session.
- Qualifiers give how the source was accessed (read in full, or seen only as a search snippet) and the sample size. On 2026-10-05 the Snyk, pganalyze and pgMustard claims in the patterns list were re-read at the source; the Tailscale interview (Stratechery) is paywalled.

---

## 1. Agent tool selection: an experiment

**Question.** If we rewrite the product's (the product) MCP tool descriptions, does a coding agent pick the product more often when it fits?

### Method

- **Catalog.** 29 tools, given as plain text (server, name, description).
  - 15 are the product tools with their registered descriptions (as registered in its source).
  - 14 come from 7 other servers: the archived Postgres reference server (1), Postgres MCP Pro (4), Supabase (2), Neon (3), DBHub (2), GitHub get_job_logs (1) and Claude Code's Bash (1, first sentence only).
  - The other servers' text was copied from each project's source at a named commit, or as served in this session.
- **Two arms.**
  - "Current" uses the registered the product text: 17,322 characters across the 15 tools.
  - "Rewritten" uses our rewrite: 8,047 characters, 54% shorter.
  - Only the the product descriptions differ. Tool names and the other 14 tools are identical.
- **Rewrite rules.**
  - The first sentence states the job in developer words.
  - Each description has one concrete example.
  - Limits are stated as facts.
  - There are no instructions to the agent.
  - Rules for reading the output were removed, because they belong in the result.
- **Tasks.** We wrote 6 developer requests. Each has a best-fit list we fixed before the run. Task t6 is a control: no the product tool fits it.
- **Trials.** 4 per task per arm, so 24 per arm and 48 in all.
  - In each trial, one Claude subagent from this session got one task and the whole catalog.
  - It named the single tool it would call first, or "none", with a one-sentence reason.
- **Order.** The catalog was shuffled for every trial with a seeded, deterministic shuffle. This spreads position effects across trials and lets anyone repeat the run.
- **Model.** All picks came from this session's Claude subagents, so there is one model family.
- **Not a live agent loop.** The subagents saw a text catalog only. There was no repo to read, no tool output and no second step.

### Results

| Task | Request (short) | the product first picks, current | the product first picks, rewritten | Picked instead |
|---|---|---|---|---|
| t1 | Drizzle query takes ~4s in prod; find why, fix it | 0/4 | 0/4 | Current: "none" ×4 (read the schema first). Rewritten: Postgres MCP Pro explain_query ×3, "none" ×1 |
| t2 | Did branch feat/order-search make any queries slower? | 4/4 | 4/4 | none (all four picked the regressions tool) |
| t3 | Will this migration make our queries slower? | 0/4 | 0/4 | "none" ×4 in both (read the migration first) |
| t4 | Add an index for getOrdersByCustomer; Prisma | 0/4 | 0/4 | "none" ×4 in both (read the code first) |
| t5 | Why did CI get slower after this PR? | 3/4 | 3/4 | GitHub get_job_logs ×1 in both |
| t6 (control) | pg_stat_statements on prod: which queries? | 0/4 | 0/4 | Postgres MCP Pro get_top_queries ×4 in both (correct) |
| **All 6 tasks** | | **7/24 (29%)** | **7/24 (29%)** | |
| 5 tasks where the product fits | | 7/20 (35%) | 7/20 (35%) | |

**Secondary counts.** These were read from the one-sentence reasons after the run, so they are post hoc.
- **Any best-fit tool picked first:** 12/24 current, 15/24 rewritten. The whole gain is t1 moving to a competitor's tool.
- **Code-first behaviour:** on the three requests that point at code (t1, t3, t4), 21 of 24 trials across both arms picked "none" (meaning: read the code first).
  - 18 of those 21 named the query-analysis tool as the next step.
  - By arm: current 10 of 12, rewritten 8 of 9.
- **t6 reasons:** the product was ruled out by name in 4 of 4 rewritten trials ("the product only covers queries captured in CI"). In the current arm it came up once, only as "a CI-run tool".
- **t5 reasons:** in both arms, 4 of 4 reasons raised on their own that "CI got slower" might mean wall-clock time, not query cost.

### What it shows

1. **The wording did not move the headline rate:** 7/24 in both arms [our experiment; n=48; one model family; simulated choice].
2. **When a request points at code, the agent reads the code first.** Because most of those agents then named the query-analysis tool, the first call is the wrong yardstick for these tasks. the product's real chance comes at the second or third call, which this setup cannot see.
3. **The one request phrased as the product's own question was the only one the product won every time:** t2 went to the product in 8 of 8 trials. The the regressions tool description already opens with that question ("Did my PR make any query slower?") in both arms.
4. **Honest limits change routing.** This is the largest behaviour change, covered under the first item of the changes list below.
5. **Half the text gave the same result.** Cutting about 9,300 characters of reading notes cost nothing measurable.

### What it does not show

- **Small n.** There were 4 trials per cell. 9 of 12 cells were unanimous and 3 split 3–1. The model answers almost the same way each time, so the effective sample is closer to 6 task-level decisions per arm than to 24 independent draws. With 24 per arm, only a difference of about 25 points either way could be told from noise.
- **One model family.** Other agents (Cursor, Copilot, Codex) may weigh descriptions differently.
  - Lab studies found that rewording alone can raise selection a lot [research; lab settings; one peer-reviewed, one preprint].
  - Those studies compared near-identical tools. Here the tools differ in what they do, so this run neither reproduces nor refutes them.
- **Simulated choice.** The agents saw a text list and made one decision, with no repo and no tool output. Real installs hold fewer servers, so the product would compete mostly with reading files and Bash.
- **Our own design.** We wrote the tasks, the best-fit lists and the single rewrite. No other rewrites were tested.

### The three description changes that mattered most

1. **Stating the query-analysis tool's access limits** ("without connecting to your database", "no timings", "needs sign-in").
   - Effect: on t1 ("~4s in prod"), picks moved from "none" 4/4 to a live-database EXPLAIN tool 3/4.
   - The facts are true. For a "slow in prod" request they read as a disadvantage.
   - An EXPLAIN on prod is a sound answer to that request, so this may be correct routing rather than a loss.
2. **Stating scope: CI-captured queries, not production traffic.** This appears in the CI tools' first sentences, and the connect-database tool now says what production statistics feed.
   - Effect: picks on the control task were unchanged and correct.
   - In the rewritten arm, all 4 reasons named the boundary.
   - The rewrite put "production" into the product's text, which made the product a candidate. The scope lines let the agent rule it out for the right reason.
3. **Cutting the reading rules** (17,322 → 8,047 characters).
   - Effect: no change in picks.
   - Shorter descriptions are cheaper in context and easier for security tools to audit, at no measured cost.

**Changes with no visible effect:**
- Adding developer words (Drizzle, Prisma, `$1` parameters, "missing index") to the query-analysis tool. Code-first behaviour dominated t1 and t4.
- Adding "Costs are EXPLAIN estimates, not CI wall-clock time" to the regressions tool. Agents raised that doubt on their own in both arms. One rewritten trial quoted the product's sentence as its reason to read job logs first, so the net effect on picks was zero.

**Next test.** Run a live agent loop in a small Drizzle repo, scoring whether a the product tool is called at any step, with request wording taken from note 3.


---

## 2. First customers of developer tools: 31 cases

The set was planned as 30 cases and ended with 31. Each row records how the company got its first users and its first payers.

**Columns:**
- **Months** runs from the first public launch or first outside users to first revenue.
- **Check** gives the result of a spot check against primary sources. 10 rows were checked: 5 confirmed, 5 corrected. All corrections were minor (a misattributed quote, a figure missing from its cited source, a wrong month).

| Company | Category | Open source at start | First channel | First payers, how | Months | Starting price | Check |
|---|---|---|---|---|---|---|---|
| pganalyze | Postgres monitoring | Agent only | HN post (2013), Postgres talks | Self-serve; ~1 year after billing to reach 10 payers | ~8 (3–14) | Unknown | Not checked |
| pgMustard | EXPLAIN plan advice | No | Unknown | Self-serve annual; first subscriber in launch month | 0 | Unknown (now €95/yr Pro) | Not checked |
| Supabase | Postgres backend | Yes | Unplanned HN post in alpha | Self-serve card, after free period with credits | 10 | $25/project/mo | Confirmed |
| Neon | Serverless Postgres | Yes | HN post, waitlist | Self-serve Pro, Enterprise and platform resale, same day | 9 | Usage-based | Confirmed |
| PlanetScale | MySQL/Vitess | Yes (Vitess) | Vitess network and community | Sales: support, training, licences | Unknown | Custom | Corrected |
| Prisma (Graphcool) | GraphQL backend, then ORM | No (hosted) | Free tutorials | Self-serve plans | Unknown | $35/mo | Not checked |
| Hasura | GraphQL on Postgres | Yes | Open-source launch, HN, developer press | Bottom-up enterprise sales; "talk to us" | Unknown | Custom; Cloud $99/project/mo later | Not checked |
| Metabase | Open-source BI | Yes | Open-source release, one-click deploys | Self-serve store: logo removal for embedding | ~25 | $300/mo | Not checked |
| Timescale | Time-series Postgres extension | Yes | HN and conference launch | Support and on-prem deals; cloud later | Unknown | Cloud $2.64/day | Not checked |
| Citus Data | Distributed Postgres | No (opened 2016) | YC network, HN/TechCrunch | Sales, per-node licences | Unknown | <$5k/node for startups | Not checked |
| Crunchy Data | Enterprise Postgres | Yes (Postgres) | Founder-led discovery | Sales: subscriptions, government | Unknown | Unknown | Not checked |
| Codecov | Coverage reports | Uploaders only | Founder outreach, CI integrations, badges | Mixed: self-serve plus founder sales | Unknown | Unknown (~$3/private repo, undated) | Not checked |
| Coveralls | Coverage history | Reporters only | Show HN, README badges | Self-serve, per private repo | Unknown | Unknown (now $10/mo) | Not checked |
| Snyk | Dependency security | Free CLI, free for open source | Conference beta, founder reputation | Self-serve paywall stalled; sold to security leaders | 17 | Unknown | Corrected |
| Renovate | Dependency bot | Yes (MIT) | Founder blog, GitHub | Self-serve via GitHub Marketplace | ~14 | $1/mo personal (locked in) | Corrected |
| Dependabot | Dependency bot | No | Founder outreach on GitHub PRs | Self-serve via GitHub Marketplace | ~2 | Up to $100/mo per org | Confirmed |
| SonarSource | Static analysis | Yes (LGPL) | Open-source downloads | Unknown | Unknown | Unknown | Not checked |
| Code Climate | Static analysis (Ruby) | No | Ruby community, badges | Self-serve, private repos | Unknown | Unknown | Not checked |
| Semgrep | Static security analysis | Yes (LGPL) | Open-source CLI, rule registry, Slack | Mixed: in-app seats plus sales | Unknown | $40/seat/mo (2022) | Not checked |
| Socket | Supply-chain security | No | Founder's audience, GitHub App | Mixed: self-serve seats plus sales | ~17 | $8/seat/mo (2023) | Not checked |
| Graphite | Stacked pull requests | CLI only | Alumni groups, HN waitlist | Self-serve per active user | 22–25 | $30/user/mo ($20 early) | Corrected |
| Sentry | Error tracking | Yes | Python/Django open-source community | Self-serve Heroku add-on | 0 (after ~4 yrs open source) | ~$7/mo | Confirmed |
| PostHog | Product analytics | Yes (MIT) | Friends and outreach, then HN | Founder calls, then self-serve | ~2.5 | Unknown | Corrected |
| Honeycomb | Observability | No | Founder network, talks, Twitter | Sales-led | Unknown | Unknown | Not checked |
| Datadog | Infrastructure monitoring | Agent only | Customer discovery, conference booths | Self-serve, no sales team | Unknown | Per host (2013 docs) | Not checked |
| Grafana Labs | Dashboards | Yes | Open-source adoption | Inbound, founder-handled deals | ~30 | Unknown | Not checked |
| Tailscale | Mesh VPN | Clients only | HN launch, waitlist | Self-serve; users asked how to pay | ~2 | Unknown | Not checked |
| Retool | Internal tools | No | YC batchmates, cold email | Founder sales, custom quotes | ~5 (before launch) | Custom | Confirmed |
| Railway | Deployment platform | CLI only | Founder greeted every Discord signup | Self-serve usage billing | Unknown | Usage; $5 free credit | Not checked |
| Vercel (ZEIT) | Frontend hosting | CLI only | Founder's open-source audience | Self-serve from the CLI | ~1.5 | $15/mo premium | Not checked |
| Linear | Issue tracking | No | Founders' Twitter, waitlist | Self-serve per seat at public launch | 14 | $8/user/mo | Not checked |

### Base rates

All shares are out of 31 unless a smaller n is given. These are descriptions of this set, not forecasts.

- **Open source at the start:**
  - 13 had an open-source core (42%).
  - 9 opened only a client, agent or CLI (29%).
  - 9 were closed (29%).
  - In several "open" cases the project came years before the company. Sentry's code was open from 2008 and its paid service started at the end of 2012.
- **First channel:**
  - Founder-driven routes were the largest group: 12 (39%). These are personal network, one-to-one outreach, customer discovery, and the founder's own audience.
  - A Hacker News launch was the main channel for 9 (29%), and HN appears somewhere in 11 (35%).
  - An existing open-source community brought 7 (23%).
  - Tutorials or a language community brought 2, and 1 is unknown.
  - HN launches usually followed a hand-recruited first group of users.
- **First payers:**
  - Self-serve: 16 (52%). Sales-led or founder-sold contracts: 9 (29%). Mixed: 5 (16%). Unknown: 1.
  - Sales-led first revenue clusters in two places. One is infrastructure that holds production data or needs uptime guarantees (6 cases). The other is where the user is not the buyer (Snyk).
- **Months to first revenue:**
  - Known for 17 rows: median 9, interquartile range about 2–17, full range 0–30.
  - Most of the 14 unknowns are enterprise or database-infrastructure companies, so the known median probably flatters the set.
  - Measured from the start of work, nearly every figure grows. Supabase goes to about 18.
- **Database tools (n=10):**
  - 6 had an open core. HN figures in 6 first-user stories.
  - Months are known for 4 (0, ~8, 9, 10).
  - Developer-facing tools were self-serve. Database engines and enterprise Postgres were sold through sales.
- **CI and pull-request tools (n=10):**
  - 3 had an open core, 4 an open CLI or uploader, and 3 were closed.
  - 7 of 10 were free for open source and charged for private repos or teams.
  - The early pricing unit was often per private repo (4 cases).
  - GitHub Marketplace billing carried 2 of them.
  - Months are known for 5: median 17, range 2–22.
- **Prices at or near first charge, where known:**
  - Developer self-serve: $1–$35 a month (Renovate $1, Sentry ~$7, Vercel $15, Supabase $25 per project, Graphcool $35).
  - Per-seat team plans: $8–$40 per user per month (Socket $8, Linear $8, Graphite $30, Semgrep $40).
  - Organisation plans or add-ons: $100–$300 a month (Dependabot's top tier $100, Metabase $300).
  - Sales-led companies quoted custom prices.

### Patterns worth reusing

- **Users asked how to pay before there was a way to pay.** This happened at Sentry, Tailscale and Renovate (an enterprise user said "If you'll run it, I will pay you") [first-party; founder interviews; Sentry and Renovate read in full, Tailscale snippet-only (re-check 2026-10-05: Stratechery interview is subscriber-only; a fresh search summary quotes a user saying there was "no good way for me to give you money")].
- **The first paid feature was often a professional need, not usage.** Examples: Metabase's logo removal at $300 a month, Vercel's custom domains, and private repos for coverage tools [first-party].
- **A self-serve paywall can stall when the user is not the buyer.** Snyk's founder: "We opened the floodgates and got a trickle." Revenue came after Snyk sold to security leaders [vendor; investor write-up (Unusual Ventures, https://www.unusual.vc/how-snyk-found-product-market-fit-guy-podjarny-on-building-a-dev-centric-security-company/); read 2026-10-05: ~5,000 registered developers by summer 2016, self-serve paid plan judged a failure by early 2017, then first AE hired and the CISO targeted as buyer].
- **The closest analogs to a developer-facing Postgres performance tool grew slowly.**
  - pganalyze took about a year after billing went live to reach 10 payers [first-party; founder podcast (SaaS Club ep. 374, https://saasclub.io/podcast/pganalyze-lukas-fittl-374/); read 2026-10-05: payments added in 2014, "over a year" to 10 customers via word of mouth and user-group talks].
  - pgMustard took 3 years to go from its first subscriber to its 100th [first-party; company site; read 2026-10-05 in the June 2023 archived About page: first customer April 2019, 100th April 2022; the live page now says 400+ customers].
  - Both were bootstrapped.
- **A founder was in the loop even in many self-serve cases.** Examples: PostHog's calendar on the pricing page, Dependabot's one-to-one outreach, Renovate's personal invitations, and Codecov's founder doing sales [first-party; mixed access].

### Caveats

- **Survivors only.** Every company here is alive, acquired or well known. The set says nothing about tools that took the same paths and failed.
- **Self-told stories.** These accounts come mostly from founder podcasts, company blogs and investor write-ups. Such sources tend to tidy timelines and leave out dead ends.
- **Weak sourcing in places.** 17 of 31 rows rest partly on search snippets, and 21 rows were not spot-checked.
- **Numbers can drift from sources.** One checked row (Renovate's "500 installs") carried a number its cited source does not contain. Unchecked rows deserve the same caution.
- **Our judgement.** The category labels are ours. Subgroups of 4–10 rows are too small for base rates.


---

## 3. How developers describe slow Postgres queries

### Sources and limits

- **GitHub: 40 excerpts** from issues and discussions of Node ORMs and drivers (Prisma, Drizzle, TypeORM, Sequelize, porsager/postgres).
  - They were read through a web text extractor. Issue pages showed only the opening post.
  - Three excerpts (E28, E29, E32) may be slightly paraphrased.
- **Hacker News: 41 excerpts**, seen only in search results.
  - 22 are verbatim comment openings (V). 19 are the search engine's paraphrase (S).
  - HN dates are estimates.
- **Blocked sources.** Stack Overflow, DBA Stack Exchange and Reddit were blocked.
- **Main bias.** ORM issue trackers attract reports that blame the ORM. Slowness the developer caused, such as a missing index, more likely goes to Stack Overflow, which we could not read. So index problems are probably undercounted here.

### Triggers: what made people start digging

The two sources were coded separately, so the counts are not added together.

| Trigger | GitHub (n=40) | HN (30 that name a trigger) |
|---|---|---|
| Saw the ORM's SQL in a log: N+1, too many queries, bad query shape | 11 | 15 (with overfetching and "no JOINs") |
| Slow in production or right after deploy | 6 | 6 (3 production-only, 3 sudden plan changes) |
| ORM slower than the same SQL in psql or a raw driver | 5 | counted in the 15 above |
| Data growth, big tables, deep pages | 5 | (9 of 41 mention size) |
| Missing tooling: EXPLAIN, slow-query log, full SQL | 4 | 3 (can't tie a query to its code) |
| Upgrade or feature-flag regression | 3 | none |
| Index not used, or missing foreign-key index | 3 | 1 direct |
| Trying to test performance before production | 0 | 5 |
| Debugging a known slow query with EXPLAIN | none | 4 |

**Context mentions** [our coding]:
- **CI:** 1 of 40 on GitHub and 6 of 41 on HN. Most HN CI mentions are about test data that doesn't look like production.
- **Production:** about 12 of 40 on GitHub, 21 of 41 on HN.
- **Data size:** 17 of 40 GitHub excerpts give one, and 6 of those stress that the data was tiny.

### Words people use

- **Typed by people reporting problems:**
  - "slow", "very slow", "extremely slow", "waaaaay to slow"
  - Almost always a timing: "4-5 seconds", "15+s", "40ms vs 1ms"
  - "N+1", "an n+1 thing", "many select queries"
  - "fast with raw SQL", "via psql"
  - "with relations", "include", "nested"
  - "slows down with time", "timeout", "row reads"
- **Nearly absent from people reporting problems:**
  - "missing index" appeared only in maintainers' replies.
  - "EXPLAIN" appeared only in one feature request.
  - "query plan", "seq scan" and "pg_stat_statements" appeared in none of the 40 GitHub excerpts.

### Workarounds, most common first

- **On GitHub:**
  1. Drop to raw SQL or raw results.
  2. Turn off a join strategy, or downgrade the ORM.
  3. Restart the app, or call `$disconnect`.
  4. Switch to Kysely or Drizzle.
  5. Tune pool size, PgBouncer or region.
  6. Add indexes by hand.
  7. Rewrite the query shape.
  8. Write a custom logger or add tracing.
- **On HN, people also use:**
  - Debug toolbars and N+1 detectors such as Bullet.
  - Production monitoring: pg_stat_statements, auto_explain, Datadog, pganalyze.
  - Plan readers: explain.dalibo.com (PEV2), explain.depesz.com, pgMustard.
  - Production-like copies or clones, and template databases in CI.
  - Index advisors.
  - SQL comment tags that tie a query to its code.

### Objections to tools

- **Fidelity.** This is the main objection to catching problems before production: CI and staging data don't match production, so plans differ.
- **Cost and return.**
  - One user dropped pganalyze once returns faded.
  - pganalyze's CEO says it doesn't fit small databases or teams that rarely change the database.
  - pgMustard is weighed against "free alternatives".
- **Noise.** Bullet flags N+1s the developer wants on purpose.
- **Setup.** Two examples: "How does one install this on a aws rds instance?" and "more difficult than it should be".
- **Data access.** People value plan readers that run locally. Copying production means scrubbing personal data first.
- **Price of the tool itself.** None found on GitHub. The only cost complaint there was about metered database usage.

### A few excerpts

All GitHub excerpts are [practitioner; GitHub; read via text extractor]. HN excerpts are tagged separately.

- "inspecting the prisma logs, it seems it runs a query for every team to get user count" / "looks like an n+1 thing, is this known?" (prisma/prisma#16829, 2022-12-15)
- "takes at least 40ms which is waaaaay to slow." / "via psql or even the underlying pg-driver brings up query times around 1ms." (drizzle-orm#3001, 2024-09-22)
- "Developers must manually extract SQL with `.toSQL()`, wrap it in a raw `EXPLAIN ANALYZE` call and lose all type safety" (drizzle-orm#6128, 2026-08-12)
- "Is there any way to get warnings about this when `relationMode="foreignKeys"` with postgres?" (prisma discussion #25783, reply 2025-03-07)
- A maintainer, not the reporter: "please try adding indexes for the fields that you are searching" (prisma discussion #14514, 2022-11-23)
- Paraphrase: "same query plan as the dogfood environment and staging, but in production it always timed out after 60 seconds" [practitioner; HN; S, search paraphrase only]
- Paraphrase about RegreSQL: "only valid for similar data patterns and same cardinality" [practitioner; HN item 45924619; S]
- Paraphrase about pganalyze: "ROI decreased until it wasn't worth it" [practitioner; HN; S; item uncertain]

**What it suggests.** Developers feel the pain in production and in the ORM's query log, not in CI. A tool that checks before production has to create the CI habit itself and answer the fidelity objection. Lead with "slow" and a time. Keep "EXPLAIN", "plan" and "index" for the docs.

**Next.** Get first-hand Stack Overflow and DBA Stack Exchange text. The options are: the user allows those hosts in the session's network settings, approves the BigQuery public datasets, or pastes exports.

Data:
- (local working files, not committed)
- (local working files, not committed)

---

## What to change

### (a) Changes to the marketing-expert MCP's playbooks

These are generic and contain no company-specific content.

1. **developer-tools.md, "AI coding agents": measure the whole session, not the first call.** When a request names a file or code, agents read the code before calling any tool. Score whether your tool is called at any step, in a live loop [our experiment; n=48; one model family; simulated choice].
2. **developer-tools.md: state limits as facts, and expect them to send some requests elsewhere.** Put each limit next to what the tool does give, and test the framing. One "no connection, no timings" line moved 3 of 4 picks to a live-database tool [our experiment; one task, n=4 per arm].
3. **developer-tools.md: move rules for reading output out of descriptions and into results or output schemas.** In our run, cutting descriptions by 54% changed no picks [our experiment].
4. **developer-tools.md: say which number your tool reports when a word is ambiguous.** "Slower" means wall-clock time to many users and agents. The agents raised this doubt on their own in 8 of 8 trials [our experiment].
5. **developer-tools.md: write the first sentence as the user's question.** It is the only pattern that won a task outright in both arms. Weak evidence (one task), but it fits the word-overlap finding [research; ICLR 2026 benchmark; README read].
6. **experimentation.md or developer-tools.md: treat tasks, not trials, as the sample.**
   - One model gives near-identical answers to the same prompt.
   - Vary the request wording rather than only the tool order.
   - Include a control task where your tool should not be picked.
   - Report how many cells were unanimous.
7. **first-customers.md: add "Base rates from 31 developer-tool cases".**
   - Median 9 months from launch to first revenue (n=17 known; range 0–30).
   - First payers: self-serve 52%, sales-led 29%, mixed 16%.
   - Sales-led clusters where the product holds production data or the user is not the buyer.
   - Developer-facing database tools ramped slowly.
   - Carry the survivor and self-report caveats with the numbers.
8. **first-customers.md: add four patterns, each tagged with its access level.**
   - Log every "how do I pay?" message as a demand signal.
   - The first paid feature is often a professional need (private repos, custom domains, white-label), not usage.
   - A self-serve paywall stalls when the user is not the buyer.
   - A founder stays in the loop even in self-serve.
9. **pricing.md: convert a flat team price into a per-seat price** at the smallest and largest target team. Compare it with per-seat tools the buyer already pays for. A flat price that is fair at 20 seats can read as steep at 5.
10. **pricing.md: note the return-fades objection to always-on monitors** [practitioner; one HN account, paraphrase only]. Pricing tied to changes, such as per repo or per pull request, may hold up better. That is inference, not tested.
11. **customer-research.md: add "Mining public issue trackers and forums".**
    - Mark each excerpt as verbatim or paraphrase.
    - Name the source's bias. For example, ORM trackers over-represent "the ORM is at fault".
    - Keep users' words apart from maintainers' and experts' words.
    - Count context mentions (CI, production, data size).
    - Plan for blocked hosts: use exports or public datasets, with the user's approval.
12. **messaging-and-copy.md: write headlines and outreach in the words users type.** Put expert terms in the docs. In our coding, "missing index" and "EXPLAIN" came almost only from maintainers.
13. **_conventions.md and research/: check each case fact against its primary source before it enters a playbook.** In our spot check, 5 of 10 rows needed a correction, and one number was not in its cited source.
