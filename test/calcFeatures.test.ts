// Calculator outputs that carry their inputs (citeAs, assumedInputs) and the new modes: inverse funnel,
// subscription paid media, minimum price, scenarios and lifetime deals in unit_economics, and clearer
// market_size bases (ranked plan item 7; go-to-market gaps 3, 5, 10, 19, 25, 28).
import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";
import { unitEconomics, paidMediaMath, analyzeFunnel, reverseFunnel } from "../src/lib/economics.js";
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

describe("citeAs and assumedInputs on every calculator", () => {
  const cases: Array<[string, Record<string, unknown>, RegExp]> = [
    ["ab_test_sample_size", { baselineRate: 0.03, mde: 0.2, dailyTrafficTotal: 100 }, /^ab_test_sample_size\(baseline 3%, MDE \+20% relative, alpha 0\.05, power 0\.8, 100 visitors\/day\) -> [\d,]+ per arm, [\d,]+ total, \d+ days$/],
    ["ab_test_evaluate", { control: { visitors: 10000, conversions: 300 }, variant: { visitors: 10000, conversions: 360 } }, /control 300\/10,000, variant 360\/10,000.* -> lift \+20%/],
    ["ab_test_sequential", { control: { visitors: 20000, conversions: 2000 }, variant: { visitors: 20000, conversions: 2300 }, expectedEffect: 0.01 }, /expectedEffect 0\.01\) -> diff \+1\.5pp, .*stop: variant better/],
    ["ab_test_means_sample_size", { baselineMean: 5, baselineSd: 20, mde: 0.05 }, /baseline mean 5, sd 20, MDE \+5% relative.* -> [\d,]+ per arm/],
    ["ab_test_means_evaluate", { control: { n: 1000, mean: 5, sd: 2 }, variant: { n: 1000, mean: 5.3, sd: 2 } }, /control n=1,000 mean=5, variant n=1,000 mean=5\.3.* -> diff \+0\.3 \(\+6%\)/],
    ["unit_economics", { arpaMonthly: 29, grossMargin: 0.8, monthlyChurn: 0.03, cac: 300 }, /ARPA 29\/month, gross margin 80%, churn 3%\/month, CAC 300.* -> bounded LTV [\d,.]+, LTV:CAC [\d.]+, payback \d+ months/],
    ["paid_media_math", { aov: 80, margin: 0.4, cvr: 0.025, cpc: 1.2 }, /aov 80, margin 40%, cvr 2\.5%, cpc 1\.2\) -> implied CPA 48 vs break-even 32/],
    ["funnel_analysis", { stages: [{ name: "visit", count: 1000 }, { name: "paid", count: 20 }] }, /visit 1,000 -> paid 20\) -> overall 2%/],
    ["liquidity_math", { listingsPerDay: 50, matchShares: [0.01], windowDays: 7 }, /50 listings\/day, match shares 1%, window 7 days\) -> \d+% of watches fire within 7 days/],
    ["market_size", { segments: [{ name: "agencies", accounts: 1000, annualValue: 1200, serviceableShare: 0.5, payingShare: 0.2, source: "census" }] }, /agencies: 1,000 accounts × 50% serviceable × 20% paying × 1,200\/year\) -> TAM 1,200,000, SAM 120,000/],
  ];
  for (const [tool, args, re] of cases) {
    it(`${tool} returns citeAs and marks assumed inputs`, async () => {
      const call = await connect();
      const r = await call(tool, args);
      expect(r.isError, r.text).toBe(false);
      expect(r.json.citeAs).toMatch(re);
      const a = await call(tool, { ...args, assumedInputs: ["baseline", "traffic"] });
      expect(a.json.citeAs).toBe(`ASSUMED ${r.json.citeAs}`);
      const msgs = [...(a.json.warnings ?? []), ...(a.json.notes ?? [])].join(" ");
      expect(msgs).toMatch(/rest on assumed inputs \(baseline, traffic\)/);
    });
  }
});

describe("market_size bases, sources and ignored inputs", () => {
  it("names penetration after its base and keeps the old fields", () => {
    const r = marketSize({ segments: [{ name: "x", accounts: 5000, annualValue: 100, serviceableShare: 0.5, payingShare: 0.1, source: "census" }], revenueTarget: 10000 });
    expect(r.serviceableAccounts).toBeCloseTo(250);
    expect(r.payingAccounts).toBeCloseTo(250);
    expect(r.reachableAccounts).toBeCloseTo(2500);
    expect(r.payingMarket).toBe(r.sam);
    expect(r.target!.customersNeeded).toBeCloseTo(100);
    expect(r.target!.penetrationOfSam).toBeCloseTo(0.4);
    expect(r.target!.penetrationOfPayingAccounts).toBeCloseTo(0.4);
    expect(r.target!.penetrationOfServiceable).toBeCloseTo(0.04);
    expect(r.notes.join(" ")).toMatch(/include payingShare/);
    expect(r.segments[0].inputsSummary).toBe("5,000 × 50% serviceable × 10% paying × 100 = 25,000");
  });
  it("treats an assumed source as unsourced and says the binding constraint rests on assumptions", () => {
    const r = marketSize({ segments: [{ name: "x", accounts: 5000, annualValue: 100, source: "ASSUMPTION" }, { name: "y", accounts: 300, annualValue: 50, source: "rough estimate" }], salesCapacity: { reps: 1, dealsPerRepPerYear: 10 }, annualChurn: 0.1 });
    const w = r.warnings.join(" ");
    expect(w).toMatch(/"x".*assum/);
    expect(w).toMatch(/"y"/);
    expect(r.obtainable.bindingConstraint).toBe("sales capacity");
    expect(r.obtainable.bindingConstraintBasis).toBe("assumed inputs");
    const ok = marketSize({ segments: [{ name: "x", accounts: 5000, annualValue: 100, source: "census 2024" }], salesCapacity: { reps: 1, dealsPerRepPerYear: 10 }, annualChurn: 0.1 });
    expect(ok.obtainable.bindingConstraintBasis).toBe("sourced account counts");
  });
  it("notes churn ignored at a 1-year horizon and inputs ignored without a capacity bound", () => {
    const one = marketSize({ segments: [{ name: "x", accounts: 5000, annualValue: 100, source: "s" }], horizonYears: 1, annualChurn: 0.5, acquisitionBudget: { annualBudget: 1000, cac: 10 } });
    expect(one.notes.join(" ")).toMatch(/1-year horizon/);
    const none = marketSize({ segments: [{ name: "x", accounts: 5000, annualValue: 100, source: "s" }], horizonYears: 3, annualChurn: 0.2 });
    expect(none.warnings.join(" ")).toMatch(/horizonYears and annualChurn are not used/);
    expect(none.notComputed.join(" ")).toMatch(/obtainable market/);
  });
  it("warns about a possible double count", () => {
    const r = marketSize({ segments: [{ name: "a", accounts: 4000, annualValue: 100, source: "s" }, { name: "b", accounts: 4000, annualValue: 300, source: "s" }] });
    expect(r.warnings.join(" ")).toMatch(/double count/);
  });
});

describe("paid_media_math", () => {
  it("returns the break-even CVR at the given CPC and names both thresholds", () => {
    const r = paidMediaMath({ aov: 80, margin: 0.4, cvr: 0.025, cpc: 1.2 });
    expect(r.requiredCvrAtCpc! * 80 * 0.4).toBeCloseTo(1.2);
    expect(r.verdict).toMatch(/^If CPC is 1\.20 and CVR is 2\.5%/);
    expect(r.verdict).toMatch(/CVR ≥ 3\.75%.*CPC ≤ 0\.80/);
    expect(r.billingModel).toBe("one-time");
  });
  it("subscription mode: first-period labels and payback months at the implied CPA", () => {
    const r = paidMediaMath({ aov: 20, margin: 0.8, cvr: 0.02, cpc: 1, monthlyChurn: 0.05 });
    expect(r.billingModel).toBe("subscription");
    expect(r.breakEvenCpaFirstPeriod).toBeCloseTo(16);
    expect(r.breakEvenRoasFirstPeriod).toBeCloseTo(1.25);
    // CPA 50, 16 a month of gross profit decaying 5% a month: 16+15.2+14.44+13.72 = 59.4 ≥ 50 at month 4.
    expect(r.paybackMonthsAtImpliedCpa).toBe(4);
    expect(r.warnings.join(" ")).toMatch(/one billing period/);
    expect(r.verdict).toMatch(/pays back in 4 months/);
  });
});

describe("unit_economics: minimum price, scenarios, lifetime deals", () => {
  it("minArpaForPayback pays back exactly at the target", () => {
    const r = unitEconomics({ arpaMonthly: 20, grossMargin: 0.8, monthlyChurn: 0.03, cac: 400, targetPaybackMonths: 6 });
    const check = unitEconomics({ arpaMonthly: r.minArpaForPayback!, grossMargin: 0.8, monthlyChurn: 0.03, cac: 400, targetPaybackMonths: 6 });
    expect(check.paybackMonthsChurnAdjusted).toBe(6);
    expect(check.affordableCac.maxCacForPayback).toBeCloseTo(400);
    const l = unitEconomics({ arpaMonthly: r.minArpaForLtvToCac3!, grossMargin: 0.8, monthlyChurn: 0.03, cac: 400 });
    expect(l.ltvToCacBounded).toBeCloseTo(3);
    expect(r.affordableCac.cacBasis).toBe("ltvBounded");
    expect(r.affordableCac.ltvUsedForCac).toBeCloseTo(r.ltvBounded);
  });
  it("scenarios inherit the base and list what differs", () => {
    const r = unitEconomics({ arpaMonthly: 16, grossMargin: 0.8, monthlyChurn: 0.04, cac: 200, scenarios: [{ name: "team plan", arpaMonthly: 100, monthlyChurn: 0.02 }] });
    const s = r.scenarios![0];
    expect(s.name).toBe("team plan");
    expect(s.assumptionDiff).toEqual(["arpaMonthly: 16 -> 100", "monthlyChurn: 0.04 -> 0.02"]);
    expect(s.ltvBounded).toBeCloseTo(unitEconomics({ arpaMonthly: 100, grossMargin: 0.8, monthlyChurn: 0.02, cac: 200 }).ltvBounded);
    expect(s.minArpaForPayback).not.toBeNull();
  });
  it("lifetime deal: net value, break-even churn, the month cost passes the price and exposure at the cap", () => {
    const r = unitEconomics({ arpaMonthly: 20, grossMargin: 0.8, monthlyChurn: 0.02, oneTimePrice: 200, monthlyCostToServe: 4, unitsCap: 500, horizonMonths: 60 });
    const d = r.lifetimeDeal!;
    const cost = (4 * (1 - Math.pow(0.98, 60))) / 0.02;
    expect(d.expectedServingCostPerUnit).toBeCloseTo(cost);
    expect(d.netValuePerUnit).toBeCloseTo(200 - cost);
    expect(d.ratioToSubscriberLtv).toBeCloseTo((200 - cost) / r.ltvBounded);
    expect(d.monthServingCostExceedsPrice).toBe(51);
    // At the break-even churn the serving cost over the horizon equals the price.
    const c = d.breakEvenMonthlyChurn!;
    expect((4 * (1 - Math.pow(1 - c, 60))) / c).toBeCloseTo(200, 3);
    expect(d.exposureAtCap!.servingCost).toBeCloseTo(500 * cost);
    expect(d.exposureAtCap!.worstCaseServingCost).toBe(500 * 4 * 60);
    expect(r.warnings.join(" ")).toMatch(/less than the .* bounded LTV of a subscriber/);
  });
});

describe("funnel_analysis inverse mode and fractional counts", () => {
  it("works back from a target, rounding up at each stage", () => {
    const r = reverseFunnel([0.2, 0.25, 0.5], 5, ["contacts", "replies", "calls", "partners"]);
    expect(r.stages.map((s) => s.countNeeded)).toEqual([200, 40, 10, 5]);
    expect(r.topOfFunnelNeeded).toBe(200);
    const odd = reverseFunnel([0.3], 2);
    expect(odd.stages.map((s) => s.countNeeded)).toEqual([7, 2]);
  });
  it("is reachable through the tool and refuses mixed modes", async () => {
    const call = await connect();
    const r = await call("funnel_analysis", { stepRates: [0.1, 0.5], targetOutput: 10 });
    expect(r.json.topOfFunnelNeeded).toBe(200);
    expect(r.json.citeAs).toMatch(/step rates 10%, 50%, target 10\) -> need 200 at the top/);
    const bad = await call("funnel_analysis", { stepRates: [0.1], targetOutput: 10, stages: [{ name: "a", count: 1 }, { name: "b", count: 1 }] });
    expect(bad.isError).toBe(true);
  });
  it("warns on non-integer counts", () => {
    const r = analyzeFunnel([{ name: "contacts", count: 1000 }, { name: "trials", count: 62.5 }]);
    expect(r.notes.join(" ")).toMatch(/whole numbers.*"trials" is 62\.5/);
  });
});
