## Answer

**Short version:** don't market the website yet. GameX Companion gets used when one trade server has enough items in it that a watch actually fires, and when traders see that happen in Discord. So do three things in order: (1) get one or two trade servers fully indexed, with their moderators' agreement; (2) make watches reliable enough that people keep them; (3) make your big public push in the weeks before the next ladder season. Your vision says "augment, don't disrupt", and this plan follows it. Everything starts in Discord, and the site is where people go after a DM.

**Questions I'd normally ask first** (you can't answer in this run, so I've made labelled assumptions):
1. What's your goal: hobby, covering hosting costs, or a business? *Assumption: a hobby or side project with no revenue target. Nothing in the repo mentions pricing.* If you want income, read the monetisation caution below first.
2. Which servers or channels does the bot read today, and how many items, watches and watchers do you have? *Assumption: one or a few channels, and a small database. ADR 0006 puts the production rare/crafted table at 141 items in August 2026.*
3. Do the moderators of those servers know about the bot and agree to it? *Assumption: partly.*
4. Is the production site the full app or the `VITE_CALC_ONLY` build that only shows the IAS calculator? *Assumption: the full app.*

### What the repo says is shipped (I checked the code, not just the docs)
- **Shipped:** the bot reads the configured channels and forums and backfills their history. It runs OCR, classifies items into the rules model and lists them. It DMs watchers when a match appears. The site has search, item pages, watches, Discord login, the IAS and imbue calculators, and a sitemap and robots.txt.
- **Partial or admin-only:** the planner/dashboard, the stash and creating items on the site are all behind admin-only routes. Multi-item screenshots (ADR 0005) and item identity/dedup (ADR 0006: 18% of rare/crafted rows were duplicates) are decided but still being worked on.
- **Open:** item lifecycle (VISION open question 1). A sold item keeps firing watch DMs. That is the biggest threat to keeping watchers.
- **Contradiction:** the bot README says "what it read and what happened is in its reply", but I found no code that replies in the channel. As far as I can see the bot is silent in the channel and only sends DMs. If so, most traders never see that GameX Companion exists. Check which one is true. It matters a lot for the plan below.

### What traders use instead (from my own knowledge, not verified)
- Scrolling the trade channel and using Discord's built-in search. This is the real default.
- Posting "ISO" (in search of) messages and waiting.
- TradeSite and fansite.example, which have listings and wishlists.
- d2jsp's forum trading economy.
- For calculators, the PlannerSite GameX planner (your own research file covers it).

None of these watches a precise, rules-valid set of stats in channels where people already post. That is your edge: a fast, correct alert. Lead with it. "Item database" is not a reason for anyone to come.

### The constraint
You run on supply. If a watch never fires, a watcher churns, so liquidity (enough matching items in one place) comes before reach. The community-and-hobby playbook and the marketplace "atomic network" idea say the same thing: get one small community working on its own before spreading [practitioner evidence]. Moderators are your gatekeepers. They can remove the bot with one click.

### Three moves, in order

**1. Make one or two trade servers fully indexed, with moderators on board (weeks 1–4).**
- *Mechanism:* a moderator who agrees brings a whole server's supply and lets you announce the bot.
- *What to do:* pick the server you already read, or the busiest GameX trade server you belong to. Show the mods a demo of a watch firing. Agree on an announcement that says what the bot stores, and give members a working opt-out and removal path. Discord's Developer Policy requires deletion on request, and the playbook marks that as first-party evidence.
- *Also check:* ADR 0005 keeps captures "as OCR training data". Discord's policy bans training AI models on message content without permission [first-party, per the playbook]. Make sure your OCR use of captures is on the right side of that rule, and say plainly in the announcement what you keep.
- *Metric:* items listed per week from that server, and the share of screenshots that end up listed rather than held or failed.
- *Stop condition:* the mods say no (try another server), or less than about half of screenshots get listed. In that case fix classification before inviting anyone, because a wrong or missing match breaks your promise of correctness. The 50% figure is my own judgement, not a benchmark.

**2. Make the watch the hook, and make it trustworthy (weeks 3–8, overlapping).**
- *Mechanism:* the watch DM is your core loop and your main growth loop. Every DM links to the item and the site, and traders tell each other about a good alert.
- *What to do:*
  - Ship a minimal item lifecycle so sold or stale items stop firing, for example by expiring them after N days unless reposted.
  - Pre-build watches for the searches traders actually make (`lib/common-searches.ts` is a start, e.g. "40ias kb cruel").
  - Let people create a watch without leaving Discord, for example with a slash command, which fits your "not a forced destination" rule.
  - If the mods agree, add a short, opt-in confirmation in the channel ("listed: [link]"). That makes the bot visible without decorating every post.
- *Metric:* the share of new watchers with at least one notification within 14 days, the share still holding a watch after 30 days, and the share of DMs that are clicked.
- *Stop condition:* after 4 weeks, if most watchers get no notification, go back to supply (move 1) instead of adding users.

**3. Time the public launch to the next GameX ladder season (start about 4 weeks before it).**
- *Mechanism:* a new season brings a fresh economy and a rush of trading, and players go looking for tools then [practitioner]. I don't know the next season date. Check Blizzard's announcements. Your PlannerSite notes show Season 14 was live on 2026-09-21.
- *What to do:*
  - Make one Reddit post in the GameX subreddits that allow tools. Follow their self-promotion rules and say you built it.
  - Give 2–3 GameX streamers or YouTubers a short demo of a watch DM landing seconds after a post.
  - Pitch the bot to 3–5 more trade-server mods.
- *Metric:* new servers that agree, and watchers per server in season week 1–2 compared with before.
- *Stop condition:* new servers' watchers don't get notifications within 14 days. That means you have spread too thin, so stop adding servers.

### What not to do yet
- **Paid ads, or launching on many servers at once.** The playbook lists both under "usually fails" at your stage.
- **A/B tests.** I ran `ab_test_sample_size` with *assumed* numbers: a 10% baseline, a +20% lift and 100 visitors a day. It needs 7,682 visitors and about 77 days, and the tool warns that over 4 weeks you could only detect a lift of about 34%. Ship on judgement and watch the cohort numbers instead.
- **SEO on item pages at scale.** Thin or empty pages can count as low-value content. Keep sparse pages out of the index until there is real supply.
- **Monetising.** If you ever want money, take donations or charge server owners (e.g. Discord Premium Apps) and keep search and watches free. Check Blizzard's terms first: the playbook notes Blizzard restricts paid use of its game data, and its examples are from other titles, so this is not verified for GameX. Never add real-money prices or payment links between players (RMT). Your "not a marketplace" non-goal already helps here, so write a "no cash trades" rule into the announcement.
- **Discord limits.** Your bot README says the Message Content Intent needs approval at 100 servers. The playbook says the 2025–26 rule is 10,000 users, and that verification is commonly needed at 100 servers. Check the current Discord docs before a growth push.

**Evidence:** the plan rests mostly on practitioner rules of thumb (moderators first, atomic networks, timing launches to seasons, built-in sharing). The Discord policy points come from Discord's own documentation, as cited in the playbook. There's no controlled research on growing Discord bots. All facts about competitors and seasons are from my own knowledge and not verified.

If you confirm your goal and the current numbers, I can save them as a GameX Companion business profile so later advice starts from real figures.

## Tool log

MCP commands (all run with `MARKETING_EXPERT_DATA_DIR=.../evals/data/v2-companion-strategy`):
- `node scripts/mcp.mjs instructions`: returned the operating rules (context first, diagnose, name alternatives, tools for numbers, playbooks with evidence levels, at most 3 ranked moves, respect the vision, plain language). I followed them to structure the answer.
- `node scripts/mcp.mjs tools`: listed calculators, audits, profile tools and playbook tools. I used it to pick the tools.
- `node scripts/mcp.mjs prompts`: listed the workflow prompts. I chose `marketing_strategy`.
- `node scripts/mcp.mjs call list_business_profiles '{}'`: returned `[]`, so no stored profile. I relied on the repo and offered to save a profile.
- `node scripts/mcp.mjs prompt marketing_strategy '{"business":"GameX Companion","goal":"get people to use it","budget":"unknown"}'`: returned the strategy steps (playbook, alternatives, constraint, economics, 3 channels, 90 days, evidence, what not to do). I used it as the answer's skeleton. I skipped the economics step (unit_economics/paid_media_math) because the product is free and has no revenue or CAC, and I said so implicitly by ruling out paid channels.
- `node scripts/mcp.mjs call get_playbook '{}'`: listed the playbooks. I picked community-and-hobby-products.
- `node scripts/mcp.mjs call get_playbook '{"slug":"community-and-hobby-products"}'`: returned the goal table, overlay/aggregator rules (moderators, liquidity, consent, no AI training on message content), monetisation order, Blizzard/RMT rules, privileged intents at 10k users, growth timed to seasons, and per-community measurement. This was the main basis of all three moves and the "not yet" list.
- `node scripts/mcp.mjs call search_playbooks '{"query":"atomic network liquidity cold start marketplace","limit":4}'`: returned the marketplaces sections on atomic networks, single-player mode and start-small mistakes. I used them for the liquidity-first constraint.
- `node scripts/mcp.mjs call search_playbooks '{"query":"retention activation aha moment cohort","limit":3}'`: returned self-serve activation by cohort. I used it for the watch metrics (notification within 14 days, 30-day watch retention).
- `node scripts/mcp.mjs call search_playbooks '{"query":"diagnosis constraint order positioning reach conversion retention","limit":3}'`: returned channel-model fit (low ARPU needs low-cost channels). I used it to rule out paid channels.
- `node scripts/mcp.mjs call search_playbooks '{"query":"programmatic SEO pages thin content item database","limit":3}'`: returned the marketplace SEO-on-supply-pages advice (noindex until supply exists). I used it in "not yet".
- `node scripts/mcp.mjs call search_playbooks '{"query":"game season patch launch timing ladder","limit":3}'`: returned the community playbook's growth, measuring and stage sections. I used them for move 3 timing.
- `node scripts/mcp.mjs call search_playbooks '{"query":"viral loop built-in sharing output carries name","limit":3}'`: returned built-in sharing as the main loop and loop measurement. I used it for move 2.
- `node scripts/mcp.mjs call ab_test_sample_size '{"baselineRate":0.1,"mde":0.2,"dailyTrafficTotal":100}'`: returned 3,841 per arm (7,682 total) and 77 days, and warned that 4 weeks only detects about a 34% lift. I quoted it, with the inputs labelled as assumptions, to rule out A/B testing.

Repo files read (/home/user/gamex-companion):
- VISION.md: north star, "augment, don't disrupt", values, non-goals, open questions (lifecycle, identity).
- README.md: stack and app/package layout.
- CONTEXT.md: domain language (watch, notification, capture, hold, owner, scope).
- research/plannersite-planner.md (first ~150 lines): competitor planner; Season 14 / v3.3 observed on 2026-09-21; Warlock class.
- docs/adr/0001–0006 (headers and first ~40 lines each): non-destructive reparse, data is a model, materialised reparse, sourced groups, N captures per screenshot (captures kept as OCR training data), global item identity (141 items, 18% duplicates).
- apps/bot/README.md: ingestion, history backfill, Message Content Intent "approval at 100+ servers", claim that the bot replies.
- apps/bot/src (bot.ts, ingest-handler.ts, file list; grep for reply/send/DM): found DM sending and no channel reply, hence the contradiction noted.
- apps/app/src/routes listing, routes/index.tsx (redirect to /search or the IAS-only build), routes/robots[.]txt.ts, lib/auth.tsx (Discord login), lib file list (common-searches.ts).
- `git log` in the repo: a single commit, so no history to read.
