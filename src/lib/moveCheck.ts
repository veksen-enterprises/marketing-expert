// Checks the moves in an answer against the move format the instructions ask for. In every eval round graders
// marked answers down for moves that bundle two actions ("In the same change, add…", "Beforehand, list…"),
// moves with no time box, a cheapest test that is the move itself ("just ship it"), and stop conditions with no
// number ("if most say…"). All of that is visible in the text, so it is checked here, not only asked for.

import { MAX_MOVES } from "../prompts.js";

export interface MoveInfo {
  n: number;
  title: string;
  /** Field labels found in the move: mechanism, test, cost, metric, timeBox, stop, action. */
  fields: string[];
}

export interface MoveLint {
  moves: MoveInfo[];
  issues: string[];
}

// The labels the instructions ask for, with the synonyms answers used in round 5.
const FIELD_LABEL =
  /(?:^|[\s(*_])[*_]{0,2}(action|mechanism|why it works|cheapest test|test|cost|metrics?|time ?box|deadline|stop(?: condition)?(?:\s*(?:or|\/)\s*(?:change|decide))?|kill criteria)[*_]{0,2}\s*:/gi;
const FIELD_KEY: Array<[string, RegExp]> = [
  ["action", /^action/i],
  ["mechanism", /^(mechanism|why it works)/i],
  ["test", /test$/i],
  ["cost", /^cost/i],
  ["metric", /^metric/i],
  ["timeBox", /^(time ?box|deadline)/i],
  ["stop", /^(stop|kill)/i],
];
const REQUIRED: Array<[string, string]> = [
  ["mechanism", "Mechanism"],
  ["test", "Cheapest test"],
  ["metric", "Metric"],
  ["timeBox", "Time box"],
  ["stop", "Stop"],
];
// Not "one": "the one server" is not a threshold.
const NUMBER_WORDS = ["zero", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "twenty", "fifty", "hundred"];
const HAS_NUMBER = new RegExp(`\\d|\\b(${NUMBER_WORDS.join("|")}|half|a third|a quarter|twice|double|both|none of|(less|more) than|below|above)\\b`, "i");
const VAGUE = /\b(most|mostly|few|many|some|often|rarely|enough|no change|doesn'?t move|don'?t move|no new)\b/i;
// Verbs that start a piece of work. Two of them joined by "and" or ";" in one action is two moves.
const VERBS = "add|build|post|ship|write|ask|list|run|fix|offer|publish|pin|help|rewrite|make|create|launch|send|remove|change|interview|record|register|connect|update";
const BUNDLE = new RegExp(`\\b(${VERBS})\\b[^.;:]*?(?:,?\\s+and|;)\\s+(?:then\\s+|also\\s+|\\w+ly\\s+)?(${VERBS})\\b`, "i");
// "Run a pilot, with a simple expiry rule": a second piece of build work hung on the first.
const WITH_BUILD = /,\s*with (?:a|an|the)\s+(?:[\w-]+\s+){0,3}?(rule|feature|filter|page|form|flow|check|integration|setting|opt-out|button|endpoint|template|export)s?\b/i;
const SECOND_ACTION_START = /^(before\b|beforehand\b|in the same (change|pass|edit|release|pr|commit)\b|also\b|at the same time\b|while you'?re at it\b|do it in the same\b)/i;
const BUILD_VERB = new RegExp(`\\b(${VERBS}|set up|bring)\\b`, "i");
const SHIP_IT = /\b(just )?ship (it|them)\b|\bjust (do|launch|ship|post|try) (it|them)\b|\bthe ([\w-]+ ){0,2}(change|move|edit|rewrite|launch|post) itself\b/i;
const RECURRING = /\b(each|every|per) (day|week|month)\b|\b(daily|weekly|monthly)\b/i;
const FALSIFIER = /(what would prove (me|this|it) wrong|I'?m wrong if|I'?d be wrong|this is wrong if|would change my mind)[^\n.!?]*/i;
const COUNT_WORD: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5 };

const strip = (s: string) => s.replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
const snip = (s: string, n = 70) => {
  const t = strip(s);
  return t.length > n ? `${t.slice(0, n)}…` : t;
};

function fieldsOf(block: string): Map<string, string> {
  const found: Array<{ key: string; start: number; end: number }> = [];
  for (const m of block.matchAll(FIELD_LABEL)) {
    const key = FIELD_KEY.find(([, re]) => re.test(m[1]))?.[0];
    if (key) found.push({ key, start: m.index!, end: m.index! + m[0].length });
  }
  const out = new Map<string, string>();
  found.forEach((f, i) => {
    // A value runs to the next label or the end of its line.
    const stopAt = Math.min(found[i + 1]?.start ?? block.length, block.indexOf("\n", f.end) === -1 ? block.length : block.indexOf("\n", f.end));
    if (!out.has(f.key)) out.set(f.key, block.slice(f.end, stopAt).replace(/^[\s*_]+|[\s*_]+$/g, ""));
  });
  return out;
}

const HEADING = /^#{1,6}\s/;
const BOLD_LINE = /^\*\*[^*]+\*\*\s*:?\s*$/;
const NUMBERED = /^(?:#{1,6}\s*|\*\*)?(\d+)[.)]\s/;
const MOVE_N = /^(?:#{1,6}\s*|\*\*)?Move\s+(\d+)\b\s*(?:\*\*)?\s*[:.—–-]?/i;
const LIST_OR_FIELD = new RegExp(`^(\\s+|[-*+]\\s|${FIELD_LABEL.source.replace("(?:^|[\\s(*_])", "")})`, "i");
const MOVES_HEADING = /\bmoves?\b/i;
const NOT_MOVES = /\bnot\b|fix first/i;
// Headings under which a numbered list is expected and is not a to-do list.
const LIST_OK = /question|fix first|smaller|evidence|appendix|source|risk|contradiction|tool|log|assumption|what not|finding|calendar|week|plan|timeline|schedule/i;

export function lintMoves(text: string): MoveLint {
  const lines = text.replace(/```[\s\S]*?```/g, "").split("\n");
  const blocks: Array<{ n: number; lines: string[]; sectionCount: number | null }> = [];
  const stray: Array<{ heading: string; items: string[] }> = [];
  let inSection = false;
  let sectionCount: number | null = null;
  let current: { n: number; lines: string[]; sectionCount: number | null } | null = null;
  let afterBlank = false;
  let heading = "";
  let strayList: { heading: string; items: string[] } | null = null;
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    if (!line) {
      afterBlank = true;
      continue;
    }
    const isHeading = HEADING.test(line) || BOLD_LINE.test(line);
    const moveN = MOVE_N.exec(line);
    const numbered = NUMBERED.exec(line);
    if (moveN || (inSection && numbered)) {
      current = { n: Number((moveN ?? numbered)![1]), lines: [line], sectionCount };
      blocks.push(current);
      inSection = true;
      afterBlank = false;
      strayList = null;
      continue;
    }
    if (isHeading) {
      current = null;
      strayList = null;
      heading = strip(line.replace(/^#+/, ""));
      inSection = MOVES_HEADING.test(heading) && !NOT_MOVES.test(heading);
      const w = /\b(one|two|three|four|five|[1-5])\b/i.exec(heading);
      sectionCount = inSection && w ? COUNT_WORD[w[1].toLowerCase()] : null;
      afterBlank = false;
      continue;
    }
    if (current) {
      if (afterBlank && !LIST_OR_FIELD.test(line)) {
        // A plain paragraph after the moves ends them.
        current = null;
        inSection = false;
      } else {
        current.lines.push(line);
        afterBlank = false;
        continue;
      }
    }
    afterBlank = false;
    if (numbered && !/^\s/.test(raw)) {
      if (!strayList) stray.push((strayList = { heading, items: [] }));
      strayList.items.push(line);
    } else if (!/^\s/.test(raw)) strayList = null;
  }

  const issues: string[] = [];
  const moves: MoveInfo[] = [];
  blocks.forEach((b, i) => {
    const n = i + 1;
    const block = b.lines.join("\n");
    const first = b.lines[0].replace(NUMBERED, "").replace(MOVE_N, "");
    const bold = /^\s*\*\*([^*]+)\*\*/.exec(first)?.[1];
    const title = strip(bold ?? first.split(/(?<=[.!?])\s/)[0]);
    const fields = fieldsOf(block);
    moves.push({ n, title, fields: [...fields.keys()] });
    const label = `Move ${n}`;

    // A time box in the title ("(weeks 1-3)", "a 4-week pilot") counts; an interview or pilot is its own cheapest test.
    const missing = REQUIRED.filter(
      ([k]) => !fields.has(k) && !(k === "timeBox" && /\bweeks? \d|\b\d+[\s-]?(day|week|month)s?\b/i.test(title)) && !(k === "test" && /\b(interview|pilot|survey|test|experiment)s?\b/i.test(title))
    ).map(([, l]) => l);
    if (missing.length) issues.push(`${label} has no ${missing.map((m) => `"${m}:"`).join(", ")} line.`);

    const action = fields.get("action") ?? title;
    const bundle = BUNDLE.exec(action) ?? WITH_BUILD.exec(action);
    if (bundle) issues.push(`${label} bundles two actions ("${snip(bundle[0])}"). Keep one; give the other its own move, or put it under "Fix first" or "What not to do yet".`);
    const sentences = block
      .split(/\n|(?<=[.!?])\s+/)
      .map((s) => strip(s.replace(/^\s*[-*+]\s+/, "").replace(NUMBERED, "")))
      .filter(Boolean);
    for (const s of sentences) {
      if (SECOND_ACTION_START.test(s) && BUILD_VERB.test(s.replace(SECOND_ACTION_START, ""))) {
        issues.push(`${label} adds a second action ("${snip(s)}"). One action per move: make it its own move, or put it under "Fix first".`);
        break;
      }
    }

    const test = fields.get("test");
    if (test && SHIP_IT.test(test)) issues.push(`${label}: the cheapest test is the move itself ("${snip(test)}"). Name something smaller that shows first whether it will work (show the new page to 5 buyers, a one-week trial).`);
    else if (test && RECURRING.test(test)) issues.push(`${label}: the cheapest test repeats ("${snip(test)}"). A test is one check with an end date.`);

    const stop = fields.get("stop");
    if (stop !== undefined && /^(none|n\/a)\b|hygiene/i.test(stop)) issues.push(`${label} has no stop condition ("${snip(stop)}"). A fix with nothing to test goes under "Fix first", one line.`);
    else if (stop !== undefined && !HAS_NUMBER.test(stop)) {
      const vague = VAGUE.exec(stop);
      issues.push(`${label}: the stop line has no number ("${snip(stop)}")${vague ? `; "${vague[0]}" is not a threshold` : ""}. Say the result that means drop or change it as a number ("fewer than 5 of 20 agree").`);
    }
  });

  if (blocks.length > MAX_MOVES) issues.push(`${blocks.length} moves; at most ${MAX_MOVES}. Cut the weakest, or put correctness fixes under "Fix first", one line each.`);
  const stated = blocks[0]?.sectionCount;
  if (stated && stated !== blocks.length && blocks.every((b) => b.sectionCount === stated)) issues.push(`The heading says ${stated} moves but ${blocks.length} are listed.`);

  // A numbered to-do list outside the moves is extra moves under another name.
  for (const s of stray) {
    if (s.items.length < 2 || LIST_OK.test(s.heading)) continue;
    const todo = s.items.filter((l) => new RegExp(`^(?:\\*\\*)?\\d+[.)]\\s+(?:\\*\\*)?(${VERBS}|set up|start|stop|use|try|test|move|cut|drop|put|keep|get|check|confirm|switch)\\b`, "i").test(l));
    if (todo.length >= 2 && todo.length * 2 >= s.items.length) issues.push(`A numbered list of ${s.items.length} actions outside the moves${s.heading ? ` (under "${snip(s.heading, 40)}")` : ""}. Fold it into the moves, label it "Fix first" (one line each), or cut it.`);
  }

  const fals = FALSIFIER.exec(text);
  if (fals && !HAS_NUMBER.test(fals[0]) && VAGUE.test(fals[0])) issues.push(`"What would prove me wrong" has no number ("${snip(fals[0], 90)}"). Give the result that would change your mind as a number.`);
  return { moves, issues };
}
