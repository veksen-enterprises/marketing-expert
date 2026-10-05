// Extracts the facts a landing-page / SEO review needs from raw HTML, so the model
// critiques what is actually on the page rather than what it imagines is there.

import { createServer, request as httpRequest, type IncomingHttpHeaders } from "node:http";
import { connect, type AddressInfo, type NetConnectOpts, type Socket } from "node:net";
import { parse, HTMLElement } from "node-html-parser";
import { guardedFetch, assertPublicUrl, resolvePublic, readCapped, BlockedAddressError, MAX_HTML_BYTES } from "./netguard.js";
import { visibleText } from "./text.js";

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

function text(el: HTMLElement | null | undefined): string {
  // Plain .text glues "99" and "0.49%" into "990.49%", and sibling links into one word.
  return visibleText(el);
}

const TOO_LARGE = "The HTML is larger than 5 MB. This audit read only the first 5 MB, so its counts are partial. HTML this large is slow to download and render.";

export function auditHtml(html: string, url?: string): PageFacts {
  const truncated = html.length > MAX_HTML_BYTES;
  try {
    const facts = readFacts(truncated ? html.slice(0, MAX_HTML_BYTES) : html, url);
    if (truncated) facts.flags.unshift({ severity: "warning", message: TOO_LARGE });
    return facts;
  } catch (e) {
    // node-html-parser's selector code recurses once per level of nesting.
    if (e instanceof RangeError) throw new Error("Could not read this HTML: elements are nested too deeply (often many unclosed tags).");
    throw e;
  }
}

function readFacts(html: string, url?: string): PageFacts {
  // parseNoneClosedTags: the default clean-up of unclosed tags takes cubic time (30 KB of "<div>" took 18 s).
  const root = parse(html, { comment: false, parseNoneClosedTags: true, blockTextElements: { script: true, style: true, noscript: true } });
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
    if (/^(https?:)?\/\//i.test(href)) {
      try {
        if (host && new URL(href, url).host === host) links.internal++;
        else links.external++;
      } catch {
        links.external++;
      }
    } else if (!href.startsWith("#") && !/^(mailto|tel|javascript):/i.test(href)) links.internal++;
  }

  const forms = body.querySelectorAll("form").map((f) => {
    const fields = f.querySelectorAll("input,select,textarea").filter((i) => !["hidden", "submit", "button"].includes((i.getAttribute("type") ?? "").toLowerCase()));
    const submit = f.querySelector('button[type="submit"],input[type="submit"],button:not([type])');
    return {
      // A form with no submit button and no action is usually an interactive tool (calculator, filter), not a sign-up.
      interactive: !submit && !f.getAttribute("action"),
      fields: fields.length,
      requiredFields: fields.filter((i) => i.hasAttribute("required")).length,
      submitText: submit ? text(submit) || submit.getAttribute("value") || null : null,
    };
  });

  const ctaSet = new Set<string>();
  for (const el of body.querySelectorAll("a,button")) {
    const t = text(el);
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
  if (robots && /noindex/i.test(robots)) flags.push({ severity: "error", message: `meta robots="${robots}": page is excluded from search.` });
  if (!lang) flags.push({ severity: "info", message: "No lang attribute on <html>." });
  if (!root.querySelector('meta[name="viewport"]')) flags.push({ severity: "warning", message: "No viewport meta; page will render poorly on mobile." });
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
  const res = await guardedFetch(u, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: { "user-agent": "Mozilla/5.0 (compatible; marketing-expert-mcp/0.1; page audit)", accept: "text/html,*/*;q=0.8" },
  });
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("html")) throw new Error(`expected HTML, got content-type "${ct}" (status ${res.status})`);
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
  if (xRobotsTag && /noindex/i.test(xRobotsTag)) facts.flags.unshift({ severity: "error", message: `X-Robots-Tag: ${xRobotsTag}` });
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
 * Refused requests end as network errors; their messages are added to `blocked`.
 */
async function startGuardProxy(blocked: string[]): Promise<{ server: string; close: () => void }> {
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
  const refuse = (e: unknown, socket: Socket) => {
    if (e instanceof BlockedAddressError && !blocked.includes(e.message)) blocked.push(e.message);
    socket.destroy();
  };
  const server = createServer(async (req, res) => {
    try {
      const target = new URL(req.url ?? "");
      if (target.protocol !== "http:") throw new Error(`not an http proxy request: ${req.url}`);
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
      refuse(e, req.socket);
    }
  });
  server.on("connection", track);
  // HTTPS and WebSockets: CONNECT host:port, then a plain byte tunnel.
  server.on("connect", async (req, client: Socket, head: Buffer) => {
    try {
      const i = (req.url ?? "").lastIndexOf(":");
      const upstream = await open(req.url!.slice(0, i), Number(req.url!.slice(i + 1)));
      client.write("HTTP/1.1 200 Connection Established\r\n\r\n");
      upstream.write(head);
      upstream.pipe(client).pipe(upstream);
      upstream.on("close", () => client.destroy());
      client.on("close", () => upstream.destroy());
    } catch (e) {
      refuse(e, client);
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
  // sending localhost and 127.0.0.1 around it.
  const blocked: string[] = [];
  const proxy = await startGuardProxy(blocked);
  const browser = await chromium
    .launch({ executablePath: process.env.MARKETING_EXPERT_CHROMIUM || undefined, headless: true, proxy: { server: proxy.server, bypass: "<-loopback>" } })
    .catch((e: unknown) => {
      proxy.close();
      throw e;
    });
  try {
    await assertPublicUrl(u);
    const page = await browser.newPage({ userAgent: "Mozilla/5.0 (compatible; marketing-expert-mcp/0.1; page audit)", serviceWorkers: "block" });
    const res = await page.goto(u.toString(), { waitUntil: "load", timeout: timeoutMs }).catch((e: unknown) => {
      // A redirect to a refused address ends as a network error; report the refusal instead.
      throw blocked.length ? new BlockedAddressError(blocked[0]) : e;
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
    if (blocked.length) {
      facts.flags.push({ severity: "info", message: `The page tried to reach private or local network addresses, which this tool blocks (${blocked.slice(0, 3).join("; ")}). The rendered page may be missing what those requests would have loaded.` });
    }
    return facts;
  } finally {
    await browser.close();
    proxy.close();
  }
}
