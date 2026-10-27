# How much of a dating app's churn is success, and does it break single-rate LTV maths? (checked 2026-10-27)

Question: `unit_economics` (src/lib/economics.ts) takes one `monthlyChurn` and builds LTV and payback from it. In a dating app some people leave because the product worked: they found a partner. Is there a measured split between success churn and failure churn, with a denominator? And does a mixed churn rate make the tool's numbers, or the advice drawn from them, wrong?

Hop 0 from lead #107 (seed: `src/lib/economics.ts`, the `monthlyChurn` input). Access marks as in `relaunch-rules.md`. Halaburda, Piskorski & Yildirim 2018 and Hinge's redesign are in `design-and-marketing-in-crowded-markets.md` §5, not repeated. `fitness-and-health-apps.md` has no "users leave when the goal is reached" finding to borrow; its retention items are about lapses, not success exits.

## Sources

1. Sepúlveda, R. (2024). "Unmatching Dating Apps: Motives for Disconnection." *Palabra Clave* 27(1). https://doi.org/10.5294/pacla.2024.27.1.3 ; full text https://palabraclave.unisabana.edu.co/index.php/palabraclave/article/download/22029/8149?inline=1 [read 2026-10-27; fetch summary; Table 1 and methods, two passes]
2. Bumble Inc., Form 10-K for FY2025, Item 1A. https://www.sec.gov/Archives/edgar/data/1830043/000183004326000027/bmbl-20251231.htm [read 2026-10-27; fetch summary; first 100,000 of 118,176 characters] [first-party]
3. Match Group, Inc., Form 10-K for FY2025. https://www.sec.gov/Archives/edgar/data/891103/000089110326000025/mtch-20251231.htm [read 2026-10-27; fetch summary; first 100,000 of 106,141 characters] [first-party]
4. Pew Research Center (2023-02-02). "The who, where and why of online dating in the U.S." July 2022 survey, American Trends Panel. https://www.pewresearch.org/internet/2023/02/02/the-who-where-and-why-of-online-dating-in-the-u-s/ [read 2026-10-27; fetch summary]
5. Gieselmann, J. (2024). "(Mis-)Matchmaker." Job market paper, Heinrich-Heine University Düsseldorf. https://cz.cerge-ei.cz/pdf/events/papers/JMP_Mismatchmaker.pdf [read 2026-10-27; fetch summary] [theory, no data]
6. TechCrunch (2018-10-16). "Hinge is first dating app to actually measure real-world success." https://techcrunch.com/2018/10/16/hinge-is-first-dating-app-to-actually-measure-real-world-success [read 2026-10-27; fetch summary] [press, company figures]
7. Hinge App Store listing, subtitle "Designed to be deleted". https://apps.apple.com/app/595287172 [snippet-only]
8. LeFebvre, L. E. (2018). "Swiping me off my feet: Explicating relationship initiation on Tinder." *Journal of Social and Personal Relationships* 35(9). https://doi.org/10.1177/0265407517706419 [snippet-only; via a Psychology Today summary, read 2026-10-27; fetch summary]
9. Repo run: `node scripts/mcp.mjs call unit_economics '{"arpaMonthly":20,"grossMargin":0.8,"monthlyChurn":0.25,"cac":30}'` [read 2026-10-27; tool output]

Not fetched: Statista pages on Rakuten Insight's 2020 Asian surveys of "reasons for quitting mobile dating apps" (paywalled, every figure masked); sec.gov and pewresearch.org by curl (proxy 403), so the 10-K tails past 100,000 characters were not read; LeFebvre 2018 full text (publisher); Kanoria & Saban 2021 (not searched, quota); The Drum's 2024 piece on Hinge's "dates so great people delete the app" KPI (page came back empty).

## 1. What the tool says today

- The run returns bounded LTV 64, LTV:CAC 2.13, churn-adjusted payback 3 months, and **an empty `warnings` list** [tool output, 9]. At 25% monthly churn nothing is flagged.
- The tool has no business-type or churn-reason input, so it cannot know the churn includes success [derived, 9; tool source].
- The arithmetic is not broken by mixed churn. A payer who leaves happy stops paying just as a payer who leaves angry does. LTV and payback from a measured churn rate stay correct as averages [derived].

## 2. Success is a common reason for leaving, but no source gives its share of churn

- **One survey with a denominator.** Of 349 Portuguese past or current dating-app users, 118 (33.8%) ticked "Started a relationship" as a reason for disconnecting. More ticked failure or fatigue reasons: "Didn't satisfy my needs" 221 (63.3%), "Nothing new happened" 191 (54.7%), "Didn't meet anyone interesting" 144 (41.3%), "Got tired" 113 (32.4%). 82.8% no longer used dating apps [research, 1, read; fetch summary; survey, n=349; Portugal 2022; convenience sample via social media and academics; multiple answers allowed; base appears to be all 349, not only leavers].
- So about one in three users names success as a reason, and failure reasons are named more often. Because answers stack, this is not "a third of churn is success". A leaver can tick both [derived from 1].
- **Bumble names it as a retention risk, without a number.** Its 10-K lists "a decrease in member retention as a result of members finding meaningful relationships on our platforms" [first-party, 2, read; fetch summary]. No churn or retention rate is disclosed [first-party, 2; first 100,000 characters].
- **Match Group's 10-K had no such sentence and no churn figure** in the part read [first-party, 3, read; fetch summary; last 6% not read].
- **Success is common at population level.** 10% of partnered US adults met their current partner on a dating site or app (7% of all adults) [unverified: Pew's key-findings page confirms one in ten partnered adults, July 5–17, 2022, but gives no 7% of all adults; the full report was not re-read] [research, 4, read; fetch summary; US survey, July 2022]. This sizes success, not churn.
- Hinge measures dates, not exits: 90% said first dates were "great", 72% wanted a second [press, 6, read; fetch summary; beta, no denominator, company figures]. "Designed to be deleted" is positioning, with no published exit figure [snippet-only, 7].
- LeFebvre's Tinder study says lack of success, including no matches, was "one of the main reasons users quit" [research, 8, snippet-only; n=395, 18–34; no percentages seen].

## 3. Theory: a platform paid by search time gains from slow success

- In Gieselmann's model, matched pairs leave and revenue comes only from active users, so "the platform strategically lowers match quality to increase search time and thus profits" [research, 5, read; fetch summary; theory, monopoly platform, no data]. This is why "cut churn" is the wrong goal for a matching product: the cheapest way to cut success churn is a worse product [derived from 5].

## What this changes

1. **No warning in `unit_economics` now.** The brief's rule asks for a sourced, sizeable success *share of churn*. No source gives one: the one survey with a denominator is multi-answer, one country, a convenience sample, and not a share of exits. And the tool's numbers stay right as averages. A warning would need a business-type flag the tool does not have, and would be advice text, not a caught error.
2. **One playbook line**, in `knowledge/consumer-apps.md` near the retention section (line 11), not `retention-and-expansion.md`, which already says to read churn by cohort and reason (lines 25, 66): "For products that end when they work (dating), some churn is success. In one survey a third of users named starting a relationship as a reason they left, and more named failure or fatigue [research; survey, n=349; Portugal; convenience sample; multiple answers; not a share of exits]. Ask leavers why. Track the failure share, not total churn, and do not set lower total churn as the goal." `test/consistency.test.ts` covers the names; no new test needed for a playbook line.
3. **A held `check_answer` flag**, built only from a real failing answer: an answer for a dating case that sets "reduce churn" as the target without splitting success from failure returns an issue; the same answer for a SaaS case does not. Hold until an evaluation run on a dating case shows the error.

## What this does not settle

- The share of exits that are success, from any app's own exit data. A founder can measure it with a one-question exit survey; no public figure was found.
- Whether success leavers come back after a break-up, which would make a single churn rate understate value. No source on dating reactivation was found.
- Whether success leavers bring new users by word of mouth, and how much.
- Rakuten Insight's Asian quitting-reason figures (paywalled).
