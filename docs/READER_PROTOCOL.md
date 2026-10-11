# Target-reader validation protocol

Status: **prepared, not yet run.** No human reader has taken part. Model reviews, including those recorded in this folder, are editorial checks. They are not evidence that people learn from the book. Related feedback: CA1-026 in [FEEDBACK.md](FEEDBACK.md).

## Ready-to-run materials — 2026-10-02

The user confirmed that participants are unavailable. The remaining human study stays deferred. Use [Form A](reader-study/FORM_A.md) and [Form B](reader-study/FORM_B.md), each with its own unfamiliar chart and complete calculation inputs. [The facilitator run sheet](reader-study/FACILITATOR.md) specifies alternating form order, neutral prompts, timing and reading exposure. [The scoring key](reader-study/SCORING_KEY.md) supplies checked numerical answers and task-specific anchors; keep it away from participants. [The results record](READER_RESULTS.md) has no participant observations.

Forms contain only cutoff bars, so no later bars need to be covered. Alternate A→B and B→A rather than reusing the same answers. These forms have not been calibrated for equal difficulty. The unequal pre/post time allowances and uncontrolled reading exposure also limit causal interpretation: record individual observations and score changes without claiming an estimated learning effect.

## Who to recruit

Recruit 5–8 adults who understand basic investing (shares, brokerage accounts, diversification, a percentage return) and who have **not** studied technical analysis. Exclude professional traders and the book's authors and reviewers. Record each participant's self-reported prior experience in one sentence. Do not record their name in the results file.

A first round of this size can show where readers misunderstand the book. It is too small to estimate how much a typical reader learns, and the results should not be described that way.

## Session design (about 90 minutes per participant)

1. **Pre-task (10 min).** Use the four tasks below with unfamiliar fictional data that does not appear in the book. Do not give feedback.
2. **Reading (45 min).** Assign a fixed path: Chapter 1, Chapter 2, Chapter 9, Chapter 20, and Chapter 21, with their exercises. Participants may reveal solutions only after attempting an exercise. Note where they stop, reread, or open the glossary.
3. **Post-task (25 min).** Give a parallel version of the four tasks, using different numbers and a different chart.
4. **Debrief (10 min).** Ask: Which passage confused you most? Which exercise did you skip, and why? What would you do differently on the post-task now?

## Tasks and rubric

Score each task 0–2. 0 = missing or incorrect. 1 = partly correct, or correct with an unstated assumption. 2 = correct, with the assumptions stated. Two scorers should score independently, then record their disagreements before reconciling.

| Task | What the reader does | A score of 2 requires |
| --- | --- | --- |
| A. Chart reading | Given an unfamiliar daily candle chart and settings box, state the interval, the session, the adjustment, and what one candle can and cannot tell them. | Correct settings. Notes that OHLC does not show the order of prices within the bar. |
| B. Calculation | Given an account, entry, stop, cost, and cash limit, compute shares, notional, planned price risk, cost-inclusive modeled loss, and the R of a supplied gap exit. | All values correct. The binding limit is identified. R uses the frozen price-risk denominator. |
| C. Analysis note | Write a short note at a cutoff (the later bars are covered). It should give one observation, one interpretation, one condition that would invalidate it, and the decision. | Observation and interpretation are kept separate. The invalidation condition can be tested. No later information is used. |
| D. Evidence evaluation | Assess a short performance claim (a hypothetical backtest with a best-variant search and no costs). | Names at least two missing elements, such as search history, costs, sample size or dependence, or comparator. Does not treat the claim as proof or as worthless. |

## What to record

For each participant, keep pre- and post-task scores per task, verbatim notes on misconceptions, and timestamps of confusion points with the chapter and section. List skipped exercises and the reason given. Keep the results in `docs/READER_RESULTS.md`, with one anonymized row per participant. Below the rows, list the revisions each misunderstanding motivated. Each revision should link back to the observation that caused it.

## Decision rule

Treat a misunderstanding as a priority defect when at least two participants show it, or when one participant shows it on a calculation or evidence task. Revise the passage, then check the change with a new participant, not with someone who has already seen it. Do not change rubric thresholds after seeing scores.

## Consent and data

Explain that participants are testing the book, not being tested themselves. Tell them participation is voluntary and they can stop at any time. Do not collect financial account details. Keep raw notes outside the project folder. Store only anonymized summaries here.
