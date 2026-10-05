# marketing-expert-mcp

An MCP server that turns a coding or chat agent (Claude Code, Claude Desktop, Cursor and others) into a careful marketing advisor. Connect it, describe your business or point it at your repo, and ask a marketing question. The agent then:

- reads your own material first (repo, docs, site source) and checks what's actually shipped;
- runs calculators instead of doing arithmetic in its head;
- audits pages, sites and robots.txt instead of guessing what's there;
- grounds advice in 53 sourced playbooks, saying how strong the evidence is;
- recommends at most three moves, each with a cheapest test, a metric, a time box and a stop condition;
- checks its own draft (length, jargon, missing parts, evidence labels, quotes against your files) before answering.

The model already knows the textbook frameworks. This server covers what it is unreliable at: arithmetic, current platform rules, telling evidence from folklore, checking claims against your code, and keeping answers short and testable.

## Quick start

Needs Node 20 or later.

```bash
git clone https://github.com/veksen/marketing-expert.git
cd marketing-expert
npm install && npm run build
```

Connect it to your agent.

**Claude Code** (`-s user` makes it available in every project):

```bash
claude mcp add -s user marketing-expert -- node /absolute/path/to/marketing-expert/dist/index.js
```

Or install straight from GitHub (the `prepare` script builds it):

```bash
claude mcp add -s user marketing-expert -- npx -y github:veksen/marketing-expert
```

**Claude Desktop** (`claude_desktop_config.json`), **Cursor** (`~/.cursor/mcp.json`) and most other MCP clients use the same shape:

```json
{
  "mcpServers": {
    "marketing-expert": {
      "command": "node",
      "args": ["/absolute/path/to/marketing-expert/dist/index.js"],
      "env": { "MARKETING_EXPERT_DATA_DIR": "/absolute/path/to/profiles" }
    }
  }
}
```

**No MCP support?** Any agent with a shell can use the bundled command-line client:

```bash
node scripts/mcp.mjs instructions                 # the server's operating rules
node scripts/mcp.mjs tools                        # tools and their arguments
node scripts/mcp.mjs prompts                      # guided workflows
node scripts/mcp.mjs call market_size '{"segments":[...]}'
node scripts/mcp.mjs prompt marketing_strategy '{"business":"..."}'
```

After pulling updates, run `npm run build` again.

### Settings

| Environment variable | Default | Use |
|---|---|---|
| `MARKETING_EXPERT_DATA_DIR` | `~/.marketing-expert` | Where business profiles are stored. Use an absolute path; set one per project to keep businesses apart. |
| `MARKETING_EXPERT_ALLOW_PRIVATE` | off | Set to `1` to audit `localhost`, a staging server or anything on a private network. Off, those addresses are refused. |
| `MARKETING_EXPERT_CHROMIUM` | none | Path to a Chromium binary for `audit_page` with `render: true` (pages built by JavaScript). Also run `npm install playwright-core`. |

## How to use it

Ask in plain words. The server's instructions tell the agent which tools, prompts and playbooks to use.

- "Here's my business: … What should our marketing strategy be for the next 90 days?"
- "I'm building X (repo attached). How do I get my first ten paying customers?"
- "Our signups are flat. What's wrong?"
- "Review our marketing site and tell me what to fix first."
- "Crawl example.com and tell me what to fix for SEO and AI search."
- "Can ChatGPT and Perplexity find us?"
- "We get 3,000 visitors a day at 2.5% conversion. Can we A/B test a new headline?"
- "Is this market big enough to raise money?"
- "A big company just launched something like our product. What now?"

Tips:
- **Point it at your repo.** With a repo, the agent runs `scan_source` on your site, docs and decision records, and finds contradictions (two prices for one plan, "coming soon" on a shipped feature, data claims the docs disagree with). These are often the most useful findings.
- **Give it your numbers.** Without them it uses labelled assumptions and tells you what would change if they're wrong.
- **Save your business profile** ("save what you learned as a business profile") so the next conversation starts from the same facts.
- **Use the prompts directly** when you want a fixed process. In Claude Code they appear as slash commands, for example `/mcp__marketing-expert__marketing_strategy`.

### Prompts (guided workflows)

| Prompt | What it does |
|---|---|
| `marketing_diagnosis` | Finds the one constraint on growth before recommending anything |
| `marketing_strategy` | Ranked strategy: business-type playbook, economics, channels or (below ~10 paying customers) a first-ten plan, 90 days with dates and hours |
| `positioning_workshop` | April Dunford's positioning steps in order |
| `landing_page_teardown` | Evidence-based critique of a page, claims checked against your docs |
| `experiment_plan` | Turns an idea into a test that can give a trustworthy answer, or says not to test |
| `campaign_brief` | One-page brief that forces the decisions a campaign needs |
| `launch_plan` | Sizes a launch and plans before, during and after |
| `opportunity_assessment` | Go/no-go on an idea: base rates, market size, timing, risks |
| `competitive_strategy` | Positioning against incumbents and platforms; "feature, not a product" risk |
| `exit_options` | Realistic exits: likelihood, buyers, what founders receive |
| `technical_seo_review` | Measured SEO and AI-crawler review of a site from its source and a production build (text in `prompts/seo-site-review-v2.md`) |

### Tools

**Calculators**

| Tool | What it does |
|---|---|
| `ab_test_sample_size` | Visitors per arm and test duration; says when a test is too long to run and what effect you *can* detect |
| `ab_test_evaluate` | Significance, confidence intervals, sample-ratio mismatch, peeking warnings |
| `ab_test_sequential` | A test you can check as often as you like (mSPRT) |
| `ab_test_means_sample_size` / `ab_test_means_evaluate` | Same for revenue and other continuous metrics (Welch's t-test, outlier capping, variance reduction) |
| `unit_economics` | Lifetime value, LTV:CAC, payback, the most you can afford per customer (works without a CAC), minimum price, scenarios, lifetime-deal mode |
| `paid_media_math` | Break-even ROAS and CPA, max CPC, subscription mode |
| `funnel_analysis` | Step and cumulative conversion; inverse mode: how many leads you need for N customers |
| `market_size` | Bottom-up market size by segment, what you can realistically win, what a revenue target implies |
| `liquidity_math` | Marketplaces, alerts and saved searches: chance a request finds a match in time, listings needed |

Every calculator returns its inputs and headline result in one line (`citeAs`), and marks results built on assumed inputs.

**Audits of what's actually there**

| Tool | What it does |
|---|---|
| `audit_page` | Title, meta, headings, calls to action, forms, structured data, indexability; `render: true` shows how much content only exists after JavaScript |
| `crawl_site` | Up to 1,000 pages plus the sitemap: broken links, redirects, duplicates, noindex, orphans, canonicals, click depth, client-rendered pages |
| `check_ai_crawler_access` | Which AI bots robots.txt allows, grouped by training, AI search and user-triggered fetch |
| `scan_source` | In a local repo: claims about data handling, prices, availability, setup and licence, with `file:line`; site-vs-docs conflicts; build flags; decision records and their status; what billing code enforces |
| `analyze_copy` | Readability, vague and hype words, hedges, we-vs-you framing |
| `check_copy_limits` | Character limits for Google, Microsoft, Meta, LinkedIn, X, TikTok, search results, email, Open Graph |
| `build_utm_link` | Clean, consistent campaign links |

**Self-checks the agent runs on its own draft**

| Tool | What it does |
|---|---|
| `check_answer` | Word count against the budget, jargon used without explanation, missing parts (falsifier, open questions), moves without a test or stop, evidence labels stronger than the playbook or missing their caveats. Returns a fingerprint of the checked text |
| `match_small_bets` | Sorts 40 cheap marketing moves into fit now, fit later (and what is missing) and doesn't fit (and why), from the profile's traction, assets, audiences, product surfaces, revenue model and the things the business rules out |
| `verify_quotes` | Every quote and `file:line` citation checked against your repo: verbatim, wrong line, wrong file, or not found |

**Context**

| Tool | What it does |
|---|---|
| `list_business_profiles` / `get_business_profile` / `save_business_profile` | Your business facts, stored as JSON on your machine; flags missing fields and stale numbers |
| `search_playbooks` / `get_playbook` | Search and read the playbooks (also available as `marketing://playbook/{slug}` resources) |

## Where the data comes from

The server has no live data and no data about you except what you give it. Every answer is built from four things:

1. **Your input and your files.** What you tell it, the repo or folder you point it at, and the pages it fetches when you ask for an audit. Business profiles stay in `MARKETING_EXPERT_DATA_DIR` on your machine.
2. **Calculations.** Standard formulas run on your numbers (or on assumptions the agent labels as such). Nothing is looked up.
3. **Playbooks** (`knowledge/*.md`, 53 files). Opinionated, sourced guidance by business type (SaaS, developer tools, ecommerce, marketplaces, local services, consumer apps, community and hobby products, professional services, retail), channel (SEO and AI search, app store discovery, marketplace and registry listings, content, social, PR, events, video, paid, email, partnerships, referral, outbound), foundation (small bets, founder-led sales, activation and analytics, positioning, messaging, pricing, research, experimentation, measurement, launches, first customers, retention, law) and strategy (market sizing, startup risk, competing with incumbents, platform risk, exits).
4. **Research notes** (`research/*.md`, 32 files). The cited sources each playbook is built from, with access notes and open questions.

Every claim in a playbook carries an evidence tag, so the agent can tell you how much to trust it:

| Tag | Meaning |
|---|---|
| `[research]` | Peer-reviewed or controlled study |
| `[first-party]` | A platform's or company's own documentation or data about itself |
| `[practitioner]` | A rule from experienced operators, not tested |
| `[vendor]` | Data from a company with a commercial interest in the conclusion |
| `[rule-of-thumb]` | Widely repeated, no traceable basis |
| `our experiment` / `our coding` | Evidence produced while building this server (see below) |

Qualifiers go inside the bracket: `[research; RCT, n=337,724; one firm]`, `[first-party; snippet-only]`. The agent is told to copy them as written, and `check_answer` flags labels it upgrades or strips.

**How the research was done.** The research ran from a sandbox whose network policy blocked most primary sources (journal sites, arXiv, many company sites). So:
- Most figures come from search-result snippets of the cited source, not a full read. They are marked `snippet-only`; full reads are marked `read-full`.
- Every research pass was followed by an independent check of its citations, and claims that didn't hold were dropped or corrected and marked.
- Where the literature was thin (for example, go-to-market with zero customers), the server's own evidence was generated and labelled as such: a simulated test of how coding agents choose between MCP tools, a coded set of 31 developer-tool first-customer stories (survivors only, self-told), and a coding of how developers describe slow database queries in public threads.

Before quoting a number from a playbook as fact, check it against the primary source; the research notes say which ones need it most.

**How quality is measured.** `evals/` holds the method: real cases, a 10-item rubric (`evals/rubric.md`) and graders that check every claim against the business's own repo. In the latest round, 3 runs per case were each graded on their own against the rubric, scoring 17–19 out of 20. The spread within a case (about 2 points) is the noise level any change has to beat. The weakest areas are still keeping evidence qualifiers, focused moves, and plain language.

## Security

The audit tools fetch URLs the model chooses, and web pages can contain hidden instructions. So:
- Private, loopback, link-local (including cloud metadata), carrier-NAT and local IPv6 addresses are refused, including IPv4 addresses hidden inside IPv6 forms, on every redirect and, in render mode, for every request the page makes. `MARKETING_EXPERT_ALLOW_PRIVATE=1` turns this off for local testing.
- Downloads are capped (5 MB of HTML per page, 500 KB for robots.txt) so a page can't exhaust memory.
- Text from web pages and repos is labelled as untrusted, and the agent is told not to follow instructions found in it.
- DNS can change between the check and the request; this is a guard, not a firewall.
- `scan_source` and `verify_quotes` read files on your machine: only source, docs and config extensions, with size and count limits, never following symbolic links, never reading `.git` or credential folders (`.config`, `.docker`, `.ssh` and other dot-folders outside a short allowlist such as `.github`). They refuse the filesystem root. Point them at a repo, not your home folder.

## Development

```bash
npm run dev        # run from source
npm run build
npm test           # unit tests and an end-to-end stdio test (build first)
npm run typecheck
```

Render-mode tests are skipped unless `MARKETING_EXPERT_CHROMIUM` points at a Chromium binary (`npx playwright-core install chromium`).

Layout: `src/lib/` holds the tested logic; `src/server.ts` registers tools and the operating instructions; `src/prompts.ts` holds the workflows; `knowledge/` holds the playbooks (frontmatter: title, summary, tags; files starting with `_` aren't served); `research/` holds the cited notes; `evals/` holds the evaluation method.

Writing rule for everything the agent shows users: plain words for readers whose first language may not be English. Never "moat"; say what stops competitors.

## Not built yet and known weak spots

See [ROADMAP.md](ROADMAP.md) (and [VISION.md](VISION.md) for the principles and lessons behind the design). In short: no live data connectors yet (Google Analytics, Search Console, ad platforms, Stripe); evidence qualifiers and bundled moves still slip through the self-checks; and the playbooks outside developer tools haven't been evaluated yet.
