// Platform copy limits. Checked 2026-10-04 via searches scoped to official help domains.
// `max` = platform rejects longer text. `recommended` = truncation / guidance point.
// `verified: false` means we could not confirm the number from an official source: treat as a warning only.
// Platforms change these; update `CHECKED_ON` when you re-verify.

export const CHECKED_ON = "2026-10-04";

export type CountingRule = "plain" | "cjk-double" | "x-links-23";

export interface FieldLimit {
  max?: number;
  recommended?: number;
  verified: boolean;
  note?: string;
}

export interface PlatformSpec {
  label: string;
  counting: CountingRule;
  source: string;
  fields: Record<string, FieldLimit>;
}

export const PLATFORM_LIMITS: Record<string, PlatformSpec> = {
  google_rsa: {
    label: "Google Ads responsive search ad",
    counting: "cjk-double",
    source: "https://support.google.com/google-ads/answer/7684791",
    fields: {
      headline: { max: 30, verified: true, note: "3–15 headlines" },
      description: { max: 90, verified: true, note: "2–4 descriptions" },
      path: { max: 15, verified: true },
      sitelink_text: { max: 25, verified: true },
      sitelink_description: { max: 35, verified: true },
      callout: { max: 25, verified: true },
      structured_snippet_value: { max: 25, verified: true },
    },
  },
  google_pmax: {
    label: "Google Performance Max",
    counting: "cjk-double",
    source: "https://support.google.com/google-ads/answer/14528373",
    fields: {
      headline: { max: 30, verified: true, note: "3–15; at least one ≤15 recommended" },
      long_headline: { max: 90, verified: true, note: "1–5" },
      description: { max: 90, verified: true, note: "2–5; at least one must be ≤60" },
      business_name: { max: 25, verified: true },
    },
  },
  google_demand_gen: {
    label: "Google Demand Gen",
    counting: "cjk-double",
    source: "https://support.google.com/google-ads/answer/17091672",
    fields: {
      headline: { max: 40, recommended: 30, verified: true, note: "at least one headline ≤30 or the ad can't serve on Display" },
      description: { max: 90, verified: true },
      business_name: { max: 25, verified: true },
    },
  },
  microsoft_rsa: {
    label: "Microsoft Advertising responsive search ad",
    counting: "plain",
    source: "https://learn.microsoft.com/en-us/advertising/campaign-management-service/responsivesearchad?view=bingads-13",
    fields: {
      headline: { max: 30, verified: true, note: "limit applies after dynamic text substitution" },
      description: { max: 90, verified: true, note: "limit applies after dynamic text substitution" },
      path: { max: 15, verified: true },
    },
  },
  meta_feed: {
    label: "Meta (Facebook/Instagram) feed ad",
    counting: "plain",
    source: "https://www.facebook.com/business/ads-guide/update/image/facebook-feed/link-clicks",
    fields: {
      primary_text: { recommended: 150, verified: true, note: "Meta Ads Guide recommends 50–150 (re-checked 2026-10-04). No hard max or ~125 'See more' cut-off published by Meta; third-party 2,200/125 figures unconfirmed" },
      headline: { recommended: 27, verified: true, note: "recommended length (Meta Ads Guide, re-checked 2026-10-04); hard max not published by Meta (third-party sites claim 255)" },
      description: { verified: false, note: "no feed-image description length found in Meta Ads Guide; often hidden depending on placement" },
    },
  },
  meta_carousel: {
    label: "Meta carousel ad",
    counting: "plain",
    source: "https://www.facebook.com/business/ads-guide/update/carousel",
    fields: {
      primary_text: { recommended: 80, verified: true },
      headline: { recommended: 45, verified: true },
      description: { recommended: 18, verified: true },
    },
  },
  linkedin_single_image: {
    label: "LinkedIn single image ad",
    counting: "plain",
    source: "https://www.linkedin.com/help/lms/answer/a426534",
    fields: {
      intro_text: { max: 600, recommended: 150, verified: false, note: "150 to avoid truncation confirmed on linkedin.com 2026-10-04; hard max unresolved: linkedin.com snippets show both 600 and 3,000. 600 kept as the conservative cap" },
      headline: { max: 200, recommended: 70, verified: true },
      description: { max: 300, recommended: 100, verified: true, note: "only shown in some placements" },
    },
  },
  linkedin_text_ad: {
    label: "LinkedIn text ad",
    counting: "plain",
    source: "https://www.linkedin.com/help/lms/answer/a423705",
    fields: {
      headline: { max: 25, verified: true },
      description: { max: 75, verified: true },
    },
  },
  linkedin_message_ad: {
    label: "LinkedIn message ad",
    counting: "plain",
    source: "https://www.linkedin.com/help/lms/answer/a425533",
    fields: {
      subject: { max: 60, verified: true },
      body: { max: 1500, verified: true },
      cta: { max: 20, verified: true },
    },
  },
  x_post: {
    label: "X post / promoted post",
    counting: "x-links-23",
    source: "https://business.x.com/en/help/campaign-setup/creative-ad-specifications",
    fields: {
      text: { max: 280, verified: true, note: "each URL counts as 23, bare domains like acme.io too; CJK characters and each emoji count as 2" },
      card_title: { max: 70, verified: true },
    },
  },
  tiktok_in_feed: {
    label: "TikTok in-feed ad",
    counting: "plain",
    source: "https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads",
    fields: {
      ad_text: { max: 100, recommended: 60, verified: true, note: "100 for English; varies by language" },
      display_name: { max: 20, recommended: 10, verified: true },
    },
  },
  serp: {
    label: "Google search result (display approximation)",
    counting: "plain",
    source: "https://developers.google.com/search/docs/appearance/title-link",
    fields: {
      title: { recommended: 60, verified: true, note: "truncation is pixel-based (~600px); Google often rewrites titles" },
      meta_description: { recommended: 155, verified: true, note: "~155–160 desktop, ~120 mobile; Google often picks its own snippet" },
    },
  },
  email: {
    label: "Email inbox display (approximate)",
    counting: "plain",
    source: "https://www.campaignmonitor.com/blog/email-marketing/best-email-subject-line-length/",
    fields: {
      subject: { recommended: 50, verified: true, note: "~25–40 visible on mobile; front-load the meaning" },
      preheader: { recommended: 90, verified: true, note: "~35–50 visible on mobile" },
    },
  },
  open_graph: {
    label: "Open Graph share card (no official limit)",
    counting: "plain",
    source: "https://ahrefs.com/blog/open-graph-meta-tags/",
    fields: {
      title: { recommended: 60, verified: false },
      description: { recommended: 120, verified: false },
    },
  },
};

// Wide (CJK, fullwidth) characters count as 2 in Google Ads.
const WIDE = /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/u;

// X (twitter-text): every URL counts 23, including bare domains such as acme.io. Trailing punctuation is not
// part of the URL. Bare domains are matched only for the common TLDs below, so "node.js" stays text.
const URL_RE = /\bhttps?:\/\/\S+|(?<![\w@.\/-])(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+([a-z]{2,})(?::\d+)?(?:\/\S*)?/gi;
const TLDS = new Set(
  ("com net org edu gov info biz app dev xyz tech shop store online site blog cloud io ai co me tv ly gg " +
    "us uk de fr es it nl be ch at se no dk fi pl pt ie ca mx br ar au nz jp cn kr tw hk sg in id za eu").split(" ")
);
const TRAILING = /[.,;:!?'"’”)\]]+$/;
// Weight 1 in these code point ranges, 2 everywhere else; an emoji sequence counts 2 in all.
const LIGHT = /[\u0000-\u10FF\u2000-\u200D\u2010-\u201F\u2032-\u2037]/u;
const EMOJI = /\p{Extended_Pictographic}|\p{Regional_Indicator}/u;

function xWeight(text: string): number {
  let n = 0;
  for (const { segment } of new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text)) {
    if (EMOJI.test(segment)) n += 2;
    else for (const c of segment) n += LIGHT.test(c) ? 1 : 2;
  }
  return n;
}

export function countChars(text: string, rule: CountingRule): number {
  const chars = Array.from(text);
  if (rule === "cjk-double") return chars.reduce((n, c) => n + (WIDE.test(c) ? 2 : 1), 0);
  if (rule === "x-links-23") {
    let urls = 0;
    const rest = text.normalize("NFC").replace(URL_RE, (m: string, tld: string | undefined) => {
      if (tld !== undefined && !TLDS.has(tld.toLowerCase())) return m;
      urls++;
      return TRAILING.exec(m)?.[0] ?? "";
    });
    return xWeight(rest) + urls * 23;
  }
  return chars.length;
}
