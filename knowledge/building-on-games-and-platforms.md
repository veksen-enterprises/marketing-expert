---
title: Building on someone else's game or platform
summary: Playbook for products built around another company's game or platform, such as fan-made companion sites, item databases, build planners and Discord bots for a publisher's game, and fitness games that turn real movement into game progress. Compares publishers' fan-content rules (Blizzard, Riot, Microsoft, Epic, Square Enix, Wizards, Mojang, Grinding Gear) on names, art, data, logos, ads, donations and paid tiers; dated takedowns and reversals; real-money trading and datamining risk; Discord verification, App Directory and monetisation rules on others' IP; App Store and Google Play category choice (Games vs Health & Fitness), age ratings and how fitness games categorise; money models that survive the rules; and what works by stage.
tags: fan site, fan tool, companion app, game companion, item database, build planner, discord bot, fan content policy, game content usage rules, legal jibber jabber, intellectual property, trademark, cease and desist, takedown, real money trading, rmt, datamining, game api, api key, publisher licence, discord app directory, discord verification, premium apps, monetization policy, app store category, games vs health and fitness, google play category, age rating, fitness game, exergame, overwolf, donations, sponsorship
---

This playbook is for products whose value comes from **someone else's game or platform**. Two common shapes: a free fan-made companion for a publisher's online game (item database, character planner, calculators, a Discord bot), and a mobile fitness game that turns walking or running into game progress. Community growth, Discord privileged intents, Premium Apps fees and donation platforms are in **community-and-hobby-products**. General platform risk (Twitter, Reddit, absorption) is in **platform-and-feature-risk**. Health-data rules for fitness apps are in **fitness-and-health-apps**; store search and featuring in **app-store-discovery**. This page covers what those leave out. It is not legal advice.

Key terms used below:
- **IP (intellectual property)**: the game's names, art, text, music and logos, owned by the publisher.
- **Trademark**: a protected name or logo that tells buyers who made a product.
- **Licence**: written permission to use someone's IP, usually with conditions.
- **EULA / terms of service**: the contract every player accepts to play.
- **Cease-and-desist letter**: a lawyer's demand to stop. A **DMCA notice** is a US copyright takedown request sent to a host.

## Which permission are you relying on?

_In short:_ Three permissions exist: a fan-content policy (free use, revocable any time), a developer API programme (sometimes allows paid products), or a written licence. Know which one covers each feature before charging anything.

1. **Fan-content policy.** A public page saying fans may use the IP for free, non-commercial work. Every policy read says the publisher can revoke it at any time, for any reason [first-party; Blizzard, Microsoft, Riot, Epic, Square Enix, Wizards, 2015–2026].
2. **Developer API programme.** Rules for apps that use the publisher's official data feed (API, an interface programs use to request data). Riot allows commercial products with a valid API key, a free tier and review [first-party; Riot policies, May 2025]. Blizzard's API terms ban paid "premium" versions [first-party; 2019]. Grinding Gear says it "cannot allow" its IP "to be used to generate commercial revenue" and, on 6 Oct 2026, was not accepting new API applications [first-party].
3. **Written licence.** A signed deal. Blizzard says it "does not enter into licensing agreements with individuals" for merchandise [first-party; Blizzard Legal FAQ].

A fan site that is tolerated is not licensed. Tolerance is the publisher choosing not to act yet.

## What publishers allow fans to do

_In short:_ Most publishers allow free fan sites that credit them and avoid their logos. They differ on ads and donations. Paid tiers need an API programme that allows them, or a licence.

| Publisher (page, date) | Names and art on a fan site | Logos / name in domain | Ads | Donations | Paid tier or paywall | App store apps |
|---|---|---|---|---|---|---|
| **Blizzard** (Legal FAQ; trademark guidelines) | Yes, for "noncommercial and personal use only", keep notices | No product names in domains; no Marks with your own name | FAQ: noncommercial use only; API terms: no forced video ads | API terms: no donation screens before features | API terms: no premium versions | Not addressed on these pages |
| **Microsoft** (Game Content Usage Rules, 2015) | Yes, with a required notice | No game logos in your logo; title may refer to the game, not look official | **No**, except YouTube/Twitch partner revenue; free apps may not earn from ads | "Optional donation requests" allowed | No; not on a page that sells anything | Can't sell an app with game content |
| **Riot** (Legal Jibber Jabber) | Yes; say it's a fan project | Not stated on that page | Passive ads allowed | Only while live-streaming | Not without a licence or valid API key; Patreon-style paywalls and crowdfunding banned | Only with a licence or API key |
| **Epic** (Fan Content Policy) | Yes, if freely accessible | Name only if clearly unofficial; no altered Marks | Only on web videos | Not listed | "No commercial (i.e., monetary) objective" | Same rule |
| **Square Enix, FFXIV** (NA policy, 16 Sep 2026) | Yes, with "© SQUARE ENIX" | No logos on physical items | Not listed as an exception | Not listed | No revenue except platform partner programmes and sponsors of streams | Not addressed |
| **Wizards of the Coast** (2017) | Yes, with set wording | No logos or trademarks | Yes | Yes | No paywall, no required email signup | Not addressed |
| **Mojang, Minecraft** | Yes, with "NOT AN OFFICIAL MINECRAFT" notice | Domain allowed if not official-looking; name not dominant in the title | Yes, if it doesn't harm the brand | Server rules allow them | Servers may charge; sites not "principally to make money" | Name can't be the main title |

All rows [first-party; pages read 6 Oct 2026]. Blizzard has been part of Microsoft since 13 October 2023 [first-party; SEC filing, snippet-only], but neither company's page says whether Microsoft's rules cover Blizzard games. Follow the stricter one until a publisher says otherwise.

**Data is not the same as art.** Facts (an item's stats) are often treated differently from images and text, but these pages don't say so. Blizzard's EULA bans "unauthorized" software that "mines" data from the game, and Grinding Gear bans reverse-engineering undocumented endpoints [first-party]. Item icons and art copied from the game fall under the art rules above.

## What gets fan tools taken down

_In short:_ Dated takedowns cluster around four triggers: scraping game servers, enabling gambling or cash trades, shipping the publisher's files, and clashing with the publisher's own plans. Backlash sometimes reverses them.

| Date | What happened | Trigger |
|---|---|---|
| Jul–Aug 2016 | Pokévision and other Pokémon GO trackers shut down; developers posted cease-and-desist emails citing the terms of use. The CEO had said taking data out of the system "is against our terms of service" [press; TechCrunch] | Unofficial access to game servers |
| 13 Jul 2016 | Valve said skin-gambling sites broke the Steam user agreement by using Steam login and automated accounts, and began sending notices to stop [press quoting Valve] | Gambling with in-game items |
| Jun 2017 | Take-Two's cease-and-desist shut the OpenIV modding tool; after backlash, Rockstar said Take-Two "generally will not take legal action" against "single-player, non-commercial" projects [press; TechRadar] | Tool enabled online cheating mods; reversed |
| Aug 2018 | Nintendo took down Pokémon Essentials, a fan game kit that bundled the games' sprites and music [press; snippet-only] | Distributing the publisher's assets |
| Sep 2021 | Jagex first asked a fan HD graphics plugin to cancel because Jagex had its own project [snippet-only], then released it on 13 Sep after "a positive agreement" [first-party] | Clash with the publisher's roadmap; reversed |
| 1 Jun 2022 | Jagex listed only two approved third-party clients and banned feature types that help in boss fights or player-versus-player combat [first-party] | Game balance and economy |

**Read:** a free reference site that uses public information, credits the publisher and avoids these four triggers has no takedown on record in this set. That is an absence of evidence, not a promise. Reversals came after large public backlash and ended in narrower written rules, not open permission [anecdote; two cases].

## Real-money trading, datamining and player data

_In short:_ A trade tool that touches real money puts its users' accounts at risk. Keep prices in game currency, block cash offers, read data only through allowed routes, and never sell data collected through Discord.

**Real-money trading (RMT)** means selling in-game items, currency, accounts or services for real money.
- Blizzard's current EULA bans gathering items "for sale/selling/exchanging outside of the Platform", paid boosting, and "communicating or facilitating" commercial offers in the game [first-party; revised 21 Mar 2024]. The EULA binds players. The publisher's levers against a tool are banning its users and IP claims against the site.
- Blizzard itself closed Diablo III's real-money auction house on 18 March 2014. It said trading "ultimately undermines" the game's core loop: "kill monsters to get cool loot" [first-party; 17 Sep 2013]. Publishers see cash trading as a threat to the game, not just a rules issue.
- Valve's 2016 action shows the risk for a third party that builds a service on item transfers [press].
- **What to do:** prices only in game currency or item swaps; a rule and filter against cash, payment links and account sales; report and remove such posts; say so publicly. Discord also bans selling Discord accounts and servers, game cheats, and illegal gambling [first-party; Community Guidelines, Sep 2025].

**Datamining** means extracting data from the game's files or network traffic. Blizzard's EULA bans unauthorized software that "mines" platform data, with discretion for some third-party interfaces [first-party]. Grinding Gear allows only documented endpoints and its listed data exports [first-party]. A database built from what players post publicly avoids that clause but brings the Discord rules below. No case was found for or against databases built from player trade posts.

**Data from Discord bots.** Discord's policy limits API data to the app's stated purpose and bans selling it or giving it to ad networks [first-party; see **community-and-hobby-products**]. Its terms also say an approved app may not change "the scope of API Data you collect or how you use or share it" without new review [first-party; Developer Terms, Jul 2024]. So **selling trade-price data to businesses (B2B data) is closed** if the data came through a Discord bot.

## Discord as your business platform

_In short:_ Past 100 servers you need verification with ID. The App Directory and Premium Apps both bar content using others' IP without permission, so a game-named paid bot can fail even when the publisher tolerates it.

- **Verification**: "required for your app to scale past 100 servers"; the team owner verifies identity through Stripe and may have to reverify [first-party; updated Oct 2026]. Plan it before a launch.
- **App Directory** (Discord's in-app store of bots): needs verification, a public privacy policy and terms, content fit for ages 13+, and no "gambling-adjacent" features. "Your Application's name, description, and commands must not contain any IP-violating content" [first-party; Sep 2026]. A bot named after the game, with game art as its icon, risks rejection. Use your own name and describe the game in plain text.
- **Monetisation**: Discord's Monetization Policy says you may not monetise content "associated with ... intellectual property of other rights holders without written permission" [first-party; effective May 2024]. Premium Apps also need a verified, team-owned app run from the US, UK or EU, and the app "may not be bought or sold without Discord's approval" [first-party]. Selling extras on a fan bot through Discord therefore needs the publisher's written permission, or extras that don't use the publisher's IP.
- **Rule changes**: on 1 Sep 2022 verified bots without approval started receiving empty message content [first-party]. In 2025–26 the threshold moved to 10,000 users with yearly re-review (see **community-and-hobby-products**). Discord's terms say it "may develop products or services that may compete with" yours and may limit API access "at our convenience upon notice" [first-party].
- **Teens**: Discord's 2026 teen protections let parent-set spending limits cancel Premium App purchases [first-party]. Treat a cancelled purchase as normal.

## Platform dependency in one paragraph

_In short:_ Every layer here can change terms with short notice. Keep a website and email list you own, so a lost bot or API key does not lose the audience.

A fan tool stacks three platforms: the publisher (IP and data), Discord (bot and community) and often an app store. Each has changed rules with short notice: Riot says that if it revokes your API key "you must immediately shut down your Project" [first-party]; Grinding Gear may remove API access "without notice" [first-party]; Discord emptied message content for unapproved bots in 2022 [first-party]. The Twitter (2023) and Reddit (2023) cases and warning signs are in **platform-and-feature-risk**. The practical defence here: a website and an email or account list you own, so users can find you if the bot is removed [practitioner].

## Fitness games: Games or Health & Fitness?

_In short:_ The primary category sets your tab, charts and Screen Time grouping. Big-IP location games pick Games; fitness-first studios pick Health & Fitness with Games as secondary. Choose by where buyers search.

**What Apple says** [first-party; Choosing a category; Discovery; Review Guidelines Jun 2026]:
- You pick a primary and a secondary category. The primary decides where you appear when people browse or filter search, and whether you sit on the **Games tab or the Apps tab**. Each tab has its own top charts and editorial collections; the Today tab has both an App of the Day and a Game of the Day.
- **Games**: "interactive activities for entertainment purposes". Games pick up to two subcategories (Role Playing, Adventure...) and appear in those subcategory charts. **Health & Fitness**: "healthy living, including stress management, fitness, and recreational activities".
- Apps with Games (or Entertainment) as primary **or secondary** category land in that Screen Time "Time Allowance" group, which parents can limit.
- Pick the category that "best describes the main function"; Apple may change a category that is "way off base".
- The Apple Games app (iOS 26) shows every game a player has downloaded and supports challenges for games with Game Center leaderboards. Apple doesn't say whether Health & Fitness apps appear there.

**Google Play** [first-party]: you choose app or game, then **one** category, plus up to five tags. Health and Fitness covers "personal fitness, workout tracking". Free games also appear on Google Play Games on PC by default. Play lists "health-integrated games" as an approved Health Connect use (see **fitness-and-health-apps**).

**How fitness games actually categorise** (US stores, checked 6 Oct 2026) [first-party store data]:

| App | Apple primary (secondary or game subcategories) | Google Play |
|---|---|---|
| Pokémon GO | Games (Strategy, Role Playing; Health & Fitness) | Adventure game |
| Pikmin Bloom | Games (Health & Fitness, Adventure, Casual) | Adventure game |
| Monster Hunter Now | Games (Action, Role Playing) | Action game |
| Run An Empire | Games (Health & Fitness, Strategy, Simulation) | not checked |
| Zombies, Run! | Health & Fitness (Entertainment) | Health and Fitness |
| The Walk: Fitness Tracker Game | Health & Fitness (Sports, Adventure, Games) | not checked |
| Walkr, Fitscape, Walking RPG | Health & Fitness (Games or Entertainment) | not checked |

**Read:** games built on a famous IP choose Games; studios selling the product as a workout or walking aid choose Health & Fitness and add Games as the secondary category [first-party data; 10 apps, one day].

**Trade-offs to weigh** (our reading of the sources above):
- **Competition**: Games took about 31% of all downloads in 2025 [vendor; AppTweak estimates, both stores]. A study of the Android store found more apps in a category reduce each app's downloads [research; Ershov 2024]. Big studios fill the Games charts. No study measured chart difficulty for Health & Fitness versus Games.
- **Who searches where**: someone looking for "walking app" or "step counter" browses Health & Fitness; someone looking for an RPG browses Games. Search uses the primary category as a relevance signal (see **app-store-discovery**).
- **Money**: Health & Fitness has the highest revenue per install among subscription apps in RevenueCat's data (see **fitness-and-health-apps**) [vendor]. Game players are used to in-app purchases and cosmetics.
- **Rules**: a game with loot boxes must show odds (Apple 3.1.1) and is rated at least 9+; "health or wellness topics" such as exercise advice also mean at least 9+; social media features 13+ [first-party; iOS 26 age ratings]. Google Play uses IARC ratings (a shared age-rating questionnaire): Pokémon GO is "Everyone", Monster Hunter Now "Teen" [first-party store data].
- **Health claims** follow you in either category (see **fitness-and-health-apps**).

**Test, don't guess.** Changing the category is a metadata change. Compare store impressions and conversion from browse and search for four to six weeks in each, and keep everything else fixed [practitioner]. Expect noise from seasons such as January.

## Ways to earn money that survive these rules

_In short:_ Sell what you made, not what the publisher made: ad-free or convenience tiers only where policy allows, donations where listed, sponsors from neighbouring tools, an official API route, or your own IP.

From safest to riskiest for a fan tool:
1. **Donations and supporter thanks**, where the publisher allows them (Microsoft: optional; Wizards: yes; Riot: streams only) [first-party]. Never gate features behind them; Blizzard's API terms ban donation screens before features [first-party].
2. **Sponsorship by neighbouring tools** (a mouse maker, a streaming tool, a hosting firm). Wizards allows it if labelled and not from competitors [first-party]. Blizzard bans showing its Marks next to gambling content [first-party]. Avoid sponsors from boosting, gold-selling or skin-gambling sites.
3. **Ads**, only under a publisher that allows them. Riot, Wizards and Mojang do; Microsoft and Square Enix do not [first-party]. Ad platforms for in-game apps exist: Overwolf reported passing $300M paid to creators in 2025 [vendor; its own total, no per-app split].
4. **Paid tier through an official route.** Riot's API programme allows charging for "transformative" features with a free tier [first-party]; Riot-API companions such as Mobalytics sell subscriptions [snippet-only]. Without such a programme, a paid tier is the most likely trigger for a demand to stop.
5. **Your own IP.** Features that use none of the publisher's assets: your own planner engine, your own icons, alerts, saved builds, account sync. These are easier to sell on Discord (its IP rule) and the app stores (Apple 5.2) [first-party]. They may still count as "commercial use" under a strict policy such as Square Enix's.
6. **B2B data** (selling data to businesses): closed for data collected through Discord bots [first-party]. Possible only for data you own or have a licence to sell.

For a fitness game, the publisher problem goes away if the IP is yours. Then the normal subscription and in-app purchase advice in **fitness-and-health-apps** and **consumer-apps** applies.

## What usually works by stage

_In short:_ Start free with credits and a disclaimer, then add a website and email list you own. Add allowed income only when costs rise. Before charging, get written permission or move features to your own IP.

| Stage | Usually works | Usually fails |
|---|---|---|
| **Launch** | Free tool; your own brand name with the game named only in the description; required notice text; no game logos; prices in game currency only | Game name in the domain or bot name; copying game files; any real-money field |
| **Growing** | Discord verification before 100 servers; a public privacy policy; your own website and email list; ship before patches and new seasons | Collecting more Discord data than the feature needs; letting cash offers through |
| **Costs rising** | Donations or sponsors where the publisher allows them; ad-free or convenience extras built on your own IP | Paywalls on the core lookup; Premium Apps extras built on the publisher's art |
| **Business** | Apply to an official API programme or ask for a written licence; diversify across games | Assuming tolerance will last; taking outside money for a product the publisher could stop |

For a fitness game: pick the category that matches how buyers search; recheck age-rating answers whenever you add chat, loot boxes or health advice; test a category change only with fixed creatives.

## Common mistakes

_In short:_ The usual mistakes are treating tolerance as permission, putting the game name in your domain, monetising game art on Discord, allowing cash trades, selling bot-collected data, and choosing a category without checking competitors' choices.

- Treating a publisher's silence as a licence. Every policy read is revocable at will [first-party].
- Using the game's name as your brand or domain. Blizzard bans it; Mojang and Epic allow it only when clearly unofficial [first-party].
- Assuming ads and donations are allowed everywhere. Microsoft bans ads; Square Enix allows no website revenue; Riot bans Patreon-style paywalls [first-party].
- Selling Discord Premium App extras built on the publisher's art or names without written permission [first-party].
- Letting a trade channel carry cash prices or account sales [first-party; publisher EULAs].
- Planning B2B data sales from bot-collected messages [first-party; Discord policy].
- Reading undocumented game endpoints or files to fill a database [first-party; Blizzard EULA, Grinding Gear].
- For fitness games: choosing a category without checking what similar apps chose, or forgetting that a Games secondary category still puts the app in Screen Time's Games limit [first-party].

## Sources

research/building-on-games-and-platforms.md (Blizzard Legal FAQ, trademark guidelines, EULA and 2013 auction-house post; Microsoft Game Content Usage Rules; Riot Legal Jibber Jabber; Epic, Wizards, Square Enix, Mojang, Grinding Gear and Jagex policies; Pokévision, Valve, OpenIV, Pokémon Essentials and Jagex cases; Discord verification, App Directory, Monetization Policy, Developer Terms, Community Guidelines, 2022 message-content change and 2026 age assurance; Apple category, discovery, review-guideline and age-rating pages and store category data; Google Play category and IP pages; Ershov 2024; AppTweak 2025; Overwolf 2025). Also research/community-and-hobby-products.md (Blizzard API terms, Riot developer policies, Discord data policy) and research/platform-and-feature-risk.md. Pages read 6 Oct 2026; snippet-only items are marked in the research note.
