## Answer

**Short answer:** Don't market the website yet. Make one trade community "full": enough items flowing in that a watch actually fires. GameX Companion is only useful when a watch finds something, and every item comes from Discord channels whose moderators chose to let the bot in. So your first growth channel is moderators, not players. Your second is the bot's own output (the new-item feed and the DMs), which already sits where traders are. Time both for the next ladder season.

I couldn't reach companion.example from here (audit_page got a 403), so I checked nothing on the live site. Everything below comes from your repo.

**What I'm assuming (please correct me)**
- A1. Goal: a hobby or side project. You want people using it, not revenue. If you want a business, the advice changes: Blizzard's API terms forbid paid versions, and the playbook says a business needs a publisher licence.
- A2. The bot reads one or a few channels in one server. Your `.env.example` names a single "#selling" channel.
- A3. Usage is small: tens to low hundreds of weekly users. I have no numbers. I did not estimate any.
- A4. Season 14 is running now. The next ladder reset falls in the next few months. I haven't checked the date.

**What the repo says is shipped**
- Shipped: public search. Watches with DM alerts for Discord-signed-in users (`apps/bot/src/notification-drain.ts`, `bot.ts:75`). OCR ingestion. IAS and imbue calculators. Item pages with link previews (`items.$id.tsx:26-60`).
- Shipped in code, but I can't tell if it's switched on in production: the public new-item feed, posted to a Discord channel through a webhook (`apps/api/src/services/announce-item.ts`). It only runs when `DISCORD_PUBLIC_WEBHOOK_URL` is set.
- Partial: the planner, stash and manual item creation. They are admin-only (`__root.tsx:105-110`).
- Not built: item lifecycle (sold or expired). VISION.md lists it as open question 1, and I found no sold/expired field in `apps/api/src/db/schema.ts`. Also not built: catching up on messages posted while the bot was offline (`apps/bot/README.md`, "Two limits").

**Fix these before you approach moderators**
1. **Owner privacy contradicts your vision.** VISION.md:64-65 says "The owner is anonymous until contacted." But `items.$id.tsx:288-303` shows "Owned by <Discord name>" with the Discord avatar on every public item page. The API describes the item route as "public, with its owner" (`apps/api/src/routes/items.ts:254`). Moderators will ask what the bot stores and shows. Decide which version is true and say it in one sentence. Members can unclaim an item (`DELETE /me/items/:itemId`, `user-items.ts:280`), but I found no opt-out for someone who never signed in.
2. **The bot's README contradicts itself and the code.** `apps/bot/README.md:26` says "What it read and what happened is in its reply." Line 88 says "No reaction, no reply, no DM" (that line is about the history walk). In `apps/bot/src` I found no reply or channel post. The only write is the watch DM. So traders in the channel never see the bot.
3. **Discord permission threshold.** Your README (lines 18-19) says the message-content intent needs Discord's approval at 100 servers. The playbook says the 2025–26 rule is 10,000 users, with yearly re-approval [first-party; playbook sources read via search snippets]. Check this before you add servers.

**Diagnosis (labelled guess):** the limit is supply in the channels you read. It is not awareness of the website. A watch that never fires teaches people to ignore you. The marketplaces playbook says nearly every marketplace starts short of supply and should "spend on the constrained side only" [practitioner, small sample of successes].
**What would prove me wrong:** if most active watches already fire within a week but few visitors create a watch, the problem is on the demand side. Then lead with move 2.

**What people use instead** (my own knowledge, unverified): scrolling or Discord-searching the trade channel itself; TradeSite; fansite.example's trade listings; d2jsp; PlannerSite's planner, for the calculator side. Your edge over all of them: you add no new step for traders, and you check items against the game's rules.

### Three moves, in order

**1. Ask the moderators of one large GameX trade server to invite the bot to their trade channels.**
- Why it works: the playbook says supply is permissioned and "a moderator who installs it brings the whole server" [practitioner]. More channels mean more items, and more items mean watches that fire.
- Cheapest test: a short message to 3–5 mod teams. Say what the bot reads, what it shows publicly (after fix 1), how to opt out, and that it never posts in their channels. Include one item link as the demo.
- Metric: items ingested per week, and the share of active watches that fired at least once in 7 days. Get both from your database.
- Time box: 3 weeks.
- Stop or change if: no mod team agrees after 5 asks (find out why), or items per week rise but the watch fire rate doesn't (you added the wrong kind of items).

**2. In that partner server, turn on the public new-item feed, with links to "watch similar items".**
- Why it works: the playbook calls bot output that carries your name "usually the main growth loop" [practitioner]. A feed channel people choose to follow fits "augment, don't disrupt" better than replies on trader posts.
- Cheapest test: set the webhook for one server. Tag the feed's links, for example `https://companion.example/search?utm_source=discord&utm_medium=social&utm_campaign=partner-feed&utm_content=new-item-embed` (from build_utm_link, no warnings). Then read the results in Umami.
- Metric: watches created by visitors who came from feed links. Also how many of those watchers are still active 30 days later.
- Time box: 2 weeks after move 1 lands.
- Stop or change if: almost no watches come from feed visits, or the moderators call the feed noise.

**3. Before the next ladder reset, give that server's moderators a ready-to-post note: "set a watch for your season-start targets."**
- Why it works: the playbook says to "time launches to the game's calendar" and "ship updates before the event, not after" [practitioner]. At a reset, everyone is hunting the same bases and runes at once.
- Cheapest test: one pinned post written with the mods, plus offering one GameX streamer free credit or a mention, with no payment.
- Metric: new watchers in the reset week compared with the two weeks before.
- Stop or change if: no lift beyond the general season traffic. Then season timing isn't your lever.

### What not to do yet
- No paid ads, and no broad Reddit or website launch, until watches fire reliably in one server. Bringing people to empty results burns them.
- No monetization beyond an optional donation link. Blizzard's API terms forbid paid versions and charging players [first-party, via snippets]. Keep listings free of real-money prices.
- Don't market the planner. It's admin-only. A standalone planner is a non-goal in VISION.md, and PlannerSite already does it.
- Don't make the bot reply on trader posts without moderator approval. It goes against your own principle.
- Don't put effort into SEO for item pages. Trade listings expire, and lifecycle isn't built yet.
- Build item lifecycle soon. Without it, sold items stay in search results, and stale results weaken the "correctness" value you lead with.

### Open questions
1. Is this a hobby, side income, or a business you want to grow? (This changes A1 and the "what not to do" list.)
2. Which servers and channels does the bot read today, and do their moderators know it's there?
3. Current numbers: items ingested per week, weekly searchers, signed-in users, active watches, and the share that fired in the last 7 days.
4. Is `DISCORD_PUBLIC_WEBHOOK_URL` set in production? Where does the feed post?
5. Should owner names be public or anonymous until contacted? The code and VISION.md disagree.
6. When does the next ladder season start, and does the item data cover the Warlock content traders will look for?

If you confirm these, I can save them to a business profile (save_business_profile) so we don't redo this next time.

## Tool log

**MCP calls (in order)**
1. `instructions` (CLI): read server instructions: profile check, read the business's own material, diagnose first, name alternatives, use tools for numbers, ground in playbooks, at most 3 moves, under ~1,200 words.
2. `tools`: listed 20 tools (calculators, audits, profiles, playbooks).
3. `prompts`: listed 11 prompts (marketing_diagnosis, marketing_strategy, etc.).
4. `list_business_profiles {}`: `[]`, no stored profile.
5. `get_playbook {}`: listed 48 playbooks, including community-and-hobby-products.
6. `search_playbooks {"query":"community tool gaming Discord free hobby project growth","limit":6}`: all hits from community-and-hobby-products (growth inside communities, mistakes, goal table, measuring).
7. `get_playbook {"slug":"community-and-hobby-products"}`: full playbook. Covers goals and base rates, overlay/aggregator mechanics (moderators gatekeep supply, liquidity before reach, member consent), monetization ladder, Discord/Blizzard rules and RMT, growth timed to game events, measuring. Sources "All read via search snippets".
8. `search_playbooks {"query":"marketplace cold start atomic network liquidity which side first","limit":4}`: marketplaces: atomic network, supply first (~14 of 17), spend only on the constrained side.
9. `search_playbooks {"query":"growth loop shareable output referral loop","limit":3}`: community "built-in sharing" loop, marketplace growth loops, self-serve viral loops.
10. `prompt marketing_diagnosis {"context":"GameX Companion: free GameX item database fed by a Discord bot ... No numbers available."}`: returned a 5-step diagnosis template (model, unknowns, constraint, ≤2 moves, what not to do). Followed it.
11. `build_utm_link {"url":"https://companion.example/search","source":"discord","medium":"social","campaign":"partner-feed","content":"new-item-embed"}`: tagged URL, no warnings.
12. `search_playbooks {"query":"launch timing season event before after","limit":2}`: community "time launches to the game's calendar"; launches-and-gtm "before launch" (UTM-tag links per channel).
13. `audit_page {"url":"https://companion.example/search"}`: failed: "expected HTML, got content-type text/plain (status 403)". Live site not checked.

No numeric tools were run: the founder gave no numbers, and I didn't invent any.

**Repo files opened (/home/user/gamex-companion)**
- VISION.md (full), README.md, CONTEXT.md, CLAUDE.md, AGENTS.md
- research/plannersite-planner.md (header and TOC; output truncated)
- docs/adr/*.md (first 40 lines each, via head; output persisted, not used in the answer)
- knowledge/warlock-expansion.md (first 30 lines)
- apps/bot/README.md (full), apps/bot/package.json, apps/bot/src/bot.ts (1-140), apps/bot/src/ingest-handler.ts (180-260)
- apps/app/src/routes/index.tsx, apps/app/src/routes/__root.tsx (1-120), apps/app/src/routes/items.$id.tsx (20-60, 280-320), apps/app/src/routes/robots[.]txt.ts
- apps/app/src/lib/page-title.ts, apps/app/src/lib/sitemap.ts
- apps/api/src/services/announce-item.ts (1-80), apps/api/src/services/discord-public-log.ts (1-60)
- apps/api/src/routes/user-items.ts (270-300)
- .env.example

**Searches run**
- `ls` of repo root, docs/, research/, knowledge/, apps/; `find` file listings of the repo, apps/, apps/bot, apps/api
- grep `IAS_ONLY` across repo (3 hits in apps/app)
- grep `reply|send(` and `reply|\.send|react(` in apps/bot/src (only a DM at bot.ts:75, plus notification-drain sendDm; no channel reply)
- grep `reply|react` in apps/bot/README.md (lines 21, 23, 26, 88)
- grep `owner|author|discord` in items.$id.tsx; `ssr` in routes; `owner` in apps/api/src/routes/items.ts
- grep `DISCORD_PUBLIC_WEBHOOK_URL` in apps/api/src/config.ts (optional, line 34); `watch|DM` in notification-drain.ts
- grep `season|ladder` in VISION.md, docs/agents/domain.md, research/plannersite-planner.md (Season 14 reference)
- grep `watch` in watch-search-button.tsx (sign-in dialog when signed out)
- Grep `opt.?out|privacy|delete my|removal|unlist|gdpr` (case-insensitive) across repo excluding node_modules/dist/.git: no member opt-out found; only the unclaim route
- grep `sold|expire|lifecycle|status` in apps/api/src/db/schema.ts (no item sold/expired field)
- git log (1 commit, 2026-10-04)
