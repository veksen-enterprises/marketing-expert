# Does visual design quality change what users do, or only what they say? (checked 2026-10-27)

Question: `design-and-marketing-in-crowded-markets.md` (open questions) found no causal study linking UI design quality to app revenue or retention. Is there credible causal evidence (randomized, natural experiment, difference-in-differences) that visual or UI design quality changes conversion, retention or revenue for software, and does it separate "users rate it higher" from "users buy or stay more"?

Hop 1 from `design-and-marketing-in-crowded-markets.md`. Access marks as in `founder-test-samples.md`.

Already covered, cited not redone: Lindgaard 2006 (50 ms appeal), Tuch 2012 (complexity, prototypicality), Tractinsky 2000 (ATM), Fogg 2002, Zhang et al. Airbnb photos, McKinsey (all in `design-and-marketing-in-crowded-markets.md` §3); Wang & Li 2017 icons (`app-store-search.md`, observational); AI banner CTR (`ai-in-marketing.md`).

## Sources

1. Robins, D. & Holmes, J. (2008). "Aesthetics and credibility in web site design." *Information Processing and Management* 44:386–399. https://makinggood.ac.nz/media/1276/robinsholmes_2008_aestheticsandcredibilityinwebdesign.pdf [read 2026-10-27; fetch summary]
2. Tuch, A. N., Roth, S. P., Hornbæk, K., Opwis, K. et al. (2012). "Is beautiful really usable? Toward understanding the relation between usability, aesthetics, and affect in HCI." *Computers in Human Behavior* 28(5). https://research.google/pubs/is-beautiful-really-usable-toward-understanding-the-relation-between-usability-aesthetics-and-affect-in-hci/ [abstract-only, 2026-10-27; volume from memory, unchecked]
3. Sonderegger, A. & Sauer, J. (2010). "The influence of design aesthetics in usability testing: Effects on user performance and perceived usability." *Applied Ergonomics* 41:403–410. doi:10.1016/j.apergo.2009.09.002. https://folia.unifr.ch/unifr/documents/302271 [abstract-only, 2026-10-27; full PDF on sonar.ch blocked by the proxy]
4. Lindgaard, G., Dudek, C., Sen, D., Sumegi, L. & Noonan, P. (2011). "An exploration of relations between visual appeal, trustworthiness and perceived usability of homepages." *ACM TOCHI* 18(1), art. 1. Summary: https://humanfactors.com/newsletters/an_exploration_of_relations_between_visual_appeal.asp [secondary; the summary misprints the year as 2001]
5. Reimann, M., Zaichkowsky, J., Neuhaus, C., Bender, T. & Weber, B. (2010). "Aesthetic package design: A behavioral, neural, and psychological investigation." *Journal of Consumer Psychology* 20:431–441. doi:10.1016/j.jcps.2010.06.009. https://assets.tina.io/a371bbc3-e9fe-472a-a32b-f55a8990b0bc/Reimann-Zaichkowsky-Neuhaus-Bender-Weber.-Aesthetic-package-design.pdf [read 2026-10-27; fetch summary]
6. Kohavi, R. & Thomke, S. (2017). "The Surprising Power of Online Experiments." *Harvard Business Review*, Sept–Oct 2017. https://web-docs.stern.nyu.edu/executive/The%20Surprising%20Power%20of%20Online%20Experiments.pdf [read 2026-10-27; first-party: Kohavi ran Bing's experimentation team]
7. Snap Inc. Form 10-Q for the quarter ended 2018-06-30. https://www.sec.gov/Archives/edgar/data/0001564408/000156459018020094/snap-10q_20180630.htm [first-party][read 2026-10-27: MD&A]
8. Wilson, T., Gandharv, P. & Vachuska, K. (2025). "The Impact of the 2023 Wikipedia Redesign on User Experience." *Informatics* 12(3):97. doi:10.3390/informatics12030097 [read 2026-10-27; fetch summary]
9. Fang, L., Yuan, Z., Zhang, K., Donati, D. & Sarvary, M. (2026). "Generative AI and Firm Productivity: Field Experiments in Online Retail." arXiv:2510.12049v3 [read 2026-10-27]. Checked because it looked like an image experiment. It is not: all its tests are text, chat and search. Not used below.

## 1. Looks move ratings. That part is solid, but lab-only

- Same content, design stripped vs kept: the designed version was rated more credible in 19 of 21 page pairs (mean 1.05 vs 0.55 on a dial; p<0.001). Only 7 pairs differed significantly on their own. Judgment time did not differ (3.49 s vs 3.36 s) [research, 1, read; n=20, mostly library-science grad students, within-subjects, ratings only]. The authors call the raw gap small and think the effect works "at the visceral level".
- Appeal judged at 50 ms spills into trust and usability judgments: the authors read it as a halo [research, 4, secondary; ratings only].
- All outcomes in 1, 4 and the cited Lindgaard 2006 and Tuch 2012 are ratings. None measures a purchase, sign-up or return visit. [derived]

## 2. The halo is not one-way, and it shrinks after real use

- In a 2×2 online-shop test (looks high/low × usability high/low), looks did not change perceived usability. Poor usability lowered post-use ratings of looks, through frustration [research, 2, abstract-only; n=80, lab]. This reverses Tractinsky 2000 when the usability flaw is strong.
- Read with Tractinsky: looks colour judgments before and during light use; a product that frustrates people loses its looks advantage in their ratings. [derived from 2 and the crowded-markets note §3]

## 3. Behaviour in the lab: some, small, not about software buying

- Two functionally identical simulated phones, one appealing, one not: the appealing one was rated more usable and tasks were completed faster [research, 3, abstract-only; n=60 adolescents aged 14–17; simulation]. Task time is behaviour, but not buying or staying.
- Grocery packs: aesthetic packaging was picked more often than standard packs (Exp. 1a: 69% vs 57%, n=326 online; Exp. 2: 33% vs 21% "choose", n=176), and an unknown brand in an aesthetic pack beat a known brand in a standard pack even at a price 30% above average (51% vs 42%) [research, 5, read; lab choice tasks with 4-second windows; prices shown, not paid; the paper does not say choices were incentivised]. This is closer to buying, but it is packaging on a shelf, not a software UI.

## 4. Field and company evidence with a behavioural outcome

- **Text colour test at Bing.** Slightly darker blues and greens in titles and lighter black in captions made users succeed more often and faster. It was rerun on 32 million users with similar results. Microsoft projected more than $10M a year in extra revenue [first-party, 6, read; randomized A/B; projection, not measured revenue; one very large product]. This is the one randomized test found where pure visual polish moved a behavioural metric. It needed tens of millions of users to detect.
- Same article: only about 10–20% of experiments at Google and Bing came out positive; across Microsoft about a third positive, a third flat, a third negative [first-party, 6, read]. Most changes, visual or not, do nothing measurable.
- **Listing photos.** The Airbnb difference-in-differences result (8.98% higher occupancy with verified professional photos) remains the best field evidence that visual quality raises demand in a crowded marketplace [research; already in crowded-markets note, abstract-only]. It is listing imagery, not product UI.
- **Redesigns that hurt.** Snap: "In February 2018, we rolled out a redesign of the Snapchat application, which negatively impacted our DAUs"; DAUs fell 2% from Q1 to Q2 2018 [first-party, 7, read]. This is the firm's own attribution, not a causal estimate. The redesign changed where content sat, not only how it looked [derived; from memory of press coverage, not checked here].
- **Wikipedia 2023 redesign.** A regression discontinuity on clickstream data found internal link clicks up about 1.06M at launch (p=0.02) and an immediate pageview drop that the authors say normalised; total clicks showed no discontinuity (p=0.39) [research, 8, read; quasi-experimental; one site; tables and text disagree in places]. Weak, mixed, and about navigation, not polish.

## 5. What is not there

- No randomized or quasi-experimental study found that measures UI visual quality against conversion, retention or revenue for an app or SaaS product with a small or new user base. [derived; searched academic and general web]
- App-icon and screenshot "case studies" from ASO vendors and design agencies were found but not used: none showed a control group or method. [vendor; not read in full]

## What this changes

- **No playbook changes now.** A grep of `knowledge/` finds no playbook that yet states a design-quality claim from the crowded-markets note; the design lever lives only in `research/`. [derived]
- **Narrow the crowded-markets note's §3 summary when it is next edited.** "Strong lab evidence that looks drive first judgments" holds for ratings. Behavioural support is: lab choice for packaging (5), task speed (3), one huge-scale A/B of text colours (6), and listing photos (Airbnb). Any playbook line should read: looks shape first judgments of trust and quality [research; lab; ratings]; field evidence that looks change buying is limited to listing photos and very large-firm A/B tests [research; first-party]; no causal study links UI polish to app retention or revenue. The project's stance (flag design as a lever, never judge it) stands, and the "don't grade the design" rule gets stronger support: ratings of looks are exactly what a halo inflates.
- **Proposed check in `moveCheck.ts`:** when a move's action is a redesign or visual change (redesign, new design, polish, new look, restyle) and its stop line counts only preferences or ratings ("prefer", "rate", "like", "look better"), add an issue: the stop line measures what people say about looks, which looks inflate; count what they do (sign-ups, trial starts, store-page conversion). Test: a move with action "Redesign the landing page hero" and stop line "fewer than 7 of 10 testers prefer the new design" returns that issue; the same move with stop line "fewer than 12 trial starts from 400 visitors, up from 8" does not. Basis: sections 1–2 (ratings shift with looks and with frustration, not with buying). [derived]

## What this does not settle

- Whether visual polish changes conversion at founder scale. The one clean A/B (6) needed 32 million users; a small product cannot detect an effect that size, which favours qualitative checks over A/B tests for looks at low volume. [derived; not sized here]
- Whether "how it works" design (onboarding steps, defaults, product rules) has causal evidence. That is a separate question from looks, and the stronger one in the crowded-markets cases.
- Full texts of 2 and 3 were not read; sample details beyond the abstracts are unchecked.
- Whether the 2018 Snapchat drop was due to the redesign or to other causes in that quarter.
