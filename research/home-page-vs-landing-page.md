# How should a home page be judged differently from a single-purpose landing page? (checked 2026-10-27)

Question: `landing_page_teardown` (src/prompts.ts) and the teardown checklist in `knowledge/landing-pages-and-cro.md` treat every page as a landing page with one goal: "is there one primary action", "message match with the traffic source". A home page serves several audiences, returning users, people who typed the brand name, and people routing to a deeper page. Does the evidence say home pages fail on different things, so they need a separate checklist or a home-page branch? Does "one goal per page" apply to them? Which `audit_page` outputs or flags would change (page type, nav labels, hidden navigation, a lead text without the menu)?

Hop 0 (seed). Access: every page below was seen only through WebFetch, which returns a model's summary and chosen quotes, so figures are the tool's and one level weaker than a read. Direct downloads with curl were refused by the proxy (403 on CONNECT) for nngroup.com, plausible.io, wiredimpact.com and archives.iw3c2.org. Already in the repo and cited, not repeated: "one goal / remove navigation" is [practitioner] and single navigation-removal tests are [anecdote] (`research/cro-landing-pages.md` §7); choice overload averages about zero, with four moderators (`research/behavioral-science.md` items 9–10); the 5-second test as a cheap human check (`research/design-and-marketing-in-crowded-markets.md`, "5-second test").

## Sources

1. Nielsen, J. (2002). "Top 10 Guidelines for Homepage Usability." NN/g, 11 May 2002. https://www.nngroup.com/articles/top-ten-guidelines-for-homepage-usability/ [read 2026-10-27; fetch summary] [practitioner; expert guidelines, no method stated]
2. Wang, H.-H. (2024). "Homepage Design: 5 Fundamental Principles." NN/g, 15 Mar 2024. https://nngroup.com/articles/homepage-design-principles/ [read 2026-10-27; fetch summary] [practitioner; no sample or method given]
3. Nielsen, J. & Tahir, M. (2001). *Homepage Usability: 50 Websites Deconstructed.* New Riders. Seen through two summaries: Computerworld (Australia), https://www2.computerworld.com.au/article/print/27496/homepage_usability_provides_data_successful_sites/ and Danny Yee's review, https://dannyreviews.com/h/Homepage_Usability.html [read 2026-10-27; fetch summary; secondary; book not read] [practitioner; expert review of 50 large corporate and media sites; counts describe what sites did, not what users did]
4. Pernice, K. & Budiu, R. (2016). "Hamburger Menus and Hidden Navigation Hurt UX Metrics." NN/g, 26 Jun 2016. https://www.nngroup.com/articles/hamburger-menus/ [read 2026-10-27; fetch summary] [practitioner research; quantitative usability test, n=179, 6 live sites (news, music, grocery), 2 tasks per site per device]
5. Pernice, K. & Budiu, R. (2016). "Beyond the Hamburger: How to Make Navigation Discoverable on Desktops" and the mobile companion, NN/g, 24 Jul 2016. https://www.nngroup.com/articles/find-navigation-desktop-not-hamburger/ , https://www.nngroup.com/articles/find-navigation-mobile-even-hamburger/ [read 2026-10-27; fetch summary] [practitioner research; same study as 4, per-site results]
6. Sherwin, K. (2015). "Audience-Based Navigation: 5 Reasons to Avoid It." NN/g, 7 Sep 2015. https://www.nngroup.com/articles/audience-based-navigation/ [read 2026-10-27; fetch summary] [practitioner; no study design or numbers]
7. Richardson, C. (2014). "'Hey, you there': the trouble with audience-based navigation." Inside GOV.UK blog, 18 Jul 2014. https://insidegovuk.blog.gov.uk/2014/07/18/hey-you-there-the-trouble-with-audience-based-navigation/ [read 2026-10-27; fetch summary] [practitioner; qualitative prototype testing at three UK government bodies, no counts]
8. Sauro, J. (2013, updated 2017). "The Importance of the First Choice in Website Navigation." MeasuringU. https://measuringu.com/first-choice/ [read 2026-10-27; fetch summary] [practitioner research; 5 sites, 21 tasks, 750 users; plus 8 tree tests, 137 tasks, over 1,000 users; reports Bailey's 2007–2009 government-site figures second-hand]
9. Sauro, J., Schiavone, W., Du, D. & Lewis, J. (2023). "Do Click Tests Predict Live Site Clicks?" MeasuringU, 21 Mar 2023. https://measuringu.com/do-click-tests-predict-live-site-clicks/ [read 2026-10-27; fetch summary] [practitioner research; randomized, n=130 (68 live, 62 screenshot), 5 home pages, 5 tasks; US panel]
10. Wired Impact (2026). "2025 Nonprofit Website Benchmarks." https://wiredimpact.com/nonprofit-website-benchmarks/ [read 2026-10-27; fetch summary; page last modified 6 May 2026] [vendor; Google Analytics of the agency's own client sites, over 130 small nonprofit sites, median about 782 sessions a month, calendar 2025]
11. Marshall, S. (2013). "Homepage analytics: is your publication a front door or side door site?" Journalism.co.uk, 17 Oct 2013. https://www.journalism.co.uk/homepage-analytics-is-your-publication-a-front-door-or-side-door-site/ [read 2026-10-27; fetch summary] [secondary; news sites only; Chartbeat figures reported second-hand]
12. Runyon, E. (2013). "Carousel Interaction Stats." Jan 2013. https://erikrunyon.com/2013/01/carousel-stats/ [read 2026-10-27; fetch summary] [practitioner; analytics from Notre Dame university sites, mid-Oct 2012 to 22 Jan 2013; one organisation]
13. Google Search Central, "Sitelinks." https://developers.google.com/search/docs/appearance/sitelinks [read 2026-10-27; fetch summary] [first-party]
14. Google Ads Help, "About landing page experience" (answer 2404197). https://support.google.com/google-ads/answer/2404197 [read 2026-10-27; fetch summary] [first-party]
15. NextAfter, Experiment #49906, "How minimized navigation and design affects conversion" (Compassion International), Feb 2021. https://www.nextafter.com/experiments/how-minimized-navigation-and-design-affects-conversion/ [read 2026-10-27; fetch summary] [vendor; A/B anecdote; one nonprofit, n=11,169]
16. Clean Commit, "Directing ads traffic to the homepage boosts conversions and revenue." https://cleancommit.io/ab-tests/directing-ads-traffic-to-the-homepage-boosts-conversions-and-revenue [read 2026-10-27; fetch summary] [vendor; A/B anecdote; one Shopify store; no sample size, rates or significance given]
17. Abouelatta, A. (2026). "What Are Companies A/B Testing In Landing-Page Navigation Right Now?" Lazyweb Research, 7 Jul 2026. https://www.lazyweb.com/research/what-companies-ab-test-nav-landing-pages [read 2026-10-27; fetch summary] [vendor; observed test diffs labelled by an LLM; impact is a model score, not measured lift]
18. Montti, R. (2019). "Home Page to Deep Link Ratio." Search Engine Journal, 16 Jul 2019. https://www.searchenginejournal.com/home-page-deep-link-ratio/316779/ [read 2026-10-27; fetch summary] [practitioner; no sample or numbers]
19. Kumar, R. & Tomkins, A. (2010). "A characterization of online browsing behavior." WWW 2010. https://archives.iw3c2.org/www2010/proceedings/www/p561.pdf [read 2026-10-27; fetch summary] [research; Yahoo toolbar logs, one week of March 2009]

Not fetched: Plausible's public dashboards (proxy refused; they would have given entry-page shares for a few small sites); the full Nielsen & Tahir book; Blackmon, Kitajima & Polson (2005, CHI) on predicting navigation problems from link labels (only the Crossref record was reached, no abstract); VWO's "removing navigation increased conversions by 100%" case (title seen in search only [snippet-only]; it is the kind of anecdote `cro-landing-pages.md` §7 already tags).

## 1. What a home page is for: routing, not one action

- Nielsen's 2002 list asks a home page to state what the site does in one sentence, to "emphasize the site's top high-priority tasks" with entry points for "the main one to four tasks", to group company information under About, to show real content, and to start link names with the most important word. "Links are the homepage's action items." [practitioner, 1]
- The 2024 NN/g update: "The homepage is the most important routing page on a website." Keep primary navigation visible, use specific link labels, and prioritise top tasks, because "if everything is emphasized, nothing stands out." Generic labels ("Click Here", "Explore", "Learn More") fail. [practitioner, 2]
- NN/g's 2024 good example for several audiences puts calls to action under "For Job Seekers" and "For Businesses". [practitioner, 2] So NN/g's own home-page advice expects several calls to action, one per top task, with a visual order among them.
- In the 2001 review of 50 large home pages, more than half offered a log-in on the home page, 84% linked to About and 74% had an explicit link for job seekers. [practitioner, 3; counts of what big sites did in 2001, not of what worked]
- Neither NN/g home-page article discusses landing pages, and none of the sources tests a home page against the "one goal" rule. [1, 2]

Reading: the standard home-page guidance already has several actions built in. "One primary goal per page" comes from paid-traffic landing pages (`cro-landing-pages.md` §7, [practitioner]). No source here applies it to home pages, and the home-page sources advise against it. What carries over is the order of emphasis: one action should look primary for the main audience. [derived from 1, 2]

## 2. Who lands on a home page, and how many

- Small sites: across over 130 small nonprofit sites (median about 782 sessions a month), "38% of visitors enter through the homepage" in 2025. Whether this is a median or a pooled share, and of sessions or entrances, is not stated. [vendor, 10; one agency's clients]
- News sites (2013): front-door shares vary widely. Chartbeat put direct traffic at about 50% on average, "ranging from 5 per cent to 90 per cent", and its analyst called the average "radically biased" toward the largest domains. 80% of homepage-direct visitors returned within a week. [secondary, 11; news only, old]
- Nielsen (2002): many users arrive via deep links but often visit the home page next. No number is given. [practitioner, 1]
- No source found gives the home page's share of entrances for small software or service sites. The widely repeated "home page links should be 30–50%" is a blogger's figure with no study behind it. [practitioner, 18]
- Typed or bookmarked starts were about 34% of pageviews in a 2009 toolbar sample, but the paper does not say how many of those were home pages. [research, 19]
- Branded searches: Google shows sitelinks under a result "when we think they'll be useful", chosen from "the link structure of your site"; it advises informative titles, a logical structure, and concise internal anchor text. [first-party, 13] So a person who searches the brand name sees the home page plus links Google picked from the site's own links. Google publishes no share of brand searches that land on the home page.

Reading: on a small site a large minority of visits, perhaps a third or more, start at the home page, and many of those already know the name (direct, bookmarks, brand search, returning users). That is a different crowd from a paid landing page's visitors, who arrive from one promise. [derived; the 38% is one vendor's sample]

## 3. Measured: hidden navigation is used less and slows tasks

- Desktop, 179 users, 6 sites: navigation was used 27% of the time when hidden behind a menu icon, 48% when visible, 50% when partly visible. Content discoverability was over 20% lower and task time at least 39% slower with hidden navigation. Mobile: 57% hidden vs 86% partly visible; tasks 15% slower; visible-only was not tested on mobile. [practitioner research, 4; navigation-use differences significant; time-to-navigation only marginally (p<0.1)]
- Per site, the spread was wide: on desktop, navigation use ranged from 17% (Slate, a tiny low-contrast menu) to the highest at a grocery site, which had 95% task success. The authors: "Usability guidelines are always circumstantial." [practitioner research, 5]
- The sites were news, music and grocery sites, not small product sites. [4, 5]

This is the one measured finding here that is about the home page's routing job and that an HTML render could detect (a desktop render with no visible menu links).

## 4. Several audiences: topics and tasks beat audience labels

- NN/g: audience-based navigation makes users guess which group they belong to, and they may fear another group gets a better deal. It works "when the content is unique to that audience group". Prefer topics and tasks; put audience entry points in secondary navigation; write labels as "For …". [practitioner, 6; no numbers]
- GOV.UK prototype testing: people misread audience labels ("professionals"), skipped content labelled for someone else, and approached services "based on the task they need to complete; not on their job description". GDS chose topic labels. [practitioner, 7; qualitative, no counts]
- Both sources are about navigation structure, not conversion. Neither measured sales or sign-ups. [6, 7]

Reading: "can each audience find its path" is a fair home-page question, but the answer should be checked by task ("find pricing for a team of 10", "see if it works with X"), not by whether an audience tab exists. [derived from 6, 7]

## 5. Cheap human check for routing: the first-click test

- Bailey's government-site studies (2007–2009, reported second-hand): users whose first click was on the right path succeeded 87% of the time, 46% when it was not. [practitioner research, 8; via Sauro]
- Sauro's replication on 5 commercial sites (750 users, 21 tasks) found a much weaker link: 78% vs 70%. In tree tests with no search (over 1,000 users, 137 tasks): 80% vs 14%. [practitioner research, 8] So the first click matters most when the menu is the only way in.
- A first-click test on a home-page screenshot matched first clicks on the live page closely: average absolute difference about 5–7% across hotspots on 5 home pages; the largest gaps came from hover menus. n=130. The authors call this "likely a best-case scenario". [practitioner research, 9; randomized; simple, static pages]

This gives the home page its own cheap human check, next to the 5-second test: show the home page to 5 strangers, give one task per audience, and record where each clicks first. It fits the owner's design stance (the tool points to the check; people do it).

## 6. Carousels, a home-page pattern

- On Notre Dame's main site about 1% of visitors clicked a featured item, and 84% of those clicks were on the first position. Three static carousels on other university sites: 1.7–2.3%, with 48–62% on the first slot. One auto-forwarding carousel: 8.8%, 40% on the first slot. [practitioner, 12; one university, 2012–2013]
- NN/g (2024) advises minimal motion and no autoplay. [practitioner, 2]

Too thin for a flag: one organisation, and one auto-forwarding carousel did better than the static ones.

## 7. Is "one goal" or "send ads to a dedicated page" right? Mixed anecdotes

- A nonprofit landing page test: the variant with the site's general design and reduced navigation converted 0.84% vs 1.3% for the stripped-down original (−37%, 98.8% confidence, n=11,169), but +236% on desktop. Design changed too, so it does not isolate navigation. [vendor; A/B anecdote, 15]
- A Shopify store sent half its hockey-ad traffic to the home page instead of the hockey landing page; the agency reports +104% conversion rate and +138% revenue per visitor, with higher bounce. No sample size, rates or significance. [vendor; A/B anecdote, 16]
- Across about 135 observed web tests that touched landing-page navigation, the common change was removing items; outcomes are a model's 1–5 score, not measured lift. [vendor, 17]
- Google Ads scores "landing page experience" as "How relevant and useful your landing page is to people who click your ad", relative to other advertisers. The page gives no advice on home page vs dedicated page. [first-party, 14]

Reading: there is no general evidence that a dedicated, navigation-free page beats the home page for ad traffic, or the reverse. Single tests point both ways. Keep "one goal" as a [practitioner] default for paid campaign pages only, and say to test. [derived from 15–17 and `cro-landing-pages.md` §7]

## Answer to the question

Home pages fail on partly different things. Shared with landing pages: the one-sentence "what is it" (Nielsen's tagline = the 5-second read), speed, proof. Different: routing for 1–4 top tasks, link and menu labels, visible navigation, a path for returning users (log-in), and About/contact. Not applicable: "one primary goal" and message match to one traffic source (most home-page visitors come direct, by brand search or from other pages). The evidence is mostly [practitioner] guidance; one quantitative usability study (hidden navigation) and one validated cheap test (first click) are the strongest parts. That supports one checklist with a home-page branch of a few items, not a separate long checklist.

## What this changes

1. **`landing_page_teardown`: a home-page branch.** If the URL path is `/` (or a bare locale root like `/en/`), or the user says it is the home page, replace step 2 (message match) and step 4 (one primary action) with:
   - "Top tasks: name the 1–4 things most visitors come to do (from the profile, analytics or the menu). For each, quote the link or button that starts it on the first screen, and say whether its label names what is behind it." [practitioner, 1, 2]
   - "Navigation: quote the menu labels. Flag generic ones ('Learn more', 'Explore', 'Solutions' with no hint of what's inside). Is the menu visible on desktop or only behind a menu icon?" [practitioner research, 4 for visibility; practitioner, 2 for labels]
   - "Returning users: if the product has accounts, is 'Log in' visible?" [practitioner, 3]
   - "Several actions are expected here. Check that one looks primary for the main audience; don't recommend removing navigation." [practitioner, 1, 2]
   - In the "smaller check" line: "For a home page, a first-click test: show a screenshot to 5 people, give one task per audience, note where they click first." [practitioner research, 8, 9]
   Evidence grade: practitioner guidance plus one quantitative usability study. The prompt must not present these as conversion effects; none of the sources measured conversion.

2. **`audit_page`: a page-type field and two outputs, no new verdicts.**
   - `pageKind: "home" | "other"`: input the final URL; rule: path is `/`, `/index.html`, or one segment that is a language code (`/en/`, `/fr-ca/`). Output the field only. It cannot know whether a deeper page is the real campaign page; say so in the field's description.
   - `navLabels`: text of links inside `<nav>`, `[role=navigation]` and `<header>` (first 30). Lets the teardown quote menu labels without reading HTML.
   - `leadText` today is the first 600 characters of body text with the menu included, so on a home page it often starts "Home Products Pricing Log in". Add `leadTextNoNav` (same rule, skipping `<nav>`, `[role=navigation]` and `<header>` link text), and point the prompt's 5-second step at it. This is a measurement fix, not an evidence claim; a test can be built from any page with a menu.
   - Flag (info), only when a generic label is in `navLabels` or in `ctaCandidates`: `Link label "Learn more" doesn't say what's behind it; on a home page, labels are how visitors pick a path (NN/g guidance, not a measured effect).` List: "click here", "learn more", "read more", "explore", "more", the labels NN/g names [2]. Grade: [practitioner].
   - Flag (info), render mode only, at a desktop viewport (1280 px wide): `pageKind` is home and no link inside `<nav>`/`[role=navigation]`/`<header>` is visible, but a menu button is (`aria-expanded`, `aria-controls`, or a button whose label is "Menu"). Text: `At desktop width the main menu is hidden behind a button. In one usability study (179 users, 6 news/retail sites) hidden menus were used 27% of the time vs 48–50% for visible ones, and tasks took longer. Not a conversion measure; check with a first-click test.` Without render mode, the audit must say "menu visibility not checked: needs render mode", because CSS decides visibility. Grade: [practitioner research; n=179; 6 sites; not small sites].
   - Do **not** add a "too many calls to action" flag for home pages. None exists today (the only CTA flag is "no CTA found", which still applies). If one is ever added for landing pages, gate it off when `pageKind` is home, citing §1.

3. **`knowledge/landing-pages-and-cro.md`.** In "Practitioner consensus", change "One primary goal per page: for paid traffic…" to add: "It doesn't apply to a home page, whose job is to route visitors to their 1–4 main tasks; there, check that one action looks primary and that each audience's path is labelled [practitioner]. Single tests point both ways on sending ads to the home page instead of a dedicated page [vendor; A/B anecdote]: test it." Add to the teardown checklist a home-page line with the three branch items and the first-click test. Tags of existing lines stay as they are.

4. **Changes nothing:** carousel flags (one organisation, mixed direction, §6); a "share of visits landing on the home page" number in any playbook (one vendor sample, §2).

## Open questions

- Home page share of entrances for small software and service sites (not nonprofits, not news). Public Plausible or similar analytics dashboards would give a few real cases with a denominator; they were not reachable from this sandbox.
- Is there any controlled study (not a single A/B case) of home page vs dedicated page as an ad destination?
- Does Blackmon, Kitajima & Polson (2005) give a label-level rule (unfamiliar words, competing headings) that a tool could check deterministically? Only the record was reached.
- Does hidden navigation hurt as much on small sites with five menu items as on the news and retail sites NN/g tested?
- How often does a small product's home page get returning, logged-in users vs new visitors? No source found.
