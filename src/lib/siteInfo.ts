// Site-information links on a page: contact, imprint, privacy, terms, about, pricing. The flags cite the law that
// asks for each item (research/trust-signals.md §7); evidence that these links raise trust or sales is self-report
// or qualitative only, so the flags claim nothing about conversion. About and pricing are reported, never flagged.

export type SiteInfoKind = "contact" | "imprint" | "privacy" | "terms" | "about" | "pricing";
export type SiteInfo = Record<SiteInfoKind, { found: boolean; links: Array<{ text: string; href: string }> }>;

// Matched on the link text and on the href, in English, German, French and Spanish.
const PATTERNS: Record<SiteInfoKind, RegExp> = {
  contact: /^(mailto|tel):|\b(contact(ez|o)?|kontakt|nous[- ]contacter|get[- ]in[- ]touch)\b/i,
  imprint: /impressum|\bimprint\b|legal[- ]notice|mentions[- ]l[ée]gales|aviso[- ]legal/i,
  privacy: /privacy|datenschutz|confidentialit[ée]|privacidad|donn[ée]es[- ]personnelles/i,
  terms: /\bterms\b|\btos\b|\bagb\b|nutzungsbedingungen|conditions[- ](g[ée]n[ée]rales|d.utilisation)|\bcgu\b|\bcgv\b|t[ée]rminos/i,
  about: /\babout\b|[üu]ber[- ]uns|ueber-uns|[àa][- ]propos|qui[- ]sommes|sobre[- ]nosotros|qui[ée]nes[- ]somos/i,
  pricing: /pricing|\bprices\b|\bplans\b|\bpreise\b|\btarifs?\b|\bprecios\b/i,
};

const KINDS = Object.keys(PATTERNS) as SiteInfoKind[];
const MAX_LINKS = 3;

export function siteInfoOf(links: Array<{ text: string; href: string }>): SiteInfo {
  const out = Object.fromEntries(KINDS.map((k) => [k, { found: false, links: [] as Array<{ text: string; href: string }> }])) as SiteInfo;
  for (const l of links) {
    for (const k of KINDS) {
      if (!PATTERNS[k].test(l.text) && !PATTERNS[k].test(l.href)) continue;
      out[k].found = true;
      if (out[k].links.length < MAX_LINKS) out[k].links.push(l);
    }
  }
  return out;
}

const NOT_CHECKED = "Not checked: which markets you sell in (these rules apply only there), links built only by script (unless render=true), and what the linked pages say.";

/** Flags for a home page: missing contact, privacy and (for German pages) imprint links, each with the rule that asks for it. */
export function siteInfoFlags(info: SiteInfo, lang: string | null, host: string | null): Array<{ severity: "info"; message: string }> {
  const flags: Array<{ severity: "info"; message: string }> = [];
  if (!info.contact.found) {
    flags.push({
      severity: "info",
      message: `No contact link, email link or phone link found on this home page. In the EU and the UK, a business selling online must keep its name, geographic address and email address "easily, directly and permanently accessible" (e-Commerce Directive Art. 5; UK Electronic Commerce Regulations 2002, reg. 6); a contact page linked from the home page is the usual way. ${NOT_CHECKED}`,
    });
  }
  if (!info.privacy.found) {
    flags.push({
      severity: "info",
      message: `No link containing "privacy" found on this home page. If the site collects personal information from California residents (a sign-up form counts), California's CalOPPA requires a conspicuously posted privacy policy; a home-page text link containing the word "privacy" is one of the ways it lists (Business and Professions Code § 22577(b)), not the only one. ${NOT_CHECKED}`,
    });
  }
  if (!info.imprint.found && (/^de\b/i.test(lang ?? "") || /\.de$/i.test(host ?? ""))) {
    flags.push({
      severity: "info",
      message: `No imprint (Impressum) link found on this home page of a German-language or .de site. A business offering paid online services in Germany must keep its name, address and email "easy to recognise, directly reachable and always available" (DDG § 5); missing or incomplete details can be fined up to €50,000 (DDG § 33). ${NOT_CHECKED}`,
    });
  }
  return flags;
}
