// Visible text of an element, with a space at every block or item boundary. node-html-parser's
// structuredText only separates block elements, so sibling links in a nav ("<a>Search</a><a>IAS calculator</a>")
// came out as "SearchIAS calculator" and the word count was too low. Inline formatting (span, b, em) stays
// glued so "<b>Game</b>Companion" is still one word.

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

export function visibleText(el: HTMLElement | null | undefined): string {
  if (!el) return "";
  const out: string[] = [];
  const walk = (n: Node) => {
    if (n.nodeType === 3) {
      out.push(n.text);
      return;
    }
    if (n.nodeType !== 1) return;
    const tag = (n as HTMLElement).rawTagName?.toLowerCase() ?? "";
    if (SKIP.has(tag)) return;
    const brk = BREAK.has(tag);
    if (brk) out.push(" ");
    for (const c of n.childNodes) walk(c);
    if (brk) out.push(" ");
  };
  walk(el);
  return out.join("").replace(/\s+/g, " ").trim();
}

export function countWords(el: HTMLElement | null | undefined): number {
  return (visibleText(el).match(/\S+/g) ?? []).length;
}
