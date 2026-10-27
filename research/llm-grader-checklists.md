# How well LLM graders agree on checklist rubrics (checked 2026-10-27)

Question: `grader-reliability.md` §8 says no study measures LLM-grader agreement on a multi-item, evidence-checking rubric like `evals/rubric.md`, and §7 proposes double-grading one round with two graders. Two studies now come close. What do they say about how many graders to use, and what the grader must do?

Builds on: grader-reliability.md §4 (MT-Bench preference agreement, self-preference, inconsistency) and §7 (proposed method). Not repeated.

Access marks as in `founder-test-samples.md`.

## Sources

1. Arora, R. K., Wei, J., Hicks, R. S., et al. (2025). "HealthBench: Evaluating Large Language Models Towards Improved Human Health." arXiv:2505.08775. https://arxiv.org/html/2505.08775v1 [read 2026-10-27: method sections]; results table read through an unofficial full-text mirror, https://huggingface.co/datasets/OnDeviceMedNotes/healthbench/blob/main/healthbench-fullpaper.md [read 2026-10-27; not checked against the arXiv PDF]
2. Zhuge, M., Zhao, C., Ashley, D. R., et al. (2024). "Agent-as-a-Judge: Evaluate Agents with Agents." arXiv:2410.10934v2. https://arxiv.org/html/2410.10934v2 [read 2026-10-27; an ICML 2025 poster page exists, published version not opened]

## 1. On criterion-level checks, experts agree only moderately, and a model grader sits among them

- HealthBench graded whether each of 34 physician-written criteria was met in a response: about 60,900 (criterion, response) pairs with physician grades. Agreement measured as macro F1, so "met" and "not met" count equally. [research, 1, read]
- Physician against physician: 0.57–0.73 by theme. GPT-4.1 against physicians: 0.57–0.71, above the average physician in 5 of 7 themes and above the 33rd percentile of physicians in all 7. Raw agreement, physician–physician and model–physician alike: 55–75%. [research, 1, read via mirror; medical criteria; one grader model]
- Read: on yes/no criteria that need judgment, two careful graders disagree on a quarter to almost half of items, and a model grader is about as consistent as a typical expert. Agreement this low is mostly the criteria, not the grader. [derived from 1]

## 2. A grader that finds and reads the evidence agrees far better than one that reads the output

- DevAI: 55 coding tasks, 365 yes/no requirements, outputs of three coding agents. Three human experts graded each, then debated to a consensus (86.5 hours). Pairwise disagreement between experts: 10–30%. [research, 2, read]
- Agreement with the consensus [research, 2, read]:

| Judge | Range across the 3 agents |
|---|---|
| Model reading the output only | 60–84% |
| Model that maps the project, locates the file a requirement refers to, and reads it | 84–90% |
| Individual experts | 76–93% |
| Majority of the 3 experts | 94–95% |

- Ablation on one agent: asking alone 65%; adding a file map 76%; adding reading 82%; adding locating the right file 90%. Locating the evidence was the largest single step. [research, 2, read; one benchmark; authors built the judge]
- A majority of three cut human error to about 6%. [research, 2, read]

## 3. What this means for the evaluation method

1. **Grader-reliability §7 step 3: plan for three graders on disputed items, not two.** At 10–45% item-level disagreement [1, 2], two graders tie on every disagreement, and there is no tie-break. Grade each run twice; send only the items where the two differ to a third grader; score by majority. Cost scales with disagreement, not with run count. [derived from 1, 2]
2. **Keep and strengthen "graders open every cited file" (CLAUDE.md, evaluating a change, step 3).** Source 2's gain came from locating the file a claim refers to. For the rubric items about citations and quotes, give the grader the location (path and line from the answer) instead of asking it to search; `verify_quotes` already does this for quotes, and its output can go in the grader's prompt. [derived from 2]
3. **Expect a ceiling.** Even a perfect process will not show grader agreement much above experts' own 70–90% on judgment items. A disagreement rate in that range on items like "explains jargon" is the item, not the grader; grader-reliability §7 step 4 (anchor or script the item) is the fix. [derived from 1, 2]
4. **Not changed:** the self-preference concern (grader-reliability §4) and step 5 (one-off check against another model family or the owner). Neither study tested a grader judging its own model family's output.

## 4. What this does not settle

- Neither rubric is a marketing advice rubric. HealthBench criteria are medical; DevAI requirements are code checks with a more definite answer.
- HealthBench numbers were read through an unofficial mirror. DevAI's judge was built and tested by its authors on their own benchmark.
- No study found gives agreement for a grader that also has to verify citations to external files it did not write, the closest analogue to `evals/rubric.md`.
