// Regression tests for verify_quotes: quotes it dropped or misbound without saying so, files it said were missing
// when they were only left out of the index, and citations it read wrongly.
import { describe, it, expect, afterAll } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkQuotes } from "../src/lib/quoteCheck.js";
import { createServer } from "../src/server.js";

const dirs: string[] = [];
afterAll(() => {
  for (const d of dirs) rmSync(d, { recursive: true, force: true });
});
function repo(files: Record<string, string>) {
  const d = mkdtempSync(join(tmpdir(), "vq-"));
  dirs.push(d);
  for (const [p, text] of Object.entries(files)) {
    mkdirSync(join(d, p, ".."), { recursive: true });
    writeFileSync(join(d, p), text);
  }
  return d;
}
const brief = (text: string, d: string, tools?: string[]) => checkQuotes(text, [d], 2, tools).results.map((r) => [r.status, r.cited]);

const pricing = ["<h3>Pro</h3>", '<span data-tip="Read-only connection. Parameter values are not included.">i</span>'].join("\n") + "\n";

describe("sentence splitting and binding", () => {
  const d = repo({ "pricing.astro": pricing });
  it("keeps a citation after a closing '.\"' with its quote", () => {
    expect(brief('The tooltip says "Parameter values are not included." (pricing.astro:9)', d)).toEqual([["wrong-line", "pricing.astro:9"]]);
    expect(brief('The tooltip says "Parameter values are not included." (pricing.astro:2)', d)).toEqual([["verified", "pricing.astro:2"]]);
  });
  it("checks a quote of two sentences", () => {
    expect(brief('It says "Read-only connection. We store nothing at all." (pricing.astro:2).', d)).toEqual([["not-found", "pricing.astro:2"]]);
    expect(brief('It says "Read-only connection. Parameter values are not included." (pricing.astro:2).', d)).toEqual([["verified", "pricing.astro:2"]]);
  });
  it("reports a quote with no closing mark instead of dropping it", () => {
    const r = checkQuotes('It says "Read-only connection and nothing else.', [d]);
    expect(r.skipped.map((s) => s.reason).join(" ")).toMatch(/closing quotation mark/);
  });
});

describe("files left out of the index", () => {
  const big = "x\n".repeat(300 * 1024) + "The last line of a long changelog.\n";
  const d = repo({
    ".github/workflows/deploy.yml": "on:\n  push:\n    branches: [main]\n",
    ".claude/notes.md": "We never send query text to a server.\n",
    ".git/description": "Words that live only in the git folder.\n",
    "CHANGELOG.md": big,
    "src/a.test.ts": 'it("rejects the token when it has expired", () => {});\n',
  });
  it("indexes dot-folders other than .git", () => {
    expect(brief('The workflow says "branches: [main]" (.github/workflows/deploy.yml:3).', d)).toEqual([["verified", ".github/workflows/deploy.yml:3"]]);
    expect(brief('The notes say "We never send query text to a server" (.claude/notes.md:1).', d)).toEqual([["verified", ".claude/notes.md:1"]]);
    expect(brief('It says "Words that live only in the git folder".', d)).toEqual([["uncited-not-found", null]]);
  });
  it("reads a cited file that exists but was not indexed (too large, a test file)", () => {
    expect(brief('It says "The last line of a long changelog" (CHANGELOG.md:307201).', d)).toEqual([["verified", "CHANGELOG.md:307201"]]);
    expect(brief('The test says "rejects the token when it has expired" (src/a.test.ts:1).', d)).toEqual([["verified", "src/a.test.ts:1"]]);
  });
});

describe("citations", () => {
  const d = repo({
    "package.json": '{\n  "name": "demo",\n  "description": "Checks your queries before they ship"\n}\n',
    "apps/app/src/pages/index.astro": "<h1>Dashboard</h1>\n<p>Your saved queries live here.</p>\n",
    "apps/marketing/src/pages/index.astro": "<h1>Welcome</h1>\n<p>Ship faster queries today.</p>\n",
    "docs/decisions/0006-supply.md": "# Supply\n\nIntro.\n\nThe table held 141 items on the day.\n",
    "adr/007-pricing.md": "# Pricing\n\nWe charge per seat for every team.\n",
  });
  it("reads a .json citation as .json", () => {
    expect(brief('The manifest says "Checks your queries before they ship" (package.json:3).', d)).toEqual([["verified", "package.json:3"]]);
  });
  it("doesn't verify a quote through a different file that only shares the name", () => {
    expect(brief('The homepage says "Your saved queries live here" (apps/marketing/pages/index.astro:2).', d).map((r) => r[0])).toEqual(["other-file"]);
  });
  it("checks a quote against the citation right after it, not another one in the sentence", () => {
    const r = checkQuotes('The site says "Your saved queries live here" (apps/marketing/src/pages/index.astro:2), unlike the app (apps/app/src/pages/index.astro:1).', [d]);
    expect(r.results.map((x) => [x.status, x.cited])).toEqual([["other-file", "apps/marketing/src/pages/index.astro:2"]]);
  });
  it("resolves ADRs under decisions/, with 3-digit ids, and 'record NNNN'", () => {
    expect(brief('ADR 0006 line 5 says "held 141 items on the day".', d)).toEqual([["verified", "ADR 0006:5"]]);
    expect(brief('ADR 007 line 3 says "We charge per seat for every team".', d)).toEqual([["verified", "ADR 007:3"]]);
    expect(brief('Decision record 0006, line 5, says "held 141 items on the day".', d)).toEqual([["verified", "ADR 0006:5"]]);
  });
});

describe("quote text", () => {
  const d = repo({
    "privacy.md": "We store query logs for 30 days, then delete them.\n",
    "faq.html": "<p>We don&rsquo;t store your queries &amp; results.</p>\n",
    "docs.md": "See the [pricing page](/pricing) for seat limits.\n",
    "Hero.tsx": "<p>\n  Your credentials never leave{\" \"}\n  <b>your</b> network.\n</p>\n",
    "setup.md": "Run `npx demo init` before the first scan.\n",
  });
  it("checks every fragment around an ellipsis, however short", () => {
    expect(brief('It says "We store query logs … forever" (privacy.md:1).', d)).toEqual([["not-found", "privacy.md:1"]]);
    expect(brief('It says "We store … delete them" (privacy.md:1).', d)).toEqual([["verified", "privacy.md:1"]]);
  });
  it("decodes HTML entities, markdown links and JSX spaces", () => {
    expect(brief('The FAQ says "We don’t store your queries & results" (faq.html:1).', d)).toEqual([["verified", "faq.html:1"]]);
    expect(brief('The docs say "See the pricing page for seat limits" (docs.md:1).', d)).toEqual([["verified", "docs.md:1"]]);
    expect(brief('The hero says "Your credentials never leave your network" (Hero.tsx:2).', d)).toEqual([["verified", "Hero.tsx:2"]]);
  });
  it("checks a quote with backticks", () => {
    expect(brief('Setup says "Run `npx demo init` before the first scan" (setup.md:1).', d)).toEqual([["verified", "setup.md:1"]]);
  });
  it("checks a 1-2 word quote with a file:line citation right after it, and lists the others as skipped", () => {
    expect(brief('The plan is called "query logs" (privacy.md:1).', d)).toEqual([["verified", "privacy.md:1"]]);
    expect(brief('The plan is called "Team" (privacy.md:1).', d)).toEqual([["not-found", "privacy.md:1"]]);
    const r = checkQuotes('We call it "free" in the copy.', [d]);
    expect(r.results).toEqual([]);
    expect(r.skipped).toEqual([{ quote: "free", reason: expect.stringMatching(/words/) }]);
  });
  it("skips quotes of tool output with a reason", () => {
    const r = checkQuotes('unit_economics says "payback is 14 months at this price".', [d], 2, ["unit_economics"]);
    expect(r.results).toEqual([]);
    expect(r.skipped[0].reason).toMatch(/unit_economics/);
    expect(checkQuotes('The calculator says "payback is 14 months at this price" (tool: unit_economics).', [d]).skipped[0].reason).toMatch(/unit_economics/);
  });
  it("verifies playbook citations against the playbook text", () => {
    expect(brief('The guide says "The developer adopts; someone else pays" (developer-tools playbook).', d)).toEqual([["verified", "playbook:developer-tools"]]);
    expect(brief('See playbook:developer-tools: "The buyer always adopts first".', d)).toEqual([["not-found", "playbook:developer-tools"]]);
  });
});

describe("repeated quotes", () => {
  const d = repo({
    "report.md": "## Rare table\n\nTotal: 141 items\n\n## Main table\n\nTotal: 141 items\n",
    "tips.html": Array.from({ length: 7 }, (_, i) => `<h2>Tip ${i + 1}</h2>\n<span title="Results stay on your machine"></span>\n`).join(""),
  });
  it("takes the context from the occurrence cited", () => {
    const r = checkQuotes('The main table says "Total: 141 items" (report.md:7).', [d]);
    expect(r.results[0].status).toBe("verified");
    expect(r.results[0].foundAt[0]).toBe("report.md:7");
    expect(r.results[0].context).toMatch(/Main table/);
    expect(r.results[0].context).not.toMatch(/Rare table/);
  });
  it("finds the 7th occurrence", () => {
    expect(brief('The last tip says "Results stay on your machine" (tips.html:14).', d)).toEqual([["verified", "tips.html:14"]]);
  });
});

describe("a directory below the repo root", () => {
  it("matches a citation that includes the folders above the directory passed", () => {
    const d = repo({ "apps/web/src/a.astro": "<p>Ship faster queries today.</p>\n" });
    expect(brief('It says "Ship faster queries today" (apps/web/src/a.astro:1).', join(d, "apps", "web"))).toEqual([["verified", "apps/web/src/a.astro:1"]]);
    expect(brief('It says "Ship faster queries today" (apps/other/src/a.astro:1).', join(d, "apps", "web")).map((r) => r[0])).toEqual(["other-file"]);
  });
});

describe("a cited file too large to read", () => {
  it("says the quote was not checked instead of calling the file missing", () => {
    const d = repo({ "dump.sql": "-- seed\n" + "insert into t values (1);\n".repeat(260000) });
    const r = checkQuotes('The seed says "insert into t values" (dump.sql:2).', [d]);
    expect(r.results.map((x) => x.status)).toEqual(["cited-file-not-read"]);
    expect(r.problems[0]).toMatch(/too large to read/);
  });
});

describe("verify_quotes in the server", () => {
  it("passes the registered tool names, so a quote of tool output is skipped with a reason", async () => {
    // Reads the SDK's tool list; this fails if that private field is renamed.
    const tools = (createServer() as unknown as { _registeredTools: Record<string, { handler: (a: unknown, x: unknown) => Promise<{ content: Array<{ text: string }> }> }> })._registeredTools;
    const d = repo({ "a.md": "Nothing here.\n" });
    const r = await tools.verify_quotes.handler({ text: 'unit_economics says "payback is 14 months at this price".', dirs: [d] }, {});
    expect(JSON.parse(r.content[0].text).skipped[0].reason).toMatch(/output of unit_economics/);
  });
});
