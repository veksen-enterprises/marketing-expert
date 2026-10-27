# In product tests, do choice formats predict real buying better than ratings? (checked 2026-10-27)

Question: `choice-vs-rating.md` §3 proposes for `knowledge/customer-research.md`: "Ask friends to choose between two versions you made, not to rate one." Its only source is forced-choice personality tests in hiring, and §4 found no product study. In product and concept testing, do choice formats (comparing variants, MaxDiff, choice-based conjoint) predict real purchase or adoption better than rating or purchase-intent scales?

Hop 1 from `choice-vs-rating.md` §4. Access marks as in `founder-test-samples.md`. Hypothetical bias in stated willingness to pay is covered in `early-stage-gtm.md` items 8–9 and incentive-aligned conjoint in `early-stage-gtm-devtools.md` [110][111]; not repeated here.

## Sources

1. Morwitz, V.G., Steckel, J.H. & Gupta, A. (2007). "When do purchase intentions predict sales?" *International Journal of Forecasting* 23(3):347–364. doi:10.1016/j.ijforecast.2007.05.015. Copy: https://www.academia.edu/14363670/When_do_purchase_intentions_predict_sales [read 2026-10-27; full text of the academia.edu copy, last ~18% (part of the tables) not read]
2. Chapman, C.N., Alford, J.L., Johnson, C., Weidemann, R. & Lahav, M. (2009). "CBC vs. ACBC: Comparing Results with Real Product Selection." *Sawtooth Software Conference Proceedings*. https://quantuxbook.com/papers/REPRINT-sawtooth09-chapman-et-al-CBC-vs-ACBC.pdf [read 2026-10-27; conference paper; first author at the product's maker]
3. Natter, M. & Feurstein, M. (2002). "Real world performance of choice-based conjoint models." *European Journal of Operational Research* 137:448–458. Copy: https://www.academia.edu/19661960/Real_World_Performance [read 2026-10-27; the market-share-bias figures differ between text and table]
4. Wlömert, N. & Eggers, F. (2016). "Predicting new service adoption with conjoint analysis: external validity of BDM-based incentive-aligned and dual-response choice designs." *Marketing Letters* 27(1):195–210. doi:10.1007/s11002-014-9326-x. https://research.cbs.dk/da/publications/predicting-new-service-adoption-with-conjoint-analysis-external-v/ [abstract-only, 2026-10-27]
5. Quaife, M., Terris-Prestholt, F., Di Tanna, G.L. & Vickerman, P. (2018). "How well do discrete choice experiments predict health choices? A systematic review and meta-analysis of external validity." *European Journal of Health Economics* 19(8):1053–1066. doi:10.1007/s10198-018-0954-6 [abstract-only, 2026-10-27]
6. Cohen, S.H. (2003). "Maximum Difference Scaling: Improved Measures of Importance and Preference for Segmentation." Sawtooth Software Research Paper Series. https://content.sawtoothsoftware.com/assets/9f93cf26-f9d0-494f-ba1b-afaea2e3968c [read 2026-10-27; practitioner paper published by a MaxDiff software vendor]
7. Chrzan, K. & Golovashkina, N. (2006). "An empirical test of six stated importance measures." *International Journal of Market Research* 48(6). Copy: https://content.sawtoothsoftware.com/assets/7852483d-f938-40bb-9877-2ef67f2820bc [read 2026-10-27; vendor-hosted copy]
8. Karniouchina, E.V., Moore, W.L., van der Rhee, B. & Verma, R. (2009). "Issues in the use of ratings-based versus choice-based conjoint analysis in operations management research." *European Journal of Operational Research* 197(1):340–348. Copy: https://ecommons.cornell.edu/bitstream/1813/71996/1/Verma28_Issues_in_the_use_of_ratings_based_vs_choice_based.pdf [read 2026-10-27; its review of Elrod et al. 1992, Moore et al. 1998 and Moore 2004 is secondary]
9. Schramm, J.B. (2025). "Incentive alignment in conjoint analysis: a meta-analysis on predictive validity." *Marketing Letters* 36:533–546. doi:10.1007/s11002-025-09764-8 [read 2026-10-27]
10. Jamieson, L.F. & Bass, F.M. (1989). "Adjusting stated intention measures to predict trial purchase of new products." *Journal of Marketing Research* 26(3). [not reached: publisher, JSTOR and OpenAlex blocked; two papers citing it give no findings]

## 1. Asking for intent while comparing two variants tracked sales; asking about one did not

- One packaged-goods maker ran 60 product tests (over 16,000 consumers). Intent was a 5-point "likelihood of purchase" scale; the score per product was the top-box share. The outcome was 12-month unit sales, adjusted for distribution. [research, 1, read]
- When respondents compared the product "to a different product variant", top-box intent correlated with sales at r = .53 across 40 products. When they rated it alone, r = .09 across 20 products. Only the comparative correlation was significant. No test of the difference is reported. [research, 1, read; one firm; packaged goods; correlation across products, not people]
- Confound: every new product was tested in comparative mode, and new products alone gave r = −.18. The authors say the comparative figure "might be understated" and that they "must be extremely cautious". [research, 1, read]
- What the comparison product was (the firm's own variant, a competitor, the current product) is not stated. [research, 1, read]
- This is the only product study found where a comparative format beat a single-product format against real sales. It compares intent asked two ways, not choice against rating. [derived from 1]

## 2. Choice formats beat ratings on stated criteria; no real-behaviour test

- IT managers, split three ways: MaxDiff predicted held-out rank orders at 97% of test–retest reliability, paired comparisons 88%, ratings 85%. Ratings were the fastest (97 s vs about 300 s). [practitioner, 6; one study, n≈120 per arm; vendor-published; no significance test on the holdout]
- 1,284 restaurant customers, six importance methods: MaxDiff, Q-sort and constant sum predicted the same person's overall satisfaction best (MaxDiff 0.62); importance ratings 0.30. [research, 7, read; one category; the criterion is a stated satisfaction rating in the same survey, not behaviour]
- Ratings-based versus choice-based conjoint, across five studies: hit rates on held-out survey choices are mixed, with choice slightly ahead more often; predicted shares show no consistent difference. In the authors' laptop study, choice won mainly because a rating model never predicts "keep shopping" (15% of answers). Excluding that option, shares did not differ significantly. [research, 8, read; holdouts are stated choices, not purchases]
- Choice formats separate options more sharply. None of sources 6–8 checks against what people later bought. [derived from 6–8]

## 3. Choice formats against real behaviour: direction right, individuals poorly predicted, uptake overstated

- 400 adults did a conjoint on a PC accessory; 100 then picked one of two products free. Conjoint predicted each person's real pick barely better than chance (kappa 0.14 and 0.08). At the market level, the adaptive version came within about 8 points of six months of sales. [research, 2, read; one product; conference paper]
- Conjoint on 43 grocery and toiletry items against two years of scanner sales: predicted shares explained about half the variance in real shares (r² 0.47–0.50). Models that did best on held-out survey choices did not do better on real sales. [research, 3, read; four categories; Austria]
- 2,679 music buyers did a choice conjoint before a streaming service launched and were recontacted five months later. Adding an incentive, or a second question ("would you actually buy the one you chose?"), improved prediction of real adoption. [research, 4, abstract-only; size of gain not seen]
- Health choice experiments against later real choices (6 studies pooled): 88% of people who did take up were predicted to; only 34% of people who didn't were predicted not to. Stated choices overpredict uptake. [research, 5, abstract-only; health, not products]
- Incentive alignment raises conjoint hit rates by 12% (134 effect sizes, 34 papers), larger for durables and services. Its criterion is held-out survey choices; the author notes real-market validation is rarely done. [research, 9, read]

## 4. Read together

- For "which of two versions wins", a comparison is the better format: it separates options more sharply [6, 7], and the one product field study favours comparative asking [1]. [derived from 1, 6, 7; weak: one confounded field study, the rest stated criteria]
- For "will anyone buy", no format is good. Choices overstate uptake unless a "neither" or "would you actually buy it" step is added [4, 5]; that step is itself a stated answer. [derived from 4, 5]
- No study found puts a choice format and a rating format against real purchases of the same product in the same sample. [derived]

## 5. What this changes

**Corrected by `dual-response-and-new-products.md` (hop 2):** source 1's Table 4 shows every new product was tested comparatively and the r = .53 / .09 gap tracks established versus new products, not the way of asking. Item 1's r = .53 / .09 sentence should not enter a playbook; the rest stands.

1. **`knowledge/customer-research.md`: keep the `choice-vs-rating.md` §3 claim; add a product source and a limit.** Proposed text: "Ask friends to choose between two versions you made, not to rate one. In one firm's product tests, intent asked while comparing two versions tracked later sales (r = .53, 40 products); asked about one product alone it did not (r = .09, 20 products) [research; one packaged-goods firm; new products all tested comparatively]. A choice tells you which version wins, not whether anyone will buy: stated choices overpredict uptake [research; meta-analysis, 6 studies; health choices; abstract only]." Traces to sources 1 and 5.
2. **`check_answer` band note (proposed in `founder-test-samples.md` §4 item 1, not built): one more unchecked line.** When the stop line counts a pick between versions ("pick", "prefer", "choose", "version A/B"), the note says: "This shows which version these people prefer, not how many will buy." Test: move with stop line "If fewer than 12 of 20 friends pick version B, keep A" returns a note containing "not how many will buy"; a stop line "If fewer than 3 of 20 pay" does not. Only worth building with that band note; no observed failing answer yet, so not proposed alone.
3. **`early-stage-gtm.md` item 9 can move from snippet-only to read.** Source 1's full text confirms the six conditions and the "two studies" framing. (Not edited here.)

## 6. What this does not settle

- Source 1's comparative mode still ends in a rating; it is not a forced choice. Its comparison product is unknown, so it neither supports nor contradicts §3's "not against what they use now".
- Every respondent here was a stranger to the maker. Whether comparing resists a friend's kindness in product feedback is still only inferred from `choice-vs-rating.md` source 1.
- Sources 4, 5 and 10 were not read in full; Jamieson & Bass was not reached.
