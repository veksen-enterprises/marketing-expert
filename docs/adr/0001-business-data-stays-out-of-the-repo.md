# Business data stays out of the repo; real cases are anonymised profiles

Evaluations use two real businesses, but their names, domains and product details must not be published with this project. We decided on 2026-10-05 to rewrite the whole git history (authors and dates kept) so they appear only as stand-in profiles, DBTool and GameX Companion, and to keep raw runs, grades and strategy for them outside git. Fictional cases (`evals/fixtures/`) are the default for new evaluations because they can be committed.

## Consequences

- Anyone adding material about a real business must anonymise it first; the replacement map used for the rewrite lives outside the repo.
- Rewriting history again is costly (force-push, every clone goes stale), so prevention is cheaper: a check that fails on the private names, read from an untracked file, is the planned guard.
