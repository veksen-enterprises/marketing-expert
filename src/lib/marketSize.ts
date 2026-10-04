// Bottom-up market sizing with explicit constraints. The point is not a big TAM number;
// it's making the assumptions visible and showing what a revenue goal implies about penetration.

export interface Segment {
  name: string;
  /** Number of potential buying accounts (companies, households, users who would pay). */
  accounts: number;
  /** Annual revenue per account if they buy (ACV / annual spend). */
  annualValue: number;
  /** 0–1: share of these accounts you can actually serve today (geo, language, integrations, compliance, product fit). Default 1. */
  serviceableShare?: number;
  /** 0–1: share of serviceable accounts that would pay at all (freemium, community or hobby products often < 0.05). Default 1. */
  payingShare?: number;
  /** Where the account count came from; surfaced back so unsourced numbers are obvious. */
  source?: string;
}

export interface MarketSizeInput {
  segments: Segment[];
  /** Top-down cross-check: total annual spend on this category from an analyst/report. */
  topDownAnnualSpend?: number;
  horizonYears?: number;
  /** Capacity constraints for the obtainable market. Each gives an upper bound on customers won over the horizon. */
  salesCapacity?: { reps: number; dealsPerRepPerYear: number };
  acquisitionBudget?: { annualBudget: number; cac: number };
  /** Annual logo churn 0–1, applied to customers won over the horizon. */
  annualChurn?: number;
  /** Revenue goal (annual recurring) to test against the market. */
  revenueTarget?: number;
}

export interface MarketSizeResult {
  segments: Array<{ name: string; tam: number; sam: number; accounts: number; serviceableAccounts: number; annualValue: number; source: string | null }>;
  tam: number;
  sam: number;
  serviceableAccounts: number;
  blendedAnnualValue: number;
  topDownCrossCheck: { topDown: number; bottomUpTam: number; ratio: number } | null;
  obtainable: {
    horizonYears: number;
    customersBySalesCapacity: number | null;
    customersByBudget: number | null;
    bindingConstraint: string | null;
    customersAtHorizon: number | null;
    revenueAtHorizon: number | null;
    shareOfSam: number | null;
  };
  target: { revenueTarget: number; customersNeeded: number; penetrationOfSam: number; penetrationOfTam: number } | null;
  warnings: string[];
}

export function marketSize(i: MarketSizeInput): MarketSizeResult {
  if (!i.segments.length) throw new RangeError("provide at least one segment");
  const warnings: string[] = [];
  const segs = i.segments.map((s) => {
    if (!(s.accounts > 0) || !(s.annualValue > 0)) throw new RangeError(`segment "${s.name}": accounts and annualValue must be > 0`);
    const share = (s.serviceableShare ?? 1) * (s.payingShare ?? 1);
    if ((s.serviceableShare ?? 1) < 0 || (s.serviceableShare ?? 1) > 1) throw new RangeError(`segment "${s.name}": serviceableShare must be in [0,1]`);
    if ((s.payingShare ?? 1) < 0 || (s.payingShare ?? 1) > 1) throw new RangeError(`segment "${s.name}": payingShare must be in [0,1]`);
    if (!s.source) warnings.push(`Segment "${s.name}" has no source for its account count. Use a census count, a Sales Navigator / technographic query, or public filings, and record it.`);
    if (s.serviceableShare === undefined) warnings.push(`Segment "${s.name}" assumes you can serve 100% of accounts today. Apply geography, language, integration and compliance limits.`);
    return {
      name: s.name,
      accounts: s.accounts,
      serviceableAccounts: s.accounts * share,
      annualValue: s.annualValue,
      tam: s.accounts * s.annualValue,
      sam: s.accounts * share * s.annualValue,
      source: s.source ?? null,
    };
  });
  const tam = segs.reduce((n, s) => n + s.tam, 0);
  const sam = segs.reduce((n, s) => n + s.sam, 0);
  const servAccounts = segs.reduce((n, s) => n + s.serviceableAccounts, 0);
  const blended = servAccounts > 0 ? sam / servAccounts : 0;

  let cross: MarketSizeResult["topDownCrossCheck"] = null;
  if (i.topDownAnnualSpend !== undefined) {
    const ratio = i.topDownAnnualSpend / tam;
    cross = { topDown: i.topDownAnnualSpend, bottomUpTam: tam, ratio };
    if (ratio > 3 || ratio < 1 / 3) {
      warnings.push(
        `Top-down (${fmt(i.topDownAnnualSpend)}) and bottom-up TAM (${fmt(tam)}) differ by ${ratio > 1 ? ratio.toFixed(1) : (1 / ratio).toFixed(1)}×. ` +
          "Usually the analyst category is defined differently from your product, or the per-account value is off. Reconcile before using either."
      );
    }
  }

  const years = i.horizonYears ?? 5;
  const churn = i.annualChurn ?? 0;
  if (i.annualChurn === undefined && (i.salesCapacity || i.acquisitionBudget)) {
    warnings.push("No annualChurn given, so the obtainable market assumes no customer ever leaves. Add a churn estimate; even 10–20% a year changes the horizon count a lot.");
  }
  // Customers remaining at horizon if `perYear` are won each year and `churn` are lost annually.
  const retained = (perYear: number) => {
    let c = 0;
    for (let y = 0; y < years; y++) c = c * (1 - churn) + perYear;
    return c;
  };
  const bySales = i.salesCapacity ? retained(i.salesCapacity.reps * i.salesCapacity.dealsPerRepPerYear) : null;
  const byBudget = i.acquisitionBudget ? retained(i.acquisitionBudget.annualBudget / i.acquisitionBudget.cac) : null;
  const bounds = [
    ["sales capacity", bySales],
    ["acquisition budget", byBudget],
  ].filter((b): b is [string, number] => b[1] !== null);
  let binding: string | null = null;
  let customers: number | null = null;
  if (bounds.length) {
    const min = bounds.reduce((a, b) => (b[1] < a[1] ? b : a));
    binding = min[0];
    customers = Math.min(min[1], servAccounts);
    if (min[1] > servAccounts) {
      binding = "serviceable market";
      warnings.push("Your capacity exceeds the serviceable market; the market, not capacity, is the binding constraint.");
    }
  } else {
    warnings.push("No capacity constraint given, so no obtainable market computed. Add salesCapacity and/or acquisitionBudget: SOM is bounded by how many customers you can actually win, not by a share of TAM you pick.");
  }
  const revenueAtHorizon = customers !== null ? customers * blended : null;
  const shareOfSam = customers !== null && servAccounts > 0 ? customers / servAccounts : null;
  if (shareOfSam !== null && shareOfSam > 0.1) {
    warnings.push(
      `Plan reaches ${(shareOfSam * 100).toFixed(0)}% of serviceable accounts in ${years} years. Rule of thumb: >10% penetration of a market in a few years needs evidence (existing pull, a channel that already works, or a market you're creating).`
    );
  }

  let target: MarketSizeResult["target"] = null;
  if (i.revenueTarget !== undefined) {
    const needed = i.revenueTarget / blended;
    target = { revenueTarget: i.revenueTarget, customersNeeded: needed, penetrationOfSam: needed / servAccounts, penetrationOfTam: i.revenueTarget / tam };
    if (needed > servAccounts) warnings.push(`The revenue target needs ${fmt(needed)} customers but only ${fmt(servAccounts)} accounts are serviceable. Expand the serviceable market, raise ACV, or lower the target.`);
    else if (needed / servAccounts > 0.2) warnings.push(`The revenue target needs ${(needed / servAccounts * 100).toFixed(0)}% of serviceable accounts. Few companies hold that share of a market; plan for expanding SAM (new segments, geographies, products).`);
  }
  if (segs.length === 1) warnings.push("Single segment: consider splitting by size or use case. ACV and win rates usually differ enough to change the answer.");

  return {
    segments: segs.map((s) => ({ name: s.name, tam: s.tam, sam: s.sam, accounts: s.accounts, serviceableAccounts: s.serviceableAccounts, annualValue: s.annualValue, source: s.source })),
    tam,
    sam,
    serviceableAccounts: servAccounts,
    blendedAnnualValue: blended,
    topDownCrossCheck: cross,
    obtainable: {
      horizonYears: years,
      customersBySalesCapacity: bySales,
      customersByBudget: byBudget,
      bindingConstraint: binding,
      customersAtHorizon: customers,
      revenueAtHorizon,
      shareOfSam,
    },
    target,
    warnings,
  };
}

function fmt(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return n.toFixed(0);
}
