# Indicators and context revision report

Author: /root/indicators_context. Date: 2026-10-01.

Owned artifacts: `content/indicators-context.json` and this report. Read AGENTS.md, the full initial feedback queue, CONTENT_GUIDE, and REVISION_SCHEMA before editing; re-read the current feedback queue before completion. No shared renderer, build output, manuscript, or feedback tracker was edited or rebuilt.

## Coverage and editorial changes

All ten chapters retain their stable IDs and draft status. Each now has concrete outcomes, taught prerequisites, a complete solution to its revised main exercise, one guided and one independent practice task, and per-option quiz feedback. Questions use plausible calculation/timestamp errors rather than obvious guarantee language. Generic end-of-chapter caveats were replaced with actual analytical sequences and topic-specific limitations.

Learning prose/questions/solutions total 12,660 words, excluding tables, captions, glossary, evidence records, and part reviews. Per-chapter counts: moving averages 1,265; momentum 1,437; volatility 1,242; volume tools 1,233; Fibonacci 1,263; relative strength 1,210; breadth 1,210; multiple timeframes 1,233; events 1,272; microstructure 1,295. There are 20 chapter practice tasks, six part-review tasks, 37 classified evidence records, and 35 glossary entries including explicit abbreviation aliases.

| Finding | Owned contribution |
| --- | --- |
| CA1-006 | Completed weekly data use `style:step`, with changes only at sessions 5, 10, 15 under post-close sampling. Annotations target that series. |
| CA1-009 | MA trend/range panels; price/ROC and MACD/signal/histogram panels; true-range candles and separate bands; OBV table/VWAP tape/profile; stock/sector/market and ratio panels; constituent-derived weighted index and breadth; synchronized timeframes; opening-gap candles; order-book ladder. |
| CA1-010 | Main figures, tables, prose, examples, and exercises share their supplied data. Remaining contrasting datasets have an explicit instructional purpose: RSI hand arithmetic, range whipsaws, dispersion versus gap, daily OBV versus transaction tape, changing spreads versus a static book. |
| CA1-011 | Demonstrated anchor windows, peak selection/recognition, equality/tolerance choices, and failure classification precede independent error diagnosis. |
| CA1-013 | Outcomes/prerequisites and calculation-first practice remove unstated strategy-design demands. Context reviews connect participation, timestamps, gaps, and executable assumptions. |
| CA1-014 | Fully specified numerical observation records replace short vignettes; event before/after note and static-book fill record identify cutoffs and modeled fills. |
| CA1-015 | Ten complete exercise solutions, 20 graded chapter tasks, and six cumulative part-review tasks have intermediate work and units. |
| CA1-016 | Revised quizzes diagnose denominator, weighting, initialization, price-field, and recognition-time mistakes, with three option-specific explanations. |
| CA1-017 | Replaced repetitive generic testing/uncertainty conclusions with actual data walkthroughs; retained specific limitations at the point they matter. |
| CA1-018 | Local claims remain definitions, arithmetic, mechanisms, and original teaching rules. Empirical momentum/Fibonacci efficacy synthesis belongs to the root’s separately assigned review; these chapters do not fabricate or duplicate it. |
| CA1-019 | 37 evidence records identify checked claim, classification, source IDs, exact heading/line/page, checked date, and limits. Original arithmetic has derivations rather than decorative citations. |
| CA1-024 | Expanded entries are canonical; SMA/EMA/RSI/ATR/VWAP/OBV/A-D abbreviations explicitly cross-reference them. Added profile/point-of-control/IOC entries consistent with prose. |
| CA1-025 | Titles narrowed to “Momentum: pace and persistence” and “Events and opening gaps.” Fibonacci is marked optional with an explicit core-path bypass; retained profile is actually taught and illustrated. |

The root still owns tracker disposition and final cross-book verification. These are local implementation contributions, not a claim that every whole-book finding is already closed.

## Calculation and source QA performed

- Recomputed every full-window SMA and SMA-seeded EMA in the main 12-close series. One main downward crossing occurs at 8; seven range crossings at 6–12. Requiring two new-side closes removes those range events and delays the main event to 9.
- Recomputed 18 ROC points and conventional MACD/signal/histogram from 36 disclosed prior $50 closes. MACD first exists at full-history close 26 and signal at 34 under the stated seeds. Checked RSI gain/loss seed and recursive update, and confirmed the selected price peaks at 12/14 become known at 13/15.
- Recomputed gap true range max(3,7,4)=7, ATR update 11/3, opposite-direction counterpart, and every three-close population-variance Bollinger band. Checked session-6 mean/SD/bands and price-only scaling arithmetic.
- Summed the 12-trade tape: $20,200 traded value / 1,700 shares = $11.882353. Profile rows sum to 1,700, with $12 row 600. Checked each OBV addition, including unchanged close.
- Recomputed stock/market and stock/sector ratios, percentage-point differences, every weighted-index value, and each daily versus since-start breadth count. Index end 104.8 differs from equal-weight end 100 as specified.
- Verified completed weekly values change only at 5/10/15, and the session-11 conflict does not import the session-15 finish.
- Checked event −17.3077% opening gap, +6.9767% intraday, −11.5385% close-to-close, and $400 planned versus $900 assumed gap loss. Checked the multiplicative chaining of returns.
- Checked the ladder: 100@$50.10 + 150@$50.20 costs $12,540 / 250 = $50.16; residual asks 0/50/300; modeled sale at $49.90 gives $65 price loss. Midpoint and first-ask cost references give $40 and $15.
- Validated owned JSON fields, figure kinds, series dimensions, nullable warm-up, finite numeric values, OHLC geometry, table column counts, annotation indices/series, quiz feedback, source references, and practice levels. No shared build was run.

Primary material was inspected for the specific facts recorded: Fidelity’s SMA/EMA/ROC/RSI/MACD/ATR/Bollinger/OBV/relative-ratio/Fibonacci definitions; TradingView’s EMA multiplier, RSI RMA construction, bar-VWAP calculation/reset, profile histogram/lower-timeframe method, and higher-timeframe confirmation; Fidelity’s A/D definitions; SEC/Investor.gov order mechanics, routing/quantity/time issues, extended-hours news/liquidity, split and distribution distinctions; NYSE auction indications. The new SEC order-details record points to the actual three-page PDF, with stop-limit and IOC passages on printed pages 2 and 3. The evidence records state what those passages support, without treating provider interpretation sections as independent efficacy research.

## Integration checks and remaining limits

Rendered SVG/browser/print inspection remains for the integrating agent. In particular, inspect annotation collisions in panel/candle figures, cent-level precision in the supplementary spread chart, profile orientation, table widths, and right-continuous step placement. Authoring/schema arithmetic checks do not substitute for that visual verification.

All numeric teaching data remain fictional. Static order-book fills are explicitly modeled, not inferred from historical candles. The fixed-weight four-stock index is a teaching aggregation, not a real index reconstruction. Small-window parameters, peak/equality/tolerance rules, and flat-RSI convention are marked local choices. Historical cases and empirical efficacy review are outside this delegated file’s scope and remain with the root. No human target-reader learning validation was claimed.
