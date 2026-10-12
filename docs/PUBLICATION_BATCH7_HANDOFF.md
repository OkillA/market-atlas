# Publication batch 7 — handoff (claude-code-pub7, 2026-10-12)

ROAD-002 batch 7 (Chapters 24–28 and Part 6) is **in progress and handed off**; the claim in the roadmap/ledger is released to the next agent. The content and renderer work is done and committed locally (`a53df50` baseline, `e798f63`, `2a9e128`); **nothing is pushed**. The paperwork, browser QA and acceptance records below are **not** done. No chapter is accepted yet.

## State

- All verifiers and checks pass: `verify-early-chapters` (617), `verify-revision`, `verify-historical`, `npm run check`, `npm run check:figures`, `check-content --strict-revision`.
- Six independent reproduction scripts in [publication-batch7-assets](publication-batch7-assets/) pass on the final compiled text with **0 mismatches** (run `node docs/publication-batch7-assets/extract.cjs`, then `python3 -I docs/publication-batch7-assets/<id>-reproduce.py`): testing 516, statistics 884, system-design 1,257, classical-frameworks 362, case-studies 697, part6 169. Source checks are in the `*-source-checks.json` files.
- Reviewers were read-only agents (one per chapter plus Part 6); claude-code-pub7 verified each finding against the files before editing.

## Findings implemented (record each in FEEDBACK_RESOLVED.md; suggested prefix PUB7)

**Shared renderer (book-wide, P1):** annotation label backgrounds hid plotted data (e.g. Ch 9 compact: the failed continuation; Ch 25 band chart up to 51% of a series; notched candle bodies in Ch 21/28). `figure-renderer.js` now maps drawn lines/bars/candles and places labels to avoid them (order-aware for ≤5 labels). `scripts/verify-figures.cjs` gains a hidden-data gate: before 31 wide renders hid data and 80 compact renders exceeded 5%; after 0/0 (max compact 3.85%). **34 figures changed, 25 shipping SVGs** — including figures of accepted Chapters 1, 2, 3, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 19, 20, 21; these need a figure-only recheck and re-acceptance (see `renderer-diff.cjs`, `data-coverage.cjs`).

- **Ch 24:** P1 holding-clock contradiction ("tenth session after entry" vs holding session 10; reopens AUD2-002) fixed; stage-one decision criteria added (text, figure, Maya's conclusion); rc-bs evidence ex post→ex ante per pp. 21/22/24 (Ch 24, Ch 25, appendix); opening-price sizing disclosure; fresh exercise (d) ($975/150); "Mildly positive". Declined: $50.90 coincidence (prose names it), candle threshold line (needs renderer feature).
- **Ch 25:** SD reproduction steps (n − 1, 1.308R vs 1.275R); SE row 0.2925R; solution/Wilson intermediates reproducible; doubling sentence; gross loss-rate example; null-hypothesis wording; t-multiplier caveat; appendix naming; "Total return" → "account return" (glossary clash); rc-bs dating corrected; histogram gap label removed (compact clipping). Not adopted: section reorder, optional notes.
- **Ch 26:** P1 unlisted Alder D6 signal fixed (S6 close 35.50 in JSON and `atlas20-sim.cjs`; new derived-signal check in `verify-revision.cjs`); P1 false "conventions all lowered the result" rewritten; attempt packet moved after section 6 (`afterSection: 6`, leaks checked); Atlas-20 back-reference; halt-authority wording.
- **Ch 27:** P1 "two points higher" fixed; secondary-reaction wording; spring window includes the breach close, same-event rule, re-freeze note; step-12 counts provisional with frozen invalidation; reaction-extremes table; EWI attribution (verified via WebFetch); quiz/annotation/header polish; new practice "Sort framework statements into layers"; compact figure simplified. **Deferred:** Brown–Goetzmann–Kumar (1998) Dow study — needs full-paper read before adding (keep visible in FEEDBACK.md).
- **Ch 28:** P1 MIXD weekly/daily contradiction fixed ($48.90/$49.90; not an M1 trigger); RIVR rule defined and aligned with Ch 27, rules renamed RR1/GR1; ex-dividend caution + new source `rc-apple-dividend-2016` and evidence record; +134.84%; missing-space typos; new AMB task and SPY-2016-04 transfer task (rows checked against `spy.csv` in `verify-historical.cjs`); wording fixes. Declined: GME figure staging (retrospective case; panel titles carry clocks).
- **Part 6:** Task 1 validation answer; Task 2 explicit rules (margin rounding, slots, rounding, reserve); Task 3 replaced with unfamiliar seven-variant task; 12 shadowed `curriculum.js` glossary entries removed (merged glossary byte-identical).
- **Accepted chapters, whitespace only:** typo fixes in Chapters 6, 7, 8 (`foundations-price.json`) change their fingerprints → re-accept.

## Remaining steps for the next agent

1. Re-read AGENTS.md/FEEDBACK.md; claim ROAD-002 batch 7 in EDITORIAL_ROADMAP.md and the ledger.
2. Record PUB7 findings with full finding/disposition/verification in FEEDBACK_RESOLVED.md; leave the deferred Ch 27 study item open in FEEDBACK.md.
3. Visually inspect the final Ch 24–28 figures at 260/760 (`prepare-figures.cjs` → `figures/`, `rasters/`) and the changed accepted-chapter figures (`renderer-diff.cjs <old renderer> <outdir>` using `git show 1c90156:figure-renderer.js` or `a53df50`).
4. Native browser checks (1280/390/320) for Chapters 24–28/Part 6 and spot checks of changed figures; bump `book.js?v=` and the renderer cache key in `index.html`.
5. Isolated rebuild comparison, fingerprints, new `PROJECT_CHECKPOINT_*.json`, ledger rows/records, `PUBLICATION_BATCH7_*.md`, PROJECT_STATUS.md, roadmap, CONTENT_GUIDE note on the hidden-data gate.
6. CA1-026 remains deferred. Push only when the user asks.
