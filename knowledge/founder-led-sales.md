---
title: Founder-led sales (first ten customers)
summary: How a technical founder runs the sale for a B2B or developer product at 0–10 customers: discovery calls (Mom Test, SPIN, MEDDIC and when each fits), demos, paid pilots with written success criteria, security questionnaires (SOC 2, trust page, CAIQ, SIG Lite), anchoring and discounts, procurement and sales-cycle length, follow-up cadence, spreadsheet tracking, and when to hire the first salesperson.
tags: founder-led sales, founder sales, sales process, discovery call, discovery questions, mom test, spin selling, meddic, meddpicc, qualification, demo, product demo, pilot, paid pilot, proof of concept, poc, success criteria, design partner pricing, security questionnaire, soc 2, trust page, trust center, caiq, sig lite, vendor security review, negotiation, anchoring, discount, annual prepay, procurement, sales cycle, follow-up, next step, crm, spreadsheet, first sales hire, first salesperson, account executive
---

Use this playbook when the founder is the only person selling and there are fewer than about ten paying customers. Who to pick as first customers, design-partner selection and the one-page agreement are in first-customers. Pipeline math, buying groups and later stages are in b2b-saas-sales-led. Finding and emailing prospects is in outbound-and-abm.

Evidence note: almost no controlled research studies founder-led selling. The strongest evidence is adjacent: psychology experiments on asking questions and on first offers, one meta-analysis of salesperson behaviour, and a large audit of lead response times. Most numbers on calls, demos, pilots, security reviews and cycle length come from vendors who sell tools for that step. Several popular pilot statistics have no traceable source (see "Folklore" below).

## Discovery calls: which method for which question

Discovery is the call where you learn whether this account has a problem worth paying to fix, and how they buy. Three methods are often mixed up. They answer different questions.

| Method | Question it answers | Use it when |
|---|---|---|
| **Mom Test** (Fitzpatrick) | Is the problem real, and what do they do about it today? | Before the product exists, or with a new segment. Details in customer-research. [practitioner] |
| **SPIN** (Situation, Problem, Implication, Need-payoff; Rackham) | How big is the cost of this problem for this account? | A real buyer with a known problem, a deal worth weeks of effort. [vendor; Huthwaite's own observational data; not peer-reviewed] |
| **MEDDIC / MEDDPICC** (Metrics, Economic buyer, Decision criteria, Decision process, Paper process, Identify pain, Champion, Competition) | Can this specific deal close, and what is missing? | Once a deal is real: one row per open deal in your tracker. [practitioner; created at PTC in the 1990s; no outcome study found] |

How to use them together at 0–10 customers [practitioner]:
- **First call:** Mom Test style. Ask about the last time the problem happened, what it cost and what they tried. Do not pitch.
- **Same or second call:** SPIN's implication questions ("What happens when the deploy fails at night? Who gets paged? How often?") turn a vague pain into a number the buyer can repeat to their boss.
- **After each call:** fill in the MEDDIC fields you know. Blank fields are your next questions. A blank "economic buyer" or "paper process" is the most common reason an early deal stalls.

What the evidence says about asking questions:
- People who ask more questions, especially **follow-up questions**, are liked more by the person they talk to. People do not expect this effect. [research; JPSP 2017; 3 studies, 600+ chat participants and 110 speed daters; social settings, not sales]
- Salespeople who adapt their approach to each buyer perform better on objective measures. [research; meta-analysis, 155 samples, 31,000+ salespeople; correlational; snippet-only]
- In Gong's data, success peaked at **11–14 targeted questions** per discovery call. Top sellers spread questions through the call; average sellers asked them all at the start like a checklist. [vendor; Gong, 519,000 calls, 2017; correlational; method not published] Treat the count as a sign of a real conversation, not a target.
- **Talk about budget on the first call.** In 11,331 opportunities, win rates were 49% when budget came up on the first call and 7% when it never did. [vendor; Gong 2020; correlational: serious buyers talk budget early]
- Huthwaite's research sorted calls by outcome: an **advance** means the buyer agrees to a new, specific action (a meeting with their security lead, a data sample, a trial with real data). A **continuation** ("send me some info", "let's stay in touch") is not progress. [vendor; Huthwaite whitepaper] End every call by asking for an advance.

## Demos: show their problem, not your product

- Run the demo only after discovery. Open with less than two minutes on the problems they told you, then show the two or three flows that fix those problems. [vendor; Gong, 67,149 demos, 2017; partly snippet-only]
- **Stop talking every minute or so.** Rep talk share was the same in won and lost demos (about 65%). The difference: the longest monologue in won demos was 76 seconds; lost demos often ran past 106 seconds. Won demos had 21% more back-and-forth per minute. [vendor; Gong 2017; correlational]
- Won demos were longer (47 vs 36 minutes average) [vendor; Gong 2017]. That probably reflects engaged buyers, not a reason to stretch the call.
- For a developer product, demo on their data or their repository if you can. Buyers rate demos and their own trials as more useful than vendor material [vendor; TrustRadius].
- **Demo-to-close rates** by contract size, from one vendor: about 35% under $10k a year, 22% at $50–100k, 15% over $100k [vendor; Optifai, claimed 939 companies, 2025–26; data mixed with other reports; not traceable]. Use your own numbers once you have ten demos.

## Pilots and proofs of concept that turn into contracts

A pilot (or proof of concept, POC) is a time-limited trial of the product in the customer's real environment, ending in a buy or no-buy decision.

- **Charge for it.** Investor experience: well-run paid pilots convert to annual contracts at about 60–90%, and unpaid pilots are "a false milestone" most of the time [practitioner; Lemkin, SaaStr; his portfolio; no sample]. No independent study compares paid and free pilots.
- **Write the success test before it starts** [practitioner]. One page, signed by the buyer:
  1. The metric and the threshold ("p95 query time on the 20 slowest queries falls by 30%").
  2. Who measures it, with what data, and on what date.
  3. Length: as short as the test allows. Two to six weeks is common for a developer tool; design partnerships run longer (see first-customers).
  4. Price, and what happens on success: the contract, its price and its start date, agreed now.
  5. Who signs, and their procurement steps (see below).
- **Why written criteria matter:** most internal AI pilots never reach production. IDC found that only 4 of every 33 AI POCs went to production; causes included data not ready, unclear ROI, and pilots started without funding [vendor/analyst; IDC with Lenovo, 2025; via CIO.com; sample not given]. Gartner predicted at least 30% of generative-AI projects would be abandoned after the POC for unclear value, cost and data quality [analyst; 2024 prediction; snippet-only]. These are buyers' internal projects, not vendor pilots, but the failure causes are the ones a written test removes: agree the value test, the data access and the budget owner before day one.
- **Speed to first value predicts conversion** [practitioner; Lemkin]. Do the setup yourself in the first days. The slowest pilot conversions involved heavy changes to the customer's process.
- **Design-partner pricing:** investors advise a discount or early access with a hard date to convert, never open-ended free use [practitioner; Bessemer 2026; Common Paper]. Common Paper publishes a free standard design-partner agreement covering feedback cadence, reference rights, discounts and termination [practitioner]. The "pay 10–50% of the eventual contract" advice is from untraced blogs [rule-of-thumb].

## Security questionnaires as a tiny company

At 0–10 customers, assume any buyer with a security team will send a questionnaire. What you can offer, from cheapest:

1. **A trust page** (a public page on security and data handling): what data you read, send and store, where, for how long, who has access, sub-processors, and how to report a vulnerability. Build it from the data-flow page in first-customers. No study measures its effect on deals; vendor claims that it cuts questionnaire volume by half are untraced [vendor; snippet-only].
2. **A completed standard questionnaire you can send.** The CAIQ (Consensus Assessments Initiative Questionnaire, 261 yes/no questions) can be submitted to the Cloud Security Alliance's public STAR registry as a free Level 1 self-assessment, described for low-risk use [first-party; CSA]. The SIG Lite (Standardized Information Gathering, about 126–128 questions) is what many buyers send for vendors they rate lower-risk; the buyer licenses it and you answer it [secondary sources; snippet-only]. Fill one in once and reuse the answers.
3. **SOC 2** (an audit report by a CPA firm on your security controls). Type 1 checks control design at one date. Type 2 checks they worked over a period, in practice at least 3 months and usually 6–12 [first-party AICPA; period from secondary sources]. A security consultancy's advice: start when "big-company clients" demand it to close a sale; first set up single sign-on, protected branches and CI, central logging, infrastructure as code, cloud audit logs, device management and a vendor list; budget an auditor found by referral [practitioner; Latacora, 2020].

Rules [practitioner]:
- Answer honestly. "No, planned for Q3" with a date beats a false "yes" that a later audit or incident exposes.
- Ask early, on the first or second call: "Will security review this? Who, and with which questionnaire?" Then the review runs in parallel with the pilot, not after it.
- If one deal requires SOC 2, ask whether a Type 1 now plus a Type 2 date in the contract is enough. Some buyers accept that; many will not. You only learn by asking.
- Buyers' security staff are busy: one vendor survey found IT leaders spend about 6.5 hours a week reviewing vendor risk [vendor; Vanta/Sapio, 2,500 leaders, 2024]. A short, complete, reusable pack gets read sooner.

## Negotiating price and discounts

Pricing structure, value metrics and discount risks are in pricing. Here only the conversation.

- **Name the price first, and name it as a range with your target at the bottom.** First offers anchor the result: across simulated negotiations the correlation between first offer and outcome was about 0.5 [research; meta-analysis; snippet-only], weaker with experienced counterparts. A range such as "$18–22k a year" with $18k as your real target gave better settlements than a single number, without seeming less polite [research; JPSP 2015; 5 experiments; lab and online].
- **Don't anchor at an extreme.** Extreme anchors won single deals but caused more impasses (14% vs 5%) and less willingness to deal again [research; lab, 176 and 52 students]. Early customers are your references, so the relationship matters more than the last 10%.
- **Trade, don't give.** Give a discount only for something: annual prepay, a multi-year term, a case study, a logo, a reference call, a signature date. Write the list price and the discount on the order form so the list price stays real [practitioner].
- **Annual prepay:** a discount of about 15–20% is the usual price of moving a customer from monthly to annual [vendor; ProfitWell; snippet-only]. Cash up front matters more to a 0–10 customer company than to the buyer.
- **Design-partner price:** a dated discount off a written list price, converting to list (or a stated step-up) at renewal [practitioner; see first-customers].

## Procurement and how long deals take

Even small companies have steps between "yes" and money [practitioner]:
- **Under ~50 people:** the founder or a team lead signs; a card payment or a one-page order form. Security may be one engineer's questions.
- **Mid-size (~50–1,000 people):** a vendor form (tax ID, bank details, insurance certificate), your terms or theirs (a master agreement), a data processing agreement if you touch personal data, a security questionnaire, and a purchase order.
- Ask on the first serious call: "Once you decide, what happens before a contract is signed? Who else needs to see it?" That is MEDDPICC's paper process. Have your own short terms, a data processing agreement and an insurance certificate ready.

Cycle length rises with deal size [vendor; all correlational]:
- Under about $15k a year: roughly 2–4 weeks; $15–50k: 1–2 months; over $100k: 3–6 months or more [vendor; Optifai, claimed 939 companies; not traceable].
- About 70 days for $100k deals in Gong's customer base [vendor; via SaaStr; no method].
- Net-new software purchases through one procurement service took 42–55 days for most top suppliers [vendor; Vendr 2023; 30,000+ purchases by established companies].
- Purchases that buyers later regretted took 7–10 months longer; top regrets were total cost and slow implementation [analyst; Gartner; snippet-only].

Set your own expectation from your first five deals, and plan cash on the slow end.

## Follow-up cadence

- **Every call ends with a dated next step in the calendar**, sent as an invite before you hang up. In one vendor's data, deals with no activity and no scheduled next step for more than 7 days had 65% lower win rates, and top performers were far more likely to have a next meeting defined [vendor; Ebsta × Pavilion, 4.2M opportunities, 2024; correlational].
- **Answer inbound interest within the hour.** Firms that tried to reach a web lead within an hour were about 7x as likely to qualify it as those that waited one hour more, and 60x as likely as those that waited a day [research-adjacent; HBR 2011; 1.25M leads, mostly consumer; snippet-only].
- **Recap in writing the same day:** their problem in their words, what you agreed, the next step, open questions. The champion forwards this inside their company [practitioner].
- **Multi-thread** (talk to several people at the account). Won deals had about 9 buyer contacts engaged by the solution stage, lost deals about 2 [vendor; Ebsta × Pavilion 2024]. At 0–10 customers, aim for at least the user, the budget owner and whoever runs security.
- **When a deal goes quiet:** two or three short follow-ups, each adding something (a fix they asked for, a relevant result), over two to three weeks; then ask directly whether to close the file [practitioner]. Cold sequences are covered in outbound-and-abm.

## Tracking: when a spreadsheet is enough

- **One founder, under about 30–50 active conversations:** a spreadsheet is enough [rule-of-thumb; CRM vendors' own advice]. One row per deal: company, contact, champion, economic buyer, problem, metric, stage, next step and date, security status, paper process, last contact, source.
- **Columns beat tools.** The MEDDIC fields and the "next step date" column do the work; sort by next-step date every morning.
- **Switch to a CRM** when a second person sells, when you miss a follow-up, or when you cannot answer "how many deals at pilot stage?" in a minute [rule-of-thumb].
- Record why each deal was lost in one sentence. With ten losses you have a positioning signal (see positioning and competitive-analysis).

## When to hire the first salesperson

- No study compares founder-led with hired selling. In 300+ B2B high-tech start-ups, more budget on personal selling helped early and hurt after product-market fit [research; observational panel; snippet-only; see first-customers]. Among 2,484 US start-ups, adding sales staff was associated with better performance and adding non-owner managers with worse [research; Kauffman Firm Survey panel; abstract and summaries]. Neither tells you whether a founder or a hire should do the selling.
- Practitioner thresholds converge [practitioner]:
  - A repeatable process: a 15–25% win rate and 10–20 referenceable customers (Kazanjy).
  - 5–10 customers and the founder has become the bottleneck: customers are waiting on you (Heavybit, developer-tool investor).
  - Investor portfolio examples hired the first account executive at about $0.5–1.5M ARR, after qualified conversations converted consistently (Bain Capital Ventures, 2026).
- "Don't hire to fix broken sales. If you can't sell your product, neither can an AE." [practitioner; Bain Capital Ventures]
- Hire a seller, not a sales manager; prefer experience at your contract size; plan to co-sell for the first months; set a reachable first quota [practitioner]. Adding reps before the sale is repeatable burns cash without speeding learning [practitioner; Leslie & Holloway, HBR 2006].

## What usually works by stage

- **0 customers:** Mom Test calls with 15–30 people in one segment. Pitch nothing until you hear the same problem, in the same words, several times. Ask each for a commitment (see first-customers).
- **First 1–3 customers:** discovery with SPIN implication questions; demo on their data; a paid pilot with a one-page success test; a trust page and one completed CAIQ or SIG Lite; spreadsheet with MEDDIC columns.
- **3–10 customers:** a standard order form and terms; annual prepay as the default offer; list price with written, traded discounts; record cycle length and loss reasons; decide on SOC 2 when a real deal requires it; write down the sales steps that worked so a hire can repeat them.
- **About 10+ referenceable customers and a stable win rate:** hire the first seller; co-sell; move to a CRM (see b2b-saas-sales-led).

## Common mistakes

- Pitching in the first call instead of learning; asking all the questions up front like a form.
- Ending calls with "I'll send some info" instead of a dated next step.
- Free, open-ended pilots with no written success test, no price and no decision date.
- Learning about the security review or the purchase-order process after the buyer says yes.
- Claiming controls you don't have on a questionnaire.
- Buying a SOC 2 audit before any deal needs it, or refusing to start one when a large deal does.
- Discounting without getting anything back, and without writing the list price down.
- Talking only to the user; the deal dies when the budget owner first hears of it.
- Hiring a VP of Sales to find the sales process for you.

## Folklore

- "Pilots with predefined success criteria are 3.2x more likely to convert" (said to be Forrester 2023) and "structured pilots convert 40–60%" (said to be McKinsey 2023): no source found. The advice is sensible; the numbers are not evidence.
- "Security review adds 2–6 weeks" and "a trust centre cuts questionnaires 50–70%": vendor blogs without data.
- "The golden talk ratio is 43/57": Gong's own later data puts winning reps nearer 57% talk. Monologue length matters more than the ratio.
- "Top reps ask 4x more implication questions" and "closing techniques hurt big deals": from SPIN Selling via summaries; proprietary data from the 1970s; not checked against the book.
- "MEDDIC took PTC from $300M to $1B": a training-firm story, not a test of MEDDIC.

## Sources

research/founder-led-sales.md (Huang et al. 2017; Franke & Park 2006; Huthwaite/Rackham; Gong Labs 2017 and 2020; MEDDICC; Optifai 2026; Lemkin/SaaStr; IDC/Lenovo via CIO.com; Gartner 2024; MIT NANDA 2025; Bessemer 2026; Common Paper; CSA STAR; Shared Assessments SIG; AICPA; Latacora 2020; Vanta 2024; Galinsky & Mussweiler 2001; Orr & Guthrie 2006; Ames & Mason 2015; Maaravi et al. 2014; Vendr 2023; ProfitWell; Ebsta × Pavilion 2024; Oldroyd et al. 2011; Leslie & Holloway 2006; Long, Wood & Bennett 2023; Kazanjy; Heavybit 2019; Bain Capital Ventures 2026); research/early-stage-gtm.md (Vomberg et al. 2026); research/b2b-saas-models.md (TrustRadius).
