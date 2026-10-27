// Persistent business profiles: the context (customer, positioning, numbers, voice) that every
// piece of advice depends on. Stored as JSON files so they're readable, diffable and portable.

import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync, renameSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join } from "node:path";
import type { Audience, AvoidTag, Channel, Surface } from "./smallBets.js";

/** "counted": looked up in a record (a database, Stripe, an analytics export). Anything else, missing included, is an estimate. */
export type Basis = "counted" | "estimated";

export interface Metric {
  value: number | string;
  /** When the number was true, e.g. "2026-09". Numbers without dates go stale silently. */
  asOf?: string;
  source?: string;
  basis?: Basis;
}

/** A move's stop line, saved when the move is chosen so the next run asks what happened instead of relying on memory. */
export interface Prediction {
  id: string;
  madeOn: string;
  move: string;
  metric?: string;
  stop: string;
  /** For a count stop line ("fewer than k of n"): the threshold k and the number of tries n. */
  k?: number;
  n?: number;
  /** When the stop line is due to be read, e.g. "2026-09-15". */
  checkOn: string;
  outcome?: PredictionOutcome;
}

export interface PredictionOutcome {
  recordedOn: string;
  /** What happened, with the number. */
  result: string;
  /** true: the stop line was hit (stop the move). false: it was cleared. null: unknown, e.g. the move never ran. */
  stopHit: boolean | null;
  /** "measured": read from a record. "recalled": the founder's memory. */
  how: "measured" | "recalled";
  /** Successes and tries actually seen, for a count stop line. */
  k?: number;
  n?: number;
}

export interface BusinessProfile {
  name: string;
  product?: string;
  category?: string;
  businessModel?: string;
  stage?: string;
  bestFitCustomers?: string;
  competitiveAlternatives?: string[];
  differentiators?: string[];
  valueThemes?: string[];
  proof?: string[];
  pricing?: string;
  channels?: Channel[];
  metrics?: Record<string, Metric>;
  voice?: { do?: string[]; dont?: string[] };
  constraints?: string[];
  /** Facts match_small_bets uses to decide which bets fit. */
  traction?: { activeUsers?: number; monthlyVisits?: number; payingCustomers?: number; asOf?: string; basis?: Basis };
  assets?: { data?: string; expertise?: string; founderAudience?: string; newsworthy?: string; monthlyBudget?: number; accounts?: boolean; communities?: string; season?: string; visual?: string };
  audiences?: Audience[];
  surfaces?: Surface[];
  revenue?: "none" | "planned" | "live";
  /** People can use the product now. */
  launched?: boolean;
  /** Where the business operates or sells: countries, provinces or states. */
  markets?: string[];
  /** What the business refuses to do, in its own words (its non-goals). */
  principles?: string[];
  /** Things the business rules out (its non-goals and principles), as fixed tags. */
  avoid?: AvoidTag[];
  openQuestions?: string[];
  predictions?: Prediction[];
  notes?: string;
  updatedAt?: string;
}

const NAME_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;

export function dataDir(): string {
  // An empty value is how MCP client configs often "unset" a variable. A relative path would depend on
  // the directory the client starts the server in, so profiles would seem to disappear between sessions.
  const d = process.env.MARKETING_EXPERT_DATA_DIR?.trim();
  if (!d) return join(homedir(), ".marketing-expert");
  if (!isAbsolute(d)) throw new RangeError(`MARKETING_EXPERT_DATA_DIR must be an absolute path (got "${d}")`);
  return d;
}

function profilesDir(): string {
  return join(dataDir(), "profiles");
}

function pathFor(name: string): string {
  if (!NAME_RE.test(name)) throw new RangeError(`profile name must be lowercase letters, digits and dashes (got "${name}")`);
  return join(profilesDir(), `${name}.json`);
}

/** Profiles by file name, which is the name get_business_profile loads; files with names it can't load are left out. */
export function listProfiles(): Array<{ name: string; product?: string; updatedAt?: string }> {
  const dir = profilesDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json") && NAME_RE.test(f.slice(0, -5)))
    .map((f) => {
      const name = f.slice(0, -5);
      try {
        const p = readObject(join(dir, f));
        const str = (v: unknown) => (typeof v === "string" ? v : undefined);
        return { name, product: str(p.product), updatedAt: str(p.updatedAt) };
      } catch (e) {
        return { name, product: `UNREADABLE: ${e instanceof Error ? e.message : String(e)}` };
      }
    });
}

// A hand-edited file can hold valid JSON that is not a profile, such as null, a list or a string.
function readObject(file: string): Record<string, unknown> {
  const v: unknown = JSON.parse(readFileSync(file, "utf8"));
  if (typeof v !== "object" || v === null || Array.isArray(v)) throw new SyntaxError(`the file is valid JSON but not a JSON object (got ${JSON.stringify(v)?.slice(0, 40)})`);
  return v as Record<string, unknown>;
}

export function getProfile(name: string): BusinessProfile | null {
  const p = pathFor(name);
  return existsSync(p) ? (readObject(p) as unknown as BusinessProfile) : null;
}

/**
 * Merge `patch` into the stored profile. Scalars replace; arrays replace (send the full list);
 * metrics and voice merge by key; predictions merge by id (see mergePredictions). Pass null for a field to delete it. If the stored file can't be read,
 * it is moved to <name>.json.bak (or a name with the time, if that exists), the save starts from an empty profile, and a message is added to `warnings`.
 */
export function saveProfile(name: string, patch: Partial<Record<keyof BusinessProfile, unknown>>, warnings: string[] = []): BusinessProfile {
  let existing: BusinessProfile;
  try {
    existing = getProfile(name) ?? { name };
  } catch (e) {
    if (!(e instanceof SyntaxError)) throw e;
    // Never overwrite an earlier backup: the second one gets the time in its name.
    let bak = `${pathFor(name)}.bak`;
    if (existsSync(bak)) bak = `${pathFor(name)}.${new Date().toISOString().replace(/[:.]/g, "-")}.bak`;
    renameSync(pathFor(name), bak);
    warnings.push(`The stored profile could not be read (${e instanceof Error ? e.message : String(e)}). It was moved to ${bak} and this save started from an empty profile; copy back any facts you still need.`);
    existing = { name };
  }
  const merged: Record<string, unknown> = { ...existing };
  for (const [k, v] of Object.entries(patch)) {
    if (k === "name") continue;
    if (v === null) {
      delete merged[k];
    } else if (k === "metrics" && typeof v === "object") {
      const m = { ...(existing.metrics ?? {}) } as Record<string, Metric | null>;
      for (const [mk, mv] of Object.entries(v as Record<string, Metric | null>)) {
        if (mv === null) delete m[mk];
        else m[mk] = mv;
      }
      merged.metrics = m;
    } else if (k === "voice" && typeof v === "object") {
      const voice: Record<string, unknown> = { ...(existing.voice ?? {}), ...(v as object) };
      for (const vk of Object.keys(voice)) if (voice[vk] === null) delete voice[vk];
      merged.voice = voice;
    } else if (k === "predictions" && Array.isArray(v)) {
      merged.predictions = mergePredictions(existing.predictions, v as Array<Partial<Prediction>>, warnings);
    } else {
      merged[k] = v;
    }
  }
  merged.name = name;
  merged.updatedAt = new Date().toISOString();
  mkdirSync(profilesDir(), { recursive: true });
  // Write a temporary file and rename it, so a crash or a full disk never leaves a half-written profile.
  const tmp = `${pathFor(name)}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(merged, null, 2) + "\n");
  renameSync(tmp, pathFor(name));
  return merged as unknown as BusinessProfile;
}

/** Fields the advice depends on that are still empty, most important first. */
export function missingFields(p: BusinessProfile): string[] {
  const order: Array<keyof BusinessProfile> = ["product", "bestFitCustomers", "competitiveAlternatives", "differentiators", "businessModel", "pricing", "metrics", "channels", "proof", "voice", "stage"];
  return order.filter((k) => {
    const v = p[k];
    return v === undefined || (Array.isArray(v) && v.length === 0) || (typeof v === "object" && v !== null && Object.keys(v).length === 0);
  });
}

/** Metrics older than `months` relative to now, plus those with no date or a date that can't be read. */
export function staleMetrics(p: BusinessProfile, months = 6, now = new Date()): string[] {
  const out: string[] = [];
  for (const [k, m] of Object.entries(p.metrics ?? {})) {
    // A hand-edited file can hold null or a number here.
    if (!m || typeof m !== "object") continue;
    if (!m.asOf || typeof m.asOf !== "string") {
      out.push(`${k} (no date)`);
      continue;
    }
    const d = new Date(m.asOf.length === 7 ? `${m.asOf}-01` : m.asOf);
    if (Number.isNaN(d.getTime())) {
      out.push(`${k} (unknown age: can't read the date "${m.asOf}")`);
      continue;
    }
    const ageMonths = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    if (ageMonths > months) out.push(`${k} (as of ${m.asOf})`);
  }
  return out;
}

const DAY_MS = 1000 * 60 * 60 * 24;

/** A "2026-09" date means the end of that month; a full date means that day. Null if it can't be read. */
function readDate(s: unknown, monthEnd: boolean): Date | null {
  if (typeof s !== "string" || !/^\d{4}-\d{2}(-\d{2})?/.test(s)) return null;
  if (s.length === 7) {
    const d = new Date(`${s}-01T00:00:00Z`);
    if (Number.isNaN(d.getTime())) return null;
    if (monthEnd) d.setUTCMonth(d.getUTCMonth() + 1, 0);
    return d;
  }
  const d = new Date(s.length === 10 ? `${s}T00:00:00Z` : s);
  return Number.isNaN(d.getTime()) ? null : d;
}

const today = () => new Date().toISOString().slice(0, 10);
const isCount = (x: unknown) => Number.isInteger(x) && (x as number) >= 0;

function checkCounts(where: string, k: unknown, n: unknown): void {
  if (k === undefined && n === undefined) return;
  if (!isCount(k) || !isCount(n) || (n as number) < 1 || (k as number) > (n as number))
    throw new RangeError(`${where}: k and n go together, as whole numbers with 0 ≤ k ≤ n and n ≥ 1 (got k=${JSON.stringify(k)}, n=${JSON.stringify(n)})`);
}

/**
 * Merge predictions by id, so a partial list never erases earlier ones. Fields sent for an existing id replace
 * those fields (null deletes one, e.g. outcome: null); ids not sent are kept. A new id needs move, stop and checkOn.
 * Throws RangeError on an entry that can't be saved, so nothing is written.
 */
export function mergePredictions(existing: unknown, patch: Array<Partial<Prediction>>, warnings: string[] = []): Prediction[] {
  const out: Prediction[] = Array.isArray(existing) ? existing.filter((x) => x && typeof x === "object").map((x) => ({ ...x })) : [];
  for (const raw of patch) {
    const id = raw?.id;
    if (typeof id !== "string" || !NAME_RE.test(id)) throw new RangeError(`each prediction needs an id of lowercase letters, digits and dashes (got ${JSON.stringify(id)})`);
    const i = out.findIndex((x) => x.id === id);
    const next: Record<string, unknown> = i >= 0 ? { ...out[i] } : { madeOn: today() };
    for (const [k, v] of Object.entries(raw)) {
      if (v === null) delete next[k];
      else if (v !== undefined) next[k] = v;
    }
    for (const f of ["move", "stop", "checkOn"] as const)
      if (typeof next[f] !== "string" || !(next[f] as string).trim()) throw new RangeError(`prediction "${id}" needs ${f}`);
    if (!readDate(next.checkOn, true)) throw new RangeError(`prediction "${id}": can't read checkOn "${next.checkOn}"; use YYYY-MM-DD`);
    if (!readDate(next.madeOn, false)) throw new RangeError(`prediction "${id}": can't read madeOn "${next.madeOn}"; use YYYY-MM-DD`);
    checkCounts(`prediction "${id}"`, next.k, next.n);
    const o = next.outcome as Partial<PredictionOutcome> | undefined;
    if (o) {
      const outcome = { recordedOn: today(), ...o };
      if (typeof outcome.result !== "string" || !outcome.result.trim()) throw new RangeError(`prediction "${id}": the outcome needs result, saying what happened`);
      if (outcome.stopHit === false && !/\d/.test(outcome.result))
        throw new RangeError(`prediction "${id}": an outcome that cleared the stop line needs the number in result (e.g. "7 of 40 replied"), not only that it worked`);
      checkCounts(`prediction "${id}" outcome`, outcome.k, outcome.n);
      if (typeof next.k === "number" && typeof outcome.k === "number") {
        if (outcome.n !== next.n) {
          warnings.push(`Prediction "${id}": the outcome counts ${outcome.k} of ${outcome.n}, the stop line ${next.k} of ${next.n}; stopHit was not checked against the counts because the number of tries differs.`);
        } else if (outcome.stopHit !== null && outcome.stopHit !== outcome.k < next.k) {
          warnings.push(`Prediction "${id}": stopHit is ${outcome.stopHit}, but ${outcome.k} of ${outcome.n} is ${outcome.k < next.k ? "below" : "at or above"} the stop line's ${next.k}, read as "fewer than ${next.k} means stop". Check the stop line's wording and fix stopHit if needed.`);
        }
      }
      next.outcome = outcome;
    }
    if (i >= 0) out[i] = next as unknown as Prediction;
    else out.push(next as unknown as Prediction);
  }
  return out;
}

/** Predictions past their check date with no outcome saved, including those whose date can't be read. */
export function duePredictions(p: BusinessProfile, now = new Date()): Array<Prediction & { daysOverdue: number | null }> {
  if (!Array.isArray(p.predictions)) return [];
  const out: Array<Prediction & { daysOverdue: number | null }> = [];
  for (const x of p.predictions) {
    if (!x || typeof x !== "object" || x.outcome) continue;
    const d = readDate(x.checkOn, true);
    if (!d) out.push({ ...x, daysOverdue: null });
    else if (d.getTime() <= now.getTime()) out.push({ ...x, daysOverdue: Math.floor((now.getTime() - d.getTime()) / DAY_MS) });
  }
  return out;
}

export const DUE_PREDICTIONS_NOTE =
  "These moves were due for a decision on their check date, and no outcome is saved. Before new advice, ask the user what happened to each: the number, and whether it was measured or recalled. Save it with save_business_profile (predictions, same id, outcome with result, stopHit and how). Not checked: whether the move was run at all, or whether the user's material already holds the answer; read it first. daysOverdue null means the check date can't be read.";

/** Traction and metrics not marked as counted from a record; a missing basis counts as an estimate. */
export function estimatedFacts(p: BusinessProfile): string[] {
  const out: string[] = [];
  const t = p.traction;
  if (t && typeof t === "object" && t.basis !== "counted") {
    const keys = (["activeUsers", "monthlyVisits", "payingCustomers"] as const).filter((k) => t[k] !== undefined);
    if (keys.length) out.push(`traction (${keys.join(", ")})${t.basis ? "" : " (no basis saved)"}`);
  }
  for (const [k, m] of Object.entries(p.metrics ?? {})) {
    if (m && typeof m === "object" && m.basis !== "counted") out.push(`metrics.${k}${m.basis ? "" : " (no basis saved)"}`);
  }
  return out;
}
