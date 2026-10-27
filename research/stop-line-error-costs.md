# Which error rates a stop line should be judged by (checked 2026-10-27)

Question: `stop-line-statistics.md` §6 item 4 proposes a band note for "c of n" stop lines at α = β = 0.20, borrowed from phase II trial tables, and its open questions say nothing tests that default. What should set the band for a founder's test, and what should the note say about the zone in between?

Builds on: stop-line-statistics.md §1 (Simon 1989 designs, the band table); small-bets.md item 4 (Azevedo et al. 2020: with fat-tailed returns, run more, smaller tests). Not repeated.

Access marks as in `founder-test-samples.md`.

## Sources

1. Feit, E. M. & Berman, R. (2019). "Test & Roll: Profit-Maximizing A/B Tests." *Marketing Science* 38(6):1038–1058. doi:10.1287/mksc.2019.1194. Preprint arXiv:1811.00457v2, https://arxiv.org/pdf/1811.00457 [read 2026-10-27, preprint; journal volume and pages from memory, unchecked]
2. Heath, C. (1995), see `stop-rules-follow-through.md` source 2 [read 2026-10-27].
3. Own calculation, 2026-10-27: exact binomial, rule "fewer than 5 of 20", break-even rate 22.5% (the rule's midpoint). [derived]

## 1. Error rates matter only weighted by what the error costs

- Feit & Berman pick test size to maximise profit over the test plus the rollout, instead of fixing α and β. The cost of choosing the worse option is the difference between the options, so a mistake between two near-equal options costs almost nothing. "The lost profit (regret) from errors in treatment selection is small when treatment effects are small." [research, 1, read]
- Their tests are far smaller than significance-test sizes: website example 2,284 per arm against 18,468; display ads 11,391 against 4,782,433. They accept choosing the worse option 6–10% of the time and lose 0.2–1.7% of the possible profit, against 0.9–17.5% for the significance-test plan. [research, 1, read; simulated with priors from real tests; one firm's data per example]
- The best test size rises only with the square root of the population it rolls out to (n* ≤ √N·s/2σ). A founder rolling out to a few hundred people should run a small test. [research, 1, read; derived for the founder case]

## 2. The same arithmetic on a founder's stop line

"Fewer than 5 of 20", assuming the idea is worth keeping above 22.5% and value rises in step with the rate [3]:

| Real rate | Stops | Wrong call | Expected loss (wrong call × distance from 22.5%), rate points |
|---|---|---|---|
| 10% | 96% | 4% | 0.5 |
| 15% | 83% | 17% | 1.3 |
| 20% | 63% | 37% | 0.9 |
| 25% | 42% | 42% | 1.0 |
| 30% | 24% | 24% | 1.8 |
| 40% | 5% | 5% | 0.9 |

- The rule is close to a coin toss at 20–25%, and that is where its mistakes cost least: an idea at 25% kept or dropped is close to break-even either way. The loss peaks around 30%, a clearly good idea dropped one time in four. [3]
- So "in between it's close to a coin toss" (the wording stop-line §6 item 4 proposes) reads as a warning, and is mostly not one. What a founder needs from the note is where the expensive mistake sits. [derived]

## 3. Where proportional value breaks

- **Lopsided bets.** Value is not proportional to the rate when one hit matters (a post that might spread, a partner who might say yes). Section 2's comfort does not apply; the small-bets catalogue already says to run all tries and judge by the best (`HOW_TO_REPORT`, `src/lib/smallBets.ts`). [derived; small-bets.md item 4]
- **Dropping is usually final.** Founders rarely restart a dropped test; budgets also push people to quit early on spend alone [2]. A kept idea gets another look at the next stop line. That argues for erring towards keeping (smaller β than α) when the test is cheap. [derived from 2; no study of founder restarts found]
- **Keeping costs hours.** When the next stage is expensive (paid ads, a hire), keeping a bad idea is the costly error, and the phase II framing (control α) fits. [derived; stop-line-statistics.md source 1]

## 4. What this means for the tool

1. **Band note (stop-line §6 item 4, unbuilt): keep the band computation, change the words about the middle.** Replace "in between it's close to a coin toss" with the costly error: "Between 16% and 31% it can go either way, but there the idea is close to break-even, so a wrong call costs little. The costly mistake is dropping an idea at 31% or more, which this rule does at most 1 time in 5." The keep boundary's drop chance is β by construction, so the note needs no new computation, only the different sentence. Same checked/not-checked line as proposed.
2. **Keep α = β = 0.20 as the printed band.** No source supports a better single default; section 3 says the right asymmetry depends on what comes after the test, which the tool doesn't know. Printing the drop chance at the keep boundary lets the agent apply it.
3. **Not proposed:** a profit-maximising sample size calculator for founder tests. It needs a prior on effect sizes (σ), which founders don't have; Feit & Berman fit it from a firm's past tests.

## 5. What this does not settle

- "Value rises in step with the rate" is an assumption. For signups to a free product, revenue is not proportional to the signup rate.
- The 22.5% break-even is the rule's midpoint, picked for illustration. A founder's real break-even is whatever rate makes the channel worth their hours, which the stop line rarely states.
- Feit & Berman's examples are large-scale (100,000+ population). The square-root rule is theirs; applying it to a few hundred people is my extrapolation.
