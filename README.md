# marketing-expert

An MCP server that turns a coding or chat agent (Claude Code, Claude Desktop, Cursor and others) into a careful marketing advisor for small products.

The model already knows the textbook frameworks. This server covers what it is unreliable at: arithmetic, current platform rules, telling evidence from folklore, checking claims against your code, and keeping answers short and testable. With it, the agent:

- reads your own material first (repo, docs, site source) and checks what's actually shipped;
- runs calculators instead of doing arithmetic in its head;
- audits pages, sites and robots.txt instead of guessing what's there;
- grounds advice in sourced playbooks, saying how strong the evidence is;
- recommends at most three moves, each with a cheapest test, a metric, a time box and a stop condition;
- checks its own draft (length, jargon, missing parts, evidence labels, quotes against your files) before answering.

## Example

> We get 3,000 visitors a day at 2.5% conversion. Can we A/B test a new headline?

Instead of estimating, the agent runs the calculator and quotes its result line:

```text
ab_test_sample_size(baseline 2.5%, MDE +10% relative, alpha 0.05, power 0.8, 3,000 visitors/day) -> 64,199 per arm, 128,398 total, 43 days
```

Then it answers, in short: yes, but only for a large change. Detecting a 10% lift (2.5% to 2.75%) takes 43 days, so plan 7 whole weeks. In two weeks you can only detect a lift of 20% or more (16,792 visitors per version, 12 days). Fix the sample size before you start and check the result once: checking every day and stopping at the first good number makes false winners far more likely (5 looks give about 14% false positives instead of 5%).

The result line is the tool's exact output, and a test re-runs it (`test/readme.test.ts`). The answer around it is shortened.

## Install

Needs Node 20 or later.

**Claude Code.** Install the plugin. It brings the server and a `get-started` skill:

```
/plugin install marketing-expert --marketplace veksen-enterprises/marketing-expert
```

Then, in a product's repo, run `/marketing-expert:get-started`. The agent reads the repo, sums up the product, offers the directions it can take (a first strategy, small bets, positioning, a page teardown, the economics…), and asks a few profile questions the repo can't answer. A marked guess is fine. It then saves the profile and takes the direction you pick. The default is a first strategy, saved to `marketing/strategy-YYYY-MM-DD.md`.

**Any agent: paste this** in a session opened at your product's repo:

```text
Set up the marketing-expert MCP server for the product in this repo.
1. If its tools (get_playbook, scan_source, check_answer) aren't available, install it, tell me to restart the session, and stop.
   Claude Code: claude mcp add -s user marketing-expert -- npx -y github:veksen-enterprises/marketing-expert
   Other clients: add a server named marketing-expert running "npx -y github:veksen-enterprises/marketing-expert".
2. Then read and follow https://raw.githubusercontent.com/veksen-enterprises/marketing-expert/main/skills/get-started/SKILL.md
```

**Other MCP clients** (Claude Desktop's `claude_desktop_config.json`, Cursor's `~/.cursor/mcp.json` and most others):

```json
{
  "mcpServers": {
    "marketing-expert": {
      "command": "npx",
      "args": ["-y", "github:veksen-enterprises/marketing-expert"]
    }
  }
}
```

Clients without Claude Code skills get the same first-run workflow as the `get_started` prompt.

### Settings

Set these as environment variables on the server (an `"env"` object next to `"args"` in the JSON above).

| Variable | Default | Use |
|---|---|---|
| `MARKETING_EXPERT_DATA_DIR` | `~/.marketing-expert` | Where business profiles are stored. Use an absolute path; set one per project to keep businesses apart. |
| `MARKETING_EXPERT_ALLOW_PRIVATE` | off | Set to `1` to audit `localhost`, a staging server or anything on a private network. Off, those addresses are refused. |
| `MARKETING_EXPERT_CHROMIUM` | none | Path to a Chromium binary for `audit_page` with `render: true` (pages built by JavaScript). Also run `npm install playwright-core`. |

## Check it works

Ask the agent: "Use marketing-expert's ab_test_sample_size for 2.5% conversion, a 10% lift and 3,000 visitors a day." The answer should include `64,199 per arm, 128,398 total, 43 days`.

If it doesn't:
- **No marketing-expert tools.** Restart the client after installing; MCP servers load at start. In Claude Code, `/mcp` lists the server and its state.
- **The server fails to start.** Check `node --version` is 20 or later.
- **The first start is slow.** The first `npx` run downloads and builds the server, which took about 20 seconds in our test (2026-10-27). Later starts use the cache.

## What it does

Ask in plain words; the server's instructions tell the agent which tools, prompts and playbooks to use. The agent gets the full reference from the server itself (`node scripts/mcp.mjs tools` shows the same list).

| Question | Tools |
|---|---|
| Can our traffic support this test? Did the test win? | `ab_test_sample_size`, `ab_test_evaluate`, `ab_test_sequential`, `ab_test_means_sample_size`, `ab_test_means_evaluate` |
| What is a customer worth, and what can we pay to get one? | `unit_economics`, `paid_media_math` |
| How many leads do we need? Is the market big enough? | `funnel_analysis`, `market_size` |
| Will a request on our marketplace or alert find a match in time? | `liquidity_math` |
| What does this page or site actually show to people, Google and AI crawlers? | `audit_page`, `crawl_site`, `check_ai_crawler_access` |
| Do our site, docs and code agree on prices, data handling and what's shipped? | `scan_source` |
| Is this copy clear, and does it fit the ad or search limits? | `analyze_copy`, `check_copy_limits`, `build_utm_link` |
| Which cheap marketing moves fit this business now? | `match_small_bets` |
| Is the agent's draft short, plain, testable, and true to its sources? | `check_answer`, `verify_quotes` |
| What do we already know about this business, and what does the evidence say? | `list_business_profiles`, `get_business_profile`, `save_business_profile`, `search_playbooks`, `get_playbook`, `learn_more` |

Calculators return their inputs and headline result in one line (`citeAs`, as in the example) and mark results built on assumed inputs.

Guided workflows, as prompts (in Claude Code they are slash commands such as `/mcp__marketing-expert__marketing_strategy`): `get_started`, `marketing_diagnosis`, `marketing_strategy`, `marketing_ideas`, `positioning_workshop`, `landing_page_teardown`, `experiment_plan`, `campaign_brief`, `launch_plan`, `opportunity_assessment`, `competitive_strategy`, `exit_options`, `technical_seo_review`.

Tips:
- **Point it at your repo.** The agent runs `scan_source` on your site, docs and decision records, and finds contradictions (two prices for one plan, "coming soon" on a shipped feature). These are often the most useful findings.
- **Give it your numbers.** Without them it uses labelled assumptions and says what would change if they're wrong.
- **Save your business profile** so the next conversation starts from the same facts. Save the moves you take on too: once a move passes its check date, the next run asks what happened before advising.

## Where answers come from

The server has no live data and no data about you except what you give it. Every answer is built from four things:

1. **Your input and your files.** What you tell it, the repo or folder you point it at, and the pages it fetches when you ask for an audit.
2. **Calculations.** Standard formulas run on your numbers, or on assumptions the agent labels as such. Nothing is looked up.
3. **Playbooks** (`knowledge/*.md`). Opinionated, sourced guidance by business type (SaaS, developer tools, ecommerce, marketplaces, local services, consumer apps and more), by channel (SEO and AI search, content, social, PR, paid, email, outbound and more), by foundation (positioning, pricing, experimentation, first customers, retention, marketing law in several markets) and by strategy (market sizing, competing with incumbents, platform risk, exits).
4. **Research notes** (`research/*.md`). The cited sources each playbook is built from, with access notes and open questions.

Every claim in a playbook carries an evidence tag, so the agent can tell you how much to trust it:

| Tag | Meaning |
|---|---|
| `[research]` | Peer-reviewed or controlled study |
| `[first-party]` | A platform's or company's own documentation or data about itself |
| `[practitioner]` | A rule from experienced operators, not tested |
| `[vendor]` | Data from a company with a commercial interest in the conclusion |
| `[rule-of-thumb]` | Widely repeated, no traceable basis |
| `our experiment` / `our coding` | Evidence produced while building this server |

Qualifiers go inside the bracket: `[research; RCT, n=337,724; one firm]`, `[first-party; snippet-only]`. The agent is told to copy them as written, and `check_answer` flags labels it upgrades or strips.

**How the research was done.** The research ran from a sandbox whose network policy blocked most primary sources (journal sites, arXiv, many company sites). So:
- Most figures come from search-result snippets of the cited source, not a full read. They are marked `snippet-only`; full reads are marked `read-full`.
- Every research pass was followed by an independent check of its citations. Claims that didn't hold were dropped or corrected, and marked.
- Where the literature was thin (for example, go-to-market with zero customers), the server's own evidence was generated and labelled as such: a simulated test of how coding agents choose between MCP tools, a coded set of developer-tool first-customer stories (survivors only, self-told), and a coding of how developers describe slow database queries in public threads.

Before quoting a number from a playbook as fact, check it against the primary source; the research notes say which ones need it most.

**How quality is measured.** `evals/` holds real cases, a rubric and graders that check every claim against the business's own repo. A change counts only if blind, paired grading of old and new runs shows a difference whose confidence interval excludes zero (`evals/README.md`).

## Safety

What it writes: only `save_business_profile` writes, as JSON files in `MARKETING_EXPERT_DATA_DIR`. The `get_started` workflow asks the agent to save a strategy file in your repo; the agent writes that, not the server. Nothing is sent anywhere except requests to the sites you ask it to audit.

The audit tools fetch URLs the model chooses, and web pages can contain hidden instructions. So:
- Private, loopback, link-local (including cloud metadata), carrier-NAT and local IPv6 addresses are refused, including IPv4 addresses hidden inside IPv6 forms, on every redirect and, in render mode, for every request the page makes. `MARKETING_EXPERT_ALLOW_PRIVATE=1` turns this off for local testing.
- Downloads are capped (5 MB of HTML per page, 500 KB for robots.txt) so a page can't exhaust memory.
- Text from web pages and repos is labelled as untrusted, and the agent is told not to follow instructions found in it. That label is an instruction to the model, not a guarantee.
- DNS can change between the check and the request; this is a guard, not a firewall.
- `scan_source` and `verify_quotes` read files on your machine: only source, docs and config extensions, with size and count limits, never following symbolic links, never reading `.git` or credential folders (`.config`, `.docker`, `.ssh` and other dot-folders outside a short allowlist such as `.github`). They refuse the filesystem root. Point them at a repo, not your home folder.

## Limits

- No live data connectors yet (Google Analytics, Search Console, ad platforms, Stripe): numbers come from you.
- Evidence qualifiers and moves that bundle two actions still slip past the self-checks.
- The playbooks outside developer tools haven't been evaluated yet.

More in [ROADMAP.md](ROADMAP.md); the principles and lessons behind the design are in [VISION.md](VISION.md).

## Development

```bash
git clone https://github.com/veksen-enterprises/marketing-expert.git
cd marketing-expert
npm install && npm run build
npm test           # build first: the end-to-end test runs dist/
```

To run your local copy, point the client at `node /absolute/path/to/marketing-expert/dist/index.js` instead of `npx`. Run `npm run build` again after pulling.

**No MCP support?** Any agent with a shell can use the bundled command-line client from a clone:

```bash
node scripts/mcp.mjs instructions                 # the server's operating rules
node scripts/mcp.mjs tools                        # tools and their arguments
node scripts/mcp.mjs call market_size '{"segments":[...]}'
node scripts/mcp.mjs prompt marketing_strategy '{"business":"..."}'
```

Playbooks are Markdown files in `knowledge/` with `title`, `summary` and `tags` frontmatter. Repo layout, writing rules and how to evaluate a change are in [CLAUDE.md](CLAUDE.md).
