# Publication review batch 4 — 2026-10-03

Reviewer and implementing owner: `claude-code-main`. Scope: Chapters **10–14** and all three **Part 3** cumulative tasks. All five chapters and Part 3 now have current editorial acceptance. Chapter 3 and Part 1, accepted in batch 2, are re-accepted at new fingerprints because PUB4-006 changed a Chapter 3 figure. Totals: **16/28 chapters and 3/6 part reviews**; 12 chapters and three part reviews remain pending. All shipping chapter labels remain draft. No independent agent review or human learner observations are claimed.

Fingerprints are pinned in [the checkpoint](PROJECT_CHECKPOINT_20261003_045713.json). The dated records in [the publication ledger](PUBLICATION_REVIEW.md) record acceptance. Earlier checkpoints and batch reports remain history.

## Findings and corrections

Full findings, dispositions and verification for PUB4-001–008 are in [the resolution history](FEEDBACK_RESOLVED.md). PUB4-009 stays open in [the queue](FEEDBACK.md).

| ID | Priority | Location | Correction |
| --- | --- | --- | --- |
| PUB4-001 | P2 | Ch. 14 reaction test | Session 9 is exactly on A's 50% line ($110), but the prose listed only A's 38.2%/61.8% distances. Now states the test uses each drawn 61.8% line and acknowledges the A 50% touch and its failed $112 rebound. |
| PUB4-002 | P3 | Ch. 10; Part 3 task 2 | “Three averages … across lookbacks” now says two averages, same lookback, different weighting. “The volume chapter's tape” now says the volume-tools chapter. |
| PUB4-003 | P3 | Ch. 11 MACD | The second introduction of the $52/$50/$1.50 snapshot now refers back and gives only the −$0.10 contrast. |
| PUB4-004 | P2 | Ch. 12 gap figure | The label box notched the previous candle body at both widths. The label now sits above the point. |
| PUB4-005 | P2 | `figure-renderer.js` | All-positive bar charts had negative ticks (−36 shares, −0.24 million shares, negative trade counts). The axis now starts at zero when every value is non-negative. |
| PUB4-006 | P2 | Ch. 3 volume panel | At 260px the labels hid the D6 marker (already present before this batch). One chart label now; both ratios moved to the caption. |
| PUB4-007 | P3 | Ch. 14 figure | Origin labels covered the rising line. They now sit below it; a small residual overlap at 260px is recorded. |
| PUB4-008 | P3 | Ch. 13/14 evidence | Three line-number locators became page-heading locators. The 50% statement is now attributed to the book, since Fidelity lists 50% among its “Fibonacci levels”. Removed the unused `ic-splits` from Ch. 13. |
| PUB4-009 | P3, open | Ch. 26 equity panel | Compact labels crowd the equity path. Found while checking PUB4-005; outside this batch. |

Authoring changes are in `content/indicators-context.json` and `content/foundations-price.json`; the shared renderer change is in `figure-renderer.js`. One coordinated rebuild. **Eight SVG exports changed:** `volume`, `volume-2`, `momentum-2`, `volatility`, `volume-tools`, `fibonacci`, `statistics` and `system-design`. The other 63 are byte-identical. Chapters 25 and 26 are not accepted. Their changed exports differ only in the bar-axis floor, and that was inspected at both widths.

## Substantive acceptance

**Chapter 10.** The full-window SMA and the SMA-seeded EMA reproduce every table and figure value, with sessions 1–4 undefined. Session 5 sets the first state rather than counting as a crossover. The first down-cross is observable after the session-8 close ($14 against $14.20), while the same close sits above the EMA's $13.78. The range path switches sides seven times in sessions 6–12. A two-close filter suppresses all seven and delays the main recognition to session 9. The fresh three-SMA task confirms its switches at sessions 5 and 7. Equality conventions are stated wherever they are used.

**Chapter 11.** ROC uses the 36 disclosed $50 closes before the displayed path. Its values at sessions 7, 12 and 14 are 25.49%, 7.8125% and 6.0606%. Under the one-neighbour rule, the peaks are at 12, 14 and 16. Peak 14 is confirmed only after session 15 closes, and session 16 at $71 shows that the divergence did not schedule a top. The RSI companion seeds at 80 and updates to 61.54 (gains 8/9, losses 5/9). With SMA seeds over the 54-close history, MACD first exists at close 26 and the signal at close 34. All 18 MACD, signal and histogram values, and the four checkpoints, reproduce to 1e-12. The histogram stays positive throughout the displayed path. The fresh initialized-state task gives a session-2 signal cross (+0.279492) while MACD remains negative.

**Chapter 12.** True range is max(3, 7, 4) = 7. ATR updates from 2 to 3.6667, and a downside mirror candle gives the same true range. The two-ATR sizing bridge allows 13 whole shares ($95.33 against the $100 budget), while 14 shares would need $102.67. Every population-SD band value reproduces. At session 6 the deviations sum to 2/3 and the SD is 0.471405; bandwidths are 6.532% and 1.819%. The sample-denominator contrast (SD $2) is labelled as a convention, not rounding. The probability misreading of two-SD bands is diagnosed. ATR seeding is disclosed as the book's own convention, because Fidelity gives only the update rule.

**Chapter 13.** Every running VWAP on the 12-trade tape reproduces, ending at $20,200 / 1,700 = $11.882353. The profile rows sum to 1,700. The point of control is $12 with 600 shares (35.294%), and merging the $11 and $12 bins gives 900. Every OBV addition, including the equal-close zero, matches. The fresh tape gives a tied point of control (300/300) and VWAP $20.6923077. Statements about participant motives remain explicitly unsupported.

**Chapter 14.** Both grids reproduce from their declared anchors. The $120 high is confirmed at session 7, and the drawn lines start there. Window B's $104 origin is shown to be a window boundary rather than a local low. After PUB4-001, the complete near-touch enumeration matches the prose. The $132.36 extension and the fresh T1–T9 anchor-policy task (confirmed high at T5 and trough at T4, recognized at T6/T5; levels 74.202 and 77.91; T8 touches B; T9 rebound) reproduce. No hit rate is inferred.

**Part 3.** Task 1: the SMA is 43 and then 42.6667, so session 11 is an up-cross, while the three-session ROC is −2.2727%. That shows position against a mean and change against an earlier close as different questions. Task 2's computability classification is correct and its tape reconciliation matches Chapter 13. Task 3's rewrite separates histogram arithmetic, price direction and valuation. Constituent Chapters 10–14 are accepted here.

**Chapter 3 / Part 1 recheck.** The only Chapter 3 content change is the volume-panel label and caption (PUB4-006), plus the bar-axis floor on both of its figures. Ratios 1.8 and 2.0 against the frozen 1.0 baseline were recalculated. Prose, tables, answers and Part 1 tasks are unchanged from batch 2. Part 1's fingerprint changes because its constituent Chapter 3 changed.

## Verification and actual coverage

- [Independent arithmetic](publication-batch4-assets/arithmetic-checks.json): **552 Fraction/Decimal comparisons**, reproducible from the repository root with [the script](publication-batch4-assets/reproduce-arithmetic.py). They verify the supplied cases, not trading performance.
- [Source record](publication-batch4-assets/source-checks.json): **15 primary pages** inspected on 2026-10-03, each claim marked as supported, partial or not stated, with page-heading locators. Investor.gov returned 403 to WebFetch and was retrieved with curl instead. Partial or not-stated items are already handled as the book's own disclosed conventions (closing-price input, the 2/(N+1) multiplier sourced to TradingView, Wilder smoothing and seeds, the MACD histogram sourced to TradingView, ATR seed, population SD). The 50% attribution was corrected in PUB4-008.
- [Figure manifest](publication-batch4-assets/figure-manifest.json): **13 figures at 260/760px (26 rasters)**. That covers all nine Part 3 figures plus the four other exports changed by PUB4-005. Each was inspected visually. Rasters come from portable SVG via macOS Quick Look. Exports match the renderer output.
- [Browser record](publication-batch4-assets/browser-checks.json): native T3 Code browser tab, **top-level 1280, 390 and 320px viewports**, covering the six chapter routes (10–14 and 3) and Part 3. At each narrow width, 552 paragraphs, answers and table cells were checked with 0 missing. There were no SVG text clips and no page overflow, and quiz feedback was correct for every option. A native Enter key press opened a closed solution. No screenshots or printer output are claimed.
- Generated reader, manuscript and evidence matrix contain every corrected string; none of the replaced strings remain.
- All three documented verifiers (early 617 comparisons), `npm run check`, strict revision checks and JavaScript syntax checks pass. An isolated build matches **all 74 generated outputs byte-for-byte**. All other previously accepted chapter fingerprints (1, 2, 4–9, 20, 21) and Part 2 are unchanged.

## Limits and next work

The browser checks are DOM text/geometry and a single keyboard interaction, not screenshots or pointer tests. Part-review fingerprints in this checkpoint use a documented formula, because the earlier encoding could not be reproduced (see the checkpoint's `fingerprintMethod`). The Part 2 value is recomputed under that formula, and its constituent chapters are unchanged.

ROAD-002 remains ready for **Chapters 15–19 and Part 4**, then Parts 5–6 (Chapters 22–28) together with PUB4-009. Source and data-rights review (ROAD-003), native printer and broader release QA (ROAD-004), review/version metadata (ROAD-006) and release packaging (ROAD-007) remain pending. **CA1-026 remains deferred**: zero human participants or observations.
