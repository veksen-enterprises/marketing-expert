import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PROMPTS_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "prompts");

// Prompts are workflows: they fix the ORDER of thinking, which is where most marketing advice goes
// wrong (tactics before diagnosis, copy before positioning, tests before power analysis).

function user(text: string) {
  return { messages: [{ role: "user" as const, content: { type: "text" as const, text } }] };
}

const opt = (s: string | undefined, label: string) => (s ? `\n${label}: ${s}` : "");

// One move format for the instructions and every prompt that asks for moves; check_answer (src/lib/moveCheck.ts)
// looks for these labels.
export const MAX_MOVES = 3;
export const MOVE_FORMAT =
  'each move is one action (no "and", no "in the same change"), with the lines "Mechanism:", "Cheapest test:" (smaller than the move, with its cost), "Metric:", "Time box:" and "Stop:" (the number that means drop or change it)';

export function registerPrompts(server: McpServer): void {
  server.registerPrompt(
    "technical_seo_review",
    {
      title: "Technical SEO review of a site you can build",
      description: "Measured review of how each public page looks to Google and AI crawlers: production build, raw vs rendered HTML, status codes, canonicals, crawl paths, sitemap/robots, noindex, rendering, speed; ranked fixes with a check that proves each is fixed.",
      argsSchema: {
        repo: z.string().optional().describe("Path or name of the site's repo"),
        localUrl: z.string().optional().describe("URL where the production build is running locally, if already started"),
      },
    },
    ({ repo, localUrl }) =>
      user(
        `${opt(repo, "Repo")}${opt(localUrl, "Local production build")}\n\n` +
          readFileSync(join(PROMPTS_DIR, "seo-site-review-v2.md"), "utf8").replace(/^# .*\n+/, "")
      )
  );

  server.registerPrompt(
    "marketing_diagnosis",
    {
      title: "Diagnose the growth constraint",
      description: "Find the single constraint on growth before recommending anything.",
      argsSchema: { context: z.string().describe("What the business is, and what's going wrong or what's wanted") },
    },
    ({ context }) =>
      user(`Diagnose the marketing/growth constraint for this business before recommending anything.

Context: ${context}

Work in this order:
1. Restate the business model in one line: who pays, for what, how much, how often, and how they buy (self-serve, sales-assisted, retail).
2. List what you need to know and don't, as specific questions with the numbers you need (traffic, conversion by stage, CAC by channel, retention by cohort, margin, ACV, sales cycle). Ask them. If the user can't answer, state the assumption you'll make and how it would change the conclusion.
3. Identify the constraint. It is usually one of: nobody outside the team has reached the product's value yet (activation and proof: the usual constraint below ~10 paying customers, see first-customers); nobody understands what it is or who it's for (positioning); not enough of the right people see it (reach/channel); they see it but don't act (offer, page, friction); they act but don't stay (retention/product, so stop buying acquisition); the numbers don't work (unit economics). Use funnel_analysis and unit_economics if numbers exist. Name the evidence for your call and what would falsify it.
4. Recommend at most ${MAX_MOVES} moves against that constraint; ${MOVE_FORMAT}. search_playbooks for the relevant playbook and cite it.
5. Say what NOT to do yet, and why.`)
  );

  server.registerPrompt(
    "marketing_strategy",
    {
      title: "Marketing strategy",
      description: "Propose a ranked marketing strategy for a specific business: picks the business-type playbook, checks the economics, and chooses channels with evidence.",
      argsSchema: {
        business: z.string().describe("What you sell, to whom, price, how people buy, stage"),
        goal: z.string().optional().describe("e.g. first 100 customers, double pipeline, cut CAC"),
        budget: z.string().optional().describe("Money and people available"),
      },
    },
    ({ business, goal, budget }) =>
      user(`Propose a marketing strategy for this business.${opt(goal, "\nGoal")}${opt(budget, "\nBudget / team")}

Business: ${business}

1. Context: call list_business_profiles / get_business_profile if one exists. Ask for anything essential that's missing (price, how they buy, current numbers) before going further; state assumptions if the user can't answer.
2. Business type: pick the closest playbook and read it with get_playbook: b2b-saas-sales-led, self-serve-saas, developer-tools, ecommerce-dtc, marketplaces, local-services, consumer-apps, community-and-hobby-products, seasonal-and-hobby-products, fitness-and-health-apps, selling-to-local-merchants (products that local shops adopt for their customers), professional-services or retail-cpg. Say which one and why; if it's a mix, say which parts of each apply.
2b. Alternatives: name what the target users do today instead (specific competitors, adjacent tools, communities, "do nothing"), from your own knowledge if needed, labelled unverified. The strategy has to beat those, not an abstract market.
3. Constraint: what limits growth right now (see the marketing_diagnosis order: activation and proof, positioning, reach, conversion, retention, unit economics)? Strategy targets that constraint; if retention or positioning is broken, fixing that comes before spending on acquisition. If the product touches customer data, credentials or production systems, check the site's data and credential claims against the docs (scan_source) and list contradictions as a short "Fix first" list, one line each, outside the moves.
4. Economics: run unit_economics or paid_media_math with their numbers, or with labelled assumptions, to show what customer acquisition cost the business can afford (unit_economics returns it without a CAC). This rules channels in or out.
5. Channels. With fewer than ~10 paying customers, skip the channel shortlist: use first-customers to plan the first ten instead (who exactly, as a named segment or list of 20–50 accounts or communities; how each is reached; the offer, agreement and price; the success test), and say how money will actually be collected in the 90 days (existing checkout, invoice, or a build task the billing code needs). Otherwise shortlist 3 using channel-strategy (Bullseye, channel-model fit) and the channel playbooks (seo-and-ai-search, ai-assistant-visibility, content-marketing, organic-social-and-community, pr-and-influencers, events-and-webinars, video-and-youtube, paid-acquisition, email-and-lifecycle, partnerships-and-affiliates, referral-programs, outbound-and-abm). If retention is the constraint, use retention-and-expansion; check budget realism with marketing-budget-and-team and legal limits with privacy-and-marketing-law. For each: why it fits this business, then the cheapest test, metric and stop line as in step 6. Separately from the moves, call match_small_bets on the saved profile and list up to three small bets that fit now (cheap tests matched to what the business already has), each with its first test and stop line; small bets are not moves and don't count toward the move limit.
6. The plan: at most ${MAX_MOVES} moves; ${MOVE_FORMAT}. Then the first 90 days in order, with calendar dates, founder or owner hours per week for each move, and owners if a team was described. At most 2–3 things at once; no move may depend on the output of one that starts later.
7. Evidence: for each recommendation, say whether it rests on research, platform documentation, practitioner experience or vendor data. Don't call anything "proven" unless the playbook tags it [research] or [first-party], and even then say what context it was proven in.
8. What not to do yet, and why.
Before sending, run check_answer with deliverable "plan" (a 1,800-word limit), and with agentChannel true if scan_source reported mcpServer.
Offer to save the confirmed facts with save_business_profile.`)
  );

  server.registerPrompt(
    "positioning_workshop",
    {
      title: "Positioning workshop",
      description: "Work through April Dunford's positioning components in the right order.",
      argsSchema: {
        product: z.string().describe("What the product is and does"),
        bestCustomers: z.string().optional().describe("Who loves it most, and why, if known"),
      },
    },
    ({ product, bestCustomers }) =>
      user(`Run a positioning workshop for this product. First call get_playbook with slug "positioning" and follow its process.

Product: ${product}${opt(bestCustomers, "Best customers")}

Go in this order and do not skip ahead; each step depends on the previous:
1. Best-fit customers: who already buys fastest, stays longest, and refers others. If unknown, say how to find out (review CRM for shortest sales cycle and lowest churn; interview them).
2. Competitive alternatives: what those customers would do if this product didn't exist, including spreadsheets, an agency, an intern, doing nothing.
3. Unique attributes: capabilities the alternatives lack. Be literal; "easy to use" isn't an attribute unless you can say what's removed.
4. Value: what each attribute enables for the customer, with proof (numbers, stories). Group attributes into 2–4 value themes.
5. Target market characteristics: what makes a buyer care a lot about that value; how to recognise them.
6. Market category: the frame that makes the value obvious. Consider head-to-head, a subsegment of an existing category, or a new category, and the cost of each.
7. Only now: a one-sentence positioning statement, a homepage headline + subhead, and the 3 proof points to lead with. Run analyze_copy on the headline and subhead.
List the assumptions that most need customer validation, and the interview questions to test them (Mom Test style: past behaviour, not opinions about the future).`)
  );

  server.registerPrompt(
    "landing_page_teardown",
    {
      title: "Landing page teardown",
      description: "Evidence-based critique of a live landing page, ranked by expected impact.",
      argsSchema: {
        url: z.string().describe("Page URL"),
        audience: z.string().optional().describe("Who arrives here and from where (ad, search, email)"),
        goal: z.string().optional().describe("The one action the page should drive"),
      },
    },
    ({ url, audience, goal }) =>
      user(`Tear down this landing page. Call audit_page on the URL first and work from what it returns, not from assumptions. Then search_playbooks for "landing page" and use that checklist.

URL: ${url}${opt(audience, "Audience / traffic source")}${opt(goal, "Goal")}

Structure:
0. Facts check: if you have the product's docs or repo, compare the page's claims (features, "coming soon", prices, setup steps, plans, and every data-handling or credential claim, tooltips and FAQ included) with them. If the docs disagree with each other, report that instead of picking one. Mismatches go to the top of the list: they're cheap to fix and cost trust.
1. The 5-second read: from the lead text and h1 alone, what does a first-time visitor think this is, who it's for, and what to do next? Quote the page.
2. Message match: does the headline continue what the traffic source promised? If the source is unknown, say what to check.
3. Run analyze_copy on the lead text. Note vague claims, missing proof, writer-centric framing.
4. Offer and CTA: is there one primary action, and is it clear what the visitor gets and what it costs them (time, money, data)?
5. Proof and objections: what objections would this audience have (price, switching cost, risk, credibility), and where are they answered?
6. Friction: forms, steps, speed, mobile. Use the audit flags.
7. Technical/SEO flags from the audit that matter for this page's job (ignore the rest).
Finish with at most ${MAX_MOVES} changes ranked by expected impact × confidence, each with a hypothesis in the form "Because [evidence], changing [X] for [audience] will improve [metric]"; ${MOVE_FORMAT}. Say which deserve an A/B test and which a smaller check (5 people shown the new page). Use ab_test_sample_size if traffic numbers are known.`)
  );

  server.registerPrompt(
    "experiment_plan",
    {
      title: "Experiment plan",
      description: "Turn an idea into a test that can actually produce a trustworthy answer, or decide not to test.",
      argsSchema: {
        idea: z.string().describe("The change you want to test"),
        baselineRate: z.string().optional().describe("Current conversion rate on the primary metric, e.g. 0.03"),
        dailyTraffic: z.string().optional().describe("Eligible visitors per day"),
      },
    },
    ({ idea, baselineRate, dailyTraffic }) =>
      user(`Design an experiment for this idea. Read get_playbook "experimentation" first.

Idea: ${idea}${opt(baselineRate, "Baseline rate")}${opt(dailyTraffic, "Daily eligible traffic")}

Output:
1. Hypothesis: "Because [evidence/insight], we believe [change] for [audience] will cause [effect on metric]."
2. Primary metric (one), guardrail metrics (2–3), and the unit of randomisation.
3. Power: call ab_test_sample_size with a realistic MDE. If the test needs more than ~6–8 weeks, say so and propose an alternative (bolder variant, upstream metric, before/after with a holdout, or ship on judgement).
4. Pre-registered decision rule: what result means ship, kill, or iterate. Fix duration in whole weeks; no peeking-based stopping.
5. Pre-launch QA checklist and the SRM check you'll run.
6. What you'll learn even if it loses.`)
  );

  server.registerPrompt(
    "campaign_brief",
    {
      title: "Campaign brief",
      description: "A one-page brief that forces the decisions a campaign needs before creative work starts.",
      argsSchema: {
        product: z.string(),
        objective: z.string().describe("The business outcome, not the activity"),
        budget: z.string().optional(),
      },
    },
    ({ product, objective, budget }) =>
      user(`Write a one-page campaign brief.

Product: ${product}
Objective: ${objective}${opt(budget, "Budget")}

Sections, each short and specific:
- Business objective and the single metric that judges success (incremental if possible), with target and how it will be measured (holdout, geo split, pre/post with control). Explain why platform-attributed numbers alone aren't enough.
- Audience: who, what they currently do instead (competitive alternative), what they believe now, what we want them to believe/do after. Awareness level (unaware → most aware) and what that implies for the message.
- Single-minded proposition: one sentence. Support: 3 reasons to believe, each provable.
- Mandatories and constraints (legal, brand, platform limits; use check_copy_limits for ad copy).
- Channels and why each fits this audience and objective; budget split and the break-even math (paid_media_math) if paid.
- Creative: 3 distinct concepts, not variations, since on automated ad platforms the creative is the targeting.
- Timeline, owners, and the review point where we cut or scale.`)
  );

  server.registerPrompt(
    "launch_plan",
    {
      title: "Launch plan",
      description: "Size a launch to its importance and plan the before/during/after.",
      argsSchema: {
        whatsLaunching: z.string(),
        audience: z.string().optional(),
        date: z.string().optional(),
      },
    },
    ({ whatsLaunching, audience, date }) =>
      user(`Plan this launch. Read get_playbook "launches-and-gtm" first.

Launching: ${whatsLaunching}${opt(audience, "Audience")}${opt(date, "Date")}

1. Tier it (1 = new product/category, 2 = significant feature, 3 = improvement) and justify. Effort should match the tier.
2. The one message: what's new, who it's for, why now, in one sentence, plus the proof.
3. Before: positioning check, sales/support enablement, assets, beta customers ready to be quoted, list building.
4. Launch day: channels in priority order, each with owner and asset. Owned channels and existing customers first.
5. After: the 30 days when most launches die. Follow-up content, sales plays, onboarding changes, and the metrics review on day 7 and day 30 (adoption, activation, pipeline, not impressions).
6. Risks and what would make you delay.`)
  );

  server.registerPrompt(
    "opportunity_assessment",
    {
      title: "Opportunity and risk assessment",
      description: "Honest go/no-go review of a business idea or new product: base rates, market size, timing, risks, kill criteria.",
      argsSchema: {
        idea: z.string().describe("The product or business, who it's for, and how it makes money"),
        evidence: z.string().optional().describe("What you know so far: customers talked to, paying users, numbers"),
      },
    },
    ({ idea, evidence }) =>
      user(`Assess this opportunity honestly. Read get_playbook "startup-risk-and-opportunity" and "market-sizing-and-timing" first.

Idea: ${idea}${opt(evidence, "Evidence so far")}

0. Goal: ask (or assume, labelled) what the founder wants: hobby, side income, lifestyle business or venture-scale. "Worth building" means something different for each; for a hobby or community tool read get_playbook "community-and-hobby-products".
1. Base rates: state base rates that match that goal and business type (new-business survival, venture return of capital, or the thin evidence on side projects), before any opinion. Ask the founder for their own probability estimate and compare.
2. Who wants it urgently? Name the smallest concentrated group with the problem and a budget, the evidence they exist, and the path to the next group.
3. Market: run market_size bottom-up with sourced account counts (ask for them; say where to get them), including the share that would pay at all. Quote its output; don't hand-calculate the headline number. Report SAM, capacity-bounded obtainable market, and the $100M ARR test. Say whether this is venture-scale, a strong bootstrapped business, or neither, and why.
4. Why now: the specific, dated change that makes this possible now. If none, say so.
5. Risks, layer by layer (founder, market, competition, timing, financing, marketing/CAC, distribution, technology, product, hiring): rate each and name the cheapest evidence that would reduce it. Include platform/feature risk (get_playbook "platform-and-feature-risk") and incumbent response (get_playbook "competing-with-incumbents").
6. Pre-mortem: it's 18 months later and this has shut down. List the most likely reasons.
7. The two or three leap-of-faith hypotheses, each as a test with a threshold and deadline, and the kill criteria.
Finish with a one-paragraph verdict and the single next test to run. Don't soften it.`)
  );

  server.registerPrompt(
    "competitive_strategy",
    {
      title: "Competitive strategy vs larger players",
      description: "How a small company should position against incumbents and platforms: what stops them copying you, where to fight, and how exposed you are to being absorbed.",
      argsSchema: {
        company: z.string().describe("What you do and for whom"),
        competitors: z.string().describe("The incumbents, platforms and alternatives you face"),
      },
    },
    ({ company, competitors }) =>
      user(`Build a competitive strategy for a small company facing larger players. Read get_playbook "competing-with-incumbents", "platform-and-feature-risk" and "competitive-analysis" first.

Company: ${company}
Competitors / platforms: ${competitors}

0. Stage check: is competition actually the constraint right now? If the company is early (few users, no repeatable channel), say so and name the real constraint first (see marketing_diagnosis); answer the competition question briefly after that.
1. Alternatives from the buyer's view, including "do nothing" and suites they already pay for. Mark each of our strengths as shipped, partial or planned, from the business's own docs.
2. For each major incumbent: what would copying us cost them, in their own revenue or margin terms? If nothing, say they will copy us and plan for it.
3. Is our innovation sustaining (better for their best customers) or does it start where they won't follow (low end, non-consumers, a business model they can't adopt)? Be honest.
4. Platform and feature risk: answer the risk questions from the platform playbook (dependence share, access clauses, who owns the customer, feature vs product vs company test).
5. What protects us now (a business model they won't copy, an exclusive asset) and what we must build next (switching costs, network effects in our niche, brand), in order. Plain words; don't use the word "moat".
6. Where to fight: the axis where their money doesn't convert directly into results. Where not to fight.
7. Pre-planned responses if a big player enters: which segments we defend, which we cede, what we do on price (usually: don't match).
8. Warning signs to monitor and who watches them.`)
  );

  server.registerPrompt(
    "exit_options",
    {
      title: "Exit options and acquirability",
      description: "Realistic view of exits: likelihood, who might buy and why, what founders would actually receive, and how to stay acquirable without building for a sale.",
      argsSchema: {
        company: z.string().describe("What you do, stage, revenue if any"),
        capTable: z.string().optional().describe("Money raised and preferences, if known"),
      },
    },
    ({ company, capTable }) =>
      user(`Assess exit options. Read get_playbook "acquisition-and-exits" first.

Company: ${company}${opt(capTable, "Funding / preferences")}

1. Base rates: likelihood of no exit, acquisition, IPO for a company like this. Plan in that order.
2. Plausible acquirers and their motive for each (technology, team, customers, removing a competitor). Is there a single-buyer risk? What happens if that buyer builds it instead?
3. Waterfall: if preferences are known, compute what common shareholders receive at sale prices of 0.5×, 1× and 2× total preferences. If they're underwater, say what carve-outs and retention terms to negotiate.
4. Regulatory exposure if the likely buyer is a dominant platform; reverse break fee; could we survive a failed deal?
5. If a license-and-hire offer came: what to get in writing for remaining employees and common shareholders.
6. Post-deal reality: retention evidence and what to negotiate (team kept together, separate unit, product continuity).
7. Acquirability checklist we fail today (cap table, IP assignment, finances, partnerships).
Verdict: should this company optimise for being acquired, stay acquirable, or ignore it for now?`)
  );
}
