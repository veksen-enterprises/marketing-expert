// When Chromium can't start, render mode must say how to fix it in one line, not pass on Playwright's
// boxed install banner (seen auditing a real site without MARKETING_EXPERT_CHROMIUM set).
import { describe, it, expect, vi, afterEach } from "vitest";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { renderAndAudit } from "../src/lib/pageAudit.js";

afterEach(() => vi.unstubAllEnvs());

describe("render mode without a usable Chromium", () => {
  it("names MARKETING_EXPERT_CHROMIUM and drops the Playwright banner", async () => {
    vi.stubEnv("MARKETING_EXPERT_CHROMIUM", "");
    vi.stubEnv("PLAYWRIGHT_BROWSERS_PATH", join(tmpdir(), "marketing-expert-no-browsers"));
    const err = await renderAndAudit("https://example.com/").then(() => null, (e: Error) => e);
    expect(err).toBeInstanceOf(Error);
    expect(err!.message).toMatch(/MARKETING_EXPERT_CHROMIUM/);
    expect(err!.message).not.toMatch(/╔|<3/);
    expect(err!.message.split("\n").length).toBeLessThanOrEqual(2);
  });
  it("names the bad path when MARKETING_EXPERT_CHROMIUM points nowhere", async () => {
    vi.stubEnv("MARKETING_EXPERT_CHROMIUM", join(tmpdir(), "no-such-chromium"));
    const err = await renderAndAudit("https://example.com/").then(() => null, (e: Error) => e);
    expect(err!.message).toMatch(/no-such-chromium/);
    expect(err!.message).not.toMatch(/╔/);
  });
});
