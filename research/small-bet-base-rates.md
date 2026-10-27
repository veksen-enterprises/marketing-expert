# How often do founder-scale moves reach anyone? Base rates with denominators (checked 2026-10-27)

Question: `research/forecasting-and-calibration.md` §D says no published base rate exists for how often a launch post, a listing, community answers or a comparison page bring users to a business with no audience. Which rates with a denominator exist, which small bet in `src/lib/smallBetsCatalog.ts` does each belong to, and does any contradict a bet's `evidence` grade or `ceiling`?

Hop 1 from the seed "No base rates for founder-scale moves" in `research/forecasting-and-calibration.md`. Access marks as in `founder-test-samples.md`.

Already in the repo, cited not repeated: Hacker News effects on GitHub stars, selected on success (`research/early-stage-gtm.md` items 54, 56, 57; §8); the Product Hunt audience bias (same note, item 14); only 1.74% of new pages reach Google's top 10 within a year (`research/small-bets.md` item 11); Google Play download concentration (`research/small-bets-presence.md` Bet 1).

## Sources

1. Hacker News Search API (Algolia), `search_by_date?tags=show_hn` with `created_at_i` and `points` / `num_comments` filters, counts (`nbHits`) for January 2025 and June 2025. https://hn.algolia.com/api/v1/search_by_date [read 2026-10-27; my own counts, so the shares are derived]
2. Woolf, M. (minimaxir), "Impact of the New Show HN Section on Show HN Submissions," 14 Jul 2014. https://minimaxir.com/2014/07/show-hn/ [read 2026-10-27; practitioner analysis of ~20,000 Show HNs]
3. Ihlamur, Y., Griffin, B. & Chen, R. (2026). "PHBench: A Benchmark for Predicting Startup Series A Funding from Product Hunt Launch Signals." arXiv:2605.02974. https://arxiv.org/pdf/2605.02974 [read 2026-10-27; preprint]
4. Kim, H., Kang, H. & Song, J. (2026). "Generative AI Fuels Solo Entrepreneurship, but Teams Still Lead at the Top." arXiv:2605.10291. https://arxiv.org/pdf/2605.10291 [read 2026-10-27; preprint; already item 28 in `small-bets-direct.md`, new figures here]
5. Testers Community, "Average app installs" (Google Play listing database, observed 27 Jul–25 Aug 2026; published 7 Oct 2026). https://www.testerscommunity.com/research/average-app-installs [read 2026-10-27; vendor: sells app testing]
6. Pew Research Center, "An Analysis of Apps in the Google Play Store," 10 Nov 2015 (data Jun–Sep 2014). https://www.pewresearch.org/internet/2015/11/10/an-analysis-of-apps-in-the-google-play-store/ [read 2026-10-27]
7. DebugBear, "Chrome extension statistics," 19 Jul 2024, updated 29 Aug 2024. https://www.debugbear.com/blog/chrome-extension-statistics [read 2026-10-27; practitioner; vendor of web performance tools]
8. (Authors not checked.) (2024). "Protect Your Secrets: Understanding and Measuring Data Exposure in VSCode Extensions." arXiv:2412.00707. https://arxiv.org/pdf/2412.00707 [read 2026-10-27; method section only]
9. Vincent, N., Johnson, I. & Hecht, B. (2018). "Examining Wikipedia With a Broader Lens: Quantifying the Value of Wikipedia's Relationships with Other Large-Scale Online Communities." CHI 2018. https://www.brenthecht.com/publications/chi2018_wikipediavaluetoonlinecommunities.pdf [read 2026-10-27]
10. Ahrefs, "96.55% of Content Gets No Traffic From Google," 1 Dec 2023. https://ahrefs.com/blog/search-traffic-study/ [read 2026-10-27; vendor: sells SEO tools; traffic is Ahrefs' estimate]

## 1. Launch posts: most get no reaction at all (bet `launch-sites`)

- Show HN, January 2025: 1,724 posts. 633 (37%) never got a second point. 992 (58%) got no comment. 231 (13%) reached 10 points; 105 (6%) reached 50; 64 (3.7%) reached 100. [derived from 1; final scores 21 months later]
- Show HN, June 2025: 2,287 posts. 663 (29%) stayed at 1 point. 265 (12%) reached 10 points; 70 (3.1%) reached 100. [derived from 1]
- Ten points is roughly the front-page line: "if a submission has 10 points, it has most likely hit the front page sometime in its lifespan." In 2014, 16–19% of Show HNs hit the front page on an average day. [practitioner, 2; ~20,000 posts; 2014]
- The API likely drops posts that were killed as spam or flagged, so the true denominator is larger and these shares run high. Not checked. [derived]
- Product Hunt, 2019–2025: 67,292 of 288,692 posts were featured (23%, my division). Only featured posts were studied. Of those, 0.78% later raised a Series A; rank #1 of the day 2.2%, rank 11 and below 0.5%. [research, 3, read; preprint; funding, not users]
- Most Product Hunt makers launch once and leave. Among solo launches, 95–97% posted no update within 12 months. [research, 4, read; preprint; ~160,000 launches, 2019–2025]. So per-launch rates mix serious products with abandoned ones; a maintained product's odds are probably better than the average, by an unknown amount. [derived]
- None of these sources counts sign-ups or customers. Points and featuring measure reach. The only reach-to-outcome link in the repo is stars (`early-stage-gtm.md` item 57). [derived]

## 2. Listings: the typical listing gets a few hundred installs over its life (bet `listings`)

- Google Play, 3,037,501 live listings in 2026: 36.4% under 100 lifetime installs, 26.3% at 100–999, 19.0% at 1,000–9,999, 18.3% at 10,000 or more. Median app: 100–499 installs. [vendor, 5; one-month snapshot; delisted apps missing, so it looks better than reality]
- Same store in 2014: 47% of about 1,041,000 apps had fewer than 500 installs. [research, 6, read; Pew scrape]
- Chrome Web Store, 2024: about 95,000 of 111,933 counted extensions (85%) had fewer than 1,000 users; 242 (0.2%) had over a million. [practitioner, 7; incomplete count]
- Correction to `small-bets-presence.md` Bet 1: "about 44% of VS Code extensions had fewer than 10 installs" is not in source 8. The authors removed extensions with fewer than 10 installs *and* those with no source files together: 48,692 crawled, 27,261 kept. So at most 44% had fewer than 10 installs. [research, 8, read]
- Fit with the catalog: a store listing alone usually brings tens to hundreds of installs, not nothing and not thousands. That matches `ceiling: "capped"`. The stop line ("a handful of tagged visits … after 90 days") is consistent with the median. [derived]

## 3. Answering in communities: a link in an answer is not a traffic source on average (bet `answer-questions`)

- Wikipedia links make up 1.28% of Stack Overflow posts and 0.13% of Reddit posts. Answers with a Wikipedia link score higher (about +3.4 points on Stack Overflow). [research, 9, read; observational; ~1M sampled posts per site]
- The linked pages gained no detectable traffic in the following week: Stack Overflow +225 daily views (CI −243 to 694), Reddit +2,213 (CI −2,082 to 6,508). Only Reddit "TIL" posts, which reach a front page, moved traffic (+6,289, p < 0.01). [research, 9, read]
- Limits: the target pages already had about 10,000 views a day, so a lift of a few dozen clicks, which matters to a founder, is invisible here. The study does not measure sign-ups. It does say a link inside a typical answer is not a broadcast. [derived]

## 4. Comparison pages: no rate specific to them (bet `comparison-pages`)

- Across about 14 billion pages, 96.55% get no estimated Google traffic; 1.94% get 1–10 visits a month. Of about 20 million pages with no referring domains, 2,997 get over 1,000 visits a month. [vendor, 10; estimates miss long-tail queries]
- These are all pages, not pages aimed at a named query like "X alternative". No source measured comparison pages. The bet's "some" grade rests on comparative-advertising research about persuasion (`small-bets-presence.md` item 42), not on being found. [derived]

## What this changes

1. **`launch-sites` in `src/lib/smallBetsCatalog.ts`: add `tries: 2` and a stop branch for no reaction.** The bet is `lopsided` ("usually nothing, now and then a lot"), and the count backs that: about 1 in 8 Show HN posts reaches the front-page line, and over half get no comment. The catalog defines `tries` for lopsided bets as "how many tries to run before judging, judged on the best one", but `launch-sites` has none, while `small-bets-direct.md` §5 already says "judge 'was it worth a second site?' after the first two". The current stop line ("a spike with no retained users") only covers a spike, which is the uncommon case. New stop: "No reaction on two sites (almost no votes or comments): rewrite the first line and the demo before a third. A spike with no retained users: the product, not the channel, needs work." Raise `effortHours` to cover both tries (the field counts all tries; the second launch reuses most preparation, so about 24 rather than 32 is a judgment call). Test: `matchSmallBets` for a launched product at stage 0 returns `launch-sites` with `tries: 2`, and its `stop` text names the no-reaction case. The ranking drops (3 × 0.7 / √24 = 0.429 against 0.525 now), which is the honest price of needing two tries.
2. **`evidence` grades: no change.** No source measures users or customers from any of these moves. The new rates measure reach (points, featuring, installs, page views). `launch-sites` and `answer-questions` stay "anecdote"; `listings` and `comparison-pages` stay "some". [derived]
3. **`small-bets-presence.md` Bet 1: fix the VS Code figure** to "at most 44%" per §2 (for the owner of that note; not edited here).

## What this does not settle

- Reach to users: no source gives sign-ups or a first customer per launch, listing, answer or page.
- Reddit launch posts, BetaList and DevHunt: no denominator found. Product Hunt's featured share per year was not derivable from source 3.
- Whether killed or flagged Show HN posts are in the API counts.
- Comparison pages and error pages aimed at a named query: no rate at all.
- Store-wide install bands include abandoned apps (source 4's one-shot rate suggests most launches are); a rate for maintained products would be higher, by an unknown amount.
