# marketing-expert-mcp

An MCP server that gives an LLM the parts of marketing expertise it lacks on its own:

- **Calculators** for the numbers models get wrong in their heads: A/B test sample size and significance (with SRM and peeking checks), LTV/CAC/payback, paid-media break-even, funnel maths.
- **Audits** of what is actually on a page or in a piece of copy, so critique starts from facts: landing-page extraction, copy signals, platform character limits, UTM hygiene.
- **Playbooks**: 19 opinionated, sourced Markdown playbooks covering marketing and business strategy (market sizing, startup risk, competing with incumbents, platform and "feature, not a product" risk, competitive analysis, acquisitions and exits). Each claim is tagged by evidence strength (research / first-party / practitioner / vendor / rule-of-thumb).
- **Prompts** that fix the order of thinking (diagnose before prescribing, positioning before copy, power analysis before testing).
- **Server instructions** that set the operating rules for the model: ask for numbers, use the tools, state evidence quality, recommend at most a couple of ranked moves.

The model already knows the textbook frameworks. This server doesn't repeat them; it covers what the model is unreliable at (arithmetic, current platform rules, post-2024 changes, telling evidence from folklore) and pushes it toward a diagnostic workflow.

## Tools

| Tool | What it does |
|---|---|
| `ab_test_sample_size` | Per-arm sample for a two-proportion test; duration from daily traffic; flags tests too long to run and gives the MDE you *can* detect in 4 weeks |
| `ab_test_evaluate` | z-test, p-value, CI on absolute and relative lift, P(variant > control), sample ratio mismatch, peeking / Twyman's law warnings |
| `ab_test_means_sample_size` / `ab_test_means_evaluate` | Same for revenue per visitor, order value and other continuous metrics: Welch's t-test from raw values or summary stats, optional outlier capping at a percentile, skew warnings, CUPED-style variance reduction in sample size |
| `list_business_profiles` / `get_business_profile` / `save_business_profile` | Persistent business context (product, best-fit customers, alternatives, differentiators, pricing, dated metrics, voice) stored as JSON in `~/.marketing-expert/profiles/` (override with `MARKETING_EXPERT_DATA_DIR`). Reports missing fields and stale metrics. Also exposed as `marketing://profile/{name}` |
| `unit_economics` | LTV (simple and horizon-bounded), LTV:CAC, simple and churn-adjusted CAC payback, with warnings where the formulas mislead |
| `paid_media_math` | Break-even ROAS/CPA, max CPC, implied CPA/ROAS from CPC or CPM+CTR, budget projection, verdict |
| `market_size` | Bottom-up TAM/SAM by segment, obtainable market bounded by sales capacity / acquisition budget with churn, top-down cross-check, and the share of the market a revenue target requires |
| `funnel_analysis` | Step/cumulative rates, losses, cost per stage, the effect of improving any step |
| `analyze_copy` | Readability, sentence length, vague/hype terms, hedges, passive voice, we-vs-you framing, missing numbers |
| `check_copy_limits` | Google RSA / PMax / Demand Gen, Microsoft, Meta, LinkedIn, X, TikTok, SERP, email, Open Graph limits (CJK = 2 for Google, URLs = 23 on X). Unverified limits warn instead of failing |
| `build_utm_link` | Tagged URL; lowercases, flags media that break GA4 channel grouping |
| `audit_page` | Fetch a URL or take HTML; returns title/meta/headings/lead text/CTAs/forms/OG/JSON-LD/indexability plus objective flags. `render: true` runs the page in headless Chromium and reports how much content exists only after JavaScript (needs optional `playwright-core`; set `MARKETING_EXPERT_CHROMIUM` to a Chromium binary) |
| `search_playbooks` / `get_playbook` | BM25 search over playbook sections / full playbook. Also exposed as resources at `marketing://playbook/{slug}` |

Prompts: `marketing_diagnosis`, `positioning_workshop`, `landing_page_teardown`, `experiment_plan`, `campaign_brief`, `launch_plan`, `opportunity_assessment`, `competitive_strategy`, `exit_options`.

Playbooks:
- Marketing: positioning, messaging-and-copy, customer-research, brand-and-demand, channel-strategy, pricing, landing-pages-and-cro, experimentation, metrics-and-measurement, seo-and-ai-search, email-and-lifecycle, paid-acquisition, launches-and-gtm.
- Strategy: market-sizing-and-timing, startup-risk-and-opportunity, competing-with-incumbents, platform-and-feature-risk, competitive-analysis, acquisition-and-exits.

Writing rule: plain vocabulary for readers whose first language may not be English. No "moat"; say "defensibility" or describe what stops competitors.

## Install

```bash
npm install
npm run build
```

Claude Code:

```bash
claude mcp add marketing-expert -- node /absolute/path/to/marketing-expert/dist/index.js
```

Claude Desktop (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "marketing-expert": {
      "command": "node",
      "args": ["/absolute/path/to/marketing-expert/dist/index.js"]
    }
  }
}
```

## Development

```bash
npm run dev        # run from source with tsx
npm test           # unit tests + stdio end-to-end test (build first for e2e)
npm run typecheck
```

Layout: `src/lib/*` holds pure, tested logic; `src/server.ts` registers tools/resources; `src/prompts.ts` holds workflows; `knowledge/*.md` holds playbooks (frontmatter: title, summary, tags; `_`-prefixed files aren't served); `research/*.md` holds the cited research notes the playbooks are built from.

## Research provenance and known gaps

`research/` holds the source notes, one file per domain, with citations and an "open questions" list. The research was done from a sandbox whose network policy blocked most primary domains (Google support, NN/g, Baymard, IPA, arXiv, journal sites). As a result:

- Most figures were taken from search-result snippets of the cited primary URL, not from reading the full page. They are marked `[snippet-only]` or `[verify]` in the research notes.
- Read in full: web.dev Core Web Vitals text (via GitHub); the Meridian, Robyn, GeoLift and PyMC-Marketing repos; the Gordon et al. (2019) working paper; Chandy & Tellis (2000); Microsoft FY24 Q1 earnings call; CB Insights 2016 post-mortems; and, via copies on GitHub, essays by Paul Graham, Marc Andreessen and Bill Gurley, Bill Gross's TED transcript, Sequoia's and YC's guides, Zero to One chapters, and Uber/Apple releases.
- The strategy research hit the session's 200-web-search limit; topics not reached are listed under "Open questions" in each research file (e.g. EU DMA details, 2025 AI license-and-hire terms, Startup Genome, Kauffman).
- Meta ad text hard limits and the LinkedIn intro-text maximum are unverified; the tool treats them as warnings.

Before anyone quotes a number from a playbook as fact, re-verify it against the primary source; the research notes say which ones need it most.

## Not built yet

- Live data connectors (GA4, Search Console, ad platforms) so diagnosis runs on real numbers.
- Sequential (always-valid) testing for teams that monitor tests continuously.
