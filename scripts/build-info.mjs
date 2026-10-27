// Writes dist/build-info.json: the commit and time this copy was built. `npm run build` and `prepare` (which
// npx runs when it installs from GitHub) call it after tsc. A running server reports these, so an agent in an
// old session can tell which code it is talking to.
// Sources, in order:
// 1. `git rev-parse HEAD`: a local checkout.
// 2. .git/HEAD read as files: the Docker build. Dokploy builds from a `git clone --depth 1`; the image has no git
//    binary and .dockerignore lets only HEAD and the refs into the build context, so `git status` can't run there.
// 3. scripts/archive-commit.txt: `npx github:...` installs from GitHub's tarball, which has no .git. GitHub fills
//    the file in when it builds the tarball (export-subst in .gitattributes).
// None of these: commit is null.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const SHA = /^[0-9a-f]{40}$/;
const git = (...args) => {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
};
const read = (path) => (existsSync(path) ? readFileSync(path, "utf8").trim() : null);

function fromGitFiles() {
  const head = read(".git/HEAD");
  if (!head) return null;
  if (SHA.test(head)) return head;
  const ref = /^ref: (refs\/[\w./-]+)$/.exec(head)?.[1];
  if (!ref) return null;
  const loose = read(`.git/${ref}`);
  if (loose && SHA.test(loose)) return loose;
  const packed = (read(".git/packed-refs") ?? "").split("\n").find((l) => l.endsWith(` ${ref}`))?.split(" ")[0];
  return packed && SHA.test(packed) ? packed : null;
}

const fromGit = git("rev-parse", "HEAD");
const fromFiles = fromGit ? null : fromGitFiles();
const archived = readFileSync("scripts/archive-commit.txt", "utf8").trim();
const fromArchive = SHA.test(archived) ? archived : null;
const commit = fromGit ?? fromFiles ?? fromArchive;
// A GitHub tarball is exactly its commit; a checkout may have edits; from bare refs there's no telling.
const status = fromGit ? git("status", "--porcelain", "--untracked-files=no") : null;
const dirty = fromGit ? status !== "" : fromFiles ? null : fromArchive ? false : null;
const info = { commit, dirty, builtAt: new Date().toISOString() };
mkdirSync("dist", { recursive: true });
writeFileSync("dist/build-info.json", JSON.stringify(info, null, 2) + "\n");
console.error(`build-info: ${commit ?? "no git commit"}${dirty ? " (uncommitted changes)" : ""}`);
