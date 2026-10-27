// check_tracking_events and diff_tracking_schema: captured events against a declared plan, and plan changes.
import { describe, it, expect } from "vitest";
import { checkTrackingEvents, diffTrackingSchema, type TrackingSchema } from "../src/lib/tracking.js";
import { learnMore } from "../src/lib/learnMore.js";

const plan: TrackingSchema = {
  naming: "snake_case",
  commonProperties: { user_id: { type: "string" }, email: { type: "string", pii: true } },
  events: {
    signup_completed: { properties: { plan: { type: "string", required: true, enum: ["free", "pro"] }, seats: { type: "integer" } } },
    report_exported: { properties: { format: { type: "string", required: true } }, additionalProperties: false },
  },
};
const rules = (r: ReturnType<typeof checkTrackingEvents>) => r.findings.map((f) => `${f.event}/${f.property}: ${f.rule}`);

describe("checkTrackingEvents", () => {
  it("passes events that match the plan, PII declared as PII included", () => {
    const r = checkTrackingEvents(plan, [
      { event: "signup_completed", properties: { plan: "pro", seats: 3, user_id: "u_1", email: "a@b.co" } },
      { name: "report_exported", params: { format: "pdf" } },
    ]);
    expect(r.findings).toEqual([]);
    expect(r.learnMore).toEqual([]);
  });
  it("names the event, property and rule for each break", () => {
    const r = checkTrackingEvents(plan, [
      { event: "Signup Completed", properties: {} },
      { event: "signup_completed", properties: { plan: "team", seats: 2.5 } },
      { event: "report_exported", properties: { format: 1, fileSize: 3 } },
      { properties: {} },
    ]);
    expect(rules(r)).toEqual([
      "Signup Completed/null: event-naming",
      "Signup Completed/null: unknown-event",
      "signup_completed/plan: not-in-enum",
      "signup_completed/seats: wrong-type",
      "report_exported/format: wrong-type",
      "report_exported/fileSize: property-naming",
      "report_exported/fileSize: unknown-property",
      "null/null: missing-name",
    ]);
    const missing = checkTrackingEvents(plan, [{ event: "signup_completed", properties: {} }]);
    expect(rules(missing)).toEqual(["signup_completed/plan: missing-required"]);
  });
  it("finds personal data in properties not declared as PII, at any depth", () => {
    const r = checkTrackingEvents(plan, [
      {
        event: "signup_completed",
        properties: {
          plan: "free",
          page_url: "https://x.test/welcome?email=jane%40x.test&e=jane@x.test",
          contact: { phone: "+1 514 555 0199", ip: "203.0.113.9" },
          card: "4111 1111 1111 1111",
          first_name: "Jane",
          created_ms: "1730000000000",
          order_ref: "4111111111111112",
        },
      },
    ]);
    expect(rules(r)).toEqual([
      "signup_completed/page_url: pii-email",
      "signup_completed/contact.phone: pii-phone",
      "signup_completed/contact.ip: pii-ip",
      "signup_completed/card: pii-card",
      "signup_completed/first_name: pii-name",
    ]);
    expect(r.notes.join(" ")).toMatch(/Google Analytics' policy forbids/);
    expect(r.learnMore).toContain("playbook:activation-and-analytics#Consent and server-side tracking (not legal advice)");
  });
  it("points only at playbook sections that exist", () => {
    const r = checkTrackingEvents(plan, [{ event: "Bad Name", properties: { first_name: "Jo" } }, { event: "signup_completed", properties: {} }]);
    for (const p of r.learnMore) expect(learnMore(p).kind).toBe("section");
  });
});

describe("diffTrackingSchema", () => {
  it("finds nothing between identical plans", () => {
    expect(diffTrackingSchema(plan, structuredClone(plan))).toMatchObject({ breaking: 0, nonBreaking: 0, changes: [] });
  });
  it("marks removals, renames, type changes and new requirements as breaking", () => {
    const after: TrackingSchema = {
      naming: "snake_case",
      commonProperties: plan.commonProperties,
      events: {
        account_created: { properties: { plan: { type: "string", required: true, enum: ["free", "pro"] }, seats: { type: "integer" } } },
        report_exported: { properties: { file_format: { type: "string", required: true }, rows: { type: "integer" } }, additionalProperties: false },
        teammate_invited: {},
      },
    };
    after.events.report_exported.properties!.file_format.required = false;
    const d = diffTrackingSchema(plan, after);
    expect(d.changes.map((c) => [c.event, c.property, c.change, c.breaking, c.possibleRename ?? null])).toEqual([
      ["signup_completed", null, "event-removed", true, "account_created"],
      ["account_created", null, "event-added", false, null],
      ["teammate_invited", null, "event-added", false, null],
      ["report_exported", "format", "property-removed", true, "file_format"],
      ["report_exported", "file_format", "property-added", false, null],
      ["report_exported", "rows", "property-added", false, null],
    ]);
    const d2 = diffTrackingSchema(plan, {
      ...plan,
      naming: "camelCase",
      events: { ...plan.events, signup_completed: { properties: { plan: { type: "string", required: true, enum: ["pro", "team"] }, seats: { type: "number", required: true } } } },
    });
    expect(d2.changes.map((c) => `${c.property}: ${c.change} ${c.breaking}`)).toEqual([
      "plan: enum-values-removed true",
      "plan: enum-values-added false",
      "seats: type-changed true",
      "seats: now-required true",
      "null: naming-changed true",
    ]);
  });
});
