// robots.txt parsing with per-user-agent groups, following Google's documented rules:
// a crawler obeys the most specific group whose user-agent matches its token (case-insensitive);
// "*" applies only if no named group matches; within a group the longest matching path rule wins
// and Allow wins ties.

export interface RobotsRules {
  allow: string[];
  disallow: string[];
  sitemaps: string[];
}

export interface RobotsFile {
  groups: Array<{ agents: string[]; allow: string[]; disallow: string[] }>;
  sitemaps: string[];
}

const utf8 = new TextEncoder();

// Rules and URL paths are compared in one form, as RFC 9309 asks: characters outside ASCII are percent-encoded
// as UTF-8, and %xx escapes are in upper case. So "Disallow: /café" and "Disallow: /caf%c3%a9" both match the
// URL path "/caf%C3%A9".
function encodePath(s: string): string {
  return s
    .replace(/[^\x00-\x7f]+/g, (c) => [...utf8.encode(c)].map((b) => `%${b.toString(16).toUpperCase().padStart(2, "0")}`).join(""))
    .replace(/%[0-9a-f]{2}/gi, (e) => e.toUpperCase());
}

export function parseRobotsFile(txt: string): RobotsFile {
  const file: RobotsFile = { groups: [], sitemaps: [] };
  let current: RobotsFile["groups"][number] | null = null;
  let lastWasAgent = false;
  // A line may end with CR, LF or CR LF (RFC 9309).
  for (const raw of txt.split(/\r\n|\r|\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const i = line.indexOf(":");
    if (i < 0) continue;
    const key = line.slice(0, i).trim().toLowerCase();
    const val = line.slice(i + 1).trim();
    if (key === "sitemap") {
      file.sitemaps.push(val);
      continue;
    }
    if (key === "user-agent") {
      if (!lastWasAgent || !current) {
        current = { agents: [], allow: [], disallow: [] };
        file.groups.push(current);
      }
      // Only the product token counts, as in Google's parser: "GPTBot/1.1" is "gptbot". "*" is every crawler.
      current.agents.push(/^\*(\s|$)/.test(val) ? "*" : (val.match(/^[A-Za-z_-]+/)?.[0] ?? "").toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!current) continue;
    if (key === "disallow" && val) current.disallow.push(encodePath(val));
    if (key === "allow" && val) current.allow.push(encodePath(val));
  }
  return file;
}

/** Rules that apply to `token`, plus which group matched ("*", the token, or none). */
export function rulesFor(file: RobotsFile, token: string): RobotsRules & { matchedGroup: string | null } {
  const t = token.toLowerCase();
  const named = file.groups.filter((g) => g.agents.includes(t));
  const groups = named.length ? named : file.groups.filter((g) => g.agents.includes("*"));
  return {
    allow: groups.flatMap((g) => g.allow),
    disallow: groups.flatMap((g) => g.disallow),
    sitemaps: file.sitemaps,
    matchedGroup: named.length ? token : groups.length ? "*" : null,
  };
}

/** Backwards-compatible: rules for "*". */
export function parseRobots(txt: string): RobotsRules {
  const { allow, disallow, sitemaps } = rulesFor(parseRobotsFile(txt), "*");
  return { allow, disallow, sitemaps };
}

// "*" matches any run of characters and a final "$" anchors the end; everything else is literal.
// Not a RegExp: a site's rule like "/*-*-*-*-…-zz" makes a backtracking regex take minutes.
// Taking the leftmost match of each piece between stars is always safe, so nothing is retried.
function ruleMatches(rule: string, path: string): boolean {
  const anchored = rule.endsWith("$");
  const parts = (anchored ? rule.slice(0, -1) : rule).split("*");
  const first = parts[0];
  if (!path.startsWith(first)) return false;
  if (parts.length === 1) return !anchored || path.length === first.length;
  const last = parts[parts.length - 1];
  const end = anchored ? path.length - last.length : path.length;
  if (end < first.length || (anchored && !path.endsWith(last))) return false;
  let pos = first.length;
  for (const p of anchored ? parts.slice(1, -1) : parts.slice(1)) {
    const i = path.indexOf(p, pos);
    if (i < 0 || i + p.length > end) return false;
    pos = i + p.length;
  }
  return true;
}

/** Longest matching rule wins; Allow wins ties (Google's documented behaviour). */
export function robotsAllows(rules: Pick<RobotsRules, "allow" | "disallow">, url: string): boolean {
  const u = new URL(url);
  const path = encodePath(u.pathname + u.search);
  let best: { len: number; allow: boolean } | null = null;
  for (const r of rules.disallow) if (ruleMatches(r, path) && (!best || r.length > best.len)) best = { len: r.length, allow: false };
  for (const r of rules.allow) if (ruleMatches(r, path) && (!best || r.length >= best.len)) best = { len: r.length, allow: true };
  return best ? best.allow : true;
}
