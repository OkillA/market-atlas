# Scoring key — facilitator and scorers only

Version: 2026-10-02. Freeze this key before the first participant. Do not show it during pre-task, reading, or post-task. The forms are parallel in intended skills, not empirically calibrated for equal difficulty. Alternate their order and record it; do not attribute every score change to learning.

Each task is 0–2; total 0–8. Score explanations, not writing style or a preferred trading decision. Accept equivalent language. Round dollars to cents and R to two decimal places (tolerance ±0.01R); retain full precision until the last step. Whole-share counts must be exact.

## A. Chart reading

Form A: daily, regular U.S. session 09:30–16:00 America/New_York, raw/unadjusted dollar prices, linear. S6 O/H/L/C = 40.50/41.50/39.80/41.00. Form B: same interval/session/scale, split-adjusted and not dividend-adjusted. T6 O/H/L/C = 52.50/53.20/51.50/52.00. Neither bar establishes high-before-low or low-before-high; both sequences are compatible with OHLC.

- **2:** Settings and OHLC correct; explicitly identifies sequence uncertainty.
- **1:** At least one correct setting and correct sequence uncertainty, with an omission or a non-severe identification error.
- **0:** Claims OHLC establishes the intrabar order, or cannot identify the candle/settings meaningfully.

## B. Position calculation

Let q be shares, E entry, S planned stop execution, f the fixed cost per side, c the per-share cost per side, B the modeled-loss budget and K entry cash. Round down q_loss = (B − 2f)/(E − S + 2c), q_cash = (K − f)/(E + c); choose min(q_loss, q_cash). Planned price risk/1R = q(E − S); modeled loss adds 2f + 2cq. Net P&L at exit X = q(X − E) − 2f − 2cq. Net R uses the frozen price-risk denominator, including after a gap.

| Quantity | Form A | Form B |
| --- | --- | --- |
| Loss-budget share limit | floor(145/1.60) = 90 | floor(196/2.10) = 93 |
| Entry-cash share limit | floor(2997.50/40.05) = 74 | floor(4998/50.05) = 99 |
| Chosen shares; binding limit | 74; cash | 93; modeled loss |
| Entry notional | $2,960.00 | $4,650.00 |
| Entry fee | $6.20 | $6.65 |
| Entry cash debit | $2,966.20 | $4,656.65 |
| Frozen planned price risk / 1R | $111.00 | $186.00 |
| Both sides' modeled costs | $12.40 | $13.30 |
| Cost-inclusive modeled loss | $123.40 | $199.30 |
| Gap exit gross P&L | −$296.00 | −$465.00 |
| Gap exit net P&L | −$308.40 | −$478.30 |
| Gap exit net R | −2.778378…R (−2.78R) | −2.571505…R (−2.57R) |

- **2:** Both constraints, selected whole shares, binding limit, requested quantities and frozen-denominator gap R correct; recognizes the planned stop price is not guaranteed.
- **1:** Sound constraint and frozen-denominator method with one or more arithmetic/rounding omissions or slips; no borrowing or guaranteed-stop claim.
- **0:** Uses an unaffordable or over-budget size without applying the smaller constraint, resets 1R to actual loss, treats the stop as a guaranteed fill, or provides no workable calculation.

Form A cash check: 75 shares would require $3,006.25. Form B loss check: 94 shares would model $201.40. Both fail the applicable limit. The unused equity is not permission to exceed the specified available cash.

## C. Analysis note

Illustrative A: “S6 closes at 41.00, above S3's 40.50 high. That supports a tentative continuation interpretation. A later close below 39.80 would weaken my interpretation. I will record the observation and wait for an execution plan and quote before committing an order.” The weakening condition is an author's declared threshold, not a universal rule.

Illustrative B: “The closes fall from 54.50 at T1 to 52.00 at T6, despite T4's bounce. This is consistent with downward pressure at this horizon. A later close above T4's 54.20 high would weaken that interpretation. I will stand aside from a long entry pending a defined reversal and risk plan.” Accept other defensible interpretations and measurable conditions.

- **2:** Numeric observation, clearly distinguished interpretation, measurable future weakening condition and reasoned decision; uses only cutoff information.
- **1:** At least three elements with no hindsight, but a vague condition or incomplete distinction.
- **0:** Uses invented later observations/fills, offers certainty from the chart, or supplies only an unsupported action.

## D. Evidence evaluation

Both forms: the claim describes the best result of a search on one sample. It motivates testing but neither proves an edge nor shows that the hypothesis is worthless. Accept: complete search history/multiple comparisons, chronological held-out evaluation, spread/fees/slippage, sample and dependence, win/loss magnitudes and expectancy, comparator/risk exposure, universe and survivorship, executable timing. Win rate alone omits payoff size. Request a specified rule, complete outcomes and suitable evaluation rather than an unspecified demand for “more data.”

- **2:** At least two distinct omissions and a bounded interpretation/request.
- **1:** One concrete omission with a bounded interpretation, or two omissions without explaining what the result means.
- **0:** Treats the selected win rate as proof, dismisses all possible evidence without reasons, or gives no concrete omission.

## Scoring workflow

Two scorers independently use copied responses labeled only with participant code, form and task; conceal pre/post phase and reading behavior where practical. Record each score and reason before reconciliation. Retain both original scores and the reconciliation reason in the results record. Do not amend thresholds after seeing responses. Log suggested rubric changes for a future study version.
