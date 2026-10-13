# Grade: companion-site (round 3)

Case: "Review companion.example for SEO and AI search. What should I fix?"
Run: evals/runs/v3/companion-site.md

I checked the run against the repo (VISION.md, CONTEXT.md, `research/`, `knowledge/warlock-expansion.md`, `.claude/skills/debug-capture/SKILL.md`, `apps/app/server.mjs`, `apps/app/Dockerfile`, `apps/app/vite.config.ts`, `apps/app/src/routes/*`, `lib/page-title.ts`, `lib/sitemap.ts`, `components/ias-calculator.tsx`, `packages/ui/src/segmented/segmented.tsx`, `apps/api/src/routes/items.ts`) and the local production build at http://127.0.0.1:4173/. I curled 19 paths (all statuses in the answer match), the raw body of `/ias-calculator`, and a `.js.map` file. I re-ran `crawl_site`, `check_ai_crawler_access`, and `audit_page` with render on and off on `/ias-calculator`, plus render on `/search`, `/imbue-calculator` and `/items/00000000-…`, using the run's arguments.

Most cited lines are right. `ssr: false` is at `search.tsx:120`, `ias-calculator.tsx:7` and `imbue-calculator.tsx:7`. The shared description is at `__root.tsx:45`. The "server stops running `head`" comment is at `__root.tsx:75-78`. The noindex comment is at `robots[.]txt.ts:5-6`. The sitemap query is at `items.ts:236-240`. "The owner is anonymous until contacted" is at `VISION.md:64-65`, and item lifecycle is at `VISION.md:128`. "Owned by" plus the avatar sit in `items.$id.tsx:249-303`. The Dockerfile says "# Optional: the public origin". `staging.companion.example` is at `SKILL.md:20`. The `useEffect` is at `ias-calculator.tsx:393`. The `console.log` is at `:388`. The `sr-only` h1 is at `search.tsx:437`. `knowledge/warlock-expansion.md:3` says "alongside Ladder Season 13". Source maps return 200 (2.9 MB). Raw server text is "[ GameX Companion ] Search IAS calculator Imbue calculator Report a Bug", 9 words, which the run spot-checked. Two code claims do not hold, and one build flag was missed again (see B1–B3).

## Scores

| # | Item | Score | Evidence |
|---|---|---|---|
| 1 | Context first | 2 | It now read the files round 2 missed: "VISION.md, README.md, CLAUDE.md, AGENTS.md, CONTEXT.md (lines 1-120), docs/adr/0001-0007". `list_business_profiles` returned `[]`, and the answer ends "I can save these facts as a GameX Companion business profile once you confirm them." It separates the local build from production: "I checked the production build of the app running locally, not companion.example itself… marked **inferred**". Gaps: it ran `ls` on `research/` but opened nothing there. `research/plannersite-planner.md:3` records "Season 14" as live on 2026-09-21, so the timing advice is stale (B4), and the competitor list is still "unverified". `VITE_CALC_ONLY` is missed for the third round, although the run grepped "`VITE_|import.meta.env` in apps/app/src" and the prompt says "Look for build-mode flags" (B3). The item template was never rendered with data. The prompt says "point it at a stub API", and the run did not, which caused B1 and B2. |
| 2 | Asked for numbers / stated assumptions | 2 | "Assumptions (labelled, since I couldn't ask you)": A1 is the goal (hobby vs business, "the order of the moves stays the same, but search becomes more important"). A2 is the target queries ("**inferred**, I have no keyword data"). A3 is the alternatives. Open questions cover Search Console, `VITE_SITE_URL`, staging, the CDN and the season date. It invents no traffic or volume figures. |
| 3 | Diagnosis before tactics | 1 | The constraint is clearly stated and backed by evidence: "Google and AI assistants see almost nothing… Every public page sends crawlers the same 9-word shell", with the rendered-vs-raw numbers and the `ssr: false` cause. This round adds "What would prove this wrong: Search Console shows the calculators already indexed… move 2 matters only for AI assistants", and it frames SEO as secondary ("Treating SEO as the main channel" is under "not to do"). Still missing, as in rounds 1 and 2: what a calculator visitor should do next in the product. A Discord login, a search or a watch never appears. Nothing weighs whether calculator traffic serves VISION's "The calculator is item-driven — a consumer of the database". |
| 4 | Right playbook, noticed what's unusual | 2 | It used `technical_seo_review`, community-and-hobby-products ("sources 'All read via search snippets'"), the marketplaces "SEO on supply pages" section, seo-and-ai-search and ai-assistant-visibility. It noticed what's unusual about this business: short-lived trade listings with no lifecycle ("VISION.md:128 leaves item lifecycle as an open question"), Discord names on indexed pages against "anonymous until contacted", member consent ("Did posters and server admins agree to their names appearing…"), ladder-season timing, AI bots that don't run JS, and an indexable staging host. |
| 5 | Tools for numbers | 2 | The headline number is now right and was checked by hand: "11 whitespace tokens of body text (tools report 9; the difference is the '[' ']' around the logo)". I reproduced the rendered counts: 89 for /search, 341 for /ias-calculator, 1,193 for /imbue-calculator, and client-only shares of 0.899, 0.974 and 0.992. Speed numbers are labelled "(lab, local, unthrottled)", and JS weight is "gzip-9 of referenced /assets/*.js". No calculator tools were needed. Minor: the 89 words on /search include the API-error text "Search failed… try again", which the answer does not say. |
| 6 | Specific to this business | 2 | Route files and lines, `X-Robots-Tag` in `server.mjs`, `staging.companion.example`, the IAS address rewrite "with about 20 query parameters", "Assassin IAS breakpoints for claws and Whirlwind in GameX", Umami for AI referrals, ladder resets and the Warlock expansion, the Discord display names. None of it fits another site. |
| 7 | Focused and ranked | 1 | Three ordered moves, a "What not to do yet" list, and "Small items" cut to one line each, which is better than round 2. But move 2 is a bundle: "Server-render the two calculators, and give each its own title and description… Add a canonical" is three changes, and its test checks only the first. Move 3 has a test and a revisit trigger but no metric, time box or stop condition. Move 1 has "Stop condition: none. This is hygiene", which is defensible, but its metric is garbled ("the Search Console 'Pages' report, using a `site:` search"). No move offers a cheaper first step than "Remove `ssr: false`". The length is 1,336 words (`wc -w`) against "under about 1,200" (11% over). |
| 8 | Evidence honesty | 1 | Many items are labelled: "**inferred**", "unverified", "[practitioner]" twice, "(lab, local, unthrottled)", "Whether production sets it is **inferred**". There are three weaknesses, two of them carried over. (1) "Google's spam policies treat masses of thin pages built from a template as low value" is unlabelled and stronger than the playbook. The playbook says "can count as scaled low-value content" (marketplaces.md:82) and "when pages exist mainly to rank" (seo-content-and-architecture.md:56). User trade posts are not obviously that, and this is again a main reason for move 3. (2) "Most AI crawlers (GPTBot, ClaudeBot, PerplexityBot) don't run JavaScript" still lacks the [vendor] Vercel/MERJ label, although the tool log shows the run read it ("Vercel/MERJ [vendor]"). (3) "Google no longer shows FAQ rich results for most sites" is unlabelled. It also calls the owner-name issue a "**Contradiction**", which is fair but strong for an open design question. |
| 9 | Respects vision | 2 | A1 cites "augment, don't disrupt". Move 3 uses VISION's own anonymity line and lifecycle question. "Treating SEO as the main channel" is ruled out in favour of moderators and shareable outputs. Nothing a non-goal excludes is recommended. Still missed, for the third round: "Not a standalone planner/mod tool. The calculator is item-driven". Move 2 makes the calculators the search entry with no route back into search or watches, and the answer doesn't mention the tension. |
| 10 | Plain language | 2 | No hype and not the banned word. It explains H1 ("main heading"), `ssr: false` ("browser-only rendering"), canonical ("the tag that names the preferred URL"), noindex, soft 404, and this round hydration ("the browser taking over the server-rendered page"). It leaves "308", "gzip" and "source maps" unexplained, which is acceptable for a technical founder. |

**Total: 17/20**

## Errors

### A. The tool gave wrong or misleading data

1. **Rendered text still glues inline siblings and counts hidden copies** (`src/lib/pageAudit.ts`, render path). With render on, `/ias-calculator` has `leadText` "What to calculate? Whirlwind + TrapWhirlwind + Trap Trap onlyTrap only". `packages/ui/src/segmented/segmented.tsx:52-61` renders "an invisible bold copy" next to the label. Server-HTML extraction is fixed. The rendered count is a few words high, which is small, but the glue remains.
2. **Landing-page CTA heuristic still fires on tools and error pages.** `audit_page` flags "No obvious call to action found (heuristic)" as a **warning** on `/ias-calculator` (with or without render) and on the item page. The form flag is fixed (`"interactive": true`, no field-cost message) and `ctaCandidates` is `[]`, but this flag was not gated the same way.
3. **Render mode doesn't say when the rendered page is an error state.** `/items/00000000-…` renders "Couldn’t load this item. Something went wrong on our end — try refreshing." `/search` renders "Search failed… try again". Neither result reports the failed API requests or console errors, and the prompt asks for both ("console errors", "failed requests"). The run therefore read an API-failure page as a missing-item page (B2).
4. `check_ai_crawler_access` still fetches none of the checked paths. Its wording is now honest about that ("This only covers robots.txt: it says nothing about status codes, noindex, or how much text the server HTML holds"), so this is a gap, not misleading output.

### B. Assistant errors

1. **"The meta description is the same on every page"** and "Every public page sends crawlers… the same meta description" are wrong for item pages. `items.$id.tsx:45-60` (`itemHead`) gives each loaded item its own title, description and og:image from its stats, and runs on the server (`ssr: "data-only"`). The run read lines 1-240 of that file. It never served item data (no stub API), so it generalised from three static pages.
2. **Misattributed evidence for the soft 404.** "Missing items return **200**: /items/00000000-… shows 'Couldn't load this item.'" That text is the API-failure state. The loader turns a failed call into `undefined` (`items.$id.tsx:28-39`), while a missing item (`null`) shows "This item is gone." (`items.$id.tsx:138`). The conclusion still holds, because there is no `notFound` and both paths return 200. But the answer missed the separate finding that sits in its own evidence: an API outage serves a 200 error page. The prompt lists that case: "Backend down or slow: 503 with `Retry-After`, never a 200 error page".
3. **Missed `VITE_CALC_ONLY` a third time.** `routes/index.tsx:6` sends `/` to `/ias-calculator` in that build. `ias-calculator.tsx:527` and `__root.tsx:100,127-131` make the IAS h1 visible and swap the header. The answer cites `index.tsx` for the 307 and gives the IAS h1 as a finding, and the prompt says "Grep for env flags… and say which mode you built". It should be an open question.
4. **Stale season timing.** "Season 13 started with the Warlock expansion in Feb 2026… I don't know the next reset date". `research/plannersite-planner.md:3` says the planner was observed "on game version 3.3.93847 (Season 14)" on 2026-09-21. A reset has just happened, so "ship it before the next ladder reset" is probably months out, and the urgency is overstated.
5. **Spam-policy overstatement** (item 8). This is round 2's B3 again in new words.
6. **Move 2 is three changes in one** (SSR, titles/descriptions, canonical), and move 3 has no metric or stop condition (item 7).
7. **No link from search visitors to the product, and no use of `research/`** (items 3 and 9).
8. **"The sitemap API lists every item ever stored"** leaves out the `SITEMAP_MAX_URLS = 50_000` cap at `items.ts:29`. This is minor.
9. **The `sr-only` search h1 is listed under "Small items" as if it were a defect.** The code comment at `search.tsx:435-436` says it is deliberate ("The page's topic for search engines and screen readers"), and a visually hidden h1 is still in the rendered DOM. This is minor.
10. **Over length**: 1,336 words against "under about 1,200".
11. No tool misuse. The tool log matches the answer, the prompt's word-count spot-check was done, and `X-Robots-Tag` is the right mechanism, with a `curl -sI` test.

**File-claim audit:** 22 checkable claims about repo files or code.
- Misquotes: 0.
- Misattributed or misstated: 2 (B1, B2).
- Overstatements of a playbook: 1 (B5). The playbook citations "All read via search snippets" and "no evidence that major assistants use it" are accurate.
- Omissions that change a finding: 2 (B3, B4).

## Top strengths

1. **Fixed the noindex mechanism.** "In server.mjs, add an `X-Robots-Tag: noindex` header…", with the reason grounded in `__root.tsx:75-78` ("A route-level tag wouldn't reach crawlers anyway") and a test you can rerun (`curl -sI … | grep -i x-robots-tag`). It also adds staging, with the host name taken from the repo.
2. **Checked its numbers.** Round 2's headline miscount is gone. It reconciled "11 whitespace tokens" with the tool's 9 before quoting it.
3. **Found a privacy and vision tension in code.** It set "Owned by <Discord display name>" against VISION's "anonymous until contacted" and asked about consent, as the community playbook suggests.

## Server attribution (ranked, most impactful first)

### Tool gave wrong or misleading data

1. **Report failed requests and error states in render mode** (`src/lib/pageAudit.ts` `renderAndAudit`). Add `failedRequests` (URL and status), `consoleErrors`, and a flag such as "The rendered page shows an error state (N failed API requests); word counts and content reflect that state, not real data. Serve a stub API before judging this template." *Why:* this would have stopped B2 and flagged the inflated /search count.
2. **Finish text extraction in the render path.** Skip `visibility:hidden`, `aria-hidden` and `display:none` nodes, and add a space at every element boundary. Regression test: `<button><span class="invisible">Trap only</span><span>Trap only</span></button>` gives "Trap only" (2 words).
3. **Gate the "No obvious call to action" flag** like the form flag. Skip it when the page has an interactive form with no submit, or when it is an error state, or downgrade it to info.
4. Optional: let `check_ai_crawler_access` fetch the checked paths (status, `X-Robots-Tag`, meta robots, server word count). The wording fix already removed the misleading part.

### Assistant ignored the server (or the server under-specified)

5. **`technical_seo_review` prompt** (`prompts/seo-site-review-v2.md`):
   - Make build flags and data a required output line: "Build mode: flags found (`VITE_*`…), values used; data source (stub API / seeded DB / none)". The rule exists ("Look for build-mode flags"), but the run skipped it for the third round. A required line makes the omission visible. This covers B3.
   - Add: "If you couldn't serve data, don't generalise head or status findings to data templates; mark them **not checked**." This covers B1 and B2.
   - Add: "Read `research/` and `knowledge/` in the repo for competitors and the current game or season calendar before naming either." This covers B4 and B7.
   - Add to §4: "For each search target, say what the visitor should do next in the product (login, search, watch) and whether the template links there." This covers B7 and item 9.
6. **Evidence tags in the server's own text.**
   - `prompts/seo-site-review-v2.md` §2.4 says "most AI crawlers… appear not to run JavaScript" with no tag, and §3 "Structured data" says "FAQ and HowTo results were mostly removed in 2023" with no tag. Answers copy that wording, so tag both inline (`[vendor: Vercel/MERJ, Dec 2024]`, `[first-party, 2023]`).
   - `knowledge/marketplaces.md:82` is still untagged, although round 2 asked for it. Tag it `[first-party policy; applies to pages made mainly to rank — whether listings qualify is a judgement]`.
7. **Length and bundling** (`src/server.ts` INSTRUCTIONS #6 and #9 and the prompt's §5). The prompt's deliverables (crawler table, per-template assessment, `file:line` for every claim) conflict with the 1,200-word cap. Say: "The crawler table and per-template detail go in the tool log or an appendix; the answer itself follows the cap." Add to #6: "If a move has more than one change, split it, or make the first change the move and list the rest as follow-ups."

## Compared with round 2

### Round-2 tool errors (section A)

| Round-2 error | Status | Evidence |
|---|---|---|
| A1 word counter glues inline siblings | **Mostly fixed** | Server `leadText` is now "[Companion] Search IAS calculator Imbue calculator Report a Bug" and `wordCount: 9`, which matches curl. In render mode it still glues "Whirlwind + TrapWhirlwind + Trap" and counts the invisible copy (new A1). |
| A2 no client-rendered shell detection in crawl_site | **Fixed** | One `client-rendered` issue: "Pages whose server HTML is nearly empty (< 50 words) but loads scripts… These pages are left out of the missing-h1 and thin findings". Examples: "(9 words in server HTML)" ×3. |
| A3 check_ai_crawler_access reads as an access verdict; silent on Sitemap | **Fixed (wording); fetch not added** | "robots.txt allows all listed AI bots on the checked paths. This only covers robots.txt: it says nothing about status codes, noindex…", and "robots.txt has no Sitemap: line. Add one…". The run used this: "robots.txt allows every AI bot… no `Sitemap:` line". |
| A4 landing-page heuristics misfire on a calculator | **Partly fixed** | `"forms": [{"interactive": true, "fields": 21, …}]` with no field-cost flag; `ctaCandidates: []`; the OG flag is split ("No og:image; shared links show no picture"). It still flags "No obvious call to action found (heuristic)" as a warning on `/ias-calculator`. |
| A5 render mode overwrites `url` | **Fixed** | `"url": "http://127.0.0.1:4173/ias-calculator"`, `finalUrl` is clean, and the rewrite becomes an info flag: "Scripts changed the address to …?mode=ww%2Btrap&… If people share that URL, give it a canonical". The answer turned that flag into move 2's canonical advice. |

### Round-2 assistant errors (section B)

| Round-2 error | Status | Evidence |
|---|---|---|
| B1 repeated wrong word count | **Fixed** | "Every page returns 9 words of server HTML", checked against curl ("11 whitespace tokens… the difference is the '[' ']'"). |
| B2 noindex fix wouldn't reach layout children | **Fixed** | "add an `X-Robots-Tag: noindex` header for /admin*, /create, /planner, /stash…"; "A route-level tag wouldn't reach crawlers anyway… (__root.tsx:75-78)"; test `curl -sI … \| grep -i x-robots-tag`. |
| B3 "Google's spam policies cover them" | **Still present** | "Google's spam policies treat masses of thin pages built from a template as low value", unlabelled, and still a main reason for move 3. |
| B4 cited `use-media-query.ts` for calculator SSR safety | **Fixed** | "I found no top-level `window` or `localStorage` use in components/ias-calculator.tsx or imbue-calculator.tsx; the address rewrite runs inside a `useEffect` (line 393)". Verified. |
| B5 missed `VITE_CALC_ONLY` | **Still present** | Third round. Not mentioned, though the run grepped `VITE_` in `apps/app/src` and the prompt now has an explicit build-flag rule. |
| B6 no visitor-to-product link; `research/` unused | **Still present** | No login, search or watch path from the calculators. `research/` was listed but not opened, and that now also costs the season date (B4). |
| B7 proposed title dropped "Whirlwind" | **Fixed (by omission)** | No title proposed. The description example keeps "Whirlwind". |
| B8 "make the build fail" vs Dockerfile "Optional" | **Fixed** | "The Dockerfile marks that variable 'Optional'… Whether production sets it is **inferred**." |
| B9 over length (about 1,507) | **Partly fixed** | 1,336 words, still 11% over "under about 1,200". |
| Regression: lost Vercel/MERJ vendor label | **Still present** | "Most AI crawlers (GPTBot, ClaudeBot, PerplexityBot) don't run JavaScript", unlabelled, although the tool log says "(AI crawlers don't run JS, Vercel/MERJ [vendor])". |

### New regressions

1. **Two code claims that were right in round 2 are now wrong.** Round 2 did not claim the description was shared on item pages. This round says "the same meta description" on "every public page", against `itemHead`. It also uses an API-failure page as soft-404 evidence and so misses the "backend down returns 200" finding (B1, B2). Both come from not serving data.
2. **Stale timing fact** (B4). The answer gives "Season 13" as the reference while the repo records Season 14.
3. **Move 2 bundles three changes** after INSTRUCTIONS #6 added "each is one action, not a bundle". Move 3 lost the metric and stop condition that the round-2 item fix had.

### Specific checks

- **(a) File claims:** 22 checked. 0 misquotes, 2 misattributions or misstatements (B1, B2), 1 playbook overstatement (B5), and 2 omissions that change findings (B3, B4).
- **(b) Evidence labels against the playbooks:**
  - These match: "[practitioner]" on the community playbook (lines 29, 68 and 72 carry `[practitioner]`), "sources 'All read via search snippets'" (line 102), and the llms.txt line.
  - The "[practitioner]" on the marketplaces sentence covers the noindex advice, but that sentence also carries an unlabelled Google-policy claim stated more strongly than "can count as".
  - The Vercel/MERJ `[vendor]` label is dropped.
  - The FAQ claim carries no `[first-party]` tag.
- **(c) Length:** 1,336 words for the answer section only (`sed -n '1,/^## Tool log/p' | wc -w`, heading included), about 136 words (11%) over.
- **(d) One action per move / falsifier:**
  - Move 1 is one mechanism: one header rule in one file, covering paths plus the staging host.
  - Move 2 is three changes.
  - Move 3 is one decision, two edits.
  - The answer says what would prove the diagnosis wrong: "Search Console shows the calculators already indexed with their full text and getting impressions. That would mean Google's rendering is enough, and move 2 matters only for AI assistants." This is new this round.

**Net:** four of five round-2 tool errors are fixed or mostly fixed (A2, A3, A5 fully; A1 server-side), and A4 is partly fixed. The assistant fixed its round-2 headline errors (word count, noindex mechanism, SSR evidence, Dockerfile). Item 5 rises from 1 to 2, and the total moves from 16 to 17. The same three gaps recur (spam overstatement and lost vendor label, `VITE_CALC_ONLY`, no visitor-to-product link). New code misstatements come from never serving item data, and the answer is still over length.
