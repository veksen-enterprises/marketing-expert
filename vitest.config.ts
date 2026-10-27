import { configDefaults, defineConfig } from "vitest/config";

// Agent worktrees live under .claude/worktrees/ inside the main checkout; without this, `npm test` there also runs
// every worktree's tests, some against a different version of the server.
// MARKETING_EXPERT_UPDATE_CHECK=0: servers started by tests don't ask GitHub whether they are current.
export default defineConfig({ test: { exclude: [...configDefaults.exclude, ".claude/**"], env: { MARKETING_EXPERT_UPDATE_CHECK: "0" } } });
