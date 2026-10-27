// leadText approximates what a visitor reads first. It used to be the first 600 characters of body text, so on
// most home pages it began with the menu ("Home Products Pricing Log in"). Research: research/first-screen.md
// (about a third of home pages have no header or nav landmark, so the h1 is the anchor) and
// research/home-page-vs-landing-page.md.
import { describe, it, expect } from "vitest";
import { auditHtml } from "../src/lib/pageAudit.js";

const page = (body: string, url?: string) => auditHtml(`<html><head><title>T</title></head><body>${body}</body></html>`, url);

describe("leadText", () => {
  it("starts at the h1, so the logo and menu before it are left out", () => {
    const r = page(`<header><a href="/">Acme</a><nav><a href="/p">Products</a><a href="/pricing">Pricing</a></nav><a href="/login">Log in</a></header><main><h1>Get paid twice as fast</h1><p>Invoices in two minutes.</p></main>`);
    expect(r.leadText).toBe("Get paid twice as fast Invoices in two minutes.");
    expect(r.leadTextSource).toMatch(/^from the first h1/);
  });

  it("starts at the h1 even with no header or nav markup", () => {
    const r = page(`<div class="top"><a href="/">Home</a><a href="/blog">Blog</a></div><div><h1>Plan meals</h1><p>For busy parents.</p></div>`);
    expect(r.leadText).toBe("Plan meals For busy parents.");
  });

  it("skips a menu or a cookie notice that comes after the h1", () => {
    const r = page(`<h1>Plan meals</h1><nav><a href="/a">About</a></nav><p>For busy parents.</p><div id="onetrust-banner-sdk"><p>We use cookies.</p><button>Accept</button></div><div class="cookie-consent">Cookies help us</div>`);
    expect(r.leadText).toBe("Plan meals For busy parents.");
  });

  it("keeps a menu that holds the h1", () => {
    const r = page(`<nav><h1>Acme</h1><a href="/p">Products</a></nav><p>Body</p>`);
    expect(r.leadText).toBe("Acme Products Body");
  });

  it("without an h1, skips menus, skip links, a header and cookie notices, and says so", () => {
    const r = page(`<a href="#main">Skip to content</a><header><a href="/">Acme</a><span>Call us</span></header><nav><a href="/p">Products</a></nav><div id="CybotCookiebotDialog">We use cookies</div><p>Hello there</p>`);
    expect(r.leadText).toBe("Hello there");
    expect(r.leadTextSource).toMatch(/^no h1; skipped menu, header or cookie-notice markup/);
  });

  it("without an h1 or any such markup, takes the body from the start and warns that menu text may be in it", () => {
    const r = page(`<div><a href="/">Home</a><a href="/blog">Blog</a></div><p>Hello</p>`);
    expect(r.leadText).toBe("Home Blog Hello");
    expect(r.leadTextSource).toMatch(/^no h1 and no menu, header or cookie-notice markup.*may include menu/);
  });

  it("ignores an empty h1", () => {
    const r = page(`<nav><a href="/">Home</a></nav><h1><img src="logo.png"></h1><p>Hello</p>`);
    expect(r.leadText).toBe("Hello");
  });

  it("is capped at 600 characters", () => {
    const r = page(`<h1>H</h1><p>${"word ".repeat(300)}</p>`);
    expect(r.leadText.length).toBeLessThanOrEqual(600);
  });
});

describe("navLabels", () => {
  it("lists links and buttons in menus and the header, with the accessible name when there is no text", () => {
    const r = page(`<header><a href="/"><img src="l.png" alt="Acme home"></a><button aria-label="Open menu"></button><nav><a href="/pricing">Pricing</a><a href="/docs"> Docs </a></nav></header><div role="navigation"><a href="/blog">Blog</a></div><main><a href="/signup">Sign up</a></main>`);
    expect(r.navLabels).toEqual({
      labels: [
        { text: "Acme home", href: "/" },
        { text: "Open menu", href: null },
        { text: "Pricing", href: "/pricing" },
        { text: "Docs", href: "/docs" },
        { text: "Blog", href: "/blog" },
      ],
      truncated: false,
    });
  });

  it("stops at 30 and says so", () => {
    const links = Array.from({ length: 35 }, (_, i) => `<a href="/p${i}">P${i}</a>`).join("");
    const r = page(`<nav>${links}</nav>`);
    expect(r.navLabels.labels).toHaveLength(30);
    expect(r.navLabels.truncated).toBe(true);
  });
});

describe("pageKind", () => {
  it("is home for the root path and a language root, other for a deeper path, null without a URL", () => {
    expect(page("", "https://acme.test/").pageKind).toBe("home");
    expect(page("", "https://acme.test/index.html").pageKind).toBe("home");
    expect(page("", "https://acme.test/en/").pageKind).toBe("home");
    expect(page("", "https://acme.test/fr-ca").pageKind).toBe("home");
    expect(page("", "https://acme.test/pricing").pageKind).toBe("other");
    expect(page("", "https://acme.test/en/pricing").pageKind).toBe("other");
    expect(page("", "https://acme.test/go").pageKind).toBe("other");
    expect(page("").pageKind).toBeNull();
  });
});
