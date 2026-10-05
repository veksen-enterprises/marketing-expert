// Visible text of an element, with a space at every block or item boundary. node-html-parser's
// structuredText only separates block elements, so sibling links in a nav ("<a>Search</a><a>IAS calculator</a>")
// came out as "SearchIAS calculator" and the word count was too low. Inline formatting (span, b, em) stays
// glued so "<b>Game</b>Companion" is still one word.
// Pages are untrusted, so these helpers walk the tree with a loop and an explicit stack: unclosed tags can nest
// elements thousands of levels deep, and recursion runs out of stack.

import { HTMLElement, Node } from "node-html-parser";

const SKIP = new Set(["script", "style", "noscript", "template", "svg", "head"]);
const BREAK = new Set([
  // block
  "address", "article", "aside", "blockquote", "body", "dd", "details", "dialog", "div", "dl", "dt", "fieldset",
  "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "html", "li", "main",
  "nav", "ol", "p", "pre", "section", "summary", "table", "tbody", "thead", "tfoot", "tr", "td", "th", "ul", "caption",
  // separate items that are inline but never part of a neighbouring word
  "a", "br", "button", "img", "input", "label", "option", "select", "textarea", "output", "meter", "progress",
]);

/** `end`: stop at the first node that starts at or after this offset in the parsed HTML. */
export function visibleText(el: HTMLElement | null | undefined, end = Infinity): string {
  if (!el) return "";
  const out: string[] = [];
  // " " entries stand for the space after a block element's children.
  const stack: Array<Node | " "> = [el];
  while (stack.length) {
    const n = stack.pop()!;
    if (n === " ") {
      out.push(" ");
      continue;
    }
    if (n !== el && n.range[0] >= end) break;
    if (n.nodeType === 3) {
      out.push(n.text);
      continue;
    }
    if (n.nodeType !== 1) continue;
    const tag = (n as HTMLElement).rawTagName?.toLowerCase() ?? "";
    if (SKIP.has(tag)) continue;
    if (BREAK.has(tag)) {
      out.push(" ");
      stack.push(" ");
    }
    for (let i = n.childNodes.length - 1; i >= 0; i--) stack.push(n.childNodes[i]);
  }
  return out.join("").replace(/\s+/g, " ").trim();
}

export function countWords(el: HTMLElement | null | undefined): number {
  return wordCount(visibleText(el));
}

// Scripts written without spaces between words. Korean uses spaces, so it is not here.
const UNSPACED = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}\p{Script=Lao}\p{Script=Khmer}\p{Script=Myanmar}]/u;
const wordSegmenter = new Intl.Segmenter(undefined, { granularity: "word" });

/**
 * Words in `text`: the runs between spaces, except that Chinese, Japanese, Thai and similar text, which has no
 * spaces between words, is split into words by Intl.Segmenter. Counting runs made a whole Japanese paragraph one word.
 */
export function wordCount(text: string): number {
  const runs = text.match(/\S+/g) ?? [];
  if (!UNSPACED.test(text)) return runs.length;
  let n = 0;
  for (const run of runs) {
    if (!UNSPACED.test(run)) n++;
    else for (const s of wordSegmenter.segment(run)) if (s.isWordLike) n++;
  }
  return n;
}

/**
 * The elements inside `root` in document order, leaving out `skip` tags (lower case) and everything in them.
 * Use instead of querySelectorAll, which copies its result list once per child: 1 MB of plain links took 40 s.
 */
export function elementsOf(root: HTMLElement, skip: ReadonlySet<string> = new Set()): HTMLElement[] {
  const out: HTMLElement[] = [];
  const stack: Node[] = [...root.childNodes].reverse();
  while (stack.length) {
    const n = stack.pop()!;
    if (n.nodeType !== 1 || skip.has((n as HTMLElement).rawTagName?.toLowerCase() ?? "")) continue;
    out.push(n as HTMLElement);
    for (let i = n.childNodes.length - 1; i >= 0; i--) stack.push(n.childNodes[i]);
  }
  return out;
}

const SVG = new Set(["svg"]);

/** The page's <title>: the first one outside inline <svg>, where <title> is an icon's tooltip. */
export function documentTitle(root: HTMLElement): HTMLElement | null {
  return elementsOf(root, SVG).find((e) => e.tagName === "TITLE") ?? null;
}

/**
 * Directives in a robots meta tag's content or an X-Robots-Tag header, in lower case. "none" means noindex and
 * nofollow. A crawler name before a directive ("googlebot: noindex", X-Robots-Tag only) is dropped; the value of
 * "max-image-preview:none" is not a directive.
 */
export function robotsDirectives(value: string): Set<string> {
  const out = new Set<string>();
  for (const part of value.toLowerCase().split(",")) {
    const d = part.trim().replace(/^(?!max-|unavailable_after)[\w-]+\s*:\s*/, "");
    if (d === "none") out.add("noindex").add("nofollow");
    else out.add(d);
  }
  return out;
}

/** The robots meta tags Google obeys, in `elements`: every <meta name="robots"> and <meta name="googlebot">, name in any case. */
export function robotsMetaTags(elements: HTMLElement[]): Array<{ name: "robots" | "googlebot"; content: string }> {
  const out: Array<{ name: "robots" | "googlebot"; content: string }> = [];
  for (const e of elements) {
    const name = e.tagName === "META" ? e.getAttribute("name")?.trim().toLowerCase() : undefined;
    if (name === "robots" || name === "googlebot") out.push({ name, content: e.getAttribute("content")?.trim() ?? "" });
  }
  return out;
}
