import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { sampleSizeTwoProportions, twoProportionTest, sampleRatioMismatch, minimumDetectableEffect } from "./lib/stats.js";
import { unitEconomics, paidMediaMath, analyzeFunnel } from "./lib/economics.js";
import { analyzeCopy, checkLimits } from "./lib/copy.js";
import { PLATFORM_LIMITS } from "./lib/platformLimits.js";
import { buildUtm } from "./lib/utm.js";
import { auditHtml, fetchAndAudit } from "./lib/pageAudit.js";
import { marketSize } from "./lib/marketSize.js";
import { loadPlaybooks, getPlaybook, searchKnowledge } from "./lib/knowledge.js";
import { registerPrompts } from "./prompts.js";

export const INSTRUCTIONS = `You are acting as a senior marketing strategist. This server gives you calculators, page and copy audits, and opinionated playbooks with sources. How to work:

1. Diagnose before prescribing. Establish the product, the customer (ICP), the competitive alternatives, the current numbers, and the actual constraint (traffic, conversion, retention, margin, positioning) before recommending tactics. Ask for the numbers you need; do not invent them.
2. Use the tools for anything numeric. Never estimate sample sizes, significance, LTV, CAC payback, break-even CPA/ROAS or funnel effects in your head. Report their warnings.
3. Look before critiquing. For a live page, run audit_page and critique what is there. For copy, run analyze_copy and, for ads, check_copy_limits.
4. Ground strategy in the playbooks (search_playbooks / get_playbook). Say how strong the evidence is: controlled research, a practitioner rule of thumb, or vendor data. Benchmarks are context, not targets.
5. Be specific and ranked. Give the one or two highest-leverage moves with the mechanism, what to measure, and what result would change your mind. Do not hand back a list of 15 generic tactics.
6. Prefer incrementality over attribution, retention over acquisition when retention is broken, and positioning fixes over copy tweaks when the problem is that nobody understands what the product is for.
7. Plain language. No hype words in your own output. Avoid jargon a non-native English speaker may not know: say "defensibility" or "what stops competitors copying you", never "moat"; say what a "flywheel" or "wedge" actually is instead of using the word.`;

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, round, 2) }] };
}

function fail(e: unknown) {
  return { isError: true, content: [{ type: "text" as const, text: e instanceof Error ? e.message : String(e) }] };
}

function round(_k: string, v: unknown) {
  if (typeof v === "number" && Number.isFinite(v) && !Number.isInteger(v)) return Number(v.toPrecision(5));
  return v;
}

function safe<A>(fn: (args: A) => unknown | Promise<unknown>) {
  return async (args: A) => {
    try {
      return ok(await fn(args));
    } catch (e) {
      return fail(e);
    }
  };
}

const rate = z.number().gt(0).lt(1);
const readOnly = { readOnlyHint: true, openWorldHint: false } as const;

export function createServer(): McpServer {
  const server = new McpServer({ name: "marketing-expert", version: "0.1.0" }, { instructions: INSTRUCTIONS });

  // ── Experimentation ────────────────────────────────────────────────────────
  server.registerTool(
    "ab_test_sample_size",
    {
      title: "A/B test sample size",
      description:
        "Visitors needed per arm to detect a given lift in a conversion rate (two-sided two-proportion z-test). Also returns duration if daily traffic is given. Use BEFORE launching a test, and to tell someone their traffic can't support the test they want.",
      inputSchema: {
        baselineRate: rate.describe("Current conversion rate, e.g. 0.035"),
        mde: z.number().gt(0).describe("Minimum detectable effect. Relative by default (0.1 = +10%)"),
        mdeIsAbsolute: z.boolean().optional().describe("Treat mde as absolute percentage points (0.005 = +0.5pp)"),
        alpha: rate.optional().describe("Significance level, default 0.05"),
        power: rate.optional().describe("Statistical power, default 0.8"),
        variants: z.number().int().min(2).optional().describe("Arms including control, default 2"),
        correctForMultipleComparisons: z.boolean().optional().describe("Bonferroni-adjust alpha across variant-vs-control comparisons"),
        dailyTrafficTotal: z.number().positive().optional().describe("Eligible visitors per day across all arms"),
      },
      annotations: readOnly,
    },
    safe((a) => {
      const r = sampleSizeTwoProportions(a);
      const notes: string[] = [];
      let days: number | null = null;
      if (a.dailyTrafficTotal) {
        days = Math.ceil(r.total / a.dailyTrafficTotal);
        const weeks = Math.max(1, Math.ceil(days / 7));
        notes.push(`Run for whole weeks to cover weekday/weekend differences: plan ${weeks} week(s).`);
        if (days > 56) {
          const mde4w = minimumDetectableEffect(a.baselineRate, Math.floor((a.dailyTrafficTotal * 28) / (a.variants ?? 2)), a.alpha, a.power);
          notes.push(
            `This takes ${days} days. Tests running past ~8 weeks suffer from cookie churn and seasonal drift. ` +
              (mde4w ? `With 4 weeks of traffic the smallest detectable relative lift is ~${(mde4w * 100).toFixed(1)}%. ` : "") +
              "Options: test a bolder change, test on a higher-traffic upstream metric, or ship on judgement and monitor."
          );
        }
      }
      notes.push("Fix this sample size in advance and evaluate once. Checking repeatedly and stopping at the first p<0.05 inflates false positives (10 looks ≈ 26% false positive rate at nominal 5%).");
      return { ...r, estimatedDays: days, notes };
    })
  );

  server.registerTool(
    "ab_test_evaluate",
    {
      title: "Evaluate A/B test results",
      description:
        "Significance, confidence intervals and probability-to-beat-control for a finished conversion-rate test, plus sample ratio mismatch (SRM) check and peeking warnings. Use this instead of eyeballing lift.",
      inputSchema: {
        control: z.object({ visitors: z.number().int().positive(), conversions: z.number().int().min(0) }),
        variant: z.object({ visitors: z.number().int().positive(), conversions: z.number().int().min(0) }),
        alpha: rate.optional(),
        expectedSplit: z.array(z.number().positive()).length(2).optional().describe("Intended allocation weights [control, variant], default [1,1]"),
        plannedSamplePerArm: z.number().int().positive().optional().describe("Sample size fixed before launch, if any"),
      },
      annotations: readOnly,
    },
    safe((a) => {
      const t = twoProportionTest(a.control, a.variant, a.alpha ?? 0.05);
      const srm = sampleRatioMismatch([a.control.visitors, a.variant.visitors], a.expectedSplit);
      const warnings: string[] = [];
      if (srm.mismatch) {
        warnings.push(
          `Sample ratio mismatch (p=${srm.pValue.toExponential(2)}): traffic split differs from the intended allocation. The randomisation or tracking is broken; do not trust the result until the cause is found (bots, redirects, a variant that crashes, tracking firing differently).`
        );
      }
      const minArm = Math.min(a.control.visitors, a.variant.visitors);
      if (a.plannedSamplePerArm && minArm < a.plannedSamplePerArm) {
        warnings.push(`Only ${minArm} of ${a.plannedSamplePerArm} planned visitors per arm. Reading results early inflates false positives; a "significant" result now is weak evidence.`);
      }
      if (!a.plannedSamplePerArm) warnings.push("No pre-planned sample size given. If this test was stopped when it looked significant, the p-value is not valid.");
      if (Math.min(a.control.conversions, a.variant.conversions) < 100) warnings.push("Fewer than 100 conversions in an arm; estimates are noisy and the normal approximation is rough.");
      if (t.significant && Math.abs(t.relativeLift) > 0.3) warnings.push("Lift above 30% is rare for real changes (Twyman's law). Check for tracking bugs or a broken control before celebrating.");
      if (t.significant && t.relativeLiftCI) warnings.push(`Plan around the low end of the interval (${(t.relativeLiftCI[0] * 100).toFixed(1)}%), not the point estimate. Significant winners' observed lifts are biased upward.`);
      return { ...t, srm, warnings };
    })
  );

  // ── Economics ─────────────────────────────────────────────────────────────
  server.registerTool(
    "unit_economics",
    {
      title: "LTV, CAC, payback",
      description:
        "Customer lifetime value (simple and horizon-bounded), LTV:CAC, and CAC payback (simple and churn-adjusted) for subscription businesses. Returns warnings where the standard formulas mislead.",
      inputSchema: {
        arpaMonthly: z.number().positive().describe("Average revenue per account per month"),
        grossMargin: z.number().gt(0).lte(1).describe("0–1"),
        monthlyChurn: z.number().min(0).lt(1).describe("Monthly logo churn, 0–1. Annual churn A → monthly = 1-(1-A)^(1/12)"),
        monthlyExpansion: z.number().min(0).lt(1).optional(),
        cac: z.number().positive().optional(),
        salesAndMarketingSpend: z.number().positive().optional(),
        newCustomers: z.number().positive().optional(),
        horizonMonths: z.number().int().positive().max(240).optional(),
        annualDiscountRate: z.number().min(0).lt(1).optional(),
      },
      annotations: readOnly,
    },
    safe((a) => ({
      ...unitEconomics(a),
      context:
        "Benchmarks are investor heuristics, not laws: LTV:CAC ≈ 3:1 is a rule of thumb; Bessemer frames CAC payback 0–6 months best, 6–12 better, 12–18 good. KeyBanc/Sapphire 2025 survey median payback was reported at ~18 months (self-reported, private SaaS). See playbook 'metrics-and-measurement'.",
    }))
  );

  server.registerTool(
    "paid_media_math",
    {
      title: "Paid media break-even",
      description:
        "Break-even ROAS and CPA, max affordable CPC, implied CPA/ROAS from CPC or CPM+CTR, and budget projections. Use to sanity-check a paid channel before or while spending.",
      inputSchema: {
        aov: z.number().positive().optional().describe("Average order value / first-period revenue per conversion"),
        margin: z.number().gt(0).lte(1).optional().describe("Contribution margin 0–1"),
        ltvGrossProfit: z.number().positive().optional().describe("Lifetime gross profit per customer"),
        cvr: rate.optional().describe("Click → conversion rate"),
        cpc: z.number().positive().optional(),
        cpm: z.number().positive().optional(),
        ctr: rate.optional(),
        budget: z.number().positive().optional(),
        targetCpa: z.number().positive().optional(),
      },
      annotations: readOnly,
    },
    safe((a) => paidMediaMath(a))
  );

  server.registerTool(
    "funnel_analysis",
    {
      title: "Funnel analysis",
      description: "Step and cumulative conversion, losses, cost per stage, and the effect of improving a step. Stages must be the same cohort/time window, ordered top to bottom.",
      inputSchema: {
        stages: z.array(z.object({ name: z.string(), count: z.number().min(0) })).min(2),
        spend: z.number().positive().optional(),
        improvement: z.number().positive().max(5).optional().describe("Relative improvement to model at a single step, default 0.1"),
      },
      annotations: readOnly,
    },
    safe((a) => analyzeFunnel(a.stages, a.spend, a.improvement))
  );

  server.registerTool(
    "market_size",
    {
      title: "Market sizing (bottom-up)",
      description:
        "Bottom-up TAM/SAM by segment, obtainable market bounded by sales capacity and/or acquisition budget (with churn), top-down cross-check, and the penetration a revenue target implies. Use instead of quoting analyst TAMs.",
      inputSchema: {
        segments: z
          .array(
            z.object({
              name: z.string(),
              accounts: z.number().positive().describe("Potential buying accounts"),
              annualValue: z.number().positive().describe("Annual revenue per account (ACV)"),
              serviceableShare: z.number().min(0).max(1).optional().describe("Share you can serve today, 0–1"),
              source: z.string().optional().describe("Where the account count came from"),
            })
          )
          .min(1),
        topDownAnnualSpend: z.number().positive().optional(),
        horizonYears: z.number().int().min(1).max(15).optional(),
        salesCapacity: z.object({ reps: z.number().positive(), dealsPerRepPerYear: z.number().positive() }).optional(),
        acquisitionBudget: z.object({ annualBudget: z.number().positive(), cac: z.number().positive() }).optional(),
        annualChurn: z.number().min(0).lt(1).optional(),
        revenueTarget: z.number().positive().optional(),
      },
      annotations: readOnly,
    },
    safe((a) => marketSize(a))
  );

  // ── Copy ──────────────────────────────────────────────────────────────────
  server.registerTool(
    "analyze_copy",
    {
      title: "Analyze copy",
      description:
        "Deterministic signals on marketing copy: readability (Flesch, grade), sentence length, vague/hype terms, hedges, passive voice, we-vs-you framing, absence of numbers. Use as input to your critique, not as the critique itself.",
      inputSchema: { text: z.string().min(1).max(50000) },
      annotations: readOnly,
    },
    safe((a) => analyzeCopy(a.text))
  );

  const platforms = Object.keys(PLATFORM_LIMITS) as [string, ...string[]];
  server.registerTool(
    "check_copy_limits",
    {
      title: "Check copy against platform limits",
      description:
        "Check ad, SERP, email or social copy against platform character limits (Google Ads counts CJK as 2; X counts URLs as 23). Fields by platform: " +
        Object.entries(PLATFORM_LIMITS)
          .map(([k, v]) => `${k}: ${Object.keys(v.fields).join(", ")}`)
          .join(" | "),
      inputSchema: {
        platform: z.enum(platforms),
        fields: z.record(z.string(), z.union([z.string(), z.array(z.string())])).describe('e.g. {"headline": ["...", "..."], "description": "..."}'),
      },
      annotations: readOnly,
    },
    safe((a) => checkLimits(a.platform, a.fields))
  );

  server.registerTool(
    "build_utm_link",
    {
      title: "Build UTM link",
      description: "Build a tagged URL with naming hygiene (lowercase, no spaces, GA4-recognised mediums). Warns about values that will break channel grouping.",
      inputSchema: {
        url: z.string(),
        source: z.string().min(1),
        medium: z.string().min(1),
        campaign: z.string().min(1),
        term: z.string().optional(),
        content: z.string().optional(),
        id: z.string().optional(),
      },
      annotations: readOnly,
    },
    safe((a) => buildUtm(a))
  );

  // ── Page audit ────────────────────────────────────────────────────────────
  server.registerTool(
    "audit_page",
    {
      title: "Audit a landing page",
      description:
        "Fetch a URL (or take raw HTML) and extract what a landing-page/SEO review needs: title, meta, headings, lead text, CTAs, forms, OG tags, structured data, indexability, plus objective flags. Only sees server-rendered HTML.",
      inputSchema: {
        url: z.string().optional().describe("http(s) URL to fetch"),
        html: z.string().optional().describe("Raw HTML instead of fetching"),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    safe(async (a) => {
      if (a.html) return auditHtml(a.html, a.url);
      if (!a.url) throw new Error("provide url or html");
      return fetchAndAudit(a.url);
    })
  );

  // ── Knowledge ─────────────────────────────────────────────────────────────
  server.registerTool(
    "search_playbooks",
    {
      title: "Search marketing playbooks",
      description:
        "Keyword search over the playbooks (positioning, messaging, landing pages, experimentation, metrics, channels, SEO, email, paid, pricing, brand, launches, research). Returns the best-matching sections with source notes.",
      inputSchema: { query: z.string().min(2), limit: z.number().int().min(1).max(10).optional() },
      annotations: readOnly,
    },
    safe((a) => searchKnowledge(a.query, a.limit ?? 4).map((h) => ({ playbook: h.slug, section: h.heading, score: h.score, text: h.text })))
  );

  server.registerTool(
    "get_playbook",
    {
      title: "Get a playbook",
      description: "Full text of one playbook. Call with no slug to list available playbooks.",
      inputSchema: { slug: z.string().optional() },
      annotations: readOnly,
    },
    safe((a) => {
      if (!a.slug) return loadPlaybooks().map((p) => ({ slug: p.slug, title: p.title, summary: p.summary }));
      const p = getPlaybook(a.slug);
      if (!p) throw new Error(`no playbook "${a.slug}". Available: ${loadPlaybooks().map((x) => x.slug).join(", ")}`);
      return { slug: p.slug, title: p.title, body: p.body };
    })
  );

  server.registerResource(
    "playbook",
    new ResourceTemplate("marketing://playbook/{slug}", {
      list: async () => ({
        resources: loadPlaybooks().map((p) => ({ uri: `marketing://playbook/${p.slug}`, name: p.title, description: p.summary, mimeType: "text/markdown" })),
      }),
    }),
    { title: "Marketing playbook", description: "Opinionated, sourced marketing playbooks", mimeType: "text/markdown" },
    async (uri, { slug }) => {
      const p = getPlaybook(String(slug));
      if (!p) throw new Error(`no playbook "${slug}"`);
      return { contents: [{ uri: uri.href, mimeType: "text/markdown", text: `# ${p.title}\n\n${p.body}` }] };
    }
  );

  registerPrompts(server);
  return server;
}
