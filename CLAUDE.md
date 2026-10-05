# Working on marketing-expert-mcp

Read `VISION.md` first (why, principles, lessons), then `ROADMAP.md` (what to work on). `README.md` is the user-facing guide. `GLOSSARY.md` holds the project's own terms (advisor, move, small bet, stage, evidence tag, case, run…): use them as defined there. Decisions are in `docs/adr/`.

## Layout

- `src/server.ts`: tool and resource registration, and `INSTRUCTIONS` (the operating rules sent to the agent). A test caps the instructions' word count: replace text, don't append.
- `src/prompts.ts`: guided workflows. `prompts/seo-site-review-v2.md` holds the long SEO review prompt.
- `src/lib/*.ts`: pure, tested logic, one module per tool area. `netguard.ts` guards every outbound fetch.
- `knowledge/*.md`: playbooks served to the agent (frontmatter: title, summary, tags). Files starting with `_` aren't served; `_conventions.md` holds the evidence tags and writing rules.
- `research/*.md`: cited source notes behind the playbooks, with access marks and open questions.
- `evals/`: method (`rubric.md`, `cases.md`, `README.md`) and results.
- `scripts/mcp.mjs`: command-line MCP client, used by evaluations and by agents without MCP support.

## Commands

```bash
npm install && npm run build
npx tsc --noEmit -p .
npm test                     # build first: the end-to-end test runs dist/
node scripts/mcp.mjs tools   # see what the agent sees
```

Run `npm test` and check its exit code before committing; a grep of the output is not enough.

## Rules for changes

- **Fix error classes with tools or checks, not new instruction text.** If the advisor keeps making a mistake, make `check_answer`, `verify_quotes`, `scan_source` or a calculator catch it, with a test built from a real failing answer.
- **Bugs: failing test first.** Reproduce, then fix. If you can't reproduce, don't change the code.
- **Tool output is read as instructions.** Notes and verdicts must be accurate, worded no stronger than what was checked, and must say what was not checked (no silent skips or caps).
- **Anything that widens what a tool can read or fetch needs a security look.** Never read `.git`, credential folders or files outside the given directory; never follow symbolic links out of it; keep the private-address guard on every hop.
- **Playbook claims carry an evidence tag with qualifiers inside the bracket** (`[research; RCT, n=7,867; one firm]`). Every claim traces to `research/`. Check case facts against the primary source before they enter a playbook. `test/consistency.test.ts` checks that tool and playbook names referenced in playbooks exist.
- **Plain English, short sentences, never "moat"**, in playbooks, tool output and prompts.
- **No business-specific content in the repo.** Evaluation cases used real businesses; their runs, grades and any strategy written for them stay out of git unless the owner agrees. Anonymise when writing generic research from them.
- **Commits:** explain what and why in the body. Commit only the files you changed (`git commit -- <paths>`) when other agents share the working tree.

## Evaluating a change

1. Pick cases from `evals/cases.md` (or add cases for business types not yet covered: see ROADMAP).
2. Run at least 3 advisor runs per case through `scripts/mcp.mjs`, each with its own `MARKETING_EXPERT_DATA_DIR` and its own temp directory; tell each not to read other temp files.
3. Grade each run independently against `evals/rubric.md` only (not against earlier rounds). Graders open every cited file, recompute `check_answer`'s fingerprint on the saved answer, and tag each error with a class (misquote, wrong-line, qualifier-dropped, bundled-move, unexplained-jargon and so on).
4. Compare per-case ranges and error-class counts with the last round. A change counts only if it beats the within-case spread (about 2 points).

Evaluation outputs go under `evals/runs/` and `evals/grades/`; check with the owner before committing them.

## Environment notes

- Sandboxed sessions often can't reach publishers, journals or company sites; local sessions usually can. Mark research taken from search snippets as `snippet-only`, and say when a site couldn't be fetched.
- Never put the owner's name, email or other identifying details in a request (User-Agent, headers, query strings). Skip sources that demand a contact header.
- `MARKETING_EXPERT_ALLOW_PRIVATE=1` is needed to audit a local server; `MARKETING_EXPERT_CHROMIUM` enables render mode and its tests.
