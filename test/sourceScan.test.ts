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
