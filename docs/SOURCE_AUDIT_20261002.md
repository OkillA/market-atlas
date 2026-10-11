# Source audit and usage-limit recovery — 2026-10-02

Later 2026-10-02 update: CA1-022 is resolved by the [historical-gallery completion](HISTORICAL_AND_READER_PREP_20261002.md). CA1-026 has a full study packet and remains deferred because actual participants are unavailable. The source-audit findings and limitations below describe the earlier snapshot.

This is the current continuation checkpoint for edition 0.4. `/root` resumed the existing CA1-018/019 claims, inspected the interrupted source edits, completed claim support and export, and reconciled stale status documents. The teaching acceptance report dated October 1 remains the record for the earlier calculations and illustration review. This pass is a selected-source content audit, not a systematic literature review or human learning study.

## What the interruption left behind

- Authoring JSON contained source corrections that had not reached the generated browser book, manuscript or evidence matrix. The source-audit claim was still in progress.
- The research authoring file contained a comparative evidence table and study specifications that the browser and Markdown exporter did not render. Both now expose those fields. The standalone manuscript now includes the research appendix and glossary support.
- README and older recovery notes described superseded revision work as unfinished. README and the roadmap now describe the current draft; historical reports carry dated pointers without erasing their earlier limitations.
- An already-open localhost reader retained the previous book/app assets. Dated script URLs now refresh the edition; the same origin loaded edition 0.4 after this correction.

No loose handoff drafts, merge markers, orphan figure exports, or competing build process were found in the project. The original usage-limited handoff is already preserved outside the project as documented in the October 1 completion report. No Git repository exists here, so this is a filesystem recovery record rather than a commit comparison.

Before editing, this pass preserved the project in `/Users/arun/test_projects/market-atlas-before-source-resumption-20261002.tar.gz`. The earlier `/Users/arun/test_projects/market-atlas-before-source-audit-20261001.tar.gz` also remains available. Source downloads and one-time investigative scripts stay outside the project at `/tmp/market-atlas-source-audit-20261001/`; those temporary files are not required to build or read the book. Do not rerun their append-oriented revision scripts. The durable support record is [EVIDENCE_MATRIX.md](EVIDENCE_MATRIX.md), supplemented by the metadata manifest below.

## Evidence corrections and inspection

The appendix distinguishes cross-sectional stock momentum, own-return futures momentum, pattern information, adverse rule-selection results, FX mechanisms and household behavior. Its comparison table identifies the questions for which this edition has only definitions or untested teaching conventions. Selected chapters now connect directly to the relevant bounded study rather than relying on a remote general bibliography.

| Original study inspected | Actual inspected scope and important boundary |
| --- | --- |
| Jegadeesh–Titman (1993) | NYSE/AMEX, 1965–1989; ranked winner-minus-loser deciles and overlapping formation/holding portfolios. Printed p. 77 gives the six/six-month example, no one-week skip, 0.5% assumed one-way cost and 9.29% annual risk-adjusted return after that cost. It is not a long-only chart setup. |
| Moskowitz–Ooi–Pedersen (2012) | 58 futures/forward instruments; focused January 1985–December 2009 test, sign of 12-month excess return, monthly rebalancing and volatility scaling. Equation (5), Figure 2 and passive comparison were inspected. Figure 2 instrument Sharpe ratios are gross; no retail-stock net claim is made. |
| Bajgrowicz–Scaillet | The author-hosted October 2011 manuscript uses January 1897–July 2011 DJIA data and 7,846 rules. Sections 4–5 and the actual Table 5 distinguish FDR portfolios from other selection methods. FDR break-even one-way ranges are 30–35, 0–5 and 0–5 basis points in the first three periods; later periods are negative before costs. These are retrospective thresholds, not a tradable cost policy. |
| Lo–Mamaysky–Wang (2000) | Full original paper inspected, including Sections II.A–B and III.B–F, Tables III–VIII and conclusion. Eligible-stock sampling, algorithmic recognition and delay matter. Tables I–II are pattern counts, not the distributional result. Conditional distribution information is separated from a complete cost-adjusted trading strategy. |
| Osler (2001) | Almost 9,700 conditional orders at one FX bank, September 1, 1999–April 11, 2000, three currency pairs. Data Section I.B and requested-rate distributions Section II.C/Figures 1–3 support clustering versus uniform endings and differences across order types. Transfer to stock profitability is untested here. |
| Barber–Odean (2000) | 66,465 common-stock households; account dates differ from calculated return dates. Costs/timing methods and reported most-active/average/market results were inspected. The association is observational; overconfidence and proposed journaling interventions are not randomized causal findings. |

Each rendered study specification exposes sample, rule, comparator, costs and result; the adjacent record exposes source location, inspection date and limits. Fourteen records are classified empirical, and sixteen study specifications appear across the appendix and chapter records, including repeated chapter connections and the FX mechanism record. These are not sixteen distinct studies.

Provider/official passages were checked for indicator formulas and initialization, chart conventions, breadth, execution, event timing and statistical definitions. Glossary corrections distinguish one-way versus round-trip cost units and complete impulse-wave classification from three endpoint constraints. The SEC reuse reference now points to its actual webmaster FAQ, whose government-content scope does not license vendor price feeds. Proponent framework definitions remain distinct from independent efficacy evidence. Proposed process practices remain suggestions.

The glossary has 105 canonical terms, each assigned once to one of 31 support groups. Groups identify cited definitions, transparent arithmetic or disclosed working vocabulary/teaching conventions. Common terminology is not represented as newly invented by this book. These assignments make support inspectable; they do not prove predictive value. The strict checker now catches omissions, duplicate assignments and incomplete study specifications.

### What the dates and retrievals mean

The source `accessed` field is an access record; the reader now labels it “Access recorded.” An evidence record's `checked` date applies to its stated passage and claim. Successful retrieval does not certify all claims at a URL. Earlier inspection dates remain attached to inherited checks rather than being reset wholesale.

This pass read saved October 1 extracts/PDFs and also opened selected current official pages and the original studies. The Yale paper's web-reader error was handled using the saved directly retrieved original PDF; it was not reported as a broken link. The NBER abstract's current access failure likewise does not establish a broken URL; the material chart-pattern claim now points to the inspected full MIT paper. Some SEC/Elliott pages were available through the web reader despite shell retrieval failures. Exact passage locators and review limits appear in the matrix. [SOURCE_INSPECTIONS_20261002.json](SOURCE_INSPECTIONS_20261002.json) preserves claim locations, dates, source identities and available retrieval metadata without reproducing the downloaded papers.

## Build and verification

One coordinated `npm run build:content` regenerated `content/book.js`, `docs/MANUSCRIPT.md`, `docs/EVIDENCE_MATRIX.md` and 63 SVG exports. The book contains 28 chapters, six cumulative part reviews, 105 glossary terms, 71 source entries representing 68 unique URLs, and 173 evidence records. Chapter section prose totals 38,810 words; this count excludes examples, exercises, quizzes and the research appendix.

- `npm run check` and `node scripts/check-content.cjs --strict-revision` passed.
- `node scripts/verify-early-chapters.cjs` passed 524 calculation comparisons. `node scripts/verify-revision.cjs` passed the later-chapter, Atlas-20 and six-case calculation checks.
- JavaScript syntax checks passed for the edited app, builder and checker. Manuscript/figure references and the authoring-to-book integration were checked.
- The actual original-study pages/images noted above were inspected; table arithmetic and units were compared to the written claims. Build/schema success was not used as source verification.
- All 63 exported SVGs are byte-identical to the pre-resumption backup. This source/export pass changed no illustration geometry; earlier actual illustration inspection remains documented in [TEACHING_ACCEPTANCE_20261001.md](TEACHING_ACCEPTANCE_20261001.md).
- The browser evidence page exposed the comparison, all sixteen five-field study tables and 31 glossary support groups. At 390 pixels there was no page-level horizontal overflow. Earlier in this pass the evidence view also rendered at 1280 pixels. [SOURCE_BROWSER_QA_20261002.json](SOURCE_BROWSER_QA_20261002.json) records the captured phone DOM result. Native snapshots failed, and the preview host later disconnected; no final screenshot/complete chapter-route sweep is claimed. Prior route and illustration checks are historical evidence, not repeated checks of this pass.

Generated-output SHA-256 at this checkpoint:

| Output | SHA-256 |
| --- | --- |
| `content/book.js` | `b48a5a81f405bd5a3732c4c9af207cfae0ee0e69168d8235672be312d63bf435` |
| `docs/MANUSCRIPT.md` | `a6676bd8571bd33f06d0200f1967ed72566ace7b71f7bd9a8f89806cc949c4c6` |
| `docs/EVIDENCE_MATRIX.md` | `0e922bbdd6d03846895f6bb437d371d6665d1ef4b8088f1e6a81ff04bd54067c` |

## Remaining work and next continuation

CA1-018 and CA1-019 are resolved for the specified empirical synthesis and inspectable claim-support scope. They do not certify an exhaustive literature review, every sentence at every linked site, current trading profitability or publication readiness.

CA1-022 remains open: the existing GME/Apple historical observations are narrower than a systematically selected gallery of ordinary, failed, skipped and ambiguous real cases. Expansion needs a documented source/reuse basis and the full session, adjustment, cutoff and execution conventions. Do not treat the two extracts as completion of that gallery.

CA1-026 remains deferred because no human participants are available in this session. [READER_PROTOCOL.md](READER_PROTOCOL.md) already supplies tasks, a rubric and a revision rule. Resume when target readers can participate; record actual observations before claiming learning validation. No reader results were fabricated.

Start the next turn with the active feedback queue and this report. Edit authoring JSON and coordinate the shared rebuild as usual. The archived one-time drafts/scripts are recovery evidence, not the current authoring source.
