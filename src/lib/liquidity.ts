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
  const pct = (x: number) => `${x > 0 && x < 0.001 ? Number((x * 100).toPrecision(2)) : (x * 100).toFixed(x < 0.1 ? 1 : 0)}%`;
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

// Reciprocal mode, for dating and other apps where both people must say yes. A user on side A meets new
// active users of side B at rate newPerDay(B) x filterShare; a match needs A to like B (A's likeRate) and B to
// like A back (B's likeRate). With one side, the pool matches with itself.

export interface ReciprocalSide {
  name: string;
  /** New active users of this side arriving in range per day (active, not sign-ups). */
  newPerDay: number;
  /** Share of the other side's profiles that a user on this side likes (0–1). */
  likeRate: number;
}

export interface ReciprocalInput {
  /** One side (one pool that matches with itself) or two (e.g. women and men). */
  sides: ReciprocalSide[];
  /** Share of the other side's profiles that pass both people's filters (age, distance, preferences), 0–1. */
  filterShare: number;
  windowDays: number;
  /** Share of matches that become a conversation, 0–1. Optional. */
  conversationRate?: number;
  targetProbability?: number;
}

export interface ReciprocalRow {
  side: string;
  matchesPerWeek: number;
  /** Probability of at least one match within windowDays. */
  probabilityWithinWindow: number;
  /** Share of this side's likes that are liked back: the other side's likeRate. */
  matchesPerLike: number;
  conversationsPerWeek?: number;
  /** New active users per day of the other side needed for targetProbability within windowDays. */
  otherSideNeededPerDay: number;
}

export interface ReciprocalResult {
  rows: ReciprocalRow[];
  verdict: string;
  warnings: string[];
}

export function reciprocalLiquidity(input: ReciprocalInput): ReciprocalResult {
  const { sides, filterShare, windowDays } = input;
  const target = input.targetProbability ?? 0.8;
  if (sides.length < 1 || sides.length > 2) throw new RangeError("give one side (one pool) or two");
  for (const s of sides) {
    if (!(s.newPerDay >= 0) || !Number.isFinite(s.newPerDay)) throw new RangeError("each side's newPerDay must be ≥ 0");
    if (!(s.likeRate > 0 && s.likeRate <= 1)) throw new RangeError("each side's likeRate must be > 0 and ≤ 1");
  }
  if (!(filterShare > 0 && filterShare <= 1)) throw new RangeError("filterShare must be > 0 and ≤ 1");
  if (!(windowDays > 0)) throw new RangeError("windowDays must be > 0");
  if (!(target > 0 && target < 1)) throw new RangeError("targetProbability must be between 0 and 1");
  const c = input.conversationRate;
  if (c !== undefined && !(c >= 0 && c <= 1)) throw new RangeError("conversationRate must be between 0 and 1");

  const other = (k: number) => sides[sides.length === 1 ? 0 : 1 - k];
  const rows: ReciprocalRow[] = sides.map((s, k) => {
    const o = other(k);
    const perArrival = filterShare * s.likeRate * o.likeRate;
    const perDay = o.newPerDay * perArrival;
    return {
      side: s.name,
      matchesPerWeek: perDay * 7,
      probabilityWithinWindow: 1 - Math.exp(-perDay * windowDays),
      matchesPerLike: o.likeRate,
      ...(c !== undefined ? { conversationsPerWeek: perDay * 7 * c } : {}),
      otherSideNeededPerDay: -Math.log(1 - target) / (perArrival * windowDays),
    };
  });

  const pct = (x: number) => `${Number((x * 100).toPrecision(2))}%`;
  const n = (x: number) => Number(x.toPrecision(2));
  const verdict =
    rows
      .map((r, k) => `On the ${r.side} side, a user gets about ${n(r.matchesPerWeek)} matches a week, a ${pct(r.probabilityWithinWindow)} chance of at least one within ${windowDays} days, and needs about ${Math.ceil(r.otherSideNeededPerDay)} new active users a day on the ${other(k).name} side for a ${pct(target)} target chance.`)
      .join(" ");
  const warnings = [
    "Count active users, not sign-ups: an account that never opens the app again adds no matches.",
    "Likes concentrate on a few profiles, so the typical user gets fewer matches than this average.",
    "Like rates were measured at today's pool. Users get choosier as the pool grows: in one dating app's field experiment, users told the pool was 50% bigger matched about 2% less (one app; beliefs varied, not pool size). Don't expect matches to rise in step with users, and don't set a pool target from listings maths.",
    "Like rates depend on the format: in one curated app showing a few profiles a day, about 40% were liked; swipe apps report far lower rates for women. Use your own rates once you have them.",
  ];
  if (sides.length === 2) {
    const [a, b] = sides;
    const ratio = Math.max(a.likeRate, b.likeRate) / Math.min(a.likeRate, b.likeRate);
    if (ratio >= 5) {
      const [picky, eager] = a.likeRate < b.likeRate ? [a, b] : [b, a];
      warnings.push(
        `Users on the ${eager.name} side like ${n(ratio)} times as often as users on the ${picky.name} side: a like from the ${eager.name} side is returned about 1 in ${Math.round(1 / picky.likeRate)} times, a like from the ${picky.name} side about 1 in ${Math.round(1 / eager.likeRate)}. ` +
          `The ${picky.name} side is the short side: it gets flooded and picks. Recruiting more users on the ${eager.name} side adds likes the ${picky.name} side can't answer.`
      );
    }
  }
  return { rows, verdict, warnings };
}
