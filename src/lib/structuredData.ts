// Checks JSON-LD against Google's documented required and recommended properties for the common rich-result
// types. Read from Google Search Central on 2026-10-27; each rule names its page. Google changes these: update
// CHECKED_ON when you re-read them. Only these types are checked; others are listed by audit_page and left alone.
// Microdata and RDFa are not read.

export const CHECKED_ON = "2026-10-27";
const DOCS = "https://developers.google.com/search/docs/appearance/structured-data/";

export interface StructuredDataIssue {
  type: string;
  /** Where in the JSON-LD, e.g. "Product > offers[0]". */
  path: string;
  severity: "error" | "warning" | "info";
  property: string | null;
  message: string;
  source: string;
}

/** A property, or a list meaning "at least one of these". Dotted names look inside the value. */
type Req = string | string[];
interface Rule {
  source: string;
  required: Req[];
  recommended: string[];
  /** Nested properties to check with their own rule, e.g. Product.offers with Offer. */
  nested?: Record<string, string>;
}

const RULES: Record<string, Rule> = {
  Product: {
    source: `${DOCS}product-snippet`,
    required: ["name", ["review", "aggregateRating", "offers"]],
    recommended: [],
    nested: { offers: "Offer", review: "Review", aggregateRating: "AggregateRating" },
  },
  Offer: { source: `${DOCS}product-snippet`, required: [["price", "priceSpecification.price"]], recommended: ["availability", "priceCurrency", "priceValidUntil"] },
  AggregateRating: { source: `${DOCS}review-snippet`, required: ["ratingValue", ["ratingCount", "reviewCount"]], recommended: [] },
  Review: { source: `${DOCS}review-snippet`, required: ["author", "reviewRating.ratingValue"], recommended: [] },
  Article: { source: `${DOCS}article`, required: [], recommended: ["headline", "image", "datePublished", "dateModified", "author"] },
  BreadcrumbList: { source: `${DOCS}breadcrumb`, required: ["itemListElement"], recommended: [] },
  Organization: { source: `${DOCS}organization`, required: [], recommended: ["name", "url", "logo"] },
  LocalBusiness: {
    source: `${DOCS}local-business`,
    required: ["name", "address"],
    recommended: ["telephone", "url", "openingHoursSpecification", "geo"],
    nested: { aggregateRating: "AggregateRating", review: "Review" },
  },
  SoftwareApplication: {
    source: `${DOCS}software-app`,
    required: ["name", "offers.price", ["aggregateRating", "review"]],
    recommended: ["applicationCategory", "operatingSystem"],
    nested: { aggregateRating: "AggregateRating", review: "Review" },
  },
};

// Subtypes Google documents on the same page. LocalBusiness has hundreds of subtypes on schema.org; the common ones
// are listed, and the rest are not checked.
const ALIAS: Record<string, string> = {
  NewsArticle: "Article",
  BlogPosting: "Article",
  MobileApplication: "SoftwareApplication",
  WebApplication: "SoftwareApplication",
  ...Object.fromEntries(
    ["Store", "Restaurant", "CafeOrCoffeeShop", "Bakery", "BarOrPub", "FoodEstablishment", "ProfessionalService", "HomeAndConstructionBusiness", "HealthAndBeautyBusiness", "AutomotiveBusiness", "Dentist", "MedicalBusiness", "LegalService", "FinancialService", "RealEstateAgent", "LodgingBusiness", "Hotel", "SportsActivityLocation", "ExerciseGym", "EntertainmentBusiness"].map((t) => [t, "LocalBusiness"])
  ),
  OnlineStore: "Organization",
  Corporation: "Organization",
  NGO: "Organization",
};

const FAQ_GONE = `${DOCS}faqpage`;

type Node = Record<string, unknown>;
const isNode = (v: unknown): v is Node => !!v && typeof v === "object" && !Array.isArray(v);
const types = (n: Node): string[] => ([] as unknown[]).concat(n["@type"] ?? []).filter((t): t is string => typeof t === "string").map((t) => t.replace(/^https?:\/\/schema\.org\//, ""));
const present = (v: unknown) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0);

/** Checks the parsed JSON-LD blocks of one page. */
export function checkStructuredData(blocks: unknown[]): StructuredDataIssue[] {
  const out: StructuredDataIssue[] = [];
  // Nodes in a @graph often point to each other by @id ("offers": {"@id": "#offer"}).
  const byId = new Map<string, Node>();
  const index = (v: unknown, depth = 0): void => {
    if (depth > 20) return;
    if (Array.isArray(v)) return v.forEach((x) => index(x, depth + 1));
    if (!isNode(v)) return;
    if (typeof v["@id"] === "string" && Object.keys(v).length > 1) byId.set(v["@id"], v);
    for (const x of Object.values(v)) index(x, depth + 1);
  };
  blocks.forEach((b) => index(b));
  const resolve = (v: unknown): unknown => (isNode(v) && typeof v["@id"] === "string" && Object.keys(v).length === 1 ? (byId.get(v["@id"]) ?? v) : v);
  const get = (n: Node, dotted: string): unknown => {
    let v: unknown = n;
    for (const k of dotted.split(".")) {
      v = resolve(Array.isArray(v) ? v[0] : v);
      if (!isNode(v)) return undefined;
      v = v[k];
    }
    return resolve(v);
  };

  const check = (n: Node, ruleName: string, path: string, nestedIn: string | null): void => {
    const rule = RULES[ruleName];
    const shown = types(n)[0] ?? ruleName;
    // An AggregateOffer has its own required properties (lowPrice, priceCurrency), not checked here.
    if (ruleName === "Offer" && types(n).includes("AggregateOffer")) return;
    for (const req of rule.required) {
      const alts = ([] as string[]).concat(req);
      if (alts.some((p) => present(get(n, p)))) continue;
      out.push({
        type: shown,
        path,
        severity: "error",
        property: alts.join(" | "),
        message: `${shown} lacks ${alts.length > 1 ? `all of ${alts.join(", ")} (Google requires at least one)` : `${alts[0]}, which Google requires`}. Without it the item is not eligible for a rich result.`,
        source: rule.source,
      });
    }
    // A review or rating not nested in the item it rates must say what it rates.
    if ((ruleName === "Review" || ruleName === "AggregateRating") && !nestedIn && !present(get(n, "itemReviewed"))) {
      out.push({ type: shown, path, severity: "error", property: "itemReviewed", message: `A ${shown} that is not nested in the item it rates needs itemReviewed.`, source: rule.source });
    }
    const missing = rule.recommended.filter((p) => !present(get(n, p)));
    if (missing.length) out.push({ type: shown, path, severity: "info", property: missing.join(", "), message: `${shown} lacks recommended properties: ${missing.join(", ")}. Google uses them when present; the item stays eligible without them.`, source: rule.source });
    if (ruleName === "BreadcrumbList") checkBreadcrumb(n, path, rule.source);
    for (const [prop, sub] of Object.entries(rule.nested ?? {})) {
      const v = n[prop];
      const items = Array.isArray(v) ? v : v === undefined ? [] : [v];
      items.forEach((x, i) => {
        const r = resolve(x);
        if (isNode(r)) check(r, sub, `${path} > ${prop}${Array.isArray(v) ? `[${i}]` : ""}`, shown);
      });
    }
  };

  const checkBreadcrumb = (n: Node, path: string, source: string) => {
    const list = ([] as unknown[]).concat(n.itemListElement ?? []).map(resolve).filter(isNode);
    if (list.length && list.length < 2) out.push({ type: "BreadcrumbList", path, severity: "error", property: "itemListElement", message: "A BreadcrumbList needs at least two ListItems.", source });
    list.forEach((li, i) => {
      const at = `${path} > itemListElement[${i}]`;
      const item = resolve(li.item);
      if (!present(li.position)) out.push({ type: "ListItem", path: at, severity: "error", property: "position", message: "ListItem lacks position, which Google requires.", source });
      if (!present(li.name) && !(isNode(item) && present(item.name))) out.push({ type: "ListItem", path: at, severity: "error", property: "name", message: "ListItem lacks name, which Google requires.", source });
      // The last item may leave out item: Google uses the page's own URL.
      if (i < list.length - 1 && !present(item)) out.push({ type: "ListItem", path: at, severity: "error", property: "item", message: "ListItem lacks item (the URL), which Google requires on every item but the last.", source });
    });
  };

  // Top-level nodes and @graph members are the items Google reads as rich results.
  const tops: Node[] = [];
  const collect = (v: unknown): void => {
    if (Array.isArray(v)) return v.forEach(collect);
    if (!isNode(v)) return;
    if (v["@graph"]) collect(v["@graph"]);
    if (v["@type"]) tops.push(v);
    // A WebPage often carries the item as its main entity.
    if (v.mainEntity) collect(resolve(v.mainEntity));
  };
  blocks.forEach(collect);
  for (const n of tops) {
    for (const t of types(n)) {
      if (t === "FAQPage") {
        out.push({ type: t, path: t, severity: "info", property: null, message: "Google stopped showing FAQ rich results on 2026-05-07, for all sites. The markup does no harm, but it no longer earns a rich result in Google Search.", source: FAQ_GONE });
        continue;
      }
      const rule = RULES[t] ? t : ALIAS[t];
      // An Offer on its own is not a rich result; it is checked inside its Product.
      if (!rule || rule === "Offer") continue;
      check(n, rule, t, null);
      break;
    }
  }
  return out;
}
