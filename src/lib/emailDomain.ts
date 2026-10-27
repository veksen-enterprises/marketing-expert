// Email sending-domain checks from DNS: SPF, DMARC, DKIM (for the selectors given) and MX. Nothing is stored. DNS
// queries are capped per call (MAX_QUERIES); the resolver is injectable so tests don't touch the network.

import { Resolver } from "node:dns/promises";
import { createPublicKey } from "node:crypto";

const RFC_SPF = "https://www.rfc-editor.org/rfc/rfc7208";
const RFC_DMARC = "https://www.rfc-editor.org/rfc/rfc7489";
const RFC_DKIM_KEYS = "https://www.rfc-editor.org/rfc/rfc8301";
const RFC_NULL_MX = "https://www.rfc-editor.org/rfc/rfc7505";
export const EMAIL_PLAYBOOK = "playbook:email-and-lifecycle#Deliverability requirements (enforced) [first-party]";

/** Most DNS queries one call may make, SPF includes, DMARC tree walk and DKIM selectors together. */
export const MAX_QUERIES = 40;
const MAX_SELECTORS = 10;

export interface DnsLookup {
  txt(name: string): Promise<string[][]>;
  mx(name: string): Promise<Array<{ exchange: string; priority: number }>>;
}

export function systemDns(): DnsLookup {
  const r = new Resolver({ timeout: 3000, tries: 2 });
  return { txt: (n) => r.resolveTxt(n), mx: (n) => r.resolveMx(n) };
}

export interface EmailFinding {
  area: "spf" | "dmarc" | "dkim" | "mx" | "dns";
  severity: "error" | "warning" | "info";
  message: string;
  source: string;
}

class Budget extends Error {}

// "No such name" and "no records of that type" are answers. Anything else (timeout, SERVFAIL) means not checked.
const NO_DATA = new Set(["ENODATA", "ENOTFOUND", "NXDOMAIN"]);

const DOMAIN = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/;
const PRIVATE_SUFFIX = /\.(local|localhost|internal|lan|home\.arpa|corp|intranet|test|invalid|example)$/;

export function normaliseDomain(input: string): string {
  const d = input.trim().toLowerCase().replace(/\.$/, "").replace(/^mailto:.*@/, "").replace(/^.*@/, "");
  if (!DOMAIN.test(d) || PRIVATE_SUFFIX.test(d)) throw new RangeError(`"${input}" is not a public domain name (e.g. example.com)`);
  return d;
}

export async function checkEmailDomain(domainInput: string, selectors: string[] = [], dns: DnsLookup = systemDns()) {
  const domain = normaliseDomain(domainInput);
  const findings: EmailFinding[] = [];
  const add = (area: EmailFinding["area"], severity: EmailFinding["severity"], message: string, source: string) => findings.push({ area, severity, message, source });
  let queries = 0;
  const failed: string[] = [];
  // Names the resolver said don't exist. For the domain itself, that also happens when the resolver can't reach DNS.
  const nx = new Set<string>();
  /** null: the name has no records of that type. undefined: the lookup failed, so nothing is known. */
  const query = async <T>(fn: () => Promise<T>, name: string): Promise<T | null | undefined> => {
    if (++queries > MAX_QUERIES) throw new Budget();
    try {
      return await fn();
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      if (code === "ENOTFOUND" || code === "NXDOMAIN") nx.add(name);
      if (NO_DATA.has(code)) return null;
      failed.push(`${name} (${(e as { code?: string }).code ?? (e instanceof Error ? e.message : String(e))})`);
      return undefined;
    }
  };
  const txt = async (name: string) => {
    const r = await query(() => dns.txt(name), name);
    // A TXT record may be split into strings of up to 255 characters; they are joined as written.
    return r ? r.map((chunks) => chunks.join("")) : r;
  };

  // ── SPF ──
  const spf = { record: null as string | null, lookups: 0, voidLookups: 0, all: null as string | null, checked: true, partial: false };
  type SpfOut = { status: "ok" | "none" | "many" | "unknown"; all: string | null };
  /** The record's verdict for unlisted servers is its own "all", or else that of the record its redirect leads to. */
  const evalSpf = async (name: string, depth: number, top: boolean): Promise<SpfOut> => {
    const records = await txt(name);
    if (records === undefined) return { status: "unknown", all: null };
    const spfs = (records ?? []).filter((r) => /^v=spf1(\s|$)/i.test(r.trim()));
    if (!spfs.length) return { status: "none", all: null };
    if (spfs.length > 1) return { status: "many", all: null };
    const record = spfs[0].trim();
    if (top) spf.record = record;
    let all: string | null = null;
    let redirect: string | null = null;
    for (const term of record.split(/\s+/).slice(1)) {
      const m = term.match(/^([+\-~?]?)([a-z0-9_.-]+)(?:[:=/](.*))?$/i);
      if (!m) continue;
      const [, qual, rawMech, arg] = m;
      const mech = rawMech.toLowerCase();
      // Terms after "all" are never evaluated.
      if (mech === "all") {
        all = `${qual || "+"}all`;
        break;
      }
      if (["a", "mx", "ptr", "exists"].includes(mech)) spf.lookups++;
      if (mech === "ptr") add("spf", "warning", `${name} uses "ptr", which the SPF standard says not to use: it is slow and some receivers skip it.`, RFC_SPF);
      if (mech === "redirect" && arg) redirect = arg;
      if (mech === "include" && arg) {
        spf.lookups++;
        if (depth >= 10) continue;
        const r = await evalSpf(arg, depth + 1, false);
        if (r.status === "none") {
          spf.voidLookups++;
          add("spf", "error", `include:${arg} has no SPF record. Receivers treat the whole SPF check as an error (permerror).`, RFC_SPF);
        } else if (r.status === "many") add("spf", "error", `include:${arg} has more than one SPF record, which is an error (permerror).`, RFC_SPF);
        else if (r.status === "unknown") spf.partial = true;
      }
    }
    // A redirect is ignored when the record has an "all".
    if (redirect && !all) {
      spf.lookups++;
      if (depth < 10) {
        const r = await evalSpf(redirect, depth + 1, false);
        if (r.status === "none") {
          spf.voidLookups++;
          add("spf", "error", `redirect=${redirect} has no SPF record: the SPF check is an error (permerror).`, RFC_SPF);
        } else if (r.status === "unknown") spf.partial = true;
        all = r.all;
      }
    }
    return { status: "ok", all };
  };

  // ── DMARC ──
  const dmarc = { record: null as string | null, foundAt: null as string | null, policy: null as string | null, subdomainPolicy: null as string | null, rua: null as string | null, adkim: "r", aspf: "r", pct: 100, checked: true };

  // ── DKIM ──
  const dkim: Array<{ selector: string; found: boolean | null; keyType?: string; bits?: number; revoked?: boolean }> = [];
  const mx = { records: [] as Array<{ exchange: string; priority: number }>, checked: true };

  try {
    const spfOut = await evalSpf(domain, 0, true);
    if (nx.has(domain)) {
      // The resolver said the name doesn't exist. Reporting "no SPF, no DMARC, no MX" would be
      // wrong when the cause is a resolver that can't reach DNS, so nothing is judged.
      return {
        domain,
        checked: false,
        findings: [{ area: "dns", severity: "error", message: `The resolver answered that ${domain} does not exist (ENOTFOUND). Either the domain isn't registered or published, or this server's DNS isn't working. Nothing was checked.`, source: RFC_SPF } as EmailFinding],
        dnsQueries: queries,
        learnMore: [EMAIL_PLAYBOOK],
      };
    }
    const spfResult = spfOut.status;
    spf.all = spfOut.all;
    if (spfResult === "unknown") {
      spf.checked = false;
      add("dns", "warning", `The SPF lookup for ${domain} failed; SPF was not checked.`, RFC_SPF);
    } else if (spfResult === "none") add("spf", "error", `${domain} has no SPF record (a TXT record starting "v=spf1"). Gmail, Yahoo and Microsoft require SPF from bulk senders.`, RFC_SPF);
    else if (spfResult === "many") add("spf", "error", `${domain} has more than one SPF record. Receivers treat this as an error (permerror), as if there were no SPF.`, RFC_SPF);
    else {
      if (spf.lookups > 10) add("spf", "error", `SPF needs ${spf.lookups} DNS lookups (include, a, mx, ptr, exists and redirect, counted through every include). The limit is 10; past it receivers return permerror and SPF fails for all mail. Remove unused includes or flatten them.`, RFC_SPF);
      else if (spf.lookups >= 8) add("spf", "info", `SPF uses ${spf.lookups} of the 10 DNS lookups allowed. One more email service could push it over.`, RFC_SPF);
      if (spf.voidLookups > 2) add("spf", "error", `${spf.voidLookups} includes or redirects lead to no record; receivers may stop after 2 such "void lookups".`, RFC_SPF);
      const all = spf.all;
      if (all === "+all") add("spf", "error", 'SPF ends in "+all": every server on the internet passes SPF for this domain.', RFC_SPF);
      else if (all === "?all") add("spf", "warning", 'SPF ends in "?all" (neutral): mail from unlisted servers gets no SPF verdict, so SPF protects nothing.', RFC_SPF);
      else if (all === "~all") add("spf", "info", 'SPF ends in "~all" (softfail): mail from unlisted servers is marked suspicious, not rejected. "-all" (fail) is stricter; with DMARC at quarantine or reject, DMARC decides either way.', RFC_SPF);
      else if (!all && !spf.partial) add("spf", "warning", 'SPF has no "all" term and no redirect to one: mail from unlisted servers gets no verdict.', RFC_SPF);
      if (spf.partial) add("dns", "warning", "Some SPF includes could not be looked up, so the lookup count and the final verdict are partial.", RFC_SPF);
    }

    // DMARC: the domain's own record, else the closest parent's (the organisational domain's policy applies).
    const labels = domain.split(".");
    for (let i = 0; i < labels.length - 1 && i < 5; i++) {
      const at = labels.slice(i).join(".");
      const records = await txt(`_dmarc.${at}`);
      if (records === undefined) {
        dmarc.checked = false;
        break;
      }
      const recs = (records ?? []).filter((r) => /^v=DMARC1(\s*;|\s*$)/i.test(r.trim()));
      if (!recs.length) continue;
      if (recs.length > 1) {
        add("dmarc", "error", `_dmarc.${at} has more than one DMARC record; receivers ignore them all.`, RFC_DMARC);
        dmarc.foundAt = at;
        break;
      }
      dmarc.record = recs[0].trim();
      dmarc.foundAt = at;
      const tags = Object.fromEntries(dmarc.record.split(";").map((t) => t.trim().split("=").map((x) => x.trim())).filter((kv) => kv.length === 2 && kv[0]).map(([k, v]) => [k.toLowerCase(), v]));
      dmarc.policy = tags.p?.toLowerCase() ?? null;
      dmarc.subdomainPolicy = tags.sp?.toLowerCase() ?? null;
      dmarc.rua = tags.rua ?? null;
      dmarc.adkim = (tags.adkim ?? "r").toLowerCase();
      dmarc.aspf = (tags.aspf ?? "r").toLowerCase();
      dmarc.pct = tags.pct !== undefined && /^\d+$/.test(tags.pct) ? Number(tags.pct) : 100;
      break;
    }
    if (!dmarc.checked) add("dns", "warning", "The DMARC lookup failed; DMARC was not checked.", RFC_DMARC);
    else if (!dmarc.record && !findings.some((f) => f.area === "dmarc")) add("dmarc", "error", `No DMARC record at _dmarc.${domain} or its parent domains. Gmail, Yahoo and Microsoft require DMARC (at least p=none) from bulk senders.`, RFC_DMARC);
    else if (dmarc.record) {
      const inherited = dmarc.foundAt !== domain;
      const effective = inherited ? (dmarc.subdomainPolicy ?? dmarc.policy) : dmarc.policy;
      if (inherited) add("dmarc", "info", `${domain} has no DMARC record of its own; the record at _dmarc.${dmarc.foundAt} applies (policy ${effective ?? "none set"}).${dmarc.foundAt!.split(".").length > 2 ? " Receivers following RFC 7489 look only at the organisational domain, not at levels in between, so check that this is it." : ""}`, RFC_DMARC);
      if (!dmarc.policy || !["none", "quarantine", "reject"].includes(dmarc.policy)) add("dmarc", "error", `The DMARC record has no valid p= tag (none, quarantine or reject). Receivers then act as if p=none when rua is valid, and otherwise apply no DMARC at all.`, RFC_DMARC);
      else if (effective === "none") add("dmarc", "warning", "DMARC policy is p=none: receivers report but don't act on mail that fails, so spoofed mail still gets through. It meets the Gmail, Yahoo and Microsoft minimum; move to quarantine, then reject, once reports show your own mail passes.", RFC_DMARC);
      if (!dmarc.rua) add("dmarc", "warning", "The DMARC record has no rua= address, so nobody receives the aggregate reports that show which servers send as this domain.", RFC_DMARC);
      if (dmarc.pct < 100) add("dmarc", "info", `pct=${dmarc.pct}: the policy applies to only ${dmarc.pct}% of failing mail.`, RFC_DMARC);
      if (dmarc.adkim === "s" || dmarc.aspf === "s") add("dmarc", "info", `Strict alignment (${[dmarc.adkim === "s" ? "adkim=s" : "", dmarc.aspf === "s" ? "aspf=s" : ""].filter(Boolean).join(", ")}): mail sent from a subdomain (e.g. a marketing tool's bounce domain) fails DMARC unless it uses this exact domain.`, RFC_DMARC);
    }

    // DKIM: only for the selectors given. A selector can't be discovered from DNS.
    for (const sel of selectors.slice(0, MAX_SELECTORS)) {
      if (!/^[a-z0-9_-]+(\.[a-z0-9_-]+)*$/i.test(sel)) {
        add("dkim", "warning", `"${sel}" is not a valid DKIM selector; skipped.`, RFC_DKIM_KEYS);
        continue;
      }
      const records = await txt(`${sel}._domainkey.${domain}`);
      if (records === undefined) {
        dkim.push({ selector: sel, found: null });
        add("dns", "warning", `The DKIM lookup for selector "${sel}" failed; it was not checked.`, RFC_DKIM_KEYS);
        continue;
      }
      const rec = (records ?? []).find((r) => /(^|;)\s*p=/i.test(r));
      if (!rec) {
        dkim.push({ selector: sel, found: false });
        add("dkim", "warning", `No DKIM key at ${sel}._domainkey.${domain}. Check the selector: it is the s= value in the DKIM-Signature header of a message you sent.`, RFC_DKIM_KEYS);
        continue;
      }
      const tags = Object.fromEntries(rec.split(";").map((t) => t.trim()).filter(Boolean).map((t) => [t.slice(0, t.indexOf("=")).trim().toLowerCase(), t.slice(t.indexOf("=") + 1).replace(/\s+/g, "")]));
      const keyType = (tags.k ?? "rsa").toLowerCase();
      const entry: (typeof dkim)[number] = { selector: sel, found: true, keyType };
      dkim.push(entry);
      if (!tags.p) {
        entry.revoked = true;
        add("dkim", "error", `The DKIM key at selector "${sel}" is empty (p=): the key is revoked, and mail signed with it fails DKIM.`, RFC_DKIM_KEYS);
        continue;
      }
      if (keyType === "rsa") {
        try {
          entry.bits = createPublicKey({ key: Buffer.from(tags.p, "base64"), format: "der", type: "spki" }).asymmetricKeyDetails?.modulusLength;
        } catch {
          add("dkim", "error", `The DKIM key at selector "${sel}" is not a readable RSA public key.`, RFC_DKIM_KEYS);
        }
        if (entry.bits !== undefined && entry.bits < 1024) add("dkim", "error", `The DKIM key at selector "${sel}" is ${entry.bits}-bit RSA. Verifiers must treat signatures made with keys under 1024 bits as invalid, so this mail fails DKIM; use 2048.`, RFC_DKIM_KEYS);
        else if (entry.bits !== undefined && entry.bits < 2048) add("dkim", "info", `The DKIM key at selector "${sel}" is ${entry.bits}-bit RSA. The standard says signers should use at least 2048 bits.`, RFC_DKIM_KEYS);
      }
    }

    const mxr = await query(() => dns.mx(domain), domain);
    if (mxr === undefined) {
      mx.checked = false;
      add("dns", "warning", "The MX lookup failed; MX was not checked.", RFC_NULL_MX);
    } else {
      mx.records = (mxr ?? []).sort((a, b) => a.priority - b.priority);
      if (!mx.records.length) add("mx", "warning", `${domain} has no MX record: replies and bounces to addresses at this domain may not arrive. Fine for a send-only subdomain whose bounces go to another domain.`, RFC_NULL_MX);
      else if (mx.records.length === 1 && (mx.records[0].exchange === "" || mx.records[0].exchange === ".")) add("mx", "warning", `${domain} has a null MX: it declares that it accepts no mail, so replies and bounces can't reach it.`, RFC_NULL_MX);
    }
  } catch (e) {
    if (!(e instanceof Budget)) throw e;
    add("dns", "warning", `Stopped after ${MAX_QUERIES} DNS queries; checks after that point were not run.`, RFC_SPF);
  }

  return {
    domain,
    spf: { ...spf, lookupLimit: 10 },
    dmarc,
    dkim: selectors.length ? dkim : { checked: false, why: "DKIM keys live at <selector>._domainkey.<domain>, and a selector can't be discovered from DNS. Pass selectors (the s= value in the DKIM-Signature header of a message you sent) to check them. This is not a finding that DKIM is missing." },
    mx,
    findings,
    dnsQueries: Math.min(queries, MAX_QUERIES),
    ...(failed.length ? { failedLookups: failed } : {}),
    learnMore: [EMAIL_PLAYBOOK],
    notChecked: [
      "Whether mail actually passes: alignment between the From domain and the SPF or DKIM domain depends on the sending service and needs a real message's headers.",
      "Address records behind a, mx and exists terms (counted as lookups, not resolved), and the 10-address limit per mx term.",
      "Reverse DNS of sending IPs, TLS, blocklists and spam complaint rates.",
    ],
  };
}
