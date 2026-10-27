// crawl_site's soft 404 probe: a path that can't exist must answer 404 or 410, not a page with HTTP 200.
import { describe, it, expect } from "vitest";
import { crawlSite, SOFT_404_PATH, type FetchFn } from "../src/lib/crawl.js";

const B = "https://site.test";
const page = (t: string) => new Response(`<html><head><title>${t}</title></head><body><h1>${t}</h1></body></html>`, { status: 200, headers: { "content-type": "text/html" } });
const notFound = () => new Response("not found", { status: 404, headers: { "content-type": "text/html" } });
const run = (fetchFn: FetchFn) => crawlSite({ startUrl: `${B}/`, useSitemap: false, fetchFn });
const soft = (r: Awaited<ReturnType<typeof run>>) => r.issues.find((i) => i.id === "soft-404");

describe("soft 404 probe", () => {
  it("flags a site that answers 200 for a path that can't exist", async () => {
    const r = await run(async (u) => (new URL(u).pathname === "/robots.txt" ? notFound() : page("Home")));
    expect(soft(r)).toMatchObject({ severity: "warning", examples: [`${B}${SOFT_404_PATH}`] });
  });
  it("flags a missing page that redirects to a page answering 200", async () => {
    const r = await run(async (u) => {
      const p = new URL(u).pathname;
      if (p === "/") return page("Home");
      if (p === SOFT_404_PATH) return new Response(null, { status: 302, headers: { location: "/" } });
      return notFound();
    });
    expect(soft(r)?.message).toMatch(/redirects/);
  });
  it("is quiet when the site answers 404 or 410", async () => {
    for (const status of [404, 410]) {
      const r = await run(async (u) => (new URL(u).pathname === "/" ? page("Home") : new Response("gone", { status })));
      expect(soft(r)).toBeUndefined();
      expect(r.notes.join(" ")).not.toMatch(/soft 404/i);
    }
  });
  it("says the probe wasn't checked when robots.txt disallows it", async () => {
    const r = await run(async (u) => {
      const p = new URL(u).pathname;
      if (p === "/robots.txt") return new Response("User-agent: *\nDisallow: /", { headers: { "content-type": "text/plain" } });
      return page("Home");
    });
    expect(soft(r)).toBeUndefined();
    expect(r.notes.join(" ")).toMatch(/soft 404 probe was not run/i);
  });
});
