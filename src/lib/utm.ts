// UTM link builder with the naming hygiene that keeps GA4 reports usable.

export interface UtmInput {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
  id?: string;
}

// GA4 default channel grouping matches on these medium values. It has no rule for "qr" or "print":
// that traffic lands in "Unassigned".
const KNOWN_MEDIUMS = new Set([
  "social", "social-network", "social-media", "sm", "organic_social", "email", "e-mail", "e_mail", "affiliate", "referral",
  "app", "link", "display", "banner", "expandable", "interstitial", "audio", "sms", "organic",
]);
// GA4's pattern rules: paid (anything with "cp", ppc, retargeting, paid...), video, and mobile push.
const KNOWN_MEDIUM_RE = /^(?:.*cp.*|ppc|retargeting|paid.*)$|video|push$|mobile|notification/;

export function buildUtm(i: UtmInput): { url: string; warnings: string[] } {
  const warnings: string[] = [];
  let u: URL;
  try {
    u = new URL(i.url);
  } catch {
    throw new RangeError(`invalid url: ${i.url}. Give the full address, starting with https://`);
  }
  // "localhost:3000/x" and "www.acme.io:8080/x" parse with "localhost:" or "www.acme.io:" as the scheme;
  // javascript:, data: and file: links must never come out as campaign links.
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new RangeError(`url must start with https:// or http:// (got "${i.url}"). Add https:// in front of the address.`);
  for (const k of ["source", "medium", "campaign"] as const) {
    if (!i[k].trim()) throw new RangeError(`${k} is empty; GA4 would show it as "(not set)".`);
  }
  const params: Array<[string, string | undefined]> = [
    ["utm_source", i.source],
    ["utm_medium", i.medium],
    ["utm_campaign", i.campaign],
    ["utm_term", i.term],
    ["utm_content", i.content],
    ["utm_id", i.id],
  ];
  for (const [k, raw] of params) {
    if (raw === undefined || raw === "") continue;
    const v = raw.trim();
    if (v !== v.toLowerCase()) warnings.push(`${k}="${v}" has uppercase; GA4 is case-sensitive, so "Email" and "email" become separate rows. Lowercased.`);
    if (/\s/.test(v)) warnings.push(`${k}="${v}" contains spaces; replaced with "-".`);
    if (u.searchParams.has(k)) warnings.push(`${k} already present in the URL; overwritten.`);
    u.searchParams.set(k, v.toLowerCase().replace(/\s+/g, "-"));
  }
  const medium = i.medium.trim().toLowerCase().replace(/\s+/g, "-");
  if (!KNOWN_MEDIUMS.has(medium) && !KNOWN_MEDIUM_RE.test(medium)) {
    warnings.push(`utm_medium="${medium}" isn't a value GA4's default channel grouping recognises; traffic may land in "Unassigned". Common values: cpc, paid_social, email, social, referral, affiliate, display.`);
  }
  if (["google", "facebook", "linkedin"].includes(medium)) warnings.push("utm_medium looks like a source. Medium is the channel type (cpc, email); source is the platform.");
  if (u.protocol === "http:") warnings.push("URL is http; redirects to https can drop parameters on some setups.");
  return { url: u.toString(), warnings };
}
