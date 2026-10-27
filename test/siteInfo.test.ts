// Site-information links: contact, imprint, privacy, terms, about, pricing. The legal rows behind the flags are in
// research/trust-signals.md §7 (EU e-Commerce Directive Art. 5, UK reg. 6, Germany DDG § 5 and § 33, CalOPPA § 22577).
// The trust evidence for these links is self-report only, so the flags cite the law and nothing stronger.
import { describe, it, expect, afterEach, vi } from "vitest";
import { auditHtml, fetchAndAudit } from "../src/lib/pageAudit.js";

const doc = (body: string, lang = "en") => `<html lang="${lang}"><head><title>T</title></head><body><h1>H</h1>${body}</body></html>`;
const msgs = (r: { flags: Array<{ message: string }> }) => r.flags.map((f) => f.message).join("\n");

describe("siteInfo", () => {
  it("finds the links by text or path, in the footer too, and lists them", () => {
    const r = auditHtml(
      doc(`<footer><a href="/kontakt">Kontakt</a><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a><a href="/agb">AGB</a><a href="/about">About us</a><a href="/pricing">Pricing</a></footer>`, "de"),
      "https://acme.test/"
    );
    for (const k of ["contact", "imprint", "privacy", "terms", "about", "pricing"] as const) expect(r.siteInfo[k].found, k).toBe(true);
    expect(r.siteInfo.imprint.links).toEqual([{ text: "Impressum", href: "/impressum" }]);
    expect(msgs(r)).not.toMatch(/No contact|No imprint|No link containing/);
  });

  it("counts an email or phone link as a contact route", () => {
    expect(auditHtml(doc(`<a href="mailto:hi@acme.test">hi@acme.test</a>`), "https://acme.test/").siteInfo.contact.found).toBe(true);
    expect(auditHtml(doc(`<a href="tel:+15555550100">Call</a>`), "https://acme.test/").siteInfo.contact.found).toBe(true);
  });

  it("matches English, French and Spanish words, and paths", () => {
    const r = auditHtml(doc(`<a href="/legal/mentions-legales">Mentions légales</a><a href="/politica">Política de privacidad</a><a href="/x/terms-of-service">ToS</a><a href="/precios">Ver</a>`), "https://acme.test/");
    expect([r.siteInfo.imprint.found, r.siteInfo.privacy.found, r.siteInfo.terms.found, r.siteInfo.pricing.found]).toEqual([true, true, true, true]);
  });

  it("on a home page, flags a missing contact route and privacy link, citing the law, as info", () => {
    const r = auditHtml(doc(`<a href="/features">Features</a>`), "https://acme.test/");
    const contact = r.flags.find((f) => f.message.startsWith("No contact"));
    const privacy = r.flags.find((f) => f.message.startsWith("No link containing"));
    expect(contact?.severity).toBe("info");
    expect(contact?.message).toMatch(/e-Commerce Directive Art\. 5/);
    expect(contact?.message).toMatch(/Not checked: which markets/);
    expect(privacy?.severity).toBe("info");
    expect(privacy?.message).toMatch(/22577/);
    expect(privacy?.message).toMatch(/not the only one/);
  });

  it("flags a missing imprint only for a German-language page or a .de site", () => {
    expect(msgs(auditHtml(doc(""), "https://acme.test/"))).not.toMatch(/No imprint/);
    expect(msgs(auditHtml(doc("", "de"), "https://acme.test/"))).toMatch(/No imprint.*DDG § 5.*50,000/);
    expect(msgs(auditHtml(doc(""), "https://acme.de/"))).toMatch(/No imprint/);
  });

  it("reports but doesn't flag on a page that isn't the home page, or with no URL", () => {
    for (const r of [auditHtml(doc(""), "https://acme.test/pricing"), auditHtml(doc(""))]) {
      expect(r.siteInfo.contact.found).toBe(false);
      expect(msgs(r)).not.toMatch(/No contact|No imprint|No link containing/);
    }
  });

  it("never flags about or pricing", () => {
    expect(msgs(auditHtml(doc(`<a href="mailto:a@b.test">Email</a><a href="/privacy">Privacy</a>`), "https://acme.test/"))).not.toMatch(/about|pricing/i);
  });
});

describe("plain HTTP", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });
  it("warns when the page is served over http, citing Chrome's label, and not over https", async () => {
    vi.stubEnv("MARKETING_EXPERT_ALLOW_PRIVATE", "1");
    vi.stubGlobal("fetch", async () => new Response(doc(""), { headers: { "content-type": "text/html" } }));
    const plain = (await fetchAndAudit("http://f.test/")).flags.find((f) => /Not secure/.test(f.message));
    expect(plain?.severity).toBe("warning");
    expect((await fetchAndAudit("https://f.test/")).flags.some((f) => /Not secure/.test(f.message))).toBe(false);
    expect((await fetchAndAudit("http://localhost:3000/")).flags.some((f) => /Not secure/.test(f.message))).toBe(false);
  });
});
