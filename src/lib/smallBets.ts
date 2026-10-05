// Small bets: cheap marketing moves, matched against a business profile. Each bet declares what it needs
// (users, traffic, data, an audience, money), which kinds of business it suits, and what it involves that a
// business may refuse (publishing user data, sharing metrics, cold outreach). The matcher sorts bets into
// fits now / fits later / doesn't fit, with the reason for each. The playbook is knowledge/small-bets.md;
// the evidence is in research/small-bets*.md.

import type { BusinessProfile } from "./profile.js";
import { BETS } from "./smallBetsCatalog.js";

export const AUDIENCES = ["businesses", "developers", "consumers", "hobbyists", "local"] as const;
export const SURFACES = ["web-app", "website", "mobile-app", "cli", "library", "api", "bot", "browser-extension", "physical", "service"] as const;
/** Things a bet involves that a business may rule out. Saved in the profile's `avoid` list. */
export const AVOID_TAGS = [
  "publishing-user-content", // republishing or ranking what users post, or naming users
  "pricing", // price data, price indexes, price comparisons
  "moving-users-off-platform", // asking people to leave the place they already use
  "sharing-metrics", // revenue, user counts or growth numbers in public
  "cold-outreach", // contacting people who haven't asked
  "paid-promotion", // paying creators, sponsors or ad platforms
  "discounts", // lifetime deals, pay-what-you-want, discount codes
  "founder-on-camera", // video or streams with the founder's face or voice
  "open-sourcing-code", // publishing source code
] as const;
export type Audience = (typeof AUDIENCES)[number];
export type Surface = (typeof SURFACES)[number];
export type AvoidTag = (typeof AVOID_TAGS)[number];
export type Stage = 0 | 1 | 2 | 3;

export interface Bet {
  id: string;
  name: string;
  /** One sentence: what you do. */
  what: string;
  /** Earliest stage at which it can work: 0 no users, 1 first users, 2 steady use, 3 something newsworthy. */
  stage: Stage;
  needs?: {
    /** Data you hold that nobody else has published (collected public data counts). Lowers `stage` to 0 when set. */
    data?: boolean;
    /** Expertise worth reading or a method to show. */
    expertise?: boolean;
    /** The founder already has followers where the audience is. */
    founderAudience?: boolean;
    /** Accounts or emails: a way to reach each user one to one. */
    accounts?: boolean;
    /** Something to sell now. */
    revenue?: boolean;
    /** A monthly budget in dollars. */
    budget?: number;
    /** A story the press or a community would retell. */
    newsworthy?: boolean;
    /** The audience gathers in moderated communities (Discord servers, subreddits, forums, Facebook groups). */
    communities?: boolean;
  };
  /** "before": only before the product is live (a waitlist); "after": needs a product people can try now. */
  launch?: "before" | "after";
  /** A monthly budget that lets the bet run before its stage (money buys reach the product hasn't earned). */
  budgetSkipsStage?: number;
  /** Data lets the bet start at stage 0. */
  dataSkipsStage?: boolean;
  /** A seasonal business can start the bet at stage 0: the season, not the user count, sets the timing. */
  seasonSkipsStage?: boolean;
  /** Only for these audiences; omitted = any. */
  audiences?: Audience[];
  /** Needs one of these product surfaces; omitted = any. */
  surfaces?: Surface[];
  involves?: AvoidTag[];
  /** Hours of work until the bet can be judged (all tries included). */
  effortHours: number;
  /** What it can do if it works: capped (a small, predictable gain), steady (slow, compounding), lopsided (usually
   * nothing, now and then a lot). A judgment call per bet, not a measurement. */
  ceiling: "capped" | "steady" | "lopsided";
  /** For lopsided bets: how many tries to run before judging, judged on the best one, not the average. */
  tries?: number;
  cost: string;
  /** How long before you can judge it. */
  judgeAfter: string;
  measure: string;
  stop: string;
  evidence: "strong" | "some" | "anecdote";
  /** Section heading in knowledge/small-bets.md. */
  section: string;
}

export interface SmallBetsFacts {
  traction?: { activeUsers?: number; monthlyVisits?: number; payingCustomers?: number; asOf?: string };
  assets?: { data?: string; expertise?: string; founderAudience?: string; newsworthy?: string; monthlyBudget?: number; accounts?: boolean; communities?: string; season?: string };
  audiences?: Audience[];
  surfaces?: Surface[];
  revenue?: "none" | "planned" | "live";
  /** People can use the product now. */
  launched?: boolean;
  avoid?: AvoidTag[];
  /** What the business refuses to do, in its own words; avoid holds the checkable part. */
  principles?: string[];
}

export interface StageReading {
  stage: Stage;
  basis: string;
}

// Stage thresholds are rules of thumb: stage 2 starts around a hundred active users or a couple of thousand monthly visits.
export const STAGE2_USERS = 100;
export const STAGE2_VISITS = 2000;

export function readStage(f: SmallBetsFacts): StageReading {
  const t = f.traction;
  if (f.assets?.newsworthy) return { stage: 3, basis: `newsworthy: ${f.assets.newsworthy}` };
  if (!t || (t.activeUsers === undefined && t.monthlyVisits === undefined && t.payingCustomers === undefined)) {
    return { stage: 0, basis: "no traction numbers in the profile, so treated as no users yet" };
  }
  const users = t.activeUsers ?? 0;
  const visits = t.monthlyVisits ?? 0;
  const paying = t.payingCustomers ?? 0;
  const as = t.asOf ? ` (as of ${t.asOf})` : "";
  if (users >= STAGE2_USERS || visits >= STAGE2_VISITS) return { stage: 2, basis: `${users} active users, ${visits} monthly visits${as}` };
  if (users > 0 || paying > 0) return { stage: 1, basis: `${users} active users, ${paying} paying${as}` };
  return { stage: 0, basis: `no active users yet${as}` };
}

const STAGE_LABEL: Record<Stage, string> = { 0: "no users yet", 1: "first users", 2: "steady use (around 100 active users or 2,000 monthly visits)", 3: "a newsworthy story or numbers" };

export interface Verdict {
  id: string;
  name: string;
  what: string;
  reason: string;
  cost?: string;
  judgeAfter?: string;
  measure?: string;
  stop?: string;
  evidence?: Bet["evidence"];
  effortHours?: number;
  ceiling?: Bet["ceiling"];
  tries?: number;
  /** ceiling × evidence ÷ √effort; fitsNow is sorted by it, highest first. */
  score?: number;
  playbookSection?: string;
  /** What learn_more takes to expand this bet. */
  learnMore: string;
}

export interface MatchResult {
  stage: StageReading;
  fitsNow: Verdict[];
  fitsLater: Verdict[];
  doesntFit: Verdict[];
  /** Facts the match had to guess; say these in one line so the user can correct them. */
  assumptions: string[];
  /** The business's principles in its own words: check each fitting bet against them before proposing it. */
  checkAgainst: string[];
  howToReport: string;
}

export const HOW_TO_REPORT =
  "Show only fitsNow, in score order (what it can do if it works, evidence, effort; a rule of thumb), as small bets separate from the moves; each with its first test, how to measure it and when to stop. For a lopsided bet, say to run all its tries and judge by the best one. Mention a fitsLater bet in one line only if its blocker is close. List doesntFit only if the user asks or proposed that bet. Say the assumptions in one line so the user can correct them. Before proposing a bet, check it against checkAgainst, the business's own principles; drop any it would break.";

// Ranking weights, a rule of thumb: what a bet can do if it works, discounted a little for weak evidence and by the
// square root of its effort, so a 1-hour bet doesn't beat everything just for being quick.
export const CEILING_WEIGHT = { capped: 1, steady: 2, lopsided: 3 } as const;
export const EVIDENCE_WEIGHT = { strong: 1, some: 0.85, anecdote: 0.7 } as const;
export const betScore = (b: Pick<Bet, "ceiling" | "evidence" | "effortHours">) =>
  Math.round(((CEILING_WEIGHT[b.ceiling] * EVIDENCE_WEIGHT[b.evidence]) / Math.sqrt(Math.max(1, b.effortHours))) * 1000) / 1000;

export function factsFromProfile(p: BusinessProfile): SmallBetsFacts {
  return { traction: p.traction, assets: p.assets, audiences: p.audiences, surfaces: p.surfaces, revenue: p.revenue, launched: p.launched, avoid: p.avoid, principles: p.principles };
}

export function matchSmallBets(f: SmallBetsFacts, bets: Bet[] = BETS): MatchResult {
  const stage = readStage(f);
  const a = f.assets ?? {};
  const budget = a.monthlyBudget ?? 0;
  const assumptions: string[] = [];
  if (stage.basis.startsWith("no traction")) assumptions.push("No traction numbers saved; treated as no users yet. Save traction (active users, monthly visits, paying customers) to unlock later-stage bets.");
  if (!f.audiences?.length) assumptions.push("Audience not saved (businesses, developers, consumers, hobbyists, local), so no bet was ruled out for its audience.");
  if (!f.surfaces?.length) assumptions.push("Product surfaces not saved (web app, mobile app, CLI, library, API, bot...), so bets that need a specific surface were kept.");
  if (!f.avoid) assumptions.push("No 'avoid' list saved, so no bet was ruled out by the business's principles. Check each fitting bet against its non-goals before proposing it.");
  if (f.revenue === undefined) assumptions.push("Revenue model not saved; bets that need something to sell were treated as fitting later.");
  // Users or payers mean the product is live, whatever the profile says.
  const launched = f.launched ?? ((f.traction?.activeUsers ?? 0) > 0 || (f.traction?.payingCustomers ?? 0) > 0 ? true : undefined);
  if (launched === undefined) assumptions.push("Launch status not saved; treated as not live yet, so launch posts wait and a waitlist is suggested.");

  const fitsNow: Verdict[] = [];
  const fitsLater: Verdict[] = [];
  const doesntFit: Verdict[] = [];
  const base = (b: Bet) => ({ id: b.id, name: b.name, what: b.what, learnMore: `bet:${b.id}` });

  for (const b of bets) {
    // Permanent mismatches first: who it's for, what the product is, what the business refuses.
    if (b.audiences && f.audiences?.length && !b.audiences.some((x) => f.audiences!.includes(x))) {
      doesntFit.push({ ...base(b), reason: `suits ${b.audiences.join(" or ")}; the profile's audience is ${f.audiences.join(", ")}` });
      continue;
    }
    if (b.surfaces && f.surfaces?.length && !b.surfaces.some((x) => f.surfaces!.includes(x))) {
      doesntFit.push({ ...base(b), reason: `needs a ${b.surfaces.join(" or ")}; the product is ${f.surfaces.join(", ")}` });
      continue;
    }
    const clash = (b.involves ?? []).filter((t) => f.avoid?.includes(t));
    if (clash.length) {
      doesntFit.push({ ...base(b), reason: `involves ${clash.join(", ")}, which the profile rules out` });
      continue;
    }
    if (b.launch === "before" && launched) {
      doesntFit.push({ ...base(b), reason: "only before launch; the product is already live" });
      continue;
    }
    if (b.needs?.revenue && f.revenue === "none") {
      doesntFit.push({ ...base(b), reason: "needs something to sell; the profile says there is no revenue model" });
      continue;
    }

    // Then what's missing now.
    const blockers: string[] = [];
    let need = b.stage;
    if (b.dataSkipsStage && a.data) need = 0;
    if (b.budgetSkipsStage !== undefined && budget >= b.budgetSkipsStage) need = 0;
    if (b.seasonSkipsStage && a.season) need = 0;
    if (stage.stage < need) blockers.push(`needs ${STAGE_LABEL[need]}; now ${STAGE_LABEL[stage.stage]}`);
    const n = b.needs ?? {};
    if (n.data && !a.data) blockers.push("needs data you hold that nobody else has published");
    if (n.expertise && !a.expertise) blockers.push("needs expertise or a method to show (not in the profile)");
    if (n.founderAudience && !a.founderAudience) blockers.push("needs a founder audience where the buyers are");
    if (n.accounts && !a.accounts) blockers.push("needs a way to reach each user (accounts or emails)");
    if (n.revenue && f.revenue !== "live") blockers.push("needs something to sell now");
    if (n.budget && budget < n.budget) blockers.push(`needs about $${n.budget} a month`);
    if (n.newsworthy && !a.newsworthy) blockers.push("needs a story others would retell");
    if (n.communities && !a.communities) blockers.push("needs an audience that gathers in moderated communities (save where, as assets.communities)");
    if (b.launch === "after" && !launched) blockers.push("needs a product people can try now");

    if (blockers.length) fitsLater.push({ ...base(b), reason: blockers.join("; ") });
    else
      fitsNow.push({
        ...base(b),
        reason: fitReason(b, f, stage.stage),
        cost: b.cost,
        judgeAfter: b.judgeAfter,
        measure: b.measure,
        stop: b.stop,
        evidence: b.evidence,
        effortHours: b.effortHours,
        ceiling: b.ceiling,
        ...(b.tries ? { tries: b.tries } : {}),
        score: betScore(b),
        playbookSection: b.section,
      });
  }
  fitsNow.sort((x, y) => y.score! - x.score!);
  return { stage, fitsNow, fitsLater, doesntFit, assumptions, checkAgainst: f.principles ?? [], howToReport: HOW_TO_REPORT };
}

function fitReason(b: Bet, f: SmallBetsFacts, stage: Stage): string {
  const parts: string[] = [];
  if (b.dataSkipsStage && f.assets?.data && b.stage > stage) parts.push(`your data (${f.assets.data}) stands in for users`);
  else if (b.seasonSkipsStage && f.assets?.season && b.stage > stage) parts.push(`your season (${f.assets.season}) sets the timing`);
  else if (b.budgetSkipsStage !== undefined && (f.assets?.monthlyBudget ?? 0) >= b.budgetSkipsStage && b.stage > stage) parts.push("budget buys the reach users would bring; check the product keeps people first");
  else parts.push(b.stage === 0 ? "works with no users" : `works at your stage (${STAGE_LABEL[stage]})`);
  if (b.needs?.expertise) parts.push("uses your expertise");
  if (b.needs?.data) parts.push("uses your data");
  if (b.needs?.founderAudience) parts.push("uses the founder's audience");
  return parts.join("; ");
}
