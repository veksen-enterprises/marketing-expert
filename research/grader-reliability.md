# Grader reliability for the evaluations (checked 2026-10-27)

Scope: how to measure whether two graders agree on the same advisor answer, how much double-grading that takes, and what to change in `evals/` so "a change beats the spread" has a number under it. Written for the evaluation method, not for a playbook.

Method caveat: the research proxy blocked europepmc, pmc.ncbi.nlm.nih.gov and the PARE generalizability-theory primer. "Read" = primary text or the author's/publisher's abstract page read on 2026-10-27. [secondary] = the claim was seen only in a package manual or encyclopedia that cites the source. [memory] = known from the literature, not re-read this session; check before quoting. [simulated] = computed here (script described in section 6), not taken from a paper. [repo] = counted from files in this repository.

## Sources
1. Miller, E. (2024). "Adding Error Bars to Evals: A Statistical Approach to Language Model Evaluations." arXiv 2411.00640. https://arxiv.org/abs/2411.00640v1 [read: abstract and HTML v1 sections 2–4; sample-size appendices not reached]
2. Gwet, K.L. (2008). "Computing inter-rater reliability and its variance in the presence of high agreement." British Journal of Mathematical and Statistical Psychology 61:29–48. doi:10.1348/000711006X126600. https://agreestat.com/papers/bjmsp2008_interrater.pdf [read]
3. Shankar, V. & Bangdiwala, S.I. (2014). "Observer agreement paradoxes in 2x2 tables: comparison of agreement measures." BMC Medical Research Methodology 14:100. doi:10.1186/1471-2288-14-100 [read]. It restates Feinstein, A.R. & Cicchetti, D.V. (1990), "High agreement but low kappa: I. The problems of two paradoxes," J Clin Epidemiol 43(6):543–549 [original not read; journal details from memory].
4. Hayes, A.F. & Krippendorff, K. (2007). "Answering the call for a standard reliability measure for coding data." Communication Methods and Measures 1(1):77–89. https://www.asc.upenn.edu/sites/default/files/2021-03/Answering%20the%20Call%20for%20a%20Standard%20Reliability%20Measure%20for%20Coding%20Data.pdf [read]
5. Koo, T.K. & Li, M.Y. (2016). "A guideline of selecting and reporting intraclass correlation coefficients for reliability research." Journal of Chiropractic Medicine 15(2):155–163. [secondary: thresholds as given in the R `effectsize` manual, https://r-packages.io/packages/effectsize/interpret_icc; paper not read]
6. Walter, S.D., Eliasziw, M. & Donner, A. (1998). "Sample size and optimal designs for reliability studies." Statistics in Medicine 17(1):101–110. https://experts.mcmaster.ca/scholarly-works/1522974 [read: abstract page only]
7. Cronbach, L.J., Gleser, G.C., Nanda, H. & Rajaratnam, N. (1972). The Dependability of Behavioral Measurements. Brennan, R.L. (2001). Generalizability Theory. Shavelson, R.J. & Webb, N.M. (1991). Generalizability Theory: A Primer. [secondary: https://en.wikipedia.org/wiki/Generalizability_theory; the books were not read; the error formulas in section 3 are textbook G-theory from memory]
8. Zheng, L. et al. (2023). "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena." NeurIPS 2023 Datasets and Benchmarks. https://arxiv.org/abs/2306.05685v1 [read: abstract]
9. Panickssery, A., Bowman, S.R. & Feng, S. (2024). "LLM Evaluators Recognize and Favor Their Own Generations." NeurIPS 2024. https://arxiv.org/abs/2404.13076v1 [read: abstract]
10. Stureborg, R., Alikaniotis, D. & Suhara, Y. (2024). "Large Language Models are Inconsistent and Biased Evaluators." arXiv 2405.01724. https://arxiv.org/abs/2405.01724v1 [read: abstract; no alpha values seen]
11. Briand, L.C., El Emam, K., Freimut, B.G. & Laitenberger, O. (2000). "A Comprehensive Evaluation of Capture-Recapture Models for Estimating Software Defect Content." IEEE Transactions on Software Engineering 26(6):518–540. NRC report: https://www.ehealthinformation.ca/web/default/files/wp-files/2001-A-Comprehensive-Evaluation.pdf [read]

## 1. What the repo's own grades show [repo]

The 21 committed grades (rounds 1–4, contaminated runs excluded; `evals/grades/*.md` and `evals/grades/v*/*.md`) hold 210 item scores. Counted with a regex over the score tables:

| Score | Count |
|---|---|
| 0 | 0 |
| 1 | 66 |
| 2 | 144 |

| Item | 2s of 21 |
|---|---|
| 1 Context first | 19 |
| 2 Asked for numbers | 21 |
| 3 Diagnosis | 12 |
| 4 Right playbook | 13 |
| 5 Tools for numbers | 12 |
| 6 Specific | 21 |
| 7 Focused and ranked | 3 |
| 8 Evidence honesty | 11 |
| 9 Respects vision | 18 |
| 10 Plain language | 14 |

Consequences:
- The 0–2 scale is a 1–2 scale in practice. Totals can only fall between 10 and 20, and committed totals sit between 15 and 18. A "2-point spread" is about half the range the rubric actually uses.
- Items 2 and 6 never varied. They add 4 points to every total and carry no information about the server. Agreement on them cannot be measured (kappa is undefined when both graders give the same score every time).
- Items 1 and 9 are near the ceiling. That is where chance-corrected agreement breaks (section 2).
- Item 7 is near the floor (18 of 21 at 1). The bundled-move fault is real, but the item cannot show a partial improvement.
- The "about 2 points" within-case spread (VISION.md, CLAUDE.md) comes from later rounds whose runs are not committed. I could not check it.
- `evals/README.md` already records one grader effect: "Round-2 graders were stricter on length, evidence labels and plain language, so equal totals hide real changes." That is a whole round's graders shifting together, which double-grading within a round would not detect (section 4).

## 2. Agreement on rubric items: use raw agreement plus AC1, not kappa alone

- Cohen's kappa = (observed agreement − chance agreement) / (1 − chance agreement), with chance agreement taken from each grader's marginal rates. When almost every answer gets the same score, chance agreement is near 1, so kappa is low or unstable even when graders almost always agree. This is the first Feinstein–Cicchetti paradox: "one gets lower kappa values despite high observed agreement" when marginals are imbalanced. [research, 3, read]
- Gwet's AC1 keeps the same form but estimates chance agreement from how spread the ratings are. In his example, raters agree on 94.4% of cases and Scott's pi is slightly negative (about −0.03). In his simulations AC1 has smaller bias than kappa across prevalence levels. [research, 2, read] Shankar & Bangdiwala find AC1 less affected by imbalance than kappa, but prefer a third measure (Bangdiwala's B) over both. [research, 3, read]
- Simulated on this rubric's shape [simulated]: 20 runs, two graders, each grader independently flips a run's true 1/2 score with probability 5%.
  - Item at 95% 2s (like items 1 and 9): raw agreement 0.91, median kappa 0.44, 95% of kappa estimates between −0.11 and 1.00; AC1 median 0.89.
  - Item at 60% 2s (like items 3, 5, 8): raw agreement 0.91, median kappa 0.80 (0.49 to 1.00); AC1 0.82.
  - Same graders, same error rate: kappa halves only because of where the item sits. Kappa on 20 runs per item is close to uninformative either way.
- Krippendorff's alpha handles any number of graders, missing grades and an ordinal metric, and has a bootstrap for "the chance true alpha is below a chosen minimum". It does not fix the prevalence problem: it is chance-corrected in the same way as kappa. The authors set no universal cut-off; the minimum "depends on the research problem". In their example, ordinal alpha was 0.76 and nominal alpha 0.48 on the same data, because most disagreements were one step apart. [research, 4, read]
- For the 0–2 items: report raw agreement, AC1, and each item's score distribution side by side. Read a low kappa on a near-ceiling item as "this item does not discriminate", not as "graders disagree".

## 3. Agreement on totals, and which noise to spend on

- For the 0–20 total, use ICC(A,1): two-way, absolute agreement, single grader. Absolute, not consistency, because a grader who scores everything one point lower changes the "beats the spread" decision. [research, 5, secondary; the choice of the absolute form is mine, from how the totals are used]
- Koo & Li's thresholds: below 0.50 poor, 0.50–0.75 moderate, 0.75–0.90 good, above 0.90 excellent. [secondary, 5; whether they apply these to the point estimate or the 95% CI was not checked]
- How wide the estimate is with two graders per run [simulated, 4,000 draws each]:

| True ICC | 10 runs | 20 runs | 30 runs | 50 runs |
|---|---|---|---|---|
| 0.5 | −0.16 to 0.84 | 0.10 to 0.77 | 0.18 to 0.72 | 0.27 to 0.68 |
| 0.7 | 0.20 to 0.91 | 0.39 to 0.86 | 0.47 to 0.84 | 0.53 to 0.82 |
| 0.85 | 0.52 to 0.96 | 0.66 to 0.94 | 0.71 to 0.93 | 0.75 to 0.91 |

  With fewer than about 20 double-graded runs, "poor" and "good" cannot be told apart. Thirty is the smallest number that separates moderate from good at a true 0.7.
- Walter, Eliasziw & Donner: when reliability is about 0.4 or higher, two or three observations per subject minimise the total number of observations. So two graders on many runs beats five graders on a few. [research, 6, read: abstract]
- Generalizability theory splits observed variance into named sources instead of one error term. Here: case, run within case, grader, and the run × grader residual. A G-study estimates each component; a D-study then asks what error a different design (more runs, more graders) would give. [secondary, 7]
- What that buys here [memory, textbook G-theory]: if each run gets its own fresh grader, the error variance of a case mean over r runs and g grades per run is (σ²_run + σ²_grader)/r when g = 1, and σ²_run/r + σ²_grader/(r·g) in general. If σ²_grader is most of the spread, double-grading halves it at the cost of one extra grade per run. If σ²_run dominates, a second grade buys almost nothing and a fourth run is better. Today nobody knows which, so neither "use 3 runs" nor "use 1 grader" has a basis.

## 4. What a second LLM grader can and cannot show

- Strong LLM judges agreed with human preferences above 80%, comparable to human–human agreement, on MT-Bench and Chatbot Arena; the same paper names position, verbosity and self-enhancement biases. [research, 8, read: abstract] That is pairwise preference on chat answers, not a 10-item checklist with file citations. It does not transfer directly.
- LLM evaluators prefer their own outputs, and the strength of self-preference rises with how well the model recognises its own text. Controlled experiments suggest the link is causal. [research, 9, read: abstract] Here the advisor and the graders are the same model family.
- LLM evaluators gave scores that agreed poorly across repeated samples and moved with prompt changes humans would call trivial. [research, 10, read: abstract; magnitude not seen]
- Mechanism: two graders from the same model and prompt share their biases. Shared bias raises agreement without raising accuracy. Double-grading with the same model measures how much the grader wobbles, not whether it is right. A high ICC between two same-model graders is necessary, not sufficient.
- Round-level drift (README: round-2 graders stricter) is a shift shared by every grade in a round. Within-round double-grading cannot see it. It cancels only when old and new answers are graded in the same batch, by the same grader setup, without the grader knowing which is which. VISION's current fix for drift is an instruction ("grade each run against the rubric alone"); the project's own rule is to fix error classes with checks, not instruction text.

## 5. Comparing two server versions

- Miller recommends computing standard errors that respect clusters, averaging repeated samples within a question before analysis, and running inference on paired, question-level differences between two models rather than on two overall means. Pairing removes the variance from questions being easy or hard for both. Resampling gains flatten quickly; pooling all K×N answers as independent is wrong. [research, 1, read]
- Mapped here: a case is the question, a run is a resample. Compare versions on the per-case difference of 3-run means, then average across cases with a standard error over cases.
- What the current per-case rule can detect [simulated arithmetic, normal approximation]: a 2-point range across 3 runs implies a per-run SD of about 1.2 (expected range of 3 normal draws is about 1.69 SD). The difference between two 3-run means then has an SD of about 1.0.
  - Per case, at 80% power and 5% two-sided, the smallest detectable change is about 2.7 points.
  - Requiring a case to beat 2 points catches a true 1-point gain about 15% of the time, and passes a zero change as a gain about 2% of the time per case. Over 11 cases that is one false "win" every four to five rounds, while most real 1-point gains go unseen.
  - Paired across 6 cases: about 1.1 points detectable. Across 11 cases: about 0.8. This assumes the change helps every case about equally; a change that helps one business type and hurts another needs per-type reporting.
- The rule's real problem is less the threshold than that it judges case by case. The same runs, read across cases, can detect changes about a third the size.

## 6. Errors found, not just scores

- `errors.json` turns grades into error-class counts, which ROADMAP and README compare across rounds. If two graders on the same answer find mostly different errors, those counts mostly measure which grader looked where.
- Capture–recapture estimates how many defects exist from the overlap between independent inspectors. Briand et al. tested it on real inspection data: the models "tend to underestimate", "ought not be used with less than 4 inspectors", and they recommend a model allowing different detection probabilities per defect with the Jackknife estimator. [research, 11, read] With two graders, use the overlap only as a raw number (share of errors found by both), not as a total-error estimate.
- Simulation script: a Python script draws true scores, adds independent grader noise, and computes ICC(A,1), kappa, AC1 and the power figures above. It is not in the repo; it is listed in section 8.

## 7. Proposed change to the evaluation method

Ordered by cost.
1. **Grade blind and interleaved.** For every comparison, grade the baseline runs and the candidate runs in one batch, with file names that hide the round, in shuffled order. This removes round-level drift from the comparison by design, and replaces an instruction with a mechanism. Cost: re-grading baseline runs once per comparison, or keeping the baseline grades from the same batch.
2. **Report the paired comparison.** Per case: difference of run means. Overall: mean difference across cases with a 95% CI (t over cases). Keep per-case numbers for business-type effects. Replace "beats the within-case spread (about 2 points)" in CLAUDE.md step 4.
3. **Measure grader agreement once.** Double-grade one full round, at least 30 runs (11 cases × 3 runs = 33), each by two graders that do not see each other's grade. Report: ICC(A,1) on totals with a CI; per item raw agreement, AC1 and the score distribution; share of `errors.json` entries found by both graders (matched by answer line and class). Then split the spread into run and grader variance. Steady state follows from that split: if grader variance is under about a quarter of the total, double-grade one run in five as a drift alarm; if over half, double-grade every run and average.
4. **Fix the items that cannot vary.** Items 2 and 6 scored 2 in 21 of 21 grades and item 7 scored 1 in 18 of 21. Either write anchors that separate 0/1/2 for each, or drop them from the total and score them as pass/fail checks. Where an item can be checked by a script (word count, banned words, stop-line numbers, fingerprint), take it out of grader judgment entirely.
5. **Check validity once against a different judge.** Agreement between two same-family graders cannot rule out shared bias (section 4). On 6–10 runs, have a grader from another model family, or the owner, score the same rubric, and compare totals. This is a small, one-off sample; it can reveal a large shared bias, not a subtle one.

Check to build (a script, not instruction text): `scripts/grader-agreement.mjs` reads pairs of grade files for the same run (score table and `errors.json`), and prints the numbers in step 3. A test built from two committed grades of the same answer, with hand-computed values, guards it. No such pair exists in the repo yet; the first double-graded fictional-case round would supply one.

## 8. Open questions / could not verify
- Koo & Li thresholds and their sample-size advice are from a package manual, not the paper. Feinstein & Cicchetti were read only through Shankar & Bangdiwala.
- Miller's sample-size formulas (appendices B, C) were not reached.
- G-theory formulas are textbook from memory; the books and the PARE primer were blocked.
- The "about 2 points" spread is not checkable from committed data. Its SD conversion in section 5 assumes normal noise and three runs.
- No study found measures LLM-grader agreement on a multi-item, citation-checking rubric like this one. The LLM-judge papers above cover preferences and summary scores. How noisy these graders are is an empirical question for step 3, not something the literature answers.
- Simulation script: kept outside the repo at `/mnt/project-files/grader-reliability/sim.py` (project shared folder). Seed 1; normal true scores and noise for ICC, independent flips for items.
