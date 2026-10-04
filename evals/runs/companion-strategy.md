## Answer

I read your VISION.md, CONTEXT.md, README, the bot README and one ADR, and used the marketing-expert playbooks. I can't ask you questions in this run, so the questions are at the end and I've labelled every assumption I made. I didn't look anything up on the web. Anything I say about GameX trading communities, Discord's rules or Reddit is from my own knowledge and you should check it.

### What GameX Companion is, in marketing terms

A free tool with no revenue yet. It sits on top of trade channels that already exist. It works like a two-sided marketplace even though you don't handle the trade. The **supply** is items posted in Discord trade channels, which the bot OCRs into the database. The **demand** is traders who search and set **watches**. The thing they get is a DM, sent quickly, saying an item matching their watch was just posted, with a link to its owner.

So I used the *marketplaces* playbook, minus everything about commission and leakage because you take no cut. I also used the *consumer-apps* playbook for retention.

Three facts from your repo decide the strategy:

1. **Supply only exists where a server lets your bot in.** The bot can only read channels where a server's admins have added it. Your README notes the Message Content Intent needs Discord's approval once you pass 100 servers. So your real "first customers" are not traders. They are **the moderators of one or two active trade servers**.
2. **The watch DM is the whole product for a trader.** The search page is useful, but the DM is the reason to come back, and VISION says it has to be fast and correct.
3. **The bot already shows up in the channel.** It replies to every post it reads, and items get public pages that are listed in your sitemap. Every post is a small public demo, to exactly the right people.

### The constraint (assumed, because I have no numbers)

**Assumption A1:** you're at or just before launch. The bot runs in your own or a small number of channels, and you have fewer than about 100 real watchers.

At that stage the limit is not "not enough people have heard of it". It's **liquidity in a single place**. A watch that never fires gives the user nothing. A watch fires often enough only when one server posts enough items in the categories people watch. The marketplaces playbook's rule is to make one small network work before you grow: the smallest group of buyers and sellers that is useful on its own ("atomic network", Andrew Chen) [practitioner]. Almost every marketplace in Lenny Rachitsky's interviews started with supply first (14 of 17) [practitioner, small sample of successes]. Your supply is a server's post volume, and you get it through the moderators.

What would prove me wrong: if you're already in a busy server, watches fire several times a week, and people still don't come back, then the problem is retention or trust (move 2), not reach.

### Move 1: Make one trade server work completely (weeks 1–6)

**What to do.** Pick **one** active GameX trade Discord and **one** slice of the market, for example the current ladder, softcore, one platform. **(A2: you'll have to choose; I don't know which servers are the most active today.)** Talk to its moderators yourself. Offer them something that helps them, not just you:
- searchable history for their channel
- links to item pages instead of re-posts
- fewer "price check?" / "anyone have X?" messages, because watches answer those

Ask permission explicitly, and give them a way to remove the bot. Your "augment, don't disrupt" principle is the pitch: the bot changes nothing about how their members trade.

Then do the unscalable part by hand:
- set up watches for 20–50 active traders in that server (the playbook says to seed 20–50 members by hand [practitioner])
- watch every notification yourself
- fix every misread item

**Why this first.** VISION says correctness is the non-negotiable: "one wrong result poisons the premise". A small group is where you can afford to check every DM. ADR-0002 also says your item data is deliberately incomplete. If the bot calls a trader's real item "hacked" in public, that does more damage there than anywhere else.

**What to measure, per server and never as a global total** (the playbook warns that totals hide markets that have died):
- **Read rate**: share of posted screenshots that become a correct item (from your captures and the hold rate)
- **Watch fire rate**: share of active watches that fire at least once a week
- **Post-to-DM time** (median)
- **Contact rate**: share of notifications where the watcher opens the item or contacts the owner (if you can log link clicks)
- **Weekly returning watchers**, as a cohort curve. Does the share still active in week 4 and week 8 level off, or keep falling to zero? [practitioner, consumer-apps playbook]

**Stop or change course if** after about 6 weeks most watches never fire (supply too thin, so pick a busier server or a narrower slice), or the curve keeps falling to zero even though watches fire (the DM isn't valuable enough or isn't trusted; go to customer conversations below before doing any outreach). **(A3: these thresholds are judgement calls. Your own baseline from the first 2–3 weeks should replace them.)**

**Cost:** your time only.

### Move 2: Turn each post and each DM into a reason for others to join (weeks 4–12, after Move 1 shows watches firing)

The growth loop you already have, where each step's output feeds the next, works like this:
1. a trader posts
2. the bot replies with an item link
3. someone who wanted that item sees that GameX Companion found it
4. they set a watch
5. the next post fires it

Make that visible and one click:
- **Bot reply:** "Want a DM when the next one like this is posted? Watch it" → opens a pre-filled watch.
- **DM:** "Matched your watch *40ias cruel* 3s after it was posted", plus the item link and a "share this watch" link.
- **Item page:** a watch button for that item's key stats.

Measure **new watchers per 100 bot replies** and the **share of new watchers who came from a bot reply or a shared watch**. Also add a one-question "how did you find us?" at watch creation [practitioner]. Discord traffic mostly doesn't show up in analytics, so this question is your best source.

Only when the first server works should you copy the same steps to a second server. Keep using one server per market slice, and check the same numbers per server.

### Talk to people before and during Move 1 (cheap, and it changes the plan)

Have 8–10 short conversations with active traders and 2–3 moderators, following *The Mom Test* [practitioner]. Ask "When did you last hunt for a specific item? What did you do? How long did it take?", not "Would you use a watch bot?". If they already have a quick way to do it (another bot, a trade site), you need to know that before you pitch.

### What I would not do yet, and why

- **No paid ads or influencer deals.** There's no revenue to pay for them, and the playbooks say paying for users before your retention curve levels off is "buying churn" [practitioner].
- **No posting to every GameX server and subreddit at once.** That gives you thin supply everywhere and liquidity nowhere, the most common marketplace mistake in the playbook. Reddit (r/gamex, r/GameX — my own knowledge, check each subreddit's rules) comes later. When you do post, use an honest "I built this" post with a demo GIF of a watch firing. Say you're the builder, and keep promotional posts to about 10% of your activity (the guideline some subreddits use) [first-party, Reddit's own guidance].
- **No push on SEO yet.** Your item pages and IAS / imbue calculators can bring search traffic later. Free calculators are the playbook's "engineering as marketing" [practitioner]. But item pages only count as useful content if they have real, current items behind them. Pages for sold or expired items, or thin ones, should be `noindex` (playbook: programmatic pages with no real supply behind them are a common mistake; see Google's spam policies). Your open question about item lifecycle has to be settled first.
- **Don't build your own Discord community as the main channel.** Your principle is to sit on top of existing servers, and the playbook advises joining existing communities before building your own [practitioner].

### Risks to deal with now

- **Platform dependence.** All your supply comes through Discord's API. The playbook's examples show access being cut on short notice by Twitter in 2023 and Reddit in 2023, usually under terms that were already written [first-party / press]. Three things lower the risk:
  - Keep the "add item on the website" path working well, so you have supply Discord doesn't control.
  - Let traders link an account you hold (your open question 2). That gives you a direct way to reach them if Discord access breaks [practitioner].
  - Read Discord's developer policy on storing and showing message content off-platform before you grow past a few servers. My own knowledge says that policy has rules on this, but I haven't checked the current text.
- **Consent and privacy.** Owners get public item pages without opting in. Make it easy to remove an item or opt out, and make sure the moderators agree. One upset trader in a small community can get the bot removed.
- **Backfill.** History walks deliberately don't fire watches (good). But be ready to explain to moderators why old items show up on the site.

### First 90 days (at most two things at a time)

| Weeks | Focus |
|---|---|
| 1–2 | 8–10 trader conversations + 2–3 moderator conversations. Choose server and market slice. Add tracking for read rate, watch fire rate, post-to-DM time, returning watchers. |
| 3–6 | Bot live in one server with moderator approval. Hand-seed 20–50 watchers. Check every misread. Read the week-4 cohort. |
| 7–10 | If watches fire and watchers return: add the one-click watch to bot replies, DMs and item pages, plus the "how did you find us" question. If not: change server or slice, or fix trust, before anything else. |
| 11–13 | Copy to a second server. Then the honest Reddit post with a demo. Then start indexing item pages once lifecycle is handled. |

### How strong the evidence is

Nearly all of this rests on **practitioner** experience in the playbooks (Chen's atomic networks, Rachitsky's interviews, the Mom Test, Weinberg & Mares). None of it was tested on gaming tools or Discord bots. The platform-risk cases are **first-party / press** reports. The Reddit guidance is **first-party** (Reddit's own help pages). I didn't run any calculators: you have no revenue, prices or funnel numbers, and I won't make them up. Once you have a few weeks of data (posts read → watches created → DMs → contacts), I can run `funnel_analysis` on it.

### Questions I would have asked you (answer them and I'll adjust)

1. Is the bot live, and in which servers/channels? Roughly how many screenshots a day does it read, and what share resolves correctly?
2. How many people have created a watch, and how many came back in their second week?
3. Which GameX version, mode and platform do your target traders play (GameX ladder/non-ladder, softcore/hardcore, PC/console)? Is there a server you're already a member of or a moderator in?
4. What do traders use today to find specific items (other bots, trade sites)? I haven't checked what exists.
5. Do you plan to make money from it (ads, premium watches), or is it a hobby project? That changes how far paid channels or SEO are worth pushing.
6. How much time do you have each week for this, and is it just you?

If you confirm the facts above, I can save them as a business profile so the next conversation starts from them.

## Tool log

MCP commands (all run with `cd /home/user/marketing-expert && export MARKETING_EXPERT_DATA_DIR=/home/user/marketing-expert/evals/data/companion-strategy`):

1. `node scripts/mcp.mjs instructions`: operating rules (context first, diagnose before prescribing, tools for numbers, ground in playbooks with evidence labels, at most 1–2 ranked moves, plain language/no "moat"/"flywheel"). Followed throughout.
2. `node scripts/mcp.mjs tools`: listed calculators, audits, profile and playbook tools. Chose playbook tools and profiles; calculators not applicable without numbers.
3. `node scripts/mcp.mjs prompts`: listed workflows. Picked marketing_strategy and marketing_diagnosis.
4. `node scripts/mcp.mjs call list_business_profiles '{}'`: returned `[]`. No stored profile, so I offered to save one at the end instead of loading.
5. `node scripts/mcp.mjs prompt marketing_strategy '{"business":"GameX Companion","goal":"get people to use it","budget":"unknown"}'`: 8-step workflow (profile, business-type playbook, constraint, economics, 3 channels, 90-day plan, evidence, what not to do). Used as the answer's structure. Skipped the economics step because there's no revenue/pricing, and said so.
6. `node scripts/mcp.mjs call get_playbook '{}'`: list of playbooks. Chose marketplaces (plus consumer-apps for retention).
7. `node scripts/mcp.mjs prompt marketing_diagnosis '{"context":"..."}'`: diagnosis order (positioning, reach, conversion, retention, economics). Used to name liquidity in one network as the constraint, with a falsifier.
8. `node scripts/mcp.mjs call get_playbook '{"slug":"marketplaces"}'`: cold start, atomic network, supply-first (14/17), liquidity metrics per market, growth loops, programmatic-SEO caveat, stage table. Basis of moves 1–2 and "what not to do".
9. `search_playbooks "Discord community owned community"`: community seeding 20–50 by hand, join existing communities first, owned vs rented. Used in move 1 and the community "don't".
10. `search_playbooks "platform risk API access cut off"`: Twitter/Reddit access-cut cases, clause usually already in terms. Used in the risks section.
11. `search_playbooks "Bullseye channel test cheapest"`: Bullseye and channel decay. Background for channel sequencing.
12. `search_playbooks "retention curve flattening first test"`: consumer-apps retention-first rule, cohort curves that level off, skip paid before that. Used for metrics and "no paid".
13. `search_playbooks "free tool content marketing"`: free tools ("engineering as marketing"), self-reported attribution. Used for calculators/SEO-later and the "how did you find us" question.
14. `search_playbooks "atomic network launch beachhead"`: stage table and launch mistakes (launching to everyone). Supported the one-server focus.
15. `search_playbooks "reduce exposure platform dependence"`: own the customer, a channel the platform doesn't control. Used in the platform-risk mitigations.
16. `search_playbooks "Reddit norms self-promotion"`: disclosure, the 10% rule, subreddit rules [first-party]. Used for the later Reddit post.
17. `search_playbooks "Mom Test interview past behaviour"`: Mom Test rules. Used for the trader/moderator conversations.
18. `search_playbooks "activation event define from data"`: activation method. Background for the returning-watcher metric.

Repo files read (/home/user/gamex-companion, read-only):
- VISION.md, README.md, CLAUDE.md (head), CONTEXT.md (first ~200 lines plus Source message/Listing/Owner/Watch/Notification/Scope entries)
- apps/bot/README.md (bot replies in channel, Message Content Intent approval at 100+ servers, backfill doesn't fire watches, forwarded-message attribution)
- docs/adr/0002-item-data-is-a-model-not-ground-truth.md (first 30 lines)
- research/plannersite-planner.md (first ~150 lines; PlannerSite planner is a reference/adjacent tool)
- Directory listings of apps/, apps/app/src/routes (search, watches, items, ias/imbue calculators, sitemap), apps/bot/src. Grep for "announce" in apps/bot/src and the sitemap route (item pages are in the sitemap).
- `git log` (shallow clone, one commit, so there's no history to judge stage from)
