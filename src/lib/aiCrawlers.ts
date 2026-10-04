// AI crawler access check. Reads robots.txt and reports, per AI bot, whether the site allows it,
// grouped by what the bot does. Blocking a training bot keeps content out of future models;
// blocking a search bot can keep the site out of AI answers and citations.

import { parseRobotsFile, rulesFor, robotsAllows } from "./robots.js";

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
  { token: "GPTBot", company: "OpenAI", purpose: "training", effectOfBlocking: "Content not used to train OpenAI models. Does not remove you from ChatGPT search.", verified: true, source: "company docs via search snippet (research/ai-assistant-visibility.md)" },
  { token: "OAI-SearchBot", company: "OpenAI", purpose: "search", effectOfBlocking: "Site can't appear as a cited result in ChatGPT search answers.", verified: true, source: "company docs via search snippet (research/ai-assistant-visibility.md)" },
  { token: "ChatGPT-User", company: "OpenAI", purpose: "user-fetch", effectOfBlocking: "ChatGPT can't open your pages when a user asks it to.", note: "OpenAI says robots.txt rules may not apply to user-initiated fetches.", verified: true, source: "company docs via search snippet (research/ai-assistant-visibility.md)" },
  { token: "ClaudeBot", company: "Anthropic", purpose: "training", effectOfBlocking: "Content not used to train Anthropic models.", verified: true, source: "company docs via search snippet (research/ai-assistant-visibility.md)" },
  { token: "Claude-SearchBot", company: "Anthropic", purpose: "search", effectOfBlocking: "Site may not appear in Claude's search results.", verified: true, source: "company docs via search snippet (research/ai-assistant-visibility.md)" },
  { token: "Claude-User", company: "Anthropic", purpose: "user-fetch", effectOfBlocking: "Claude can't open your pages when a user asks it to.", verified: false },
  { token: "PerplexityBot", company: "Perplexity", purpose: "search", effectOfBlocking: "Site not indexed for Perplexity answers.", verified: false },
  { token: "Perplexity-User", company: "Perplexity", purpose: "user-fetch", effectOfBlocking: "Perplexity can't fetch pages on a user's request.", note: "Perplexity says this fetcher generally ignores robots.txt.", verified: false },
  { token: "Google-Extended", company: "Google", purpose: "training", effectOfBlocking: "Content not used for Gemini training/grounding. Does not affect Google Search or AI Overviews.", verified: true, source: "company docs via search snippet (research/ai-assistant-visibility.md)" },
  { token: "Googlebot", company: "Google", purpose: "search", effectOfBlocking: "Removes you from Google Search, including AI Overviews and AI Mode.", verified: true, note: "Classic search crawler; listed because Google's AI answers use the Search index." },
  { token: "Bingbot", company: "Microsoft", purpose: "search", effectOfBlocking: "Removes you from Bing, which Microsoft Copilot and other assistants use for search.", verified: false },
  { token: "Applebot-Extended", company: "Apple", purpose: "training", effectOfBlocking: "Content not used to train Apple's AI models. Applebot (Siri/Spotlight search) is separate.", verified: true, source: "company docs via search snippet (research/ai-assistant-visibility.md)" },
  { token: "Applebot", company: "Apple", purpose: "search", effectOfBlocking: "Removes you from Siri and Spotlight suggestions.", verified: false },
  { token: "Meta-ExternalAgent", company: "Meta", purpose: "training", effectOfBlocking: "Content not used to train Meta AI models.", verified: false },
  { token: "Meta-ExternalFetcher", company: "Meta", purpose: "user-fetch", effectOfBlocking: "Meta AI can't fetch pages on a user's request.", verified: false },
  { token: "Amazonbot", company: "Amazon", purpose: "search-and-training", effectOfBlocking: "Content not used by Amazon (including Alexa answers).", verified: false },
  { token: "CCBot", company: "Common Crawl", purpose: "training", effectOfBlocking: "Excluded from the Common Crawl dataset, which many AI models are trained on.", verified: false },
  { token: "Bytespider", company: "ByteDance", purpose: "training", effectOfBlocking: "Content not used by ByteDance models.", verified: false },
  { token: "DuckAssistBot", company: "DuckDuckGo", purpose: "search", effectOfBlocking: "Not used in DuckDuckGo's AI answers.", verified: false },
  { token: "MistralAI-User", company: "Mistral", purpose: "user-fetch", effectOfBlocking: "Mistral's assistant can't fetch pages on a user's request.", verified: false },
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
  const file = parseRobotsFile(robotsTxt ?? "");
  const bots: BotAccess[] = AI_BOTS.map((b) => {
    const rules = rulesFor(file, b.token);
    const allowed = paths.every((p) => robotsAllows(rules, new URL(p, base).toString()));
    return { ...b, allowed, matchedGroup: rules.matchedGroup };
  });
  const blockedSearch = bots.filter((b) => !b.allowed && (b.purpose === "search" || b.purpose === "search-and-training")).map((b) => b.token);
  const blockedTraining = bots.filter((b) => !b.allowed && b.purpose === "training").map((b) => b.token);
  const findings: string[] = [];
  if (!robotsTxt) findings.push("No robots.txt found: every bot is allowed by default.");
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
  if (!findings.length || (bots.every((b) => b.allowed) && robotsTxt)) findings.push("All listed AI bots are allowed on the checked paths.");
  findings.push("robots.txt is a request, not enforcement. Check server logs or your CDN's bot settings too: some CDNs block AI bots by default.");
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
    fetch(new URL(path, base), { headers: { "user-agent": "Mozilla/5.0 (compatible; marketing-expert-mcp/0.1)" }, signal: AbortSignal.timeout(timeoutMs) });
  let robotsTxt: string | null = null;
  try {
    const r = await get("/robots.txt");
    if (r.ok && !(r.headers.get("content-type") ?? "").includes("html")) robotsTxt = await r.text();
  } catch {
    robotsTxt = null;
  }
  let llms: boolean | null = null;
  try {
    const r = await get("/llms.txt");
    llms = r.ok && !(r.headers.get("content-type") ?? "").includes("html");
  } catch {
    llms = null;
  }
  const report = evaluateAiAccess(robotsTxt, site, paths);
  report.findings.push(
    llms
      ? "llms.txt found. Harmless, but there is no evidence major assistants use it (see seo-and-ai-search)."
      : "No llms.txt. Not a problem: there is no evidence major assistants use it (see seo-and-ai-search)."
  );
  return { ...report, llmsTxtFound: llms };
}
