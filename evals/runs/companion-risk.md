## Answer

**Short version:** Yes, it is worth building seriously as a craft project or a small side business. It is not worth building as a company you hope to live on, or one you would raise money for. The hard part you have already built, the item-rules model and the OCR, is real and hard to copy. But the market is a small hobby community, you do not control your distribution (Discord and the owners of the trade servers do), and the obvious ways to charge clash with your own "augment, don't disrupt" principle. Under my assumptions the realistic money is hosting costs up to tens of thousands of dollars a year, not a salary.

I could not ask you anything first, so here is what I would have asked. The rest of this answer rests on the labelled assumptions after the list.

**Questions I would ask you**
1. What is the goal: a hobby you are proud of, side income, or a full-time job?
2. How many hours a week can you give it, and for how long?
3. Is the bot live anywhere yet? Which trade servers, how many members, how many items a day, how many active watches? (Your git history is squashed to one commit, so I can't tell from the repo.)
4. Have the owners of the big GameX trade Discords agreed to host the bot?
5. What do hosting and OCR cost you each month?
6. Before reading on, write down your own odds that this is still running and covering its costs in 2 years. We'll compare them with the base rates below.

**Assumptions (replace these with real numbers)**
- A1: There are about 150,000 active GameX traders on Discord trade servers. This is my guess and is not sourced. Get the real figure from the member counts of the top trade servers, then subtract inactive members.
- A2: The bot gets onto servers covering about 30% of them, so about 45,000 people can be reached.
- A3: A paid tier would cost about $3/month ($36/year). Ad revenue would be about $2 per user per year (my guess).
- A4: You are a solo developer working on this outside a day job.
- A5: Everything I say about Discord, Blizzard and competitors comes from my own general knowledge. I did no web research, and it is not checked against current terms.

### 1. Could it ever make money? Some, but not much

I ran a bottom-up market sizing with the tool, using A1 to A3:
- **Subscriptions:** 45,000 reachable traders × $36/year = **about $1.6M/year**, and that is the ceiling if every reachable trader paid. Reaching **$100k/year** would take **about 2,800 subscribers, or 6.2% of reachable traders**.
- **Ads** add very little: about $90k/year even if every reachable trader were a site visitor. Your own vision says "never require a trader to leave Discord", which means few site visits, which means few ad views. The tool's combined figure counts the same people twice, so I treat ads as small extra income, not a second market.
- **$100M/year test:** it would need about 2.8 million subscribers, against 45,000 reachable. That is 62 times the reachable market. **This is not a business for investors**, and no plausible change to the assumptions fixes that.

A paying share of 1–3% is my own rough guess for a gaming hobby tool, not playbook data. At that rate it is **450–1,350 payers, roughly $16k–$49k a year**. That is enough to pay for the servers and be a nice side income, and only if the free product is already loved.

The ways to charge, ranked by how well they fit your values:
1. **A supporter tier** (Patreon/Ko-fi style): more watches, longer watch history, cosmetic perks, an early look at calculators. This is the most realistic option. **Do not sell faster notifications.** Your own VISION.md says the first person to message the owner wins the item. Selling speed is selling a trading advantage, and in a small community that is the quickest way to get the bot kicked off servers.
2. **Charge the trade-server owners**, not the traders: premium server features such as a listing feed, price-check commands and moderation help. There are fewer buyers, but they control your distribution, and paying them gives them a reason to keep the bot.
3. **Ads on public item pages and the IAS/imbue calculators**, earned through search traffic. This only pays if the web side gets real traffic.
4. **License the rules model and OCR** to other GameX sites (trade sites, build planners). There are few buyers, but they could pay you more each than individual traders would.
5. **Being bought by a fansite network** is possible but rare and small. I wouldn't plan around it.

Do not touch real-money trading. Blizzard's terms forbid it (my knowledge), and it would change your risk from "fan tool" to "target".

### 2. The big risks, ranked

1. **You don't control your distribution.** This is the biggest risk. The whole design depends on (a) trade-server owners letting your bot read their channels and (b) Discord allowing it. Your own bot README notes that Message Content Intent needs Discord's approval once the bot is on 100+ servers. Discord's developer policy also sets rules on storing and reusing message content (my knowledge; check the current text). The server-owner risk is the sharper one: big trade servers often run their own bots or money-making schemes, and one "no" from the largest server can cap your supply. The marketplace playbook's rule applies here: supply comes first, and a marketplace with nothing listed is dead on arrival. *Cheapest evidence:* ask the owners of the top 3–5 trade servers this month.
2. **Unproven demand for "watches".** The vision is convincing, but the repo shows no evidence yet that traders want watches enough to come back. Traders already have other options: scrolling the channel, Discord's own search, d2jsp, TradeSite and fansite.example (named from my own knowledge). Paul Graham's "sitcom test" from the startup-risk playbook fits: "I could see using that" counts for nothing until people come back unprompted.
3. **Stale listings break trust.** Item lifecycle is the first open question in your VISION.md, and it is the one that decides whether watches are useful. A watch that fires on an item that was already sold is worse than no watch. You chose correctness as the value you won't give up, so an unanswered lifecycle question is a risk to the whole product, not a later feature.
4. **The game moves and the audience is finite.** ADR 0002 already says the model can never be complete. The Warlock class and new sets show content keeps arriving. That is good news, because GameX is still being updated in 2026. But it is also a running cost: every patch is work you must do before your "correct" claim is true again. GameX trading activity is also seasonal and slowly shrinking over the long run (my judgement). Blizzard adding in-game trade search would replace you entirely; I think that is unlikely, but it is possible.
5. **Your values conflict with each other.** "Augment, don't disrupt" plus "not a marketplace" plus "don't force people onto the website" leaves you with the least to charge for. This is a fine choice for a community tool, but make it on purpose.
6. **Too much scope for one person.** You are building three components plus a planner. Your research notes take apart PlannerSite's planner in detail. PlannerSite is a free, ad-funded, staffed company. Competing on planners is fighting on the axis where their money turns straight into results (competing-with-incumbents playbook). Keep the calculators item-driven, as VISION.md already says, and don't build a general planner.
7. **Privacy and data duty.** You store Discord users' posts, IDs and item histories, and you put watchers in touch with owners. You need a deletion path (GDPR, for EU users) and a clear opt-out for owners.

**How hard is this to copy?** The rules model, the OCR tuned for the game's Exocet font, and the reparse pipeline in your ADRs are years of careful work. That protects you against other hobby developers. It does not protect you against whoever controls access. The platform-risk playbook's question applies directly: "Which clause could end our access, and how much notice would we get?" For you, the answer is a Discord policy change, or one server owner, with no notice.

### 3. Base rates and the pre-mortem

- **Base rates** (startup-risk playbook, government and research data): about 51% of new US businesses survive 5 years. About 75% of venture-backed companies never return their investors' money. Founders overrate their own odds: 81% put themselves at 7/10 or better, but only 39% gave that rating to "businesses like yours." Compare these with your answer to question 6.
- **Pre-mortem: it's April 2028 and GameX Companion has shut down. The most likely reasons:**
  1. The biggest trade server removed the bot, or never added it, so there wasn't enough supply for watches to fire.
  2. Watches fired on sold or wrong items, trust dropped, and people muted the DMs.
  3. Time went into calculators and the planner instead of the item lifecycle and server relationships.
  4. A paid "priority" feature caused community backlash.
  5. A Discord policy or intent-approval change, or a hosting/OCR bill with no revenue, made running it not worth it.
  6. You burned out: one person was maintaining a model that every patch makes incomplete.

### 4. What to test, with thresholds and kill criteria

(These are standard leap-of-faith hypothesis tests. The RCT evidence in the playbook says their main benefit is killing bad ideas sooner, not raising revenue.)

1. **Access, by end of Nov 2026 (next 8 weeks):** the bot runs on trade servers with at least 20,000 members combined, ingests at least 300 items a day, and fewer than 2% of the items it lists are later corrected. *Kill or pivot if* no major server agrees within 60 days. In that case, become a web tool where traders paste screenshots, plus calculators, and drop the Discord ingestion idea.
2. **Value, by end of Jan 2027:** at least 200 people create a watch, and at least 40% of them still have an active watch and have clicked at least one notification in their 4th week. *Kill watches as the core* if 4th-week retention is below 20%. Then the calculators and the item database are the product.
3. **Money, run only after test 2 passes:** offer a supporter tier with no speed perks. Success is at least 2% of weekly-active watchers paying within 30 days, or at least 50 payers. Below 1% means this is a hobby, and you should fund it like one (donations, keep costs low).

Also write down now how many hours and dollars you are willing to lose, and stop when you hit either. The playbook calls this an "affordable loss".

### Verdict

GameX Companion has real craft and something genuinely hard to copy in its rules model. Under every reasonable assumption, though, its ceiling is a well-loved community tool that covers its costs and maybe pays a modest side income. It is not a company. The biggest risk is not the technology. It is that you depend on Discord and a handful of server owners for every item you ingest. **The single next test to run:** before writing more code, message the owners of the 3–5 largest GameX trade servers and ask them to run the bot for 30 days. Their answer and the 30 days of numbers will tell you more than any feature will.

The market numbers come from the server's market_size calculator using my unsourced assumptions A1–A3, so treat them as orders of magnitude. The risk and evidence points come from the server's playbooks: startup risk, market sizing, platform risk, competing with incumbents, competitive analysis, marketplaces and pricing. That evidence mixes research studies, practitioner rules of thumb and vendor data, as labelled above. Everything about Discord, Blizzard, d2jsp, TradeSite, fansite.example and PlannerSite's business is from my own knowledge, not checked online.

If you send me your real server member counts, daily item volume and watch numbers, I'll rerun the sizing. Do you want me to save these facts as a business profile so we can track them over time?

## Tool log

MCP commands (all run with `MARKETING_EXPERT_DATA_DIR=/home/user/marketing-expert/evals/data/companion-risk`, from /home/user/marketing-expert):

1. `node scripts/mcp.mjs instructions`: operating rules (context first, diagnose before prescribing, tools for numbers, ground in playbooks with evidence strength, ranked moves, plain language, no "moat"). I followed them throughout.
2. `node scripts/mcp.mjs tools`: listed 19 tools. I chose list_business_profiles, get_playbook, search_playbooks and market_size.
3. `node scripts/mcp.mjs prompts`: listed 10 workflow prompts. I picked opportunity_assessment as the best fit for "worth building / risks / money".
4. `node scripts/mcp.mjs call list_business_profiles '{}'`: returned `[]`, so there is no stored profile. I offered to save one at the end, but saved nothing because the user hasn't confirmed any facts.
5. `node scripts/mcp.mjs prompt opportunity_assessment '{"idea":"GameX Companion","evidence":"repo docs"}'`: a 7-step workflow (base rates, urgent group, market_size, why now, layered risks incl. platform/incumbent, pre-mortem, leap-of-faith tests + verdict). I used it as the structure of the answer.
6. `node scripts/mcp.mjs call get_playbook '{}'`: list of 45 playbooks. Used to pick the relevant ones.
7. `node scripts/mcp.mjs call get_playbook '{"slug":"startup-risk-and-opportunity"}'`: base rates (BLS 51% 5-yr, ~75% VC no return), Graham tests, overconfidence (81% vs 39%), pre-mortem, kill criteria, RCT evidence. Used in sections 3 and 4.
8. `node scripts/mcp.mjs call get_playbook '{"slug":"market-sizing-and-timing"}'`: bottom-up method, $100M ARR test, venture vs bootstrap rule, "why now". Used for the money section and verdict.
9. `node scripts/mcp.mjs call get_playbook '{"slug":"platform-and-feature-risk"}'`: absorption vs access risk, the access-cutting cases, risk questions ("which clause could end our access"). Used for risk #1 and the "how hard is this to copy" note.
10. `node scripts/mcp.mjs call get_playbook '{"slug":"competing-with-incumbents"}'`: "don't fight where their money converts into results" and the beachhead (start narrow) advice. Used for risk #6 (PlannerSite planner).
11. `node scripts/mcp.mjs call search_playbooks '{"query":"monetization gaming community free users donations ads niche hobby","limit":5}'`: weak matches (influencers, community, RevenueCat app data: gaming yearly LTV $11.22 median). Used only as background; no hobby-tool paying-rate data, so I labelled my 1–3% as my own guess.
12. `node scripts/mcp.mjs call search_playbooks '{"query":"freemium free tier paid conversion willingness to pay hobby consumers","limit":4}'`: pricing sections (freemium ~3 paid/1,000 visitors, B2B SaaS vendor data). Used as context only, since it doesn't transfer well to gaming.
13. `node scripts/mcp.mjs call search_playbooks '{"query":"network effects proprietary data defensibility","limit":3}'`: competitive-analysis on defensibility (network effects are local, data scale effects). Informed the "how hard is this to copy" paragraph.
14. `node scripts/mcp.mjs call search_playbooks '{"query":"cold start liquidity supply side","limit":3}'`: marketplaces: supply first, atomic network. Used for risk #1 (supply comes first).
15. `node scripts/mcp.mjs call market_size` (two segments, subscription $36 + ads $2, 150k accounts, 30% serviceable, 3 yrs, 60% churn, $100k target): TAM $5.7M, SAM $1.71M, 5,263 customers at the blended value. It warned that no capacity was given. I noted that the blended figure double-counts the same people.
16. `node scripts/mcp.mjs call market_size` (subscription only, $100M target): SAM $1.62M, 45k serviceable, 2.78M customers needed, 61.7× SAM. Warning: "target needs 2.8M customers but only 45.0k serviceable." Used for the $100M test.
17. `node scripts/mcp.mjs call market_size` (subscription only, $100k target): 2,778 customers needed, 6.2% of SAM. Used for the "$100k/year" figure.

Repo files read (/home/user/gamex-companion, not modified):
- VISION.md: north star, augment-don't-disrupt, three components, non-goals, open questions (lifecycle, identity), the speed/"first to reach the owner" point.
- README.md, CLAUDE.md (top part): stack and structure.
- CONTEXT.md: domain language (classification, hold, reparse proposal, watch, owner).
- docs/adr/0002 (model is not ground truth; Warlock/new content) and docs/adr/0007 (owner assertion outranks reparse), first ~40 lines each.
- apps/bot/README.md (first 60 lines): Message Content Intent needs approval at 100+ servers; history backfill.
- research/plannersite-planner.md (first ~150 lines): Season 14, game version 3.3, ad-funded PlannerSite planner.
- Directory listings of apps/, apps/app/src/routes (admin-only planner/create/stash, ias/imbue calculators, search, watches), docs/adr/, research/. Ran `git log`: 1 squashed commit, so no usage history is visible.
