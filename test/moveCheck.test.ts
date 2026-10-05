import { describe, it, expect } from "vitest";
import { lintMoves } from "../src/lib/moveCheck.js";
import { checkAnswer } from "../src/lib/answerCheck.js";

// The moves below are from round-5 eval answers, cut to the lines the graders marked down.
const clean = `**Moves, in order**

1. **Show the new homepage to 5 target developers.** *Mechanism*: their words show what the page fails to say. *Cheapest test*: five 15-minute calls. *Metric*: how many can say what it does. *Time box*: 2 weeks. *Stop*: if fewer than 3 of 5 can, rewrite the headline before anything else.`;

describe("lintMoves", () => {
  it("passes a move with one action and every field", () => {
    const r = lintMoves(clean);
    expect(r.moves).toHaveLength(1);
    expect(r.moves[0].fields).toEqual(expect.arrayContaining(["mechanism", "test", "metric", "timeBox", "stop"]));
    expect(r.issues).toEqual([]);
  });

  it("companion-risk: a second piece of build work hung on the action", () => {
    const r = lintMoves(`**Three moves**

2. **Run a 4-week watch pilot in that server, with a simple expiry rule so old items stop firing.** Mechanism: watches are the reason to come back. Cheapest test: 10 traders for a week. Metric: weekly users with an active watch. Time box: 4 weeks. Stop: fewer than 20 people with a watch.`);
    expect(r.issues.join(" ")).toMatch(/bundles two actions \(", with a simple expiry rule/);
  });

  it("devtool-strategy: 'just ship it' as the test, and 'Beforehand, list…'", () => {
    const r = lintMoves(`**Three moves, in order**

2. **Rewrite the homepage and pricing page around one claim (weeks 3–6).** Mechanism: developers judge a tool by whether its claims hold up. Cheapest test: just ship it; your traffic likely can't support an A/B test. Metric: share of new signups with a first CI result within 7 days. Time box: 4 weeks. Stop condition: no change means the message isn't the problem; look at onboarding.

3. **One Hacker News launch post for the agent-plus-CI setup (weeks 7–9).** Mechanism: a concentrated developer audience. Beforehand, list the server in the official MCP Registry so visitors can add it in one step. Cost: a day. Metric: projects reaching a first CI result within 14 days. Stop condition: fewer than 10 activated projects means setup friction.`);
    const all = r.issues.join("\n");
    expect(all).toMatch(/Move 1: the cheapest test is the move itself \("just ship it/);
    expect(all).toMatch(/Move 1: the stop line has no number .*"no change" is not a threshold/);
    expect(all).toMatch(/Move 2 adds a second action \("Beforehand, list the server/);
    expect(all).toMatch(/Move 2 has no "Cheapest test:" line/);
  });

  it("companion-strategy: move 3 has no time box", () => {
    const r = lintMoves(`## Moves, in order

**3. Time a public push to the next ladder season start.**
- Action: post once on r/gamex a week before the next season.
- Mechanism: season starts are when players look for tools.
- Cheapest test: one post.
- Metric: new Discord logins and new watches in the two weeks after, by source.
- Stop: if fewer than 10 new users set a watch, fix the first visit first.

## What not to do yet
1. Add a second game.`);
    expect(r.moves).toHaveLength(1);
    expect(r.issues).toEqual(['Move 1 has no "Time box:" line.']);
  });

  it("devtool-competition: a stop line with no number", () => {
    const r = lintMoves(`**Three moves, in order**

3. **List the MCP server in the official MCP Registry.** *Mechanism*: agents are becoming the user. *Cheapest test*: one listing. *Metric*: weekly active projects reached via MCP. *Time box*: 6 weeks. *Stop*: if no new active projects come through it, keep the listing and stop spending time on it.`);
    expect(r.issues.join(" ")).toMatch(/the stop line has no number \("if no new active projects/);
  });

  it("flags two verbs joined by 'and' in one action", () => {
    const r = lintMoves(`### Move 1: Rewrite the homepage and publish a comparison page
Mechanism: x. Cheapest test: 5 calls. Metric: signups. Time box: 2 weeks. Stop: fewer than 3 of 5.`);
    expect(r.issues.join(" ")).toMatch(/Move 1 bundles two actions \("Rewrite the homepage and publish/);
  });

  it("flags more than three moves, and a heading that states a different count", () => {
    const move = (n: number) => `${n}. **Interview ${n} users.** Mechanism: x. Metric: y. Time box: 2 weeks. Stop: fewer than 3 of 10.`;
    expect(lintMoves(`## Moves\n\n${[1, 2, 3, 4].map(move).join("\n")}`).issues).toEqual(["4 moves; at most 3. Cut the weakest, or put correctness fixes under \"Fix first\", one line each."]);
    expect(lintMoves(`## Two moves\n\n${[1, 2, 3].map(move).join("\n")}`).issues).toEqual(["The heading says 2 moves but 3 are listed."]);
  });

  it("doesn't count a 'Fix first' list or open questions as moves", () => {
    const r = lintMoves(`${clean}

**Fix first (not a move):**
1. Fix the price on the homepage.
2. Remove "soon" from the MCP line.

## Open questions
1. Is Pro $16 or $20?`);
    expect(r.moves).toHaveLength(1);
    expect(r.issues).toEqual([]);
  });

  it("flags a numbered to-do list outside the moves", () => {
    const r = lintMoves(`${clean}

## Next steps
1. Add a pricing FAQ.
2. Write a launch post.
3. Run a webinar.`);
    expect(r.issues.join(" ")).toMatch(/numbered list of 3 actions outside the moves \(under "Next steps"\)/);
  });

  it("flags a falsifier that uses 'most' or 'few' with no number", () => {
    expect(lintMoves("I'm wrong if interviews show people who reached a first CI result mostly stopped using it.").issues.join(" ")).toMatch(/has no number/);
    expect(lintMoves("I'm wrong if more than 6 of 10 interviewed users stopped using it.").issues).toEqual([]);
  });

  it("feeds check_answer's problems", () => {
    const a = checkAnswer(`**Moves**\n\n1. **Rewrite the homepage.** Mechanism: x. Cheapest test: just ship it. Metric: signups. Time box: 2 weeks. Stop: fewer than 5.`);
    expect(a.moveIssues).toHaveLength(1);
    expect(a.problems.join(" ")).toMatch(/cheapest test is the move itself/);
  });
  it("takes 'none of 10' in a stop line as a threshold", () => {
    expect(lintMoves("## Moves\n\n1. **Show the page to 10 buyers.** Mechanism: x. Cheapest test: 10 calls. Metric: replies. Time box: 2 weeks. Stop: none of 10 buyers can say what it does.").issues).toEqual([]);
    expect(lintMoves("## Moves\n\n1. **Fix the price.** Mechanism: x. Cheapest test: 1 call. Metric: y. Time box: 1 week. Stop: none, it's hygiene.").issues.join(" ")).toMatch(/has no stop condition/);
  });

  it("reads the move count only from a number before 'moves', not from a week range", () => {
    const move = (n: number) => `${n}. **Interview ${n} users.** Mechanism: x. Metric: y. Time box: 2 weeks. Stop: fewer than 3 of 10.`;
    expect(lintMoves(`## Moves (weeks 1–6)\n\n${[1, 2, 3].map(move).join("\n")}`).issues).toEqual([]);
    expect(lintMoves(`## The two key moves (weeks 1–6)\n\n${[1, 2, 3].map(move).join("\n")}`).issues).toEqual(["The heading says 2 moves but 3 are listed."]);
  });

  it("flags a falsifier with no number, on its line or the line under its heading", () => {
    expect(lintMoves("What would prove me wrong: interviews show buyers want production monitoring, not a pre-merge gate.").issues.join(" ")).toMatch(/has no number/);
    expect(lintMoves("## What would prove me wrong\n\nBuyers want production monitoring instead.").issues.join(" ")).toMatch(/has no number \(".*Buyers want production monitoring/);
    expect(lintMoves("## What would prove me wrong\n\nFewer than 3 of 10 buyers ask for a pre-merge gate.").issues).toEqual([]);
  });

  it("doesn't read two verbs in a relative clause as two actions", () => {
    expect(lintMoves("## Moves\n\n1. **Interview developers who build and ship agents.** Mechanism: x. Cheapest test: 10 calls. Metric: replies. Time box: 2 weeks. Stop: fewer than 3 of 10.").issues).toEqual([]);
  });

  it("checks a long action in time that grows with the text", () => {
    const start = Date.now();
    lintMoves(`## Moves\n\n1. **${"add ".repeat(24000)}**`);
    expect(Date.now() - start).toBeLessThan(1000);
  });
});
