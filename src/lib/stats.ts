// Small, dependency-free statistics helpers. Accuracy targets are "good enough
// for decision support" (~1e-7 on the normal CDF), not a stats library.

/** Complementary error function, Numerical Recipes erfcc (fractional error < 1.2e-7). */
export function erfc(x: number): number {
  const z = Math.abs(x);
  const t = 1 / (1 + 0.5 * z);
  const r =
    t *
    Math.exp(
      -z * z -
        1.26551223 +
        t *
          (1.00002368 +
            t *
              (0.37409196 +
                t *
                  (0.09678418 +
                    t *
                      (-0.18628806 +
                        t *
                          (0.27886807 +
                            t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))
    );
  return x >= 0 ? r : 2 - r;
}

/** Standard normal CDF. */
export function normCdf(x: number): number {
  return 0.5 * erfc(-x / Math.SQRT2);
}

/** Inverse standard normal CDF (Acklam's rational approximation, rel. error ~1.15e-9). */
export function normInv(p: number): number {
  if (!(p > 0 && p < 1)) throw new RangeError(`normInv: p must be in (0,1), got ${p}`);
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > pHigh) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  const q = p - 0.5;
  const r = q * q;
  return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

/** Upper-tail p-value of a chi-square statistic with 1 degree of freedom. */
export function chiSq1PValue(x: number): number {
  if (x <= 0) return 1;
  return erfc(Math.sqrt(x / 2));
}

export interface SampleSizeInput {
  baselineRate: number; // e.g. 0.04
  /** Minimum detectable effect, relative (0.10 = +10%) unless `mdeIsAbsolute`. */
  mde: number;
  mdeIsAbsolute?: boolean;
  alpha?: number; // two-sided, default 0.05
  power?: number; // default 0.8
  variants?: number; // arms including control, default 2
  /** Bonferroni-correct alpha for comparisons of each variant vs control. */
  correctForMultipleComparisons?: boolean;
}

export interface SampleSizeResult {
  perArm: number;
  total: number;
  baselineRate: number;
  targetRate: number;
  absoluteEffect: number;
  relativeEffect: number;
  alphaUsed: number;
  power: number;
}

/**
 * Per-arm sample size for a two-sided two-proportion z-test
 * (the standard formula used by Evan Miller's calculator and most textbooks).
 */
export function sampleSizeTwoProportions(input: SampleSizeInput): SampleSizeResult {
  const { baselineRate: p1 } = input;
  const alpha = input.alpha ?? 0.05;
  const power = input.power ?? 0.8;
  const variants = input.variants ?? 2;
  if (!(p1 > 0 && p1 < 1)) throw new RangeError("baselineRate must be between 0 and 1 (exclusive)");
  if (!(input.mde > 0)) throw new RangeError("mde must be > 0");
  if (variants < 2) throw new RangeError("variants must be >= 2");
  const p2 = input.mdeIsAbsolute ? p1 + input.mde : p1 * (1 + input.mde);
  if (!(p2 > 0 && p2 < 1)) throw new RangeError(`target rate ${p2} is outside (0,1); MDE too large for this baseline`);
  const comparisons = variants - 1;
  const alphaUsed = input.correctForMultipleComparisons && comparisons > 1 ? alpha / comparisons : alpha;
  const zA = normInv(1 - alphaUsed / 2);
  const zB = normInv(power);
  const pBar = (p1 + p2) / 2;
  const num = zA * Math.sqrt(2 * pBar * (1 - pBar)) + zB * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
  const perArm = Math.ceil((num * num) / ((p2 - p1) * (p2 - p1)));
  if (!Number.isFinite(perArm)) throw new RangeError(`mde ${input.mde} is too small: the sample size is not finite. Use the smallest effect you would act on.`);
  return {
    perArm,
    total: perArm * variants,
    baselineRate: p1,
    targetRate: p2,
    absoluteEffect: p2 - p1,
    relativeEffect: (p2 - p1) / p1,
    alphaUsed,
    power,
  };
}

/** Smallest relative MDE detectable with `perArm` users (inverts the sample-size formula by bisection). */
export function minimumDetectableEffect(baselineRate: number, perArm: number, alpha = 0.05, power = 0.8): number | null {
  let lo = 1e-6;
  let hi = Math.min(50, (1 - baselineRate) / baselineRate - 1e-9);
  const n = (rel: number) => sampleSizeTwoProportions({ baselineRate, mde: rel, alpha, power }).perArm;
  if (n(hi) > perArm) return null;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (n(mid) > perArm) lo = mid;
    else hi = mid;
  }
  return hi;
}

export interface ArmData {
  visitors: number;
  conversions: number;
}

export interface TwoProportionTestResult {
  control: { rate: number } & ArmData;
  variant: { rate: number } & ArmData;
  absoluteDiff: number;
  relativeLift: number;
  zScore: number;
  pValue: number;
  confidenceLevel: number;
  /** Confidence interval for the absolute difference (unpooled SE). */
  diffCI: [number, number];
  /** Approximate CI for relative lift (delta method on log ratio). */
  relativeLiftCI: [number, number] | null;
  significant: boolean;
  /** Approximate P(variant rate > control rate) under uniform Beta priors, via normal approximation. */
  probabilityVariantBetter: number;
}

export function twoProportionTest(control: ArmData, variant: ArmData, alpha = 0.05): TwoProportionTestResult {
  for (const [name, a] of [["control", control], ["variant", variant]] as const) {
    if (!(a.visitors > 0)) throw new RangeError(`${name}.visitors must be > 0`);
    if (a.conversions < 0 || a.conversions > a.visitors) throw new RangeError(`${name}.conversions must be in [0, visitors]`);
  }
  const p1 = control.conversions / control.visitors;
  const p2 = variant.conversions / variant.visitors;
  const pooled = (control.conversions + variant.conversions) / (control.visitors + variant.visitors);
  const sePooled = Math.sqrt(pooled * (1 - pooled) * (1 / control.visitors + 1 / variant.visitors));
  const z = sePooled === 0 ? 0 : (p2 - p1) / sePooled;
  // erfc directly, not 2*(1-normCdf): the subtraction rounds to 0 once |z| > ~8.3.
  const pValue = erfc(Math.abs(z) / Math.SQRT2);
  let seUnpooled = Math.sqrt((p1 * (1 - p1)) / control.visitors + (p2 * (1 - p2)) / variant.visitors);
  // Both arms at 0% or both at 100%: the Wald SE is 0, which would claim certainty of no difference.
  // Use the Agresti-Caffo SE instead (one success and one failure added to each arm).
  if (seUnpooled === 0) {
    const ac = (a: ArmData) => (a.conversions + 1) / (a.visitors + 2);
    const q1 = ac(control);
    const q2 = ac(variant);
    seUnpooled = Math.sqrt((q1 * (1 - q1)) / (control.visitors + 2) + (q2 * (1 - q2)) / (variant.visitors + 2));
  }
  const zCrit = normInv(1 - alpha / 2);
  const diff = p2 - p1;

  let relCI: [number, number] | null = null;
  if (control.conversions > 0 && variant.conversions > 0) {
    const logRatio = Math.log(p2 / p1);
    const seLog = Math.sqrt((1 - p1) / control.conversions + (1 - p2) / variant.conversions);
    // seLog is 0 when both arms convert 100%; a zero-width interval would be false certainty.
    if (seLog > 0) relCI = [Math.exp(logRatio - zCrit * seLog) - 1, Math.exp(logRatio + zCrit * seLog) - 1];
  }

  // Beta(1+c, 1+n-c) posteriors approximated as normals.
  const post = (a: ArmData) => {
    const al = 1 + a.conversions;
    const be = 1 + a.visitors - a.conversions;
    const mean = al / (al + be);
    const v = (al * be) / ((al + be) ** 2 * (al + be + 1));
    return { mean, v };
  };
  const pc = post(control);
  const pv = post(variant);
  const probBetter = normCdf((pv.mean - pc.mean) / Math.sqrt(pc.v + pv.v));

  return {
    control: { ...control, rate: p1 },
    variant: { ...variant, rate: p2 },
    absoluteDiff: diff,
    relativeLift: p1 === 0 ? (p2 === 0 ? 0 : Infinity) : diff / p1,
    zScore: z,
    pValue,
    confidenceLevel: 1 - alpha,
    diffCI: [diff - zCrit * seUnpooled, diff + zCrit * seUnpooled],
    relativeLiftCI: relCI,
    significant: pValue < alpha,
    probabilityVariantBetter: probBetter,
  };
}

export interface SrmResult {
  chiSquare: number;
  pValue: number;
  /** p < threshold (default 0.001, the conventional SRM threshold) */
  mismatch: boolean;
  expectedShares: number[];
  observedShares: number[];
}

/**
 * Sample ratio mismatch check (chi-square goodness of fit). Supports k arms; for odd df > 1 the p-value
 * uses the Wilson–Hilferty approximation to the chi-square distribution.
 */
export function sampleRatioMismatch(observed: number[], expectedWeights?: number[], threshold = 0.001): SrmResult {
  const k = observed.length;
  if (k < 2) throw new RangeError("need at least 2 arms");
  const weights = expectedWeights ?? observed.map(() => 1);
  if (weights.length !== k) throw new RangeError("expectedWeights length must match observed");
  const total = observed.reduce((s, x) => s + x, 0);
  // Scale by the largest weight first so huge weights can't overflow the sum to Infinity (NaN would clear the check).
  const wMax = Math.max(...weights);
  const wSum = weights.reduce((s, x) => s + x / wMax, 0);
  let chi = 0;
  for (let i = 0; i < k; i++) {
    const exp = (total * (weights[i] / wMax)) / wSum;
    chi += (observed[i] - exp) ** 2 / exp;
  }
  const df = k - 1;
  let pValue: number;
  if (df === 1) pValue = chiSq1PValue(chi);
  else if (df % 2 === 0) {
    // Exact survival function for even df.
    let term = 1;
    let sum = 1;
    for (let j = 1; j < df / 2; j++) {
      term *= chi / 2 / j;
      sum += term;
    }
    pValue = Math.exp(-chi / 2) * sum;
  } else {
    const z = (Math.cbrt(chi / df) - (1 - 2 / (9 * df))) / Math.sqrt(2 / (9 * df));
    pValue = 1 - normCdf(z);
  }
  if (!Number.isFinite(chi) || Number.isNaN(pValue)) throw new RangeError("sample ratio check failed: give finite, positive expected weights");
  return {
    chiSquare: chi,
    pValue,
    mismatch: pValue < threshold,
    expectedShares: weights.map((w) => w / wMax / wSum),
    observedShares: observed.map((o) => o / total),
  };
}
