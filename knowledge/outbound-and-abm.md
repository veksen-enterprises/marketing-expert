---
title: Outbound prospecting and account-based marketing
summary: Cold email and outbound in practice: deliverability limits, legal rules (CAN-SPAM, GDPR/PECR, CASL, Germany), list building, message structure, sequences, reply-rate benchmarks and their denominators, AI mass outreach, account-based marketing tiers (1:1, 1:few, 1:many), and sales–marketing alignment.
tags: outbound, cold email, cold outreach, prospecting, sdr, bdr, sequence, cadence, reply rate, response rate, list building, icp, can-spam, gdpr, pecr, casl, b2b email law, ai sdr, ai outreach, abm, account-based marketing, one-to-one, one-to-few, one-to-many, itsma, target accounts, intent data, sales marketing alignment, sla
---

## When outbound makes sense

Outbound means you contact people who have not asked to hear from you: cold email, cold calls, LinkedIn messages. It works when [practitioner]:
- The deal is big enough to pay for human time per account (see channel-strategy on channel-model fit and run unit_economics with sales cost as CAC).
- You can name the companies and roles that buy (a clear ICP, ideal customer profile).
- The buyer has a problem you can state in one sentence that they will recognise.
It works badly for low-price self-serve products and for problems buyers don't yet know they have.

## Deliverability limits

The Gmail, Yahoo and Microsoft sender rules in email-and-lifecycle apply to cold email too: SPF, DKIM, DMARC, one-click unsubscribe for marketing mail, and spam complaints below 0.1% (Gmail stops mitigation above 0.3%). Cold email gets more complaints than opted-in mail, so it hits these limits first. [first-party]
- **Never send cold email from your main company domain.** Use a separate, similar domain so a reputation problem does not block invoices, password resets and customer mail. [practitioner]
- **Low volume per mailbox**: practitioners commonly cap at a few dozen cold emails per mailbox per day after a warm-up period [rule-of-thumb]. Many small mailboxes at low volume is the usual pattern, but it does not excuse bad targeting: complaints still count per domain.
- **Verify addresses** before sending; bounce rates above a few percent damage reputation. [practitioner]
- **Plain text, few links, no images, no tracking pixels** tend to land better; open tracking is unreliable anyway after Apple Mail Privacy Protection (email-and-lifecycle). Measure replies and meetings. [practitioner]

## Legal rules (summary, not legal advice)

**United States: CAN-SPAM** [first-party, FTC]
- No consent needed before the first commercial email, but: honest "From" and subject line, identify the message as an ad, a valid physical postal address, a clear way to opt out, and honour opt-outs within 10 business days. Penalties up to $53,088 per violating email (FTC figure, adjusted for inflation).

**United Kingdom: PECR + UK GDPR** [first-party, ICO]
- Emails to **corporate subscribers** (companies, LLPs, some government bodies) do not need prior consent under PECR. You must identify yourself and give a valid opt-out address.
- **Sole traders and some partnerships count as individuals**: you need consent or the "soft opt-in" (existing customer, similar products, opt-out offered at collection and in every message).
- If unsure whether an address belongs to an individual or a company, the ICO says treat it as an individual.
- UK GDPR still applies to the personal data (name, work email): you need a lawful basis, usually legitimate interests with a documented balancing test, a privacy notice, and you must honour objections.

**European Union: GDPR + national ePrivacy laws** [secondary sources; not re-verified on regulators' sites]
- GDPR allows direct marketing on the basis of legitimate interests (Recital 47), but email rules come from each country's ePrivacy law, and they differ.
- **France (CNIL)**: B2B email to professional addresses about topics relevant to the recipient's job is allowed without prior consent, with an opt-out.
- **Germany (UWG §7)**: advertising email generally needs prior express consent, **including B2B**. Treat Germany as opt-in only.
- Check each target country before sending; a country-by-country table from a lawyer is worth the cost.

**Canada: CASL** [first-party, CRTC]
- Commercial electronic messages need express or implied consent, sender identification and an unsubscribe mechanism.
- One form of implied consent: the person **conspicuously published** their address (e.g. on a company website) without a "no unsolicited messages" statement, **and** your message is relevant to their business role. The sender must prove consent.
- Maximum penalty per violation: C$1M for individuals, C$10M for businesses.

## List building and targeting

- **Start from accounts, then people.** Define the ICP with firmographics (industry, size, region, technology used) and, better, with the traits of your best customers (positioning and customer-research). [practitioner]
- **Use triggers** (signals that a company may need you now): hiring for a related role, new funding, a new leader in the buying role, a technology change, an expansion. Trigger-based lists are smaller and convert better in practitioner experience.
- **Intent data** (third-party signals that a company is researching a topic) is noisy; treat it as one input to prioritise, not proof of interest. [practitioner; vendor claims vary]
- **Contact data decays** as people change jobs. Re-verify before every campaign.
- Small, tight lists beat large blasts in practitioner experience; figures comparing small and large sends circulate without a traceable source.

## Message structure

A first cold email that tends to work is short (under about 100 words), about the recipient, and asks for something small. [practitioner]
1. **Why them, why now**: one line showing you know something specific (a trigger, their role's problem). Not flattery.
2. **The problem** in their words (see messaging-and-copy and customer-research).
3. **Proof**: one concrete result for a similar company, with numbers you can back up.
4. **Low-friction ask**: an interest question ("Worth a look?") usually beats asking for 30 minutes on the first touch.
- Subject lines: short, plain, look like an internal email. No fake "Re:" or "Fwd:" (deceptive under CAN-SPAM).
- One idea per email. No attachments.

## Sequences

A **sequence** (or cadence) is the planned series of touches to one person.
- Instantly's 2026 benchmark report (its own users' data) says the first email gets **58% of replies** and follow-ups the other 42%, and recommends 4–7 touches. [vendor, Instantly, 2026]
- Belkins (2025 data, its agency clients) reports the first follow-up has the highest reply rate and reply rates fall by the fifth follow-up. [vendor, Belkins, 2026 study]
- Practical: 3–5 emails over 2–3 weeks, each adding something new (a different angle, a short case, a useful resource), mixed with LinkedIn and phone for higher-value accounts. Stop at the first reply of any kind, including "not interested". [practitioner]

## Reply-rate benchmarks: check the denominator

- **Instantly 2026**: average reply rate **3.43%**, top quartile 5.5%, best campaigns above 10% (Instantly platform data). [vendor, Instantly, 2026]
- **Belkins 2026 study** (7.5M emails from its client campaigns in 2025): average **0.45%** replies per email sent, falling from 0.50% in the first half of 2025 to 0.40% in the second half. Belkins notes earlier studies divided by **opened** emails; this one divides by **emails sent**. [vendor, Belkins, 2026]
- The difference between 3.43% and 0.45% is mostly definition (per recipient vs per email, which replies count, which senders are included), not performance. Ask for the denominator before comparing yourself to any benchmark.
- Track your own: positive reply rate (replies showing interest), meetings booked per 100 contacts, and pipeline per 1,000 emails. Compare across your own campaigns over time.

## AI-generated mass outreach

- Cheap AI writing tools let senders send far more "personalised-looking" emails. Vendors and practitioners widely report falling reply rates as volume rose (e.g. Belkins' 2025 decline above). No controlled study isolating the cause was found; blame is plausible, not proven. [vendor/practitioner]
- Lab research on AI-written messages: when people believed profile text was AI-written among a mix of AI and human texts, they trusted it less (Jakesch et al., CHI 2019); trust in email writers dropped when AI help was disclosed (Liu et al., CHI 2022). These are lab studies, not sales data. [research]
- Implications [practitioner]: use AI to research accounts and draft, but have a person check facts and the reason for contact. Fake personal details ("loved your recent post") that are wrong cost more than no personalisation. Lower volume and better targeting protect your domain too.

## Account-based marketing (ABM)

**ABM** treats a chosen set of companies as "markets of one": marketing and sales agree a target account list and coordinate everything (ads, content, events, outreach) on those accounts.

**Tiers (ITSMA terms)** [vendor/analyst]
| Tier | Accounts | What it looks like |
|---|---|---|
| Strategic ABM (1:1) | A handful to a few dozen | A marketer works with the account team on custom research, content and events per account |
| ABM Lite (1:few) | Small clusters of accounts with shared needs (tens of accounts in total) | Content and plays per cluster (industry, use case) |
| Programmatic ABM (1:many) | Hundreds to thousands | Targeted ads, personalised pages and sequences by segment, using tools |
- ITSMA research (via secondary relay) put the median Strategic ABM program at 13 accounts and about US$59,000 spend per account per year, and ABM Lite at about 50 accounts and US$4,000 per account. [vendor, secondary, not re-verified]

**Evidence on results**
- Momentum ITSMA and the ABM Leadership Alliance (2022) reported 72% of marketers say ABM delivers higher ROI than other marketing; an older, widely quoted ITSMA figure is 87%. [vendor, self-reported survey]
- These are opinions of people running ABM programs, with no control group. Selection is strong: ABM is aimed at accounts that were already the most likely and largest buyers. Measure ABM with matched control accounts (similar accounts not in the program) and compare pipeline, win rate and deal size (metrics-and-measurement).

**Practice** [practitioner]
- Build the list together with sales; a list marketing chose alone gets ignored.
- Map the buying group (the several people who approve a B2B purchase) per account, not one contact.
- Measure account-level outcomes (engaged accounts, opportunities, pipeline, win rate), not leads.
- Use LinkedIn and other account-targeted ads for 1:many (see paid-acquisition), and keep brand-building for the wider market (brand-and-demand): most accounts are not buying right now.

## Sales–marketing alignment

- **One shared definition** of a qualified lead and of a qualified account, written down. [practitioner]
- **A service-level agreement (SLA)**: marketing commits to a number of qualified leads or engaged accounts; sales commits to follow up within a set time (e.g. same business day) and to record outcomes.
- **Shared targets**: pipeline and revenue, not marketing-qualified leads alone.
- **Closed-loop feedback**: a weekly or monthly review of which sources and messages produced won deals; feed win/loss interviews (competitive-analysis) into messaging.

## What usually works by stage

- **Founder-led (pre-PMF)**: founders send small batches of manual, researched emails; the goal is learning conversations, not pipeline (customer-research).
- **Early traction**: one SDR (sales development representative) or founder plus tools; one ICP, triggers, a 3–5 step sequence; separate sending domains.
- **Scaling**: SDR team, SLA with marketing, programmatic ABM on a defined account list, Strategic ABM only for the largest accounts.
- **Enterprise**: 1:1 ABM for the top accounts, combined with partner introductions (partnerships-and-affiliates).

## Common mistakes

- Sending cold email from the main company domain.
- Buying large lists and blasting them; it fails on complaints and on law (Germany, sole traders in the UK, CASL).
- Comparing your reply rate to a benchmark with a different denominator.
- Long first emails about your company.
- Running ABM as an ad campaign without sales agreement on the account list.
- Reporting ABM success from survey ROI claims instead of matched control accounts.

## Sources

research/partners-referral-outbound.md §3 and §4 (FTC CAN-SPAM guide; ICO B2B marketing; CRTC CASL guidance; CNIL/UWG via secondary; Instantly 2026; Belkins 2026; Jakesch et al. 2019; Liu et al. 2022; ITSMA; Momentum ITSMA 2022); research/landscape-2026.md §2 (sender rules).
