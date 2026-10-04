# Content marketing, organic social and community, PR and influencers

Research date: 2026-10-04. **Access caveat:** page fetches were mostly blocked by the session proxy, and reddit.com/redditinc.com were refused by the search tool. Unless marked otherwise, every claim below comes from search-result snippets drawn from the named primary URL (domain-scoped searches). Tags: **[snippet-only]** = snippet from or quoting the primary source; **[fetched]** = page read directly; **[secondary]** = only a third-party write-up said it; **[not re-verified]** = well-known source not checked this session. Evidence tags follow knowledge/_conventions.md.

Supports: knowledge/content-marketing.md, knowledge/organic-social-and-community.md, knowledge/pr-and-influencers.md.

## Sources

### Content and thought leadership

1. **Edelman & LinkedIn. *Reaching Beyond the Ready: 2024 B2B Thought Leadership Impact Report*.** 2024 (PDF dated 2024-02). https://www.edelman.com/sites/g/files/aatuss191/files/2024-02/_2024%20Edelman-LinkedIn%20B2B%20Thought%20Leadership%20Impact%20Report%20Final.pdf ; LinkedIn summary https://www.linkedin.com/business/marketing/blog/research-and-insights/b2b-thought-leadership-research-impact-linkedin-edelman
   - Survey of 3,484 global business executives. 73% of decision-makers: thought leadership is a more trustworthy basis for assessing capabilities than marketing materials and product sheets. 90% more receptive to outreach from companies with consistent high-quality thought leadership. >75%: a piece of thought leadership led them to research a product they weren't considering. 60% willing to pay a premium. 54% spend 1+ hour/week reading it. [vendor] [snippet-only]
2. **Edelman & LinkedIn. *Invisible Influence: 2025 B2B Thought Leadership Impact Report*.** 2025 (PDF dated 2025-07; one-pager 2025-06). https://www.edelman.com/sites/g/files/aatuss191/files/2025-07/2025%20Edelman-LinkedIn%20B2B%20Thought%20Leadership%20Impact%20Report_FINAL.pdf ; one-pager https://www.edelman.com/sites/g/files/aatuss191/files/2025-06/2025%20B2B%20Thought%20Leadership%20Impact%20Report%20One%20Pager_FINAL.pdf
   - "Hidden buyers" (finance, operations, legal, procurement). >40% of B2B deals stall due to internal misalignment; 71% of hidden buyers have little/no direct contact with sales; 95% more receptive to outreach given strong thought leadership; 86% prefer content that challenges assumptions; 91% want insight into unseen challenges; 63% of hidden buyers vs 64% of target buyers spend >1 hour/week; 79% more likely to advocate for proposals from consistent producers. [vendor] [snippet-only; several figures via secondary write-ups e.g. mi-3.com.au 2025-09-04]
3. **Content Marketing Institute (CMI). *B2B Content Marketing Benchmarks, Budgets, and Trends: 2025*.** 2024/2025. https://contentmarketinginstitute.com/b2b-research/b2b-content-marketing-trends-research-2025
   - 1,186 respondents. Most effective (self-rated): video 58%, case studies 53%, e-books/white papers 45%, research reports 45%, short articles 43%. Used: short articles 92%, video 76%, case studies 75%. Measuring results is the 2nd most cited challenge (47%); reasons include inability to tie to business goals (44%). 46% expected budget increase in 2025. [vendor] [snippet-only]
4. **Weinberg, G. & Mares, J. *Traction*.** Portfolio, 2015. "Engineering as marketing" channel. [practitioner] [not re-verified; already in research/brand-growth-channels.md]

### Platform ranking statements (first-party)

5. **Twitter Engineering. "Twitter's Recommendation Algorithm".** 2023-03-31. https://blog.x.com/engineering/en_us/topics/open-source/2023/twitter-recommendation-algorithm ; code https://github.com/twitter/the-algorithm
   - Candidate sources pull ~1,500 posts per request; For You is on average 50% in-network / 50% out-of-network; Home Mixer service; logistic-regression ranking for in-network candidates. [first-party] [snippet-only; publication day not re-verified]
6. **xai-org. *x-algorithm* README.** GitHub, last updated 2026-09-18. https://github.com/xai-org/x-algorithm
   - Phoenix model predicts positive actions ("favorite · reply · repost · quote · share · share via DM · share via copy link", clicks, dwell time, video views) and negative actions ("not interested · mute author · block author · report · not dwelled"); Final Score = Σ(weight × P(action)); weights scale probabilities, not raw counts. In-network via "Thunder"; out-of-network via Phoenix retrieval and SimClusters. Adjustments: author-diversity decay, out-of-network discount (factor below 1), new-author boost. [first-party] [fetched via raw.githubusercontent.com]
7. **LinkedIn Engineering. "Understanding dwell time to improve LinkedIn feed ranking".** https://www.linkedin.com/blog/engineering/feed/understanding-feed-dwell-time
   - Two dwell types: on the feed (≥ half of update visible) and after the click; dwell is always measurable and real-valued, so it adds signal beyond clicks/viral actions. [first-party] [snippet-only; year not confirmed, believed 2020]
8. **LinkedIn statements on "knowledge and advice" and engagement bait.** Reported in many LinkedIn posts and trade articles (2023–2025). No first-party page surfaced in search. [first-party via secondary] [not re-verified]
9. **LinkedIn. *The Official Guide to Employee Advocacy*** (ebook) and blog "The Real Value of Your Employees' Social Media Reach" (2017). https://business.linkedin.com/content/dam/me/business/en-us/elevate/Resources/pdf/official-guide-to-employee-advocacy-ebook.pdf ; https://business.linkedin.com/marketing-solutions/blog/linkedin-elevate/2017/the-real-value-of-your-employees-social-media-reach
   - Employee networks ~10× a company's follower base; 2× CTR when shared by employees. Other figures in the same snippets (24× reshares, 8× engagement, 3× trust, sales reps 45% more likely to exceed quota) could not be tied to a specific LinkedIn page; not used. [vendor: LinkedIn sold Elevate] [snippet-only]
10. **Instagram (Mosseri, A.). "Instagram Ranking Explained".** Updated 2023-05-31. https://about.instagram.com/blog/announcements/instagram-ranking-explained
   - Separate ranking per surface; thousands of signals; Feed predicts spending a few seconds, commenting, liking, resharing, tapping profile; Explore weights likes, saves, shares. [first-party] [snippet-only]
11. **Mosseri on top signals, January 2025** (video), reported by e.g. blckalpaca.at, alxo.ae, socialday.live. Watch time, likes per reach, sends per reach; likes weigh more with followers, sends more with non-followers. [first-party via secondary] [secondary]
12. **TikTok Newsroom. "How TikTok recommends videos #ForYou".** 2020-06. https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you ; Transparency Center https://www.tiktok.com/transparency/en-us/recommendation-system/
   - Factors: user interactions, video information, device/account settings; strong signals (finishing a longer video) weigh more; follower count and previous high-performing videos are not direct factors; feed avoids two videos in a row with the same sound or creator. [first-party] [snippet-only; date not re-verified]
13. **YouTube Blog (Goodrow, C.). "On YouTube's recommendation system".** 2021-09. https://blog.youtube/inside-youtube/on-youtubes-recommendation-system/
   - 80 billion+ signals; clicks, watch time, survey responses, sharing, likes, dislikes; "valued watchtime" from 1–5 star surveys, only 4–5 counted. [first-party] [snippet-only; author/date not re-verified]
14. **Facebook News Feed change, January 2018** (Zuckerberg post; "Bringing People Closer Together", Mosseri, Facebook Newsroom, 2018-01-11). Fewer public posts from businesses and media, more from friends and family. [first-party] [not re-verified]

### Reddit and community

15. **Reddit Help. "Spam".** https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam
   - Promotional content is not inherently spam; if contributions are primarily links to a business you run or benefit from, be thoughtful about frequency or use Reddit ads; "Some communities abide by the 10% rule"; moderators decide what's spam in their community. [first-party] [snippet-only]
16. **CMX. "SPACES Model: The Framework for Defining Your Community's Business Value".** David Spinks/CMX. https://cmxhub.com/the-spaces-model/ ; https://www.cmxhub.com/blog/spaces-framework-in-action-match-your-community-work-to-business-goals
   - Support, Product, Acquisition, Content (originally "Contribution"), Engagement, Success. [practitioner] [snippet-only; the C wording differs between pages]
17. **CMX. *Community Industry Report 2025*** (via CMX blog). Only 24% can confidently quantify community value; value areas: support 24%, success 22%, acquisition 20%, retention 19%, content 6%, product feedback 6%. [vendor/practitioner survey] [snippet-only; sample size not seen]
18. **Orbit. *The Orbit Model*.** GitHub, orbit-love/orbit-model. https://github.com/orbit-love/orbit-model
   - Framework for "high gravity" communities from developer advocates; Love (activity), Reach (influence), Gravity; Orbit levels (originally Ambassador, Fan, User, Observer; renamed July 2021). Not under active development. [practitioner] [snippet-only]

### PR

19. **Muck Rack. *The State of Journalism 2026*.** https://muckrack.com/resources/research/state-of-journalism
   - 897 usable journalist responses; 86% say at least some of their work began with a PR pitch; 69% prefer pitches under 200 words; 82% use AI; only 2% average overlap between the journalists most pitched on Muck Rack and those most pitched by AI. [vendor] [snippet-only]
20. **Muck Rack. "3 data-driven tips to secure more earned media placements in 2025".** 2025-01-03. https://muckrack.com/blog/2025/01/03/data-driven-tips-to-secure-more-earned-media ; webinar FAQs https://muckrack.com/blog/2025/07/09/state-of-journalism-2025-webinar-faqs
   - 73% of journalists reject pitches as not relevant to their coverage (top reason); email preferred over calls; personalisation expected. [vendor] [snippet-only; which year's survey the 73% comes from is unclear]
21. **Cision. *2025 State of the Media Report*.** https://www.cision.com/resources/guides-and-reports/2025-state-of-the-media-report/ ; press release https://www.cision.com/about/press-releases/2025-press-releases/cisions-2025-state-of-the-media-report-reveals-a-tipping-point-for-trust-technology-and-pr-journalist-partnerships-302448410/
   - 3,000+ journalists, 19 markets. 72% say press releases are the most useful resource from PR; preferred formats: press releases 74%, original research 61%, exclusives 55%; 61% value industry data. [vendor] [snippet-only]
22. **Google Search Central. "Spam policies for Google web search"** (link spam section). https://developers.google.com/search/docs/essentials/spam-policies ; "Qualify outbound links" https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links
   - Link schemes include paid advertorials with links that pass ranking credit, and optimized-anchor-text links in articles, guest posts or press releases distributed on other sites; sending a product in exchange for a review with a link; sponsored links fine when qualified with rel="sponsored" or "nofollow". [first-party] [snippet-only]

### Influencers and law

23. **FTC. "Federal Trade Commission Announces Updated Advertising Guides to Combat Deceptive Reviews and Endorsements".** Press release, 2023-06-29. https://www.ftc.gov/news-events/news/press-releases/2023/06/federal-trade-commission-announces-updated-advertising-guides-combat-deceptive-reviews-endorsements ; 16 CFR Part 255 https://www.ftc.gov/legal-library/browse/federal-register-notices/16-cfr-part-255-guides-concerning-use-endorsements-testimonials-advertising
   - Six major revisions: review manipulation principle; incentivized, employee and fake negative reviews; "clear and conspicuous" defined, built-in platform tools may be inadequate; endorsement definition covers fake reviews, virtual influencers, tags; liability of advertisers, endorsers, intermediaries; child-directed ads. Published in the Federal Register 2023-07-26. FAQ "What People Are Asking" updated with 40 new questions. [first-party] [snippet-only; press-release day not re-verified]
24. **FTC. "Disclosures 101 for Social Media Influencers".** 2019-11 (still current). https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers
   - Disclose material connections (financial, employment, personal, family, free/discounted products); "ad", "advertisement", "sponsored" work; hashtag optional; in videos disclose in the video, ideally audio and visual; superimpose on image stories with time to read. [first-party] [snippet-only]
25. **FTC. Trade Regulation Rule on the Use of Consumer Reviews and Testimonials (16 CFR Part 465).** Announced 2024-08-14; effective 2024-10-21. https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials ; Q&A https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers
   - Bans fake reviews/testimonials (incl. AI-generated, non-users), conditional incentives for particular sentiment, undisclosed insider reviews; influencers lying about use can be liable; civil penalties up to $53,088 per violation (inflation-adjusted figure as cited in Q&A). Also covers fake social media indicators [not re-verified this session]. [first-party] [snippet-only; announcement day not re-verified]
26. **FTC. "FTC Warns 10 Companies About Possible Violations of the Agency's New Consumer Review Rule".** Press release, 2025-12. https://www.ftc.gov/news-events/news/press-releases/2025/12/ftc-warns-10-companies-about-possible-violations-agencys-new-consumer-review-rule [first-party] [snippet-only, title only]
27. **Influencer Marketing Hub. *Influencer Marketing Benchmark Report*** (2025 and 2026 editions). https://influencermarketinghub.com/influencer-marketing-benchmark-report/
   - 2024 Instagram engagement: nano 1.73%, micro 1.22%, macro 0.61%, mega 0.68%; TikTok nano 10.3%; ~75.9% of Instagram influencers are nano tier. [vendor] [snippet-only; figures assembled from several IMH pages, methods not seen]
28. **Vendor price guides**: Later "Influencer Pricing Benchmarks" https://later.com/blog/influencer-pricing-benchmarks-the-complete-2026-guide/ ; impact.com https://impact.com/influencer/how-much-do-influencers-charge-per-post/ ; IMH "Instagram Influencer Rates" https://influencermarketinghub.com/instagram-influencer-rates/
   - Search summaries gave conflicting ranges: e.g. micro (10k–100k) Instagram posts from ~$500–$2,500 in one set and $2,000–$8,000 in another; mapping of each range to a specific vendor was not verified. Used only to say ranges disagree. [vendor] [snippet-only]
29. **Meta Business Help: Partnership Ads Hub, Brand Collabs Manager, "About Paid Partnerships on Facebook".** https://www.facebook.com/business/help/526786565561304 ; https://www.facebook.com/business/help/867719723973992 ; https://www.facebook.com/business/help/213764212711862 [first-party] [snippet-only]. No Meta performance claim for partnership ads was found.

### Not searched; background only
30. Barcelona Principles (AMEC, 2010; updated 2015, 2020, "3.0") rejecting AVE as a measure of PR value. https://amecorg.com/barcelona-principles-3-0/ [practitioner] [not re-verified]
31. UK CAP Code / ASA influencer guidance. [first-party] [not re-verified]

## Open questions

- LinkedIn: no first-party page found for the "knowledge and advice" / anti-engagement-bait ranking statements; dwell-time post year unconfirmed. LinkedIn's 2025 feed model changes (reported as an LLM-based ranker) not checked.
- Mosseri's January 2025 "three signals" statement seen only in secondary write-ups.
- Facebook 2018 News Feed change and any data on brand-page organic reach decline over time not re-verified; no quantitative first-party figure for brand vs person reach on LinkedIn beyond the vendor 10× network-size claim.
- Muck Rack 73% "not relevant" figure: which survey year.
- CMX 2025 report sample size and method; the original SPACES "C" (Contribution vs Content).
- Influencer pricing: no neutral, method-transparent source. Engagement-rate definitions (per follower vs per reach) differ by vendor.
- Partnership/Spark ads: no first-party or independent performance evidence found.
- FTC civil-penalty amount is inflation-adjusted yearly; confirm the current figure before quoting. Status of FTC enforcement under the 2025–2026 Commission beyond the Dec 2025 warning letters unknown.
- No peer-reviewed evidence found this session on the ROI of content marketing, founder-led content, employee advocacy or owned communities; all guidance there is practitioner or vendor.
