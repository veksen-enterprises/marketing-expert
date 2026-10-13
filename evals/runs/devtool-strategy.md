## Answer

**Short version:** for the next 90 days, marketing should mostly be you doing three things. First, find out who already gets value from DBTool and why. Second, make the website describe the product you have actually built. Third, test one channel that costs you time but almost no money. Paid ads, a big launch and a marketing hire should wait.

I read VISION.md, the README, CONTEXT.md, the ADR index, the homepage and pricing page source, the blog posts and the docs guides. I couldn't load the live site (web access is blocked here), so everything below comes from the repo. I also have none of your numbers yet. Questions and assumptions are at the end, and the advice changes if the assumptions are wrong. I've said where.

### 1. Which playbook applies

This is **self-serve SaaS** (also called product-led): a free plan, Pro at $16–20/month, no sales team. In this model, growth is usually held back by **whether people get value and keep using it (activation and retention)**, not by how many sign up. There is one sales-led element: the team plan on your radar, and the CI check, which mostly matters to teams. Ignore that for these 90 days. You can't sell a team plan that doesn't exist yet.

### 2. What the economics allow (calculated with the server's tools, using assumed numbers)

Assumptions: $16/month, 80% gross margin, 3–5% monthly churn, a placeholder customer acquisition cost (CAC) of $100.

- Lifetime gross profit per paying customer, counted over 36 months: **about $215 at 5% churn and $285 at 3% churn**.
- Gross profit in the first month: **$12.80**. Paying back a $100 CAC takes 9–10 months, adjusted for churn.
- Paid search check: an assumed $3 per click and a 2% click-to-paid rate implies **$150 per customer**. That is a very optimistic conversion rate for a freemium developer tool. The tool also warned that platform-reported returns are not proof the ads caused the sales.

**What this means:** at $16/month you can only afford channels where a customer costs close to nothing in cash. That means founder-written content, developer communities, integrations and directories, and word of mouth. **Paid ads are ruled out for now.** That would change if a team plan raised revenue per account a lot, or if your real churn turned out to be very low.

### 3. What is holding growth back (my diagnosis, and what would prove it wrong)

The repo gives me evidence of one problem. Your data would show a second.

**A. The website describes an older product.** I'm confident about this one. The evidence is in the repo:
- The homepage leads with **"PlanView"**, which CONTEXT.md calls the *legacy* name ("refer to the product overall as DBTool"). Visitors see two product names.
- VISION.md says the product exists to **"give the data layer the feedback loop the rest of the stack already has"**: check queries where the work happens (coding agent → CI → production), against production statistics. The homepage instead sells a **viewer for pg_stat_statements plus an index visualiser**.
- The **MCP server is live in the docs** (`/guides/mcp-server`, plus Guardrails hooks in `using-with-llms.md`). The homepage lists "MCP" under "On our radar", and the pricing page marks it "(soon)" as a Pro feature. For a product whose guiding principle is "stay readable to an agent", that is the most important thing to say, and the site says it doesn't exist yet.
- The hero code example is **Rails** (`orders_controller.rb`). Your source-mapping guides cover Drizzle, Prisma, TypeORM, MikroORM and EF Core, and VISION names Drizzle as the reference stack. Visitors who use those stacks don't see themselves on the page.
- Pro costs **$20 on the homepage and $16 on /pricing**. Fix this on day one. A wrong price costs trust, and stated prices are an advertising claim.
- "Read-only, we never write" is true, but the docs also say the analyzer **uploads schema, query text and statistics that contain real column values**. For a database tool, trust matters a lot. Link the "what leaves your database" section from the homepage before anyone else points out the difference.

The wording itself is fine. analyze_copy on the hero gave grade level 3.9, short sentences and no hype words. The **frame** is the problem, and better copy can't fix a frame that is out of date. The positioning playbook says to fix positioning before copy or channels when that's the case.

**B. Probably, retention or activation is still unknown.** I have no evidence either way. Before you pay to bring anyone in, you need to know what share of signups connect a database or add the CI action, and whether they still use it 4–8 weeks later. If very few stay, the 90 days should go to onboarding, not reach. *What would change my mind:* if you already have, say, 20+ teams with CI running for over a month, reach is the problem and you can move faster on §4.

### 4. The two moves that matter most

**Move 1 (weeks 1–4): talk to your users, then rewrite the homepage to match.** This rests on practitioner frameworks: April Dunford's positioning process and Rob Fitzpatrick's interview rules (*The Mom Test*). Neither has controlled-study evidence.

1. Pull a list of every account that connected a real database or ran the CI action. Contact the 10–15 most active, especially anyone who paid or bought the $100 lifetime plan.
2. Run 30-minute "switch" interviews. Ask about the past, not your idea: "When did a slow query last get to production? What did you do? What did you try before DBTool? What nearly stopped you setting it up?" Write down their exact words. 8–12 interviews usually show the main patterns. "Keep me posted" is a polite no. A real yes is time, an introduction, or money.
3. Use the answers to fill in the positioning components, in this order:
   - **Alternatives** (likely candidates: running EXPLAIN by hand, finding out in production, a monitoring tool, asking an LLM to guess)
   - **What only you do** (costing against production statistics before merge; a CI gate; an MCP server agents can call; deterministic results)
   - **Why it matters to them**
   - **Who cares most**
   - **Category**, last
4. Rewrite the homepage around the answer. Make the MCP server and CI check the main story and drop the PlanView branding from the hero. Show a Drizzle or Prisma example, link to "what leaves your database", and fix the price.

**My working hypothesis to test, not to ship as-is:** *For TypeScript teams on Postgres who write much of their data-layer code with AI agents, DBTool is a check that runs before merge. It tells the agent and the reviewer what a query will cost at production scale, using the real Postgres planner, not a guess.* This is a "small pond" choice: lead a narrow segment instead of fighting general database monitoring tools head-on. The playbook calls that the usual right choice for startups, though that is practitioner advice.

**What to measure:** the homepage's visitor-to-signup rate and signup-to-activated rate, before and after the change. **What would make me drop the hypothesis:** if interviewees describe the value as "I finally understand my production slowness" (monitoring) and not "it stops bad queries before merge" (prevention). Then position around production visibility instead.

Don't A/B test the homepage. At early-stage traffic you can't reach a reliable result. Make the change, then compare the 4 weeks before with the 4 weeks after, by channel.

**Move 2 (weeks 4–12): test one channel that costs only your time.** Founder-written technical posts, shared by hand in the places your users already read. This is practitioner advice from the content-marketing playbook: early on, a founder's own posts plus one owned format such as a newsletter, written from customer conversations, beat company-page content.

You already have the right format: **"Tracing Codex's 640TB/year SQLite writes"**. It takes a real, public performance problem and finds the cause with your tools. Make it a series, roughly every two weeks: take a well-known open-source app on Postgres with Prisma or Drizzle, run DBTool against it, and write up what the planner shows at 10× and 1000× the data. Each post:
- doubles as a product demo, because the reader sees exactly what the tool finds
- creates proof you can link from the homepage
- can be offered back to the project as a pull request with the index fix, which is good will and a way to be discovered.

Before you write each post, decide where it goes: r/PostgreSQL and r/node (disclose that you built the tool, and follow each subreddit's self-promotion rules), Hacker News, the Drizzle or Prisma Discords where allowed, X replies to Postgres people, and your own email list. Plan to spend about as much effort sharing a post as writing it. That split is a rule of thumb, not a measured figure.

**Cheapest test:** 5 posts over 10 weeks, about a day each. Cash cost is close to zero.

**What to measure:** activated signups per post, not page views. Add a required "How did you hear about us?" field at signup, because developers share tools in Slack and DMs where click tracking can't see it. **When to stop:** if 5 posts bring fewer than ~10 activated signups in total, the format or the places you share it are wrong. Switch to the alternative below before writing more.

### 5. Three-channel shortlist, with tests and when to stop

| Channel | Why it fits | Cheapest test | Metric / when to stop | Evidence |
|---|---|---|---|---|
| **1. Founder technical posts + communities** (Move 2) | A low-price product needs near-zero-cost channels; developers trust working examples over marketing claims | 5 posts in 10 weeks | Activated signups per post; stop below ~10 in total | Practitioner |
| **2. Being where coding agents find tools** | VISION says agents are first-class readers; the MCP server and Guardrails already exist | List the MCP server in the main MCP directories and registries; publish the companion skill and Guardrails as a one-command install; make the docs clear enough that an assistant answering "how do I check Postgres query performance in CI?" can describe you correctly | New MCP connections per week, and the share of those accounts that also add CI. Stop if after 6 weeks directory listings bring under ~5 connections a week | Practitioner logic. There is **no controlled evidence** that llms.txt or "AI visibility" tactics work: Google said it doesn't use llms.txt, and an Ahrefs crawl found 97% of llms.txt files received no requests. Clear docs and mentions across the web are the honest version of this |
| **3. Integration listings in the ecosystems you already support** | The GitHub Action and the Drizzle and Prisma guides are already built | Publish the Action to GitHub Marketplace with a clear first line, a screenshot of the PR comment, and setup steps. Ask the Drizzle maintainers whether a "query checks in CI" guide could link from their docs or community | Installs from the listing; stop at no meaningful installs after 8 weeks | Practitioner. Marketplace ranking depends on installs and reviews |

Run **only #1 and #2 together**. Add #3 only if one of them clearly fails. Spreading across five channels this early hides which one is working.

### 6. The 90 days in order (you alone, about half your time; the other half stays on product)

- **Weeks 1–2:**
  - Set up the funnel: visit → signup → database or CI connected → still active at week 4 → paid. Pick an *activation* event to start with. My guess is "first CI run with a finding" or "first MCP call against a real project". Then check it: it's the right event if users who reach it keep using the product noticeably more often.
  - Add the "How did you hear about us?" field.
  - Fix the $16/$20 price and the "MCP (soon)" labels.
  - Turn on failed-payment retries for Pro.
  - Book the interviews.
- **Weeks 3–4:** finish the interviews, write the one-paragraph positioning statement, rewrite the homepage hero and pricing page, and send the new homepage copy back to 3 of the people you interviewed to check it reads right.
- **Weeks 4–12:** one post every two weeks, plus the MCP directory work. Personally onboard every activated signup: message them and watch where they get stuck.
- **Week 8:** review. Which channel brings users who activate? Is week-4 retention good enough to justify more reach?
- **Weeks 12–13:** decide what to put more effort into. If the CI check retains best on teams, start the team plan work with interviewees as design partners: early users who get input in return for feedback and permission to be named.

### 7. Pricing: notes, not changes

- Free includes the playground, live queries, CI and statistics. Pro only adds **more than 2 projects**. Many small teams will never need a third project, so they may never have a reason to pay. The playbook's rule is that the free-plan limit should sit on whatever grows as customers get more value (practitioner advice). For you that is probably team use and CI gating, not project count. **Don't change pricing in these 90 days.** Use the interviews to learn what people would pay for, then decide.
- The $100 lifetime plan equals about 6 months of Pro, and it moves your keenest users out of recurring revenue. Cap the number of spots, as the page already says, and treat buyers as design partners.

### 8. What not to do yet, and why

- **Paid ads:** the numbers above don't allow it.
- **A large Product Hunt or Hacker News "launch":** a launch spike fades in days. Save it for after the new positioning and the MCP and CI story are live, as one planned Show HN with a working demo.
- **Targeting "every Postgres user" or "every ORM":** a broad message gets vaguer for everyone. Start with TypeScript ORMs on Postgres, since that's where your adapters and guides are.
- **Building out a Discord community:** an empty room looks dead. Answer people where they already are.
- **Hiring a marketer or agency:** there's nothing proven yet for them to scale.
- **Calling an index fix "proven" in marketing:** your own values say cost is the planner's estimate. Keep that honesty in the copy. It's also what the advertising-claims rules require.

**Competitive risk (from my own knowledge, not checked):** some Postgres hosts and monitoring tools already have index advisors or query insights. Supabase, PlanetScale and pganalyze are examples, but confirm what each offers today. A coding agent could also simply guess. To stay hard to copy, keep investing in what VISION already names: production statistics, the CI gate, history between runs, and deterministic answers an agent can act on. Check every quarter whether a host has shipped something similar.

### Questions I would ask you (I continued on the assumptions shown)

1. How many signups, how many connected a real database or CI, how many still active after a month, and how many paying (Pro and lifetime)? *Assumed: dozens to low hundreds of signups, few paying. If retention is already strong, move faster on channels.*
2. Is Pro $16 or $20, and what is your monthly churn? *Assumed $16, 3–5% churn, 80% gross margin. The planner instances you run may cost more than that.*
3. Who are your best current users: stack, team size, and do they use coding agents? *Assumed TypeScript ORM teams on Postgres.*
4. How much time can you give marketing, and do you have any budget? *Assumed you alone at about half your time, under $500/month.*
5. What is the 90-day goal: paying customers, activated teams, or proof for fundraising? *Assumed activated teams with CI running, then paying customers.*
6. What is your traffic, and where does it come from today? *Unknown, so no A/B testing is planned.*

If you confirm the facts above, I can save them as a business profile so later answers start from your real numbers.

## Tool log

MCP commands (all run with `cd /home/user/marketing-expert && export MARKETING_EXPERT_DATA_DIR=.../evals/data/devtool-strategy`):

1. `node scripts/mcp.mjs instructions`: operating rules (context first, diagnose before prescribing, use tools for numbers, ground in playbooks with evidence labels, rank 1–2 moves, plain language). Followed throughout.
2. `node scripts/mcp.mjs tools`: listed 20 tools; chose list_business_profiles, get_playbook, search_playbooks, unit_economics, paid_media_math, analyze_copy, check_ai_crawler_access.
3. `node scripts/mcp.mjs prompts`: listed 10 workflow prompts; chose marketing_strategy and marketing_diagnosis.
4. `call list_business_profiles '{}'`: returned `[]` (no saved profile). Worked from the repo; offered to save a profile at the end.
5. `prompt marketing_strategy '{"business":"DBTool (see repo)","goal":"90-day marketing strategy","budget":"unknown"}'`: 8-step workflow (context, business-type playbook, constraint, economics, 3 channels, 90-day plan, evidence, what not to do). Used as the structure of the answer.
6. `call get_playbook '{}'`: listed all playbook slugs; picked self-serve-saas, positioning, channel-strategy.
7. `prompt marketing_diagnosis '{"context":"DBTool, early-stage Postgres query analysis dev tool, solo technical founder"}'`: diagnosis order (positioning, reach, conversion, retention, economics); ask questions, state assumptions. Used for §3 and the question list.
8. `call get_playbook '{"slug":"self-serve-saas"}'`: activation/retention as the usual constraint, defining activation from data, free-limit-on-value-metric, $0–1M ARR stage advice, dunning. Used for §1, §6, §7.
9. `call get_playbook '{"slug":"positioning"}'` and `'{"slug":"channel-strategy"}'`: Dunford's components and order, "big fish small pond", fix positioning before copy; Balfour channel-model fit (low ARPU needs low-CAC channels), Bullseye, one channel at a time, self-reported attribution. Used for Move 1, §2 conclusion, §5.
10. `call search_playbooks` × 5 ("founder-led content developer audience", "Hacker News Reddit developer community launch", "open source developer tools GitHub marketing", "AI assistant visibility developer docs llms.txt", "integration partnerships ORM marketplace GitHub Marketplace"): content-marketing founder-led and distribution sections, community seeding and Reddit norms, GEO/llms.txt evidence (no controlled evidence; Ahrefs 97% zero requests), integration marketplace and pre-PMF partnership advice. The OSS query returned nothing relevant. Used for Moves 2 and §5 rows 2–3.
11. `call search_playbooks` × 5 ("lifetime deal pricing early adopters", "customer interviews Mom Test switch interview", "launch tier small launch Product Hunt Hacker News", "platform ships your product as a feature warning signs", "freemium free plan limit value metric developer"): Mom Test and switch-interview script (8–12 interviews), launch tiers and post-launch fade, platform-risk questions, pricing mistakes. No lifetime-deal guidance found, so my own reasoning in §7. Used for Move 1, §7, §8.
12. `call unit_economics '{"arpaMonthly":16,"grossMargin":0.8,"monthlyChurn":0.05,"cac":100,"horizonMonths":36}'`: LTV $256 simple / $215.61 bounded, payback 7.8 months simple / 10 churn-adjusted, no warnings. Used in §2.
13. `call unit_economics` (same, monthlyChurn 0.03): LTV $426.67 simple / $284.15 bounded, payback 9 months churn-adjusted. Used in §2.
14. `call paid_media_math '{"aov":16,"margin":0.8,"ltvGrossProfit":205,"cvr":0.02,"cpc":3}'`: first-order break-even CPA $12.80, implied CPA $150, warnings about attributed vs incremental results and financing payback. Used in §2 to rule out paid ads.
15. `call search_playbooks '{"query":"claim substantiation comparative advertising","limit":2}'`: FTC/ASA reasonable-basis rules, comparative-advertising conditions. Used for the price-consistency, data-upload and "proven" points.
16. `call analyze_copy` on the homepage hero text: grade 3.9, Flesch 89, no hype or vague flags, one number. Used to argue the problem is the frame, not the wording.
17. `call check_ai_crawler_access '{"url":"https://dbtool.example"}'`: robotsTxtFound false and all bots "allowed". Probably because outbound web access is blocked in this environment, so I did not draw conclusions from it. audit_page was not run for the same reason.

Repo files read (/home/user/site, read-only):
- VISION.md, README.md, CONTEXT.md (header and the MCP Server / PlanView legacy sections, plus a grep for MCP/ORM terms), docs/adr/README.md (decision index), `git log` (shallow clone, one commit visible)
- apps/blog/src/pages/index.astro (homepage), apps/blog/src/pages/pricing.astro, apps/blog/src/components/PricingComponents.tsx, front matter and openings of all 6 posts in apps/blog/src/content/blog/, grep of apps/blog/astro.config.mjs and src/config.ts for the site URL
- apps/docs: file list, guides/introduction.md, guides/using-with-llms.md, guides/mcp-server.md (opening), guides directory listing (sqlcommenter guides for Drizzle, Prisma, TypeORM, MikroORM, EF Core)
