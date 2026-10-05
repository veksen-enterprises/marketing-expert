---
title: Selling to local merchants (B2B2C for cafés, restaurants, salons and shops)
summary: Playbook for a product that independent local businesses must adopt before their customers get value (B2B2C); field sales and door-to-door, point-of-sale app stores (Square App Marketplace, Toast Partner Connect, Clover App Market, Lightspeed) with their gates and fees, integrations, trade associations, trials versus commission-only, what merchants pay for ordering and delivery apps and city fee caps (New York, San Francisco), launching one neighbourhood at a time, the rules against listing merchants without consent (FTC Grubhub order, California and NYC laws, Google Maps terms, trademark), consumer discovery through Apple Maps, Google ordering links, App Clips and in-store QR codes, competing with Google, POS vendors' own apps and delivery aggregators, and what works by stage.
tags: b2b2c, local merchants, independent restaurants, cafe, coffee shop, salon, retail shop, merchant acquisition, merchant onboarding, field sales, door to door, walk-in sales, point of sale, pos, pos integration, square app marketplace, toast partner connect, toast integration, clover app market, lightspeed restaurant api, app partner, delivery commission, commission cap, fee cap, nyc delivery app law, dcwp, san francisco fee cap, doordash fees, uber eats fees, order ahead, pickup ordering, online ordering, unaffiliated listings, listing without consent, grubhub ftc, fair food delivery act, places api terms, nominative fair use, trade association, restaurant association, allied member, table tent, qr code, app clip, apple business actions, order with google, toast local, square go
---

Use this playbook when your product needs local businesses (cafés, restaurants, salons, shops) to sign up before their customers get anything from it. This is **B2B2C** (business-to-business-to-consumer): you sell to the merchant, and the merchant's customers use the product. The running problem is a two-sided **cold start** (each side waits for the other). General marketplace mechanics (atomic network, which side first, take rate, leakage, multi-homing) are in **marketplaces**; see that playbook instead of repeating them here. Google Business Profile and local ranking are in **local-seo**. Selling technique (discovery calls, pilots) is in **founder-led-sales**.

Evidence note: the strongest sources here are first-party (platform fee pages, developer docs, city and state laws, company filings) and one FTC case. Research on small merchants and platforms exists mainly for food delivery. No public source gives the cost or conversion rate of door-to-door sales for a startup, the minimum density of merchants for a local app, or whether point-of-sale app-store listings bring installs.

## The integration is the entry ticket

_In short:_ Merchants will not run a second system next to their till. Plan to connect with their point-of-sale system from the start, because products that skip it cause wrong orders and blame on the merchant.

- **Point of sale (POS)** means the till system where the merchant rings up orders and takes payment (Square, Toast, Clover, Lightspeed). A product that adds orders, queue times or loyalty must read from it or write to it, or staff must re-enter everything by hand.
- Toast itself started in 2011 as a consumer app for paying at restaurants. Its founders wrote that the first attempt "failed miserably" because "It was too difficult to integrate with legacy systems", and that they then "went door-to-door, listening to restaurant operators". [first-party; company filing (Toast S-1, 2021)]
- The FTC's case against Grubhub describes what happens without integration: restaurants listed without their agreement got orders for items they did not serve, drivers' payment cards sometimes declined, and customers blamed the restaurant for late food. [first-party; regulator; settlement, no admission]
- Google shows an ordering partner on Maps only with a "direct contractual relationship" with each merchant and a link to that merchant's orderable menu. [first-party]
- Practical rule: list which POS systems your first 20 target merchants use before you build. Build for the one most of them use. If they use three, start in a neighbourhood where one dominates. [practitioner]

## Point-of-sale app stores: gates, fees and timelines

_In short:_ Each point-of-sale vendor runs its own app store with its own approval. Square is open to any developer; Toast and Lightspeed choose partners and test you on live restaurants; Clover keeps 30%.

| Store | Who can list | Review | Money |
|---|---|---|---|
| Square App Marketplace | Any developer who follows the terms | Technical and content review; following the listing guide makes "quick approval" more likely | No publishing fee stated; referral revenue share and "profit share" for selected partners |
| Toast (Partner Connect / integrations) | By application; Toast "is not able to integrate with all interested integration partners" | Compliance, privacy, security and legal approval; signed agreement; one-hour certification demo; alpha on one restaurant (~1 week); beta on 3–5 locations over several weeks | Not published |
| Clover App Market | Approved developer accounts | Account approval first, then app review ("free of bugs, and add value for merchants") with a functional video and a data-permissions review | Developer gets 70% of what Clover collects; subscriptions, metered billing, 30-day trials; all payments must run through Fiserv or Clover |
| Lightspeed Restaurant | Partners and pre-selected developers only, with explicit approval | Working demonstration of every feature before production access | Not published |

[first-party, all rows; read 2026-10-05]

- **What this means for timing.** Toast and Lightspeed choose whether to work with you at all. Budget months, not weeks, and expect to show merchant demand before they say yes. Square is the realistic first store for a small team. [first-party; practitioner]
- **Clover's payment rule matters for ordering products.** If your app takes consumer payments, Clover requires them to run through Fiserv or Clover, which changes your margin. [first-party]
- **Square's listing rules are a good brief for any merchant-facing copy**: the store is a public page, so write for non-technical owners, explain words like "API" or "plug-in", say who the app is not for, keep the price in the store the same as on your pricing page, and give a free trial a number of days. Square prompts merchants who have not left a review to do so 30 days after they connect. [first-party]
- **A listing is credibility and a smoother install, not a lead source.** No POS vendor publishes where installs come from. The same pattern holds in software stores; see **marketplace-and-registry-listings**. [first-party; practitioner]
- **POS vendors are also competitors.** Each can build what you build (see "Competing" below). Read **platform-and-feature-risk** before you depend on one store.

## Field sales and walking in

_In short:_ Selling in person to local merchants is normal, even at companies built for self-service. No public data gives cost or conversion for a startup, so measure your own visits from day one.

- **Field sales** means salespeople who visit merchants in person. Toast built its growth on "in-market sales teams that are closely aligned with their local restaurant community". About two-thirds of its new locations in the year to June 2021 still came inbound (through organic, paid, field and referral channels). [first-party; company filing]
- Toast counts the losses on hardware and installation as part of **CAC** (customer acquisition cost: what you spend to win one customer). Its **CAC payback** (months for a customer's profit to repay that cost) was "typically around 18 months", near 30 months in early 2020 and under 15 months from late 2020. That is a large company with payments revenue; a startup with only a subscription will usually recover cost more slowly. [first-party; company filing]
- Square, known for self-serve sign-up, began hiring a field sales team in late 2024 "to focus exclusively on in-person seller outreach" for larger sellers, and had about 150 field reps by the end of 2025. [first-party; company filing]
- In marketplace operator interviews, direct sales was the most common early supply lever; see **marketplaces**. [practitioner; small sample of successes]
- **How to run it as a founder** [practitioner]:
  - Visit in the quiet hours (cafés mid-afternoon, restaurants between lunch and dinner). Never at the rush.
  - Bring proof from the street they know: a merchant two doors down who uses it, or the number of local customers who asked for them in your app.
  - Ask for one small next step: a 2-week trial at one till, or a table tent on the counter. Not a contract.
  - Log every visit (date, who you spoke to, objection, next step) in a spreadsheet. After 50 visits you have your own conversion rate; nobody publishes one.
- Put the result into unit_economics: cost per signed merchant (your hours plus travel) against monthly profit per merchant and expected merchant **churn** (merchants lost per month). Restaurants close often: one study of 1996–1999 data found 26% of independent restaurants failed in year one and 61% within three years. [research; one US dataset; old]

## Trade associations and local business groups

_In short:_ Restaurant associations and local business groups sell supplier memberships with member lists, newsletters and events. They give credibility and introductions; no data shows how many merchants they convert.

- State restaurant associations sell supplier ("allied") memberships in tiers. Examples: Wisconsin's include a quarterly list of restaurant members, staff referrals and, at higher tiers, email blasts to 2,100+ restaurant members. Oregon's include a vendor directory listing, event access and a separate "endorsed relationship" for companies that meet criteria. Prices are given by phone. [first-party]
- Associations take political positions on delivery apps. San Francisco's restaurant association pushed for the permanent 15% delivery cap. If your product cuts merchants' fees, say so in their language; that is the argument they already make. [first-party; trade association]
- Business improvement districts, chambers of commerce and street merchant groups do the same at neighbourhood scale. One talk at a monthly merchants' meeting reaches the exact block you are trying to fill. [practitioner]
- Start with one membership in the city you launch in, track every merchant it introduces, and drop it if it brings none in a quarter. [practitioner]

## Free trial, subscription or commission

_In short:_ Merchants compare you with what delivery apps and their own till already charge. Delivery apps start at 0% and promise refunds in slow months, so merchants expect to pay only when it works.

What merchants already see (US, read 2026-10-05) [first-party]:

| Channel | What the merchant pays |
|---|---|
| DoorDash marketplace | 15%, 25% or 30% on delivery; 6% on pickup; 0% for the first 7–30 days; Premier refunds commission in months under 20 orders |
| Uber Eats marketplace | 20%, 25% or 30%; 7% on pickup; Premium charges 0% in months under 20 orders during the first 6 months |
| DoorDash and Uber Eats own-website ordering | Payment processing only (DoorDash), or 2.5% + $0.29 per order (Uber Eats Webshop) |
| Toast Local (consumer app) | No commission; same card fees as Toast online ordering |
| Square Go (booking app, beauty and personal care) | Free for businesses and consumers |

- **So the anchor for pickup and order-ahead is about 0–7% of the order**, not the 15–30% of delivery. A product priced above that needs to show more orders or saved staff time, in numbers. [first-party; practitioner]
- **Commission-only** (a percentage of each order, nothing up front) is easy to say yes to and grows with the merchant, but earns nothing while order volume is low. A **subscription** (fixed monthly fee) is predictable for you but is a cost the merchant must justify each month. A **free trial** (time-limited, then paid) works when the merchant can see results within the trial period. [practitioner]
- Delivery apps' "0% for 30 days" and "no fee in slow months" offers show what merchants resist: paying before results. No controlled study compares these models for local merchants. [first-party; evidence thin]
- Small merchants' experience with promotional platforms is mixed: in a survey of 324 businesses that ran daily deals, 55.5% made money, 26.6% lost money, and few deal users came back at full price. Expect sceptical owners who have been burned before. [research; self-reported survey; 2009–2011]
- Price testing and plan design: see **pricing**.

## Fee-cap laws and what they mean for you

_In short:_ New York City and San Francisco cap what delivery apps charge restaurants, and New York's law also covers pickup apps. Research found such caps hurt the independent restaurants they were meant to protect.

- **New York City.** A licence is required for any app that "offers or arranges for the sale and same-day delivery or pickup" of restaurant food. Caps per order: 15% delivery, 5% basic service (receiving orders and being "listed and searchable"), 20% optional enhanced service (only if a 5% basic option is also offered), 3% payment processing. Apps must share customer data (name, phone, email, address, order) with restaurants on request unless the customer opts out. An order-ahead app in New York is inside this law. [first-party; regulator]
- **San Francisco** made a 15% delivery commission cap permanent in June 2021, with up to 3% card pass-through and separate contracts allowed for marketing. [trade association; ordinance text not read]
- **Caps can backfire.** A study of 2020 emergency caps in 14 US cities and states (123,134 restaurants) found independents in capped cities lost 2.5% of takeout orders and 3.9% of net sales, while uncapped chains gained 4.5%. Platforms raised consumer delivery fees and promoted restaurants elsewhere. [research; quasi-experiment; short-run; pandemic period]
- What to do: check the city's rules before you launch there, price under the cap if one applies to you, and don't build your pitch only on "we're cheaper than the cap". [practitioner]

## Cold start one neighbourhood at a time

_In short:_ Launch where a consumer can find several useful merchants within a short walk. Give merchants something useful on day one, and use real consumer requests to bring the next merchants in.

- The general method (one atomic network, supply first, tipping points, liquidity) is in **marketplaces**; this section adds what is specific to walk-in local merchants.
- **Density is walking distance, not city size.** A café-discovery or order-ahead app is useful only if a user finds several good options on their own route. Pick one neighbourhood (an office district, a campus, a high street) and sign merchants there until a typical user has several choices within a few minutes' walk. No study gives the number; set your own target and test it. [practitioner; no research found]
- **Measure it.** Track, per neighbourhood: active merchants, share of user sessions that end in an order or visit, and repeat users per week. Use liquidity_math for match rate and fill rate. Expand only when the first neighbourhood holds without your daily push. [practitioner]
- **Single-player mode** (a tool useful to one side with no other users): give merchants something that works on day one, such as a live queue display on their own screen or a dashboard of their busy hours, before any consumers arrive. [practitioner]
- **Use demand to pull merchants in.** Let consumers request a café that isn't on the app, then walk in with the count ("41 people near you asked for you this month"). This is evidence the owner can check, and it respects the consent rules below. [practitioner]
- **Expect POS concentration to shape the map.** If one neighbourhood's cafés mostly run one POS you already integrate with, start there. [practitioner]

## Listing merchants before they join: the rules

_In short:_ Showing a business's public facts is generally lawful, but taking orders or implying a partnership without consent has cost Grubhub $25 million at the FTC, and California and New York City ban it.

- **The Grubhub case.** The FTC found Grubhub had up to 325,000 "unaffiliated restaurants", more than half its listings. Its December 2024 order requires Grubhub to stop listing them; Grubhub paid $25 million (of a $140 million judgment, partly suspended). [first-party; regulator; settlement, no admission]
- **A trademark class action** under the **Lanham Act** (US federal law against false endorsement and false advertising) over the same practice settled for about $7.2 million in 2025–2026, covering about 387,000 businesses. [press; settlement, no admission]
- **California** (Business and Professions Code §22599): a delivery platform may not arrange delivery from a restaurant "without first obtaining an agreement", and must remove a restaurant's name, address, logo or menu within three business days on request. [legal; statute]
- **New York City**: apps must "Prohibit unauthorized listings … without a written agreement" with the restaurant. This covers pickup apps too. [first-party; regulator]
- **Google Maps Platform terms** forbid copying and saving "business names, addresses, or user reviews", using Google Maps services "in a listings or directory service", and showing Places data on a non-Google map. You may store Google's place ID, and latitude and longitude for up to 30 days. So you cannot seed a merchant directory from Google's data. [first-party]
- **What is generally allowed.** Facts (name, address, opening hours) are not protected by copyright (US Supreme Court, *Feist*, 1991). Using a business's name to identify it is often **nominative fair use** (using a trademark only to name its owner), as long as you use no more than needed and suggest no endorsement. The rule differs between US courts. This is not legal advice. [court record; legal; snippet-only for the fair-use test]
- **Practical line** [practitioner, built on the sources above]:
  - Safe-ish: a "not on the app yet" card with name and address from your own or open data, and a "request this café" button.
  - Risky: logos, menus or photos you didn't get permission for, any "order" or queue-time button, or anything that looks like a partnership.
  - Always: an easy removal route, honoured within days.

## Consumer acquisition for a local app

_In short:_ The merchant's counter is your best ad. Add in-store QR codes and instant ordering, get onto Apple Maps and Google's order buttons through each merchant, and use local search for your pages.

- **In-store prompts.** A table tent or counter sign with a QR code reaches people standing in the queue, the moment the product helps them. Track each merchant's code separately with build_utm_link (one campaign per merchant) so you can show the owner what their counter brought in. No independent study measures QR or table-tent conversion. [practitioner; evidence thin]
- **App Clips (iPhone).** An App Clip is a small part of your app that opens from a code, NFC tag, link or Apple Maps without installing the full app. Apple's own example is a shop where the App Clip offers "only the functionality to order". Android's equivalent, Instant Apps, was shut down in December 2025; use a mobile web page there. [first-party; press for the Android shutdown]
- **Apple Maps.** Apple Business "Actions" add buttons such as Pickup, Waitlist or Menu to a place card. A business adds them itself, or an approved partner adds them through Apple's partner API. Approval can take up to three business days; users need iOS 17.4 or later. [first-party]
- **Google.** Ordering providers that "state they have authorized relationships" with a business appear automatically on its Google profile; the merchant can mark one as preferred for pickup. To be such a provider you join Google's Ordering Redirect programme: contract with each merchant, a merchant-specific menu link, an opt-out within 5 business days, and about 6–8 weeks of integration work. Until then, ask each merchant to add your link to their profile. [first-party]
- **Local search for your own pages**: neighbourhood and merchant pages need real, unique content; see **local-seo** and **seo-content-and-architecture**. App store work is in **consumer-apps**.
- **Merchants' own customers** are the cheapest demand. Give each merchant a short link and a counter sign they can share, and report back to them each month. [practitioner]

## Competing with Google, POS vendors and delivery apps

_In short:_ Google owns discovery, POS vendors now run free consumer apps, and delivery apps own delivery. Win on one narrow job they do badly for independents, and make the merchant's existing setup better.

- **Google Maps** already shows hours, busy times and order buttons. Your data must be something Google does not have (live queue length from the till, a specific menu feature), and Google's terms stop you rebuilding its directory from its data (see above). [first-party]
- **POS vendors' own consumer apps.** Toast Local shows nearby Toast restaurants that opt in, for no commission. Square Go lists Square Appointments beauty businesses automatically, free for both sides. A POS vendor can switch on the whole installed base at once; you cannot. See **competing-with-incumbents**. [first-party]
- **Delivery aggregators** (apps that gather many restaurants in one place) charge 15–30% for delivery and 6–7% for pickup, and offer their own commission-free ordering pages too. [first-party]
- **Where a startup can win** [practitioner]:
  - One category the generalists treat as an afterthought (independent cafés, a single neighbourhood's salons).
  - Working across POS systems, which a POS vendor's own app will not do.
  - Doing more of the setup work for the merchant: menus, photos, staff training.
- **Merchants often use several apps at once.** Delivery platforms add independents' dine-in visits but partly replace their own takeout, so owners keep their own channels and add apps on top. Expect them to use you alongside others, not instead of them. [research; observational; US]

## What usually works by stage

_In short:_ First sign one neighbourhood by walking in, with one POS integration, and check that it holds on its own. Only then apply to the gated POS stores, join associations and add cities.

| Stage | Focus | Usually works | Usually fails |
|---|---|---|---|
| 0–10 merchants | Prove one neighbourhood | Founder walking in at quiet hours; one POS integration (often Square first); free or 0% pilot with a date to start paying; counter signs and QR codes; demand requests from consumers | Building for every POS; listing merchants who haven't agreed; paid consumer ads with nothing nearby |
| 10–50 merchants | Make the neighbourhood hold | Weekly per-neighbourhood numbers; merchant referrals; one association or merchant-group membership; a written price, compared with delivery and pickup fees | Expanding before repeat use; pricing above the 5–7% pickup anchor without proof |
| 50+ merchants, 2+ areas | Repeat the playbook | Applications to Toast, Clover or Lightspeed with merchant demand in hand; Apple and Google ordering integrations; a first field rep with a tracked visit log | Assuming a POS listing brings installs; launching in a capped city without checking the licence rules |

## Common mistakes

_In short:_ Don't skip POS integration, list merchants without consent, scrape Google's business data, price above what pickup already costs, pitch at rush hour, or count signed merchants instead of active ones.

- Building a consumer app first and hoping merchants will integrate later (Toast's own first attempt).
- Listing restaurants with order buttons, logos or menus before they agree.
- Seeding a directory from Google Places data, which the terms forbid.
- Pricing pickup or order-ahead above the 6–7% merchants already pay delivery apps for pickup, with no proof of extra orders.
- Visiting at lunch rush; asking for a contract instead of a small trial.
- Counting signed merchants instead of merchants with weekly orders, and ignoring merchant closures in churn.
- Treating a POS app-store listing as a sales channel rather than a credibility check.

## Folklore

_In short:_ The "list them first, ask later" story, "the app store will sell it for you" and fixed density numbers have no reliable source. Treat them as stories, not plans.

- "DoorDash listed restaurants without asking, so we can too." The founding story (PDF menus, founders delivering) is told in secondary sources only; no primary source says the restaurants did not agree, and the FTC order and California and New York City laws came later. [press; snippet-only]
- "Get into the POS marketplace and merchants will find you." No vendor publishes install sources. [first-party; evidence absent]
- "An association endorsement opens every door." Associations sell supplier memberships; no conversion data was found. [first-party; evidence absent]
- "You need N cafés within M minutes' walk." No study gives a number for order-ahead or queue-time apps; Airbnb's 300-listing figure (in **marketplaces**) is one company's observation in a different market. [practitioner]

## Sources

research/selling-to-local-merchants.md (Square listing guide and partner page; Toast developer guide and S-1; Clover and Lightspeed developer docs; Block 10-K 2025; DoorDash and Uber Eats pricing; NYC DCWP; GGRA; California BPC §22599; FTC Grubhub 2024; Grubhub class action; Google Maps Platform terms; Feist 1991; nominative fair use; Google Actions Center and Business Profile help; Apple Business Actions and App Clips; Toast Local; Square Go; Oregon and Wisconsin restaurant associations; Li & Wang 2025 a and b; Oh, Glaeser & Su 2023; Dholakia 2011; Parsa et al. 2005; OECD 2021; NFX 2019). research/ecommerce-and-marketplaces.md (Chen, Golden, Rachitsky, for marketplace basics referred to here).
