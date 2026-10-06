import { configDefaults, defineConfig } from "vitest/config";

// Agent worktrees live under .claude/worktrees/ inside the main checkout; without this, `npm test` there also runs
// every worktree's tests, some against a different version of the server.
export default defineConfig({ test: { exclude: [...configDefaults.exclude, ".claude/**"] } });
