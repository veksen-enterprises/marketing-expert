// Always-valid inference for A/B tests on conversion rates: the mixture sequential probability
// ratio test (mSPRT) with a normal mixing distribution (Johari, Pekelis & Walsh, "Always Valid
// Inference", Operations Research 2022; the method behind Optimizely's Stats Engine).
// Unlike a fixed-horizon z-test, the p-value and confidence interval stay valid however often
// you look, so a team can check daily and stop as soon as the result is clear.

import type { ArmData } from "./stats.js";

export interface SequentialResult {
  control: { rate: number } & ArmData;
  variant: { rate: number } & ArmData;
  absoluteDiff: number;
  relativeLift: number | null;
  /** Likelihood ratio of "there is an effect" vs "no effect", averaged over plausible effect sizes. */
  likelihoodRatio: number;
  /** Always-valid p-value at this look: min(1, 1/likelihood ratio). Valid under continuous monitoring. */
  alwaysValidP: number;
  /** Always-valid confidence interval (confidence sequence) for the absolute difference. */
  diffCI: [number, number];
  alpha: number;
  mixingSd: number;
  decision: "stop: variant better" | "stop: variant worse" | "keep running";
  notes: string[];
}

/**
 * @param expectedEffect absolute difference in conversion rate you consider plausible (e.g. 0.005 = 0.5pp).
 *   It sets the mixing distribution's spread; results stay valid for any value, it only changes power.
 */
export function sequentialTest(control: ArmData, variant: ArmData, alpha = 0.05, expectedEffect?: number): SequentialResult {
  for (const [name, a] of [["control", control], ["variant", variant]] as const) {
    if (!(a.visitors > 0)) throw new RangeError(`${name}.visitors must be > 0`);
    if (a.conversions < 0 || a.conversions > a.visitors) throw new RangeError(`${name}.conversions must be in [0, visitors]`);
  }
  if (!(alpha > 0 && alpha < 1)) throw new RangeError("alpha must be in (0,1)");
  const p1 = control.conversions / control.visitors;
  const p2 = variant.conversions / variant.visitors;
  const diff = p2 - p1;
  const n1 = control.visitors;
  const n2 = variant.visitors;
  // Likelihood ratio: variance under "no difference", from the pooled rate smoothed by one success and one
  // failure. Each arm's own rate gives a tiny variance when an arm sits at 0% or 100%, which made the test
  // stop after 3 visitors per arm and broke the always-valid guarantee at small samples.
  const pb = (control.conversions + variant.conversions + 1) / (n1 + n2 + 2);
  const V = pb * (1 - pb) * (1 / n1 + 1 / n2);
  // Interval: unpooled variance with each rate smoothed, (c+0.5)/(n+1), so it never collapses at 0% or 100%.
  const sm = (a: ArmData) => (a.conversions + 0.5) / (a.visitors + 1);
  const Vci = (sm(control) * (1 - sm(control))) / n1 + (sm(variant) * (1 - sm(variant))) / n2;
  const tau = expectedEffect ?? Math.max(0.1 * Math.max(p1, 1e-4), 1e-4);
  if (!(tau > 0 && tau <= 1)) throw new RangeError("expectedEffect must be > 0 and at most 1 (a difference in conversion rates)");
  const t2 = tau * tau;
  const logLambda = 0.5 * Math.log(V / (V + t2)) + (t2 * diff * diff) / (2 * V * (V + t2));
  const lambda = Math.exp(Math.min(logLambda, 700));
  const p = Math.min(1, 1 / lambda);
  const half = Math.sqrt(((Vci * (Vci + t2)) / t2) * (Math.log((Vci + t2) / Vci) + 2 * Math.log(1 / alpha)));
  if (!Number.isFinite(logLambda) || !Number.isFinite(half)) throw new RangeError("sequential test could not be computed for these inputs");
  const ci: [number, number] = [Math.max(-1, diff - half), Math.min(1, diff + half)];
  // The normal approximation behind the test needs some successes and failures in each arm before a stop.
  const enough = [control, variant].every((a) => a.conversions >= 10 && a.visitors - a.conversions >= 10);
  const significant = p <= alpha && enough;
  const notes = [
    "Valid under continuous monitoring: you may check after every visitor and stop when it says stop. The cost is a wider interval than a fixed-horizon test at the same sample size.",
    "Feed in cumulative totals at each look. Don't restart the counts, and don't change the traffic split mid-test.",
    "For a single look at a pre-planned sample size, ab_test_evaluate is more powerful.",
  ];
  if (expectedEffect === undefined) notes.push(`expectedEffect not given; assumed ${tau.toPrecision(2)} (10% of the control rate). Set it to the smallest lift you care about for better power.`);
  if (!enough) notes.push("No stop before each arm has at least 10 conversions and 10 non-conversions: the approximation is not reliable before that.");
  else if (Math.min(control.conversions, variant.conversions) < 30) notes.push("Very few conversions so far; the normal approximation is rough.");
  return {
    control: { ...control, rate: p1 },
    variant: { ...variant, rate: p2 },
    absoluteDiff: diff,
    relativeLift: p1 > 0 ? diff / p1 : null,
    likelihoodRatio: lambda,
    alwaysValidP: p,
    diffCI: ci,
    alpha,
    mixingSd: tau,
    decision: significant ? (diff > 0 ? "stop: variant better" : "stop: variant worse") : "keep running",
    notes,
  };
}
