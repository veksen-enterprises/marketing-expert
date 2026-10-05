---
title: Activation and product analytics for a small team
summary: What to track first at 0–100 users, event naming (Segment, Amplitude, PostHog conventions), a minimal tracking plan, defining activation for products that need setup, privacy-friendly and self-hosted analytics tools and their limits, consent and server-side tracking, reading very small numbers, CLI and developer-tool telemetry norms (opt-in vs opt-out, DO_NOT_TRACK), and dashboards vs vanity metrics.
tags: product analytics, event tracking, tracking plan, event naming, object action, instrumentation, activation metric, setup moment, time to value, posthog, plausible, umami, matomo, self-hosted analytics, cookieless analytics, server-side tracking, session replay, small sample, confidence interval, telemetry, cli telemetry, do not track, opt-in, opt-out, vanity metrics, dashboard
---

Use this playbook when you need to set up product analytics, or decide what to look at, with few users and no data team. It extends, and does not repeat: **metrics-and-measurement** (cohort maths, north star, leading vs lagging), **self-serve-saas** (the method for finding an activation action and the benchmarks), **retention-and-expansion** (churn diagnosis), **privacy-and-marketing-law** (cookie banner rules) and **small-bets** (founder emails).

**Event** = one record that something happened ("Project Created"), with a time, a user and details called **properties**. **Tracking plan** = the written list of events, when each fires, and its properties.

## What to track first

_In short:_ Track only five to eight events at first: signup, each setup step, first value, value repeated and payment. Send them from your server so ad blockers cannot drop them.

- **At 0–100 users, five to eight events answer almost every question** [practitioner; built from vendor docs]:
  1. Signed up.
  2. Each setup step the product needs (data source connected, CLI installed, CI check added, teammate invited).
  3. First value: the first time the product does its job (first query answered, first passing check, first report sent).
  4. Value repeated: the same action on a later day.
  5. Paid (and cancelled).
- Segment says its most successful customers keep "a minimal number of core events with rich properties", and that it began with three: User Signed Up, Source Data Sent, Subscription Started. [first-party; vendor; Segment sells analytics]
- **Send these from your server**, not the browser, where you can. PostHog's docs say backend events are "more reliable" because ad blockers and interrupted scripts drop browser events. Use browser events for page paths and clicks only. [first-party; vendor]
- Give every event the same user ID your database uses, link it to the pre-signup anonymous ID, and filter out your own team's accounts. PostHog lists mixed ID formats and catch-all IDs like "system" as the most common mistakes. [first-party; vendor]
- **Later (hundreds of active users, several people asking questions)**: add feature-level events, plan and limit events, acquisition properties (channel, campaign) and account or company grouping for team products. Add events when a question needs them, not "in case".

## Event naming

_In short:_ Pick one naming style, write it down and never mix: object first, then action, with changing details kept in properties (extra labelled fields), not in the name.

Pick one convention, write it at the top of the tracking plan, and never mix. The three main vendors agree on object first, then action; few events with properties; and no changing values (dates, IDs, names) inside event names. They disagree on tense and case. [first-party; vendor; all three sell analytics]

| Vendor | Event format | Example | Properties |
|---|---|---|---|
| Segment | Object + Action, Title Case, past tense | Project Created | lowercase words joined by underscores |
| Amplitude | Noun + past-tense verb, consistent case, user's point of view | Song Played | same definitions across events |
| PostHog | category, colon, object and action; lowercase with underscores; present tense | signup flow, pricing page view (written lowercase, joined by underscores) | "is" or "has" prefix for true/false; "date" or "timestamp" suffix |

- Amplitude warns that "Song Played" and "song played" become two separate events. Case matters. [first-party; vendor]
- Put variable values in properties: "Report Exported" with a format property, not "Report Exported PDF". Segment's bad example is an event name with a date inside it. [first-party; vendor]

## A minimal tracking plan

_In short:_ Keep a one-table tracking plan (the written list of events) in your code repo, each event tied to a question it answers, and delete events nobody has queried in three months.

Keep it as one table in the repo, next to the code that sends the events.

| Event | Fires when (server or browser) | Properties | Question it answers |
|---|---|---|---|
| Account Created | signup saved (server) | signup source, plan, how-heard answer | Where do signups come from? |
| Source Connected | first successful connection (server) | source type, minutes since signup | How many get through setup, and how fast? |
| First Result Produced | first successful core action (server) | minutes since signup | Time to value; activation rate |
| Result Produced | every core action (server) | count so far | Is value repeated on later days? |
| Teammate Invited | invite sent (server) | role | Does the product spread inside teams? |
| Subscription Started / Cancelled | billing webhook (server) | plan, price, reason | Who pays, who leaves, why |

Add a "status" column (planned, live, removed) and a date. Remove events nobody has queried in three months. [practitioner]

## Defining activation when the product needs setup

_In short:_ Setup is not activation (the moment a user first gets real value). Measure the drop-off between each setup step and first value, and check your definition against your own retention.

- **Separate setup from value.** Reforge describes three moments in order: setup (the user has done what is needed to get value), aha (first experience of value), habit (value repeated within a set period); "setup is not activation". [practitioner; snippet-only]
- For products where the user must connect a database, install something in CI or invite a team, track the **drop between each setup step and first value**. A large drop at one step tells you where to help. Time to first value is covered in **developer-tools**.
- **Activation** = first value reached within a time window (for example, first result within 7 days); **habit** = value repeated (for example, results on 3 separate days in the first 14). Choose and check against your own retention, as described in **self-serve-saas**. [practitioner]
- **Leading indicators** to watch daily at small scale: minutes or hours from signup to each setup step; share of signups that start setup at all; errors during setup (failed connections, failed installs).

**Evidence that early activation predicts retention** (mostly correlation, one experiment):
- A cloud provider gave 366 of 2,673 new customers early guidance: first-week churn halved and usage over eight months was 46.57% higher. [research; field experiment, n=2,673; one firm; abstract]
- At a European digital TV provider, free-trial customers stayed about one third as long as regular customers, and their usage predicted retention more strongly. [research; observational; one firm; press release only]
- Wikipedia newcomers whose edits were reverted in their first session were less likely to still be editing 2–6 months later; the share of good-faith newcomers reverted in their first session rose from 6.1% to 18.2% between 2006 and 2007. [research; observational; read in full]
- Amplitude reports that 69% of products in the top group for day-7 activation were also in the top group for three-month retention, across over 2,600 companies. [vendor; Amplitude customers; product-level correlation]
- **Caution**: more activity is not always more conversion. In a randomized test with 680,588 users of an image-editing SaaS, users who completed many tasks during the trial converted less right away and more later. [research; RCT, n=680,588; one firm]
- So: push users to first value fast, then test whether the push raised retention (see **experimentation**).

## Privacy-friendly and self-hosted tools, and what each can't do

_In short:_ Privacy-friendly page counters show where visitors come from but cannot follow one person over time. Activation and retention need user-level events, and your own database is often enough.

| Tool | Good for | What it can't do |
|---|---|---|
| Plausible | Page traffic, sources, goals without cookies | Recognise a person across days, devices or sites: the visitor ID uses a salt deleted every 24 hours. No user-level retention. [first-party; vendor] |
| Umami | Cookieless traffic; funnels and goals | New browser or device = new visitor unless you set your own ID for logged-in users. [first-party; vendor] |
| Matomo (self-hosted, cookieless mode) | Full web analytics on your own server | Without cookies, cannot reliably tell new from returning visitors. [first-party; vendor] |
| PostHog (self-hosted "hobby") | Events, funnels, retention, replays, flags | No vendor support; free-plan features only; not advised above about 300k events a month; you carry the risk of data loss. [first-party; vendor] |

- Web traffic tools answer "where do visitors come from". **Activation and retention need user-level events**, which a cookieless page counter cannot give. For a small product, your own database (accounts, setup records, results, billing) is often the best analytics store; add a product analytics tool when queries get slow to write. [practitioner]
- Other options (Mixpanel, Amplitude, PostHog Cloud) are hosted; check where data is stored and what is sent to third parties.

## Consent and server-side tracking (not legal advice)

_In short:_ Moving tracking to your server does not remove the need for consent if browser code still collects device data. Session replay (recordings of user screens) needs masking and, in the EU, consent.

The banner rules (reject as easy as accept, no trackers before choice) are in **privacy-and-marketing-law**. What matters for analytics:
- The EU data protection board (EDPB) reads the ePrivacy cookie rule to cover tracking pixels, browser code that sends device information back to a server, and in some cases tracking by IP address alone. [first-party; November 2023 version read]
- **Server-side tagging does not remove consent** when browser code still reads and sends device data; it only moves where the data is processed. [first-party; our reading of the EDPB text]
- France's CNIL exempts analytics from consent only when it is limited to audience measurement and A/B testing for one publisher, with trackers living at most 13 months, the IP address shortened, no combining with other data, and users informed and able to object. It says most large analytics products don't qualify. [first-party]
- The UK allows some analytics cookies without consent since the Data (Use and Access) Act 2025 (see **privacy-and-marketing-law**).
- Events your own server records while providing the service (account created, job run) are not browser tracking, but GDPR still applies: you need a lawful basis, a privacy notice and retention limits. Whether ePrivacy consent applies here is not settled in the sources read. [open question]
- **Session replay** records what users see and type. Researchers found replay scripts on 482 of the top 50,000 sites capturing card numbers, passwords and medical details. [research; measurement study, 2017; snippet-only] PostHog masks all inputs by default but not other text. [first-party; vendor] Mask all text on screens with customer data, and treat replay as consent-requiring tracking in the EU.

## Measuring with very small numbers

_In short:_ With under about 100 users, percentages mislead and jumps are usually noise. Count and name actual people, compare monthly groups, skip A/B tests, and email each signup yourself.

- **Percentages mislead below about 100 users.** If 3 of 10 signups activate, the true rate could be anywhere from about 11% to 60% (95% Wilson interval). 30 of 100 gives about 22–40%; 300 of 1,000 gives 27–33%. [research: Brown, Cai & DasGupta 2001 recommend Wilson intervals for small samples; own calculation]
- Zero events is not zero risk: 0 of 20 still allows a true rate up to about 16% (the "rule of three": 0 in n means up to about 3/n). [research; snippet-only]
- A week-to-week jump from 20% to 40% activation with 10 signups a week is usually noise. Compare monthly cohorts, and do not run A/B tests at this volume (see **experimentation**). [practitioner]
- **Count and name people instead.** "7 of 12 signups this month connected a source; 4 got a first result; here is what stopped the other 3." [practitioner]
- **Qualitative backups:**
  - Watch replays of every signup who started setup and stopped. Five sessions find most usability problems in one user group; that rule is for finding problems, not measuring rates. [practitioner; Nielsen 2000, based on a 1993 model]
  - Email each new signup, payer and canceller yourself with one question (see **small-bets** for wording and the email rules).
  - Ask "how did you hear about us?" at signup (see **metrics-and-measurement**).

## CLI and developer-tool telemetry

_In short:_ Telemetry (anonymous usage reporting) is normally on by default in big developer tools, but a small tool should prefer opt-in, a first-run notice, its own endpoint, and honour DO_NOT_TRACK.

**Norm today**: most large developer tools collect anonymous usage data **by default (opt-out)**, show a notice on first run, and offer their own environment variable to turn it off. [first-party]

| Tool | Default | How to turn off | Honours DO_NOT_TRACK? |
|---|---|---|---|
| Next.js | On | `next telemetry disable` or NEXT_TELEMETRY_DISABLED=1 | No (source checked 2026-10-05) |
| Homebrew | On, notice before first event | `brew analytics off` or HOMEBREW_NO_ANALYTICS=1 | No; a 2019 pull request to add it was declined |
| .NET SDK | On | DOTNET_CLI_TELEMETRY_OPTOUT=1, set before install | Not documented |
| Gatsby | On, notice at install and first run | `gatsby telemetry --disable` or GATSBY_TELEMETRY_DISABLED=1 | Not documented |
| Turborepo | On | DO_NOT_TRACK=1 or its own setting | Yes |
| Go toolchain | Local only; upload is opt-in | `go telemetry off` | Not applicable |

- What they collect: commands run, versions, OS and CI flags, durations, crash traces of the tool's own code. They say they avoid file contents, paths, environment variable values and logs. Homebrew keeps data 365 days with no user ID or IP field and publishes aggregates. .NET hashes most values, and since .NET 10 it records which AI coding agent invoked it. [first-party]
- **DO_NOT_TRACK=1** is a proposed convention (no standards body) meaning "no usage reporting, telemetry or crash reports". Support is patchy. Honour it anyway: it costs one line. [practitioner; first-party]
- **Backlash cases** [first-party; Audacity from press]:
  - Homebrew (2016): users and institutions asked for opt-in; Homebrew kept opt-out with a notice.
  - GitLab (2019): planned third-party (Pendo) tracking scripts; reversed within weeks; committed to never send usage data to a third-party analytics service.
  - Audacity (2021): planned Google Analytics and Yandex right after an acquisition; nearly 3,500 downvotes; dropped.
  - Go (2023): proposed opt-out telemetry; changed to opt-in after public debate. Opt-in gave about 1,800 weekly participants by 2024, after a prompt shown to 5% of VS Code Go users, and still found real bugs.
  - Common pattern: third-party analytics services, surprise, and timing near an ownership or terms change.
- **For a small developer tool**: prefer opt-in, or at least a clear first-run notice, a documented list of fields, your own endpoint (no third-party analytics), and DO_NOT_TRACK plus your own variable. Turn it off automatically in CI unless the user opts in. Your best activation data usually comes from your service (API keys with traffic, CI runs reporting in), not from the CLI. [practitioner]

## Dashboards that matter vs vanity metrics

_In short:_ Vanity metrics (numbers that grow but tell you nothing to act on, like page views) mislead. Review one weekly dashboard of signups by source, funnel, time to first value and retention.

- **Vanity metric** = a number that grows but doesn't tell you what to do: page views, total signups, GitHub stars, total downloads. Eric Ries's example is "hits", which count "a technical process, not a number of human beings". [practitioner; Ries 2009]
- One small-team dashboard, reviewed weekly:
  1. New signups by source (count).
  2. Funnel by monthly signup cohort: started setup → finished setup → first value → value repeated → paid (counts and names, not only percentages).
  3. Median time from signup to first value.
  4. Weekly active accounts (accounts that produced value that week).
  5. Cohort retention (see **metrics-and-measurement**).
- Each number should have a decision attached: "if setup completion falls, we look at replays of that step".

## What usually works by stage

_In short:_ Match tooling to size: under 20 users query your own database and email everyone; at 20 to 100 add a few server-side events; beyond 100 add an analytics tool.

- **0–20 users**: no analytics tool needed. Query your own database, watch replays, email every signup, and keep a list of who reached first value. [practitioner]
- **20–100 users**: the five to eight server-side events above, one naming convention, a written tracking plan, a cookieless page counter for the website, and the monthly-cohort funnel in counts. [practitioner]
- **100–1,000 users**: a product analytics tool (hosted or self-hosted), activation checked against retention, a first experiment on the activation step once each arm can get enough users (see **experimentation**). [practitioner]
- **Beyond**: account-level analytics for teams, a data warehouse, and a reviewed tracking plan with an owner. [practitioner]

## Common mistakes

_In short:_ Avoid autocapture-only tracking, mixed event names, browser-only core events, calling setup completion activation, reading tiny samples as trends, unmasked replays, and total-only dashboards with no decision attached.

- Autocapture only, with no clean signup or first-value event. PostHog's own docs warn about this. [first-party; vendor]
- Mixed naming ("signup", "Sign Up", "user signed up") splitting one action into three events.
- Tracking core events only in the browser, so ad blockers and consent refusals erase part of the funnel.
- Calling setup completion "activation" for products where value comes later.
- Reporting "activation up 15 points" from 10 signups.
- Third-party analytics scripts inside a developer tool or self-hosted product without notice.
- Session replay with unmasked customer data.
- A dashboard of totals (signups, stars, page views) with no cohort view and no decision attached.
- Believing a vendor's "no consent needed" claim without checking how you configured it.

## Sources

research/activation-and-analytics.md (Segment, Amplitude and PostHog naming docs; Rachitsky; Reforge, snippet-only; Retana, Forman & Wu 2016; Datta, Foubert & Van Heerde 2015; Halfaker et al. 2013; Amplitude 2025 benchmark; Zhang & Duan 2025; Plausible, Umami, Matomo, PostHog docs; Englehardt et al. 2017; EDPB Guidelines 2/2023; CNIL; Next.js, Homebrew, .NET, Gatsby, Turborepo and Go telemetry docs; GitLab 2019; Audacity 2021; donottrack.sh; Brown, Cai & DasGupta 2001; Hanley & Lippman-Hand 1983; Nielsen 2000; Ries 2009). Also research/small-bets-direct.md (Retana et al., founder emails), research/b2b-saas-models.md (activation method) and research/privacy-and-marketing-law.md (UK analytics exception).
