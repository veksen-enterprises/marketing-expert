# Does asking people to choose resist flattery better than asking them to rate? (checked 2026-10-27)

Question: `founder-test-samples.md` §4 item 3 proposes playbook advice: "Ask friends to choose between options, not to rate one." Its support was indirect (a lab study where people hid dislike but kept their ranking; survey experiments where effects travel better than levels). Is there direct evidence that a choice format resists inflated answers, and under what condition?

Hop 1 from `founder-test-samples.md`. Access marks as there.

## Sources

1. Cao, M. & Drasgow, F. (2019). "Does forcing reduce faking? A meta-analytic review of forced-choice personality measures in high-stakes situations." *Journal of Applied Psychology* 104(11):1347–1368. doi:10.1037/apl0000414. https://www.gwern.net/doc/psychology/personality/2019-cao.pdf [read 2026-10-27]

## 1. Choice formats cut inflation when the options are equally attractive to say

- Forced-choice personality tests make people pick between statements instead of rating each one. Across 43 studies (74 samples) of job applicants and people told to fake, the average score inflation under forced choice was d = 0.06, which the authors call "a very tiny effect", and "much lower" than for rating each statement on its own. [research, 1, read; meta-analysis; personnel selection, not product feedback]
- The condition: inflation stayed near zero (d = 0.02) when the paired statements were matched on how good they look to say, and rose to d = 0.25 when they were not. "Desirability balance is effective." [research, 1, read]
- Scoring matters too: comparing people only on their choices (normative scoring) gave about zero; formats that let a person raise every score at once gave 0.3–0.7. Forced choice "does not prevent faking"; it reduces it. [research, 1, read]

## 2. Transfer to founder tests

- "Which of these two landing pages would you sign up from?" is balanced: both are the founder's work, so neither answer is the kind one. "Would you use this or keep what you use now?" is not: one answer pleases the founder. Source 1 predicts the first resists flattery and the second does not. [derived from 1; untested on product feedback]
- "Rate this from 1 to 10" lets a friend raise every score at once, the format that inflated most. [derived from 1]
- A count of actions (signed up, paid, came back) is still better than any stated answer; this only ranks the stated formats. Hypothetical bias is covered in `early-stage-gtm.md` items 8–9. [derived]

## 3. What this changes

1. **`knowledge/customer-research.md` (sampling section): the proposed claim in `founder-test-samples.md` §4 item 3 gets its condition.** "Ask friends to choose between two versions you made, not to rate one, and not to compare yours with what they use now. Picking between equally pleasing options barely inflates; ratings and 'mine vs yours' do [research; meta-analysis, 43 studies; job applicants, not product feedback]."
2. **No tool change.** `check_answer` cannot tell whether a test's question is balanced; it would need the test's wording, which moves rarely include.

## 4. What this does not settle

- All 43 studies are personality tests in hiring. Wanting a job and wanting to please a friend are different motives; the format effect may differ in size.
- No study found tests choice versus rating for feedback on someone's product.
