// check_email_html: size, text part, images, links, unsubscribe and remote fonts or CSS.
import { describe, it, expect } from "vitest";
import { checkEmailHtml } from "../src/lib/emailHtml.js";

const words = (n: number) => "word ".repeat(n);
const cleanHtml = `<html><head><style>p{font-family:Arial,sans-serif}</style></head><body><p>${words(120)}</p><img src="https://x.test/a.png" alt="Our new mug"><img src="https://x.test/p.gif" width="1" height="1"><a href="https://x.test/shop">Shop</a> <a href="https://x.test/u?id=1">Unsubscribe</a></body></html>`;
const oneClick = { "List-Unsubscribe": "<https://x.test/u?id=1>, <mailto:u@x.test>", "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" };
const ids = (r: ReturnType<typeof checkEmailHtml>) => r.findings.map((f) => f.id);

describe("checkEmailHtml", () => {
  it("passes a clean message with a text part and one-click headers", () => {
    const r = checkEmailHtml(cleanHtml, "Our new mug. Shop: https://x.test/shop", oneClick);
    expect(r.findings).toEqual([]);
    expect(r.images).toBe(1);
  });
  it("flags each problem, marking uncited thresholds as heuristics at info", () => {
    const bad = `<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter"><link rel="stylesheet" href="https://x.test/e.css"></head><body><img src="https://x.test/hero.png"><img src="https://x.test/b.png" alt=""><a href="http://x.test/shop">Shop now</a><!--${"x".repeat(105 * 1024)}--></body></html>`;
    const r = checkEmailHtml(bad);
    expect(ids(r)).toEqual(["gmail-clip", "no-text-part", "img-no-alt", "image-heavy", "http-links", "no-unsubscribe-link", "remote-fonts", "remote-css"]);
    for (const f of r.findings) if (f.basis === "heuristic") expect(f.severity).toBe("info");
    expect(r.notChecked.join(" ")).toMatch(/Headers were not passed/);
  });
  it("reads raw headers, folded lines included, and requires an https URI and the One-Click post header", () => {
    expect(ids(checkEmailHtml(cleanHtml, "t", "From: a@x.test\r\nList-Unsubscribe: <mailto:u@x.test>\r\n"))).toEqual(["list-unsubscribe-no-https", "no-one-click"]);
    expect(ids(checkEmailHtml(cleanHtml, "t", "List-Unsubscribe: <https://x.test/u>,\r\n <mailto:u@x.test>\r\nList-Unsubscribe-Post: List-Unsubscribe=One-Click\r\n"))).toEqual([]);
    expect(ids(checkEmailHtml(cleanHtml, "t", {}))).toEqual(["no-list-unsubscribe"]);
  });
  it("finds an unsubscribe link in French", () => {
    expect(ids(checkEmailHtml(cleanHtml.replace("Unsubscribe", "Se désabonner").replace("/u?id=1", "/x"), "t"))).toEqual([]);
  });
});
