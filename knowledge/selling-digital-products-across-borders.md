---
title: Selling digital products across borders from Quebec
summary: Sales tax and VAT for a Quebec sole proprietor or small corporation selling SaaS, a hosted developer service or in-app upgrades to Canada, the US, the EU, Turkey, Armenia and Argentina; when to register for GST/QST, US economic nexus, EU non-Union OSS, foreign digital VAT, app stores and merchants of record (Paddle, Lemon Squeezy, FastSpring, Stripe Tax, Stripe Managed Payments), country pricing under inflation, and income tax in brief.
tags: sales tax, vat, gst, hst, qst, small supplier, input tax credit, zero-rated, place of supply, pst, economic nexus, wayfair, marketplace facilitator, saas taxability, one stop shop, oss, non-union scheme, reverse charge, turkey vat, digital service tax, argentina iva, rg 4240, percepcion, armenia vat, merchant of record, paddle, lemon squeezy, fastspring, stripe tax, managed payments, app store tax, google play tax, price tiers, purchasing power parity, ppp pricing, inflation pricing, t2125, tp-80, sole proprietor, incorporation, quebec, canada, cross-border
---

_In short:_ Sales tax follows the customer, not you. A Quebec seller usually registers for GST/QST first, then lets app stores or a merchant of record cover other countries. Check with an accountant before relying on this.

This playbook is for a founder in Quebec selling SaaS subscriptions, a hosted developer service, in-app premium tiers or freemium upgrades to people in Canada, the US, the EU, Turkey, Armenia and Argentina. It covers indirect taxes (taxes added to the price and paid by the buyer: GST, QST, sales tax, VAT), who collects them, what each country expects, and pricing by country. Income tax gets a short section with links. Marketing law in the same markets (French first, all-in prices, cancellation) is in **marketing-law-by-market**; how to set the price itself is in **pricing**.

Every number below carries its source and date. Sources and access levels are in research/selling-digital-products-across-borders.md. Revenu Québec's site refused automated reading, so the QST points rest on search snippets and on the matching CRA rules.

## The decision in one page

_In short:_ Selling only through app stores or a merchant of record removes most foreign registrations. Selling direct with Stripe means you register yourself, country by country. Income tax stays yours either way.

- A **merchant of record** (MoR) is the company that legally sells to the customer. It charges the customer, collects and pays the sales tax, handles refunds and chargebacks (disputed card payments), then pays you. Apple, Google, Paddle, Lemon Squeezy, FastSpring and Stripe Managed Payments act this way. [first-party; Apple agreement and Google Play help, read 2026-10-06] [vendor; Paddle, Lemon Squeezy, FastSpring, Stripe pages, read 2026-10-06]
- With Stripe alone, **you** are the seller. Stripe Tax calculates tax, but only "where you're registered to collect taxes"; registering and filing stay your job unless you buy Stripe's registration and filing service. [vendor; Stripe Tax pricing, read 2026-10-06]
- Four countries in this list tax a foreign seller's consumer sales from the first sale, with no threshold: the EU, Turkey, Armenia, and (through the buyer's card) Argentina. Canada and the US have thresholds. [first-party; EU OSS, Armenian Tax Code, ARCA, read 2026-10-06] [secondary; Turkish authority guidance via EY 2018]
- A practical default at 0–10 customers: register for GST/QST when Apple or the $30,000 test requires it, sell web subscriptions through an MoR, and revisit at about $100,000 a year of sales into the US or the EU. [judgment; not tested]

## Canada: GST/HST and QST

_In short:_ Register once worldwide sales pass $30,000 over four quarters, earlier if Apple requires it. Once registered, charge tax by the customer's province. Sales to foreigners are usually zero-rated.

> Not tax advice; check with an accountant. Sources: research note items 1–14.

**The small supplier threshold**
- A **small supplier** is a business with $30,000 or less of taxable sales in a calendar quarter and over the last four quarters. It does not have to register for or charge GST/HST and QST. [first-party; CRA, updated 2026-06-16; Revenu Québec, snippet-only]
- **What counts:** revenue before expenses from your **worldwide** taxable sales, including **zero-rated** sales (taxable at 0%, such as most exports), plus sales of your associates (for example, a corporation you control). Not counted: financial services, sales of capital property, goodwill. [first-party; CRA Memorandum 2-2, revised 2026-06-03; Revenu Québec, snippet-only]
- **When it bites:** if one quarter alone passes $30,000, you charge tax on the very sale that crosses the line. If the four-quarter total passes $30,000, you stop being a small supplier at the end of the following month and have 29 days to register. [first-party; CRA Memorandum 2-2, 2026-06-03]
- Our reading: app-store payouts and sales made through a foreign MoR are probably zero-rated exports, so they still count toward the $30,000. [judgment; confirm with an accountant]

**Voluntary registration and input tax credits**
- You may register below the threshold. Registration lets you claim **input tax credits** (ITCs, a refund of the GST/HST you paid on business purchases) and, for QST, **input tax refunds** (ITRs). [first-party; CRA RC4022 Rev. 25; Revenu Québec, snippet-only]
- A voluntary registrant must stay registered at least one year. Annual filing is allowed up to $1,500,000 of taxable revenue. [first-party; CRA RC4022 Rev. 25]
- Registering early makes sense when most sales are zero-rated exports: you charge little or no tax but recover the tax on your hosting, tools and equipment. [judgment]

**Charging customers once registered**
- For digital services and software, the province is the customer's address, if you get it in the normal course of business. [first-party; CRA place-of-supply page, updated 2026-07-15]
- Rates as of 1 April 2025: Quebec 5% GST + 9.975% QST; Ontario 13% HST; Nova Scotia 14%; New Brunswick, Newfoundland and Labrador, PEI 15%; Alberta, BC, Manitoba, Saskatchewan and the territories 5% GST. [first-party; CRA rates page, 2025-04-01]
- Canadian businesses pay HST too; there is no domestic reverse charge (a rule where the business buyer pays the tax itself). [judgment; general GST rule, not read at source]
- **Customers outside Canada:** a service or software licence supplied to a non-resident who is not GST-registered, and not in Canada when served, is generally zero-rated. Keep evidence of where they live (billing address, card country, self-declaration). [first-party; CRA Memorandum 4-5-3, December 2023]
- **Other provincial sales taxes:** BC requires out-of-province software sellers to register for its 7% PST once BC revenue passes $10,000 a year (since 1 April 2021). [first-party; gov.bc.ca, snippet-only] Saskatchewan (no minimum) and Manitoba (from 1 January 2026, $30,000) have their own rules for software and cloud services. [practitioner; CPA and law-firm summaries, snippet-only] An MoR or app store usually covers these.

## United States: sales tax

_In short:_ No US-wide sales tax exists. Each state sets its own threshold, mostly $100,000 a year, and decides whether SaaS is taxable. App stores and marketplaces collect for you by law.

> Not tax advice; check with an accountant. Sources: research note items 15–23.

- **Economic nexus** means a state can make you collect its sales tax because you sell enough there, even with no office or staff there. The Supreme Court allowed this in *South Dakota v. Wayfair* (21 June 2018); South Dakota's test was $100,000 of sales or 200 transactions a year. [first-party; Wayfair, 585 U.S. 162 (2018)]
- Thresholds differ: Washington $100,000 (current or prior year); Texas $500,000 (preceding 12 months, collect from the fourth month after); California $500,000; New York more than $500,000 **and** more than 100 sales over four quarters. [first-party; WA DOR (snippet-only), Texas Comptroller, CDTFA (snippet-only), NY DTF updated 2026-07-29]
- **Is SaaS taxable?** It depends on the state. Texas taxes 80% of a SaaS charge as a data processing service. Washington taxes remote access software (SaaS) with no business-use exemption. New York taxes remotely accessed prewritten software. [first-party; Texas Pub. 96-259, January 2026; WA DOR, rules from 2025-10-01; NY DTF, snippet-only] Stripe counts 25 states that tax SaaS and 7 more when software is downloaded. [vendor; Stripe guide, updated 2025-11-24]
- **Marketplace facilitator** laws (rules making the platform collect tax for its sellers) exist in every state with a sales tax. This is why Apple and Google collect US sales tax for you. [vendor; Stripe docs, read 2026-10-06] [first-party; Apple agreement Exhibit B lists the United States]
- **What this means at 0–10 customers:** a foreign SaaS selling a few thousand dollars a year in the US is far below every threshold listed above. Watch your largest states once US sales approach $100,000 a year, or use an MoR from the start. [judgment]
- If you sell through Apple's US storefront, file IRS Form W-8BEN with Apple (a form that states you are not a US taxpayer, so treaty withholding rates can apply). [first-party; Apple agreement Exhibit C §15.1]

## European Union: VAT on digital services

_In short:_ A non-EU seller owes EU VAT from the first sale to an EU consumer, at the customer's country rate. Register once in one EU country through the non-Union OSS and file quarterly in euros.

> Not tax advice; check with an accountant. Sources: research note items 24–27.

- **Non-Union OSS** (One Stop Shop) is the EU's single registration for businesses outside the EU that sell services to consumers in the EU. You pick any one Member State, get an EU-format VAT number, and declare all EU consumer sales there. [first-party; EU OSS "Register" page, read 2026-10-06]
- **No threshold for you.** The EUR 10,000 threshold (since 1 July 2021) only lets a seller established in one EU country keep charging its home VAT on small cross-border sales. A Quebec seller does not qualify. [first-party; EU OSS home page; COM(2022) 701 on Article 59c, snippet-only]
- Returns are quarterly, due by the end of the following month, in euros; a nil return is still filed in a quarter with no sales. Registration starts on the first day of the quarter after you apply. [first-party; EU OSS "Declare and pay" page, read 2026-10-06]
- The scheme covers sales to consumers ("non-taxable persons"). For EU business customers, the usual rule is that the buyer accounts for the VAT (reverse charge); collect and check their VAT number. [first-party; OSS scope] [judgment; B2B rule not read at source]
- **What this means:** one EU consumer subscription makes you liable. Below a few thousand euros a year, quarterly filings in 27 rate tables cost more time than an MoR fee. This is the strongest reason to start with an MoR for consumer products. [judgment]

## Turkey

_In short:_ Foreign sellers of electronic services to Turkish consumers register with the tax authority online and pay 20% VAT monthly, in lira, from the first sale. The digital service tax only hits giant companies.

> Not tax advice; check with an accountant. Sources: research note items 28–31.

- Since 1 January 2018, a non-resident selling electronic services to Turkish individuals who are not VAT-registered must register under the special VAT regime for electronic service providers (at digitalservice.gib.gov.tr) and file VAT Return No. 3 monthly. "There is no threshold for VAT registration." Payment is in Turkish lira at the Central Bank rate. [secondary; authority guidance reported by EY, 2018-01-31; portal not readable]
- The general VAT rate is 20% since 10 July 2023 (Presidential Decision 7346). [secondary; PwC, snippet-only]
- The filing deadline was the 24th of the next month in 2018; current snippets say the 28th. Not confirmed at a primary source. [snippet-only]
- **Business customers:** the Turkish business pays the VAT itself (reverse charge); you do not register for those sales. [secondary; EY 2018]
- **Digital service tax** (DST, a tax on gross revenue from digital ads, online content and platforms): 5% from 1 January 2026 and 2.5% from 1 January 2027. It applies only above TRY 20 million of Turkish revenue **and** EUR 750 million of global revenue, so not to a small seller. [secondary; EY on Presidential Decision 10767, Official Gazette 2025-12-25]
- Apple, Google, Paddle, Stripe Managed Payments and Stripe Tax (calculation only) all cover Turkey. [first-party; Apple Exhibit B, Google Play help] [vendor; Paddle, Stripe docs, read 2026-10-06]

## Argentina

_In short:_ Argentina has no registration for foreign sellers. The buyer's card issuer adds 21% VAT and a 30% income-tax prepayment. Expect Argentine buyers to pay about half again over your price.

> Not tax advice; check with an accountant. Sources: research note items 32–40.

- All digital services used in Argentina and supplied from abroad are subject to IVA (Argentine VAT). Use in Argentina is presumed from the buyer's IP address, SIM card, billing address or payment method. [first-party; ARCA "Servicios digitales", read 2026-10-06] The rate is the general 21%. [practitioner; snippet-only]
- The tax is collected by **perception** (an amount taken in advance by a third party at payment time): local card issuers and payment intermediaries collect it on the card statement date. Without a local intermediary, the buyer pays it by month-end. No registration route for the foreign seller is described. [first-party; ARCA RG 4240 page; RG 4240/2018 text]
- ARCA lists foreign digital providers in two annexes that decide when the card perception applies. How a small seller missing from both lists is treated at the card was not confirmed. [first-party; RG 4240/2018; list mechanics unconfirmed]
- On top, a **30% perception** on account of income tax applies to card payments for services from non-residents (RG 5617, Official Gazette 2024-12-19). It survived the end of the PAIS tax (22 December 2024) and the April 2025 removal of the perception on buying dollars for savings. Buyers who owe no income tax can ask for it back. [first-party; RG 5617 text; argentina.gob.ar, 2024-12 and 2025-04-14]
- **Coverage gap:** Apple's tax list does not include Argentina; Google's tax page does not list it; Stripe Tax and Stripe Managed Payments do not list it. Paddle accepts Argentine buyers and charges in ARS. Whether any of them collects anything there was not checked. [first-party; Apple Exhibit B, Google Play help] [vendor; Stripe, Paddle docs, read 2026-10-06]
- **What this means:** your price in dollars plus 21% plus 30% is what an Argentine card buyer sees, before any bank exchange margin. Price for that. [judgment; arithmetic on the rates above]

## Armenia

_In short:_ Armenia charges 20% VAT on foreign electronic services sold to individuals, with no threshold. A foreign company registers online and files quarterly. App stores and Stripe Managed Payments cover it.

> Not tax advice; check with an accountant. Sources: research note items 41–44.

- An electronic service sold to an Armenian individual is taxed in Armenia when the buyer's residence, bank, IP address or phone country code points there. [first-party; Tax Code art. 39(2.1), read 2026-10-06]
- A non-resident organisation with no permanent establishment (no fixed place of business in Armenia) that sells electronic services to individuals must register with the tax authority and pay the VAT itself. The VAT threshold "shall not be considered". Reports and payment are due by the 20th day of the month after each quarter. The rate is 20%. [first-party; Tax Code arts. 288(9.1), 70(2), 63, read 2026-10-06] PwC confirms 20% and quarterly filing for sales to individuals. [secondary; PwC, reviewed 2026-06-30]
- Business customers registered for VAT account for it as tax agents; you register nothing for those sales. [first-party; Tax Code art. 70(2)]
- The registration portal moves from petekamutner.am to src.am on 1 January 2027 (Government Decision 1192-N, published 2026-08-13). [practitioner; snippet-only]
- The Code speaks of a non-resident **organisation**. Whether a foreign sole proprietor registers the same way is an open question. [first-party; our reading]
- Apple, Google, Paddle, Stripe Managed Payments and Stripe Tax (calculation only) cover Armenia. [first-party; Apple Exhibit B, Google Play help] [vendor; Paddle, Stripe docs, read 2026-10-06]

## App stores as merchant of record

_In short:_ Apple and Google collect and pay sales tax in most countries, but not in Argentina. Apple makes Canadian and Quebec developers register for GST and QST. Income tax always stays yours.

- **Apple** collects and remits tax for end users in a listed set of regions that includes Armenia, Canada, every EU country, Türkiye and the United States. Argentina is not on the list; there Apple says you are "solely responsible" for taxes. [first-party; Apple Developer Program License Agreement, Schedule 2 Exhibit B, downloaded 2026-10-06]
- **Apple and Canadian developers:** "If You are a resident of Canada, You must add ... Your Canadian GST/HST number. If You are a resident of Quebec, You must also add ... Your Quebec QST number." Registration is a condition of the paid-apps schedule. You elect (Forms GST506 and FP2506-V) to let Apple Canada collect and remit the tax on your Canadian sales, and Apple charges GST/HST and QST on its commission. [first-party; Apple agreement Exhibit C §3, downloaded 2026-10-06]
- **Google Play** collects Canadian GST/HST unless a Canadian developer gives its GST/HST number. A Quebec developer who gives its QST number becomes responsible for QST on Quebec customers. Google covers all US states, the EU, Türkiye and Armenia. Argentina is not listed. [first-party; Google Play Console help 138000, read 2026-10-06]
- **Still your job with any store:** choosing the right tax category for your app (Apple says you are "solely responsible" if it is wrong); income tax on what the store pays you; withholding taxes some countries take from payouts (treaty rates need paperwork); GST/QST registration where Apple requires it. [first-party; Apple agreement Schedule 2 §3.2, Exhibit C §15.3]
- Store tax handling covers in-app purchases only. A web checkout for the same subscription is a separate sale with its own tax duties. [judgment]

## Merchant of record or Stripe plus Stripe Tax

_In short:_ A merchant of record costs about 5% plus 50 cents per sale and handles foreign tax for you. Stripe costs less per sale but leaves registration and filing to you. Check Argentina and Turkey coverage.

Fees as published, read 2026-10-06 [vendor; each provider's pricing page]:

| Option | Published fee | Who is the seller | Tax handled |
|---|---|---|---|
| Paddle | 5% + 50¢ per transaction | Paddle | Global tax, chargebacks, buyer support included |
| Lemon Squeezy | 5% + 50¢; +1.5% non-US, +1.5% PayPal, +0.5% subscriptions; 1% per payout to non-US banks | Lemon Squeezy | Global tax included |
| FastSpring | Not published; quoted by sales | FastSpring | Tax collection and remittance, audit response |
| Stripe Managed Payments | +3.5% on top of Stripe card fees | Stripe | Registers, files, remits in 80+ listed countries; not Argentina |
| Stripe + Stripe Tax | Cards 2.9% + CA$0.30 (+0.8% international, +2% conversion); Billing 0.7%; Tax 0.5% where registered | You | Calculation only; you register and file (or pay for Tax Complete, from CA$120/month) |

- **Small prices make the fixed part heavy.** On a $5 sale, 5% + 50¢ is 75¢, or 15%. Run your own price through unit_economics before choosing. [judgment; arithmetic on published rates]
- **Payment methods in Turkey, Armenia and Argentina** (per each vendor's docs, read 2026-10-06): Paddle accepts buyers from all three and charges in ARS (minimum 780.00), but TRY and AMD are not supported currencies, and Apple Pay and Google Pay are not offered in Turkey. Lemon Squeezy accepts buyers from all countries except 17 restricted ones. Stripe Managed Payments accepts customers in 195+ countries except a restricted list (China, Cuba, Iran, North Korea, Russia, Syria and others). No local Turkish, Armenian or Argentine payment method was listed by any of them; cards and PayPal carry these markets. [vendor]
- **Stripe and Quebec:** Stripe Billing's monthly plans "aren't yet offered to Quebec-based customers"; pay-as-you-go Billing (0.7%) is. [vendor; Stripe Billing pricing, read 2026-10-06]
- **Stripe Tax coverage:** Canada fully; Armenia and Türkiye for digital products as customer countries; Argentina not listed. [vendor; Stripe Tax supported countries, read 2026-10-06]
- **Hosted developer services** (hosting, compute, APIs) can fall in a different tax category from SaaS. Stripe Managed Payments accepts infrastructure, platform and software services, but not professional services or anything with human work in it. [vendor; Stripe Managed Payments eligibility] Which US states tax infrastructure services was not checked.

## Pricing by country

_In short:_ Use the App Store's per-storefront prices and set local prices by hand where incomes are lower. Review Turkish and Argentine prices every few months; Apple does not adjust subscription prices for inflation.

- **Purchasing power parity** (PPP) is an exchange rate that makes the same basket of goods cost the same in two countries. It was built for comparing economies, not for pricing one product. [first-party; World Bank ICP definition, snippet-only]
- **No study was found** that tests PPP discounts for small software sellers. Vendor stories of higher conversion after country discounts are self-selected. Treat a discount as an experiment: one country, a set period, compare paid conversions per visitor. [research gap; OpenAlex search 2026-10-06] See **experimentation** for small-sample limits.
- **App Store price tiers:** 900 price points from $0.29 to $10,000 (from 6 December 2022). You pick a base storefront; Apple generates equalized prices for the other 174 storefronts and 44 currencies using exchange rates, not PPP. You can override any storefront by hand. [first-party; Apple Developer News, 2022-12-06]
- Apple updates non-base storefronts for tax and exchange-rate changes (Türkiye, Poland and Switzerland on 17 November 2025), but **auto-renewable subscriptions are excluded**. A subscription priced in lira keeps that lira price until you change it. [first-party; Apple Developer News, 2025-10-30]
- **Inflation:** Turkey's annual consumer inflation was 29.73% in September 2026 [first-party; TÜİK release via news, snippet-only]; Argentina's was 1.7% for August 2026 alone and 21.3% for the year to date (33.5% year on year, snippet-only). [first-party; INDEC, August 2026]
- **What this means:** in Turkey and Argentina, either price in US dollars (Paddle has no TRY) or put a local-currency price review in your calendar every quarter. Remember Argentine card buyers also pay 21% IVA and a 30% perception on top. [judgment]
- Price-display and cancellation rules per market are in **marketing-law-by-market**; how to pick price points in **pricing**.

## Income tax basics

_In short:_ Report all business income from the first dollar, on T2125 federally and TP-80 in Quebec. Incorporating can lower the tax rate on profits you leave in the company. Decide with an accountant.

> Sources: research note items 8–12, 45. The Canadian caution above applies here too.

- A Canadian resident reports worldwide income from all sources; no minimum amount is given. [first-party; CRA platform-economy page, updated 2025-01-31]
- A **sole proprietor** (you and the business are one person for tax) reports business income and expenses on federal Form T2125 and Quebec Form TP-80-V with the personal returns. [first-party; CRA T2125 page, updated 2026-08-31; Revenu Québec, snippet-only]
- A **corporation** files its own returns. A Canadian-controlled private corporation (CCPC) pays a federal rate of 9% on income eligible for the small business deduction (business limit usually $500,000) and 15% otherwise. [first-party; CRA corporation tax rates] Quebec's own small-business reduction depends on employee paid hours; for years starting after 29 April 2026 the minimum Quebec rate on eligible income falls from 3.2% to 2.2%. [first-party; Revenu Québec tax news 2026-05-04, snippet-only]
- The lower corporate rate helps on profit left in the company; money you pay yourself is taxed again personally. Costs include separate books, returns and legal fees. [judgment]
- An MoR or app store pays you **revenue**; it never files your income tax. US and other withholding on store payouts may be credited against Canadian tax with the right forms. [first-party; Apple agreement Exhibit C]

## What usually works by stage

_In short:_ Before launch, pick how you will sell and check Apple's GST/QST rule. Register for GST/QST by $30,000. Review US states and EU volume as sales grow.

**Before the first sale**
1. Decide the sales channel per product: app store for in-app tiers; an MoR or Stripe for web subscriptions.
2. If you sell paid apps or in-app purchases on the App Store as a Canadian resident, register for GST/HST (and QST in Quebec) and file Apple's election forms. [first-party; Apple agreement]
3. Keep a spreadsheet of sales per quarter, worldwide, including store payouts, to watch the $30,000 line. [first-party; CRA Memorandum 2-2]
4. Set up a business bank account and keep receipts for every business purchase. [judgment]

**First paying customers (0–10)**
1. Web sales: start with an MoR (Paddle, Lemon Squeezy or Stripe Managed Payments) unless your customers are mostly Canadian businesses. One EU or Turkish consumer otherwise creates a filing duty. [judgment]
2. Collect and store each customer's country and address at checkout; you need it for province and country rules. [first-party; CRA place-of-supply page]
3. Register for GST/QST voluntarily if you have meaningful tax on purchases to recover. [judgment]

**Toward $30,000 a year**
1. Register for GST/HST and QST before you cross $30,000 in a quarter or over four quarters. Charge by province on direct Canadian sales. [first-party; CRA]
2. If you sell direct with Stripe to BC, check BC PST registration at $10,000 of BC revenue. [first-party; gov.bc.ca, snippet-only]

**Growing (about $100,000 a year in one market)**
1. Turn on Stripe Tax monitoring or ask your MoR for state totals; plan US registrations as states near $100,000. [vendor; Stripe docs]
2. Compare MoR fees with Stripe plus your own OSS, Turkish and Armenian filings, using real volumes in unit_economics. [judgment]
3. Ask an accountant about incorporating and about the Quebec small business deduction. [judgment]

## Common mistakes and folklore

_In short:_ Most mistakes come from assuming one rule covers all countries. Thresholds differ, app stores differ, and a merchant of record never removes income tax. Check each market separately.

- **"I'm under $30,000, so I can ignore tax."** Apple requires Canadian residents selling paid apps to register anyway, and the $30,000 counts worldwide and zero-rated sales. [first-party; Apple agreement; CRA]
- **"Foreign sales don't count."** They do count toward $30,000, even though they are usually zero-rated. [first-party; CRA Memorandum 2-2; Revenu Québec, snippet-only]
- **"EU sales are free under EUR 10,000."** Only for EU-based sellers. A Quebec seller owes EU VAT from the first consumer sale. [first-party; EU OSS]
- **"SaaS isn't taxed in the US."** Texas, Washington and New York tax it, among others. [first-party; state revenue departments]
- **"The MoR handles all my taxes."** It handles sales tax in the countries it covers. Income tax is yours, and Argentina is missing from Apple's and Stripe's tax lists. [first-party; Apple agreement] [vendor; Stripe docs]
- **Giving Google a QST number without planning to file QST.** It moves Quebec QST from Google to you. [first-party; Google Play help]
- **Setting a lira subscription price once.** Apple does not adjust auto-renewable subscriptions; at about 30% inflation, the real price falls fast. [first-party; Apple Developer News 2025-10-30; TÜİK, snippet-only]
- **Copying a competitor's PPP table as proven.** No study supports a standard discount; test one market at a time. [research gap]
- **Picking the wrong app tax category.** Apple holds payouts and charges penalties back to you. [first-party; Apple agreement Schedule 2 §3.2]

## Sources

research/selling-digital-products-across-borders.md (CRA GST/HST pages and Memoranda 2-2 and 4-5-3, RC4022, place-of-supply and rates pages, T2125 and corporation rates; Revenu Québec small suppliers, TP-80-V and 2026 small business deduction news, snippet-only; BC, Saskatchewan and Manitoba sales taxes; South Dakota v. Wayfair; Texas, New York, Washington and California revenue departments; Stripe US tax and SaaS guides; EU VAT One Stop Shop pages and COM(2022) 701; Turkish e-service VAT guidance, VAT rate and DST decisions; ARCA RG 4240 and RG 5617 and related notices, INDEC CPI; Armenian Tax Code, PwC and EY summaries; Apple Developer Program License Agreement and Apple pricing news; Google Play tax help; Paddle, Lemon Squeezy, FastSpring and Stripe pricing and docs; World Bank ICP; TÜİK CPI). Read 2026-10-06 unless the note marks an item snippet-only. Consumer-law rules for the same markets: research/marketing-law-canada-us.md and research/marketing-law-turkey-armenia-argentina.md.
