---
title: Pricing and packaging
summary: Value metrics, packaging (good-better-best, leaders/fillers/killers), willingness-to-pay research, price psychology with its replication record, trials vs freemium, price increases and discounting.
tags: pricing, packaging, willingness to pay, value metric, usage based pricing, freemium, free trial, reverse trial, discount, price increase, van westendorp, conjoint, decoy, charm pricing
---

## Order of decisions

_In short:_ Decide in order: customer segments, what unit to charge by, what goes in each tier, then price points, then trial or free model. Most teams jump to copying a competitor's number.

1. **Segments by need and willingness to pay**, not by firmographics. "One size fits none." (Ramanujam & Tacke, Monetizing Innovation, 2016) [practitioner]
2. **Value metric**: the unit you charge per (seats, contacts, API calls, transactions, revenue processed). Choose the unit that grows as the customer gets more value, so revenue expands with them. Per-seat is right only when value scales with users.
3. **Packaging**: which features go in which tier.
4. **Price points**, from willingness-to-pay research and competitive context.
5. **Monetisation model**: free trial, freemium, reverse trial, sales-only.

Most teams start at step 4 and copy a competitor's number.

## Packaging [practitioner, with research on the mechanisms]

_In short:_ Good-better-best tiers turn buy-or-not into which-one, and middle options tend to win. Decoy options work less reliably than often claimed, so test them.

- **Leaders, fillers, killers** (Ramanujam): leaders drive purchase and WTP, so tiers are built around them; fillers round out a tier; killers reduce WTP when bundled and should be add-ons.
- **Good-better-best** turns "buy or not" into "which one". Supported by the **compromise effect**: middle options gain share, extremes lose it (Simonson & Tversky 1992) [research]. A premium tier pulls choices toward the middle tier.
- **Decoy / attraction effect** (Huber, Payne & Puto 1982) [research, contested]: adding an option dominated by the target raises the target's share. Frederick, Lee & Baskin (2014, 19 studies) found it largely confined to stylised numeric comparisons; it often vanished or reversed with realistic stimuli. Field evidence exists (Wu & Cosguner 2020, diamond retailer: shoppers noticed the decoy only 11–25% of the time; ~14% estimated profit uplift). Ariely's Economist subscription example is a classroom demo, not a replicated study. Use: decoys work best when tiers are compared on clean numbers and dominance is obvious; test, don't assume.
- **Feature-shock** (cramming everything into one product priced for nobody) and **minivation** (underpricing) are Ramanujam's most common failure modes.

## Willingness-to-pay research

_In short:_ Survey methods can estimate what customers will pay, but answers are hypothetical. Match the method to your situation and validate real prices in the market with a holdout.

| Situation | Method |
|---|---|
| Early concept, no price anchor | Van Westendorp PSM, or Ramanujam's three questions: acceptable / expensive / prohibitively expensive. True WTP usually sits near "expensive" |
| One defined product, need a price point | Gabor-Granger (would you buy at $X? step up/down) |
| Tier design, feature-level WTP, competitive context | Choice-based conjoint (larger sample, expert design) |

- **Van Westendorp** (1976): too cheap / cheap / expensive / too expensive; read the acceptable range off curve intersections. Measures price perception, not purchase; assumes the respondent knows the category's prices. Add Newton–Miller–Smith purchase-likelihood questions to get a demand curve.
- **Gabor-Granger** (1966) is so obviously a pricing game to respondents that answers may not predict real purchases, and it says nothing about which features drive value (Sawtooth) [vendor].
- All survey WTP is hypothetical. Validate in market (test price on new signups, by segment or region, with a holdout).

## Price psychology: what holds up

_In short:_ Prices ending in 9 can lift sales a little, fairness matters when raising prices, and constant discounts lower what buyers expect to pay. Effects are often small in business purchases.

- **Left-digit effect** [research]: $2.99 is perceived as meaningfully smaller than $3.00 only when the left digit changes (Thomas & Morwitz 2005). Field: Anderson & Simester (2003) catalog experiments; $9 endings raised demand, including $39 outselling $34; stronger for new items. A 2022 online experiment (Fenneman et al., n=266) found no effect. Expect small effects in considered B2B purchases; round prices are often used to signal premium (practitioner).
- **Fairness** [research]: raising prices to pass on costs is accepted; exploiting demand spikes is seen as unfair (Kahneman, Knetsch & Thaler 1986: 82% rated a post-storm snow shovel price rise unfair). Tie increases to added value or cost.
- **Reference prices** [research]: frequent and deep promotions lower the price buyers expect (Kalwani & Yim 1992). Sale signs lose effect as more products carry them (Anderson & Simester 2001).
- **Discounts can drive away recent buyers** [research, replicated across 2 firms]: in a 28-month field experiment with 50,000+ customers, customers who saw a lower price than they'd recently paid bought less across the whole firm, strongest among the best customers. Among customers who had paid a high price for a discounted item in the previous 3 months, orders fell about 15% and revenue by more than $90 per customer over 28 months; the effect lasted more than a year but faded (Anderson & Simester 2010).

## Usage-based pricing [vendor data]

_In short:_ Charging by usage ties price to value and grows with the customer, but revenue becomes less predictable. The supporting data comes from vendors and self-selected surveys.

OpenView surveys: companies using some usage-based pricing rose from 34% (2020) to 61% (2022); hybrid (platform fee + usage) was the most common form. Usage-based companies reported higher net dollar retention (the same idea as NRR), but these are self-selected surveys by a VC that invested in such companies, and infrastructure/API businesses dominate the usage-based group. Trade-off: price tracks value and expands with the customer; revenue is less predictable and falls when the customer's usage falls.

## Trials, freemium, reverse trials [vendor / practitioner]

_In short:_ Optimise for paid customers per visitor, not trial conversion rate. Card-required trials convert more of fewer signups, freemium brings more signups and fewer payers, and reverse trials lack published data.

- **Card-required trials** convert more trials to paid (Totango 2012 via Chargebee: ~50% vs ~15%) but draw far fewer signups; end-to-end visitor-to-paid was reportedly ~2× higher for no-card trials. The original report could not be located; treat as directional. Optimise for paid customers per visitor, not trial conversion rate.
- **Freemium**: OpenView 2022 benchmarks: median ~3 paid per 1,000 visitors for freemium vs ~7 for free trial, with freemium generating more signups and virality. Freemium is an acquisition model; it fits low marginal cost and collaborative/viral products.
- **Reverse trial** (popularised by Elena Verna): full paid tier for a limited time, then drop to a free tier instead of locking out. Verna says it "usually" lifts conversion about 20%, if users make heavy use of paid features during the trial; no published dataset.

## Price increases

_In short:_ Announce increases with reasons and notice, raise for new customers first, and expect churn among customers who weren't getting value. Indefinite grandfathering costs revenue.

- Announce with notice and the reason (added value, cost). Give existing customers time or a transition discount; indefinite grandfathering leaves revenue on the table and creates legacy plans that are expensive to support. [practitioner; no controlled data found]
- Raise for new customers first, measure conversion by segment, then migrate existing customers.
- Expect churn on price increases to concentrate among customers who weren't getting value; check activation and usage before blaming price.

## Flat team prices: check the per-seat equivalent [practitioner]

_In short:_ Convert a flat team price into a per-seat price at your smallest and largest target team and compare it with per-seat tools. A flat price fair at 20 seats can feel steep at 5.

Convert a flat team or organisation price into a per-seat price at the smallest and largest team you target, and compare it with per-seat tools the buyer already pays for. A flat price that is fair at 20 seats can read as steep at 5. For always-on monitoring tools, one buyer objection is that returns fade once the obvious problems are fixed; pricing tied to change (per repository, per pull request) may hold up better, but that is untested inference.

## Lifetime deals [rule-of-thumb]

_In short:_ A lifetime deal brings early cash but no repeat payments and often the wrong customers, so treat it as financing. Cap how many you sell and define what lifetime covers.

A one-off "lifetime" price (often sold through deal sites) brings early cash and users, but those buyers never pay again, tend to be deal-hunters rather than your target customer, and still cost support and hosting. Treat one as a financing decision, not a pricing tier:
- Cap the number sold and the end date, and say what "lifetime" covers (current plan features, the product's lifetime, not the buyer's).
- Recheck it when the paid plan gains features: a deal that includes "everything coming" gives away each new feature too.
- Compare its price with the modelled gross-profit lifetime value of a subscriber (unit_economics), not with list revenue.

## Common mistakes

_In short:_ Common mistakes: cost-plus or copied pricing, too many tiers, per-seat pricing when value doesn't scale with seats, default discounting, and reading 'too expensive' as proof the price is wrong.

- Pricing by cost-plus or by copying a competitor.
- Too many tiers, or tiers differentiated by features nobody values.
- Charging per seat for a product whose value doesn't scale with seats (it discourages adoption).
- Discounting by default to close deals, which teaches buyers the list price isn't real.
- Treating churn-survey "too expensive" answers as proof the price is wrong; it's usually value not realised.

## Sources

research/pricing.md (Ramanujam & Tacke 2016; Huber, Payne & Puto 1982; Frederick, Lee & Baskin 2014; Wu & Cosguner 2020; Simonson & Tversky 1992; Thomas & Morwitz 2005; Anderson & Simester 2001, 2003, 2010; Fenneman et al. 2022; Kahneman, Knetsch & Thaler 1986; Kalwani & Yim 1992; OpenView; Totango via Chargebee). Full texts could not be read during research; effect sizes are from abstracts and summaries.
