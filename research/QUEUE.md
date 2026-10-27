# Research queue

How it works: a lead enters the queue only if it names the tool, check or playbook it would change, and the result that would change it. A lead that changes nothing is logged as parked and not researched. Depth is capped at 2 hops from a seed; a round stops at about 8 notes and is reported.

Status: queued, done (note linked), parked (reason). Hop 0 is a seed.

## Round 1 (2026-10-27)

Seeds: (A) sampling bias in founder validation tests, the gap named in `stop-line-statistics.md` §5; (B) the open questions in the notes merged 2026-10-27.

| # | Lead | Hop | From | Would change | Result that would change it | Status |
|---|---|---|---|---|---|---|
| 1 | Who the founder asks: friends, one community | 0 | A | `check_answer` band note (stop-line §6 item 4); `knowledge/customer-research.md` | Evidence that a known asker or one community shifts rates but not comparisons | done: `founder-test-samples.md` |
| 2 | How accurate "where users came from" is, now that it ranks bets | 0 | B (intake §4, made live by 2285930) | `match_small_bets` `CHANNEL_BOOST` | Evidence that recalled sources name channels that brought no users | done: `channel-answer-accuracy.md` |
| 3 | Does a written stop line make people stop? | 0 | B (forecasting open questions) | `check_answer` stop-line requirement; predictions record follow-up | A field or manager study where pre-set rules don't change stopping, or work only when someone else sets them | done: `stop-rules-follow-through.md` |
| 4 | Weekly counts vary more than Poisson at 5–50 a week? | 0 | B (deciding-at-founder-volume open questions) | the "about 70% or more" figure in `check_answer`'s no-baseline issue | A dispersion ratio of 1.5+ at founder volume would raise it | parked: no data reachable. The GitHub API here is scoped to this repo, and analytics, retail and download-count hosts are blocked; retail forecasting papers found say only "variance usually larger than the mean". The message already says "from sampling noise alone", so it is not overstated. A local session could measure it from public star or download histories. |
| 5 | Which error rates a stop line should be judged by (α = β = 0.20 default) | 0 | B (stop-line open questions) | band note wording, stop-line §6 item 4 | Evidence that error cost, not error rate, should set the band | done: `stop-line-error-costs.md` |
| 6 | LLM-grader agreement on checklist rubrics | 0 | B (grader-reliability §8) | evaluation method step 3 (how many graders), grader-reliability §7 | Item-level agreement figures for model graders on yes/no criteria | done: `llm-grader-checklists.md` |
| 7 | Does choosing between options resist flattery better than rating one? | 1 | 1 | `knowledge/customer-research.md` claim proposed in note 1 | Evidence that a choice format cuts inflated answers, and its condition | done: `choice-vs-rating.md` |
| 8 | Intraclass correlation of opinions inside one online community | 1 | 1 | band note | A published ICC would size a design effect | parked: with one community there is no between-community variance to estimate (note 1 §3), so no figure changes the note |
| 9 | Free-text vs drop-down "how did you hear" accuracy | 1 | 2 | get_started channel question | — | parked: PR #20 already removes the channel menu |
| 10 | Do founders over-credit channels they worked on (self-serving attribution)? | 1 | 2 | `CHANNEL_BOOST` | — | parked: the basis rule in note 2 §5 covers it whatever the size |
| 11 | How often founders restart a dropped test | 1 | 5 | band note asymmetry | — | parked: no source class found; only logged outcomes in the predictions record could show it |
| 12 | Do outside judges stop failing projects in the field, and who is "outside" when the advisor wrote the move? | 1 | 3 | predictions record follow-up | Field evidence for decoupling; whether the same model counts as the original decider | done: `outside-judge-at-follow-up.md` |
| 13 | How large same-model self-preference is in grading, and on which items | 1 | 6 | evaluation method step 5 (cross-family check) | Evidence on where the bias concentrates | done: `same-model-grading.md` |

Round 1 stopped at 8 notes (cap). Depth reached: 1 hop; the only hop-2 lead (14) needs an evaluation run, not reading.

Left for a later round (queued, not researched):

| # | Lead | Hop | From | Would change | Result that would change it |
|---|---|---|---|---|---|
| 14 | Does a cross-family grader on split items find a same-family bias in this repo's grades? | 2 | 13 | evaluation method step 5 | An empirical run, not literature: needs the step 3 double-grade first |
| 15 | Weekly-count dispersion at founder volume from public histories (local session) | — | 4 | `check_answer` no-baseline message | Dispersion of 1.5+ would raise the 70% figure |

## Round 2 (2026-10-27, parallel)

Same entry rule. Changes from round 1: leads run in parallel, one per lead, and each returned note's leads are dispatched at once; depth cap 3 hops, about 15 notes. Seeds: round 1's leftovers and the open questions in `research/*.md`.

Not dispatched at the start:
- Round 1 #14 (cross-family grader on split items) and #15 (weekly-count dispersion): blocked, as before. #14 waits on the double-grade evaluation round; #15 needs public count histories that this cloud session can't fetch.
- Hypothesis-driven founding and termination (Camuffo trials): already in `startup-risk-and-opportunity.md` §4.
- Demand effects from a known asker: `founder-test-samples.md` source 7 covers it.
- Same-model grader under a different prompt (`same-model-grading.md` §4): only changes evaluation step 5, which waits on #14.
- Does tagging traction as estimated change advice (`intake-question-design.md`): needs an evaluation run.
- Base rates from the 31-case set: survivors only (`forecasting-and-calibration.md`), so any rate is biased upward.

| # | Lead | Hop | From | Would change | Result that would change it | Status |
|---|---|---|---|---|---|---|
| 16 | Do people change course right after a dip below their aim? | 0 | `deciding-at-founder-volume.md` open questions | `check_answer` no-baseline issue | Field evidence that change follows below-aim results in small units | done: `acting-after-a-dip.md` |
| 17 | Base rates for founder-scale moves (launch posts, listings, answers, comparison pages) | 0 | `forecasting-and-calibration.md` open questions | `evidence` and `ceiling` grades in `smallBetsCatalog.ts` | A measured hit rate with a denominator that contradicts a bet's grade | done: `small-bet-base-rates.md` |
| 18 | Does the outside view improve business forecasts in the field? | 0 | `forecasting-and-calibration.md` open questions | `check_answer`; predictions record | A measured accuracy gain, and which reference-class form worked | done: `outside-view-business.md` |
| 19 | How accurate are LLM judges at checking that a source supports a claim? | 0 | `llm-grader-checklists.md` §4 | evaluation step 3; `verify_quotes` | Judge accuracy by error type, some near chance | done: `llm-citation-checking.md` |
| 20 | Do choice formats predict purchase better than ratings in product tests? | 1 | `choice-vs-rating.md` §4 | the `customer-research.md` claim proposed in that note | A product-domain comparison either way | done: `choice-formats-in-product-tests.md` |
| 21 | Causal evidence that design quality changes conversion or retention | 0 | `design-and-marketing-in-crowded-markets.md` open questions | design claims' tags and wording in playbooks | A causal study with a behavioural outcome, or ratings-only effects | done: `design-quality-outcomes.md` |
| 22 | Does category density lower app entrants' outcomes? | 0 | `crowded-markets.md` open questions | crowded-category claims in playbooks | A measured density effect, and whether distinctiveness offsets it | done: `category-density-apps.md` |
| 23 | Does a channel that worked early keep working at small scale? | 1 | `channel-answer-accuracy.md` §6 | `CHANNEL_BOOST` | Fast saturation (shrink or condition it) or proven-channel advantage (keep it) | done: `proven-channel-returns.md` |
| 24 | Launch sites' relaunch rules, and second-launch outcomes | 2 | 23 | `launch-sites` reason text and stop line; the boost condition proposed in note 23 | A platform rule on relaunching, or data on second launches | done: `relaunch-rules.md` (includes #34) |
| 25 | Do sign-ups by channel predict who stays, at small firms? | 2 | 23 | boost condition (stayed, not just signed up) | A primary study showing sign-up channel predicts retention poorly | done: `channel-and-retention.md` |
| 26 | Greve 1998 full text: how fast learned aims update | 1 | 16 | window length in the proposed `check_answer` issue | A short adjustment window would argue for a longer comparison window | parked: the note's session found the publisher, OpenAlex and Semantic Scholar refused; a local session can read it |
| 27 | van Ours & van Tuijl 2016 full text: how comparison teams were matched | 1 | 16 | a worked regression-to-the-mean example in a measurement playbook | A clean match on dip size makes it a fair example | left for a later round (cap) |
| 28 | Do current judges still pass partial support, and does splitting a claim into facts first help? | 1 | 19 | the per-claim question proposed for `evals/rubric.md`; `graderPrompt` | Recent partial-support F1 above about 0.8 drops the question; a decomposition gain changes it to "split, then check" | done: `partial-support-judges.md` |
| 29 | This repo's grader recall on qualifier-dropped | 1 | 19 | evaluation step 3 | — | blocked: needs the double-grade evaluation run |
| 30 | Does crowding cut revenue or survival, not just downloads? (Lee & Raghu 2014; Barlow et al. full text) | 1 | 22 | the crowding qualifier proposed for `competing-with-incumbents.md`; `crowded-markets.md` "look like the leader" bullet | A measured link to top-grossing duration or exits; Barlow modelling installs only | done: `crowding-revenue-survival.md` |
| 31 | Density effects for web or B2B software outside app stores | 1 | 22 | — | — | parked: no candidate source found |
| 32 | Show HN reach to sign-ups | 1 | 17 | `launch-sites` evidence grade | — | parked: no dataset links points to visits or sign-ups; likely private analytics |
| 33 | Clicks for pages aimed at a named query ("X alternative", error text) on small sites | 1 | 17 | `comparison-pages`, `error-pages` grade or ceiling | The typical page gets about zero clicks (downgrade) or some (keep) | done: `query-page-outcomes.md` |
| 34 | Product Hunt featured share by year | 1 | 17 | `launch-sites` stop line | Featured share below about 10% in 2024–25 | done in `relaunch-rules.md`: rough 12–21% in 2024; changes nothing |
| 35 | Lovallo et al. 2012 full text | 1 | 18 | overconfidence claim in `startup-risk-and-opportunity.md` | Accuracy against realised returns, with a size | parked: Wiley, Caltech and ResearchGate unreachable here; a local session can read it |
| 36 | Does asking "why did it miss?" at follow-up feed blaming outside factors? | 1 | 18 | due-predictions note wording | Evidence that asking for reasons raises later overestimation | parked: the note (`profile.ts` DUE_PREDICTIONS_NOTE) asks only for the number and how it was measured, so no result changes it |
| 37 | Causal evidence for onboarding length, defaults and required steps on activation | 1 | 21 | the "product rules, not polish" line | A randomised or quasi-experimental study | parked: analytics area, which another thread is building; no tool here would change |
| 38 | Full texts of Tuch et al. 2012 and Sonderegger & Sauer 2010 | 1 | 21 | qualifiers in `design-quality-outcomes.md` | Samples or sizes that differ from the abstracts | parked: PDFs blocked by the proxy; changes only access marks |
| 39 | Does "would you actually buy the one you picked?" improve prediction of real adoption, and does comparative mode hold within new products? | 2 | 20 | the proposed `customer-research.md` advice; `first-customers.md` new-product line | A large gain adds the follow-up question; a within-new-products advantage strengthens the claim | done: `dual-response-and-new-products.md` (overturns the r = .53 / .09 claim in note 20) |
| 40 | Jamieson & Bass 1989 | 2 | 20 | — | — | parked: about adjusting intent scales, not format; publisher, JSTOR and OpenAlex blocked |
| 41 | Show HN reposts after a first post with no attention | 3 | 24 | `launch-sites` no-reaction branch | Repost pairs reaching 10 points far more or less than 12–13% | parked: hn.algolia.com blocked from the shell that session; the sample is selected on failed first posts |
| 42 | Subreddit launch and repost rules | 3 | 24 | `launch-sites` text | A common waiting-period or no-repost rule | parked: reddit.com blocked here |
| 43 | Product Hunt featured counts by year, first-party | 3 | 24 | "launch platforms saturate" in `design-and-marketing-in-crowded-markets.md` | A whole-year share far from 10% | parked: changes a research note only, and no first-party source found |
| 44 | App-count measures of competition against chart duration or exit (ICIS 2012 "Takeoff and sustained success…", "Competing for Temporary Advantage…", "Habitat Traps…") | 2 | 30 | the chart-survival clause proposed for `competing-with-incumbents.md` | A larger or count-based measure that strengthens or replaces the 1.22 figure | left for a later round (cap) |
| 45 | Lee & Raghu 2014 published full text | 2 | 30 | the 1.22 figure | Different numbers or measure in the journal version | left for a later round (cap) |
| 46 | Clicks per page for sites with a few links vs none | 2 | 33 | "try again once the site has links" clause in the `comparison-pages` and `error-pages` stop lines | A measured jump from a handful of referring domains | left for a later round (cap) |
| 47 | Sign-ups per click from comparison pages | 2 | 33 | `comparison-pages` grade | — | parked: practitioner claims only |
| 48 | Share of error-message searches moved to assistants | 2 | 33 | `error-pages` grade | A measured drop of about 30% or more | left for a later round (cap) |
| 49 | Do deeper acquisition discounts lower retention? (Lewis 2006) | 3 | 25 | measure lines of discount-based bets | Full text showing deeper discounts keep fewer users | left for a later round (cap) |
| 50 | Free-trial users stay less: is it in `self-serve-saas.md`? | 3 | 25 | trial wording in `knowledge/self-serve-saas.md` | The playbook lacks it | left for a later round (cap) |
| 51 | Chan, Wu & Xie 2011 full text | 3 | 25 | — | — | parked: no open copy reachable; press release only |
| 52 | Leung 2026 per-judge false-positive vs false-negative rates | 2 | 28 | `graderPrompt` (re-check rejected pairs too) | Low false-positive next to false-negative rate for current judges | left for a later round (cap) |
| 53 | TREC 2024 RAG confusion matrix, partial→full cell | 2 | 28 | the narrow question in `evals/rubric.md` | Partial→full under about 5% of sentences | left for a later round (cap) |
| 54 | Does the targeted split beat the open question in this repo's grades? | 2 | 28 | evaluation step 3 | — | blocked: needs an evaluation run |
| 55 | Wlömert & Eggers 2016 full text | 3 | 39 | "then ask if they'd actually buy the one they picked" in `customer-research.md` | A large hit-rate gain against observed adoption | parked: Groningen PDF failed here; a local session can try |
| 56 | Morwitz 2014 §4.1–4.2: asking mode with newness held fixed | 3 | 39 | "choose, don't rate" in `customer-research.md` | A comparison with newness fixed, either way | left for a later round (cap) |

Round 2 stopped at 15 notes (cap). Depth reached: 2 hops (#24, #25, #39); the hop-3 leads are parked or left.

### Round 2 result: what points at a change

Not built here. Ordered by how much the notes agree and whether a test can come from a real input.

1. **Built 2026-10-27.** **`launch-sites` in `smallBetsCatalog.ts` (#17, #23, #24 agree).** It is `lopsided` but has no `tries`; give it `tries: 2` on two different sites, `effortHours` about 24, and a stop branch for no reaction (the common case: about 1 in 8 Show HN posts reaches 10 points). Stop boosting it for a founder who already launched; the reason text states the sites' own relaunch rules (Product Hunt: two months and a significant update; Show HN: a much changed version).
2. **Built 2026-10-27.** **`comparison-pages` and `error-pages` stop lines (#33).** Add the zero-clicks case judged on the batch, and drop "drop only if the query has no volume", which a founder can't check. Grades unchanged.
3. **Evaluation method (#19, #28).** `grade.mjs compare` counts `verify_quotes` and label-check findings mechanically; `graderPrompt` pastes those results; the rubric's citation step becomes a targeted split: copy the claim's who / how many / how sure words and quote the source words for each, or write "none". Generic atomic splitting hurt on partial support in the one head-to-head. Test input: the v4 "new coders → all developers" claim.
4. **`match_small_bets` assumption line (#25).** When a channel boost rests on sign-ups only, say users from different channels stay at very different rates and ask for month-1 activity. Score unchanged; `CHANNEL_BOOST` stays 1.5 (#23: nothing sizes it either way).
5. **Playbook edits:** the measured crowding cost in `competing-with-incumbents.md` with a consistency test (#22, #30); the five-analogue line in `startup-risk-and-opportunity.md` (#18); `first-customers.md` line 42 to read with Table 4's qualifiers (#39); "choose, don't rate" in `customer-research.md` on stated-preference evidence only (#20, corrected by #39).
6. **Held until a run produces a failing answer (CLAUDE.md rule):** the `check_answer` issue for a single-recent-period baseline (#16), the issue for redesign moves judged by stated preference (#21), and the "which version wins, not how many buy" band-note line (#20).

Changes nothing: a base-rate requirement in `check_answer` or a prior field on predictions (#18: no field gain found, and a required base rate invites invented ones); `market_size` (#22, #30).
