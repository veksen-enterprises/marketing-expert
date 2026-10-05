---
title: Metrics, attribution and incrementality
summary: Unit economics, retention and cohort maths, why attribution isn't incrementality, how to run lift and geo tests, MMM requirements, self-reported attribution, and how to treat benchmarks.
tags: metrics, measurement, attribution, incrementality, mmm, marketing mix model, geo test, holdout, ltv, cac, payback, churn, retention, nrr, cohort, north star, aarrr, pmf, benchmarks, ga4
---

## Attribution is not incrementality [research]

Attribution assigns credit for conversions to touchpoints. Incrementality asks how many conversions happened *because of* the marketing. They diverge because ads are shown to people already likely to buy.

- **Gordon et al. (2019, Marketing Science)**: 15 Facebook RCTs, 500M user observations. Observational methods (matching, regression) usually overestimated lift; in half the studies they were off by a factor of three. Rich individual-level data did not fix it.
- **Blake, Nosko & Tadelis (2015, eBay)**: turning off brand-keyword search ads lost almost no traffic: total clicks fell only ~0.5% (about 1.5% of the paid clicks), because organic results picked up the rest. Non-brand search ads helped new and infrequent users but mostly reached people who would have bought anyway. eBay is an extreme case (very high brand awareness), but brand search and retargeting are where attribution over-credits most.
- **Lewis & Rao (2015)**: across 25 large experiments, median 95% CI on ROI was over 100 percentage points wide. Even correct experiments can be too noisy to tell break-even from loss. "Not significant" ≠ "no effect".

**Rule**: treat platform ROAS and data-driven attribution as hypotheses. Confirm a channel's value with an incrementality test before scaling it or defending its budget.

## GA4 and platform attribution [first-party]

In 2023 Google removed first-click, linear, time-decay and position-based models (Google Ads from mid-July 2023; GA4 by November 2023); data-driven (default) and last-click remain. Data-driven attribution still only sees Google-measurable touchpoints and is not a lift estimate. With Consent Mode and iOS ATT, part of reported conversions is modelled (see paid-acquisition).

## Incrementality tests

| Method | Use when | Notes |
|---|---|---|
| Platform conversion lift (user-level RCT) | One platform, enough conversions | Meta Conversion Lift; Google Conversion Lift. Ghost-ads designs (logging who would have seen the ad in the control group) avoid buying placebo ads |
| Geo experiment | Channels without user-level control (TV, OOH (out-of-home: billboards, transit), search, cross-platform); cookieless | Meta GeoLift (synthetic control: a weighted mix of untreated regions built to match the test regions): ≥ 20 geos, ≥ 25 pre-periods (ideally 52 weeks), ≥ 15 days daily data or 4–6 weeks weekly, cover a purchase cycle, hold other local media constant. Google: Time-Based Regression, Trimmed Match |
| Persistent holdout | Owned channels (email, push, lifecycle) | Keep 5–10% randomly excluded to measure programme lift |
| Turn-off test | Suspected waste (brand search, retargeting) | Pause in some regions or time windows, compare with control |

Plan: pre-register the KPI and minimum detectable effect, run a power analysis on pre-period data, freeze other changes, report incremental ROAS with a confidence interval.

## Marketing mix modelling [first-party docs]

- Tools: Google Meridian (Bayesian, open source, v1.0 Jan 2025), Meta Robyn (R/Python), PyMC-Marketing.
- Needs: ~2–3 years of weekly data (Robyn: ≥ 2 years weekly, ~1 variable per 10 observations; Meridian: 2+ years geo-level, more for national), and **spend variation** in each channel (a channel held flat can't be separated from baseline).
- Calibrate with experiments: feed lift-test results in as priors (Meridian) or a calibration objective (Robyn).
- Use MMM for budget allocation across channels; use experiments to check it. Not worth it below a few channels and meaningful spend.

## Self-reported attribution [practitioner]

A required free-text "How did you hear about us?" on high-intent forms catches word of mouth, podcasts, communities and "dark social" that click tracking structurally misses. Limits: recall bias toward salient or recent touches, pick-lists anchor answers, non-response isn't random, and it measures where awareness came from, not lift. Triangulate: self-reported attribution for where demand starts, click attribution for which paths convert, experiments and MMM for what's incremental.

## Unit economics

Use unit_economics; don't compute by hand.
- **CAC** = fully loaded sales and marketing spend ÷ new customers (lag spend by the sales cycle if long). Blended CAC hides that paid CAC may be far higher than organic.
- **LTV** = monthly gross profit per account ÷ monthly churn (simple). With low churn this assumes lifetimes longer than your data; use a bounded horizon (e.g. 36–60 months).
- **CAC payback** = CAC ÷ monthly gross profit per account.
- **Heuristics, not laws**: LTV:CAC ≈ 3:1 is a rule of thumb. Bessemer frames payback 0–6 months best, 6–12 better, 12–18 good, with targets under 12 / 18 / 24 months for SMB / mid-market / enterprise. KeyBanc's 2024 SaaS survey reported median CAC payback of 25, 21 and 20 months for 2022, 2023 and 2024 (estimate): real companies are slower than the investor targets (self-reported private SaaS; CAC definitions vary).

## Retention maths

- Annual churn = 1 − (1 − monthly)^12, not 12 × monthly. 3% monthly ≈ 30.6% annual. Monthly from annual: 1 − (1 − annual)^(1/12).
- **Logo churn** (customers lost) and **revenue churn** (revenue lost) diverge when small accounts churn more; report both.
- **GRR** = (start revenue − churn − contraction) ÷ start revenue, ≤ 100%. **NRR** = (start revenue + expansion − contraction − churn) ÷ start revenue; excludes new customers. State the period and basis (ARR or MRR). Definitions are convention; companies vary.
- **Cohorts**: blended retention improves as old cohorts dominate, hiding worse recent cohorts. Plot retention by acquisition cohort; a curve that flattens above zero is the product-market fit signal for subscriptions.
- Denominator = customers at start of period, not including those acquired during it.

## Frameworks for choosing what to track [practitioner]

- **AARRR** (Dave McClure, 2007): acquisition, activation, retention, referral, revenue. Fits self-serve and consumer funnels; enterprise sales motions need pipeline stages. Retention predicts the rest, so some reorder it retention-first.
- **North-star metric**: one metric capturing the value customers get that leads revenue (weekly active teams, orders delivered). Pair with input metrics teams can move and guardrails (retention, margin).
- **Leading vs lagging**: revenue, NRR and payback are accurate but slow. Activation rate and week-1 retention are fast proxies. Check in your own cohorts that a leading metric predicts the lagging one before managing to it.
- **Sean Ellis PMF survey**: "How would you feel if you could no longer use [product]?"; 40% "very disappointed" as threshold. Based on Ellis's experience with ~100 startups, never published as data. Useful for tracking over time and finding who loves the product (Superhuman: 22% → 58% by segmenting and building for that group).

## Benchmarks

Benchmarks are context, not targets. Before quoting one, check: who collected it (vendor platforms report their own customers), the definition (what counts as a conversion, CAC fully loaded or not), the date, and selection (survey respondents, awards entries, survivors). Your own trend over time is a better benchmark than someone else's median.

Examples with caveats: Unbounce 2024 report (Q4 2024 data): median landing-page conversion 6.6% (SaaS 3.8%), Unbounce-hosted pages only; Klaviyo 2026 campaign click rate 1.69%, flows 5.58%, Klaviyo customers only [vendor].

## Sources

research/measurement.md (Gordon et al. 2019; Blake, Nosko & Tadelis 2015; Lewis & Rao 2015; Johnson, Lewis & Nubbemeyer 2017; Meridian, Robyn, GeoLift, PyMC-Marketing docs; McClure 2007; Vohra 2018); research/landscape-2026.md §7.
