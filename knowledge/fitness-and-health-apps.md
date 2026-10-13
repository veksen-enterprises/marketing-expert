---
title: Fitness and health apps
summary: Marketing a consumer fitness or health app, including fitness games that turn real movement into game progress; Apple HealthKit and Google Health Connect rules (no health data for ads), the Play health declaration, the FTC Health Breach Notification Rule for apps that sync wearables, health and weight-loss claims, the January and fresh-start effect, what research says about gamification, exergames, social features and wearables, channels (run clubs, gyms, creators, Apple new-year stories, corporate wellness, Strava and its 2026 API terms), and subscription data for Health & Fitness.
tags: fitness app, health app, workout app, fitness game, exergame, step counter, walking app, running app, gamification, pokemon go, healthkit, apple health, health connect, google fit, wearable, apple watch, garmin, strava, strava api, health data, health breach notification rule, hbnr, health claims, weight loss claims, substantiation, general wellness, fda, new year, january, fresh start effect, seasonality, run club, gym, personal trainer, fitness creators, corporate wellness, challenges, leaderboard, health and fitness subscription, premium tier
---

This playbook covers what is special about fitness and health apps. General app topics (retention curves, store optimisation, paid installs after Apple's tracking rules, notification prompts, paywall basics) are in **consumer-apps**. Being found on the stores is in **app-store-discovery**. Privacy law in general is in **privacy-and-marketing-law**.

## Health data rules shape your marketing

_In short:_ Apple and Google forbid using health data (steps, workouts, heart rate) for ads, or passing it to ad platforms. Plan your ad tracking around this before launch, not after.

The rules apply to data read from Apple Health (HealthKit, Apple's health data store) and Google Health Connect (Android's equivalent).

**Apple** [first-party]:
- Data from HealthKit and Motion and Fitness may not be used or shared "for advertising, marketing, or other use-based data mining" (App Review Guideline 5.1.3). You may still show ads in the app, but not ads targeted with HealthKit data.
- You may share HealthKit data with a third party only with the user's express permission, and only if that party also provides a health or fitness service to the user. Never sell it to ad platforms or data brokers (companies that buy and resell personal data).
- HealthKit use must be for health or fitness and must be clear "in both your marketing text and your user interface". Say "syncs with Apple Health" on the store page.
- Disclose which health data you collect. Do not write false data into HealthKit, and do not store personal health data in iCloud.
- You cannot see when a user refuses read access: the app just sees no data. Design onboarding so a user who says no still gets a working app, and explain the benefit before the system prompt.
- HealthKit is locked when the phone is locked, so background reads may fail. A game that promises "your steps count automatically" must handle late data.

**Google Play** [first-party]:
- Health Connect lists **"health-integrated games"** as an approved use: games where progress or rewards depend on real-world activity. Fitness games are a recognised category.
- Banned: selling or passing health data to ad platforms, data brokers or resellers, and using it to serve ads, "including personalized or interest-based advertising".
- Each Health Connect permission needs a written reason in Play Console. Ask for the fewest data types you need.
- Every app must complete the **Health apps declaration** in Play Console (required since 31 August 2024), even apps with no health features. Fitness tracking counts as a health feature.
- Health apps without medical-device clearance that offer medical functions must say in the store description that the app is "not a medical device and does not diagnose, treat, cure, or prevent any medical condition". Whether a pure step game needs this is not stated; adding it costs nothing.

**What this means for marketing:**
- An ad network's conversion event like "workout completed" or "reached 10,000 steps" is health data leaving the app. Send ad platforms only non-health events (install, account created, trial started, purchase).
- Keep analytics tools that receive health values separate from ad tools, and list both in your privacy policy.
- Never let a third-party SDK (a code library from another company) inside the app read HealthKit or Health Connect data unless it provides the user a health service.

## US law: the Health Breach Notification Rule

_In short:_ In the US, a fitness app that syncs with a wearable is probably covered by an FTC rule. Sharing health data with ad platforms without consent counts as a breach you must report.

- The FTC's **Health Breach Notification Rule** (HBNR) covers "vendors of personal health records": apps holding health data that can draw it from more than one source. The FTC's own example is a fitness app that collects height, weight and age and syncs with wearable trackers. Syncing Apple Health or Health Connect very likely puts your app inside it. [first-party]
- A "breach" includes sharing data without the user's authorisation, for example through an ad pixel or SDK, not only hacking. You must tell affected users within 60 days, tell the FTC, and tell the media if 500 or more people in one state are affected. Penalties are up to $53,088 per violation. [first-party]
- The cases so far are health apps that sent data to ad platforms: GoodRx and BetterHelp (in **privacy-and-marketing-law**) and Flo Health, a period tracker that shared health data with Facebook and Google despite privacy promises (2021). No case against a pure fitness app was found. [first-party; Flo snippet-only]
- **Not legal advice.** Outside the US, health data is usually "special category" data with stricter consent rules. Ask a lawyer before launching paid ads in a regulated market.

## Claims you can and can't make

_In short:_ Promise what users will do (walk more, play daily) rather than health results (lose weight, lower blood pressure). Health-benefit claims usually need randomised human trials in the US.

**Substantiation** means holding evidence for a claim before you make it. The FTC rules for health claims [first-party]:
- Health benefits generally need "randomized, controlled human clinical testing" (FTC Health Products Compliance Guidance, 2022). The guidance covers health apps.
- Testimonials that show better results than users usually get are likely deceptive. "Results not typical" does not fix this.
- **Lumosity (2016):** $2M for claiming brain games improve school, work and sports performance. The FTC's point: getting better at the game does not prove a real-world benefit. It also failed to disclose that testimonials came from a prize contest. A fitness game faces the same test: "players walk more" is a measurable claim; "players get healthier" needs health evidence.
- **Reebok (2011):** $25M in refunds for claiming toning shoes gave 28% more buttock strength than normal shoes.
- **Weight loss:** the FTC lists claims it treats as always false, such as losing two pounds or more a week for a month without diet or exercise, permanent loss after stopping, or substantial loss "for all users".

**Medical vs wellness (FDA)** [first-party]:
- The FDA's General Wellness guidance (January 2026) treats low-risk products for general fitness or weight management, without reference to a disease, as outside active device oversight.
- Mentioning a disease ("helps manage diabetes", "prevents heart disease") moves you toward medical-device rules.
- Apple rejects apps that claim to measure blood pressure, glucose or blood oxygen with phone sensors alone, and asks medical apps to tell users to see a doctor.

**Safe wording for a fitness game:** describe the activity and the experience ("your real steps power your hero", "walk with friends", "a reason to go outside every day"). Do not promise weight, fitness or medical results unless you have a trial to point to. Creators who promote you must disclose payment, and you are responsible for what they claim (see **pr-and-influencers**).

## Retention benchmarks

_In short:_ Health and fitness apps keep users about as well as average apps on day one, but most public benchmarks beyond that are unreliable. Trust your own cohorts more than blog figures.

- Adjust reports day-1 retention of 27% for health and fitness apps, close to the 26% all-app average. Vendor data; the date is not confirmed. Full benchmarks are in **consumer-apps**. [vendor]
- Sensor Tower reports 30-day retention of 31% and 20% for two large step-reward apps (2025). These are top apps, not a typical app. [vendor]
- Day-30 figures of 3%, 5% or 8–12% for fitness apps appear on many blogs. Their primary reports could not be read and the figures disagree. Do not use them as targets. [snippet-only]
- For a fitness app, define "active" by the core action (a workout logged, a walk counted, a quest finished), not by app opens.

## Seasonality: January and other fresh starts

_In short:_ People start health goals after "fresh starts": a new year, month, week or birthday. January is the biggest spike but fades fast, so plan smaller monthly and weekly moments too.

- **The fresh start effect** (Dai, Milkman & Riis, 2014): US Google searches for "diet" rose 82% at the start of a new year, 14% at the start of a week and 4% at the start of a month. At one university gym (11,912 students), the chance of a visit rose 33% at the start of a week, 14% at the start of a month, 12% at the start of a year, 47% at the start of a semester and 8% after a birthday, then fell as each period went on. [research; observational; one free university gym]
- **January brings a download surge.** Sensor Tower credits New Year's resolutions for a strong start to 2025: January downloads were the highest since January 2022, and January in-app revenue was $385M, up 10% year on year. Modelled estimates from a data seller. [vendor]
- **Apple runs new-year health stories.** "26 Apps for 2026" featured several fitness and wellness apps. Submit a featuring nomination in App Store Connect by October or November for January (see **app-store-discovery**). Apple gives no selection rules. [first-party]
- **The spike fades.** In a study of 54 four-week gym programmes (61,293 members), almost half raised visits by 9–27%, but only 8% still had an effect after the four weeks. [research; one fitness chain]
- **Gyms earn from people who don't come.** Monthly members paying over $70 used the gym about 4.3 times a month, more than $17 a visit against a $10 pay-per-visit option (three US clubs, 2006). A subscription fitness app may see the same pattern; it can look like revenue now and churn later. [research]
- **Summer and other peaks:** no measured summer peak in app downloads was found. Pre-summer and back-to-school messages are common practice, not evidence. [rule-of-thumb]

Practical use:
- Time launches, challenges and re-engagement messages to start on a Monday or the 1st of a month, and to birthdays if you know them.
- Frame the restart as a clean slate ("new month, new streak"), especially for lapsed users.
- Do not judge the product on January cohorts. Compare January cohorts with each other year on year, and with a non-January month.

## What keeps people moving: research on game design

_In short:_ Game elements raise activity in trials, and competition lasts longest. But most effects shrink when the game stops, so an app needs fresh content and real social ties.

**Gamification** means using game elements (points, levels, badges, quests) outside games.
- A meta-analysis (a study that pools many studies) of 16 randomised trials with 2,407 people found gamification raised physical activity by a small-to-medium amount (Hedges g=0.42, a standard effect-size measure). The effect shrank to g=0.15 about 14 weeks after the programmes ended. One author works for a gamification company. [research; meta-analysis]
- **Competition lasted longest.** In the STEP UP trial (602 adults), a 24-week game with points and levels raised daily steps by 920 with competition, 689 with support and 637 with collaboration. Twelve weeks after the game stopped, only competition still beat the control group (+569 steps). [research; RCT, n=602]
- In families, a similar game added 953 steps a day during the trial and 494 after it ended. [research; RCT, n=200]

**Exergames** are games you play by moving. Pokémon GO is the best-studied case:
- Young US adults who started playing walked 955 more steps a day in week one. The gain faded and was gone by week six. [research; n=1,182, cohort study]
- In data from 32,000 wrist-tracker users, engaged players walked 1,473 more steps a day (over 25%) for 30 days. The game reached inactive people, while four leading health apps drew mostly already-active people. Authors worked at Microsoft. [research]
- A 2026 review of 186 sources found the step gains "often short-lived", lasting longer for older adults and inactive or overweight young adults. People kept playing because of regular content updates. [research; scoping review]
- Across 20 reviews of active video games, only 23% of interventions had effects after they ended. [research; umbrella review]

**Social features:**
- Seeing anonymous peers' progress raised exercise class sign-ups more than motivational messages (6.3 vs 5.7 vs 4.5 control). [research; RCT, n=217]
- Running spreads between friends. Less active runners influence more active ones, not the other way round. [research; ~1.1 million runners]

**Wearables:**
- Activity trackers add about 1,800 steps a day on average across 39 reviews (163,992 people). [research; umbrella review]
- But adding a wearable to a weight-loss programme led to less weight loss after two years (3.5 kg vs 5.9 kg). Trackers help activity; they are not a weight-loss promise. [research; RCT, n=471]

What to take from this:
- Design for week six, not day one. Plan a content calendar (new quests, seasons, events) before launch, because novelty alone fades within weeks.
- Add competition between friends or small groups (leaderboards, weekly duels). Reward coming back after a missed day: in the 54-programme study, the best one gave small rewards for returning after a missed workout. [research]
- Your best marketing claim may be who you reach: a game can reach people who don't use fitness apps. Test messaging to non-exercisers ("a game you play by walking") against messaging to athletes.

## Channels that fit fitness apps

_In short:_ No study ranks fitness-app channels, so treat each as a small test. Clubs, creators, new-year editorial and wearable integrations are reasonable starts; corporate wellness is slow and its value is unproven.

- **Run and walk clubs.** Strava says new clubs on its platform nearly quadrupled in 2025, to 1 million, and running clubs grew 3.5 times. A club is a ready-made group that already competes and meets weekly. Offer a club challenge or club leaderboard, with a tagged link per club. [vendor]
- **Gyms and trainers.** A trainer can put many clients on an app at once. No data was found on conversion or retention from this channel. Test with a few trainers and a free coach view. [practitioner]
- **Fitness creators.** Short videos of the app working are the cheapest test. Creator effects in the one causal study were small and short (see **app-store-discovery**). Paid creators must disclose, and must not make health claims you could not make yourself. [research; first-party]
- **Apple and Google editorial.** Nominate in App Store Connect for new-year, spring and summer moments, and use In-App Events for real challenges (see **app-store-discovery**). [first-party]
- **Wearable makers.** Apple's WorkoutKit lets your workouts appear in the Apple Watch Workout app with your name and icon. Garmin offers Health, Activity and Training APIs through a developer programme; its overview page does not state fees or approval terms. [first-party]
- **Strava.** A Strava connection brings an existing audience, but its June 2026 API rules are strict: show each user only their own Strava data (unless the app's athlete capacity is 9,999 or fewer), cache it no more than seven days, no analytics or AI on it, no Strava data in ads, and no charging users for features built on Strava data. A leaderboard or premium tier built on Strava data breaks these rules. Use Apple Health and Health Connect as the main data source and Strava as an optional extra. See **platform-and-feature-risk** for planning around partner terms. [first-party]
- **Corporate wellness** (employers paying for staff health programmes). Health Connect lists it as an approved use. Two large randomised trials found employer wellness programmes did not change medical spending, clinical health or productivity in 18 months, and participants were already healthier. Sell on engagement and staff experience, not health savings, and expect long sales cycles (see **b2b-saas-sales-led**). [research; first-party]
- **Challenges** (time-boxed group goals, such as "100 km in March") join three things that work: a fresh-start date, competition and a social group. They also give clubs, creators and editors something to share. [research; practitioner]

## Making money: subscriptions in Health & Fitness

_In short:_ Health & Fitness earns more per install than any other subscription category in RevenueCat's data, mostly from annual plans. But only a quarter of annual plans renew, so judge the business on renewals.

RevenueCat's *State of Subscription Apps 2026* (115,000+ apps; RevenueCat sells subscription tools, and the sample is its customers). General figures are in **consumer-apps**; category figures [vendor]:
- Download to paid: 2.9% median, the highest category. Download to trial 6.9%; trial to paid 37.7% (top quarter above 51.4%).
- Revenue per install: $0.48 by day 14 and $0.66 by day 60, the highest category. Realised lifetime value (revenue actually collected per payer): $24.23 at month 1, $35.64 at year 1.
- Median prices: $4.99 a week, $9.99 a month, $39.94 a year. 68% of category revenue comes from annual plans. Most apps offer a trial (only 18.3% don't), and 54% use 5–9-day trials. 60% show two plans on the paywall.
- **Renewals are the weak point:** median first renewal of annual plans is 25% (middle half 16–37%), against about 40% for the best categories. Monthly plans renew at about 57% the first time.

**Hard paywall vs freemium** (a hard paywall asks for payment or a trial before use; freemium gives a free version forever):
- Across all categories, hard-paywall apps converted about 10.7% to paid by day 35 against 2.1% for freemium, with 8 times the revenue per install by day 60. Apps choose their model partly because of their category, so this is not a controlled comparison, and RevenueCat gives no split for Health & Fitness. [vendor]
- For a fitness **game**, the research above says reach and habit come from playing often with friends. A hard paywall cuts the social group that keeps players. A common approach is free core play with a premium tier for extra content, seasons or cosmetics. That is practitioner judgement, not a measured result: test it. See **pricing** for trial and freemium methods. [practitioner]
- The January surge brings users who leave soon. Show annual-plan renewal by signup month, so January cohorts do not inflate the forecast.

## What usually works by stage

_In short:_ Before launch, get the data rules right and prove people still play at week six. Then add clubs, editorial moments and challenges, and only later paid ads and employer sales.

| Stage | Focus | Typical actions |
|---|---|---|
| Pre-launch / beta (a handful of testers) | Prove use lasts past novelty; get compliance right once | Measure week-1 to week-6 activity per tester; check no health data reaches ad or analytics SDKs; complete the Play Health apps declaration; write store copy with activity claims only; plan four to six weeks of content before launch |
| Launch | One concentrated moment | Launch on a fresh-start date (a Monday or the 1st; January if timing allows); submit a featuring nomination 6–12 weeks ahead; invite a few run or walk clubs with a club challenge |
| Early (first retained cohort) | Social and repeat moments | Friend and group competition; monthly challenges; return-after-a-miss rewards; tagged links for each club, trainer and creator; Strava as an optional connection within its terms |
| Growth | Scale what retained | Paid ads with only non-health conversion events; In-App Events for each season; test premium-tier pricing and annual plans; track annual renewals by signup month |
| Later | New buyers | Corporate wellness pilots sold on engagement; wearable-maker integrations; localised new-year campaigns |

## Common mistakes

_In short:_ The costly mistakes are sending health data to ad platforms, promising health results, judging the app on January, and building key features on partner data you may not use that way.

- Sending events such as "workout completed" or step counts to ad networks or ad SDKs. This breaks Apple and Google rules and may be a reportable breach under US law.
- Store copy or creator scripts promising weight loss, "burn fat" or health outcomes without trial evidence.
- Showing before-and-after testimonials with results most users won't get, or not disclosing that reviewers got prizes.
- Judging retention or revenue on January cohorts alone, or reading the January spike as product-market fit.
- Relying on novelty: no content plan after week four, when most exergame effects have faded.
- Building leaderboards, premium features or AI coaching on Strava data, which its 2026 terms forbid.
- Selling corporate wellness on health-cost savings that large trials did not find.
- Forcing users to grant every health permission. The app cannot see denials, so it looks empty and users leave.

## Folklore to stop repeating

_In short:_ Several popular fitness-app statistics have no traceable source. Use them as stories, not targets.

- "Quitter's Day is the second Friday of January" and "80% abandon resolutions by February": attributed to a 2019 Strava analysis; no published method found. The direction fits the fresh-start research; the date and the 80% don't have a source. [snippet-only]
- "Fitness apps have 3% (or 5%, or 8–12%) day-30 retention": figures differ across blogs and their primary reports could not be read. [snippet-only]
- "Gamification is just a novelty": a smaller effect remains months later (g=0.15). But "gamification makes habits stick" is too strong too. [research]
- "A wearable or app helps people lose weight": the best long trial found less weight loss with a wearable. [research]
- "Corporate wellness pays for itself": not found in two large randomised trials. [research]
- "Summer is the second-biggest season for fitness apps": no measured source found. [rule-of-thumb]

## Sources

research/fitness-and-health-apps.md (Apple App Review Guidelines 1.4.1, 2.5.1, 5.1.2, 5.1.3; Apple HealthKit privacy and Health and fitness pages; Google Play Health Connect, Health apps declaration and Health Content and Services policies; Strava API Agreement and API Policy 2026; Garmin developer programme; FTC Health Breach Notification Rule guidance, Flo Health, Health Products Compliance Guidance, Lumosity, Reebok, Gut Check; FDA General Wellness 2026; Dai, Milkman & Riis 2014; Milkman et al. 2021; DellaVigna & Malmendier 2006; Sensor Tower 2025; Apple "26 Apps for 2026"; Mazeas et al. 2022; Patel et al. 2017 and 2019; Zhang et al. 2015; Aral & Nicolaides 2017; Howe et al. 2016; Althoff et al. 2016; Koh et al. 2026; Vera-Ponce et al. 2025; Ferguson et al. 2022; Jakicic et al. 2016; Song & Baicker 2019; Jones, Molitor & Reif 2019; Strava Year in Sport 2025; RevenueCat 2026). research/local-and-consumer-apps.md (Adjust retention benchmarks; RevenueCat overall figures). research/privacy-and-marketing-law.md §3 (GoodRx, BetterHelp, HBNR 2024 amendments). research/app-store-featuring-and-launch.md and research/app-discovery-outside-stores.md (featuring nominations, In-App Events, creator study).
