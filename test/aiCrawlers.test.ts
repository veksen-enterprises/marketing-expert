import { describe, it, expect } from "vitest";
import { evaluateAiAccess } from "../src/lib/aiCrawlers.js";
import { parseRobotsFile, rulesFor } from "../src/lib/robots.js";

describe("robots groups", () => {
  it("named group beats *, and consecutive user-agents share a group", () => {
    const f = parseRobotsFile("User-agent: *\nDisallow: /\n\nUser-agent: GPTBot\nUser-agent: CCBot\nDisallow: /private\n");
    expect(rulesFor(f, "gptbot").disallow).toEqual(["/private"]);
    expect(rulesFor(f, "CCBot").matchedGroup).toBe("CCBot");
    expect(rulesFor(f, "PerplexityBot").matchedGroup).toBe("*");
  });
});

describe("evaluateAiAccess", () => {
  const site = "https://shop.test";
  const access = (txt: string | null, token: string) => evaluateAiAccess(txt, site).bots.find((b) => b.token === token)!;

  it("no robots.txt allows everything", () => {
    const r = evaluateAiAccess(null, site);
    expect(r.bots.every((b) => b.allowed)).toBe(true);
    expect(r.findings[0]).toMatch(/No robots.txt/);
  });
  it("blocking training only is reported as coherent", () => {
    const r = evaluateAiAccess("User-agent: GPTBot\nDisallow: /\n\nUser-agent: Google-Extended\nDisallow: /", site);
    expect(r.blockedTrainingBots.sort()).toEqual(["GPTBot", "Google-Extended"]);
    expect(r.blockedSearchBots).toEqual([]);
    expect(r.findings.join(" ")).toMatch(/coherent choice/);
    expect(access("User-agent: GPTBot\nDisallow: /", "OAI-SearchBot").allowed).toBe(true);
  });
  it("flags blocked AI search bots and blanket * blocks", () => {
    const r = evaluateAiAccess("User-agent: *\nDisallow: /\n\nUser-agent: Googlebot\nAllow: /", site);
    expect(r.blockedSearchBots).toContain("OAI-SearchBot");
    expect(r.blockedSearchBots).not.toContain("Googlebot");
    const f = r.findings.join(" ");
    expect(f).toMatch(/AI search\/answer bots are blocked/);
    expect(f).toMatch(/only by the general "User-agent: \*" group/);
  });
  it("flags blocked Googlebot as a mistake", () => {
    const r = evaluateAiAccess("User-agent: Googlebot\nDisallow: /", site);
    expect(r.findings.join(" ")).toMatch(/Almost always a mistake/);
  });
  it("checks specific paths", () => {
    const r = evaluateAiAccess("User-agent: PerplexityBot\nDisallow: /blog", site, ["/", "/blog/post"]);
    expect(r.bots.find((b) => b.token === "PerplexityBot")!.allowed).toBe(false);
  });
});
