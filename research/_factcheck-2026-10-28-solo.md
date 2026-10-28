# Fact-check of the round-5 solo-practitioner notes (2026-10-28)

## Batch 1

Three notes checked: `solo-first-clients.md` (A), `solo-practice-capacity-and-stage.md` (B), `practitioner-directories-and-coverage.md` (C). For each, the claims its "What this changes" rests on.

Routes: curl was refused at the proxy (CONNECT 403) for every host tried (17 URLs), so every web check went through WebFetch and is a fetch summary, not the page. No web searches were needed; every source was fetched at the URL the note cites. Repo claims were checked by running `node scripts/mcp.mjs` on the current build (dist/ built after the last source edit) with a fresh `MARKETING_EXPERT_DATA_DIR` per run, and by reading `src/lib/smallBets.ts` and `src/lib/smallBetsCatalog.ts`. The baseline dietitian and designer profiles were re-run from the saved profile files; the proposed regexes were run with node on the profiles' strings.

Verdicts: confirmed; corrected (tagged in the note); unverified (tagged in the note, with why); fabricated (no trace in the cited source). "Changes implication" is yes where the correction changes what the note proposes.

| Note | Claim | Source checked | Verdict | Changes implication? |
|---|---|---|---|---|
| A1 | MBO 2014: word of mouth 75%, agency 12%, employer reference 4%, online job site 3%, social media 3%; online poll, n=2,017 | AJC article (figures); TagTeam mirror (n=2,017, Emergent Research) | Confirmed (TagTeam text gives social media 18% as a top-three source, so the AJC figures likely answer a different question; wording not seen) | no |
| A2 | Qdos 2017: 48% referrals and network, 44% agencies or job boards, 3% cold; n=641, mostly IT | Onrec page | Confirmed | no |
| A3 | Localogy 2022: word of mouth 65%, platforms 54%, social 50% "(multiple answers)" | Localogy page | Corrected: multiple answers not stated, only inferred from a 259% total | no |
| A4 | Freelancers Union and Upwork 2016, n>6,000: most find work through personal networks; friends and family, professional contacts, social media | freeCodeCamp write-up | Confirmed | no |
| A5 | freelancermap 2025: platforms 34%, personal networks 23%, referrals 14%; 2026 n=5,412 | 9am.works page | Confirmed (the 2025 respondent count is not given; "mostly German IT" not checked) | no |
| A6 | Denoo, Soh & Clarysse, JBV 41(2):106570, 2026; 72 Flemish tech ventures; fsQCA; strong ties only with survival, no ties with revenue | Tilburg research portal abstract | Confirmed | no |
| A7 | RGD: all five designers name their own network; one asked a former employer; none names cold outreach or a platform | RGD article | Corrected: four of five name their own network; the fifth held coffee meetings in aligned communities | no |
| A8 | Lenny's: of seven founders with countable answers, three network, three cold email | Lenny's Newsletter post | Corrected: about 27 companies, no tally in the article; rough count about 12 network or investor, 4 cold | no (startups, not solo services, and not a survey: the note's "no warm-network bet" rule still holds; it tilts further toward networks) |
| A9 | No catalog bet uses the person's own network; `cold-one-to-one` in fitsNow for the baseline dietitian and designer; notes are read from category / product (`smallBets.ts` line 358), which `factsFromProfile` passes | Ran `match_small_bets` on both profiles; read source (line 358; `factsFromProfile` line 265) | Confirmed | no |
| A10 | `cold-one-to-one` carries `law: "messages"` and `involves: ["cold-outreach"]`, so avoiding cold outreach drops it; proposed regex matches "registered dietitian", not "invoicing software" | Read catalog; ran regex | Confirmed | no |
| A11 | `professional-services.md` lists past and current clients first among referral sources | Read playbook | Confirmed | no |
| B1 | `readStage`: paying customers lift stage 0 to 1, never to 2; stage 2 needs 100 active users or 2,000 visits | Read source, lines 121–137 | Confirmed | no |
| B2 | 1, 12 and 30 paying clients at 150 visits all read stage 1 with identical lists; 250 paying plus 30 active reads stage 1 | Ran four fixtures; diff of outputs | Confirmed (identical apart from the basis line) | no |
| B3 | Nine bets wait on stage 2 (list as given); press on stage 3; none moves between 1 and 30 clients | Same runs | Confirmed | no |
| B4 | With traction "counted", no assumption line mentions the stage threshold; only a channels line | Same runs | Confirmed | no |
| B5 | `founder-emails` and `founder-thanks` in fitsLater with "needs a way to reach each user (accounts or emails)" | Same runs | Confirmed | no |
| B6 | CDR 2024: 5,652 of 46,646 (12%); 8% self-employed; 3% private practice client care (weighted n=4,814); 84% full-time; no caseload item; authors Rogers & Sauer | cdrnet.org JAND PDF | Corrected: figures confirmed; author is Erik Dosedel | no |
| B7 | Nivel: 6,496 patients, 27 dietitians, 2006–2009, mean 4.9 consultations, 95% interval 2.3–10.1 | Nivel abstract page | Confirmed | no |
| B8 | APA 2024: 70% of 851 mainly private practice; 79% solo (528 of 672); 48% full-time, 35% part-time of 1,104; no weekly count | apa.org PDF | Confirmed | no |
| B9 | Brunton: 771 designers; "clear majority" 1–2 clients a month; about 14% take 4+; about 40% work 20 hours or less; 62% main income | paigebrunton.com post | Corrected: "largest group", share not given; other figures confirmed | no (the derived 12–50 clients a year still follows) |
| B10 | `readStage` comment says stage 2 "starts around a hundred active users"; STAGE_LABEL text as quoted | Read source, lines 121 and 140 | Confirmed | no |
| C1 | Google Business Profile needs "in-person contact with customers during its stated hours"; online-only businesses ineligible | support.google.com 13763036 | Confirmed | no |
| C2 | Dietitians of Canada directory filters by province, language, expertise, and "private practice, primarily individual client counselling"; no virtual-care or direct-billing filter | members.dietitians.ca directory | Confirmed (the private-practice item is an option under "Area of practice") | no |
| C3 | Lumino Health: booking requests, "virtual appointments" mark, language and rating filters, costs from Sun Life claims | luminosante.sunlife.ca Repentigny page | Confirmed | no |
| C4 | Sun Life direct billing for dietitians from 1 Feb 2026; proposed note: "Sun Life opened both [directory and direct billing] to dietitians in 2026" | dietitians.ca news item | Corrected: registration for eClaims opens 1 Feb 2026; the item does not mention Lumino, and no source dates dietitians' Lumino listings | **yes**: the proposed `listings` note text should say only that Sun Life opened direct billing to dietitians in 2026 |
| C5 | CLHIA via trade press: 27 million with supplementary health benefits in 2025; group plans 92% | Benefits and Pensions Monitor, 21 Oct 2026 | Confirmed | no |
| C6 | One practitioner: about 80% of plans cover dietitians, up from 20–30%; $300–1,000 a year, $500 most often | Benefits and Pensions Monitor, 12 Mar 2026 | Confirmed (speaker: a co-founder of a firm selling dietitian services to plans) | no |
| C7 | DC: "many Canadians don't have coverage"; ODNQ: some plans pay for naturopathy, not dietitians; "may steer clients toward less safe or less effective options" | DC campaign page; ODNQ letter, 1 Oct 2025 | Confirmed | no |
| C8 | Psychology Today $29.95 a month; a therapist's "at least 5 month, 10 on a good month"; another down 50%; company says traffic strong | ClearHealthCosts post | Corrected: the 5–10 quote is an anonymous Reddit commenter; other points confirmed | no |
| C9 | Counseling Today: n=3; one got one to two clients a month from the directory; all three named doctors and word of mouth as better | ctarchive.counseling.org | Corrected: all three named psychiatrists or doctors; only one named word of mouth | no |
| C10 | Dietitian baseline gets `listings` in fitsNow ("works with no users"); proposed regex true for the dietitian's category / product, false for the designer and "online nutrition coach / meal plans"; `notes` mechanism exists (dating note) | Ran `match_small_bets`; ran regex; read catalog | Confirmed | no |

### Totals (Batch 1)

- Checked: 31
- Confirmed: 23
- Corrected: 8 (A3, A7, A8, B6, B9, C4, C8, C9)
- Unverified: 0
- Fabricated: 0
- Corrections that change an implication: 1 (C4: the wording of the proposed `listings` note)

Not checked: CBS (A source 8), Mentalyc, Flywheel, Today's Dietitian, the Manulife plan booklet and the DC 1-pager and factsheet; none of these carries a claim that "What this changes" rests on, except the booklet's licence wording (C §6), which was not re-read.

## Batch 2

Two notes checked: `regulated-health-pro-advertising.md` (H), `freelance-platforms-first-clients.md` (F). For each, the claims its "What this changes" rests on.

Routes: curl was refused at the proxy (CONNECT 403) for all six hosts tried (legisquebec, canlii, collegeofdietitians.org, support.upwork.com, help.malt.com, nber.org), so every web check is a WebFetch summary, not the page. Two web searches: one for Code des professions s.36(c) (found only the order's own pages, already cited), one for Contra's commission page. The Code des professions text itself did not load (WebFetch returned the regulations index). Repo claims were checked by running `node scripts/mcp.mjs` (save_business_profile, then match_small_bets) on the baseline dietitian and designer profiles, the designer with `avoid: ["moving-users-off-platform"]`, and the dietitian with 10 paying customers, each with a fresh `MARKETING_EXPERT_DATA_DIR`; and by reading `src/lib/smallBets.ts` and `src/lib/smallBetsCatalog.ts`.

| Note | Claim | Source checked | Verdict | Changes implication? |
|---|---|---|---|---|
| H1 | C-26, r. 97.1 adopted by D. 38-2025; replaces r. 97; draft in G.O. 28 Aug 2024 | legisquebec r. 97.1; Gazette PDF, art. 88, p. 5527 | Confirmed (in-force date still not shown) | no |
| H2 | s.76(3) bans testimonials "faux ou trompeur", not testimonials | legisquebec r. 97.1 | Confirmed | no |
| H3 | No article names comparisons or guarantees; s.74 general rule; s.43 scope and effectiveness | legisquebec r. 97.1 | Confirmed ("comparaison", "supérieur", "garantir" absent) | no |
| H4 | s.79 price ads; s.56, s.76(4), s.81 (one year), s.82 packaging | legisquebec r. 97.1 | Confirmed | no |
| H5 | CDO Standard 5: no soliciting testimonials or reviews; no review links (Google named); no incentives; remove testimonials, incl. agency-posted | collegeofdietitians.org ?p=12040 | Confirmed | no |
| H6 | CDO Standard 4: no "better than other dietitians"; no guaranteed outcomes; no "specialist"; before-and-after photos must show typical outcomes | same | Corrected: first three confirmed; the photo lines are a Standard 5 guideline (consent, no manipulation, no testimonial, "outcomes may vary") | no |
| H7 | Diététiste, diététicien, nutritionniste, English forms, Dt.P., P.Dt., RD reserved by Code des professions s.36(c); nutritionniste since 1994 | ODNQ guide 2026; ODNQ legal column 2015 | Confirmed as the order states it (law text not loaded; column adds that Nova Scotia also reserves "nutritionist") | no |
| H8 | Registration where the client lives in BC, AB, SK (temp), MB, ON, QC, PEI; disclosure in NB, NS, NL; so an Ontario client needs Ontario registration | Alliance chart Oct 2022; CDBC table Feb 2024 | Corrected: Ontario confirmed; the 2024 table says NL requires registration (2022 said disclosure) | no (strengthens "most provinces") |
| H9 | US: comply with licensure laws where the client is physically located | cdrnet.org/telehealth | Confirmed (the Academy's "licence in every state" advice, source 12, not re-read) | no |
| H10 | Notes render only in fitsNow (`smallBets.ts` line 358); baseline dietitian has `comparison-pages` in fitsNow and `ask-happy-users` in fitsLater; with 10 paying customers `ask-happy-users` moves to fitsNow; designer category not matched | Ran match_small_bets on four profiles; read line 358 | Confirmed | no |
| F1 | Upwork: Connects $0.15 each, minimum 10; Basic gets 10 a month; price per proposal varies; freelancer fee 0–15% | upwork.com/resources/is-upwork-free | Confirmed | no |
| F2 | Fiverr: flat 20% incl. tips; two different buyer fees on one page | fiverr.com guide, 3 Aug 2026 | Confirmed ($2 / 5% vs 5.5% + $3) | no |
| F3 | Malt: 10%, 5% after six months, 2% for invited clients | help.malt.com | Corrected: excl. VAT; 12% and 6% for sole traders not liable for VAT | **yes**: the proposed `cost` line should say "Malt 10% excl. VAT (12% without VAT registration)" |
| F4 | Contra: no commission; free plan $15 / $29 platform fee; Pro removes it | help.contra.com 9322934; contra.com/commission-free | Corrected: fee bands confirmed; "no commission" is not in source 9 but is on contra.com/commission-free, which gives other figures ($19 company contract fee, Pro $29 a month) | no |
| F5 | Upwork: two years on platform; conversion fee 13.5% × rate × 2,080 h, one payment, parties decide who pays; $30/h gives $8,424 | support.upwork.com 360043723533 | Confirmed (page's own example) | no |
| F6 | Fiverr: no off-platform payment, steering or contact sharing "with the sole purpose..."; "risk permanent suspension"; no time limit | help.fiverr.com 38728907371665 | Confirmed | no |
| F7 | Stanton & Thomas: 83,029 non-US workers, 2008–09; 27% of affiliates vs 10% of non-affiliates found a job; non-affiliates hired took median 13 days and 10 applications | LSE dp1316 (first 100,000 characters) | Confirmed (27% of 10,751 affiliates; window Aug 2008–Dec 2009) | no |
| F8 | Good first feedback raises second-job chance 18–19 points; about 68% re-hired, employer unstated | same | Confirmed | no |
| F9 | Pallais: 952 hired of 3,767; inexperienced controls 12% any job in two months; coarse rating 30%; detailed rating raised hiring and earnings further | NBER w18917 | Corrected: 952/3,767 and 12%→30% confirmed; detailed rating raised experienced workers' earnings, not inexperienced workers' employment | no (first job plus rating still unlocks the next) |
| F10 | No catalog bet carries `moving-users-off-platform`, so the avoid tag rules out nothing for the designer; `listings` names only app stores, registries and directories | Ran match_small_bets with and without the tag (identical lists, avoid saved); grep of catalog | Confirmed | no |

### Totals (Batch 2)

- Checked: 20
- Confirmed: 15
- Corrected: 5 (H6, H8, F3, F4, F9)
- Unverified: 0
- Fabricated: 0
- Corrections that change an implication: 1 (F3: the Malt figure in the proposed `cost` line needs "excl. VAT")

Not checked: Upwork Terms Section 7 (F source 4; not located before either), the Law Insider copies, Gu & Zhu, the OII blog, BC's testimonial statement (H source 7), the Academy licensure map (H source 12) and the Licensure Compact page (H source 13). Also unchecked and worth checking before the bet ships: whether Malt accepts freelancers or clients in Canada.

## Batch 3

Three notes checked: `casl-personal-network-messages.md` (L), `brazil-nutritionist-advertising.md` (N), `argentina-designer-selling-abroad.md` (D). For each, the claims its "What this changes" rests on. Whether CFN Res. 856/2026 is in force was left to lead #154.

Routes: curl was refused at the proxy (CONNECT 403) for all 12 hosts tried (laws-lois.justice.gc.ca, crtc.gc.ca, ecfr.gov, cfn.org.br, planalto.gov.br, in.gov.br, legismap.com.br, cdrnet.org, support.upwork.com, help.fiverr.com, help.contra.com, bcra.gob.ar), so every web check is a WebFetch summary, not the page. One web search (BCRA Comunicación "A" 8330). Res. 856 and Res. 760 were read on LegisMap (secondary host), as the note did; the DOU and cfn.org.br originals were not opened. Repo claims were checked by running `node scripts/mcp.mjs` (save_business_profile, then match_small_bets) on three fixtures, each with a fresh `MARKETING_EXPERT_DATA_DIR` (dist/ built after the last source edit): a Quebec registered dietitian (0 paying), a "nutricionista online" in Brazil (3 paying, stage 1), and a freelance designer with markets Argentina, United States, Spain (0 paying); and by reading `src/lib/smallBets.ts`.

| Note | Claim | Source checked | Verdict | Changes implication? |
|---|---|---|---|---|
| L1 | Family relationship: marriage, common-law partnership or legal parent-child, plus direct, voluntary, two-way communication; in SOR/2013-221 s.2(a) | laws-lois SOR/2013-221 | Confirmed (current to 2026-09-30, last amended 2015-01-15) | no |
| L2 | Personal relationship: two-way communications and factors (interests, frequency, time since, met in person); s.2(b) | laws-lois SOR/2013-221 | Confirmed | no |
| L3 | Referral: s.4(1), one paragraph; referrer has a relationship with both; message discloses the referrer's full name and says it was sent because of the referral | laws-lois SOR/2013-221 | Confirmed ("discloses the full name of the individual or individuals who made the referral") | no |
| L4 | CRTC FAQ: "strictly interpret"; like, Friend, Follow "will generally be insufficient"; Messenger and LinkedIn messaging covered; wall post not; SMS covered | crtc.gc.ca FAQ (modified 2026-02-26) | Confirmed | no |
| L5 | CRTC FAQ: someone sending on behalf of a corporation may not claim a personal relationship | crtc.gc.ca FAQ | Confirmed | no |
| L6 | CRTC FAQ: "Only one CEM may be sent without obtaining the consent" after a referral | crtc.gc.ca FAQ | Confirmed | no |
| L7 | CASL s.1(1) definitions, s.1(3) consent request is a CEM, s.6(8) two-way voice, s.10(9)(c) disclosed address relevant to "business, role, functions or duties" | laws-lois E-1.6 | Confirmed | no |
| L8 | 47 CFR 64.1200(e) covers texts to wireless numbers; (f)(17) "personal relationship" = "any family member, friend, or acquaintance"; personal-relationship defence | ecfr.gov (up to date as of 10/23/2026) | Confirmed (the defence is at (c)(2)(iii); the note cites (c)(2)) | no |
| L9 | Quebec dietitian profile: `cold-one-to-one` lawCheck reads "playbook:marketing-law-by-market#Quebec" only | Ran match_small_bets | Confirmed | no |
| N1 | Res. 856 Art. 69 §2 (no results of self or others, even with consent, incl. AI images), §3 technical-scientific exception, §6 no "garantia dos resultados" | LegisMap Res. 856 | Confirmed | no |
| N2 | Art. 68: publishing prices a right (identify per Art. 24; CDC Art. 31 in II); Art. 68 III bans offers, promotions, giveaways as advertising | LegisMap Res. 856 | Confirmed | no |
| N3 | Art. 74 brands ban (food, supplements, equipment, labs; in person, telenutrition, social media), exceptions technical lead and owner, conflict declaration; Art. 38 AI simulating real people or clinical results; Arts. 116–117 | LegisMap Res. 856 | Confirmed (a third exception, formal hire for technical-scientific material, also listed) | no |
| N4 | No article uses "depoimento" or "testemunho"; CFN president: "O nutricionista pode divulgar o depoimento do paciente" (16 Jun 2026) | LegisMap Res. 856; Agora RN | Confirmed | no |
| N5 | Res. 760/2023 Art. 4 national validity; Art. 4 §2 follow the other country's law; Art. 13 no secondary registration; in force on publication (24 Oct 2023); revokes Res. 666/2020 | LegisMap Res. 760 | Confirmed (Art. 17 also revokes Res. 751/2023) | no |
| N6 | Res. 760 conditions: Art. 2 I, Art. 5 e-Nutricionista, Art. 6 "padrão de referência", Art. 9 VI TCLE, Art. 9 VII no recording, Arts. 10–11 records; Art. 12 §1 bans fees, promotions, giveaways in telenutrition ads | LegisMap Res. 760 | Confirmed | no |
| N7 | CFN manual (rev. Sept 2026): abroad "pode, ainda, ser caracterizado como exercício ilegal de profissão" | cfn.org.br manual PDF | Confirmed ("…profissão/ocupação naquele país") | no |
| N8 | CDR chart: of 52 jurisdictions, 36 license, 3 title only, 4 no statute | cdrnet.org chart, full row listing | Corrected: no totals in the chart; rows give 38 licensure, 7 certification, 3 title, 4 none | no (the derived "general education abroad" offer stands) |
| N9 | Brazil profile: `marketLaw: [{ market: "Brazil", pointer: null }]`; `ask-happy-users` lawCheck "Brazil (not covered yet)"; no Brazil alias in MARKET_ALIASES | Ran match_small_bets; read source line 244 | Confirmed | no |
| D1 | Upwork Direct to Local Bank, Argentina: pesos (ARS), $0.99 a withdrawal, $3,000 limit; AFIP withholding by category; ARBA 0.20%–3.5% | support.upwork.com 211060578, 211063888 | Confirmed (the $3,000 sits under "maximum amount I can withdraw", not labelled per withdrawal; page says AFIP, not ARCA) | no |
| D2 | Fiverr: PayPal $0 / $1 min; Payoneer bank $1 / $20; Payoneer account $3 / $10; location restrictions, no countries named | help.fiverr.com | Confirmed | no |
| D3 | Contra: bank, PayPal, Payoneer, USDC ("most countries"); debit card US only; fees on a linked page | help.contra.com (2025 and 2026 articles) | Confirmed | no |
| D4 | Malt: only "open" countries; proof of registration within three months; passport for non-Europeans; Argentina not seen | help.malt.com step 2511427; step 2511434 failed | Open/blocked confirmed; document requirements unverified (tagged) | possibly: the proposed note text's "with proof of registration" rests on the unread step |
| D5 | Hong & Pavlou: 11,541 software projects; reputation softens language and culture gaps but not time zone | SUFE abstract page | Confirmed ("reputation", not "ratings" in the abstract) | no |
| D6 | Agrawal et al.: rich-country employers less likely to hire LDC workers; verified experience helps LDC workers more, also wage bids, interviews, shortlists | NBER w18720 abstract | Corrected: abstract says LDC contractors are disadvantaged; it does not attribute this to rich-country employers | no |
| D7 | Ghani, Kerr & Stanton: 9 pp (32%), 168,060 contracts, 2005–Aug 2010, paying about 14% less; read as lower cost | NBER w18474 PDF | Corrected: no 14% figure; descriptive gap about 7% ($7.80 vs $8.40), regression about 2.4% and not significant; 168,060 is the regression sample | no (the note proposes no price line) |
| D8 | Payoneer 2020: $21 an hour, 7,000 freelancers, 150+ countries, no regional figures | payoneer.com page | Confirmed | no |
| D9 | BCRA "A" 8330 (18 Sep 2025): keep dollars, no annual cap, bring in within 20 business days | Blog del Contador (the note's source); one search | Confirmed at the secondary source (the cap it removed was USD 36,000 a year, not the 2022 $12,000; regulation text not read) | no |
| D10 | Designer fixture (Argentina, US, Spain): fitsNow list as given, stage 0, Argentina and US pointers, Spain null; `notes` match category / product at `smallBets.ts` line 358 | Ran match_small_bets; read source lines 310, 358 | Confirmed | no |

### Totals (Batch 3)

- Checked: 27
- Confirmed: 23
- Corrected: 3 (N8, D6, D7)
- Unverified: 1 (D4, document requirements only)
- Fabricated: 0
- Corrections that change an implication: 0. D4 (unverified) may: drop "with proof of registration" from the proposed `freelance-platform` Argentina note until Malt's step page is read.

Not checked: the SOR/2013-221 RIAS (L source 5) and CRTC bulletins 2012-548/549 (L sources 6–7); the Portuguese Lei 126/2015 excerpt and the NANP Ohio page (N sources 11, 13); the CFN position note and press on Res. 856's status (lead #154); the Toptal WorldFirst page and BCRA 2022 page (D sources 8, 15).

## Orchestrator spot-checks (2026-10-28)

curl was refused (proxy 403) for laws-lois, support.google.com and upwork.com, so these went through WebFetch: fetch summaries, not full reads.

| Note | Claim | Source | Verdict | Changes an implication? |
|---|---|---|---|---|
| practitioner-directories-and-coverage | Google Business Profile needs in-person contact during stated hours; online-only businesses are ineligible | support.google.com/business/answer/13763036 | confirmed (both sentences quoted) | no |
| freelance-platforms-first-clients | Upwork conversion fee is 13.5% × hourly rate × 2,080 hours; work stays on Upwork for two years | support.upwork.com/hc/en-us/articles/360043723533 | confirmed ("first two years"; the page doesn't say "24 months") | no |
| spain-cold-email-law | LSSI art. 21.1 text | aepd.es/documento/ai-00388-2022.pdf (quotes art. 21.1) | confirmed text; this decision's recipient was an individual, so it doesn't bear on the B2B claim | no |
| brazil-code-status-and-portugal | Res. 858/2026 postponed Res. 856/2026 to 23 Jan 2027 | nutritotal.com.br (code page), cfn.org.br code page, legisweb (access denied), one search | unverified: no page I reached mentions Res. 858 or a postponement; nutritotal gives only "90 days after publication". Rests on one mirror of the DOU seen by #154 | yes: the Brazil section must name both codes and give only the rules common to both as certain |

Spot-checks: 4; confirmed 3; unverified 1.

## Round totals

Batches 1–3 and spot-checks: 82 claims checked; 64 confirmed; 16 corrected; 2 unverified; 0 fabricated. Corrections that changed an implication: 2 (Sun Life opened direct billing only, not its directory, to dietitians; Malt's fee is 12%/6% for sole traders without VAT registration). One unverified claim also matters (Res. 858, above).
