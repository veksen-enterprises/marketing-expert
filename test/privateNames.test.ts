// docs/adr/0001: business data stays out of the repo. The names to keep out live in .private-names (one per line,
// a regex or plain text; lines starting with # are comments). That file is git-ignored, so the list itself is never
// published, and this test skips where it doesn't exist.
import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const LIST = ".private-names";
const patterns = existsSync(LIST)
  ? readFileSync(LIST, "utf8")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"))
  : [];

describe.skipIf(patterns.length === 0)("no private business names in tracked files", () => {
  it("the list itself is not tracked", () => {
    expect(execFileSync("git", ["ls-files", LIST], { encoding: "utf8" }).trim()).toBe("");
  });
  it("no tracked file contains a listed name", () => {
    const res = patterns.map((p) => new RegExp(p, "i"));
    const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
    const hits: string[] = [];
    for (const f of files) {
      if (!existsSync(f) || /\.(png|jpe?g|gif|ico|pdf|woff2?)$/i.test(f)) continue;
      const text = readFileSync(f, "utf8");
      for (const re of res) if (re.test(text) || re.test(f)) hits.push(`${f}: ${re.source}`);
    }
    expect(hits).toEqual([]);
  });
});
