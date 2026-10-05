---
title: Two-sided marketplaces
summary: Playbook for marketplaces that match buyers and sellers; the cold-start (chicken-and-egg) problem, Gurley's 10 factors, which side to build first, narrow launch markets, liquidity metrics, take rates, leakage, trust and reviews, SEO on supply pages, multi-homing, growth loops and what works by stage.
tags: marketplace, two-sided marketplace, platform, cold start, chicken and egg, atomic network, supply, demand, liquidity, match rate, search to fill, time to match, take rate, rake, commission, gmv, disintermediation, leakage, trust and safety, reviews, ratings, programmatic seo, multi-homing, growth loops, gurley
---

A **two-sided marketplace** matches two groups: supply (sellers, hosts, freelancers, drivers) and demand (buyers, guests, clients). Each side only joins if the other side is already there. This is the **cold-start** or **chicken-and-egg problem**. Defensibility from network effects, and why it is often weaker than it looks, is covered in competitive-analysis; this playbook is about building and growing one.

## Is this a good marketplace at all?

_In short:_ Check the idea against Gurley's ten factors: is it much better than today, are the sellers fragmented, is buying frequent, does money flow through you. Rare purchases with scattered payments and concentrated suppliers usually fail.

Use Bill Gurley's 10 factors from "All Markets Are Not Created Equal" (2012) as a checklist [practitioner]:
1. **New experience vs status quo**: is it much better than today's way of buying?
2. **Economic advantage vs status quo**: do both sides save or earn money?
3. **Technology adds value**: search, matching, pricing, payments, trust tools.
4. **High fragmentation**: many small buyers and sellers. If a few large suppliers dominate, they don't need you.
5. **Friction of supplier sign-up**: low friction helps you get supply; Gurley notes supply aggregation is usually easier than demand.
6. **Size of the market opportunity.**
7. **Expand the market**: does it create transactions that didn't happen before (Airbnb turned spare rooms into supply)?
8. **Frequency**: frequent purchases build habit and word of mouth; rare purchases (weddings, house moves) make every buyer expensive to acquire.
9. **Payment flow**: if money passes through you, you can charge a commission and add protections.
10. **Network effects**: more participants make it better for everyone, but the strength varies.

Low frequency + no payment flow + concentrated supply is the classic failing combination [practitioner].

## Solve the cold start: start small

_In short:_ Beat the chicken-and-egg problem by building one small network that works alone, such as one city or category, then copying it. Do things that don't scale, like listing sellers by hand.

- **Atomic network** (Andrew Chen, *The Cold Start Problem*): the smallest group of buyers and sellers that is useful on its own and keeps working without you pushing it, such as one city, one campus, one category [practitioner]. Build one, then copy it to the next.
- **Constrain geography or category** until liquidity (see below) is good. "Home services in one city" or "vintage watches only" beats "everything everywhere" with empty shelves.
- Find the **tipping point** in your data. Airbnb reported a step-change in bookings growth once a city had about 300 listings (with about 100 having reviews), when guests could find something that fit their dates and taste [practitioner, single company, Jonathan Golden / Chen].
- Do things that don't scale: list supply by hand, call sellers, match the first transactions manually, act as the supplier yourself (e.g. buy and resell stock) to prove demand.
- **Single-player mode**: give one side a tool that is useful even without the other side (booking software for salons, inventory tools for sellers) and add the marketplace later [practitioner].

## Which side first? Usually supply

_In short:_ Usually start with supply, since there is nothing to buy without it. Check monthly which side is short, and spend only on that side.

- Every marketplace starts **supply-constrained**: you need something to sell. In Lenny Rachitsky's interviews with early operators, about 14 of 17 marketplaces focused on supply first; most of the biggest stayed supply-constrained; a few (Rover, TaskRabbit) became demand-constrained because supply got easy, accessible income [practitioner, small sample of successes].
- Early supply levers: direct outreach and sales, importing existing listings (with permission), partnerships with associations, paying or guaranteeing early supply income [practitioner].
- Early demand levers: word of mouth was the top early demand driver in the same interviews; also SEO, communities where buyers already meet, and paid search on high-intent terms [practitioner].
- Re-check which side is the constraint **every month** per market: are buyers leaving without finding something (supply short) or are sellers leaving without orders (demand short)?
- Rule: spend on the constrained side only. Buying demand when supply can't serve it burns money and reputation.

## Liquidity metrics

_In short:_ Liquidity (how often a request actually gets matched) is the key measure. Track it per city and category, never only globally, along with time to match, repeat rate and how concentrated sales are.

**Liquidity** = the probability that a listing sells or a request is filled within a reasonable time. Matching supply with demand is the job, so measure the **match rate** [practitioner, a16z "13 Metrics for Marketplace Companies", 2020].

Before you have data, estimate it: liquidity_math takes new listings per day and the share of listings a typical request matches, and returns the chance a request is matched within a window and the listings per day needed for a target chance. Use it to set go/stop thresholds.

Track by market (city × category), never only globally:
- **Search-to-fill** (or search-to-book): share of searches or requests that end in a transaction.
- **Time to match**: time from request to accepted match (rides: minutes; services: hours; B2B: days).
- **Listing utilisation / sell-through**: share of listings or providers with at least one transaction in the period.
- **Fill rate** for requests (share of posted jobs that get a qualified offer).
- **Repeat rate on both sides** by cohort, and **concentration**: how much GMV (gross merchandise value, total transaction value) comes from your top 10% of suppliers or buyers. High concentration means a few departures can break a market.
- **Power-user curve**: histogram of how many days per week or month users act; a curve shifting right over time shows growing habit [practitioner, a16z].

## Take rate (your commission)

_In short:_ Take rate (your commission as a share of total sales value) varies hugely by category, and too high a rate is dangerous. A modest rate on high volume lasts longer.

**Take rate** = marketplace revenue ÷ GMV.
- Ranges are very wide by category: examples in Gurley's "A Rake Too Far" (2013) span roughly 2% (OpenTable) to 70% (Shutterstock), Gurley's own estimates [practitioner, read in full]. A single "benchmark" take rate is misleading; it depends on how much value you add (payments, insurance, demand, fulfilment) and how easily the two sides can go elsewhere.
- Gurley's warning: "High rakes are a form of friction" and pricing too high is "the most dangerous strategy" for a platform; a modest rake on high volume lasts longer [practitioner].
- Ways to earn beyond commission: seller subscriptions, promoted listings (ads), payment and financing fees, insurance, logistics. Each adds revenue but can reduce trust if buyers feel results are paid placements.
- Who pays: charge the side that gets more value or has fewer alternatives; split fees between both sides to keep each visible fee small [practitioner].
- Pricing changes and testing: see pricing.

## Leakage (disintermediation)

_In short:_ Leakage is buyers and sellers meeting on your platform and then dealing off it to skip your fee. Make on-platform deals clearly better, or charge for the introduction if that is where your value lies.

**Leakage** or **disintermediation** = the two sides meet on your platform, then transact off it to avoid your fee.
- It is worst for high-value, repeat relationships between the same pair (cleaners, tutors, freelancers, B2B suppliers).
- Trust tools can increase it: a randomized trial on a freelance marketplace found that more trust helped good freelancers get hired but also raised the risk of later deals moving off-platform [research, Gu & Zhu 2021].
- Counter-measures studied in theory: make on-platform transactions clearly better (payment protection, insurance, dispute handling, scheduling, invoicing, tax documents), limit contact details before booking, charge a lead or referral fee instead of a transaction fee, add seller competition on the platform, and hide sellers who push leakage [research (theory), Hagiu & Wright 2024].
- Practical rule: if the main value is the **first introduction**, charge for the introduction (lead fee or subscription). If the value is in **every transaction**, charge per transaction and keep adding transaction-level value.

## Trust and safety

_In short:_ Reputation systems make strangers trust each other, but star ratings inflate. Curate early supply by hand, use double-blind reviews, watch other signals, and budget for guarantees.

- Buyers and sellers are strangers; reputation systems are what make them trust each other [research, Tadelis 2016].
- Ratings inflate: most feedback is positive and unhappy users often stay silent, so a 4.8 average may hide real problems [research; not re-verified]. Use additional signals: repeat booking rate, cancellations, response time, dispute rate, verified identity.
- Use **double-blind reviews** (both sides submit before either sees the other) to reduce retaliation [practitioner].
- Early on, **curate supply** by hand (vetting, interviews, test orders). One bad early experience spreads faster than ten good ones.
- Guarantees (refunds, damage protection) cost money but turn first-time buyers into repeat buyers; budget for them as part of take rate.
- US review law (fake reviews, review suppression) applies to marketplaces too: see ecommerce-dtc.

## SEO on supply pages

_In short:_ Pages for each listing or category-plus-location can bring search traffic, but only with real, unique supply behind them. Keep thin pages out of search until the market has enough.

- Each listing, provider or category-plus-location page ("plumbers in Lyon", "used Canon R6") can rank for long-tail searches. This is **programmatic SEO**: many pages built from a template and your data [practitioner].
- It only works if pages have **real, unique supply** (actual listings, prices, reviews, availability). Thin or empty pages can count as scaled low-value content under Google's spam policies (see seo-and-ai-search).
- Show a page only when the market has enough supply; otherwise keep it out of the index (noindex) until it does.
- Supply-side SEO doubles as a growth loop: new supply → new pages → new buyers → more supply.

## Multi-homing

_In short:_ Multi-homing means users are active on several competing platforms at once, which weakens network effects. Find which side does it, and compete hardest for the side that uses only one.

**Multi-homing** = users being active on several competing platforms at once (drivers on Uber and Lyft; sellers on Etsy and Amazon). When it is easy, network effects protect less (see competitive-analysis).
- Find out which side multi-homes. Compete hardest for the side that uses only one platform.
- Reduce multi-homing by being better, not by trapping: tools sellers depend on (calendars, inventory, payouts), reputation that matters on your platform, loyalty programs for buyers. Exclusivity contracts can create legal risk in some markets [not re-verified].

## Growth loops

_In short:_ A growth loop is a cycle where each step feeds the next, such as supply creating pages that bring buyers who attract more supply. Paid acquisition should top up a loop, not replace it.

A **growth loop** is a cycle where the output of one step becomes the input of the next, so growth feeds itself [practitioner]. Common marketplace loops:
- **Supply SEO loop**: supply creates pages → search brings buyers → sales attract more supply.
- **Supply-brings-demand loop**: sellers share their listing or booking link with their own customers (common in services and creator marketplaces).
- **Demand-brings-supply loop**: buyers become sellers (resale, peer-to-peer).
- **Referral loop** with two-sided rewards.
Map which loop your growth comes from per market; paid acquisition should top up a loop, not replace it (see channel-strategy, paid-acquisition).

## What usually works by stage

_In short:_ Before the market works, hand-build supply in one place. Once it works, measure liquidity weekly and add trust features. Expand to new cities only with tipping-point targets for each.

| Stage | Focus | Usually works | Usually fails |
|---|---|---|---|
| Pre-liquidity (one market) | Get the first atomic network to work | Hand-built supply, manual matching, one city or category, founder sales, single-player tools | Paid demand before supply exists; launching many cities at once |
| Liquid in one market | Reach repeat use and reliable matches | Measure liquidity weekly, trust features, reviews, supply SEO, referral loops, careful take-rate setting | Raising take rate early; ignoring leakage |
| Expanding | Copy the playbook to adjacent markets | Launch playbook with tipping-point targets per market, local supply teams, paid search on high-intent terms, adjacent categories | Assuming a new city works like the first; global averages hiding dead markets |

## Common mistakes

_In short:_ Don't start too broad, report only global numbers, buy demand where supply is short, set a high take rate too early, trust average star ratings, or build pages with no real supply.

- Starting too broad: thin supply everywhere, liquidity nowhere.
- Reporting global metrics; markets die one at a time.
- Buying demand for a supply-constrained market.
- High take rate before you add enough value to justify it, which pushes users to transact off-platform.
- Trusting average star ratings as a quality measure.
- Programmatic pages with no real supply behind them.

## Sources

research/ecommerce-and-marketplaces.md (Gurley 2012, 2013; Chen 2021; Golden / Airbnb; Jordan, Jin, Coolican & Chen 2020; Rachitsky 2019; Gu & Zhu 2021; Hagiu & Wright 2024; Tadelis 2016); research/competition-and-defensibility.md (Zhu & Iansiti 2019, multi-homing).
