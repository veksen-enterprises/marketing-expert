#!/usr/bin/env node
// Advisor runs for evaluations: one `claude -p` advisor per case and run, each in its own temp folder with its own
// data directory, using the server built from a git ref through scripts/mcp.mjs.
//
//   node scripts/evals/run.mjs --ref <git ref> --out <runs dir> [--cases a,b] [--runs 3] [--parallel 4] [--model <id>] [--timeout-min 40]
//                              [--materials <case or prefix>=<repo dir>,...]
//
// The server is exported from <ref> into a temp folder without evals/, test/ or .git, so an advisor can't read the
// grader notes, and built there. Fictional cases use their fixture folder from evals/cases.md. A real case runs only
// with --materials: its repo's tracked files (`git ls-files`) are copied into the run's ./material, leaving out .git,
// node_modules, .env* and credential files (copyableMaterial in grades.mjs). Each run lands at <out>/<case>-<n>.md as "## Answer" plus
// "## Tool log", the shape grade.mjs reads; a run that wrote no answer is listed and left out. The profiles a run saved
// go to <out>/profiles/<case>-<n>/, so a tool's output can be reproduced from what the advisor actually saved.
import { execFileSync, spawn } from "node:child_process";
import { chmodSync, copyFileSync, cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { copyableMaterial, parseCases } from "./grades.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const opt = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) if (argv[i].startsWith("--")) opt[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
const fail = (msg) => (console.error(msg), process.exit(2));
if (!opt.ref || !opt.out) fail("usage: run.mjs --ref <git ref> --out <runs dir> [--cases a,b] [--runs 3] [--parallel 4] [--model <id>]");

const casesMd = readFileSync(join(repo, "evals/cases.md"), "utf8");
const cases = parseCases(casesMd);
// The user message is the last cell of the case's table row.
const messageOf = (id) => casesMd.split("\n").find((l) => l.startsWith(`| ${id} |`))?.split("|").at(-2).trim().replace(/^"|"$/g, "");
const materials = String(opt.materials ?? "").split(",").filter(Boolean).map((m) => m.split("="));
const repoFor = (id) => materials.find(([k]) => id === k || id.startsWith(k))?.[1];
const wanted = opt.cases ? String(opt.cases).split(",") : [...cases.keys()].filter((c) => cases.get(c).fixture);
for (const c of wanted) {
  if (!cases.has(c)) fail(`${c}: not a case id in evals/cases.md`);
  if (!cases.get(c).fixture && !repoFor(c)) fail(`${c}: a real case needs its repo: pass --materials <case or prefix>=<dir>`);
}

/** The tracked files of a real case's repo, as listed by git, minus anything copyableMaterial refuses. */
function copyRepo(dir, dest) {
  const root = resolve(dir);
  const files = execFileSync("git", ["-C", root, "ls-files", "-z"], { maxBuffer: 1 << 28 }).toString().split("\0").filter(Boolean);
  let copied = 0;
  for (const f of files.filter(copyableMaterial)) {
    const from = join(root, f);
    // ls-files lists tracked symbolic links and deleted files too; copy only regular files, so nothing outside the repo comes in.
    if (!existsSync(from) || !lstatSync(from).isFile()) continue;
    mkdirSync(dirname(join(dest, f)), { recursive: true });
    copyFileSync(from, join(dest, f));
    copied++;
  }
  return copied;
}

const server = mkdtempSync(join(tmpdir(), "eval-server-"));
execFileSync("sh", ["-c", `git -C "${repo}" archive "${opt.ref}" | tar -x -C "${server}"`]);
for (const d of ["evals", "test", ".github"]) rmSync(join(server, d), { recursive: true, force: true });
execFileSync("npm", ["ci", "--silent", "--no-audit", "--no-fund"], { cwd: server, stdio: "ignore" });
execFileSync("npm", ["run", "build", "--silent"], { cwd: server, stdio: "ignore" });
console.log(`server from ${opt.ref} built in ${server}`);

const prompt = (message) =>
  [
    `A business owner sent you this message: "${message}"`,
    `Their material is in ./material. Read only that folder and this working directory; don't open other folders on this machine, other temp folders or parent folders.`,
    `You have the marketing-expert MCP server through the command ./mcp: run \`./mcp instructions\` first and follow them, then \`./mcp tools\`, \`./mcp prompts\`, \`./mcp call <tool> '<json args>'\` and \`./mcp prompt <name> '<json args>'\` as needed. Its data directory is already set.`,
    `The owner can't answer questions during this run: where you would ask, say what you assumed and carry on, and keep the questions in your answer.`,
    `When you are done, write the answer exactly as you would send it to ./answer.md, and a log of every tool call to ./log.md: the tool, its arguments in short, and the key lines of its result, including every check_answer fingerprint.`,
  ].join("\n\n");

function runOne(caseId, n) {
  const work = mkdtempSync(join(tmpdir(), "eval-run-"));
  const fixture = cases.get(caseId).fixture;
  if (fixture) cpSync(join(repo, "evals/fixtures", fixture), join(work, "material"), { recursive: true });
  else copyRepo(repoFor(caseId), join(work, "material"));
  const data = join(work, ".data");
  mkdirSync(join(data, "profiles"), { recursive: true });
  const profile = fixture && join(repo, "evals/fixtures", `${fixture}.profile.json`);
  if (profile && existsSync(profile)) cpSync(profile, join(data, "profiles", `${fixture}.json`));
  writeFileSync(join(work, "mcp"), `#!/bin/sh\nexec node "${server}/scripts/mcp.mjs" "$@"\n`);
  chmodSync(join(work, "mcp"), 0o755);
  const args = ["-p", prompt(messageOf(caseId)), "--output-format", "text", "--no-session-persistence", "--setting-sources", "project", "--allowedTools", "Bash(./mcp:*),Read,Write,Edit,Glob,Grep"];
  if (opt.model) args.push("--model", opt.model);
  return new Promise((done) => {
    const child = spawn("claude", args, { cwd: work, env: { ...process.env, MARKETING_EXPERT_DATA_DIR: data } });
    let err = "";
    child.stdout.on("data", () => {});
    child.stderr.on("data", (d) => (err += d));
    const timer = setTimeout(() => child.kill("SIGTERM"), Number(opt["timeout-min"] ?? 40) * 60 * 1000);
    child.on("close", (code) => {
      clearTimeout(timer);
      const answer = join(work, "answer.md");
      const log = join(work, "log.md");
      let problem;
      if (!existsSync(answer)) problem = `no answer.md (exit ${code}${err ? `: ${err.trim().slice(0, 200)}` : ""})`;
      else {
        const text = `## Answer\n\n${readFileSync(answer, "utf8").trim()}\n\n## Tool log\n\n${existsSync(log) ? readFileSync(log, "utf8").trim() : "(no log written)"}\n`;
        writeFileSync(join(opt.out, `${caseId}-${n}.md`), text);
      }
      if (existsSync(join(data, "profiles"))) cpSync(join(data, "profiles"), join(opt.out, "profiles", `${caseId}-${n}`), { recursive: true });
      rmSync(work, { recursive: true, force: true });
      done({ file: `${caseId}-${n}.md`, problem });
    });
  });
}

mkdirSync(opt.out, { recursive: true });
const queue = wanted.flatMap((c) => Array.from({ length: Number(opt.runs ?? 3) }, (_, i) => [c, i + 1])).filter(([c, n]) => !existsSync(join(opt.out, `${c}-${n}.md`)));
console.log(`${queue.length} runs, ${opt.parallel ?? 4} at a time`);
const problems = [];
await Promise.all(
  Array.from({ length: Number(opt.parallel ?? 4) }, async () => {
    for (let job; (job = queue.shift()); ) {
      const r = await runOne(...job);
      console.log(`${r.file}: ${r.problem ?? "done"}`);
      if (r.problem) problems.push(r);
    }
  })
);
rmSync(server, { recursive: true, force: true });
if (problems.length) {
  console.log(`${problems.length} runs wrote no answer; rerun to retry only those.`);
  process.exitCode = 1;
}
