---
title: Privacy and marketing law guardrails
summary: Practical legal guardrails for marketers - cookie consent (GDPR, ePrivacy, reject-as-easy-as-accept), US state privacy laws and Global Privacy Control, pixels and health data (FTC GoodRx, BetterHelp), claim substantiation, comparative advertising, Made in USA, fake discounts and the EU 30-day prior-price rule, auto-renewal, accessibility (EAA, ADA, WCAG 2.2), AI disclosure (EU AI Act Art. 50) and COPPA. Not legal advice.
tags: privacy, gdpr, eprivacy, cookies, cookie banner, consent, ccpa, cpra, global privacy control, gpc, opt-out, pixel, health data, health breach notification rule, goodrx, betterhelp, ftc, advertising claims, substantiation, asa, cap code, comparative advertising, lanham act, made in usa, deceptive pricing, fake discount, reference price, omnibus directive, auto-renewal, click to cancel, dark patterns, accessibility, european accessibility act, ada, wcag, ai act, ai disclosure, coppa, children, compliance, legal
---

> **Not legal advice.** This is a checklist of common risks for marketers, written from regulators' public documents and summaries. Laws change and depend on the facts. Before launch in a new country, a regulated sector (health, finance, children) or with a large budget, ask a qualified lawyer.

Related playbooks (not repeated here): email consent, CAN-SPAM, PECR, CASL and B2B cold email law are in **outbound-and-abm** and **email-and-lifecycle**; influencer disclosure, the FTC Endorsement Guides and the fake-reviews rule are in **pr-and-influencers**; Google Consent Mode v2 is in **paid-acquisition**; cancellation flows are in **retention-and-expansion**; persuasion ethics is in **behavioral-science**.

## Cookies and tracking consent (EU, UK)

_In short:_ In the EU and UK, non-essential trackers need consent before they fire, and refusing must be as easy as accepting. Put Accept all and Reject all on the first layer, and audit every script.

- **Rule** [first-party]: the ePrivacy rules require consent before storing or reading non-essential cookies or similar trackers (analytics, ad pixels, session replay) on a device. GDPR sets what valid consent means: freely given, specific, informed, unambiguous, and as easy to withdraw as to give.
- **Refusing must be as easy as accepting** [first-party]:
  - The EDPB Cookie Banner Taskforce report (January 2023): a vast majority of EU authorities said that a banner with an "accept" button but no "reject" option on the same layer is an infringement.
  - The French CNIL fined Google €150M and Facebook €60M (announced January 2022) because accepting took one click but refusing took several.
- **UK change** [first-party]: the Data (Use and Access) Act 2025 lets UK sites set some low-risk cookies without consent, including analytics cookies used only to collect statistics to improve the service. Its data protection provisions were all in force by 19 June 2026. Read the ICO's list of exceptions and their conditions before dropping consent for analytics; ad and tracking pixels still need consent. [verified-search: ico.org.uk, gov.uk, 2026-10-04]
- **Practical design**: "Accept all" and "Reject all" on the first layer, same size and weight; no tracker fires before a choice; a link to change the choice on every page; re-test after tag changes.
- **Measurement effect**: refusals remove data. Use Google Consent Mode v2 (required for EEA ads measurement and remarketing since March 2024; see paid-acquisition) and server-side tagging only within consent.
- **Tag audit**: list every script, its owner, and what data goes to which vendor.

## US state privacy laws and opt-out signals

_In short:_ About 20 US states have privacy laws in force. In California you must let people opt out of sale or sharing of data, and honour browser opt-out signals like Global Privacy Control, with symmetrical choices.

- **Number of states** [secondary; Oklahoma date verified-search: okhouse.gov, 2026-10-04]: 24 states have enacted comprehensive privacy laws. About 20 are in force (trackers say 19 or 20, depending on whether Florida's narrower law counts), including Indiana, Kentucky and Rhode Island from 1 January 2026. Four were signed in 2026 and are not yet in force: Oklahoma and Louisiana (1 January 2027), Alabama (1 May 2027) and Vermont (1 January 2028).
- **California (CCPA as amended by CPRA)** [first-party]:
  - Consumers can opt out of the "sale" or "sharing" of personal information. "Sharing" covers cross-context behavioural advertising, so normal ad pixels and retargeting audiences are usually in scope.
  - You need a "Do Not Sell or Share My Personal Information" link (or alternative) and must honour browser opt-out signals such as **Global Privacy Control (GPC)**.
- **Sephora (California AG, August 2022)** [first-party]: $1.2M settlement. Alleged failures: not disclosing that it sold data (via ad and analytics trackers), not processing GPC opt-outs, and not curing within 30 days.
- **Symmetry and dark patterns** [first-party]:
  - The California Privacy Protection Agency fined American Honda $632,500 (March 2025). The issues: asking for too much information to opt out, an opt-out tool without symmetrical choices, and barriers for authorised agents. In May 2025 it fined retailer Todd Snyder $345,178, partly for making people verify their identity before they could opt out of sale or sharing. [verified-search: cppa.ca.gov, 2026-10-04]
  - CPPA guidance: an opt-out that needs more steps than opting in is not symmetrical; "Accept all" vs "Decline all" is.
- California, Colorado and Connecticut ran a joint 2025 sweep on businesses that ignore opt-outs [first-party].
- **Practical**: treat GPC as an opt-out of sale/share for that browser (and known user); suppress ad pixels and audiences for them.

## Pixels and health or other sensitive data

_In short:_ Do not fire ad pixels or conversion events on pages revealing health or other sensitive details, or put them in URLs or event names. US regulators have fined firms for this.

- **GoodRx (FTC, February 2023)** [first-party]: $1.5M civil penalty, the FTC's first action under the **Health Breach Notification Rule** (HBNR). GoodRx shared health information with Facebook, Google, Criteo and others despite privacy promises. It is now banned from sharing health data for advertising.
- **BetterHelp (FTC, final order July 2023)** [first-party]: $7.8M for consumer refunds. Email addresses, IP addresses and health questionnaire answers went to Facebook, Snapchat, Criteo and Pinterest for advertising.
- **HBNR amendments (in force 29 July 2024)** [first-party]:
  - The rule covers most health apps not covered by HIPAA.
  - A "breach" includes an **unauthorised disclosure** by the company itself (for example via a pixel), not only hacking.
  - Notices must name the third parties that received the data.
- **Practical**:
  - Do not fire ad pixels or Conversions API events on pages or events that reveal a health condition, a prescription, or answers to an intake survey.
  - Do not use page URLs or event names that contain such data.
  - Apply the same care to finance, sexuality, religion, precise location and children's data. Several US states and GDPR (Art. 9) give these extra protection [not re-verified per state].

## Advertising claims and substantiation

_In short:_ Hold evidence before publishing any claim that consumers will read as factual, such as best, number one or clinically proven. Regulators judge how people read the claim, not your intent.

- **US (FTC)** [first-party; not re-verified this session]: claims must be truthful and not misleading. You must hold a "reasonable basis" before making an objective claim. Health claims usually need competent and reliable scientific evidence.
- **UK (ASA, CAP Code rule 3.7)** [first-party]: hold documentary evidence **before** publishing claims that consumers are likely to see as objective. The ASA judges the likely consumer reading, not your intent; calling a claim "puffery" does not save it if people read it as factual.
- High-risk words: "No. 1", "best", "fastest", "cheapest", "clinically proven", "carbon neutral", "free", "unlimited". Keep the evidence file next to the creative.

## Comparative advertising

_In short:_ In the EU, you may name a competitor only if the comparison is not misleading, covers like-for-like needs, compares verifiable features and does not discredit them. Compare like with like, date it and keep screenshots.

- **EU (Directive 2006/114/EC, Art. 4)** [first-party]: comparison with a named competitor is allowed only if **all** conditions are met:
  - not misleading;
  - the products meet the same needs or purpose;
  - it objectively compares material, relevant, verifiable and representative features (price may be one);
  - it does not discredit or denigrate the competitor or its marks;
  - it takes no unfair advantage of the competitor's trade mark;
  - it does not present goods as imitations or replicas of trade-marked goods.
- **US (Lanham Act §43(a))** [not re-verified]: competitors, not only regulators, can sue over false or misleading statements about your or their products. Comparative ads are lawful if truthful and substantiated.
- **Practical**: compare like with like, date it, keep screenshots.

## "Made in USA"

_In short:_ An unqualified Made in USA claim requires all or virtually all of the product to be made in the US. Otherwise use a qualified claim such as assembled in USA from imported parts.

- **Made in USA Labeling Rule (2021)** [first-party]: an unqualified "Made in USA" claim on a label, or as a seal, mark, tag or stamp in a print or online mail-order catalogue, requires that **all or virtually all** of the product is made in the US. That means final assembly, all significant processing, and nearly all components are US-made.
- Williams-Sonoma paid a record $3.17M civil penalty (April 2024) for breaking an earlier FTC Made in USA order [first-party].
- Origin claims in other ads fall outside the rule but are still judged under the FTC Act, so hold them to the same standard.
- Use qualified claims ("Assembled in USA from imported parts") when not all or virtually all is US-made.

## Price claims and fake discounts

_In short:_ A was price must be a real price actually offered for a reasonable period. In the EU, a reduction must show the lowest price of the previous 30 days. Generate was prices from price history.

- **US (FTC Guides Against Deceptive Pricing, 16 CFR 233.1)** [first-party, via eCFR copies]: a "was" price must be a real price at which the product was openly and actively offered, in good faith, for a reasonably substantial period. An inflated price set so you can advertise a big reduction is deceptive.
- **EU (Price Indication Directive Art. 6a, added by the Omnibus Directive)** [first-party]: every announced price reduction must show the **prior price**, defined as the **lowest price in at least the 30 days before** the reduction. Earlier promotional prices in that window count. A percentage discount must be calculated from that prior price.
- **Practical**: generate "was" prices from stored price history, not by hand; avoid permanent "sales".

## Subscriptions, auto-renewal and cancellation

_In short:_ Even without a US federal click-to-cancel rule, show price, renewal terms and how to cancel before checkout, get express consent, send reminders, and let people cancel online as easily as they signed up.

- No US federal click-to-cancel rule is in force (the FTC's rule was vacated in July 2025), but the FTC can still act under the FTC Act and ROSCA, and state automatic renewal laws remain; see retention-and-expansion for the dated status and EU, German and UK rules. [first-party]
- Safe practice: show price, renewal frequency and how to cancel before checkout; get express consent to the renewal; send renewal reminders; let people cancel online as easily as they signed up. Flow design: see retention-and-expansion.

## Dark patterns (brief)

_In short:_ Regulators treat manipulative design, such as hidden reject buttons, pre-ticked boxes and fake urgency, as invalid consent or deception, so design choices that respect the user's decision.

- Regulators on both sides of the Atlantic treat manipulative design (hidden reject buttons, confirmshaming, pre-ticked boxes, fake urgency, forced continuity) as a source of invalid consent or deception. See the EDPB deceptive design patterns guidelines 03/2022 and the CPPA Honda case above [first-party]. Persuasion that respects choice: see behavioral-science.

## Accessibility of marketing sites

_In short:_ Marketing sites, especially shops serving EU consumers, must meet accessibility rules, and US lawsuits are rising. Build to WCAG 2.2 AA, test with keyboard and screen reader, and skip overlay widgets.

- **European Accessibility Act** [first-party; read 2026-10-05, Directive (EU) 2019/882]: applies to covered products placed on the market after **28 June 2025**, and to covered services provided to consumers after that date, including e-commerce services. Existing online shops are covered, not only new ones; the transition period to 28 June 2030 is only for products already used to deliver a service. Microenterprises providing services (fewer than 10 staff and turnover or balance sheet up to €2M) are exempt.
- **US (ADA Title III)** [secondary, Seyfarth Shaw data via search]: 3,117 federal website-accessibility lawsuits in 2025, up 27% from 2,452 in 2024. State-court filings push the total above 5,000 (vendor-relayed estimate).
- **Standard**: build to **WCAG 2.2 level AA** [first-party, W3C; not re-verified]. Common failures: low contrast, missing text alternatives, uncaptioned video, keyboard traps in pop-ups and cookie banners. Scanners find only part of the problems; test with a keyboard and a screen reader. "Overlay" widgets do not make a site compliant [practitioner].

## AI-generated content

_In short:_ EU rules now require disclosing deepfakes and some AI-written public-interest text, and US regulators pursue deceptive AI claims. Prove any AI-powered result claim, label synthetic people and voices, and use no AI testimonials.

- **EU AI Act Art. 50** [first-party; verified-search: digital-strategy.ec.europa.eu, 2026-10-04]: transparency obligations apply from **2 August 2026**. The AI Omnibus (in force 27 July 2026) delayed the high-risk rules to 2 December 2027 and 2 August 2028, but not Art. 50. The only grace period is for generative-AI systems already on the market before 2 August 2026: their providers have until 2 December 2026 to add machine-readable marking (Art. 50(2)). Systems launched after 2 August 2026 must comply from launch. Deployers must disclose deepfakes (realistic synthetic images, audio or video of real people, places or events) and AI-generated text published to inform the public on matters of public interest, unless it had human editorial review.
- **US (FTC Operation AI Comply, September 2024)** [first-party; verified-search: ftc.gov, 2026-10-04]: an enforcement sweep against deceptive AI claims. DoNotPay ("robot lawyer") paid $193,000. The FTC set aside the Rytr order (AI review generator) in December 2025, but fake reviews remain illegal under the reviews rule (see pr-and-influencers).
- **Practical**: prove any "AI-powered" result claim; label synthetic people and voices; no AI testimonials.

## Children

_In short:_ For under-13 audiences, US rules require separate verifiable parental consent before sharing children's data with third parties such as advertisers.

- **COPPA amended rule** [first-party; verified-search: ftc.gov, federalregister.gov, 2026-10-04]: published 22 April 2025, effective 23 June 2025, compliance required for most provisions from **22 April 2026**. Key change: **separate verifiable parental consent** before disclosing children's data to third parties such as advertisers.

## Pre-launch checklist

_In short:_ Before launch, check consent and trackers, opt-out signals, sensitive-page pixels, evidence for claims, comparisons, was prices, origin claims, subscription terms, accessibility, AI labelling, children, and email consent.

1. Tag audit done; no tracker fires before consent in the EU/UK; "Reject all" is on the first layer.
2. GPC detected and honoured; "Do Not Sell or Share" link works and needs no more steps than opting in.
3. No pixels or CAPI events on health, finance or other sensitive pages or events; URLs and event names carry no sensitive data.
4. Evidence file exists for every objective claim, comparison and "No. 1" statement.
5. Competitor comparisons are like-for-like, current and dated.
6. "Was" prices come from price history (EU: lowest price in prior 30 days).
7. "Made in USA" claims meet "all or virtually all", or are qualified.
8. Subscription terms, renewal consent, reminders and online cancellation are in place.
9. Key pages and the cookie banner pass WCAG 2.2 AA checks with a keyboard and a screen reader.
10. AI-generated people, voices and public-interest text labelled (EU); no AI testimonials.
11. Under-13 audience? Parental consent before ad data sharing.
12. Email consent checked against outbound-and-abm.

## Common mistakes

_In short:_ Avoid a big Accept button against a grey Manage options link, ignoring opt-out signals, passing quiz answers to ad platforms, discounts from prices nobody paid, accessibility overlays, and assuming cancellation rules vanished.

- "Accept" as a big button and "Manage options" as a grey link; tags added without consent checks.
- Treating GPC as optional because the site "doesn't sell data", while ad pixels "share" it.
- Health or wellness funnels that pass quiz answers to ad platforms.
- "Up to 50% off" based on a price nobody ever paid.
- Relying on an accessibility overlay instead of fixing the site.
- Assuming the click-to-cancel ruling means cancellation rules no longer apply.

## Sources

research/privacy-and-marketing-law.md (EDPB Cookie Banner Taskforce 2023; CNIL Google/Facebook 2022; California AG Sephora 2022; CPPA Honda 2025; IAPP state tracker; FTC GoodRx, BetterHelp, HBNR 2024, COPPA 2025, Operation AI Comply, Made in USA rule; 16 CFR 233; Directive 2006/114/EC; Price Indication Directive Art. 6a guidance; ASA CAP Code 3.7; European Commission EAA; Seyfarth ADA data; AI Act Art. 50 summaries; Eighth Circuit click-to-cancel summaries).
