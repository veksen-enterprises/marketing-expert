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
