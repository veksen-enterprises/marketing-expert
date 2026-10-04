---
title: Platform risk and "feature, not a product" risk
summary: The risk that a big platform ships your product as a feature or cuts your access; what research shows happens when platforms enter, dated cases (Twitter, Reddit, Facebook, Google, Apple, AI model providers), the AI-wrapper question, warning signs, and how to reduce exposure.
tags: platform risk, feature not a product, sherlocking, platform dependence, api, absorption, ai wrapper, openai, apple, google, amazon, microsoft, bundling, dropbox, defensibility, dma, regulation
---

## Two different risks

1. **Absorption**: the platform (or an adjacent giant) ships a "good-enough" version of your product as a feature.
2. **Access**: the platform changes rules, prices or API access and your product stops working or stops being economical.

Both are common. Both have dated precedents below.

## What happens when a platform enters [research]

- **Amazon** (Zhu & Liu 2018; 163,853 products): Amazon entered ~3% of third-party product spaces within ~10 months, choosing those with **higher sales and better ratings**, and avoided spaces that need **more seller effort** to grow. Afterwards, affected sellers were discouraged from growing on the platform. Your success is visible on their dashboards; that's the entry signal.
- **Google on Android** (Foerderer et al. 2018; 6,620 apps): when Google entered photography apps, affected apps became **9.6% more likely to ship major updates**: entry increased attention to the category. Benefits went mostly to **larger, more diversified** developers.
- **Threat of Google entry** (Wen & Zhu 2019): developers facing a credible threat **raised prices and reduced innovation** on the exposed app and moved effort to unaffected apps.
- **Apple "Sherlocking"** (Leyden 2026 working paper; 22 App Store markets, 2016–2021): Apple's entry **reduced new third-party entry ~22%** with **no detectable increase in exits**; existing apps moved toward paid tiers. Effects were largest when the feature was built into the operating system.
- Exposure estimate: iOS 18 features overlapped apps with ~$393M annual revenue (Appfigures, 2024) [vendor; exposure, not realised loss].

**Read**: platform entry mostly chills *new* entrants and pushes existing ones toward paying power users. Being shallow and commodity-like is what gets you replaced; serving users who need more than the default is what survives.

## Access-cutting cases [first-party / press]

| When | Platform | What happened |
|---|---|---|
| 2012 | Twitter | API v1.1 capped client apps that mimic Twitter at 100k user tokens |
| Jan 2023 | Twitter/X | Third-party clients broke without notice; terms changed to ban "substitute or similar" products; free API ended; Enterprise ~$42k/month |
| 2023 | Reddit | API priced at $12,000 per 50M requests; Apollo said ~$20M/year; shut down 30 Jun 2023 |
| 2014–2015 | Facebook | Friends-data API removed; Zynga had 75–86% of revenue via Facebook (2012–13 10-Ks) |
| 2011 | Google | Panda update; Demand Media's Google traffic fell ~40% (Hitwise); Google was ~28% of its revenue |
| 2025 | Google | AI Overviews: organic clicks ~8% with an AI summary vs ~15% without (Pew) |
| Jun 2025 | Anthropic | Cut Windsurf's first-party Claude capacity with < 5 days' notice amid an OpenAI acquisition report |
| Jan 2026 | Anthropic | Blocked consumer-subscription credentials in third-party coding tools, citing existing terms |

Pattern: the clause that cut access was usually already in the terms ("substitute product", "competing product", token-type limits), and notice was short.

## "You're a feature, not a product"

- Origin: Steve Jobs to Drew Houston, December 2009, during a "nine-figure" acquisition pitch (Forbes 2011; Houston confirmed in 2012). Apple launched iCloud in 2011.
- How Dropbox survived (S-1, 2018: 500M+ registered users, 11M paying, $1.1B revenue 2017): it stayed **neutral across rival platforms** (Windows, Mac, iOS, Android, web), something no single platform owner would build well, and moved from consumer sync to team workflows. Storage did commoditise later.

Tests (synthesis):
- **Feature**: one step of a workflow the platform already owns; value disappears if the platform ships a good-enough default; no independent reason to open it.
- **Product**: owns a full job, with its own interface, data and repeat use; a segment needs more depth than any default.
- **Company**: several products, its own distribution, or a cross-platform position the platform is structurally unwilling to copy, plus a path to expand before the platform copies the first product.

## The AI version (2023–2026)

- **Absorption events**: ChatGPT added file/PDF upload (Oct 2023); OpenAI DevDay (Nov 2023) launched custom GPTs and the Assistants API, covering what many thin chat products sold. Jasper raised at $1.5B weeks before ChatGPT launched; in 2023 it cut its internal valuation, lowered forecasts, laid off staff and changed CEO.
- **Why the pressure continues**: Sequoia's David Cahn ("AI's $600B Question", 2024) estimated end-user AI revenue needed to justify infrastructure spending far exceeds current application revenue. Model providers have strong incentives to move into applications. [practitioner]
- **Counter-evidence**: application companies have scaled: Cursor (> $1B annualised revenue reported 2025), Harvey ($100M ARR Aug 2025), Perplexity. The pattern: they own a **vertical workflow** (legal), a **work surface** (the code editor) or a **destination/brand**, work across several models, and sell to buyers who need domain depth, compliance and integrations that a general chatbot won't prioritise. [press; later figures unverified]

## What reduces absorption risk

- **Depth over breadth**: own a whole job and the data and workflow around it. Platforms avoid spaces that need more effort (Zhu & Liu); survivors serve power users (Leyden).
- **Neutrality across rivals**: work across competing platforms or model providers, which no single platform will do well (Dropbox). Keep the ability to switch model providers within days.
- **Own the customer**: identity, billing and contact on your systems. Twitter and Reddit client apps had users but no portable relationship; when access went, users went.
- **Proprietary data that actually compounds**: only counts if it's exclusive, measurably improves the product for other customers, and the platform can't collect it itself. Most "data advantages" are scale effects with diminishing returns (Casado & Lauten, a16z 2019).
- **A channel the platform doesn't control**: direct list, community, enterprise relationships.
- **Portfolio**: Foerderer et al. and Wen & Zhu both found diversified developers handle entry better.

## Warning signs to watch

1. The platform's keynotes (WWDC, I/O, OpenAI DevDay, Build): every entry above was announced at one.
2. API deprecations and shorter support windows.
3. New terms language: "substitute", "competing product", limits on token types or automated access.
4. New pricing for API access.
5. Ownership or strategy changes at the platform, or acquisition talks involving you.
6. Your category ranking high on the platform's own visible metrics.
7. Platform job postings and earnings-call language naming your category. [practitioner logic; no empirical test]

## If entry looks likely

- Harvest the exposed product (raise price, cut new investment) and move effort to adjacent areas (Wen & Zhu).
- Move up to paid power-user segments the free default won't serve (Leyden).
- If you have scale, ship big updates while the category gets attention (Foerderer et al.).
- Consider selling: the platform or a rival may prefer buying to building (Dropbox was offered nine figures; Windsurf drew offers). See acquisition-and-exits.

## Regulation is upside, not protection

The EU Digital Markets Act (obligations from March 2024; first fines 23 Apr 2025: Apple €500M, Meta €200M) restricts "gatekeeper" (the largest platforms) self-preferencing and use of business users' non-public data. US v. Google search remedies (2 Sep 2025; final judgment Dec 2025; appealed Jan 2026): no Chrome sale, no exclusive default deals, some data sharing with competitors, six-year term. Japan's smartphone act restricts app-store self-preferencing [not re-verified]. None stops a platform shipping your feature, and relief takes years (Slack's 2020 complaint → 2025 remedy, binding for 7 years, 10 for interoperability and data portability).

## Risk questions to answer

1. If the platform shipped a free good-enough version next quarter, what share of our users would still pay, and why?
2. Does our success show on the platform's own metrics?
3. What share of revenue, acquisition and data access runs through any one platform? Above ~25% was existential for Zynga and Demand Media.
4. Which clause could end our access, and how much notice would we get?
5. Do we own customer identity, billing and contact?
6. Are we neutral across rival platforms/models? Could we switch providers in a week?
7. Are we one step of a workflow or the whole job / system of record (the main place the customer's data lives)?
8. Is our data exclusive and compounding, or a scale effect?
9. Who watches the warning signs, and what's the pre-agreed response?
10. Who would rather buy us than build us?

## Sources

research/platform-and-feature-risk.md (Zhu & Liu 2018; Foerderer et al. 2018; Wen & Zhu 2019; Leyden 2026; Appfigures 2024; Twitter, Reddit, Facebook, Zynga, Dropbox filings and announcements; Pew 2025; Cahn 2024; Casado & Lauten 2019; EU Teams decision 2025). All sources seen via search snippets; nothing read in full.
