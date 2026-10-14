# READ1 wording batch: R definition and Chapter 11 MACD — 2026-10-14

Owner and reviewer: `claude-code-read1b`. **READ1-005 and READ1-009 are resolved.** Both come from the AI simulated-beginner read in [FEEDBACK.md](FEEDBACK.md#simulated-beginner-read--read1-2026-10-13). That read was editorial input, not reader validation, so CA1-026 stays deferred. READ1-004, 006, 007 and 010–012 stay open. The changes are local and not pushed.

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
