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
3. **Built 2026-10-27, not yet run on a real batch.** **Evaluation method (#19, #28).** `grade.mjs compare` counts `verify_quotes` and label-check findings mechanically; `graderPrompt` pastes those results; the rubric's citation step becomes a targeted split: copy the claim's who / how many / how sure words and quote the source words for each, or write "none". Generic atomic splitting hurt on partial support in the one head-to-head. Test input: the v4 "new coders → all developers" claim.
4. **`match_small_bets` assumption line (#25).** When a channel boost rests on sign-ups only, say users from different channels stay at very different rates and ask for month-1 activity. Score unchanged; `CHANNEL_BOOST` stays 1.5 (#23: nothing sizes it either way).
5. **Playbook edits:** the measured crowding cost in `competing-with-incumbents.md` with a consistency test (#22, #30); the five-analogue line in `startup-risk-and-opportunity.md` (#18); `first-customers.md` line 42 to read with Table 4's qualifiers (#39); "choose, don't rate" in `customer-research.md` on stated-preference evidence only (#20, corrected by #39).
6. **Held until a run produces a failing answer (CLAUDE.md rule):** the `check_answer` issue for a single-recent-period baseline (#16), the issue for redesign moves judged by stated preference (#21), and the "which version wins, not how many buy" band-note line (#20).

Changes nothing: a base-rate requirement in `check_answer` or a prior field on predictions (#18: no field gain found, and a required base rate invites invented ones); `market_size` (#22, #30).

Access mark added 2026-10-27: `[read DATE; fetch summary]` for a source seen only through a fetch tool that returns a summary and quotes (`knowledge/_conventions.md`; checked by `test/researchMarks.test.ts`). Applied where a note says how it read the page. Not applied, because the note doesn't say which tool read which source: the notes that only say "access marks as in `founder-test-samples.md`", and `query-page-outcomes.md`, `seasonal-and-hobby-products.md`, `small-bets-direct.md`, `start-with-why.md` (curl and a fetch tool mixed). Their `[read]` marks may overstate.

## Round 3 (2026-10-27, parallel): home pages and landing pages

Seed: the owner asked whether the server has anything specific for home and landing pages. It had a teardown prompt, one playbook and a few `audit_page` heuristics (no h1, form over 5 fields, generic "Submit", no CTA found); `leadText` included menu text. Aim: deterministic checks a tool can run on a page's HTML or URL. Same entry rule and caps as round 2. The design stance holds: no tool grades how a page looks.

Access: in this cloud session the proxy refused curl to every source host and the shared web-search budget ran out partway, so every source was seen through WebFetch (`fetch summary`), an abstract or a snippet. Re-check any figure against its text before it enters a playbook.

| # | Lead | Hop | From | Would change | Result that would change it | Status |
|---|---|---|---|---|---|---|
| 57 | What is the "first screen", and can a tool extract it? | 0 | seed | `audit_page` `leadText`; render-mode `firstScreen`; teardown step 1 | Fold attention share today; defensible viewport sizes | done: `first-screen.md` |
| 58 | Do clear heroes convert better, and which text features predict it? | 0 | seed | `analyze_copy` hero flags; `messaging-and-copy.md` hero rule | A computable feature linked to clicks or sign-ups | done: `hero-message-clarity.md` (no flags) |
| 59 | Competing actions, nav removal, CTA placement and wording | 0 | seed | `audit_page` CTA facts and "generic Submit" flag; "one primary goal" line | A controlled effect size | done: `cta-and-competing-actions.md` (none found) |
| 60 | Page speed and weight: causal evidence and checkable thresholds | 0 | seed | `audit_page` size and request fields; Speed section | A causal threshold, or evidence that lab runs mislead | done: `page-speed-and-weight.md` |
| 61 | Social proof on pages | 0 | seed | `audit_page` proof detection; Proof section tags | An effect size and its conditions | done: `social-proof-on-pages.md` |
| 62 | Trust signals a crawler can see | 0 | seed | `crawl_site`/`audit_page` site-information links; teardown | Absence linked to trust or conversion, or a legal duty | done: `trust-signals.md` |
| 63 | When is design the lever, and which cheap human checks are valid? | 0 | seed | teardown human checks; a render-mode trigger | Tester counts; computed measures that predict appeal | done: `design-lever-checks.md` (no computed trigger) |
| 64 | Overlays on arrival and carousels | 0 | seed | render-mode overlay check; carousel detection | A first-party threshold or a measured effect | done: `overlays-and-carousels.md` |
| 65 | Message match between ad and page | 0 | seed | teardown step 2; "Message match" line; overlap check | A measured congruence effect, or overlap failing as a proxy | done: `message-match.md` (no overlap score) |
| 66 | Home page vs single-purpose landing page | 0 | seed | teardown home-page branch; which flags apply | Different failure points | done: `home-page-vs-landing-page.md` |
| 67 | Can labels alone predict navigation problems? (Blackmon et al.) | 1 | 66 | `audit_page` `navLabels` and a generic-label flag | A validated goal-free rule | done: `nav-labels.md` (no; list plus Lighthouse's exact list) |
| 68 | Do stated picks predict live A/B winners? | 1 | 63 | the side-by-side kit; teardown human checks | Agreement rates | done: `preference-vs-live-results.md` (near chance; overturns the kit as a decision aid) |
| 69 | Page features that predict bounce after an ad click | 1 | 65 | `audit_page` fields or flags | A feature with a usable direction and size | done: `post-click-page-features.md` (none; one sideways-scroll fact) |
| 70 | Real-user speed data (CrUX) for small sites; weight vs field pass rates | 1 | 60 | an optional CrUX lookup; byte and request flag wording | Coverage of small sites; a weight-to-failure link | done: `field-speed-data.md` |
| 71 | Share of home pages whose h1 sits in the site header or is a logo | 1 | 57 | `leadText` header rule | Over about 10% | parked: needs HTTP Archive queries billed to a cloud project; the h1-first rule covers it either way |
| 72 | Lagun & Lalmas 2016, mobile viewport attention | 1 | 57 | fold line; phone size | A measured mobile first-screen share | left for a later round (cap) |
| 73 | Visible viewport heights of common phones | 1 | 57 | 390×664 phone size | Heights well above 664 | left for a later round (cap); settle at build time |
| 74 | EasyList licence for consent selectors | 1 | 57 | consent ids in `leadText` | Incompatible licence | left; check at build time |
| 75 | Home page's share of entrances on small product sites | 1 | 66 | weight of the home-page branch | Most visits start deep | parked: public dashboards (Plausible) refused here |
| 76 | Home page vs dedicated page as ad destination, controlled | 1 | 66, 65 | "one goal for paid traffic" line | A consistent direction across advertisers | left for a later round (cap); Becker 2009 and Ghose & Yang 2009 full texts are the start |
| 77 | Platform first-party results on nav or CTA count | 1 | 59 | `ctaTargets` note text; "one primary goal" | A first-party controlled result | left for a later round (cap) |
| 78 | Qubit 2017 appendices: navigation removal only | 1 | 59 | "one primary goal" tag | A clearly non-zero removal effect | left for a later round (cap) |
| 79 | Sadowski et al. 2025, pronouns in action prompts | 1 | 59 | "no pronoun check"; folklore line | A controlled behavioural test | left for a later round (cap) |
| 80 | Kohavi 2013/2014 PDFs (Bing per-100 ms figure) | 1 | 60 | Speed line wording | The primary figure differs | parked: PDFs refused here; a local session can read them |
| 81 | Google's current review-snippet page: "self-serving" reviews | 1 | 61 | a structured-data info flag | The rule confirmed or dropped | not research: re-read the first-party page when building (refused to curl here) |
| 82 | Gee (Management Science) results by count bin | 1 | 61 | the "no small-number flag" decision | Reliable harm at low counts | left for a later round (cap) |
| 83 | Fang, Kim & Chintagunta 2026, stacking proof cues | 1 | 61 | proof line | Effect sizes for review counts | left for a later round (cap) |
| 84 | Özpolat 2013 and Özpolat & Jank 2015 full texts | 1 | 62 | seal line | Sizes by segment | left for a later round (cap) |
| 85 | Google Search Quality Rater Guidelines on contact information | 1 | 62 | contact facts → flag | Raters told to mark shops without contact information low | left for a later round (cap) |
| 86 | Consumer Rights Directive Art. 6 as amended by 2019/2161 | 1 | 62 | the proposed EU rows in `marketing-law-by-market.md` | Phone now required | left; must be re-read before those rows enter |
| 87 | Within-category complexity vs appeal | 1 | 63 | a "much busier than competitors" note | Correlation above about .6 | parked: #68 shows picks don't predict live winners, so a better trigger for a human pick changes little |
| 88 | 5-second test test-retest reliability | 1 | 63 | tester count | A reliability figure | left for a later round (cap) |
| 89 | Blocking cookie walls vs bounce or conversion | 1 | 64 | overlay flag severity for consent | A measured drop | left for a later round (cap) |
| 90 | Moe 2006 and Huang et al. full texts | 1 | 64 | overlay flag figures | Figures differ | parked: refused here; a local session can read them |
| 91 | Microsoft Advertising landing-page relevance docs | 1 | 65 | "Message match" first-party wording | Microsoft requiring exact keywords | left for a later round (cap) |
| 92 | Banerjee & Urminsky, published version | 1 | 58 | playbook line on which features help | Confirmatory effects that differ | left for a later round (cap) |
| 93 | Category word in h1 when the profile stores a category | 1 | 58 | a new check | A behavioural study that naming the category lifts sign-ups | parked: lab evidence only, and the profile has no category field |
| 94 | CWW "unfamiliar word" rule | 2 | 67 | a goal-free rare-word flag | A frequency threshold validated on marketing sites | left for a later round (cap) |
| 95 | Agent vs first-click test on home pages | 2 | 67 | teardown home-page label step | Per-task agreement | blocked: needs an evaluation with people |
| 96 | Monadic stated test (one page per tester) vs live A/B | 2 | 68 | the human check's design | Direction agreement near the 82–94% seen in persuasion studies, at 20–40 people | left for a later round (cap); the most useful next lead |
| 97 | O'Keefe 2018 full text: subsets with lopsided picks | 2 | 68 | kit output text | A subset at 75% or more | left for a later round (cap) |
| 98 | Dolma et al. 2021, bounce with landing-page signals | 2 | 69 | `audit_page` | A signal with a direction and size | parked: ACM refused here |
| 99 | Keyed CrUX lookup of evaluation-case origins (counts only, outside git) | 2 | 70 | whether to build the CrUX lookup | Most return 404 (keep optional) or most have data (promote) | blocked: needs a CrUX API key |
| 100 | Almanac weight-vs-pass query by rank, with request buckets | 2 | 70 | byte and request flag wording | The slope fading within rank groups | parked: BigQuery bills a cloud project |
| 101 | Google APIs Terms for showing CrUX results | 2 | 70 | the CrUX lookup design | A limit on storing or showing results | left; read before building |

Round 3 stopped at 14 notes. Depth reached: 1 hop; the hop-2 leads are left or blocked.

### Round 3 result: checks worth building, ranked

Ranked by evidence for the check itself, cost, and how often a teardown would use it. "Facts" means a field with no verdict; "info" is the lowest flag severity. No item claims a conversion effect the notes didn't find.

1. **Built 2026-10-27.** **Fix `leadText`, add `navLabels` and `pageKind` (#57, #66, #67).** Start `leadText` at the h1 when there is one; otherwise skip `<nav>`, skip links, consent-tool markup and a `<header>` with no h1; say which rule applied (`leadTextSource`). About a third of home pages have no header or nav landmark, so landmarks alone don't fix it. `navLabels`: menu and header links as `{text, href}`, first 30. `pageKind`: home when the path is `/` or a language root. A measurement fix with a failing test already in the repo: `test/regressions3.test.ts` expects menu text as `leadText`.
2. **Built 2026-10-27.** **Site-information links (#62).** On the start page, report which of contact (or mailto/tel), imprint, privacy and terms links are found, in English, German, French and Spanish words; About and pricing as facts only. Missing items are info, each tied to its law (EU e-Commerce Directive Art. 5, Germany DDG § 5, UK reg. 6, CalOPPA's home-page "privacy" link), and the output says the tool doesn't know which markets apply. Plus a warning for a page served over plain HTTP (Chrome's "Not secure" label). The strongest basis of any check here: first-party law, not conversion claims. The law text was seen through a fetch summary, so re-read it before building.
3. **Render-mode first screen at 390×664 and 1280×720 (#57, #64, #69).** Per size: whether the h1 and any CTA candidate are on screen; fixed, sticky or modal elements covering 30% or more of the phone screen at load, with their text and a likely type (30% is the Better Ads limit for sticky ads, borrowed and said so; Google gives no number); and page wider than the phone screen. All info. Must say: popups on delay, scroll or exit aren't seen, and EU-only consent banners may not show from here.
4. **Size and requests (#60, #70).** Fetch mode: `htmlBytes` and the compressed size (header or local gzip), compared with HTTP Archive's home-page HTML, which is measured compressed (about 155 KB at the 90th percentile). Render mode: `requests` and `transferBytes`, info above the 90th percentile (about 190 requests, 11 MB). For bytes, the text may say "pages over 5 MB passed Core Web Vitals about half as often as pages under 1 MB, across sites; not a measurement of this page". No flag on a lab LCP from one run. An optional CrUX API lookup (needs a key and a security look; sends only the origin) is held until #99 shows small sites have data; a "no data" answer has three causes and must say so.
5. **Proof found, as facts (#61).** Ratings (JSON-LD and "4.8/5" text), number-plus-customer-noun counts, testimonial blocks, logo strips. Info when none is found, with what wasn't seen (images, script widgets, other pages). No small-number or rating-ceiling flag. Separate first-party item: review markup nested in Organization or LocalBusiness on the business's own site, once Google's current page confirms the "self-serving" rule (#81).
6. **Link text (#59, #67).** Info for links whose text exactly matches Lighthouse's non-descriptive list ("learn more", "click here"…), worded as Lighthouse does (search engines and screen readers; no conversion claim). Optional: same text, different targets (WCAG 2.4.9). Reword "generic Submit" as common advice with no measured gain. Don't extend to "Solutions" or "Explore".
7. **Offer tokens (#65).** Optional `adText` input: percentages, prices, "free", "trial", "no card" and quoted words from the ad that aren't in the page text. Rests on Google's own offer-follow-through example, no measured effect. Never flag a missing search keyword.
8. **Carousel detection (#64).** Info, with slide count, the one-site click data (about 1% clicked; most clicks on slide 1), and the WCAG 2.2.2 pause note when autoplay hints are present.

Text changes, not tools (replace, don't append):
- Teardown prompt: a home-page branch (top tasks and their links, menu labels judged per task, visible menu, log-in) that drops message match and "one primary action" (#66, #67); step 2 as "put the ad text next to the title, h1 and first screen" (#65); step 1 reads `leadText` or the first screen.
- Human checks: 5 people for whether the message is understood. A pick between pages, by strangers or experts, matched the live winner about as often as chance (#68), so the side-by-side kit from #63 is not built as a decision aid; if built, it says the pick doesn't predict which version wins.
- `analyze_copy` description: "editing signals, not predictors" (#58: wording features pick the winner of headline tests little better than chance).
- `landing-pages-and-cro.md` tags: the Deloitte method, "53% leave after 3 s" and "Amazon 100 ms = 1%" as folklore, the delay-injection line, the 2.5 s LCP origin (#60); Proof as `[research, mixed]` with the two testimonial trials (#61); "one primary goal" with the vendor meta-analysis near zero and "not for home pages" (#59, #66); Message match `[first-party]` plus vendor (#65); "my beats your" to folklore (#59).
- `marketing-law-by-market.md`: EU, UK and Germany website-information rows, after #86.

Don't build (the notes looked and found nothing to support them): hero length, readability or abstractness flags (#58); a CTA or nav count flag (#59); a pronoun check (#59); word-overlap message match (#65); a computed colourfulness or complexity trigger (#63); a lab LCP flag (#60); small-count or rating-ceiling flags (#61); a seal check (#62); flags from ad-network bounce models (#69); "competing labels" or "unfamiliar words" in code (#67).

## Round 4 (2026-10-27, parallel): dating-app cold start

Run with the `mcp-research` skill (v0.2.0, same as main), Extend mode.
Caps: 3 hops, about 15 notes, about 40% for follow-ups; at most 5 agents at once.
Scope: how the MCP advises a dating app, or any product where one population matches with itself and both people must say yes, through the cold start: which playbook text, calculator, small bets and checks it gets. Out of scope: judging visual design; trust-and-safety operations; privacy and data law except where a law bans a cold-start tactic; growth of apps that are already liquid; general consumer-app retention.
Seeds from: what the server returns today for "dating app cold start" (only `marketplaces.md`, written for buyers and sellers; `liquidity_math` models listings arriving for one watch); `design-and-marketing-in-crowded-markets.md` §5–6 (claims `liquidity_math` "already covers the density side"); `competition-and-defensibility.md` §2 (hard side).

### Not dispatched at the start
- Halaburda, Piskorski & Yildirim 2018 (restricted choice lets small matching platforms coexist): covered by `design-and-marketing-in-crowded-markets.md` §5.
- Hinge's redesign and Match's backing: covered by the same note; confounded, no tool would change.
- Apple guideline 4.3 on dating apps: quoted in `small-bets.md`; folded into #108 only for what changes a bet.
- A baseline advisor run on a dating case: blocked on an evaluation run (needs a dating case in `evals/cases.md`).

| # | Lead | Hop | From | Would change | Result that would change it | Status |
|---|---|---|---|---|---|---|
| 102 | Does a bigger local pool raise matches per user in online dating, or do users get choosier? | 0 | seed: marketplaces.md tipping point; design-and-marketing §5 | `marketplaces.md` "tipping point" line for dating; any pool target in #103's mode | Matches per user rise about in step with pool size: keep a density target. Rise far less (selectivity): say added users give less than they seem | done: `dating-market-thickness.md` |
| 103 | What model fits liquidity when both people must say yes (pool in radius x filter share x mutual like x reply), with congestion on popular profiles? | 0 | seed: liquidity.ts; design-and-marketing §6 | `liquidity_math` (a reciprocal mode or a new tool) and its description | A published model with measured like and reply rates: build the mode. No usable parameters: a playbook line, no tool | done: `reciprocal-liquidity.md` |
| 104 | Does an imbalanced sex ratio drive the scarce side away, and do rules that limit the abundant side (women message first, like caps, costly signals) raise matches? | 0 | seed: marketplaces.md "Which side first? Usually supply"; competition-and-defensibility §2 | `marketplaces.md` side-first section for dating; a bet in `smallBetsCatalog.ts` | Field evidence that a limit on the abundant side raises matches or keeps the scarce side: add with tag. Null or lab-only: tag as such or drop | done: `dating-hard-side.md` |
| 105 | Is seeding with fake, staff, imported or AI profiles treated as deception by regulators and courts? | 0 | seed: marketplaces.md "act as the supplier yourself", "importing existing listings" | those lines (dating carve-out); a `check_answer` flag held until a failing answer | Enforcement or rules against seeded profiles: carve-out and held flag. None found: no change | done: `seeded-profiles-law.md` |
| 106 | Which dense-pocket launch tactics (campus, events, invite-only, one city) have reported outcomes for dating or social apps? | 0 | seed: marketplaces.md stage table; smallBetsCatalog | a "dense-pocket launch" bet with a stop line; stage table | A measured threshold or outcome: bet with stop line. Anecdotes only: practitioner line, weak grade | done: `dense-pocket-launches.md` (founders' stories only) |
| 107 | How much of a dating app's churn is success (people leave because they matched), and does it break the LTV maths? | 0 | seed: economics.ts churn input | a `unit_economics` warning; `retention-and-expansion.md` | A sizeable success share: warning that churn mixes success and failure. Small: no change | done: `dating-churn-on-success.md` (changes nothing in the tool) |
| 108 | Which ad platforms and app stores restrict dating apps (pre-approval, age gates, saturated-category rules)? | 0 | seed: smallBetsCatalog paid and store bets; small-bets.md 4.3 quote | reason text of paid and store bets; `paid-acquisition.md` | Pre-approval or bans on major platforms: add to the bet text. None: no change | done: `dating-ad-and-store-rules.md` |
| 109 | `liquidity_math` verdict shows a 0.0003 share as "0.0% of listings" | 1 | 103 | the `pct` helper in `liquidity.ts` | — | parked: a display bug, not a research question; goes on the build list with a failing test |
| 110 | Rios, Saban & Zheng 2023 (MSOM 25(4)) full text: baseline like and match rates with sample sizes | 1 | 103 | default examples and test numbers of the proposed reciprocal mode | Rates far from the 2003–2016 figures in #103 | done: `dating-like-rates-recent.md` (keeps the numbers; adds a balanced case) |
| 111 | Top-10% share of likes in a small dating app | 1 | 103 | the proposed concentration warning | — | parked: no source found; only a founder's own data would show it |
| 112 | Can a pre-launch dating app get Google's dating certification, or does it need live users? | 1 | 108 | the proposed `paid-acquisition.md` line ("apply before a paid test") | Needs live users or a record: the line says paid starts after launch. Open to new apps: keep "apply early" | done: `dating-ad-certification.md` (neither: the gate is a live, built product, not users) |
| 113 | How often Apple rejects new dating apps under 4.3(b) | 1 | 108 | `listings` note wording ("may" vs "often") | — | parked: only anecdotal developer reports exist; changes one word |
| 114 | Meta's dating ad page text, first-party | 1 | 108 | the paid-acquisition line | — | blocked: transparency.meta.com needs a rendering browser; a local session can read it |
| 115 | `check_answer` label check misses dropped "(theory)", "observational", "quasi" and one-site qualifiers | 1 | 104 | `QUALIFIER` in `src/lib/labelCheck.ts` | — | parked: not a research question; a repo run shows the miss, so it goes on the build list, held until a real answer drops such a qualifier |
| 116 | Full texts of Lee & Niederle 2015 and Bapna et al. 2016 | 1 | 104 | the numbers in the proposed marketplaces.md dating bullet | Numbers differ from the fetch summaries | blocked: publishers refused here; a local session can read them |
| 117 | Effect sizes in Huang et al. 2022 and Karmegam et al. 2026; any causal study of Bumble's women-first rule | 1 | 104 | the same bullet | — | parked: paywalled, abstracts only; no Bumble study exists |
| 118 | Li & Netessine full text: does doubling listings cut confirmations in holiday rentals? | 1 | 102 | a non-dating "doubling supply doesn't double matches" warning in `liquidity_math` | — | parked: outside this round's scope (not dating); seed for a marketplace round |
| 119 | Fong 2024 (published) full text: are the 2018 counterfactuals kept? | 1 | 102 | the counterfactual numbers quoted in `dating-market-thickness.md` | Cut or changed in the published version: drop or requote | blocked: publisher refused here; a local session can read it. Until then, no code change rests on those numbers |
| 120 | Does a labelled house or demo profile help or hurt trust in a new pool? | 1 | 105 | the carve-out line | — | parked: no source class found for outcome data; the line already allows only labelled profiles, which the law requires either way |
| 121 | Full text of the JDI Dating and Ashley Madison orders | 1 | 105 | carve-out wording | Order terms that ban seeding outright, not just require disclosure: stronger wording | blocked: ftc.gov refused here; a local session can read them |
| 122 | Does Google accept TestFlight or closed-testing builds for dating certification? | 2 | 112 | "build is live" wording | — | parked: the form lists only public store app IDs and websites; changes one phrase, and only Google support could answer |
| 123 | Meta's dating permission form or criteria | 2 | 112 | Meta's half of the paid line | Needs spend history or users: Meta waits until after launch | blocked: Meta's pages didn't load here (same as #114); a local session with a browser |
| 124 | Do dating users come back after a break-up, and how many? | 1 | 107 | win-back line in `retention-and-expansion.md` | A measured return rate | parked: outside scope (retention of a liquid app, not the cold start) |
| 125 | Kanoria & Saban 2021 full text | 1 | 107 | `design-and-marketing-in-crowded-markets.md` §5 | A result that limiting search raises matches | blocked: publisher refused here; a local session can read it |
| 126 | Rios et al. full text by direct download: Tables 2–3, users per city | 2 | 110 | the curated test case of the reciprocal mode | Different backlog or like counts | blocked: curl to Spiral got a proxy 403; a local session can download it |
| 127 | Full text of the campus-rollout working paper (source 3 of #106): per-campus early adoption share | 1 | 106 | the dense-pocket bet's stop line | A per-campus first-month adoption distribution gives a real bar | parked: the draft asks not to be cited without permission |
| 128 | Facebook Dating country launches, first-party outcomes | 1 | 106 | stage table "one city" wording | A stated outcome per country | parked: first-party posts report only launches that went ahead, so no comparison with failed pockets is possible; changes nothing |

Round 4 stopped at 9 notes. Depth reached: 2 hops (#112 from #108; #110 from #103). Every remaining lead is blocked on a local session (full texts, Meta's pages), parked, or outside the scope sentence. Fact-check: 87 claims checked by a fresh agent, 78 confirmed, 1 corrected (a court date), 8 unverified, 0 fabricated; plus 5 orchestrator spot-checks, which corrected one sample size (`_factcheck-2026-10-27-dating.md`). Several load-bearing numbers (Fong, Rios et al., Bumble 10-K) were seen only through fetch summaries.

### Round 4 result: changes worth building, ranked

The common finding: the server can't tell a dating app from any other business. `search_playbooks` returns only the buyer-and-seller marketplace playbook, `match_small_bets` drops `category` and `product` (a pre-launch dating profile and a pre-launch B2B profile share 8 of 9 bets), and `liquidity_math` counts every profile that fits a filter as a match.

1. **`liquidity_math` reciprocal mode (#103, #102, #110).** Per side: new active users of the other side in range per day, mutual filter share, like rate out, like rate back, conversation rate. Returns matches and conversations per user per week, the chance of at least one in the window, users needed for a target; warns when the two sides' rates differ 5x or more, that likes concentrate on a few profiles, and that like rates fall as the pool grows (so no pool target from listings maths). Red input from the tool itself: 30 sign-ups a day with filter shares 5–30% returns "about 100% of these watches would fire within 7 days". Tests from the notes: men {15, 0.3, 0.5, 0.02, 0.2} and women {15, 0.3, 0.1, 0.5, 0.2} over 7 days give 0.315 and 1.575 matches a week (27.0%, 79.3%) and the side-gap warning; a balanced curated case {15, 0.3, 0.4, 0.22, 0.2} gives 2.77 (93.7%) and no warning. The example rates come from fetch summaries and test accounts: they set test cases, not verdicts.
2. **One section in `marketplaces.md` for products where both people must say yes (#102, #104, #105, #106).** Replace the scattered bullets each note proposed with one section: there is no supplier; the short side is the choosy, flooded side; a bigger pool makes users choosier (one field experiment: 50% more believed pool, about 2% fewer matches), so don't borrow Airbnb's 300-listings tipping point; rules that make interest scarce or visible raised matches in two field experiments, with no evidence they keep the scarce side; launch one campus, event or city at a time, with no measured threshold (founders' stories only); profiles run by staff, bots or AI must be labelled where users see them (FTC 2014, 2016; two German courts 2022). Tags as in the notes. Test: `search_playbooks` for "dating app cold start" returns this section.
3. **`match_small_bets` sees the business (#108, #106).** Pass `category` and `product` into `SmallBetsFacts`. Then (a) a dating note on `listings`: Apple 4.3(b) accepts a new dating app only if "meaningfully different", and Apple 1.2 and Play require filter, report and block tools at review; (b) a `dense-pocket` bet gated on a new `assets.pocket`, evidence "anecdote", stop line per pocket on first-week mutual matches. Tests: category "dating app" gets the note on `listings` and "B2B SaaS" doesn't; a consumer profile with `assets.pocket` gets `dense-pocket` in fitsNow, without it fitsLater, a businesses profile doesntFit.
4. **`paid-acquisition.md` channel note (#108, #112).** Google needs dating certification (a live store app or site, test log-ins, a recording of the signed-in app; no user count), Meta prior written permission, TikTok a sales rep; all 18+; no published approval time. So a pre-launch dating app plans paid tests only after it is in a store. Data change; only `consistency.test.ts` covers it.
5. **`consumer-apps.md` line on success churn (#107).** Some dating churn is success (one survey: a third named starting a relationship, more named failure or fatigue; n=349, multiple answers). Ask leavers why and track the failure share; don't set lower total churn as the goal.

Bug, not research: `liquidity_math` prints a 0.0003 share as "0.0% of listings" (#109). Reproduced by running the tool; build it with a failing test.

Held until a run produces a failing answer (repo rule):
- A `check_answer` move flag for seeding fake, bot, AI or staff profiles without a label (#105); test input in `seeded-profiles-law.md`.
- A `check_answer` issue for a dating answer that targets "reduce churn" without splitting success from failure (#107).
- `QUALIFIER` in `labelCheck.ts` missing "theory", "observational", "quasi", "one site" (#104, #115). Shown by running the repo and confirmed by the fact-checker on a scratch copy, but no advisor answer has dropped such a qualifier yet.
- All three need a dating case in `evals/cases.md` (generic, no real business) and advisor runs.

Changes nothing (closed):
- No `unit_economics` warning for success churn: no source gives success as a share of exits, and LTV and payback stay right as averages (#107).
- No small bet for a product rule like roses or women-first: it is product design, and no source gives a stop threshold (#104).
- Google's certification gate is a live build, not a user count, so "apply before launch" and "wait for users" are both wrong (#112).
- No users-per-campus or per-city threshold exists in any source read; don't add one (#102, #106).
