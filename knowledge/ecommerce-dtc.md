---
title: E-commerce and direct-to-consumer (DTC)
summary: Playbook for online retail and DTC brands; contribution margin per order as the base of every decision, first-order vs repeat economics, cohort repeat rate, AOV levers, paid social/search/Shopping, SMS consent, Amazon vs own store, wholesale, reviews, returns, MER and incrementality, and what works by stage.
tags: ecommerce, e-commerce, dtc, direct to consumer, shopify, online store, contribution margin, aov, average order value, repeat purchase, cohort, mer, blended roas, google shopping, performance max, merchant center, meta ads, sms marketing, tcpa, amazon, fba, wholesale, retail, reviews, ugc, returns, free shipping
---

## Start with contribution margin per order

Every DTC decision (what to spend on ads, which discount, which channel) depends on how much money one order leaves after the costs that the order itself causes. That is **contribution margin per order** (CM):

CM per order = order revenue (after discounts) − product cost (COGS) − pick, pack and shipping − payment fees − expected return cost − variable marketing such as affiliate commission.

- **Expected return cost** = return rate × (return shipping + handling + value lost on items you can't resell). US retailers estimated 15.8% of 2025 sales would be returned, and online orders return more often (about 19% estimated) [vendor survey, NRF/Happy Returns]. Use your own rate by category; apparel is usually far higher than the average [rule-of-thumb].
- **Gross margin is not contribution margin.** A product with 65% gross margin can have 30% CM after free shipping, fees and returns. Paying for ads using gross margin overstates what you can afford.
- Put CM (as a share of AOV) into **paid_media_math** as `margin`: break-even ROAS = 1 ÷ CM%. At 30% CM you need 3.3× attributed ROAS just to break even on the first order (see paid-acquisition).
- Separate **CM1** (after product and fulfilment costs), **CM2** (after marketing). Fixed costs (team, software, rent) come after. Most DTC failures are a CM2 that never turns positive at scale [practitioner].

## First-order vs repeat economics

- **First-order profit** = CM per first order − CAC (cost to acquire a customer). Most DTC brands lose money on the first order in paid channels and need repeat orders to pay it back [practitioner].
- Decide on purpose which game you are in:
  - **Profitable on first order**: required when repeat purchase is rare (furniture, mattresses, one-off gifts) or when you can't finance a long payback.
  - **Payback over N months**: only if cohort data, not hope, shows repeat purchases. Set a payback limit (e.g. 3, 6 or 12 months) based on cash you actually have.
- The **unit_economics** tool is built for subscriptions (monthly churn). For repeat-purchase retail, build the cohort table below instead, or convert a subscription product's numbers directly.
- **Subscriptions** (subscribe-and-save) raise repeat revenue but add churn, discount cost and customer-service work. Treat subscribe-and-save discount as a CM cost.

## Cohort repeat rate

- Group customers by **first-order month** (a cohort). For each cohort track: % who place a 2nd order by day 30/60/90/180/365, orders per customer, and cumulative CM per customer.
- The **second order** is the key step. Customers who buy twice are far more likely to buy again [practitioner]. Manage the time between order 1 and order 2 with flows (see below) and product (consumables, refills, sizing).
- Compare cohorts by **acquisition channel and first product**. Discount-led or giveaway cohorts often repeat less; check before scaling a channel or offer.
- Blended repeat rate rises as old loyal customers pile up and hides weaker new cohorts (see metrics-and-measurement for cohort maths).
- Published "average repeat rate" figures come from Shopify apps and agencies [vendor]; your category and price point matter more.

## AOV levers (average order value)

- **Free-shipping threshold** set somewhat above current AOV. In one retailer's experiments, shoppers were very sensitive to shipping fees and free-shipping offers raised sales, but the lost shipping revenue made them unprofitable for that retailer [research, Lewis, Singh & Fay 2006, single retailer]. Model the threshold against CM, not revenue.
- **Bundles and kits** (starter kit, refill pack) raise AOV and make a better first experience.
- **Quantity breaks** and "complete the set" cross-sells on product and cart pages.
- **Post-purchase upsell** (one-click offer after checkout) adds revenue without adding checkout friction.
- Each lever must raise **CM per order**, not just AOV. A bundle at a deep discount can raise AOV and lower profit.
- Test AOV changes with the revenue t-test (see experimentation; use the revenue test, not a conversion test).

## Paid acquisition for e-commerce

General rules (signal quality, creative as targeting, brand search and retargeting caveats) are in paid-acquisition. E-commerce specifics:
- **Google Shopping / Performance Max with a Merchant Center feed**: Shopping ads use your product data, not keywords, to decide where to show [first-party, Google Ads Help]. The **product feed** is your ad copy: clear titles (brand + product type + key attribute such as size or colour), accurate price and availability, good images, correct GTINs (barcodes) [first-party / practitioner].
- Pass **order value and margin** where possible: value-based bidding on revenue optimises for revenue, not profit. Some brands send profit-adjusted values or exclude low-margin products from campaigns [practitioner].
- **Separate new-customer acquisition** from returning customers (customer-list exclusions or new-customer goals) so the algorithm doesn't spend to "acquire" people who already buy.
- **Paid social** (Meta, TikTok) creates demand for products people don't yet search for. It lives or dies on creative.

**Creative testing** [practitioner]:
- Test **concepts** (different problem, audience, proof or format), not small edits. Examples: founder story, product demo, before/after, customer testimonial video, comparison against the usual alternative, unboxing.
- UGC-style video (real customers or creators filming on a phone) is the standard format on Meta and TikTok; it must still follow FTC endorsement disclosure rules.
- Judge creative on cost per **new** customer and on the cohort's later repeat rate, not only on click-through or platform ROAS.
- Plan a steady supply of new concepts; winners fatigue.

## Email and SMS flows

The deliverability, metric and holdout rules are in email-and-lifecycle. The core e-commerce flows, in rough order of value [practitioner]: welcome series (to first purchase), abandoned checkout, abandoned cart, browse abandonment, post-purchase (how to use, cross-sell, review request), replenishment (timed to when the product runs out), win-back. Keep a holdout to see real lift.

**SMS consent in the US** [legal; this is not legal advice, ask a lawyer]:
- Marketing texts sent with automated systems need the person's **prior express written consent** under the TCPA (Telephone Consumer Protection Act). Consent must be clear and specific; it cannot be a condition of purchase [legal summaries; not re-verified this session].
- The FCC's stricter "one-to-one consent" rule was **vacated** by the Eleventh Circuit in January 2025 before it took effect; the existing written-consent standard still applies [legal].
- Since April 2025, people can **revoke consent by any reasonable means**; replies such as STOP, QUIT, CANCEL, UNSUBSCRIBE, END must be honoured, within 10 business days at the latest [legal].
- Carrier rules (CTIA) add: clear opt-in language (brand, message type, frequency, "msg & data rates may apply"), a confirmation text, opt-out instructions, and **10DLC registration** of your brand and campaign [industry rules].
- Several US states have their own stricter "mini-TCPA" laws and quiet hours [not re-verified]. Outside the US, local consent law applies (e.g. GDPR/ePrivacy in the EU).

## Amazon and other marketplaces vs your own store

| | Amazon | Own store (e.g. Shopify) |
|---|---|---|
| Demand | Existing shoppers with purchase intent | You must bring all traffic |
| Fees | Referral fee, mostly 8–15% by category, plus $39.99/month Professional plan; FBA fulfilment and storage on top [first-party, Amazon] | Payment fees + your own fulfilment |
| Customer data | Very limited; can't email buyers for marketing | Full: email, SMS, cohorts |
| Pricing and brand | Price competition, other sellers on your listing, ads needed for visibility | Full control |

- Amazon is often where shoppers check reviews and price even when they found you elsewhere. Many brands see their own ads lift Amazon sales, which their store attribution never shows [practitioner]. Measure total sales across channels (see MER below).
- Risks: account suspension, fee changes, Amazon's own products. See platform-and-feature-risk.
- Enrol in **Brand Registry** before scale to control listings and fight counterfeits [first-party, not re-verified].
- Rule: use Amazon for reach and search demand; use your store for repeat customers, bundles, subscriptions and data.

## Retail and wholesale expansion

- Wholesale margins are lower (the retailer takes its share) and come with costs: slotting or placement fees in some grocery chains, promotional spending, returns of unsold stock (chargebacks), and 30–90-day payment terms [practitioner]. Model cash flow, not just margin.
- Retail works when your product sells **without you explaining it**: clear packaging, a known category, proof from online sales velocity.
- Start with a small set of stores or a regional chain, measure sales per store per week, and support it with local demand. A failed national rollout is hard to undo.
- Retail presence often lifts online search and brand demand; measure with geo comparisons (see metrics-and-measurement).

## Reviews and UGC

- Reviews move conversion most when a product has **none**: one analysis found purchase likelihood with five reviews was about 270% higher than with zero, with diminishing gains after the first few, and a bigger effect on higher-priced items [research centre with vendor data, Spiegel 2017].
- Ask for reviews in the post-purchase flow, timed to when the customer has used the product.
- **US FTC rule (in force 21 October 2024)**: no fake reviews, no paying or rewarding reviews conditioned on positive sentiment, no suppressing negative reviews (narrow exceptions), with civil penalties for knowing violations [first-party / legal]. You may give a neutral incentive for any honest review only if you disclose it, and platforms like Amazon have stricter rules [legal; not re-verified].
- Show negative reviews. A perfect 5.0 can look fake [rule-of-thumb].
- Mine reviews for customer language for ads and product pages (see customer-research and messaging-and-copy).

## Returns policy

- **Lenient return policies increase purchases overall** (meta-analysis, Janakiraman et al. 2016) [research]. Details matter:
  - Longer return windows barely change purchases but were associated with **fewer** returns.
  - Lower effort (easy labels, drop-off points) raises purchases without raising returns.
- Most shoppers say free returns are a major purchase factor (82% in the 2025 NRF survey) [vendor survey].
- Reduce returns at the source: size guides, fit data, accurate photos, honest descriptions; read return reasons monthly.
- Offer **exchange or store credit first**, refund second; it keeps revenue.
- Return fraud is real (retailers estimated 9% of 2025 returns were fraudulent) [vendor survey]; add rules for repeat abusers rather than punishing everyone.

## Measurement: MER and incrementality

- **MER** (marketing efficiency ratio, also called blended ROAS) = total store revenue ÷ total marketing spend, across all channels [practitioner]. Platforms can't inflate it because it uses your real revenue. Track it weekly next to platform ROAS.
- Better still: **new-customer MER** (first-order revenue ÷ spend) or new-customer CAC, because total revenue includes repeat buyers who would buy anyway.
- MER tells you whether the whole system works, not which channel works. For that, run **holdout or geo tests** on the big channels, especially brand search, retargeting and Meta (see metrics-and-measurement).
- Add a "How did you hear about us?" question after checkout; it catches podcasts, creators and word of mouth that clicks miss [practitioner].
- Always look at all sales channels (store + Amazon + retail) together when judging an ad channel.

## What usually works by stage

| Stage | Focus | Usually works | Usually wastes money |
|---|---|---|---|
| Pre-launch / < $1M revenue | Prove people buy and come back | Founder-led social content, small creator seeding, waitlist, one hero product, Meta with simple offers, Google Shopping on brand and core terms, welcome + abandoned-cart flows | Big agency retainers, many SKUs, retail before online proof |
| $1–10M | Scale one paid engine without killing CM | Structured creative testing, PMax/Shopping with clean feed, post-purchase and replenishment flows, reviews program, Amazon if category demand is there, cohort reporting | Chasing platform ROAS, constant site-wide discounts |
| $10M+ | Add channels and defend margin | Incrementality tests, MMM (see metrics-and-measurement), wholesale/retail pilots, brand campaigns (see brand-and-demand), new product lines for repeat | Expanding channels before measuring the existing ones |

## Common mistakes

- Using gross margin instead of contribution margin for ad targets.
- Scaling a channel because first-order ROAS looks fine, without checking whether its cohorts repeat.
- Discounting so often that customers wait for the sale.
- Free shipping thresholds set without modelling CM.
- Treating attributed ROAS from each platform as additive; the sum is often larger than total revenue.
- Sending SMS to numbers collected without proper written consent.
- Incentivising only positive reviews or hiding bad ones (now a US federal violation).

## Sources

research/ecommerce-and-marketplaces.md (NRF/Happy Returns 2024–2025; Janakiraman, Syrdal & Freling 2016; Lewis, Singh & Fay 2006; Spiegel Research Center 2017; FTC Consumer Reviews and Testimonials Rule 2024; Amazon seller pricing; Google Ads Help on Shopping/PMax; Eleventh Circuit 2025 one-to-one consent decision; FCC 2025 revocation rules; CTIA 2023; Common Thread Collective on MER); research/measurement.md (incrementality, holdouts).
