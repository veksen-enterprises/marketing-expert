// Unit economics, paid-media break-even math and funnel analysis.
// Every function returns numbers plus `warnings`: the cases where the arithmetic is right
// but the conclusion people usually draw from it is wrong.

export interface UnitEconomicsInput {
  /** Average revenue per account per month. */
  arpaMonthly: number;
  /** 0–1. Use contribution margin if you have it. */
  grossMargin: number;
  /** Monthly logo (customer) churn, 0–1. */
  monthlyChurn: number;
  /** Monthly expansion revenue as a fraction of retained revenue (optional, 0–1). */
  monthlyExpansion?: number;
  /** Fully loaded CAC. Provide this or spend + newCustomers. */
  cac?: number;
  salesAndMarketingSpend?: number;
  newCustomers?: number;
  /** Cap for the horizon-bounded LTV. Default 60 months. */
  horizonMonths?: number;
  /** Annual discount rate for the bounded LTV (optional, e.g. 0.1). */
  annualDiscountRate?: number;
  /** Target CAC payback in months for the affordable-CAC calculation. Default 12. */
  targetPaybackMonths?: number;
}

export interface UnitEconomicsResult {
  /** null when no CAC or spend was given: see affordableCac instead of inventing one. */
  cac: number | null;
  monthlyGrossProfitPerAccount: number;
  expectedLifetimeMonths: number | null;
  ltvSimple: number | null;
  ltvBounded: number;
  horizonMonths: number;
  ltvToCacSimple: number | null;
  ltvToCacBounded: number | null;
  paybackMonthsSimple: number | null;
  /** Months until cumulative gross profit of a cohort (with churn) covers CAC; null if never within 240 months. */
  paybackMonthsChurnAdjusted: number | null;
  /** The most you can pay to acquire a customer under two common targets. Useful before CAC is known. */
  affordableCac: { targetPaybackMonths: number; maxCacForPayback: number; maxCacForLtvToCac3: number };
  warnings: string[];
}

export function unitEconomics(i: UnitEconomicsInput): UnitEconomicsResult {
  const warnings: string[] = [];
  if (!(i.arpaMonthly > 0)) throw new RangeError("arpaMonthly must be > 0");
  if (!(i.grossMargin > 0 && i.grossMargin <= 1)) throw new RangeError("grossMargin must be in (0,1]");
  if (!(i.monthlyChurn >= 0 && i.monthlyChurn < 1)) throw new RangeError("monthlyChurn must be in [0,1)");

  let cac: number | null = i.cac ?? null;
  if (cac === null && i.salesAndMarketingSpend !== undefined && i.newCustomers) cac = i.salesAndMarketingSpend / i.newCustomers;
  if (cac !== null && !(cac > 0)) throw new RangeError("cac must be > 0");

  const gp = i.arpaMonthly * i.grossMargin;
  const expansion = i.monthlyExpansion ?? 0;
  const netDecay = i.monthlyChurn - expansion; // net revenue churn per month
  const horizon = i.horizonMonths ?? 60;
  const monthlyDiscount = i.annualDiscountRate ? Math.pow(1 + i.annualDiscountRate, 1 / 12) - 1 : 0;

  let ltvSimple: number | null = null;
  let lifetime: number | null = null;
  if (i.monthlyChurn > 0) lifetime = 1 / i.monthlyChurn;
  if (netDecay > 0) ltvSimple = gp / netDecay;
  else if (i.monthlyChurn === 0 && expansion === 0)
    warnings.push("Monthly churn of 0 makes the textbook LTV infinite. No business has zero churn; use a measured churn rate, or rely on the horizon-bounded LTV.");
  else
    warnings.push(
      "Net revenue churn is <= 0 (expansion offsets churn), so the textbook LTV formula is infinite. Use the horizon-bounded LTV."
    );

  let ltvBounded = 0;
  for (let t = 0; t < horizon; t++) {
    ltvBounded += (gp * Math.pow(1 - netDecay, t)) / Math.pow(1 + monthlyDiscount, t);
  }

  let cumulative = 0;
  let paybackAdj: number | null = null;
  for (let t = 0; cac !== null && t < 240; t++) {
    cumulative += gp * Math.pow(1 - netDecay, t);
    // Relative tolerance: summed in floating point, 9 × 18.85 is 169.64999999999998, which would push payback a month late.
    if (cumulative >= cac * (1 - 1e-9)) {
      paybackAdj = t + 1;
      break;
    }
  }

  if (lifetime !== null && lifetime > horizon) {
    warnings.push(
      `Implied average lifetime is ${lifetime.toFixed(0)} months, longer than the ${horizon}-month horizon. ` +
        "Simple LTV assumes churn stays constant that long; you almost certainly lack the data to know. Prefer the bounded figure."
    );
  }
  if (i.monthlyChurn > 0 && i.monthlyChurn < 0.01) {
    warnings.push(
      "Monthly churn under 1% is usually measured on a young or small customer base; early cohorts often churn differently from later ones. Check churn by cohort before trusting LTV."
    );
  }
  if (i.grossMargin === 1) warnings.push("Gross margin of 100% overstates LTV; include hosting, support and payment costs.");
  if (cac === null) {
    warnings.push("No CAC given, so ratios and payback aren't computed. affordableCac shows the most you could pay per customer; compare channel costs against it rather than assuming a CAC.");
  } else if (i.cac === undefined) {
    warnings.push(
      "CAC computed as spend / new customers in the same period. If your sales cycle is long, lag spend by the cycle length, and make sure spend is fully loaded (salaries, tools, agencies)."
    );
  }

  const ratioBounded = cac === null ? null : ltvBounded / cac;
  const paybackSimple = cac === null ? null : cac / gp;
  if (cac !== null && paybackAdj === null) warnings.push("CAC is never paid back within 240 months at this churn rate.");
  else if (paybackAdj !== null && paybackAdj > horizon) warnings.push("Churn-adjusted payback is beyond the LTV horizon.");
  const targetPayback = i.targetPaybackMonths ?? 12;
  let maxCacForPayback = 0;
  for (let t = 0; t < targetPayback; t++) maxCacForPayback += gp * Math.pow(1 - netDecay, t);

  return {
    cac,
    monthlyGrossProfitPerAccount: gp,
    expectedLifetimeMonths: lifetime,
    ltvSimple,
    ltvBounded,
    horizonMonths: horizon,
    ltvToCacSimple: ltvSimple === null || cac === null ? null : ltvSimple / cac,
    ltvToCacBounded: ratioBounded,
    paybackMonthsSimple: paybackSimple,
    paybackMonthsChurnAdjusted: paybackAdj,
    affordableCac: { targetPaybackMonths: targetPayback, maxCacForPayback, maxCacForLtvToCac3: ltvBounded / 3 },
    warnings,
  };
}

export interface PaidMediaInput {
  /** Average order value (or first-period revenue per conversion). */
  aov?: number;
  /** 0–1. Contribution margin after COGS, fulfilment, payment fees. */
  margin?: number;
  /** Lifetime gross profit per customer, if repeat purchase matters. Overrides aov*margin for LTV-based limits. */
  ltvGrossProfit?: number;
  /** Click → conversion rate, 0–1. */
  cvr?: number;
  cpc?: number;
  cpm?: number;
  /** Impression → click rate, 0–1. */
  ctr?: number;
  budget?: number;
  /** Target CPA, if already decided. */
  targetCpa?: number;
}

export interface PaidMediaResult {
  breakEvenRoasFirstOrder: number | null;
  breakEvenCpaFirstOrder: number | null;
  breakEvenCpaLtv: number | null;
  maxCpcAtBreakEven: number | null;
  maxCpcAtTarget: number | null;
  impliedCpc: number | null;
  impliedCpa: number | null;
  impliedRoas: number | null;
  budgetProjection: { clicks: number; conversions: number | null; impressions: number | null } | null;
  verdict: string | null;
  warnings: string[];
}

export function paidMediaMath(i: PaidMediaInput): PaidMediaResult {
  const warnings: string[] = [];
  const firstOrderGp = i.aov !== undefined && i.margin !== undefined ? i.aov * i.margin : null;
  const breakEvenRoas = i.margin ? 1 / i.margin : null;
  const beCpaLtv = i.ltvGrossProfit ?? null;

  let cpc = i.cpc ?? null;
  if (cpc === null && i.cpm !== undefined && i.ctr) cpc = i.cpm / (1000 * i.ctr);
  const impliedCpa = cpc !== null && i.cvr ? cpc / i.cvr : null;
  const impliedRoas = impliedCpa !== null && i.aov !== undefined ? i.aov / impliedCpa : null;

  let budgetProjection: PaidMediaResult["budgetProjection"] = null;
  if (i.budget !== undefined && cpc) {
    const clicks = i.budget / cpc;
    budgetProjection = {
      clicks,
      conversions: i.cvr ? clicks * i.cvr : null,
      impressions: i.ctr ? clicks / i.ctr : i.cpm ? (i.budget / i.cpm) * 1000 : null,
    };
    if (budgetProjection.conversions !== null && budgetProjection.conversions < 50) {
      warnings.push(
        `Budget yields ~${budgetProjection.conversions.toFixed(0)} conversions. Platform bidding algorithms generally need dozens of conversions per week per campaign to optimise; consider optimising for a higher-funnel event or consolidating campaigns.`
      );
    }
  }

  let verdict: string | null = null;
  const limit = beCpaLtv ?? firstOrderGp;
  if (impliedCpa !== null && limit !== null) {
    const basis = beCpaLtv !== null ? "lifetime gross profit" : "first-order gross profit";
    verdict =
      impliedCpa <= limit
        ? `Implied CPA ${impliedCpa.toFixed(2)} is within break-even (${limit.toFixed(2)}, ${basis}); margin per conversion ${(limit - impliedCpa).toFixed(2)}.`
        : `Implied CPA ${impliedCpa.toFixed(2)} exceeds break-even (${limit.toFixed(2)}, ${basis}) by ${(impliedCpa - limit).toFixed(2)}. Each conversion loses money on this basis.`;
  }
  if (impliedRoas !== null) {
    warnings.push(
      "Platform-reported ROAS is attributed, not incremental. Part of those conversions would have happened anyway (especially brand search and retargeting). Validate with a holdout or geo test before scaling."
    );
  }
  if (beCpaLtv !== null) {
    warnings.push("LTV-based CPA limits assume you can finance the payback period and that the LTV estimate holds for customers from this channel.");
  }

  return {
    breakEvenRoasFirstOrder: breakEvenRoas,
    breakEvenCpaFirstOrder: firstOrderGp,
    breakEvenCpaLtv: beCpaLtv,
    maxCpcAtBreakEven: limit !== null && i.cvr ? limit * i.cvr : null,
    maxCpcAtTarget: i.targetCpa !== undefined && i.cvr ? i.targetCpa * i.cvr : null,
    impliedCpc: cpc,
    impliedCpa,
    impliedRoas,
    budgetProjection,
    verdict,
    warnings,
  };
}

export interface FunnelStage {
  name: string;
  count: number;
}

export interface FunnelResult {
  stages: Array<{
    name: string;
    count: number;
    stepRate: number | null;
    cumulativeRate: number;
    lostFromPrevious: number | null;
    costPer: number | null;
  }>;
  overallRate: number;
  largestAbsoluteDrop: string | null;
  lowestStepRate: string | null;
  /** Extra end-of-funnel conversions from a relative improvement of `improvement` at any single step that has room for it (see gainByStep). */
  gainFromImprovingAnyStep: number;
  /** Extra end conversions from the improvement at each step; capped where the step rate would pass 100%. */
  gainByStep: Array<{ step: string; gain: number; capped: boolean }>;
  improvement: number;
  notes: string[];
}

export function analyzeFunnel(stages: FunnelStage[], spend?: number, improvement = 0.1): FunnelResult {
  if (stages.length < 2) throw new RangeError("need at least 2 stages");
  const notes: string[] = [];
  const top = stages[0].count;
  if (!(top > 0)) throw new RangeError("first stage count must be > 0");
  let maxDrop = 0;
  let maxDropName: string | null = null;
  let minRate = Infinity;
  let minRateName: string | null = null;
  const out = stages.map((s, idx) => {
    const prev = idx > 0 ? stages[idx - 1].count : null;
    if (prev !== null && s.count > prev) {
      notes.push(`"${s.name}" (${s.count}) is larger than the previous stage (${prev}). Stages probably aren't the same population or time window.`);
    }
    const stepRate = prev ? s.count / prev : null;
    const lost = prev !== null ? prev - s.count : null;
    if (lost !== null && lost > maxDrop) {
      maxDrop = lost;
      maxDropName = `${stages[idx - 1].name} → ${s.name}`;
    }
    if (stepRate !== null && stepRate < minRate) {
      minRate = stepRate;
      minRateName = `${stages[idx - 1].name} → ${s.name}`;
    }
    return {
      name: s.name,
      count: s.count,
      stepRate,
      cumulativeRate: s.count / top,
      lostFromPrevious: lost,
      costPer: spend !== undefined && s.count > 0 ? spend / s.count : null,
    };
  });
  const final = stages[stages.length - 1].count;
  // A step rate can't pass 100%, so a step near 100% has less room than `improvement`.
  const gainByStep = out.slice(1).map((s, idx) => {
    const r = s.stepRate;
    const step = `${stages[idx].name} → ${s.name}`;
    if (!r) return { step, gain: 0, capped: false };
    const capped = r * (1 + improvement) > 1;
    return { step, gain: final * (Math.min(r * (1 + improvement), 1) / r - 1), capped };
  });
  const capped = gainByStep.filter((g) => g.capped);
  const pctLabel = `${Number((improvement * 100).toPrecision(3))}%`;
  notes.push(
    `In a multiplicative funnel, a ${pctLabel} relative improvement at any single step adds the same ${(final * improvement).toFixed(1)} end conversions` +
      (capped.length
        ? `, except where the step rate would pass 100%: ${capped.map((g) => `${g.step} can add at most ${g.gain.toFixed(1)}`).join("; ")}. `
        : ". ") +
      "Choose the step by how cheaply and confidently it can be improved, and by how far it sits below a credible benchmark for your context, not by the size of the raw drop-off."
  );
  notes.push("The largest absolute drop is almost always at the top of the funnel; that alone doesn't make it the best place to work.");
  return {
    stages: out,
    overallRate: final / top,
    largestAbsoluteDrop: maxDropName,
    lowestStepRate: minRateName,
    gainFromImprovingAnyStep: final * improvement,
    gainByStep,
    improvement,
    notes,
  };
}
