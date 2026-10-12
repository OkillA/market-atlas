# Illustration renderer correction batch — 2026-10-11

Owner and reviewer: `/root`. **ALPHA1-001, PUB5-012 and PUB5-013 are resolved.** This batch fixes the three remaining recorded illustration issues and rechecks every affected accepted chapter's figures. It does not accept additional chapters: current totals remain **21/28 chapters and 4/6 part reviews**. CA1-026 remains deferred for actual human participation. Changes are local; no push or deployment was performed.

## Corrections

- **ALPHA1-001:** Bar charts now place each observation in an inset slot. Grouped bars, overlaid lines, annotations and x-axis labels share the same observation centers. Every bar stays within the horizontal plot; the first and last groups no longer encroach on y-axis labels or the right margin.
- **PUB5-012:** A shared label-placement helper checks the actual background rectangle after clamping against all annotation markers, including later annotations, and earlier labels. Both line/bar and multi-candle charts use it. If nearby candidates are occupied, a search chooses the nearest available position. The existing bounded fallback remains for figures too dense to fit; authoring review must simplify those figures. None of the current figures requires a marker-obscuring fallback at the tested widths.
- **PUB5-013:** Explicit `integerTicks: true` produces whole-number ticks on linear count axes. It is set in authoring JSON for Chapter 16's net-issue panel, Chapter 25's trade-count distribution and Chapter 26's slot-count panel. Price inputs that happen to be integers keep their prior axis policy. The content checker validates the option and rejects its use with logarithmic scales.

One shared content rebuild regenerated the book and portable figures. Both the book and renderer cache keys were updated. `npm run check:figures` is documented and added to the Pages workflow as a regression gate.

## Evidence and scope

[The assets](renderer-batch-assets/) retain the survey, reproduction scripts, figure manifest, browser records and thirteen PNG sheets.

| Check | Coverage / result |
| --- | --- |
| Portable geometry survey | All 91 line/bar/candle panels contained in the 71 figure specifications, including attempt figures; 260/320/390/760px = **364 renders**, with 572 marker instances. Marker/background overlaps **69 → 0** (conservative bounds include marker stroke); bars outside the plot **48 → 0** across 24 bar-panel renders. All 12 count-panel renders use integer ticks. [Before](renderer-batch-assets/before.json), [after](renderer-batch-assets/after.json). |
| Native browser renderer survey | Same 364 renders, once with the portable light palette and once with the dark dynamic palette, using the browser's real canvas text metrics. **0 covered marker bounds, 0 escaped bars, 0 clipped text** after correction in each palette. Before: 68 marker overlaps and 48 escaped bars; native marker bounds omit stroke, explaining the one-overlap difference. [Record](renderer-batch-assets/browser-checks.json). |
| Actual figure inspection | **All 26 changed panels at 260/760px** inspected as portable SVG markup rendered by the native T3 browser, saved in `portable-sheet-01.png` through `portable-sheet-13.png`. Bar values and baselines, relative-index endpoint labels, A/D steps, slot counts, candle signal/fill/target points and other annotated observations agree with unchanged inputs. The native-metric versions were also inspected. [Manifest](renderer-batch-assets/figure-manifest.json), [reproducible inspection page](renderer-batch-assets/inspection.html). |
| Reader integration | Chapters 3, 16 and 26 at native **1280/390/320px** viewports; actual figure widths 650/305/247px. Continuation and data disclosures opened. **0 missing series-table cells, covered markers, clipped SVG text or page overflow** in nine route/width checks. [Record](renderer-batch-assets/route-checks.json), [page evaluation](renderer-batch-assets/route-check.js). |
| Content and artifact comparison | Against commit `1c901566a5ccc0dc6a88c83b86596e4598640b61`, the entire compiled book is identical after omitting the three new `integerTicks` fields. All prose, numerical series, task inputs/solutions, quizzes, source records, research, glossary and cumulative reviews are unchanged. Isolated rebuild matches **all 74 generated files byte for byte**. [Reproduction/result](renderer-batch-assets/check-artifacts.cjs), [result](renderer-batch-assets/build-checks.json). |
| Documented checks | Early verifier **617 comparisons**; revision and historical verifiers; normal/strict content checks; figure geometry gate; JavaScript syntax checks: all passed on the rebuilt content. |

**Eleven shipping SVG exports changed:** `market-language`, `volume`, `volume-2`, `momentum-2`, `volume-tools`, `relative-strength`, `breadth`, `statistics`, `statistics-2`, `system-design`, `classical-frameworks-3`. The other 60 shipping SVGs are unchanged. At one or more compact survey widths, a total of 22 figure specifications change; the manifest records all of them. Inspection covers compact-only changes as well as shipping exports.

## Publication acceptance carried forward

Affected accepted chapters **1, 2, 3, 8, 9, 11, 13, 15, 16 and 19** retain acceptance after their changed figures were inspected. Their prose, arithmetic and source support inherit the cited publication batches; they were not given a new source-access date. Only Chapter 16's compiled fingerprint changes among accepted chapters (the integer-axis flag); Chapter 16 and Part 4 are re-accepted for this limited figure change. Parts 1–3 and all cumulative task inputs/answers are unchanged. Chapters 25–26 receive updated pending fingerprints; Chapters 22–28 and Parts 5–6 remain pending for full publication review.

[Fingerprint comparison](renderer-batch-assets/fingerprints.json), [updated ledger](PUBLICATION_REVIEW.md), [new checkpoint](PROJECT_CHECKPOINT_20261011_225612.json). This checkpoint preserves earlier acceptance scopes and pins the newly checked shared renderer and outputs.

## Boundaries and next work

The automatic gate tests marker/background overlap, horizontal bar bounds and integer ticks. It does not establish that labels never cover a short piece of a line, wick or bar. The visual inspection checks the changed labels and their instructional observations; it is not full-book release QA. No native printer output, keyboard/pointer accessibility sweep, new source-access/rights audit or human learning study was performed. The broader ROAD-003/004/006 gates remain pending. ROAD-002 can proceed with Chapters 22–28 and Parts 5–6. The only active feedback finding is deferred CA1-026.
