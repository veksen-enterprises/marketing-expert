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
  // Variance of the difference estimate; floor the rates so zero-conversion arms don't give V = 0.
  const f = (p: number, n: number) => Math.max(p * (1 - p), 0.25 / n) / n;
  const V = f(p1, control.visitors) + f(p2, variant.visitors);
  const tau = expectedEffect ?? Math.max(0.1 * Math.max(p1, 1e-4), 1e-4);
  if (!(tau > 0)) throw new RangeError("expectedEffect must be > 0");
  const t2 = tau * tau;
  const logLambda = 0.5 * Math.log(V / (V + t2)) + (t2 * diff * diff) / (2 * V * (V + t2));
  const lambda = Math.exp(Math.min(logLambda, 700));
  const p = Math.min(1, 1 / lambda);
  const half = Math.sqrt(((V * (V + t2)) / t2) * (Math.log((V + t2) / V) + 2 * Math.log(1 / alpha)));
  const ci: [number, number] = [diff - half, diff + half];
  const significant = p <= alpha;
  const notes = [
    "Valid under continuous monitoring: you may check after every visitor and stop when it says stop. The cost is a wider interval than a fixed-horizon test at the same sample size.",
    "Feed in cumulative totals at each look. Don't restart the counts, and don't change the traffic split mid-test.",
    "For a single look at a pre-planned sample size, ab_test_evaluate is more powerful.",
  ];
  if (expectedEffect === undefined) notes.push(`expectedEffect not given; assumed ${tau.toPrecision(2)} (10% of the control rate). Set it to the smallest lift you care about for better power.`);
  if (Math.min(control.conversions, variant.conversions) < 30) notes.push("Very few conversions so far; the normal approximation is rough.");
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
