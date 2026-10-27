# Do users from the channel that brings the most sign-ups also stay? (checked 2026-10-27)

Question: `match_small_bets` ranks bets up (`CHANNEL_BOOST`, 1.5) when a profile channel with a `how` names a kind the bet builds on (`src/lib/smallBets.ts`, `workingChannels`). The `how` says users came from there, not that they stayed or paid. Do users from different channels stay and spend differently, and does the channel that brings the most sign-ups also bring the users who stay?

Hop 2 from research/proven-channel-returns.md §4, which saw sources 1–3 below only as abstracts or a press account. Schmitt, Skiera & Van den Bulte 2011 (referred bank customers worth at least 16% more) is in research/partners-referral-outbound.md item 10. Not repeated. Access marks as in `founder-test-samples.md`.

## Sources

1. Villanueva, J., Yoo, S. & Hanssens, D. M. (2008). "The Impact of Marketing-Induced Versus Word-of-Mouth Customer Acquisition on Customer Equity Growth." *Journal of Marketing Research* 45(1):48–59. https://www.anderson.ucla.edu/sites/default/files/documents/areas/fac/marketing/Villanueva_Yoo_Hanssens_2008(0).pdf [read 2026-10-27, through the fetch tool's summary and quotes]
2. Trusov, M., Bucklin, R. E. & Pauwels, K. (2009). "Effects of Word-of-Mouth Versus Traditional Marketing: Findings from an Internet Social Networking Site." *Journal of Marketing* 73(5):90–102. https://www.anderson.ucla.edu/documents/areas/fac/marketing/bucklin_effects.pdf [read 2026-10-27, through the fetch tool; volume and pages from memory, unchecked]
3. Verhoef, P. C. & Donkers, B. (2005). "The effect of acquisition channels on customer loyalty and cross-buying." *Journal of Interactive Marketing* 19(2):31–43. doi:10.1002/dir.20033. https://repub.eur.nl/pub/11491 [abstract-only, 2026-10-27; the Groningen copy is embargoed; no open copy found]
4. Chan, T. Y., Wu, C. & Xie, Y. (2011). "Measuring the Lifetime Value of Customers Acquired from Google Search Advertising." *Marketing Science* 30(5):837–850. doi:10.1287/mksc.1110.0658. The author-site PDF link redirected to a school home page. Numbers from the university's press release: https://source.washu.edu/2012/04/customers-acquired-through-google-search-advertising-more-valuable-than-previously-thought/ [read 2026-10-27; secondary]
5. Datta, H., Foubert, B. & Van Heerde, H. J. (2015). "The Challenge of Retaining Customers Acquired with Free Trials." *Journal of Marketing Research* 52(2):217–234. https://mro.massey.ac.nz/bitstreams/9ae1850f-1c2e-4581-80ba-bee9d7a4ffdb/download [read 2026-10-27, through the fetch tool]

The fetch tool hit its hourly limit once; direct downloads were blocked by the proxy. Reads above are the fetch tool's extraction, not my own page-by-page reading.

## 1. Channels bring users who stay at different rates

- At a start-up offering free web hosting, under 30% of users who came from marketing (banners, TV, radio, print ads, email links, direct mail) were active four weeks after sign-up. Over 50% of word-of-mouth users were (links from other sites, articles, referrals, search engines). [research, 1, read; one firm, 70 weeks; channel self-reported at sign-up, main channel only; activity = log-ins, not revenue]
- Over ten weeks, word-of-mouth users made 11.80 log-ins each against 5.89 for marketing users. Over a lifetime, a word-of-mouth user brought about 3.64 new users against 1.77. [research, 1, read; same firm; log-ins as a proxy for ad revenue]
- At a financial-services firm, direct-mail customers did poorly on retention and cross-buying; radio and TV customers on retention; web-site customers did well on retention. [research, 3, abstract-only; one firm; sample size not on the page]
- At a small US firm, customers from Google search ads bought more often than those from other channels. Counting repeat and offline purchases moved the value of a new customer from a $48 loss to as much as $950. [research, 4, secondary; one small firm; press release, no sample size]
- Three firms, three different settings, same direction: channel predicts who stays. No source ranks named channels in general. [derived from 1, 3, 4]

## 2. Does the biggest channel bring the users who stay?

- At the hosting start-up, yes. Word of mouth brought more sign-ups per week and the users who stayed. [derived from 1; weekly means in the paper's Table 1, not reported as totals]
- But the early read flipped. In week one, a marketing user made more log-ins (3.35) than a word-of-mouth user (2.82). The authors: "a manager who focuses only on short-term customer counts per channel will allocate efforts suboptimally." [research, 1, read]
- The clearest split is for offers, not channels. At a European TV provider, a free trial brought about three times the customers of a regular contract (12,612 vs 3,900). 48% of trial customers left by the end of the data, against 34%. Average customer value was 59% lower (€101 vs €245). A trial needed about 2.4 times the sign-ups just to break even. [research, 5, read; one firm; observational, selection modelled; offer, not channel]
- The social network study is often cited for "word of mouth beats marketing". It counts sign-ups only. Long-run sign-up elasticity: referrals 0.53, events 0.026, media 0.017. The authors say it does not track whether referred members stay. [research, 2, read; one large site, 36 weeks, daily aggregate data]
- So: users from different channels stay at different rates (three firms). Whether the sign-up leader is the retention leader was shown once for channels (it was) and once for offers (it was not). [derived from 1, 2, 5]

## 3. Scale

- The hosting start-up is the smallest firm with numbers: the conversion model used 93,119 users and the retention model 9,711. The Google-ads firm is "small-sized" but its customer count isn't in the press release. The others are large. [research, 1, 4, 5]
- None is at founder volume (tens of users). With 20 users from a channel, a gap like 30% vs 50% active at week four is within noise. research/stop-line-statistics.md has the bands. [derived]

## What this changes

1. **`match_small_bets`: no score change.** Making the boost need users who stayed would turn it off for most early founders, who can't tell retention per channel yet. Nothing here sizes a smaller boost for sign-ups only. [derived]
2. **Add an assumption line when the boost rests on sign-ups only.** When any channel ranked bets up and its `how` says nothing about staying or paying (no match for `/\b(stay|stayed|still (use|using|active)|active after|retain|came back|paid|pay(s|ing)?|subscri|renew|bought again)\b/i`), add: "Ranked up for <channel> because users signed up from it. Users from different channels can stay at very different rates (one start-up: under 30% vs over 50% still active after four weeks). When you can, check how many users from <channel> are still active after a month, and save that in its how." [derived from 1]
   - Test (in `test/smallBets.test.ts`): `channels: [{ name: "Reddit", how: "a referrer in analytics" }]` → `answer-questions` is boosted as now, and assumptions match `/signed up from it.*still active after a month/`. `channels: [{ name: "Reddit", how: "referrer; 7 of 10 still active after a month" }]` → same score, no such line.
3. **Keep the order: basis first, then staying.** A guess still doesn't boost (channel-answer-accuracy.md §5). Staying refines a backed channel; it doesn't replace the basis. [derived]

## What this does not settle

- No study at founder volume. Each finding is one firm.
- "Word of mouth" in source 1 includes search engines (the firm spent nothing on search). Its split doesn't map onto `CHANNEL_KINDS`.
- Verhoef & Donkers full text and Chan, Wu & Xie full text were not read; their numbers here are abstract or press release.
- Whether ranking bets by a channel whose users stay picks better bets is untested, as is the 1.5 boost itself.
- The free-trial result is about an offer. Whether launch-site or discount crowds behave like trial takers is not shown.
