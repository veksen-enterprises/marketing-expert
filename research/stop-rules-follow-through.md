# Does a written stop line make people stop? (checked 2026-10-27)

Question: `forecasting-and-calibration.md` (open questions) asks whether writing a stop line makes founders stop; its only source was one student vignette (Simonson & Staw 1992). `check_answer` requires every move to carry a stop line with a number, and the predictions record (being built in a parallel thread) will hold the stop line for follow-up. Is there better evidence, and does it say who should write the rule and who should read it back?

Builds on: forecasting-and-calibration.md section C (Simonson & Staw 1992; Sleesman et al. 2012 meta-analysis, which did not study pre-set stop rules). Not repeated.

Access marks as in `founder-test-samples.md`.

## Sources

1. Boulding, W., Morgan, R. & Staelin, R. (1997). "Pulling the Plug to Stop the New Product Drain." *Journal of Marketing Research* 34(1):164–176. https://www.gwern.net/doc/psychology/cognitive-bias/sunk-cost/1997-boulding.pdf [read 2026-10-27]
2. Heath, C. (1995). "Escalation and de-escalation of commitment in response to sunk costs: The role of budgeting in mental accounting." *Organizational Behavior and Human Decision Processes* 62(1):38–54. https://www.gwern.net/doc/psychology/cognitive-bias/sunk-cost/1995-heath.pdf [read 2026-10-27]

## 1. A rule the person writes for themselves did nothing; a rule handed to them helped

Boulding et al.: 209 senior managers from executive programmes ran a simulated product launch that was failing. Share who pulled the product, by condition [research, 1, read; simulation; managers, not founders; cells of 13–41]:

| Condition | Pulled it |
|---|---|
| No aid | 0 of 13 |
| Risk analysis | 1 of 36 |
| Told the opportunity cost | 6 of 28 |
| Wrote their own stop rule up front | 0 of 13 |
| Agreed up front to a rule supplied to them | 13 of 30 |
| Someone else made the launch call; they only judged it | 17 of 31 |
| Control: no launch decision, no project history, only the year-2 figures | 27 of 41 |
| Finance academics | 20 of 20 |

- Of the 11 who wrote their own rules, 5 broke them, 3 wrote rules too vague to apply, and 3 followed them and kept going. The authors' summary: "I make the rules, I can break the rules." [research, 1, read]
- The supplied rule worked best of the aids the deciding manager could use, but 8 of the 17 who accepted it still kept the product. No procedure brought the decider down to the control rate. [research, 1, read]
- Separating who decides to start from who judges whether to stop worked about as well as the supplied rule (55%). [research, 1, read]

Fits the earlier note: Simonson & Staw found setting a minimum target helped in a student vignette (forecasting-and-calibration.md item 10). Boulding et al. add the condition that matters: who sets it. [derived]

## 2. Limits also make people quit too early

- Heath: people set a mental budget and stop when it runs out, whatever the outlook. With sunk costs high, 58% refused a further investment that was worth making in one problem (0% with sunk costs low); 64% of students refused at least one such investment. [research, 2, read; n=214 students; hypothetical real-estate problems]
- When the expected benefit was left out, the pattern reversed and people escalated; they read high past spending as a sign of high value. [research, 2, read; n=162 vs 161]
- Budgets in time were tracked less than budgets in money: the sunk-cost shift was 18–44 points for money and 5–16 for time. [research, 2, read; n=472 students; hypothetical]
- Consequence: a stop line can fail both ways. Too tight, it kills working ideas on budget alone; with no benefit number, it gives way. Founder tests are mostly paid in hours, the kind of budget people track worst. [derived from 2]

## 3. What this means for the tool

1. **Keep the stop-line requirement in `check_answer`.** The best-supported aid in source 1 is a concrete rule supplied by someone other than the decider before the result is known. The advisor writing a numeric stop line into each move is that setup. Three of 11 self-written rules were too vague to act on, which is the error class PR #19's checks target. [derived from 1]
2. **The predictions record (parallel build): store the stop line exactly as the advisor wrote it, and have the follow-up read it back to the founder as a yes/no against the result.** Re-asking "should you keep going?" invites the founder to rewrite the rule, which is the self-specified condition (0 of 13). The follow-up acting as the separate judge is the decoupled condition (17 of 31). [derived from 1; untested in this setting]
3. **The follow-up should report the benefit side too.** Source 2 shows rules applied without the benefit number drift into escalation, and rules applied on budget alone drift into early quitting. "Stop line: fewer than 5 of 20. Result: 3 of 20. Hours spent: 6 of 8." gives both. [derived from 2]
4. **Not proposed:** making the stop line binding, or a check that the founder "agrees" to it. Even the supplied rule left half the deciders continuing; the record's job is to make that visible, not to prevent it.

## 4. What this does not settle

- Both studies are simulations or hypotheticals with managers or students. No field study of founders following written stop lines was found.
- Boulding et al.'s cells are small (13–41). The differences between the supplied rule, decoupling and control are not individually tested here.
- The paper's text and table disagree on the risk-analysis count (1 vs 3 stops of 36).
