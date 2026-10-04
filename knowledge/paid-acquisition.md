---
title: Paid acquisition
summary: Running paid search and paid social profitably in the automated era; break-even math, signal quality, creative as targeting, account structure, measurement after ATT and Consent Mode, and when to stop.
tags: paid media, ppc, google ads, meta ads, facebook ads, linkedin ads, performance max, advantage+, roas, cpa, cpc, creative, conversion api, consent mode, retargeting, brand search
---

## Do the math first

Run paid_media_math before spending:
- **Break-even ROAS** (first order) = 1 ÷ contribution margin. At 40% margin you need 2.5× just to break even.
- **Break-even CPA** = AOV × margin (first order), or lifetime gross profit if you can finance payback.
- **Max CPC** = target CPA × conversion rate.
If the implied CPA at realistic CPC and CVR is above break-even, no amount of optimisation in the account fixes it. The fix is in the offer, price, margin, AOV or conversion rate.

## What the algorithms changed [first-party / practitioner]

Google Performance Max and Meta Advantage+ (with Meta's Andromeda retrieval system, 2025) automate targeting, bidding and placement. The levers you still control:
1. **Conversion signal quality**: optimise toward the event that represents value (qualified lead, purchase with value), not a cheap proxy. Use value-based bidding; import offline conversions (CRM stages) for lead-gen; implement Meta Conversions API and Google enhanced conversions to recover signal lost to browsers, ATT and consent.
2. **Creative volume and diversity**: with broad targeting, the creative selects the audience. Supply several conceptually different creatives (different angles, formats, hooks), not minor variations, and refresh as they fatigue. Agency-claimed numbers ("8–12 concepts", "+22% ROAS") are not established facts.
3. **Exclusions and constraints**: brand exclusions, negative keywords (PMax gained campaign-level negatives in 2025), placement exclusions, customer list exclusions for acquisition campaigns.
4. **Budget and structure**: algorithms need data. Consolidate campaigns so each optimises on dozens of conversions per week rather than a handful. Fragmented structures starve learning.
5. **Landing page and offer**: the biggest lever, outside the platform.

## Measurement after privacy changes [first-party]

- iOS App Tracking Transparency opt-in averaged ~35% (Adjust, 2025); Meta reports a partly modelled, delayed view of iOS conversions.
- Google Consent Mode v2 has been required for EEA ads measurement and remarketing since March 2024; without it you lose EEA conversion data and audiences. Advanced mode enables modelled conversions.
- Third-party cookies remain in Chrome (Google abandoned deprecation; most Privacy Sandbox APIs retired Oct 2025). Safari and Firefox still block them.
- Consequence: platform numbers are partly modelled and all attributed. Validate important channels with lift or geo tests (see metrics-and-measurement).

## Where attribution lies most

- **Brand search**: often captures people who'd have arrived anyway. eBay saw ~99.5% of lost paid clicks return via organic when it paused brand ads. Test with a geo or time holdout, especially if no competitor bids on your brand.
- **Retargeting**: reaches people already likely to convert. Measure with a holdout before treating its ROAS as real.
- **View-through conversions**: credit for ads that may never have been noticed. Check the attribution window settings.

## Channel notes [practitioner]

- **Search** captures existing demand; it can't create it. Useless for products nobody searches for yet.
- **Paid social** creates demand and can target broad interest; it needs strong creative and a clear, low-friction offer.
- **LinkedIn**: expensive per click but precise B2B targeting; works best for high ACV, account-based programs and content distribution, rarely for cheap self-serve.
- **Copy limits**: use check_copy_limits for Google RSA (30/90), PMax, Demand Gen, Meta, LinkedIn, X and TikTok.

## Testing and scaling

- Give tests enough budget for statistically meaningful conversion counts; judge on CPA/ROAS at the margin, not averages.
- Scaling raises marginal CPA (you exhaust the cheapest audience first). Increase budget in steps and watch marginal, not blended, numbers.
- Every channel decays: refresh creative on a schedule and keep testing new channels (see channel-strategy).

## When to stop or cut

- Implied CPA above break-even with no realistic path to fix it.
- Cohorts from the channel churn faster than others (check unit_economics by channel).
- A holdout test shows little incremental lift.
- Spend is mostly brand search and retargeting with no prospecting: you're paying to capture demand you already had.

## Sources

research/landscape-2026.md §1, §5 (Google Privacy Sandbox update 2025; Adjust 2025; Consent Mode v2; Meta Andromeda; Google PMax 2025); research/measurement.md §1 (Blake, Nosko & Tadelis 2015; Gordon et al. 2019); research/platform-specs.md.
