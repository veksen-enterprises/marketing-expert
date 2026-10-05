# Small bets: running several cheap marketing tests instead of one big bet — Research Notes

**Scope.** This note covers the *method* of trying several cheap marketing moves at once, keeping the ones that work and dropping the rest. It asks four questions. What does research say about entrepreneurship as a series of experiments and about "real options"? How long should a channel or tactic run before you judge it, and what should end it? What is the case against: split attention, judging too early, and returns that only build up if you stay with one thing? When should you stop testing many things and put your effort into one channel? It also covers survivorship bias, and has one short subsection on portfolios of whole projects (Vassallo, Levels, multi-app developers, Apple guideline 4.3). The individual moves themselves (store and directory listings, open source, social media, building in public, changelogs, emailing new users by hand) are researched in other notes and are not covered here.

**Access caveat (2026-10-05).** Pages were fetched with a generic browser User-Agent. `[read 2026-10-05]` means the page or PDF text was read. `; abstract` means only the abstract was read. `[snippet-only]` means only a search-engine summary was seen, so check those figures before quoting them. The OpenAlex API had used up its daily quota, so abstracts came from Crossref, Semantic Scholar, NBER and author PDFs. Blocked or unreadable: x.com (402), medium.com (Cloudflare; read through an archived copy instead), journals.aom.org and journals.uchicago.edu (403), tractionbook.com (connection refused), facebook.com business help (empty page), indiehackers.com (403), web.archive.org (bot block). Every founder case is a **survivor** story, and most of the numbers are self-reported.

Tags: [research] peer-reviewed or working-paper study · [first-party] a platform's own documentation · [vendor] data from a company with a commercial interest · [practitioner] a founder's or expert's framework, not a controlled test · [rule-of-thumb] a heuristic with no traceable evidence behind it.

**Already in the repo (linked here, not repeated):**
- Camuffo et al. 2020 and 2024 randomised trials of hypothesis-driven founding, and Koning, Hasan & Chatterji 2022 on A/B testing in 35,262 startups: `research/startup-risk-and-opportunity.md` §4, sources [11][12][13].
- Gompers et al. 2010 on serial founders' track records: same file, [9].
- Raffiee & Feng 2014 on keeping the day job: `research/community-and-hobby-products.md` [19].
- PlayDrone 2013 and RevenueCat 2026 on how concentrated app outcomes are: `research/app-discovery-outside-stores.md` [1][6].
- Traction / Bullseye and Balfour's Four Fits: `research/brand-growth-channels.md` §4.
- Binet & Field's finding that brand effects take more than 6 months: `research/brand-growth-channels.md` §1.

## Sources

### A. Experiments and options: why many cheap tests can beat one big bet

1. **Kerr, W. R., Nanda, R. & Rhodes-Kropf, M., "Entrepreneurship as Experimentation,"** *Journal of Economic Perspectives* 28(3):25–48, 2014. doi:10.1257/jep.28.3.25; NBER w20358 PDF https://www.nber.org/system/files/working_papers/w20358/w20358.pdf [research; read 2026-10-05: full NBER text]
   - Core claim (abstract): entrepreneurship "is about experimentation", and success probabilities are "low, extremely skewed, and unknowable until an investment is made".
   - Worked example: a project costs $110 and pays $10,000 with 1% probability, so its expected value is −$10 and nobody should fund it outright. A test that tells you whether the chance is 10% (the test comes back positive 10% of the time) raises the value after a positive result to $890. The test is therefore worth running if it costs less than $89. The test "creates a real option value": you buy the right, not the duty, to continue.
   - Experiments are worth most "where initial information can be especially informative about the overall quality of the project and is cost effective to obtain". Where early tests "reveal very little" (their examples are a particle collider and a nuclear start-up before simulation), the logic breaks down.
   - Indirect costs matter too. A stigma of failure can stop people running tests that are worth running.
   - Evidence of skew: of all US startups whose first early-stage VC round came in 1985–2009 (Thomson Venture Economics), about **55% were terminated at a loss** and **6% returned more than 5×**. That 6% produced about **50% of gross returns**.
   - Investors cannot pick winners in advance. At one VC firm that had invested more than $1 billion, partners' scores at first investment were "statistically no different" for the big winners and the losers. The correlation between score and return multiple was **0.1**.
   - VC firms are "a portfolio of tests": start small, cut losses early, and put "ever larger amounts" into the few that test positive.

2. **McGrath, R. G., "Falling Forward: Real Options Reasoning and Entrepreneurial Failure,"** *Academy of Management Review* 24(1):13–30, 1999. doi:10.5465/amr.1999.1580438 [research (theory paper); snippet-only: the publisher page returned 403, and Semantic Scholar says the publisher removed the abstract]
   - According to search summaries of the abstract: theory carries a pervasive "antifailure bias" even though failure is everywhere in entrepreneurship.
   - Real-options reasoning means pursuing high-variance opportunities but investing further only when conditions turn out favourable. This raises the upside while capping the cost of failure.
   - It is a theory paper, not a measured result.

3. **Ewens, M., Nanda, R. & Rhodes-Kropf, M., "Cost of Experimentation and the Evolution of Venture Capital,"** *Journal of Financial Economics* 128(3):422–442, 2018. doi:10.1016/j.jfineco.2018.03.001; NBER w24523 https://www.nber.org/papers/w24523 [research; read 2026-10-05; abstract]
   - Cheaper ways to start a business (the paper's context is cloud computing) moved VCs towards a "spray and pray" approach: a little money and little oversight for many startups, which they are more likely to abandon, "but where initial experiments significantly inform beliefs".
   - Result: innovation shifted towards ideas whose prospects "are revealed quickly and cheaply", and away from complex technologies "where initial experiments cost more and reveal less".
   - This is the "small bets" logic in its home setting. It works best when a cheap test is informative.

4. **Azevedo, E. M., Deng, A., Montiel Olea, J. L., Rao, J. & Weyl, E. G., "A/B Testing with Fat Tails,"** *Journal of Political Economy* 128(12):4614–4672, 2020. doi:10.1086/710607; author PDF https://eduardomazevedo.github.io/papers/azevedo-et-al-ab.pdf [research; read 2026-10-05: author PDF]
   - The best strategy depends on how the gains are spread across ideas.
     - If most gains come from typical ideas, run "a few high-powered 'big' experiments".
     - If the distribution is "very fat tailed", meaning a few rare ideas produce most of the value, a "lean" strategy of "trying more ideas, each with possibly smaller sample sizes" is better.
   - On Microsoft Bing's experiment platform, the **top 2% of ideas produced 74.8% of historical gains**.
   - Testing **20% more ideas** with the same users would have raised productivity by **17.05%** (a counterfactual model).
   - Ideas with small, marginal results "should be shrunk aggressively, because they are likely to be lucky draws". Outliers are likely to be real.
   - Setting: product changes inside a mature search engine with millions of users, not marketing channels at a startup. The reasoning carries over; the numbers do not.

5. **Gans, J. S., Stern, S. & Wu, J., "Foundations of Entrepreneurial Strategy,"** *Strategic Management Journal* 40(5):736–756, 2019. doi:10.1002/smj.3010 [research (theory); read 2026-10-05: abstract via Crossref]
   - Entrepreneurs "face many alternatives that cannot be pursued at once".
   - Analysis without commitment "yields multiple, equally viable alternatives from which one must be chosen". The authors call this gap a "central paradox".
   - In other words, testing does not remove the need to choose and commit, and some strategies only show their value after you commit to them.

### B. Concentration: one channel usually dominates

6. **Masters, B., notes on Peter Thiel's Stanford CS183 "Startup", Class 9, "If You Build It Will They Come?"** (Spring 2012). GitHub mirror: https://github.com/startup-engineering/000-how-to-build-the-future/blob/master/09-if-you-build-it.md [practitioner; read 2026-10-05: mirror of the student's notes, not Thiel's own text]
   - "It is very likely that one channel is optimal. Most businesses actually get zero distribution channels to work."
   - "If you try for several but don't nail one, you're finished."
   - Engineers who "try some sales, BD, advertising, and viral marketing—everything but the kitchen sink" are named as the mistake.
   - This is an assertion with no data behind it. The same idea appears in *Zero to One* (2014).

7. **Balfour, B., "Product Channel Fit Will Make or Break Your Growth Strategy,"** 12 July 2017. https://brianbalfour.com/essays/product-channel-fit-for-growth [practitioner; read 2026-10-05]
   - "at a given moment in time a company that has product channel fit will get 70%+ of their growth from one channel".
   - Examples: TripAdvisor, Yelp, Glassdoor, Pinterest and Houzz from user-generated-content SEO; WhatsApp, Evernote, Dropbox and Slack from virality; Supercell, Squarespace and Blue Apron from paid marketing.
   - Advice: "prioritize and tackle one or two at a time", not "a shotgun approach to testing channels".
   - No data source is given for the 70% figure.

8. **Weinberg, G. & Mares, J., *Traction*,** Portfolio, 2015 (the "Bullseye" framework). Already summarised in `research/brand-growth-channels.md` [13]. Re-checked 2026-10-05 through secondary summaries only, e.g. https://blas.com/traction/ (tractionbook.com refused the connection). [practitioner; secondary]
   - Three rings:
     - Outer: brainstorm one idea for each of 19 channels.
     - Middle: run "small, fast, and cheap experiments" on the most promising ones (about three).
     - Inner: focus on the one channel that moves the needle, "until it no longer works", then move on to the next.
   - Another rule from the book: spend about 50% of your time on getting customers (traction) from the start.
   - No published test of the framework was found (see Open questions).

9. **Rachitsky, L., "How the biggest consumer apps got their first 1,000 users,"** Lenny's Newsletter, 12 May 2020. https://www.lennysnewsletter.com/p/how-the-biggest-consumer-apps-got [practitioner; read 2026-10-05: public portion]
   - Method: about a month of founder outreach and interviews covering roughly 25 famous apps (Tinder, Uber, Superhuman, TikTok, Pinterest, Slack and others).
   - "Most startups found their early users from just a single strategy. A few like Product Hunt and Pinterest found success using a handful. No one found success from more than three."
   - The sample contains only winners, so it shows what winners did, not what works on average.

### C. How long to give a channel before judging it

10. **Google Search Central, "SEO Starter Guide"** (last updated 2025-12-10). https://developers.google.com/search/docs/fundamentals/seo-starter-guide [first-party; read 2026-10-05]
    - "Some changes might take effect in a few hours, others could take several months. In general, you likely want to wait a few weeks to assess whether your work had beneficial effects."
    - Google's separate "Do you need an SEO?" page (updated 5 June 2026) now only says to ask an SEO "in what timeframe" to expect results. The "four months to a year" line that is often attributed to Google was not on the current page (see Folklore).

11. **Ahrefs, "How Long Does It Take to Rank in Google?"** (study published 15 May 2025). https://ahrefs.com/blog/how-long-does-it-take-to-rank/ [vendor; read 2026-10-05]
    - Samples: 1 million random URLs (September 2023), 2 million URLs created in October 2023, and 1.3 million US keywords.
    - Only **1.74% of newly published pages reached the top 10 within a year** (5.7% in Ahrefs' 2017 study). A broader sample of non-empty English pages gave 6.11%.
    - The average #1 page is **about 5 years old**, and **72.9%** of top-10 pages are more than 3 years old.
    - Of the pages that did reach the top 10, **40.82% got there within a month**.
    - Ahrefs suggests updating content after about 6 months without a top-10 ranking.
    - Ahrefs sells SEO tools.

12. **Google Ads Help, "About Target CPA bidding."** https://support.google.com/google-ads/answer/2471188 [first-party; read 2026-10-05]
    - "For evaluation, we recommend you measure performance for the last 30 days, including at least 30 conversions." ("Conversions" are completed sign-ups, purchases or other target actions.)

13. **Meta Business Help Center, "About the learning phase."** https://www.facebook.com/business/help/112167992830700 [first-party; snippet-only: the page rendered empty]
    - According to search summaries, an ad set leaves the learning phase after about **50 optimisation events within 7 days**. Otherwise it is marked "Learning Limited".
    - Check this on the live page before quoting it.

14. **Chen, A., "The Law of Shitty Clickthroughs,"** April 2012. https://andrewchen.com/the-law-of-shitty-clickthroughs/ [practitioner; read 2026-10-05]
    - "Over time, all marketing strategies result in shitty clickthrough rates."
    - Example: HotWired banner ads had a **78%** click-through rate in 1994, against **0.05%** for Facebook ads in 2011.
    - Causes: novelty wears off, competitors copy, and scaling reaches less interested people.
    - So early results in a new channel can be better than the channel's long-run results.

### D. The case against: split attention, quitting late, misleading success stories

15. **Coviello, D., Ichino, A. & Persico, N., "Time Allocation and Task Juggling,"** *American Economic Review* 104(2):609–623, 2014. https://www.aeaweb.org/articles?id=10.1257/aer.104.2.609 ; empirical companion: "Don't Spread Yourself Too Thin: The Impact of Task Juggling on Workers' Speed of Job Completion," NBER w16502, 2010, https://www.nber.org/papers/w16502 [research; read 2026-10-05: both abstracts; data details snippet-only]
    - Working on "too many projects at the same time" lowers the output rate and lengthens completion time ("task juggling").
    - The NBER paper says juggling raises "the chances of low throughput, long duration of projects and exploding backlogs".
    - Data (per search summaries): **50,412 cases** at a Milan labour court, 2000–2005, assigned to **21 judges** by lottery. Judges pushed to work on more cases in parallel took longer to finish similar caseloads.
    - Setting: judges, not founders. It is the best causal evidence found on spreading effort across too many open projects.

16. **Gimeno, J., Folta, T. B., Cooper, A. C. & Woo, C. Y., "Survival of the Fittest? Entrepreneurial Human Capital and the Persistence of Underperforming Firms,"** *Administrative Science Quarterly* 42(4):750–783, 1997. doi:10.2307/2393656 [research; snippet-only]
    - Firms with the same economic performance can differ in whether they survive.
    - Survival depends on the owner's own threshold for "good enough", which reflects their other options and personal value, and not only on performance.

17. **DeTienne, D. R., Shepherd, D. A. & De Castro, J. O., "The Fallacy of 'Only the Strong Survive': The Effects of Extrinsic Motivation on the Persistence Decisions for Under-Performing Firms,"** *Journal of Business Venturing* 23(5), 2008 (SSRN 2007 version, doi:10.2139/ssrn.1019603). [research; read 2026-10-05: abstract via Crossref]
    - Underperforming firms "persist, often for long periods of time".
    - Seven factors outside performance are linked to keeping going, including personal sunk costs, personal opportunities and previous success.
    - In plain terms: owners keep weak projects alive for reasons other than results.

18. **Denrell, J., "Vicarious Learning, Undersampling of Failure, and the Myths of Management,"** *Organization Science* 14(3):227–243, 2003. doi:10.1287/orsc.14.2.227.15164 [research; read 2026-10-05: abstract via Crossref]
    - Firms we can observe are "the survivors of a selective process", and the business press focuses on successes, so failures are undersampled.
    - As a result, "risky practices, even if they are unrelated to performance in the full population ... may seem to be positively related to performance in a sample of survivors".
    - Observing survivors makes "practices that involve concentrated resource allocation" look better than diversified ones.
    - This cuts both ways. It inflates the "focus on one thing" stories and the "I tried 70 things" stories alike.

### E. Portfolios of whole projects (Vassallo, Levels, multi-app developers, Apple 4.3)

19. **Vassallo, D., "Only Intrinsic Motivation Lasts: Why I quit a $500K job at Amazon to work for myself,"** Medium, 10 February 2019. https://dvassallo.medium.com/only-intrinsic-motivation-lasts-92c0497cf97c [practitioner; read 2026-10-05: archived copy]
    - He left Amazon after 8 years. Pay went from "$75K in my first year" to "$511K by my last year".
    - The post is about motivation. It does not yet describe "small bets".

20. **Vassallo, D., posts on X** [practitioner; snippet-only: x.com returned 402]
    - 7 May 2020: "Don't build a product. Build a portfolio of small bets." https://twitter.com/dvassallo/status/1258518741106618368
    - 21 Dec 2020: "Small bets (high odds, low upside) can support more speculative bets (low odds, high upside)… But always take care of the downside." https://twitter.com/dvassallo/status/1341136885373042688
    - 4 Feb 2021: "Work with high intensity, for a short time, and not too often. Work on things that are very likely to pay off, even if the upside is small. Build on the easy wins… Do multiple things at the same time." https://twitter.com/dvassallo/status/1357219973790195715
    - 16 Apr 2025: he sold the Small Bets community to Gumroad for **$3.6M** (50% cash, 50% stock options; $900K paid then, $900K due in 12 months; he stays on to run it for 5 years). https://x.com/dvassallo/status/1912506861552869409
    - Other figures that circulate (books earning $126K and $244K, Small Bets "$1M in total revenue, $760,333 profit", "$2.4M+ from dozens of digital products") come from secondary pages and a course sales page, not from a page read for this note.
    - Note what his "bets" were. They were mostly info products and a paid community built on one large X/Twitter audience, so the bets shared one distribution channel.

21. **Levels, P., "12 startups in 12 months"** (started 1 March 2014). https://levels.io/12-startups-12-months/ [practitioner; read 2026-10-05]
    - 8 projects are listed (Play My Inbox, Go Fucking Do It, Tubelytics, NomadList, NomadJobs, GifBook, #nomads, Remote | OK).
    - The post gives almost no revenue data. Two later became his main businesses: Nomad List (#4) and Remote OK (#8).

22. **Levels, P., "List of all my projects ever."** https://levels.io/projects [practitioner; read 2026-10-05]
    - Lists **116 projects** from 1991 to 2026, each labelled by Levels himself.
    - Labels: Success 9 (8%), Okay 11 (10%), Failed 19 (16%), N/A (no profit goal) 71 (61%), New 6 (5%).
    - Of the 39 projects with a profit goal and a result, 9 (about 23%) are labelled "success".
    - Overall claim (September 2026): "$10M/y in revenue and investment gains". It is self-reported and mixes revenue with investment gains.
    - A widely quoted 2021 post, "Only 4 out of 70+ projects I ever did made money and grew… My hit rate is only about ~5%", was seen only in search summaries [snippet-only].

23. **Apple, App Review Guidelines, 4.3 "Spam" and 4.2.6.** https://developer.apple.com/app-store/review/guidelines/ [first-party; read 2026-10-05]
    - 4.3(a): "Don't create multiple Bundle IDs of the same app." For variants by city, team or university, submit one app and offer the variations through in-app purchase.
    - 4.3(b): "Don't submit apps that are indistinguishable from what's already widely available."
      - Dating, flashlight, sound effects, wallpaper, simple timers and fortune telling apps will not be accepted "unless they offer a meaningfully different or improved experience".
      - Apple "may remove these apps… if they are not updated, improved, or do not attract customers".
      - "Repeated submissions of this kind may lead to removal from the Apple Developer Program."
    - 4.2.6: apps made from a commercial template or app-generation service are rejected unless the content provider submits them.

24. **Indie "app portfolio" case posts** (Indie Hackers: a 30-app portfolio at $22K/month, apps at $185K/month, a 28-app portfolio). [practitioner; snippet-only: indiehackers.com returned 403]
    - All self-reported, with no denominators.
    - No independent data set was found on what share of a multi-app developer's revenue comes from their best app.

## What this means for a small team

1. **Run several cheap tests when a cheap test actually tells you something.**
   - The economic case for many small bets is real-options logic. A small payment buys information and the right to invest more later [1][2][3] [research].
   - It only works when early results predict later ones. Where a first test "reveals very little", small bets mislead [1][3] [research].
   - Paid ads and direct outreach give fast, readable signals.
   - SEO, brand and audience-building do not: Google says changes can take "several months" [10] [first-party], new pages rarely rank within a year [11] [vendor], and brand effects take more than 6 months (`research/brand-growth-channels.md`).

2. **More, smaller tests pay off when outcomes are very lopsided.**
   - At Bing the top 2% of ideas produced about 75% of gains, and testing 20% more ideas would have added about 17% productivity [4] [research].
   - The same paper says to discount small, marginal wins as probably luck [4] [research]. A test that ends "a bit positive" is not a reason to keep spending.

3. **Expect one channel to carry you, and plan to narrow down.**
   - Practitioners agree that one channel usually brings most growth: Thiel ("very likely that one channel is optimal") [6], Balfour ("70%+ of their growth from one channel") [7], Bullseye's inner ring [8], and Rachitsky's finding that no famous app used more than three early strategies [9] [practitioner].
   - None of these is backed by a systematic data set. Treat them as a working assumption, not a measured fact.

4. **Write the test window and kill rule before you start, sized to the channel.**
   - First-party minimums to borrow:
     - Google Ads: judge on the last 30 days with at least 30 conversions [12].
     - Meta: about 50 optimisation events in 7 days to leave learning [13] (snippet-only).
     - SEO changes: wait at least a few weeks before assessing; full effects can take months [10].
   - For apps, RevenueCat's median time to $1K a month (58 days, among apps that ever got there) is in `research/app-discovery-outside-stores.md` [6] [vendor].
   - The best-measured benefit of hypothesis-driven work is dropping bad ideas sooner (Camuffo trials, `research/startup-risk-and-opportunity.md`) [research].
   - The specific thresholds you pick are judgement. No study gives a universal "give it N weeks" figure.

5. **Cap how many tests run at once.**
   - Spreading effort over too many open projects slows every one of them [15] [research; judges, not founders].
   - Bullseye's "about three at a time" and Balfour's "one or two at a time" are practitioner versions of the same limit [7][8].
   - "Do multiple things at the same time" (Vassallo) [20] fits *small, finished* bets better than open-ended channels that need constant upkeep.

6. **Expect to quit too late, not too early.**
   - Owners keep weak ventures going for reasons unrelated to performance: sunk costs, few alternatives, past success [16][17] [research].
   - A written kill date protects against this.
   - The opposite risk is real for slow channels (point 1). Fix the window to the channel, not to your patience.

7. **Early wins fade.**
   - Click-through rates in any channel fall as it matures [14] [practitioner]. A channel that tested well can stop working, and Bullseye's advice is to work the winner "until it no longer works", then test again [8].
   - Re-run small tests on a schedule (for example quarterly) even after you have focused.

8. **When to switch from many bets to one.**
   - The evidence supports this sequence: test a few cheaply, then commit most effort to the one that clearly beats the rest. Committing is itself part of the strategy, because some options only pay off after you commit [5] [research (theory)].
   - The triggers below are [practitioner] and [rule-of-thumb]:
     - one channel brings most new users or revenue (Balfour's 70% [7]);
     - its cost per customer holds steady as spend rises;
     - the others still look marginal after their pre-set window.

9. **Discount every success story, on both sides.**
   - Survivor samples make both concentrated bets and scattered portfolios look better than they are [18] [research].
   - Levels' own list shows about 23% of his for-profit projects labelled a success, self-assessed [22]. Vassallo's bets shared one large audience [20].
   - Neither tells you the base rate for someone starting without an audience.

10. **Portfolios of near-identical apps carry a platform risk.**
    - Apple rejects copycat and template apps and duplicate Bundle IDs, may remove low-traction apps in crowded categories, and may remove repeat offenders from the developer program [23] [first-party].
    - An app "portfolio" has to be genuinely different apps, not reskins.

## Folklore and weak claims

- **"Google says SEO takes four months to a year."** This line used to be on Google's "Do you need an SEO?" page. The current page (updated 5 June 2026) no longer gives a timeframe. The current starter guide says "a few hours" to "several months", and suggests waiting "a few weeks" before assessing [10].
- **"70% of growth comes from one channel" / "one channel dominates".** These are repeated as laws, but Balfour gives no data [7], Thiel's version is a lecture assertion [6], and Bullseye has no published validation [8]. Rachitsky's sample covers only about 25 hits [9].
- **"Small bets lower risk."** This only holds when the bets are cheap *and* informative, and when their outcomes are not all tied to one shared asset. Vassallo's products all relied on one X audience [20]. The research supports the option logic [1][3][4], not the claim that small bets are always safer.
- **"Levels' hit rate is 5%."** That comes from a 2021 post seen only in search summaries. His current self-labelled list implies about 23% of for-profit projects are "success" and 51% count as success or "okay" [22]. Both figures are self-graded.
- **App-portfolio revenue claims** ("30 apps, $22K/month", "28 apps in 8 months") are self-reported with no denominator [24]. No data shows how revenue spreads across a typical indie developer's apps.
- **Camuffo replication revenue result.** `research/early-stage-gtm.md` §3 used to say the 2024 replication found no clear revenue effect; it now matches the corrected reading (a small positive pooled effect, about EUR 7,000, p = .030).

## Open questions

- **Bullseye has not been tested.** No study was found that tests the Bullseye method, or any "test N channels then focus" rule, against an alternative.
- **No time-to-traction data by channel.** No public data set shows, for small companies, how long each channel (SEO, community, outbound, paid, partnerships) typically takes to show a reliable signal. The only figures found are Ahrefs (SEO) [11], RevenueCat (app revenue milestones), and the ad platforms' learning thresholds [12][13].
- **No founder-level evidence on parallel versus sequential bets.** The task-juggling evidence comes from judges [15]. Hybrid-entrepreneur research (Raffiee & Feng) is about keeping a job, not about running several ventures. Portfolio and habitual entrepreneur studies (Westhead & Wright and others) were out of scope after the narrowing and were not read.
- **No measured share of revenue from the best app.** What share of a multi-app indie developer's revenue comes from their best app has no independent data. A store-level crawl (in the style of PlayDrone) grouped by developer account could answer it.
- **Unread primary sources.** McGrath 1999 [2] and Gimeno et al. 1997 [16] were seen only through search summaries. The Meta learning-phase page [13] should be re-read on the live site.
