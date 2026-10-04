---
title: Retention and expansion
summary: Keeping and growing customers across SaaS, subscriptions, repeat-purchase e-commerce and services; what the retention-profit research really says, diagnosing churn with cohorts and behaviour, onboarding and time-to-value, health scores, expansion and NRR drivers, win-back, loyalty programs (evidence is weak), customer marketing and advocacy, pricing levers (annual plans, downgrade, pause), and cancellation-flow law (FTC click-to-cancel status, California, EU, Germany, UK).
tags: retention, customer retention, churn, churn reduction, churn diagnosis, voluntary churn, involuntary churn, cohort, reason codes, onboarding, time to value, customer success, health score, expansion, upsell, cross-sell, net revenue retention, nrr, grr, win-back, reactivation, loyalty program, rewards program, customer marketing, advocacy, case studies, reviews, community, annual plan, downgrade, pause subscription, cancellation flow, save offer, click to cancel, negative option, ftc, automatic renewal law, dmcc, kündigungsbutton, reichheld
---

Use this playbook when growth is leaking out of the bottom of the funnel, or when existing customers could buy more. It extends, and does not repeat, these playbooks: **metrics-and-measurement** (GRR/NRR definitions, cohort maths, LTV), **self-serve-saas** (activation, dunning, PQLs), **email-and-lifecycle** (lifecycle programs, holdouts), **ecommerce-dtc** (cohort repeat rate, replenishment flows), **local-services** (rebooking, memberships), **consumer-apps** (paywalls, app win-back), **referral-programs** (NPS, referrals) and **pricing**.

**Churn** = customers (or revenue) you lose in a period. **Expansion** = extra revenue from existing customers (more seats, more usage, higher plan, extra products).

## Why retention compounds, and how far to trust the famous numbers

- **"5% more retention → 25–95% more profit."** Trace: Reichheld & Sasser (1990, HBR, "Zero Defections") reported that reducing the defection rate by 5% raised profits by 25–85% in the businesses they studied (for example 85% in one bank branch system, 50% in an insurance brokerage, 30% in an auto-service chain). The "25–95%" version is a later Bain restatement, widely spread by an HBR article (Gallo 2014). [practitioner: consulting case data, not a controlled or replicated study; snippet-only]
  - Use it as a reason to look, not as a forecast. The effect depends on margin, acquisition cost and how long customers already stay.
- **Better evidence on the direction:** Gupta, Lehmann & Stuart (2004, JMR) modelled customer value for public firms and found a 1% improvement in retention raised firm value by about 5%, versus about 1% for a 1% margin gain and about 0.1% for a 1% cut in acquisition cost. [research; snippet-only]
- **The caveat:** Reinartz & Kumar (2002, HBR, from multi-company customer data) found that loyal customers are not reliably cheaper to serve, less price-sensitive or better at referrals, and many long-term customers were barely profitable. [research; snippet-only] Retain *profitable* customers; do not buy retention at any price.
- "Acquiring a customer costs 5–25× more than keeping one" is repeated everywhere with no traceable study. [rule-of-thumb] Compute your own CAC vs cost-to-retain.

## Diagnose churn before treating it

- **Cohorts first.** Plot retention (logo and revenue) by start month, channel, plan and first product (method in metrics-and-measurement). Ask: is churn early (onboarding problem), at first renewal (value never proven), or steady late (competition, budget, product gaps)?
- **Voluntary vs involuntary.** Separate failed-payment churn (fix with dunning: see self-serve-saas) from decisions to leave. They need different owners.
- **Reason codes vs behaviour.** Cancellation-survey answers ("too expensive", "not using it") are a starting point, not the cause. "Too expensive" often means "not enough value for the price". Compare stated reasons with usage data in the 30–90 days before cancel, and run short exit interviews (see customer-research). [practitioner]
- **Contraction** (downgrades, fewer seats) is an early warning; track it separately from full churn.
- **Not all churn is bad.** Customers outside your ideal customer profile churn fast and cost support time. Sometimes the fix is acquisition targeting, not retention work. [practitioner]
- E-commerce and services have no "cancel" event: define a lapse window (for example, no order in 2× the normal repurchase interval) and treat it as churn.

## Onboarding and time-to-value

- **Time-to-value** = time from purchase or signup until the customer first gets the result they came for. Shorter is better; most early churn traces back here. [practitioner]
- Define the value moment from data (the activation method in self-serve-saas), then remove steps before it: templates, data import, done-for-you setup, a kickoff call for larger accounts.
- B2B: a written success plan (goals, owner, date for first result) agreed at kickoff; hand-off notes from sales so the customer does not repeat themselves. [practitioner]
- E-commerce: the post-purchase "how to use it" sequence and a well-timed second-purchase prompt; services: book the next visit before the customer leaves (see local-services).

## Customer success and health scores

- **Customer success (CS)** = a team or process that makes sure customers reach their goals, so they renew and grow. Pays off when ACV (annual contract value) can fund human time; below that, use in-product and email automation. [practitioner]
- **Health score** = a combined score per account, typically from usage depth and breadth, number of active users vs seats bought, support tickets, payment status, sponsor engagement and survey answers. [practitioner; vendor tools such as Gainsight popularised it]
  - Validate it: check that last year's scores actually predicted renewals and churn. Many scores are weighted by opinion and predict little. [practitioner]
  - Watch for champion loss: when your main contact leaves the customer company, risk rises. [practitioner]
- **Target by response, not by risk.** Ascarza (2018, JMR) showed that the customers most likely to churn are not always the ones a retention offer changes; target those whose behaviour the offer moves (measured by experiment). [research] Ascarza, Iyengar & Schleicher (2016, JMR) ran a field experiment where proactively recommending cheaper plans *raised* churn from 6% to 10%, because the contact reminded customers to review their spending. [research] Test outreach with a holdout (see email-and-lifecycle).

## Expansion and upsell

- **Seat growth**: make inviting teammates part of the core workflow; offer admin, permissions and single sign-on for larger teams.
- **Usage growth**: price on a value metric that grows with customer success (see pricing). Warn before limits and make upgrading self-serve.
- **Cross-sell timing**: offer a second product after the first has delivered value (after activation and a successful first period), not during onboarding. In e-commerce, cross-sell in post-purchase and replenishment emails. [practitioner]
- **Plan upgrades**: put the features larger customers need (security, reporting, support levels) in higher tiers; give CS or product-led sales a list of accounts hitting limits (see self-serve-saas, PQLs).
- **NRR drivers**: NRR = start revenue + expansion − contraction − churn, over start revenue (see metrics-and-measurement). It rises with (1) low gross churn, (2) a pricing unit that grows with use, (3) land in one team then spread, and (4) price increases on renewal. Report GRR beside NRR so expansion does not hide churn.
- Benchmarks: SaaS Capital reports a median NRR of about 102% (top quartile about 111%) for private SaaS with $25–50k ACV; Benchmarkit reports about 101% median for private B2B SaaS in 2025. [vendor; snippet-only] Lower-ACV and SMB businesses usually sit lower; benchmark by ACV.

## Win-back

- Kumar, Bhagwat & Zhang (2015, Journal of Marketing; press coverage indicates telecom data) found the strength of the first relationship predicts whether a lost customer accepts a win-back offer, and that the reason for leaving and the type of offer change both the return rate and the profitability of the "second lifetime". [research; snippet-only] Segment win-back by why and how customers left.
- Consumer subscription apps: annual subscribers who cancel rarely return (see consumer-apps). [vendor]
- Practice: win back at natural moments (new feature that fixes the stated reason, new season, contract renewal at a competitor); measure with a holdout. [practitioner]

## Loyalty programs: weak evidence for creating loyalty

- Sharp & Sharp (1997, International Journal of Research in Marketing) tested an Australian multi-brand program (Fly Buys) against the Dirichlet model (a statistical benchmark of normal repeat buying for a brand of a given size) and found little "excess loyalty"; buyers kept buying from a repertoire of brands. [research; snippet-only]
- Dowling & Uncles (1997, Sloan Management Review) reviewed the evidence and concluded most programs add cost without changing market structure; the ones that work raise the product's value and are fully costed. [research review; snippet-only]
- Use: programs can still help with data collection, retaining heavy buyers, or matching competitors. Model the cost (discounts, liability for unredeemed points, operations) and test against a control group, not "members spend more" (members were heavy buyers already).

## Customer marketing and advocacy

- **Customer marketing** = marketing aimed at existing customers: adoption campaigns, new-feature launches, events, and turning happy customers into public proof.
- Case studies: ask after a measured result, not at signup; segment by industry and use case so sales can match them (see b2b-saas-sales-led).
- Reviews: ask at a moment of success; never pay for or filter reviews (FTC fake-review rule, see local-services and pr-and-influencers).
- Communities and user groups support retention and peer learning; measure against similar non-members (selection bias, see self-serve-saas). Referral mechanics: see referral-programs.

## Pricing and packaging levers

- **Annual plans** lock in 12 months and remove 11 monthly decisions to leave; offer a discount (often ~15–20% [rule-of-thumb]) and check whether annual cohorts simply had more motivated buyers.
- **Downgrade path**: a cheaper plan keeps the customer and their data; a missing downgrade forces a full cancel. [practitioner]
- **Pause**: good for seasonal or life-event churn (gyms, meal kits, consumer subscriptions). Recurly reports a meaningful share of would-be cancellers choose pause when offered. [vendor; snippet-only] Set an automatic end date.
- **Price rises**: give notice, explain new value, and protect long-term or at-risk customers; watch churn by cohort after the change.

## Cancellation flows and the law (checked October 2026)

- **US federal**: the FTC's 2024 "click-to-cancel" Negative Option Rule was vacated (cancelled in full) by the Eighth Circuit on 8 July 2025, before it took effect, on procedural grounds. In February 2026 the FTC restored the rule's pre-2024 text, and on 13 March 2026 it published an Advance Notice of Proposed Rulemaking (comments closed 13 April 2026). No federal click-to-cancel rule is in force; ROSCA (the Restore Online Shoppers' Confidence Act) and FTC enforcement still apply. [first-party; verified-search: ftc.gov, federalregister.gov, uscourts.gov, 2026-10-04]
- **California** (AB 2863, from 1 July 2025): online sign-ups must be cancellable online; a save offer may be shown only with a prominent "click to cancel" button next to it; annual reminders; consent records kept. [law-firm summaries]
- **EU**: from 19 June 2026, Directive 2023/2673 requires an online "withdrawal function" (labelled "withdraw from contract here" or similar) for the 14-day withdrawal right. [verified-search: eur-lex.europa.eu, 2026-10-04] A separate EU-wide rule on cancelling subscriptions, auto-renewal and free-trial conversion is planned for the Digital Fairness Act; the Commission's proposal is scheduled for the fourth quarter of 2026, so it is not law yet. [verified-search: europarl.europa.eu, ec.europa.eu, 2026-10-04] **Germany** has required a "Verträge hier kündigen" cancellation button for online consumer subscriptions since 1 July 2022 (§312k BGB). [law-firm summaries]
- **UK**: the DMCC Act 2024 subscription regime (clear pre-contract information, renewal reminders, cooling-off at renewal, easy exit) is set to start in January 2027, brought forward from spring 2027 by a Prime Minister's announcement in August 2026; secondary legislation was still pending. [verified-search: gov.uk, 2026-10-04]
- **Design rule**: one-step-visible cancel, at most one save offer shown next to a clear "cancel" option, a one-question reason survey, and an immediate confirmation. This meets most regimes and gives you clean reason data. Not legal advice; check with counsel per market.

## What usually works by stage

- **Early (first ~100 customers)**: founders talk to every churned customer; fix onboarding; turn on dunning; simple cohort chart monthly.
- **Growing**: reason codes plus usage data; downgrade and pause options; annual plans; lifecycle emails with holdouts; first case studies.
- **Scaling**: CS team by ACV tier, a validated health score, expansion plays via product-led sales, NRR and GRR by cohort and segment, customer marketing function, compliant cancellation flow in every market.
- **Mature**: uplift-targeted retention offers (experiment-based), price-increase management, multi-product cross-sell, community and advocacy programs.

## Common mistakes

- Quoting "5% retention = 25–95% profit" as a forecast for your business.
- Treating survey reasons as the true cause of churn; ignoring involuntary churn.
- Sending save offers to everyone at high risk without testing whether contact itself raises churn.
- Reporting NRR without GRR, letting expansion from a few accounts hide wide churn.
- Launching a points program because competitors have one, without costing it or measuring against a control.
- Hiding the cancel button: it now breaks the law in several markets and inflates chargebacks and complaints.
- Health scores weighted by opinion and never checked against actual renewals.

## Sources

research/retention-and-expansion.md (Reichheld & Sasser 1990; Gallo 2014; Gupta, Lehmann & Stuart 2004; Reinartz & Kumar 2002; Ascarza 2018; Ascarza, Iyengar & Schleicher 2016; Kumar, Bhagwat & Zhang 2015; Sharp & Sharp 1997; Dowling & Uncles 1997; SaaS Capital and Benchmarkit NRR; Recurly pause; FTC ANPRM 2026 and Eighth Circuit 2025; California AB 2863; Directive 2023/2673; §312k BGB; UK DMCC announcement). Most items were read from search snippets; methods were not reviewed.
