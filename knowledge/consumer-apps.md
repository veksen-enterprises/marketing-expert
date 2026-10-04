---
title: Consumer apps
summary: Marketing a mobile or consumer app; retention curves as the first test, app store optimization, paid user acquisition after ATT (SKAdNetwork and AdAttributionKit), referral loops, notification permission, subscriptions and paywalls, and web-to-app purchase flows after the 2025 US anti-steering ruling.
tags: mobile app, consumer app, app marketing, retention curve, d1 d7 d30, cohort retention, aso, app store optimization, app store, google play, screenshots, ratings prompt, skstorereviewcontroller, in-app review, user acquisition, ua, att, skadnetwork, adattributionkit, virality, k-factor, referral, push notifications, opt-in, subscription app, paywall, hard paywall, free trial, revenuecat, web-to-app, anti-steering, epic v apple, external purchase link
---

## Retention is the first test

Before spending on growth, check whether people stay. Paying to acquire users who leave in a week is buying churn (see **channel-strategy**).
- **Read cohort curves, not averages.** Plot the share of each install cohort that is active on day 1, 7, 30 (D1/D7/D30) and later. The key question is whether the curve **flattens** (a stable group keeps using the app) or keeps falling towards zero. A curve that flattens, even at a low level, means there is a product for someone; one that never flattens means more users will not fix it. [practitioner]
- **Typical levels are low.** Adjust reports average retention across apps of about **26% on D1, 13% on D7 and 7% on D30**, with iOS slightly higher than Android (27/14/8% vs 24/11/6%) and food and drink apps much lower on D1 (13%). Averages across all of Adjust's clients; date of the data set not confirmed. [vendor]
- **Longer horizon.** Lenny Rachitsky's survey of growth experts suggests 6-month user retention of about 25% is good and 45% great for consumer social, 30%/50% for consumer transactional, 40%/70% for consumer subscription. Expert opinion, not measured data. [practitioner]
- Define "active" by the action that delivers value (a workout logged, a message sent), not by opening the app.
- Find the early behaviour that predicts retained users (the "activation" event), then design onboarding to drive it. Method in **email-and-lifecycle** and **metrics-and-measurement**.
- Compare retention **by acquisition source**: paid cohorts often retain worse than organic or referred ones.

## App store optimization (ASO)

ASO means improving how an app ranks in store search and how many store visitors install it. Two levers: being found (metadata) and converting the visit (product page).

**Apple App Store** [first-party]:
- Name, subtitle and the hidden keyword field drive search ranking; widely cited limits are 30, 30 and 100 characters. [first-party, not re-verified]
- Up to **10 screenshots** and **3 app preview videos** per localisation. When there is no preview video, the **first one to three screenshots appear in search results**, so they must explain the app on their own.
- **Product page optimization**: test up to **three alternative** icons, screenshot sets or previews against the original, then apply the winner.
- **Custom product pages**: extra versions of the page with their own screenshots, previews and promotional text, reached by unique URLs. Use one per ad theme or audience so the page matches the ad. They cannot be used in product page optimization tests.

**Google Play**: title, short description and full description are indexed for search (commonly cited limits: 30, 80 and 4,000 characters), and store listing experiments test graphics and text. [first-party, not re-verified]

**Ratings prompts** [first-party]:
- iOS: the system review prompt (SKStoreReviewController / requestReview) is shown **at most three times per user in 365 days**, whatever your code calls. Apple decides whether it appears.
- Android: the Play In-App Review API has a time-bound quota whose size Google does not publish and may change; calling it more than once in a short period (for example under a month) may show nothing. Do not attach it to a button, because the dialog may not appear.
- Both: ask after a moment of success (task completed, streak reached), never on first launch or after an error. Asking only happy users through a pre-screen is a common practice but check each store's current rules before filtering. [practitioner]
- General copy and landing-page conversion principles also apply to store pages (see **landing-pages-and-cro** and **messaging-and-copy**).

## Paid user acquisition after ATT

General paid-media math and creative rules are in **paid-acquisition**; app-specific points:
- **App Tracking Transparency (ATT)**, since iOS 14.5, requires opt-in before an app may track users across other companies' apps. Opt-in averages roughly a third of users (Adjust, 2025; see **paid-acquisition**). [vendor]
- Without opt-in, iOS install attribution comes from Apple's privacy frameworks: **SKAdNetwork** and its successor **AdAttributionKit** (iOS 17.4+ [not re-verified]). They send ad networks delayed, aggregated "postbacks" (reports) with a limited "conversion value" you define, such as tutorial complete or trial started. AdAttributionKit adds **re-engagement** attribution (ads that bring existing users back), with multiple active re-engagement windows since iOS 18.4. [first-party]
- Consequences:
  - Choose conversion values that predict revenue in the **first days**, because later events arrive late or not at all.
  - Expect platform-reported results to be **modelled and delayed**. Judge spend by blended cost per payer and by incrementality tests (geo or holdout; see **metrics-and-measurement** and **experimentation**).
  - Match each ad to a custom product page and measure page conversion.
- Apple Ads (formerly Apple Search Ads; renamed 2025 [not re-verified]), shown in App Store search, captures existing intent and is usually the first paid channel to test for an app with clear search demand. [practitioner]

## Virality and referral

- **Viral coefficient (K-factor)** = invites sent per user × share of invites that convert. Above 1 means each user brings more than one new user; almost no product sustains this. Below 1, virality still lowers your effective acquisition cost. **Cycle time** (how fast an invite turns into a new inviter) matters as much as K. [practitioner]
- Distinguish **inherent virality** (the product only works with others: messaging, shared lists, multiplayer) from **incentivised referral** (rewards for invites). Inherent loops last longer; incentivised ones need fraud controls.
- Referred customers retained better and had at least 16% higher lifetime value in one long field study (bank customers; Schmitt, Skiera & Van den Bulte, 2011). [research]
- Make sharing produce something useful for the receiver (a result, a playlist, an invitation to a shared space), not just a link to the store. Use deep links so the invited person lands on the shared content after install.

## Notifications and the permission prompt

- iOS always required opt-in for push notifications. **Android 13+** added a runtime permission (POST_NOTIFICATIONS), so Android users must also say yes. [first-party]
- Google's guidance: let users explore first; ask **in context**, ideally triggered by a user action (tapping a bell, following someone, placing an order), and explain what they will receive. Check that notifications are enabled before sending. [first-party]
- Airship's 2026 benchmarks report median opt-in of **61.4% on Android and 49.8% on iOS**, with wide spread by category (iOS from 41.6% for media to 76.8% for education). [vendor]
- You usually get one system prompt. Use a "pre-permission" screen in your own design first; if the user says "not now", you can ask again later without spending the system prompt. [practitioner]
- Send fewer, more personal notifications. Every irrelevant one risks the user turning them off. Measure with holdouts, as for email (see **email-and-lifecycle**).

## Subscriptions and paywalls

General pricing methods (anchoring, freemium vs trial) are in **pricing**. App-specific data from RevenueCat's *State of Subscription Apps 2026* (115,000+ apps, more than $16bn revenue, mostly 2025 data). RevenueCat sells subscription infrastructure, and its sample is apps that use it. [vendor]
- **Growth is concentrated.** Median year-on-year MRR (monthly recurring revenue) growth was 5.3%, while the top 10% grew 306%. Apps launched before 2020 still earn 69% of subscription revenue, though new subscription app launches rose to more than 14,700 per month by Jan 2026.
- **Hard paywall vs freemium.** Hard-paywall apps (pay or start a trial before using) had a median revenue per install by day 14 of $2.32, against $0.27 for low-priced freemium apps. Freemium apps convert more users late (week 6+). Compare like with like: apps choose paywalls partly because of their category.
- **Trials.** More than half of trial cancellations happen on the first day, so the first session must show value. Day-4 to day-7 conversion spikes reflect 7-day trials ending.
- **Win-back.** Annual subscribers who cancel rarely come back (about 5% reactivate); monthly subscribers return at about four times that rate.
- **Category matters.** Median realised yearly lifetime value was $35.64 for health and fitness vs $11.22 for gaming.
- Test paywall design, timing and plan mix with proper experiments (see **experimentation**). Recover failed payments: involuntary churn is common in subscriptions.

## Web-to-app funnels after the 2025 US ruling

- On **30 April 2025** a US federal court (Epic v. Apple) found Apple in contempt of a 2021 injunction, and ordered it to stop limiting links and buttons that send users to outside payment, and to stop charging a commission on those purchases. Apple updated its App Review Guidelines on **1 May 2025**: apps on the **US storefront** may include buttons, links and other calls to action to the developer's own website for purchases, without a special entitlement. [first-party / court record]
- In **Dec 2025** the Ninth Circuit Court of Appeals upheld the contempt finding but sent the **total ban on any commission** back to the lower court. On **30 June 2026** the US Supreme Court agreed to hear Apple's appeal (No. 25-1311); a decision is expected during the term that starts Oct 2026. **Whether Apple may charge a fee on linked-out US purchases is not settled.** Check current terms before building a business case on it. [court record]
- Other countries follow different rules; this section covers the US storefront only. See **platform-and-feature-risk** for planning around platform rule changes.
- Practical use:
  - **Web checkout for US users** can keep more revenue per sale and gives you the customer's email, but expect lower conversion than one-tap in-app purchase. Test both; measure revenue per user, not margin per sale.
  - **Web-to-app funnels**: acquire on the web (quiz or landing page, paid social), take payment on the web, then send the user to install. This avoids some iOS attribution limits because the conversion happens on your site. Use deferred deep links so the account is ready on first open.
  - Keep in-app purchase available unless you have tested removing it.

## What usually works by stage

| Stage | Focus | Typical actions |
|---|---|---|
| Pre-launch / beta | Prove a flattening retention curve | Small cohorts from communities and friends; instrument activation; skip paid UA |
| Early (first retained cohort) | Cheap, intent-led installs | ASO basics; Apple Search Ads on clear-intent keywords; build referral into the core loop; ratings prompt after success moments |
| Growth | Scale paid with discipline | Conversion values tied to early revenue; custom product pages per ad; incrementality tests; paywall and trial experiments; web-to-app funnel for US |
| Mature | Retention and monetisation | Win-back and re-engagement ads; plan mix and price tests; notification relevance; localisation of store pages |

## Common mistakes

- Scaling paid installs before any cohort curve flattens.
- Asking for notification permission or a rating on first launch.
- Trusting platform-reported iOS results as exact counts.
- Copying another app's paywall (hard paywall vs freemium) without considering category and how fast the app shows value.
- Moving all US purchases to the web because of the 2025 ruling, without testing conversion or watching the Supreme Court case.
- Store screenshots that show interface details instead of the outcome the user gets.

## Sources

research/local-and-consumer-apps.md §2 (Adjust retention benchmarks; Lenny Rachitsky retention survey; Apple product page, product page optimization, ratings and AdAttributionKit docs; Android notification permission and Play In-App Review docs; Airship 2026 push benchmarks; RevenueCat State of Subscription Apps 2026; Epic v. Apple orders, Apple guideline update May 2025, Supreme Court docket 25-1311; Schmitt et al. 2011).
