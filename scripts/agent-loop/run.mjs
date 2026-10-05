#!/usr/bin/env node
// Live agent-loop experiment: does a coding agent call a product's MCP tool at any step of a real session?
// Each trial copies the fixture repo to a temp folder, starts one mock MCP server per catalog server
// (mock-server.mjs: real names and descriptions, no data), runs `claude -p <task>` there, and records every tool
// the agent called, in order. ROADMAP item 9: the earlier evidence came from a text list and first picks only.
//
//   node scripts/agent-loop/run.mjs --catalog <tools.json> --tasks <tasks.json> --product <server> \
//        --arm <label> --trials 4 --out <dir> [--only t1,t2] [--max-turns 12] [--model <id>]
//
// tools.json: [{ "id", "server", "name", "description" }]. Entries whose server is "builtin" are skipped (Bash, Read...).
// tasks.json: [{ "id", "text", "bestFit": [tool id, ...] }].
// Writes <out>/<arm>/<task>-<n>.json per trial and prints a summary. Catalogs and results may hold a real product's
// tool text: keep them outside the repo unless the owner agrees.
import { execFileSync, spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const opt = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith("--") ? [...acc, [a.slice(2), all[i + 1]]] : acc), [])
);
for (const k of ["catalog", "tasks", "product", "arm", "out"]) if (!opt[k]) throw new Error(`--${k} is required`);
const trials = Number(opt.trials ?? 4);
const maxTurns = String(opt["max-turns"] ?? 12);
const catalog = resolve(opt.catalog);
const tools = JSON.parse(readFileSync(catalog, "utf8"));
let tasks = JSON.parse(readFileSync(resolve(opt.tasks), "utf8"));
if (opt.only) tasks = tasks.filter((t) => opt.only.split(",").includes(t.id));

/** MCP config keys must be simple; tool calls then appear as mcp__<key>__<tool>. */
export const keyOf = (server) => server.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
const servers = [...new Set(tools.map((t) => t.server))].filter((s) => s !== "builtin");
const productKey = keyOf(opt.product);
// Tool id -> the name the agent calls it by. Built-in tools keep their own names (Bash).
const toolName = new Map(tools.map((t) => [t.id, t.server === "builtin" ? t.name : `mcp__${keyOf(t.server)}__${t.name}`]));

/** A main branch, and a feature branch (checked out) that adds a search query and a migration. */
function gitHistory(dir) {
  const git = (...a) => execFileSync("git", a, { cwd: dir, stdio: "ignore", env: { ...process.env, GIT_AUTHOR_NAME: "dev", GIT_AUTHOR_EMAIL: "dev@example.com", GIT_COMMITTER_NAME: "dev", GIT_COMMITTER_EMAIL: "dev@example.com" } });
  const branchOnly = ["drizzle/0042_orders_status.sql"];
  const orders = join(dir, "src/db/orders.ts");
  const full = readFileSync(orders, "utf8");
  const migration = readFileSync(join(dir, branchOnly[0]), "utf8");
  writeFileSync(orders, full.slice(0, full.indexOf("export async function searchOrders")));
  rmSync(join(dir, branchOnly[0]));
  git("init", "-q", "-b", "main");
  git("add", "-A");
  git("commit", "-q", "-m", "orders by customer");
  git("checkout", "-q", "-b", "feat/order-search");
  writeFileSync(orders, full);
  writeFileSync(join(dir, branchOnly[0]), migration);
  git("add", "-A");
  git("commit", "-q", "-m", "order search by status; status + created_at index");
}
if (!servers.some((s) => keyOf(s) === productKey)) throw new Error(`--product "${opt.product}" is not a server in the catalog`);

// Read-only file tools and git; no shell beyond git, no edits, no network tools.
const ALLOWED = ["Read", "Grep", "Glob", "Bash(git log:*)", "Bash(git diff:*)", "Bash(git show:*)", "Bash(git status:*)", ...servers.map((s) => `mcp__${keyOf(s)}`)];
const configDir = (() => {
  try {
    return readFileSync(join(homedir(), ".claude-active"), "utf8").trim() || undefined;
  } catch {
    return undefined;
  }
})();

function runTrial(task, n) {
  const work = mkdtempSync(join(tmpdir(), `agent-loop-${task.id}-`));
  cpSync(join(here, "fixture"), work, { recursive: true });
  gitHistory(work);
  const log = join(work, ".mock-calls.jsonl");
  const mcp = { mcpServers: Object.fromEntries(servers.map((s) => [keyOf(s), { command: process.execPath, args: [join(here, "mock-server.mjs"), catalog, s, log] }])) };
  const cfg = join(work, ".mcp-experiment.json");
  writeFileSync(cfg, JSON.stringify(mcp));
  const args = ["-p", task.text, "--output-format", "stream-json", "--verbose", "--mcp-config", cfg, "--strict-mcp-config", "--setting-sources", "project", "--no-session-persistence", "--max-turns", maxTurns, "--allowedTools", ALLOWED.join(",")];
  if (opt.model) args.push("--model", opt.model);
  return new Promise((done) => {
    const env = { ...process.env, ...(configDir ? { CLAUDE_CONFIG_DIR: configDir } : {}) };
    const child = spawn("claude", args, { cwd: work, env });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", () => {});
    const timer = setTimeout(() => child.kill("SIGTERM"), 6 * 60 * 1000);
    child.on("close", (code) => {
      clearTimeout(timer);
      const calls = [];
      let final = "";
      for (const line of out.split("\n")) {
        let ev;
        try {
          ev = JSON.parse(line);
        } catch {
          continue;
        }
        if (ev.type === "assistant") for (const c of ev.message?.content ?? []) if (c.type === "tool_use") calls.push(c.name);
        if (ev.type === "result") final = ev.result ?? "";
      }
      const mockCalls = existsSync(log) ? readFileSync(log, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)) : [];
      rmSync(work, { recursive: true, force: true });
      const isProduct = (name) => name.startsWith(`mcp__${productKey}__`);
      const best = new Set((task.bestFit ?? []).map((id) => toolName.get(id)).filter(Boolean));
      done({
        task: task.id,
        trial: n,
        arm: opt.arm,
        exitCode: code,
        calls,
        productCalled: calls.some(isProduct),
        firstProductStep: calls.findIndex(isProduct),
        firstMcp: calls.find((c) => c.startsWith("mcp__")) ?? null,
        bestFitCalled: calls.some((c) => best.has(c)),
        mockCalls: mockCalls.length,
        answerStart: final.slice(0, 400),
      });
    });
  });
}

const outDir = join(resolve(opt.out), opt.arm);
mkdirSync(outDir, { recursive: true });
const results = [];
for (const task of tasks) {
  for (let n = 1; n <= trials; n++) {
    const r = await runTrial(task, n);
    writeFileSync(join(outDir, `${task.id}-${n}.json`), JSON.stringify(r, null, 2));
    results.push(r);
    console.log(`${task.id} #${n}: product ${r.productCalled ? `called at step ${r.firstProductStep + 1}` : "not called"}; calls: ${r.calls.join(" > ") || "none"}`);
  }
}
const by = (f) => `${results.filter(f).length}/${results.length}`;
console.log(`\n${opt.arm}: product called at any step ${by((r) => r.productCalled)}; a best-fit tool called ${by((r) => r.bestFitCalled)}; no tool at all ${by((r) => r.calls.length === 0)}`);
