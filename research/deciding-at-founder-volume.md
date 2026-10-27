# Before/after stop lines at founder volume: regression to the mean, trends, and what to measure instead (checked 2026-10-27)

Question: `research/stop-line-statistics.md` §3 found that "no change against a baseline" is the worst class of stop line in `evals/runs/` ("hasn't moved after 4 weeks", "no rise above your current weekly baseline", "no movement after 4 weeks"; 5 of 41 lines). Its proposed fix tells the founder how big a lift a 4-week before/after can see. This note asks the next question: besides noise, what biases a before/after at 5–100 events a week, which designs remove them, and what should `check_answer` say?

Method: sources below; simulations are my own (Poisson weekly counts, 200,000 draws, seed 1 and 2; scripts kept outside the repo at `/mnt/project-files/next-research-round/`). Access marks: [read] full text or abstract seen this session; [secondary] seen only through slides or a page that cites it; [own sim] computed here. Tags: [research] peer-reviewed or working paper; [methods standard] a review body's design rules; [derived] my inference.

## Sources

1. Barnett, A.G., van der Pols, J.C. & Dobson, A.J. (2005). "Regression to the mean: what it is and how to deal with it." *International Journal of Epidemiology* 34(1):215–220. doi:10.1093/ije/dyh299. https://pubmed.ncbi.nlm.nih.gov/15333621/ [read 2026-10-27: abstract; author names from the search listing, not the PubMed page]. Regression to the mean "can make natural variation in repeated data look like real change." It grows "with increasing measurement error" and "when follow-up measurements are only examined on a sub-sample selected using a baseline value." Fix at the design stage or in the analysis.
2. Wagner, A.K., Soumerai, S.B., Zhang, F. & Ross-Degnan, D. (2002). "Segmented regression analysis of interrupted time series studies in medication use research." *Journal of Clinical Pharmacy and Therapeutics* 27:299–309. https://library.alnap.org/system/files/content/resource/files/main/segmented-regression-wagner-2002.pdf [read 2026-10-27]. "A general recommendation is for 12 data points before and 12 data points after the intervention", not derived from power; "a minimum of 100 is desirable" observations per data point; seasonality "usually requires at least 24 monthly data points"; other changes made at the same time can only be separated with a control group.
3. Bojinov, I., Simchi-Levi, D. & Zhao, J. "Design and Analysis of Switchback Experiments." arXiv 2009.00148 (v4, 2025). https://arxiv.org/abs/2009.00148v4 [read 2026-10-27: abstract and the design results; section 6 not reached; journal version not checked]. A switchback randomises one unit between treatment and control over time. Carryover is "the length of time a treatment persists in impacting the outcome". Practitioners "should set each period to be almost as long as the order of the carryover effect"; when unsure, choose a period slightly longer than the carryover rather than shorter.
4. Kratochwill, T.R., Hitchcock, J., Horner, R.H., Levin, J.R., Odom, S.L., Rindskopf, D.M. & Shadish, W.R. (2010). *Single-case designs technical documentation* (v1.0, pilot). What Works Clearinghouse. https://ies.ed.gov/ncee/WWC/Docs/ReferenceResources/wwc_scd.pdf [read 2026-10-27, pp. 7, 15–16] [methods standard]. A design needs "at least three attempts to demonstrate an intervention effect". Reversal (ABAB): four phases, at least 5 points each (3 "with reservations"). Multiple baseline: intervention "staggered across time", at least three baselines. Alternating treatments: five repetitions of the sequence (four with reservations).
5. Fleming, T.R. & DeMets, D.L. (1996). "Surrogate end points in clinical trials: are we being misled?" *Annals of Internal Medicine* 125(7):605–613. [secondary: citation from healthyskepticism.org/global/library/item/2097; the four failure reasons from DeMets's slides, https://depts.washington.edu/ssbiost/PRESENTATIONS/DeMets.pdf, read 2026-10-27; the paper itself not opened]. A surrogate fails when it is not on the causal path of the outcome, when the treatment works through other paths too, when it is not on the path of the treatment's effect, or when the treatment acts independently of it. The slides' example is CAST, where drugs that suppressed an arrhythmia were stopped early.
6. Athey, S., Chetty, R., Imbens, G.W. & Kang, H. (2019). "The Surrogate Index: Combining Short-Term Proxies to Estimate Long-Term Treatment Effects More Rapidly and Precisely." NBER WP 26463. https://www.nber.org/papers/26463 [read 2026-10-27: abstract page]. Short-term proxies stand in for a long-term outcome only under a surrogacy assumption (the outcome is independent of the treatment once the proxies are known). In a job-training experiment, six quarters of proxies cut the standard error of the nine-year employment effect by about 35%.
7. `research/stop-line-statistics.md` §3 and `research/measurement.md` [in repo]: the detectable-lift figures for 4-week before/after comparisons, and Gordon et al.'s finding that before/after designs missed RCT lift.
8. Own simulations, 2026-10-27 [own sim]. Figures in sections 1–3.

Not opened: Bernal, Cummins & Gasparrini (2017) ITS tutorial (blocked by a browser check); CAST results papers; the switchback paper's section 6.

## 1. Founders change things after a bad week, and the next weeks look better anyway

- A founder usually acts when a number dips. That is selecting on the baseline, which is when regression to the mean is largest [1].
- Simulated with no true effect: weekly sign-ups vary by chance around a steady rate; the founder changes something in a week that is the lowest of the last eight, then compares the next 4 weeks [8]:

| Steady rate | The "bad week" averages | Next 4 weeks show 30%+ "lift" vs the bad week | vs the 4 weeks ending with the bad week | Reference: two random 4-week blocks |
|---|---|---|---|---|
| 5 a week | 2.3 | 87% | 29% | 21% |
| 10 a week | 6.0 | 79% | 18% | 12% |
| 25 a week | 18.4 | 59% | 5% | 3% |

- So a stop line like "no rise above your current weekly baseline" passes most changes that do nothing, when "current" is the week that prompted the change. Using a 4-week average shrinks the bias but does not remove it, because the bad week is still inside it.
- Fix by design: fix the baseline window before looking at the week that prompts action, or compare against a period chosen at random (section 3) [1; derived].

## 2. A growing or fading product biases a before/after in either direction

- With no true effect, at 10 sign-ups a week, a 4-week before/after flags a significant rise (two-sided 5%) 3% of the time when the rate is flat, 8% when it grows 3% a week, 16% at 5% a week [8].
- After a launch the rate usually fades (`research/app-store-featuring-and-launch.md`: "a feature is a spike, not a baseline"). With a 5% weekly decline, a change that truly lifts sign-ups by 73% shows up 36% of the time, against 80% with a flat rate [8].
- So "no movement after 4 weeks" right after a launch mostly measures the launch fading. The stop line drops changes that work.
- Interrupted time series is the textbook fix for trends, but its usual floor is 12 points before and 12 after, with about 100 observations per point [2]. Founder data rarely has 12 stable weeks before the change, and never 100 sign-ups a week at stage 0–1. It does not apply here [derived from 2].

## 3. Alternating weeks remove the bias but not the noise

- Random alternating periods (a switchback [3]; "alternating treatments" in single-case designs [4]): the founder flips a reversible change on and off, and a coin decides which weeks get it.
- With no true effect, over 8 weeks with 4 chosen at random: false "lift" stays at 2.6–3.5% whether the rate is flat, growing or fading. Under a 5% weekly decline, a true 73% lift is seen 72% of the time instead of 36% [8].
- What it does not fix: noise. Over 4 weeks per arm, the smallest lift seen 4 times in 5 (two-sided 5%) is about +110% at 5 events a week, +73% at 10, +44% at 25, +30% at 50, +21% at 100, +13% at 250, +6% at 1,000 [8; matches `research/stop-line-statistics.md` §3]. That depends on the event count, not on the design.
- Periods should be at least as long as the carryover [3]. A headline or onboarding-email change for new visitors carries over little, so weekly periods are safe. Anything people remember or share (a price change, a launch, a community post) carries over for good, and cannot alternate [derived from 3].
- For changes that cannot be undone, the single-case answer is a multiple baseline: start the change at different times on at least three separate units [4]. A founder rarely has three comparable pages, segments or markets. When they don't, say there is no clean test and the call is a judgment [derived].
- Fairness: alternating a price between weeks is a design choice with customer and legal effects, not just a statistical one. Not proposed for prices [derived].

## 4. A higher-count step shrinks the noise only if the change acts through it

- At 10 sign-ups a week, 4 weeks can see only a +73% lift [8]. If the same page gets 200 visits a week and 25% click "Start", the click count is 50 a week and +30% becomes visible [8].
- That only helps if the change works through that step. A headline change that raises clicks may leave sign-ups flat if people drop at the next screen. This is the surrogate problem from clinical trials: an effect on a proxy is not an effect on the outcome when the change also acts by other paths, or when the proxy is not on the outcome's path [5].
- A formal surrogate index needs long-term outcome data on past experiments to validate it [6]. Founders don't have that. The usable rule is narrower: use the earlier step only when the change targets that step (a headline targets the click; an onboarding email targets activation), and still record the final count [derived from 5, 6].

## 5. What this does not fix

- Event counts at founder volume. No design detects a 20% lift at 10 events a week in a month. The honest output is the size of change the test can see.
- Seasonality and outside events (a competitor's launch, a mention on Hacker News) during the test. Random alternation balances them on average; with 8 weeks and one spike week, it can still land in one arm.
- Every figure here models Poisson noise only. Real weekly counts swing more than Poisson (weekday mix, one big referrer), which makes every threshold above worse [derived].

## 6. Proposed check (not built)

In `lintMoves`, for stop lines that compare against a baseline ("hasn't moved", "no rise", "no lift", "doesn't improve", "flat"):

1. **Issue: the baseline is not fixed.** No number for the baseline, or "current" with no window: "Write the baseline as a number from a fixed window before the change (sign-ups per week, average of the 4 weeks before you decided). A change made after a bad week looks like it worked even when it did nothing." Test cases: the five baseline lines in `evals/runs/` listed in `research/stop-line-statistics.md` §3.
2. **Note: what the test can see.** When the move or profile gives a weekly count (`traction`, `metrics`, or a number in the move), print the smallest lift a 4-week before/after sees 4 in 5 times at that count, from the table in section 3. Say what was not checked: trend, launch fade, the week that prompted the change.
3. **Note: a design that removes the bias, only for reversible changes.** When the move changes copy, a page or an onboarding message: "If you can switch it back, alternate it by week and flip a coin for which weeks; compare the two sets. That removes trend and bad-week effects, not noise." Never for prices, launches, posts or listings.
4. **Note: a higher-count step, only when the change targets it.** "At this volume, also count <the step this change targets>; it has more events. A rise there is not a rise in <outcome> until the outcome moves too."

Never an issue: a small count by itself. Asking for more volume pushes the agent to inflate numbers, the same reason `research/stop-line-statistics.md` §2 gives for not demanding a bigger n.

## Open questions

- Do founders actually change things after a bad week? The mechanism is standard [1]; the founder trigger is assumed. The predictions record proposed in `research/forecasting-and-calibration.md` would show it, if it saves the week's numbers at decision time.
- How much more than Poisson do real weekly counts at 5–50 a week vary? No founder data found. An estimate from public build-in-public dashboards would set the size of the penalty in section 5.
- Bernal et al. 2017 (ITS tutorial) and the switchback paper's practical section were not read.
- Fleming & DeMets read only through slides; the CAST numbers were not checked.
