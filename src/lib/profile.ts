// Persistent business profiles: the context (customer, positioning, numbers, voice) that every
// piece of advice depends on. Stored as JSON files so they're readable, diffable and portable.

import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync, renameSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join } from "node:path";
import type { Audience, AvoidTag, Surface } from "./smallBets.js";

export interface Metric {
  value: number | string;
  /** When the number was true, e.g. "2026-09". Numbers without dates go stale silently. */
  asOf?: string;
  source?: string;
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
  channels?: string[];
  metrics?: Record<string, Metric>;
  voice?: { do?: string[]; dont?: string[] };
  constraints?: string[];
  /** Facts match_small_bets uses to decide which bets fit. */
  traction?: { activeUsers?: number; monthlyVisits?: number; payingCustomers?: number; asOf?: string };
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
 * metrics and voice merge by key. Pass null for a field to delete it. If the stored file can't be read,
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
