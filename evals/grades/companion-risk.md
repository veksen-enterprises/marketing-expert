# Grade: companion-risk

Case: "Is GameX Companion worth building seriously? What are the big risks, and could it ever make money?"
Run: `evals/runs/companion-risk.md`. Grader checked the GameX Companion VISION.md, CONTEXT.md, README.md, ADR 0002, apps/bot/README.md and research/plannersite-planner.md, and re-ran `market_size` with the advisor's inputs. The numbers reproduce exactly: TAM $5.7M, SAM $1.71M, 5,263.2 customers, 5.85% of SAM; subscription-only gives SAM $1.62M, 2,777,800 customers needed for $100M, 61.7x SAM.

## Scores

| # | Item | Score | Evidence |
|---|---|---|---|
| 1 | Context first | 2 | Read VISION, CONTEXT, two ADRs, bot README and the PlannerSite research. Checked `list_business_profiles` (returned `[]`). Ends with "Do you want me to save these facts as a business profile…?" It also saw that the history was squashed: "Your git history is squashed to one commit, so I can't tell from the repo." |
| 2 | Asked for numbers / explicit assumptions | 2 | Six questions, including "Is the bot live anywhere yet? Which trade servers, how many members, how many items a day…". Assumptions are labelled A1–A5: "A1: … about 150,000 active GameX traders … This is my guess and is not sourced. Get the real figure from the member counts of the top trade servers." |
| 3 | Diagnosis before tactics | 2 | "You don't control your distribution. This is the biggest risk," backed by the repo's own evidence ("Message Content Intent needs Discord's approval once the bot is on 100+ servers") and the supply-first logic. Unproven demand is ranked second, which is defensible. The playbook says "market risk first", but supply has to exist before demand can be measured. |
| 4 | Right playbook / noticed what's unusual | 2 | Used opportunity_assessment, startup-risk, market-sizing, platform-risk, incumbents and marketplaces. It saw that there is no revenue model ("the obvious ways to charge clash with your own 'augment, don't disrupt' principle") and that Discord is the platform. It did not load consumer-apps or organic-social-and-community, which is acceptable for a risk question. |
| 5 | Tools for numbers | 1 | Ran `market_size` three times and caught that the tool double-counts ("The tool's combined figure counts the same people twice"). But the key figure came from hand arithmetic: "At that rate it is 450–1,350 payers, roughly $16k–$49k a year." The arithmetic is correct, but the tool cannot express a paying share. The prompt asks for a "capacity-bounded obtainable market"; none was computed. Run 15 also passed `annualChurn` and `horizonYears` with no capacity, so both inputs were ignored without comment. |
| 6 | Specific to this business | 2 | "Do not sell faster notifications. Your own VISION.md says the first person to message the owner wins the item." Also names "a watch that fires on an item that was already sold", the Exocet-font OCR, ADR 0002 and the Warlock class, and a kill threshold of "fewer than 2% of the items it lists are later corrected". None of this would fit a random startup. |
| 7 | Focused and ranked | 2 | Three dated tests, each with a threshold and a kill rule: "Kill watches as the core if 4th-week retention is below 20%." The single next test is named, and "what not to do" is explicit (no speed perks, no real-money trading, no general planner). The answer is long, though: 7 risks, 5 ways to charge and 6 pre-mortem items. |
| 8 | Evidence honesty | 1 | Labelling is strong overall ("my knowledge; check the current text"; "my own rough guess … not playbook data"). Three problems: (a) it misstates the playbook. The playbook says the RCT founders "were more likely to abandon or pivot … **and earned more revenue**", but the answer says the benefit is "killing bad ideas sooner, not raising revenue". (b) It applies BLS employer-establishment survival (51%) and VC return rates to a solo hobby Discord bot without saying the reference class is wrong. (c) "years of careful work" is asserted as fact, but the repo shows one squashed commit, so nobody can know how long it took. |
| 9 | Respects vision | 1 | Mostly strong: no speed perks, not a marketplace, and the value conflicts are named ("Your values conflict with each other … make it on purpose"). But it recommends charging server owners for "price-check commands", and VISION's non-goals say "No escrow, **no pricing**". That conflict is not flagged. The fallback pivot ("become a web tool where traders paste screenshots") contradicts "never require a trader to leave Discord", and it is not marked as a values trade-off. |
| 10 | Plain language | 2 | No "moat" and no hype words. Short sentences. Small slips: "leap-of-faith hypothesis tests" and "base rates" are never explained. "Pre-mortem" is explained only by example. |

**Total: 17/20**

## Errors

1. **Playbook misquoted (factual).** The answer says "The RCT evidence in the playbook says their main benefit is killing bad ideas sooner, not raising revenue." `knowledge/startup-risk-and-opportunity.md` says the treated founders "were more likely to abandon or pivot … and earned more revenue." The answer reverses part of the finding.
2. **Reference-class mismatch, not flagged.** The 51% 5-year survival figure (BLS, employer establishments) and the 75% VC no-return figure (Ghosh) are presented as the base rates for a hobby Discord bot with no revenue. Neither fits. The founder's question 6 ("still running and covering its costs in 2 years") has no base rate in the playbook at all.
3. **Vision conflict, not flagged.** "price-check commands" would be pricing, which VISION.md explicitly rules out.
4. **Hand arithmetic presented as a result.** "450–1,350 payers, roughly $16k–$49k a year" is 45,000 × 1–3% × $36. The arithmetic is correct and the 1–3% is labelled a guess, but this is the headline money number and it bypassed the tool.
5. **Tool misuse.**
   - Run 15 entered the same 150k traders as two segments (subscription and ads), so the tool counted them twice: 90k "serviceable accounts" and a blended value of $19.
   - It passed `annualChurn` 0.6 and `horizonYears` 3 with no capacity constraint, so neither had any effect.
   - It never supplied a capacity bound, so no obtainable market was computed, even though the prompt asks for one.
   - The advisor caught the double count. It did not mention the ignored inputs.
6. **Thresholds too small to mean anything.** Test 3, "at least 2% of weekly-active watchers paying", runs on test 2's base of about 200 watchers, which is about 4 people. "Or at least 50 payers" contradicts that bar. Neither is checked against the 450–1,350 payers the money section needs. The 60-day kill window in test 1 also does not match its own "end of Nov, next 8 weeks" deadline.
7. **Unsupported claim.** "years of careful work" is not supported (see item 8 above).
8. **Prompt steps skipped.**
   - Step 2 asks for the smallest group that wants this urgently. None is named. Graham's "well test" is in the playbook but not applied. An obvious candidate: high-value traders and resellers hunting specific rolls, such as the 40ias claw example.
   - Step 4 asks for "Why now". It is not answered. Candidates: the 2026 Warlock expansion and seasons, and cheap OCR.
9. **Missed opportunities (from my own knowledge; uncertain).**
   - Discord's native app subscriptions (Premium Apps) were not mentioned. They let a bot charge without the trader leaving Discord, which is the one way to charge that fits "augment, don't disrupt". Eligibility rules and fees should be checked.
   - Not raised as a risk: `packages/tools` drives PlannerSite's planner headless through Playwright, and the research note says it was "Written for the team building this repo's own planner". That is a dependency on a competitor's site and its terms. The answer only partly caught it, with "don't build a general planner".
10. **Facts I checked from my own knowledge and found plausible:**
    - Blizzard's terms prohibit real-money trading.
    - Discord gates privileged intents at 100 servers (this is also stated in the repo).
    - d2jsp, TradeSite and fansite.example are real alternatives.
    - The Cooper/Woo/Dunkelberg 81% vs 39% figures are quoted correctly.

## Top strengths

1. **It refuses to sell speed, with the founder's own reasoning:** "Selling speed is selling a trading advantage, and in a small community that is the quickest way to get the bot kicked off servers." This is the most valuable sentence in the answer, and it comes from reading VISION.md closely.
2. **Kill criteria are concrete and dated.** Examples: "fewer than 2% of the items it lists are later corrected", "4th-week retention is below 20%", and the single next test, "message the owners of the 3–5 largest GameX trade servers".
3. **Assumptions are honest.** A1–A5 are labelled, it tells the founder where to get the real counts, it asks for the founder's own odds before showing base rates, and it caught the tool's double count.

## Server attribution (ranked, most impactful first)

1. **`src/lib/marketSize.ts` and the `market_size` schema in `src/server.ts` assume B2B buyers. (Server caused.)**
   - **What went wrong:**
     - "accounts" means "users who would pay", so a free-tool audience cannot be entered with a paying share. The advisor did the money math by hand.
     - Segments are summed as if they were separate customers, so revenue streams from the same users are double-counted.
     - The obtainable market can only be bounded by sales reps or paid-ads budget. That does not fit an organic, community-distributed product, so the advisor skipped it.
     - `annualChurn` and `horizonYears` are ignored without warning when no capacity is given.
     - The source warning suggests "a census count, a Sales Navigator / technographic query", which is useless for Discord member counts.
   - **Fix:**
     - Add an optional `payingShare` (0–1) per segment. Output the paying accounts and the revenue at that share.
     - Add `revenuePerUser` streams within a segment (subscription, ads, donations) instead of separate segments, or warn when two segments have identical `accounts`.
     - Add an `organicReach` capacity, for example `{newUsersPerYear, conversion}`.
     - Warn "churn/horizon ignored: no capacity constraint".
     - Make source hints context-neutral: "community member counts, subreddit/Discord sizes, app-store or SteamDB player counts, census or Sales Navigator for B2B".
2. **`src/prompts.ts` `opportunity_assessment` and `knowledge/startup-risk-and-opportunity.md` have no path for side projects or community tools. (Server caused.)**
   - **What went wrong:** The prompt forces "Base rates … survival, return of capital", "a budget" and "the $100M ARR test". The playbook offers only employer-establishment and VC base rates. The advisor applied the wrong reference class (error 2), and its own question 6 had no comparable base rate.
   - **Fix (prompt):** Add step 0: "Ask, or state as an assumption, the founder's goal (hobby / side income / company / venture) and choose the reference class and tests to match. Say so when a base rate's reference class does not fit."
   - **Fix (playbook):** Add a section on side projects and indie tools: default alive measured on hosting costs, affordable loss in hours, burnout and maintainer churn as the main way they fail, and acquisition by a fansite or network as the realistic exit. Label each source's evidence strength.
3. **No playbook covers paying models for community, hobby or gaming tools. (Server caused.)**
   - **What went wrong:** `search_playbooks` for "monetization gaming community donations" returned only RevenueCat app LTV and B2B freemium data, which the advisor rightly set aside. So the 1–3% paying share is pure guesswork, and Discord-native subscriptions were never mentioned.
   - **Fix:** Add a section to `knowledge/pricing.md`, or a new `knowledge/community-and-creator-monetization.md`, covering:
     - supporter and donation tiers (Patreon, Ko-fi), with any published paying-share data, labelled vendor or practitioner;
     - platform-native subscriptions (Discord Premium Apps, Twitch extensions) and their fees and eligibility, dated;
     - charging community owners instead of members;
     - fansite ad networks and their RPM ranges;
     - the rule: "never sell a competitive advantage inside a community you depend on for distribution".
   - Tag it so the search terms above reach it.
4. **`src/server.ts` INSTRUCTIONS do not require checking advice against the founder's stated non-goals. (Server caused in part; assistant missed it.)**
   - **What went wrong:** The answer checked speed and the marketplace non-goal but missed "no pricing" and the pivot to a forced destination.
   - **Fix:** Add a rule: "Before finalizing, list the user's stated values and non-goals (from VISION/profile) and check every recommendation against them; label each conflict 'this contradicts X — I recommend it anyway because…' or drop it." Add `nonGoals` to the business profile schema (`src/lib/profile.ts`) so these persist.
5. **INSTRUCTIONS rule 4 does not require quoting playbook findings. (Assistant error; the server can make it less likely.)**
   - **What went wrong:** The RCT finding was paraphrased with its direction reversed.
   - **Fix:** Add to rule 4: "When you cite a playbook finding, keep its direction and qualifiers; quote the line if it is short." Optionally have `get_playbook` return section anchors so they are easy to quote.
6. **`knowledge/platform-and-feature-risk.md` has no Discord cases. (Server caused; assistant compensated.)**
   - **What went wrong:** The access-cutting table lists Twitter, Reddit, Facebook, Google and Apple, but not Discord. The advisor fell back on unchecked general knowledge.
   - **Fix:** Add dated, sourced Discord rows: Message Content made a privileged intent (2022); verification and intent approval at 100 servers; Developer Policy limits on storing and reusing message content; bots shut down by a third party's terms (the 2021 music-bot shutdowns came from YouTube, not Discord). Add a "community-hosted bot" pattern: distribution depends on individual server owners as well as the platform.
7. **`opportunity_assessment` steps were skipped. (Assistant ignored the server.)**
   - **What went wrong:** Step 2 (smallest urgent group) and step 4 (why now) are explicit in the prompt and were left out.
   - **Fix:** Little to change on the server side. Optionally end the prompt with "Answer every numbered step, or say why it does not apply." That cheap check would have caught both.
8. **Kill thresholds are not checked against sample size. (Prompt gap.)**
   - **What went wrong:** Step 7 asks for "a test with a threshold and deadline" but not whether the threshold can be measured. That is how 2% of about 200 watchers (about 4 people) became a pass/fail bar.
   - **Fix:** Add "check each threshold is measurable at the expected sample size (state n; use the stats tools if comparing rates) and consistent with the revenue numbers above."
