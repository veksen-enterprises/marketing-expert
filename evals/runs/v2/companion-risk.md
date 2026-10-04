## Answer

**Short version:** worth building seriously as a hobby or a small side project, yes. It is well built, the core loop (screenshot in a trade channel → classified item → watch → DM) already exists in code, and nobody else I know of does stat-aware watches on Discord trade posts. As a business, almost certainly no: the paying market is tiny, Blizzard and Discord rules limit how you can charge, and your supply sits in other people's servers. "Seriously" should mean "prove people use the watches", not "start a company".

I couldn't ask you questions, so I've used labelled assumptions. My main one: **(A1) your goal is a hobby that ideally covers its own costs, maybe side income.** If you want a salary from this, the verdict below gets harsher, not softer.

### Where the product actually is (from your repo)
- **Shipped:** Discord bot ingestion with OCR, multi-tooltip screenshots, channel-history backfill, reparse review (ADRs 0001–0007, `apps/bot`); search; watches with DM notifications (`watches.tsx`, `notification-drain.ts`); IAS and imbue calculators. The bot README says production redeploys on every push, so something is live.
- **Partial:** the character planner, stash and creating items on the website are admin-only routes. VISION.md calls the site "a real entry point", but today it isn't one for users.
- **Planned/open:** item lifecycle (when is an item sold?) and identity. Lifecycle is a product risk, not a detail: watches that fire on sold items train people to ignore your DMs.
- **Unknown:** usage. The repo has no numbers for servers, listings per week, active watchers or DM clicks. That's the most important missing fact.

### What people use instead (from my own knowledge, unverified)
Scrolling and searching the trade channels by hand, and posting "ISO" (in search of) messages; TradeSite and fansite.example trade listings; d2jsp (forum-gold trading); in-game trade games. PlannerSite's planner covers calculators and builds. Your real competitor is "scroll Discord and ask"; it's free and already works well enough for most traders.

### Could it make money?
I ran `market_size` on **unsourced assumptions** (replace them with real member counts from the servers you target):
- **Base case** (50,000 Discord GameX traders, 50% reachable, 3% would pay $36/yr; 150 trade servers, 20% would pay $600/yr): **SAM $36,000/yr, 765 paying accounts.** The tool warns that a $60k/yr target "needs 1.3k customers but only 765 accounts are serviceable." It doesn't replace a salary.
- **Optimistic case** (200,000 traders, 5% paying $48; 500 servers): **SAM $462,000/yr.** The $100M ARR test needs 1.5M customers against 7.1k serviceable. Not venture-scale, even if my numbers are 10× too low.

The money you can realistically get is **donations, plus perhaps a per-server Discord Premium App for trade-server owners** (Discord keeps 15% of your first $1M). Keep watches and search free; paywalling the core loop is the usual way these tools lose their community (playbook; MEE6 is the anecdote, not proof). Blizzard's API terms ban paid "premium" versions and using API data for monetization; you don't use their API, but you use their game data and tooltip art, and the general pattern is that publishers tolerate free fan tools and restrict selling access. Read the current Blizzard terms before charging anything (not legal advice). Ads are allowed in places but turn you from "one of us" into "a business using us".

### The big risks, ranked
1. **Gatekeepers (high).** Server admins decide whether your bot reads their channel and can remove it in one click. If you're reading channels without the admins' clear agreement, fix that first. Also: Discord's message-content intent needs approval past 10,000 users, and approval must be renewed every year.
2. **Data policy (high, check now).** ADR 0005 keeps every capture "as OCR training data". Discord's Developer Policy bans training AI models on message content without Discord's permission. Whether OCR training on screenshots counts is a question to settle (with Discord's policy text, not my reading) before you grow. Also add a removal path: Discord requires deleting user data on request.
3. **Value (high, unproven).** Do traders actually act on watch DMs fast enough to win the item? Your vision is right that a late, correct DM loses. No data either way yet.
4. **Real-money trading (medium).** GameX trading sits next to a large cash market. If listings with prices in money, or links between players, start flowing through you, Blizzard can ban your users. Your "not a marketplace, no pricing" non-goal already protects you; state the RMT ban in your rules.
5. **What stops others copying you (medium).** VISION.md says the rules model is the defensibility. I disagree in part: GameX's rules are a closed, public, datamined set. Another team could rebuild it in months. The harder thing to copy is being installed in the main trade servers with a history of listings and owners, and admins grant that.
6. **Absorption/access (medium-low).** Blizzard adding in-game trade search, Discord changing intents, or TradeSite/PlannerSite adding watches. Separately, your `packages/tools` drives PlannerSite's site headlessly; check their terms, since they're the likeliest bigger player in this space.
7. **Founder time (medium).** One maintainer, a large codebase, and an admin review queue that grows "every time the resolver improves" (ADR 0007). That's burnout risk.

### Pre-mortem: 18 months on, it's shut down. Most likely why
Admins of the big trade server removed or never allowed the bot; watches fired on sold items and people muted the DMs; usage stayed spread thin across servers; a Discord or Blizzard policy issue forced a rework; or you stopped enjoying admin review.

### Three moves, in order
1. **Make one server work (value test).** Get explicit admin agreement on one or two active trade servers and announce the bot there. Do a rough "sold/expired" rule first, even a simple age cut-off. *Metric:* weekly active watchers, and the share of watch DMs clicked within one hour. *Pass:* ≥30 weekly active watchers and ≥25% of DMs clicked within the hour, held for 6 weeks. Run it around the next ladder season start, when trading peaks. *Stop/change:* under 10 active watchers after 6 weeks of real listings means the watch idea isn't pulling; go back to interviews before building more.
2. **Check classification yield on live posts.** Share of item screenshots correctly listed without admin help. *Pass:* ≥60% in 4 weeks. If it's much lower, watches miss items and the premise fails.
3. **Only if (1) passes and you want income: test willingness to pay.** A donations page with costs shown openly, plus asking 5 trade-server owners whether they'd pay for a per-server tier. *Pass:* hosting covered within 60 days, or ≥2 owners say yes at a named price. *Not yet:* ads, paid watches, a company, other games.

**Verdict:** worth building as a serious hobby. Not worth building as a business on current evidence. The product question (do traders act on watch DMs?) is unanswered, and the money question has a low ceiling whatever the answer. The next test is move 1: one server, admins on board, six weeks of real watch data.

### Questions I'd have asked (answers change the advice)
1. What's your goal: hobby, side income, or a salary? Your own odds it's still running in 2 years?
2. Which servers/channels does the bot read today, did their admins agree, and how many members do they have?
3. Current numbers: listings/week, active watchers, DMs sent and clicked, hosting cost, your hours/week.
4. When's the next GameX ladder season?

I can save these facts as a business profile once you confirm them.

## Tool log

MCP commands (all with `MARKETING_EXPERT_DATA_DIR=.../evals/data/v2-companion-risk`):
- `node scripts/mcp.mjs instructions`: operating rules (context first, diagnose, name alternatives, tools for numbers, playbooks, ≤3 moves, respect vision, plain language, no "moat"). Followed throughout.
- `node scripts/mcp.mjs tools`: tool list. Picked list_business_profiles, get_playbook, search_playbooks, market_size.
- `node scripts/mcp.mjs prompts`: prompt list. Chose `opportunity_assessment`.
- `node scripts/mcp.mjs call list_business_profiles '{}'`: `[]`, no stored profile. Relied on the repo and offered to save a profile at the end.
- `node scripts/mcp.mjs prompt opportunity_assessment '{"idea":"GameX Companion","evidence":"repo docs"}'`: workflow (goal, base rates, market_size, why now, risk layers, pre-mortem, leap-of-faith tests, verdict). Used as the answer's structure.
- `node scripts/mcp.mjs call get_playbook '{}'`: playbook list. Found community-and-hobby-products.
- `node scripts/mcp.mjs call get_playbook '{"slug":"community-and-hobby-products"}'`: goal table, thin side-project base rates, gatekeepers, Discord intents (10k users, yearly reapply), Discord data rules (no AI training on message content, delete on request), Premium Apps 85% share, Blizzard terms, RMT warning, MEE6 anecdote. Main source for risks and monetization.
- `node scripts/mcp.mjs call get_playbook '{"slug":"startup-risk-and-opportunity"}'`: base rates (not applied, since it's a hobby), risk-onion layers, pre-mortem, kill criteria. Used for structure.
- `node scripts/mcp.mjs call get_playbook '{"slug":"platform-and-feature-risk"}'`: absorption vs access risk. Used for risk 6.
- `node scripts/mcp.mjs call get_playbook '{"slug":"market-sizing-and-timing"}'`: bottom-up method, $100M ARR test, bootstrapped vs venture rule. Used to frame the market_size results.
- `node scripts/mcp.mjs call search_playbooks '{"query":"incumbent response small competitor copy","limit":4}'`: competing-with-incumbents decision rules and counter-positioning. Informed the "what stops others copying you" point.
- `node scripts/mcp.mjs call search_playbooks '{"query":"game trading tool Discord real-money trading Blizzard","limit":3}'`: repeated the hobby playbook's platform/IP section. Confirmed the Blizzard/Discord rules.
- `node scripts/mcp.mjs call search_playbooks '{"query":"marketplace liquidity atomic network","limit":2}'`: marketplaces stage table. Supported "make one server work first".
- `node scripts/mcp.mjs call market_size` (base case: 50k traders, 50% serviceable, 3% paying at $36; 150 servers at $600, 20% paying; revenueTarget $60k): SAM $36,000, 765 serviceable accounts; warning that $60k needs 1.3k customers > 765. Quoted as base case.
- `node scripts/mcp.mjs call market_size` (optimistic: 200k traders, 5% at $48; 500 servers at $1,200, 30%; revenueTarget $100M): SAM $462,000, 7.1k accounts; needs 1.5M customers. Quoted as the $100M ARR test. Both runs warned no capacity bound was given, so no obtainable market was computed (no paid acquisition is planned).

Repo files read (/home/user/gamex-companion):
- VISION.md, CONTEXT.md, README.md
- docs/adr/0002, 0003, 0005, 0007 (partly); listed all ADR titles
- research/plannersite-planner.md (first ~9k chars, headings, grep for ads/sign-in/automation)
- apps/bot/README.md, apps/bot/src/config.ts; listings of apps/bot/src and apps/app/src/routes; git log (one squashed commit); grep for monetization terms (none in the docs)

No web search or fetch was used. Competitor names and the GameX market context come from my own knowledge and are unverified.
