import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { getStartedSkill, getStartedText, PROFILE_QUESTIONS } from "../src/prompts.js";
import { factsFromProfile, matchSmallBets } from "../src/lib/smallBets.js";
import type { BusinessProfile } from "../src/lib/profile.js";

describe("get_started", () => {
  it("the committed skill matches the prompt text (rebuild: npm run build && node scripts/build-skill.mjs)", () => {
    expect(readFileSync("skills/get-started/SKILL.md", "utf8")).toBe(getStartedSkill());
  });
  it("saves the profile before the strategy step that matches small bets against it", () => {
    const t = getStartedText();
    expect(t.indexOf("save_business_profile")).toBeGreaterThan(0);
    expect(t.indexOf("save_business_profile")).toBeLessThan(t.indexOf("match_small_bets on the saved profile"));
  });
  it("the first message offers directions that exist as tools or prompts", () => {
    const t = getStartedText();
    const step3 = t.slice(t.indexOf("\n3. "), t.indexOf("\n4. "));
    const src = readFileSync("src/server.ts", "utf8") + readFileSync("src/prompts.ts", "utf8");
    const registered = new Set([...src.matchAll(/register(?:Tool|Prompt)\(\s*"([a-z_]+)"/g)].map((m) => m[1]));
    const named = [...step3.matchAll(/\b[a-z]+(?:_[a-z]+)+\b/g)].map((m) => m[0]);
    expect(named.length).toBeGreaterThan(5);
    for (const n of named) expect(registered, n).toContain(n);
  });
  it("asks first for the facts that change which bets fit, and saves each to the fields the tools read", () => {
    const t = getStartedText();
    const step3 = t.slice(t.indexOf("\n3. "), t.indexOf("\n4. "));
    expect(step3.indexOf("last 28 days")).toBeLessThan(step3.indexOf("how each one found it"));
    expect(step3.indexOf("how each one found it")).toBeLessThan(step3.indexOf("charges now"));
    expect(step3).not.toMatch(/can be skipped/);
    const step4 = t.slice(t.indexOf("\n4. "), t.indexOf("\n5. "));
    for (const q of PROFILE_QUESTIONS) for (const f of [...q.reads, ...(q.alsoSave ?? [])]) expect(step4).toContain(f.split(".")[0]);
  });
  // Every first-run question costs the user effort, so each must change a tool's output, not only what the agent reads.
  // Assumption lines are left out of the comparison: they change whenever any field is set.
  it("every profile question saves to a field that changes match_small_bets", () => {
    const sample: Record<string, unknown> = {
      traction: { activeUsers: 150, payingCustomers: 3 },
      channels: [{ name: "Google search", how: "a user said so" }],
      revenue: "none",
      "assets.monthlyBudget": 500,
      "assets.communities": "two Discord servers",
      "assets.data": "prices scraped daily",
      principles: ["no cold email"],
      avoid: ["cold-outreach"],
      markets: ["Quebec"],
    };
    const base: BusinessProfile = { name: "x", audiences: ["developers"], surfaces: ["web-app"], launched: true, traction: { activeUsers: 10 } };
    const view = (p: BusinessProfile) => {
      const m = matchSmallBets(factsFromProfile(p));
      const ids = (vs: typeof m.fitsNow) => vs.map((v) => [v.id, v.score, v.reason, v.lawCheck]);
      return JSON.stringify([m.stage.stage, ids(m.fitsNow), ids(m.fitsLater), ids(m.doesntFit), m.checkAgainst, m.marketLaw]);
    };
    for (const q of PROFILE_QUESTIONS) {
      expect(q.reads.length, q.ask).toBeGreaterThan(0);
      for (const f of q.reads) {
        expect(sample, `no sample for ${f}`).toHaveProperty([f]);
        const [top, sub] = f.split(".");
        const p = { ...base, [top]: sub ? { [sub]: sample[f] } : sample[f] } as BusinessProfile;
        expect(view(p), `${f} changes nothing`).not.toBe(view(base));
      }
    }
  });
  it("plugin and skill install the same server", () => {
    const plugin = JSON.parse(readFileSync(".claude-plugin/plugin.json", "utf8"));
    const args = plugin.mcpServers["marketing-expert"].args.join(" ");
    expect(getStartedSkill()).toContain(args);
  });
});
