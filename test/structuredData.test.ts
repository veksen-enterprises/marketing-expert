// JSON-LD is checked against Google's required properties for the common rich-result types, not just listed.
import { describe, it, expect } from "vitest";
import { checkStructuredData } from "../src/lib/structuredData.js";
import { auditHtml } from "../src/lib/pageAudit.js";

const page = (...blocks: unknown[]) => `<html><head><title>T</title>${blocks.map((b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`).join("")}</head><body><h1>T</h1></body></html>`;
const errors = (blocks: unknown[]) => checkStructuredData(blocks).filter((i) => i.severity === "error").map((i) => `${i.path}: ${i.property}`);

const product = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Mug",
  offers: { "@type": "Offer", price: "12.00", priceCurrency: "CAD", availability: "https://schema.org/InStock", priceValidUntil: "2027-01-01" },
};

describe("structured data checks", () => {
  it("passes a complete Product", () => {
    expect(checkStructuredData([product])).toEqual([]);
  });
  it("flags a Product without name or any of offers, review, aggregateRating, citing Google's page", () => {
    const issues = checkStructuredData([{ "@type": "Product", description: "x" }]);
    expect(issues.map((i) => i.property)).toEqual(["name", "review | aggregateRating | offers"]);
    expect(issues.every((i) => i.source.endsWith("/product-snippet"))).toBe(true);
  });
  it("checks offers nested in a Product, and follows @id references in a @graph", () => {
    expect(errors([{ "@type": "Product", name: "Mug", offers: [{ "@type": "Offer", priceCurrency: "CAD" }] }])).toEqual(["Product > offers[0]: price | priceSpecification.price"]);
    const graph = { "@graph": [{ "@type": "Product", name: "Mug", offers: { "@id": "#o" } }, { "@id": "#o", "@type": "Offer", price: 5 }] };
    expect(errors([graph])).toEqual([]);
  });
  it("flags a BreadcrumbList with a missing item before the last one, and accepts a last item without one", () => {
    const crumbs = (items: object[]) => ({ "@type": "BreadcrumbList", itemListElement: items.map((x, i) => ({ "@type": "ListItem", position: i + 1, ...x })) });
    expect(errors([crumbs([{ name: "Home", item: "https://x.test/" }, { name: "Mugs" }])])).toEqual([]);
    expect(errors([crumbs([{ name: "Home" }, { name: "Mugs" }])])).toEqual(["BreadcrumbList > itemListElement[0]: item"]);
    expect(errors([crumbs([{ name: "Home", item: "https://x.test/" }])])).toEqual(["BreadcrumbList: itemListElement"]);
  });
  it("needs name, offers.price and a rating or review on a SoftwareApplication", () => {
    expect(errors([{ "@type": "SoftwareApplication", name: "App", offers: { price: 0 }, aggregateRating: { ratingValue: 4.5, ratingCount: 10 } }])).toEqual([]);
    expect(errors([{ "@type": "WebApplication", name: "App" }])).toEqual(["WebApplication: offers.price", "WebApplication: aggregateRating | review"]);
  });
  it("needs itemReviewed on a Review that isn't nested in what it rates", () => {
    expect(errors([{ "@type": "Review", author: { name: "A" }, reviewRating: { ratingValue: 5 } }])).toEqual(["Review: itemReviewed"]);
  });
  it("needs name and address on a LocalBusiness subtype", () => {
    expect(errors([{ "@type": "Restaurant", name: "Chez" }])).toEqual(["Restaurant: address"]);
  });
  it("reports recommended properties at info only, and FAQPage as no longer shown", () => {
    const i = checkStructuredData([{ "@type": "BlogPosting", headline: "H" }, { "@type": "FAQPage", mainEntity: [] }]);
    expect(i.map((x) => [x.type, x.severity])).toEqual([["BlogPosting", "info"], ["FAQPage", "info"]]);
    expect(i[1].message).toMatch(/2026-05-07/);
  });
  it("audit_page returns the issues and a flag", () => {
    const bad = auditHtml(page({ "@type": "Product", name: "Mug" }));
    expect(bad.structuredDataIssues).toHaveLength(1);
    expect(bad.flags.map((f) => f.message).join(" ")).toMatch(/1 required structured data/);
    const good = auditHtml(page(product));
    expect(good.structuredDataIssues).toEqual([]);
    expect(good.flags.map((f) => f.message).join(" ")).not.toMatch(/structured data/);
  });
});
