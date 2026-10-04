---
title: AI assistant visibility (ChatGPT, Perplexity, Gemini, Copilot, Claude)
summary: How to get your brand, products and pages recommended or cited when people ask AI assistants; how each assistant retrieves information, which crawlers to allow, what sources get cited, AI shopping feeds, how to measure it, and what is speculation.
tags: ai visibility, chatgpt, perplexity, llm seo, geo, ai search, generative engine optimization, ai crawlers, gptbot, oai-searchbot, claudebot, google-extended, ai shopping, product feeds, brand mentions, ai referral traffic
---

This playbook extends **seo-and-ai-search** (AI Overviews click-through studies, the Aggarwal et al. GEO paper, llms.txt adoption). Read that first; this one covers assistants outside the Google results page and the practical work of being included in their answers.

## How assistants find information

An assistant answer comes from three places. Each needs different work.

- **Live retrieval (search at answer time).** The assistant runs searches, fetches pages and cites them. This is where most citations and clicks come from.
  - ChatGPT search uses "third-party search providers" plus partner content, and OpenAI's own index built by OAI-SearchBot. [first-party] OpenAI does not name the providers in the material we could check; Bing is widely reported as one. [not re-verified]
  - Perplexity uses its own retrieval index built by PerplexityBot. [first-party]
  - Gemini and Google AI Mode / AI Overviews use Google's index (Googlebot). Microsoft Copilot uses Bing ("grounding queries" in Bing Webmaster Tools). [first-party]
  - Claude uses Claude-SearchBot for search and Claude-User for user-requested fetches. [first-party]
- **Training data.** What the model learned before its cutoff date. It shapes which brands the model "knows" without searching. It changes slowly (months to a year) and you cannot check it directly.
- **Product feeds and partner data.** Merchant feeds (Google Merchant Center, OpenAI's commerce feeds) power shopping answers. See "AI shopping" below.

**Why classic search still matters:** live retrieval starts with a search. If you do not rank in Google and Bing for the question, the assistant is less likely to find you. But overlap is partial: Ahrefs (15k queries) found only ~12% of URLs cited by AI tools were also in Google's top 10. [vendor, not re-verified] Do both: rank, and be mentioned on the pages that do rank.

## Crawler access: training vs search vs user fetch

Most AI companies run separate bots for separate jobs. Blocking the training bot does **not** remove you from search answers; blocking the search bot does. See the token table in research/ai-assistant-visibility.md.

- **OpenAI:** GPTBot = training. OAI-SearchBot = ChatGPT search; sites that block it "will not be shown in ChatGPT search answers" (links and titles may still appear). ChatGPT-User = fetches when a user asks; OpenAI says robots.txt rules "may not apply" to it. Settings are independent; changes take about 24 hours to reach search. [first-party]
- **Anthropic:** ClaudeBot = training; Claude-SearchBot = search quality; Claude-User = user-requested fetches. Anthropic says all respect robots.txt. [first-party]
- **Perplexity:** PerplexityBot = index, follows robots.txt. Perplexity-User = user-triggered fetches and generally ignores robots.txt. [first-party] Cloudflare (Aug 2025) said Perplexity also used undeclared crawlers to get around blocks; Perplexity disputed it. [vendor]
- **Google:** Google-Extended is a robots.txt token, not a separate crawler. It controls use for Gemini training and grounding (Gemini Apps, Vertex AI). Google says it does **not** affect inclusion or ranking in Google Search, so it does not remove you from AI Overviews or AI Mode. Only blocking Googlebot does that, which removes you from Search too. [first-party]
- **Apple:** Applebot-Extended controls use for training Apple's foundation models; pages that block it can still appear in Apple search. Applebot (Spotlight, Siri, Safari search) is separate. [first-party]
- **Microsoft:** no separate Copilot crawler is listed; Copilot uses Bing's index (Bingbot). Bing says `noindex` keeps a URL out of Bing search, Copilot and grounding results. [first-party]
- **Meta:** Meta-ExternalAgent = training and product indexing; Meta-ExternalFetcher = user-requested fetches and may bypass robots.txt. [first-party]
- **Amazon:** Amazonbot = product improvement and possible AI training; Amzn-SearchBot = search experiences such as Alexa (not training); Amzn-User = live fetches for user questions. [first-party]
- **Others:** DuckAssistBot = DuckDuckGo AI answers, not training, blocking doesn't affect organic results; MistralAI-User = user fetches, MistralAI-Training = training. [first-party]
- **Ads and agent bots:** advertisers in ChatGPT ads must allow OAI-AdsBot (landing-page review, not training). Google-CloudVertexBot only crawls when a site owner builds a Vertex AI Agent; no effect on Search. [first-party]
- **Common default for a business that wants to be recommended:** allow the search and user bots (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Googlebot, Bingbot, Applebot, Amzn-SearchBot, DuckAssistBot). Training bots are a business choice: blocking them protects content but may reduce how well future models know your brand (no study measures this). [practitioner]
- **Check the CDN/WAF too.** Bot-protection settings (for example Cloudflare's AI-bot blocking) can block AI crawlers even when robots.txt allows them. [practitioner]
- **JavaScript:** Vercel and MERJ (Dec 2024) found no evidence that GPTBot, ClaudeBot, PerplexityBot, Meta's or ByteDance's crawlers execute JavaScript; they fetch JS files but don't run them. Gemini (via Googlebot) and Applebot do render. [vendor] If your main content, prices or reviews appear only after JavaScript runs, most AI crawlers do not see them.

- **robots.txt is not the only gate.** OpenAI recommends allowing OAI-SearchBot in robots.txt *and* allowing requests from its published IP ranges; a firewall or CDN bot rule that blocks those IPs keeps you out even when robots.txt allows the bot. After changing robots.txt, allow ~24 hours for ChatGPT search to pick it up. [first-party: developers.openai.com/api/docs/bots; help.openai.com Publishers and Developers FAQ, verified-search 2026-10-04]

## What gets cited

- **A few large third-party sites take most citations.** Profound (680M citations, Aug 2024–Jun 2025): Wikipedia was 47.9% of ChatGPT's top-10 source share; Reddit about 46.7% of Perplexity's. [vendor] Semrush's 3-month study: Reddit, Wikipedia, YouTube, LinkedIn and Forbes led across platforms. [vendor] Platforms differ strongly: an estimated 11% of domains are cited by both ChatGPT and Perplexity. [vendor, not re-verified]
- **For commercial questions, review and comparison sites matter.** Perplexity's top commercial sources reportedly include G2, Gartner, NerdWallet, PCMag, TripAdvisor and Yelp. [vendor, not re-verified]
- **Brand mentions correlate with AI visibility more than links.** Ahrefs (75k brands): branded web mentions correlated 0.664 with AI Overview brand visibility; backlinks 0.218; branded search volume 0.392. Correlation, not cause; large brands score high on all of them. [vendor]
- **Earned media shows up in the consideration set.** SparkToro (Jan 2026) reported that brands that appeared most consistently had earned coverage in publications the engines trust. [vendor, not re-verified]
- **Content format:** Aggarwal et al. found quotations, statistics and cited sources raised visibility on a lab benchmark — see seo-and-ai-search. [research]
- **Implication:** your own site is only part of the work. The answer to "best X for Y" is usually assembled from review sites, comparison articles, Reddit threads, YouTube and Wikipedia. Work on being present and accurate there (see pr-and-influencers, organic-social-and-community, content-marketing).

## AI shopping and product feeds

- **Google (AI Mode, AI Overviews, Gemini):** product answers are grounded in the Shopping Graph, which is fed by Merchant Center. Complete, accurate feeds (GTIN, price, availability, images, product highlights) are the base requirement. Google has started agentic checkout with selected US merchants via its Universal Commerce Protocol. [first-party, not re-verified in detail]
- **ChatGPT:** OpenAI launched Instant Checkout with the Agentic Commerce Protocol (ACP, built with Stripe) in Sep 2025; merchants applied at chatgpt.com/merchants. [first-party] On 20 Mar 2026 OpenAI ended Instant Checkout. Merchants now share product feeds and promotions through ACP for discovery, and buyers complete purchases on the retailer's site or in a retailer's own ChatGPT app. Reported reasons: very few merchants integrated, and lower conversion than retailer sites. [secondary reporting]
- **Practical:** treat feeds as a visibility channel, not just an ads input. Make on-page price, stock and reviews match the feed and be in server HTML.
- Platforms change these programmes often (see platform-and-feature-risk). Check current merchant docs before building.

## Measurement

- **Referral traffic:** create an analytics channel group for assistant domains (chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com, claude.ai). ChatGPT adds **utm_source=chatgpt.com** to links. [first-party] Many AI-driven visits arrive without a referrer (copy-pasted links, apps), so referral traffic is a minimum, not a total. Watch branded search and direct traffic as well.
- **Bing Webmaster Tools "AI Performance"** (preview Feb 2026): citations in Copilot and Bing AI answers, cited URLs, grounding queries; "Citation Share" added Jun 2026. [first-party] The only first-party citation report found so far; Google Search Console does not separate AI Mode citations in the material we checked.
- **Prompt panel:** write 20–50 real buyer questions (from sales calls, reviews, search queries). Each month, run each one several times per assistant, logged out or in a clean profile, and record: are you mentioned, which competitors, which sources are cited, and is anything wrong.
  - **Answers vary from run to run.** SparkToro (Jan 2026; 600 volunteers, 12 prompts, ~2,961 runs on ChatGPT, Claude, Google AI): under 1 in 100 chance of the same brand list twice, and lower for the same order. [vendor] Report **mention rate across runs** (for example "named in 14 of 30 runs"), never one rank.
- **Vendor AI-visibility tools** (Profound, Semrush, Ahrefs Brand Radar and others) automate prompt panels. Useful for trends, but no validated, public methodology exists; prompt choice decides the score. [vendor] Don't compare scores across tools.

## What is speculation

- **llms.txt:** no evidence it is used for citations (see seo-and-ai-search).
- **"AI-specific" schema** or special markup for LLMs: no assistant documents a ranking or citation benefit. Use structured data for normal search features. [practitioner]
- **"Optimising for the model" tricks** (hidden text for bots, prompt-injection text, cloaking content for AI user agents): risky. Google's spam policies cover cloaking and hidden text; assistants may treat injected instructions as attacks.
- **Buying mentions:** paid Reddit posts, fake reviews, or undisclosed sponsored "best of" lists. Reddit and review sites remove them; the FTC Consumer Review rule (US, 2024) bans fake reviews; undisclosed paid endorsements break advertising law (see privacy-and-marketing-law). Disclosed sponsorships are fine but may carry less weight.
- **Mass-produced "best X" pages** made to be cited: Google's scaled content abuse policy applies; AI assistants that ground in Google or Bing inherit those signals.

## Checklist

1. Run **check_ai_crawler_access** on your domain: it checks robots.txt for the AI bots above. Allow search and user bots; decide training bots on purpose. Check the CDN/WAF bot settings too.
2. Run **audit_page with render=true** on key templates (home, product, pricing, comparison). It measures how much content exists only after JavaScript; move that content into server HTML.
3. Confirm the site is indexed in **Bing** (Bing Webmaster Tools, submit sitemap; IndexNow for fast updates) as well as Google.
4. Make key facts easy to quote: what you are, who it is for, pricing, specs, comparisons, with dates and sources.
5. Fix your presence on third-party sources: review sites in your category, Wikipedia (only if notable, under its conflict-of-interest rules), comparison articles, relevant Reddit and YouTube.
6. E-commerce: complete Merchant Center feed; evaluate OpenAI's ACP feed; keep feeds and pages consistent.
7. Set up the AI-referral channel group and the monthly prompt panel; log wrong facts and fix their sources.

## Common mistakes

- Blocking GPTBot or Google-Extended and thinking you left AI search, or blocking OAI-SearchBot or PerplexityBot by accident and disappearing from answers.
- Robots.txt allows AI bots but the firewall blocks them.
- Prices, reviews or product details that load only through JavaScript.
- Judging visibility from one prompt run, or from a single vendor score.
- Working only on your own site when answers cite review sites, Reddit and media.
- Buying fake reviews or undisclosed posts to "train" the AI.
- Ignoring Bing because its search share is small, though Copilot grounds its answers in Bing.

## Sources

research/ai-assistant-visibility.md (OpenAI, Anthropic, Perplexity, Google, Apple and Microsoft documentation; Vercel/MERJ 2024; Profound 2025; Semrush; Ahrefs 2025; SparkToro 2026; Cloudflare 2025; reporting on OpenAI commerce changes 2025–2026). research/landscape-2026.md §4 for the GEO and llms.txt items. Most items came from search snippets; see the access caveats there.
