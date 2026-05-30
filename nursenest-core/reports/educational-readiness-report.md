# NurseNest Educational Readiness Report

Generated: 2026-05-30T08:50:27.431Z

## Executive Summary

- Database connection failed; database-dependent metrics are marked Unable To Verify.
- Overall educational readiness score: Unable To Verify.
- Top deficiencies generated from 540 verified or unverifiable coverage findings.
- Practice exam inventory coverage is marked Unable To Verify because the detected PracticeTest model stores learner-built sessions, not a production content catalog.

## Database Validation

Status: **Database Unreachable**

Database Unreachable: 
Invalid `prisma.$queryRaw()` invocation:


Can't reach database server at `HOST:5432`

Please make sure your database server is running at `HOST:5432`.

## Target Policy

Source: Educational Readiness Audit Minimum V1

Targets are explicit launch-readiness thresholds for depth comparison only. Actual counts are always database-derived; unavailable evidence is marked Unable To Verify.

## System Readiness

| Pathway | Readiness | Critical Gaps | High Gaps | Status |
| --- | ---: | ---: | ---: | --- |
| RN | Unable To Verify | 0 | 90 | Unable To Verify |
| RPN / PN | Unable To Verify | 0 | 90 | Unable To Verify |
| NP | Unable To Verify | 0 | 90 | Unable To Verify |
| RT | Unable To Verify | 0 | 90 | Unable To Verify |
| Allied | Unable To Verify | 0 | 90 | Unable To Verify |
| New Grad | Unable To Verify | 0 | 90 | Unable To Verify |

## Educational Asset Audit

| Asset | Actual | Status | Source | Explanation |
| --- | ---: | --- | --- | --- |
| Lessons | Unable To Verify | Unable To Verify | Prisma pathway_lessons |  |
| Questions | Unable To Verify | Unable To Verify | Prisma exam_questions |  |
| Flashcards | Unable To Verify | Unable To Verify | Prisma flashcards |  |
| Practice Exams | Unable To Verify | Unable To Verify | Prisma practice_tests | PracticeTest stores learner-created sessions; no production practice-exam content catalog with topic/pathway mappings was identified. |
| CAT Pools | Unable To Verify | Unable To Verify | Prisma exam_questions.is_adaptive_eligible |  |
| Simulations | Unable To Verify | Unable To Verify | Prisma clinical_nursing_scenarios |  |
| Case Studies | Unable To Verify | Unable To Verify | Prisma exam_questions / clinical_nursing_scenarios | No dedicated production case-study catalog model with complete pathway/category mappings was verified by this audit. |
| Pharmacology | Unable To Verify | Unable To Verify | Topic-matched Prisma question counts |  |
| Clinical Skills | Unable To Verify | Unable To Verify | Topic-matched Prisma question counts |  |
| ECG | Unable To Verify | Unable To Verify | ECG content models | A complete ECG asset inventory spans specialized models and was not reduced to a single auditable count in this pass. |
| Med Math | Unable To Verify | Unable To Verify | Med math content models | No dedicated med-math inventory model with pathway/category mappings was identified by this audit. |
| Labs | Unable To Verify | Unable To Verify | Labs content models | No dedicated labs inventory model with pathway/category mappings was identified by this audit. |
| Study Plans | Unable To Verify | Unable To Verify | Study plan generation/runtime state | Study plans are generated/runtime learner artifacts; no production study-plan content inventory model was identified. |
| Weak Area Remediation | Unable To Verify | Unable To Verify | Question, flashcard, and simulation remediation link counts |  |

## Topic Readiness

| Pathway | Category | Readiness | Questions | Lessons | Flashcards | Simulations | Practice Exams | CAT | Journey |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| RN | Cardiovascular | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RN | Respiratory | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RN | Neurological | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RN | Endocrine | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RN | Renal | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RN | Gastrointestinal | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RN | Mental Health | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RN | Maternity | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RN | Pediatrics | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RN | Community | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RN | Leadership | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RN | Professional Practice | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RN | Pharmacology | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RN | Clinical Skills | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RN | Emergency | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RPN / PN | Cardiovascular | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RPN / PN | Respiratory | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RPN / PN | Neurological | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RPN / PN | Endocrine | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RPN / PN | Renal | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RPN / PN | Gastrointestinal | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RPN / PN | Mental Health | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RPN / PN | Maternity | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RPN / PN | Pediatrics | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RPN / PN | Community | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RPN / PN | Leadership | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RPN / PN | Professional Practice | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RPN / PN | Pharmacology | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RPN / PN | Clinical Skills | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RPN / PN | Emergency | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| NP | Cardiovascular | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| NP | Respiratory | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| NP | Neurological | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| NP | Endocrine | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| NP | Renal | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| NP | Gastrointestinal | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| NP | Mental Health | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| NP | Maternity | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| NP | Pediatrics | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| NP | Community | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| NP | Leadership | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| NP | Professional Practice | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| NP | Pharmacology | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| NP | Clinical Skills | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| NP | Emergency | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RT | Cardiovascular | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RT | Respiratory | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RT | Neurological | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RT | Endocrine | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RT | Renal | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RT | Gastrointestinal | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RT | Mental Health | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RT | Maternity | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RT | Pediatrics | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RT | Community | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RT | Leadership | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RT | Professional Practice | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RT | Pharmacology | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RT | Clinical Skills | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| RT | Emergency | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| Allied | Cardiovascular | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| Allied | Respiratory | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| Allied | Neurological | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| Allied | Endocrine | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| Allied | Renal | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| Allied | Gastrointestinal | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| Allied | Mental Health | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| Allied | Maternity | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| Allied | Pediatrics | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| Allied | Community | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| Allied | Leadership | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| Allied | Professional Practice | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| Allied | Pharmacology | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| Allied | Clinical Skills | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| Allied | Emergency | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| New Grad | Cardiovascular | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| New Grad | Respiratory | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| New Grad | Neurological | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| New Grad | Endocrine | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| New Grad | Renal | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| New Grad | Gastrointestinal | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| New Grad | Mental Health | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| New Grad | Maternity | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| New Grad | Pediatrics | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| New Grad | Community | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| New Grad | Leadership | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| New Grad | Professional Practice | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| New Grad | Pharmacology | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| New Grad | Clinical Skills | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |
| New Grad | Emergency | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify | Unable To Verify |

## Top 100 Deficiencies

| Rank | Severity | Pathway | Category | Asset | Actual | Target | Completion | Recommended Action |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: | --- |
| 1 | High | RN | Cardiovascular | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 2 | High | RN | Cardiovascular | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 3 | High | RN | Cardiovascular | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 4 | High | RN | Cardiovascular | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 5 | High | RN | Cardiovascular | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 6 | High | RN | Cardiovascular | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 7 | High | RN | Respiratory | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 8 | High | RN | Respiratory | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 9 | High | RN | Respiratory | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 10 | High | RN | Respiratory | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 11 | High | RN | Respiratory | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 12 | High | RN | Respiratory | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 13 | High | RN | Neurological | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 14 | High | RN | Neurological | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 15 | High | RN | Neurological | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 16 | High | RN | Neurological | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 17 | High | RN | Neurological | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 18 | High | RN | Neurological | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 19 | High | RN | Endocrine | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 20 | High | RN | Endocrine | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 21 | High | RN | Endocrine | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 22 | High | RN | Endocrine | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 23 | High | RN | Endocrine | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 24 | High | RN | Endocrine | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 25 | High | RN | Renal | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 26 | High | RN | Renal | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 27 | High | RN | Renal | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 28 | High | RN | Renal | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 29 | High | RN | Renal | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 30 | High | RN | Renal | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 31 | High | RN | Gastrointestinal | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 32 | High | RN | Gastrointestinal | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 33 | High | RN | Gastrointestinal | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 34 | High | RN | Gastrointestinal | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 35 | High | RN | Gastrointestinal | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 36 | High | RN | Gastrointestinal | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 37 | High | RN | Mental Health | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 38 | High | RN | Mental Health | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 39 | High | RN | Mental Health | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 40 | High | RN | Mental Health | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 41 | High | RN | Mental Health | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 42 | High | RN | Mental Health | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 43 | High | RN | Maternity | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 44 | High | RN | Maternity | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 45 | High | RN | Maternity | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 46 | High | RN | Maternity | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 47 | High | RN | Maternity | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 48 | High | RN | Maternity | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 49 | High | RN | Pediatrics | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 50 | High | RN | Pediatrics | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 51 | High | RN | Pediatrics | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 52 | High | RN | Pediatrics | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 53 | High | RN | Pediatrics | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 54 | High | RN | Pediatrics | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 55 | High | RN | Community | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 56 | High | RN | Community | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 57 | High | RN | Community | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 58 | High | RN | Community | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 59 | High | RN | Community | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 60 | High | RN | Community | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 61 | High | RN | Leadership | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 62 | High | RN | Leadership | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 63 | High | RN | Leadership | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 64 | High | RN | Leadership | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 65 | High | RN | Leadership | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 66 | High | RN | Leadership | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 67 | High | RN | Professional Practice | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 68 | High | RN | Professional Practice | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 69 | High | RN | Professional Practice | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 70 | High | RN | Professional Practice | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 71 | High | RN | Professional Practice | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 72 | High | RN | Professional Practice | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 73 | High | RN | Pharmacology | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 74 | High | RN | Pharmacology | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 75 | High | RN | Pharmacology | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 76 | High | RN | Pharmacology | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 77 | High | RN | Pharmacology | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 78 | High | RN | Pharmacology | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 79 | High | RN | Clinical Skills | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 80 | High | RN | Clinical Skills | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 81 | High | RN | Clinical Skills | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 82 | High | RN | Clinical Skills | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 83 | High | RN | Clinical Skills | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 84 | High | RN | Clinical Skills | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 85 | High | RN | Emergency | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 86 | High | RN | Emergency | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 87 | High | RN | Emergency | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 88 | High | RN | Emergency | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 89 | High | RN | Emergency | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 90 | High | RN | Emergency | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 91 | High | RPN / PN | Cardiovascular | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 92 | High | RPN / PN | Cardiovascular | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 93 | High | RPN / PN | Cardiovascular | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 94 | High | RPN / PN | Cardiovascular | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |
| 95 | High | RPN / PN | Cardiovascular | Practice Exams | Unable To Verify | 1 | Unable To Verify | Add an auditable content inventory source for practice exams or map the existing source to Prisma. |
| 96 | High | RPN / PN | Cardiovascular | CAT Coverage | Unable To Verify | 40 | Unable To Verify | Add an auditable content inventory source for cat coverage or map the existing source to Prisma. |
| 97 | High | RPN / PN | Respiratory | Questions | Unable To Verify | 80 | Unable To Verify | Add an auditable content inventory source for questions or map the existing source to Prisma. |
| 98 | High | RPN / PN | Respiratory | Lessons | Unable To Verify | 8 | Unable To Verify | Add an auditable content inventory source for lessons or map the existing source to Prisma. |
| 99 | High | RPN / PN | Respiratory | Flashcards | Unable To Verify | 120 | Unable To Verify | Add an auditable content inventory source for flashcards or map the existing source to Prisma. |
| 100 | High | RPN / PN | Respiratory | Simulations | Unable To Verify | 3 | Unable To Verify | Add an auditable content inventory source for simulations or map the existing source to Prisma. |

## Top 100 Strengths

| Rank | Pathway | Category | Asset | Actual | Target | Completion |
| ---: | --- | --- | --- | ---: | ---: | ---: |

## Recommended Build Order

- **High** RN Cardiovascular: Add an auditable content inventory source for questions or map the existing source to Prisma.
- **High** RN Cardiovascular: Add an auditable content inventory source for lessons or map the existing source to Prisma.
- **High** RN Cardiovascular: Add an auditable content inventory source for flashcards or map the existing source to Prisma.
- **High** RN Cardiovascular: Add an auditable content inventory source for simulations or map the existing source to Prisma.
- **High** RN Cardiovascular: Add an auditable content inventory source for practice exams or map the existing source to Prisma.
- **High** RN Cardiovascular: Add an auditable content inventory source for cat coverage or map the existing source to Prisma.
- **High** RN Respiratory: Add an auditable content inventory source for questions or map the existing source to Prisma.
- **High** RN Respiratory: Add an auditable content inventory source for lessons or map the existing source to Prisma.
- **High** RN Respiratory: Add an auditable content inventory source for flashcards or map the existing source to Prisma.
- **High** RN Respiratory: Add an auditable content inventory source for simulations or map the existing source to Prisma.
- **High** RN Respiratory: Add an auditable content inventory source for practice exams or map the existing source to Prisma.
- **High** RN Respiratory: Add an auditable content inventory source for cat coverage or map the existing source to Prisma.
- **High** RN Neurological: Add an auditable content inventory source for questions or map the existing source to Prisma.
- **High** RN Neurological: Add an auditable content inventory source for lessons or map the existing source to Prisma.
- **High** RN Neurological: Add an auditable content inventory source for flashcards or map the existing source to Prisma.
- **High** RN Neurological: Add an auditable content inventory source for simulations or map the existing source to Prisma.
- **High** RN Neurological: Add an auditable content inventory source for practice exams or map the existing source to Prisma.
- **High** RN Neurological: Add an auditable content inventory source for cat coverage or map the existing source to Prisma.
- **High** RN Endocrine: Add an auditable content inventory source for questions or map the existing source to Prisma.
- **High** RN Endocrine: Add an auditable content inventory source for lessons or map the existing source to Prisma.
- **High** RN Endocrine: Add an auditable content inventory source for flashcards or map the existing source to Prisma.
- **High** RN Endocrine: Add an auditable content inventory source for simulations or map the existing source to Prisma.
- **High** RN Endocrine: Add an auditable content inventory source for practice exams or map the existing source to Prisma.
- **High** RN Endocrine: Add an auditable content inventory source for cat coverage or map the existing source to Prisma.
- **High** RN Renal: Add an auditable content inventory source for questions or map the existing source to Prisma.
- **High** RN Renal: Add an auditable content inventory source for lessons or map the existing source to Prisma.
- **High** RN Renal: Add an auditable content inventory source for flashcards or map the existing source to Prisma.
- **High** RN Renal: Add an auditable content inventory source for simulations or map the existing source to Prisma.
- **High** RN Renal: Add an auditable content inventory source for practice exams or map the existing source to Prisma.
- **High** RN Renal: Add an auditable content inventory source for cat coverage or map the existing source to Prisma.

## Unable To Verify

- RN / Cardiovascular / Questions: Unable To Verify: database was unreachable.
- RN / Cardiovascular / Lessons: Unable To Verify: database was unreachable.
- RN / Cardiovascular / Flashcards: Unable To Verify: database was unreachable.
- RN / Cardiovascular / Simulations: Unable To Verify: database was unreachable.
- RN / Cardiovascular / Practice Exams: Unable To Verify: database was unreachable.
- RN / Cardiovascular / CAT Coverage: Unable To Verify: database was unreachable.
- RN / Respiratory / Questions: Unable To Verify: database was unreachable.
- RN / Respiratory / Lessons: Unable To Verify: database was unreachable.
- RN / Respiratory / Flashcards: Unable To Verify: database was unreachable.
- RN / Respiratory / Simulations: Unable To Verify: database was unreachable.
- RN / Respiratory / Practice Exams: Unable To Verify: database was unreachable.
- RN / Respiratory / CAT Coverage: Unable To Verify: database was unreachable.
- RN / Neurological / Questions: Unable To Verify: database was unreachable.
- RN / Neurological / Lessons: Unable To Verify: database was unreachable.
- RN / Neurological / Flashcards: Unable To Verify: database was unreachable.
- RN / Neurological / Simulations: Unable To Verify: database was unreachable.
- RN / Neurological / Practice Exams: Unable To Verify: database was unreachable.
- RN / Neurological / CAT Coverage: Unable To Verify: database was unreachable.
- RN / Endocrine / Questions: Unable To Verify: database was unreachable.
- RN / Endocrine / Lessons: Unable To Verify: database was unreachable.
- RN / Endocrine / Flashcards: Unable To Verify: database was unreachable.
- RN / Endocrine / Simulations: Unable To Verify: database was unreachable.
- RN / Endocrine / Practice Exams: Unable To Verify: database was unreachable.
- RN / Endocrine / CAT Coverage: Unable To Verify: database was unreachable.
- RN / Renal / Questions: Unable To Verify: database was unreachable.
- RN / Renal / Lessons: Unable To Verify: database was unreachable.
- RN / Renal / Flashcards: Unable To Verify: database was unreachable.
- RN / Renal / Simulations: Unable To Verify: database was unreachable.
- RN / Renal / Practice Exams: Unable To Verify: database was unreachable.
- RN / Renal / CAT Coverage: Unable To Verify: database was unreachable.
- RN / Gastrointestinal / Questions: Unable To Verify: database was unreachable.
- RN / Gastrointestinal / Lessons: Unable To Verify: database was unreachable.
- RN / Gastrointestinal / Flashcards: Unable To Verify: database was unreachable.
- RN / Gastrointestinal / Simulations: Unable To Verify: database was unreachable.
- RN / Gastrointestinal / Practice Exams: Unable To Verify: database was unreachable.
- RN / Gastrointestinal / CAT Coverage: Unable To Verify: database was unreachable.
- RN / Mental Health / Questions: Unable To Verify: database was unreachable.
- RN / Mental Health / Lessons: Unable To Verify: database was unreachable.
- RN / Mental Health / Flashcards: Unable To Verify: database was unreachable.
- RN / Mental Health / Simulations: Unable To Verify: database was unreachable.
- RN / Mental Health / Practice Exams: Unable To Verify: database was unreachable.
- RN / Mental Health / CAT Coverage: Unable To Verify: database was unreachable.
- RN / Maternity / Questions: Unable To Verify: database was unreachable.
- RN / Maternity / Lessons: Unable To Verify: database was unreachable.
- RN / Maternity / Flashcards: Unable To Verify: database was unreachable.
- RN / Maternity / Simulations: Unable To Verify: database was unreachable.
- RN / Maternity / Practice Exams: Unable To Verify: database was unreachable.
- RN / Maternity / CAT Coverage: Unable To Verify: database was unreachable.
- RN / Pediatrics / Questions: Unable To Verify: database was unreachable.
- RN / Pediatrics / Lessons: Unable To Verify: database was unreachable.
- RN / Pediatrics / Flashcards: Unable To Verify: database was unreachable.
- RN / Pediatrics / Simulations: Unable To Verify: database was unreachable.
- RN / Pediatrics / Practice Exams: Unable To Verify: database was unreachable.
- RN / Pediatrics / CAT Coverage: Unable To Verify: database was unreachable.
- RN / Community / Questions: Unable To Verify: database was unreachable.
- RN / Community / Lessons: Unable To Verify: database was unreachable.
- RN / Community / Flashcards: Unable To Verify: database was unreachable.
- RN / Community / Simulations: Unable To Verify: database was unreachable.
- RN / Community / Practice Exams: Unable To Verify: database was unreachable.
- RN / Community / CAT Coverage: Unable To Verify: database was unreachable.
- RN / Leadership / Questions: Unable To Verify: database was unreachable.
- RN / Leadership / Lessons: Unable To Verify: database was unreachable.
- RN / Leadership / Flashcards: Unable To Verify: database was unreachable.
- RN / Leadership / Simulations: Unable To Verify: database was unreachable.
- RN / Leadership / Practice Exams: Unable To Verify: database was unreachable.
- RN / Leadership / CAT Coverage: Unable To Verify: database was unreachable.
- RN / Professional Practice / Questions: Unable To Verify: database was unreachable.
- RN / Professional Practice / Lessons: Unable To Verify: database was unreachable.
- RN / Professional Practice / Flashcards: Unable To Verify: database was unreachable.
- RN / Professional Practice / Simulations: Unable To Verify: database was unreachable.
- RN / Professional Practice / Practice Exams: Unable To Verify: database was unreachable.
- RN / Professional Practice / CAT Coverage: Unable To Verify: database was unreachable.
- RN / Pharmacology / Questions: Unable To Verify: database was unreachable.
- RN / Pharmacology / Lessons: Unable To Verify: database was unreachable.
- RN / Pharmacology / Flashcards: Unable To Verify: database was unreachable.
- RN / Pharmacology / Simulations: Unable To Verify: database was unreachable.
- RN / Pharmacology / Practice Exams: Unable To Verify: database was unreachable.
- RN / Pharmacology / CAT Coverage: Unable To Verify: database was unreachable.
- RN / Clinical Skills / Questions: Unable To Verify: database was unreachable.
- RN / Clinical Skills / Lessons: Unable To Verify: database was unreachable.
- RN / Clinical Skills / Flashcards: Unable To Verify: database was unreachable.
- RN / Clinical Skills / Simulations: Unable To Verify: database was unreachable.
- RN / Clinical Skills / Practice Exams: Unable To Verify: database was unreachable.
- RN / Clinical Skills / CAT Coverage: Unable To Verify: database was unreachable.
- RN / Emergency / Questions: Unable To Verify: database was unreachable.
- RN / Emergency / Lessons: Unable To Verify: database was unreachable.
- RN / Emergency / Flashcards: Unable To Verify: database was unreachable.
- RN / Emergency / Simulations: Unable To Verify: database was unreachable.
- RN / Emergency / Practice Exams: Unable To Verify: database was unreachable.
- RN / Emergency / CAT Coverage: Unable To Verify: database was unreachable.
- RPN / PN / Cardiovascular / Questions: Unable To Verify: database was unreachable.
- RPN / PN / Cardiovascular / Lessons: Unable To Verify: database was unreachable.
- RPN / PN / Cardiovascular / Flashcards: Unable To Verify: database was unreachable.
- RPN / PN / Cardiovascular / Simulations: Unable To Verify: database was unreachable.
- RPN / PN / Cardiovascular / Practice Exams: Unable To Verify: database was unreachable.
- RPN / PN / Cardiovascular / CAT Coverage: Unable To Verify: database was unreachable.
- RPN / PN / Respiratory / Questions: Unable To Verify: database was unreachable.
- RPN / PN / Respiratory / Lessons: Unable To Verify: database was unreachable.
- RPN / PN / Respiratory / Flashcards: Unable To Verify: database was unreachable.
- RPN / PN / Respiratory / Simulations: Unable To Verify: database was unreachable.
