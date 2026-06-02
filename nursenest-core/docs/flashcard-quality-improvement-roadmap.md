# Flashcard Quality Improvement Roadmap

Date: 2026-06-01
Status: Flashcard maturity acceleration plan

Source of truth: `docs/content-maturity-dashboard.md` and `docs/flashcard-governance-dashboard.md`.

Future products remain locked: `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, `adminOnly=true`.

## Maturity Target

| Dimension | Current | Target | Gap |
| --- | ---: | ---: | ---: |
| Coverage | 55% | 90% | 35 pts |
| Depth | 50% | 90% | 40 pts |
| Reasoning | 45% | 90% | 45 pts |
| Readiness | 50% | 90% | 40 pts |
| Quality | 72% | 90% | 18 pts |
| Overall | 54% | 90% | 36 pts |

## Repository Evidence Boundary

The flashcard dashboard provides pathway flashcard-derived availability but does not provide reliable draft/review counts by pathway. Dedicated published flashcard rows are mostly 0 outside CNPLE. Therefore launch dashboards must separate:

- Flashcard-derived availability
- Dedicated published flashcard rows
- Draft count
- Review count
- Approved count
- Rejected count

## Quality Standard

Every mature flashcard must include:

- Front
- Back
- Why it matters
- Clinical relevance
- Clinical pearl
- Memory anchor
- Common mistake
- Exam relevance
- Role scope
- Exam mapping
- Country mapping
- Related lesson
- Related question
- Related simulation or case when applicable
- Translation readiness flag

## Current Revenue Pathway Gaps

| Pathway | Flashcard-Derived Availability | Target | Gap From Availability | Status Concern |
| --- | ---: | ---: | ---: | --- |
| Canada NCLEX-RN | 6,803 | 10,000 | 3,197 | Published/draft/review status not evidenced |
| United States NCLEX-RN | 6,796 | 10,000 | 3,204 | Published/draft/review status not evidenced |
| REx-PN | 2,471 | 5,000 | 2,529 | Published/draft/review status not evidenced |
| NCLEX-PN | 1,195 | 5,000 | 3,805 | Published/draft/review status not evidenced |
| CNPLE | 1,371 | 3,000 | 1,629 | CNPLE has 1,154 dedicated published rows, but still below target |
| FNP | 2,418 | 3,000 | 582 | Published/draft/review status not evidenced |
| AGPCNP | 869 | 3,000 | 2,131 | Published/draft/review status not evidenced |
| PMHNP | 643 | 3,000 | 2,357 | Published/draft/review status not evidenced |
| WHNP | 310 | 3,000 | 2,690 | Published/draft/review status not evidenced |
| PNP-PC | 310 | 3,000 | 2,690 | Published/draft/review status not evidenced |

## Roadmap To 90%

| Stage | Required Work | Completion Evidence |
| --- | --- | --- |
| Instrumentation | Status audit by pathway, system, topic, exam, country, role | Published/draft/review/approved/rejected counts |
| Quality schema | Add fields for why-it-matters, clinical relevance, related content, role scope | Flashcard records expose quality and cross-linking metadata |
| Question-derived regeneration | Generate cards from enriched questions, rationales, pearls, memory anchors | Every eligible question has flashcard output |
| Topic-level high-risk counts | Count flashcards for sepsis, shock, ACS, stroke, respiratory failure, DKA, hyperkalemia, GI bleed, trauma, maternity, pediatrics | High-risk loop dashboard can score flashcards |
| Cross-linking | Link flashcards to lessons, questions, cases, simulations, labs, ECG, pharmacology | Adaptive remediation can route from weak card to practice |
| Quality review | Block definition-only and duplicate cards | 90%+ flashcard quality score |

## Priority Order

| Priority | Workstream | Reason |
| ---: | --- | --- |
| 1 | Flashcard instrumentation | Required before claims of readiness |
| 2 | RN and RPN/PN gap closure | Current revenue protection |
| 3 | Topic-level high-risk flashcards | Required for complete learning loops |
| 4 | NP specialty flashcards | CNPLE/FNP first, then AGPCNP/PMHNP/WHNP/PNP-PC |
| 5 | System flashcards for ECG, labs, pharmacology, clinical skills | Required to mature weak learning systems |

