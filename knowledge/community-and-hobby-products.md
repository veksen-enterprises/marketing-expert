---
title: Community and hobby products
summary: Playbook for free tools built on top of existing communities (Discord bots, game companion tools and databases, fan sites, community aggregators, open hobby projects). Starts from the founder's goal, then covers overlay products that depend on moderators and member consent, ways to earn money without breaking trust (donations, Discord Premium Apps, charging server owners, ads, cosmetic features), Discord and game publisher rules including real-money-trading bans, growth timed to game events, measurement, and what works by stage.
tags: discord bot, community tool, hobby project, side project, fan site, gaming, donations, patreon, game companion, overlay, aggregator, monetization, ko-fi, github sponsors, premium apps, fan content policy, real money trading, rmt, moderators, open source
---

This playbook is for products that live **inside someone else's community**: a Discord bot, a build planner or item database for a game, a fan wiki, a tool that collects posts or trades from many servers, an open-source hobby project. They are usually free, often run by one person, and the founder may not want revenue at all. For building your own community, see organic-social-and-community. For platform dependence in general, see platform-and-feature-risk.

## First question: what is your goal?

Ask this before any other advice. The right plan and the right base rates differ.

| Goal | What success looks like | What to optimise | What not to do |
|---|---|---|---|
| **Hobby** | You enjoy it; people use it; costs stay small | Fun, low running cost, low moderation burden | Adding payments, growth targets or a company "because you should" |
| **Side income** | Covers hosting, then pays something | Donations or a small paid tier; time per week | Promising features or support you can't keep up with a day job |
| **Lifestyle business** | Replaces a salary | Paying users per hour of work; owned contact list | Depending on one game or one platform for all income |
| **Venture** | Large growth, outside money | A path beyond one community (see startup-risk-and-opportunity) | Assuming a fan tool can raise money while the publisher forbids commercial use |

**Base rates.** Do not apply new-business survival rates or VC return figures (startup-risk-and-opportunity) to a hobby project; they measure businesses that registered and tried to earn money. Evidence on side projects is thin, so say so:
- People who start a business while keeping a paid job ("hybrid entrepreneurs") are a large share of all entrepreneurs, and those who later go full time survive much better than people who quit their job to start directly (Folta, Delmar & Wennberg 2010, Swedish register data) [research]. This supports keeping the day job until the project proves itself; it says nothing about hobby projects that never aim to earn.
- Among open-source maintainers surveyed by Tidelift, about 60% are not paid for maintenance, and about a quarter receive any income from donation programs such as GitHub Sponsors (2024) [vendor: Tidelift sells paid maintenance]. Expect donations to cover costs, not a salary.
- No reliable dataset was found on how many Discord bots, fan sites or game tools earn money or how long they last.

## How overlay and aggregator products work

An **overlay** product adds a layer on top of a community that already exists (a bot in a server, a tool on top of a game's data). An **aggregator** collects activity from many places into one (trade listings from many servers, events from many guilds). Their value comes from the community's existing activity, not from content you create.

- **Supply is permissioned.** Moderators and server admins decide whether your bot is installed, which channels it can read, and whether members may post links to your site. They are your real gatekeepers, and they can remove you in one click. Treat them as your first customers [practitioner].
- **Liquidity before reach.** As in marketplaces, an aggregator is only useful when one place has enough activity: enough listings that a search finds something, enough players that a group-finder fills a group. Get one game, one region or one server cluster working before spreading (see marketplaces on "atomic networks", meaning the smallest group that is useful on its own) [practitioner].
- **Trust and consent of members.** People wrote their messages for their server, not for your site. If you collect or republish member activity:
  - Ask the server admins, and tell members the bot is there and what it stores.
  - Give an easy opt-out and a working removal path. Discord's Developer Policy requires you to delete user data when the user or Discord asks [first-party].
  - Store only what the stated feature needs. Discord's policy limits API data to what is needed for the app's stated functionality, bans selling it or passing it to ad networks or data brokers, and bans training AI models on message content without Discord's permission [first-party].
  - Privacy law may apply as well (see privacy-and-marketing-law).
- **Don't run a self-bot.** Automating a normal user account to read servers you weren't invited to breaks Discord's rules ("Each account must be associated with a human, not a bot") [first-party]. Use a proper bot account that admins invite.

## Making money without breaking the community

Order these from least to most risk to trust:

1. **Donations and supporter tiers.** Patreon (pages created since 4 Aug 2025 pay a 10% platform fee plus payment processing) [first-party/press]; GitHub Sponsors (no fee on sponsorships from personal accounts) [first-party]; Ko-fi (no platform fee on one-time tips on the free plan; fees on memberships and shop sales unless you pay for Ko-fi Gold) [not re-verified]. Give supporters thanks, a role or badge, or early access, not the core feature. Show running costs openly; "help keep the servers on" is a reason people understand [practitioner].
2. **Charge server owners, not members.** A server admin running a large community gets more value (moderation, analytics, events) and has a budget; members came to chat. Charging the admin keeps the experience free for everyone else [practitioner]. **Discord Premium Apps** supports this directly: subscriptions can be **per-server** (the whole server gets the benefit) or **per-user** (works across servers), plus one-time purchases and a store page in the App Directory [first-party]. Developers keep 85% (less processing fees) of the first US$1 million in cumulative sales per team, then the fee returns to 30% [first-party]. Apps must be verified, owned by a developer team and based in a supported country (US, UK and EU were named) [first-party; locale list not re-verified]. If you monetize on Discord, Discord requires supported offerings to be available through Premium Apps at a price no higher than elsewhere [first-party].
3. **Cosmetic or "more of it" features.** Custom bot name or colours, higher limits, longer history, extra dashboards. Sell extras; keep the **core loop** (the main thing people come for, such as looking up an item or joining a group) free.
4. **Ads.** Easy to add, but they change how the community sees you: from "one of us" to "a business using us". On game data they are also often restricted (see below). If you use them, keep them off the core loop and never force them before a feature.

**Paywalling the core loop** is the most common way these products lose their community. Anecdote: the Discord bot MEE6 drew public backlash in 2022 after promoting NFTs and moving previously free features behind its premium plan; users built a website listing alternative bots [anecdote; community sources]. One case, not a measured effect, but it matches how switching works: another free bot is one click away.

## Platform and IP rules

Read the actual terms of every platform and publisher you rely on before you charge anything. Rules change; check the current page.

**Discord** [first-party]
- **Privileged intents** (access to member lists, presence and message content): under the 2025–2026 change, apps can switch them on until they reach **10,000 users** (unique users who can see the app); then they must apply. Approved apps must **reapply every year**, with 90 days after notice. The old rule was "apply at 100 servers".
- **Verification** is commonly described as required at 100 servers for the bot to join more servers [not re-verified on primary page]. Plan for it before a growth push: a stalled review can block new installs.
- Data rules above (stated purpose only, no selling, no ad networks, no AI training on message content, delete on request).

**Game publishers** (rules differ; these are examples, not legal advice)
- **Blizzard Developer API Terms**: no "premium" paid versions of apps that use the API, no charging players to access or download, no donation-request screens before features, no forced video ads, and API data may not be used for monetization purposes [first-party, read via snippets]. The archived AddOn Policy says add-ons must be free and ad-free [first-party archive; may be outdated]. Blizzard's Video Policy limits use of its content to non-commercial purposes [first-party].
- **Riot "Legal Jibber Jabber"** (fan projects): free fan projects are supported; without a written licence, no commercial projects, which includes crowdfunding, running it through a business entity, or paywalled content; passive ad revenue is allowed; label it as a fan project [first-party]. Riot's **developer policies** for API products are more permissive: the product must be registered and approved, must have a **free tier** (ads allowed), and anything you charge for must be "transformative" (adds new information or insight) [first-party].
- **Valve / Steam**: Steam Web API data may be shown to users for their personal use; snippets describe bans on reselling API data [first-party; not re-verified].
- Pattern: publishers tolerate free fan tools because they help the game, and restrict selling access to their data or content. The more you charge, the more likely you need a licence.

**Real-money trading (RMT)** = selling in-game gold, items, accounts or services for real money. Blizzard prohibits it (penalties up to account closure; the WoW Token is the approved route) [first-party]; Steam allows trading only through its own marketplaces [first-party]. A **trading tool must stay clear of RMT**: no price fields in real currency, no payment links between players, ban listings that offer cash, and say so in your rules. Otherwise the publisher can ban your users, send a legal notice, or treat your tool as an RMT site, and you can lose the whole community at once.

## Growth inside communities

- **Moderators first.** Ask permission before posting in a server or subreddit; offer the tool for their community; take their feedback publicly. A moderator who installs it brings the whole server [practitioner].
- **Time launches to the game's calendar.** Patches, new seasons, ladder resets and expansions are when players look for new builds, guides and tools; search and community activity rise around them [practitioner]. Ship updates before the event, not after (see launches-and-gtm).
- **Creator partnerships.** Streamers and YouTubers who play the game can show the tool in use. Offer free access, a custom feature or credit; if you pay, disclosure rules apply (see pr-and-influencers and video-and-youtube).
- **Reddit**: follow each subreddit's self-promotion rules and disclose you made it (see organic-social-and-community).
- **Built-in sharing**: bot outputs, shareable builds and profile pages carry your name to new servers; this is usually the main growth loop (see referral-programs on loops) [practitioner].

## Measuring

- **Per community, not just totals**: active servers, commands or lookups per active server per week, share of servers still active after 30 and 90 days. A large install count hides servers that removed or ignore you (see retention-and-expansion).
- **Retention by cohort**: users or servers by the month they joined; watch for a dip after each game season.
- **Word of mouth**: ask new admins "how did you hear about us?"; track installs from other servers and from creators' links.
- **Cost per active user**: hosting and your hours. For a hobby this is the number that decides whether it's still fun.

## What usually works by stage

| Stage | Usually works | Usually fails |
|---|---|---|
| First community | Build for one game or server you play; talk to its moderators; fix their problems weekly | Launching on many games at once; collecting data members didn't expect |
| Spreading | Shareable outputs, launches timed to patches, a few creators, a donations page | Paid ads; paywalling the core loop; forgetting privileged-intent and verification steps |
| Costs rising | Server-owner subscriptions or Premium Apps extras; supporter tiers | Ads or paid features that break the publisher's rules |
| Business (if wanted) | A licence from the publisher, more than one game or platform, an owned email list | Assuming Discord or one publisher will keep the rules unchanged |

## Common mistakes

- Using startup failure rates or VC logic for a project that only needs to be fun.
- Paywalling what people came for, or adding ads before the community trusts you.
- Charging for features built on API data the publisher says must stay free.
- Letting a trading tool drift into real-money trades.
- Storing message content "just in case", or having no removal path.
- Ignoring moderators and posting in servers uninvited.
- Measuring installs instead of active communities.

## Sources

research/community-and-hobby-products.md (Discord Premium Apps payout, Premium Apps required support, privileged intent changes, Developer Policy, Community Guidelines; Blizzard Developer API Terms, Video Policy, AddOn Policy, RMT support article; Riot Legal Jibber Jabber and developer policies; Steam Web API terms and Subscriber Agreement; Patreon, GitHub Sponsors, Ko-fi fees; Folta, Delmar & Wennberg 2010; Tidelift maintainer surveys; MEE6 anecdote). All read via search snippets; primary pages were blocked.
