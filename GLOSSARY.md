# marketing-expert

An MCP server that makes a model advise on marketing like a careful senior marketer who has read the business's repo. This is the language of the project itself; marketing terms for users (CAC, ROAS…) are in `knowledge/glossary.md`.

## The advice

**Advisor**:
The model that uses this server to advise a founder.
_Avoid_: assistant, agent (agent means a coding agent; see Agent channel)

**Answer**:
The advisor's reply to one question, with a 1,200-word limit.
_Avoid_: response, report

**Plan**:
A dated 90-day plan, the longer deliverable, with a 1,800-word limit.
_Avoid_: roadmap, strategy doc

**Diagnosis**:
The advisor's statement of what limits growth right now, with its evidence, made before any move.
_Avoid_: analysis, assessment

**Constraint**:
The one thing the diagnosis names as limiting growth now: activation and proof, positioning, reach, conversion, retention or unit economics.
_Avoid_: bottleneck, blocker, problem

**Falsifier**:
What result would prove the diagnosis wrong, stated in the answer.
_Avoid_: counter-evidence, risk

**Move**:
One recommended action in an answer, with a mechanism, a cheapest test, a metric, a time box and a stop line; an answer has at most three.
_Avoid_: recommendation, tactic, initiative, bet

**Stop line**:
The number that, if missed by the time box, means stopping the move.
_Avoid_: kill criteria, exit condition

**Agent channel**:
Coding agents as a route to users: how an agent finds and chooses a product's MCP server or library.
_Avoid_: AI channel, LLM distribution

## Small bets

**Small bet**:
An entry in the catalog of cheap marketing tests (a listing, founder emails, a comparison page…), with what it needs, its earliest stage, how to measure it and when to stop. Small bets are separate from moves.
_Avoid_: tactic, quick win, growth hack

**Stage**:
How far a business has got, from 0 to 3: no users yet, first users, steady use, something newsworthy. Worked out from traction, not from how the founder describes it.
_Avoid_: phase, maturity, funding stage

**Fits now / fits later / doesn't fit**:
The three verdicts on a small bet for one business: it can run today; something it needs is missing; it suits another kind of business or breaks a principle.
_Avoid_: applies, eligible, recommended

## The business

**Business profile**:
The stored facts about one business that every answer starts from: product, customers, alternatives, pricing, dated metrics, traction, assets, principles.
_Avoid_: account, company record, context

**Traction**:
Dated counts of active users, monthly visits and paying customers.
_Avoid_: metrics (metrics is the wider set), KPIs

**Assets**:
What a business has besides users that a bet can run on: data nobody else has published, expertise, a founder audience, a budget, a way to reach each user.
_Avoid_: resources, advantages

**Principles**:
What the business refuses to do: its non-goals and values, which advice must respect.
_Avoid_: constraints, rules, values

**Avoid tag**:
One principle written as a fixed tag (publishing user content, cold outreach…) so a tool can check it.
_Avoid_: blocklist, exclusion

**Limits**:
The founder's practical limits, such as hours a week or budget.
_Avoid_: constraints (constraint means the diagnosis)

## Knowledge

**Playbook**:
A served guide on one business type, channel, foundation or strategy question, where every claim carries an evidence tag and traces to a research note.
_Avoid_: guide, article, doc

**Research note**:
The cited sources behind one or more playbooks, each with what it says and how it was read.
_Avoid_: source file, bibliography

**Evidence tag**:
The bracket after a claim that gives its strength and qualifiers, such as `[research; RCT, n=7,867; one firm]`.
_Avoid_: label, citation

**Strength**:
The level in an evidence tag: research, first-party, practitioner, vendor or rule of thumb.
_Avoid_: confidence, grade

**Qualifier**:
A caveat inside an evidence tag that limits the claim: one firm, self-selected, snippet-only, abstract only.
_Avoid_: footnote, disclaimer

**Snippet-only**:
A source seen only as a search-engine summary, not read at the source.
_Avoid_: unverified, secondary

**Folklore**:
A claim widely repeated with no traceable source, listed so the advisor stops repeating it.
_Avoid_: myth, misconception

## Reading the business's repo

**Site claim**:
A line in a business's site or docs that promises something checkable: a price, data handling, availability, setup, proof.
_Avoid_: claim (alone), statement

**Conflict**:
Two site claims that may disagree, reported with both locations.
_Avoid_: contradiction (until both lines are read)

**Decision record**:
A business's own record of a decision and its status, used to tell shipped from planned.
_Avoid_: ADR (when talking about the business's records rather than this repo's)

## Evaluation

**Case**:
One evaluation scenario: a business and a founder's question, asked word for word.
_Avoid_: test case, scenario, prompt

**Fixture**:
The material an advisor may read for a fictional case: an about file, numbers and sometimes a page.
_Avoid_: mock, sample data

**Run**:
One advisor's answer to one case, with its tool log.
_Avoid_: trial, attempt

**Grade**:
A grader's scores for one run against the rubric, with its errors and their causes.
_Avoid_: review, evaluation

**Rubric**:
The fixed ten-item checklist every run is graded against, never against earlier rounds.
_Avoid_: criteria, scorecard

**Round**:
One set of runs across all cases after a change to the server.
_Avoid_: iteration, version

**Error class**:
The kind of mistake a grader found (misquote, wrong line, qualifier dropped, bundled move, unexplained jargon…), counted across a round.
_Avoid_: bug, issue

**Anonymised case**:
A case about a real business whose names are replaced by a stand-in profile (DBTool, GameX Companion).
_Avoid_: real case, private case
