# Fact-check: network notes (2026-10-28)

Notes checked: `business-meetings-experiments.md`, `dormant-ties.md`, `coworking-and-meetups.md`. For each, the claims its "What this changes" rests on, checked at source.

Access: curl to every source host was refused at the proxy (403): nber.org, academic.oup.com, business.gwu.edu, hhs.se, the Columbia host, repec.org and others. So every check went through WebFetch, which returns a model summary of the page. Verdicts below are "confirmed at source (fetch summary)", not checked against a full text by eye. The published QJE text of Cai & Szeidl was not reachable; the NBER working paper, the 2018 CEU working-paper abstract and CEU's record of the QJE article were. Five searches used.

Verdicts: confirmed; corrected (tag added in the note); unverified (tag added); implication = would the correction change a proposed edit or test.

| # | Note | Claim | Source checked | Verdict | Changes an implication? |
|---|------|-------|----------------|---------|------|
| 1 | business-meetings | 2,800 firms, 1,480 in meetings, 1,320 control | NBER w22951; CEU 2018 WP abstract; CEU record of QJE 133(3):1229–1282 | corrected: WP says 2,800 (1,480 + 1,320); the 2018 abstract says "We randomized 2,820 firms" | no |
| 2 | business-meetings | Groups of 10, monthly for a year, about half a day, host-firm tour, firms set up in past 3 years | NBER w22951 | confirmed | no |
| 3 | business-meetings | 36 employees on average; about half manufacturing, 48% services | NBER w22951 | confirmed | no |
| 4 | business-meetings | Sales +8.1% just after meetings, +10.3% one year after (endline summer 2015) | NBER w22951; CEU abstract (8.1%) | confirmed | no |
| 5 | business-meetings | "Essentially all treatment effects persisted one year after the meetings had concluded"; profit, clients, suppliers, loans, management score rose | NBER w22951 §3.3 | confirmed | no |
| 6 | business-meetings | Referrers 2.18 vs 0.06, partners 1.44 vs 0.29, regular vs one-time groups; 439 managers in 43 one-time groups | NBER w22951, Table 10 | confirmed | no |
| 7 | business-meetings | One-time meetings designed to test frequency; trust quote (§4.2); trust game 3.52 vs 0.94; management peer effect halved (0.21 to 0.111); no test of 8.1 vs 10.3; attendance not reported | NBER w22951 | confirmed (lines added by another agent during the check, checked too) | no |
| 8 | business-meetings | Information: +31.5 (grant) and about +33 (savings) points from an informed member; about −17 points with competitors for the grant | NBER w22951, Tables 8–9 | confirmed (table layout garbled in extraction for the savings row) | no |
| 9 | business-meetings | "these results do not yet conclusively identify the mechanisms" | NBER w22951 | confirmed | no |
| 10 | business-meetings | Fafchamps & Quinn: contact was one-off; +16 points spoken since; no more business friends; 337 firms; sales not measured | NBER w21132 | corrected: committees of five or six judges met three times; the rest confirmed (16.1 points, no business-friend effect, VAT and bank account spread, sales volume not measured) | no |
| 11 | business-meetings | Ghana: n=1,771, groups of eight, four months, profits +26%, only 3% still in touch after three years, effects gone | IGC policy brief | confirmed (the review's 21% not re-checked) | no |
| 12 | business-meetings | Kenya: mentor raised profits 20%, faded as matches dissolved | AEJ: Applied abstract, aeaweb.org | confirmed | no |
| 13 | business-meetings | Proposed `what`: "a single meeting almost never did" (get referrals and partners) | NBER w22951, Table 10 | corrected: true for referrers (0.06), not partners (0.29 from one meeting vs 1.44 from twelve); reword to "almost never led to a referral" | **yes** |
| 14 | dormant-ties | 224 executives, four EMBA classes (three US, one Canada), 129 answered both surveys; dormant = 3+ years; current ties picked at random; six-item 1–7 scale, about a month later | Levin et al. 2011, author copy | confirmed | no |
| 15 | dormant-ties | Means 5.70 vs 5.63 (n.s.) and 5.59 vs 5.20 (p < .05); +0.27 with controls, p ≈ .02 | Levin et al. 2011, Table 3 and Model 2 | confirmed (decimals reconstructed from extracted text) | no |
| 16 | dormant-ties | Dormant ties gave more novel advice and took less time; trust decayed a little; shared outlook did not detectably decay | Levin et al. 2011 | confirmed (time saving significant for once-close ties only) | no |
| 17 | dormant-ties | Second sample 116 invited, 95 answered; ranked 10; rank vs value r = −.07, n.s. | Levin et al. 2011, Study 2 | confirmed | no |
| 18 | dormant-ties | 156 executives, 117 answered; value from status, trust, willingness to help, less prior contact; preference for familiar; no current ties compared | Walter et al. 2015, author copy | confirmed | no |
| 19 | dormant-ties | 94% got some valuable advice; 90% enjoyed it | Walter et al. 2016 (MIT SMR), author copy | corrected: 94% of reconnections, not of executives | no |
| 20 | dormant-ties | Reconnection works with remembering, catching up, perceiving the tie similarly; Italian textile district plus US vignette | Rondi et al. 2024 abstract, RePEc | confirmed (sizes not on the page) | no |
| 21 | dormant-ties | No study measures sales, clients or introductions; no outside replication | none: absence claim | unverified: not re-searched | no |
| 22 | coworking | Nine Austin spaces, 16 owners, 17 members, 2008–2011 | Spinuzzi 2012 | confirmed | no |
| 23 | coworking | Three members of one space subcontracted others there; "I've seen them make agreements and deliver or not deliver" | Spinuzzi 2012 | confirmed | no |
| 24 | coworking | 5 of 17 described coworking as working on projects together; a client-facing space "sought customers rather than partners"; every space had both patterns | Spinuzzi 2012 | confirmed ("second space formed none" not checked) | no |
| 25 | coworking | Deskmag: 38% said income rose since joining, 2.5% fell | Deskmag, 1 Feb 2012 | corrected: 38% said coworking "directly improved their income"; 2.5% said income fell | no |
| 26 | coworking | 3.6 useful new acquaintances in two months; 84% attend events | Deskmag, 20 Dec 2011 | confirmed (respondent count not on the page) | no |
| 27 | coworking | Mixer: 92 executive MBA guests, 80 minutes, knew about a third of the room, about 14 encounters each, "roughly evenly" friends and strangers; strong friendship +223% | Ingram & Morris working paper | confirmed (97 attended, 92 analysed) | no |
| 28 | coworking | 95% came to meet new people; "no (or not very much)"; go without your friends | Ingram & Morris working paper | confirmed (the advice is backed by an observed pattern, not a test) | no |
| 29 | coworking | Proposed playbook line: "people spend about half their time with people they already know" | Ingram & Morris working paper | corrected: the paper counts encounters, not time | **yes** (wording of the proposed `small-bets.md` line) |
| 30 | coworking | 402 researchers, 90-minute sessions, 26,789 pairs, 0.28% vs 0.16%, about 70–75%, significant at 10% in the basic model | Boudreau et al. 2012 WP; 2017 abstract (75%) | confirmed (5% level in one later column) | no |
| 31 | coworking | Same clinical area 0.35% to 0.94%; no larger effect for complementary-skill pairs | Boudreau et al. 2012 WP, Table 5 | confirmed | no |

## Totals

- Claims checked: 31 (business-meetings 13, dormant-ties 8, coworking 10).
- Confirmed: 24.
- Corrected: 6 (#1, #10, #13, #19, #25, #29).
- Unverified: 1 (#21).
- Corrections that change an implication: 2 (#13, #29). Both change the wording of a proposed edit, not its direction. The proposed tests still hold: `/same group/` and `/12 months/` for `build-a-network` are unaffected.

## Not checked

- The VoxDevLit review's 21% and "no sales effect" for Ghana, the Togo figures and the 112-entrepreneur IGL project (supporting, not under "What this changes").
- Mariotti & Delbridge 2012; the Michigan coworking studies; the Moore thesis.
- The published QJE text of Cai & Szeidl.
