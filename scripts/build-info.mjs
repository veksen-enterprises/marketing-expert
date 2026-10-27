// Writes dist/build-info.json: the commit and time this copy was built. `npm run build` and `prepare` (which
// npx runs when it installs from GitHub) call it after tsc. A running server reports these, so an agent in an
// old session can tell which code it is talking to.
// `npx github:...` installs from GitHub's tarball, which has no .git. GitHub fills in archive-commit.txt when it
// builds the tarball (export-subst in .gitattributes), so the commit is read from there. Neither: commit is null.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const git = (...args) => {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
};

const fromGit = git("rev-parse", "HEAD");
const archived = readFileSync("scripts/archive-commit.txt", "utf8").trim();
const fromArchive = /^[0-9a-f]{40}$/.test(archived) ? archived : null;
const commit = fromGit ?? fromArchive;
// A GitHub tarball is exactly its commit; a checkout may have edits.
const status = fromGit ? git("status", "--porcelain", "--untracked-files=no") : null;
const info = { commit, dirty: fromGit ? status !== "" : fromArchive ? false : null, builtAt: new Date().toISOString() };
mkdirSync("dist", { recursive: true });
writeFileSync("dist/build-info.json", JSON.stringify(info, null, 2) + "\n");
console.error(`build-info: ${commit ?? "no git commit"}${info.dirty ? " (uncommitted changes)" : ""}`);
