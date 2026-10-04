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
