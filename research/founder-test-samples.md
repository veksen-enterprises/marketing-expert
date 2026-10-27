# Who the founder asks: friends, one community, and what a biased sample breaks (checked 2026-10-27)

Question: `research/stop-line-statistics.md` §5 says every band it computes assumes the n people are independent buyers, and that founder tests usually ask friends, one Discord or people who already replied. What does that bias do to a stop line, and what should the tool and playbooks say?

Scope: who is asked, not how. Hypothetical bias (stated intent overstates paying) is already covered: research/early-stage-gtm.md items 8–9 (Schmidt & Bijmolt 2020; Morwitz et al. 2007). Launch-crowd and self-selected-community bias in startups is covered there too: items 14–15 (Cao, Koning & Nanda 2021; Allen, Bremner & McDonald 2026). Not repeated here.

Access marks: `read` full text seen this session; [read; fetch summary] full text seen only through a fetch tool that returns a summary and quotes (`knowledge/_conventions.md`); [abstract-only] abstract or publisher page only; [derived] my inference, not in a source. The egress proxy blocked direct downloads; full texts were read through the fetch tool, so every read below is a fetch summary.

## Sources

1. DePaulo, B. M. & Bell, K. L. (1996). "Truth and investment: Lies are told to those who care." *Journal of Personality and Social Psychology* 71(4):703–716. https://smg.media.mit.edu/library/DePaulo.Bell.truthAndInvestment.pdf [read 2026-10-27; fetch summary]
2. DePaulo, B. M. & Kashy, D. A. (1998). "Everyday lies in close and casual relationships." *Journal of Personality and Social Psychology* 74(1):63–79. https://smg.media.mit.edu/library/DePaulo.Kashy.EverydayLies.pdf [read 2026-10-27; fetch summary]
3. Kühne, S. (2018). "From strangers to acquaintances? Interviewer continuity and socially desirable responses in panel surveys." *Survey Research Methods* 12(2):121–146. doi:10.18148/srm/2018.v12i2.7299 [abstract-only, 2026-10-27]
4. Bell, S. O. & Bishai, D. (2019). "The Impact of Respondent–Interviewer Familiarity and Repeated Survey Participation on Abortion Reporting: Evidence from Rajasthan, India." *International Perspectives on Sexual and Reproductive Health* 44(4). doi:10.1363/44e7018. https://pmadata.org/publications/impact-respondent-interviewer-familiarity-and-repeated-survey-participation-abortion [abstract-only, 2026-10-27]
5. Yeager, D. S., Krosnick, J. A., Chang, L., Javitz, H. S., Levendusky, M. S., Simpser, A. & Wang, R. (2011). "Comparing the Accuracy of RDD Telephone Surveys and Internet Surveys Conducted with Probability and Non-Probability Samples." *Public Opinion Quarterly* 75(4):709–747. doi:10.1093/poq/nfr020. https://web.stanford.edu/dept/communication/faculty/krosnick/docs/2011/mode04%20POQ.pdf [read 2026-10-27; fetch summary; uncorrected proof, some tables garbled; volume and pages from memory, unchecked]
6. Mullinix, K. J., Leeper, T. J., Druckman, J. N. & Freese, J. (2015). "The Generalizability of Survey Experiments." *Journal of Experimental Political Science* 2(2):109–138. doi:10.1017/XPS.2015.19. https://faculty.wcas.northwestern.edu/jnd260/pub/Mullinix%20et%20al.%20The%20Generalizability%20of%20Survey%20Experiments.pdf [read 2026-10-27; fetch summary]
7. de Quidt, J., Haushofer, J. & Roth, C. (2018). "Measuring and Bounding Experimenter Demand." *American Economic Review* 108(11):3266–3302. NBER WP 23470, https://www.nber.org/papers/w23470.pdf [read 2026-10-27; fetch summary; working-paper version]

## 1. People who know the founder soften the verdict on the founder's own work

- 94 students rated paintings, then talked to an art student who said one liked and one disliked painting was her own work. For disliked paintings, conveyed minus actual liking was 1.62 points (9-point scale) when the painting was hers, 0.88 when it wasn't. For liked paintings the gap was small and not significant. [research, 1, read; n=94; lab; strangers, not friends]
- Only 40% of participants with no instruction said plainly that they disliked her painting; 16% claimed to like it. The usual move was not a lie: they stopped evaluating, listed the good parts, and criticised the other paintings instead. The authors: "There were no conditions under which the artists received totally honest feedback about the paintings they cared about." [research, 1, read]
- The person only had to care about the work. The asker was a stranger. A founder asking about their own product is the high-investment case by construction. [derived from 1]
- Closeness itself is not the driver. In diaries, people told fewer lies per interaction to close friends (about 17–28 per 100) than to strangers (56–77 per 100), but a larger share of the lies to friends were told to spare feelings (about 37–43% vs 18–26%). [research, 2, read; two diary studies, n=77 students and n=70 adults]
- Survey interviewers who know the respondent do not get more flattering answers on sensitive questions: one panel found familiarity reduced socially desirable answers [research, 3, abstract-only; German household panel], another found no effect [research, 4, abstract-only; n=6,041; India]. Both are about the respondent's own behaviour, not the asker's work.
- Read together: the inflation comes from asking someone to judge what you made, which friends and strangers both soften. Friends lie less overall, but their lies are the kind ones. [derived from 1–4]

Size, for a stop line: no source measures the shift on a yes/no "would you use this" count. Source 1's shift (about 0.7 points on 9 for disliked work) is a scale rating, not a count. Not converted. [derived]

## 2. A biased sample breaks the rate more than the comparison

- Nine surveys asked the same questions against 19 known benchmarks. Probability samples missed by 3.3–3.5 points on average; seven opt-in internet samples missed by 4.9–10.0. Weighting did not reliably fix the opt-in ones, and an opt-in sample's error on one benchmark did not predict its error on another. [research, 5, read; US adults, 2004–2009]
- Twenty experiments run on a population panel and repeated on unweighted opt-in workers: 29 of 36 effects matched in direction and significance, and none reversed. The authors' condition: convenience samples fail when they lack the people in whom the effect differs ("lack of variance on the predicted moderator"). [research, 6, read; political survey experiments]
- The painting study shows the same split inside one person: participants hid their dislike of her work but "communicated clearly their relative degrees of liking for the different special paintings." [research, 1, read]
- Telling people what the asker hopes for moves behaviour. Explicit requests ("do us a favour") moved results 0.25 to 1 standard deviation; just stating the hypothesis moved them about 0.1 to 0.25. [research, 7, read; ~19,000 online participants; economic games]. A founder posting "would love feedback on my tool" in their own Discord is closer to the strong case than the weak one. [derived]
- Consequence for founder tests: "how many of my Discord sign up" (a rate) is biased by an unknown amount, in an unknown direction for strangers and upward for anyone told it's the founder's. "Which of two pages gets more of my Discord to sign up" (a comparison, both shown to the same people) mostly survives, unless the community differs from buyers on exactly what the comparison turns on (price-sensitive students judging a price page). [derived from 1, 5, 6]

## 3. One community is one draw

- Twenty people from one Discord are twenty answers about that Discord. The exact binomial band in research/stop-line-statistics.md §1 is the band for that community's rate. Whether other communities match is a sample of one, and no n inside the community changes that. [derived]
- This is not the clustered-sample design effect (Kish), which needs several clusters to estimate. With one cluster there is nothing to estimate. [derived]
- Two communities reached the same way, with the same stop line, give a first check on whether the rate travels. [derived]

## 4. What this means for the tool and playbooks

1. **`check_answer` band note (stop-line-statistics.md §6 item 4, not built): make "not checked" specific.** When the move names its sample as friends, followers, the founder's community, a waitlist or existing users, the note's unchecked line should say: "These people know it's yours. Read the result as the high end of the real rate. A comparison between two versions shown to the same people holds up better than the rate itself." When the move names no sample, say "Not checked: who the n people are." Matching is by keyword on the move text, the same way `CHANNEL_KINDS` matches channels; a missed keyword falls back to the generic line, so a miss is never worse than today. Test cases: few saved stop lines name their sample (a grep of `evals/runs/` for Discord, friends, community and waitlist finds one, which recruits from Discord); add hand-written lines for the rest.
2. **Never an issue.** Asking friends is often the only test a founder can run this week (stop-line-statistics.md §2). Flagging it as an error would push agents to invent a stranger sample the founder doesn't have.
3. **`knowledge/customer-research.md` (§ on sampling, line 73): add one claim.** "People soften their verdict on work they know is yours, mostly by not saying they dislike it rather than by lying [research; lab, n=94; scale ratings]. Ask friends to choose between options, not to rate one; count what they do, not what they say." Traces to sources 1 and 6.
4. **Not proposed:** a weighting step or a minimum-strangers rule. Weighting didn't fix opt-in samples even with census targets [5]; a founder has no targets.

## 5. What this does not settle

- No study measures the upward shift on a yes/no count when the asker is the maker. Section 1's sizes are scale ratings in a lab.
- Sources 3 and 4 were seen as abstracts only, and concern self-reports, not judging the asker's work.
- Source 6 is political framing experiments; product comparisons may differ more between communities and buyers.
