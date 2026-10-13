---
title: Behavioral science and persuasion
summary: Consumer-psychology effects used in marketing (scarcity, urgency, social proof, defaults, anchoring, framing, choice overload, priming, reciprocity, commitment, loss aversion, nudges) with their replication status, plus dark-pattern rules (FTC, EU DSA Article 25, fake countdown timers). Test, don't assume.
tags: behavioral science, behavioral economics, consumer psychology, persuasion, cialdini, nudge, replication crisis, scarcity, urgency, countdown timer, fomo, social proof, default effect, opt-out, anchoring, framing, choice overload, paradox of choice, jam study, priming, ego depletion, power posing, reciprocity, free samples, foot in the door, commitment, loss aversion, dark patterns, deceptive design, ftc, digital services act
---

Many famous psychology findings did not hold up when other labs repeated them. In the Open Science Collaboration's 2015 project, 97% of 100 original studies had significant results; only 36% of the repeat studies did, and effects were about half as large [research]. Before you build a campaign on a "psychology hack", check whether it replicated, how big the effect is in the field, and whether it is legal.

Price-specific effects (decoy, charm/left-digit pricing, compromise effect, reference prices) are covered in **pricing**. Social norms on landing pages are covered briefly in **landing-pages-and-cro**. How to run tests is in **experimentation**.

## Summary table

_In short:_ Defaults, anchoring and framing hold up well, scarcity mostly does, and priming, ego depletion and power posing failed to replicate. Fake urgency is illegal, and nudges overall give small lifts.

| Effect | Status | Marketing use | Caution |
|---|---|---|---|
| Defaults / opt-out | Robust | Pre-selected plan, auto-renew, opt-out add-ons | Bad-faith defaults become dark patterns and drive refunds and complaints |
| Anchoring (numeric estimates) | Robust in lab; size in real buying less clear | Show the higher plan or "was" price first | Fake reference prices are illegal in many markets |
| Gain/loss framing | Robust (risky-choice framing) | "Save $200" vs "Don't lose $200" | Direction of best frame varies; test |
| Loss aversion | Debated; present but moderated | Trials that give ownership, loss-framed reminders | Weaker for buyers who know the category; not a universal 2:1 rule |
| Scarcity (real) | Mostly supported | Real low stock, real deadlines | Effect depends on type of scarcity |
| Fake urgency (fake timers, false stock) | Illegal / dark pattern | None | EU blacklist; FTC enforcement |
| Social proof / descriptive norms | Mixed | "Most customers choose X", reviews, counts | Famous hotel study did not replicate in Germany |
| Reciprocity (free samples) | Supported in field, variable | Samples, free tools, useful content | Effect varies a lot by brand; cannibalises paid trial |
| Foot-in-the-door | Small effect | Micro-commitments, multi-step forms | Many studies show zero or reverse effect |
| Choice overload | Mixed; average about zero | Trim options when choices are hard to compare | The jam study is the exception, not the rule |
| Social / behavioral priming | Failed to replicate | Do not use | Includes "elderly" walking and money/flag primes |
| Ego depletion | Failed to replicate | Do not use | "Tired shoppers buy more" claims rest on it |
| Power posing (behavior/hormones) | Failed to replicate | Do not use | Only self-reported "feeling powerful" held |
| Nudges overall | Small at scale | Expect about 1–2 percentage points (pp), not 8–9 pp | Published lifts are inflated |

## Defaults [research, robust]

_In short:_ The option you pre-select is chosen far more often, making defaults the most reliable lever here. A default the customer wouldn't want or can't easily undo is a dark pattern (a deceptive design trick).

Johnson & Goldstein (2003) compared organ donation across European countries: where people had to opt in, effective consent was rarely above about a quarter; where they had to opt out, it was often above 90%. A meta-analysis of 58 studies (73,675 people) found a medium-to-large average default effect, d=0.68 (d is a standard measure of effect size), stronger in consumer decisions than environmental ones (Jachimowicz et al. 2019).

Marketing use: the plan, billing period or add-on you pre-select will be chosen more often. This is the most reliable lever in this file. The legal line: a default the customer would not want, hidden or hard to undo (pre-ticked insurance, auto-renew buried in terms), is what regulators call a dark pattern.

## Anchoring and framing [research, robust in lab]

_In short:_ Anchoring (the first number seen shapes later judgments) and gain/loss framing replicated reliably in the lab, but expect smaller effects when buyers already know the market price.

Many Labs 1 repeated 13 classic effects in 36 samples (6,344 people). Anchoring and gain/loss framing (Tversky & Kahneman 1981) replicated consistently; two priming effects did not (Klein et al. 2014). Lab anchoring uses general-knowledge estimates, so expect smaller effects when buyers know the market price. For price anchors and decoys, see **pricing**.

## Loss aversion [research, debated]

_In short:_ Losses usually weigh more than equal gains, but there is no fixed 2x rule, and the effect is weaker for expert buyers who know the category.

Gal & Rucker (2018) argued loss aversion is overstated and not a general law. Mrkva, Johnson, Gächter & Herrmann (2020; five samples, 17,720 people) found it is real, even with small stakes (up to €6 or $20), but smaller in people with more knowledge, experience or education in the area and larger in older people. Practical reading: losses usually weigh more than equal gains, but do not assume a fixed "2×", and expect a weaker effect on expert buyers who know the category well.

## Scarcity and urgency [research, mixed; fake urgency illegal]

_In short:_ Real scarcity raises perceived value, but fake timers and false stock counts are illegal in the EU and targeted by US regulators. A deadline or stock count must be true.

Meta-analyses find scarcity raises perceived value (Lynn 1991). A 2023 meta-analysis found scarcity driven by demand ("selling fast") increased purchase more than scarcity driven by limited supply, and limited-time and limited-quantity cues did not differ (Ladeira et al. 2023).

Fake urgency is a legal problem, not a tactic:
- **EU**: falsely claiming a product is available only for a very limited time is on the Unfair Commercial Practices Directive "always banned" list [not re-verified]. In a 2023 sweep of 399 online shops, regulators found manipulative practices on 148, including 42 with fake countdown timers.
- **EU DSA Article 25**: online platforms must not design interfaces that deceive, manipulate or materially distort free decisions; examples include giving one choice more visual prominence, repeated prompts, and making cancelling harder than signing up. It applies where consumer and data-protection law do not already apply.
- **US**: the FTC staff report "Bringing Dark Patterns to Light" (2022) groups dark patterns into misleading design and disguised ads, hard cancellation, hidden terms and junk fees, and tricking people into sharing data.

Rule: a timer must reflect a real deadline that really ends; a stock count must be the real stock.

## Social proof [research, mixed]

_In short:_ Showing what other customers do is cheap to try, but its size and even direction depend on the setting. Use real numbers only, because invented counts or reviews are deceptive.

Goldstein, Cialdini & Griskevicius (2008) found a "most guests reuse towels" message beat a standard environmental message in a US hotel. Bohner & Schlüter (2014), in two German hotels (N=724 and N=204), found any message beat no message, but the descriptive-norm message was **not** better than the standard one. Social proof is plausible and cheap to try, but the size and even the direction depend on setting. Use real numbers; invented counts or reviews are deceptive.

## Reciprocity and free samples [research, field-supported]

_In short:_ Free samples can lift sales for a year, but the effect varies widely and replaces some paid trials. For software, a free tool or tier is the equivalent; measure paid conversion, not goodwill.

Field experiments found free samples can lift sales for up to 12 months, but the effect varied widely, even between brands in the same category, and samples replace some paid trial purchases (Bawa & Shoemaker 2004). The mechanism may be trial and habit rather than a felt duty to repay. For software, a useful free tool or free tier is the equivalent; measure paid conversion, not goodwill.

## Commitment and consistency [research, small effect]

_In short:_ Asking for a small thing first has only a small average effect, and many studies show none. Try an easy first step in a form as a test, not a sure win.

Foot-in-the-door (a small first request makes a larger one more likely) appears more often than chance across meta-analyses, but the average effect is small and many studies show no effect or the reverse (Beaman et al. 1983; Burger 1999). Multi-step forms that start with an easy question are a reasonable test, not a guaranteed lift. Also note: the well-known "sign at the top" honesty field study (Shu et al. 2012) was retracted after Data Colada showed the data were fabricated.

## Choice overload [research, average effect about zero]

_In short:_ Too many options does not usually hurt on average. Cut options only when they are hard to compare, the task is difficult, or people are unsure what they want.

In Iyengar & Lepper's (2000) jam study, a 24-jam display drew more shoppers but far fewer bought than at a 6-jam display. A meta-analysis of 50 experiments (N=5,036) found an average effect of virtually zero with large variation (Scheibehenne et al. 2010). A later meta-analysis found overload appears when options are hard to compare, the task is difficult, people are unsure what they want, or they are only browsing (Chernev et al. 2015). Cut options when those conditions are present, not by default.

## Failed to replicate: do not build on these [research]

_In short:_ Social priming, ego depletion and power posing did not hold up when repeated, so do not build campaigns on them.

- **Social priming**: with automated timing, people primed with "elderly" words did not walk more slowly; they did only when experimenters expected it (Doyen et al. 2012). Flag and money priming also failed in Many Labs 1.
- **Ego depletion**: 23 labs, 2,141 people, effect d=0.04, not different from zero (Hagger et al. 2016).
- **Power posing**: with 200 people, poses changed self-reported feelings of power but not hormones or behavior (Ranehill et al. 2015).

## Nudges overall [research]

_In short:_ Published nudge effects are inflated by selective publishing and small samples. Expect real lifts of about one or two percentage points, mostly from defaults.

DellaVigna & Linos (2022) compared 126 trials (23 million people). Nudges in academic papers averaged 8.7 percentage points; the same kind of nudges run by US government nudge units averaged 1.4 points. About 70% of the gap came from selective publication and small samples. Mertens et al. (2022) estimated an average d around 0.45; after correcting for publication bias, Maier et al. (2022) estimated 0.04–0.11, with weak evidence of any effect. Expect small lifts; a few types, especially defaults, are stronger.

## How to use this

_In short:_ Start with structural levers like defaults and fewer options, use only true claims, treat every effect as a hypothesis to test small, measure refunds and cancellations, and make cancelling as easy as signing up.

1. Start with structural levers (defaults, fewer hard-to-compare options, clear framing) before cosmetic ones (badges, timers).
2. Use only true claims: real deadlines, real stock, real customer counts, real reviews.
3. Treat every effect as a hypothesis. Size your test for a 1–2 pp lift, not the published one (see **experimentation**).
4. Measure downstream: refunds, cancellations, complaints and repeat purchase, not only clicks.
5. Check cancellation is as easy as signing up (DSA Article 25; see **email-and-lifecycle** for subscription flows).

## Common mistakes

_In short:_ The usual errors are treating weak findings as settled, expecting paper-sized lifts, fake timers and stock counts, pre-ticked add-ons, piling on widgets, and not testing.

- Citing the jam study, priming, ego depletion or power posing as settled science.
- Expecting the effect size from a paper or vendor case study.
- Fake countdown timers that reset on page reload, or "only 2 left" that never changes.
- Pre-ticked add-ons and hard-to-find opt-outs presented as "defaults".
- Stacking many urgency and social-proof widgets; each adds clutter and can reduce trust.
- Not testing: an effect that worked in one hotel did not work in another.

## Sources

research/behavioral-science.md (Open Science Collaboration 2015; Klein et al. 2014; Tversky & Kahneman 1981; Goldstein et al. 2008; Bohner & Schlüter 2014; Johnson & Goldstein 2003; Jachimowicz et al. 2019; Iyengar & Lepper 2000; Scheibehenne et al. 2010; Chernev et al. 2015; Doyen et al. 2012; Hagger et al. 2016; Ranehill et al. 2015; Beaman et al. 1983; Burger 1999; Bawa & Shoemaker 2004; Gal & Rucker 2018; Mrkva et al. 2020; DellaVigna & Linos 2022; Mertens et al. 2022; Maier et al. 2022; Lynn 1991; Ladeira et al. 2023; FTC 2022; EU CPC sweep 2023; DSA Art. 25; UCPD Annex I; Data Colada 2021). Most findings were read from search snippets of primary pages; items marked [not re-verified] there were not confirmed in this research.
