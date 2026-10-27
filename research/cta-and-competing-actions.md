# Do competing actions, navigation, button placement or button wording change conversion, and by how much? (checked 2026-10-27)

Question: `audit_page` lists CTA candidates, flags a generic "Submit"/"Send" button and warns when it finds no CTA. A planned extension would count distinct primary CTAs and their link targets, count navigation links, and check whether a CTA appears in the first-screen text. The playbook `knowledge/landing-pages-and-cro.md` has two lines under "Practitioner consensus without controlled evidence": "One primary goal per page" (remove competing actions and navigation) and "Descriptive CTAs". Is there a controlled study that sizes the effect of competing actions, navigation removal, CTA placement or CTA wording (including "my" vs "your")? If there is, a check could carry a threshold. If not, the flags must stay worded as heuristics.

Hop 0 (seed). Access: every source below was read through WebFetch, which returns a model's summary and chosen quotes, not the text, so all reads are marked "fetch summary"; figures are the tool's and were not checked against the PDFs. Direct downloads with curl were refused by the egress proxy (403) for gwern.net, pmc.ncbi.nlm.nih.gov, biomedcentral.com, hal.science, usc.edu and w3c.github.io. Search used WebSearch.

Already in the repo, cited not repeated: the jam study and the two choice-overload meta-analyses (mean effect about zero; overload only under four moderators) in `research/behavioral-science.md` items 8–10; message match, single goal and CTA wording tagged [practitioner] with no effect size in `research/cro-landing-pages.md` §7; "red beats green", optional stopping and winner's curse in the same note §8; "most ideas fail" (Kohavi, Tang & Xu 2020) in `research/landscape-2026.md` §8.

## Sources

1. Browne, W. & Swarbrick Jones, M. (Qubit) (2017). "What works in e-commerce: a meta-analysis of 6700 online experiments." White paper, 22 June 2017, method assured by PwC UK. https://Www.Gwern.net/doc/economics/advertising/2017-browne.pdf [read 2026-10-27; fetch summary] [vendor; Bayesian meta-analysis of about 6,700 client A/B tests; retail and travel; 2014–2017; not peer-reviewed; Qubit sold the "behavioural" treatments that came out ahead]
2. Sallis, A., Harper, H. & Sanders, M. (2018). "Effect of persuasive messages on National Health Service Organ Donor Registrations: a pragmatic quasi-randomised controlled trial with one million UK road taxpayers." *Trials* 19:513. https://pmc.ncbi.nlm.nih.gov/articles/PMC6150960 [read 2026-10-27; fetch summary] [research; quasi-randomised field trial, n=1,085,322; one government page, 2013]
3. Schlangenotto, D. & Kundisch, D. (2016). "READ THIS PAPER! A Field Experiment on the Role of a Call-to-Action in Paid Search." ECIS 2016. https://aisel.aisnet.org/cgi/viewcontent.cgi?article=1059&context=ecis2016_rp&httpsredir=1 [read 2026-10-27; fetch summary] [research; randomised field experiment, 67,711 ad impressions; one furniture retailer; ad text, not a page button]
4. Huff, S. C. & Johnson, A. C. (2014). "Clicking through overload: When choice overload can actually increase choice." Palgrave Macmillan journal (DOI 10.1057/dddmp.2014.37, the prefix of the *Journal of Direct, Data and Digital Marketing Practice*; journal name not shown on the publisher page). https://link.springer.com/article/10.1057/dddmp.2014.37 [read 2026-10-27; fetch summary] [research; field experiment, about 3.32M emails, 1,368 site visitors; one purpose-built store; clicks only, no purchases]
5. Kohavi, R., Henne, R. M. & Sommerfield, D. (2007). "Practical Guide to Controlled Experiments on the Web: Listen to Your Customers not to the HiPPO." KDD 2007. https://cdn.elezea.com/pdf/GuideControlledExperiments.pdf [read 2026-10-27; fetch summary] [research paper reporting a practitioner case; one site]
6. Liu, W., Gori, J., Rioul, O., Beaudouin-Lafon, M. & Guiard, Y. (2020). "How Relevant is Hick's Law for HCI?" CHI 2020. doi:10.1145/3313831.3376878. https://researchportal.ip-paris.fr/en/publications/how-relevant-is-hicks-law-for-hci/ [abstract; via fetch summary] [research; literature review]
7. Larson, K. & Czerwinski, M. (1998). "Web Page Design: Implications of Memory, Structure and Scent for Information Retrieval." CHI '98. https://www.microsoft.com/en-us/research/publication/web-page-design-implications-memory-structure-scent-information-retrieval/ [abstract; via fetch summary] [research; lab, search time, not conversion]
8. Mochon, D. (2013). "Single-Option Aversion." *Journal of Consumer Research* 40(3):555–566. doi:10.1086/671343. https://ideas.repec.org/a/oup/jconrs/doi10.1086-671343.html [abstract; via fetch summary] [research; lab studies]
9. Cruz, R. E., Leonhardt, J. M. & Pezzuti, T. (2017). "Second Person Pronouns Enhance Consumer Involvement and Brand Attitude." *Journal of Interactive Marketing* 39:104–116. doi:10.1016/j.intmar.2017.05.001. https://ideas.repec.org/a/eee/joinma/v39y2017icp104-116.html [abstract; via fetch summary] [research; Facebook post field data plus two experiments; attitudes, not clicks]
10. Fessenden, T. (2018). "Scrolling and Attention." Nielsen Norman Group, 15 Apr 2018. https://www.nngroup.com/articles/scrolling-and-attention/ [read 2026-10-27; fetch summary] [practitioner; eyetracking, 120 participants, 130,000+ fixations; attention, not conversion]
11. Siroker, D. (2010). "How Obama raised $60 million by running a simple experiment." Optimizely blog, 29 Nov 2010. https://www.optimizely.com/insights/blog/how-obama-raised-60-million-by-running-a-simple-experiment/ [read 2026-10-27; fetch summary] [vendor; one multivariate test, 310,382 visitors; author later founded the testing vendor]
12. Urban, D. "Should You Remove Navigation From Your Landing Pages? Data Reveals the Answer." HubSpot blog (updated 26 Aug 2025; first date not shown). https://blog.hubspot.com/marketing/landing-page-navigation-ht [read 2026-10-27; fetch summary] [vendor; A/B anecdote, 5 pages, no sample sizes or significance]
13. Ash, T. (2014). "Me vs. You: How Pronouns Affect Click Conversion Rates." SiteTuners blog, 8 Apr 2014 (first in ClickZ, 18 Mar 2014). https://sitetuners.com/blog/me-vs-you-how-pronouns-affect-click-conversion-rates/ [read 2026-10-27; fetch summary] [vendor; relays ContentVerve/Unbounce A/B anecdotes, no sample sizes]
14. Gardner, O. et al. "Is Too Much Choice Killing Your Conversion Rates? [Case Studies]." Unbounce blog. https://unbounce.com/conversion-rate-optimization/psychology-of-choice-conversion-rates/ [read 2026-10-27; fetch summary; author not confirmed] [vendor; seven A/B anecdotes, none with sample sizes]
15. Li, A. "Should a Landing Page Have Navigation—or Is It Costing Sales?" https://atticusli.com/blog/posts/landing-page-navigation-ab-test/ [read 2026-10-27; fetch summary] [practitioner; relays a VWO case (3% to 6%, no sample size) and one unpublished own test]
16. Nonprofit Campaign Lab, Experiment 005, "Call to Action Button Text." https://www.nonprofitcampaignlab.com/tests/call-to-action-button-text [read 2026-10-27; fetch summary] [practitioner; one email test, about 9,480 per arm, no significance test]
17. W3C. "Understanding SC 2.4.4 Link Purpose (In Context) (Level A)." https://w3c.github.io/wcag/understanding/link-purpose-in-context.html [read 2026-10-27; fetch summary] [first-party standard; accessibility, links only]
18. Kohavi, R., Deng, A., Longbotham, R. & Xu, Y. (2014). "Seven Rules of Thumb for Web Site Experimenters." KDD 2014. https://exp-platform.com/rules-of-thumb/ [abstract; via fetch summary; rules themselves not read]

Not fetched: nngroup.com/articles/get-started/ (rate-limited twice; its claim about "Get Started" buttons is not used); Sadowski et al. (2025), "You Can Do It! or Can We? Personal Pronouns and Their Impact on Consumer Goal Pursuit," *Psychology & Marketing*, doi:10.1002/mar.70005 (Wiley refused the fetch; title only, [snippet-only]); Boatwright & Nunes (2001), "Reducing assortment," *Journal of Marketing* 65(3) (only a citation page loaded; product range, not page actions, so not used); MarketingExperiments, "Long landing page nets 220% more leads than above the fold call-to-action" (title seen in search only, [snippet-only]); the original ContentVerve and VWO case pages; goodui.org pattern pages (a search found no pattern on navigation removal or pronouns).

## 1. The largest dataset: wording, buttons and navigation changes average about zero

- A meta-analysis of about 6,700 client A/B tests (retail and travel, 2014–2017) estimated the average effect of each kind of change on revenue per visitor [vendor, 1; fetch summary]:
  - "Calls to action", defined as "changing the wording of copy on the page to be more suggestive, for example changing 'contact us' to 'get a quote'": 172 tests, −0.3% (95% interval −0.6% to 0.0%). Conversion rate: −0.2% (−0.4% to 0.0%).
  - "Buttons" (any change to a button): 197 tests, −0.2% (−0.4% to 0.1%).
  - "Navigation" (changing the navigation structure): 216 tests, −0.2% (−0.5% to 0.1%). "Sticky navigation" (40 tests) −0.7%; "mobile navigation" (33 tests) −1.7% (−2.9% to −0.5%).
  - "Landing page" (changes shown only on the first page of a visit): 55 tests, −0.3% (−0.9% to 0.3%). "Colour": 81 tests, 0.0%.
  - By contrast, scarcity +2.9%, social proof +2.3%, urgency +1.5%.
  - "90% of experiments have an effect of less than 1.2% on revenue, positive or negative."
- What this does and doesn't show. It is the best denominator found: every test run, not only winners. But it is one vendor's clients, mostly large retail and travel sites with mature pages; the categories are broad; and Qubit sold the treatments that won. The categories average many directions of change, so a mean near zero does not say any single change is useless. It does say the typical wording, button or navigation change on a mature site moves revenue by well under 1%. [derived from 1]
- The paper's own counts don't reconcile (about 2,600 vs about 3,000 tests categorised). [vendor, 1; fetch summary]

## 2. Text next to the button can matter a lot; one large peer-reviewed field trial

- On the GOV.UK page shown after renewing vehicle tax, 1,085,322 users saw either no message or one of seven messages above the same "Join now" button for the organ donor register. Control: 2.3% registered. [research, 2; quasi-randomised (alternating allocation); one page; fetch summary]
  - Best: reciprocity ("If you needed an organ transplant would you have one? If so please help others."), 3.1%, odds ratio 1.38 (1.32–1.45). Loss frame 3.0% (OR 1.33). Other text arms 2.8–2.9%.
  - The same social-norm sentence with a photograph fell to 2.1% (OR 0.94, 0.89–0.99), below no message at all. The authors' click data suggest the photo cut clicks on "Join now", not completion after the click.
- So the words around a CTA, on a page where people already are, changed sign-ups by up to about a third in relative terms, and an added image made things worse. The button label did not change, so this sizes the message, not the button. [derived from 2]
- This is a public-service ask with no price. It does not transfer as a number to a product page. [derived]

## 3. Competing actions and navigation: no controlled study sizes the effect on a landing page

- No peer-reviewed or large field study was found that removes navigation or extra CTAs from a landing page and measures conversion. The meta-analysis's navigation category (216 tests, mean about zero) is the only denominator, and it covers changing navigation, not removing it. [vendor, 1]
- HubSpot removed top, footer and social links from five of its own landing pages: three free-content pages gained "0–4%", two software pages gained "16% and 28%". No sample sizes or significance. [vendor, 12; A/B anecdote]
- Other cited cases (VWO wedding registry 3% to 6%; Yuppiechef; Taloon social buttons +11.9%; Unbounce webinar options 4 to 3, +16.9%) give no sample sizes. [vendor, 14, 15; A/B anecdotes]
- One closely related peer-reviewed case: a checkout page added a coupon-code box (one of nine changes) and the site "lost 90% of their revenue"; removing the box from the new version raised conversion 6.5%. The mechanism given is that shoppers left to look for coupons. [research paper, 5; one site; practitioner case]. This supports "an extra field or link that invites leaving can cost sales", not a count limit.
- Number of links and clicking. Emails with 2, 4, 7 or 10 product links: clicks rose from 2 to 4, fell at 7, then rose to the highest at 10. On the landing page, page views peaked at five items and rose again at nine. No purchases were measured. [research, 4; one store; clicks only]
- One option can be worse than two. In lab studies, a product was chosen more often when a competing option was added, because people facing a single option want to keep searching. [research, 8; lab; abstract only]. This cuts against reading "one primary goal" as "one option".
- Choice overload in general: meta-analyses find a mean effect near zero, with overload only when options are complex, the decision is hard, preferences are unclear or the goal is to pick the best one (`research/behavioral-science.md` items 9–10).

## 4. Hick's law does not support counting menu links

- Hick's law links reaction time to the logarithm of the number of options in stimulus-response tasks. A CHI review argues it is often misapplied: it works against "less is better" (time grows slowly with more options), log-shaped data don't prove Hick's law, the paradigm rarely matches interface tasks, and visual search and decision research are more useful. [research, 6; review; abstract only]
- On menus, deeper link structures slowed search; a medium breadth-and-depth structure beat the broadest one. [research, 7; lab, 1998; search time, abstract only]
- So no threshold for "too many nav links" follows from Hick's law. [derived from 6, 7]

## 5. Placement: attention data, not conversion data

- In eyetracking on 120 people, about 57% of page-viewing time was above the fold, 17% on the second screen and 26% further down (about 80% above the fold in 2010). NN/g advises "Keep major CTAs above the fold." [practitioner, 10; attention, desktop 1920×1080]
- No controlled study was found that moves a CTA above or below the fold and measures conversion across sites. A vendor title claims a long page with a lower CTA beat an above-the-fold CTA by 220% [snippet-only; vendor anecdote].
- In paid search ads, a call to action placed last raised clicks about 7% (OR 1.07, p<0.1 only) but cut conversion about 15% (OR 0.85) compared with the same CTA earlier; a CTA did no better than a neutral benefit line. [research, 3; one retailer; ad text]. Clicks and conversions can move in opposite directions.

## 6. Wording: "descriptive" and "my vs your"

- Generic labels: WCAG 2.4.4 asks that a link's purpose be clear from its text or context. It covers links, not buttons, and is about accessibility, not conversion. [first-party, 17]
- Category mean for "more suggestive" wording: −0.3% revenue across 172 tests (section 1). [vendor, 1]
- The 2008 Obama splash page: "Learn More" with a family photo beat the original ("Sign Up") 11.6% vs 8.26% sign-up, 310,382 visitors; buttons and media were tested together (4 × 6 multivariate). [vendor, 11; one test]. A vaguer label won here, so "Learn more" should not be flagged as weak.
- One email button test: "Hear Their Story" got 60% more unique clicks than "Listen Now" (about 9,480 per arm); total email clicks rose 1%; no significance test. [practitioner, 16; one test]
- "My" vs "your": "Start my free 30-day trial" got "90 percent more clicks" than "your"; a second pair and one client test favoured first person by about 25%. No sample sizes, dates or links to the originals; no losing tests reported. [vendor, 13; A/B anecdotes]
- Peer-reviewed pronoun work points the other way and is not about buttons: second-person "you" in brand posts raised involvement and brand attitude, for people lower in collectivism only. [research, 9; Facebook data plus two experiments; abstract only]. No peer-reviewed test of "my" vs "your" on a button was found.

## What this changes

1. **No threshold for competing actions or nav links.** No controlled study sizes the effect, the only large denominator averages about zero (216 navigation tests), and lab work shows a lone option can lose (Mochon). `audit_page` may report facts but should not flag a count.
   - Buildable: add `navLinks` (count of `<a href>` inside `<nav>` or `<header>`) and `ctaTargets` (distinct resolved `href` targets of CTA candidates outside `<nav>`/`<footer>`, with their text) to the output. No flag.
   - If a note is shown when `ctaTargets` > 1: "N different CTA targets in the page body. Whether competing actions cost conversions here is untested; one meta-analysis of vendor tests found navigation changes average about zero. Test removing them on paid-traffic pages." It must also say what it cannot see: buttons whose target is set by script, and CTAs added after render (outside render mode).
   - Grade: [vendor; meta-analysis; retail and travel] plus [vendor; A/B anecdote].
2. **CTA "on the first screen" is an attention heuristic.** `leadText` (first 600 characters, nav included) is not the first screen. Without render mode, word it as "No CTA candidate in the first 600 characters of page text (not the visible screen; nav text included)". In render mode, check whether any CTA candidate's box starts above the viewport height and say which viewport was used. Output should cite attention, not conversion: "About 57% of viewing time is above the fold in one eyetracking study; no study sizes the conversion effect of CTA placement." Severity: info. Grade: [practitioner; eyetracking, n=120].
3. **Keep the "generic Submit" flag, reword it as a heuristic.** Current text: `Generic submit button "Submit"; say what the visitor gets.` Proposed: `Generic submit button "Submit". A label that says what the visitor gets is common advice; no controlled study measures the gain.` Do not extend it to "Learn more" or "Get started" (the Obama test's winner was "Learn More"). A separate accessibility flag for link text "click here"/"read more" may cite WCAG 2.4.4 [first-party], framed as accessibility, not conversion.
4. **No pronoun check.** "My vs your" rests on vendor anecdotes with no sample sizes; add it to "Folklore to stop citing" in the playbook next to "red beats green".
5. **Playbook tags in `knowledge/landing-pages-and-cro.md`:**
   - "One primary goal per page" stays [practitioner]; add "a meta-analysis of 216 vendor navigation tests found an average effect near zero [vendor; meta-analysis; retail and travel]; HubSpot's own removal test on 5 pages ranged 0–28% [vendor; A/B anecdote]; a single option can lose to two [research; lab]."
   - "Descriptive CTAs" stays [practitioner]; add "172 vendor tests of more suggestive wording averaged about zero revenue effect [vendor; meta-analysis]". 
   - Add one line with the best evidence found: the message beside a fixed button changed sign-ups from 2.3% to as much as 3.1%, and an added photo cut them to 2.1% [research; quasi-randomised field trial, n=1,085,322; one government page]. The lesson is "test the message near the CTA", not a number to expect.
6. **Teardown item 4** ("one, visible on the first screen") should read as a default to test, with the attention source, not as a rule.

## Open questions

- Does any platform (Google Ads, Meta, Shopify) publish a first-party controlled result on landing-page navigation or CTA count? Not searched this session.
- The Qubit categories mix directions of change. Is there a per-test breakdown (removal vs addition of navigation)? The paper's appendices were not read.
- Sadowski et al. (2025) on personal pronouns and goal pursuit was not read; it may test "you" vs "we" in a way that bears on CTA copy.
- Would small sites (low traffic, cold visitors) show larger effects than Qubit's mature retail sites? No data found.
