// Statistics for comparing grades: paired differences across cases, grader agreement and the run/grader variance
// split. Method and reasons: research/grader-reliability.md sections 2, 3 and 5. Pure functions, tested in
// test/evalGrading.test.ts.

export const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

/** Sample standard deviation (n − 1). */
export function sd(xs) {
  if (xs.length < 2) return NaN;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
}

function lnGamma(z) {
  // Lanczos, g = 7: about 15 digits for z > 0.
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lnGamma(1 - z);
  z -= 1;
  let x = c[0];
  for (let i = 1; i < 9; i++) x += c[i] / (z + i);
  const t = z + 7.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

function betaContinuedFraction(a, b, x) {
  const tiny = 1e-300;
  let c = 1;
  let d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < tiny) d = tiny;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < tiny) d = tiny;
    c = 1 + aa / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
    d = 1 + aa * d;
    if (Math.abs(d) < tiny) d = tiny;
    c = 1 + aa / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-14) break;
  }
  return h;
}

/** Regularised incomplete beta I_x(a, b). */
export function incompleteBeta(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const front = Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (front * betaContinuedFraction(a, b, x)) / a : 1 - (front * betaContinuedFraction(b, a, 1 - x)) / b;
}

export function tCdf(t, df) {
  const tail = 0.5 * incompleteBeta(df / (df + t * t), df / 2, 0.5);
  return t >= 0 ? 1 - tail : tail;
}

export function fCdf(f, d1, d2) {
  return f <= 0 ? 0 : incompleteBeta((d1 * f) / (d1 * f + d2), d1 / 2, d2 / 2);
}

function invert(cdf, p, lo, hi) {
  while (cdf(hi) < p) hi *= 2;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (cdf(mid) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export const tQuantile = (p, df) => (p === 0.5 ? 0 : p > 0.5 ? invert((t) => tCdf(t, df), p, 0, 10) : -tQuantile(1 - p, df));
export const fQuantile = (p, d1, d2) => invert((f) => fCdf(f, d1, d2), p, 0, 10);

/**
 * Paired comparison of two versions. `rows` holds one score per graded run: { case, version, value }.
 * Per case: candidate run mean minus baseline run mean. Overall: mean of the per-case differences, with a
 * t interval over cases (cases are the unit; runs are resamples within a case).
 */
export function pairedComparison(rows, baseline, candidate, level = 0.95) {
  const byCase = new Map();
  for (const r of rows) {
    if (r.version !== baseline && r.version !== candidate) continue;
    const c = byCase.get(r.case) ?? { [baseline]: [], [candidate]: [] };
    c[r.version].push(r.value);
    byCase.set(r.case, c);
  }
  const cases = [];
  const unpaired = [];
  for (const [id, c] of [...byCase].sort(([a], [b]) => a.localeCompare(b))) {
    const base = c[baseline];
    const cand = c[candidate];
    if (!base.length || !cand.length) {
      unpaired.push({ case: id, baselineRuns: base.length, candidateRuns: cand.length });
      continue;
    }
    cases.push({ case: id, baselineRuns: base.length, candidateRuns: cand.length, baselineMean: mean(base), candidateMean: mean(cand), diff: mean(cand) - mean(base) });
  }
  const diffs = cases.map((c) => c.diff);
  const k = diffs.length;
  const meanDiff = k ? mean(diffs) : NaN;
  const se = k >= 2 ? sd(diffs) / Math.sqrt(k) : NaN;
  const t = k >= 2 ? tQuantile(1 - (1 - level) / 2, k - 1) : NaN;
  return { cases, unpaired, k, meanDiff, se, ci: [meanDiff - t * se, meanDiff + t * se], level };
}

/**
 * One-way random-effects ICC, single grade: ICC(1). Each run is graded by fresh, exchangeable graders, so there is
 * no consistent "grader A" across runs, and a two-way model would split noise between arbitrary columns. ICC(1)
 * counts every grader difference, including a constant offset, as error, which is the absolute agreement the
 * comparison needs. `groups`: one array of totals per run, all the same length k ≥ 2. Exact F-based interval.
 */
export function iccOneWay(groups, level = 0.95) {
  const n = groups.length;
  const k = groups[0]?.length ?? 0;
  if (n < 2 || k < 2 || groups.some((g) => g.length !== k)) throw new Error("ICC needs at least 2 runs, each with the same number (≥ 2) of grades");
  const grand = mean(groups.flat());
  const msb = (k * groups.reduce((a, g) => a + (mean(g) - grand) ** 2, 0)) / (n - 1);
  const msw = groups.reduce((a, g) => a + g.reduce((b, x) => b + (x - mean(g)) ** 2, 0), 0) / (n * (k - 1));
  const icc = (msb - msw) / (msb + (k - 1) * msw);
  if (msw === 0) return { icc: msb === 0 ? NaN : 1, ci: [NaN, NaN], msb, msw, n, k };
  const f0 = msb / msw;
  const a = (1 - level) / 2;
  const fl = f0 / fQuantile(1 - a, n - 1, n * (k - 1));
  const fu = f0 * fQuantile(1 - a, n * (k - 1), n - 1);
  return { icc, ci: [(fl - 1) / (fl + k - 1), (fu - 1) / (fu + k - 1)], msb, msw, n, k };
}

/**
 * Agreement on one categorical item between two grades per run. `pairs`: [[a, b], ...]. `categories`: the scale's
 * possible values (Gwet's q counts all of them, used or not). Returns raw agreement, Cohen's kappa and Gwet's AC1;
 * kappa is NaN when chance agreement is 1 (both grades the same constant), which is when it is undefined.
 */
export function itemAgreement(pairs, categories) {
  const n = pairs.length;
  const pa = pairs.filter(([a, b]) => a === b).length / n;
  const share = (i, c) => pairs.filter((p) => p[i] === c).length / n;
  const peKappa = categories.reduce((s, c) => s + share(0, c) * share(1, c), 0);
  const pi = categories.map((c) => (share(0, c) + share(1, c)) / 2);
  const peAc1 = pi.reduce((s, p) => s + p * (1 - p), 0) / (categories.length - 1);
  const distribution = Object.fromEntries(categories.map((c, i) => [c, pi[i]]));
  return { n, raw: pa, kappa: peKappa === 1 ? NaN : (pa - peKappa) / (1 - peKappa), ac1: (pa - peAc1) / (1 - peAc1), distribution };
}

/**
 * Splits the spread of totals into run variance (within case) and grader variance, from runs graded k times each.
 * `runs`: [{ case, totals: [k numbers] }]. Grader variance is the within-run mean square. Run variance is the
 * within-case variance of run means minus the grader share of it (σ²_grader / k), floored at 0.
 */
export function varianceSplit(runs) {
  const k = runs[0]?.totals.length ?? 0;
  const grader = runs.reduce((a, r) => a + r.totals.reduce((b, x) => b + (x - mean(r.totals)) ** 2, 0), 0) / (runs.length * (k - 1));
  const byCase = new Map();
  for (const r of runs) byCase.set(r.case, [...(byCase.get(r.case) ?? []), mean(r.totals)]);
  let ss = 0;
  let df = 0;
  for (const means of byCase.values()) {
    if (means.length < 2) continue;
    const m = mean(means);
    ss += means.reduce((a, x) => a + (x - m) ** 2, 0);
    df += means.length - 1;
  }
  const runMeanVar = df ? ss / df : NaN;
  const run = df ? Math.max(0, runMeanVar - grader / k) : NaN;
  return { grader, run, graderShare: grader / (grader + run), casesWithRepeatRuns: [...byCase.values()].filter((m) => m.length >= 2).length };
}

/** Seeded PRNG (mulberry32), so a batch's order and ids can be rebuilt from its seed. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(xs, random) {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Side-by-side preference of a candidate over a baseline. `judgements`: one per judge call,
 * { case, pair, firstShown: "baseline"|"candidate", pick: "baseline"|"candidate"|"tie" }. Each pair is judged in both
 * orders when it can be; a pair's score is the mean over its judgements (candidate 1, tie 0.5, baseline 0). A case's
 * score is the mean of its pairs, and the overall figure is the mean of case scores, with a t interval over cases
 * (cases are the unit, as in pairedComparison). 0.5 is no preference.
 * Position: how often the first-shown answer won, and how many pairs judged both ways got the same winner both times.
 */
export function preferenceSummary(judgements, level = 0.95) {
  const value = { candidate: 1, tie: 0.5, baseline: 0 };
  const byPair = new Map();
  for (const j of judgements) byPair.set(`${j.case}\u0000${j.pair}`, [...(byPair.get(`${j.case}\u0000${j.pair}`) ?? []), j]);
  const byCase = new Map();
  let bothOrders = 0;
  let sameWinner = 0;
  for (const js of byPair.values()) {
    const c = js[0].case;
    byCase.set(c, [...(byCase.get(c) ?? []), mean(js.map((j) => value[j.pick]))]);
    const orders = new Set(js.map((j) => j.firstShown));
    if (orders.size === 2) {
      bothOrders++;
      if (new Set(js.map((j) => j.pick)).size === 1 && js[0].pick !== "tie") sameWinner++;
    }
  }
  const cases = [...byCase].sort(([a], [b]) => a.localeCompare(b)).map(([id, scores]) => ({ case: id, pairs: scores.length, score: mean(scores) }));
  const k = cases.length;
  const m = k ? mean(cases.map((c) => c.score)) : NaN;
  const se = k >= 2 ? sd(cases.map((c) => c.score)) / Math.sqrt(k) : NaN;
  const t = k >= 2 ? tQuantile(1 - (1 - level) / 2, k - 1) : NaN;
  const decided = judgements.filter((j) => j.pick !== "tie");
  return {
    cases,
    k,
    judgements: judgements.length,
    counts: { candidate: judgements.filter((j) => j.pick === "candidate").length, baseline: judgements.filter((j) => j.pick === "baseline").length, tie: judgements.length - decided.length },
    preference: m,
    se,
    ci: [m - t * se, m + t * se],
    level,
    firstShownWins: decided.length ? decided.filter((j) => j.pick === j.firstShown).length / decided.length : NaN,
    bothOrders,
    sameWinner,
  };
}
