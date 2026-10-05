// Regression tests for calculator bugs from the code review (calc:correctness, calc:robustness and the
// related server findings). Each test failed before its fix.
import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";
import { twoProportionTest, sampleRatioMismatch, sampleSizeTwoProportions, erfc } from "../src/lib/stats.js";
import { welchTest, tCrit, sampleSizeMeans } from "../src/lib/means.js";
import { sequentialTest } from "../src/lib/sequential.js";
import { unitEconomics, analyzeFunnel } from "../src/lib/economics.js";
import { marketSize } from "../src/lib/marketSize.js";

const connect = async () => {
  const [a, b] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "t", version: "0" });
  await Promise.all([createServer().connect(a), client.connect(b)]);
  return async (name: string, args: Record<string, unknown>) => {
    const r = await client.callTool({ name, arguments: args });
    const text = (r.content as Array<{ text: string }>)[0].text;
    return { isError: !!r.isError, text, json: r.isError ? null : JSON.parse(text) };
  };
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("means: heavy tail and capping on low-conversion revenue (calc:correctness#0)", () => {
  const mk = (n: number, buyers: number) => Array.from({ length: n }, (_, i) => (i < buyers ? 50 : 0));
  it("no heavy-tail warning when every order is the same", () => {
    const r = welchTest({ values: mk(3000, 90) }, { values: mk(3000, 105) });
    expect(r.warnings.join(" ")).not.toMatch(/Heavy tail/);
  });
  it("capPercentile 0.99 caps among orders, not at zero", () => {
    const r = welchTest({ values: mk(3000, 20) }, { values: mk(3000, 25) }, 0.05, 0.99);
    expect(r.cappedAt).toBe(50);
    expect(r.absoluteDiff).toBeGreaterThan(0);
  });
});

describe("sequential test at small samples (calc:correctness#1, calc:robustness#4)", () => {
  it("does not stop after 3 visitors per arm", () => {
    const r = sequentialTest({ visitors: 3, conversions: 3 }, { visitors: 3, conversions: 0 }, 0.05, 0.2);
    expect(r.decision).toBe("keep running");
    expect(r.diffCI[0]).toBeGreaterThanOrEqual(-1);
    expect(r.diffCI[1]).toBeLessThanOrEqual(1);
  });
  it("A/A checked after every visitor stays near alpha", () => {
    const rnd = mulberry32(99);
    let stops = 0;
    const R = 600;
    for (let q = 0; q < R; q++) {
      let c = 0;
      let v = 0;
      for (let n = 1; n <= 300; n++) {
        if (rnd() < 0.5) c++;
        if (rnd() < 0.5) v++;
        if (sequentialTest({ visitors: n, conversions: c }, { visitors: n, conversions: v }, 0.05, 0.2).decision !== "keep running") {
          stops++;
          break;
        }
      }
    }
    expect(stops / R).toBeLessThanOrEqual(0.05);
  }, 60000);
  it("rejects an expectedEffect that cannot be a difference in rates", () => {
    expect(() => sequentialTest({ visitors: 10000, conversions: 1000 }, { visitors: 10000, conversions: 2000 }, 0.05, 1e155)).toThrow(/expectedEffect/);
  });
});

describe("ab_test_evaluate direction of the planning warning (calc:correctness#2, server:correctness#5)", () => {
  it("a significant loser is not called a winner", async () => {
    const call = await connect();
    const r = await call("ab_test_evaluate", { control: { visitors: 10000, conversions: 1000 }, variant: { visitors: 10000, conversions: 800 }, plannedSamplePerArm: 10000 });
    const w = r.json.warnings.join(" ");
    expect(w).not.toMatch(/Significant winners|low end/);
    expect(w).toMatch(/worse/);
  });
  it("a significant p with an interval that includes zero is called borderline", async () => {
    const call = await connect();
    const r = await call("ab_test_evaluate", { control: { visitors: 200, conversions: 3 }, variant: { visitors: 200, conversions: 10 }, plannedSamplePerArm: 200 });
    expect(r.json.significant).toBe(true);
    const w = r.json.warnings.join(" ");
    expect(w).not.toMatch(/Plan around the low end/);
    expect(w).toMatch(/[Bb]orderline/);
  });
  it("a clear winner still gets the low-end advice", async () => {
    const call = await connect();
    const r = await call("ab_test_evaluate", { control: { visitors: 10000, conversions: 800 }, variant: { visitors: 10000, conversions: 1000 }, plannedSamplePerArm: 10000 });
    expect(r.json.warnings.join(" ")).toMatch(/Plan around the low end/);
  });
});

describe("funnel gain per step (calc:correctness#3, calc:robustness#6)", () => {
  it("does not claim the same gain at a step that would pass 100%", () => {
    const r = analyzeFunnel([{ name: "cart", count: 1000 }, { name: "checkout", count: 960 }, { name: "paid", count: 100 }]);
    expect(r.notes.join(" ")).toMatch(/cart → checkout can add at most 4\.2/);
    const checkout = r.gainByStep.find((g) => g.step === "cart → checkout")!;
    expect(checkout.capped).toBe(true);
    expect(checkout.gain).toBeCloseTo(100 * (1 / 0.96 - 1), 6);
  });
  it("prints the improvement it used", () => {
    const r = analyzeFunnel([{ name: "a", count: 1000 }, { name: "b", count: 100 }], undefined, 0.025);
    expect(r.notes.join(" ")).toMatch(/2\.5%/);
  });
  it("names no largest drop when no step loses anyone", () => {
    const r = analyzeFunnel([{ name: "visit", count: 500 }, { name: "signup", count: 500 }, { name: "paid", count: 600 }]);
    expect(r.largestAbsoluteDrop).toBeNull();
  });
});

describe("two-proportion test edge cases (calc:correctness#4, #7)", () => {
  it("diffCI is not zero-width when both arms are 0% or 100%", () => {
    for (const [n, c] of [[60, 0], [40, 40]]) {
      const r = twoProportionTest({ visitors: n, conversions: c }, { visitors: n, conversions: c });
      expect(r.diffCI[1] - r.diffCI[0]).toBeGreaterThan(0.01);
      if (r.relativeLiftCI) expect(r.relativeLiftCI[1] - r.relativeLiftCI[0]).toBeGreaterThan(0);
    }
  });
  it("p-value does not underflow to 0 for large tests", () => {
    const r = twoProportionTest({ visitors: 1000000, conversions: 100000 }, { visitors: 1000000, conversions: 104000 });
    expect(r.pValue).toBeGreaterThan(0);
    expect(r.pValue / erfc(Math.abs(r.zScore) / Math.SQRT2)).toBeCloseTo(1, 6);
  });
});

describe("unit economics payback at exact boundaries (calc:correctness#5)", () => {
  it("churn-adjusted payback equals simple payback when net decay is 0", () => {
    const u = unitEconomics({ arpaMonthly: 29, grossMargin: 0.65, monthlyChurn: 0.02, monthlyExpansion: 0.02, cac: 169.65 });
    expect(u.paybackMonthsSimple).toBeCloseTo(9, 9);
    expect(u.paybackMonthsChurnAdjusted).toBe(9);
  });
});

describe("ab_test_sample_size peeking note (calc:correctness#6, server:correctness#11)", () => {
  it("gives the Armitage figure for 10 looks", async () => {
    const call = await connect();
    const r = await call("ab_test_sample_size", { baselineRate: 0.03, mde: 0.2 });
    const n = r.json.notes.join(" ");
    expect(n).not.toMatch(/26%/);
    expect(n).toMatch(/10 looks ≈ 19%/);
  });
});

describe("t critical value beyond 1000 (calc:correctness#8, calc:robustness#0)", () => {
  it("tCrit matches the closed form at df=1", () => {
    expect(tCrit(0.0001, 1)).toBeCloseTo(1 / Math.tan((Math.PI * 0.0001) / 2), 1);
  });
  it("Welch CI agrees with the p-value at df≈1 and small alpha", () => {
    const r = welchTest({ n: 2, mean: 0, sd: 100 }, { n: 1000000, mean: 141421, sd: 1 }, 0.0001);
    expect(r.significant).toBe(false);
    expect(r.diffCI[0]).toBeLessThan(0);
  });
});

describe("market_size with no serviceable accounts (calc:correctness#9, calc:robustness#1)", () => {
  it("does not report Infinity customers", () => {
    const r = marketSize({ segments: [{ name: "x", accounts: 1000, annualValue: 100, serviceableShare: 0, source: "s" }], revenueTarget: 50000 });
    expect(r.warnings.join(" ")).not.toMatch(/Infinity/);
    expect(r.warnings.join(" ")).toMatch(/no serviceable|No serviceable/);
    expect(r.target!.customersNeeded).toBeNull();
  });
});

describe("means: relative lift and empty arrays (calc:robustness#2, #3)", () => {
  it("relativeLift is not negative when the variant is higher than a negative control", () => {
    const r = welchTest({ n: 1000, mean: -2, sd: 1 }, { n: 1000, mean: -1, sd: 1 });
    expect(r.relativeLift === null || r.relativeLift > 0).toBe(true);
    expect(r.warnings.join(" ")).not.toMatch(/Lift above 30%/);
  });
  it("no 30% lift warning when the control mean is 0", () => {
    const r = welchTest({ n: 1000, mean: 0, sd: 1 }, { n: 1000, mean: 1, sd: 1 });
    expect(r.warnings.join(" ")).not.toMatch(/Lift above 30%/);
  });
  it("an empty values array falls back to the summary stats", () => {
    const r = welchTest({ values: [], n: 1000, mean: 5, sd: 2 }, { values: [], n: 1000, mean: 5.3, sd: 2 });
    expect(r.absoluteDiff).toBeCloseTo(0.3);
  });
});

describe("SRM with huge weights (calc:robustness#5)", () => {
  it("still flags a 9000/1000 split meant as 50/50", () => {
    const r = sampleRatioMismatch([9000, 1000], [1e308, 1e308]);
    expect(r.mismatch).toBe(true);
    expect(r.expectedShares).toEqual([0.5, 0.5]);
  });
});

describe("tiny MDE (server:robustness#11)", () => {
  it("throws instead of returning Infinity", () => {
    expect(() => sampleSizeTwoProportions({ baselineRate: 0.03, mde: 1e-17 })).toThrow(/mde/);
    expect(() => sampleSizeMeans({ baselineMean: 5, baselineSd: 2, mde: 1e-200 })).toThrow(/mde/);
  });
});
