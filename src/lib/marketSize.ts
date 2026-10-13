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
  segments: Array<{
    name: string;
    tam: number;
    sam: number;
    accounts: number;
    /** accounts × serviceableShare × payingShare: the same as payingAccounts (kept for compatibility). */
    serviceableAccounts: number;
    /** accounts × serviceableShare, before payingShare. */
    reachableAccounts: number;
    payingAccounts: number;
    annualValue: number;
    source: string | null;
    /** The arithmetic behind this segment's SAM, e.g. "50,000 × 30% serviceable × 3% paying × 30 = 13,500". */
    inputsSummary: string;
  }>;
  tam: number;
  /** Includes payingShare: the annual value of the accounts that would pay (same as payingMarket). */
  sam: number;
  payingMarket: number;
  /** Includes payingShare: the same as payingAccounts (kept for compatibility). */
  serviceableAccounts: number;
  /** Accounts you can serve today, before payingShare. */
  reachableAccounts: number;
  /** Serviceable accounts that would pay at all. */
  payingAccounts: number;
  blendedAnnualValue: number;
  topDownCrossCheck: { topDown: number; bottomUpTam: number; ratio: number } | null;
  obtainable: {
    horizonYears: number;
    customersBySalesCapacity: number | null;
    customersByBudget: number | null;
    bindingConstraint: string | null;
    /** "assumed inputs" when any segment's account count has no source or a source that says it is assumed. */
    bindingConstraintBasis: "assumed inputs" | "sourced account counts" | null;
    customersAtHorizon: number | null;
    revenueAtHorizon: number | null;
    /** Share of paying accounts (same as shareOfPayingAccounts, kept for compatibility). */
    shareOfSam: number | null;
    shareOfPayingAccounts: number | null;
    /** Share of reachable accounts, before payingShare. */
    shareOfServiceable: number | null;
  };
  /** customersNeeded and the penetration figures are null when no account is serviceable. penetrationOfSam is penetrationOfPayingAccounts. */
  target: {
    revenueTarget: number;
    customersNeeded: number | null;
    penetrationOfSam: number | null;
    penetrationOfPayingAccounts: number | null;
    penetrationOfServiceable: number | null;
    penetrationOfTam: number;
  } | null;
  /** Figures not computed because an input was missing, and which input would add them. */
  notComputed: string[];
  notes: string[];
  warnings: string[];
}

// A source that says the count is a guess is no source.
const ASSUMED_SOURCE = /assum|guess|placeholder|estimate/i;

export function marketSize(i: MarketSizeInput): MarketSizeResult {
  if (!i.segments.length) throw new RangeError("provide at least one segment");
  const warnings: string[] = [];
  const notes: string[] = [];
  const notComputed: string[] = [];
  let unsourced = false;
  const segs = i.segments.map((s) => {
    if (!(s.accounts > 0) || !(s.annualValue > 0)) throw new RangeError(`segment "${s.name}": accounts and annualValue must be > 0`);
    const share = (s.serviceableShare ?? 1) * (s.payingShare ?? 1);
    if ((s.serviceableShare ?? 1) < 0 || (s.serviceableShare ?? 1) > 1) throw new RangeError(`segment "${s.name}": serviceableShare must be in [0,1]`);
    if ((s.payingShare ?? 1) < 0 || (s.payingShare ?? 1) > 1) throw new RangeError(`segment "${s.name}": payingShare must be in [0,1]`);
    if (!s.source) {
      unsourced = true;
      warnings.push(`Segment "${s.name}" has no source for its account count. Record where the count comes from (a public count or registry, a directory, a platform's own figures, a search you ran) and how you got it.`);
    } else if (ASSUMED_SOURCE.test(s.source)) {
      unsourced = true;
      warnings.push(`Segment "${s.name}" source "${s.source}" says the account count is assumed, not counted. Treat every figure built on it as an assumption until you have a real count.`);
    }
    if (s.serviceableShare === undefined) warnings.push(`Segment "${s.name}" assumes you can serve 100% of accounts today. Apply geography, language, integration and compliance limits.`);
    const sam = s.accounts * share * s.annualValue;
    return {
      name: s.name,
      accounts: s.accounts,
      serviceableAccounts: s.accounts * share,
      reachableAccounts: s.accounts * (s.serviceableShare ?? 1),
      payingAccounts: s.accounts * share,
      annualValue: s.annualValue,
      tam: s.accounts * s.annualValue,
      sam,
      source: s.source ?? null,
      inputsSummary: `${num(s.accounts)} × ${pct(s.serviceableShare ?? 1)} serviceable × ${pct(s.payingShare ?? 1)} paying × ${num(s.annualValue)} = ${num(sam)}`,
    };
  });
  for (let a = 0; a < segs.length; a++)
    for (let b = a + 1; b < segs.length; b++)
      if (segs[a].accounts === segs[b].accounts)
        warnings.push(`Segments "${segs[a].name}" and "${segs[b].name}" have the same account count (${num(segs[a].accounts)}). If they are the same accounts buying two things, that is a possible double count: use one segment with the combined annual value.`);
  const tam = segs.reduce((n, s) => n + s.tam, 0);
  const sam = segs.reduce((n, s) => n + s.sam, 0);
  const servAccounts = segs.reduce((n, s) => n + s.serviceableAccounts, 0);
  const reachable = segs.reduce((n, s) => n + s.reachableAccounts, 0);
  if (i.segments.some((s) => (s.payingShare ?? 1) < 1))
    notes.push("serviceableAccounts and sam include payingShare: they count the accounts that would pay (payingAccounts), not every account you can serve (reachableAccounts).");
  const blended = servAccounts > 0 ? sam / servAccounts : 0;

  let cross: MarketSizeResult["topDownCrossCheck"] = null;
  if (i.topDownAnnualSpend === undefined) notComputed.push("top-down cross-check: give topDownAnnualSpend from a report you can cite");
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
  const bounded = !!(i.salesCapacity || i.acquisitionBudget);
  if (!bounded && (i.horizonYears !== undefined || i.annualChurn !== undefined)) {
    warnings.push("horizonYears and annualChurn are not used without salesCapacity or acquisitionBudget: nothing here depends on them.");
  }
  if (bounded && years === 1 && churn > 0) {
    notes.push("At a 1-year horizon annualChurn is not applied: customers won during the year are all counted at year end. Real in-year losses would lower the count by up to about half the churn rate.");
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
    notComputed.push("obtainable market: give salesCapacity and/or acquisitionBudget");
  }
  const revenueAtHorizon = customers !== null ? customers * blended : null;
  const shareOfSam = customers !== null && servAccounts > 0 ? customers / servAccounts : null;
  if (shareOfSam !== null && shareOfSam > 0.1) {
    warnings.push(
      `Plan reaches ${(shareOfSam * 100).toFixed(0)}% of paying accounts (serviceable accounts that would pay) in ${years} years. Rule of thumb: >10% penetration of a market in a few years needs evidence (existing pull, a channel that already works, or a market you're creating).`
    );
  }

  let target: MarketSizeResult["target"] = null;
  if (i.revenueTarget !== undefined && servAccounts === 0) {
    target = { revenueTarget: i.revenueTarget, customersNeeded: null, penetrationOfSam: null, penetrationOfPayingAccounts: null, penetrationOfServiceable: null, penetrationOfTam: i.revenueTarget / tam };
    warnings.push("No serviceable accounts: serviceableShare × payingShare is 0 for every segment, so no number of customers reaches the revenue target. Check the shares.");
  } else if (i.revenueTarget !== undefined) {
    const needed = i.revenueTarget / blended;
    target = {
      revenueTarget: i.revenueTarget,
      customersNeeded: needed,
      penetrationOfSam: needed / servAccounts,
      penetrationOfPayingAccounts: needed / servAccounts,
      penetrationOfServiceable: needed / reachable,
      penetrationOfTam: i.revenueTarget / tam,
    };
    if (needed > servAccounts) warnings.push(`The revenue target needs ${fmt(needed)} customers but only ${fmt(servAccounts)} accounts are serviceable and would pay. Expand the serviceable market, raise ACV, or lower the target.`);
    else if (needed / servAccounts > 0.2) warnings.push(`The revenue target needs ${(needed / servAccounts * 100).toFixed(0)}% of paying accounts (serviceable accounts that would pay). Few companies hold that share of a market; plan for expanding SAM (new segments, geographies, products).`);
  }
  if (i.revenueTarget === undefined) notComputed.push("customers and penetration a revenue goal needs: give revenueTarget");
  if (segs.length === 1) warnings.push("Single segment: consider splitting by size or use case. ACV and win rates usually differ enough to change the answer.");

  return {
    segments: segs,
    tam,
    sam,
    payingMarket: sam,
    serviceableAccounts: servAccounts,
    reachableAccounts: reachable,
    payingAccounts: servAccounts,
    blendedAnnualValue: blended,
    topDownCrossCheck: cross,
    obtainable: {
      horizonYears: years,
      customersBySalesCapacity: bySales,
      customersByBudget: byBudget,
      bindingConstraint: binding,
      bindingConstraintBasis: binding === null ? null : unsourced ? "assumed inputs" : "sourced account counts",
      customersAtHorizon: customers,
      revenueAtHorizon,
      shareOfSam,
      shareOfPayingAccounts: shareOfSam,
      shareOfServiceable: customers !== null && reachable > 0 ? customers / reachable : null,
    },
    target,
    notComputed,
    notes,
    warnings,
  };
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "unlimited";
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return n.toFixed(0);
}

/** 1,234,567 / 0.25: thousands separators, up to three significant digits after the point. */
function num(n: number): string {
  return Number.isInteger(n) || Math.abs(n) >= 1000 ? Math.round(n).toLocaleString("en-US") : Number(n.toPrecision(3)).toLocaleString("en-US", { maximumFractionDigits: 10 });
}

function pct(x: number): string {
  return `${Number((x * 100).toPrecision(3))}%`;
}
