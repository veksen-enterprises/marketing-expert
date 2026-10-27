# Does "would you actually buy it?" fix stated choice, and does comparing help for new products? (checked 2026-10-27)

Question: `choice-formats-in-product-tests.md` proposes for `knowledge/customer-research.md`: "A choice tells you which version wins, not whether anyone will buy", backed in part by intent asked comparatively tracking sales (r = .53) and intent asked about one product not (r = .09). Two follow-ups. (a) How much does a second question after a choice ("would you actually buy the one you picked?", the dual-response design) improve prediction of real adoption? (b) Does the comparative-mode advantage in Morwitz, Steckel & Gupta (2007) hold within new products?

Hop 2 from `choice-formats-in-product-tests.md` §3 and §6. Access marks as in `founder-test-samples.md`. Incentive-aligned conjoint and hypothetical bias are covered in that note's sources 4 and 9 and in `early-stage-gtm.md` items 8–9; not repeated.

## Sources

1. Morwitz, V.G., Steckel, J.H. & Gupta, A. (2007). "When do purchase intentions predict sales?" *International Journal of Forecasting* 23(3):347–364. doi:10.1016/j.ijforecast.2007.05.015. Copy: https://www.academia.edu/14363670/When_do_purchase_intentions_predict_sales [read 2026-10-27; this session read the remaining text, including Table 4]
2. Wlömert, N. & Eggers, F. (2016). "Predicting new service adoption with conjoint analysis: external validity of BDM-based incentive-aligned and dual-response choice designs." *Marketing Letters* 27(1):195–210. doi:10.1007/s11002-014-9326-x. https://research.rug.nl/en/publications/predicting-new-service-adoption-with-conjoint-analysis-external-v/ and https://research.cbs.dk/da/publications/predicting-new-service-adoption-with-conjoint-analysis-external-v/ [abstract-only, 2026-10-27; the open publisher PDF at research.rug.nl/files/28440683/ and the Springer, ResearchGate and Springer Professional pages all failed to fetch]
3. Brazell, J.D., Diener, C.G., Karniouchina, E., Moore, W.L., Séverin, V. & Uldry, P.-F. (2006). "The no-choice option and dual response choice designs." *Marketing Letters* 17(4):255–268. https://ideas.repec.org/a/kap/mktlet/v17y2006i4p255-268.html [abstract-only, 2026-10-27]
4. Hung, C.-Y., Liu, Y.M., Brazell, J.D. & Allenby, G.M. (2025). "Dual response in conjoint analysis." *Marketing Letters*. doi:10.1007/s11002-025-09787-1. https://eccles.utah.edu/news/document/dual-response-in-conjoint-analysis [abstract-only, 2026-10-27; Springer page blocked]
5. Sawtooth Software. "CBC: None option" (Lighthouse Studio manual). https://sawtoothsoftware.com/help/lighthouse-studio/manual/cbc-none-option.html [read 2026-10-27; vendor documentation]
6. Morwitz, V.G. (2014). "Consumers' purchase intentions and their behavior." *Foundations and Trends in Marketing* 7(3):181–230. doi:10.1561/1700000036. https://nowpublishers.com/article/DownloadEBook/MKT-036 [not reached: the fetched copy held only front matter, contents and references; §4.1 "How Intentions are Measured" and §4.2 "The Type of Product" not seen]

## 1. Dual response: better prediction of real adoption, size not seen

- 2,679 music buyers did a choice-based conjoint before a streaming service launched; they were recontacted five months after launch and their real adoption compared with predictions. Four arms: standard, incentive-aligned, dual-response, and both. [research, 2, abstract-only; one service; one country not seen]
- Incentive alignment and dual response each improved prediction of adoption. Combining them added no further gain in prediction, but gave the most realistic willingness-to-pay figures. The authors recommend dual response when incentive alignment is not feasible. [research, 2, abstract-only; no hit rates, effect sizes or tests seen]
- Whether adoption was observed or self-reported at recontact is not stated in the abstract. [research, 2, abstract-only]
- Mechanism: in the second question respondents apply a budget limit they ignore when picking a favourite. A model with that limit fits better; the one-question model overstates the prices a market would bear. [research, 4, abstract-only; model and survey data, not purchases]
- A vendor manual says the separate "would you buy it?" question "dramatically increases" how often people say no, and that many researchers think it better reflects real intent. No figures. [vendor, 5]
- Dual response keeps the comparison data that a plain "none" option throws away, and leaves the other estimates largely unchanged. [research, 3, abstract-only; two conjoint studies; no real-purchase criterion]
- Read together: the direction is consistent, and the mechanism (people check their budget only when asked to buy) is plausible. The size of the gain against real adoption is not known from what was read. [derived from 2–5]

## 2. Comparative mode within new products: cannot be tested, and the advantage looks like a mix effect

Table 4 of source 1 (60 product tests, one packaged-goods firm; r between top-box intent and 12-month sales, across products):

| Split | r | Products |
|---|---|---|
| All | .414 | 60 |
| New / established / unknown | −.177 / .751 / .082 | 8 / 18 / 34 |
| Comparative / non-comparative | .530 / −.088 | 40 / 20 |
| Comparative only: new / established / unknown | −.177 / .767 / .068 | 8 / 17 / 15 |

[research, 1, read; only .751, .767, .414 and .530 significant]

- All 8 new products were tested comparatively; "there are no new product tests done in a monadic mode". The comparative advantage cannot be tested within new products. [research, 1, read]
- 17 of 18 established products were tested comparatively, so it cannot be tested within established products either. [derived from 1, Table 4]
- Within comparative mode, newness splits the result: established .767, new −.177. [research, 1, read; n=17 and 8; the new-product r is not significant]
- The non-comparative group is therefore 19 products of unknown newness plus one established product. Comparative products of unknown newness give r = .068 (n=15), no better than unknown-newness products overall (.082, n=34). [research, 1, read] So in the only stratum holding both modes, comparing shows no advantage. [derived from 1; small n; differences not tested]
- The .530 vs −.088 gap is best explained by which products went into each mode: established products, whose intent tracks sales, were nearly all tested comparatively. [derived from 1]
- Sign check: the text gives the non-comparative figure as r = .088; Table 4 gives −.088. `choice-formats-in-product-tests.md` used .09 from the text. [research, 1, read]
- For new products alone: intent correlated −.18 with sales (8 products, not significant), against .75 for 18 established ones. This is the read source for "stated intent is least reliable for new products". [research, 1, read; one firm; packaged goods; 8 products]

## 3. What this changes

1. **`knowledge/customer-research.md`: drop the r = .53 / .09 sentence proposed in `choice-formats-in-product-tests.md` §5 item 1.** Source 1's own Table 4 shows the gap tracks established versus new products, not the way of asking. Keep "ask them to choose between two versions" on the stated-criterion evidence only (that note's sources 6–7), tagged as such. Keep "a choice tells you which version wins, not whether anyone will buy". Do not add "then ask if they'd actually buy the one they picked" as an evidence-backed step: the gain against real adoption is real in one study but its size was not seen. The existing advice to ask for money or a signup (`first-customers.md`, "Validate with commitments") already covers the "will they buy" part. [derived from 1, 2]
2. **`knowledge/first-customers.md` line 42: "Stated purchase intent is least reliable for new products [research; snippet-only]" can become read, with qualifiers.** Proposed tag: `[research; one packaged-goods firm; r = −.18 across 8 new products vs .75 across 18 established; read]`. Traces to source 1, Table 4.
3. **No tool change.** No observed failing answer ties to this. The band-note line proposed in `choice-formats-in-product-tests.md` §5 item 2 ("This shows which version these people prefer, not how many will buy") stands unchanged; this note neither strengthens nor weakens it.

## 4. What this does not settle

- The size of the dual-response gain against real adoption, and whether adoption was observed or self-reported (source 2 full text not reached).
- Whether a plain "would you buy it?" asked of friends behaves like a conjoint dual response with strangers; source 2 used a full conjoint design, not a two-version pick.
- Whether comparing helps at all against real sales once newness is held fixed: source 1 cannot answer it, and no other product study was found. Morwitz (2014) §4.1–4.2 may review other evidence; not read.
- All of source 1's figures are correlations across at most 40 products from one firm, with no test of differences between correlations.
