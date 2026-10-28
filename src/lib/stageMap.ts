// The stage map: one line per funnel stage, saying what the answer concluded about it. An answer has at most three
// moves, so most stages get no move; without the map the reader can't tell "not the constraint" from "not
// considered", and the owner kept asking follow-ups ("what about outreach? ads? my profiles?"). The map is checked
// here, by its text, like the move format.

export interface Stage {
  /** Short name, used in problems. */
  name: string;
  /** What the stage covers, in plain words. */
  plain: string;
  /** Matched against a line's label (the text before the status), lower-cased. */
  re: RegExp;
}

export const STAGES: Stage[] = [
  { name: "positioning", plain: "who it's for and against what", re: /positioning|who (?:it'?s|it is|this is) for|who (?:it|this) serves|target (?:customer|buyer|audience)s?|ideal customer|\bniche\b|\bsegments?\b/ },
  { name: "offer and price", plain: "what you sell and for how much", re: /\boffer\b|\bpric(?:e|es|ing)\b|packag/ },
  { name: "presence", plain: "the site and profiles say what you sell", re: /presence|\b(?:web)?sites?\b|homepage|landing page|profiles?\b|listings?\b|store page/ },
  { name: "discovery", plain: "how strangers find you", re: /discovery|\bdiscover|finds? you|\bfound\b|search|\bseo\b|\breach\b|awareness|inbound|content|channels?\b|\bads?\b|\bpaid\b/ },
  { name: "direct outreach", plain: "emails, messages or calls you start", re: /outreach|outbound|cold (?:emails?|dms?|messages?|calls?)|prospecting|direct (?:sales|contact)/ },
  { name: "conversion", plain: "sign-up or sales call", re: /conversion|convert|sign-?\s?ups?\b|trials?\b|activation|onboarding|sales calls?|demos?\b|checkout|purchase/ },
  { name: "retention and referrals", plain: "they stay and tell others", re: /retention|retain|churn|referr|word of mouth|repeat|renewal|expansion|loyalty/ },
  { name: "legal limits", plain: "privacy, consent and advertising rules", re: /legal|\blaws?\b|compliance|privacy|gdpr|casl|regulat|consent/ },
  { name: "founder's time", plain: "hours the founder can give", re: /founder|\btime\b|hours|capacity|bandwidth|\bteam\b/ },
  { name: "measurement", plain: "what is tracked and where sign-ups come from", re: /measur|tracking|analytics|metrics?\b|attribution|\bdata\b/ },
];

export const STATUSES = ["constraint", "fine", "unknown", "later"] as const;
const STATUS_RE = /\b(constraint|fine|unknown|later)\b/gi;
const STATUS_LIST = "constraint, fine, unknown or later";

// The diagnosis names one constraint. A second is allowed because two stages can fail together and fixing one alone
// doesn't help (a site that names no buyer when positioning is unclear), or because the founder's time or a legal
// limit bounds what the moves can be. Three or more means the answer hasn't chosen.
export const MAX_CONSTRAINTS = 2;
/** Words per line: the stage, a status, a reason in one short sentence, and a playbook or tool to go deeper. */
export const LINE_MAX = 30;
/** The whole section: ten lines at the line cap, plus the heading and a table header. */
export const SECTION_MAX = 330;

const HEADING = /^(#{1,6})\s+(.*)$/;
export const isStageMapHeading = (title: string) => /^stage map\b/i.test(title.replace(/[*_`]/g, "").trim());
const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s+/;
const TABLE_ROW = /^\s*\|.*\|\s*$/;
const TABLE_RULE = /^\s*\|?\s*:?-{2,}:?\s*(?:\|\s*:?-{2,}:?\s*)*\|?\s*$/;
// Reader words, as check_answer counts them: a dash or slash between spaces is not a word.
const words = (s: string) => (s.match(/[\p{L}\p{N}][\p{L}\p{N}'’.%$-]*/gu) ?? []).length;

/** Splits the "## Stage map" section out of the text. It ends at the next heading of the same or a higher level, or at
 * a paragraph that follows a blank line once the map's lines have started, so a "Learn more:" line or closing prose
 * after the map stays in the body. */
export function splitStageMap(text: string): { body: string; map: string | null } {
  const body: string[] = [];
  const map: string[] = [];
  let level = 0;
  let found = false;
  let started = false;
  let blank = false;
  for (const line of text.split("\n")) {
    const h = HEADING.exec(line);
    if (level) {
      const entry = LIST_ITEM.test(line) || TABLE_ROW.test(line);
      if ((h && h[1].length <= level) || (started && blank && line.trim() && !entry)) level = 0;
      else {
        if (line.trim()) started = true;
        blank = !line.trim();
        map.push(line);
        continue;
      }
    }
    if (h && !found && isStageMapHeading(h[2])) {
      level = h[1].length;
      found = true;
      map.push(line);
      continue;
    }
    body.push(line);
  }
  return { body: body.join("\n"), map: found ? map.join("\n") : null };
}

/** Problems with a stage map section (as splitStageMap returns it), or with its absence. */
export function checkStageMap(map: string | null): string[] {
  if (map === null)
    return [
      `No "## Stage map" section. Add one, with one line per stage: ${STAGES.map((s) => `${s.name} (${s.plain})`).join(", ")}. ` +
        `Each line: the stage, one status (${STATUS_LIST}), a short reason, and if useful the playbook or tool to go deeper. ` +
        `At most ${MAX_CONSTRAINTS} constraints. It doesn't count toward the word limit. For a short answer to one narrow question, check with stageMap false instead.`,
    ];
  const problems: string[] = [];
  const seen = new Map<string, number>();
  const constraints: string[] = [];
  const lines = map.split("\n").slice(1);
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim() || TABLE_RULE.test(raw)) continue;
    const isRow = TABLE_ROW.test(raw);
    let label: string;
    let slot: string;
    if (isRow) {
      const cells = raw.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.replace(/[*_`]/g, "").trim());
      // The header row: followed by a rule, or its first cell is "Stage".
      if (TABLE_RULE.test(lines[i + 1] ?? "") || /^stages?$/i.test(cells[0])) continue;
      label = cells[0];
      slot = cells[1] ?? "";
    } else {
      const text = raw.replace(LIST_ITEM, "").replace(/[*_`]/g, "").trim();
      const sep = /\s*(?::|\s[—–-]\s|\|)\s*/.exec(text);
      label = sep ? text.slice(0, sep.index) : text;
      // The status comes first after the stage: "Conversion: fine / unknown. No numbers" gives "fine / unknown".
      slot = sep ? text.slice(sep.index + sep[0].length).split(/[.;:(—–]|\s-\s/)[0].split(/\s+/).slice(0, 4).join(" ") : "";
      // A plain sentence that names no stage is prose around the map, not an entry.
      if (!LIST_ITEM.test(raw) && !(sep && STAGES.some((s) => s.re.test(label.toLowerCase())))) continue;
    }
    const shown = label.length > 40 ? `${label.slice(0, 40)}…` : label;
    const stages = STAGES.filter((s) => s.re.test(label.toLowerCase()));
    if (!stages.length) {
      problems.push(`Stage map: "${shown}" doesn't name a stage. Use the stage names (${STAGES.map((s) => s.name).join(", ")}), or move the line out of the map.`);
      continue;
    }
    if (stages.length > 1) problems.push(`Stage map: the ${shown} line names ${stages.length} stages (${stages.map((s) => s.name).join(", ")}). Give each stage its own line.`);
    for (const s of stages) seen.set(s.name, (seen.get(s.name) ?? 0) + 1);
    const statuses = [...new Set([...`${label} ${slot}`.matchAll(STATUS_RE)].map((m) => m[1].toLowerCase()))];
    if (!statuses.length) problems.push(`Stage map: the ${shown} line has no status. Put one of ${STATUS_LIST} right after the stage name, then the reason.`);
    else if (statuses.length > 1) problems.push(`Stage map: the ${shown} line has ${statuses.length} statuses (${statuses.join(", ")}). Pick one of ${STATUS_LIST}; "unknown" is right when you didn't check.`);
    else if (statuses[0] === "constraint") constraints.push(...stages.map((s) => s.name));
    const n = words(raw);
    if (n > LINE_MAX) problems.push(`Stage map: the ${shown} line has ${n} words; keep it to ${LINE_MAX}: the status, one short reason, and at most one playbook or tool to go deeper.`);
  }
  const missing = STAGES.filter((s) => !seen.has(s.name));
  if (missing.length)
    problems.push(`Stage map: no line for ${missing.map((s) => `${s.name} (${s.plain})`).join(", ")}. Add one line each with its status; "unknown" is right when you didn't check.`);
  const twice = [...seen].filter(([, n]) => n > 1).map(([name]) => name);
  if (twice.length) problems.push(`Stage map: more than one line for ${twice.join(", ")}. Keep one line per stage.`);
  if (constraints.length > MAX_CONSTRAINTS)
    problems.push(
      `Stage map: ${constraints.length} stages are marked constraint (${constraints.join(", ")}); mark at most ${MAX_CONSTRAINTS}. The diagnosis names one constraint; mark the others fine, unknown or later.`
    );
  const total = words(map);
  if (total > SECTION_MAX) problems.push(`The stage map has ${total} words; keep it under ${SECTION_MAX}, one short line per stage.`);
  return problems;
}
