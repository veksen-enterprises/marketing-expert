# Does a clear hero headline convert better than a clever one, and which text features predict it? (checked 2026-10-27)

Question: does a headline that says what the product is and who it is for get more clicks or sign-ups than a clever or abstract one? Which features a tool can compute from the text (length, readability, concreteness, jargon, a category noun, superlatives) have a measured link to a behavioural outcome? This would change `analyze_copy` (hero-specific flags on the h1 and subhead) and the hero rule in `knowledge/messaging-and-copy.md` lines 54–61 ("Headline and subhead"), which carries no evidence tag today, and line 51 ("Clarity before cleverness").

Hop 0 (seed). Access: every source was seen through WebFetch, which returns a model's summary, so all reads are marked "fetch summary"; figures should be re-checked against the PDF before they enter a playbook. Direct downloads with curl (uchicago.edu, uni-muenchen.de, pmc.ncbi.nlm.nih.gov) were refused by the proxy (403 on CONNECT). Search through WebSearch.

Already in the repo, cited not repeated: what readability formulas measure and miss (`cro-landing-pages.md` §2); 5-second tests check recall, not persuasion, and their validity is weak (`positioning-messaging.md`, line on 5-second tests); one review-mined headline anecdote (`positioning-messaging.md`, Copyhackers line); a null fluency effect on purchases (`pricing.md` item 13, Fenneman et al.).

## Sources

1. Matias, J. N., Munger, K., Le Quere, M. A. & Ebersole, C. (2021). "The Upworthy Research Archive, a time series of 32,487 experiments in U.S. media." *Scientific Data* 8:195 (corrected 2024, *Sci Data* 11:765). https://pmc.ncbi.nlm.nih.gov/articles/PMC8329003 [read 2026-10-27; fetch summary] [first-party dataset description]
2. Gligorić, K., Lifchits, G., West, R. & Anderson, A. (2023). "Linguistic effects on news headline success: Evidence from thousands of online field experiments (Registered Report)." *PLOS ONE* 18(3):e0281682. https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0281682 [read 2026-10-27; fetch summary; first 100,000 of 107,559 characters] [research; registered report, 24,333 headline pairs; Upworthy 2013–15]
3. Banerjee, A. & Urminsky, O. (2025). "The Language That Drives Engagement: A Systematic Large-scale Analysis of Headline Experiments." *Marketing Science* 44(3):566–592. doi:10.1287/mksc.2021.0018. Abstract: https://ideas.repec.org/a/inm/ormksc/v44y2025i3p566-592.html [abstract; fetch summary]. Figures below are from the January 2021 working-paper version, exploratory set only: https://home.uchicago.edu/ourminsky/Banerjee_Urminsky_Headlines.pdf [read 2026-10-27; fetch summary; the authors say confirmatory results may differ] [research; field A/B tests, 3,346 tests in exploratory set; Upworthy]
4. Robertson, C. E., Pröllochs, N., Schwarzenegger, K., Pärnamets, P., Van Bavel, J. J. & Feuerriegel, S. (2023). "Negativity drives online news consumption." *Nature Human Behaviour* 7:812–822. doi:10.1038/s41562-023-01538-4. https://pmc.ncbi.nlm.nih.gov/articles/PMC10202797/ [read 2026-10-27; fetch summary] [research; 12,448 field A/B tests, 53,699 headlines; Upworthy]
5. Shulman, H. C., Markowitz, D. M. & Rogers, T. (2024). "Reading dies in complexity: Online news consumers prefer simple writing." *Science Advances* 10(23):eadn2555. https://pmc.ncbi.nlm.nih.gov/articles/PMC11152133 [read 2026-10-27; fetch summary; supplementary tables S1 and S4 not seen] [research; 7,371 Washington Post + 22,664 Upworthy field A/B tests, plus lab studies n=524 and n=249]
6. Hagar, N., Diakopoulos, N. & DeWilde, B. (2021). "Anticipating Attention: On the Predictability of News Headline Tests." *Digital Journalism*. https://par.nsf.gov/servlets/purl/10301845 [read 2026-10-27; fetch summary] [research; 140,918 A/B tests on 293 news sites, Chartbeat data 2015–2020]. Press summary: Nieman Lab, Oct 2021, https://www.niemanlab.org/2021/10/how-a-b-testing-can-and-cant-improve-your-headline-writing/ [read 2026-10-27; fetch summary]
7. Ye, Z., Yoganarasimhan, H. & Zheng, Y. (2024). "LOLA: LLM-Assisted Online Learning Algorithm for Content Experiments." Working paper, 6 Dec 2024. https://faculty.washington.edu/hemay/LOLA.pdf [read 2026-10-27; fetch summary] [research; working paper; 17,681 Upworthy tests]
8. Pryzant, R., Basu, S. & Sone, K. (2018). "Interpretable Neural Architectures for Attributing an Ad's Performance to its Writing Style." BlackboxNLP 2018, ACL, pp. 125–135. doi:10.18653/v1/W18-5415. https://aclanthology.org/W18-5415.pdf [read 2026-10-27; fetch summary] [research; observational, ~118,000 search ads in apparel, jobs, real estate; paired on landing page]
9. Rosengren, S., Eisend, M., Koslow, S. & Dahlen, M. (2020). "A Meta-Analysis of When and How Advertising Creativity Works." *Journal of Marketing*. doi:10.1177/0022242920929288. https://www.ama.org/2020/08/05/a-meta-analysis-of-when-and-how-advertising-creativity-works/ [abstract; fetch summary] [research; meta-analysis, 93 data sets, 878 effect sizes; mostly attention, memory and attitude measures]
10. Lee, D., Hosanagar, K. & Nair, H. S. (2018). "Advertising Content and Consumer Engagement on Social Media: Evidence from Facebook." *Management Science* 64(11):5105–5131. https://www.gsb.stanford.edu/faculty-research/publications/advertising-content-consumer-engagement-social-media-evidence [abstract; fetch summary] [research; observational, 106,316 posts, 782 firms]
11. Oppenheimer, D. M. (2008). "The secret life of fluency." *Trends in Cognitive Sciences* 12(6):237–241. doi:10.1016/j.tics.2008.02.014. https://people.uncw.edu/tothj/Extra-Credit-Papers/Oppenheimer-The%20Secret%20Life%20of%20Fluency-TICS-2008.pdf [read 2026-10-27; fetch summary] [research; review]
12. Alter, A. L. & Oppenheimer, D. M. (2006). "Predicting short-term stock fluctuations by using processing fluency." *PNAS* 103(24). Seen only through Princeton press release, 29 May 2006: https://www.princeton.edu/news/2006/05/29/study-stock-performance-tied-ease-pronouncing-companys-name [read 2026-10-27; fetch summary; paper not fetched] [research; IPO field data, NYSE and AMEX]
13. Henderson, E. L., Vallée-Tourangeau, F. & Simons, D. J. (2019). "The Effect of Concrete Wording on Truth Judgements: A Preregistered Replication and Extension of Hansen & Wänke (2010)." *Collabra: Psychology* 5(1):19. doi:10.1525/collabra.192. https://eprints.kingston.ac.uk/id/eprint/43028/1/Henderson-E-L-43028-VoR.pdf [read 2026-10-27; fetch summary] [research; preregistered replication, n=246 and n=220; ratings]
14. Shulman, H. C., Dixon, G. N., Bullock, O. M. & Colón Amill, D. (2020). "The Effects of Jargon on Processing Fluency, Self-Perceptions, and Scientific Engagement." *Journal of Language and Social Psychology*. Seen only through OSU press release: https://news.osu.edu/the-use-of-jargon-kills-peoples-interest-in-science-politics/ [read 2026-10-27; fetch summary; paper not fetched] [research; online experiment, n=650; self-report only]
15. Moreau, C. P., Markman, A. B. & Lehmann, D. R. (2001). "'What Is It?' Categorization Flexibility and Consumers' Responses to Really New Products." *Journal of Consumer Research* 27(4):489–498. doi:10.1086/319623. https://ideas.repec.org/a/oup/jconrs/v27y2001i4p489-98.html [abstract; fetch summary] [research; two lab experiments; outcome measures not stated in the abstract]
16. Packard, G. & Berger, J. (2021). "How Concrete Language Shapes Customer Satisfaction." *Journal of Consumer Research* 47(5). Seen only through Knowledge at Wharton interview page, Sept 2021: https://knowledge.wharton.upenn.edu/article/how-language-boosts-customer-satisfaction/ [read 2026-10-27; fetch summary; paper not fetched] [research; customer-service language, not headlines]
17. "Search engine advertising for organic food: The effectiveness of information concreteness on advertising performance." *Journal of Consumer Behaviour* (authors and year not shown on the index page). https://metatoc.com/papers/107336-search-engine-advertising-for-organic-food-the-effectiveness-of-information-concreteness-on-advertising-performance [abstract; fetch summary] [research; one field experiment, one firm; sample not seen]
18. NextAfter, "How adding more clarity and recency copy to a headline on a landing page affects email conversions." https://www.nextafter.com/?p=31615 [read 2026-10-27; fetch summary] [vendor; A/B anecdote; one nonprofit page]

Not fetched: science.org (client error on the *Science Advances* page; read via PMC instead); the published *Marketing Science* version of [3] (paywall); the full *PNAS* paper [12] and the jargon paper [14] (press releases only); the full text of [15] and [17]. No peer-reviewed experiment was found that tests a product or SaaS hero headline (clear vs clever) on sign-ups or purchases.

## 1. The big public headline datasets are news, not products

- The Upworthy archive holds 32,487 headline tests, 150,817 arms, 538 million impressions and 8.2 million clicks, January 2013 to April 2015. The outcome is a click on the headline to read more. [first-party dataset, 1]
- The archive's own caveats: tests between 25 June 2013 and 10 January 2014 were "not fully randomized"; arms sometimes sat below the first screen; editors stopped tests by hand and no power analysis was done; audiences differed between tests. [first-party dataset, 1]
- The Washington Post set: 7,371 tests, 19,926 headlines, March 2021 to December 2022. [research, 5]
- Chartbeat: about 1 million tests on 1,314 domains, 140,918 after filtering. [research, 6]
- These tests measure whether a reader clicks a teaser to read a story. A hero headline is read after the visitor has already arrived, and its outcome is a sign-up or purchase. The datasets do not test that. [derived]

## 2. Wording features predict headline winners only a little better than chance

- Registered report on Upworthy: a model on linguistic features picked the winner of a headline pair 54.42% of the time (chance 50%), in 24,333 pairs. [research, 2]
- Chartbeat: the best model (text features, embeddings, site and time) put the true winner first 56.6% of the time overall; 61% for two-arm tests (chance 50%). No single writing feature "meaningfully" improved forecasts; feature correlations with lift were all below |ρ| = 0.06. [research, 6]
- The ceiling is low because tests do not repeat: in 4,698 re-runs of identical headline sets, the winner changed 26% to 43.6% of the time. [research, 6]
- LLMs on Upworthy: GPT-4 picked the best of about three headlines 37.9–40.0% of the time, against 33.0% for a random guess; a fine-tuned model 46.9%. Human respondents were about as good as random (4,571 responses). The authors conclude firms "cannot replace content experimentation with LLM-based predictions." [research, 7; working paper; 2013–15 data]
- Effect size per feature is small: most features moved click rate by between −3.1% and +3.1% (relative) per standard deviation, on a 1.6% base rate. [research, 3; working-paper exploratory set]
- The simplicity index in [5] explained almost none of the variance on Upworthy (marginal R² = 0.00003) and a little on the Post (marginal R² = 0.092; difference-score r = 0.055). [research, 5]
- Testing still pays: the median winning headline had 23% higher click rate than the test average. [research, 6] The gain comes from testing, not from a formula. [derived]

## 3. Length: the sign flips between datasets

- Longer headlines won on Upworthy in three analyses: registered report, characters β = 0.07, p = 7.6×10⁻⁸ [research, 2]; word count β = 0.040 in [4]; "higher word count were clicked on more" in [3].
- In [5], character count was positively linked to clicks on Upworthy but not linked on the Post. [research, 5]
- On 293 Chartbeat news sites, shorter headlines did slightly better (characters ρ = −0.020). [research, 6]
- So there is no evidence-backed length threshold for a headline. Any hero length flag would rest on layout (does it fit the first screen?), not on clicks. [derived]

## 4. Simplicity and readability: small, mixed

- Post and Upworthy: headlines with more common words, a less formal ("analytic") style and higher Flesch reading ease got more clicks. Effects were small. [research, 5]
- Members of the public paid more attention to simpler headlines; a sample of professional writers did not, and could not pick the public's winners above chance. [research, 5; lab, n=524 and n=249]
- Against: the registered report found no Flesch effect (β = 0.02, p = 0.17) [research, 2]. The working paper found harder readability clicked more [research, 3]. Chartbeat: a higher share of common short words went with slightly better lift (ρ = 0.034) [research, 6].
- Net: a weak lean toward plain words, not a threshold. It fits the repo's existing readability caveats (`cro-landing-pages.md` §2). [derived]

## 5. Features that win news clicks would be bad advice for a hero

- Negative words raised click rate about 2.3% per word; positive words lowered it 1.0% per word. [research, 4] Negative words were confirmed in the registered report (β = 0.18). [research, 2]
- Curiosity cues won: "forward reference" language [research, 3], and "here" and "this" were among the strongest Chartbeat correlates (ρ = 0.045 and 0.052). The authors call this a poor outcome for readers. [research, 6]
- Pronouns disagree across studies: reader-directed "you/we" lowered clicks in [3]; second person was not supported in [2]; first-person plural lowered success in [2]; "you", "your" and "we" went with high click rate in search ads [8].
- A hero that hides what the product is behind curiosity may win the click and lose the sign-up; none of these datasets measured what happened after the click. [derived] This is the main reason not to port news-headline features into a hero check.

## 6. Concreteness, jargon, fluency: lab support, weak transfer

- Concreteness raised Upworthy clicks in the working paper's full and Bonferroni models, but not in its LASSO model. [research, 3]
- The classic "concrete wording is judged more true" effect (dz = 0.48, n = 46) did not replicate: dz = 0.08 and 0.11, CIs below the smallest effect of interest, in two preregistered samples. [research, 13]
- Search ads, one firm: concrete product facts beat abstract benefits for specific keywords; abstract benefits did better for generic keywords. [research, 17; abstract only] This is closer to message match than to a general concreteness rule. [derived]
- Search ads: "quick, easy, authoritative" language (for example "official site", "plus free shipping", "xx% off") went with high click rate; filler words that add "lackluster embellishment" went with low click rate. Observational, pairs matched on landing page. [research, 8] No list of the filler words was published. [research, 8]
- Fluency: easier-to-process statements are judged more true and more likeable in lab work, but people discount fluency when they see another cause for it, and the effect depends on expected difficulty. [research, 11; review]
- Real-world fluency: IPOs with easy-to-pronounce names did better in the first days after listing; the authors say it is not a long-run predictor. [research, 12; press release only]
- Jargon lowered self-reported interest and confidence even when definitions were given on hover. Outcomes were self-report only. [research, 14; n=650]
- Concrete language from customer-service agents raised satisfaction; repeat purchase is claimed in an interview without figures. [research, 16; not headlines]

## 7. Clear versus creative, and the category label

- Ad creativity has robust positive effects across 878 effect sizes; both originality and fit with the brand ("appropriateness") matter. Stronger for high-involvement products, marginally stronger on ad reactions for unfamiliar brands. The summary reports no sales or behavioural outcomes. [research, 9; meta-analysis]
- On Facebook, purely informative posts (price, deals) got less engagement unless paired with brand-personality content; deals and promotions did drive click-throughs. [research, 10; observational]
- So "clever" is not shown to lose. What the evidence supports is that creativity works when it also fits the offer. No study found pits a hero that names the product against a clever one on sign-ups. [derived]
- The first plausible category label shown for a really new product shapes how people classify it, what they expect and what they prefer. [research, 15; two lab experiments; outcome type not seen] This supports naming the category in the subhead as a comprehension aid, not as a conversion lift. [derived]

## 8. Vendor "clarity" wins don't carry thresholds

- One landing-page headline test that added "clarity and recency" reported a 206% lift (0.07% to 0.21% conversion) at 69% confidence; the vendor itself says the result is not valid. [vendor, 18; A/B anecdote] Typical of the genre: large lifts, tiny base rates, no significance.

## What this changes

1. **`analyze_copy`: no hero-specific flags for length, readability or abstractness.** Across about 30,000 field tests on Upworthy and the Post and 141,000 on Chartbeat, wording features pick the winner barely above chance (54–57% for two headlines) [2, 6], the length effect changes sign between datasets [2, 4, 5, 6], and readability is mixed [2, 3, 5]. A flag like "hero over N words" or "hero too abstract" would claim a link to conversion that the evidence does not show. [research; news headlines, click outcome only]
2. **Keep the existing hype-word list, but word it as an editor's signal.** The closest behavioural support is [8] (filler embellishment goes with low search-ad click rate; observational, no word list). It does not validate any specific word. Proposed change to the tool description in `src/server.ts` (replace text, don't append): "…absence of numbers. These are editing signals, not predictors: in large headline tests, wording features picked the winner little better than chance." Test: the tool description contains "not predictors". Grade: [research; observational and news-headline data].
3. **Optional, buildable check: `analyze_copy` accepts `headline` and `subhead` and reports, without a verdict, what a reader must answer** (input: two strings; output: `hero: { headlineWords, subheadWords, sharesWordWithTitle }` plus one fixed note: "No text feature reliably predicts which hero converts. Check it with 5 strangers: can they say what it is and who it's for after 5 seconds? Then A/B test it with real traffic if you have enough."). It must say it did not check meaning, audience fit, category or design. This adds no threshold. Only worth building if graders show advisors skip the human check; otherwise changes nothing. [derived]
4. **Missing category noun: no check.** A tool cannot know the right category without the business profile, and the only evidence (category labels shape expectations) is lab-only [15]. If the business profile ever stores a category, a check "the h1 and first subhead do not contain the profile's category word" becomes possible; the output should say "comprehension aid [research; lab]", not "conversion". [derived]
5. **Superlatives: no new check.** No behavioural study isolates superlatives in a headline. The existing VAGUE_TERMS entries ("world-class", "best-in-class") stay as editing signals. [derived]
6. **Playbook, `knowledge/messaging-and-copy.md`:**
   - Line 51 "Clarity before cleverness" and the hero rule (lines 54–61) carry no tag. Add `[practitioner; no behavioural test of hero clarity found]`.
   - Add one line after line 61, from §2: "No text formula predicts which headline wins: in large news-headline tests, wording features picked the winner little better than chance, and identical tests changed winner a quarter of the time [research; about 170,000 field A/B tests; news headlines, clicks not sign-ups]. Judge the hero with people (a 5-second test) and with traffic, not with a score."
   - Optional, from §5: "Curiosity and negative words win news clicks; don't copy them into a hero, where the goal is a sign-up, not a click [research; news headlines; post-click outcomes not measured]."
   - Design stance holds: none of this grades the page's look; the human check is the 5-second test and the side-by-side with competitors (correction 2026-10-27: both test understanding, not which version converts; `preference-vs-live-results.md`).

## Open questions

- Is there any public A/B dataset with a post-click outcome (sign-up, purchase) for landing-page headlines? None was found; Upworthy has no post-click data [1].
- What does the published *Marketing Science* version of [3] report on the confirmatory set? The working paper says results may differ.
- Do the *Science Advances* supplementary tables give per-feature sizes for common words and readability on the Post? Not seen.
- Does the product-category label in [15] change choice or only stated preference? Full text not read.
- The organic-food search-ad experiment [17]: authors, sample and effect sizes not seen.
