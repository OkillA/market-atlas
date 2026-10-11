# First manuscript review — October 1, 2026

Current project tracking: [PROJECT_STATUS.md](PROJECT_STATUS.md) and [EDITORIAL_ROADMAP.md](EDITORIAL_ROADMAP.md). The remaining-work list below is historical.

Current status: the earlier checks below describe their original snapshot. See [the 2026-10-02 gallery and reader-preparation report](HISTORICAL_AND_READER_PREP_20261002.md) for the completed historical teaching gallery, its data limits, and the prepared but unrun human-reader study.

Historical snapshot: counts and remaining work below describe the initial draft. See [SOURCE_AUDIT_20261002.md](SOURCE_AUDIT_20261002.md) and the active feedback queue for current scope and limitations.

The authors produced three separate chapter groups. Two authors then independently reviewed the other groups, splitting the indicators/context review into two sets. Integration applied the substantive and clarity corrections below. This is an initial review, not certification that the manuscript is publication-ready.

## Corrections applied

- **Trends:** removed an undefined “newest” swing low from the trendline example. The $49.50 close is below the projected line while remaining above both selected troughs.
- **Timeframes:** renamed a figure to avoid suggesting that unequally spaced plotted landmarks represented constant percentage returns at every interval.
- **Statistics:** Sharpe’s numerator and denominator now use the same excess-return series. Raw-return volatility only coincides under appropriate reference-rate assumptions.
- **Risk sizing:** replaced the order overview link with the SEC bulletin that directly explains stop-limit orders as well as market, limit, and stop orders.
- **Case studies:** revised the knowledge check to acknowledge that a no-trade outcome is established by the scenario conditions, while daily OHLC does not resolve competing intraday exits.
- **Statistics:** identified the bootstrap discussion as an introductory sketch requiring separate technical study.
- **Multiple timeframes:** removed the implication that hourly trade-price bars reveal the spread. Contemporaneous bid/ask quotes are needed for that question.
- **Market microstructure:** corrected “ten-cent spread” to match the twenty-cent worked example.

## Independent mathematical review

Reviewers recalculated the fictional examples, including:

- SMA and EMA updates; RSI initialization and updates; MACD availability under the declared seeding conventions.
- True range/ATR, Bollinger Bands, ROC, OBV, VWAP, Fibonacci levels and extensions.
- Relative performance, breadth accumulation, weekly aggregation, event returns, and order-book execution averages.
- Risk sizing, available-cash constraints, loss compounding, recovery arithmetic, expectancy, R multiples, portfolio caps, and exposure timing.
- Wilson interval for 12 successes out of 20 under the stated model: about 38.66%–78.12%.

No remaining arithmetic contradictions were identified in these checks. Every chapter remains labeled draft; review can miss errors, and fictional scenarios cannot establish strategy effectiveness.

## Reader and content verification

- Content build and schema checks pass for 28 chapters, 169 narrative sections, 83 glossary terms, 54 source entries, and 28 exported SVG figures.
- The chapter sections contain 23,835 words. Including worked examples and exercises, chapter text totals 26,337 words; these counts exclude glossary, source notes, and quizzes.
- All 28 chapter routes were rendered in the native browser at desktop and 390-pixel phone width. No browser runtime errors, duplicate element IDs, missing chapter figures, or page-level horizontal overflow were observed.
- Wide illustration data tables scroll within their own containers at phone widths.
- Screenshots were inspected for the desktop and phone home page and chapter reader. The candle experiment was also checked at 320 pixels, including equal open/close and boundary closes; a coincident-price label collision was corrected.
- Search retrieves terms within chapter prose. Glossary filtering and mobile navigation were exercised.
- Bookmark, note, and reading-progress changes persisted across a full reload. Notebook import was exercised, including preservation of conflicting note text. Temporary review notes and progress were removed after checking.
- SMA calculation and warm-up were checked against a five-observation example. Position-sizing checks covered a normal budget, a cash-limited case, a close stop, zero affordable shares, and invalid inputs.
- The standalone edition uses local classic scripts, local CSS, and local SVG; it makes no remote resource requests to read the book. Browser checks used the local HTTP server. Print output and a public-host deployment were not separately tested.

## Remaining editorial work

Deepen chapters where necessary, broaden empirical literature coverage, add worked exercise solutions, and implement more topic-specific diagram types. All stock cases are currently fictional. Any historical case studies require data permission, documented conventions, systematic case selection, and clear separation from performance evidence. See `EDITORIAL_ROADMAP.md` for the next content-focused pass.
