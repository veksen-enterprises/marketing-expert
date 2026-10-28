// match_small_bets on facts given in the call. In the 2026-10-28 real-case eval, 2 of 18 candidate answers used
// match_small_bets: it needed a saved profile, and advisors don't save one before the owner confirms the facts.
import { describe, it, expect, beforeAll } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

beforeAll(() => {
  process.env.MARKETING_EXPERT_DATA_DIR = mkdtempSync(join(tmpdir(), "me-inline-"));
});

async function call(args: Record<string, unknown>) {
  const { createServer } = await import("../src/server.js");
  const [a, b] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "t", version: "0" });
  await Promise.all([createServer().connect(a), client.connect(b)]);
  const r = await client.callTool({ name: "match_small_bets", arguments: args });
  const text = (r.content as Array<{ text: string }>)[0].text;
  return { isError: r.isError, text, json: r.isError ? null : JSON.parse(text) };
}

const nutritionist = { category: "nutritionist, solo practice", businessModel: "paid one-to-one sessions", traction: { payingCustomers: 3 }, launched: true, revenue: "live" };

describe("match_small_bets with inline facts", () => {
  it("matches facts given in the call, with no saved profile, and says they weren't saved", async () => {
    const r = await call({ facts: nutritionist });
    expect(r.isError).toBeFalsy();
    expect(r.json.fitsNow[0].id).toBe("say-what-you-sell");
    expect(r.json.factsFrom).toMatch(/given in this call, not a saved profile/);
  });
  it("gives the same verdicts as the same facts saved", async () => {
    const { saveProfile } = await import("../src/lib/profile.js");
    saveProfile("nutri", nutritionist);
    const saved = await call({ name: "nutri" });
    const inline = await call({ facts: nutritionist });
    expect(inline.json.fitsNow).toEqual(saved.json.fitsNow);
    expect(inline.json.doesntFit).toEqual(saved.json.doesntFit);
    expect(saved.json.factsFrom).toBeUndefined();
  });
  it("lays facts over a saved profile, field by field; null clears a field for this call only", async () => {
    const { saveProfile, getProfile } = await import("../src/lib/profile.js");
    saveProfile("app", { category: "budgeting app", surfaces: ["mobile-app"], traction: { activeUsers: 500 }, launched: true });
    const r = await call({ name: "app", facts: { traction: { activeUsers: 20 }, surfaces: null } });
    expect(r.json.stage.stage).toBe(1);
    expect(r.json.factsFrom).toMatch(/saved profile "app", with traction, surfaces from this call/);
    expect(getProfile("app")!.traction).toEqual({ activeUsers: 500 });
  });
  it("needs a name or facts", async () => {
    const r = await call({});
    expect(r.isError).toBe(true);
    expect(r.text).toMatch(/name.*or facts/);
  });
});
