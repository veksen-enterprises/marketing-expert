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
  /** Lifetime deal: one-time price per unit (seat or account). */
  oneTimePrice?: number;
  /** Lifetime deal: monthly cost of serving one unit. Default arpaMonthly × (1 − grossMargin). */
  monthlyCostToServe?: number;
  /** Lifetime deal: most units that will be sold. */
  unitsCap?: number;
  /** Named variants of these inputs; each inherits every input it doesn't override. */
  scenarios?: Array<{ name: string } & Partial<Omit<UnitEconomicsInput, "scenarios">>>;
}

export interface LifetimeDealResult {
  oneTimePrice: number;
  monthlyCostToServe: number;
  horizonMonths: number;
  /** Expected cost of serving one unit over the horizon, with buyers dropping off at monthlyChurn. */
  expectedServingCostPerUnit: number;
  netValuePerUnit: number;
  /** netValuePerUnit / the subscriber's ltvBounded. Below 1: a buyer who would have subscribed is worth less on the deal. */
  ratioToSubscriberLtv: number;
  /** Monthly drop-off in use at which the price just covers serving cost over the horizon; 0 if it covers it even when nobody leaves. Below this, the deal loses money. */
  breakEvenMonthlyChurn: number | null;
  /** Month in which the serving cost of a buyer who keeps using it passes the price; null if serving is free. */
  monthServingCostExceedsPrice: number | null;
  /** servingCost is discounted and churn-adjusted; worstCaseServingCost is every unit used for the whole horizon, undiscounted. */
  exposureAtCap: { units: number; servingCost: number; worstCaseServingCost: number; netValue: number } | null;
}

export interface ScenarioRow {
  name: string;
  /** Inputs that differ from the base, as "field: base -> scenario". */
  assumptionDiff: string[];
  ltvBounded: number;
  ltvToCacBounded: number | null;
  paybackMonthsChurnAdjusted: number | null;
  maxCacForPayback: number;
  minArpaForPayback: number | null;
  /** Lifetime deal net value per unit under this scenario's inputs; null without oneTimePrice. */
  lifetimeDealNetValuePerUnit: number | null;
  warnings: string[];
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
  /** The most you can pay to acquire a customer under two common targets. Useful before CAC is known. maxCacForLtvToCac3 is ltvBounded / 3. */
  affordableCac: { targetPaybackMonths: number; maxCacForPayback: number; maxCacForLtvToCac3: number; cacBasis: "ltvBounded"; ltvUsedForCac: number };
  /** Lowest monthly price (ARPA) at which this CAC pays back within targetPaybackMonths; null without a CAC. */
  minArpaForPayback: number | null;
  /** Lowest monthly price at which bounded LTV is 3× this CAC; null without a CAC. */
  minArpaForLtvToCac3: number | null;
  scenarios?: ScenarioRow[];
  lifetimeDeal?: LifetimeDealResult;
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
  // Both figures scale linearly with ARPA (expansion is a fraction of revenue), so the minimum price is a ratio.
  const minArpaForPayback = cac === null ? null : (i.arpaMonthly * cac) / maxCacForPayback;
  const minArpaForLtvToCac3 = cac === null ? null : (i.arpaMonthly * 3 * cac) / ltvBounded;

  let lifetimeDeal: LifetimeDealResult | undefined;
  if (i.oneTimePrice !== undefined) {
    if (!(i.oneTimePrice > 0)) throw new RangeError("oneTimePrice must be > 0");
    const cost = i.monthlyCostToServe ?? i.arpaMonthly * (1 - i.grossMargin);
    if (!(cost >= 0)) throw new RangeError("monthlyCostToServe must be >= 0");
    // Serving cost over the horizon when buyers stop using it at `churn` a month.
    const servingCost = (churn: number) => {
      let c = 0;
      for (let t = 0; t < horizon; t++) c += (cost * Math.pow(1 - churn, t)) / Math.pow(1 + monthlyDiscount, t);
      return c;
    };
    const expected = servingCost(i.monthlyChurn);
    const net = i.oneTimePrice - expected;
    let breakEvenChurn: number | null = null;
    if (servingCost(0) <= i.oneTimePrice) breakEvenChurn = 0;
    else if (servingCost(0.999) <= i.oneTimePrice) {
      let lo = 0;
      let hi = 0.999;
      for (let k = 0; k < 100; k++) {
        const mid = (lo + hi) / 2;
        if (servingCost(mid) > i.oneTimePrice) lo = mid;
        else hi = mid;
      }
      breakEvenChurn = hi;
    }
    const cap = i.unitsCap;
    if (cap !== undefined && !(cap > 0)) throw new RangeError("unitsCap must be > 0");
    lifetimeDeal = {
      oneTimePrice: i.oneTimePrice,
      monthlyCostToServe: cost,
      horizonMonths: horizon,
      expectedServingCostPerUnit: expected,
      netValuePerUnit: net,
      ratioToSubscriberLtv: net / ltvBounded,
      breakEvenMonthlyChurn: breakEvenChurn,
      monthServingCostExceedsPrice: cost > 0 ? Math.floor(i.oneTimePrice / cost) + 1 : null,
      exposureAtCap: cap === undefined ? null : { units: cap, servingCost: cap * expected, worstCaseServingCost: cap * cost * horizon, netValue: cap * net },
    };
    if (i.monthlyCostToServe === undefined) warnings.push(`monthlyCostToServe not given; assumed ${cost.toFixed(2)} (arpaMonthly × (1 − grossMargin)).`);
    if (net < 0) warnings.push(`At ${(i.monthlyChurn * 100).toFixed(1)}% monthly churn, serving a lifetime buyer for ${horizon} months costs ${expected.toFixed(2)}, more than the ${i.oneTimePrice.toFixed(2)} price: each unit sold loses money.`);
    else if (net < ltvBounded)
      warnings.push(
        `A lifetime deal nets ${net.toFixed(2)} per unit over ${horizon} months, less than the ${ltvBounded.toFixed(2)} bounded LTV of a subscriber. Each buyer who would otherwise have subscribed costs you ${(ltvBounded - net).toFixed(2)}.`
      );
    if (cap === undefined) warnings.push("No unitsCap: the serving cost has no upper limit. Set a cap, and if the offer says spots are limited, make that true.");
  }

  let scenarios: ScenarioRow[] | undefined;
  if (i.scenarios?.length) {
    const { scenarios: list, ...base } = i;
    scenarios = list.map(({ name, ...over }) => {
      const r = unitEconomics({ ...base, ...over });
      const diff = Object.entries(over)
        .filter(([k, v]) => v !== undefined && v !== base[k as keyof typeof base])
        .map(([k, v]) => `${k}: ${base[k as keyof typeof base] ?? "not set"} -> ${v}`);
      return {
        name,
        assumptionDiff: diff,
        ltvBounded: r.ltvBounded,
        ltvToCacBounded: r.ltvToCacBounded,
        paybackMonthsChurnAdjusted: r.paybackMonthsChurnAdjusted,
        maxCacForPayback: r.affordableCac.maxCacForPayback,
        minArpaForPayback: r.minArpaForPayback,
        lifetimeDealNetValuePerUnit: r.lifetimeDeal?.netValuePerUnit ?? null,
        warnings: r.warnings,
      };
    });
  }

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
    affordableCac: { targetPaybackMonths: targetPayback, maxCacForPayback, maxCacForLtvToCac3: ltvBounded / 3, cacBasis: "ltvBounded", ltvUsedForCac: ltvBounded },
    minArpaForPayback,
    minArpaForLtvToCac3,
    ...(scenarios ? { scenarios } : {}),
    ...(lifetimeDeal ? { lifetimeDeal } : {}),
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
  /** "subscription": aov is one month's revenue (payback and churn are monthly). Inferred when monthlyChurn is given. */
  billingModel?: "one-time" | "subscription";
  /** Subscription mode: monthly churn 0–1, for payback months at the implied CPA. */
  monthlyChurn?: number;
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
  /** Conversion rate at which the given CPC just breaks even (CPC / break-even CPA). */
  requiredCvrAtCpc: number | null;
  billingModel: "one-time" | "subscription";
  /** Subscription mode: the first-order figures, labelled for the first month. */
  breakEvenCpaFirstPeriod?: number | null;
  breakEvenRoasFirstPeriod?: number | null;
  /** Subscription mode: months of gross profit (with churn) to recover the implied CPA; null if not within 240 months. */
  paybackMonthsAtImpliedCpa?: number | null;
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

  const subscription = i.billingModel === "subscription" || (i.billingModel === undefined && i.monthlyChurn !== undefined);
  if (i.monthlyChurn !== undefined && !(i.monthlyChurn >= 0 && i.monthlyChurn < 1)) throw new RangeError("monthlyChurn must be in [0,1)");
  let verdict: string | null = null;
  const limit = beCpaLtv ?? firstOrderGp;
  const requiredCvr = cpc !== null && limit ? cpc / limit : null;
  let paybackMonths: number | null = null;
  if (subscription && impliedCpa !== null && firstOrderGp) {
    let cum = 0;
    for (let t = 0; t < 240; t++) {
      cum += firstOrderGp * Math.pow(1 - (i.monthlyChurn ?? 0), t);
      if (cum >= impliedCpa * (1 - 1e-9)) {
        paybackMonths = t + 1;
        break;
      }
    }
  }
  const months = (n: number) => `${n} month${n === 1 ? "" : "s"}`;
  const paybackText = paybackMonths !== null ? `At this CPA a customer pays back in ${months(paybackMonths)} of gross profit.` : "At this CPA a customer does not pay back within 240 months.";
  if (impliedCpa !== null && limit !== null && subscription && beCpaLtv === null) {
    // Without a lifetime figure, one month's gross profit is not a break-even for a subscription: lead with payback.
    verdict =
      `If CPC is ${cpc!.toFixed(2)} and CVR is ${pctLabel(i.cvr!)}: ${paybackText} ` +
      `Implied CPA ${impliedCpa.toFixed(2)}, first-month gross profit ${limit.toFixed(2)}. ` +
      `It pays back within the first month at CVR ≥ ${pctLabel(requiredCvr!)} at this CPC, or CPC ≤ ${(limit * i.cvr!).toFixed(2)} at this CVR.`;
  } else if (impliedCpa !== null && limit !== null) {
    const basis = beCpaLtv !== null ? "lifetime gross profit" : "first-order gross profit";
    // The verdict holds only if the CPC and CVR it rests on hold, so say so and give both thresholds.
    verdict =
      `If CPC is ${cpc!.toFixed(2)} and CVR is ${pctLabel(i.cvr!)}: ` +
      (impliedCpa <= limit
        ? `Implied CPA ${impliedCpa.toFixed(2)} is within break-even (${limit.toFixed(2)}, ${basis}); margin per conversion ${(limit - impliedCpa).toFixed(2)}.`
        : `Implied CPA ${impliedCpa.toFixed(2)} exceeds break-even (${limit.toFixed(2)}, ${basis}) by ${(impliedCpa - limit).toFixed(2)}. Each conversion loses money on this basis.`) +
      ` It breaks even at CVR ≥ ${pctLabel(requiredCvr!)} at this CPC, or CPC ≤ ${(limit * i.cvr!).toFixed(2)} at this CVR.`;
    if (subscription && firstOrderGp) verdict += ` ${paybackText}`;
  }
  if (requiredCvr !== null && requiredCvr > 1) warnings.push("Break-even would need a conversion rate above 100% at this CPC: no conversion rate makes this channel pay on this basis.");
  if (subscription) {
    warnings.push(
      "Subscription: aov is treated as one month's revenue per customer (for an annual plan, divide the price by 12), so the first-order break-even CPA and ROAS cover the first month only (breakEvenCpaFirstPeriod). Use paybackMonthsAtImpliedCpa or ltvGrossProfit to judge the channel."
    );
    if (i.monthlyChurn === undefined && impliedCpa !== null) warnings.push("No monthlyChurn given, so payback assumes no customer leaves.");
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
    requiredCvrAtCpc: requiredCvr,
    billingModel: subscription ? "subscription" : "one-time",
    ...(subscription
      ? { breakEvenCpaFirstPeriod: firstOrderGp, breakEvenRoasFirstPeriod: breakEvenRoas, paybackMonthsAtImpliedCpa: impliedCpa !== null && firstOrderGp ? paybackMonths : null }
      : {}),
    verdict,
    warnings,
  };
}

/** "2.5%", "0.375%": up to three significant digits, no trailing zeros. */
function pctLabel(x: number): string {
  return `${Number((x * 100).toPrecision(3))}%`;
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
  notes.push(
    `In a multiplicative funnel, a ${pctLabel(improvement)} relative improvement at any single step adds the same ${(final * improvement).toFixed(1)} end conversions` +
      (capped.length
        ? `, except where the step rate would pass 100%: ${capped.map((g) => `${g.step} can add at most ${g.gain.toFixed(1)}`).join("; ")}. `
        : ". ") +
      "Choose the step by how cheaply and confidently it can be improved, and by how far it sits below a credible benchmark for your context, not by the size of the raw drop-off."
  );
  notes.push("The largest absolute drop is almost always at the top of the funnel; that alone doesn't make it the best place to work.");
  const fractional = stages.filter((s) => !Number.isInteger(s.count));
  if (fractional.length) {
    notes.push(
      `Stage counts should be whole numbers: ${fractional.map((s) => `"${s.name}" is ${s.count}`).join(", ")}. If these are estimates or averages rather than counts, say so when you quote the result.`
    );
  }
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

export interface ReverseFunnelResult {
  mode: "inverse";
  targetOutput: number;
  stages: Array<{ name: string; stepRate: number | null; countNeeded: number }>;
  topOfFunnelNeeded: number;
  notes: string[];
}

/** Inverse funnel: how many are needed at each stage to end with `targetOutput`, given the step rates (rounded up at each stage). */
export function reverseFunnel(stepRates: number[], targetOutput: number, names?: string[]): ReverseFunnelResult {
  if (!stepRates.length) throw new RangeError("give at least one step rate");
  for (const r of stepRates) if (!(r > 0 && r <= 1)) throw new RangeError("each step rate must be > 0 and ≤ 1");
  if (!(targetOutput > 0)) throw new RangeError("targetOutput must be > 0");
  if (names && names.length !== stepRates.length + 1) throw new RangeError(`give ${stepRates.length + 1} stage names (one more than step rates)`);
  const label = (k: number) => names?.[k] ?? `stage ${k + 1}`;
  // Work back from the end; the tolerance stops 40 / 0.2 = 200.00000000000003 rounding up to 201.
  const need: number[] = [Math.ceil(targetOutput - 1e-9)];
  for (let k = stepRates.length - 1; k >= 0; k--) need.unshift(Math.ceil(need[0] / stepRates[k] - 1e-9));
  return {
    mode: "inverse",
    targetOutput,
    stages: need.map((n, k) => ({ name: label(k), stepRate: k > 0 ? stepRates[k - 1] : null, countNeeded: n })),
    topOfFunnelNeeded: need[0],
    notes: [
      "Counts are rounded up at each stage, working back from the target.",
      "Each step rate multiplies everything above it: if one step converts half as well as assumed, every stage above it needs twice as many. Use rates measured on the same kind of audience, or say they are assumptions.",
    ],
  };
}
