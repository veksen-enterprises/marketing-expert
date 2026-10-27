# Forecasting and calibration: base rates for stop lines, and following up on predictions — Research Notes

**Scope.** Can forecasting research make the advisor's moves better? Four questions. Does training people to use base rates (how often things like this usually turn out) make forecasts more accurate, and by how much? Does reference-class forecasting (predicting from the outcomes of similar past cases) work outside lab settings? Which published base rates exist for the moves this server recommends? And what should the server save and check so the next run learns what happened? The note ends with a proposed check.

**Access caveat (2026-10-27).** This session's network blocked direct fetches (publishers, Crossref, Semantic Scholar). Pages were read through a fetch tool that summarises them, so figures below come from the tool's quotes of the text, not from my own reading of a PDF. `[read 2026-10-27: full text]` means the tool read the whole paper. `[read 2026-10-27; abstract]` means only the abstract or a summary page. `[snippet-only]` means only a search result was seen. Treat every figure here as one level weaker than a direct read, and re-check before a figure goes into a playbook.

Tags: [research] peer-reviewed or working-paper study · [first-party] a platform's own documentation · [vendor] data from a company with a commercial interest · [practitioner] a framework, not a controlled test · [derived] my own arithmetic, shown.

**Already in the repo (linked, not repeated):**
- Founder overconfidence (Cooper, Woo & Dunkelberg 1988; Camerer & Lovallo 1999), pre-mortems (Klein 2007; the "30%" is unverified) and kill criteria: `research/startup-risk-and-opportunity.md`, `knowledge/startup-risk-and-opportunity.md`.
- Camuffo et al. 2020 and 2024: the robust benefit of hypothesis-driven founding is stopping bad ideas sooner: same files.
- Kohavi, Tang & Xu 2020 ("most tests show no improvement"), winner's curse, Azevedo et al. 2020 on fat-tailed test results: `research/landscape-2026.md` §8, `research/small-bets.md` [4].
- Cold-email reply rates (Instantly 2026: 3.43% average) [vendor]: `knowledge/outbound-and-abm.md`.
- First-revenue timing from 31 coded developer-tool cases [our coding; survivors only]: `knowledge/first-customers.md`.

## Sources

### A. Does base-rate training improve forecasts?

1. **Chang, W., Chen, E., Mellers, B. & Tetlock, P., "Developing expert political judgment: The impact of training and practice on judgmental accuracy in geopolitical forecasting tournaments,"** *Judgment and Decision Making* 11(5):509–526, 2016. https://dlab.sauder.ubc.ca/sjdm/journal/16/16511/jdm16511.html [research; RCT; read 2026-10-27: full text]
   - "subjects were randomly assigned to either training or control conditions."
   - Training lasted under an hour and "consistently improved accuracy (Brier scores) by 6 to 11%" over control. By year: 10% (probability training) and 11% (scenario training) in year 1, then 12%, 6%, 7% in years 2–4.
   - Arms were about 100–200 forecasters each per year (year 1: control 152, probability-trained 119, scenario-trained 113). The text and Table 4 disagree on which year-4 arm had 131 and which 102.
   - Content: calibration versus resolution, "using comparison classes and base rates", averaging, simple models, biases.
   - "The CHAMPS KNOW principle most associated with boosts in accuracy was the use of comparison classes and base-rates". The authors add "it would be going too far to say that the other principles played no role." This is a correlation inside the trained arm, not a separate randomised test of the base-rate lesson.
   - The effect held from the start to the end of each nine-month year. Nothing was measured after that.
   - **Limits for us.** The forecasters were volunteers answering many geopolitical questions with known end dates, and were scored as they went. A founder judging three marketing moves is a different task. Nobody has tested whether the gain carries over.

2. **Mellers, B., Ungar, L., Baron, J., et al., "Psychological strategies for winning a geopolitical forecasting tournament,"** *Psychological Science* 25(5):1106–1115, 2014. doi:10.1177/0956797614524255; https://escholarship.org/uc/item/4rg4n9vr [research; read 2026-10-27; abstract]
   - Abstract: "probability training, team collaboration, and tracking improved both calibration and resolution." Training "encouraged the use of reference classes".
   - **The "roughly 10%" figure for training is not in the abstract.** It appears in the same group's review (next item) and, with per-year numbers, in Chang et al. 2016 above. Cite Chang et al. for the number.

3. **Tetlock, P. E., Mellers, B. A., Rohrbaugh, N. & Chen, E., "Forecasting tournaments: Tools for increasing transparency and improving the quality of debate,"** *Current Directions in Psychological Science* 23(4):290–295, 2014. https://faculty.wharton.upenn.edu/wp-content/uploads/2015/07/2014---forecasting-tournaments-tools-for-increasing-transparency-and-improving-debate.pdf [research (review by the authors); read 2026-10-27: full text]
   - Training: "about a 10% advantage of the training condition over the no-training condition." Teaming: "roughly 10%". Selecting better forecasters: "roughly 10%". Statistical aggregation (extremizing): "an additional 35% boost".
   - The review does not say these are Brier-score percentages, and gives no number of forecasts needed to tell skill from luck.
   - So the earlier assessment's "Mellers 2014, roughly 10%" is right in size but points at the wrong paper. Chang et al. 2016 gives 6–11% from a randomised design.

4. **Schoenegger, P., Park, P. S., Karger, E., Trott, S. & Tetlock, P. E., "AI-augmented predictions: LLM assistants improve human forecasting accuracy,"** *ACM Transactions on Interactive Intelligent Systems*, 2025 (accessioned Jan 2025). doi:10.1145/3707649; arXiv:2402.07862 [research; RCT; read 2026-10-27: preprint text]
   - 991 people answered six questions. Talking to a GPT-4 assistant improved accuracy "by between 24 percent and 28 percent" over a control model that gave no numbers. Accuracy was absolute error, standardised per question, not Brier.
   - One assistant was prompted to find a reference class and start from its base rate. The other was told to be "overconfident and base-rate neglecting". In the exploratory analysis without one outlier question: 41% versus 29%. The outlier exclusion was not preregistered.
   - **Reading.** Even the biased assistant helped. So most of the gain does not come from the base-rate prompt. Results lean on one outlier question, and six questions is few. This is weak support for "an LLM that cites base rates helps a human forecast"; it is not evidence that our advisor's stop lines would be better calibrated.

### B. Reference-class forecasting outside the lab

5. **Flyvbjerg, B., "From Nobel Prize to project management: Getting risks right,"** *Project Management Journal* 37(3):5–15, 2006. https://arxiv.org/pdf/1302.3642 [research (argument plus data on errors); read 2026-10-27: full text]
   - Three steps: pick a class of similar past projects, get its outcome distribution, place the project in it.
   - Evidence of the problem is strong: average cost overrun 44.7% for rail, 33.8% for bridges and tunnels, 20.4% for roads; rail ridership forecasts averaged −51.4%.
   - Evidence that the method fixes it is thin in this paper. The UK uplifts (from 172 road, 46 rail and 34 fixed-link projects) were applied to the Edinburgh tram, but the paper gives no final cost to compare against. The "first instance" claim rests on personal communications.
   - The paper says the outside view "may fail to predict extreme outcomes" and is hard to apply when precedents are scarce, as with new technology. That is the zero-customer case.

6. **Batselier, J. & Vanhoucke, M., "Practical application and empirical evaluation of reference class forecasting for project management,"** *Project Management Journal* 47(5):36–51, 2016. https://www.pmi.org/learning/library/practical-application-empirical-evaluation-rcf-10277 [research; read 2026-10-27; abstract]
   - On real project data, reference-class forecasting "performs best, for both cost and time forecasting" against Monte Carlo simulation and earned value management. The abstract gives no size and no number of projects.

7. **Lovallo, D., Clarke, C. & Camerer, C., "Robust analogizing and the outside view: Two empirical tests of case-based decision making,"** *Strategic Management Journal* 33(5):496–512, 2012. doi:10.1002/smj.962 [research; read 2026-10-27; abstract]
   - Private-equity investors: a reference class of analogies "performs better than a few analogies familiar to the decision maker." Film revenue: similarity-based forecasting beat regression. No effect sizes in the abstract; full text paywalled.

**Summary of B.** Large projects and investments show that inside-view forecasts are badly optimistic. Evidence that a reference class corrects this is mostly retrospective and abstract-level here. None of it covers marketing moves at zero to ten customers.

### C. Why saving the prediction matters: hindsight, escalation, feedback

8. **Blank, H., Musch, J. & Pohl, R. F., "Hindsight bias: On being wise after the event,"** *Social Cognition* 25(1):1–9, 2007 (overview of the field) [research; read 2026-10-27: full text]
   - Fischhoff & Beyth (1975): after Nixon's 1972 trip, people "thought they had made predictions that were closer to the actual outcomes than they in fact had been."
   - Warnings against the bias "have met with only limited success"; other debiasing needs "great lengths" for a sizable reduction.
   - **Mechanism for us.** If the prediction isn't written down, the founder and the next run will remember it as closer to what happened. A stored record removes the need to remember. I found no study that tests a written record as a fix; the argument is logical.

9. **Sleesman, D. J., Conlon, D. E., McNamara, G. & Miles, J. E., "Cleaning up the big muddy: A meta-analytic review of the determinants of escalation of commitment,"** *Academy of Management Journal* 55(3):541–562, 2012 (co-authors, volume and pages from memory; re-check). https://www.gwern.net/doc/psychology/cognitive-bias/sunk-cost/2012-sleesman.pdf [research; meta-analysis, 166 samples; read 2026-10-27: full text]
   - Personal responsibility for the first decision raises escalation (staying with a losing course): ρ = .26 (k = 54, n = 8,625).
   - Sunk cost alone: ρ = .10, interval includes zero, unless project completion was also varied (ρ = .53, k = 5).
   - Information on opportunity cost reduces escalation (ρ = −.38, k = 6). Pre-set stop rules were not studied.

10. **Simonson, I. & Staw, B. M., "Deescalation strategies: A comparison of techniques for reducing commitment to losing courses of action,"** *Journal of Applied Psychology* 77(4):419–426, 1992. https://www.gwern.net/doc/psychology/cognitive-bias/sunk-cost/1992-simonson.pdf [research; randomised vignette; read 2026-10-27: full text]
    - Business students who first set "minimum target levels that, if not achieved, would lead to a change in policy" put $3.9M of $10M back into their failing choice, against $5.1M at baseline (n = 26 vs 30; p < .05).
    - **Limits.** One study, students, a paper exercise, small arms. It supports writing the stop number before starting. It says nothing about whether founders keep to it weeks later.

11. **Stone, E. R. & Opel, R. B., "Training to improve calibration and discrimination: The effects of performance and environmental feedback,"** *Organizational Behavior and Human Decision Processes* 83(2):282–309, 2000. doi:10.1006/obhd.2000.2910 [research; read 2026-10-27: full text]
    - A 2–5 minute session of feedback on each person's own calibration, built from 100 of their judgments, cut overconfidence on hard items from .19 to .11.
    - The feedback needed 100 judgments per person to compute. Transfer to other domains was not tested. Lichtenstein & Fischhoff (1980) found most gains came in the first of 11 sessions.

### D. Published base rates for the moves this server recommends

12. **Kohavi, R., Deng, A. & Vermeer, L., "A/B testing intuition busters: Common misunderstandings in online controlled experiments,"** KDD 2022. doi:10.1145/3534678.3539160; PDF hosted at https://airbnb.tech/wp-content/uploads/sites/19/2025/10/ABTestingIntuitionBusters.pdf [research (industry authors); read 2026-10-27: full text, Table 2]
    - Share of experiments that were statistically significant improvements: Microsoft 33%, Bing 15%, Booking.com / Google Ads / Netflix about 10%, Airbnb search 8%. With these rates, a "significant" win at p < .05 is false 6–26% of the time.
    - **Limits for us.** These are tweaks to large, already tuned products. A founder's move (a launch post, a directory listing, 20 cold emails) is a different unit, judged without a controlled test. The rates say "most ideas don't work"; they don't give a number for any move we recommend.

13. **The small-bets catalog itself** (`src/lib/smallBetsCatalog.ts`, read 2026-10-27) [derived]
    - 47 bets: evidence "anecdote" for 33, "some" for 14, "strong" for none. The file says stages, minimums and stop signals are "the notes' judgment calls unless a platform sets them."
    - Stop lines are written as thresholds (for example "a handful of tagged visits … after 90 days"), not as the odds of passing them.

14. **What exists for founder-scale moves** (from the notes linked above) [mixed]
    - Cold email reply rates [vendor; platform averages; denominators differ between vendors].
    - First-revenue timing and first channel from 31 developer-tool cases [our coding; survivors only].
    - Paid-ad lift and incrementality ranges (`research/measurement.md`) [research], useful only once a business spends on ads.
    - Not found: how often a Hacker News or Product Hunt launch, a directory listing, community answering or a comparison page produces a first customer for a business with no audience. The open questions in `research/small-bets.md` already say there is no time-to-traction data by channel.

### E. How many predictions it takes to measure calibration [derived]

95% intervals (Wilson score) for a founder whose moves were each given a 30% chance and 30% of them worked:

| Resolved predictions | Worked | 95% interval |
|---|---|---|
| 3 | 1 | 6%–79% |
| 9 | 3 | 12%–65% |
| 20 | 6 | 15%–52% |
| 50 | 15 | 19%–44% |
| 100 | 30 | 22%–40% |

- Telling a well-calibrated 30% from a true 15% (twice too confident) needs about 50 resolved predictions in that bucket (one-sided 5%, 80% power).
- At three moves a run and one run a month, that is well over a year for one business, before splitting by probability level.
- So scoring the advisor's or a founder's calibration from one profile is out of reach. What one profile can do is record each prediction and its outcome, which removes hindsight from the next run and turns a stop line into a decision that actually gets made.

## What this means for the server

1. **The base-rate citation proposed in the assessment has nothing to cite for most moves.** 33 of 47 small bets rest on anecdote, and section D found no published base rate for the founder-scale moves the server recommends most. A check requiring every stop line to cite a base rate would push agents to invent one or to borrow a number with a different denominator (a vendor average, a Microsoft A/B rate). The instructions already warn that tool output is read as instructions; this check would teach the agent to fabricate.
2. **What the evidence does support is narrower.** Writing the stop number before starting reduces escalation (one vignette study, weak). Written records beat memory because hindsight bias is robust and warnings don't fix it (strong phenomenon; the record as a fix is logic, not a tested intervention). Base-rate training improves forecasts by 6–11% in a randomised design, in a domain far from ours (moderate, transfer untested).
3. **The server can produce its own base rates.** If each profile records moves, stop lines and outcomes, the outcomes across a user's profiles become first-party data. Labelled honestly ([our data; n = 7; one user's businesses]) they are the only base rates for these moves that will exist.
4. **Calibration scoring is for later.** It needs about 50 resolved predictions per probability bucket. Ask for a probability now only if it costs one line and is saved; don't score it until the numbers exist.

## Proposed check

Two mechanical changes, one optional. None adds instruction text.

**1. Save predictions in the profile; surface the overdue ones (build first).**
- New profile field `predictions`, merged by `id` (not replaced like other lists, so an agent sending a partial list can't silently erase history):
  `{ id, madeOn, move, metric, stop, checkOn, prior?: { p, source }, outcome?: { recordedOn, result, stopHit: true | false | null, how: "measured" | "recalled" } }`.
  `how` lines up with the intake thread's measured-versus-recalled tag.
- `get_business_profile` returns `duePredictions`: those past `checkOn` with no outcome. The tool note says, plainly: "These moves were due for a decision. Ask what happened before giving new advice; save the result with stopHit." It must also say what it can't check (it doesn't know whether the move was actually run).
- `save_business_profile` refuses an outcome with `stopHit: false` that has no `result` text, so "it worked" can't be saved without the number.
- Test from a real failure: run `get_started` on a profile with a move past its date. I expect today's advisor to give fresh moves without asking, but I have not run it; if it already asks, there is no bug to fix and only the storage part stands.

**2. Base-rate sources in stop lines (only when one is claimed).**
- In `check_answer`, a stop or prior line that states a rate as typical ("the average", "usually", "benchmark", "most launches") goes through the existing labelled-claim matcher. With no matching playbook passage it is flagged: "This base rate has no source in the playbooks. Give its source, or say there is no base rate for this move."
- It never requires a base rate. It only stops one being made up.

**3. Optional: one `Odds:` line per move, saved but not scored.**
- The probability that the move clears its stop line, with the reference class it came from or "no reference class". `lintMoves` would only check it is a number between 5% and 95%.
- Value: it is the input calibration scoring will need in a year. Cost: one more line per move against the word cap, and a number nobody can check yet. I lean against adding it until (1) has collected outcomes.

**Measuring it.** The rubric can't see calibration: eval cases have no outcomes. Add one eval fixture whose profile holds two overdue predictions (one hit its stop line, one unknown). Grade whether the run asks, records the outcome, and changes its advice because of it.

**Dependency.** A stop line like "fewer than 5 of 20" is a prediction too noisy to resolve (the stop-line statistics thread covers this). Check 1 should store `k` and `n` when the stop is a count, so that thread's interval check can run on the outcome.

## Folklore and weak claims

- **"Mellers 2014: training improved accuracy about 10%."** Right size, wrong source. The abstract gives no number. Cite Chang et al. 2016 (6–11% by year, randomised) or the group's 2014 review ("about a 10% advantage").
- **"The base-rate lesson is what made training work."** Chang et al. found it was the principle most associated with accuracy gains within the trained group. That is correlational; the lessons were not tested one at a time.
- **"Reference-class forecasting is proven."** The strong evidence is that inside-view forecasts are too optimistic. Evidence that the method fixes them comes from retrospective project data and abstracts read here, not from controlled trials, and none from marketing.
- **"An LLM that uses base rates makes people forecast better."** In Schoenegger et al. a deliberately base-rate-neglecting assistant also helped. The gain may come from talking to any assistant that gives numbers.
- **"Pre-mortems improve forecasts by 30%."** Already marked unverified in `knowledge/startup-risk-and-opportunity.md`.

## Open questions

- **No base rates for founder-scale moves.** How often does a launch post, listing, answering questions, or a comparison page produce a first customer for a business with no audience? Only logged outcomes (check 1) or a coded case set would answer it. The 31-case set could be recoded for this, but it holds survivors only.
- **Does writing a stop line make founders stop?** Simonson & Staw is one vignette with students. A field test needs the follow-up data that check 1 collects.
- **Do the GJP gains carry over to business forecasts?** No study found. Lovallo et al. 2012 (private equity) is the closest; read the full text.
- **Unread full texts:** Mellers et al. 2014 (results section), Batselier & Vanhoucke 2016 (sample and effect size), Lovallo et al. 2012, Fischhoff & Beyth 1975 (the shift in remembered probabilities), Guilbault et al. 2004 (hindsight meta-analysis effect size).
