import { describe, it, expect } from "vitest";
import { auditHtml } from "../src/lib/pageAudit.js";

const html = `<!doctype html><html lang="en"><head>
<title>Acme Invoicing — Get paid 2x faster</title>
<meta name="description" content="Send invoices in two minutes.">
<meta name="viewport" content="width=device-width">
<link rel="canonical" href="https://acme.test/">
<meta property="og:title" content="Acme">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization"},{"@type":"SoftwareApplication"}]}</script>
<script>var tracking = "should not count";</script>
</head><body>
<h1>Get paid twice as fast</h1><h2>How it works</h2>
<p>Acme sends reminders so you don't have to.</p>
<img src="a.png"><img src="b.png" alt="">
<a href="/pricing">Pricing</a> <a href="https://other.test">Partner</a>
<a class="btn" href="/signup">Start free trial</a>
<form><input name="email" required><input name="name"><input type="hidden" name="x"><button>Submit</button></form>
</body></html>`;

describe("auditHtml", () => {
  const r = auditHtml(html, "https://acme.test/");
  it("extracts basics", () => {
    expect(r.title).toMatch(/Acme/);
    expect(r.h1s).toEqual(["Get paid twice as fast"]);
    expect(r.canonical).toBe("https://acme.test/");
    expect(r.jsonLdTypes).toEqual(["Organization", "SoftwareApplication"]);
    expect(r.lang).toBe("en");
    expect(r.leadText).not.toMatch(/tracking/);
  });
  it("counts links, images, forms, CTAs", () => {
    expect(r.links).toEqual({ internal: 2, external: 1, nofollow: 0 });
    expect(r.images).toBe(2);
    expect(r.imagesMissingAlt).toBe(1);
    expect(r.forms).toEqual([{ interactive: false, fields: 2, requiredFields: 1, submitText: "Submit" }]);
    expect(r.ctaCandidates).toContain("Start free trial");
  });
  it("flags generic submit and missing og:image", () => {
    const msgs = r.flags.map((f) => f.message).join("\n");
    expect(msgs).toMatch(/Generic submit/);
    expect(msgs).toMatch(/No og:image/);
  });
  it("flags noindex and missing title", () => {
    const bad = auditHtml(`<html><head><meta name="robots" content="noindex"></head><body></body></html>`);
    expect(bad.flags.filter((f) => f.severity === "error").length).toBe(2);
  });
});

describe("text extraction", () => {
  it("separates block elements", () => {
    const r = auditHtml("<html><body><h1>affix level 99</h1><p>0.49%</p></body></html>");
    expect(r.wordCount).toBe(4);
    expect(r.leadText).toBe("affix level 99 0.49%");
  });
});

