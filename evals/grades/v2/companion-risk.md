# Grade: companion-risk (round 2)

Case: "Is GameX Companion worth building seriously? What are the big risks, and could it ever make money?"
Run: `evals/runs/v2/companion-risk.md`. The grader read the GameX Companion VISION.md, CONTEXT.md, ADR 0005, ADR 0007, the ADR status lines, apps/bot/README.md, apps/bot/src/config.ts, apps/api/src/routes/auth.ts, apps/api/src/db/schema.ts, the app route list and research/plannersite-planner.md. It also read `knowledge/community-and-hobby-products.md` and the `opportunity_assessment` prompt. It re-ran `market_size` with the advisor's inputs. The run gives only some of those inputs, so the grader inferred `serviceableShare` 0.5 for both base-case segments and 0.7 for both optimistic segments. With those values the numbers reproduce exactly:
- base case: SAM $36,000, 765 serviceable accounts (750 traders + 15 servers), 1,275 customers needed for $60k ("1.3k");
- optimistic case: SAM $462,000, 7,105 accounts, 1,537,900 customers needed for $100M.

Answer length: **1,238 words** (the "## Answer" section only). The instruction says "under about 1,200 words", so the answer is slightly over. That is within "about", but it is not under.

## Scores

| # | Item | Score | Evidence |
|---|---|---|---|
| 1 | Context first | 2 | Checked `list_business_profiles` (returned `[]`). Read VISION, CONTEXT, README, four ADRs, the bot README and config, the route list and the PlannerSite research, and saw "git log (one squashed commit)". It sorts capabilities into Shipped/Partial/Planned/Unknown as the server instructions ask: "the character planner, stash and creating items on the website are admin-only routes. VISION.md calls the site 'a real entry point', but today it isn't one for users." That matches `_admin-only.planner.tsx`, `_admin-only.stash.tsx` and `_admin-only.create.tsx`. Ends with "I can save these facts as a business profile once you confirm them." Slips: the "OCR training data" quote is credited to ADR 0005, but it comes from CONTEXT.md and the schema comment (error 1). "Identity" is listed as open, but the code already has Discord OAuth login and sessions (error 2). The repo contradicts the playbook on Discord's intent rule, and the answer misses it (error 3). |
| 2 | Asked for numbers / explicit assumptions | 2 | "I couldn't ask you questions, so I've used labelled assumptions. My main one: **(A1) your goal is a hobby…** If you want a salary from this, the verdict below gets harsher, not softer." The market inputs are flagged: "on **unsourced assumptions** (replace them with real member counts from the servers you target)". There are four concrete questions, for example "Current numbers: listings/week, active watchers, DMs sent and clicked, hosting cost, your hours/week." Weakness: only A1 has a label. The 3%/20% paying shares are pure guesses, and the answer does not say where a better figure could come from. |
| 3 | Diagnosis before tactics | 2 | It names the missing fact as the constraint: "**Unknown:** usage … That's the most important missing fact." It ranks gatekeepers first, with the repo's own architecture as evidence (the bot reads configured channels in other people's servers), and value second: "Do traders actually act on watch DMs fast enough to win the item? … No data either way yet." Lifecycle is tied to retention with evidence: "watches that fire on sold items train people to ignore your DMs". ADR 0005 confirms that "there is no lifecycle column on `items`". |
| 4 | Right playbook / noticed what's unusual | 2 | It loaded `community-and-hobby-products` and opened with the goal question, as that playbook and prompt step 0 require. It noticed that there is no revenue model, that Discord is the platform, that admins are gatekeepers, the Blizzard rules and the RMT risk, and the PlannerSite dependency: "your `packages/tools` drives PlannerSite's site headlessly; check their terms". The tool log says the base rates were "not applied, since it's a hobby". |
| 5 | Tools for numbers | 2 | The headline money figures come from `market_size` with `payingShare`, and it quotes the warning text: "The tool warns that a $60k/yr target 'needs 1.3k customers but only 765 accounts are serviceable.'" It found no hand-calculated headline figure. Remaining gaps, listed under Errors: the answer never reports the obtainable market or says why it is missing (that appears only in the tool log). The optimistic case leaves out its 70% serviceable share and the server price and paying share, so a reader cannot reproduce it. No test threshold was checked for sample size. |
| 6 | Specific to this business | 2 | It names `watches.tsx` and `notification-drain.ts` (both exist). It quotes ADR 0007: "an admin review queue that grows 'every time the resolver improves'" (line 54). It names the admin-only routes, "channel-history backfill" (bot README §"Reading channel history"), the 40ias-style speed point ("a late, correct DM loses"), GameX ladder seasons and the PlannerSite Playwright tooling. None of this would fit a random startup. |
| 7 | Focused and ranked | 1 | Three ordered moves, and a single next test is named ("move 1: one server, admins on board, six weeks of real watch data"). It says what not to do: "*Not yet:* ads, paid watches, a company, other games." But the server instructions require a stop condition for every move, and only move 1 has one. Move 2's is "If it's much lower, watches miss items and the premise fails", with no number for "much lower" and no action. Move 3 has a pass bar and no stop condition. Move 1 leaves 10–29 watchers undecided (pass is "≥30", stop is "under 10"). Its metric, "DMs clicked within the hour", does not test the risk it names, "fast enough to win the item" (error 8). |
| 8 | Evidence honesty | 1 | The labelling is mostly good: "from my own knowledge, unverified"; "(playbook; MEE6 is the anecdote, not proof)"; "(with Discord's policy text, not my reading)"; "(not legal advice)". Problems: (a) "Discord's message-content intent needs approval past 10,000 users, and approval must be renewed every year" is stated flatly. The playbook dates it ("under the 2025–2026 change … The old rule was 'apply at 100 servers'"), and the founder's own bot README says "at 100+ it needs Discord's approval". The answer flags neither the date nor the conflict. (b) "Another team could rebuild it in months" is an unhedged guess that contradicts the founder. No evidence is given, and the repo has 15 packages, including item-gen, item-recognition and ocr-parser. (c) A misattributed source (ADR 0005). (d) The optimistic case's inputs are hidden. |
| 9 | Respects vision | 2 | It keeps the non-goals: "Your 'not a marketplace, no pricing' non-goal already protects you"; "Keep watches and search free". It disagrees openly and gives a reason: "VISION.md says the rules model is the defensibility. I disagree in part: GameX's rules are a closed, public, datamined set." The round-1 conflicts (price-check commands, a web pivot) are gone. One tension is not named. "Do a rough 'sold/expired' rule first, even a simple age cut-off" runs against VISION's "Lifecycle is a first-class concept, not an afterthought" and the Correctness value ("We'd rather model fewer items faithfully than many loosely"). VISION asks that such trade-offs be named (error 9). |
| 10 | Plain language | 1 | The banned word is absent, no hype, short sentences, and "ISO" and "RMT" are explained. But the hobby founder gets several unexplained terms: "SAM" (twice), "The $100M ARR test", "Absorption/access", "core loop" and "datamined". The server instructions say to "explain any other jargon in plain words". The answer also exceeds the length limit slightly (1,238 words against "under about 1,200"). This is stricter than round 1, which scored similar slips ("leap-of-faith", "base rates") at 2. |

**Total: 17/20**

## Errors

1. **Misattributed source (factual).** The answer says "ADR 0005 keeps every capture 'as OCR training data'". ADR 0005 does not contain that phrase. It comes from CONTEXT.md line 238 ("kept as OCR training data whether or not it produced an item") and the `ocr_captures` comment in `apps/api/src/db/schema.ts` ("Training-data capture"). The substance is right and the source is wrong.
2. **Identity called open, but the code has already chosen.** "Planned/open: item lifecycle … and identity." VISION lists identity as an open question. But `apps/api/src/routes/auth.ts` already implements Discord OAuth sign-in with sessions, and admin rights are keyed on Discord ID (`isAdminDiscordId`). So the code is Discord-first today. Lifecycle really is open: ADR 0005 says "there is no lifecycle column on `items`".
3. **Contradiction with the founder's docs not flagged.** The answer gives the playbook's "10,000 users … renewed every year" rule. `apps/bot/README.md` says Message Content Intent works "immediately under 100 servers; at 100+ it needs Discord's approval". The playbook itself calls 100 servers "the old rule", and it says that verification at 100 servers is still "commonly described as required". Server instruction 0 says contradictions between the docs are findings. The answer should have said that the README is probably out of date, and that verification at 100 servers may still apply.
4. **Unsupported claim.** "Another team could rebuild it in months." No evidence is given, and it is not hedged. A closed rule set is not the same as a cheap one to rebuild: the repo's OCR, tooltip segmentation, the reparse machinery (ADRs 0001–0007) and 15 packages suggest otherwise. The point that installs in servers are harder to copy may still be right, but this sentence overstates it.
5. **Tool results under-reported.**
   - The optimistic bullet gives "200,000 traders, 5% paying $48; 500 servers". It leaves out the 70% serviceable share (inferred by reproduction) and the $1,200 price at a 30% paying share (in the tool log only).
   - The base-case bullet leaves out the 50% serviceable share on servers ("150 trade servers, 20% would pay $600/yr" reproduces only at 0.5 × 0.2 = 15 servers).
   - Prompt step 3 asks for the "capacity-bounded obtainable market". The answer neither reports one nor says that none was computed. Only the tool log says "no obtainable market was computed (no paid acquisition is planned)".
6. **Prompt steps skipped.**
   - Step 1 (base rates matched to the goal) is left out. The hobby playbook gives thin side-project base rates that support the verdict and should have been stated: Folta et al. on hybrid entrepreneurs, and Tidelift, where "about a quarter receive any income from donation programs". The founder's own odds are asked for in the closing questions but never compared with anything.
   - Step 2 (the smallest group that urgently wants this) is not answered. "one or two active trade servers" is a place, not a group with a problem. An obvious candidate: traders hunting specific high-value rolls (VISION's "40ias cruel" claw).
   - Step 4 (why now: a dated change) is not answered. "Run it around the next ladder season start" is timing for a test, not a reason the product is possible now.
7. **Monetization details simplified.** "Discord keeps 15% of your first $1M" leaves out the playbook's "less processing fees". The answer also leaves out the eligibility rules: "Apps must be verified, owned by a developer team and based in a supported country". These matter for a solo founder deciding whether a per-server tier is realistic.
8. **Test design problems.**
   - Moves 2 and 3 have no proper stop condition ("much lower" is not a threshold).
   - Move 1 has no decision rule for 10–29 watchers.
   - "≥25% of DMs clicked within the hour" is a rate on an unknown and probably small number of DMs, and its sample size was not checked.
   - The metric does not measure what risk 3 asks ("fast enough to win the item"). Given VISION's "the first to reach the owner … gets it", the right measure is the time from post to DM to click, and ideally whether the trade happened.
   - Move 3's "≥2 owners say yes" out of 5 asked is stated intent, not willingness to pay.
9. **Unnamed tension with the vision.** "even a simple age cut-off" for lifecycle is reasonable advice, but VISION says lifecycle is "first-class … not an afterthought" and puts Correctness first. The answer should have said "this trades Correctness for speed of learning; I recommend it because…".
10. **Minor.** "If you're reading channels without the admins' clear agreement, fix that first." A bot account can only be in a server if someone with Manage Server permission invited it, and `config.ts` reads only the configured channel IDs. The real question is whether the admins of the large trade servers know and agree, and the answer's question 2 asks exactly that.
11. **Facts the grader checked (from own knowledge; plausible, not re-verified):**
    - TradeSite, fansite.example and d2jsp are real alternatives.
    - Blizzard prohibits RMT.
    - MEE6's 2022 backlash is quoted as the playbook frames it.
    - GameX ladder seasons do drive trading peaks (practitioner claim, labelled as coming from the playbook only by implication).

## Top strengths

1. **The verdict is matched to the goal and stated plainly:** "worth building as a serious hobby. Not worth building as a business on current evidence." The answer also says how it changes: "If you want a salary from this, the verdict below gets harsher, not softer."
2. **It finds the risks in the founder's own repo:** the training-data policy risk ("Discord's Developer Policy bans training AI models on message content without Discord's permission"), the missing removal path, the growth of the ADR 0007 review queue, and the PlannerSite Playwright dependency. Each is real and checkable in the code.
3. **The money section uses the tool honestly.** It sets a paying share, quotes the tool's warning, and runs the $100M test so it can say "Not venture-scale", without a single hand-calculated headline figure.

## Server attribution (ranked, most impactful first)

1. **`opportunity_assessment` in `src/prompts.ts` still has no completeness check. (Server caused in part; assistant skipped the steps.)**
   - **What went wrong:** Steps 1, 2 and 4 were skipped again (error 6). The round-1 fix was not applied. The prompt still ends at "Don't soften it." with no "answer every step" line.
   - **Fix:** End the prompt with "Answer every numbered step under its number, or write 'n/a because…'. Step 2 and step 4 may not be left out." Step 1 should also say: "For a hobby, quote the hobby playbook's side-project base rates."
2. **Prompt step 7 and instruction rule 6 do not require sample-size checks. (Server caused.)**
   - **What went wrong:** The thresholds ("≥25% of DMs", "≥2 owners") were not checked against the expected n (error 8). The round-1 fix ("state n; use the stats tools if comparing rates") was not added to step 7.
   - **Fix:** Add that line to step 7. Add to rule 6: "the stop condition must be a number and an action, and pass and stop together must cover every outcome."
3. **`market_size` (`src/lib/marketSize.ts`, `src/server.ts`) still has no organic capacity, and its source hints are still B2B. (Server caused.)**
   - **What went wrong:** `payingShare` was added and it worked; the hand arithmetic is gone. But there is still no way to bound the obtainable market by organic reach, so step 3's "capacity-bounded obtainable market" cannot be computed for a community tool (error 5). The warning still recommends "a census count, a Sales Navigator / technographic query, or public filings" for Discord traders.
   - **Fix:**
     - Add `organicReach: {newUsersPerYear, conversion}` as a capacity input.
     - Make the source hint context-neutral (community member counts, Discord server sizes, SteamDB).
     - Add to instruction 3: "When the tool cannot compute a figure the prompt asks for, say so in the answer, not only in your notes, and list every input you used."
4. **`knowledge/community-and-hobby-products.md` has an unresolved Discord rule change. (Server caused in part; assistant missed the contradiction.)**
   - **What went wrong:** The playbook gives the 10,000-user rule and the old 100-server rule, and verification at 100 servers is "not re-verified". The founder's README says 100 servers. The answer gave only the new rule, without a date (error 3).
   - **Fix (playbook):** Give the date and source of the 2025–2026 change, and say how intent approval and verification interact.
   - **Fix (instructions, rule 0):** Add "If a playbook fact contradicts the business's own docs, quote both and say which you believe and why."
5. **Jargon and length. (Assistant ignored instruction 9; the server can make it less likely.)**
   - **What went wrong:** The prompt and the tool output use "SAM", "$100M ARR test" and "obtainable market", and the platform playbook uses "absorption/access". The assistant copied these terms through unexplained.
   - **Fix:** Have `market_size` return a one-line plain description of each figure ("SAM = yearly revenue if every reachable, willing payer paid"). In the prompt, write "the $100M ARR (yearly recurring revenue) test". Add to instruction 9: "check the word count before finishing."
6. **Citations not tied to files. (Assistant error.)**
   - **What went wrong:** A quote was credited to the wrong ADR (error 1).
   - **Fix:** Add to instruction 0: "When you quote the business's docs, name the file you quoted; if you are unsure, say 'the docs'."
7. **The vision check misses tensions with stated values, not just non-goals. (Assistant missed it; instruction 7 covers it only in part.)**
   - **What went wrong:** The non-goals were checked well this time. The Correctness value and the "first-class lifecycle" line were not (error 9).
   - **Fix:** Extend instruction 7: "check against values as well as non-goals; when a recommendation trades one value for another, name the trade-off in one sentence."

## Compared with round 1

| Round-1 error | Status | Evidence |
|---|---|---|
| 1. Playbook RCT finding misquoted | **Fixed** (the claim was removed, not corrected) | The answer no longer cites the RCT. The startup-risk playbook was used "for structure" only. |
| 2. Wrong base rates (BLS survival, VC returns) applied to a hobby bot | **Partly fixed** | The wrong reference class is gone: "base rates (not applied, since it's a hobby)". But no base rate at all replaces it. The hobby playbook's side-project evidence was loaded and not stated, and the founder's odds are asked for ("Your own odds it's still running in 2 years?") but never compared with anything. |
| 3. "price-check commands" conflict with the "no pricing" non-goal | **Fixed** | "Your 'not a marketplace, no pricing' non-goal already protects you". The suggested paid product is a per-server Premium App tier, which does not conflict. |
| 4. Headline money number from hand arithmetic | **Fixed** | "SAM $36,000/yr, 765 paying accounts" comes from `market_size` with `payingShare`, and it reproduces exactly. |
| 5. Tool misuse (double-counted segments, ignored churn/horizon, no capacity bound) | **Partly fixed** | The double count is gone (traders and server owners are different buyers). Churn and horizon are no longer passed for no effect. There is still no capacity-bounded obtainable market, and the answer does not mention that (only the tool log does). |
| 6. Thresholds too small or inconsistent; deadline mismatch | **Partly fixed** | The deadlines now agree ("held for 6 weeks" / "after 6 weeks"). But "≥25% of DMs clicked" has an unknown n. The gap between "≥30" (pass) and "under 10" (stop) has no rule. "≥2 owners say yes" out of 5 is too small to mean anything. |
| 7. Unsupported "years of careful work" | **Fixed, with a new claim of the same kind** | The phrase is gone. The new "Another team could rebuild it in months" is just as unsupported. |
| 8. Prompt steps 2 (smallest urgent group) and 4 (why now) skipped | **Still present** | Neither appears. Step 1 (base rates) is now skipped as well. |
| 9a. Discord Premium Apps not mentioned | **Fixed** | "perhaps a per-server Discord Premium App for trade-server owners (Discord keeps 15% of your first $1M)". The eligibility rules are left out (error 7). |
| 9b. PlannerSite Playwright dependency not raised | **Fixed** | "your `packages/tools` drives PlannerSite's site headlessly; check their terms, since they're the likeliest bigger player". |
| Round-1 item 9: web-tool pivot contradicting "never require a trader to leave Discord" | **Fixed** | No pivot is suggested. |
| Round-1 item 10: jargon slips ("leap-of-faith", "base rates") | **Changed** | Those terms are gone, but SAM, ARR, "absorption/access", "core loop" and "datamined" are new and unexplained. |

**New regressions or new errors in round 2:**
- The training-data quote is credited to the wrong file, ADR 0005 instead of CONTEXT.md (error 1).
- Identity is called open although Discord OAuth is implemented (error 2).
- The intent rule contradicts the founder's README, and the conflict is not flagged (error 3).
- "rebuild it in months" is unsupported (error 4).
- The optimistic-case inputs are hidden, and the obtainable market is not mentioned in the answer (error 5).
- Moves 2 and 3 have no numeric stop condition. Round 1 had a kill rule for each test, so item 7 drops from 2 to 1.
- The click metric does not measure the speed risk it is meant to test (error 8).
- The age cut-off's tension with the Correctness value is not named (error 9).

**Length:** 1,238 words against "under about 1,200". Round 1 was much longer (7 risks, 5 ways to charge and 6 pre-mortem items, plus three dated tests). Round 2 is much tighter and only just over the limit.

**Net:** The total is the same, 17/20, but the profile has changed. Round 1 lost points on tools (5), evidence (8) and vision (9). Round 2 fixes all three of those weaknesses in substance, and loses points on focus (7), evidence (8, for different reasons) and plain language (10, scored more strictly than in round 1). Without that stricter item-10 scoring, round 2 would be 18/20.
