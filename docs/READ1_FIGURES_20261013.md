# READ1 figure and wording batch — 2026-10-13

Owner and reviewer: `/root`. **READ1-001, READ1-002, READ1-003 and READ1-008 are resolved.** They came from the AI simulated-beginner read recorded in [FEEDBACK.md](FEEDBACK.md#simulated-beginner-read--read1-2026-10-13). That read is editorial input, not reader validation; CA1-026 remains deferred. READ1-004–007 and 009–012 stay open. Changes are local; no push or deployment.

## Corrections

- **READ1-001 — round axis values.** The shared renderer now picks the largest 1/2/5 × 10ⁿ tick step that gives at least four ticks, instead of five evenly spaced fractions of the padded range. Labels use the fewest decimals that represent each tick exactly, with cents on money axes once fractional. Log axes tick at round values (1/2/5, then denser sequences if needed). An authoring `yTicks` override exists and is used once: Chapter 4's log panel ticks at 10/20/40/80, so equal spacing for each doubling is visible. Both Chapter 4 panels now label the four plotted values. The x-axis labels every observation that fits; otherwise round observation numbers, always keeping a named final category such as "Today".
- **READ1-002 — draw the level the lesson is about.** New authoring option `references: [{value, label}]` draws a dashed, labelled horizontal level on line, bar and candle panels. A label sits next to its line only where it covers no data and no other label. Otherwise, all of that panel's labels move to a key under the chart, so a reader never has to guess which unlabelled line is which. Annotation labels treat reference lines as obstacles. Thirty-nine levels were added: Ch 2 routes ($99 stop / $107 target); Ch 6 D15 candle (zone low $39.80, break threshold $39.50); Ch 9 skip candle (entry ceiling $50.80) and breakout legends now carrying $50.00/$50.50; Ch 21 (boundary $50.00, stop $48.60; the duplicate point label became "S3 exit at stop"); Ch 24 (entry ceiling $50.90, prior-20 high $50.00); Ch 28 AMB ($54.60/$48.60), RIVR (support $30, stop $29), the four historical cutoff/reveal cases (prior-five mean and frozen upper/lower levels) and the AAPL sequence diagnostic (93.76739/91.91061). Ch 5 now labels the D4 46 and D8 49 swing highs. Ch 28's MSFT panels keep separate price axes as the caption states; both panels now carry the same frozen levels.
- **READ1-003 — volume profile orientation.** Profile rows render highest price at the top, matching every other price chart (Ch 13 `volume-tools-2`).
- **READ1-008 — Chapter 7 wording.** "Needs a positive body" became "needs a body of nonzero length (B > 0, whether up or down)". The guided solution no longer says "Do not reject it for being a down candle: it is an up candle"; it says color plays no part in the rule, and that a down candle with the same measurements would fail for the same reason.

The figure sweep also fixed these:
- Single-candle side labels ran into the candle and leaders struck through text at phone width. They now wrap to the free space with measured leaders.
- Axis titles were jammed against OHLC detail lines at phone width. They now have 8px more room.
- In Ch 11, "Peak 14" and "Known at 15" read as attached to the wrong points. This was pre-existing; the "Known at 15" label now sits below.
- The content checker validates `references` and `yTicks`.

## Evidence

| Check | Result |
| --- | --- |
| Documented checks | Early verifier 617 comparisons; revision and historical verifiers; normal and strict content checks; figure gate over 364 renders (0 covered markers, 0 escaped bars, 0 wide renders hiding data, 0 compact renders over limit); `check:reviews` with 74 identical isolated outputs and 28/28 accepted: [final-checks.json](read1-assets/final-checks.json). |
| Reference values | All 39 levels: label number equals plotted value, and the value appears in its own chapter text. A `/root` input error had put AAPL-January levels on the MSFT figure; it was caught at visual inspection, corrected before any commit, and this cross-check was added. |
| Actual figures | 54 of 71 portable SVGs changed. Each was rendered at 760px and 320px and compared with its previous export by three read-only reviewer agents, against its caption and text. Every flagged figure was re-rendered and inspected by `/root` at both widths after fixes. Native reader spot checks were done in light and dark themes (Ch 6). Record: [figure-sweep.json](read1-assets/figure-sweep.json). |
| Fingerprints | Renderer hash changed for all chapters. Ten chapter content fingerprints changed (2, 4, 5, 6, 7, 9, 11, 21, 24, 28): figure specs, plus Chapter 7 prose. The other 18 reproduce their prior hashes exactly. Part fingerprints change for Parts 1, 2, 3, 5 and 6 through chapter dependencies only; Part 4 reproduces. Part tasks are unchanged. Record: [fingerprints.json](read1-assets/fingerprints.json). |

## Publication acceptance carried forward

All 28 chapters keep acceptance with a `figureRecheck` for this batch, and the ledger rows link here. Prose, arithmetic and source support are inherited from their cited batches. Chapter 7's two wording changes were reviewed against the hammer rule (B > 0, D ≥ 2B, U ≤ B) and its worked values. Parts 1, 2, 3, 5 and 6 are re-accepted for the chapter figure dependency only.

## Residual and boundaries

- At 320px, the Ch 6 construction panel and the Ch 27 range figure have zone-name text crossed by the price line, and label boxes interrupt shaded zones. Both were present in the previous exports and are recorded under READ1-010.
- Large-value axes lack thousands separators; negative ticks use a hyphen-minus. Both are cosmetic and pre-existing.
- The gate checks geometry, not meaning. Inspection covered every changed figure at two widths but not every intermediate width.
- No printer output was produced; printing is out of scope by user decision.
