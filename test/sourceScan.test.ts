import { describe, it, expect } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { scanSource } from "../src/lib/sourceScan.js";

function fixture() {
  const d = mkdtempSync(join(tmpdir(), "scan-"));
  mkdirSync(join(d, "pages"));
  mkdirSync(join(d, "node_modules"));
  mkdirSync(join(d, "routes"));
  writeFileSync(
    join(d, "pages", "pricing.astro"),
    [
      "---",
      'const plan = "Pro";',
      "---",
      "<h3>Pro · cancel anytime</h3>",
      '<span class="dt-price">$16</span>',
      '<span class="dt-info" data-tip="Read-only connection. Parameter values aren\'t included.">i</span>',
      "<style>",
      ".price { color: red; }",
      "</style>",
      "<pre>select * from t where id = $1</pre>",
      "<p>MCP server coming soon for every plan.</p>",
    ].join("\n")
  );
  writeFileSync(join(d, "pages", "index.astro"), '<h3>Pro plan</h3>\n<span class="amount">$20</span>\n<p>Run docker run dt/analyzer in 60 seconds.</p>');
  writeFileSync(join(d, "routes", "index.tsx"), 'export const r = { to: import.meta.env.VITE_CALC_ONLY ? "/ias" : "/search" };\nconst m = import.meta.env.MODE;');
  writeFileSync(join(d, "node_modules", "x.js"), 'const s = "we never store your data at all";');
  return d;
}

describe("scanSource decisions", () => {
  it("reads ADR statuses from frontmatter, a Status section and the index table", () => {
    const d = mkdtempSync(join(tmpdir(), "adr-"));
    mkdirSync(join(d, "adr"));
    writeFileSync(join(d, "adr", "0001-a.md"), "---\nstatus: proposed\n---\n\n# Use A\n");
    writeFileSync(join(d, "adr", "0002-b.md"), "# 2. Use B\n\nDate: 2026-01-01\n\n## Status\n\nAccepted, not fully built.\n\n## Context\n");
    writeFileSync(join(d, "adr", "README.md"), "| # | Decision | Date | Status |\n| --- | --- | --- | --- |\n| [0002](0002-b.md) | Use B | 2026-01-01 | Accepted; monitor mode open |\n");
    const r = scanSource(d);
    expect(r.decisions).toEqual([
      { id: "0001", title: "Use A", status: "proposed", datedStatus: [], indexStatus: null, statusConflict: false, file: join("adr", "0001-a.md") },
      { id: "0002", title: "2. Use B", status: "Accepted, not fully built.", datedStatus: [], indexStatus: "Accepted; monitor mode open", statusConflict: false, file: join("adr", "0002-b.md") },
    ]);
    expect(r.notes.join(" ")).toMatch(/not fully built/);
  });
});

describe("scanSource", () => {
  const r = scanSource(fixture());
  it("finds bare prices with their context, so two prices for one plan can be compared", () => {
    const prices = r.claims.price.map((c) => c.text);
    expect(prices).toEqual(expect.arrayContaining(["$16", "$20"]));
    expect(r.claims.price.find((c) => c.text === "$20")?.context).toMatch(/Pro plan/);
  });
  it("reads tooltip attributes as data claims", () => {
    expect(r.claims.data.some((c) => /Parameter values/.test(c.text) && c.line === 6)).toBe(true);
  });
  it("finds availability and setup claims", () => {
    expect(r.claims.availability.some((c) => /coming soon/.test(c.text))).toBe(true);
    expect(r.claims.setup.some((c) => /docker run/.test(c.text))).toBe(true);
  });
  it("skips CSS, code samples and node_modules", () => {
    const all = Object.values(r.claims).flat();
    expect(all.some((c) => /\$1(?!\d)|color: red/.test(c.text))).toBe(false);
    expect(all.some((c) => c.file.includes("node_modules"))).toBe(false);
  });
  it("lists build flags that change output, but not built-in ones", () => {
    expect(r.envFlags.map((e) => e.name)).toEqual(["VITE_CALC_ONLY"]);
    expect(r.envFlags[0].uses[0]).toMatchObject({ file: join("routes", "index.tsx"), line: 1, affectsOutput: true });
  });
  it("refuses the filesystem root", () => {
    expect(() => scanSource("/")).toThrow(/root/);
  });
});

describe("scanSource review fixes", () => {
  it("takes the index status from the Status column, and only for records in the same folder", () => {
    // The status was the second-to-last cell: a date when the row had no trailing pipe. Records were keyed by number
    // only, so billing/adr/0001 was dropped and could get docs/adr's index status.
    const d = mkdtempSync(join(tmpdir(), "adr-"));
    mkdirSync(join(d, "docs", "adr"), { recursive: true });
    mkdirSync(join(d, "billing", "adr"), { recursive: true });
    writeFileSync(join(d, "docs", "adr", "0001-postgres.md"), "# Use Postgres\n\n## Status\n\nAccepted\n\n## Context\n");
    writeFileSync(join(d, "docs", "adr", "0002-sso.md"), "# Add SSO\n\n## Status\n\nProposed\n\n## Context\n");
    writeFileSync(join(d, "billing", "adr", "0001-usage-pricing.md"), "# Usage pricing\n\n## Status\n\nProposed\n\n## Context\n");
    writeFileSync(join(d, "docs", "adr", "README.md"), "| ADR | Title | Date | Status\n| --- | --- | --- | ---\n| 0001 | Use Postgres | 2026-01-01 | Accepted\n| 0002 | Add SSO | 2026-02-01 | Proposed\n");
    writeFileSync(join(d, "billing", "adr", "index.md"), "| ADR | Status | Title |\n| --- | --- | --- |\n| 0001 | Proposed | Usage pricing |\n");
    const r = scanSource(d);
    expect(r.decisions.map((x) => [x.file, x.status, x.indexStatus])).toEqual([
      [join("billing", "adr", "0001-usage-pricing.md"), "Proposed", "Proposed"],
      [join("docs", "adr", "0001-postgres.md"), "Accepted", "Accepted"],
      [join("docs", "adr", "0002-sso.md"), "Proposed", "Proposed"],
    ]);
    expect(r.notes.join(" ")).not.toMatch(/prefer the index/);
  });

  it("finds a price at the end of a sentence and string literals inside JSX braces", () => {
    const d = mkdtempSync(join(tmpdir(), "scan-"));
    writeFileSync(join(d, "pricing.html"), "<p>The Pro plan costs $20.</p>\n<p>Team is $49.99.</p>\n");
    writeFileSync(join(d, "Faq.tsx"), 'export const P = () => <p>{"We never store credentials; they stay on your machine."}</p>;\nconst f = [{ q: "Is it safe?", a: "We never store your query text." }];\n');
    const r = scanSource(d);
    expect(r.claims.price.map((c) => c.text)).toEqual(["The Pro plan costs $20.", "Team is $49.99."]);
    expect(r.claims.data.map((c) => `${c.file}:${c.line}`)).toEqual(["Faq.tsx:1", "Faq.tsx:2"]);
  });
});

describe("scanSource decision records (folder, dates, conflicts)", () => {
  it("finds records when the ADR folder itself is scanned, and numbered records with a status anywhere", () => {
    const d = mkdtempSync(join(tmpdir(), "adr-"));
    mkdirSync(join(d, "docs", "adr"), { recursive: true });
    mkdirSync(join(d, "rfcs"));
    writeFileSync(join(d, "docs", "adr", "0001-a.md"), "# A\n\nStatus: Accepted\n");
    writeFileSync(join(d, "docs", "adr", "0002-b.md"), "# B\n\nStatus: Proposed\n");
    writeFileSync(join(d, "rfcs", "0007-c.md"), "# C\n\n## Status\n\nAccepted\n");
    writeFileSync(join(d, "rfcs", "0008-notes.md"), "# Notes without a status\n");
    expect(scanSource(join(d, "docs", "adr")).decisions.map((x) => [x.file, x.status])).toEqual([
      ["0001-a.md", "Accepted"],
      ["0002-b.md", "Proposed"],
    ]);
    expect(scanSource(d).decisions.map((x) => x.file)).toEqual([join("docs", "adr", "0001-a.md"), join("docs", "adr", "0002-b.md"), join("rfcs", "0007-c.md")]);
  });

  it("says so when numbered files have no status", () => {
    const d = mkdtempSync(join(tmpdir(), "adr-"));
    for (const n of ["0001", "0002", "0003"]) writeFileSync(join(d, `${n}-x.md`), "# Chapter\n\nText.\n");
    const r = scanSource(d);
    expect(r.decisions).toEqual([]);
    expect(r.notes.join(" ")).toMatch(/3 files are numbered like decision records .* no decision records found/);
  });

  it("looks up to the git root for docs/adr when there are none under the folder", () => {
    const d = mkdtempSync(join(tmpdir(), "repo-"));
    mkdirSync(join(d, ".git"));
    mkdirSync(join(d, "docs", "adr"), { recursive: true });
    mkdirSync(join(d, "apps", "docs"), { recursive: true });
    writeFileSync(join(d, "docs", "adr", "0001-a.md"), "# A\n\nStatus: Accepted\n");
    writeFileSync(join(d, "apps", "docs", "intro.md"), "# Intro\n");
    const r = scanSource(join(d, "apps", "docs"));
    expect(r.decisionsFrom).toBe(join(r.dir, "..", "..", "docs", "adr"));
    expect(r.decisions.map((x) => [x.file, x.status])).toEqual([[join("..", "..", "docs", "adr", "0001-a.md"), "Accepted"]]);
    expect(r.notes.join(" ")).toMatch(/No decision records under this folder; read 1 from .*docs\/adr/);
    // Not past the git root.
    const e = mkdtempSync(join(tmpdir(), "outer-"));
    mkdirSync(join(e, "docs", "adr"), { recursive: true });
    mkdirSync(join(e, "repo", ".git"), { recursive: true });
    mkdirSync(join(e, "repo", "app"));
    writeFileSync(join(e, "docs", "adr", "0001-a.md"), "# A\n\nStatus: Accepted\n");
    expect(scanSource(join(e, "repo", "app")).decisionsFrom).toBeUndefined();
    expect(scanSource(join(e, "repo", "app")).decisions).toEqual([]);
  });

  it("reads the whole Status section, lists dated lines newest first, and flags conflicts with the index and between records", () => {
    const d = mkdtempSync(join(tmpdir(), "adr-"));
    mkdirSync(join(d, "adr"));
    writeFileSync(join(d, "adr", "0019-monitor.md"), "# Monitor mode\n\n## Status\n\nAccepted 2026-03-02.\n\nMonitor mode open, tracked in #4037.\n\n## Context\n");
    writeFileSync(join(d, "adr", "0024-monitor-alerts.md"), "# Monitor alerts\n\n## Status\n\nAccepted 2026-05-10. Deferred 2026-06-01.\n\nMonitor mode built 2026-08-21 (#4037).\n\n## Context\n\nSee 2025-01-01.\n");
    writeFileSync(join(d, "adr", "README.md"), "| # | Decision | Status |\n| --- | --- | --- |\n| 0019 | Monitor mode | Accepted; monitor mode open (#4037) |\n| 0024 | Monitor alerts | Accepted; monitor mode open |\n");
    const r = scanSource(d);
    const a = r.decisions.find((x) => x.id === "0024")!;
    expect(a.status).toBe("Accepted 2026-05-10. Deferred 2026-06-01. Monitor mode built 2026-08-21 (#4037).");
    expect(a.datedStatus).toEqual([
      { text: "Monitor mode built 2026-08-21 (#4037).", date: "2026-08-21" },
      { text: "Deferred 2026-06-01.", date: "2026-06-01" },
      { text: "Accepted 2026-05-10.", date: "2026-05-10" },
    ]);
    expect(a.statusConflict).toBe(true);
    expect(r.decisions.find((x) => x.id === "0019")!.statusConflict).toBe(false);
    expect(r.decisionIssues).toEqual([
      {
        issue: "#4037",
        conflict: true,
        mentions: [
          { file: join("adr", "0019-monitor.md"), line: 7, text: "Monitor mode open, tracked in #4037.", state: "open" },
          { file: join("adr", "0024-monitor-alerts.md"), line: 7, text: "Monitor mode built 2026-08-21 (#4037).", state: "done" },
          { file: join("adr", "README.md"), line: 3, text: "| 0019 | Monitor mode | Accepted; monitor mode open (#4037) |", state: "open" },
        ],
      },
    ]);
    expect(r.notes.join(" ")).toMatch(/report both; settle it from the feature's docs and code; the newest dated line usually wins/);
  });
});

describe("scanSource claim kinds, license and prices", () => {
  it("finds open-source and access claims, 'no agents to install' and 'shipping next'", () => {
    const d = mkdtempSync(join(tmpdir(), "scan-"));
    writeFileSync(join(d, "index.md"), "DBTool is open source under the MIT license.\n\nAnyone can try it anonymously, no sign-in needed.\n\nThere are no agents to install on your hosts.\n\nShipping next: Slack alerts for slow queries.\n");
    writeFileSync(join(d, "db.ts"), "// The analyzer connects as a superuser to read pg_stat_statements.\nexport const q = 1;\n");
    const r = scanSource(d);
    expect(r.claims.oss.map((c) => `${c.file}:${c.line}`)).toEqual(["index.md:1"]);
    expect(r.claims.access.map((c) => `${c.file}:${c.line}`)).toEqual(["db.ts:1", "index.md:3"]);
    expect(r.claims.setup.map((c) => c.line)).toEqual([5]);
    expect(r.claims.availability.map((c) => c.line)).toEqual([7]);
  });

  it("lists items under a radar or roadmap heading as availability, with the heading as context", () => {
    const d = mkdtempSync(join(tmpdir(), "scan-"));
    writeFileSync(join(d, "roadmap.md"), "## On our radar\n\n- Slack alerts\n- SSO\n\n## Plans\n\n- Free plan for one database\n");
    writeFileSync(join(d, "home.astro"), "<h2>Coming next</h2>\n<ul>\n  <li>MCP server</li>\n</ul>\n");
    const r = scanSource(d);
    expect(r.claims.availability.map((c) => [c.file, c.text, c.context])).toEqual([
      ["home.astro", "MCP server", "Coming next"],
      ["roadmap.md", "## On our radar", undefined],
      ["roadmap.md", "- Slack alerts", "On our radar"],
      ["roadmap.md", "- SSO", "On our radar"],
    ]);
  });

  it("reports the license state and says when open-source claims disagree with it", () => {
    const d = mkdtempSync(join(tmpdir(), "scan-"));
    mkdirSync(join(d, "packages", "cli"), { recursive: true });
    writeFileSync(join(d, "README.md"), "DBTool is fully open source.\n");
    writeFileSync(join(d, "package.json"), JSON.stringify({ name: "dt", private: true }));
    writeFileSync(join(d, "packages", "cli", "package.json"), JSON.stringify({ name: "dt-cli", license: "UNLICENSED" }));
    const r = scanSource(d);
    expect(r.licenseState).toEqual({
      files: [],
      packages: [
        { file: "package.json", name: "dt", license: null, private: true },
        { file: join("packages", "cli", "package.json"), name: "dt-cli", license: "UNLICENSED", private: false },
      ],
    });
    expect(r.filesScanned).toBe(1);
    expect(r.notes.join(" ")).toMatch(/says open source \(README\.md:1\), but no open-source license was found/);

    writeFileSync(join(d, "LICENSE"), "Business Source License 1.1\n\nLicensor: DBTool\n");
    const s = scanSource(d);
    expect(s.licenseState.files).toEqual([{ file: "LICENSE", license: "BUSL-1.1" }]);
    expect(s.notes.join(" ")).toMatch(/no open-source license was found: LICENSE: BUSL-1\.1/);

    writeFileSync(join(d, "LICENSE"), "MIT License\n\nPermission is hereby granted, free of charge\n");
    expect(scanSource(d).notes.join(" ")).not.toMatch(/open-source license/);
  });

  it("does not count SQL parameters or code as prices, and needs 2 digits, cents or a period suffix", () => {
    const d = mkdtempSync(join(tmpdir(), "scan-"));
    writeFileSync(join(d, "docs.md"), "We look for queries such as where id = $1 in your logs.\n\nIt rewrites ANY($1) and IN ($2, $3) lists for you.\n\nRun it with `--cost $5` in the shell to test.\n\nStarter is $9/mo, Pro is $5.00 more, Team ($49/mo).\n\nPick any of $1 to $3 tips.\n");
    const r = scanSource(d);
    expect(r.claims.price.map((c) => c.line)).toEqual([7]);
  });

  it("sets truncated when a kind is cut at maxPerKind", () => {
    const d = mkdtempSync(join(tmpdir(), "scan-"));
    writeFileSync(join(d, "a.md"), Array.from({ length: 8 }, (_, i) => `We never store your query text, part ${i}.`).join("\n\n") + "\n");
    expect(scanSource(d, 5).truncated).toBe(true);
    expect(scanSource(d, 10).truncated).toBe(false);
  });
});

describe("scanSource conflicts across the site and the docs", () => {
  function site() {
    const base = mkdtempSync(join(tmpdir(), "pair-"));
    mkdirSync(join(base, "site"));
    mkdirSync(join(base, "docs"));
    writeFileSync(join(base, "site", "pricing.astro"), "<h3>Pro plan</h3>\n<span>$20</span>\n");
    writeFileSync(join(base, "site", "index.html"), "<p>Pro is $16/mo billed annually.</p>\n<p>MCP server coming soon for every plan.</p>\n<p>Your rows of data never leave your machine.</p>\n");
    writeFileSync(join(base, "docs", "mcp-server.md"), "# MCP server\n\nConnect your editor to the analyzer.\n");
    writeFileSync(join(base, "docs", "privacy.md"), "# Privacy\n\nThe analyzer sends 10 sample rows to the model.\n");
    return base;
  }

  it("pairs prices for one plan, upcoming features that the docs document, and opposite data claims", () => {
    const base = site();
    const r = scanSource(join(base, "site"), 60, [join(base, "docs")]);
    const ref = (c: { file: string; line: number }) => `${c.file}:${c.line}`;
    expect(r.conflicts.map((c) => [c.topic, c.subject, ref(c.a), ref(c.b), c.modeHint])).toEqual([
      ["price", "pro", "index.html:1", "pricing.astro:2", "index.html:1: billed annually"],
      ["availability", "MCP server", "index.html:2", join("..", "docs", "mcp-server.md") + ":1", null],
      ["data", "rows", "index.html:3", join("..", "docs", "privacy.md") + ":3", null],
    ]);
    expect(r.compared).toEqual([{ dir: join(r.dir, "..", "docs"), filesScanned: 2, claimCounts: expect.objectContaining({ data: 1 }) }]);
    expect(r.notes.join(" ")).toMatch(/true in one mode .* unclear, not false/);
  });

  it("pairs thousands of claims and titles quickly", () => {
    const base = mkdtempSync(join(tmpdir(), "pair-"));
    mkdirSync(join(base, "site"));
    mkdirSync(join(base, "docs"));
    writeFileSync(join(base, "site", "a.md"), Array.from({ length: 1500 }, (_, i) => `Feature number${i} is coming soon. Pro is $${i + 10}/mo. We never store rows ${i}.`).join("\n") + "\n");
    writeFileSync(join(base, "docs", "b.md"), Array.from({ length: 1500 }, (_, i) => `## Feature topic${i}\n\nWe send sample rows ${i}.`).join("\n") + "\n");
    const t = performance.now();
    const r = scanSource(join(base, "site"), 60, [join(base, "docs")]);
    expect(performance.now() - t).toBeLessThan(1500);
    expect(r.conflicts.length).toBeLessThanOrEqual(40);
  });

  it("finds conflicts inside one folder too, and none when the claims agree", () => {
    const base = site();
    expect(scanSource(join(base, "site")).conflicts.map((c) => c.topic)).toEqual(["price"]);
    expect(scanSource(join(base, "docs")).conflicts).toEqual([]);
  });
});

describe("scanSource billing", () => {
  it("finds what a plan attaches to, which plan checks code outside tests calls, and upgrade copy", () => {
    const d = mkdtempSync(join(tmpdir(), "bill-"));
    mkdirSync(join(d, "routes"));
    mkdirSync(join(d, "test"));
    mkdirSync(join(d, "components"));
    writeFileSync(
      join(d, "users.repository.ts"),
      'export async function setPremium(userId: string) {\n  return db.users.update({ where: { id: userId }, data: { plan: "pro" } });\n}\nexport function isPremium(user: User): boolean {\n  return user.plan === "pro";\n}\nexport const FREE_PROJECT_LIMIT = 3;\n'
    );
    writeFileSync(join(d, "routes", "projects.ts"), 'import { isPremium } from "../users.repository";\nexport function create(user: User) {\n  if (!isPremium(user)) throw new Error("Upgrade to Pro to create more projects.");\n}\n');
    writeFileSync(join(d, "test", "limits.ts"), 'import { FREE_PROJECT_LIMIT } from "../users.repository";\nexpect(count).toBe(FREE_PROJECT_LIMIT);\n');
    writeFileSync(join(d, "components", "Paywall.tsx"), "export const P = () => <p>Unlock unlimited projects with the Pro plan.</p>;\n");
    const b = scanSource(d).billing!;
    expect(b.planAttachesTo).toEqual({ user: 4, team: 0, project: 1 });
    expect(b.gates).toEqual([
      { name: "FREE_PROJECT_LIMIT", definedAt: "users.repository.ts:7", callsOutsideTests: 0, callers: [] },
      { name: "isPremium", definedAt: "users.repository.ts:4", callsOutsideTests: 1, callers: [join("routes", "projects.ts") + ":3"] },
    ]);
    expect(b.upgradeCopy.map((c) => `${c.file}:${c.line}`)).toEqual([join("components", "Paywall.tsx") + ":1", join("routes", "projects.ts") + ":3"]);
    expect(b.hits.every((h) => !h.file.startsWith("test"))).toBe(true);
  });

  it("is null when there is no billing code", () => {
    const d = mkdtempSync(join(tmpdir(), "bill-"));
    writeFileSync(join(d, "a.ts"), 'export const LIMIT = 10;\nconst rows = db.query("select * from t limit 10");\n');
    expect(scanSource(d).billing).toBeNull();
  });
});

describe("scanSource review fixes (pairing, issue states, license, billing)", () => {
  it("pairs one plan's prices from real card markup, keeps a lifetime price apart, and reads a suffix on the next line", () => {
    // A one-word "Pro" name was never kept as context, so "$16" had no plan, and "Lifetime · $100 once" was filed under
    // pro because a "Go Pro" button was the nearest copy.
    const d = mkdtempSync(join(tmpdir(), "scan-"));
    writeFileSync(
      join(d, "index.astro"),
      ['<div class="price-card pro">', "  <h3>Pro</h3>", '  <span class="amount">$20</span>', '  <span class="per">/ month</span>', '  <a class="btn">Go Pro</a>', '  <a class="btn">Full comparison</a>', "</div>", '<span class="tag">Lifetime · $100 once</span>'].join("\n") + "\n"
    );
    writeFileSync(
      join(d, "pricing.astro"),
      ['<span class="dt-card-name">Starter</span>', '<span class="dt-price">$9</span>', "", '<span class="dt-price-suffix">/mo</span>', '<span class="dt-card-name">Pro</span>', '<p class="dt-card-pitch">For when two projects is not enough.</p>', '<span class="dt-price">$16</span>', '<span class="dt-price-suffix">/mo</span>'].join("\n") + "\n"
    );
    writeFileSync(join(d, "plans.md"), "Pro ($49) gives you everything.\n\nStarter: $9\n");
    const r = scanSource(d);
    expect(r.conflicts.filter((c) => c.topic === "price").map((c) => [c.subject, `${c.a.file}:${c.a.line}`, `${c.b.file}:${c.b.line}`])).toEqual([
      ["pro", "index.astro:3", "plans.md:1"],
      ["pro", "index.astro:3", "pricing.astro:7"],
    ]);
    expect(r.claims.price.find((c) => c.file === "pricing.astro" && c.line === 2)).toMatchObject({ text: "$9 /mo", plan: "Starter" });
    expect(r.notes.join(" ")).toMatch(/one-digit amount with no "\/mo" or "per" after it \(plans\.md:3\)/);
  });

  it("gives each issue on a line the state of its own clause, and flags a status conflict only when the states contradict", () => {
    const d = mkdtempSync(join(tmpdir(), "adr-"));
    mkdirSync(join(d, "adr"));
    writeFileSync(join(d, "adr", "0019-monitor.md"), "# Monitor\n\n## Status\n\nAccepted 2026-03-01. Monitor mode is open (#4037).\n\n## Context\n");
    writeFileSync(join(d, "adr", "0024-ingest.md"), "# Ingest\n\n## Status\n\nAccepted. CI mode built (#4035, #4036).\n\n## Context\n");
    writeFileSync(join(d, "adr", "0025-relay.md"), "# Relay\n\n## Status\n\nAccepted, built.\n\n## Context\n");
    writeFileSync(
      join(d, "adr", "README.md"),
      "| # | Decision | Status |\n| --- | --- | --- |\n| 0019 | Monitor | Open (#4037) |\n| 0024 | Ingest | Accepted, built for CI (#4035, #4036); monitor mode open (#4037) |\n| 0025 | Relay | Accepted; open |\n"
    );
    const r = scanSource(d);
    expect(r.decisionIssues.map((x) => [x.issue, x.conflict])).toEqual([
      ["#4035", false],
      ["#4036", false],
      ["#4037", false],
    ]);
    expect(r.decisionIssues[0].mentions.find((m) => m.file.endsWith("README.md"))?.state).toBe("done");
    expect(r.decisions.map((x) => [x.id, x.statusConflict])).toEqual([
      ["0019", false],
      ["0024", false],
      ["0025", true],
    ]);
  });

  it("reads the LICENSE and package.json at the git root when scanning an app folder in a monorepo", () => {
    const d = mkdtempSync(join(tmpdir(), "repo-"));
    mkdirSync(join(d, ".git"));
    mkdirSync(join(d, "apps", "web"), { recursive: true });
    writeFileSync(join(d, "LICENSE"), "MIT License\n\nPermission is hereby granted, free of charge\n");
    writeFileSync(join(d, "package.json"), JSON.stringify({ name: "root", license: "MIT" }));
    writeFileSync(join(d, "apps", "web", "package.json"), JSON.stringify({ private: true }));
    writeFileSync(join(d, "apps", "web", "index.html"), "<p>DBTool is fully open source.</p>\n");
    const r = scanSource(join(d, "apps", "web"));
    expect(r.licenseState.files).toEqual([{ file: join("..", "..", "LICENSE"), license: "MIT" }]);
    expect(r.licenseState.packages.map((p) => [p.file, p.license])).toEqual([
      ["package.json", null],
      [join("..", "..", "package.json"), "MIT"],
    ]);
    expect(r.notes.join(" ")).not.toMatch(/no open-source license was found/);
    // Not past the git root.
    const e = mkdtempSync(join(tmpdir(), "outer-"));
    writeFileSync(join(e, "LICENSE"), "MIT License\n");
    mkdirSync(join(e, "repo", ".git"), { recursive: true });
    mkdirSync(join(e, "repo", "app"));
    expect(scanSource(join(e, "repo", "app")).licenseState.files).toEqual([]);
  });

  it("pairs upcoming claims only with page titles and H1s whose words appear together in the claim", () => {
    const base = mkdtempSync(join(tmpdir(), "pair-"));
    mkdirSync(join(base, "site"));
    mkdirSync(join(base, "docs"));
    writeFileSync(join(base, "site", "index.md"), "Coming soon. Select it now and delivery starts later.\n\nNot yet. We are figuring out what teams actually need.\n\nCompare runs, coming soon to the app.\n\nThe MCP server is coming soon.\n\nSSO is coming soon.\n");
    writeFileSync(join(base, "docs", "select-star.md"), "---\ntitle: SELECT *\n---\n\nText.\n");
    writeFileSync(join(base, "docs", "self-hosting.md"), "# Self-hosting\n\n## What you need\n\nText.\n");
    writeFileSync(join(base, "docs", "skill.md"), "# 8. Connect the database\n\n# Run compare\n\nText.\n");
    writeFileSync(join(base, "docs", "mcp.md"), "# MCP server\n\nText.\n");
    writeFileSync(join(base, "docs", "sso.md"), "# SSO\n\nText.\n");
    const r = scanSource(join(base, "site"), 60, [join(base, "docs")]);
    expect(r.conflicts.filter((c) => c.topic === "availability").map((c) => [c.a.line, c.subject])).toEqual([
      [7, "MCP server"],
      [9, "SSO"],
    ]);
  });

  it("names the entity only from whole words or identifier parts, and reads billing hits only from the script parts of pages", () => {
    const d = mkdtempSync(join(tmpdir(), "bill-"));
    writeFileSync(join(d, "billing.ts"), "const q = remember(quota);\nconst s = steam.seats;\nconst w = website.quota;\nconst t = seats.get(teamId);\n");
    writeFileSync(join(d, "pricing.astro"), "---\nconst seats = user.seats;\n---\n<p>Shared dashboards, RBAC, SSO, seat billing.</p>\n<script>\nconst quota = org.quota;\n</script>\n");
    writeFileSync(join(d, "Plans.tsx"), "export const P = () => (\n  <ul>\n    <li>Unlimited seats on the Team plan</li>\n  </ul>\n);\nconst seats = account.seats;\n");
    const b = scanSource(d).billing!;
    expect(b.hits.map((h) => [`${h.file}:${h.line}`, h.entity])).toEqual([
      ["Plans.tsx:6", "user"],
      ["billing.ts:1", null],
      ["billing.ts:2", null],
      ["billing.ts:3", null],
      ["billing.ts:4", "team"],
      ["pricing.astro:2", "user"],
      ["pricing.astro:6", "team"],
    ]);
    expect(b.planAttachesTo).toEqual({ user: 2, team: 2, project: 0 });
  });
});
