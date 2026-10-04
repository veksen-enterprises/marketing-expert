# Grade: companion-risk (round 3)

Case: "Is GameX Companion worth building seriously? What are the big risks, and could it ever make money?"
Run: `evals/runs/v3/companion-risk.md`.

**What the grader read and checked.**
- GameX Companion files: VISION.md (values, components, non-goals, open questions), CONTEXT.md, the ADR 0006 header and line 15, `apps/bot/README.md`, `apps/bot/src/bot.ts`, `apps/app/src/lib/sitemap.ts`, `apps/app/src/routes/items.$id.tsx`, `apps/api/src/routes/items.ts`, `apps/api/src/routes/user-items.ts`, `apps/api/src/db/schema.ts` (no lifecycle column), the app route list, `packages/tools/src` and `research/plannersite-planner.md`.
- Server files: `knowledge/community-and-hobby-products.md`, the `opportunity_assessment` prompt in `src/prompts.ts`, and the server instructions.
- Tool runs: `market_size` re-run with the three input sets in the tool log. All three reproduce exactly:
  - base case: SAM $18,600, 510 serviceable accounts, 2.74M customers needed for $100M;
  - $1,200 target: 32.9 customers needed, `penetrationOfSam` 0.0645;
  - optimistic: SAM $367,200, 6,060 accounts, warning "needs 1.7M customers but only 6.1k accounts are serviceable".

**Answer length: 1,445 words** (`wc -w` on the "## Answer" section only). The limit is "under about 1,200 words", so the answer is 245 words (20%) over. Round 2 was 1,238.

**File-claim check (a).** The answer makes 19 claims about what a specific repo file says or contains. The grader opened each one.
- **17 are accurate**, including the line numbers:
  - ADR 0006:15, which is "a production table of 141 items"; ADR 0006:7 dates it 2026-08-04;
  - VISION.md:64-65, 120 and 128-131;
  - CONTEXT.md:236-239 (the quoted text is on lines 237-238);
  - bot README:14-15, 44 and 129-131;
  - bot.ts:73-75;
  - sitemap.ts:19;
  - items.$id.tsx:291-300 (the avatar comes from `cdn.discordapp.com`, line 261);
  - plannersite-planner.md:3 and the "for the team building this repo's own planner" quote (line 7);
  - the route files;
  - the two hedged "I searched … and found no …" statements.
- **1 is a misquote:** items.ts:254 is quoted as "public, with its owner". The file says "Fetch a single persisted item by id (public), with its owner, …". The meaning holds, but the quote marks enclose text that is not in the file.
- **1 is a misreading of the vision (error 3):** the planner work is said to pull "toward your own non-goal".
- **No misattributions.** Round 2 had one (error 1).

The VISION:64-65 claim is quoted correctly, but the answer reads more into it than the docs support (error 2).

## Scores

| # | Item | Score | Evidence |
|---|---|---|---|
| 1 | Context first | 2 | It checked `list_business_profiles` ("returned `[]`") and read VISION, CONTEXT, the ADRs, both READMEs and the code. It sorts capabilities into the instruction's buckets: "Shipped: … Watches with DM delivery (apps/app/src/routes/watches.tsx; apps/bot/src/bot.ts:73-75)", "Partial: the character dashboard. The planner, stash and create routes are admin-only", "Not built: Item lifecycle … (VISION.md:128-131, still an open question)". It reports contradictions between the docs and the code as findings, as instruction 0 asks: "VISION.md:64-65 says the owner 'is anonymous until contacted.' But public item pages … show 'Owned by {displayName}'". Searches are worded the way the instruction requires: "I searched apps/ for opt-out, privacy and removal and found no opt-out or privacy page." It ends with "If you confirm these facts, I can save them as a business profile". Slips: the misquote at items.ts:254, and the one-sided reading of "anonymous" (error 2). |
| 2 | Asked for numbers / explicit assumptions | 2 | "**Assumptions (labelled, since I couldn't ask you):**" A1–A3 each give the basis: "A2. Market counts are my guesses, not data … Replace these with real member counts." The hosting cost is flagged: "about $100/month of hosting (an assumed cost)". Five concrete open questions ask for servers, items per day, watchers, costs and hours. Weakness, carried over from round 2: it never says where real counts could come from (prompt step 3 asks "say where to get them"). A2 calls the 50,000 traders "reachable", but the tool run then halves them with a serviceable share of 0.5. |
| 3 | Diagnosis before tactics | 2 | It names the constraint and backs it with repo evidence: "The biggest risk isn't the OCR or the rules model. It's whether enough items flow through the bot for a watch to actually fire, and that depends on trade-server moderators you don't control." The evidence: "The bot reads only the channels configured in `DISCORD_LISTEN_CHANNEL_ID` (apps/bot/README.md:44)". Missing usage data is labelled (A3: "Usage is small today"), and it is the second open question. |
| 4 | Right playbook / noticed what's unusual | 2 | It used the hobby playbook and started from the goal (A1). Base rates now match the business type: "Don't use startup failure rates here." It noticed the things that make this business unusual: no revenue model (from a repo-wide grep), moderators as gatekeepers, Discord intents, the Blizzard RMT ban and API terms ("whether those terms apply to you is my inference; check it"), dependence on one game and one platform, and ladder timing. Regression: the PlannerSite dependency and competitor point from round 2 is gone. `packages/tools/src/planner.ts` still drives PlannerSite, and PlannerSite is missing from the competitor list (error 9). |
| 5 | Tools for numbers | 2 | Every money figure comes from `market_size` and reproduces exactly: "SAM … of $18,600 a year", "about 33 paying supporters, or 6.5% of that SAM", and the quoted warning "needs 1.7M customers but only 6.1k accounts are serviceable". The obtainable market is now handled in the answer itself: "The tool computed no realistic 'obtainable' share because I gave it no budget or sales capacity, so I'm not quoting one." Gaps, as in round 2: some inputs are hidden (error 5). Churn and horizon were passed on call 13 with no effect. The thresholds (30% of watches, 10 supporters) were not checked against any expected n. |
| 6 | Specific to this business | 2 | It names the sitemap exposure of owner names (sitemap.ts:19 plus items.$id.tsx), and the training-data line in CONTEXT.md set against Discord's AI-training rule. It notes that the missing offline catch-up "works against your 'Speed' value", and VISION's Speed value names "ingestion" and "time from post → DM", so that is correct. It also uses Season 14 timing and the moderator-approval route. None of this would fit a random startup. |
| 7 | Focused and ranked | 1 | There are three ordered moves, a "What not to do yet" list, and a new "What would prove me wrong" line. But instruction 6 asks for "one action, not a bundle" and for every move to have "the cheapest test, the metric, a time box, and the stop condition". Move 2 is a bundle: "either hide owner names … or change the vision. Then publish a one-page … note with a working removal path". It has no time box, and its stop condition, "if moderators still refuse after seeing it", has no number. Move 3's stop condition ("fewer than 10 supporters") does not match the answer's own cost bar of "about 33 paying supporters". The "prove me wrong" line is vague: "well above the thresholds above" refers to a retention threshold that was never set (error 6). |
| 8 | Evidence honesty | 1 | The labels improved. The playbook's labels are copied faithfully for Folta ("research"), Tidelift ("vendor data"), Blizzard and Discord ("playbook, first-party, read via snippets") and competitors ("unverified, from my own knowledge"). The answer quotes the playbook's own gap: "No reliable dataset was found…". The intent conflict is now flagged: "These sources disagree, so check Discord's current page." Problems: (a) The Folta caveat is dropped. The playbook says the finding "says nothing about projects that never aim to earn", yet the answer offers it under "Base rates that fit this project", where the project is assumed to be a hobby. Instruction 5 says "Copy the playbook's label and caveats as written". (b) The playbook's "[not re-verified]" point that verification is "commonly described as required at 100 servers" is left out, and it may reconcile the README's "100+" (error 7). (c) There is one misquote (items.ts:254). (d) The vision "contradiction" is presented as fact without the other reading (error 2). (e) "That is achievable", about 33 supporters, rests on guessed inputs. (f) The optimistic case's inputs are hidden. |
| 9 | Respects vision | 2 | It keeps the non-goals: "No paywall on search or watches", "No real-money price fields", and "keep the core loop free … Anything more conflicts with … your own non-goals". It offers the founder the choice instead of overriding the vision: "either hide owner names on public pages until contact, as your vision says, or change the vision." The round-2 age cut-off tension is gone. Error: "No more planner work" pauses one of VISION's three components (§2 "Character dashboard + calculators"), and the answer justifies it as a pull "toward your own non-goal", which misreads that non-goal (error 3). It scores 2, as round 2 did with one unnamed tension. |
| 10 | Plain language | 1 | The banned word is absent and there is no hype. "SAM (the revenue you could realistically serve)" and "Item lifecycle, meaning sold or expired items" are now explained, and RMT is not used undefined. But "core loop", "venture scale", "the overlay model" and "Liquidity (high)" (explained only by the sentence after it) go unexplained. The answer is **1,445 words**, 20% over "under about 1,200". Instruction 9's cut list says to cut "inventories and status tables" and secondary findings, yet the answer keeps a capability inventory, a six-item risk list, a four-item pre-mortem and a six-item not-yet list. |

**Total: 17/20**

## Errors

1. **Misquote (minor).** "The API calls this endpoint 'public, with its owner' (apps/api/src/routes/items.ts:254)." Line 254 reads "Fetch a single persisted item by id (public), with its owner, when it was posted to trade, and how many users watch it". The substance is right, but the quoted text is not in the file.
2. **The "contradiction" is overstated.** Trust problem 1 is rated "high". It treats VISION:64-65 ("anonymous until contacted") as a clear rule that the item page breaks. But VISION:133 uses the same word for account status: "an owner is anonymous until DMed. Is identity Discord-first…". That supports a reading where "anonymous" means "has no gamex-companion account", not "name hidden". The trade post itself is public in Discord under the same name, and the item page links to it (`postedUrl`). The sitemap exposure is a real finding. Calling it a breach of the vision needs "one reading of VISION is…", and the "high" rating is not supported.
3. **The vision is misread for the planner.** "research/plannersite-planner.md is written 'for the team building this repo's own planner.' That pulls toward your own non-goal: 'Not a standalone planner/mod tool' (VISION.md:120)." The non-goal is a *standalone* planner. The item-driven dashboard is VISION component 2 ("Build a dashboard from items you own…"), and `_admin-only.planner.tsx` is that dashboard. "No more planner work" may be sound scope advice for one person. But it pauses a stated component and does not say so; instead it claims the vision's backing.
4. **Prompt steps still partly skipped.** `src/prompts.ts` still has no completeness line.
   - Step 1: base rates are now given. But the founder's own probability is only asked for (open question 1) and never compared with anything, while the prompt says "Ask … and compare."
   - Step 2: "your real first customers are the moderators" names a gatekeeper, not "the smallest concentrated group with the problem". VISION's "40ias cruel" hunters are the obvious candidate.
   - Step 4: "Timing. … the next ladder reset is your launch moment" is launch timing. It is not "the specific, dated change that makes this possible now", and the answer does not say "none".
   - Step 3's "say where to get them" is missing.
   - Step 5 asks to load "competing-with-incumbents". The tool log shows it was not loaded.
5. **Tool inputs are under-reported.**
   - The base case leaves out the 0.5 serviceable share on both segments. A2 calls the 50,000 traders "reachable", and the tool then counts only half of them as serviceable.
   - The optimistic case is reported as "200k traders, 5% paying, $5/month". It leaves out the 0.6 serviceable share and the whole server segment (500 servers at $120/yr, 20% paying), so a reader cannot reproduce the $367,200.
   - `horizonYears: 3, annualChurn: 0.5` were passed on call 13 with no effect, because no capacity input was given.
6. **Test design problems.**
   - Move 2 is a bundle of two or three actions, with no time box and no numeric stop condition.
   - Move 1 says "ask the moderators of the largest GameX trade server you can reach", but its stop condition is "no moderator of the top three servers agrees". The two do not match. "New items listed per day" has no threshold, and the "30% of watches fire within 7 days" bar has no n check.
   - Move 3: below 10 supporters means stop, but the answer's own cost bar is about 33, and 10–32 supporters gets no decision. The metric is a share ("supporters as a share of weekly active watchers"), but the stop condition is a count.
   - Move 2's published note is what move 1 says to show moderators ("Show them exactly what it stores"), so the order is muddled.
   - The "What would prove me wrong" line tests the money verdict ("donate well above the thresholds above") more than the diagnosis. It also relies on "retain … well above the thresholds", and no retention threshold exists.
7. **Discord rules are simplified.**
   - The intent conflict is now flagged, but the playbook's line 55 is left out: "Verification is commonly described as required at 100 servers … [not re-verified on primary page]". The founder's README "at 100+" may be describing verification, not intent approval.
   - "Discord requires anything you sell on Discord to be offered through Premium Apps at no higher price" broadens the playbook's "supported offerings".
   - The Premium Apps eligibility rules ("verified, owned by a developer team and based in a supported country") are still missing, although "per-server extras for trade-server owners" is recommended.
8. **A dropped caveat.** Folta et al. is offered as a base rate "that fit[s] this project". The playbook's caveat ("it says nothing about projects that never aim to earn") is not copied, which instruction 5 requires.
9. **A lost finding.** Round 2's "your `packages/tools` drives PlannerSite's site headlessly; check their terms, since they're the likeliest bigger player" is gone. `packages/tools/src/planner.ts` still exists, and PlannerSite is absent from the competitor list.
10. **"Your rules model can be copied in time."** This sits under an "unverified, from my own knowledge" heading, so it is labelled, which is better than round 2's "rebuild it in months". It still contradicts VISION ("This is the hard part"), gives no reason, and does not say it is a disagreement with the founder.
11. **Length.** 1,445 words against "under about 1,200".
12. **Facts the grader checked (from own knowledge; plausible, not re-verified):**
    - d2jsp, TradeSite and fansite.example are real alternatives.
    - A bot can be removed by a server moderator in a few clicks.
    - The pre-mortem date (April 2028 = October 2026 + 18 months) is correct.

## Top strengths

1. **Its file claims can be checked and hold up.** 17 of 19 are accurate to the line, and searches are worded as searches ("I searched apps/ … and found no …"). This is the main improvement over round 2.
2. **New findings that can be acted on, from the code:**
   - owner names and Discord avatars on public, sitemapped item pages;
   - captures kept "as OCR training data", set against Discord's AI-training rule;
   - no removal path;
   - the missing offline catch-up, tied to the Speed value.
3. **The money section is honest.** It gives tool-only figures, says plainly that no obtainable market was computed, matches base rates to the goal and labels them, and gives a cost-cover framing ("about 33 paying supporters") that suits a hobby goal.

## Server attribution (ranked, most impactful first)

1. **Length rule not enforced. (Assistant ignored instruction 9; the server can make it harder to ignore.)**
   - **What went wrong:** The answer is 1,445 words. The opportunity_assessment prompt asks for 8 sections, and instruction 9 allows "the answer, up to three moves, what not to do yet, open questions". The prompt's shape pushes the answer past the limit.
   - **Fix:** End `opportunity_assessment` with "Fit steps 1–6 into about 600 words, one line per risk; keep the whole answer under 1,200 words, and count before finishing." Allow the pre-mortem to be folded into the risk list.
2. **`opportunity_assessment` in `src/prompts.ts` still has no completeness check. (Server caused in part.)**
   - **What went wrong:** Steps 2 and 4, and the "compare" in step 1, were skipped for the third round (error 4). Round 2's suggested fix was not applied: the prompt still ends at "Don't soften it."
   - **Fix:** Add "Answer every numbered step, or write 'n/a because…'. Step 4 must name a dated change or say 'none'."
3. **Instruction 6 states the move format but nothing checks it. (Assistant error; server can tighten.)**
   - **What went wrong:** Move 2 is a bundle with no time box (error 6), and move 3's threshold contradicts the answer's own cost figure.
   - **Fix:**
     - Add to instruction 6: "Write each move as a fixed five-line block (action, test, metric, time box, stop = number + action); pass and stop must cover every outcome; check thresholds against the numbers you quoted elsewhere."
     - Add to prompt step 7: "State the expected n; use the stats tools when comparing rates."
4. **Playbook caveats get dropped when facts are paraphrased. (Assistant; instruction 5 already covers it.)**
   - **What went wrong:** The Folta caveat and the playbook's verification-at-100 line were left out (errors 7 and 8).
   - **Fix (`knowledge/community-and-hobby-products.md`):** Put the caveat inside the bracketed label so that copying the label copies the caveat: "[research; not about projects that never aim to earn]".
   - **Fix (playbook):** Merge the intent and verification bullets into one dated rule.
5. **`market_size` returns no echo of its inputs. (Server caused in part.)**
   - **What went wrong:** The serviceable shares and a whole segment were hidden in the answer (error 5).
   - **Fix:** Have the tool return a one-line "inputs used" summary per segment (for example "200,000 × 60% serviceable × 5% paying × $60"), and tell the assistant in instruction 3 to quote it with the result. Also warn when `horizonYears`/`annualChurn` are passed without a capacity input.
6. **Readings of the vision. (Assistant.)**
   - **What went wrong:** One reading of "anonymous" was stated as fact (error 2), and the planner non-goal was misread (error 3).
   - **Fix:** Add to instruction 0: "When a doc–code conflict depends on how a word is read, quote the other uses of that word in the docs before calling it a contradiction." Add to instruction 7: "Before citing a non-goal, quote it in full; if a recommendation pauses one of the stated components, say so."

## Compared with round 2

| Round-2 error | Status | Evidence |
|---|---|---|
| 1. "OCR training data" misattributed to ADR 0005 | **Fixed** | "CONTEXT.md:236-239 says every capture is 'kept as OCR training data whether or not it produced an item.'" Verified at CONTEXT.md:237-238. |
| 2. Identity called open although Discord OAuth exists | **Fixed** | Identity is no longer listed as open. The prompt evidence says "Discord OAuth", and the tool log records a grep of `auth.ts`. |
| 3. Intent-rule conflict with the README not flagged | **Partly fixed** | "The bot README (lines 14-15) says it needs approval 'at 100+' servers. The playbook says the 2025-26 rule is 10,000 users … These sources disagree, so check Discord's current page." The verification-at-100-servers point, which may reconcile them, is still left out (error 7). |
| 4. "Another team could rebuild it in months" (unsupported) | **Partly fixed** | Softened and labelled: "Competition (unverified, from my own knowledge) … Your rules model can be copied in time." Still no reason given, and the disagreement with VISION is not named (error 10). |
| 5. Tool results under-reported (hidden inputs; obtainable market only in the log) | **Partly fixed** | The obtainable market is fixed: "The tool computed no realistic 'obtainable' share … so I'm not quoting one." The hidden inputs are still present: the optimistic case leaves out the 0.6 serviceable share and the server segment, and the base case leaves out 0.5 (error 5). |
| 6. Prompt steps 1, 2, 4 skipped | **Partly fixed** | Step 1 is fixed: "Base rates that fit this project … Folta et al. 2010, research … Tidelift 2024, vendor data". But the founder's own odds are still not compared. Step 2 is answered with gatekeepers, not the urgent group. Step 4 is still missing; "Timing" gives a launch date, not a reason this is possible now. |
| 7. Premium Apps fee/eligibility simplified | **Still present** | The eligibility rules are still missing. The 15% fee is no longer mentioned at all. "anything you sell on Discord" broadens the playbook's "supported offerings". |
| 8. Test design (no numeric stop on moves 2–3; 10–29 gap; n unchecked; metric doesn't test speed) | **Partly fixed** | Moves 1 and 3 now have numeric stop conditions ("fewer than 30% of watches fire within 7 days"; "fewer than 10 supporters"). The speed-metric mismatch is gone, because the speed risk is no longer tested. Still present: move 2 has no numeric stop and no time box; n is never checked; there is a 10–32 gap against the answer's own 33-supporter cost bar. |
| 9. Age cut-off tension with Correctness not named | **Fixed (removed)** | No lifecycle shortcut is recommended. Lifecycle is only listed as "Not built". |
| 10. "fix that first" on admin consent (minor) | **Fixed** | Replaced by a question: "Have moderators approved the bot where it runs?" |
| 11. Jargon (SAM, ARR, absorption/access, core loop, datamined) | **Partly fixed** | "SAM (the revenue you could realistically serve)" and "The $100M revenue test" are now plain. "core loop" remains, and "venture scale" and "overlay model" are new. |
| Length 1,238 (slightly over) | **Worse** | 1,445 words. |

**New regressions or new errors in round 3:**
- One misquote of items.ts:254 (error 1).
- The "anonymous" doc–code conflict is overstated and rated "high" (error 2).
- The planner non-goal is misread, and pausing a stated VISION component is not named (error 3).
- Move 2 is a bundle with no time box. This breaks instruction 6's new "one action, not a bundle" rule (error 6).
- Move 3's stop threshold conflicts with the answer's own cost figure (error 6).
- The Folta caveat is dropped (error 8).
- The PlannerSite dependency and competitor finding is lost (error 9).
- The answer is 207 words longer than round 2.

**Checks requested:**
- (a) **File claims:** 19 checked: 17 accurate, 1 misquote, 1 misreading of the vision. There are no misattributions (round 2 had one). One correctly quoted line (VISION:64-65) is interpreted beyond what the docs support.
- (b) **Evidence labels:** they match the playbook for Folta [research], Tidelift [vendor], Discord policy and Blizzard [first-party, via snippets], and own knowledge [unverified]. Caveats are dropped twice: Folta's scope, and the "[not re-verified]" verification rule.
- (c) **Length:** 1,445 words, over "under about 1,200" by 20%.
- (d) **One action per move:** moves 1 and 3 are one action each. Move 2 is a bundle (choose to hide names or change the vision, then publish a note, then build a removal path). The answer has a "What would prove me wrong" line, but it is aimed at the money verdict and refers to a retention threshold that was never set. It does not test the liquidity diagnosis directly.

**Net:** 17/20, the same total as rounds 1 and 2.
- **Improved:** citation accuracy (0 misattributions), base rates matched to the goal, the intent conflict flagged, the obtainable market addressed in the answer, and plainer money terms.
- **Lost or not improved:** length is clearly over, move 2 breaks the new one-action rule, a playbook caveat is dropped, and two new readings of the vision are overstated.

Items 7, 8 and 10 stay at 1. They now lose their points mostly on format, caveats and length rather than on wrong facts.
