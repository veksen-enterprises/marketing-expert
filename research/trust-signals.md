# Trust signals a crawler can see: which ones does evidence link to visitor trust or conversion? (checked 2026-10-27)

Question: A tool can see from a page's HTML whether the home page links to contact, about, privacy, terms, imprint and pricing pages, whether it shows an email address or phone number, whether the site is on HTTPS, and whether it shows security seals. Which of these does evidence link to visitor trust or to buying, and which are required by law in which market? This would change `crawl_site` or `audit_page` (a check that lists which of these pages the home page links to, and which are missing), `audit_page` (mailto, tel and HTTPS flags), and the landing-page teardown prompt (`src/prompts.ts`, step 5 "Proof and objections").

Hop 0 (seed). Access: the shell could reach no source site this session (curl got a proxy refusal for eur-lex.europa.eu, gesetze-im-internet.de, legislation.gov.uk, baymard.com, researchgate.net and others), so every source below was seen through WebFetch, which returns a model's summary and chosen quotes, or as search-result text. No figure here was checked against the text itself. The web search budget for the session ran out before searches on Google's quality rater guidelines and on company age or team photos could run.

Already in the repo, cited not repeated: Fogg et al. 2002/2003 (2,684 people; "design look" in 46.1% of comments) in `design-and-marketing-in-crowded-markets.md` item 12 and §3; Robins & Holmes 2008 and Lindgaard 2011 (looks drive credibility ratings) in `design-quality-outcomes.md` §1; Baymard 2025 checkout abandonment (19% "didn't trust the site with card details") in `cro-landing-pages.md` and `knowledge/landing-pages-and-cro.md`; Quebec's rule to show identity, address and prices before an online sale (CPA s.54.4) and the Law 25 rule to publish a privacy officer's contact on the website in `marketing-law-canada-us.md` items 9 and 13.

## Sources

1. Fogg, B.J., Marshall, J., Laraki, O. et al. (2001). "What Makes Web Sites Credible? A Report on a Large Quantitative Study." CHI 2001. https://credibility.stanford.edu/pdf/p61-fogg.pdf [read 2026-10-27; fetch summary] [research; online self-report survey, n=1,410 usable of 1,441; US and Finland; charity and news-site recruits; data from Dec 1999; ratings of described elements, not of real sites]
2. Stanford Persuasive Technology Lab, "Stanford Guidelines for Web Credibility." https://credibility.stanford.edu/guidelines [read 2026-10-27; fetch summary] [practitioner; guidelines distilled from the lab's studies, "over 4,500 people" in total]
3. Özpolat, K., Gao, G., Jank, W. & Viswanathan, S. (2013). "Research Note: The Value of Third-Party Assurance Seals in Online Retailing: An Empirical Investigation." *Information Systems Research* 24(4). https://digitalcommons.uri.edu/cba_facpubs/326 and https://academicnewsletter.sufe.edu.cn/info/407112 [abstract] [research; randomized field experiment, 9,098 shopping sessions; one retailer; run by a seal provider; no effect size in the abstract]
4. Özpolat, K. & Jank, W. (2015). "Getting the most out of third party trust seals: An empirical analysis." *Decision Support Systems*. https://www.datalearner.com/academic/journal-papers/0167-9236/volumes-and-issues/235/paper-detail/4125 [abstract; via an index page, fetch summary; ScienceDirect refused the fetch] [research; randomized field experiments by a seal provider, over 250,000 transactions, 493 retailers]
5. van Baal, S. (2015). "Not all seals are equal: An experimental investigation of the effect of third-party seals on purchase probability in electronic commerce." *Electronic Commerce Research* 15:177–206. https://link.springer.com/10.1007/s10660-015-9180-9 [abstract] [research; online lab experiment, n=300; two seals]
6. Edelman, B. (2009). "Adverse Selection in Online 'Trust' Certifications." ICEC '09. https://www.benedelman.org/publications/advsel-trust.pdf [read 2026-10-27; fetch summary] [research; observational, about 500,000 top sites; trustworthiness measured by SiteAdvisor tests; the author sat on SiteAdvisor's advisory board]
7. Baymard Institute, "Perceived security of payment form" (2016, updated with 2023 seal results). https://baymard.com/blog/perceived-security-of-payment-form [read 2026-10-27; fetch summary] [vendor; stated-preference survey, US panel, 2023 sample size not given]
8. CXL Institute (2016). "Which Site Seals Create The Most Trust?" https://cxl.com/research-study/trust-seals/ [read 2026-10-27; fetch summary] [vendor; stated-preference survey, n=2,100 US, Mechanical Turk]
9. Tsai, J., Egelman, S., Cranor, L. & Acquisti, A. (2011). "The Effect of Online Privacy Information on Purchasing Behavior: An Experimental Study." *Information Systems Research* 22(2):254–268. https://www.heinz.cmu.edu/~acquisti/papers/TsaiEgelmanCranorAcquisti-ISR-2011.pdf [read 2026-10-27; fetch summary] [research; lab experiment with real purchases on own cards, n=48 complete; Pittsburgh adults]
10. Pew Research Center (2014-12-04). "Half of Americans don't know what a privacy policy is." https://www.pewresearch.org/short-reads/2014/12/04/half-of-americans-dont-know-what-a-privacy-policy-is/ [read 2026-10-27; fetch summary] [research; survey; sample size not on the page]
11. Gefen, D., Karahanna, E. & Straub, D. (2003). "Trust and TAM in Online Shopping: An Integrated Model." *MIS Quarterly* 27(1). https://www.terry.uga.edu/wp-content/uploads/gefen-karahanna-straub-misq-2003.pdf [read 2026-10-27; fetch summary] [research; cross-sectional survey, n=213 business students, about the last book or CD vendor they used]
12. Mou, J., Shin, D.-H. & Cohen, J. (2017). "Trust and risk in consumer acceptance of e-services." *Electronic Commerce Research* 17(2):255–288. https://link.springer.com/10.1007/s10660-015-9205-4 [abstract] [research; meta-analysis of 67 studies, mostly surveys of intention]
13. Nielsen Norman Group (2019-08-18). "'Contact Us' Page Guidelines." https://www.nngroup.com/articles/contact-us-pages/ [read 2026-10-27; fetch summary] [practitioner; qualitative usability study, 20 business professionals, 40 corporate sites]
14. Nielsen Norman Group (2019-05-26). "'About Us' Information on Corporate Websites." https://www.nngroup.com/articles/about-us-information-on-websites/ [read 2026-10-27; fetch summary] [practitioner; qualitative, over 70 users across three rounds, 100 sites tested]
15. Blake, T., Moshary, S., Sweeney, K. & Tadelis, S. "Price Salience and Product Choice." NBER Working Paper 25186 (later *Marketing Science* 2021, not checked). https://www.nber.org/papers/w25186.pdf [read 2026-10-27; fetch summary] [research; field experiment, StubHub, several million users, 10 days in Aug 2015; one marketplace, event tickets]
16. TrustRadius, "Tech buyers demand honest and up-front pricing info." https://solutions.trustradius.com/vendor-blog/tech-buyers-demand-honest-and-up-front-pricing-info/ [read 2026-10-27; fetch summary] [vendor; survey, size not given; TrustRadius sells to software vendors]
17. Chromium Blog (2018-02-08). "A secure web is here to stay." https://blog.chromium.org/2018/02/a-secure-web-is-here-to-stay.html [read 2026-10-27; fetch summary; the summary held only the post's first line] and Search Engine Land, "Chrome starts telling users HTTP sites are not secure." https://searchengineland.com/tomorrow-chrome-starts-telling-users-http-sites-are-not-secure-302481/ [read 2026-10-27; fetch summary] [first-party, via a trade-press report for the label wording and date]
18. APWG, *Phishing Activity Trends Report, 1st Quarter 2020*. https://docs.apwg.org/reports/apwg_trends_report_q1_2020.pdf [read 2026-10-27; fetch summary] [industry report; figure from PhishLabs]
19. Directive 2000/31/EC (e-Commerce Directive), Art. 5. https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32000L0031 [read 2026-10-27; fetch summary] [first-party; law]
20. Directive 2011/83/EU (Consumer Rights Directive), Art. 6(1). https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32011L0083 [read 2026-10-27; fetch summary; first 100,000 of 159,288 characters; original text, later amendments (Directive 2019/2161) not checked] [first-party; law]
21. Germany, Digitale-Dienste-Gesetz (DDG) § 5 and § 33. https://www.gesetze-im-internet.de/ddg/__5.html ; https://www.gesetze-im-internet.de/ddg/__33.html [read 2026-10-27; fetch summary] [first-party; law]
22. UK, Electronic Commerce (EC Directive) Regulations 2002, reg. 6. https://www.legislation.gov.uk/uksi/2002/2013/regulation/6 [read 2026-10-27; fetch summary] [first-party; law]
23. California Business and Professions Code §§ 22575 and 22577 (CalOPPA). https://california.public.law/codes/business_and_professions_code_section_22575 ; https://california.public.law/codes/business_and_professions_code_section_22577 [read 2026-10-27; fetch summary; unofficial mirror of the code] [first-party; law]
24. GDPR Art. 13. https://gdpr-info.eu/art-13-gdpr/ [read 2026-10-27; fetch summary; unofficial mirror] [first-party; law]

Not fetched: SSRN (abstract 1592480, the working-paper version of source 3) and ResearchGate returned errors, and ScienceDirect refused the fetch, so no effect size for the seal experiments was seen. A Proofpoint blog's APWG figure for Q3 2018 ("nearly 50%" of phishing sites on HTTPS) was seen but not used. Not searched (budget ran out): Google's Search Quality Rater Guidelines on contact and customer-service information; any experiment on company age, "founded in" lines or team photos; Kim, Ferrin & Rao 2008 (*Decision Support Systems*, seals and privacy protection), seen only as a search-result title.

## 1. Contact details and address: people say they matter; no behavioural test found

- In a self-report survey, people rated how much each described element would change a site's believability on a −3 to +3 scale. "The site lists the organization's physical address" scored +1.86, "gives a contact phone number" +1.71, "gives a contact email address" +1.53, "shows photos of the organization's members" +0.69. "Provides a quick response to your customer service questions" scored +2.02. [research, 1; self-report survey, n=1,410; 1999 data; described elements, not real sites]
- The authors name the weakness: "self-reported data". They could not recruit a representative sample. [research, 1]
- Negative items in the same survey: a broken link −1.45, a typo −1.28, a domain name that doesn't match the company name −1.06, ads hard to tell from content −2.08. [research, 1; same limits]
- The Stanford guidelines turn this into advice: "listing a physical address" is "the easiest way" to show a real organization; make contact easy with "phone number, physical address, and email address". [practitioner, 2]
- In usability sessions, business professionals saw companies without a prominent Contact Us link as "evasive and unreliable". Most preferred a phone number. They looked for the link "in the top right corner of the page or down in the footer" and for the exact label "Contact Us". [practitioner, 13; qualitative, n=20, corporate sites, B2B visitors]
- No experiment was found that removed or added contact details or an address and measured sign-ups or sales. Search was limited (see access line). [gap]

## 2. About page, team, company age: weaker still

- Photos of staff rated +0.69, the lowest of the positive identity items. [research, 1; self-report]
- About pages: users ask "who's behind a business" and "whether it's credible"; hard-to-find information on what the company does and whom to contact lowered satisfaction. The study does not show that a missing About page lowers trust or sales. Users leaned more on outside reviews: "reviews" came up over 40 times in 20 sessions. [practitioner, 14; qualitative]
- Company age and "founded in" lines: nothing found (not searched; budget). [gap]

## 3. Security seals: a positive field effect in seller-run tests, a lab null on average, and a reason for doubt

- A randomized field experiment by a large seal provider, on one retailer's site (9,098 sessions), found "strong evidence that the presence of the assurance seal increases the likelihood of purchase conversion". The abstract gives no size. [research, 3; RCT, one retailer, seal-provider data; abstract only]
- Follow-up across 493 retailers and over 250,000 transactions, also from the seal provider's randomized tests: seals helped more for small retailers and for new shoppers, so they partly stand in for a shop's reputation. "More than two" seals "can lower the likelihood of purchase completion". Seals helped higher-value carts, but only at later stages of shopping. [research, 4; field RCTs, seal-provider data; abstract via an index page]
- An online lab experiment (n=300) found two seals "not effective on average"; the widely known seal had a positive effect that the little-known seal's null hid. [research, 5; lab, stated purchase]
- Certified sites can be worse. "Only 94.6% of TRUSTe-certified sites are actually trustworthy," against 97.5% of uncertified sites. BBBOnLine-certified sites were slightly more trustworthy than average. [research, 6; observational, about 500,000 sites; 2009; trustworthiness by one vendor's automated tests, and the author advised that vendor]
- Survey rankings: Norton led Baymard's 2023 "best sense of trust when paying online" question; a homemade seal with no backing beat most SSL vendors' seals. Baymard: the focus is "*perceived* security", and visitors worry mainly at the card step. [vendor, 7; stated preference]
- CXL: PayPal was picked by 25% as giving the best sense of security; unaided awareness of most seals was low (Norton 6%, BBB 7%). The authors warn stated and actual behaviour "are not synonymous". [vendor, 8; stated preference, n=2,100 US, Mechanical Turk]
- Survey models of trust find "structural assurances" (guarantees, seals, legal protection) among the strongest paths to trust (standardized .37) [research, 11; cross-sectional survey, n=213 students; causality "only... through the theory"]. A meta-analysis of 67 studies finds trust matters more than perceived risk for using e-services [research, 12; mostly intention surveys; abstract].

## 4. Privacy policy: required in several markets; its link reassures more than it informs

- Real-money lab purchases: when privacy ratings were shown next to search results, buyers chose the better-rated shops (batteries 77.8% vs 11.1% in the control) and paid about $0.60 more on a $15 item. The ratings sat in the search results, not on the shop's site. [research, 9; lab, n=48, real purchases; authors say the premium is "bounded"]
- 52% of US internet users wrongly believed that a company posting a privacy policy keeps everything it collects confidential. [research, 10; survey, 2014; sample size not on the page]
- So the presence of a "Privacy" link may reassure people who never read it. No study found measures the effect of the link's absence on conversion. [derived from 9, 10]

## 5. HTTPS: the browser shows the absence; the padlock proves little

- Since Chrome 68 (24 July 2018), Chrome labels plain HTTP pages "Not secure" in the address bar. [first-party, 17; date and wording via a trade-press report]
- "75 percent of all phishing sites now use SSL protection" (Q1 2020). HTTPS says the connection is encrypted, not that the business is honest. [industry report, 18]
- So the check is about avoiding a browser warning, not about earning trust. No experiment on the warning's effect on conversion was found. [derived; gap]

## 6. Visible pricing: buyers say they want it; one large experiment shows hiding fees sold more

- StubHub randomized whether fees showed up front or only at checkout. Users who saw fees only at checkout spent almost 21% more and were 12.43% more likely to buy in a session. The effects lasted past the first purchase. [research, 15; field RCT, several million users, one ticket marketplace, 10 days]
- So "show prices to earn trust and sales" is not supported by the strongest field test found. Laws now restrict this kind of hiding (EU, UK and Quebec rules on showing the total price, sources 19, 20, 22 and `marketing-law-canada-us.md` item 13). [derived]
- Software buyers: "81%" want to find pricing on their own and "71%" say pricing on the site makes them more likely to buy. [vendor, 16; survey size not given; seller of buyer-intent services]
- No study found compares B2B software pages with and without public pricing on sign-ups or sales. [gap]

## 7. What the law requires (by market)

| Market | What must be on the site | Where and how | Source |
|---|---|---|---|
| EU (all states) | Name; geographic address; contact details "including his electronic mail address" for rapid, direct contact; trade register and number; VAT number if any; supervisory authority or professional body where relevant | "easily, directly and permanently accessible"; prices "clearly and unambiguously", saying whether tax and delivery are included | e-Commerce Directive Art. 5 [first-party, 19] |
| EU, consumer sales | Before the contract: identity, geographic address, phone and email "where available" (original text), total price with taxes, withdrawal conditions where a right exists | Before the consumer is bound, not necessarily on the home page; no general small-business exemption | Consumer Rights Directive Art. 6(1) [first-party, 20] |
| Germany | Name and address; legal form and representative for companies; details for "quick electronic contact" including email (the "Impressum") | "leicht erkennbar und unmittelbar erreichbar" (easy to recognise and directly reachable), kept available at all times, for commercial services usually offered for payment | DDG § 5 [first-party, 21] |
| Germany, penalty | Missing, wrong or incomplete § 5 information is an administrative offence; fine up to €50,000 | | DDG § 33(2) no. 1, (6) no. 3 [first-party, 21] |
| UK | Name, geographic address, contact details including email | "easily, directly and permanently accessible"; prices must say whether tax and delivery are included | Electronic Commerce Regulations 2002 reg. 6 [first-party, 22] |
| California (US) | A privacy policy, if a commercial site collects personally identifiable information from California consumers | "Conspicuously post": one listed way is a text link on "the homepage or first significant page" that includes the word "privacy"; another is any link "a reasonable person would notice"; breach counts only if not fixed within 30 days of notice | CalOPPA §§ 22575, 22577 [first-party, 23] |
| EU/UK data protection | Controller identity and contact, purposes and legal basis | "at the time when personal data are obtained" (at the form), not a home-page rule | GDPR Art. 13 [first-party, 24] |
| Quebec | Already covered | | `marketing-law-canada-us.md` items 9, 13 |

`knowledge/marketing-law-by-market.md` covers Quebec, Canada, the US, Turkey, Armenia and Argentina, but no EU or German site-information rule was found in it by grep. The Impressum and Art. 5 rows are new to the repo.

## What this changes

1. **New check: "site-information links" on the start page (`crawl_site`, or `audit_page` for a home page).** It is a legal-information check first, and a trust check only weakly.
   - Input: the start page's `<a>` elements (href and text), including the footer, from server HTML and from render mode when used.
   - Rule: report which of these are found, by link text or path, in English plus German, French and Spanish words for the market rows above: contact (`contact`, `kontakt`, `contacto`, or any `mailto:` or `tel:` link); imprint (`impressum`, `imprint`, `legal notice`, `mentions légales`, `aviso legal`); privacy (`privacy`, `datenschutz`, `confidentialité`, `privacidad`); terms; about; pricing.
   - Output: a list of found and missing items, with each missing item tied to its reason and grade. Example: "No link with the word 'privacy' on the home page. If the site collects personal information from California residents (a sign-up form counts), CalOPPA asks for a conspicuously posted privacy policy; a home-page link containing 'privacy' is one of the ways it lists [first-party; law]." And: "No imprint link found. A business that sells in Germany must keep its name, address and email easy to find and directly reachable (DDG § 5; fines up to €50,000) [first-party; law]."
   - Severity: `info` for all. The tool can't know the markets or whether the site collects personal data, and it must say so: "Which markets you sell in was not checked; these rules apply only where stated."
   - About and pricing: report found or not found as facts, with no flag and no trust claim. Evidence on About pages is qualitative [practitioner, 14], and the strongest pricing test points the other way [research, 15].
   - What it can't see: links inside menus built only by script (unless render mode), pages with the information but no link from the home page, and whether the linked page holds the required content. Say so in the output.

2. **`audit_page`: add `contact` facts (mailto and tel present, email address in text present).** Report them as facts; no warning when missing. The basis is legal (EU and UK "electronic mail address", DDG "Adresse für die elektronische Post") [first-party, 19, 21, 22]. Trust support is self-report only [research, 1; self-report] and qualitative [practitioner, 13]. Don't detect postal addresses: formats differ by country, so false matches are likely. Say "postal address not checked".

3. **`audit_page`: flag a page served over plain HTTP** (final URL is `http:`) as a `warning`: "Chrome labels plain HTTP pages 'Not secure' in the address bar." [first-party, 17]. Don't claim HTTPS builds trust: three in four phishing sites use it [industry report, 18].

4. **No seal check.** Don't flag missing seals, and don't advise adding them on the first screen. The playbook line for the teardown, if wanted: a well-known seal near the payment step may help a small or new shop with first-time buyers; more than two seals may hurt; the only field evidence comes from a seal provider's own tests, and a lab test found no average effect [research, 3, 4; seal-provider RCTs] [research, 5; lab]. Certified sites are not always safer [research, 6; observational]. Test it rather than assume a lift.

5. **Teardown prompt, step 5 ("Proof and objections").** Add one clause: "Use the site-information facts from the audit; a missing contact route or legal page is a fact to report with its rule, not a proven conversion loss." This replaces text rather than adding to it, to respect the word cap.

6. **`knowledge/marketing-law-by-market.md`:** add a short EU/UK/Germany "what the website must show" section from §7 (Art. 5, DDG § 5 and § 33, UK reg. 6, CRD Art. 6) and the CalOPPA home-page link rule. Re-check the amended CRD Art. 6 text (Directive 2019/2161) before it enters.

7. **`knowledge/landing-pages-and-cro.md`:** any line saying "trust badges lift conversion" should carry `[research; seal-provider field RCTs; stronger for small shops and new buyers]` plus the lab null. Any line saying "show pricing to build trust" should carry `[vendor; buyer survey]`, with the StubHub result next to it. (Grep found no such lines today, so this is a rule for future edits.)

Evidence grade behind the checks: the legal rows are first-party law, read through a fetch summary. The trust side of contact, address, About and privacy is self-report or qualitative. No behavioural study measured what removing any of them does to conversion.

## Open questions

- Does removing or adding a contact phone, email or address change sign-ups or sales in a randomized test? None found; search was cut short.
- The effect size in Özpolat et al. 2013 and Özpolat & Jank 2015. Fetch the full text before any number enters a playbook.
- Google's quality rater guidelines on contact and customer-service information for shopping pages (not searched; budget). This could add a first-party SEO reason for the contact check.
- Does a missing "Not secure" warning matter now that most sites use HTTPS? Is there any data on conversion for HTTP pages after 2018?
- The amended Consumer Rights Directive wording on phone and email (Directive 2019/2161 removed fax and changed "where available"). Not checked.
- Does a German-language or `.de` site justify showing the Impressum line more prominently, or should the tool always ask which markets the business sells in?
