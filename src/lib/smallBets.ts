// Small bets: cheap marketing moves, matched against a business profile. Each bet declares what it needs
// (users, traffic, data, an audience, money), which kinds of business it suits, and what it involves that a
// business may refuse (publishing user data, sharing metrics, cold outreach). The matcher sorts bets into
// fits now / fits later / doesn't fit, with the reason for each. The playbook is knowledge/small-bets.md;
// the evidence is in research/small-bets*.md.

import type { BusinessProfile } from "./profile.js";
import { BETS } from "./smallBetsCatalog.js";
import { sections } from "./knowledge.js";

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
    /** Users make or see something worth showing as an image (a finished project, a dish, a room, an outfit). */
    visual?: boolean;
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
  /** The ceiling for some audiences, where it differs from `ceiling` (short video is lopsided for consumers, capped
   * for B2B buyers). A profile's effective ceiling is the best one among its audiences. */
  ceilingFor?: Partial<Record<Audience, Bet["ceiling"]>>;
  /** Which kind of marketing law the bet runs into, so the advisor checks the rules of the business's markets. */
  law?: "messages" | "reviews-and-endorsements" | "pricing";
  /** For lopsided bets: how many tries to run before judging, judged on the best one, not the average. */
  tries?: number;
  /** Only for businesses whose saved category or product matches `words`; `label` names them in reasons. */
  onlyFor?: { words: RegExp; label: string };
  /** Notes added to the fit reason when the saved category or product matches (a store rule for that kind of app). */
  notes?: Array<{ match: RegExp; note: string }>;
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
  /** The business's own words for what it is; bets with onlyFor or notes read them. */
  category?: string;
  product?: string;
  traction?: { activeUsers?: number; monthlyVisits?: number; payingCustomers?: number; asOf?: string; basis?: "counted" | "estimated" };
  assets?: { data?: string; expertise?: string; founderAudience?: string; newsworthy?: string; monthlyBudget?: number; accounts?: boolean; communities?: string; season?: string; visual?: string };
  audiences?: Audience[];
  surfaces?: Surface[];
  revenue?: "none" | "planned" | "live";
  /** People can use the product now. */
  launched?: boolean;
  avoid?: AvoidTag[];
  /** What the business refuses to do, in its own words; avoid holds the checkable part. */
  principles?: string[];
  /** Where the business operates or sells (countries, provinces, states), e.g. "Quebec", "Turkey". */
  markets?: string[];
  /** Where current users came from, in the business's words, e.g. "Reddit", "word of mouth", "Google". */
  channels?: Channel[];
}

export interface StageReading {
  stage: Stage;
  basis: string;
}

// Stage thresholds are rules of thumb: stage 2 starts around a hundred active users or a couple of thousand monthly visits.
export const STAGE2_USERS = 100;
export const STAGE2_VISITS = 2000;
// One person selling their own time may never reach 100 active users, even when fully booked; paying clients stand in
// for them. 20 is a judgment call: caseload data is thin (research/solo-practice-capacity-and-stage.md).
export const SERVICE_STAGE2_CLIENTS = 20;

export function readStage(f: SmallBetsFacts): StageReading {
  const t = f.traction;
  if (f.assets?.newsworthy) return { stage: 3, basis: `newsworthy: ${f.assets.newsworthy}` };
  if (!t || (t.activeUsers === undefined && t.monthlyVisits === undefined && t.payingCustomers === undefined)) {
    return { stage: 0, basis: "no traction numbers in the profile, so treated as no users yet" };
  }
  const users = t.activeUsers ?? 0;
  const visits = t.monthlyVisits ?? 0;
  const paying = t.payingCustomers ?? 0;
  const as = `${t.asOf ? ` (as of ${t.asOf})` : ""}${t.basis === "counted" ? "" : ", estimated"}`;
  if (users >= STAGE2_USERS || visits >= STAGE2_VISITS) return { stage: 2, basis: `${users} active users, ${visits} monthly visits${as}` };
  if (f.surfaces?.includes("service") && paying >= SERVICE_STAGE2_CLIENTS) return { stage: 2, basis: `${paying} paying clients of a service${as}` };
  if (users > 0 || paying > 0) return { stage: 1, basis: `${users} active users, ${paying} paying${as}` };
  return { stage: 0, basis: `no active users yet${as}` };
}

const STAGE_LABEL: Record<Stage, string> = { 0: "no users yet", 1: "first users", 2: "steady use (around 100 active users or 2,000 monthly visits; for a service, about 20 paying clients)", 3: "a newsworthy story or numbers" };

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
  /** ceiling × evidence ÷ √effort, × CHANNEL_BOOST when it builds on a working channel; fitsNow is sorted by it. */
  score?: number;
  /** The profile's channel this bet builds on: one already bringing users. */
  workingChannel?: string;
  playbookSection?: string;
  /** What learn_more takes to expand this bet. */
  learnMore: string;
  /** For bets that touch marketing law: which rules to check, and the market sections to read. */
  lawCheck?: string;
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
  /** For each market in the profile, the marketing-law section to read (null when the playbook has none). */
  marketLaw: Array<{ market: string; pointer: string | null }>;
  howToReport: string;
}

export const HOW_TO_REPORT =
  "Show only fitsNow, in score order (what it can do if it works, evidence, effort; a rule of thumb), as small bets separate from the moves; each with its first test, how to measure it and when to stop. For a lopsided bet, say to run all its tries and judge by the best one. Mention a fitsLater bet in one line only if its blocker is close. List doesntFit only if the user asks or proposed that bet. Say the assumptions in one line so the user can correct them. Before proposing a bet, check it against checkAgainst, the business's own principles; drop any it would break.";

// Ranking weights, a rule of thumb: what a bet can do if it works, discounted a little for weak evidence and by the
// square root of its effort, so a 1-hour bet doesn't beat everything just for being quick.
export const CEILING_WEIGHT = { capped: 1, steady: 2, lopsided: 3 } as const;
export const EVIDENCE_WEIGHT = { strong: 1, some: 0.85, anecdote: 0.7 } as const;
/** The bet's ceiling for these audiences: the best among them, each audience taking its override or the default. */
export function ceilingFor(b: Pick<Bet, "ceiling" | "ceilingFor">, audiences?: Audience[]): Bet["ceiling"] {
  if (!b.ceilingFor || !audiences?.length) return b.ceiling;
  return audiences.map((a) => b.ceilingFor![a] ?? b.ceiling).reduce((best, c) => (CEILING_WEIGHT[c] > CEILING_WEIGHT[best] ? c : best));
}
export const betScore = (b: Pick<Bet, "ceiling" | "evidence" | "effortHours">) =>
  Math.round(((CEILING_WEIGHT[b.ceiling] * EVIDENCE_WEIGHT[b.evidence]) / Math.sqrt(Math.max(1, b.effortHours))) * 1000) / 1000;

// A channel already bringing users shows the audience can be reached there, so bets on it rank higher. The boost is
// a rule of thumb: enough to lift a bet over one a step above it, not enough to make a capped bet beat a lopsided one of equal effort.
export const CHANNEL_BOOST = 1.5;
/** Kinds of channel, the words a profile uses for each, and the bets that build on it. Matching is by keyword only. */
export const CHANNEL_KINDS: Array<{ kind: string; words: RegExp; bets: string[] }> = [
  { kind: "search", words: /\b(search|seo|google|bing|organic)\b/i, bets: ["comparison-pages", "error-pages", "data-pages", "teardowns", "free-tool"] },
  { kind: "communities", words: /\b(reddit|subreddits?|discord|forums?|communit(y|ies)|slack|facebook groups?|stack overflow|hacker news)\b/i, bets: ["answer-questions", "moderator-tool", "own-community"] },
  { kind: "word of mouth", words: /\b(word of mouth|referrals?|friends?|recommend(ed|ations?)?)\b/i, bets: ["ask-happy-users", "shareable-outputs", "founder-thanks", "affiliate"] },
  { kind: "store listings", words: /\b(app store|play store|web store|store listing|marketplace|director(y|ies)|listings?)\b/i, bets: ["listings", "integration", "perk-programmes"] },
  // A launch that brought users boosts nothing: posting the same product to the same site again is a resubmission,
  // which the sites limit (research/relaunch-rules.md). matchSmallBets says so in the launch-sites reason instead.
  { kind: "launch sites", words: /\b(product hunt|show hn|launch)\b/i, bets: [] },
  { kind: "social", words: /\b(twitter|x|linkedin|bluesky|mastodon|social|tiktok|instagram|youtube)\b/i, bets: ["social-presence", "founder-videos", "building-in-public"] },
  { kind: "pinterest", words: /\bpinterest\b/i, bets: ["pinterest-pins"] },
  { kind: "newsletters", words: /\bnewsletters?\b/i, bets: ["curator-submissions", "newsletter-sponsorship", "own-community"] },
  { kind: "open source", words: /\b(github|open source|open-source)\b/i, bets: ["open-source", "upstream-fixes", "fix-famous-projects"] },
  { kind: "email", words: /\b(email|e-mail|mailing list)\b/i, bets: ["founder-emails", "changelog"] },
  { kind: "in person", words: /\b(in person|door to door|shops?|stores? nearby|events?|meetups?|flyers?|posters?)\b/i, bets: ["merchant-visits", "in-store-signs", "calendar-events", "guest-spots"] },
  { kind: "podcasts and press", words: /\b(podcasts?|press|articles?|blogs?)\b/i, bets: ["guest-spots", "journalist-requests", "press"] },
];

/** Where users came from. A plain string is a guess; `how` says how the founder knows (a user said so, a referrer, a tagged link, a sign-up answer). */
export type Channel = string | { name: string; how?: string };

/**
 * For each bet id, the first backed profile channel that names a kind the bet builds on; the channels that matched
 * none; and the channels that matched a kind but carry no reason, so they don't rank anything up.
 */
export function workingChannels(channels: Channel[] = []): { byBet: Map<string, { name: string; how: string }>; unmatched: string[]; unbacked: string[] } {
  const byBet = new Map<string, { name: string; how: string }>();
  const unmatched: string[] = [];
  const unbacked: string[] = [];
  for (const c of channels) {
    // A hand-edited profile can hold anything here; an entry without a name is reported, not skipped.
    const name = typeof c === "string" ? c : typeof c?.name === "string" ? c.name : JSON.stringify(c);
    const how = typeof c === "object" && c && typeof c.how === "string" ? c.how.trim() : "";
    const kinds = CHANNEL_KINDS.filter((k) => k.words.test(name));
    if (!kinds.length) unmatched.push(name);
    else if (!kinds.some((k) => k.bets.length)) continue;
    else if (!how) unbacked.push(name);
    else for (const k of kinds) for (const id of k.bets) if (!byBet.has(id)) byBet.set(id, { name, how });
  }
  return { byBet, unmatched, unbacked };
}

const LAW_PLAYBOOK = "marketing-law-by-market";
const LAW_WHAT = { messages: "consent rules for marketing emails and messages", "reviews-and-endorsements": "rules on asking for reviews, testimonials and paid endorsements", pricing: "price display and subscription rules" } as const;

// Cities and other names people write for the markets the law playbook covers.
const MARKET_ALIASES: Record<string, string> = {
  montreal: "quebec", "montréal": "quebec", "québec": "quebec", "quebec city": "quebec",
  toronto: "ontario", ottawa: "ontario", canada: "canada", vancouver: "canada", "british columbia": "canada",
  "san francisco": "california", "los angeles": "california", "bay area": "california", usa: "united states", us: "united states", "u.s.": "united states",
  istanbul: "turkey", "türkiye": "turkey", turkiye: "turkey", ankara: "turkey",
  yerevan: "armenia",
  "buenos aires": "argentina", caba: "argentina",
  brasil: "brazil", "são paulo": "brazil", "sao paulo": "brazil", "rio de janeiro": "brazil",
  "españa": "spain", espana: "spain", madrid: "spain", barcelona: "spain", valencia: "spain",
};
// Federal Canadian law (CASL, Competition Act) also applies in Quebec, and sits in its own section.
const ALSO_FEDERAL = new Set(["quebec"]);

/** The marketing-law section for each market: a section whose heading names the market (or the market names it). */
export function marketLawPointers(markets: string[] = []): MatchResult["marketLaw"] {
  const secs = sections().filter((s) => s.slug === LAW_PLAYBOOK && !/^sources?$/i.test(s.heading) && s.heading !== "Marketing law by market");
  const find = (m: string) => secs.find((x) => x.heading.toLowerCase().includes(m) || (m.length > 3 && m.includes(x.heading.toLowerCase().split(/[ (,]/)[0])));
  const named = new Set(markets.map((x) => MARKET_ALIASES[x.trim().toLowerCase()] ?? x.trim().toLowerCase()));
  let fedAdded = false;
  return markets.flatMap((market) => {
    const raw = market.trim().toLowerCase();
    const m = MARKET_ALIASES[raw] ?? raw;
    const s = find(m);
    const out: MatchResult["marketLaw"] = [{ market, pointer: s ? s.pointer : null }];
    const fed = find("canada");
    if (ALSO_FEDERAL.has(m) && !named.has("canada") && fed && !fedAdded) {
      fedAdded = true;
      out.push({ market: `${market} (federal Canada)`, pointer: fed.pointer });
    }
    return out;
  });
}

export function factsFromProfile(p: BusinessProfile): SmallBetsFacts {
  return { category: p.category, product: p.product, traction: p.traction, assets: p.assets, audiences: p.audiences, surfaces: p.surfaces, revenue: p.revenue, launched: p.launched, avoid: p.avoid, principles: p.principles, markets: p.markets, channels: p.channels };
}

export function matchSmallBets(f: SmallBetsFacts, bets: Bet[] = BETS): MatchResult {
  const stage = readStage(f);
  const a = f.assets ?? {};
  const budget = a.monthlyBudget ?? 0;
  const assumptions: string[] = [];
  if (stage.basis.startsWith("no traction")) assumptions.push("No traction numbers saved; treated as no users yet. Save traction (active users, monthly visits, paying customers) to unlock later-stage bets.");
  else if (f.traction?.basis !== "counted" && !stage.basis.startsWith("newsworthy"))
    assumptions.push(`Traction is not marked as counted from a record, so stage ${stage.stage} rests on an estimate. Say so in the answer; near ${STAGE2_USERS} active users or ${STAGE2_VISITS.toLocaleString("en-US")} monthly visits, ask for the counted number and save it with basis "counted".`);
  if (f.surfaces?.includes("service"))
    assumptions.push(`For a service, stage 2 starts at ${SERVICE_STAGE2_CLIENTS} paying clients, a rule of thumb: a solo practice can be full long before 100 active users. Say so if the stage decides a bet.`);
  if (!f.audiences?.length) assumptions.push("Audience not saved (businesses, developers, consumers, hobbyists, local), so no bet was ruled out for its audience.");
  if (!f.surfaces?.length) assumptions.push("Product surfaces not saved (web app, mobile app, CLI, library, API, bot...), so bets that need a specific surface were kept.");
  if (!f.avoid) assumptions.push("No 'avoid' list saved, so no bet was ruled out by the business's principles. Check each fitting bet against its non-goals before proposing it.");
  if (f.revenue === undefined) assumptions.push("Revenue model not saved; bets that need something to sell were treated as fitting later.");
  // Users or payers mean the product is live, whatever the profile says.
  const launched = f.launched ?? ((f.traction?.activeUsers ?? 0) > 0 || (f.traction?.payingCustomers ?? 0) > 0 ? true : undefined);
  if (launched === undefined) assumptions.push("Launch status not saved; treated as not live yet, so launch posts wait and a waitlist is suggested.");
  const working = workingChannels(f.channels);
  if (!f.channels?.length) assumptions.push("Channels not saved (where current users came from), so no bet was ranked up for building on a channel that already works.");
  if (working.unmatched.length) assumptions.push(`Channels matched no bet by keyword, so they didn't change the ranking: ${working.unmatched.join(", ")}.`);
  // A recalled source favours channels the founder posted in (research/channel-answer-accuracy.md), so a guess doesn't boost.
  if (working.unbacked.length)
    assumptions.push(`Not ranked up for ${working.unbacked.join(", ")}: no saved reason to think users came from there. Ask which recent users came from it and how the founder knows (the user said so, a referrer, a tagged link), and save that as the channel's how.`);

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
    const kind = [f.category, f.product].filter(Boolean).join(" / ");
    if (b.onlyFor && kind && !b.onlyFor.words.test(kind)) {
      doesntFit.push({ ...base(b), reason: `only for ${b.onlyFor.label}; the profile describes ${kind}` });
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
    if (n.visual && !a.visual) blockers.push("needs something users make or see that is worth showing as an image (save it as assets.visual)");
    if (n.communities && !a.communities) blockers.push("needs an audience that gathers in moderated communities (save where, as assets.communities)");
    if (b.launch === "after" && !launched) blockers.push("needs a product people can try now");
    if (b.onlyFor && !kind) blockers.push(`only for ${b.onlyFor.label}; save the profile's category to tell`);

    if (blockers.length) {
      fitsLater.push({ ...base(b), reason: blockers.join("; ") + notesFor(b, kind) });
      continue;
    }
    const channel = working.byBet.get(b.id);
    const relaunch = b.id === "launch-sites" ? launchedOn(f.channels) : undefined;
    const score = betScore({ ...b, ceiling: ceilingFor(b, f.audiences) });
    fitsNow.push({
      ...base(b),
      reason:
        fitReason(b, f, stage.stage) +
        (channel ? `; builds on ${channel.name}, which already brings users (${channel.how})` : "") +
        (relaunch ? `; ${RELAUNCH_NOTE(relaunch)}` : "") +
        (b.onlyFor ? `; for ${b.onlyFor.label}, read from the profile: ${kind}` : "") +
        notesFor(b, kind),
      cost: b.cost,
      judgeAfter: b.judgeAfter,
      measure: b.measure,
      stop: b.stop,
      evidence: b.evidence,
      effortHours: b.effortHours,
      ceiling: ceilingFor(b, f.audiences),
      ...(b.tries ? { tries: b.tries } : {}),
      score: channel ? Math.round(score * CHANNEL_BOOST * 1000) / 1000 : score,
      ...(channel ? { workingChannel: channel.name } : {}),
      playbookSection: b.section,
    });
  }
  fitsNow.sort((x, y) => y.score! - x.score!);
  const marketLaw = marketLawPointers(f.markets);
  if (!f.markets?.length) assumptions.push("Markets not saved (where the business operates); legal notes can't name the rules that apply. Save markets, e.g. Quebec, Turkey.");
  for (const v of fitsNow) {
    const law = bets.find((b) => b.id === v.id)?.law;
    if (law) v.lawCheck = `Check the ${LAW_WHAT[law]} in each market${marketLaw.length ? `: ${marketLaw.map((x) => x.pointer ?? `${x.market} (not covered yet)`).join(", ")}` : " (markets not saved)"}.`;
  }
  return { stage, fitsNow, fitsLater, doesntFit, assumptions, checkAgainst: f.principles ?? [], marketLaw, howToReport: HOW_TO_REPORT };
}

/** The bet's notes whose words match the saved category or product, as reason text. */
function notesFor(b: Bet, kind: string): string {
  return (b.notes ?? []).filter((x) => kind && x.match.test(kind)).map((x) => `; ${x.note}`).join("");
}

/** The first profile channel that names a launch site: the founder has launched there before. */
function launchedOn(channels: Channel[] = []): string | undefined {
  const sites = CHANNEL_KINDS.find((k) => k.kind === "launch sites")!.words;
  for (const c of channels) {
    const name = typeof c === "string" ? c : typeof c?.name === "string" ? c.name : "";
    if (sites.test(name)) return name;
  }
}
// The sites' own rules, research/relaunch-rules.md §1–2.
const RELAUNCH_NOTE = (site: string) =>
  `you already launched on ${site}. Launching there again needs real news: Product Hunt asks for two months and a significant update; Show HN asks for a much changed version. Try a site you haven't used`;

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
