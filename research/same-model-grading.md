# How much same-model graders favour the advisor, and where (checked 2026-10-27)

Question: `grader-reliability.md` §4 warns that the graders and the advisor are the same model family, and that models favour their own output (Panickssery et al. 2024, abstract). §7 step 5 proposes a one-off check against another model family on 6–10 runs. `llm-grader-checklists.md` §3 left that unchanged. How large is the bias, and which rubric items carry it?

Hop 1 from `llm-grader-checklists.md`. Access marks as in `founder-test-samples.md`.

## Sources

1. Chen, W.-L., Wei, Z., Zhu, X., Feng, S. & Meng, Y. (2025). "Do LLM Evaluators Prefer Themselves for a Reason?" arXiv:2504.03846v3. https://arxiv.org/html/2504.03846v3 [read 2026-10-27; mitigation numbers cut off in the fetched text]
2. Roytburg, D., Bozoukov, M., Nguyen, M., Barzdukas, J., Puig-Hall, M. & Oozeer, N. (2026). "Are LLM Evaluators Really Narcissists? Sanity Checking Self-Preference Evaluations." arXiv:2601.22548v2. https://arxiv.org/html/2601.22548v2 [read 2026-10-27; preprint]

## 1. Most measured self-preference is the judge being right, or being unsure

- On tasks with a checkable answer (maths, coding, multiple choice), 11 open models judged their own answers against others'. Strong models preferred their own answer mostly when it was right: 95–97% of self-preferences were correct on maths, 81–89% on code and multiple choice. Better answerers were better judges (r = 0.71–0.90). [research, 1, read; preprint; open models, not this repo's model]
- The harmful part sits where the judge was itself wrong: when its own answer was wrong, one 72B model still preferred it 86% of the time on maths. "Harmful self-preference persists when evaluator models err as generators." [research, 1, read]
- A reanalysis of four earlier self-preference pipelines, 16 models, 9 datasets: comparing a judge's vote for its own wrong answer with its vote for another model's equally wrong answer removes on average about 90% of the measured self-preference. Only 51% of earlier findings stayed significant. The rest is the judge being uncertain on hard items. Bias remains, smaller. [research, 2, read; preprint]

## 2. Transfer to `evals/rubric.md`

- The risk is concentrated on items where the grader would make the advisor's mistake itself: a claim it believes, a word it doesn't see as jargon, a qualifier it wouldn't have kept. Where the check is mechanical (open the cited file, compare the quote, count the words, recompute the fingerprint), the grader's own beliefs don't enter. [derived from 1, 2]
- The items the graders disagree on are the hard ones, which is where source 2 finds the residual bias. [derived from 2; `llm-grader-checklists.md` §1]

## 3. What this changes

1. **Grader-reliability §7 step 5: pick the cross-family sample by item, not by run, and read the direction.** Send the other-family grader the items the same-family graders split on (from the step 3 double-grade in `llm-grader-checklists.md` §3), plus a random set of judgment items. Disagreement will be higher on the split items whatever the bias, because they are harder (source 2's confound). The bias test is the sign: on each set, how often the same-family grade (the mean of the two) is higher than the cross-family one, minus how often it is lower. Same-family bias shows as that gap growing on the split items. [derived from 1, 2]
2. **Move mechanical items out of grader judgment** (grader-reliability §7 step 4) first. Each item moved to a script is an item self-preference can't touch. [derived]
3. **Not changed:** the instruction that graders grade against the rubric only. Neither study tests an instruction as a fix; source 2 found reasoning before judging showed "limited evidence" of reducing bias. [research, 2, read]

## 4. What this does not settle

- Both are preprints, on open models and on tasks with one right answer. Advice quality has no answer key; the "judge was wrong" split can't be computed directly here.
- Neither tests a grader judging an answer written by the same model under a different prompt, which is this repo's case.
