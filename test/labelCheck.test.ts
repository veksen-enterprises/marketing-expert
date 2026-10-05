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
  it("flags a playbook claim repeated with no label", () => {
    // companion-risk, round 5: four [practitioner] claims repeated without a label.
    const r = checkLabels("One unhappy moderator can remove you in one click.");
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ status: "unlabelled-reuse", sourceLabels: ["practitioner"] });
    expect(r[0].source).toMatch(/^community-and-hobby-products:29 /);
    expect(checkAnswer("One unhappy moderator can remove you in one click.").problems.join(" ")).toMatch(/Add the playbook's label \[practitioner\] \(community-and-hobby-products:29/);
  });
  it("accepts a labelled paraphrase, and a label written out in words", () => {
    expect(checkLabels("Moderators can remove you in one click, so treat them as your first customers [practitioner].")[0].status).toBe("ok");
    expect(checkLabels("Moderators can remove you in one click (practitioner advice).")[0].status).toBe("ok");
  });
  it("flags one bracket or parenthesis that mixes two evidence levels", () => {
    expect(checkLabels("Treat moderators as your first customers (practitioner rule of thumb).")[0].status).toBe("merged");
    // A bracket a playbook itself uses is fine.
    expect(checkLabels("Treat moderators as your first customers [first-party; practitioner].")[0].status).not.toBe("merged");
  });
  it("takes the paragraph a quoted phrase comes from as the source", () => {
    // Search matched this to the developer-docs paragraph and reported a dropped "self-selected sample".
    const r = checkLabels('Show HN wants "something you\'ve made that other people can play with" [first-party].');
    expect(r[0]).toMatchObject({ status: "ok", matchedBy: "exact-quote" });
    expect(r[0].source).toMatch(/^developer-tools:46 /);
    expect(r[0].sourceText).toMatch(/Hacker News \(Show HN\)/);
  });
  it("checks a '(<slug> playbook)' citation that has no label", () => {
    const r = checkLabels("Perplexity's top commercial sources include G2, Gartner, NerdWallet and Yelp (ai-assistant-visibility playbook).");
    expect(r[0]).toMatchObject({ status: "qualifier-dropped", matchedBy: "named-playbook", sourceLabels: ["vendor, not re-verified"] });
  });
  it("takes a parenthesis as a label only when it starts with an evidence tag", () => {
    expect(checkLabels("Most vendors publish case studies (the vendor's own research, so read it with care).").map((l) => l.status)).not.toContain("merged");
    expect(checkLabels("Treat moderators as your first customers (practitioner rule of thumb).")[0].status).toBe("merged");
  });
  it("needs a clear search lead before calling a sentence an unlabelled reuse", () => {
    // devtool-competition, round 5: matched the third search hit, on the words "tool agents call not their".
    expect(checkLabels("Be the tool agents call, not their rival.")).toEqual([]);
  });
});
