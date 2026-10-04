// Tests on continuous metrics (revenue per visitor, order value, time on task).
// Revenue data is heavy-tailed: a few large orders dominate the variance, so this module
// supports capping (winsorizing) raw values and warns when the data looks skewed.

import { normInv } from "./stats.js";

function logGamma(x: number): number {
  // Lanczos approximation (g=7, n=9).
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  x -= 1;
  let a = c[0];
  const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

/** Continued fraction for the incomplete beta function (Numerical Recipes betacf). */
function betacf(a: number, b: number, x: number): number {
  const MAXIT = 300;
  const EPS = 3e-14;
  const FPMIN = 1e-300;
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}

/** Regularized incomplete beta I_x(a, b). */
export function incBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}

/** Two-sided p-value for a t statistic with `df` degrees of freedom. */
export function tTwoSidedP(t: number, df: number): number {
  return incBeta(df / (df + t * t), df / 2, 0.5);
}

/** Inverse of the two-sided t critical value: t such that P(|T| > t) = alpha. Bisection. */
export function tCrit(alpha: number, df: number): number {
  let lo = 0;
  let hi = 1000;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (tTwoSidedP(mid, df) > alpha) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export interface ArmSummary {
  n: number;
  mean: number;
  sd: number;
}

export interface ArmInput {
  /** Raw per-unit values (e.g. revenue per visitor, zeros included). */
  values?: number[];
  /** Or summary statistics. */
  n?: number;
  mean?: number;
  sd?: number;
}

function summarize(values: number[]): ArmSummary {
  const n = values.length;
  const mean = values.reduce((s, v) => s + v, 0) / n;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1);
  return { n, mean, sd: Math.sqrt(variance) };
}

function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

export interface MeansTestResult {
  control: ArmSummary;
  variant: ArmSummary;
  cappedAt: number | null;
  absoluteDiff: number;
  relativeLift: number | null;
  tStatistic: number;
  degreesOfFreedom: number;
  pValue: number;
  confidenceLevel: number;
  diffCI: [number, number];
  significant: boolean;
  warnings: string[];
}

/** Welch's t-test (unequal variances). Optionally caps raw values at a pooled percentile before testing. */
export function welchTest(controlIn: ArmInput, variantIn: ArmInput, alpha = 0.05, capPercentile?: number): MeansTestResult {
  const warnings: string[] = [];
  let cappedAt: number | null = null;
  const raw = controlIn.values && variantIn.values;
  let cVals = controlIn.values;
  let vVals = variantIn.values;
  if (capPercentile !== undefined) {
    if (!raw) throw new RangeError("capPercentile needs raw values for both arms");
    if (!(capPercentile > 0.5 && capPercentile < 1)) throw new RangeError("capPercentile must be in (0.5, 1), e.g. 0.99");
    const pooled = [...cVals!, ...vVals!].sort((a, b) => a - b);
    cappedAt = quantile(pooled, capPercentile);
    cVals = cVals!.map((v) => Math.min(v, cappedAt!));
    vVals = vVals!.map((v) => Math.min(v, cappedAt!));
  }
  const arm = (name: string, input: ArmInput, vals?: number[]): ArmSummary => {
    if (vals) {
      if (vals.length < 2) throw new RangeError(`${name}: need at least 2 values`);
      return summarize(vals);
    }
    if (input.n === undefined || input.mean === undefined || input.sd === undefined) {
      throw new RangeError(`${name}: provide values, or n, mean and sd`);
    }
    if (!(input.n >= 2) || !(input.sd >= 0)) throw new RangeError(`${name}: n must be >= 2 and sd >= 0`);
    return { n: input.n, mean: input.mean, sd: input.sd };
  };
  const c = arm("control", controlIn, cVals);
  const v = arm("variant", variantIn, vVals);

  const vc = (c.sd * c.sd) / c.n;
  const vv = (v.sd * v.sd) / v.n;
  const se = Math.sqrt(vc + vv);
  const diff = v.mean - c.mean;
  if (se === 0) throw new RangeError("both arms have zero variance; nothing to test");
  const t = diff / se;
  const df = (vc + vv) ** 2 / ((vc * vc) / (c.n - 1) + (vv * vv) / (v.n - 1));
  const p = tTwoSidedP(Math.abs(t), df);
  const crit = tCrit(alpha, df);

  if (raw && cappedAt === null) {
    const all = [...controlIn.values!, ...variantIn.values!].sort((a, b) => b - a);
    const total = all.reduce((s, x) => s + Math.max(0, x), 0);
    const topN = Math.max(1, Math.ceil(all.length * 0.01));
    const topShare = total > 0 ? all.slice(0, topN).reduce((s, x) => s + Math.max(0, x), 0) / total : 0;
    if (topShare > 0.2) {
      warnings.push(`Heavy tail: the top ${topN} value(s) (${topN === 1 ? "1 unit" : "top 1% of units"}) account for ${(topShare * 100).toFixed(0)}% of the total. A few outliers can decide this test; rerun with capPercentile 0.99 and report both.`);
    }
  }
  if (!raw && c.mean > 0 && c.sd / c.mean > 3) {
    warnings.push("Standard deviation is over 3× the mean: typical of revenue data with many zeros and a few large orders. Cap outliers (e.g. at the 99th percentile) using raw data if you can, and expect to need large samples.");
  }
  if (Math.min(c.n, v.n) < 30) warnings.push("Fewer than 30 units in an arm; with skewed data the t-test can be unreliable.");
  if (p < alpha && Math.abs(diff / c.mean) > 0.3) warnings.push("Lift above 30% on a revenue metric is rare. Check for a few large orders or a tracking problem before trusting it.");

  return {
    control: c,
    variant: v,
    cappedAt,
    absoluteDiff: diff,
    relativeLift: c.mean !== 0 ? diff / c.mean : null,
    tStatistic: t,
    degreesOfFreedom: df,
    pValue: p,
    confidenceLevel: 1 - alpha,
    diffCI: [diff - crit * se, diff + crit * se],
    significant: p < alpha,
    warnings,
  };
}

export interface MeansSampleSizeInput {
  baselineMean: number;
  baselineSd: number;
  /** Relative MDE (0.05 = +5%) unless mdeIsAbsolute. */
  mde: number;
  mdeIsAbsolute?: boolean;
  alpha?: number;
  power?: number;
  /** Expected variance reduction from CUPED-style covariate adjustment, 0–0.9. */
  varianceReduction?: number;
}

/** Per-arm n for a two-sided test of a difference in means (normal approximation). */
export function sampleSizeMeans(i: MeansSampleSizeInput): { perArm: number; total: number; absoluteEffect: number; relativeEffect: number; coefficientOfVariation: number; notes: string[] } {
  if (!(i.baselineMean > 0)) throw new RangeError("baselineMean must be > 0");
  if (!(i.baselineSd > 0)) throw new RangeError("baselineSd must be > 0");
  if (!(i.mde > 0)) throw new RangeError("mde must be > 0");
  const vr = i.varianceReduction ?? 0;
  if (vr < 0 || vr > 0.9) throw new RangeError("varianceReduction must be in [0, 0.9]");
  const alpha = i.alpha ?? 0.05;
  const power = i.power ?? 0.8;
  const delta = i.mdeIsAbsolute ? i.mde : i.baselineMean * i.mde;
  const variance = i.baselineSd ** 2 * (1 - vr);
  const z = normInv(1 - alpha / 2) + normInv(power);
  const perArm = Math.ceil((2 * z * z * variance) / (delta * delta));
  const cv = i.baselineSd / i.baselineMean;
  const notes: string[] = [];
  if (cv > 3) notes.push(`Coefficient of variation is ${cv.toFixed(1)}: revenue-type metrics need far more traffic than conversion rates. Capping outliers at the 99th percentile usually cuts the SD substantially; measure the capped SD from historical data and rerun.`);
  if (vr > 0) notes.push(`Assumes ${(vr * 100).toFixed(0)}% variance reduction (e.g. CUPED using pre-experiment data per user). Only valid for returning/logged-in users with pre-period data.`);
  notes.push("Estimate baselineSd from historical per-visitor data (zeros included), not from per-order data.");
  return { perArm, total: perArm * 2, absoluteEffect: delta, relativeEffect: delta / i.baselineMean, coefficientOfVariation: cv, notes };
}
