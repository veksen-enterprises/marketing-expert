---
title: Landing pages and conversion optimisation
summary: What evidence says about how people read pages, the fold, forms, checkout, speed and proof; a teardown checklist; and which CRO "facts" are folklore.
tags: landing page, conversion rate optimization, cro, ux, forms, checkout, page speed, core web vitals, social proof, above the fold, homepage, teardown
---

## Diagnose before redesigning

A page underperforms for one of four reasons, in roughly this order of frequency:
1. **Wrong traffic**: the visitors were never going to convert (message mismatch, broad targeting). Fix upstream.
2. **Unclear offer**: visitors don't understand what it is, who it's for, or why it beats their alternative. Fix positioning and copy.
3. **Insufficient trust or answers**: they understand but have unresolved objections (price, risk, effort, credibility).
4. **Friction**: they want it but the path is slow, long or broken.

Look at segment data before the page: conversion by traffic source, device and new vs returning. One bad source can drag the average down.

## How people actually read [practitioner, NN/g]

- Scanning is the default. The F-pattern is one of several patterns (F, spotted, layer-cake, commitment); it appears when text lacks structure. It's a symptom of poor formatting, not a layout to design for. Front-load headings, paragraphs and bullets with the meaningful words.
- **The fold**: NN/g eyetracking found ~80% of viewing time above the fold in 2010 and ~57% in 2018 (Fessenden), with ~74% in the first two screenfuls. Put the value proposition and primary action on the first screen; people do scroll, but attention falls with distance.
- **Banner blindness**: users skip anything that looks like an ad or sits in ad positions. Don't style offers as banners or put key content in the right-hand column.
- **Plain language** helps experts too. NN/g suggests roughly 8th-grade reading level for broad audiences. Readability formulas measure only sentence length and syllables per word, not comprehension; use analyze_copy as a signal, and test comprehension with users.

## Forms and checkout [practitioner, Baymard usability research]

- Average documented cart abandonment ~70% (Baymard's simple average of ~50 third-party studies; definitions vary, so don't compare directly with your own funnel). A large share ("just browsing") isn't fixable.
- Top fixable reasons in Baymard's 2025 US survey (1,026 adults): extra costs too high 40%, delivery too slow 20%, didn't trust the site with card details 19%, forced account creation 18%, long/complicated checkout 17%. Older survey waves give different figures; always quote the year.
- Average checkout has ~11 form fields; Baymard says most need ~8. Make guest checkout the most prominent option; ask for account creation after purchase.
- Inline validation helps when it validates after the user finishes a field, not while typing.
- **Form length is about decisions and ambiguity, not raw count.** The famous Expedia "$12M company field" story (an ambiguous optional field caused card verification failures) is an anecdote with no published method. Removing fields can lower lead quality on lead-gen forms: measure downstream (qualified pipeline, revenue), not just submissions.

## Speed [first-party / vendor]

- Core Web Vitals "good" thresholds, at the 75th percentile of page loads: **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1**. INP replaced FID in March 2024.
- Google/Deloitte "Milliseconds Make Millions" (2020): a 0.1 s mobile speed improvement was associated with +8.4% retail conversions. Google-commissioned and observational: cite as "associated with". The best evidence for your site is a delay-injection test.

## Proof and specificity [research]

- Precise numbers are judged as measured rather than estimated, so they read as more credible ("43% faster" vs "40% faster"); precise list prices also anchor higher. But precision backfires if the number turns out wrong. Use real, checkable numbers.
- Descriptive social norms ("most guests reuse towels") beat generic appeals in a hotel field study (Goldstein, Cialdini & Griskevicius 2008); replications are mixed. Social proof often helps; test it.
- No peer-reviewed effect size exists for testimonials on landing pages. Specific testimonials (name, role, company, the result) are more credible than generic praise; that's practitioner consensus.

## Practitioner consensus without controlled evidence

These are reasonable defaults, not proven laws:
- **Message match**: the headline continues what the ad or link promised.
- **One primary goal per page**: for paid traffic, remove competing actions and navigation.
- **Descriptive CTAs**: "Get my quote" rather than "Submit".

## Folklore to stop citing

- "Red buttons beat green": one page, ~2,000 visits, clicks not revenue; likely about contrast on a green page.
- Any "this test lifted conversions 300%" case study: survivorship-biased libraries (vendor case studies, GoodUI's paid case stories with a stated 92% success rate). In 2,101 Optimizely experiments, ~73% of experimenters stopped when a positive effect hit 90% confidence, inflating false discoveries (Berman et al.). Use pattern libraries as hypotheses, not expected lifts.

## Teardown checklist

Run audit_page and analyze_copy first.
1. **5-second test**: from the h1 and lead text, what is it, for whom, and what's the next step?
2. **Message match** with the traffic source.
3. **Value proposition**: specific outcome + mechanism + differentiation from the real alternative.
4. **Primary CTA**: one, visible on the first screen, states what you get. Secondary CTA for not-ready visitors (demo video, pricing).
5. **Proof** adjacent to claims: numbers, named customers, logos relevant to this audience, ratings, case studies.
6. **Objections** answered: price, switching cost, setup time, security/compliance, "will it work for us".
7. **Risk reversal**: free trial terms, guarantee, cancel anytime, no card required, whichever is true.
8. **Friction**: form fields, steps, mobile layout, speed (CWV), errors.
9. **Technical**: indexability, title/meta, OG (Open Graph) tags that control link previews on social media, structured data, from audit flags.

Output the top three changes ranked by impact × confidence, each as a hypothesis, and decide which to A/B test (see experimentation) versus ship.

## Sources

research/cro-landing-pages.md (NN/g 2006/2010/2017/2018; Baymard; web.dev; Deloitte/Google 2020; Thomas, Simon & Kadiyali; Schindler & Yalch; Goldstein et al. 2008; Berman et al.; Kohavi et al.). Most figures are from search snippets; web.dev thresholds were read from source.
