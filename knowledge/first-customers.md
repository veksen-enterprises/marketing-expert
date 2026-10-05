---
title: First customers (zero to ten)
summary: Go-to-market for a product with no paying customers yet, especially B2B SaaS and developer tools: what the research does and doesn't show, validating with commitments, choosing lead users, design partners and founder-led selling, earning trust before outreach, pricing from the start, launches, and coding agents as a channel.
tags: first customers, zero customers, pre-revenue, early stage, design partner, pilot, paid pilot, founder-led sales, lead users, validation, willingness to pay, kill criteria, beachhead, first segment, trust, security review, data handling, legitimacy, early pricing, free trial, freemium, launch, show hn, coding agents, mcp, developer tools, b2b saas
---

Evidence note: no study looks directly at go-to-market for a SaaS or developer tool with zero customers. The research below is adjacent (consumer goods, crowdfunding, NSF I-Corps teams, 3M, large SaaS incumbents, GitHub stars, lab tests of coding agents), so applying it here is inference. Where a rule rests only on operator experience it is tagged [practitioner]. Most sources were read as search snippets; see research/early-stage-gtm.md for access notes.

## Diagnose the stage first

With fewer than about 10 paying customers there are no numbers to tune, so the usual constraints (reach, conversion, retention, unit economics) can't be measured. The constraint is usually **activation and proof**: nobody outside the team has reached the product's value and said so in a way others can check. Treat "who has reached first value, and would say so publicly" as the first metric. [practitioner]

- Run unit_economics anyway, without a CAC: it returns the most you could pay per customer (affordable CAC). Use that to rule paid channels in or out, not to forecast.
- Use liquidity_math for products where users wait for a match (marketplaces, alerts, saved searches).
- Founder time is the real cost at this stage. Count founder hours per move per week, and check they add up.

## Base rates from 31 developer-tool cases

Coded from founders' own accounts and investor write-ups of 31 developer tools that survived (database, CI and pull-request, observability and developer-experience tools) [our coding; survivors only; self-told stories; 17 of 31 rows rest partly on snippets; 10 rows spot-checked, 5 needed a correction]. These describe this set; they are not forecasts.

- **Months from launch to first revenue:** median 9 where known (n=17; middle half about 2–17; range 0–30). Most unknowns are enterprise or database-infrastructure companies, so the known median probably flatters the set. Counted from the start of work, most figures grow.
- **First payers:** self-serve 52%, sales-led or founder-sold 29%, mixed 16%. Sales-led first revenue clustered where the product holds production data or needs uptime guarantees, and where the user is not the buyer.
- **First channel:** founder-driven (network, one-to-one outreach, the founder's audience) 39%; a Hacker News launch 29%, usually after a hand-recruited first group; an existing open-source community 23%.
- **Open source at the start:** open core 42%, only a client or CLI open 29%, closed 29%.
- **CI and pull-request tools (n=10):** 7 were free for open-source repositories and charged for private repos or teams; per-private-repo pricing was common early.
- **Developer-facing database tools grew slowly:** one took about a year after billing went live to reach 10 payers, another three years from its first subscriber to its 100th [first-party; founder podcast and company site; snippet-only].

Patterns seen in several cases [first-party; founder interviews; mixed access]:
- Users asked how to pay before there was a way to pay. Log every "how do I pay?" message as a demand signal.
- The first paid feature was often a professional need (private repositories, custom domains, removing branding), not more usage.
- A self-serve paywall stalled when the user was not the buyer; revenue came after selling to the budget holder [vendor; investor write-up; snippet-only].
- A founder stayed in the loop even in self-serve: a calendar link on the pricing page, one-to-one invitations, the founder doing early sales.

## Validate with commitments, and decide in advance what kills the idea

- What people say they would pay runs about 21% above what they pay when money is at stake [research; meta-analysis of 77 studies; consumer goods only; snippet-only]. Stated purchase intent is least reliable for new products [research; snippet-only]. Ask for a commitment: a paid pilot, a signed agreement, a pre-order, time on a call with their real data.
- The best-measured benefit of structured, hypothesis-driven discovery is dropping bad ideas sooner; revenue effects are mixed (one randomized trial positive among firms that stayed active, the large replication null) [research; randomized trials, n=116 and n=759; revenue result from a secondary summary].
- Pivots tend to come as a series of small changes after disconfirming evidence [research; qualitative; small n; hardware].
- Write each bet as a dated rule: "By [date], N teams use it weekly for 30 days and M sign a paid pilot; if not, change the segment or the lead surface." Log what triggered each change. The thresholds are your judgement; the habit of a dated kill rule is what the evidence supports.
- Launch and community audiences are biased samples: founders who met a biased launch audience cut product development and raised less money [research; NBER working paper; figures differ between versions; snippet-only]. Don't read the launch crowd as the market.

## Pick the first customers: lead users you can reach and reference

- Lead users face a need before the market does and often build their own fix. Inside 3M, lead-user projects produced ideas forecast at more than 8x the year-5 sales of traditional projects [research; natural experiment; one firm; 5 treated projects; management forecasts, not sales; snippet-only]. For a developer tool, lead users are the teams already hand-rolling the check you sell (scripts, dashboards, CI steps).
- A few deep customer relationships are associated with more successful new products than one big customer or many shallow ones [research; observational; unverified].
- A reference persuades most when the referring client looks like the prospect; reference value differs from lifetime value [research; two established firms; snippet-only].
- Choose one narrow, reachable segment whose members talk to each other (see launches-and-gtm, "Beachhead segment"). Check that your product works end to end for that segment's stack before you recruit it. [practitioner]

## Sell one-to-one first

- In a panel of 300+ B2B high-tech start-ups, a larger share of budget on personal selling helped early and hurt later; mass media hurt early and helped after product-market fit [research; peer-reviewed; observational panel; effect sizes from a summary; snippet-only]. No study compares founder-led selling with self-serve.
- Founder-led sales: the founder sells the first deals to learn the pitch, the objections and the real buyer, before hiring anyone to sell [practitioner, not re-verified: Kazanjy, Founding Sales].
- Do things that don't scale: set the product up for each early team by hand and watch where they get stuck [practitioner].

## Design partners

Design partners are early customers who shape the product in return for early access, attention and a price [practitioner]. Rules operators use [practitioner]:

- **Select** on: the problem is urgent and recent (a dated incident), they match your target segment, they can give you a contact who uses it weekly, and they can say yes to a reference.
- **Agreement, one page:** the success test (what result, by when, measured how), length (6–12 weeks), price (paid from day one at a pilot price, or a stated price that starts on success), what converts the pilot to a contract, and reference or logo rights.
- **Price:** anchor on the list price and give a time-limited, documented discount, so the reference price stays credible. Free pilots teach you less about willingness to pay.
- **Cadence:** a short weekly review with the user and a monthly one with the buyer. One founder can run about 3–5 at once.
- **Kill criteria:** if the success test fails, find out whether value or setup blocked them, and drop partners who stop engaging.
- **Capture:** write the case study (before, after, numbers) while it happens.

## Earn trust before outreach

- Security or privacy concerns are the top reason developers reject a technology, ahead of price [first-party survey; Stack Overflow 2025, n=34,188; self-selected].
- Business buyers want a choice they can defend [vendor; LinkedIn survey via trade press; year unverified].
- Cheap legitimacy steps (registration, a website, visible activity) and ties to known players are associated with survival and growth in new ventures [research; observational; settings far from developer tools].
- Developers screen libraries on maturity, usability, maintenance and docs; honest badges and complete READMEs are cheap signals [research; interviews and small self-selected surveys; popularity, not paid conversion].

Before outreach, for any product that touches customer data, credentials or production systems [practitioner]:

1. One data-flow page: what is read, what is sent, what is stored and for how long, who holds credentials, the least privilege needed, what anonymous users can see.
2. Check every data and credential claim on the site (tooltips and FAQ included) against the docs and the code; fix contradictions first. scan_source lists them with file:line.
3. Say what is true in which mode (cloud, CI, self-hosted) instead of one blanket claim.
4. Offer self-hosting or a local mode to early partners if you have one.
5. Leave SOC 2 and formal security reviews until a buyer asks; answer the questionnaire honestly in the meantime.

## Price from the start

- Short trials beat long ones in a large randomized trial: a 7-day trial for everyone raised subscriptions 5.6% against 30 days, and inactivity near the end of a trial predicted non-conversion [research; RCT, n=337,724; one dominant firm with existing demand; "7 days for an unknown tool" is an extrapolation].
- With a permanent free tier, longer trials raised uptake with no detectable effect on immediate conversion [research; RCT; lower-tier venue; snippet-only].
- Freemium upgrades took months in one cloud-storage service (none before 15 weeks), and most happened before users hit the free limit [research; working paper; one firm; n=500 sampled users]. If your free tier has no binding limit, don't expect upgrades from it.
- B2B subscriptions can be badly underpriced: one job-board's randomized price test found the profit-maximizing price at $327 against the existing $99 [research; RCT, n=7,867; one firm; one author was a paid adviser].
- Showing a premium option can lift choice of the middle one [research; field RCT; books, not SaaS].
- Charge the buyer, not the user: if one developer adopts and a team pays, price per team or per repository, and make sure your billing code can sell what you price. [practitioner]
- Lifetime deals: see pricing, "Lifetime deals".

## Launches are small; repeat them

- A tweet burst was worth about one GitHub star [research; quasi-experimental; ICSE 2022]. A Hacker News post that got traction gave median gains of tens of stars [research; preprint; n=137; selected on success]. Newcomers who arrive in a spike rarely stay [research; matched comparison]. None of these measure signups or revenue.
- Make it possible to try without signing up before you post (Show HN rules require it) [first-party], and fix anything that breaks for a first-time user: early failures put trial users off [research; structural model; one firm].
- Treat launches as a series of concrete posts with measured before-and-after numbers. [practitioner]
- For CI checks, analyzers and PR bots, placement and noise decide adoption more than launches do; see developer-tools, "Tools that comment on code".

## Coding agents as a channel

- Agents choose among similar tools mainly by word overlap between the user's request and the tool's name, description and parameters [research; ICLR 2026 benchmark; README read]. Describe tools in the words users type, with concrete examples.
- Rewording a tool description alone raised its selection more than 10x in a lab test, and automated rewrites raised selection from about 20% to 81% [research; lab settings; one peer-reviewed, one preprint]. Paraphrasing defenses undid much of it, so puffery is fragile; don't rely on it.
- In one study, Claude Code built the thing itself in 12% of open-ended picks, and was decisive when it chose a tool (GitHub Actions 94%) [vendor; independent research firm; not peer-reviewed; one agent].
- MCP directories are crowded: one crawl found 8,401 valid projects across six markets, and over half of listings low-value [research; preprints; descriptive]. No study links a listing to installs or revenue.
- Docs placed in the agent's context reduce errors but don't remove version bias [research; NAACL 2025].
- Measure the channel: log MCP client name, first successful call, sign-in and repeat use. See developer-tools, "AI coding agents as users and channel".

## Common mistakes

- Counting interest (waitlists, stars, compliments) as demand.
- Launching broadly before anyone outside the team has reached value.
- A free tier with no limit and nothing yet worth paying for.
- Pricing per user when the team is the buyer, or selling a plan the billing code can't deliver.
- Outreach while the site contradicts the docs on what data leaves the customer's systems.
- No written kill rule, so a weak bet runs for a year.

## Sources

research/early-stage-gtm.md and research/early-stage-gtm-devtools.md (Schmidt & Bijmolt 2020; Morwitz et al. 2007; Cao, Koning & Nanda 2021; Lilien et al. 2002; Kumar, Petersen & Leone 2013; Delmar & Shane 2004; Stack Overflow 2025; Vomberg et al. 2026; Yoganarasimhan, Barzegary & Pani 2023; Lee, Kumar & Gupta 2017; Dubé & Misra 2023; Foubert & Gijsbrechts 2016; Fang et al. 2022; Maldeniya et al. 2020; Faghih et al. 2025; ToolTweak 2025; BiasBusters 2026; LibEvolutionEval 2025; Amplifying 2026; MCP ecosystem preprints); research/startup-risk-and-opportunity.md (Camuffo et al. 2020, 2024); research/pricing.md; research/developer-tools.md.
