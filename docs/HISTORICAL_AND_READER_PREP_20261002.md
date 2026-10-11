# Historical gallery and reader-study preparation — 2026-10-02

CA1-022 is resolved within its teaching-gallery scope. CA1-026 has a complete ready-to-run packet and remains deferred: the user confirmed that participants are unavailable. No human observations, recruitment messages or learning results were fabricated.

## Historical teaching scope

Chapter 28 retains its fictional execution cases and sparse SEC/Apple observations, then adds a reproducible AAPL/MSFT/SPY archive gallery. The three symbols and each first available monthly session in 2016 were fixed before inspecting downloaded prices. All 36 cells remain in the selection ledger, including skips and unresolved cases. Five preceding closes, the cutoff and five following OHLC rows allow a reader to reconstruct each illustrated window.

The gate compares the cutoff close with the mean of five preceding closes. Subsequent ±1% levels classify a path, giving 18 skipped, 6 favorable, 11 adverse and 1 ordinary/unresolved window. These counts document selection, not trading performance. The four class illustrations are the earliest representative in each class. No order, fill, cash account, realized return or success probability is supplied.

There was no ambiguous first resolving bar. A separate post-audit diagnostic selects the first later candle spanning both levels with an inside open: AAPL, February 5, 2016, in an originally skipped window. Its historical OHLC and two explicitly hypothetical sequences teach why a daily bar cannot determine which level came first. The diagnostic does not overwrite the original skip or become an additional original-rule outcome.

The exact selection, data, provider metadata, version, URLs and hashes are in [the historical archive](../data/historical/README.md). The depositor explicitly applies CC0-1.0; the dataset card states that prices are dividend/split adjusted. Upstream source, session boundaries/time zone and adjustment algorithm/vintage remain undocumented. The book names these limits and treats the inputs as a retrospectively adjusted educational archive, not a certified point-in-time quote feed. Depositor-stated permission is not independent certification of other persons' rights. No proprietary chart screenshots are copied.

Authoring changes are in `content/research-context.json` and Chapter 28 of `content/risk-advanced.json`. The reader edition, manuscript, evidence matrix and five new exported SVGs were rebuilt. `index.html` uses a new book asset query to refresh the changed content.

## Ready-to-run reader packet

[The protocol](READER_PROTOCOL.md) now links:

- [Form A](reader-study/FORM_A.md) and [Form B](reader-study/FORM_B.md), each with unfamiliar fictional candles, exact OHLC, constrained sizing, gap accounting, a cutoff analysis and a performance claim.
- [The scoring key](reader-study/SCORING_KEY.md), with independently recalculated answers and task-specific 0/1/2 anchors.
- [The facilitator run sheet](reader-study/FACILITATOR.md), with form counterbalancing, neutral prompts, actual exposure/timing records and two-scorer reconciliation.
- [The results record](READER_RESULTS.md), explicitly empty of participants/observations, with fields linking future misunderstandings to revisions and new-reader rechecks.

Forms have no future bars to reveal accidentally. The key is kept separate. Form A binds on cash (74 shares, net gap result −$308.40/−2.78R); Form B binds on modeled loss (93 shares, −$478.30/−2.57R). Both freeze price-risk R before the exit. These are arithmetic checks, not participant responses. [Calculation metadata](reader-study/ARITHMETIC_QA.json) records independent Decimal results and chart/table comparisons.

The forms have not been calibrated for equal difficulty. The original protocol's different pre/post time allowances and uncontrolled reading exposure limit causal interpretation; the packet requires recording those factors and reporting observations rather than estimating a population learning effect. Real-reader participation and observation-driven revision/recheck remain necessary to close CA1-026.

## Verification and actual illustrations

- Both existing numerical verifiers passed before the coordinated build. `node scripts/verify-historical.cjs` independently recalculates CSV integrity/OHLC, all 36 gates and levels, opening/range chronology, representative selection, exact authoring tables/figure values and the separate diagnostic.
- `npm run build:content`, `npm run check` and `node scripts/check-content.cjs --strict-revision` passed: 28 chapters, 68 figures, 105 glossary terms, 73 source entries, 40,010 words of section prose. The script syntax check also passed.
- Compared affected authoring paragraphs/sections with final `book.js` and manuscript. All five exported historical SVGs equal actual renderer output. No generated output was hand-edited as the lasting fix.
- Read the affected manuscript, provenance, cutoffs, classification prose and diagnostic separately from the structural checks. Corrected one draft mean before integration verification. Independent reconstruction agrees with the final values.
- Inspected all five historical illustrations and both participant charts at **300 and 760 pixels** in the native T3 browser. [The QA page](HISTORICAL_FIGURE_QA.html) contains actual output; [saved screenshot manifest](HISTORICAL_SCREENSHOTS_20261002.json) points to preserved PNGs. Candle polarity/extrema, relative-session clocks, separate panel scales and hypothetical path orders are visible.
- Visual review found that the compact line renderer omitted the “High” axis label in one four-point sequence. Enabled the existing `showAllXLabels` option for both diagnostic lines and clarified the single candle's date axis. A second coordinated correction build passed the same checks; the final diagnostic screenshot confirms both complete order labels. No shared renderer change was needed.
- The initial rebuilt Chapter 28 rendered 17 sections, 9 figures, the 36-row ledger and all new 11-row input tables in the native browser. At 390 pixels, document width was 375 pixels: no page overflow; the wider ledger remained inside a horizontally scrollable table container. The phone screenshot confirms readable historical prose and the scroll container. The desktop chapter also rendered at 1280 pixels.

The native preview disconnected during the attempted final repeat after the small axis-label correction. Final corrected geometry was inspected successfully on the QA page before that disconnection. The phone/desktop chapter integration observations above precede that correction; no final repeat or complete site sweep is claimed. This does not replace human reader validation or independently validate the archive against an exchange feed.
