# GameX Companion: how to get people to use it

## Answer

**Short answer.** Don't chase website visitors yet. GameX Companion pays off when a watch fires on a real item and a trader contacts the owner. You already have supply: the production database holds 3,932 distinct screenshots (packages/cli/corpus/README.md line 11). What I could not find anywhere in the repo is any count of watchers, alerts sent or contacts made, and your decision records say "no real users exist yet" (docs/adr/0004 line 52, 0006 line 81). So the real unknown is whether the watch loop works for real traders. Do three things in order: get the trade-server moderators' explicit agreement, prove the loop by hand with about 20 traders, then announce when a ladder season starts.

**What I checked in the repo** (companion.example was blocked from here, so nothing on the live site was checked):
- Shipped: stat-aware search, watches with Discord DM alerts (apps/bot/src/bot.ts 68–76), a public "New item posted" feed with watcher counts (apps/api/src/services/discord-public-log.ts 81–113, active only when its webhook is set), IAS and imbue calculators.
- Partial: the character dashboard. Planner, Create and Stash are admin-only (apps/app/src/routes/_admin-only.tsx 4–8; __root.tsx 104–110).
- Planned/open: item lifecycle (sold or expired, VISION.md 128–131), and catching up on messages posted while the bot was offline (apps/bot/README.md 129–131).
- A build flag, `VITE_CALC_ONLY`, turns the site into just the Assassin IAS calculator (__root.tsx 100, 124–133; index.tsx 6). I can't tell which build is live.

**Fix before you ask any moderator (they will spot these):**
1. VISION.md 64–65 says the owner "is anonymous until contacted". The public item page shows "Owned by <Discord name>" with the avatar (apps/app/src/routes/items.$id.tsx 249–300), and the API describes that endpoint as public, with owner (apps/api/src/routes/items.ts 254). Pick one and make code and docs agree.
2. Your OCR retraining copies production screenshots into Tesseract training (packages/ocr/training/retrain-all.sh 17–18; link-corpus-images.mjs 4–8). Discord's Developer Policy bans training AI models on message content without Discord's permission and requires deleting data on request [first-party, read via search snippets]. Whether a font-reading model counts is for Discord to say, not me. I found no privacy page in apps/app/src/routes, and no API route that lets a poster remove an item or screenshot (the only deletes in apps/api/src/routes are sessions, stash links and watches).
3. The bot README (lines 25–26) and ADR 0005 (lines 52–53) say the bot replies in the channel. I searched apps/bot/src for `.reply(` and `channel.send` and found neither; the only Discord write I found is the watch DM.
4. The bot README (line 15) says Message Content Intent needs approval at 100+ servers. The playbook says the current rule is 10,000 users, with yearly reapproval [first-party, read via search snippets]. Check before you grow.

**Assumptions** (you weren't available; each changes the advice if wrong):
- A1. Hobby project, not a business. If you want income, Blizzard's terms and real-money-trading bans shape everything first.
- A2. The bot reads one or a few trade channels (.env.example says "#selling ingest").
- A3. No usage numbers yet, though Umami analytics is wired in (__root.tsx 29–30).
- A4. A new ladder season starts within a few months. Season 14 was live on 2026-09-21 (research/plannersite-planner.md line 3); I don't know the next date.

**What traders use today** (my own knowledge, unverified): scrolling or Discord search in trade servers; d2jsp (the biggest GameX trading forum); fansite.example and TradeSite listings; asking in chat; doing nothing. None alerts you the moment a "40ias cruel claw" is posted. That alert is your edge.

## Three moves, in order

**1. Get written agreement from the moderators of the server(s) the bot reads.**
- Why: moderators decide whether the bot stays and can remove it in one click; treat them as your first customers [practitioner]. Without them, nothing else lasts.
- Cheapest test: one short page (what the bot reads, stores and trains on, how to opt out), sent to the moderators with a request to pin it.
- Metric: a yes and a pinned post.
- Time box: 2 weeks.
- Stop: if they object to training or owner names, change those first, not the pitch.

**2. Recruit 20 traders by hand and set up a watch with each.**
- Why: an aggregator is only useful when one place has enough items; an atomic network (the smallest group that works on its own) comes before reach [practitioner]. A watch is your core loop (the main thing people come back for). Check that people stay before you grow [practitioner].
- Cheapest test: DM traders who post often, build their watch with them, log each alert and each contact with an owner.
- Metric: share of the 20 with a live watch after 30 days; alerts per watch per week.
- Time box: 30 days.
- Stop: most watches get zero matches in two weeks. Then supply per watch is too thin: add a second server before more watchers.

**3. Announce in the week a new ladder season starts.**
- Why: players look for tools around patches and season resets [practitioner]. The public feed and item links carry your name into channels (your built-in sharing loop).
- Cheapest test: one post each in the partner server, r/gamex (follow its self-promotion rules, say you made it) and one GameX streamer, each with its own tagged link.
- Metric: watches created in the 14 days after, and how many are still live at day 30.
- Stop: new watches don't survive 30 days. That is a product problem, not reach.

## What not to do yet
- No ads, SEO pushes or Reddit campaigns before move 2 works.
- No spreading to many servers at once.
- No payments, paid tiers or price fields. Blizzard's API terms restrict paid versions and Blizzard bans real-money trading [first-party, read via search snippets].
- Don't open the planner to the public until watches retain; your vision makes it a consumer of the database.

**What would prove me wrong:** if many traders already keep watches and alerts lead to trades, the loop works and the gap is awareness. Then move 3 goes first.

The playbook I relied on (community and hobby products) says its sources were all read via search snippets; its growth advice is practitioner experience, not controlled research.

## Open questions
1. Is this a hobby, side income, or something bigger?
2. Which servers and channels does the bot read, and did their moderators agree?
3. How many items list per week, and what share are held?
4. How many people have created a watch, and how many alerts went out?
5. Is the live site the full app or the IAS-only build?
6. Has Discord said anything about training on the screenshots?
7. Must traders visit the site to create a watch, or could they do it in Discord? Your "not a forced destination" rule points to Discord.

I can save the facts you confirm as a business profile.

## Tool log

All MCP calls run from /home/user/marketing-expert with MARKETING_EXPERT_DATA_DIR=/home/user/marketing-expert/evals/data/v4-companion-strategy, in order:

1. `instructions` (no args): server instructions (context first, diagnose, name alternatives, tools for numbers, playbooks with evidence labels, max three moves, check_answer before sending).
2. `tools` (no args): listed 22 tools (calculators, audits, scan_source, check_answer, playbooks, profiles).
3. `prompts` (no args): listed 11 prompts (marketing_strategy, marketing_diagnosis, etc.).
4. `call list_business_profiles {}`: `[]`, no stored profile for GameX Companion.
5. `call scan_source {"dir":"/home/user/gamex-companion/apps/app/src","maxPerKind":30}`: 118 files; 31 data, 0 price, 19 availability, 6 setup, 30 proof matches (mostly code keywords); env flags VITE_API_BASE_URL, VITE_CALC_ONLY (routes/__root.tsx:100, routes/index.tsx:6, components/ias-calculator.tsx:527), VITE_SITE_URL, VITE_UMAMI_URL/WEBSITE_ID.
6. `call scan_source {"dir":"/home/user/gamex-companion/docs","maxPerKind":15}`: 11 files; 18 data claims (ADR storage of screenshots/captures), 3 proof (ADR 0006: 25 duplicate rows, 18%).
7. `call scan_source {"dir":"/home/user/gamex-companion/apps/bot","maxPerKind":15}`: 23 files; 1 data claim (README:32 stored capture ids), 1 proof (README:89 history walk writes nothing).
8. `call get_playbook {}`: list of 49 playbooks; picked community-and-hobby-products as the business-type playbook.
9. `prompt marketing_strategy {"business":"GameX Companion: free GameX item database fed by a Discord bot that OCRs trade-channel screenshots, with stat-aware search and watch-a-search DM alerts; pre-launch hobby/side project","goal":"get people to use it","budget":"unknown, assume ~0 (founder time only)"}`: returned the 8-step strategy template (profile, business-type playbook, alternatives, constraint, economics, channels, 90-day plan, evidence, what not to do).
10. `call get_playbook {"slug":"community-and-hobby-products"}`: goal-first table, overlay/aggregator rules (moderators as gatekeepers, liquidity before reach, consent, Discord data policy incl. no AI training on message content), Blizzard/RMT rules, season-timed growth, per-community measurement; sources "All read via search snippets".
11. `call search_playbooks {"query":"cold start atomic network liquidity which side first","limit":4}`: marketplaces sections on atomic networks, supply first, multi-homing [practitioner].
12. `call search_playbooks {"query":"activation retention first test before acquisition","limit":3}`: metrics-and-measurement frameworks, self-serve activation, consumer-apps "retention is the first test" [practitioner/vendor].
13. `call check_answer {"text":<first draft>}`: 1,200 words; unexplained terms "atomic network", "core loop".
14. `call check_answer {"text":<draft v2>}`: 1,199 words; "atomic network" still unexplained.
15. `call check_answer {"text":<draft v3>}`: 1,201 words, 1 over the limit; no unexplained terms.
16. (The scratchpad draft file was overwritten by another process before the next edit; draft rebuilt under a new filename after verifying additional repo facts.)
17. `call check_answer {"text":<final draft>}`: 1,165 words, no banned words, no unexplained terms, no problems.

No numeric tools were run: the founder gave no traffic, user, cost or revenue figures, and the answer presents no calculated numbers. No audit_page/crawl_site was run because companion.example is blocked from this sandbox; the answer says nothing on the live site was checked. save_business_profile was not called (no founder-confirmed facts); offered in the answer.

### Repo files opened (/home/user/gamex-companion, read-only)
- VISION.md, README.md, CONTEXT.md (full)
- docs/adr/0001 through 0007 (full)
- .claude/vision-digest.md, apps/app/README.md, apps/bot/README.md (full)
- research/plannersite-planner.md (lines 1–120 and heading list)
- knowledge/warlock-expansion.md (lines 1–40)
- .env.example
- apps/app/src/routes/_admin-only.tsx, routes/index.tsx, routes/robots[.]txt.ts, routes/__root.tsx (lines 80–200), routes/items.$id.tsx (lines 284–312)
- apps/app/src/lib/common-searches.ts (lines 1–60)
- apps/api/src/services/discord-public-log.ts (lines 1–40, 75–130), apps/api/src/services/announce-item.ts (lines 1–40)
- apps/bot/src/ingest-handler.ts (lines 130–215), apps/bot/src/bot.ts (lines 55–90)
- packages/cli/corpus/README.md (lines 1–30), packages/ocr/training/retrain-all.sh (lines 1–30), packages/ocr/training/link-corpus-images.mjs (lines 1–25)
- apps/app/.turbo/turbo-build.log (head), built bundle apps/app/dist/client/assets/index-CnT0Lu6w.js (grep only)

### Searches run
- File listings of the whole repo (excluding node_modules, .git), apps/bot, apps/app/src, apps/app/src/routes, packages/
- grep "IAS_ONLY" across repo (ts/tsx/yml/json/Dockerfile/md/.env); grep "IAS_ONLY|ias" in ci.yml, docker-compose.yml, apps/app/Dockerfile, Makefile: no deploy setting found
- grep of built bundle for the ias-calculator redirect and "IAS Calculator" header: inconclusive about which build is live
- grep apps/bot/src for ".reply(|send(|createDM|dm" and "reply|channel.send": only user.send (watch DM) in bot.ts:75; "reply" only in comments
- grep "watchers|Watching|watch" in discord-public-log.ts; grep "owner|author|discordId|username" in routes/items.$id.tsx; grep "owner" in apps/api/src/routes/items.ts
- grep "noindex" in apps/app/src (no matches outside tests)
- grep -i "season|ladder" in knowledge/*.md and research/plannersite-planner.md
- grep "privacy|remove my|opt.out|opt-out" in apps/app/src, apps/api/src, apps/bot/src: only robots route; grep "delete(" in apps/api/src/routes: sessions, user-items, watches only
- grep "3,932" in packages/cli/corpus/README.md; grep "corpus" in packages/ocr/training/README.md
