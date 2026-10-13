// A save that fails half-way through writing (full disk, crash) must leave the stored profile as it was.
import { describe, it, expect, vi } from "vitest";
import * as fs from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

vi.mock("node:fs", async (orig) => {
  const actual = await orig<typeof import("node:fs")>();
  return { ...actual, writeFileSync: vi.fn(actual.writeFileSync) };
});

const { getProfile, saveProfile } = await import("../src/lib/profile.js");

describe("profile writes (server:robustness#7)", () => {
  it("a write that fails part-way leaves the stored profile readable and unchanged", () => {
    process.env.MARKETING_EXPERT_DATA_DIR = mkdtempSync(join(tmpdir(), "me-write-"));
    saveProfile("acme", { product: "Invoicing" });
    const real = vi.mocked(fs.writeFileSync).getMockImplementation()!;
    vi.mocked(fs.writeFileSync).mockImplementationOnce((p, data) => {
      real(p, String(data).slice(0, 10));
      throw Object.assign(new Error("ENOSPC: no space left on device"), { code: "ENOSPC" });
    });
    expect(() => saveProfile("acme", { product: "Billing" })).toThrow(/ENOSPC/);
    expect(getProfile("acme")!.product).toBe("Invoicing");
  });
});
