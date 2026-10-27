# In online dating, does a bigger local pool raise matches per user, or do users get choosier? (checked 2026-10-27)

Question: `knowledge/marketplaces.md` tells founders to "find the tipping point" (Airbnb's about 300 listings a city) and to "constrain geography or category". Dating apps get that playbook today. Does adding people to a local dating pool raise matches or dates per user roughly in step, or do users get choosier so the gain is much smaller? And should a pool target in the reciprocal mode proposed by lead #103 (`src/lib/liquidity.ts`) assume matches scale with pool size?

Hop 0 from lead #102 (seed: `marketplaces.md` "Find the tipping point"; `design-and-marketing-in-crowded-markets.md` §5). Access marks as in `relaunch-rules.md`. Halaburda, Piskorski & Yildirim 2018 is item 16 in `design-and-marketing-in-crowded-markets.md` and is not re-read here. The Airbnb figure is item 4 in `ecommerce-and-marketplaces.md`.

## Sources

1. Fong, J. (2024). "Effects of Market Size and Competition in Two-Sided Markets: Evidence from Online Dating." *Marketing Science* 43(5):971–985. doi:10.1287/mksc.2023.0142. https://pubsonline.informs.org/doi/fpi/10.1287/mksc.2023.0142 ; citation via https://ideas.repec.org/a/inm/ormksc/v43y2024i5p971-985.html [abstract-only, 2026-10-27; through WebFetch]
2. Fong, J. (Yu) (2018). "Search, Selectivity, and Market Thickness in Two-Sided Markets." Job-market paper, Wharton. https://marketing.wharton.upenn.edu/wp-content/uploads/2018/10/10.18.2018-Yu-Jessica-PAPER-JMP.pdf [read 2026-10-27; fetch summary; two passes, from the start and from character 90,000; working paper, earlier version of 1]
3. INFORMS press release, "Online Dating Sites: The Size of the Potential Dating Pool Makes all the Difference," 11 Sep 2024. https://www.informs.org/News-Room/INFORMS-Releases/News-Releases/Online-Dating-Sites-The-Size-of-the-Potential-Dating-Pool-Makes-all-the-Difference [read 2026-10-27; fetch summary]
4. Fisman, R., Iyengar, S., Kamenica, E. & Simonson, I. (2005). "Searching for a Mate: Theory and Experimental Evidence." Stanford GSB Working Paper 1882. https://www.gsb.stanford.edu/faculty-research/working-papers/searching-mate-theory-experimental-evidence [abstract-only, 2026-10-27; fetch summary]
5. Lenton, A. P. & Francesconi, M. (2010). "How Humans Cognitively Manage an Abundance of Mate Options." *Psychological Science* 21:528–533. doi:10.1177/0956797610364958. Via ScienceDaily, https://sciencedaily.com/releases/2010/04/100415114325.htm [read 2026-10-27; fetch summary; press summary, not the paper]
6. Li, J. & Netessine, S. "Higher Market Thickness Reduces Matching Rate in Online Platforms: Evidence from a Quasiexperiment." *Management Science*. doi:10.1287/mnsc.2018.3223. https://pubsonline.informs.org/doi/fpi/10.1287/mnsc.2018.3223 [abstract-only, 2026-10-27; fetch summary; authors and journal from search results and DOI, volume not seen]
7. Hitsch, G. J., Hortaçsu, A. & Ariely, D. (2010). "Matching and Sorting in Online Dating." *American Economic Review* 100(1):130–163. doi:10.1257/aer.100.1.130. https://scholars.duke.edu/publication/859253 [abstract-only, 2026-10-27; fetch summary]
8. Chen, A., "The Atomic Network" (excerpt of *The Cold Start Problem*), Lenny's Newsletter. https://www.lennysnewsletter.com/p/atomic-network [read 2026-10-27; fetch summary] [practitioner]
9. `liquidity_math`, run in this repo on 2026-10-27 (`node scripts/mcp.mjs call liquidity_math ...`). [tool source]

Not fetched: the published full text of 1 (INFORMS is blocked to curl; WebFetch returned only the abstract). Direct downloads of 2, the BU Platform Strategy 2019 copy and a QMUL working paper (wp964) on dating market size all failed with a proxy 403. DukeSpace (full text of 7) returned a bot check. The full book of 8 was not reachable, so its Tinder chapter was not checked for a threshold.

## 1. The direct test: tell users the pool is bigger, and they get choosier

- **Design.** One large dating app, two neighbouring countries. The sample was drawn from 225,680 active users and split 90/10 into treatment and control; after 3 weeks 84,589 had seen the treatment [corrected 2026-10-27, orchestrator spot-check: 225,680 is the frame, not the number treated]. Treated users saw a pop-up: "There are at least m men and w women nearby!" The counts were real ones scaled by a random 0.75–1.25, so only beliefs changed, not the pool. [research, 2, read; fetch summary; field experiment, n=225,680 users, 84,589 exposed; one app]
- **Participation falls.** "An increase in market size deters users from participating in the market." [research, 1, abstract-only; one app] The author's figure: "a 50% increase in market size reduces the probability of participation by 1%"; the release does not say whether that is percent or points. [research, 3, read; fetch summary; press release]
- **Selectivity rises.** "An increase in market size causes users to become more selective, whereas competition causes users to become less selective." [research, 1, abstract-only] In large areas, 50% more believed opposite-sex users cut the chance of liking the lowest-rated profiles by about 3% and raised it for the highest-rated by about 2.8%. [research, 2, read; fetch summary; effects about 0.03 SD; one app]
- **Search effort does not change; matches fall slightly.** Profile views did not respond significantly. At the average area size (about 11,000 people), 50% more believed opposite-sex users cut matches by about 2%, and 50% more believed rivals raised them by about 3%. [research, 2, read; fetch summary; small but significant; one app]
- So more people did not mean more likes or more mutual matches. Likes moved toward the most-liked profiles, where they are least often returned. [derived from 2]

## 2. What happens when both sides really grow: a model, not a measurement

- Fitted to the same app, the 2018 version's model grows men and women by 25% each. In small areas (about 4,000 people on average), matches fall about 12% for men and 18% for women, and dates fall by a similar amount. In large areas (about 30,000 on average), men's matches rise 0.4% and women's fall 5.9%. [research, 2, read; fetch summary; structural counterfactual, Tables 7–8; one app]
- The same table, as summarised, shows date likelihood rising about 34% for men and 26% for women in large areas while matches stay flat. That does not fit the text and may be a summary error. Don't quote it before the full text is read. [research, 2; fetch summary only]
- The 2024 abstract reports only the experiment; whether these counterfactuals survived review was not checked. [research, 1, abstract-only]
- Adding only women (a one-side boost) raised men's matches in both small and large areas, by the introduction's summary. Doubling the like limit partly offset the losses. [research, 2, read; fetch summary; model]

## 3. The scarce side and the abundant side differ

- In a speed-dating experiment that varied group size at random, "male selectivity is invariant to group size, while female selectivity is strongly increasing in group size." [research, 4, abstract-only; lab-like events, students; no effect sizes seen]
- The app study's introduction says the reverse for one part: men react more to market size, women more to competition. [research, 2, read; fetch summary] They disagree on who gets choosier.
- At speed-dating events with 24 or more dates, people chose on traits seen at a glance (height, weight). [research, 5, read; fetch summary; 84 events; observational]

## 4. Non-dating evidence: thicker markets can lower match rates

- On a holiday-rental platform, a one-time import of listings doubled market size. Traveller confirmation rate fell 15.4% and host occupancy fell 15.9%. Search effort rose 18.3%, and the authors blame search friction. [research, 6, abstract-only; fetch summary; quasi-experiment; one platform]
- Airbnb's "about 300 listings" is about a city's bookings growth, not matches per user. [derived from 6 and `ecommerce-and-marketplaces.md` item 4]

## 5. How this fits Halaburda et al. and Chen

- **Agrees with Halaburda, Piskorski & Yildirim 2018.** Their model says a platform can win by showing fewer candidates, because more options make users choosier. Fong's experiment is field evidence for that mechanism: more believed options, more selective likes, fewer matches. Fong varies beliefs about pool size, not the number shown, so it supports the mechanism, not their pricing result. [derived from 1, 2 and `design-and-marketing-in-crowded-markets.md` §5]
- **Hitsch et al.** do not test pool size. [research, 7, abstract-only]
- **Chen** gives no dating threshold in the excerpt read; an atomic network is "maybe on the order of hundreds of people, at a specific moment in time." [practitioner, 8]
- No source gave a measured local pool size at which a dating app works. [derived; search of 1–8]

## What this changes

1. **`knowledge/marketplaces.md`, "Find the tipping point" bullet.** Add one line after the Airbnb sentence: "Don't borrow it for dating. In one dating app's field experiment, users told the local pool was 50% bigger got choosier and matched about 2% less [research; field experiment, 84,589 users treated; one app; beliefs varied, not pool size]. No measured dating threshold was found." The "Constrain geography" bullet stays: a dense local pool still avoids an empty app. `test/consistency.test.ts` checks names only, so the test is a grep: the served playbook text for "dating app cold start" contains "Don't borrow it for dating".
2. **Lead #103's reciprocal mode.** `liquidity_math` today scales matches in step with supply: run at 20 then 40 listings a day with a 2% match share, `matchesPerDay` goes 0.4 → 0.8 [tool source, 9]. A reciprocal mode must not do this with fixed like rates. Test: input with pool 2,000 and like rate 0.1, then pool 4,000 and the same like rate, returns a warning naming that like rates were measured at the current pool and fall as the pool grows; an input that gives a like rate per pool size does not. The mode should not output a target pool size taken from listings maths.

## What this does not settle

- Real pool growth, not belief, was only modelled. No natural experiment on dating pool size was found.
- One app, two countries, users aged 20–30, 2015.
- The size of the counterfactual effects rests on a fetch summary of a 2018 working paper; the large-area "dates" row looks wrong.
- Which side gets choosier: the two studies disagree.
- Whether like caps offset the loss: modelled only (2); see lead #104.
