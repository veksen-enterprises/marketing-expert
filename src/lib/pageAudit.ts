// Extracts the facts a landing-page / SEO review needs from raw HTML, so the model
// critiques what is actually on the page rather than what it imagines is there.

import { createServer, request as httpRequest, type IncomingHttpHeaders } from "node:http";
import { connect, type AddressInfo, type NetConnectOpts, type Socket } from "node:net";
import { parse, HTMLElement } from "node-html-parser";
import { guardedFetch, assertPublicUrl, resolvePublic, readCapped, BlockedAddressError, MAX_HTML_BYTES } from "./netguard.js";
import { visibleText, elementsOf, wordCount as countWordsIn, documentTitle, robotsDirectives, robotsMetaTags } from "./text.js";

export interface PageFacts {
  url?: string;
  status?: number;
  finalUrl?: string;
  /** Redirects followed before the final response, e.g. ["307 → https://x/search"]. */
  redirectChain?: string[];
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
  forms: Array<{ interactive: boolean; fields: number; requiredFields: number; submitText: string | null }>;
  ctaCandidates: string[];
  /** First ~600 chars of visible body text: approximates what a visitor reads first. */
  leadText: string;
  flags: Array<{ severity: "error" | "warning" | "info"; message: string }>;
}

const CTA_VERBS = /^(get|start|try|book|request|sign|join|buy|download|schedule|contact|talk|see|create|claim|subscribe|register|shop|order|add|watch|learn|explore|apply)\b/i;

function text(el: HTMLElement | null | undefined, end?: number): string {
  // Plain .text glues "99" and "0.49%" into "990.49%", and sibling links into one word.
  return visibleText(el, end);
}

// Not part of the visible page; the audit doesn't count what is inside them.
const NOT_CONTENT = new Set(["script", "style", "noscript", "svg", "template"]);

/**
 * Where the text of a heading, link or button ends in `html`, as a browser would end the element: at the next
 * start or end tag of the same kind (any of h1-h6 for headings), or Infinity. Browsers close an open <a> when
 * another <a> starts, and an open heading at any heading end tag.
 */
function textEnds(html: string): (el: HTMLElement) => number {
  const at = new Map<string, number[]>();
  for (const m of html.matchAll(/<\/?(h[1-6]|a|button)(?=[\s/>])/gi)) {
    const kind = m[1].toUpperCase().replace(/^H\d$/, "H");
    if (!at.has(kind)) at.set(kind, []);
    at.get(kind)!.push(m.index);
  }
  return (el) => {
    const list = at.get(el.tagName.replace(/^H\d$/, "H")) ?? [];
    let lo = 0;
    let hi = list.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (list[mid] > el.range[0]) hi = mid;
      else lo = mid + 1;
    }
    return list[lo] ?? Infinity;
  };
}

const TOO_LARGE = "The HTML is larger than 5 MB. This audit read only the first 5 MB, so its counts are partial. HTML this large is slow to download and render.";

export function auditHtml(html: string, url?: string): PageFacts {
  const truncated = html.length > MAX_HTML_BYTES;
  try {
    const facts = readFacts(truncated ? html.slice(0, MAX_HTML_BYTES) : html, url);
    if (truncated) facts.flags.unshift({ severity: "warning", message: TOO_LARGE });
    return facts;
  } catch (e) {
    // A stack overflow on deeply nested HTML. The tree walks here use loops; this is a safety net.
    if (e instanceof RangeError) throw new Error("Could not read this HTML: elements are nested too deeply (often many unclosed tags).");
    throw e;
  }
}

function readFacts(html: string, url?: string): PageFacts {
  // parseNoneClosedTags: the default clean-up of unclosed tags takes cubic time (30 KB of "<div>" took 18 s).
  const root = parse(html, { comment: false, parseNoneClosedTags: true, blockTextElements: { script: true, style: true, noscript: true } });
  const flags: PageFacts["flags"] = [];
  // One walk of the tree instead of querySelectorAll, whose time grows with the square of the number of matches.
  const all = elementsOf(root);
  const first = (tag: string, attr?: string, value?: string) => all.find((e) => e.tagName === tag && (!attr || e.getAttribute(attr) === value)) ?? null;
  // Meta names are case-insensitive: <meta name="Description"> is the description.
  const metaTag = (name: string) => all.find((e) => e.tagName === "META" && e.getAttribute("name")?.trim().toLowerCase() === name) ?? null;
  const meta = (name: string) => metaTag(name)?.getAttribute("content")?.trim() ?? null;
  // Text of the headings, links and buttons the audit quotes. The parser ignores an end tag that doesn't close the
  // innermost open element, so in "<h1><span>X</h1>" the h1 would run to the end of the page. Ending the text where
  // a browser ends the element fixes that, and keeps the work linear when unclosed <a> tags nest thousands deep.
  const endOf = textEnds(html);
  const quote = (el: HTMLElement) => text(el, endOf(el));

  const title = text(documentTitle(root)) || null;
  const description = meta("description");
  const canonical = first("LINK", "rel", "canonical")?.getAttribute("href") ?? null;
  // Every robots and googlebot tag counts; Google obeys the most restrictive.
  const robotsTags = robotsMetaTags(all);
  const robots = robotsTags.map((t) => (t.name === "googlebot" ? `googlebot: ${t.content}` : t.content)).join(", ") || null;
  const noindexTag = robotsTags.find((t) => robotsDirectives(t.content).has("noindex"));
  const lang = first("HTML")?.getAttribute("lang") ?? null;

  const headings = all.filter((h) => /^H[1-3]$/.test(h.tagName)).map((h) => ({ level: Number(h.tagName[1]), text: quote(h) })).filter((h) => h.text);
  const h1s = headings.filter((h) => h.level === 1).map((h) => h.text);

  const og: Record<string, string> = {};
  const tw: Record<string, string> = {};
  for (const m of all.filter((e) => e.tagName === "META")) {
    const p = m.getAttribute("property") ?? m.getAttribute("name") ?? "";
    const c = m.getAttribute("content") ?? "";
    if (p.startsWith("og:")) og[p] = c;
    if (p.startsWith("twitter:")) tw[p] = c;
  }

  const jsonLdTypes: string[] = [];
  for (const s of all.filter((e) => e.tagName === "SCRIPT" && e.getAttribute("type") === "application/ld+json")) {
    try {
      const collect = (n: unknown): void => {
        if (Array.isArray(n)) return n.forEach(collect);
        if (n && typeof n === "object") {
          const o = n as Record<string, unknown>;
          if (o["@type"]) jsonLdTypes.push(...([] as string[]).concat(o["@type"] as string));
          if (o["@graph"]) collect(o["@graph"]);
        }
      };
      // The script text as served: .text would decode "&quot;", which browsers and Google leave as it is.
      collect(JSON.parse(s.rawText));
    } catch {
      flags.push({ severity: "warning", message: "A JSON-LD block failed to parse; search engines will ignore it." });
    }
  }

  const body = first("BODY") ?? root;
  const bodyText = text(body);
  const wordCount = countWordsIn(bodyText);
  const els = elementsOf(body, NOT_CONTENT);

  const imgs = els.filter((e) => e.tagName === "IMG");
  const missingAlt = imgs.filter((i) => i.getAttribute("alt") === undefined).length;

  let host: string | null = null;
  try {
    host = url ? new URL(url).host : null;
  } catch {
    host = null;
  }
  const links = { internal: 0, external: 0, nofollow: 0 };
  for (const a of els) {
    if (a.tagName !== "A" || !a.hasAttribute("href")) continue;
    const href = a.getAttribute("href") ?? "";
    if ((a.getAttribute("rel") ?? "").includes("nofollow")) links.nofollow++;
    if (/^(https?:)?\/\//i.test(href)) {
      try {
        if (host && new URL(href, url).host === host) links.internal++;
        else links.external++;
      } catch {
        links.external++;
      }
    } else if (!href.startsWith("#") && !/^(mailto|tel|javascript):/i.test(href)) links.internal++;
  }

  // Each element's form, found from its parent's in the same walk. Browsers ignore a <form> tag inside another form,
  // so its fields belong to the outer one.
  const formOf = new Map<HTMLElement, HTMLElement>();
  const formParts = new Map<HTMLElement, { fields: HTMLElement[]; submit: HTMLElement | null }>();
  for (const el of els) {
    const f = formOf.get(el.parentNode!) ?? (el.tagName === "FORM" ? el : undefined);
    if (!f) continue;
    formOf.set(el, f);
    if (f === el) {
      formParts.set(f, { fields: [], submit: null });
      continue;
    }
    const parts = formParts.get(f)!;
    const type = el.getAttribute("type");
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) && !["hidden", "submit", "button"].includes((type ?? "").toLowerCase())) parts.fields.push(el);
    // button[type="submit"], input[type="submit"], button:not([type])
    if (!parts.submit && ((/^(BUTTON|INPUT)$/.test(el.tagName) && type === "submit") || (el.tagName === "BUTTON" && type === undefined))) parts.submit = el;
  }
  const forms = [...formParts].map(([f, { fields, submit }]) => {
    return {
      // A form with no submit button and no action is usually an interactive tool (calculator, filter), not a sign-up.
      interactive: !submit && !f.getAttribute("action"),
      fields: fields.length,
      requiredFields: fields.filter((i) => i.hasAttribute("required")).length,
      submitText: submit ? quote(submit) || submit.getAttribute("value") || null : null,
    };
  });

  const ctaSet = new Set<string>();
  for (const el of els) {
    if (el.tagName !== "A" && el.tagName !== "BUTTON") continue;
    const t = quote(el);
    // Buttons that only change the page (type="button", toggles, tabs) are controls, not calls to action.
    const control = el.tagName === "BUTTON" && (el.getAttribute("type") === "button" || el.hasAttribute("aria-pressed") || el.getAttribute("role") === "tab");
    if (control && !CTA_VERBS.test(t)) continue;
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
  if (noindexTag) flags.push({ severity: "error", message: `meta ${noindexTag.name}="${noindexTag.content}": page is excluded from ${noindexTag.name === "googlebot" ? "Google Search" : "search"}.` });
  if (!lang) flags.push({ severity: "info", message: "No lang attribute on <html>." });
  if (!metaTag("viewport")) flags.push({ severity: "warning", message: "No viewport meta; page will render poorly on mobile." });
  if (!og["og:image"]) flags.push({ severity: "info", message: "No og:image; shared links show no picture (or one the platform picks)." });
  else if (!/^https?:\/\//i.test(og["og:image"])) flags.push({ severity: "warning", message: `og:image is relative (${og["og:image"]}); most link previews need an absolute URL.` });
  if (!og["og:title"] && !title) flags.push({ severity: "info", message: "No og:title or <title>; shared links have no headline." });
  if (imgs.length && missingAlt) flags.push({ severity: "info", message: `${missingAlt}/${imgs.length} images have no alt attribute.` });
  for (const f of forms) {
    if (f.interactive) continue;
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
    viewport: !!metaTag("viewport"),
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

/** audit_page's answer when it read no HTML: the URL could not be reached, or did not answer with an HTML page. */
export interface NotChecked {
  /** False when no answer came back, or the answer was an error status (often a firewall or proxy). */
  reachable: boolean;
  status: number | null;
  contentType: string | null;
  checked: false;
  reason: string;
  hint: string;
}

/** Thrown by fetchAndAudit when it read no HTML. `result` says so as data, for audit_page to return. */
export class NotCheckedError extends Error {
  constructor(readonly result: NotChecked) {
    super(result.reason);
  }
}

const BLOCKED_HINT =
  "This tool could not read the page from here: a firewall, proxy or login may block it, or the site may not be live yet. Pass the page's HTML as html= (for example a file from the repo's build output), or run scan_source on the repo.";

export async function fetchAndAudit(url: string, timeoutMs = 15000): Promise<PageFacts> {
  const u = new URL(url);
  if (!/^https?:$/.test(u.protocol)) throw new RangeError("only http(s) URLs are supported");
  let res: Response;
  try {
    res = await guardedFetch(u, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { "user-agent": "Mozilla/5.0 (compatible; marketing-expert-mcp/0.1; page audit)", accept: "text/html,*/*;q=0.8" },
    });
  } catch (e) {
    // A refused private address is this tool's rule, not an unreachable site.
    if (e instanceof BlockedAddressError) throw e;
    const why = e instanceof Error ? e.message + (e.cause instanceof Error ? ` (${e.cause.message})` : "") : String(e);
    throw new NotCheckedError({ reachable: false, status: null, contentType: null, checked: false, reason: `Could not reach ${url}: ${why}. Nothing on the page was checked.`, hint: BLOCKED_HINT });
  }
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("html")) {
    // The content type is the site's text; it stays in its own field, out of this sentence.
    throw new NotCheckedError({
      reachable: res.ok,
      status: res.status,
      contentType: ct || null,
      checked: false,
      reason: `The answer was not an HTML page (HTTP ${res.status}; see contentType). Nothing on the page was checked.`,
      hint: res.ok ? "This URL is not an HTML page, and audit_page checks only HTML pages. Audit the HTML page that links to it instead." : BLOCKED_HINT,
    });
  }
  const { text: html, truncated } = await readCapped(res, MAX_HTML_BYTES);
  const facts = auditHtml(html, res.url || url);
  if (truncated) facts.flags.unshift({ severity: "warning", message: TOO_LARGE });
  applyResponseChecks(facts, res.status, res.url || url, res.headers.get("x-robots-tag"));
  const chain = (res as Response & { redirectChain?: string[] }).redirectChain ?? [];
  if (chain.length) {
    facts.redirectChain = chain;
    facts.flags.unshift({
      severity: chain.some((c) => /^30[27] /.test(c)) ? "warning" : "info",
      message: `Redirected: ${url} ${chain.join(" ")}.${chain.some((c) => /^30[27] /.test(c)) ? " Temporary redirect (302/307): if the move is permanent, use 301/308 or serve content at the original URL." : ""}${chain.length > 1 ? " More than one hop: link straight to the final URL." : ""}`,
    });
  }
  return facts;
}

/** HTTP-level checks shared by fetch and render modes. */
function applyResponseChecks(facts: PageFacts, status: number | undefined, finalUrl: string, xRobotsTag: string | null): void {
  facts.status = status;
  facts.finalUrl = finalUrl;
  facts.xRobotsTag = xRobotsTag;
  if (status !== undefined && status >= 400) facts.flags.unshift({ severity: "error", message: `HTTP ${status}.` });
  if (xRobotsTag && robotsDirectives(xRobotsTag).has("noindex")) facts.flags.unshift({ severity: "error", message: `X-Robots-Tag: ${xRobotsTag}` });
  if (facts.canonical && normalize(facts.canonical, finalUrl) !== normalize(finalUrl, finalUrl)) {
    facts.flags.push({ severity: "info", message: `Canonical (${facts.canonical}) differs from the fetched URL (${finalUrl}). Fine if intentional.` });
  }
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

export interface RenderedAudit extends PageFacts {
  rendering: {
    serverWordCount: number;
    renderedWordCount: number;
    /** Share of rendered text that is missing from the server HTML. */
    clientOnlyShare: number;
    serverH1s: string[];
    serverHead: { title: string | null; metaDescription: string | null; canonical: string | null; robots: string | null };
    headDiff: Array<{ field: string; server: string | null; rendered: string | null }>;
  };
}

// Headers that describe one connection; a proxy does not pass them on.
const HOP_HEADERS = ["connection", "keep-alive", "proxy-connection", "proxy-authorization", "proxy-authenticate", "te", "trailer", "transfer-encoding", "upgrade"];

/**
 * A local HTTP proxy for render mode. Chromium sends every request through it: navigations, redirects,
 * subresources, workers and WebSockets. Each host is resolved once and checked with resolvePublic, and the
 * proxy connects only to those addresses, so DNS can't change in between. page.route alone is not enough:
 * Playwright never shows redirected requests to route handlers, nor WebSockets or service worker requests.
 * Refused and failed requests end as network errors in the browser, which don't say why; the reason
 * (BlockedAddressError for a refused address) is kept in `errors`, by "host:port".
 */
async function startGuardProxy(errors: Map<string, Error>): Promise<{ server: string; close: () => void }> {
  const sockets = new Set<Socket>();
  const track = (s: Socket) => {
    sockets.add(s);
    s.on("close", () => sockets.delete(s)).on("error", () => s.destroy());
    return s;
  };
  const open = async (host: string, port: number): Promise<Socket> => {
    const name = host.replace(/^\[|\]$/g, "");
    const addrs = await resolvePublic(name);
    const lookup = (_h: string, o: { all?: boolean }, cb: (...a: unknown[]) => void) => (o.all ? cb(null, addrs) : cb(null, addrs[0].address, addrs[0].family));
    return new Promise((resolve, reject) => {
      const s = connect({ host: name, port, lookup, autoSelectFamily: true } as NetConnectOpts);
      s.once("connect", () => resolve(track(s))).once("error", reject);
    });
  };
  const refuse = (e: unknown, key: string, socket: Socket) => {
    if (e instanceof Error && !errors.has(key)) errors.set(key, e);
    socket.destroy();
  };
  const server = createServer(async (req, res) => {
    let key = "";
    try {
      const target = new URL(req.url ?? "");
      if (target.protocol !== "http:") throw new Error(`not an http proxy request: ${req.url}`);
      key = hostPort(target);
      const upstream = await open(target.hostname, Number(target.port) || 80);
      const headers: IncomingHttpHeaders = { ...req.headers };
      for (const h of HOP_HEADERS) delete headers[h];
      const up = httpRequest({ method: req.method, path: target.pathname + target.search, headers: { ...headers, connection: "close" }, setHost: false, createConnection: () => upstream }, (ur) => {
        const out: IncomingHttpHeaders = { ...ur.headers };
        for (const h of HOP_HEADERS) delete out[h];
        res.writeHead(ur.statusCode ?? 502, ur.statusMessage, out);
        ur.on("error", () => res.destroy()).pipe(res);
      });
      up.on("error", () => res.destroy());
      req.on("error", () => up.destroy()).pipe(up);
    } catch (e) {
      refuse(e, key, req.socket);
    }
  });
  server.on("connection", track);
  // HTTPS and WebSockets: CONNECT host:port, then a plain byte tunnel.
  server.on("connect", async (req, client: Socket, head: Buffer) => {
    const i = (req.url ?? "").lastIndexOf(":");
    const key = `${(req.url ?? "").slice(0, i).replace(/^\[|\]$/g, "")}:${(req.url ?? "").slice(i + 1)}`;
    try {
      const upstream = await open(req.url!.slice(0, i), Number(req.url!.slice(i + 1)));
      client.write("HTTP/1.1 200 Connection Established\r\n\r\n");
      upstream.write(head);
      upstream.pipe(client).pipe(upstream);
      upstream.on("close", () => client.destroy());
      client.on("close", () => upstream.destroy());
    } catch (e) {
      refuse(e, key, client);
    }
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", () => r()));
  return {
    server: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
    close: () => {
      server.close();
      for (const s of sockets) s.destroy();
    },
  };
}

/** "host:port" of a URL, the key startGuardProxy uses for its errors. */
function hostPort(u: URL): string {
  return `${u.hostname.replace(/^\[|\]$/g, "")}:${u.port || (u.protocol === "https:" ? 443 : 80)}`;
}

/**
 * Render the page in headless Chromium (needs the optional `playwright-core` package and a Chromium
 * binary), audit the rendered DOM, and compare it with the server HTML. Content that only exists after
 * JavaScript runs is at risk with crawlers and LLM fetchers that don't execute scripts.
 */
export async function renderAndAudit(url: string, timeoutMs = 30000): Promise<RenderedAudit> {
  const u = new URL(url);
  if (!/^https?:$/.test(u.protocol)) throw new RangeError("only http(s) URLs are supported");
  let chromium: { launch: (o: object) => Promise<any> };
  try {
    ({ chromium } = await import("playwright-core"));
  } catch {
    throw new Error("render mode needs the optional dependency playwright-core: run `npm install playwright-core` and set MARKETING_EXPERT_CHROMIUM to a Chromium binary (or install one with `npx playwright-core install chromium`).");
  }
  // Every connection the browser makes goes through the guard proxy; "<-loopback>" stops Chromium from
  // sending localhost and 127.0.0.1 around it. WebRTC sends UDP, which no HTTP proxy carries, so it is turned
  // off: a page could otherwise send STUN packets to private addresses. Chrome reads the first switch, the
  // headless shell the second.
  const errors = new Map<string, Error>();
  const proxy = await startGuardProxy(errors);
  const browser = await chromium
    .launch({
      executablePath: process.env.MARKETING_EXPERT_CHROMIUM || undefined,
      headless: true,
      proxy: { server: proxy.server, bypass: "<-loopback>" },
      args: ["--webrtc-ip-handling-policy=disable_non_proxied_udp", "--force-webrtc-ip-handling-policy=disable_non_proxied_udp"],
    })
    .catch((e: unknown) => {
      proxy.close();
      throw e;
    });
  try {
    await assertPublicUrl(u);
    const page = await browser.newPage({ userAgent: "Mozilla/5.0 (compatible; marketing-expert-mcp/0.1; page audit)", serviceWorkers: "block" });
    // Where the navigation went (the URL, then each redirect).
    const navigation: string[] = [];
    page.on("request", (r: any) => {
      if (r.isNavigationRequest() && r.frame() === page.mainFrame()) navigation.push(hostPort(new URL(r.url())));
    });
    const res = await page.goto(u.toString(), { waitUntil: "load", timeout: timeoutMs }).catch((e: unknown) => {
      // A refused or failed connection reaches the browser as a vague network error. Give the reason when it was
      // the navigation's own connection, not a blocked image on a page that then timed out.
      const cause = navigation.map((h) => errors.get(h)).find((x) => x);
      throw cause instanceof BlockedAddressError ? cause : cause ? new Error(`Could not load ${url}: ${cause.message}`) : e;
    });
    // Give client-side rendering a moment; pages with beacons or polling never go fully idle.
    await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => undefined);
    const serverHtml: string = res ? await res.text() : "";
    const renderedHtml: string = await page.content();
    // The HTTP final URL, not page.url(): scripts often rewrite the address bar (filters, calculator state).
    const finalUrl: string = res?.url() ?? page.url();
    const scriptUrl: string = page.url();
    const server = auditHtml(serverHtml, finalUrl);
    const facts = auditHtml(renderedHtml, finalUrl) as RenderedAudit;
    const clientOnly = facts.wordCount > 0 ? Math.max(0, facts.wordCount - server.wordCount) / facts.wordCount : 0;
    const head = (f: PageFacts) => ({ title: f.title, metaDescription: f.metaDescription, canonical: f.canonical, robots: f.robots });
    const sh = head(server);
    const rh = head(facts);
    const headDiff = (Object.keys(sh) as Array<keyof typeof sh>).filter((k) => (sh[k] ?? null) !== (rh[k] ?? null)).map((k) => ({ field: k, server: sh[k] ?? null, rendered: rh[k] ?? null }));
    facts.rendering = { serverWordCount: server.wordCount, renderedWordCount: facts.wordCount, clientOnlyShare: clientOnly, serverH1s: server.h1s, serverHead: sh, headDiff };
    for (const d of headDiff) {
      const critical = d.field === "robots" || d.field === "canonical";
      facts.flags.unshift({
        severity: critical ? "warning" : "info",
        message: `<head> ${d.field} differs between server HTML (${JSON.stringify(d.server)}) and the rendered page (${JSON.stringify(d.rendered)}). Crawlers that don't run JavaScript only see the server value${critical ? "; Google may act on the server value before rendering. Put robots and canonical tags in the server HTML" : ""}.`,
      });
    }
    // The "few words" flag is about server HTML; drop it from the rendered audit and judge the gap instead.
    facts.flags = facts.flags.filter((f) => !f.message.includes("words of server-rendered text"));
    if (clientOnly > 0.3) {
      facts.flags.unshift({
        severity: "warning",
        message: `${(clientOnly * 100).toFixed(0)}% of the page text only appears after JavaScript runs (server HTML: ${server.wordCount} words; rendered: ${facts.wordCount}). Crawlers and AI fetchers that don't run scripts see much less. Server-render the main content.`,
      });
    }
    if (facts.h1s.length && server.h1s.length === 0) {
      facts.flags.unshift({ severity: "warning", message: "The <h1> exists only after JavaScript runs." });
    }
    applyResponseChecks(facts, res?.status(), finalUrl, res ? ((await res.allHeaders())["x-robots-tag"] ?? null) : null);
    facts.url = url;
    if (scriptUrl !== finalUrl) {
      facts.flags.push({ severity: "info", message: `Scripts changed the address to ${scriptUrl} after load. If people share that URL, give it a canonical pointing at the clean one.` });
    }
    const blocked = [...new Set([...errors.values()].filter((e) => e instanceof BlockedAddressError).map((e) => e.message))];
    if (blocked.length) {
      facts.flags.push({ severity: "info", message: `The page tried to reach private or local network addresses, which this tool blocks (${blocked.slice(0, 3).join("; ")}). The rendered page may be missing what those requests would have loaded.` });
    }
    return facts;
  } finally {
    await browser.close();
    proxy.close();
  }
}
