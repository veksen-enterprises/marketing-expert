// Regression tests for network and parsing safety findings (SSRF forms, unbounded bodies, slow parsing,
// robots.txt matching, sitemap and per-page crawl errors).
import { describe, it, expect, afterEach, vi } from "vitest";
import { createServer } from "node:http";
import { gzipSync } from "node:zlib";
import { isBlockedIp, assertPublicUrl, guardedFetch, readCapped } from "../src/lib/netguard.js";
import { auditHtml, fetchAndAudit } from "../src/lib/pageAudit.js";
import { crawlSite, type FetchFn } from "../src/lib/crawl.js";
import { parseRobots, robotsAllows } from "../src/lib/robots.js";
import { checkAiCrawlerAccess } from "../src/lib/aiCrawlers.js";

const B = "https://example.com";
const page = (title: string, body: string) => `<html><head><title>${title}</title></head><body>${body}</body></html>`;
/** fetchFn over a map of path -> [status, content-type, body]. */
const siteFetch =
  (site: Record<string, [number, string, string | (() => BodyInit)]>): FetchFn =>
  async (url) => {
    const p = site[new URL(url).pathname];
    if (!p) return new Response("not found", { status: 404, headers: { "content-type": "text/html" } });
    const body = typeof p[2] === "function" ? p[2]() : p[2];
    return new Response(body, { status: p[0], headers: { "content-type": p[1] } });
  };

describe("SSRF guard: IPv6 addresses that carry an IPv4 address", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });
  // WHATWG URL rewrites [::ffff:127.0.0.1] to [::ffff:7f00:1], so the guard sees the hex form.
  it.each([
    "http://[::ffff:127.0.0.1]:6379/",
    "http://[::ffff:169.254.169.254]/latest/meta-data/",
    "http://[::ffff:10.0.0.1]/",
    "http://[::127.0.0.1]/",
    "http://[64:ff9b::169.254.169.254]/",
    "http://[64:ff9b:1::a00:1]/",
    "http://[2002:7f00:1::]/",
    "http://[2002:c0a8:101::1]/",
    "http://[fec0::1]/",
  ])("blocks %s", async (url) => {
    await expect(assertPublicUrl(url)).rejects.toThrow(/non-public address/);
  });
  // SIIT (::ffff:0:0:0/96), 64:ff9b::/64 outside the /96, Teredo, discard-only and documentation ranges.
  it.each([
    "http://[::ffff:0:127.0.0.1]/",
    "http://[64:ff9b::ffff:7f00:1]/",
    "http://[2001:0:4136:e378:8000:63bf:80ff:fffe]/",
    "http://[100::1]/",
    "http://[2001:db8::1]/",
  ])("blocks the non-public form %s", async (url) => {
    await expect(assertPublicUrl(url)).rejects.toThrow(/non-public address/);
  });
  it.each(["::ffff:7f00:1", "::ffff:a9fe:a9fe", "::FFFF:A00:1", "::7f00:1", "64:ff9b::a9fe:a9fe", "2002:a00:1::1", "0:0:0:0:0:ffff:7f00:1"])(
    "isBlockedIp blocks the hex form %s",
    (ip) => expect(isBlockedIp(ip)).toBe(true)
  );
  it.each(["http://[::ffff:8.8.8.8]/", "http://[64:ff9b::808:808]/", "http://[2002:808:808::1]/", "http://[2606:4700:4700::1111]/"])("allows %s", async (url) => {
    await expect(assertPublicUrl(url)).resolves.toBeUndefined();
  });
  it("re-checks a redirect to a mapped metadata address", async () => {
    vi.stubGlobal("fetch", async () => new Response("", { status: 302, headers: { location: "http://[::ffff:169.254.169.254]/latest/meta-data/" } }));
    await expect(guardedFetch("http://8.8.8.8/")).rejects.toThrow(/non-public address/);
  });
});

describe("response size cap", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("readCapped stops reading at the limit", async () => {
    let pulls = 0;
    const chunk = new Uint8Array(1 << 20).fill(97); // 1 MB of "a"
    const body = new ReadableStream<Uint8Array>({
      pull(c) {
        pulls++;
        if (pulls > 50) c.close();
        else c.enqueue(chunk);
      },
    });
    const r = await readCapped(new Response(body), 3 << 20);
    expect(r.truncated).toBe(true);
    expect(r.text.length).toBe(3 << 20);
    expect(pulls).toBeLessThan(10);
    const small = await readCapped(new Response("﻿hé"), 100);
    expect(small).toEqual({ text: "hé", truncated: false });
  });

  it("audit_page reads at most 5 MB of a gzip page and says so", async () => {
    vi.stubEnv("MARKETING_EXPERT_ALLOW_PRIVATE", "1");
    const words = 1_300_000; // 6.5 MB of HTML that gzips to a few KB
    const gz = gzipSync(page("Big", `<h1>Big</h1><p>${"word ".repeat(words)}</p>`));
    const server = createServer((_q, s) => {
      s.writeHead(200, { "content-type": "text/html", "content-encoding": "gzip" });
      s.end(gz);
    });
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", () => r()));
    try {
      const addr = server.address();
      const r = await fetchAndAudit(`http://127.0.0.1:${typeof addr === "object" && addr ? addr.port : 0}/`);
      expect(r.title).toBe("Big");
      expect(r.wordCount).toBeLessThan(words);
      expect(r.flags.map((f) => f.message).join("\n")).toMatch(/larger than 5 MB/);
    } finally {
      server.close();
    }
  });

  it("crawl_site caps page bodies and reports the large page", async () => {
    const big = page("Big", `<h1>Big</h1><p>${"word ".repeat(1_300_000)}</p>`);
    const r = await crawlSite({ startUrl: `${B}/`, useSitemap: false, fetchFn: siteFetch({ "/": [200, "text/html", big] }) });
    expect(r.pagesCrawled).toBe(1);
    expect(r.pages[0].wordCount).toBeLessThan(1_300_000);
    expect(r.issues.find((i) => i.id === "large-html")?.examples).toEqual([`${B}/`]);
  });

  it("ignores robots.txt rules after the first 500 KB, as Google does", async () => {
    const robots = "User-agent: *\nDisallow: /early\n" + "# filler line\n".repeat(40_000) + "Disallow: /late\n";
    const r = await crawlSite({
      startUrl: `${B}/`,
      useSitemap: false,
      fetchFn: siteFetch({
        "/robots.txt": [200, "text/plain", robots],
        "/": [200, "text/html", page("Home", `<h1>Home</h1><a href="/early">e</a><a href="/late">l</a>`)],
        "/late": [200, "text/html", page("Late", "<h1>Late</h1>")],
      }),
    });
    expect(r.robotsDisallowed).toBe(1);
    expect(r.pages.map((p) => p.url)).toContain(`${B}/late`);
    expect(r.notes.join("\n")).toMatch(/robots\.txt is larger than 500 KB/);
  });

  // The 500 KB cut falls inside "Disallow: /private-area": the cut-off "Disallow: /priv" must not be read as a rule.
  const cutRobots = () => {
    const head = "User-agent: *\nDisallow: /early\n";
    return head + "#".repeat(500 * 1024 - head.length - 16) + "\nDisallow: /private-area\n";
  };

  it("drops the robots.txt line that the 500 KB limit cuts in two", async () => {
    const r = await crawlSite({
      startUrl: `${B}/`,
      useSitemap: false,
      fetchFn: siteFetch({
        "/robots.txt": [200, "text/plain", cutRobots()],
        "/": [200, "text/html", page("Home", `<h1>Home</h1><a href="/early">e</a><a href="/private">p</a>`)],
        "/private": [200, "text/html", page("Private", "<h1>Private</h1>")],
      }),
    });
    expect(r.robotsDisallowed).toBe(1);
    expect(r.pages.map((p) => p.url)).toContain(`${B}/private`);
  });

  describe("check_ai_crawler_access reads at most 500 KB of robots.txt", () => {
    const serve = async (handler: Parameters<typeof createServer>[1]) => {
      const server = createServer(handler);
      await new Promise<void>((r) => server.listen(0, "127.0.0.1", () => r()));
      const addr = server.address();
      return { server, url: `http://127.0.0.1:${typeof addr === "object" && addr ? addr.port : 0}/` };
    };

    it("ignores rules after 500 KB, including a cut-off line", async () => {
      vi.stubEnv("MARKETING_EXPERT_ALLOW_PRIVATE", "1");
      const robots = cutRobots() + "Disallow: /late\n";
      const { server, url } = await serve((q, s) => {
        if (q.url !== "/robots.txt") return void s.writeHead(404).end();
        s.writeHead(200, { "content-type": "text/plain" });
        s.end(robots);
      });
      try {
        const r = await checkAiCrawlerAccess(url, ["/early"]);
        expect(r.bots.find((b) => b.token === "GPTBot")?.allowed).toBe(false);
        const late = await checkAiCrawlerAccess(url, ["/private", "/late"]);
        expect(late.bots.find((b) => b.token === "GPTBot")?.allowed).toBe(true);
        expect(late.findings.join("\n")).toMatch(/robots\.txt is larger than 500 KB/);
      } finally {
        server.close();
      }
    });

    it("stops downloading a robots.txt that never ends", async () => {
      vi.stubEnv("MARKETING_EXPERT_ALLOW_PRIVATE", "1");
      const { server, url } = await serve((q, s) => {
        if (q.url !== "/robots.txt") return void s.writeHead(404).end();
        s.writeHead(200, { "content-type": "text/plain" });
        s.write("User-agent: *\nDisallow: /early\n");
        const chunk = "Disallow: /a\n".repeat(5000);
        const timer = setInterval(() => s.write(chunk), 1);
        s.on("close", () => clearInterval(timer));
      });
      try {
        const r = await checkAiCrawlerAccess(url, ["/early"], 4000);
        expect(r.bots.find((b) => b.token === "GPTBot")?.allowed).toBe(false);
        expect(r.findings.join("\n")).toMatch(/robots\.txt is larger than 500 KB/);
      } finally {
        server.closeAllConnections();
        server.close();
      }
    }, 15000);
  });

  it("stops collecting sitemap URLs at 100,000", async () => {
    const locs = Array.from({ length: 100_050 }, (_, i) => `<url><loc>${B}/p${i}</loc></url>`).join("");
    const r = await crawlSite({
      startUrl: `${B}/`,
      maxPages: 1,
      fetchFn: siteFetch({
        "/sitemap.xml": [200, "application/xml", `<urlset>${locs}</urlset>`],
        "/": [200, "text/html", page("Home", "<h1>Home</h1>")],
      }),
    });
    expect(r.sitemapUrls).toBe(100_000);
    expect(r.notes.join("\n")).toMatch(/first 100,000 sitemap URLs/);
    expect(r.issues.find((i) => i.id === "not-in-sitemap")).toBeUndefined();
  });
});

describe("HTML parsing stays fast on large and malformed pages", () => {
  const unclosed = page("t", "<h1>Hello</h1>" + "<div>".repeat(4000) + "hi").replace("</body></html>", "");

  it("auditHtml", () => {
    const t = Date.now();
    const r = auditHtml(unclosed, `${B}/`);
    expect(Date.now() - t).toBeLessThan(1500);
    expect(r.title).toBe("t");
    expect(r.h1s).toEqual(["Hello"]);
    expect(r.wordCount).toBe(2);
  });

  it("crawl_site", async () => {
    const t = Date.now();
    const r = await crawlSite({ startUrl: `${B}/`, useSitemap: false, fetchFn: siteFetch({ "/": [200, "text/html", unclosed] }) });
    expect(Date.now() - t).toBeLessThan(1500);
    expect(r.pages[0].title).toBe("t");
  });

  // node-html-parser's querySelectorAll copies its result list once per child: 1 MB of plain links took 40 s.
  const linkPage = page("Links", "<h1>Links</h1>" + '<a href="/x">a</a>'.repeat(30_000) + '<img src="x.png">'.repeat(10_000) + "<button>Go</button>".repeat(5_000));

  it("auditHtml reads a large page of plain links and images quickly", () => {
    const t = Date.now();
    const r = auditHtml(linkPage, `${B}/`);
    expect(Date.now() - t).toBeLessThan(2000);
    expect(r.links.internal).toBe(30_000);
    expect(r.images).toBe(10_000);
    expect(r.imagesMissingAlt).toBe(10_000);
    expect(r.ctaCandidates).toEqual(["Go"]);
  });

  it("crawl_site reads a large page of plain links quickly", async () => {
    const t = Date.now();
    const r = await crawlSite({ startUrl: `${B}/`, maxPages: 1, useSitemap: false, fetchFn: siteFetch({ "/": [200, "text/html", linkPage] }) });
    expect(Date.now() - t).toBeLessThan(2000);
    expect(r.pages[0].title).toBe("Links");
    expect(r.limitReached).toBe(true);
  });

  it("auditHtml reads a page with thousands of unclosed tags", () => {
    const r = auditHtml(page("t", "<h1>Hello</h1>" + "<div>".repeat(6000) + "text here"), `${B}/`);
    expect(r.h1s).toEqual(["Hello"]);
    expect(r.wordCount).toBe(3);
  });

  it("stays fast on links and headings nested inside each other", () => {
    const t = Date.now();
    const r = auditHtml(page("t", '<a href="/x">Start now'.repeat(20_000) + "<h2><b>Plan".repeat(20_000)), `${B}/`);
    expect(Date.now() - t).toBeLessThan(2000);
    expect(r.links.internal).toBe(20_000);
    expect(r.ctaCandidates).toEqual(["Start now"]);
    expect(r.headings.slice(0, 2)).toEqual([
      { level: 2, text: "Plan" },
      { level: 2, text: "Plan" },
    ]);
  });

  it("ends an element's text at its own end tag when a tag inside it is left open", () => {
    const r = auditHtml(
      page("t", `<h1><span class=hl>Ship code faster</h1><p>We help teams ship faster.</p><a class=btn href=/signup><b>Start free trial</a><p>More text.</p>`),
      `${B}/`
    );
    expect(r.h1s).toEqual(["Ship code faster"]);
    expect(r.ctaCandidates).toEqual(["Start free trial"]);
    expect(r.wordCount).toBe(13);
  });

  it("caps the HTML that auditHtml parses", () => {
    const r = auditHtml(page("Big", `<p>${"word ".repeat(1_100_000)}</p>`));
    expect(r.wordCount).toBeLessThan(1_100_000);
    expect(r.flags.map((f) => f.message).join("\n")).toMatch(/larger than 5 MB/);
  });
});

describe("robots.txt matching", () => {
  it("is linear in the number of wildcards", () => {
    const rules = parseRobots("User-agent: *\nDisallow: /" + "*-".repeat(22) + "zz\n");
    const t = Date.now();
    expect(robotsAllows(rules, `${B}/` + "a-".repeat(30))).toBe(true);
    expect(Date.now() - t).toBeLessThan(200);
    expect(robotsAllows(rules, `${B}/` + "a-".repeat(30) + "zz")).toBe(false);
  });

  // Examples from Google's robots.txt documentation, plus regex characters that must stay literal.
  it.each<[string, string[], string[]]>([
    ["/fish", ["/fish", "/fish.html", "/fish/salmon.html", "/fishheads", "/fish.php?id=anything"], ["/Fish.asp", "/catfish", "/?id=fish", "/"]],
    ["/fish*", ["/fish", "/fish.html", "/fishheads/yummy.html"], ["/Fish.asp", "/catfish"]],
    ["/fish/", ["/fish/", "/fish/?id=anything", "/fish/salmon.htm"], ["/fish", "/fish.html"]],
    ["/*.php", ["/index.php", "/folder/filename.php?parameters", "/folder/any.php.file.html", "/filename.php/"], ["/", "/windows.PHP"]],
    ["/*.php$", ["/filename.php", "/folder/filename.php"], ["/filename.php?parameters", "/filename.php/", "/filename.php5", "/windows.PHP"]],
    ["/fish*.php", ["/fish.php", "/fishheads/catfish.php?parameters"], ["/Fish.PHP"]],
    ["/a.b", ["/a.b"], ["/aXb"]],
    ["/a$b", ["/a$b"], ["/a"]],
    ["/(x)+?", ["/(x)+?y"], ["/x"]],
    ["/*/end$", ["/a/end", "/a/b/end"], ["/a/end/", "/end"]],
    ["/**a", ["/xa", "/a"], ["/b"]],
    ["/$", ["/"], ["/a"]],
  ])("Disallow: %s", (rule, blocked, allowed) => {
    const rules = { allow: [], disallow: [rule] };
    for (const p of blocked) expect(robotsAllows(rules, B + p), p).toBe(false);
    for (const p of allowed) expect(robotsAllows(rules, B + p), p).toBe(true);
  });
});

describe("crawl_site keeps going past bad input", () => {
  it("reads relative sitemap <loc> values against the sitemap URL and says they should be full URLs", async () => {
    const r = await crawlSite({
      startUrl: `${B}/`,
      fetchFn: siteFetch({
        "/": [200, "text/html", page("Home", `<h1>Home</h1>`)],
        "/about": [200, "text/html", page("About", `<h1>About</h1>`)],
        "/robots.txt": [200, "text/plain", "User-agent: *\nAllow: /\n"],
        "/sitemap.xml": [200, "application/xml", `<urlset><url><loc>${B}/</loc></url><url><loc>/about</loc></url><url><loc>www.example.com/x</loc></url><url><loc>mailto:a@example.com</loc></url></urlset>`],
      }),
    });
    expect(r.pages.map((p) => p.url)).toContain(`${B}/about`);
    expect(r.pages.find((p) => p.url === `${B}/about`)?.inSitemap).toBe(true);
    expect(r.notes.join("\n")).toMatch(/3 sitemap <loc> values are not full URLs \(e\.g\. "\/about"\)/);
  });

  it("does not guess a URL for a <loc> that starts with a host name but no scheme", async () => {
    const r = await crawlSite({
      startUrl: `${B}/`,
      fetchFn: siteFetch({
        "/": [200, "text/html", page("Home", `<h1>Home</h1><a href="/about">About</a>`)],
        "/about": [200, "text/html", page("About", `<h1>About</h1>`)],
        "/sitemap.xml": [200, "application/xml", `<urlset><url><loc>${B}/</loc></url><url><loc>www.example.com/about</loc></url></urlset>`],
      }),
    });
    expect(r.pages.map((p) => p.url).sort()).toEqual([`${B}/`, `${B}/about`]);
    expect(r.issues.find((i) => i.id === "broken-internal")).toBeUndefined();
    expect(r.issues.find((i) => i.id === "non200-in-sitemap")).toBeUndefined();
    expect(r.sitemapUrls).toBe(1);
    expect(r.notes.join("\n")).toMatch(/1 sitemap <loc> values are not full URLs \(e\.g\. "www\.example\.com\/about"\)/);
  });

  it("reads a relative child sitemap <loc> in a sitemap index against the index URL", async () => {
    const r = await crawlSite({
      startUrl: `${B}/`,
      fetchFn: siteFetch({
        "/": [200, "text/html", page("Home", `<h1>Home</h1><a href="/about">About</a>`)],
        "/about": [200, "text/html", page("About", `<h1>About</h1>`)],
        "/sitemap.xml": [200, "application/xml", `<sitemapindex><sitemap><loc>/sitemap-pages.xml</loc></sitemap></sitemapindex>`],
        "/sitemap-pages.xml": [200, "application/xml", `<urlset><url><loc>${B}/</loc></url><url><loc>${B}/about</loc></url></urlset>`],
      }),
    });
    expect(r.sitemapUrls).toBe(2);
    expect(r.notes.join("\n")).toMatch(/1 sitemap <loc> values are not full URLs \(e\.g\. "\/sitemap-pages\.xml"\)/);
    expect(r.notes.join("\n")).not.toMatch(/Child sitemap failed/);
  });

  it("reads a page nested 10,000 levels deep", async () => {
    const deep = page("Deep", "<h1>x</h1>" + "<b>".repeat(10000) + "word" + "</b>".repeat(10000) + `<a href="/about">About</a>`);
    const r = await crawlSite({
      startUrl: `${B}/`,
      useSitemap: false,
      fetchFn: siteFetch({
        "/": [200, "text/html", page("Home", `<h1>Hi</h1><a href="/deep">Deep</a>`)],
        "/about": [200, "text/html", page("About", "<h1>About</h1>")],
        "/deep": [200, "text/html", deep],
      }),
    });
    expect(r.pagesCrawled).toBe(3);
    expect(r.pages.find((p) => p.url === `${B}/deep`)).toMatchObject({ title: "Deep", wordCount: 3 });
    expect(r.pages.find((p) => p.url === `${B}/about`)?.inlinks).toBe(1);
    expect(r.issues.find((i) => i.id === "fetch-errors")).toBeUndefined();
  });

  it("records a page whose body fails mid-download instead of failing the crawl", async () => {
    const broken = () =>
      new ReadableStream<Uint8Array>({
        start(c) {
          c.enqueue(new TextEncoder().encode("<html><head><title>Half</title>"));
          c.error(new Error("connection reset"));
        },
      });
    const r = await crawlSite({
      startUrl: `${B}/`,
      useSitemap: false,
      fetchFn: siteFetch({
        "/": [200, "text/html", page("Home", `<h1>Hi</h1><a href="/half">Half</a><a href="/about">About</a>`)],
        "/about": [200, "text/html", page("About", "<h1>About</h1>")],
        "/half": [200, "text/html", broken],
      }),
    });
    expect(r.pagesCrawled).toBe(3);
    expect(r.issues.find((i) => i.id === "fetch-errors")?.examples.join("\n")).toMatch(/\/half: body download failed/);
    // A page that could not be read is reported once, not also as missing a title or an h1.
    expect(r.issues.find((i) => i.id === "missing-title")).toBeUndefined();
  });

  it("auditHtml reads HTML nested 20,000 levels deep", () => {
    const r = auditHtml(page("Deep", "<b>".repeat(20000) + "word" + "</b>".repeat(20000)));
    expect(r.title).toBe("Deep");
    expect(r.wordCount).toBe(1);
  });
});
