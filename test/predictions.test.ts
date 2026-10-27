import { describe, it, expect, beforeAll } from "vitest";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

beforeAll(() => {
  process.env.MARKETING_EXPERT_DATA_DIR = mkdtempSync(join(tmpdir(), "me-pred-"));
});

const yarn = { id: "yarn-shop-cards", madeOn: "2026-08-04", move: "Email 40 yarn shops", stop: "Stop if fewer than 3 of 40 agree", k: 3, n: 40, checkOn: "2026-09-15" };
const onboarding = { id: "chart-import", madeOn: "2026-08-04", move: "First-run prompt to import a chart", stop: "Stop if under 25% import in week 1", checkOn: "2026-10-01" };

describe("predictions", async () => {
  const { saveProfile, getProfile, mergePredictions, duePredictions } = await import("../src/lib/profile.js");

  it("merge by id: a partial list keeps the others, and an outcome lands on the right move", () => {
    saveProfile("knit", { predictions: [yarn, onboarding] });
    saveProfile("knit", { predictions: [{ id: "yarn-shop-cards", outcome: { result: "0 of 40 agreed", stopHit: true, how: "measured", k: 0, n: 40 } }] });
    const p = getProfile("knit")!;
    expect(p.predictions!.map((x) => x.id)).toEqual(["yarn-shop-cards", "chart-import"]);
    expect(p.predictions![0].move).toBe("Email 40 yarn shops");
    expect(p.predictions![0].outcome).toMatchObject({ stopHit: true, how: "measured" });
    expect(p.predictions![0].outcome!.recordedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(p.predictions![1].outcome).toBeUndefined();
  });

  it("null on a prediction's field deletes it; null on the list deletes all", () => {
    saveProfile("knit", { predictions: [{ id: "yarn-shop-cards", outcome: null }] });
    expect(getProfile("knit")!.predictions![0].outcome).toBeUndefined();
    saveProfile("knit", { predictions: null });
    expect(getProfile("knit")!.predictions).toBeUndefined();
  });

  it("refuses, and writes nothing, for entries that can't be followed up", () => {
    saveProfile("strict", { product: "x" });
    expect(() => saveProfile("strict", { predictions: [{ id: "a", move: "m", stop: "s" }] })).toThrow(/needs checkOn/);
    expect(() => saveProfile("strict", { predictions: [{ id: "Bad Id", move: "m", stop: "s", checkOn: "2026-11-01" }] })).toThrow(/id of lowercase/);
    expect(() => saveProfile("strict", { predictions: [{ id: "a", move: "m", stop: "s", checkOn: "next month" }] })).toThrow(/can't read checkOn/);
    expect(() => saveProfile("strict", { predictions: [{ id: "a", move: "m", stop: "s", checkOn: "2026-11-01", k: 5 }] })).toThrow(/k and n go together/);
    expect(() => saveProfile("strict", { predictions: [{ id: "a", move: "m", stop: "s", checkOn: "2026-11-01", k: 50, n: 20 }] })).toThrow(/0 ≤ k ≤ n/);
    expect(getProfile("strict")!.predictions).toBeUndefined();
  });

  it("refuses 'it worked' without the number", () => {
    const out = (result: string) => mergePredictions([yarn], [{ id: "yarn-shop-cards", outcome: { result, stopHit: false, how: "recalled" } as never }]);
    expect(() => out("it worked, shops liked it")).toThrow(/needs the number/);
    expect(out("5 of 40 agreed")[0].outcome!.stopHit).toBe(false);
    // Unknown and stop-hit outcomes need a result, but not a number: "never ran it" is an answer.
    expect(mergePredictions([yarn], [{ id: "yarn-shop-cards", outcome: { result: "never sent", stopHit: null, how: "recalled" } as never }])[0].outcome!.stopHit).toBeNull();
    expect(() => mergePredictions([yarn], [{ id: "yarn-shop-cards", outcome: { result: " ", stopHit: null, how: "recalled" } as never }])).toThrow(/needs result/);
  });

  it("warns when stopHit contradicts the counts, and says when it couldn't compare them", () => {
    const w: string[] = [];
    mergePredictions([yarn], [{ id: "yarn-shop-cards", outcome: { result: "1 of 40 agreed", stopHit: false, how: "measured", k: 1, n: 40 } }], w);
    expect(w.join(" ")).toMatch(/stopHit is false, but 1 of 40 is below the stop line's 3/);
    const w2: string[] = [];
    mergePredictions([yarn], [{ id: "yarn-shop-cards", outcome: { result: "4 of 30 agreed", stopHit: false, how: "measured", k: 4, n: 30 } }], w2);
    expect(w2.join(" ")).toMatch(/not checked against the counts because the number of tries differs/);
    const w3: string[] = [];
    mergePredictions([yarn], [{ id: "yarn-shop-cards", outcome: { result: "0 of 40 agreed", stopHit: true, how: "measured", k: 0, n: 40 } }], w3);
    expect(w3).toEqual([]);
  });

  it("the eval fixture's overdue moves come back as due, the resolved and future ones don't", () => {
    const fixture = JSON.parse(readFileSync("evals/fixtures/rowcount.profile.json", "utf8"));
    const now = new Date("2026-10-27T12:00:00Z");
    const due = duePredictions(fixture, now);
    expect(due.map((x) => [x.id, x.daysOverdue])).toEqual([["yarn-shop-cards", 42], ["chart-import-onboarding", 26]]);
    expect(duePredictions(fixture, new Date("2026-09-14T12:00:00Z"))).toEqual([]);
    const resolved = { ...fixture, predictions: mergePredictions(fixture.predictions, [{ id: "yarn-shop-cards", outcome: { result: "0 of 40 agreed", stopHit: true, how: "measured", k: 0, n: 40 } }]) };
    expect(duePredictions(resolved, now).map((x) => x.id)).toEqual(["chart-import-onboarding"]);
  });

  it("a month-only check date is due after the month ends; an unreadable hand-edited one is reported, not dropped", () => {
    const p = { name: "x", predictions: [{ ...onboarding, checkOn: "2026-10" }, { ...onboarding, id: "b", checkOn: "soon" }] };
    expect(duePredictions(p, new Date("2026-10-27T00:00:00Z")).map((x) => [x.id, x.daysOverdue])).toEqual([["b", null]]);
    expect(duePredictions(p, new Date("2026-11-01T00:00:00Z")).map((x) => x.id)).toEqual(["chart-import", "b"]);
    expect(duePredictions({ name: "y", predictions: "oops" as never })).toEqual([]);
  });
});

describe("counted or estimated", async () => {
  const { estimatedFacts } = await import("../src/lib/profile.js");
  const { matchSmallBets, readStage } = await import("../src/lib/smallBets.js");

  it("a missing basis means estimated", () => {
    expect(
      estimatedFacts({
        name: "x",
        traction: { activeUsers: 90, asOf: "2026-10" },
        metrics: { mrr: { value: 100, asOf: "2026-10", basis: "counted" }, churn: { value: 0.05, basis: "estimated" }, ctr: { value: 0.02 } },
      })
    ).toEqual(["traction (activeUsers) (no basis saved)", "metrics.churn", "metrics.ctr (no basis saved)"]);
    expect(estimatedFacts({ name: "x", traction: { activeUsers: 90, basis: "counted" } })).toEqual([]);
  });

  it("match_small_bets says when the stage rests on an estimate, and not when it was counted", () => {
    const guess = matchSmallBets({ traction: { activeUsers: 90, asOf: "2026-10" } });
    expect(guess.stage.basis).toBe("90 active users, 0 paying (as of 2026-10), estimated");
    expect(guess.assumptions.join(" ")).toMatch(/stage 1 rests on an estimate.*near 100 active users/);
    const counted = matchSmallBets({ traction: { activeUsers: 90, asOf: "2026-10", basis: "counted" } });
    expect(counted.stage.basis).toBe("90 active users, 0 paying (as of 2026-10)");
    expect(counted.assumptions.join(" ")).not.toMatch(/estimate/);
    expect(readStage({}).basis).toMatch(/no traction numbers/);
  });
});
