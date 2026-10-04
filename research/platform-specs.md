# Platform copy limits (checked 2026-10-04)

Method caveat: the research proxy blocked support.google.com, developers.google.com, learn.microsoft.com, facebook.com and linkedin.com, so "verified" below means a search scoped to that official domain returned the figure attributed to that URL — the page itself was not read. Re-check Meta and TikTok in Ads Manager before hard-coding. These values feed `src/lib/platformLimits.ts`.

## Google Ads RSA — support.google.com/google-ads/answer/7684791
- Headline 30 (3–15), description 90 (2–4), path 15 each. CJK chars count as 2.
- Sitelink text 25 (12 CJK), sitelink description lines 35 each (answer/2375416). Callout 25 (answer/6079510). Structured snippet value 25, 3–10 values (answer/6280012).

## Google Performance Max — answer/14528373
- Headline 30 (3–15, ≥1 ≤15 recommended), long headline 90 (1–5), description 90 (2–5, ≥1 must be ≤60 → API `SHORT_DESCRIPTION_REQUIRED`), business name 25.

## Google Demand Gen — answer/17091672
- Headline 40 (1–5; ≥1 must be ≤30 to serve on Display), description 90, business name 25.

## Microsoft Advertising RSA — learn.microsoft.com …/responsivesearchad
- Same as Google (30/90/15), limits applied after dynamic text substitution.

## Meta feed — facebook.com/business/ads-guide
- Primary text: recommended 50–150 (verified); hard max and ~125 "See more" cut-off UNVERIFIED.
- Headline recommended 27 (verified); hard max UNVERIFIED. Older 125/40/30 guidance no longer in the guide.
- Carousel: primary 80, headline 45, description 18 (recommended).

## LinkedIn — linkedin.com/help/lms
- Single image: intro text max 600 (one summary mentioned 3,000 — unresolved), ~150 before truncation; headline 200 (rec 70); description 300 (rec 100).
- Text ads: headline 25, description 75. Message ads: subject 60, body 1,500, CTA 20.

## X — business.x.com creative specs; docs.x.com counting-characters
- 280; each URL counts 23. Website card title 70.

## TikTok in-feed — ads.tiktok.com/help/article/tiktok-auction-in-feed-ads
- Ad text 100 (English), rec 4–60. Display name 20, rec 4–10.

## Display approximations (warnings only)
- SERP title: pixel-truncated ~600px ≈ 50–60 chars; Google rewrites often (developers.google.com/search/docs/appearance/title-link).
- Meta description: ~155–160 desktop, ~120 mobile (developers.google.com/search/docs/appearance/snippet).
- Email subject ~60 desktop, 25–40 mobile; preheader 40–130 (Campaign Monitor; Email on Acid; Mailchimp).
- og:title ~40–60, og:description <120 — no official limit (Ahrefs; developers.facebook.com/docs/sharing/webmasters).
