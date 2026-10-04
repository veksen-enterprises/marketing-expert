# Platform copy limits (checked 2026-10-04)

Method caveat: the research proxy blocked support.google.com, developers.google.com, learn.microsoft.com, facebook.com and linkedin.com, so "verified" below means a search scoped to that official domain returned the figure attributed to that URL — the page itself was not read. Re-check Meta and TikTok in Ads Manager before hard-coding. Meta and LinkedIn re-checked 2026-10-04 (search only; page fetches still blocked). These values feed `src/lib/platformLimits.ts`.

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
- Primary text: recommended 50–150 [verified-search: facebook.com, 2026-10-04]. Meta publishes no hard max and no ~125 "See more" cut-off; the 125 / 2,200 / 63,206 figures appear only on third-party spec sites (adsuploader, savemyleads, etc.) — still UNVERIFIED, keep as warnings only.
- Headline recommended 27 [verified-search: facebook.com, 2026-10-04]; hard max UNVERIFIED (third-party sites claim 255). Older 125/40/30 guidance no longer in the guide; a facebook.com snippet still shows 125/40 for an older carousel spec.
- Description: no length found in the current feed-image guide.
- Carousel: primary 80, headline 45, description 18 (recommended) [verified-search: facebook.com, 2026-10-04].

## LinkedIn — linkedin.com/help/lms
- Single image: ~150 before truncation [verified-search: linkedin.com, 2026-10-04]. Hard max still UNRESOLVED: on 2026-10-04 linkedin.com/help (a426534) search snippets returned "3,000 character maximum" in two queries and "600 character maximum" in another; business.linkedin.com ads guide snippet lists only 150 (intro) / 70 (headline). Code keeps 600 as a conservative cap with `verified: false`. Headline 200 (rec 70); description 300 (rec 100) — not re-checked this pass.
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

## Open questions
- Meta feed hard maximums (primary text, headline, description) and the exact "See more" truncation point: not published in the Meta Ads Guide; needs an Ads Manager test.
- LinkedIn single-image intro text hard max: 600 vs 3,000 (both appear in linkedin.com snippets). Needs a Campaign Manager test or a direct page read.
