# Market Size, Market Opportunity and Timing — Research Notes

Scope: TAM/SAM/SOM methods, classic sizing errors, "market matters most", small-markets-that-grow, timing and first-mover evidence, venture math. Researched 2026-10-04.

**Access caveat.** The proxy blocked almost every primary host (pmarchive.com, abovethecrowd.com, aswathdamodaran.blogspot.com, ycombinator.com, sequoiacap.com, a16z.com, ted.com, census.gov, gtellis.net, duke.edu, sloanreview, SSRN, journals, web.archive.org). The web-search budget also ran out early in the session. Full texts were therefore read from **verbatim copies stored in public GitHub repos** (these are marked **[copy]**). Claims that rest only on a search-engine snippet are marked **[snippet-only]**. Claims taken from someone else's notes rather than the original are marked **[secondary]**. None of the academic papers (Golder & Tellis, Lieberman & Montgomery, Suarez & Lanzolla) was read in full.

**Verification pass (2026-10-04).** A later session re-checked priority numbers with targeted web searches; primary pages were still mostly blocked. Items it confirmed carry **[verified-search: <domain>, 2026-10-04]**, meaning the figure matched search-engine text from that domain, not a full read. Corrections are marked "corrected 2026-10-04: was X".

Evidence tags: **[research]** peer-reviewed or academic · **[first-party]** the company's or author's own data or text · **[practitioner]** an investor's or operator's view · **[vendor]** a party with a commercial interest · **[anecdote]** a single case · **[synthesis]** my own inference.

## Sources

1. Andreessen, "The only thing that matters," pmarchive, 25 Jun 2007 — [copy] excerpt (aryaniyaps/startup-idea-finder) + [snippet-only].
2. Gurley, "How to Miss By a Mile…," Above the Crowd, 11 Jul 2014 — full [copy] (samnguyen80/commerce-brain).
3. Damodaran, "A Disruptive Cab Ride to Riches: The Uber Payoff," Jun 2014 + Valuation packet Spr 2020/21 — [secondary] notes (lyndonkl/claude).
4. Cornell & Damodaran, "The Big Market Delusion," *FAJ* 2020 (SSRN 3501688) — [secondary] quotes.
5. Sequoia, "Writing a Business Plan" — full [copy] (SuperAce100/mobius); older TAM/SAM/SOM wording [snippet-only].
6. YC Library: Ralston "A Guide to Seed Fundraising"; Harris "How to build your seed round pitch deck"; Livingston "What's different about unicorns?" (2017); Seibel "The real product-market fit" — full [copy] (juliettech13/queryable-yc-library).
7. Graham, "How to Get Startup Ideas," "Startup = Growth," "Black Swan Farming" (2012) — full [copy] (danLeBrown/what-would-paul-graham-do).
8. Thiel & Masters, *Zero to One* (2014), ch. 5 & 7 — [copy] of book text.
9. Christensen, *The Innovator's Dilemma* (1997) — quoted in a *Linux Journal* review [copy].
10. Gross, "The single biggest reason why startups succeed," TED 2015 — full transcript [copy] (johnlaudun/tedtalks).
11. Golder & Tellis, "Pioneer Advantage: Marketing Logic or Marketing Legend?" *JMR* 30(2):158–170, 1993 — [snippet-only; abstract figures verified-search: journals.sagepub.com, papers.ssrn.com, 2026-10-04].
12. Tellis & Golder, "First to Market, First to Fail?" *SMR* Winter 1996:65–75 — [snippet-only].
13. Lieberman & Montgomery, *SMJ* 9(S1):41–58 (1988); *SMJ* 19(12):1111–1125 (1998); *LRP* 46:312–324 (2013) — [snippet-only].
14. Suarez & Lanzolla, *HBR* 83(4):121–127 (2005); *AMR* 32:377–392 (2007) — [snippet-only].
15. Airbnb 2008 seed deck — text of redesigned version [copy] (william-ragnarsson/vc-analyst).
16. Apple Newsroom, "App Store ecosystem reaches record $1.4 trillion," 4 Jun 2026 — [copy].
17. Uber, Q4 and FY2025 results, Feb 2026 — [copy].
18. Dixon (a16z), "Performance Data and the 'Babe Ruth' Effect in VC," 2015 (Horsley Bridge) — [snippet-only]/[secondary].
19. Levine, "Venture Outcomes are Even More Skewed Than You Think," 2014 (Correlation Ventures) — [snippet-only].
20. US Census descriptions of SUSB, CBP, NES — [copy] page captures.
21. Valentine, "Target Big Markets," Stanford GSB 2010 — title only.

---

## 1. Definitions and methods (TAM / SAM / SOM)

- **Terms.** TAM = total category demand; SAM = the part your product and channels can reach; SOM = what you can realistically win in a set period. No single originator found. [practitioner]
- **Sequoia, older template.** "Calculate the TAM (top down), SAM (bottoms up) and SOM." This line comes from the older 15–20-slide version that is widely reproduced. [snippet-only, src 5]
- **Sequoia, current template.** The current page no longer prescribes TAM/SAM/SOM. The "Market potential" heading reads in full: "Identify your customer and your market. Some of the best companies invent their own markets." The order is: Company purpose → Problem → Solution → **Why now?** → **Market potential** → Competition/alternatives → Business model → Team → Financials → Vision. [first-party, copy, src 5]
  - Implication: customer first, number second; category creation explicitly allowed. [synthesis]
- **YC, Ralston's seed guide.** Deck item 6: "The (huge) Market you are addressing — Total Available Market (TAM) >$1B if possible. Include the most persuasive evidence you have that this is real." [first-party, copy, src 6]
- **YC, Harris's seed-deck template.** The market slide reads: "What's the market here? Is it going to be big? Will you make it big? How much money are you going to make off this thing? Convince the investor that they're going to make lots of money with you." No method is prescribed. [first-party, copy, src 6]
- **YC, Livingston (2017).** "To be a huge startup, you have to have a huge market… market sizes are impossible to predict… our advice at Y Combinator is not even to try to hit a big market early on." [first-party, copy, src 6]
- **YC, Kevin Hale.** His idea tests: is the problem popular, growing, urgent, expensive, mandatory, frequent? His ideal is "markets that are growing 20% a year." [secondary; YC Startup School recap quoted in another research file, not read]
- **Method: top-down.** Start from an analyst or government aggregate and apply filters (segment %, geography %, channel %). Use it as a directional check only. [practitioner]
- **Method: bottom-up.** TAM = (# of target accounts or users) × (annual revenue per account). The account count must come from a named list or register, such as census counts, a directory, an association membership or Sales Navigator. Investors trust it most because every factor is checkable. [practitioner; synthesis]
- **Method: value-theory (value-based).** Size = economic value the product creates for each customer × the share you can capture × the number of customers. Use it when no current spend exists, i.e. when the market has to be invented. Gurley's "car-ownership alternative" is a value-theory move: $9k/yr per car, cut to $6k, × 1B cars = $6T. [practitioner, src 2] It is easy to inflate. Damodaran puts this kind of market into *option value*, not into base cash flows (see §2). [secondary, src 3]
- **Triangulate.** Run at least two methods and check that they land in the same order of magnitude. [practitioner; synthesis]

## 2. Classic sizing errors

### 2a. Understating: using today's market as the TAM (Gurley vs Damodaran, 2014)

- **Damodaran's base case.** "the primary market Uber is targeting is the global taxi and car-service market." He sized it at **$100B**, growing 6%/yr, with a maximum Uber share of **10%**, a 20% revenue slice, a 40% target pre-tax margin and a 10% failure probability. That gave **$5.9B** (6,595 × 0.9), against a funding round that imputed about $17B. [first-party via Gurley's quote, src 2; model detail from secondary notes of Damodaran's packet, src 3]
- **Damodaran's three tiers.** He sorts markets as *probable, plausible, possible*:
  - the urban taxi market is probable, so it goes into the cash flows;
  - suburban car service and rentals are plausible, so they raise the growth rate;
  - the car-ownership replacement is only possible, so it goes in as option value of "$2–3B" on top of the $5.9B.
  
  His packet re-ran Gurley's story with a $300B market growing 3%, 40% share and a 20% slice. That gave **$53.4B** plus $10B+ of option value. With the slice cut to 10% it gave $28.7B. [secondary, src 3]
- **Gurley's core argument.** Using the historical taxi/limo market "is making an implicit assumption that the future will look quite like the past… When you materially improve an offering… and even enable new use cases, you can materially expand the market." [first-party, copy, src 2]
  - *Mechanisms.* Pick-up times, coverage density, price, payment and safety. New use cases: suburbs, rental-car substitute (US rental market $27B), transporting kids, a top-up for mass transit, and replacing car ownership.
  - *Evidence from Uber itself.* Kalanick (WSJ, June 2014): the seed deck put SF taxi+limo spend at "like 120 million bucks… we're a very healthy multiple bigger than that right now, just Uber in SF. So it's not about the market that exists, it's about the market we're creating." [first-party quote inside src 2]
  - *Gurley's numbers.* 3–6× multiplier on the $100B, plus 2.5–12.5% of a **$6T** car-ownership pool (1B cars × $6k, AAA's $9k cut by a third) → TAM **$450B–$1.3T**; a 25× outcome then needs 56% share (bear case) or about 20% (his likely case). Framed as "plausible," not a forecast; he discloses his board bias. [first-party, src 2]
  - *Market share.* He disputes the 10% cap on the grounds of network effects ("increasing returns"): denser supply → shorter pick-up times → more demand. [first-party, src 2]
- **Outcome check.** Uber's FY2025 gross bookings were **$193.5B**, of which Q4 2025 Mobility alone was $27.4B (about $110B annualized). FY2025 revenue was $52.0B. [first-party, src 17] The Mobility segment by itself now exceeds Damodaran's entire 2013 global market of $100B, and revenue is far above his year-10 revenue of $3.6B. The market did expand as Gurley argued. Whether that justified any particular price is a separate question. Gross bookings include delivery, and figures are nominal. [synthesis]
- **Rule.** When a product changes price, convenience or reliability by a large step, size **(a) the spend it replaces** and **(b) an expansion scenario with the elasticity assumption written down**. Never present only one. [synthesis drawing on src 2, 3]

### 2b. Overstating: inflated top-down TAMs

- **The "1%" fallacy.** Thiel: "it's always a red flag when entrepreneurs talk about getting 1% of a $100 billion market. In practice, a large market will either lack a good starting point or it will be open to competition, so it's hard to ever reach that 1%… cutthroat competition means your profits will be zero." [practitioner, copy, src 8]
- **Big Market Delusion.** Cornell & Damodaran: in big, visible markets "each business cluster … will overestimate its capacity and its probability of success" and participants "downplay existing competition." In aggregate, the entrants are priced as if each of them wins. [research, secondary quote, src 4]
- **Confusing spend with addressable budget.** Apple's "App Store ecosystem facilitated over $1.4 trillion" in 2025 breaks down as $1.1T physical goods and services (grocery, food delivery, travel), $149B digital goods and services, and $151B in-app advertising. More than 90% carried no commission to Apple. [first-party/vendor-commissioned study, src 16] An app developer's addressable pool is nearer the $149B digital line than the $1.4T headline. Headline "ecosystem" figures mix in GMV flowing *through* a product, not budget *for* it. [synthesis]
- **Counting non-buyers.** Thiel's PayPal PalmPilot product had "millions of PalmPilot users" who "weren't concentrated… had little in common… Nobody needed our product, so we had no customers." The eBay PowerSellers segment numbered a few thousand, and PayPal reached 25% of them in three months. [first-party anecdote, src 8] Lesson: a large population of *users of an adjacent technology* is not a market. Count accounts with the pain *and* a budget. [synthesis]
- **Analyst-report mismatch.** Analyst categories rarely match your product's job and often blend hardware, services and software. Christensen goes further for disruptive products: "the only thing we may know for sure when we read experts' forecasts about how large emerging markets will become is that they are wrong" (evidence: disk drives, motorcycles, microprocessors). [research/book, quoted in src 9]
- **Reverse-engineered SOM.** Some decks set the SOM equal to the revenue the plan needs, then divide by the TAM. Airbnb's 2008 deck did a version of this: TAM "2 Billion+ trips booked (worldwide)", SAM "560 Million+ budget & online", SOM "84 Million trips w/AirBnB… 15% of available market". It also claimed "$200 million… revenue, projected by 2011" from a $25 average fee, and listed "First to Market" as an advantage. [first-party, copy of redesigned deck, src 15] A 15% share for a pre-launch company is aggressive, yet the deck still undersized the eventual market, as Livingston notes. The real signal was the *market validation* slide: 670k Couchsurfing users and 17k Craigslist temporary listings. [synthesis]

## 3. "Market matters most" [practitioner]

- **Andreessen (2007).** "the size of a startup's market is the number, and growth rate, of those customers or users for that product." Note that **growth rate is part of his definition**. "In a great market — a market with lots of real potential customers — the market pulls product out of the startup." "In a terrible market, you can have the best product in the world and an absolutely killer team, and it doesn't matter — you're going to fail." [copy, src 1]
- **Rachleff's Law,** credited by Andreessen to Andy Rachleff (Benchmark): "The #1 company-killer is lack of market." "When a great team meets a lousy market, market wins. When a lousy team meets a great market, market wins. When a great team meets a great market, something special happens." [copy and snippet, src 1]
- **Rachleff's Corollary.** "The only thing that matters is getting to product/market fit," defined as "being in a good market with a product that can satisfy that market." [copy, src 1]
- **Seibel (YC)** connects this to urgency: "At Sequoia, they talk about finding customers who 'have their hair on fire'… You need to find problems so dire that users are willing to try half-baked, v1, imperfect solutions." [first-party, copy, src 6]
- **Don Valentine.** His 2010 Stanford talk is titled "Target Big Markets." The often-quoted line "We choose markets, not people" appears only in a third-party tweet paraphrase. **[unverified attribution]**

## 4. Small markets that grow

- **Thiel.** "Every startup should start with a very small market. Always err on the side of starting too small… it's easier to dominate a small market than a large one. If you think your initial market might be too big, it almost certainly is." "The perfect target market for a startup is a small group of particular people concentrated together and served by few or no competitors." Then "gradually expand into related and slightly broader markets." Amazon's path ran books → CDs → video → software → everything. [practitioner, copy, src 8]
- **Graham.** "you can either build something a large number of people want a small amount, or something a small number of people want a large amount." Microsoft was "a well" with Altair BASIC: "only a couple thousand Altair owners." "Facebook was a good idea because it started with a small market there was a fast path out of." A successful startup either enters a market with existing competitors armed with "some secret weapon" (Google), or enters "a market that looks small but which will turn out to be big" (Microsoft). [practitioner, copy, src 7]
- **Christensen.** "Small markets don't solve the growth needs of large companies." "Markets that don't exist can't be analysed." Disruptive products "look like toys." This explains why incumbents leave small, emerging markets open. [research/book, quoted, src 9]
- **Examples.**
  - *Airbnb.* Sized in trips (2B, 560M, 84M), not in dollars. Livingston: "the Airbnbs didn't know how many people would want to stay in other people's homes." [first-party, src 6, 15]
  - *App economy.* The App Store launched in 2008. Apple-commissioned figures put 2025 developer digital billings at $149B, and facilitated commerce (mostly physical goods) at $1.4T. [first-party, src 16]

## 5. Timing / "why now"

- **Sequoia.** "Why now? The best companies almost always have a clear why now? Nature hates a vacuum—so why hasn't your solution been built before now?" [first-party, copy, src 5]
- **Bill Gross (TED 2015): what he actually did.**
  - *Sample and factors.* "all 100 Idealab companies, and 100 non-Idealab companies"; the outside ones named are "wild successes" (Airbnb, Instagram, Uber, YouTube, LinkedIn) and failures (Webvan, Kozmo, Pets.com, Flooz, Friendster). Factors: idea, team/execution, business model, funding, timing.
  - *Method.* "I tried to rank across all of those attributes how I felt those companies scored." [first-party transcript, src 10]
  - *Finding.* "Timing accounted for 42 percent of the difference between success and failure. Team and execution came in second, and the idea… came in third." Business model and funding came last. He hedges: "this isn't absolutely definitive."
  - *Examples he gives.* Airbnb and Uber launched in the recession, when people "needed extra money". Z.com failed in 1999–2003 on low broadband. YouTube came after Flash solved the codec problem and US broadband passed 50%. [first-party, src 10]
- **Weaknesses of the 42% figure. [synthesis]** (1) single rater scoring retrospectively with outcomes known (hindsight bias); (2) external companies picked as extremes (selection bias); (3) no statistical method disclosed, so "42 percent of the difference" is undefined; (4) secondary sources give the other factors as 32/28/24/14% [secondary], and the five sum to 140%, so they cannot be variance shares; (5) not replicated or peer-reviewed. Treat it as **[anecdote/practitioner]**: a useful prompt, not a measured effect size.
- **Enabling conditions to test for "why now":** technology cost or capability thresholds (broadband >50%, Flash), new platforms (App Store, smartphone GPS), regulatory change, and behaviour shifts (recession supply, declining youth car ownership in Gurley's essay). [first-party examples, src 2, 10; synthesis]
- **First-mover evidence.**
  - *Golder & Tellis (1993).* A historical analysis of about **500 brands in 50 product categories**. Earlier studies relied on survivor-only data (PIMS/ASSESSOR). Findings: "almost half of market pioneers fail" (**47%**); pioneers' mean market share is about **10%**, "much lower than that found in other studies"; pioneers are current leaders in about **11%** of categories (a secondary relay says 11% of 36 categories); "early market leaders… enter an average of 13 years after pioneers" and have "much greater long-term success." [research; ~500 brands / 50 categories / 47% / ~10% (vs ~30% in earlier studies) / 13 years verified-search: journals.sagepub.com, papers.ssrn.com abstract, 2026-10-04; 11% secondary only] Figures for early leaders (about 8% failure, about 28% share) appear only in secondary sources. [secondary]
  - *Tellis & Golder (1996).* Enduring leaders share five traits: vision, persistence, commitment, innovation, asset leverage. [research, snippet-only, src 12]
  - *Lieberman & Montgomery (1988).* Advantages come from (1) technological leadership (learning curve, patent/R&D races), (2) pre-emption of scarce assets, (3) buyer switching costs. Disadvantages: follower free-riding, uncertainty resolved for followers, technological discontinuities, incumbent inertia. [research, snippet-only, src 13] The 1998 retrospective links these to the resource-based view; the 2013 review concludes that first-mover advantages "often exist even though they are by no means inevitable" and flags "persistent weaknesses" in theory and measurement. [research, snippet-only, src 13]
  - *Measurement artefact.* A VanderWerf & Mahon meta-analysis (66 tests) reportedly found that studies measuring market share are more likely to find pioneer advantage than studies measuring profit or survival. [secondary, unverified]
  - *Suarez & Lanzolla (2005 HBR; 2007 AMR).* They studied 30+ cases. Two drivers: **pace of technology evolution** and **pace of market evolution**. Four regimes: *calm waters* (both slow; best for durable advantage, e.g. Hoover), *market leads*, *technology leads*, *rough waters* (both fast; least advantage, e.g. Netscape, AT&T cellular). In short, fast technology and market change tend to *disable* early-entry advantage. [research, snippet-only, src 14]
  - *Takeaway.* Being early is not the asset. The assets are a durable mechanism (network density, switching costs, scarce inputs) plus the resources to survive until the market forms. [synthesis]

## 6. Growth vs size; urgency; structure

- **Growth is part of the definition.** Andreessen counts "the number, and growth rate" of customers. [src 1] A $200M segment growing 40%/yr becomes about $1B in roughly 5 years. A $5B segment growing 2% offers share only by taking it from incumbents. [synthesis, arithmetic]
- **Urgency beats breadth early.** Graham: initial users "who want it urgently… Usually this initial group of users is small." "The question of whether you're too late is subsumed by the question of whether anyone urgently needs what you plan to make." [copy, src 7] Seibel: users with their "hair on fire" will grab "a brick." [copy, src 6]
- **Buyer concentration.** Thiel's PayPal case shows that a concentrated, reachable cluster (a few thousand PowerSellers in one venue) beats a large, scattered base (millions of PalmPilot owners). [anecdote, src 8]
- **Effects of buyer structure. [synthesis]**
  - *Fragmented buyers* (many SMBs) mean low ACV and high CAC sensitivity. You need product-led or channel distribution, and census counts are reliable.
  - *Concentrated buyers* (a few hundred enterprises or OEMs) mean a high ACV, but each logo carries large weight. Expect long cycles and procurement leverage against you. The TAM is literally a named list.
  - *Concentrated incumbents* mean a priced category with entrenched switching costs. Entry needs a step-change, as with Uber.

## 7. Practical estimation inputs

- **US Census, SUSB (Statistics of U.S. Businesses).** Counts of firms and establishments, employment, payroll and receipts, by NAICS industry and enterprise employment or receipts size, at national, state and MSA level. [first-party, copy, src 20] Use it to filter by company size (e.g. 20–499 employees) for a B2B SAM.
- **US Census, CBP (County Business Patterns).** "an annual series that provides subnational economic data for establishments with paid employees by industry and employment size": establishments, March 12 employment and payroll, down to county (ZIP-level ZBP also exists). The Census Bureau says businesses use it "for analyzing market potential… setting sales quotas." [first-party, copy, src 20]
- **US Census, Nonemployer Statistics (NES).** Businesses with no paid employees and receipts ≥$1,000 that are subject to federal income tax. Covers about 470 industries, available down to county. Essential for solo-operator markets (contractors, creators). [first-party, copy, src 20]
- **Mind the lags.** Census series lag about 2–3 years. Count *establishments* for location-based products, *firms* for HQ-sold software. [synthesis]
- **Other count sources. [vendor]** Not tested this session; treat as indicative and de-duplicate:
 LinkedIn Sales Navigator (accounts by industry, headcount, title, geography); BuiltWith/Wappalyzer technographics (installed-base proxy); app-store intelligence (downloads/revenue by category); association rolls; licensing registries. Incumbents' 10-K segment revenue gives a floor for current spend.
- **Sanity checks. [synthesis]**
  1. *Sum of incumbents.* The revenue of the top N players should be a plausible fraction of your top-down TAM. If the TAM is 50× the combined incumbent revenue, either the category is greenfield (say so explicitly) or the TAM is inflated.
  2. *Implied penetration.* Plan revenue ÷ SAM in year 5. Above about 10–20% in a contested market needs a network-effect or switching-cost argument (compare Damodaran's 10% vs Gurley's 20–56%).
  3. *Customers-needed math for $100M ARR:* ACV $1k → 100,000 customers; $10k → 10,000; $50k → 2,000; $250k → 400. Compare the count with the number of qualifying accounts. If $100M ARR needs more than about 20–30% of all accounts in your SAM, the SAM is too small or the ACV too low.
  4. *Budget line.* Name the budget the money comes from (an existing line item, headcount saved, or new spend). "Spend in the category" is not "budget available to you" (see the Apple $1.4T vs $149B example).

### Worked bottom-up example (hypothetical numbers)

All numbers below are **invented for illustration**. Replace each one with a sourced figure.

Product: scheduling and client-communication SaaS for independent veterinary clinics, US.

| Step | Factor | Hypothetical value | Where the real number comes from |
|---|---|---|---|
| 1 | US vet-services establishments (NAICS 541940) | 30,000 | CBP, latest year |
| 2 | × share that are independent (not corporate chains) | 70% → 21,000 | Industry association / chain 10-Ks (subtract chain locations) |
| 3 | × share with ≥2 vets (enough volume to pay) | 60% → 12,600 | SUSB size classes / survey |
| 4 | × ACV | $6,000/yr | Pricing tests; competitor list prices |
| — | **SAM (US, current product)** | **$75.6M/yr** | 12,600 × $6k |
| 5 | TAM: all 30,000 establishments × $6k + add-on payments at $4k | $300M/yr | Adds module ACV; state the assumption |
| 6 | SOM in 5 yrs: 15% of SAM accounts | 1,890 clinics → $11.3M ARR | Base on win-rate × reachable accounts per rep, not a % guess |
| 7 | Top-down check: incumbent practice-software revenue (sum of 10-Ks/estimates) | e.g. $400M | Must be same order of magnitude as TAM; if TAM ≪ incumbents, the ACV is too low or the scope too narrow |
| 8 | $100M ARR test | needs 16,700 clinics at $6k (> entire SAM) | **Fails**: either raise ACV via payments/embedded fintech, or expand to adjacent verticals (dental, physio) |

Reading the example: this is a strong bootstrapped business (about $11M ARR at 15% of SAM), but it is not a venture-scale business unless there is a credible expansion path (step 8). [synthesis]

## 8. Venture math: why VCs need large markets

- **Return concentration.**
  - *Horsley Bridge (via a16z, Dixon 2015).* About **6% of investments, representing 4.5% of dollars invested, generated about 60% of total returns** (deals across the hundreds of VC funds Horsley Bridge invested in **since 1985**; one relay gives 1985–2014). [snippet-only and secondary, src 18; verified-search: a16z.com, cdixon.org, 2026-10-04]
  - *Correlation Ventures (via Seth Levine, 2014).* Across 21,000+ financings in 2004–2013, **65% failed to return 1×; 10% returned ≥5×; 4% returned ≥10×**. Counts are financings, not companies. [snippet-only, src 19; verified-search: sethlevine.com, 2026-10-04]
- **Graham, YC's own portfolio.** "The total value of the companies we've funded is around 10 billion… just two companies, Dropbox and Airbnb, account for about three quarters of it." "There is probably at most one company in each YC batch that will have a significant effect on our returns." "The big winners could generate 10,000x returns." [first-party, copy, src 7]
- **Thiel, Founders Fund.** "Facebook, the best investment in our 2005 fund, returned more than all the others combined." His rule: "only invest in companies that have the potential to return the value of the entire fund." [first-party, copy, src 8]
- **Fund-returner arithmetic. [synthesis]** $300M fund × ~10% ownership at exit → needs a **$3B exit** to return the fund; at 5–10× revenue that is **$300–600M revenue**; at 10–20% SAM share, SAM ≈ **$1.5–6B**. Hence the YC guide's "TAM >$1B" floor and Sequoia's "invent their own markets": the market must plausibly *reach* billions, even if it starts small.
- **When "too small for VC" is a great business. [synthesis plus first-party framing]**
  - Graham: "not every newly founded company is a startup… A barbershop isn't designed to grow fast." [src 7]
  - A $50–300M SAM with high urgency, low competition and a reachable list can support a $5–30M ARR, profitable, founder-owned company. Under venture power-law math the same company is a "failure."
  - *Choose bootstrapping when* the $100M-ARR test fails (§7), when no credible adjacency expands the market, or when growth would need capital-intensive CAC.
  - *Choose VC when* the product expands its own market (the Gurley test), when network effects allow more than 20% share, or when a fast path exists from a niche into a much larger adjacency (Graham, Thiel).

## Decision rules for a founder [synthesis]

1. **Lead with the customer, not the number.** Name the account type, the count source and the budget line before quoting any TAM (Sequoia's "Identify your customer and your market").
2. **Bottom-up is primary; top-down is a cross-check.** Always show both. If they differ by more than about 3×, explain why or fix it.
3. **Never present "1% of $X B."** Present the share *you* derive from reachable accounts × win rate (Thiel; Big Market Delusion).
4. **Size what you replace, then size the expansion, separately.** State the elasticity or new-use-case assumption explicitly and keep the expansion out of the base case (Gurley vs Damodaran's probable/plausible/possible).
5. **Strip pass-through GMV.** Count only spend that becomes *your* revenue (Apple $1.4T vs $149B).
6. **Pick a well, not a puddle.** Start where a small, concentrated group has an urgent problem, and show the path to the next ring (Graham, Thiel, Seibel).
7. **Report growth as well as size.** Show the segment growth rate and its driver. Andreessen's definition of market size includes growth.
8. **Make "why now" concrete and dated.** Name the threshold that just crossed: a cost, a capability, a platform, a regulation or a behaviour. Then answer Sequoia's "why hasn't this been built before now?"
9. **Don't sell "first mover" as a lasting advantage.** Name the mechanism that would make early entry durable (switching costs, scarce assets, network density). Also say which Suarez–Lanzolla regime you are in. In "rough waters," plan to be the fast follower or the last mover.
10. **Run the $100M-ARR test before choosing a funding path.** Customers needed vs qualifying accounts decides venture or bootstrap. Neither answer is a failure.
11. **Treat the 42%-timing figure and all VC folklore as heuristics.** Do not quote them as measured effects in investor or board material.

## Open questions / could not verify

- Andreessen's essay read only as a structured excerpt; check quote wording against pmarchive.com.
- Damodaran's June 2014 blog post and his later reply to Gurley were not read directly. The model details come from third-party notes on his lecture packet.
- Golder & Tellis (1993): the abstract-level figures (~500 brands, 50 categories, 47%, ~10%, 13 years) are search-verified 2026-10-04. Still unconfirmed: the definitions of pioneer and early leader, the 8% / 28% early-leader figures (secondary only; consistent across relays), "11% of 36 categories", and "4 of 50 categories". A "66 markets" figure in some relays probably comes from Tellis & Golder's later book *Will and Vision* (2002), not the 1993 paper.
- Lieberman & Montgomery and Suarez & Lanzolla: abstract-level only. VanderWerf & Mahon meta-analysis unverified.
- Bill Gross's secondary factor percentages (32/28/24/14) were not verified against his slide. The transcript gives only 42% and the rank order.
- Horsley Bridge and Correlation Ventures: resolved 2026-10-04. Dixon's post says "since 1985" (one relay gives 1985–2014; no source found for "2000–2014"); Correlation covers 2004–2013 financings. Neither original chart was read.
- Not verified: Valentine's exact wording; Kawasaki's 2006 "1% of the market" lie; older Sequoia template text; Gurley's second-hand McKinsey/AT&T 1980 cellular forecast; a16z-specific sizing guidance; YC Kevin Hale criteria (secondary only); Kerr–Nanda–Rhodes-Kropf return statistics; Benedict Evans essays (blocked).
- The Airbnb deck text comes from a redesigned version (Slidebean); the numbers match widely circulated copies but were not compared with the original PDF.
- Census figures (counts by NAICS) were not pulled. The worked example uses invented numbers by design.
