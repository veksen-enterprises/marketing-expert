# Does more effort on a channel that already works beat starting a new one? (checked 2026-10-27)

Question: `match_small_bets` multiplies a bet's score by `CHANNEL_BOOST` (1.5) when it builds on a channel already bringing users (`src/lib/smallBets.ts`, `CHANNEL_KINDS`). The code comment calls 1.5 a rule of thumb. Is there evidence that a channel that worked early keeps working at founder scale, or do early channels saturate fast?

Hop 1 from research/channel-answer-accuracy.md §6 ("Whether the 1.5 boost picks better bets at all is untested"). Bullseye and the 50% rule are in research/brand-growth-channels.md [13]; Buffer's posting-frequency curve is in research/small-bets-presence.md [24]. Not repeated. Access marks as in `founder-test-samples.md`.

## Sources

1. Shapiro, B. T., Hitsch, G. J. & Tuchman, A. E. (2021). "TV Advertising Effectiveness and Profitability: Generalizable Results From 288 Brands." *Econometrica* 89(4):1855–1879. doi:10.3982/ECTA17674. https://www.gwern.net/doc/economics/advertising/2021-shapiro.pdf [read 2026-10-27; some tables garbled in the text copy]
2. Sethuraman, R., Tellis, G. J. & Briesch, R. A. (2011). "How Well does Advertising Work? Generalizations from Meta-analysis of Brand Advertising Elasticities." *Journal of Marketing Research* 48:457–471. https://www.gwern.net/doc/economics/advertising/2011-sethuraman.pdf [read 2026-10-27; issue and DOI not printed in the copy]
3. Vakratsas, D., Feinberg, F. M., Bass, F. M. & Kalyanaram, G. (2004). "The Shape of Advertising Response Functions Revisited: A Model of Dynamic Probabilistic Thresholds." *Marketing Science* 23(1):109–119. doi:10.1287/mksc.1030.0035. https://webuser.bus.umich.edu/feinf/Research/Published/Vakratsas,_Feinberg,_Bass,_GK_(2004)_-_The_Shape_of_Advertising_Response_Functions_Revisited.pdf [read 2026-10-27]
4. Blake, T., Nosko, C. & Tadelis, S. (2015). "Consumer Heterogeneity and Paid Search Effectiveness: A Large-Scale Field Experiment." *Econometrica* 83(1):155–174. https://faculty.haas.berkeley.edu/stadelis/BNT_ECMA_rev.pdf [read 2026-10-27, revision copy]
5. Lakkaraju, H., McAuley, J. & Leskovec, J. (2013). "What's in a name? Understanding the interplay between titles, content, and communities in social media." ICWSM 2013. https://ai.stanford.edu/~jure/pubs/reddit-icwsm13.pdf [read 2026-10-27]
6. Verhoef, P. C. & Donkers, B. (2005). "The effect of acquisition channels on customer loyalty and cross-buying." *Journal of Interactive Marketing* 19(2):31–43. doi:10.1002/dir.20033. https://repub.eur.nl/pub/11491 [abstract-only, 2026-10-27; full text behind sign-in]
7. Chan, T. Y., Wu, C. & Xie, Y. (2011). "Measuring the Lifetime Value of Customers Acquired from Google Search Advertising." *Marketing Science* 30(5):837–850. doi:10.1287/mksc.1110.0658. https://ideas.repec.org/a/inm/ormksc/v30y2011i5p837-850.html [abstract-only, 2026-10-27]
8. Villanueva, J., Yoo, S. & Hanssens, D. M. (2008). "The Impact of Marketing-Induced Versus Word-of-Mouth Customer Acquisition on Customer Equity Growth." *Journal of Marketing Research* 45(1). Working-paper abstract: https://www.msi.org/working-papers/the-impact-of-marketinginduced-versus-wordofmouth-customer-acquisition-on-customer-equity/ [abstract-only, 2026-10-27]. Numbers from IESE Insight, "Buzz for a better bottom line", https://www.iese.edu/insight/articles/buzz-better-bottom-line/ [read 2026-10-27; secondary]
9. Schwartz, E. M., Bradlow, E. T. & Fader, P. S. (2017). "Customer Acquisition via Display Advertising Using Multi-Armed Bandit Experiments." *Marketing Science* 36(4):500–522. doi:10.1287/mksc.2016.1023 [abstract-only, 2026-10-27]
10. Chen, A. (c. April 2012). "The Law of Shitty Clickthroughs." https://andrewchen.com/the-law-of-shitty-clickthroughs/ [read 2026-10-27; no date on the page] [practitioner]

## 1. Most untested channels return nothing

- Across 288 TV-advertised brands, two-thirds of ad effects could not be told apart from zero. The median elasticity was about 0.014. Weekly ROI at the margin was negative for more than 80% of brands. [research, 1, read; observational with border-market controls; large US packaged-goods brands]
- eBay's non-brand search ads added 0.66% to sales (95% CI −0.42% to 1.74%). Experimental ROI was −63% while naive estimates said over 1,000%. [research, 4, read; field experiment; one large, well-known firm]
- Read together: the prior that a new channel works is low, and a founder's own read of a channel's return can be far off. A channel already shown to bring users has passed the test most channels fail. That supports some boost. [derived from 1, 4]
- Caveat: both are paid ads for big, known brands. Neither measures community posts, launch sites or search pages at founder scale. [derived]

## 2. At small scale, returns do not fall fast in general

- Response to advertising is mostly modelled as concave. But in two durable categories, low spending often sat in an "ineffective regime", with a region of increasing returns above it. More spending raised the chance of being above the threshold. No threshold was found for detergent. [research, 3, read; 57 brands in three US categories; endogeneity not addressed]
- Ad elasticity is higher for products in the growth stage (0.16) than mature ones (0.11), short-term. Elasticity fell over decades (0.13 before 1980, 0.10 after). [research, 2, read; meta-analysis, 751 short-term estimates from 56 studies]
- So a small effort on a channel is more likely to sit below its saturation point than at it. The decline that is documented is over years, across a whole market (sources 2, 10), not over a founder's next few weeks. [derived from 2, 3; 10 is practitioner]
- Chen's "law": every channel's click-through falls over time as it fills up; banners went from 78% (1994) to 0.05% (2011). His advice is to keep pushing working channels while looking for the next one. [practitioner, 10; two data points from different eras and formats]

## 3. Where saturation is fast: the same audience, the same content

- On Reddit, resubmitting the same image lost popularity with each submission, modelled as exponential decay. The penalty fades with time between posts. It is strongest in the same community. Content that succeeded in a popular community "will not be successful again"; content from a niche community can still succeed in a larger one. [research, 5, read; 132,307 submissions of 16,736 images, 867 communities; images, not product posts]
- Paid search worked only on people who didn't already buy: the effect was largest for users with no purchase in the past year and near zero for frequent buyers. [research, 4, read]
- The mechanism in both: more effort on a channel pays when it reaches people the channel hasn't reached yet. It stops paying when it shows the same thing to the same people. [derived from 4, 5]
- For the bets: "answer questions" or "comparison pages" add new content for new searchers, so they don't hit this. "One launch-site post" (now "Posts on two launch sites") after a launch that brought users is the resubmission case: the same product, to the same crowd. [derived]

## 4. Users from different channels are not equal

- At a financial-services firm, customers from direct mail kept and cross-bought less; radio and TV customers kept less; web-site customers kept more. [research, 6, abstract-only; one firm; observational]
- Customers from Google search ads at a small US firm bought more often than those from other channels; counting repeat and offline purchases raised their value a lot. [research, 7, abstract-only; one firm]
- At a free web-hosting firm, word-of-mouth sign-ups added nearly twice the long-term value of marketing-driven ones. Marketing's effect settled in about three weeks, word of mouth's in about six. [research, 8, secondary; one firm, 70 weeks; numbers via IESE, not the paper]
- So "brings users" is a weaker signal than "brings users who stay". The direction differs by firm and channel; no source ranks channels in general. [derived from 6–8]

## 5. Exploit, but keep testing

- Shifting display impressions toward the ads that were converting, while still testing others, raised the acquisition rate 8% over a control policy, at no extra cost. [research, 9, abstract-only; 750 million impressions; one bank; ad versions, not channels]
- This fits a boost (rank proven channels up) over a rule (only proven channels). The current matcher already does that: boosted bets sort higher, others stay listed. [derived from 9]

## What this changes

1. **`CHANNEL_BOOST` value: no change.** No source measures a proven channel against a new one at founder scale, so nothing sizes 1.5. Sections 1–2 support keeping a boost; nothing here says returns fall fast at small effort in general. The code comment can cite this note instead of "rule of thumb" alone. [derived]
2. **Condition: don't boost `launch-sites` for the launch-sites kind.** That entry rewards repeating a launch where one already worked, which is the resubmission case in §3. Proposed: remove `launch-sites` from the `launch sites` kind's `bets`, and have `fitReason` add for that profile: "You already launched on one site. The same post on the same site rarely does as well again; try a site you haven't used, or wait for real news." Test (in `test/smallBets.test.ts`): a profile with `channels: [{ name: "Product Hunt", how: "referrer" }]`, launched, stage 1 → `launch-sites` is in fitsNow with the unboosted `betScore`, no `workingChannel`, and a reason matching `/site you haven't used/`. Today it gets `score × 1.5`.
3. **Not proposed:** a saturation check on other kinds. No source gives a saturation sign a founder could report for search pages, answers or word of mouth. [derived]

## What this does not settle

- No primary study compares more effort on a proven channel with a new channel for early-stage firms. Searches found only practitioner posts.
- Sources 1–4 and 9 are paid ads at large firms. Source 5 is images on Reddit, not product launches; it shows decay for the same content, not for a new post about a new version.
- Sources 6–8 were seen as abstracts or a secondary account; each is one firm.
- Whether a channel the founder recalls (research/channel-answer-accuracy.md) is the channel that brought the users who stayed is not addressed here.
