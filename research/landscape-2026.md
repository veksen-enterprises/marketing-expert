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
- Microsoft Outlook.com (5,000+/day): SPF, DKIM, DMARC ≥ p=none aligned; effective 2025-05-05. (Microsoft Tech Community, 2025-04-02) Enforcement: the original post said non-compliant mail would go to Junk first; Microsoft updated it to say non-compliant mail is **rejected** with `550; 5.7.515 Access denied, sending domain [SendingDomain] does not meet the required authentication level`. Microsoft Support's "Fix NDR error 550 5.7.515" page confirms rejection, 5,000+/day to Microsoft consumer domains with the same 5322.From domain, and that the rules keep applying once a domain has ever crossed the threshold. [verified-search: techcommunity.microsoft.com + support.microsoft.com, 2026-10-04]

## 3. Apple Mail Privacy Protection
- MPP prefetches images via proxy → opens fire without a human reading. (Litmus MPP hub)
- Litmus market-share page (data as of 2026-08-01, >1B opens): over 50% of opens happen on a device with MPP active; Apple Mail (incl. MPP) + Gmail ≈ 90% of opens. [verified-search: litmus.com, 2026-10-04] An exact current Apple Mail % was not visible in litmus.com snippets; third-party relays cite ~58% and 64.66% (May 2026). The earlier "~62%" figure is not confirmed — do not quote it. Last Litmus monthly breakdown found on litmus.com: May 2022, Apple 58.0%, Gmail 28.1%, MPP 51.7% of opens.
- Consensus: open rate is not a valid performance or A/B metric; use clicks, conversions/revenue per recipient, replies, deliverability signals. (Postmark; Omnisend 2026)

## 4. AI Overviews / AI Mode / GEO / llms.txt
- Pew (900 US adults, Mar 2025 browsing): clicked a result on 8% of visits with an AI summary vs 15% without; 1% clicked a link inside the summary. (https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/) [verified-search: pewresearch.org, 2026-10-04]
- Ahrefs: AIO reduced position-1 CTR 34.5% (Apr 2025); Dec 2025 update, 300k keywords (150k with AIO, 150k informational without): −58% CTR at pos 1, tapering to −19.4% at pos 10. (https://ahrefs.com/blog/ai-overviews-reduce-clicks-update) [verified-search: ahrefs.com, 2026-10-04]
- Seer Interactive (3,119 informational queries, Jun 2024–Sep 2025): organic CTR on AIO queries −61% (1.76%→0.61%); queries without AIO also −41%; being cited in the AIO ≈ +35% organic CTR vs not cited (correlational). 3,100+ queries, 42 client orgs. [verified-search: seerinteractive.com, 2026-10-04]
- Seer 2026 update (Jan 2025–Feb 2026, 53 brands, 5.47M queries, 2.43B organic impressions, 296.9M paid impressions): organic CTR on AIO queries rose from a 1.3% floor (Dec 2025) to 2.4% (Feb 2026), an 85% rebound; paid CTR on AIO queries stayed ~13–16%; cited brands got ~120% more clicks per impression than uncited. (https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-2026-update) [verified-search: seerinteractive.com, 2026-10-04] Note the 2026 update's numbers supersede the "−61%" framing as the latest reading; the decline was not monotonic.
- Semrush clickstream (May–Jul 2025): 92–94% of AI Mode sessions zero-click vs ~60% standard search.
- Field experiment, n≈1,100 (arXiv 2608.18352, Aug 2026, preprint): AI Mode cut external CTR by 18.8 pp.
- Direction consistent; magnitude varies by method (≈35–61%).
- GEO evidence: Aggarwal et al. (KDD 2024, https://arxiv.org/abs/2311.09735) — adding quotations, statistics, citations raised visibility up to ~40% on their benchmark; keyword stuffing didn't help. Lab benchmark; generalisation contested.
- Speculative: most "AI visibility" playbooks, schema-drives-citations claims.
- llms.txt: Google says it doesn't support it and isn't planning to (Gary Illyes, Search Central Live, Jul 2025) [secondary only: SEO-press relays; no google.com statement found]. No major LLM provider publicly committed as of Q1 2026. Ahrefs, "We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read": 28% of 137k domains publish llms.txt; 97% of those files got zero requests in May 2026; 96% of requests that did arrive were bots, most not AI tools. (https://ahrefs.com/blog/llmstxt-study/) [verified-search: ahrefs.com, 2026-10-04]

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
- KeyBanc/Sapphire SaaS Survey 2025 (16th annual, released 2025-11-13): median CAC payback ~18 months, top quartile ~12 — **still unverified**; only a third-party blog (seeto.ai) gives these. The key.com press release snippet mentions AE payback "expected to shorten to 18 months by 2026", which is a different metric. The 2024 survey (key.com PDF) shows CAC payback 25 months (2022), 21 (2023), 20 (2024E) [verified-search: key.com, 2026-10-04]. Self-reported, survivorship bias, inconsistent CAC definitions.
- Bessemer (State of the Cloud 2023): payback good 12–18, better 6–12, best 0–6 months; investor heuristics. [verified-search: bvp.com, 2026-10-04] Bessemer also gives segment targets: SMB <12, mid-market <18, enterprise <24 months.
- LTV:CAC 3:1 is a rule of thumb, not an empirical median.
- Unbounce Conversion Benchmark Report 2024 (Q4 2024 data; 41k pages, 464M visits, 57M conversions): median landing page conversion 6.6%; SaaS 3.8%. [verified-search: unbounce.com, 2026-10-04] Unbounce-hosted pages only, varied conversion definitions.
- Klaviyo 2026: campaign click 1.69% (top decile 3.38%), flow click 5.58% (top decile 10.48%) [verified-search: klaviyo.com, 2026-10-04]. Placed-order 0.16% campaigns / 2.11% flows **not confirmed**: klaviyo.com snippets give only industry ranges (campaigns ~0.08–0.26%, flows ~1.85–2.46%) and "flows ≈13× campaigns", which is consistent with but does not confirm the overall figures. Mailchimp: open 35.63%, click 2.62%, all industries, data "as of December 2023" (MPP-inflated opens) [verified-search: mailchimp.com, 2026-10-04]. Platform-specific populations.

## 8. A/B testing statistics
- Peeking: checking a fixed-horizon test 10 times inflates nominal 5% false positive rate to about 19% (Armitage, McPherson & Rowe 1969; 20 looks ≈ 25%). (Evan Miller 2010; sequential testing 2015)
- Continuous monitoring → sequential / always-valid methods (group sequential, mSPRT, confidence sequences). Bayesian tests are not immune to peeking.
- CUPED (Deng, Xu, Kohavi, Walker, WSDM 2013): pre-period covariate adjustment; ~50% variance reduction on some Bing metrics.
- Kohavi, Tang & Xu, Trustworthy Online Controlled Experiments (2020): power analysis up front, SRM checks, Twyman's law, OEC + guardrails, full weeks, most ideas fail.
- Required sample scales with 1/MDE²; low-traffic sites should test bold changes or upstream metrics.

## Open questions (updated 2026-10-04)
- Chrome 144 deprecation / 150 removal of Privacy Sandbox APIs — not re-checked.
- Exact current Apple Mail share of opens (Litmus page shows ">50% MPP"; precise % not visible).
- KeyBanc/Sapphire 2025 median CAC payback (needs the survey PDF).
- Klaviyo 2026 overall placed-order rates (0.16% / 2.11%).
- A first-party Google statement on llms.txt (only press relays of Illyes found).
- Resolved this pass: Outlook junk vs reject (reject, 550 5.7.515); Ahrefs −58%; Seer 2026 update; Pew; Ahrefs llms.txt 97%; Bessemer; Unbounce report year; Mailchimp edition date.
