# Publication review batch 6

Reviewed **2026-10-11** by `/root`. **Chapters 22–23 and Part 5 are accepted for current editorial content.** The journal now has an unfamiliar independent accounting task, Part 5 supplies the execution facts needed by its answers, and Chapter 22's recovery paths remain visible. Totals are **23/28 chapters and 5/6 part reviews**. Chapters 24–28 and Part 6 remain pending; all shipping chapter labels remain draft.

[The ledger](PUBLICATION_REVIEW.md) records acceptance at [the new checkpoint](PROJECT_CHECKPOINT_20261012_021708.json). The checkpoint filename uses UTC; review dates use America/New_York. Earlier review scopes and evidence remain preserved.

## Corrections

| Finding | Change |
| --- | --- |
| CA1-015 reopened | Chapter 23's “Audit a journal summary” now supplies five unfamiliar candidates: two closed trades, a skip, an expired unfilled order and an open position. Its concealed answer checks frozen R, individual and mean net R, cash, holdings, equity and a separately defined opportunity metric. The title and saved practice link are preserved. |
| CA1-015 reopened | Part 5 supplies a confirmed 20-share $40.70 fill, the buy-limit instruction, cancellation of the other 30 shares before the next bar, and the exact-stop modeling convention. Its final review identifies the absent original counterargument/probability fields without inventing them or treating them as an execution-rule violation. The sizing task also states its assumed execution prices. |
| PUB6-001 | Chapter 22's chart commentary covered 44–45% of its fixed-dollar path at compact widths and 14.30% at 760px. The comparison moved into the caption, opaque annotations were removed, and every outcome number is labelled. Both data series are unchanged; measured path coverage is now zero at all four widths. |

Full findings, dispositions and verification are in [the resolution history](FEEDBACK_RESOLVED.md). The lasting edits are in `content/risk-advanced.json`. Two coordinated rebuilds by the same owner produced the initial practice changes and the subsequent figure correction. Only `psychology.svg` changes relative to the renderer checkpoint; the other 70 SVG exports are identical. The book cache key is updated. The revision verifier now recomputes the fresh audit from its supplied rows and checks the Part 5 fill/cancellation facts, so the deployment gate covers these additions.

## Chapter acceptance

**Chapter 22 Psychology without market mythology.** The full prose, frozen BRDG note, LARK packet, continuation, exercise, practice, quiz, figures and evidence were reviewed. Observation, interpretation, operational orders and outcome grading remain distinct. The LARK gate and limit precede confirmed execution reports; its $115 maximum price-risk allowance and $3,247.50 cash reserve differ from the actual $100 filled-position R. Entry debit $3,232.50 and exit credit $3,127.50 reconcile to $19,895 and −1.05R. The winning-size comparison gives $195/$795 net, with each position's own R denominator. Both escalation paths reproduce at all twelve observations, retaining the $400 difference after the third loss. The proposed revision stays development work, and the ten-event calibration example makes no adequacy claim. Both quiz explanations and alternative-reading rubrics agree with the stated rules.

**Chapter 23 A journal that can teach you something.** All connected BRDG trade/skip/review records, timing, fees, cash, excursions, version distinctions and question/answer pairs were reviewed against Chapter 21's current reference. BRDG's $51.30 high occurs in S2 while held; its MFE is $35/0.35R. Modeled MAE ends at the $48.60 exit ($100/1R); the full S3 low is not treated as proven holding-period MAE. The separate excursion example gives $200 MFE, $60 MAE and $70 net. In the new audit, T1/T2 use $50/$60 R and produce $70/−$88 net. Their exact mean net R is −1/30, displayed as −0.0333R. H has $20 R but no completed outcome. Cash $19,480 plus marked holdings $510 gives equity $19,990. Closed-trade net dollars per screened candidate is −$3.60 under its explicit cutoff definition, while H contributes a separate $8 marked change. The answer preserves those different denominators and does not infer rule compliance or representative performance.

**Part 5 Process review.** All three cumulative prompts and complete answers were reviewed. The cost-inclusive allowance is 55 shares and the notional allowance is 50, so the position uses 50: $75 price R, $81 ordinary modeled loss and $206 gap loss (−2.7467R). The partial-fill reports establish 20 filled/30 canceled shares; $816.50 debit and $771.50 credit give −$45/−1.125R under stop-first modeling. The final review preserves the supplied rule version, marks unrecorded fields as missing, and keeps a later rule proposal separate. Chapters 20–21 retain their prior publication acceptance; their linked inputs and rules are unchanged.

## Source and verification evidence

The behavioral tendency is supported by the SEC overview and its linked Library of Congress report, while the chapter's fictional motive and proposed routines remain bounded teaching examples. [SEC overview](https://www.sec.gov/investor/tools/behaviorialpatterns.htm), [Library of Congress report](https://www.sec.gov/investor/locinvestorbehaviorreport.pdf).

The original Barber/Odean account methods, turnover comparisons, costs, timing conventions and reported results match the inherited study record; that observational design does not establish a journaling intervention benefit. [Original study](https://faculty.haas.berkeley.edu/odean/papers/returns/Individual_Investor_Performance_Final.pdf).

Chapter 23's performance-record guidance matches the bulletin's cost, back-testing, selective-presentation and benchmark passages. Its evidence record now uses the exact passage names; global source access dates are preserved. [SEC staff bulletin](https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-47).

| Verification | Evidence and result |
| --- | --- |
| Independent arithmetic | [Fraction/Decimal reproduction](publication-batch6-assets/reproduce.py): **117 exact numeric comparisons, 38 text checks and 25 structural checks**, zero mismatches on compiled content. Prebuild authoring checks also pass. [Result](publication-batch6-assets/arithmetic.json). |
| Passage review | [Source checks](publication-batch6-assets/source-checks.json): eleven scoped checks over four URLs representing three source entries, including the linked full behavioral report. |
| Actual figures | All four chapter figures at 260/760px: **eight final Quick Look PNG rasters** in [rasters](publication-batch6-assets/rasters/), visually inspected for complete labels, prices, records and paths. The initial native before-screenshot is retained separately. [Manifest](publication-batch6-assets/figure-manifest.json), [coverage before](publication-batch6-assets/path-coverage-before.json), [coverage after](publication-batch6-assets/path-coverage-after.json). |
| Reader edition | [Nine route checks](publication-batch6-assets/browser-checks.json): native top-level 1280/390px plus same-origin native 320px child frames. Per width, **101 chapter/review strings and 184 table cells** match. Solutions start concealed; Chapter 22's continuation/quiz stays hidden before reveal. All 18 quiz-option feedback checks pass. Light/dark checks show no clipped SVG text or page overflow. |
| Print display policy | The native browser applied the actual print stylesheet to screen, with the chapter's print preparation/restoration callbacks. In twelve chapter/edition/width cases, learner solutions are hidden, answer solutions display, and raw input tables remain available, including all 35 new audit cells. This checks the display policy; it is not printer output or pagination evidence. |
| Build consistency | [Isolated rebuild](publication-batch6-assets/isolated-build.json) matches **all 74 generated outputs byte for byte**. [Fingerprint comparison](publication-batch6-assets/fingerprints.json): only Chapters 22/23 and Part 5 change; all 21 earlier accepted chapters and Parts 1–4 retain their fingerprints. |
| Required checks | Early verifier: **617 comparisons**; revision/historical verifiers, normal/strict content checks, figure gate and twenty JavaScript syntax checks pass. The figure gate covers 364 chart-panel renders, with no covered markers, escaped bars or fractional enabled count ticks. |

## Remaining work

ROAD-002 continues with **Chapters 24–28 and Part 6**. ROAD-003 source/rights review, ROAD-004 release and printer QA, and ROAD-006 shipping metadata remain pending. CA1-026 remains deferred until actual target readers can participate.

Native screenshot capture failed after the initial before-image, and further top-level resizes timed out. The final visual evidence is from portable SVG rasters; 320px browser coverage is explicitly a child frame. Reader checks use DOM evaluation and scripted clicks, without a pointer/keyboard accessibility sweep or native printer output. `/root` performed this review; no independent agent review or human learning observations are claimed. Changes are local and unpushed.
