# Blueprint Gap Analysis

Generated: 2026-06-01T22:34:11.160Z

Live production DB read failed during this run: configured DigitalOcean database host was unreachable. Counts below use repository source indexes plus cached certification artifacts from this workspace; item-level topic matching must be rerun when DB connectivity is restored.

## Cached Question Counts

| Metric | Value |
| --- | --- |
| Total RN questions | 12902 |
| CAT eligible | 12902 |
| Missing rationales | 640 |
| Strict RN flashcards | 0 |
| Practice exams | 0 |


## Format Distribution

| Format | Actual | Target | Deficit | Status |
| --- | --- | --- | --- | --- |
| multiple_choice | 9034 | 3500 | 0 | PASS |
| sata | 1635 | 1500 | 0 | PASS |
| bowtie | 392 | 1000 | 608 | SHORT |
| matrix | 197 | 500 | 303 | SHORT |
| ordering | 730 | 500 | 0 | PASS |
| hotspot | 0 | 500 | 500 | SHORT |
| calculation | 0 | 300 | 300 | SHORT |
| ecg | 0 | 300 | 300 | SHORT |
| case_study | 0 | 0 | 0 | PASS |
| trend | 51 | 0 | 0 | PASS |
| cloze | 0 | 0 | 0 | PASS |
| matrix_mr | 0 | 0 | 0 | PASS |


## Blueprint Readiness By Source Category

| Category | RN Lessons | PN Lessons | REx-PN Lessons | Readiness | Status |
| --- | --- | --- | --- | --- | --- |
| Cardiovascular | 65 | 8 | 32 | 75% | Gap |
| Endocrine | 36 | 4 | 27 | 75% | Gap |
| Exam Strategy | 40 | 0 | 0 | 75% | Gap |
| Fluids, Electrolytes & Acid-Base | 49 | 7 | 6 | 75% | Gap |
| Fundamentals | 12 | 11 | 11 | 57% | Gap |
| Gastrointestinal | 40 | 1 | 26 | 75% | Gap |
| Hematology & Oncology | 45 | 0 | 0 | 75% | Gap |
| Infection Control | 50 | 7 | 10 | 75% | Gap |
| Integumentary & Wound Care | 42 | 2 | 1 | 75% | Gap |
| Leadership & Delegation | 41 | 10 | 78 | 75% | Gap |
| Maternal & Newborn | 58 | 2 | 2 | 75% | Gap |
| Mental Health | 9 | 1 | 27 | 50% | Gap |
| Musculoskeletal | 26 | 0 | 25 | 75% | Gap |
| Neurological | 51 | 3 | 29 | 75% | Gap |
| Nutrition | 34 | 0 | 0 | 75% | Gap |
| Pediatrics | 20 | 2 | 28 | 75% | Gap |
| Pharmacology | 28 | 10 | 35 | 75% | Gap |
| Procedures & Skills | 45 | 0 | 0 | 75% | Gap |
| Renal & Urinary | 47 | 3 | 28 | 75% | Gap |
| Respiratory | 51 | 15 | 38 | 75% | Gap |
| Safety & Prioritization | 12 | 10 | 11 | 57% | Gap |


## Non-Negotiable Gaps

- Practice exam coverage is not met: cached count is 0.
- Strict NCLEX-RN flashcard coverage is not met: cached count is 0.
- NGN case study coverage is not met: static source count is 2.
- Bowtie, matrix, hotspot, calculation, and ECG format targets are short in cached distribution.
- PN and REx-PN topic-level question counts require live DB verification and generation after DB connectivity returns.
