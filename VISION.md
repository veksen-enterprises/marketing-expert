# Vision

## Why this exists

A founder who isn't a marketer asks an AI agent "how do I get customers?" and gets a confident, generic, unfalsifiable answer: ten channels, made-up numbers, frameworks recited, nothing checked against the product. The model knows marketing textbooks. What it lacks is discipline: it does arithmetic in its head, treats folklore as evidence, doesn't look at what the product actually ships, and writes long.

This server gives an agent that discipline. It is a verifier, not an author: the agent writes the advice, and the tools check it. Any agent should advises like a careful senior marketer who has read your repo: diagnose first, use real numbers or labelled assumptions, say how strong the evidence is, recommend at most three moves you can test cheaply, and say what would prove the advice wrong. Behind it sits a playground of research, evaluations and experiments, where changes are measured before they reach the tools. The owner's other expert servers share this shape.

## What it can and can't verify

Marketing outcomes are only partly verifiable. The server checks the process now: numbers, quotes, evidence labels, move format, and claims against the repo. Whether a move worked shows up weeks later, if at all, and at 5 to 100 events a week most before/after comparisons can't tell an effect from noise (`research/deciding-at-founder-volume.md`). So each move the founder takes on is saved as a prediction with a check date, and the next run asks what happened. No published base rates exist for most founder-scale moves (`research/forecasting-and-calibration.md`); those saved outcomes, labelled as our own data, are the only ones that will.

## Who it's for

1. **Now: the owner's own products.** This is first a marketing tool for the owner's portfolio of small products (developer tools, game companions and the like), used inside Claude Code. Running it on those products comes before every other case, and every run is free evaluation. The repo still doesn't name them (ADR 0001).
2. **Later: other technical founders at zero to ten customers**, possibly as a paid service. Evaluations keep at least one case that isn't the owner's, so the advice doesn't fit only the owner's products.

Playbooks for business types and markets the owner's products don't touch (retail, local services, several countries' law) stay, but get no new work until a product needs them.

## Values

What the advisor aims for when the founder hasn't said otherwise, and where it stops.

- **Trust first.** Customers, users and anyone else the product touches should be able to see how it works and not feel tricked. Public image is what that trust looks like from outside. Profit comes from both over time, not from spending them.
- **The line is wider than customers.** A tactic is over the line if anyone affected would feel tricked or exposed by it once they saw how it works, including people who never signed up: someone whose name or picture a product publishes, a forum a launch post is aimed at, a competitor named on a comparison page.
- **Over the line, two cases.** If it is illegal, or likely illegal where the business operates, the advisor declines that part, says what it would cost, and offers the honest version that gets most of the effect. If it is legal, it says plainly what it costs in trust and who bears it, then helps.
- **Careful about law, never legal advice.** Name the jurisdiction and the rule, cite the source, say what wasn't checked, and say when a lawyer is worth paying for: personal data, children, health, money, or anything that publishes people who didn't opt in.
- **Bad news first.** If the evidence says a product probably won't work, that is the first finding, marked as such, with what would change the verdict. Hiding it under other risks is the worse failure.
- **A warning the founder overrides is recorded, not repeated.** The advisor stores the decision and what would reopen it (a removal request, a complaint, traffic past a stated level) in the business profile, and raises it again only when one of those happens.

## Principles

1. **Tools over instructions.** When the advisor keeps making an error, build a check or a tool that catches it mechanically. Adding a rule to the instructions rarely sticks; mechanical checks have cut their error class every time, though not always to zero (`ROADMAP.md`, known weak spots). The instructions have a word cap test, so a new rule must replace an old one.
2. **Look before advising.** Read the business's own repo, docs and site source; check what is shipped, partial or planned; treat contradictions between site, docs and code as findings. The most valuable findings in every evaluation came from code, not from marketing knowledge.
3. **Numbers come from tools.** Calculators state their inputs and mark assumed ones. The agent never presents a hand-calculated figure.
4. **Evidence is labelled honestly.** Every playbook claim carries its strength (research, first-party, practitioner, vendor, rule of thumb) and its caveats (snippet-only, self-selected, one firm). Where research is thin, say so, and generate evidence (experiments, coded case sets) labelled as our own.
5. **Short, ranked, testable.** At most three moves, each one action, with a cheapest test, a metric, a time box and a stop line with a number. At founder volume a stop line is a decision rule written before starting, not a significance test (`research/stop-line-statistics.md`). Say what not to do yet and what would prove the diagnosis wrong.
6. **Respect the founder's vision.** Check advice against the business's stated principles and non-goals, and against the values above.
7. **Flag design, never grade it.** Where building is cheap and categories are crowded, design is often the lever. The server says so and points to a cheap human check; it doesn't judge design (`research/design-and-marketing-in-crowded-markets.md`).
8. **Business language, explained.** Readers are not business people, and many want to learn the trade, and their first language may not be English. Use the real business term and explain it in plain words the first time (the glossary holds both); never "moat".
9. **Measure, don't assume.** Changes are judged by evaluations on real cases: at least three runs per case, baseline and candidate graded together in one blind batch against a fixed rubric, and the difference read across cases with a confidence interval (`evals/README.md`).

## What exists

- **26 tools:** calculators (A/B tests, unit economics, paid media, funnels, market size, liquidity), audits (page, site crawl, AI crawler access, copy, platform limits, UTM), repo checks (`scan_source`), self-checks on the draft (`check_answer`, `verify_quotes`), business profiles, small-bet matching (`match_small_bets`), playbook search, and `learn_more` to expand any summary.
- **13 prompts:** `get_started` for a first run in a product repo, plus fixed workflows (diagnosis, strategy with a pre-revenue path, idea generation, positioning, landing page teardown, experiment plan, campaign brief, launch plan, opportunity assessment, competitive strategy, exits, technical SEO review).
- **60 playbooks** in `knowledge/` built from **58 research notes** in `research/`. On 2026-10-05 the snippet-only citations in the notes written by then were re-read at their sources; about 100 remain unreachable. The seven notes from 2026-10-27 missed that pass, and several were read through a page-summarising fetch tool.
- **Business profiles** on your machine: confirmed facts, metrics marked counted or estimated, and predictions, with overdue ones raised on the next run. A Claude Code plugin installs the server and the `get_started` skill.
- **An evaluation method** in `evals/`: real cases, a rubric of 8 scored items and 2 pass/fail gates, blind graders that check every claim against the business's repo, and `scripts/evals/grade.mjs` for paired blind batches. Grader versus run variance is not measured yet.
- See `README.md` for usage and `ROADMAP.md` for gaps.

## Where it may go

If people besides the owner want it, a paid version would be two servers: a local one that reads the business's files, and a hosted one with auth for playbooks, calculators and page fetches, with a check that the local one is current. Source code never leaves the user's machine: the local server runs the file checks itself (`scan_source`, `verify_quotes`, `check_answer`) and fetches the playbook text it needs. A hosted server that fetches any URL for strangers needs abuse limits beyond the private-address guard. Nothing here is built yet; it waits until someone besides the owner uses the free version.

## What we learned building it

These are the lessons a new contributor most needs.

- **Instructions saturate; tools don't.** Five rounds of instruction changes each fixed some errors while new ones appeared, and totals stayed flat. What moved specific error classes was mechanical: a word counter (answers over the limit went from 18 of 18 to 1 of 18), a repo claims scanner (findings missed in every earlier round were found every time), a quote verifier (misquotes dropped from several per answer to about one in two).
- **Tool notes are followed like instructions.** A note in `scan_source` saying "prefer the ADR index status" led three advisors to wrong conclusions because the index was stale. Write tool output with the same care as instructions.
- **Self-checks give false confidence when they skip silently.** Early `verify_quotes` dropped short and backticked quotes without saying so. Every check must report what it didn't check.
- **Single runs are noise.** One run per case moved up to 4 points between rounds on nearly the same server. Use at least three runs per case. Read them across cases, not case by case: per case, a 2-point bar misses most real 1-point gains (`research/grader-reliability.md`).
- **Graders drift between rounds.** They keep finding new faults, and an instruction not to compare didn't stop it. The fix was a tool, not an instruction: `grade.mjs` grades the old and new versions in one blind, shuffled batch, so drift hits both equally.
- **Parallel agents must not share temp files.** Two evaluation answers were swapped between businesses through a shared scratch file. Give every agent its own directory, and fingerprint the checked text.
- **Literature runs out quickly.** No study covers go-to-market at zero customers, and 33 of 47 small bets rest on anecdote. The most useful evidence came from the product's own category (how developer tools that comment on code get adopted) and from generating evidence: a tool-selection experiment, a coded set of 31 first-customer stories, mined customer language.
- **From-memory competitor claims are often wrong.** A comparison said a competitor had no MCP server; its public docs repo showed 30 tools. Check differences at the source.
- **Security regressions hide in helpful changes.** Letting the quote checker read dot-folders also let it read credential files. Review every change that widens what a tool can read or fetch.
