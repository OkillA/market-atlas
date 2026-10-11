# Historical teaching archive — CA1-022

Source: Boris Marjanovic, [Huge Stock Market Dataset](https://www.kaggle.com/datasets/borismarjanovic/price-volume-data-for-all-us-stocks-etfs), version 3. Retrieved 2026-10-02 through the public Kaggle API. This folder preserves numeric teaching inputs, not a full market-data product.

- `selection.json`: symbols, calendar, gate, observation window and representative rule recorded before price download. It is a local selection record, not an externally registered preregistration.
- `kaggle-metadata.json`: original depositor description and explicit CC0-1.0 license declaration. `kaggle-listing.json` preserves version/license/update fields from the provider API listing.
- `provenance.json`: exact individual-file download URLs, archive paths, source-file SHA-256 hashes, extract hashes/row counts and convention limits.
- `aapl.csv`, `msft.csv`, `spy.csv`: exact source decimals, with only the date range restricted to 2015-12-01–2016-12-15. Source columns are retained; no missing sessions, rounding, resampling or additional adjustment is introduced. Volume and OpenInt are unused in the exercises.
- `cases.json`: all 36 fixed symbol-month cells, 11 exact OHLC rows each, clocks, level calculations and four earliest class representatives. All cells had enough rows; none was omitted.
- `supplemental-selection.json`: explicitly **post-audit** selection of the dual-level Apple candle. It is outside the original first-touch classifications. The original February window remains skipped.

The depositor says prices are dividend/split adjusted. Adjustment formula/vintage, time zone, exact regular/extended-session aggregation and upstream source are not supplied. We preserve those unknowns. Retrospectively adjusted archive data do not establish the exact dollar prices published at an old cutoff. Familiar current survivors and a selected year do not supply an unbiased historical universe.

Reuse relies on the depositor's explicit [CC0 dedication](https://creativecommons.org/publicdomain/zero/1.0/); the API metadata also says the dataset belongs to the depositor and is offered for reuse. That is a recorded permission basis, not independent chain-of-title certification, an exchange-feed license, a data-quality warranty or an endorsement. CC0 does not waive other persons' rights. Original book diagrams use numeric observations, not copied vendor charts.

To independently locate a row, use the exact `download_url` and `archive_path` in `provenance.json`, then search its Date field. Compare the downloaded full-file SHA-256 with the recorded value; a changed source should trigger an investigation rather than silent replacement. No API key is needed for the URLs as inspected on the retrieval date. The book works offline from the preserved inputs.

Run `node scripts/verify-historical.cjs` from the project root to recalculate source integrity, OHLC bounds, all gates and levels, opening/range timing, representative selection and authoring tables/figure arrays. The verifier does not certify upstream feed accuracy or rights, inspect images, or establish profitability.

The lasting prose/figure specifications are in `content/research-context.json` and the Chapter 28 orientation/practice in `content/risk-advanced.json`. Edit those authoring sources and use the coordinated content build; do not edit generated book/manuscript/SVG outputs directly. No order, position, fill, fee, realized return or performance estimate is produced by this gallery.
