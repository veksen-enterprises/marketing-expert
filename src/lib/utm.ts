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

// GA4 default channel grouping matches on these medium values (non-exhaustive).
const KNOWN_MEDIUMS = new Set([
  "cpc", "ppc", "paid", "paidsearch", "paid-social", "paid_social", "paidsocial", "social", "organic_social", "email",
  "affiliate", "referral", "display", "banner", "cpm", "video", "audio", "sms", "push", "organic", "print", "qr",
]);

export function buildUtm(i: UtmInput): { url: string; warnings: string[] } {
  const warnings: string[] = [];
  let u: URL;
  try {
    u = new URL(i.url);
  } catch {
    throw new RangeError(`invalid url: ${i.url}`);
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
  const medium = i.medium.trim().toLowerCase();
  if (!KNOWN_MEDIUMS.has(medium)) {
    warnings.push(`utm_medium="${medium}" isn't a value GA4's default channel grouping recognises; traffic may land in "Unassigned". Common values: cpc, paid_social, email, social, referral, affiliate, display.`);
  }
  if (["google", "facebook", "linkedin"].includes(medium)) warnings.push("utm_medium looks like a source. Medium is the channel type (cpc, email); source is the platform.");
  if (u.protocol === "http:") warnings.push("URL is http; redirects to https can drop parameters on some setups.");
  return { url: u.toString(), warnings };
}
