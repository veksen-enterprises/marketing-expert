# Early-stage go-to-market: addendum on developer tools

Scope: this addendum extends the main note, "Early-Stage Go-to-Market for a Zero-Customer Product: Research Notes". It covers five questions the main note left thin:
- how static-analysis and CI tools get adopted, kept and dropped
- PR bots, and how developers find tools
- moving from free to paid, and finding a price with little data
- commercial open source
- choosing a first segment and winning first deals

It reports general findings only. It does not apply them to any one product or company.

Researched 2026-10-05.

**Access caveat.** As in the main note, the egress proxy blocked nearly every primary host. This time the blocked hosts included:
- arxiv.org, SSRN, INFORMS (pubsonline), Wiley, SAGE, Springer, ScienceDirect, the ACM Digital Library, IEEE and cacm.acm.org
- research.google, sec.gov, businesswire.com, percona.com and chicagobooth.edu
- researchgate, academia.edu, and most university and author hosts

Only raw.githubusercontent.com, github.com and microsoft.com could be reached reliably. Five search passes ran, one per question. Each was capped at 15–20 web searches and followed by a verification pass.

**Read in full:**
- Christakis & Bird 2016 (microsoft.com).
- Kavaler et al. 2019 and Lamba et al. 2020 (the CMU STRUDEL lab's GitHub site).
- Marcilio et al. 2019 (the author's GitHub site).
- Brown & Parnin 2019 and 2020, both ICSE Workshops 2020 papers, and Brown et al. 2017 (the author's GitHub site).
- *Software Engineering at Google*, chapter 20 (the abseil GitHub mirror).

**Read at abstract level:** Imtiaz et al. 2019, from the author-hosted PDF.

Everything else rests on search-engine snippets, secondary summaries or memory. Nothing in sections 3, 4 or 5 was read in full. Do not quote a figure marked snippet-only or unverified until someone has checked it against the full text.

**How to read the marks.** This note uses the same marks as the main note. Each finding was checked against search text or the source. Where the verification pass changed a claim, the corrected version appears here, marked "(Corrected: …)". Numbering continues from the main note. **[1]–[76] are the main note's sources.** This addendum's sources start at [77].

**Evidence tags:**
- **[research]**: a peer-reviewed paper, working paper or preprint.
- **[first-party]**: a company's statement or data about itself.
- **[vendor]**: a firm with a commercial interest in the finding.
- **[practitioner]**: an operator's or newsletter's view or survey.

**Qualifiers:**
- **snippet-only**: search-engine text, not a full read.
- **read-full**: the source was read in full.
- **abstract read**: only the abstract was read.
- **secondary**: taken from someone else's summary.
- **preprint**: not peer-reviewed.
- **small n**: small sample.
- **self-selected**: respondents chose to take part.
- **one firm**: data from a single company.
- **observational**: no random assignment.
- **unverified**: from memory or a single summary, and not confirmed this session.

**Short answer.**
- **Most of the new evidence is about where findings appear, not about selling.**
  - Findings shown in the pull request, at the moment of change, get acted on far more than findings in dashboards or lists. The evidence is two firms' own reports and large observational studies.
  - Fixes that apply in one click get taken up far more than advice written as text.
- **Noise is the main reason developers turn down or drop analyzers and bots.** Their tolerance for false positives is low, though not zero.
- **Repos tend to keep the first tool they install.** Tools spread through people who commit to many repos, and through visible badges.
- **No study links any of this to signups, payment or retention for a tool vendor.** Every outcome measured is fixes, merges, stars or badge adoption.
- **The causal pricing evidence comes from consumer apps, content sites and groceries.** There are binding ways to measure willingness to pay one person at a time. None has been tested on developers or B2B buyers.
- **The common "1–2% of open-source users pay" figure is relayed lore.** The relicensing evidence is case studies.
- **The strongest segment evidence is randomized.** Structured testing makes founders drop bad ideas. Listing several markets before entry is linked to better results, but each extra option adds less.

## Sources

77. Christakis, M. & Bird, C. (2016). "What Developers Want and Need from Program Analysis: An Empirical Study." ASE 2016, pp. 332–343. doi:10.1145/2970276.2970347. https://www.microsoft.com/en-us/research/wp-content/uploads/2016/07/What-Developers-Want-and-Need-from-Program-Analysis-An-Empirical-Study.pdf [read-full]
78. Sadowski, C., Aftandilian, E., Eagle, A., Miller-Cushon, L. & Jaspan, C. (2018). "Lessons from Building Static Analysis Tools at Google." *Communications of the ACM* 61(4):58–66. doi:10.1145/3188720. https://cacm.acm.org/research/lessons-from-building-static-analysis-tools-at-google/ . Also Sadowski, C., van Gogh, J., Jaspan, C., Söderberg, E. & Winter, C. (2015). "Tricorder: Building a Program Analysis Ecosystem." ICSE 2015, pp. 598–608. [first-party; snippet-only]
79. Sadowski, C. (2020). "Static Analysis." Chapter 20 in Winters, T., Manshreck, T. & Wright, H. (eds.), *Software Engineering at Google*. O'Reilly. Chapter edited by Lisa Carey. https://raw.githubusercontent.com/abseil/abseil.github.io/master/resources/swe-book/html/ch20.html [first-party; read-full]
80. Distefano, D., Fähndrich, M., Logozzo, F. & O'Hearn, P.W. (2019). "Scaling Static Analyses at Facebook." *Communications of the ACM* 62(8):62–70. doi:10.1145/3338112. https://cacm.acm.org/research/scaling-static-analyses-at-facebook/ . Also Calcagno, C., Distefano, D. & O'Hearn, P. (11 Jun 2015). "Open-sourcing Facebook Infer: Identify bugs before you ship." Facebook Engineering blog. [first-party; snippet-only]
81. Kavaler, D., Trockman, A., Vasilescu, B. & Filkov, V. (2019). "Tool Choice Matters: JavaScript Quality Assurance Tools and Usage Outcomes in GitHub Projects." ICSE 2019, pp. 476–487. https://raw.githubusercontent.com/CMUSTRUDEL/cmustrudel.github.io/master/papers/kavaler2019tools.pdf [read-full]
82. Imtiaz, N., Murphy, B. & Williams, L. (2019). "How Do Developers Act on Static Analysis Alerts? An Empirical Study of Coverity Usage." ISSRE 2019. https://raw.githubusercontent.com/nasifimtiazohi/nasifimtiazohi.github.io/master/assets/pdf/issre19.pdf [abstract read]
83. Marcilio, D., Bonifácio, R., Monteiro, E., Canedo, E., Luz, W. & Pinto, G. (2019). "Are Static Analysis Violations Really Fixed? A Closer Look at Realistic Usage of SonarQube." ICPC 2019. doi:10.1109/ICPC.2019.00040. https://raw.githubusercontent.com/dvmarcilio/dvmarcilio.github.io/master/papers/icpc2019.pdf [read-full]
84. Johnson, B., Song, Y., Murphy-Hill, E. & Bowdidge, R. (2013). "Why Don't Software Developers Use Static Analysis Tools to Find Bugs?" ICSE 2013, pp. 672–681. https://cs.gmu.edu/~johnsonb/docs/icse2013.pdf [snippet-only; DOI 10.1109/ICSE.2013.6606613 unverified]
85. Bessey, A., Block, K., Chelf, B., Chou, A., Fulton, B., Hallem, S., Henri-Gros, C., Kamsky, A., McPeak, S. & Engler, D. (2010). "A Few Billion Lines of Code Later: Using Static Analysis to Find Bugs in the Real World." *Communications of the ACM* 53(2):66–75. doi:10.1145/1646353.1646374. https://cacm.acm.org/research/a-few-billion-lines-of-code-later/ [first-party; snippet-only]
86. Beller, M., Bholanath, R., McIntosh, S. & Zaidman, A. (2016). "Analyzing the State of Static Analysis: A Large-Scale Evaluation in Open Source Software." SANER 2016, pp. 470–481. doi:10.1109/SANER.2016.105. https://rebels.cs.uwaterloo.ca/papers/saner2016_beller.pdf [snippet-only]
87. Zampetti, F., Scalabrino, S., Oliveto, R., Canfora, G. & Di Penta, M. (2017). "How Open Source Projects Use Static Code Analysis Tools in Continuous Integration Pipelines." MSR 2017. doi:10.1109/MSR.2017.2 [snippet-only]
88. Vassallo, C., Panichella, S., Palomba, F., Proksch, S., Gall, H.C. & Zaidman, A. (2020). "How Developers Engage with Static Analysis Tools in Different Contexts." *Empirical Software Engineering* 25(2):1419–1457. https://www.ifi.uzh.ch/seal/people/vassallo/VassalloASATsEMSE2019.pdf [snippet-only]
89. Cihan, U., Haratian, V., İçöz, A., Gül, M.K., Devran, Ö., Bayendur, E.F. et al. (2025). "Automated Code Review In Practice." ICSE-SEIP 2025. arXiv:2412.18531. https://arxiv.org/pdf/2412.18531 [snippet-only]
90. Brown, C. & Parnin, C. (2020). "Understanding the Impact of GitHub Suggested Changes on Recommendations between Developers." ESEC/FSE 2020, pp. 1065–1076. doi:10.1145/3368089.3409722. https://raw.githubusercontent.com/chbrown13/chbrown13.github.io/master/papers/suggestions.pdf [read-full]
91. Wessel, M., Serebrenik, A., Wiese, I., Steinmacher, I. & Gerosa, M.A. (2020). "Effects of Adopting Code Review Bots on Pull Requests to OSS Projects." ICSME 2020. doi:10.1109/ICSME46990.2020.00011 (suffix unverified). https://research.tue.nl/en/publications/effects-of-adopting-code-review-bots-on-pull-requests-to-oss-proj/ . Extended as "Quality gatekeepers: investigating the effects of code review bots on pull request activities." *Empirical Software Engineering* 27(5) (2022). doi:10.1007/s10664-022-10130-9 [snippet-only]
92. Wessel, M., Vargovich, J., Gerosa, M.A. & Treude, C. (2023). "GitHub Actions: The Impact on the Pull Request Process." *Empirical Software Engineering* 28(6). doi:10.1007/s10664-023-10369-w [snippet-only]
93. Brown, C. & Parnin, C. (2019). "Sorry to Bother You: Designing Bots for Effective Recommendations." 1st International Workshop on Bots in Software Engineering (BotSE 2019), pp. 54–58. doi:10.1109/BotSE.2019.00021. https://raw.githubusercontent.com/chbrown13/chbrown13.github.io/master/papers/sorry.pdf [read-full]
94. Brown, C. & Parnin, C. (2020). "Comparing Different Developer Behavior Recommendation Styles." ICSE Workshops 2020, pp. 78–85. doi:10.1145/3387940.3391481. https://raw.githubusercontent.com/chbrown13/chbrown13.github.io/master/papers/recommendation_styles.pdf . Also Brown, C. & Parnin, C. (2020). "Sorry to Bother You Again: Developer Recommendation Choice Architectures for Designing Effective Bots." ICSE Workshops 2020, pp. 56–60. doi:10.1145/3387940.3391506 [read-full]
95. Mirhosseini, S. & Parnin, C. (2017). "Can automated pull requests encourage software developers to upgrade out-of-date dependencies?" ASE 2017, pp. 84–94. https://par.nsf.gov/biblio/10057926-can-automated-pull-requests-encourage-software-developers-upgrade-out-date-dependencies [snippet-only; DOI 10.1109/ASE.2017.8115621 unverified]
96. He, R., He, H., Zhang, Y. & Zhou, M. (2023). "Automating Dependency Updates in Practice: An Exploratory Study on GitHub Dependabot." *IEEE Transactions on Software Engineering* 49(8). doi:10.1109/TSE.2023.3278129. arXiv:2206.07230. https://arxiv.org/abs/2206.07230 [snippet-only]
97. Wyrich, M., Ghit, R., Haller, T. & Müller, C. (2021). "Bots Don't Mind Waiting, Do They? Comparing the Interaction With Automatically and Manually Created Pull Requests." BotSE 2021. arXiv:2103.03591. https://ieeexplore.ieee.org/document/9474402/ [snippet-only]
98. Rombaut, B., Cogo, F.R., Adams, B. & Hassan, A.E. (2023). "There's no Such Thing as a Free Lunch: Lessons Learned from Exploring the Overhead Introduced by the Greenkeeper Dependency Bot in Npm." *ACM Transactions on Software Engineering and Methodology* 32(1). doi:10.1145/3522587 [snippet-only]
99. Wessel, M., Wiese, I., Steinmacher, I. & Gerosa, M.A. (2021). "Don't Disturb Me: Challenges of Interacting with Software Bots on Open Source Software Projects." *Proc. ACM Hum.-Comput. Interact.* 5(CSCW2). doi:10.1145/3476042. arXiv:2103.13950. https://dl.acm.org/doi/10.1145/3476042 . Also Wessel, M., Abdellatif, A., Wiese, I., Conte, T., Shihab, E., Gerosa, M.A. & Steinmacher, I. (2022). "Bots for Pull Requests: The Good, the Bad, and the Promising." ICSE 2022. doi:10.1145/3510003.3512765 [snippet-only; article number 301 unverified]
100. Murphy-Hill, E., Smith, E.K., Sadowski, C., Jaspan, C., Winter, C., Jorde, M., Knight, A., Trenk, A. & Gross, S. (2019). "Do Developers Discover New Tools On The Toilet?" ICSE 2019, pp. 465–475. doi:10.1109/ICSE.2019.00059. https://research.google/pubs/pub47861 [snippet-only; page range and author list not re-checked]
101. Murphy-Hill, E. & Murphy, G.C. (2011). "Peer Interaction Effectively, Yet Infrequently, Enables Programmers to Discover New Tools." CSCW 2011, pp. 405–414. doi:10.1145/1958824.1958888. Also Murphy-Hill, E., Lee, D.Y., Murphy, G.C. & McGrenere, J. (2015). "How Do Users Discover New Tools in Software Development and Beyond?" *Computer Supported Cooperative Work* 24(5):389–422. doi:10.1007/s10606-015-9230-9 [snippet-only]
102. Brown, C., Middleton, J., Sharma, E. & Murphy-Hill, E. (2017). "How Software Users Recommend Tools to Each Other." VL/HCC 2017, pp. 129–137. https://raw.githubusercontent.com/chbrown13/chbrown13.github.io/master/papers/peer_interactions.pdf [read-full]
103. Cao, J., Chintagunta, P.K. & Li, S. (2023). "From Free to Paid: Monetizing a Non-Advertising-Based App." *Journal of Marketing Research* 60(4):707–727. doi:10.1177/00222437221131562. https://journals.sagepub.com/doi/10.1177/00222437221131562 . Summary: Chicago Booth Review, "How Do You Get People to Pay to Use a Mobile App?" [snippet-only + secondary]
104. Runge, J., Levav, J. & Nair, H.S. (2022). "Price promotions and 'freemium' app monetization." *Quantitative Marketing and Economics* 20(2):101–139. doi:10.1007/s11129-022-09248-3. SSRN 3357275. https://link.springer.com/article/10.1007/s11129-022-09248-3 [snippet-only]
105. Aral, S. & Dhillon, P. (2021; online Aug 2020). "Digital Paywall Design: Implications for Content Demand and Subscriptions." *Management Science*. doi:10.1287/mnsc.2020.3650. SSRN 2906530. https://pubsonline.informs.org/doi/10.1287/mnsc.2020.3650 [snippet-only; volume and pages unverified]
106. Pauwels, K. & Weiss, A. (2008). "Moving from Free to Fee: How Online Firms Market to Change Their Business Model Successfully." *Journal of Marketing* 72(3):14–31. doi:10.1509/jmkg.72.3.014. https://journals.sagepub.com/doi/10.1509/JMKG.72.3.014 [snippet-only]
107. Shampanier, K., Mazar, N. & Ariely, D. (2007). "Zero as a Special Price: The True Value of Free Products." *Marketing Science* 26(6):742–757. https://people.duke.edu/~dandan/webfiles/PapersPI/Zero%20as%20a%20Special%20Price.pdf . Also Hossain, M.T. & Saini, R. (2015). "Free indulgences: Enhanced zero-price effect for hedonic options." *International Journal of Research in Marketing* 32(4):457–460. doi:10.1016/j.ijresmar.2015.10.001 [snippet-only + secondary]
108. Deng, Y., Lambrecht, A. & Liu, Y. (2023). "Spillover Effects and Freemium Strategy in the Mobile App Market." *Management Science*. doi:10.1287/mnsc.2022.4619. SSRN 3149550. https://pubsonline.informs.org/doi/10.1287/mnsc.2022.4619 [snippet-only]
109. Lambrecht, A. & Misra, K. (2017). "Fee or Free: When Should Firms Charge for Online Content?" *Management Science* 63(4):1150–1165. doi:10.1287/mnsc.2015.2383. SSRN 2307961. https://pubsonline.informs.org/doi/abs/10.1287/mnsc.2015.2383 [snippet-only]
110. Miller, K.M., Hofstetter, R., Krohmer, H. & Zhang, Z.J. (2011). "How Should Consumers' Willingness to Pay Be Measured? An Empirical Comparison of State-of-the-Art Approaches." *Journal of Marketing Research* 48(1):172–184. SSRN 1520927. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1520927 [snippet-only]
111. Ding, M., Grewal, R. & Liechty, J. (2005). "Incentive-Aligned Conjoint Analysis." *Journal of Marketing Research* 42(1):67–82. doi:10.1509/jmkr.42.1.67.56890. Also Ding, M. (2007). "An Incentive-Aligned Mechanism for Conjoint Analysis." *Journal of Marketing Research* 44(2):214–223. doi:10.1509/jmkr.44.2.214. https://journals.sagepub.com/doi/10.1509/jmkr.44.2.214 [snippet-only; 2007 pages not re-checked]
112. Wertenbroch, K. & Skiera, B. (2002). "Measuring Consumers' Willingness to Pay at the Point of Purchase." *Journal of Marketing Research* 39(2):228–241. SSRN 285452. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=285452 [snippet-only]
113. Hofstetter, R., Miller, K.M., Krohmer, H. & Zhang, Z.J. (2021). "A de-biased direct question approach to measuring consumers' willingness to pay." *International Journal of Research in Marketing* 38(1):70–84. doi:10.1016/j.ijresmar.2020.04.006. arXiv:2005.11318. https://ideas.repec.org/a/eee/ijrema/v38y2021i1p70-84.html [snippet-only]
114. Misra, K., Schwartz, E.M. & Abernethy, J. (2019). "Dynamic Online Pricing with Incomplete Information Using Multiarmed Bandit Experiments." *Marketing Science* 38(2):226–252. doi:10.1287/mksc.2018.1129. https://pubsonline.informs.org/doi/10.1287/mksc.2018.1129 [snippet-only]
115. Hoffmann, M., Nagle, F. & Zhou, Y. (2024). "The Value of Open Source Software." Harvard Business School Strategy Unit Working Paper No. 24-038. SSRN 4693148. https://www.hbs.edu/ris/Publication%20Files/24-038_51f8444f-502c-4139-8bf2-56eb4b65c58a.pdf . Critique: Open Path (2024). "Questioning 'The Value of Open Source Software'." https://openpath.quest/2024/questioning-the-value-of-open-source-software/ [working paper; snippet-only; critique not read]
116. Fosfuri, A., Giarratana, M.S. & Luzzi, A. (2008). "The Penguin Has Entered the Building: The Commercialization of Open Source Software Products." *Organization Science* 19(2):292–305. doi:10.1287/orsc.1070.0321. https://ideas.repec.org/a/inm/ororsc/v19y2008i2p292-305.html [snippet-only]
117. Bonaccorsi, A., Giannangeli, S. & Rossi, C. (2006). "Entry Strategies Under Competing Standards: Hybrid Business Models in the Open Source Software Industry." *Management Science* 52(7):1085–1098. doi:10.1287/mnsc.1060.0547. https://pubsonline.informs.org/doi/10.1287/mnsc.1060.0547 [snippet-only; n = 146 unverified]
118. Riehle, D. (2012; online 2010). "The single-vendor commercial open source business model." *Information Systems and e-Business Management* 10(1):5–17. doi:10.1007/s10257-010-0149-x. https://link.springer.com/article/10.1007/s10257-010-0149-x . Earlier version: Riehle, D. (2009). "The Commercial Open Source Business Model." AMCIS 2009. [snippet-only]
119. Stewart, K.J., Ammeter, A.P. & Maruping, L.M. (2006). "Impacts of License Choice and Organizational Sponsorship on User Interest and Development Activity in Open Source Software Projects." *Information Systems Research* 17(2):126–144. doi:10.1287/isre.1060.0082. https://pubsonline.informs.org/doi/10.1287/isre.1060.0082 . Also Colazo, J. & Fang, Y. (2009). "Impact of license choice on Open Source Software development activity." *Journal of the American Society for Information Science and Technology* 60(5):997–1011. doi:10.1002/asi.21039 [snippet-only]
120. Foster, D. (2024). "The New Dynamics of Open Source: Relicensing, Forks, & Community Impact." arXiv:2411.04739. Also Foster, D. & Germonprez, M. (2026). "Freeriding and Rebellion: An Investigation of Open Source Vendor Relicensing and Member Hard Forking Events." *Information Systems Journal*, online 8 Sep 2026. doi:10.1111/isj.70060. https://onlinelibrary.wiley.com/doi/10.1111/isj.70060 [preprint + peer-reviewed; snippet-only; any arXiv co-authors not confirmed]
121. Dmitrenko, D. (2026). "Why Memory Components Fail: Eight Years of License and Sustainability Events in Open-Source Data Infrastructure." arXiv:2606.24896. https://arxiv.org/abs/2606.24896 [preprint; snippet-only]
122. Percona (12 Sep 2024). "Valkey Emerges as Leading Open Source Alternative to Redis After Relicensing Row." Press release for the report "Key Value Stores: Adoption Trends Through a Valkey Lens." https://www.businesswire.com/news/home/20240912258232/en/Valkey-Emerges-as-Leading-Open-Source-Alternative-to-Redis-After-Relicensing-Row [vendor; snippet-only]
123. Elastic (29 Aug 2024). "Elastic Announces Open Source License for Elasticsearch and Kibana Source Code." Press release. https://www.businesswire.com/news/home/20240829537786/en/Elastic-Announces-Open-Source-License-for-Elasticsearch-and-Kibana-Source-Code . Also Banon, S. (2024). "Elasticsearch Is Open Source. Again!" Elastic blog. Redis 8 AGPL coverage: InfoQ (May 2025); The Stack, "Redis reverts to open-source." [first-party; unverified this session]
124. HashiCorp, Inc. Form S-1 (Nov 2021). https://www.sec.gov/Archives/edgar/data/1720671/000119312521319849/d205906ds1.htm . GitLab Inc. Form S-1 (Sep 2021). https://www.sec.gov/Archives/edgar/data/1653482/000162828021018818/gitlab-sx1.htm [first-party; snippet-only]
125. Monetizely (n.d.). "What's the Optimal Conversion Rate from Free to Paid in Open Source SaaS?" https://www.getmonetizely.com/articles/whats-the-optimal-conversion-rate-from-free-to-paid-in-open-source-saas [vendor; secondary; snippet-only]
126. Dahlander, L. & Magnusson, M.G. (2005). "Relationships between open source software companies and communities: Observations from Nordic firms." *Research Policy* 34(4):481–493. https://www.sciencedirect.com/science/article/abs/pii/S0048733305000405 [unverified; DOI 10.1016/j.respol.2005.02.003 from memory]
127. Camuffo, A., Cordova, A., Gambardella, A. & Spina, C. (2020). "A Scientific Approach to Entrepreneurial Decision Making: Evidence from a Randomized Control Trial." *Management Science* 66(2):564–586. doi:10.1287/mnsc.2018.3249. Also Camuffo, A., Gambardella, A., Messinese, D., Novelli, E., Paolucci, E. & Spina, C. (2024). "A scientific approach to entrepreneurial decision-making: Large-scale replication and extension." *Strategic Management Journal* 45(6):1209–1237. doi:10.1002/smj.3580. https://sms.onlinelibrary.wiley.com/doi/full/10.1002/smj.3580 [snippet-only]
128. Gruber, M., MacMillan, I.C. & Thompson, J.D. (2008). "Look Before You Leap: Market Opportunity Identification in Emerging Technology Firms." *Management Science* 54(9):1652–1665. doi:10.1287/mnsc.1080.0877. https://pubsonline.informs.org/doi/10.1287/mnsc.1080.0877 [snippet-only]
129. Gruber, M., MacMillan, I.C. & Thompson, J.D. (2013). "Escaping the Prior Knowledge Corridor: What Shapes the Number and Variety of Market Opportunities Identified Before Market Entry of Technology Start-ups?" *Organization Science* 24(1):280–300. doi:10.1287/orsc.1110.0721. https://pubsonline.informs.org/doi/abs/10.1287/orsc.1110.0721 [snippet-only]
130. Franke, N., von Hippel, E. & Schreier, M. (2006). "Finding Commercially Attractive User Innovations: A Test of Lead-User Theory." *Journal of Product Innovation Management* 23(4):301–315. doi:10.1111/j.1540-5885.2006.00203.x. https://onlinelibrary.wiley.com/doi/10.1111/j.1540-5885.2006.00203.x [snippet-only]
131. Molner, S., Prabhu, J.C. & Yadav, M.S. (2019). "Lost in a Universe of Markets: Toward a Theory of Market Scoping for Early-Stage Technologies." *Journal of Marketing* 83(2):37–61. doi:10.1177/0022242918813308. https://journals.sagepub.com/doi/abs/10.1177/0022242918813308 [snippet-only]
132. Brown, B.P., Zablah, A.R., Bellenger, D.N. & Johnston, W.J. (2011). "When do B2B brands influence the decision making of organizational buyers? An examination of the relationship between purchase risk and brand sensitivity." *International Journal of Research in Marketing* 28(3):194–204. SSRN 1764132. https://www.ssrn.com/abstract=1764132 . Also Brown, B.P., Zablah, A.R., Bellenger, D.N. & Donthu, N. (2012). "What factors influence buying center brand sensitivity?" *Industrial Marketing Management* 41:508–520. SSRN 1831686 [snippet-only]
133. Vissa, B. (2012). "Agency in Action: Entrepreneurs' Networking Style and Initiation of Economic Exchange." *Organization Science* 23(2):492–510. doi:10.1287/orsc.1100.0567. SSRN 1262285. https://pubsonline.informs.org/doi/10.1287/orsc.1100.0567 [snippet-only]
134. Morris, M.H., Schindehutte, M. & LaForge, R.W. (2002). "Entrepreneurial Marketing: A Construct for Integrating Emerging Entrepreneurship and Marketing Perspectives." *Journal of Marketing Theory and Practice* 10(4):1–19. The definition was seen quoted in "Re-evaluating Entrepreneurial Marketing," *Journal of Business Strategies* 38(1). https://jbs-ojs-shsu.tdl.org/jbs/article/download/15/5 [secondary; snippet-only; pages unverified]
135. Schreier, M. & Prügl, R. (2008). "Extending Lead-User Theory: Antecedents and Consequences of Consumers' Lead Userness." *Journal of Product Innovation Management* 25(4):331–346. doi:10.1111/j.1540-5885.2008.00305.x. Also Schreier, M., Oberhauser, S. & Prügl, R. (2007). "Lead users and the adoption and diffusion of new products: Insights from two extreme sports communities." *Marketing Letters* 18(1–2):15–30. doi:10.1007/s11002-006-9009-3 [unverified]
136. Vissa, B. (2011). "A Matching Theory of Entrepreneurs' Tie Formation Intentions and Initiation of Economic Exchange." *Academy of Management Journal* 54(1):137–158. doi:10.5465/AMJ.2011.59215084 [secondary; unverified]
137. Gans, J.S., Stern, S. & Wu, J. (2019). "Foundations of entrepreneurial strategy." *Strategic Management Journal* 40(5):736–756. doi:10.1002/smj.3010. SSRN 2844843 [unverified]
138. Larson, A. (1992). "Network Dyads in Entrepreneurial Settings: A Study of the Governance of Exchange Relationships." *Administrative Science Quarterly* 37(1):76–104. doi:10.2307/2393534 [unverified; only the bibliographic details were confirmed]

**Upgraded main-note source.** [58] Lamba, H., Trockman, A., Armanios, D., Kästner, C., Miller, H. & Vasilescu, B. (2020). "Heard it through the Gitvine: an empirical study of tool diffusion across the npm ecosystem." ESEC/FSE 2020. doi:10.1145/3368089.3409705. https://raw.githubusercontent.com/CMUSTRUDEL/cmustrudel.github.io/master/papers/lamba2020diffusion.pdf [now read-full; was unverified]

---

## 1. How do static-analysis and CI tools get adopted, kept and dropped?

- **Developers tolerate few false positives, but more than zero.**
  - Christakis & Bird invited 2,000 randomly chosen Microsoft developers. 375 replied (19%).
  - 90% would accept up to 5% false positives, 47% up to 15% and 24% up to 20%. The authors suggest aiming no higher than 15–20%.
  - Developers care much more about false positives than about missed issues. Yet when asked to choose between fewer false positives and more real issues found, they split almost evenly (49.3% vs 50.7%).
  - (Corrected: 5% is the rate nearly all developers accept. It is not a hard limit.) [77] [research; one firm; random invitation, 19% response; self-reported; read-full]
- **Developers ask for diff-only analysis, speed, suppression and suggested fixes.**
  - 16% have analysis of just the changed code and use it. Another 56% lack it but call it important, 72% in all.
  - 21% want results in seconds. 53% would wait several minutes.
  - On when checks should run:
    - 25% said on every compile.
    - 24% said after the change is done but before review.
    - 10% said nightly.
    - 23% said at every stage.
  - 46% use warning suppression. Only 8% use custom rules, and 26% call them important.
  - 54% would look through up to 10 suggested fixes.
  - Preferred places to see warnings, in order: editor, build output, code review, browser. Code review is not the first choice. [77] [research; one firm; self-reported; read-full]
- **Developers who quit analyzers did so for team reasons and for fit.**
  - 9% had used an analyzer and stopped. Their reasons:
    - 24% said team policy no longer required it.
    - 18% had moved to a team that did not use one.
    - 21% found no analyzer that fit, about half of them because of language.
  - Team reasons add up to 42%, which is not a majority.
  - (Corrected: an earlier draft said quitting was mostly about the team, not the tool.) [77] [research; one firm; self-reported; read-full]
- **At Google, results kept outside the workflow were rarely fixed.**
  - A company-wide FindBugs "fixit" in May 2009 covered 9,473 warnings.
  - 3,954 were reviewed (42%), and 1,746 bug reports were filed (44% of those reviewed).
  - 640 were fixed. That is 16% of reviewed warnings and about 7% of all warnings.
  - Google then moved analysis into code review.
  - The claim that a separate bug dashboard "saw little use" was not seen. [78] [first-party; one firm; practitioner article; snippet-only]
- **Google's bar is under 10% "effective false positives".**
  - An effective false positive is any finding the developer takes no positive action on. That includes real bugs the developer did not understand.
  - Reviewers can click "Please fix" and authors can click "Not useful".
  - An analyzer with a high "Not useful" rate goes on probation. It is disabled if its authors do not improve it. Disabling is not automatic at 10%.
  - The overall effective false-positive rate is just below 5%. There are more than 100 analyzers across more than 30 languages.
  - Each day, reviewers click "Please fix" thousands of times, authors apply about 3,000 automated fixes, and analyzers get about 250 "Not useful" clicks.
  - Tricorder, Google's code-review analysis platform, followed several failed attempts. The chapter credits a "relentless focus" on delivering only valuable results.
  - For Java and C++, Google aims never to issue compiler warnings, because developers ignore them. Checks that cannot break the build are either suppressed or shown in code review.
  - In one case, rewriting a confusing message was enough to stop the bug reports filed against a check.
  - (Corrected: the chapter was written by Sadowski alone and edited by Carey. It does not say that every check either breaks the build or stays hidden.) [78][79] [first-party; one firm; mandatory code review; chapter read-full; papers snippet-only]
- **At Facebook, the same analysis was fixed far more often at diff time.**
  - When Infer posted findings as code-review comments on a diff, the fix rate rose to over 70%.
  - The same analysis, with the same false-positive rate, run offline as bug lists outside the workflow, had a fix rate near 0%.
  - A 2015 company blog post put Infer's fix rate at about 80% over several months.
  - This is one firm comparing its own two deployment modes. It is not a controlled trial. [80] [first-party; one firm; not controlled; snippet-only]
- **Alerts that sit in a backlog get fixed late, or rarely.**
  - **Imtiaz et al.:** five long-running open-source projects that had used Coverity for at least five years.
    - 27.4–49.5% of alerts were fixed through code changes (median 36.7%).
    - Fixes were tiny (median 4 lines) but slow (median 96 days; range 36–245).
  - **Marcilio et al.:** 421,976 issues from 246 projects across four SonarQube instances.
    - About 13% per project were resolved, 8.77% of all issues.
    - Issues that were fixed took a median of 18.99 days.
  - In Marcilio et al.'s survey of 18 developers (23% completion), over 80% called the warnings relevant. Only 22% reject PRs over them.
  - Neither study compares dashboards with delivery at PR time. Marcilio et al. suggest that only some checkers flag real problems.
  - (Corrected: an earlier draft blamed the dashboard for the backlog. Slow fixes fit the Coverity data, not the SonarQube data.) [82][83] [research; peer-reviewed; observational; few projects; tiny survey; [82] abstract read; [83] read-full]
- **Repos tend to keep the first tool they install.**
  - Kavaler et al. studied 54,440 npm projects:
    - 38,948 adopted at least one linter, coverage or dependency tool.
    - 12,109 adopted more than one.
    - 2,283 switched tools for the same task.
  - Choices looked casual. Only 47 issue threads discussed them. Of 32 linter threads, 16 cited features, 15 ease of installation and 8 personal preference or past use.
  - Coverage-tool adoptions: coveralls 11,221, codecov 2,785, codeclimate 2,328.
  - Switches ran one way, for example JSHint to ESLint and coveralls to codecov. Codecov was preferred for direct GitHub integration and a better user experience.
  - Every tool with a significant effect showed an immediate jump in monthly issues after adoption. All but ESLint then showed a declining trend.
  - "Churn" in this paper means code churn, not lost customers. [81] [research; peer-reviewed (ICSE 2019); observational; open source only; read-full]
- **Most projects run analyzers on their default settings.**
  - Beller et al. studied nine analyzers across Java, JavaScript, Ruby and Python. They looked at 122 projects in depth and 168,214 more broadly.
  - Use was widespread but not universal. Projects rarely enforced a strict policy.
  - Configurations stayed close to the defaults, and few projects added custom checks. Configurations rarely changed. When they did, the changes were small and usually came within a day of setup.
  - The configuration findings match the abstract as remembered, but were not seen this session. [86] [research; peer-reviewed; large n; observational; snippet-only; configuration details unverified]
- **Developers think analysis is useful, yet many do not use it.**
  - In 20 interviews, every developer called static analysis beneficial.
  - The barriers they named:
    - false positives and too many warnings
    - warnings that do not explain the problem well enough
    - weak quick fixes
    - hard configuration
    - poor ways to share settings across a team
    - poor fit with the workflow
  - All 20 wanted to hear about issues in the editor or at build time, as reported by [77].
  - Not verified: the counts "19 of 20" on poor explanation and "9" on team support. [84] [research; peer-reviewed; small n; qualitative; snippet-only]
- **A commercial lesson: a finding the user does not understand counts as false.**
  - Coverity's founders aimed for under 20% false positives in stable checkers.
  - They dropped or simplified checks whose results were hard to explain.
  - Their account of selling through trials on the prospect's own code is from memory. It was not seen this session. [85] [first-party; practitioner essay; snippet-only]
- **In CI, style checks break builds and bug finders run in a soft mode.**
  - Zampetti et al. studied 20 Java open-source projects on Travis CI. Build breakages came mainly from coding-guideline checks. Bug and vulnerability checks rarely failed builds [87].
  - Vassallo et al. report that developers use analyzers in CI 37% of the time, in code review 29% and locally 31% [88].
  - Not verified: that failures were fixed by changing code rather than by disabling checks, and Vassallo's breakdown of warning types by context. [research; peer-reviewed; small n; snippet-only]
- **An LLM reviewer at one firm had 73.8% of its comments marked resolved.**
  - It ran at one industrial firm and was built on an open-source PR-review agent. About 238 practitioners in 10 projects had access.
  - Three projects were analysed: 4,335 PRs, 1,568 of them reviewed automatically.
  - "Resolved" may include dismissals, so it is not the same as fixed.
  - Not verified: longer PR closure times, and complaints about wrong or irrelevant comments. [89] [research; peer-reviewed (ICSE-SEIP 2025); one firm; observational; snippet-only]

## 2. PR bots, and how developers find tools

- **A fix that applies in one click is taken up far more than advice written as text.**
  - Brown & Parnin studied GitHub "suggested changes" in 22 top-forked projects from October 2018. The data were 152,030 review comments, including 17,712 suggested changes, on 51,250 PRs.
  - 59.6% of suggested changes were incorporated (10,556 of 17,712). Only 0.9% of review comments containing plain code blocks were (65 of 6,937).
  - Neither type changed whether the PR was merged (69.4% vs 69.3%, p = 0.89).
  - PRs with suggestions took over twice as long to merge (median 5.0 vs 1.1 days; mean 16.4 vs 6.4). Suggestions were made and accepted faster than code in comments.
  - In a small survey (43 replies, a 7.4% response rate), about 92% of recipients and 79% of authors rated the feature useful.
  - The 0.9% is probably too low. Code in a comment counted only if it later appeared exactly in a commit, and such code is often just illustration. Do not quote "60x".
  - These are suggestions from peers, not from vendor bots. [90] [research; peer-reviewed (ESEC/FSE 2020); observational; small self-selected survey; read-full]
- **Developers say they would adopt a tool through a fix or a PR, not an email.**
  - 14 professional developers, with about 5 years' experience on average, rated ways of recommending a static-analysis tool on a 1–5 scale.
  - Mean scores: suggested change 4.0, PR 3.71, issue 2.86, email 2.36 (p < 0.001).
  - 11 of 14 rated email 1–2. Their comments included "spam" and "intruded upon". An issue without a code example read as "spammy".
  - In a related survey, all 15 developers preferred a recommendation they could act on to a static one.
  - This ranks channels for a recommendation the developer is already looking at. It does not support unsolicited PRs; see the next bullet. [94] [research; workshop papers; lab think-aloud; small n; stated preference; read-full]
- **Unsolicited PRs that add a tool almost never work.**
  - A bot opened 52 PRs adding the Error Prone analyzer to Java/Maven projects' build files, with sample output.
  - Over one week, 2 were merged (4%), 10 closed (19%) and 40 got no response (77%). One merged PR was later reverted because it broke the build.
  - There were 18 human responses. 5 complained that the edit did not match the file's formatting. 8 said the tool broke the build by flagging errors in existing code.
  - In the pilot, GitHub flagged the bot's account within hours. The authors then used an account that looked human. A vendor doing that would be deceiving people. [93] [research; workshop; field study; small n; one tool; read-full]
- **Code-review bots changed PR activity in open-source projects.**
  - Wessel et al. used a regression discontinuity design. They compared the year before and the year after projects adopted codecov-io, coveralls, ansibot or elasticmachine.
  - After adoption, projects had more merged PRs per month, fewer unmerged PRs, less discussion, and faster rejections.
  - The journal extension added 12 practitioner interviews. Maintainers credited the transparency and confidence that bot comments add. It also reports that merging took longer.
  - Effect sizes were not captured. Every project chose to install its bot. The outcome is PR activity, not adoption or payment.
  - A later study of 662 projects adopting GitHub Actions found:
    - more rejected PRs
    - more comments on accepted PRs and fewer on rejected ones
    - fewer commits in accepted PRs
    - more time to accept a PR
  - [91][92] [research; peer-reviewed; quasi-experimental (regression discontinuity); open source; snippet-only]
- **Bot PRs are merged less often, and teams turn them down.**
  - Wyrich et al.: human PRs were merged 72.53% of the time and bot PRs 37.38%. Bot PRs waited longer for any response, even though they were smaller [97].
  - He et al. studied 1,823 projects and 502,752 Dependabot PRs, and surveyed 131 developers [96]:
    - Projects reduced how far behind their dependencies were, and developers were receptive to the PRs.
    - But developers configured the bot to send fewer notifications.
    - 11.3% of projects later dropped it for alternatives.
    - Its compatibility scores were too sparse to ease worries that updates would break code.
  - Rombaut et al.: Greenkeeper opened 93,196 issues and accounted for half of all issues in its client projects. 19.8% of developer comments called an issue a false alarm [98].
  - Mirhosseini & Parnin studied 7,470 projects [95]:
    - Projects with automated PRs upgraded dependencies 1.6x as often as projects with no tool. Projects with badges upgraded 1.4x as often.
    - About 32% of the automated PRs were merged.
    - Projects chose their tools, so this is not causal.
  - [research; peer-reviewed; observational; snippet-only]
- **Noise is the main complaint about PR bots.**
  - In 21 interviews, maintainers, contributors and bot developers named noise as the central problem. It overwhelms and distracts developers, and it disrupts both communication and workflow.
  - A follow-up with 32 practitioners produced 22 design strategies. One is a "mediator" that summarizes other bots' output.
  - Not verified: the specific kinds of noise (long comments, visual clutter, frequency and timing, unsolicited actions). [99] [research; peer-reviewed; qualitative; snippet-only]
- **Tools spread through people who commit to many repos, and through visible badges.**
  - Lamba et al. tracked 92 badge types across 168,510 npm-linked repos, using survival models.
  - Exposure through co-committers' other projects was the strongest social channel. It mattered much more than exposure through watchers.
  - Ties through dependencies, and to repos with similar READMEs, also predicted adoption. For Coveralls, the adoption rate rose 1.73x for each e-fold rise in direct dependencies that had already adopted it.
  - Repos that already showed badges adopted more tools.
  - A competitor's badge lowered adoption of CI services (Travis, Circle, Codeship), though not Appveyor. Coverage tools mostly showed no competitor effect.
  - This upgrades main-note source [58] from unverified to read-full. The links are associations only. The outcome is badges, not revenue, and the data cover npm only. [58] [research; peer-reviewed (ESEC/FSE 2020); observational; read-full]
- **Peers are the best way to discover tools, but it happens rarely.**
  - Murphy-Hill et al. ran interviews with 18 programmers and a diary study of 76 software users at work [101]:
    - Peers were rated the most effective way to find tools.
    - Peer discovery happened only about once every few months. That rate comes from the diary study of software users in general, not only programmers.
  - In a lab study of 13 pairs and 142 recommendations, only the recipient's receptiveness predicted uptake (p = 0.0002) [102]:
    - About 61% of recommendations to receptive people worked.
    - Politeness and persuasiveness made no difference.
  - [research; peer-reviewed; interviews, diary and lab; small n; [101] snippet-only; [102] read-full]
- **Short "one problem, one tool" flyers raised tool use inside one firm.**
  - Causal-inference methods over six years linked Google's "Testing on the Toilet" flyers to more use of the tools they featured.
  - The effect depended on how broadly a tool applied, how many developers already used it, and how memorable its name was.
  - The authors also interviewed or surveyed 382 developers. Effect sizes were not captured.
  - The tools were free and internal, and the audience was captive. [100] [research; peer-reviewed (ICSE 2019); quasi-experimental; one firm; snippet-only]
- **Related, in the main note:** 75% of developers start a free trial and 72% ask developers they know [34]. Honest README badges are cheap signals [36]. [34] [first-party; self-selected]; [36] [research; read-full]

## 3. Free to paid, and pricing with little data

- **When an app began charging its free users, a hard paywall converted more of them than a limited free tier.**
  - A Chinese app firm selling educational articles, e-books and audiobooks had given users full free access. From January 2019 it ran a large randomized test for 80 days.
  - A "hard landing" (pay or lose access) produced more subscriptions than a "soft landing" that kept a limited free tier.
  - Exclusive extras for payers also lowered willingness to subscribe. The two choices interacted: extras hurt less when combined with a soft landing.
  - The authors' explanation is that a limited free tier makes the paid version seem less valuable.
  - Only conversion was captured. Effects on free-user churn, word of mouth and long-run revenue were not.
  - (Corrected: the snippets do not show that extras raised subscriptions within the soft-landing group. An "avatar feature" detail was not verified.) [103] [research; randomized field experiment; one firm; consumer app; snippet-only + secondary]
- **A smaller free allowance traded reading for subscriptions.**
  - The New York Times cut both the number of free articles and the sections readable for free.
  - Total subscriptions rose 31% over the seven-month study, and content demand fell.
  - Not verified: the 9.9% fall in demand and the net revenue gain of over $230,000.
  - The publisher's brand was very strong. An unknown tool depends on free use just to be found. [105] [research; peer-reviewed; quasi-experiment; one firm; snippet-only]
- **Charging shrinks the free funnel and weakens free channels.**
  - An online content firm added a paid tier. Free sign-ups fell, and search referrals and emails worked less well.
  - Paid subscribers still added about $277 a day in revenue, against $4.64 a day of lost ad revenue.
  - Not verified: 208 fewer free sign-ups a day, and 71 a day lost through weaker marketing.
  - At this firm, a free user brought in only ad revenue. In the main note's cloud-storage case, a free user was worth about $0.52 a month, 44% of it through referrals [46]. [106] [research; peer-reviewed; observational time series; one firm; snippet-only]
- **A free version can raise demand for the paid version.**
  - In Apple's App Store, launching a free version of a paid app raised the paid version's daily ratings by 8.9%. Ratings serve as a stand-in for demand.
  - The design relies on the fact that Apple's review process makes the launch date of the free version hard to predict.
  - The authors credit sampling and easier discovery.
  - These are consumer apps. The study says nothing about moving an existing free base to paid. [108] [research; peer-reviewed; quasi-experiment; consumer apps; snippet-only]
- **Discounts on purchases raised conversion without teaching users to wait for them.**
  - In a free-to-play game, each new cohort of users was randomly assigned to see price promotions or not.
  - Conversion and revenue rose. There was no evidence that users learned to wait for discounts, or took discounts as a sign of low quality.
  - Not verified: lifts of 37% in conversion and about 24% in revenue, the six-month window, and the phrase "remarkably profitable … in both the short and long run".
  - (Corrected: the abstract says only that promotions appear profitable.) [104] [research; randomized field experiment; one firm; consumer game; snippet-only]
- **How much to give away free can change over time.**
  - A theory model shows it can pay to give more away when demand is high and to charge more when it is low. This holds when users differ in how much they value the content and those differences shift over time.
  - One content provider's data showed it raised the free share in periods of high demand.
  - (Corrected: the paper says this "may" be optimal, and only under those conditions. A claim about which kinds of user to charge only in quiet periods was not verified.) [109] [research; peer-reviewed; theory plus one firm's data; snippet-only]
- **Zero is a special price.**
  - Two chocolates each fell by one cent, which made the cheaper one free. Demand shifted to the free one far more than a cost-benefit model predicts.
  - In a cafeteria version, prices went from 1¢ and 14¢ to 0¢ and 13¢. The cheap chocolate's share rose from 15% to 34%. The premium one's fell from 38% to 16%.
  - Experiment 1 had 398 people. The popular figures (27/73 becoming 69/31) leave out a "nothing" option that the paper included.
  - The effect is stronger for hedonic items.
  - The stakes were small and the goods were consumer goods. A developer tool is practical and chosen with care, so the effect may be weaker. [107] [research; peer-reviewed; lab and field choice experiments; snippet-only + secondary]
- **Stated willingness to pay runs high, but it may still rank prices correctly.**
  - Miller et al. compared four ways of measuring willingness to pay against real purchases.
  - The two incentive-aligned methods passed: BDM (a binding bid against a random price) and incentive-aligned conjoint. The two hypothetical methods, an open question and hypothetical conjoint, overstated willingness to pay.
  - Even so, the hypothetical methods may still point to the right demand curve and the right price.
  - This fits the 21% hypothetical bias in the main note [8]. The product and sample size were not captured. [110] [research; peer-reviewed; method comparison; consumer product; snippet-only]
- **Answers with real consequences predict real choices better.**
  - In incentive-aligned conjoint, a respondent may actually get or buy an option they chose. It beat hypothetical conjoint at predicting later choices, for restaurant dinner specials and for snacks.
  - A later mechanism needs only one real product to exist, and it makes telling the truth the best strategy. On an iPod package it "substantially" improved purchase prediction.
  - The tests used meals, snacks and an iPod. Using a real discounted plan as the reward for software is untested. [111] [research; peer-reviewed; field and lab experiments; snippet-only]
- **BDM measures willingness to pay one person at a time.**
  - Each person states a price, and then a price is drawn at random. If the drawn price is at or below their stated price, they must buy, paying the drawn price.
  - Across three studies, BDM gave lower estimates than open and yes/no questions. Study 3 showed that the gap comes from the binding purchase, not from the effort of answering.
  - The studies used groceries and one cheap durable. In B2B, the person answering may not control the budget.
  - (Corrected: an earlier draft said BDM was tested only on groceries.) [112] [research; peer-reviewed; field studies; cheap consumer goods; snippet-only]
- **A single direct price question can be good enough once corrected.**
  - Hofstetter et al. measure the bias in a single open or yes/no price question, and correct for it.
  - They report that the corrected answer is accurate enough for management decisions.
  - The correction was estimated on consumer products. [113] [research; peer-reviewed; consumer products; snippet-only]
- **Bandit price tests lower the cost of testing, but still need buyers.**
  - A bandit test shifts traffic toward the better-performing prices as results come in.
  - In a simulation based on a real pricing experiment, profit rose 43% during the test month and 4% over a year. The comparison was presumably an even traffic split, but that was not confirmed.
  - The method still needs a live checkout and a steady flow of buyers. Compare the roughly 7,900 prospects a month in the main note's pricing test [50]. [114] [research; peer-reviewed; simulation; snippet-only]

## 4. Commercial open source

- **Open source creates far more value than it captures.**
  - Hoffmann et al. estimate it would cost $4.15B to write the widely used open-source code once. It would cost about $8.8 trillion for every firm that uses it to replace it.
  - Without open source, firms would spend about 3.5x what they now spend on software.
  - About 96% of the value comes from 5% of developers. Six languages account for 84%.
  - These are estimates of replacement cost, not revenue. The data are Census II, built by the Linux Foundation with Harvard's innovation lab, and scans of websites by BuiltWith.
  - A published critique exists but was not read. Whether the Linux Foundation funded the paper was not verified. [115] [research; working paper; counterfactual estimate; snippet-only]
- **Established firms open their code when they earn money from something else.**
  - Fosfuri et al. studied firms' open-source product releases, as announced in the trade press from 1995 to 2003.
  - Firms with many software patents or hardware trademarks were more likely to release open source. Firms with many software trademarks were less likely.
  - The authors read this as firms opening code when other assets capture the value.
  - These were established firms, not startups. The sample size was not seen. [116] [research; peer-reviewed; observational; snippet-only]
- **Mixing open and paid products is normal among small open-source suppliers.**
  - In a survey of Italian firms that supply open-source software, most mixed proprietary and open-source products under different licences.
  - Purely open-source firms were not the norm. The sample was firms already active in open source, not software firms in general.
  - The study shows that mixed models are common, not that they perform better. The sample size of 146 was not seen. [117] [research; peer-reviewed; cross-sectional survey; one country; snippet-only]
- **"1–2% of open-source users pay" is relayed lore.**
  - Riehle writes that, "according to Taylor", conversion rates of 0.5–2% are common for single-vendor commercial open-source firms. He does not measure this himself [118].
  - A vendor blog gives 0.5–3% for open-source SaaS. It also offers a "rule of 3s": 0.3–1% for mass-market developer tools, 1–3% for enterprise, 3%+ exceptional. It cites OpenView data but gives no primary source [125].
  - Not verified: Riehle's ratio of 50x–500x users to customers, and his comparison of sales spend with R&D spend.
  - (Corrected: the 0.5–2% is Riehle passing on another source, not his own claim.) [118] [research; conceptual; figure second-hand; snippet-only]; [125] [vendor; secondary; snippet-only]
- **IPO filings give no usable conversion rate.**
  - HashiCorp's S-1 reports about 100 million downloads in fiscal 2021. At 31 July 2021 it had 2,101 customers: 558 paying over $100k a year and 58 over $1M.
  - GitLab's S-1 estimates over 30 million registered users. Its "Base Customers" rose 71%, from 2,126 at 31 July 2020 to 3,632 at 31 July 2021.
  - Downloads and registered users are not organizations. A ratio built from these numbers divides unlike units, so do not use one.
  - The revenue threshold that defines a GitLab Base Customer was not re-verified. [124] [first-party; SEC filings; snippet-only]
- **License choice has no consistent effect on adoption.**
  - Stewart et al.: users were most drawn to projects with permissive licences and non-commercial sponsors. The licence's effect on development activity depended on the type of sponsor.
  - Colazo & Fang studied 62 projects. Copyleft licences went with more developers, more coding and faster development.
  - Both studies predate GitHub and cover volunteer projects.
  - (Corrected: Stewart et al. link sponsorship to user interest, not to development activity. So the two studies do not simply contradict each other.) [119] [research; peer-reviewed; observational; small n; snippet-only]
- **Relicensing lost few contributors but disrupted users.**
  - In Elasticsearch, the vendor's own employees made over 95% of the changed lines both before and after the 2021 relicense. There were few outside contributors to lose, so the effect fell mainly on users.
  - Redis had more outside contributors. Trade press reported that it lost most of them after relicensing.
  - Forks led by users drew contributors from more organizations, especially under neutral foundations.
  - A companion paper on the same three cases finds that vendors justify relicensing by pointing to freeriding. Community members respond by moving to forks.
  - Not verified:
    - Terraform's two outside contributors.
    - None of OpenTofu's contributors having contributed to Terraform before.
    - Redis's 24 outside contributors, 37.5% of whom went quiet.
    - Valkey growing from 18 to 49 contributors.
  - [120] [research; preprint plus peer-reviewed paper; three cases; descriptive; snippet-only]
- **Single-vendor, venture-backed projects had far more licence events.**
  - A preprint followed 105 author-selected data-infrastructure and AI-tooling projects from 2018 to May 2026. It counted 38 events. An event was one of:
    - relicensing to source-available
    - moving features into a paid edition
    - deprecating the open edition
    - archiving the project
  - About 24% of projects had at least one event.
  - 46% of single-vendor venture-backed projects had one, against 2.5% of foundation-run projects funded outside the venture cycle. That is about 18x.
  - Events rose from 2.7 a year to 4.2 a year. [121] [research; preprint; single author; author-selected sample; small n; observational; snippet-only]
- **After a relicense, many said they would consider switching, but few had switched.**
  - Percona, a vendor that sells Valkey support, surveyed 151 IT professionals in 2024.
  - 67% ran Redis. Of those, 75% were testing, considering or already using Valkey. 83% of large enterprises had adopted it or were exploring it.
  - Not verified: that only 8% were already using Valkey, and that outside analysts validated the survey.
  - The sponsor gains when people switch, and stated intent overstates action (main note [9]). [122] [vendor; self-selected; stated intent; snippet-only]
- **Two prominent relicensers later added an open-source licence back.**
  - Elastic added AGPLv3 as a third licence option in August 2024, about 3.6 years after it left open source. Its founder said the 2021 change had worked.
  - Redis offered Redis 8 under AGPLv3 in May 2025, about a year after it left BSD.
  - There are no public data on how either move changed downloads, adoption or revenue.
  - Both points rest on the verifier's own knowledge, because the sources were blocked. [123] [first-party; self-interested; unverified this session]
- **Related, in the main note:** engaging with open source is linked to raising funding [52]. Commercial open-source companies exit at higher values [60]. [52] [research; observational; snippet-only]; [60] [vendor; secondary]

## 5. Choosing a first segment and winning first deals

- **Teaching founders to test ideas as hypotheses makes them drop bad ones.**
  - The first trial covered 116 Italian startups over about a year. Founders who were taught to test hypotheses performed better and pivoted more. They were not more likely to drop out early.
  - A pooled replication covered 759 firms across four trials run from 2016 to 2019:
    - Treated founders dropped more ideas.
    - The number of pivots did not simply rise. Treated firms more often made one or two pivots than none or three or more.
  - On revenue, the sources conflict. One search summary gives +€6,999 in cumulative revenue (p = 0.008). The main note says the replication found no clear revenue effect. Cite neither until the full text is read.
  - The founders were in training programmes, and the choice of segment was not tested directly. This study is also summarised in research/startup-risk-and-opportunity.md §3.
  - (Corrected: the first trial did not show more dropping out. The effect on dropped ideas comes from the pooled sample.) [127] [research; randomized; pooled replication; snippet-only]
- **Founders who listed several markets before entering one did better, but each extra option added less.**
  - The study covers 83 venture-backed technology firms whose technology could serve several markets.
  - Firms that identified a set of market opportunities before their first entry reported better performance. Each extra opportunity added less than the one before.
  - Serial founders were more likely to do this.
  - The firms are survivors and the link is correlational. The best number of options is not known. [128] [research; peer-reviewed; small n; observational; cross-sectional; snippet-only]
- **Founders' candidate markets mirror their own background.**
  - The study covers 496 technology ventures, through interviews with founders.
  - Teams with more varied industry experience, and more varied outside sources of knowledge, found more market opportunities, and more distant ones.
  - Technical expertise affected the variety of opportunities more than their number. [129] [research; peer-reviewed; observational; self-report; snippet-only]
- **Screen lead users on two separate traits.**
  - In an online kite-surfing community, 140 of 452 respondents (30.9%) had an idea to improve the equipment.
  - Expecting a high benefit predicted who innovated. Being ahead of the trend predicted whose ideas were commercially attractive. Each trait added information the other did not.
  - Not verified: the six-expert rating panel, the demographic figures and the overlap between community samples.
  - This is a consumer extreme sport. It extends main-note sources [21][22]. [130] [research; peer-reviewed; one community; self-selected online sample; snippet-only]
- **In six cases, locking onto a target market early went with failure.**
  - Molner et al. followed six early-stage technologies at one research university for several years.
  - The failed projects emphasised target markets the most. The biggest successes emphasised them the least and accepted uncertainty about the market.
  - These are six university technology-transfer cases, not software startups. The study builds theory and does not test it. The counts of documents and emails were not seen. [131] [research; peer-reviewed; qualitative; n = 6; snippet-only]
- **Business buyers' reliance on brands does not simply rise or fall with risk.**
  - Interviews suggested that buyers use brands as a shortcut to reduce risk. A scenario study (206 buying-unit members) and a field survey (180) supported a nonlinear link between purchase risk and how much buyers weigh the brand.
  - A companion study of 273 buying-centre members found that brand weight rose and then fell as a purchase grew more important. For purchase complexity it found the reverse pattern (falling, then rising), depending on how tangible the product was.
  - These are traditional buying centres, not developers adopting tools from the bottom up. [132] [research; peer-reviewed; survey plus scenario experiment; snippet-only]
- **Reaching beyond referrals went with more new deals.**
  - Vissa coded the business cards of new contacts made over two months by Indian entrepreneurs running B2B ventures.
  - Those who widened their networks started more new business relationships, partly because they relied less on referrals. Those who deepened existing ties started fewer.
  - These relationships may include suppliers and partners, not only customers. The panel size was not seen. [133] [research; peer-reviewed; observational; one country; snippet-only]
- **A definition, not evidence.** Entrepreneurial marketing is defined as "the proactive identification and exploitation of opportunities for acquiring and retaining profitable customers through innovative approaches to risk management, resource leveraging and value creation". It has seven dimensions. No evidence was found that any of them improves outcomes. [134] [research; conceptual; secondary; snippet-only]
- **Related, in the main note:** lead users [21][22]; a few deep customer relationships [23]; references that look like the next prospect [24]; biased early users [14]. [research; see the main note for marks]

## 6. Gaps: what no study answers

- No study links any adoption outcome (fixes, merges, badges, stars) to signups, payment or retention for the vendor of an analyzer, linter, CI tool or PR bot.
- No study measures free-to-paid conversion or willingness to pay among developers or B2B software buyers. None covers settings where the user is not the budget holder. Every study of willingness-to-pay methods here uses consumer goods.
- No study of a B2B SaaS or developer tool moving from free to paid. The nearest settings are content sites, a consumer app, a game and Apple's App Store.
- No academic study of finding a SaaS price with little traffic. That includes fake-door price tests, Van Westendorp, Gabor-Granger and founding-member prices.
- No measured conversion from open-source users to paying customers with a defined base, such as active organizations.
- No causal study of how a licence change affects adoption, downloads or revenue.
- No controlled comparison of delivering findings at PR time against a dashboard. The evidence is two firms' own reports and observational data on backlogs.
- No long-run data on keeping or dropping LLM-based PR reviewers beyond one firm. Dependabot's 11.3% drop rate is the closest thing to an abandonment rate for a PR bot.
- No research on database, SQL or query-performance analyzers specifically.
- Only one field test of unsolicited tool PRs (n = 52, one tool, one week). Nothing on how platforms enforce spam rules against promotional PRs.
- No study tests how to choose a first segment for B2B SaaS or developer tools. The lead-user evidence comes from consumer sports. The brand evidence comes from traditional buying centres.
- Not searched (budget ran out):
  - **Static analysis:** Imtiaz et al. on open-source alert synopses; the FindBugs fixit paper (ISSTA 2010); "Quieting the Static" (arXiv:2311.07482); an FSE 2025 study of suppressed warnings.
  - **Bots:** Farah et al. 2022; the "Together or Apart" mediator-bot evaluation; Erlenhov et al. 2020; Xiao, Witschey & Murphy-Hill 2014; Witschey et al. 2015; Alfadel et al. 2021; Kinsman et al. 2021; Saroar & Nayebi 2023; arXiv:2208.01624; arXiv:2211.13063.
  - **Pricing:** Rietveld 2018; Koch & Benlian 2017; Halbheer et al. 2014; Voelckner 2006; Dong, Ding & Huber 2010; Steiner & Hendus 2012; Chiou & Tucker 2013.
  - **Open source:** Lerner & Tirole 2005; Fershtman & Gandal 2007; Lerner & Schankerman 2010; Nagle 2019; Alexy et al. 2018; August, Chen & Zhu 2021; Vendome et al. 2017; post-fork adoption data.
  - **Segments:** Dencker & Gruber 2015; Grégoire & Shepherd 2012; the Market Opportunity Navigator. Bibliographic details only for Homburg, Klarmann & Schmitt 2010 and Morrison, Roberts & Midgley 2004.

## Not verified

Do not cite these without a primary source.

- **Sources not checked this session.** Only bibliographic details were confirmed, or the content is from memory:
  - Dahlander & Magnusson [126]. Reported: four Nordic open-source firms had one of three kinds of relationship with their communities: symbiotic, commensalistic or parasitic. The symbiotic kind gave more influence but was harder to manage.
  - Schreier & Prügl; Schreier, Oberhauser & Prügl [135]. Reported: lead users adopt new products sooner and more heavily, find new technology less complex, and act as opinion leaders.
  - Vissa 2011 [136]. Reported: entrepreneurs formed ties based on both social similarity and how well the businesses complemented each other. The detail about caste and language comes from secondary sources only.
  - Gans, Stern & Wu [137]. Reported: a founder can end up with several viable strategies and must choose which to give up. This is conceptual, with no data.
  - Larson [138]. Reported: key business relationships grew out of earlier personal ties and reputation, built up through trial periods, and came to rest on trust.
  - The Elastic and Redis licence reversals [123].
- **Statistics with no traceable source:**
  - "Developers agree to fix 93% of automated code-review comments", attributed to Google. No source paper was found.
  - One database-tool vendor's claim that 90–95% of its new paying customers started as community users.
  - "Developer-focused companies had a median free-to-paid conversion of about 5%, half that of others." This was not in the article it was credited to.
  - Murgia et al. (2016, CHI Extended Abstracts): bots that look human got better responses on Stack Overflow. Copying this commercially would deceive people.
- **Conflicts to resolve:**
  - Wessel et al.'s sample is given as 1,194 or as 1,466 projects. The two verification passes disagree about which paper holds which number [91].
  - The revenue effect in the Camuffo replication [127].
  - Which way the Tricorder ratio runs: "Please fix" against "Not useful", or the share of "Not useful" clicks [78].
  - The main note gives an unverified 8.9% revenue figure for [51]. It matches Deng et al.'s 8.9% rise in ratings [108] and may be a mix-up. Check both.
- **Numbers that need the full text before anyone quotes them:**
  - **Section 1 (static analysis and CI):**
    - Google: "the dashboard saw little use" [78].
    - Johnson et al.: 19 of 20, the count of 9, and the DOI [84].
    - Bessey et al.: selling through trials [85].
    - Beller et al.: the configuration findings [86].
    - Zampetti et al.: fixes made by changing code, and licence checks [87].
    - Vassallo et al.: warning types by context [88].
    - Cihan et al.: PR closure time rising from about 5h52m to 8h20m, and the complaints [89].
  - **Section 2 (PR bots and discovery):**
    - Wessel et al.: effect sizes, whether the ICSME paper itself reports longer time to merge, and the per-bot project counts (about 460 and 730) [91].
    - Mirhosseini & Parnin: the DOI, and whether the 32% comes from the paper or a later summary [95].
    - "Don't Disturb Me": the article number and the kinds of noise [99].
    - Testing on the Toilet: effect sizes [100].
    - Murphy-Hill et al.: 7 of 18 discovering tools by watching peers, and which figures belong to the 2011 paper and which to the 2015 paper [101].
  - **Section 3 (free to paid and pricing):**
    - Cao et al.: sample size, effect sizes and the avatar detail [103].
    - Runge et al.: 37%, 24% and the six-month window [104].
    - Aral & Dhillon: 9.9%, $230,000, volume and pages [105].
    - Pauwels & Weiss: 208 and 71 a day [106].
    - Shampanier et al.: the popular choice splits, the DOI, and a 2023 review's claim about when the effect fails [107].
    - Lambrecht & Misra: which users to charge only in quiet periods, and the sports-content setting [109].
    - Miller et al.: the product and sample size [110].
    - Misra et al.: the baseline for the 43% [114].
  - **Section 4 (commercial open source):**
    - Hoffmann et al.: Linux Foundation funding and journal status [115].
    - Fosfuri et al.: sample size [116].
    - Bonaccorsi et al.: n = 146 [117].
    - Riehle: the 50x–500x ratio, the sales-to-R&D comparison, and which version holds them [118].
    - Colazo & Fang: the 44/18 split and the data source [119].
    - Foster: the contributor counts, and any co-authors [120].
    - Percona: 63%, 8%, 12% and 76%, the analyst validation, and how respondents were recruited [122].
    - GitLab: the Base Customer threshold [124].
  - **Section 5 (segments and first deals):**
    - Camuffo et al.: effect sizes [127].
    - Gruber et al. 2008: survey method and performance measure [128].
    - Franke et al.: the expert panel and demographics [130].
    - Molner et al.: the document and email counts [131].
    - Vissa 2012: panel size [133].
    - Morris et al.: page numbers [134].
- **Lead not followed up:** Kreimer, D., Stoppacher, L. & Eisingerich, A.B. (2026). "Pathways to premium: How habits and benefits shape conversion and retention in freemium subscription models." *Journal of the Academy of Marketing Science*, online 21 Sep 2026. doi:10.1007/s11747-026-01205-w. Reported: habits formed in the free version raise conversion but also tie users to free use. Habits formed in the premium version, through free or discounted trials, support both conversion and retention. Data, setting and sample size were not captured. [research; snippet-only; unverified]

## What this adds for a zero-customer developer tool

- **Show findings in the pull request, at the moment of change, as fixes developers can apply.**
  - Facebook's same analysis was fixed over 70% of the time at diff time, and nearly never as offline lists [80]. Google's results kept outside the workflow were rarely fixed [78].
  - One-click suggestions were taken up 59.6% of the time, against 0.9% for code in comments [90]. Developers rate an in-context fix as the best way to be told about a tool [94].
  - Explain every finding. A real problem the developer does not understand counts as a false positive [78][79][85].
  - **Strength: moderate** that placement matters. Two firms' own reports, one large observational study and one small lab study all point the same way. **None** on whether it brings signups or payment.
- **Treat precision and volume as part of the product.**
  - Nearly all developers accept 5% false positives, and about half accept 15% [77]. Google disables noisy analyzers and runs below 5% overall [79].
  - Noise is the main complaint about bots [99]. Dependabot users cut its notifications, and 11.3% of projects dropped it [96]. Bot PRs are merged about half as often as human ones [97].
  - Most teams keep the default settings, so the defaults are what ships [86].
  - Practical forms are inference: one comment that updates in place, results only for changed code, a "not useful" button tracked per rule, and a quiet first run. A tool that breaks the build on existing code at first install gets rejected [93].
  - **Strength: moderate** that noise leads teams to turn tools down or drop them (observational and qualitative studies that agree). **Weak** for any specific remedy, since none was tested.
- **Win the first install, and spread through people rather than pitches.**
  - Repos mostly keep their first tool, and choose on features and ease of installation [81]. A competing tool already installed lowers adoption [58].
  - Tools spread through committers who work across many repos, and through visible badges [58]. Hearing about a tool from a peer works, but it is rare, and only receptive people adopt [101][102].
  - Unsolicited tool PRs were ignored or rejected: 2 of 52 merged [93]. Developers rate email the worst channel [94].
  - **Strength: moderate** that first installs stick and that committers spread tools (large observational npm studies). **Weak** against unsolicited PRs and email (a field test of 52 PRs; a lab study of 14 people).
- **Measure willingness to pay with binding offers, and test the shape of the free tier.**
  - Hypothetical answers run high [8][110]. Binding methods work one person at a time: BDM [112], incentive-aligned conjoint [111], or a corrected direct question [113]. None has been tested on developers.
  - For an app's existing free users, a limited free tier converted fewer of them than a hard paywall [103]. Charging shrank free sign-ups and weakened free channels [106]. A free version can feed demand for the paid one [108]. Moving from $0 to any price is a big step for buyers [107].
  - **Strength: moderate** within each study (randomized and quasi-experimental designs). **Weak** for developer tools: the evidence comes from consumer apps, content sites and groceries, with no developer or B2B study.
- **If the core is open source, decide the paid layer and the licence on day one.**
  - Open source captures little of the value it creates [115]. Small open-source suppliers commonly mix open and paid products [117]. "1–2% of users pay" is relayed lore, not a benchmark [118][125].
  - Single-vendor, venture-backed projects change licences far more often [121]. Relicensing disrupts users more than contributors [120]. Two prominent relicensers later added an open licence back [123].
  - **Strength: weak.** The evidence is descriptive studies, case studies, preprints, vendor surveys and companies' own statements. No causal study links licence or open-core choices to revenue.
- **List several candidate segments and write kill criteria. Then put the work into one segment.**
  - Structured hypothesis testing makes founders drop more ideas [127]. Listing several markets before entry goes with better performance, with each extra option adding less [128]. Founders' lists mirror their own background [129].
  - Screen first users on expected benefit and on being ahead of the trend [130].
  - Early lock-in to one market went with failure in six cases [131]. Reaching beyond referrals went with more new deals [133].
  - Low-stakes first offers may reduce how much buyers lean on brand. That is inference from [132].
  - **Strength: moderate** that testing leads founders to drop ideas (randomized trials). **Weak** for the rest: observational studies, small samples, and consumer or non-software settings.