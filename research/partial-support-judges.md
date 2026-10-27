# Do current model judges still call partial support "supported", and does splitting the claim first help? (checked 2026-10-27)

Question: `llm-citation-checking.md` §2 found 2023–2024 judges call partially supported claims "supported" (CAQA: GPT-4 partial F1 0.456 zero-shot). It proposed a narrow per-claim question for graders in `evals/rubric.md`: "Does the claim say anything, about who, how many, or how sure, that the source does not?" (a) Do 2025–2026 frontier judges still miss partial support? (b) Does splitting a claim into atomic facts before judging catch partial support better than judging the whole claim?

Hop 1 from `llm-citation-checking.md`. Access marks as in `founder-test-samples.md`. Sources there (AttributionBench, AttrScore, ALCE, CAQA, SummEdits, FActScore) are not repeated. All full texts were read through the fetch tool's summaries, not the PDFs directly; direct downloads from arxiv.org were blocked by the egress proxy.

## Sources

1. Thakur, N., Pradeep, R., Upadhyay, S., Campos, D., Craswell, N. & Lin, J. "Support Evaluation for the TREC 2024 RAG Track: Comparing Human versus LLM Judges." arXiv:2504.15205. https://arxiv.org/pdf/2504.15205 [read 2026-10-27; venue and date not checked]
2. Leung, E., Lumer, E., Feld, C., Huber, A., Subbiah, V. K. & Paul, K. (2026). "Do You Need a Frontier Model as a Citation Verifier? Benchmarking Rubric LLMs for Deep-Research Source Attribution." arXiv:2607.08700. https://arxiv.org/pdf/2607.08700 [read 2026-10-27]
3. Ding, T., Nannapaneni, A. & De la Cruz Weinstein, J. P. (2026). "Do LLM Attribution Metrics Transfer? Auditing Retrieval-Augmented Generation Evaluation Across Datasets and Constructs." GroundLM workshop, EMNLP 2026 (as stated in the paper). arXiv:2606.23915. https://arxiv.org/pdf/2606.23915 [read 2026-10-27]
4. Onweller et al. (2026). "Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents." arXiv:2605.06635. https://arxiv.org/pdf/2605.06635 [read 2026-10-27]
5. Tang, L., Laban, P. & Durrett, G. (2024). "MiniCheck: Efficient Fact-Checking of LLMs on Grounding Documents" (LLM-AggreFact). arXiv:2404.10774v2. https://arxiv.org/pdf/2404.10774 [read 2026-10-27; venue EMNLP 2024 per an alphaxiv page, not checked]
6. Hu, Q., Long, Q. & Wang, W. (2025). "Decomposition Dilemmas: Does Claim Decomposition Boost or Burden Fact-Checking Performance?" arXiv:2411.02400v2. https://arxiv.org/html/2411.02400v2 [read 2026-10-27; venue not checked]
7. Kamoi, R., Goyal, T., Rodriguez, J. D. & Durrett, G. (2023). "WiCE: Real-World Entailment for Claims in Wikipedia." arXiv:2303.01432. https://arxiv.org/pdf/2303.01432 [read 2026-10-27; EMNLP 2023 per ACL Anthology search result, snippet-only]
8. Zhang, X. (2026). "Atomic and Holistic LLM Judges for Reference-Grounded Support Labels: A Prompt-Controlled Comparison." arXiv:2603.28005. https://arxiv.org/html/2603.28005 [read 2026-10-27; date and venue not stated]

Skipped: the LLM-AggreFact leaderboard page (only GPT-4 and MiniCheck figures visible, binary labels); FACTS Grounding (binary judge verdicts, not a partial-support measure); HALLMARK (arXiv:2607.18360; checks citation metadata, not claim support); AFEV (arXiv:2506.07446; GPT-3.5, its no-decomposition ablation was cut off in the fetch).

## 1. No recent benchmark reports frontier partial-support F1

- The 2026 citation-judge benchmarks score support as binary and put partial support in the "not supported" bin. Leung et al.: 8 judges (Claude Haiku 4.5, Sonnet 4.6, Opus 4.6, Gemini 3.1 Pro and Flash Lite, GPT-5-mini, GPT-5.4-mini, GPT-OSS-120B); factual-support F1 0.649–0.750, all confidence intervals overlapping. [research, 2, read; binary; gold labels from a 6-model council checked by one human; 624 pairs]
- In the same study the main failure was over-rejection (false negatives), not over-acceptance. 29% of disagreement cases had a judge give 0.5 on a 0/1 rubric, i.e. judges used it as graded. [research, 2, read; FPR per judge only in a figure, not read]
- Ding et al. map partial support to "not attributable" in their annotation prompt; Onweller et al. score 0/1 with no partial class. Neither reports how partial cases fell. [research, 3, 4, read]
- LLM-AggreFact is binary too. Zero-shot BAcc: GPT-4 75.3, Claude 3 Opus 74.1. [research, 5, read; 2024 models]
- So the threshold set by the lead (frontier zero-shot partial F1 above about 0.8) cannot be checked: nobody publishes it. Binary F1 around 0.65–0.75 for 2026 frontier judges is no sign the problem is gone. [derived from 2–5]

## 2. Where a three-level scale was used, the model judge leaned upward

- TREC 2024 RAG, GPT-4o against NIST assessors on full / partial / no support: exact agreement 56% when both judged from scratch (22 topics), 72.1% when humans post-edited GPT-4o's labels (14 topics). GPT-4o "is more likely to provide a higher support label than the human judge". [research, 1, read; 2024 model; per-class F1 not reported]
- Its typical error moved one step up from "no support" to "partial": 15.1% of from-scratch sentences were GPT-4o partial against human none. GPT-4o gave partial when the passage shared a theme with the sentence but supported none of its text. [research, 1, read]
- The full-vs-partial cells are only in a figure, not stated in text. The partial-to-full error the repo cares about is not given as a number. [research, 1, read]
- Zhang 2026, holistic judge, ASQA rows that are deliberately incomplete: accuracy on those partial rows was 0.700 Opus-4.6, 0.465 GPT-4.1, 0.455 Gemini Flash Lite. So a 2026 frontier judge still passed about 3 in 10 partial rows as fully supported. [research, 8, read; one author; constructed labels (lexical halves of reference answers); measures missing content, not overstated content]

## 3. Splitting the claim first: no general gain for strong judges

- LLM-AggreFact, with vs without decomposition: GPT-4 75.6 vs 75.3 BAcc; small checkers ranged −3.3 to +1.2. Authors: "there is no clear indication that decomposing claims into atomic facts can consistently improve models' performance." Cost rose 2–4 times. [research, 5, read; binary; 2024 models]
- Decomposition Dilemmas, three decomposers (VeriScore, WiCE, FActScore-style) against no decomposition: GPT-4o-mini on FELM went 65.28 baseline to 67.28 (VeriScore) and 57.86 (FActScore-style) BAcc; MiniCheck on WiCE fell from 80.01 to 71.11–76.81. Authors: decomposition "generally benefits weaker verifiers, while it tends to negatively affect stronger verification systems." [research, 6, read; WiCE "partially supported" merged into unsupported, so no partial-class recall]
- WiCE: 54.7% of real Wikipedia claims were partially supported, but only 18.2% of their subclaims were; splitting turns most partial claims into clean yes/no parts. Splitting raised T5 claim-level AUROC on WiCE (79.2 to 83.3). [research, 7, read; fine-tuned T5, not LLM judges; no per-class partial result]
- The one head-to-head on a partial class, Zhang 2026: splitting the *candidate* (the claim) was the worst design on partial rows (ASQA, Opus 0.555 vs holistic 0.700; GPT-4.1 0.160 vs 0.465). Splitting the *reference* was best (Opus 0.950). On rows where the candidate adds unsupported content (TruthfulQA), splitting the candidate matched or beat holistic, significantly for 2 of 4 judges. Author: "What a judge decomposes should follow what the label measures." [research, 8, read; one author; constructed labels; unadjusted sign tests; on a 60-row hand-labelled subset the ranking reversed, resting on 9 rows]
- Read for this repo: the qualifier-dropped error is the claim saying *more* than the source (wider who, bigger number, surer). That is the TruthfulQA-like direction, where claim-side checking held up, not the ASQA direction, where it failed. Generic atomic splitting is not shown to help strong judges; a split aimed at the thing being measured might. [derived from 5, 6, 8]

## 4. What this changes

1. **Keep the narrow question in `evals/rubric.md`.** (a) did not meet the bar to drop it: no 2025–2026 source reports frontier partial-support F1, and the two that measure a partial class show the judge leaning upward (TREC) or missing about 3 in 10 partial rows (Zhang, Opus). [derived from 1, 8]
2. **Do not make the step "split the claim into atomic facts, then check each".** (b) found no comparison where generic splitting lifts a strong judge, and one where claim-side splitting hurt on partial rows. [derived from 5, 6, 8]
3. **Sharpen the step into a targeted split, and the same in `graderPrompt` (`scripts/evals/grade.mjs`).** Instead of the open question, the grader copies out the claim's who, how many and how sure words (for example "all developers", "most", "proven"), then quotes the source words for each, or writes "none". Any "none" is `qualifier-dropped`. This is the narrow question done as a split along only the axes the error class measures, which is what source 8 suggests. Test, before adopting: a saved answer line "Developers pick tools by their docs [first-party survey]" against a source passage "new coders in our self-selected survey said docs mattered most" must yield one `qualifier-dropped` entry in `errors.json` naming claim word "Developers" (who) against source words "new coders" and "self-selected". Run on the v4 devtool-strategy grade's "new coders → all developers" claim named in `llm-citation-checking.md` §5.3.
4. **Not changed:** `verify_quotes` and the label check; nothing here bears on exact-match classes.

## 5. What this does not settle

- No study measures partial-to-full errors for 2025–2026 frontier judges on human labels; the TREC figure is GPT-4o, and Zhang's labels are constructed, by one author.
- Zhang's partial rows measure missing content; the repo's error is added scope. The TruthfulQA result is the nearer match and its margin is small.
- Whether the targeted split raises grader recall over the open question needs an eval run.
- Venues for sources 1, 6 and 8 were not checked.
