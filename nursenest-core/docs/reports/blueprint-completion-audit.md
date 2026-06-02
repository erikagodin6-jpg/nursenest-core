# Blueprint Completion Audit

Generated: 2026-06-01T22:36:06.072Z

Scope: RN, PN, RPN, NP only. Allied remains maintenance mode.

## Evidence Status

The live database inventory was not audited because the database was unavailable in this environment.

Reason:  Invalid `db.examQuestion.findMany()` invocation in /root/nursenest-core/nursenest-core/scripts/audit-blueprint-coverage-gap-engine.mts:239:21 236 clinicalNursingScenario: { findMany: (args: unknown) => Promise<Array<Record<string, unknown>>> }; 237 }; 238 const [questions, lessons, flashcards, simulations] = await Promise.all([ → 239 db.examQuestion.findMany( Can't reach database server at `nursenestdatabase-do-user-35062022-0.g.db.ondigitalocean.com:25060` Please make sure your database server

Static fallback covers repository-authored RN catalogs, PN CNPLE expansion questions, and CNPLE NP LOFT case steps only.

This sprint report does not claim 100% blueprint completion because the live inventory could not be fully read. The existing production dashboard and fallback blueprint engine both show that the priority blocker is not raw content volume; it is mapping/tagging completeness, case/simulation depth, strict flashcard surface tagging, and practice-exam readiness.

## Priority Pathway Blueprint Status

| Pathway | Questions | Lessons | Flashcards | Cases | Blueprint Coverage | Readiness | Grade | P0 Blockers |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RN | 12902 | 1785 | 1991 | 0 | 0% | 76.4% | C | Blueprint coverage 0%; Cases 0/100; Flashcards +384 |
| PN | 5143 | 1052 | 1344 | 0 | 80% | 83.4% | B | Blueprint coverage 80%; Cases 0/50; Flashcards +81 |
| RPN | 2926 | 1041 | 1344 | 1 | 100% | 85.1% | B | Cases 1/50; Flashcards +81 |
| NP | 5619 | 8876 | 1756 | 0 | 100% | 84.6% | B | Cases 0/50; Flashcards +144 |


## Fallback Blueprint Engine Snapshot

| Exam | Coverage | Blueprint Compliance | Readiness | Monetization | Weakest Domains |
| --- | --- | --- | --- | --- | --- |
| NCLEX-RN | 1.3% | 68% | 34.6% | 0% | Pediatrics 0%; Maternal-Newborn 0%; Fundamentals & Health Promotion 0%; Leadership, Prioritization & Delegation 0.1%; Mental Health 0.1% |
| REx-PN | 11.3% | 59% | 35.1% | 0% | Pediatrics 0%; Fundamentals & Health Promotion 0%; Leadership, Prioritization & Delegation 0.1%; Mental Health 5.1%; Maternal-Newborn 8.2% |
| NCLEX-PN | 0% | 2% | 1% | 0% | Cardiovascular 0%; Pharmacology 0%; Respiratory 0%; Mental Health 0%; Safety & Infection Control 0% |
| CNPLE | 11% | 42% | 26.5% | 0% | Professional Practice 0%; Maternal, Pediatric & Lifespan 0%; Health Promotion 2.1%; Assessment & Diagnosis 7.6%; Clinical Management 7.8% |
| FNP | 0% | 1% | 0.5% | 0% | Clinical Management 0%; Assessment & Diagnosis 0%; Pharmacology & Prescribing 0%; Professional Practice 0%; Health Promotion 0% |
| AGPCNP | 0% | 1% | 0.5% | 0% | Clinical Management 0%; Assessment & Diagnosis 0%; Pharmacology & Prescribing 0%; Professional Practice 0%; Health Promotion 0% |
| PMHNP | 0% | 1% | 0.5% | 0% | Clinical Management 0%; Assessment & Diagnosis 0%; Pharmacology & Prescribing 0%; Professional Practice 0%; Health Promotion 0% |
| PNP-PC | 0% | 1% | 0.5% | 0% | Clinical Management 0%; Assessment & Diagnosis 0%; Pharmacology & Prescribing 0%; Professional Practice 0%; Health Promotion 0% |


## Mapping Completion Rules

- Lessons: require pathway, body system, canonical topic, blueprint domain, country/exam overlay, and remediation surface metadata.
- Questions: require exam, tier, body system, topic/subtopic, client-needs or NP blueprint domain, format, CAT eligibility, tutor readiness, rationale completeness.
- Flashcards: require pathway/tier/exam family, lesson or question source key, blueprint domain, card type, and learner remediation tags.
- Cases: require pathway, tier focus, canonical category, blueprint domain, NGN/clinical-reasoning item types, linked lesson/question remediation metadata.

## Required Deterministic Fixes Before Content Creation

1. Backfill RN blueprint tags from canonical lesson/question topic mappings. RN has high question and lesson volume but cached platform dashboard reports 0% blueprint coverage, which is a tagging defect until proven otherwise.
2. Backfill PN remaining blueprint domain tags. Cached dashboard reports PN at 80%, so at least one domain is unmapped or missing.
3. Verify RPN and NP 100% dashboard coverage with live item-level audit once DB connectivity returns.
4. Reject publication of any new case, card, lesson, or question unless blueprint tags are present at write time.
5. Add an orphan-content gate: no published nursing item may have null/empty blueprint metadata or no pathway association.

## Not Completed

Target state is 100% blueprint coverage with no untagged or orphaned content. This was not certified because the production DB was unreachable during this sprint run.
