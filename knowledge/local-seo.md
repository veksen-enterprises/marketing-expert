---
title: Local SEO
summary: How to rank in Google's local pack and Maps; Google Business Profile setup (categories, attributes, photos, posts, verification), the relevance/distance/prominence model, reviews and the rules on review gating and fake reviews, citations, multi-location pages, service-area businesses, LocalBusiness schema, Local Services Ads and tracking.
tags: local seo, google business profile, gbp, google maps, local pack, map pack, reviews, review gating, fake reviews, ftc, nap, citations, service area business, localbusiness schema, multi-location, local services ads, near me
---

Local SEO means getting found when people search for a business near them ("plumber near me", "dentist Lyon"). The results usually appear as a map with three listings (the "local pack") and in Google Maps. These listings come from Google Business Profile (GBP, formerly Google My Business), not mainly from your website. For general SEO see seo-and-ai-search; for running a service business see local-services.

## How Google ranks local results

- Google names three factors: **relevance** (how well your profile matches the search), **distance** (how far you are from the searcher, or from the place named in the search) and **prominence** (how well-known you are: links to your site, number of reviews and rating, and other information across the web). More reviews and positive ratings "can help". [first-party] (A 2026 snippet of the same help page used the word "popularity" in its summary; the meaning is the same.)
- You cannot change **distance**. Searchers far from your address will rarely see you in the pack, however good your profile. Do not promise a client rankings across a whole city from one address. [first-party]
- Google says paying for ads does not improve local ranking. [first-party] [not re-verified]
- Practitioner surveys (Whitespark, expert opinion, not measurement) put GBP signals first (~32% of local pack weight), then on-page signals, reviews and links; citations ~7%. The **primary category** is rated the single strongest factor. [practitioner]

## Google Business Profile setup

- **Verification** comes first; unverified profiles get no performance data and limited edits. Google chooses which methods you are offered. Video verification needs a live, unedited, continuous mobile recording of at least 30 seconds showing: where you are (street signs, landmarks), that the business exists (signage, equipment, products) and that you manage it (opening the till, back room, branded van, a permit or utility bill in the business name). Plan the shot before you press record. [first-party]
- **Name**: use your real-world name exactly as on the sign and website. Google prohibits taglines, product/service words, location words, phone numbers or URLs in the name, and can suspend profiles for it. Some survey respondents rate keywords in the name highly; doing it risks suspension and competitors reporting you. Don't. [first-party; practitioner]
- **Categories**: one primary category (the one that best describes the core business) and up to 9 additional ones. Do not add a category for every service. Check which primary category the top 3 competitors use (visible in Maps). [first-party; practitioner]
- **Attributes**: factual tags such as "wheelchair accessible", "outdoor seating", "women-owned", "online appointments". Availability varies by country and category. Fill every one that is true. [first-party]
- **Services, products, description, hours, holiday hours**: complete everything; Google says complete, accurate information helps relevance. Wrong hours create bad reviews. [first-party]
- **Photos**: JPG/PNG, 10 KB–5 MB, recommended 720×720 px; in focus, well lit, no heavy filters. Add exterior (helps people find the door), interior, team, work examples. No controlled evidence that photo count affects ranking; it does affect whether people choose you. [first-party; practitioner]
- **Posts**: Update, Offer (needs title and dates) or Event (needs title and dates). Use them for real news, offers and seasonal hours, with a tracked link. Treat posts as conversion content, not a ranking lever; there is no first-party claim that posts affect ranking. [first-party; practitioner]
- **Q&A**: Google discontinued the Business Profile Q&A API on 3 Nov 2025 while it updates the Q&A experience. [first-party] Agency reports say Google began removing the public Q&A section from Dec 2025, replacing it with AI answers built from your profile, reviews and website. [practitioner: secondary only] So put answers to common questions (parking, prices, booking, languages spoken) on your website and in your profile description.
- **Links**: Google crawls your profile links to check they work; broken links can be removed. [first-party]

## Reviews

- **Ask every customer, not only happy ones.** Google bans review gating and any incentive for a review, and the US FTC rule (in force 21 Oct 2024) bans fake, bought and suppressed reviews; see local-services for the full rules and penalties. Similar consumer-law rules exist in the UK and EU [not re-verified]. [first-party]
- **Process that works**: send the review link (from the GBP dashboard) by SMS or email within a day of the job; one reminder; make it part of the job checklist, not a campaign. [practitioner]
- **Recency and steady flow** matter: practitioners rate review recency among the top factors; a burst of 50 reviews in one week looks unnatural and may be filtered. [practitioner]
- **Reply to every review**, especially negative ones, briefly and without customer personal details. Future customers read the reply more than the complaint. [practitioner]

## NAP consistency and citations

- NAP = name, address, phone. Citations are listings of your NAP on other sites (directories, Yelp, Apple Maps, Bing Places, industry and chamber of commerce sites).
- The belief that exact NAP consistency drives rankings is long-standing practitioner lore with no first-party confirmation; Whitespark's own survey ranks citations low (~7%). [practitioner; weak evidence]
- Do the basics once: correct listings on Apple Business Connect, Bing Places, the 5–10 main directories for your country and the 2–3 for your industry. Fix wrong phone numbers and old addresses after a move. Do not pay for hundreds of low-quality directories. [practitioner]
- The real value of good listings is that customers who use Apple Maps, Bing or Yelp can find and call you. [practitioner]

## Multi-location businesses

- One GBP per real location with staff during stated hours. No profiles for virtual offices or mailboxes; they get suspended. [first-party] [not re-verified]
- One landing page per location (e.g. /locations/lyon-part-dieu), linked from that location's GBP. Each page needs unique content: address, embedded map, hours, staff, photos of that site, services offered there, local reviews, parking/transport directions. A template with only the city name swapped is thin and risks scaled content abuse (see seo-content-and-architecture). [first-party; practitioner]
- A store locator must output crawlable HTML links to every location page, not only a JavaScript map. [first-party]
- Use GBP bulk management (10+ locations) and keep a single source of truth for hours and phone numbers. [first-party] [not re-verified]

## Service-area businesses (SAB)

- A SAB serves customers at their location (plumbers, cleaners, mobile mechanics). If customers do not come to your address, hide it in GBP; set service areas by city or postcode, no wider than about 2 hours' driving from your base. [first-party]
- You still rank mainly near your verified base address. Covering a wider area takes service pages on your website and, where available, Local Services Ads. [practitioner]
- Service-area pages ("emergency plumber in [town]") must say something true and specific about that area (jobs done there, response times, local regulations), or they are doorway pages. [first-party: spam policies; practitioner]

## Local schema

- Add LocalBusiness structured data (or a more specific subtype such as Dentist, Restaurant, Plumber) to each location page. Required: name, address. Recommended: geo (5+ decimal places), openingHoursSpecification, telephone, url, priceRange. It must match the GBP and the visible page. [first-party]
- Schema helps Google understand the page; there is no evidence it moves local pack ranking. Validate with the Rich Results Test. [first-party; practitioner]

## Local Services Ads (LSA)

- LSAs are pay-per-lead ads shown above the local pack, with a "Google Verified" badge. The account is linked to your GBP, so review work helps both organic local ranking and LSA cost. Use LSA to cover areas or categories where you can't rank organically; badge, ranking, lead disputes and the move into Performance Max: see local-services. [first-party; practitioner]

## Tracking

- GBP Performance shows searches (terms used), profile views, calls, website clicks, direction requests, messages and bookings; only for verified profiles. [first-party]
- Tag the GBP website link with UTM parameters so GA4 can separate profile traffic from other organic traffic. Use build_utm_link, e.g. source=google, medium=organic, campaign=gbp-[location]. Keep medium "organic" so GA4 still groups it as Organic Search; separate by campaign. Use a different campaign for post links (e.g. gbp-post-[offer]). [first-party; practitioner]
- If you use a call-tracking number as the primary GBP phone, list your main number as an additional phone so the profile still matches your website and other listings. [practitioner]
- Rank tracking: the local pack differs every few hundred metres. Use a grid-based rank tracker (rankings measured at points across a map) rather than a single "rank". [practitioner]

## Checklist

- [ ] GBP verified; name matches signage; correct primary category; additional categories only for real lines of business.
- [ ] All attributes, services, hours and holiday hours complete; description answers common questions.
- [ ] Real photos of exterior, interior, team and work.
- [ ] Review request sent to every customer, no filtering, no incentives; every review answered.
- [ ] One profile and one unique landing page per real location; crawlable locator links.
- [ ] SAB address hidden; service area within ~2 hours' drive.
- [ ] LocalBusiness schema matching GBP on each location page.
- [ ] UTM-tagged website and post links; calls and direction requests reviewed monthly.
- [ ] Main directories and Apple/Bing listings correct.

## Common mistakes

- Keywords or city names in the GBP name; suspension follows reports.
- Review gating, review incentives, or buying reviews: breaks Google policy and, in the US, federal law.
- Promising city-wide ranking from one address; distance limits that.
- Duplicate location pages with only the town name changed.
- Fake addresses or virtual offices to appear in more areas.
- Paying for mass citation building instead of fixing the few listings people use.
- Reporting GBP "views" as success instead of calls, bookings and direction requests.

## Sources

research/seo-advanced.md §A (Google Business Profile Help; Maps User Generated Content policy; Local Services Help; Google Search Central LocalBusiness docs; FTC 2024 rule and Q&A; Whitespark survey; agency reports on Q&A removal). Google pages were read from search snippets only; see the access caveat there.
