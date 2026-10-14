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
  it("plugin and skill install the same server", () => {
    const plugin = JSON.parse(readFileSync(".claude-plugin/plugin.json", "utf8"));
    const args = plugin.mcpServers["marketing-expert"].args.join(" ");
    expect(getStartedSkill()).toContain(args);
  });
});
