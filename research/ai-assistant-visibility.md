# AI assistant visibility — sources

Researched 2026-10-04 for knowledge/ai-assistant-visibility.md. Extends research/landscape-2026.md §4 (AI Overviews CTR, Aggarwal et al., llms.txt), which is not repeated here.

**Access caveat:** the egress proxy blocked platform.openai.com and developers.openai.com (direct fetch failed). No primary page was read directly. Items below come from search-engine summaries of the named URLs, tagged **[verified-search: domain, 2026-10-04]** when the summary clearly reflected the named first-party page, and **[not re-verified]** when it came only from third-party relays or memory. Search budget for this file: 15 queries. Re-read the primary pages before quoting exact wording to a client.

Evidence tags as in knowledge/_conventions.md.

## AI crawler user-agent tokens

| Company | Token | Purpose | Documented robots.txt behaviour | Source URL | Verified |
|---|---|---|---|---|---|
| OpenAI | GPTBot | Training (foundation models) | Respects robots.txt; independent of other OpenAI tokens | https://developers.openai.com/api/docs/bots (formerly platform.openai.com/docs/bots) | verified-search (page blocked; snippet) |
| OpenAI | OAI-SearchBot | Search index (ChatGPT search) | Respects robots.txt; blocked sites not shown in ChatGPT search answers (link + title may still appear); ~24 h to take effect | same | verified-search |
| OpenAI | ChatGPT-User | User-triggered fetch | "robots.txt rules may not apply" because user-initiated | same | verified-search |
| Anthropic | ClaudeBot | Training | Respects robots.txt | https://support.anthropic.com/en/articles/8896518 | verified-search (mainly via relays) |
| Anthropic | Claude-SearchBot | Search index / search quality | Respects robots.txt | same | verified-search (mainly via relays) |
| Anthropic | Claude-User | User-triggered fetch | Respects robots.txt (per relays; no exception stated) | same | not re-verified |
| Perplexity | PerplexityBot | Search/retrieval index | Respects robots.txt | https://docs.perplexity.ai/guides/bots | not re-verified (relays only) |
| Perplexity | Perplexity-User | User-triggered fetch | Generally ignores robots.txt (user-initiated) | same | not re-verified (relays only) |
| Google | Google-Extended | Control token (no own crawler): Gemini training + grounding in Gemini Apps / Vertex AI | Obeyed via robots.txt; does not affect Google Search inclusion or ranking (so not AI Overviews / AI Mode) | https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers | verified-search (relays quoting Google) |
| Google | Googlebot | Search index (also AI Overviews, AI Mode) | Respects robots.txt; renders JavaScript | same | not re-verified (well established) |
| Apple | Applebot-Extended | Control token: Apple AI training | Obeyed; "not considered in ranking for Search" | https://support.apple.com/en-us/119829 | verified-search (relays quoting Apple) |
| Apple | Applebot | Search (Siri, Spotlight) | Respects robots.txt; renders JavaScript | same | not re-verified |
| Microsoft | Bingbot | Search index (Bing, Copilot grounding) | Respects robots.txt | https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0 | not re-verified |

## Sources

### Crawlers and retrieval
1. OpenAI — "Overview of OpenAI Crawlers". https://developers.openai.com/api/docs/bots — Three bots: GPTBot (content "may be used in training our generative AI foundation models"), OAI-SearchBot (surfaces sites in ChatGPT search; opted-out sites "will not be shown in ChatGPT search answers"), ChatGPT-User (user actions; "robots.txt rules may not apply"). Settings independent; ~24 h for search systems to adjust. [first-party] [verified-search: snippet relay, 2026-10-04]
2. OpenAI Help — "Publishers and Developers – FAQ" (article 12627856). https://help.openai.com/en/articles/12627856-publishers-and-developers-faq — ChatGPT search uses third-party search providers plus partner content; ChatGPT adds utm_source=chatgpt.com to referral URLs; if a disallowed page's URL is known from a third-party provider, OpenAI may show only link and title (Atlas mentioned). [first-party] [verified-search: help.openai.com, 2026-10-04]
3. OpenAI — "Introducing ChatGPT search" (Oct 2024). https://openai.com/index/introducing-chatgpt-search/ — launch post. Naming Bing as a provider: [not re-verified].
4. Anthropic support — "Does Anthropic crawl data from the web, and how can site owners block the crawler?" (article 8896518). https://support.anthropic.com/en/articles/8896518 — ClaudeBot (training), Claude-User (user fetches), Claude-SearchBot (search quality); robots.txt honoured. [first-party] [verified-search: mainly third-party relays, 2026-10-04]
5. Perplexity — "Perplexity Crawlers". https://docs.perplexity.ai/guides/bots — PerplexityBot (index, follows robots.txt), Perplexity-User (user requests, generally ignores robots.txt). [first-party] [not re-verified: relays only]
6. Cloudflare blog, 2025-08-04 — "Perplexity is using stealth, undeclared crawlers to evade website no-crawl directives". https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives/ — undeclared user agents (Chrome on macOS), rotating IPs/ASNs; Perplexity removed from Cloudflare verified bots. Perplexity disputed, attributing traffic to BrowserBase. [vendor] [verified-search: press relays, 2026-10-04]
7. Google — "Google's common crawlers" (Google-Extended). https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers — Google-Extended controls Gemini training and grounding; "does not impact a site's inclusion in Google Search nor is it used as a ranking signal"; no separate user-agent string. [first-party] [verified-search: relays, 2026-10-04]
8. Apple — "About Applebot". https://support.apple.com/en-us/119829 — Applebot-Extended (June 2024) controls AI training use; rules "not considered in ranking for Search". [first-party] [verified-search: relays, 2026-10-04]
9. Vercel + MERJ — "The rise of the AI crawler", Dec 2024. https://vercel.com/blog/the-rise-of-the-ai-crawler — GPTBot 569M and Claude 370M requests in a month on Vercel (~20% of Googlebot's 4.5B); no evidence that OpenAI, Anthropic, Perplexity, Meta or ByteDance crawlers execute JavaScript (they fetch JS files: ChatGPT 11.50%, Claude 23.84% of requests); Gemini (Googlebot) and Applebot render. [vendor] [verified-search: vercel.com, 2026-10-04]
10. Bing Webmaster Blog — "Introducing AI Performance in Bing Webmaster Tools (Public Preview)", Feb 2026. https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/ — citations in Copilot, Bing AI summaries and select partners; metrics: total citations, average cited pages, grounding queries, page-level citation activity. "Citation Share" added 2026-06-16 (per secondary sources). [first-party] [verified-search: blogs.bing.com + SEJ, 2026-10-04]

### Citation sources
11. Profound — "AI Platform Citation Patterns: How ChatGPT, Google AI Overviews, and Perplexity Source Information" (Aug 2025 update; ~680M citations, Aug 2024–Jun 2025). https://www.tryprofound.com/blog/ai-platform-citation-patterns — Wikipedia 47.9% of ChatGPT's top-10 source share (7.8% of all citations); Reddit ~46.7% of Perplexity's top-10 share. [vendor] [verified-search: relays, 2026-10-04]
12. Semrush — "The Most-Cited Domains in AI: A 3-Month Study". https://www.semrush.com/blog/most-cited-domains-ai/ — Reddit, Wikipedia, YouTube, LinkedIn, Forbes among the most cited. The "15 domains ≈ 68% of citations" figure appeared in a relay, attribution unclear. [vendor] [not re-verified]
13. Ahrefs — 75,000-brand study of AI Overview brand visibility (mid-2025). — Correlations: branded web mentions 0.664, branded search volume 0.392, backlinks 0.218; 26% of brands had no AIO mentions; Dec 2025 follow-up extended to ChatGPT and AI Mode. [vendor] [verified-search: relays (Medium, X), 2026-10-04]
14. Ahrefs — ~12% of AI-cited URLs overlap Google top 10 (15k queries). [vendor] [not re-verified: relay only]
15. "Only ~11% of domains cited by both ChatGPT and Perplexity"; Perplexity commercial sources G2, Gartner, NerdWallet, PCMag, TripAdvisor, Yelp. — relayed in aggregator articles, original study unclear. [vendor] [not re-verified]
16. SparkToro (Rand Fishkin) with Gumshoe, Jan 2026; reported by MediaPost 2026-01-28 "AI Brand Recommendations: Chaotic, Inconsistent". https://www.mediapost.com/publications/article/412364/ai-brand-recommendations-chaotic-inconsistent.html — 600 volunteers, 12 prompts, ~2,961 runs across ChatGPT, Claude, Google AI; <1 in 100 chance of the same brand list twice; ~1 in 1,000 for same order. The "70% / earned media" trait appeared in a secondary summary only. [vendor] [verified-search: mediapost.com; earned-media detail not re-verified]

### AI shopping
17. OpenAI — Agentic Commerce Protocol / Instant Checkout (Sep 2025), spec at https://developers.openai.com/commerce/specs/checkout; co-developed with Stripe; Etsy live, Shopify merchants announced; applications at chatgpt.com/merchants. [first-party] [verified-search: relays + OpenAI community, 2026-10-04]
18. PayPal press release, 2025-10-28 — PayPal to support Instant Checkout in ChatGPT. [first-party: PayPal] [verified-search]
19. CNBC 2026-03-20; Digital Commerce 360 2026-03-06 — OpenAI ended Instant Checkout on 2026-03-20; discovery via ACP product feeds; purchase on retailer site or retailer ChatGPT apps (Walmart app launched same day); named ACP discovery partners incl. Target, Sephora, Nordstrom, Lowe's, Best Buy, Home Depot, Wayfair. Reported: ~12 Shopify merchants integrated; Walmart saw ChatGPT checkout conversion ~one-third of its site. OpenAI quote: "evolving our commerce strategy…". [secondary reporting] [verified-search: relays, 2026-10-04; merchant counts not re-verified]
20. Google — "New tech and tools for retailers to succeed in an agentic shopping era". https://blog.google/products/ads-commerce/agentic-commerce-ai-tools-protocol-retailers-platforms/ — Shopping Graph (Merchant Center data) grounds AI Mode/AIO/Gemini shopping; agentic checkout with select US merchants; Universal Commerce Protocol. "50B+ listings" from relays. [first-party] [verified-search: title + relays; details not re-verified]

### Policy
21. FTC Consumer Reviews and Testimonials Rule (16 CFR 465), 2024 — see research/seo-advanced.md item 13. [first-party: regulator]
22. Google spam policies (cloaking, hidden text, scaled content abuse) — see research/seo-advanced.md item 26. [first-party]

## Open questions
- Which third-party search providers ChatGPT uses today, and how much weight its own OAI-SearchBot index carries.
- Whether blocking training bots measurably lowers brand recommendations in later models. No study found.
- Whether citation-source shares (Wikipedia, Reddit) are stable; vendor studies show large shifts between 2024 and 2026 and use different prompt sets.
- No validated, public method for "AI visibility" scores; how large a prompt panel must be for a stable mention rate is not established.
- Whether Google Search Console will separate AI Mode / AI Overview citations as Bing now does.
- Current state of OpenAI's ACP feed programme and Google's agentic checkout outside the US; both change often.
- Whether Perplexity-User / ChatGPT-User fetches can be identified reliably in server logs (IP lists published vs spoofing).

## Verification addendum (2026-10-04)
- OpenAI docs (developers.openai.com/api/docs/bots; help.openai.com/en/articles/12627856-publishers-and-developers-faq; help.openai.com/en/articles/20001243): OAI-SearchBot surfaces sites in ChatGPT search; webmasters can allow OAI-SearchBot while disallowing GPTBot; OpenAI recommends allowing its published IP ranges; ~24 hours for robots.txt changes to take effect in search. [first-party, verified-search]
