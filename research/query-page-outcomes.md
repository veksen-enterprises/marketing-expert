# What does a page aimed at one named query get on a small site with few links? (checked 2026-10-27)

Question: `small-bet-base-rates.md` §4 found no rate for comparison pages ("X alternative", "X vs Y") or error-message pages. What do studies with a denominator say about the typical page on a low-authority site, and does that contradict the `evidence: "some"` grade, the `ceiling: "steady"` or the stop lines of `comparison-pages` and `error-pages` in `src/lib/smallBetsCatalog.ts`?

Hop 1 from `small-bet-base-rates.md`. Access marks as in `founder-test-samples.md`.

Already in the repo, cited not repeated: 96.55% of pages get no estimated Google traffic (`small-bet-base-rates.md` item 10); 1.74% of new pages (6.11% of non-empty English ones) reach the top 10 within a year (`small-bets.md` item 11); developers paste exact error text into search (`small-bets-presence.md` item 44); comparative ads persuade, new brands most (same note, item 42). SEO tool changes are out of scope here.

## Sources

1. Babiak, B. (SE Ranking), AI-generated content experiment on 20 new domains, Search Engine Land, data to 13 Mar 2026 (article date not stated). https://searchengineland.com/ai-generated-content-google-search-experiment-472234 [read 2026-10-27; vendor: SE Ranking sells SEO tools; publisher owned by Semrush]
2. Stox, P., "Anonymized Queries Make Up Nearly Half of Google Search Console Traffic," Ahrefs, 11 Feb 2026. https://ahrefs.com/blog/gsc-anonymized-queries/ [read 2026-10-27; vendor]
3. Soulo, T., "Long-tail Keywords," Ahrefs, 25 Nov 2021, updated 27 May 2026. https://ahrefs.com/blog/long-tail-keywords-research/ [read 2026-10-27; vendor]
4. Chasiotis, G., "The Truth About Comparison Keywords: What 4,523 Search Results Reveal," Minuttia, 3 Feb 2025, updated 5 Feb 2026. https://minuttia.com/comparison-keywords-study/ [read 2026-10-27; vendor: sells content services]
5. Downey, D., Dumais, S. & Horvitz, E. (2007). "Heads and Tails: Studies of Web Search with Common and Rare Queries." SIGIR 2007. http://erichorvitz.com/heads_and_tails_sigir.pdf [read 2026-10-27]
6. Dean, B., "Here's What We Learned About Organic Click Through Rate," Backlinko, 2019, updated 16 Apr 2025. https://backlinko.com/google-ctr-stats [read 2026-10-27; vendor: owned by Semrush]
7. Hora, A. (2021). "Googling for Software Development: What Developers Search For and What They Find." MSR 2021. doi:10.1109/MSR52588.2021.00044 [secondary: summary at https://neverworkintheory.org/2021/11/18/googling-for-software-development.html, read 2026-10-27; paper not fetched]
8. del Rio-Chanona, R. M., Laurentsyeva, N. & Wachs, J. (2024). "Large language models reduce public knowledge sharing on online Q&A platforms." *PNAS Nexus* 3(9):pgae400. doi:10.1093/pnasnexus/pgae400. https://discovery.ucl.ac.uk/10202775/ [read 2026-10-27]
9. "I built 140 SEO pages in 3 weeks. Google sent me one click." Indie Hackers post (undated). https://www.indiehackers.com/post/i-built-140-seo-pages-in-3-weeks-google-sent-me-one-click-Tpte8rPKC2689FwnsOvQ [read 2026-10-27; practitioner, one site]

WebFetch hit its hourly limit once; direct downloads (arXiv, OpenAlex) were refused by the proxy. PMC returned a captcha; source 8 was read from the UCL copy.

## 1. The typical page on a new site with no links gets about zero clicks

- 2,000 pages (100 unedited AI "how-to" articles on each of 20 new domains, no links, sitemaps submitted). Cumulative clicks: 244 at day 36, 1,062 at six months, 1,381 at month 16. Impressions at six months: 706,328. [vendor, 1; one experiment]
- Per page, that is about 0.5 clicks in six months and 0.7 in sixteen; about 350 impressions per page by six months, so roughly 1.5 clicks per 1,000 impressions. [derived from 1]
- Only 61–71% of pages were indexed at any point. Pages in the top 100 fell from 28% in month one to 3% at about three months. [vendor, 1]
- Limits: the pages were unedited AI text, not pages written by someone who knows the product, aimed at a named query. The per-page mean hides the spread; the source gives no per-page distribution. [derived]
- One founder: 140 tool pages on a site with no links, one month, 182 impressions a day, one click in total. [practitioner, 9; one site]
- Read with the Ahrefs rates already in the repo, the base rate for one page on a new, unlinked site is about zero clicks in the bets' 3-month window. [derived]

## 2. Rare queries do get clicked when a page ranks

- Searchers clicked a result after 49.5% of rare ("tail") queries and 58.0% of common ones. [research, 5, read; ~10M queries, 250,000 toolbar users; 2007]
- At position 1, queries of 10–15 words got 1.76× (summary) or 2.62× (body) the clicks of one-word queries; the page gives both figures. [vendor, 6; Search Console data from an unstated number of accounts]
- In Search Console, 46.77% of clicks come from queries Google hides as too rare to show (887,534 properties, 22 billion clicks, April 2025). The most common per-site share is 45–80%; low-traffic sites appear to lose more. [vendor, 2]
- About 93% of US keywords in Ahrefs' database get fewer than 10 searches a month. [vendor, 3]
- So long-tail clicks exist in total, but a single exact query is often too rare for a keyword tool to show volume or for Search Console to show the query. [derived from 2, 3]

## 3. Comparison queries are contested by third parties

- 500 "X vs Y" software keywords: mean 373 searches a month, keyword difficulty 23. Reddit held 8.1% of 4,523 top-10 results, Quora 2.2%; eight named review sites (G2, Software Advice, Capterra and others) about 15% between them. 10 of the 20 most frequent sites were review sites, 5 were software firms. 41% of the keywords showed a forum block and 35% an AI Overview. [vendor, 4; keyword choice not described]
- Low difficulty means a new page can rank. But a small vendor's page competes with review sites and forums that searchers may trust more. [derived]

## 4. Error queries go to Stack Overflow, and now to assistants

- Developer search results are dominated by Stack Overflow, then YouTube and W3Schools (1.3M developer queries; thousands of Google searches). [research, 7, secondary; error queries not split out]
- Stack Overflow posting fell about 25% relative to comparison sites within six months of ChatGPT, more for popular languages (difference-in-differences). [research, 8, read; posts, not page views]
- Fewer people searching an error on the web means fewer clicks to any error page, including a vendor's. The size of the search drop is not measured. [derived]

## What this changes

1. **Stop lines of both bets: add the likely case, zero.** Both stop lines assume clicks arrive. `comparison-pages` starts at "impressions but no clicks" and says "drop only if the query has no volume", which a founder cannot check: keyword tools show under 10 searches for 93% of queries [3] and Search Console hides rare queries [2]. `error-pages` has no branch for no clicks at all. Proposed, judged on the batch the effort covers (3 comparison pages; about 8 error pages):
   - `comparison-pages`: "Under about 10 search clicks across the first three pages after 3 months: stop writing new ones and keep the pages; try again once the site has links from a listing, launch or answers. Impressions but almost no clicks: rewrite the titles. Clicks but no sign-ups: rewrite the page."
   - `error-pages`: "Under about 10 search clicks across the first eight pages after 3 months: stop writing new ones. Clicks but no product clicks: keep as support content, stop writing new ones for acquisition."
   - The "about 10" line is a judgment call: section 1 predicts about 1–4 clicks for 3–8 untargeted pages on an unlinked site, so a batch that works should clear 10. [derived]
   - `measure` for both: count clicks per page in Search Console's Pages tab, since the exact query may be hidden [2].
   - Test: `matchSmallBets` with stage 0 and the developers audience returns `comparison-pages` and `error-pages`; each `stop` matches `/under about 10 search clicks/i`, and `comparison-pages.stop` no longer contains "no volume".
2. **`evidence: "some"`: no change.** The grades rest on evidence about readers: comparative ads persuade (item 42), developers paste error text (item 44). No source measures named-query pages, and the only denominator (section 1) is AI text on fresh domains. That is too weak to downgrade on, and the zero case belongs in the stop line. [derived]
3. **`ceiling: "steady"`: no change.** Per page the outcome is skewed: most pages get nothing and a few rank. But the bet is a batch of pages that keeps compounding if any rank, which is what "steady" means here. Changing to `lopsided` would raise the bets' score, the wrong direction for this evidence. [derived]

## What this does not settle

- No source measures pages aimed at one named query ("X alternative", exact error text) on a small site. Section 1 is general how-to content; per-page spread is not reported.
- Whether a site that already has a few links (a listing, a launch) does much better than section 1. Ahrefs shows a link–traffic correlation but no figures for few-link sites.
- How much error-message search has moved from search engines to assistants: source 8 measures posting, not searching.
- Sign-ups per click from comparison pages: only practitioner conversion claims, not used here.
