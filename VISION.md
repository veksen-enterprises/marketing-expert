# Vision

## Why this exists

A founder who isn't a marketer asks an AI agent "how do I get customers?" and gets a confident, generic, unfalsifiable answer: ten channels, made-up numbers, frameworks recited, nothing checked against the product. The model knows marketing textbooks. What it lacks is discipline: it does arithmetic in its head, treats folklore as evidence, doesn't look at what the product actually ships, and writes long.

This server gives an agent that discipline. It should make any agent advise like a careful senior marketer who has read your repo: diagnose first, use real numbers or labelled assumptions, say how strong the evidence is, recommend at most three moves you can test cheaply, and say what would prove the advice wrong.

The first users are technical founders at zero to ten customers, mostly B2B and developer tools, working inside Claude Code or a similar agent. The advice must also work for other business types (ecommerce, local services, consumer apps, marketplaces), which the playbooks cover but the evaluations haven't measured yet.

## Principles

1. **Tools over instructions.** When the advisor keeps making an error, build a check or a tool that catches it mechanically. Adding a rule to the instructions rarely sticks; every mechanical check we added fixed its error class. The instructions have a word cap test, so a new rule must replace an old one.
2. **Look before advising.** Read the business's own repo, docs and site source; check what is shipped, partial or planned; treat contradictions between site, docs and code as findings. The most valuable findings in every evaluation came from code, not from marketing knowledge.
3. **Numbers come from tools.** Calculators state their inputs and mark assumed ones. The agent never presents a hand-calculated figure.
4. **Evidence is labelled honestly.** Every playbook claim carries its strength (research, first-party, practitioner, vendor, rule of thumb) and its caveats (snippet-only, self-selected, one firm). Where research is thin, say so, and generate evidence (experiments, coded case sets) labelled as our own.
5. **Short, ranked, testable.** At most three moves, each one action, with a cheapest test, a metric, a time box and a stop condition. Say what not to do yet and what would prove the diagnosis wrong.
6. **Respect the founder's vision.** Check advice against the business's stated principles and non-goals.
7. **Business language, explained.** Readers are not business people, and many want to learn the trade, and their first language may not be English. Use the real business term and explain it in plain words the first time (the glossary holds both); never "moat".
8. **Measure, don't assume.** Changes are judged by evaluations on real cases, graded against a fixed rubric, with several runs per case so noise is visible.

## What exists

- **26 tools:** calculators (A/B tests, unit economics, paid media, funnels, market size, liquidity), audits (page, site crawl, AI crawler access, copy, platform limits, UTM), repo checks (`scan_source`), self-checks on the draft (`check_answer`, `verify_quotes`), business profiles, small-bet matching (`match_small_bets`), playbook search, and `learn_more` to expand any summary.
- **11 prompts:** fixed workflows (diagnosis, strategy with a pre-revenue path, positioning, landing page teardown, experiment plan, campaign brief, launch plan, opportunity assessment, competitive strategy, exits, technical SEO review).
- **59 playbooks** in `knowledge/` built from **49 research notes** in `research/`. On 2026-10-05 the snippet-only citations were re-read at their sources; about 100 remain unreachable.
- **An evaluation method** in `evals/`: real cases, a 10-item rubric, graders that check every claim against the business's repo.
- See `README.md` for usage and `ROADMAP.md` for gaps.

## What we learned building it

These are the lessons a new contributor most needs.

- **Instructions saturate; tools don't.** Five rounds of instruction changes each fixed some errors while new ones appeared, and totals stayed flat. What moved specific error classes was mechanical: a word counter (answers over the limit went from 18 of 18 to 1 of 18), a repo claims scanner (findings missed in every earlier round were found every time), a quote verifier (misquotes dropped from several per answer to about one in two).
- **Tool notes are followed like instructions.** A note in `scan_source` saying "prefer the ADR index status" led three advisors to wrong conclusions because the index was stale. Write tool output with the same care as instructions.
- **Self-checks give false confidence when they skip silently.** Early `verify_quotes` dropped short and backticked quotes without saying so. Every check must report what it didn't check.
- **Single runs are noise.** One run per case moved up to 4 points between rounds on nearly the same server. Use at least three runs per case; within-case spread is about 2 points.
- **Graders drift when they compare to the previous round.** They keep finding new faults. Grade each run against the rubric alone.
- **Parallel agents must not share temp files.** Two evaluation answers were swapped between businesses through a shared scratch file. Give every agent its own directory, and fingerprint the checked text.
- **Literature runs out quickly.** No study covers go-to-market at zero customers. The most useful evidence came from the product's own category (how developer tools that comment on code get adopted) and from generating evidence: a tool-selection experiment, a coded set of 31 first-customer stories, mined customer language.
- **From-memory competitor claims are often wrong.** A comparison said a competitor had no MCP server; its public docs repo showed 30 tools. Check differences at the source.
- **Security regressions hide in helpful changes.** Letting the quote checker read dot-folders also let it read credential files. Review every change that widens what a tool can read or fetch.
