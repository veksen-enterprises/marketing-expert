# Platform copy limits (checked 2026-10-04)

Method caveat: the research proxy blocked support.google.com, developers.google.com, learn.microsoft.com, facebook.com and linkedin.com, so "verified" below means a search scoped to that official domain returned the figure attributed to that URL — the page itself was not read. Re-check Meta and TikTok in Ads Manager before hard-coding. Meta and LinkedIn re-checked 2026-10-04 (search only; page fetches still blocked). On 2026-10-05 the Google Ads help pages, Google Ads API reference, Microsoft Learn, LinkedIn help, Meta feed guide (via WebFetch), TikTok and X pages and the Google Search title/snippet pages were read directly; tags below say what each read confirmed. These values feed `src/lib/platformLimits.ts`.

## Google Ads RSA — support.google.com/google-ads/answer/7684791
- Headline 30 (3–15), description 90 (2–4), path 15 each. CJK chars count as 2. [read 2026-10-05]
- Sitelink text 25 (12 CJK), sitelink description lines 35 each (answer/2375416). Callout 25 (answer/6079510). Structured snippet value 25, 3–10 values (answer/6280012). [read 2026-10-05: sitelink 25/12 CJK and callout 25 are on the help pages; the 35-character description lines and the snippet 25 × 3–10 limits are in the Google Ads API reference (SitelinkAsset, StructuredSnippetAsset), not the help pages]

## Google Performance Max — answer/14528373
- Headline 30 (3–15, ≥1 ≤15 recommended), long headline 90 (1–5), description 90 (2–5, ≥1 must be ≤60 → API `SHORT_DESCRIPTION_REQUIRED`), business name 25. [read 2026-10-05: help page gives 30/90/90/25 and the counts; the ≤60 short description comes from the Google Ads API Performance Max common-errors page, not the help page]

## Google Demand Gen — answer/17091672
- Headline 40 (1–5; ≥1 must be ≤30 to serve on Display), description 90 (1–5), business name 25. [read 2026-10-05]

## Microsoft Advertising RSA — learn.microsoft.com …/responsivesearchad
- Same as Google (30/90/15), limits applied after dynamic text substitution. [read 2026-10-05: learn.microsoft.com campaign-management-service/responsivesearchad gives 3–15 headlines of 30, 2–4 descriptions of 90 after substitution; path length not re-read]

## Meta feed — facebook.com/business/ads-guide
- Primary text: recommended 50–150 [verified-search: facebook.com, 2026-10-04; read 2026-10-05 via WebFetch of the Facebook feed image guide]. Meta publishes no hard max and no ~125 "See more" cut-off; the 125 / 2,200 / 63,206 figures appear only on third-party spec sites (adsuploader, savemyleads, etc.) — still UNVERIFIED, keep as warnings only.
- Headline recommended 27 [verified-search: facebook.com, 2026-10-04; read 2026-10-05 via WebFetch]; hard max UNVERIFIED (third-party sites claim 255). Older 125/40/30 guidance no longer in the guide; a facebook.com snippet still shows 125/40 for an older carousel spec.
- Description: no length found in the current feed-image guide.
- Carousel: primary 80, headline 45, description 18 (recommended) [verified-search: facebook.com, 2026-10-04] (re-check 2026-10-05: carousel page not re-read; facebook.com refuses direct fetches).

## LinkedIn — linkedin.com/help/lms
- Single image: ~150 before truncation; hard max **3,000** [read 2026-10-05: linkedin.com/help/lms/answer/a426534 says "Use up to 150 characters ... to avoid truncation (3,000 character maximum)", up to 10 emojis; URLs over 23 characters become a short link; corrected: resolves the 600 vs 3,000 question]. Code still keeps 600 with `verified: false` (src/lib/platformLimits.ts not changed in this pass). Headline 200 (rec 70); description 300 (rec 100) [read 2026-10-05].
- Text ads: headline 25, description 75. Message ads: subject 60, body 1,500, CTA 20.

## X — business.x.com creative specs; docs.x.com counting-characters
- 280; each URL counts 23 [read 2026-10-05: docs.x.com counting-characters]. Website card title 70 [not re-read].

## TikTok in-feed — ads.tiktok.com/help/article/tiktok-auction-in-feed-ads
- Ad text 100 (English), rec 4–60. Display name 20, rec 4–10. (re-check 2026-10-05: the current page, "Last updated: June 2026", confirms only the account name limit of 20 characters, 10 CJK; it no longer states an ad-text limit or the recommended ranges)

## Display approximations (warnings only)
- SERP title: pixel-truncated ~600px ≈ 50–60 chars [practitioner]; Google rewrites often. Google's title-link page says there is no length limit and titles are truncated "typically to fit the device width" [read 2026-10-05].
- Meta description: ~155–160 desktop, ~120 mobile [practitioner approximation]. Google's snippet page sets no limit and truncates "as needed, typically to fit the device width" [read 2026-10-05; corrected: the character counts are not from Google's page].
- Email subject ~60 desktop, 25–40 mobile; preheader 40–130 (Campaign Monitor; Email on Acid; Mailchimp).
- og:title ~40–60, og:description <120 — no official limit (Ahrefs; developers.facebook.com/docs/sharing/webmasters).

## Open questions
- Meta feed hard maximums (primary text, headline, description) and the exact "See more" truncation point: not published in the Meta Ads Guide; needs an Ads Manager test.
- Resolved 2026-10-05: LinkedIn single-image intro text hard max is 3,000 (help page read directly); the code constant still says 600.
