import { describe, it, expect } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkQuotes } from "../src/lib/quoteCheck.js";

function repo() {
  const d = mkdtempSync(join(tmpdir(), "quotes-"));
  mkdirSync(join(d, "docs", "adr"), { recursive: true });
  mkdirSync(join(d, "pages"));
  writeFileSync(join(d, "docs", "adr", "0006-supply.md"), "# Supply\n\nIntro.\n\nThe table held 141 items on the day we counted.\n");
  writeFileSync(join(d, "docs", "adr", "README.md"), "| 0019 | Analysis | monitor mode open |\n");
  writeFileSync(
    join(d, "pages", "pricing.astro"),
    ['<h3>Pro</h3>', '<span data-tip="Read-only connection. Parameter values aren\'t included.">i</span>', "<p>Credentials <em>you</em> control, always.</p>"].join("\n")
  );
  return d;
}

describe("checkQuotes", () => {
  const d = repo();
  const status = (text: string) => checkQuotes(text, [d]).results.map((r) => r.status);

  it("verifies a quote on the cited line, including tooltip text and inline markup", () => {
    expect(status('The tooltip says "Parameter values aren\'t included" (`pricing.astro:2`).')).toEqual(["verified"]);
    expect(status('The FAQ says "Credentials *you* control, always" (pricing.astro:3).')).toEqual(["verified"]);
  });
  it("flags a wrong line", () => {
    const r = checkQuotes('ADR 0006 line 1 says "held 141 items on the day".', [d]);
    expect(r.results[0].status).toBe("wrong-line");
    expect(r.problems[0]).toMatch(/0006-supply\.md:5/);
  });
  it("flags a quote put in the wrong file and says where it is", () => {
    const r = checkQuotes('ADR 0019 says "monitor mode open" for now.', [d]);
    expect(r.results[0].status).toBe("other-file");
    expect(r.results[0].foundAt[0]).toBe(join("docs", "adr", "README.md") + ":1");
  });
  it("flags words that aren't in the cited file", () => {
    expect(status('pricing.astro says "we never store anything at all".')).toEqual(["not-found"]);
  });
  it("matches fragments around an ellipsis and ignores trailing punctuation", () => {
    expect(status('ADR 0006 lines 4-6: "The table held … we counted."')).toEqual(["verified"]);
  });
  it("doesn't treat the text between two quotes as a quote", () => {
    const r = checkQuotes('It says "Parameter values aren\'t included" (`pricing.astro:2`), and "Credentials you control, always" elsewhere.', [d]);
    expect(r.results.every((x) => !x.quote.startsWith(" ("))).toBe(true);
  });
});
