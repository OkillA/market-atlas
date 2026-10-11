# Publication review batch 1 — 2026-10-02

Completed the current editorial review of **Chapters 1, 2, 9, 20 and 21** under ROAD-002. All five are accepted for the reviewed chapter content at the pinned revision. The remaining 23 chapters and six part reviews have not received this publication-review acceptance. All shipping chapter labels remain draft; edition-wide source/rights review, release QA and review/version metadata remain ROAD-003/004/006. CA1-026 remains deferred with zero human participants.

Review, implementation, one shared rebuild and verification were performed by `/root`. No independent reviewer or human learning study is claimed. Full chapter/source fingerprints and current input/output hashes are in the checkpoint linked from [PUBLICATION_REVIEW.md](PUBLICATION_REVIEW.md).

## Corrections

| Feedback | Change and substantive verification |
| --- | --- |
| PUB1-001 | Chapter 9 no longer assumes a low-to-close move traded at every intermediate price. Complete A/B tapes have identical O49.30/H50.60/L49.00/C50.60, but only B contains a $50.00 touch. A fresh C/D exercise uses $72.80–$73.20 and an additional closing condition. Reconstructed each OHLC and compared actual listed trades with the area. Low-field classification remains distinct from traded touch. |
| AUD2-002, reopened Chapter 21 scope | BRDG-P1 now carries an unavailable S10 close exit forward as an overdue deadline. At the first executable resumed open, stop-gap and target-gap checks precede an overdue time exit, which precedes intraday tests. Three fresh S11 branches reconcile net/cash/R as −$45/$19,955/−0.45R; −$155/$19,845/−1.55R; +$215/$20,215/+2.15R. The inside-open bar later crosses both exits, demonstrating why those later extremes cannot replace the prior modeled opening exit. Earlier Atlas-20 fixes and ordinary BRDG/journal outcomes remain intact. |
| CA1-024, reopened Chapter 20 scope | The general R definition now separates a pre-entry order estimate from confirmed filled-position risk. Filled quantity and entry determine frozen R against the declared initial stop; costs remain outside that denominator. Existing 47-share and partial-fill values, the glossary and other sizing contracts are preserved. |

Authoring changes are limited to Chapter 9 of `content/foundations-price.json` and Chapters 20–21 of `content/risk-advanced.json`. Existing section/practice IDs remain stable; two new independent tasks have distinct titles. The two numerical verifiers now reconstruct their supplied input tapes and reopening bars. The regenerated book, manuscript and evidence matrix include the changes; all 71 SVG exports are byte-identical to the previous tracking checkpoint. The book asset query was refreshed for reader reloads.

## Chapter review scope and disposition

| Chapter | Prose, claims and practice examined | Disposition |
| --- | --- | --- |
| 1: Market language | Reading path, technical/fundamental questions, last trade versus quotes, return denominators, spread/cost/notional arithmetic, gap losses, hypothetical expectancy and all exercise/quiz answers. The fictional frequencies and plan parameters remain explicit. | Accepted; no additional content correction needed. |
| 2: Chart anatomy | Settings and developing-bar limits, OHLC/body/shadow/location encodings, color versus return, two exact summary-equivalent routes, assumed first exits, representation loss and all practice/quiz answers. The routes remain schematic, with exact fills disclosed. | Accepted; no additional content correction needed. |
| 9: Breakouts | Strict field/threshold/window/equality rules, information and execution clocks, closed Harbor packet, skip/target/stop/lower-fill branches, volume-filter limits, literal retest classifications and all practice/quiz answers. | Accepted after PUB1-001 correction. |
| 20: Sizing | Cost-inclusive versus price-risk budgets, cash/notional limits, gap losses, four-position shared-driver stress, reduced allocation, loss compounding/recovery, filled-position R and all practice/quiz answers. | Accepted after CA1-024 clarification. |
| 21: Plans | Complete BRDG-P1 order/cash/expiry/partial policies, full/partial accounting, process versus outcome, ordinary/gap/dual-touch exceptions, halted deadline and all practice/quiz answers. | Accepted after the Chapter 21 AUD2-002 extension. |

## Numerical and source evidence

[Independent Decimal checks](publication-batch1-assets/arithmetic-checks.json) contain **139 numerical comparisons** reconstructed from the current chapter inputs, plus complete-tape/OHLC and strict-threshold classifications. The documented early verifier passes **617 comparisons**; the later verifier checks the new reopening branches as well as existing accounting/statistics/Atlas-20 cases. The historical verifier passes all 36 windows and stored hashes.

[Source checks](publication-batch1-assets/source-checks.json) record current inspection of **nine distinct original provider/regulator URLs**, covering ten namespaced entries: Fidelity analysis/chart/volume pages; Investor.gov bid/ask and both order pages; StockCharts candle, support/resistance and triangle definitions. Each entry names the inspected heading, supported concepts and limits. These descriptions support terminology/mechanics; invented thresholds, fills, costs, tape examples and priorities remain teaching conventions. This is the five-chapter claim-support check, not the complete source/data-rights release audit.

## Actual figures and reader checks

Inspected all **11 chapter/attempt figures at 260px and 760px authored widths**: the market-language line/flow, candle anatomy/two route panels, Harbor full path/candles/cutoff path, loss-compounding/stress table, and BRDG candle/process flow. Prices, labels, units, legends, event order and table totals agree with the chapter inputs. [The figure manifest](publication-batch1-assets/figure-manifest.json) and five comparison sheets retain the actual raster evidence. Quick Look rasterization used the current shared renderer's SVG; only square thumbnail padding was removed before resizing to the authored viewBox dimensions.

[Native browser checks](publication-batch1-assets/browser-checks.json) cover all five routes at actual **1280/390/320px** viewports. Every narrative paragraph matches the current source; all expected figures appear; SVG text remains within its viewBox; pages have no horizontal overflow. Solutions start closed and reveal the supplied answers. All 45 sampled quiz-option feedback checks match their intended options. The Harbor reference starts closed with only two prerequisite sections visible and no $52.20 continuation token in visible article text.

[Focused checks](publication-batch1-assets/focused-browser-checks.json) compare all **16 teaching tables, 72 rows and 229 data cells**, plus headers, with authoring data at 320px. New task deep links reach their input/answer locations; native keyboard Enter opens both new solutions. The actual generated manuscript contains every reviewed paragraph, task input and worked solution.

Browser coverage limits: DOM activation was used for the bulk disclosure/quiz checks. An initial pre-build snapshot succeeded; later post-build snapshot/save and one pointer-click attempt failed through the preview client and are not claimed as screenshot/pointer evidence. Navigation, actual viewport resizing, DOM measurement and the two keyboard activations succeeded. Portable raster figure inspection is recorded separately. **Native browser printer pagination and the new tasks' printed page layout remain unverified** under ROAD-004; no PDF print or human-reader result is claimed.

## Build, tracker and next batch

One coordinated `npm run build:content`; normal and strict content checks, all three documented numerical verifiers and JavaScript syntax checks pass. A separate temporary build matched all **74 generated outputs byte-for-byte** without touching shared outputs. Current inventory: 28 chapters, 210 sections, **40,912 section-prose words**, 105 glossary terms, 73 source entries, **65 graded chapter tasks**, six reviews/18 review tasks, seven attempt packets and 71 SVGs.

The ledger and project tracker now record **5/28 chapters accepted** at their current fingerprints. ROAD-002 remains ready for its unclaimed remainder. The next batch is Chapters **3, 4, 5 and 6**, plus the Part 1 cumulative review. Feedback findings and their full closures belong in the shared queue/history; all existing human-study and release limitations remain visible.
