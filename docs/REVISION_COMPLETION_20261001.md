# Chapters 20–28 completion — October 1, 2026

Historical completion report. Whole-book teaching acceptance and source alignment were completed in later passes; current status is recorded in [SOURCE_AUDIT_20261002.md](SOURCE_AUDIT_20261002.md) and [FEEDBACK.md](FEEDBACK.md). Original verification limits below describe this pass only.

Implemented and reviewed by `/root`. This records the requested later-chapter revision, not an independent peer review or a publication-readiness certification. All chapters remain marked draft.

## Integrated work

The four unverified handoff drafts were investigated and revised before integration into [risk-advanced.json](../content/risk-advanced.json): Chapter 24 testing, Chapter 25 statistics, Chapter 26 Atlas-20, and Chapter 27 classical frameworks. New complete chapters cover risk sizing, plans, psychology, journals, and the casebook (20–23 and 28). Parts 5–6 each have three cumulative tasks with worked solutions. Every revised chapter has learning outcomes, prerequisites, a main solution, guided/independent practice, diagnostic option feedback, supplied tables, and claim-specific evidence records.

Chapters 20–23 follow one BRDG-P1 record from portfolio stress through a frozen plan and decision note to a filled journal. Chapter 28 revisits its successful, failed, skipped, and ambiguous branches, adds an adverse gap and timeframe conflict, and supplies a non-breakout range-recovery case with success, failure, and opening rejection. The GME/Apple historical observations and research synthesis were retained. The authoring sources for chapters 1–19 and `research-context.json` are byte-for-byte unchanged from the pre-work archive.

The renderer now wraps and separates multi-candle annotation labels while retaining leaders to the exact price, gives timeline arrows space before the next heading, and optionally labels all short chart categories (`showAllXLabels`). The About page describes the completed later-chapter teaching material while retaining outstanding editorial and reader-validation limits.

## Corrections found while reviewing the drafts

| Chapter | Finding and implemented correction |
| --- | --- |
| 24 | Candle annotations pointed below the actual signal close/fill open; now $50.40/$50.70. Target is two per-share stop distances, not an ambiguous “entry +2R.” Nonpositive entry-to-stop distance is rejected. Holding-session counting is explicit. A weaker held-out result does not by itself diagnose overfitting. Reference prices and separately charged friction avoid double-counting spread. |
| 25 | Trades 7–16 are ten closes below the trade-6 peak; recovery at trade 17 is eleven intervals after the peak. Annualization describes an equivalent historical annual rate. A Wilson win-probability interval is not an expectancy test. The SE band is a rough independence-based illustration. The inherited NIST handbook page did not supply the stated Wilson formula; the verified Dataplot page does. Every 0.5R histogram bin is labeled. |
| 26 | Daily total-volume participation is labeled a retrospective fill model, not an executable opening instruction. Entries are reserved at the previous close; batch exit/entry order is not an intraday tape and cannot use a closing exit to finance an opening order. Earnings exclusions cover known schedules, not surprises. Entry caps do not bound later marked holdings. Zero-volume-cap orders cancel without a fee or zero-risk position. The screen log excludes held stocks; omitted held names do not mean “no breakout.” |
| 27 | Dow comparisons retain prior highs A110/B106 and distinct recognition times. Wyckoff's spring definition is not falsely restricted to same-session reentry; that restriction is an alternative teaching rule. Elliott's three top-level tests are necessary, not sufficient to validate a complete count. Stock-wave overlap and unexamined subdivisions are explicit. The chapter is an optional, bounded introduction. |
| 28 | Halving a gap position halves its price loss but does not preserve net R under fixed fees. Separate success/failure panels are described as separately autoscaled. Ambiguous OHLC produces two possible sequences, not a claimed actual execution history. |

## Numbers checked

[verify-revision.cjs](../scripts/verify-revision.cjs) independently recalculates the later-chapter arithmetic and compares the supplied Atlas-20 input tables, event cash flows, closed/open positions, and ledger with [atlas20-sim.cjs](../scripts/atlas20-sim.cjs). The simulator processes integer cents. Supplied rolling highs, volume averages, calendar snapshots, and completeness flags are exercise inputs; the unpublished twenty-session histories cannot be independently recalculated from the shortened scenario.

| Example | Verified result |
| --- | --- |
| Cost-inclusive E50/S48 sizing | 47 shares; price-risk 1R $94; ordinary net loss $98.70; exit at45 gives −$239.70/−2.55R. |
| Four-position common shock | $10,530 notional; $400 planned price risk; $420 ordinary cost-inclusive loss; $1,135 shock net loss. Reduced CHIP20/FABR50 portfolio: $7,530 notional, $300 price risk, $755 shock net loss. |
| BRDG-P1 | Limit reservation $2,547.50; full fill debit $2,532.50; 1R $100; stop credit $2,427.50; ending cash $19,895, net −$105/−1.05R. Target +$195/+1.95R; gap −$155/−1.55R. |
| BRDG partial fill | 30 shares: 1R $60; target +$115/+1.9167R; gap −$95/−1.5833R under the same $5 fixed round-trip fee. |
| Journal excursions | BRDG price MFE $35/0.35R; exact-stop-model MAE $100/1R. Full-day low48.40 could be post-exit and does not prove $110 holding-period MAE. Skip has no trade-specific R denominator. |
| Chapter 24 cost ledger | 12 trades/854 shares. Gross +$91.15; commission-only +$67.15; plus half-spread +$32.99; plus slippage −$18.25. Every displayed cumulative path matches the cost table. |
| Chapter 25 outcomes | 12 wins/8 losses; net sum6.05R, mean0.3025R; fixed $100 risk yields +$605 on $20,000 (3.025%). SD1.308R, SE0.293R. Original-order max drawdown1.68%; losses-first4.05%. Wilson 12/20 interval38.66%–78.12% under the stated model. |
| Atlas-20 | D0 reservation $28,044.88; every close has cash + holdings = equity. S7 cash $70,358.82 plus holdings $30,380.40 = $100,739.22. From S0 marks: closed contribution $214.00 + open contribution after entry costs $525.22 = $739.22. Nine in-scenario fills cost $22.50. Ranking and cash-binding variants reproduce their worked solutions. |
| Casebook | GAPS30: −$305/−3.3889R; GAPS15: −$155/−3.4444R. AMB stop/target branches differ by $300/3R while sharing OHLC. RIVR target +$195/+1.95R; stop −$105/−1.05R. |
| Part reviews | All six tasks checked, including $75 filled price risk versus cost-inclusive sizing, a 20-share partial dual-touch result of −$45/−1.125R, +0.05R net expectancy, and the 123-share simultaneous-candidate allocation/reservation of $4,971.70. |

## Source inspection

The rebuilt [evidence matrix](EVIDENCE_MATRIX.md) records definitions, arithmetic, invented rules, empirical claims, source locations, dates, and limitations. Inspection included the regulator's order/performance/halts bulletins; the SEC-hosted behavioral overview's disposition-effect discussion; NIST Dataplot's Wilson formula and the p-value discussion; Sharpe's original ratio/time-dependence discussion; Bailey and coauthors' backtest-overfitting abstract/introduction/holdout discussion; Bajgrowicz–Scaillet's false-discovery, persistence and cost sections/table; and Lo–Mamaysky–Wang's abstract, Section III.A and conclusion.

For historical-framework definitions, inspection covered CMT October 2011 confirmation/nonconfirmation principles, the Wyckoff Analytics author's PDF (pp.2–4 and7–9), and Elliott Wave International's introduction/impulse/rule pages. Practitioner definitions do not establish forecasting performance. The Columbia Lo PDF and Wyckoff HTML page blocked access; the accessible MIT paper and author PDF were used instead. New records do not claim every inherited source URL or every source-site claim was verified. The broader cross-book empirical audit remains open.

## Build, content, and visual verification

The coordinated integration build ran after authoring was assembled. Final review then found the Atlas-20 screen-log scope error, requiring one additional build to propagate its correction; there were two builds in this pass, not the requested single build. The final build also includes clearer spacing in new artifact/calculation text. No generated manuscript, figure, or book was hand-edited as a lasting fix.

Final commands passed:

```sh
node scripts/verify-revision.cjs
npm run build:content
npm run check
node scripts/check-content.cjs --strict-revision
node scripts/atlas20-sim.cjs
node --check app.js
node --check figure-renderer.js
node --check scripts/atlas20-sim.cjs
node --check scripts/verify-revision.cjs
```

The final book has 28 chapters, 63 portable SVG figures, 105 glossary terms, 69 source entries and 38,244 words of section prose. Strict revision checks cover all 28 chapter contracts and all six part reviews; this is structural evidence, not a whole-book content audit.

All 24 illustrations in chapters 20–28, including the retained historical table, were rendered from the compiled book at widths300/760 and visually inspected. Corrected candle labels, flow spacing, bin labels, equity/drawdown paths, ledger/exposure panels and case OHLC were checked against their supplied values. Final desktop exports match the inspected SVGs apart from the build's trailing newline. Eight earlier candle illustrations were also visually checked at300px for renderer regressions. Finite geometry checks cover all book figures at300/760.

T3 browser DOM inspection of all nine chapter routes and both review routes passed at390px and1280px: expected sections/figures, finite SVGs, initially hidden solutions, solution disclosure, all27 diagnostic quiz options, all six review tasks, and no page-level horizontal overflow. The final screen-log correction was confirmed in the loaded book. Details are saved in [REVISION_BROWSER_QA_20261001.json](REVISION_BROWSER_QA_20261001.json). Native preview snapshots and pointer-click calls failed; disclosure/quiz behavior was verified using DOM clicks through the same T3 preview. Browser screenshot, print-layout, and real pointer-interaction validation are not claimed.

Final manuscript SHA-256: `e0c9ce0e76b1a3afec10677c6e2cc8f2d42bd45f43b77f2c46eb854afb8f0c52`.

## Feedback disposition and next work

CA1-020 (complete Atlas-20), CA1-021 (connected completed artifacts), and CA1-023 (statistics learning sequence) are resolved with their full findings and verification in [FEEDBACK_RESOLVED.md](FEEDBACK_RESOLVED.md).

The later-chapter portions of CA1-009,010,013–017,019 and025 are implemented and checked. These parent findings stay open for the outstanding chapters1–19/whole-book acceptance review; CA1-011's earlier analytical-choice review was outside this pass. CA1-018's broader empirical synthesis, CA1-022's systematically selected historical case gallery and CA1-026's actual target-reader study remain open. Existing historical observations and the reader protocol do not fulfill those broader criteria.

## Handoff archive

Pre-work material, including the original handoff README, brief, all four unverified drafts and simulator, is preserved at `/Users/arun/test_projects/market-atlas-before-completion-20261001.tar.gz`. Each required handoff input was compared byte-for-byte with that archive before removing the completed `handoff/` folder as its README instructed. The integrated authoring JSON and checked scripts are the maintained versions. Scratch drafts and visual renders are under `/tmp/market-atlas-revision-20261001/`; they are not the canonical manuscript and need not be retained to rebuild it.
