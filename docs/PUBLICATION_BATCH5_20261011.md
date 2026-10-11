# Publication review batch 5 — 2026-10-11

Implementing owner: `claude-code-alpha`. Scope: Chapters **15–19** and the three **Part 4** cumulative tasks. Each chapter was read in full by a read-only reviewer agent, one per chapter. Those agents wrote the reproduction scripts and fetched the sources. `claude-code-alpha` checked every reported finding against the current files, ran the figure and browser passes, made the changes and owns the acceptance below. All five chapters and Part 4 now have current editorial acceptance. Totals: **21/28 chapters and 4/6 part reviews**. Chapters 22–28 and Parts 5–6 remain pending. All shipping chapter labels remain draft. No human learner observations are claimed.

Fingerprints are pinned in [the checkpoint](PROJECT_CHECKPOINT_20261011_182041.json), and the dated records are in [the publication ledger](PUBLICATION_REVIEW.md). The checkpoint also pins the PUB4-009 Chapter 26 figure change and the alpha release packaging made earlier the same day.

## Findings and corrections

Full findings, dispositions and verification for PUB5-001–011 are in [the resolution history](FEEDBACK_RESOLVED.md). PUB5-012 and PUB5-013 stay open in [the queue](FEEDBACK.md).

| ID | Priority | Location | Correction |
| --- | --- | --- | --- |
| PUB5-001 | P2 | Ch. 16 formulas | A and D named both stocks and counts (“A rises 109→110 … A = 1”). Counts are now adv/dec; “the first example” now names the 100-stock example. |
| PUB5-002 | P2 | Ch. 17 labels | One mismatch was called a conflict while its mirror was “not contradictory”, and “still provisional” was never defined. Aligned/conflicting now apply explicitly to upward daily changes only, and sessions 8–9 receive neither label. |
| PUB5-003 | P2 | Ch. 18 gap definition | Adds the stricter range-gap test, shows both tests agree here ($47 high < $50 prior low), and gives a case where they differ. |
| PUB5-004 | P2 | Ch. 19 round-trip cost | The $65 loss is decomposed: $50 is spread on 250 shares and $15 comes from the second ask level ($0.26 vs $0.20 per share). Previously all $45 was attributed to depth. |
| PUB5-005 | P2 | Ch. 19 order wording | “Marketable buy” became a market buy order, noting that a $50.20+ limit fills the same way. The $50.10 limit's immediate fill limit is stated. |
| PUB5-006 | P2 | Ch. 15–18 figures | Labels covered up to 23.3% of the Ch. 17 path and hid the $47/$42 wicks in Ch. 18. Short labels and placements were chosen by measurement, and detail moved to captions. |
| PUB5-007 | P3 | Ch. 15 sources/wording | Corrected the Fidelity locator; narrowed the scope of `ic-splits`. The J&T limit is specific to this chapter, and the study result is now stated. The manufacturer example is referenced as a return to an earlier case, and “partly”, “optional” and “changing sessions” are tightened. |
| PUB5-008 | P3 | Ch. 16 evidence/quiz | Says that no breadth-divergence test is reported. Quiz feedback for 75% now names session 11. The model note meets its own marking rule, and the Fidelity locator is exact. |
| PUB5-009 | P3 | Ch. 17 figures/locators | Flow caption no longer refers ahead to the step chart; title wording fixed; exact source and section headings used. |
| PUB5-010 | P3 | Ch. 18 consistency | The range is now $48–$53, matching the H $53 candle. A dead “evidence review” cross-reference is replaced, and the stop record also cites SEC Trading Basics. |
| PUB5-011 | P3 | Ch. 19 definitions/sources | Defines best bid/ask, midpoint and price improvement. The IOC record no longer claims stop-limit coverage. `ic-spread` now uses FINRA's correct title and canonical URL, and the spread chart is labelled fictional. |
| PUB5-012 | P3, open | renderer | A label clamped at the plot edge can sit on its own marker (Ch. 15 relative panel, Ch. 19 spread chart at 260px). |
| PUB5-013 | P3, open | renderer | The integer A/D count panel shows fractional ticks. |

The authoring changes are in `content/indicators-context.json` and `content/research-context.json`; the shared renderer was not changed. There was one coordinated rebuild, plus two rebuilds by the same owner to finish label placement. **Six SVG exports changed:** `relative-strength`, `breadth`, `multi-timeframe`, `multi-timeframe-2`, `events` and `market-microstructure-2`. The other 65 are byte-identical to the alpha commit. `index.html` updates the book cache key.

## Substantive acceptance

**Chapter 15.** Every cell of the 12-session table matches 100·S/B to four decimals, and the figure to 1e-12. Session 12 gives 105.8824 (stock/sector) and 112.5 (stock/market) while the stock is −10%. The manufacturer case gives 103.8462 and 96.4286. Both practice tasks reproduce, and the quiz index is correct. The ratio is kept separate from RSI and from cross-sectional momentum portfolios; the J&T evidence is described as a historical spread with its reversal limit.

**Chapter 16.** Fixed weights of 60/20/10/10 reproduce all 12 index values: the final value is 104.8, with contributions of +6 / −0.4 / −0.3 / −0.5. Equal weighting gives 100. All 12 daily-count rows and the step panel are rebuilt from the paths. Session 11 falls 0.2 points despite 3 advances, and session 12 has net zero. The 100-stock fractions are 66.67% and 60%. The fresh five-stock task gives 98.70; 75% of movers and 60% of all; one of four eligible stocks is above its mean, and E is excluded.

**Chapter 17.** From the 15 daily closes, the weekly closes are 105, 103 and 110 at sessions 5, 10 and 15; the prior closes are 98 and 99. No session holds a weekly value before that week completes, and the step drawing does not show a value early. The session-11 note uses the completed $105→$103 pair. Both practice tasks reproduce, and the quiz index and feedback are correct.

**Chapter 18.** The gap is −$9 (−17.3077%), open-to-close is +6.9767% and close-to-close is −11.5385%. The growth factors multiply to 46/52. Planned versus gap-filled losses are $400 versus $900. The fresh limit-touch task is consistent: −5.625%, 1R $180, −$270 / −1.50R, $90 hidden loss; A's $76.40 high does not reach the limit, and B's equal high is left unresolved. Stop-limit handling is consistent between the case and the task.

**Chapter 19.** The fills are 100 at $50.10 and 150 at $50.20, totalling $12,540 for an average of $50.16. The $50.10 limit fills 100, and under IOC the other 150 are canceled. The spread is $0.20 (0.4%), and the 100-share round trip costs $20. The 250-share purchase is $40 worse than midpoint and $15 worse than the best ask; selling back at $49.90 loses $65. The fresh ladder task fills 200 for $6,416 ($32.08) and cancels 100. The chapter makes no unsourced regulatory statements.

**Part 4.** Task 1 reconciles a weighted index of +4.8%, since-start participation of 1 up and 3 down, and a daily net of zero at session 12. Task 2 freezes session 11 against the completed $105→$103 week and identifies the $110 weekly close as leaked information. Task 3 reproduces the event returns and the $12,540 / $50.16 modeled fill, and separates observations from modeled fills.

## Verification and actual coverage

- **Independent arithmetic:** five scripts in [the assets](publication-batch5-assets/) run from the repository root (`node docs/publication-batch5-assets/extract-compiled.cjs`, then `python3 -I docs/publication-batch5-assets/<chapter>-reproduce.py`). Counts: Ch. 15 193, Ch. 16 345, Ch. 17 219, Ch. 18 161 and Ch. 19 151, for **1,069 Fraction/Decimal comparisons and 0 mismatches**. Four assertions that quoted text replaced in this batch were updated and are marked in the scripts.
- **Sources:** **34 checks over 12 URLs** on 2026-10-11 (`<chapter>-source-checks.json`): 27 supported, 4 partial and 3 not stated. Each partial or not-stated item either was corrected in this batch (PUB5-007/008/010/011) or concerns a convention the book already presents as its own (rebasing to 100, adv/U). Investor.gov returned 403 to WebFetch and was retrieved with curl; the SEC PDF was retrieved through WebFetch. The FINRA syndication URL and the canonical page were compared directly.
- **Figures:** [figure manifest](publication-batch5-assets/figure-manifest.json). It covers **all nine Part 4 figures at 260/760px after the changes (18 rasters)**, plus 10 before-rasters of the changed figures. Rasters come from portable SVG via macOS Quick Look and were inspected visually. [Label coverage](publication-batch5-assets/label-coverage.cjs) measures path, wick and marker coverage at 260/320/760px. The maximum covered share fell from 23.3% to 1.6%, covered wick samples from 16 to 0, and hidden markers from 5 to 3; those three are the PUB5-012 edge-clamp case.
- **Browser:** [browser record](publication-batch5-assets/browser-checks.json). The native T3 Code browser was run at **1280, 390 and 320px** on the five chapter routes and Part 4: 154 chapter strings, 9 part strings and 303 table cells per width, with 0 missing. There were no SVG text clips and no page overflow, and quiz feedback was correct for all 15 options.
- **Builds and checks:** all three documented verifiers pass (early: 617), as do `npm run check`, the strict revision checks and the JavaScript syntax checks. An isolated build matches **all 74 generated outputs byte for byte**. [Fingerprint recomputation](publication-batch5-assets/fingerprints.cjs) shows all 16 earlier accepted chapters and Parts 1–3 unchanged.

## Limits and next work

The browser checks cover DOM text and geometry plus scripted clicks; there were no pointer or keyboard tests and no printer output. The reviewer agents are automated reviewers, not independent human editors. Their reports were treated as review input, and each accepted finding was re-verified before editing. One editorial suggestion was declined: replacing the Chapter 17 exercise.

ROAD-002 continues with **Chapters 22–28 and Parts 5–6**. Chapter 26's figure was already fixed under PUB4-009. The open renderer items are PUB5-012, PUB5-013 and ALPHA1-001; fixing them changes exports of accepted chapters, which must then be re-inspected. ROAD-003 (source and data rights), ROAD-004 (printer and release QA) and ROAD-006 (metadata) remain pending. **CA1-026 remains deferred.**
