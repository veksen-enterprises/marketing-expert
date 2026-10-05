// Regression tests for the tools that read a local repository (scan_source, verify_quotes) and for check_answer:
// symbolic links, memory, and time on very large or hostile input. The tools run synchronously in the server,
// so a slow regex or a walk that never ends blocks every other tool call.
import { describe, it, expect } from "vitest";
import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { scanSource } from "../src/lib/sourceScan.js";
import { checkQuotes } from "../src/lib/quoteCheck.js";
import { checkAnswer } from "../src/lib/answerCheck.js";
import { paragraphs, searchParagraphs } from "../src/lib/labelCheck.js";
import { searchKnowledge } from "../src/lib/knowledge.js";

const tmp = (prefix: string) => mkdtempSync(join(tmpdir(), prefix));

function ms(fn: () => unknown): number {
  const t = performance.now();
  fn();
  return performance.now() - t;
}

describe("symbolic links in the scanned directory", () => {
  it("doesn't follow a link back into the tree", () => {
    // Was 4000 copies of the same file (a/a/a/.../index.html) and a false "Stopped after 4000 files".
    const d = tmp("loop-");
    writeFileSync(join(d, "index.html"), "<p>We never store your credentials or connection strings anywhere.</p>\n");
    symlinkSync(".", join(d, "a"));
    symlinkSync(".", join(d, "b"));
    const r = scanSource(d);
    expect(r.filesScanned).toBe(1);
    expect(r.truncated).toBe(false);
    expect(r.claimCounts.data).toBe(1);
    expect(checkQuotes('It says "We never store your credentials or connection strings anywhere" (index.html:1).', [d]).results[0].foundAt).toEqual(["index.html:1"]);
  });

  it("finishes fast on a link loop with no files to read", () => {
    // Two links to the parent and nothing to read: the walk branched twice per level and never returned.
    const d = tmp("loop-");
    mkdirSync(join(d, "site"));
    symlinkSync("..", join(d, "site", "a"));
    symlinkSync("..", join(d, "site", "b"));
    writeFileSync(join(d, "site", "logo.png"), "");
    expect(ms(() => scanSource(d))).toBeLessThan(1000);
    expect(ms(() => checkQuotes('It says "nothing like this is here".', [d]))).toBeLessThan(1000);
  });

  it("doesn't read files outside the directory through a link", () => {
    const d = tmp("outside-");
    mkdirSync(join(d, "repo"));
    mkdirSync(join(d, "outside"));
    writeFileSync(join(d, "outside", "private.md"), "We store customer passwords in plain text.\n");
    symlinkSync("../outside", join(d, "repo", "docs"));
    symlinkSync(join(d, "outside", "private.md"), join(d, "repo", "notes.md"));
    const repo = join(d, "repo");
    expect(scanSource(repo).filesScanned).toBe(0);
    expect(checkQuotes('Notes: "We store customer passwords in plain text" (private.md:1).', [repo]).results[0].status).toBe("cited-file-missing");
  });

  it.skipIf(!existsSync("/proc/self/root"))("doesn't reach the filesystem root through /proc/self/root", () => {
    expect(scanSource("/proc/self", 5).filesScanned).toBe(0);
  });
});

describe("verify_quotes indexing", () => {
  it("reads each file once when a directory is passed twice or inside another", () => {
    const d = tmp("dup-");
    mkdirSync(join(d, "docs"));
    writeFileSync(join(d, "docs", "a.md"), "The table held 141 items on the day.\n");
    const r = checkQuotes('It says "held 141 items on the day".', [d, d, join(d, "docs")]);
    expect(r.results[0].foundAt).toEqual([join("docs", "a.md") + ":1"]);
    expect(r.notes).toEqual([]);
  });

  it("stops at a total size budget and says so", { timeout: 30000 }, () => {
    const d = tmp("budget-");
    const body = "Some ordinary fixture text for the docs, nothing special here at all.\n".repeat(7000); // about 500 KB
    try {
      for (let i = 0; i < 110; i++) writeFileSync(join(d, `f${String(i).padStart(3, "0")}.txt`), body);
      const r = checkQuotes('It says "nothing special here at all".', [d]);
      expect(r.results[0].status).toBe("uncited-found");
      expect(r.notes.join(" ")).toMatch(/50 MB/);
    } finally {
      rmSync(d, { recursive: true, force: true });
    }
  });

  it("reads citations of .json files and paths at the end of a sentence", () => {
    const d = tmp("cite-");
    mkdirSync(join(d, "docs"));
    writeFileSync(join(d, "package.json"), '{\n  "description": "Find slow queries before your users do"\n}\n');
    writeFileSync(join(d, "docs", "a.md"), "Intro.\n\nThe table held 141 items on the day.\n");
    writeFileSync(join(d, "Dockerfile"), "FROM node:22\nRUN npm ci --omit=dev\n");
    const status = (text: string) => checkQuotes(text, [d]).results.map((r) => r.status);
    expect(status('The package says "Find slow queries before your users do" (package.json:2).')).toEqual(["verified"]);
    expect(status('It says "held 141 items on the day" in docs/a.md.')).toEqual(["verified"]);
    expect(status('It says "held 141 items on the day" (docs/a.md L3-L4).')).toEqual(["verified"]);
    expect(status('It says "held 141 items on the day" (`a.md:3`).')).toEqual(["verified"]);
    expect(status('It says "held 141 items on the day" (a.md:8).')).toEqual(["wrong-line"]);
    expect(status('The image runs "npm ci --omit=dev" when built (Dockerfile:2).')).toEqual(["verified"]);
  });
});

describe("time on hostile input", () => {
  it("verify_quotes: a long token with no file extension", () => {
    // The path pattern backtracked cubically: 2000 characters took about 3 s, with no quote in the text.
    const d = tmp("empty-");
    expect(ms(() => checkQuotes("Commit " + "0123456789abcdef".repeat(125) + " was deployed.", [d]))).toBeLessThan(1000);
    expect(ms(() => checkQuotes("Commit " + "0123456789abcdef".repeat(6000) + " was deployed.", [d]))).toBeLessThan(1000);
  });

  it("verify_quotes: a repository line with many '<' and no '>'", () => {
    const d = tmp("norm-");
    writeFileSync(join(d, "page.html"), "<p>" + "a<b ".repeat(20000) + "</p\n");
    expect(ms(() => checkQuotes('It says "nothing like this is here".', [d]))).toBeLessThan(1000);
  });

  it("verify_quotes: an elided quote whose second part is missing or far away", () => {
    const d = tmp("find-");
    writeFileSync(join(d, "guide.md"), "The value of the plan is part of the offer.\n".repeat(9300) + "Refunds are paid within thirty days.\n");
    expect(ms(() => checkQuotes('The guide says "part of the … refund within ninety days" (guide.md:3).', [d]))).toBeLessThan(1000);
    expect(ms(() => checkQuotes('The guide says "part of the … paid within thirty days" (guide.md:3).', [d]))).toBeLessThan(1000);
    // Still found when the parts are close together.
    expect(checkQuotes('The guide says "plan is … the offer" (guide.md:3).', [d]).results[0].status).toBe("verified");
  });

  it("verify_quotes: many quotes and citations in one sentence", () => {
    // Every quote resolved and searched every citation in its sentence: 100 quotes and 3100 citations took seconds.
    const d = tmp("holder-");
    for (let i = 0; i < 300; i++) writeFileSync(join(d, `f${i}.md`), `File ${i} has some words.\n`);
    writeFileSync(join(d, "big.md"), "Some ordinary words in a long file.\n".repeat(600));
    const pairs = Array.from({ length: 100 }, (_, i) => `"quoted words number ${i} here" (big.md:${i})`);
    const more = Array.from({ length: 3000 }, (_, i) => `(big.md:${i})`);
    let r: ReturnType<typeof checkQuotes> | undefined;
    expect(ms(() => (r = checkQuotes([...pairs, ...more].join(", "), [d])))).toBeLessThan(1000);
    expect(r!.counts["not-found"]).toBe(100);
    expect(r!.notes).toEqual([]);
  });

  it("verify_quotes: checks at most 100 quotes and says so", () => {
    const d = tmp("cap-");
    writeFileSync(join(d, "a.md"), "Some ordinary words.\n");
    const r = checkQuotes(Array.from({ length: 150 }, (_, i) => `- It says "these words ${i} are nowhere".`).join("\n"), [d]);
    expect(r.checked).toBe(100);
    expect(r.notes.join(" ")).toMatch(/first 100 quotes were checked; 50 more/);
  });

  it("scan_source: very long lines", () => {
    // Each of these took 0.4 to 7 s at 40 to 80 KB on one line.
    const d = tmp("long-");
    const lines = ["Ids: " + "1,".repeat(40000), "<p>" + "a<b ".repeat(20000), "#" + "a".repeat(80000), "where ".repeat(16000), "curl ".repeat(16000), "a:" + " ".repeat(80000) + "x"];
    writeFileSync(join(d, "data.md"), lines.join("\n") + "\n");
    expect(ms(() => scanSource(d))).toBeLessThan(1000);
  });

  it("scan_source: many lines of a few thousand characters", () => {
    const d = tmp("lines-");
    const lines = ["Ids: " + "1,".repeat(990), "<p>" + "a<b ".repeat(495), "#" + "a".repeat(1990), "where ".repeat(330), "curl ".repeat(395), "a:" + " ".repeat(1990) + "x"];
    // Four files just under the 512 KB limit per file.
    for (let f = 0; f < 4; f++) writeFileSync(join(d, `data${f}.md`), Array.from({ length: 40 }, () => lines.join("\n")).join("\n") + "\n");
    expect(ms(() => scanSource(d))).toBeLessThan(1000);
  });

  it("scan_source: still finds claims on long lines", () => {
    const d = tmp("claim-");
    writeFileSync(join(d, "a.md"), "We never store your query text, and 1,200+ teams use it. " + "x ".repeat(5000) + "\n");
    const r = scanSource(d);
    expect(r.claimCounts.data).toBe(1);
    expect(r.claimCounts.proof).toBe(1);
  });

  it("scan_source: a decision record with many blank lines and no status line", () => {
    const d = tmp("adr-");
    mkdirSync(join(d, "adr"));
    writeFileSync(join(d, "adr", "0001-x.md"), "# T\n" + "\n".repeat(32000) + "x\n");
    writeFileSync(join(d, "adr", "0002-y.md"), "# T\n## Status\n" + "\n".repeat(32000));
    writeFileSync(join(d, "adr", "0003-z.md"), "# Z\n\n  **Status**:  Accepted\n");
    let r: ReturnType<typeof scanSource> | undefined;
    expect(ms(() => (r = scanSource(d)))).toBeLessThan(1000);
    expect(r!.decisions.find((x) => x.id === "0003")?.status).toBe("Accepted");
  });

  it("check_answer: hundreds of labelled sentences", () => {
    // Every labelled sentence re-read the whole playbook corpus: 200 took about 3.5 s.
    const text = Array.from({ length: 200 }, (_, i) => `Pricing pages convert better with annual plans ${i} [practitioner].`).join(" ");
    expect(ms(() => checkAnswer(text, 10000))).toBeLessThan(1000);
  });

  it("check_answer: a labelled sentence with thousands of '['", () => {
    expect(ms(() => checkAnswer("Pricing pages convert better [practitioner] " + "[".repeat(40000), 10000))).toBeLessThan(1000);
  });
});

describe("check_answer search cache", () => {
  it("ranks like searchKnowledge over the same paragraphs", { timeout: 20000 }, () => {
    const queries = paragraphs()
      .filter((_, i) => i % 20 === 0)
      .map((p) => p.text.replace(/\[[^\]]*\]/g, " ").slice(0, 200));
    queries.push("pricing annual plans", "", "the of and", "developer docs quickstart self-selected");
    for (const q of queries) expect(searchParagraphs(q, 5)).toEqual(searchKnowledge(q, 5, paragraphs()));
  });
});
