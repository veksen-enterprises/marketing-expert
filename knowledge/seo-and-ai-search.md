---
title: SEO and AI search
summary: Search in 2026; what Google's quality systems reward, how AI Overviews and AI Mode changed click-through, what's evidence vs speculation in "GEO", and a practical content and technical checklist.
tags: seo, search engine optimization, content marketing, ai overviews, ai mode, geo, generative engine optimization, llms.txt, keyword research, helpful content, core update, technical seo
---

## What changed (2024–2026)

- **Fewer clicks per ranking.** When an AI Overview appears, organic CTR drops substantially. Pew (Mar 2025 browsing data, 900 US adults): users clicked a result on 8% of visits with an AI summary vs 15% without, and clicked a link inside the summary on 1%. Ahrefs: position-1 CTR −34.5% (Apr 2025), −58% in a Dec 2025 update. Seer Interactive (informational queries, Jun 2024–Sep 2025): −61% organic CTR on AIO queries, and −41% even on queries without one. Semrush clickstream: 92–94% of AI Mode sessions were zero-click. Methods differ; the direction is consistent, the size ranges ~35–61%. Seer's 2026 update shows some rebound: organic CTR on AI Overview queries rose from 1.3% (Dec 2025) to 2.4% (Feb 2026), and cited brands got ~120% more clicks per impression. [research / vendor]
- **Quality systems**: the March 2024 core update folded "helpful content" into core ranking and added spam policies for scaled content abuse (mass-produced pages, by any method including AI), expired domain abuse, and site reputation abuse (third-party content riding a host site's authority; clarified Nov 2024 to apply even with first-party oversight). Core updates continued in March and May 2026. [first-party]

**Implication**: informational traffic per keyword is falling. Plan for SEO to deliver fewer, higher-intent visits; value it on pipeline/revenue per visit, not sessions.

## What to do

1. **Target intent where you can win the click**: commercial and transactional queries (comparisons, alternatives, pricing, "[category] for [use case]", integrations), and queries where a summary can't substitute for the page (tools, calculators, templates, data, detailed how-tos with product context).
2. **Information gain**: first-hand experience, original data, specific examples, expert opinion. Pages that restate the top 10 results add nothing for Google or for AI summaries to cite.
3. **Be the source that gets cited.** Being cited in an AI Overview correlates with ~35% higher organic CTR than not being cited (Seer; correlation, not cause).
4. **Whole-site quality**: weak sections can drag the site. Prune or improve thin, outdated and duplicate pages. Recovery from a core update usually comes only at a later core update.
5. **Don't**: mass-produce templated or AI pages without unique value; rent subfolders to third parties; buy expired domains for their links.

## Generative engine optimisation (GEO): evidence vs speculation

- **Evidence**: Aggarwal et al. (KDD 2024) found adding quotations, statistics and source citations raised visibility in generative engine answers by up to ~40% on their benchmark; keyword stuffing didn't help. A lab benchmark; generalisation is contested. [research]
- **Speculation**: most "AI visibility" playbooks and scores, and claims that schema markup or llms.txt drive LLM citations, have no controlled evidence.
- **llms.txt**: Google said it doesn't use it (Jul 2025); no major LLM provider had publicly committed to it as of Q1 2026; Ahrefs (137k sites, May 2026): 28% publish an llms.txt and 97% of those files got zero requests. Cheap to add, but don't expect results from it.
- Practical stance: the things that make content citable by LLMs (clear claims, data, named sources, being mentioned across the web and in communities) are the same things that make it useful to people and to Google. Track branded search and referral traffic from AI assistants rather than buying "AI rank" scores.

## Keyword and topic research

- Start from customer language (sales calls, reviews, support) and the jobs they're trying to do, then validate volume.
- Map each topic to a funnel stage and a page type. One primary intent per page.
- Prioritise by (business value × ability to win) ÷ effort. A 50-search/month "alternative to [competitor]" query can beat a 50,000-search informational one.
- Check the live SERP: if it's all AI Overview + forums + video, a blog post won't win much.

## Technical checklist

Run audit_page on key templates.
- Indexable (no stray noindex, X-Robots-Tag), canonical correct, in the XML sitemap, internally linked.
- Unique title (~50–60 chars visible) and meta description (~155 desktop / ~120 mobile; Google often rewrites both).
- One clear h1; logical heading structure.
- Server-rendered main content (crawlers and LLM fetchers see less of client-rendered pages).
- Core Web Vitals good: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- Structured data where it maps to a rich result (Product, Organization, Article, FAQ only where eligible); valid JSON-LD.
- Mobile-friendly, HTTPS, no redirect chains.

## Common mistakes

- Measuring SEO on traffic when the traffic that disappeared was never converting.
- Publishing volume over quality; it now risks a site-wide drag.
- Optimising for keywords no customer uses.
- Treating rankings as the goal; the goal is qualified visits and pipeline.

## Sources

research/landscape-2026.md §4, §6 (Pew 2025; Ahrefs 2025; Seer 2025; Semrush 2025; Aggarwal et al. 2024; Google Search Central blog 2024; Search Engine Land). Figures largely from search snippets; marked [verify] in the research notes.
