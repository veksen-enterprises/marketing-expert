---
title: Developer tools and infrastructure playbook
summary: Marketing for developer tools, APIs, CLIs, CI integrations, database tooling and MCP servers; who uses vs who pays, bottom-up adoption and when to add sales, open source licensing as distribution (open core, source-available, what license changes cost), docs and quickstarts, developer channels, AI coding agents as users, enterprise upgrade path, developer trust, metrics, and what works by stage.
tags: developer tools, devtools, open source, devrel, api, cli, mcp, hacker news, docs, bottom-up, sdk, infrastructure, open core, source-available, license change, github stars, show hn, quickstart, time to first value, changelog, integration marketplace, github marketplace, mcp registry, ai agents, tool descriptions, self-hosting, sso, usage-based pricing, activation
---

Use this playbook when your users are developers (or the AI coding agents working for them) and the product is something they install, call or connect: an API, SDK, CLI, CI integration, database tool or MCP server. It builds on self-serve-saas (activation, freemium, product-qualified leads) and b2b-saas-sales-led (larger deals) and covers only what differs for developers.

## Who uses vs who pays

- **The developer adopts; someone else pays.** A developer tries it on one service; if it works, the team lead or platform team pays as usage grows, with security and procurement joining larger deals. Serve both: the developer must try it in minutes; the buyer needs pricing, security answers and proof it scales.
- **GitLab made this explicit** with "buyer-based open core": features go into tiers by *who would buy them* — individual contributor (free), manager or director (Premium), executive (Ultimate) — priced per user. [first-party] It is a useful test for any feature: who asks for it, and who signs for it?
- **Bottom-up adoption** (usage spreads from individuals to teams before any sale) is the default. A "contact sales" wall in front of a trial loses most developers.
- **When to add sales:** when several users from one company appear, when accounts hit plan limits, or when security reviews start blocking upgrades. Use product-qualified leads and product-led sales as in self-serve-saas; move to the sales-led motion in b2b-saas-sales-led only for accounts large enough to pay for it. Sales should offer help (security review, invoicing, architecture review), not cold pitches to developers who signed up. [practitioner]

## Open source as distribution

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

**GitHub stars are a weak signal.** A Carnegie Mellon / NC State study (StarScout, 2019–2024 data) flagged about 4.5 million suspected fake stars; after stricter filtering, about 3.1 million fake stars on 15,835 repositories, many on scam or malware repositories [research, preprint]. Track weekly active projects and contributors instead, and never buy stars.

## Docs are the main marketing surface

- In Stack Overflow's 2025 survey, people who learned to code in the past year used technical documentation more than any other resource (68%; AI tools 44%) [first-party survey; self-selected sample]. For developers, the docs *are* the product evaluation.
- **Time to first value**: the time from landing on the docs to a first successful run (an API response, a passing CI check, a query returned). Measure it and cut it. "Time to first API call" is a common practitioner version; Stripe's one-page quickstarts and in-docs request runner are the standard example [practitioner].
- **Quickstart rules** [practitioner]: one page; copy-paste commands; authentication inside it, not on another page; a real result at the end. Test it on a clean machine every release.
- **Examples repository**: runnable apps for the top use cases; developers and agents copy these.
- **Reference docs** generated from the code or API spec so they don't drift; document errors and limits.
- **Changelog**: dated and specific, with breaking changes and migration steps; it shows the product is alive.
- Docs also rank and get cited by AI assistants; serve them as HTML (see ai-assistant-visibility).

## Developer channels

- **Hacker News (Show HN).** Rules: for "something you've made that other people can play with"; landing pages, sign-up pages and blog posts are off topic; the maker must be in the thread; make it easy to try "without barriers such as signups"; don't ask friends to upvote [first-party]. Use a plain title, explain how it works and its limits, and answer criticism calmly. It brings a spike, not a channel; plan how those visitors activate (see launches-and-gtm).
- **Reddit.** Participate first; follow each subreddit's self-promotion rules (see organic-social-and-community).
- **Discord/Slack communities.** Start your own once you have active users, and staff it; before that, help in existing ones.
- **Technical blog posts.** Real engineering problems, postmortems and benchmarks. Make benchmarks reproducible: publish code, hardware, versions and settings, and include cases where you lose. [practitioner] (see content-marketing)
- **Conference talks.** About the problem, not the product; record and reuse them (see events-and-webinars).
- **Integration marketplaces.** GitHub Marketplace publishes Actions without review if the repo is public and has an action.yml at the root [first-party]. Vercel's Marketplace adds integrated billing and lets its AI builder (v0) provision partner databases such as Neon and Supabase during generation [first-party]. Being the default integration in a platform's flow can outperform any campaign; see platform-and-feature-risk before relying on one.
- **Package registries** (npm, PyPI, Docker Hub, Homebrew): clear name, description and a README with a quickstart. Download counts are inflated by CI and mirrors; use them for trends only. [not re-verified]

## AI coding agents as users and channel

More code is now written by agents. Stack Overflow's 2025 survey found 31% of respondents used AI agents (23% at least weekly) [first-party survey]; later vendor surveys report faster growth [vendor, not re-verified]. When an agent picks a library or calls a tool, your "user" may be a model reading your docs and tool descriptions.

- **MCP servers.** The Model Context Protocol (MCP) lets agents call external tools. The official MCP Registry launched in preview on 8 September 2025 as an open catalog and API; others can run compatible sub-registries [first-party]. Publishers prove they own their namespace (for example via GitHub or their domain) [not re-verified]. List your server there and in the client directories your users use.
- **Tool descriptions are prompts.** Anthropic's guidance: offer a few well-scoped tools rather than one per API endpoint, namespace related tools, return meaningful context instead of raw IDs, keep responses short, and write names, descriptions and parameter docs as carefully as a prompt. It fixed one tool's behaviour just by rewriting its description [first-party]. Test with real agent tasks and measure success rate.
- **Be honest in descriptions.** Mark read-only and destructive tools with MCP annotations. Clients are told to treat annotations from unknown servers as untrusted, and hidden instructions in tool descriptions ("tool poisoning") are a known attack [first-party]. Never put instructions to the agent in descriptions to favour your product; it is the same behaviour that security tools look for.
- **Being the tool an agent chooses.** Clear docs, working examples, stable APIs and helpful error messages make you easier for agents to use correctly [practitioner]. Whether llms.txt helps is unproven; see seo-and-ai-search and ai-assistant-visibility rather than relying on it.
- Track agent usage separately (user agent, MCP client name) so the channel is visible.
- To check whether agents find you at all, see ai-assistant-visibility ("Developer tools: coding agents are a separate audience").

## Self-hosting and the enterprise upgrade path

- Enterprise needs are the natural paid tier: SSO/SAML, SCIM user provisioning, audit logs, role-based access, data residency, private networking, SLAs, and self-hosted or "bring your own cloud" deployment.
- **The "SSO tax".** The community list sso.tax names vendors that put SSO only on top tiers, often at several times the base price [community]. Security teams treat SSO as basic. Many devtools still put it in an enterprise plan; if you do, keep the price gap reasonable and say why.
- Self-hosting can be the free path (open source) or the paid one (enterprise licence); say which. Opt-in telemetry or licence keys tell you who self-hosts.
- Publish a security page (compliance reports, data flows, sub-processors) before buyers ask (see privacy-and-marketing-law).

## Pricing models

Value metric and usage-based pricing details are in pricing. For devtools:
- **Usage-based** (requests, compute, storage) fits APIs and infrastructure; add a free allowance, a cost calculator and spend caps. Surprise bills destroy trust. [practitioner]
- **Per seat** fits collaboration tools; **per project** is simple for CI and hosting but can push teams to cram work into one project.
- Public pricing is expected; "contact us" only for enterprise.

## Developer trust

- Honest benchmarks, public pricing, no dark patterns (hidden limits, hard-to-cancel plans), public status pages and postmortems, and early notice of breaking changes.
- **Developer relations (devrel)** = engineers whose job is to help developers succeed with the product: docs, examples, talks, community answers, and taking feedback back to the product team. Measure devrel on activation and community-sourced adoption, not on follower counts. [practitioner]

## Metrics

- **Activation**: first successful run, API call, deploy or integration (define it from retention data, as in self-serve-saas).
- **Weekly active projects** (or repos, workspaces, API keys with traffic): better than signups, stars or downloads.
- **Time to first value** and quickstart completion rate.
- **Expansion to teams**: second user on an account, accounts with production traffic, accounts hitting limits.
- **Source**: ask "how did you hear about us"; referrer data misses most developer word of mouth.
- Cohort retention and net revenue retention as in metrics-and-measurement and retention-and-expansion.

## What usually works by stage

For the first ten customers (design partners, trust before outreach, early pricing, launches, the agent channel), see first-customers.

- **First users**: founders write the docs and quickstart, ship a free tier or open-source core, post one Show HN when it is easy to try, and answer every issue personally.
- **Early revenue**: regular changelog and technical blog; examples repo; one or two integration marketplaces; an MCP server if agents are likely users; a team plan; first product-qualified lead routing.
- **Scaling**: devrel team, talks, partner integrations, enterprise plan (SSO, audit logs, self-hosting), product-led sales for large accounts.

## Common mistakes

- Gating the trial behind a demo or sales call.
- Treating GitHub stars or downloads as traction.
- Choosing a permissive license without a plan for cloud providers, then relicensing after the community forms.
- Quickstarts that break on a clean machine; docs that drift from the API.
- Benchmarks without code or method.
- Usage pricing with no spend caps or alerts.
- Tool descriptions written as marketing, not for correct agent use.
- Sales emailing every developer who signs up.

## Sources

research/developer-tools.md (StarScout 2024; HashiCorp, Redis and Elastic license records; relicensing study 2024; GitLab; Show HN guidelines; MCP Registry and spec; Anthropic tool guide; Stack Overflow 2025; GitHub and Vercel docs; sso.tax). research/landscape-2026.md §4 for llms.txt. Mostly from search snippets; see caveats there.
