# Fact-check of the round-4 dating notes (2026-10-27)

Nine notes checked: `reciprocal-liquidity.md` (R), `dating-ad-and-store-rules.md` (B), `dating-hard-side.md` (C), `dating-market-thickness.md` (D), `seeded-profiles-law.md` (S), `dating-ad-certification.md` (G), `dating-churn-on-success.md` (H), `dating-like-rates-recent.md` (L), `dense-pocket-launches.md` (P). For each, the claims its "What this changes" rests on.

Routes: curl reached only developer.apple.com (full text). Every other web check went through WebFetch, so it is a fetch summary, not the page. Where possible a different copy was used from the one the note used. Repo claims were checked by running `node scripts/mcp.mjs` on the current build, with a scratch `MARKETING_EXPERT_DATA_DIR`, or by reading the source.

Verdicts: confirmed; corrected (tagged in the note); unverified (tagged in the note, with why). "Changes implication" is marked where a correction would change what the note proposes. None does.

| Note | Claim | Route checked | Verdict |
|---|---|---|---|
| R1 | `liquidity_math` at 30/day, shares 5/15/30%, 7 days: "about 100%"; 5% filter needs "about 5 listings a day" | Ran the tool | Confirmed |
| R2 | 15/day at share 0.003: 0.045 a day, 27% in 7 days; third warning says "multiply by your contact and reply rates" | Ran the tool; read `src/lib/liquidity.ts` | Confirmed |
| R3 | Test: men 0.315 a week, 27.0%; women 1.575, 79.3%; like-back ratio 25 | Recomputed (Poisson) | Confirmed |
| R4 | Rios, Saban & Zheng, MSOM 25(4):1304–1323, 2023; "at least 27% more matches", two field experiments | Imperial Spiral record (not RePEc) | Confirmed |
| R5 | Kanoria & Saban: "only a fraction 1/λ of the long side matches"; up to about 10% welfare at λ = 2 | Columbia copy ssrn_id3667353 and EconPapers abstract | Unverified (other copy writes 1/R; no % or λ = 2 found) |
| R6 | Arnosti, Johari & Kanoria: "tragedy of the commons"; names dating; Coffee Meets Bagel and Tinder cap likes | Columbia copy ssrn-2427960 (not NSF PAR) | Confirmed |
| R7 | Hitsch et al.: 71% of men's and 56% of women's first contacts get no reply; Boston and San Diego, 2003 | 2006 working-paper copy (docs.asian-nation.org) | Confirmed (working-paper wording) |
| R8 | Sample of 3,004 men and 2,783 women | Same copy; no head counts there | Unverified |
| R9 | Bruch & Newman: replies 15–20% (men), 34–45% (women); about 187,000 users; January 2014; four cities | ar5iv.arxiv.org copy, Table 1 (sum 186,935) | Confirmed |
| R10 | 1,504 messages; about 25% more desirable; "never rise above 21%" | Same | Confirmed |
| R11 | Tyson et al.: matches per like 0.55–0.78% (male stock) and 10.2–10.5% (female); 238 of 43,290; 682 of 6,631 | arxiv.org PDF, Table I; ratios recomputed | Confirmed (the arXiv copy names no venue; ASONAM not checked) |
| R12 | 7% of male and 21% of female matches sent a message | Same | Confirmed |
| R13 | `design-and-marketing-in-crowded-markets.md` §5 says the tool "already covers the density side" | grep, line 92 | Confirmed |
| B1 | Apple 4.3(b) text naming dating; "may remove these apps"; 4.3(a) one app with location variants; "Last Updated: October 16, 2026" | curl, full text | Confirmed |
| B2 | Apple 1.2 four required tools; "hot-or-not" and random chat; 1.1.4 "hookup"; 5.1.1(v) in-app account deletion | curl, full text | Confirmed |
| B3 | Google: "must be certified by Google in order to serve ads"; enforcement from 4 March 2025 | 15328393 (en-GB) and 15327789 (en-GB) | Confirmed ("in-depth review" not on 15327789) |
| B4 | Restricted = Search only; General = Search, Display, Video; under-18 rule; Japan separate; 18 countries from August 2025 | 15328393 and 16473212 (en-GB) | Confirmed |
| B5 | Google bars synthetic profiles or chatbots without disclosure | 15328393 (en-GB) | Confirmed |
| B6 | Meta: dating ads need prior written permission; 18+ | madgicx.com guide (third-party, not ConductAtlas) | Confirmed at third-party level; Meta's page still not seen |
| B7 | TikTok: sales rep, 18+, models who look 21 or younger, casual-sex apps banned | ads.tiktok.com/resources/... copy | Confirmed |
| B8 | TikTok: 15 closed countries incl. Turkey; updated June 2026 | Both copies: /resources/ copy lists 9, no Turkey, August 2026; ?lang=en lists 15 with Turkey | Unverified (copies conflict) |
| B9 | Snap: 18+ or age of majority; no approval step; 15 entries closed | values.snap.com | Confirmed |
| B10 | Apple Ads: dating "Allowed*" only in search results; adults-only in some countries; 26 Feb 2025 | ads.apple.com/policies (§5.2, §4.6.3) | Confirmed |
| B11 | Play: dating apps must use Play Console tools to block minors; no effective date | 16302250 (en-GB) | Confirmed |
| B12 | `match_small_bets` gives `listings` "works with no users" to a pre-launch consumer dating app; no 4.3 note; `factsFromProfile` drops `category`, `product` | Ran the tool; read `smallBets.ts:257–258` | Confirmed |
| B13 | No ad-platform bet in the catalog; paid bets are newsletters, sponsorships, commissioned posts | Read `smallBetsCatalog.ts` ids | Confirmed |
| C1 | Lee & Niederle: 613 users (304 men, 309 women); rose +3.3 points, about 20%; 1,902 proposals | Stanford copy of the Dec 2014 version (not UMD) | Confirmed (text says 1,921; tables 1,902) |
| C2 | 8 vs 2 roses: women 0.705 vs 0.379; men 0.833 vs 0.556 | Same, Table 3 | Confirmed (NBER 2011 version gives other values; the note's version matches) |
| C3 | Bapna et al.: 100,000 new users, 50,000 anonymous for a month; women 14% fewer matches; women don't make the first move | Newswise release (not the Carlson PDF) | Confirmed (4.089 to 3.513 not seen; arithmetic gives 14.1%) |
| C4 | Lehmann et al.: 4,238 women, 8,788 men; 4.6% and 1.5%; -2.2 points per 100 extra likes; no churn analysis | RePEc abstract, then wp964 PDF | Confirmed |
| C5 | Huang et al.: randomised, matching efficiency up, mostly men and heavy senders | SUFE abstract record (not RePEc) | Confirmed |
| C6 | Huang et al.: "one Chinese mobile platform" | Same | Unverified (abstract names no country) |
| C7 | Karmegam et al., ISR 2026; Indian matrimony site; not randomised; 6% fewer requests, 72% efficacy | George Mason news release; INFORMS record "Published Online: 15 Jun 2026" | Confirmed (figures still secondary) |
| C8 | Kanoria & Saban: platform "should force the more selective side ... to reach out first" | EconPapers abstract | Confirmed |
| C9 | Bumble "Opening Moves", NPR, 6 May 2024 | Search: NPR and eight member stations' syndications | Confirmed (headline and date only) |
| C10 | `checkLabels` returns `ok` for "[research, Hagiu & Wright 2024]" against `marketplaces:81` "research (theory), …"; QUALIFIER lacks theory, observational, one site, quasi | Ran `checkLabels` from `dist/`; then a scratch copy with those words added returns `qualifier-dropped` (and `ok` with "(theory)" kept) | Confirmed; the proposed test works |
| D1 | Fong 2024, Marketing Science 43(5):971–985; market size deters participation; more selective | RePEc record | Confirmed |
| D2 | "a 50% increase in market size reduces the probability of participation by 1%" | orsc.informs.org copy of the release, 11 Sep 2024 | Confirmed |
| D3 | 225,680 users; 90/10 split; 84,589 exposed; pop-up text; 0.75–1.25 scaling | Wharton JMP PDF | Confirmed |
| D4 | 50% more believed users: matches -2%; rivals +3%; average market about 11,000 | Same | Confirmed |
| D5 | Fisman et al.: male selectivity invariant, female increasing in group size; WP 1882 | gsbpreserve.stanford.edu/view/1882 | Confirmed |
| D6 | Li & Netessine: market doubled; confirmation -15.4%, occupancy -15.9%, search +18.3%; holiday rentals | Mack Institute page | Confirmed |
| D7 | Lenton & Francesconi: 84 events; 24+ dates; height, weight; Psych Sci 2010, 528–533 | APS Observer article (not ScienceDaily) | Confirmed |
| D8 | Chen: atomic network "maybe on the order of hundreds of people, at a specific moment in time" | Lenny's excerpt | Confirmed (same route; no other copy found) |
| D9 | `liquidity_math` at 20 then 40 listings, 2% share: 0.4 then 0.8 a day | Ran the tool | Confirmed |
| S1 | JDI Dating: 18 sites; "Virtual Cupids"; $616,165 redress | NPR report (not ftc.gov) | Confirmed (icon and order wording not seen there) |
| S2 | Ashley Madison: 13 states plus DC; $8.75 million suspended on $1.6 million; "fake engager profiles" | FTC release, ftc.gov/node/45098 | Confirmed |
| S3 | 24,414 engager profiles "to entice users to upgrade" | Same; ZwillGen summary | Unverified (no count or phrase in either) |
| S4 | LG Berlin 16 O 62/21, 17 Feb 2022, § 5 and § 5a UWG | vzbv case page | Corrected: 27 Jan 2022, final, disclosure before registration; no § cited there |
| S5 | CMA: don't create your own profiles to talk to customers; "generated by you, or on your behalf"; "in a timely and clear manner"; list of sites before sharing data; 13 Jun 2018, updated 3 Jun 2026 | gov.uk page | Confirmed |
| S6 | CMA: a terms clause making customers accept such profiles is not enough | Same | Unverified (no such sentence seen) |
| S7 | UCPD Annex I point 22: "falsely representing oneself as a consumer" | EUR-Lex (not ippt.eu) | Confirmed |
| S8 | Match: Section 230 dismissal in March 2022; $14 million settlement, August 2025, ads, billing, cancellation | Search: Bloomberg 24 Mar 2022 headline; Mondaq, TCPAWorld 12 Aug 2025 | Confirmed ("content-neutral tools" not seen) |
| S9 | Korea PIPC fined Techlabs about 220 million won in 2024; police referral | datingnews.com (not Korea Times) | Confirmed |
| S10 | 276 fake accounts; about a year | Same | Unverified ("over 270"; October 2021 to April 2022) |
| S11 | AI Act Art. 50 applies from 2 August 2026 | artificialintelligenceact.eu Article 113 | Confirmed (by Art. 113 structure) |
| S12 | 16 CFR 465 "fake indicators of social media influence" covers accounts "not associated with a real individual" | eCFR (not Cornell) | Confirmed |
| S13 | Apple guidelines name dating only in 4.3(b); no fake-profile rule | curl, full 100,892-character text | Confirmed (whole page now read, not 79%) |
| G1 | Google certification form asks no user count, revenue or launch date | Form page | Confirmed |
| G2 | Only Play, App Store apps and websites; test log-ins; recording of home, login and post-login screens and plans | Form page | Confirmed |
| G3 | Under-18, synthetic-chatbot, sign-up-guidelines and privacy-law confirmations | Form page | Confirmed |
| G4 | 30-day wait before the same customer ID can apply again | Form page | Confirmed (quoted in the fetch summary this time; still a fetch summary) |
| G5 | Processed "as soon as possible"; no time published | Form page | Confirmed |
| G6 | "all advertisers will eventually be required to complete advertiser verification"; financial services named; dating not | 9703665 (en-GB) | Confirmed |
| G7 | TikTok landing page must be Play, App Store or a website | TikTok /resources/ copy | Confirmed |
| H1 | `unit_economics` (20, 0.8, 0.25, 30): LTV 64, LTV:CAC 2.13, payback 3, no warnings | Ran the tool | Confirmed |
| H2 | Sepúlveda 2024, Palabra Clave 27(1): n=349; relationship 118 (33.8%); 221, 191, 144, 113; multiple answers; 82.8% no longer use; 2022; convenience sample | Journal abstract page, then the full-text download | Confirmed (Portugal not stated in the abstract) |
| H3 | Bumble FY2025 10-K: retention falls "as a result of members finding meaningful relationships"; no rate | sec.gov via WebFetch, first 100,000 characters | Confirmed (same route; no other copy) |
| H4 | Pew: 10% of partnered adults met their partner on a site or app; July 2022 | Pew key-findings short read | Confirmed |
| H5 | 7% of all adults | Same | Unverified (not on that page) |
| H6 | Gieselmann: "strategically lowers match quality to increase search time and thus profits"; pairs exit; revenue only from active users | TSE seminar copy (not CERGE-EI) | Confirmed |
| H7 | Hinge beta: 90% first dates great, 72% wanted a second | TechCrunch | Confirmed |
| L1 | Rios et al.: about 800,000 active users, 150+ markets; lists mean 3.53, median 3 | Spiral PDF | Confirmed (same route; no other full text found) |
| L2 | Houston 19–25 Aug 2020; Austin 9–15 Sep 2020; matches +37.95% | Same | Confirmed |
| L3 | Table 2 before counts for Austin, Dallas, Houston | Same | Confirmed |
| L4 | 39–42% liked; matches 6.4–7.9% of likes, 2.5–3.3% of shown | Recomputed from Table 2 | Confirmed |
| L5 | Table 3: backlog liked 21–23% (869 of 3,712); others 39–44%; sums equal Table 2 | Same; recomputed | Confirmed |
| L6 | SwipeStats: 7,000+ profiles, 294M swipes; women 44.4%, men 5.26%; 21 Apr 2026 | swipestats.io | Confirmed (vendor; page modified 7 Sep 2026) |
| L7 | Implied right-swipe shares about 36% (men), 5% (women) | Recomputed from the page's averages | Confirmed |
| L8 | Curated test: 2.77 a week, 93.7%, no gap warning; gaps 13–19x and about 8x | Recomputed | Confirmed |
| P1 | Crimson, 9 Feb 2004: "over 650 students had registered"; 900 expected | thecrimson.com original (not the Duke reprint) | Confirmed |
| P2 | Tinder seeded at USC "with just 300 people"; 1,000 by week's end; almost 15,000 | Fox News reprint of the Entrepreneur piece | Confirmed |
| P3 | The League: 500-person founding class; "large enough mass"; 3,000+ Richmond downloads | WTVR report (not Richmond BizSense) | Confirmed |
| P4 | Hinge DC: "over 20,000 are active" of "110,000 single college grads"; 85% week, 75% month | TechCrunch AMP | Confirmed |
| P5 | Ugander et al., PNAS 109(16):5962–5966; 54 million invitations; size "a negative indicator" once components fixed; 3-month engagement | Facebook Research PDF (not PMC) | Confirmed |
| P6 | `factsFromProfile` passes no `category` or `product`, lines 257–258 | Read the source | Confirmed |
| P7 | Pre-launch dating vs B2B invoicing: 8 of 9 fitsNow shared; only `merchant-visits` and `integration` differ | Ran the tool: dating (consumers, local, mobile-app) vs B2B (businesses, web-app) | Confirmed (with `local` in the dating audiences; without it the dating list has 8 and only `integration` differs) |

## Totals

- Checked: 87
- Confirmed: 78
- Corrected: 1 (S4, a judgment date; does not change the implication)
- Unverified: 8 (R5, R8, B8, C6, S3, S6, S10, H5)
- Fabricated: 0

No correction changes an implication. Points for the owner:

- **B8:** the two TikTok copies conflict on the closed countries. This does not touch the "sales rep first" finding.
- **R5:** this does not touch the proposed mode. The note uses the paper only for a warning.
- **C10:** a scratch copy with the wider QUALIFIER returns `qualifier-dropped`, so the proposed fix and test work as written.
- **Route caveat:** L1–L5 (Rios tables), D3–D4 (Fong) and H3 (Bumble 10-K) have no second full-text copy. They rest on the same WebFetch summary route the notes used.

## Orchestrator spot-checks (2026-10-27)

| Source | Route | Verdict |
|---|---|---|
| Apple App Review Guidelines 4.3(b), dating sentence | curl of developer.apple.com, page "Last Updated: October 16, 2026" | confirmed verbatim [read, full text] |
| Fong 2018 job-market paper: 50% more believed market size "decreases matches by 2%" at M = 11,000 | WebFetch of the Wharton PDF (fetch summary) | confirmed. Sample: "selected from 225,680 active users"; "84,589 users were exposed" after 3 weeks. `dating-market-thickness.md` said 225,680 "were split": corrected in place |
| Fong 2024, *Marketing Science*, doi 10.1287/mksc.2023.0142 | search results (INFORMS, EBSCO) | confirmed title, venue, DOI |
| Tyson et al. 2016, arXiv 1607.01952 | arXiv abstract (fetch summary) | confirmed exists; data are from researcher-made "curated profiles", as `reciprocal-liquidity.md` says |
| FTC JDI Dating release | search results (ftc.gov/node/44332, CBS, ABA Journal) | confirmed exists; amount not re-checked (ftc.gov refused) |

Also removed: the campus-rollout working paper in `dense-pocket-launches.md` is no longer named or quoted, because its draft asks not to be cited without permission.
