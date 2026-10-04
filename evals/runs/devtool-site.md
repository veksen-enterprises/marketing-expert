## Answer

**How I reviewed it.** I couldn't load dbtool.example from my sandbox because the domain is blocked here. I also couldn't build the site, because it depends on a private npm package (`@dbtool/pglite@1.0.7`). So I reviewed the source of the Astro marketing app in `apps/blog`, plus `VISION.md` and `README.md`. For the page audit, I wrote out the home page's `<head>` and visible text by hand from `index.astro`, `SiteLayout.astro` and `BaseHead.astro` and gave that to the audit tool. The wording, headings, meta tags and canonical match the source. The app and Discord link targets come from environment variables, so I used placeholders for those. Styles, scripts and the shader canvases are left out. Treat the result as close to the real page, not as a check of the live site.

You couldn't answer questions during this review, so I've listed the questions I would ask at the end, along with the assumptions I used in their place.

---

### Fix first: the Pro price is different on two pages

- Home page (`index.astro`): Pro is **"$20 / month"**.
- Pricing page (`pricing.astro`): Pro is **"$16 /mo · Billed monthly"**.

Both pages send people to the same `/membership/start` checkout. Someone who reads one price and then sees the other at checkout will start to doubt everything else on the site, including "Simple, honest pricing," which is the heading right above the $20. The playbooks say that on a self-serve product the pricing page is often the most-visited sales page. The privacy-and-marketing-law playbook also says a stated price is an objective claim, so you need to be able to back it up.

AI assistants will repeat whichever number they find, which ties into your second question.

- **Fix:** pick the real price and put it in one shared constant that both pages read from, so they can't drift apart again. If $16 is the per-month price on annual billing, say that on both pages.
- **Effort:** minutes.
- **Test or ship?** Ship it. This is a bug, not something to A/B test.
- **Hypothesis:** Because the home page and pricing page show different prices for the same Pro checkout, showing one price everywhere will raise the share of pricing-page visitors who complete Pro checkout.
- **What would change my mind:** nothing. Fix it regardless.

There's a smaller contradiction of the same kind. The home page says a team plan "is shipping next." The pricing FAQ says "Not yet. We're figuring out what teams actually need." Make those agree too.

### Second: the site describes the product three different ways, and one contradicts your main claim

**What the product is**

- Home page title: "See the queries your ORM is hiding."
- Footer: "We demystify how databases process queries and indexes through dynamic visualizations."
- RSS description (`consts.ts`): "Database indexing and optimization tools - Care for your database."
- The main call to action sells "PlanView." Your own blog introduced that name as "Imaging Technology for Database Indexes," a visualization tool.

`VISION.md` describes something sharper: a feedback loop for the data layer. It shows the queries your code runs, maps each one to the line that wrote it, and says what it will cost before it reaches production, using a real Postgres planner and production statistics. The hero copy gets closest to this. The footer and RSS text describe an older product.

**How it works (this is the part that undermines you)**

- Home page comparison table: "Yes, **simulated** planner choices." The 10×/1000× card: "PlanView **simulates** how the planner's choices shift."
- Home page "What we believe" section: "Real code parses your queries and schemas into an AST and reasons about the plan."
- Pricing page tooltip: "Real Postgres planner: actual EXPLAIN output, **not a simulator**."
- VISION's first value is "Proven, not guessed... comes from a real Postgres planner."

For an engineering buyer, "simulated" versus "real planner" decides whether they trust the 982× number. That number is the difference you claim over "LLM SQL copilots," which the table calls "unverified guesses." The home page currently describes your method in nearly the same words you use against them.

**Fix:**

- Pick one sentence about the method and use it everywhere. VISION's version would be something like "costs each query with the real Postgres planner, under statistics copied from your production database."
- Rewrite the footer and RSS description to match the hero.
- Decide whether "PlanView" is the product name or a feature of DBTool. Today the logo says one thing and every button says the other.

**Hypothesis:** Because the site describes the method as both "simulated" and "not a simulator," using one "real planner" description will raise the share of first-time visitors who click "Try PlanView free."

**Test or ship?** Ship it. Fixing a contradiction doesn't need a test, and I don't know your traffic. A/B testing needs thousands of visitors per version to detect a typical lift. If you send me daily visitors and the current click rate, I'll run the sample-size calculator before you test the headline itself.

**What would change my mind:** if 5 to 10 recent sign-ups, asked "what did you think this was before you tried it?", consistently describe it the way the current hero does. Then the inconsistency costs less than I think, and you can drop this to cleanup.

**The bigger question here is about positioning, not copy.** VISION treats MCP (the agent asking while it writes code) and alerts from the comparison branch as core gates. The site lists both as "soon" or "on our radar." I don't know whether the product or the site is out of date. If MCP and alerts have shipped, the site is hiding your most current differentiator ("built for code written by agents"). If they haven't, the site is right and VISION describes the future. Answer that before you rewrite the hero. The positioning playbook says to work from your best customers and what they used before, not from the tagline.

### Third: put the data-handling answer next to the "connect your database" step

The home page says "Read-only," "never writes to your DB" and "No agents to install on prod." Its roadmap also lists "Local-only mode... Nothing leaves your network," which tells a careful reader that today some data does leave. Only the pricing FAQ says what: query text, plans, schema, and column statistics, which include sample values from your columns.

That FAQ answer is honest and good. But the objection comes up at step 2 of "How it works" ("Paste a connection string"), and nothing there answers it. Someone about to paste a production connection string is exactly the person who will stop there.

**Fix:** add one plain line under step 2, for example: "We send query text, plans, schema and column statistics (including Postgres's most-common sample values) to our servers. We never read rows or query results." Link it to the FAQ answer.

**Hypothesis:** Because the data-handling answer appears only on the pricing FAQ, showing it at the "connect" step will raise the share of sign-ups who connect a database.

**What to measure:** the share of sign-ups who connect a database, not clicks.

### Lower priority (cheap, do when you're in the files)

- **No `og:image`.** The home page doesn't pass `image` to `BaseHead`. The audit flagged incomplete Open Graph tags, and the Twitter card is set to `summary_large_image` with no image. For a developer tool that spreads through links on Slack, HN, X and Discord, a blank preview is a real loss. Add one default image in `BaseHead`. While you're there, trim the OG description from 133 to about 120 characters: `check_copy_limits` marked it over the recommended length.
- **Getting-started meta description is a placeholder with a typo:** "DBTool Getting strted."
- **"Docs" goes to two places.** The header links to `docs.dbtool.example`. The footer "Docs" (and "CI integration") link to `/getting-started`.
- **Unknown URLs return the home page with status 200.** The Caddyfile has `try_files {path} {path}/index.html index.html`. Any mistyped URL returns the home page as a success, so `404.astro` is never served and search engines see "soft 404s." Fix this by falling back to `/404.html` with a 404 status.
- **Check that fonts and icons load in a browser.** Caddy sends `Cross-Origin-Embedder-Policy: require-corp` on every page because the wasm needs it. Under that header, browsers block cross-origin files that don't explicitly allow embedding. The home page loads Geist (Google Fonts) and the Phosphor icon CSS (unpkg) without `crossorigin`. I can't tell from source whether those servers send the headers that allow it. Look at the browser console on the live home page. If they're blocked, self-host the files or send COEP only on the pages that run pglite.
- **Proof is thin.** There are no named users, no GitHub star count and no quotes. The demo numbers (142 queries, 982×) are illustrations; label them "example." Your strongest proof is the Codex post ("Tracing Codex's 640TB/year SQLite Writes"), and the home page doesn't link to it.
- **The comparison table leaves out tools buyers will actually compare you with.** It compares you only to `EXPLAIN ANALYZE` and "LLM SQL copilots." A Postgres team is also likely to look at dedicated query-monitoring tools such as pganalyze, which is an example from my general knowledge, not something I checked here. "None of them cover all four" is a factual claim. Either name the alternatives your best customers actually came from, or narrow the claim.

---

### Can ChatGPT and Perplexity find you?

**Short answer: nothing in your code blocks them, but being reachable is not the same as being recommended.**

**What the source shows**

- **There is no `robots.txt`** in `apps/blog/public`, and no `llms.txt`. With no robots rules, every crawler is allowed, including OAI-SearchBot (ChatGPT search), PerplexityBot (Perplexity's index), Googlebot and Bingbot.
- **The content is in the HTML the server sends.** It's a static Astro site, and the home and pricing pages are plain HTML with no React islands. That matters: according to a vendor study (Vercel/MERJ 2024), OpenAI's and Perplexity's crawlers don't run JavaScript. Your copy, prices and FAQ are in the HTML they fetch.
- **`robots.txt` and `llms.txt` probably return your home page.** Because of the Caddy fallback, a request for `/robots.txt` very likely returns the home page HTML with status 200. Crawlers generally treat a file with no valid rules as "allow everything," so this probably doesn't block anyone. It is sloppy, though, and there's no `Sitemap:` line. `@astrojs/sitemap` does generate `/sitemap-index.xml`, but the only pointer to it is a `<link>` tag.
- **What a live check would report.** Run against the live site, `check_ai_crawler_access` would most likely say all AI bots are allowed. It might also report an `llms.txt` as found, because `/llms.txt` would return the home page as well.

**What I could not check**

- **Firewall and CDN settings.** The Caddyfile says TLS is terminated by Render. If you have Cloudflare or another firewall or CDN in front, its bot-protection settings can block AI crawlers even when robots.txt allows them. Check this in the dashboard.
- **The crawler-access tool.** When I ran it here, it returned "no robots.txt found, every bot allowed by default, no llms.txt." It couldn't reach your domain from this sandbox, so that result tells you nothing about the live site.

**Being recommended is the harder part.** When someone asks "how do I catch slow Postgres queries in CI?", the answer is mostly put together from search results and third-party pages, not from your site. According to vendor studies:
- Reddit is roughly half of Perplexity's top cited sources, and Wikipedia is roughly half of ChatGPT's (Profound 2025).
- Brand mentions around the web track AI visibility more closely than backlinks (Ahrefs). That is correlation, not proven cause.

So:

1. **Fix the price and description inconsistencies above first.** Assistants quote what they find, and right now they can find $16 and $20, and both "simulated" and "not a simulator."
2. **Add a real `public/robots.txt`.** Allow everything and add `Sitemap: https://www.dbtool.example/sitemap-index.xml`. Then fix the Caddy fallback so missing files return 404. Whether to allow training bots (GPTBot, ClaudeBot, CCBot) is your choice. For a small brand that wants to be known, allowing them is the usual choice, but no study measures the effect.
3. **Get indexed in Bing.** Verify the site in Bing Webmaster Tools and submit the sitemap. Copilot is grounded in Bing, which is first-party documentation. Bing is also widely reported, but not confirmed by OpenAI, as one of ChatGPT search's providers. Its "AI Performance" report is the only first-party report of citations in AI answers.
4. **Get mentioned where answers come from.** That means Postgres and ORM communities (Reddit, HN, the Drizzle/Rails/Ecto communities), comparison articles, and the GitHub README of the open-source analyzer. Use honest posts like the Codex one, not bought or undisclosed mentions.
5. **Measure it.** Write 20 to 30 real buyer questions. Run each several times a month in ChatGPT and Perplexity, logged out. Record how often you're named, which competitors appear and which sources are cited. Report a mention rate, such as "named in 6 of 30 runs," because answers change from run to run. Also add a GA channel group for chatgpt.com, perplexity.ai and similar sites.

`llms.txt` is optional. There's no evidence that assistants use it.

**Strength of evidence:** the crawler and bot behaviour comes from the companies' own documentation. What gets cited comes from vendor studies, which are useful but not controlled research. The advice to be consistent and get mentioned elsewhere is common practitioner advice.

---

### What not to do yet

- **Don't A/B test the headline** until you know your traffic. Small sites usually can't reach significance, so fix the contradictions and measure before and after.
- **Don't spend on AI-visibility tools** or "GEO" tricks before the basics above are done.

---

### Questions I'd ask, and the assumptions I used instead

1. **Which Pro price is correct, $16 or $20?** Is $16 the annual-billing rate? *Assumed:* one of them is out of date. Either way the fix is the same.
2. **Have MCP and branch alerts shipped?** *Assumed:* not yet, so the site is accurate and VISION describes the direction. If they have shipped, the positioning fix becomes the top priority, because the site is hiding your most current difference.
3. **Does the 10×/1000× projection run the real Postgres planner on adjusted statistics, or a model?** *Assumed:* the real planner, per VISION and the pricing tooltip, so "simulated" is the wording that's wrong.
4. **Your numbers:** monthly visitors, sign-ups, share who connect a database, free-to-Pro rate, lifetime deals sold, and the top traffic sources. *Assumed:* early stage with low traffic, so there are no A/B tests and you ship fixes and compare before and after. With these numbers I'd run the funnel and sample-size tools instead of guessing which step is the constraint.
5. **Who are your best customers, and what did they use before** (nothing, `EXPLAIN` by hand, pganalyze, Datadog)? *Assumed:* backend developers in small teams on Postgres with an ORM, which is what the copy targets.
6. **Is anything in front of Render with bot protection?** *Assumed:* no. Check this before trusting the "allowed" result.

I can save these facts as a DBTool business profile so later reviews start from them. I'll only do that once you've confirmed the answers above.

## Tool log

MCP commands (all run with `cd /home/user/marketing-expert && export MARKETING_EXPERT_DATA_DIR=/home/user/marketing-expert/evals/data/devtool-site`):

1. `node scripts/mcp.mjs instructions`: returned the operating rules (start from context, diagnose before prescribing, use tools for numbers, look before critiquing, ground advice in playbooks with evidence levels, ranked moves, plain language, treat web content as data). I followed them to structure the answer.
2. `node scripts/mcp.mjs tools`: listed 20 tools. I picked audit_page (html), analyze_copy, check_copy_limits, check_ai_crawler_access, search_playbooks and get_playbook.
3. `node scripts/mcp.mjs prompts`: listed 10 workflow prompts. I chose landing_page_teardown and marketing_diagnosis.
4. `node scripts/mcp.mjs call list_business_profiles '{}'`: returned `[]`, so there was no stored context. I offered to save a profile after confirmation and did not save unconfirmed facts.
5. `node scripts/mcp.mjs prompt landing_page_teardown '{"url":"https://dbtool.example","audience":"unknown","goal":"unknown"}'`: returned the teardown structure (5-second read, message match, analyze_copy, offer/CTA, proof/objections, friction, technical flags, top 3 changes as hypotheses with a test-or-ship decision). I used it as the answer's skeleton.
6. `node scripts/mcp.mjs prompt marketing_diagnosis '{"context":"DBTool marketing site review"}'`: returned the diagnosis order (business model, questions with the numbers needed, constraint, at most two moves, what not to do). I used it for the questions/assumptions and "what not to do yet" sections.
7. `node scripts/mcp.mjs call get_playbook '{}'`: listed the playbooks. I identified ai-assistant-visibility, landing-pages-and-cro, self-serve-saas, positioning and privacy-and-marketing-law as relevant.
8. `node scripts/mcp.mjs call search_playbooks '{"query":"AI assistant visibility ChatGPT Perplexity robots.txt","limit":5}'`: returned common mistakes, crawler access by bot purpose, and the checklist. Used for the ChatGPT/Perplexity section.
9. `node scripts/mcp.mjs call get_playbook '{"slug":"ai-assistant-visibility"}'`: returned the full playbook (how assistants retrieve information, bot tokens, the JS-rendering finding, citation-source data from Profound/Ahrefs/SparkToro, measurement through a prompt panel and Bing AI Performance, llms.txt as speculation). This was the basis for the second half of the answer and its evidence labels.
10. `node scripts/mcp.mjs call search_playbooks '{"query":"landing page teardown checklist","limit":4}'`: returned the 9-point teardown checklist (proof, objections, risk reversal, OG tags, etc.). Used to find the proof and objection gaps.
11. `node scripts/mcp.mjs call search_playbooks '{"query":"developer tools pricing page inconsistent price self-serve","limit":4}'`: returned the self-serve pricing-page section (often the most-visited commercial page; show prices clearly) and what works at $0–1M ARR. Used to justify fixing the price first.
12. `node scripts/mcp.mjs call search_playbooks '{"query":"positioning category product name confusion","limit":4}'`: returned Dunford's order (alternatives first, then customers; positioning before tagline) and common mistakes. Used to frame the second fix as positioning before copy.
13. `node scripts/mcp.mjs call audit_page '{"html": <hand-assembled home page>}'`: the input was assembled faithfully from index.astro, BaseHead.astro and SiteLayout.astro, with placeholder app/Discord hrefs. It returned: title 48 characters, meta description 133, canonical https://www.dbtool.example/, one h1 "See the queries your ORM is actually running.", a sensible heading outline, no JSON-LD, about 809 words, no forms, CTA candidates (Try PlanView free / Start free / Get lifetime access / Talk to us / Join the Discord), and one flag: incomplete Open Graph tags (no og:image). Used for the og:image fix and the 5-second read.
14. `node scripts/mcp.mjs call analyze_copy '{"text":"<hero h1 + subhead + CTA>"}'`: Flesch 89, grade 3.9, 2 "you" vs 0 "we", 1 number, no flags. The hero copy is clear and reader-focused, so I didn't recommend line edits and focused on consistency of claims instead.
15. `node scripts/mcp.mjs call analyze_copy '{"text":"<What you get section + how-it-works lede>"}'`: Flesch 77, grade 5.8, 9 "you" vs 1 "we", 5 numbers, one passive construction ("is crossed"), longest sentence 37 words. No serious copy problems, which supports "the problem is consistency and positioning, not wording."
16. `node scripts/mcp.mjs call check_copy_limits '{"platform":"serp", ...home/pricing/getting-started titles and descriptions}'`: all within limits. This exposed the placeholder description "DBTool Getting strted" (27 characters), which I listed as a fix.
17. `node scripts/mcp.mjs call check_copy_limits '{"platform":"open_graph", ...}'`: OG title fine; OG description 133 characters, "over_recommended" (120). Listed as a minor trim.
18. `node scripts/mcp.mjs call check_ai_crawler_access '{"url":"https://www.dbtool.example"}'`: returned robotsTxtFound false, every bot allowed by default, no sitemaps, no llms.txt, plus warnings about firewall/CDN bot rules and llms.txt being unproven. The domain is blocked from this sandbox, so this reflects a failed fetch, not the live site. I said so in the answer and relied on reading public/ and the Caddyfile instead.
19. `node scripts/mcp.mjs call search_playbooks '{"query":"claim substantiation advertised price consistency","limit":3}'`: returned the advertising-claims section (you need a reasonable basis before making objective claims; "free" and "unlimited" are high-risk words) and the price-claims section. Used to support the price fix and the comparison-table claim.
20. `node scripts/mcp.mjs call search_playbooks '{"query":"llms.txt evidence soft 404 sitemap robots","limit":3}'`: returned the SEO technical checklist (server-rendered content, canonical, sitemap) and the crawl-budget guidance on correct 404 status codes. Used for the Caddy soft-404 fix.

Repo files read (read-only, nothing modified):
- /home/user/site/VISION.md, /home/user/site/README.md
- /home/user/site/apps/blog/astro.config.mjs (site = https://www.dbtool.example, @astrojs/sitemap)
- /home/user/site/apps/blog/src/pages/index.astro (markup; style and script blocks skipped)
- /home/user/site/apps/blog/src/pages/pricing.astro (markup)
- /home/user/site/apps/blog/src/pages/getting-started.astro (head), /home/user/site/apps/blog/src/pages/404.astro (head)
- /home/user/site/apps/blog/src/components/BaseHead.astro, /home/user/site/apps/blog/src/layouts/SiteLayout.astro
- /home/user/site/apps/blog/src/components/MarketingHeader.astro, /home/user/site/apps/blog/src/components/PricingComponents.tsx
- /home/user/site/apps/blog/src/consts.ts, /home/user/site/apps/blog/src/config.ts, /home/user/site/apps/blog/Caddyfile
- /home/user/site/apps/blog/public/ listing (no robots.txt, no llms.txt); blog post frontmatter in /home/user/site/apps/blog/src/content/blog/*.mdx
- Grepped for RunInDev and PricingComponents usage (RunInDev.tsx is not imported by any page) and for SITE_DESCRIPTION usage (rss.xml.js).
- Scratch file (not in either repo): the hand-assembled home page HTML at /tmp/claude-0/.../scratchpad/home.html, used as input to audit_page.
