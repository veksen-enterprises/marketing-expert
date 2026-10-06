# Fully open source with a paid hosted service — Research Notes

Scope: a developer tool that is fully open source (permissive licence, self-hostable, nothing held back) and earns money from a paid hosted version sold for convenience. Covers who pays for hosting when self-hosting is free, pricing the hosted service against the cost of self-hosting (with media and image-service list prices as reference points), the risk that a large cloud provider hosts the project, licence choice, funnel mechanics between self-hosted and hosted, and trust signals for a hosted media service. Researched 2026-10-05.

This note extends, and does not repeat:
- research/developer-tools.md §1 (Elastic, HashiCorp and Redis licence changes; AWS Valkey pricing).
- research/early-stage-gtm-devtools.md §4 (commercial open source: the "1–2% of users pay" lore [118][125], IPO filings [124], licence and adoption studies [119], relicensing studies [120][121], Percona survey [122], Elastic and Redis reversals [123]).
- research/small-bets-presence.md Bet 2 (open-source a useful piece).
- research/activation-and-analytics.md (developer-tool telemetry norms, opt-in, DO_NOT_TRACK).

**Access.** Company pages and docs below were fetched and read on 2026-10-05 unless marked. OpenAlex was rate-limited this session, so research papers were found through web search and read at arXiv, the author's site or a repository page. SEC filings were not fetched (sec.gov asks for a contact header); the GitLab revenue split is from search text.

Tags: [research] peer-reviewed or preprint · [first-party] the company's own statement, docs or pricing page (self-interested where it explains its own choices) · [vendor] commercial interest in the conclusion · [practitioner] operator view · [regulator] law or regulator text.

## Sources

### Who pays for hosting when self-hosting is free

1. Plausible, "How we built a $1M ARR open source SaaS" (blog). https://plausible.io/blog/open-source-saas [first-party; read 2026-10-05]
   - First paid subscriptions May 2019 ($64 MRR); $10k MRR January 2021; $500k ARR October 2021; $1M ARR on 2 June 2022 ($83,637 MRR), with 7,000+ paying subscribers and a team of 4.
   - Licence history: MIT from September 2019, AGPL from October 2020.
   - Gives no self-hosted install counts and no split of revenue by source; the only revenue is the hosted service.
2. Plausible, "About" page. https://plausible.io/about [first-party; read 2026-10-05]
   - "More than 21,000 paying subscribers"; a team of 10; crossed $1M ARR in 2022 and profitable since; no current ARR given; no outside investment.
   - Presents the AGPL code as an exit path: customers are "not locked in" and the code "can be forked".
3. Plausible, "Introducing Plausible Community Edition," 23 February 2024. https://plausible.io/blog/community-edition [first-party; read 2026-10-05]
   - Self-hosted version renamed "Community Edition" (CE), still AGPL, released twice a year.
   - "We make $300 per month from donations from our self-hosted users"; at that rate it would take more than ten years to equal one month of team salaries. 12,000+ subscribers at the time; 8 core team members.
   - Reason given: corporations using the self-hosted code "in a way it was never intended for"; the managed-hosting tooling (sites API, customer management) was removed from CE, and funnels and ecommerce revenue goals were kept for paying cloud subscribers.
   - So Plausible is no longer "nothing held back": a fully open model was changed to a partly held-back one after five years.
4. Plausible, "Self-hosted web analytics" (CE vs Cloud comparison). https://plausible.io/self-hosted-web-analytics [first-party; read 2026-10-05]
   - Cloud-only: funnels, user journeys, ecommerce revenue goals, SSO, sites API; stronger bot filtering (about 32k data-centre IP ranges excluded) vs basic filtering in CE.
   - Cloud updated several times a week; CE twice a year. Cloud has human support; CE has community support only.
   - Lists the self-hoster's jobs: servers, installation, maintenance, security patches, backups, uptime monitoring, capacity; costs move from a subscription to server, CDN and backup bills.
5. Plausible docs, "Import stats using CSV files." https://plausible.io/docs/csv-import [first-party; read 2026-10-05]
   - Documents how to "migrate from Plausible CE to our managed hosting (or vice-versa)" by CSV export and import. Only native data moves; imported Google Analytics data does not. (Search text adds that CE 2.1.0-rc.1 or later is needed; not seen on the page read.)
6. Ghost Foundation, "About." https://ghost.org/about/ [first-party; read 2026-10-05; live figures, date of figures not stated]
   - MIT licence; non-profit foundation; revenue comes from the Ghost(Pro) managed hosting service.
   - Shows ARR $11,099,649; MRR $924,970; 30,579 active customers; "100M+" installs; net churn 2.92%.
   - The closest public example to "fully open, permissive, the hosted service pays for it". Install counts and customers are unlike units; do not divide one by the other.
7. PostHog docs, "Self-host." https://posthog.com/docs/self-host [first-party; read 2026-10-05]
   - MIT licence; free Docker Compose "hobby" deployment; no customer support and no guarantees; continuous shipping from main, no tagged self-hosted releases.
   - Says Cloud is "usually far cheaper than doing it yourself"; all paid-plan features are Cloud-only. Suggests reconsidering self-hosting above roughly 300k events, 1k recordings or 300k flag calls a month.
8. PostHog, "Sunsetting Kubernetes support," February 2023. https://posthog.com/blog/sunsetting-helm-support-posthog [first-party; read 2026-10-05]
   - About 3.5% of users ran the Kubernetes self-hosted deployment. Debugging customer installs across Kafka, ClickHouse, Postgres and Redis took a small infrastructure team's time out of proportion to that group.
   - Offered: migration to PostHog Cloud (including an EU region), the Docker Compose option, and 12+ months of security updates for existing installs.
   - Context in the post: revenue grew 6x in 2022 while Kubernetes adoption stayed flat.
9. PostHog Handbook, "How we got here." https://posthog.com/handbook/story [first-party; read 2026-10-05]
   - Started open source and self-hosted (2020); removed paid self-hosted deployment in February 2023 to focus on Cloud; 100,000 customers (paying or free) in October 2024; "low $10s of millions" ARR in June 2025.
10. Supabase docs, "Self-Hosting." https://supabase.com/docs/guides/self-hosting [first-party; read 2026-10-05]
    - Self-hosted lacks branching, advanced metrics, managed backups and point-in-time recovery, analytics and vector buckets, ETL and the Management API. Community support only.
    - Lists the self-hoster's jobs: provisioning, security hardening and updates, configuration, Postgres maintenance, high availability, backups and disaster recovery, monitoring.
    - Says self-hosting suits teams that need full data control, have compliance rules against managed services, or need an isolated environment.
11. Supabase docs, "Architecture." https://supabase.com/docs/guides/getting-started/architecture [first-party; read 2026-10-05]
    - Components are MIT, Apache 2.0 or the PostgreSQL licence.
    - "To avoid lock-in, we make it easy to migrate in and out"; uses existing standards for portability (a standard Postgres dump, CSV). Supabase's later funding post (Series E, 3 October 2025, $100M at a $5B pre-money valuation) gives no revenue or self-hosting figures. https://supabase.com/blog/supabase-series-e [first-party; read 2026-10-05]
12. GitLab FY2025 annual report (year to 31 January 2025): SaaS revenue $216.3M (28% of total), self-managed subscription revenue $458.9M (61%). https://www.sec.gov/Archives/edgar/data/1653482/000162828025014344/gtlb-20250131.htm [first-party; SEC filing; snippet-only (sec.gov needs a contact header)]
    - GitLab is open core, not fully open: large buyers paid more to run it themselves under a paid licence than for hosting. A reminder that "hosted" is not the only thing people pay for.

### Licence choice and cloud-provider hosting

13. Sentry, "Re-Licensing Sentry," 6 November 2019. https://blog.sentry.io/relicensing-sentry/ [first-party; read 2026-10-05]
    - BSD 3-clause since 2008 → Business Source License (BSL); code becomes Apache 2.0 after 36 months; the only restriction is offering a competing commercial Sentry service.
    - Reasons: "funded businesses plagiarizing or copying our work"; big cloud providers had "not yet" sold Sentry as a service, but that possibility was called "an existential threat". Self-hosting at your own company was unchanged.
14. Sentry, "Let's Talk About Open Source," 3 August 2023. https://blog.sentry.io/lets-talk-about-open-source/ [first-party; read 2026-10-05]
    - Restates that several venture-backed companies used or intended to use Sentry's code before 2019. No self-hosting or revenue figures. Sentry later moved to its Functional Source License (two-year change date) (search text: https://blog.sentry.io/introducing-the-functional-source-license-freedom-without-free-riding/ [snippet-only]).
15. Elastic (Shay Banon), "Amazon: NOT OK - why we had to change Elastic licensing," 19 January 2021. https://www.elastic.co/blog/why-license-change-aws [first-party; self-interested; read 2026-10-05]
    - Says AWS launched "Amazon Elasticsearch Service" in 2015, which Elastic calls a trademark violation; AWS offered the products as a service "without collaborating with us"; an AWS executive's claim of collaboration was false; users were confused about who provided the service.
    - Adds to research/developer-tools.md §1: the conflict began six years before the licence change, and the name confusion was part of the grievance.
16. MongoDB, "Server Side Public License FAQ." https://www.mongodb.com/legal/licensing/server-side-public-license/faq [first-party; read 2026-10-05]
    - MongoDB was AGPL before 16 October 2018 and moved to SSPL then. Its reason: "once an open source project becomes interesting, it is too easy for large cloud vendors to capture all the value but contribute nothing back", and cloud vendors were "testing the boundaries" of the AGPL.
    - So AGPL alone did not stop the hosting MongoDB objected to, by its own account.
17. Grafana Labs, "Grafana, Loki, and Tempo will be relicensed to AGPLv3," 20–21 April 2021. https://grafana.com/blog/2021/04/20/grafana-loki-tempo-relicensing-to-agplv3/ [first-party; read 2026-10-05]
    - Apache 2.0 → AGPLv3 for the main projects; plugins, agents and some libraries stayed Apache.
    - Chose AGPL over SSPL because it stays OSI-approved open source; admits AGPL "doesn't 'protect' us to the same degree as other licenses (such as the SSPL)".
18. Plausible, "Why we've changed our open source license" (MIT → AGPL), 12 October 2020. https://plausible.io/blog/open-source-licenses [first-party; read 2026-10-05]
    - At least one company copied the MIT code, closed it and resold it as a competitor; large corporations asked to resell the self-hosted version to thousands of their clients without contributing. No names, dates or counts given.
19. Google Open Source, "AGPL Policy." https://opensource.google/documentation/reference/using/agpl-policy [first-party; read 2026-10-05]
    - "Code licensed under the GNU Affero General Public License (AGPL) MUST NOT be used at Google" (with limited exceptions where an alternative licence exists). One large company's public rule; many companies' internal lists are not published (practitioner commentary, e.g. https://heathermeeker.com/2023/10/13/agpl-in-the-light-of-day/ [practitioner; snippet-only]).
20. Jahanshahi, M., Vasilescu, B. & Mockus, A. "The Prevalence and Impact of Licenses in Open Software Projects." arXiv:2606.23445, 22 June 2026. https://arxiv.org/html/2606.23445 [research; preprint; observational; read 2026-10-05 (HTML)]
    - World of Code data, 131,171,379 projects. 83% have no licence. Of licensed projects: 70.18% permissive, 15.35% copyleft, 5.26% weak copyleft, 4.82% "conditional open", 4.39% public domain. Permissive share is growing.
    - Copyleft licences change least (about 8% of projects change, against about 25% for conditional-open and weak copyleft).
    - Moving from restrictive to permissive went with less activity in C/C++ (odds ratio about 0.77–0.78) and more in Python (about 1.73–2.02). Effects depend on the ecosystem; no uniform licence effect.
    - Limitation stated: licences inside individual files may be missed.
21. August, T., Shin, H. & Tunca, T.I. (2013). "Licensing and Competition for Services in Open Source Software." *Information Systems Research* 24(4):1068–1086. Working paper read: https://rady.ucsd.edu/_files/faculty-research/august/licensing-and-competition.pdf [research; peer-reviewed; theoretical model; read 2026-10-05 (abstract and introduction of the March 2013 version)]
    - A game-theory model of an originator and a later contributor competing to sell services around the software.
    - If the contributor (think: a bigger firm that builds on your code) is efficient at development, the originator should still open the code: the contributor serves the high end and the originator serves the lower end. If the contributor is inefficient, the originator does better keeping the code proprietary.
    - A model, not data. It predicts that a strong outside host takes the top of the market, which matches the Elastic and MongoDB accounts.

### Reference prices for hosted image services

22. Cloudinary, "Pricing." https://cloudinary.com/pricing [vendor; first-party pricing; read 2026-10-05]
    - Free: 25 credits a month. Plus: $99/month ($89 yearly), 225 credits. Advanced: $249/month ($224 yearly), 600 credits. Enterprise: custom, with "enterprise SLAs", SSO and multi-CDN.
    - One credit = 1,000 transformations, or 1 GB managed storage, or 1 GB image bandwidth (2 GB video bandwidth on paid plans).
    - Our arithmetic: on Plus, a credit costs $0.44 ($0.40 yearly), so $0.44 per GB delivered or per 1,000 transformations. Overage terms were not on the page read.
23. imgix, "Pricing." https://www.imgix.com/pricing [vendor; first-party pricing; read 2026-10-05]
    - Starter $25/month (100 credits) up to Growth Plus $500/month (3,570 credits); about $0.25 down to $0.14 a credit monthly; annual billing saves 15–17%. 30-day trial with 100 credits, no card.
    - Delivery: 1 credit per GB; cache storage 2 credits per GB a month; transformations vary by feature.
24. imgix docs, "Creating sources." https://docs.imgix.com/en-US/getting-started/setup/creating-sources [first-party; read 2026-10-05]
    - A source "connects Imgix to your asset storage" (S3, Google Cloud Storage, Azure and others) using the customer's own bucket credentials; a web proxy source can proxy any image URL. Originals stay in the customer's storage, which is an exit path by design.
25. Cloudflare Images docs, "Pricing." https://developers.cloudflare.com/images/pricing/ [vendor; first-party pricing; read 2026-10-05]
    - Free plan: 5,000 unique transformations a month; above that, new transformations return an error and nothing is charged.
    - Paid: first 5,000 included, then $0.50 per 1,000 unique transformations a month; storage $5 per 100,000 images a month; delivery $1 per 100,000 images.
    - Repeat requests for the same transformation in a month count once.
26. Vercel docs, "Limits and Pricing for Image Optimization" (updated 11 August 2026). https://vercel.com/docs/image-optimization/limits-and-pricing [vendor; first-party pricing; read 2026-10-05]
    - Hobby includes 5K transformations, 300K cache reads and 100K cache writes a month (non-commercial use only). On-demand: $0.05–$0.0812 per 1K transformations; cache reads $0.40–$0.64 per 1M; cache writes $4.00–$6.40 per 1M (8 KB units). Transformations bill on every cache miss or stale. Data transfer and CDN requests are billed on top.
    - Hobby over the limit: new images fail with a 402 error, cached images keep working, no charge. Pro can set spend management to notify or pause.
    - Pricing moved from source-image counts to this model; enterprise teams created before 18 February 2025 may stay on the legacy model until contract end.
27. Next.js docs, "How to self-host your Next.js application" (v16.3.8, updated 25 August 2026). https://nextjs.org/docs/app/guides/self-hosting [first-party; read 2026-10-05]
    - "Image Optimization through next/image works self-hosted with zero configuration" with `next start`; a custom loader can send images to a separate service; on glibc Linux the image library may need extra memory configuration.
    - So for the largest React framework, the free self-hosted image path already exists; a hosted image service competes with "do nothing extra", not only with other vendors.
28. AWS, "Amazon CloudFront pricing." https://aws.amazon.com/cloudfront/pricing/ [vendor; first-party pricing; read 2026-10-05; re-check before quoting]
    - Lists flat-rate plans with "no overage charges": Free $0 (1M requests, 100 GB), Pro $15 (10M requests), Business $200 (125M), Premium $1,000 (500M); the data-transfer column read as "50TB" for each paid plan, which looks odd and was not confirmed. Shows that self-hosters can now buy flat-priced delivery.
29. Vercel docs, "Working with the Deploy Button" (updated 12 March 2025). https://vercel.com/docs/deploy-button [first-party; read 2026-10-05]
    - A link that clones a public repository into the user's Git account and creates a deployed project in one flow. Platforms with similar template buttons exist; not checked here.

### Trust and exit

30. Opara-Martins, J., Sahandi, R. & Tian, F. (2016). "Critical analysis of vendor lock-in and its impact on cloud computing migration: a business perspective." *Journal of Cloud Computing* 5:4. doi:10.1186/s13677-016-0054-z. Abstract via https://eprints.bournemouth.ac.uk/23419/ [research; peer-reviewed; survey, n=114; read 2026-10-05 (abstract only; full text redirected to a login)]
    - Lock-in is a major barrier to cloud adoption; most customers are unaware of proprietary formats that limit portability. Advice: favourable contracts, vendors that support standard formats and protocols, knowing dependencies between services. Percentages in the full paper were not seen.
31. GDPR Article 28 (Processor). https://gdpr-info.eu/art-28-gdpr/ [regulator text via an unofficial consolidation; read 2026-10-05]
    - A processor needs a written contract; prior written authorisation for sub-processors; security measures; help with data-subject requests and audits; and "at the choice of the controller, deletes or returns all the personal data" at the end of the service.
    - An image service that stores customer images, or logs viewers' IP addresses, may be a processor for its customers, so it needs a data processing agreement and a sub-processor list.
32. Cloudinary, Terms of Use. https://cloudinary.com/tou [first-party; snippet-only]
    - Search text: Cloudinary "strives for a 100% Uptime", measured by Cloudinary, for its console and API. Financial SLAs appear on the Enterprise plan (item 22). The SLA page tried (cloudinary.com/sla) returned 404.

### Weak or unchecked

33. A figure attributed to Tomasz Tunguz (Theory Ventures), relayed by a legal-guide site: Apache projects were 16% of a set but over 50% of venture dollars; MIT 20% of projects but under 1% of dollars. [practitioner; secondary; snippet-only; original not found] Not used.
34. Linux Foundation Research, COSSA and Serena, "The State of Commercial Open Source 2025." https://www.linuxfoundation.org/research/2025-state-of-commercial-open-source [vendor/foundation; landing page read 2026-10-05]
    - The landing page gives no split by business model (hosted, open core) or licence type. Its valuation findings are already in research/early-stage-gtm.md [60].

## What this means

- **Who pays.** In every public case, revenue comes from the hosted service, not from self-hosters. Plausible's self-hosters gave $300 a month in donations against 12,000+ paying cloud subscribers [3]. Ghost, MIT-licensed with nothing held back, reports about $11.1M ARR from hosting [6]. People pay to avoid the jobs the companies list: servers, upgrades, backups, uptime, capacity [4][10]. None of these companies publishes how many self-hosters later convert, so the conversion rate from self-hosting to paying is unknown.
- **"Nothing held back" tends to erode.** Plausible (MIT → AGPL in 2020; features kept for cloud in 2024) [1][3], PostHog (paid features Cloud-only; Kubernetes self-hosting dropped) [7][8] and Supabase (managed backups, branching and more missing from self-hosted) [10] all hold something back now. Ghost is the counter-example [6]. The usual line is operational features that only make sense at scale (backups, multi-tenant management, advanced bot filtering), not the core product.
- **The self-hosted path has a support cost.** PostHog stopped supporting a deployment used by about 3.5% of users because debugging it cost too much [8]. Self-hosted releases on a slower cadence (Plausible twice a year) cut that cost [4].
- **Pricing against self-hosting.** List prices for hosted image services use different units: Cloudinary credits (bandwidth, storage and transformations share one pool) [22], imgix credits [23], Cloudflare per unique transformation per month and per 100k images delivered [25], Vercel per transformation on every cache miss plus cache and transfer fees [26]. A buyer cannot compare them without a worked example. Our arithmetic for 1 million views a month at 100 KB (100 GB) with 20,000 distinct variants: Cloudflare $7.50 for 15,000 billable transformations, plus $10 delivery if the images are stored with Cloudflare (whether delivery fees apply to remote-origin images was not checked); Cloudinary about 120 credits (20 for transformations, 100 for bandwidth), so the $99 Plus plan; imgix at least 100 delivery credits, so $25 or more before transformation credits; Vercel 20,000 transformations at $0.05–$0.0812 per 1K, about $1–$1.62, before cache and transfer fees (not computed). Plan base fees and storage are ignored. This gives a new entrant an opening: price on one clear unit and publish a calculator. The free alternative for many buyers is the image optimisation already built into their framework [27].
- **Cloud-provider risk.** For a permissive project, a large host can legally sell it. Elastic's account says the trouble started with the name and the claim of partnership, years before the licence change [15]. AGPL is open source and deters some hosts, but MongoDB says cloud vendors tested its limits [16] and Grafana says it protects less than SSPL [17]; it also blocks use inside some large companies [19]. A theory paper predicts that a strong outside host takes the high end of the market [21]. No study measures how often a cloud provider hosts a small project; the public cases are all large projects.
- **Licence effect on adoption is ecosystem-specific** [20]; permissive is the majority and growing. This agrees with research/early-stage-gtm-devtools.md [119] that there is no single licence effect.
- **Exit path.** Plausible documents CSV migration both ways [5]; Supabase uses standard dumps "to avoid lock-in" [11]; imgix leaves originals in the customer's own bucket [24]. Lock-in worry is a recorded barrier to cloud adoption [30]. For a media service, the strongest exit path is that originals never leave the customer's storage and URLs can be pointed elsewhere.
- **Data handling.** A hosted image service is often a data processor under GDPR, with contract, sub-processor and deletion duties [31].

## Folklore and weak claims

- **"Self-hosted users convert to paid at X%."** No company in this note publishes it. The 0.5–3% figures are relayed lore (research/early-stage-gtm-devtools.md [118][125]).
- **"Hosted is always cheaper than self-hosting."** PostHog says so for its product [7]; it sells the hosted version. No independent cost comparison was found.
- **"AGPL stops cloud providers."** MongoDB's own account says it did not, for them [16].
- **"Permissive licences attract more venture money."** The only figure found (item 33) is secondary and unsourced.
- **"Apache 2.0's patent grant makes it the better choice for companies."** Common advice; no study of its effect on adoption was found.

## Open questions

- What share of self-hosters of a fully open tool ever pay for the hosted service, and how long it takes. No public data.
- Whether holding back operational features (backups, scale tooling) slows community adoption. Only company accounts exist.
- How often cloud providers or hosting resellers offer small (non-database) open-source tools as a service, and with what effect on the original company.
- Real time cost of self-hosting an image service (patching the image library, cache storage, bandwidth bills) against hosted prices. No independent measurement found.
- CloudFront flat-rate plan details (item 28) need re-checking.
