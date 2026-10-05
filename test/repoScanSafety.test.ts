// Regression tests for the tools that read a local repository (scan_source, verify_quotes) and for check_answer:
// symbolic links, memory, and time on very large or hostile input. The tools run synchronously in the server,
// so a slow regex or a walk that never ends blocks every other tool call.
import { describe, it, expect, afterAll } from "vitest";
import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { scanSource } from "../src/lib/sourceScan.js";
import { checkQuotes } from "../src/lib/quoteCheck.js";
import { checkAnswer } from "../src/lib/answerCheck.js";
import { checkLabels, paragraphs, searchParagraphs } from "../src/lib/labelCheck.js";
import { searchKnowledge } from "../src/lib/knowledge.js";

// Removed after the run: some hold link loops (a -> .) that other tools walking the temp folder could follow.
const dirs: string[] = [];
const tmp = (prefix: string) => {
  const d = mkdtempSync(join(tmpdir(), prefix));
  dirs.push(d);
  return d;
};
afterAll(() => {
  for (const d of dirs) rmSync(d, { recursive: true, force: true });
});

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
    const s = scanSource(repo);
    expect(s.filesScanned).toBe(0);
    expect(s.notes.join(" ")).toMatch(/Did not follow 2 symbolic links/);
    const q = checkQuotes('Notes: "We store customer passwords in plain text" (private.md:1).', [repo]);
    expect(q.results[0].status).toBe("cited-file-missing");
    expect(q.notes.join(" ")).toMatch(/Did not follow 2 symbolic links/);
  });

  it("reads a link to a file inside the directory, under the link's own path", () => {
    // AGENTS.md -> CLAUDE.md is common. When every link was skipped, verify_quotes said a correct citation was wrong.
    const d = tmp("inlink-");
    mkdirSync(join(d, "packages", "cli"), { recursive: true });
    writeFileSync(join(d, "CLAUDE.md"), "# Guide\nWe never upload query text to any server.\n");
    symlinkSync("CLAUDE.md", join(d, "AGENTS.md"));
    symlinkSync(join("..", "..", "CLAUDE.md"), join(d, "packages", "cli", "README.md"));
    const r = checkQuotes('It says "We never upload query text to any server" (AGENTS.md:2). The CLI says "We never upload query text to any server" (packages/cli/README.md:2).', [d]);
    expect(r.results.map((x) => x.status)).toEqual(["verified", "verified"]);
    expect(r.notes).toEqual([]);
    const s = scanSource(d);
    expect(s.filesScanned).toBe(3);
    expect(s.claims.data.map((c) => c.file)).toEqual(["AGENTS.md", "CLAUDE.md", join("packages", "cli", "README.md")]);
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

  it("keeps paths relative to the outer directory when a narrower one is listed first", () => {
    // With [d/docs, d], docs/README.md was read only as "README.md", so a quote from the top README.md cited as
    // docs/README.md matched by file name and was "verified".
    const d = tmp("nested-");
    mkdirSync(join(d, "docs"));
    writeFileSync(join(d, "README.md"), "The free plan includes three projects for every team.\n");
    writeFileSync(join(d, "docs", "README.md"), "Docs intro only.\n\nRead the setup guide before you start.\n");
    const r = checkQuotes('It says "The free plan includes three projects for every team" (docs/README.md:1). The docs say "Read the setup guide before you start" (docs/README.md:3).', [join(d, "docs"), d]);
    expect(r.results.map((x) => [x.status, x.foundAt])).toEqual([
      ["other-file", ["README.md:1"]],
      ["verified", [join("docs", "README.md") + ":3"]],
    ]);
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

  it("verify_quotes: thousands of different citations in a large repository", { timeout: 30000 }, () => {
    // Each new citation was compared with every file: 5000 citations in a 4000-file repository took 2 s.
    const d = tmp("resolve-");
    for (let i = 0; i < 40; i++) mkdirSync(join(d, `p${i}`), { recursive: true });
    for (let i = 0; i < 4000; i++) writeFileSync(join(d, `p${i % 40}`, `f${i}.md`), `File ${i} has some words.\n`);
    const cites = Array.from({ length: 5000 }, (_, i) => `(x${i}.md:1)`).join(", ");
    let r: ReturnType<typeof checkQuotes> | undefined;
    expect(ms(() => (r = checkQuotes(`It says "quoted words that are nowhere here" ${cites}.`, [d])))).toBeLessThan(1000);
    expect(r!.results[0].status).toBe("cited-file-missing");
    const adrs = Array.from({ length: 9000 }, (_, i) => `ADR ${1000 + i}`).join(", ");
    expect(ms(() => (r = checkQuotes(`It says "quoted words that are nowhere here" (${adrs}).`, [d])))).toBeLessThan(1000);
    expect(r!.results[0].status).toBe("cited-file-missing");
    // Full path, end of the path, and file name only. A different folder is a different file, even with the same name.
    const status = (text: string) => checkQuotes(text, [d]).results.map((x) => x.status);
    expect(status('It says "File 7 has some words" (p7/f7.md:1). And "File 7 has some words" (f7.md:1). And "File 7 has some words" (q/f7.md:1).')).toEqual(["verified", "verified", "other-file"]);
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

  it("scan_source: lines of 500 KB", () => {
    // Every line is read in full, so each line pattern must be linear on the longest line a file can hold.
    const d = tmp("huge-");
    const n = 500000;
    const lines = ["Ids: " + "1,".repeat(n / 2), "<p>" + "a<b ".repeat(n / 4), "#" + "a".repeat(n), "where ".repeat(n / 6), "curl ".repeat(n / 5), "a:" + " ".repeat(n) + "x", 'title="'.repeat(n / 7), "$" + "1".repeat(n) + ".", "&amp".repeat(n / 4), "{".repeat(n), "'\"".repeat(n / 2), "1 ".repeat(n / 2), "| ".repeat(n / 2)];
    lines.forEach((l, i) => writeFileSync(join(d, `line${i}.md`), l + "\n"));
    expect(ms(() => scanSource(d))).toBeLessThan(1000);
  });

  it("scan_source: a long one-line <style> block, and a claim far along a line", () => {
    // Only the first 2000 characters of a line were read. The "</style>" after them was missed, so every later line of
    // the page was skipped as CSS, and the README claim at character 2450 was not seen.
    const d = tmp("style-");
    writeFileSync(join(d, "index.html"), "<head><style>" + "a{color:red}".repeat(270) + "</style></head>\n<p>We never store your credentials or connection strings.</p>\n<p>Pro plan costs $49/month for the whole team.</p>\n<p>Used by 1,200+ teams across the world.</p>\n");
    writeFileSync(join(d, "README.md"), "x ".repeat(1225) + "We never store your query text anywhere at all.\n");
    const r = scanSource(d);
    expect(r.claimCounts).toEqual({ data: 2, price: 1, availability: 0, setup: 0, proof: 1, oss: 0, access: 0 });
    expect(r.claims.data.map((c) => `${c.file}:${c.line}`)).toEqual(["README.md:1", "index.html:2"]);
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

  it("scan_source: a decision record with many '---' or 'status:' lines", { timeout: 30000 }, () => {
    // The frontmatter pattern started at every "---" line and searched to the end of the file: 4 s and 5 s.
    const d = tmp("adrfm-");
    mkdirSync(join(d, "adr"));
    writeFileSync(join(d, "adr", "0001-x.md"), "---\n".repeat(128000));
    writeFileSync(join(d, "adr", "0002-y.md"), "---\n" + "status: x\n".repeat(26000));
    writeFileSync(join(d, "adr", "0003-z.md"), "---\r\ntitle: Z\r\nstatus: accepted\r\n---\r\n# Z\r\n");
    writeFileSync(join(d, "adr", "0004-w.md"), "---\ntitle: W\n---\n# W\n\nSome text.\n\n---\n\nStatus: Rejected\n");
    let r: ReturnType<typeof scanSource> | undefined;
    expect(ms(() => (r = scanSource(d)))).toBeLessThan(1000);
    expect(r!.decisions.map((x) => x.status)).toEqual([null, "x", "accepted", "Rejected"]);
  });

  it("scan_source: a decision index row with thousands of unclosed links", { timeout: 30000 }, () => {
    // From every "[1](" with no ")" after it, the link pattern searched to the end of the row: 40,000 took 4.8 s.
    const d = tmp("adrix-");
    mkdirSync(join(d, "adr"));
    writeFileSync(join(d, "adr", "0001-x.md"), "# X\n\nStatus: Accepted\n");
    writeFileSync(join(d, "adr", "0002-y.md"), "# Y\n\nStatus: Superseded\n");
    writeFileSync(join(d, "adr", "README.md"), "| ADR | Title | Date | Status |\n| --- | --- | --- | --- |\n| 0001 | X | d | " + "[1](".repeat(40000) + " |\n| [0002](0002-y.md) | Y | d | Superseded by [3](0003-z.md) |\n");
    let r: ReturnType<typeof scanSource> | undefined;
    expect(ms(() => (r = scanSource(d)))).toBeLessThan(1000);
    expect(r!.decisions[1].indexStatus).toBe("Superseded by 3");
  });

  it("check_answer: hundreds of labelled sentences", () => {
    // Every labelled sentence re-read the whole playbook corpus: 200 took about 3.5 s.
    const text = Array.from({ length: 200 }, (_, i) => `Pricing pages convert better with annual plans ${i} [practitioner].`).join(" ");
    expect(ms(() => checkAnswer(text, 10000))).toBeLessThan(1000);
  });

  it("check_answer: hundreds of labelled sentences with different words", () => {
    // Each word's paragraph count was found by reading every paragraph, for every sentence: 500 sentences of 60
    // different words took 1.3 s.
    const chars = "bcdefghjklmnpqrsuvwxyz0123456789";
    const words = [...chars].flatMap((a) => [...chars].map((b) => a + b));
    let k = 0;
    const text = Array.from({ length: 500 }, () => Array.from({ length: 60 }, () => words[k++ % words.length]).join(" ") + " [practitioner]").join("\n");
    expect(ms(() => checkLabels(text))).toBeLessThan(300);
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
