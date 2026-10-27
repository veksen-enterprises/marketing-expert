# In dating apps, does crowding on a few users drive the scarce side away, and do rules that limit the abundant side raise matches? (checked 2026-10-27)

Question: `knowledge/marketplaces.md` tells every two-sided product "Which side first? Usually supply". A dating app has no supplier: one population matches with itself and both people must say yes. `competition-and-defensibility.md` §2 cites Chen's "hard side" with desirable dating-app users as an example. Is there evidence that attention piling onto a few users, or an uneven sex ratio, drives the scarce side away? And do product rules that limit the abundant side (women message first, caps, costly signals, gating) raise mutual matches or keep the scarce side?

Hop 0 from lead #104 (seed: `marketplaces.md` "Which side first?"; `competition-and-defensibility.md` §2). Access marks as in `relaunch-rules.md`. Halaburda, Piskorski & Yildirim 2018 (restricted choice) is in `design-and-marketing-in-crowded-markets.md` §5 and is not repeated. Congestion models (lead #103) and pool size (lead #102) are left to those notes.

## Sources

1. Lee, S. & Niederle, M. (2015). "Propose with a Rose? Signaling in Internet Dating Markets." *Experimental Economics* 18(4):731–755. doi:10.1007/s10683-014-9425-9. Working version: https://www.econ.umd.edu/sites/www.econ.umd.edu/files/pubs/Rose_dec2014.pdf [read 2026-10-27; fetch summary]
2. Bapna, R., Ramaprasad, J., Shmueli, G. & Umyarov, A. (2016). "One-Way Mirrors in Online Dating: A Randomized Field Experiment." *Management Science* 62(11):3100–3122. doi:10.1287/mnsc.2015.2301. Working version: https://carlsonschool-d8.prd.umn.edu/sites/carlsonschool.umn.edu/files/2018-10/one-way-mirrors-main_0.pdf [read 2026-10-27; fetch summary]
3. Huang, N., Burtch, G., He, Y. & Hong, Y. (2022). "Managing Congestion in a Matching Market via Demand Information Disclosure." *Information Systems Research* 33(4):1196–1220. doi:10.1287/isre.2022.1148. https://ideas.repec.org/a/inm/orisre/v33y2022i4p1196-1220.html [abstract-only, 2026-10-27; via fetch summary]
4. Karmegam, S. R., Ramaprasad, J. & Gopal, A. "Gender Gating? Addressing the Impact of Congestion on the User Experience for Women in Online Matrimonial Matching Platforms." *Information Systems Research*, published online 2026. doi:10.1287/isre.2024.1008 [abstract-only, 2026-10-27; fetch summary]. Figures only via trade press: https://www.datingnews.com/industry-trends/study-finds-women-find-better-matches-with-fewer-dating-options/ [read 2026-10-27; fetch summary; secondary]
5. Lehmann, T., Terrier, C. & Lalive, R. (2023). "Costs and Benefits of Congestion in Two-Sided Markets: Evidence from the Dating Market." QMUL Economics Working Paper 964. https://www.qmul.ac.uk/sef/media/econ/research/workingpapers/wp964.pdf [read 2026-10-27; fetch summary; working paper]
6. Bruch, E. E. & Newman, M. E. J. (2018). "Aspirational pursuit of mates in online dating markets." *Science Advances* 4(8):eaap9815. doi:10.1126/sciadv.aap9815 [abstract-only, 2026-10-27; via https://stafforini.com/works/bruch-2018-aspirational-pursuit-mates/]; University of Michigan ISR release, 15 Aug 2018, https://isr.umich.edu/?p=2171 [read 2026-10-27; fetch summary; secondary]
7. Rios, I., Saban, D. & Zheng, F. (2023). "Improving Match Rates in Dating Markets Through Assortment Optimization." *M&SOM* 25(4):1304–1323. doi:10.1287/msom.2022.1107. https://ideas.repec.org/a/inm/ormsom/v25y2023i4p1304-1323.html [abstract-only, 2026-10-27; fetch summary]
8. Kanoria, Y. & Saban, D. (2017 working paper; *Management Science* 2021). "Facilitating the Search for Partners on Matching Platforms: Restricting Agents' Actions." https://ideas.repec.org/p/ecl/stabus/3572.html [abstract-only, 2026-10-27; fetch summary]
9. Arnosti, N., Johari, R. & Kanoria, Y. (2021). "Managing Congestion in Matching Markets." *M&SOM* 23(3):620–636. doi:10.1287/msom.2020.0927 [abstract-only, 2026-10-27; fetch summary]
10. NPR via Texas Public Radio, "Women no longer have to make the first move on Bumble", 6 May 2024. https://www.tpr.org/arts-culture/2024-05-06/women-no-longer-have-to-make-the-first-move-on-bumble-will-it-make-the-app-better [read 2026-10-27; fetch summary; press]

Not fetched: curl to every publisher and author host was refused at the proxy (403), so no PDF was read in full. PubMed Central (Bruch & Newman full text) returned a browser check; news.umich.edu failed. No primary study of Bumble's women-first rule was found in two searches. Abramova et al. 2016 was not fetched: it is a review of gender differences and measures no rule.

## 1. Attention piles onto a few users (observational)

- Men and women both message people "about 25% more desirable than themselves". Reply chances drop "markedly" as the gap grows. [research, 6, abstract; observational; one site, four US cities]
- On a Tinder-like app (4,238 women, 8,788 men), 4.6% of women's profiles and 1.5% of men's led to a match. Some women face "large excess demand". [research, 5, read; fetch summary; observational, natural variation in men online; one platform; working paper]
- In that study, crowding slowed men's matching. It helped women who screen quickly, by widening their choice. Each 100 extra likes cut the chance a like turns into a match by 2.2 points. [research, 5; same qualifiers] So crowding hurts the abundant side's odds. It is not shown to hurt the scarce side.
- No source here measured whether the scarce side leaves because of crowding or an uneven sex ratio. Lehmann et al. report no churn. Bapna et al. found no difference in active users the month after treatment, and say their data can't show long-term exit. [research, 2, 5]

## 2. Rules that make interest scarce or visible (field experiments)

- **Costly signal.** On a Korean dating site event (613 users: 304 men, 309 women), a "rose" attached to a date request raised acceptance by 3.3 points, about 20% over the base rate (1,902 proposals). [research, 1, read; fetch summary; field experiment; one site, two 2008 events] Users randomly given 8 roses instead of 2 got more accepted requests: women 0.705 vs 0.379, men 0.833 vs 0.556. The rose added dates rather than shifting them. [same] The outcome is an accepted request (contacts exchanged), not a date that happened, and nobody's staying was measured.
- **Visible weak signal.** 100,000 new users; 50,000 got anonymous browsing for a month. Anonymous women got 14.1% fewer matches (4.089 to 3.513). Men's fall was not significant. Women "tend not to make the first move" and rely on the visit trace. [research, 2, read; fetch summary; RCT, n=100,000; one North American site; one month]
- **Showing demand.** Telling users how much recent demand a profile gets "improved matching efficiency", mostly for men and heavy senders. [research, 3, abstract; RCT; one Chinese mobile platform; size not seen] [unverified: the abstract (via academicnewsletter.sufe.edu.cn) says "a large mobile dating platform" and names no country]
- **Platform-chosen line-up.** A US dating app's algorithm that picks who sees whom got "at least 27% more matches" than the firm's own, in two field experiments. [research, 7, abstract; field experiments; one platform; size not seen]

## 3. Limiting the abundant side directly

- **Gating.** An Indian matrimony site showed women only to men who met set criteria. Women got fewer unwanted requests and "higher matching efficacy". [research, 4, abstract; quasi-experiment, not randomised; one platform] Trade press reports 6% fewer requests to women and 72% higher efficacy; those figures are secondary and were not seen in the paper.
- **Who reaches out first (theory).** When one side is choosier, the platform "should force the more selective side of the market to reach out first" by stopping the other side from reaching out. [research, 8, abstract; theory] Caps on applications per person and costlier applying can raise welfare when the abundant side over-applies. [research, 9, abstract; theory] This is the logic of Bumble's rule.
- **Bumble.** No study of the women-first rule's effect on matches or retention was found. In 2024 Bumble added "Opening Moves" so women "have more choice in how they make the first move"; the press piece cites no data. [press, 10]

## 4. Against the design note

Agree with `design-and-marketing-in-crowded-markets.md` §5 and §6 item 3 that product rules, not looks, are the lever. Halaburda et al. and items 2–3 here point the same way: show fewer, scarcer or better-aimed options. Two corrections. First, the evidence is that these rules raise matches. None shows a rule "attracts one group" or keeps it. Second, the "hard side" in a dating app is not a supplier you recruit first. It is the choosy, flooded side, and a rule protects it inside the product.

## What this changes

1. **`knowledge/marketplaces.md`, "Which side first?": add one bullet.**
   "- **Dating and other apps where both people must say yes:** there is no supplier. The short side is the choosy side that gets flooded (in most straight dating apps, women) [synthesis]. Rules that make interest scarce or visible raise its matches: a limited 'rose' raised acceptance of a date request about 20% [research; field experiment, 613 users; one site; accepted requests, not dates], and hiding who viewed a profile cut women's matches 14% [research; RCT, n=100,000; one site; one month]. No study shows such a rule keeps that side on the app."
   Test: `search_playbooks` for "dating app which side first" returns this bullet in `marketplaces`; an answer saying "a rose raised acceptance about 20% [research]" is matched to it by `checkLabels` (and, after item 3, flagged `qualifier-dropped`).
2. **No bet in `smallBetsCatalog.ts`.** A product rule is not a marketing small bet, and no source gives a base rate or a stop threshold with a denominator.
3. **Proposed check fix (lead below), shown by running the repo.** `checkLabels` returns `status: "ok"` for "…charge a lead fee instead of a transaction fee [research, Hagiu & Wright 2024]" though the playbook label is "research (theory), Hagiu & Wright 2024" (`marketplaces:81`). Its `QUALIFIER` regex has no "theory", "observational", "one site" or "quasi". Without that, an answer could repeat bullet 1 as plain [research]. Test: that input returns `qualifier-dropped`; the same sentence with "(theory)" kept returns `ok`.

## What this does not settle

- Whether crowding or a skewed sex ratio makes the scarce side quit. No source measured it.
- Whether matches became dates or relationships. Every outcome is a match or accepted request.
- Bumble's rule: no causal study found.
- Effect sizes for sources 3, 4 and 7 were not seen in the papers. Sources 1 and 2 were read through fetch summaries only, so their numbers need a full-text check before a playbook edit.
- Same-sex apps, where the one-population framing holds and sides don't split by sex.
