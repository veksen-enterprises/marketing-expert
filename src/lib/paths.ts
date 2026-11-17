// Where the package's own files are (knowledge/, prompts/). Built with tsc, a module sits at dist/ or dist/lib/; in the
// plugin's bundle every module sits in bundle/. So walk up from the module to the first folder that holds knowledge/
// and package.json, instead of counting "..".

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export function packageRoot(from: string): string {
  for (let d = from; ; ) {
    if (existsSync(join(d, "knowledge")) && existsSync(join(d, "package.json"))) return d;
    const up = dirname(d);
    if (up === d) return join(from, "..", "..");
    d = up;
  }
}

export const ROOT = packageRoot(dirname(fileURLToPath(import.meta.url)));
