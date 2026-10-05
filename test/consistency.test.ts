// Keeps playbooks, prompts and tools in sync: every "see <slug>" points at a real playbook and every
// snake_case name that looks like a tool or prompt exists.
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";

const slugs = new Set(readdirSync("knowledge").filter((f) => f.endsWith(".md") && !f.startsWith("_")).map((f) => f.replace(/\.md$/, "")));
const server = readFileSync("src/server.ts", "utf8");
const prompts = readFileSync("src/prompts.ts", "utf8");
const tools = new Set([...server.matchAll(/registerTool\(\s*"([a-z_]+)"/g)].map((m) => m[1]));
const promptNames = new Set([...prompts.matchAll(/registerPrompt\(\s*"([a-z_]+)"/g)].map((m) => m[1]));
// snake_case words that are not tool references.
const ALLOWED = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "x_default", "ad_user_data", "ad_personalization", "ad_storage", "analytics_storage"]);

const docs = [...slugs].map((s) => ({ name: `knowledge/${s}.md`, text: readFileSync(`knowledge/${s}.md`, "utf8") }));
docs.push({ name: "src/prompts.ts", text: prompts });

describe("cross-references", () => {
  it("found the tools and prompts", () => {
    expect(tools.size).toBeGreaterThan(15);
    expect(promptNames.size).toBeGreaterThan(8);
  });
  it.each(docs)("$name: 'see <slug>' references exist", ({ text }) => {
    const refs = [...text.matchAll(/\bsee (?:the )?\*{0,2}([a-z]+(?:-[a-z0-9]+)+)\*{0,2}/g)].map((m) => m[1]);
    const missing = refs.filter((r) => !slugs.has(r));
    expect(missing).toEqual([]);
  });
  it.each(docs)("$name: tool and prompt names exist", ({ text }) => {
    const names = [...text.matchAll(/\b([a-z]+(?:_[a-z]+)+)\b/g)].map((m) => m[1]);
    const unknown = [...new Set(names)].filter((n) => !tools.has(n) && !promptNames.has(n) && !ALLOWED.has(n));
    expect(unknown).toEqual([]);
  });
});

describe("instructions and move format", () => {
  it("INSTRUCTIONS stays within its word budget", async () => {
    // A new rule replaces text, or goes into a tool's output or a check_answer check. Lower this when INSTRUCTIONS shrinks.
    const { INSTRUCTIONS } = await import("../src/server.js");
    expect(INSTRUCTIONS.split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(774);
  });
  it("no prompt or instruction states a different move count", async () => {
    const { INSTRUCTIONS } = await import("../src/server.js");
    const { MAX_MOVES } = await import("../src/prompts.js");
    const words: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5 };
    for (const text of [INSTRUCTIONS, prompts]) {
      const counts = [...text.matchAll(/\b(?:at most|up to|max(?:imum)?(?: of)?)\s+(\w+)\s+(?:moves|changes)\b|\b(one|two|three|four|five|\d)\s+moves\b/gi)].map((m) => m[1] ?? m[2]);
      // "at most ${MAX_MOVES} moves" doesn't match: only counts written out are checked.
      expect(counts.map((c) => words[c.toLowerCase()] ?? Number(c))).toEqual(counts.map(() => MAX_MOVES));
    }
  });
  it("tells the model to check a 90-day plan against the plan word limit", async () => {
    // Without deliverable "plan", check_answer applies the 1,200-word answer limit to a plan.
    const { INSTRUCTIONS } = await import("../src/server.js");
    expect(INSTRUCTIONS).toMatch(/deliverable "plan"/);
    expect(prompts).toMatch(/check_answer with deliverable "plan"/);
  });
});
