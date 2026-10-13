> **Invalid run.** The Answer section is a GameX Companion draft (another concurrent advisor's text, probably through a shared temp file used for check_answer); the tool log is DBTool's. Kept for the record; the case was rerun as devtool-competition.md with a private scratch directory.

# Grade: devtool-competition, round 4 (DBTool: "How do we compete, and are we at risk of being a feature?")

**The answer section is about a different business.** The run file's `## Answer` (lines 1–64) is a growth plan for GameX Companion, the GameX item database: "GameX Companion is only useful when a search or a watch finds real items", "Get one trade server's moderators to invite the bot", "Announce publicly in the week a new ladder season starts". It never mentions DBTool, pganalyze, Datadog, AWS Performance Insights, Claude Code, Cursor, or the feature-risk question. The `## Tool log` (lines 66–97) describes a DBTool competition run: `competitive_strategy` for "DBTool", the four competition and dev-tool playbooks, `scan_source` on `/home/user/site/apps/blog` and `apps/docs`, and DT repo files. The answer and the log do not belong together. The answer is also not the round-3 companion-strategy answer: `diff` against evals/runs/v3/companion-strategy.md differs from line 3 on. It is a newly written GameX Companion answer, delivered as the reply to the DBTool question.

I graded what the founder would receive: the answer section, against the question in cases.md. To be thorough I also checked the answer's repo claims, against /home/user/site (the case's repo) and against /home/user/gamex-companion (the repo the claims actually come from).

What I checked. In /home/user/site (commit 7cf5e40, 2026-10-03): docs/adr/0004 line 52, docs/adr/0006 lines 15–16 and 81, and VISION.md 64–65 (the line numbers the answer cites). There is no `apps/bot`. apps/api/src/instrument.ts and the ADR README row for 0023 (to test a tool-log claim). In /home/user/gamex-companion: ADR 0004 50–52, ADR 0005 50–54, ADR 0006 7 and 14–17 and 80–82, VISION.md 62–66 and 126–132, CONTEXT.md 235–239, .env.example, apps/bot/README.md 13–16, 24–27 and 128–132, apps/bot/src/bot.ts 66–77, a grep for `.reply(`, `channel.send` and `.send(` across apps/bot/src, apps/api/src/services/discord-public-log.ts 78–115, apps/api/src/routes/items.ts 250–256, and in apps/app/src/routes `items.$id.tsx`, `_admin-only.tsx` 4–8, `__root.tsx` 29–30, 100, 105–110 and 124–133, and `index.tsx` 6. Also research/plannersite-planner.md 1–4. On the server side, with MARKETING_EXPERT_DATA_DIR=evals/data/grader-v4-devtool-competition, I ran `list_business_profiles` (returned `[]`), `scan_source` on apps/blog and on apps/docs (each returned `"filesScanned": 53`), and `check_answer` on the exact answer text. I grepped knowledge/community-and-hobby-products.md for the answer's evidence labels and read the server's rules 0 and 9 in src/server.ts. I did no web search.

Length: the answer section (lines 3–64, without the `## Answer` heading) is **1,183 words** (`wc -w`). That is under the 1,200-word limit, but only because none of the question is answered.

Citation check: the answer makes 21 claims about what a repo file or the code says. **All 21 are misattributed for this case**: none of the text exists in DBTool's repo. Where the same paths exist, they say something else. /home/user/site docs/adr/0004 line 52 reads "module from ADR-0005, which is the only code that knows how a holder is stored", not "no real users exist yet". VISION.md 64–65 reads "produced it, so a finding points at code a developer can open instead of at a string of SQL", not "is anonymous until contacted". There is no `apps/bot`. Checked against /home/user/gamex-companion, all 21 are accurate, with no misquotes (detail in specific check (a)).

## Scores

| # | Item | Score | Evidence (quoted from the answer) |
|---|---|---|---|
| 1 | Context first | 0 | The tool log says DBTool context was read: "VISION.md, README.md, CONTEXT.md (first 120 lines)", index.astro, pricing.astro, six docs pages, ADRs 0019 and 0023, and `list_business_profiles` "returned `[]`". The answer uses none of it. Every repo fact in it comes from GameX Companion files, for example "docs/adr/0004 line 52, 0006 line 81", "apps/bot/src/bot.ts 68–76" and "apps/app/src/routes/items.$id.tsx 249–300", and the log never records opening those files. The offer to save a profile ("I can save these confirmed facts as a business profile once you answer") is for the wrong business. Of the DBTool context the log lists, nothing reaches the founder. |
| 2 | Asked for missing numbers / explicit assumptions | 0 | The assumptions and questions are all about GameX Companion: "A1. This is a hobby project, not a business", "How many items list per week, and what share hold?". Nothing asks for DBTool's users, paying accounts, churn or stage, which the competition question depends on. |
| 3 | Diagnosis before tactics | 0 | "So the thing holding you back is **supply**: how many items flow in." That is a diagnosis, with evidence, for a different product. The question's own diagnosis (is competition the constraint for DBTool, and is it a feature or a product?) is never made. |
| 4 | Right playbook, noticed what's unusual | 0 | The log loads competing-with-incumbents, platform-and-feature-risk, competitive-analysis and developer-tools, but the answer applies none of them. Its labels ("moderators install or remove you in one click [practitioner]", "10,000 users") come from community-and-hobby-products, which the log never loads. Nothing on agents as a channel or a rival, incumbents' copy cost, or feature/product/company. |
| 5 | Tools for numbers | 1 | The answer presents no hand arithmetic as fact, and its figures ("141 items") are cited from a file. The log says "No calculator tools were run: the founder gave no numbers, and I didn't invent any". But that line describes a DBTool run the founder never sees. The answer gives no numeric reasoning about the question (prices, copy cost, the share of users who would still pay), so the item cannot be credited further. |
| 6 | Specific to this business | 0 | Very specific, but to GameX Companion: "40ias cruel claw", "d2jsp (the largest GameX trading forum, priced in Forum Gold)", "r/gamex". There is not one DBTool feature, user, channel or page. |
| 7 | Focused and ranked | 0 | Three ordered moves, each one action with a metric and a stop condition, plus "What not to do yet" and a falsifier: "if the database already holds thousands of live items and watches fire often, supply is fine". The structure is good, but none of the moves addresses competing with pganalyze, Datadog, AWS or coding agents. For this case there are zero moves. |
| 8 | Evidence honesty | 1 | Inside the answer, labels and hedges are mostly sound: "(my own knowledge, unverified)", "Docs ahead of code, or I missed it", "I can't tell which build is live". "[first-party, read via search snippets]" for the Discord policy matches the playbook's "[first-party]" plus its source note, "All read via search snippets". But the record of the work is unreliable. The log reports `check_answer` results ("1,207 words (7 over); 'HN' unexplained", then "1,189 words, no problems") that do not match this text, and the answer's sources (community-and-hobby-products, GameX Companion files) appear nowhere in the log. A reader of the file would think the advice rests on DBTool sources. It does not. |
| 9 | Respects vision | 0 | DBTool's VISION.md is never engaged. The answer cites "VISION.md 64–65" and "VISION.md 128–131", which are GameX Companion's vision ("The owner is anonymous until contacted"; "**Item lifecycle.**"). DBTool's "Proven, not guessed" and its four gates do not appear. With no DBTool recommendations, there is nothing that respects the founder's vision. |
| 10 | Plain language | 1 | Short sentences, no hype, the banned word absent, and most terms explained: "an 'atomic network' (the smallest group that works on its own)", "your core loop (the main thing people come back for)". It is under 1,200 words. But "IAS", "imbue", "OCR", "Forum Gold" and "ladder season" are never explained, and to the DBTool founder all of them are jargon. `check_answer` missed them. |

**Total: 3 / 20**

## Errors

1. **Wrong answer delivered.** The answer section answers the companion-strategy question ("How do I get people to use it?") for GameX Companion, not the devtool-competition question. None of the question's named competitors, nor the feature-risk question, is mentioned. This alone makes the reply useless to the founder who asked.
2. **21 of 21 repo claims misattributed for this case.** Each cites a path as if it were the business's repo ("docs/adr/0004 line 52", "VISION.md 64–65", "apps/bot/README.md 129–131", "CONTEXT.md 236–238"). In /home/user/site those lines say other things (ADR 0004:52 "module from ADR-0005, which is the only code that knows how a holder is stored"; VISION.md:64–65 "produced it, so a finding points at code a developer can open…"), and apps/bot does not exist. A founder who follows the references lands on unrelated text.
3. **Tool log does not match the answer.**
   - The log's first `check_answer` flagged "'HN' unexplained". The answer contains no "HN".
   - The log's final check reports "1,189 words, no problems". My `check_answer` on the exact answer text returns `"words": 1199` and `"problems": ["Explain on first use, in brackets, or replace: atomic network."]`.
   - So neither logged check was run on the text that was delivered. That breaks server rule 9: "run check_answer on the exact text you will send, after your last edit".
4. **Sources used but not logged.** The answer's evidence (Discord's AI-training ban on message content, the 10,000-user privileged-intent rule, Blizzard's API terms, "atomic networks", timing launches to the game's calendar) matches knowledge/community-and-hobby-products.md lines 29–30, 34, 54, 59 and 69. The log never calls `get_playbook` for that playbook, and it lists no /home/user/gamex-companion files as opened.
5. **scan_source output gathered but unused.** The log's summaries of both scans are consistent with what I reproduced (53 files each; the blog scan lists data claims such as "Your connection string"; the docs scan lists "This instance stores the string and starts a Collector … Do not hand the user a `docker run` command"). The log also says the scan found the "$20 index.astro:403 vs $16 pricing.astro:65" price gap and the "soon" labels on shipped MCP and rewrites. None of it reaches the answer. Round 3's top strength (site-vs-docs contradictions tied to buyer trust) is gone entirely.
6. **check_answer false positive and false negatives (tool).** It flags "atomic network", which the answer explains in brackets right after the closing quote. It misses "IAS", "OCR" and "imbue", which are never explained.
7. **Secondary tool-log claim overreaches (not in the answer).** "Sentry is already opt-in, so ADR 0023's 'not built' status is stale." instrument.ts does gate Sentry on `SENTRY_DSN` ("Telemetry is opt-in (ADR 0023)"). But ADR 0023 covers cloud integrations as optional modules in general, and one opt-in client does not show the whole ADR is built. "Partly built" would be accurate.
8. **Round-3 omissions all still open** (because the topic is absent): copy cost not quantified, a benchmark judged by the planner's own estimate, the PG18 statistics-import risk, the risk questions on "share who would still pay" and customer ownership, and platform dependencies (GitHub-Actions-only CI, the Node-only `setup_ci`, Claude-Code-only setup docs).

## Top strengths

1. Judged as a GameX Companion answer, it is careful. All 21 citations check out in /home/user/gamex-companion. The privacy contradiction ("VISION.md 64–65 says the owner 'is anonymous until contacted'" versus "Owned by" with avatar at items.$id.tsx:297 and the public `/items/:id` route "with its owner") is real. The bot-reply finding is hedged correctly ("Docs ahead of code, or I missed it"). My grep of apps/bot/src finds only `user.send(text)` at bot.ts:75.
2. The structure the server asks for is now followed: three single-action moves, each with a metric, a time box (Moves 1–2) and a stop condition that is not circular ("most watches get zero matches in two weeks … go back to move 1"), plus an explicit falsifier. If the same discipline is applied to the right question, round 3's item-7 problems would be fixed.
3. The process recorded in the log (if it was really run for a DBTool draft) followed the new rules: `scan_source` on both the marketing site and the docs, and `check_answer` run twice with a revision in between.

## Server attribution (ranked, most impactful first)

1. **Wrong answer for the question (assistant, with a server gap).** Most likely the assistant mixed two sessions' or two cases' drafts and pasted the GameX Companion answer above a DBTool log. Nothing in the server would catch it. Fixes:
   - Give `check_answer` optional `business` and `question` inputs. It should fail when the business name, or none of the question's key nouns (here "pganalyze", "Datadog", "feature"), appears in the text.
   - Add to INSTRUCTIONS rule 9: "Before sending, re-read the user's question. The first paragraph must name the business and answer that question."
2. **The log cannot prove which text was checked (tool).** `check_answer` returns only counts. Have it return a short fingerprint of the text (first 8 hex characters of a SHA-256 hash, plus the first five words), and require the tool log to record it. The eval harness (or a grader) can then recompute the fingerprint of the answer section and reject a run whose fingerprint differs. That would have caught Error 3 automatically.
3. **Citations not tied to the case's repo (server).** Rule 0 asks for "the file (and line) you actually opened" but not which repo. Fix: "Cite repo paths relative to the repo root you were given, and say which repo once at the top." `scan_source` could also return its root directory, for the answer to repeat.
4. **check_answer's jargon detection (tool).** It accepts a bracket explanation only when the bracket follows the term at once, so `"atomic network" (the smallest …)` is flagged. Meanwhile it has no list of domain abbreviations like "IAS" and "OCR". Fixes: allow a closing quote between the term and the bracket, and flag any all-caps token of 2–5 letters that is not explained on first use and is not in an allow-list (SQL, CI, API, URL).
5. **scan_source findings not carried into the answer (assistant; prompt partly).** The `competitive_strategy` prompt could require one line per `scan_source` contradiction that changes the advice, as round 3's answer did by hand.

## Compared with round 3

Every round-3 error below is judged against what the founder received. An error that disappeared only because DBTool is no longer discussed is marked **Not fixed (absent, not corrected)**. Nothing in the answer shows it was corrected.

| Round-3 error | Status | Evidence |
|---|---|---|
| 1. Retired stdio package presented as shipped | **Not fixed (absent, not corrected)** | No DBTool capability is listed. The "Shipped" list is GameX Companion's: "stat-aware search, watches with Discord DM alerts …, the IAS and imbue calculators". |
| 2. Two wrong line references in pricing.astro | **Not fixed (absent, not corrected); worse in kind** | pricing.astro is not cited. Instead, all 21 references point at files that are not in the case's repo, or say something else there (Error 2). |
| 3. Self-hosting listed as shipped | **Not fixed (absent, not corrected)** | Self-hosting is not mentioned. The log shows guides/self-hosting.md was read only to "lines 1–20". |
| 4. CI gate listed as plainly shipped | **Not fixed (absent, not corrected)** | Not mentioned. |
| 5. pganalyze self-hosting fact wrong and unhedged | **Not fixed (absent, not corrected)** | pganalyze is not mentioned in the answer. |
| 6. "Agents don't have the planner" overclaim; PG18 risk missing | **Still present (PG18 risk unaddressed)** | Neither agents nor PG18 statistics import appear. |
| 7. "Neutral across agents" protection without limits | **Not fixed (absent, not corrected)** | Not mentioned. The platform-dependency findings round 2 had are still missing. |
| 8. Agent-integration gap (hook docs name unregistered tools) | **Still present** | Not mentioned. The log says using-with-llms.md was read only to "lines 1–60", which stops before lines 65–66, where the gap is. |
| 9. Copy cost not quantified | **Still present** | No incumbent economics at all. |
| 10. Benchmark judged by DBTool's own estimate | **Still present** | No benchmark move. |
| 11. Risk questions partly answered | **Still present, now fully unanswered** | No "are we at risk of being a feature" answer, which is half of the question asked. |
| 12. `marketing_diagnosis` not consulted | **Still present (minor)** | Not in the log's 13 calls. |
| Item 3: two conditional constraints; moves didn't follow the diagnosis | **Not fixed for this case** | The answer names one constraint and the moves follow from it ("supply … Your first 'customers' are two or three moderators"), but for GameX Companion. |
| Item 7: circular stop condition, vague thresholds, Move 3 bundled | **Fixed in form, not for this case** | Moves are single actions with stop conditions that are not circular. Thresholds are still partly vague: "most watches get zero matches", "no server says yes". Move 3 has no explicit time box. |
| Item 10: 1,519 words; "counter-positioning", "switch interviews", "win/loss" undefined | **Partly fixed** | 1,183 words, under the limit. Those terms are gone. New undefined terms: "IAS", "OCR", "imbue", "Forum Gold". |

**New regressions**

1. **The answer is for the wrong business** (Error 1). This is a total regression from round 3's 16/20 DBTool answer.
2. **The tool log and the answer disagree** (Errors 3–4). The log's `check_answer` results cannot have come from this text, and the answer's sources are not logged.
3. **Round 3's verified site-vs-docs findings are lost.** These were the $20 vs $16 price, MCP and rewrites labelled "(soon)", "Parameter values aren't included" versus pg_stat_statements literals, "not a simulator" versus "simulated planner choices", and the "OSI-approved" claim without a license. According to the log, `scan_source` found several of them again, but they never reach the founder.

**Specific checks requested**

- (a) **Repo claims.** 21 claims, 21 misattributed for this case (in /home/user/site those paths say other text or don't exist), and 0 misquotes. Checked against /home/user/gamex-companion, all 21 are accurate:
  - ADR 0004:51–52 "only because no real users exist yet". ADR 0006:81 repeats it. ADR 0006:15 "a production table of 141 items", decided 2026-08-04 (line 7).
  - bot.ts:70–77 is the DM drain.
  - discord-public-log.ts:99 `author: { name: "New item posted" }`, with the watcher field at 89–95.
  - `_admin-only.tsx` 4–8 and `__root.tsx` 105–110 for admin-only Planner/Create/Stash.
  - VISION.md:128–131 is item lifecycle. VISION.md:64–65 is "anonymous until contacted".
  - bot README 129–131 says catching up forward "is not built". README:15 says "at 100+ it needs Discord's approval". README:26 says "What it read and what happened is in its reply".
  - `__root.tsx`:100 is `VITE_CALC_ONLY`, with the IAS-only header at 124–133. index.tsx:6 has the matching redirect.
  - items.$id.tsx:297 "Owned by", with the avatar at 258–261. items.ts:254 "(public), with its owner".
  - CONTEXT.md:237–238 "kept as OCR training data".
  - .env.example:20 "Training-capture storage". .env.example:11 "#selling ingest".
  - ADR 0005:52 "the bot reply states how many items were found".
  - `__root.tsx`:29–30 is Umami.
  - plannersite-planner.md:3 "observed on 2026-09-21 … (Season 14)".
- (b) **Evidence labels.** They match community-and-hobby-products, which this run never loaded: "[practitioner]" for moderators and atomic networks (lines 29–30), "[first-party]" for the Discord policy (line 34, read via snippets per line 102), "[first-party, read via snippets]" for Blizzard (line 59), "[practitioner]" for timing launches to patches (line 69). None of the four playbooks this run did load is used, so the labels from the competition playbooks (synthesis, snippet-only research, practitioner frameworks) that round 3 got right cannot be checked.
- (c) **Length.** 1,183 words by `wc -w` (my `check_answer`: 1,199), against 1,200: under. Round 3: 1,519.
- (d) **One action per move, and a falsifier.** Yes for GameX Companion: each move is one action, and "What would prove me wrong" names a test. For the DBTool question there are no moves and no falsifier.
- (e) **scan_source and check_answer.**
  - **scan_source** was called on apps/blog and apps/docs, as rule 0 requires, and the log's summaries are consistent with my reproduction. Its output was not used: no scan finding appears in the answer.
  - **check_answer** was called twice. Neither call can have been on the delivered text: the logged "'HN' unexplained" has no "HN" in this text, and the logged "1,189 words, no problems" differs from my 1,199 words with "atomic network" flagged. Rule 9 ("on the exact text you will send") was not met.
  - The tool's own weaknesses: a false positive on "atomic network" and misses on "IAS" and "OCR" (Error 6).

The score falls from 16 to 3. The process the log describes partly improved (`scan_source` called as required, `check_answer` run twice, stricter move structure), but the founder received an answer to a different business's question, and the log's `check_answer` results do not belong to that answer.
