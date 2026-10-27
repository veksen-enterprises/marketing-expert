# What counts as the "first screen", and can a tool extract it defensibly? (checked 2026-10-27)

Question: `audit_page` returns `leadText`, the first 600 characters of body text. Nav links, skip links and cookie text come first on many pages, so the "lead" is often a menu (the regression test in `test/regressions3.test.ts` pins one such real page: its leadText is nav links only). Teardown step 1 in `knowledge/landing-pages-and-cro.md` ("from the h1 and lead text") and the review prompt in `src/prompts.ts` read this field, and `analyze_copy` is run on it. This note asks: how fast do visitors decide to stay, how much attention stays on the first viewport, which viewport sizes to assume, and how a tool can drop header, nav and cookie text from plain HTML, and how often that would fail. It would change `leadText`, a possible `firstScreen` field in render mode, and teardown step 1.

Hop 0 (seed). Access: PDF and Markdown sources read with curl and pdftotext (marked `read`); pages the shell proxy blocked (nngroup.com, gs.statcounter.com, usenix.org, arxiv.org, chartbeat.com, adexchanger.com, academia.edu) seen only through WebFetch (marked `fetch summary`). Already in the repo and not redone: NN/g 2010 and 2018 fold eyetracking (`cro-landing-pages.md` §1, sources 3–4); Lindgaard 2006 50 ms appeal and Tuch 2012 (`design-and-marketing-in-crowded-markets.md` §3); 5-second test validity, Gronier 2016 and Kuric et al. 2024 (`positioning-messaging.md`, "5-second tests").

## Sources

1. Liu, C., White, R. W. & Dumais, S. (2010). "Understanding Web Browsing Behaviors through Weibull Analysis of Dwell Time." SIGIR 2010, Microsoft Research. https://www.microsoft.com/en-us/research/wp-content/uploads/2010/10/dwelltime.pdf [read 2026-10-27; full PDF] [research; browser-log study, 205,873 pages with ≥10,000 visits each; two weeks; one US English browser plug-in; opted-in users]
2. Nielsen, J. (2011-09-11). "How Long Do Users Stay on Web Pages?" NN/g. https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/ [read 2026-10-27; fetch summary] [practitioner; secondary reading of 1]
3. Fessenden, T. (2018-04-15). "Scrolling and Attention." NN/g. https://www.nngroup.com/articles/scrolling-and-attention/ [read 2026-10-27; fetch summary; already read in full in cro-landing-pages.md source 4] [practitioner; eyetracking, 120 participants, 1920×1080 desktop screen]
4. Chartbeat (Haile, T.), "4 Myths About the Web", 2014-03-10. https://chartbeat.com/resources/press/4-myths-web-ceo-tony-haile/ [read 2026-10-27; fetch summary] [vendor; media article pages; no sample stated for the fold figure]
5. Google viewability benchmark, Dec 2014, as reported by AdExchanger, "Google Viewability Benchmark: More Than Half Of All Ads Aren't Seen", 2014-12-03. https://adexchanger.com/data-exchanges/google-viewability-benchmark-more-than-half-of-all-ads-arent-seen [read 2026-10-27; fetch summary; secondary report of a first-party study] [first-party via press; Google ad platforms, June–July 2014; ads, not page content]
6. Grusky, M., Jahani, J., Schwartz, J., Valente, D., Artzi, Y. & Naaman, M. (2017). "Modeling Sub-Document Attention Using Viewport Time." CHI 2017. doi:10.1145/3025453.3025916. https://www.academia.edu/93255811/Modeling_Sub_Document_Attention_Using_Viewport_Time [read 2026-10-27; fetch summary] [research; 1.2M news reading sessions; one publisher type]
7. StatCounter Global Stats, "Desktop vs Mobile vs Tablet Market Share Worldwide", September 2026. https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet [read 2026-10-27; fetch summary] [vendor; page views on sites using StatCounter, "over 3 billion monthly page views"]
8. StatCounter Global Stats, "Mobile Screen Resolution Stats Worldwide", September 2026. https://gs.statcounter.com/screen-resolution-stats/mobile/worldwide [read 2026-10-27; fetch summary] [vendor; screen size, not browser viewport]
9. StatCounter Global Stats, "Desktop Screen Resolution Stats Worldwide", September 2026. https://gs.statcounter.com/screen-resolution-stats/desktop/worldwide [read 2026-10-27; fetch summary] [vendor; screen size, not browser viewport]
10. Lighthouse source, `core/config/constants.js` (screen emulation settings), main branch. https://raw.githubusercontent.com/GoogleChrome/lighthouse/main/core/config/constants.js [read 2026-10-27] [first-party; Google's default test devices]
11. Playwright 1.48.2 package, `lib/server/deviceDescriptorsSource.json` and `lib/server/browserContext.js` (from the npm tarball). [read 2026-10-27] [first-party; device presets and default viewport]
12. HTTP Archive, Web Almanac 2024, "Accessibility" chapter, section "Landmarks" (source Markdown). https://raw.githubusercontent.com/HTTPArchive/almanac.httparchive.org/main/src/content/en/2024/accessibility.md [read 2026-10-27] [research-grade measurement; HTTP Archive crawl of home pages; desktop table]
13. HTTP Archive, Web Almanac 2024, "Privacy" chapter, section "Consent dialogs" (source Markdown). https://raw.githubusercontent.com/HTTPArchive/almanac.httparchive.org/main/src/content/en/2024/privacy.md [read 2026-10-27] [research-grade measurement; US-based crawl]
14. Bouhoula, A., Kubicek, K., Zac, A., Cotrini, C. & Basin, D. (2024). "Automated Large-Scale Analysis of Cookie Notice Compliance." USENIX Security 2024. https://usenix.org/system/files/usenixsecurity24-bouhoula.pdf [read 2026-10-27; fetch summary] [research; 97,090 sites listed, 85,443 crawled; German datacenter IPs; detector checked on 500 sites]
15. Rasaii, A. et al. (2023). "Exploring the Cookieverse: A Multi-Perspective Analysis of Web Cookies." arXiv:2310.01108. https://arxiv.org/abs/2310.01108 [read 2026-10-27; fetch summary; abstract only] [research; 45k sites, several vantage points]
16. EasyList Cookie list, `easylist_cookie/easylist_cookie_general_hide.txt`, master branch. https://raw.githubusercontent.com/easylist/easylist/master/easylist_cookie/easylist_cookie_general_hide.txt [read 2026-10-27; counted lines and searched for common consent tools] [community filter list; licence GPLv3 or CC BY-SA 3.0 per the EasyList project, not re-checked here]

Not fetched: NN/g "The Fold Manifesto" (nngroup.com rate-limited WebFetch twice; the shell proxy blocks the site), so its figures are not used. Lagun & Lalmas (2016), "Understanding User Attention and Engagement in Online News Reading", WSDM, doi:10.1145/2835776.2835833: no open copy reached (OpenAlex blocked; the anthology page has no abstract). WebAIM Million (blocked at the proxy). No study of attention by position on mobile landing pages was found.

## 1. How fast visitors decide

- Across 205,873 pages, the dwell-time curve fit a Weibull with shape below 1 on 98.5% of pages. That means the chance of leaving is highest at the start and falls the longer someone stays. The authors call it "screen-and-glean": visitors skim first, then read. [research, 1, read; desktop browser logs, 2010]
- On 80% of pages the fitted scale (a typical dwell) was 70 seconds or less. [research, 1, read]
- The screening was harsher on less entertaining categories (education, for example) than on fun ones. [research, 1, read; categories from a proprietary classifier]
- The widely quoted "first 10 seconds are critical" and "99% of pages" are NN/g's reading of this paper, not the paper's words. The paper says 98.5%, gives no 10-second cut-off, and the text read here does not state "2 billion dwell times". [practitioner, 2, fetch summary; checked against 1]
- What the paper does not show: what visitors look at during the screen, or whether it is the first viewport. It measures time on page from logs, nothing on screen. Pages are any page with 10,000+ visits, not landing pages. [derived from 1]
- First-impression speed (50 ms appeal ratings) is already in `design-and-marketing-in-crowded-markets.md` §3. Those are ratings, not stay-or-leave behaviour (`design-quality-outcomes.md`). [cited, not redone]

## 2. How much attention the first screen gets

- Desktop eyetracking: 57% of viewing time above the fold and 74% in the first two screenfuls, on a 1920×1080 screen, in 2018 (80% above the fold in 2010). The author cannot separate bigger screens from design changes, and page length was not controlled. No mobile figures. [practitioner, 3, fetch summary; 120 participants]
- A vendor counter-claim: "66% of attention on a normal media page is spent below the fold." No sample or method is given for this figure, and it is about news articles, where reading the body is the point. [vendor, 4, fetch summary]
- Ads: above-the-fold ads were 68% viewable, below-the-fold 40%, across Google's ad platforms (viewable = half the ad on screen for one second). Ads "directly above the fold" scored higher than ads at the very top. This measures whether something was on screen, not whether it was read. [first-party via press, 5, fetch summary; 2014]
- Viewport-time research models attention within the screen as a bell curve around the middle (mean 49.2% down the viewport, SD 20.1%), taken from earlier eyetracking. So the very top strip of a screen, where nav sits, gets less gaze than the middle. [research, 6, fetch summary; news reading; parameters borrowed, not measured]
- Taken together: the first screen still gets the largest single share of attention on desktop, but well under all of it, and no study read here sizes it on phones. Sizing "the fold's share today" for landing pages on mobile remains open. [derived from 3–6]

## 3. Which viewport sizes to assume

- Traffic share, September 2026: mobile 59%, desktop 39%, tablet 2% of page views on StatCounter sites. [vendor, 7, fetch summary]
- Top mobile screen sizes (CSS pixels): 414×896 (13.4%), 360×800 (7.5%), 384×832 (7.1%), 390×844 (6.1%), 393×873 (4.2%), 360×780 (3.4%). [vendor, 8, fetch summary]
- Top desktop screen sizes: 1920×1080 (28.1%), 1536×864 (10.0%), 1366×768 (8.0%), 1280×720 (4.7%), 2560×1440 (4.0%). [vendor, 9, fetch summary]
- These are screen sizes. The visible page area is smaller: the browser's address bar, tabs and, on phones, the bottom toolbar take height. Playwright's presets subtract this: iPhone 13 and 14 have a 390×844 screen but a 390×664 viewport; Pixel 7 is 412×915 screen, 412×839 viewport. [first-party, 11, read]
- Google's own defaults: Lighthouse tests mobile at 412×823 and desktop at 1350×940. [first-party, 10, read]
- Render mode today uses Playwright's default viewport, 1280×720, because `renderAndAudit` sets none. [first-party, 11, read; checked against `src/lib/pageAudit.ts` `newPage` call]
- A defensible pair, and why:
  - **Phone 390×664.** Playwright's iPhone 13/14 preset. Its 390 width sits in the middle of the common widths (360–414), and 664 is the shortest common visible height among the presets checked, so text inside it is on screen for most phones. [derived from 8, 11]
  - **Laptop 1280×720.** Playwright's default and a top-4 desktop screen size. It is smaller than the visible area of the 1366×768 and 1536×864 screens after browser bars (estimate; browser bar heights not measured here), so it errs toward "not on the first screen". [derived from 9, 11]
  - Lighthouse's sizes (412×823, 1350×940) are the alternative if matching Google's tools matters more than being conservative. Both are taller, so they put more on the "first screen". [first-party, 10]

## 4. Dropping header, nav and cookie text from plain HTML

- Landmarks on home pages (desktop, element or ARIA role): `<header>` or `role="banner"` 66%, `<nav>` or `role="navigation"` 70%, `<main>` or `role="main"` 44%, `<footer>` 67%. [research-grade, 12, read; HTTP Archive 2024]
- So a rule "skip `<nav>` and `<header>`" finds nothing to skip on about a third of home pages (34% lack a header landmark, 30% lack a nav landmark), and a rule "start at `<main>`" fails on 56%. [derived from 12]
- A second failure: many sites put the hero h1 inside the site `<header>`. The HTML spec treats a `<header>` as the page banner only when it is not inside `<article>`, `<aside>`, `<main>`, `<nav>` or `<section>`; nothing stops a site from putting its main promise in it. Dropping every `<header>` would drop the h1 on those pages. How often this happens was not measured. [derived; spec rule from memory, not re-read this session]
- Skip links ("Skip to content") appear on about 24% of pages; they are usually the very first text in the body. [research-grade, 12, read]
- Cookie notices: from German IPs, a notice was detected on 48,843 of 85,443 crawled sites (about 57%). The best detector in that study used EasyList Cookie selectors plus "any element with a positive z-index", then a check for the word "cookie" in a sentence with a verb. It found 86.9% of notices (precision 100%) on 500 hand-checked sites; two earlier detectors found 78.2% and 48.1%. [research, 14, fetch summary]
- From a US crawl, IAB consent frameworks showed on only 5.8% of home pages, and the authors note consent banners are often not shown to non-EU visitors. A tool fetching from a US or datacenter address will often get no banner at all, while EU visitors do. [research-grade, 13, read]
- Cookie walls (a page blocked until you accept) were on 0.6% of 45k sites overall, but 8.5% of the top 1,000 German sites. [research, 15, fetch summary; abstract]
- The EasyList Cookie "general hide" list has 15,268 selectors, including the ids of the common tools: `#onetrust-banner-sdk`, `#onetrust-consent-sdk`, `#CybotCookiebotDialogBodyUnderlay`, `#cmplz-cookiebanner-container`, `#didomi-notice`, `.cookie-law-info-bar`, `.qc-cmp-ui-container`. [community list, 16, read]
- Many consent tools inject their banner with JavaScript, so in plain server HTML the banner text is often absent anyway; the cookie text that does appear is usually in the footer, which a 600-character lead never reaches. Not measured here. [derived; unverified]

## What this changes

1. **`leadText`: skip obvious chrome before taking the 600 characters.** Input: the parsed body. Rule, in order:
   - Drop `<nav>`, `[role=navigation]`, skip links (an `<a href="#...">` as the first link whose text matches "skip"), and elements matching a short list of consent-tool ids and classes taken from source 16 (the seven above plus `[id*=cookie i]`/`[class*=cookie i]` only when the element has no `<h1>`).
   - Drop `<header>` and `[role=banner]` only when they do not contain an `<h1>`.
   - If an `<h1>` exists, start `leadText` at the `<h1>` instead of the body start. This one rule fixes the nav-first case even on the third of pages with no landmarks.
   - Output: `leadText`, plus a `leadTextSource` note: "from the h1", "after skipping nav/header/consent markup", or "from the start of the body: no h1 and no landmarks, so menu or banner text may be included". The test from `regressions3.test.ts` is the failing case to start from.
   - Threshold source: none needed; the rule is structural. Evidence grade for "landmarks are missing on about a third of pages": HTTP Archive measurement [12]. What it cannot see: text placed visually first by CSS, banners injected by JavaScript, and h1s that aren't the promise (logos marked as h1). It must say so in the note.
2. **Render mode: add `firstScreen` at two sizes.** Input: the rendered page at 390×664 (phone) and 1280×720 (laptop). Rule: collect visible text nodes and links/buttons whose bounding box top is inside the viewport height; list separately any `position: fixed` or `sticky` element covering more than, say, 25% of the viewport (the 25% is this note's choice, not from evidence) as "overlay: may hide the first screen". Output per size: h1 (on screen yes/no), first-screen text, CTAs on screen, overlays. Flag only facts: "At 390×664 the h1 is below the first screen" or "No call to action is on the first screen at 390×664". Tag in tool notes: the attention claim is [practitioner, NN/g desktop eyetracking]; the sizes are [first-party presets; vendor screen shares].
   - Must say: fetched from a non-EU address, so cookie banners EU visitors see may be missing; one phone and one laptop size only; does not judge whether the message is clear, only where it sits.
3. **Teardown step 1** (`knowledge/landing-pages-and-cro.md`, and step 1 in `src/prompts.ts`): change "from the h1 and lead text" to "from the h1 and the first-screen text (render mode) or lead text". Add that the agent should check the phone size first, since mobile is about 59% of page views [vendor, 7]. Clarity itself stays a human check: point to a 5-second test with strangers, per the design stance.
4. **Playbook tag:** the fold line in `landing-pages-and-cro.md` cites NN/g without a per-line tag; the section heading carries [practitioner, NN/g], which is correct. Add "desktop only; no mobile figures" inside it. No tag change for Liu et al.; if the "visitors decide within 10 seconds" idea is ever used, cite it as [research; desktop browser logs, 2010] and drop "10 seconds", which the paper does not state.
5. **What the evidence does not support:** a threshold like "h1 must be in the top N pixels" or "users leave after N seconds". Nothing read here ties a position or time to conversions on landing pages.

## Open questions

- How often is the h1 inside the site `<header>`, and how often is the h1 a logo? Measure on a sample of home pages (HTTP Archive or the eval cases) before choosing the header rule.
- Is there any mobile eyetracking or scroll-depth study for landing pages with a stated sample? Lagun & Lalmas (2016) covers mobile news reading but was not reached.
- Do landing pages with the CTA on the first phone screen convert better, in any controlled study? Only vendor A/B stories are known to the repo.
- EasyList's licence (GPLv3 or CC BY-SA) may not suit copying selectors into this repo; a handful of tool ids is likely fine as facts, but this was not checked.
- Visible viewport heights for the top StatCounter phones (414×896, 360×800) in Safari and Chrome were not measured; 664 px is a preset, not a field measure.
