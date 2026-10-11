# Independent-practice pass — 2026-10-02

CA1-015 was reopened for residual teaching evidence and resolved in this targeted batch. Three independent tasks repeated answers already explained in their own chapters. They now use unfamiliar, self-contained inputs, followed by checked worked solutions. `/root` performed the content review, implementation and single coordinated rebuild; no other reviewing agent or human learner participation is claimed.

## Changes

| Chapter | New independent task | Checked result |
| --- | --- | --- |
| 11 — Momentum | Update supplied, already initialized 12/26/9 states through two new closes. Separate price direction, MACD sign, histogram sign and crossing time. | Histogram moves −0.40 → −0.005470 → +0.279492; MACD stays negative. Signal crossing is observable after session 2 closes, while closes rise 33 → 34 → 34.50. |
| 16 — Breadth | Reconstruct a new five-stock fixed-initial-weight index and three different eligibility/count denominators. | Index falls to 98.70 despite three advances, one decline and one unchanged. Advancing fractions are 75% of movers and 60% of all stocks; one of four SMA-eligible stocks is strictly above its mean (25%). |
| 18 — Events | Compare counterfactual ordinary-stop and stop-limit instructions under a declared opening-trade trigger and regular-session range-only model. | Gap −5.625%; frozen price-risk $180; modeled ordinary-stop result −$270/−1.50R. A below-limit high rules out an exit in that model, leaving a −$240 unrealized close mark; a high equal to the limit leaves execution unresolved. |

Authoring changes are limited to the `practice` and existing `evidence` fields of `momentum`, `breadth` and `events` in `content/indicators-context.json`. Raw input tables precede the concealed answers. Task titles, chapter/section/evidence IDs, guided rehearsal, main solutions and figures retain their prior values. The supplied MACD state avoids pretending one close can initialize a complete EMA history. The gap exercise explicitly distinguishes modeled fills, unavailable execution evidence and unrealized marks.

Optional practice input tables now use the existing table renderer in chapter and part-review routes, and export to the standalone manuscript. The schema checker validates their row widths. The content guide and revision contract document the field and answer policy. `index.html` refreshes compiled assets with the `20261002-practice-transfer-1` marker.

## Arithmetic and source inspection

The early-chapter verifier reconstructs these tasks from their actual authoring input tables and checks intermediate results and supplied solution numbers; it now reports 568 comparisons. A separate Python `Fraction` reconstruction agrees: [arithmetic checks](practice-transfer-assets/arithmetic-checks.json). The actual question, every input-table row and every solution paragraph were also checked in the generated manuscript.

Re-read the calculation section of [Fidelity’s MACD guide](https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/macd), the order descriptions in [Investor.gov’s Types of Orders](https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders), and printed pages 1–3 of the [SEC Trading Basics bulletin](https://www.sec.gov/files/trading101basics.pdf). These support formula/order definitions, price bounds, trigger variability and possible nonexecution. They do not establish the fictional task’s fills or predictive effectiveness; the new task supplies its own trigger/range assumptions.

Before the shared rebuild, all three documented arithmetic/historical verifiers and JavaScript syntax checks passed. After it, `npm run check` and the strict-revision check passed: 28 chapters, 68 figures, 105 glossary terms and 73 sources. Semantic comparison with the pre-edit snapshot confirms that all chapter figures, narrative sections, quizzes, main solutions, chapter ordering, glossary entries and evidence IDs are preserved.

## Reader and print checks

[Browser checks](practice-transfer-assets/browser-checks.json) record all three task packets at 1280px in the native T3 preview and at 390/320px in same-origin frames inside that preview. Every question and all 65 input/header cells match the compiled authoring text. Answers start concealed; DOM activation reveals the correct solution and opens a table workspace with matching values. No tested document has page-wide horizontal overflow. Narrow input tables scroll within their existing accessible table region/workspace.

Native screenshot and viewport-resize calls repeatedly timed out or failed after retries. The narrow-frame checks use actual browser rendering at the recorded inner widths, but do not claim successful native viewport changes, screenshots or exhaustive device validation. One native Enter activation of the momentum solution was confirmed; the nine recorded reveal/workspace checks use DOM activation through the native preview. User notes on localhost:4173 were not touched; QA used localhost:4174.

Captured the actual three rendered practice sections, then rendered learner and answer packets with the current stylesheet in WeasyPrint A4. These are six **isolated packet** QA PDFs, eight pages altogether, rather than complete chapter print editions or native printer output. All eight rendered pages were visually inspected; all full questions and 65 input/header cells appear in both editions, every solution paragraph follows the answer policy, and no text lies outside a page. [Print checks](practice-transfer-assets/print-checks.json) and the page PNGs are preserved alongside the captured native packet HTML. Scratch PDFs are in `tmp/pdfs/practice-transfer/`.

## Coordination and remaining work

The pre-edit backup is `/var/folders/vc/79mjb1b52r3_k4l2j43_94xh0000gn/T/market-atlas-transfer-20261002-7kja3fr4`. With no Git repository in this workspace, semantic comparisons and the backup establish the changed scope. The complete reopened finding and disposition are recorded in `FEEDBACK_RESOLVED.md` before clearing it from the active queue.

CA1-026 remains deferred until actual target readers can participate and observations can drive revisions. This pass improves independent practice; it is neither an exhaustive new manuscript audit nor demonstrated human learning validation.
