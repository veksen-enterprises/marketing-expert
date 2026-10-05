---
title: Email and lifecycle marketing
summary: Deliverability requirements (Gmail, Yahoo, Microsoft), metrics after Apple Mail Privacy Protection, lifecycle programs (onboarding, activation, retention, win-back), and how to measure them with holdouts.
tags: email marketing, lifecycle, deliverability, spf, dkim, dmarc, unsubscribe, open rate, apple mpp, onboarding, activation, nurture, retention, churn, win-back, crm
---

## Deliverability requirements (enforced) [first-party]

_In short:_ Gmail, Yahoo and Microsoft now reject or throttle bulk mail that lacks proper sender authentication, one-click unsubscribe, or has too many spam complaints. Fix this first, because nothing else works from the spam folder.

**Gmail** (bulk sender = 5,000+ messages/day to Gmail; in force Feb 2024, rejections since Nov 2025):
- SPF and DKIM, DMARC at least p=none, with alignment; valid forward/reverse DNS; TLS.
- One-click unsubscribe (RFC 8058 List-Unsubscribe-Post header) on marketing mail, plus a visible unsubscribe link.
- Spam complaint rate under 0.1% target; at 0.3%+ you're ineligible for mitigation. Check Google Postmaster Tools.

**Yahoo**: SPF or DKIM for all senders; bulk senders need both plus DMARC; complaints < 0.3%; one-click unsubscribe honoured within 2 days.

**Microsoft Outlook.com/Hotmail** (5,000+/day, from May 2025): SPF pass, DKIM pass, DMARC at least p=none aligned. Non-compliant mail is rejected with error 550 5.7.515 (Microsoft first said it would go to Junk, then changed this).

If any of this is missing, fix it before anything else in email: no content strategy survives the spam folder.

## Hygiene

_In short:_ Send marketing from a separate subdomain, use confirmed opt-in, never buy lists, stop mailing people who ignore you after a re-permission attempt, and warm up new domains gradually.

- Send marketing mail from a subdomain separate from transactional mail.
- Double opt-in or confirmed opt-in for lead magnets; never buy lists.
- Sunset unengaged recipients (no clicks in 90–180 days, adjusted to your send frequency) after a re-permission attempt. Engagement is the main reputation input.
- Warm up new domains/IPs gradually.

## Metrics after Apple Mail Privacy Protection

_In short:_ Open rate is no longer a valid metric, since Apple pre-loads emails whether or not anyone reads them. Judge email by clicks, conversions, replies, unsubscribes and complaints; triggered emails beat broadcasts.

Apple MPP preloads images through a proxy, so opens fire whether or not a person read the email. In Litmus's July 2026 data (over 1 billion opens), Apple clients, which include these proxy opens, were 62% of tracked opens, and Apple plus Gmail almost 90%. Consequences:
- **Open rate is not a valid performance or A/B metric.** Don't pick subject-line winners by opens; don't define "engaged" by opens alone.
- Use: click rate, click-to-conversion, revenue or conversions per recipient, replies, unsubscribe and complaint rates, and inbox placement.
- Benchmarks: Klaviyo 2026 campaign click rate 1.69% (top 10%: 3.38%), flow click rate 5.58% (top 10%: 10.48%). Klaviyo reports flows produce far more orders per recipient than campaigns (placed-order figures of 0.16% vs 2.11% circulate but weren't confirmed). Klaviyo customers only. The gap between campaigns and flows is the useful part: triggered, behaviour-based email outperforms broadcasts.

## Lifecycle programs by stage

_In short:_ Lifecycle email (messages sent along a customer's journey) works best when triggered by what users do or fail to do. Drive the action that predicts retention, one job per email, and fix failed-payment recovery first.

| Stage | Goal | Trigger examples |
|---|---|---|
| Onboarding | Reach first value ("aha") fast | Signup; nudges keyed to steps not completed |
| Activation | Form the habit that predicts retention | Usage below activation threshold by day N |
| Expansion | More seats/usage/plan | Hitting limits; team invites; feature usage patterns |
| Retention | Prevent churn | Usage decline; failed payment (dunning); renewal approaching |
| Win-back | Recover lapsed users | X days inactive; cancellation |

Rules:
- **Behaviour-triggered beats calendar-based.** Send when the user does or fails to do something.
- **Define activation from data**: find the early action(s) whose completion best predicts retained users in your cohorts. Make onboarding drive that action, not a product tour.
- **One job per email**, one CTA.
- **Dunning** (failed payment recovery) is often the highest-ROI lifecycle work in subscriptions: involuntary churn is churn you didn't earn.
- Respect frequency; complaints compound across all sends.

## Measure with holdouts

_In short:_ Email revenue figures overstate impact because recipients were already engaged. Keep a random 5 to 10 percent holdout (people deliberately not emailed) and compare against it to see the true lift.

Attributed email revenue overstates impact (people who get emails are already engaged). Keep a persistent random holdout (5–10%) from each lifecycle program and compare conversion/retention against it. That is the program's true lift.

## Subject lines and preheaders

_In short:_ Put the meaning first, because phones show only the first 25 to 40 characters of a subject. Be specific rather than clever, and test subject lines on clicks or conversions, not opens.

Front-load the meaning: mobile shows roughly 25–40 characters of subject and 35–50 of preheader (check_copy_limits with platform "email"). Specific beats clever. Test subject lines on clicks or conversions, not opens.

## Common mistakes

_In short:_ Avoid judging campaigns by open rate, blasting the whole list, onboarding emails that describe features instead of driving the key action, and running programs with no holdout to show they work.

- Judging campaigns by open rate.
- Blasting the whole list because "it's free": complaints and disengagement hurt deliverability for every future send.
- Onboarding sequences that describe features instead of driving the activation action.
- No holdout, so nobody knows if the program works.

## Sources

research/landscape-2026.md §2, §3, §7 (Google Workspace sender guidelines; Yahoo sender hub; Microsoft Tech Community 2025; Litmus; Klaviyo 2026 benchmarks); research/measurement.md §4 (holdouts).
