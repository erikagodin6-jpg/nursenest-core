# RN Question Enrichment Audit and Remediation Report

Generated: 2026-05-31T21:15:21.015Z

The live `exam_questions` inventory was not audited because the database was unavailable in this environment.

Reason:  Invalid `prisma.examQuestion.findMany()` invocation in /root/nursenest-core/nursenest-core/scripts/audit-rn-question-enrichment.mts:274:44 271 const limit = Math.max(1, Number.parseInt(process.env.NN_RN_QUESTION_ENRICHMENT_AUDIT_LIMIT ?? "100000", 10)); 272 273 try { → 274 const rows = await prisma.examQuestion.findMany( Can't reach database server at `HOST:5432` Please make sure your database server is running at `HOST:5432`.

## Static Repository RN Audit Fallback

- Static RN Questions Audited: 62
- Missing Rationales: 32
- Missing Hints: 0
- Missing Pearls: 0
- Missing Distractor Rationales: 62
- Missing Memory Anchors: 62
- Missing Metadata: 0
- Missing Blueprint Mapping: 10
- Missing Flashcard Generation: 62
- CAT Eligible: 52
- Adaptive Eligible: 0
- Publication Readiness %: 0
- Monetization Readiness %: 0

## Static Scope Counts

| Scope | Questions |
| --- | --- |
| NCLEX_RN_US | 62 |
| NCLEX_RN_CANADA | 0 |
| NEW_GRAD_RN | 0 |
| ECG_RN_CONTENT | 2 |
| LAB_INTERPRETATION_RN_CONTENT | 6 |
| CLINICAL_SKILLS_RN_CONTENT | 3 |

## Remediation Plan

- Block all RN questions missing rationale, distractor rationale, hint, clinical pearl, memory anchor, blueprint mapping, flashcard output, CAT eligibility, or adaptive eligibility.
- Generate non-publishable remediation drafts for missing components and route them to clinical and educational review.
- Prioritize questions missing correct rationales or distractor rationales before metadata-only cleanup.
- Promote reviewed questions only after flashcard, practice exam, CAT, and adaptive-learning readiness all pass.

This fallback covers repository-authored static RN catalogs only. It is not a substitute for the live `exam_questions` database audit.

Run against a reachable read-only staging or production database:

`npx tsx scripts/audit-rn-question-enrichment.mts`

The RN enrichment engine and contract tests remain available without database access.
