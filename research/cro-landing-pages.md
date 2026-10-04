# CRO, Landing Pages, Forms & Copy — Evidence vs Folklore

Researched 2026-10-04. **Access caveat:** the egress proxy blocked nngroup.com, baymard.com, web.dev, thinkwithgoogle.com, arxiv, researchgate, goodui.org and most journal hosts. Only GitHub raw content was fetchable. Unless marked **[verified-source]** (read directly from the primary document), figures come from search-engine snippets of the primary URL and are tagged **[snippet-only]**. Re-verify all [snippet-only] numbers before quoting them to clients.

Evidence tags: **[research]** peer-reviewed or a documented primary study with a stated method · **[practitioner]** a usability firm's own qualitative/benchmark research (NN/g, Baymard), or expert consensus · **[vendor]** published by a company that sells CRO/testing tools · **[anecdote]** a single uncontrolled case story.

## Sources

1. Pernice, K. — "F-Shaped Pattern of Reading on the Web: Misunderstood, But Still Relevant (Even on Mobile)", NN/g, 2017-11-12. https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/ [snippet-only]
2. NN/g — "Text Scanning Patterns: Eyetracking Evidence". https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/ [snippet-only, title only]
3. Nielsen, J. — "Scrolling and Attention (original research study)", NN/g, 2010. https://www.nngroup.com/articles/scrolling-and-attention-original-research/ [snippet-only]
4. Fessenden, T. — "Scrolling and Attention", NN/g, 2018-04-15. https://www.nngroup.com/articles/scrolling-and-attention/ [snippet-only; author and date verified-search: nngroup.com, 2026-10-04]
5. Pernice, K. — "Banner Blindness Revisited: Users Dodge Ads on Mobile and Desktop", NN/g, 2018-04-22. https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/ [snippet-only]
6. NN/g — "Plain Language Is for Everyone, Even Experts". https://www.nngroup.com/articles/plain-language-experts/ [snippet-only]
7. NN/g — "Legibility, Readability, and Comprehension: Making Users Read Your Words". https://www.nngroup.com/articles/legibility-readability-comprehension/ [snippet-only]
8. NN/g — "Lower-Literacy Users: Writing for a Broad Consumer Audience". https://www.nngroup.com/articles/writing-for-lower-literacy-users/ [snippet-only, title only]
9. Baymard Institute — "Cart Abandonment Rate Statistics" (living page, 2026). https://baymard.com/lists/cart-abandonment-rate [snippet-only]
10. Baymard — "Checkout Optimization: Minimize Form Fields". https://baymard.com/blog/checkout-flow-average-form-fields [snippet-only]
11. Baymard — "Usability Testing of Inline Form Validation: 31% Don't Have It, 4% Get It Wrong". https://baymard.com/blog/inline-form-validation [snippet-only]
12. Baymard — "Make 'Guest Checkout' Prominent". https://baymard.com/research-articles/make-guest-checkout-prominent [snippet-only]
13. Baymard — "Save Account Creation for the Confirmation Step (42% Don't)". https://baymard.com/blog/delayed-account-creation [snippet-only, title only]
14. Google / web.dev — "Web Vitals" (source markdown, dated 2020-04-30, updated 2023-05-10). https://github.com/GoogleChrome/web.dev — `src/site/content/en/vitals/index.md` [verified-source]
15. Google / web.dev — "INP is no longer experimental / will replace FID" blog, 2023-05-10. Same repo, `blog/inp-cwv/index.md` [verified-source]
16. web.dev — "How the Core Web Vitals metrics thresholds were defined". https://web.dev/articles/defining-core-web-vitals-thresholds [snippet-only]
17. Deloitte / Google — "Milliseconds Make Millions", 2020. https://www.thinkwithgoogle.com/_qs/documents/9757/Milliseconds_Make_Millions_report_hQYAbZJ.pdf [snippet-only]
18. Goldstein, N. J., Cialdini, R. B., & Griskevicius, V. — "A Room with a Viewpoint: Using Social Norms to Motivate Environmental Conservation in Hotels", *Journal of Consumer Research*, 2008. [snippet-only]
19. Thomas, M., Simon, D. H., & Kadiyali, V. — "The Price Precision Effect: Evidence from Laboratory and Market Data", *Marketing Science* 29(1):175–190, 2010. https://ideas.repec.org/a/inm/ormksc/v29y2010i1p175-190.html [snippet-only]
20. Schindler, R. M., & Yalch, R. F. — "It Seems Factual, But Is It? Effects of Using Sharp versus Round Numbers in Advertising Claims", *Advances in Consumer Research* 33, 2006. [snippet-only] (Note: it is often miscited as *Journal of Advertising*.)
21. Berman, R., Pekelis, L., Scott, A., & Van den Bulte, C. — "p-Hacking and False Discovery in A/B Testing", MSI working paper, 2018. Related published paper: Berman & Van den Bulte, "False Discovery in A/B Testing", *Management Science*, 2021, doi:10.1287/mnsc.2021.4207. [snippet-only]
22. Kohavi, R., Deng, A., & Vermeer, L. — "A/B Testing Intuition Busters: Common Misunderstandings in Online Controlled Experiments", KDD '22, doi:10.1145/3534678.3539160. [snippet-only]
23. Porter, J. — "The Button Color A/B Test: Red Beats Green", HubSpot blog, c. 2011. [snippet-only]
24. GoodUI.org (J. Linowski) — Patterns and Datastories. https://goodui.org/patterns/ , https://goodui.org/datastories/ [snippet-only]
25. Megibow, J. (Expedia), as reported by Silicon.com, Nov 2010. Secondary write-ups: https://flowingdata.com/2010/11/05/simple-analysis-makes-expedia-extra-12m/ , https://www.usabilitycounts.com/2010/11/29/silicon-com-expedia-on-how-one-extra-data-field-can-cost-12-million/ [snippet-only; original Silicon.com article not located]

## 1. How users read: scanning, fold, ads

- **F-pattern is one of several scanning patterns.** It is not a layout template. NN/g first reported it in 2006 (Nielsen, 2006-04-16; 232 users) [verified-search: nngroup.com, 2026-10-04]. The 2017 update names four main patterns for text: F, spotted, layer-cake and commitment. The F shape is the default when text lacks visual structure, so it is a symptom of poor formatting, not a target to design for. [practitioner][1][snippet-only]
- **What to do about it:** front-load headings and the first words of each paragraph and bullet. Use descriptive subheads so readers can follow the "layer-cake" pattern (scanning headings only). Treat the F-pattern as a reason to add structure, not as a placement guide for CTAs. [practitioner][1]
- **The 80% fold figure is obsolete.** Nielsen's 2010 eyetracking found ~80% of viewing time above the fold. [practitioner][3][snippet-only]
- **2018 update:** ~57% of viewing time was above the fold, and ~74% fell within the first two screenfuls (≤2160px). Attention still drops sharply after the fold, and that pattern was unchanged from 2010. [practitioner][4][verified-search: nngroup.com, 2026-10-04]
- **Operational rule:** put the value proposition and primary action in the first screen, but don't cram. Users do scroll, and attention falls off with distance rather than at a hard line. [practitioner][4]
- **Banner blindness persists, including on mobile.** Users skip anything that looks like an ad, sits next to ads, or occupies ad-typical positions (top banner, right rail). The 2018 study saw some users skip Google's top-of-SERP text ads. One task had 26 participants on a single page. [practitioner][5][snippet-only]
- **CRO implication:** don't style key offers, promos or CTAs as banners, and don't put them in the right rail. Ad-like styling hides real content. [practitioner][5]

## 2. Plain language and readability formulas

- **Plain language helps experts too.** In NN/g studies with science, technology and medical domain experts, even highly educated readers wanted succinct, scannable text. [practitioner][6][snippet-only]
- **Reading-level targets:**
  - About 8th grade for a broad consumer audience.
  - About 6th grade for the homepage, key category pages and landing pages.
  - NN/g suggests Flesch-Kincaid (in Word), Hemingway or Grammarly to estimate level. [practitioner][7][snippet-only]
- **What the formulas measure.** Flesch Reading Ease and Flesch-Kincaid Grade Level are linear functions of only two surface features: average sentence length (words per sentence) and average syllables per word. [research — formula definitions; original papers not fetched this session]
- **What they don't measure:**
  - Comprehension, accuracy or logical order.
  - Whether jargon is familiar to the audience: short words can still be unknown, and "specialized words for specialized audiences" can be fine.
  - Layout, scannability and legibility.
  - Whether the reader has the background knowledge the text assumes.
  - They can be gamed by chopping sentences.
  - NN/g separates legibility (typography), readability (word and sentence complexity) and comprehension (understanding). Formulas cover only the middle one. [practitioner][7]
- **Measuring real comprehension** takes user testing, such as NN/g's cloze test, not a formula score. [practitioner][7]

## 3. Checkout and forms: Baymard

- **Cart abandonment average: ~70%.** Baymard's 2026 page ("50 Cart Abandonment Rate Statistics 2026") states **70.22%**, averaged over 50 studies [verified-search: baymard.com, 2026-10-04]. Earlier 2024–25 snippets cite 70.19% from 49 studies.
  - **How it is computed:** a simple average of the abandonment rates reported in ~50 third-party studies, 2006 onward. It is not weighted and not Baymard's own measurement. Studies differ in how they define "cart" and "abandonment".
  - Use it as a rough benchmark only. Don't compare it directly with your own analytics funnel. [practitioner][9][snippet-only]
- **Not all abandonment is fixable.** About 42% of US shoppers have abandoned because they were "just browsing / not ready to buy". Baymard treats this as largely unavoidable and excludes it before ranking the fixable reasons. [practitioner][9][snippet-only]
- **Top avoidable reasons** (Baymard 2025 survey, 1,026 US adults; [verified-search: baymard.com, 2026-10-04] for the 40/20/19/18/17 figures):
  - Extra costs too high (shipping, tax, fees): 40%
  - Delivery too slow: 20%
  - Didn't trust the site with card information: 19%
  - Site wanted me to create an account: 18%
  - Too long or complicated checkout: 17%
  - Couldn't see or calculate the total cost up-front: ~12% (not re-checked)
  - Card declined: ~10% (not re-checked)
  - Not enough payment methods: ~9% (not re-checked)
  - [practitioner][9][12]
- **Conflicting figures exist.** Some secondary sites cite 48% for extra costs and 26% for account creation, which are older Baymard survey waves. Always quote the year with the figure. [practitioner][snippet-only]
- **Recoverable uplift: 35.26%.** Baymard claims the average large e-commerce site could raise conversion this much through better checkout design (about $260B in recoverable US+EU orders). This is a modelled estimate, not a measured result. [practitioner][9][snippet-only]
- **Form fields:**
  - The average checkout in 2024 had **11.3 form fields** (11.8 in 2021) and **5.1 steps**. [verified-search: baymard.com, 2026-10-04]
  - Baymard says most sites need only **8 fields**. [verified-search: baymard.com, 2026-10-04]
  - The average US checkout shows **23.48 form elements** by default. An ideal flow needs about 12 (7 fields, 2 checkboxes, 2 drop-downs, 1 radio group).
  - [practitioner][10][snippet-only]
- **Guest checkout:**
  - 62% of benchmarked sites fail to make "Guest Checkout" the most prominent option.
  - A guest option that users can't spot is as bad as none at all.
  - Delay account creation to the confirmation step (title claims 42% of sites don't).
  - [practitioner][12][13][snippet-only]
- **Inline validation:**
  - 31% of sites have none.
  - 4% implement it badly, for example premature validation that flags fields before the user has finished typing.
  - Remove error messages once the input is corrected.
  - Keep card data after a validation error (a separate article title states 34% of sites don't).
  - [practitioner][11][snippet-only]
- **Method note:** Baymard's evidence is moderated usability testing plus benchmark audits of large sites. It shows usability problems and how common they are. It does **not** report causal conversion lifts per guideline. [practitioner]

## 4. Form length: what is actually known

- **Expedia "$12M company field": [anecdote].**
  - The story comes from Joe Megibow (Expedia VP Global Analytics), reported by Silicon.com around Nov 2010 and repeated by FlowingData and others.
  - His account: some users read the optional "Company" field as the bank name, then entered the bank's address, so card verification failed. Deleting the field gave "a step function… $12M of profit a year".
  - No controlled test, no published method, and the original article was not located. [25][snippet-only]
- **The real lesson** is about an ambiguous field that caused downstream payment failure, not "fewer fields always wins". [practitioner]
- **"Fewer fields = more conversions" has no single controlling study.** Baymard's evidence is usability-based (see §3). HubSpot and Unbounce form-length charts are **[vendor]**: observational, aggregated across their own customers, and confounded by offer type and traffic intent. None were verified this session.
- **What the evidence does support:** cut fields that are unnecessary or ambiguous. Fewer *required decisions* matters more than raw count. On lead-gen forms, fewer fields can mean lower lead quality, so measure downstream outcomes. [practitioner]

## 5. Page speed and Core Web Vitals

- **Current Core Web Vitals:**

  | Metric | Good | Poor | Notes |
  |---|---|---|---|
  | LCP | ≤2.5 s | >4 s | Verified-source for 2.5 s; 4 s verified-search: web.dev, 2026-10-04 [14][16] |
  | INP | ≤200 ms | >500 ms | 200–500 ms "needs improvement"; >500 ms verified-search: web.dev, 2026-10-04 [15][16] |
  | CLS | ≤0.1 | >0.25 | Verified-source for 0.1; 0.25 verified-search: web.dev, 2026-10-04 [14][16] |

  Each metric is assessed at the **75th percentile** of page loads, split by mobile and desktop. [research/Google docs][14][verified-source]
- **INP replaced FID as a Core Web Vital on 12 March 2024.** Google announced the plan on 2023-05-10, and FID was deprecated with the switch. [15][verified-source for the announcement]; 12 March 2024 date [verified-search: web.dev ("Interaction to Next Paint becomes a Core Web Vital on March 12"), 2026-10-04]
- **"Milliseconds Make Millions" (Deloitte for Google, 2020):**
  - Data: 37 brands (retail, travel, luxury, lead-gen) in EU and US, ~30M sessions, 4 weeks.
  - Finding: a **0.1 s** mobile speed improvement was associated with **+8.4% conversions** and **+9.2% average order value** in retail, and **+10.1% conversions** and **+1.9% AOV** in travel.
  - Engagement also rose: page views +7% for lead-gen and +8% for luxury.
  - [vendor-commissioned][17]; 37 brands / 4 weeks / 8.4% / 9.2% / 10.1% / 1.9% [verified-search: deloitte.com, 2026-10-04]; the +7%/+8% page-view figures were not re-checked.
- **Caveats on that study:**
  - Google commissioned it, and Google benefits from a faster web.
  - It is observational and cross-site, not a randomized test, so slower and faster sites may differ in other ways.
  - Effect sizes for 0.1 s look implausibly large if read as causal.
  - Cite it as "associated with", not "causes". [practitioner judgment]
- **Better evidence for speed:** your own A/B tests that inject delay, and web.dev case studies. Note that web.dev case studies are curated successes, so they are selection-biased. [practitioner]

## 6. Social proof and specific claims

- **Descriptive norms beat generic appeals in one well-known field study.** In two hotel field experiments, "most guests reuse towels" signs raised reuse over a standard environmental appeal. [research][18][snippet-only]
- **Replication caveat:** a later study, "A room with a viewpoint revisited", appeared in search results. My memory is that it found weaker or null effects, but it was not read; see Open questions. The effect may depend on context. Present social proof as "often helps, test it", not as a law. [research — unverified]
- **Cialdini's *Influence*** is a popular synthesis of persuasion research. Use the underlying studies as the evidence, not the book's anecdotes. [practitioner]
- **Precise numbers change judgments.**
  - **Prices:** buyers underestimate the size of precise prices. Homeowners would pay more for a house listed at $364,578 than at $365,000. In real estate transaction data, more precise list prices went with higher sale prices. [research][19][snippet-only]
  - **Claims:** sharp numbers ("43% faster") are assumed to be measured rather than estimated, so they seem more factual and believable than round numbers ("40%"). [research][20][snippet-only]
- **Counter-evidence on precision:** Pena-Marin & Bhattacharjee (J. Consumer Psychology, 2016) found round numbers raise perceived stability and duration of benefits. Pena-Marin (JCP, 2019) found that incorrect *imprecise* estimates preserve trustworthiness better than incorrect precise ones. [research][titles snippet-only] Precision helps believability only if the number holds up.
- **Copy rule:** use specific, verifiable numbers ("2,314 teams", "ships in 2 days") over vague superlatives. Don't fake precision. [practitioner, informed by 19–20]
- **Testimonials:** no peer-reviewed study was located this session that quantifies landing-page testimonial lift. Treat such claims as [vendor] or [practitioner].

## 7. Message match, single goal, CTA wording

- **Message match** (headline and offer echo the ad or link that brought the visitor): **[practitioner consensus]**. It rests on information-scent theory and banner-blindness and scanning findings. No controlled cross-site study was located. Vendor statistics (e.g., Unbounce) are **[vendor]**.
- **One primary goal per page / remove navigation:** **[practitioner]**. Supporting evidence is mainly vendor and agency case studies. Single tests showing a lift from removing navigation are **[anecdote]**.
- **CTA wording** (specific action plus outcome, e.g. "Get my quote" vs "Submit"): **[practitioner]**, consistent with NN/g guidance on descriptive link labels. No generalizable effect size exists.
- **First-person CTA copy ("my" vs "your"):** vendor single-test anecdotes only. **[anecdote]**

## 8. A/B-test folklore and repositories

- **"Red beats green" button test (Performable/HubSpot, c. 2011):**
  - One page, about 2,000 visits, red got 21% more clicks. [anecdote][23][snippet-only]
  - The likely mechanism is contrast against a green-dominated page, not redness.
  - It measured clicks, not revenue, and the sample was small.
  - An "89-store replication, red won only 38%" claim circulates without a traceable source. Treat it as unverified.
- **Why winners don't generalize:**
  - **Low power and optional stopping:** in 2,101 Optimizely experiments, ~73% of experimenters stopped just as a positive effect reached 90% confidence. That pushed the false discovery rate from about 33% to 40%. [research][21][snippet-only]
  - **Twyman's law:** any figure that looks interesting or different is usually wrong. Surprising lifts need replication. [research][22][snippet-only]
  - Kohavi et al. list common misunderstandings that vendors promote, such as p-values and peeking. [research][22]
  - **Winner's curse:** effects chosen *because* they won are biased upward, so expect regression on rollout. [research — general statistical result; see Kohavi et al. 22]
  - **Context dependence:** audience, traffic source, baseline design and offer all interact with the change being tested.
- **GoodUI:**
  - Catalogs patterns (e.g. 141 patterns from 644 tests at one point) and reports how often each one repeats and its median effect.
  - "Datastories" reports a 23% median impact across 26 client projects.
  - **Limitations:** it publishes curated results from its own clients, with publication bias toward wins, and many of the tests change several things at once. Use it as a source of priors to test, not as expected lift. [vendor/practitioner][24][snippet-only]
- **Vendor case-study libraries** (Optimizely, VWO and similar) have the same survivorship bias. [vendor]
- **Operational rule:** before acting on a test, pre-register the metric and sample size, avoid peeking (or use sequential methods), and re-test big wins. [research][21][22]

## Open questions / could not verify

- No primary pages from NN/g, Baymard, web.dev or Think with Google could be fetched. On 2026-10-04, the priority figures (NN/g 57%/74%, Baymard 70.22%, 40/20/19/18/17 reasons, 11.3/8 fields, CWV poor thresholds, INP date, Deloitte figures) were confirmed via searches scoped to the owner's domain. Other figures remain [snippet-only].
- The 2006 F-pattern study's 232 users is confirmed (nngroup.com search, 2026-10-04); Fessenden authorship of the 2018 article is confirmed.
- Baymard's lower-ranked reasons (12% / 10% / 9%) were not re-checked against the 2025 survey.
- I could not get the full "Milliseconds Make Millions" PDF to check its method (regression controls, how speed was attributed).
- The original Silicon.com Expedia article was not located. The story stays [anecdote].
- Not fetched this session:
  - The Bohner & Schlüter towel-reuse replication result.
  - Flesch (1948) and Kincaid et al. (1975), the original readability formula papers. The formula descriptions above are standard but uncited here.
  - Wroblewski's (2009) inline-validation study figures.
  - HubSpot/Unbounce form-length datasets.
- No peer-reviewed evidence was found for message match, single-goal pages or CTA wording effect sizes.
