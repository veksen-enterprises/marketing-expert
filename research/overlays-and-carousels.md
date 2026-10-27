# What do overlays on arrival and hero carousels do to a page, and what does Google say about them? (checked 2026-10-27)

Question: Pages often open with something on top of the content: a cookie banner, a newsletter or discount popup, a chat widget, an app-install interstitial. Many home pages also lead with a rotating carousel (slider). Is there first-party policy or measured evidence strong enough to justify a deterministic flag in `audit_page` (render mode: a fixed or modal element covering more than X% of the first viewport at load, reporting what it is; plain HTML: carousel detection), and a line in the Friction step of the page teardown (`src/prompts.ts` step 6, `knowledge/landing-pages-and-cro.md` "Friction")? Or is the evidence too weak, or does it show consent banners barely change behaviour?

Hop 0 (seed). Access: the sandbox proxy refused direct downloads (curl) from developers.google.com, developers.google.cn, web.dev, jrc.ec.europa.eu, teamusec.de and others, so every source below was seen through WebFetch, which returns a model's summary and short quotes. All marks are therefore `fetch summary`: figures and quotes are the tool's, unchecked against the text; re-check a figure before it enters a playbook. Search used WebSearch; the shared search budget ran out before a last search for a consent-banner bounce study (see Open questions).

Already in the repo, cited not repeated: Core Web Vitals thresholds, including CLS ≤0.1 (`research/cro-landing-pages.md` §5); EU consent rules for cookie banners and dark patterns (`research/privacy-and-marketing-law.md` §1); consent for analytics (`research/activation-and-analytics.md` §4); defaults steer choices (`research/behavioral-science.md` item 6).

## Sources

1. Google Search Central, "Avoid intrusive interstitials and dialogs," last updated 2025-12-10. https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials [read 2026-10-27; fetch summary] [first-party]
2. Google Search Central, "Understanding page experience in Google Search results," last updated 2026-09-22. https://developers.google.com/search/docs/appearance/page-experience [read 2026-10-27; fetch summary] [first-party]
3. Google Webmaster Central Blog, "Helping users easily access content on mobile," August 2016 (read from the August 2016 archive page). https://webmasters.googleblog.com/2016/08 [read 2026-10-27; fetch summary] [first-party; superseded in part by 2]
4. Morell, D. (Google+), "Google+: A case study on App Download Interstitials," Google Webmaster Central Blog, July 2015. https://webmasters.googleblog.com/2015/07/google-case-study-on-app-download-interstitials.html [read 2026-10-27; fetch summary] [first-party; one site; no sample size or statistics given]
5. Hempenius, K. & Pollard, B., "Best practices for cookie notices," web.dev, last updated 2024-06-13. https://web.dev/articles/cookie-notice-best-practices [read 2026-10-27; fetch summary] [first-party; guidance, no data]
6. Google / Coalition for Better Ads, "Mobile ad experiences" (Ad Experience Report help). https://support.google.com/webtools/answer/7073774 [read 2026-10-27; fetch summary] [first-party; ads only]
7. Utz, C., Degeling, M., Fahl, S., Schaub, F. & Holz, T. (2019). "(Un)informed Consent: Studying GDPR Consent Notices in the Field." ACM CCS 2019. doi:10.1145/3319535.3354212. https://arxiv.org/abs/1909.02638 (abstract) and https://arxiv.org/pdf/1909.02638 (text) [read 2026-10-27; fetch summary] [research; field experiments, n>80,000 visitors; one German website; non-blocking notices]
8. Machuletz, D. & Böhme, R. (2020). "Multiple Purposes, Multiple Problems: A User Study of Consent Dialogs after GDPR." PoPETs 2020(2):481–498. https://www.petsymposium.org/popets/2020/popets-2020-0037.php [abstract; fetch summary] [research; experiment, n=150 students, two countries]
9. van Bavel, R. & Rodríguez-Priego, N. (2016). "Testing the Effect of Cookie Banners on Behaviour." JRC Technical Report EUR 28287 EN. https://publications.jrc.ec.europa.eu/repository/bitstream/JRC103997/jrc103997.pdf [read 2026-10-27; fetch summary] [research; lab experiment, n=602, Spain; mock shop]
10. Goldberg, S. G., Johnson, G. A. & Shriver, S. K. (2024). "Regulating Privacy Online: An Economic Evaluation of the GDPR." AEJ: Economic Policy 16(1):325–358. doi:10.1257/pol.20210309. https://ideas.repec.org/a/aea/aejpol/v16y2024i1p325-58.html [abstract; fetch summary]; interview summary at https://msi.org/articles/how-the-gdpr-impacted-firms-online-visibility-and-revenues/ [read 2026-10-27; fetch summary] [research; panel of ~1,000 mostly large firms' Adobe Analytics data]
11. Huang, N., Mojumder, P., Sun, T., Lv, J. & Golden, J. M. "Not Registered? Please Sign-up First: A Randomized Field Experiment on the Ex-ante Registration Request." Information Systems Research (manuscript, "forthcoming"; 2021 per file name). http://faculty.marshall.usc.edu/jinchi-lv/publications/ISR-HMSLG21.pdf [read 2026-10-27; fetch summary] [research; RCT, n=75,914 new visitors; one US e-commerce site; 17 days]
12. Moe, W. W. (2006). "A field experiment to assess the interruption effect of pop-up promotions." Journal of Interactive Marketing 20(1):34–44. doi:10.1002/dir.20054. https://www.interruptions.net/literature/Moe-JIM06.pdf [read 2026-10-27; fetch summary] [research; field experiment, ~83,000 eligible visitors plus a control day; one informational site; conditions assigned by time of day, not per visitor]
13. Fessenden, T., "The Most Hated Online Advertising Techniques," NN/g, 4 June 2017. https://www.nngroup.com/articles/most-hated-advertising-techniques/ [read 2026-10-27; fetch summary] [practitioner survey; n=452 US adults; wireframes rated for dislike]
14. Moran, K., "Popups: Hated Since the 90s," NN/g, 1 August 2021. https://www.nngroup.com/articles/overlay-overload/ [read 2026-10-27; fetch summary] [practitioner; usability-test observations, no counts]
15. Runyon, E., "Carousel Interaction Stats," 22 January 2013. https://erikrunyon.com/2013/01/carousel-stats/ [read 2026-10-27; fetch summary] [practitioner; analytics from five university sites]
16. Runyon, E., "Carousel Interaction Stats" (update), 8 July 2013. https://erikrunyon.com/2013/07/carousel-interaction-stats/ [read 2026-10-27; fetch summary] [practitioner; analytics, 3.76M home page visits on one site plus four small sites]
17. Nielsen, J., "Auto-Forwarding Carousels and Accordions Annoy Users and Reduce Visibility," NN/g, 19 January 2013. https://www.nngroup.com/articles/auto-forwarding/ [read 2026-10-27; fetch summary] [practitioner; one user in one usability session]
18. Crestodina, A., "Do Rotating Sliders Help or Hurt Your Website? [Research Roundup]," Orbit Media. https://www.orbitmedia.com/blog/rotating-sliders-hurt-website/ [read 2026-10-27; fetch summary] [vendor roundup; secondary for every A/B result]
19. GoodUI, "Pattern #104: Carousel Vs Static Grid Images." https://goodui.org/patterns/104/ [read 2026-10-27; fetch summary] [vendor; effect sizes behind a paywall]
20. BDOW! (formerly Sumo), "Pop-up statistics," 26 May 2026. https://bdow.com/stories/pop-up-statistics/ [read 2026-10-27; fetch summary] [vendor; sells popups]
21. Özeren, M. (Popupsmart), "Do Exit Intent Popups Really Work? 2026 Benchmark Data," 1 July 2026, updated 26 September 2026. https://popupsmart.com/blog/do-exit-intent-popups-work [read 2026-10-27; fetch summary] [vendor; sells popups; 28,674 campaigns]
22. W3C, "Understanding SC 2.2.2: Pause, Stop, Hide" (WCAG 2.2). https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html [read 2026-10-27; fetch summary] [first-party standard]
23. W3C, "Understanding SC 2.4.11: Focus Not Obscured (Minimum)" (WCAG 2.2). https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html [read 2026-10-27; fetch summary] [first-party standard]

Not fetched: ResearchGate, SSRN and SAGE pages for sources 11 and 12 (site errors; author and archive copies used instead); Utz et al. at teamusec.de and the JRC PDF by curl (proxy refused; WebFetch used); the Google+ case study on developers.google.com (blank body; the blogspot copy used); the 2016 Google post on developers.google.com (body not returned; read from the blogspot archive page). Not searched (budget spent): a study measuring how many visitors leave because of a consent banner or cookie wall; any evidence on chat widgets.

## 1. Google's policy: no number, a "small fraction", and no direct ranking effect today

- Google defines intrusive interstitials and dialogs as elements that "obstruct users' view of the content"; interstitials cover the whole page, dialogs part of it. [first-party, 1]
- What to avoid: "Don't obscure the entire page with interstitials" and "Don't redirect the user to a separate page for their consent or input." Use banners that "take up only a small fraction of the screen" instead. [first-party, 1]
- Scope: all promotional dialogs, app-install prompts included; newsletter sign-ups are named as something a small banner can carry. [first-party, 1]
- Exempt: "Mandatory interstitials are exempted"; the example is an age gate. Legally mandatory interstitials are excepted from the common mistakes. The page does not name cookie notices. [first-party, 1]
- The page gives **no numeric threshold**. [first-party, 1]
- Effect on search: intrusive dialogs "may lead to poor search performance" because they make content hard to understand. [first-party, 1]
- The page-experience page lists "avoid intrusive interstitials" as one aspect, then says: "Beyond Core Web Vitals, other page experience aspects don't directly help your website rank higher in search results." [first-party, 2]
- History: the 2016 post announced a mobile ranking signal from 10 January 2017. It named popups covering the main content "immediately after" arrival from search or while reading, standalone interstitials, and above-the-fold layouts that look like one. It exempted cookie-usage and age-verification interstitials, login dialogs for non-public content, and banners that are "easily dismissible" and "use a reasonable amount of screen space". [first-party, 3; superseded in part by 2]
- Read together: Google still advises against covering the page, but today's docs no longer claim a direct ranking penalty. A tool must not say "Google penalises this". [derived from 1–3]

## 2. Measured effects of overlays on arrival

**Full-page interstitial (strongest first-party number).**
- Google+ mobile web showed an app-install interstitial. "69% of the visits abandoned our page"; 9% pressed "Get App" (an upper bound on installs). Swapping it for a small Smart App Banner raised 1-day active users on the mobile site by 17%; iOS installs barely moved (−2%). No sample size or statistics given. [first-party, 4; one site, 2014]

**Sign-up prompt on arrival (randomized).**
- 75,914 new visitors to one US e-commerce site; half saw an optional registration prompt on their first visit. About 12.75% of treated new users "left the website immediately" at the prompt (control attrition at that stage: 0.53%). [research; RCT, n=75,914; one site, 11]
- Registrations rose (raw means 0.466 vs 0.254). Conversion within 24 hours did not change (0.131 vs 0.130, p=0.92). Over 47 days, purchase probability (0.170 vs 0.163) and revenue per visitor rose slightly but significantly, which the authors trace partly to later email contact. [research; RCT, n=75,914; one site, 11]
- The authors say the gain depends on cheap registration and a firm that re-engages sign-ups by email. [research, 11]
- So an arrival prompt has a measured cost (some visitors leave at once) and, in this one setting, a later gain. It is a trade-off to test, not an error. [derived from 11]

**Popup timing (field experiment, older).**
- On a movie information site, a newsletter popup on the first page shortened visits (3.06 pages vs 3.45 in the control); popups on page 2 or later did not. Immediate popups got more clicks than delayed ones (1.14% vs 0.65%). [research; field experiment, ~83,000 visitors; one site; assigned by time of day, 12]
- Fetch-summary caveat: the source's comparison of all popup sessions (5.86 pages) with control sessions (3.45) mixes in who reached the trigger page; only the page-1 contrast is clean. Re-check figures against the PDF before use. [derived from 12]

**Consent banners.**
- In field experiments with over 80,000 visitors to one German site, banners that did not block the page were mostly ignored. A bottom-left box drew the most interaction (37.1%); full-width top and bottom bars drew 2.9% and 9.6% (the summary did not say which is which). Desktop visitors on large screens interacted far less (5.5% vs 25.6%). Highlighting "accept" raised acceptance (mobile 50.8% vs 39.2%). [research; field experiments, n>80,000; one site, 7]
- That study did **not** measure bounce or time on site; the partner site refused to test blocking banners. [research, 7]
- A default ("continuing means you accept") raised acceptance from 49/86 to 86/86 in a lab shop task; other banner wordings changed little. Trust and purchase were not measured. [research; lab, n=602; Spain, 9]
- A highlighted "select all" button raised consent to more purposes; one vs three purposes made no difference. [research; n=150 students, 8]
- After GDPR, recorded EU page views and revenue fell about 12% in a panel of ~1,000 mostly large firms. The authors split this into lost recording (consent opt-outs, estimated 4–15%) and a smaller real drop tied to marketing channels. No source here measures visitors leaving because of a banner. [research; panel, ~1,000 firms, 10]
- web.dev (Google) says cookie notices are "a very common source of layout shifts" when inserted at the top after render, can be the LCP element on mobile, and often cause high INP when "Accept" loads many scripts at once. It prefers a bottom banner or a small modal; large modals that hide most content risk visitors leaving. No numbers. [first-party; guidance, 5]
- Net: the evidence shows consent banners change *consent* a lot (design and defaults) but there is no measured evidence here that a non-blocking banner changes bounce or sales. The measurable harms are performance ones (CLS, LCP, INP), which existing speed checks already see. [derived from 5, 7, 9, 10]

**What users say.**
- In a survey of 452 US adults rating 23 ad wireframes, modal ads tied for most disliked on desktop and topped the list on mobile. [practitioner survey, n=452; ads, not own-site popups, 13]
- Usability-test participants close popups quickly and dislike stacked overlays; no counts. [practitioner, 14]

**Vendor popup data (lead rate only).**
- Popup vendors report average sign-up rates of about 3.5–5% of displays and say on-load triggers do worse than delayed ones. The largest recent benchmark found a median lead rate of 0.61% on load vs 0.83% delayed and 1.10% exit-intent vs 0.78% without, and itself calls these gaps leans, not reliable differences. None measures bounce or sales. [vendor; sells popups, 20, 21]
- So "exit-intent beats entry popups" rests only on vendor lead rates with unreliable gaps; it cannot carry a threshold. [derived from 20, 21]

## 3. The only numeric "covers X%" threshold is for ads

- The Better Ads Standards (shown in Google's Ad Experience Report) define a mobile pop-up ad as appearing "on top of the main page after it has loaded" and blocking content, a prestitial as appearing before content loads, and a "large sticky ad" as one taking "more than 30% of the screen's real estate". Ad density above 30% of the page's vertical height also fails. [first-party; ads only, 6]
- These rules name ads only, not newsletter popups or cookie notices. [first-party, 6]
- So 30% is a borrowed number: the nearest first-party line for "too much of the screen", set for ads. A tool using it must say so. [derived from 1, 6]

## 4. Carousels: almost nobody clicks past slide one

- Notre Dame home page, January–June 2013: 3,755,297 visits; 1.07% clicked a carousel item; 89.1% of those clicks went to slide 1, 2.4–3.1% to each later slide. [practitioner; analytics, one site, 16]
- Four smaller university sites: 1.3–3.0% clicked on non-rotating carousels; the one auto-rotating news carousel had 9.4%, with 54.6% of clicks on slide 1. The author does not claim rotation caused the difference. [practitioner; analytics, n=4 small sites, 16]
- Earlier data from the same sites agree: ~1% on the main site, 84% of clicks on slide 1. [practitioner, 15]
- Other roundups report slider click rates below 1% on several sites. All are secondary. [vendor roundup, 18]
- A/B tests of carousel vs static hero with sales outcomes go both ways in vendor anecdotes (removing a slider +23% sales in one; a slider beating static images by 61% in another), with no sample sizes given. GoodUI lists three tests but hides the results. [vendor; A/B anecdote, 18, 19]
- Auto-advancing panels: one usability participant could not read a panel before it moved ("It keeps flashing too quickly"). [practitioner; one user, 17]
- WCAG 2.2 SC 2.2.2 (Level A): moving content that starts by itself, lasts more than five seconds and sits beside other content needs a way to pause, stop or hide it. The page names "auto-advancing presentations" but not carousels. [first-party standard, 22]
- Net: the measured fact is narrow and consistent: few visitors click a carousel and later slides get almost no clicks, so slides 2+ are close to unseen. There is no controlled evidence that a carousel lowers conversion. [derived from 15–19]

## 5. Accessibility rule that touches overlays

- WCAG 2.2 SC 2.4.11 (AA): a focused control must not be "entirely hidden" by author content. A sticky cookie banner that fully hides a focused element fails; proper modal dialogs (which take focus) pass. [first-party standard, 23]

## What this changes

Evidence grade overall: first-party policy without a number (Google), one first-party measured case (Google+), one RCT (Huang et al.) and one older field experiment (Moe) for arrival prompts, consistent practitioner analytics for carousels. Enough for **info-level, descriptive flags** that report what is there and what is known. Not enough for a warning that says "this costs conversions" or "Google penalises this".

**1. `audit_page` render mode: overlay on arrival.** Buildable.
- Input: the rendered page at a mobile viewport (Google's 2016 rule and the Better Ads rules are mobile; use e.g. 390×844) and, if cheap, desktop. Measure after the existing load + network-idle wait, with no clicks or scrolls.
- Rule: find visible elements with `position: fixed` or `sticky`, or an open `<dialog>`, or `[aria-modal="true"]`, whose box intersects the viewport. Compute the share of viewport area covered (union of boxes, not sum). Also note if a full-viewport backdrop exists (a fixed element ≥ ~95% of the viewport with partial opacity) and whether body scroll is locked (`overflow: hidden` on html/body).
- Classify with text and attribute hints (not shown as fact): cookie/consent (`cookie|consent|gdpr|privacy` in text or ids; known CMP ids such as OneTrust, Cookiebot), sign-up/discount (`email` input, `subscribe|newsletter|% off|discount`), chat (iframe or launcher from known chat hosts, usually a small corner box), app-install, age gate. Report "unknown" otherwise.
- Output, at ≥30% of the viewport: info flag. Suggested text: `On load at 390×844, a fixed <type> element covers about N% of the screen (text starts: "…"). Google advises banners that take "a small fraction of the screen" and not covering the whole page; it gives no number. This audit uses 30%, the Better Ads limit for sticky ads. Google says such dialogs "may lead to poor search performance" but no longer counts them as a direct ranking factor. In one randomized test an arrival sign-up prompt made about 13% of new visitors leave at once but raised sales over 47 days; test it rather than assume.`
- At ≥90% (whole page): same flag, plus Google's "Don't obscure the entire page" and the Google+ case (69% of visits abandoned at a full-page interstitial; 17% more daily users after switching to a small banner; one site).
- Cookie/consent or age gate: say Google exempts legally required interstitials, then give web.dev's advice (bottom banner or small modal, reserve space so it doesn't shift layout). Do not flag a small consent bar.
- What it must say it did not check: popups that appear after a delay, on scroll, on a later page, or on exit intent (the check sees only the first seconds after load); overlays shown only to returning visitors, some countries (consent banners often show only to EU IPs; the tool's own location decides what appears), or logged-in users; whether the element can be dismissed easily; and the effect on this site's own visitors.
- Also cheap and evidence-backed: a fixed element that hides a focusable element entirely (WCAG 2.4.11, AA), reported as an accessibility note.

**2. `audit_page` plain HTML: carousel detection.** Buildable, info only.
- Input: server or rendered HTML.
- Rule: `aria-roledescription="carousel"` or class/id/data attributes of common libraries (`swiper`, `slick`, `splide`, `glide`, `owl-carousel`, `flickity`, `keen-slider`, `carousel`, `slider`), with two or more slide children. Count slides. Record autoplay hints (`data-autoplay`, `data-swiper-autoplay`, `"autoplay":true` in `data-slick`, `data-bs-ride="carousel"`).
- Output: `Carousel found with N slides (heuristic). In one university's data, about 1% of home page visitors clicked a carousel and about 85–89% of those clicks went to slide 1, so treat slides 2+ as mostly unseen. Put the main message and button in slide 1, or use one static hero. Controlled tests on sales go both ways.` If autoplay hints are present: add `WCAG 2.2.2 (Level A) requires a way to pause moving content that lasts more than five seconds; this audit did not check for a pause control.`
- Cannot see in plain HTML: whether the carousel is in the first screen, whether it really rotates, its timing, or custom-built sliders without these markers. Render mode could confirm rotation by comparing the slide transform twice, six seconds apart.
- Design stance: this flags a pattern with measured click data; it does not grade how the carousel looks.

**3. Teardown Friction step** (`src/prompts.ts` step 6; `knowledge/landing-pages-and-cro.md` audit item 8). Add one item: "overlays on arrival and carousels: use the audit's overlay and carousel notes." Per CLAUDE.md, prefer the tool notes over new instruction text; the prompt line only points at them.

**Playbook tags.** Any playbook line saying popups or carousels "kill conversions" should be `[vendor; A/B anecdote]`. A line on carousel clicks can be `[practitioner; analytics, one university site, 3.76M visits]`. A line on arrival sign-up prompts can be `[research; RCT, n=75,914; one e-commerce site]`. Do not tag "Google penalises intrusive interstitials" as current; Google's 2026 page says only Core Web Vitals are used directly.

**What it does not change.** No consent-banner flag beyond the size and performance ones: the evidence shows banners change consent rates, not bounce or sales (none found), and their measurable harm (CLS, INP) is already in speed checks.

## Open questions

- Is there a measured bounce or conversion effect of a blocking consent banner or cookie wall vs a non-blocking one? Not found; the search budget ran out before a last search.
- Chat widgets: no evidence found or searched on whether an auto-opening chat window changes conversion.
- Re-check Moe (2006) page-1 figures and Huang et al.'s 12.75% against the PDFs before any playbook use; both were seen only through a fetch summary. The summary also flagged that Huang et al.'s "58.08% relative" registration figure does not match the raw means.
- Utz et al.: which of 2.9% and 9.6% is the top bar? Needs the figure.
- Does Google's current interstitial page still apply only to mobile? The 2016 signal did; the 2025 page does not say.
- Does the overlay text end up in `leadText` (first 600 chars of body text), polluting the first-screen message checks? Worth a test with a page that has a consent banner early in the DOM.
