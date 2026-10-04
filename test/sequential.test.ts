import { describe, it, expect } from "vitest";
import { sequentialTest } from "../src/lib/sequential.js";
import { twoProportionTest } from "../src/lib/stats.js";

// Deterministic PRNG so the simulation is reproducible.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function simulate(pControl: number, pVariant: number, runs: number, perArm: number, lookEvery: number, seed: number) {
  const rnd = mulberry32(seed);
  let seqStops = 0;
  let naiveStops = 0;
  for (let r = 0; r < runs; r++) {
    let c = 0;
    let v = 0;
    let seqDone = false;
    let naiveDone = false;
    for (let n = 1; n <= perArm; n++) {
      if (rnd() < pControl) c++;
      if (rnd() < pVariant) v++;
      if (n % lookEvery === 0) {
        const a = { visitors: n, conversions: c };
        const b = { visitors: n, conversions: v };
        if (!seqDone && sequentialTest(a, b, 0.05, 0.01).decision !== "keep running") seqDone = true;
        if (!naiveDone && twoProportionTest(a, b).pValue < 0.05) naiveDone = true;
      }
    }
    if (seqDone) seqStops++;
    if (naiveDone) naiveStops++;
  }
  return { seq: seqStops / runs, naive: naiveStops / runs };
}

describe("sequentialTest", () => {
  it("controls false positives under repeated peeking (A/A, 50 looks)", () => {
    const r = simulate(0.1, 0.1, 400, 10000, 200, 42);
    expect(r.seq).toBeLessThanOrEqual(0.06);
    // The naive z-test checked 50 times is far above its nominal 5%.
    expect(r.naive).toBeGreaterThan(0.15);
  }, 60000);
  it("detects a real effect", () => {
    const r = simulate(0.1, 0.13, 100, 10000, 200, 7);
    expect(r.seq).toBeGreaterThan(0.8);
  }, 60000);
  it("reports decision, interval and notes", () => {
    const r = sequentialTest({ visitors: 20000, conversions: 2000 }, { visitors: 20000, conversions: 2300 }, 0.05, 0.01);
    expect(r.decision).toBe("stop: variant better");
    expect(r.diffCI[0]).toBeGreaterThan(0);
    expect(r.alwaysValidP).toBeLessThan(0.05);
    const flat = sequentialTest({ visitors: 1000, conversions: 100 }, { visitors: 1000, conversions: 101 });
    expect(flat.decision).toBe("keep running");
    expect(flat.notes.join(" ")).toMatch(/expectedEffect not given/);
  });
  it("validates input", () => {
    expect(() => sequentialTest({ visitors: 0, conversions: 0 }, { visitors: 10, conversions: 1 })).toThrow();
  });
});
