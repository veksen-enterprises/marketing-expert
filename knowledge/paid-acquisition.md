---
title: Paid acquisition
summary: Running paid search and paid social profitably in the automated era; break-even math, signal quality, creative as targeting, account structure, measurement after ATT and Consent Mode, and when to stop.
tags: paid media, ppc, google ads, meta ads, facebook ads, linkedin ads, performance max, advantage+, roas, cpa, cpc, creative, conversion api, consent mode, retargeting, brand search
---

## Do the math first

_In short:_ Before spending, work out break-even: the return and cost per customer your margin allows; if realistic costs exceed it, no account tweaks will fix it, only the offer, price or conversion rate.

Run paid_media_math before spending:
- **Break-even ROAS** (first order) = 1 ÷ contribution margin. At 40% margin you need 2.5× just to break even.
- **Break-even CPA** = AOV × margin (first order), or lifetime gross profit if you can finance payback.
- **Max CPC** = target CPA × conversion rate.
If the implied CPA at realistic CPC and CVR is above break-even, no amount of optimisation in the account fixes it. The fix is in the offer, price, margin, AOV or conversion rate.

## What the algorithms changed [first-party / practitioner]

_In short:_ With automated campaigns, your levers are the quality of the conversion signal you feed them, varied creative, exclusions, consolidated budget and the landing page and offer.

Google Performance Max and Meta Advantage+ (with Meta's Andromeda retrieval system, 2025) automate targeting, bidding and placement. The levers you still control:
1. **Conversion signal quality**: optimise toward the event that represents value (qualified lead, purchase with value), not a cheap proxy. Use value-based bidding; import offline conversions (CRM stages) for lead-gen; implement Meta Conversions API and Google enhanced conversions to recover signal lost to browsers, ATT and consent.
2. **Creative volume and diversity**: with broad targeting, the creative selects the audience. Supply several conceptually different creatives (different angles, formats, hooks), not minor variations, and refresh as they fatigue. Agency-claimed numbers ("8–12 concepts", "+22% ROAS") are not established facts.
3. **Exclusions and constraints**: brand exclusions, negative keywords (PMax gained campaign-level negatives in 2025), placement exclusions, customer list exclusions for acquisition campaigns.
4. **Budget and structure**: algorithms need data. Consolidate campaigns so each optimises on dozens of conversions per week rather than a handful. Fragmented structures starve learning.
5. **Landing page and offer**: the biggest lever, outside the platform.

## Measurement after privacy changes [first-party]

_In short:_ Privacy changes mean platform numbers are partly modelled, so confirm important channels with lift or geo tests, and set up consent and server-side tracking properly.

- iOS App Tracking Transparency opt-in averaged ~35% (Adjust, 2025) [vendor]; Meta reports a partly modelled, delayed view of iOS conversions.
- Google Consent Mode v2 has been required for EEA ads measurement and remarketing since March 2024; without it you lose EEA conversion data and audiences. Advanced mode enables modelled conversions.
- Third-party cookies remain in Chrome (Google abandoned deprecation; most Privacy Sandbox APIs retired Oct 2025). Safari and Firefox still block them.
- Consequence: platform numbers are partly modelled and all attributed. Validate important channels with lift or geo tests (see metrics-and-measurement).

## Where attribution lies most

_In short:_ Brand search, retargeting and view-through conversions claim credit for customers you'd have won anyway, so check them with a holdout test before trusting their returns.

- **Brand search**: often captures people who'd have arrived anyway. When eBay paused brand ads, total clicks fell only ~0.5% because organic results picked up nearly all the lost paid clicks. Test with a geo or time holdout, especially if no competitor bids on your brand.
- **Retargeting**: reaches people already likely to convert. Measure with a holdout before treating its ROAS as real.
- **View-through conversions**: credit for ads that may never have been noticed. Check the attribution window settings.

## Channel notes [practitioner]

_In short:_ Search captures demand that already exists, paid social creates it and needs strong creative, and LinkedIn is costly but precise for high-value B2B sales.

- **Search** captures existing demand; it can't create it. Useless for products nobody searches for yet.
- **Paid social** creates demand and can target broad interest; it needs strong creative and a clear, low-friction offer.
- **LinkedIn**: expensive per click but precise B2B targeting; works best for high ACV, account-based programs and content distribution, rarely for cheap self-serve.
- **Dating apps need approval before any ad runs.** Google needs dating certification, Meta prior written permission, and TikTok a sales rep; all limit dating ads to adults. Google asks for no user count but wants a live store app or website, test log-ins and a screen recording of the signed-in app. No platform publishes how long approval takes, so apply as soon as the app is in a store, and plan paid tests after that, not from a waitlist page [first-party; policy pages read 2026-10-27, some via fetch summaries].
- **Copy limits**: use check_copy_limits for Google responsive search ads (RSA, 30/90), PMax, Demand Gen, Meta, LinkedIn, X and TikTok.

## Testing and scaling

_In short:_ Judge tests on cost at the margin, raise budgets in steps because each increase buys costlier customers, and keep refreshing creative and trying new channels.

- Give tests enough budget for statistically meaningful conversion counts; judge on CPA/ROAS at the margin, not averages.
- Scaling raises marginal CPA (you exhaust the cheapest audience first). Increase budget in steps and watch marginal, not blended, numbers.
- Every channel decays: refresh creative on a schedule and keep testing new channels (see channel-strategy).

## Find where the cost comes from

_In short:_ Cost per customer is the product of a few rates; break it into them before blaming the ad, because a rise after the click is not an ads problem.

CPA = CPM ÷ (1000 × CTR × click-to-customer rate). This is arithmetic, not a benchmark: compare each rate with its own earlier values, not with someone else's "healthy" number. paid_media_math gives the implied CPA from CPM, CTR and CVR; funnel_analysis with spend gives the cost at each step (impression, click, install or signup, purchase).
- **CPM up, the rest steady**: you pay more to reach people (competition, season, narrow audience). The ad isn't failing.
- **CTR down**: the ad or its hook is not getting attention, or it has run long enough that the same people have seen it too often.
- **CTR steady, click-to-customer rate down**: the cause is after the click: the landing page or store listing, signup or onboarding, the price or paywall. New creative won't fix it.
- **Everything steady but reported conversions down**: check tracking and reporting delay before changing anything.

## When to stop or cut

_In short:_ Stop an ad only when its results are unlikely for one at target; stop or cut paid spend when costs sit above break-even with no fix, the channel's customers churn faster, a holdout shows little extra lift, or you're mostly paying for demand you already had.

- Before stopping a single ad on few or no conversions, run paid_media_math with spend, conversions and targetCpa. An ad that truly converts at target shows no conversions after spending twice the target about 14% of the time, so "2× target CPA with zero conversions" stops about one good ad in seven. With no conversions, about 3× the target is needed for a 95% call.
- Implied CPA above break-even with no realistic path to fix it.
- Cohorts from the channel churn faster than others (check unit_economics by channel).
- A holdout test shows little incremental lift.
- Spend is mostly brand search and retargeting with no prospecting: you're paying to capture demand you already had.

## Sources

research/dating-ad-and-store-rules.md and dating-ad-certification.md (dating ad rules); research/landscape-2026.md §1, §5 (Google Privacy Sandbox update 2025; Adjust 2025; Consent Mode v2; Meta Andromeda; Google PMax 2025); research/measurement.md §1 (Blake, Nosko & Tadelis 2015; Gordon et al. 2019); research/platform-specs.md.
