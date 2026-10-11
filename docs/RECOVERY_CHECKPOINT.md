# Recovery checkpoint — 2026-10-01

Historical checkpoint. Later passes completed the chapter/teaching work listed below. Use [SOURCE_AUDIT_20261002.md](SOURCE_AUDIT_20261002.md) and [FEEDBACK.md](FEEDBACK.md) for current status; do not rerun temporary recovery scripts.

Owner: `/root`, resuming the interrupted implementation at the user's request.

## State found

The folder has no Git repository, so there was no commit or diff history to reconstruct. Before changing files, a complete recovery archive was saved outside the project at `/Users/arun/test_projects/market-atlas-recovery-20261001.tar.gz`.

The previous implementation had revised chapters 1–8 and 10–19, added a shared portable figure renderer, browser/manuscript exercise features, and `content/research-context.json`. Chapter 9 had only partial revision metadata. Chapters 20–28 retained their earlier teaching structure and priority defects, with research/historical additions layered onto chapters 24, 25, and 28. The generated book was behind the latest foundations source. All CA1-001–025 items were claimed, but none had been archived. The indicators author's own report is preserved in [REVISION_INDICATORS.md](REVISION_INDICATORS.md); that report is evidence of their local work, not an independent whole-book review.

The first standard check failed because five foundations evidence records had empty limitations. A later check rejected the legitimate word “undefined” in a moving-average caption. These were integration issues; neither established that the previously authored indicator arithmetic was wrong.

## Completed recovery pass

- Preserved prior authoring work and rebuilt the browser edition, manuscript, 49 SVG figures, and evidence matrix from source.
- Resolved CA1-001–008: same-path sizing counterfactual; explicit Dow reference highs; useful axis precision; coherent zero-based later figures; failed-path series association; completed-week step timing; portable candle geometry; visible static annotation labels.
- Resolved CA1-012 through the Chapter 1 orientation, stocks/daily-weekly scope, prerequisites, early primer, outcomes, optional branches, and first-four-part practice routes.
- Resolved CA1-024 through canonical moving-average definitions and explicit abbreviation aliases, plus observational support/resistance definitions.
- Finished Chapter 9's frozen rule, chronological signal/skip/failure record, supplied OHLC gap illustration, modeled costs/R, exercise solutions, two practice tasks, and diagnostic quiz.
- Added three cumulative review tasks each for foundations and price action. Existing indicators/context reviews are preserved. Later parts' unavailable review links, empty solution panels, and empty outcome headings are suppressed until authored.
- Filled the five missing evidence limitations without claiming a new source inspection for those inherited records. Added inspected CMT confirmation support and transparent Chapter 9 calculation/rule records. Updated edition descriptions to acknowledge the limited historical observations already authored.

Full original findings, disposition, changed locations, and verification are retained in [FEEDBACK_RESOLVED.md](FEEDBACK_RESOLVED.md). Partial work remains in [FEEDBACK.md](FEEDBACK.md).

## Verification and limits

`npm run build:content`, `npm run check`, and JavaScript syntax checks pass. The standard checker reports 28 chapters, 29,101 narrative words, 91 glossary terms, and 66 source records. Every figure renders without invalid geometry at widths 300 and 760; all 51 line/bar panels have distinct linear-axis tick labels where applicable. The manuscript references all 49 exported figures.

Recalculated both twelve-loss compounding paths against `20000 × (1 − rate)^n`; verified the nine later-chapter figures use `xStart:0`; both failed markers target series 1 at $48.60. Completed-week values change only at sessions 5, 10, and 15. Chapter 26 holds 101 through steps 4–7, reenters after step 7 at index 92, and subsequently equals `101 × current_index / 92` within rounding. Chapter 9 gives $2,540 cash, $100 price risk, $105 ordinary cost-inclusive loss, +$195/+1.95R target net, and −$155/−1.55R gap net.

Visually inspected the actual exported anatomy candle, two OHLC routes, doji/hammer and near misses, engulfing-body comparison, spread chart, weekly step chart, risk chart, trade-plan/case failure markers, gap candles, and Elliott labels. Also inspected the Elliott figure at a 390-pixel browser viewport. Browser checks confirmed Chapter 9 solutions reveal, its incorrect quiz option supplies the intended diagnosis, both new review pages render three solutions, and contents links expose only the four authored reviews. A fresh browser origin was used after discovering the existing localhost tab was holding older script assets.

This is a targeted recovery/correction pass, not a complete re-audit of every inherited paragraph or empirical paper. Earlier evidence-inspection attribution is preserved. The strict whole-book revision contract is **not yet met**: chapters 20–28 still need outcomes, solutions, diagnostic quizzes, practice, and additional evidence records. No human reader study was performed.

## Next implementation sequence

1. Revise chapters 20–23 together (CA1-021 and the remaining CA1-010, 014–017, 019): common-shock portfolio table, a complete plan, frozen decision note, and connected trade/skip/review journal. Declare one consistent price-risk/cost/R convention.
2. Develop chapters 24–26 (CA1-020, CA1-023 and remaining CA1-009, 014–019): chronology/cost teaching, distribution/drawdown/uncertainty examples, and a fully specified Atlas-20 rule sheet and ledger.
3. Complete classical/casebook scope and verification (remaining CA1-009, 014, 018–019, 022, 025). The historical GME/Apple extracts and empirical synthesis already exist; inspect and extend them rather than starting over. The historical gallery is still narrower than the original acceptance criteria.
4. Perform the remaining cross-book teaching/editorial review (CA1-009–011, 013–019, 022, 025), with particular attention to foundations revisions that had no completion report. Prepare and run real target-reader validation when participants are available (CA1-026); never substitute model review for observed human learning.

No shared rebuild is running at this checkpoint. Edit authoring JSON, read the current queue before claiming the next manageable set, and preserve resolution history. Do not rerun temporary recovery scripts: they were one-time edits, not idempotent build commands.
