# Does taking the outside view make business forecasts more accurate outside the lab? (checked 2026-10-27)

Question: `research/forecasting-and-calibration.md` (open questions; §B) left two gaps. Does reference-class forecasting (predicting from the outcomes of similar past cases) improve real business forecasts, and by how much? And which form works: one close analogue or many? The answer decides whether `check_answer` should ask each move to say how often similar moves worked for others, and whether a prediction in the business profile (`src/lib/profile.ts`) should store that base rate.

Hop 0 from seed (open questions in `forecasting-and-calibration.md`). Access marks as in `founder-test-samples.md`. The egress proxy blocked Wiley, ResearchGate and the PMI full text; pages were read through a fetch tool that summarises, so treat figures as one level weaker than a direct PDF read.

Already covered, not repeated: Flyvbjerg 2006 (overrun sizes; method claim thin), Batselier & Vanhoucke 2016 abstract, Chang et al. 2016 (training with base rates, 6–11% Brier gain), Schoenegger et al. 2025: `forecasting-and-calibration.md` sources 1–7. Founder overconfidence: `startup-risk-and-opportunity.md`.

## Sources

1. Lovallo, D., Clarke, C. & Camerer, C. F. (2012). "Robust analogizing and the outside view: Two empirical tests of case-based decision making." *Strategic Management Journal* 33(5):496–512. doi:10.1002/smj.962. Caltech record https://authors.library.caltech.edu/records/ayatf-66x08 [abstract-only, 2026-10-27; full text not reachable: Wiley returned an error, the Caltech record is metadata-only, ResearchGate blocked]
2. Epstein, D. (2019). *Range*. Riverhead. Passage on source 1's private-equity study, seen as a reader's highlight: https://www.goodreads.com/notes/44000528-range/31502753-colin-thomas/485a5bc7-7071-463c-806e-efb5e6e2cee4 [snippet-only; secondary account]
3. McKinsey & Company, "How to take the 'outside view'" (interview with D. Lovallo). https://www.mckinsey.com/business-functions/strategy-and-corporate-finance/our-insights/how-to-take-the-outside-view [read 2026-10-27; practitioner interview, secondary to source 1]
4. Goodwin, P., Dyussekeneva, K. & Meeran, S. (2013). "The use of analogies in forecasting the annual sales of new electronics products." *IMA Journal of Management Mathematics* 24(4):407–422 (volume and pages from memory, unchecked). Accepted manuscript: https://cronfa.swansea.ac.uk/Record/cronfa43560/Download/0043560-24082018124109.pdf [read 2026-10-27]
5. Green, K. C. & Armstrong, J. S. (2007). "Structured analogies for forecasting." *International Journal of Forecasting* 23(3):365–376 (volume from memory). https://repository.upenn.edu/marketing_papers/166 [abstract-only, 2026-10-27]
6. Theising, E., Wied, D. & Ziggel, D. (2023). "Reference class selection in similarity-based forecasting of corporate sales growth." *Journal of Forecasting* 42(5):1069–1085. Preprint: https://arxiv.org/pdf/2107.11133 [read 2026-10-27, preprint version]
7. Servranckx, T., Vanhoucke, M. & Aouam, T. (2021). "Practical application of reference class forecasting for cost and time estimations: Identifying the properties of similarity." *European Journal of Operational Research* 295(3):1161–1179. doi:10.1016/j.ejor.2021.03.063 [abstract-only, 2026-10-27]
8. Bayram, S. & Al-Jibouri, S. (2016). "Efficacy of estimation methods in forecasting building projects' costs." *Journal of Construction Engineering and Management* 142(11). doi:10.1061/(ASCE)CO.1943-7862.0001183 [abstract-only, 2026-10-27]
9. UK Department for Transport (2021). "Updating the evidence behind the optimism bias uplifts for transport appraisals." https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/983759/updating-the-evidence-behind-the-optimism-bias-uplifts-for-transport-appraisals.pdf [read 2026-10-27; government review]
10. Yang, M.-J., Gaulin, M. & Seegert, N. (2022). "Why is Entrepreneurial Overconfidence (So) Persistent? Evidence from a Large-Scale Field Experiment." Working paper, marked "Preliminary and incomplete". https://www.nathanseegert.com/papers/YangGaulinSeegert.pdf [read 2026-10-27; tables of effects not in the text the tool returned]

## 1. Lovallo et al. 2012: what can be said without the full text

- Private-equity investors: a reference class of analogies "performs better than a few analogies familiar to the decision maker." Film revenue: similarity-based forecasting beat regression. [research, 1, abstract-only; no sizes seen]
- The secondary account says investors from large private-equity firms rated their own deal about 50% higher than comparable outside deals, then cut their estimates when asked to revise. [research, 2, snippet-only; secondary]. That describes an estimate moving, not an estimate checked against realised returns. Whether the paper scored accuracy against outcomes in Study 1 was not seen. [derived]
- Film: in an interview, Lovallo gives a mean residual error of 25% for regression plus similarity ratings, against a studio head's "one hundred percent", and says the studio used one analogy, at most two. [practitioner, 3; interview, not the paper's tables]
- So the most-cited business test of the outside view is, as far as this session could see, a revision study plus a film model. No stated accuracy gain from the paper itself. [derived]

## 2. Many analogues beat one; the "closest" single one is no better than a random one

- New consumer electronics, annual US sales, Bass curves taken from earlier products. Error (scaled absolute error, weighted mean): one randomly chosen analogue 69.3%; nearest single analogue 64.9%; average of 5 nearest 53.4%; average of all analogues 53.3%; best analogue picked in hindsight 30.1%. [research, 4, read; 21 target products, 23 analogues; no human forecasters; market size taken from actual sales, which flatters every method]
- Averaging 5 instead of relying on 1 random analogue cut error by about a fifth: 53.4 / 69.3 = 0.77. [derived from 4]
- Picking the most similar single analogue was not significantly better than a random one (p = 0.33). Gains from adding analogues flattened after 5 or 6. [research, 4, read]
- Experts forecasting decisions in eight conflicts: 32% correct unaided, 46% with structured analogies, 60% for experts who named two or more analogies and had direct experience of the closest. [research, 5, abstract-only; conflicts, not sales; participant count not seen]
- Firm sales growth: classes built from firms close on a predictor (past margin change) gave better-calibrated forecast distributions than industry-group classes at 1 to 10 years. Class size "does not influence the results substantially" (minimum 20 firms). [research, 6, read; 21,808 US listed firms, 1950–2019; calibration, not point error]
- Project cost and time: more similarity properties raise accuracy but shrink the class and make it less reliable. [research, 7, abstract-only; 52 projects]

## 3. Field evidence that an outside-view adjustment improves accuracy

- Construction: on 104 held-out Turkish public building projects, reference-class forecasting and regression "seem to produce more accurate and realistic forecasts" than unit-cost, client and contract-sum estimates. [research, 8, abstract-only; 420 projects; no error sizes seen]
- The UK government review lists such comparisons (420 Turkish buildings, 56 construction projects, 9–10 offshore wind farms, 11 water projects) and calls the method "best practice". It does not test whether the UK's own 2004 uplifts made later cost forecasts more accurate. [research, 9, read; review]
- No field test was found of giving founders or marketers a base rate and scoring their later forecasts. [derived; searches on entrepreneurs, base rates and revenue forecasts]
- Nearest test: about 1,000 Utah small firms forecast monthly revenue growth for 13 months. Control firms overestimated by a median 5 points a month. Showing each firm its own last forecast and actual result was "basically ineffective" against overestimation. Firms instead blamed outside factors. No arm gave peer or base-rate data. [research, 10, read; field RCT; preliminary working paper; effect tables not seen]

## What this changes

1. **`check_answer`: no base-rate requirement. Changes nothing.** The result asked for (a field gain of a stated size in business forecasts) was not found. The sized gains are a 21-product sales model and project cost data. Neither covers marketing moves at zero to ten customers. `forecasting-and-calibration.md`'s finding stands: a required base rate would push the agent to invent one. Saved runs already write "That threshold is my judgement, not a benchmark" (`evals/runs/`), which is the honest form.
2. **Profile `predictions`: no `prior` or base-rate field.** Nothing to store for most moves. Source 10 adds a caution: the due-prediction follow-up, which shows the founder their own miss, did not by itself reduce optimism in the one field test. The record still removes hindsight; it should not be sold as a debiasing tool. [derived]
3. **One playbook claim, `knowledge/startup-risk-and-opportunity.md`, "Founder overconfidence".** "When you guess what a move will bring from what others got, average five or so similar examples, not one. In one study, picking the single most similar product was no better than picking one at random, and averaging five cut the error by about a fifth [research; 21 consumer-electronics products; sales curves, no human forecasters]." Traces to source 4. Test: `npm test` passes (consistency test), and the claim's bracket keeps the 21-product qualifier.
4. **Not proposed:** a check that flags a stop line built from one named example ("Tool X got 500 signups from its launch, so stop under 50"). No saved run does this, so there is no failing answer to build a test from. Revisit if one appears.

## What this does not settle

- Lovallo et al. 2012's private-equity effect size, and whether Study 1 scored accuracy against realised returns. Full text not reached.
- Whether an outside-view prompt changes founders' forecasts in the field. Source 10's arms gave own-error feedback and a scientific-method course, not base rates.
- Source 4 used actual market size for the targets; real forecasts would err more for every method. One product category, one country.
- Construction comparisons were seen as abstracts; their error sizes are unchecked.
