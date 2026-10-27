# How accurately LLM judges decide whether a cited source supports a claim (checked 2026-10-27)

Question: `llm-grader-checklists.md` §4 says no study gives agreement for a grader that also has to verify citations. Graders in `evals/` must decide whether each cited file supports each claim, and tag errors as misquote, wrong-line, qualifier-dropped and so on. How accurate are model judges at citation support, and which error types do they miss most?

Hop 0 from seed `llm-grader-checklists.md` §4. Access marks as in `founder-test-samples.md`.

Scope: the judge is handed the claim and the evidence passage in all studies below. None measures a judge that must first find the passage; that step is covered by DevAI in `llm-grader-checklists.md` §2 and not repeated.

## Sources

1. Li, Y., Yue, X., Liao, Z. & Sun, H. (2024). "AttributionBench: How Hard is Automatic Attribution Evaluation?" Findings of ACL 2024 (venue from an ACL Anthology search snippet). arXiv:2402.15089. https://arxiv.org/html/2402.15089v1 [read 2026-10-27; fetch summary]
2. Yue, X., Wang, B., Chen, Z., Zhang, K., Su, Y. & Sun, H. (2023). "Automatic Evaluation of Attribution by Large Language Models." arXiv:2305.06311. https://ar5iv.arxiv.org/html/2305.06311 [read 2026-10-27; venue not checked]
3. Gao, T., Yen, H., Yu, J. & Chen, D. (2023). "Enabling Large Language Models to Generate Text with Citations" (ALCE). arXiv:2305.14627v2. https://arxiv.org/pdf/2305.14627v2 [read 2026-10-27; venue not checked]
4. Hu, N., Chen, J., Wu, Y., Qi, G., Wang, H., Bi, S., Chen, Y., Wu, T. & Pan, J. Z. "Can LLMs Evaluate Complex Attribution in QA? Automatic Benchmarking using Knowledge Graphs" (CAQA). arXiv:2401.14640. https://arxiv.org/pdf/2401.14640 [read 2026-10-27; venue and version not checked]
5. Zhang, W., Yuan, Y., Aliannejadi, M., Huang, J.-H., Pei, J. & Kanoulas, E. (2024). "A Comparative Analysis of Faithfulness Metrics and Humans in Citation Evaluation." LLM4Eval workshop, SIGIR 2024. arXiv:2408.12398. https://arxiv.org/pdf/2408.12398 [read 2026-10-27]
6. Laban, P., Kryściński, W., Agarwal, D., Fabbri, A. R., Xiong, C., Joty, S. & Wu, C.-S. (2023). "LLMs as Factual Reasoners: Insights from Existing Benchmarks and Beyond" (SummEdits). arXiv:2305.14540. https://arxiv.org/pdf/2305.14540 [read 2026-10-27]
7. Min, S., Krishna, K., Lyu, X., et al. (2023). "FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long Form Text Generation." arXiv:2305.14251. https://arxiv.org/abs/2305.14251 [abstract-only, 2026-10-27]

Not opened: SciFact and its successors (claim verification models, not LLM judges of citations); a 2026 overstatement paper (RIGOURATE, arXiv:2601.04350) was skimmed but its "gold" labels come from an LLM ensemble, so it is not used.

## 1. Overall: a model judge is right on about three to four in five claim–source pairs

- AttributionBench pooled 7 attribution datasets into balanced yes/no sets. Zero-shot GPT-4 with reasoning: macro-F1 73.3 in-distribution, 78.9 out-of-distribution. Fine-tuned models reach about 78–84. [research, 1, read; balanced binary labels; 2024 models]
- ALCE's automatic citation check (an 11B NLI model) agreed with human raters at kappa 0.698 (85.1% accuracy) on whether citations support a statement, and kappa 0.525 (77.6%) on whether each citation is needed. [research, 3, read; one NLI model, not an LLM judge; ELI5/ASQA-style answers]
- FActScore's automated estimator reports "less than a 2% error rate". The abstract does not say this is per fact; I read it as error in the aggregate score, which can hide offsetting per-fact errors. [research, 7, abstract-only; the per-fact reading is unchecked]
- Read: one judge pass over one claim and its passage misjudges roughly one pair in five. Aggregate scores can still look accurate. [derived from 1, 3, 7]

## 2. Partial support is the weakest class, and judges err towards "supported"

- CAQA (four classes, built from knowledge graphs): GPT-4 F1 on "partially supportive" was 0.456 zero-shot and 0.52 few-shot, against 0.77–0.79 on "supportive". GPT-3.5 scored 0.017–0.031 on partial. The authors: "evaluators often classify partially supportive as supportive." [research, 4, read; synthetic QA; fine-tuned 7–13B models reach 0.92 on partial in-distribution]
- On 200 partially supported cases, humans gave a FActScore of 0.58; zero-shot GPT-4 gave 0.84 and GPT-3.5 0.93. The authors put the overestimate down to shared keywords between sub-facts and citations. [research, 4, read; n=200]
- Seven non-LLM faithfulness metrics separated full from no support best (ROC-AUC up to 92.65) but did worse on full vs partial (best 82.31) and partial vs none (best 79.89). The authors: "the best-performing metrics struggle to distinguish partial support from full or no support." [research, 5, read; no LLM judge tested]
- AttributionBench and ALCE fold "partial" into one side of a binary label (not attributable, and attributable, respectively), so their headline figures do not measure it. [research, 1, 3, read]

## 3. Judges miss small changes in a detail more than added or negated facts

- AttributionBench, 321 errors of a GPT-3.5 judge: 66% were "fine-grained information insensitivity": "ignoring or overlooking details like facts, events, numbers". 26.8% came from the judge and the human raters seeing different information (ambiguous references, label noise). [research, 1, read; one judge model; qualifiers not named as a category]
- AttrScore: GPT-4's errors were 30.6% fine-grained insensitivity (numbers, dates, comparisons). The hardest class for every model was "contradictory", most often mislabelled as attributable; GPT-4 zero-shot F1 on it was 23.2 on the simulated set and 45.0 on the 242-item search-engine set. [research, 2, read; simulated contradictions are edited answers]
- SummEdits, by edit type, GPT-4 balanced accuracy: entity changed 82.2, antonym swapped 81.3, fact added 87.0, negation added 92.7. Average over all models: 61.4, 62.9, 64.1, 69.7. Humans overall: 90.9; GPT-4 overall 82.4. [research, 6, read; summaries, not citations; no per-type human figure]
- Read for this repo: a dropped qualifier ("self-selected sample" lost; "new coders" widened to "developers") is a small change to one detail that leaves most words shared with the source. It sits in the classes judges miss most: partial support, fine-grained detail, entity change. No study names "qualifier dropped" or "scope widened" as a measured class. [derived from 1, 2, 4, 6]
- Wrong line and misquote: no study measures them; every benchmark hands the judge the passage. [derived]

## 4. What already exists in the repo

- `verify_quotes` (`src/lib/quoteCheck.ts`) settles misquote, wrong-line and wrong-file by exact match for text inside quotation marks, with a line tolerance and a context line. [derived]
- `check_answer`'s label check (`src/lib/labelCheck.ts`) flags an evidence bracket whose qualifier (snippet, not re-verified, self-selected…) the playbook has and the answer dropped. [derived]
- Neither feeds the grader or `grade.mjs compare`. The grader prompt (`scripts/evals/grade.mjs` `graderPrompt`) asks the grader to open every cited file and judge every claim itself. `compare` adds only word counts and move-format issues as mechanical measures. [derived]
- What no tool covers: a paraphrase, outside quotation marks and brackets, that drops a qualifier or widens scope. That is exactly the partial-support case of §2. [derived]

## 5. What this changes

1. **`grade.mjs compare`: add two mechanical rows**, computed like `lintMoves`: problems from `checkQuotes` on the saved answer against the case material, and label findings with status `upgraded` or `qualifier-dropped` from the label check. Then misquote, wrong-line and dropped bracket qualifiers are counted the same way for both versions, free of judge error (§1: about one pair in five). Test: an answer line `Developers judge a tool by its docs [first-party survey].`, where the playbook passage carries `[first-party survey; self-selected sample]`, adds 1 to the label row; an answer quoting `"docs first" (README.md:3)` where the phrase is on line 9 adds 1 to the quote row as wrong-line.
2. **`graderPrompt`: give the grader the tool output, not the search.** Paste `verify_quotes` results (status, found-at, context line) and label findings into the prompt, and tell the grader those classes are already counted; its job is the unquoted claims. This also gives it the exact source span, which DevAI found to be the largest single gain (`llm-grader-checklists.md` §2).
3. **`evals/rubric.md`, Errors section: for each paraphrased claim with a citation, the grader writes the source sentence and answers one narrow question: "Does the claim say anything, about who, how many, or how sure, that the source does not?"** This targets the partial-support error §2 shows judges make (calling partial support full) instead of asking "is it supported?". It is grader method, not advisor instruction text. Test: the v4 devtool-strategy grade's "new coders → all developers" claim should be tagged qualifier-dropped by a grader given the rule; check on that saved grade's claim before adopting.
4. **Not changed:** `verify_quotes` itself. It already turns the cheap classes into exact matches. Scope-widening in paraphrase can't be matched by string, and a keyword rule would misfire.

## 6. What this does not settle

- No study gives judge accuracy for qualifier-dropped or scope-widened claims as a named class; §3 infers it from neighbouring classes.
- All figures are on Wikipedia, QA or news data with 2023–2024 models. Current models may do better on partial support; CAQA's own fine-tuned small models did, in-distribution.
- CAQA's data is synthetic (built from knowledge graphs); its venue and version were not checked.
- Whether a narrow per-claim question (item 3) actually raises grader recall needs an eval run, not reading.
