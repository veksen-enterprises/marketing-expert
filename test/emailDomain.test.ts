// check_email_domain: SPF, DMARC, DKIM and MX from a fake resolver, so no test touches the network.
import { describe, it, expect } from "vitest";
import { generateKeyPairSync } from "node:crypto";
import { checkEmailDomain, normaliseDomain, MAX_QUERIES, type DnsLookup } from "../src/lib/emailDomain.js";
import { learnMore } from "../src/lib/learnMore.js";

const key = (bits: number) => generateKeyPairSync("rsa", { modulusLength: bits }).publicKey.export({ type: "spki", format: "der" }).toString("base64");
const noData = () => Object.assign(new Error("no data"), { code: "ENODATA" });

/** TXT and MX records by name; a name mapped to "fail" answers SERVFAIL. */
function fakeDns(txt: Record<string, string[] | "fail">, mx: Record<string, Array<{ exchange: string; priority: number }>> = {}): DnsLookup & { asked: string[] } {
  const asked: string[] = [];
  return {
    asked,
    async txt(n) {
      asked.push(n);
      const r = txt[n];
      if (r === "fail") throw Object.assign(new Error("servfail"), { code: "ESERVFAIL" });
      if (!r) throw noData();
      // Long records come back split into 255-character strings.
      return r.map((s) => s.match(/.{1,255}/g) ?? [""]);
    },
    async mx(n) {
      asked.push(`MX ${n}`);
      if (!mx[n]) throw noData();
      return mx[n];
    },
  };
}

const good2048 = key(2048);
const clean = fakeDns(
  {
    "shop.test.com": ["v=spf1 include:_spf.esp.example.com -all", "google-site-verification=x"],
    "_spf.esp.example.com": ["v=spf1 ip4:192.0.2.0/24 include:_b.esp.example.com ~all"],
    "_b.esp.example.com": ["v=spf1 ip4:198.51.100.0/24 ~all"],
    "_dmarc.shop.test.com": ["v=DMARC1; p=reject; rua=mailto:d@shop.test.com"],
    "s1._domainkey.shop.test.com": [`v=DKIM1; k=rsa; p=${good2048}`],
  },
  { "shop.test.com": [{ exchange: "mx.esp.example.com", priority: 10 }] }
);

describe("checkEmailDomain", () => {
  it("passes a well-configured domain, counting lookups through nested includes", async () => {
    const r = await checkEmailDomain("Shop.Test.com.", ["s1"], clean);
    expect(r.findings).toEqual([]);
    expect(r.spf).toMatchObject({ lookups: 2, all: "-all" });
    expect(r.dmarc).toMatchObject({ policy: "reject", foundAt: "shop.test.com" });
    expect(r.dkim).toEqual([{ selector: "s1", found: true, keyType: "rsa", bits: 2048 }]);
    for (const p of r.learnMore) expect(learnMore(p).kind).toBe("section");
  });

  it("flags missing SPF, DMARC and MX, and says DKIM was not checked without a selector", async () => {
    const r = await checkEmailDomain("bare.com", [], fakeDns({}));
    expect(r.findings.map((f) => `${f.area}:${f.severity}`)).toEqual(["spf:error", "dmarc:error", "mx:warning"]);
    expect(r.dkim).toMatchObject({ checked: false });
    expect(JSON.stringify(r.dkim)).toMatch(/not a finding that DKIM is missing/);
  });

  it("counts more than 10 SPF lookups, recursively, and flags two SPF records", async () => {
    const txt: Record<string, string[]> = { "big.com": [`v=spf1 ${Array.from({ length: 6 }, (_, i) => `include:i${i}.com`).join(" ")} -all`] };
    for (let i = 0; i < 6; i++) txt[`i${i}.com`] = ["v=spf1 a mx ~all"];
    const r = await checkEmailDomain("big.com", [], fakeDns(txt));
    expect(r.spf.lookups).toBe(18);
    expect(r.findings.find((f) => f.area === "spf")?.message).toMatch(/18 DNS lookups/);
    const two = await checkEmailDomain("two.com", [], fakeDns({ "two.com": ["v=spf1 -all", "v=spf1 include:x.com -all"] }));
    expect(two.findings[0].message).toMatch(/more than one SPF record/);
  });

  it("reads the verdict for unlisted servers from +all, ?all, ~all, and a redirect's target", async () => {
    const verdict = async (spf: string, extra: Record<string, string[]> = {}) => {
      const r = await checkEmailDomain("v.com", [], fakeDns({ "v.com": [spf], "_dmarc.v.com": ["v=DMARC1; p=reject; rua=mailto:a@v.com"], ...extra }, { "v.com": [{ exchange: "mx.v.com", priority: 1 }] }));
      return [r.spf.all, r.findings.map((f) => f.severity).join(",")];
    };
    expect(await verdict("v=spf1 +all")).toEqual(["+all", "error"]);
    expect(await verdict("v=spf1 ?all")).toEqual(["?all", "warning"]);
    expect(await verdict("v=spf1 ~all")).toEqual(["~all", "info"]);
    expect(await verdict("v=spf1 redirect=_spf.v.com", { "_spf.v.com": ["v=spf1 -all"] })).toEqual(["-all", ""]);
    // "all" wins over redirect, which is then not followed.
    expect(await verdict("v=spf1 -all redirect=missing.v.com")).toEqual(["-all", ""]);
  });

  it("reports p=none, missing rua, and a parent domain's DMARC record", async () => {
    const r = await checkEmailDomain("mail.org.com", [], fakeDns({ "mail.org.com": ["v=spf1 -all"], "_dmarc.org.com": ["v=DMARC1; p=quarantine; sp=none"] }, { "mail.org.com": [{ exchange: "mx.org.com", priority: 1 }] }));
    expect(r.dmarc.foundAt).toBe("org.com");
    const m = r.findings.map((f) => f.message);
    expect(m).toHaveLength(3);
    expect(m[0]).toMatch(/^mail\.org\.com has no DMARC record of its own; the record at _dmarc\.org\.com applies \(policy none\)/);
    expect(m[1]).toMatch(/^DMARC policy is p=none/);
    expect(m[2]).toMatch(/no rua= address/);
  });

  it("flags a revoked, short or absent DKIM key", async () => {
    const r = await checkEmailDomain("k.com", ["old", "weak", "nope"], fakeDns({ "k.com": ["v=spf1 -all"], "_dmarc.k.com": ["v=DMARC1; p=reject; rua=mailto:a@k.com"], "old._domainkey.k.com": ["v=DKIM1; p="], "weak._domainkey.k.com": [`v=DKIM1; p=${key(1024)}`] }, { "k.com": [{ exchange: "mx.k.com", priority: 1 }] }));
    expect(r.findings.map((f) => `${f.area}:${f.severity}`)).toEqual(["dkim:error", "dkim:info", "dkim:warning"]);
  });

  it("says what failed instead of reporting it missing, and stops at the query cap", async () => {
    const r = await checkEmailDomain("f.com", [], fakeDns({ "f.com": "fail", "_dmarc.f.com": "fail" }, { "f.com": [{ exchange: "mx.f.com", priority: 1 }] }));
    expect(r.findings.map((f) => f.area)).toEqual(["dns", "dns"]);
    expect(r.failedLookups).toHaveLength(2);
    // An include loop: each include adds a query until the cap.
    const loop = fakeDns({ "loop.com": ["v=spf1 include:loop.com -all"] });
    const l = await checkEmailDomain("loop.com", [], loop);
    expect(loop.asked.length).toBeLessThanOrEqual(MAX_QUERIES);
    expect(l.findings.map((f) => f.message).join(" ")).toMatch(/lookups|Stopped/);
  });

  it("judges nothing when the domain itself doesn't resolve, as when the server's DNS is down", async () => {
    const down: DnsLookup = {
      txt: async () => Promise.reject(Object.assign(new Error("x"), { code: "ENOTFOUND" })),
      mx: async () => Promise.reject(Object.assign(new Error("x"), { code: "ENOTFOUND" })),
    };
    const r = await checkEmailDomain("gmail.com", [], down);
    expect(r).toMatchObject({ checked: false });
    expect(r.findings.map((f) => f.area)).toEqual(["dns"]);
  });

  it("refuses names that aren't public domains", () => {
    for (const d of ["localhost", "db.internal", "printer.local", "10.0.0.1", "a b.com"]) expect(() => normaliseDomain(d)).toThrow(/not a public domain/);
    expect(normaliseDomain("jp@Example.COM")).toBe("example.com");
  });
});
