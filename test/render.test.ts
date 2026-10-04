import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createServer, type Server } from "node:http";
import { existsSync } from "node:fs";
import { renderAndAudit } from "../src/lib/pageAudit.js";

// Runs only where a Chromium binary is configured (MARKETING_EXPERT_CHROMIUM).
const chrome = process.env.MARKETING_EXPERT_CHROMIUM;
const enabled = !!chrome && existsSync(chrome);

const page = `<!doctype html><html lang="en"><head><title>CSR app</title></head><body><div id="root"></div>
<script>
document.getElementById("root").innerHTML = "<h1>Ship invoices in two minutes</h1><p>" + "Acme sends reminders so you get paid faster. ".repeat(20) + "</p><a class='btn' href='/signup'>Start free trial</a>";
</script></body></html>`;

describe.skipIf(!enabled)("renderAndAudit", () => {
  let server: Server;
  let url = "";
  beforeAll(async () => {
    server = createServer((req, res) => {
      if (req.url === "/poll") return; // never answers
      if (req.url === "/noindex") {
        res.writeHead(200, { "content-type": "text/html", "x-robots-tag": "noindex" });
        res.end(page);
        return;
      }
      res.writeHead(200, { "content-type": "text/html" });
      // Keep a long-poll open so the page never reaches network idle.
      res.end(page.replace("</body>", "<script>fetch('/poll')</script></body>"));
    });
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", () => r()));
    const addr = server.address();
    url = `http://127.0.0.1:${typeof addr === "object" && addr ? addr.port : 0}/`;
  });
  afterAll(() => {
    server.closeAllConnections();
    server.close();
  });

  it("sees client-rendered content and flags the gap", async () => {
    const r = await renderAndAudit(url);
    expect(r.h1s).toEqual(["Ship invoices in two minutes"]);
    expect(r.rendering.serverWordCount).toBeLessThan(5);
    expect(r.rendering.clientOnlyShare).toBeGreaterThan(0.9);
    expect(r.ctaCandidates).toContain("Start free trial");
    const msgs = r.flags.map((f) => f.message).join("\n");
    expect(msgs).toMatch(/only appears after JavaScript/);
    expect(msgs).toMatch(/<h1> exists only after JavaScript/);
  }, 60000);

  it("keeps HTTP-level checks in render mode", async () => {
    const r = await renderAndAudit(url + "noindex");
    expect(r.flags.some((f) => f.severity === "error" && /X-Robots-Tag: noindex/.test(f.message))).toBe(true);
  }, 60000);
});
