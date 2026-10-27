# Research queue

How it works: a lead enters the queue only if it names the tool, check or playbook it would change, and the result that would change it. A lead that changes nothing is logged as parked and not researched. Depth is capped at 2 hops from a seed; a round stops at about 8 notes and is reported.

Status: queued, done (note linked), parked (reason). Hop 0 is a seed.

## Round 1 (2026-10-27)

Seeds: (A) sampling bias in founder validation tests, the gap named in `stop-line-statistics.md` §5; (B) the open questions in the notes merged 2026-10-27.

| # | Lead | Hop | From | Would change | Result that would change it | Status |
|---|---|---|---|---|---|---|
| 1 | Who the founder asks: friends, one community | 0 | A | `check_answer` band note (stop-line §6 item 4); `knowledge/customer-research.md` | Evidence that a known asker or one community shifts rates but not comparisons | done: `founder-test-samples.md` |
| 2 | How accurate "where users came from" is, now that it ranks bets | 0 | B (intake §4, made live by 2285930) | `match_small_bets` `CHANNEL_BOOST` | Evidence that recalled sources name channels that brought no users | done: `channel-answer-accuracy.md` |
| 3 | Does a written stop line make people stop? | 0 | B (forecasting open questions) | `check_answer` stop-line requirement; predictions record follow-up | A field or manager study where pre-set rules don't change stopping, or work only when someone else sets them | done: `stop-rules-follow-through.md` |
| 4 | Weekly counts vary more than Poisson at 5–50 a week? | 0 | B (deciding-at-founder-volume open questions) | the "about 70% or more" figure in `check_answer`'s no-baseline issue | A dispersion ratio of 1.5+ at founder volume would raise it | parked: no data reachable. The GitHub API here is scoped to this repo, and analytics, retail and download-count hosts are blocked; retail forecasting papers found say only "variance usually larger than the mean". The message already says "from sampling noise alone", so it is not overstated. A local session could measure it from public star or download histories. |
| 5 | Which error rates a stop line should be judged by (α = β = 0.20 default) | 0 | B (stop-line open questions) | band note wording, stop-line §6 item 4 | Evidence that error cost, not error rate, should set the band | done: `stop-line-error-costs.md` |
| 6 | LLM-grader agreement on checklist rubrics | 0 | B (grader-reliability §8) | evaluation method step 3 (how many graders), grader-reliability §7 | Item-level agreement figures for model graders on yes/no criteria | done: `llm-grader-checklists.md` |
| 7 | Does choosing between options resist flattery better than rating one? | 1 | 1 | `knowledge/customer-research.md` claim proposed in note 1 | Evidence that a choice format cuts inflated answers, and its condition | done: `choice-vs-rating.md` |
| 8 | Intraclass correlation of opinions inside one online community | 1 | 1 | band note | A published ICC would size a design effect | parked: with one community there is no between-community variance to estimate (note 1 §3), so no figure changes the note |
| 9 | Free-text vs drop-down "how did you hear" accuracy | 1 | 2 | get_started channel question | — | parked: PR #20 already removes the channel menu |
| 10 | Do founders over-credit channels they worked on (self-serving attribution)? | 1 | 2 | `CHANNEL_BOOST` | — | parked: the basis rule in note 2 §5 covers it whatever the size |
| 11 | How often founders restart a dropped test | 1 | 5 | band note asymmetry | — | parked: no source class found; only logged outcomes in the predictions record could show it |
| 12 | Do outside judges stop failing projects in the field, and who is "outside" when the advisor wrote the move? | 1 | 3 | predictions record follow-up | Field evidence for decoupling; whether the same model counts as the original decider | done: `outside-judge-at-follow-up.md` |
| 13 | How large same-model self-preference is in grading, and on which items | 1 | 6 | evaluation method step 5 (cross-family check) | Evidence on where the bias concentrates | done: `same-model-grading.md` |

Round 1 stopped at 8 notes (cap). Depth reached: 1 hop; the only hop-2 lead (14) needs an evaluation run, not reading.

Left for a later round (queued, not researched):

| # | Lead | Hop | From | Would change | Result that would change it |
|---|---|---|---|---|---|
| 14 | Does a cross-family grader on split items find a same-family bias in this repo's grades? | 2 | 13 | evaluation method step 5 | An empirical run, not literature: needs the step 3 double-grade first |
| 15 | Weekly-count dispersion at founder volume from public histories (local session) | — | 4 | `check_answer` no-baseline message | Dispersion of 1.5+ would raise the 70% figure |
