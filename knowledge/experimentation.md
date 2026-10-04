---
title: Experimentation and A/B testing
summary: Running tests that produce trustworthy answers; power, MDE, peeking, SRM, Twyman's law, guardrails, and what to do when traffic is too low to test.
tags: a/b testing, ab test, experiment, split test, statistical significance, sample size, mde, power, peeking, srm, cuped, sequential testing, kohavi, low traffic
---

## Before launching

1. **Hypothesis**: "Because [evidence], changing [X] for [audience] will improve [metric]." No evidence → you're guessing; that's fine, but say so and size bets accordingly.
2. **One primary metric** (the overall evaluation criterion), close enough to the change to move detectably, but tied to value (completed signups, purchases, not clicks). Plus **guardrails** (revenue per visitor, refund rate, page speed, unsubscribe rate) that must not get worse.
3. **Power analysis**: call ab_test_sample_size (conversion rates) or ab_test_means_sample_size (revenue per visitor, order value: needs the standard deviation per visitor from historical data). Required sample scales with 1/MDE²: halving the effect you want to detect quadruples the traffic. Default 80% power, α = 0.05 two-sided.
4. **Fix duration in whole weeks** (weekday/weekend behaviour differs) and the decision rule in advance: what result means ship, kill, or iterate.
5. **QA** every variant on every major browser/device; check the tracking fires identically in both arms.

## Reading results

Use ab_test_evaluate for conversion rates, or ab_test_means_evaluate for revenue-type metrics (give raw per-visitor values if you can, and also run it with capPercentile 0.99: a few large orders can decide a revenue test). In order:
1. **Sample ratio mismatch** first. If a 50/50 test's split differs significantly (p < 0.001), randomisation or tracking is broken (bots, redirects, a variant that errors, tracking differences). Don't interpret the result until it's found.
2. **Was the planned sample reached?** Stopping when it "looks significant" invalidates the p-value. Checking 10 times inflates a nominal 5% false-positive rate to ~26% (Evan Miller).
3. **Effect and interval**, not just p. Plan around the lower end of the confidence interval (CI, the range of effects consistent with the data): winners' observed lifts are biased upward (winner's curse), so expect regression on rollout.
4. **Twyman's law**: any figure that looks interesting or different is usually wrong. Lifts above ~30% from a UI change are rare; check for bugs before celebrating.
5. **Guardrails** didn't degrade.
6. **Segments** only to generate new hypotheses, not to rescue a flat test (with 20 segments, one will be "significant" by chance).

## Peeking and sequential testing [research]

Use ab_test_sequential when the team will check results continuously: it implements the mixture SPRT ("always valid inference", Johari, Pekelis & Walsh), so stopping when it says stop is valid. In this project's simulation (A/A tests checked 50 times each), it gave false positives 0.8% of the time vs 33% for a repeatedly checked z-test; the price is lower power than a fixed test read once at its planned size.

- Fixed-horizon tests must be evaluated once, at the planned sample.
- If you need to monitor continuously, use a sequential method designed for it (group sequential designs, mSPRT, always-valid confidence sequences). Many commercial tools offer these.
- Bayesian tests are not immune to peeking problems.

## Variance reduction [research]

CUPED (Deng, Xu, Kohavi & Walker 2013) uses pre-experiment data on the same users as a covariate; it reduced variance ~50% on some Bing metrics, roughly halving required sample. Available in most mature experimentation platforms. Only works where you have pre-period data per user (logged-in products, returning visitors).

## When traffic is too low

Most B2B sites can't detect a 5–10% lift on a 2% conversion rate in any reasonable time. Run ab_test_sample_size with your real numbers before arguing. Options, in order:
1. **Test bigger changes**: a new value proposition or offer, not a button colour. Bigger true effects need far less traffic.
2. **Move the metric upstream**: test on a higher-volume step (click-through to signup, form starts), accepting it's a proxy.
3. **Pool traffic**: test a change across many similar pages at once.
4. **Qualitative evidence**: message tests, user tests, session recordings, sales feedback.
5. **Ship on judgement and monitor**, with a before/after comparison and a holdout where possible. Be honest that it's not a controlled result.

Don't run underpowered tests and report "no significant difference" as "no difference"; it means you didn't learn anything.

## Experiment program health

- Expect most ideas to fail; at large companies the majority of tests show no improvement (Kohavi, Tang & Xu, Trustworthy Online Controlled Experiments, 2020).
- Log every test (hypothesis, result, CI, decision) so losses teach as much as wins.
- Run tests for at least one full business cycle; watch for novelty effects (an early lift that fades).
- Interactions between concurrent tests are usually small, but don't run two tests on the same element at once.

## Common mistakes

- Stopping at the first significant reading.
- Ignoring SRM.
- Testing ten variants without correcting for multiple comparisons (use the Bonferroni correction in ab_test_sample_size, which divides the significance level by the number of comparisons, or a dedicated method).
- Optimising clicks while revenue per visitor falls.
- Copying "winning tests" from case-study libraries; context dependence and publication bias make them weak priors.

## Sources

research/landscape-2026.md §8 (Evan Miller 2010, 2015; Deng et al. 2013; Kohavi, Tang & Xu 2020); research/cro-landing-pages.md §8 (Berman et al.; Twyman's law).
