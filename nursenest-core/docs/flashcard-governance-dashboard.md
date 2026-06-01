# Flashcard Governance Dashboard

Date: 2026-06-01
Status: Exact repository-evidenced flashcard measurement

Source of truth: `docs/high-priority-content-gaps.md`. Supporting evidence comes from `docs/flashcard-platform-parity-audit.generated.md`, `docs/flashcard-quality-audit.md`, and `docs/reports/flashcards/global-flashcard-regeneration-standardization-audit.json`.

No estimates are used. If a count is not present in repository evidence, it is marked not evidenced.

## Measurement Boundary

`docs/flashcard-platform-parity-audit.generated.md` provides exact flashcard-derived availability by pathway, plus exact dedicated published flashcard table rows where that audit counted `ContentStatus.PUBLISHED`. It does not provide draft or review status counts by pathway.

## Revenue Pathway Flashcard Counts

| Pathway | Flashcard-Derived Availability | Dedicated Published Flashcard Rows | Draft Count | Review Count | Target | Gap From Availability | Gap From Published Rows |
| --- | ---: | ---: | --- | --- | ---: | ---: | ---: |
| Canada NCLEX-RN | 6,803 | 0 | Not evidenced | Not evidenced | 10,000 | 3,197 | 10,000 |
| United States NCLEX-RN | 6,796 | 0 | Not evidenced | Not evidenced | 10,000 | 3,204 | 10,000 |
| New Graduate RN | 485 | 0 | Not evidenced | Not evidenced | Not standardized in source report | Not scoreable | Not scoreable |
| REx-PN | 2,471 | 0 | Not evidenced | Not evidenced | 5,000 | 2,529 | 5,000 |
| NCLEX-PN | 1,195 | 0 | Not evidenced | Not evidenced | 5,000 | 3,805 | 5,000 |
| CNPLE | 1,371 | 1,154 | Not evidenced | Not evidenced | 3,000 | 1,629 | 1,846 |
| FNP | 2,418 | 0 | Not evidenced | Not evidenced | 3,000 | 582 | 3,000 |
| AGPCNP | 869 | 0 | Not evidenced | Not evidenced | 3,000 | 2,131 | 3,000 |
| PMHNP | 643 | 0 | Not evidenced | Not evidenced | 3,000 | 2,357 | 3,000 |
| WHNP | 310 | 0 | Not evidenced | Not evidenced | 3,000 | 2,690 | 3,000 |
| PNP-PC | 310 | 0 | Not evidenced | Not evidenced | 3,000 | 2,690 | 3,000 |

## System Dashboards Requested

| System | Exact Count Status |
| --- | --- |
| RN | Canada and United States NCLEX-RN flashcard-derived availability is evidenced; status-level draft/review counts are not evidenced |
| RPN/PN | REx-PN and NCLEX-PN flashcard-derived availability is evidenced; status-level draft/review counts are not evidenced |
| NP | CNPLE, FNP, AGPCNP, PMHNP, WHNP, and PNP-PC flashcard-derived availability is evidenced; status-level draft/review counts are not evidenced |
| ECG | No reliable ECG pathway flashcard status count found in repository evidence |
| Labs | No reliable lab flashcard status count found in repository evidence |
| Pharmacology | System-level availability exists inside pathway tables, but no standalone pharmacology flashcard status count is evidenced |
| Clinical Skills | No reliable clinical-skills flashcard status count found in repository evidence |

## Governance Gaps

1. Add a DB-backed flashcard status audit that groups `Flashcard.status` by country, tier, exam family, pathway, system, and topic.
2. Add `GeneratedFlashcardDraft.reviewStatus` counts for pending review, approved, rejected, and promoted states.
3. Separate flashcard-derived availability from published dedicated flashcard rows so launch dashboards do not overstate publication readiness.
4. Add topic-level flashcard counts for high-risk clinical loops.
5. Block future academy flashcard claims until published/draft/review counts are present.

