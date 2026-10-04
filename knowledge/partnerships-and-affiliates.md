---
title: Partnerships, marketplaces and affiliate programs
summary: Integration and technology partnerships, app marketplaces, co-marketing, resellers and agencies, affiliate commission design, attribution and fraud, what partner-sourced vs partner-influenced pipeline data really shows, and when partners make sense by stage.
tags: partnerships, partners, partner program, integrations, technology partners, app marketplace, app store, appexchange, shopify app store, co-marketing, co-selling, resellers, channel partners, agencies, var, msp, affiliate, affiliate program, commission, cookie stuffing, affiliate fraud, partner-sourced, partner-influenced, crossbeam, ecosystem, business development
---

## Types of partnership and what each one gives you

A **partnership** here means another company helps you reach or win customers. The types behave very differently, so name the type before you design anything. [practitioner]

| Type | What the partner does | What you pay | Fits |
|---|---|---|---|
| Integration / technology partner | Their product connects to yours; shared customers | Engineering time, joint marketing | Products used next to a popular tool |
| App marketplace listing | The platform's store shows you to its users | Revenue share, review rules | Products that extend a platform (Shopify, Salesforce, Atlassian, HubSpot, Slack) |
| Co-marketing | Joint webinar, report, content, event | Time; shared lists only with consent | Two companies with the same buyer, different products |
| Reseller / channel partner (VAR: value-added reseller; distributor) | Sells your product, often on their own paper (contract) | Margin or discount, often 10–30%+ [rule-of-thumb] | Markets where buyers buy through intermediaries (public sector, SMB IT, regions you can't staff) |
| Agency / consultant / MSP (managed service provider) | Recommends, implements and runs your product for clients | Referral fee or revenue share, partner tier benefits | Products that need setup or ongoing service |
| Affiliate | Publishes content or links that send buyers; paid per sale or lead | Commission per conversion | Self-serve products with clear online checkout |

- An **ecosystem** is the set of all these partners around one product. Vendors in this space use "ecosystem-led growth" for the idea of using partner data to find and win deals. [vendor]
- Partners need a reason to care about you. Write down, per partner, what they get: revenue, a stickier product for their customers, services work, or content their audience wants. No answer means no partnership. [practitioner]

## Integrations and app marketplaces

- **Build the integration your best customers already ask for.** Check support tickets, sales-call notes and "what else do you use?" answers in customer-research. One deep integration used by many customers beats ten shallow logos. [practitioner]
- **Marketplace listings are a distribution channel with its own search engine.** Ranking inputs usually include installs, ratings, reviews and recency. Treat the listing like a landing page (see landing-pages-and-cro): clear outcome in the first line, screenshots, setup steps, pricing. [practitioner]
- **Scale is real on the big stores.** Shopify reported about US$1B paid to app developers in 2024; its revenue-share rule takes 0% on a developer's first US$1M, then 15% (check current terms on shopify.dev). [first-party, snippet-only]
- **Reviews early decide rank later.** Ask happy users for a review at a moment of success (the same moment logic as referral-programs).
- **Platform risk applies fully.** The platform can copy your feature, change the API or change the store rules. Read platform-and-feature-risk before you make one marketplace more than about half of new customers.
- **Integrations also reduce churn**: a customer who connected two tools has more to undo when leaving. This is practitioner belief; measure it in your own retention cohorts (metrics-and-measurement) instead of assuming it.

## Co-marketing and co-selling

- **Co-marketing**: pick partners whose customers match your ideal customer profile (ICP: the type of company that gets most value from you) but who do not compete. Share effort evenly, agree ownership of leads in writing before launch, and only share contact data where people consented to both companies (see outbound-and-abm for EU/UK rules). [practitioner]
- **Account mapping**: two partners compare customer and prospect lists, usually through a neutral tool (Crossbeam, Reveal and others) that shows only the overlap. Use the overlap to find (a) your prospects who are the partner's customers (ask for an introduction) and (b) shared customers (good targets for integration adoption and case studies). [practitioner]
- **Warm introductions beat cold outreach** in practitioner experience. Ask the partner's account manager for one introduction per real fit, not a list dump.

## Resellers, agencies and channel partners

- **The channel partner owns the relationship**, so you lose some customer contact and price control. Accept this only where the partner reaches buyers you can't reach at a sensible cost. [practitioner]
- **Enablement is the real cost.** Partners sell what is easy to sell. Give them a short pitch, demo account, pricing sheet, objection handling and a named contact. Expect months before a new partner produces a deal. [practitioner]
- **Avoid channel conflict** (your own sales team and a partner fighting for the same deal). Use deal registration: the first party to register a qualified opportunity is protected for a fixed period, for example 90 days. [practitioner]
- **Tiers** (e.g. registered, silver, gold) should reward results (sourced revenue, certified staff, customer satisfaction), not logo size.
- **Most partners produce nothing.** In practitioner experience a small share of partners produce most partner revenue. Recruit narrowly and drop inactive partners rather than counting sign-ups.

## Affiliate programs

**Commission structures** [practitioner]
- **Percentage of first sale** (common in e-commerce), **flat fee per sale or trial-to-paid** (common in SaaS), or **recurring share** of subscription revenue for a fixed period (e.g. 12 months) or for life.
- Set the ceiling from unit economics: maximum commission ≤ the CAC (customer acquisition cost) you can afford for that customer's gross margin and payback period. Run unit_economics with commission as CAC.
- Pay on **qualified** events: paid conversion after a refund window, not sign-ups or leads, unless you can check lead quality.
- **Cookie window** (how long after a click the affiliate gets credit) is commonly 30–90 days [rule-of-thumb]. Longer windows pay affiliates for sales that would have happened anyway.

**Attribution** [practitioner]
- Most networks use **last click**: the last affiliate link clicked gets all the credit. This rewards coupon and cashback sites that appear at checkout, after the buyer already decided.
- Decide rules for: coupon sites, brand-keyword bidding (affiliates buying ads on your brand name), and overlap with paid search. Many programs ban brand bidding in their terms.
- Test incrementality: pause a large affiliate or category (e.g. coupon sites) in a region or period and watch total sales, not affiliate-reported sales (see experimentation and metrics-and-measurement).

**Fraud** [research]
- **Cookie stuffing** sets an affiliate cookie without a real click, so the fraudster gets credit for sales they did not cause. A crawl study found over a third of affiliate publishers in the programs studied used cookie stuffing, though most realised conversions were credited to honest publishers (Snyder & Kanich 2016).
- A separate in-browser study with 70+ users found affiliate marketing dominated by a few affiliates and cookie-stuffing encounters rare (Chachra et al. 2015). Read together: fraud is common among small publishers but may be a small share of money. Monitor, don't panic.
- Other abuse: fake leads, self-referral, bot traffic, toolbar or extension hijacking of checkout, trademark bidding. Controls: manual approval of affiliates, refund-window holds, payout caps for new affiliates, checking conversion paths, and reviewing affiliates whose conversion rate is far above the median. [practitioner]

**Disclosure (US)**: the FTC Endorsement Guides (revised 2023) require affiliates to disclose payment "clearly and conspicuously"; FTC guidance says a label such as "paid link" next to the link can be enough. Put disclosure rules in your affiliate terms; you can be responsible for affiliates' claims. [first-party; not legal advice]

## The evidence on partner-sourced vs partner-influenced pipeline

- **Partner-sourced**: the partner created the opportunity (introduction, referral, registered deal). **Partner-influenced**: the partner helped a deal that already existed (shared customer, integration, advice).
- Crossbeam reports, across companies on its network, an average **11.7% lift in win rate** when partners are involved, rising from about **+9.4% (1–5 partners) to +37.1% (50+ partners)**. [vendor, Crossbeam, snippet-only] Other circulating figures ("53% more likely to close", "46% faster") were not traced to a method.
- Forrester's 2025 partner-ecosystem survey reported that 67% of B2B channel leaders plan for indirect (partner-transacted) revenue to grow more than 30% year on year. That is a plan, not a result. [vendor/analyst, snippet-only]
- **Why to discount these numbers**: partners join the deals that were already likely to close (big, well-qualified, existing technology fit). Win-rate gaps are correlations, not causal effects. "Influenced" definitions are loose; when several partners touch a deal, the same dollar can be counted many times.
- **What to do instead**: define sourced and influenced in your CRM before you start, count each deal once per definition, and compare win rate, cycle length and 12-month retention of partner deals against similar non-partner deals (same segment, size and quarter).

## What usually works by stage

- **Pre-product-market fit**: skip formal partner programs. One or two integrations that your first customers need, and warm introductions from founders' networks. Partners cannot sell a product you can't yet sell yourself. [practitioner]
- **Early traction (repeatable sales, small team)**: list on the one marketplace where your buyers live; one co-marketing partner per quarter; a simple affiliate or referral-fee program if you are self-serve; account mapping with 2–5 close partners.
- **Scaling**: a partner manager role, tiers, deal registration, partner portal, agency/implementation partners for complex products, resellers for regions or sectors you can't staff.
- **Mature**: co-selling with large platforms (cloud marketplaces, enterprise suites) and partner-attributed targets in the sales plan.
- See channel-strategy for how partnerships compete with other channels for focus.

## Common mistakes

- Signing many partners and enabling none.
- Announcing a partnership (press release, logo swap) and calling it a channel.
- Affiliate commissions above the CAC you can afford, or paid on sign-ups.
- Paying coupon and cashback sites last-click credit for buyers who were already at checkout.
- Counting partner-influenced revenue as if it were caused by partners.
- Building on one platform's marketplace without a plan for rule changes (platform-and-feature-risk).

## Sources

research/partners-referral-outbound.md §1 (Crossbeam; Forrester; Shopify developer terms; Snyder & Kanich 2016; Chachra et al. 2015; FTC Endorsement Guides 2023).
