---
title: Getting an app noticed (App Store and Google Play)
summary: How a new or small app gets found, on the stores and around them; what store search reads, keyword-matched store pages, ratings, featuring nominations, charts and launch timing, pre-orders and pre-registration, In-App Events, short video and creators, communities, press, AI assistants, and the folklore to ignore.
tags: app store, small bets, cheap tests, google play, aso, app store optimization, app discovery, get featured, featuring nomination, today tab, app of the day, top charts, chart rank, launch day, pre-order, pre-registration, in-app events, promotional content, liveops, custom product page, custom store listing, keyword field, subtitle, apple ads, search ads, halo effect, android vitals, crash rate, tiktok app, ugc creators, product hunt, show hn, reddit launch, indie app, smart app banner, universal links, app links, firebase dynamic links, app tags
---

This playbook covers being found. Retention, paywalls, paid acquisition after ATT and web-to-app purchase flows are in **consumer-apps**; check that the retention curve flattens before spending effort on discovery.

## Start from the base rate

- **Most apps get almost nothing.** On Google Play in 2013 the top 1% of apps had about 80% of all downloads (one full-store crawl; no newer public data). [research, 2013 data]
- Among new subscription apps using RevenueCat's tools, about **17% reach $1,000 a month** and about **5% reach $10,000 a month** within two years. A sample of apps that already built a paywall, from a company that sells the paywall tool. [vendor]
- Every success story below is a survivor. Plan for a slow start, a few spikes, and a product that must keep the people the spikes bring.

## Store search: what each store reads

**Apple App Store** [first-party]
- Apple says search results use **text relevance** (title, subtitle, keyword field and primary category) and **user behaviour** (downloads, ratings and reviews, "and more"). Promotional text does not count, and Apple asks you not to stuff the description.
- Apple's own 2026 research paper describes a ranker that mixes behaviour signals with meaning-based text matching; text matching does more of the work for rare searches, where there is little behaviour data. For a new app with few downloads, that means niche searches are where you can win, and the words in your name and subtitle carry them. [first-party research]
- Write the name and subtitle in the words people actually type for the task ("budget planner", "split bills"), not a slogan. The keyword field is **100 bytes**, not 100 characters: accented letters take 2 bytes and Japanese, Chinese or Korean characters take 3. Use commas without spaces and don't repeat words already in the name. Check it with check_copy_limits, which counts this field in bytes. [first-party]
- Apple says almost **65% of downloads happen directly after a search** (worldwide, 2022). In App Store Connect, the "App Store search" source also includes Apple Ads downloads, so separate paid from organic before judging your store-page work. [first-party]

**Google Play** [first-party]
- There is no keyword field. The title (30 characters), short description (80) and full description (4,000) carry the text match; Google also names ratings, reviews, downloads and technical quality.
- Google says Play may show an app less if its **user-perceived crash rate is above 1.09%** or its **"app not responding" rate is above 0.47%** (averaged across devices). On Play, fixing crashes is discovery work.
- Google gives no figure for the share of installs that come from search.

**Store pages that match the search** [first-party]
- Since 2025 both stores can show a different page per search keyword. Apple: up to **70 custom product pages**, and keywords assigned to a page show it in organic search. Google Play: up to **50 custom store listings** targeted by search keyword.
- A practical start for a small team: two or three pages for the main reasons people want the app, each with screenshots that show that outcome. Apple's claimed uplift for these pages has no published method.
- Apple also generates **App Store tags** from your metadata; review them in App Store Connect and remove wrong ones, since they place you in tag collections.

**Testing the store page**
- Apple product page optimization tests icons, screenshots and previews (up to 3 treatments, up to 90 days); Play store listing experiments test graphics and text. Both report at 90% confidence by default, so about 1 in 10 "wins" is noise. Re-test big changes; a low-traffic app may never reach a result. [first-party; practitioner]
- For test design and sample size see **experimentation**.

## Ratings and reviews

- On Google Play, the displayed download count moved installs about **8 times more** than the displayed star rating: a 10-percentile rise gave about 25% more downloads, against about 3% for stars. Prompt for ratings after a moment of success, but don't expect stars alone to drive growth. [research, one study of Google Play]
- Prompt rules (three iOS prompts a year, no pre-screening on Play) are in **consumer-apps**.
- Think before resetting your App Store rating: it resets per country, removes the count that signals popularity, and written reviews stay. [first-party]
- Reply to bad reviews; Google reported an average rise of 0.7 stars after a reply (2019, Google's own data). [first-party]
- Keep at least **3.0 stars** on Play: the Top Free chart has required it since February 2023. [first-party]

## Featuring

- **Nominate every launch and major update in App Store Connect.** It is free. Apple's two pages give different minimums (two weeks and three weeks) and recommend up to **three months ahead** for wider consideration. Plan on six to twelve weeks. Apple promises no reply. [first-party]
- Editors judge design, user experience, accessibility, localisation and the product page. Today-tab stories may be personalised, so a feature reaches people who already download similar apps. [first-party]
- **A feature is a spike, not a baseline.** Vendor before-and-after numbers range from about +200% (lists and stories) to +700% or more (App or Game of the Day) on the day. Most of the gain comes in the first one or two days and is mostly gone within a week. Samples are from 2017–2023 with undisclosed windows, and no peer-reviewed study measures today's Apple featuring. [vendor]
- Use the spike: have the ratings prompt, onboarding and a way to keep in touch (account, email, notifications) ready before it happens.
- Featuring also lifts the same developer's other apps and the same app on the other store, but barely helps similar apps from other developers. [research]
- **Google Play's routes for a small non-game app are narrow.** The public featuring form is for discounted paid titles. The Apps Innovation Corner takes US-based teams of 1 to 30 people with a 4.0+ rating and an app under two years old. Promotional content (Play's in-store event cards) is open to all games, but non-game apps need large spend or user numbers. [first-party]

## Charts and launch timing

- Apple says its charts rank the most downloads in **about the past 24 hours**. [first-party]
- Chart position causes demand, not only reflects it: in early App Store paid charts, rank 1 sold about 150 times as much as rank 200, and moving from #20 to #1 roughly doubled demand. These studies use paid-app charts from 2010–2014; an app far down the charts gets little from rank itself. [research]
- One field study (six games, 2018–19, before ATT) found that switching off all ads cut organic installs by 20–30%, working through category chart rank. [research, working paper]
- Together these support **concentrating a launch into one or two days**: release, community posts, press, any paid test and your own audience on the same day, ideally aimed at a category chart you can reach. Buying incentivised installs to climb charts breaks Apple's rules and Google filters it. [first-party; research]
- **Pre-orders (iOS) and pre-registration (Play) bank launch-day installs.** Apple says fulfilled pre-orders count as downloads and "can contribute to stronger chart placement"; a new app can take pre-orders 2 to 180 days ahead. Play notifies everyone who pre-registered and auto-installs on eligible devices; up to 90 days, one reward; Google suggests starting 3 to 6 weeks before launch. No independent data on how many pre-registrations turn into installs. [first-party]
- Phased release (iOS) is for safe updates, not for launch or discovery. [first-party]
- **Apple In-App Events** are free and appear in search and on editorial surfaces: up to 10 live, up to 31 days each, with 14 days of promotion before the start. Use them for real content moments (a challenge, a season, a new feature), not as ads. The only uplift data is Google's own, for large Play events. [first-party]

## Paid search inside the stores

- **Apple Ads** puts you at the top of App Store search; relevance gates the auction. Since March 2026 Apple shows **several ad slots** in search results, so even the #1 organic result may sit below more than one ad. Many small apps now bid on their own name and core keywords to keep that top spot. [first-party]
- Apple does not claim that ads lift organic rank. Ads lifting organic installs through chart rank is plausible (study above), but no controlled study measures Apple Ads search alone. Vendor "halo" percentages have no control group. Test with a holdout (switch ads off in one country or for two weeks) before counting on it. [first-party; research; vendor]
- Apple Ads Basic, with a cost-per-install cap, is the lowest-risk first paid test. General paid-media maths is in **paid-acquisition**.

## Discovery outside the stores

**Short video and creators**
- The documented indie take-offs mostly came from **someone else's video, timed to a platform moment**, then from the chart: Widgetsmith (iOS 14 widgets, an unpaid creator walkthrough) and Locket (widgets, a founder TikTok, then users copying the format) both reached No. 1 without paid creators. You can't schedule this. You can make the app easy to show in 15 seconds, and be ready when it happens (Locket's rating fell to 3.4 during its surge). [practitioner; press]
- Paid creator programmes at volume are the 2024–26 pattern for AI consumer apps, but the public numbers are founder-reported only. The best causal study of creator promotion (Twitch streams of games) found a small, short effect, and only about one in six games would profit from sponsored streams. Start with a few creators and a tracked link per creator before paying retainers; the brand is legally responsible for creators' ad disclosure (see **pr-and-influencers**). [press; research; first-party]
- A founder who can be the person on camera is the cheapest version of this channel. [practitioner]

**Communities and launch sites**
- A community hit typically brings a few hundred to a few thousand installs. One documented solo launch got about 4,500 installs in two days from reaching No. 1 on Hacker News, and 5,500 from a stranger's Reddit post; another got nothing measurable from Product Hunt. [practitioner, single cases]
- Rules: Show HN wants something people can try without signing up and now rejects "quickly-generated one-offs"; asking friends to upvote breaks its rules. Reddit has no sitewide self-promotion ratio (the "10% rule" is folklore) but bans fake participation, and each subreddit's moderators decide. Product Hunt features launches by editorial judgement and publishes no featuring rate. [first-party]
- Post where the people with the problem already gather, as a maker answering questions, and count installs from each post with its own link. See **organic-social-and-community**.

**Press**
- Press is a long shot for an unknown app. Aim at standing indie slots (for example 9to5Mac's weekly Indie App Spotlight) and at real news. One documented solo launch sent twenty pitches and got no coverage. Free app promo codes still exist for reviewers; for in-app access use offer codes, since in-app purchase promo codes ended on 26 March 2026. [first-party; practitioner]

**The web and AI assistants**
- Build the web basics once: a landing page that ranks for "[task] app" and links to the stores; a Smart App Banner for iOS Safari; Universal Links and Android App Links for every share and referral link. **Firebase Dynamic Links stopped working on 25 August 2025**; replace them if you still use them. [first-party]
- Tag links so traffic shows as Web Referrer or campaign in App Store Connect and as UTM or referrer in Play Console. Give each creator or community its own custom product page with its own link. [first-party]
- Google's mobile "app pack" in web results has no Google documentation; app markup on your own page affects your page's rich results, not the app pack. [first-party]
- AI assistants now recommend apps, mostly by reading store listings: in one May 2026 sample, 47.5% of ChatGPT's app citations were store pages. In one August 2026 US survey, 10% of adults said an AI assistant was where they first heard of their latest app. Both figures come from a vendor that sells AI-visibility tools. A clear, task-specific store description and website serve store search and assistants at once. See **ai-assistant-visibility**. [vendor]

**Sharing built into the product**
- In a randomised trial, automatic notifications to friends about a user's activity raised adoption 246%; adding personal invites added only 98% more. Let use show up to friends where the product allows it, and make shared items open the right screen after install. [research]
- Platform limits: no forced reviews or forced installs, no "select all" contact invites, no rewards for ratings. iOS 18 lets users share only some contacts, which shrinks address-book invite flows. [first-party]
- Referral programme design is in **referral-programs**.

## Store rule changes that touch discovery (2025–2026)

- **US Google Play:** since 22 July 2026 your Play listing is shown in enrolled rival US Android stores by default, with installs still going through Play; you can opt out. For most small apps this is extra reach at no cost. [first-party]
- **EU and Japan alternative app marketplaces** give a small app no discovery yet: none publishes audited user numbers, one EU store closed in February 2026, and apps distributed outside the App Store lose App Store search and featuring. Their value is fees and control, and only if you bring your own audience. [first-party; press]
- **Fees** (no effect on discovery): Apple's Small Business Program charges 15%; Google Play 10% on the first $1M a year from mid-2026, plus a billing fee in major markets. Purchase links out of US apps: see **consumer-apps**. [first-party]

## Folklore to stop repeating

- "Launch on Wednesday because Apple features on Thursday": dates from the weekly refresh before 2017; no current Apple source names a day. [rule-of-thumb]
- "Burst ~120,000 US downloads in 2–3 days to reach the charts": no sample or date; vendors sell these campaigns. The direction (concentrate the launch) has support; the thresholds don't. [rule-of-thumb]
- "Google Play charts use a 7–14 day window weighted by retention": Google only says charts are "heavily influenced by popularity". [rule-of-thumb]
- "Apple indexes screenshot captions": a 64-phrase test found no strong evidence, and Apple's search page lists no screenshot text. Write captions for people. [vendor; practitioner]
- "The US App Store also indexes your Spanish (Mexico) keywords": Apple lists supported languages per storefront but says nothing about indexing. Widely used vendor testing, not confirmed. [vendor]
- "Apple Ads lifts organic rank 20–30%", "preview videos lift conversion 20–40%", "featuring lifts downloads 1,747%": no method, a single old month, or no traceable source. [vendor]
- "Only 10% of Product Hunt launches are featured", "Reddit's 10% rule", "TikTok gives every video 200 views": no first-party source. [rule-of-thumb]
- "Viral means a K-factor above 1": the documented take-offs spread through creators and charts, not measured invite loops.

## A launch plan for a small team

1. Four to twelve weeks before: submit the featuring nomination; open pre-orders or pre-registration; write the name, subtitle and keywords for the searches you can win; build two or three keyword-matched store pages; fix crashes on Android.
2. Launch week: put everything on one or two days (release, community posts, own audience, any press, a small Apple Ads test on your name and core keywords); prompt for ratings after a success moment; watch onboarding and crash rate.
3. After: run an In-App Event for the next real content moment; test one store-page change at a time; post short videos of the app doing its job and keep the formats that get copied; measure installs per source with tagged links and custom pages.

Each step should state what result would make you stop it (see **experimentation** and **launches-and-gtm**).

## Small bets: cheap discovery tests

When nothing is proven yet, run several cheap tests rather than one expensive campaign. Each one below costs little money, takes days rather than months, and can be measured on its own. Before starting, write down the result that would make you keep it and the result that would make you stop: a number of installs or retained users per hour of work or per dollar, compared with your current baseline. Most will fail; that is the point of keeping them small. This is the app-store version; small bets for any business (listings, open source, social media, building in public, a public changelog, emailing every new user) and the method for running them are in **small-bets**.

| Bet | Cost | How to measure | Notes |
|---|---|---|---|
| One keyword-matched store page per user need | Screenshots and an afternoon | Page conversion and installs per custom product page (Apple) or custom store listing (Play) | Free; Apple allows up to 70 pages, Play up to 50. Start with two or three. [first-party] |
| Name and subtitle rewritten for one niche search | An hour | Installs from App Store search before and after, over the same weekdays | Text match matters most for rare searches, where a new app can rank. One change at a time. [first-party] |
| Apple Ads Basic | Your cost-per-install cap; new accounts get a $100 credit (terms apply) | Installs and later retention from the Apple Ads source | No keyword control; capped at $10,000 per app per month. Next step if it works: Advanced on your own name and core keywords. [first-party] |
| Featuring nomination | Half an hour | Whether you are featured; the spike if you are | Free; submit up to three months ahead. No reply is promised, so cost is the only thing you control. [first-party] |
| An In-App Event for a real content moment | Event card art and copy | Event page views and installs in App Store Connect | Free; up to 10 live, 31 days each. Only Google's own data on uplift, from large Play events. [first-party] |
| One community post where the problem is discussed | A few hours, including answering comments | Installs through a tagged link or its own custom product page | A hit brings hundreds to a few thousand installs in documented single cases; many posts bring nothing. Follow each community's rules. [practitioner; first-party] |
| Show HN (if the app can be tried without signing up) | A few hours on launch day | Same as above | Rejects "quickly-generated one-offs"; asking friends to upvote breaks the rules. [first-party] |
| Founder-made short videos of the app doing its job | A phone and 30 minutes a video | Views to installs per video, with a link per platform | Keep the formats people copy; drop the rest after a fixed number of posts you set in advance. [practitioner] |
| Two or three paid creators | Their fee | Installs and paying users per creator, each with their own link or custom product page | The one causal study (Twitch, games) found small, short effects; creators must disclose the ad. [research; first-party] |
| A pitch to a standing indie-app slot | An email and promo codes | Coverage, then installs from the web referrer | For example 9to5Mac's weekly Indie App Spotlight. Cold pitches to general press rarely land. [first-party; practitioner] |
| Pre-orders or pre-registration for the next app or major release | Setup time | Pre-orders or pre-registrations, then installs on release day | Banks launch-day installs into Apple's 24-hour chart window. [first-party] |

**Measuring small numbers.** App Store Connect shows campaign links only after a day and at least five installs (App Units), and many of these tests produce tens of installs, not thousands. Judge a bet on installs that stay (day-7 users or trial starts), compare like days of the week, and treat a single good day as a lead to repeat, not a result. [first-party; practitioner]

## Sources

research/app-store-search.md (Apple App Store search and App Store Connect docs; Apple Machine Learning Research 2026; Google Play Console help and Android vitals; Engström & Forsell; Garg & Telang; Carare; Ju, Zhao & Aral working paper; vendor ASO data). research/app-store-featuring-and-launch.md (Apple featuring, pre-order, In-App Events and chart statements; Google Play featuring, pre-registration and promotional content docs; chart-rank research; vendor featuring data; 2025–2026 store rule changes). research/app-discovery-outside-stores.md (PlayDrone 2013; RevenueCat 2026; Widgetsmith, Locket and creator cases; Twitch sponsorship study; Hacker News, Reddit and Product Hunt rules; founder launch write-ups; Apple and Android linking docs; AppTweak AI citation data; Aral & Walker). All read 2026-10-05 unless a note marks an item snippet-only.
