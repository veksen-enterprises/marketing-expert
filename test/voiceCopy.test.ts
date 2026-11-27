// analyze_copy against a business's saved voice. The profile stored voice {do, dont} from the start, but no tool
// read it; in the 2026-10-28 real-case eval none of the 36 runs saved one.
import { describe, it, expect, beforeAll } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

beforeAll(() => {
  process.env.MARKETING_EXPERT_DATA_DIR = mkdtempSync(join(tmpdir(), "me-voice-"));
});

async function call(name: string, args: Record<string, unknown>) {
  const { createServer } = await import("../src/server.js");
  const [a, b] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "t", version: "0" });
  await Promise.all([createServer().connect(a), client.connect(b)]);
  const r = await client.callTool({ name, arguments: args });
  const text = (r.content as Array<{ text: string }>)[0].text;
  return { isError: r.isError, text, json: r.isError ? null : JSON.parse(text) };
}

const voiceFlags = (json: { flags: Array<{ type: string; message: string }> }) => json.flags.filter((f) => f.type === "voice").map((f) => f.message);

describe("analyze_copy with a voice", () => {
  it("checks a voice saved through save_business_profile", async () => {
    const saved = await call("save_business_profile", { name: "studio", voice: { dont: ["cheap"], prefer: { client: "partner" }, do: ["warm, never salesy"] } });
    expect(saved.isError).toBeFalsy();
    const r = await call("analyze_copy", { text: "Cheap logos for clients.", profile: "studio" });
    expect(voiceFlags(r.json)).toHaveLength(2);
    expect(r.json.voice.notChecked.join()).toMatch(/warm, never salesy/);
  });
  it("lets an inline voice replace the profile's keys for this call", async () => {
    const r = await call("analyze_copy", { text: "Cheap logos for clients.", profile: "studio", voice: { prefer: { logo: "brand mark" } } });
    const msgs = voiceFlags(r.json).join("\n");
    expect(msgs).toMatch(/cheap/);
    expect(msgs).toMatch(/logo/);
    expect(msgs).not.toMatch(/client/);
  });
  it("checks an inline voice with no saved profile", async () => {
    const r = await call("analyze_copy", { text: "Invite your users.", voice: { prefer: { user: "team" } } });
    expect(voiceFlags(r.json)[0]).toMatch(/"user" ×1.*"team"/);
  });
  it("says so when the profile has no voice, and fails on an unknown profile", async () => {
    await call("save_business_profile", { name: "plain", product: "an invoicing tool" });
    const r = await call("analyze_copy", { text: "Invite your users.", profile: "plain" });
    expect(r.json.voice.note).toMatch(/no voice saved, so nothing was checked/);
    const missing = await call("analyze_copy", { text: "x", profile: "nope" });
    expect(missing.isError).toBe(true);
    expect(missing.text).toMatch(/no business profile named "nope"/);
  });
});
