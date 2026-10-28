import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { matchSmallBets, readStage, betScore, marketLawPointers, CHANNEL_KINDS, CHANNEL_BOOST, factsFromProfile, type SmallBetsFacts } from "../src/lib/smallBets.js";
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
  it("points every channel kind at bets that exist", () => {
    const known = new Set(BETS.map((b) => b.id));
    for (const k of CHANNEL_KINDS) for (const id of k.bets) expect(known.has(id), `${k.kind}: ${id}`).toBe(true);
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
    expect(ids(r.fitsNow)).toContain("moment-products");
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
    traction: { activeUsers: 150, monthlyVisits: 3000, payingCustomers: 4, asOf: "2026-09", basis: "counted" },
    assets: { expertise: "database performance", accounts: true },
    audiences: ["developers", "businesses"],
    surfaces: ["cli", "api", "web-app"],
    revenue: "live",
    avoid: [],
    markets: ["Quebec"],
  };
  it("opens stage-2 bets once traction is there, and keeps press for later", () => {
    const r = matchSmallBets({ ...devtool, channels: [{ name: "Google search", how: "search referrers in analytics" }] });
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
  it("ranks a bet higher when it builds on a channel already bringing users, and says which", () => {
    const plain = matchSmallBets(devtool).fitsNow;
    const r = matchSmallBets({ ...devtool, channels: [{ name: "a Reddit thread", how: "two users said so" }, "a podcast nobody's heard of"] });
    const before = plain.find((v) => v.id === "answer-questions")!;
    const after = r.fitsNow.find((v) => v.id === "answer-questions")!;
    expect(after.score).toBeCloseTo(before.score! * CHANNEL_BOOST, 2);
    expect(after.workingChannel).toBe("a Reddit thread");
    expect(after.reason).toMatch(/builds on a Reddit thread, which already brings users \(two users said so\)/);
    expect(r.fitsNow.findIndex((v) => v.id === "answer-questions")).toBeLessThan(plain.findIndex((v) => v.id === "answer-questions"));
    expect(r.fitsNow.find((v) => v.id === "comparison-pages")!.workingChannel).toBeUndefined();
    expect(r.assumptions.join(" ")).not.toMatch(/Channels not saved/);
  });
  it("ranks up only channels the founder can say how they know about", () => {
    // research/channel-answer-accuracy.md: a recalled source favours channels the founder posted in, so a guess doesn't boost.
    const guess = matchSmallBets({ ...devtool, channels: ["Reddit"] });
    const backed = matchSmallBets({ ...devtool, channels: [{ name: "Reddit", how: "a referrer in analytics" }] });
    const reddit = new Set(CHANNEL_KINDS.find((k) => k.kind === "communities")!.bets);
    const plain = matchSmallBets(devtool).fitsNow;
    for (const v of guess.fitsNow) {
      expect(v.score, v.id).toBe(plain.find((x) => x.id === v.id)!.score);
      expect(v.workingChannel, v.id).toBeUndefined();
      const b = backed.fitsNow.find((x) => x.id === v.id)!;
      if (reddit.has(v.id)) expect(b.score).toBeCloseTo(v.score! * CHANNEL_BOOST, 2);
      else expect(b.score, v.id).toBe(v.score);
    }
    expect(guess.assumptions.join(" ")).toMatch(/Not ranked up for Reddit: no saved reason.*which recent users came from it and how/);
    expect(backed.assumptions.join(" ")).not.toMatch(/Not ranked up/);
    // An empty reason is no reason.
    expect(matchSmallBets({ ...devtool, channels: [{ name: "Reddit", how: "  " }] }).assumptions.join(" ")).toMatch(/Not ranked up for Reddit/);
  });
  it("doesn't rank a repeat launch above a new site, and states the sites' relaunch rules", () => {
    // research/proven-channel-returns.md §3 and research/relaunch-rules.md §1–2: a repeat post on the same site is the
    // resubmission case, and Product Hunt and Show HN both ask for real news before a second launch.
    const live = { ...devtool, traction: { activeUsers: 12, basis: "counted" as const } };
    const plain = matchSmallBets(live).fitsNow.find((v) => v.id === "launch-sites")!;
    for (const channels of [[{ name: "Product Hunt", how: "referrer in analytics" }], ["Show HN"]]) {
      const r = matchSmallBets({ ...live, channels });
      const v = r.fitsNow.find((x) => x.id === "launch-sites")!;
      expect(v.score).toBe(plain.score);
      expect(v.workingChannel).toBeUndefined();
      expect(v.reason).toMatch(/already launched on (Product Hunt|Show HN)/);
      expect(v.reason).toMatch(/Product Hunt asks for two months and a significant update/);
      expect(v.reason).toMatch(/Show HN asks for a much changed version/);
      expect(v.reason).toMatch(/site you haven't used/);
      // Not boosting it isn't a missing reason: no "how" is asked for.
      expect(r.assumptions.join(" ")).not.toMatch(/Not ranked up for (Product Hunt|Show HN)/);
    }
    expect(plain.reason).not.toMatch(/already launched/);
  });
  it("runs a launch on two different sites before judging it, with a stop for no reaction", () => {
    // research/small-bet-base-rates.md §1: about 1 in 8 Show HN posts reaches 10 points and over half get no comment.
    const v = matchSmallBets({ ...devtool, traction: { activeUsers: 12 } }).fitsNow.find((x) => x.id === "launch-sites")!;
    expect(v).toMatchObject({ tries: 2, ceiling: "lopsided" });
    expect(v.effortHours).toBeGreaterThanOrEqual(24);
    expect(v.stop).toMatch(/No reaction on two different sites/);
    expect(v.stop).toMatch(/same version to the same site/);
    expect(v.stop).toMatch(/spike with no retained users/);
  });
  it("gives search-page bets a stop for the likely case, almost no clicks, that a founder can check", () => {
    // research/query-page-outcomes.md §1: a page on a new, unlinked site typically gets about zero clicks in 3 months,
    // and a founder can't check a query's volume (keyword tools show under 10 searches for most queries).
    const r = matchSmallBets({ audiences: ["developers"], traction: { activeUsers: 0 } });
    const cmp = r.fitsNow.find((v) => v.id === "comparison-pages")!;
    expect(cmp.stop).toMatch(/under about 10 search clicks across the first three pages/i);
    expect(cmp.stop).not.toMatch(/no volume/);
    const errBet = BETS.find((b) => b.id === "error-pages")!;
    expect(errBet.stop).toMatch(/under about 10 search clicks across the first eight pages/i);
    for (const b of [BETS.find((x) => x.id === "comparison-pages")!, errBet]) expect(b.measure, b.id).toMatch(/Pages tab/);
  });
  it("says when channels are missing or match no bet, instead of skipping them silently", () => {
    expect(matchSmallBets(devtool).assumptions.join(" ")).toMatch(/Channels not saved/);
    expect(matchSmallBets({ ...devtool, channels: ["carrier pigeon"] }).assumptions.join(" ")).toMatch(/matched no bet by keyword.*carrier pigeon/);
    expect(matchSmallBets({ ...devtool, channels: [null as never] }).assumptions.join(" ")).toMatch(/matched no bet by keyword.*null/);
  });
  it("reads channels from the saved profile", () => {
    expect(factsFromProfile({ name: "x", channels: ["Google"] }).channels).toEqual(["Google"]);
  });
  it("ranks by score, highest first, within each horizon", () => {
    for (const h of ["weeks", "months"]) {
      const scores = matchSmallBets(devtool).fitsNow.filter((v) => v.horizon === h).map((v) => v.score!);
      expect(scores.length, h).toBeGreaterThan(0);
      expect(scores).toEqual([...scores].sort((a, b) => b - a));
    }
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

describe("bets that read the business's category", () => {
  const dating: SmallBetsFacts = { category: "dating app", audiences: ["consumers", "local"], surfaces: ["mobile-app"], launched: false, revenue: "planned", avoid: [] };
  it("gives a dating app the one-place launch and the store rules on listings", () => {
    const r = matchSmallBets(dating);
    expect(find(r.fitsNow, "dense-pocket")?.reason).toMatch(/apps where people match with each other, read from the profile: dating app/);
    expect(find(r.fitsNow, "listings")?.reason).toMatch(/4\.3\(b\).*filtering, reporting and blocking/);
  });
  it("leaves both out for a business that isn't a matching app", () => {
    const r = matchSmallBets({ ...dating, category: "invoicing software for freelancers", audiences: ["businesses"], surfaces: ["web-app"] });
    expect(find(r.doesntFit, "dense-pocket")).toBeDefined();
    expect(find(r.fitsNow, "listings")?.reason).not.toMatch(/4\.3/);
    const consumer = matchSmallBets({ ...dating, category: "photo sharing app with friends" });
    expect(find(consumer.doesntFit, "dense-pocket")?.reason).toMatch(/only for apps where people match/);
  });
  it("waits for a category before offering a category-only bet", () => {
    const { category, ...noCategory } = dating;
    expect(find(matchSmallBets(noCategory).fitsLater, "dense-pocket")?.reason).toMatch(/save the profile's category/);
  });
  it("reads the category and product from a saved profile", () => {
    expect(factsFromProfile({ name: "x", category: "dating app", product: "a dating app for climbers" } as never)).toMatchObject({ category: "dating app", product: "a dating app for climbers" });
  });
});

// Round 5 (research/QUEUE.md #129–#149): one person selling their own expertise got the startup catalog.
describe("solo service profiles", () => {
  const dietitian: SmallBetsFacts = { category: "registered dietitian, online nutrition coaching", product: "online nutrition counselling, video sessions", audiences: ["consumers"], surfaces: ["service"], revenue: "planned", launched: true, traction: { payingCustomers: 0, asOf: "2026-10" }, assets: { expertise: "registered dietitian" }, markets: ["Quebec"] };
  const designer: SmallBetsFacts = { category: "freelance designer and marketer", product: "brand and web design for small businesses", audiences: ["businesses"], surfaces: ["service"], revenue: "planned", launched: true, traction: { payingCustomers: 0, asOf: "2026-10" }, assets: { expertise: "design" } };
  const saas: SmallBetsFacts = { category: "invoicing software", audiences: ["businesses"], surfaces: ["web-app"], revenue: "live", launched: true, traction: { activeUsers: 0 } };

  it("tells a service to say what it sells everywhere and to write to people who know the person", () => {
    for (const p of [dietitian, designer]) {
      expect(ids(matchSmallBets(p).fitsNow)).toContain("say-what-you-sell");
      expect(ids(matchSmallBets(p).fitsNow)).toContain("warm-network");
    }
    expect(ids(matchSmallBets(saas).fitsNow)).toContain("say-what-you-sell");
    expect(ids(matchSmallBets(saas).doesntFit)).toContain("warm-network");
  });
  it("keeps product launch bets away from a service, and ranks the network above them", () => {
    const r = matchSmallBets(dietitian);
    expect(ids(r.doesntFit)).toEqual(expect.arrayContaining(["launch-sites", "curator-submissions"]));
    expect(ids(r.fitsNow)).not.toContain("launch-sites");
    const now = ids(r.fitsNow);
    expect(now.indexOf("warm-network")).toBeLessThan(now.indexOf("comparison-pages"));
    expect(find(r.fitsNow, "listings")!.reason).toMatch(/professional directory|in-person contact/);
    expect(find(matchSmallBets(designer).fitsNow, "listings")!.reason).not.toMatch(/in-person contact/);
  });
  it("tells a business with no users to meet people and stay in touch, judged over months, not on sales", () => {
    for (const p of [dietitian, designer, saas]) expect(ids(matchSmallBets(p).fitsNow)).toContain("build-a-network");
    const v = matchSmallBets(dietitian).fitsNow.find((x) => x.id === "build-a-network")!;
    expect(v.stop).toMatch(/6 months/);
    expect(v.judgeAfter).toMatch(/months/);
  });
  // Round 6 (#160–#163): referrals came from repeat meetings in one group; at mixers people talk to who they know.
  it("tells a service to keep going back to the same group, over a year, and to meet people it doesn't know", () => {
    const v = find(matchSmallBets(designer).fitsNow, "build-a-network")!;
    expect(v.judgeAfter).toMatch(/12 months/);
    expect(v.what).toMatch(/same group/);
    expect(v.what).toMatch(/don't already know/);
    expect(v.stop).toMatch(/6 months/);
    expect(v.stop).toMatch(/12 months/);
    expect(find(matchSmallBets(designer).fitsNow, "warm-network")!.what).toMatch(/haven't spoken to in years/);
  });
  // Review of round 5 against the two real cases: these were planned in the round 5 result and not yet true.
  it("puts say-what-you-sell first for a service, ahead of higher-scoring bets", () => {
    for (const p of [dietitian, designer]) {
      const r = matchSmallBets(p);
      expect(r.fitsNow[0].id).toBe("say-what-you-sell");
      expect(r.fitsNow[0].reason).toMatch(/first/);
    }
    expect(matchSmallBets(saas).fitsNow[0]?.id).not.toBe("say-what-you-sell");
  });
  it("offers a freelance platform to a service selling to businesses, not to consumers or products", () => {
    const v = find(matchSmallBets({ ...designer, avoid: ["moving-users-off-platform"] }).fitsNow, "freelance-platform")!;
    expect(v).toBeDefined();
    expect(v.stop).toMatch(/two years/);
    expect(ids(matchSmallBets(dietitian).doesntFit)).toContain("freelance-platform");
    expect(ids(matchSmallBets(saas).doesntFit)).toContain("freelance-platform");
  });
  it("keeps product-only bets away from a service, and talks about clients, not users", () => {
    const r = matchSmallBets(designer);
    expect(ids(r.doesntFit)).toEqual(expect.arrayContaining(["error-pages", "hiring-post", "perk-programmes", "lifetime-deal"]));
    expect(r.stage.basis).toMatch(/no paying clients/);
    expect(r.fitsLater.map((v) => v.reason).join(" ")).not.toMatch(/no users yet|first users/);
    expect(ids(matchSmallBets(saas).doesntFit)).not.toContain("error-pages");
  });
  it("warns a regulated profession to check its code before joining a referral group", () => {
    expect(find(matchSmallBets(dietitian).fitsNow, "build-a-network")!.reason).toMatch(/referral group/);
    expect(find(matchSmallBets(designer).fitsNow, "build-a-network")!.reason).not.toMatch(/referral group/);
  });
  it("keeps the warm-network bet when the profile rules out cold outreach", () => {
    const r = matchSmallBets({ ...dietitian, avoid: ["cold-outreach"] });
    expect(ids(r.fitsNow)).toContain("warm-network");
    expect(ids(r.doesntFit)).toContain("cold-one-to-one");
    expect(find(r.fitsNow, "warm-network")!.reason).not.toMatch(/cold/);
  });
  it("warns a regulated profession about testimonials and results, on fitsLater bets too", () => {
    const r = matchSmallBets(dietitian);
    expect(find(r.fitsLater, "ask-happy-users")!.reason).toMatch(/regulator/);
    expect(find(r.fitsNow, "comparison-pages")!.reason).toMatch(/regulator/);
    expect(find(r.fitsNow, "founder-videos")!.reason).toMatch(/regulator/);
    const d = matchSmallBets(designer);
    expect(find(d.fitsLater, "ask-happy-users")!.reason).not.toMatch(/regulator/);
    expect(matchSmallBets({ ...dietitian, category: "nutricionista online", product: "" }).fitsLater.find((v) => v.id === "ask-happy-users")!.reason).toMatch(/regulator/);
  });
  it("lets paying clients reach stage 2 for a service, at a rule-of-thumb 20", () => {
    expect(readStage({ surfaces: ["service"], traction: { payingCustomers: 20 } }).stage).toBe(2);
    expect(readStage({ surfaces: ["web-app"], traction: { payingCustomers: 20 } }).stage).toBe(1);
    expect(readStage({ surfaces: ["service"], traction: { payingCustomers: 12 } }).stage).toBe(1);
    const r = matchSmallBets({ ...designer, traction: { payingCustomers: 30 } });
    expect(ids(r.fitsNow)).toContain("co-marketing");
    expect(r.assumptions.join(" ")).toMatch(/20 paying clients/);
  });
  it("points Brazil at its section, and a Quebec message bet at federal Canada too", () => {
    const p = (m: string) => marketLawPointers([m])[0].pointer;
    expect(p("Brazil")).toBe("playbook:marketing-law-by-market#Brazil");
    expect(p("Brasil")).toBe("playbook:marketing-law-by-market#Brazil");
    expect(p("São Paulo")).toBe("playbook:marketing-law-by-market#Brazil");
    const r = matchSmallBets(dietitian);
    expect(find(r.fitsNow, "warm-network")!.lawCheck).toMatch(/#Quebec.*#Canada/);
  });
});

// A saved profile with only a category, a business model and a few clients got 24 bets in fitsNow, led by newsletter
// submissions, shop signs and a hiring post; say-what-you-sell came 10th because the service was never read from the text.
describe("profiles with unsaved surfaces or audiences", () => {
  const nutri: SmallBetsFacts = { category: "nutritionist, solo professional service", businessModel: "paid sessions", traction: { payingCustomers: 3 } };
  const nutriService: SmallBetsFacts = { ...nutri, surfaces: ["service"] };
  const bet = (id: string) => BETS.find((b) => b.id === id)!;

  it("reads a service from the category, says so, and puts say-what-you-sell first", () => {
    const r = matchSmallBets(nutri);
    expect(r.fitsNow[0].id).toBe("say-what-you-sell");
    expect(r.assumptions.join(" ")).toMatch(/treated as a service .*from the category: "nutritionist, solo professional service"/);
    expect(r.stage.basis).not.toMatch(/active users/);
    expect(find(r.fitsNow, "warm-network")!.reason).toMatch(/clients/);
  });
  it("keeps bets that need a product or a given audience out of fitsNow until the field is saved, with an if", () => {
    for (const p of [nutri, nutriService]) {
      const r = matchSmallBets(p);
      for (const v of r.fitsNow) {
        const b = bet(v.id);
        expect(b.audiences, v.id).toBeUndefined();
        if (b.surfaces) expect(b.surfaces, v.id).toContain("service");
      }
      expect(find(r.fitsLater, "merchant-visits")!.reason).toMatch(/if your buyers are local shops/);
      expect(find(r.fitsLater, "freelance-platform")!.reason).toMatch(/if your buyers are businesses/);
      for (const id of ["changelog", "embeds"]) expect(ids(r.fitsNow), id).not.toContain(id);
    }
    const r = matchSmallBets(nutri);
    for (const id of ["curator-submissions", "browser-extension", "one-command-try", "integration", "hiring-post"]) expect(ids(r.fitsLater), id).toContain(id);
    expect(find(r.fitsLater, "browser-extension")!.reason).toMatch(/^if you also have .*browser extension/);
    expect(r.assumptions.join(" ")).toMatch(/Audience not saved.*wait in fitsLater/);
    // Nothing saved and nothing inferred: the same, without "also".
    const empty = matchSmallBets({});
    expect(find(empty.fitsLater, "browser-extension")!.reason).toMatch(/^if you have /);
    expect(find(empty.fitsLater, "warm-network")!.reason).toMatch(/^if you sell your own time/);
  });
  it("doesn't read a service from product words", () => {
    for (const category of ["customer service tool", "web service API", "nutrition coaching app", "invoicing software for freelancers", "cloud services for agencies' websites, a SaaS"]) {
      const r = matchSmallBets({ category });
      expect(r.assumptions.join(" "), category).not.toMatch(/treated as a service/);
      expect(r.fitsNow[0]?.id, category).not.toBe("say-what-you-sell");
    }
    for (const [field, text] of [["category", "freelance designer"], ["category", "marketing agency"], ["product", "life coaching for new parents"], ["category", "private practice psychotherapist"], ["businessModel", "paid sessions"], ["businessModel", "hourly consultations"]]) {
      expect(matchSmallBets({ [field]: text }).assumptions.join(" "), text).toMatch(new RegExp(`treated as a service .*from the ${field === "businessModel" ? "business model" : field}: "${text}"`));
    }
    // A saved surface wins over the words.
    expect(matchSmallBets({ category: "nutritionist", surfaces: ["web-app"] }).assumptions.join(" ")).not.toMatch(/treated as a service/);
  });
  // Eval 2026-10-28, solo-design: the designer's own words name the clients' product ("for software startups"), and
  // say-what-you-sell wasn't first in 2 of 3 runs.
  it("reads a service when a product word names the clients, not what is sold", () => {
    for (const [field, text] of [["category", "brand identity for early-stage software startups"], ["product", "brand identity and landing page design for SaaS startups"], ["category", "branding studio"], ["category", "freelance brand designer working with app founders"]]) {
      const r = matchSmallBets({ [field]: text });
      expect(r.assumptions.join(" "), text).toMatch(/treated as a service/);
      expect(r.fitsNow[0]?.id, text).toBe("say-what-you-sell");
    }
    for (const category of ["design tool for startups", "an app for nutritionists", "invoicing software for freelancers"]) expect(matchSmallBets({ category }).assumptions.join(" "), category).not.toMatch(/treated as a service/);
  });
  // Eval 2026-10-28, services-growth: a bookkeeping firm saved with surfaces service and website got hiring-post and
  // in-store-signs in fitsNow. A service's own site is where people book it, not a product.
  it("doesn't count a service's own website as a product", () => {
    const firm: SmallBetsFacts = { category: "bookkeeping firm for independent restaurants", surfaces: ["service", "website"], audiences: ["businesses", "local"], revenue: "live", launched: true, traction: { payingCustomers: 38, asOf: "2026-09" } };
    const r = matchSmallBets(firm);
    for (const id of ["hiring-post", "in-store-signs", "changelog", "embeds", "launch-sites", "browser-extension", "curator-submissions"]) {
      expect(ids(r.fitsNow), id).not.toContain(id);
      expect(ids(r.doesntFit), id).toContain(id);
    }
    expect(find(r.doesntFit, "hiring-post")!.reason).toMatch(/service's own website/);
    // A product with a website still gets them.
    expect(ids(matchSmallBets({ ...firm, category: "restaurant bookkeeping software", surfaces: ["web-app", "website"] }).fitsNow)).toContain("hiring-post");
  });
  it("gives every bet a horizon that agrees with its judging window", () => {
    for (const b of BETS) {
      expect(["weeks", "months"], b.id).toContain(b.horizon);
      // The longest stated window, in weeks: over about two months is "months". A count of tries, items or issues
      // with no window is "weeks", except a perk period, which runs for months.
      const perWeek = { day: 1 / 7, week: 1, month: 4.35 } as const;
      const windows = [...b.judgeAfter.matchAll(/(\d+)\s*(day|week|month)s?\b/g)].map((m) => Number(m[1]) * perWeek[m[2] as keyof typeof perWeek]);
      const expected = windows.length ? (Math.max(...windows) > 8.5 ? "months" : "weeks") : /perk period/.test(b.judgeAfter) ? "months" : "weeks";
      expect(b.horizon, `${b.id}: ${b.judgeAfter}`).toBe(expected);
    }
    expect(bet("build-a-network").horizon).toBe("months");
    expect(bet("curator-submissions").horizon).toBe("weeks");
  });
  it("groups fitsNow by horizon, weeks first, firstFor then score within each, and counts both", () => {
    for (const p of [nutri, nutriService, {}]) {
      const r = matchSmallBets(p);
      const h = r.fitsNow.map((v) => v.horizon);
      expect(h).toEqual([...h].sort((a, b) => (a === b ? 0 : a === "weeks" ? -1 : 1)));
      for (const g of ["weeks", "months"] as const) {
        const scores = r.fitsNow.filter((v) => v.horizon === g && !/do this first/.test(v.reason)).map((v) => v.score!);
        expect(scores).toEqual([...scores].sort((a, b) => b - a));
        expect(r.horizons[g]).toBe(r.fitsNow.filter((v) => v.horizon === g).length);
      }
    }
    const r = matchSmallBets(nutri);
    expect(find(r.fitsNow, "build-a-network")!).toMatchObject({ horizon: "months" });
    expect(r.howToReport).toMatch(/first 3 of each horizon/);
    expect(r.howToReport).toMatch(/how many more/);
  });
});
