# Publication review batch 2 — 2026-10-02

Chapters **3–6 and the Part 1 cumulative review** are accepted for current editorial content at the pinned revision. Together with the unchanged first batch, this records **9/28 chapters and 1/6 part reviews accepted**. Nineteen chapters and five part reviews remain pending. Shipping labels remain draft; edition-wide source/rights review, native print and broader release QA, review/version metadata and human validation have separate gates.

`/root` performed the review, corrections, one shared rebuild and verification. No independent reviewer or human learning outcome is claimed. [The acceptance ledger](PUBLICATION_REVIEW.md) and [current checkpoint](PROJECT_CHECKPOINT_20261003_030323.json) pin each chapter and the Part 1 task/dependency fingerprints. The checkpoint filename uses UTC; the review date uses America/New_York.

## Findings and corrections

**AUD2-018 reopened for Chapter 5:** The original 260px primary chart’s annotation backgrounds covered the D10 and D12 marked points and 493 of 1,000 equal-distance samples of the closing-price path. Shorter session/price labels reduce that coverage to 86 samples and conceal no marked point. At 300px the revised count is 66; at 760px it is zero. These measurements supplement actual raster inspection rather than treating geometry as reader validation. Full point descriptions remain in the SVG titles; the caption and complete swing table retain high/low and recognition dates. Price observations, line values and rules are unchanged. The earlier wrapping fixes remain intact.

**PUB2-001:** Both Osler evidence locators referenced nonexistent “Figures 1–3.” The original NY Fed PDF contains Figures 1A/1B and 2A–2D. Corrected the research-appendix and injected Chapter 6 locators in `content/research-context.json`; preserved the single-bank, three-FX-pair and stock-transfer limits. The rebuilt manuscript and evidence matrix contain the corrected locations.

Chapter 5 labels/caption were edited in `content/foundations-price.json`. Existing section, evidence and practice IDs remain stable. The only changed portable figure is `assets/figures/trends.svg`; the other 70 SVGs are unchanged. The browser book cache query was refreshed.

## Chapter and part dispositions

| Reviewed content | Scope and disposition |
| --- | --- |
| Chapter 3 Volume | Transaction counts and exact dollar value versus last-price approximation; frozen preceding-session baseline; matched-noon comparison; direction versus participation and liquidity limits. All exercise/practice/quiz answers and both actual figures checked. Accepted without additional prose correction. |
| Chapter 4 Timeframes | Interval versus horizon; exact daily-to-weekly aggregation; regular versus extended sessions; positive-price log spacing; splits and simplified dividend return; unfinished-bar timing. All answers and both actual panel figures checked. Accepted without additional prose correction. |
| Chapter 5 Trends | Strict two-before/two-after swings and ties; all eight turn/recognition dates; cutoff states; confirmed-anchor availability; line crossing versus later structural transition; smaller-rule counterexample. All answers and three actual figures checked. Accepted after the compact-chart correction. |
| Chapter 6 Support and resistance | Strict one-neighbor troughs and exclusions; frozen cluster edges/tolerance; visit/reaction, edge crossing, buffer and equality; close-versus-low distinction; trigger versus execution; bounded FX mechanism. All answers, both actual figures and the closed D12 packet checked. Accepted after the source-locator correction. |
| Part 1 review | All three unfamiliar tasks: candle geometry/returns and two ordered routes, completed versus matched-noon activity, split units versus position value. Inputs are sufficient and worked answers agree. Accepted; Chapters 1–2 retain their first-batch acceptance and Chapters 3–4 are covered here. |

The chapter sequence develops a reproducible observation, a declared comparison, delayed recognition and a frozen area. The changes address demonstrated problems; no numerical or broader prose defect was found in this batch. Existing fictional data and non-predictive teaching limits remain explicit.

## Verification evidence

[Independent Decimal checks](publication-batch2-assets/arithmetic-checks.json) pass **177 numerical comparisons**, plus strict swing/cutoff, threshold/equality and ordered-route classifications. These reconstruct the authored tables, plots and supplied prose/task values. All three documented numerical verifiers pass, including **617 early-chapter comparisons** and all 36 historical windows.

[Source checks](publication-batch2-assets/source-checks.json) record **11 original provider/regulator URLs** and inspected passage headings: Fidelity volume/chart/trend/level explanations, Investor.gov session/order pages, FINRA corporate actions, StockCharts scale/zone definitions, and the NY Fed Osler paper’s sample/distribution/order-type/conclusion passages. Descriptive provider claims do not establish performance. The chapter’s swing, cluster, buffer, timing and hypothetical execution choices remain original teaching conventions. This is current claim support for the batch, not complete edition-wide source/data-rights clearance. Earlier source access/check dates were preserved.

[Figure evidence](publication-batch2-assets/figure-manifest.json) covers all **nine figures at 260px and 760px authored widths**. Four comparison sheets and 18 rasters retain actual visual inspection; two pre-fix trend rasters preserve the finding. Quick Look rendered current shared-renderer SVGs; only square thumbnail padding was removed using the authored viewBox before resizing to authored dimensions. Prices, axes, units, ratios, candle fields, recognition flow, fixed zone and legends agree with supplied inputs. [Native occlusion measurements](publication-batch2-assets/occlusion-checks.json) confirm the revised marked points remain visible.

[Browser checks](publication-batch2-assets/browser-checks.json) cover **15 route/width combinations**: four chapters and Part 1 at three widths. The native preview’s actual desktop viewport was 1280px. Its phone resize calls timed out; 390/320px checks therefore used same-origin native browser child frames with those measured viewport widths. They are responsive content checks rather than top-level phone interaction. All narrative/task text matches the current built source; all **14 teaching tables, 104 rows and 314 cells** match, including the duplicate cutoff inputs. Solutions initially remain closed; 45 disclosure checks and 36 quiz-option feedback checks agree. All expected figures render without text-bound clips or page overflow.

[Focused checks](publication-batch2-assets/focused-browser-checks.json) record native keyboard Enter opening a Part 1 solution and Chapter 6’s continuation. Before reveal, the D12 construction inputs are complete, reference visibility is false and the later D14 reaction/D16 break are absent from visible article text. All **222 manuscript paragraph/question/solution/table-row checks** pass, including the corrected source locator.

Bulk disclosure and quiz activation used DOM calls. Snapshot/save failed; no successful batch 2 native screenshot or pointer evidence is claimed. **Native printer pagination remains unverified**, as does human learning. ROAD-004 retains the broader browser/print release matrix; CA1-026 remains deferred with zero participants.

## Build and remaining work

One coordinated shared build integrated the corrections. Normal/strict content checks and runtime/script syntax checks pass. An isolated temporary build matched all **74 generated outputs byte-for-byte**, with zero extra figure exports. Inventory remains 28 chapters, six parts, 210 narrative sections, 40,912 section-prose words, 65 chapter tasks, 18 cumulative tasks, 105 glossary entries, 73 sources, seven attempt packets and 71 SVGs.

ROAD-002 is ready for its unclaimed remainder. Next batch: **Chapters 7–8 and the Part 2 cumulative review**, with existing Chapter 5/6/9 acceptances supplying its reviewed context. ROAD-003/004/006 and CA1-026 remain visible; the completion of this batch does not establish a reviewed public edition.
