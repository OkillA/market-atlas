# Prompt for a research and textbook-writing agent

Copy the following prompt to an agent with browsing and file-writing access. Give it this project folder. It can work on one book part at a time; separate writers should own separate files, followed by an independent editorial review.

---

You are writing and reviewing **Market Atlas**, a substantial nonfiction textbook about technical analysis, primarily for stocks. Project: `/Users/arun/test_projects/market-atlas`.

The reader knows basic investing but is new to technical analysis. They want to learn from fundamentals through advanced practice. The format is a guided book with a searchable reference. Content quality, connected prose, accurate examples, and explanatory illustrations matter more than webpage features.

Read `README.md`, `docs/CONTENT_GUIDE.md`, `docs/EDITORIAL_ROADMAP.md`, and the relevant chapter JSON. Start by assessing the existing draft, then deepen it. Preserve stable chapter IDs and the established part structure. Edit only the authoring file(s) assigned to you. Do not edit generated `book.js` or redesign the website.

Produce textbook chapters, not brief encyclopedia summaries or trading tips. Aim for 2,000–4,000 useful words per substantial topic, without padding or repetitive disclaimers. Introduce an interesting question, explain concepts step by step, define new terms at first use, connect ideas across chapters, and use concrete examples. Put qualifications exactly where they affect interpretation.

Coverage is organized into six parts:

1. **Foundations:** what charts record; OHLC; candles versus lines/bars; volume; timeframe; sessions; chart scales; corporate-action adjustment; observation versus interpretation.
2. **Price structure:** swings, trends, ranges, support/resistance, candle geometry and patterns, classical formations, breakouts, pullbacks, failed moves, objective definitions and recognition timing.
3. **Indicators:** SMA/EMA; RSI/MACD/stochastics/ROC; ATR/Bollinger Bands/ADX; OBV/VWAP/volume profile; retracements and Fibonacci; inputs, formulas, warm-up, conventions, redundancy, and limits.
4. **Context:** relative strength versus RSI, sectors/benchmarks, breadth, multi-timeframe work, market regimes, earnings/gaps/corporate actions, liquidity, spread, slippage, order types, and microstructure.
5. **Risk and process:** hypothesis/trigger/invalidation/exit, position sizing, capital/exposure limits, correlation, gap risk, expectancy, drawdowns, decision records, judgment, psychology, and journaling.
6. **Advanced study:** data quality, point-in-time universes, look-ahead/survivorship/selection biases, backtesting, costs, overfitting, uncertainty, multiple testing, benchmark choice, system design, classical frameworks critically examined, and successful/failed/ambiguous case studies.

For every chapter include:

- A coherent narrative explaining what the tool measures and what it cannot establish.
- Precise formula variables and initialization/convention details where relevant.
- At least two original worked numerical examples with independently checked arithmetic.
- At least one failed or ambiguous example applying the same definitions used for success.
- Two or more meaningful illustration specifications suited to the topic, with axes, units, labels, captions, and the underlying values. A line chart alone cannot explain every topic. Use candle anatomy, histograms, distributions, order-book diagrams, or process/timing diagrams when appropriate.
- An exercise and worked answer, meaningful quiz feedback, glossary additions, prerequisites, and cross-links.
- Exact source links and a statement of what each source supports. Distinguish verified definition, practitioner interpretation, empirical result, and your own hypothetical reasoning.

Research standards:

- Browse primary sources: regulators and exchanges for mechanics, official indicator/platform documentation for calculation conventions, original research for empirical claims. Framework proponents can establish their own definitions but are not independent proof of effectiveness.
- Never invent citations, statistics, historical prices, or performance results. Do not treat a pattern name or an indicator threshold as evidence of predictive power.
- Where research disagrees, describe the disagreement and its assumptions. Where an empirical claim lacks a trustworthy source, remove it or label it an open question.
- Respect copyright and per-source usage limits. Write original prose; do not reproduce textbook chapters or proprietary chart screenshots.
- Label invented prices and fictional stocks prominently. Historical examples require appropriate data permissions and documented symbol/date/session/timezone/adjustment conventions. Show information as it was available at the time and include inconvenient cases.
- Explicitly account for execution uncertainty, incomplete bars, confirmation delays, cost models, and portfolio constraints when they affect the reasoning.

Deliver the chapter JSON according to `CONTENT_GUIDE.md`, plus:

1. An editorial review note with substantive corrections, uncertainty, and missing research.
2. An evidence matrix for every empirical trading-performance claim.
3. Additional illustration briefs and reproducible data suitable for implementation in SVG/HTML.
4. A coverage/word-count report and a list of sources actually checked, including access dates.

Run `npm run build:content` and `npm run check` after the assigned files are complete if you own the integration task. Independent reviewers should recalculate examples, verify citations and timing, and check that diagrams agree with prose. Do not declare the manuscript publication-ready merely because schema validation passed.

Finish the assigned materials rather than stopping at a plan. Keep the learning narrative engaging while remaining precise about evidence and uncertainty.

---
