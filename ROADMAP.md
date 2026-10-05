# Roadmap

What isn't built yet, what's weak in what is built, and what can't be measured or trusted fully yet. Ordered by how much each would improve the advice.

## Not built yet

1. **Live data connectors.** Google Analytics, Search Console, ad platforms and Stripe. Today every diagnosis runs on numbers you type in or on labelled assumptions. This is the biggest gap.
2. **Three playbooks the evaluations showed are needed:**
   - **Founder-led sales:** discovery calls, demos, pilot agreements that turn into contracts, answering security questionnaires, negotiating price.
   - **Activation and product analytics in practice:** what to track first, event naming, a tracking plan, privacy-friendly tools, and how to define activation for a product whose value needs setup.
   - **Getting listed and found in marketplaces and registries:** the MCP Registry, GitHub Marketplace, VS Code and Chrome stores, and review sites such as G2 (which also feed AI answers). Mobile app stores are covered by app-store-discovery since 2026-10-05.
3. **The agent channel in strategy answers.** For developer tools that ship an MCP server, the strategy prompt doesn't yet require a line on coding agents as a channel. In the latest evaluation, two of three strategy runs for such a product ignored it.

## Known weak spots

4. **Evidence qualifiers still get dropped.** This was the top named error in the latest evaluation (12 times in 18 runs). `check_answer` catches some by matching each labelled claim to the closest playbook passage. Matching by quoted phrase first, and restricting to a playbook the sentence names, would catch more.
5. **Moves still get bundled.** `check_answer` flags moves that combine several actions or lack a test or stop condition, but agents don't always fix what it flags (6 bundled moves and 3 missing tests or stops in 18 runs).
6. **Plain language.** Unexplained jargon still appears (9 times in 18 runs), mostly terms the jargon check doesn't know.

## Not yet measured or fully trusted

7. **Breadth is untested.** Every evaluation case so far is a developer tool or a gaming hobby product. The ecommerce, local-services, consumer-app, marketplace, professional-services and retail playbooks have never been scored. New cases are needed for those business types.
8. **Some research figures still come from search snippets.** On 2026-10-05 a re-verification pass read the primary sources behind the snippet-only citations in all research notes: about 525 confirmed and about 150 corrected, and the playbooks were updated to match. About 100 citations stay marked "re-check" because the source is paywalled, behind a bot check, or needs a contact header (SSRN, ScienceDirect, Wiley, sec.gov, Reddit). Those need a library login or another route.
9. **The agent-channel evidence is a simulation.** The test of how coding agents choose between MCP tools used a text list of tools, not a live agent session. The next test is a live agent loop in a small repo, scoring whether a tool is called at any step.

## Not planned

- A web interface.
- Multiple users or shared accounts.
- Memory beyond the business profiles stored on your machine.
