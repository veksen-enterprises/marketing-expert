import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { matchSmallBets, readStage, betScore, marketLawPointers, type SmallBetsFacts } from "../src/lib/smallBets.js";
import { BETS } from "../src/lib/smallBetsCatalog.js";

const ids = (vs: Array<{ id: string }>) => vs.map((v) => v.id);
const find = (vs: Array<{ id: string; reason: string }>, id: string) => vs.find((v) => v.id === id);

describe("catalog", () => {
  it("has unique ids, and every section exists in the playbook", () => {
    expect(new Set(BETS.map((b) => b.id)).size).toBe(BETS.length);
    const book = readFileSync("knowledge/small-bets.md", "utf8");
    for (const s of new Set(BETS.map((b) => b.section))) expect(book, s).toContain(`## ${s}`);
  });
  it("weights every bet: effort, ceiling, and tries only for lopsided bets", () => {
    for (const b of BETS) {
      expect(b.effortHours, b.id).toBeGreaterThan(0);
      expect(["capped", "steady", "lopsided"], b.id).toContain(b.ceiling);
      if (b.tries) expect(b.ceiling === "lopsided" || b.budgetSkipsStage !== undefined || b.needs?.budget, b.id).toBeTruthy();
    }
  });
  it("names every bet in the playbook", () => {
    const book = readFileSync("knowledge/small-bets.md", "utf8");
    for (const b of BETS) expect(book, b.name).toContain(b.name);
  });
});

describe("readStage", () => {
  it("treats a profile without numbers as stage 0 and says so", () => {
    expect(readStage({})).toMatchObject({ stage: 0 });
    expect(readStage({}).basis).toMatch(/no traction numbers/);
  });
  it("reads stages 1 to 3", () => {
    expect(readStage({ traction: { activeUsers: 12 } }).stage).toBe(1);
    expect(readStage({ traction: { activeUsers: 0, payingCustomers: 1 } }).stage).toBe(1);
    expect(readStage({ traction: { activeUsers: 40, monthlyVisits: 2500 } }).stage).toBe(2);
    expect(readStage({ traction: { activeUsers: 5 }, assets: { newsworthy: "parsed 1M posts" } }).stage).toBe(3);
  });
});

describe("matchSmallBets", () => {
  it("with an empty profile: lists stage-0 bets, defers the rest, and names its guesses", () => {
    const r = matchSmallBets({});
    expect(ids(r.fitsNow)).toContain("listings");
    expect(ids(r.fitsNow)).toContain("comparison-pages");
    expect(find(r.fitsLater, "founder-emails")!.reason).toMatch(/first users/);
    expect(find(r.fitsLater, "press")!.reason).toMatch(/newsworthy|story/);
    expect(r.doesntFit).toEqual([]);
    expect(r.assumptions.join(" ")).toMatch(/No traction numbers/);
    expect(r.howToReport).toMatch(/only fitsNow/);
  });

  // A free hobby site that collects public posts from a chat platform, with no users yet.
  const hobby: SmallBetsFacts = {
    traction: { activeUsers: 0, asOf: "2026-10" },
    assets: { data: "items parsed from public trade channels", expertise: "the game's item rules", communities: "trade servers on a chat platform" },
    audiences: ["hobbyists"],
    surfaces: ["website", "bot"],
    revenue: "none",
    avoid: ["publishing-user-content", "moving-users-off-platform", "pricing"],
  };
  it("lets collected data stand in for users", () => {
    const r = matchSmallBets(hobby);
    const pages = r.fitsNow.find((v) => v.id === "data-pages")!;
    expect(pages.reason).toMatch(/your data .* stands in for users/);
    expect(ids(r.fitsNow)).toContain("moderator-tool");
    expect(ids(r.fitsNow)).toContain("weekly-digest");
  });
  it("rules out bets for other audiences, surfaces and revenue models, with the reason", () => {
    const r = matchSmallBets(hobby);
    expect(find(r.doesntFit, "one-command-try")!.reason).toMatch(/suits developers/);
    expect(find(r.doesntFit, "error-pages")!.reason).toMatch(/suits developers or businesses/);
    expect(find(r.doesntFit, "affiliate")!.reason).toMatch(/no revenue model/);
    expect(ids(r.fitsNow)).not.toContain("hiring-post");
  });
  it("uses launch status: a waitlist only before launch, launch posts only after", () => {
    const before = matchSmallBets({ ...hobby, launched: false });
    expect(ids(before.fitsNow)).toContain("waitlist-referral");
    expect(find(before.fitsLater, "launch-sites")!.reason).toMatch(/try now/);
    const live = matchSmallBets({ ...hobby, launched: true });
    expect(find(live.doesntFit, "waitlist-referral")!.reason).toMatch(/already live/);
    expect(ids(live.fitsNow)).toContain("launch-sites");
    expect(matchSmallBets(hobby).assumptions.join(" ")).toMatch(/Launch status not saved/);
    // Users mean it is live.
    expect(ids(matchSmallBets({ ...hobby, traction: { activeUsers: 3 } }).doesntFit)).toContain("waitlist-referral");
  });
  it("rules out bets that involve something the business avoids", () => {
    const r = matchSmallBets({ ...hobby, avoid: ["cold-outreach"] });
    expect(find(r.doesntFit, "cold-one-to-one")!.reason).toMatch(/cold-outreach/);
  });
  it("defers bets that need accounts until the business can reach each user", () => {
    const r = matchSmallBets({ ...hobby, traction: { activeUsers: 15 } });
    expect(find(r.fitsLater, "founder-emails")!.reason).toMatch(/reach each user/);
    const withAccounts = matchSmallBets({ ...hobby, traction: { activeUsers: 15 }, assets: { ...hobby.assets, accounts: true } });
    expect(ids(withAccounts.fitsNow)).toContain("founder-emails");
  });

  // An early developer tool with a paid plan and a little traction.
  const devtool: SmallBetsFacts = {
    traction: { activeUsers: 150, monthlyVisits: 3000, payingCustomers: 4, asOf: "2026-09" },
    assets: { expertise: "database performance", accounts: true },
    audiences: ["developers", "businesses"],
    surfaces: ["cli", "api", "web-app"],
    revenue: "live",
    avoid: [],
    markets: ["Quebec"],
  };
  it("opens stage-2 bets once traction is there, and keeps press for later", () => {
    const r = matchSmallBets(devtool);
    expect(r.stage.stage).toBe(2);
    for (const id of ["shareable-outputs", "one-command-try", "error-pages", "affiliate", "own-community"]) expect(ids(r.fitsNow), id).toContain(id);
    expect(ids(r.fitsLater)).toContain("press");
    expect(r.assumptions).toEqual([]);
  });
  it("lets a budget buy an early start, and says what that risks", () => {
    const early = { ...devtool, traction: { activeUsers: 0 }, assets: { ...devtool.assets, monthlyBudget: 500 } };
    const r = matchSmallBets(early);
    const s = r.fitsNow.find((v) => v.id === "newsletter-sponsorship")!;
    expect(s.reason).toMatch(/budget buys the reach.*keeps people/);
    expect(ids(matchSmallBets({ ...early, assets: { ...early.assets, monthlyBudget: 0 } }).fitsLater)).toContain("newsletter-sponsorship");
  });
  it("offers the moderator tool only where the audience gathers in moderated communities", () => {
    expect(find(matchSmallBets(devtool).fitsLater, "moderator-tool")!.reason).toMatch(/communities/);
    expect(ids(matchSmallBets({ ...devtool, assets: { ...devtool.assets, communities: "two subreddits and a Discord server" } }).fitsNow)).toContain("moderator-tool");
  });
  it("lets a seasonal business plan its season from day one", () => {
    const early = { ...hobby, traction: { activeUsers: 0 } };
    expect(ids(matchSmallBets(early).fitsLater)).toContain("calendar-events");
    expect(ids(matchSmallBets({ ...early, assets: { ...early.assets, season: "demand peaks in the six weeks before a holiday" } }).fitsNow)).toContain("calendar-events");
  });
  it("keeps open-sourcing code to developer audiences", () => {
    expect(find(matchSmallBets(hobby).doesntFit, "open-source")!.reason).toMatch(/developers/);
  });
  it("returns the business's principles, written in plain words, for checking each fitting bet", () => {
    const r = matchSmallBets({ ...hobby, principles: ["never ask traders to leave the chat platform", "no price data"] });
    expect(r.checkAgainst).toEqual(["never ask traders to leave the chat platform", "no price data"]);
    expect(r.howToReport).toMatch(/checkAgainst/);
    expect(matchSmallBets(hobby).checkAgainst).toEqual([]);
  });
  it("judges a bet's ceiling by the audience: short videos are lopsided for consumers, capped for B2B buyers", () => {
    const videos = (audiences: SmallBetsFacts["audiences"]) => matchSmallBets({ ...devtool, audiences, avoid: [] }).fitsNow.find((v) => v.id === "founder-videos")!;
    expect(videos(["developers", "businesses"]).ceiling).toBe("capped");
    expect(videos(["consumers"]).ceiling).toBe("lopsided");
    // A mixed audience takes the best ceiling any of its audiences gets.
    expect(videos(["consumers", "businesses"]).ceiling).toBe("lopsided");
    expect(videos(["developers", "businesses"]).score!).toBeLessThan(videos(["consumers"]).score!);
  });
  it("offers Pinterest only when users make or see something worth pinning", () => {
    expect(find(matchSmallBets(hobby).fitsLater, "pinterest-pins")!.reason).toMatch(/image/);
    expect(ids(matchSmallBets({ ...hobby, assets: { ...hobby.assets, visual: "painted figurines" } }).fitsNow)).toContain("pinterest-pins");
  });
  it("gives a two-sided local business merchant bets, and keeps them from other businesses", () => {
    const local: SmallBetsFacts = { traction: { activeUsers: 0 }, audiences: ["consumers", "local"], surfaces: ["mobile-app"], revenue: "planned", launched: false, avoid: [] };
    expect(ids(matchSmallBets(local).fitsNow)).toContain("merchant-visits");
    expect(find(matchSmallBets(local).fitsLater, "in-store-signs")).toBeTruthy();
    expect(ids(matchSmallBets(devtool).doesntFit)).toContain("merchant-visits");
  });
  it("points each market, written as a place or a city, at its marketing-law section", () => {
    const p = (m: string) => marketLawPointers([m])[0].pointer;
    expect(p("Quebec")).toBe("playbook:marketing-law-by-market#Quebec");
    expect(p("Montreal")).toBe("playbook:marketing-law-by-market#Quebec");
    expect(p("Toronto")).toBe("playbook:marketing-law-by-market#Canada (federal) and Ontario");
    expect(p("San Francisco")).toBe("playbook:marketing-law-by-market#United States and California");
    expect(p("Istanbul")).toBe("playbook:marketing-law-by-market#Turkey");
    expect(p("Türkiye")).toBe("playbook:marketing-law-by-market#Turkey");
    expect(p("Yerevan")).toBe("playbook:marketing-law-by-market#Armenia");
    expect(p("Buenos Aires")).toBe("playbook:marketing-law-by-market#Argentina");
    expect(p("Japan")).toBeNull();
  });
  it("tells the advisor which market rules to check for a bet that sends messages", () => {
    const r = matchSmallBets({ ...devtool, markets: ["Quebec", "Istanbul"] });
    const emails = r.fitsNow.find((v) => v.id === "founder-emails")!;
    expect(emails.lawCheck).toMatch(/consent rules.*#Quebec.*#Turkey/);
    expect(r.fitsNow.find((v) => v.id === "comparison-pages")!.lawCheck).toBeUndefined();
  });
  it("ranks by score, highest first", () => {
    const scores = matchSmallBets(devtool).fitsNow.map((v) => v.score!);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });
  it("scores a cheap lopsided bet above an equally cheap capped one, and discounts effort by its square root", () => {
    expect(betScore({ ceiling: "lopsided", evidence: "anecdote", effortHours: 4 })).toBeGreaterThan(betScore({ ceiling: "capped", evidence: "anecdote", effortHours: 4 }));
    // Four times the effort halves the score.
    expect(betScore({ ceiling: "steady", evidence: "some", effortHours: 16 })).toBeCloseTo(betScore({ ceiling: "steady", evidence: "some", effortHours: 4 }) / 2, 2);
    // Weak evidence discounts, but doesn't outweigh a higher ceiling.
    expect(betScore({ ceiling: "lopsided", evidence: "anecdote", effortHours: 10 })).toBeGreaterThan(betScore({ ceiling: "steady", evidence: "some", effortHours: 10 }));
  });
  it("tells the advisor to judge a lopsided bet on the best of its tries", () => {
    const r = matchSmallBets({ ...devtool, audiences: ["consumers"] });
    expect(r.fitsNow.find((v) => v.id === "founder-videos")).toMatchObject({ ceiling: "lopsided", tries: 20 });
    expect(r.howToReport).toMatch(/best one/);
  });
});
