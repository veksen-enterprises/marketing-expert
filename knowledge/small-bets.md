---
title: Small bets
summary: Cheap, low-risk marketing moves any business can try one at a time, ordered by what they need (users, traffic, data, expertise, an audience, money); how to run them, judge them, stop them, and when to stop testing and focus on one channel. Use match_small_bets to pick the ones that fit a saved profile.
tags: small bets, cheap marketing, low budget marketing, first users, things that don't scale, founder emails, onboarding calls, free audit, answer questions, stack overflow, reddit, launch, product hunt, show hn, betalist, listings, directories, registry, marketplace listing, open source, building in public, public changelog, release notes, free tool, calculator, engineering as marketing, comparison page, alternative to, error message pages, teardown, original data, data pages, weekly digest, waitlist, integration, plugin, browser extension, moderators, guest podcast, meetup, newsletter sponsorship, co-marketing, community, affiliate, lifetime deal, perks, press, traction, bullseye, kill criteria
---

A small bet costs little money, takes days rather than months, and can be judged on its own. Run a few, keep what works, drop the rest. Which bets fit depends on what the business already has, so this playbook is ordered by **stage**: 0 no users yet; 1 the first users (about 1–20); 2 steady use (around 100 active users or a couple of thousand monthly visits, a rule of thumb); 3 something newsworthy. Pitching the press with zero users rarely works; answering questions where people already ask them does.

**Pick with the tool.** Save the profile's traction, assets, audiences, product surfaces, revenue and avoid list with save_business_profile, then call match_small_bets. It sorts every bet below into fits now, fits later (and what is missing) and doesn't fit (and why). Report only the bets that fit now. Mention a later one in a line only if its blocker is close, and discuss the ones that don't fit only when the user asks or proposes one. The "avoid" list comes from the business's own non-goals: a site that keeps its users anonymous should never be told to rank them publicly, and a product built to live inside another platform should never be told to pull users off it.

## How to run small bets

- **Small bets work when a cheap test tells you something.** The case for many small tests is option logic: a small payment buys information and the right to invest more later. It fails where early results don't predict later ones. Direct outreach, launch posts and paid tests give fast signals; search, brand and audience-building give poor early signals (Google says search changes can take "several months", and few new pages rank within a year). [research; first-party; vendor]
- **Rank by what a bet can do, its evidence and its effort.** match_small_bets scores each fitting bet as ceiling × evidence ÷ √effort and sorts by it. The ceiling is what the bet can do if it works: capped (a small, predictable gain, such as a directory listing), steady (slow and compounding, such as comparison pages) or lopsided (usually nothing, now and then a lot, such as a post, a short video or a launch). Weights: capped 1, steady 2, lopsided 3; evidence strong 1, some 0.85, anecdote 0.7; effort is the hours until the bet can be judged. The weights and each bet's ceiling are judgment calls, not measurements. [rule-of-thumb]
- **Run lopsided bets as a batch and judge them by the best try.** One post tells you nothing; twenty posts tell you whether any format catches on. Each lopsided bet carries a number of tries to run before judging.
- **Outcomes are lopsided.** At Bing the top 2% of ideas produced about 75% of the gains. Run more, smaller tests, and treat a result that is "a bit positive" as probably luck, not a reason to keep spending. [research]
- **Write the window and the stop rule before you start**, sized to the channel: a launch post can be judged in a week, a comparison page needs about three months in Search Console. Where a platform sets a minimum, use it (Google Ads: the last 30 days with at least 30 conversions). No study gives a universal "give it N weeks". [first-party; rule-of-thumb]
- **Cap how many run at once.** Spreading effort over too many open projects slows every one of them; practitioners suggest one to three channels at a time. Small, finished bets (a page, a post, a listing) can run in parallel more easily than ones that need weekly upkeep. [research; practitioner]
- **Expect to quit too late, not too early.** Owners keep weak ventures going for reasons unrelated to performance. A written kill date protects against it; the opposite mistake, judging a slow channel too early, is fixed by sizing the window to the channel. [research]
- **Measure every bet on its own.** A tagged link per bet (utm_source, utm_campaign), a "how did you hear about us?" field at sign-up, and retained users rather than visits. See **metrics-and-measurement**.
- **Then narrow down.** Practitioners agree that one channel usually ends up carrying most growth, and suggest committing to it once it clearly beats the rest and its cost per customer holds as you push it. None of this is backed by a systematic data set; treat it as a working assumption. Re-run a few small tests every quarter, because winning channels fade. See **channel-strategy**. [practitioner]
- **Discount every success story.** Survivor samples make both focus and scatter look better than they are. [research]
- **Money moves some bets earlier** (sponsorships, paid newsletters, paid tutorials, paid creators), but it buys reach the product hasn't earned. Check that a small first batch is still active four weeks later before paying for more. [practitioner]

## Stage 0: no users yet

These need only time, expertise or data.

- **List it where people already look.** Free listings in app stores, developer registries (MCP Registry, GitHub Marketplace, VS Code, Chrome Web Store, package registries), integration directories and curated lists; 1–4 hours each. First-party rules are clear; evidence that a listing brings users is thin, and review-site figures come from the sites' own surveys. Gated directories need users first (Slack's needs 10 active workspaces; paid GitHub apps need 100 installs). Stop after 90 days with a complete listing and almost no tagged visits; keep free listings that cost nothing to maintain. For apps see **app-store-discovery**. [first-party; vendor]
- **Answer where the problem is already discussed.** Stack Overflow, Reddit, Discord servers, forums, nearby projects' GitHub issues. Solve the problem in the answer itself, disclose that you made the product every time you mention it, and link only when the link is the answer. Each community sets its own rules on self-promotion (Reddit has no sitewide "10% rule"; Stack Overflow requires disclosure; Hacker News allows your own things "part of the time"). Judge after 8–12 weeks. Answers can also feed AI assistants, unproven. [first-party; anecdote]
- **Comparison and 'alternative to X' pages.** Honest pages against known rivals, and help docs written as answers to searches. Comparisons help new brands most (one 1997 meta-analysis). Judge after 2–3 months in Search Console: impressions but no clicks means rewrite the title; clicks but no sign-ups means rewrite the page. [research; practitioner]
- **One page per painful error message**, titled with the exact error text. Developers search error text often (one 2017 study). Developer tools and products with error or fault codes. [research]
- **Teardowns of well-known things.** Apply your method to something famous and publish what you found. The famous target supplies the audience. [practitioner]
- **A free tool or calculator** that solves one narrow, searchable problem and links to the product; 1–10 days to build. Stop if it gets under a few dozen uses a week after three months. [anecdote]
- **A one-command try with no sign-up** (npx, pipx, docker run) that gives a result on the user's own input and prints a link. Developer tools only; the non-developer version is the free tool above. [anecdote]
- **Open-source a useful piece**: a CLI, a GitHub Action, a library or a dataset that is useful without the paid product, with a README that works as a landing page. GitHub stars correlate weakly with real use, so measure README clicks and sign-ups that mention the repo. See **developer-tools**. [research]
- **Fix things in projects your users use**: pull requests and docs fixes, for credibility rather than promotion. [anecdote]
- **Fix what your tool finds in well-known open-source projects.** Run the product on a popular project under realistic load (seed data, simulated traffic), confirm one real problem by hand, and send one pull request with the fix, a reproduction and before/after numbers. Don't send "add our tool" PRs: a bot that opened 52 of them got 2 merged and 40 ignored, and GitHub flagged its account [research; one tool, small n]. A concrete fix fares far better: one-click suggested changes were taken up 59.6% of the time in 22 projects [research; peer suggestions, not vendors]. Say you built the tool, follow each project's contributing rules, and never send machine-written PRs nobody checked. The write-up of the finding is a teardown in its own right. See **developer-tools**. [research]
- **A tool for the community's moderators.** Where your audience gathers in moderated spaces (Discord servers, subreddits), a bot or tool that solves a known moderator pain earns the permission everything else depends on. [anecdote]
- **Post regularly as the founder**, on the one platform where buyers already talk, at least twice a week; judge after 8–12 weeks. Regular posting has some evidence; founder versus company account is anecdote. Change platform or format before dropping social altogether. See **organic-social-and-community**. [some research; anecdote]
- **Short videos of the product doing its job**, made by the founder, 15–60 seconds, one result each. Set the number of posts before judging (for example 20). Documented app take-offs came from videos like these, but every case is a survivor. [practitioner]
- **Personal messages to clearly fitting people.** Research 20–50 people who visibly have the problem (public issues, posts, job ads) and write to each one personally; judge after 30–50 messages. Never use emails taken from GitHub profiles: GitHub's rules forbid using its data for unsolicited email. Anti-spam law applies; see **outbound-and-abm** and **privacy-and-marketing-law**. [anecdote; first-party]
- **Publish your own data**: a report, index or benchmark from data nobody else has published. **Data can stand in for users**: a site that collects and organises public data can publish before it has users. Two reports that each earn fewer than about five new linking sites and no press mean change the topic. [vendor; anecdote]
- **Public pages built from your data**: one indexable page per item, error or record, each with something unique on it. Thin pages that repeat a template get "crawled, not indexed"; cut to pages with real content rather than adding more. See **seo-content-and-architecture**. [first-party]
- **A weekly digest generated from your data**, posted where the audience is, with the community's permission. Stop when clicks fall four weeks in a row or moderators object. [anecdote]
- **One launch-site post**: Product Hunt, Show HN, a fitting subreddit, or BetaList (which takes pre-launch products). Needs a product people can try now, not users. A spike with no retained users a month later means the product needs work, not the channel. [anecdote]
- **Send something useful to niche newsletters'** "tools" or "links" sections; a good post beats a product page. [anecdote]
- **A waitlist where referrals move people up**, only before launch, for a product people want before it exists. One famous case (a razor brand), no study. [practitioner]
- **An integration or plugin inside another product**: a bot, plugin or CI integration doing a clear job where users already work; 1–4 weeks plus upkeep when the host changes. One observational study links joining a large platform's partner programme to higher sales. [research]

## Stage 1: the first users

These need someone to talk to.

- **Email every new sign-up, payer and canceller yourself.** A short plain-text email from the founder's own address with one question: "What made you sign up today?", "What almost stopped you paying?", "What made you cancel?" (one company found "what made you" got about twice the replies of "why did you"). Early hands-on help halved first-week churn in one field experiment. Keep these emails to a question with no offer, so they stay outside marketing rules: in Canada a message is commercial if promotion is one of its purposes; in the UK any promotional element makes it marketing; in the EU a 2025 court ruling lets the soft opt-in cover free accounts that are part of a freemium offer. Add "reply 'stop' and I won't email again". Needs a way to reach each user (accounts or emails). Judge after 20–30 emails. [research; practitioner; first-party]
- **Onboarding calls and free audits.** Set the product up with the user on a call, or offer a free review of the prospect's own problem. Record every step you did by hand and fix it in the product. Judge after 10 calls. [research; anecdote]
- **Ask happy users for an introduction, a review or a quote**, right after a success moment. For reviews, ask every customer, not only happy ones: Google forbids asking selectively, and the FTC bans reviews bought or suppressed. Rewards for ratings break both app stores' rules. See **referral-programs**. [research; first-party]
- **A public changelog and 'what's new' emails.** The page is cheap and reassures people who arrive; update emails need an opted-in list. Test reactivation against a held-out group of lapsed users; cut the email if it reactivates no more than the held-out group. [anecdote]
- **Podcasts, meetups and guest posts.** Small podcasts and local meetups first; conferences need a track record. Judge after 3–5 appearances. [anecdote]
- **Answer journalists' source requests** on expert-matching sites. A quote needs expertise, not users, but coverage rarely brings sign-ups for an unknown product. [anecdote]
- **Show up on the audience's calendar**: a season reset, a framework release, a conference week, a holiday. Compare the event window with a normal one. [anecdote]
- **A browser extension on the sites your audience uses**, adding your data or feature where they already are. Installs come from a community that tells others about it; upkeep follows every layout change of the host site. [anecdote]
- **Sponsor something small the audience cares about**: a community event, a tournament, an open-source maintainer, for tens to hundreds of dollars. [anecdote]
- **Thank the first users personally.** Do it because it's right: thank-you calls to about 600,000 donors had no effect on later giving. [research]
- **A hiring post that explains the product**, only when there is a real role. [anecdote]
- **Embeddable widgets that link back**: a widget, tooltip or badge other sites embed. Google says to nofollow links in widgets you distribute. [first-party; anecdote]
- **Build in public**: progress, decisions and numbers shared openly. Draws other founders first, buyers only if they are founders or makers; competitors can copy what you disclose. Anecdote only, all survivors. [anecdote]

## Stage 2: steady use

These need use to spread through, or something to sell.

- **Outputs people want to share**: a share link or image card for results users are proud of or surprised by. Stop if fewer than about 1 in 50 results get shared after eight weeks. [anecdote]
- **Co-marketing with an adjacent tool or creator**: a joint post, integration launch or webinar. Partners rarely bother before you have some traction of your own. [anecdote]
- **Your own community or newsletter**, once people already talk to you. An empty room hurts more than none; Slack's free plan keeps only 90 days of history. Research is mixed (one positive observational study, one null-to-negative randomised one). [research]
- **Sponsor a niche newsletter**: from about $10 for a classified to $1,500 per issue in published rate cards. Judge after 2–3 slots; one is noise. [vendor]
- **Pay a user to write a tutorial**: about $300–$400 per technical tutorial is a published benchmark. [first-party]
- **An affiliate or referral link with a commission.** Needs something to sell with margin. [anecdote]
- **Startup and student perk listings.** Credits or a free tier through startup perk catalogues and student developer bundles; the large ones accept few partners a year, so traction helps. [first-party; anecdote]
- **A lifetime deal on a deal site.** Brings cash and users who expect support forever, often the wrong customers; the sites say consumer-only products don't fit. Run once at most. [vendor]

## Stage 3: something newsworthy

- **Pitch the press** only with numbers or a finding others would retell. One documented solo launch sent twenty pitches with zero users and got no coverage. Teardowns and your own data are the usual way to reach this stage from below. See **pr-and-influencers**. [practitioner]

## Folklore

- "70% of growth comes from one channel" and the Bullseye method are useful habits with no published validation.
- "Small bets lower risk" holds only when bets are cheap, informative and not all tied to one shared asset (one audience, one platform).
- "Do things that don't scale" is founder stories; the closest causal evidence is the onboarding field experiment above.
- "Reddit's 10% rule", "Product Hunt features 10% of launches": no first-party source.
- App portfolios of near-identical apps: Apple rejects copycat and template apps and may remove repeat offenders from its developer program.

## Sources

research/small-bets.md (option logic and experimentation: Kerr, Nanda & Rhodes-Kropf 2014; Azevedo et al. 2020; McGrath; task-juggling and escalation research; Google, Meta and Apple first-party pages; Thiel, Balfour, Weinberg & Mares, Rachitsky, Vassallo, Levels). research/small-bets-presence.md (listings and directory rules, open source and GitHub stars, social posting, building in public, changelogs, free tools and widgets, integrations, original data, comparison pages, error pages, data pages, digests, perks, browser extensions). research/small-bets-direct.md (founder emails and CAN-SPAM, CASL, PECR and the 2025 Inteligo Media ruling; onboarding field experiment; community self-promotion rules; outreach; launch sites; guest spots; newsletter rate cards; review and referral asks; co-marketing; communities; calendar events; paid tutorials; affiliates; lifetime deals; thank-you research). Read 2026-10-05 unless a note marks an item snippet-only.
