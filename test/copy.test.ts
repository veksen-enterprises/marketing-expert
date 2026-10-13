import { describe, it, expect } from "vitest";
import { analyzeCopy, checkLimits, countSyllables } from "../src/lib/copy.js";
import { countChars, PLATFORM_LIMITS } from "../src/lib/platformLimits.js";
import { buildUtm } from "../src/lib/utm.js";

describe("copy analysis", () => {
  it("flags hype and writer-centric framing", () => {
    const r = analyzeCopy("We built a revolutionary, seamless platform. Our team leverages cutting-edge AI. We are the best. Our mission is our customers.");
    const msgs = r.flags.map((f) => f.message).join("\n");
    expect(msgs).toMatch(/revolutionary/);
    expect(msgs).toMatch(/seamless/);
    expect(msgs).toMatch(/cutting-edge/);
    expect(msgs).toMatch(/leverage/);
    expect(r.flags.some((f) => f.type === "framing")).toBe(true);
  });
  it("does not flag substrings", () => {
    const r = analyzeCopy("Misleading breakfast reports.");
    expect(r.flags.filter((f) => f.type === "vague")).toHaveLength(0);
  });
  it("readability is sane", () => {
    const easy = analyzeCopy("Send the file. Get paid. It takes two minutes.").readability;
    const hard = analyzeCopy("Organizational transformation initiatives necessitate comprehensive stakeholder alignment methodologies.").readability;
    expect(easy.fleschReadingEase).toBeGreaterThan(hard.fleschReadingEase);
    expect(countSyllables("table")).toBe(2);
    expect(countSyllables("cat")).toBe(1);
  });
});

describe("limits", () => {
  it("counts CJK double and X links as 23", () => {
    expect(countChars("日本語", "cjk-double")).toBe(6);
    expect(countChars("abc", "cjk-double")).toBe(3);
    expect(countChars("see https://example.com/a/very/long/path/that/goes/on", "x-links-23")).toBe(4 + 23);
  });
  it("checks google rsa", () => {
    const r = checkLimits("google_rsa", { headline: ["Short headline", "This headline is definitely way too long"] });
    expect(r.checks.map((c) => c.status)).toEqual(["ok", "over_max"]);
  });
  it("unverified limits never hard-fail", () => {
    PLATFORM_LIMITS.__test = { label: "test", counting: "plain", source: "", fields: { text: { max: 10, verified: false } } };
    try {
      expect(checkLimits("__test", { text: "x".repeat(11) }).checks[0].status).toBe("unverified_limit");
    } finally {
      delete PLATFORM_LIMITS.__test;
    }
  });
  it("LinkedIn intro text allows 3,000 characters", () => {
    expect(checkLimits("linkedin_single_image", { intro_text: "x".repeat(700) }).checks[0].status).toBe("over_recommended");
    expect(checkLimits("linkedin_single_image", { intro_text: "x".repeat(3001) }).checks[0].status).toBe("over_max");
  });
  it("counts Apple's keyword field in UTF-8 bytes and other App Store fields in characters", () => {
    const ja = "瞑想,睡眠,集中,習慣,タイマー,ポモドーロ,勉強,記録,呼吸法,リラックス"; // 38 characters, 96 bytes: fits
    const k = checkLimits("app_store", { keywords: ja }).checks[0];
    expect(k).toMatchObject({ length: 96, unit: "bytes", status: "ok" });
    expect(checkLimits("app_store", { keywords: ja + ",瞑想アプリ" }).checks[0]).toMatchObject({ length: 112, status: "over_max" });
    expect(checkLimits("app_store", { keywords: "focus,timer,pomodoro" }).checks[0]).toMatchObject({ length: 20, status: "ok" });
    const sub = checkLimits("app_store", { subtitle: "集中タイマーと勉強記録" }).checks[0];
    expect(sub).toMatchObject({ length: 11, status: "ok" });
    expect(sub.unit).toBeUndefined();
  });
  it("Google Play counts full-width characters as 1", () => {
    expect(checkLimits("google_play", { short_description: "あ".repeat(80) }).checks[0].status).toBe("ok");
    expect(checkLimits("google_play", { title: "x".repeat(31) }).checks[0].status).toBe("over_max");
  });
  it("rejects unknown field", () => {
    expect(() => checkLimits("google_rsa", { nope: "x" })).toThrow(/Known/);
  });
});

describe("utm", () => {
  it("normalises and warns", () => {
    const r = buildUtm({ url: "https://ex.com/p?a=1#h", source: "Newsletter", medium: "Email", campaign: "spring sale" });
    expect(r.url).toBe("https://ex.com/p?a=1&utm_source=newsletter&utm_medium=email&utm_campaign=spring-sale#h");
    expect(r.warnings.length).toBeGreaterThanOrEqual(2);
  });
  it("flags source used as medium", () => {
    const r = buildUtm({ url: "https://ex.com", source: "fb", medium: "facebook", campaign: "x" });
    expect(r.warnings.join(" ")).toMatch(/looks like a source/);
  });
});
