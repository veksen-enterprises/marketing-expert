# What like, like-back and match rates do recent dating-app data show, by side? (checked 2026-10-27)

Question: the `reciprocal` mode proposed in `reciprocal-liquidity.md` takes its test numbers and 5x side-gap warning from 2003–2016 data. What baseline rates did Rios, Saban & Zheng (2023) report, and do 2018+ sources differ?

Hop 1 from `research/reciprocal-liquidity.md`. Access marks as in `relaunch-rules.md`. Lehmann et al.'s Tinder-like app is `dating-hard-side.md` item 5; Hinge's like rate is `design-and-marketing-in-crowded-markets.md` §5. Not repeated.

## Sources

1. Rios, I., Saban, D. & Zheng, F. (2023). "Improving Match Rates in Dating Markets Through Assortment Optimization." *M&SOM* 25(4):1304–1323. doi:10.1287/msom.2022.1107. Accepted version, Imperial Spiral: https://spiral.imperial.ac.uk/entities/publication/2623e0a6-0639-4bcc-84ed-8032b042c723 , file https://spiral.imperial.ac.uk/server/api/core/bitstreams/2e71c36d-4b6f-4626-a286-ffcab6948057/content ("dating_dec2021.pdf") [read 2026-10-27; fetch summary; two passes; Tables 2–3 and §2, §4, §6, §7.2–7.3]
2. Imperial Business School article on source 1. https://www.imperial.ac.uk/business-school/print/pdf/node/6547 [read 2026-10-27; fetch summary; secondary]
3. Fong, J. (Yu) (2018). "Search, Selectivity, and Market Thickness in Two-Sided Markets." Wharton job-market paper. https://marketing.wharton.upenn.edu/wp-content/uploads/2018/10/10.18.2018-Yu-Jessica-PAPER-JMP.pdf [read 2026-10-27; fetch summary; Table 2 only]
4. SwipeStats, "Dating App Statistics by Gender: What 294 Million Swipes Tell Us About Men vs Women", published 21 Apr 2026. https://swipestats.io/blog/dating-app-statistics-gender [read 2026-10-27; fetch summary] [vendor]
5. Tyson et al. 2016 and Hitsch et al. 2010, as summarised in `reciprocal-liquidity.md` items 5 and 7 [not re-read].

Not fetched: the publisher full text of 1 (INFORMS blocked); a direct curl of the Spiral PDF (proxy 403). The Stanford GSB download of 1 returned only a redirect page. No SSRN copy of 1 was found. Every number from 1 was seen only through WebFetch summaries, so none carries a code change alone.

## 1. Rios, Saban & Zheng: what the paper reports

- **Setting.** A US dating platform with "roughly 800,000 active users in more than 150 geographical markets". Users see a short daily list (mean 3.53 profiles, median 3) and like or skip each. A match needs both likes, possibly on different days. The paper does not call it a swipe app. [research, 1, read; fetch summary; one platform]
- **Field experiment.** Houston got the new algorithm 19–25 August 2020, with Austin and Dallas–Fort Worth as controls. Austin got it 9–15 September 2020, where "the number of matches increased by 37.95%". User counts per arm were not seen. [research, 1, read; fetch summary; one week each; city-level comparison, not user-randomised]
- **Baseline counts (Table 2, one week each).** Austin before: 27,580 profiles shown, 11,440 likes, 901 matches. Dallas before: 38,931, 15,067, 1,113. Houston before: 27,796, 11,083, 704. [research, 1, read; fetch summary]
- **Rates derived from those counts.** About 39–42% of profiles shown were liked. Matches were 6.4–7.9% of likes and 2.5–3.3% of profiles shown. [derived, 1; Table 2; both sexes pooled]
- **Like-back rate.** Table 3 splits out "backlog" profiles: people who had already liked the viewer. Viewers liked 21–23% of them, for example 869 of 3,712 in Austin before (23.4%). Each such like is a match. Other profiles were liked at 39–44%. So users were about half as likely to like someone who had already liked them. [derived, 1; Table 3; the summary flagged a misaligned header, but backlog plus other likes equal Table 2's likes in every row checked]
- **No split by sex.** The paper gives no like or match rate for men and women separately. [research, 1, read; fetch summary]

## 2. Other 2018+ sources

- **Fong (2018)** gives like rates and matches by sex for one large app (40,647 men, 26,092 women, 34 days in 2015). They are "log transformed by an unreported base to maintain data confidentiality", so no raw rate can be read off. [research, 3, read; fetch summary; one app; masked]
- **SwipeStats** reports, from "7,000+ Tinder Profile Uploads, 294M Swipes": "Women's average match rate: 44.4%" and "Men's average match rate: 5.26%", per right swipe. Its average swipe counts imply men swipe right on about 36% of profiles and women about 5%. [vendor, 4, read; fetch summary; user-donated exports, self-selected; no date range; percentages derived by the summariser]

## 3. How this compares with the older rates

- Tyson et al. gave matches per like of 0.55–0.78% for male test profiles and 10.2–10.5% for female ones, a gap of 13–19x. SwipeStats gives 5.26% and 44.4%, a gap of about 8x. SwipeStats' levels are higher, perhaps because test accounts liked everyone. [derived, 4–5]
- Rios et al. has no split by sex. Its pooled like-back rate (21–23%) and like rate (about 40%) come from a curated short list, and both are far above swipe-app women's like rate (about 5%). Format changes the rates as much as sex does. [derived, 1, 4]

**Agreement with `reciprocal-liquidity.md`.** Agree on its numbers: its test gap (0.02 vs 0.5, 25x) is wider than both measured gaps, but the 5x threshold fires on both. Disagree on one point: it lacks a balanced, curated-app example, which Rios et al. supplies.

## What this changes

1. **Keep the note's test numbers and the 5x threshold.** Cite source 4 next to Tyson for the side gap, marked vendor.
2. **Add a curated-app test case built from source 1.** Both sides {15 per day, 0.3 filter share, 0.4 like rate out, 0.22 like rate back, 0.2 conversation rate}, 7 days, give 2.77 matches a week, a 93.7% chance of at least one, and no side-gap warning. The 2003–2016 inputs (men {15, 0.3, 0.5, 0.02, 0.2}, women {15, 0.3, 0.1, 0.5, 0.2}) still give the warning (ratio 25).
3. **Mode description in `src/server.ts`.** Say that like rates depend on format: a few curated profiles a day were liked at about 40% (source 1), while swipe-app women liked about 5% (source 4). This is tool description text, not operating rules.

## What this does not settle

- Like and like-back rates by sex in a curated app. Source 1 pools the sexes.
- Any audited, dated, first-party rates by sex for a swipe app since 2016. SwipeStats is self-selected and undated.
- Rates in a small new app. All sources are large, established platforms.
