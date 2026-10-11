# Chapter publication-review ledger

Updated **2026-10-03** by `claude-code-main` for ROAD-002. **Sixteen chapters and Parts 1–3 are accepted for current editorial content; 12 chapters and three part reviews remain pending.** [Batch 1](PUBLICATION_BATCH1_20261002.md), [batch 2](PUBLICATION_BATCH2_20261002.md), [batch 3](PUBLICATION_BATCH3_20261003.md) and [batch 4](PUBLICATION_BATCH4_20261003.md) record the reviewed scopes and evidence. Edition-wide release QA, source/rights review and review/version metadata remain separate dependencies; shipping labels remain draft. Earlier revision reports retain their original scope.

## How to record a review

Claim a chapter by recording its owner and `in_progress` status. When reviewing, record date, reviewer, current fingerprint, exact scope, evidence and disposition in a dated note below. Update the row only after reviewing the actual chapter and its affected outputs. Use `pending`, `in_progress`, `accepted` or `deferred`; deferred rows retain the reason and resumption condition.

Acceptance requires current prose/terminology and timing review; claim/source support; exercise, quiz and unfamiliar practice consistency; numerical reproduction; actual compact/wide figure inspection; and unresolved findings linked to the feedback queue. Record browser/print scope accurately and carry any release QA still outstanding into ROAD-004. Human reader learning remains separately deferred under CA1-026. No independent reviewer approval is mandatory; attribution must reflect who actually reviewed the files.

The 12-character fingerprints below abbreviate SHA-256 values in [the checkpoint](PROJECT_CHECKPOINT_20261003_045713.json). Each full fingerprint includes the compiled chapter and its chapter/evidence-linked source records. The checkpoint also pins shared authoring/build/runtime inputs and all generated outputs. After content or shared dependencies change, check affected reviews before reusing acceptance; copying a fingerprint or passing the schema checker cannot substitute for review.

## Current chapters

Completed batches: Chapters **1–14, 20 and 21**, plus Parts 1–3. Next batch: Chapters **15–19**, plus the Part 4 cumulative review. Inherited evidence is the appropriate earlier revision report; later focused changes and their limits are linked in the final column.

| Ch. | Chapter / stable ID | Current fingerprint | Publication status | Owner | Inherited revision evidence / later focused work |
| --- | --- | --- | --- | --- | --- |
| 1 | The language of the market / `market-language` | `39e585af9d7d` | accepted | /root (2026-10-02) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md)  [Batch 1](PUBLICATION_BATCH1_20261002.md) |
| 2 | Anatomy of a stock chart / `chart-anatomy` | `99726d7e5c81` | accepted | /root (2026-10-02) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md)  [Batch 1](PUBLICATION_BATCH1_20261002.md) |
| 3 | Volume: participation behind price / `volume` | `e26307912825` | accepted | /root (2026-10-02); re-accepted claude-code-main (2026-10-03) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md)  [Batch 2](PUBLICATION_BATCH2_20261002.md); [Batch 4](PUBLICATION_BATCH4_20261003.md) (PUB4-006) |
| 4 | Timeframes, sessions & chart scales / `timeframes` | `2dd2a6d99752` | accepted | /root (2026-10-02) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md)  [Batch 2](PUBLICATION_BATCH2_20261002.md) |
| 5 | Trends, swings & changing structure / `trends` | `38a32b563078` | accepted | /root (2026-10-02) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md)  [Batch 2](PUBLICATION_BATCH2_20261002.md) |
| 6 | Support, resistance & price areas / `support-resistance` | `05ed799ba54c` | accepted | /root (2026-10-02) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md)  [Batch 2](PUBLICATION_BATCH2_20261002.md) |
| 7 | Candlestick patterns in context / `candlestick-patterns` | `52dfd1429fda` | accepted | /root (2026-10-03) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md); [cutoff staging](PRICE_ACTION_STAGING_20261002.md)  [Batch 3](PUBLICATION_BATCH3_20261003.md) |
| 8 | Classical chart patterns / `chart-patterns` | `751502bb3621` | accepted | /root (2026-10-03) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md); [cutoff staging](PRICE_ACTION_STAGING_20261002.md)  [Batch 3](PUBLICATION_BATCH3_20261003.md) |
| 9 | Breakouts, pullbacks & failed moves / `breakouts` | `a0f8ef618394` | accepted | /root (2026-10-02) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md); [cutoff staging](PRICE_ACTION_STAGING_20261002.md)  [Batch 1](PUBLICATION_BATCH1_20261002.md) |
| 10 | Moving averages / `moving-averages` | `b39071158636` | accepted | claude-code-main (2026-10-03) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md)  [Batch 4](PUBLICATION_BATCH4_20261003.md) |
| 11 | Momentum: pace and persistence / `momentum` | `745bc4471332` | accepted | claude-code-main (2026-10-03) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md); [fresh practice](PRACTICE_TRANSFER_20261002.md)  [Batch 4](PUBLICATION_BATCH4_20261003.md) |
| 12 | Volatility: the size of movement / `volatility` | `729d7fc6239f` | accepted | claude-code-main (2026-10-03) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md)  [Batch 4](PUBLICATION_BATCH4_20261003.md) |
| 13 | Volume tools: weight, participation, and memory / `volume-tools` | `79a18cbac3f5` | accepted | claude-code-main (2026-10-03) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md)  [Batch 4](PUBLICATION_BATCH4_20261003.md) |
| 14 | Optional: Fibonacci retracement conventions / `fibonacci` | `81c1af3a14a0` | accepted | claude-code-main (2026-10-03) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md)  [Batch 4](PUBLICATION_BATCH4_20261003.md) |
| 15 | Relative strength: leading compared with what? / `relative-strength` | `23f84eef4b56` | pending | unassigned | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md) |
| 16 | Market breadth: how many are participating? / `breadth` | `6aa7fac75cd8` | pending | unassigned | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md); [fresh practice](PRACTICE_TRANSFER_20261002.md) |
| 17 | Multiple timeframes: one market, several summaries / `multi-timeframe` | `246eedc64012` | pending | unassigned | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md) |
| 18 | Events and opening gaps / `events` | `002fe4e1d436` | pending | unassigned | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md); [fresh practice](PRACTICE_TRANSFER_20261002.md) |
| 19 | Market microstructure: from a chart to an actual trade / `market-microstructure` | `370d104d5852` | pending | unassigned | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md) |
| 20 | Risk & position sizing / `risk-sizing` | `1461694d0303` | accepted | /root (2026-10-02) | [Later-chapter integration](REVISION_COMPLETION_20261001.md)  [Batch 1](PUBLICATION_BATCH1_20261002.md) |
| 21 | From chart idea to trade plan / `trade-plans` | `631604729847` | accepted | /root (2026-10-02) | [Later-chapter integration](REVISION_COMPLETION_20261001.md)  [Batch 1](PUBLICATION_BATCH1_20261002.md) |
| 22 | Psychology without market mythology / `psychology` | `00a0bc75ea75` | pending | unassigned | [Later-chapter integration](REVISION_COMPLETION_20261001.md); [follow-through](FOLLOW_THROUGH_20261002.md) |
| 23 | A journal that can teach you something / `journaling` | `3fe1c869eb67` | pending | unassigned | [Later-chapter integration](REVISION_COMPLETION_20261001.md) |
| 24 | Evidence before conviction / `testing` | `7fbaf6d579a2` | pending | unassigned | [Later-chapter integration](REVISION_COMPLETION_20261001.md) |
| 25 | Statistics for a skeptical chart reader / `statistics` | `feb2ab1ce407` | pending | unassigned | [Later-chapter integration](REVISION_COMPLETION_20261001.md) |
| 26 | Designing a complete trading system / `system-design` | `288d51c9dd0c` | pending | unassigned | [Later-chapter integration](REVISION_COMPLETION_20261001.md); [follow-through](FOLLOW_THROUGH_20261002.md) |
| 27 | Optional: Dow, Wyckoff, and Elliott, read critically / `classical-frameworks` | `2af70744e750` | pending | unassigned | [Later-chapter integration](REVISION_COMPLETION_20261001.md) |
| 28 | Case studies: follow the decision through / `case-studies` | `854967c1e29d` | pending | unassigned | [Later-chapter integration](REVISION_COMPLETION_20261001.md); [historical gallery](HISTORICAL_AND_READER_PREP_20261002.md) |

The [critical re-audit resolution](AUDIT_RESOLUTION_20261002.md) and [source audit](SOURCE_AUDIT_20261002.md) apply across these groups. They document their actual checked snapshots; consult the [resolution history](FEEDBACK_RESOLVED.md) for complete findings and later reopenings.

## Cumulative review acceptance

| Part | Review tasks | Publication status | Owner | Inherited evidence |
| --- | --- | --- | --- | --- |
| 01: Start with the foundations | 3 | accepted | /root (2026-10-02); re-accepted claude-code-main (2026-10-03) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md)  [Batch 2](PUBLICATION_BATCH2_20261002.md); [Batch 4](PUBLICATION_BATCH4_20261003.md) |
| 02: Read the story of price | 3 | accepted | /root (2026-10-03) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md)  [Batch 3](PUBLICATION_BATCH3_20261003.md) |
| 03: Look beneath the surface | 3 | accepted | claude-code-main (2026-10-03) | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md)  [Batch 4](PUBLICATION_BATCH4_20261003.md) |
| 04: See the bigger picture | 3 | pending | unassigned | [Teaching acceptance](TEACHING_ACCEPTANCE_20261001.md) |
| 05: Build a repeatable process | 3 | pending | unassigned | [Later-chapter integration](REVISION_COMPLETION_20261001.md) |
| 06: Question, test, refine | 3 | pending | unassigned | [Later-chapter integration](REVISION_COMPLETION_20261001.md) |

Part-review fingerprints in the checkpoint include the part definition, complete tasks and constituent chapter/source fingerprints. This pins both the task inputs and the teaching dependencies.

## Dated publication-review records

### Batch 1 — /root, 2026-10-02

Claimed scope: connected prose, terminology, information timing, material claims and primary-source passages, all chapter exercise/practice/quiz answers, numerical reproduction, all 11 figures at 260/760px and actual native browser content at 1280/390/320px. Full chapter/source fingerprints below belong to [the current checkpoint](PROJECT_CHECKPOINT_20261002_215718.json). The [batch report](PUBLICATION_BATCH1_20261002.md) links nine source URL inspections, 139 independent numerical comparisons, actual figure rasters, 15 route/viewport checks and complete table/keyboard checks. Generated manuscript content was verified against source.

| Chapter / stable ID | Full fingerprint | Findings and disposition |
| --- | --- | --- |
| 1 / `market-language` | `39e585af9d7d300bca78b8c4ec87c475a18a8a4cb5c84c8bcda3baf93d8963b0` | Technical/fundamental distinctions, quotes, returns, sizing, gap losses and hypothetical expectancy checked; accepted without additional correction. |
| 2 / `chart-anatomy` | `99726d7e5c814c61b7797dfff884d34ef70f05a56808d28b8002b505bc42cead` | OHLC geometry, color/return, settings and summary-equivalent routes checked; accepted without additional correction. |
| 9 / `breakouts` | `a0f8ef618394df0351b2e0d41c7ae0733f64ae3a213e0dac34cc1bb93f6cde46` | Threshold/timing, packet boundaries, lower-fill accounting and tape classification checked; PUB1-001 resolved with paired complete tapes and unfamiliar practice. Accepted. |
| 20 / `risk-sizing` | `1461694d0303b6d56f93bba7b4edca480168c4b833d226e4ae5bb499d30e5d35` | Cash/cost budgets, portfolio stress, compounding/recovery and R checked; CA1-024 resolved by separating pre-entry estimates from filled-position R. Accepted. |
| 21 / `trade-plans` | `63160472984777838a1c865bfb1bcb28b44a1ab15cae2e885995d262b9989163` | Plan completeness, ordinary/partial accounting and exception priorities checked; AUD2-002 resolved for a halted S10 deadline with three independently calculated reopening branches. Accepted. |

Remaining dependencies for all five: ROAD-003 edition-wide source/data-rights review; ROAD-004 native printer pagination, new-task page layout and broader browser release coverage; ROAD-006 accurate shipping review/version metadata. Bulk disclosure/quiz checks used DOM activation; two new solutions were opened with native keyboard Enter. Post-build preview snapshot/save and one pointer attempt failed and are not evidence of screenshot/pointer QA. CA1-026 remains deferred: zero human participants or observations. No part review was accepted in this batch.

### Batch 2 — /root, 2026-10-02

Claimed scope: connected prose/definitions/timing; all material source claims and worked exercise/practice/quiz answers; independent arithmetic and strict swing/threshold reproduction; all nine actual figures at 260/760px; desktop native browser and phone-width native child-frame content/disclosures/tables/feedback. [The report](PUBLICATION_BATCH2_20261002.md) links 177 numerical comparisons, 11 original source URL passage checks, 18 rasters and native browser/keyboard evidence. Full fingerprints belong to [the batch 2 checkpoint](PROJECT_CHECKPOINT_20261003_030323.json).

| Chapter or part / stable ID | Full fingerprint | Findings and disposition |
| --- | --- | --- |
| 3 / `volume` | `7bec635fca7aeb6808c6cc405a1d5b021d9100cbc7a1058bec539909e94e842c` | Volume counts/value, frozen and matched-time denominators, direction/activity/liquidity and all answers/figures checked; accepted without prose correction. |
| 4 / `timeframes` | `2dd2a6d99752d60451375a2783bf2f57697e9129e1aeeeae50347d0a390fb357` | Aggregation, session/scale/adjustment units, provisional inputs and all answers/figures checked; accepted without prose correction. |
| 5 / `trends` | `38a32b5630782592f5203b27abb91a781a5d8226e5f45c96cfc00b3230b2798d` | All strict swings and recognition cutoffs, anchor availability, line/structure distinction and all answers/figures checked; AUD2-018 label occlusion corrected. Accepted. |
| 6 / `support-resistance` | `05ed799ba54c8ab48b2b51baa7c2eca545743f821de438a73f27faa9b9731e95` | Cutoff trough construction, frozen zone, reaction/buffer/equality and execution distinctions, all answers/figures and bounded FX claim checked; PUB2-001 source locator corrected. Accepted. |
| Part 1 / `foundations` | `191f47b6f44fd5e329ed5bb164090ea052e89c0d9a239dea2ee305a35b4961e8` | All three unfamiliar candle, activity and split tasks checked against complete inputs and worked answers. Chapters 1–2 remain unchanged from batch 1; Chapters 3–4 reviewed here. Accepted. |

Remaining dependencies: ROAD-003 edition-wide source/data-rights dispositions, ROAD-004 native printer and broader release coverage, ROAD-006 shipping metadata, and deferred CA1-026 human participation. Top-level phone resizing timed out, so phone checks used measured 390/320px native child frames; snapshot/save failed. These limitations are preserved in the report. Native keyboard Enter opened the Part 1 solution and Chapter 6 continuation. Five previous accepted chapter fingerprints remain unchanged. No human learning or whole-publication approval is claimed.

### Batch 3 — /root, 2026-10-03

Claimed scope: full Chapter 7–8 prose, definitions, timing, material source claims, exercise/practice/quiz consistency, independent numerical reconstruction, all eight actual figures at 260/760px, and all three Part 2 tasks. [The report](PUBLICATION_BATCH3_20261003.md) links 315 Decimal comparisons, seven primary passage inspections and one NBER retrieval failure, 16 rasters, nine native browser route/width checks and 146 manuscript checks. Full fingerprints belong to [the batch 3 checkpoint](PROJECT_CHECKPOINT_20261003_041428.json).

| Chapter or part / stable ID | Full fingerprint | Findings and disposition |
| --- | --- | --- |
| 7 / `candlestick-patterns` | `52dfd1429fda68811d29288c3395df86f16f8604c8a16d0f1c2725a16aeeee7c` | Measured shape/context/follow-up distinctions, valid/near-miss geometry, strict body engulfing, fresh task, answers and cutoff staging checked. PUB3-001 corrects both source locators to printed slide 41/PDF index 40. Accepted. |
| 8 / `chart-patterns` | `751502bb362100dc01902c5698b56e920090efbe0bd759e4fb2ffa9ff0ba2d7e` | Strict swings/recognition, tolerance/spacing, completed versus invalidated branches, target horizon, boundary families and dated necklines checked. PUB3-002 distinguishes exact mirrors from the separately supplied alternative. Accepted. |
| Part 2 / `price-action` | `dcedad8d535b8d50f1a9d08ebf8e383bd7833de4faa1ed3490e0aacc3073ab98` | All three unfamiliar tasks and complete answers checked: area versus signal, opening ceiling/skip versus chart failure, frozen-R accounting and unknown intrabar exit order. Constituent Chapters 5/6/9 retain prior accepted fingerprints. Accepted. |

Remaining dependencies: ROAD-003 edition-wide access/rights review, including the current NBER retrieval failure; ROAD-004 native printer and broader release coverage; ROAD-006 shipping metadata; deferred CA1-026 actual human participation. The original author-hosted study supports the limited research claim despite NBER retrieval failure. Browser checks use a 390px native top-level viewport and 320/1280px same-origin native child frames after resize failure. Native Enter opens Chapter 8 continuation and, after an initial failed press and explicit-tab retry, the first Part 2 solution. Snapshot/save failed; no native printer acceptance or human learning is claimed. All nine prior chapter acceptances and Part 1 remain unchanged.

### Batch 4 — claude-code-main, 2026-10-03

Claimed scope: full Chapter 10–14 prose, definitions, timing, material source claims, exercise/practice/quiz consistency, independent numerical reconstruction, all nine Part 3 figures at 260/760px, and all three Part 3 tasks. The report also covers the rechecks of Chapter 3 and Part 1 triggered by PUB4-006, and the renderer-wide PUB4-005 effect. [The report](PUBLICATION_BATCH4_20261003.md) links 552 Fraction/Decimal comparisons, 15 primary source pages, 26 rasters and native top-level browser checks at 1280/390/320px. Full fingerprints belong to [the batch 4 checkpoint](PROJECT_CHECKPOINT_20261003_045713.json), which also documents the fingerprint formulas.

| Chapter or part / stable ID | Full fingerprint | Findings and disposition |
| --- | --- | --- |
| 3 / `volume` | `e26307912825b4f7ebe158124915b5d8e12fbc14f7220939e12d7d35b22b517f` | Re-accepted. PUB4-006: the compact D6 marker was hidden by the label fallback; one chart label now, both ratios in the caption. PUB4-005 axis floor applied to both figures. Prose, tables and answers unchanged from batch 2. |
| 10 / `moving-averages` | `b390711586369320abbef5ca3b397958c5354cf363c56766d6dfb1a69a87599f` | SMA/EMA initialization, first state versus crossover, session-8 recognition, seven range switches, two-close filter and fresh three-SMA task checked. PUB4-002 corrects “three averages”. Accepted. |
| 11 / `momentum` | `745bc4471332fc3bb37df43fb8192b1aacdc1f9c82197696d52e1d407ef74b20` | ROC with disclosed history, one-neighbour peak recognition, Wilder RSI seed/update, full-history 12/26/9 MACD (all 18 points and four checkpoints) and fresh initialized-state task checked. PUB4-003 removes the repeated snapshot. Accepted. |
| 12 / `volatility` | `729d7fc6239f0f94144c8bccb8d48d1d6a94584d2ec2c1fd73654c0828b08ec2` | True range, ATR update, sizing bridge, population-SD bands and bandwidths checked; seeds and denominators disclosed as conventions. PUB4-004 fixes the notched candle. Accepted. |
| 13 / `volume-tools` | `79a18cbac3f5f1baf7798d4ed80a6e3168d47441ffae1f930d34077fb5486764` | Transaction VWAP, profile/point of control, bin merge, OBV equal-close rule and tied-POC task checked. PUB4-005 axis and PUB4-008 locators/source list corrected. Accepted. |
| 14 / `fibonacci` | `81c1af3a14a07ae1b44ab564a0b6fcbe3ef4af230969e0c47d3047e10020e826` | Anchors, confirmation timing, window-boundary disclosure, fixed reaction test, extension and fresh anchor-policy task checked. PUB4-001 completes the near-touch accounting; PUB4-007/008 fix labels and evidence attribution. Accepted. |
| Part 1 / `foundations` | `dc0455a59497…` (see checkpoint) | Re-accepted: tasks unchanged; constituent Chapter 3 re-accepted above. |
| Part 3 / `indicators` | `6e30dde5ad91…` (see checkpoint) | SMA/ROC position-versus-change task, computability classification with tape reconciliation, and MACD/RSI statement audit checked against complete answers. Accepted. |

Remaining dependencies: ROAD-003 edition-wide access/rights review; ROAD-004 native printer and broader release coverage; ROAD-006 shipping metadata; deferred CA1-026 human participation. PUB4-009 (Chapter 26) is open for that chapter's batch. Browser evidence is DOM text/geometry plus one native Enter press; no screenshots, pointer tests or printer output. Other prior chapter acceptances are unchanged. Part 2's fingerprint is recomputed under the documented part formula, and its constituents are unchanged.

### Record template

Append records using the following fields; preserve prior evidence after a change.

- Chapter/part and stable ID:
- Reviewer, date and claimed scope:
- Full current fingerprint and applicable checkpoint:
- Prose, definitions and information-timing findings:
- Material claims and inspected source passages:
- Reproduced numerical examples and exercise/quiz checks:
- Actual figure/browser/print inspection and its coverage limits:
- Feedback IDs, resolutions and still-deferred issues:
- Disposition, remaining release dependencies and reason:
