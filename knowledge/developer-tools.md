---
title: Developer tools and infrastructure playbook
summary: Marketing for developer tools, APIs, CLIs, CI integrations, database tooling and MCP servers; who uses vs who pays, bottom-up adoption and when to add sales, open source licensing as distribution (open core, source-available, what license changes cost), docs and quickstarts, developer channels, AI coding agents as users, enterprise upgrade path, developer trust, metrics, and what works by stage.
tags: developer tools, devtools, open source, devrel, api, cli, mcp, hacker news, docs, bottom-up, sdk, infrastructure, open core, source-available, license change, github stars, show hn, quickstart, time to first value, changelog, integration marketplace, github marketplace, mcp registry, ai agents, tool descriptions, self-hosting, sso, usage-based pricing, activation
---

Use this playbook when your users are developers (or the AI coding agents working for them) and the product is something they install, call or connect: an API, SDK, CLI, CI integration, database tool or MCP server. It builds on self-serve-saas (activation, freemium, product-qualified leads) and b2b-saas-sales-led (larger deals) and covers only what differs for developers.

## Who uses vs who pays

_In short:_ Developers adopt a tool and someone else pays later, so let developers try it in minutes and give the buyer pricing, security answers and proof it scales; add sales only when teams and limits appear.

- **The developer adopts; someone else pays.** A developer tries it on one service; if it works, the team lead or platform team pays as usage grows, with security and procurement joining larger deals. Serve both: the developer must try it in minutes; the buyer needs pricing, security answers and proof it scales.
- **GitLab made this explicit** with "buyer-based open core": features go into tiers by *who would buy them* — individual contributor (free), manager or director (Premium), executive (Ultimate) — priced per user. [first-party] It is a useful test for any feature: who asks for it, and who signs for it?
- **Bottom-up adoption** (usage spreads from individuals to teams before any sale) is the default. A "contact sales" wall in front of a trial loses most developers.
- **When to add sales:** when several users from one company appear, when accounts hit plan limits, or when security reviews start blocking upgrades. Use product-qualified leads and product-led sales as in self-serve-saas; move to the sales-led motion in b2b-saas-sales-led only for accounts large enough to pay for it. Sales should offer help (security review, invoicing, architecture review), not cold pitches to developers who signed up. [practitioner]

## Open source as distribution

_In short:_ Open source speeds adoption but lets others, including cloud giants, sell your product, so pick the licence before a community forms; changing it later spawned rival forks. GitHub stars are weak signals.

Open source lowers the cost of trying, lets developers audit the code, and spreads through package managers. It also lets anyone, including cloud providers, sell your product as a service. The license decides who can.

- **Fully open** (MIT, Apache 2.0, BSD): widest adoption; anyone can host it. Earn from a hosted service, support or separate products.
- **Open core**: an open base plus paid features (usually team and enterprise features). GitLab is the public example. The hard part is the line: if the free part is too weak, adoption stalls; if too strong, nobody upgrades. Put features used by individuals in the free part and features bought by managers or security teams in paid tiers. [first-party; practitioner]
- **Copyleft** (AGPL): anyone offering it as a network service must share changes; this deters some competitors and some corporate users.
- **Source-available** (BSL, SSPL, RSAL, Elastic License): code is visible but competing commercial use is restricted. These are not open-source licenses under the OSI definition.

**What license changes cost.** Three public cases followed the same pattern [press; first-party]:
- **Elastic (2021):** Apache 2.0 → SSPL/Elastic License. AWS forked it as OpenSearch (Apache 2.0), now under a Linux Foundation project. Elastic added AGPL as an option in August 2024.
- **HashiCorp (August 2023):** Terraform moved from MPL 2.0 to BSL. Vendors that built on Terraform forked it as OpenTofu, which joined the Linux Foundation within weeks and CNCF in April 2025. IBM completed its acquisition of HashiCorp in February 2025.
- **Redis (March 2024):** BSD → RSAL/SSPL. Contributors and cloud providers forked it as Valkey under the Linux Foundation within days. AWS prices its Valkey service below its Redis service [first-party via secondary, not re-verified]. Redis added AGPL with Redis 8 in May 2025 and says it saw "record growth" after the change [first-party claim; not independently measured].

A 2024 study of these cases found the originals' code came almost entirely from vendor employees, while the forks drew contributors from many companies [research, preprint]. Lessons: a license change can create a well-funded competitor built on your code, which then owns the "truly open" story; two of the three companies later partly reversed. Choose the license with hosting competitors in mind *before* a community forms. Effects on revenue have not been measured independently.

**GitHub stars are a weak signal.** A Carnegie Mellon / NC State study (StarScout, 2019–2024 data, ICSE 2026) flagged about 6 million suspected fake stars; after stricter filtering, about 3.8 million fake stars on 18,617 repositories, mostly promoting short-lived phishing or malware repositories. Fake stars helped for less than two months and then became a liability [research]. Track weekly active projects and contributors instead, and never buy stars.

## Docs are the main marketing surface

_In short:_ For developers, the docs are the product evaluation, so cut time to first value (the minutes until a first success) with a one-page, copy-paste quickstart tested on a clean machine.

- In Stack Overflow's 2025 survey, technical documentation was the resource respondents used most to learn to code in the past year (68%; AI tools 44%) [first-party survey; self-selected sample]. For developers, the docs *are* the product evaluation.
- **Time to first value**: the time from landing on the docs to a first successful run (an API response, a passing CI check, a query returned). Measure it and cut it. "Time to first API call" is a common practitioner version; Stripe's one-page quickstarts and in-docs request runner are the standard example [practitioner].
- **Quickstart rules** [practitioner]: one page; copy-paste commands; authentication inside it, not on another page; a real result at the end. Test it on a clean machine every release.
- **Examples repository**: runnable apps for the top use cases; developers and agents copy these.
- **Reference docs** generated from the code or API spec so they don't drift; document errors and limits.
- **Changelog**: dated and specific, with breaking changes and migration steps; it shows the product is alive.
- Docs also rank and get cited by AI assistants; serve them as HTML (see ai-assistant-visibility).

## Developer channels

_In short:_ Reach developers where they already are, through Show HN, communities, honest technical posts, talks, integration marketplaces and package registries; expect spikes from launches, not a steady channel.

- **Hacker News (Show HN).** Rules: for "something you've made that other people can play with"; landing pages, sign-up pages and blog posts are off topic; the maker must be in the thread; make it easy to try "without barriers such as signups"; don't ask friends to upvote [first-party]. Use a plain title, explain how it works and its limits, and answer criticism calmly. It brings a spike, not a channel; plan how those visitors activate (see launches-and-gtm).
- **Reddit.** Participate first; follow each subreddit's self-promotion rules (see organic-social-and-community).
- **Discord/Slack communities.** Start your own once you have active users, and staff it; before that, help in existing ones.
- **Technical blog posts.** Real engineering problems, postmortems and benchmarks. Make benchmarks reproducible: publish code, hardware, versions and settings, and include cases where you lose. [practitioner] (see content-marketing)
- **Conference talks.** About the problem, not the product; record and reuse them (see events-and-webinars).
- **Integration marketplaces.** GitHub Marketplace publishes Actions without review if the repo is public and has an action.yml at the root [first-party]. Vercel's Marketplace adds integrated billing and lets its AI builder (v0) provision partner databases such as Neon and Supabase during generation [first-party]. Being the default integration in a platform's flow can outperform any campaign; see platform-and-feature-risk before relying on one.
- **Package registries** (npm, PyPI, Docker Hub, Homebrew): clear name, description and a README with a quickstart. Download counts are inflated by CI and mirrors; use them for trends only. [not re-verified]

## AI coding agents as users and channel

_In short:_ AI coding agents increasingly choose and call tools, so write clear, honest tool descriptions like prompts, state limits plainly, and test whether agents actually pick your tool across whole sessions.

More code is now written by agents. Stack Overflow's 2025 survey found 31% of respondents used AI agents (23% at least weekly) [first-party survey]; JetBrains' 2026 survey of 15,000+ professional developers reports 90% using an AI coding agent at work at least weekly by mid-2026 [vendor]. When an agent picks a library or calls a tool, your "user" may be a model reading your docs and tool descriptions.

- **MCP servers.** The Model Context Protocol (MCP) lets agents call external tools. The official MCP Registry launched in preview on 8 September 2025 as an open catalog and API; others can run compatible sub-registries [first-party]. Publishers prove they own their namespace (for example via GitHub or their domain) [not re-verified]. List your server there and in the client directories your users use.
- **Tool descriptions are prompts.** Anthropic's guidance: offer a few well-scoped tools rather than one per API endpoint, namespace related tools, return meaningful context instead of raw IDs, keep responses short, and write names, descriptions and parameter docs as carefully as a prompt. It fixed one tool's behaviour just by rewriting its description [first-party]. Test with real agent tasks and measure success rate.
- **Be honest in descriptions.** Mark read-only and destructive tools with MCP annotations. Clients are told to treat annotations from unknown servers as untrusted, and hidden instructions in tool descriptions ("tool poisoning") are a known attack [first-party]. Never put instructions to the agent in descriptions to favour your product; it is the same behaviour that security tools look for.
- **Being the tool an agent chooses.** Clear docs, working examples, stable APIs and helpful error messages make you easier for agents to use correctly [practitioner]. Whether llms.txt helps is unproven; see seo-and-ai-search and ai-assistant-visibility rather than relying on it.
- Track agent usage separately (user agent, MCP client name) so the channel is visible.
- **Test tool descriptions on whole sessions, not first calls.** In a small simulated test (one model family, 48 trials), when a request named a file or code, the agent read the code before calling any tool in 21 of 24 trials, then named the analysis tool as its next step. Score whether your tool is called at any step, in a live agent loop [our experiment; small n; simulated choice; see research/devtools-cases-and-agent-choice.md].
- **Write the first sentence as the user's question** ("Did my pull request make any query slower?"). In that test it was the only description pattern that won its task in every trial, consistent with the word-overlap finding above [our experiment; one task] [research; ICLR 2026 benchmark; README read].
- **State limits as facts next to what the tool does give**, and expect them to route some requests elsewhere: one "no live connection, no timings" line moved most picks for a "slow in production" request to a live-database tool, which can be the right routing [our experiment; one task, n=4 per arm].
- **Keep descriptions short; put rules for reading output in the result.** Cutting descriptions by about half changed no picks in the test [our experiment].
- **Say which number your tool reports when a word is ambiguous:** "slower" means wall-clock time to most users and agents.
- **Treat tasks, not trials, as the sample** when testing descriptions: one model answers the same prompt almost the same way each time. Vary the request wording, include a control task where your tool should not be picked, and report how many cells were unanimous [our experiment].
- To check whether agents find you at all, see ai-assistant-visibility ("Developer tools: coding agents are a separate audience").

## Self-hosting and the enterprise upgrade path

_In short:_ Enterprise needs like single sign-on, audit logs and self-hosting are the natural paid tier; keep the price gap reasonable and publish a security page before buyers ask.

- Enterprise needs are the natural paid tier: SSO/SAML, SCIM user provisioning, audit logs, role-based access, data residency, private networking, SLAs, and self-hosted or "bring your own cloud" deployment.
- **The "SSO tax".** The community list sso.tax names vendors that put SSO only on top tiers, often at several times the base price [community]. Security teams treat SSO as basic. Many devtools still put it in an enterprise plan; if you do, keep the price gap reasonable and say why.
- Self-hosting can be the free path (open source) or the paid one (enterprise licence); say which. Opt-in telemetry or licence keys tell you who self-hosts.
- Publish a security page (compliance reports, data flows, sub-processors) before buyers ask (see privacy-and-marketing-law).

## Pricing models

_In short:_ Match pricing to how the tool is used: usage-based for APIs and infrastructure, with free allowances and spend caps, per seat for collaboration tools, and public prices except for enterprise.

Value metric and usage-based pricing details are in pricing. For devtools:
- **Usage-based** (requests, compute, storage) fits APIs and infrastructure; add a free allowance, a cost calculator and spend caps. Surprise bills destroy trust. [practitioner]
- **Per seat** fits collaboration tools; **per project** is simple for CI and hosting but can push teams to cram work into one project.
- Public pricing is expected; "contact us" only for enterprise.

## Tools that comment on code (CI checks, analyzers, PR bots)

_In short:_ Findings get acted on when they appear in the pull request at the moment of change, come with a one-click fix, and are accurate; noisy or unsolicited tools get ignored or removed.

For a tool whose value shows up as findings on code, where and how findings appear decides whether anyone acts on them. The evidence is about fixes and merges, not signups or revenue.

- **Show findings in the pull request, at the moment of change.** Facebook's same analysis was fixed over 70% of the time when reported at diff time, and almost never when 20–30 issues were handed out offline [first-party; Facebook, CACM 2019; read]. Google found results kept outside the developer workflow were rarely fixed [first-party; Google, CACM 2018; read].
- **Offer the fix, not just the finding.** One-click suggested changes were applied 59.6% of the time against 0.9% for code written in comments [research; observational; GitHub suggested changes]. Explain every finding: a real problem the developer doesn't understand counts as a false positive to them [first-party; Google, Coverity].
- **Precision is part of the product.** Nearly all developers in one study accepted a 5% false-positive rate and about half accepted 15% [research; Microsoft survey, read-full]. Google turns off noisy checks and keeps its overall rate below 5% [first-party; Software Engineering at Google, ch. 20, read-full]. Noise is the main complaint about bots, and 11.3% of projects in one study dropped Dependabot [research; observational].
- **Defaults ship.** Most teams change only a few of a tool's default settings and rarely revisit them [research; large observational study of open-source projects; read]. Start quiet: results only on changed code, one comment updated in place, warn before fail. These specific remedies are inference, not tested [practitioner].
- **First installs stick.** Repositories mostly keep the first tool of a kind they install, and choose on features and ease of installation [research; large observational npm study, read-full]. Tools spread through people who commit to many repositories and through visible badges [research; observational].
- **Don't cold-pitch through pull requests or email.** Unsolicited pull requests adding a tool were mostly ignored or rejected (2 of 52 merged) [research; field test, small n], and developers in a lab study rated email the worst way to hear about a tool [research; lab study, n=14].

## Developer trust

_In short:_ Earn developer trust with honest benchmarks, public pricing, no dark patterns, status pages and early warning of breaking changes, and judge developer relations by activation, not followers.

- Honest benchmarks, public pricing, no dark patterns (hidden limits, hard-to-cancel plans), public status pages and postmortems, and early notice of breaking changes.
- **Developer relations (devrel)** = engineers whose job is to help developers succeed with the product: docs, examples, talks, community answers, and taking feedback back to the product team. Measure devrel on activation and community-sourced adoption, not on follower counts. [practitioner]

## Metrics

_In short:_ Track whether developers actually succeed, such as first successful run, weekly active projects, time to first value and expansion to teams, rather than signups, stars or downloads.

- **Activation**: first successful run, API call, deploy or integration (define it from retention data, as in self-serve-saas).
- **Weekly active projects** (or repos, workspaces, API keys with traffic): better than signups, stars or downloads.
- **Time to first value** and quickstart completion rate.
- **Expansion to teams**: second user on an account, accounts with production traffic, accounts hitting limits.
- **Source**: ask "how did you hear about us"; referrer data misses most developer word of mouth.
- Cohort retention and net revenue retention as in metrics-and-measurement and retention-and-expansion.

## What usually works by stage

_In short:_ Early on, write docs and the quickstart yourself, offer a free tier and answer every issue; later add a changelog, examples and integrations, then developer relations and an enterprise plan.

For the first ten customers (design partners, trust before outreach, early pricing, launches, the agent channel), see first-customers.

- **First users**: founders write the docs and quickstart, ship a free tier or open-source core, post one Show HN when it is easy to try, and answer every issue personally.
- **Early revenue**: regular changelog and technical blog; examples repo; one or two integration marketplaces; an MCP server if agents are likely users; a team plan; first product-qualified lead routing.
- **Scaling**: devrel team, talks, partner integrations, enterprise plan (SSO, audit logs, self-hosting), product-led sales for large accounts.

## Common mistakes

_In short:_ Avoid gating trials behind sales, treating stars as traction, choosing a licence you later regret, broken quickstarts, unreproducible benchmarks, uncapped usage bills and marketing-style tool descriptions.

- Gating the trial behind a demo or sales call.
- Treating GitHub stars or downloads as traction.
- Choosing a permissive license without a plan for cloud providers, then relicensing after the community forms.
- Quickstarts that break on a clean machine; docs that drift from the API.
- Benchmarks without code or method.
- Usage pricing with no spend caps or alerts.
- Tool descriptions written as marketing, not for correct agent use.
- Sales emailing every developer who signs up.

## Sources

research/early-stage-gtm-devtools.md (Christakis & Bird 2016; Sadowski et al. 2018; Software Engineering at Google ch. 20; Distefano et al. 2019; Kavaler et al. 2019; Lamba et al. 2020; Brown & Parnin; Wessel et al.; Mirhosseini & Parnin 2017); research/developer-tools.md (StarScout 2024; HashiCorp, Redis and Elastic license records; relicensing study 2024; GitLab; Show HN guidelines; MCP Registry and spec; Anthropic tool guide; Stack Overflow 2025; GitHub and Vercel docs; sso.tax). research/landscape-2026.md §4 for llms.txt. Mostly from search snippets; see caveats there.
