# Startup Risk and Opportunity Assessment: Research Notes

Scope: base rates, failure causes, investor risk taxonomies, opportunity-evaluation frameworks, effectuation, founder biases, pre-mortems and kill criteria, and demand signals. Researched 2026-10-04.

**Access caveat.** The egress proxy blocked nearly every primary host: bls.gov, nber, ssrn, hbs.edu, dash.harvard.edu, aeaweb, informs, wiley, sciencedirect, gwern.net, a16z.com, paulgraham.com, pmarchive.com, cbinsights.com, iris.unibocconi.it, steveblank.com, kauffman.org and others. The session's web-search budget also ran out partway through, so some planned lookups were never run (Startup Genome, Kauffman, Sarasvathy/Read meta-analysis, Klein/Mitchell, Sahlman, Porter). **Read in full:** Paul Graham's three essays (from the sgoel97/essay-datasets GitHub mirror), Andreessen's "Pmarca Guide to Startups" (from the fictive-kin/pmarchive GitHub mirror), and CB Insights' 2016 "Top 20 Reasons Startups Fail" PDF (from CB Insights' own S3 bucket). Everything else rests on search-engine snippets of primary or secondary pages and is marked **[snippet-only]**. Items marked **[not re-verified]** are standard bibliographic facts from background knowledge that I could not check in this session. Do not quote their numbers until someone has checked them. Re-read on 2026-10-05 against primary text: BLS Table 7 (bls.gov) and the BLS TED item; the WSJ Ghosh article (verbatim reproduction); Seth Levine's Correlation post; Dixon's cdixon.org post; Eisenmann's own HBS slide deck; Wasserman's HBR 2008 article and a book excerpt; Gompers et al.'s NBER working paper; the Camuffo 2020 abstract and the full 2024 SMJ paper; the Koning et al. abstract and NBER working paper; Hamilton's abstract; Klein's HBR text and the Mitchell et al. abstract.

**Verification pass (2026-10-04).** A later session re-checked priority numbers with targeted web searches; primary pages were still mostly blocked. Items it confirmed carry **[verified-search: <domain>, 2026-10-04]**, meaning the figure matched search-engine text from that domain, not a full read. Corrections are marked "corrected 2026-10-04: was X".

Evidence tags: **[research]** peer-reviewed or working-paper evidence · **[government-data]** official statistics · **[practitioner]** an expert's essay or framework, not a controlled study · **[vendor]** a firm that sells data or services · **[anecdote]** a single case.

## Sources

1. US BLS, Business Employment Dynamics (BED), Table 7 "Survival of private sector establishments by opening year"; TED articles "1-year survival rates for new business establishments by year and location" (2024) and "34.7 percent of business establishments born in 2013 were still operating in 2023" (2024). https://www.bls.gov/bdm/ ; https://www.bls.gov/opub/ted/2024/34-7-percent-of-business-establishments-born-in-2013-were-still-operating-in-2023.htm [read 2026-10-05: Table 7 text file https://www.bls.gov/bdm/us_age_naics_00_table7.txt and the TED item]
2. Secondary relays of BED: LendingTree "22.1% of New US Businesses Close Within a Year"; startbusinessbystate.com "Business Survival Rates by State (2026)". [snippet-only, secondary]
3. Gage, D. "The Venture Capital Secret: 3 Out of 4 Start-Ups Fail," *Wall Street Journal*, Sept 2012 (Shikhar Ghosh, HBS). Relayed by GeekWire, Inc., Fast Company and HuffPost (2012). https://www.geekwire.com/2012/hard-truth-report-75-percent-startups-fail/ ; HBS News relay https://www.hbs.edu/news/Pages/item.aspx?num=487 [read 2026-10-05: WSJ text as reproduced verbatim at https://www.startup-book.com/2012/09/21/the-venture-capital-secret-3-out-of-4-start-ups-fail/ ; hbs.edu and the original relays returned 403]
4. Correlation Ventures financing-outcome data (~21,000 financings), as relayed by Idea to Value (2018) and Seth Levine (2014), https://sethlevine.com/archives/2014/08/venture-outcomes-are-even-more-skewed-than-you-think.html . Period 2004–2013. [read 2026-10-05: sethlevine.com post; secondary relay of Correlation's data]
5. Dixon, C. "Performance Data and the 'Babe Ruth Effect' in Venture Capital," a16z, 2015 (Horsley Bridge data, 1985–2014). https://a16z.com/performance-data-and-the-babe-ruth-effect-in-venture-capital/ ; https://cdixon.org/2015/06/07/the-babe-ruth-effect-in-venture-capital/ [read 2026-10-05: cdixon.org]
6. CB Insights, "The Top 20 Reasons Startups Fail" (PDF, created July 2016; 101 post-mortems). https://s3-us-west-2.amazonaws.com/cbi-content/research-reports/The-20-Reasons-Startups-Fail.pdf **[read in full]**; plus the 2021 "Top 12 Reasons" update [snippet-only]
7. Eisenmann, T. *Why Startups Fail: A New Roadmap for Entrepreneurial Success*. Currency, 2021; "Why Start-ups Fail," *HBR* May–June 2021. https://www.hbs.edu/faculty/Pages/item.aspx?num=60200 [read 2026-10-05: survey design and pattern names from Eisenmann's own slide deck, https://www.advancedleadership.harvard.edu/s/Eisenmann-Slides.pdf ; book and HBR article not opened]
8. Wasserman, N. *The Founder's Dilemmas*. Princeton UP, 2012; "The Founder's Dilemma," *HBR* Feb 2008. https://press.princeton.edu/books/paperback/9780691158303/the-founders-dilemmas [read 2026-10-05: HBR 2008 article https://hbr.org/2008/02/the-founders-dilemma , publisher page, and a book excerpt at http://www.startuplessonslearned.com/2012/04/founders-dilemmas-equity-splits.html]
9. Gompers, P., Kovner, A., Lerner, J. & Scharfstein, D. "Performance persistence in entrepreneurship." *J. Financial Economics* 96(1):18–32, 2010. https://econpapers.repec.org/RePEc:eee:jfinec:v:96:y:2010:i:1:p:18-32 [read 2026-10-05: NBER working paper w12592 (2006), "Skill vs. Luck in Entrepreneurship and Venture Capital"; the JFE version was not opened]
10. Andreessen, M. "The Pmarca Guide to Startups," Part 2 "When the VCs say 'no'" (June 20, 2007) and Part 4 "The only thing that matters" (2007). Mirror: https://github.com/fictive-kin/pmarchive (templates/startup-guide.html) **[read in full]**
11. Camuffo, A., Cordova, A., Gambardella, A. & Spina, C. "A Scientific Approach to Entrepreneurial Decision Making: Evidence from a Randomized Control Trial." *Management Science* 66(2):564–586, 2020. doi:10.1287/mnsc.2018.3249 [read 2026-10-05: abstract via OpenAlex, plus the 2024 replication's account of this trial; full text login-gated]
12. Camuffo, A., Gambardella, A. et al. "A scientific approach to entrepreneurial decision-making: Large-scale replication and extension." *Strategic Management Journal* 45(6):1209–1237, 2024. doi:10.1002/smj.3580. Authors: Camuffo, Gambardella, Messinese, Novelli, Paolucci, Spina. [read 2026-10-05; corrected: full text at https://openaccess.city.ac.uk/id/eprint/32437/ ]
13. Koning, R., Hasan, S. & Chatterji, A. "Experimentation and Start-up Performance: Evidence from A/B Testing." *Management Science* 68(9), 2022. doi:10.1287/mnsc.2021.4209; NBER w26278; HBS Working Knowledge, "Is A/B Testing Effective? Evidence from 35,000 Startups" [read 2026-10-05: published abstract via OpenAlex and NBER w26278 PDF]
14. Graham, P. "Schlep Blindness" (Jan 2012), "How to Get Startup Ideas" (Nov 2012), "Default Alive or Default Dead?" (Oct 2015). Mirror: https://github.com/sgoel97/essay-datasets (paul_graham_essays/text_data/138, 148, 166) **[read in full]**
15. Cooper, A.C., Woo, C.Y. & Dunkelberg, W.C. "Entrepreneurs' perceived chances for success." *J. Business Venturing* 3(2):97–108, 1988. https://ideas.repec.org/a/eee/jbvent/v3y1988i2p97-108.html [snippet-only]; percentages as relayed by Kahneman, *Thinking, Fast and Slow* (2011) [snippet-only, secondary; 81% / 33% (10 out of 10) / 39% verified-search: gwern.net copy of the paper, 2026-10-04]
16. Camerer, C. & Lovallo, D. "Overconfidence and Excess Entry: An Experimental Approach." *American Economic Review* 89(1):306–318, 1999. doi:10.1257/aer.89.1.306 [snippet-only] (re-check 2026-10-05: aeaweb PDF returns 403 or a paywall page; only the introduction text in OpenAlex was readable)
17. Koellinger, P., Minniti, M. & Schade, C. "'I think I can, I think I can': Overconfidence and entrepreneurial behavior." *J. Economic Psychology* 28(4):502–527, 2007. [snippet-only] (re-check 2026-10-05: Elsevier paywall; no abstract in OpenAlex)
18. Åstebro, T., Herz, H., Nanda, R. & Weber, R. "Seeking the Roots of Entrepreneurship: Insights from Behavioral Economics." *J. Economic Perspectives* 28(3):49–70, 2014. doi:10.1257/jep.28.3.49 [read 2026-10-05: abstract only] (re-check 2026-10-05: full text returned 403 at aeaweb and 410 at the RERO repository, so the Åstebro & Chen 42% was not checked)
19. Hamilton, B. "Does Entrepreneurship Pay? An Empirical Analysis of the Returns to Self-Employment." *J. Political Economy* 108(3), 2000. [read 2026-10-05: abstract]
20. Sarasvathy, S. "Causation and Effectuation." *Academy of Management Review* 26(2):243–263, 2001. [not re-verified]
21. Read, S., Song, M. & Smit, W. "A meta-analytic review of effectuation and venture performance." *J. Business Venturing* 24(6):573–587, 2009. [not re-verified]
22. Klein, G. "Performing a Project Premortem." *HBR*, Sept 2007; Mitchell, D.J., Russo, J.E. & Pennington, N. "Back to the future: Temporal perspective in the explanation of events." *J. Behavioral Decision Making* 2(1):25–38, 1989. [Klein's 30% citation and the paper's abstract verified-search: hbr.org, onlinelibrary.wiley.com, 2026-10-04; full text not read]
23. Sahlman, W. "How to Write a Great Business Plan." *HBR* July–Aug 1997; Porter, M. "How Competitive Forces Shape Strategy," *HBR* 1979, and "The Five Competitive Forces That Shape Strategy," *HBR* Jan 2008; Ries, E. *The Lean Startup* (2011); Blank, S. *The Four Steps to the Epiphany* (2005); Helmer, H. *7 Powers* (2016). [not re-verified]

---

## 1. Base rates of failure

**Establishment survival (all US private establishments, not just "startups")**
- BLS BED Table 7 follows each March cohort of new private-sector establishments. An establishment is a location, not a firm, and survival is not the same as success. [1] [government-data]
- BLS TED headline: "34.7 percent of business establishments born in 2013 were still operating in 2023," i.e. 10-year survival ≈ 35%. The same TED item says the cohort's survival fell most in year one, by 20.4 percentage points (2013→2014). [1] [government-data; verified-search: bls.gov, 2026-10-04]
- 1-year survival, latest cohort: establishments opened in the year to March 2024 that were still operating in March 2025 ≈ **77.9%** (22.1% closed). [1] [government-data; read 2026-10-05: bls.gov Table 7]
- **Which cohorts (resolved 2026-10-04).** The trio quoted together, **77.9% / 51.4% / 34.7%**, comes from one Table 7 release measured in **March 2025**, and each figure is a *different* cohort: 1-year = establishments opened in the year to March 2024; 5-year = opened in the year to March 2020; 10-year = opened in the year to March 2015. Separately, BLS's own TED item gives 34.7% for the 2013→2023 cohort, so both relays were right: two cohorts happen to share the same 10-year value. The 2015 cohort's path was 79.6% (yr 1), 69.1%, 61.4%, 55.4%, 50.2% (yr 5) and 34.7% (yr 10). [1] [read 2026-10-05: bls.gov Table 7; every figure in this bullet matches]
- Secondary summaries of BED: ≈79.6% at 1 year (this is the 2015 cohort's year-1 value), ≈51.4% at 5 years (corrected 2026-10-04: was ≈50.6%; Table 7 shows 50.6% is the 2013 cohort's 5-year value, while 51.4% is the year-to-March-2020 cohort measured March 2025), ≈34.7% at 10 years. Across the 22 cohorts that have completed 10 years, 10-year survival sits between **32.4% and 35.3%**. Most deaths happen early: the 10-year cohort analysed lost roughly 3× as many establishments in years 1–5 as in years 6–10. [1] [read 2026-10-05: Table 7 has 22 cohorts with 10-year values (openings in the years to March 1994 through March 2015), ranging from 32.4% (2001 cohort) to 35.3% (2010 cohort). The 2015 cohort lost 49.8 points of survival in years 1–5 and 15.5 in years 6–10, about 3.2×]
- Operational rule: for a generic new business, use **~78–80% / ~50% / ~35%** survival at 1 / 5 / 10 years (latest: 77.9% / 51.4% / 34.7%, March 2025 release). Survival is remarkably stable across decades. [1][2]

**VC-backed companies (survival is the wrong metric; use return of capital)**
- Shikhar Ghosh (HBS) studied >2,000 companies that received venture funding, "generally at least $1 million", from 2004 through 2010 (results were similar for 2000–2010). About **75% never returned cash to investors**, and **30–40% liquidated**, with investors losing everything. The figure depends heavily on how "failure" is defined. The National Venture Capital Association's estimate of 25–30% failing differs mainly in definition (corrected 2026-10-05: was "industry-reported failure rates of 20–30%"). The WSJ piece gives a third definition: if failure means missing the projected return (e.g., a revenue-growth or break-even target), **more than 95%** fail. The 30–40% liquidation figure is framed as applying to "high potential" US startups. Method: an unpublished dataset of companies that received venture funding 2004–2010; no written methodology was found. [3] [research-ish, unpublished dataset relayed by WSJ; read 2026-10-05: WSJ text]
- Correlation Ventures, ~21,000 **financings** (not companies) over **2004–2013**: **~65% returned <1×**, only **10% returned ≥5×** and **4% returned ≥10×** (corrected 2026-10-04: was "<4%"). [4] [vendor/investor data, secondary; read 2026-10-05: sethlevine.com]
- Horsley Bridge (fund-of-funds LP data, 1985–2014), via Chris Dixon: about **6% of deals, representing 4.5% of dollars invested, produced ~60% of returns**; Dixon defines home runs as deals returning >10×. The share of investments that lose money is U-shaped across fund quality: bad funds lose money most often, but "great funds lose money more often than good funds do" (corrected 2026-10-05: was "better funds had more strikeouts, not fewer"; the 80% / more-than-half / >40% loss rates are chart readings not stated in Dixon's text). [5] [practitioner analysis of LP data; read 2026-10-05: cdixon.org. Period: Horsley Bridge funds invested "since 1985"]
- Implication: VC-backed outcomes are power-law distributed. "Median VC-backed startup" ≈ capital loss. A founder's expected-value case must rest on the tail, and a personal-risk case must assume the median.
- **Startup Genome** (e.g., the widely repeated "premature scaling" and "90% fail" claims) and **Kauffman Firm Survey** survival figures were **not verified** this session (search budget exhausted). Treat any Startup Genome number as [vendor].

## 2. Why startups fail

**CB Insights post-mortems [vendor]**
- 2016 report: CB Insights read **101 self-published post-mortems** and coded the reasons, allowing several per company, so percentages sum to >100%. Top reasons: **#1 "no market need" 42%**; **#2 ran out of cash 29%**; #3 not the right team; #4 got outcompeted 19%; also user-unfriendly product, no business model, poor marketing 14%, lack of focus 13%, lack of passion/domain expertise 9%, burnout 8%, failure to pivot 7%. [6] [vendor, read in full]
- CB Insights itself notes that "there is rarely one reason for a single startup's failure." [6]
- 2021 update: ~110+ post-mortems. Secondary relays give "ran out of cash/failed to raise" ≈38% and "no market need" ≈35% as the top two. [6] [vendor, snippet-only] (re-check 2026-10-05: the report URL now carries a March 2026 edition instead: 431 VC-backed companies that shut down since 2023, reasons coded for 385; "ran out of capital" 70%, poor product-market fit 43%, bad timing 29%, unsustainable unit economics 19% [vendor; read 2026-10-05: https://www.cbinsights.com/research/report/startup-failure-reasons-top/ ]. The 2021 figures could not be found.)
- **Method limits:** self-selected (founders who chose to publish), self-attributed (cash running out is a proximate symptom, not a root cause), small n, and no comparison group of survivors. Use it for hypothesis generation, not for estimating probabilities.

**Eisenmann, *Why Startups Fail* (2021)**
- Evidence base: survey of **470 US startups** that raised a **$0.5–3M seed round between Jan 2015 and Apr 2018** (science-based businesses excluded; the founder/CEO answered; outcome = change in the value of seed equity by Dec 2019 or exit; 63% gained >50% in value, 10% lost >50%); 1:1 post-mortem interviews; published accounts; **20+ HBS case studies** on failed ventures. [7] [research-lite: descriptive survey plus cases; read 2026-10-05: Eisenmann's slides; corrected: was "launched 2015–2018". The ~50 questions and the mostly-software mix were not on the slides]
- **Early-stage patterns:**
  - **Good Idea, Bad Bedfellows**: a sound opportunity sunk by misaligned resource providers (co-founders, team, investors, partners).
  - **False Starts**: "launch fast / fail fast" taken too literally, so the company skips customer research and builds the wrong thing.
  - **False Positives**: early-adopter enthusiasm is mistaken for mainstream demand.
- **Late-stage patterns:**
  - **Speed Traps**: hypergrowth chased past market saturation, with rising CAC.
  - **Help Wanted**: scaling ventures run short of capital and/or senior talent.
  - **Cascading Miracles**: the plan needs many independent long-shot bets to all come true. Eisenmann's own slides use "Cascading Miracles" (a vision needing radical behaviour change, technical breakthroughs, big-company partners, new regulation and vast capital; if any one fails, the venture fails). [7] [practitioner/research; read 2026-10-05]
- Diagnostic framework: **Diamond-and-Square**. The diamond covers opportunity: customer value proposition, technology/operations, marketing, profit formula. The square covers resources: founders, team, investors, partners. A promising venture needs all eight elements aligned. [7] [snippet-only] (re-check 2026-10-05: not on Eisenmann's slide deck; book not opened)

**Wasserman, *The Founder's Dilemmas* (2012)**
- Dataset: nearly **10,000 founders across ~3,600 startups**. [8] [research; read 2026-10-05 for the 10,000-founder survey (publisher page, book excerpt); the ~3,600 startups figure was not found in either]
- The widely quoted claim that "**65% of high-potential startups fail because of co-founder/people problems**" appears to trace to Gorman & Sahlman (1989). That study surveyed 49 VCs about 96 troubled portfolio companies; 91 had management-team problems and 61 (63.5%) ranked team issues in their top three reasons. [8] [provenance from a practitioner blog, snippet-only. VC-attributed, not founder data. Cite with that caveat.]
- **73% of founding teams split equity within a month** of founding, usually equally and with little negotiation ("quick handshake"). [8] [read 2026-10-05: book excerpt, "In Noam's dataset, 73% of founding teams split equity within a month of founding"]
- Teams of friends and family are less stable than teams of former colleagues. Per secondary relay, each additional prior social tie raises founder-departure risk by ~28%. [8] [snippet-only, secondary]
- "Rich vs King" (HBR 2008, 212 US startups): **by year 3, 50% of founders were no longer CEO**; 40% were still CEO in year 4; **<25% led their company's IPO**. Founders who gave up more equity built more valuable companies. [8] [research; read 2026-10-05: HBR 2008, startups founded in the late 1990s and early 2000s]

**Gompers, Kovner, Lerner & Scharfstein (2010), *JFE***
- In VC-backed firms, success was defined as going public or filing to go public (by Dec 2003). The authors' model estimates that previously successful entrepreneurs had a **30%** chance of success in their next venture, versus **18%** for first-timers and **20%** for founders whose previous venture failed. These are model estimates, not raw rates; one specification in the same paper gives 30.6% / 20.9% / 22.1%. [9] [research; read 2026-10-05: NBER w12592]
- Read-across: prior failure barely improves the odds (20% vs 18%), but prior success does. The authors interpret this as evidence of skill and/or market-timing ability, not simply "learning from failure."

## 3. Risk taxonomies used by investors

**Andreessen's "onion theory of risk" (pmarchive, Part 2, June 2007)** [10] [practitioner, read in full]
- "Risk in a startup investment comes in layers that get peeled away -- reduced -- one by one." The founder's job is to peel layers until the investment "doesn't look terrifying and merely looks risky."
- Layers, quoted in substance:
  - **Founder**: right team? technologist plus someone who can run the company?
  - **Market**: "Will anyone want it? Will they pay for it? How much…? How do we know?"
  - **Competition**: differentiated from startups and incumbents?
  - **Timing**: too early or too late?
  - **Financing**: how many more rounds and dollars to profitability, "How certain…?"
  - **Marketing**: can it cut through the noise, and do CAC and revenue per customer work?
  - **Distribution**: are required partners obtainable?
  - **Technology**: can it be built at all, and are breakthroughs needed?
  - **Product**: can *this team* build it?
  - **Hiring**: can it hire the key roles?
  - **Location**: can it hire the right talent where it is?
- Prescribed fixes: for market risk, "go get some customers to demonstrate that the market exists. Preferably, paying customers." For competition risk: "Never, ever say that you have no competitors." For founder risk: "the tough one", which may mean changing the founding team.
- Part 4 ("The only thing that matters") adds **Rachleff's Law**: "The #1 company-killer is lack of market… When a great team meets a lousy market, market wins." In a great market, "the market pulls product out of the startup." [10]

**Steve Blank and Eric Ries** [not re-verified]
- Blank: a startup is a temporary organization **searching** for a repeatable, scalable business model; a company **executes** a known one. Customer development has four steps: discovery, validation, creation, building. Search-phase risk is dominated by customer and market unknowns, not execution. [23]
- Ries: write down the **leap-of-faith assumptions**, chiefly the **value hypothesis** (does it deliver value once used?) and the **growth hypothesis** (how will new customers discover it?). Test them with an MVP in a build-measure-learn loop. "Validated learning" means progress measured by evidence, not output. Use "innovation accounting" to decide whether to pivot or persevere. [23]

**Evidence that hypothesis-driven entrepreneurship works**
- **Camuffo, Cordova, Gambardella & Spina (2020), Management Science 66(2):564–586.** RCT with **116 Italian startups** (Milan, 2016), 16 data points over ~1 year. Both arms got 10 sessions of training; the treatment taught founders to frame theories and hypotheses and test them rigorously. Treated founders "perform better" (higher revenue) and were **more likely to pivot**; the abstract says they were "not more likely to drop out than the control group in the early stages". The 2024 replication states this trial had too few terminations to detect a termination effect consistently. One relay gives about **3× cumulative revenue**. [11] [research, RCT; read 2026-10-05: abstract; corrected: was "more likely to terminate their idea (and earlier)". The 3× figure is from a secondary relay and was not checked]
- **Camuffo, Gambardella et al. (2024), SMJ 45(6):1209–1237.** Large-scale replication: **759 firms across four RCTs**. Found a positive effect on **idea termination**, including earlier termination, because founders recognised sooner that ideas were not valuable. Pivots showed a **nonlinear** effect: treated firms made few pivots rather than none or repeated ones. Treated firms terminated about 2.7 weeks earlier on average (p = .009). **Small positive revenue effect:** pooled across the four trials, treated firms earned about **EUR 7,000 more cumulative revenue** than controls (p = .030; many firms had no revenue yet); per trial the effect was positive but significant only in one (Table 6). Authors: Camuffo, Gambardella, Messinese, Novelli, Paolucci & Spina. [12] [research, RCT; read 2026-10-05; corrected: was "no clear revenue effect (p = .4596)"; no p = .4596 appears in the published paper]
- **Koning, Hasan & Chatterji (2022), Management Science 68(9).** Panel of **35,262 high-tech startups founded 2008–2013** worldwide, with web-technology and traffic data. Few adopt A/B testing. The abstract says that among adopters, performance **improves 30–100% after a year** of use. HBS's own summary gives a smaller average figure, **~10% more weekly page views**, plus **9–18% more products launched** and a **5% greater likelihood of raising VC**. Use 30–100% only with the abstract's framing. The gap is a version difference: the NBER working paper says A/B testing "is associated with a 10% increase in page views" (about 10% for the marginal firm after selection controls), while the published 2022 abstract reports 30–100% after a year. Experimentation fattens the **tails**: adopters both **scale and fail faster**. Published in *Management Science* 68(9):6434–6453. [13] [research, observational panel with controls; read 2026-10-05: published abstract and NBER w26278]
- Net: the strongest evidence (RCTs) supports **disciplined hypothesis testing that makes founders kill bad ideas sooner**. It does not show that "lean" rituals raise every company's odds.

**Sequoia / YC framings** [not re-verified]
- YC's motto is "Make something people want." Sequoia's business-plan template sections include problem, solution, **why now**, market size, competition, business model, team. "Why now" is the timing layer of the onion. Exact template wording was not checked this session.

## 4. Opportunity-evaluation frameworks

**Paul Graham: operational tests** [14] [practitioner, read in full]
- *How to Get Startup Ideas* (2012):
  - **Well test**: "you can either build something a large number of people want a small amount, or something a small number of people want a large amount. Choose the latter." Look for users who "want it urgently", not people who "could see themselves using it one day."
  - **Sitcom/made-up test**: if all you know is that an idea "sounds plausible, you have to assume it's bad." Friends saying "maybe I could see using something like that," summed across the population, gives "zero users."
  - **Path-out test**: a deep niche is necessary but not sufficient. There must be "a fast path out" of it (Facebook: Harvard, then all colleges).
  - **Origin test**: "organic" ideas grow from founders' own experience and "the most successful startups almost all begin this way." "Live in the future, then build what's missing."
  - **Domain test**: search where you have expertise, otherwise "you're giving yourself a Dunning-Kruger pass."
  - **Competition**: "It's exceptionally rare for startups to be killed by competitors… better a good idea with competitors than a bad one without." Worrying you're late is itself "one of the signs of a good idea."
- *Schlep Blindness* (2012):
  - "Your unconscious won't even let you see ideas that involve painful schleps." Example: Stripe and payments (banks, fraud, regulation).
  - Ambitious schlep-heavy ideas are "like undervalued stocks": less founder competition.
  - Test: replace "what problem should I solve?" with "**what problem do I wish someone else would solve for me?**"
- *Default Alive or Default Dead?* (2015):
  - Test: "Assuming their expenses remain constant and their revenue growth is what it has been over the last several months, do they make it to profitability on the money they have left?" "Half the founders I talk to don't know."
  - Fatal pinch = "default dead + slow growth + not enough time to fix it."
  - Counting on investors is acceptable only with steep growth ("say over 5x a year"). Even then, keep a written plan B, including "precisely when you'll have to switch."
  - "Hiring too fast is by far the biggest killer of startups that raise money."
- Graham's essays describe YC's experience. They are not controlled evidence. [anecdote/practitioner]

**Other frameworks** [not re-verified unless noted]
- **Sahlman (HBR 1997)**: judge a plan on **People, Opportunity, Context, Deal**. Investors weight people first, and the plan should show how the team responds when context shifts. [23]
- **Porter's Five Forces (HBR 1979; updated 2008)**: industry profitability set by rivalry, threat of entrants, threat of substitutes, buyer power, supplier power. For a startup, run it on the *target* industry to see whether a winner can earn margins. Porter's 2008 piece notes that industry growth and technology are not forces in themselves. [23]
- **Helmer, 7 Powers (2016)**: durable differential returns need a "benefit" plus a "barrier": scale economies, network economies, counter-positioning, switching costs, branding, cornered resource, process power. Cross-reference the positioning knowledge file. [23]
- **Wardley mapping** [practitioner]: map the value chain against evolution stage (genesis, custom, product, commodity) to spot where a component is commoditising. Not researched this session.
- **Founder-market fit** [practitioner]: does this team have unusual insight into or access to this market? It overlaps Graham's "organic" and "domain" tests and Andreessen's founder layer. The origin of the phrase was not verified this session.

## 5. Effectuation (Sarasvathy 2001) [not re-verified]
- Causation picks a goal and gathers means. Effectuation starts from available means and lets goals emerge. Principles:
  - **Bird-in-hand**: start with who you are, what you know, and whom you know.
  - **Affordable loss**: commit what you can afford to lose, instead of optimising expected return.
  - **Crazy quilt**: pre-commitments from self-selected partners shape the venture.
  - **Lemonade**: leverage contingencies instead of avoiding them.
  - **Pilot-in-the-plane**: the future is co-created, so control matters more than prediction. [20]
- Empirical support: the Read, Song & Smit (2009) JBV meta-analysis is commonly summarised as finding positive associations between venture performance and means-based action, partnerships and leveraging contingencies. Its findings on affordable loss and its effect sizes were **not verified** this session. [21]
- Operational use: affordable loss is a hard cap on personal downside, and it pairs naturally with BLS base rates and kill criteria (§7).

## 6. Founder cognitive biases (evidence)
- **Overconfidence: Cooper, Woo & Dunkelberg (1988).** 2,994 entrepreneurs, NFIB members surveyed in 1985. They rated their own odds well above the odds they gave to "businesses like yours." **81% put their own odds at 7 out of 10 or better, and 33% rated their own odds at 10 out of 10.** Kahneman paraphrases the latter as "their chance of failing was zero". Only **39%** gave 7/10 or better to "any business like yours". [15] [research, survey; verified-search: gwern.net copy of the 1988 paper (snippet) plus Kahneman relays, 2026-10-04] (re-check 2026-10-05: ScienceDirect paywalled, SSRN 403, gwern.net copy now 404; the 2,994 sample size matches the abstract listing)
- **Reference-group neglect: Camerer & Lovallo (1999), AER.** Lab market-entry games. When payoffs depended on relative *skill* (trivia) rather than chance, subjects overestimated their relative rank and **over-entered, losing money in aggregate**. Excess entry was **highest when subjects self-selected, knowing payoffs would be skill-based**: they neglected that competitors were similarly skilled enthusiasts. [16] [research, experiment, snippet-only] (re-check 2026-10-05: AER full text paywalled)
- **Koellinger, Minniti & Schade (2007).** Global Entrepreneurship Monitor data from 18 countries. Entrepreneurial self-confidence strongly predicts entry, and across countries it is **negatively related to nascent-venture survival rates**. [17] [research, snippet-only] (re-check 2026-10-05: paywalled, no abstract available)
- **Åstebro, Herz, Nanda & Weber (2014), JEP.** Many entrepreneurs enter and persist despite low risk-adjusted returns. Candidate explanations include risk preferences, overconfidence and non-pecuniary benefits. No single "smoking gun" explains all the facts. [18] [research review; read 2026-10-05: abstract]
  - Hamilton (2000): after 10 years in business, **median self-employment earnings are ~35% below** comparable paid employment ("a median earnings differential of 35 percent for individuals in business for 10 years"; the differential is not explained by low-ability workers selecting into self-employment). [19] [research; read 2026-10-05: abstract]
  - Counterpoint: correcting for income under-reporting (Åstebro & Chen 2014) makes the mean gain positive and large (>42%). Medians and means tell different stories. [18] [snippet-only] (re-check 2026-10-05: JEP full text returned 403)
- Debiasing levers that follow from this evidence (synthesis):
  - Write your probability down before seeing base rates, then compare (outside view).
  - Ask "who else is entering, and are they as good as me?" to counter reference-group neglect.
  - Pre-commit kill criteria (§7).

## 7. Pre-mortem, kill criteria, stage-gating
- **Pre-mortem (Klein, HBR 2007)**: before commitment, the team imagines the project has **already failed** and each member independently writes the reasons, which are then pooled and addressed. Klein cites **Mitchell, Russo & Pennington (1989)**: "prospective hindsight" (imagining the event has occurred) increases the ability to correctly identify reasons for future outcomes by about **30%**. [22] [read 2026-10-05: Klein's HBR text (wording confirmed) and the paper's abstract; corrected. **Measure caveat:** the abstract gives no 30% figure. It reports that temporal perspective (setting the event in the future vs the past) "showed little influence", while treating the outcome as certain changed the kind of explanation: sure-event explanations were longer, more episodic and in the past tense, and uncertainty affected the type of explanation rather than time spent. The earlier note that certainty raised the number of reasons by ~30% came from snippets and is not in the abstract. Treat Klein's 30% as unverified until the full paper is read.]
- **Kill criteria**: the Camuffo RCTs show that the measurable benefit of a hypothesis-driven approach is largely **earlier termination of bad ideas**. In the 2024 replication, treated firms terminated more often and about 2.7 weeks earlier; the authors describe termination as preventing founders "from pursuing projects that are not valuable". [12] [research; read 2026-10-05; corrected: the quoted "recognized earlier" sentence was not found in the paper]
- Andreessen: if five to eight VCs all say no, "There is something wrong with your plan." Stop pitching and retool. [10]
- Graham's written plan B, with a dated switch point, is a kill or pivot trigger. [14]
- Stage-gating (synthesis): tie each financing or effort tranche to retiring one named onion layer. Fund the cheapest test of the riskiest assumption first.

## 8. Opportunity signals
- **Urgency, or "hair on fire"**: users "who want it urgently"; at Stripe, "users were desperately waiting for what they were building." [14] [practitioner]
- **Pull vs push**: in a great market "the market pulls product out of the startup… customers are knocking down your door." [10] [practitioner]
- **Absence of PMF looks like this**: "word of mouth isn't spreading, usage isn't growing that fast… the sales cycle takes too long, and lots of deals never close." Presence: "customers are buying the product just as fast as you can make it." [10] [practitioner]
- **Retention and organic word of mouth**: these are the measurable versions of pull. No primary benchmark for retention-curve shape was verified here; see metrics-and-measurement.
- **Workarounds and schleps**: painful manual processes that many people know about but avoid building for, as with payments before Stripe. [14]
- **Paying customers over interest**: Andreessen's market-risk fix is "Preferably, paying customers." [10] CB Insights' top coded failure reason is "no market need" at 42%. [6]
- **Technology or regulatory shifts ("why now")**: "Live in the future"; being at the leading edge of a rapidly changing field makes missing things obvious. [14]
- **Early-adopter trap**: early traction from enthusiasts is Eisenmann's "False Positives" pattern. Confirm the next segment before scaling. [7]

## 9. A risk-review procedure for a founder (synthesis, not a tested protocol)
1. **Set base rates.** Write down your personal P(survive 5 yrs) and P(return capital) before reading on. Compare with the anchors: ~50% of new US establishments survive 5 years and ~35% survive 10 [1][2]; ~65–75% of VC-backed financings or companies do not return capital [3][4]. If your number is far above base rate, write the specific evidence that justifies the gap (Cooper; Camerer & Lovallo) [15][16].
2. **Peel the onion.** For each of Andreessen's 11 layers [10], score risk as high, medium or low, and name the single cheapest piece of evidence that would retire it. Market risk goes first (Rachleff's Law).
3. **Write leap-of-faith hypotheses.** For value and growth [23], state each as a falsifiable test with a threshold and a deadline, e.g. "≥N of 20 target users pay $X within 30 days." This is the treatment arm in Camuffo et al. [11][12]
4. **Run the Graham idea tests.** [14] Check five things:
   - Well: who wants it urgently?
   - Path out: what is the next segment?
   - Organic and domain: why is this team's view privileged?
   - Schlep: what is everyone else avoiding?
   - Sitcom: is "plausible" the only evidence?
5. **Check industry structure.** Run Five Forces and Helmer powers on the end state: is there a plausible barrier once you win? [23]
6. **Hold a pre-mortem.** "It is 18 months later and we have shut down." Each person lists reasons independently, then you cluster them against Eisenmann's six patterns and Wasserman's people issues (equity split, roles, friend-founder ties) [7][8][22].
7. **Set kill criteria and plan B.** Pre-commit metrics and dates that trigger pivot or termination. Compute default alive or dead monthly, and write when plan B starts [14]. Cap personal exposure at affordable loss [20].
8. **Gate the money.** Release each spend tranche only when the previous gate's hypothesis has been validated or killed. Re-run steps 1–2 at every raise.

## Open questions / could not verify

*Updated 2026-10-04 after a verification pass. Resolved and removed: BLS cohort mapping (see §1), Correlation Ventures period, Horsley Bridge period, Camuffo 2024 revenue question, Cooper et al. wording, Mitchell et al. measure. The Camuffo 2024 revenue answer and the Mitchell et al. measure were corrected again on 2026-10-05 after reading the primary text; see §3 and §7.*
- **BLS Table 7**: read on bls.gov 2026-10-05; the cohort mapping, the 77.9% / 51.4% / 34.7% figures, the 32.4–35.3% range and the ~3× early-death ratio all match.
- **Ghosh/WSJ**: the 95% "projected ROI" definition is now confirmed via relays, but no written methodology exists in public; the dataset is unpublished.
- **Startup Genome** (premature scaling, "90% fail") and **Kauffman Firm Survey** survival rates were not researched.
- **CB Insights 2021 update**: n and percentages are snippet-only. The 2016 "not the right team" percentage sits in a chart image and could not be extracted.
- **Eisenmann's sixth pattern**: resolved 2026-10-05, "Cascading Miracles" (his slides). Survey regressions appear only as charts on the slides; the book was not opened.
- **Wasserman's 65%**: provenance (Gorman & Sahlman 1989) comes from a secondary blog. The ~28% per-social-tie figure was not traced to a specific paper.
- **Camuffo 2020**: the "3× cumulative revenue" figure is from a secondary relay; the paper's full text is login-gated. In the 2024 paper's re-analysis of this trial (RCT1), the revenue effect was EUR 10,799 with p = .125.
- **Koning et al.**: resolved 2026-10-05; the ~10% is the NBER working-paper estimate and 30–100% is the published abstract.
- **Sarasvathy 2001, Read et al. 2009, Sahlman 1997, Porter 1979/2008, Ries, Blank, Helmer**: none were fetched. Citations and summaries are from background knowledge; verify meta-analytic effect sizes before quoting.
- **Sequoia's business-plan template wording, origin of "founder-market fit", and Wardley mapping specifics**: not researched.
