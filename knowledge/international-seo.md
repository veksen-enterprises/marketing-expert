---
title: International SEO
summary: How to structure, tag and localise a site for several countries or languages; ccTLD vs subdirectory vs subdomain, hreflang syntax and common errors, language vs country targeting, why not to auto-redirect by IP, translation vs localisation, machine translation and spam policy, and when Baidu, Naver, Yandex or Seznam matter.
tags: international seo, multilingual, multi-regional, hreflang, x-default, cctld, subdirectory, subdomain, localisation, localization, translation, machine translation, geotargeting, ip redirect, baidu, naver, yandex, seznam
---

International SEO means helping search engines show the right version of your site to people in each country or language. Most of the work is structure and tagging, done once, and translation quality, done for every page. General SEO practice is in seo-and-ai-search; this playbook covers only what changes when you go multi-country.

## First decide: language, country, or both

- **Language targeting**: one version per language (English, Spanish), for anyone who reads it. Choose this when the offer is the same everywhere (most SaaS, content sites).
- **Country targeting**: one version per country (US, UK, Mexico, Spain), because prices, currency, shipping, legal terms, stock or spelling differ. Choose this only when the page content actually differs; every extra country version is a copy you must maintain.
- Start with the smallest set of versions that serve real differences. "en" + "es" is often enough before "en-us", "en-gb", "es-es", "es-mx". [practitioner]
- Google retired the Search Console country targeting setting in Sept 2022 as having "little value". Google now uses signals such as ccTLD, hreflang and page content (currency, addresses, language). [first-party via secondary reporting]

## URL structure

Google documents three options for country/language versions; it does not recommend URL parameters (?lang=de) [not re-verified]. [first-party]

| Option | Example | Google's listed pros | Google's listed cons |
|---|---|---|---|
| Country-code top-level domain (ccTLD) | example.de | Clear country signal; server location irrelevant; easy to separate | Expensive, sometimes unavailable or restricted to local entities; more infrastructure; one country only |
| Subdomain on a generic domain | de.example.com | Easy to set up; can use different servers; easy to separate | Users may not know if "de" means language or country |
| Subdirectory on a generic domain | example.com/de/ | Easy to set up; low maintenance (same host) | Users may not know if it means language or country; one server location; harder to separate |

- **Default choice for most companies: subdirectories** on one domain. One site to maintain, one set of links and authority, one Search Console property with folder filters. [practitioner]
- **ccTLDs** make sense when local trust is a big buying factor (some European and Asian markets), you have local teams to run each site, or a local legal entity is needed anyway. Each ccTLD starts with little authority of its own. [practitioner]
- **Subdomains** suit separate platforms (a local shop on different software). Practitioners debate whether Google treats them as a separate site; Google says it handles both, and there is no controlled evidence either way. [practitioner]
- Whatever you choose, keep one pattern everywhere (/de/, /fr/, not /de/ plus fr.example.com) and never change it without a full redirect plan.

## hreflang

hreflang is an annotation that tells Google "this page has equivalent versions in these languages/regions". It does not improve ranking; it swaps in the right version for the user. [first-party]

- **Where**: in the HTML `<head>` as `<link rel="alternate" hreflang="..." href="...">`, in the HTTP header (for PDFs), or in the XML sitemap. Use one method per page set. Sitemaps are easiest to maintain at scale. [first-party]
- **Codes**: language in ISO 639-1 (two letters: en, de, es), optionally followed by a region in ISO 3166-1 Alpha 2 (US, GB, MX): `en-GB`, `es-MX`. Other codes are not supported. [first-party]
- **Self-reference**: each page lists itself as well as every alternate; the set of links is identical on every version. [first-party]
- **Return links**: if page A points to page B, page B must point back to A. Missing return links are the most common reason annotations are ignored. [first-party]
- **x-default**: the fallback for users whose language/region matches none of your versions, often a language picker or the main English page. `<link rel="alternate" hreflang="x-default" href="https://example.com/">`. [first-party]
- **Example set** (every page in the set carries all four lines):
  - `hreflang="en-US" href="https://example.com/us/pricing"`
  - `hreflang="en-GB" href="https://example.com/uk/pricing"`
  - `hreflang="de" href="https://example.com/de/preise"`
  - `hreflang="x-default" href="https://example.com/pricing"`

### Common hreflang errors

- Region code alone (`hreflang="uk"` or `hreflang="eu"`): "uk" is the language code for Ukrainian; "eu" is Basque. Use `en-GB`; there is no EU region code. [first-party; practitioner]
- Wrong country code: `en-UK` instead of `en-GB`. [practitioner]
- No return links, or return links pointing to redirected or non-canonical URLs. [first-party]
- hreflang URLs that redirect, return 404, or carry noindex. [practitioner]
- Canonical tag on every language version pointing to the English page. That tells Google the translations are duplicates; each version must canonicalise to itself. [first-party] [not re-verified]
- Annotations only on the home page. hreflang works page to page; each page needs its own set. [first-party]
- Tags added by a JavaScript plugin after load, or in the `<body>`. [practitioner]
- Run a crawler (Screaming Frog, Sitebulb, Ahrefs) after every release; Search Console no longer has an hreflang report. [practitioner]

## No automatic redirects by IP or browser language

- Google advises against automatically redirecting users to a language/country version based on what you guess about them. Googlebot mostly crawls from US IP addresses and sends no Accept-Language header, so IP or language redirects can hide your other versions from Google entirely. Google also says IP location analysis is "difficult and generally not reliable". [first-party]
- Instead: let every URL load for everyone; show a dismissible banner ("Looks like you're in Germany — go to the German site?"); keep a visible language/country switcher linking to the equivalent page (not the home page); remember the user's choice in a cookie. [first-party; practitioner]
- If legal reasons force blocking (e.g. a product not licensed in a country), block only that content and explain why, rather than redirecting the whole site. [practitioner]

## Translation vs localisation

- **Translation** changes the words. **Localisation** changes everything a local buyer notices: currency, prices, units, date formats, payment methods, shipping and returns, legal pages, examples, case studies, images, support hours and phone numbers. [practitioner]
- **Do keyword research per market.** People in different countries search with different words, not translations of your English keyword (e.g. Spanish users in Spain and Mexico use different terms for the same product). Translate the intent, then check local search volume and the local results page. [practitioner]
- Translate the whole page: title tag, meta description, headings, image alt text, structured data, URL slug (optional but helpful), navigation and forms. A German page with English navigation looks like a doorway. [practitioner]
- Localise reviews and proof: a US logo wall persuades little in Japan. [practitioner]
- Prioritise: translate the pages that earn money first (home, product, pricing, top landing pages), not the whole blog.

## Machine translation and spam policy

- Google's scaled content abuse policy lists, as an example, generating many pages through automated transformations such as translating, where little value is added. The policy applies however content is made. [first-party]
- Machine translation itself is not banned. Machine-translating thousands of pages and publishing them without review, to capture search traffic in new languages, fits the spam example. [first-party; practitioner]
- Workable approach: machine translation (or an LLM) for the first draft; native-speaker review for every page you index; noindex untranslated or unreviewed pages until reviewed. Keep a glossary of product terms. [practitioner]
- Check the result as a local buyer would: does it read naturally, are prices and examples local, would a local competitor's page be more useful?

## Local search engines

Google leads in most markets, but not all. Shares below are from aggregator sites relaying StatCounter-style data and differ by 5–10 points between sources. [vendor: secondary]

- **China — Baidu** (~53–54% share). Google is blocked. Needs simplified Chinese, fast access from the mainland (often local hosting, which needs an ICP licence), and Baidu's own webmaster tools. Usually a separate project with a local partner. [practitioner] [not re-verified]
- **South Korea — Naver** (~42% vs Google ~51%, 2024). Naver mixes in its own properties (Naver Blog, Cafe, Knowledge iN) heavily, so presence on those platforms often matters more than your website. [practitioner] [not re-verified]
- **Russia — Yandex** (~76%, May 2025). Has its own webmaster tools and regional targeting. Check sanctions and payment restrictions before investing. [practitioner]
- **Czech Republic — Seznam** (~12–13%). Small share, but the only EU country with a meaningful local engine; register in Seznam's webmaster tools and keep Czech content solid. [practitioner]
- Bing matters too: it feeds other engines and assistants, and its share is higher on desktop. Submit sitemaps to Bing Webmaster Tools (IndexNow supported). [practitioner] [not re-verified]

## Checklist

- Run crawl_site: it checks hreflang codes, self-references and return links across crawled pages.

- [ ] Decided language-only vs country versions based on real differences in offer.
- [ ] One URL pattern (subdirectories by default) used everywhere.
- [ ] hreflang on every page in each set: self-reference, return links, valid ISO codes, x-default.
- [ ] Each version canonicalises to itself; no hreflang URL redirects or is noindexed.
- [ ] No IP or browser-language redirects; banner suggestion plus switcher to the equivalent page.
- [ ] Keyword research and SERP check done in each market's language.
- [ ] Money pages fully localised (currency, payment, legal, proof) and reviewed by a native speaker.
- [ ] Unreviewed machine translations noindexed.
- [ ] Hreflang validated by crawler after each release; Search Console filtered by folder and country.

## Common mistakes

- Launching 20 country sites with the same English content and different flags.
- Auto-redirecting by IP, so Googlebot only ever sees the US site.
- Using `en-UK`, `hreflang="eu"` or language codes without return links.
- Canonicalising all translations to the English page.
- Translating keywords literally instead of researching local search terms.
- Publishing raw machine translation at scale.
- Ignoring Naver or Baidu when Korea or China is a priority market.

## Sources

research/seo-advanced.md §B (Google Search Central: multi-regional sites, localized versions, locale-adaptive pages, spam policies; Search Engine Land on the International Targeting report; market-share aggregators). Google pages were read from search snippets only; see the access caveat there.
