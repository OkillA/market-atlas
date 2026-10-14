# Feedback resolution history

Active queue: [FEEDBACK.md](FEEDBACK.md). Project instructions: [../AGENTS.md](../AGENTS.md).

Keep completed findings here so the active queue can be cleared without losing the review record. Preserve IDs permanently. This history is append-only except for correcting or supplementing an existing record.

## How to close an item

1. Verify the finding against the current files and complete the resolution or document an evidence-backed disagreement.
2. Copy the full active item here, including its original evidence and acceptance criteria. Add the closure fields below. For a large shared reference, preserve the relevant text or a durable link, rather than relying on an active item that may later disappear.
3. Confirm the history entry is saved, then remove that specific item from `FEEDBACK.md`. If interrupted between these steps, keep the same ID and reconcile the duplicate; do not discard the record.
4. If a reviewer finds the problem persists, move or copy the finding back into the active queue with the same ID and a dated reopening note. Preserve the earlier closure here.

Closure fields:

```md
- Disposition: resolved | not_actionable | duplicate
- Closed by / date: agent identity / YYYY-MM-DD
- Resolution: What changed, or the evidence supporting the decision not to change it.
- Changed locations: Source files/sections and rebuilt artifacts, if relevant.
- Verification: Actual checks, calculations, visual inspection, or source evidence; include results and limitations.
- Related IDs: Follow-up or duplicate item, if any.
```

`Deferred`, `in_progress`, and `needs_review` are not closure dispositions. An implemented fix may be closed by its owner after appropriate verification; another agent's approval is not a mandatory gate. Reviewers can independently confirm or reopen it later.

## Closed items

Recovered resolutions below preserve the original findings and acceptance criteria.


### CA1-001 — Psychology example changes outcome when only size changes
- Priority / type: P1 / defect
- Status: in_progress
- Owner: /root (recovery pass)
- Reviewer / date: CA1 / 2026-10-01
- Location: Ch. 22, “Worked example: The lucky violation”; manuscript line 1653; authoring source `content/risk-advanced.json`.
- Finding and evidence: The text says a documented $100-risk trade would lose $100, but risking $400 instead earns $800. Position size alone cannot change the sign of the same trade's return. This breaks the counterfactual used to teach outcome bias.
- Proposed resolution: Hold the winning path constant: the documented size would earn $200; Maya quadruples size without a recorded reason and earns $800. Preserve the distinction between profit and adherence to a risk policy.
- Acceptance criteria: Both sizes refer to the same path and scale profit/loss consistently; the example still explains why a winning violation is not evidence of a sound sizing decision.
- Discussion / progress: /root, 2026-10-01 — Claimed for the first correction pass; authoring fixes and shared figure rendering will be verified before closure.
- Recovery handoff / 2026-10-01: /root resumed this previously claimed work at the user’s request and verified the current authoring and generated content before closure.
- Disposition: resolved
- Closed by / date: /root (recovery pass) / 2026-10-01
- Resolution: Held the +2-times-price-risk winning path constant: $100 risk earns $200 and quadrupled quantity/$400 risk earns $800. Proportional fills and omitted costs are explicit; policy adherence remains separate from the result.
- Changed locations: content/risk-advanced.json, psychology worked example; rebuilt book and manuscript.
- Verification: Read the rebuilt example and checked 100 × 2 = 200 and 400 × 2 = 800; no sign-changing size counterfactual remains.
- Related IDs: Remaining broader revisions stay in CA1-009–011, CA1-013–023, and CA1-025–026; see [RECOVERY_CHECKPOINT.md](RECOVERY_CHECKPOINT.md).


### CA1-002 — Dow confirmation example lacks the necessary reference states
- Priority / type: P1 / teaching gap
- Status: in_progress
- Owner: /root (recovery pass)
- Reviewer / date: CA1 / 2026-10-01
- Location: Ch. 27, “Dow theory: trends and confirmation”; lines 2001–2005.
- Finding and evidence: A rises from 100 to 112 while B stalls near 104. Unequal returns alone do not establish nonconfirmation; both could have exceeded their relevant earlier peaks. This is an under-specified example, not a finding that the whole explanation is false.
- Proposed resolution: State the prior reference highs and confirmation rule, or define explicit trend states before comparing the averages. The cited CMT article itself specifies trend states.
- Acceptance criteria: The reader can determine confirmation/nonconfirmation from the supplied data and rule without inferring it from unequal returns alone.
- Discussion / progress: /root, 2026-10-01 — Claimed for the first correction pass; authoring fixes and shared figure rendering will be verified before closure.
- Recovery handoff / 2026-10-01: /root resumed this previously claimed work at the user’s request and verified the current authoring and generated content before closure.
- Disposition: resolved
- Closed by / date: /root (recovery pass) / 2026-10-01
- Resolution: Supplied prior closing highs A110/B106, a strict completed-close confirmation rule, current closes A112/B104, and a later B107 comparison. A different prior B103 demonstrates why unequal gains alone do not decide confirmation. Added a reference-state table and bounded primary practitioner support.
- Changed locations: content/risk-advanced.json, classical-frameworks Dow section/table and ra-dow-reference source/evidence; rebuilt book, manuscript, and evidence matrix.
- Verification: Compared 112 > 110, 104 < 106, and later 107 > 106. Inspected CMT October 2011 principles 5–7 and nonconfirmation elaboration. The simplified comparison is explicitly not the full historical trend-reversal procedure.
- Related IDs: Remaining broader revisions stay in CA1-009–011, CA1-013–023, and CA1-025–026; see [RECOVERY_CHECKPOINT.md](RECOVERY_CHECKPOINT.md).


### CA1-003 — Price-axis rounding hides the quantities being taught
- Priority / type: P1 / defect
- Status: in_progress
- Owner: /root (recovery pass)
- Reviewer / date: CA1 / 2026-10-01
- Location: [market-microstructure.svg](../assets/figures/market-microstructure.svg), ch. 19; [breakouts.svg](../assets/figures/breakouts.svg), ch. 9.
- Finding and evidence: All five vertical ticks in the microstructure figure read `50`, despite bid/ask differences measured in cents. The breakout figure has two different ticks both labeled `49`. These observations were confirmed visually and from SVG text.
- Proposed resolution: Use precision appropriate to the plotted tick spacing; directly label the spread or important price levels.
- Acceptance criteria: Distinct ticks have distinct, truthful labels, and a reader can interpret the relevant cent-level differences from the exported figure. Inspect other narrow-range charts for the same problem.
- Discussion / progress: /root, 2026-10-01 — Claimed for the first correction pass; authoring fixes and shared figure rendering will be verified before closure.
- Recovery handoff / 2026-10-01: /root resumed this previously claimed work at the user’s request and verified the current authoring and generated content before closure.
- Disposition: resolved
- Closed by / date: /root (recovery pass) / 2026-10-01
- Resolution: Integrated the existing step-sensitive tick formatter. The revised microstructure chapter retains the spread comparison as figure 2 and adds an explicit order-book ladder; breakout thresholds/important observations are directly labeled.
- Changed locations: figure-renderer.js; content/indicators-context.json and content/foundations-price.json; assets/figures/market-microstructure-2.svg and breakouts.svg, rebuilt manuscript/book.
- Verification: Visually inspected the exported spread chart: ticks 49.50/49.75/50.00/50.25/50.50 are distinct and the $0.80 spread is labeled. Checked all line/bar panels for duplicate linear tick labels where applicable, and finite render geometry at widths 300/760. Breakout ticks and $50.80/$49.40 annotations are readable.
- Related IDs: Remaining broader revisions stay in CA1-009–011, CA1-013–023, and CA1-025–026; see [RECOVERY_CHECKPOINT.md](RECOVERY_CHECKPOINT.md).


### CA1-004 — Zero-based captions conflict with one-based chart ticks
- Priority / type: P1 / defect
- Status: in_progress
- Owner: /root (recovery pass)
- Reviewer / date: CA1 / 2026-10-01
- Location: Chs. 20–28 where axes/annotations say “starting at 0”; particularly [risk-sizing.svg](../assets/figures/risk-sizing.svg) and manuscript lines 1471–1472.
- Finding and evidence: Risk sizing labels the initial state as position 1 and twelve losses as position 13 while the axis says loss number starts at 0. Similar mismatches occur in trade plans, psychology, journaling, testing, statistics, system design, classical frameworks, and cases.
- Proposed resolution: Make the initial state, observation numbering, axis ticks, captions, and annotations use one coherent convention. For twelve losses plus initial equity, label 0–12.
- Acceptance criteria: Counts and timestamps agree across every affected figure and its manuscript annotations; verify the switching and reentry steps in ch. 26 explicitly.
- Discussion / progress: /root, 2026-10-01 — Claimed for the first correction pass; authoring fixes and shared figure rendering will be verified before closure.
- Recovery handoff / 2026-10-01: /root resumed this previously claimed work at the user’s request and verified the current authoring and generated content before closure.
- Disposition: resolved
- Closed by / date: /root (recovery pass) / 2026-10-01
- Resolution: Explicitly set xStart:0 on all nine later-chapter primary figures. Captions, ticks, point indices, and switching annotations now agree. Clarified the chapter-26 cash/reentry formula.
- Changed locations: content/risk-advanced.json, figures in chapters 20–28; all rebuilt affected SVGs, manuscript, and browser book.
- Verification: Verified every affected authoring figure and compiled figure uses zero-based observation labels. Risk plot visibly starts at 0 and ends at 12; recomputed both twelve-loss paths against 20000 × (1 − rate)^n. Switching follows stock through step 3, holds 101 at steps 4–7, reenters after step 7 at 92, and follows 101 × stock/92 thereafter within rounding; final 125.15.
- Related IDs: Remaining broader revisions stay in CA1-009–011, CA1-013–023, and CA1-025–026; see [RECOVERY_CHECKPOINT.md](RECOVERY_CHECKPOINT.md).


### CA1-005 — Failed-path annotations are attached to the successful series
- Priority / type: P1 / defect
- Status: in_progress
- Owner: /root (recovery pass)
- Reviewer / date: CA1 / 2026-10-01
- Location: [trade-plans.svg](../assets/figures/trade-plans.svg), ch. 21; [case-studies.svg](../assets/figures/case-studies.svg), ch. 28.
- Finding and evidence: The marker describing the failed path reaching $48.60 sits on the successful path at about $52.60 at that observation. The labels and marker coordinates refer to different series.
- Proposed resolution: Associate each annotation with its intended series and value.
- Acceptance criteria: The failure marker visibly lands at $48.60 on the failed path in both exported figures; entry and target annotations remain correct.
- Discussion / progress: /root, 2026-10-01 — Claimed for the first correction pass; authoring fixes and shared figure rendering will be verified before closure.
- Recovery handoff / 2026-10-01: /root resumed this previously claimed work at the user’s request and verified the current authoring and generated content before closure.
- Disposition: resolved
- Closed by / date: /root (recovery pass) / 2026-10-01
- Resolution: Associated failed-path annotations with seriesIndex:1 in both figures. Entry and target remain on the intended successful series. Also corrected analogous second-series trough and net-result markers in statistics/testing.
- Changed locations: content/risk-advanced.json, trade-plans/case-studies annotations; rebuilt affected SVGs/book/manuscript.
- Verification: Recalculated both annotation values as $48.60 on series 1, index 9. Visually inspected both exported figures: circles land on the descending failed path at the invalidation line; entry and target markers remain correct.
- Related IDs: Remaining broader revisions stay in CA1-009–011, CA1-013–023, and CA1-025–026; see [RECOVERY_CHECKPOINT.md](RECOVERY_CHECKPOINT.md).


### CA1-006 — Weekly confirmation timing should be drawn as a step series
- Priority / type: P1 / teaching gap
- Status: in_progress
- Owner: /root (recovery pass)
- Reviewer / date: CA1 / 2026-10-01
- Location: Ch. 17; [multi-timeframe.svg](../assets/figures/multi-timeframe.svg); manuscript line 1237 onward.
- Finding and evidence: Connecting completed weekly values with sloping segments suggests a change between confirmation times. The caption discloses interpolation, but that visual conflicts with the chapter's central availability lesson.
- Proposed resolution: Hold the last completed value constant and change it only at the defined weekly completion point; distinguish any developing value if shown.
- Acceptance criteria: The confirmed weekly series changes only at sessions 5, 10, and 15 in this example, with the observation-time convention stated and visually clear.
- Discussion / progress: /root, 2026-10-01 — Claimed for the first correction pass; authoring fixes and shared figure rendering will be verified before closure.
- Recovery handoff / 2026-10-01: /root resumed this previously claimed work at the user’s request and verified the current authoring and generated content before closure.
- Disposition: resolved
- Closed by / date: /root (recovery pass) / 2026-10-01
- Resolution: Integrated the indicators author’s completed-week step series and synchronized availability discussion. The last known weekly value is held until the next completed-week observation.
- Changed locations: content/indicators-context.json, multi-timeframe chapter/figures; figure-renderer.js step paths; rebuilt SVG/book/manuscript.
- Verification: Compared all completed-week values: changes occur only at sessions 5, 10, 15. Visually inspected the exported horizontal holds and vertical changes. The caption states post-close observation timing and the initial prior-week value; no interpolated weekly slope remains.
- Related IDs: Remaining broader revisions stay in CA1-009–011, CA1-013–023, and CA1-025–026; see [RECOVERY_CHECKPOINT.md](RECOVERY_CHECKPOINT.md).


### CA1-007 — Candle chapters lack essential portable candle diagrams
- Priority / type: P1 / teaching gap
- Status: in_progress
- Owner: /root (recovery pass)
- Reviewer / date: CA1 / 2026-10-01
- Location: Ch. 2, [chart-anatomy.svg](../assets/figures/chart-anatomy.svg); ch. 7, [candlestick-patterns.svg](../assets/figures/candlestick-patterns.svg).
- Finding and evidence: Both manuscript figures are close-only lines. They cannot show the OHLC geometry being taught. Supplementary website diagrams do not make the standalone manuscript complete.
- Proposed resolution: For ch. 2, draw the exact O=100/H=108/L=98/C=105 candle, label body/shadows, compare representations, and show the two possible intraday routes. For ch. 7, draw the actual doji, hammer-like, and engulfing examples plus near misses and prior-trend context.
- Acceptance criteria: A reader of the manuscript alone can identify the geometry, reproduce its measurements, and distinguish engulfing bodies from outside ranges using the illustrations and supplied values.
- Discussion / progress: /root, 2026-10-01 — Claimed for the first correction pass; authoring fixes and shared figure rendering will be verified before closure.
- Recovery handoff / 2026-10-01: /root resumed this previously claimed work at the user’s request and verified the current authoring and generated content before closure.
- Disposition: resolved
- Closed by / date: /root (recovery pass) / 2026-10-01
- Resolution: Integrated the foundations author’s exact anatomy candle, ordered routes, doji/hammer and near misses, prior declining context, and engulfing-body/inside-range comparisons into portable manuscript SVGs. Tidied visible figure text and named the intraday routes “Ordered price observations”.
- Changed locations: content/foundations-price.json, chart-anatomy and candlestick-patterns figures/tables; shared renderer; rebuilt portable SVGs, book, and manuscript.
- Verification: Visually inspected actual exported diagrams. O100/H108/L98/C105 yields body5/upper3/lower2/range10, and both routes share the same OHLC. Doji body0.10/range2=5%; hammer lower3/body0.80=3.75 versus near-miss1.10/0.80=1.375. Second body49.80–52.20 covers50–52 while its range49.50–52.50 does not cover49–53; near-miss close51.90 fails body coverage. All supplied figures are referenced by the manuscript.
- Related IDs: Remaining broader revisions stay in CA1-009–011, CA1-013–023, and CA1-025–026; see [RECOVERY_CHECKPOINT.md](RECOVERY_CHECKPOINT.md).


### CA1-008 — Essential annotations are not visible in static illustrations
- Priority / type: P1 / teaching gap
- Status: in_progress
- Owner: /root (recovery pass)
- Reviewer / date: CA1 / 2026-10-01
- Location: Exported figures, especially ch. 27 [classical-frameworks.svg](../assets/figures/classical-frameworks.svg).
- Finding and evidence: The Elliott schematic has endpoint markers but no visible 1–5/A–C labels beside them; labels are exposed as SVG titles and in a separate manuscript list. The reader must reconstruct the diagram. Similar detached labels weaken other figures.
- Proposed resolution: Print essential labels and relevant constraints directly in the static diagram; keep hover descriptions supplementary.
- Acceptance criteria: The figure remains self-explanatory in ordinary Markdown display and print, without hover interaction or matching a separate list to unlabeled points. Check for collisions at intended reading size.
- Discussion / progress: /root, 2026-10-01 — Claimed for the first correction pass; authoring fixes and shared figure rendering will be verified before closure.
- Recovery handoff / 2026-10-01: /root resumed this previously claimed work at the user’s request and verified the current authoring and generated content before closure.
- Disposition: resolved
- Closed by / date: /root (recovery pass) / 2026-10-01
- Resolution: Integrated visible static short-label rendering, explicit series association, and label placement. Elliott endpoints now print 1–5/A–C; the figure caption supplies the selected top-level constraints.
- Changed locations: figure-renderer.js; content/risk-advanced.json classical-frameworks figure; rebuilt SVGs, manuscript, and book.
- Verification: Visually inspected the exported Elliott schematic and its browser rendering at a 390-pixel viewport: all eight labels are visible beside the intended endpoints without label collisions. Checked selected constraints: wave2 ends42 above start40; wave4 ends47 above wave1 high44; impulse lengths4/8/6 make wave3 not shortest. Anatomy/routes, weekly timing, breakout, and failed-path labels were also inspected statically. This does not certify all future figures or empirical wave forecasting.
- Related IDs: Remaining broader revisions stay in CA1-009–011, CA1-013–023, and CA1-025–026; see [RECOVERY_CHECKPOINT.md](RECOVERY_CHECKPOINT.md).


### CA1-012 — State audience, scope, and practical learning outcomes
- Priority / type: P2 / editorial recommendation
- Status: in_progress
- Owner: /root (recovery pass)
- Reviewer / date: CA1 / 2026-10-01
- Location: Opening and ch. 1; current stocks-first context is clearer in supporting project documents than in a reader-facing orientation.
- Finding and evidence: The opening addresses investing-literate beginners, while later chapters increasingly assume systematic swing-trading research. Holding horizons and the relationship to an existing investing process need clearer framing.
- Proposed resolution: State the primary path and optional extensions, asset/geographic scope, prerequisites, and what readers will learn to do. Explain how charts fit alongside valuation, diversification, and investment decisions. The implementing agent can propose a sensible editorial scope without turning this into an unnecessary permission gate.
- Acceptance criteria: Readers can identify whether the guide meets their needs, follow an appropriate reading path, and understand its concrete learning outcomes and exclusions.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery handoff / 2026-10-01: /root resumed this previously claimed work at the user’s request and verified the current authoring and generated content before closure.
- Disposition: resolved
- Closed by / date: /root (recovery pass) / 2026-10-01
- Resolution: Verified and integrated Chapter 1’s reader orientation: investing prerequisites, unleveraged ordinary US-stock scope, daily/weekly sessions, investing-process relationship, core learning path, outcomes, early execution/risk/expectancy primer, and optional branches. Added foundations/price-action part-review routes; unavailable later review links are hidden until authored.
- Changed locations: content/foundations-price.json, Chapter 1 and partPractice; content/risk-advanced.json optional framework/inference markers; app.js; rebuilt manuscript/book.
- Verification: Read the actual opening against every acceptance element. Browser checks confirmed both new part reviews supply three solutions and contents links point only to the four authored reviews. Fibonacci/classical are optional and inference sections are marked; whole-book practice completion remains CA1-015.
- Related IDs: Remaining broader revisions stay in CA1-009–011, CA1-013–023, and CA1-025–026; see [RECOVERY_CHECKPOINT.md](RECOVERY_CHECKPOINT.md).


### CA1-024 — Harmonize glossary entries with the main text
- Priority / type: P3 / editorial recommendation
- Status: in_progress
- Owner: /root (recovery pass)
- Reviewer / date: CA1 / 2026-10-01
- Location: Glossary, notably EMA lines 2187/2193, SMA lines 2267/2271, and support/resistance lines 2253/2277.
- Finding and evidence: EMA and SMA appear under abbreviated and expanded entries rather than clear aliases. Support/resistance definitions use stronger inferred supply/demand explanations than the careful observational framing in ch. 6.
- Proposed resolution: Consolidate or explicitly cross-reference aliases; use consistent definitions and retain the distinction between observed reactions and hypothesized mechanisms.
- Acceptance criteria: Terminology is easy to find, noncontradictory, and useful in isolation; aliases do not create competing definitions.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery handoff / 2026-10-01: /root resumed this previously claimed work at the user’s request and verified the current authoring and generated content before closure.
- Disposition: resolved
- Closed by / date: /root (recovery pass) / 2026-10-01
- Resolution: Retained canonical expanded SMA/EMA entries with explicit abbreviation aliases. Overrode inherited Support/Resistance definitions with observational price-area definitions that distinguish hidden demand/supply hypotheses from observed reactions.
- Changed locations: content/indicators-context.json glossary (inherited revision); content/foundations-price.json glossary; rebuilt glossary in book/manuscript.
- Verification: Inspected compiled glossary: exactly one canonical definition per moving average with matching SMA/EMA aliases; Support, Resistance, and Support zone are consistent with Chapter 6 and do not assert guaranteed floors/ceilings or infer hidden orders from prices alone.
- Related IDs: Remaining broader revisions stay in CA1-009–011, CA1-013–023, and CA1-025–026; see [RECOVERY_CHECKPOINT.md](RECOVERY_CHECKPOINT.md).


### CA1-020 — Complete Atlas-20 as an inspectable capstone
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (completion pass, claimed 2026-10-01)
- Reviewer / date: CA1 / 2026-10-01
- Location: Ch. 26, “Designing a complete trading system”; connect to chs. 24 and 28.
- Finding and evidence: Atlas-20 is a partial specification. Ranking, eligibility details, risk budget, exact entry limit, several execution policies, and other decisions are described as things the designer must supply. The reader never sees a fully specified system processed end to end.
- Proposed resolution: Supply a clearly fictional complete rule sheet, a small data/opportunity set, simultaneous-candidate allocation, portfolio ledger, and chronological execution/exit examples. Include costs, cash, partial fills, gaps, missing data, and exit priority to the extent needed by the stated scope.
- Acceptance criteria: Another reader can process the supplied scenario without inventing material decisions and reproduce its accounting. Demonstrated profitability is not required. Keep arbitrary teaching settings clearly identified.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery progress / 2026-10-01: Atlas-20 remains a partial specification. The exposure-timing figure is corrected, but no complete rule sheet, simultaneous allocation, or portfolio ledger has yet been authored.
- Completion progress / 2026-10-01: /root claims the chapters 20–28 and parts 5–6 portion. Whole-book criteria stay open unless separately verified. One shared rebuild will follow source integration.
- Disposition: resolved
- Closed by / date: /root (completion pass) / 2026-10-01
- Resolution: Reviewed/corrected the handoff draft and supplied Atlas-20 v1.0's complete bounded rule sheet, eight-stock/eight-session input set, screen and simultaneous allocation records, cash reservations, full event/portfolio ledgers, partial fills, touch nonfill, time exit, halted mark, reopening gap, dual-touch priority, and worked variants. Daily-volume participation is explicitly retrospective; pre-reserved entries cannot spend closing exit proceeds. The screen log's non-held scope is explicit. No efficacy or deployment claim is made.
- Changed locations: content/risk-advanced.json, system-design; scripts/atlas20-sim.cjs; scripts/verify-revision.cjs; rebuilt content/book.js, docs/MANUSCRIPT.md, docs/EVIDENCE_MATRIX.md and system-design SVGs.
- Verification: Recalculated allocation/cash constraints, compared all supplied OHLC/entry volumes and screen fields to simulator inputs, all event cash flows and closed/open results to displayed tables, and every equity/reservation/available-cash row and figure path. D0 reserves $28,044.88; S7 cash $70,358.82 + holdings $30,380.40 = $100,739.22; $214.00 closed contribution + $525.22 open contribution = $739.22 from S0 marks. Nine scenario fills cost $22.50. Alternate ranking reserves $27,996.81; aggressive variant's Cedar cash allowance is219 shares/$31.78 remaining. Simulator, independent arithmetic and strict content checks pass. Visually inspected all three system figures at300/760px and verified final browser sections, figures, solution disclosure and option feedback at390/1280px. Supplied lookback summary fields are inputs, not independently audited historical bars. Exact evidence/limits and the additional correction rebuild are in [REVISION_COMPLETION_20261001.md](REVISION_COMPLETION_20261001.md).
- Related IDs: Whole-book CA1-009,010,013–019 and025 remain open; historical gallery CA1-022 and reader validation CA1-026 are not resolved by this capstone.



### CA1-021 — Supply completed risk, plan, and journal artifacts
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (completion pass, claimed 2026-10-01)
- Reviewer / date: CA1 / 2026-10-01
- Location: Chs. 20–23.
- Finding and evidence: The manuscript explains fields and principles but provides few completed artifacts. Portfolio common-shock risk is discussed without a full numerical example. Planned price risk, cost-inclusive modeled loss, and the R denominator need consistent labeling across cases.
- Proposed resolution: Add a worked portfolio stress table (ch. 20), completed trade plan with order/expiry/partial-fill/exit rules (ch. 21), frozen before/after decision note (ch. 22), and filled journal containing a trade, a skip, and a review (ch. 23).
- Acceptance criteria: Records connect logically and arithmetically; units and R denominators are explicit; actual versus simulated fills remain distinct. A reader can use the completed artifacts as worked examples for their exercises.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery progress / 2026-10-01: The psychology counterfactual is corrected. Completed common-shock risk, plan, decision-note, and journal artifacts remain unauthored; use a consistent cost/R contract across this group.
- Completion progress / 2026-10-01: /root claims the chapters 20–28 and parts 5–6 portion. Whole-book criteria stay open unless separately verified. One shared rebuild will follow source integration.
- Disposition: resolved
- Closed by / date: /root (completion pass) / 2026-10-01
- Resolution: Authored the four connected chapters20–23: a completed four-position common-shock worksheet and reduced allocation, BRDG-P1 plan with opening gate/maximum price risk/reservation/expiry/partial/operational/exit policies, a frozen before-outcome note with separately timed updates, and journal rows for a filled failure, compliant skip and prospective review. Price-risk 1R excludes costs; sizing against cost-inclusive loss is a separately labeled policy. Every fill is supplied/simulated, not actual brokerage evidence.
- Changed locations: content/risk-advanced.json, risk-sizing/trade-plans/psychology/journaling and partPractice.risk; rebuilt book/manuscript/evidence and eight illustrations.
- Verification: Full portfolio notional $10,530, price risk $400, ordinary net loss $420 and shock net loss $1,135; reduced CHIP20/FABR50 notional $7,530, price risk $300 and shock net loss $755 under the stated $800 constraint. BRDG reserves $2,547.50, spends $2,532.50 on entry, freezes $100 price-risk R, receives $2,427.50 at modeled stop and ends with $19,895/−$105/−1.05R. The same timestamps, quantities, fees and values persist through the note and journal. A30-share partial uses $60 R; fixed-fee target +$115/+1.9167R and gap −$95/−1.5833R. Skip has no position/fee/trade R. MFE $35/0.35R and exact-stop-model MAE $100/1R exclude unsupported post-exit lows. Same-path psychology counterfactual retains positive results at both sizes. Independently recalculated exercises and three part-review solutions; read rebuilt artifacts; visually inspected all eight figures at300/760px; final browser disclosure/quiz/content checks pass at390/1280px. See [REVISION_COMPLETION_20261001.md](REVISION_COMPLETION_20261001.md) for commands and limits.
- Related IDs: The later-chapter portions of CA1-010,013–017 and019 are addressed; their broader acceptance criteria remain visible in the queue. Human learning effectiveness remains CA1-026.



### CA1-023 — Give statistics a manageable learning sequence
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (completion pass, claimed 2026-10-01)
- Reviewer / date: CA1 / 2026-10-01
- Location: Ch. 25, plus early expectancy primer proposed in CA1-013.
- Finding and evidence: Expectancy, intervals, dependence, bootstrap methods, CAGR, Sharpe, and p-values occupy roughly the same space as the Fibonacci chapter. The definitions are generally careful, but the density is high for beginners and visual/numerical practice is limited.
- Proposed resolution: Separate essential performance arithmetic from optional inference topics. Work through a small outcome distribution, costs, equity/drawdown path, and uncertainty example before introducing more advanced methods. Preserve the correctly qualified Wilson and Sharpe discussions.
- Acceptance criteria: A reader can calculate and distinguish average outcome, return, drawdown, and uncertainty from supplied examples. Advanced sections have explicit prerequisites and do not imply that a tiny fictional sample validates a strategy.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery progress / 2026-10-01: Advanced inference sections are marked optional. The essential distribution/cost/equity/drawdown/uncertainty teaching sequence and practice still need expansion.
- Completion progress / 2026-10-01: /root claims the chapters 20–28 and parts 5–6 portion. Whole-book criteria stay open unless separately verified. One shared rebuild will follow source integration.
- Disposition: resolved
- Closed by / date: /root (completion pass) / 2026-10-01
- Resolution: Revised Chapter25 around a supplied twenty-outcome distribution, costs and weighted/direct expectancy, fixed-dollar equity paths in two orders, underwater drawdowns and a rough running-mean uncertainty band. Wilson, dependence/bootstrap, Sharpe/annualization and p-values are optional extensions with stated prerequisites/limitations. Added solutions, three graduated tasks and diagnostic option feedback; preserved the Chapter1 expectancy primer. Corrected the below-peak count and separated win-probability uncertainty from expected-payoff uncertainty. Verified NIST Dataplot support replaces a misleading Wilson source attribution.
- Changed locations: content/risk-advanced.json, statistics, sources/glossary and partPractice.advanced; figure-renderer.js histogram category-label option; docs/REVISION_SCHEMA.md; rebuilt book/manuscript/evidence and three statistics figures.
- Verification: Recalculated all twenty gross/cost/net outcomes, histogram frequencies, both equity/drawdown paths, every running average/SE band point, and solution arithmetic. 12wins/8losses sum to6.05R; expectancy0.3025R and $605/3.025% on $20,000. Sample SD1.308R and SE0.293R; original drawdown340/20,265 =1.68%, reordered810/20,000 =4.05%; trades7–16 are ten underwater closes and trade17 recovers eleven intervals after peak6. Wilson12/20 interval38.66%–78.12% agrees with the inspected NIST formula. Sharpe's original discussion and NIST/Bailey inference limits were read. All bins and three diagrams inspected at300/760px, linked to the supplied tables and tasks. Rebuilt manuscript and final browser routes at390/1280px show the essential/optional progression and working solutions/diagnostic feedback. Arithmetic and strict content checks pass. This verifies the instructional material, not actual beginner learning or strategy efficacy; see [REVISION_COMPLETION_20261001.md](REVISION_COMPLETION_20261001.md).
- Related IDs: Whole-book progression/practice/evidence CA1-013,015,018–019 and reader-study CA1-026 remain open.

## Teaching acceptance resolutions — /root, 2026-10-01

Substantive earlier-chapter acceptance completes the teaching parents. Original findings and dated partial progress are retained below. Shared evidence: [TEACHING_ACCEPTANCE_20261001.md](TEACHING_ACCEPTANCE_20261001.md). Research/source, historical-gallery and human-reader work remains active.


### CA1-009 — Match illustration types to each chapter's teaching task
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (chapters 1–19 acceptance pass, claimed 2026-10-01)
- Reviewer / date: CA1 / 2026-10-01
- Location: Figures across the manuscript; separate candle and labeling defects are CA1-007–008.
- Finding and evidence: A common line-chart format is used for topics requiring different visual representations. Clean styling does not compensate for missing explanatory geometry or relationships.
- Proposed resolution / acceptance criteria: Add or replace figures according to the chapter-specific requirements below. Split into child items when claiming individual chapters; retain the parent until the agreed scope is addressed or explicitly narrowed with rationale.

| Chapter | Teaching representation to supply |
| --- | --- |
| 3 | Aligned price and volume bars, a defined baseline, and a partial-session comparison. |
| 4 | Identical data on linear/log axes; daily-to-weekly aggregation table; corporate-action comparison. |
| 5 | Swing confirmation revealed bar by bar, plus explicit trendline anchors and a structural transition. |
| 6 | Shaded zones, their construction observations, and later reactions revealed separately. |
| 8 | Pattern-family small multiples and candidate/completed/failed states for the patterns actually taught. |
| 10 | Trending and ranging examples, with crossover timing and whipsaws visible. |
| 11 | Aligned price/ROC or RSI; MACD/signal/histogram; divergences with recognition times. |
| 12 | Gap-aware true-range geometry and a separate Bollinger Band example. |
| 13 | OBV accumulation table and a real volume-profile histogram if profile remains in scope. |
| 15 | Relative-strength ratio alongside stock/benchmark paths; stock/sector/market comparison. |
| 16 | Constituent values/weights that produce both the index move and breadth result. |
| 17 | Synchronized daily/weekly views and explicit treatment of conflicting observations. |
| 18 | Actual open-to-prior-close gap, distinct from the intraday recovery. |
| 19 | Order-book ladder showing 250 shares consuming 100 at $50.10 and 150 at $50.20. |
| 24 | Chronological development/evaluation diagram and a worked cost comparison. |
| 25 | Payoff distribution, underwater drawdown plot, and uncertainty illustration. |
| 27 | Separate Dow/Wyckoff/Elliott explanations with diagrams adequate to the retained scope. |

- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery progress / 2026-10-01: New figure types for chapters 1–19 are integrated, and priority figures were inspected. Finish the chapter-24 chronology/cost representation, chapter-25 distribution/drawdown/uncertainty, and chapter-27 separate framework teaching; remaining earlier illustrations still need a complete topic-by-topic acceptance review.
- Completion progress / 2026-10-01: /root claims the chapters 20–28 and parts 5–6 portion. Whole-book criteria stay open unless separately verified. One shared rebuild will follow source integration.
- Verified completion scope / 2026-10-01: /root — Chapters24,25,27 now have chronology/cost, payoff/underwater/uncertainty, and distinct Dow/Wyckoff/Elliott teaching figures. All24 later-chapter illustrations inspected at300/760px; eight earlier candle diagrams checked for renderer regressions. Remaining: full earlier topic-by-topic representation acceptance review. See [REVISION_COMPLETION_20261001.md](REVISION_COMPLETION_20261001.md). Parent stays open.
- Acceptance pass / 2026-10-01: /root — Review current chapters1–19 and first-four-part practice against the full teaching criteria, preserving verified later-chapter work. Fix demonstrated defects and verify prose, timing, numerical examples and rendered illustrations before disposition. No human-reader or exhaustive research-source certification is implied.
- Disposition: resolved
- Closed by / date: /root (teaching acceptance pass) / 2026-10-01
- Resolution: Reviewed every required representation against the current teaching scope: aligned volume/baseline/time comparisons; linear/log and corporate-action comparison; delayed swings/zones/pattern branches; indicator, participation, weekly-clock, gap and book-depth representations; and the previously verified later diagrams. Corrected mixed bar/line rendering and two narrow-width annotation overlaps.
- Changed locations: content/foundations-price.json; content/indicators-context.json; figure-renderer.js; rebuilt book/manuscript/evidence/SVGs; scripts/verify-early-chapters.cjs; docs/CONTENT_GUIDE.md. Later authoring sources preserved.
- Verification: All 39 early figures inspected at 300/760px, plus six statistics/system regression figures and the affected Wyckoff diagram; all 63 exports match compiled source. Reconstructed all indicator/volume/index series; 126 renders have no overlapping annotation boxes. The corporate-action comparison is a reproducible section table; it does not need an additional price-path drawing. See [acceptance report](TEACHING_ACCEPTANCE_20261001.md) and [browser results](ACCEPTANCE_BROWSER_QA_20261001.json). Both numerical verifiers, standard/strict checks and syntax checks passed; one shared rebuild. Native screenshot/click tools failed; DOM interaction and raster-render inspection are documented separately.
- Related IDs: CA1-018, CA1-019, CA1-022 and CA1-026 remain active.


### CA1-010 — Connect figures, prose, calculations, and exercises
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (chapters 1–19 acceptance pass, claimed 2026-10-01)
- Reviewer / date: CA1 / 2026-10-01
- Location: Whole manuscript; fourteen figure captions begin with “Separate fictional” or “Independent fictional.” Chs. 2 and 18 explicitly distinguish figure data from worked scenarios.
- Finding and evidence: Readers often have to understand separate datasets for the picture and the numerical explanation of one concept. This creates avoidable cognitive load and prevents direct verification.
- Proposed resolution: Reuse the same values across the main figure, example table, calculation, and exercise where it helps. Keep genuinely distinct counterexamples clearly labeled. Add a continuing dataset across chapters where useful.
- Acceptance criteria: Core examples can be traced from supplied data to visible diagram to calculation; every remaining independent scenario has a clear teaching purpose and cannot be mistaken for the main example.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery progress / 2026-10-01: Chapter 9 now connects one signal/gap/failure dataset with figures, accounting, and tasks. Earlier authors aligned many examples; later chapters still require connected risk/plan/journal and system/case records.
- Completion progress / 2026-10-01: /root claims the chapters 20–28 and parts 5–6 portion. Whole-book criteria stay open unless separately verified. One shared rebuild will follow source integration.
- Verified completion scope / 2026-10-01: /root — BRDG-P1 now connects sizing, plan, frozen note, journal and casebook; testing/stats/system figures match their numerical tables. Distinct compounding, excursion and regime examples have stated purposes. Remaining: complete chapters1–19 traceability review. See [REVISION_COMPLETION_20261001.md](REVISION_COMPLETION_20261001.md). Parent stays open.
- Acceptance pass / 2026-10-01: /root — Review current chapters1–19 and first-four-part practice against the full teaching criteria, preserving verified later-chapter work. Fix demonstrated defects and verify prose, timing, numerical examples and rendered illustrations before disposition. No human-reader or exhaustive research-source certification is implied.
- Disposition: resolved
- Closed by / date: /root (teaching acceptance pass) / 2026-10-01
- Resolution: Added manuscript-visible raw inputs for swings, zones, double-top prefix/reveals, momentum and Fibonacci. Corrected chapter-9 filled-price R and cost-inclusive entry cash. Reviewed main figure/prose/table/exercise traceability throughout chapters1–19; independent geometry, tape, gap, range and spread comparisons state their distinct purposes. Retained the verified later bridge/case records.
- Changed locations: content/foundations-price.json; content/indicators-context.json; figure-renderer.js; rebuilt book/manuscript/evidence/SVGs; scripts/verify-early-chapters.cjs; docs/CONTENT_GUIDE.md. Later authoring sources preserved.
- Verification: 524 independent early arithmetic comparisons passed. Core sequences and calculations were read against actual diagrams. Chapter9 maximum-entry R remains100; lower $50.40 entry now freezes80, producing target215/+2.6875R and ordinary stop−85/−1.0625R. All reader routes expose their illustration data. See [acceptance report](TEACHING_ACCEPTANCE_20261001.md) and [browser results](ACCEPTANCE_BROWSER_QA_20261001.json). Both numerical verifiers, standard/strict checks and syntax checks passed; one shared rebuild. Native screenshot/click tools failed; DOM interaction and raster-render inspection are documented separately.
- Related IDs: CA1-018, CA1-019, CA1-022 and CA1-026 remain active.


### CA1-011 — Demonstrate analytical choices before asking beginners to design them
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (chapters 1–19 acceptance pass, claimed 2026-10-01)
- Reviewer / date: CA1 / 2026-10-01
- Location: Chs. 5–9 and 14; especially ch. 6 “Which observations deserve a place on the map?”, ch. 8 exercise, and ch. 14 anchor selection.
- Finding and evidence: The text repeatedly asks readers to choose swings, tolerances, boundaries, anchors, and failure rules without first demonstrating those choices on sufficiently varied charts. Much more space is devoted to caution than guided application.
- Proposed resolution: Teach through a worked clean example, a contrasting case, an ambiguous case, a partially completed exercise, and an independent exercise. Explain why observations are selected or excluded. Include reasonable alternative readings.
- Acceptance criteria: A beginner can follow an author's complete analysis and then attempt an unfamiliar chart with a clear rubric; “specify a rule” is no longer the only bridge from definition to application.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery progress / 2026-10-01: Worked choices and graduated tasks exist in foundations/indicators revisions; perform the outstanding beginner-rubric/alternative-reading review before closing this whole-book teaching item.
- Acceptance pass / 2026-10-01: /root — Review current chapters1–19 and first-four-part practice against the full teaching criteria, preserving verified later-chapter work. Fix demonstrated defects and verify prose, timing, numerical examples and rendered illustrations before disposition. No human-reader or exhaustive research-source certification is implied.
- Disposition: resolved
- Closed by / date: /root (teaching acceptance pass) / 2026-10-01
- Resolution: Verified supplied selection/exclusion rules, contrasting and ambiguous readings in chapters5–9. Added partly filled zone/candidate worksheets and an unfamiliar Fibonacci case with confirmed-anchor chronology and a calculation/timing rubric; retained explicit alternative window and detector policies.
- Changed locations: content/foundations-price.json; content/indicators-context.json; figure-renderer.js; rebuilt book/manuscript/evidence/SVGs; scripts/verify-early-chapters.cjs; docs/CONTENT_GUIDE.md. Later authoring sources preserved.
- Verification: Recomputed strict swing recognition, zone clustering/buffer, pattern tolerance/delay, retest field requirements and both grids. The fresh T6 cutoff supplies high81 and trough76 before the later touch/rebound is revealed; B77.91 is touched by78 and followed by80. Solutions remain collapsed until requested. See [acceptance report](TEACHING_ACCEPTANCE_20261001.md) and [browser results](ACCEPTANCE_BROWSER_QA_20261001.json). Both numerical verifiers, standard/strict checks and syntax checks passed; one shared rebuild. Native screenshot/click tools failed; DOM interaction and raster-render inspection are documented separately.
- Related IDs: CA1-018, CA1-019, CA1-022 and CA1-026 remain active.


### CA1-013 — Strengthen prerequisites and cumulative teaching progression
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (chapters 1–19 acceptance pass, claimed 2026-10-01)
- Reviewer / date: CA1 / 2026-10-01
- Location: Overall sequence; order/exit assumptions appear in ch. 2, detailed sizing in ch. 20, expectancy in ch. 25, and integrated cases in ch. 28.
- Finding and evidence: Advanced evaluation and rule-design demands arrive before some basic execution, risk, and economic concepts have been taught. Cases arrive too late to support progressive practice.
- Proposed resolution: Add an early brief execution/risk/expectancy primer; introduce cumulative cases after chart literacy, structure, indicators, and planning; provide optional branches for advanced statistics and historical frameworks. Retain the generally sensible six-part structure unless a change has a clear teaching benefit.
- Acceptance criteria: Each exercise has taught prerequisites, and the core learning path progresses from reading to interpretation to decisions to evaluation without requiring unstated research expertise.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery progress / 2026-10-01: The early execution/risk/expectancy primer and first four cumulative part reviews are integrated. Later-prerequisite and capstone progression checks remain.
- Completion progress / 2026-10-01: /root claims the chapters 20–28 and parts 5–6 portion. Whole-book criteria stay open unless separately verified. One shared rebuild will follow source integration.
- Verified completion scope / 2026-10-01: /root — Later prerequisites, connected risk-to-review sequence and three-task reviews for parts5–6 are integrated. Statistics inference and classical frameworks are optional; core advanced review does not require the classical chapter. Remaining: whole-book prerequisite and transfer-task audit, including earlier cases. See [REVISION_COMPLETION_20261001.md](REVISION_COMPLETION_20261001.md). Parent stays open.
- Acceptance pass / 2026-10-01: /root — Review current chapters1–19 and first-four-part practice against the full teaching criteria, preserving verified later-chapter work. Fix demonstrated defects and verify prose, timing, numerical examples and rendered illustrations before disposition. No human-reader or exhaustive research-source certification is implied.
- Disposition: resolved
- Closed by / date: /root (teaching acceptance pass) / 2026-10-01
- Resolution: Accepted the explicit early execution/loss/expectancy primer, prerequisite links, six cumulative part reviews and optional Fibonacci/framework/inference branches after substantive early-chapter review. Later integrated planning/journal/system cases retain the verified chronology and assumptions.
- Changed locations: content/foundations-price.json; content/indicators-context.json; figure-renderer.js; rebuilt book/manuscript/evidence/SVGs; scripts/verify-early-chapters.cjs; docs/CONTENT_GUIDE.md. Later authoring sources preserved.
- Verification: Read all early exercises against already taught concepts; supplied assumptions cover the simplified earlier execution models. Recomputed first-four-part transfer tasks and checked all six review routes. No exercise needs future information to select its pre-reveal policy; inference branches remain optional. See [acceptance report](TEACHING_ACCEPTANCE_20261001.md) and [browser results](ACCEPTANCE_BROWSER_QA_20261001.json). Both numerical verifiers, standard/strict checks and syntax checks passed; one shared rebuild. Native screenshot/click tools failed; DOM interaction and raster-render inspection are documented separately.
- Related IDs: CA1-018, CA1-019, CA1-022 and CA1-026 remain active.


### CA1-014 — Expand vignettes into complete worked analyses
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (chapters 1–19 acceptance pass, claimed 2026-10-01)
- Reviewer / date: CA1 / 2026-10-01
- Location: Named worked examples throughout; ch. 5 broken trendline, ch. 9 breakout, ch. 24 cost example, and ch. 28 cases are priorities.
- Finding and evidence: Many examples are short cautionary summaries. They teach a conclusion without providing enough data, anchors, chronological states, or intermediate work for independent reproduction. The arithmetic examples in chs. 10–12 are useful models to preserve.
- Proposed resolution: Supply calculation, interpretation, and full decision-process examples. Make ch. 9 an early integrated case and ch. 28 a deeper casebook with success, failure, gap, skip, and ambiguity under coherent rules; include concepts beyond the recurring breakout setup.
- Acceptance criteria: Readers can reconstruct the reasoning from provided information at each decision time, distinguish assumptions from observations, and trace costs and results into a review record.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery progress / 2026-10-01: Chapter 9 now has a full chronological paper example, branches, costs, skip, and ambiguity policy. Chapters 24–28 and connected later artifacts remain incomplete.
- Completion progress / 2026-10-01: /root claims the chapters 20–28 and parts 5–6 portion. Whole-book criteria stay open unless separately verified. One shared rebuild will follow source integration.
- Verified completion scope / 2026-10-01: /root — Chapters24–28 now provide chronological cost/equity/system and success/failure/gap/skip/conflict/ambiguity cases; the range-recovery case adds non-breakout application. Numbers and corresponding diagrams verified. Remaining: earlier full-analysis/alternative-reading acceptance review. See [REVISION_COMPLETION_20261001.md](REVISION_COMPLETION_20261001.md). Parent stays open.
- Acceptance pass / 2026-10-01: /root — Review current chapters1–19 and first-four-part practice against the full teaching criteria, preserving verified later-chapter work. Fix demonstrated defects and verify prose, timing, numerical examples and rendered illustrations before disposition. No human-reader or exhaustive research-source certification is implied.
- Disposition: resolved
- Closed by / date: /root (teaching acceptance pass) / 2026-10-01
- Resolution: Accepted the completed swing/zone/candle/pattern/indicator/context analyses after reviewing their inputs, recognition times, exclusions, alternatives and outcomes; added complete manuscript input tables and corrected the candle branch sequence and breakout risk contract. Retained previously verified complete later account/system/case analyses.
- Changed locations: content/foundations-price.json; content/indicators-context.json; figure-renderer.js; rebuilt book/manuscript/evidence/SVGs; scripts/verify-early-chapters.cjs; docs/CONTENT_GUIDE.md. Later authoring sources preserved.
- Verification: Independently reconstructed early calculations and key decision clocks; inspected corresponding figures. Failed projection, buffered/nonbuffered crossing, invalidated candidate, confirmation followed by decline, skip and unresolved OHLC/limit-touch outcomes remain visible. Worked notes can be reproduced from declared fields and cutoffs. See [acceptance report](TEACHING_ACCEPTANCE_20261001.md) and [browser results](ACCEPTANCE_BROWSER_QA_20261001.json). Both numerical verifiers, standard/strict checks and syntax checks passed; one shared rebuild. Native screenshot/click tools failed; DOM interaction and raster-render inspection are documented separately.
- Related IDs: CA1-018, CA1-019, CA1-022 and CA1-026 remain active.


### CA1-015 — Add worked exercise solutions and cumulative practice
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (chapters 1–19 acceptance pass, claimed 2026-10-01)
- Reviewer / date: CA1 / 2026-10-01
- Location: Exercises in all 28 chapters and part boundaries.
- Finding and evidence: Most exercises have no worked solution or rubric. A single exercise per chapter offers limited practice and little help diagnosing a misunderstanding.
- Proposed resolution: Add solutions showing intermediate calculations, units, assumptions, and reasoning. For discretionary questions, explain acceptable alternatives. Add graduated and end-of-part exercises applying several concepts together.
- Acceptance criteria: Readers can independently check their work and understand why an answer is defensible; cumulative tasks assess transfer to unfamiliar charts. Answers should be positioned to permit an attempt before reading the solution.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery progress / 2026-10-01: All chapters 1–19 have main solutions and at least two practice tasks. Parts 1–4 have three cumulative tasks each. Chapters 20–28 and parts 5–6 still need worked solutions/practice; empty panels and unavailable links are suppressed, not treated as authored.
- Completion progress / 2026-10-01: /root claims the chapters 20–28 and parts 5–6 portion. Whole-book criteria stay open unless separately verified. One shared rebuild will follow source integration.
- Verified completion scope / 2026-10-01: /root — Chapters20–28 now have main solutions plus guided/independent tasks; parts5–6 each have three cumulative tasks. Every later numerical solution checked, and disclosures work at390/1280px. Strict schema now passes for all28 chapters/six reviews. Remaining: substantive review of inherited earlier solutions/rubrics and whole-book transfer coverage; schema success alone is not closure. See [REVISION_COMPLETION_20261001.md](REVISION_COMPLETION_20261001.md). Parent stays open.
- Acceptance pass / 2026-10-01: /root — Review current chapters1–19 and first-four-part practice against the full teaching criteria, preserving verified later-chapter work. Fix demonstrated defects and verify prose, timing, numerical examples and rendered illustrations before disposition. No human-reader or exhaustive research-source certification is implied.
- Disposition: resolved
- Closed by / date: /root (teaching acceptance pass) / 2026-10-01
- Resolution: Reviewed the inherited early main solutions, guided/independent tasks and first-four-part solutions substantively. Added a lower-fill risk task and fresh anchor transfer task with intermediate arithmetic and rubrics. All28 chapters and all6 parts now have authored, checked solutions rather than empty panels.
- Changed locations: content/foundations-price.json; content/indicators-context.json; figure-renderer.js; rebuilt book/manuscript/evidence/SVGs; scripts/verify-early-chapters.cjs; docs/CONTENT_GUIDE.md. Later authoring sources preserved.
- Verification: Early/later arithmetic verifiers and strict schema pass. At390/1280px, every main/practice solution starts collapsed and opens; each of the six reviews has three working solutions. Fresh foundation, price-action, indicator and anchor problems assess calculation/classification transfer; no human learning effectiveness is claimed. See [acceptance report](TEACHING_ACCEPTANCE_20261001.md) and [browser results](ACCEPTANCE_BROWSER_QA_20261001.json). Both numerical verifiers, standard/strict checks and syntax checks passed; one shared rebuild. Native screenshot/click tools failed; DOM interaction and raster-render inspection are documented separately.
- Related IDs: CA1-018, CA1-019, CA1-022 and CA1-026 remain active.


### CA1-016 — Make knowledge checks diagnose understanding
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (chapters 1–19 acceptance pass, claimed 2026-10-01)
- Reviewer / date: CA1 / 2026-10-01
- Location: Chapter quizzes, especially repeated OHLC/exit-order questions in chs. 2 and 21 and related ambiguity questions later.
- Finding and evidence: Many wrong options contain “must,” “guaranteed,” or similarly obvious overclaims. Readers can select the cautious answer without understanding the calculation or chart. Repetition rarely increases difficulty.
- Proposed resolution: Use plausible distractors based on common errors: wrong denominator, seed, timestamp, price field, or data adjustment. Add chart annotation and error-diagnosis tasks. Reuse concepts with increasing difficulty rather than repeating the same question.
- Acceptance criteria: Knowledge checks require applying the chapter's content; solutions explain the misconception behind each plausible wrong answer.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery progress / 2026-10-01: Chapter 9’s plausible timestamp/order-policy distractors and per-option diagnosis work in the browser. The revised early-chapter quizzes are preserved; chapters 20–28 remain to revise.
- Completion progress / 2026-10-01: /root claims the chapters 20–28 and parts 5–6 portion. Whole-book criteria stay open unless separately verified. One shared rebuild will follow source integration.
- Verified completion scope / 2026-10-01: /root — Nine later quizzes use denominator, clock, price-field, rule-priority or constraint mistakes as distractors, with per-option diagnoses. All27 option feedback strings checked in the final browser at390/1280px. Remaining: earlier quiz-quality/repetition audit. See [REVISION_COMPLETION_20261001.md](REVISION_COMPLETION_20261001.md). Parent stays open.
- Acceptance pass / 2026-10-01: /root — Review current chapters1–19 and first-four-part practice against the full teaching criteria, preserving verified later-chapter work. Fix demonstrated defects and verify prose, timing, numerical examples and rendered illustrations before disposition. No human-reader or exhaustive research-source certification is implied.
- Disposition: resolved
- Closed by / date: /root (teaching acceptance pass) / 2026-10-01
- Resolution: Reviewed all earlier questions and per-option diagnoses: denominator, OHLC field, aggregation, seed, recognition time, detector, cost and execution errors replace obvious certainty distractors. Improved chapter3 with the included-current-session baseline error. Retained verified later diagnosis questions.
- Changed locations: content/foundations-price.json; content/indicators-context.json; figure-renderer.js; rebuilt book/manuscript/evidence/SVGs; scripts/verify-early-chapters.cjs; docs/CONTENT_GUIDE.md. Later authoring sources preserved.
- Verification: Inspected all early distractors against chapter arithmetic/timing; chapter3 wrong1.68 is derived from(5×.36+.70)/6 rather than an unsupported number. All84 option feedback strings match the selected answer at each of390/1280px, across28 chapter routes. See [acceptance report](TEACHING_ACCEPTANCE_20261001.md) and [browser results](ACCEPTANCE_BROWSER_QA_20261001.json). Both numerical verifiers, standard/strict checks and syntax checks passed; one shared rebuild. Native screenshot/click tools failed; DOM interaction and raster-render inspection are documented separately.
- Related IDs: CA1-018, CA1-019, CA1-022 and CA1-026 remain active.


### CA1-017 — Reduce repetitive caveats and replace abstract instructions with demonstrations
- Priority / type: P2 / editorial recommendation
- Status: in_progress
- Owner: /root (chapters 1–19 acceptance pass, claimed 2026-10-01)
- Reviewer / date: CA1 / 2026-10-01
- Location: Whole manuscript; ch. 8 “What research can and cannot settle” is one example of abstract language that would benefit from numbers.
- Finding and evidence: Nearly identical chapter lengths and structures give simple and complex topics similar space. Repeated fictional-data, hindsight, independence, execution, and “needs testing” caveats crowd out teaching. Sentences are generally clear, but sustained reading becomes monotonous.
- Proposed resolution: Establish shared principles once, cross-reference them briefly, and keep the caveat specific to the current tool. Add concrete examples before statistical abstractions. Vary structure and length according to the teaching task.
- Acceptance criteria: The manuscript retains its essential honesty and limits while spending more of each core chapter on demonstration, application, and distinct insight. Do not replace repetition with unsupported certainty.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery progress / 2026-10-01: Earlier revisions replace several caveats with demonstrations, and chapter 9 is now a complete walkthrough. Sustained-reading editorial review and later-chapter demonstrations remain.
- Completion progress / 2026-10-01: /root claims the chapters 20–28 and parts 5–6 portion. Whole-book criteria stay open unless separately verified. One shared rebuild will follow source integration.
- Verified completion scope / 2026-10-01: /root — Later instruction now demonstrates completed records, decision branches and alternatives rather than leaving essential policies blank. New artifact/calculation text was spaced for readability, and redundant/misleading draft qualifications were corrected. Remaining: whole-book repetition and teaching-balance editorial review. See [REVISION_COMPLETION_20261001.md](REVISION_COMPLETION_20261001.md). Parent stays open.
- Acceptance pass / 2026-10-01: /root — Review current chapters1–19 and first-four-part practice against the full teaching criteria, preserving verified later-chapter work. Fix demonstrated defects and verify prose, timing, numerical examples and rendered illustrations before disposition. No human-reader or exhaustive research-source certification is implied.
- Disposition: resolved
- Closed by / date: /root (teaching acceptance pass) / 2026-10-01
- Resolution: Completed a sustained-reading teaching-balance review. Current early chapters demonstrate selection, exclusion, chronology, arithmetic and alternatives; the later chapters develop full records and varied cases. Cleaned compressed notation and supplied reproducible worksheets/raw inputs where abstract instructions still impeded application. Kept topic-specific limitations and optional scope without padding or a universal word target.
- Changed locations: content/foundations-price.json; content/indicators-context.json; figure-renderer.js; rebuilt book/manuscript/evidence/SVGs; scripts/verify-early-chapters.cjs; docs/CONTENT_GUIDE.md. Later authoring sources preserved.
- Verification: Read all19 early chapters and exercises alongside the retained later review. Checked that cautions name the measurement or missing evidence and accompany a concrete example. Section prose varies960–2,946 words; optional Fibonacci is976 versus statistics2,313/system2,946. This editorial judgment resolves the recommendation; it is not target-reader validation (CA1-026 remains open). See [acceptance report](TEACHING_ACCEPTANCE_20261001.md) and [browser results](ACCEPTANCE_BROWSER_QA_20261001.json). Both numerical verifiers, standard/strict checks and syntax checks passed; one shared rebuild. Native screenshot/click tools failed; DOM interaction and raster-render inspection are documented separately.
- Related IDs: CA1-018, CA1-019, CA1-022 and CA1-026 remain active.


### CA1-025 — Align chapter scope and titles with demonstrated coverage
- Priority / type: P2 / editorial recommendation
- Status: in_progress
- Owner: /root (chapters 1–19 acceptance pass, claimed 2026-10-01)
- Reviewer / date: CA1 / 2026-10-01
- Location: Ch. 11 “exhaustion”; ch. 18 “changes of regime”; ch. 13 volume profile; ch. 14 Fibonacci; ch. 27 classical frameworks.
- Finding and evidence: Some titles promise more than the chapter develops. Fibonacci receives comparable space to much broader essential topics, and optional historical material competes with the core beginner path.
- Proposed resolution: Define and teach promised concepts or narrow the titles. Consider optional placement/shortening for Fibonacci and classical frameworks. Illustrate and develop volume profile if retained, or explicitly make it optional. Let useful learning outcomes determine length.
- Acceptance criteria: Titles accurately describe the lessons supplied; the core reading path prioritizes chart competence, risk, and evidence; scope choices are documented rather than silently omitted.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery progress / 2026-10-01: Momentum/event titles are narrowed in the preserved revision; profile is illustrated; Fibonacci/classical and selected inference topics are optional. Review retained classical scope, Fibonacci length, and remaining promised learning outcomes before closure.
- Completion progress / 2026-10-01: /root claims the chapters 20–28 and parts 5–6 portion. Whole-book criteria stay open unless separately verified. One shared rebuild will follow source integration.
- Verified completion scope / 2026-10-01: /root — Classical frameworks is a bounded optional introduction with separate illustrations; necessary Elliott checks are not a complete validated count, and spring timing alternatives are explicit. Essential statistics now substantially exceeds narrow optional topics in teaching depth. Remaining: earlier title/outcome alignment and Fibonacci scope/length review. See [REVISION_COMPLETION_20261001.md](REVISION_COMPLETION_20261001.md). Parent stays open.
- Acceptance pass / 2026-10-01: /root — Review current chapters1–19 and first-four-part practice against the full teaching criteria, preserving verified later-chapter work. Fix demonstrated defects and verify prose, timing, numerical examples and rendered illustrations before disposition. No human-reader or exhaustive research-source certification is implied.
- Disposition: resolved
- Closed by / date: /root (teaching acceptance pass) / 2026-10-01
- Resolution: Accepted narrowed momentum/events titles, demonstrated volume-profile coverage and explicit optional Fibonacci/classical/inference paths after comparing titles, outcomes, prose and figures. Fibonacci remains a bounded convention/anchoring lesson; added transfer practice rather than unsupported efficacy claims. Retained the verified separate classical-framework scope.
- Changed locations: content/foundations-price.json; content/indicators-context.json; figure-renderer.js; rebuilt book/manuscript/evidence/SVGs; scripts/verify-early-chapters.cjs; docs/CONTENT_GUIDE.md. Later authoring sources preserved.
- Verification: Read titles/outcomes against every early lesson; recalculated profile/tape totals and grid/anchor examples; inspected profile and anchor figures. Optional metadata appears in the browser and essential later statistics/system teaching receives greater depth. Retained framework diagrams and recognition limits were checked in the prior completion report and renderer regression review. See [acceptance report](TEACHING_ACCEPTANCE_20261001.md) and [browser results](ACCEPTANCE_BROWSER_QA_20261001.json). Both numerical verifiers, standard/strict checks and syntax checks passed; one shared rebuild. Native screenshot/click tools failed; DOM interaction and raster-render inspection are documented separately.
- Related IDs: CA1-018, CA1-019, CA1-022 and CA1-026 remain active.



### CA1-018 — Broaden empirical research coverage and explain the evidence
- Priority / type: P2 / source support
- Status: in_progress
- Owner: /root (research/source audit, claimed 2026-10-01)
- Reviewer / date: CA1 / 2026-10-01
- Location: Chs. 7–15, 24–27 and any general claims about technical analysis effectiveness.
- Finding and evidence: Source notes responsibly distinguish definitions from efficacy, but research discussion relies heavily on Lo–Mamaysky–Wang and Bailey et al. The manuscript does not yet synthesize the wider evidence or help readers distinguish confidence across methods.
- Proposed resolution: Explain cross-sectional versus time-series momentum, technical-rule selection/costs/persistence, pattern recognition, relevant mechanisms, behavioral evidence, and limitations. Include supportive, adverse, and mixed findings rather than treating all techniques as equally supported or unsupported.
- Acceptance criteria: Material empirical claims describe market/sample, rule, comparator, costs, result, and limitations. Do not transfer futures or FX findings directly to stock chart methods. New citations must be read and verified; the starting points below are not a completed literature review.
- Research starting points: [Lo–Mamaysky–Wang](https://business.columbia.edu/sites/default/files-efs/pubfiles/19268/Lo-Mamaysky_wang_foundations.pdf); [Jegadeesh–Titman](https://onlinelibrary.wiley.com/doi/10.1111/j.1540-6261.1993.tb04702.x/abstract); [Moskowitz–Ooi–Pedersen](https://fairmodel.econ.yale.edu/ec439/mosk.pdf); [Bajgrowicz–Scaillet](https://www.sciencedirect.com/science/article/pii/S0304405X1200116X); [Osler](https://www.newyorkfed.org/research/staff_reports/sr125.html). Some publisher pages blocked automated access during the audit; that does not establish that the links are broken.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery progress / 2026-10-01: The inherited research-context synthesis is integrated in the evidence view and adds chapter-24/25 discussion. It is not a new independent verification of every source; finish cross-book claim/sample/comparator/cost alignment and later-chapter integration.
- Source audit claim / 2026-10-01: /root — Inspect substantive claims against primary/provider sources; complete empirical sample/rule/comparator/cost/result/limitation records and glossary alignment. Preserve blocked or unverified access honestly. One rebuild after the source corrections are ready.

- Resumption / 2026-10-02: /root — Continuing the existing claim. Inspect interrupted authoring edits against saved primary-source passages and current pages, finish research-table/study-record export and glossary traceability, then rebuild and verify the reader edition. Also reconcile stale status documents and identify usage-limit leftovers at the user's request.
- Disposition: resolved
- Closed by / date: /root (source audit and usage-limit recovery) / 2026-10-02
- Resolution: Completed the interrupted primary-study synthesis, contrasting cross-sectional stock momentum, own-return futures momentum, algorithmic pattern information, adverse daily-rule selection/cost findings, FX mechanisms and household turnover. Corrected sample/version dates, comparators, cost units and selected results; added explicit chapter connections and the comparative confidence table. Every empirical record has a rendered five-field study specification and adjacent limitations. Definitions and exact textbook rules without inspected efficacy remain explicitly bounded.
- Changed locations: content/foundations-price.json, content/indicators-context.json, content/risk-advanced.json, content/research-context.json; app.js; scripts/build-content.cjs and check-content.cjs; regenerated book/manuscript/evidence matrix. Report: [SOURCE_AUDIT_20261002.md](SOURCE_AUDIT_20261002.md).
- Verification: Read the six original papers at the exact locations recorded in the matrix, including actual cost/result pages and figures; compared market/sample/rule/comparator/cost/result text. Inspected the rebuilt manuscript and browser evidence DOM; all sixteen study specifications and the comparative table rendered. Fourteen empirical records are represented; repeated chapter specifications are not distinct studies. Arithmetic verifiers, standard/strict and syntax checks passed; authoring-to-book integration matches exactly. Phone evidence view had no page overflow. Snapshot failures and later preview disconnection limit final visual QA. See the report and [source metadata](SOURCE_INSPECTIONS_20261002.json).
- Limits: Selected studies are not an exhaustive literature review or evidence for present-day retail stock profitability. FX/futures results are not transferred to stock chart methods. Definition/proponent evidence is not efficacy evidence. No human reader validation was performed.
- Related IDs: CA1-019 resolved in the same integration; CA1-022 remains open, CA1-026 deferred.


### CA1-019 — Make claim-to-source support inspectable
- Priority / type: P2 / source support
- Status: in_progress
- Owner: /root (research/source audit, claimed 2026-10-01)
- Reviewer / date: CA1 / 2026-10-01
- Location: Chapter sources, glossary, and future empirical additions; particularly breadth and psychological claims with sparse direct support.
- Finding and evidence: Chapter-level support notes are helpful, but the audit did not verify every claim against all 52 unique linked URLs. More citations alone would not establish support. Some topics need more direct sourcing and a clearer evidence classification.
- Proposed resolution: Maintain an evidence matrix for material empirical claims and identify definitions, arithmetic, mechanisms, historical findings, invented teaching rules, and unresolved claims. Record exact source locations and review dates where useful. Identify suggestions as suggestions rather than proven interventions.
- Acceptance criteria: An independent reviewer can trace substantive claims to appropriate evidence and see what was actually checked. Original teaching calculations need transparent derivations, not decorative citations. Do not label all sources verified based only on successful link retrieval.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery progress / 2026-10-01: The evidence matrix builds; five inherited empty limits were supplied, and Chapter 9/CMT reference records were added. Most later chapters still lack chapter-specific records; independently inspect substantive inherited research claims before certifying the whole matrix.
- Completion progress / 2026-10-01: /root claims the chapters 20–28 and parts 5–6 portion. Whole-book criteria stay open unless separately verified. One shared rebuild will follow source integration.
- Verified completion scope / 2026-10-01: /root — All nine later chapters have claim-specific evidence records; substantive newly cited sources and selected inherited Lo/Bailey/Bajgrowicz/Sharpe discussions were inspected, and transparent arithmetic recalculated. Blocked pages are not presented as inspected; source-locations/limits are recorded in the completion report and matrix. Remaining: chapters1–19 and inherited research/glossary claim alignment audit. See [REVISION_COMPLETION_20261001.md](REVISION_COMPLETION_20261001.md). Parent stays open.
- Teaching acceptance progress / 2026-10-01: /root — Recomputed early teaching calculations (524 comparisons), supplied exact manuscript input tables and verified figures/solution clocks. This is arithmetic/teaching evidence only. Inherited empirical, definition and glossary source alignment still requires independent source inspection; this item remains open.
- Source audit claim / 2026-10-01: /root — Inspect substantive claims against primary/provider sources; complete empirical sample/rule/comparator/cost/result/limitation records and glossary alignment. Preserve blocked or unverified access honestly. One rebuild after the source corrections are ready.
- Resumption / 2026-10-02: /root — Continuing the existing claim together with CA1-018. Preserve earlier inspection dates and evidence; distinguish newly checked source passages, inherited checks and access failures. One coordinated build after integration is ready.
- Disposition: resolved
- Closed by / date: /root (source audit and usage-limit recovery) / 2026-10-02
- Resolution: Completed the early-chapter/research/glossary alignment scope left by the prior passes. The matrix now provides 173 classified claim records with support locations, dates and limits; all 105 glossary terms have exactly one support assignment in 31 groups. Corrected inaccurate/transient source locators, direct support for breadth and behavioral distinctions, the SEC reuse URL/scope and impulse/cost terminology. Original calculations and working teaching conventions are explicit. Study specifications and appendix tables are exported to both reader and manuscript; access dates are labelled as access, rather than blanket verification.
- Changed locations: All four authoring JSON files; app.js; scripts/build-content.cjs and check-content.cjs; index.html versioned script URLs; rebuilt content/book.js, docs/MANUSCRIPT.md and docs/EVIDENCE_MATRIX.md; current README/guide/schema/status notes. Inspection scope and recovery: [SOURCE_AUDIT_20261002.md](SOURCE_AUDIT_20261002.md); [metadata manifest](SOURCE_INSPECTIONS_20261002.json).
- Verification: Inspected selected original/provider/official source passages against the exact claims and limits, including saved directly retrieved originals when current web access failed. Recalculated teaching examples through the two existing numerical verifiers (524 early comparisons plus later-chapter/Atlas/case checks). Standard and strict checks passed, including complete unique glossary coverage and study fields. Generated chapters/research/source maps exactly match authoring integration; output hashes are recorded. Browser evidence view exposes study and glossary records; same-origin edition 0.4 was verified after cache correction. All 63 SVGs match the earlier inspected geometry byte-for-byte. No successful retrieval is treated as full-source certification, and browser/screenshot limits are recorded.
- Limits: An independent reviewer can trace the stated substantive support and see its scope; this does not certify every sentence on every cited page. Unresolved efficacy and proposed process interventions stay identified. No human reader study or complete historical gallery is claimed.
- Related IDs: CA1-018 resolved in the same integration; CA1-022 remains open, CA1-026 deferred.

### CA1-022 — Add documented historical cases with an honest selection process
- Priority / type: P2 / editorial recommendation
- Status: in_progress
- Owner: /root (historical gallery, claimed 2026-10-02)
- Reviewer / date: CA1 / 2026-10-01
- Location: Ch. 28 and integrated cases throughout the book.
- Finding and evidence: Every market path is fictional. This is disclosed correctly and works for isolating concepts, but readers lack practice transferring skills to actual market irregularity.
- Proposed resolution: Retain synthetic teaching examples and add appropriately sourced real cases, including ordinary, successful, failed, skipped, and ambiguous examples. Document symbol, dates, data source/reuse basis, sessions, adjustments, information cutoff, and execution assumptions. Select systematically rather than only for dramatic outcomes.
- Acceptance criteria: Historical cases can be independently located and their data conventions understood; reuse is supported; hindsight annotations are distinguished from contemporaneously available information. A case gallery must not be presented as a strategy performance estimate.
- Discussion / progress: /root, 2026-10-01 — Claimed for coordinated content, evidence, practice, and illustration revision. Closure requires inspection of the rebuilt reader edition and standalone manuscript.
- Recovery progress / 2026-10-01: Historical GME/Apple extracts already exist in research-context and are integrated with provenance, selection limits, and cutoff discussion. They are narrower than the requested historical case gallery and are not a completed strategy-performance study.
- Current scope / 2026-10-02: /root — The source/reuse boundaries of the existing limited extracts were rechecked in the source audit. The broader systematic gallery is still unfinished; expansion needs a documented reusable data source and case-selection/convention record. No chart-gallery or strategy-performance acceptance is claimed.

- Completion / 2026-10-02: /root — Integrated all 36 fixed AAPL/MSFT/SPY monthly 2016 windows, four earliest outcome-class representatives and a separately disclosed post-audit historical ambiguity diagnostic. Preserved depositor metadata/CC0 declaration, versioned download URLs, full-source/extract hashes, exact decimals and selection/clock conventions. No adjusted-vintage values are asserted to be contemporaneous quote prices.
- Disposition: resolved
- Closed by / date: /root (historical teaching gallery) / 2026-10-02
- Resolution: Added a systematically recorded real-stock/ETF teaching gallery while retaining fictional execution and sparse historical fact cases. Actual archived prices demonstrate favorable continuation, an adverse check, a completed skip and an ordinary unresolved window; a later dual-level candle supplies a clearly separated ambiguous-order exercise. Every original calendar cell stays visible; class representatives and the diagnostic selection are explained. Reuse relies on the depositor’s explicit CC0-1.0 declaration, with unknown upstream/session/adjustment details disclosed. No gallery counts or path labels are presented as trade results or strategy performance.
- Changed locations: content/research-context.json; Chapter 28 orientation and transfer practice in content/risk-advanced.json; data/historical/ metadata, extracts, provenance and complete case ledger; scripts/verify-historical.cjs; generated book/manuscript/evidence matrix and assets/figures/case-studies-5.svg through -9.svg; index.html content cache query; status/guide documentation.
- Verification: Independently recalculated all 36 means, gates, exact unrounded levels and first-observation clocks from preserved CSVs; validated source-extract hashes, representative ordering, all displayed table/figure inputs and original skip for the supplementary diagnostic. Existing numerical verifiers, new historical verifier, standard/strict checks and syntax check passed. Final authoring sections/prose and exported SVGs match generated outputs. Read affected manuscript/evidence/provenance and inspected all five historical illustrations at 300/760px in the native browser; corrected missing compact sequence labels through existing renderer options and a second coordinated correction rebuild. Initial rebuilt Chapter 28 rendered 17 sections/9 figures and a 36-row ledger at 1280/390px without page overflow. Final corrected diagnostic was visually inspected; a later preview disconnection prevented the final repeated live chapter sweep. Full scope, screenshot evidence and limitations: [completion report](HISTORICAL_AND_READER_PREP_20261002.md).
- Limits: A selected educational archive gallery, not an unbiased historical stock universe, certified exchange feed, independently warranted chain of title, point-in-time price vintage or executable strategy trial. Undocumented exact session/time-zone and adjustment algorithm are visible limits. Actual reader learning has not been validated.
- Related IDs: CA1-026 study materials are complete; actual human observations/revisions remain deferred, as the user confirmed participants are unavailable.

## Critical re-audit resolution — /root, 2026-10-02

Original reopening evidence, claims and acceptance criteria are retained below. This closure supplements earlier history; it does not erase prior findings.

### CA1-015 — Reopened: Chapter 6 guided practice has the wrong worked solution
- Priority / type: P1 / defect
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root (critical re-audit) / 2026-10-02
- Location: `content/foundations-price.json`, `support-resistance`, guided practice “Guided: stop before the reveal”; current `docs/MANUSCRIPT.md` near lines 1098–1114; prior complete finding and closure remain in `FEEDBACK_RESOLVED.md` under CA1-015.
- Finding and evidence: The original finding required usable, checked worked solutions. The current guided question asks the reader to fill a resistance zone from peaks 55.10/54.90/55.30, a 0.20 upward buffer, and classify 55.20/55.40/55.60. Its solution instead reports the unrelated D12 support zone 39.80–40.35, downward threshold 39.50, and D13–D16 results. It contains none of the requested answers. The independent practice immediately afterward repeats the guided question's same numbers and has the relevant resistance solution. The strict schema and 524-comparison arithmetic script both pass, so their success does not verify question-to-solution alignment.
- Proposed resolution: Answer the actual guided resistance worksheet (zone 54.90–55.30; upward threshold 55.50; visit / edge crossing / buffered break) or restore a question that matches its existing support solution. Give independent practice fresh inputs if this guided resistance task is retained. Inspect every current question/solution pair rather than relying on nonempty fields and existing arithmetic checks.
- Acceptance criteria: The generated browser and manuscript solution explicitly answers every requested guided field; the independent task requires transfer beyond repeating the same values. Record the substantive question-to-solution review and fix any further mismatches discovered. Preserve the prior closure history and this reopening evidence.
- Discussion / progress: /root, 2026-10-02 — Reopened on direct comparison of the current question and solution; no authoring changes made in this audit.
- Additional teaching evidence / 2026-10-02: Several independent tasks reuse an answer already calculated immediately above: Chapter 10's range switches, Chapter 13's last price/POC/VWAP, Chapter 17's final spot-versus-futures values, and Chapter 19's 100-of-250 partial fill. These are useful rehearsal but weak evidence of independent transfer. Retain rehearsal explicitly, and add fresh values or unfamiliar charts to the independent tier. Chapters 14, 20 and 25 show that genuinely different inputs are already possible without expanding every chapter substantially.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Corrected Chapter 6 guided resistance zone/threshold/classifications; supplied fresh independent data in Chapters 6, 10, 13, 17 and 19.
- Changed locations: content/foundations-price.json; content/indicators-context.json; rebuilt book.js/docs/MANUSCRIPT.md
- Verification: Reviewed 109 exercise/practice/review pairs; independently recalculated new arithmetic. Answer print shows 54.90–55.30 and 55.50, while independent task uses 72.10–72.60 / 72.85. No further pair mismatch found.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### CA1-016 — Reopened: knowledge-check answer positions provide a shortcut
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: All 28 chapter quizzes in the authoring JSON; original finding and closure in `FEEDBACK_RESOLVED.md`.
- Finding and evidence: The improved plausible distractors are worth preserving. However, 20 of 28 correct answers occupy the second position, six the third and only two the first. Every quiz in Chapters 20–28 has its correct answer second. Choosing position two scores 71.4% across the book and 100% across those nine chapters without using their content. Browser feedback is mechanically correct; the assessment design is the problem.
- Proposed resolution: Deliberately vary answer positions, updating the answer index and corresponding feedback together. Preserve misconception-based distractors.
- Acceptance criteria: No long deterministic answer-position run; all option feedback still matches its option; success requires chapter knowledge rather than a positional pattern.
- Discussion / progress: Reopened after enumerating all 28 current answer indices and exercising all 84 option-feedback interactions. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Reordered each option with its diagnostic feedback; correct positions now 9/10/9 with maximum run two.
- Changed locations: All four authoring JSON files; rebuilt book.js/manuscript
- Verification: Compared original correct texts and option-to-feedback mappings to preserved pre-edit sources; all unchanged. All 84 native browser option interactions passed.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### CA1-024 — Reopened: the isolated R-multiple definition loses the book's denominator convention
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `content/risk-advanced.json`, glossary “R multiple”; Chapters 20–21; prior glossary finding/closure in `FEEDBACK_RESOLVED.md`.
- Finding and evidence: The glossary says only “Trade result divided by the original planned dollar risk.” The chapters carefully distinguish an all-in risk budget from frozen price-risk based on filled shares, and deduct costs from net results. The glossary does not say whether costs belong in the numerator or denominator or whether planned order size versus actual filled size supplies the risk. That ambiguity revives precisely the denominator error the exercises teach readers to avoid. The corrected aliases and observational support/resistance wording remain sound.
- Proposed resolution: State this edition's net-result / frozen filled-position price-risk convention, with costs excluded from that denominator; acknowledge other conventions when named.
- Acceptance criteria: A reader using the isolated entry gets the same R for the cost-inclusive and partial-fill examples as the chapter solutions.
- Discussion / progress: Confirmed by filtering the live glossary and comparing its displayed definition with the later worked records. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Made isolated R definition explicit: net P&L after costs / frozen actual-filled-position price-risk, excluding costs in denominator; distinguished order budget and unfilled cases.
- Changed locations: content/risk-advanced.json glossary; rebuilt browser/manuscript glossary
- Verification: Independent Decimal calculations reproduce cost-inclusive −2.625R and partial-fill −1.583333R; live deep-linked glossary agrees with the chapter convention.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-001 — The MSFT rounding warning does not work with its stated numbers
- Priority / type: P1 / defect
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `content/research-context.json`, Chapter 28 addition “MSFT February: the continuation check fails”; manuscript near line 5502.
- Finding and evidence: Lower boundary 51.82353 and next open 51.830 correctly classify the opening as inside. The prose claims rounding that boundary to cents could turn the later intrabar touch into an opening classification. Ordinary nearest-cent rounding gives 51.82; 51.830 remains above 51.82, so the classification does not change. The warning's general principle is reasonable, but this is not a working numerical example of it. A directed upward rounding to 51.83 would differ and is not the stated convention.
- Proposed resolution: Remove the unsupported counterexample claim or supply an explicitly fictional near-boundary example that actually changes classification. Preserve archived historical values and the correct adverse-path result.
- Acceptance criteria: Show both comparisons under the named rounding convention; any claimed classification change really occurs.
- Discussion / progress: Direct decimal comparison verifies the defect; historical verification passes because the actual classification is correct. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Removed the unsupported historical rounding claim; explained unchanged nearest-cent classification and added a separately fictional example that really changes it.
- Changed locations: content/research-context.json Chapter 28 MSFT section; rebuilt manuscript/book
- Verification: 51.82353→51.82 stays below open 51.830; fictional51.826→51.83 crosses comparison with open 51.828. Historical verification and source values remain intact.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-002 — The ten-session exit has contradictory clocks
- Priority / type: P1 / defect
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `content/risk-advanced.json`, Chapter 24 “Write the rule before seeing the answer”; Chapter 26 Atlas-20 earnings filter. Related earlier capstone item: CA1-020, already resolved.
- Finding and evidence: One Chapter 24 paragraph says entry counts as session 1 and exit is its tenth close, then says “the close of the tenth session after entry.” The latter normally excludes the entry session and is one session later. Chapter 26 also calls t+1…t+10 the “longest possible holding window” while explicitly allowing halts to prevent exits. A halt can extend elapsed holding beyond the planned limit. Readers building an inspectable rule should not have to choose between these clocks.
- Proposed resolution: Use one inclusive holding-session definition, an explicit entry-day example, and an overdue-exit rule for a halt. Call the earnings horizon the planned holding window rather than an unconditional maximum.
- Acceptance criteria: A worked entry-day calendar has a single exit date; a halt spanning the deadline has an explicit resumptive disposition and the calendar wording agrees.
- Discussion / progress: Verified against current prose and the session-10 time-exit rows. This finding concerns clock wording, not a claim that the existing portfolio arithmetic is wrong. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Unified inclusive E1→E10 holding clock and planned earnings horizon; implemented first resumed-open overdue exit after opening gap checks and before intraday tests.
- Changed locations: content/risk-advanced.json Chapters24/26; scripts/atlas20-sim.cjs; scripts/verify-revision.cjs; rebuilt outputs
- Verification: Verified E1/E10 calendar wording and halt deadline example. Regression tests both opening-stop priority and overdue-open branches; ordinary ledger verification passes unchanged.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-003 — Prospective exercises reveal future outcomes before the attempted decision
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: Chapters 6, 22 and 28, especially the casebook's historical gallery; `app.js` chapter rendering. Related: CA1-015 and the resolved CA1-011/022.
- Finding and evidence: Chapter 6 asks for a D12 cutoff after showing the whole continuation. Chapter 22's attempt follows the already-discussed P1 continuation. Chapter 28 tells readers to cover future rows, but displays outcome-bearing headings, a completed calendar ledger, continuation prose and whole-path figures before or alongside the task. Only solutions have actual reveal controls. The instruction is intellectually sound, but the presentation makes an uncontaminated attempt difficult and introduces answer leakage. This is a teaching-design recommendation, not a claim of falsified historical selection.
- Proposed resolution: Provide a learner view with cutoff inputs first, then an explicit continuation reveal and result reconciliation. Keep the complete ledger accessible in a reference view. Give printed editions a meaningful page/order separation.
- Acceptance criteria: A first-time reader can attempt a cutoff decision without seeing future labels, values or outcome headings; the full ledger and provenance remain available afterward.
- Discussion / progress: Confirmed by manuscript order and live rendering. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Added cutoff-only packets and explicit continuation reveals in Chapters 6/22/28. Fresh LARK path supplies an unexposed Chapter 22 decision; casebook selection/adjustment limits precede neutral cutoff tables.
- Changed locations: Authoring JSON learnerAttempt fields; app.js; styles.css; build-content.cjs; rebuilt manuscript/book
- Verification: Native checkVisibility finds zero visible outcome headings before reveal for each packet; input row counts12/1/24. Historical rows retain exact inputs; complete ledger/provenance available after reveal. Actual sampled A4 print places continuation on a later page.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-004 — Chapter chart legends do not identify their colored series
- Priority / type: P2 / defect
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `figure-renderer.js`, `chart()` legend construction; Chapter 10 moving-average illustration and other multiseries chapter figures.
- Finding and evidence: Paths have green/rust/gold strokes, while the legend is uniform muted text joined with dots, such as “Close · 5-session SMA · 5-session EMA.” There are no matching swatches, keyed line styles or endpoint names. The reader cannot reliably map the SMA versus EMA from the image alone, particularly where lines overlap. The playground has real swatches, so the two chart systems behave differently. Series order in code is not a visible legend key.
- Proposed resolution: Render a keyed legend and distinguish series by more than hue where needed. Use the same convention in browser and exported SVGs.
- Acceptance criteria: Identify each plotted series unambiguously from the rendered image at narrow and wide sizes and in grayscale; raw data remains available.
- Discussion / progress: Verified in live Chapter 10 at 390px and renderer source; screenshot in the audit report. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Added matching line/bar swatches and distinct solid/dashed/dotted line patterns with wrapping legends.
- Changed locations: figure-renderer.js; rebuilt68 SVGs and live chapter charts
- Verification: Inspected moving-average legend at compact/wide widths: each line identifiable by keyed style as well as hue. Browser geometry passes for all figures; raw data remains available.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-005 — “Skip to content” routes to the error page
- Priority / type: P1 / defect
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `index.html` skip link; `app.js`, `route()` and hashchange handler.
- Finding and evidence: The skip link targets `#main`, but the router treats `main` as an unknown route. Activating that fragment from a chapter replaces the chapter with “This page is not in the atlas.” This breaks a primary keyboard-accessibility shortcut and destroys the reader's current context.
- Proposed resolution: Handle the skip link as focus/scroll within the current route, or explicitly exempt this fragment from route dispatch.
- Acceptance criteria: Keyboard activation focuses the current main content without replacing it, on home, chapters and reference pages; subsequent tabbing reaches the intended content controls.
- Discussion / progress: Reproduced in the native browser from Chapter 2 by activating the link's exact `#main` fragment; it displays the error page. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Intercepted skip-link activation to focus/scroll main within the existing route.
- Changed locations: app.js
- Verification: Native keyboard Enter then Tab checks on home, chart-anatomy and glossary preserve routes, focus main and reach the intended next content control.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-006 — Search excludes substantial instructional content and silently truncates matches
- Priority / type: P2 / defect
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `app.js`, `renderSearch()`.
- Finding and evidence: The index contains titles, tags and section paragraphs but excludes tables, exercises, practice, worked solutions, figure captions, examples and research/evidence records. Searching “2016-03-03” or “9.29%” returns no results despite those values appearing in the current historical/research material. Results are limited to 18 chapters and six glossary entries without an indication that others were omitted. This impairs verification and reference use, not just keyword convenience.
- Proposed resolution: Index all reader-visible instructional fields and evidence summaries; show match counts, meaningful snippets and a path to remaining matches.
- Acceptance criteria: Known unique table, exercise and study strings return their actual locations; broad queries disclose the total and permit access to every match.
- Discussion / progress: Both no-result examples reproduced through native search interactions; omitted fields and truncation confirmed in source. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Indexed all substantial instructional fields, table rows, tasks/solutions, figures, glossary, part reviews and studies; return counts/snippets/stable location URLs and all results.
- Changed locations: app.js search index/rendering
- Verification: Native search 2016-03-03 finds2 locations;9.29% finds4 study locations;32.08 finds fresh exercise; broad risk exposes100 accessible matches with total/all-results label.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-007 — Narrow-screen readers have no chapter contents or persistent navigation
- Priority / type: P2 / editorial recommendation
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `styles.css`, reading-aside breakpoint and topbar; long Chapters 24–28.
- Finding and evidence: At widths below 1150px the chapter contents aside disappears without a replacement. At phone widths the menu/search controls scroll away with the nonsticky topbar. Chapter 28 is 43,375px tall at 320px in the audit render. A reader trying to revisit a historical case, source or exercise must scroll extensively or return to the top. The desktop's main learning navigation is unavailable for the users who need it most.
- Proposed resolution: Add an accessible compact chapter-contents disclosure and a lightweight persistent route/contents control, with sensible mobile space use.
- Acceptance criteria: Reach any section of a long chapter from its middle at 320/390/768px without scrolling to the top; contents can be opened and operated with keyboard and touch.
- Discussion / progress: Verified at 320 and 390px. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Added persistent compact chapter-contents/search controls and keyboard-operable contents dialog with destination focus.
- Changed locations: index.html; app.js; styles.css
- Verification: From mid-casebook at 320/390/768 px, open contents and reach sources without returning to top; dialog closes and sources receives focus. T3-native 768 pass used a same-origin iframe.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-008 — The desktop chapter contents extends below the viewport
- Priority / type: P2 / defect
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `styles.css`, `.reading-aside`; Chapter 28.
- Finding and evidence: At 1280×900 the 17-link sticky aside is 1064px high. After scrolling it sticks at y30, but its final link remains at y944–1000, below the viewport. It has no internal scroll limit. Later section links therefore cannot be reached by ordinary pointer use until the sticky element approaches its container end or the viewport changes. A navigation element should not hide its own destination list.
- Proposed resolution: Bound its height by the viewport and allow accessible internal scrolling, or use a shorter grouped contents list.
- Acceptance criteria: Every contents link is reachable at common laptop heights without going to the end of the chapter; focused links remain visible.
- Discussion / progress: Bounding rectangles and screenshot confirm the problem. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Bound sticky desktop contents to viewport height with internal overflow scrolling.
- Changed locations: styles.css
- Verification: At1280×800, aside is685 px high, all 20 links exist and last link is reachable through internal scroll.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-009 — Core data tables are squeezed into small nested scroll areas
- Priority / type: P2 / editorial recommendation
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `styles.css`, shared `.table-scroll`; Atlas-20 and Chapter 28 ledgers.
- Finding and evidence: A global 280px maximum height applies to ordinary instructional tables as well as optional raw data. The 37-row calendar ledger has 1442px of content at desktop and 2575px at 390px, but only about two body rows are initially visible on the phone. Its headers scroll away; horizontal scrolling has no persistent affordance, and the caption is also clipped at the right. Readers must repeatedly scroll inside a small box while comparing records central to the exercise.
- Proposed resolution: Distinguish essential teaching tables from optional data, provide an expand/full-table view, retain header context and make overflow clear. Keep dense columns legible instead of shrinking text further.
- Acceptance criteria: Follow and compare nonadjacent ledger rows on phone and desktop with visible column context; essential caption text remains readable.
- Discussion / progress: Measured and visually inspected the live calendar ledger at 390px; screenshot included. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Removed essential-table height clipping; moved captions outside scrollers, added horizontal-scroll guidance and large table workspace with sticky headers.
- Changed locations: app.js tableMarkup/workspace; styles.css
- Verification: Native 320/390 ledger workspace has all 36 body rows, visible sticky header and readable caption;320 workspace height535 px. Ordinary tables expand in page flow.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-010 — Print styling clips table inputs and removes quiz choices
- Priority / type: P1 / defect
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `styles.css`, `@media print`; `app.js` “Print chapter”.
- Finding and evidence: Print rules hide `.quiz-options`, leaving questions with no choices. They do not reset the 280px `.table-scroll` maximum height/overflow. Applying those exact print rules in the browser leaves the 1442px calendar ledger in a 280px clipped box. Closed solution disclosures also remain closed, and there is no explicit learner versus answer-key print choice. The advertised chapter-print pathway loses teaching material. Actual paginated PDF output has not been generated in this audit; the CSS omissions and simulated computed styles are demonstrated.
- Proposed resolution: Print full tables, preserve quiz choices and define whether solutions print in a learner or answer edition. Allow large figures/tables to paginate sensibly.
- Acceptance criteria: Inspect actual print previews or PDFs of a table-heavy chapter and an exercise chapter; all required rows/options appear and the answer policy is explicit.
- Discussion / progress: Verified source rules and simulated computed styles, not printer pagination. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Added explicit learner/answer editions, full-height print tables, static A/B/C choice list, answer policy and separate-page continuation. Printing uses explicit light SVG colors and a fixed wide layout; afterprint restores screen state.
- Changed locations: app.js print handling; styles.css print rules
- Verification: Rendered actual native-browser print DOM/CSS using WeasyPrint A4: Chapter 6 learner12 pages, answer12, Chapter 28 learner38. All 62 pages visually inspected via contact sheets; all 36 ledger rows compared to authoring, choices retained, solution policy verified, no out-of-page text. Native printer pagination unavailable; scope documented in resolution report.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-011 — Light-theme text and the gold data line have insufficient contrast
- Priority / type: P2 / defect
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `styles.css`, `--muted`, `--gold`; dynamic figure palette in `figure-renderer.js`.
- Finding and evidence: Calculated sRGB contrast for muted #70766c is 4.354:1 on paper #f8f7f2 and 4.106:1 on sidebar #f0f1e9, below the 4.5:1 normal-text threshold for the many 10–14px labels using it. Gold #b5a46b is 2.452:1 against figure surface #fffefa, below 3:1 for an essential graphical line. Exported SVGs use a different gold #9a874a, so browser and portable figures are not visually equivalent. These are measured palette defects; decorative gridlines/borders are not automatically subject to the same requirement. Standards: [normal-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
- Proposed resolution: Darken the affected light-theme tokens, harmonize browser/export series colors and verify actual component/background pairs. Preserve the restrained overall palette.
- Acceptance criteria: Normal instructional/navigation text meets 4.5:1 and essential series meet 3:1 against their actual backgrounds; recheck both themes and exports.
- Discussion / progress: Independently calculated using the WCAG sRGB luminance formula and confirmed live stroke colors. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Darkened muted/gold/rust light palette and harmonized portable figure colors.
- Changed locations: styles.css; figure-renderer.js; rebuilt exportedSVGs
- Verification: Computed WCAG sRGB contrast for live theme/background pairs: light muted minimum 5.724:1, gold4.070:1; all essential series≥3 and checked normal text≥4.5 in both themes.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-012 — Small secondary text weakens reading and reference usability
- Priority / type: P2 / editorial recommendation
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `styles.css`, chapter metadata, contents links, captions, source notes, badges and chart labels.
- Finding and evidence: Main prose is a comfortable 17px serif, but essential supporting material repeatedly drops to 10–12px; badges/kickers reach 8–9px and compact figure values can reach 9–11px. Source limitations and chart labels are part of the lesson, not decoration. The hierarchy makes the content that qualifies a claim noticeably harder to read, especially on phones. This is a legibility recommendation, not a claim that WCAG mandates one universal minimum font size.
- Proposed resolution: Increase essential auxiliary text and chart labels, reduce excessive uppercase tracking, and use spacing/weight rather than very small type to establish hierarchy.
- Acceptance criteria: Read source limitations, figure values and chapter navigation comfortably at narrow default viewports and with text enlargement; no new clipping.
- Discussion / progress: Styles and representative desktop/390px screenshots reviewed. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Raised essential supporting text to13–14 px and authored figure labels to12 px minimum, reducing tracking and wrapping compact labels.
- Changed locations: styles.css; figure-renderer.js; rebuiltSVGs
- Verification: Inspected compact candle values, legends, branch labels and timeline/axis labels. All 68 native figures at 320/390/768/1280 pass text-bound checks, with no new page overflow. This remains an editorial legibility improvement, not measured reader validation.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-013 — Valid notebook exports can be rejected by the importer
- Priority / type: P1 / defect
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `app.js`, chapter-note maxlength, notebook export/import limits.
- Finding and evidence: Each chapter allows 50,000 UTF-16 units of notes, and export has no aggregate byte restriction. Import rejects files above 2 MiB. A valid payload with 15 chapter notes of 50,000 Chinese characters each is 2,250,472 bytes under the export formatting and is rejected with “This backup is too large.” All notes satisfy the individual limit; UTF-8 bytes make the aggregate incompatible. Thus a backup produced from permitted notes is not guaranteed recoverable.
- Proposed resolution: Make export/import limits agree, account for UTF-8 size, and avoid producing a backup the app cannot restore. Consider bounded validation by known chapter count and per-note length rather than an incompatible arbitrary byte ceiling.
- Acceptance criteria: Round-trip maximum permitted multilingual notes and a normal small notebook without losing notes, progress or bookmarks; any enforced aggregate limit is surfaced before data becomes unrecoverable.
- Discussion / progress: Submitted the constructed valid File through the live import input; rejection occurs before mutation. Existing notes were not changed. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Reconciled import bound with maximum permitted note lengths/chapter count and JSON escaping; validated payload before mutation and surfaced invalid recognized notes/storage limits.
- Changed locations: app.js notebook export/import
- Verification: Isolated4174 native round-trips recover28×50,000-unit mixed Unicode notes (2,504,745-byte export) and Chinese notes (4,200,921-byte export), plus progress/bookmarks/positions. Small 410-byte backup also passes; user notebook was not replaced by QA data.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-014 — The evidence appendix is difficult to discover and navigate
- Priority / type: P2 / editorial recommendation
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `index.html` primary navigation; `app.js`, `renderEvidence()` and chapter source footer.
- Finding and evidence: “Follow the evidence” is a homepage promise, but evidence has no primary navigation entry. Its main link is buried at the end of each chapter. The route renders 175 evidence records across 36 sections into a 62,599px page at 1280px, with no contents, filter or chapter-targeted anchor. Chapter 1 points readers toward evidence, yet that recommendation is not a contextual link. The substantial empirical work is present but inconvenient to use during learning.
- Proposed resolution: Expose evidence in navigation, link claims/chapters to relevant records and provide study/topic/chapter navigation within the appendix.
- Acceptance criteria: From a chapter claim or the main menu, reach the relevant study specification and limitations without manually scanning the whole appendix.
- Discussion / progress: Live route counts/height and navigation markup inspected. Distinct from AUD2-006's search-index omission. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Exposed primary evidence navigation, contextual chapter links,36-group appendix contents/filter and record-specific destinations.
- Changed locations: index.html; app.js; stable authoring evidence IDs; rebuiltbook
- Verification: Native main navigation/context links reach chapter evidence; fresh study link focuses its record, exposes all five study fields, and evidence IDs have no duplicates.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-015 — Sections and glossary entries have no usable persistent deep links
- Priority / type: P2 / defect
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `app.js`, chapter contents handler, `route()` section special case, glossary result links.
- Finding and evidence: Chapter contents links use `#section-N`, cancel default navigation and scroll without recording the chapter/section in the URL. Copying their link loses the chapter identity; a fresh `#section-N` URL returns early from the router without rendering a chapter. Glossary items have IDs, but the router cannot combine a glossary route with a term fragment, and glossary search results take readers to the chapter's top. References cannot reliably point another reader to the exact calculation, definition or evidence being discussed.
- Proposed resolution: Support route-aware section/term/study identifiers and use them in contents, search and cross-references. Preserve appropriate back/forward behavior and focus.
- Acceptance criteria: Copy a section or term URL into a fresh tab and arrive at that exact content; navigation history works and IDs remain stable through routine edits.
- Discussion / progress: Router and click handling verified; see AUD2-005 for the separate `#main` failure. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Introduced stable explicit section/evidence IDs and route-aware chapter/section, glossary/term and evidence/record URLs used by contents/search.
- Changed locations: All authoring JSONs; app.js; build/check scripts; CONTENT_GUIDE/REVISION_SCHEMA; rebuiltbook
- Verification: Fresh document links focus the requested moving-average heading, R glossary entry and momentum study. Back/forward between chapter/section preserves notes and quiz state. Strict ID/reference checks pass.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-016 — “Continue reading” forgets the reader's position within a chapter
- Priority / type: P2 / editorial recommendation
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `app.js`, state.lastRead, home continue action and `mount()` scroll reset.
- Finding and evidence: The saved state contains only the chapter ID; every mount scrolls to the top. Returning to a long chapter through “Continue reading” therefore discards the last section/position. This becomes substantial friction in the long research, system and casebook chapters, particularly when mobile section navigation is absent.
- Proposed resolution: Save a stable last section or reasonable position per chapter and resume there, with an explicit option to start at the beginning. Avoid fragile pixel offsets across layout changes.
- Acceptance criteria: Leave a mid-chapter section, reload or return through home, and resume at the same content on phone and desktop without losing notes/progress.
- Discussion / progress: Confirmed saved-state shape and unconditional scroll reset; recommendation concerns the promise and reading flow. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Saved stable last-section positions per chapter; Continue reading uses them and Start at beginning resets arrival to chapter top.
- Changed locations: app.js reader state/navigation
- Verification: Leave mid-moving-average section, return through home and reload: same heading focuses at 115 px below sticky controls; note/progress state preserved. Imported backup retains section positions.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-017 — Reading-time labels exclude much of the required learning work
- Priority / type: P3 / editorial recommendation
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `scripts/build-content.cjs` minute calculation; chapter metadata.
- Finding and evidence: Time is calculated from narrative paragraphs, excluding table inspection, worked examples, practice and solution text. Chapter 10 displays “5 minute read” while asking readers to reproduce averages and classify repeated crosses; Chapter 28 says 17 minutes while presenting 17 sections, nine figures, multiple ledgers and cutoff decisions. The labels measure only one slice of the chapter and can mis-set expectations for readers told to mark a chapter read after working examples.
- Proposed resolution: Label the estimate as prose-reading time and separately indicate practice, or use a validated learning-session range. Do not invent precision without reader timing.
- Acceptance criteria: Labels disclose their scope and distinguish reading from solving; adjust estimates when actual reader observations are available under CA1-026.
- Discussion / progress: Build calculation and displayed metadata checked. No timing study was conducted; this is a recommendation, not a measured completion-time claim.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Relabeled the estimate as prose-reading time, explicitly stating practice requires additional time.
- Changed locations: app.js chapter and contents metadata; scripts/build-content.cjs calculation retained
- Verification: Live/print metadata says About N min of prose · practice takes additional time. No unmeasured learning-session duration is claimed; actual timing remains under deferred CA1-026.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-018 — Compact figures clip instructional labels, including price values
- Priority / type: P1 / defect
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `figure-renderer.js`, `flow()` titles and chart axis labels; Chapter 7 branch figure, Chapter 24 research timeline, Chapter 25 payoff distribution.
- Finding and evidence: A native-browser pass over all 68 figures at a 320px viewport found SVG text outside the rendered bounds. Chapter 7's “3. Branch A later: open $46.50, close $45” extends about 29px past the figure; Branch B's equivalent title extends 27px. The Chapter 24 timeline's first two step titles extend 32/40px. Chapter 25's long x-axis label extends 2px. Flow body text wraps, but flow titles do not. Finite geometry checks pass because out-of-bounds text is still finite. At 1280px the same extent pass finds no clips.
- Proposed resolution: Wrap flow titles and long axis labels based on available width and actual text metrics; include their resulting heights in layout. Keep all numbers visible.
- Acceptance criteria: Render and inspect every affected figure at 320/390px and wide width; no clipped labels or price fields, no new collisions. Store substantive visual evidence rather than only finite-value checks.
- Discussion / progress: Full route/extent results are in `audit-assets/browser-checks-20261002.json`. This is geometric browser evidence; a dedicated screenshot attempt for the Chapter 7 figure failed, so no successful screenshot of that defect is claimed. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Wrapped flow titles and long axis labels using actual browser text metrics with conservative portable fallback, expanded layout heights and stacked compact OHLC values.
- Changed locations: figure-renderer.js; rebuilt68 portableSVGs
- Verification: All 68 native figures at 320/390/768/1280 have zero SVG text clips/page overflow. Rendered and visually inspected affected price branches, research timeline, payoff axis and candle values at compact/wide widths. Native screenshot capture remained unreliable; portablePNG visual evidence and native geometry are separately identified.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.

### AUD2-019 — The chapter's playground link opens an unrelated default experiment
- Priority / type: P3 / editorial recommendation
- Status: in_progress
- Owner: /root (audit resolution, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `app.js`, chapter article tools and lab routes.
- Finding and evidence: Every chapter's “Chart playground” button points to `#/lab`, which always opens Candlesticks. From Moving averages or Risk & position sizing, the reader must discover and switch to the relevant experiment even though explicit `#/lab/average` and `#/lab/risk` routes exist. The button loses a straightforward contextual teaching connection.
- Proposed resolution: Route mapped chapters to their relevant experiment and use a general label for chapters with no matching tool.
- Acceptance criteria: The moving-average and risk chapter buttons open their matching interactive controls; all four lab routes remain directly accessible.
- Discussion / progress: Chapter markup and live lab routes checked. No fixes made.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Mapped relevant chapters to candle/trend/average/risk experiments; unmapped chapters use a general experiment label.
- Changed locations: app.js chapter article links
- Verification: Native moving-average button selects Moving averages and risk button selects Position sizing; all four explicit lab routes remain supported.
- Scope / evidence: [Critical re-audit resolution report](AUDIT_RESOLUTION_20261002.md) records shared checks and QA limitations. CA1-026 human participation remains deferred.


## Follow-through resolutions — /root, 2026-10-02

Reopened items preserve their prior closure history above. New evidence and this follow-through disposition are recorded in full below.

### AUD2-003 — Prospective exercises reveal future outcomes before the attempted decision
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (follow-through review, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: Chapters 6, 22 and 28, especially the casebook's historical gallery; `app.js` chapter rendering. Related: CA1-015 and the resolved CA1-011/022.
- Finding and evidence: Chapter 6 asks for a D12 cutoff after showing the whole continuation. Chapter 22's attempt follows the already-discussed P1 continuation. Chapter 28 tells readers to cover future rows, but displays outcome-bearing headings, a completed calendar ledger, continuation prose and whole-path figures before or alongside the task. Only solutions have actual reveal controls. The instruction is intellectually sound, but the presentation makes an uncontaminated attempt difficult and introduces answer leakage. This is a teaching-design recommendation, not a claim of falsified historical selection.
- Proposed resolution: Provide a learner view with cutoff inputs first, then an explicit continuation reveal and result reconciliation. Keep the complete ledger accessible in a reference view. Give printed editions a meaningful page/order separation.
- Acceptance criteria: A first-time reader can attempt a cutoff decision without seeing future labels, values or outcome headings; the full ledger and provenance remain available afterward.
- Discussion / progress: Confirmed by manuscript order and live rendering. No fixes made.
- Reopening evidence / 2026-10-02: The prior closure covered Chapters 6/22/28 but missed the Chapter 26 accounting attempt. Its sessions-4–7 outcome prose, complete ledger and equity-path figures precede the main sessions-4/5 exercise; native browser confirms the outcome heading is visible and has no enclosing disclosure. The request to pause does not provide an actual attempt-first view. Extend the resolution to a self-contained accounting replay packet with supplied inputs and frozen rules, keeping calculated outcomes behind the continuation reveal. This is a replay task, not a claim to forecast an unseen price path. Acceptance: independently reconstruct sessions 4/5 from the visible packet, with no result headings/ledger shown before reveal, and retain the complete reference afterward.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Added a six-table, self-contained Chapter 26 accounting replay before the continuation reveal, with initial filled-position state, unchanged rules, S4/S5 raw bars and decision screens. Explicitly labels supplied future bars as replay inputs rather than a forecast test; generic attempt-note labels support arithmetic work.
- Changed locations: content/risk-advanced.json (system-design); app.js; generated content/book.js and docs/MANUSCRIPT.md; CONTENT_GUIDE.md and REVISION_SCHEMA.md
- Verification: Independent input-table replay reproduces S4 cash/holdings/equity $62,986.52/$37,437.60/$100,424.12 and S5 $71,267.62/$28,920.40/$100,188.02; Fir −$730/−1.46R, Birch −$241/approximately −1.02R. Copied rule tables match reference exactly; no computed results in attempt packet. Native four-width checks show closed continuation and hidden outcome headings; keyboard reveal retains notes. Printed inputs precede continuation on page 7; all 168 packet cells verified.
- Scope / evidence: [Follow-through report](FOLLOW_THROUGH_20261002.md), native screenshots, browser/print check records and actual QA PDFs. No human reader validation or independent reviewer is claimed.

### CONT3-001 — LARK attempt does not specify the order it asks readers to follow
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (follow-through review, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: content/risk-advanced.json, psychology learnerAttempt and “Reconcile the unfamiliar cutoff note”.
- Finding and evidence: The new packet states a next-open gate and “a first-hour buy limit” but does not give that limit price, timezone/expiry, no-retry policy or a specific opening offer in the reveal. It asks for a conditional L1 action and later grades a compliant loss, so readers should not have to invent these order conditions. The reference also says the earlier BRDG note is “below” although it appears above that section.
- Proposed resolution: Restate L1's order and exception conditions in the packet and provide the opening quote and execution reports needed to check the continuation. Keep the task focused on a bounded decision note.
- Acceptance criteria: Reconstruct the conditional order and confirm the supplied fill/exit against explicit L1 rules; net dollars/R reconcile; the BRDG directional reference matches actual placement.
- Discussion / progress: Claimed on direct authoring and generated-book comparison. No empirical intervention claim is added.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Completed L1 instructions at Q0 with $64.90 buy limit, opening ask gate, 09:30–10:30 ET window, cancellation/no-retry rules, risk/cash, confirmed partial fills, R/costs, standing exits and exceptions. Reveal supplies Q1 ask $64.60, confirmed 50-share fill at 09:31 and Q3 stop report. Corrected earlier BRDG reference.
- Changed locations: content/risk-advanced.json (psychology); generated content/book.js and docs/MANUSCRIPT.md; scripts/verify-revision.cjs
- Verification: Independent arithmetic confirms reserve $3,247.50, maximum planned price-risk $115, actual filled R $100, net −$105/−1.05R and final cash $19,895. Confirmed fill meets explicit gate, price and time window. Native packet stays attempt-first at four widths; eight-row mobile table inspected in dark theme. All 21 packet cells retained in answer PDF; continuation begins on page 4.
- Scope / evidence: [Follow-through report](FOLLOW_THROUGH_20261002.md), native screenshots, browser/print check records and actual QA PDFs. No human reader validation or independent reviewer is claimed.

### AUD2-010 — Print styling clips table inputs and removes quiz choices
- Priority / type: P1 / defect
- Status: in_progress
- Owner: /root (follow-through review, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `styles.css`, `@media print`; `app.js` “Print chapter”.
- Finding and evidence: Print rules hide `.quiz-options`, leaving questions with no choices. They do not reset the 280px `.table-scroll` maximum height/overflow. Applying those exact print rules in the browser leaves the 1442px calendar ledger in a 280px clipped box. Closed solution disclosures also remain closed, and there is no explicit learner versus answer-key print choice. The advertised chapter-print pathway loses teaching material. Actual paginated PDF output has not been generated in this audit; the CSS omissions and simulated computed styles are demonstrated.
- Proposed resolution: Print full tables, preserve quiz choices and define whether solutions print in a learner or answer edition. Allow large figures/tables to paginate sensibly.
- Acceptance criteria: Inspect actual print previews or PDFs of a table-heavy chapter and an exercise chapter; all required rows/options appear and the answer policy is explicit.
- Discussion / progress: Verified source rules and simulated computed styles, not printer pagination. No fixes made.
- Reopening evidence / 2026-10-02: Follow-through A4 rendering of the actual Chapter 22 answer-edition DOM/CSS preserves all choices but separates the question and choice A on page 12 from choices B/C and the answer on page 13. Chapter 26 input-table captions/column headings also orphan at page ends. This is a demonstrated pagination/presentation defect, not missing content. Keep the short quiz together and captions/column headings with the first data row; verify new paginated output.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Kept short quiz blocks together in print and exposed native table captions instead of detached screen captions. Long tables still paginate with repeated headers; captions, column headings and first data row stay together in verified samples.
- Changed locations: styles.css print rules; index.html cache marker
- Verification: Rendered actual native print DOM/current CSS in WeasyPrint A4: Chapter 26 learner30 pages, Chapter 22 answer13. All 43 pages visually inspected. All 189 packet cells preserved, 28 caption/first-row checks pass, no out-of-page text. Atlas quiz is complete on page 29; LARK question, A/B/C options and answer now share page 13 (previously split pages12/13). Native printer output remains unverified and is explicitly distinguished from this PDF check.
- Scope / evidence: [Follow-through report](FOLLOW_THROUGH_20261002.md), native screenshots, browser/print check records and actual QA PDFs. No human reader validation or independent reviewer is claimed.

## Independent-practice resolution — /root, 2026-10-02

### CA1-015 — Reopened: three independent tasks repeat their worked references
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (indicator/context practice pass, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `content/indicators-context.json`, independent practice in `momentum` (Chapter 11), `breadth` (Chapter 16) and `events` (Chapter 18). Original CA1-015 finding and both earlier resolutions remain in `FEEDBACK_RESOLVED.md`.
- Finding and evidence: Chapter 11 asks about MACD 1.80/signal 1.90 immediately after prose gives the same −0.10 histogram and interpretation. Chapter 16 asks for the session-10-to-11 index/breadth result already explained as 104.5→104.3 with three advances and one decline. Chapter 18 repeats the stop-48/limit-47 and O43/H47/L42/C46 case whose unresolved execution is already explained. These are sound rehearsal tasks, but their independent label overstates the transfer they assess. The earlier fresh-input fixes to Chapters 6, 10, 13, 17 and 19 remain present; this is residual teaching evidence, not a new numerical contradiction.
- Proposed resolution: Replace these independent prompts with unfamiliar, self-contained inputs and worked reasoning. Test MACD/signal signs and post-close availability; index weighting versus breadth/eligibility denominators; and stop-limit nonexecution versus unresolved execution under explicit assumptions. Preserve guided rehearsal and existing figures.
- Acceptance criteria: All three independent tasks require calculations or classifications unavailable verbatim in preceding prose; every requested field has a checked solution with units, timing and assumptions. Solutions remain concealed until requested in the browser and omitted from the learner print edition. Rebuild the authoring sources and inspect actual generated content.
- Discussion / progress: /root, 2026-10-02 — Claimed this targeted batch. No human learner observations or whole-book independent-review claim. `/root` owns the single coordinated rebuild after prebuild verification.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Replaced the residual rehearsal-only independent tasks in Chapters 11, 16 and 18 with unfamiliar initialized-state MACD, five-stock breadth and counterfactual stop/stop-limit cases. Added raw-input practice tables before concealed answers, with browser/manuscript export and existing learner/answer print policy. Preserved the earlier CA1-015 fixes and task titles/deep links.
- Changed locations: content/indicators-context.json (three chapters’ practice/evidence only); app.js; scripts/build-content.cjs; scripts/check-content.cjs; scripts/verify-early-chapters.cjs; docs/CONTENT_GUIDE.md; docs/REVISION_SCHEMA.md; index.html cache marker; rebuilt book/manuscript/evidence outputs.
- Verification: Independent Fraction arithmetic and 568-comparison early verifier agree. All three documented verifiers, normal/strict content checks and syntax checks pass; one coordinated rebuild. Generated manuscript contains all three complete packets. Native T3 DOM checks at 1280px and same-origin 390/320px frame checks match all 65 input/header cells, concealed/revealed solutions and workspaces with no page overflow. Six isolated learner/answer A4 QA packets (eight pages) visually inspected; complete questions/inputs preserved and all solution paragraphs obey print policy. Native screenshots/viewport changes timed out; narrow frames and WeasyPrint packet checks are explicitly distinguished from native device/printer validation.
- Scope / evidence: [Independent-practice report](PRACTICE_TRANSFER_20261002.md), [arithmetic](practice-transfer-assets/arithmetic-checks.json), [browser checks](practice-transfer-assets/browser-checks.json) and [print checks](practice-transfer-assets/print-checks.json). No exhaustive re-audit, independent reviewer or human learning study is claimed. CA1-026 remains deferred.


## Price-action and cutoff-search follow-through — /root, 2026-10-02

### AUD2-003 — Prospective exercises reveal future outcomes before the attempted decision
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (price-action staging, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: Chapters 6, 22 and 28, especially the casebook's historical gallery; `app.js` chapter rendering. Related: CA1-015 and the resolved CA1-011/022.
- Finding and evidence: Chapter 6 asks for a D12 cutoff after showing the whole continuation. Chapter 22's attempt follows the already-discussed P1 continuation. Chapter 28 tells readers to cover future rows, but displays outcome-bearing headings, a completed calendar ledger, continuation prose and whole-path figures before or alongside the task. Only solutions have actual reveal controls. The instruction is intellectually sound, but the presentation makes an uncontaminated attempt difficult and introduces answer leakage. This is a teaching-design recommendation, not a claim of falsified historical selection.
- Proposed resolution: Provide a learner view with cutoff inputs first, then an explicit continuation reveal and result reconciliation. Keep the complete ledger accessible in a reference view. Give printed editions a meaningful page/order separation.
- Acceptance criteria: A first-time reader can attempt a cutoff decision without seeing future labels, values or outcome headings; the full ledger and provenance remain available afterward.
- Discussion / progress: Confirmed by manuscript order and live rendering. No fixes made.
- Reopening evidence / 2026-10-02: /root — Chapter 8’s guided task says to stop at D11 and reveal D12 separately, but the whole-path figure labels branch A completed and branch B invalidated; both continuations and their prices already appear before practice. Chapter 9’s “Freeze a small plan before revealing the continuation” follows the full 14-close figure with its session-10 failure label and the $52.20 next-open comparison. Chapter 7’s later confirmation and failure paths are presented directly after the geometry lesson without an attempt boundary. Extend staging to these cases, while retaining the safe prerequisite teaching before the packet rather than making a beginner attempt an unexplained rule. The previously resolved Chapters 6/22/26/28 packets remain present.
- Current batch location: Chapters 7, 8 and 9 (`candlestick-patterns`, `chart-patterns`, `breakouts`); authoring JSON, reader and standalone manuscript.
- Current batch acceptance: For each new case, prerequisite teaching can be read before the cutoff attempt, only cutoff-known prices and frozen rules appear before reveal, and all later values/outcome headings/ledgers remain inside the continuation. Supply readable raw input charts and tables without answer annotations. Existing packet, deep-link, note, search and print behavior must remain usable.
- Batch progress / 2026-10-02: /root owns integration and one coordinated rebuild. Claims are based on the current source and presentation; native screenshot limitations from the prior pass are not treated as content defects.
- Disposition: resolved (current Chapter 7–9 reopening; previous closures preserved)
- Closed by / date: /root / 2026-10-02
- Resolution: Added D3 candle, D11 double-top and session-9 Harbor cutoff packets after safe prerequisite instruction, with raw input charts/tables and later observations/reference behind an explicit continuation. Candle geometry is transparently labelled guided rehearsal; its later-observation task remains prospective. Added a cutoff-state reconciliation; removed introductory double-top branch spoilers; moved the full Harbor chart into the continuation. Extended optional authoring placement/figure support consistently across reader and manuscript without changing existing packet defaults or section/evidence IDs.
- Changed locations: content/foundations-price.json (three chapters); app.js; styles.css (practice-label print break); scripts/build-content.cjs; scripts/check-content.cjs; scripts/verify-early-chapters.cjs; docs/CONTENT_GUIDE.md; docs/REVISION_SCHEMA.md; index.html; rebuilt book/manuscript/evidence and figure outputs.
- Verification: All three documented numerical verifiers, normal/strict checks and syntax checks pass; 610 early comparisons, one coordinated rebuild, 71 portable figures. Actual packet inputs reconstruct D3 geometry/threshold, D11 recognition/candidate state and Harbor cash/R. All seven packet routes pass native DOM/input/contents/note/deep-link regression checks at actual 390/320/1280px viewports. Closed new references fail the browser visibility API and their future tokens are absent from visible article text. Three raw charts visually inspected at 260/760px; actual manuscript order checked. Six focused native-DOM learner/answer A4 samples (48 pages) visually inspected, with complete input text/cells, correct solution/quiz policy and later-page continuation. Practice labels no longer strand at page bottoms. Samples omit unchanged diagrams and other reference sections; WeasyPrint output is not native printer validation. Native snapshots failed after retries; navigation, interaction and resizing succeeded.
- Scope / evidence: [Price-action staging report](PRICE_ACTION_STAGING_20261002.md), [browser checks](price-action-assets/browser-checks.json), [visibility checks](price-action-assets/visibility-checks.json) and [print checks](price-action-assets/print-checks.json). No exhaustive manuscript audit, independent reviewer or human study is claimed. CA1-026 remains deferred.

### AUD2-006 — Search excludes substantial instructional content and silently truncates matches
- Priority / type: P2 / defect
- Status: in_progress
- Owner: /root (cutoff search, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `app.js`, `renderSearch()`.
- Finding and evidence: The index contains titles, tags and section paragraphs but excludes tables, exercises, practice, worked solutions, figure captions, examples and research/evidence records. Searching “2016-03-03” or “9.29%” returns no results despite those values appearing in the current historical/research material. Results are limited to 18 chapters and six glossary entries without an indication that others were omitted. This impairs verification and reference use, not just keyword convenience.
- Proposed resolution: Index all reader-visible instructional fields and evidence summaries; show match counts, meaningful snippets and a path to remaining matches.
- Acceptance criteria: Known unique table, exercise and study strings return their actual locations; broad queries disclose the total and permit access to every match.
- Discussion / progress: Both no-result examples reproduced through native search interactions; omitted fields and truncation confirmed in source. No fixes made.
- Reopening evidence / 2026-10-02: /root — The search index includes overviews, sections, normal figures, practice, quizzes and evidence, but never `learnerAttempt`. The existing packet title “First pass: write an unfamiliar Q0 decision note” and the input-table title “Construction closes, available through D12” are instructional text only in these packets; they have no index entry. Adding more packets would enlarge that omission.
- Current batch location: `app.js` search indexing of all `learnerAttempt` fields.
- Current batch acceptance: All existing and new cutoff titles, paragraphs, tables and charts are searchable, and results route to the visible cutoff packet without exposing continuation. Verify actual search results and navigation, rather than merely the presence of an indexing line.
- Batch progress / 2026-10-02: /root owns integration and one coordinated rebuild. Claims are based on the current source and presentation; native screenshot limitations from the prior pass are not treated as content defects.
- Disposition: resolved (current cutoff-search reopening; previous closure preserved)
- Closed by / date: /root / 2026-10-02
- Resolution: Indexed all learnerAttempt instructional fields, including title, paragraphs, tables and figures, and routed each match to its visible cutoff packet. Existing broader indexing, counts, full-result access and original closure remain preserved.
- Changed locations: app.js search index; index.html cache marker.
- Verification: 35 actual native title/passage/table/chart searches across all seven packets returned the cutoff location. At actual 390/320/1280px viewports, packet title/table matches and clicked title-result navigation retain a closed continuation; safe teaching remains accessible before the new packets. All normal/strict and syntax checks pass. Tested search interactions rather than only inspecting the indexing line.
- Scope / evidence: [Price-action staging report](PRICE_ACTION_STAGING_20261002.md), [search checks](price-action-assets/search-checks.json) and [browser checks](price-action-assets/browser-checks.json). Original broader search/truncation fixes were not reopened or replaced; this closes the demonstrated residual packet omission.


## Project tracking completion — /root, 2026-10-02

### TRACK1-001 — Project status is scattered and the roadmap repeats completed work
- Priority / type: P2 / editorial recommendation
- Status: in_progress
- Owner: /root (2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: README.md project status; docs/EDITORIAL_ROADMAP.md; dated completion reports.
- Finding and evidence: The roadmap still proposes adding topic-specific diagrams and end-of-part solutions that now exist; its 40,010-word snapshot is superseded by the current 40,628-word build. No single tracker lists completed milestones, actionable remaining work, dependencies, owners and completion criteria. Readers must reconcile multiple dated reports to understand current scope. The active queue correctly retains only deferred CA1-026; a clear queue is not publication acceptance.
- Proposed resolution: Establish a canonical current-status page, replace the roadmap's superseded task list with sequenced remaining work, prepare a chapter publication-review ledger, and provide a reproducible read-only status command with a dated verification checkpoint.
- Acceptance criteria: Current inventory agrees with built content; completed work links to its actual evidence; remaining tasks have status, owner, dependencies and exit criteria; deferred human participation stays visible; README links to the tracker; checkpoint freshness can be checked without overwriting shared outputs. Preserve historical reports and their limitations.
- Discussion / progress: /root, 2026-10-02 — Claimed. All three numerical verifiers and strict content checks passed. An isolated temporary build produced 74 outputs byte-identical to the current book, manuscript, evidence matrix and 71 SVGs, with no extra figure exports. No shared rebuild or new human/browser/source review is claimed.

- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Created a canonical project-status page with current inventory, completed milestones and evidence, and remaining work. Replaced superseded roadmap tasks with ROAD-001–007, statuses, owners, dependencies, first actions and verifiable exit criteria. Prepared all 28 chapter and six part publication-review rows with inherited evidence and current chapter/source fingerprints; all new publication acceptance remains pending. Added a read-only status command and a dated 92-file verification checkpoint with automatic latest-checkpoint selection and freshness warnings. README links directly to the tracker; original review notes retain their snapshot with a current-status pointer. CA1-026 remains deferred and no new participant, publication, source, browser or visual acceptance is claimed.
- Changed locations: README.md; package.json; scripts/project-status.cjs; docs/PROJECT_STATUS.md; docs/EDITORIAL_ROADMAP.md; docs/PUBLICATION_REVIEW.md; docs/PROJECT_CHECKPOINT_20261002.json; docs/REVIEW_NOTES.md. No authoring or generated content was changed.
- Verification: All three numerical verifiers passed, including 610 early comparisons and all 36 historical windows; normal/strict content and JavaScript syntax checks passed. An isolated temporary rebuild matched all 74 current outputs byte-for-byte with no extra SVGs. The current inventory is 28 chapters, 210 narrative sections, 40,628 section-prose words, 105 glossary terms, 73 source entries/70 URLs, 63 chapter practice tasks, six reviews/18 review tasks, seven attempt packets and 71 SVGs. All local tracker links resolve and all 28 abbreviated chapter fingerprints match full checkpoint values. Temporary-fixture checks verified unchanged checkpoint reporting, exclusion of the fenced feedback template, all seven roadmap entries, detection of changed authoring/missing or new exports, missing-checkpoint reporting and automatic selection of a newer dated checkpoint. Actual source/figure/browser/print review evidence is inherited and linked with its limits, not repeated in this pass.
- Related IDs: CA1-026 (still deferred); ROAD-002–007 (planned work packages, not duplicate findings).


## Publication batch 1 completion — /root, 2026-10-02

### PUB1-001 — Retest explanation assumes every intervening price traded
- Priority / type: P2 / defect
- Status: in_progress
- Owner: /root (2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: Chapter 9, “Read a retest with the future covered”; content/foundations-price.json.
- Finding and evidence: For L49.00/C50.60, the paragraph says the intraday path “must have passed through” $49.80–$50.20. Trades can jump over that interval. For example, an ordered tape 49.30, 49.00, 50.60 has O49.30/H50.60/L49.00/C50.60 and no traded touch in the specified area. OHLC cannot establish a continuous path or an intermediate execution. The current low-inside-area classification is correct, but the explanation overstates what the bar establishes.
- Proposed resolution: Preserve the literal low-field rule, remove the implied continuous trading path, and show two supplied tapes with identical OHLC but different intermediate-touch evidence.
- Acceptance criteria: The chapter distinguishes low-field classification from observed tape touches; complete input tapes and worked answers demonstrate the difference without assuming unobserved intermediate trades. Existing packet remains free of later outcomes before reveal.
- Discussion / progress: /root, 2026-10-02 — Claimed during the Chapter 1/2/9/20/21 publication batch. Earlier pattern/retest arithmetic evidence does not address this discrete-price assertion.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Replaced the continuity assertion with a discrete-trade/OHLC distinction; added identical-summary A/B tapes and independent C/D supplied-input practice. The low-field rule and closed Harbor continuation remain intact.
- Changed locations: content/foundations-price.json, Chapter 9; scripts/verify-early-chapters.cjs; regenerated book/manuscript/evidence matrix.
- Verification: Reconstructed all four tapes, matching OHLC while differentiating listed traded touches. Early verifier passes 617 comparisons. Native 1280/390/320px checks confirm the cutoff starts closed, only its two prerequisites appear and no $52.20 future token appears before reveal; complete new input/solution tables match source. Actual chapter/packet figures inspected at 260/760px. Normal/strict checks and generated manuscript content pass.
- Scope / evidence: [Publication batch 1 report](PUBLICATION_BATCH1_20261002.md), [chapter acceptance ledger](PUBLICATION_REVIEW.md) and linked arithmetic/source/figure/native browser artifacts. No native printer pagination or human learning outcome claimed; ROAD-003/004/006 remain release dependencies. CA1-026 remains deferred.

### AUD2-002 — The ten-session exit has contradictory clocks
- Priority / type: P1 / defect
- Status: in_progress
- Owner: /root (publication batch 1, 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `content/risk-advanced.json`, Chapter 24 “Write the rule before seeing the answer”; Chapter 26 Atlas-20 earnings filter. Related earlier capstone item: CA1-020, already resolved.
- Finding and evidence: One Chapter 24 paragraph says entry counts as session 1 and exit is its tenth close, then says “the close of the tenth session after entry.” The latter normally excludes the entry session and is one session later. Chapter 26 also calls t+1…t+10 the “longest possible holding window” while explicitly allowing halts to prevent exits. A halt can extend elapsed holding beyond the planned limit. Readers building an inspectable rule should not have to choose between these clocks.
- Proposed resolution: Use one inclusive holding-session definition, an explicit entry-day example, and an overdue-exit rule for a halt. Call the earnings horizon the planned holding window rather than an unconditional maximum.
- Acceptance criteria: A worked entry-day calendar has a single exit date; a halt spanning the deadline has an explicit resumptive disposition and the calendar wording agrees.
- Discussion / progress: Verified against current prose and the session-10 time-exit rows. This finding concerns clock wording, not a claim that the existing portfolio arithmetic is wrong. No fixes made.
- Reopening evidence / 2026-10-02: /root — The prior Chapters 24/26 and simulator fix remains intact. Chapter 21 BRDG-P1 independently schedules an S10 close exit but its halt policy only says retain/flag stale and apply the opening-gap rule on resumption. If S10 is halted and S11 resumes inside both exit levels, the required time-exit date has passed and no overdue disposition is supplied. Current batch extends the existing clock/overdue finding to this separate plan.
- Current batch location: Chapter 21 completed-plan table, awkward-branch explanation and independent practice; content/risk-advanced.json.
- Current batch acceptance: State stop/target opening priority, then first executable resumed-open overdue exit before intraday events. Supply a halted-S10 example and calculate inside-band, stop-gap and target-gap branches with unchanged costs and frozen R. Preserve ordinary BRDG and Atlas-20 ledgers.
- Disposition: resolved (Chapter 21 reopening; earlier Chapters 24/26 closure preserved)
- Closed by / date: /root / 2026-10-02
- Resolution: Made the existing S10 deadline persist through a halt. First resumed executable open applies stop-gap priority, then target-gap priority, then overdue time exit before intraday events. Added three fresh reopening cases with supplied OHLC, declared costs and frozen filled-position R. Ordinary BRDG/journal and Atlas-20 ledger values remain preserved.
- Changed locations: content/risk-advanced.json, Chapter 21 completed-plan table, operational branch, worked example and independent practice; scripts/verify-revision.cjs; regenerated outputs.
- Verification: Independently recalculated the inside, stop-gap and target-gap results as net −45/−155/+215, cash 19955/19845/20215 and R −0.45/−1.55/+2.15. The inside-open bar later crosses both levels, but the opening overdue exit remains prior. The durable later verifier reconstructs the input table and passes existing cases. Native complete-table checks and keyboard Enter open the new solution; manuscript includes all branches. Normal/strict checks and all 74 isolated build comparisons pass.
- Scope / evidence: [Publication batch 1 report](PUBLICATION_BATCH1_20261002.md), [chapter acceptance ledger](PUBLICATION_REVIEW.md) and linked arithmetic/source/figure/native browser artifacts. No native printer pagination or human learning outcome claimed; ROAD-003/004/006 remain release dependencies. CA1-026 remains deferred.

### CA1-024 — Reopened: the isolated R-multiple definition loses the book's denominator convention
- Priority / type: P2 / teaching gap
- Status: in_progress
- Owner: /root (publication batch 1, 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `content/risk-advanced.json`, glossary “R multiple”; Chapters 20–21; prior glossary finding/closure in `FEEDBACK_RESOLVED.md`.
- Finding and evidence: The glossary says only “Trade result divided by the original planned dollar risk.” The chapters carefully distinguish an all-in risk budget from frozen price-risk based on filled shares, and deduct costs from net results. The glossary does not say whether costs belong in the numerator or denominator or whether planned order size versus actual filled size supplies the risk. That ambiguity revives precisely the denominator error the exercises teach readers to avoid. The corrected aliases and observational support/resistance wording remain sound.
- Proposed resolution: State this edition's net-result / frozen filled-position price-risk convention, with costs excluded from that denominator; acknowledge other conventions when named.
- Acceptance criteria: A reader using the isolated entry gets the same R for the cost-inclusive and partial-fill examples as the chapter solutions.
- Discussion / progress: Confirmed by filtering the live glossary and comparing its displayed definition with the later worked records. No fixes made.
- Reopening evidence / 2026-10-02: /root — The corrected glossary remains intact. Chapter 20 still introduces the book-wide denominator as shares × (planned entry − planned stop). Its examples assume those entries fill, but this wording can be read as retaining an intended or maximum entry price after a different fill. Chapter 9 explicitly uses actual lower-entry risk, and Chapter 21 freezes actual filled-share risk. The general Chapter 20 definition should distinguish a pre-entry estimate from post-fill frozen R.
- Current batch location: Chapter 20 “Declare the R denominator before the result”; content/risk-advanced.json.
- Current batch acceptance: Separate pre-entry order risk from filled-position R; explicitly freeze the actual/model-confirmed filled quantity and entry against the declared stop, without costs or hindsight rebasing. Preserve existing values and the corrected glossary.
- Disposition: resolved (Chapter 20 reopening; corrected glossary preserved)
- Closed by / date: /root / 2026-10-02
- Resolution: Distinguished the pre-entry order-risk estimate from the confirmed filled-position denominator. Frozen 1R uses filled quantity × (filled entry − declared initial stop), excluding costs; ceilings/unfilled order quantities do not define filled risk. Existing cost-inclusive sizing values and corrected glossary remain intact.
- Changed locations: content/risk-advanced.json, Chapter 20 “Declare the R denominator before the result”; regenerated outputs.
- Verification: Recomputed the 47-share/all-in-risk example, lower-entry 43-share R and 50-share partial-fill R consistently; the batch independent checks and existing early/later verifiers pass. Read current chapter wording against Chapters 9/21 and the glossary. Native chapter paragraphs and complete teaching-table values match source; loss/stress illustrations inspected at 260/760px. Generated manuscript contains the clarification; normal/strict and isolated build checks pass.
- Scope / evidence: [Publication batch 1 report](PUBLICATION_BATCH1_20261002.md), [chapter acceptance ledger](PUBLICATION_REVIEW.md) and linked arithmetic/source/figure/native browser artifacts. No native printer pagination or human learning outcome claimed; ROAD-003/004/006 remain release dependencies. CA1-026 remains deferred.



## Publication batch 2 completion — /root, 2026-10-02

### AUD2-018 — Compact figures clip instructional labels, including price values
- Priority / type: P1 / defect
- Status: in_progress
- Owner: /root (publication batch 2, claimed 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: `figure-renderer.js`, `flow()` titles and chart axis labels; Chapter 7 branch figure, Chapter 24 research timeline, Chapter 25 payoff distribution.
- Finding and evidence: A native-browser pass over all 68 figures at a 320px viewport found SVG text outside the rendered bounds. Chapter 7's “3. Branch A later: open $46.50, close $45” extends about 29px past the figure; Branch B's equivalent title extends 27px. The Chapter 24 timeline's first two step titles extend 32/40px. Chapter 25's long x-axis label extends 2px. Flow body text wraps, but flow titles do not. Finite geometry checks pass because out-of-bounds text is still finite. At 1280px the same extent pass finds no clips.
- Proposed resolution: Wrap flow titles and long axis labels based on available width and actual text metrics; include their resulting heights in layout. Keep all numbers visible.
- Acceptance criteria: Render and inspect every affected figure at 320/390px and wide width; no clipped labels or price fields, no new collisions. Store substantive visual evidence rather than only finite-value checks.
- Discussion / progress: Full route/extent results are in `audit-assets/browser-checks-20261002.json`. This is geometric browser evidence; a dedicated screenshot attempt for the Chapter 7 figure failed, so no successful screenshot of that defect is claimed. No fixes made.
- Reopening evidence / 2026-10-02: /root — Earlier wrapping fixes remain intact. Chapter 5’s primary chart at 260px has annotation backgrounds covering the D10 and D12 marked points; 493/1,000 equal-distance samples of the close path lie inside those backgrounds. The actual compact raster makes the later structure hard to follow despite zero text-bound clips. A native comparison with concise session/price labels covers 86/1,000 samples and hides no marked point. This is label occlusion, not a claim that prices or recognition dates are incorrect.
- Current batch location: content/foundations-price.json, Chapter 5 primary figure short labels and caption.
- Current batch acceptance: Simplify the labels through authoring; preserve exact prices, the full point descriptions and recognition dates in the table/caption. Inspect current compact/wide rasters and native figure bounds; no marked points hidden by later label boxes.
- Disposition: resolved (Chapter 5 reopening; previous wrapping fixes preserved)
- Closed by / date: /root / 2026-10-02
- Resolution: Simplified the six point labels in authoring, retained complete point descriptions and price values, and added explicit recognition-date context to the caption. No shared renderer change was needed.
- Changed locations: content/foundations-price.json, Chapter 5 primary figure; rebuilt book/manuscript/evidence and assets/figures/trends.svg; index.html book cache query.
- Verification: Actual revised 260/760px rasters were inspected against the complete close table, line values and recognition dates. Native SVG measurement hides no marked points at 260/300/760px; 1,000 equal-distance close-path samples covered by label backgrounds decline from 493 to 86 at 260px. At 300px coverage is 66; at 760px zero. Complete point SVG titles and swing table remain intact. Native desktop and 390/320px child-frame content/geometry have no text-bound clips or page overflow. All three numerical verifiers pass; 177 independent batch comparisons; normal/strict content and syntax checks pass; isolated build matches all 74 outputs.
- Scope / evidence: [Publication batch 2 report](PUBLICATION_BATCH2_20261002.md) and linked before/after rasters, native geometry, source, arithmetic and browser records. Top-level phone resizing and snapshot/save failed; phone-width checks use native child frames. Native printer pagination remains unverified. CA1-026 human validation remains deferred; edition-wide ROAD-003/004/006 remain pending.

### PUB2-001 — Osler evidence locator references a nonexistent Figure 3
- Priority / type: P3 / defect
- Status: in_progress
- Owner: /root (publication batch 2, 2026-10-02)
- Reviewer / date: /root / 2026-10-02
- Location: content/research-context.json, Chapter 6 injected mechanism evidence and research-appendix evidence for rc-os.
- Finding and evidence: The locator names “Figures 1–3” in Staff Report 125. The original PDF contains Figures 1A/1B and 2A–2D; no Figure 3 exists. Source text and headings establish the stated bounded FX finding, but the locator sends a reader to an absent exhibit.
- Proposed resolution: Name the actual figure groups and retain the single-bank/three-pair and stock-transfer limits.
- Acceptance criteria: The regenerated source/evidence/manuscript location agrees with the original provider PDF. No performance or stock-order conclusion is added.
- Discussion / progress: /root checked the original NY Fed PDF through its data, distribution and conclusion passages; claimed for this batch.
- Disposition: resolved
- Closed by / date: /root / 2026-10-02
- Resolution: Replaced both “Figures 1–3” source locators with actual Figures 1A–1B and 2A–2D. Preserved the FX sample, mechanism/observation distinction and absence of stock-strategy validation.
- Changed locations: content/research-context.json, Osler research evidence and Chapter 6 injected evidence; rebuilt book, manuscript and evidence matrix.
- Verification: Read the original NY Fed Staff Report 125 introduction, sample, requested-rate distribution, order-type and conclusion passages; identified actual exhibit groups. Current manuscript and evidence matrix contain the corrected locators and no old “Figures 1–3” string. Source-check artifact records provider URL, headings and limits; Chapter 6 current browser text and tables match the rebuilt content. All three numerical verifiers pass; 177 independent batch comparisons; normal/strict content and syntax checks pass; isolated build matches all 74 outputs.
- Scope / evidence: [Publication batch 2 report](PUBLICATION_BATCH2_20261002.md) and linked before/after rasters, native geometry, source, arithmetic and browser records. Top-level phone resizing and snapshot/save failed; phone-width checks use native child frames. Native printer pagination remains unverified. CA1-026 human validation remains deferred; edition-wide ROAD-003/004/006 remain pending.


### PUB3-001 — Engulfing source locators point one slide early
- Priority / type: P3 / defect
- Status: in_progress
- Owner: /root (publication batch 3, 2026-10-03)
- Reviewer / date: /root / 2026-10-03
- Location: content/foundations-price.json, Chapter 7 body-engulfing evidence; content/research-context.json, candle glossary evidence.
- Finding and evidence: Both locators say page/printed slide 40. Fidelity's supplied 51-page PDF places “Engulfing” on printed slide 41 (zero-based PDF index 40); printed slide 40 covers Shooting Star and Inverted Hammer. The body-versus-range explanation is supported, but its locator is wrong.
- Proposed resolution: Identify printed slide 41 and its PDF index explicitly in both authoring records; rebuild derived evidence and manuscript.
- Acceptance criteria: Both current records point to the Engulfing definition, and generated reader/manuscript/evidence agree; other accepted chapters remain unchanged.
- Discussion / progress: Primary PDF text inspected; web screenshot retrieval failed. No external source figure is reproduced in the book.
- Disposition: resolved
- Closed by / date: /root / 2026-10-03
- Resolution: Both Chapter 7 and glossary evidence now identify printed slide 41 and zero-based PDF page index 40; their evidence-check dates reflect this inspection. Rebuilt reader/manuscript/evidence from authoring.
- Changed locations: content/foundations-price.json, Chapter 7 body-engulfing evidence; content/research-context.json, candle glossary evidence; generated book/manuscript/evidence matrix.
- Verification: Original Fidelity PDF text includes the body-covering-body definition under Engulfing with printed marker 41. The preceding slide marker 40 belongs to Shooting Star/Inverted Hammer. Both generated locators agree with the corrected authoring; native reader answers and all 12 teaching tables match. All nine prior accepted chapter fingerprints remain unchanged. Web PDF screenshot retrieval failed and is not claimed as visual source inspection.
- Shared verification / scope: [Publication batch 3](PUBLICATION_BATCH3_20261003.md) links 315 independent comparisons, seven primary URL inspections and one NBER retrieval failure, all eight actual figures at 260/760px, nine native browser route/width checks and 146 manuscript checks. All three numerical verifiers and normal/strict/syntax checks pass; isolated build matches all 74 generated outputs. One coordinated shared rebuild. Native keyboard opens Chapter 8 continuation and Part 2 first solution after a failed first press and explicit-tab retry. Preview snapshot/resize/evaluation failures and child-frame limits are recorded. ROAD-003/004/006 remain pending; CA1-026 remains deferred with zero human participants/observations.


### PUB3-002 — Double-bottom mirror wording overstates the supplied price identity
- Priority / type: P3 / defect
- Status: in_progress
- Owner: /root (publication batch 3, 2026-10-03)
- Reviewer / date: /root / 2026-10-03
- Location: content/foundations-price.json, Chapter 8 optional reference paragraph and mirrored-family figure caption.
- Finding and evidence: The paragraph says the double-bottom panel “inverts the core double-top prices around a 110 reference.” Every D1–D11 candidate close and branch A close satisfies 110 minus the core price. The alternative branch deliberately uses 49/48/49/48, while the exact mirror of core branch B is 48.50/48/49/48. The geometry and invalidation classification remain correct; the unqualified price-identity statement does not hold for the alternative D12 close.
- Proposed resolution: State which candidate and continuation prices are exact mirrors and identify the alternative as separately supplied.
- Acceptance criteria: Recalculate the identical candidate and completed-branch mirrors; explain the separately supplied invalidation branch without changing its coherent values or outcome.
- Discussion / progress: Found by independent Decimal comparison; source data and model rules are unchanged.
- Disposition: resolved
- Closed by / date: /root / 2026-10-03
- Resolution: Qualified the exact mirror as the D1–D11 candidate and completed branch A. Explicitly distinguished the separately supplied alternative 49 from exact mirror 48.50; both undercut 50. Updated the optional-family caption without altering coherent prices or outcomes.
- Changed locations: content/foundations-price.json, Chapter 8 optional reference paragraph and optional-family figure caption; rebuilt book/manuscript and assets/figures/chart-patterns-3.svg.
- Verification: Independent Decimal comparisons reproduce all 15 completed-branch mirror values, all 11 alternative-prefix mirror values, exact 48.50 and supplied 49 invalidation, all three head/shoulders mirrored series and dated necklines. Actual 260/760px raster geometry was inspected; final rendered markup is identical except for the corrected outer SVG description. Native 390px top-level reader and 320/1280px native child frames contain the complete qualified paragraph; all answers and quiz feedback agree.
- Shared verification / scope: [Publication batch 3](PUBLICATION_BATCH3_20261003.md) links 315 independent comparisons, seven primary URL inspections and one NBER retrieval failure, all eight actual figures at 260/760px, nine native browser route/width checks and 146 manuscript checks. All three numerical verifiers and normal/strict/syntax checks pass; isolated build matches all 74 generated outputs. One coordinated shared rebuild. Native keyboard opens Chapter 8 continuation and Part 2 first solution after a failed first press and explicit-tab retry. Preview snapshot/resize/evaluation failures and child-frame limits are recorded. ROAD-003/004/006 remain pending; CA1-026 remains deferred with zero human participants/observations.


### PUB4-001 — Chapter 14 omits session 9's exact touch of A's 50% level
- Priority / type: P2 / defect
- Status: in_progress
- Owner: claude-code-main (2026-10-03)
- Reviewer / date: claude-code-main / 2026-10-03
- Location: `content/indicators-context.json`, Chapter 14 `fibonacci`, “Follow a fixed reaction definition”.
- Finding and evidence: The classification lists session 9's distance to A's 38.2% line ($2.36) and 61.8% line ($2.36) but not A's 50% line, which is exactly $110 = the session-9 close. Enumerating all six A/B grid levels after the session-7 confirmation finds two near-touches, both at session 9 (B 61.8% and A 50%). The guided practice later notices the A midpoint, but the main classification reads as if A has no qualifying level. That undermines the chapter's own lesson about fixing which lines are tested.
- Proposed resolution: State that the reaction test applies to each window's drawn 61.8% line, and acknowledge the A 50% touch and its failed rebound ($109/$107 never reach $112).
- Acceptance criteria: Prose names the tested lines; the A 50% touch and its outcome are stated and match the guided practice; recalculated distances agree.
- Discussion / progress: Found and implemented in publication batch 4; one coordinated rebuild.
- Disposition: resolved
- Closed by / date: claude-code-main / 2026-10-03
- Resolution: Stated that the reaction test applies to each window's drawn 61.8% line, replaced the 38.2% distance with A's 61.8% distance, and acknowledged session 9's exact touch of A's undrawn 50% midpoint, whose $112 rebound threshold is also missed.
- Changed locations: content/indicators-context.json, Chapter 14 “Follow a fixed reaction definition” paragraph 1; rebuilt book/manuscript.
- Verification: Enumerating all six A/B levels after the session-7 confirmation yields near-touches only at session 9 (B 61.8%, A 50%). Distances 0.112, 2.36 and 0 and both failed rebounds (max of $109/$107 below $112.112 and $112) recalculated; text agrees with the guided-practice solution. New wording present in reader at 1280/390/320px and manuscript.
- Shared verification / scope: [Publication batch 4](PUBLICATION_BATCH4_20261003.md) links 552 independent Fraction/Decimal comparisons, 15 primary source pages (Investor.gov via curl after WebFetch 403), 26 portable rasters at 260/760px, and native browser checks of six chapter routes plus Part 3 at 1280/390/320px (552 items per narrow width, 0 missing, 0 SVG text clips, 0 overflow). All three numerical verifiers and normal/strict/syntax checks pass; one coordinated rebuild; an isolated build matches all 74 generated outputs. Only eight SVG exports changed. ROAD-003/004/006 remain pending; CA1-026 remains deferred with zero human participants/observations.

### PUB4-002 — Chapter 10 and Part 3 refer to a nonexistent or ambiguous referent
- Priority / type: P3 / editorial recommendation
- Status: in_progress
- Owner: claude-code-main (2026-10-03)
- Reviewer / date: claude-code-main / 2026-10-03
- Location: Chapter 10 “Read both panels before adding a filter”, final paragraph; Part 3 task 2 “Match the tool to the evidence”.
- Finding and evidence: Chapter 10 says “Three averages of the same closes … persistence across lookbacks”, but the chapter shows two averages (SMA and EMA) with the same five-session lookback. Part 3 says “the volume chapter’s 12-trade tape”; Chapter 3 is titled “Volume”, while the tape is in Chapter 13 “Volume tools”.
- Proposed resolution: Say two averages that differ in weighting; name the volume-tools chapter.
- Acceptance criteria: Rebuilt reader/manuscript text names the actual series and chapter.
- Discussion / progress: Found and implemented in publication batch 4; one coordinated rebuild.
- Disposition: resolved
- Closed by / date: claude-code-main / 2026-10-03
- Resolution: Chapter 10 now says two averages with an equal five-session lookback, distinguishing weighting rather than lookback. Part 3 task 2 names the volume-tools chapter.
- Changed locations: content/indicators-context.json, Chapter 10 final paragraph of “Read both panels before adding a filter”; Part 3 task 2 question.
- Verification: Old phrases absent and new phrases present in book.js and MANUSCRIPT.md; reader routes contain the complete paragraphs at all three widths.
- Shared verification / scope: [Publication batch 4](PUBLICATION_BATCH4_20261003.md) links 552 independent Fraction/Decimal comparisons, 15 primary source pages (Investor.gov via curl after WebFetch 403), 26 portable rasters at 260/760px, and native browser checks of six chapter routes plus Part 3 at 1280/390/320px (552 items per narrow width, 0 missing, 0 SVG text clips, 0 overflow). All three numerical verifiers and normal/strict/syntax checks pass; one coordinated rebuild; an isolated build matches all 74 generated outputs. Only eight SVG exports changed. ROAD-003/004/006 remain pending; CA1-026 remains deferred with zero human participants/observations.

### PUB4-003 — Chapter 11 restates the same MACD snapshot twice
- Priority / type: P3 / editorial recommendation
- Status: in_progress
- Owner: claude-code-main (2026-10-03)
- Reviewer / date: claude-code-main / 2026-10-03
- Location: Chapter 11 “MACD asks a different question” paragraph 2 and “Read the MACD lines before reading the histogram” paragraph 4.
- Finding and evidence: Both paragraphs introduce “fast EMA $52 and slow EMA $50 give MACD $2 … signal $1.50 gives histogram $0.50” as if new. The second continues to a different later state (signal $1.90, histogram −$0.10), so the repetition obscures that it is the same snapshot extended.
- Proposed resolution: Make the second passage refer back to the earlier snapshot and present only the new contrast.
- Acceptance criteria: One introduction of the snapshot; all three histogram values remain correct.
- Discussion / progress: Found and implemented in publication batch 4; one coordinated rebuild.
- Disposition: resolved
- Closed by / date: claude-code-main / 2026-10-03
- Resolution: The second passage now refers back to the earlier MACD $2 / signal $1.50 / histogram $0.50 snapshot and presents only the new −$0.10 contrast.
- Changed locations: content/indicators-context.json, Chapter 11 “Read the MACD lines before reading the histogram” paragraph 4.
- Verification: Histogram values 0.50, 0.20 and −0.10 recalculated; the snapshot is introduced once; reader and manuscript contain the revised paragraph.
- Shared verification / scope: [Publication batch 4](PUBLICATION_BATCH4_20261003.md) links 552 independent Fraction/Decimal comparisons, 15 primary source pages (Investor.gov via curl after WebFetch 403), 26 portable rasters at 260/760px, and native browser checks of six chapter routes plus Part 3 at 1280/390/320px (552 items per narrow width, 0 missing, 0 SVG text clips, 0 overflow). All three numerical verifiers and normal/strict/syntax checks pass; one coordinated rebuild; an isolated build matches all 74 generated outputs. Only eight SVG exports changed. ROAD-003/004/006 remain pending; CA1-026 remains deferred with zero human participants/observations.

### PUB4-004 — Chapter 12 gap figure label notches the previous candle body
- Priority / type: P2 / defect
- Status: in_progress
- Owner: claude-code-main (2026-10-03)
- Reviewer / date: claude-code-main / 2026-10-03
- Location: Chapter 12 `volatility` primary figure, “Prior C = 100” annotation.
- Finding and evidence: At 260px and 760px the label background, placed below-right of the $100 close, covers the lower-right part of the previous candle's $99–$100 body. The body appears notched, which misdraws the very candle geometry the figure teaches.
- Proposed resolution: Place the label above the point, beside the upper shadow.
- Acceptance criteria: Rasters at 260/320/760px show the complete body and shadow with all three labels readable.
- Discussion / progress: Found and implemented in publication batch 4; one coordinated rebuild.
- Disposition: resolved
- Closed by / date: claude-code-main / 2026-10-03
- Resolution: Moved the “Prior C = 100” label above the point, beside the upper shadow.
- Changed locations: content/indicators-context.json, Chapter 12 primary figure annotation placement; assets/figures/volatility.svg.
- Verification: 260/320/760px rasters show the complete $99–$100 body and $101 shadow with all three labels readable; native SVG text bounds show no clipping at 1280/390/320px.
- Shared verification / scope: [Publication batch 4](PUBLICATION_BATCH4_20261003.md) links 552 independent Fraction/Decimal comparisons, 15 primary source pages (Investor.gov via curl after WebFetch 403), 26 portable rasters at 260/760px, and native browser checks of six chapter routes plus Part 3 at 1280/390/320px (552 items per narrow width, 0 missing, 0 SVG text clips, 0 overflow). All three numerical verifiers and normal/strict/syntax checks pass; one coordinated rebuild; an isolated build matches all 74 generated outputs. Only eight SVG exports changed. ROAD-003/004/006 remain pending; CA1-026 remains deferred with zero human participants/observations.

### PUB4-005 — Bar charts show negative ticks for non-negative quantities
- Priority / type: P2 / defect
- Status: in_progress
- Owner: claude-code-main (2026-10-03)
- Reviewer / date: claude-code-main / 2026-10-03
- Location: `figure-renderer.js` y-domain padding; affected exports `volume.svg`, `volume-2.svg` (Ch. 3), `momentum-2.svg` (Ch. 11), `volume-tools.svg` (Ch. 13), `statistics.svg` (Ch. 25), `system-design.svg` (Ch. 26).
- Finding and evidence: When a chart contains bars, the renderer includes zero and then pads 12% below it, so all-positive quantities get negative axis labels: −36 shares per trade, −0.24 million shares, negative trade counts. A share count cannot be negative, and beginners read tick labels literally.
- Proposed resolution: When bars are present and every plotted value is non-negative, start the axis at zero; leave genuinely signed series (OBV, histograms with negative bars) unchanged.
- Acceptance criteria: Only those six exports change; each is inspected at compact and wide widths with a zero baseline and no new collisions; all other exports are byte-identical.
- Discussion / progress: Found and implemented in publication batch 4; one coordinated rebuild.
- Disposition: resolved
- Closed by / date: claude-code-main / 2026-10-03
- Resolution: When a chart contains bars and every plotted value is non-negative, the y-axis now starts at zero instead of padding below it. Signed series (OBV table, histograms) keep the previous behaviour.
- Changed locations: figure-renderer.js y-domain; rebuilt volume.svg, volume-2.svg, momentum-2.svg, volume-tools.svg, statistics.svg and system-design.svg.
- Verification: Rendering every export with the patched renderer changes exactly those six bar figures; all other figures are byte-identical. Each was inspected at 260 and 760px: zero baseline, no negative ticks, no new collisions. The Chapter 26 equity-panel crowding that was already there is logged separately as PUB4-009.
- Shared verification / scope: [Publication batch 4](PUBLICATION_BATCH4_20261003.md) links 552 independent Fraction/Decimal comparisons, 15 primary source pages (Investor.gov via curl after WebFetch 403), 26 portable rasters at 260/760px, and native browser checks of six chapter routes plus Part 3 at 1280/390/320px (552 items per narrow width, 0 missing, 0 SVG text clips, 0 overflow). All three numerical verifiers and normal/strict/syntax checks pass; one coordinated rebuild; an isolated build matches all 74 generated outputs. Only eight SVG exports changed. ROAD-003/004/006 remain pending; CA1-026 remains deferred with zero human participants/observations.

### PUB4-006 — Chapter 3 compact volume panel hides the D6 marker
- Priority / type: P2 / defect
- Status: in_progress
- Owner: claude-code-main (2026-10-03)
- Reviewer / date: claude-code-main / 2026-10-03
- Location: Chapter 3 `volume` primary figure, “Share volume and a defined reference” panel (accepted in batch 2).
- Finding and evidence: At 260px the “1.8 ×” and “2.0 ×” labels collide; the fallback places “2.0 ×” over the D6/D7 bar tops and hides the D6 marker. The same occlusion occurs with the original renderer, so PUB4-005 did not cause it; batch 2 did not record it. Related to the AUD2-018 compact-label class.
- Proposed resolution: As in the AUD2-018 Chapter 5 precedent, keep one chart label (D7) and state both ratios in the panel caption.
- Acceptance criteria: 260/320/760px rasters show every bar top unobstructed; both ratios remain in the caption and table; Chapter 3 acceptance is rechecked against its new fingerprint.
- Discussion / progress: Found and implemented in publication batch 4; one coordinated rebuild.
- Disposition: resolved
- Closed by / date: claude-code-main / 2026-10-03
- Resolution: Kept the D7 “2.0 ×” label on the chart and moved both ratios into the panel caption (“D6 is 1.8 × and D7 2.0 × that baseline”), following the AUD2-018 Chapter 5 precedent.
- Changed locations: content/foundations-price.json, Chapter 3 primary figure volume-panel annotations and caption; assets/figures/volume.svg.
- Verification: The original renderer reproduces the occlusion, so it was not caused by PUB4-005. Final 260/320/760px rasters show every bar top unobstructed; baseline 1.0 = mean(0.8, 1, 0.9, 1.1, 1.2), and the ratios 1.8/2.0 were recalculated. Chapter 3's new fingerprint and Part 1 dependency were re-reviewed in batch 4.
- Shared verification / scope: [Publication batch 4](PUBLICATION_BATCH4_20261003.md) links 552 independent Fraction/Decimal comparisons, 15 primary source pages (Investor.gov via curl after WebFetch 403), 26 portable rasters at 260/760px, and native browser checks of six chapter routes plus Part 3 at 1280/390/320px (552 items per narrow width, 0 missing, 0 SVG text clips, 0 overflow). All three numerical verifiers and normal/strict/syntax checks pass; one coordinated rebuild; an isolated build matches all 74 generated outputs. Only eight SVG exports changed. ROAD-003/004/006 remain pending; CA1-026 remains deferred with zero human participants/observations.

### PUB4-007 — Chapter 14 origin labels cover the rising price line
- Priority / type: P3 / defect
- Status: in_progress
- Owner: claude-code-main (2026-10-03)
- Reviewer / date: claude-code-main / 2026-10-03
- Location: Chapter 14 primary figure, “A origin” and “B origin” annotations.
- Finding and evidence: Placed above-right, both label backgrounds overlay the steep session 1–3 segment at 260px and 760px, breaking the line next to the two origins the figure compares.
- Proposed resolution: Place both labels below the rising path.
- Acceptance criteria: Rasters show both origin points and the session 1–3 path; any residual compact overlap is recorded.
- Discussion / progress: Found and implemented in publication batch 4; one coordinated rebuild.
- Disposition: resolved
- Closed by / date: claude-code-main / 2026-10-03
- Resolution: Placed both origin labels below the rising path.
- Changed locations: content/indicators-context.json, Chapter 14 primary figure annotation placements; assets/figures/fibonacci.svg.
- Verification: At 760px both origins and the session 1–3 path are unobstructed. At 260px a short stretch of the session 2–3 segment still passes behind the B label; both origin points and every marked point stay visible. Recorded as an accepted residual.
- Shared verification / scope: [Publication batch 4](PUBLICATION_BATCH4_20261003.md) links 552 independent Fraction/Decimal comparisons, 15 primary source pages (Investor.gov via curl after WebFetch 403), 26 portable rasters at 260/760px, and native browser checks of six chapter routes plus Part 3 at 1280/390/320px (552 items per narrow width, 0 missing, 0 SVG text clips, 0 overflow). All three numerical verifiers and normal/strict/syntax checks pass; one coordinated rebuild; an isolated build matches all 74 generated outputs. Only eight SVG exports changed. ROAD-003/004/006 remain pending; CA1-026 remains deferred with zero human participants/observations.

### PUB4-008 — Batch 4 source locators and source lists need tightening
- Priority / type: P3 / source support
- Status: in_progress
- Owner: claude-code-main (2026-10-03)
- Reviewer / date: claude-code-main / 2026-10-03
- Location: Chapter 13 evidence for OBV and volume profile, Chapter 14 evidence for the common grid; Chapter 13 `sources`.
- Finding and evidence: Three evidence locators cite line numbers from an extracted text dump (“OBV Calculation 256–262”, “Description 243–245 and Calculation 253–255”, “opening 15–16; Calculation methodology 43–56; Typical levels 59”), which a reader cannot reproduce. Re-inspection on 2026-10-03: Fidelity's OBV rules sit under “Description”; Fidelity Fibonacci levels under “Description”, and it lists 50% among its “Fibonacci levels”, so the evidence note's “50% is identified as a midpoint convention” must be attributed to the book, not the source. Chapter 13 lists `ic-splits` (stock splits) although no Chapter 13 claim or evidence record uses it.
- Proposed resolution: Use page headings as locators, attribute the 50% statement to the chapter's own arithmetic, and remove the unused source from Chapter 13.
- Acceptance criteria: Rebuilt evidence matrix/manuscript shows heading locators; `ic-splits` remains only where cited; strict checks pass.
- Discussion / progress: Found and implemented in publication batch 4; one coordinated rebuild.
- Disposition: resolved
- Closed by / date: claude-code-main / 2026-10-03
- Resolution: Replaced the three line-number locators with page-heading locators, attributed the 50% halfway statement to the chapter's own arithmetic (Fidelity lists 50% among its “Fibonacci levels”), and removed the unused ic-splits from Chapter 13's sources.
- Changed locations: content/indicators-context.json, Chapter 13 OBV/profile evidence, Chapter 14 grid evidence, Chapter 13 sources; rebuilt evidence matrix/manuscript.
- Verification: All 15 batch source pages re-inspected 2026-10-03 (source-checks.json); the heading locators are present in EVIDENCE_MATRIX.md and the line-number locators are gone. ic-splits is still cited by Chapters 15 and 18 and no longer by Chapter 13. Strict checks pass.
- Shared verification / scope: [Publication batch 4](PUBLICATION_BATCH4_20261003.md) links 552 independent Fraction/Decimal comparisons, 15 primary source pages (Investor.gov via curl after WebFetch 403), 26 portable rasters at 260/760px, and native browser checks of six chapter routes plus Part 3 at 1280/390/320px (552 items per narrow width, 0 missing, 0 SVG text clips, 0 overflow). All three numerical verifiers and normal/strict/syntax checks pass; one coordinated rebuild; an isolated build matches all 74 generated outputs. Only eight SVG exports changed. ROAD-003/004/006 remain pending; CA1-026 remains deferred with zero human participants/observations.

### HOME1-001 — Overview page carries filler copy and an unsupported chart label
- Priority / type: P3 / editorial recommendation
- Status: resolved
- Owner: claude-code-main
- Reviewer / date: user request via claude-code-main / 2026-10-03
- Location: `app.js` `renderHome()` and `overviewIllustration()`; browser Overview page.
- Finding and evidence: The user reported "a lot of dumb text" on the first page. The page stacked an eyebrow, hero footnote ticks, a chart-sheet heading ("A picture of price / Every chart tells a story / FIG. 01"), a handwritten-style note, a three-item marketing strip, section subtitles, an eyebrow on the playground card and a word-count line. The hero chart also labelled an "earlier support area" that price never revisits — a decorative claim of the kind the book teaches readers to question.
- Proposed resolution: Remove filler, keep the headline, one-sentence description, two actions, the illustration, the six part cards, the playground link and a short edition note.
- Acceptance criteria: Overview reads as headline → chart → parts → playground with no duplicated taglines; layout intact at desktop and phone widths.
- Disposition: resolved
- Closed by / date: claude-code-main / 2026-10-03
- Resolution: Removed eyebrow, hero footnote, sheet heading, chart note, intro strip, section subtitle and playground eyebrow; tightened the hero sentence and button labels; replaced the word-count line with "Draft edition · 28 chapters in editorial review"; home breadcrumb now "Overview"; removed the support-area band from the hero SVG. Pre-change copy: `tmp/app.js.bak-home-20261003`. Cache key bumped in `index.html`. No authoring JSON or generated book files changed.
- Changed locations: `app.js`, `index.html`.
- Verification: `node --check app.js`; `npm run check` passed; Overview inspected in browser at 1440×900 and 390×844. Unused CSS for removed elements left in `styles.css`.
- Related IDs: none.
- Follow-up / 2026-10-03 (claude-code-main, user approved all three suggestions): removed part-card descriptions (cards now size to content), removed the -2° tilt on the hero chart, and removed the sidebar tagline and the topbar edition badge (plus the now-unused `.edition` update in `app.js`). Changed `app.js`, `index.html`, `styles.css`; backups `tmp/*.bak-home*-20261003`. Verified: `node --check`, `npm run check` passed; browser at 1280×800 and 390×844 — no horizontal overflow, badge/tagline absent, sheet transform `none`. `npm run status` now reports these three files as changed against the last verification checkpoint; that is expected.

### PUB4-009 — Chapter 26 compact equity panel crowds labels onto the line
- Priority / type: P3 / defect
- Status: resolved
- Owner: claude-code-alpha (claimed 2026-10-11)
- Reviewer / date: claude-code-main / 2026-10-03
- Location: Chapter 26 `system-design` primary figure, “Equity at each close ($)” panel at 260px.
- Finding and evidence: Seen while checking PUB4-005's effect on this export. At 260px the four labels “S2 Hazel time exit”, “S4 Fir gap exit”, “S5 Birch stop” and “S6 Alder target” stack over the S3–S6 equity path, breaking the line between the marked points. PUB4-005 changes only the slot-count panel, not this one. Chapter 26 is outside batch 4, so this was not fixed.
- Proposed resolution: During Chapter 26's publication review, simplify the compact labels or move detail to the caption/table, as in AUD2-018.
- Acceptance criteria: 260/320/760px rasters show the full equity path and all marked points.
- Discussion / progress: Reproduced 2026-10-11 against current files: 417 of 1,000 equal-distance equity-path samples fall inside label backgrounds at 260px (226 at 320px) and three marked points are covered at 260px. Tried trade-name labels under every existing above/below placement (best: 131 samples covered at 260px) and with a trial left-first renderer option; only session-only labels reached zero without a renderer change.
- Disposition: resolved
- Closed by / date: claude-code-alpha / 2026-10-11
- Resolution: Following the AUD2-018/PUB4-006 precedent, the four chart labels are now session numbers only (“S2”, “S4”, “S5”, “S6”) with their existing placements. The trade name, exit type and net result move to a new panel caption: “Closed trades, net of costs: S2 Hazel time exit +$455; S4 Fir gap exit −$730; S5 Birch stop −$241; S6 Alder target +$995.” The full point labels remain as SVG point titles. No shared renderer change.
- Changed locations: content/risk-advanced.json, Chapter 26 primary figure equity panel; rebuilt content/book.js and assets/figures/system-design.svg (the only changed export of 71; MANUSCRIPT.md byte-identical).
- Verification: The four net amounts match the Chapter 26 closed-trade table (Hazel 455.00, Fir −730.00, Birch −241.00, Alder 995.00). Panel rendered from built book.js: 0/1,000 path samples covered and zero hidden markers at 260/320/390/760px. Actual 260px, 320px and 760px export rasters inspected: full path, all four markers and the wrapped panel caption visible. All three numerical verifiers pass; build, normal and strict checks pass; JS syntax checks pass. Rasters and the occlusion script are in [alpha-release-assets](alpha-release-assets/).
- Scope / limits: Chapter 26 has not yet been accepted for publication (ROAD-002), so no prior acceptance is invalidated. Native browser and printer output of this figure were not separately checked. Separately recorded ALPHA1-001 (wide slot panel axis labels), a pre-existing issue outside this finding.

## Publication batch 5 — claude-code-alpha, 2026-10-11

Scope: Chapters 15–19 and Part 4. Reviewers: five read-only reviewer agents (one per chapter) dispatched by claude-code-alpha, which verified each finding against the current files, implemented the dispositions and ran one coordinated rebuild (plus two figure-label follow-up rebuilds by the same owner). Shared evidence for every item below: [Publication batch 5](PUBLICATION_BATCH5_20261011.md) and [its assets](publication-batch5-assets/). Common verification: all three numerical verifiers, `npm run check`, strict revision checks and JavaScript syntax checks pass; the five chapter reproduction scripts pass (1,069 Fraction/Decimal comparisons, 0 mismatches); the generated reader and manuscript contain every new string and none of the replaced ones; all 16 previously accepted chapters and Parts 1–3 keep their checkpoint fingerprints.

### PUB5-001 — Breadth chapter uses A and D both as stock names and as advance/decline counts
- Priority / type: P2 / teaching defect
- Status: resolved
- Owner: claude-code-alpha (claimed 2026-10-11)
- Reviewer / date: batch-5 Chapter 16 reviewer agent / 2026-10-11
- Location: content/indicators-context.json, `breadth` sections[1].paragraphs[0] and [2]; sections[2].paragraphs[0].
- Finding and evidence: The constituents are named A–D, while the formulas define “A” as the advancing count and “D” as the declining count. One sentence reads “A rises 109→110 … A = 1, D = 1”, and the ratio “A/D” reads like stock A over stock D. “In the first example, 60/90” actually refers to the 100-stock illustration, not the four-stock dataset introduced first.
- Proposed resolution: Use distinct count symbols and name the 100-stock example.
- Acceptance criteria: No formula or count uses a constituent letter; conventional names “A/D line”/“Cumulative A/D” may remain.
- Discussion / progress: Verified against the current text before editing.
- Disposition: resolved
- Closed by / date: claude-code-alpha / 2026-10-11
- Resolution: Counts are now `adv`/`dec` (net = adv − dec; ratio adv/dec; fractions adv/(adv + dec) and adv/U). The session-12 count reads “advances = 1, declines = 1, unchanged = 2”. “In the first example” became “On day one of the 100-stock example”.
- Changed locations: content/indicators-context.json; rebuilt book/manuscript.
- Verification: Remaining “A/D” strings are only the conventional line names (table column, panel title, legend, evidence claim). Breadth reproduction script 345/345.

### PUB5-002 — Multi-timeframe chapter calls one direction mismatch a conflict and refuses the term for its mirror
- Priority / type: P2 / teaching defect
- Status: resolved
- Owner: claude-code-alpha (claimed 2026-10-11)
- Reviewer / date: batch-5 Chapter 17 reviewer agent / 2026-10-11
- Location: content/indicators-context.json, `multi-timeframe` sections[2].paragraphs[0–1], sections[4].paragraphs[2].
- Finding and evidence: Sessions 8–9 (daily down, completed week up) are told “Calling the views contradictory would erase their different boundaries”, while session 11 (daily up, completed week down) “should record a conflict” and is called “the genuine conflict”. The unstated reason is that the aligned/conflicting labels apply only to upward daily changes. A third category, “still provisional”, is offered but never defined or used.
- Proposed resolution: Define the labels explicitly for upward daily changes, say that differing directions are not contradictory descriptions, and remove the undefined category.
- Acceptance criteria: One consistent definition; sessions 8–9 explicitly unlabeled; no undefined category.
- Discussion / progress: Verified against the current text before editing. The reviewer's alternative exercise was declined as an editorial preference; the existing exercise and quiz remain correct.
- Disposition: resolved
- Closed by / date: claude-code-alpha / 2026-10-11
- Resolution: “We then label an upward daily change aligned when completed-week context is up and conflicting when it is down-or-equal. The label compares directions over different intervals; it does not mean either description is wrong, and the developing week is never used to assign it.” Sessions 8–9 now: “The directions differ, but the descriptions do not contradict each other … Because the labels apply only to upward daily changes, sessions 8 and 9 receive neither label.” “genuine conflict” → “labelled conflict”.
- Changed locations: content/indicators-context.json; rebuilt book/manuscript.
- Verification: The reproduction script independently classifies rising sessions as aligned 2, 4, 5, 6, 7, 15 and conflicting 11, 12, 13, consistent with the new definition; 219/219 comparisons.

### PUB5-003 — Events chapter does not distinguish a close-to-open gap from a range gap
- Priority / type: P2 / teaching gap (editorial recommendation)
- Status: resolved
- Owner: claude-code-alpha (claimed 2026-10-11)
- Reviewer / date: batch-5 Chapter 18 reviewer agent / 2026-10-11
- Location: content/indicators-context.json, `events` sections[1].paragraphs[2].
- Finding and evidence: The chapter is the glossary target for “Gap”, and the research appendix's glossary-trace record lists as a limit that “A close-to-open gap and a gap beyond the entire previous range are different criteria.” The chapter never teaches that distinction; its own case satisfies both, so a reader cannot tell which one the word means.
- Proposed resolution: Add the stricter range test, show that both agree here, and give a case where they differ.
- Acceptance criteria: Both definitions stated and checked against the case's numbers.
- Discussion / progress: Accepted as a substantive teaching improvement rather than an error.
- Disposition: resolved
- Closed by / date: claude-code-alpha / 2026-10-11
- Resolution: Appended: “A stricter test asks whether the whole new range lies outside the previous session’s range. Here both tests agree, because the $47 high is below the prior $50 low. They can disagree: an open below the prior close that later trades back into the prior high–low range is a close-to-open gap but not a range gap. State which definition a rule uses.”
- Changed locations: content/indicators-context.json; rebuilt book/manuscript.
- Verification: Prior L $50 > next H $47 recomputed from the figure candles.

### PUB5-004 — Microstructure attributes the whole $65-versus-$20 difference to book depth
- Priority / type: P2 / misleading explanation
- Status: resolved
- Owner: claude-code-alpha (claimed 2026-10-11)
- Reviewer / date: batch-5 Chapter 19 reviewer agent / 2026-10-11
- Location: content/indicators-context.json, `market-microstructure` sections[5].paragraphs[1].
- Finding and evidence: “It differs from the earlier 100-share round trip’s $20 because order size reached beyond the first quote.” Of the $45 difference, $30 is 150 more shares paying the same $0.20 spread (250 × $0.20 = $50); only $15 (150 × $0.10) comes from the second ask level. Per share: $0.26 versus $0.20.
- Proposed resolution: Decompose the loss.
- Acceptance criteria: Text states $50 spread + $15 depth = $65 and the per-share comparison.
- Discussion / progress: Recalculated before editing.
- Disposition: resolved
- Closed by / date: claude-code-alpha / 2026-10-11
- Resolution: “On 250 shares the $0.20 spread alone costs $50; the remaining $15 is the extra $0.10 paid on the 150 shares taken at the second ask level. Per share the loss is $0.26, against $0.20 for the earlier 100-share round trip; that $0.06 difference is what reaching beyond the first quote cost.”
- Changed locations: content/indicators-context.json; rebuilt book/manuscript.
- Verification: 250 × 0.20 = 50; 150 × 0.10 = 15; 65/250 = 0.26; 12,540 − 12,475 = 65 (Decimal).

### PUB5-005 — “Marketable” is undefined and contrasted with a limit order that is itself marketable
- Priority / type: P2 / inexact definition
- Status: resolved
- Owner: claude-code-alpha (claimed 2026-10-11)
- Reviewer / date: batch-5 Chapter 19 reviewer agent / 2026-10-11
- Location: content/indicators-context.json, `market-microstructure` sections[2].paragraphs[1–2], sections[2].tables[0].rows[0][0], outcomes[2].
- Finding and evidence: “A marketable buy for 250 shares” is contrasted with “Buy limit $50.10”, but a buy limit at the best ask is also marketable (for 100 shares). The cited Investor.gov source describes market orders.
- Proposed resolution: Call it a market buy order and note the equivalent limit.
- Acceptance criteria: No undefined “marketable”; the limit row is explained.
- Discussion / progress: Verified before editing.
- Disposition: resolved
- Closed by / date: claude-code-alpha / 2026-10-11
- Resolution: “A market buy order for 250 shares (a buy limit at $50.20 or higher would fill the same way here) first takes 100 at $50.10.” Table row “Market buy, 250 shares”; outcome “full market-order purchase”; added “It can execute immediately only against the 100 shares offered at $50.10.”
- Changed locations: content/indicators-context.json; rebuilt book/manuscript.
- Verification: No “marketable” remains in the authoring files; a $50.20 limit against asks 100@50.10 and 200@50.20 fills all 250 (Decimal).

### PUB5-006 — Part 4 figure labels cover data at compact widths
- Priority / type: P2 / misleading visual
- Status: resolved (residual edge-clamping tracked as PUB5-012)
- Owner: claude-code-alpha (claimed 2026-10-11)
- Reviewer / date: claude-code-alpha / 2026-10-11
- Location: content/indicators-context.json figure annotations: `relative-strength` absolute panel; `breadth` index panel; `multi-timeframe` step chart; `events` candle figure.
- Finding and evidence: Measured on renderer output (label-coverage.cjs) and inspected in 260/760px rasters. Chapter 17's week labels covered 23.3% of path samples at 260px (13.5% at 760px) and hid the week-3 marker; Chapter 18's “C = 46; rise +3” box hid the top of the $47 wick and “O = 43; gap −9” clipped the $42 wick (16 wick samples); Chapter 16's “104.30” label hid the session 11→12 segment at 760px; Chapter 15's “Stock 90” broke the stock line between sessions 8 and 11 at 260px.
- Proposed resolution: Shorter labels and placements chosen by measurement, with detail kept in captions/tables, following AUD2-018/PUB4-006/PUB4-009.
- Acceptance criteria: Rasters show complete paths, wicks and markers; measured coverage near zero.
- Discussion / progress: Placements were searched across above/below and short-label variants at 260/320/390/760px.
- Disposition: resolved
- Closed by / date: claude-code-alpha / 2026-10-11
- Resolution: Ch 15 “Stock 90” → “90”. Ch 16 “104.30” placed below. Ch 17 labels “105”/“103” below; the week-3 label removed and the caption now states “sessions 5, 10 and 15, to $105, $103 and $110” and that the developing weekly close is the daily line. Ch 18 labels “Prior C 52”, “O 43”, “C 46”; the full O/H/L/C values remain under the chart and in the caption. Renderer unchanged.
- Changed locations: content/indicators-context.json; assets/figures relative-strength, breadth, multi-timeframe, multi-timeframe-2, events, market-microstructure-2 SVGs (the last two from caption text only).
- Verification: Maximum covered path share 23.3% → 1.6%; covered wick samples 16 → 0; hidden markers 5 → 3 (all three are the edge-clamp case in PUB5-012). 18 after-rasters and 10 before-rasters inspected in figures/.

### PUB5-007 — Relative-strength locators, source scope and repeated example
- Priority / type: P3 / source support and polish
- Status: resolved
- Owner: claude-code-alpha (claimed 2026-10-11)
- Reviewer / date: batch-5 Chapter 15 reviewer agent / 2026-10-11
- Location: content/indicators-context.json `relative-strength` evidence[0].location, sections[4].paragraphs[2], sections[5].paragraphs[0] and [2], figure caption; sources `ic-splits`; content/research-context.json chapterAdditions relative-strength section and evidence limits.
- Finding and evidence: The Fidelity page has no “Calculation” heading; `ic-splits.supports` claimed chart comparability that the glossary entry does not state; the Jegadeesh & Titman limit text was copied from a breakout chapter (“distinct from a discretionary breakout”); “That supportive portfolio evidence” referred to a result never stated; the manufacturer example was reintroduced as “a second, deliberately contrasting interval”; the 112.5 vs 105.88 gap was said to “partly” reflect market weakness although it entirely does; “optional system-design task” although that chapter is not optional; “changing sessions” unclear.
- Proposed resolution: Correct locators/supports, state the study result and its reversal limit, and tighten wording.
- Acceptance criteria: Each statement matches its source page or the book's own arithmetic.
- Discussion / progress: Source pages inspected 2026-10-11 (records in assets).
- Disposition: resolved
- Closed by / date: claude-code-alpha / 2026-10-11
- Resolution: Implemented the corrections; the J&T limit now reads “Historical cross-sectional portfolio evidence; distinct from a single stock/benchmark price ratio … The study also reports that part of the first-year abnormal return dissipates over the following two years.” The section says the 1965–1989 NYSE/AMEX portfolios “earned positive returns”.
- Changed locations: content/indicators-context.json; content/research-context.json; rebuilt book/manuscript/evidence matrix.
- Verification: Reproduction 193/193; source records relative-strength-source-checks.json.

### PUB5-008 — Breadth evidence pointer, quiz feedback, model note and source locator
- Priority / type: P3 / polish and source support
- Status: resolved
- Owner: claude-code-alpha (claimed 2026-10-11)
- Reviewer / date: batch-5 Chapter 16 reviewer agent / 2026-10-11
- Location: content/indicators-context.json `breadth` sections[5].paragraphs[2], quiz.feedback[2], practice[1].solution[3], evidence[0].location, sources `ic-breadth`.
- Finding and evidence: “belongs in the empirical review” implies breadth evidence the appendix does not contain; quiz feedback for 75% guessed at the error rather than naming session 11; the model note failed its own marking rule (no comparison periods, omitted the unchanged stock); the Fidelity locator named a non-existent heading.
- Proposed resolution: As implemented below.
- Acceptance criteria: Statements match the appendix, the data and the source page headings.
- Disposition: resolved
- Closed by / date: claude-code-alpha / 2026-10-11
- Resolution: “This edition reports no study testing whether a breadth divergence … predicts later index returns. Do not infer a forecast from this accounting example.” Quiz: “75% is session 11’s figure (three advances, one decline)…”. Model note names session 0→1, the unchanged stock, the session −1 to 1 history window and E's exclusion. Locator: “Fidelity.com Help – Glossary: A, entries “A/D Line” … and “A/D Line (breadth)”.”
- Changed locations: content/indicators-context.json; rebuilt book/manuscript/evidence matrix.
- Verification: Session 11 counts 3/1/0 and session 12 counts 1/1/2 recomputed; practice table supports the −1 to 1 window.

### PUB5-009 — Multi-timeframe figure wording and evidence locators
- Priority / type: P3 / polish
- Status: resolved
- Owner: claude-code-alpha (claimed 2026-10-11)
- Reviewer / date: batch-5 Chapter 17 reviewer agent / 2026-10-11
- Location: content/indicators-context.json `multi-timeframe` figure title, figures[0].caption, evidence[0] and [2] locations.
- Finding and evidence: The flow caption referred to “the step chart”, which appears later; the title used colloquial “truly”; one locator named a non-heading, another abbreviated section titles.
- Disposition: resolved
- Closed by / date: claude-code-alpha / 2026-10-11
- Resolution: Title “Daily closes and the last completed weekly close (step series)”; flow caption “Each state is sampled after the named daily close, the convention used throughout the chapter.”; locators use the exact TradingView heading “Common characteristics: lookahead” and the chapter's section titles.
- Changed locations: content/indicators-context.json; rebuilt outputs.
- Verification: TradingView page headings re-inspected (multi-timeframe-source-checks.json).

### PUB5-010 — Events range contradicts the figure; dead cross-reference; stop sourcing
- Priority / type: P3 / defect and source support
- Status: resolved
- Owner: claude-code-alpha (claimed 2026-10-11)
- Reviewer / date: batch-5 Chapter 18 reviewer agent / 2026-10-11
- Location: content/indicators-context.json `events` sections[0].paragraphs[0], sections[5].paragraphs[0] and [3], evidence `events-market-limit-ordinary-stop-behavior`.
- Finding and evidence: The prose says a month “between $48 and $52”, but the prior-session candle has H $53. “The evidence review addresses claims about event-based strategies”, but no research section or chapter does. The SEC's explicit “stop price is not the guaranteed execution price” wording is in Trading Basics, which the stop-behavior record did not cite.
- Disposition: resolved
- Closed by / date: claude-code-alpha / 2026-10-11
- Resolution: Range now $48–$53 in both places; cross-reference now “The planning chapter adds an earnings calendar and halt handling to the record. This book reports no study of event-based strategies; the testing chapter describes what evidence such a rule would need.”; the stop record cites `ic-orders` and `ic-order-details` with page locators. `ic-splits` wording is shared with PUB5-007.
- Changed locations: content/indicators-context.json; rebuilt outputs.
- Verification: Candle H 53 recomputed; Chapter 21 earnings-calendar and halt content confirmed in content/risk-advanced.json; SEC Pub. 141 printed pp. 2–3 inspected (events-source-checks.json).

### PUB5-011 — Microstructure definitions, evidence scope and FINRA source record
- Priority / type: P3 / definitions and source support
- Status: resolved
- Owner: claude-code-alpha (claimed 2026-10-11)
- Reviewer / date: batch-5 Chapter 19 reviewer agent / 2026-10-11
- Location: content/indicators-context.json `market-microstructure` sections[0].paragraphs[0–1], sections[1].paragraphs[0], evidence[0] and the IOC evidence record, figures[0].caption, sources `ic-spread`; content/research-context.json glossary-support location for `ic-spread`.
- Finding and evidence: Best bid/ask and midpoint were used before definition; “price improvement” undefined; the IOC evidence record claimed stop-limit coverage the chapter does not contain; the `ic-spread` record was titled “Understanding disclosure documents” while its syndication URL serves FINRA's “Understanding Market Liquidity and Your Investments” (confirmed 2026-10-11 against the canonical finra.org page, same sentences); the spread chart caption did not say the quotes are fictional.
- Disposition: resolved (formatting of the 50.1 table cells and the “SEC’s execution overview” naming left unchanged as minor)
- Closed by / date: claude-code-alpha / 2026-10-11
- Resolution: Added best bid/ask and midpoint definitions with ($49.90 + $50.10)/2 = $50; price improvement defined; IOC record narrowed to IOC with its page locator; `ic-spread` now titled “FINRA · Understanding market liquidity and your investments” at https://www.finra.org/investors/insights/market-liquidity-risk, with both locators updated; caption begins “Fictional quotes.”
- Changed locations: content/indicators-context.json; content/research-context.json; rebuilt outputs.
- Verification: Both FINRA URLs fetched and compared; reproduction 151/151; market-microstructure-source-checks.json (14 checks).


## Renderer correction batch — /root, 2026-10-11

[Report](RENDERER_BATCH_20261011.md) and [retained evidence](renderer-batch-assets/) cover one shared rebuild, all current chart panels and every changed compact/wide figure. No new chapter publication acceptance or human validation is claimed.

### ALPHA1-001 — Wide slot-count panel draws session-0 bars over the y-axis labels
- Priority / type: P3 / defect
- Status: resolved
- Owner: /root (renderer batch, 2026-10-11)
- Reviewer / date: claude-code-alpha / 2026-10-11
- Location: `figure-renderer.js` grouped `bars` layout; seen in Chapter 26 `system-design` “Slot use at each close” panel at 760px.
- Finding and evidence: In the 760px export the session-0 “Open positions” bar starts at the plot's left edge, and the “1.4” and “0.0” tick labels sit under it. The session-7 bar likewise touches the right edge. Same geometry in batch 4's `publication-batch4-assets/system-design-760.png`, so it predates PUB4-009. The 260px layout is unaffected. Other grouped-bar figures have not been surveyed.
- Proposed resolution: Inset the first and last grouped-bar slots from the plot edges in the shared renderer, then re-inspect every bar figure.
- Acceptance criteria: All exported bar figures at 260/760px keep tick labels clear of bars; no new clipping.
- Discussion / progress: /root, 2026-10-11 — Claimed together for one shared-renderer correction batch; survey all exported charts and re-inspect changed figures before closure.
- Disposition: resolved
- Closed by / date: /root / 2026-10-11
- Resolution: Inset observation slots in the shared renderer keep every single/grouped bar inside the plot. Overlaid lines, annotations and tick labels use the same centers. All six bar panels were re-inspected; numerical inputs are unchanged.
- Changed locations: `figure-renderer.js`; authoring count flags in `content/indicators-context.json` and `content/risk-advanced.json` where applicable; rebuilt `content/book.js` and 11 SVG exports; cache keys, regression script, content guide and Pages check gate.
- Verification: [Renderer batch](RENDERER_BATCH_20261011.md): 364 portable chart renders at 260/320/390/760px, 69 marker/background overlaps → 0, 48 escaped bars → 0, integer ticks in all 12 enabled renders; native light/dark surveys also have 0 defects/clips. All 26 changed panels inspected at 260/760px (13 retained PNGs); nine native reader route/viewport checks pass. Documented arithmetic/content checks pass; isolated build matches all 74 outputs. Full compiled content is unchanged except three count-axis flags.
- Scope / limits: This closes the recorded marker/bar/tick issue. It does not promise zero path/wick coverage in every dense chart; no native print output or human learner observations. Accepted chapters’ affected figures rechecked; Chapter 16/Part 4 re-accepted for the flag change; Chapter 25/26 full reviews stay pending.
- Related IDs: PUB5-012, PUB5-013.

### PUB5-012 — A label clamped at the plot edge can cover its own marker
- Priority / type: P3 / defect
- Status: resolved
- Owner: /root (renderer batch, 2026-10-11)
- Reviewer / date: claude-code-alpha / 2026-10-11
- Location: `figure-renderer.js` line-chart annotation placement (candidate boxes are clamped to the plot after the overlap test). Seen in Chapter 15 relative-index panel (“112.50”, 260/320px) and Chapter 19 spread chart (“Spread $0.80”, 260px).
- Finding and evidence: When the preferred box is pushed back inside the plot, it can land on the annotated point; the circle is drawn before the label background. [label-coverage-after.json](publication-batch5-assets/label-coverage-after.json) reports 3 hidden markers, plus 2–8 covered path samples at 260px in Chapters 15/16/19. The values remain readable in labels, captions and tables, so this is not a misleading-data defect.
- Proposed resolution: Treat the annotated point's own small box as occupied during placement (or skip clamped candidates that cover it), then re-render every affected export and re-inspect accepted chapters' figures.
- Acceptance criteria: No annotated marker hidden at 260/320/390/760px across all exports; accepted chapters re-checked where exports change.
- Discussion / progress: /root, 2026-10-11 — Claimed together for one shared-renderer correction batch; survey all exported charts and re-inspect changed figures before closure. Related renderer item: ALPHA1-001.
- Disposition: resolved
- Closed by / date: /root / 2026-10-11
- Resolution: Shared post-clamp placement checks actual label backgrounds against all marker bounds, including later annotations, for line/bar and multi-candle charts. Nearby candidates or the nearest free grid position are used. Expanded survey found the same issue beyond the two originally reported chapters; all changed panels were inspected.
- Changed locations: `figure-renderer.js`; authoring count flags in `content/indicators-context.json` and `content/risk-advanced.json` where applicable; rebuilt `content/book.js` and 11 SVG exports; cache keys, regression script, content guide and Pages check gate.
- Verification: [Renderer batch](RENDERER_BATCH_20261011.md): 364 portable chart renders at 260/320/390/760px, 69 marker/background overlaps → 0, 48 escaped bars → 0, integer ticks in all 12 enabled renders; native light/dark surveys also have 0 defects/clips. All 26 changed panels inspected at 260/760px (13 retained PNGs); nine native reader route/viewport checks pass. Documented arithmetic/content checks pass; isolated build matches all 74 outputs. Full compiled content is unchanged except three count-axis flags.
- Scope / limits: This closes the recorded marker/bar/tick issue. It does not promise zero path/wick coverage in every dense chart; no native print output or human learner observations. Accepted chapters’ affected figures rechecked; Chapter 16/Part 4 re-accepted for the flag change; Chapter 25/26 full reviews stay pending.
- Related IDs: ALPHA1-001, PUB5-013.

### PUB5-013 — Count panels get fractional y-axis ticks
- Priority / type: P3 / editorial recommendation
- Status: resolved
- Owner: /root (renderer batch, 2026-10-11)
- Reviewer / date: claude-code-alpha / 2026-10-11
- Location: `figure-renderer.js` tick generation; Chapter 16 “Cumulative daily A/D” panel.
- Finding and evidence: The integer net-issue count is labelled 0.36, −0.57, −1.50, −2.43, −3.36 at both widths ([breadth-760-after.png](publication-batch5-assets/figures/breadth-760-after.png)). The step values themselves are correct.
- Proposed resolution: Allow a figure-level integer-tick option (or detect all-integer series) and use whole-number ticks.
- Acceptance criteria: Count panels show integer ticks; other figures unchanged or re-inspected.
- Discussion / progress: /root, 2026-10-11 — Claimed together for one shared-renderer correction batch; survey all exported charts and re-inspect changed figures before closure.
- Disposition: resolved
- Closed by / date: /root / 2026-10-11
- Resolution: Added explicit integerTicks for linear axes in the renderer and schema checks. Enabled it in authoring JSON for Chapter 16 net issues, Chapter 25 trade-count bins and Chapter 26 occupied/order slots. Count ticks are now whole numbers; integer-valued prices do not opt in automatically.
- Changed locations: `figure-renderer.js`; authoring count flags in `content/indicators-context.json` and `content/risk-advanced.json` where applicable; rebuilt `content/book.js` and 11 SVG exports; cache keys, regression script, content guide and Pages check gate.
- Verification: [Renderer batch](RENDERER_BATCH_20261011.md): 364 portable chart renders at 260/320/390/760px, 69 marker/background overlaps → 0, 48 escaped bars → 0, integer ticks in all 12 enabled renders; native light/dark surveys also have 0 defects/clips. All 26 changed panels inspected at 260/760px (13 retained PNGs); nine native reader route/viewport checks pass. Documented arithmetic/content checks pass; isolated build matches all 74 outputs. Full compiled content is unchanged except three count-axis flags.
- Scope / limits: This closes the recorded marker/bar/tick issue. It does not promise zero path/wick coverage in every dense chart; no native print output or human learner observations. Accepted chapters’ affected figures rechecked; Chapter 16/Part 4 re-accepted for the flag change; Chapter 25/26 full reviews stay pending.
- Related IDs: ALPHA1-001, PUB5-012.


## Publication batch 6 resolutions — /root, 2026-10-11

[Batch report](PUBLICATION_BATCH6_20261011.md) records current acceptance of Chapters 22–23 and Part 5, including the following fixes. Earlier CA1-015 findings and closures remain preserved.

### CA1-015 — Reopened: journal transfer and Part 5 execution inputs
- Priority / type: P2 / teaching gap
- Status: resolved
- Owner: /root (publication batch 6, claimed 2026-10-11)
- Reviewer / date: /root / 2026-10-11
- Location: `content/risk-advanced.json`, `journaling.practice` independent task “Audit a journal summary”; `partPractice.risk` tasks “Complete a decision and a partial fill” and “Review without rewriting”. Original CA1-015 finding and previous verified closures remain in [the resolution history](FEEDBACK_RESOLVED.md).
- Finding and evidence: Chapter 23 asks readers to correct a dashboard's BRDG −1.05R/SKIP 0R mean; the preceding worked journal already gives the corrected single-trade −1.05R and explicitly excludes the skip. This is rehearsal rather than unfamiliar independent transfer. Part 5 supplies an opening offer of $40.70 and a report filling 20 shares, but never states the actual fill price; its answer assumes $40.70 to compute $816.50, $40 1R and −1.125R. A quote and execution price are different inputs. It also assumes cancellation of the other 30 shares before the next bar without supplying a confirmation, and task 3's answer asks readers to preserve an original counterargument that the task never supplies.
- Proposed resolution: Give the journal task fresh completed-trade, skip, unfilled-order and open-position inputs with a full cash/R/account reconciliation. Supply the Part 5 fill price and cancellation report; distinguish supplied frozen fields from a missing original counterargument instead of reconstructing it after the outcome.
- Acceptance criteria: Independent answers require new calculations unavailable in preceding prose; all requested fields have checked solutions and explicit units/denominators/status. Part 5's partial-fill arithmetic is determined by supplied execution/cancellation facts, and its review does not invent an earlier note. Inputs precede concealed answers in browser/manuscript; learner print retains inputs while answers remain omitted. Preserve task titles/deep links and earlier CA1-015 fixes.
- Discussion / progress: Full Chapter 22–23 prose, figures, exercises, quizzes, evidence and Part 5 tasks read against the compiled book; BRDG reference checked against current Chapter 21. Source passages inspected separately. One shared rebuild will follow authoring edits and arithmetic checks; no human learning study is claimed.
- Disposition: resolved
- Closed by / date: /root / 2026-10-11
- Resolution: Replaced the residual Chapter 23 rehearsal-only independent task with a complete unfamiliar five-candidate audit, including closed trades, skip, unfilled order and open holdings. Supplied every Part 5 fill/cancellation fact needed by its arithmetic and a rubric for genuinely missing original note fields. Preserved practice/review titles and the earlier CA1-015 fixes.
- Changed locations: `content/risk-advanced.json`; rebuilt `content/book.js`, `docs/MANUSCRIPT.md`, `docs/EVIDENCE_MATRIX.md` and `assets/figures/psychology.svg`; `index.html` book cache key; `scripts/verify-revision.cjs` now recomputes the new audit and requires the Part 5 execution/cancellation facts.
- Verification: [Batch 6](PUBLICATION_BATCH6_20261011.md): 117 exact numeric comparisons, 38 text and 25 structural checks on compiled content, zero mismatches; all documented verifiers/checks pass and isolated build matches 74 outputs. Nine browser route checks at native 1280/390px and 320px child-frame widths match all text/table inputs and quiz feedback. Actual print stylesheet display-policy checks retain raw inputs and hide learner solutions. All four compact/wide figures inspected as eight Quick Look rasters; fixed-path label coverage falls from 44–45% compact / 14.30% wide to zero at all four tested widths.
- Scope / limits: This closes the stated practice/figure issues and accepts Chapters 22–23/Part 5 editorial content. Native print pagination, a complete release/access/rights audit and human learning are separate pending gates. Final browser screenshots failed; the report distinguishes native DOM checks, child-frame coverage and portable rasters. No human observations or independent agent review are claimed.

### PUB6-001 — Chapter 22 chart commentary obscures the recovery path
- Priority / type: P2 / defect
- Status: resolved
- Owner: /root (publication batch 6, 2026-10-11)
- Reviewer / date: /root / 2026-10-11
- Location: `content/risk-advanced.json`, psychology figure “Escalation changes the recovery problem”, at compact/wide widths.
- Finding and evidence: The “Fixed: $9,700” and “Compare process, not just final equity” backgrounds obscure the fixed-dollar line, including several later recoveries/declines. Actual native rendering of the portable SVG confirms the loss of path detail. Independent path sampling reports 44.18%/45.07%/45.02% covered at 260/320/390px and 14.30% at 760px (`publication-batch6-assets/path-coverage-before.json`). The previous renderer pass correctly checked marker visibility, not this path-coverage property; its stated scope remains intact. The numerical values are correct and table-accessible.
- Proposed resolution: Move the explanatory comparison and exact third-loss values to the caption, remove the opaque chart commentary, and label the outcome indices needed to locate the comparison.
- Acceptance criteria: Both plotted account paths remain visible at 260/320/390/760px, the third-loss $9,700/$9,300 comparison is explicit, all inputs remain unchanged and accessible, and the actual compact/wide figures are inspected after rebuilding.
- Discussion / progress: Confirmed in the initial batch-6 figure inspection; `/root` owns the additional coordinated correction rebuild. Related earlier scope: PUB5-012 covers marker placement; this finding concerns hidden path segments in a new chapter review.
- Disposition: resolved
- Closed by / date: /root / 2026-10-11
- Resolution: Moved the comparison to the figure caption, removed the opaque annotations and enabled all outcome labels. Preserved both numeric series; both paths are now completely visible under the measured label-coverage criterion.
- Changed locations: `content/risk-advanced.json`; rebuilt `content/book.js`, `docs/MANUSCRIPT.md`, `docs/EVIDENCE_MATRIX.md` and `assets/figures/psychology.svg`; `index.html` book cache key; `scripts/verify-revision.cjs` now recomputes the new audit and requires the Part 5 execution/cancellation facts.
- Verification: [Batch 6](PUBLICATION_BATCH6_20261011.md): 117 exact numeric comparisons, 38 text and 25 structural checks on compiled content, zero mismatches; all documented verifiers/checks pass and isolated build matches 74 outputs. Nine browser route checks at native 1280/390px and 320px child-frame widths match all text/table inputs and quiz feedback. Actual print stylesheet display-policy checks retain raw inputs and hide learner solutions. All four compact/wide figures inspected as eight Quick Look rasters; fixed-path label coverage falls from 44–45% compact / 14.30% wide to zero at all four tested widths.
- Scope / limits: This closes the stated practice/figure issues and accepts Chapters 22–23/Part 5 editorial content. Native print pagination, a complete release/access/rights audit and human learning are separate pending gates. Final browser screenshots failed; the report distinguishes native DOM checks, child-frame coverage and portable rasters. No human observations or independent agent review are claimed.


## Publication batch 7 — implementation and handoff completion, 2026-10-12

Original full-read reviewers and implementation: claude-code-pub7, as recorded in PUBLICATION_BATCH7_HANDOFF.md and the read-only review assets. Completion verification/acceptance: /root. Shared evidence: [batch 7 report](PUBLICATION_BATCH7_20261012.md), [final checks](publication-batch7-assets/final-checks.json), [visual review](publication-batch7-assets/visual-review.json), [native browser records](publication-batch7-assets/browser-1280.json) and [final source reconciliation](publication-batch7-assets/source-final-review.json). This completion reruns inherited arithmetic and checks final wording; it does not redate inherited passage inspections or claim new independent agents.

### PUB7-001 — Shared annotation backgrounds hide plotted paths and candle geometry
- Priority / type: P1 / defect
- Status: resolved
- Owner: claude-code-pub7 (implementation); /root (handoff completion)
- Reviewer / date: inherited batch-7 review / 2026-10-12; final verification /root / 2026-10-12
- Location: figure-renderer.js; all chart panels, especially Chapters 9, 21, 25 and 28.
- Finding and evidence: The batch-7 baseline puts opaque labels over line paths, bars and candle bodies/wicks. The inherited measured survey found 31 wide renders with hidden data and 80 compact renders above 5%, including the failed Chapter 9 continuation and up to 51% of a Chapter 25 series. Earlier marker-only gates did not test these properties.
- Proposed resolution: Place annotation backgrounds against drawn data as well as marker bounds, minimize aggregate coverage, and add a hidden-data regression gate. Inspect affected earlier accepted figures before retaining acceptance.
- Acceptance criteria: No wide hidden-data violations, no compact coverage above the stated 5% gate, no covered markers or broken teaching geometry; inspect actual compact/wide figures and preserve data values.
- Discussion / progress: Implemented before handoff in e798f63/2a9e128; disposition recorded after final verification. The original handoff and source/reproduction records remain preserved.
- Disposition: resolved
- Closed by / date: /root / 2026-10-12
- Resolution: claude-code-pub7 implemented drawn-data maps, candidate scoring and order-aware placement for up to five annotations, and extended verify-figures.cjs. /root inspected the final 42 figure pairs, including every one of the 21 changed accepted-chapter figures, and documented the real 17-chapter dependency scope.
- Changed locations: figure-renderer.js; all chart panels, especially Chapters 9, 21, 25 and 28; authoring build outputs where applicable; index.html cache keys and acceptance records refreshed in completion.
- Verification: Final gate: 364 chart-panel renders, zero wide hiding violations, zero compact >5% violations, maximum compact per-series coverage 3.85%; zero covered markers/escaped bars/fractional enabled count ticks. Native 568 light/dark fixture renders have no clipped SVG text. Small compact residuals are permitted, not claimed zero. All 74 isolated generated outputs match.
- Scope / limits: PUB5-012 (marker placement), PUB6-001 (local hidden path), AUD2-018 (compact clipping) retain their distinct earlier findings. Release rights/access, full browser/printer QA, metadata and actual human participation remain separate gates.

### PUB7-002 — Research criteria, cost sensitivity and study timing need explicit support
- Priority / type: P2 / teaching gap and source support
- Status: resolved
- Owner: claude-code-pub7 (implementation); /root (handoff completion)
- Reviewer / date: inherited batch-7 review / 2026-10-12; final verification /root / 2026-10-12
- Location: Chapter 24; Chapter 25 study evidence; Chapter 10 shared study locator; research appendix.
- Finding and evidence: The inherited review found stage-one decisions without explicit decision criteria, an opening-price sizing model liable to look executable, a reused rather than unfamiliar break-even example, ex post wording for ex ante portfolios, and an unsupported October 2011 PDF version date. These concerns are separate from AUD2-002’s holding-clock reopening.
- Proposed resolution: Freeze decision criteria before evaluation, disclose signal-study sizing, add unfamiliar cost inputs, and align study timing/version description with inspected original passages.
- Acceptance criteria: Research timeline and Maya’s final decision agree; fresh break-even inputs/answer reproduce; final linked study records distinguish ex ante evaluation and an undated author-hosted manuscript.
- Discussion / progress: Implemented before handoff in e798f63/2a9e128; disposition recorded after final verification. The original handoff and source/reproduction records remain preserved.
- Disposition: resolved
- Closed by / date: /root / 2026-10-12
- Resolution: claude-code-pub7 added explicit stage-one and forward-study criteria, opening-price sizing disclosure, and the $975/150 fresh example; corrected ex ante selection and removed unsupported version dating from all affected authoring evidence including Chapter 10. The $50.90 coincidence remains explicitly explained; a candle threshold-line feature was not required to teach the current rule.
- Changed locations: Chapter 24; Chapter 25 study evidence; Chapter 10 shared study locator; research appendix; authoring build outputs where applicable; index.html cache keys and acceptance records refreshed in completion.
- Verification: Chapter 24 script passes 516 comparisons. Break-even is $6.50 with net +$225/−$225 at $5/$8 costs; model B is +$32.99. /root read final wording against inherited source reports and inspected the timeline/candles and native data. Chapter 10’s numerical study claim is unchanged; its date/locator metadata is re-accepted. All 74 isolated generated outputs match.
- Scope / limits: AUD2-002 holding clock archived separately. Passage/access dates and original reviewer attribution remain inherited. Release rights/access, full browser/printer QA, metadata and actual human participation remain separate gates.

### PUB7-003 — Statistics calculations and terminology need reproducible intermediate steps
- Priority / type: P2 / teaching gap
- Status: resolved
- Owner: claude-code-pub7 (implementation); /root (handoff completion)
- Reviewer / date: inherited batch-7 review / 2026-10-12; final verification /root / 2026-10-12
- Location: Chapter 25 statistics prose, solution, tables and figures; Part 6 account-return term.
- Finding and evidence: The inherited review found SD/SE reproduction steps missing or rounded imprecisely, ambiguous doubling of account balances, an unstated gross scratch denominator, weak null-model/interval caveats, a total-return term collision and a compact histogram annotation clipping risk.
- Proposed resolution: Supply sample versus population divisors, Wilson intermediates, gross win/loss/scratch frequencies, precise scaling and null-model caveats, and consistent account-return vocabulary; simplify the compact histogram annotation.
- Acceptance criteria: Each calculation reproduces from supplied inputs; uncertainty and annualization have explicit model limits; compact/wide figures retain labels and distributions.
- Discussion / progress: Implemented before handoff in e798f63/2a9e128; disposition recorded after final verification. The original handoff and source/reproduction records remain preserved.
- Disposition: resolved
- Closed by / date: /root / 2026-10-12
- Resolution: claude-code-pub7 supplied n−1/sample-SD/SE steps, Wilson intermediates, t-multiplier caveat, gross loss-rate example, corrected doubling and p-value prose, renamed account return and removed the redundant histogram gap label. Section reorder and additional optional notes were not necessary to resolve the demonstrated gaps.
- Changed locations: Chapter 25 statistics prose, solution, tables and figures; Part 6 account-return term; authoring build outputs where applicable; index.html cache keys and acceptance records refreshed in completion.
- Verification: Chapter 25 reproduction passes 884 comparisons. Sample SD 1.30812R, SE 0.29250R; Wilson 38.66%–78.12%; final net equity $20,605, recorded/losses-first drawdowns 1.68%/4.05%. /root read all current sections and inspected all three compact/wide figures; native tables and answers match. All 74 isolated generated outputs match.
- Scope / limits: Inherited source formulas remain scoped; this is not a calibrated hypothesis test or evidence of profitable trading. Release rights/access, full browser/printer QA, metadata and actual human participation remain separate gates.

### PUB7-004 — Atlas-20 complete screen log omits a rule-derived Alder signal
- Priority / type: P1 / defect
- Status: resolved
- Owner: claude-code-pub7 (implementation); /root (handoff completion)
- Reviewer / date: inherited batch-7 review / 2026-10-12; final verification /root / 2026-10-12
- Location: Chapter 26 session-6 Alder bar and screen-log completeness; scripts/atlas20-sim.cjs; scripts/verify-revision.cjs.
- Finding and evidence: After Alder exits intraday, its former session-6 close would trigger the declared unheld-stock screen while the complete supplied log omitted it. A complete-opportunity claim therefore conflicted with the supplied bar. The batch-7 handoff records this demonstrated contradiction.
- Proposed resolution: Make the fictional bar consistent with the complete screen log without changing the modeled target exit, and derive determinable unheld signals independently in verification.
- Acceptance criteria: No rule-derivable unheld signal is unlisted; accounting and listed eligibility, allocations and fills remain unchanged.
- Discussion / progress: Implemented before handoff in e798f63/2a9e128; disposition recorded after final verification. The original handoff and source/reproduction records remain preserved.
- Disposition: resolved
- Closed by / date: /root / 2026-10-12
- Resolution: claude-code-pub7 changed Alder’s S6 close to $35.50 in authoring and simulator and added a derived-signal check. The target high/exit remains unchanged.
- Changed locations: Chapter 26 session-6 Alder bar and screen-log completeness; scripts/atlas20-sim.cjs; scripts/verify-revision.cjs; authoring build outputs where applicable; index.html cache keys and acceptance records refreshed in completion.
- Verification: Independent Chapter 26 reproduction passes 1,257 comparisons, including three determinable unheld stock/decision-close pairs and no unlisted signals. Final equity remains $100,739.22; the documented revision verifier and isolated build pass. All 74 isolated generated outputs match.
- Scope / limits: The supplied sufficient statistics are teaching inputs, not a full historical market feed. Release rights/access, full browser/printer QA, metadata and actual human participation remain separate gates.

### PUB7-005 — Conservative fill conventions do not all lower Atlas-20 results
- Priority / type: P1 / defect
- Status: resolved
- Owner: claude-code-pub7 (implementation); /root (handoff completion)
- Reviewer / date: inherited batch-7 review / 2026-10-12; final verification /root / 2026-10-12
- Location: Chapter 26 interpretation, learner replay placement and order/operational context.
- Finding and evidence: The prior interpretation said conservative conventions all lowered the scenario result. The participation cap instead shrank losing Birch from 138 to 118 shares, reducing its loss by $40. The inherited review also found replay prerequisites after the attempt and imprecise halt-authority/context wording.
- Proposed resolution: Separate unproven favorable execution assumptions from the sign of the account effect; keep necessary rule teaching before the replay and identify halt authority accurately.
- Acceptance criteria: Show the mixed effects and unpriceable touch counterfactual without inventing data; retain the full result ledger behind the continuation and a self-contained attempt.
- Discussion / progress: Implemented before handoff in e798f63/2a9e128; disposition recorded after final verification. The original handoff and source/reproduction records remain preserved.
- Disposition: resolved
- Closed by / date: /root / 2026-10-12
- Resolution: claude-code-pub7 rewrote the convention interpretation, placed the attempt after section index 6, added the Chapter 24 bridge and clarified securities-exchange halt authority.
- Changed locations: Chapter 26 interpretation, learner replay placement and order/operational context; authoring build outputs where applicable; index.html cache keys and acceptance records refreshed in completion.
- Verification: Birch stop-first net −$241 versus +$467 target-first; cap reduces modeled loss by $40. Independent no-cap final equity is $100,700.80, $38.42 lower; touch-fill alternative cannot be priced. Native 320/390/1280 checks show seven prerequisite sections before the attempt and concealed complete continuation; print policy retains all 195 input/header cells and restores disclosures. All 74 isolated generated outputs match.
- Scope / limits: Fill models remain retrospective teaching conventions, not live execution instructions. Release rights/access, full browser/printer QA, metadata and actual human participation remain separate gates.

### PUB7-006 — Framework clocks, reaction references and provisional counts need precise rules
- Priority / type: P1 / defect and teaching gap
- Status: resolved
- Owner: claude-code-pub7 (implementation); /root (handoff completion)
- Reviewer / date: inherited batch-7 review / 2026-10-12; final verification /root / 2026-10-12
- Location: Chapter 27 Dow, Wyckoff and Elliott definitions, tables, figures, quiz and practice.
- Finding and evidence: The inherited full review found a false two-point Dow comparison where 112→113 is one point; ambiguous secondary-reaction identification; a spring window excluding the breach close despite the source vocabulary; repeated lows able to restart an event; and hindsight Elliott endpoint/count/invalidation wording. The close line also could not supply the stated intraday reaction extrema by itself.
- Proposed resolution: Fix arithmetic, distinguish local research rules from framework definitions, provide reaction-extreme inputs, freeze breach/event recognition and count invalidation at each cutoff, and add practice separating evidence layers.
- Acceptance criteria: Closes, reference highs, supplied reaction extrema and recognition times agree; spring branches classify only when their window resolves; provisional wave counts do not gain later information.
- Discussion / progress: Implemented before handoff in e798f63/2a9e128; disposition recorded after final verification. The original handoff and source/reproduction records remain preserved.
- Disposition: resolved
- Closed by / date: /root / 2026-10-12
- Resolution: claude-code-pub7 corrected the one-point comparison, qualified teaching reaction references, included breach-close windows and same-event/re-freeze rules, supplied a reaction-extremes table, clarified EWI cash-market overlap/subdivision attribution and provisional counts/invalidation, added layer-sorting practice and simplified compact labels.
- Changed locations: Chapter 27 Dow, Wyckoff and Elliott definitions, tables, figures, quiz and practice; authoring build outputs where applicable; index.html cache keys and acceptance records refreshed in completion.
- Verification: Framework reproduction passes 362 comparisons; /root read all final sections and answers, inspected all three compact/wide figures and matched native tables/quiz feedback. Proponent source checks are inherited; no forecast profitability is asserted. All 74 isolated generated outputs match.
- Scope / limits: PUB7-011 remains deferred for a complete independent Dow-study read. Optional section reordering/polish is not a publication blocker. Release rights/access, full browser/printer QA, metadata and actual human participation remain separate gates.

### PUB7-007 — Casebook clocks and rules conflict across chapters
- Priority / type: P1 / defect and teaching gap
- Status: resolved
- Owner: claude-code-pub7 (implementation); /root (handoff completion)
- Reviewer / date: inherited batch-7 review / 2026-10-12; final verification /root / 2026-10-12
- Location: Chapter 28 MIXD, RIVR, historical caveats, GME arithmetic and unfamiliar practice.
- Finding and evidence: The inherited review found MIXD’s weekly/daily direction inconsistent with Chapter 17 and a falsely implied M1 trigger; the RIVR recovery rule had incomplete breach/window treatment and colliding rule/time labels; a GME percentage and spacing errors; and familiar-only AMB/gallery practice. The retrospective AAPL diagnostic crossed a dividend adjustment and needed a bounded raw-unit caution.
- Proposed resolution: Align both timeframes and recovery event clocks with the earlier chapters; define GR1/RR1 rules; correct arithmetic and add unfamiliar complete inputs; disclose the dividend/source-adjustment boundary without inventing raw quotes.
- Acceptance criteria: Each fictional rule has complete timing and execution inputs; independent fresh tasks reproduce; historical observations and unobserved fills/raw-unit geometry remain distinguished.
- Discussion / progress: Implemented before handoff in e798f63/2a9e128; disposition recorded after final verification. The original handoff and source/reproduction records remain preserved.
- Disposition: resolved
- Closed by / date: /root / 2026-10-12
- Resolution: claude-code-pub7 corrected MIXD to weekly 48.90→49.90 and daily 49.70 with no daily signal; aligned RR1 with Chapter 27 and renamed GR1/RR1; corrected +134.84% GME and spacing; added issuer dividend evidence and a probable/unobserved raw-unit caution, a fresh 40-share AMB task and SPY April archive-input task with a historical verifier. Retrospective GME panel staging was retained with explicit clocks; P1 asks for a frozen boundary rather than an unsupported complete twenty-session channel.
- Changed locations: Chapter 28 MIXD, RIVR, historical caveats, GME arithmetic and unfamiliar practice; authoring build outputs where applicable; index.html cache keys and acceptance records refreshed in completion.
- Verification: Case reproduction passes 697 comparisons. Fresh AMB branches give −$45/−1.125R and +$75/+1.875R; opening gap −$49/−1.225R. SPY prior-five mean 198.504 and lower 198.7623 resolve adverse at the April 5 open 198.58; original archive rows agree. /root read all final sections, inspected all nine compact/wide figures and checked native tables, disclosure and feedback. All 74 isolated generated outputs match.
- Scope / limits: Inherited Nasdaq ex-date check supports February 4; issuer release alone does not. Raw quotes were not retrieved, Kaggle live retrieval failed, and rights review remains ROAD-003. PUB7-010 compact RIVR axis residual archived separately. Release rights/access, full browser/printer QA, metadata and actual human participation remain separate gates.

### PUB7-008 — Part 6 tasks omit conventions and independent transfer
- Priority / type: P2 / teaching gap
- Status: resolved
- Owner: claude-code-pub7 (implementation); /root (handoff completion)
- Reviewer / date: inherited batch-7 review / 2026-10-12; final verification /root / 2026-10-12
- Location: Part 6 cumulative review, all three tasks.
- Finding and evidence: The inherited review found task 1 dismissed validation mainly because the inputs were invented; task 2 left rank precision, whole-share rounding, slot and reservation conventions to reader inference; task 3 reused the same familiar research-clock scenario.
- Proposed resolution: Use computed uncertainty to evaluate the claim, restate every allocation convention in the prompt, and provide a fresh fully defined research-clock/variant-count task.
- Acceptance criteria: All three unfamiliar tasks are self-contained and have complete reproducible answers; optional Chapter 27 is not a hidden prerequisite.
- Discussion / progress: Implemented before handoff in e798f63/2a9e128; disposition recorded after final verification. The original handoff and source/reproduction records remain preserved.
- Disposition: resolved
- Closed by / date: /root / 2026-10-12
- Resolution: claude-code-pub7 added uncertainty/leave-one-out/cost sensitivity to task 1, full allocation/ranking/rounding/slot/reservation inputs to task 2, and a new seven-variant task with its spring-like rule defined in the question.
- Changed locations: Part 6 cumulative review, all three tasks; authoring build outputs where applicable; index.html cache keys and acceptance records refreshed in completion.
- Verification: Part 6 reproduction passes 169 comparisons; /root checked all prompts/answers. Task 2 uses 123 shares, $246 planned R and $4,971.70 reserved; task 3 computes 1−0.95⁷≈30.2% with an explicit independence caveat. Native solutions begin concealed and complete text is present at all three widths. The script’s legacy informational task-2 observation is superseded by the final explicit prompt and native checks. All 74 isolated generated outputs match.
- Scope / limits: All first-five part-review tasks are byte-identical to the baseline; their arithmetic verifiers retain acceptance. Release rights/access, full browser/printer QA, metadata and actual human participation remain separate gates.

### PUB7-009 — Shadowed glossary entries and missing spaces obscure authoring maintenance
- Priority / type: P3 / editorial recommendation
- Status: resolved
- Owner: claude-code-pub7 (implementation); /root (handoff completion)
- Reviewer / date: inherited batch-7 review / 2026-10-12; final verification /root / 2026-10-12
- Location: content/curriculum.js; Chapters 6–8 and local Chapter 28 strings.
- Finding and evidence: Twelve base glossary entries were silently shadowed by richer authoring entries, and Chapter 6–8 prose/feedback contained colon-adjacent missing spaces. Removing shadowed content must not silently change the shipping glossary or inherit stale fingerprints.
- Proposed resolution: Remove only verified shadowed glossary definitions and fix missing spaces, then compare the compiled glossary and update affected acceptance fingerprints.
- Acceptance criteria: The compiled 105-term glossary remains byte-identical; existing task/numeric content stays unchanged; Chapters 6–8 and dependent Part 2 are re-accepted at current fingerprints.
- Discussion / progress: Implemented before handoff in e798f63/2a9e128; disposition recorded after final verification. The original handoff and source/reproduction records remain preserved.
- Disposition: resolved
- Closed by / date: /root / 2026-10-12
- Resolution: claude-code-pub7 removed twelve shadowed curriculum definitions and corrected the targeted whitespace. /root compared baseline/current compiled glossary and first-five part tasks, checked the exact changes and refreshed acceptance metadata.
- Changed locations: content/curriculum.js; Chapters 6–8 and local Chapter 28 strings; authoring build outputs where applicable; index.html cache keys and acceptance records refreshed in completion.
- Verification: Merged glossary is byte-identical to a53df50. Early verifier passes 617 comparisons, strict content checks cover every term/reference, and native input/quiz checks retain all instructional text. Chapters 6–8 have only the documented whitespace changes; Chapter 10’s separate study locator correction is PUB7-002. All 74 isolated generated outputs match.
- Scope / limits: Housekeeping resolution does not claim a new human readability study. Release rights/access, full browser/printer QA, metadata and actual human participation remain separate gates.

### AUD2-002 — Reopened: Chapter 24 holding-session clock
- Priority / type: P1 / defect
- Location: `content/risk-advanced.json`, Chapter 24 “Write the rule before seeing the answer”; Chapter 26 Atlas-20 earnings filter. Related earlier capstone item: CA1-020, already resolved.
- Finding and evidence: One Chapter 24 paragraph says entry counts as session 1 and exit is its tenth close, then says “the close of the tenth session after entry.” The latter normally excludes the entry session and is one session later. Chapter 26 also calls t+1…t+10 the “longest possible holding window” while explicitly allowing halts to prevent exits. A halt can extend elapsed holding beyond the planned limit. Readers building an inspectable rule should not have to choose between these clocks.
- Proposed resolution: Use one inclusive holding-session definition, an explicit entry-day example, and an overdue-exit rule for a halt. Call the earnings horizon the planned holding window rather than an unconditional maximum.
- Acceptance criteria: A worked entry-day calendar has a single exit date; a halt spanning the deadline has an explicit resumptive disposition and the calendar wording agrees.
- Status: resolved
- Owner: claude-code-pub7 (implementation); /root (final verification)
- Reviewer / date: batch-7 review / 2026-10-12
- Reopening evidence: The batch-7 full read found Chapter 24 once again saying “tenth session after entry” alongside the entry-counts-as-one convention. Earlier Chapter 21 overdue-exit corrections remain intact; this reuses the existing timing finding rather than creating a duplicate.
- Current location / criteria: Chapter 24 v1-b written rule and exercise conventions; scheduled E10 rather than E11 for entry E1, with overdue opening-gap/exit policy unchanged.
- Disposition: resolved
- Closed by / date: /root / 2026-10-12
- Resolution: claude-code-pub7 replaced the ambiguous phrase with holding session 10, entry counted as session 1, and explicit E1→E10 versus E11 wording.
- Verification: Final Chapter 24 prose explicitly gives E10, never an ordinary E11 time exit; its 516-comparison reproduction and documented revision verifier pass. /root read the final full rule, checked native rendering at 320/390/1280 and retained the Chapter 26 earnings/overdue-clock agreement. Chapter 21 inputs and fingerprint are unchanged.
- Scope / evidence: Batch 7 report and final-checks.json; original findings and earlier closures above remain history. No native printer pagination or human validation claimed.

### PUB7-010 — Compact RIVR candle labels collide with the axis title
- Priority / type: P2 / defect
- Status: in_progress
- Owner: /root (batch 7 completion, 2026-10-12)
- Reviewer / date: /root / 2026-10-12
- Location: content/risk-advanced.json, Chapter 28 RIVR candle figure (case-studies-3), 260px portable rendering.
- Finding and evidence: In the current compact raster the long observation labels split “R0 breach” and “R4 target” over three lines, with the last characters sharing the vertical area of “Range-recovery session”. The numerical reproduction and finite geometry checks do not catch the collision. See publication-batch7-assets/inspection-pairs/case-studies-3.png before the completion rebuild.
- Proposed resolution: Use R0–R4 as candle labels; keep breach, recognition, fill and target meaning in the figure title, annotations and surrounding worked explanation.
- Acceptance criteria: Inspect the rebuilt compact and wide rasters and native SVG text boxes; retain all OHLC data and the chronological event meanings.
- Discussion / progress: Current figure visually inspected; source labels verified. One shared rebuild will follow the targeted authoring correction.
- Disposition: resolved
- Closed by / date: /root / 2026-10-12
- Resolution: Changed only the four long RIVR candle labels to R0, R1, R2 and R4; R3 and all OHLC/annotations remain unchanged. Built authoring once and bumped book/renderer cache keys.
- Changed locations: content/risk-advanced.json; rebuilt book.js and case-studies-3.svg; current figure fixtures, acceptance/checkpoint records and index.html.
- Verification: Actually inspected before/final 260px and final 760px portable rasters; final single-line observation labels leave the axis title clear. Native SVG text has no clips at four widths in both palettes, all case numerical comparisons pass, complete native inputs match at 320/390/1280 and all 74 isolated generated outputs match.
- Scope / evidence: publication-batch7-assets/inspection-pairs/case-studies-3.png (before) and case-studies-3-final.png (after); final checks and batch 7 report. No native screenshots or printer pagination claimed.

## Release-readiness completion — /root, 2026-10-12

### PUB7-011 — Consider independent historical Dow evidence after full-paper review
- Priority / type: P3 / editorial recommendation
- Status: resolved
- Owner: /root, 2026-10-12
- Reviewer / date: claude-code-pub7 handoff; recorded by /root / 2026-10-12
- Location: Chapter 27 empirical-evidence discussion; PUBLICATION_BATCH7_HANDOFF.md.
- Finding and evidence: The handoff proposes considering the Brown–Goetzmann–Kumar (1998) Dow study. Its full paper has not been reviewed in this batch. Current prose explicitly limits the evidence examined and makes no unsupported predictive-performance claim for these frameworks. This is a possible literature addition, not a demonstrated factual defect.
- Proposed resolution: Retrieve and read the complete original study, compare its specific Dow rule, sample, comparator and costs with this chapter’s frozen teaching rule, then decide whether a bounded evidence record would improve the chapter.
- Acceptance criteria: Record inspected original passages and study limits, with an evidence-backed inclusion or non-inclusion disposition; do not infer validity for all Dow/Wyckoff/Elliott specifications.
- Discussion / progress: Deferred from the prior handoff until a dedicated full-paper review. It does not prevent scoped editorial acceptance of the current explicit evidence limits; ROAD-003 remains outstanding.

- PUB7-011 review resumed / 2026-10-12: /root retrieved the complete March 13, 1998 author manuscript from Yale, read its prose, appendix, tables, figures and endnotes, and is adding a bounded evidence record. Journal-version equivalence is not assumed.
- Disposition: resolved
- Closed by / date: /root / 2026-10-12
- Resolution: Included as bounded historical evidence, not validation of the chapter’s frozen rules.
- Verification: Complete March 13 author version read and tables/figures inspected; pp. 8–10/18–21, Tables II–IV, endnotes 9/14/15 checked. Paragraph/source/specification built and reader passage inspected; 362 Chapter 27 and 169 Part 6 comparisons pass; affected fingerprints updated.
- Scope / evidence: [Release-readiness report](RELEASE_READINESS_20261012.md), linked current assets and scoped inherited publication reviews. No human learning or complete release QA is claimed.


### RELEASE1-001 — Historical README overstates the missing vintage
- Priority / type: P3 / defect
- Status: resolved
- Owner: /root, 2026-10-12
- Reviewer / date: /root / 2026-10-12
- Location: data/historical/README.md, archive convention paragraph.
- Finding and evidence: The README says adjustment vintage is wholly unspecified although kaggle-listing.json records version 3’s 2017-11-16 last update. Current Chapter 28 already bounds the archive as post-2016; only the maintenance note is stale.
- Proposed resolution: Distinguish the dated archive version from undocumented per-row revisions and adjustment formula.
- Acceptance criteria: README matches the saved API metadata while preserving price/execution and upstream rights limits; numerical inputs and hashes remain unchanged.
- Discussion / progress: The convention paragraph now distinguishes these facts; historical verifier passed.
- Disposition: resolved
- Closed by / date: /root / 2026-10-12
- Resolution: Corrected only the stale maintenance note; retained adjustment/provenance and reuse boundaries.
- Verification: Compared saved API update/version metadata with README and current Chapter 28. Historical verifier passes; all archived numeric/selection/hash files unchanged.
- Scope / evidence: [Release-readiness report](RELEASE_READINESS_20261012.md), linked current assets and scoped inherited publication reviews. No human learning or complete release QA is claimed.


### RELEASE1-002 — Flow illustrations expose an empty data disclosure
- Priority / type: P3 / defect
- Status: resolved
- Owner: /root, 2026-10-12
- Reviewer / date: /root / 2026-10-12
- Location: app.js figureData/renderFigure; Chapter 7 chronology and Chapter 26 processing flow.
- Finding and evidence: Native 320px checks found a View the illustration’s data disclosure with no table for flow steps. The accessible SVG still carries labels, but the promised textual reference is empty because figureData handles series/candles/tables/profile and skips steps.
- Proposed resolution: Export the same ordered step titles and explanations as an accessible table.
- Acceptance criteria: All flow disclosures carry complete ordered step text at compact/wide widths, with table workspace access; existing numerical data tables are preserved.
- Discussion / progress: Added the steps branch using original figure specifications; reader checks pending.
- Disposition: resolved
- Closed by / date: /root / 2026-10-12
- Resolution: Added original ordered step titles/explanations to figureData tables.
- Verification: All seven packets at native 320/390/768 have complete figure tables and exact flow-step text. Chapter 26 workspace has seven ordered rows and closes with native Escape. Existing numerical tables and 71 SVGs remain unchanged. Native re-export of affected Chapter 7/26 print remains on ROAD-004.
- Scope / evidence: [Release-readiness report](RELEASE_READINESS_20261012.md), linked current assets and scoped inherited publication reviews. No human learning or complete release QA is claimed.


### RELEASE1-003 — Review labels overflow the contents near the tablet breakpoint
- Priority / type: P3 / defect
- Status: resolved
- Owner: /root, 2026-10-12
- Reviewer / date: /root / 2026-10-12
- Location: Contents/chapterRow, native 768px viewport.
- Finding and evidence: After adding the review label, the longest chapter row places its arrow at 771.6px in a 768px viewport. The auto-width, nowrap metadata column can exceed the page’s available width.
- Proposed resolution: Bound and wrap the metadata column, permit the title column to shrink, and use a concise review label.
- Acceptance criteria: Contents and notebook rows stay within 320/390/768px viewports with full titles and meaningful review labels; desktop structure and mobile second-row status layout are preserved.
- Discussion / progress: Changed the grid/status wrapping and concise label; native rechecks pending.
- Disposition: resolved
- Closed by / date: /root / 2026-10-12
- Resolution: Bound/wrapped the status column, allowed title shrinkage and shortened the label to AI review, retaining full dated scope in chapters.
- Verification: Native 768px contents overflow removed (753px scroll width within 768px). Final 320px top-level and 390/768/1280px native child-frame contents have all 28 rows and no overflow; notebook row uses the same layout. Full top-level desktop/remaining printer checks stay on ROAD-004.
- Scope / evidence: [Release-readiness report](RELEASE_READINESS_20261012.md), linked current assets and scoped inherited publication reviews. No human learning or complete release QA is claimed.


### PRINT1-001 — Multi-panel figures shrink until illegible in print
- Priority / type: P1 / defect (misleading/unreadable visual in the print editions)
- Status: resolved
- Owner: claude-code-print, 2026-10-13
- Reviewer / date: claude-code-print / 2026-10-13
- Location: app.js renderFigure (print redraw); styles.css print `.figure-chart svg{max-height:220mm}`. Worst cases: Chapter 8 "Boundary families" (six panels) and Chapter 7 "Candle geometry" (four panels).
- Finding and evidence: A stacked multi-panel figure renders as one SVG, which cannot break across printed pages, so the 220mm cap scales the whole figure down. The native Chapter 8 learner export printed the boundary-families catalogue at about 30% width, with axis labels and branch annotations at roughly 2–3pt; Chapter 7's candle-geometry figure printed at about 53%. Measuring every figure at the 760px print width found 12 multi-panel figures over the cap (30–99%): chapters 6, 7, 8 (×3), 10, 11, 13, 15, 16, 26 and 28.
- Proposed resolution: When printing, render each panel of a multi-panel figure as its own full-width SVG and allow the chart container to break between panels.
- Acceptance criteria: Native print exports show every panel at full content width with readable labels; screen rendering, SVG exports and figure-renderer.js are unchanged.
- Discussion / progress: Found during the ROAD-004 Chapter 7–8 native print slice.
- Disposition: resolved
- Closed by / date: claude-code-print / 2026-10-13
- Resolution: In print mode, renderFigure renders `{...figure, panels:[panel]}` per panel inside `.print-panel` blocks (break-inside: avoid) and lets `.figure-chart.print-panels` break between them. figure-renderer.js and authoring content are untouched, so renderer and content review fingerprints stay valid (`npm run check:reviews` passes for all 28). Cache keys bumped in index.html.
- Verification: Headless Chrome print of Chapter 8 showed the six catalogue panels at full width across pages 12–15. Native Quartz re-exports of the Chapter 7 and 8 learner/answer editions (15/15/25/25 pages) were inspected page by page: all panels are full width and readable, inputs and tables are complete, and continuation boundaries are unchanged (Ch 7 p11, Ch 8 p6). `npm run check`, `check:figures` and `check:reviews` pass. The other 10 affected figures were not natively re-exported in this slice; the Chapter 6 pair is now superseded.
- Scope / evidence: [native-print-checks.json](release-readiness-assets/native-print-checks.json) and contact sheets in `release-readiness-assets/native-print/`.
- Additional native verification / /root, 2026-10-13: Current Chapter 6/10/26/28 multi-panel figures received additional native Quartz verification in the 14-output/237-page batch; all sampled panels retain full width and readable labels. Earlier Chapter 7–8 native evidence remains inherited. No claim of a native re-export of every other chapter. [Completion report](NATIVE_PRINT_COMPLETION_20261013.md); [inspection record](release-readiness-assets/native-print-final-inspection.json).


### PRINT1-002 — Print headings and section labels split from their content
- Priority / type: P3 / defect
- Status: resolved
- Owner: claude-code-print, 2026-10-13
- Reviewer / date: claude-code-print / 2026-10-13
- Location: styles.css print rules; Chapter 7 guided-packet heading, Chapter 8 worked-example eyebrow.
- Finding and evidence: After PRINT1-001 changed the page flow, the native Chapter 7 learner export split the two-line heading "First pass: keep the D3 shape separate from its / next close" across pages 8–9. The Chapter 8 learner export left the "A WORKED EXAMPLE" eyebrow alone at the bottom of page 22, with its heading on page 23. Only `.exercise>.eyebrow` had break-after: avoid.
- Proposed resolution: Keep headings unbroken and keep worked-example/quiz eyebrows with their headings.
- Acceptance criteria: Re-exported native PDFs show no split heading or stranded eyebrow label.
- Discussion / progress: None.
- Disposition: resolved
- Closed by / date: claude-code-print / 2026-10-13
- Resolution: Added `h1,h2,h3{break-inside:avoid}` and `.worked-example>.eyebrow,.quiz>.eyebrow{break-after:avoid}` to print CSS.
- Verification: Native re-exports: the Chapter 7 learner heading is intact on page 9; the Chapter 8 learner/answer eyebrow is on page 23 with its heading. All pages of all four current PDFs were checked for split headings and stranded labels. The Chapter 7 answer edition was printed before these two rules and has no split heading or stranded label on any page.
- Scope / evidence: As PRINT1-001.
- Additional native verification / /root, 2026-10-13: All 237 pages in the remaining native batch were visually inspected; no split heading or stranded eyebrow label found. [Completion report](NATIVE_PRINT_COMPLETION_20261013.md); [inspection record](release-readiness-assets/native-print-final-inspection.json).


### PRINT1-003 — Part-review worked solutions cannot be printed
- Priority / type: P2 / defect (instructional material lost in print)
- Status: resolved
- Owner: claude-code-print, 2026-10-13
- Reviewer / date: claude-code-print / 2026-10-13
- Location: app.js renderPractice; styles.css print `.solution{display:none!important}`; all six part reviews (18 tasks, 31 solution paragraphs).
- Finding and evidence: The headless print sweep printed every part review as 1–2 pages with questions only. Part reviews had no print controls and no answer edition. The print CSS hides `.solution` unless `body.print-answers` is set, and a closed `<details>` does not print its contents even when shown, so a reader could not print part-review solutions at all, even after opening them.
- Proposed resolution: Give part reviews the chapters' two-edition print controls and open the solution disclosures for the solution edition only.
- Acceptance criteria: Task edition prints every question without solutions; solution edition prints every worked solution; the reader's own open/closed state and edition class are restored after printing.
- Discussion / progress: None.
- Disposition: resolved
- Closed by / date: claude-code-print / 2026-10-13
- Resolution: Added "Print tasks" / "Print with solutions" buttons and a print-only edition line. Before printing the solution edition, onbeforeprint opens the solution disclosures; onafterprint restores each one's previous state and resets the class and label. Cache key bumped.
- Verification: Headless Chrome, all six part reviews in both editions: the 31 authoring solution paragraphs all appear in the solution editions and none in the task editions. A preview state check after a simulated print: a reader-opened solution stayed open, the others closed again, and the class and label were reset. On-screen buttons render at 1280px. `npm run check`, `check:figures`, `check:reviews` pass. A native printer export of a part review is still pending in ROAD-004.
- Scope / evidence: [headless-print-sweep.json](release-readiness-assets/headless-print-sweep.json).
- Additional native verification / /root, 2026-10-13: Native Part 6 task/solution PDFs (2/3 pages) now retain all three questions, with all four authoring solution paragraphs only in the solution edition. Real afterprint restores the three closed disclosures, clears the edition class and resets the label. [Completion report](NATIVE_PRINT_COMPLETION_20261013.md); [inspection record](release-readiness-assets/native-print-final-inspection.json).


### QA1-001 — Glossary term headings skip a heading level
- Priority / type: P3 / defect (accessibility structure)
- Status: resolved
- Owner: claude-code-qa, 2026-10-13
- Reviewer / date: claude-code-qa / 2026-10-13
- Location: app.js glossary view (`.glossary-item`); styles.css `.glossary-item h3`.
- Finding and evidence: The automated accessibility-tree audit of all 41 routes found one heading-level skip: on `#/glossary` the page `h1` was followed directly by 105 `h3` term headings, with no `h2`. Screen-reader heading navigation by level would find no second-level headings on the page.
- Proposed resolution: Make the term headings `h2` and keep their current appearance.
- Acceptance criteria: No heading skips on any route; glossary deep links and filtering still work; term headings look unchanged.
- Discussion / progress: None.
- Disposition: resolved
- Closed by / date: claude-code-qa / 2026-10-13
- Resolution: Glossary terms render as `<h2>`. The CSS rule moved to `.glossary-item h2` with the previous `h3` letter-spacing (-.4px) and green colour, so the appearance is preserved. Cache keys bumped.
- Verification: Re-audit: 0 heading skips, 0 unnamed controls, 0 duplicate IDs or broken ARIA/label references across 41 routes with disclosures open. Native preview: 105 `h2` terms, 0 `h3`; `#/glossary/at/term-a-d-line` focuses the term in view; filtering for "true range" leaves 3 terms; 320px has no overflow; dark-theme heading contrast is 9.12:1. `npm run check`, `check:figures` and `check:reviews` pass.
- Scope / evidence: [wide-zoom-file-a11y-checks.json](release-readiness-assets/wide-zoom-file-a11y-checks.json), [a11y.mjs](release-readiness-assets/a11y.mjs).

### QA1-002 — Glossary term names render at link size, not heading size
- Priority / type: P3 / defect (visual hierarchy)
- Status: resolved
- Owner: claude-code-qa, 2026-10-13
- Reviewer / date: claude-code-qa / 2026-10-13
- Location: styles.css `.glossary-item a` (10px) and its larger-text override (13px).
- Finding and evidence: A native 1280px screenshot of the glossary showed each term name at about 13px, smaller than its own 12–14px definition text. The rules meant for the "Read in context →" link also matched the term-name link inside the heading, overriding the heading's 24px. Readers scanning the glossary saw definitions with no visually distinct term heading.
- Proposed resolution: Limit the small-link rules to the direct-child "Read in context" link.
- Acceptance criteria: Term names render at the heading size; the "Read in context" link keeps its size and colour.
- Discussion / progress: None.
- Disposition: resolved
- Closed by / date: claude-code-qa / 2026-10-13
- Resolution: Both selectors changed to `.glossary-item>a`.
- Verification: Native preview: term links compute 24px, green (rgb 35,77,61); "Read in context" links 13px, same green. A screenshot was viewed at 1280px; the longest term wraps without overflow at 320px (max heading height 55px). A pre-existing defect, not a regression from QA1-001.
- Scope / evidence: As QA1-001.

### QA1-003 — "A worked example" label renders at 8px in every chapter
- Priority / type: P3 / defect (legibility)
- Status: resolved
- Owner: claude-code-qa, 2026-10-13
- Reviewer / date: claude-code-qa / 2026-10-13
- Location: styles.css `.worked-example .eyebrow{font-size:8px}`; the worked-example section of all 28 chapters.
- Finding and evidence: The text-size audit (headless Chrome, all 41 routes, both themes, disclosures open) found that the only content text under 10px was the 28 "A WORKED EXAMPLE" labels, at 8px. An earlier legibility fix had raised `.eyebrow` to 11px in a top-level rule, but the older and more specific `.worked-example .eyebrow` rule kept this label at 8px, below every other section label ("Guided practice", "Check your understanding" and "In this chapter" are all 11px).
- Proposed resolution: Include `.worked-example .eyebrow` in the existing top-level 11px label rule.
- Acceptance criteria: The label computes at 11px like the other section labels, with no new print defects.
- Discussion / progress: None.
- Disposition: resolved
- Closed by / date: claude-code-qa / 2026-10-13
- Resolution: Added `.worked-example .eyebrow` to the top-level `.reading-aside>strong,.figure-kicker,.eyebrow,…{font-size:11px}` rule. The change first went into a lookalike rule inside `@media(max-width:760px)`; it was moved after the native check showed no effect at 1280px. Cache key bumped.
- Verification: Native preview at 1280px: the label computes 11px / 0.6px letter-spacing, matching the chapter-contents label in a viewed screenshot of Chapter 12. Contrast re-audit: 0 WCAG 1.4.3 failures in either theme, and no content text under 11px. The only remaining 10px text is sidebar/footer chrome ("THE BOOK", part numbers, "Saved in this browser"). Headless print re-sweep: see the slice record. The full check suite (13 commands) passes.
- Scope / evidence: [wide-zoom-file-a11y-checks.json](release-readiness-assets/wide-zoom-file-a11y-checks.json), [contrast.mjs](release-readiness-assets/contrast.mjs), [qa-final-checks.json](release-readiness-assets/qa-final-checks.json).

### MOBILE2-001 — Mobile header loses the Market Atlas logo
- Priority / type: P3 / defect (mobile site identity/home navigation)
- Status: resolved
- Owner: /root, 2026-10-13
- Reviewer / date: user phone screenshot and /root / 2026-10-13
- Location: index.html `.topbar`; styles.css mobile sidebar/header rules.
- Finding and evidence: The supplied Edge phone screenshot shows only menu, Overview, search and theme controls. The sole `.brand` home link is inside the sidebar, which is translated off-screen and hidden/inert at <=760px. The top bar has no brand link, so mobile reading loses visible site identity and direct home access until navigation is opened. This reproduces from the authored layout; no missing image request is involved.
- Proposed resolution: Add a compact mobile logo/wordmark home link using the existing brand mark, with enough room for chapter contents/search/theme controls.
- Acceptance criteria: Brand visible and operable on overview and chapter routes at 320/390/768/1280px; mobile header has no overflow/control overlap in either theme; drawer/search/contents still work; print output unchanged.
- Discussion / progress: /root — investigating current/public layout against the user screenshot; this is a targeted reader-shell fix, not a manuscript edit. No push authorized.

- Disposition: resolved locally; public deployment remains separate.
- Closed by / date: /root / 2026-10-13
- Resolution: Added a mobile-only Market Atlas home link to the top bar using the existing M/up-arrow mark and wordmark. On mobile it replaces the route breadcrumb; desktop branding/breadcrumb remain unchanged. Screen-only compact rules reserve space for the chapter Contents/search/theme controls at 320px. Arrow backing uses the header paper color in both themes. Stylesheet cache key bumped to `20261013-mobile1`.
- Verification: T3 native preview, 36 cases: 320/360/390/760/768/1280px, light/dark, overview plus Chapters 6 and 28. Expected branding visible in every case, zero document overflow or overlapping header controls. Actual clicks verify mobile home navigation, drawer open/close and inert/expanded state, search modal/focus, chapter contents modal, and both theme transitions. `npm run check:reviews` passes (74 baseline outputs, 28 accepted; four invalidation cases). Package preflight rebuilt the local ZIP: two matching builds, seven files and valid ZIP. The original stylesheet is byte-identical before the appended screen-only rules; the added brand is inside the print-hidden header. app.js/book/renderer untouched, so existing print/content acceptance scope remains valid.
- Scope / limits: [Native browser evidence](mobile-header-assets/browser-checks.json). User's supplied Edge phone screenshot establishes the defect; no fresh physical phone Edge test is claimed. Preview snapshots failed and native app screenshots stayed stale; no new raster screenshot is counted as visual evidence. Geometry/accessibility/native-control checks are the verification here. Preview closed after work; no push or deployment. CA1-026 remains deferred.
- Deployment verification / /root, 2026-10-13: The user requested a push; MOBILE2-001 now ships in 0.4.1-alpha.1 (`ec08f111`, successful Pages run 38447943104). Public index/styles and all other reader assets match local hashes. Native live 320/390px branding is visible, without document overflow; 320px chapter contents retains a 7.48px gap from the brand. [Deployment record](release-readiness-assets/deployment-20261013.json). No physical phone recheck claimed.


### MOBILE2-002 — Open mobile drawer starts behind the sticky header
- Priority / type: P3 / defect (clipped mobile navigation)
- Status: resolved
- Owner: /root, 2026-10-13
- Reviewer / date: user's second Edge phone screenshot and /root / 2026-10-13
- Location: styles.css mobile `.sidebar` positioning and sticky `.topbar` stacking.
- Finding and evidence: The supplied screenshot shows a clipped fragment of the drawer's old brand beneath the header after opening the hamburger menu. The fixed sidebar starts at viewport y=0 while the 65px sticky header paints above it at the same z-index. The drawer's top content is covered; the previous MOBILE2-001 checks verified control state/closed-header geometry, not open-drawer occlusion.
- Proposed resolution: Position the mobile drawer below the persistent header; retain the visible header brand/home link, omit the redundant drawer brand and keep the drawer searchable/scrollable within the available viewport.
- Acceptance criteria: Open drawer content starts below the header, with search and all navigation/progress items reachable at compact portrait/landscape sizes; no header occlusion, viewport overflow or lost controls in either theme; opening after page scroll, closing and selecting routes still work. Desktop/print behavior stays unchanged.
- Discussion / progress: Distinct from MOBILE2-001's missing mobile identity; existing header fix remains. User authorized latest publication in the prior turn; deploy this verified correction to the same site.
- Disposition: resolved; deploy under the existing latest-edition publication authorization.
- Closed by / date: /root / 2026-10-13
- Resolution: Screen-only mobile CSS starts the drawer at y=65 below the sticky header and sizes its scroll region to the remaining dynamic viewport (with vh fallback). Hide its redundant brand because the header retains the home/brand link; move search to the drawer's top and contain overscroll. Stylesheet cache key changed to `20261013-mobile2`. No app or authoring change.
- Verification: [48 native viewport/theme/route/scroll cases](mobile-header-assets/drawer-checks.json), including portrait, landscape, 320×256 short screen and desktop: zero drawer/header overlap, document overflow or failed item hit-tests. Every search/navigation item scrolls fully into view and receives elementFromPoint hit-testing. Opening at a scrolled page preserves page position. Search opens/focuses its input; selecting the final About link navigates and closes/inerts the drawer with expanded=false (DOM activation checks after locator input failed). All 28 review fingerprints/74 outputs and invalidation cases pass; two static builds and ZIP integrity match. Screen-only rules preserve print/content scope.
- Scope / limits: User phone screenshot and native geometry/hit-tests establish this correction. Screenshot exports after the fix failed; no new raster or physical phone verification is claimed. Previous MOBILE2-001 branding remains. CA1-026 deferred.

- MOBILE2-002 deployment verification: `c3a5cac` published via [successful Pages run 38463790656](https://github.com/OkillA/market-atlas/actions/runs/38463790656). [Six live asset hashes](mobile-header-assets/drawer-deployment.json) match the checked files; [390×740 live geometry sample](mobile-header-assets/drawer-live-check.json) confirms drawer y=65, search y=85, hidden duplicate brand and no overflow. The preview frame clock froze the transition; this live sample explicitly finished it and checks final geometry only. The local 48-case matrix retains its original scope. Task preview closed.

## READ1 figure and wording batch — /root, 2026-10-13

From the AI simulated-beginner read (editorial input, not reader validation). Report: [READ1_FIGURES_20261013.md](READ1_FIGURES_20261013.md).

### READ1-001 — Axis ticks fall on non-round values, so readers cannot read stated prices off charts
- Priority / type: P2 / teaching gap (figures, renderer-wide)
- Status: resolved
- Owner: /root (claimed 2026-10-13)
- Reviewer / date: READ1 simulated-beginner agents (all six parts) / 2026-10-13
- Location: shared figure renderer; reported in at least timeframes.svg (2/23/45/67/88 linear; 7.8/15.0/28.7/55.1/105.8 log), chart-anatomy(-2), timeframes-2, volume(-2), market-language, trends, moving-averages, momentum, volume-tools, volatility-2, fibonacci, relative-strength (100 baseline not a tick), trade-plans (51.73/50.79/…), psychology (10308/10029/…), testing.svg ($0 start sits on tick "2"), statistics-2 ($20,000 unlabeled), statistics-3, classical-frameworks-2; x-axes ticking 1/5/8/12 or 0/4/9/13 on short session series.
- Finding and evidence: Ticks are evenly spaced fractions of the data range. Text repeatedly asks readers to check exact prices ("$10, $20, $40, $80… read the axis labels"; "mark a $107 exit and a $99 stop"; S2 "back below $50"), which the axes cannot confirm. Ch 4's linear/log figure fails its own learning outcome: no doubling pair is visible on the log axis. Distinct from CA1-003 (duplicate tick labels) and PUB4-005 (bar-axis floor), which are resolved.
- Proposed resolution: "Nice" tick steps (1/2/2.5/5 × 10ⁿ) in the renderer; include 0 and the starting balance on P&L/equity axes; tick every session on ≤20-session charts; log axes tick at round values (10/20/40/80 for Ch 4) with point markers/labels.
- Acceptance criteria: Rebuilt figures show round ticks; on each listed figure a reader can locate every price/value the surrounding text tells them to check; Ch 4 log panel visibly shows equal spacing for doublings. Inspect actual rasters, light/dark, compact/wide; recheck affected chapter acceptance.
- Discussion / progress: None yet.
- Disposition: resolved
- Closed by / date: /root / 2026-10-13
- Resolution: Shared renderer ticks use the largest 1/2/5×10ⁿ step giving ≥4 ticks, exact-decimal labels (cents on fractional money axes) and round log ticks; optional `yTicks` override (Ch 4 log panel 10/20/40/80) and value labels on both Ch 4 panels; x-axes label every observation that fits, else round numbers, always keeping a named final category.
- Changed locations: figure-renderer.js; scripts/check-content.cjs (`yTicks` validation); content/foundations-price.json (Ch 4); rebuilt content/book.js, docs/MANUSCRIPT.md, 54 of 71 assets/figures SVGs; index.html cache keys.
- Verification: [READ1 figure batch](READ1_FIGURES_20261013.md): all changed SVGs rendered at 760/320px and compared with previous exports by three reviewer agents plus /root re-inspection of every flagged figure; figure gate 364 renders clean; all documented checks and `check:reviews` pass. Ch 4 log panel visibly shows equal spacing per doubling.
- Related IDs: READ1-002, READ1-010 (pre-existing compact zone-label crowding retained there).

### READ1-002 — Figures omit the threshold or level the lesson is about
- Priority / type: P2 / teaching gap (figures)
- Status: resolved
- Owner: /root (claimed 2026-10-13)
- Reviewer / date: READ1 parts 1, 2, 5, 6 / 2026-10-13
- Location: Ch 6 support-resistance-2.svg (no $39.50 buffered line or 39.80–40.35 zone; verified—SVG text contains only candle labels); Ch 5 trends.svg (D4 46 / D8 49 swing highs unlabeled though caption says point labels give session and close); Ch 9 breakouts.svg / breakouts-attempt-1.svg (legend lacks values; resistance area unshaded) and breakouts-2.svg (no $50.80 entry ceiling); Ch 2 chart-anatomy-2.svg (no $99/$107 lines for the exercise); Ch 21 trade-plans.svg (no $50/$48.60/$54.60 lines); Ch 24 testing-3.svg (no $50 prior-20 high); Ch 28 case-studies-2/3/6/9.svg (no stop/target, $30 support, 50.19/51.82/52.87, 91.91/93.77 levels; MSFT cutoff/reveal panels separately scaled).
- Finding and evidence: Captions and callouts ("Intraday crossing", "No closing break", "high is above the upper, and low below the lower") point at levels that are not drawn, so readers must return to tables to understand why the figure exists.
- Proposed resolution: Draw and label each frozen level as a dashed reference line with its value; put values in legend labels; share the price axis across cutoff/reveal panels where comparison is the point.
- Acceptance criteria: Each listed figure lets a reader verify the text's threshold claim from the picture alone; actual rasters inspected at compact/wide widths.
- Discussion / progress: None yet.
- Disposition: resolved
- Closed by / date: /root / 2026-10-13
- Resolution: New `references` option draws dashed labelled levels on line/bar/candle panels (inline only where clear of data and labels, otherwise the panel's labels move to a key); annotation labels avoid reference lines. 39 levels added across Ch 2, 6, 9, 21, 24, 28 (incl. four historical cutoff/reveal cases and the AAPL diagnostic); Ch 5 labels D4 46/D8 49; Ch 9 breakout legends carry $50.00/$50.50; Ch 21 duplicate point label renamed. MSFT panels keep separate axes (caption states it) but both carry the frozen levels.
- Changed locations: figure-renderer.js; scripts/check-content.cjs; content/foundations-price.json, content/risk-advanced.json, content/research-context.json; rebuilt outputs.
- Verification: Every reference label equals its plotted value and the value appears in its chapter text (39/39). An input error (AAPL-January levels on MSFT) was caught at inspection and corrected before commit. Listed figures inspected at 760/320px after fixes; native reader light/dark spot check. See [READ1 figure batch](READ1_FIGURES_20261013.md).
- Related IDs: READ1-001.

### READ1-003 — Volume-profile figure puts the lowest price at the top
- Priority / type: P2 / defect (misleading visual)
- Status: resolved
- Owner: /root (claimed 2026-10-13)
- Reviewer / date: READ1 part 3 / 2026-10-13
- Location: Ch 13 "Turn the tape sideways", volume-tools-2.svg.
- Finding and evidence: Rows run $9.00 (top) to $15.00 (bottom) (SVG text order confirms). The text says "vertical position is price", and every other price chart, including the VWAP chart from the same tape, puts higher prices higher. The reader first read the $15 last trade as the bottom of the range.
- Proposed resolution: Reverse row order so the highest price is at the top.
- Acceptance criteria: Rendered figure has $15 at top; matches VWAP chart orientation; Ch 13 acceptance rechecked.
- Discussion / progress: None yet.
- Disposition: resolved
- Closed by / date: /root / 2026-10-13
- Resolution: Profile renderer sorts rows by descending price so $15 is at the top, matching the VWAP chart from the same tape.
- Changed locations: figure-renderer.js; rebuilt assets/figures/volume-tools-2.svg and book.
- Verification: Rendered figure inspected at 760/320px: $15.00 top, $9.00 bottom, $12 point-of-control bar 600 unchanged; Ch 13 acceptance carried forward with figure recheck.
- Related IDs: None.

### READ1-008 — Ch 7 "positive body" wording reads as "up candle" and one solution contradicts itself
- Priority / type: P2 / defect (wording)
- Status: resolved
- Owner: /root (claimed 2026-10-13)
- Reviewer / date: READ1 part 2 / 2026-10-13
- Location: Ch 7 ~1234 ("needs a positive body"), ~1278 ("does not require an up body"), guided solution ~1358 ("Do not reject it for being a down candle: it is an up candle." — verified).
- Finding and evidence: After Ch 2's up/down bodies, "positive body" reads as close > open; the later statement and the solution sentence then look contradictory.
- Proposed resolution: "nonzero body (B > 0, either colour)"; rewrite the ~1358 sentence ("Colour is irrelevant; only the lower-tail test fails").
- Acceptance criteria: Ch 7 uses one unambiguous term for body length vs direction; solution sentence is non-contradictory.
- Discussion / progress: None yet.
- Disposition: resolved
- Closed by / date: /root / 2026-10-13
- Resolution: Ch 7 rule text now says "a body of nonzero length (B > 0, whether up or down)"; the guided solution states color plays no part and that a down candle with the same measurements fails for the same reason.
- Changed locations: content/foundations-price.json (Ch 7 section and guided practice solution); rebuilt book and manuscript.
- Verification: Wording checked against the frozen rule B > 0, D ≥ 2B, U ≤ B and the worked values (B 0.80, U 0.20, D 1.10; D/B 1.375 < 2). No other "positive body" use remains. Ch 7 fingerprint re-accepted with this scope.
- Related IDs: None.

### READ1-005 — "R" is never explained in plain words
- Priority / type: P2 / teaching gap
- Status: resolved
- Owner: claude-code-read1b (claimed 2026-10-14)
- Reviewer / date: READ1 parts 2, 4, 5 / 2026-10-13
- Location: First use Ch 9 learning outcomes/first pass (~1684, ~1707, rules table "Fees / R", ~1784 "−1.05R net"); Ch 18 independent practice (~3510–3526) needs "frozen price-risk 1R" with no use since Ch 9; Ch 20 defines the denominator only at ~3847 after table use; glossary "R multiple" is formula-only.
- Finding and evidence: Readers reverse-engineered −1.05R from numbers. Nothing says why results are expressed in R ("−2.55R means you lost about 2.5× what you planned to risk") or that net R = net P&L ÷ 1R.
- Proposed resolution: Two-sentence plain definition at first use in Ch 9, a one-clause reminder in Ch 18's prompt, and the purpose sentence leading Ch 20's denominator section and the glossary.
- Acceptance criteria: First R use is preceded by a plain-language definition and formula; Ch 18 task is attemptable without searching back; glossary states purpose.
- Discussion / progress: None yet.
- Disposition: resolved
- Closed by / date: claude-code-read1b / 2026-10-14
- Resolution: Ch 9 learning outcome glosses "R result"; the first-pass instruction opens with a two-sentence definition (1R = shares × (entry − initial stop), the loss if the stop fills exactly, before fees; net R = net P&L ÷ 1R; −2R = lost twice what the plan risked). Ch 18 independent prompt carries one-clause 1R and R reminders. Ch 20 names 1R before its first table and opens the denominator section with a purpose sentence. Glossary "R multiple" leads with purpose.
- Changed locations: content/foundations-price.json (Ch 9), content/indicators-context.json (Ch 18 practice), content/risk-advanced.json (Ch 20, glossary); rebuilt book and manuscript.
- Verification: Every R value in Ch 9, 18 and 20 recalculated against the stated definition (−1.05, +1.95, −1.55, +2.6875, −1.0625, −1.50, −1.333333, −2.55R). Full check suite passes; Ch 9, 18, 20 re-accepted with this scope. See [READ1 wording batch](READ1_WORDING_20261014.md).
- Related IDs: CA1-024 (R denominator convention, unchanged).

### READ1-009 — Chapter 11 MACD indexing, ordering and a wrong referent
- Priority / type: P3 / teaching gap + wording defect
- Status: resolved
- Owner: claude-code-read1b (claimed 2026-10-14)
- Reviewer / date: READ1 part 3 / 2026-10-13
- Location: Ch 11 ~2203 and momentum-2 caption ~2240 ("close 26 / close 34" counted over the full 54-close history while the axis shows sessions 1–18); MACD split around the divergence section (~2196–2231); ~2244 "The stock and futures studies… test the latter portfolio rules" (the stock study is cross-sectional, not time-series).
- Finding and evidence: Reader took "close 26" as off the chart's right edge. "Latter" points to the wrong rule family.
- Proposed resolution: State the full-history indexing relative to displayed session 1; keep MACD material contiguous; change "the latter" to "these portfolio rules (one study each)".
- Acceptance criteria: Indexing statement unambiguous against the figure; referent correct against the appendix.
- Discussion / progress: None yet.
- Disposition: resolved
- Closed by / date: claude-code-read1b / 2026-10-14
- Resolution: Prose and momentum-2 caption state that close numbers count the full 54-close history and displayed session 1 is close 37, so MACD (close 26) and signal (close 34) begin inside the flat history. The divergence section moved ahead of "MACD asks a different question", making the three MACD sections contiguous (the price/ROC figure still follows the divergence text; section IDs unchanged). "The latter" became "these two portfolio rules (one study each)".
- Changed locations: content/indicators-context.json (Ch 11 sections, figure afterSection, caption), content/research-context.json (Ch 11 research section); rebuilt book, manuscript and momentum-2.svg (desc only).
- Verification: 36 + 18 = 54 closes; referent checked against the appendix (Jegadeesh & Titman cross-sectional stocks; Moskowitz, Ooi & Pedersen time-series futures). Section order confirmed in the built manuscript. Full check suite passes; Ch 11 re-accepted. See [READ1 wording batch](READ1_WORDING_20261014.md).
- Related IDs: None.
