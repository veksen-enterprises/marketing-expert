# Advisor evaluations

Realistic cases run through the MCP server by an agent playing the AI assistant (using `scripts/mcp.mjs`), then graded against `rubric.md` by a separate agent. The point is to find where the server's instructions, prompts, playbooks or tools steer the advice wrong.

- `cases.md`: the cases (business, user message, what the assistant may look at).
- `rubric.md`: grading checklist.
- `runs/<case>.md`: the assistant's answer plus its tool-call log.
- `grades/<case>.md`: the grader's scores and the fixes it attributes to the server.
