# Comprehensive Educational Content Quality Audit

Generated: 2026-05-31T22:59:16.554Z

## Scope

This read-only audit scored database-backed questions, flashcards, pathway lessons, blog articles, localized blog articles, legacy content items, and mastery case study scenarios across the requested nursing and allied-health pathways.

Clinical accuracy, answer-key accuracy, and outdated-practice findings are heuristic risk signals. They identify records needing review; they are not a substitute for human clinical SME validation.

## Executive Scores

- Content Quality Score: 78/100
- Clinical Accuracy Score: 78.5/100
- Duplication Score: 57.7/100
- Exam Readiness Score: 81.3/100
- Total assets scored: 96,504
- Assets requiring revision: 27,628

## Surface Summary

| Surface | Assets | Require Revision | Content Quality | Clinical Accuracy | Duplication | Exam Readiness | A+ / A / B / C / D |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| questions | 72,828 | 27,628 | 74.5 | 74.6 | 52.5 | 78 | 375 / 2217 / 42608 / 27626 / 2 |
| flashcards | 6,216 | 0 | 85.9 | 75.6 | 99.9 | 86.5 | 96 / 2981 / 3139 / 0 / 0 |
| pathwayLessons | 13,040 | 0 | 86.5 | 94.4 | 52.2 | 90.8 | 1203 / 9822 / 2015 / 0 / 0 |
| blogArticles | 4,366 | 0 | 99.6 | 99.9 | 99.8 | 99.3 | 4334 / 32 / 0 / 0 / 0 |
| localizedBlogArticles | 2 | 0 | 85.8 | 90 | 100 | 81.7 | 0 / 2 / 0 / 0 / 0 |
| contentItems | 52 | 0 | 99.8 | 100 | 100 | 99.8 | 51 / 1 / 0 / 0 / 0 |
| caseStudies | 0 | 0 | 0 | 0 | 0 | 0 | 0 / 0 / 0 / 0 / 0 |

## Requested Pathway Summary

| Pathway | Assets | Require Revision | Content Quality | Clinical Accuracy | Duplication | Exam Readiness |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| RN | 17,104 | 3,903 | 79.1 | 78 | 73 | 79 |
| RPN | 6,148 | 1,159 | 82.2 | 80.3 | 66.6 | 85 |
| PN | 6,457 | 2,503 | 76.6 | 77.3 | 53.7 | 79.1 |
| NP | 16,857 | 779 | 83.6 | 86.4 | 55.1 | 87.8 |
| Respiratory Therapy | 7,155 | 2,300 | 75.8 | 75.1 | 49 | 80.7 |
| Paramedic | 2,269 | 956 | 75.9 | 78.5 | 50.1 | 80.5 |
| Medical Laboratory Technology | 3,281 | 1,390 | 73.9 | 73.9 | 47.8 | 79.5 |
| Physiotherapy | 598 | 231 | 73.8 | 73.8 | 47 | 79.2 |
| Occupational Therapy | 44 | 0 | 100 | 100 | 100 | 100 |
| PSW | 0 | 0 | 0 | 0 | 0 | 0 |
| Social Work | 393 | 152 | 78.9 | 82.6 | 57.9 | 82.1 |
| Psychotherapy | 207 | 60 | 84.2 | 83 | 65.2 | 88.3 |

## Primary Quality Risks

| Risk | Count |
| --- | ---: |
| Missing references | 80,837 |
| Weak evidence signal | 61,735 |
| Weak distractor teaching | 72,453 |
| Duplicate / near-duplicate | 74,189 |
| Generic / filler language | 2 |
| Placeholder / stub signal | 7 |
| Ambiguous or missing answer | 0 |
| Answer-key consistency risk | 0 |

## Interpretation

The largest quality gap is not raw content volume. It is educational depth: many published questions have valid stems and answers but lack per-distractor teaching, explicit clinical reasoning, exam strategy, or reference-backed rationale structure.

Flashcards are comparatively clean in the sampled DB-backed flashcard audit, but this consolidated heuristic audit still flags cards that lack explicit evidence signals or exam-style calibration metadata.

The strict lesson governance gate separately reports a full review backlog because it expects newer validator signals across catalog lessons. Treat that as a governance backlog, while the meaningful-content gate shows most core RN/RPN/PN/NP lessons contain substantive instructional material.

## Evidence Artifacts

- JSON summary: `reports/content-quality/comprehensive-educational-content-quality-audit.json`
- CSV findings: `reports/content-quality/comprehensive-educational-content-quality-findings.csv`
- Question inventory: `reports/question-inventory-us-rn-nclex-rn.json`
- Rationale quality audit: `reports/content-quality/question-flashcard-rationale-audit.json`
- Rationale markdown report: `docs/question-flashcard-rationale-quality-audit.md`
- Lesson governance dashboard: `docs/reports/clinical-content-quality/content-quality-dashboard.md`
- Meaningful lesson audit: `reports/meaningful-clinical-content-audit.json`

## Built-In Audit Notes

- The built-in blog audit commands currently fail before query execution because `src/lib/db/blog-audit-env-load.ts` resolves `./env-bootstrap.ts.ts` through a TSX data URL. This report used direct Prisma reads instead.
- Existing exam-bank audit scanned 72,828 published questions and found 22,840 shallow rationales, 67,193 without distractor teaching, and 72,828 with weak clinical reasoning signal under its enrichment rules.
- Existing rationale-like field audit scanned 514 source fields and found 2 critical records, 2 reused records, 432 needing review, and 82 high-quality fields.
- The DB-backed mastery case study table currently returned 0 rows, so case-study content appears to live inside lessons/questions/static source assets rather than as standalone published case scenario rows.

## Next Remediation Priorities

1. Add per-distractor rationales and clinical reasoning to high-traffic RN/RPN/PN/NP question banks.
2. Backfill reference sources and last-reviewed metadata for clinical and pharmacology content.
3. De-duplicate repeated stems, repeated flashcard fronts, and recycled clinical pearl language.
4. SME-review answer-key risk rows in the CSV before any automated rewriting.
5. Repair the built-in blog audit env-loader bug so blog governance can run in CI.
