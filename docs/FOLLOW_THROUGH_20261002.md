# Substantive follow-through — 2026-10-02

The continued review found and resolved three issues after the earlier audit closures. `/root` performed this pass; no independent agent review or human reader study is claimed. This is a targeted review of attempt-first tasks, their rule contracts and actual presentation, not a new exhaustive audit of every manuscript claim.

## Findings and changes

| Finding | Result |
|---|---|
| AUD2-003, reopened | Chapter 26 now starts with a self-contained S4–S5 accounting replay. Initial cash, filled positions, three unchanged rule tables, raw bars and complete non-held candidate screens precede the continuation disclosure. Calculated ledger outcomes and equity figures appear after reveal. The packet explicitly distinguishes accounting replay from an unseen-chart forecast task. |
| CONT3-001 | Chapter 22's LARK packet now supplies the exact L1 limit, opening ask gate, ET window, expiry, cash/risk limits, partial-fill treatment, standing exits and exception rules. The continuation supplies quotes and confirmed execution reports, reconciles cash and R, and corrects the BRDG cross-reference. |
| AUD2-010, reopened | Short printed quizzes stay together. Printed tables use their native caption, keeping captions and column headings with the first data row while allowing long tables to continue with repeated headers. The demonstrated split question and orphaned table headings are corrected. |

The lasting content changes are in `content/risk-advanced.json`; only `psychology` and `system-design` changed. A coordinated `npm run build:content` regenerated the book, manuscript and illustrations. Reader note labels now work for both decision notes and calculation attempts. The content guide and authoring contract explain the replay convention. Original rule tables, ledgers and reference illustrations remain available.

## Numerical verification

`scripts/verify-revision.cjs` now processes the replay directly from its supplied position/bar tables, separately from the Atlas simulator. It checks the copied rule tables against the reference, rejects leaked answer values in the attempt packet, applies exit priority, and reconstructs:

| Session close | Cash | Holdings | Equity |
|---|---:|---:|---:|
| S3 initial state | $54,714.02 | $45,788.80 | $100,502.82 |
| S4 | $62,986.52 | $37,437.60 | $100,424.12 |
| S5 | $71,267.62 | $28,920.40 | $100,188.02 |

Fir exits at the resumed $33.10 opening: −$730 net / $500 frozen R = −1.46R. Birch's both-levels bar uses the stated stop-first convention: −$241 / $236 = approximately −1.02R. Three positions remain; Ginkgo is not eligible because required history is incomplete.

L1 reserves $3,247.50 with maximum planned price-risk of $115. The confirmed 50-share $64.60 fill freezes $100 R; the $62.60 stop report yields −$100 gross and −$105 after two $2.50 fees, or −1.05R. Ending cash is $19,895. Execution reports are supplied fictional inputs, not fills inferred from daily closes.

Passed the documented early-chapter, revision and historical verifiers, content and strict-revision checks, and `node --check app.js`. The final book contains 28 chapters, 68 figures and 105 glossary terms. These checks do not establish empirical trading effectiveness.

## Browser and print evidence

Native T3 browser checks at 320/390/768/1280px covered all four attempt-first chapters: 6, 22, 26 and 28. All 16 route/width checks started with continuation closed, no visible reference outcome headings and no page overflow; revealed SVG text stayed within its viewport. Checked table workspaces, keyboard reveal, saved-note synchronization and restoration. QA used isolated localhost:4174 storage; user notes on localhost:4173 were not changed.

Native screenshots succeeded in this pass and were visually inspected: [Atlas attempt](follow-through-assets/atlas-attempt-desktop.png), [Atlas mobile inputs](follow-through-assets/atlas-inputs-390.png), [LARK attempt](follow-through-assets/lark-attempt-desktop.png), and [LARK dark mobile workspace](follow-through-assets/lark-instructions-dark-390.png). [Browser checks](follow-through-assets/browser-checks.json) preserve the measured results.

Captured actual native-browser print-edition DOM and rendered it with the current print stylesheet in WeasyPrint A4. Chapter 26 learner edition has 30 pages, continuation starts on page 7; Chapter 22 answer edition has 13 pages, continuation starts on page 4. All 43 pages were visually inspected through six contact sheets, with dense inputs and corrected quiz/table starts also inspected at page size. All 189 attempt-packet cells match authoring text, no text extends outside page bounds, and 28 caption/first-row checks pass. Both quizzes retain all choices on the question page; LARK's answer is on that page too. [Print checks](follow-through-assets/print-checks.json), QA PDFs and contact sheets are preserved in `follow-through-assets/`.

Native browser screenshots and interactions are verified. Native printer pagination remains unverified: the preview's print shortcut exposed no printer preview or output. WeasyPrint is the explicit paginated-output check, not a claim about every browser's printer engine.

## Remaining validation

CA1-026 remains deferred for actual human reader participation, with the prepared protocol and packet available. No participants or observations have been invented. Further substantive review can continue independently of that study; its deferral is not a claim that no editorial work can remain.
