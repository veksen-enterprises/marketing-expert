#!/usr/bin/env node
// Blind, paired grading for advisor evaluations (research/grader-reliability.md section 7, proposals 1–3).
//
//   blind        node scripts/evals/grade.mjs blind --baseline <runs dir> --candidate <runs dir> --out <batch> [--seed N] [--redact <regex>]
//   grade        node scripts/evals/grade.mjs grade --batch <batch> [--materials <case or prefix>=<dir>,...] [--parallel 3] [--model <id>]
//   compare      node scripts/evals/grade.mjs compare --batch <batch> [--json]
//   agreement    node scripts/evals/grade.mjs agreement --batch <batch> [--json]
//   double-grade node scripts/evals/grade.mjs double-grade --runs <runs dir> --out <batch> [grade options]
//
// blind copies every run of both versions into <batch>/answers/ as <case>--<id>.md, in shuffled order, with the
// round hidden, and writes the key to <batch>/key.json. grade runs one grader per answer (`claude -p`), each in
// its own temp folder holding only that answer, and saves <batch>/grades/<id>.md and <id>.errors.json. compare
// reads the key and the grades and prints the paired difference across cases. double-grade grades one round twice
// (copies under different ids, graded separately) and prints grader agreement and the run/grader variance split.
//
// Batches can hold real businesses' answers: keep them outside the repo unless the owner agrees (CLAUDE.md).
import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { answerSection, errorsOverlap, formatToolFindings, GATES, listRuns, parseCases, planBatch, readGrade, SCORED_ITEMS, toolFindings } from "./grades.mjs";
import { iccOneWay, itemAgreement, mean, pairedComparison, varianceSplit } from "./stats.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const [command, ...rest] = process.argv.slice(2);
const opt = {};
for (let i = 0; i < rest.length; i++) {
  if (!rest[i].startsWith("--")) continue;
  const k = rest[i].slice(2);
  const v = rest[i + 1] && !rest[i + 1].startsWith("--") ? rest[++i] : true;
  opt[k] = k in opt ? [].concat(opt[k], v) : v;
}
const list = (v) => [].concat(v ?? []).flatMap((x) => String(x).split(",")).filter(Boolean);
const need = (...keys) => {
  for (const k of keys) if (!opt[k] || opt[k] === true) fail(`--${k} is required`);
};
function fail(msg) {
  console.error(msg);
  process.exit(2);
}
const cases = parseCases(readFileSync(join(repo, "evals/cases.md"), "utf8"));
// Object.groupBy needs Node 21; package.json allows 20.
const groupBy = (xs, f) => xs.reduce((acc, x) => ((acc[f(x)] ??= []).push(x), acc), {});
const fmt = (x, d = 2) => (Number.isFinite(x) ? x.toFixed(d) : "n/a");
const ci = (r) => (Number.isFinite(r.ci[0]) ? `${fmt(r.ci[0])} to ${fmt(r.ci[1])}` : "n/a");
const signed = (x, d = 2) => (Number.isFinite(x) && x > 0 ? "+" : "") + fmt(x, d);

function blind(versions, out, copies) {
  if (existsSync(join(out, "key.json"))) fail(`${out} already holds a batch; use a new folder`);
  const loaded = versions.map((v) => {
    const { runs, skipped } = listRuns(v.dir, cases);
    for (const s of skipped) console.log(`skipped ${s.file}: ${s.reason}`);
    if (!runs.length) fail(`no runs found in ${v.dir}`);
    return { label: v.label, paths: [v.dir, resolve(v.dir), relative(repo, resolve(v.dir))], runs };
  });
  const patterns = list(opt.redact);
  const seed = opt.seed ? Number(opt.seed) : undefined;
  const plan = planBatch(loaded, { copies, patterns, ...(seed !== undefined ? { seed } : {}) });
  if (plan.identical.length) fail(`identical answers in both versions: ${plan.identical.map((p) => p.join(" = ")).join("; ")}`);
  mkdirSync(join(out, "answers"), { recursive: true });
  for (const f of plan.files) writeFileSync(join(out, "answers", f.name), f.text);
  writeFileSync(join(out, "key.json"), JSON.stringify({ seed: plan.seed, copies, versions: versions.map((v) => ({ label: v.label, dir: v.dir })), entries: plan.key }, null, 2) + "\n");
  for (const v of loaded) {
    const perCase = Object.entries(groupBy(v.runs, (r) => r.case)).map(([c, r]) => `${c} ${r.length}`);
    console.log(`${v.label}: ${v.runs.length} runs (${perCase.join(", ")})`);
  }
  const first = plan.key.filter((k) => k.copy === 1);
  const fp = groupBy(first, (k) => k.fingerprint);
  console.log(`check_answer fingerprint of the saved answer: ${Object.entries(fp).map(([s, ks]) => `${s} ${ks.length}`).join(", ")}.`);
  for (const k of fp.differs ?? []) console.log(`  differs: ${k.source} (the saved answer is not the text check_answer saw)`);
  const redacted = plan.key.filter((k) => k.redactions > 0).length;
  console.log(`${plan.files.length} answers in ${join(out, "answers")} (seed ${plan.seed}; ${redacted} had round names hidden). Key: ${join(out, "key.json")}. Don't give graders the key.`);
  console.log("Not hidden: differences in content, such as a tool only one version has. Check a few answers before grading.");
}

/** verify_quotes and the label check from the built server, or null before `npm run build`. */
async function checkers() {
  const dist = join(repo, "dist/lib");
  if (!existsSync(join(dist, "quoteCheck.js"))) return null;
  const { checkQuotes } = await import(join(dist, "quoteCheck.js"));
  const { checkLabels } = await import(join(dist, "labelCheck.js"));
  return { checkQuotes, checkLabels };
}

function graderPrompt(entry, answerPath, material, findings) {
  const c = cases.get(entry.case);
  const rubric = readFileSync(join(repo, "evals/rubric.md"), "utf8");
  const expectations = readFileSync(join(repo, "evals/expectations.md"), "utf8");
  const notes = expectations.match(new RegExp(`^## ${entry.case}\\b[^\\n]*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m"))?.[0];
  return [
    `Grade one advisor answer for the marketing-expert evaluations, against the rubric below and nothing else.`,
    `Case ${c.id} (${c.business}). The user's message: ${c.message}`,
    `The business's material, which the advisor could read: ${material}. Open every file the answer cites and check each claim against it.`,
    notes ? `Grader notes for this case (the advisor did not see these):\n${notes}` : "",
    `The answer: ${answerPath}. Read only that file and the material. Do not read other files in /tmp, other evaluation runs or grades.`,
    `The check_answer fingerprint was checked by script before grading; don't recompute it.`,
    `Already counted by script, the same way for every answer: quotes checked against the material and evidence brackets checked against the playbooks. Use these findings when you score item 8, but don't add them to the json; if you think one is wrong, say so in the prose. Your citation work is the rubric's who, how many and how sure step for claims in the answer's own words.\n${findings}`,
    `Print the grade as Markdown in the format the rubric's "Grade format" section gives, then the errors as one fenced json block (the rubric's "Errors as data"; [] if none). Print nothing after the json block.`,
    `--- rubric.md ---\n${rubric}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function materialFor(caseId) {
  for (const [k, dir] of list(opt.materials).map((m) => m.split("="))) if (caseId === k || caseId.startsWith(k)) return resolve(dir);
  const fixture = cases.get(caseId)?.fixture;
  if (fixture && existsSync(join(repo, "evals/fixtures", fixture))) return join(repo, "evals/fixtures", fixture);
  return undefined;
}

function runGrader(entry, answers, gradesDir, tools) {
  const material = materialFor(entry.case);
  const work = mkdtempSync(join(tmpdir(), "eval-grade-"));
  const answerPath = join(work, entry.file);
  cpSync(join(answers, entry.file), answerPath);
  const findings = formatToolFindings(toolFindings(answerSection(readFileSync(answerPath, "utf8")), material, tools));
  const cmd = opt["grader-cmd"] ?? "claude";
  const args = ["-p", graderPrompt(entry, answerPath, material, findings), "--output-format", "text", "--no-session-persistence", "--setting-sources", "project", "--allowedTools", "Read,Grep,Glob", "--add-dir", material];
  if (opt.model) args.push("--model", opt.model);
  return new Promise((done) => {
    const child = spawn(cmd, args, { cwd: work, env: process.env });
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    const timer = setTimeout(() => child.kill("SIGTERM"), Number(opt["timeout-min"] ?? 20) * 60 * 1000);
    child.on("close", (code) => {
      clearTimeout(timer);
      rmSync(work, { recursive: true, force: true });
      const json = [...out.matchAll(/```json\s*\n([\s\S]*?)```/g)].at(-1);
      let errors = null;
      try {
        errors = json ? JSON.parse(json[1]) : null;
      } catch {}
      const md = json ? out.slice(0, json.index).trimEnd() + "\n" : out;
      writeFileSync(join(gradesDir, `${entry.id}.md`), md);
      if (errors) writeFileSync(join(gradesDir, `${entry.id}.errors.json`), JSON.stringify(errors, null, 2) + "\n");
      const g = readGrade(gradesDir, entry.id);
      const problem = code !== 0 ? `grader exited ${code}: ${err.trim().slice(0, 300)}` : g.invalid ?? (errors ? undefined : "no parseable errors json block");
      done({ id: entry.id, problem });
    });
  });
}

async function grade(batch) {
  const key = JSON.parse(readFileSync(join(batch, "key.json"), "utf8"));
  const gradesDir = join(batch, "grades");
  mkdirSync(gradesDir, { recursive: true });
  const noMaterial = [...new Set(key.entries.map((e) => e.case).filter((c) => !materialFor(c)))];
  if (noMaterial.length) fail(`no material folder for ${noMaterial.join(", ")}: pass --materials <case or prefix>=<dir>`);
  const tools = await checkers();
  if (!tools) fail("the grader prompt carries verify_quotes and label-check findings: run npm run build first");
  // Only answers without a valid grade, so an interrupted batch can be resumed.
  const todo = key.entries.filter((e) => opt.regrade || readGrade(gradesDir, e.id).missing || readGrade(gradesDir, e.id).invalid);
  console.log(`grading ${todo.length} of ${key.entries.length} answers, ${opt.parallel ?? 3} at a time`);
  const queue = [...todo];
  const problems = [];
  await Promise.all(
    Array.from({ length: Number(opt.parallel ?? 3) }, async () => {
      for (let e; (e = queue.shift()); ) {
        const r = await runGrader(e, join(batch, "answers"), gradesDir, tools);
        console.log(`${e.file}: ${r.problem ?? "graded"}`);
        if (r.problem) problems.push(r);
      }
    })
  );
  if (problems.length) {
    console.log(`${problems.length} grades need a look (listed above); rerun grade to retry them.`);
    process.exitCode = 1;
  }
  return key;
}

/** Grades joined to the key. Reports, never drops silently, answers whose grade is missing or unreadable. */
function loadGraded(batch) {
  const key = JSON.parse(readFileSync(join(batch, "key.json"), "utf8"));
  const rows = [];
  const problems = [];
  for (const e of key.entries) {
    const g = readGrade(join(batch, "grades"), e.id);
    if (g.missing) problems.push(`${e.file}: no grade`);
    else if (g.invalid) problems.push(g.invalid);
    else if (g.legacy) problems.push(`${e.file}: graded with the old 10-item table`);
    else rows.push({ ...e, grade: g, answer: answerSection(readFileSync(join(batch, "answers", e.file), "utf8")) });
  }
  if (problems.length) console.log(`Left out (${problems.length}):\n  ${problems.join("\n  ")}`);
  return { key, rows };
}

async function mechanical(rows) {
  const dist = join(repo, "dist/lib");
  const tools = await checkers();
  if (!existsSync(join(dist, "answerCheck.js")) || !tools) return null;
  const { checkAnswer } = await import(join(dist, "answerCheck.js"));
  const { lintMoves } = await import(join(dist, "moveCheck.js"));
  return (r) => {
    const a = checkAnswer(r.answer);
    const f = toolFindings(r.answer, materialFor(r.case), tools);
    return { words: a.words, moveIssues: lintMoves(r.answer).issues.length, bannedWords: a.bannedWords.length, quoteProblems: f.quote ? f.quote.length : NaN, labelProblems: f.label.length };
  };
}

async function compare(batch) {
  const { key, rows } = loadGraded(batch);
  if (key.versions.length !== 2) fail("compare needs a batch made from --baseline and --candidate");
  const [base, cand] = key.versions.map((v) => v.label);
  const measures = [["total", (r) => r.grade.total], ...SCORED_ITEMS.map((n) => [`item ${n}`, (r) => r.grade.items[n]]), ...GATES.map((g) => [`${g} pass rate`, (r) => (r.grade.gates[g] === "pass" ? 1 : 0)])];
  const errorClasses = [...new Set(rows.flatMap((r) => (r.grade.errors ?? []).map((e) => e.class)))].sort();
  measures.push(["errors", (r) => (r.grade.errors ? r.grade.errors.length : NaN)], ...errorClasses.map((c) => [`errors: ${c}`, (r) => (r.grade.errors ? r.grade.errors.filter((e) => e.class === c).length : NaN)]));
  const mech = await mechanical(rows);
  if (mech) {
    for (const r of rows) r.mech = mech(r);
    measures.push(
      ["words (check_answer)", (r) => r.mech.words],
      ["move-format issues (lintMoves)", (r) => r.mech.moveIssues],
      ["quote problems (verify_quotes)", (r) => r.mech.quoteProblems],
      ["label problems (check_answer)", (r) => r.mech.labelProblems]
    );
  }
  const results = measures.map(([name, f]) => ({ name, ...pairedComparison(rows.map((r) => ({ case: r.case, version: r.version, value: f(r) })).filter((x) => Number.isFinite(x.value)), base, cand) }));
  if (opt.json) return console.log(JSON.stringify({ baseline: base, candidate: cand, results }, null, 2));
  const total = results[0];
  console.log(`Paired comparison, ${cand} minus ${base}, ${total.k} cases (cases are the unit; each case's runs are averaged first).\n`);
  console.log("| Case | Runs (base / cand) | Base mean | Cand mean | Difference |\n|---|---|---|---|---|");
  for (const c of total.cases) console.log(`| ${c.case} | ${c.baselineRuns} / ${c.candidateRuns} | ${fmt(c.baselineMean)} | ${fmt(c.candidateMean)} | ${signed(c.diff)} |`);
  for (const u of total.unpaired) console.log(`| ${u.case} | ${u.baselineRuns} / ${u.candidateRuns} | not paired: one version has no graded run | | |`);
  console.log(`\nTotal (out of ${2 * SCORED_ITEMS.length}): mean difference ${signed(total.meanDiff)}, 95% CI ${ci(total)} (t over ${total.k} cases).`);
  if (total.k < 2) console.log("One case gives no interval: grade at least two cases per version.");
  else if (total.ci[0] > 0) console.log("The interval is above zero: the candidate scored higher on these cases.");
  else if (total.ci[1] < 0) console.log("The interval is below zero: the candidate scored lower on these cases.");
  else console.log("The interval includes zero: this batch does not show a difference.");
  console.log("\n| Measure | Mean difference | 95% CI | Cases |\n|---|---|---|---|");
  for (const r of results.slice(1)) console.log(`| ${r.name} | ${signed(r.meanDiff)} | ${ci(r)} | ${r.k} |`);
  const noQuotes = [...new Set(rows.filter((r) => r.mech && !Number.isFinite(r.mech.quoteProblems)).map((r) => r.case))];
  if (noQuotes.length) console.log(`\nQuote problems not counted for ${noQuotes.join(", ")}: no material folder (pass --materials).`);
  console.log(`\nNot checked: whether graders could tell the versions apart from the content. The CI assumes cases are independent and treats them as equally weighted; a change that helps one business type and hurts another shows in the per-case rows, not in the mean. ${mech ? "" : "Word counts, move-format issues, quote problems and label problems were skipped: run npm run build first."}`);
}

function agreement(batch) {
  const { key, rows } = loadGraded(batch);
  if (key.copies < 2) fail("agreement needs a batch made with two grades per answer (double-grade, or blind --copies 2)");
  const byRun = Object.values(groupBy(rows, (r) => `${r.version}\u0000${r.source}`)).filter((g) => g.length === key.copies);
  const incomplete = Object.values(groupBy(rows, (r) => `${r.version}\u0000${r.source}`)).length - byRun.length;
  if (byRun.length < 2) fail("fewer than 2 runs have all their grades");
  const icc = iccOneWay(byRun.map((g) => g.map((r) => r.grade.total)));
  const split = varianceSplit(byRun.map((g) => ({ case: g[0].case, totals: g.map((r) => r.grade.total) })));
  const items = SCORED_ITEMS.map((n) => ({ item: n, ...itemAgreement(byRun.map((g) => [g[0].grade.items[n], g[1].grade.items[n]]), [0, 1, 2]) }));
  const gates = GATES.map((id) => ({ item: id, ...itemAgreement(byRun.map((g) => [g[0].grade.gates[id], g[1].grade.gates[id]]), ["pass", "fail"]) }));
  const withErrors = byRun.filter((g) => g[0].grade.errors && g[1].grade.errors);
  const overlaps = withErrors.map((g) => errorsOverlap(g[0].grade.errors, g[1].grade.errors));
  const both = overlaps.reduce((a, o) => a + o.both, 0);
  const union = overlaps.reduce((a, o) => a + o.union, 0);
  const result = { runs: byRun.length, incomplete, icc, split, items, gates, errors: { runs: withErrors.length, both, union, shareBoth: union ? both / union : NaN } };
  if (opt.json) return console.log(JSON.stringify(result, null, 2));
  console.log(`Grader agreement over ${byRun.length} runs, ${key.copies} grades each${incomplete ? ` (${incomplete} runs left out: not all their grades are valid)` : ""}. Using grades of copy 1 and 2 for items.\n`);
  console.log(`Totals: ICC(1) ${fmt(icc.icc)}, 95% CI ${ci(icc)}. One-way model: graders are fresh and exchangeable, so a grader's offset counts as error.`);
  console.log(`Variance of a run's total: grader ${fmt(split.grader)}, run within case ${fmt(split.run)}; grader share ${fmt(split.graderShare)} (from ${split.casesWithRepeatRuns} cases with 2+ runs).`);
  console.log(split.graderShare < 0.25 ? "Under a quarter: double-grade one run in five as a drift alarm." : split.graderShare > 0.5 ? "Over half: double-grade every run and average the grades." : "Between a quarter and a half: no rule set; see research/grader-reliability.md section 3.");
  console.log("\n| Item | Raw agreement | Gwet AC1 | Cohen kappa | Distribution |\n|---|---|---|---|---|");
  for (const r of [...items, ...gates]) console.log(`| ${r.item} | ${fmt(r.raw)} | ${fmt(r.ac1)} | ${fmt(r.kappa)} | ${Object.entries(r.distribution).map(([c, p]) => `${c}: ${fmt(p)}`).join(", ")} |`);
  console.log(`\nErrors found by both graders (same class and answer line): ${both} of ${union} (${fmt(result.errors.shareBoth)}), over ${withErrors.length} runs. Raw overlap only; with two graders it does not estimate how many errors exist.`);
  console.log("Not shown: whether the graders are right. Two graders of the same model share biases; check a sample against a different judge (research/grader-reliability.md section 7, step 5).");
}

const versionsFrom = () => {
  need("baseline", "candidate");
  return [
    { label: opt["baseline-label"] ?? "baseline", dir: opt.baseline },
    { label: opt["candidate-label"] ?? "candidate", dir: opt.candidate },
  ];
};

switch (command) {
  case "blind":
    need("out");
    blind(versionsFrom(), resolve(opt.out), Number(opt.copies ?? 1));
    break;
  case "grade":
    need("batch");
    await grade(resolve(opt.batch));
    break;
  case "compare":
    need("batch");
    await compare(resolve(opt.batch));
    break;
  case "agreement":
    need("batch");
    agreement(resolve(opt.batch));
    break;
  case "double-grade": {
    need("runs", "out");
    const out = resolve(opt.out);
    if (!existsSync(join(out, "key.json"))) blind([{ label: opt.label ?? "round", dir: opt.runs }], out, 2);
    await grade(out);
    agreement(out);
    break;
  }
  default:
    console.log(readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 17).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
    if (command && command !== "help") process.exitCode = 2;
}
