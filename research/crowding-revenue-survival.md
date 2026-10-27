# Does category crowding hurt an app's revenue or survival, not just downloads? (checked 2026-10-27)

Question: `category-density-apps.md` found that more apps in a store category means fewer downloads per app, but no source measured revenue or survival. Is there a measured link between category competition and how long an app keeps earning, or whether it exits? And did Barlow, Verhaal & Angus (2019) model anything besides installs?

Hop 1 from `category-density-apps.md` and `app-store-search.md` src 36. Access marks as in `founder-test-samples.md`.

**Overlap.** Ershov's downloads elasticity, Barlow's abstract and Haans are in `category-density-apps.md` (src 1, 2, 5). The Shopify exit numbers (median exiting app peaked at 8 installs, gone within 68 weeks) are `marketplace-and-registry-listings.md` src 143. Not repeated.

**Access.** The web-fetch tool hit its hourly limit partway through. Three candidate papers found by title (§4) were not read. Semantic Scholar and OpenAlex API calls through the shell were refused by the proxy (HTTP 403).

## Sources

1. Lee, G. & Raghu, T. S. "Determinants of Mobile Apps' Success: Evidence from the App Store Market." *Journal of Management Information Systems* 31(2):133–170, 2014. https://jmis-web.org/articles/1202 [abstract-only, 2026-10-27: journal page, via fetch summary]
2. Lee, G. W. *Understanding the Determinants of Success in Mobile Apps Markets.* PhD dissertation, Arizona State University, May 2015. Chapter 3, "App Portfolio Management and App Success". https://keep.lib.asu.edu/system/files/c7/131882/Lee_asu_0010E_14861.pdf [read 2026-10-27: first 100,000 of 117,208 characters, via fetch summary; tables did not come through. Chapter 3 is the dissertation version of source 1; the published paper may differ]
3. Barlow, M. A., Verhaal, J. C. & Angus, R. W. "Optimal distinctiveness, strategic categorization, and product market entry on the Google Play app platform." *Strategic Management Journal* 40(8):1219–1242, 2019. doi:10.1002/smj.3019. https://ideas.repec.org/a/bla/stratm/v40y2019i8p1219-1242.html [abstract-only, 2026-10-27; Semantic Scholar lists it as closed access; the Wiley page could not be fetched]
4. van Angeren, J., Vroom, G., McCann, B. T., Podoynitsyna, K. & Langerak, F. "Optimal distinctiveness across revenue models: Performance effects of differentiation of paid and free products in a mobile app market." *Strategic Management Journal*, doi:10.1002/smj.3394. Accepted manuscript: https://blog.iese.edu/vroom/files/2022/03/2022-Van-Angeren-Vroom-McCann-Podoynitsyna-Langerak-SMJ-optimal-distinctiveness-across-revenue-models.pdf [read 2026-10-27: via fetch summary; regression tables did not come through; year and volume not checked]

## 1. Popular categories go with shorter stays in the top-grossing chart

- Data: Apple App Store weekly top charts, 39 weeks, December 2010 to September 2011. 17,697 apps from 8,627 sellers; the survival sample is 7,579 apps from 3,882 sellers. "We used the top grossing charts, thus combining free and paid Apps in a single chart." (2) [research, 2, read; observational; one store; 2010–2011]
- Result: "the estimated risk of exiting the top chart increases 1.22 times if an App is offered in the popular categories" (frailty Cox model). The hierarchical model points the same way: such apps have "relatively lower odds of survival and shorter survival periods". Other combinations of popular and unpopular categories kept the sign and significance (2) [research, 2, read; hazard ratio 1.22; p-values not seen].
- The published abstract states the same direction: "investment in less-competitive categories" helps an app stay in the top-grossing 300 (1) [research, 1, abstract-only].
- What "competition" is here: not a count of apps. Categories are split by "popularity in the AppStore market". Games, Books and Entertainment are popular; Medical, Navigation and Weather are not. The metric behind the split is not stated in the text read. The authors' reasoning: such apps "would compete with numerous popular Apps" (2) [research, 2, read]. So the proxy mixes crowding with category size and demand.
- What "survival" is here: staying on the chart. An app is coded as exiting "if the App dropped from the charts". It is not removal from the store (2) [research, 2, read].
- Who is measured: apps already in the top 300 by revenue. It says nothing about small apps or new entrants that never chart [derived from 2].
- Causality: associations. The author argues endogeneity is unlikely but says valid instruments are hard to find (2) [research, 2, read].
- Read plainly [derived from 1–2]: among apps that already earn enough to chart, those in big popular categories lose their place about a fifth faster. That is the nearest thing to a revenue-duration effect found. It is one store, one year, 15 years old, with a popularity proxy.

## 2. Barlow et al. and a later SMJ app study measure downloads only

- Barlow et al.: the only outcome word in the abstract is installs ("developers can substantially increase the installs of their first app") (3) [research, 1, abstract-only]. Whether ratings or survival were also modelled is still not checked; the full text is closed and could not be fetched.
- van Angeren et al. (US iOS, 268,126 apps, monthly, May 2016 to October 2017) use log monthly downloads from Apptopia; a check uses daily active users. Revenue and survival are not measured; the authors say profitability data were not available (4) [research, 1, read; observational; four store divisions].
- Their categories are built from description topics, not the store's own. Crowding enters only as controls: log number of apps in the category and download concentration (HHI). For paid apps the authors write: "App performance decreases with competition (HHI) in the category". The coefficient on category size was not reported in the text read (4) [research, 1, read; tables not seen].
- Distinctiveness pays differently by revenue model: inverted U for paid apps, U shape for free apps (4) [research, 1, read; downloads only]. This adds a qualifier to "look like the leader": the best distance from the category centre depends on whether the app is paid.

## 3. App exits versus category density: nothing found

- No study was found that links store delisting or app exit to the number of apps in a category, for Google Play, iOS or Shopify [derived; searches only].
- The Shopify preprint (`marketplace-and-registry-listings.md` src 143) reports exits and category concentration, but its abstract does not link the two.
- Vendor delisting reports (Pixalate) turned up in search; they count removals, they are not density tests. Not read.

## 4. Found by title, not read

- "Takeoff and sustained success of apps in hypercompetitive mobile platform ecosystems", ICIS 2012 proceedings. https://aisel.aisnet.org/icis2012/proceedings/EBusinessStrategy/3 [not read; title only]
- "Competing for Temporary Advantage in a Hypercompetitive Mobile App Market", University of Iowa record. https://iro.uiowa.edu/esploro/outputs/journalArticle/Competing-for-Temporary-Advantage-in-a/9984462738402771 [not read; title only]
- "Habitat Traps in Mobile Platform Ecosystems". https://publications.iitm.ac.in/publication/habitat-traps-in-mobile-platform-ecosystems [not read; title only]
- Any of these could test chart duration against competition. No claim is made from them.

## What this changes

- `knowledge/competing-with-incumbents.md`, "Competition as signal": keep the downloads line proposed in `category-density-apps.md`. Add one short clause, no stronger: "Among apps already in Apple's top-grossing 300, those in popular categories dropped off the chart about 1.22 times as fast [research; observational; 2010–2011; popularity proxy, not app counts; chart exit, not store exit]." Do not write "crowding cuts revenue" or "crowding kills apps": neither was measured for entrants.
- `research/crowded-markets.md`, "Look like the leader, not like the average": replace "outcome measure not checked in this read" with "outcome: installs of the first app (abstract); survival and ratings not checked, full text closed". Add: "In iOS downloads 2016–2017, the best distance from the category centre differs for paid (inverted U) and free (U shape) apps [research; observational; downloads only]."
- Test: in `test/consistency.test.ts`, a playbook line that names a revenue or survival effect of a crowded category ("crowd" within the same sentence as "revenue", "survival" or "exit") must carry a tag containing "observational" and "chart" or "downloads". Input: "Crowded categories cut app revenue [research]." Expected: fails. Input: the clause above. Expected: passes.
- Tools: changes nothing. `market_size` takes no competitor input, and this evidence is about chart persistence of top earners, not a discount any founder could apply.

## What this does not settle

- Whether crowding lowers revenue or survival for new or small apps. Source 2 covers only apps already charting.
- Whether it is crowding or category size that shortens chart stays. The proxy cannot separate them.
- Whether the JMIS paper's numbers match the dissertation chapter. The journal full text was not read.
- Whether Barlow et al. modelled survival or ratings.
- Whether any study ties store delisting to category density. None found; three candidates in §4 unread.
