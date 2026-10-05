# Small bets: being present where people already look

Researched 2026-10-05 for a "small bets" playbook: cheap, low-risk marketing moves any business can try, each measured on its own, kept if it works and dropped if not. This note covers seventeen "presence" bets. Bets 1–9: listings in stores and directories; open-source pieces; social accounts; building in public; changelogs and roadmaps; free tools and embeds; integrations and plugins; publishing your own data; comparison pages and help docs. Bets 10–17: shareable outputs; generated pages from your own data; a one-command try; error-message pages; teardowns; an automated weekly digest; startup and student perk programmes; an overlay browser extension. Each bet has "Needs" (what must already exist) and "Earliest stage": 0 = no users, 1 = first 1–20 users, 2 = steady use (roughly hundreds of active users or regular traffic), 3 = something newsworthy.

**Scope and access caveat (2026-10-05).** Most first-party docs (GitHub, VS Code, Chrome Web Store, Slack, Zapier, MCP, Google Search Central, Netlify, Buffer, G2) and several papers could be read. These hosts were blocked or rate-limited: alternativeto.net (403), sciencedirect.com and dl.acm.org (403), support-dev.discord.com (403), demandgenreport.com (403), Semantic Scholar and OpenAlex (429 after a few calls). Two abstracts were read through the Crossref API instead. Pew's platform-usage figures load from a chart file that could not be read, so only Pew's text summary is used.

**Tags.** Evidence type: [research] peer-reviewed or preprint; [first-party] the platform's own docs or the company's own statement about itself; [vendor] a firm that sells something related to the claim; [practitioner] a founder's or operator's account; [secondary] someone else's summary. Access: [read 2026-10-05] means the source itself was read; [read 2026-10-05; abstract] means only the abstract; [snippet-only] means only search-result text was seen. Do not quote a snippet-only figure as fact.

**Existing notes are cited, not redone.** "See research/X item N" points to a source in that note, and "§N" to a section.

**One warning applies to every bet.** Nearly all the success stories here come from companies that survived and chose to tell their story. Nobody publishes "we listed on 40 directories and nothing happened". Treat every founder case as proof that something *can* work, not as a rate of how often it does.

## Sources

### Listings: stores, registries, directories, review sites
1. **Model Context Protocol docs, "The MCP Registry".** https://modelcontextprotocol.io/registry/about [first-party] [read 2026-10-05]. Still marked "currently in preview. Breaking changes or data resets may occur". The registry is "intended to be consumed primarily by downstream aggregators, such as MCP server marketplaces", and "is not intended to be directly consumed by host applications". It holds metadata only (a `server.json`), and the package itself lives on npm, PyPI, Docker Hub and so on. Names use reverse-DNS form and are tied to a GitHub account or a domain checked through GitHub, DNS or HTTP challenges. It accepts open- and closed-source servers if they are publicly installable or reachable, and does not accept private servers. Aggregators are expected to pull "once per hour". Earlier status notes are in research/developer-tools.md items 10–11.
2. **GitHub Docs, "Publishing actions in GitHub Marketplace".** https://docs.github.com/en/actions/how-tos/create-and-publish-actions/publish-in-github-marketplace [first-party] [read 2026-10-05]. Requirements: accept the Marketplace Developer Agreement; a public repo; a single `action.yml` at the root; a unique name; two-factor authentication. You publish from a release. There is no human review. A "verified creator" badge is available to organisations on request.
3. **GitHub Docs, "Requirements for listing an app" and "About GitHub Marketplace for apps".** https://docs.github.com/en/apps/github-marketplace/creating-apps-for-github-marketplace/requirements-for-listing-an-app ; https://docs.github.com/en/apps/github-marketplace/github-marketplace-overview/about-github-marketplace-for-apps [first-party] [read 2026-10-05]. Free apps have no install minimum. Paid apps need "a minimum of 100 installations" (GitHub Apps) or "200 users" (OAuth apps), an organisation owner, publisher verification and a verification request for the listing.
4. **VS Code docs, "Publishing Extensions".** https://code.visualstudio.com/api/working-with-extensions/publishing-extension [first-party] [read 2026-10-05]. You need a publisher ID, and the publisher ID and display name cannot be changed later. Authentication is by Azure DevOps personal access token, but global tokens "retire December 1, 2026", so Microsoft Entra ID is recommended. No SVG icons, and README image links must use https. The "verified publisher" badge needs an extension listed for at least 6 months and a domain at least 6 months old, verified by a DNS TXT record. Review takes about 5 business days.
5. **Chrome Web Store, "Program Policies"** and **"Metrics" docs.** https://developer.chrome.com/docs/webstore/program-policies/policies ; https://developer.chrome.com/docs/webstore/metrics [first-party] [read 2026-10-05]. Rules: a "single purpose that is narrow and easy to understand"; no duplicate extensions; keyword spam includes repeating a keyword "more than 5 times"; a privacy policy is required if you handle user data; 2-Step Verification is required. The dashboard reports impressions, installs and uninstalls by country, language and OS. The docs read do not mention UTM-style source tracking; for more detail you opt in to Google Analytics 4.
6. **Slack, "Slack Marketplace app guidelines and requirements".** https://docs.slack.dev/slack-marketplace/slack-marketplace-app-guidelines-and-requirements/ [first-party] [read 2026-10-05]. Apps "installed on less than 10 active workspaces and have less than 10 weekly active users" are ineligible. Other requirements: TLS 1.2+, the OAuth state parameter, signed request verification, a privacy policy covering collection, use, retention and deletion requests, and support replies within 2 business days. Listed apps must "demonstrate active usage to remain listed".
7. **Zapier docs, "Public integration" and "Integration publishing requirements".** https://docs.zapier.com/integrations/publish/public-integration ; https://docs.zapier.com/platform/publish/integration-publishing-requirements [first-party] [read 2026-10-05]. A new public integration stays "in beta for 90 days". Review contact comes "in 1 week or less". You leave beta early after one Zapier signup through an embedded Zapier tool. Every trigger and action needs a successful run in Zap history. A "3 users with a live Zap" rule appeared in search text but was not seen on the pages read [snippet-only].
8. **Discord docs, "Enabling Discovery".** https://docs.discord.com/developers/discovery/enabling-discovery [first-party] [read 2026-10-05]. The team owner must complete identity and app verification first, and an app can take "up to 24 hours" to appear in the App Directory. The help-center pages were blocked. Search text from them says verification is required to grow past 100 servers, that a public privacy policy and terms of service are required, and that at least one tag is needed [snippet-only]. Bot rules are in research/community-and-hobby-products.md items 5–8.
9. **G2, "Plans".** https://sell.g2.com/plans [vendor] [read 2026-10-05]. Free: claim a profile, collect reviews, standard seller page, eligibility for the "Users Love Us" badge. Starter: $299/month or $2,999/year, for 1–100 employees. G2 says it is "not a pay-to-play ranking system".
10. **Wikipedia, "Capterra".** https://en.wikipedia.org/wiki/Capterra [secondary] [read 2026-10-05]. Vendors "may list their products without charge and pay on a pay-per-click basis to appear in sponsored positions". G2's purchase of Capterra, Software Advice and GetApp from Gartner was announced in January 2026 and "closed on February 5, 2026". Search text gives 29 Jan 2026 as the announcement date (investing.com, Demand Gen Report) [snippet-only].
11. **G2, "New G2 Research: AI Is Reshaping How B2B Software Deals Are Won and Lost" (2026 Buyer Behavior Report).** https://company.g2.com/news/buyer-behavior-2026 [vendor] [read 2026-10-05]. Published 22 Jul 2026. Sample: 1,000+ B2B software buyers. 82% consulted AI chatbots for software recommendations. The top influences on shortlists were review sites (38%) and AI chatbots (37%). G2 sells review-site listings.
12. **G2 Learn, "Do Software Review Platforms Show Up More in the Bottom of the Funnel?"** https://learn.g2.com/do-software-review-platforms-show-up-more-in-the-bottom-of-the-funnel [vendor] [read 2026-10-05]. Dec 2025. About 35,000 US ChatGPT citation URLs, coded by buyer stage. Review platforms made up 7.4% of citations at discovery and 13.2% at evaluation. G2's own group of sites took 84% of review-platform citations.
13. **Strive Labs, "Do G2 and Capterra Feed AI Answers? The Evidence Conflicts."** https://strivelabs.ai/blog/g2-capterra-ai-answers/ [secondary/vendor] [read 2026-10-05; the underlying studies were not read]. It summarises both sides. A June 2026 test ran 40 B2B SaaS categories through ChatGPT ten times each (233 recommendations); G2 and Capterra got zero direct citations, and review aggregators were 0.9% of citations. G2's own analysis of 30,000 citations found 10% more reviews went with 2% more citations, with R² = 0.009 (reviews explain under 1% of the variation). Other studies are relayed with no method shown.
14. **Guo, H. et al. "A Measurement Study of Model Context Protocol Ecosystem." arXiv:2509.25292** (v3, 15 Nov 2025). https://arxiv.org/abs/2509.25292 [research; preprint] [read 2026-10-05; abstract]. Six MCP markets crawled for 14 days. Of 17,630 raw entries, 8,401 were valid projects (8,060 servers, 341 clients). "More than half of listed projects are invalid or low-value."
15. **Chidambaram, N., Dalle Lucca Tosi, M. & Cabot, J. "A Two-Dimensional Study of the Model Context Protocol: Publication and Adoption." arXiv:2609.14721** (13 Sep 2026). https://arxiv.org/abs/2609.14721 [research; preprint] [read 2026-10-05; abstract]. 33,319 MCP-related GitHub repos. Growth peaked in March 2026. 93.7% of repos use MCP as infrastructure.
16. **sindresorhus/awesome, pull request template.** https://raw.githubusercontent.com/sindresorhus/awesome/main/pull_request_template.md [first-party] [read 2026-10-05]. Rules for adding a *list* to the master list: the list must be at least 30 days old, not AI-generated, and pass `awesome-lint`; the submitter must review at least 4 other open pull requests; "Fully AI-generated pull requests are not accepted". The repo title in search results says pull requests are "temporarily disabled" [snippet-only]. Each topic list has its own rules for adding a single item.

### Open source
17. **Koch, S., Klein, D. & Johns, M. "The Fault in Our Stars: An Analysis of GitHub Stars as an Importance Metric for Web Source Code." MADWeb workshop (NDSS) 2024.** doi:10.14722/madweb.2024.23004. https://www.ias.cs.tu-bs.de/publications/GithubTranco.pdf [research; peer-reviewed workshop] [read 2026-10-05]. 925,978 projects in PHP, Ruby and JavaScript. Stars and registry downloads correlate weakly: 0.47 for PHP down to 0.14 for JavaScript. For 58 client-side JavaScript libraries detected on real websites, deployments correlated 0.61 with stars and 0.63 with downloads. Download counts are inflated by CI builds.
18. **Zerouali, A., Mens, T., Robles, G. & Gonzalez-Barahona, J. M. "On the Diversity of Software Package Popularity Metrics: An Empirical Study of npm." SANER 2019.** https://arxiv.org/abs/1901.04217 [research] [read 2026-10-05; abstract]. 175,000 npm packages and nine popularity metrics from three sources. The metrics are mostly unrelated to each other. Search text gives a strongest cross-source correlation of ρ = 0.54 [snippet-only].
19. **Borges, H. & Valente, M. T. "What's in a GitHub Star?" Journal of Systems and Software 146 (2018).** https://arxiv.org/abs/1811.07643 [research] [read 2026-10-05; abstract]. Survey of 791 developers: "three out of four developers consider the number of stars before using or contributing to a GitHub project". Also cited as research/early-stage-gtm.md [56].
20. **GitHub Docs, "Viewing traffic to a repository".** https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/viewing-traffic-to-a-repository [first-party] [read 2026-10-05]. Anyone with push access sees clones, visitors, referring sites and popular content for the past 14 days only.

### Social media
21. **Mora Cortez, R., Johnston, W. J. & Ghosh Dastidar, A. "Managing the content of LinkedIn posts: Influence on B2B customer engagement and sales?" Journal of Business Research 155 (2023).** https://ideas.repec.org/a/eee/jbrese/v155y2023ipas0148296322008530.html [research] [read 2026-10-05; abstract]. One "new, steadily growing B2B firm", 106 weeks of data, VARX model (a time-series model). Followers and website visits drove sales revenue; "sales" posts drove followers; no post type drove sales directly. Search text gives elasticities: 1% more new followers went with 0.591% more sales revenue [snippet-only].
22. **Mooney, A. C., Song, R. & Zhang, Y. "The Power of Posting: An Examination of CEO Social Media Celebrity." Journal of Management Studies 63(5):2123–2155.** doi:10.1111/joms.13279 [research] [read 2026-10-05; abstract via OpenAlex]. 320 S&P 1500 CEOs and 250,000+ posts on X, 2009–2021. Posting volume, positive tone and variety of topics were linked to becoming a "social media celebrity"; unique posts were not. These are large public companies.
23. **Buffer, "The State of Social Media Engagement in 2026".** https://buffer.com/resources/state-of-social-media-engagement-2026/ [vendor] [read 2026-10-05]. 5 Mar 2026. 52M+ posts. Within-account models compare each account with its own baseline. Finds a "no-post penalty": weeks without a post underperform the account's own baseline, and 1–2 posts a week beat silence. Replying to comments went with higher engagement (LinkedIn +30%, Threads +42%, Instagram +21%). Median engagement rates: LinkedIn ~6.2%, X ~2.5%.
24. **Buffer, "How Often Should You Post on Instagram".** https://buffer.com/resources/how-often-to-post-on-instagram/ [vendor] [read 2026-10-05]. 13 Aug 2025. 2.1M posts from 102,000+ accounts, with fixed-effects (within-account) models. Weekly follower growth was +0.12% at 1–2 posts a week, +0.26% at 3–5, +0.44% at 6–9 and +0.66% at 10+, with diminishing returns.
25. **LinkedIn personal profile vs company page multipliers** (whitehat-seo.co.uk, digitalapplied.com, indulge.digital and others, 2025–2026, some citing R. van der Blom's "Algorithm Insights"). [practitioner/vendor] [snippet-only]. The relays disagree: "8x" engagement, "561%" more reach, "5x" engagement. No method was seen. The only first-party figure is LinkedIn's own claim that employee networks are about 10× a company's follower base (research/content-social-pr.md item 9).
26. **Pew Research Center, "Social Media Fact Sheet".** https://www.pewresearch.org/internet/fact-sheet/social-media/ [research] [read 2026-10-05; text only, chart figures not readable]. YouTube and Facebook are the most widely used platforms among US adults; about half use Instagram; smaller shares use TikTok, Reddit, Snapchat and X.

### Building in public
27. **Haynam, J. "The Transparency Movement: Why It's Important." Buffer Resources**, 23 Apr 2015. https://buffer.com/resources/transparency-movement/ [practitioner] [read 2026-10-05]. Buffer shared revenue from Sept 2013; monthly revenue went from $12,000 to nearly $500,000 by 2015. Risks the article names: "similar products emerged within months", extra scrutiny, and less focus. It is a before-and-after story with no comparison group.
28. **Tringas, T. "Digging in to the Open Startups List."** 24 Apr 2015. https://tylertringas.com/digging-in-to-the-open-startups-list/ [practitioner] [read 2026-10-05]. Seven companies with public Baremetrics dashboards (Buffer, Ghost, Baremetrics, Hubstaff, ConvertKit, Promoter, Storemapper). It describes their numbers and does not test whether openness helped.
29. **Wilhelm, A. "Radical Transparency And How Buffer Is Changing The Game On Startup Culture." TechCrunch**, 13 Feb 2014. https://techcrunch.com/2014/02/13/radical-transparency-and-how-buffer-is-changing-the-game-on-startup-culture [secondary] [read 2026-10-05]. After Buffer published salaries, "the company saw an uptick in applications for open roles". The often-quoted "applications doubled to 3,864" was not found on any page read [snippet-only].
30. **Gascoigne, J. "Tough News: We've Made 10 Layoffs…" Buffer**, 16 Jun 2016. https://buffer.com/resources/layoffs-and-moving-forward/ [first-party] [read 2026-10-05]. 10 layoffs (11% of staff) with $1.3M in the bank. Headcount went from 34 to 94 in a year while revenue lagged. The post-mortem was public. This is what a transparent company's bad news looks like.

### Changelogs and release notes
31. **Bi, T., Xia, X., Lo, D., Grundy, J. & Zimmermann, T. "An Empirical Study of Release Note Production and Usage in Practice." IEEE Transactions on Software Engineering (online 2020).** https://soarsmu.github.io/papers/2021/Release%20Note%20Production%20and.pdf [research] [read 2026-10-05; PDF text]. 32,425 release notes from 1,000 GitHub projects, 15 interviews and 314 survey answers. The most common contents are fixed issues (79.3% of notes) and new features (55.1%). Writers and readers disagree on what a note needs. The study is descriptive and measures no business outcome.
32. **Yang, A. Z. H., Hassan, S., Zou, Y. & Hassan, A. E. "An empirical study on release notes patterns of popular apps in the Google Play Store." Empirical Software Engineering 27:55 (2022).** doi:10.1007/s10664-021-10086-2. https://sailresearch.github.io/sail-website/data/pdfs/2022_An_empirical_study_on_release_notes_patterns_of_popular_apps_in_the_Google_Play_Store.pdf [research] [read 2026-10-05; abstract and results text]. 69,851 releases and 67.7M reviews of 2,232 top free apps (Apr 2016–Apr 2019), plus a survey of 102 developers. Notes tend to be either long (over 50 words) or tiny (under 7 words). "Apps with longer release notes tend to have higher average user ratings." Moving from rare to frequent updates went with higher ratings. Correlational.
33. **Beamer, "Changelog" product page.** https://www.getbeamer.com/changelog [vendor] [read 2026-10-05]. Claims "520% ROI", "3x improvement in user engagement" and "180% increase in new feature adoption", with no method or source given. One customer quote claims "30% higher adoption" after replacing update emails.
34. **LaunchNotes, "Why Your Customers Are Ignoring Your Product Release Notes".** https://www.launchnotes.com/blog/why-customers-ignore-product-release-notes [vendor] [read 2026-10-05]. Argues "Publish is not communicate" and gives no numbers on the page. Search text attributes "over 83% of consumers report regularly consuming release notes" and update-email open rates of "20–25%" to LaunchNotes pages [snippet-only].

### Free tools, widgets, badges
35. **HubSpot blog, "HubSpot Launches Free Marketing Grader Tool to Replace Website Grader"** (updated 2 Jun 2020) and **"Website Grader relaunch"** (updated 14 Nov 2023). https://blog.hubspot.com/blog/tabid/6307/bid/29274/hubspot-launches-free-marketing-grader-tool-to-replace-website-grader.aspx ; https://blog.hubspot.com/marketing/website-grader-relaunch [first-party] [read 2026-10-05]. "Graded more than 4 million websites". The posts disagree on the launch year (2006 vs 2007). No lead or customer figures are given.
36. **Google Search Central Blog, "A reminder about widget links"** (Sept 2016). https://developers.google.com/search/blog/2016/09/a-reminder-about-widget-links [first-party] [read 2026-10-05]. "If you're distributing widgets, we'd recommend using nofollow on the links in your widget." Keyword-rich, hidden or low-quality widget links count as link spam (see also research/content-social-pr.md item 22).
37. **Netlify Docs, "Powered by Netlify badge".** https://docs.netlify.com/manage/projects/powered-by-netlify-badge/ [first-party] [read 2026-10-05]. New Free-plan public projects created on or after 19 Aug 2026 show the badge by default; owners can turn it off and visitors can hide it. It makes no network requests. No performance figures are given. It shows a current, real use of a "powered by" loop.

### Integrations and plugins
38. **Ceccagnoli, M., Forman, C., Huang, P. & Wu, D. J. "Cocreation of Value in a Platform Ecosystem: The Case of Enterprise Software." MIS Quarterly 36(1):263–290 (2012).** doi:10.2307/41410417 [research] [read 2026-10-05; abstract via Crossref]. 1,210 small independent software vendors, 1996–2004. Joining a major platform owner's ecosystem (SAP's partner programme) "is associated with an increase in sales and a greater likelihood of issuing an initial public offering". The effect was larger for vendors with stronger intellectual-property rights or stronger downstream (sales and service) capabilities.

### Original data and research
39. **Fractl, "3 Data-Driven Link-Building Insights".** https://www.frac.tl/work/marketing-research/link-building-study/ [vendor: digital PR agency] [read 2026-10-05]. 31,000 media placements and 26,000 links from client campaigns over three years. "54.2% of links from sites with domain authority (DA) over 59 got zero shares". Link value depends on placement, anchor text and nofollow.
40. **Backlinko, "Original Research and Data" hub.** https://backlinko.com/hub/seo/original-research [vendor] [read 2026-10-05]. Relays BuzzSumo's "47% of all marketers are using original research" (undated). Backlinko's own ranking-factors study earned "79,000+" backlinks, which is one survivor case. A widely relayed "original research earns 6.4× more links" figure was not found on any page read [snippet-only].

### Comparison pages
41. **Google Search Central, "Write high quality reviews"** (last updated 2025-12-10). https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews [first-party] [read 2026-10-05]. Advice: "Explain what sets something apart from its competitors"; "Cover comparable things to consider, or explain which might be best for certain uses"; give first-hand evidence; make ranked lists useful enough to "stand on their own".
42. **Grewal, D., Kavanoor, S., Fern, E. F., Costley, C. & Barnes, J. "Comparative Versus Noncomparative Advertising: A Meta-Analysis." Journal of Marketing 61(4):1–15 (1997).** doi:10.1177/002224299706100401 [research] [read 2026-10-05; abstract via Crossref]. Comparative ads beat non-comparative ads on attention, awareness, processing, brand attitude and purchase intention and behaviour, but "evoke lower source believability and a less favorable attitude toward the ad". "New brands comparing themselves to established brands appear to benefit most."

### Hobby-site embed example
43. **Wowhead tooltip script ("Powered by Wowhead").** Descriptions on third-party pages (drupal.org group post, WordPress plugin mirror on GitHub, a 2009 blog post) [practitioner] [snippet-only]. A forum or blog adds one script from Wowhead's server, and every link to a Wowhead item page then shows a hover tooltip loaded from Wowhead. Each embed is a link back to the database site. No usage figures were found.

### Added bets (10–17)
44. **Xia, X., Bao, L., Lo, D., Kochhar, P. S., Hassan, A. E. & Xing, Z. "What do developers search for on the web?" Empirical Software Engineering 22:3149–3185 (2017).** doi:10.1007/s10664-017-9514-4. https://xin-xia.github.io/publication/emse173.pdf [research] [read 2026-10-05; abstract and relevant sections]. Search queries from 60 developers, a survey of 235 engineers in 21+ countries, and 12 interviews. "Explanations for exceptions/error messages (e.g., HTTP 404)" are among the most frequent search tasks. Interviewees say developers "directly copy and paste" the exception text into a search engine.
45. **GitHub Education, "Partners" (Student Developer Pack).** https://github.com/education/partners [first-party] [read 2026-10-05]. Partner offers must "align with the developer lifecycle or related fields and be offered at no cost to the student". GitHub onboards "5-10 new partners per year", and "not all who inquire are approved". The page cites a community of 5 million student developers.
46. **Chrome Web Store, "Affiliate Ads" policy** (last updated 2025-03-11). https://developer.chrome.com/docs/webstore/program-policies/affiliate-ads [first-party] [read 2026-10-05]. Affiliate links or codes are allowed only with "a direct and transparent user benefit related to the extension's core functionality". Injecting or replacing affiliate codes or cookies without the user's knowledge or action is banned, and affiliate use must be disclosed.
47. **Berger, J. & Milkman, K. L. "What Makes Online Content Viral?" Journal of Marketing Research 49(2):192–205 (2012).** SSRN 1528077, doi:10.2139/ssrn.1528077 [research] [read 2026-10-05; abstract of the SSRN version via Crossref; the journal citation is from memory]. Three months of New York Times articles. Positive and awe-inspiring content was shared more, and so was content that caused anger or anxiety. Practically useful, interesting and surprising content was also shared more.

---

## Bet 1. Listings in stores, marketplaces, registries, directories and review sites

**What it is.** Put a product page where buyers already browse or search for your type of product: an app store, a developer registry, an integration directory, a review site, or a curated list.

**Fits:** apps, developer tools, SaaS, browser extensions, and anything that plugs into another platform. Local shops get the same effect from map listings (see knowledge/local-seo.md). **Fits less:** services with no product page. Ecommerce is mostly covered by marketplaces (see research/ecommerce-and-marketplaces.md).

**Needs.** A complete product page and a working install path. Free listings (app stores, MCP Registry, GitHub Action, topic lists) need nothing more. Gated directories need users first: the Slack Marketplace needs 10 active workspaces with 10+ weekly active users [6], paid GitHub apps need 100 installs [3], and Discord requires verification [8]. Review sites need real customers willing to write reviews, so a handful of reviewers at least (judgment call).

**Earliest stage.** 0 for free listings; 1 for review sites and the Discord directory; 1–2 for the Slack Marketplace and paid GitHub apps.

**Cost and time.** Most listings are free and take 1–4 hours each. Some have entry gates:
- The Slack Marketplace needs 10 active workspaces with 10+ weekly active users [6].
- Paid GitHub Marketplace apps need 100 installs [3].
- Zapier keeps a new integration in beta for 90 days [7].
- A Discord bot must be verified before it can be listed [8].
- The VS Code "verified" badge takes 6 months of history and a domain at least 6 months old [4].
- Review-site listings are free; paid tiers start at $299/month on G2 [9]. Capterra charges per click for sponsored positions [10].

Judge a listing after 60–90 days. Store search traffic builds slowly, and review sites need some reviews before they show you.

**Evidence.**
- *App stores.* Covered in research/app-store-search.md, research/app-store-featuring-and-launch.md and research/app-discovery-outside-stores.md. Downloads are extremely concentrated: the top 1% of Google Play apps got over 78% of downloads (research/app-discovery-outside-stores.md item 1) [research]. Store search is where most downloads start (research/app-discovery-outside-stores.md item 9; research/app-store-search.md item 38) [first-party]. So a listing is necessary but does not bring users by itself.
- *Developer registries and directories.* No study measures whether a registry or marketplace listing brings users or revenue. This gap was already noted in research/early-stage-gtm.md §10.
  - The official MCP Registry is meant to feed other directories, not to be browsed by people or read directly by coding tools, and it is still in preview [1] [first-party].
  - MCP directories are crowded and noisy: more than half of 17,630 listed entries were invalid or low-value [14] [research; preprint].
  - Coding agents choose tools mostly by how closely a tool's name and description match the request's words (research/early-stage-gtm.md §9, items [61]–[63]). So the description text matters more than the number of directories you are in.
  - A GitHub Action publishes instantly with no review [2], and GitHub Actions runs in 43.9% of sampled repos (research/early-stage-gtm.md [59]). How people find a new Action is not studied.
  - About 44% of VS Code extensions in one 2023 crawl had fewer than 10 installs (arXiv:2412.00707, inferred from the authors' filter) [snippet-only]. A listing is not traction.
- *Review sites (G2, Capterra and similar).*
  - G2's own 2026 survey says review sites are the top influence on B2B shortlists (38%), just ahead of AI chatbots (37%) [11] [vendor; G2 sells listings].
  - Whether review sites feed AI answers is disputed. G2 finds review platforms are 7.4–13.2% of ChatGPT citations, rising toward purchase, with G2's group taking 84% of those [12] [vendor]. An independent June 2026 test found zero direct G2 or Capterra citations in 233 ChatGPT software recommendations, and G2's own data shows review count explains under 1% of citation variation [13] [secondary; underlying studies not read].
  - research/ai-assistant-visibility.md item 15 (G2 among Perplexity's commercial sources) is still unverified, and item 13 (branded web mentions correlate with AI Overview visibility, ρ = 0.664) is the stronger general signal [vendor].
  - G2 now owns Capterra, Software Advice and GetApp (closed 5 Feb 2026) [10]. One company now controls most of this channel.
- *AlternativeTo.* No first-party page could be read (403). Directory-submission blogs give conflicting rules (a 7-day account wait, an optional $5 faster review) [snippet-only]. Do not rely on these. research/community-and-hobby-products.md item 21 shows AlternativeTo working as a place where users of a disliked product go to look for alternatives.
- *Awesome lists and community wikis.* No study was found on whether being listed brings users. The main "awesome" list has strict, effortful rules (the list must be 30 days old, you must review 4 other pull requests, no AI-generated content) and has paused pull requests at times [16] [first-party]. Topic lists are where single tools get listed, and each has its own rules.

**Rules and risks.**
- Keyword stuffing is banned in the Chrome Web Store (repeating a keyword more than 5 times) [5] and in app stores (research/app-store-search.md item 3).
- Most directories require a privacy policy (Slack, Discord, Chrome) [5][6][8].
- Do not buy or swap reviews. The FTC rule on fake reviews applies, with up to $53,088 per violation (research/content-social-pr.md items 25–26). G2 runs gift-card review campaigns on paid plans [9]; any incentive must be disclosed and must not depend on the review being positive.
- Listings you do not maintain go stale, and Slack removes inactive apps [6].
- Paid "submit to 100 directories" services mostly produce low-value links, which is the same problem as link spam (research/content-social-pr.md item 22).

**How to measure.**
- Use a separate tagged link (UTM) per listing where the platform allows outbound links (research/seo-advanced.md item 20).
- Use platform dashboards: App Store Connect source types (research/app-store-search.md item 19), Chrome Web Store impressions and installs [5], and GitHub referring sites, which are kept for only 14 days, so export them weekly [20].
- Add a required free-text "How did you hear about us?" field (research/measurement.md §8, items 18–19).

**Stop signal.** Fewer than a handful of tagged visits, and no "heard about us" mentions, after 90 days while the listing is complete and has at least a few reviews. Keep free listings that cost nothing to maintain; drop paid tiers.

- **Devtool example:** publish the CI step as a GitHub Action and the agent server to the MCP Registry, so the directories that copy from it pick it up. Write the description in the words a user would type. Track installs per channel.
- **Hobby site example:** submit the Discord bot to the Discord App Directory once it is verified, add the site to the game's community wiki or Reddit sidebar resource list if the moderators agree, and add it to an AlternativeTo page for the best-known rival site.
- **Local or ecommerce example:** a local service completes its Google Business Profile and one or two trade directories that customers actually use. A shop lists on the one marketplace where its buyers search.

## Bet 2. Open-source a useful piece (CLI, GitHub Action, library, dataset)

**What it is.** Release part of the product, or a useful helper around it, under an open licence, so people find it through GitHub, package registries and search, and some of them come to the paid product.

**Fits:** developer tools and technical products; data-heavy hobby sites (an open dataset or API wrapper). **Fits poorly:** most local services and consumer shops.

**Needs.** The founder's technical skill and a piece that is useful on its own, without the paid product. No users are needed.

**Earliest stage.** 0.

**Cost and time.** Days to weeks to package, document and maintain; ongoing issue triage. Judge it after 3–6 months.

**Evidence** (most of it is already in research/early-stage-gtm.md §8 and research/early-stage-gtm-devtools.md §§2 and 4; not repeated):
- Starting to engage with open source was linked to a ≥36% higher chance of raising funding, a funding outcome rather than customers (research/early-stage-gtm.md [52]) [research; observational].
- Social posts move few stars; a Hacker News post that gets traction brings tens of stars (research/early-stage-gtm.md [54][56][57]).
- Tools spread through badges and through people who commit to many repos (research/early-stage-gtm-devtools.md, main-note [58]).
- No study links stars to revenue (research/early-stage-gtm.md §10). The "1–2% of open-source users pay" figure is lore (research/early-stage-gtm-devtools.md [125]).
- *New: stars are a weak sign of real usage.*
  - Stars and registry downloads correlate only 0.14 for JavaScript and 0.47 for PHP across 925,978 projects [17] [research].
  - npm's popularity metrics barely agree with one another [18] [research].
  - Three in four developers still look at stars before using a project [19] [research], so stars work as a shop window but not as a usage meter.
  - Stars can be faked at scale (research/developer-tools.md item 1).
- *README as a landing page.* READMEs with lists, images, links and contribution guides correlate with popularity (research/early-stage-gtm.md [37]) [research; preprint]. Honest quality badges are cheap trust signals (research/early-stage-gtm.md [36]). No study tests README layout against conversion to a paid product.

**Rules and risks.** Choose the licence before launch; changing it later causes forks and backlash (research/developer-tools.md items 2–5; research/early-stage-gtm-devtools.md [120][121]). Every issue and pull request is a support cost. Do not buy stars (research/developer-tools.md item 1).

**How to measure.**
- Look past stars: package downloads (inflated by CI [17]), GitHub referring sites [20], tagged links from the README to the product, and signups that name the repo in "How did you hear about us?".
- For a CLI, an opt-in usage ping is possible only with clear disclosure and an easy opt-out; check knowledge/privacy-and-marketing-law.md.

**Stop signal.** After 3–6 months there are some stars but no tagged README clicks and no signups that mention the repo. Keep the code public if upkeep is cheap, but stop putting launch effort into it.

- **Devtool example:** release the query-analysis CLI or the CI Action under a permissive licence, with a README that shows a real before-and-after finding and links to the hosted product with a tagged URL.
- **Hobby site example:** publish the item dataset or the trade-message parser as an open repo, credit the site, and invite fixes from players.
- **Local or ecommerce example:** rarely fits. A shop on a shared platform might release a small plugin or theme fix.

## Bet 3. Social media presence: founder account vs company account, platform, cadence

**What it is.** Post regularly on one or two platforms where your buyers are, usually from the founder's personal account rather than a logo account.

**Fits:** any business. Founder-led posting suits B2B, devtools and community products. Visual platforms suit consumer, local and ecommerce businesses.

**Needs.** Founder time and something worth saying: expertise, real findings, or a visible build. No audience is needed to start, but growth from zero is slow (judgment call).

**Earliest stage.** 0.

**Cost and time.** 2–5 hours a week. Judge after 8–12 weeks of steady posting, since one post moves little (research/early-stage-gtm.md [54]).

**Evidence.**
- *Founder vs company account.*
  - LinkedIn's only first-party figure is that employee networks are about 10× a company's follower base (research/content-social-pr.md item 9) [vendor].
  - The widely quoted "personal profiles get 5–8× more engagement" figures come from relays that disagree with each other and show no method [25] [snippet-only].
  - Among large-company CEOs, posting volume, positive tone and topic variety predicted becoming a well-known poster [22] [research]. These are S&P 1500 CEOs, not small founders.
  - **No study compares founder vs company accounts for small companies.** This is anecdote plus platform design: feeds rank by predicted engagement (research/content-social-pr.md items 5–7, 10, 12, 13).
- *Does posting turn into sales?* One B2B firm's 106 weeks of LinkedIn data showed followers and site visits driving revenue, while no post type drove sales directly [21] [research; one firm]. Edelman/LinkedIn surveys say buyers trust thought leadership (research/content-social-pr.md items 1–2) [vendor].
- *Cadence.* Buffer's within-account data finds weeks without a post underperform, and 1–2 posts a week beat silence [23]. On Instagram, follower growth rises with frequency but with diminishing returns (+0.12% a week at 1–2 posts vs +0.26% at 3–5) [24] [vendor; within-account models, better than most vendor data]. Replying to comments goes with 21–42% higher engagement [23] [vendor; correlational].
- *Platform choice.* Go where the buyers are. YouTube and Facebook reach the most US adults, about half use Instagram, and fewer use TikTok, Reddit and X [26]. For developers, research/early-stage-gtm.md §8 covers Hacker News, X and GitHub Trending.

**Rules and risks.**
- Disclose paid or gifted endorsements (research/content-social-pr.md items 23–24).
- Reddit's self-promotion norms and the "10% rule" are set community by community (research/content-social-pr.md item 15).
- A founder account belongs to the person; plan what happens if the founder leaves.
- Engagement-bait formats are demoted (research/content-social-pr.md item 6).

**How to measure.**
- Use a tagged link in the profile and in posts, profile visits, and new followers per week.
- Count replies and direct messages from buyer-type accounts.
- Add a "How did you hear about us?" option for the platform (research/measurement.md §8). Expect most influence to be unattributed ("dark social").

**Stop signal.** After 12 weeks of 2+ posts a week: no conversations with buyer-type people, and no signups that name the platform. Then switch platform or format before dropping social altogether.

- **Devtool example:** the founder posts short real query-plan findings ("this index cut this query from 2 s to 20 ms") on the one platform where Postgres developers gather, and replies to every comment.
- **Hobby site example:** post weekly "rare items traded this week" screenshots in the game's subreddit, if the rules allow, and on the site's Discord. Run it from a personal account known to the community.
- **Local or ecommerce example:** a café or shop posts on Instagram or Facebook 2–3 times a week, showing the owner and the product, and replies to every comment.

## Bet 4. Building in public (open metrics, revenue, decisions)

**What it is.** Share real numbers (revenue, users, mistakes, decisions) openly, often with a live "open startup" dashboard, so the story itself draws an audience.

**Fits:** indie SaaS, devtools and creator businesses whose buyers are founders or makers. **Fits poorly:** local services and most ecommerce, where customers do not care about your MRR (monthly recurring revenue). Also a poor fit for anything in a regulated or competitive niche.

**Needs.** Progress or numbers worth following. A story with zero users draws mostly other founders, not buyers (judgment call).

**Earliest stage.** 1. Stage 0 is possible, but expect an audience of peers.

**Cost and time.** 1–2 hours a week for updates; a dashboard takes minutes with billing-tool integrations. Judge after 3 months.

**Evidence.** **Anecdote only; no study was found.**
- Buffer's revenue grew from $12K to about $500K a month after it started publishing numbers in 2013 [27] [practitioner]. There is no comparison group, and Buffer was already growing.
- After Buffer published salaries, job applications rose [29] [secondary]. The exact "doubled" figure could not be confirmed.
- The 2015 "open startups" list had seven companies, all survivors that chose to publish [28] [practitioner]. This is survivorship bias in its plainest form.
- Snippets claiming "45% of creators who shared publicly saw stronger trust" (Buffer) and "30% higher engagement" (Indie Hackers) were not found on any primary page and are treated as unverified.

**Risks.**
- Copycats: "similar products emerged within months" of Buffer going public [27].
- Bad news is public too. Buffer's 2016 layoffs (11% of staff, cash about 5 months from zero) were posted openly [30]. That was handled with candour, but a falling chart is visible to customers, rivals and recruits.
- Extra scrutiny and loss of focus [27].
- The audience is often other founders, not buyers.

**How to measure.** Tagged links in updates, newsletter or follower growth, and signups mentioning the updates in "How did you hear about us?". Watch whether new signups are buyers or just other founders.

**Stop signal.** After 3 months the audience grows but no customers come from it, or a competitor visibly copies the strategy you disclosed.

- **Devtool example:** a monthly post on what the analyzer found across public test repos and what was built, sharing usage counts but not revenue until there is a paying base worth showing.
- **Hobby site example:** publish monthly site stats (items indexed, trades parsed, visitors) and the hosting bill, and ask the community what to build next. Openness about costs also supports a donations page.
- **Local or ecommerce example:** usually skip. A maker shop might share its "how we price" or "first year" story once.

## Bet 5. Public changelog, release notes, public roadmap and "what's new" emails

**What it is.** Keep a dated, public list of what changed and what is planned, and send short "what's new" updates to users and lapsed users.

**Fits:** SaaS, apps, devtools and community tools. **Fits less:** local services. For a shop, "new arrivals" emails play the same role.

**Needs.** People to read it. A public changelog page needs nothing, but update emails need an opted-in list, and reactivation needs lapsed users to win back.

**Earliest stage.** 0 for the changelog page; 1 for update emails; 2 for reactivation emails.

**Cost and time.** 30–60 minutes per release. Changelog tools cost $0–$100/month, or use a Markdown file. Judge reactivation within 2–4 weeks of each email; trust effects take longer and are hard to see.

**Evidence.**
- *Research.*
  - In Google Play, apps with longer release notes had higher average ratings, and moving to frequent updates went with higher ratings [32] [research; correlational].
  - A GitHub study found fixed issues and new features are what notes usually contain, and that writers and readers disagree on what notes need [31] [research; descriptive].
  - **No study links a public changelog or roadmap to retention, reactivation or SEO.**
- *Win-back emails.* A win-back study in one telecom firm shows that customers with stronger first relationships return more often (research/retention-and-expansion.md item 7) [research]. It did not test product-update emails.
- *Vendor claims.* Beamer claims "180% increase in new feature adoption", "3x" engagement and "520% ROI" with no method [33] [vendor]. LaunchNotes' "83% read release notes" figure was not seen on its pages [34] [vendor; snippet-only]. Do not quote these as evidence.
- *Competitive side effect.* Rivals read your changelog to track your direction (research/competition-and-defensibility.md, monitoring list).

**Rules and risks.**
- "What's new" emails are marketing emails. Follow CAN-SPAM (US): honest subject line, physical address, working opt-out. CASL (Canada) needs consent; implied consent from a purchase expires. PECR/GDPR (UK/EU) needs consent unless the "soft opt-in" applies to existing customers. See research/partners-referral-outbound.md items 20–22 and knowledge/privacy-and-marketing-law.md.
- A public roadmap creates promises; mark items as plans, not commitments.
- An empty or stale changelog signals a dead product.

**How to measure.**
- Feature adoption: the share of active users who use the feature within 30 days of the note.
- Email clicks, and reactivated accounts within 14 days of an update email, compared against a held-out slice of lapsed users who did not get it (see knowledge/experimentation.md).
- Search impressions for the changelog pages in Search Console.

**Stop signal.** Two or three update emails in a row reactivate no more lapsed users than the held-out group does. Keep the changelog page itself (it is cheap), but cut the email.

- **Devtool example:** a `CHANGELOG.md` plus GitHub Releases for the CLI and Action, and a monthly "new checks this month" email to signed-up users who have gone quiet.
- **Hobby site example:** a "what's new" channel in the Discord and a dated changes page on the site (new items, parser fixes). Ping the community when a much-requested feature ships.
- **Local or ecommerce example:** a monthly "new arrivals" email to opted-in customers, with a held-out group to see whether it brings repeat orders.

## Bet 6. Free tools, calculators and embeddable widgets ("engineering as marketing")

**What it is.** Build a small free tool (a grader, a calculator, a checker) or an embeddable widget that solves a narrow problem your buyers have, and that links or leads back to you. This is the "engineering as marketing" channel in *Traction* (research/content-social-pr.md item 4; research/brand-growth-channels.md).

**Fits:** SaaS, devtools, data sites, ecommerce (size or cost calculators) and local services (quote estimators). **Fits poorly:** businesses with no technical skills, unless they use a no-code builder.

**Needs.** Build skill (or a no-code builder) and a narrow, searchable problem. A standalone tool needs no users. An embeddable widget needs sites willing to embed it, which usually means some standing in the community.

**Earliest stage.** 0 for a standalone tool; 1 for widgets and embeds.

**Cost and time.** 1–10 days to build a first version; hosting is usually cheap. Judge after 2–3 months of search indexing, or within 2 weeks if you launch it on a community site.

**Evidence.**
- The best-known case is HubSpot's Website Grader, which graded "more than 4 million websites" [35] [first-party]. HubSpot gives no lead or customer numbers, and it is a survivor case.
- Zapier's integration pages and Wise's currency-converter pages are tool-like pages often cited as large search-traffic sources. The traffic figures are tool estimates that disagree (research/seo-advanced.md item 38; research/b2b-saas-models.md item 23) [vendor; low reliability].
- "Powered by" badges are in active use. Netlify turned one on by default for new Free-plan projects in Aug 2026 [37] [first-party], but published no results. Developer badges spread tools in npm (research/early-stage-gtm.md [36][58]) [research].
- **No controlled study of free tools or widgets as marketing was found.**

**Rules and risks.**
- Google treats keyword-rich or hidden links in distributed widgets as link spam and recommends `nofollow` on widget links [36] [first-party]. Use the badge for visitors, not for SEO.
- Embeds that load your script on other sites must not track visitors without consent; Netlify's badge makes no network requests [37], which is a good model.
- Free tools need upkeep, and a broken tool hurts trust.

**How to measure.** Tool uses per week, the share of users who click through to the product (tagged link), email captures if you ask for one, referring domains linking to the tool, and the number of sites embedding the widget (count by referrer).

**Stop signal.** After 3 months: under a few dozen uses a week, or uses with almost no click-through to the product. Before dropping it, try one rewrite of the tool's page around a search term people actually use.

- **Devtool example:** a free paste-in "EXPLAIN plan reader" web page that highlights the slowest step and offers the CI check for the full analysis.
- **Hobby site example:** an item-tooltip script that forum and guide writers can embed, so hovering over an item name shows its stats from the database and links back. This copies the Wowhead pattern [43] [snippet-only]. Mark the links `nofollow` [36].
- **Local or ecommerce example:** a "how much paint do I need" or "what does a repair cost" calculator that ends with a quote request.

## Bet 7. Integrations and plugins inside other products' ecosystems

**What it is.** Build a bot, plugin or integration so your product shows up inside a platform people already use: a Discord or Slack bot, a framework or ORM plugin, a CI integration, a Shopify app, a Zapier connector.

**Fits:** SaaS, devtools and community tools; ecommerce tools (Shopify apps). **Fits less:** local services. Bookings or payments integrations help them, but those are the platform's job.

**Needs.** Development time and a product with an API or a clear in-platform job. Building needs no users, but directory listings have usage gates (Bet 1).

**Earliest stage.** 0 to build; 1–2 to get listed.

**Cost and time.** 1–4 weeks per integration, plus upkeep whenever the host's API changes. Directory entry gates are listed under Bet 1 [3][6][7][8]. Judge after 2–3 months.

**Evidence.**
- *Research.* Small enterprise-software vendors that joined a major platform's partner ecosystem saw higher sales and more IPOs, especially those with strong IP rights or strong sales and service capabilities [38] [research; observational; 1996–2004; enterprise software].
- *Platform economics.* Shopify takes 0% of app revenue on the first US$1M and 15% above (research/partners-referral-outbound.md item 4) [first-party]. Discord pays 85% on premium apps (research/community-and-hobby-products.md item 1).
- *Developer integrations.* Showing findings inside the pull request is acted on far more than dashboards (research/early-stage-gtm-devtools.md §§1–2) [research]. That is a product-placement argument for CI integrations, not proof of signups.
- **No study measures signups from a marketplace or bot listing for a small vendor.**

**Rules and risks.** Platform risk is the big one: the host can enter your space, change the API or cut access. Case evidence is in research/platform-and-feature-risk.md §§1–2: Twitter's third-party clients, Reddit's API pricing, Facebook Graph API v1, and research on Amazon and Google entering complementors' markets. Discord bots face privileged-intent review and data-use limits (research/community-and-hobby-products.md items 5–8). Each directory also requires a privacy policy [5][6][8].

**How to measure.** Installs per integration from the host's dashboard, the share of installs that become active accounts, and the "came from integration" source on signup (OAuth source or tagged install link).

**Stop signal.** After 3 months an integration has installs but almost none become active accounts, or its upkeep takes more than its share of signups justifies.

- **Devtool example:** a GitHub Action that comments the query findings on the pull request, plus a plugin for a popular Node or Python ORM that flags risky queries in tests. Both sit where developers already work.
- **Hobby site example:** a Discord bot that answers "price check <item>" inside trade servers and links to the full listing. Respect Discord's data and intent rules (research/community-and-hobby-products.md items 5–8) and Blizzard's no-real-money-trading rules (items 9–12).
- **Local or ecommerce example:** a shop installs (rather than builds) reviews and loyalty apps. A service business connects its booking tool to Google Business Profile.

## Bet 8. Publish your own data: a report, an index or benchmarks

**What it is.** Publish original numbers only you have (from your product, a survey or a crawl) as a report or a regular index that journalists, bloggers and AI answers can cite.

**Fits:** any business with unique data: SaaS, devtools, marketplaces, community sites. Local businesses can do a small local survey. **Fits poorly:** businesses with no data and no budget for a survey.

**Needs.** Data nobody else has. It can come from users (stage 2), or from public data you collect yourself, such as scanning public repos or parsing public trade channels. **Data can stand in for users**: a site that collects public data can publish reports before it has any users. Press pickup needs a finding that is surprising or about something well known.

**Earliest stage.** 0 if the data is public and collected by you; 2 if it comes from your own users; 3 for a press push.

**Cost and time.** 2–10 days per report, plus pitching. Judge links and mentions 4–8 weeks after release.

**Evidence** (main sources already in research/content-social-pr.md):
- 61% of journalists say they value original research (Cision, item 21) [vendor].
- Research reports are rated effective by 45% of B2B marketers (CMI, item 3) [vendor].
- 86% of journalists say some of their work starts from a PR pitch (Muck Rack, item 19) [vendor].
- *New:* one agency's 26,000 earned links show that links vary widely in value and that most high-authority links get no social shares [39] [vendor]. Backlinko's ranking-factors study earned 79,000+ backlinks [40] [vendor; one survivor case].
- The "original research earns 6.4× more links" figure could not be traced to a source [40] [snippet-only]. Do not use it.
- Branded web mentions correlate with AI Overview visibility (research/ai-assistant-visibility.md item 13) [vendor]. That is one reason being cited matters beyond links.
- **No independent or controlled study of data reports as a link source was found.**

**Rules and risks.**
- Publish your method and sample, or journalists will not trust the numbers.
- Do not publish personal data. Aggregate product data and check your privacy policy allows it (knowledge/privacy-and-marketing-law.md).
- Paid placement of the report must use `rel="sponsored"` (research/content-social-pr.md item 22).
- A weak or self-serving finding can backfire.

**How to measure.** Referring domains to the report page, press and blog mentions, branded searches in Search Console in the 4 weeks after release, and a tagged link in pitches.

**Stop signal.** Two reports in a row each earn fewer than about 5 new referring domains and no press. Then change the topic, or move to a smaller recurring index.

- **Devtool example:** an anonymised "most common slow-query patterns in N open-source Postgres apps" report, with the method and the scanning script published.
- **Hobby site example:** a monthly "economy index" of trade prices for top items, built from the parsed trade channels, that streamers and guide writers can quote and link to.
- **Local or ecommerce example:** a yearly "what our town pays for X" survey from a local service, or a "sizes our customers actually return" note from a clothing shop.

## Bet 9. Comparison and "alternative to X" pages, and help docs as search pages

**What it is.** Write honest pages comparing your product with named rivals ("X vs Y", "alternatives to X"), and public help or docs pages that answer the exact questions people search for.

**Fits:** SaaS, devtools and apps with known rivals; ecommerce for "best X for Y" buying guides; services for "X vs Y" choices (for example, repair vs replace). **Fits poorly:** products with no known alternatives.

**Needs.** Known rivals, honest first-hand knowledge of them, and patience for search indexing. No users are needed.

**Earliest stage.** 0.

**Cost and time.** 2–4 hours per comparison page; help docs often exist already. Judge after 2–3 months in Search Console.

**Evidence.**
- *Research.* A meta-analysis of comparative advertising found that comparative ads raise attention, brand attitude and purchase intention but lower believability. "New brands comparing themselves to established brands appear to benefit most" [42] [research; abstract]. That fits a small company comparing itself with a known rival.
- *First-party.* Google's reviews guidance asks for real differences, first-hand evidence and "best for" reasoning, and covers ranked lists [41].
- *Priority.* A small "alternative to [competitor]" query can be worth more than a large informational one (knowledge/seo-and-ai-search.md, prioritisation, an existing playbook point). AlternativeTo serves the same intent (Bet 1).
- *Help docs.* **No study was found** on help docs as a search-acquisition channel. Docs in an AI model's context help it give correct answers about a library (research/early-stage-gtm.md §9, the version-docs result), which is a reason to keep docs public and crawlable. The broader SEO points are in research/seo-advanced.md and knowledge/seo-content-and-architecture.md.

**Rules and risks.**
- Comparative claims must be true, comparable and checkable under EU law (Directive 2006/114/EC Art. 4). In the US, rivals can sue over false claims (Lanham Act §43(a)). See research/privacy-and-marketing-law.md items 18–19.
- Date every comparison and recheck rivals' pricing and features, since stale claims are both a legal and a trust risk.
- Do not use rival trademarks in ways that suggest you are affiliated with them.
- Lower believability [42] means you should show evidence: screenshots, tests, and where the rival wins.

**How to measure.** Search Console impressions and clicks per comparison page; signups from those pages (tagged internal links or landing-page source); for docs, search entries to docs pages and the share that reach signup.

**Stop signal.** After 3 months a comparison page has search impressions but almost no clicks (rewrite the title), or clicks but no signups (rewrite the page). Drop it only if the rival query has no volume at all.

- **Devtool example:** an honest "our tool vs the built-in query statistics extension vs a hosted monitoring tool" page saying when each is the right choice, plus public docs pages titled with the exact error or symptom developers search for.
- **Hobby site example:** a short "how this site differs from the other big trade site" page (live Discord data, free, no account needed) and help pages such as "how to price-check an item".
- **Local or ecommerce example:** a plumber's "repair vs replace your water heater" page, or a shop's "our two best-selling boots compared" guide.

---

## Bets 10–17 (added at the coordinator's request; the evidence is thin, so these are brief)

## Bet 10. Shareable outputs (a report link or image card people want to post)

**What it is.** Make the result of using your product easy and attractive to share, such as a link to a public report or an auto-made image card ("my score", "my build", "my year").

**Fits:** apps, devtools, games and hobby tools, quizzes and calculators. **Fits less:** private B2B data, and most local services.

**Needs.** Users who produce results that they are proud of, or that are funny or surprising. It needs real usage, so a judgment call of at least dozens of active users.

**Earliest stage.** 1–2.

**Cost and time.** 1–5 days to build a share page or image generator. Judge after 4–8 weeks of normal use.

**Evidence.**
- Content that is positive, awe-inspiring, useful or surprising was shared more (New York Times articles) [47] [research]. That is news content, not product output.
- Badges spread tools in npm (research/early-stage-gtm.md [36][58]) [research].
- Referral and word-of-mouth evidence is in research/app-discovery-outside-stores.md §G.
- **No study of product "share cards" was found.** Famous cases (yearly recap features, Wordle's grid) are survivor anecdotes and were not checked here.

**Rules and risks.**
- Never auto-post on someone's behalf.
- Share pages must not expose private data. Make "public" an explicit choice, especially for code or company data.
- Rewarding shares is an incentive, so check the endorsement rules (research/content-social-pr.md items 23–24).

**How to measure.** Share clicks, visits to shared pages, and signups that arrive from a shared page (tag the share URL).

**Stop signal.** Fewer than about 1 in 50 results get shared, or shared pages bring no signups after 8 weeks.

- **Devtool example:** an opt-in public report link, "this pull request removed 3 slow queries", that teams can post in their own channels.
- **Hobby site example:** an image card of a player's rare find or trade, with the item tooltip and the site's address, sized for Discord and Reddit.
- **Local or ecommerce example:** a shop's "build your gift box" result that can be shared, or a gym's progress card.

## Bet 11. Public, indexable pages generated from your own data (one per item, error or report)

**What it is.** Turn each row of your data into its own public page that search engines can index (often called programmatic SEO).

**Fits:** databases, marketplaces, catalogues, integration lists and data sites. **Fits poorly:** businesses with little structured data.

**Needs.** Data with something unique and useful on each page. It can be public data you collected and organised, so users are not required. You also need enough rows to matter (judgment call: hundreds or more) and a site that search engines already crawl.

**Earliest stage.** 0 when the data is collected from public sources; 2 when the pages depend on user activity.

**Cost and time.** Days to build templates. Indexing takes weeks to months, so judge after about 3 months in Search Console.

**Evidence.**
- Zapier's integration pages and Wise's currency pages are the usual examples. The traffic figures are tool estimates that disagree (research/seo-advanced.md item 38; research/b2b-saas-models.md item 23) [vendor; low reliability].
- **No study was found.**

**Rules and risks.** Google's "scaled content abuse" policy targets many pages made mainly to rank, however they are produced, including automated transformations of other data and AI-made pages without curation (research/seo-advanced.md items 26–27) [first-party]. Thin pages can hold back the whole site. Also check the data source's terms before republishing (research/community-and-hobby-products.md items 9–15 for game APIs).

**How to measure.** Search Console indexed pages, impressions and clicks per page template, and signups from those pages.

**Stop signal.** After 3 months most pages are "crawled, not indexed" or get no impressions. Then cut to the pages with real content rather than adding more.

- **Devtool example:** one page per common Postgres query anti-pattern or per analysed public app, each showing real plans.
- **Hobby site example:** one page per item, with stats, recent trade prices and listings. This is the site's core and may already exist.
- **Local or ecommerce example:** one page per product with real specs and stock, or one page per service area only where the content truly differs (see knowledge/local-seo.md).

## Bet 12. A one-command try with no sign-up (npx, pipx, docker run)

**What it is.** Let someone get a real result in one command, such as `npx yourtool check`, with no account, then offer the full product.

**Fits:** developer tools and CLIs. **Fits poorly:** everything that is not used from a terminal. The non-developer version is a free web tool (Bet 6).

**Needs.** A CLI that gives value on the user's own input without a server account. No users are needed.

**Earliest stage.** 0.

**Cost and time.** 1–5 days to package. Judge after 4–8 weeks of being linked from the README and posts.

**Evidence.**
- Developers evaluate tools by trying them: 75% start a free trial (Stack Overflow 2024, research/early-stage-gtm.md [34]) [first-party; self-selected].
- Free-to-paid evidence is in research/early-stage-gtm-devtools.md §3.
- **No study compares no-sign-up tries with sign-up-first.**

**Rules and risks.** Telemetry from a one-shot command must be disclosed, and it is best opt-in (knowledge/privacy-and-marketing-law.md). Publishing to npm or PyPI brings supply-chain responsibility, so enable two-factor authentication, use provenance, and pin dependencies. Name confusion with existing packages hurts trust, and AI models invent package names (research/early-stage-gtm.md [65]).

**How to measure.** Registry downloads (inflated by CI [17]), an opt-in "share results" link with a tag, and signups whose source is the CLI's printed link.

**Stop signal.** Downloads with almost no clicks on the printed link after 8 weeks. Then change what the output shows before giving up.

- **Devtool example:** `npx <tool> analyze "<query>" --db $DATABASE_URL` prints the worst plan step and a fix, then a tagged link to set up the CI check.
- **Hobby site example:** not a fit. The equivalent is a no-login search box on the home page.
- **Local or ecommerce example:** not a fit. The equivalent is an instant quote with no contact form.

## Bet 13. One page per painful error message, titled with the exact error text

**What it is.** Write a page for each error your users hit, titled with the exact error string, that explains the cause and the fix (and how your product prevents it).

**Fits:** developer tools, software, and devices with error codes. Some appliance or vehicle repair services can do the same with fault codes. **Fits poorly:** most consumer and local businesses.

**Needs.** Expertise in the errors and a list of real error strings. Your own users' errors help but are not required.

**Earliest stage.** 0.

**Cost and time.** 1–2 hours per page. Judge after about 3 months in Search Console.

**Evidence.**
- Explaining exceptions and error messages is among developers' most frequent web-search tasks, and they paste the exact text [44] [research; survey and query logs, 2017].
- Whether a vendor's error page turns searchers into users is **not studied**.

**Rules and risks.** Pages must actually solve the error, or they become thin "scaled" content (research/seo-advanced.md items 26–27). Keep version-specific fixes dated.

**How to measure.** Search Console impressions and clicks per error page, time on page, and clicks to the product (tagged).

**Stop signal.** After 3 months the pages get clicks but no product clicks. Keep them as support content and stop writing new ones for acquisition.

- **Devtool example:** pages for exact Postgres errors and warnings such as `canceling statement due to statement timeout`, with the cause, the fix, and how the CI check catches the query before it ships.
- **Hobby site example:** short pages for common in-game or trade-bot error messages that players search for.
- **Local or ecommerce example:** an appliance repairer's page per fault code (for example "dishwasher error E24"), ending with a booking link.

## Bet 14. Teardowns of well-known things

**What it is.** Analyse something famous in your field with your own tool or expertise, such as the slowest queries in a popular open-source app, and publish the findings.

**Fits:** devtools, agencies and consultancies, analysts and hobby experts. **Fits poorly:** businesses without a method to show.

**Needs.** Expertise or a tool that finds something non-obvious, and a target people already know. No users are needed, because the famous target supplies the audience.

**Earliest stage.** 0. It can reach press-worthy stage 3 if the finding is striking.

**Cost and time.** 2–5 days per teardown. Judge links and mentions 2–6 weeks after publishing.

**Evidence.**
- A variant of Bet 8. Journalists value original research and data (research/content-social-pr.md item 21) [vendor]. Hacker News traction brings tens of stars (research/early-stage-gtm.md [57]).
- **No study of teardowns as such was found.** Anecdote only.

**Rules and risks.**
- Be accurate and fair, and contact the maintainers first if you found bugs or security issues. Responsible disclosure applies.
- Disparaging claims about a named product carry legal risk (research/privacy-and-marketing-law.md items 18–19).
- Sneering at open-source maintainers backfires in developer communities.

**How to measure.** Referring domains, community points or comments, tagged links to the tool, and signups mentioning the teardown.

**Stop signal.** Two teardowns earn no community traction or links. Then pick better-known targets or sharper findings.

- **Devtool example:** "the 10 slowest queries in a popular open-source Postgres app, and the indexes that fix them", with pull requests offered upstream.
- **Hobby site example:** "what the trade data says about the most overrated items", built from parsed trade history.
- **Local or ecommerce example:** a bike shop's teardown of a popular budget bike, or a roofer's "what goes wrong with the most common local roof type".

## Bet 15. An auto-generated weekly digest from your data, posted where the audience is

**What it is.** Each week, automatically post a short summary of your data (top items, trends, notable events) in the channel where your audience already gathers, with a link back.

**Fits:** data and community sites, marketplaces, devtools with public data. **Fits poorly:** businesses whose data is private.

**Needs.** A steady data flow (public or from users) and a channel that allows it: the community's permission or your own server or list. Public data can stand in for users.

**Earliest stage.** 0 when the data is public; 1–2 otherwise.

**Cost and time.** 1–3 days to automate. Judge after 6–8 weekly issues.

**Evidence.**
- Posting consistency matters on social platforms, and weeks without a post underperform [23] [vendor].
- **No study of automated digests was found.**

**Rules and risks.**
- Reddit and Discord treat repeated self-links and bots as spam unless moderators agree (research/content-social-pr.md item 15; research/community-and-hobby-products.md items 7–8).
- Email digests need consent (research/partners-referral-outbound.md items 20–22).
- Check figures before auto-posting. One wrong number in public costs trust.

**How to measure.** Clicks on the tagged link per issue, reactions and replies, unsubscribes or mutes.

**Stop signal.** Clicks fall for 4 weeks in a row, or moderators object.

- **Devtool example:** a weekly "Postgres slow-query patterns seen in public repos" post to a newsletter and a developer community thread that allows it.
- **Hobby site example:** a weekly bot post in the site's Discord, and with permission in a big trade server, listing the top price moves and rarest trades, each linking to the item page.
- **Local or ecommerce example:** a weekly "back in stock / new this week" post in the shop's own channel or local group, where the rules allow.

## Bet 16. Listings in startup and student perk programmes

**What it is.** Offer your product as a free or discounted perk in programmes that startups or students browse, such as cloud and accelerator perk catalogues and student developer bundles.

**Fits:** devtools and B2B SaaS that want early adopters. **Fits poorly:** local services, hobby sites and ecommerce (student discount sites are the consumer version).

**Needs.** A free tier or a credit you can afford to give away, and enough credibility to be accepted. GitHub's Student Developer Pack adds only 5–10 partners a year [45], so existing traction helps (judgment call).

**Earliest stage.** 2. Some perk catalogues accept stage 1, but this was not checked.

**Cost and time.** Hours to apply, plus the cost of the perks. Acceptance can take months.

**Evidence.**
- GitHub states its partner rules and the 5 million student reach [45] [first-party].
- **No data was found on what perk listings deliver for partners.** Cloud-credit programme rules were not read this session.

**Rules and risks.** Perk users churn when the free period ends, and students rarely pay soon. Make sure the perk's terms limit abuse, and don't promise more support than you can give.

**How to measure.** Redemptions per programme (unique codes), activation, and the share still active and paying after the perk ends.

**Stop signal.** Redemptions with almost no activation, or nobody converts after the perk period ends.

- **Devtool example:** a free tier of the CI analysis for student and early-startup repos through a developer perk catalogue.
- **Hobby site example:** not a fit.
- **Local or ecommerce example:** a student discount listing for a shop, through student discount schemes.

## Bet 17. A browser extension that overlays the sites your audience already uses

**What it is.** A browser extension that adds your data or features on top of a site people already visit, such as prices, warnings or extra info, with a link back.

**Fits:** data sites, hobby databases, shopping and price tools, devtools for web consoles. **Fits poorly:** local services.

**Needs.** Data or a feature that clearly improves a specific site, and an audience that uses that site often. No users are needed to build, but installs come from an existing community.

**Earliest stage.** 1. You can build at stage 0, but installs need a community to promote it in.

**Cost and time.** 1–3 weeks to build, plus upkeep every time the host site changes its layout. Judge after 2 months.

**Evidence.**
- **No study was found.** Chrome Web Store reports impressions and installs, but not traffic sources [5].

**Rules and risks.**
- Chrome Web Store policy requires a single purpose, no duplicates, no keyword spam and a privacy policy [5].
- Affiliate codes may not be injected or replaced without the user's knowledge [46] [first-party].
- The host site's terms may forbid scraping or modifying its pages, and a layout change can break the extension overnight (research/platform-and-feature-risk.md §2).
- Extensions get broad permissions, so ask for as few as possible.

**How to measure.** Installs, weekly active users and uninstalls from the dashboard [5], and clicks on the tagged link back.

**Stop signal.** Uninstalls approach installs, or upkeep after host-site changes takes more time than the extension's users justify.

- **Devtool example:** an extension that adds a "check this query" button to a cloud database console or a pull request page.
- **Hobby site example:** an extension that shows item prices from the trade database when hovering over item names on the game's forums or trade pages. Respect the game publisher's rules (research/community-and-hobby-products.md items 9–12).
- **Local or ecommerce example:** rarely fits. A price-comparison shop might do it.

---

## Folklore and weak claims

- **"Personal LinkedIn profiles get 5×/8×/561% more reach than company pages."** Relays disagree and none shows a method [25]. The direction is plausible given feed design, but the size is unknown.
- **"Original research earns 6.4× more links."** No source found [40].
- **"Building in public raises trust 45% / engagement 30%."** Not found on any primary page. The only evidence is survivor anecdotes [27][28].
- **"Buffer's job applications doubled to 3,864 after open salaries."** Only an "uptick" was confirmed [29].
- **Changelog vendor figures** ("180% adoption", "520% ROI", "83% read release notes") have no method [33][34].
- **"Without a G2/Capterra listing you are excluded from AI recommendations."** This comes from a vendor relay. Independent tests disagree, and review count explains under 1% of G2's own citation variation [13].
- **"Submit to 100+ directories for backlinks."** No evidence that it brings users. Low-value links risk being treated as link schemes (research/content-social-pr.md item 22). MCP directories are more than half low-value entries [14].
- **Stars as traction.** Stars correlate weakly with downloads and real usage [17][18], and can be bought (research/developer-tools.md item 1).
- **HubSpot Website Grader as proof that free tools work.** It is one survivor, with no published lead or customer data [35].

## Open questions

- Does a listing in any developer registry (MCP Registry and aggregators, GitHub Marketplace, VS Code Marketplace) bring measurable signups for a small vendor? No study or first-party data was found.
- How do AI coding tools that read MCP aggregators rank servers, and does registry metadata (description, namespace verification) change selection in practice outside lab tests?
- Do G2 and Capterra reviews actually change AI recommendations now that one company owns all four sites? The June 2026 independent test and G2's own data should be read in full.
- Is there any controlled evidence on founder vs company accounts for companies with fewer than 50 staff?
- Does a public changelog or roadmap change retention or reactivation? A held-out email test is the cheapest way to find out for any single business.
- Do free tools or embeddable widgets convert to customers at a measurable rate? There is no data beyond survivor cases.
- AlternativeTo's current submission rules and the Discord App Directory help-center rules could not be read (403). Recheck both before the playbook states requirements.
- Pew's 2025 per-platform usage percentages could not be read from the chart data. Fetch the Pew report PDF before quoting platform reach.
- Cloud-credit and accelerator perk programmes (who can list, what partners get) were not read; only GitHub's Student Developer Pack rules were.
- No evidence was found for share cards, one-command tries, error-message pages, teardowns or weekly digests as acquisition channels; each rests on adjacent evidence or anecdote.
