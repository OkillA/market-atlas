# Teaching acceptance pass — 2026-10-01

Historical acceptance report. The subsequent selected-study/source audit is recorded in [SOURCE_AUDIT_20261002.md](SOURCE_AUDIT_20261002.md); use [FEEDBACK.md](FEEDBACK.md) for the current open queue. Inspection dates and limits below describe this pass.

Owner: `/root`. Scope: substantive review of chapters 1–19, the first four part reviews, and whole-book teaching criteria after the [chapters 20–28 completion](REVISION_COMPLETION_20261001.md). Read `AGENTS.md`, the active queue, resolution history and content conventions before implementation; checked the queue again before disposition. No additional reviewer or human participant is claimed.

The source was preserved in `/Users/arun/test_projects/market-atlas-before-acceptance-20261001.tar.gz`. Chapters remain draft: this pass establishes reviewed teaching representations and reproducible examples, not complete research-source certification or demonstrated human learning.

## Corrections made

- The shared renderer treated an explicit baseline `line` as bars whenever its containing chart was `bars`. It now honors the series style. The volume baseline and MACD zero reference are lines; bar quantities remain bars.
- Dense annotations used a fallback that could overlap existing boxes. At 300px, the trend and momentum figures lost label text. The fallback now searches for an unoccupied position. All 126 renders of the 63 figures at 300/760px have non-overlapping annotation boxes. Actual corrected figures were inspected as images.
- Chapter 9 permitted lower opening entries but described 1R as a universal $100. It now freezes `50 × (filled entry − $48.80)`. At $50.80, 1R remains $100; at $50.40 it is $80. The $5 charge is split $2.50/$2.50, with maximum entry cash reserve $2,542.50. A new lower-entry task gives +$215/+2.6875R at target and −$85/−1.0625R at the ordinary stop. Existing maximum-entry and skipped-main-path results are unchanged.
- Added complete raw close tables for swing detection, zone construction, the double-top prefix and its separate reveals, momentum initialization/ROC, and Fibonacci anchors. The standalone manuscript now supplies exact inputs without requiring the browser's expandable data.
- Split the candle confirmation/failure diagram into two independent branch panels. The previous flat arrow sequence visually placed branch B after branch A.
- Added partly completed zone/candidate worksheets and a fresh Fibonacci anchoring exercise. The fresh case freezes anchors by T6, compares levels $74.202/$77.91 and identifies the later $78 near-touch and $80 rebound under the stated rules.
- Replaced the volume quiz's unsupported “double trade sides” number with the plausible included-current-session denominator error: 1.68 instead of 1.9444.
- Spaced compressed reader-facing formulas, dates, values and branch references. Clarified candle-geometry wording and the dated mirrored neckline. Updated the content guide's renderer and verification instructions.

All lasting content changes are in `content/foundations-price.json` and `content/indicators-context.json`; renderer changes are in `figure-renderer.js`. Later authoring and research-context files were preserved. One shared rebuild generated `content/book.js`, the manuscript, evidence matrix and SVGs.

## Numerical and teaching review

Read every early chapter's prose, outcomes, main exercise, worked solution, guided/independent tasks and quiz feedback. Recalculated the supplied examples and examined the corresponding diagrams. The independent [verification script](../scripts/verify-early-chapters.cjs) records 524 comparisons; it reconstructs the series from prices/quantities rather than accepting plotted indicator values as ground truth.

| Chapter | Checked calculation or decision | Verified representation |
| --- | --- | --- |
| 1 | $40→$46 +15%; reverse −13.0435%; 47-share ordinary/gap losses $98.70/$239.70; invented expectancy +$0.30/−$0.60 | Description path and analysis sequence |
| 2 | Body 5, upper 3, lower 2, range 10; two ordered routes yield −$1/+ $7 with identical OHLC | Candle geometry and separate ordered routes |
| 3 | Prior five-session mean 1.0m; noon mean 0.36m; matched ratio 1.9444; exact traded value $14,030 | Aligned price/volume panels, frozen baseline, unfinished-session comparison |
| 4 | Aggregate O100/H108/L98/C101/V370,000; 100×80 = 200×40; split-adjusted units unchanged | Same data on linear/log scales, daily/weekly candles, corporate-action table |
| 5 | All eight strict two-neighbor swings and their recognition dates; slope $0.60/session; D10 projection $45.40; transition known D19 | Named anchors, availability-masked line, staged recognition and contrast |
| 6 | Troughs D3/D7/D11; span $0.55; zone $39.80–$40.35; buffered break below $39.50; $1.20 reaction | Separate construction/reveal panels, shaded zone, close/wick counterexample |
| 7 | Doji ratios 5%/50%; lower-tail/body 3.75/1.375; body engulfing without full-range engulfing | Actual candles, near misses, context and independent continuation branches |
| 8 | Peak difference 0.8333%; six-step separation; recognition D11; D12 completion/invalidation; projection $48 not reached | Core candidate/completed/invalidated states; retained family small multiples and mirrored/sloped necklines |
| 9 | Signal D9; skip at $52.20 next open; failure only at later close; entry-cost and filled-risk accounting | Shared close path and gap candles; no fabricated trade for a skip |
| 10 | Every five-session SMA/EMA value; SMA seed; seven range switches; two-close filter delays main recognition to D9 | Trend/range panels, crossover and whipsaws |
| 11 | All five-session ROC, 12/26 SMA-seeded EMA/MACD, nine-valid-value signal and histogram values; RSI 80→61.5385; peaks known D13/D15 | Aligned price/ROC and MACD/signal/histogram panels |
| 12 | TR $7 versus range $3; ATR update $11/3; population SD √(8/3); every three-close band | Gap candles and separate dispersion/band path |
| 13 | Each cumulative VWAP, total $20,200/1,700; profile $12 row 600; every OBV addition including unchanged close | Same tape panels, actual volume-by-price histogram, OBV table |
| 14 | Both main grids, availability after D7, failed rebound; fresh anchor recognition and fixed near-touch/rebound rules | Optional bounded anchor-comparison chart and complete input table |
| 15 | All stock/sector/market relative indices; absolute −10/−15/−20%; relative +5.8824/+12.5% | Price paths and benchmark ratios with separate units |
| 16 | Every weighted-index value and daily advance/decline/unchanged count; final index 104.8 versus equal-weight 100 | Constituents/weights/input table and derived index/A–D panels |
| 17 | Completed weekly value changes only at 5/10/15; daily rise at 11 conflicts with completed 105→103 | Synchronized daily/weekly step chart, availability table and completion timeline |
| 18 | Gap −17.3077%; intraday +6.9767%; close-to-close −11.5385%; planned/gap losses $400/$900 | Actual overnight gap candles and before/after note |
| 19 | 100@$50.10 + 150@$50.20 = $12,540; mean $50.16; remaining asks 0/50/300; round-trip loss $65 | Quantity-constrained order-book ladder and separate spread contrast |

Parts 1–4 were reviewed substantively, including their supplied assumptions and worked reasoning. Recalculated the unfamiliar $80 OHLC case, volume/split tasks, buffered breakout/ambiguous-exit task, new SMA/ROC path, and context clock/participation/fill reconciliation. The earlier execution/loss/expectancy primer supplies the assumptions needed before detailed sizing. Optional Fibonacci/frameworks and inference branches remain identified. Taught swing/zone/pattern rules demonstrate exclusions and alternative policies before asking readers to design their own.

The sustained-reading review found specific cautions attached to the current measurement, with demonstrations now carrying the teaching: selected/rejected swings, construction/reveal zones, retained pattern branches, crossovers, tape/profile arithmetic, timestamps and fills. The earlier generic caveat-heavy structure has been replaced by these examples and the verified later records. No minimum word count or extra indicator catalogue was imposed. Section prose varies from 960 to 2,946 words; the narrower optional Fibonacci chapter has 976, compared with 2,313 for statistics and 2,946 for system design. Momentum and events titles describe the developed scope; volume profile is actually illustrated. These are editorial acceptance judgments, not reader-study results.

## Render, build and browser evidence

Inspected all 39 early-chapter figures at 300/760px using Quick Look raster renders, contact sheets and individual panel renders. Re-inspected corrected trend/momentum labels, separate candle branches, volume baseline, OBV/constituent/book tables, profile bars and chronology. Checked six statistics/system diagrams for regressions. Comparing old/new renderers against unchanged later figure specifications found two affected 300px diagrams: system equity/slots and the Wyckoff spring/breakdown branch. Both final images were inspected. All 63 exported SVGs exactly match the compiled data rendered at 760px.

Commands passed:

```sh
node scripts/verify-early-chapters.cjs
node scripts/verify-revision.cjs
npm run build:content
npm run check
node scripts/check-content.cjs --strict-revision
node --check app.js
node --check figure-renderer.js
node --check scripts/verify-early-chapters.cjs
```

Build: 28 chapters, 63 figures, 105 glossary terms, 69 source entries, 38,545 section-prose words. One rebuild in this acceptance pass.

[Browser results](ACCEPTANCE_BROWSER_QA_20261001.json) record every chapter and all six practice routes at 390×844 and 1280×800. All expected figures/solutions render; answers start collapsed and open; figure data opens; all 84 option-specific feedback strings match at each width; no page-level horizontal overflow or invalid SVG geometry. Navigation/resize/evaluation worked through the T3 collaborative browser. Native snapshot and click tools failed, so interactions used DOM summary/button clicks via `preview_evaluate`. No final browser screenshot or native pointer test is claimed; raster SVG review supplies the visual evidence.

Final manuscript SHA-256: `62b94951b0c26c4a8bc6e0a9916a4045fb0bcd10870dde9ace9cf7df1f040e37`.

## Disposition and remaining work

Resolved after this pass and the retained later-chapter verification: **CA1-009, CA1-010, CA1-011, CA1-013, CA1-014, CA1-015, CA1-016, CA1-017, CA1-025**. The [resolution history](FEEDBACK_RESOLVED.md) preserves each complete original finding and its individual resolution evidence.

Remaining active items:

- **CA1-018:** broaden and verify the empirical synthesis, with sample/rule/comparator/cost/result/limitations aligned to each material claim.
- **CA1-019:** finish early-chapter, inherited-research and glossary source alignment. This pass adds transparent arithmetic evidence, not independent certification of every link or factual claim.
- **CA1-022:** extend the small documented historical extracts into systematically selected real cases with suitable reuse rights and chronological information cutoffs.
- **CA1-026:** run the existing reader protocol with actual participants and record resulting changes. No participants or observations were fabricated.

The next content task is CA1-018/019 evidence alignment, followed by historical transfer cases and target-reader validation. Publication features remain a later choice.
