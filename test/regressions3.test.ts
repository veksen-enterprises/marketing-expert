// Regression tests for tool bugs found in the round-2 evals (evals/grades/v2/).
import { describe, it, expect } from "vitest";
import { auditHtml } from "../src/lib/pageAudit.js";
import { crawlSite, type FetchFn } from "../src/lib/crawl.js";
import { evaluateAiAccess } from "../src/lib/aiCrawlers.js";

describe("round-2 eval regressions", () => {
  it("separates sibling links but keeps inline formatting inside a word", () => {
    // The real GameX Companion nav: was read as "[Companion]SearchIAS calculatorImbue calculator", 6 words.
    const r = auditHtml(
      `<html><body><nav><a href="/"><span>[</span><span>Companion</span><span>]</span></a><a href="/search">Search</a><a href="/ias">IAS calculator</a><a href="/imbue">Imbue calculator</a></nav><p><b>Fast</b>er</p></body></html>`
    );
    expect(r.leadText).toBe("[Companion] Search IAS calculator Imbue calculator Faster");
    expect(r.wordCount).toBe(7);
  });

  it("doesn't treat a calculator as a sign-up form or its toggles as calls to action", () => {
    const fields = Array.from({ length: 8 }, (_, i) => `<input name="f${i}">`).join("");
    const r = auditHtml(
      `<html><body><form>${fields}<button type="button" aria-pressed="true">Whirlwind + Trap</button><button type="button">Trap only</button></form></body></html>`
    );
    expect(r.forms[0].interactive).toBe(true);
    expect(r.flags.map((f) => f.message).join("\n")).not.toMatch(/Each field costs conversions/);
    expect(r.ctaCandidates).toEqual([]);
  });

  it("flags a relative og:image but not a missing og:title when <title> exists", () => {
    const r = auditHtml(`<html><head><title>T</title><meta property="og:image" content="/share.png"></head><body></body></html>`);
    const msgs = r.flags.map((f) => f.message).join("\n");
    expect(msgs).toMatch(/og:image is relative/);
    expect(msgs).not.toMatch(/og:title/);
  });

  it("crawl_site reports one client-rendered issue instead of per-page missing-h1 and thin", async () => {
    // Module scripts in <body>, as TanStack Start and similar frameworks emit them.
    const shell = `<html><head><title>x</title><link rel="modulepreload" href="/a.js"></head><body><nav><a href="/b">B</a></nav><script type="module">import("/a.js")</script></body></html>`;
    const fetchFn: FetchFn = async (url) => {
      const p = new URL(url).pathname;
      if (p === "/" || p === "/b") return new Response(shell, { status: 200, headers: { "content-type": "text/html" } });
      return new Response("", { status: 404 });
    };
    const r = await crawlSite({ startUrl: "https://shell.test/", maxPages: 5, fetchFn });
    const ids = r.issues.map((i) => i.id);
    expect(ids).toContain("client-rendered");
    expect(ids).not.toContain("missing-h1");
    expect(ids).not.toContain("thin");
  });

  it("check_ai_crawler_access: HTML pasted as robots.txt, and a missing Sitemap line", () => {
    const html = evaluateAiAccess("<!doctype html><html><body>app</body></html>", "https://x.test");
    expect(html.robotsTxtFound).toBe(false);
    expect(html.findings[0]).toMatch(/HTML page/);
    const ok = evaluateAiAccess("User-agent: *\nAllow: /", "https://x.test");
    expect(ok.findings.join("\n")).toMatch(/robots\.txt allows all listed AI bots.*says nothing about status codes/);
    expect(ok.findings.join("\n")).toMatch(/no Sitemap: line/);
  });
});
