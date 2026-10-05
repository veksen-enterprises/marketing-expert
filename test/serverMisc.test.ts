// Regression tests for the server, profile, copy, UTM and playbook findings from the code review
// (server:correctness and server:robustness). Each test failed before its fix.
import { describe, it, expect, beforeEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync } from "node:fs";
import { tmpdir, homedir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";
import { analyzeCopy, checkLimits, splitSentences, words } from "../src/lib/copy.js";
import { countChars } from "../src/lib/platformLimits.js";
import { buildUtm } from "../src/lib/utm.js";
import { loadPlaybooks, searchKnowledge } from "../src/lib/knowledge.js";
import { dataDir, getProfile, listProfiles, saveProfile, staleMetrics } from "../src/lib/profile.js";

const connect = async () => {
  const [a, b] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "t", version: "0" });
  await Promise.all([createServer().connect(a), client.connect(b)]);
  const call = async (name: string, args: Record<string, unknown>) => {
    const r = await client.callTool({ name, arguments: args });
    const text = (r.content as Array<{ text: string }>)[0].text;
    return { isError: !!r.isError, text, json: r.isError ? null : JSON.parse(text) };
  };
  return { client, call };
};

let dir = "";
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "me-misc-"));
  process.env.MARKETING_EXPERT_DATA_DIR = dir;
});

describe("x_post counting follows X's weighting (server:correctness#0)", () => {
  it("counts CJK characters and emoji as 2", () => {
    expect(countChars("あ".repeat(200), "x-links-23")).toBe(400);
    expect(countChars("👍", "x-links-23")).toBe(2);
    expect(countChars("👨‍👩‍👧", "x-links-23")).toBe(2);
    // U+2019 is in a weight-1 range; the ellipsis U+2026 is not.
    expect(countChars("café ’…", "x-links-23")).toBe(8);
    expect(checkLimits("x_post", { text: "あ".repeat(200) }).checks[0].status).toBe("over_max");
  });
  it("counts bare domains as 23 and leaves trailing punctuation out of the URL", () => {
    expect(countChars("see acme.io", "x-links-23")).toBe(4 + 23);
    expect(countChars("see https://acme.io/x.", "x-links-23")).toBe(4 + 23 + 1);
    expect(countChars("node.js and readme files", "x-links-23")).toBe(24);
    expect(countChars("mail jp@acme.io", "x-links-23")).toBe(15);
    expect(checkLimits("x_post", { text: "a".repeat(265) + " acme.io" }).checks[0].status).toBe("over_max");
  });
});

describe("analyze_copy on line-separated copy (server:correctness#1)", () => {
  const t = "Invoicing for agencies\nSend invoices in two clicks\nGet paid in 3 days\nNo spreadsheets\nWorks with Stripe and QuickBooks\nSet up in 5 minutes\nCancel any time\nFree for your first 10 clients";
  it("treats each line as its own sentence", () => {
    expect(splitSentences(t)).toHaveLength(8);
    const r = analyzeCopy(t);
    expect(r.readability.longestSentenceWords).toBeLessThanOrEqual(6);
    expect(r.flags.filter((f) => f.type === "length")).toEqual([]);
  });
});

describe("playbook frontmatter with CRLF or a BOM (server:correctness#2)", () => {
  it("parses title, summary and tags", () => {
    const kb = mkdtempSync(join(tmpdir(), "me-kb-"));
    writeFileSync(join(kb, "pricing.md"), "﻿---\r\ntitle: Pricing\r\nsummary: Value metrics.\r\ntags: pricing, freemium\r\n---\r\n\r\n## Value metric\r\nCharge per seat.\r\n");
    const b = loadPlaybooks(kb)[0];
    expect(b.title).toBe("Pricing");
    expect(b.summary).toBe("Value metrics.");
    expect(b.tags).toEqual(["pricing", "freemium"]);
    expect(b.body.trimStart().startsWith("## Value metric")).toBe(true);
    expect(b.body).not.toContain("\r");
  });
});

describe("staleMetrics (server:correctness#3, server:robustness#8, server:robustness#7)", () => {
  it("reports a date it can't read instead of treating the metric as current", () => {
    const now = new Date("2026-10-05");
    for (const asOf of ["Q3 2024", "09/2024", "H1 2024", "2024-Q3"]) {
      expect(staleMetrics({ name: "x", metrics: { mrr: { value: 1, asOf } } }, 6, now)).toEqual([`mrr (unknown age: can't read the date "${asOf}")`]);
    }
    expect(staleMetrics({ name: "x", metrics: { mrr: { value: 1, asOf: "2026-09" } } }, 6, now)).toEqual([]);
  });
  it("does not throw on a hand-edited null metric or a non-string date", () => {
    const p = { name: "x", metrics: { mrr: null, arr: { value: 1, asOf: 2024 } } } as never;
    expect(staleMetrics(p, 6, new Date("2026-10-05"))).toEqual(["arr (no date)"]);
  });
});

describe("tool output keeps stored and money values exact (server:correctness#4, server:robustness#4)", () => {
  it("get and save return the profile values as stored", async () => {
    const { call } = await connect();
    const s = await call("save_business_profile", { name: "acme", metrics: { arr: { value: 1234567.89, asOf: "2026-09" }, mrr: { value: 102880.66, asOf: "2026-09" } } });
    expect(s.json.saved.metrics.arr.value).toBe(1234567.89);
    const g = await call("get_business_profile", { name: "acme" });
    expect(g.json.profile.metrics.arr.value).toBe(1234567.89);
    expect(g.json.profile.metrics.mrr.value).toBe(102880.66);
  });
  it("large computed money figures are not cut to 5 significant digits", async () => {
    const { call } = await connect();
    const r = await call("market_size", { segments: [{ name: "smb", accounts: 123457, annualValue: 99.5 }] });
    expect(r.isError).toBe(false);
    expect(r.text).toContain("12283971.5");
    expect(r.text).not.toMatch(/\b12284000\b/);
  });
});

describe("profile listing uses file names (server:correctness#6, server:robustness#2)", () => {
  it("lists a copied file under its file name, and it can be loaded by that name", () => {
    mkdirSync(join(dir, "profiles"), { recursive: true });
    writeFileSync(join(dir, "profiles", "acme-copy.json"), JSON.stringify({ name: "acme", product: "x" }));
    writeFileSync(join(dir, "profiles", "stub.json"), "{}");
    writeFileSync(join(dir, "profiles", "Gamma.json"), JSON.stringify({ name: "Gamma", product: 5 }));
    const names = listProfiles().map((p) => p.name);
    expect(names.sort()).toEqual(["acme-copy", "stub"]);
    for (const n of names) expect(getProfile(n)).not.toBeNull();
    expect(listProfiles().find((p) => p.name === "stub")!.product).toBeUndefined();
  });
  it("a profile file without a name does not break resources/list", async () => {
    const { client } = await connect();
    const before = (await client.listResources()).resources.length;
    mkdirSync(join(dir, "profiles"), { recursive: true });
    writeFileSync(join(dir, "profiles", "stub.json"), "{}");
    writeFileSync(join(dir, "profiles", "arr.json"), "[]");
    const after = await client.listResources();
    expect(after.resources.length).toBe(before + 2);
    expect(after.resources.map((r) => r.uri)).toContain("marketing://profile/stub");
  });
});

describe("build_utm_link (server:correctness#7, server:robustness#3, server:robustness#10)", () => {
  const base = { source: "newsletter", medium: "email", campaign: "fall" };
  it("refuses URLs that are not http(s), with a hint", () => {
    for (const url of ["javascript:alert(document.cookie)//", "data:text/html,<script>alert(1)</script>", "file:///etc/passwd", "localhost:3000/pricing", "www.acme.io:8080/x"]) {
      expect(() => buildUtm({ url, ...base }), url).toThrow(/https:\/\//);
    }
    expect(() => buildUtm({ url: "acme.io/pricing", ...base })).toThrow(/https:\/\//);
  });
  it("refuses required values that are empty after trimming", () => {
    expect(() => buildUtm({ url: "https://x.com", source: "   ", medium: "email", campaign: "q4" })).toThrow(/source/);
    expect(() => buildUtm({ url: "https://x.com", source: "nl", medium: "email", campaign: " " })).toThrow(/campaign/);
  });
  it("medium warnings follow GA4's default channel rules", () => {
    const warn = (medium: string) => buildUtm({ url: "https://x.com", source: "flyer", medium, campaign: "q4" }).warnings.join(" ");
    expect(warn("qr")).toMatch(/Unassigned/);
    expect(warn("print")).toMatch(/Unassigned/);
    for (const m of ["e-mail", "social-media", "sm", "app", "retargeting", "paid-search", "cpv", "youtube-video", "mobile-push"]) expect(warn(m), m).not.toMatch(/Unassigned/);
  });
});

describe("check_copy_limits (server:correctness#8, server:robustness#6)", () => {
  it("a field with no known limit is not reported as ok", () => {
    expect(checkLimits("meta_feed", { description: "x".repeat(5000) }).checks[0].status).toBe("no_known_limit");
  });
  it("inherited property names are unknown fields and platforms", () => {
    expect(() => checkLimits("google_rsa", { constructor: "x".repeat(500) })).toThrow(/unknown field/);
    expect(() => checkLimits("google_rsa", { toString: "x" })).toThrow(/unknown field/);
    expect(() => checkLimits("hasOwnProperty", { headline: "x" })).toThrow(/unknown platform/);
  });
  it("empty fields (including a lone __proto__ key) is an error, not an empty pass", async () => {
    expect(() => checkLimits("google_rsa", {})).toThrow(/no fields/);
    const { client } = await connect();
    const r = await client.callTool({ name: "check_copy_limits", arguments: JSON.parse('{"platform":"google_rsa","fields":{"__proto__":["x"]}}') });
    expect(r.isError).toBe(true);
  });
});

describe("analyze_copy pronouns and hedges (server:correctness#9)", () => {
  it("counts you'll / you've as reader-focused", () => {
    const r = analyzeCopy("We built this for agencies. We know invoicing hurts. Our team fixed it. You’ll get paid faster. You’ve got better things to do. You'll save hours.");
    expect(r.youCount).toBe(3);
    expect(r.flags.filter((f) => f.type === "framing")).toEqual([]);
  });
  it("matches hedges as whole words", () => {
    const r = analyzeCopy("Our mighty engine. The vendor claims to cut costs.");
    expect(r.flags.filter((f) => f.type === "hedge")).toEqual([]);
    expect(analyzeCopy("It might work.").flags.some((f) => f.type === "hedge")).toBe(true);
  });
});

describe("words() and readability outside ASCII (server:correctness#10)", () => {
  it("keeps accented words whole", () => {
    expect(words("Pokémon café résumé")).toEqual(["Pokémon", "café", "résumé"]);
  });
  it("gives no Flesch score for mostly non-Latin text", () => {
    const r = analyzeCopy("請求書を2回のクリックで送信。3日で入金。").readability;
    expect(r.fleschReadingEase).toBeNull();
    expect(r.fleschKincaidGrade).toBeNull();
    expect(r.note).toMatch(/English/);
  });
});

describe("search_playbooks with a very long query (server:robustness#0)", () => {
  it("is refused by the schema", async () => {
    const { call } = await connect();
    expect((await call("search_playbooks", { query: "pricing ".repeat(100) })).isError).toBe(true);
    expect((await call("search_playbooks", { query: "pricing" })).isError).toBe(false);
  });
  it("searchKnowledge caps the query tokens", () => {
    const q = Array.from({ length: 20000 }, (_, i) => "w" + i.toString(36)).join(" ");
    const t = Date.now();
    searchKnowledge(q);
    expect(Date.now() - t).toBeLessThan(2000);
  });
});

describe("MARKETING_EXPERT_DATA_DIR (server:robustness#5)", () => {
  it("an empty value falls back to the home directory", () => {
    process.env.MARKETING_EXPERT_DATA_DIR = "  ";
    expect(dataDir()).toBe(join(homedir(), ".marketing-expert"));
  });
  it("a relative value is refused", () => {
    process.env.MARKETING_EXPERT_DATA_DIR = "rel/data";
    expect(() => dataDir()).toThrow(/absolute/);
  });
});

describe("profile writes (server:robustness#7)", () => {
  it("a truncated profile file can be overwritten with the tool, and the old file is kept", async () => {
    mkdirSync(join(dir, "profiles"), { recursive: true });
    writeFileSync(join(dir, "profiles", "acme.json"), '{"name":"acme","product":"Invoic');
    const { call } = await connect();
    const r = await call("save_business_profile", { name: "acme", product: "Invoicing" });
    expect(r.isError).toBe(false);
    expect(r.json.warnings.join(" ")).toMatch(/acme\.json\.bak/);
    expect(getProfile("acme")!.product).toBe("Invoicing");
    expect(readFileSync(join(dir, "profiles", "acme.json.bak"), "utf8")).toContain("Invoic");
  });
  it("writes through a temporary file, leaving no temporary file behind", () => {
    saveProfile("beta", { product: "x" });
    expect(readdirSync(join(dir, "profiles"))).toEqual(["beta.json"]);
    expect(existsSync(join(dir, "profiles", "beta.json"))).toBe(true);
  });
});

describe("save_business_profile accepts null where the description says it deletes (server:robustness#9)", () => {
  it("deletes voice, voice lists and metrics", async () => {
    const { call } = await connect();
    await call("save_business_profile", { name: "acme", voice: { do: ["plain"], dont: ["hype"] }, metrics: { mrr: { value: 1, asOf: "2026-09" } } });
    expect((await call("save_business_profile", { name: "acme", voice: { do: null } })).isError).toBe(false);
    expect(getProfile("acme")!.voice).toEqual({ dont: ["hype"] });
    expect((await call("save_business_profile", { name: "acme", voice: null, metrics: null })).isError).toBe(false);
    const p = getProfile("acme")!;
    expect(p.voice).toBeUndefined();
    expect(p.metrics).toBeUndefined();
  });
});

describe("search_playbooks names every business type (backlog rank 14)", () => {
  it("every business-type slug in marketing_strategy step 2 is in the search_playbooks description", async () => {
    const prompts = readFileSync("src/prompts.ts", "utf8");
    const step2 = /2\. Business type:[^\n]*/.exec(prompts)![0];
    const slugs = [...step2.matchAll(/\b([a-z0-9]+(?:-[a-z0-9]+)+)\b/g)].map((m) => m[1]);
    expect(slugs.length).toBeGreaterThan(8);
    const { client } = await connect();
    const desc = (await client.listTools()).tools.find((t) => t.name === "search_playbooks")!.description!.toLowerCase();
    const title = (slug: string) => loadPlaybooks().find((p) => p.slug === slug)!.title.toLowerCase();
    // A slug counts as named when its playbook's title (or the slug written as words) is in the description.
    const named = (slug: string) => desc.includes(slug.replace(/-/g, " ")) || desc.includes(title(slug)) || BUSINESS_TYPE_NAMES[slug]?.some((n) => desc.includes(n));
    expect(slugs.filter((s) => !named(s))).toEqual([]);
  });
});

// How the search_playbooks description words each business type.
const BUSINESS_TYPE_NAMES: Record<string, string[]> = {
  "b2b-saas-sales-led": ["sales-led b2b saas"],
  "self-serve-saas": ["self-serve saas"],
  "developer-tools": ["developer tools"],
  "ecommerce-dtc": ["e-commerce/dtc"],
  "community-and-hobby-products": ["community and hobby products"],
  "retail-cpg": ["retail/cpg"],
};

describe("INSTRUCTIONS step 1 names activation and proof", () => {
  it("lists it as the usual constraint below ~10 paying customers", async () => {
    const { INSTRUCTIONS } = await import("../src/server.js");
    const step1 = /^1\. .*$/m.exec(INSTRUCTIONS)![0];
    expect(step1).toMatch(/activation and proof/);
    expect(step1).toMatch(/~10 paying customers/);
  });
});

describe("package.json builds on install from git", () => {
  it("has a prepare script that runs tsc", () => {
    expect(JSON.parse(readFileSync("package.json", "utf8")).scripts.prepare).toBe("tsc");
  });
});
