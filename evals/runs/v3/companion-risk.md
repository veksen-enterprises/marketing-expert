# GameX Companion: is it worth building seriously?

## Answer

**Short answer.** Yes, it's worth building seriously as a high-quality free community tool, and possibly as one that pays for itself. It isn't worth building as a business that replaces a salary, and it's nowhere near venture scale. The biggest risk isn't the OCR or the rules model. It's whether enough items flow through the bot for a watch to actually fire, and that depends on trade-server moderators you don't control. The second biggest is trust: what the bot stores and shows about people who never signed up. Money is possible at "cover hosting" scale if you keep the core loop free. Anything more conflicts with Discord's and Blizzard's rules and with your own non-goals.

**Assumptions (labelled, since I couldn't ask you):**
- A1. Your goal is a hobby or side income, not a full-time business. Your repo has no pricing, donations or ads: I searched the whole repo for monetiz/premium/patreon/donat/subscription/stripe/advertis and found only unrelated hits. If you want this to replace a salary, see the market numbers below. The answer then becomes "not with this product alone."
- A2. Market counts are my guesses, not data. I assumed 50,000 active GameX traders reachable through Discord trade servers and about 200 trade servers. Replace these with real member counts.
- A3. Usage is small today. The only production figure I found is "a production table of 141 items" (docs/adr/0006, line 15, dated 2026-08-04).

**What's built (from the repo, not the website, which I couldn't reach):**
- Shipped:
  - The bot reads and OCRs posts (apps/bot/README.md).
  - Search (apps/app/src/routes/search.tsx).
  - Watches with DM delivery (apps/app/src/routes/watches.tsx; apps/bot/src/bot.ts:73-75).
  - Public IAS and imbue calculators.
- Partial: the character dashboard. The planner, stash and create routes are admin-only (`_admin-only.planner.tsx` and others).
- Not built:
  - Item lifecycle, meaning sold or expired items (VISION.md:128-131, still an open question). Without it, watches can fire on items that are already gone.
  - Catching up on posts made while the bot was offline (apps/bot/README.md:129-131). That works against your "Speed" value.

**Base rates that fit this project.** Don't use startup failure rates here. People who start a business while keeping a day job, and only later go full time, survive much better than people who quit first (Folta et al. 2010, research). Among open-source maintainers, about a quarter get any donation income (Tidelift 2024, vendor data). Expect donations to cover costs, not pay a salary. The playbook also says "No reliable dataset was found on how many Discord bots, fan sites or game tools earn money or how long they last." Note that this playbook's sources were all "read via search snippets."

**Could it make money? (market_size tool, my assumed inputs)**
- **Base case:** 50k traders at $3/month with 2% paying, plus 200 servers at $5/month with 10% paying. That gives 510 accounts that would pay at all, and a SAM (the revenue you could realistically serve) of $18,600 a year.
- **Covering about $100/month of hosting** (an assumed cost) needs about 33 paying supporters, or 6.5% of that SAM. That is achievable.
- **The $100M revenue test fails badly.** Even my deliberately generous case (200k traders, 5% paying, $5/month) gives a SAM of $367,200/year. The tool's warning: "needs 1.7M customers but only 6.1k accounts are serviceable."
- The tool computed no realistic "obtainable" share because I gave it no budget or sales capacity, so I'm not quoting one.
- **Rules (playbook, first-party, read via snippets):**
  - Blizzard bans real-money trading.
  - Blizzard's API terms forbid paid "premium" versions and charging players. You don't use their API, so whether those terms apply to you is my inference; check it.
  - Discord requires anything you sell on Discord to be offered through Premium Apps at no higher price.
- **The safe order:**
  1. A donations or supporter page that shows your running costs.
  2. Later, per-server extras for trade-server owners.
  3. Never put watches or search behind a paywall.

**The big risks, ranked:**
1. **Liquidity (high).** Watches only matter if most good items pass through your bot. The bot reads only the channels configured in `DISCORD_LISTEN_CHANNEL_ID` (apps/bot/README.md:44). Moderators can remove it with one click. So your real first customers are the moderators of the big GameX trade servers.
2. **Trust and data handling (high). Three problems:**
   - VISION.md:64-65 says the owner "is anonymous until contacted." But public item pages, which are listed in the sitemap (apps/app/src/lib/sitemap.ts:19), show "Owned by {displayName}" with the person's Discord avatar (apps/app/src/routes/items.$id.tsx:291-300). The API calls this endpoint "public, with its owner" (apps/api/src/routes/items.ts:254).
   - CONTEXT.md:236-239 says every capture is "kept as OCR training data whether or not it produced an item." Discord's Developer Policy bans training AI models on message content without permission (playbook, first-party). Whether tuning an OCR pipeline counts needs checking.
   - I searched apps/ for opt-out, privacy and removal and found no opt-out or privacy page. Discord requires deleting user data on request.
3. **Platform access (medium).** Reading other users' screenshots needs the Message Content intent. The bot README (lines 14-15) says it needs approval "at 100+" servers. The playbook says the 2025-26 rule is 10,000 users, with yearly reapplication. These sources disagree, so check Discord's current page.
4. **One game, one platform (medium).** Your entire supply and audience is GameX on Discord. That's fine for a hobby, and fatal for a business.
5. **Founder scope (medium).** research/plannersite-planner.md is written "for the team building this repo's own planner." That pulls toward your own non-goal: "Not a standalone planner/mod tool" (VISION.md:120). The correctness work is already large for one person.
6. **Competition (unverified, from my own knowledge).** d2jsp forums, TradeSite, fansite.example's trade section, Discord's own channel search, and simply scrolling. Your rules model can be copied in time. The thing a competitor can't easily copy is being the bot already installed in the main trade servers.

**Pre-mortem (it's April 2028 and it's shut down):**
- Moderators never installed it, so watches rarely fired.
- A privacy complaint, or a Discord intent rejection, cut off access.
- You burned out on correctness bugs and planner work.
- GameX activity faded between seasons.

**Three moves, in order:**
1. **Prove liquidity in one big server.**
   - Action: ask the moderators of the largest GameX trade server you can reach to approve the bot. Show them exactly what it stores.
   - Why it works: one moderator brings the whole server's supply.
   - Test and time box: six weeks.
   - Metric: new items listed per day, and the share of new watches that fire within 7 days.
   - Stop condition: no moderator of the top three servers agrees, or fewer than 30% of watches fire within 7 days. These thresholds are my judgement; set your own before you start.
2. **Fix the trust gap before any growth push.**
   - Action: either hide owner names on public pages until contact, as your vision says, or change the vision. Then publish a one-page "what we store, how to remove it" note with a working removal path.
   - Metric: moderators say yes, and removal requests get handled.
   - Stop condition: if moderators still refuse after seeing it, the overlay model doesn't work in these servers.
3. **Test willingness to pay only after move 1 passes.**
   - Action: add a supporter page that shows monthly costs. Supporters get thanks or a badge, not features.
   - Test and time box: 60 days.
   - Metric: supporters as a share of weekly active watchers.
   - Stop condition: fewer than 10 supporters means keep it a hobby and cap your costs.

**Timing.** Season 14 was live by 2026-09-21, according to research/plannersite-planner.md:3. My inference is that the next ladder reset is your launch moment. Have moves 1 and 2 done before it, not after.

**What not to do yet:**
- No ads.
- No paywall on search or watches.
- No real-money price fields.
- No more planner work.
- No second game.
- No fundraising.

**What would prove me wrong:** big trade servers install the bot fast, and watchers retain and donate well above the thresholds above. Then a per-server paid tier is worth a real test.

**Open questions:**
1. What is your goal: hobby, side income, or a salary? And what's your own probability that this is still running in two years?
2. How many servers and channels does the bot read today? How many items per day, active watches, and watchers?
3. What are the monthly running costs, and how many hours a week do you put in?
4. Have moderators approved the bot where it runs? Have members been told what it stores?
5. Do you actually train or tune anything on stored captures?

If you confirm these facts, I can save them as a business profile for next time.

## Tool log

**MCP calls (in order), run from /home/user/marketing-expert with MARKETING_EXPERT_DATA_DIR=evals/data/v3-companion-risk:**
1. `instructions`: server rules; context first, run tools for numbers, playbooks, at most 3 moves, under ~1,200 words.
2. `tools`: listed 22 tools.
3. `prompts`: listed 11 prompts, including opportunity_assessment.
4. `call list_business_profiles {}`: returned `[]`; no stored profile.
5. `call get_playbook {}`: list of 47 playbooks, including community-and-hobby-products.
6. `prompt opportunity_assessment {"idea":"GameX Companion: Discord bot + website that OCRs ... Not a marketplace.","evidence":"Solo founder side project; production table had 141 items on 2026-08-04; no monetization in repo; Discord OAuth; reads one or more configured trade channels."}`: the template told me to set the goal first, use base rates, run market_size, rate risks layer by layer, do a pre-mortem and set kill criteria.
7. `call get_playbook {"slug":"community-and-hobby-products"}`: goal table, overlay/liquidity, moderators as gatekeepers, monetization order, Discord intents (10,000 users), Blizzard terms and RMT ban; sources "All read via search snippets."
8. `call get_playbook {"slug":"startup-risk-and-opportunity"}`: base rates, Andreessen layers, Graham tests, pre-mortem, kill criteria.
9. `call get_playbook {"slug":"platform-and-feature-risk"}`: absorption vs access risk; ways to reduce exposure; risk questions.
10. `call search_playbooks {"query":"bottom-up market size venture vs bootstrap test small market","limit":4}`: market-sizing decision rules; venture-scale test.
11. `call search_playbooks {"query":"GameX game trading tool real-money trading Blizzard terms","limit":4}`: the community playbook's platform/IP rules and common mistakes.
12. `call search_playbooks {"query":"network effects proprietary data defensibility switching costs","limit":3}`: competitive-analysis on local network effects and data scale effects.
13. `call market_size` (base case: 50k traders at $36/yr, serviceable 0.5, paying 0.02; 200 servers at $60/yr, serviceable 0.5, paying 0.1; horizon 3, churn 0.5, target $100M): TAM $1.812M, SAM $18,600, 510 serviceable; needs 2.74M customers; warnings about no capacity constraint and the target exceeding the serviceable market.
14. `call market_size` (optimistic: 200k traders at $60/yr, 0.6, 0.05; 500 servers at $120/yr, 0.6, 0.2; target $100M): SAM $367,200, 6,060 serviceable; needs 1.65M customers; same warnings.
15. `call market_size` (base case segments, target $1,200): about 33 customers needed, 6.45% of SAM; warning that no obtainable market was computed.

**GameX Companion repo files opened:**
- VISION.md
- README.md
- CONTEXT.md
- research/plannersite-planner.md (outline plus the §9 save/account section)
- apps/bot/README.md
- apps/app/README.md
- docs/adr/0001-0007 (first 20 lines of each)
- knowledge/warlock-expansion.md (lines 1-16)
- apps/app/src/routes/robots[.]txt.ts
- apps/app/src/routes/items.$id.tsx (lines 280-325, plus grep hits)
- apps/bot/src/bot.ts (grep around line 75)

**Searches run in the repo:**
- `git ls-files`; `ls apps packages apps/*`; `ls apps/bot/src apps/app/src/routes`; `git log` (1 commit, 2026-10-04).
- `grep -rniE "monetiz|revenue|pricing|premium|patreon|donat|subscription|ko-fi|stripe|advertis|paywall"` over *.md/*.ts/*.tsx: only unrelated hits (font pricing, CSS stripe).
- `grep -rniE "TradeSite|d2jsp|fansite.example|blizzard|terms of service|privacy|gdpr|production"` over *.md: found the 141-item production figure; no TradeSite/d2jsp mentions.
- `grep "reply(|.send(|createDM"` in apps/bot/src: DM send at bot.ts:75.
- `grep "discord|scope|oauth"` in apps/api/src/routes/auth.ts: Discord OAuth.
- `grep "reply|channel.send"` in apps/bot/src; `grep "webhook|public"` in discord-public-log.ts: a public new-item webhook feed exists.
- `grep "owner|username|displayName"` in items.$id.tsx and discord-public-log.ts: public owner display.
- `grep -rn "opt.out|delete my|removal|privacy"` in apps/app/src, apps/api/src, apps/bot/src: no opt-out or privacy page found.
- `grep "ladder|season"` and `grep "planner"` in VISION.md, CONTEXT.md, warlock-expansion.md and .claude/vision-digest.md.
- `grep "items"` in apps/app/src/lib/sitemap.ts (item pages are in the sitemap, line 19); `grep "owner"` in apps/api/src/routes/items.ts (line 254: public endpoint with owner).
- No changes were made to the gamex-companion repo.
