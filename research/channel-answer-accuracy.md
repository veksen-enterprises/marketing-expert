# How far to trust "where users came from" now that it ranks bets (checked 2026-10-27)

Question: since 2285930, `match_small_bets` multiplies a bet's score by `CHANNEL_BOOST` (1.5) when the profile's `channels` names a kind the bet builds on (`src/lib/smallBets.ts`, `workingChannels`). `channels` is the founder's answer to "where did users come from". `research/intake-question-design.md` §4 argued that answer is built, not remembered, back when no tool read it. Now that one does, how wrong can it be, and in which direction?

Builds on: intake-question-design.md §4 (founder never saw the source; Recast on user recall), measurement.md §8 (self-reported attribution, dark social). Not repeated.

Access marks as in `founder-test-samples.md`.

## Sources

1. Johar, G. V. & Pham, M. T. (1999). "Relatedness, prominence, and constructive sponsor identification." *Journal of Marketing Research* 36(3):299–312. https://columbia.demo.elsevierpure.com/en/publications/relatedness-prominence-and-constructive-sponsor-identification-5 [abstract-only, 2026-10-27]
2. Ruiz, G. (2006-10-10). "Companies may not get their money's worth from ATS products." *Workforce*. https://news.workforce.com/?p=15473 [read 2026-10-27]. Reports a test by AllRetailJobs.com, a job board. [vendor; the board's own test, method only as relayed]
3. BrightEdge, "Groupon Finds Up to 60% of Direct Traffic Actually Search" (case study; experiment by Gene McKenna, Groupon). https://www.brightedge.com/resources/case-studies/groupon [read 2026-10-27; no date or duration on the page; 2014 per search results, unchecked] [vendor]
4. Vargas, D. (2025-12-16). "HDYHAU surveys as an attribution source." RevenueCat blog. https://www.revenuecat.com/blog/growth/how-did-you-hear-about-us-surveys.md [read 2026-10-27] [vendor]

Searched and not found: any study comparing a business owner's account of where customers came from with tracked or asked sources. Any peer-reviewed match rate between "how did you hear about us" answers and known sources.

## 1. Remembered sources are rebuilt from what's prominent and related

- Three experiments on event sponsors: people "identify" sponsors partly by guessing, and the guesses favour brands that are big in the market and that fit the event. Fit had the stronger effect. [research, 1, abstract-only; lab; sponsorship]
- Transfer: a founder answering "where did users come from" with no record does the same thing. The prominent candidates are the things the founder did and watched (the launch post, the subreddit thread they wrote); the related ones are channels that fit the product's audience. Both are exactly what `CHANNEL_KINDS` boosts. [derived from 1; untested on founders]

## 2. Asked sources are mostly wrong when checked against a known source

- A job board whose applicants all applied from the board itself asked them, in a drop-down, where they heard of the job. Five in six named another source; almost half gave no answer; about a third picked "another source". About 60,000 applicants. [vendor, 2, read; one job board; 2006; drop-down list, which the board's own result shows invites a wrong pick]
- The one app-side comparison found: survey answers exceeded the ad network's reported installs by an average of 95 a day for one app. That shows the two disagree, not which is right. [vendor, 4, read; one app; no match rate]
- These are users asked about their own source. The founder answering for them is one step further removed (intake-question-design.md §4). [derived]

## 3. Tracked sources are wrong too, in a known direction

- Groupon removed its site from search results for a period. "Direct" visits to inner pages with long URLs fell along with search visits: about 6 direct visits lost for every 10 search visits lost. Read as: a large share of "direct" was search with the referrer missing. [vendor, 3, read; one large site; duration and date not on the page]
- So a founder reading an analytics dashboard under-credits search and word of mouth, which show up as "direct" or nothing. Neither recall nor the dashboard is a clean basis. [derived from 3; measurement.md §8]

## 4. What the boost actually needs, and where that leaves it

- The boost's claim is weak: the audience can be reached on that channel at all. It is not "this is the main channel". A recalled answer that over-credits a real channel still passes. The failure that matters is a channel that brought no users, named because it is prominent or fits. [derived]
- Section 1 predicts exactly that failure for channels the founder posted in: a launch site or a community thread is both prominent to the founder and related to the product. [derived from 1]
- Named cases survive better than shares. "The last three users: one said a friend told them, one came from a Reddit comment link, one I don't know" carries its own basis. PR #20 (open) rewrites the question this way: last few users, and how the founder knows. [derived; intake-question-design.md §3]

## 5. Proposed change (not built; depends on PR #20 and the basis tags)

1. **`match_small_bets`: boost only on a channel with a basis.** When the profile marks a channel as a guess, or the answer gives no basis, don't boost; add an assumption line: "Not ranked up for <channel>: it's a guess where users came from. Say which recent users came from it and how you know, and it will be." When the basis is a user's own word, a link or a referrer, boost as now. Test: two profiles identical but for the channel's basis; scores differ only on the bets of that channel kind.
2. **Do not drop the boost.** No source shows the boost picks worse bets; the evidence is only that its input is noisy. Keeping it behind a basis keeps the useful case (a referrer or a user's word) and removes the guessed one. [derived]
3. **Do not weight by share.** Nothing above supports turning "most users came from X" into a bigger boost; shares are where recall is worst [2, 3].
4. **Until basis tags land:** today a boosted bet carries `workingChannel`, but no assumption line says the boost rests on an unchecked answer (assumption lines exist only for no channels and unmatched channels, `smallBets.ts` around line 261). Interim fix, no score change: when any bet was boosted, add "Ranked up bets on <channels> because the profile says users came from there; that answer wasn't checked."

## 6. What this does not settle

- No founder data. Every number above is users or a site, not a founder answering for users.
- Sources 2–4 are vendor material with no published method. Source 1 is seen as an abstract.
- Whether the 1.5 boost picks better bets at all is untested; it is a rule of thumb in the code comment.
