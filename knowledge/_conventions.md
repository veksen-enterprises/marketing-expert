Files starting with "_" are not served by the MCP server.

Evidence tags used in every playbook:
- [research]  peer-reviewed or controlled study; replicated where noted
- [first-party] platform's own documentation
- [practitioner] framework or rule from experienced practitioners; not empirically tested
- [vendor] data published by a company with a commercial interest in the conclusion
- [rule-of-thumb] widely repeated heuristic with no traceable empirical basis

Every factual claim should trace to /research/*.md, where sources and access caveats are recorded.

Access marks in research notes say how a source was seen: [read DATE] the text itself; [read DATE; fetch summary] only through a fetch tool that returns a model's summary and chosen quotes (WebFetch does this), so figures and quotes are the tool's, unchecked against the text: treat them as one level weaker than a read, and re-check a figure before it enters a playbook; [abstract] abstract or publisher page only; [snippet-only] search-result text only. test/researchMarks.test.ts checks that reads through a fetch tool say "fetch summary".

Vocabulary: readers are founders learning business, often in a second language. Use the real business term and explain it in plain words on first use; knowledge/glossary.md gives each term's plain one-liner. Never use "moat"; say "defensibility" or describe what stops competitors. Explain any other jargon (flywheel, wedge) in plain words. Exact titles of cited works are kept as published.

Case facts (company stories, prices, dates) are checked against a primary source before they enter a playbook, and carry their access level. In one spot check, 5 of 10 case rows needed a correction and one number was not in its cited source.
