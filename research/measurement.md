# Measurement, attribution, incrementality, lifecycle metrics (checked 2026-10-04)

Method caveat: the research proxy blocked support.google.com, developers.google.com, blog.google, arxiv.org, nber.org, repec, gwern.net, firstround.com and most vendor blogs. "Read" = full primary text read (PDF or GitHub source). [snippet-only] = only a search-engine summary attributed to that URL was seen; re-check before quoting numbers. Tags: [research] peer-reviewed / author working paper; [first-party docs] Google/Meta/OSS maintainers; [practitioner] operator opinion or convention.

## Sources
1. Gordon, Zettelmeyer, Bhargava, Chapsky (2019). "A Comparison of Approaches to Advertising Measurement: Evidence from Big Field Experiments at Facebook." Marketing Science 38(2):193–225. https://pubsonline.informs.org/doi/10.1287/mksc.2018.1135 — read via MSI Working Paper 18-113: https://thearf-org-unified-admin.s3.amazonaws.com/MSI_Report_18-113.pdf
2. Gordon, Moakler, Zettelmeyer (2023). "Close Enough? A Large-Scale Exploration of Non-Experimental Approaches to Advertising Measurement." Marketing Science 42(4):768–793. https://pubsonline.informs.org/doi/10.1287/mksc.2022.1413 [snippet-only]
3. Blake, Nosko, Tadelis (2015). "Consumer Heterogeneity and Paid Search Effectiveness: A Large-Scale Field Experiment." Econometrica 83(1):155–174. https://doi.org/10.3982/ECTA12423 ; NBER WP 20171 https://www.nber.org/system/files/working_papers/w20171/w20171.pdf [snippet-only]
4. Lewis, Rao (2015). "The Unfavorable Economics of Measuring the Returns to Advertising." QJE 130(4):1941–1973. https://doi.org/10.1093/qje/qjv023 [snippet-only]
5. Johnson, Lewis, Nubbemeyer (2017). "Ghost Ads: Improving the Economics of Measuring Online Ad Effectiveness." JMR 54(6):867–884. https://doi.org/10.1509/jmr.15.0297 ; SSRN https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2620078 [snippet-only]
6. Google Ads Help, "About attribution models" (answer 6259715). https://support.google.com/google-ads/answer/6259715 [snippet-only]
7. Google, Meridian repo (Apache-2.0), README, CHANGELOG, `meridian/model/prior_distribution.py`, `skills/meridian_doc_consultant/references/documentation_map.md`. https://github.com/google/meridian — read
8. Google Meridian docs, "Amount of data needed." https://developers.google.com/meridian/docs/pre-modeling/amount-data-needed [snippet-only]
9. Google Keyword blog, "Meridian is now available to everyone" (Jan 2025). https://blog.google/products/ads-commerce/meridian-marketing-mix-model-open-to-everyone/ [snippet-only]
10. Meta, Robyn repo: README + `website/docs/analysts-guide-to-MMM.mdx` + `features.mdx`. https://github.com/facebookexperimental/Robyn — read
11. PyMC Labs, PyMC-Marketing README. https://github.com/pymc-labs/pymc-marketing — read
12. Meta, GeoLift repo: README, `vignettes/GeoLift_Walkthrough.md`, `website/docs/Best Practices/BestPractices.md`. https://github.com/facebookincubator/GeoLift — read
13. Ben-Michael, Feller, Rothstein (2021). "The Augmented Synthetic Control Method." JASA. https://jesse-rothstein.com/wp-content/uploads/2021/07/Ben-Michael_Feller_Rothstein_Augsynth_JASA_2021.pdf [snippet-only]
14. Google, matched_markets repo README (TBR: Kerman 2017; GeoX: Vaver & Koehler 2010; matched markets: Au 2018). https://github.com/google/matched_markets — read
15. Google, trimmed_match repo README (Chen & Au 2019). https://github.com/google/trimmed_match — read
16. McClure, D. (2007). "Startup Metrics for Pirates: AARRR!" Ignite Seattle talk / SlideShare. [snippet-only; original deck not read]
17. Vohra, R. (2018). "How Superhuman Built an Engine to Find Product/Market Fit." First Round Review. https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/ [snippet-only]
18. Walker, C. (Refine Labs), LinkedIn posts on self-reported attribution, e.g. https://www.linkedin.com/posts/chriswalker171_attribution-revenue-b2b-activity-7021126918821347328-R5CQ [snippet-only]
19. Recast, "'How did you hear about us?' survey and the limitations of current measurement techniques." https://getrecast.com/hdyhau/ [snippet-only]

## 1. Attribution is not incrementality
- Core problem: ad exposure is targeted at likely buyers, so exposed vs unexposed differ before the ad runs. "Even small amounts of advertising endogeneity (e.g., likely buyers are more likely to be exposed to the ad) can severely bias causal estimates." [research, 1, read]
- Gordon et al. 2019: 15 US Facebook RCTs, 500M user-experiment obs, 1.6B impressions. They compared RCT lift with propensity matching, regression adjustment, and similar observational estimates on the same campaigns. Observational methods usually *overestimate* lift, sometimes significantly *underestimate*. "In half of the studies, the estimated percentage increase in purchase outcomes was off by a factor of three across all methods." No single method won consistently. Observational estimates were closer for registrations/page views than for purchases. The authors conclude that good individual-level data is *not* "good enough." [research, 1, read]
- Gordon, Moakler, Zettelmeyer 2023 follow-up: 663 Facebook experiments, more than 5,000 user features. Double/debiased ML beat stratified PSM, but "neither method performs well," even with deep learning. [research, 2, snippet-only]
- Operational rule: a platform-reported or last-click/DDA ROAS is a *correlational* credit allocation. Treat it as a hypothesis until a holdout or geo test confirms it. [derived from 1–3]
- Blake, Nosko, Tadelis 2015 (eBay): turning off brand-keyword search ads lost almost no traffic. About 99.5% of the forgone paid clicks came back through organic search, so brand-keyword ads had no measurable short-term benefit. [research, 3, snippet-only]
- Same paper, non-brand keywords: ads helped new and infrequent users, but frequent users (who would buy anyway) took most of the spend, so average returns were negative. A geo experiment pausing Google search ads in a sample of cities gave an ROI of about −63%. [research, 3, snippet-only; confirm the −63% figure and CI in the paper]
- Implication: brand search for a well-known brand is the classic place where attribution heavily over-credits. Test it with a geo or time-based holdout before defending the budget. The effect varies with brand awareness and competitor conquesting on your terms, and eBay is an extreme case. [derived; heterogeneity caveat is the authors' framing per 3]
- Lewis & Rao 2015: 25 large field experiments (US retailers and brokerages), about $2.8M in spend. The median 95% CI on ROI is more than 100 percentage points wide. Individual sales SD is about 10× the mean over a typical campaign window. Example: detecting a $0.35 effect on a mean of $7 with an SD of $75. [research, 4, snippet-only]
- Implication: even a correctly randomized test can be too underpowered to tell break-even from a loss. Run a power analysis first, use pre-period covariates and longer windows where possible, and pool results across tests. "Not significant" ≠ "no effect." [derived from 4]

## 2. GA4 / Google Ads attribution models
- Removed in both Google Ads and GA4: first click, linear, time decay, position-based. Announced April 2023. They became unselectable for new conversion actions (GA4 from May 2023, Ads from June 2023), and remaining users were auto-migrated to data-driven attribution (DDA) around Sept 2023. Google cited low adoption: fewer than 3% of Ads conversion actions used them. [first-party docs, 6, snippet-only; dates relayed by trade press, not read on Google's page]
- Remaining options: DDA (the default and recommended) and last click. GA4 also has a "Google paid channels last click" variant; this is unverified and needs a check against GA4 Help 10596866, which was blocked. [first-party docs, 6, snippet-only]
- DDA allocates credit using observed path data inside Google's measurable touchpoints. It is still attribution, not a randomized lift estimate, so section 1's caveats apply. [derived]

## 3. Marketing mix modeling (MMM)
- **Google Meridian.** Bayesian causal-inference MMM, Apache-2.0, Python 3.11–3.13, GPU recommended (tested on a T4 with 16 GB RAM). It supports geo-level data ("encouraged if available") or national data. It calibrates with "experiments and other prior information" and uses reach & frequency to optimize frequency. [first-party docs, 7, read]
  - Timeline: introduced March 2024, then general availability around 29 Jan 2025 [9, snippet-only]. The CHANGELOG shows v1.0.0 on 2025-01-24 and v2.0.0 on 2026-09-02; v2.1.0 (2026-09-17) is the latest at check time. [7, read]
  - Data: about 2 years of weekly data minimum for geo models and about 3 years for national models [8, snippet-only]. The repo's doc map summarizes collect-data.md as "weekly granularity and a minimum of 2–3 years." It advises limiting or grouping small channels, says national models need more years than geo models, and discourages campaign-level inputs. [7, read]
  - Calibration: the default parameterization puts priors on ROI. The default `roi_m` is `LogNormal(0.2, 0.9)`. Experiment results go in as custom ROI priors through helpers such as `lognormal_dist_from_mean_std` / `lognormal_dist_from_range`, and the docs stress the experiment's timing and duration relevance. [first-party docs, 7, read]
- **Meta Robyn.** R (stable) and Python (beta). It uses ridge regression, Nevergrad multi-objective hyperparameter search, time-series decomposition, adstock (geometric or Weibull) and saturation curves. It is "especially suitable for digital and direct response advertisers with rich data." [first-party docs, 10, read]
  - Data: "a minimum of two years of historical weekly data." With only monthly data, use 4–5 years. Aim for 1 independent variable per 10 observations. Weekly data is best practice; daily works but needs more validation. [10, read]
  - Calibration: "we strongly recommend using experimental and causal results that are considered to be the ground truth to calibrate MMM," such as Meta Conversion Lift (people-based) or GeoLift (geo). Calibration error (MAPE) is a third objective alongside NRMSE and decomp.RSSD. Robyn takes point estimates only (start date, end date, incremental response). Run lift studies "on an ongoing and regular basis." [10, read]
  - Rule-of-thumb geometric adstock θ (weekly): TV 0.3–0.8, OOH/print/radio 0.1–0.4, digital 0.0–0.3. These are "anecdotal." [10, read]
- **PyMC-Marketing.** Bayesian MMM with selectable adstock and saturation functions, lift-test calibration ("fine-tune your model based on empirical experiments"), plus CLV (contractual and non-contractual), Bass diffusion and discrete choice modules. [first-party docs, 11, read]
- Operational guidance across all three: MMM needs spend *variation* within each channel. A channel held flat cannot be separated from baseline (Robyn guide, "Variation"). Use MMM for strategic budget split and use experiments for truth-checking. Feed experiment results back into the MMM as priors or calibration. [10, read; derived]

## 4. Incrementality tests
- **User-level RCT / conversion lift.** The platform randomizes eligible users into test and holdout groups and compares outcomes. This was the benchmark in Gordon et al. [1]. Meta Conversion Lift is cited by Robyn as people-based ground truth [10]. Google's equivalent is Conversion Lift in Google Ads, which was not verified because the help page was blocked.
- **Ghost ads** (Johnson, Lewis, Nubbemeyer 2017). In the control group, the system logs the ad that *would* have been shown (a "ghost" impression), so you can compare exposed users with their counterfactual control counterparts without buying PSA ads. Advertisers can "measure ad lift just as precisely while spending at least an order of magnitude less" than intent-to-treat or PSA designs. A "predicted ghost ads" variant works on display platforms and logged more than 100M predicted ghost ads per day. Application: retargeting lifted site visits 17.2% and purchases 10.5%. [research, 5, snippet-only]
- **PSA/placebo controls** are costly and can be biased because the PSA's own delivery is optimized differently. This is the motivation for ghost ads. [research, 5, snippet-only]
- **Geo experiments.** These randomize or match regions, which suits channels with no user-level control (TV, OOH, search, cross-platform) and works without cookies.
  - *Meta GeoLift*: R package using augmented synthetic control (Ben-Michael, Feller, Rothstein 2021, `augsynth`). It covers power calculators, market selection, inference and multi-cell tests (keep the number of cells "very conservative"). [first-party docs, 12, 13]
  - GeoLift best practices: daily data "strongly recommended" over weekly. At least 25 pre-treatment periods across at least 20 geo units, and ideally 52 weeks of history. Run at least 15 days (daily data) or 4–6 weeks (weekly data), and cover at least one full purchase cycle. Hold other local media constant across test and control. Use "conformal" CIs (recommended). [first-party docs, 12, read]
  - *Google*: Time-Based Regression (Kerman 2017) and TBR Matched Markets (Au 2018) are in `matched_markets`. Trimmed Match (Chen & Au 2019), in `trimmed_match`, gives robust iROAS for randomized paired geo experiments with few, heterogeneous geos. GeoX lineage: Vaver & Koehler 2010. [first-party docs, 14, 15, read]
- **Holdouts for owned channels** (email, push, CRM): keep a persistent random holdout (e.g. 5–10%) to measure lifecycle program lift. [practitioner convention; no primary source verified]
- **Before/after and matched-market designs without randomization** were among the observational methods that missed RCT lift in Gordon et al. Use them only with explicit caveats. [research, 1, read]
- Planning checklist: (1) a pre-registered KPI and minimum detectable effect, (2) a power analysis with pre-period data, (3) duration of at least one purchase cycle plus a lag window, (4) a freeze on other changes, and (5) iROAS = incremental revenue ÷ incremental spend with a CI, not a point estimate (Lewis & Rao). [derived from 4, 12]

## 5. Retention, cohorts, NRR/GRR, churn math
- **Cohort analysis.** Group customers by acquisition period (or first-action date) and track retention, revenue and orders by period since acquisition. Read cohorts down the diagonal for mix shifts and across rows for decay shape. A curve that *flattens* (asymptotes above zero) is the retention signal that matters for subscription products. [practitioner convention; no primary source verified]
- **GRR (gross revenue retention).** Revenue at the start of the period from an existing cohort, minus churn and contraction, divided by starting revenue. It excludes expansion, so it is capped at 100%. [practitioner convention; no standards-body source]
- **NRR (net revenue retention, also called NDR).** Starting cohort revenue, plus expansion, minus contraction and churn, divided by starting revenue. It can exceed 100%. It excludes new-logo revenue. Always state the period (usually trailing 12 months) and whether it is calculated on ARR or MRR. [practitioner convention]
- **Logo churn vs revenue churn.** Logo churn is the share of customers lost. Revenue churn is the share of revenue lost. They diverge when small accounts churn more, which is common in SMB-heavy books: logo churn looks bad while revenue churn looks fine, or the reverse after a large-account loss. Report both. [practitioner; derived]
- **Monthly → annual conversion.** Annual retention = (1−m)^12, so annual churn = 1−(1−m)^12, *not* 12m. For example, 3% monthly churn gives 1−0.97^12 ≈ 30.6% annual churn, not 36%. 5% monthly gives about 46.0% annual. Converting annual to monthly: m = 1−(1−a)^(1/12). [math; derived]
- Pitfalls:
  - The denominator must be the start-of-period cohort. Adding new customers mid-period to the denominator understates churn.
  - Annual contracts make monthly churn lumpy. Measure annual-contract churn at renewal dates.
  - Distinguish a pause or downgrade from a cancel.
  - Survivorship: blended retention improves as old cohorts dominate, which hides worse recent cohorts. Use cohorts. [practitioner; derived]

## 6. AARRR, north-star metric, leading vs lagging
- **AARRR ("pirate metrics").** Dave McClure, "Startup Metrics for Pirates," Ignite Seattle, 2007 (August, per secondary sources). The stages are Acquisition, Activation, Retention, Referral, Revenue. It was framed as a replacement for vanity metrics with behavioral funnel metrics. [practitioner, 16, snippet-only]
  - Fit: AARRR works for self-serve, product-led and consumer funnels. It fits less well for enterprise sales-led motions, where pipeline stages dominate, or for multi-sided marketplaces, which need per-side funnels. Retention is the stage most predictive of everything else. Some practitioners reorder it as "RARRA" (retention first). [practitioner; RARRA mention seen only in a secondary snippet]
- **North-star metric (NSM).** A single metric that captures the value customers receive and leads revenue, e.g. weekly active teams or nights booked. Pair it with input metrics the team can move and with guardrails such as retention and margin. [practitioner; origin attribution (often Sean Ellis / GrowthHackers; Amplitude's North Star Playbook) NOT verified, see open questions]
- **Leading vs lagging.**
  - Lagging metrics: revenue, NRR, churn, CAC payback. They are accurate but slow.
  - Leading metrics: activation rate, week-1 retention, usage depth, pipeline created. They are fast but proxies.
  - Validate each leading indicator by checking whether it actually predicts the lagging outcome in your own cohorts, then manage to it. [practitioner; derived]

## 7. Sean Ellis PMF survey ("40% very disappointed")
- Question: "How would you feel if you could no longer use [product]?" The answer options are very disappointed, somewhat disappointed, not disappointed, and N/A (no longer use). The PMF score is the percentage answering "very disappointed" among recent, active users. [practitioner, 17, snippet-only]
- Origin: Sean Ellis reportedly benchmarked "nearly 100 startups." Companies with 40% or more "very disappointed" generally achieved traction, and those below usually struggled. Our view: practitioner evidence is anecdotal: no published dataset, sampling frame, outcome definition or peer review was found. Treat 40% as a heuristic threshold, not a validated cutoff. [practitioner; claim relayed by secondary snippets; Ellis primary post not read]
- Best-documented application: Superhuman (Rahul Vohra, First Round Review, Nov 2018). Its score went from 22% to 33% after segmenting to the users most likely to say "very disappointed," then to 58% after about three quarters of roadmap work driven by the survey. [practitioner, 17, snippet-only]
- Survey rules from the Vohra/Ellis practice:
  - Survey users who have experienced the core product, e.g. used it recently, at least twice.
  - Get enough responses for stable percentages; about 40 or more is often cited (unverified).
  - Segment by persona.
  - Add "what is the main benefit?" and "how can we improve?" questions. [practitioner, 17, snippet-only]

## 8. Dark social and self-reported attribution
- "Dark social" means word of mouth, podcasts, private communities, DMs, and LinkedIn or other social content consumed without a click. Click-based attribution under-credits it structurally. [practitioner, 18]
- Self-reported attribution (SRA): a required, preferably free-text "How did you hear about us?" (HDYHAU) field on high-intent forms (demo, signup, checkout), coded into channels. Chris Walker / Refine Labs popularized it in B2B. [practitioner, 18, snippet-only]
- Refine Labs' claimed results include about 97% of its own 2023 revenue attributed to dark social, and a 90% gap between software attribution and SRA. These are self-reported marketing claims, seen only through secondary pages. Do not cite them as evidence. [practitioner, unverified]
- Limits:
  - Recall bias: buyers report the most salient or most recent touch.
  - Pick-lists anchor answers, so use free text.
  - Nonresponse is not random.
  - SRA measures *awareness source*, not incremental lift. [practitioner, 19, snippet-only; derived]
- Use: triangulate. SRA shows *where* demand originates, click attribution shows *which paths* convert, and experiments and MMM show *what is incremental*. When the three disagree, run a geo or holdout test on the disputed channel. [derived]

## Open questions / could not verify
- GA4 Help 10596866 and Google's April 2023 announcement were not read. The exact dates (May/June/Sept 2023), the "<3% of conversion actions" figure and the "paid channels last click" option are from snippets only.
- Meridian "2 years weekly geo / 3 years national" comes from a developers.google.com snippet. The repo doc map says "2–3 years." Read `amount-data-needed` directly.
- Blake et al. −63% ROI and its CI, plus the exact brand-search design (eBay paused brand ads on MSN, then Google). Confirm in the paper.
- Lewis & Rao: the "SD ≈ 10× mean" and "$0.35 on $7 mean, $75 SD" figures come from a snippet; check the QJE text.
- Gordon et al. working-paper versions differ (12 studies / 435M obs vs 15 / 500M). The 15 / 500M figures are the published (MSI 18-113, Marketing Science) numbers.
- Ghost ads lift figures (17.2% visits, 10.5% purchases) come from the abstract snippet.
- North-star metric origin: not traced to a primary author or date.
- AARRR: the original McClure SlideShare was not opened, and the August 2007 date is secondary.
- Sean Ellis's original 40% post (circa 2009, startup-marketing.com) was not located or read, and there is no evidence the "~100 startups" benchmark was ever published as data.
- NRR/GRR: no authoritative standard definition was found (SEC filings vary by company). The definitions above are convention.
- Google Conversion Lift and Meta Conversion Lift product docs were not read (blocked).
