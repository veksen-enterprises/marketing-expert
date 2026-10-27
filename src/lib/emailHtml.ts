// Checks an email's HTML (and optional plain-text part and headers) for problems that cost delivery or display.
// Pure: nothing is fetched or stored. Each finding says whether its threshold has a source or is a heuristic;
// heuristics are reported at info only.

import { parse } from "node-html-parser";
import { elementsOf, visibleText, wordCount } from "./text.js";
import { EMAIL_PLAYBOOK } from "./emailDomain.js";

export const CLIP_BYTES = 102 * 1024;
const SRC_CLIP = "https://www.spamresource.com/2022/01/what-is-gmail-clipping-and-what-to-do.html";
const SRC_ALT = "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html";
const SRC_ONE_CLICK = "https://www.rfc-editor.org/rfc/rfc8058";
const SRC_FONTS = "https://www.caniemail.com/features/css-at-font-face/";

export interface EmailHtmlFinding {
  id: string;
  severity: "error" | "warning" | "info";
  message: string;
  examples?: string[];
  /** Where the threshold or rule comes from, or "heuristic" when nothing was found to cite. */
  basis: string;
}

/** Headers as an object or as raw "Name: value" lines; names are matched without case. */
function readHeaders(h: Record<string, string> | string): Map<string, string> {
  const out = new Map<string, string>();
  if (typeof h === "string") {
    // Folded continuation lines (starting with white space) belong to the header above.
    for (const line of h.replace(/\r?\n[ \t]+/g, " ").split(/\r?\n/)) {
      const i = line.indexOf(":");
      if (i > 0) out.set(line.slice(0, i).trim().toLowerCase(), line.slice(i + 1).trim());
    }
  } else for (const [k, v] of Object.entries(h)) out.set(k.toLowerCase(), String(v));
  return out;
}

const UNSUBSCRIBE = /unsubscribe|opt[\s-]?out|d[ée]sabonner|d[ée]sinscri|darse de baja|abmelden|manage (your )?(email )?preferences/i;

export function checkEmailHtml(html: string, text?: string, headers?: Record<string, string> | string) {
  const findings: EmailHtmlFinding[] = [];
  const add = (f: EmailHtmlFinding) => findings.push(f);
  const root = parse(html, { parseNoneClosedTags: true, blockTextElements: { script: true, style: true, noscript: true } });
  const all = elementsOf(root);
  const body = all.find((e) => e.tagName === "BODY") ?? root;
  const words = wordCount(visibleText(body));

  const bytes = Buffer.byteLength(html, "utf8");
  if (bytes > CLIP_BYTES)
    add({
      id: "gmail-clip",
      severity: "warning",
      message: `The HTML is ${(bytes / 1024).toFixed(1)} KB. Gmail cuts messages whose HTML is over about 102 KB and hides the rest behind "View entire message", often including the unsubscribe link and tracking pixel. Google publishes no number; senders measure the cut at 102 to 110 KB depending on encoding.`,
      basis: `practitioner measurement: ${SRC_CLIP}`,
    });

  if (!text?.trim())
    add({ id: "no-text-part", severity: "info", message: "No plain-text part. Send multipart/alternative with a text version: some readers and filters use it, and HTML-only mail looks more like bulk mail.", basis: "heuristic" });

  const imgs = all.filter((e) => e.tagName === "IMG");
  // Tracking pixels (1x1) are not content images.
  const content = imgs.filter((i) => !(i.getAttribute("width") === "1" && i.getAttribute("height") === "1"));
  const noAlt = content.filter((i) => i.getAttribute("alt") === undefined);
  if (noAlt.length)
    add({
      id: "img-no-alt",
      severity: "warning",
      message: `${noAlt.length} of ${content.length} images have no alt attribute. Many clients block images until the reader allows them, and screen readers then read nothing (or the file name). Give each image alt text, or alt="" if it is decoration.`,
      examples: noAlt.slice(0, 5).map((i) => i.getAttribute("src") ?? "(no src)"),
      basis: SRC_ALT,
    });
  if (content.length && words < 50 * content.length && words < 200)
    add({ id: "image-heavy", severity: "info", message: `${content.length} images and ${words} words of text. With images blocked, the reader sees little; mostly-image mail is also a common spam pattern. Put the message in live text.`, basis: "heuristic" });

  const links = all.filter((e) => e.tagName === "A" && e.hasAttribute("href")).map((a) => ({ a, href: (a.getAttribute("href") ?? "").trim() }));
  const insecure = links.filter((l) => /^http:\/\//i.test(l.href)).map((l) => l.href);
  if (insecure.length) add({ id: "http-links", severity: "info", message: `${insecure.length} links use http://, not https://. Browsers warn on some, and they look careless next to a sender's https site.`, examples: [...new Set(insecure)].slice(0, 5), basis: "heuristic" });

  const unsubLink = links.some((l) => UNSUBSCRIBE.test(l.href) || UNSUBSCRIBE.test(visibleText(l.a)));
  if (!unsubLink)
    add({
      id: "no-unsubscribe-link",
      severity: "warning",
      message: "No visible unsubscribe link found in the body (searched link text and addresses for unsubscribe, opt out, manage preferences, and French, Spanish and German equivalents). Gmail asks bulk senders for a visible link in marketing mail as well as the header. Ignore this for transactional mail.",
      basis: EMAIL_PLAYBOOK,
    });

  let headersChecked = false;
  if (headers !== undefined) {
    headersChecked = true;
    const h = readHeaders(headers);
    const lu = h.get("list-unsubscribe");
    const post = h.get("list-unsubscribe-post");
    if (!lu) add({ id: "no-list-unsubscribe", severity: "warning", message: "No List-Unsubscribe header. Gmail and Yahoo require one-click unsubscribe (List-Unsubscribe plus List-Unsubscribe-Post) on bulk marketing mail.", basis: SRC_ONE_CLICK });
    else {
      if (!/<https:\/\//i.test(lu)) add({ id: "list-unsubscribe-no-https", severity: "warning", message: "List-Unsubscribe has no https URI. One-click unsubscribe needs an https URI in angle brackets; a mailto: alone isn't one-click.", examples: [lu.slice(0, 200)], basis: SRC_ONE_CLICK });
      if (!post || !/^List-Unsubscribe=One-Click$/i.test(post.trim()))
        add({ id: "no-one-click", severity: "warning", message: 'List-Unsubscribe-Post: List-Unsubscribe=One-Click is missing or different, so this is not one-click unsubscribe.', examples: post ? [post] : undefined, basis: SRC_ONE_CLICK });
    }
  }

  // Remote fonts and stylesheets.
  const styles = all.filter((e) => e.tagName === "STYLE").map((e) => e.rawText).join("\n") + all.map((e) => e.getAttribute("style") ?? "").join("\n");
  const sheetLinks = all.filter((e) => e.tagName === "LINK" && /stylesheet/i.test(e.getAttribute("rel") ?? "")).map((e) => e.getAttribute("href") ?? "");
  const fontLinks = sheetLinks.filter((h) => /font/i.test(h));
  const fontFace = /@font-face/i.test(styles) || /@import[^;]*font/i.test(styles);
  if (fontLinks.length || fontFace)
    add({ id: "remote-fonts", severity: "info", message: "Web fonts (@font-face, or a font stylesheet). Gmail on the web ignores them and some Outlook versions fall back to Times New Roman: name a fallback font stack in every font-family.", examples: fontLinks.slice(0, 3), basis: SRC_FONTS });
  const otherSheets = sheetLinks.filter((h) => !/font/i.test(h));
  if (otherSheets.length || /@import/i.test(styles.replace(/@import[^;]*font[^;]*;/gi, "")))
    add({ id: "remote-css", severity: "info", message: "CSS loaded from another file (<link rel=stylesheet> or @import). Many email clients drop it; put the CSS in a <style> block or inline it.", examples: otherSheets.slice(0, 3), basis: "heuristic" });

  return {
    bytes,
    words,
    images: content.length,
    links: links.length,
    findings,
    learnMore: [EMAIL_PLAYBOOK],
    notChecked: [
      ...(headersChecked ? [] : ["Headers were not passed, so List-Unsubscribe and one-click unsubscribe were not checked."]),
      "How each client renders the message, spam-filter scores, the sending domain's SPF, DKIM and DMARC (check_email_domain does that), and whether links work.",
      "Size is measured on the HTML as passed; Gmail counts the encoded HTML part, which can be larger.",
    ],
  };
}
