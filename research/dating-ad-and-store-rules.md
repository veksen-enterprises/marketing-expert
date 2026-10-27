# Which ad platforms and app stores restrict dating apps, and how? (checked 2026-10-27)

Question: a founder starting a dating app at day one gets `listings` ("works with no users") from `match_small_bets`, and `knowledge/paid-acquisition.md` treats paid search and paid social as open to anyone. Do the big ad platforms and the two app stores put extra gates on dating apps (pre-approval, certification, bans, adults-only targeting, review rules), and which of those stop a new founder on day one?

Hop 0 from lead #108 (seed: `src/lib/smallBetsCatalog.ts` store and paid bets; `research/small-bets.md` item 23 quotes Apple 4.3). Access marks as in `relaunch-rules.md`. Apple Ads placements and history are in `research/app-store-search.md` item 41 and `research/app-store-featuring-and-launch.md` item 42; ad copy limits are in `research/platform-specs.md`. Not repeated.

## Sources

1. Apple, "App Review Guidelines", "Last Updated: October 16, 2026". https://developer.apple.com/app-store/review/guidelines/ [read 2026-10-27; fetched with curl, full text] [first-party]
2. Apple, "Apple Advertising Policies", dated 26 Feb 2025 on the page. https://ads.apple.com/policies [read 2026-10-27; fetch summary] [first-party]
3. Google Ads, "Dating and Companionship" (Advertising Policies Help 15328393), no date on page. https://support.google.com/adspolicy/answer/15328393?hl=en [read 2026-10-27; fetch summary] [first-party]
4. Google Ads, "New Dating and Companionship Ads policy and advertiser certification program (March 2025)", posted 4 Dec 2024. https://support.google.com/adspolicy/answer/15327789 [read 2026-10-27; fetch summary] [first-party]
5. Google Ads, "Updates to the Google Ads Dating and Companionship policy (August 2025)", posted 12 Aug 2025. https://support.google.com/adspolicy/answer/16473212?hl=en [read 2026-10-27; fetch summary] [first-party]
6. Meta, Advertising Standards, "Dating Ads". https://transparency.meta.com/policies/ad-standards/restricted-goods-services/dating-ads/ [not read: the page renders by script and both fetches returned only its title]
7. ConductAtlas, provision record "Dating ads require prior written permission", reproducing Meta's ad policy text (source given as facebook.com/policies/ads), captured 23 Jul 2026. https://conductatlas.com/platform/meta-ads/meta-advertising-policies/provision/CA-P-053199/dating-ads-require-prior-written-permission/ [read 2026-10-27; fetch summary] [third-party mirror of first-party text]
8. ROIBest, "Dating App Marketing Restrictions by Platform (2026)", 14 Sep 2026. https://www.roibest.com/resources/blog/dating-app-marketing-restrictions/ [read 2026-10-27; fetch summary] [vendor blog; used only for Meta's 18+ rule, which no first-party page here confirmed]
9. TikTok Ads, "Adult content" policy, "Last updated: June 2026". https://ads.tiktok.com/help/article/tiktok-ads-policy-adult-content?lang=en [read 2026-10-27; fetch summary] [first-party]
10. Snap, "Ads category requirements: Dating", no date on page. https://values.snap.com/policy/ads-category-requirements/dating [read 2026-10-27; fetch summary] [first-party]
11. Google Play, "Age-Restricted Content and Functionality" (Play Console Help 16302250). https://support.google.com/googleplay/android-developer/answer/16302250?hl=en [read 2026-10-27; fetch summary] [first-party]
12. Google Play, "User Generated Content" (Play Console Help 9876937), no date on page. https://support.google.com/googleplay/android-developer/answer/9876937?hl=en [read 2026-10-27; fetch summary] [first-party]

Not fetched: Reddit's ad policy (search to redditinc.com was refused by the search proxy; no first-party page found); Meta's "Run a compliant dating ad" help page (facebook.com refused the fetcher, robots_disallowed); Meta's own dating page (item 6). X ads and Microsoft Ads were not searched. No source gave how long any approval takes.

## Findings

### Ad platforms

1. **Google Ads: certification before any dating ad runs.** "Dating and companionship advertisers must be certified by Google in order to serve ads." Enforcement began 4 March 2025. Certification rests on "an in-depth review" that may cover ads, landing page and post-login content; the application asks for app IDs and test log-ins when access is restricted. [first-party, 3, 4, read; fetch summary]
2. **Google: two levels, adults only, some countries closed.** A "Restricted" certificate allows Search only; a "General" one allows Search, Display and Video. Both carry age and country limits. The policy text requires services that "do not allow users under 18". Since August 2025, ads don't serve in 18 countries, among them Egypt, Saudi Arabia, Pakistan and Morocco. Japan needs a separate certificate. [first-party, 3, 5, read; fetch summary]
3. **Google bans undisclosed fake profiles in advertised services.** "Deceptive dating services", including AI-generated profiles or chatbots "without sufficient disclosure", may not advertise. This touches seeding (lead #105). [first-party, 3, read; fetch summary; ad policy only, not a law]
4. **Meta: prior written permission.** "Ads for dating services are only allowed with prior written permission", and they must follow the "dating targeting requirements". [first-party text via mirror, 7, read; fetch summary; captured 23 Jul 2026; Meta's own page not seen] A vendor blog says approved ads must target 18+ and that permission is asked through a form. [vendor, 8; not confirmed first-party]
5. **TikTok: through a sales representative, 18+.** "You must work with a TikTok Sales Representative." Ads "must be restricted to audiences aged 18 years and older"; models who look 21 or younger are not allowed; apps "purely designed for casual sex" are banned; 15 countries are closed, including Turkey. [first-party, 9, read; fetch summary; updated June 2026] [unverified: the same policy at ads.tiktok.com/resources/help/article/tiktok-ads-policy-adult-content lists nine closed countries, without Turkey, and says "Last updated: August 2026"; the ?lang=en URL still lists 15 with Turkey; the two copies conflict] Self-serve TikTok ads are therefore not open to a new dating app. [derived from 9]
6. **Snap: 18+ only, no pre-approval named.** "Ads for dating services must be age targeted to 18+, or the legal age of majority". No sexual content, no infidelity, no people who look too young; 15 countries closed. [first-party, 10, read; fetch summary; the page states no approval step, and other Snap pages were not read]
7. **Apple Ads: search results only.** Dating or matchmaking ads are "Allowed*" in search results and "Not Allowed" on the Search tab, Today tab and product pages. In some countries they need an adults-only app. [first-party, 2, read; fetch summary; page dated 26 Feb 2025]

### App stores

8. **Apple 4.3(b): saturated category.** "Certain kinds of apps, such as dating, flashlight, sound effects, wallpaper, simple timers, and fortune telling, are well established on the App Store and we will not accept new submissions unless they offer a meaningfully different or improved experience." Apple "may remove these apps" later "if they are not updated, improved, or do not attract customers." [first-party, 1, read; guidelines of 16 Oct 2026] So the store listing is a review gate, not a free listing: the founder must show what is different. The same 4.3(a) text bans one app per city; city variants go in one app (already in `small-bets.md` item 23).
9. **Apple 1.2: four tools before review.** Apps with user content "must include" a filter for objectionable material, a way to report content with "timely responses", the ability to block abusive users, and published contact details. Random or anonymous chat and "hot-or-not" voting "do not belong on the App Store". [first-party, 1, read] 1.1.4 excludes "hookup" apps. [first-party, 1, read] 5.1.1(v): an app with account creation must offer account deletion in the app. [first-party, 1, read]
10. **Google Play: block minors.** "Apps whose core functionality is to facilitate matchmaking or dating" are age-restricted and "required to use the Play Console functionality and tools to block minors". [first-party, 11, read; fetch summary; no effective date seen]
11. **Google Play UGC:** users accept terms before posting; "robust, effective, and ongoing" moderation; in-app reporting and blocking; for one-to-one features, in-app blocking. [first-party, 12, read; fetch summary] No dating-specific rule on that page.

### What blocks day one

12. On day one a new dating app cannot run self-serve ads on Google (certification), Meta (written permission) or TikTok (sales rep) the way the playbook implies. Snap and Apple Ads search are open with 18+ or placement limits. Every platform read here limits ads to adults. [derived from 2–10] How long approval takes is unknown.
13. Store submission is open but harder: Apple can reject an app that looks like existing dating apps, and both stores expect report, block and moderation tools in the first build. [derived from 1, 11, 12]

## What this changes

1. **`listings` bet, a dating note.** `match_small_bets` today returns `listings` with "works with no users" for a profile with category "dating app" (run 2026-10-27, consumers, mobile app, not launched). No bet mentions 4.3 or 1.2. `SmallBetsFacts` drops `category` and `product`, so the tool can't tell a dating app apart. Edit: pass `category` and `product` into the facts; give `Bet` an optional `notes: { match: RegExp; note: string }[]`, appended to the fit reason; on `listings`, match `/dating|matchmak/i` with: "Apple accepts a new dating app only if it is meaningfully different (guideline 4.3), and both stores expect reporting, blocking and content filtering at review (Apple 1.2; Play blocks minors from dating apps)." Test: category "dating app" returns that note on `listings`; category "B2B SaaS" does not.
2. **No paid-ads bet exists.** The paid bets in the catalog are newsletters, sponsorships and commissioned posts, not ad platforms, so there is no paid bet to annotate. The ad-platform finding belongs in `knowledge/paid-acquisition.md`, "Channel notes": one line, "Dating apps: Google needs certification, Meta prior written permission and TikTok a sales rep before any ad runs; all limit ads to 18+. Apply before you plan a paid test. [first-party; checked 2026-10-27]". No test checks that line beyond `consistency.test.ts`.

## What this does not settle

- How long Google certification or Meta permission takes, and whether a pre-launch app with no users can get either.
- Reddit, X and Microsoft Ads rules.
- Meta's own page text and its 18+ rule (seen only via a mirror and a vendor blog).
- How often Apple rejects new dating apps under 4.3; no figure was found.
- Whether a "friends" or activity-partner app with mutual matching counts as dating under each policy.
