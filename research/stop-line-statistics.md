# Stop lines at founder scale: what small samples can and can't decide (checked 2026-10-27)

Question: `check_answer` (via `src/lib/moveCheck.ts`) only asks that a move's stop line contain a number. Can a stop line like "fewer than 5 of 20 agree" decide anything, and what should the tool check?

Method: sources below; operating characteristics computed with an exact binomial (own script, 2026-10-27). Stop lines taken from the saved advisor answers in `evals/runs/` (v2–v4 and round 1; 41 unique lines). Access marks: [read] full text or abstract seen this session; [in repo] already cited in another note; [snippet-only] only a search summary seen.

## Sources

1. Simon, R. (1989). "Optimal two-stage designs for phase II clinical trials." *Controlled Clinical Trials* 10:1–10. https://eclass-b.uoa.gr/modules/document/file.php/MATH301/PracticalSession1/Simon_PhaseII.pdf [read 2026-10-27]. A design names an uninteresting rate p0, a target rate p1, the chance α of passing a p0 drug and the chance β of dropping a p1 drug. The trial stops after stage one "and reject[s] the drug if r1 or fewer responses are observed." Tables use (α, β) of (0.10, 0.10), (0.05, 0.20), (0.05, 0.10); α = β = 0.05 is called too large for most phase II trials. Typical (p0, p1): (0.05, 0.20), (0.05, 0.25), (0.10, 0.25).
2. Agresti, A. & Coull, B. (1998). "Approximate is better than 'exact' for interval estimation of binomial proportions." *The American Statistician* 52(2):119–126. https://math.unm.edu/~james/Agresti1998.pdf [read 2026-10-27]. Exact (Clopper–Pearson) intervals cover more than their nominal level, because the binomial is discrete; the Wald interval covers less. The Wilson score interval "can be recommended for use with nearly all sample sizes and parameter values."
3. Brown, Cai & DasGupta (2001). "Interval Estimation for a Binomial Proportion." *Statistical Science* 16(2):101–133. [in repo: research/activation-and-analytics.md item 32; abstract]. Wald coverage is erratic; recommends Wilson or Jeffreys for small n.
4. Hanley & Lippman-Hand (1983). "If nothing goes wrong, is everything all right?" *JAMA* 249(13):1743–1745. [in repo: research/activation-and-analytics.md item 33; snippet-only]. Zero events in n: the 95% upper bound is about 3/n.
5. Armitage, McPherson & Rowe (1969). "Repeated significance tests on accumulating data." *JRSS A* 132:235–244. Seen via Gluud & Thorlund, James Lind Library commentary (2025), https://www.jameslindlibrary.org/?p=22624 [read 2026-10-27; the 1969 paper itself not opened]. The commentary quotes McPherson (1974): ten unadjusted looks at accumulating data raise a nominal 5% false-positive rate to nearly 20%.
6. Johari, Pekelis & Walsh (2022). "Always Valid Inference." *Operations Research*. [in repo: `src/lib/sequential.ts`, the `ab_test_sequential` tool].
7. Nielsen, J. & Landauer, T. (1993). "A mathematical model of the finding of usability problems." *Proc. INTERCHI '93*, 206–213. https://course.ccs.neu.edu/is4800/ssl/nielsen93.pdf [read 2026-10-27; PDF text partly garbled]. Share of problems found by i users: 1 − (1 − λ)^i. Mean λ across their studies: 0.31, and λ varies a lot between studies.
8. Own calculations, 2026-10-27 (exact binomial; Poisson normal approximation for counts). Figures in sections 1–3.

Not opened: Fleming (1982) single-stage design, A'Hern (2001) exact single-stage tables (*Stat Med* 20:859–866). Both are the one-stage version of source 1; nothing below depends on them.

## 1. The interval is the wrong question; the rule's error rates are the right one

- A stop line is a decision rule fixed in advance, not an estimate. The question is how often it drops an idea that works and keeps one that doesn't. Phase II trials frame exactly this: p0, p1, α, β, then n and a cut-off [1].
- "Fewer than 5 of 20" stops on 4/20. The exact 95% interval for 4/20 is 6–44% (for 5/20, 9–49%) [8]. That width is real, but it is the wrong yardstick: it says what 4/20 tells you about the rate afterwards, not how well the rule sorts ideas.
- The same rule's error rates [8]: true rate 10%, it stops 96% of the time; 15%, 83%; 20%, 63%; 30%, 24%; 40%, 5%. So it does separate a 15% idea from a 40% one (17% and 5% error). What it can't do is separate 15% from 25%.
- Correction to the claim that started this note: "can't tell a 15% idea from a 40% one" is wrong for this rule. The weak spot is ideas within about 15 points of each other.

Band each rule sorts correctly 4 times in 5 (α = β = 0.20) [8]:

| Stop line (as written in answers) | Dropped 4 in 5 at or below | Kept 4 in 5 at or above | Exact 95% CI at the stop boundary |
|---|---|---|---|
| fewer than 3 of 5 succeed ("3 of 5 can't explain it") | 33% | 67% | 5–85% (2/5) |
| none of 3 | 7% | 42% | 0–71% |
| fewer than half of 10 | 33% | 58% | 12–74% (4/10) |
| fewer than 3 of 10 | 16% | 38% | 3–56% (2/10) |
| none of 10 | 2% | 15% | 0–31% |
| fewer than 3 of 20 | 8% | 20% | 1–32% |
| fewer than 5 of 20 | 16% | 31% | 6–44% (4/20) |
| fewer than 10 of 100 | 7% | 12% | 4–16% |
| no replies in 50 | under 1% | 3% | 0–7% |

- Sample size for a chosen gap, α = β = 0.20, single stage [8]: 5% vs 20% needs 14 (stop below 2); 10% vs 30%, 14 (below 3); 10% vs 25%, 21 (below 4); 20% vs 40%, 19 (below 6); 5% vs 15%, 28 (below 3); 2% vs 6%, 71 (below 3). Tightening to α = β = 0.05 multiplies n by about 3.
- α = β = 0.20 is looser than any design in Simon's tables [1]. It fits founder tests because the next step is usually cheap and reversible; that fit is a judgement, not something the sources test.

## 2. Five users are for finding problems, not measuring a rate

- "If 3 of 5 can't explain it, rewrite" appears twice in the runs. As a rate rule it only separates 33% from 67% [8].
- As a discovery test it does fine: at λ = 0.31, five users show about 84% of the problems [7, 8]. λ varies widely between studies [7], so 84% is an average, not a promise.
- The action ("rewrite") is cheap, so a noisy rule costs little. Pushing the agent to 20 interviews for a headline check would be the worse outcome. The check should report the band, not demand a bigger n.

## 3. What the saved answers actually write

Of 41 unique stop lines in `evals/runs/`:

- **Count of n** (binomial; section 1 applies): about 8. "3 of 5", "fewer than 3 of 10", "fewer than half the testers" (n given elsewhere in the move), "0 runs after two rounds".
- **A rate with no count**: 5. "fewer than 10% of launch signups" (×3), "fewer than 30% of watches fire", "less than about half of screenshots". 10% of 8 signups and 10% of 800 are different decisions; the line doesn't say which.
- **No change against a baseline**: 5. "hasn't moved after 4 weeks", "no rise above your current weekly baseline", "impressions don't rise after a full recrawl", "no movement after 4 weeks". This is the worst class. A plain before/after comparison of 4-week totals sees a lift 4 times in 5 only if the lift is at least about 110% at 5 sign-ups a week, 73% at 10, 44% at 25, 21% at 100 [8; Poisson noise only, two-sided 5%; week-to-week swings and the lack of a control make it worse]. At founder volumes "no movement" is the expected result even when the change works, so the rule leans toward false stops.
- **Vague words**: the rest ("most", "almost no", "near zero", "keeps running clearly less often").

The current check passes all of the vague and baseline lines above. `HAS_NUMBER` in `src/lib/moveCheck.ts` accepts any digit and the words "above", "zero" and "two", so the time box ("after 4 weeks", "in two weeks") or the word "above" satisfies it. Checked 2026-10-27 by running the regex on seven of these lines: all seven passed.

## 4. Looking early

- A stop line read once at n is valid as computed. Founders look after every reply. Acting on an unplanned early look ("0 of 8 so far, stop") inflates errors; ten unadjusted looks take a nominal 5% to nearly 20% [5].
- One early stop is free: stop once the result can no longer change. For "fewer than 5 of 20": stop at 0 yeses after 16 asks, or continue as soon as 5 say yes. Error rates are unchanged, because the outcome was already settled [8; deterministic curtailment].
- Simon two-stage designs [1] or always-valid tests [6] allow real early stopping, at the cost of a design step. For a 20-person test that is more machinery than the decision is worth; `ab_test_sequential` already covers the high-volume case.

## 5. What this does not fix

- Every number above assumes the n people are independent and drawn from the buyers you'd sell to. Founder tests usually aren't: friends, one Discord, people who already replied. That bias is likely larger than the sampling noise, and no rule on n catches it. For hypothetical bias, see research/early-stage-gtm-devtools.md item 110.
- No eval round graded stop lines for statistical sense. The rubric (`evals/rubric.md` item 7) only asks that a stop condition exist. So there is no measured error rate for this class yet, only the counts in section 3.

## 6. Proposed check (not built)

In `lintMoves`, on each move's stop line:

1. **Issue: the only number is the time box.** Strip durations ("after 4 weeks", "in two weeks", "7-day") and the time-box value before applying `HAS_NUMBER`; drop "above"/"below" as numbers on their own. Test cases: the seven lines in section 3, all from `evals/runs/`.
2. **Issue: a rate with no count.** "N% of X" or "half of X" with no "of <number>" and no count elsewhere in the move: "Say how many it is out of (fewer than 3 of 30 signups), or the count you'll wait for before judging."
3. **Issue: no change against a baseline** ("hasn't moved", "no rise", "doesn't improve") with no baseline number and no size of change: "Say the baseline and the change that counts. At 10 a week, a 4-week before/after only shows a lift of about 70% or more."
4. **Note, not issue: the band for "c of n" rules.** Exact binomial, α = β = 0.20: "Stop line 'fewer than 5 of 20': drops an idea whose real rate is 16% or less 4 times in 5 and keeps one at 31% or more 4 times in 5; in between it's close to a coin toss. You can stop early at 0 yeses after 16 asks. Checked: sampling noise only. Not checked: whether the 20 are buyers like the ones you'll sell to." Never an issue: a wide band on a cheap test is fine (section 2), and the agent would respond by inflating n.
5. **Not proposed:** printing confidence intervals (section 1), a minimum n, or sequential designs (section 4).

Wording follows the repo rule that tool output must say what was not checked.

## Open questions

- Does item 1 reduce vague stop lines in the next eval round, or do agents swap in another filler number? Needs a round with a grader column for "stop line decides something".
- Whether α = β = 0.20 is the right default band. Nothing here tests it against founder outcomes.
- Fleming (1982) and A'Hern (2001) not opened; the single-stage numbers here are computed directly, so they don't depend on those tables.
