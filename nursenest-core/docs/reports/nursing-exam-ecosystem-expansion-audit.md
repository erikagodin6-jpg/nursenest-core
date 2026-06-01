# Nursing Exam Ecosystem Expansion Audit

Generated: 2026-06-01T22:37:14.555Z
Inventory source: unavailable
Database status:  Invalid `prisma.examQuestion.count()` invocation in /root/nursenest-core/nursenest-core/scripts/audit-nursing-exam-ecosystem.mts:72:27 69 70 const [publishedQuestions, activeQuestions, visibleQuestions, publishedLessons, publishedFlashcard

## Publication Rule

No pathway is publication-ready or monetization-ready until measured inventory meets the encoded minimums for questions, lessons, flashcards, NGN items, case studies, and required item-type breadth. This report intentionally does not generate filler content.
Because live inventory was unavailable, numeric counts are intentionally marked `not measured` instead of being treated as zero.

## Coverage Matrix

| Pathway | Priority | Registry Status | Questions | Lessons | Flashcards | NGN | Cases | Score | Ready | Top Gaps |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Canadian NP / CNPLE | critical | active | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |
| Canada RN / NCLEX-RN | critical | active | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |
| US RN / NCLEX-RN | critical | active | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |
| Canada RPN / REx-PN | critical | active | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |
| US PN / NCLEX-PN | critical | active | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |
| Canadian NP / Adult | high | missing | not measured | not measured | not measured | not measured | not measured | blocked | no | Missing pathway registry row. |
| Canadian NP / Primary Care | high | missing | not measured | not measured | not measured | not measured | not measured | blocked | no | Missing pathway registry row. |
| US NP / FNP | high | active | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |
| US NP / AGPCNP | high | active | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |
| US NP / PMHNP | high | active | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |
| US NP / PNP-PC | high | active | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |
| US NP / WHNP | high | active | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |
| US NP / ENP | strategic | missing | not measured | not measured | not measured | not measured | not measured | blocked | no | Missing pathway registry row. |
| International RN / UK NMC CBT + OSCE | strategic | hidden | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |
| International RN / Australia NMBA-AHPRA IQNM | strategic | hidden | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |
| International RN / Philippines PRC PNLE | strategic | hidden | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |
| International RN / India state council | strategic | hidden | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |
| International RN / Nigeria NMCN | strategic | hidden | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |
| International RN / Saudi SCFHS | strategic | hidden | not measured | not measured | not measured | not measured | not measured | blocked | no | Live inventory unavailable; publication cannot be certified. |

## Highest-Impact Blockers

- Live database inventory was unavailable, so no content pathway can be certified publication-ready.
- Canadian NP / Adult: missing canonical pathway registry row.
- Canadian NP / Primary Care: missing canonical pathway registry row.
- US NP / ENP: missing canonical pathway registry row.

## Next Production Action

Use this report as the pre-generation gate: create or import clinically reviewed content only for the ranked gaps above, then rerun `npm run audit:nursing-exam-ecosystem` before enabling publication or paid positioning.

