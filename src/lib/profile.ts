// Persistent business profiles: the context (customer, positioning, numbers, voice) that every
// piece of advice depends on. Stored as JSON files so they're readable, diffable and portable.

import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

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
  openQuestions?: string[];
  notes?: string;
  updatedAt?: string;
}

const NAME_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;

export function dataDir(): string {
  return process.env.MARKETING_EXPERT_DATA_DIR ?? join(homedir(), ".marketing-expert");
}

function profilesDir(): string {
  return join(dataDir(), "profiles");
}

function pathFor(name: string): string {
  if (!NAME_RE.test(name)) throw new RangeError(`profile name must be lowercase letters, digits and dashes (got "${name}")`);
  return join(profilesDir(), `${name}.json`);
}

export function listProfiles(): Array<{ name: string; product?: string; updatedAt?: string }> {
  const dir = profilesDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        const p = JSON.parse(readFileSync(join(dir, f), "utf8")) as BusinessProfile;
        return { name: p.name, product: p.product, updatedAt: p.updatedAt };
      } catch (e) {
        return { name: f.replace(/\.json$/, ""), product: `UNREADABLE: ${e instanceof Error ? e.message : String(e)}` };
      }
    });
}

export function getProfile(name: string): BusinessProfile | null {
  const p = pathFor(name);
  return existsSync(p) ? (JSON.parse(readFileSync(p, "utf8")) as BusinessProfile) : null;
}

/**
 * Merge `patch` into the stored profile. Scalars replace; arrays replace (send the full list);
 * metrics and voice merge by key. Pass null for a field to delete it.
 */
export function saveProfile(name: string, patch: Partial<Record<keyof BusinessProfile, unknown>>): BusinessProfile {
  const existing = getProfile(name) ?? { name };
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
      merged.voice = { ...(existing.voice ?? {}), ...(v as object) };
    } else {
      merged[k] = v;
    }
  }
  merged.name = name;
  merged.updatedAt = new Date().toISOString();
  mkdirSync(profilesDir(), { recursive: true });
  writeFileSync(pathFor(name), JSON.stringify(merged, null, 2) + "\n");
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

/** Metrics older than `months` relative to now (only those with a parseable asOf). */
export function staleMetrics(p: BusinessProfile, months = 6, now = new Date()): string[] {
  const out: string[] = [];
  for (const [k, m] of Object.entries(p.metrics ?? {})) {
    if (!m.asOf) {
      out.push(`${k} (no date)`);
      continue;
    }
    const d = new Date(m.asOf.length === 7 ? `${m.asOf}-01` : m.asOf);
    if (Number.isNaN(d.getTime())) continue;
    const ageMonths = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    if (ageMonths > months) out.push(`${k} (as of ${m.asOf})`);
  }
  return out;
}
