// Analytics tracking checks: captured events against a declared tracking plan (schema), and the difference between
// two versions of a plan. Pure: the caller passes both; nothing is stored or fetched. Events are not guessed from
// source code: only captured events are checked.

import { isIP } from "node:net";

export const PROPERTY_TYPES = ["string", "number", "integer", "boolean", "object", "array", "null"] as const;
type PropType = (typeof PROPERTY_TYPES)[number];
export const CONVENTIONS = ["snake_case", "camelCase", "PascalCase", "Title Case", "kebab-case", "lower case"] as const;
type Convention = (typeof CONVENTIONS)[number];

export interface PropertySpec {
  type?: PropType | PropType[];
  required?: boolean;
  /** Declared personal data: PII checks skip it. */
  pii?: boolean;
  enum?: Array<string | number | boolean>;
}
export interface EventSpec {
  properties?: Record<string, PropertySpec>;
  /** false: properties not declared here or in commonProperties are findings. Default true. */
  additionalProperties?: boolean;
}
export interface TrackingSchema {
  naming?: Convention | { events?: Convention; properties?: Convention };
  /** Properties every event may carry (user_id, plan...). */
  commonProperties?: Record<string, PropertySpec>;
  events: Record<string, EventSpec>;
}
export interface CapturedEvent {
  event?: string;
  name?: string;
  event_name?: string;
  properties?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

export type TrackingRule =
  | "unknown-event"
  | "missing-required"
  | "wrong-type"
  | "not-in-enum"
  | "unknown-property"
  | "event-naming"
  | "property-naming"
  | "pii-email"
  | "pii-phone"
  | "pii-ip"
  | "pii-card"
  | "pii-name"
  | "missing-name";

export interface TrackingFinding {
  /** Position in the events array. */
  index: number;
  event: string | null;
  property: string | null;
  rule: TrackingRule;
  severity: "error" | "warning";
  message: string;
}

const NAMING_RE: Record<Convention, RegExp> = {
  snake_case: /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/,
  camelCase: /^[a-z][a-z0-9]*([A-Z][a-z0-9]*)*$/,
  PascalCase: /^[A-Z][a-z0-9]*([A-Z][a-z0-9]*)*$/,
  "Title Case": /^[A-Z][a-z0-9]*( [A-Z][a-z0-9]*)*$/,
  "kebab-case": /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/,
  "lower case": /^[a-z][a-z0-9]*( [a-z0-9]+)*$/,
};

// Where each finding is explained. Pointers are learn_more pointers to the playbooks.
export const LEARN_MORE: Record<string, string> = {
  plan: "playbook:activation-and-analytics#A minimal tracking plan",
  naming: "playbook:activation-and-analytics#Event naming",
  pii: "playbook:activation-and-analytics#Consent and server-side tracking (not legal advice)",
  piiLaw: "playbook:privacy-and-marketing-law#Pixels and health or other sensitive data",
};
const RULE_LEARN: Record<TrackingRule, string[]> = {
  "unknown-event": [LEARN_MORE.plan],
  "missing-required": [LEARN_MORE.plan],
  "wrong-type": [LEARN_MORE.plan],
  "not-in-enum": [LEARN_MORE.plan],
  "unknown-property": [LEARN_MORE.plan],
  "missing-name": [LEARN_MORE.plan],
  "event-naming": [LEARN_MORE.naming],
  "property-naming": [LEARN_MORE.naming],
  "pii-email": [LEARN_MORE.pii, LEARN_MORE.piiLaw],
  "pii-phone": [LEARN_MORE.pii, LEARN_MORE.piiLaw],
  "pii-ip": [LEARN_MORE.pii, LEARN_MORE.piiLaw],
  "pii-card": [LEARN_MORE.pii, LEARN_MORE.piiLaw],
  "pii-name": [LEARN_MORE.pii, LEARN_MORE.piiLaw],
};

function typeOf(v: unknown): PropType {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (typeof v === "number") return Number.isInteger(v) ? "integer" : "number";
  return typeof v as PropType;
}
const typeMatches = (v: unknown, want: PropType | PropType[]) => {
  const t = typeOf(v);
  return ([] as PropType[]).concat(want).some((w) => w === t || (w === "number" && t === "integer"));
};

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9-]+(\.[A-Z0-9-]+)*\.[A-Z]{2,}/i;
// A leading + with 8 to 15 digits (E.164), or a North American number written with separators. Bare digit runs are
// not read as phone numbers: IDs and timestamps look the same.
const PHONE = /(^|[^\w+])(\+\d[\d\s().-]{7,18}\d|\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b)/;
const CARD = /\b\d(?:[ -]?\d){12,18}\b/g;
// Matched on the key split at case changes: firstName, first_name and "First Name" all match; filename doesn't.
const PERSON_NAME_KEY = /(^|[_.\s-])(full|first|last|given|family|middle|sur)[_\s-]?name$/;
// Card numbers start with a known issuer prefix (Visa 4, Mastercard 51-55 and 2221-2720, Amex 34 and 37,
// Discover 6011 and 65), so millisecond timestamps and long IDs that happen to pass the Luhn check are not flagged.
const CARD_PREFIX = /^(4|5[1-5]|2[2-7]|3[47]|6011|65)/;

function luhn(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/** Which kinds of personal data a value looks like, by pattern. Names are matched by property key, not value. */
function piiIn(key: string, v: string): Array<{ rule: TrackingRule; what: string }> {
  const out: Array<{ rule: TrackingRule; what: string }> = [];
  if (EMAIL.test(v)) out.push({ rule: "pii-email", what: "an email address" });
  if (PHONE.test(v)) out.push({ rule: "pii-phone", what: "a phone number" });
  if (v.split(/[\s,;/?&=]+/).some((t) => isIP(t.replace(/^\[|\]$/g, "")) !== 0)) out.push({ rule: "pii-ip", what: "an IP address" });
  if ([...v.matchAll(CARD)].some((m) => {
    const d = m[0].replace(/\D/g, "");
    return CARD_PREFIX.test(d) && luhn(d);
  })) out.push({ rule: "pii-card", what: "a payment card number (passes the Luhn check)" });
  if (PERSON_NAME_KEY.test(key.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase()) && /\p{L}/u.test(v)) out.push({ rule: "pii-name", what: "a person's name (by the property name)" });
  return out;
}

const MAX_FINDINGS = 500;
const MAX_DEPTH = 8;

export function checkTrackingEvents(schema: TrackingSchema, events: CapturedEvent[]) {
  const findings: TrackingFinding[] = [];
  let total = 0;
  const byRule: Record<string, number> = {};
  const push = (f: TrackingFinding) => {
    total++;
    byRule[f.rule] = (byRule[f.rule] ?? 0) + 1;
    if (findings.length < MAX_FINDINGS) findings.push(f);
  };
  const naming = typeof schema.naming === "string" ? { events: schema.naming, properties: schema.naming } : (schema.naming ?? {});
  const common = schema.commonProperties ?? {};

  events.forEach((e, index) => {
    const name = e.event ?? e.name ?? e.event_name ?? null;
    const props = (e.properties ?? e.params ?? {}) as Record<string, unknown>;
    if (typeof name !== "string" || !name) {
      push({ index, event: null, property: null, rule: "missing-name", severity: "error", message: "The event has no name (event, name or event_name)." });
      return;
    }
    if (naming.events && !NAMING_RE[naming.events].test(name))
      push({ index, event: name, property: null, rule: "event-naming", severity: "warning", message: `Event name "${name}" breaks the declared ${naming.events} convention. Tools treat differently written names as separate events.` });
    const spec = schema.events[name];
    if (!spec) push({ index, event: name, property: null, rule: "unknown-event", severity: "error", message: `"${name}" is not in the tracking plan. Add it to the plan, or stop sending it.` });
    const declared: Record<string, PropertySpec> = { ...common, ...(spec?.properties ?? {}) };

    for (const [prop, ps] of Object.entries(declared)) {
      const v = props[prop];
      if (v === undefined) {
        if (ps.required && spec) push({ index, event: name, property: prop, rule: "missing-required", severity: "error", message: `Required property "${prop}" is missing.` });
        continue;
      }
      if (ps.type && !typeMatches(v, ps.type))
        push({ index, event: name, property: prop, rule: "wrong-type", severity: "error", message: `"${prop}" is ${typeOf(v)}; the plan says ${([] as string[]).concat(ps.type).join(" or ")}.` });
      else if (ps.enum && !ps.enum.includes(v as string))
        push({ index, event: name, property: prop, rule: "not-in-enum", severity: "error", message: `"${prop}" is ${JSON.stringify(v)}, not one of ${ps.enum.map((x) => JSON.stringify(x)).join(", ")}.` });
    }
    for (const prop of Object.keys(props)) {
      if (naming.properties && !NAMING_RE[naming.properties].test(prop))
        push({ index, event: name, property: prop, rule: "property-naming", severity: "warning", message: `Property "${prop}" breaks the declared ${naming.properties} convention.` });
      if (spec && spec.additionalProperties === false && !(prop in declared))
        push({ index, event: name, property: prop, rule: "unknown-property", severity: "warning", message: `"${prop}" is not declared for "${name}", which allows no other properties.` });
    }

    // Personal data, in every string value at any depth, unless the plan declares that property as PII.
    const walk = (v: unknown, path: string, key: string, depth: number): void => {
      if (depth > MAX_DEPTH) return;
      const top = path.split(/[.[]/)[0];
      if (declared[top]?.pii) return;
      if (typeof v === "string") {
        for (const p of piiIn(key, v))
          push({ index, event: name, property: path, rule: p.rule, severity: "error", message: `"${path}" holds what looks like ${p.what}, and the plan doesn't declare it as personal data.` });
      } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`, key, depth + 1));
      else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`, k, depth + 1);
    };
    for (const [k, v] of Object.entries(props)) walk(v, k, k, 0);
  });

  const rules = Object.keys(byRule) as TrackingRule[];
  return {
    eventsChecked: events.length,
    findingsTotal: total,
    byRule,
    findings,
    learnMore: [...new Set(rules.flatMap((r) => RULE_LEARN[r]))],
    notes: [
      ...(total > MAX_FINDINGS ? [`${total} findings; the first ${MAX_FINDINGS} are listed. byRule counts all of them.`] : []),
      ...(rules.some((r) => r.startsWith("pii-"))
        ? ["Google Analytics' policy forbids sending data Google could use to identify a person, URLs and page titles included (support.google.com/analytics/answer/6366371). Other tools' terms differ; privacy law applies either way."]
        : []),
      "Personal data is found by pattern: emails, phone numbers written with + or separators, IPv4 and IPv6 addresses, card numbers with a card-issuer prefix that pass the Luhn check, and names only in properties named like first_name or full_name. Names in other properties, postal addresses, hashed values and IDs that identify a person are not detected.",
    ],
  };
}

export interface SchemaChange {
  event: string;
  property: string | null;
  change: "event-removed" | "event-added" | "property-removed" | "property-added" | "type-changed" | "now-required" | "no-longer-required" | "enum-values-removed" | "enum-values-added" | "now-closed" | "naming-changed";
  breaking: boolean;
  message: string;
  /** For a removed event or property, a same-shaped addition that may be its new name. */
  possibleRename?: string;
}

const typesOf = (p: PropertySpec): string => (p.type ? ([] as string[]).concat(p.type).sort().join("|") : "any");

/** Changes from `before` to `after`. Breaking: dashboards, funnels or senders built on `before` stop working or start failing checks. */
export function diffTrackingSchema(before: TrackingSchema, after: TrackingSchema) {
  const changes: SchemaChange[] = [];
  const add = (c: SchemaChange) => changes.push(c);
  const bEvents = Object.keys(before.events);
  const aEvents = Object.keys(after.events);
  const removedEvents = bEvents.filter((e) => !(e in after.events));
  const addedEvents = aEvents.filter((e) => !(e in before.events));
  const shape = (s?: EventSpec) => JSON.stringify(Object.entries(s?.properties ?? {}).map(([k, p]) => [k, typesOf(p)]).sort());
  for (const e of removedEvents) {
    const twin = addedEvents.filter((a) => shape(after.events[a]) === shape(before.events[e]));
    add({ event: e, property: null, change: "event-removed", breaking: true, message: `Event "${e}" was removed. Charts, funnels and alerts that use it stop getting data.`, ...(twin.length === 1 ? { possibleRename: twin[0] } : {}) });
  }
  for (const e of addedEvents) add({ event: e, property: null, change: "event-added", breaking: false, message: `Event "${e}" was added.` });

  const diffProps = (event: string, b: Record<string, PropertySpec>, a: Record<string, PropertySpec>, closedBefore: boolean, closedAfter: boolean) => {
    const removed = Object.keys(b).filter((p) => !(p in a));
    const added = Object.keys(a).filter((p) => !(p in b));
    for (const p of removed) {
      const twin = added.filter((x) => typesOf(a[x]) === typesOf(b[p]));
      add({ event, property: p, change: "property-removed", breaking: true, message: `Property "${p}" was removed. Breakdowns and filters on it stop working.`, ...(twin.length === 1 ? { possibleRename: twin[0] } : {}) });
    }
    for (const p of added)
      add({ event, property: p, change: "property-added", breaking: !!a[p].required, message: a[p].required ? `Property "${p}" was added as required: events sent without it now fail the plan.` : `Property "${p}" was added (optional).` });
    for (const p of Object.keys(b).filter((x) => x in a)) {
      const [pb, pa] = [b[p], a[p]];
      if (typesOf(pb) !== typesOf(pa)) add({ event, property: p, change: "type-changed", breaking: true, message: `"${p}" changed type from ${typesOf(pb)} to ${typesOf(pa)}. Old and new values no longer compare or sum together.` });
      if (!pb.required && pa.required) add({ event, property: p, change: "now-required", breaking: true, message: `"${p}" is now required: events sent without it fail the plan.` });
      if (pb.required && !pa.required) add({ event, property: p, change: "no-longer-required", breaking: false, message: `"${p}" is no longer required. Reports that assume it is always set may show gaps.` });
      if (pb.enum || pa.enum) {
        const gone = (pb.enum ?? []).filter((v) => !(pa.enum ?? pb.enum ?? []).includes(v));
        const newVals = pb.enum ? (pa.enum ?? []).filter((v) => !pb.enum!.includes(v)) : [];
        if (gone.length) add({ event, property: p, change: "enum-values-removed", breaking: true, message: `"${p}" no longer allows ${gone.map((v) => JSON.stringify(v)).join(", ")}. Filters on those values go empty.` });
        if (newVals.length) add({ event, property: p, change: "enum-values-added", breaking: false, message: `"${p}" now also allows ${newVals.map((v) => JSON.stringify(v)).join(", ")}. Charts that list values by hand miss them.` });
      }
    }
    if (!closedBefore && closedAfter) add({ event, property: null, change: "now-closed", breaking: true, message: "The event now allows no undeclared properties: senders adding extra properties fail the plan." });
  };
  diffProps("*", before.commonProperties ?? {}, after.commonProperties ?? {}, false, false);
  for (const e of bEvents.filter((x) => x in after.events)) {
    const [b, a] = [before.events[e], after.events[e]];
    diffProps(e, b.properties ?? {}, a.properties ?? {}, b.additionalProperties === false, a.additionalProperties === false);
  }
  if (JSON.stringify(before.naming ?? null) !== JSON.stringify(after.naming ?? null))
    add({ event: "*", property: null, change: "naming-changed", breaking: true, message: `The naming convention changed from ${JSON.stringify(before.naming ?? "none")} to ${JSON.stringify(after.naming ?? "none")}. Events and properties renamed to the new convention no longer match charts built on the old names.` });

  return {
    breaking: changes.filter((c) => c.breaking).length,
    nonBreaking: changes.filter((c) => !c.breaking).length,
    changes,
    learnMore: changes.length ? [LEARN_MORE.plan, LEARN_MORE.naming] : [],
    notes: [
      "possibleRename pairs a removed name with the one added name of the same shape; it is a guess from the plan, not a check. Either way, charts built on the old name stop getting data.",
    ],
  };
}
