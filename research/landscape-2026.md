# Marketing landscape: state as of Oct 2026

Method caveat: the research proxy blocked many primary domains (Google support, Ahrefs, Seer, Litmus, arXiv, SEJ). Most claims come from search-result summaries of those pages. Items marked **[verify]** should be re-checked before being relied on.

## 1. Third-party cookies / Privacy Sandbox
- Jul 2024: Google abandoned third-party cookie (3PC) deprecation in favour of a user-choice prompt. Apr 2025: dropped the prompt too; 3PCs remain in Chrome. (OneTrust, Apr 2025, https://www.onetrust.com/blog/google-drops-plans-for-third-party-cookie-choice-prompt-in-chrome/; SiliconANGLE 2025-04-22)
- 2025-10-17: Google retired most Privacy Sandbox APIs (Topics, Protected Audience, Attribution Reporting, Private Aggregation, Shared Storage, Related Website Sets, IP Protection, SDK Runtime), citing low adoption. (https://privacysandbox.google.com/blog/update-on-plans-for-privacy-sandbox-technologies, 2025-10-17)
- Deprecation in Chrome 144 / removal in 150 per Chromium intent threads, Nov 2025. **[verify]**
- Implication: "cookieless" planning is about Safari ITP / Firefox, consent rates and ad blockers, not Chrome.

## 2. Bulk sender requirements
- Gmail (5,000+/day to Gmail): SPF + DKIM, DMARC ≥ p=none, alignment, valid PTR, TLS, RFC 8058 one-click unsubscribe for marketing mail; spam rate target <0.1%, >0.3% = ineligible for mitigation. In force Feb 2024; one-click by 2024-06-01. (https://support.google.com/a/answer/14229414)
- Gmail enforcement Nov 2025: shift from warnings to temporary (4.7.x) and permanent (5.7.x) rejections. (Proofpoint 2025; Red Sift 2025)
- Yahoo: SPF or DKIM for all; bulk needs both + DMARC; spam <0.3%; one-click unsubscribe, honour within 2 days. (https://senders.yahooinc.com/best-practices/)
- Microsoft Outlook.com (5,000+/day): SPF, DKIM, DMARC ≥ p=none aligned; effective 2025-05-05. (Microsoft Tech Community, 2025-04-02) Whether non-compliant mail is junked or rejected (550 5.7.515) — later sources say rejected. **[verify]**

## 3. Apple Mail Privacy Protection
- MPP prefetches images via proxy → opens fire without a human reading. (Litmus MPP hub)
- Apple Mail >50% of tracked opens (Litmus, May 2025); ~62% cited for 2026 second-hand. **[verify]**
- Consensus: open rate is not a valid performance or A/B metric; use clicks, conversions/revenue per recipient, replies, deliverability signals. (Postmark; Omnisend 2026)

## 4. AI Overviews / AI Mode / GEO / llms.txt
- Pew (900 US adults, Mar 2025 browsing): clicked a result on 8% of visits with an AI summary vs 15% without; 1% clicked a link inside the summary. (https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/)
- Ahrefs: AIO reduced position-1 CTR 34.5% (Apr 2025); Dec 2025 update, 300k keywords: −58% pos 1. (https://ahrefs.com/blog/ai-overviews-reduce-clicks-update)
- Seer Interactive (3,119 informational queries, Jun 2024–Sep 2025): organic CTR on AIO queries −61% (1.76%→0.61%); queries without AIO also −41%; being cited in the AIO ≈ +35% organic CTR vs not cited (correlational).
- Semrush clickstream (May–Jul 2025): 92–94% of AI Mode sessions zero-click vs ~60% standard search.
- Field experiment, n≈1,100 (arXiv 2608.18352, Aug 2026, preprint): AI Mode cut external CTR by 18.8 pp.
- Direction consistent; magnitude varies by method (≈35–61%).
- GEO evidence: Aggarwal et al. (KDD 2024, https://arxiv.org/abs/2311.09735) — adding quotations, statistics, citations raised visibility up to ~40% on their benchmark; keyword stuffing didn't help. Lab benchmark; generalisation contested.
- Speculative: most "AI visibility" playbooks, schema-drives-citations claims.
- llms.txt: Google says it doesn't use it (Illyes, Jul 2025); no major LLM provider publicly committed as of Q1 2026; Ahrefs reported 97% of llms.txt files received zero requests (May 2026). **[verify, second-hand]**

## 5. Consent, GA4, ATT, automation
- Consent Mode v2 required since 2024-03-06 for EEA ads measurement/remarketing; adds `ad_user_data`, `ad_personalization`. Basic (no tags pre-consent) vs Advanced (cookieless pings → modelling).
- Universal Analytics sunset (data processing stopped Jul 2023). GA4 EEA numbers partly modelled under consent mode.
- iOS ATT opt-in ~35% (Adjust, Q2 2025). Meta: Aggregated Event Measurement + Conversions API; reported conversions partly modelled.
- Meta Andromeda retrieval (2025): practitioner consensus "creative is the targeting" — broad audiences, many distinct concepts. Specific numbers are agency claims. **[uncertain]**
- PMax 2025: campaign-level negatives, search terms report, channel performance report, asset-level metrics. (blog.google 2025)
- Levers that matter now: conversion signal quality (value-based bidding, offline conversion import, CAPI, enhanced conversions), creative volume/variety, exclusions, independent incrementality measurement.

## 6. Google Search quality systems
- March 2024 core update folded helpful content into core ranking; new spam policies: scaled content abuse (any method incl. AI), expired domain abuse, site reputation abuse. (Search Engine Land, Apr 2024)
- Site reputation abuse clarified Nov 2024: third-party content exploiting host signals violates policy even with first-party oversight. (https://developers.google.com/search/blog/2024/11/site-reputation-abuse)
- Core updates Mar 2026 and May 2026.
- Takeaways: first-hand experience and original information; no mass-produced pages; whole-site quality matters; recovery typically only at a later core update.

## 7. Benchmarks (what each says; caveats)
- KeyBanc/Sapphire SaaS Survey 2025: median CAC payback ~18 months, top quartile ~12. **[verify]** Self-reported, survivorship bias, inconsistent CAC definitions.
- Bessemer (State of the Cloud 2023): payback good 12–18, better 6–12, best 0–6 months; investor heuristics.
- LTV:CAC 3:1 is a rule of thumb, not an empirical median.
- Unbounce Q4 2024 (41k pages): median landing page conversion 6.6%; SaaS 3.8%. Unbounce-hosted pages only, varied conversion definitions.
- Klaviyo 2026: campaign click 1.69% (top decile 3.38%), flow click 5.58%; placed-order 0.16% campaigns / 2.11% flows. Mailchimp open ~35.6% (MPP-inflated). Platform-specific populations.

## 8. A/B testing statistics
- Peeking: checking a fixed-horizon test 10 times inflates nominal 5% false positive rate to ~26%. (Evan Miller 2010; sequential testing 2015)
- Continuous monitoring → sequential / always-valid methods (group sequential, mSPRT, confidence sequences). Bayesian tests are not immune to peeking.
- CUPED (Deng, Xu, Kohavi, Walker, WSDM 2013): pre-period covariate adjustment; ~50% variance reduction on some Bing metrics.
- Kohavi, Tang & Xu, Trustworthy Online Controlled Experiments (2020): power analysis up front, SRM checks, Twyman's law, OEC + guardrails, full weeks, most ideas fail.
- Required sample scales with 1/MDE²; low-traffic sites should test bold changes or upstream metrics.
