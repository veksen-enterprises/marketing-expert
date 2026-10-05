// AI crawler access check. Reads robots.txt and reports, per AI bot, whether the site allows it,
// grouped by what the bot does. Blocking a training bot keeps content out of future models;
// blocking a search bot can keep the site out of AI answers and citations.

import { parseRobotsFile, rulesFor, robotsAllows } from "./robots.js";
import { guardedFetch, readCapped, MAX_ROBOTS_BYTES } from "./netguard.js";

export type BotPurpose = "training" | "search" | "user-fetch" | "search-and-training";

export interface AiBot {
  token: string;
  company: string;
  purpose: BotPurpose;
  /** What blocking it does, in plain words. */
  effectOfBlocking: string;
  /** Purpose confirmed from the company's documentation (via search snippets; pages themselves were blocked) in this project's research. */
  verified: boolean;
  source?: string;
  note?: string;
}

export const AI_BOTS_CHECKED_ON = "2026-10-04";

export const AI_BOTS: AiBot[] = [
  { token: "GPTBot", company: "OpenAI", purpose: "training", effectOfBlocking: "Content not used to train OpenAI models. Does not remove you from ChatGPT search.", verified: true, source: "https://developers.openai.com/api/docs/bots" },
  { token: "OAI-SearchBot", company: "OpenAI", purpose: "search", effectOfBlocking: "Site can't appear as a cited result in ChatGPT search answers.", verified: true, source: "https://developers.openai.com/api/docs/bots" },
  { token: "ChatGPT-User", company: "OpenAI", purpose: "user-fetch", effectOfBlocking: "ChatGPT can't open your pages when a user asks it to.", note: "OpenAI says robots.txt rules may not apply to user-initiated fetches.", verified: true, source: "https://developers.openai.com/api/docs/bots" },
  { token: "ClaudeBot", company: "Anthropic", purpose: "training", effectOfBlocking: "Content not used to train Anthropic models.", verified: true, source: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler" },
  { token: "Claude-SearchBot", company: "Anthropic", purpose: "search", effectOfBlocking: "Site may not appear in Claude's search results.", verified: true, source: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler" },
  { token: "Claude-User", company: "Anthropic", purpose: "user-fetch", effectOfBlocking: "Claude can't open your pages when a user asks it to.", note: "Anthropic says its bots, including this one, honour robots.txt.", verified: true, source: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler" },
  { token: "PerplexityBot", company: "Perplexity", purpose: "search", effectOfBlocking: "Page text not indexed for Perplexity answers (Perplexity may still index the domain, headline and a brief summary).", note: "Perplexity says it is not used to crawl content for AI foundation models.", verified: true, source: "https://docs.perplexity.ai/docs/resources/perplexity-crawlers" },
  { token: "Perplexity-User", company: "Perplexity", purpose: "user-fetch", effectOfBlocking: "Perplexity can't fetch pages on a user's request.", note: "Perplexity says this fetcher generally ignores robots.txt.", verified: true, source: "https://docs.perplexity.ai/docs/resources/perplexity-crawlers" },
  { token: "Google-Extended", company: "Google", purpose: "training", effectOfBlocking: "Content not used for Gemini training/grounding. Does not affect Google Search or AI Overviews.", verified: true, source: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers" },
  { token: "Googlebot", company: "Google", purpose: "search", effectOfBlocking: "Removes you from Google Search, including AI Overviews and AI Mode.", verified: true, note: "Classic search crawler; listed because Google's AI answers use the Search index.", source: "https://developers.google.com/search/docs/appearance/ai-features" },
  { token: "Bingbot", company: "Microsoft", purpose: "search", effectOfBlocking: "Removes you from Bing, which Microsoft Copilot and other assistants use for search.", note: "Bing lists no separate Copilot crawler; it says noindex keeps a URL out of Bing search, Copilot experiences and grounding API results.", verified: true, source: "https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0" },
  { token: "Applebot-Extended", company: "Apple", purpose: "training", effectOfBlocking: "Content not used to train Apple's foundation models. Applebot (Siri/Spotlight/Safari search) is separate.", verified: true, source: "https://support.apple.com/en-us/119829" },
  { token: "Applebot", company: "Apple", purpose: "search", effectOfBlocking: "Removes you from Spotlight, Siri and Safari search suggestions.", verified: true, source: "https://support.apple.com/en-us/119829" },
  { token: "Meta-ExternalAgent", company: "Meta", purpose: "training", effectOfBlocking: "Content not used to train Meta AI models or to improve Meta products by indexing.", note: "Meta describes it as crawling for training foundation AI models or improving products by indexing content directly.", verified: true, source: "https://developers.facebook.com/documentation/sharing/webmasters/web-crawlers" },
  { token: "Meta-ExternalFetcher", company: "Meta", purpose: "user-fetch", effectOfBlocking: "Meta AI can't fetch pages on a user's request.", note: "Meta says this fetcher may bypass robots.txt because fetches are user-requested.", verified: true, source: "https://developers.facebook.com/documentation/sharing/webmasters/web-crawlers" },
  { token: "Amazonbot", company: "Amazon", purpose: "training", effectOfBlocking: "Content not used by Amazon to improve its products or train Amazon AI models. Alexa search eligibility is controlled by Amzn-SearchBot.", note: "Amazon says Amazonbot improves its products and services and may be used to train Amazon AI models.", verified: true, source: "https://developer.amazon.com/amazonbot" },
  { token: "Amzn-SearchBot", company: "Amazon", purpose: "search", effectOfBlocking: "Content not eligible for Amazon search experiences such as Alexa.", note: "Amazon says it does not crawl for generative AI model training.", verified: true, source: "https://developer.amazon.com/amazonbot" },
  { token: "Amzn-User", company: "Amazon", purpose: "user-fetch", effectOfBlocking: "Alexa can't fetch live pages to answer a user's question.", note: "Amazon says it respects robots.txt and is not used for model training.", verified: true, source: "https://developer.amazon.com/amazonbot" },
  { token: "CCBot", company: "Common Crawl", purpose: "training", effectOfBlocking: "Excluded from the Common Crawl dataset, which many AI models are trained on.", note: "Common Crawl confirms CCBot obeys robots.txt and Crawl-delay; the AI-training use is by third parties, not stated on the CCBot page.", verified: false, source: "https://commoncrawl.org/ccbot" },
  { token: "Bytespider", company: "ByteDance", purpose: "training", effectOfBlocking: "Content not used by ByteDance models.", verified: false },
  { token: "DuckAssistBot", company: "DuckDuckGo", purpose: "search", effectOfBlocking: "Not used as a source in DuckDuckGo's AI-assisted answers. Does not affect DuckDuckGo organic results.", note: "DuckDuckGo says the data is not used to train AI models; opt-out takes effect after 72 hours.", verified: true, source: "https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot" },
  { token: "MistralAI-User", company: "Mistral", purpose: "user-fetch", effectOfBlocking: "Mistral's assistant can't fetch pages on a user's request.", note: "Mistral says it is not used for automatic crawling or for training.", verified: true, source: "https://docs.mistral.ai/robots" },
  { token: "MistralAI-Training", company: "Mistral", purpose: "training", effectOfBlocking: "Content not used to build Mistral training datasets.", verified: true, source: "https://docs.mistral.ai/robots" },
];

export interface BotAccess extends AiBot {
  allowed: boolean;
  matchedGroup: string | null;
}

export interface AiAccessReport {
  site: string;
  robotsTxtFound: boolean;
  checkedPaths: string[];
  bots: BotAccess[];
  blockedSearchBots: string[];
  blockedTrainingBots: string[];
  llmsTxtFound: boolean | null;
  sitemaps: string[];
  findings: string[];
  checkedOn: string;
}

/** Pure part: evaluate robots.txt text for every AI bot on the given paths (blocked if any path is blocked). */
export function evaluateAiAccess(robotsTxt: string | null, site: string, paths: string[] = ["/"]): Omit<AiAccessReport, "llmsTxtFound"> {
  const base = new URL(site);
  const findings: string[] = [];
  // A catch-all route serving the app's HTML at /robots.txt: crawlers find no rules at all.
  if (robotsTxt && /^\s*(<!doctype html|<html|<head|<body)/i.test(robotsTxt)) {
    findings.push("The robots.txt content is an HTML page (probably the app's catch-all route), not a robots file. Crawlers find no rules, so every bot is allowed, and unknown URLs on this site may return 200 pages (soft 404s). Serve a real text/plain robots.txt.");
    robotsTxt = null;
  }
  const file = parseRobotsFile(robotsTxt ?? "");
  const bots: BotAccess[] = AI_BOTS.map((b) => {
    const rules = rulesFor(file, b.token);
    const allowed = paths.every((p) => robotsAllows(rules, new URL(p, base).toString()));
    return { ...b, allowed, matchedGroup: rules.matchedGroup };
  });
  const blockedSearch = bots.filter((b) => !b.allowed && (b.purpose === "search" || b.purpose === "search-and-training")).map((b) => b.token);
  const blockedTraining = bots.filter((b) => !b.allowed && b.purpose === "training").map((b) => b.token);
  if (!robotsTxt && !findings.length) findings.push("No robots.txt found: every bot is allowed by default.");
  if (blockedSearch.includes("Googlebot") || blockedSearch.includes("Bingbot")) {
    findings.push(`Classic search crawlers are blocked (${blockedSearch.filter((t) => t === "Googlebot" || t === "Bingbot").join(", ")}). That removes you from search and from AI answers built on it. Almost always a mistake.`);
  }
  const aiSearch = blockedSearch.filter((t) => t !== "Googlebot" && t !== "Bingbot");
  if (aiSearch.length) findings.push(`AI search/answer bots are blocked: ${aiSearch.join(", ")}. If you want to be cited or recommended by these assistants, allow them.`);
  if (blockedTraining.length && !blockedSearch.length) {
    findings.push(`Training bots are blocked (${blockedTraining.join(", ")}) while search bots are allowed. That's a coherent choice: no training use, still eligible for AI search answers.`);
  }
  const userFetchBlocked = bots.filter((b) => !b.allowed && b.purpose === "user-fetch").map((b) => b.token);
  if (userFetchBlocked.length) findings.push(`User-triggered fetchers are blocked (${userFetchBlocked.join(", ")}): assistants can't open your pages even when a user pastes your link. Some companies say these fetchers may not follow robots.txt.`);
  const starOnly = bots.filter((b) => b.matchedGroup === "*" && !b.allowed).map((b) => b.token);
  if (starOnly.length) findings.push(`These bots are blocked only by the general "User-agent: *" group, probably unintentionally: ${starOnly.join(", ")}.`);
  if (bots.every((b) => b.allowed) && robotsTxt) {
    findings.push("robots.txt allows all listed AI bots on the checked paths. This only covers robots.txt: it says nothing about status codes, noindex, or how much text the server HTML holds (use crawl_site or audit_page for that).");
  }
  if (robotsTxt && !file.sitemaps.length) findings.push("robots.txt has no Sitemap: line. Add one with the sitemap's absolute URL so crawlers find it without Search Console.");
  findings.push("robots.txt is a request, not enforcement, and not the only gate: firewall/CDN bot rules can block AI bots even when robots.txt allows them (some CDNs block them by default). OpenAI recommends also allowing its published IP ranges for OAI-SearchBot. robots.txt changes take ~24 hours to reach ChatGPT search.");
  return {
    site: base.origin,
    robotsTxtFound: !!robotsTxt,
    checkedPaths: paths,
    bots,
    blockedSearchBots: blockedSearch,
    blockedTrainingBots: blockedTraining,
    sitemaps: file.sitemaps,
    findings,
    checkedOn: AI_BOTS_CHECKED_ON,
  };
}

export async function checkAiCrawlerAccess(site: string, paths?: string[], timeoutMs = 15000): Promise<AiAccessReport> {
  const base = new URL(site);
  if (!/^https?:$/.test(base.protocol)) throw new RangeError("site must be an http(s) URL");
  const get = (path: string) =>
    guardedFetch(new URL(path, base), { headers: { "user-agent": "Mozilla/5.0 (compatible; marketing-expert-mcp/0.1)" }, signal: AbortSignal.timeout(timeoutMs) });
  let robotsTxt: string | null = null;
  let serverError: number | null = null;
  let r: Response;
  try {
    r = await get("/robots.txt");
  } catch (e) {
    // Never report "allowed" for a site we couldn't check.
    throw new Error(`Could not reach ${base.origin} to read robots.txt (${e instanceof Error ? e.message : String(e)}). Nothing was checked; no conclusion about AI crawler access can be drawn. Paste the robots.txt contents instead, or check from a network that can reach the site.`);
  }
  const robotsCt = r.headers.get("content-type") ?? "";
  const caveats: string[] = [];
  if (r.ok && !robotsCt.includes("html")) {
    // Capped: a few KB of gzip can inflate to gigabytes and crash the server.
    const { text, truncated } = await readCapped(r, MAX_ROBOTS_BYTES);
    // Drop the cut-off last line so half a rule isn't read as a shorter one.
    robotsTxt = truncated ? text.slice(0, text.lastIndexOf("\n") + 1) : text;
    if (truncated) caveats.push("robots.txt is larger than 500 KB. Google reads only the first 500 KB and ignores the rest; this check did the same.");
  } else if (r.ok) caveats.push("robots.txt is served as an HTML page (probably the app's catch-all route), so crawlers find no valid rules and treat everything as allowed. Serve a real text/plain robots.txt.");
  else if (r.status >= 500) serverError = r.status;
  else if (r.status === 404 || r.status === 410) caveats.push(`No robots.txt (HTTP ${r.status}): crawlers treat this as "everything allowed".`);
  else {
    const deny = r.headers.get("x-deny-reason");
    caveats.push(
      `robots.txt returned HTTP ${r.status}${deny ? ` (x-deny-reason: ${deny})` : ""}. This may be a firewall, CDN or proxy blocking this checker rather than the site's real answer, so the result below is NOT verified. (Google treats a genuine 4xx on robots.txt as "no restrictions".) Check from another network or pass the file's contents as robotsTxt.`
    );
  }
  let llms: boolean | null = null;
  try {
    const lr = await get("/llms.txt");
    if (lr.ok) llms = !(lr.headers.get("content-type") ?? "").includes("html");
    else if (lr.status === 404 || lr.status === 410) llms = false;
    // Any other status: unknown (null), not "absent".
  } catch {
    llms = null;
  }
  // Google's documented behaviour: a 5xx on robots.txt means "disallow everything" until it recovers.
  const report = evaluateAiAccess(serverError ? "User-agent: *\nDisallow: /" : robotsTxt, site, paths);
  if (caveats.length) {
    report.findings = report.findings.filter((f) => !f.startsWith("No robots.txt found"));
    report.findings.unshift(...caveats);
  }
  if (serverError) {
    report.robotsTxtFound = false;
    report.findings.unshift(`robots.txt returned HTTP ${serverError}. Crawlers that follow Google's rules treat this as "block everything", so every bot is reported as blocked. Fix the server error.`);
  }
  report.findings.push(
    llms === null
      ? "Couldn't determine whether llms.txt exists."
      : llms
        ? "llms.txt found. Harmless, but there is no evidence major assistants use it (see seo-and-ai-search)."
        : "No llms.txt. Not a problem: there is no evidence major assistants use it (see seo-and-ai-search)."
  );
  return { ...report, llmsTxtFound: llms };
}
