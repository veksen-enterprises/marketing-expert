// Liquidity maths for marketplaces, alerts and saved searches: will a buyer's watch (or search) find a match
// soon enough, given how many new listings arrive and how narrow the watch is? Listings are modelled as a
// Poisson process: matches arrive at rate (listings per day x share of listings that match).

export interface LiquidityInput {
  /** New listings per day across the whole marketplace (count reposts once). */
  listingsPerDay: number;
  /** Share of new listings a typical watch matches (0–1). Give several to model narrow and broad watches. */
  matchShares: number[];
  /** The window a watcher will wait before giving up, in days. */
  windowDays: number;
  /** Target probability that a watch fires within the window, for the "listings needed" figure. Default 0.8. */
  targetProbability?: number;
}

export interface LiquidityRow {
  matchShare: number;
  matchesPerDay: number;
  /** Probability of at least one match within windowDays. */
  probabilityWithinWindow: number;
  /** Mean wait for the first match, in days. */
  expectedDaysToFirstMatch: number;
  /** New listings per day needed for targetProbability within windowDays. */
  listingsPerDayNeeded: number;
}

export interface LiquidityResult {
  rows: LiquidityRow[];
  /** Mean of probabilityWithinWindow across matchShares: the share of watches expected to fire in the window if the shares describe your watches. */
  shareOfWatchesFiring: number;
  verdict: string;
  warnings: string[];
}

export function liquidity(input: LiquidityInput): LiquidityResult {
  const { listingsPerDay, matchShares, windowDays } = input;
  const target = input.targetProbability ?? 0.8;
  if (!(listingsPerDay >= 0) || !Number.isFinite(listingsPerDay)) throw new RangeError("listingsPerDay must be ≥ 0");
  if (!(windowDays > 0)) throw new RangeError("windowDays must be > 0");
  if (!(target > 0 && target < 1)) throw new RangeError("targetProbability must be between 0 and 1");
  if (!matchShares.length) throw new RangeError("give at least one matchShare");
  for (const s of matchShares) if (!(s > 0 && s <= 1)) throw new RangeError("each matchShare must be > 0 and ≤ 1");

  const rows = matchShares.map((p) => {
    const mu = listingsPerDay * p;
    return {
      matchShare: p,
      matchesPerDay: mu,
      probabilityWithinWindow: 1 - Math.exp(-mu * windowDays),
      expectedDaysToFirstMatch: mu > 0 ? 1 / mu : Infinity,
      listingsPerDayNeeded: -Math.log(1 - target) / (p * windowDays),
    };
  });
  const shareOfWatchesFiring = rows.reduce((a, r) => a + r.probabilityWithinWindow, 0) / rows.length;
  const pct = (x: number) => `${(x * 100).toFixed(x < 0.1 ? 1 : 0)}%`;
  const narrow = rows.reduce((a, b) => (b.matchShare < a.matchShare ? b : a));
  const verdict =
    `At ${listingsPerDay} new listings a day, about ${pct(shareOfWatchesFiring)} of these watches would fire within ${windowDays} days. ` +
    `The narrowest (${pct(narrow.matchShare)} of listings) fires within the window ${pct(narrow.probabilityWithinWindow)} of the time; ` +
    `it needs about ${Math.ceil(narrow.listingsPerDayNeeded)} listings a day for a ${pct(target)} chance.`;
  const warnings = [
    "Assumes listings arrive independently at a steady rate. Bursts (a new season, a weekend) and lulls change the wait; use your own daily counts.",
    "Count each item once: reposts and bumps of the same item inflate listings per day without adding matches a watcher wants.",
    "A match is only worth something if the item is still available and the owner answers. Multiply by your contact and reply rates to get useful matches.",
  ];
  if (rows.some((r) => r.matchShare > 0.2)) warnings.push("A match share above 20% is a very broad watch; check the share against real search data.");
  return { rows, shareOfWatchesFiring, verdict, warnings };
}
