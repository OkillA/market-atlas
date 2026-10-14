# READ1 wording batch: R, MACD, Part 4 task and local snags — 2026-10-14

Owner and reviewer: `claude-code-read1b`. **READ1-005, READ1-009, READ1-011 and READ1-012 are resolved** (in two slices; see [Slice 2](#slice-2-read1-011-and-read1-012)). Both come from the AI simulated-beginner read in [FEEDBACK.md](FEEDBACK.md#simulated-beginner-read--read1-2026-10-13). That read was editorial input, not reader validation, so CA1-026 stays deferred. READ1-004, 006, 007 and 010 stay open. The changes are local and not pushed.

## Corrections

- **READ1-005: what R means, in plain words.**
  - Ch 9: the learning outcome now glosses "R result" as profit or loss measured as a multiple of planned price risk. The first-pass instruction now opens with a two-sentence definition: 1R = shares × (entry − initial stop), which is the loss if the stop fills exactly, before fees; net R = net P&L ÷ 1R; and "−2R means losing twice what the plan risked."
  - Ch 18: the independent gap/stop prompt now carries one-clause reminders of both formulas.
  - Ch 20: the first "1R price risk" table use is now named in the preceding paragraph, and the denominator section opens with a purpose sentence (−2.55R ≈ two and a half times the planned risk).
  - Glossary: "R multiple" now starts by stating its purpose.
- **READ1-009: Chapter 11 MACD.**
  - Prose and the momentum-2 caption now say that close numbers count the full 54-close history. Displayed session 1 is close 37, so MACD (close 26) and signal (close 34) both start inside the flat history before the charted sessions.
  - The divergence section now comes before "MACD asks a different question". The three MACD sections are contiguous, and the price/ROC figure still follows the divergence text. Section IDs are unchanged.
  - "The stock and futures studies … test the latter portfolio rules" now reads "these two portfolio rules (one study each)". This matches the appendix: one cross-sectional stock study and one time-series futures study.

## Evidence

| Check | Result |
| --- | --- |
| Arithmetic | The definitions agree with every R value in the affected chapters. Ch 9: 1R $100, −105/100 = −1.05R, +195/100 = +1.95R, −155/100 = −1.55R; lower entry 1R $80, +215/80 = +2.6875R, −85/80 = −1.0625R. Ch 18: 60 × 3 = $180, −270/180 = −1.50R, −240/180 = −1.333333R. Ch 20: −98.70/94 = −1.05R, −239.70/94 = −2.55R. Ch 11: 36 flat closes + 18 displayed = 54, so displayed session s = close 36 + s. |
| Documented checks | Early, revision and historical verifiers; normal and strict content checks; the figure gate (364 renders, 0 failures); `check:reviews` (74 identical isolated outputs, 28/28 accepted). Record: [final-checks.json](read1-wording-assets/final-checks.json). |
| Fingerprints | Four chapter fingerprints changed: 9, 11, 18 and 20. The other 24 reproduce their prior hashes. Parts 2–5 change only through those chapter dependencies; their tasks are unchanged. Record: [fingerprints.json](read1-wording-assets/fingerprints.json). |
| Figures | Only `momentum-2.svg` changed, and only in its `<desc>` caption text; there is no geometry change. The renderer hash is unchanged. |

## Acceptance carried forward

- Chapters 9, 11, 18 and 20 are re-accepted for these wording changes. Each review records a `figureRecheck` pointing to this report. Earlier substantive acceptance and the 2026-10-13 READ1 figure recheck are inherited.
- Parts 2, 3, 4 and 5 are re-accepted for the chapter dependency only.
- Section prose grows by 82 words (42,220 → 42,302). READ1-007's no-net-growth target applies to its own restructuring.

## Boundaries

- No native browser check was run. Section order was confirmed in the built manuscript and book; the reader uses the same section and `afterSection` data.
- No new reader validation is claimed.

## Slice 2: READ1-011 and READ1-012

### Corrections

- **READ1-011: Part 4 relative-strength task.** The Part 4 review now opens with "Name the benchmark before calling a stock strong". It uses fresh fictional inputs: stock $25→$27, sector ETF $80→$92, market 4,000→3,900. The worked solution gives the factors 1.08/1.15/0.975, return differences of −7 and +10.5 percentage points, and relative indexes 93.9130 and 110.7692, with ratio changes of −6.0870% and +10.7692%. It ends with a benchmark-named rewrite of "strong". The part title now reads "comparison, participation, clock, and execution". `verify-early-chapters.cjs` recomputes the values and requires the printed ones (626 comparisons).
- **READ1-012: local snags.** Each listed item is handled as follows.

| Location | Disposition |
| --- | --- |
| Ch 2 "Measure the candle…" | Close-location formula now stated before its use; the paragraph about the table now follows it and says "table below". |
| Ch 5 "therefore" | Replaced with the actual reason: the $45 trough stays above the prior $43 trough. |
| Ch 5 trendline break | Criterion stated: a completed close below the line's projected value for that session (D10 45 < 45.40). |
| Ch 6 "Harbor" | Introduced as the chapter's fictional stock in the attempt packet and at the start of the continuation. |
| Ch 7 $52 / $46.80 | Anchored: an illustrative entry after the $51.20 confirmation close, with the trigger just below the $47 candle low. |
| Ch 8 caption | Separates the core rectangle/symmetrical-triangle comparison from the catalogue panels. |
| Ch 12 "$100 budget" | Now "$100 planned loss budget". |
| Ch 20 first table | BRDG row spelled out: "BRDG plan (Ch 21–23): entry $50.60, stop $48.60". |
| Ch 21 "net $115" | Names both $2.50 charges ($120 − $5 = $115, +1.9167R). |
| Ch 22 calibration | Escalation example moved to its own section, "Escalation changes the recovery problem" (new ID; existing IDs kept). The figure follows it. |
| Ch 23 "SKIP" | Renamed KITE throughout Ch 23 and Ch 28 and in `journaling.svg`. The text now says KITE deliberately shares BRDG's boundary inputs so only its opening offer differs. Sharing those inputs is intentional, since Ch 28 applies one P1 plan to ATLS/BRDG/KITE/AMB, so the numbers were kept. |
| Ch 26 reveal | **No change.** All seven attempt packets put the chapter's explanations behind the same "Reveal continuation, explanations and complete reference" control, and the reader's mobile contents offer "Reveal continuation & contents". Ending Ch 26's reveal after the ledger would need new builder, app and print support for one chapter and would break that consistent attempt-first pattern. |
| Ch 28 MSFT rounding | The fictional counterexample was removed. One sentence keeps the precision lesson; the archived values are unchanged. |

### Evidence

| Check | Result |
| --- | --- |
| Documented checks | All seven pass, and `check:reviews` reports 28/28. Record: [final-checks-2.json](read1-wording-assets/final-checks-2.json). |
| Fingerprints | Eleven chapters changed (2, 5, 6, 7, 8, 12, 20, 21, 22, 23, 28); the other 17 reproduce their hashes. All six parts change through chapter dependencies, and Part 4 also through its new task. Record: [fingerprints-2.json](read1-wording-assets/fingerprints-2.json). |
| Figures | `journaling.svg` changed one label (SKIP→KITE); it was rendered and inspected, with no overlap. `chart-patterns-2.svg` changed only its `<desc>` caption. The figure gate passes. |
| Text | Every edited passage was read in the rebuilt manuscript. The affected arithmetic was recomputed as listed in the table above. |

### Acceptance

The eleven changed chapters are re-accepted for these wording changes. Parts 1, 2, 3, 5 and 6 are re-accepted for chapter dependency only. Part 4 is re-accepted for its new verified task. Section prose grows by 52 words, to 42,354. Narrative sections go from 210 to 211, and part-review tasks from 18 to 19. No browser check was run beyond the built manuscript and the rendered SVG.
