# NP Question Enrichment Audit and Clinical Depth Expansion Report

Generated: 2026-05-31T21:19:35.617Z

The live `exam_questions` inventory was not audited because the database was unavailable in this environment.

Reason:  Invalid `prisma.examQuestion.findMany()` invocation in /root/nursenest-core/nursenest-core/scripts/audit-np-question-clinical-depth.mts:198:44 195 const limit = Math.max(1, Number.parseInt(process.env.NN_NP_QUESTION_DEPTH_AUDIT_LIMIT ?? "100000", 10)); 196 197 try { → 198 const rows = await prisma.examQuestion.findMany( Can't reach database server at `HOST:5432` Please make sure your database server is running at `HOST:5432`.

Static fallback covers CNPLE LOFT case-step questions only. It is not a substitute for the live NP question-bank audit.

Run against a reachable read-only staging or production database:

`npx tsx scripts/audit-np-question-clinical-depth.mts`

## NP Readiness Dashboard

- Total NP Questions: 53
- Diagnostic Reasoning Coverage: 54.7%
- Differential Diagnosis Coverage: 0%
- Prescribing Coverage: 47.2%
- Guideline-Based Management Coverage: 86.8%
- Follow-Up Planning Coverage: 67.9%
- Blueprint Coverage: 100%
- Publication Readiness: 0%
- Monetization Readiness: 0%

## Pathway Coverage

| Pathway | Total | Publication Ready | Monetization Ready | Average Depth Score |
| --- | --- | --- | --- | --- |
| CNPLE | 53 | 0 | 0 | 85 |
| FNP | 0 | 0 | 0 | 0 |
| AGPCNP | 0 | 0 | 0 | 0 |
| PMHNP | 0 | 0 | 0 | 0 |
| PNP-PC | 0 | 0 | 0 | 0 |
| WHNP | 0 | 0 | 0 | 0 |
| ENP | 0 | 0 | 0 | 0 |

## Weakest Items

| ID | Pathways | Depth Score | Publication Blocked | Depth Gaps |
| --- | --- | --- | --- | --- |
| cnple-sample-copd-001:step-0 | CNPLE | 65 | true | diagnostic_reasoning, differential_diagnosis, guideline_based_management, prescribing_relevance, follow_up_planning, diagnostic_explanation, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-oud-001:step-0 | CNPLE | 68 | true | diagnostic_reasoning, differential_diagnosis, prescribing_relevance, follow_up_planning, diagnostic_explanation, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-skin-001:step-0 | CNPLE | 68 | true | diagnostic_reasoning, differential_diagnosis, prescribing_relevance, follow_up_planning, diagnostic_explanation, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-peds-001:step-1 | CNPLE | 73 | true | diagnostic_reasoning, differential_diagnosis, prescribing_relevance, follow_up_planning, advanced_clinical_judgment, diagnostic_explanation, memory_anchor, flashcard_output |
| cnple-sample-pp-001:step-1 | CNPLE | 73 | true | diagnostic_reasoning, differential_diagnosis, guideline_based_management, prescribing_relevance, advanced_clinical_judgment, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-thyroid-001:step-0 | CNPLE | 75 | true | differential_diagnosis, prescribing_relevance, follow_up_planning, advanced_clinical_judgment, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-copd-001:step-2 | CNPLE | 75 | true | diagnostic_reasoning, differential_diagnosis, follow_up_planning, advanced_clinical_judgment, diagnostic_explanation, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-pp-001:step-0 | CNPLE | 75 | true | differential_diagnosis, prescribing_relevance, follow_up_planning, advanced_clinical_judgment, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-mh-001:step-1 | CNPLE | 78 | true | diagnostic_reasoning, differential_diagnosis, prescribing_relevance, diagnostic_explanation |
| cnple-sample-mh-001:step-2 | CNPLE | 78 | true | diagnostic_reasoning, differential_diagnosis, prescribing_relevance, diagnostic_explanation |
| cnple-sample-peds-001:step-2 | CNPLE | 78 | true | diagnostic_reasoning, differential_diagnosis, prescribing_relevance, diagnostic_explanation, memory_anchor, flashcard_output |
| cnple-sample-geri-001:step-1 | CNPLE | 78 | true | diagnostic_reasoning, differential_diagnosis, prescribing_relevance, diagnostic_explanation |
| cnple-sample-copd-001:step-3 | CNPLE | 78 | true | diagnostic_reasoning, differential_diagnosis, follow_up_planning, advanced_rationale, diagnostic_explanation, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-chf-001:step-2 | CNPLE | 80 | true | diagnostic_reasoning, differential_diagnosis, diagnostic_explanation |
| cnple-sample-prev-001:step-1 | CNPLE | 80 | true | differential_diagnosis, prescribing_relevance, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-skin-001:step-2 | CNPLE | 80 | true | diagnostic_reasoning, differential_diagnosis, diagnostic_explanation, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-peds-001:step-0 | CNPLE | 83 | true | diagnostic_reasoning, differential_diagnosis, prescribing_relevance, advanced_clinical_judgment, advanced_rationale, memory_anchor, flashcard_output |
| cnple-sample-oud-001:step-1 | CNPLE | 83 | true | differential_diagnosis, guideline_based_management, prescribing_relevance, follow_up_planning, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-cp-001:step-0 | CNPLE | 83 | true | differential_diagnosis, guideline_based_management, prescribing_relevance, follow_up_planning, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-prev-001:step-0 | CNPLE | 83 | true | diagnostic_reasoning, differential_diagnosis, guideline_based_management, prescribing_relevance, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-htn-001:step-0 | CNPLE | 85 | true | diagnostic_reasoning, differential_diagnosis, prescribing_relevance, memory_anchor, flashcard_output |
| cnple-sample-geri-001:step-2 | CNPLE | 85 | true | diagnostic_reasoning, differential_diagnosis, prescribing_relevance, diagnostic_explanation |
| cnple-sample-thyroid-001:step-1 | CNPLE | 85 | true | differential_diagnosis, prescribing_relevance, advanced_clinical_judgment, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-oud-001:step-2 | CNPLE | 85 | true | differential_diagnosis, prescribing_relevance, advanced_clinical_judgment, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-cp-001:step-1 | CNPLE | 85 | true | differential_diagnosis, prescribing_relevance, follow_up_planning, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-cp-001:step-2 | CNPLE | 85 | true | diagnostic_reasoning, differential_diagnosis, prescribing_relevance, diagnostic_explanation, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-prev-001:step-2 | CNPLE | 85 | true | differential_diagnosis, guideline_based_management, prescribing_relevance, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-skin-001:step-1 | CNPLE | 85 | true | differential_diagnosis, prescribing_relevance, follow_up_planning, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-dm-001:step-1 | CNPLE | 88 | true | differential_diagnosis, prescribing_relevance |
| cnple-sample-wh-001:step-0 | CNPLE | 88 | true | differential_diagnosis, follow_up_planning |
| cnple-sample-geri-001:step-0 | CNPLE | 88 | true | differential_diagnosis, prescribing_relevance |
| cnple-sample-chf-001:step-0 | CNPLE | 88 | true | diagnostic_reasoning, differential_diagnosis |
| cnple-sample-thyroid-001:step-2 | CNPLE | 88 | true | differential_diagnosis, advanced_clinical_judgment, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-copd-001:step-1 | CNPLE | 88 | true | differential_diagnosis, follow_up_planning, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-prenatal-htn-001:step-2 | CNPLE | 88 | true | diagnostic_reasoning, differential_diagnosis, diagnostic_explanation, memory_anchor, flashcard_output |
| cnple-sample-uti-stewardship-001:step-1 | CNPLE | 88 | true | differential_diagnosis, follow_up_planning, memory_anchor, flashcard_output |
| cnple-sample-uti-stewardship-001:step-2 | CNPLE | 88 | true | diagnostic_reasoning, differential_diagnosis, diagnostic_explanation, memory_anchor, flashcard_output |
| cnple-sample-htn-001:step-1 | CNPLE | 90 | true | differential_diagnosis, memory_anchor, flashcard_output |
| cnple-sample-dm-001:step-0 | CNPLE | 90 | true | differential_diagnosis |
| cnple-sample-dm-001:step-2 | CNPLE | 90 | true | differential_diagnosis, memory_anchor, flashcard_output |
| cnple-sample-ac-001:step-0 | CNPLE | 90 | true | differential_diagnosis |
| cnple-sample-chf-001:step-1 | CNPLE | 90 | true | differential_diagnosis, memory_anchor, flashcard_output |
| cnple-sample-wh-001:step-1 | CNPLE | 93 | true | diagnostic_reasoning, differential_diagnosis, prescribing_relevance, diagnostic_explanation, memory_anchor, flashcard_output |
| cnple-sample-htn-001:step-3 | CNPLE | 95 | true | differential_diagnosis, prescribing_relevance |
| cnple-sample-ac-001:step-1 | CNPLE | 95 | true | differential_diagnosis, advanced_clinical_judgment |
| cnple-sample-mh-001:step-0 | CNPLE | 95 | true | diagnostic_reasoning, differential_diagnosis |
| cnple-sample-wh-001:step-2 | CNPLE | 95 | true | diagnostic_reasoning, differential_diagnosis, diagnostic_explanation, memory_anchor, flashcard_output |
| cnple-sample-pp-001:step-2 | CNPLE | 95 | true | differential_diagnosis, follow_up_planning, clinical_pearl, memory_anchor, flashcard_output |
| cnple-sample-prenatal-htn-001:step-0 | CNPLE | 95 | true | differential_diagnosis, guideline_based_management |
| cnple-sample-uti-stewardship-001:step-0 | CNPLE | 95 | true | differential_diagnosis, follow_up_planning, memory_anchor, flashcard_output |

## Remediation Plan

- Block NP questions that are RN-level recognition items without diagnosis, differential, management, and follow-up reasoning.
- Expand weak items with diagnostic explanation, differential diagnosis, guideline-based management, prescribing relevance, and monitoring plans.
- Prioritize prescribing-safety and diagnostic-reasoning gaps before flashcard-only cleanup.
- Promote NP items only after advanced rationale, blueprint mapping, flashcard output, adaptive readiness, and monetization readiness all pass.

## Remediation Safety

Generated NP expansion drafts are non-publishable authoring scaffolds. They must pass advanced-practice clinical review, blueprint review, prescribing-safety review, and educational review before publication.
