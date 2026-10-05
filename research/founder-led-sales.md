# Founder-Led Sales for a Technical Founder at 0–10 Customers: Research Notes

**Scope.** How a technical founder sells a B2B or developer product to the first ten customers: discovery calls (Mom Test, SPIN, MEDDIC), demos, pilots and proofs of concept, security questionnaires (SOC 2, trust pages, CAIQ, SIG Lite), negotiating price, procurement and sales-cycle length, follow-up cadence, tracking deals in a spreadsheet or CRM, when to hire the first salesperson, and common mistakes.

Researched 2026-10-05.

**Already in the repo (linked, not repeated):**
- Mom Test rules and switch interviews: `knowledge/customer-research.md`.
- Design-partner selection, one-page agreement, cadence, "paid from day one": `knowledge/first-customers.md` (practitioner).
- Vomberg et al. 2026, personal selling helps early and hurts later in 300+ B2B high-tech start-ups: `research/early-stage-gtm.md` [38].
- Buying groups, Bridge Group ramp and quota, Ebsta win rates falling, Kazanjy and Roberge on hiring: `research/b2b-saas-models.md`.
- Cold email, sequences, reply-rate denominators: `research/partners-referral-outbound.md` and `knowledge/outbound-and-abm.md`.
- Discounting harms (Anderson & Simester 2010), price increases, annual plans in general: `research/pricing.md`.

**Access caveat.** Pages were fetched with a generic browser User-Agent. `[read 2026-10-05]` means the page or PDF text was read. `; abstract` means only the abstract. `[snippet-only]` means only a search-engine summary was seen, so check before quoting. OpenAlex had used up its shared daily quota, so papers were found through web search, RePEc and author PDFs. Blocked: gartner.com (403), hbs.edu faculty page (403), SSRN (403), springer.com (login redirect), sharedassessments.org (sign-in wall), techrepublic.com (403), hpcwire.com (403). Lenny's Newsletter page held only the episode index.

**Short answer.** There is almost no controlled research on founder-led selling. The strongest evidence is adjacent:
- Lab and field psychology on asking questions and on first offers in negotiation.
- One meta-analysis of salesperson behaviour (adaptive selling).
- A large audit of how fast firms answer web leads.
- Observational panels of start-ups.

Everything about discovery-call counts, demo length, pilot conversion, security reviews and cycle length comes from vendors who sell tools for that step, or from investors and operators. Several widely quoted figures (pilot conversion "McKinsey 2023", "Forrester 3.2x") have no traceable source.

## Sources

### A. Discovery calls and question-asking

1. **Huang, K., Yeomans, M., Brooks, A. W., Minson, J. & Gino, F. (2017). "It Doesn't Hurt to Ask: Question-Asking Increases Liking."** *Journal of Personality and Social Psychology* 113(3):430–452. doi:10.1037/pspi0000097. https://www.hbs.edu/ris/Publication%20Files/Huang%20et%20al%202017_6945bc5e-3b3e-4c0a-addd-254c9e603c60.pdf [research; read 2026-10-05: full PDF]
   - 3 studies of live two-person conversations: online get-to-know-you chats (more than 600 participants across studies 1–2, some instructed to ask many or few questions) and face-to-face speed dating (110 daters, over 2,000 conversations).
   - People who asked more questions, "particularly follow-up questions", were liked more. Speed daters who asked more follow-up questions got more second-date agreements.
   - Mechanism: questions make the asker seem more responsive (listening, understanding, validation, care).
   - People did not predict that asking questions would raise liking.
   - Limits: social and dating settings, not sales; liking, not purchase.

2. **Franke, G. R. & Park, J.-E. (2006). "Salesperson Adaptive Selling Behavior and Customer Orientation: A Meta-Analysis."** *Journal of Marketing Research* 43(4):693–702. [research; meta-analysis; snippet-only: abstract seen via search summaries, not the publisher page]
   - Combined 155 samples covering more than 31,000 salespeople.
   - Adaptive selling (changing the approach to fit each buyer) was linked to both objective and subjective sales performance. Customer orientation was linked only to self-rated and manager-rated performance.
   - Limits: mostly cross-sectional surveys of established salesforces; correlational.

3. **Neil Rackham / Huthwaite research behind SPIN Selling (book 1988).** Huthwaite International, "The science behind SPIN Selling" whitepaper (2024), https://icaptraining.gr/wp-content/uploads/2024/07/Whitepaper-The-Science-behind-SPIN%C2%AE-Selling-2024.pdf [vendor (Huthwaite sells SPIN training); read 2026-10-05: full PDF]; Wikipedia, "Neil Rackham", https://en.wikipedia.org/wiki/Neil_Rackham [read 2026-10-05]
   - Wikipedia: 30 researchers, 35,000 sales calls, more than 20 countries, 12 years, initial funding of about $1 million from firms including Xerox and IBM.
   - Whitepaper: an initial study of 6,000 salespeople; database of 35,000+ observed calls. Calls classified by outcome: an **order**, an **advance** (the customer "takes action that is new and meaningful"), a **continuation** (the customer takes no action), or no sale.
   - Rackham quoted: successful sellers "were asking more questions" and "offering solutions late".
   - Whitepaper claims one client's won-versus-lost ratio went from 10% to 23% after training (a single unnamed case study).
   - SPIN = Situation, Problem, Implication, Need-payoff questions.
   - Widely repeated claims that classic closing techniques were negatively related to success in large sales, and that top sellers asked about 4x more Implication questions, come from the book via secondary summaries [snippet-only]. Not checked against the book text.
   - Limits: proprietary data, never published in a peer-reviewed journal; observations from 1970s field sales of large firms.

4. **Gong Labs, discovery-call analysis.** "Data Driven Tips to Mastering Sales Discovery Calls" (2017-06-18, updated 2026-03-04), https://www.gong.io/blog/nailing-your-sales-discovery-calls ; "Essential Discovery Call Techniques" (2017-07-05), https://www.gong.io/blog/deal-closing-discovery-call [vendor (Gong sells call recording); read 2026-10-05]
   - 519,000+ recorded B2B discovery calls.
   - Success peaked at **11–14 targeted questions**, then dropped back to average.
   - Top performers spread questions through the call; average sellers "front-load" them like a checklist.
   - Successful calls uncovered 3–4 business problems; more speaker switches per minute correlated with success.
   - "Success" is a closed or advanced deal in Gong's data; method, controls and customer mix are not published. Talk-ratio figures differ between Gong posts (43/57 and 46/54 earlier; a 2025 analysis of 326,000 calls reportedly put won deals near 57% rep talk) [snippet-only for the 2025 figure].

5. **Gong Labs, "Data reveals the best time to talk price and budget"** (2020-07-22, updated 2026-03-06). https://www.gong.io/blog/data-reveals-the-best-time-to-talk-price-and-budget [vendor; read 2026-10-05]
   - 11,331 opportunities with at least three calls.
   - Share of won deals by the call in which pricing was first discussed: no mention 5%, 1st call 42%, 2nd 32%, 3rd 15%.
   - Win rates rose from 7% when budget was never discussed to 49% when budget came up on the first call.
   - Correlational: deals where budget is discussed early are probably already more serious.

6. **MEDDIC / MEDDICC / MEDDPICC.** MEDDICC (company), https://meddicc.com/meddpicc-sales-methodology-and-process [practitioner; vendor of MEDDICC training; read 2026-10-05]
   - "MEDDIC was originally created inside of PTC in 1996 by Dick Dunkel"; Jack Napoli is credited alongside him elsewhere.
   - Letters: Metrics, Economic buyer, Decision criteria, Decision process, (Paper process), Identify/Implicate pain, Champion, (Competition).
   - Positioned for "complex B2B sales" with many stakeholders.
   - The story that it took PTC from $300M to $1B in four years is repeated by training firms [snippet-only]; no outcome study found.

7. **Fitzpatrick, R. (2013). *The Mom Test*.** [practitioner] Already summarised in `knowledge/customer-research.md`.

### B. Demos

8. **Gong Labs, "Sales Demo Tips Backed by Data"** (2017-09-14, updated 2026-03-04). https://www.gong.io/blog/sales-demos [vendor; read 2026-10-05]
   - 67,149 recorded demos over 10 weeks.
   - Successful demos averaged 47 minutes versus 36 for unsuccessful.
   - Rep talk share was about the same (65% vs 66%), but in successful demos the longest uninterrupted monologue was 76 seconds; unsuccessful demos often ran past 106 seconds.
   - 21% more speaker switches per minute in successful demos; the rise was steeper in the second half.
   - Winning demos mirrored topics from discovery and started with less than 2 minutes of context [partly from the Gong "win demo" page; snippet-only].
   - Survivorship and reverse causation: engaged buyers make long, interactive demos.

9. **Optifai, "Demo-to-close conversion rate"** (updated 2026-04-20). https://optif.ai/learn/questions/demo-to-close-conversion-rate/ [vendor (sales AI tool); read 2026-10-05]
   - Claims 939 B2B companies, Q2 2025–Q1 2026; closed-won ÷ demos delivered, measured 90 days after the demo.
   - By ACV: under $10k 35%, $10–50k 28%, $50–100k 22%, $100k+ 15%.
   - Data mixed from customers' CRMs, call tools "and industry reports"; no raw data or sampling description. Treat as a rough order of magnitude.

10. **TrustRadius** (in `research/b2b-saas-models.md` [12]): demos were the most consulted buying resource (54%) in its 2024 survey [vendor].

### C. Pilots and proofs of concept

11. **Jason Lemkin, SaaStr, "What is the typical conversion from paid pilot to annual contract?"** https://www.saastr.com/what-is-the-typical-conversion-from-paid-pilot-to-annual-contract-in-b2b-saas-2 [practitioner; read 2026-10-05]
    - "70%+ once you are doing it right"; among companies he works with, "about 60% to over 90%"; EchoSign above 90%.
    - Fast time to first value drives conversion; the 60% case involved heavy business-process change.
    - Calls unpaid pilots "a false milestone" most of the time.
    - Basis: his own portfolio; no sample or definition of a pilot.

12. **Gartner press release, 29 July 2024: "Gartner Predicts 30% of Generative AI Projects Will Be Abandoned After Proof of Concept By End of 2025."** https://www.gartner.com/en/newsroom/press-releases/2024-07-29-gartner-predicts-30-percent-of-generative-ai-projects-will-be-abandoned-after-proof-of-concept-by-end-of-2025 [analyst; snippet-only: gartner.com returned 403]
    - Reasons given: poor data quality, inadequate risk controls, escalating costs, unclear business value.
    - A prediction about internal AI projects, not a measured rate for vendor pilots.

13. **IDC with Lenovo, CIO Playbook 2025, as reported by CIO.com, "88% of AI pilots fail to reach production — but that's not all on IT"** (2025). https://www.cio.com/article/3850763/88-of-ai-pilots-fail-to-reach-production-but-thats-not-all-on-it.html [vendor/analyst; read 2026-10-05: article, not the report]
    - "For every 33 AI POCs a company launched, only four graduated to production."
    - Reasons: data not ready, missing in-house skills, unclear ROI, projects started from board pressure and "highly underfunded".
    - Sample and dates not given in the article. The 2026 edition reportedly found 46% of AI POCs had progressed to production [snippet-only].

14. **MIT NANDA, *The GenAI Divide: State of AI in Business 2025*.** [research-adjacent report; snippet-only]
    - Headline: 95% of enterprise generative-AI pilots showed no measurable P&L impact.
    - Basis reported as about 52 interviews, 153 survey responses and a scan of 300 public deployments; the report calls itself preliminary. Critics note the small, convenience sample.

15. **Untraceable pilot statistics.** Monetizely, "How to Structure Enterprise Pilot Program Pricing", https://www.getmonetizely.com/articles/how-to-structure-enterprise-pilot-program-pricing-effective-proof-of-concept-strategies [read 2026-10-05]
    - Cites "McKinsey's 2023 SaaS Growth Report" (structured pilots convert 40–60%, free trials under 10%), "a 2023 Forrester study" (pilots with predefined success criteria 3.2x more likely to convert), a Deloitte figure and a Gartner "78%" figure. **No link or report title for any of them.** No such reports were found. Listed under Folklore.

16. **Bessemer Venture Partners, "Design partners: the pre-launch edge most AI founders ignore"** (2026-05-06). https://www.bvp.com/atlas/design-partners-the-pre-launch-edge-most-ai-founders-ignore [practitioner (investor); read 2026-10-05]
    - 5–12 design partners; discounted pricing or early access, with conversion to paid at a hard deadline; "no indefinite free access".
    - One portfolio case: all 12 cold-recruited partners converted to paid. A single selected success story.

17. **Common Paper, "How To Work With Design Partners"** (Jake Stein, updated 2024-11-28), https://commonpaper.com/blog/design-partner/ ; free Design Partner Agreement, https://commonpaper.com/standards/design-partner-agreement/ [practitioner; vendor of contract tooling; read 2026-10-05]
    - The standard agreement covers feedback cadence, reference rights, roadmap input, discounts and services, and early termination.
    - Recommends a named milestone at which the partner becomes a paying customer; biweekly or monthly meetings.
    - Other posts suggest design partners pay 10–50% of eventual contract value, or 30–50% off list for 12–24 months [snippet-only; untraced blogs].

### D. Security questionnaires

18. **Cloud Security Alliance, STAR levels.** https://cloudsecurityalliance.org/star/levels [first-party; read 2026-10-05]
    - STAR Level 1 = submit the CAIQ (Consensus Assessments Initiative Questionnaire) v4 self-assessment to the public STAR registry. The self-assessment is free; an optional AI validation costs $595.
    - Level 1 is described for low-risk environments; Level 2 adds a third-party audit (for example STAR Attestation built on SOC 2).
    - CAIQ v4 has 261 yes/no questions over 17 domains, mapped to the 197 Cloud Controls Matrix controls [snippet-only; several secondary sources agree].

19. **Shared Assessments SIG (Standardized Information Gathering questionnaire).** [first-party pages behind a sign-in wall; secondary: ComplyDog, https://www.complydog.com/blog/sig-lite-vs-sig-core, read 2026-10-05]
    - 2023 SIG Lite: 126 questions, for vendors the buyer rates lower-risk or as a first screen. 2025 SIG Lite: 128 questions; SIG Core about 627 questions [snippet-only]. Full library 1,855 questions.
    - SIG Core is used when the vendor handles sensitive or regulated data.
    - The buyer licenses the SIG; the responding vendor fills it in without a licence [snippet-only].

20. **AICPA SOC 2.** AICPA SOC overview page, https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2 [first-party; read 2026-10-05; the page gives little detail]
    - CPA firms report on controls relevant to security, availability, processing integrity, confidentiality or privacy.
    - Type 1 = control design at a point in time; Type 2 = design and operating effectiveness over a period. AICPA sets no fixed minimum period; 3 months is the common practical floor, 6–12 months typical [secondary: Drata, Scrut; snippet-only].

21. **Latacora, "The SOC2 Starting Seven"** (2020-03-12). https://www.latacora.com/blog/2020/03/12/soc2-starting-seven/ [practitioner (security consultancy); read 2026-10-05]
    - Framing: "eventually you'll run into big-company clients demanding a SOC2 report to close a sale".
    - Seven things to set up first: single sign-on; PRs, protected branches and CI/CD; centralised logging; infrastructure as code ("Terraform or something"); CloudTrail and assume-role; MDM (device management); vendor security.
    - Auditors: budget about $15,000 (2020) and pick one by referral from founders who were certified.

22. **Vanta, *State of Trust Report 2024*.** https://info.vanta.com/hubfs/2024%20State%20of%20Trust%20Report.pdf [vendor (sells compliance automation); read 2026-10-05: full PDF]
    - Sapio Research survey, July–August 2024, 2,500 business and IT leaders in the US, UK and Australia; questionnaire co-designed by Vanta.
    - IT decision makers spend on average 6.5 hours a week (7.6 working weeks a year) assessing vendor risk.
    - Compliance work averaged 11 working weeks in 2024 (10 in 2023).
    - Says nothing about what buyers accept from very small vendors.

23. **Untraced security-review figures.** Blogs from questionnaire-automation vendors claim security review adds 2–6 weeks to enterprise cycles and that a public trust centre cuts questionnaire volume 50–70% within 90 days (e.g. cyberbase.ai, steerlab.ai) [snippet-only; no underlying data]. Listed under Folklore.

### E. Negotiation and price

24. **Galinsky, A. D. & Mussweiler, T. (2001). "First offers as anchors: The role of perspective-taking and negotiator focus."** *Journal of Personality and Social Psychology* 81(4):657–669. [research; experiments; snippet-only: abstract via Semantic Scholar summary]
    - Three experiments: whichever side made the first offer got the better outcome; first offers strongly predicted final price.

25. **Orr, D. & Guthrie, C. (2006). "Anchoring, Information, Expertise, and Negotiation: New Insights from Meta-Analysis."** *Ohio State Journal on Dispute Resolution* 21:597. SSRN 900152. [research; meta-analysis; snippet-only: SSRN returned 403]
    - Correlation of about 0.497 between first offer and outcome across simulated negotiations (16 papers reported).
    - Lower with experienced negotiators and when more information is shared (about 0.38 reported).

26. **Ames, D. R. & Mason, M. F. (2015). "Tandem Anchoring: Informational and Politeness Effects of Range Offers in Social Exchange."** *Journal of Personality and Social Psychology* 108(2):254–274. https://www.columbia.edu/~da358/publications/Tandem_anchoring.pdf [research; 5 experiments; read 2026-10-05: full PDF]
    - Scripted scenarios (e.g. Study 1, 382 online participants) and live negotiations.
    - A "bolstering" range (your target as the bottom, e.g. $7,200–7,600) gave better settlements than a single number, without being seen as less polite. Very wide or extreme ranges lose the benefit.

27. **Maaravi, Y., Pazy, A. & Ganzach, Y. (2014). "Winning a battle but losing the war: On the drawbacks of using the anchoring tactic in distributive negotiations."** *Judgment and Decision Making* 9(6). https://www.cambridge.org/core/journals/judgment-and-decision-making/article/winning-a-battle-but-losing-the-war-on-the-drawbacks-of-using-the-anchoring-tactic-in-distributive-negotiations/F38433715E3D9D74BF5ACFCE6869BE83 [research; lab; read 2026-10-05: summary of article page]
    - Study 1 (176 students): extreme anchors won better prices but counterparts were less satisfied and less willing to deal again.
    - Study 2 (52 MBA students, 303 transactions in a market game): anchor users had more impasses (14% vs 5%) and lower total profit.

28. **Vendr, *SaaS Trends Report 2023*.** https://www.vendr.com/insights/saas-trends-report-2023 [vendor (procurement service for buyers); read 2026-10-05]
    - Basis: 30,000+ SaaS purchases on Vendr's platform.
    - Most top suppliers' buying cycles ran 42–55 days; summer was slowest for new purchases.
    - Single negotiation examples, e.g. 16% off for annual instead of monthly payment at one vendor.
    - Sample is mid-size and large companies buying established software through a procurement service.

29. **Annual prepay discount norms.** ProfitWell/Paddle, "Annual plans", https://www.paddle.com/resources/annual-plans ; OpenView figure via secondary blogs [vendor; snippet-only]
    - "Typically 15–20%" discount needed to move customers to annual (ProfitWell); 68% of Cloud 100 companies with public pricing offered annual prepay at a 20–30% average discount (OpenView, via secondary sources).

### F. Sales cycles, procurement, follow-up

30. **Ebsta × Pavilion, *B2B Sales Benchmarks 2024*.** https://www.ebsta.com/ebsta-pavilion-b2b-sales-benchmarks-2024/ [vendor; read 2026-10-05]
    - 4.2M opportunities, 530 companies, $54B revenue.
    - Won deals had about 9 buyer contacts engaged at "solution presented", lost deals about 2.
    - **Inactivity of more than 7 days with no scheduled next step cut win rates by 65%.**
    - Top performers were "412% more likely to have next step or meeting defined" and 241% more likely to have the economic buyer engaged before the solution was presented.
    - One cancelled meeting cut stage progression 18%; two cut it 58%.
    - Correlational; customers of a revenue-intelligence vendor.

31. **Gong 2025 State of Revenue, via SaaStr, "Gong: $100k deals take about 70 days to close."** https://www.saastr.com/gong-100k-deals-take-about-days-to-close [vendor via practitioner; read 2026-10-05]
    - About 70 days for $100k deals; opportunity-to-close win rate about 25% for Gong's enterprise customers. No sample or method given.

32. **Optifai Pipeline Study (2026, claimed N=939).** https://optif.ai/learn/questions/sales-cycle-length-benchmark/ [vendor; read 2026-10-05]
    - Won-deal cycle, 25th–75th percentile: under $15k ACV 14–30 days; $15–50k 30–60; $50–100k 60–90; over $100k 90–180+. Median 84 days.
    - Proprietary; not traceable.

33. **Oldroyd, J. B., McElheran, K. & Elkington, D. (2011). "The Short Life of Online Sales Leads."** *Harvard Business Review*, March 2011. https://hbr.org/2011/03/the-short-life-of-online-sales-leads [research-adjacent (HBR article on audit and lead data); snippet-only: hbs.edu 403]
    - Audit of 2,241 US firms' response to a web lead: average first response 42 hours; 23% never responded.
    - In 1.25M leads at 42 companies (29 B2C, 13 B2B), firms that tried to contact within an hour were nearly 7x as likely to qualify the lead as those an hour later, and 60x as likely as after 24 hours.
    - Inbound leads, mostly B2C; not founder outreach.

34. **Gartner technology-buying surveys.** [analyst; snippet-only: gartner.com and TechRepublic returned 403]
    - 2024 Tech Trends survey: 60% of buyers regretted a software purchase made in the last 18 months; top causes higher-than-expected total cost (33%) and slow or complex implementation (32%).
    - High-regret purchases took 7–10 months longer (Gartner Digital Markets).

### G. When to hire the first salesperson

35. **Leslie, M. & Holloway, C. A. (2006). "The Sales Learning Curve."** *Harvard Business Review*, July–August 2006. Stanford GSB listing https://www.gsb.stanford.edu/faculty-research/research/publications/sales-learning-curve [practitioner framework (Leslie was a CEO, then Stanford lecturer); listing read; content snippet-only]
    - Three phases: initiation, transition, execution. In initiation, adding salespeople burns cash without speeding learning; hire a small number of "renaissance reps" who can work with product and customers until the sale is repeatable.

36. **Long, A., Wood, M. S. & Bennett, D. L. (2023). "Entrepreneurial organizing activities and nascent venture performance."** *Small Business Economics* 60(2):433–461. doi:10.1007/s11187-021-00595-1. https://ideas.repec.org/a/kap/sbusec/v60y2023i2d10.1007_s11187-021-00595-1.html [research; read 2026-10-05; abstract]
    - 2,484 entrepreneurs from the Kauffman Firm Survey (random sample of US start-ups founded 2004, followed 8 years); dynamic panel.
    - Adding staff to boundary-spanning roles (sales) and the technical core was associated with better performance; adding non-owner managers with worse [direction from search summaries; effect sizes not read].
    - All industries, mostly small non-tech firms; does not compare founder selling with hired selling.

37. **Kazanjy, P., *Founding Sales*, via secondary summaries.** Antoine Buteau, "Lessons from Peter Kazanjy", https://www.antoinebuteau.com/lessons-from-peter-kazanjy/ [practitioner; read 2026-10-05: secondary summary]
    - "Achieve a 15–25% win rate and 10–20 referenceable customers, then bring in reps." First reps should test whether the founder's process reproduces, not invent one.

38. **Heavybit, "The Founder's Guide to First Sales Hires"** (Ashley Dotterweich, 2019-10-09). https://www.heavybit.com/library/article/the-founders-guide-to-first-sales-hire [practitioner; developer-tool investor; read 2026-10-05]
    - Signals: product-market fit, 5–10 customers, and the founder becoming the bottleneck (customers waiting for an order form).
    - Hire a seller, not a manager; experience at a similar contract size matters. Two reps at once lets you compare, but one good hire is acceptable. Finding the hire took 3–12 months in one founder's account.

39. **Bain Capital Ventures, "Founders: Don't hire AEs until you've figured out how to sell yourselves"** (Joe DiMento, 2026-05-07). https://baincapitalventures.com/insight/founders-dont-hire-aes-until-youve-figured-out-how-to-sell-yourselves/ [practitioner (investor); read 2026-10-05]
    - Portfolio founders hired the first account executive (AE) at roughly $0.5–1.5M ARR, after qualified conversations converted to the next stage consistently.
    - "Don't hire to fix broken sales. If you can't sell your product, neither can an AE."
    - One founder co-sold 3–4 hours a day for three months with new hires; one set the first quota at $500k instead of a typical $1.2M.

### H. Deal tracking

40. **CRM-versus-spreadsheet advice from CRM vendors** (e.g. getcoherence.io, authencio.com) [rule-of-thumb; snippet-only]
    - A spreadsheet is enough under about 30–50 active contacts and one person selling; switch when follow-ups are missed, a second seller joins, or pipeline questions can't be answered quickly.
    - A widely quoted "Nucleus Research: $8.71 return per CRM dollar" comes from vendor-sponsored ROI case studies. Not used.

## What this means

- **Discovery.** Ask more questions, especially follow-ups, and spread them through the call. The best evidence is lab and field psychology (Huang et al.) and a meta-analysis of adaptive selling (Franke & Park). Gong's 11–14 questions is a vendor correlation, not a target. The Mom Test is for learning whether a problem is real; SPIN is for building the cost of the problem in one account; MEDDIC is a checklist for whether a specific deal can close. None has outcome studies outside vendor data.
- **Price and budget.** Gong's data link early budget talk with wins. It is correlational, but it agrees with practitioner advice to qualify on budget early.
- **Demos.** Short monologues and back-and-forth go with won demos [vendor]. No independent demo-to-close data exists; the only figures by contract size come from an untraceable vendor dataset (15–35%).
- **Pilots.** No independent data on paid versus free pilot conversion for start-up vendors. Investor experience says paid pilots with written success criteria convert well (60–90%). Analyst data on internal AI pilots shows most die before production, mainly from unclear value and unready data: write the value test and data access into the pilot.
- **Security.** Standard self-assessment questionnaires exist and are free to answer (CAIQ via CSA STAR Level 1; SIG Lite when the buyer licenses it). SOC 2 Type 2 needs months of evidence. Nothing measures what buyers accept from tiny vendors; practitioners say do SOC 2 when a deal requires it.
- **Negotiation.** First offers anchor outcomes (meta-analysis r ≈ 0.5), less so with expert counterparts. A range with your target at the bottom helps without hurting the relationship. Extreme anchors cost repeat business and cause impasses, which matters for design partners you need as references.
- **Cycles.** Vendor datasets agree that cycles lengthen with deal size (weeks under $15k, months over $100k). Long silences (7+ days with no next step) go with lost deals.
- **Hiring.** No study compares founder-led and hired selling. Practitioner thresholds converge on: a repeatable win rate, 10–20 referenceable customers or about $0.5–1.5M ARR, and the founder as bottleneck.

## Folklore and weak claims

- "McKinsey 2023: structured pilots convert 40–60%"; "Forrester 2023: pilots with success criteria 3.2x more likely to convert"; "Gartner: 78% of enterprise purchases are preceded by a POC". No source found; repeated by content sites.
- "Security review adds 2–6 weeks"; "a trust centre cuts questionnaires 50–70%". Vendor blogs, no data.
- "Top reps ask 4x more Implication questions" and "closing techniques hurt sales over $10k". From SPIN Selling via secondary summaries; proprietary data from the 1970s; not checked against the book.
- "MEDDIC took PTC from $300M to $1B in four years". Training-firm story; growth had many causes.
- The 43/57 "golden talk ratio": Gong's own later data puts winning reps nearer 57% talk.
- "CRM returns $8.71 per dollar" (Nucleus Research): vendor-sponsored case studies.
- Demo-to-close benchmarks (25–30%): one vendor's proprietary mix of CRM data and other reports.

## Open questions

- Paid versus free pilot conversion for start-up vendors, with a definition of "pilot".
- Whether a SOC 2 report, a trust page or a completed CAIQ changes win rate or cycle length for a vendor under ten customers.
- Founder-led versus hired first salesperson, with outcomes (time to $1M ARR, churn of founder-sold versus rep-sold customers).
- Gong-style call data for founder-run calls specifically, and for developer-tool buyers.
- Read the SPIN Selling book and Orr & Guthrie in full; re-try Gartner and HBR when reachable.
