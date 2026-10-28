import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { chmodSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { checkAnswer } from "../src/lib/answerCheck.js";
import { checkQuotes } from "../src/lib/quoteCheck.js";
import { checkLabels } from "../src/lib/labelCheck.js";
import { join } from "node:path";
// @ts-ignore: plain .mjs scripts, no type declarations
import { fQuantile, iccOneWay, itemAgreement, pairedComparison, tQuantile, varianceSplit } from "../scripts/evals/stats.mjs";
// @ts-ignore
import { answerSection, caseOfRun, errorsOverlap, fingerprintStatus, formatToolFindings, parseGrade, planBatch, redact, toolFindings } from "../scripts/evals/grades.mjs";

const script = join(__dirname, "../scripts/evals/grade.mjs");

describe("distribution quantiles", () => {
  it("match printed tables", () => {
    expect(tQuantile(0.975, 1)).toBeCloseTo(12.706205, 4);
    expect(tQuantile(0.975, 2)).toBeCloseTo(4.302653, 5);
    expect(tQuantile(0.975, 5)).toBeCloseTo(2.570582, 5);
    expect(tQuantile(0.975, 10)).toBeCloseTo(2.228139, 5);
    expect(tQuantile(0.025, 10)).toBeCloseTo(-2.228139, 5);
    expect(fQuantile(0.975, 4, 10)).toBeCloseTo(4.4683, 3);
    expect(fQuantile(0.95, 3, 20)).toBeCloseTo(3.0984, 3);
  });
});

describe("paired comparison across cases", () => {
  it("averages runs within a case, then takes a t interval over cases (hand-computed)", () => {
    const rows = [
      ...[10, 12].map((value) => ({ case: "a", version: "base", value })),
      { case: "a", version: "cand", value: 13 },
      { case: "b", version: "base", value: 11 },
      ...[11, 12].map((value) => ({ case: "b", version: "cand", value })),
      { case: "c", version: "base", value: 9 },
      { case: "c", version: "cand", value: 9 },
      { case: "d", version: "base", value: 14 },
    ];
    const r = pairedComparison(rows, "base", "cand");
    expect(r.cases.map((c: { diff: number }) => c.diff)).toEqual([2, 0.5, 0]);
    expect(r.unpaired).toEqual([{ case: "d", baselineRuns: 1, candidateRuns: 0 }]);
    expect(r.meanDiff).toBeCloseTo(0.8333, 4);
    // sd of (2, 0.5, 0) = 1.0408; se = 0.6009; t(0.975, 2) = 4.3027.
    expect(r.se).toBeCloseTo(0.6009, 4);
    expect(r.ci[0]).toBeCloseTo(-1.752, 3);
    expect(r.ci[1]).toBeCloseTo(3.419, 3);
  });
});

describe("grader agreement", () => {
  it("ICC(1) on totals (hand-computed: MSB 4.5, MSW 1/3)", () => {
    const r = iccOneWay([[10, 11], [12, 12], [14, 13]]);
    expect(r.icc).toBeCloseTo(0.86207, 4);
    // F(0.975; 2, 3) = 16.044 and F(0.975; 3, 2) = 39.165 give (−0.086, 0.996).
    expect(r.ci[0]).toBeCloseTo(-0.086, 2);
    expect(r.ci[1]).toBeCloseTo(0.996, 2);
  });
  it("raw agreement, kappa and AC1 on a 0–2 item", () => {
    const r = itemAgreement([[2, 2], [2, 2], [2, 1], [1, 1]], [0, 1, 2]);
    expect(r.raw).toBe(0.75);
    expect(r.kappa).toBeCloseTo(0.5, 6);
    expect(r.ac1).toBeCloseTo(0.515625 / 0.765625, 6);
  });
  it("kappa is undefined, not zero, on an item that never varies", () => {
    const r = itemAgreement([[2, 2], [2, 2], [2, 2]], [0, 1, 2]);
    expect(r.kappa).toBeNaN();
    expect(r.ac1).toBe(1);
  });
  it("splits run and grader variance (hand-computed)", () => {
    const r = varianceSplit([
      { case: "x", totals: [10, 12] },
      { case: "x", totals: [14, 14] },
      { case: "y", totals: [9, 9] },
      { case: "y", totals: [11, 13] },
    ]);
    expect(r.grader).toBe(1);
    expect(r.run).toBe(4);
    expect(r.graderShare).toBeCloseTo(0.2, 6);
  });
  it("counts errors both graders found by class and line", () => {
    const a = [{ class: "misquote", answerLine: 4 }, { class: "wrong-line", answerLine: 9 }];
    const b = [{ class: "misquote", answerLine: 4 }, { class: "bundled-move", answerLine: 20 }];
    expect(errorsOverlap(a, b)).toEqual({ a: 2, b: 2, both: 1, union: 3, shareBoth: 1 / 3 });
  });
});

describe("reading grades", () => {
  it("reproduces the item counts of the 21 committed grades (research/grader-reliability.md section 1)", () => {
    const dirs = ["evals/grades", "evals/grades/v2", "evals/grades/v3", "evals/grades/v4"];
    const files = dirs.flatMap((d) => readdirSync(d).filter((f) => f.endsWith(".md") && !f.includes("contaminated")).map((f) => join(d, f)));
    const grades = files.map((f) => parseGrade(readFileSync(f, "utf8")));
    expect(grades).toHaveLength(21);
    expect(grades.every((g: { legacy: boolean }) => g.legacy)).toBe(true);
    const twos = (n: number) => grades.filter((g: { items: Record<number, number> }) => g.items[n] === 2).length;
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(twos)).toEqual([19, 21, 12, 13, 12, 21, 3, 11, 18, 14]);
    const totals = grades.map((g: { total: number }) => g.total);
    expect(Math.min(...totals)).toBe(15);
    expect(Math.max(...totals)).toBe(18);
  });

  const current = (rows: string, gates = "| G2 | No invented figures | pass | x |\n| G6 | Specific | **fail** | x |") =>
    `## Scores\n\n| # | Item | Score | Evidence |\n|---|---|---|---|\n${rows}\n\n| # | Gate | Result | Evidence |\n|---|---|---|---|\n${gates}\n\n**Total: 99 / 16**\n\n| # | Claim | Line |\n|---|---|---|\n| 1 | other table | 3 |\n`;
  const allItems = [1, 3, 4, 5, 7, 8, 9, 10].map((n) => `| ${n} | x | ${n === 7 ? 0 : 2} | e |`).join("\n");

  it("sums the eight scored items, reads gates, ignores other tables and the written total", () => {
    const g = parseGrade(current(allItems));
    expect(g.legacy).toBe(false);
    expect(g.total).toBe(14);
    expect(g.max).toBe(16);
    expect(g.gates).toEqual({ G2: "pass", G6: "fail" });
  });
  it("refuses incomplete or malformed tables, naming the row", () => {
    expect(() => parseGrade(current(allItems, "| G2 | x | pass | x |"))).toThrow(/missing G6/);
    expect(() => parseGrade(current(allItems.replace("| 4 | x | 2 |", "| 4 | x | 1.5 |")))).toThrow(/item 4/);
    expect(() => parseGrade(current(allItems + "\n| 2 | Asked for numbers | 2 | e |"))).toThrow(/doesn't score: 2/);
  });
  it("checks the logged check_answer fingerprint against the saved answer", () => {
    const answer = "Short answer.\n\nDo one thing.";
    const hash = checkAnswer(answer).fingerprint.slice(0, 10);
    expect(fingerprintStatus(`## Answer\n\n${answer}\n\n## Tool log\n\n1. check_answer (fingerprint ${hash})`)).toBe("match");
    expect(fingerprintStatus(`## Answer\n\n${answer} Edited later.\n\n## Tool log\n\n1. check_answer (fingerprint ${hash})`)).toBe("differs");
    expect(fingerprintStatus(`## Answer\n\n${answer}\n\n## Tool log\n\n1. check_answer: no problems`)).toBe("none logged");
  });
  it("takes the answer section of a run file", () => {
    expect(answerSection("## Answer\n\nHello.\n\n## Tool log\n\n1. call")).toBe("Hello.");
    expect(answerSection("No heading.\n## Tool log\nx")).toBe("No heading.");
  });
});

describe("tool findings for graders (research/llm-citation-checking.md §5)", () => {
  const tools = { checkQuotes, checkLabels };
  // Line 48 of evals/runs/v4/devtool-strategy.md: the v4 grader found the dropped qualifier by hand.
  const v4 = readFileSync("evals/runs/v4/devtool-strategy.md", "utf8").split("\n")[47];
  it("counts a dropped bracket qualifier from a real answer, with the playbook label", () => {
    expect(v4).toMatch(/\[first-party survey\]/);
    const f = toolFindings(v4, undefined, tools);
    expect(f.label).toHaveLength(1);
    expect(f.label[0]).toMatchObject({ status: "qualifier-dropped", sourceLabels: ["first-party survey; self-selected sample"] });
    // No material: quotes are not checked, and that is said, not counted as zero.
    expect(f.quote).toBeNull();
  });
  it("counts a quote on the wrong line or not in the source, and not a verified one", () => {
    const material = "evals/fixtures/kitlend";
    const answer = [
      'The founders "launched 20 months ago" (ABOUT.md:9).',
      'They rule out "no gear that can\'t be inspected in person" (ABOUT.md:6).',
      'They want "growth at any cost" (ABOUT.md:3).',
    ].join("\n");
    const f = toolFindings(answer, material, tools);
    expect(f.quote!.map((q: { status: string }) => q.status)).toEqual(["wrong-line", "not-found"]);
    expect(f.label).toEqual([]);
  });
  it("formats the findings for the grader prompt, and says what they don't cover", () => {
    const text = formatToolFindings(toolFindings(v4, undefined, tools));
    expect(text).toMatch(/qualifier-dropped.*first-party survey; self-selected sample/);
    expect(text).toMatch(/Quotes: not checked/);
    expect(text).toMatch(/paraphrase/);
    expect(formatToolFindings({ quote: [], label: [] })).toMatch(/Quotes: none found/);
  });
});

describe("blind batches", () => {
  const ids = new Set(["devtool-site", "ecom-ads"]);
  it("maps run files to cases and skips contaminated ones out loud", () => {
    expect(caseOfRun("devtool-site.md", ids)).toEqual({ case: "devtool-site" });
    expect(caseOfRun("devtool-site-2.md", ids)).toEqual({ case: "devtool-site" });
    expect(caseOfRun("ecom-ads-run3.md", ids)).toEqual({ case: "ecom-ads" });
    expect(caseOfRun("ecom-ads/a.md", ids)).toEqual({ case: "ecom-ads" });
    expect(caseOfRun("devtool-site-contaminated.md", ids).skip).toMatch(/contaminated/);
    expect(caseOfRun("fernhill-tea.md", ids).skip).toMatch(/not a case id/);
  });
  it("hides the round in data folders and run paths", () => {
    const text = "MCP calls (`MARKETING_EXPERT_DATA_DIR=evals/data/v4-devtool-site`), see evals/runs/v4/x.md and evals/data/v3-companion-risk:**";
    const r = redact(text, { paths: ["evals/runs/v4"] });
    expect(r.text).not.toMatch(/v4|v3/);
    expect(r.text).toContain("evals/data/<hidden>");
  });
  it("shuffles both versions into one batch, reproducibly from the seed, without naming the version", () => {
    const versions = [
      { label: "base", paths: ["runs/v4"], runs: [{ case: "ecom-ads", file: "runs/v4/ecom-ads-1.md", text: "A in runs/v4" }, { case: "ecom-ads", file: "runs/v4/ecom-ads-2.md", text: "B" }] },
      { label: "cand", paths: ["runs/v5"], runs: [{ case: "ecom-ads", file: "runs/v5/ecom-ads-1.md", text: "C" }, { case: "ecom-ads", file: "runs/v5/ecom-ads-2.md", text: "D" }] },
    ];
    const one = planBatch(versions, { seed: 7, copies: 2 });
    const two = planBatch(versions, { seed: 7, copies: 2 });
    expect(one.files).toEqual(two.files);
    expect(one.files).toHaveLength(8);
    expect(new Set(one.key.map((k: { id: string }) => k.id)).size).toBe(8);
    for (const f of one.files) {
      expect(f.name).toMatch(/^ecom-ads--[0-9a-z]{6}\.md$/);
      expect(f.text).not.toMatch(/v4|v5|base|cand/);
    }
    expect(one.identical).toEqual([]);
    const same = planBatch([versions[0], { ...versions[1], runs: [{ ...versions[1].runs[0], text: "B" }] }], { seed: 1 });
    expect(same.identical).toEqual([["runs/v4/ecom-ads-2.md", "runs/v5/ecom-ads-1.md"]]);
  });
});

describe("grade.mjs end to end, with a stand-in grader", () => {
  // The stand-in reads QUALITY=<n> from the answer and scores every item min(2, n); its item 1 depends on the id,
  // so two grades of one answer can differ.
  const mock = `#!/usr/bin/env node
const fs = require("fs");
const prompt = process.argv[process.argv.indexOf("-p") + 1];
if (process.env.PROMPT_LOG) fs.appendFileSync(process.env.PROMPT_LOG, prompt + "\\n=====\\n");
const path = prompt.match(/The answer: (\\S+?\\.md)\\./)[1];
const q = Number(fs.readFileSync(path, "utf8").match(/QUALITY=(\\d)/)[1]);
const id = path.match(/--([0-9a-z]{6})\\.md$/)[1];
const one = id.charCodeAt(0) % 2 ? 1 : 2;
const rows = [1, 3, 4, 5, 7, 8, 9, 10].map((n) => "| " + n + " | x | " + (n === 1 ? one : Math.min(2, q)) + " | e |").join("\\n");
console.log("| # | Item | Score | Evidence |\\n|---|---|---|---|\\n" + rows + "\\n\\n| # | Gate | Result | Evidence |\\n|---|---|---|---|\\n| G2 | x | pass | e |\\n| G6 | x | pass | e |\\n");
console.log("\\x60\\x60\\x60json\\n" + JSON.stringify(q < 2 ? [{ class: "bundled-move", answerLine: 3 }] : []) + "\\n\\x60\\x60\\x60");
`;
  const run = (args: string[]) => execFileSync(process.execPath, [script, ...args], { encoding: "utf8" });

  it("blinds, grades, and reports the paired difference and agreement", () => {
    const tmp = mkdtempSync(join(tmpdir(), "eval-grading-test-"));
    const grader = join(tmp, "grader.cjs");
    writeFileSync(grader, mock);
    chmodSync(grader, 0o755);
    // A stage map with one stage missing: one check_answer problem.
    const map = "\n\n### Stage map\n- Positioning: constraint. No buyer named.\n- Price: fine. Matches alternatives.\n- Site: unknown. Not opened.\n- Discovery: later.\n- Outreach: later.\n- Conversion: unknown.\n- Retention: fine.\n- Legal: fine.\n- Founder's time: fine.";
    const write = (dir: string, files: Record<string, number>, withMap = false) => {
      mkdirSync(join(tmp, dir), { recursive: true });
      for (const [name, q] of Object.entries(files))
        writeFileSync(join(tmp, dir, name), `## Answer\n\nAdvice. QUALITY=${q}${withMap ? map : ""}\n\n## Tool log\n\nMARKETING_EXPERT_DATA_DIR=evals/data/${dir}-x\n`);
    };
    // Baseline: every run scores 1 on the seven id-independent items; candidate: 2. Difference: 7 points per case.
    write("v1", { "ecom-ads-1.md": 1, "ecom-ads-2.md": 1, "kitlend-ish-1.md": 1, "local-weekdays-1.md": 1 });
    // The candidate has a stage map; the baseline was made before check_answer asked for one.
    write("v2", { "ecom-ads-1.md": 2, "ecom-ads-2.md": 2, "local-weekdays-1.md": 2, "local-weekdays-2.md": 2 }, true);
    const batch = join(tmp, "batch");
    const blinded = run(["blind", "--baseline", join(tmp, "v1"), "--candidate", join(tmp, "v2"), "--out", batch, "--seed", "3"]);
    expect(blinded).toMatch(/skipped .*kitlend-ish-1\.md: not a case id/);
    for (const f of readdirSync(join(batch, "answers"))) expect(readFileSync(join(batch, "answers", f), "utf8")).not.toMatch(/v1|v2/);
    process.env.PROMPT_LOG = join(tmp, "prompts.log");
    run(["grade", "--batch", batch, "--grader-cmd", grader, "--parallel", "2"]);
    delete process.env.PROMPT_LOG;
    const prompts = readFileSync(join(tmp, "prompts.log"), "utf8");
    expect(prompts).toMatch(/Already counted by script/);
    expect(prompts).toMatch(/quote the source words for each, or write "none"/);
    expect(prompts).toMatch(/Quotes: none found wrong/);
    const json = JSON.parse(run(["compare", "--batch", batch, "--json"]));
    for (const name of ["quote problems (verify_quotes)", "label problems (check_answer)"]) expect(json.results.find((r: { name: string }) => r.name === name)?.k, name).toBe(2);
    const total = json.results.find((r: { name: string }) => r.name === "total");
    expect(total.k).toBe(2);
    expect(total.cases.map((c: { case: string }) => c.case)).toEqual(["ecom-ads", "local-weekdays"]);
    // Item 7 of the stand-in moves with quality: 1 → 2.
    const item7 = json.results.find((r: { name: string }) => r.name === "item 7");
    expect(item7.meanDiff).toBe(1);
    const bundled = json.results.find((r: { name: string }) => r.name === "errors: bundled-move");
    expect(bundled.meanDiff).toBe(-1);
    expect(run(["compare", "--batch", batch])).toMatch(/mean difference \+/);
    // A baseline with no stage map would show "missing stage map" in every run: not compared, and said so.
    expect(json.results.map((r: { name: string }) => r.name).filter((n: string) => /stage/i.test(n))).toEqual([]);
    expect(json.notes.join(" ")).toMatch(/Stage-map problems not compared: no baseline answer has a "## Stage map"/);
    expect(run(["compare", "--batch", batch])).toMatch(/Stage-map problems not compared/);
    // Both versions with a map: compared as their own measure, apart from move-format issues.
    write("v3", { "ecom-ads-1.md": 1, "ecom-ads-2.md": 1, "local-weekdays-1.md": 1 }, true);
    const both = join(tmp, "batch-both");
    run(["blind", "--baseline", join(tmp, "v3"), "--candidate", join(tmp, "v2"), "--out", both, "--seed", "3"]);
    run(["grade", "--batch", both, "--grader-cmd", grader, "--parallel", "2"]);
    const bothJson = JSON.parse(run(["compare", "--batch", both, "--json"]));
    expect(bothJson.results.find((r: { name: string }) => r.name === "stage-map problems (check_answer)")).toMatchObject({ k: 2, meanDiff: 0 });
    expect(bothJson.notes).toEqual([]);

    const dbl = join(tmp, "double");
    const out = run(["double-grade", "--runs", join(tmp, "v2"), "--out", dbl, "--seed", "5", "--grader-cmd", grader]);
    expect(out).toMatch(/Grader agreement over 4 runs, 2 grades each/);
    expect(out).toMatch(/ICC\(1\)/);
    expect(out).toMatch(/Errors found by both graders/);
    const key = JSON.parse(readFileSync(join(dbl, "key.json"), "utf8"));
    expect(key.entries).toHaveLength(8);
  });
});
