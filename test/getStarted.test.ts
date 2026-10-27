import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { getStartedSkill, getStartedText } from "../src/prompts.js";

describe("get_started", () => {
  it("the committed skill matches the prompt text (rebuild: npm run build && node scripts/build-skill.mjs)", () => {
    expect(readFileSync("skills/get-started/SKILL.md", "utf8")).toBe(getStartedSkill());
  });
  it("saves the profile before the strategy step that matches small bets against it", () => {
    const t = getStartedText();
    expect(t.indexOf("save_business_profile")).toBeGreaterThan(0);
    expect(t.indexOf("save_business_profile")).toBeLessThan(t.indexOf("match_small_bets on the saved profile"));
  });
  it("the first message offers directions that exist as tools or prompts, with at most three questions", () => {
    const t = getStartedText();
    const step3 = t.slice(t.indexOf("\n3. "), t.indexOf("\n4. "));
    const src = readFileSync("src/server.ts", "utf8") + readFileSync("src/prompts.ts", "utf8");
    const registered = new Set([...src.matchAll(/register(?:Tool|Prompt)\(\s*"([a-z_]+)"/g)].map((m) => m[1]));
    const named = [...step3.matchAll(/\b[a-z]+(?:_[a-z]+)+\b/g)].map((m) => m[0]);
    expect(named.length).toBeGreaterThan(5);
    for (const n of named) expect(registered, n).toContain(n);
    expect(step3).toMatch(/At most three questions/);
  });
  it("plugin and skill install the same server", () => {
    const plugin = JSON.parse(readFileSync(".claude-plugin/plugin.json", "utf8"));
    const args = plugin.mcpServers["marketing-expert"].args.join(" ");
    expect(getStartedSkill()).toContain(args);
  });
});
