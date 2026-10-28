# What is a full caseload for a solo dietitian or freelance designer, and what does `readStage` do with one? (checked 2026-10-28)

Question: `readStage` in `src/lib/smallBets.ts` puts stage 2 ("steady use") at 100 active users or 2,000 monthly visits. A person who sells their own hours may be fully booked well below either number. How many clients does a full solo practice hold, and which bets does the tool keep from such a person?

Hop 0 from lead #132. Access marks as in `_conventions.md`. Overlaps: `knowledge/professional-services.md` "Utilization and pipeline math" (firms, hours based); `research/small-bet-base-rates.md` (base rates for bets, nothing on stage thresholds); `research/deciding-at-founder-volume.md` (noise at 5–100 events a week). No note named "founder-volume-baselines" exists; the grep finds only `deciding-at-founder-volume.md`.

## Sources

1. `src/lib/smallBets.ts` (`readStage`, `STAGE2_USERS`, `STAGE2_VISITS`, `STAGE_LABEL`, `matchSmallBets`), `src/lib/smallBetsCatalog.ts`, `test/smallBets.test.ts` lines 32–41, at the working tree of 2026-10-28. [read 2026-10-28; tool source]
2. Fixture runs through `scripts/mcp.mjs` (`save_business_profile`, then `match_small_bets`), each with its own `MARKETING_EXPERT_DATA_DIR`. Profile: category "solo service practice", audiences ["consumers"], surfaces ["service"], revenue "live", launched true, markets ["Quebec"], avoid [], assets.expertise set, traction counted, monthlyVisits 150, payingCustomers 1, 12, 30; one extra run with payingCustomers 250 and activeUsers 30. [read 2026-10-28; my own runs]
3. Rogers, D. & Sauer, K. (2025). "Compensation and Benefits Survey of the Dietetics Profession 2024" summary, *J Acad Nutr Diet* (January 2025), and the survey's executive summary, Commission on Dietetic Registration. https://www.cdrnet.org/vault/2459/web//2024%20Compensation%20and%20Benefits_JAND%20January%202025.pdf and https://cdrnet.org/vault/2459/web//Compensation%20Benefits%20Survey%20of%20the%20Dietetics%20Profession%202024-TOC_Exec%20Sum.pdf [read 2026-10-28; fetch summary; author names not checked] [corrected 2026-10-28: the JAND article's author is Erik Dosedel (Readex Research), not Rogers & Sauer]
4. Tol, J., Swinkels, I. & Veenhof, C. (2012). "What factors are associated with the number of consultations in dietetic treatment?" *Nutrition & Dietetics* 69(Suppl. 1):65. Conference abstract, Nivel. https://nivel.nl/en/publicatie/what-factors-are-associated-number-consultations-dietetic-treatment [abstract-only, 2026-10-28; fetch summary]
5. American Psychological Association, "2024 Practitioner Pulse Survey: topline data". https://www.apa.org/pubs/reports/practitioner/2024/topline-data-2024-practitioner-survey.pdf [read 2026-10-28; fetch summary]
6. Mentalyc, "What is the average caseload for private practice therapist?" https://www.mentalyc.com/blog/average-caseload-for-private-practice-therapist [read 2026-10-28; fetch summary; vendor: sells therapy note software]
7. Brunton, P., "How much do freelance web designers really earn & work these days? (770+ designers answered!)", undated. https://www.paigebrunton.com/web-designer-salary-and-pricing-survey-results [read 2026-10-28; fetch summary; practitioner; sells web design courses; self-selected sample]
8. Flywheel (WP Engine), "The business of web design: The 2020 report". https://getflywheel.com/business-of-web-design-report/ [read 2026-10-28; fetch summary; vendor: sells WordPress hosting]

Not fetched or not found: curl to cdrnet.org and apa.org PDFs was refused at the proxy (403), so both were seen only through WebFetch. Dietitians of Canada: search found no private-practice caseload survey (only long-term care and new-graduate surveys). Jane App, Practice Better and SimplePractice: search found help pages and one SimplePractice practitioner story with no counts, no published averages. AIGA Design Census, Malt, IPSE, Upwork, HoneyBook, Bonsai: search found no client-count or repeat-client figures. No source with a stated method gives a freelancer's share of repeat clients. 15 searches used.

## 1. What `readStage` does with paying clients

- `payingCustomers` can lift stage 0 to stage 1 but never to stage 2. Stage 2 needs `activeUsers >= 100` or `monthlyVisits >= 2000`; paying clients are not in that test. [tool source, 1]
- With 150 monthly visits, profiles with 1, 12 and 30 paying clients all read stage 1 ("0 active users, N paying"). fitsNow, fitsLater and doesntFit are identical for 1 and 30 (compared byte for byte). A profile with 250 paying clients and 30 active users also reads stage 1. [tool output, 2]
- At all three, nine bets wait on stage 2 with "needs steady use (around 100 active users or 2,000 monthly visits)": own-data-report, data-pages, weekly-digest (these three also need `assets.data`), shareable-outputs, co-marketing, own-community, newsletter-sponsorship (also $100 a month), paid-tutorial (also $300 a month), affiliate. press waits on stage 3. No bet moves from fitsLater to fitsNow between 1 and 30 clients. [tool output, 2]
- With traction marked "counted", no assumption line mentions the stage threshold. The only assumption line was about channels. [tool output, 2]
- Side finding: `founder-emails` and `founder-thanks` stay in fitsLater with "needs a way to reach each user (accounts or emails)". A practice that books clients holds every client's email; nothing in the profile says so unless `assets.accounts` is set. [tool output, 2; derived]

## 2. Which stage-2 bets suit a full solo practice

- Fits: co-marketing (a joint webinar or post with a complementary professional who serves the same people); own-community as a client newsletter, subject to consent rules (`marketing-law-by-market.md`); newsletter-sponsorship, which needs budget more than users. [derived]
- Weak fit: own-data-report and data-pages. A practice's own records are a few dozen clients, and for a dietitian they are health information. shareable-outputs suits a designer's finished work more than a dietitian's results. [derived]
- Needs a rules check first: affiliate (paying for referrals) and paid-tutorial (paying a client to write) for a regulated health professional. Lead #130 covers those rules; not checked here. [derived]
- Poor fit: weekly-digest (an automated community summary). [derived]

## 3. Dietitians: no surveyed caseload found

- The 2024 US compensation survey: 5,652 usable responses from 46,646 sampled (12%), weighted. 8% of practitioners are self-employed; 3% of practicing RDNs (weighted n=4,814) have private practice client care as their main job. It reports no clients or sessions per week, and no full-time share for the self-employed; 84% of all practicing RDNs work full-time, year-round. [research, 3, read; fetch summary; US; no caseload item]
- Dutch private practice, 2006–2009: 6,496 patients treated by 27 dietitians; mean 4.9 consultations per treatment; the middle 95% of dietitians ran from 2.3 to 10.1. [research, 4, abstract-only; one registry; Netherlands; primary care referrals]
- That is about 240 patients per dietitian over the period, roughly 60 to 80 new patients a year, or 300 to 400 consultations a year. Full-time or part-time is not stated. [derived from 4; assumes the period is 3–4 years]
- Nearest profession with numbers, therapists: 70% of 851 psychologists work mainly in private practice, 79% of those solo (528 of 672); 48% of 1,104 work full-time, 35% part-time. No weekly count. [research, 5, read; fetch summary; US psychologists; response rate not reported] The often repeated "20 to 30 clients a week" for a full-time therapist traces to Reddit discussions. [vendor, 6, fetch summary; no survey]
- If a full-time dietitian runs about 20 to 30 sessions a week with follow-ups every two to four weeks, the active roster is roughly 40 to 120. That is my arithmetic on unsourced inputs. [derived; rule-of-thumb inputs]

## 4. Freelance designers: a handful of clients a month

- Of 771 web designers, the "clear majority" serve 1 or 2 custom clients a month, then 2–4; about 14% take 4 or more. [corrected 2026-10-28: the post calls 1 or 2 a month the largest group and gives no share for it; "clear majority" is not its wording] About 40% work 20 hours a week or less; 62% say design is their main income, 38% part-time or employed. [practitioner, 7; self-selected through the author's network; Squarespace-heavy; undated]
- Under 40% of web design businesses earn retainer income, freelancers and agencies mixed. [vendor, 8; n "over 1,000", method not described; 2020]
- So a full-time freelance designer has roughly 12 to 50 clients a year, far below 100 active users. [derived from 7]

## 5. Where this agrees and disagrees with the playbook

- Agrees with `professional-services.md`: capacity is hours × utilization, not users. That section is written for firms and has no client-count threshold for a solo expert. [derived]
- Disagrees with `readStage`'s comment that stage 2 "starts around a hundred active users". For a service, 100 is a full or overfull roster for a dietitian on these weak figures and several years of clients for a designer. [derived]

## What this changes

1. **`readStage` in `src/lib/smallBets.ts`: paying clients count for services.** Add `SERVICE_STAGE2_CLIENTS = 20`. When `surfaces` includes "service" and `payingCustomers >= 20`, return stage 2 with basis "N paying clients; for a service, stage 2 starts around 20 (rule of thumb: a full solo practice holds tens of clients, not hundreds)". 20 is a judgment call: about half a full designer year, and the low end of a dietitian's derived roster. `STAGE_LABEL[2]` becomes "steady use (around 100 active users, 2,000 monthly visits, or 20 paying clients for a service)".
   - Test (`test/smallBets.test.ts`): `readStage({ surfaces: ["service"], traction: { payingCustomers: 20, monthlyVisits: 150 } }).stage === 2`; the same traction with `surfaces: ["web-app"]` gives 1; `payingCustomers: 12` with "service" gives 1. And `matchSmallBets` on the §1 profile with 30 clients puts co-marketing in fitsNow; with 12 it stays in fitsLater.
2. **Assumption line** in `matchSmallBets` for any service profile below the threshold: "Stage for a service is read from paying clients (stage 2 around 20). A full solo practice may never reach 100 active users or 2,000 visits; the threshold is a rule of thumb, not measured." Test: the 12-client service profile's `assumptions` match `/paying clients/`.

## What this does not settle

- No survey with a stated method gives a solo dietitian's active clients or sessions per week, in Canada or the US. The 20 is not measured.
- No source gives a freelancer's share of repeat clients.
- Whether paying customers should also count toward stage 2 for non-service products (250 paying customers reads stage 1 today) is a separate question.
- Whether affiliate and paid-tutorial are allowed for a regulated health professional (lead #130).
