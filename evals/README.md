# Advisor evaluations

Realistic cases run through the MCP server by an agent playing the AI assistant (using `scripts/mcp.mjs`), then graded against `rubric.md` by a separate agent. The point is to find where the server's instructions, prompts, playbooks or tools steer the advice wrong.

- `cases.md`: the cases (business, user message, what the assistant may look at).
- `rubric.md`: grading checklist.
- `runs/<case>.md`: the assistant's answer plus its tool-call log.
- `grades/<case>.md`: the grader's scores and the fixes it attributes to the server.

## Results

Scores out of 20 (rubric.md). Round 2 ran after the fixes from round 1's grades. Round-2 graders were stricter on length, evidence labels and plain language, so equal totals hide real changes; read the "Compared with round 1" section of each grade.

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
