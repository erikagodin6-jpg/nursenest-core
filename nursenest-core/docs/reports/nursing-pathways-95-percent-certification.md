# Nursing Pathways 95 Percent Certification

Generated: 2026-06-01T22:46:36.625Z

Scope: RN, RPN, PN, NP only. Allied, blog, and SEO work are excluded.

## Actions Completed

- Verified production database connectivity with a one-connection Prisma client.
- Deterministically backfilled blueprint metadata and question-format metadata on existing published question rows.
- Updated 26,365 existing question rows.
- Set explicit blueprint domains for 26,285 rows.
- Set explicit question formats for 13,463 rows.
- Did not change stems, answers, rationales, lessons, flashcards, cases, auth, routing, or paywall behavior.

## Certification Result

| Pathway | Readiness | Target | Status | Lessons | Questions | Flashcards | Cases | Practice Exams | CAT Eligible |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RN | 57% | 95% | NO-GO | 1043 | 12902 | 0 | 0 | 0 | 12262 |
| PN | 56% | 95% | NO-GO | 1052 | 5143 | 0 | 0 | 0 | 5142 |
| RPN | 54% | 95% | NO-GO | 1041 | 2926 | 1344 | 0 | 0 | 2926 |
| NP | 73% | 95% | NO-GO | 1465 | 37994 | 27056 | 0 | 1084 | 29220 |


## Component Scores

| Pathway | Blueprint | Questions | Lessons | Flashcards | Cases | CAT | Practice Exams | Quality Metadata |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RN | 100% | 100% | 100% | 0% | 0% | 100% | 0% | 64% |
| PN | 100% | 100% | 100% | 0% | 0% | 100% | 0% | 53% |
| RPN | 100% | 98% | 100% | 3% | 0% | 98% | 0% | 28% |
| NP | 100% | 100% | 100% | 37% | 0% | 100% | 100% | 92% |


## Post-Backfill Question Metadata Verification

| Exam | Published Questions | Missing Blueprint | Missing Format | Missing Topic | Missing Body System | Missing Rationale | CAT Eligible |
| --- | --- | --- | --- | --- | --- | --- | --- |
| NCLEX-RN | 12902 | 0 | 0 | 3935 | 113 | 640 | 12262 |
| NCLEX-PN | 5143 | 0 | 0 | 2398 | 0 | 1 | 5142 |
| REx-PN | 2926 | 0 | 0 | 2106 | 0 | 0 | 2926 |
| CNPLE | 1496 | 0 | 0 | 199 | 0 | 0 | 1496 |
| NP | 2621 | 0 | 0 | 1509 | 0 | 0 | 2621 |
| FNP | 11717 | 0 | 0 | 1309 | 0 | 0 | 10057 |
| AGPCNP | 5000 | 0 | 0 | 0 | 0 | 0 | 4196 |
| PMHNP | 4000 | 0 | 0 | 0 | 0 | 0 | 4000 |
| WHNP | 4000 | 0 | 0 | 0 | 0 | 0 | 3338 |
| PNP-PC | 4000 | 0 | 0 | 0 | 0 | 0 | 3348 |
| NP-FNP | 160 | 0 | 0 | 0 | 0 | 0 | 160 |


## Remaining Blockers

| Pathway | Remaining Blockers |
| --- | --- |
| RN | Generate and publish 100 clinical cases; Add 52,150 strict pathway flashcards or adjust certification target to shared-pool cards; Publish 100 practice exams; Repair 640 missing rationales; Backfill 3935 missing topic tags; Backfill 113 missing body-system tags |
| PN | Generate and publish 50 clinical cases; Add 52,600 strict pathway flashcards or adjust certification target to shared-pool cards; Publish 100 practice exams; Repair 1 missing rationales; Backfill 2398 missing topic tags |
| RPN | Generate and publish 50 clinical cases; Add 50,706 strict pathway flashcards or adjust certification target to shared-pool cards; Publish 100 practice exams; Backfill 2106 missing topic tags |
| NP | Generate and publish 75 clinical cases; Add 46,194 strict pathway flashcards or adjust certification target to shared-pool cards; Backfill 3017 missing topic tags |


## Case Generation Decision

The requested 100 RN NGN cases, 50 RPN cases, 50 PN cases, and 75 NP advanced cases were not generated in this run. There is currently no verified source-backed case factory in the repository that can create 275 production clinical cases with 6-12 linked questions, Bowtie, Matrix, SATA, Trend, rationales, clinical pearls, duplicate checks, and publication-safe blueprint linkage without risking placeholder/generic content. The live inventory also shows zero priority-pathway clinical scenario rows, so the next implementation step should be a reviewed case factory/importer before publication.

## Required Next Implementation Step

Build a first-class nursing case factory that reads existing lessons/questions, creates draft clinical scenario rows, links each stage to blueprint domains and remediation targets, validates 6-12 linked questions per case, and keeps everything in DRAFT/IN_REVIEW until clinical review. After that, publish only reviewed cases and rerun this certification.
