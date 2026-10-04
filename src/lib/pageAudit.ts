// Extracts the facts a landing-page / SEO review needs from raw HTML, so the model
// critiques what is actually on the page rather than what it imagines is there.

import { parse, HTMLElement } from "node-html-parser";

export interface PageFacts {
  url?: string;
  status?: number;
  finalUrl?: string;
  xRobotsTag?: string | null;
  lang: string | null;
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  canonical: string | null;
  robots: string | null;
  viewport: boolean;
  headings: Array<{ level: number; text: string }>;
  h1s: string[];
  openGraph: Record<string, string>;
  twitter: Record<string, string>;
  jsonLdTypes: string[];
  wordCount: number;
  images: number;
  imagesMissingAlt: number;
  links: { internal: number; external: number; nofollow: number };
  forms: Array<{ fields: number; requiredFields: number; submitText: string | null }>;
  ctaCandidates: string[];
  /** First ~600 chars of visible body text: approximates what a visitor reads first. */
  leadText: string;
  flags: Array<{ severity: "error" | "warning" | "info"; message: string }>;
}

const CTA_VERBS = /^(get|start|try|book|request|sign|join|buy|download|schedule|contact|talk|see|create|claim|subscribe|register|shop|order|add|watch|learn|explore|apply)\b/i;

function text(el: HTMLElement | null | undefined): string {
  return (el?.text ?? "").replace(/\s+/g, " ").trim();
}

export function auditHtml(html: string, url?: string): PageFacts {
  const root = parse(html, { comment: false, blockTextElements: { script: true, style: true, noscript: true } });
  const flags: PageFacts["flags"] = [];
  const meta = (sel: string) => root.querySelector(sel)?.getAttribute("content")?.trim() ?? null;

  const title = text(root.querySelector("title")) || null;
  const description = meta('meta[name="description"]');
  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null;
  const robots = meta('meta[name="robots"]');
  const lang = root.querySelector("html")?.getAttribute("lang") ?? null;

  const headings = root.querySelectorAll("h1,h2,h3").map((h) => ({ level: Number(h.tagName[1]), text: text(h) })).filter((h) => h.text);
  const h1s = headings.filter((h) => h.level === 1).map((h) => h.text);

  const og: Record<string, string> = {};
  const tw: Record<string, string> = {};
  for (const m of root.querySelectorAll("meta")) {
    const p = m.getAttribute("property") ?? m.getAttribute("name") ?? "";
    const c = m.getAttribute("content") ?? "";
    if (p.startsWith("og:")) og[p] = c;
    if (p.startsWith("twitter:")) tw[p] = c;
  }

  const jsonLdTypes: string[] = [];
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const collect = (n: unknown): void => {
        if (Array.isArray(n)) return n.forEach(collect);
        if (n && typeof n === "object") {
          const o = n as Record<string, unknown>;
          if (o["@type"]) jsonLdTypes.push(...([] as string[]).concat(o["@type"] as string));
          if (o["@graph"]) collect(o["@graph"]);
        }
      };
      collect(JSON.parse(s.text));
    } catch {
      flags.push({ severity: "warning", message: "A JSON-LD block failed to parse; search engines will ignore it." });
    }
  }

  const body = root.querySelector("body") ?? root;
  for (const el of body.querySelectorAll("script,style,noscript,svg,template")) el.remove();
  const bodyText = text(body);
  const wordCount = (bodyText.match(/\S+/g) ?? []).length;

  const imgs = body.querySelectorAll("img");
  const missingAlt = imgs.filter((i) => i.getAttribute("alt") === undefined).length;

  let host: string | null = null;
  try {
    host = url ? new URL(url).host : null;
  } catch {
    host = null;
  }
  const links = { internal: 0, external: 0, nofollow: 0 };
  for (const a of body.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href") ?? "";
    if ((a.getAttribute("rel") ?? "").includes("nofollow")) links.nofollow++;
    if (/^https?:\/\//i.test(href)) {
      try {
        if (host && new URL(href).host === host) links.internal++;
        else links.external++;
      } catch {
        links.external++;
      }
    } else if (!href.startsWith("#") && !/^(mailto|tel|javascript):/i.test(href)) links.internal++;
  }

  const forms = body.querySelectorAll("form").map((f) => {
    const fields = f.querySelectorAll("input,select,textarea").filter((i) => !["hidden", "submit", "button"].includes((i.getAttribute("type") ?? "").toLowerCase()));
    const submit = f.querySelector('button,input[type="submit"]');
    return {
      fields: fields.length,
      requiredFields: fields.filter((i) => i.hasAttribute("required")).length,
      submitText: submit ? text(submit) || submit.getAttribute("value") || null : null,
    };
  });

  const ctaSet = new Set<string>();
  for (const el of body.querySelectorAll("a,button")) {
    const t = text(el);
    if (t && t.length <= 40 && (CTA_VERBS.test(t) || el.tagName === "BUTTON" || /\b(btn|button|cta)\b/i.test(el.getAttribute("class") ?? ""))) ctaSet.add(t);
  }

  // Flags: objective, checkable problems only.
  if (!title) flags.push({ severity: "error", message: "Missing <title>." });
  else if (title.length > 60) flags.push({ severity: "info", message: `Title is ${title.length} chars; likely truncated in search results (~600px ≈ 50–60 chars).` });
  if (!description) flags.push({ severity: "warning", message: "Missing meta description; Google will pick a snippet from the page." });
  else if (description.length > 160) flags.push({ severity: "info", message: `Meta description is ${description.length} chars; likely truncated (~155 desktop, ~120 mobile).` });
  if (h1s.length === 0) flags.push({ severity: "warning", message: "No <h1>. Usually means the main promise isn't marked up as the main heading, or isn't there." });
  if (h1s.length > 1) flags.push({ severity: "info", message: `${h1s.length} <h1> elements. Not an SEO penalty, but check there is one clear primary message.` });
  if (!canonical) flags.push({ severity: "info", message: "No canonical link." });
  if (robots && /noindex/i.test(robots)) flags.push({ severity: "error", message: `meta robots="${robots}": page is excluded from search.` });
  if (!lang) flags.push({ severity: "info", message: "No lang attribute on <html>." });
  if (!root.querySelector('meta[name="viewport"]')) flags.push({ severity: "warning", message: "No viewport meta; page will render poorly on mobile." });
  if (!og["og:title"] || !og["og:image"]) flags.push({ severity: "info", message: "Incomplete Open Graph tags (og:title / og:image); shared links will render a poor preview." });
  if (imgs.length && missingAlt) flags.push({ severity: "info", message: `${missingAlt}/${imgs.length} images have no alt attribute.` });
  for (const f of forms) {
    if (f.fields > 5) flags.push({ severity: "warning", message: `Form with ${f.fields} fields. Each field costs conversions; ask only what you need for the next step.` });
    if (f.submitText && /^(submit|send)$/i.test(f.submitText)) flags.push({ severity: "info", message: `Generic submit button "${f.submitText}"; say what the visitor gets.` });
  }
  if (ctaSet.size === 0) flags.push({ severity: "warning", message: "No obvious call to action found (heuristic)." });
  if (wordCount < 50) flags.push({ severity: "info", message: `Only ${wordCount} words of server-rendered text. If the page renders client-side, crawlers and this audit see less than users do.` });

  return {
    url,
    lang,
    title,
    titleLength: title?.length ?? 0,
    metaDescription: description,
    metaDescriptionLength: description?.length ?? 0,
    canonical,
    robots,
    viewport: !!root.querySelector('meta[name="viewport"]'),
    headings: headings.slice(0, 60),
    h1s,
    openGraph: og,
    twitter: tw,
    jsonLdTypes: [...new Set(jsonLdTypes)],
    wordCount,
    images: imgs.length,
    imagesMissingAlt: missingAlt,
    links,
    forms,
    ctaCandidates: [...ctaSet].slice(0, 25),
    leadText: bodyText.slice(0, 600),
    flags,
  };
}

export async function fetchAndAudit(url: string, timeoutMs = 15000): Promise<PageFacts> {
  const u = new URL(url);
  if (!/^https?:$/.test(u.protocol)) throw new RangeError("only http(s) URLs are supported");
  const res = await fetch(u, {
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs),
    headers: { "user-agent": "Mozilla/5.0 (compatible; marketing-expert-mcp/0.1; page audit)", accept: "text/html,*/*;q=0.8" },
  });
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("html")) throw new Error(`expected HTML, got content-type "${ct}" (status ${res.status})`);
  const html = await res.text();
  const facts = auditHtml(html, res.url || url);
  facts.status = res.status;
  facts.finalUrl = res.url;
  facts.xRobotsTag = res.headers.get("x-robots-tag");
  if (res.status >= 400) facts.flags.unshift({ severity: "error", message: `HTTP ${res.status}.` });
  if (facts.xRobotsTag && /noindex/i.test(facts.xRobotsTag)) facts.flags.unshift({ severity: "error", message: `X-Robots-Tag: ${facts.xRobotsTag}` });
  if (facts.canonical && res.url && normalize(facts.canonical, res.url) !== normalize(res.url, res.url)) {
    facts.flags.push({ severity: "info", message: `Canonical (${facts.canonical}) differs from the fetched URL (${res.url}). Fine if intentional.` });
  }
  return facts;
}

function normalize(href: string, base: string): string {
  try {
    const u = new URL(href, base);
    u.hash = "";
    return u.toString().replace(/\/$/, "");
  } catch {
    return href;
  }
}
