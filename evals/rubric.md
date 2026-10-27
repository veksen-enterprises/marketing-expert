# Grading rubric

Score items 1, 3, 4, 5, 7, 8, 9 and 10 from 0 to 2 (0 = absent/wrong, 1 = partial, 2 = good); the total is out of 16. Items 2 and 6 are pass/fail gates, not added to the total. Quote the answer as evidence.

Why the change (2026-10-27, research/grader-reliability.md section 1): in the 21 grades of rounds 1–4, items 2 and 6 scored 2 every time and item 7 scored 1 in 18. An item that never varies adds a constant to every total and says nothing about the server. As gates, items 2 and 6 still flag the rare answer that fails them. Totals out of 16 are not comparable with the old totals out of 20; compare versions in one blind batch instead (`README.md`, "Comparing two versions").

1. **Context first**: read the repo/vision before advising; checked for a stored business profile; offered to save confirmed facts.
2. **Gate: no invented figures.** Fail if the answer presents a figure about this business that it neither asked for, labelled as an assumption, nor took from the material or a tool. Each failing figure is also an `invented-number` error.
3. **Diagnosis before tactics**: named the current constraint (positioning, reach, conversion, retention, economics) with evidence.
4. **Right playbook for the business type** (dev-tool SaaS / community consumer product), and noticed what's unusual about this business (e.g. agents as readers; no revenue model; Discord as platform).
5. **Tools for numbers**: used calculators (market_size, unit_economics, paid_media_math, ab tests) where numbers matter; no mental arithmetic presented as fact.
6. **Gate: specific to this business.** Fail if any move would fit a random startup unchanged: quote the move. A move resting on a misread fact about the business is an error (misquote, wrong-file…), not a gate failure.
7. **Moves well formed**: count the moves that fail the move format: more than one action (bundled-move), or a missing cheapest test, metric, time box or stop condition with a number (missing-test-or-stop). 2 = none fail, there are at most 3 moves and they are ranked; 1 = exactly one fails; 0 = two or more fail, or more than 3 moves, or no order. Length is not scored here: `check_answer` counts words, and `grade.mjs compare` reports them.
8. **Evidence honesty**: labels research vs practitioner vs vendor; doesn't call things "proven"; flags uncertainty and stale/unverified data.
9. **Respects the founder's stated vision and values** (doesn't recommend things the vision rules out, or says explicitly when it disagrees and why).
10. **Plain language**: no hype; jargon explained; never uses "moat" (the user's own documents use it; the answer shouldn't).

## Grade format

Two tables, with these first columns, so `scripts/evals/grade.mjs` can read them (it recomputes the total; any other row starting with a number breaks the parse):

```markdown
| # | Item | Score | Evidence |
|---|---|---|---|
| 1 | Context first | 2 | "quote" … |
(items 3, 4, 5, 7, 8, 9, 10)

| # | Gate | Result | Evidence |
|---|---|---|---|
| G2 | No invented figures | pass | … |
| G6 | Specific to this business | pass | … |
```

Also list:
- **Errors**: factual errors, wrong tool use, wrong numbers.
- **Server attribution**: for each weakness, whether the cause is the server's instructions, a prompt, a playbook (which), a tool, or the assistant itself; and the concrete fix.

## Errors as data

Besides the prose grade, write `errors.json` next to each grade: one object per error, so each one can become a failing test.

```json
[
  {
    "class": "qualifier-dropped",
    "claim": "the sentence from the answer, verbatim",
    "answerLine": 42,
    "source": "knowledge/<playbook>.md:<line> or research/<note>.md:<line> or <repo file>:<line>",
    "sourceText": "the passage the claim misstates, verbatim",
    "fix": "what the server should change: instructions, a prompt, a playbook, a tool, or the advisor"
  }
]
```

Classes: misquote, wrong-line, wrong-file, qualifier-dropped, label-upgraded, bundled-move, missing-test-or-stop, unexplained-jargon, invented-number, wrong-tool-use, other (say what). An error with no verbatim `claim` can't be reproduced; leave it out of the file and mention it in the prose.
