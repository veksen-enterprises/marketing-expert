import { describe, it, expect } from "vitest";
import { loadPlaybooks, searchKnowledge, getPlaybook } from "../src/lib/knowledge.js";

describe("knowledge base", () => {
  const books = loadPlaybooks();
  it("loads every playbook with frontmatter", () => {
    expect(books.length).toBeGreaterThanOrEqual(45);
    for (const b of books) {
      expect(b.title, b.slug).not.toBe(`${b.slug}.md`);
      expect(b.summary.length, b.slug).toBeGreaterThan(20);
      expect(b.body.length, b.slug).toBeGreaterThan(1500);
    }
  });
  it("excludes underscore files", () => {
    expect(getPlaybook("_conventions")).toBeUndefined();
  });
  it("playbooks referenced by prompts and tools exist", () => {
    for (const slug of ["positioning", "experimentation", "launches-and-gtm", "metrics-and-measurement"]) {
      expect(getPlaybook(slug), slug).toBeDefined();
    }
  });
  it.each([
    ["how many visitors do I need for an a/b test", "experimentation"],
    ["open rates after apple privacy", "email-and-lifecycle"],
    ["should we use freemium or a free trial", "pricing"],
    ["brand search ads incrementality", "metrics-and-measurement"],
    ["AI overviews click through rate", "seo-and-ai-search"],
    ["competitive alternatives category", "positioning"],
    ["switch interview forces anxiety habit", "customer-research"],
    ["60/40 brand activation split", "brand-and-demand"],
    ["checkout form fields abandonment", "landing-pages-and-cro"],
    ["tam sam som bottom-up market size", "market-sizing-and-timing"],
    ["first mover pioneer advantage", "market-sizing-and-timing"],
    ["counter-positioning incumbent copy", "competing-with-incumbents"],
    ["sherlocking platform entry api access", "platform-and-feature-risk"],
    ["feature not a product dropbox", "platform-and-feature-risk"],
    ["acquihire liquidation preference waterfall", "acquisition-and-exits"],
    ["startup failure base rates survival", "startup-risk-and-opportunity"],
    ["pre-mortem kill criteria", "startup-risk-and-opportunity"],
    ["win loss interviews switching costs", "competitive-analysis"],
    ["pipeline win rate buying group mql", "b2b-saas-sales-led"],
    ["product qualified leads activation onboarding freemium", "self-serve-saas"],
    ["contribution margin returns repeat purchase shopify", "ecommerce-dtc"],
    ["marketplace cold start supply liquidity take rate", "marketplaces"],
    ["google business profile reviews local pack", "local-seo"],
    ["dentist plumber local business rebooking", "local-services"],
    ["app store optimization retention d30 paywall", "consumer-apps"],
    ["hreflang cctld subdirectory", "international-seo"],
    ["programmatic seo internal linking faceted navigation", "seo-content-and-architecture"],
    ["newsletter original research thought leadership", "content-marketing"],
    ["linkedin tiktok reddit community", "organic-social-and-community"],
    ["journalist pitch influencer disclosure ftc", "pr-and-influencers"],
    ["affiliate commission integration partner", "partnerships-and-affiliates"],
    ["referral program double-sided incentive", "referral-programs"],
    ["cold email sequence abm account tiers", "outbound-and-abm"],
    ["chatgpt perplexity recommend cite brand gptbot", "ai-assistant-visibility"],
    ["generative ai productivity synthetic personas", "ai-in-marketing"],
    ["scarcity choice overload priming replication", "behavioral-science"],
    ["cookie consent gdpr ccpa accessibility", "privacy-and-marketing-law"],
    ["how much to spend on marketing first marketing hire agency", "marketing-budget-and-team"],
    ["agency consultancy referrals retainer pitching", "professional-services"],
    ["grocery retailer slotting fees velocity shelf", "retail-cpg"],
    ["webinar trade show sponsorship", "events-and-webinars"],
    ["youtube thumbnail shorts watch time", "video-and-youtube"],
    ["loyalty program win-back click to cancel", "retention-and-expansion"],
  ])("%s → %s", (q, slug) => {
    const hits = searchKnowledge(q, 3);
    expect(hits.map((h) => h.slug)).toContain(slug);
  });
});
