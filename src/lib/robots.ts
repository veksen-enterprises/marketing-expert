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

export function parseRobotsFile(txt: string): RobotsFile {
  const file: RobotsFile = { groups: [], sitemaps: [] };
  let current: RobotsFile["groups"][number] | null = null;
  let lastWasAgent = false;
  for (const raw of txt.split(/\r?\n/)) {
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
      current.agents.push(val.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!current) continue;
    if (key === "disallow" && val) current.disallow.push(val);
    if (key === "allow" && val) current.allow.push(val);
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

function ruleMatches(rule: string, path: string): boolean {
  const anchored = rule.endsWith("$");
  const body = (anchored ? rule.slice(0, -1) : rule).replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp("^" + body + (anchored ? "$" : "")).test(path);
}

/** Longest matching rule wins; Allow wins ties (Google's documented behaviour). */
export function robotsAllows(rules: Pick<RobotsRules, "allow" | "disallow">, url: string): boolean {
  const u = new URL(url);
  const path = u.pathname + u.search;
  let best: { len: number; allow: boolean } | null = null;
  for (const r of rules.disallow) if (ruleMatches(r, path) && (!best || r.length > best.len)) best = { len: r.length, allow: false };
  for (const r of rules.allow) if (ruleMatches(r, path) && (!best || r.length >= best.len)) best = { len: r.length, allow: true };
  return best ? best.allow : true;
}
