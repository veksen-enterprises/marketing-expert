---
title: SEO content and site architecture
summary: How to structure a site and its content for search; internal linking and anchor text, topic clusters, crawl budget (and why most sites can ignore it), pagination and faceted navigation, programmatic SEO without scaled content abuse, content briefs, refreshing and pruning, and measuring with Search Console.
tags: site architecture, internal linking, anchor text, topic clusters, pillar pages, hub pages, crawl budget, pagination, faceted navigation, filters, programmatic seo, templated pages, content brief, search intent, information gain, entities, content refresh, content pruning, search console, performance report
---

This playbook covers how pages are organised, linked and written so Google can find them and users get what they searched for. Quality systems, AI Overviews and the basic technical checklist are in seo-and-ai-search; location pages are in local-seo; language versions are in international-seo.

## Site architecture and internal linking

- **Crawlable links only.** Google reliably follows only `<a>` elements with an `href`. Links created by JavaScript click handlers, buttons or `onclick` without `href` may never be found. [first-party]
- **Every page you care about needs at least one internal link** from another page. Pages only in the sitemap ("orphan pages") are found but get little weight. [first-party; practitioner]
- **Anchor text** (the clickable words) should be descriptive, reasonably short and relevant to both pages; the words around the link also matter. Don't stuff keywords and don't chain several links side by side. "Click here" tells Google and users nothing. [first-party]
- **Shallow structure**: important pages within about 3 clicks of the home page. Depth is a practitioner heuristic, but deep pages tend to be crawled less often and get fewer internal links. [rule-of-thumb]
- **Link in context**, inside the body text, from pages that already get traffic or links to pages you want to grow. A link from a related high-traffic article helps more than one more footer link. [practitioner]
- **Navigation reflects the business**: main categories in the header, related items in breadcrumbs, related content blocks at the end of articles. Add BreadcrumbList structured data. [first-party; practitioner]
- **URLs**: readable words, hyphens, lowercase, one URL per page; avoid session IDs and endless parameter combinations. [first-party]

## Topic clusters and hub pages

- A **topic cluster** is a hub page (also called a pillar page) that gives an overview of a topic and links to detailed pages on each sub-topic; the detailed pages link back to the hub and to each other where it helps the reader. [practitioner]
- Why it works (plausibly): it creates dense, relevant internal links and forces you to cover a topic completely. There is no controlled evidence that the "cluster" format itself is a ranking factor. [practitioner]
- Build clusters around topics your buyers research, mapped to product use cases, not around keyword tools' suggestion lists.
- One page per intent. If two pages target the same query and intent, they compete ("cannibalisation"); merge them and 301-redirect the weaker. Check in Search Console: one query showing two of your URLs alternating. [practitioner]

## Crawl budget

- **Most sites don't need to think about it.** Google's crawl budget guide is written for sites with 1 million+ unique pages that change about weekly, or 10,000+ pages that change daily. Below that, if pages aren't indexed, the cause is usually quality or duplication, not crawl budget. [first-party]
- Crawl budget = **crawl capacity** (how much Google can crawl without overloading your server) + **crawl demand** (how much it wants to crawl). You control demand most: duplicate and low-value URLs waste it. [first-party]
- For large sites: block worthless URL spaces in robots.txt (internal search results, endless filters, calendars), return correct 404/410 for removed pages, avoid redirect chains, keep sitemaps to canonical indexable URLs with accurate lastmod, and keep servers fast. [first-party]
- Note: robots.txt stops crawling, not indexing; to remove a page from results use noindex (and allow it to be crawled so Google sees the noindex). [first-party] [not re-verified]

## Pagination

- Google no longer uses `rel="next"`/`rel="prev"`. [first-party]
- Give each page its own URL (`?page=2`, not `#page=2`; Google ignores fragments), link pages in sequence with normal `<a href>` links, and let each page canonicalise to itself, not to page 1. [first-party]
- Paginated pages may share a title and description. [first-party]
- Infinite scroll and "load more" buttons need a paginated URL fallback with real links, or items beyond the first batch may never be crawled. [first-party] [not re-verified]

## Faceted navigation (filters)

Facets are the filters on category pages (size, colour, price, brand). Each combination can create a new URL, producing millions of near-duplicate pages. Google's Dec 2024 guidance: [first-party]

- **If filtered URLs don't need to rank**: block them in robots.txt, or implement filters with URL fragments (#), which Google generally ignores. Google notes there is often no good reason to let filtered URLs be crawled.
- **If some must be crawled**: use the standard `&` separator for parameters, keep filters in a consistent order, and return a 404 for combinations with no results.
- `rel="canonical"` and `rel="nofollow"` on filter links are weaker options; nofollow only helps if applied to every link to those URLs.
- Practitioner pattern: pick the few combinations with real search demand ("men's waterproof running shoes") and turn them into proper static category pages with their own copy and internal links; keep the rest uncrawlable. [practitioner]

## Programmatic SEO

Programmatic SEO = building many pages from a template and a dataset (one page per city, product pair, integration, currency pair).

- **Legitimate when each page answers a different question with different data.** Commonly cited examples [anecdote; traffic figures are third-party tool estimates]:
  - Zapier: 25,000+ "[App A] + [App B] integration" pages, each describing real workflows the product supports; reportedly ~16% of organic traffic.
  - Wise: currency converter pages with live rates and fees for each pair.
  - Tripadvisor: location × category pages built from millions of real reviews and listings.
- **Scaled content abuse** when pages exist mainly to rank: only a keyword swapped, the same paragraph rephrased, scraped or auto-translated content, or AI text with no unique data. Google's policy applies however pages are made (AI, humans, or both). [first-party]
- **Quality thresholds before publishing** [practitioner]:
  - Would a person who landed on this page from search be satisfied without going back?
  - Does each page carry unique data (prices, stock, reviews, specs, local facts, a working tool), not just unique words?
  - Remove two random pages from the set: does the remaining set lose anything? If not, the pages are interchangeable.
  - Is there a minimum data rule (e.g. no page for a city with fewer than N listings)? Empty or near-empty combinations should not be generated, or should be noindexed.
- **Roll out in stages**: publish a sample (e.g. 100–500 pages), check indexing and engagement in Search Console for 4–8 weeks, then expand. A large share stuck in "Crawled – currently not indexed" signals Google doesn't see enough value. [practitioner]

## Content briefs

A brief is the instruction sheet for a writer. Include:

1. **Target query and intent**, taken from the live results page, not a tool. Search it (logged out, right country). What page types rank (guides, product pages, lists, tools, videos, forums)? Is there an AI Overview? Match the dominant format, or decide deliberately why you won't. [practitioner]
2. **Reader and job**: who searches this, what they're trying to get done, what they'll do next (the product link).
3. **Questions to answer**: from "People also ask", sales and support calls, forums, the ranking pages' headings. [practitioner]
4. **Information gain**: what this page will add that the top results don't — original data, a worked example, screenshots of the real process, expert opinion, a template. Google holds a patent on scoring "information gain" (granted 2022); a patent does not prove use in ranking, but Google's own helpful-content guidance asks whether content provides original information and substantial value compared with other results. [first-party guidance; patent; practitioner]
5. **Entity coverage**: the people, products, concepts and terms a complete answer would mention (e.g. a "CRM for small business" page should name the main products, pricing models, integrations). Use ranking pages and knowledge sources to list them; don't stuff. [practitioner]
6. **Author expertise**: who writes or reviews it and why they are qualified; show it on the page (byline, bio, first-hand experience). Google's guidance asks "Who created this, how, and why". [first-party; practitioner]
7. **Internal links**: which hub links to this page, which pages this page links to, with anchor text.
8. **Success metric**: target queries and the conversion action, not word count.

## Content refreshes and pruning

- **Refresh** pages that rank on positions 4–20 or that have lost clicks year on year: update facts, prices and screenshots, answer new questions, improve the intro, add internal links. Change the visible date only when the content changed meaningfully. [practitioner]
- **Prune with care.** Google's Search Liaison (Aug 2023): deleting content because it is "old" is "not a thing"; old content can still be helpful. Removing pages may help a very large site get other pages crawled, but doesn't make the whole site "better" by itself. [first-party via secondary reporting]
- For each weak page choose: **improve** (relevant, has potential), **merge and 301 redirect** (overlaps a stronger page), **noindex** (useful to users, not to searchers), or **delete with 404/410** (no value, no links, no traffic). Check backlinks and conversions before deleting. [practitioner]
- Whole-site quality still matters under core updates (see seo-and-ai-search), so large sets of thin pages are worth fixing; just don't delete by age.

## Measuring with Search Console

- **Performance report fields**: clicks; impressions (times your link was shown); CTR (clicks ÷ impressions); average position (the topmost position of your link for each query, averaged across queries; recorded only when the result was actually seen). Filter or group by query, page, country, device, search appearance and date. [first-party]
- Average position falls when you start appearing for more, lower-ranked queries; it can drop while traffic grows. Read it per query, not site-wide. [first-party; practitioner]
- Use **page + query** views to find cannibalisation, refresh candidates (high impressions, low CTR) and pages with rising impressions but no clicks (often AI Overview or SERP features above you).
- Use the **Page indexing report** for "Crawled – currently not indexed" and "Discovered – currently not indexed" counts, especially for programmatic sets. [first-party] [not re-verified]
- Compare periods year on year to remove seasonality; annotate core update dates. Join Search Console data with GA4 conversions (see metrics-and-measurement) to judge pages on revenue, not clicks.

## Checklist

- [ ] All navigation and content links are `<a href>`; no orphan pages; descriptive anchor text.
- [ ] Hub pages for core topics, linked both ways with detail pages; one page per intent.
- [ ] Crawl budget work only if 1M+ pages or 10k+ daily-changing pages.
- [ ] Pagination: unique URLs, sequential links, self-canonicals.
- [ ] Facets: blocked or fragment-based unless a combination has real demand and its own page.
- [ ] Programmatic sets pass the unique-data test and launch in stages.
- [ ] Every brief has intent from the live results page, questions, information gain, entities, author.
- [ ] Quarterly refresh/prune review with improve/merge/noindex/delete decisions.
- [ ] Search Console reviewed per query and page, joined to conversions.

## Common mistakes

- JavaScript-only links and "load more" without paginated URLs.
- Letting filters generate millions of crawlable URLs.
- Canonicalising every paginated page to page 1.
- Programmatic pages where only the city or keyword changes.
- Briefs built from a keyword tool's word count instead of the live results page.
- Deleting old posts in bulk because they are old.
- Reading site-wide average position as a performance metric.

## Sources

research/seo-advanced.md §C (Google Search Central: link best practices, crawl budget, faceted navigation Dec 2024, pagination, spam policies, helpful content; Search Console Help; Search Engine Land on content pruning; Google information gain patent; programmatic SEO practitioner teardowns). Google pages were read from search snippets only; see the access caveat there.
