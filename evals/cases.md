# Cases

Businesses (real, owned by the user of this project):
- **DBTool**: repo cloned at /home/user/site. Read VISION.md, docs/adr/ (titles and any that matter), README.md, apps/blog (marketing site source: landing components, pricing components). Website: dbtool.example (blocked from the sandbox; a local build may be provided).
- **GameX Companion**: repo cloned at /home/user/gamex-companion. Read VISION.md, CONTEXT.md, README.md, docs/adr/, research/plannersite-planner.md (a competitor). Website: companion.example (blocked; the app is a Vite single-page app in apps/app).

| id | business | user message (verbatim) |
|---|---|---|
| devtool-strategy | DBTool | "I'm building DBTool (repo attached). We're early and I'm technical, not a marketer. What should our marketing strategy be for the next 90 days?" |
| devtool-competition | DBTool | "pganalyze, Datadog Database Monitoring and AWS Performance Insights already exist, and coding agents like Claude Code and Cursor are getting better at SQL every month. How do we compete, and are we at risk of being a feature?" |
| devtool-site | DBTool | "Review our marketing site and tell me what to fix first. Also: can ChatGPT and Perplexity find us?" |
| companion-strategy | GameX Companion | "I'm building GameX Companion (repo attached), a GameX item database fed from Discord trade channels. How do I get people to use it?" |
| companion-risk | GameX Companion | "Is GameX Companion worth building seriously? What are the big risks, and could it ever make money?" |
| companion-site | GameX Companion | "Review companion.example for SEO and AI search. What should I fix?" |

## Cases for other business types (fictional, added 2026-10-05)

These businesses are invented, so their material can live in the repo: `evals/fixtures/<case>/` (ABOUT.md, NUMBERS.md, sometimes a page). The advisor reads only that folder. What a good answer should notice is in `evals/expectations.md`, for graders only.

| id | business | fixture | user message (verbatim) |
|---|---|---|---|
| ecom-ads | Fernhill Tea (online tea shop) | fernhill-tea | "Our Facebook ads stopped working. ROAS went from 2.1 to 1.4. What should we do?" |
| local-weekdays | Northside Paws (dog groomer) | northside-paws | "Fridays and Saturdays are full but Tuesday to Thursday are half empty. How do I fill them?" |
| app-downloads | Stillwater (iOS meditation app) | stillwater | "How do I get more downloads? I'm a solo developer with no marketing budget to speak of." |
| marketplace-city | Kitlend (camping gear rental) | kitlend | "Should we launch a third city before next season?" |
| services-growth | Ledgerline (bookkeeping firm) | ledgerline | "Almost all our clients come from referrals. How do we get clients beyond that?" |
