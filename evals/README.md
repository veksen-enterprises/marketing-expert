# Advisor evaluations

Realistic cases run through the MCP server by an agent playing the AI assistant (using `scripts/mcp.mjs`), then graded against `rubric.md` by a separate agent. The point is to find where the server's instructions, prompts, playbooks or tools steer the advice wrong.

- `cases.md`: the cases (business, user message, what the assistant may look at).
- `rubric.md`: grading checklist.
- `runs/<case>.md`: the assistant's answer plus its tool-call log.
- `grades/<case>.md`: the grader's scores and the fixes it attributes to the server, with `errors.json` beside it (format in `rubric.md`): each error with the verbatim claim and source, so it can become a failing test. Round 6 had no such file, and its top error class couldn't be reproduced.

## Comparing two versions

`scripts/evals/grade.mjs` grades the baseline and the candidate in one batch, so grader drift between rounds hits both equally, and judges the change across cases instead of case by case (research/grader-reliability.md sections 4–5).

```bash
npm run build
node scripts/evals/grade.mjs blind --baseline <old runs> --candidate <new runs> --out <batch>
node scripts/evals/grade.mjs grade --batch <batch> --materials devtool-=/home/user/site,companion-=/home/user/gamex-companion
node scripts/evals/grade.mjs compare --batch <batch>
```

- **Runs**: `<case>.md`, `<case>-<n>.md` or `<case>/<any>.md` in each folder, `<case>` an id from `cases.md`. Contaminated files and unknown names are skipped and listed.
- **blind** copies every run to `<batch>/answers/<case>--<id>.md` in shuffled order, hides data folder and run folder names, checks each logged `check_answer` fingerprint against the saved answer, and writes the key to `<batch>/key.json`. It does not hide content differences (a tool only one version has). Fictional cases find their fixture themselves; real ones need `--materials`.
- **grade** runs one `claude -p` grader per answer, in its own temp folder holding only that answer, with read-only tools and the business's material. The prompt lists what `verify_quotes` and the label check found in the answer (run `npm run build` first). Grades land in `<batch>/grades/`; rerunning retries only missing or unreadable ones.
- **compare** prints each case's difference of run means and the mean difference across cases with a 95% t interval, for the total, each item, the gates, error classes, and (from the built `check_answer` and move check) word counts, move-format issues, quote problems (`verify_quotes` against the case material; cases with no material are left out and named) and label problems (upgraded or qualifier-dropped brackets). The last two are the error classes a string match settles, so they are counted the same way for both versions instead of by the grader. Word counts leave out a `## Stage map` section. Stage-map problems are their own measure, compared only when both versions have an answer with a map; otherwise compare says so, because answers made before the map was asked for would each count as a problem. A change counts when the total's interval excludes zero.
- **double-grade** (`--runs <one round> --out <batch>`) grades every run twice, under separate ids, and prints grader agreement: ICC(1) on totals with a CI, raw agreement, AC1 and kappa per item, errors both graders found, and how much of the spread is grader versus run. With 11 cases × 3 runs it costs 66 grades; nobody has run it yet.

Batches of real businesses' answers stay outside git unless the owner agrees.

## Results

Scores out of 20 (the rubric before 2026-10-27, ten items summed). Round 2 ran after the fixes from round 1's grades. Round-2 graders were stricter on length, evidence labels and plain language, so equal totals hide real changes; read the "Compared with round 1" section of each grade.

| Case | Round 1 | Round 2 | Round 3 |
|---|---|---|---|
| devtool-strategy | 17 | 17 | 16 |
| devtool-competition | 17 | 16 | 16 |
| devtool-site | 15 | 18 | 17 |
| companion-strategy | 17 | 17 | 18 |
| companion-risk | 17 | 17 | 17 |
| companion-site | 17 | 16 | 17 |

Fixed by round 2: answers agree with tool verdicts, no invented CAC, competitors named, shipped vs planned marked, a stop condition on each move, redirect and sitemap-status reporting, render-mode head comparison.

Still failing in round 2, and the changes made after it:
- Claims about what a file says that the file doesn't say (quotes put in the wrong ADR, a code behaviour the code contradicts). Instruction 0 now requires the file and line actually opened, a repo-wide search, and "I found no X in <where>" wording.
- Evidence labels upgraded or caveats dropped. Instruction 5: copy labels as written.
- Every answer over 1,200 words (about 1,240 to 1,820). Instruction 9 now gives a shape and what to cut first.
- Bundled moves and a lost falsifier. Instruction 6: one action per move; say what would prove the diagnosis wrong.
- Data-handling claims in tooltips not checked (devtool-site). Instruction 0 and landing_page_teardown step 0.
- Tool bugs: glued nav text, calculators treated as sign-up forms, client-rendered pages missed by crawl_site, HTML accepted as robots.txt, render mode reporting the script-rewritten URL. Fixed with tests in test/regressions3.test.ts.

Round 3 ran after the round-2 instruction changes. Totals: 100, 101, 101 out of 120. One run per case, so a one-point move is within grader noise.
- Improved: fabricated or misattributed quotes from repo files dropped to zero in the GameX Companion cases (round 2 had three); every answer says what would prove the diagnosis wrong; playbook labels and snippet caveats were mostly copied correctly; the GameX Companion public item feed was found after two misses; the round-2 tool bugs were confirmed fixed by the companion-site grader.
- Still failing: every answer was over 1,200 words (1,323 to 1,679), so check_answer now counts words mechanically; moves still bundle several actions; wrong line numbers and status overstatements (a retired package called shipped); some findings missed in every round despite explicit instructions (GameX Companion's VITE_CALC_ONLY build flag; the DBTool pricing tooltip "Parameter values aren't included").

## Harness rules learned the hard way

- Give every concurrent advisor its own scratch directory and tell it not to read elsewhere in /tmp. In round 4 two advisors evidently shared a temp file: the devtool-competition answer was a GameX Companion draft under a DBTool tool log (kept as `runs/v4/devtool-competition-contaminated.md`), and the companion-risk answer was a devtool-strategy draft (`runs/v4/companion-risk-contaminated.md`). Before grading, check that each answer is about the right business and that its word count matches the last check_answer in its log.
- check_answer returns a fingerprint (hash plus first words) of the text it checked. Graders: recompute it on the saved answer to confirm the checked text is the sent text.

## Other business types

Five fictional cases (ecommerce, local services, consumer app, marketplace, professional services) were added on 2026-10-05 to measure the playbooks outside developer tools (ROADMAP item 7). Their material is in `evals/fixtures/`, and grader notes are in `evals/expectations.md`. Because they are invented, their runs and grades can be committed.
