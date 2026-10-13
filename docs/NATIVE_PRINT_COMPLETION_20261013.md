# Native print QA completion — 2026-10-13

`/root` completed the remaining ROAD-004 print batch at the user's request. Fourteen new native PDFs, **237 pages**, are retained and visually inspected. Together with the earlier Chapter 7–8 native pairs, this completes the required seven attempt-packet chapter pairs, an ordinary chapter pair and a part-review task/solution pair. No new print defect was found. PRINT1-001–003 received additional native verification; CA1-026 remains deferred for actual human readers.

## Native export method

The T3 Code collaborative preview served the current local edition at `http://127.0.0.1:4173/`, 1280×800. Its actual chapter and part-review print buttons prepared each edition. Computer use controlled the macOS native print dialog: US Letter, portrait, 100%. Direct Save as PDF remained disabled, so **PDF → Open in Preview** generated the native Quartz output. Preview's **Save As**, PDF format, no Quartz filter, no image optimization, retained each artifact locally. PDF metadata identifies Electron Helper and macOS Quartz PDFContext. No headless `printToPDF` or alternate typesetter was used for this batch; no human dialog completion was needed.

T3 snapshot calls failed, but preview navigation/evaluation and native accessibility-tree/screenshot controls worked. Initial unsuccessful save attempts produced no counted artifact. The user requested closing task tabs due to lag; the used Market Atlas preview tab and final PDF window were closed. Final `preview_status` returned `available:false`, `visible:false`, `tabId:null`. No personal Edge tabs were used or closed.

## Coverage

| Sample | Learner / task PDF | Answer / solution PDF | Continuation starts |
| --- | --- | --- | --- |
| Chapter 6 — Support/resistance | [11 pages](release-readiness-assets/native-print/support-resistance-learner-current.pdf) | [12 pages](release-readiness-assets/native-print/support-resistance-answers-current.pdf) | Page 3 |
| Chapter 9 — Breakouts | [14 pages](release-readiness-assets/native-print/breakouts-learner.pdf) | [15 pages](release-readiness-assets/native-print/breakouts-answers.pdf) | Page 6 |
| Chapter 22 — Psychology | [13 pages](release-readiness-assets/native-print/psychology-learner.pdf) | [13 pages](release-readiness-assets/native-print/psychology-answers.pdf) | Page 4 |
| Chapter 26 — System/accounting replay | [31 pages](release-readiness-assets/native-print/system-design-learner.pdf) | [33 pages](release-readiness-assets/native-print/system-design-answers.pdf) | Page 19 |
| Chapter 28 — Case studies | [35 pages](release-readiness-assets/native-print/case-studies-learner.pdf) | [37 pages](release-readiness-assets/native-print/case-studies-answers.pdf) | Page 4 |
| Chapter 10 — Ordinary chapter: moving averages | [9 pages](release-readiness-assets/native-print/moving-averages-learner.pdf) | [9 pages](release-readiness-assets/native-print/moving-averages-answers.pdf) | No cutoff packet |
| Part 6 — Cumulative review | [2 pages](release-readiness-assets/native-print/part6-tasks.pdf) | [3 pages](release-readiness-assets/native-print/part6-solutions.pdf) | No cutoff packet |

The [combined native record](release-readiness-assets/native-print-checks.json) retains original Chapter 7–8 evidence and superseded Chapter 6 artifacts, alongside this batch's dates, hashes, page counts, settings and inspection scope. There are now 18 current native PDFs; the two older Chapter 6 PDFs remain historical evidence.

## Inspection and result

All 237 new page rasters were viewed via contact sheets, with enlarged page checks where extraction/OCR missed text or arithmetic. The [inspection record](release-readiness-assets/native-print-final-inspection.json) links retained contact sheets, records each chapter's input tables and solution checks, and binds the evidence to current shipping-file hashes. Poppler rendered the PDFs; macOS Vision OCR supplemented visual inspection. The [OCR record](release-readiness-assets/native-print-final-ocr.json) contains exactly the 237 final pages, excluding intermediate duplicate rasters.

- All **16 cutoff/replay tables, 111 input rows per edition**, print completely, including continuation of the Chapter 9/22 rule tables and all Chapter 26 replay instructions and supplied S4/S5 inputs. Table headers remain usable across page breaks. Chapter 28's four six-row historical cutoff windows precede its continuation; the 36-row gallery ledger and later historical/fictional branches remain in the reference.
- All six sampled chapter quizzes retain their question and three choices. The answer editions show C/B/A/B/B/C for Chapters 6/9/22/26/28/10 respectively; learner editions show none of those quiz answers. The **50 chapter solution paragraphs** are present in answer editions and omitted from learner editions. Reference prose and already explained historical/accounting outcomes remain after the explicitly marked continuation, as specified by the content guide.
- Part 6 prints all three questions in both editions and all **four authoring solution paragraphs** only in the solution edition. The real `afterprint` path restores all three initially closed solutions, clears `print-answers`, and restores the task-edition label. This supplies the native evidence previously pending under PRINT1-003.
- Figure panels remain at full content width, including the Chapter 10 main/range comparison, Chapter 26 equity/slot/exposure panels, and Chapter 28 fictional and historical alternatives. Labels, axes, missing-bar notes and historical-versus-fictional distinctions are readable. No clipped panels, blank pages, split headings or stranded eyebrow labels were found. Tables may continue onto another page, with repeated headers; paragraphs may continue normally.

Native PDF text extraction omits some visibly rendered prompts, table cells and answers. OCR detects all six answer-edition quiz answers and none in learner editions. Exact normalized first/last 90-character markers match for 35 of 50 solution paragraphs; the other 15 contain OCR substitutions in numbers, quotes or arithmetic and were checked on enlarged rendered pages. Neither extraction nor OCR alone is treated as proof of print completeness.

## Checks and remaining scope

`npm run check:reviews` passes: 74 baseline outputs match, all 28 shipping reviews remain valid, and prose/source/renderer/missing-review invalidation cases pass. `app.js`, `styles.css`, `index.html`, `content/book.js` and `figure-renderer.js` are byte-identical to the prior 2026-10-13 checkpoint. No authoring, reader code, cache keys or generated manuscript/figure assets changed; the full 13-command suite from that checkpoint retains its original scope. No content rebuild was needed.

ROAD-004 is **done for its documented release-QA scope**, using the accumulated browser/accessibility/offline evidence and completed native print matrix. This is T3/Electron/macOS Quartz evidence at US Letter/100%; no physical printer, Safari/Firefox or real screen-reader session is claimed. The optional screen-reader pass remains optional. This print inspection is not a new factual/source audit or demonstrated human learning.

ROAD-007 still owns reviewed-release finalization, with `claude-code-alpha` ownership preserved and a reproducible local 0.4.1-alpha.1 bundle already available. No push, redeploy or release was performed. The public edition remains 0.4.0-alpha.1. CA1-026 / ROAD-005 remains deferred: zero human participants or observations.
