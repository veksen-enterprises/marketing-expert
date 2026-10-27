# What model fits liquidity when both people must say yes? (checked 2026-10-27)

Question: `research/design-and-marketing-in-crowded-markets.md` §5 says `liquidity_math` "already covers the density side" for dating apps. The tool models new listings arriving for one buyer's watch. In a dating app a match needs a like each way, and likes pile onto a few profiles. Is there a published model and measured like and reply rates that would let the tool handle this, or is the listing model a fair stand-in?

Hop 0 from lead #103 (seed: `src/lib/liquidity.ts`; `design-and-marketing-in-crowded-markets.md` §5–6). Access marks as in `relaunch-rules.md`. Whether a bigger pool raises matches per user (thickness, selectivity) is lead #102 and is not covered here. Hinge's like-rate figures are in `design-and-marketing-in-crowded-markets.md` §5 (founder's account, unverified) and are not repeated.

## Sources

1. Rios, I., Saban, D. & Zheng, F. (2023). "Improving Match Rates in Dating Markets Through Assortment Optimization." *Manufacturing & Service Operations Management* 25(4):1304–1323. https://doi.org/10.1287/msom.2022.1107 [abstract-only, 2026-10-27; via RePEc, fetch summary]. Note: published in MSOM, not *Management Science* as the lead says.
2. INFORMS news release on source 1, "Swipe Left or Swipe Right? New Algorithm Increases Successful Dating Site Matches by More Than 25%". https://www.informs.org/News-Room/INFORMS-Releases/News-Releases/Swipe-Left-or-Swipe-Right-New-Algorithm-Increases-Successful-Dating-Site-Matches-by-More-Than-252 [read 2026-10-27; fetch summary] [publisher press release]
3. Kanoria, Y. & Saban, D. (2021). "Facilitating the Search for Partners on Matching Platforms." *Management Science* 67(10). https://doi.org/10.1287/mnsc.2020.3794 ; author copy https://business.columbia.edu/sites/default/files-efs/pubfiles/21324/facilitating-search-1.pdf [read 2026-10-27; fetch summary]
4. Arnosti, N., Johari, R. & Kanoria, Y. (2021). "Managing Congestion in Matching Markets." *MSOM* 23(3). https://doi.org/10.1287/msom.2020.0927 ; author copy https://par.nsf.gov/servlets/purl/10309697 [read 2026-10-27; fetch summary]
5. Hitsch, G. J., Hortaçsu, A. & Ariely, D. (2010). "Matching and Sorting in Online Dating." *American Economic Review* 100(1):130–163. Duke repository copy https://dukespace.lib.duke.edu/server/api/core/bitstreams/52e2e703-3736-4e0b-a1db-5e0282062f9d/content [read 2026-10-27; fetch summary]
6. Bruch, E. E. & Newman, M. E. J. (2018). "Aspirational pursuit of mates in online dating markets." *Science Advances* 4(8):eaap9815. arXiv copy https://arxiv.org/pdf/1808.04840 [read 2026-10-27; fetch summary]
7. Tyson, G., Perta, V. C., Haddadi, H. & Seto, M. C. (2016). "A First Look at User Activity on Tinder." ASONAM 2016. arXiv:1607.01952, https://ar5iv.labs.arxiv.org/html/1607.01952 [read 2026-10-27; fetch summary]
8. This repo: `node scripts/mcp.mjs call liquidity_math …`, run 2026-10-27 on the current build [read 2026-10-27; tool source and output].

Not fetched: the publisher pages for 1, 3 and 4 (curl refused at the proxy; informs.org full text not tried); the full text of 1, so its baseline like and match rates were not seen; PMC copy of 6 (browser check page). All numbers from 3–7 were seen only through WebFetch summaries, so none can carry a code change alone.

## 1. What the tool returns for a dating founder today

- Input: 30 new sign-ups a day, filter shares 5%, 15% and 30%, a 7-day window. Output: "about 100% of these watches would fire within 7 days"; the 5% filter "needs about 5 listings a day for a 80% chance" [derived, 8; tool output].
- The shape is wrong for dating in three ways. It counts every profile that fits the filter as a match, with no like from either person. It takes sign-ups as active users. And it is one-sided: it has no input for the other person's filter or like [derived, 8; tool source].
- The Poisson maths itself is fine once the like rates are folded into the share. 15 new active users a day in range, a 30% mutual filter share, a 50% like rate out and a 2% like rate back give a share of 0.003. The tool then returns 0.045 matches a day and a 27% chance of one match in 7 days [derived, 8; assumed rates]. Nothing in the description or warnings tells the agent to fold them in. The third warning says only "multiply by your contact and reply rates".

## 2. Published models

- **A match needs two likes, often on different days.** Rios, Saban and Zheng model it that way, with a dating company. Recent matches lower a user's chance of liking. Two field experiments found their assortment rule gave "at least 27% more matches" than the partner's algorithm [research, 1, abstract-only; two field experiments; one platform; sizes not seen].
- **Congestion is wasted effort on people who won't answer.** Kanoria and Saban model screening costs on both sides. When one side is longer, it proposes, and "only a fraction 1/λ of the long side matches, while essentially all short-side agents match". Making the more selective side reach out first raised average welfare by up to about 10% at λ = 2 [research, 3, read; fetch summary; theory, no data] [unverified: the SSRN-era copy on business.columbia.edu (ssrn_id3667353) writes the long-side share as "1/R" and gives no welfare percentage or λ = 2 case; the 1/λ wording and the 10% were not seen in a second copy].
- Arnosti, Johari and Kanoria find that cheap applications create a "tragedy of the commons" with many never read. Capping applications can help one or both sides. The paper names dating as a fit and notes Coffee Meets Bagel and Tinder cap likes [research, 4, read; fetch summary; theory, no data].
- None of these gives a founder-level calculator. They support two warnings: rates differ by side, and the short side decides the match count [derived, 3–4].

## 3. Measured rates

- **Reply rates.** In one US site in 2003 (3,004 men and 2,783 women, Boston and San Diego) [unverified: the 2006 working-paper copy (docs.asian-nation.org) confirms 71% and 56%, Boston and San Diego, 2003, but gives no 3,004 / 2,783 head counts; the AER text was not re-read], "71 percent of men's and 56 percent of women's first-contact e-mails do not receive a reply" [research, 5, read; fetch summary; observational; one site; 2003].
- In January 2014 on another US site (about 187,000 active users, four cities), men's first messages got replies 15–20% of the time and women's 34–45%, by city [research, 6, read; fetch summary; observational; one site; the text gives a different figure for women, unexplained].
- **Match rate per like, by side.** Test profiles on Tinder that liked everyone within 100 miles matched 0.55–0.78% of likes for the male stock profiles (238 matches from 43,290 likes, and so on), and 10.2–10.5% for the female ones (682 from 6,631, and so on). That is a gap of about 15 times [research, 7, read; fetch summary; test accounts; London and New York; 2016; lower bound, since not every liked user saw the profile].
- After a match, 7% of male and 21% of female matches sent a message [research, 7, read; fetch summary; same caveats].
- **Concentration.** The most messaged user (one woman in New York) "received 1504 messages" in one month. People wrote to partners about 25% more desirable than themselves, and replies from more desirable women "never rise above 21%" [research, 6, read; fetch summary; observational; one site].

## What this changes

1. **A `reciprocal` mode in `liquidity_math`** (`src/lib/liquidity.ts`, description in `src/server.ts`). Inputs per side: new active users of the other side in range per day, mutual filter share, like rate out, like rate back, and conversation rate (match to reply). Output per side: matches and conversations per user per week, the chance of at least one in the window, and the new active users per day needed for the target. It reuses the existing Poisson maths. Add two warnings: "likes concentrate on a few profiles, so the typical user gets fewer matches than the average", and, when the two sides' like-back rates differ by 5 times or more, "the side with the lower rate sets your match count; size the pool for that side". The description should say to use active users, not sign-ups, and to use this mode when both people must say yes.
   Test: men {15 per day, 0.3, 0.5, 0.02, 0.2} and women {15 per day, 0.3, 0.1, 0.5, 0.2} with 7 days give men 0.315 matches a week and a 27.0% chance, women 1.575 and 79.3%, and the side-gap warning (ratio 25). Both sides at {15, 0.3, 0.3, 0.1, 0.2} give no side-gap warning.
2. **Correct `design-and-marketing-in-crowded-markets.md` §5.** "Already covers the density side" holds only when like rates are folded into the share. Replace it with a pointer to the mode.
3. The playbook line for dating (whichever note #102 or another lead puts in `marketplaces.md`) should cite the measured rates here with their tags, not a single "like rate".

## What this does not settle

- Default rates. The measured figures come from three sites, 2003 to 2016, two of them messaging sites, not swipe apps. They are examples, not defaults; the mode should take the founder's own rates.
- Whether matches per user rise in step with pool size. That is lead #102.
- Rios et al.'s baseline like and match rates and sample sizes (full text not read).
- How skewed likes are in a small, new app. The 1,504-message figure is from a large city site; no source gave a share of likes going to the top tenth.
- Whether a cap on likes raises matches in the field. The models say it can; lead #104 covers field evidence.
