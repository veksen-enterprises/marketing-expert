import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Prompts are workflows: they fix the ORDER of thinking, which is where most marketing advice goes
// wrong (tactics before diagnosis, copy before positioning, tests before power analysis).

function user(text: string) {
  return { messages: [{ role: "user" as const, content: { type: "text" as const, text } }] };
}

const opt = (s: string | undefined, label: string) => (s ? `\n${label}: ${s}` : "");

export function registerPrompts(server: McpServer): void {
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
3. Identify the constraint. It is usually one of: nobody understands what it is or who it's for (positioning); not enough of the right people see it (reach/channel); they see it but don't act (offer, page, friction); they act but don't stay (retention/product, so stop buying acquisition); the numbers don't work (unit economics). Use funnel_analysis and unit_economics if numbers exist. Name the evidence for your call and what would falsify it.
4. Recommend at most two moves against that constraint: the mechanism, the cost, the metric to watch, and the result by which you'd call it a failure. search_playbooks for the relevant playbook and cite it.
5. Say what NOT to do yet, and why.`)
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
1. The 5-second read: from the lead text and h1 alone, what does a first-time visitor think this is, who it's for, and what to do next? Quote the page.
2. Message match: does the headline continue what the traffic source promised? If the source is unknown, say what to check.
3. Run analyze_copy on the lead text. Note vague claims, missing proof, writer-centric framing.
4. Offer and CTA: is there one primary action, and is it clear what the visitor gets and what it costs them (time, money, data)?
5. Proof and objections: what objections would this audience have (price, switching cost, risk, credibility), and where are they answered?
6. Friction: forms, steps, speed, mobile. Use the audit flags.
7. Technical/SEO flags from the audit that matter for this page's job (ignore the rest).
Finish with the top 3 changes ranked by expected impact × confidence, each with a hypothesis in the form "Because [evidence], changing [X] for [audience] will improve [metric]", and say which deserve an A/B test versus just shipping. Use ab_test_sample_size if traffic numbers are known.`)
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
}
