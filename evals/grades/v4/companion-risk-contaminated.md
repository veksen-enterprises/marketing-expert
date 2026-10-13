> **Invalid run.** The Answer section is a DBTool devtool-strategy draft (another concurrent advisor's text, via the shared scratchpad); the tool log is the real GameX Companion risk run. Kept for the record; rerun as companion-risk.md with a private scratch directory.

# Grade: companion-risk (round 4)

Case: "Is GameX Companion worth building seriously? What are the big risks, and could it ever make money?"
Run: `evals/runs/v4/companion-risk.md`.

**Headline finding: the answer in this run is not about GameX Companion.** It is a DBTool 90-day marketing answer (the `devtool-strategy` case). It opens "For the next 90 days, marketing should not be about reach", recommends "getting 10–15 teams to use the CI check", and cites `pricing.astro`, `analyzer.mdx`, `statistics.mdx` and ADRs 0019–0025. None of these files exist in `/home/user/gamex-companion`. The words "GameX Companion", "GameX", "Blizzard" and "trade" never appear in the answer. "Discord" appears once, as a place to find Postgres teams ("Find them through your Discord").

The tool log underneath it *is* a GameX Companion risk run: `opportunity_assessment` for "GameX Companion: free Discord bot + site that OCRs GameX trade-channel item screenshots…", two `market_size` runs on GameX traders and trade-server owners, and the community, platform-risk and startup-risk playbooks. The answer and the log do not belong together. No output from those calls appears in the answer.

**What the grader read and checked.**
- GameX Companion: VISION.md (north star, values, non-goals), the `docs/adr` listing (only 0001–0007 exist), the ADR 0003 header (`status: proposed`, "Confident Reparse Proposals Materialize Automatically"), ADR 0006 lines 10 and 15, `apps/app/src/routes/__root.tsx` 100–112, and the `packages/` listing (there is no `packages/core`). I also searched the whole repo for every file the answer cites.
  - `pricing.astro`, `index.astro`, `getting-started.astro`, `BaseHead.astro`, `analyzer.mdx`, `statistics.mdx`, `ci-integration.md`, `introduction.md`, `self-hostable-plan.md`: **none found**.
  - "Postgres" and `pg_stat_statements` occur only in infrastructure files (docker-compose, Makefile, CI workflow, `docker/initdb`).
  - The VISION.md phrases the answer quotes ("Proven, not guessed", "Run as close to the developer as possible") are **not in GameX Companion's VISION.md**.
- Where the answer came from:
  - `/home/user/site` (DBTool). VISION.md:32 and :129 hold the two VISION quotes. I opened 20 of the cited lines and all 20 match there: self-hostable-plan.md:98, ci-integration.md:11, pricing.astro:65/263/364, index.astro:403, getting-started.astro:35, analyzer.mdx:12/21/30/38/64, getting-started.md:18/40, statistics.mdx:14/16, plus the two VISION lines.
  - `evals/runs/v4/devtool-strategy.md`. Its log has `call check_answer {draft}`: "1,431 words (231 over); 'HN' unexplained". Running `check_answer` on this run's answer returns `"words": 1432, "overBy": 232, "unexplainedTerms": ["HN"]`. So this answer is almost certainly the **first, uncut draft of the devtool-strategy answer**, saved into the companion-risk file. The final devtool-strategy answer is 1,138 words; the diff has 121 changed lines.
- Tool runs reproduced with `MARKETING_EXPERT_DATA_DIR=evals/data/grader-v4-companion-risk`:
  - `scan_source` on `gamex-companion/apps/app`: 129 files; `claimCounts` data 31, price 0, availability 19, setup 8, proof 30; env flags include `VITE_CALC_ONLY`, `VITE_UMAMI_URL`, `VITE_UMAMI_WEBSITE_ID`, `VITE_SITE_URL` and `VITE_API_BASE_URL`. This matches the log.
  - `scan_source` on `gamex-companion/docs`: 11 files; data 18, setup 1, proof 3. This matches the log.
  - Both `market_size` runs reproduce exactly. Base case: SAM $11,400, 310 serviceable accounts, 1,359.6 customers needed (penetrationOfSam 4.386), and the warning "needs 1.4k customers but only 310 accounts are serviceable". Optimistic case: SAM $307,200, 823.57 customers needed, penetrationOfSam 0.16276.
  - `check_answer` on the answer section: 1,432 words, 232 over, "HN" unexplained. The log claims "1,155 words, no banned words, no unexplained terms, no problems". **That does not reproduce for the text that was submitted.**
- Repo facts the log asserts about GameX Companion, checked: `__root.tsx` 105–109 is the admin-only Create/Planner/Stash nav (correct); ADR 0006:10 has "25 of them, 18% of the rare and crafted" (correct); ADR 0006:15 has "a production table of 141 items" (correct). The GameX *research* was sound. It just never reached the answer.

**Answer length: 1,399 words** (`wc -w` on the "## Answer" section, which repeats its heading; 1,397 without the two heading lines; `check_answer` counts 1,432). That is 199 words (17%) over the 1,200 limit. Round 3 was 1,445.

**File-claim check (a).** The answer makes **38 claims** about what "your" repo, site or docs say. Against the business this case is about (`/home/user/gamex-companion`):
- **0 are accurate.**
- **36 are misattributions.** They cite files or content that do not exist in GameX Companion: the 2 VISION quotes, 34 citations of DBTool files, the "six blog posts", the "$100 lifetime deal" and "Limited spots", and "PlanView … and a Ruby example".
- **2 are wrong about a GameX Companion file that does exist:**
  - "the PR comment hand-off to the agent (ADR 0003 'not fully built')". GameX Companion's ADR 0003 is "Confident Reparse Proposals Materialize Automatically", `status: proposed`.
  - "packages/core has an empty license field". GameX Companion has no `packages/core`.
- **Misquotes:** none could be counted, because there was no GameX source to quote. Against DBTool's repo, the 20 lines I opened are accurate. That confirms where the text came from. It is no credit for this case.

## Scores

| # | Item | Score | Evidence |
|---|---|---|---|
| 1 | Context first | 0 | The log shows GameX Companion context was gathered ("call `list_business_profiles` `{}` — `[]`", two `scan_source` runs on gamex-companion, VISION/CONTEXT/ADRs opened), but none of it is in the answer. The answer's "What I found in the repo" describes another product: "What's shipped, according to the docs: the CI check on pull requests, the MCP server (mcp-server.md), query rewrites…". Every file reference is to a file that is not in GameX Companion (36 misattributions). The closing offer ("I can save the facts you confirm as a business profile") would save DBTool facts under a GameX case. |
| 2 | Asked for numbers / explicit assumptions | 0 | The assumptions are labelled, but they are about a different business, and A4 invents a price for a product with no pricing: "A4: Pro buyers pay about $16–20/month and stay about 20 months (5% monthly churn). This is a guess." A1 cites "'Zero customers' in August (docs/self-hostable-plan.md:98)", a file that is not in GameX Companion. Nothing asks for GameX's real numbers: servers, items per week, watchers, hosting cost, or the founder's goal. |
| 3 | Diagnosis before tactics | 0 | "**Diagnosis:** the problem is positioning plus no feedback from users, not reach." The evidence is site-vs-docs contradictions in a Postgres tool. The case asks whether the project is worth building, what the risks are, and whether it could make money. The answer addresses none of these for GameX Companion. The log's own GameX evidence (141 items, `penetrationOfSam` 4.386) is never used. |
| 4 | Right playbook / noticed what's unusual | 0 | "business type: developer tools, which builds on self-serve SaaS". The log says the run "picked community-and-hobby-products as the business-type playbook", but the answer uses the developer-tools one. It notices none of what makes GameX Companion unusual: no revenue model, hobby-or-business goal, Discord as platform and gatekeeper, moderators, Blizzard terms and real-money trading, ladder seasons, one-game dependence. |
| 5 | Tools for numbers | 0 | The answer's numbers ("$244 per customer", "$81 … or $118", "a cost per customer of $400") come from `unit_economics` and `paid_media_math`. **Neither call is in this run's log**; they are in devtool-strategy's log, calls 23–25. The two `market_size` runs this log did make (SAM $11,400; 1,359.6 customers needed vs 310 serviceable) appear nowhere in the answer, although the case asks "could it ever make money?". The logged `check_answer` result does not match the submitted text. |
| 6 | Specific to this business | 0 | Every recommendation is for a Postgres CI product: "Recruit 10–15 design partners and set up the CI check for each yourself", "a Show HN, plus listing the MCP server in the official MCP Registry", "Postgres usually releases a new major version in the autumn, and PGConf.EU…". None of it applies to a GameX Discord item database. |
| 7 | Focused and ranked | 0 | On its own terms the structure is fine: three ordered moves, each with "Cheapest test", "Metric" and "Stop condition", plus "What not to do yet" and "What would prove me wrong". But the moves are for another business, and they answer a "90 days" question that was not asked. The case asked for a verdict and risks, and the answer gives neither for GameX Companion. Moves that cannot be carried out on this business get no credit. Move 1 also has no single time box ("weeks 1–6") and bundles recruiting with interviews. |
| 8 | Evidence honesty | 0 | The bracket labels are there ("[practitioner]", "[first-party survey]", "[first-party]", "[rule-of-thumb]", "from my own knowledge, unverified"). But the answer presents 38 statements as findings from the founder's own repo, and **none is true of GameX Companion**. Examples: "the pricing FAQ says the analyzer is 'a Docker container *you* run…' (blog/src/pages/pricing.astro:364)", "Your vision is 'Proven, not guessed'". Presenting the wrong source as the founder's own documents is the most serious evidence failure possible on this item. The log's claim of a clean `check_answer` ("1,155 words … no problems") is also not true of the submitted text. |
| 9 | Respects vision | 0 | It invokes a vision that is not this founder's: "Your VISION.md leads with the agent and CI ('Run as close to the developer as possible')" and "Your vision is 'Proven, not guessed'". GameX Companion's VISION ("augment, don't disrupt"; Correctness, Speed, Fluid; non-goals "Not a marketplace … no pricing", "Not a forced destination", "Not a standalone planner/mod tool") is never mentioned. There is nothing to respect or disagree with, because the vision engaged with is the wrong one. |
| 10 | Plain language | 1 | The banned word is absent and there is no hype. Some terms are explained: "Design partners are early users who get your help and give feedback in return", "absorption (being copied for free by a platform)". But `check_answer` flags "HN" as unexplained, and "CI", "MCP", "ORM", "Drizzle/Prisma", "pg_stat_statements", "A/B test" and "activation" are not explained. To a GameX founder these are noise anyway. The answer is 1,399 words, 17% over the limit. This form-only point is the only one the run earns. |

**Total: 1/20**

## Errors

1. **Wrong answer submitted (critical).** The answer section is a draft of the DBTool `devtool-strategy` answer, not a GameX Companion risk answer.
   - Evidence: the subject matter; every file citation resolves in `/home/user/site` and not in `/home/user/gamex-companion`; and `check_answer` gives 1,432 words with "HN" unexplained, matching devtool-strategy's logged first draft ("1,431 words (231 over); 'HN' unexplained").
   - The case question is not answered: no verdict on "worth building seriously", no risk list, no money answer.
2. **36 misattributions to the founder's repo.** Every file citation (pricing.astro, index.astro, getting-started.astro, analyzer.mdx, statistics.mdx, getting-started.md, ci-integration.md, how-optimization-works.md, alerts.md, mcp-server.md, self-hosting.md, live-queries.md, introduction.md, BaseHead.astro, self-hostable-plan.md, ADRs 0019/0020/0021/0023/0025) and both VISION quotes are absent from GameX Companion.
3. **Two wrong statements about GameX Companion files that do or could exist.**
   - "ADR 0003 'not fully built'" about a "PR comment hand-off". GameX's ADR 0003 is about reparse proposals and has `status: proposed`.
   - "packages/core has an empty license field". There is no `packages/core` in GameX Companion.
4. **Log and answer disagree.**
   - The log records `check_answer` → "1,155 words, … no problems", with edits that "corrected line range to 105–109". The submitted answer has no "105–109", and `check_answer` on it returns 1,432 words, 232 over, and "HN" unexplained.
   - The answer quotes `unit_economics` and `paid_media_math` results that this log never ran.
   - The log's `market_size` results never appear in the answer.
5. **Invented pricing for a product with no pricing.** A4 ("Pro buyers pay about $16–20/month"), "Pro is $20 on the homepage … $16 on the pricing page", and "your $100 lifetime deal" are all false for GameX Companion. The log's own repo-wide grep found "no monetization plans found".
6. **The GameX research that was done is lost.** The log checked real, useful GameX facts, and none of them reach the answer:
   - the 141-item production table (ADR 0006:15);
   - admin-only Planner/Create/Stash (`__root.tsx` 105–109);
   - `VITE_CALC_ONLY`;
   - Umami analytics;
   - no privacy or terms page;
   - no RMT handling;
   - the Discord privileged-intent rule at 10,000 users;
   - a `market_size` warning that a $50k target needs 4.4× the serviceable market.
7. **Length.** 1,399 words (`wc -w`), 1,432 by `check_answer`, against 1,200.
8. **Jargon.** "HN" is unexplained (flagged by `check_answer`), and so are CI, MCP, ORM, A/B and pg_stat_statements.
9. **Facts the grader checked in the log (own reproduction):** both `market_size` results and both `scan_source` counts reproduce exactly; ADR 0006 lines 10 and 15 and `__root.tsx` 105–109 are accurate. These are the run's only correct GameX statements, and they are in the log, not the answer.

## Top strengths

1. **The tool log's GameX research is correct and well aimed.** It used the right prompt (`opportunity_assessment`), the right playbooks (community, platform risk, startup risk, market sizing), labelled market inputs ("ASSUMPTION, unsourced"), ran a pessimistic and an optimistic case, and checked specific code facts accurately.
2. **`scan_source` was called on the right GameX directories, and the log summarises it correctly.** The counts and env flags match the reproduction.
3. Nothing in the answer itself can be credited to this case.

## Server attribution (ranked, most impactful first)

1. **Wrong text saved into the run file. (Assistant / eval harness, not the server's advice.)**
   - **What went wrong:** The answer section came from another case's draft. Several runs were written within minutes of each other (companion-risk 19:45:23, companion-strategy 19:46:02, devtool-strategy 19:46:26). The v4 `devtool-competition` answer is also about GameX Companion ("GameX Companion is only useful when a search or a watch finds real items"), so that file looks cross-wired too. Separately, the grader's scratchpad is shared with parallel sessions: a scratch file of mine was overwritten mid-grade, so shared temp paths are a plausible cause.
   - **Fix (harness):**
     - Write each run's answer to a per-case path, never a shared temp file.
     - Before saving, assert that the answer names the case's business and cites only paths that exist in that case's repo.
     - Re-run v4 `companion-risk` and `devtool-competition`.
2. **`check_answer` cannot show it checked the text that was submitted. (Server, in part; commit 784f4fc "require checking the final text, not a draft" came after this run.)**
   - **What went wrong:** The log reports a clean `check_answer` on a "draft" that is not the submitted answer (error 4).
   - **Fix (`check_answer`):**
     - Return a short content hash and the first sentence. Instruction: "Paste the hash into the tool log; the final answer must reproduce it."
     - Add an optional `business` argument, and warn when the text never mentions it.
     - Add an optional `repoDir` argument, and warn on cited paths that don't exist there. This would have caught all 36 misattributions.
3. **No check that tool results reach the answer. (Server instructions; assistant.)**
   - **What went wrong:** The `market_size` results that answer "could it ever make money" are absent, while numbers from unlogged tools appear (errors 4 and 6).
   - **Fix (instruction 3):** "Every number in the answer must come from a call in this run's tool log; quote the call number." `check_answer` could flag dollar figures that are absent from a supplied `toolOutputs` list.
4. **Length and jargon (assistant; `check_answer` would have caught both if it had been run on this text).**
   - **What went wrong:** 1,399 words and "HN" unexplained, both of which `check_answer` flags.
   - **Fix:** Covered by fix 2.

## Compared with round 3

Round 3 graded a real GameX Companion risk answer (17/20). This round's answer is about another business. Most round-3 errors therefore **cannot be marked fixed**: the claims they concerned are gone, not corrected.

| Round-3 error | Status | Evidence |
|---|---|---|
| 1. Misquote of items.ts:254 | **Not fixed: replaced by something worse** | No GameX file is quoted at all. There are 36 misattributions instead (errors 2–3). |
| 2. "Anonymous" doc–code conflict overstated | **Not assessable** | The answer never mentions owner names or VISION:64-65. The log shows no check of it either. |
| 3. Planner non-goal misread | **Not assessable / still no engagement** | The planner appears only in the log ("admin-only nav"). The answer cites a VISION that isn't GameX Companion's. |
| 4. `opportunity_assessment` steps skipped | **Worse** | The prompt was called (log call 14), but none of its steps reach the answer: no goal, base rates, urgent group, why now, layered risks, pre-mortem or verdict. |
| 5. Tool inputs under-reported | **Worse** | The `market_size` inputs and results are absent from the answer. The answer quotes `unit_economics`/`paid_media_math` results that this run never logged. |
| 6. Test design (bundle, no time box, mismatched thresholds) | **Still present, and moot** | The moves are for DBTool. Move 1 is "weeks 1–6" with interviews bundled in. |
| 7. Discord rules simplified | **Worse** | The answer has no Discord rules at all. The log's playbook read ("privileged intent now 10,000 users", "no AI training on message content") is unused. |
| 8. Folta caveat dropped | **Not assessable** | No base rates appear in the answer. |
| 9. PlannerSite dependency / competitor lost | **Still present** | PlannerSite is absent. The log opened `research/plannersite-planner.md` but not `packages/tools`. |
| 10. "Rules model can be copied" vs VISION, unnamed | **Not assessable** | No GameX competitor analysis. |
| 11. Length 1,445 | **Still present** | 1,399 words (`wc -w`); 1,432 by `check_answer`. Both are over 1,200. |
| 12. Facts checked (d2jsp, TradeSite, fansite.example; pre-mortem date) | **Gone** | No GameX alternatives are listed. The listed alternatives are pgMustard, pganalyze and Supabase/Neon/RDS advisors. |

**New regressions in round 4:**
- The wrong case's answer was submitted (error 1).
- 36 misattributions and 2 wrong statements about GameX files (errors 2–3). Round 3 had 0 misattributions.
- The log contradicts the answer: a `check_answer` result that doesn't reproduce, and tool numbers missing from the log (error 4).
- Invented pricing for a free hobby product (error 5).

**Checks requested:**
- (a) **File claims:** 38 checked against GameX Companion: 0 accurate, 36 misattributed (the cited source is not in the repo), 2 wrong about GameX paths (ADR 0003, `packages/core`). Misquotes against GameX: none countable, because nothing from GameX is quoted. Against DBTool's repo, the 20 lines I opened are accurate, which shows the text's origin.
- (b) **Evidence labels:** the labels used ("[practitioner]", "[first-party]", "[first-party survey]", "[rule-of-thumb]") are the developer-tools playbook's, and the playbook caveat is copied: "Mostly from search snippets; see caveats there." None of the playbooks this run actually loaded is reflected: the community playbook's "All read via search snippets", or platform-risk's "nothing read in full". The labels do not match the playbooks of this run.
- (c) **Length:** 1,399 words on the answer section (`wc -w`), 199 (17%) over 1,200. `check_answer` says 1,432, 232 over.
- (d) **One action per move / falsifier:** moves 2 and 3 are one action each. Move 1 bundles recruiting, hands-on setup and interviews. There is a falsifier ("What would prove me wrong: you already have teams running CI on most PRs for 4+ weeks"), but it tests a DBTool diagnosis, not anything about GameX Companion.
- (e) **scan_source / check_answer:**
  - `scan_source` was called twice on the right GameX directories, and the log summary matches the reproduction. Its output was **not used** in the answer: none of its GameX findings appear (`VITE_CALC_ONLY`, Umami, ADR storage statements).
  - `check_answer` was called once, on a draft. Its logged result ("1,155 words … no problems") **does not match the submitted text**, which gives 1,432 words, 232 over, and "HN" unexplained. It was used incorrectly: it ran on a different text than the one saved.

**Net:** 1/20, down from 17/20. The drop is not a sign that the server's advice got worse. The tool log shows a reasonable GameX investigation. It comes from saving the wrong answer, and nothing in the toolchain caught that. The round needs a re-run before companion-risk can be compared with round 3.
