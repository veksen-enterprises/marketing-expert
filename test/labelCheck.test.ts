import { describe, it, expect } from "vitest";
import { checkLabels } from "../src/lib/labelCheck.js";
import { checkAnswer } from "../src/lib/answerCheck.js";

// These use the real playbooks in knowledge/, so they pin known passages.
describe("checkLabels", () => {
  it("flags a qualifier dropped from a playbook label", () => {
    const r = checkLabels("Developers judge a tool by its docs and quickstart [first-party survey].");
    expect(r[0].status).toBe("qualifier-dropped");
    expect(r[0].sourceLabels.join(" ")).toMatch(/self-selected/);
  });
  it("accepts the full bracket", () => {
    const r = checkLabels("Developers judge a tool by its docs and quickstart [first-party survey; self-selected sample].");
    expect(r[0].status).toBe("ok");
  });
  it("ignores sentences without labels", () => {
    expect(checkLabels("Fix the price first. Then the docs.")).toEqual([]);
  });
  it("feeds check_answer's problems", () => {
    const a = checkAnswer("Developers judge a tool by its docs and quickstart [first-party survey].");
    expect(a.labelIssues).toHaveLength(1);
    expect(a.problems.join(" ")).toMatch(/Copy the whole bracket/);
  });
});
