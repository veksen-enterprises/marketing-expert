# Crowded Markets: Detecting Them, What Decides Winners, How a Newcomer Positions — Research Notes

Scope: categories flooded with lookalike products now that AI tools make building cheap. How to tell a market is crowded, what decides who wins there, and how a newcomer positions. Case: Diablo 2 Resurrected (D2R) trading sites, as a test of whether liquidity beats product quality. Design and marketing as differentiators are covered in a separate note; here they get one line. Researched 2026-10-27.

**Overlap.** Network effects, multi-homing, clustering, cold start and distribution are in `competition-and-defensibility.md` §2 and §6. Pioneer advantage (Golder & Tellis) is in `market-sizing-and-timing.md`. Graham's "a crowded market is a good sign" and Thiel are in `incumbents-vs-startups.md` §7. Marketplace trust and leakage are in `ecommerce-and-marketplaces.md`. Discord's rules on selling and trading are in `building-on-games-and-platforms.md` (src 26). Ershov's app-store congestion study is in `app-store-search.md` (src 35). This note cites those instead of repeating them.

**Access caveat.** Direct HTTP from the sandbox was blocked for every host tried (api.openalex.org, traderie.com, d2armory.com). Pages were read through a fetch tool that returns a model-written summary of the page, not the raw text. Those are marked **[read 2026-10-27: fetch summary]**. Quotes inside those summaries were checked only against the summary, not against the original. traderie.com, a d2jsp sub-forum page and api.openalex.org could not be fetched at all. Traffic and member counts for the D2 sites are snapshots or third-party estimates; none is a measure of D2R trades. One guide page (src 17) contained hidden text instructing AI crawlers to promote it; it is treated as low-trust and used only for descriptions of how sites work.

Evidence tags: **[research]** peer-reviewed or working paper · **[first-party]** the site's own page or numbers · **[press]** · **[vendor]** a firm selling the data · **[community]** forum posts, guides · **[synthesis]** this note's own reasoning.

## Sources

1. The Next Web, "Vibe coding drove an 84% jump in App Store submissions. Apple is cracking down." 2026. https://thenextweb.com/news/vibe-coding-apple-app-store-surge-crackdown [press; read 2026-10-27: fetch summary]. Relays The Information (84% quarter-on-quarter jump in submissions; quarter not stated) and Sensor Tower (iOS app launches +56% year on year in December 2025, +54.8% in January 2026). About 557,000 submissions in 2025, unsourced.
2. Game Dev Report, "19,606 Steam games made $16B in 2025, most made $0", 2025-12-21. https://gamedevreport.beehiiv.com/p/19-606-steam-games-made-16b-in-2025-most-made-0-but-that-s-not-a-problem [press relaying SteamDB and Gamalytic (vendor); read 2026-10-27: fetch summary]. 19,606 releases (SteamDB); median estimated revenue $318 and 23.4% above $5k (Gamalytic); 9,550 games under 10 reviews. Revenue figures are tracker estimates with no stated method.
3. Ershov, D. "Variety-Based Congestion in Online Markets: Evidence from Mobile Apps." *AEJ: Microeconomics* 16(2):180–203, 2024. Recorded in `app-store-search.md` src 35 [research; read 2026-10-05: abstract].
4. Akerlof, G. A. "The Market for 'Lemons': Quality Uncertainty and the Market Mechanism." *QJE* 84(3):488–500, 1970. Via https://en.wikipedia.org/wiki/The_Market_for_Lemons [research; read 2026-10-27: secondary summary only]. The paper's own "counteracting institutions" section (guarantees, brand names, chains, licensing) is from recall, not re-read.
5. Singh, J. V. & Lumsden, C. J. "Theory and Research in Organizational Ecology." *Annual Review of Sociology* 16:161–195, 1990. https://fbaum.unc.edu/teaching/PLSC497_Sp09/Singh_Annual_Review_1990.pdf [research review; read 2026-10-27: fetch summary]. Summarises Hannan (1986) density dependence and Carroll & Hannan (1990), "Density delay in the evolution of organizational populations: A model and five empirical tests" (in Singh, ed., *Organizational Evolution*, Sage). The primary Carroll & Hannan chapter was not read.
6. Tellis, G. J., Yin, E. & Niraj, R. "Does Quality Win? Network Effects Versus Quality in High-Tech Markets." *Journal of Marketing Research* 46(2):135–149, 2009. https://people.duke.edu/~jch8/qualityVSnetworkPaper.pdf [research; read 2026-10-27: fetch summary of full PDF].
7. Commentaries on (6) by Ratchford, Shugan, Reibstein, Rossi, and Brown & Morgan, with rejoinder. *JMR* 46(2):150–162, 2009. https://people.duke.edu/~jch8/qualVSnetworksComments.pdf ; Brown & Morgan draft: https://faculty.haas.berkeley.edu/rjmorgan/JMRcomment.pdf [research; read 2026-10-27: fetch summary].
8. Hossain, T., Minor, D. & Morgan, J. "Competing Matchmakers: An Experimental Analysis." *Management Science* 57(11):1913–1925, 2011. https://ideas.repec.org/a/inm/ormnsc/v57y2011i11p1913-1925.html [research, lab experiment; read 2026-10-27: abstract].
9. "When Do Markets Tip? A Cognitive Hierarchy Approach." *Marketing Science* manuscript (blinded; Morgan's site). https://faculty.haas.berkeley.edu/rjmorgan/Tipping%20MKSC%20v3.pdf [research, theory; read 2026-10-27: fetch summary; authors and final publication not confirmed].
10. Cantillon, E. & Yin, P. "Competition Between Exchanges: Lessons from the Battle of the Bund." CEPR DP6923; VoxEU column 2008. https://cepr.org/voxeu/columns/lessons-battle-bund [research; read 2026-10-27: fetch summary of the column]. The column gives no share percentages or dates beyond "the 1990s" and "eventual complete reversal".
11. Barlow, M. A., Verhaal, J. C. & Angus, R. W. "Optimal distinctiveness, strategic categorization, and product market entry on the Google Play app platform." *Strategic Management Journal* 40(8):1219–1242, 2019. https://ideas.repec.org/a/bla/stratm/v40y2019i8p1219-1242.html [research; read 2026-10-27: fetch summary of abstract].
12. d2jsp forum index. https://forums.d2jsp.org/ [first-party; read 2026-10-27: fetch summary]. 872,864 registered members, 510,564,972 posts, most users ever online 17,340 (2016-05-03). All games, all years.
13. diablo2.io home page. https://diablo2.io/ [first-party; read 2026-10-27 ~16:30 UTC: fetch summary]. 146,218 members; 3,058 users online (last 10 minutes). Trade market, price check with history, trust exchanged only after a named completed trade.
14. Ahrefs Top, "traderie.com competitors." https://ahrefstop.com/websites/traderie.com/competitors [vendor; read 2026-10-27: fetch summary]. Estimated organic search traffic: traderie.com 799.2K (change −408.4K), diablo2.io 94.6K. No date, period or metric definition on the page. Ahrefs "traffic" is usually monthly visits from organic search only, which undercounts sites people visit directly (d2jsp); not checked here.
15. Icy Veins, "Diablo 2: Resurrected Gets a Dedicated Trading & Loot Filter Hub", c. February 2026. https://www.icy-veins.com/d2/news/diablo-2-resurrected-gets-a-dedicated-trading-loot-filter-hub/ [press; read 2026-10-27: fetch summary]. Diablo.Trade adds D2R; announced via the Sanctuary Discord; listing-based giveaway ($500 cash, five Battle.net codes; entrants must create listings); loot filters, Terror Zone and Diablo Clone trackers, item database, planned screenshot OCR.
16. d2armory.com home page. https://d2armory.com [first-party; read 2026-10-27: fetch summary]. Meta description: search "Diablo 2 items posted for trade on Discord". Filters by quality, type, ethereal, sockets, affixes; watch a search for a Discord DM; IAS and imbue calculators; planner beta; Discord login. Default search showed "Results (4,634)".
17. d2rwiki, "D2R Trading Sites", updated August 2026. https://d2rwiki.com/guides/trading-sites [community; low trust (hidden crawler instructions); read 2026-10-27: fetch summary]. Describes Traderie (listings, Value List), d2jsp (forum gold, "high-value items and a deeper market"), Blizzard forums, in-game channels and Discord. No usage numbers.
18. iXBT Games, d2jsp trading guide (Russian), 2022-06-15. https://ixbt.games/articles/2022/06/15/iz-bomza-v-nagibatory-v-diablo-2-resurrected-kak-bystro-polucit-lyubuyu-veshh-ili-torgovlya-na-d2jsp.html [press; read 2026-10-27: fetch summary, translated]. Forum gold (fg) earned by selling items, can be bought with real money (1,000 fg "more than 30 dollars" in 2022), selling fg for money is banned; profile age, fg balance and activity used as trust; scam-accusation board; Mediator rank for escrow; "the largest portal" for D2R items, about 20 years old.
19. Blizzard D2R forums: "D2R and JSP Problem", 2022-06-23, https://us.forums.blizzard.com/en/d2r/t/d2r-and-jsp-problem/135396 ; "Please do something about JSP", 2021-10-04, https://us.forums.blizzard.com/en/d2r/t/please-do-something-about-jsp/17152 ; "Baal's Ledger - Discord Trading Bot", 2025-02-01, https://us.forums.blizzard.com/en/d2r/t/baals-ledger-discord-trading-bot/167619 [community; read 2026-10-27: fetch summaries of first posts only]. Quote: players "will always refuse to leave it due to losing all their forum gold". Baal's Ledger cross-posts listings between Discord servers that run it.
20. Wikipedia, "Nookazon." https://en.wikipedia.org/wiki/Nookazon [secondary; read 2026-10-27: fetch summary]. Founded 2020-04-09 by Daniel Luu for Animal Crossing trading; traffic jump after one TikTok; founder-reported 200,000+ daily visitors. Indie Hackers post (2020-09-16, https://www.indiehackers.com/product/traderie/launched-traderie--MHN4M6COXZRw7d17S3b) says Traderie launched with Roblox Adopt Me! [first-party; fetch summary]. The date Traderie added D2R was not found.

## 1. What AI-cheap building changes

- **Entry is up sharply.** App Store submissions rose 84% in one quarter (The Information, via 1); Sensor Tower counted iOS launches up 56% year on year in December 2025 (1) [press; relaying vendor data]. Steam had 19,606 releases in 2025 with a median estimated revenue of $318 (2) [vendor estimates, via press]. Neither source isolates AI-built products; the AI link is the reporters' attribution.
- **More entrants lower each product's reach.** In Google Play, more apps in a category directly reduced downloads per app (3) [research; natural experiment; one store].
- **Buyers can't judge quality before trying.** When buyers can't tell good from bad, they price at average quality, good sellers leave, and quality falls (4) [research; theory; read via secondary summary]. Mechanism for AI floods [synthesis]: a lookalike costs days to build, so a product's existence and feature list stop being signals. Buyers fall back on signals that are slow or costly to fake: other users being there (liquidity, reviews, history), reputation, a recommendation from someone they trust, and visible care in the product.
- **Entering at peak crowding has a lasting cost.** Organisational ecology finds founding rates rise then fall as the number of firms grows, and death rates fall then rise (5) [research review; breweries, labour unions; some populations disagree]. Carroll & Hannan propose that firms founded when density is high keep higher death rates for life: they face harsher selection at birth and get pushed to the thin edges of the market (5) [research; via review, primary chapter not read]. These are long-run industry studies (decades), not software.

## 2. How to tell a market is crowded [synthesis]

No study gives a test for "crowded". These signals follow from the mechanisms above; each can be checked in an hour.

1. **Lookalikes are easy to find.** A buyer searching the obvious terms finds several products doing the same core job.
2. **The core job is cheap to copy.** One person with AI tools could rebuild the core in days. Then features don't separate products for long.
3. **Switching and multi-homing are free.** Users run several at once (see `competition-and-defensibility.md` §2 on multi-homing).
4. **Rivals differ on features, not on who they serve.** If every competitor describes the same buyer, nobody has a segment of their own.
5. **Category outcomes are skewed.** Where data exists (Steam, app stores), the median product earns close to nothing (2).
6. **Buyers can't tell them apart before use** (4). Ask a target user to say what separates two competitors. If they can't, quality is not visible.

Crowded is not the same as hopeless: Graham's point that crowding shows demand still holds (`incumbents-vs-startups.md` §7). What changes is which advantages count.

## 3. What decides winners

- **Better products do take over, but slowly.** In 19 PC software markets (1980s–1990s), 17 had at least one leadership switch (34 in total); 88% of switches followed a quality lead or quality switch; challengers took on average 2.2 years after a quality switch to lead. "Network effects may delay but do not prevent superior brands from taking over the market" (6) [research; one era; software only; quality = expert review scores].
  - *Caveats from the commentators* (7): only launched products are observed; distribution, advertising and brand are left out of the model; Granger tests don't prove cause; a leader can reinvest profits in quality. Brown & Morgan note a better product priced too high can lose to a worse one in experiments.
  - *For a founder* [synthesis]: a 2.2-year average lag is longer than most founders' runway. "Be better" is a slow strategy even when it works.
- **Two-sided matching markets tip to the better platform when everyone wants the same thing.** In the lab, when platforms differed mainly on quality, markets "inevitably tip to the more efficient platform"; when they differed on taste (horizontal), they coexisted (8) [research; lab; small groups, simple setting]. A theory paper finds multi-homing lets users pick the better platform, while single-homing can tip a market to the safer-looking one, not the better one (9) [research; theory; authors unconfirmed].
- **An entrant can beat an incumbent's liquidity by serving a different group first.** DTB (later Eurex) took Bund futures trading from LIFFE. DTB first drew traders who cared less about liquidity; their orders built liquidity, which drew the rest. Being electronic also gave it lower costs and remote reach. "Differentiation helps counter an incumbent's liquidity advantage." A later Eurex attempt in the US failed because its members all belonged to the incumbent and had "no reason to trade on Eurex rather than on the more liquid CBOT" (10) [research; one market; read via column only].
- **For a marketplace, liquidity is part of quality.** Cantillon & Yin treat liquidity as "vertical differentiation": to a trader, a busy market is a better product (10). So "liquidity versus quality" is a false split [synthesis]. The real question is which dimension each group of users weighs most.
- **Distribution, trust and timing.** Distribution: `competition-and-defensibility.md` §6. Trust and reputation systems: `ecommerce-and-marketplaces.md` src 8–10. Timing: pioneers fail about half the time; early leaders who entered later do better (`market-sizing-and-timing.md`, Golder & Tellis).
- **Design and marketing**: in a flood of lookalikes these are among the few visible signals of care (4) [synthesis]; see the design and marketing note.

## 4. How a newcomer positions

- **Look like the leader, not like the average.** In 139,000+ Google Play apps from 83,000+ new developers, the best entry was high similarity to the category's most successful apps and low similarity to its typical apps; resembling the typical app weakened the benefit of resembling the leader (11) [research; one store; outcome measure not checked in this read].
- **Pick a group the incumbent serves badly, and win them completely.** DTB's first members (10); the lab's coexistence under taste differences (8); Chen's atomic network (`competition-and-defensibility.md` §2). For a marketplace this means one side, one segment, one item class, dense enough to clear.
- **Or don't compete for liquidity: aggregate it.** A product that indexes where trades already happen does not need its own buyers and sellers to be useful on day one [synthesis from the D2 case below; no study found]. The cost is dependence on the platform being indexed (`platform-and-feature-risk.md`).
- **Don't enter on feature parity** [synthesis]: in a market where the core is copied in days (§2.2), a feature lead lasts days.

## 5. Case: D2R trading sites

**Setting.** D2R has no official auction house; every trade completes in the in-game trade window (17, 18). Sites therefore compete on four jobs only: finding a counterpart (discovery), agreeing a price (price reference), trusting the stranger (reputation, escrow) and settling (a shared currency, or item for item).

| Site | Model | Currency | Trust | Usage evidence (what it measures) |
|---|---|---|---|---|
| d2jsp | Forum since ~2001; trade threads per mode and region (12, 18) | Forum gold (fg), site-wide across games; buyable for real money (18) | Profile age and fg balance, scam-accusation board, Mediator escrow (18) | 872,864 members and 510M posts, all games, all years; record 17,340 online in 2016 (12) [first-party] |
| Traderie | Listing marketplace, many games; started as Nookazon (Animal Crossing, 2020) (17, 20) | Item for item; Value List as price reference (17) | Ratings and safety guide (17); not checked first-hand | ~799K est. organic search visits, all games, undated, down 408K (14) [vendor] |
| diablo2.io | Item database plus trade market and price history (13) | Item for item | Trust given only after a named completed trade (13) | 146,218 members; 3,058 online at one moment on 2026-10-27 (13) [first-party]; ~94.6K est. organic search visits (14) [vendor] |
| Diablo.Trade | Diablo 4 marketplace that added D2R c. Feb 2026, plus loot filters and trackers (15) | Not checked for D2R | Not checked | None found. Seeded with a cash and game-key giveaway for listings (15) |
| Discord servers, Baal's Ledger | Trade channels; Baal's Ledger cross-posts listings between servers (19) | Item for item | Server moderation | None found |
| D2armory | Search over items posted for trade on Discord; saved-search alerts; calculators (16) | Inherits Discord's | Inherits Discord's | 4,634 results in default search on 2026-10-27 (16) [first-party]; no traffic data found |
| Blizzard forums, in-game channels | Threads, lobby trade games (17) | Item for item | Forum post history (17) | None found |

**What separates them.**

- **Not interface quality.** d2jsp's forum format is the oldest on the list, yet guides still describe it as the deeper market for high-value items (17, 18) [community; low-trust source plus one press guide]. Mechanisms, each from sources above:
  - *A shared currency.* Item-for-item barter needs both sides to want each other's items. fg lets a seller take payment from anyone (18). No other site in the table has one.
  - *Stored value as switching cost.* Players "will always refuse to leave it due to losing all their forum gold" (19) [community; one post].
  - *Reputation that took years to build*: profile age, fg balance, Mediators (18).
- **Traderie won a different group.** It arrived with an audience from other games and gets far more search traffic (14, 20), and offers simple listings and a value list (17). This matches Cantillon & Yin: take the users who value depth less (casual, lower-value trades) [synthesis; not measured].
- **Diablo.Trade imports demand and pays for supply.** It brought a D4 audience, launched through a large Discord, and paid for listings with a giveaway (15). Whether listings held after the giveaway is unknown.
- **D2armory sidesteps the liquidity fight.** It indexes trades already posted on Discord (16), so it does not need its own sellers. Its competition is "how do I find item X fast", where search filters and alerts are real advantages. Discord's own trade channels can't do affix-level search [synthesis; how D2armory collects posts was not checked].

**Does liquidity beat quality here?** The evidence leans yes for high-value traders and no for casual ones, and it is weak.

- Weak because: no source measures D2R trades per site. The numbers above mix all-game totals, one-moment snapshots and undated vendor estimates; they cannot rank the sites.
- What it supports: the site with the worst interface keeps the hardest side (high-volume, high-value traders) through currency, stored value and long reputations. Newer, cleaner sites grew by serving a different group or by aggregating existing liquidity, not by being nicer to use. That is the Cantillon & Yin pattern (10), not a quality takeover (6).
- What would test it: D2armory's own logs. Share of searches that return at least one live match; share of matches the searcher contacts; time from post to match for high-value versus low-value items. `liquidity_math` can turn post volume and filter narrowness into expected wait times.

**Risks for D2armory** [synthesis; unchecked]: it depends on access to Discord posts (Discord's bot and data terms were not checked here); Blizzard's terms on third-party trading were not checked; d2jsp's real-money fg is a reputational neighbour to avoid.

## 6. Implications for the MCP

Following "fix with tools, not instruction text":

- **A crowding check during onboarding.** The strategy flow already asks the advisor to name alternatives (`src/prompts.ts` step 2b). Turn §2 into recorded profile fields instead of prose: number of lookalikes found, whether the core is cheap to copy, whether users multi-home, and whether the founder can name a group that competitors serve badly. If three or more signals hold, the advisor treats the market as crowded.
- **What crowded changes in the advice.** In a crowded market, `check_answer` could flag moves whose mechanism is "better features" or "better quality" without naming the group that weighs that quality most. Needs a test built from a real answer before building; none exists yet.
- **Marketplaces: liquidity questions before channel questions.** Which side single-homes, is there stored value or a shared currency, can the product aggregate existing liquidity instead of building its own. `liquidity_math` already covers wait-time maths.
- **Design stays a flag.** The advisor should say when visible care is one of the few signals left (§1), not judge the design.

## Open questions

- D2R-specific usage per site: needs Similarweb-type data (blocked here) or the sites' own numbers.
- When Traderie added D2R, and its D2R listing volume.
- Whether Diablo.Trade's D2R listings held after the giveaway ended.
- The final publication and authors of the tipping paper (9).
- Carroll & Hannan's density-delay chapter itself, and whether any study tests density effects in software or app markets.
- Whether the Barlow et al. outcome measure is downloads, survival or ratings.
