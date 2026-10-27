# Do people change course right after a dip, and which point do they judge the change against? (checked 2026-10-27)

Question: `research/deciding-at-founder-volume.md` §1 shows that a change made in the worst of eight weeks looks like it worked 79% of the time at 10 events a week, even when it did nothing. Its open question: do founders actually change things after a bad week, or is that trigger assumed? And when they judge the change, do they use the low point as the baseline?

Hop 1 from `research/deciding-at-founder-volume.md` (open questions). Access marks as in `founder-test-samples.md`. Publisher sites (Wiley, SAGE, INFORMS), Semantic Scholar and OpenAlex were blocked or behind bot checks; most sources were seen as abstracts or through repository pages.

## Sources

1. Greve, H. R. (2003). *Organizational Learning from Performance Feedback*. Cambridge University Press. Chapter 1 sample: https://assets.cambridge.org/97805218/18315/sample/9780521818315ws.pdf [read 2026-10-27, chapter 1 only]
2. Blettner, D., Kotiloglu, S. & Lechler, T. G. (2023). "Unfinished business: integrating individual decision-makers' experience and incentives to organizational performance feedback theory." *Frontiers in Psychology* 14:1166185. doi:10.3389/fpsyg.2023.1166185 [read 2026-10-27; fetch summary; limitations section not reached]
3. Verver, H., van Zelst, M., Lucas, G. & Meeus, M. (2018). "Understanding heterogeneity in the performance feedback-response relationship: A meta-analysis." Conference paper. https://research.tilburguniversity.edu/en/publications/understanding-heterogeneity-in-the-performance-feedback-response-/ [abstract-only, 2026-10-27]
4. Kotiloglu, S., Chen, Y. & Lechler, T. (2021). "Organizational responses to performance feedback: A meta-analytic review." *Strategic Organization* 19(2):285–311. doi:10.1177/1476127019883361 [abstract-only, 2026-10-27; no effect sizes seen]
5. Greve, H. R. (1999). "The effect of core change on performance: Inertia and regression toward the mean." *Administrative Science Quarterly* 44(3):590–614. doi:10.2307/2666963 [abstract-only, 2026-10-27; volume and issue from memory, unchecked]
6. Bryson, A., Buraimo, B., Farnell, A. & Simmons, R. (2021). "Time To Go? Head Coach Quits and Dismissals in Professional Football." *De Economist* 169:81–105. https://mural.maynoothuniversity.ie/id/eprint/19645/1/s10645-020-09377-8.pdf [read 2026-10-27]
7. van Ours, J. C. & van Tuijl, M. A. (2016). "In-season head-coach dismissals and the performance of professional football teams." *Economic Inquiry* 54(1):591–604. doi:10.1111/ecin.12280 [abstract-only, 2026-10-27]
8. Comino, S., Manenti, F. M. & Mariuzzo, F. (2018). "Updates Management in Mobile Applications: iTunes vs Google Play." Working paper. https://ueaeprints.uea.ac.uk/id/eprint/68300/1/AppUpdates_r02_v01.pdf [read 2026-10-27; Table 5 coefficients not extracted]
9. Yavuz, R. I., Dutta, D. K. & Soytas, M. (2018). "Optimistic Entrepreneurs and New Product Introductions in High Technology Industries." AOM 2018 paper. https://faculty.ozyegin.edu.tr/mehmetas/files/2013/02/AOM_2018.pdf [read 2026-10-27]
10. Chen, Y. & Song, M. (2022). "The persistence and dynamics of new venture growth." *Small Business Economics* 58:303–322. doi:10.1007/s11187-020-00411-2 [abstract-only, 2026-10-27]
11. Baucells, M., Weber, M. & Welfens, F. (2011). "Reference-Point Formation and Updating." *Management Science*. doi:10.1287/mnsc.1100.1286 [abstract-only, 2026-10-27; year from memory]
12. Schaffner, P. E. (1985). "Specious learning about reward and punishment." *Journal of Personality and Social Psychology* 48(6):1377–1386. doi:10.1037/0022-3514.48.6.1377 [secondary: cited by Wikipedia "Regression fallacy"; not opened]

Not opened: Greve (1998) *ASQ* radio-station paper (fetch failed); Cyert & March (1963), known only through source 1.

## 1. Organisations do change more below their aspiration level, but weakly

- The core claim of performance-feedback theory: "Organizations with performance below the aspiration level of their managers have higher rates of strategic change." Aspirations come from the firm's own past and from peers. [research, 1, read; book chapter, theory and case summaries]
- A meta-analysis of 205 studies (516 effect sizes, about 3.4 million firm-year observations, published 1987–2021): the further performance falls below aspiration, the more firms respond, r = −0.076 (k = 261). Above aspiration, no significant link (r = 0.011, k = 225). [research, 2, read; mostly large firms, annual data; responses pooled across search, risk, change and R&D]
- An earlier meta-analysis (154 studies, 259 effect sizes) finds stronger support for search than for actual change, and wide spread between studies. [research, 3, abstract-only; conference paper]
- So the trigger is real on average but small, and slow: the unit is the firm-year. [derived from 2, 3]
- Greve warns of the cost of frequent checks: quick reaction to each reading gives "hair-trigger management", a trade-off between missing a real problem and reacting to a false one. [research, 1, read]

## 2. In small units judged often, the last result drives the decision

- Football clubs, 64,495 games, 944 dismissals: the result of the most recent game against bookmaker expectation moves the hazard of firing the coach most (sub-hazard ratio 0.600 per point above expectation); games 2–5 back weigh less (0.820), games 6–10 less again (0.905). The authors: "Owners place more weight on recent performance." [research, 6, read; four European leagues, 2002–2015; a club owner, not a founder]
- Dutch top league, 14 seasons: dismissals follow recent results below bookmaker expectation. Teams improve after the coach goes, but comparable teams that kept their coach improved as well. The authors conclude replacement "does not improve team performance". [research, 7, abstract-only; matching method not seen]
- This is the founder case in miniature: act after a dip, see a rebound, credit the change. It is the clearest field evidence found that the §1 bias in `deciding-at-founder-volume.md` happens outside a simulation. [derived from 6, 7]
- Top-1,000 iTunes apps in five European countries: developers update more often after last month's download growth falls. Not on Google Play. [research, 8, read; monthly panel, 6 months, 2013–14; working paper; growth proxy, no aspiration level]
- New US ventures (Kauffman Firm Survey): below-aspiration growth did not by itself raise new-product launches; it did among optimistic founders (61% vs 38% launching). [research, 9, read; n=344; self-reported performance, one-item optimism]
- In the same survey, negative growth in new ventures is less likely to persist and more likely to reverse than positive growth. [research, 10, abstract-only] Part of that reversal is what regression to the mean predicts. [derived]
- Low performers may also gain from change once regression to the mean is modelled. [research, 5, abstract-only; US radio stations 1984–1992] So not every post-dip rebound is noise.

## 3. Which point people judge against

- In a price-sequence experiment, the reference point is best described by the first and the last price; middle prices get small weights. [research, 11, abstract-only; lab, financial task]
- No source found shows people pick the lowest point as such. But a founder who acts after a dip judges at the moment the last value is the dip. If the last value weighs heavily [11], the dip becomes the baseline without anyone choosing it. [derived from 6, 11]
- An experiment is reported to show people learn a false lesson from regression to the mean, favouring punishment after poor results. [research, 12, secondary; not opened]

## 4. What this changes

The trigger is supported in small, frequently judged units [6, 7, 8], weakly in firms [2]. That is enough to act on the cheap, design-level fix in `deciding-at-founder-volume.md` §6 item 1.

**`check_answer` (`lintMoves` in `src/lib/moveCheck.ts`), next to the `noBaseline` issue.** Today a stop line with any number passes the no-baseline check, so "no rise above this week's 6 signups after 4 weeks" passes. Add an issue when a stop sentence matches `NO_CHANGE` (or "above", "up from", "compared to") and its baseline is a single recent period: `current`, `this week`, `last week`, `today`, `right now`, `yesterday`.

Wording: "The baseline is the week you decided in ("<snip>"). Changes usually follow a bad week, and the next weeks look better even when the change did nothing. Use the average of a fixed window before you decided (the 4 weeks before)." When the move text also says something fell (dropped, fell, down, dip, slump, decline), add: "This move follows a drop, so the rebound is likely." Not checked: whether the 4 weeks before were themselves unusual.

Tests (hand-written, in `test/moveCheck.test.ts`):
- Stop "No rise above this week's 6 signups after 4 weeks" returns the new issue.
- Stop "No rise above the current 6 a week" in a move whose why says "signups dropped last week" returns it with the drop sentence.
- Stop "Fewer than 15 signups a week, up from an average of 10 over the 4 weeks before 1 March" returns neither the new issue nor the existing no-baseline issue.
- Stop "No change after 4 weeks" still returns only the existing no-baseline issue (no double flag).

Seen in runs: a grep of `evals/runs/` finds one stop line with these words, "no rise above your current weekly baseline (set it before you start)" (`v4/devtool-competition.md`). It has no number, so the existing no-baseline issue already catches it. The new issue would catch the next step, once an agent adds a number to "current". It has no real failing answer yet; CLAUDE.md asks for one, so build it only when a run produces that line, or say in the commit that it is insurance.

## 5. What this does not settle

- No study of founders or startup teams at weekly resolution. The closest units are football clubs (game by game) and top apps (monthly).
- The meta-analytic effect is small and annual; it says little about week-to-week behaviour.
- Sources 7 and 10 were seen as abstracts; how comparison teams were matched was not checked.
- No direct evidence that people choose the low point; section 3's link is inferred.
- Greve (1998) and Cyert & March (1963) were not read.
