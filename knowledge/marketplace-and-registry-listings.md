---
title: Marketplace, registry and review-site listings
summary: Getting listed and found in software marketplaces, registries and review sites; MCP Registry and MCP directories, GitHub Marketplace, VS Code Marketplace and Open VSX, JetBrains, Chrome Web Store, Atlassian, Slack, Zapier, Shopify, Salesforce AppExchange, HubSpot, AWS, Google Cloud and Microsoft marketplaces (private offers, co-sell, fees), npm, PyPI and crates.io, G2, Capterra, TrustRadius and Gartner Peer Insights; entry gates, review times, how each ranks, which listings fit which business and stage, and listings as platform risk.
tags: marketplace listing, registry, mcp registry, mcp directory, smithery, glama, github marketplace, verified publisher, vs code marketplace, open vsx, jetbrains marketplace, chrome web store, atlassian marketplace, forge, slack marketplace, zapier integration, shopify app store, built for shopify, appexchange, agentexchange, hubspot app marketplace, aws marketplace, google cloud marketplace, microsoft marketplace, azure marketplace, private offer, co-sell, macc, committed spend, npm search, pypi, crates.io, g2, capterra, trustradius, gartner peer insights, review incentives, revenue share, listing fees, badges, certification
---

Use this playbook when you want a software product to be found inside a store or directory that buyers already use: a developer registry, an editor or browser extension store, another product's app marketplace, a cloud marketplace, or a review site. Mobile apps are covered in **app-store-discovery**; see that playbook instead. Listings as one cheap bet among many are in **small-bets**; this playbook goes deeper on each platform.

## The main rule: most stores rank on use you bring yourself

_In short:_ Most marketplaces rank listings by installs, ratings and usage a new listing lacks, so a listing rarely brings your first users. Bring the first installs yourself, then the store's ranking can start working.

- **Most marketplace search rewards installs, ratings and usage the new listing does not have yet.** JetBrains publishes its formula: text match, a staff-pick boost, then a multiplier from downloads (logarithmic) and one from rating (square root). Chrome uses ratings and downloads versus uninstalls; Atlassian uses keyword and meaning match plus installs, reviews and support details; Shopify uses how merchants act after a search; AppExchange "popularity" is installs, clicks, test drives and demos; HubSpot's "Most popular" and "Now trending" rows are install counts. [first-party]
- **crates.io is the extreme case.** Its relevance sort only ranks the 1,000 matching crates with the most downloads in the last 90 days (plus an exact name match). A new crate on a common word may not appear at all. [first-party; source code]
- **A few rank on text only**: npm (keyword match since it dropped its quality and popularity scores in December 2024), PyPI (name weighted most, no download signal) and the official MCP Registry (no ranking at all). On these, the name and first sentence of the description do most of the work. [first-party]
- **So a listing rarely brings the first users.** Bring the first installs yourself (direct outreach, community, docs, your own site), then the store's ranking can start to work. No study links a listing to signups for a small vendor; more than half of MCP directory entries are invalid or low-value, and the median Shopify app that left the store peaked at 8 installs. [research; preprints; descriptive]
- **No platform publishes where installs come from** (search, browse, featuring or outside links). Measure it yourself (see "How to measure" below).

## Developer registries and editor stores

_In short:_ Each developer registry and editor store has its own review, fee and verification rules. Publish to the free, no-review ones first from automated builds, and make your name and first sentence do the work.

- **Official MCP Registry.** Still "in preview" in October 2026, with possible "breaking changes or data resets". It stores metadata only, pointing at your npm, PyPI or Docker package or your public remote server; private servers are not accepted. You prove you own the name through GitHub or your domain. No human review, no ranking, no fee. It is built to feed other directories ("aggregators"), not for people or coding tools to browse. PulseMCP, for example, has paused direct submissions and says it will import from the official registry. Publish here first, from CI, so the copies stay current. [first-party]
- **Client directories have their own rules.** Claude's Connectors Directory: any paid Claude plan can submit; remote HTTPS servers only; every tool needs a title and a read-only or destructive annotation; OAuth for logins; a reviewer test account. Listings start as "Community" after an automatic scan; "Verified" is by invitation only. OpenAI's directory (now called "Plugins") needs a verified individual or organisation, a manual review, and does not allow selling digital goods inside. Docker's catalog takes a pull request and a permissive licence ("GPL is not" accepted). Ranking rules are not published for these. [first-party]
- **Tool descriptions are the listing that matters to agents.** Agents pick tools mostly by word overlap with the request; see **developer-tools** ("AI coding agents as users and channel"). OpenAI bans descriptions that try to steer the model away from other tools. [first-party; research]
- **GitHub Marketplace.** Actions publish instantly with no review (public repo, one action.yml at the root, unique name, 2FA). Paid apps need 100 installs (GitHub Apps) or 200 users (OAuth apps) and a verified publisher organisation; GitHub keeps 5%; trials are fixed at 14 days; up to 10 plans. If you sell a paid version elsewhere, you must offer a paid plan in Marketplace too. The default sort is popularity. [first-party]
- **VS Code Marketplace.** Free to publish; automated malware scanning on every update; removal is permanent and the name cannot be reused. The verified badge needs 6 months of listing and a 6-month-old domain. Up to 30 keywords. The strongest install path is inside the user's repo: a workspace recommendation makes VS Code prompt every new contributor to install your extension. Personal access tokens for publishing retire on 1 December 2026. [first-party]
- **Open VSX.** Free, run by the Eclipse Foundation; several AI editors (press reports name Cursor, Windsurf and VSCodium) install extensions from it rather than from Microsoft's store. Claim your namespace by a public GitHub issue so the listing shows as verified; automated security checks have been enforced since March 2026. Publish to both stores from the same CI job. [first-party; press for the editor list]
- **JetBrains Marketplace.** Every plugin is reviewed (allow 3–4 working days). Paid plugins need a legal entity; JetBrains takes 15%, never more than 25%. It can remove any plugin "at its sole discretion", and removed 15 malicious AI plugins in June 2026. [first-party]
- **Chrome Web Store.** Review takes days to weeks, longer for broad permissions or obfuscated code. From August 2026 a publisher gets two extension slots by default, raised for "quality and usage"; ratings now weight recent reviews; the Featured badge is being retired. You cannot pay to be featured. All Manifest V2 extensions were removed on 31 August 2026. [first-party]
- **Package registries.** npm may take up to two weeks to index a new package. Download counts include CI, mirrors and bots (npm: under about 50 a day is noise), and both downloads and GitHub stars can be faked cheaply. Developers still pick packages by downloads, stars and README size, so a clear README with a quickstart is your listing page. Use trusted publishing from CI (npm and PyPI) so users can see where a package was built. [first-party; research]

## Other products' app marketplaces

_In short:_ If your product extends another platform, its app store is the main channel but usually has an entry gate or needs installs first. Write the first line for the store's search and budget for reviews.

These are the main channel for a product that extends one platform. Most have an entry gate or a ranking that needs installs first.

| Store | Entry gate | Review time | Badge that helps rank | Platform's cut |
|---|---|---|---|---|
| Atlassian | None | 10–15 business days | "Runs on Atlassian" (automatic for apps hosted on Atlassian's platform) | 17% Forge, 25% Connect from 1 Oct 2026; 0% on the first $1M on pure Forge apps |
| Slack | 10 active workspaces, held for the whole review | Up to 10 business days, then up to 10 weeks | Featuring on request | None found |
| Zapier | Own the API; working test account | Contact within 1 week; 90 days in beta | Partner tiers (50, 350, 3,000 active users) unlock listing placement | None found |
| Shopify | None; billing must go through Shopify | Not published | Built for Shopify (50 installs from paid shops, 5 reviews, speed limits) gives "higher search rankings" | 0% on first $1M lifetime, then 15% |
| Salesforce AppExchange (now AgentExchange) | Security review, $999 per attempt for paid apps, usually two attempts | About 5–8 weeks | Popularity from installs and demos; reviews don't count | 15% (ISVforce), 25% (OEM) |
| HubSpot | 3 active installs from unrelated accounts | 10 business days | Certified (60 installs, 6 months listed) gives a badge and filter, no stated rank boost | None |

All [first-party], read 2026-10-05; check current terms before you commit.

- **Write the first line for the store's search.** Atlassian says the name, tagline and short description matter most; Shopify says keyword stuffing now matters less than how merchants behave after searching. Treat the listing as a landing page (see **landing-pages-and-cro**). [first-party]
- **Shopify sells ads** in its search and category results (cost per click). Use them only after the listing converts. [first-party]
- **Salesforce's security review is real money and weeks.** Budget about $2,000 and two months before the first paid listing. [first-party]

## Cloud marketplaces: a way to buy, not a way to be found

_In short:_ AWS, Google Cloud and Microsoft marketplaces let buyers pay on their existing cloud bill and use committed spend, but they do not help buyers find you. Use private offers for buyers who already chose you.

- **What they give you**: the buyer pays on their existing AWS, Google Cloud or Microsoft bill and can use money already committed to that provider. Microsoft counts 100% of the price toward a buyer's Azure commitment for "Azure benefit eligible" offers; AWS and Google count marketplace purchases toward commitments, with caps around 25% per an analyst report. [first-party; analyst]
- **Private offers** are the main tool: a price and contract made for one named buyer, shown only to them. A reseller can also make one for you (a "channel partner private offer"). [first-party]
- **Fees are low**: SaaS 3% on AWS, Google and Microsoft; private offers on AWS and Google fall to 2% above $1M and 1.5% above $10M; renewals 1.5% on all three. AWS charges 20% on software customers run on their own servers (machine images, containers). [first-party]
- **Co-sell needs results first**: AWS ISV Accelerate wants 5 launched and 15 qualified deals shared with AWS in 12 months; Microsoft's Azure co-sell status needs $100,000 of Azure or marketplace revenue in 12 months and is required before your offer counts toward a buyer's Azure commitment. [first-party]
- **Setup takes weeks**: AWS review normally 2–4 weeks; paid sellers must be based in listed countries with a USD bank account; Google requires the product to run mainly on Google Cloud; Microsoft requires a multitenant SaaS on Entra ID. [first-party]
- **Evidence on value is thin**: analysts put 2023 marketplace sales at $16B and forecast far more [analyst]; a marketplace-tooling vendor's survey found 35% of sellers made under 1% of revenue there [vendor; sample size not stated]. No source shows buyers discovering small vendors by browsing these stores.

## Review sites (G2, Capterra, TrustRadius, Gartner Peer Insights)

_In short:_ Review sites need a minimum number of recent reviews before you rank. Ask all customers, never only happy ones, never tie gifts to ratings, and start with the free profile.

- **One company now owns most of the channel**: G2 bought Capterra, Software Advice and GetApp (closed February 2026). Gartner Peer Insights and TrustRadius are the main independents. [snippet-only for deal terms]
- **Thresholds before you show up in rankings**: G2 Grid needs 10 reviews; G2's "Users Love Us" badge 20 at 4.0+ stars; Capterra Shortlist 20 in 24 months; TrustRadius Top Rated 10 in 12 months (2022 rules); Gartner Customers' Choice 50 in 12 months, and reviews from companies under $50M revenue don't count, so it suits enterprise products only. Old reviews fade: on G2 a review keeps about 3% of its weight after about 3 years. [first-party; Gartner and TrustRadius partly snippet-only]
- **Collecting reviews: the rules are the same everywhere.** Ask all customers (or a broad cross-section), never only the happy ones. Small thank-you gifts are allowed (G2 up to $100, Gartner under $25, Capterra "nominal") but must not depend on the rating, and the site labels them. No reviews from staff, family or competitors. The US FTC rule (October 2024) bans paying for a particular sentiment, undisclosed insider reviews and threats to remove reviews; whether it covers business buyers is not settled, but the sites' own rules already forbid the same things. See **privacy-and-marketing-law**. [first-party; regulator]
- **Ask at a moment of success**, the same timing as referral asks, and expect loyal customers to review less: in one peer-reviewed study of a B2B sourcing site, buyers who traded more with a supplier were less likely to review it. [research; one platform, not software]
- **Free is enough to start.** Claiming a profile and collecting reviews is free; paid tiers (G2 from $299 a month) add gift-card credits, badge licensing for your own marketing, and visitor data. [vendor]
- **Do review sites feed AI answers?** Disputed. G2's own surveys and citation counts say yes; an independent test of 233 ChatGPT software recommendations found no direct G2 or Capterra citations, and in G2's own data review count explains under 1% of citation differences. Treat a review profile as one of the third-party mentions AI answers draw on, not a switch. See **ai-assistant-visibility**. [vendor; secondary]
- **Do reviews drive B2B software sales?** No peer-reviewed study found. The "90% of buyers read reviews" figure is a 2017 G2-sponsored survey of 548 people. [vendor]

## What research says about joining a platform's ecosystem

_In short:_ Studies suggest joining a platform's ecosystem can lift sales, but the firms that joined were already stronger, early entry does not decide a category, and most listings fade within a year or two.

- **The best study is about SAP.** Among 1,210 small enterprise-software vendors (1996–2004), those that became SAP-certified partners had about 26% higher sales and a 5.9-point higher chance of going public, more if they had strong patents or copyrights or strong sales and service teams. [research; observational; one platform; read in full]
- **But the joiners were already different.** Only 35 of 1,220 vendors joined, and firms with stronger IP and sales capability were more likely to join. Part of the gain is who chose to join. [research; same data]
- **Platforms promote what serves the platform.** Studies of game consoles and Google Play awards find promotion is not simply "best in class", and an award changes what winners build and draws rivals into their niche. [research]
- **Early entry does not decide a category.** In Shopify's store, later entrants grew faster than early ones in 88% of 50 categories, and category leaders changed in 92% over seven years. [research; preprint; one store]
- **Most listings fade.** About 60% of Chrome extensions stay in the store only a year; the median Shopify app that left peaked at 8 installs. [research]

## Which listings fit which business and stage

_In short:_ Choose listings by business type and stage: developer tools start with registry entries, platform extensions with the platform's store, and sales-led enterprise software lists on cloud marketplaces only when a named buyer asks.

| Business type | No users yet | First 1–20 customers | Repeatable sales |
|---|---|---|---|
| Developer tool, API, CLI | Package registry entry with a clear name and README; GitHub Action if it runs in CI; official MCP Registry if agents use it; VS Code plus Open VSX if it lives in the editor | Claude, Docker and OpenAI directories once the server is remote and annotated; JetBrains if users are there; a workspace-recommendation snippet in users' repos | Paid GitHub app (after 100 installs); verified badges; co-marketing with the platform |
| App that extends one platform (Shopify, Atlassian, HubSpot, Salesforce, Slack) | Build, and get the first installs directly; list where there is no gate (Atlassian, Shopify) | HubSpot (3 installs), Slack (10 workspaces); ask every customer for a store review | Built for Shopify, HubSpot certification, AppExchange (security review budget) |
| Horizontal B2B SaaS | Skip review sites (no reviewers yet) | Zapier integration once the API is stable; claim free G2 and Capterra profiles and collect 10–20 reviews from all customers | Gartner Peer Insights for enterprise buyers; cloud marketplace private offers when a buyer asks or wants to use committed spend |
| Sales-led enterprise software | Nothing to list yet | A cloud marketplace listing only if a named buyer asks to buy through it | Private offers through resellers; co-sell after its revenue gates |
| Browser extension | Chrome Web Store (and other browser stores) with a narrow single purpose | Ask active users for ratings: recent ones now count more | Keep updating; inactive, broken items get removed |

Not a fit: services firms, local businesses and online shops (see **local-seo** and **ecommerce-dtc**); mobile apps (see **app-store-discovery**). [synthesis from the first-party rules above]

## Listings are rented: platform risk

_In short:_ Stores change fees, entry gates and whole product lines, and can remove you quickly. Capture customer email at install, track each store's share of customers, and prefer listings that cost nothing to keep.

Every platform in this playbook changed its rules between 2024 and 2026. [first-party]

- **Fees change.** Atlassian cut the partner share on Connect apps from 85% to 75% in 2026 and on Forge to 83%, while giving 100% of the first $1M to apps built only on Forge. Shopify moved its free first $1M from yearly to lifetime. GitHub cut its fee from 25% to 5% (2021). AWS cut fees in 2024.
- **Entry gates move.** Slack lowered its install minimum to 5 workspaces in 2025, raised it back to 10 in 2026, and now requires it throughout a review that can last 10 weeks. Chrome now limits new publishers to two extensions by default.
- **Whole product lines end.** Atlassian Server apps lost support in February 2024; Data Center apps go read-only in March 2029. Chrome removed every Manifest V2 extension in August 2026. Atlassian's Cloud Fortified badge and Chrome's Featured badge end in 2026. AppExchange became AgentExchange; Microsoft merged two marketplaces.
- **Removal is quick and one-sided.** JetBrains at "sole discretion"; Slack without notice for abandoned apps; VS Code removals are permanent.
- **The platform can enter your category.** When Shopify launched its own chat app, two years of growing competition in that category reversed. [research; preprint] See **platform-and-feature-risk** for the research on platform entry.
- **New directories are unstable.** The official MCP Registry is still a preview with possible data resets; one large MCP directory paused submissions; Claude's directory dropped local-server listings.

What to do about it:
- Get the customer's email and account into your own systems at install, so a delisting does not lose them.
- Track the share of new customers from each store; read **platform-and-feature-risk** before one store passes about half.
- Before building, read the developer terms for removal rights, fee-change notice (JetBrains gives one month) and data rules.
- Prefer listings that cost nothing to keep (registries, free profiles) over ones that need yearly recertification, unless the store is your main channel.

## How to measure and when to stop

_In short:_ Give each listing its own tagged link and a how-did-you-hear field, use the store's own data, and judge a free listing after about 90 days. Drop paid tiers that bring no tagged signups.

- Use a separate tagged link per listing where outbound links are allowed (build_utm_link), and a free-text "How did you hear about us?" field at signup.
- Use the store's own data where it exists: HubSpot listing analytics (impressions, average position, search terms), Claude's directory funnel (views, install clicks, installs), Chrome impressions and installs, GitHub traffic (export weekly; referrers are kept 14 days).
- Judge a free listing after about 90 days with a complete page and a few reviews. Keep free listings that cost nothing to maintain; drop paid tiers and yearly certifications that bring no tagged signups. [practitioner]
- For agents as users, log the MCP client name and first successful call (see **developer-tools**).

## Common mistakes and folklore

_In short:_ Avoid listing everywhere before anyone uses the product, paying for directory-submission services, treating badges as quality, asking only happy customers for reviews, expecting cloud marketplaces to bring new buyers, and relying on one store.

- Listing everywhere before anyone uses the product, then reading silence as "no demand". Most stores cannot rank a listing with no installs.
- Paying for "submit to 100 directories" services. No evidence they bring users; low-value links can count as link spam.
- Believing npm still ranks by quality and popularity scores. Removed in December 2024.
- Assuming the first app in a category wins it. In Shopify's store, later entrants usually grew faster (preprint).
- Treating a verified badge as a quality signal. JetBrains says its badge "does not guarantee the quality of plugins"; GitHub does not inspect third-party code.
- Asking only happy customers for reviews, or tying a gift to a good rating. Every review site forbids it, and the FTC bans sentiment-conditioned rewards.
- Believing you must be on G2 to appear in AI answers. The evidence is disputed.
- Expecting a cloud marketplace listing to bring new buyers. It helps buyers who already chose you to pay.
- Quoting "joining an ecosystem raises sales 26%" as a promise. It is one platform, 1996–2004, and the firms that joined were already stronger.
- Building on one store's rules without a plan for the next rule change.

## Sources

research/marketplace-and-registry-listings.md (MCP Registry, Claude, OpenAI, Docker, Smithery, PulseMCP, Glama and mcp.so docs; GitHub, VS Code, Open VSX, JetBrains and Chrome Web Store docs; Atlassian, Slack, Zapier, Shopify, Salesforce and HubSpot docs; AWS, Google Cloud and Microsoft marketplace docs; Canalys 2024; Tackle 2024–2025; npm, PyPI and crates.io docs and source; Mujahid et al. 2022; Swierzy et al. 2025; He et al. 2024; G2, Capterra, TrustRadius and Gartner rules; FTC 16 CFR 465; Ding et al. 2026; Ceccagnoli et al. 2012; Huang et al. 2013; Foerderer et al. 2021; Rietveld et al. 2019 and 2021; Bresnahan et al. 2015; Assabese et al. 2026 preprint; Song et al. 2018; Hsu et al. 2024). research/small-bets-presence.md (Bet 1 listings, Bet 7 integrations; the G2-vs-independent AI citation dispute; MCP directory crawl). research/platform-and-feature-risk.md (platform entry research and mitigation). research/ai-assistant-visibility.md (citation sources). Read 2026-10-05 unless the research note marks an item snippet-only.
