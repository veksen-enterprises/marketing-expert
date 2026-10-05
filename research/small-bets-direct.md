# Small bets: talking to people directly and borrowing other people's audiences

Research date: 2026-10-05. **Not legal advice.**

**Scope.** Cheap, low-risk marketing moves that a small business of any kind can try one at a time, measure on its own, and keep or drop: personal founder emails, calls and free help, answering questions where people already ask them, one-to-one outreach, launch sites, guest spots, small newsletter sponsorships, asking happy users, co-marketing, an own community or newsletter, calendar-timed events, plus twelve shorter bets added later (section 12–23). Each bet lists: what it is and who it fits, **Needs** (what must already exist), **Earliest stage**, cost and time to judge, evidence, rules and risks, measurement and a stop signal, and examples for a developer tool, a hobby/community site, and a local or ecommerce business.

**Stages used below.** 0 = no users yet; 1 = first 1–20 users; 2 = steady use (roughly hundreds of active users or regular traffic); 3 = something newsworthy. Stage assignments are judgment calls unless a source is cited. Money can move some bets earlier (paid newsletter slots, paid creators, sponsorships): see "Cross-cutting: stage, money and buying traffic too early" at the end of the bets.

**Access caveat (2026-10-05).** Pages were fetched directly with a generic browser User-Agent (curl or a fetch tool). `[read 2026-10-05]` = the page or statute text was read; `[read 2026-10-05; abstract]` = only the abstract was read (via Crossref or arXiv metadata); `[snippet-only]` = only search-engine text was seen. stackoverflow.com returned 403, so its help pages were read through Wayback Machine copies dated 2026. OpenAlex and Semantic Scholar were rate-limited. helpareporter.com and discord support pages returned bot checks. Founder case studies are **survivors**: we only hear from launches and emails that worked, and the numbers are self-reported.

**Evidence tags** follow knowledge/_conventions.md: [research] peer-reviewed paper or preprint · [first-party] platform, regulator or statute · [vendor] company with a commercial interest · [practitioner] founder or operator post · [secondary] someone else's summary.

**Already covered elsewhere; cited, not redone:** cold-email law and reply benchmarks (research/partners-referral-outbound.md items 20–28); referral research (same note items 10–19); FTC endorsement and review rules (research/content-social-pr.md items 23–26; partners-referral-outbound item 8); Show HN, Reddit, Product Hunt and Discord rules and app launch cases (research/app-discovery-outside-stores.md items 35–40); HN and tweet effects on GitHub stars and biased launch audiences (research/early-stage-gtm.md items 14, 15, 54–57); self-reported attribution (research/measurement.md items 18–19); community value surveys (research/content-social-pr.md item 17).

## Sources

### Law: when a founder email is "marketing"

1. **Graham, P. "Do Things that Don't Scale."** July 2013. https://paulgraham.com/ds.html — Recruit users by hand; Stripe's "Collison installation" (set the user up on the spot); Wufoo's handwritten thank-you notes; "a level of service no big company can"; act as a consultant to early users. [practitioner] [read 2026-10-05]
2. **FTC, "CAN-SPAM Act: A Compliance Guide for Business."** https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business — Applies to all commercial email, not just bulk; no exception for B2B; the "primary purpose" decides coverage. Three kinds of content: commercial, transactional or relationship, other. Transactional/relationship = completes or confirms an agreed transaction; warranty, recall, safety or security information; changes in a membership, subscription or account; employment information; delivering goods or services already agreed (e.g. updates). Transactional messages must not have false routing information but are "otherwise exempt from most provisions". Mixed messages: if a recipient reading the subject line would likely think it is an ad, it is commercial. No opt-in required; opt-out must be honoured within 10 business days; up to $53,088 per violating email. [first-party] [read 2026-10-05] (penalty also in partners-referral-outbound item 20)
3. **Canada's Anti-Spam Legislation (CASL), S.C. 2010, c. 23**, full text. https://laws-lois.justice.gc.ca/eng/acts/E-1.6/FullText.html — s.1(2): a commercial electronic message (CEM) is one whose purpose, **"or one of its purposes"**, is to encourage participation in commercial activity, judged by content, links and contact information. s.6(1): CEMs need consent plus identification, contact details and an unsubscribe mechanism. s.6(5): the whole section does not apply to messages to people with a personal or family relationship, or to a business consisting solely of an inquiry. s.6(6): only the consent rule (6(1)(a)) is lifted for messages that solely give a requested quote, facilitate/complete/confirm an agreed transaction, give warranty/recall/safety information, give factual information about an ongoing subscription, membership or account, employment information, or deliver product updates the person is entitled to; identification and unsubscribe still apply. s.10(10): "existing business relationship" (implied consent) = a purchase or lease within two years, a written contract current or expired within two years, or an inquiry or application within six months. [first-party] [read 2026-10-05]
4. **ICO, "Electronic mail marketing"** (Guide to PECR). https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/electronic-mail-marketing/ — No marketing email or text to individuals without specific consent, except the "soft opt-in" for people who bought (or negotiated to buy) a similar product and were offered an opt-out at collection and in every message; companies may be emailed, sole traders and some partnerships count as individuals. The same rule covers **direct messages via social media**. Viral marketing: asking people to forward your marketing to friends counts as you "instigating" it; the ICO advises against asking for friends' contact details. Page notes the guidance is under review after the Data (Use and Access) Act. [first-party] [read 2026-10-05]
5. **ICO, "Identify direct marketing"** (Direct marketing guidance). https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/direct-marketing-guidance/identify-direct-marketing/ — Genuine market research is not direct marketing, but research with promotional material, or done to market to the people later, is ("sugging"). Routine service messages are not marketing; if a service message includes promotional elements "even if that is not the main purpose", it counts as marketing. Branding or logos alone do not. Neutral tone does not by itself make a message non-marketing; context matters. [first-party] [read 2026-10-05]
6. **ICO, "Using marketing lists"** (Guide to PECR). https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/using-marketing-lists/ — Bought-in or third-party lists can be emailed only if everyone specifically consented to messages from you; "Generic consent covering any third party will not be enough." [first-party] [read 2026-10-05]
7. **Regulation (EU) 2016/679 (GDPR)**, Recital 47 and Article 21. https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679 — Recital 47: direct marketing "may be regarded as carried out for a legitimate interest", subject to the person's reasonable expectations. Art. 21(2)–(4): an absolute right to object to direct marketing; after an objection the data may no longer be used for it; the right must be brought to the person's attention at the latest at the first communication. [first-party] [read 2026-10-05]
8. **CJEU, Case C-654/23, Inteligo Media SA v ANSPDCP**, judgment of 13 November 2025. https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:62023CJ0654 — An email address collected when a user creates a **free account** (free articles plus a free daily newsletter, with paid articles available) is obtained "in the context of the sale of a product or a service" under ePrivacy Directive Art. 13(2), so the soft opt-in can apply; the newsletter was direct marketing for similar products; where Art. 13(2) applies, the GDPR Art. 6(1) lawful-basis conditions do not apply in addition. [first-party] [read 2026-10-05: operative part]

### Research on personal email, onboarding help, feedback, reviews, communities, thanks

9. **Sahni, N.S., Wheeler, S.C. & Chintagunta, P. "Personalization in Email Marketing: The Role of Noninformative Advertising Content."** *Marketing Science* 37(2):236–258, 2018. doi:10.1287/mksc.2017.1066 — Randomized field experiments with three companies, millions of emails. Adding the recipient's name to the subject line raised opens 20% (9.05% → 10.80%), sales leads 31% (0.39% → 0.51%) and cut unsubscribes 17% (1.2% → 1.0%); similar effects for acquisition and retention emails. Mechanism: more effort spent processing the rest of the message. [research] [read 2026-10-05; abstract]
10. **Retana, G.F., Forman, C. & Wu, D.J. "Proactive Customer Education, Customer Retention, and Demand for Technology Support: Evidence from a Field Experiment."** *Manufacturing & Service Operations Management* 18(1):34–50, 2016. doi:10.1287/msom.2015.0547 — A major public cloud provider, 2011: of 2,673 new customers, 366 got an early engagement offering guidance on basic features. First-week churn halved; 19.55% fewer support questions in week one; 46.57% more accumulated usage over eight months; effects strongest for less experienced customers; direct effects decayed within a week. [research] [read 2026-10-05; abstract]
11. **Turnbull, A. (Groove). "How We Grew Our Customer Exit Survey Responses by 785%."** Groove blog, part of the "Journey to $100K" series (c. 2014; archive copy 30 Nov 2020). https://web.archive.org/web/20201130173215/https://www.groovehq.com/blog/exit-surveys — Multiple-choice cancellation survey: 1.3% completion and unusable data. A plain email asking why they cancelled: 10.2% response with specific bugs and hang-ups. Changing "why did you cancel?" to "what made you cancel?" nearly doubled it to about 19%. [practitioner] [read 2026-10-05] One company, no control period stated.
12. **Groove founder welcome email asking "why did you sign up?", 41% response rate.** Relayed by Zapier (https://zapier.com/blog/groove-blog-content-marketing/) and email-marketing blogs; the original Groove post was not found. [practitioner][secondary][snippet-only]
13. **Burtch, G., Hong, Y., Bapna, R. & Griskevicius, V. "Stimulating Online Reviews by Combining Financial Incentives and Social Norms."** *Management Science* 64(5):2065–2082, 2018. doi:10.1287/mnsc.2016.2715 — Field experiment with a large Chinese online clothing retailer plus an MTurk experiment: payments raised review volume but not length; telling people how many peers had reviewed (a social norm) raised length; both together worked best. [research] [read 2026-10-05; abstract] Note: paying for reviews breaks Google's rules [29] and many platform rules even where it is legal.
14. **Manchanda, P., Packard, G. & Pattabhiramaiah, A. "Social Dollars: The Economic Impact of Customer Participation in a Firm-Sponsored Online Customer Community."** *Marketing Science* 34(3):367–387, 2015. doi:10.1287/mksc.2014.0890 — A multichannel entertainment retailer: joining its online community was followed by a significant, persistent rise in spending, mostly online; posters and well-connected members generated more than lurkers. Observational; authors rule out several alternative explanations. Effect size not seen in the abstract. [research] [read 2026-10-05; abstract]
15. **Algesheimer, R., Borle, S., Dholakia, U.M. & Singh, S.S. "The Impact of Customer Community Participation on Customer Behaviors: An Empirical Investigation."** *Marketing Science* 29(4):756–769, 2010. doi:10.1287/mksc.1090.0555 — Year-long eBay Germany field experiment: a simple email invitation raised community participation, but participation did not raise bids or revenue and **lowered** listings and spending (members became more selective). [research] [read 2026-10-05; abstract of the SSRN version, 10.2139/ssrn.1512072]
16. **Samek, A. & Longfield, C. "Do Thank-You Calls Increase Charitable Giving? Expert Forecasts and Field Experimental Evidence."** *American Economic Journal: Applied Economics* 15(2):103–124, 2023. doi:10.1257/app.20210068 — About 600,000 new donors, 500,000 thank-you calls, six years, public TV stations and a national non-profit: a precisely estimated **null** effect on later giving; fundraisers and the public had forecast about 80% better retention. [research] [read 2026-10-05; abstract of the SSRN version]
17. **Grant, A.M. & Gino, F. "A little thanks goes a long way."** *Journal of Personality and Social Psychology* 98(6):946–955, 2010. doi:10.1037/a0017935 — Lab and field studies on thanks making helpers help more. [research] [not read; metadata only; findings from memory, do not quote figures]

### Q&A sites, forums, code hosts: rules and audience size

18. **Stack Overflow Help Center, "How to not be a spammer."** https://stackoverflow.com/help/promotion (via Wayback copy 24 Jul 2026, https://web.archive.org/web/20260724224538/https://stackoverflow.com/help/promotion) — Answers that sometimes mention your product are fine; **you must disclose your affiliation** whenever you mention your product or site; don't answer only questions your product solves; show a solution, don't just assert one; links only to support the answer; "If the only reason you're here is to sell something", don't post answers. [first-party] [read 2026-10-05, Wayback copy; live page 403]
19. **Stack Overflow Help Center, generative AI policy.** https://stackoverflow.com/help/gen-ai-policy (Wayback copy 2 Oct 2026) — Content generated in part or whole by LLMs may not be posted; it is likely to be deleted with its reputation; repeated cases can lead to suspension. [first-party] [read 2026-10-05, Wayback copy]
20. **del Rio-Chanona, R.M., Laurentsyeva, N. & Wachs, J. "Large language models reduce public knowledge sharing on online Q&A platforms."** *PNAS Nexus* 3(9), 2024. doi:10.1093/pnasnexus/pgae400 — Within six months of ChatGPT's release, Stack Overflow activity fell 25% relative to Russian and Chinese counterparts and to maths forums; a lower bound; larger for the most-used languages. [research] [read 2026-10-05; abstract]
21. **GitHub, "GitHub Acceptable Use Policies."** https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies — Section 7: you may not use information from GitHub (scraped, via the API or otherwise) "for spamming purposes, including for the purposes of sending unsolicited emails to users". Section 4 bans bulk promotion, inauthentic interactions and rank abuse (automated starring or following). Section 10: promotional content allowed in limited form; you are responsible for FTC endorsement rules. [first-party] [read 2026-10-05]
22. **Hacker News Guidelines.** https://news.ycombinator.com/newsguidelines.html — "Please don't use HN primarily for promotion. It's ok to post your own stuff part of the time"; don't solicit upvotes or comments; don't post generated or AI-edited text; don't automate posting. [first-party] [read 2026-10-05] (Show HN rules: app-discovery-outside-stores item 35.)
23. **Reddit Rules**, Rule 2. https://redditinc.com/policies/reddit-rules — participate authentically "in communities where you have a personal interest"; no spam or content manipulation. [first-party] [read 2026-10-05] (also app-discovery-outside-stores item 36; Reddit Help "Spam" and the "10% rule" in content-social-pr item 15, snippet-only)
24. **Lobsters, "About."** https://lobste.rs/about — Authors welcome, but not as "a write-only tool for product announcements"; rule of thumb: self-promotion should be **less than a quarter** of one's stories and comments; invite-only; new users (first 70 days) cannot submit links to domains never seen before. [first-party] [read 2026-10-05]
25. **Baltes, S. & Diehl, S. "Worse Than Spam: Issues in Sampling Software Developers."** ESEM 2016. doi:10.1145/2961111.2962628 ; arXiv:1707.00838 — Researchers emailing developers at addresses taken from GitHub profiles received a complaint from a developer who got such emails weekly, had answered about 30, and after several hundred considered them worse than spam (spam filters at least catch spam). Authors: heavily contacted developers stop responding, biasing samples; contacting via public media was the most effective strategy. [research] [read 2026-10-05; full text]

### Launch sites

26. **BetaList, "Support & FAQ."** https://betalist.com/faq — All submissions are now paid (no free option); full automatic refund if not selected; plans differ by speed and guaranteed newsletter inclusion; pre-launch or recently launched startups with own domain only; featured once (again at launch if first featured pre-launch); do-follow link; UTM parameters added automatically (source "betalist"). Prices shown only in the submission form (not seen). [first-party] [read 2026-10-05]
27. **DevHunt, "About."** https://devhunt.org/about — A launch site for developer tools started as a fairer alternative to Product Hunt; site ads at $149/week. Submission terms not read. [first-party] [read 2026-10-05]
28. **Kim, H., Kang, H. & Song, J. "Generative AI Fuels Solo Entrepreneurship, but Teams Still Lead at the Top."** arXiv:2605.10291, May 2026 — 160,000+ Product Hunt launches: entry rose sharply after ChatGPT-3.5, mostly solo founders and low-commitment experiments; teams increasingly dominate the top of the rankings. [research; preprint] [read 2026-10-05; abstract] Implication: more launches compete for the same daily slots.
29. **Sharma, A.P. "The Discovery Gap: How Product Hunt Startups Vanish in LLM Organic Discovery Queries."** arXiv:2601.00912, Jan 2026 — 112 startups from the 2025 Product Hunt top 500, 2,240 queries: named queries recognised 99.4% (ChatGPT) and 94.3% (Perplexity); discovery-style queries surfaced them 3.32% and 8.29%. For Perplexity, referring domains (r = +0.319) and Reddit presence (r = +0.395) correlated with visibility. [research; preprint; single author; small n; correlational] [read 2026-10-05; abstract]

### Newsletters: prices published by publishers

30. **Web Tools Weekly, "Advertise."** https://webtoolsweekly.com/sponsor — 15,538 subscribers, 31.0% average open rate, 5.5% click rate (recent quarter). Top ad combo $175 (publisher's estimate 50–100 unique clicks); paid product review $375 (150–300); middle image ad $50 (20–50); two text links $30 (10–30); classified $10 (10–25); free ad swaps for newsletters with 3,000+ subscribers. [first-party, publisher's own estimates] [read 2026-10-05]
31. **This Week in React, "Sponsor"** (updated June 2026). https://thisweekinreact.com/sponsor — 40,297 subscribers, 56% open rate, 11% click rate. 1st sponsor €1,500 per issue (€5,000 for four); 2nd sponsor €800 (€2,200 for four); four sponsored links €1,600 (React) or €600 (React Native). The publisher warns that open rates are unreliable (Apple Mail privacy, Gmail clipping) and clicks can be inflated by corporate security bots; recommends advertisers use their own tracking links. Single issues cost more per issue because of fixed sales and admin time. [first-party] [read 2026-10-05]
32. **Cooperpress, "Advertise."** https://cooperpress.com/advertise/ — Weekly developer newsletters (including a Postgres title) to 450,000+ developers; "net open rates of 35%-60%"; waiting list, quarterly reservations; prices only in the media kit (not read); a classified-ad builder exists, 200 characters. [first-party] [read 2026-10-05; page last updated October 2021 / March 2025]
33. **Newsletter rate "guides"** (e.g. sponsorgap.com, newsletrix.com, business.daily.dev) — claims such as "developer newsletters $25–$150 CPM" or "under 5,000 subscribers $50–$250 per placement". No method shown; often sellers of sponsorship tools. [vendor][snippet-only] Used only to say the range is unsourced.

### Reviews, own community and newsletter tools

34. **Google Maps User Contributed Content Policy, "Fake engagement."** https://support.google.com/contributionpolicy/answer/7400114 — Merchants may not offer incentives (payment, discounts, free goods or services) for any review, discourage negative reviews, **or selectively solicit positive reviews**; must not pressure customers on the premises or ask for specific content; no staff quotas. [first-party] [read 2026-10-05]
35. **Slack, "Slack plans and features."** https://slack.com/help/articles/7050776459923 — Free plan: 90-day access to message and file history; content older than a year is permanently deleted; huddles one-to-one only; 10 integrations. [first-party] [read 2026-10-05]
36. **Buttondown, "Pricing"** (https://buttondown.com/pricing) and **beehiiv, "Pricing"** (https://www.beehiiv.com/pricing) — Buttondown free for the first 100 subscribers, add-ons $9–$79/month. beehiiv has a free plan ("free forever"; subscriber cap not shown on the page as read), paid tiers from $49/month billed yearly. [first-party] [read 2026-10-05]

### Extra bets (sections 12–23)

37. **Hacker News, "Ask HN: Who is hiring? (October 2026)"** header text (via the HN Algolia API). https://news.ycombinator.com/item?id=49922569 — Post only if you are personally part of the hiring company; one post per company; "If it isn't a household name, explain what your company does"; only post if actively filling a position and committed to replying. [first-party] [read 2026-10-05]
38. **HARO relaunch** — Featured.com bought Help a Reporter Out from Cision in early 2025 and relaunched it on 22 April 2025 as free for sources and journalists, funded by sponsorship, with three email digests a day; alternatives include Qwoted, Source of Sources, Help a B2B Writer and the #journorequest tag. From BuzzStream's interview with the new owner and other relays; helpareporter.com blocked the fetch. [secondary][snippet-only]
39. **DigitalOcean, "Write for DigitalOcean."** https://www.digitalocean.com/community/pages/write-for-digitalocean — $400 per new tutorial on publication, about $100 for updates, plus a $25 donation to a charity the author picks; the older Write for DOnations programme paid $300. [first-party] [read 2026-10-05] A public price point for paid technical tutorials.
40. **Raider, J. (Harry's), "How to Gather 100,000 Emails in One Week."** The Blog of Tim Ferriss, 21 Jul 2014. https://tim.blog/2014/07/21/harrys-prelaunchr-email/ — One-week pre-launch referral microsite: 100K+ emails (85K+ judged valid); 77% came via referral (about 20K people referred about 65K); 200+ people referred 50+ friends; tiered free-product rewards at 5, 10, 25, 50 referrals; seeded by a couple of hundred people the founders had met over months; IP limits to fight fake sign-ups. [practitioner] [read 2026-10-05] One famous success; consumer product with prizes; pre-GDPR.
41. **AppSumo, "Launch your SaaS with AppSumo."** https://sell.appsumo.com/ — No upfront cost; revenue share "negotiated"; about 10% of applicants accepted; claims 1.5M subscribers; campaigns about 60 days; "average performer" $40K–$80K per 60-day campaign (based on the top 50% of partners in each category, i.e. the median is not shown); lifetime deals not required except for "AppSumo Radar"; wants working products, a support plan, and an audience of small businesses, marketers, creators and agencies; consumer-only products not a fit. [vendor] [read 2026-10-05]
42. **Lifetime-deal economics posts** (e.g. autoposting.ai "AppSumo Review 2026"; f3fundit.com) — claims such as "a $59 buyer yields $17.70 to the company" and "$15–30/month support cost per user"; buyer complaints about tools that shut down. No method or source. [vendor/practitioner][snippet-only] Used as folklore only.

## Bets

### 1. Personal emails to every new sign-up, payer and canceller

**What and who.** The founder writes a short, plain-text email from their own address to each new sign-up, each new payer and each person who cancels, asking one question, and replies to every answer by hand [1, practitioner]. Fits anything with an email at sign-up or checkout: SaaS, devtools, apps with accounts, ecommerce, services. Weak fit for anonymous products (no email) and for very high volume (hundreds a day), where it becomes a template.
- **Needs:** a sign-up or purchase flow that captures email, a few new users a week, and founder time. No audience or money. Minimum: about one new person a week to be worth a habit (judgment call).
- **Earliest stage:** 1 (first 1–20 users). Useful through stage 2 for payers and cancellers.
- **Cost and time to judge:** money 0. About 5–10 minutes per email plus replies. Judge after 20–30 emails or four weeks.

**Evidence.**
- Personal touch on email works in randomized tests, but the tested effect is small and comes from bulk marketing, not founder notes: adding the recipient's name to the subject line raised opens 20%, leads 31%, and cut unsubscribes 17% [9, research].
- Early hands-on help to new customers halved first-week churn and raised eight-month usage 47% at a cloud provider [10, research]. That was a guidance session, not an email; closest causal evidence that early personal contact pays.
- Reply rates: Groove's plain cancellation email got 10.2% replies, rising to about 19% when "why did you cancel?" became "what made you cancel?", versus 1.3% for a multiple-choice survey [11, practitioner]. Groove's "why did you sign up?" welcome email is widely quoted at 41% replies [12, secondary, snippet-only]. Both are one company, survivorship applies.
- "Do things that don't scale" as advice rests on founder stories (Stripe, Wufoo, Airbnb) [1, practitioner]; knowledge/first-customers.md already carries it as [practitioner].
- Caution on what you learn: early users are a biased sample, and acting on a self-selected group's feedback can hurt when that group does not resemble the market (research/early-stage-gtm.md items 14, 15).

**What to ask.** One question, answerable in one line [11, practitioner; question wording is otherwise judgment]:
- New sign-up: "What made you sign up today? What were you using before?"
- New payer: "What made you decide to pay? What almost stopped you?"
- Canceller: "What made you cancel?" (the wording Groove found doubled replies [11]). Do not add a win-back offer in the same email (see law below).
- Then: reply personally; tag each answer; record the words people use (for copy).

**Rules (anti-spam and privacy).** Not legal advice; summary of primary texts.
- **US, CAN-SPAM:** decided by the email's primary purpose. A note confirming an account or asking about the user's experience is at most transactional/relationship or "other" content, and transactional messages are exempt from most rules [2, first-party]. If the subject line reads like an ad (e.g. "20% off your upgrade"), it is commercial: identify it, give a postal address and opt-out, honour opt-outs in 10 business days [2]. No opt-in needed in the US.
- **Canada, CASL:** stricter. A message is commercial if encouraging commercial activity is **one of** its purposes [3]. A pure feedback question with no offer and no upsell links is arguably not a CEM; a "want to upgrade?" line makes it one. CEMs need consent: a purchase gives implied consent for two years; an inquiry or application for six months [3, s.10(10)]. Whether a free sign-up counts as an "inquiry or application" is not settled in the statute text read; treat free sign-ups as six-month implied consent at most, or ask for express consent at sign-up (judgment). Any CEM, even with consent, needs sender identification and an unsubscribe mechanism [3, s.6(2)]. Messages that solely confirm a transaction or give factual account information skip consent but not identification/unsubscribe [3, s.6(6)].
- **UK, PECR + UK GDPR:** genuine feedback or research is not direct marketing; it becomes marketing if it contains any promotional element, even as a side purpose [5]. Marketing to individuals needs consent or the soft opt-in (bought or negotiated to buy a similar product, opt-out offered at collection and in every message) [4]. Corporate addresses can be marketed to without consent [4]; sole traders cannot.
- **EU, ePrivacy + GDPR:** the CJEU held that a free account that is part of a freemium offer counts as "the context of a sale", so the soft opt-in can cover marketing to free users about similar products, if an opt-out was offered at collection and in each message [8]. GDPR: direct marketing can rest on legitimate interest [7, Recital 47]; the right to object is absolute and must be stated by the first communication at the latest [7, Art. 21].
- **Practical safe pattern (judgment, built on [2]–[8]):** keep founder emails to a question, no offer; send from a real address that accepts replies; add one line "reply 'stop' and I won't email again" and keep a do-not-email list; tell users at sign-up that the founder may email them. Keep win-back offers for a separate email that follows the marketing rules.
- **Reputational risk:** fake "personal" automation (merge fields pretending to be hand-written) can be noticed; people trust messages less when told AI wrote them (partners-referral-outbound items 26–27, research).

**Measure and stop.** Reply rate (replies ÷ emails sent), share of replies with a usable reason, and for payers or cancellers, whether answers change the product or copy. Track cohort retention of emailed vs not-emailed only if volume allows a random split. Stop or template it when replies fall under about 5% for a month, or volume exceeds about 20 a day (judgment).

- **Devtool example:** email each new CI or agent-integration user: "What query or slowdown made you try this?"; email each repo that removes the integration: "What made you remove it?"
- **Hobby site example:** message each new account (or each person who joins the Discord) asking which items or trades they came to look up; follow up when someone stops listing trades.
- **Local or ecommerce example:** a shop owner emails each first-time buyer: "What made you order from us rather than [marketplace]?"

### 2. Onboarding calls, white-glove setup, free audits or office hours

**What and who.** Offer each new user a short call or screen-share where you set the product up with them, or offer a free expert review (e.g. a team's slowest queries, a shop's product pages) as a way in. Fits B2B, devtools, services, complex setup; weak fit for cheap consumer apps where a call costs more than the customer is worth.
- **Needs:** founder expertise that a user values, a booking link, and new users or inbound interest. For audits: access to the prospect's data or a public artefact to review. Minimum: one booked call a week (judgment).
- **Earliest stage:** 1. Free audits/office hours as lead generation can start at 0 if the founder has expertise and a place to announce them.
- **Cost and time to judge:** money 0–small (scheduling tool). 30–60 minutes per call plus prep. Judge after 10 calls.

**Evidence.**
- Field experiment: a proactive guidance session for new cloud customers halved first-week churn, cut first-week questions by 19.55% and raised eight-month usage by 46.57%; effects strongest for less experienced customers [10, research; one provider, 2011].
- Stripe's "Collison installation" and Viaweb building stores for merchants [1, practitioner].
- Free audits and office hours as lead generators: no research or platform data found; anecdote only.

**Rules and risks.** Handling a prospect's data in an audit makes you a processor or controller under GDPR (judgment; get written permission and delete afterwards). Do not upsell inside a "free review" email to Canadian or UK individuals without consent [3][5]. Risk: calls do not scale and can hide a product that is too hard to use alone; record each setup step you did by hand and fix it in the product.

**Measure and stop.** Calls booked ÷ offered; activation and 30-day retention of called vs not-called users (compare, or alternate weeks); audits → paid conversion. Stop when called users retain no better than others, or when you repeat the same setup steps (automate them instead).

- **Devtool example:** "Send me your three slowest queries; I'll review the plans on a 30-minute call." Or set up the CI check in the user's repo with them.
- **Hobby site example:** office hours in the Discord voice channel at the season start, helping people price items or set up trade alerts.
- **Local or ecommerce example:** a free 15-minute fitting or setup call after purchase for a product people often return.

### 3. Answering questions where the problem is already discussed

**What and who.** Find questions about the problem on Stack Overflow, Reddit, Discord servers, GitHub issues of nearby projects and forums, and answer them fully; mention your product only when it is truly the answer, and disclose that you made it. Fits devtools, hobby communities, niche B2B, local trades with active forums.
- **Needs:** founder expertise and time; a place where the problem is already discussed. No users needed. Minimum: a few relevant new questions a week (judgment).
- **Earliest stage:** 0.
- **Cost and time to judge:** money 0. 3–5 hours a week. Judge after 8–12 weeks (answers keep getting search traffic later).

**Evidence.**
- No study measured sign-ups from answering. Nearest: GitHub attention research (tweets about one star each; HN posts tens of stars) in research/early-stage-gtm.md items 54–57 [research, weak for sign-ups].
- Audience is shrinking on Stack Overflow: activity fell 25% within six months of ChatGPT, a lower bound [20, research].
- Community presence correlated with LLM visibility for launched products (Reddit, r = +0.395) [29, preprint, correlational]; answers can therefore also feed AI assistants, unproven.

**Rules on self-promotion.**
- Stack Overflow: disclose affiliation every time; don't only answer questions your product solves; solve the problem in the answer itself; links only to support it [18, first-party]. No LLM-written content [19].
- Reddit: participate authentically in communities you have a personal interest in; each subreddit sets its own promotion rules; the "10% rule" is used by some communities only [23; content-social-pr item 15].
- Hacker News: own stuff "part of the time"; no generated text [22]. Lobsters: under a quarter of activity self-promotion [24].
- Discord: no unsolicited bulk messages; each server has its own rules (app-discovery-outside-stores item 38).
- GitHub issues of other projects: bulk or inauthentic promotion is banned [21]; maintainers decide what is off-topic (judgment: answer the issue first, link only if it solves it).
- FTC: if you post about your own product, the connection must be disclosed (content-social-pr item 24; partners-referral-outbound item 8).
- Risk: one spam flag can sink an account and the product's name in that community.

**Measure and stop.** Tagged links in answers (UTM, e.g. `utm_source=stackoverflow&utm_medium=answer`), a "how did you hear about us?" field (measurement items 18–19), upvotes/accepted answers. Stop a venue after 8 weeks with no referral visits or mentions in the sign-up field.

- **Devtool example:** answer "why is this Postgres query slow?" threads with the actual plan analysis; mention the tool only when the user asks how to catch it in CI.
- **Hobby site example:** answer "what is this item worth?" posts with the price history; link the item page.
- **Local or ecommerce example:** a bike shop answers repair questions in a city subreddit and local forums, signed with the shop's name.

### 4. Cold, personal one-to-one outreach to clearly fitting people

**What and who.** Write individually to a small number of people who visibly have the problem (an issue they opened, a post they wrote), referring to it specifically. Fits B2B, devtools, services; a hobby site rarely needs it.
- **Needs:** a way to see who has the problem (public issues, posts, job ads) and a product or offer that solves it now. Minimum: a list of 20–50 clearly fitting people (judgment).
- **Earliest stage:** 0 (to find first users) or 1.
- **Cost and time to judge:** money 0. 15–30 minutes per message to research and write. Judge after 30–50 messages.

**Evidence.**
- Bulk cold email benchmarks: 3.43% average reply per email (Instantly) and 0.45% (Belkins), both vendor data (partners-referral-outbound items 24–25). Tiny, specific outreach should do better, but no study isolates it; personalization raises engagement even when non-informative [9, research].
- Developers who are contacted often stop responding, and one called repeated GitHub-sourced emails worse than spam [25, research]. Contacting through public channels worked best for those researchers.

**Rules and risks.**
- **GitHub:** using information from GitHub (scraped, API or otherwise) to send unsolicited emails counts as a spamming purpose under its Acceptable Use Policies [21, first-party]. Practical reading (judgment): don't harvest emails from GitHub profiles or commits; contact maintainers through the channel they invite (issue, discussion, listed contact for business enquiries).
- **Law:** CAN-SPAM covers one-to-one commercial emails, no exception for B2B [2]. UK: corporate addresses OK without consent, individuals and sole traders not [4]; social media DMs follow the same email rules [4]. Canada: implied consent from a conspicuously published address only if no "no CEMs" statement and the message is relevant to the person's role (partners-referral-outbound item 22). EU rules vary by country (same note item 23).
- Platforms: Discord bans unsolicited bulk DMs (app-discovery-outside-stores item 38); Reddit Rule 2 [23].

**Measure and stop.** Replies, calls booked and trials per message; log each message. Stop after 50 messages with fewer than 3 positive replies, or at the first complaint about method.

- **Devtool example:** comment on a nearby project's open issue about slow migrations with a concrete diagnosis, then offer the tool if it fits; email only where the maintainer lists a business contact.
- **Hobby site example:** DM the moderator of a trade server (not its members) offering a free price lookup bot.
- **Local or ecommerce example:** a caterer emails the office manager of five nearby companies whose job ads mention team lunches.

### 5. Launch sites: Product Hunt, Show HN, subreddits, BetaList and similar

**What and who.** Post the product once on sites built for launches. Fits web products, devtools, apps; poor fit for local services (Product Hunt excludes services [app-discovery item 37]) and for anything that needs a sign-up to try (Show HN asks for no barriers [app-discovery item 35]).
- **Needs:** a working product people can try now; a page that converts; ideally a few early users to comment honestly. BetaList takes pre-launch products [26].
- **Earliest stage:** 1 (0 for BetaList's pre-launch slot).
- **Cost and time to judge:** Product Hunt and Show HN free; BetaList paid (refund if not selected; price not seen) [26]; DevHunt ads $149/week [27]. One to two days of preparation and a day of replies. Judge within a week.

**Evidence.**
- App cases: HN No. 1 gave 4,500 installs in two days; Reddit posts gave hundreds to thousands; Product Hunt gave nothing measurable for one solo developer (app-discovery-outside-stores items 39–40, practitioner).
- HN posts that get traction bring tens of GitHub stars; uncontrolled, selected on success (research/early-stage-gtm.md items 56–57).
- Launch audiences are biased: Product Hunt is about nine in ten men; women-focused products grew less after launch (early-stage-gtm item 14, research).
- More competition: Product Hunt entry surged after ChatGPT, mostly low-commitment solo launches [28, preprint].
- A good Product Hunt rank does not make LLMs recommend you for discovery queries (3–8% surfaced) [29, preprint].

**Rules.** Show HN: no landing pages, no sign-up walls, no quickly generated one-offs, no asking friends to upvote (app-discovery item 35). HN: no vote solicitation [22]. Product Hunt: no company accounts, editorial featuring (app-discovery item 37). Subreddits: each sets promotion rules [23]. Lobsters: invite-only; new users cannot submit unseen domains [24].

**Measure and stop.** UTM per site (BetaList adds its own) [26]; sign-ups and week-1 retention of each launch cohort vs organic. A launch is one-shot; judge "was it worth a second site?" after the first two.

- **Devtool example:** Show HN with a live demo on a public sample database, no sign-up; DevHunt the same week.
- **Hobby site example:** post in the game's subreddit at a season start (if its rules allow tools) rather than on Product Hunt.
- **Local or ecommerce example:** mostly a poor fit; a niche maker shop could use a relevant subreddit's "show your work" thread.

### 6. Guest spots: podcasts, streams, meetups, small talks, guest posts

**What and who.** Appear in front of someone else's audience: a niche podcast, a streamer's show, a local meetup talk, a small conference, a guest post in a newsletter or blog. Fits founders with expertise; B2B, devtools, local services (meetups), hobby communities (streams).
- **Needs:** expertise or a story worth hearing; for conference talks, usually a track record. A product people can try afterwards. Hosts rarely want a founder with nothing to show (judgment).
- **Earliest stage:** 1 for meetups and small podcasts; 2–3 for conferences and bigger shows.
- **Cost and time to judge:** money 0 (travel for talks). Pitch and prep 3–10 hours each. Judge after 3–5 appearances; podcasts have long tails.

**Evidence.** No research or platform data on guest appearances driving sign-ups was found; anecdote only. Indie Hackers podcast episode download counts exist but say nothing about guests' sign-ups (search result only).

**Rules and risks.** Guest posts: links in guest posts meant to pass ranking credit are a link scheme under Google's spam policies; use rel="sponsored"/"nofollow" if paid (content-social-pr item 22). Disclose if you paid for a spot (FTC, content-social-pr item 24).

**Measure and stop.** A unique URL or code per appearance; "how did you hear about us?" field (measurement item 18). Stop after five appearances with no attributable sign-ups.

- **Devtool example:** a 20-minute talk at a local Postgres meetup showing three real slow-query fixes.
- **Hobby site example:** join a streamer's season-start stream to walk through item prices.
- **Local or ecommerce example:** a guest post in the neighbourhood newsletter; a talk at the local business association.

### 7. Small sponsorships in niche newsletters

**What and who.** Pay for a slot in a newsletter your audience reads. Fits devtools, B2B, ecommerce niches, hobby niches with newsletters.
- **Needs:** money (tens to low thousands per slot), a landing page that converts, and ideally proof the product keeps people (see cross-cutting section). No users strictly needed; money moves this earlier.
- **Earliest stage:** 1–2 (money can make it 0, at the risk of buying traffic before retention).
- **Cost and time to judge:** published prices: $10 classified to $375 review in a 15.5K-subscriber dev newsletter [30]; €600–€1,500 per issue in a 40K-subscriber one [31]. Hours: 1–2 per slot. Judge after 2–3 slots (one slot is noise).

**Evidence.** Only publisher-stated data: Web Tools Weekly estimates 10–300 unique clicks depending on slot [30]; This Week in React reports 56% opens, 11% clicks, and warns both are unreliable [31]. No independent study of niche newsletter ad effectiveness found. Rate "guides" giving CPM ranges cite no method [33].

**Rules and risks.** Ad copy must be truthful; the newsletter labels it sponsored. Click counts are inflated by email security bots [31]. Risk: buying clicks before the product retains them.

**Measure and stop.** Own tracking link per slot (the publisher recommends it [31]), sign-ups and paid conversions per slot, cost per activated user. Stop if two slots each bring under about 5 activated users per $100 or your own target (judgment).

- **Devtool example:** a $10–$50 classified in a database or developer newsletter before any larger slot.
- **Hobby site example:** a fan newsletter or a community site's weekly digest, often for free or a small fee.
- **Local or ecommerce example:** the local paper's or neighbourhood association's email.

### 8. Asking happy users directly for a referral, review, testimonial or share

**What and who.** Ask users who just had a good result for one specific thing: an introduction, a public review, a quote you may use, or a share. Fits everything.
- **Needs:** users who are actually happy (a recent success moment) and a place for the review or quote. Minimum: a handful of active users (judgment).
- **Earliest stage:** 1 (testimonials, intros); 2 for review-site volume.
- **Cost and time to judge:** money 0. Minutes per ask. Judge after 20 asks.

**Evidence.**
- Referred customers are worth more (CLV at least 16% higher in a bank) and better matched; rewards help most for weak ties and weak brands (partners-referral-outbound items 10, 11, 14, research). Heaviest buyers are not always best referrers (item 12).
- Reviews: payments raise review volume; telling people how many peers reviewed raises review length; both together worked best [13, research]. Payments are banned by Google and risky elsewhere (below).
- Ask at moments of value (knowledge/referral-programs.md, practitioner).

**Rules.**
- Google: no incentives of any kind for reviews, no discouraging negatives, **no selectively asking only happy customers** ("review gating") [34]. So for Google reviews, ask everyone, not only the happy ones.
- FTC Consumer Reviews Rule: no fake reviews, no incentives conditioned on sentiment, no undisclosed insider reviews, no review suppression (content-social-pr items 25–26).
- Testimonials: get written permission to use a name and quote (personal data under GDPR; judgment). Paid or incentivised endorsements must be disclosed (partners-referral-outbound item 8).
- Asking users to forward your marketing email to friends makes you responsible for it under PECR; the ICO advises against asking for friends' addresses [4].

**Measure and stop.** Asks sent → reviews/quotes/intros received; referred sign-ups via a personal link or the "how did you hear" field. Stop asking a user after one reminder.

- **Devtool example:** after a user's first caught regression, ask for a two-line quote for the docs and an intro to one other team that uses Postgres.
- **Hobby site example:** ask active traders to mention the site when they post price checks.
- **Local or ecommerce example:** a printed card in every order asking for a Google review (all customers, no discount).

### 9. Co-marketing with adjacent tools or creators

**What and who.** Team up with a non-competing product or creator who serves the same people: a joint guide, webinar, integration announcement, bundle or cross-mention. Fits B2B, devtools (integrations), ecommerce (bundles), hobby sites (fan creators).
- **Needs:** something the partner gains (an integration, an audience, content); usually some traction of your own, or partners won't bother (judgment). An integration or shared use case.
- **Earliest stage:** 2 (1 if the partner is equally small or the integration is useful by itself).
- **Cost and time to judge:** money 0–small; 10–30 hours per joint project. Judge per project.

**Evidence.** Partner involvement correlates with higher B2B win rates in a vendor's network (+11.7% on average; correlational) (partners-referral-outbound item 1, vendor). Endorsement by prominent partners helps new ventures most when quality is hard to judge (early-stage-gtm item 30, research; biotech, not small co-marketing). No study of small co-marketing projects found; anecdote only.

**Rules and risks.** Do not swap or share email lists: consent must name the specific sender, and generic third-party consent is not enough in the UK [6]; under GDPR, sharing attendee lists needs a lawful basis and transparency (judgment). Each partner emails its own list. Disclose paid creator partnerships (content-social-pr item 24).

**Measure and stop.** A distinct link per partner; sign-ups and activation from it. Stop after a project brings less than a set number of activated users for the hours spent.

- **Devtool example:** a joint post with an ORM or migration tool on catching slow queries in CI, each sending to its own list.
- **Hobby site example:** a fan wiki or build-guide creator links item pages; the site links their guides.
- **Local or ecommerce example:** a bakery and a coffee roaster sell a joint weekend box.

### 10. Starting your own community (Discord or Slack) or newsletter

**What and who.** Run a Discord, Slack or forum for users, or a newsletter. Fits hobby/community products (the community may be the product), devtools, creators; weak for one-off purchases.
- **Needs:** enough active people to make a room feel alive, and a founder who will show up weekly. Judgment: an empty server hurts more than none, so start once a few users already talk to you (stage 2), or seed it with an existing group. A newsletter needs something to say regularly.
- **Earliest stage:** 2 for a community (1 if the product already lives in a community); 1 for a newsletter.
- **Cost and time to judge:** tools mostly free: Discord free; Slack free plan keeps only 90 days of history and deletes content older than a year [35]; Buttondown free to 100 subscribers, beehiiv free tier [36]. Time: 2–5 hours a week, ongoing; moderation grows with size. Judge after 3 months.

**Evidence.**
- Joining a firm's community was followed by higher spending at a retailer (observational) [14, research], but in eBay's randomized invitation, participation did not raise revenue and lowered listings and spending [15, research]. Mixed.
- Only 24% of community professionals can confidently quantify community value (content-social-pr item 17, vendor survey).
- Feedback from a self-selected community helps only if it resembles the market (early-stage-gtm item 15).

**Rules and risks.** Discord community guidelines and app rules (community-and-hobby-products items 5–8); moderation and code of conduct (knowledge/organic-social-and-community.md). Newsletter: consent/soft opt-in as in bet 1 [4][8]. Risk: a dead server signals a dead product; time cost never ends.

**Measure and stop.** Weekly active members, share of questions answered by members (not you), retention of members vs non-members. Stop or archive if weekly active members stay under about 10 after three months (judgment).

- **Devtool example:** skip a dedicated Discord early; use GitHub Discussions where users already are.
- **Hobby site example:** the Discord is the product's source and its community; add channels for price checks and site feedback.
- **Local or ecommerce example:** a monthly email to past customers (soft opt-in applies to buyers [4]).

### 11. Events tied to the audience's calendar

**What and who.** Time a launch, post, feature or offer to a moment the audience already cares about: a game's season reset, a framework or database release, a conference week, a holiday. Fits hobby sites, devtools, ecommerce, local services.
- **Needs:** knowing the audience's calendar; something ready on that date. Works best with some existing audience to tell (judgment).
- **Earliest stage:** 1.
- **Cost and time to judge:** money 0. Preparation 5–20 hours. Judge after the event (compare to the same window without it).

**Evidence.** No research found on timing small launches to audience events; anecdote only. Attention spikes are short-lived and newcomers from spikes tend to be shallow (early-stage-gtm item 55, research).

**Rules and risks.** Game publishers restrict commercial use of their content and names (community-and-hobby-products items 10, 13). Don't misuse a conference's or project's trademark to imply endorsement.

**Measure and stop.** Sign-ups and active users in the event window vs the same period before; UTM per post. Stop if two events show no lift.

- **Devtool example:** publish "what changes in the new Postgres major version for query plans" on release day, with a check the tool runs.
- **Hobby site example:** ship price history for new season items on reset day.
- **Local or ecommerce example:** a garden centre's frost-date reminder email.

### 12. Pull requests and docs fixes to nearby open-source projects

**What:** fix real bugs or docs in projects your users use, as credibility. Devtools only. **Needs:** coding skill, time. **Earliest stage:** 0. **Cost:** hours per PR; judge after 3 months.
**Evidence:** startups engaging with open-source communities were linked to better funding outcomes (early-stage-gtm item 52, research; funding, not customers). No evidence on customers; anecdote only. **Rules:** GitHub bans inauthentic activity and bulk promotion [21]; don't add product links to others' docs unless maintainers ask. **Measure:** profile visits, mentions; stop if unmerged after several attempts. **Devtool example:** fix an incorrect index example in a popular ORM's docs. **Hobby site example:** contribute to an open data project for the game's items. **Local/ecommerce:** not a fit.

### 13. Giving community moderators a tool they need

**What:** build a small bot or tool for the moderators of a community where your users gather. Fits hobby/community and devtools. **Needs:** knowing a moderator pain; ability to build it. **Earliest stage:** 0. **Cost:** days of building, then maintenance; judge after 2 months.
**Evidence:** anecdote only. **Rules:** Discord app and data rules (community-and-hobby-products items 5–8); privileged data needs justification. Risk: maintenance burden, and moderators can drop it. **Measure:** servers using it, referrals from it. **Devtool example:** a bot that formats EXPLAIN output in a database community's chat. **Hobby site example:** a price-check bot for a trade server. **Local/ecommerce:** not a fit.

### 14. Small sponsorships: community tournament, season event, open-source maintainer

**What:** pay a small amount to sponsor a community event or a maintainer. **Needs:** money ($ tens to hundreds; judgment) and a credible audience fit. **Earliest stage:** 1 (money moves it earlier). **Cost:** money plus little time; judge per event.
**Evidence:** none on effect; anecdote only. GitHub Sponsors takes no fee from personal accounts, up to 6% from organisations; most maintainers are unpaid (community-and-hobby-products items 17, 20). **Rules:** game publishers restrict commercial tournaments and sponsorship of fan content (community-and-hobby-products items 10, 13); disclose sponsorships. **Measure:** link or code per sponsorship. **Devtool example:** sponsor the maintainer of a Postgres extension your users rely on. **Hobby site example:** prize for a season-start community race. **Local/ecommerce:** sponsor a youth team or local run.

### 15. Answering journalists' source requests (HARO, Qwoted and similar)

**What:** reply to reporters' requests for expert sources. Fits founders with expertise, B2B, local experts. **Needs:** real expertise and fast replies; a quote alone does not need users, but coverage rarely drives sign-ups for an unknown product (judgment). **Earliest stage:** 1. **Cost:** HARO free again since April 2025 [38, snippet-only]; 2–4 hours a week; judge after 2 months.
**Evidence:** 86% of journalists say some work began with a PR pitch; 73% reject irrelevant pitches (content-social-pr items 19–20, vendor). These services have been flooded with AI-written replies [38, snippet-only]. **Rules:** no fabricated credentials or AI-written quotes; Google treats paid links in articles as link schemes (content-social-pr item 22). **Measure:** placements, referral visits. Stop after 2 months with no placement. **Devtool example:** answer a request on database outages. **Hobby site example:** answer gaming-press requests on trading economies. **Local/ecommerce:** local press requests on seasonal trends.

### 16. Free submissions to niche newsletters' "tools" or "links" sections

**What:** send your tool or a useful post to curators. **Needs:** something useful and public; a good post beats a product page (judgment). **Earliest stage:** 1. **Cost:** free; minutes each; judge per issue.
**Evidence:** curators include tools (Web Tools Weekly has a submit page; Cooperpress lists an editor contact) [30][32]; no data on outcomes; anecdote only. **Rules:** pitch once, no follow-up spam; CAN-SPAM covers commercial email to any address [2]. **Measure:** UTM in the submitted link. **Devtool example:** submit a write-up of a real slow-query fix to a database weekly. **Hobby site example:** submit to a fan newsletter. **Local/ecommerce:** a "local makers" roundup.

### 17. A hiring post that doubles as a product description

**What:** an HN "Who is hiring" post explaining what the company does. **Needs:** an actual open role. **Earliest stage:** 1. **Cost:** free; an hour.
**Evidence:** none on product sign-ups; anecdote only. **Rules:** post only if personally at the company, one post per company, only if actively hiring and replying to applicants; unknown companies should explain what they do [37]. A fake job to advertise breaks the rules and may break employment-ad law (judgment). **Measure:** link visits from the thread. **Devtool example:** a real contract role; the description explains the CI query checker. **Hobby/local:** not a fit.

### 18. Asking each early user for one introduction

**What:** ask each early user "who else has this problem?" **Needs:** satisfied early users. **Earliest stage:** 1. **Cost:** free; minutes.
**Evidence:** referred customers are better matched and stay longer (partners-referral-outbound items 10–11, research); knowledge/referral-programs.md recommends personal intros before a formal programme [practitioner]. **Rules:** the user introduces you (their own message); don't ask for friends' email addresses to market to them (ICO advises against it [4]). **Measure:** intros per ask, intro → active user. **Devtool example:** ask a first team for one other team running Postgres in CI. **Hobby site example:** ask active traders to invite their trade group. **Local/ecommerce:** ask a happy client to forward your number.

### 19. Paying a user to write a tutorial

**What:** commission a real user to write a tutorial about solving a problem with your product. **Needs:** money and a user who writes well. **Earliest stage:** 1–2 (money moves it earlier). **Cost:** a public benchmark is $300–$400 per technical tutorial [39, first-party]; judge per article over 3 months.
**Evidence:** none on outcomes; anecdote only. **Rules:** disclose that it was paid (FTC, content-social-pr item 24); links in paid posts must be rel="sponsored" or "nofollow" (content-social-pr item 22). **Measure:** UTM, search traffic to the post. **Devtool example:** pay a user to write up their CI migration-check setup. **Hobby site example:** pay a top trader for a pricing guide. **Local/ecommerce:** a customer's project write-up for a craft shop.

### 20. A simple affiliate or referral link with a small commission

**What:** a link that pays users or creators a share of sales. **Needs:** paid product with margin; tracking tool. **Earliest stage:** 2. **Cost:** commission plus tool fees; judge after 3 months.
**Evidence:** affiliate fraud (cookie stuffing) is real but concentrated (partners-referral-outbound items 6–7, research); Dropbox's two-sided referral is the famous case with unverified numbers (item 19). **Rules:** affiliates must disclose (item 8); pay only after refund windows (knowledge/referral-programs.md). **Measure:** sales per affiliate, refund rate; incrementality tests per knowledge/referral-programs.md. **Devtool example:** a 20% first-year commission for consultants. **Hobby site:** not a fit until revenue exists. **Local/ecommerce:** customer referral codes.

### 21. Lifetime deals on deal sites

**What:** sell lifetime access for a one-time price on sites such as AppSumo. Fits tools for small businesses, marketers, creators; AppSumo says consumer-only products are not a fit [41]. **Needs:** a working, stable product, a support plan, and an audience that overlaps small businesses [41]. **Earliest stage:** 2. **Cost:** no upfront fee; revenue share negotiated and not public; about 10% of applicants accepted; campaigns about 60 days [41, vendor].
**Evidence:** the platform's "average performer" figure is $40K–$80K per 60-day campaign, but computed over the top half of partners only [41, vendor]. Economics posts claiming tiny net revenue per buyer and high support cost have no method [42, folklore].
**Risks:** a support and hosting obligation with no future revenue; buyers who are deal-seekers, not your market (the biased-audience problem, early-stage-gtm item 14); public reviews from buyers if you later change limits; "lifetime" disputes if you shut down [42, snippet-only]. Judgment: cap seats and define "lifetime" as the product's life in the terms. **Measure:** support tickets per buyer, buyer activation vs regular users. **Devtool example:** poor fit (audience mismatch). **Hobby site:** not a fit. **Local/ecommerce:** not applicable.

### 22. A waitlist where referrals move people up

**What:** pre-launch sign-up where each person gets a link, and referrals move them up or earn rewards. **Needs:** a product people want before it exists, a seed group, and a reward worth sharing. **Earliest stage:** 0. **Cost:** a page and a tool; days.
**Evidence:** Harry's: 100K+ emails in a week, 77% via referral, seeded by a couple of hundred contacts, with tiered free-product prizes rather than line-jumping [40, practitioner; one famous success]. **Rules:** in the UK, asking people to forward marketing makes you responsible for it [4]; a share link the person posts themselves is safer than "email your friends" buttons (judgment). Fraud: fake sign-ups; Harry's used IP limits [40]. **Measure:** referral share, waitlist → activation at launch. Stop if the referral share stays under a small fraction. **Devtool example:** weak fit (developers distrust gamified waitlists; judgment). **Hobby site example:** early access to a new trade feature. **Local/ecommerce:** opening-day list for a new shop.

### 23. A founder thank-you: note, short video or free month

**What:** thank the first users personally. **Needs:** first users. **Earliest stage:** 1. **Cost:** minutes each; a free month costs revenue.
**Evidence:** Wufoo's handwritten notes [1, practitioner]. A six-year field experiment found thank-you calls to ~600,000 new donors had **no** effect on later giving, though experts expected +80% retention [16, research; charity, not software]. Lab/field work on thanks raising help exists [17, not read]. Treat a thank-you as a courtesy, not a growth lever. **Rules:** a pure thank-you is not marketing; adding an offer can make it marketing [5]. **Measure:** replies; don't expect retention lift. **Devtool example:** a short note to the first ten teams. **Hobby site example:** a "founding trader" role in Discord. **Local/ecommerce:** a handwritten card in the first orders.

### Cross-cutting: stage, money and buying traffic too early

- Most bets above cost time, not money, and work at stage 0–1. Paid newsletter slots [30][31], paid tutorials [39], sponsorships (bet 14) and paid creators can move reach earlier, before users exist.
- Risk of buying traffic before the product keeps people: knowledge/channel-strategy.md advises not to scale a channel until its cohorts retain [practitioner]. Customers won through free trials at a telco had 59% lower lifetime value (early-stage-gtm item 48, research; one firm), which shows acquisition source can change retention. Check week-4 retention of a small first batch before paying for more.
- Press and big launches need something newsworthy (stage 3); pitching press with zero users rarely works (app-discovery-outside-stores item 39: twenty pitches, zero coverage) [practitioner].

## Folklore and weak claims

- **"Founder welcome emails get 41% replies."** One company's number, original post not found [12]. Groove's own documented cancellation numbers are 10–19% [11].
- **"Developer newsletters cost $25–$150 CPM."** Rate-guide blogs with no method [33]. Use publishers' own pages [30][31].
- **"Reddit's 10% rule"** is used by some communities, not sitewide [23; content-social-pr item 15].
- **"Thank-you calls/notes build loyalty."** Large field experiment says no effect on donors [16].
- **"Lifetime deals net you $17.70 per buyer and cost $15–30/month to support."** No method [42].
- **"Community members spend more."** True in one observational study [14], false in a randomized one [15].
- **"Do things that don't scale" always works.** Founder stories, survivorship [1].

## Open questions

- No study measures sign-ups or revenue from founder emails, guest spots, co-marketing, moderator tools, or calendar-timed launches; only reply rates and anecdotes.
- CASL: is a free sign-up an "inquiry or application" giving six-month implied consent? CRTC guidance (crtc.gc.ca returned 403 in earlier sessions) not read.
- PECR soft opt-in after the Data (Use and Access) Act 2025: the ICO marks its guidance as under review [4]; check for changes for free users and non-commercial senders.
- Does Inteligo Media [8] extend to free accounts of products with no paid tier (a free hobby site)? The judgment involved a paid tier.
- Real conversion data for niche newsletter slots from advertisers (not publishers' estimates).
- BetaList prices; Product Hunt featured rate (still unknown; app-discovery-outside-stores open questions).
- Grant & Gino 2010 [17] not read; Manchanda et al. effect size [14] not seen.
- HARO's current terms read only through relays [38].
