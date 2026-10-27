# Does a judge who didn't start the project stop it more often, outside the lab? (checked 2026-10-27)

Question: `stop-rules-follow-through.md` §3 item 2 proposes that the predictions record's follow-up act as a separate judge, from a simulation where managers who hadn't made the launch call pulled a failing product 17 of 31 times against 0 of 13. Is there field evidence, and who counts as "separate" when the advisor wrote the move?

Hop 1 from `stop-rules-follow-through.md`. Access marks as in `founder-test-samples.md`.

## Sources

1. Staw, B. M., Barsade, S. G. & Koput, K. W. (1997). "Escalation at the credit window: A longitudinal study of bank executives' recognition and write-off of problem loans." *Journal of Applied Psychology* 82(1):130–142. doi:10.1037/0021-9010.82.1.130. https://experts.arizona.edu/en/publications/escalation-at-the-credit-window-a-longitudinal-study-of-bank-exec/ [abstract-only, 2026-10-27]
2. Panickssery, A., Bowman, S. R. & Feng, S. (2024), "LLM Evaluators Recognize and Favor Their Own Generations", as cited in `grader-reliability.md` source 9 [in repo; abstract].

Not opened: Weisbach (1995), "CEO turnover and the firm's investment decisions", *Journal of Financial Economics* 37(2):159–188, often cited for new CEOs divesting predecessors' acquisitions; no abstract was reachable, so nothing here rests on it.

## 1. Field evidence: new executives write off the old executives' loans

- 132 California banks over 9 years: turnover of senior executives predicted both provisions for loan losses and write-offs of bad loans. Write-offs did not predict turnover, which argues against the reverse story (executives fired because of bad loans). [research, 1, abstract-only; one industry; observational panel]
- That is the lab's decoupling result in the field: the person who did not make the original call is more willing to call it a loss. [derived from 1 and `stop-rules-follow-through.md` source 1]

## 2. Who is "separate" here

- The founder adopts the move; the advisor wrote it. At follow-up, the same model reading back its own advice is the original decision maker in source 1's sense, and model graders favour their own outputs [2].
- So "the follow-up judges" is only separate if the judging is not left to the model's reading. The part that needs no judgment, whether the result crossed the stop line, can be computed. [derived from 1, 2]

## 3. What this changes

1. **Predictions record (parallel build): compute the stop-line verdict in the tool.** Store the stop line's threshold, count and denominator when the move is saved (`moveCheck.ts` already matches "c of n" shares with its `SHARE` pattern, but only tests for one; it does not extract c and n yet). At follow-up, the tool takes the founder's result and returns "crossed" or "not crossed", with the hours spent against the time box. The model explains; it doesn't decide whether the line was crossed. Test: a saved move "fewer than 5 of 20" with result "3 of 20" returns crossed; a stop line the parser can't read returns "can't check: the stop line has no number to compare", never a verdict. [derived]
2. **Wording of the follow-up:** report the verdict before any explanation, so the advisor's reasons can't arrive first. [derived from `stop-rules-follow-through.md` §1: the self-specified rule was broken when the decider reinterpreted it]

## 4. What this does not settle

- Source 1 was seen as an abstract; effect sizes and controls were not read.
- Bank executives answering to regulators are not founders. The founder remains the decider in every case; the record only removes one route to rewriting the rule.
