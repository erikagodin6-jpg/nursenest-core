# Global Blueprint Gap Closure and Content Prioritization Report

Generated: 2026-05-31T21:37:37.871Z

The live database inventory was not audited because the database was unavailable in this environment.

Reason:  Invalid `db.examQuestion.findMany()` invocation in /root/nursenest-core/nursenest-core/scripts/audit-blueprint-coverage-gap-engine.mts:239:21 236 clinicalNursingScenario: { findMany: (args: unknown) => Promise<Array<Record<string, unknown>>> }; 237 }; 238 const [questions, lessons, flashcards, simulations] = await Promise.all([ → 239 db.examQuestion.findMany( Can't reach database server at `HOST:5432` Please make sure your database server is running at `HOST:5432`.

Static fallback covers repository-authored RN catalogs, PN CNPLE expansion questions, and CNPLE NP LOFT case steps only.

## Executive Summary

- Source Coverage: 2.4%
- Source Readiness: 10%
- Source Publication Readiness: 0%
- Source Monetization Readiness: 0%
- Source Adaptive Readiness: 30%
- Prioritized Gap Rows: 84
- Content ROI Backlog Rows: 84
- Reuse-first backlog items: 14
- Overlay-first backlog items: 32
- New-content gate items: 38

## Monetization Dashboard

| Pathway Family | Readiness |
| --- | --- |
| RN | 34.6% |
| PN | 18.1% |
| NP | 4.2% |
| UK | 0% |
| Australia | 0% |
| New Zealand | 0% |
| International | 0% |

## Gap Dashboard

| Exam | Domain | Priority | Score | Reuse Layer | Generation Rule | Rationale |
| --- | --- | --- | --- | --- | --- | --- |
| FNP | Pharmacology & Prescribing | critical | 98 | Global Core | generation_justified_after_reuse_check | Pharmacology & Prescribing has 0% coverage for FNP, 18% blueprint weight, and 94/100 clinical-risk priority. Reuse check points to Global Core. |
| FNP | Assessment & Diagnosis | critical | 97 | Global Core | generation_justified_after_reuse_check | Assessment & Diagnosis has 0% coverage for FNP, 22% blueprint weight, and 92/100 clinical-risk priority. Reuse check points to Global Core. |
| AGPCNP | Pharmacology & Prescribing | critical | 97 | Global Core | generation_justified_after_reuse_check | Pharmacology & Prescribing has 0% coverage for AGPCNP, 18% blueprint weight, and 94/100 clinical-risk priority. Reuse check points to Global Core. |
| PMHNP | Pharmacology & Prescribing | critical | 97 | Global Core | generation_justified_after_reuse_check | Pharmacology & Prescribing has 0% coverage for PMHNP, 18% blueprint weight, and 94/100 clinical-risk priority. Reuse check points to Global Core. |
| PNP-PC | Pharmacology & Prescribing | critical | 97 | Global Core | generation_justified_after_reuse_check | Pharmacology & Prescribing has 0% coverage for PNP-PC, 18% blueprint weight, and 94/100 clinical-risk priority. Reuse check points to Global Core. |
| WHNP | Pharmacology & Prescribing | critical | 97 | Global Core | generation_justified_after_reuse_check | Pharmacology & Prescribing has 0% coverage for WHNP, 18% blueprint weight, and 94/100 clinical-risk priority. Reuse check points to Global Core. |
| ENP | Pharmacology & Prescribing | critical | 97 | Global Core | generation_justified_after_reuse_check | Pharmacology & Prescribing has 0% coverage for ENP, 18% blueprint weight, and 94/100 clinical-risk priority. Reuse check points to Global Core. |
| FNP | Clinical Management | critical | 96 | Exam Overlay | generate_missing_overlay_only | Clinical Management has 0% coverage for FNP, 24% blueprint weight, and 92/100 clinical-risk priority. Reuse check points to Exam Overlay. |
| AGPCNP | Assessment & Diagnosis | critical | 96 | Global Core | generation_justified_after_reuse_check | Assessment & Diagnosis has 0% coverage for AGPCNP, 22% blueprint weight, and 92/100 clinical-risk priority. Reuse check points to Global Core. |
| PMHNP | Assessment & Diagnosis | critical | 96 | Global Core | generation_justified_after_reuse_check | Assessment & Diagnosis has 0% coverage for PMHNP, 22% blueprint weight, and 92/100 clinical-risk priority. Reuse check points to Global Core. |
| PNP-PC | Assessment & Diagnosis | critical | 96 | Global Core | generation_justified_after_reuse_check | Assessment & Diagnosis has 0% coverage for PNP-PC, 22% blueprint weight, and 92/100 clinical-risk priority. Reuse check points to Global Core. |
| WHNP | Assessment & Diagnosis | critical | 96 | Global Core | generation_justified_after_reuse_check | Assessment & Diagnosis has 0% coverage for WHNP, 22% blueprint weight, and 92/100 clinical-risk priority. Reuse check points to Global Core. |
| ENP | Assessment & Diagnosis | critical | 96 | Global Core | generation_justified_after_reuse_check | Assessment & Diagnosis has 0% coverage for ENP, 22% blueprint weight, and 92/100 clinical-risk priority. Reuse check points to Global Core. |
| AGPCNP | Clinical Management | critical | 95 | Exam Overlay | generate_missing_overlay_only | Clinical Management has 0% coverage for AGPCNP, 24% blueprint weight, and 92/100 clinical-risk priority. Reuse check points to Exam Overlay. |
| PMHNP | Clinical Management | critical | 95 | Exam Overlay | generate_missing_overlay_only | Clinical Management has 0% coverage for PMHNP, 24% blueprint weight, and 92/100 clinical-risk priority. Reuse check points to Exam Overlay. |
| PNP-PC | Clinical Management | critical | 95 | Exam Overlay | generate_missing_overlay_only | Clinical Management has 0% coverage for PNP-PC, 24% blueprint weight, and 92/100 clinical-risk priority. Reuse check points to Exam Overlay. |
| WHNP | Clinical Management | critical | 95 | Exam Overlay | generate_missing_overlay_only | Clinical Management has 0% coverage for WHNP, 24% blueprint weight, and 92/100 clinical-risk priority. Reuse check points to Exam Overlay. |
| ENP | Clinical Management | critical | 95 | Exam Overlay | generate_missing_overlay_only | Clinical Management has 0% coverage for ENP, 24% blueprint weight, and 92/100 clinical-risk priority. Reuse check points to Exam Overlay. |
| NCLEX-PN | Cardiovascular | critical | 94 | Global Core | generation_justified_after_reuse_check | Cardiovascular has 0% coverage for NCLEX-PN, 15% blueprint weight, and 86/100 clinical-risk priority. Reuse check points to Global Core. |
| NCLEX-PN | Pharmacology | critical | 94 | Global Core | generation_justified_after_reuse_check | Pharmacology has 0% coverage for NCLEX-PN, 14% blueprint weight, and 94/100 clinical-risk priority. Reuse check points to Global Core. |
| NCLEX-PN | Respiratory | critical | 91 | Global Core | generation_justified_after_reuse_check | Respiratory has 0% coverage for NCLEX-PN, 13% blueprint weight, and 86/100 clinical-risk priority. Reuse check points to Global Core. |
| NCLEX-PN | Safety & Infection Control | critical | 91 | Global Core | generation_justified_after_reuse_check | Safety & Infection Control has 0% coverage for NCLEX-PN, 12% blueprint weight, and 95/100 clinical-risk priority. Reuse check points to Global Core. |
| FNP | Professional Practice | critical | 91 | Exam Overlay | generate_missing_overlay_only | Professional Practice has 0% coverage for FNP, 12% blueprint weight, and 95/100 clinical-risk priority. Reuse check points to Exam Overlay. |
| NCLEX-RN | Pharmacology | critical | 90 | Global Core | reuse_before_generation | Pharmacology has 0.1% coverage for NCLEX-RN, 14% blueprint weight, and 94/100 clinical-risk priority. Reuse check points to Global Core. |
| NCLEX-PN | Mental Health | critical | 90 | Global Core | generation_justified_after_reuse_check | Mental Health has 0% coverage for NCLEX-PN, 12% blueprint weight, and 86/100 clinical-risk priority. Reuse check points to Global Core. |
| AGPCNP | Professional Practice | critical | 90 | Exam Overlay | generate_missing_overlay_only | Professional Practice has 0% coverage for AGPCNP, 12% blueprint weight, and 95/100 clinical-risk priority. Reuse check points to Exam Overlay. |
| PMHNP | Professional Practice | critical | 90 | Exam Overlay | generate_missing_overlay_only | Professional Practice has 0% coverage for PMHNP, 12% blueprint weight, and 95/100 clinical-risk priority. Reuse check points to Exam Overlay. |
| PNP-PC | Professional Practice | critical | 90 | Exam Overlay | generate_missing_overlay_only | Professional Practice has 0% coverage for PNP-PC, 12% blueprint weight, and 95/100 clinical-risk priority. Reuse check points to Exam Overlay. |
| WHNP | Professional Practice | critical | 90 | Exam Overlay | generate_missing_overlay_only | Professional Practice has 0% coverage for WHNP, 12% blueprint weight, and 95/100 clinical-risk priority. Reuse check points to Exam Overlay. |
| ENP | Professional Practice | critical | 90 | Exam Overlay | generate_missing_overlay_only | Professional Practice has 0% coverage for ENP, 12% blueprint weight, and 95/100 clinical-risk priority. Reuse check points to Exam Overlay. |
| NMC CBT | NEWS2 and Deterioration | critical | 90 | Country Overlay | generate_missing_overlay_only | NEWS2 and Deterioration is a hidden international pathway requirement and should be built as a Country Overlay after recovery and reuse classification. |
| NCLEX-RN | Cardiovascular | critical | 89 | Global Core | reuse_before_generation | Cardiovascular has 4.2% coverage for NCLEX-RN, 15% blueprint weight, and 86/100 clinical-risk priority. Reuse check points to Global Core. |
| CNPLE | Assessment & Diagnosis | critical | 89 | Global Core | reuse_before_generation | Assessment & Diagnosis has 7.6% coverage for CNPLE, 22% blueprint weight, and 92/100 clinical-risk priority. Reuse check points to Global Core. |
| NMBA RN | Aboriginal and Torres Strait Islander Health | critical | 89 | Country Overlay | generate_missing_overlay_only | Aboriginal and Torres Strait Islander Health is a hidden international pathway requirement and should be built as a Country Overlay after recovery and reuse classification. |
| NCNZ RN | Te Tiriti o Waitangi | critical | 89 | Country Overlay | generate_missing_overlay_only | Te Tiriti o Waitangi is a hidden international pathway requirement and should be built as a Country Overlay after recovery and reuse classification. |
| NCNZ RN | Cultural Safety | critical | 89 | Country Overlay | generate_missing_overlay_only | Cultural Safety is a hidden international pathway requirement and should be built as a Country Overlay after recovery and reuse classification. |
| CNPLE | Clinical Management | critical | 88 | Exam Overlay | generate_missing_overlay_only | Clinical Management has 7.8% coverage for CNPLE, 24% blueprint weight, and 92/100 clinical-risk priority. Reuse check points to Exam Overlay. |
| NCLEX-RN | Respiratory | critical | 87 | Global Core | reuse_before_generation | Respiratory has 0.2% coverage for NCLEX-RN, 13% blueprint weight, and 86/100 clinical-risk priority. Reuse check points to Global Core. |
| NMC CBT | Safeguarding Adults and Children | critical | 87 | Country Overlay | generate_missing_overlay_only | Safeguarding Adults and Children is a hidden international pathway requirement and should be built as a Country Overlay after recovery and reuse classification. |
| NCLEX-RN | Mental Health | critical | 86 | Global Core | reuse_before_generation | Mental Health has 0.1% coverage for NCLEX-RN, 12% blueprint weight, and 86/100 clinical-risk priority. Reuse check points to Global Core. |

## Content ROI Dashboard

| Rank | Priority | Exam | Domain | Lessons | Questions | Flashcards | Simulations | NGN Cases | ROI | Effort Hours | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | critical | FNP | Pharmacology & Prescribing | 54 | 450 | 1440 | 9 | 18 | 95 | 597 | create_new_content_after_gate |
| 2 | critical | FNP | Assessment & Diagnosis | 66 | 550 | 1760 | 11 | 22 | 94 | 729 | create_new_content_after_gate |
| 3 | critical | AGPCNP | Pharmacology & Prescribing | 54 | 450 | 1440 | 9 | 18 | 93 | 597 | create_new_content_after_gate |
| 4 | critical | PMHNP | Pharmacology & Prescribing | 54 | 450 | 1440 | 9 | 18 | 93 | 597 | create_new_content_after_gate |
| 5 | critical | PNP-PC | Pharmacology & Prescribing | 54 | 450 | 1440 | 9 | 18 | 93 | 597 | create_new_content_after_gate |
| 6 | critical | WHNP | Pharmacology & Prescribing | 54 | 450 | 1440 | 9 | 18 | 93 | 597 | create_new_content_after_gate |
| 7 | critical | ENP | Pharmacology & Prescribing | 54 | 450 | 1440 | 9 | 18 | 93 | 597 | create_new_content_after_gate |
| 8 | critical | FNP | Clinical Management | 72 | 600 | 1920 | 12 | 24 | 91 | 796 | build_overlay |
| 9 | critical | AGPCNP | Assessment & Diagnosis | 66 | 550 | 1760 | 11 | 22 | 91 | 729 | create_new_content_after_gate |
| 10 | critical | PMHNP | Assessment & Diagnosis | 66 | 550 | 1760 | 11 | 22 | 91 | 729 | create_new_content_after_gate |
| 11 | critical | PNP-PC | Assessment & Diagnosis | 66 | 550 | 1760 | 11 | 22 | 91 | 729 | create_new_content_after_gate |
| 12 | critical | WHNP | Assessment & Diagnosis | 66 | 550 | 1760 | 11 | 22 | 91 | 729 | create_new_content_after_gate |
| 13 | critical | ENP | Assessment & Diagnosis | 66 | 550 | 1760 | 11 | 22 | 91 | 729 | create_new_content_after_gate |
| 14 | critical | NCLEX-PN | Cardiovascular | 38 | 750 | 1200 | 8 | 15 | 90 | 613 | create_new_content_after_gate |
| 15 | critical | NCLEX-PN | Pharmacology | 35 | 701 | 1120 | 8 | 15 | 90 | 580 | create_new_content_after_gate |
| 16 | critical | NCLEX-RN | Pharmacology | 43 | 1393 | 2100 | 8 | 15 | 90 | 925 | reuse_existing_core |
| 17 | critical | AGPCNP | Clinical Management | 72 | 600 | 1920 | 12 | 24 | 88 | 796 | build_overlay |
| 18 | critical | PMHNP | Clinical Management | 72 | 600 | 1920 | 12 | 24 | 88 | 796 | build_overlay |
| 19 | critical | PNP-PC | Clinical Management | 72 | 600 | 1920 | 12 | 24 | 88 | 796 | build_overlay |
| 20 | critical | WHNP | Clinical Management | 72 | 600 | 1920 | 12 | 24 | 88 | 796 | build_overlay |
| 21 | critical | ENP | Clinical Management | 72 | 600 | 1920 | 12 | 24 | 88 | 796 | build_overlay |
| 22 | critical | FNP | Professional Practice | 36 | 300 | 960 | 6 | 12 | 88 | 398 | build_overlay |
| 23 | critical | NCLEX-RN | Cardiovascular | 45 | 1482 | 2250 | 8 | 12 | 88 | 962 | reuse_existing_core |
| 24 | critical | CNPLE | Assessment & Diagnosis | 66 | 542 | 1760 | 11 | 14 | 88 | 695 | reuse_existing_core |
| 25 | critical | NCLEX-PN | Respiratory | 33 | 650 | 1040 | 7 | 13 | 87 | 532 | create_new_content_after_gate |
| 26 | critical | NCLEX-PN | Mental Health | 30 | 600 | 960 | 6 | 12 | 87 | 485 | create_new_content_after_gate |
| 27 | critical | NCLEX-RN | Respiratory | 39 | 1284 | 1950 | 7 | 13 | 87 | 844 | reuse_existing_core |
| 28 | critical | NCLEX-PN | Safety & Infection Control | 30 | 600 | 960 | 6 | 12 | 86 | 485 | create_new_content_after_gate |
| 29 | critical | CNPLE | Clinical Management | 72 | 591 | 1920 | 12 | 15 | 86 | 756 | build_overlay |
| 30 | critical | NCLEX-RN | Mental Health | 36 | 1194 | 1800 | 6 | 12 | 86 | 778 | reuse_existing_core |
| 31 | high | CNPLE | Pharmacology & Prescribing | 54 | 421 | 1440 | 9 | 8 | 86 | 547 | reuse_existing_core |
| 32 | critical | AGPCNP | Professional Practice | 36 | 300 | 960 | 6 | 12 | 85 | 398 | build_overlay |
| 33 | critical | PMHNP | Professional Practice | 36 | 300 | 960 | 6 | 12 | 85 | 398 | build_overlay |
| 34 | critical | PNP-PC | Professional Practice | 36 | 300 | 960 | 6 | 12 | 85 | 398 | build_overlay |
| 35 | critical | WHNP | Professional Practice | 36 | 300 | 960 | 6 | 12 | 85 | 398 | build_overlay |
| 36 | critical | ENP | Professional Practice | 36 | 300 | 960 | 6 | 12 | 85 | 398 | build_overlay |
| 37 | high | FNP | Mental Health | 24 | 200 | 640 | 4 | 8 | 85 | 265 | create_new_content_after_gate |
| 38 | critical | NMC CBT | NEWS2 and Deterioration | 20 | 150 | 250 | 6 | 6 | 84 | 217 | build_overlay |
| 39 | critical | CNPLE | Professional Practice | 36 | 300 | 960 | 6 | 12 | 84 | 398 | build_overlay |
| 40 | critical | REx-PN | Pharmacology | 35 | 689 | 1120 | 8 | 6 | 84 | 540 | reuse_existing_core |

## Reuse Dashboard

Global core topics available for reuse checks: Heart Failure, COPD, Sepsis, Shock, ECG, ABGs, Labs, Pharmacology, Clinical Assessment.

Before any item in the backlog is generated, the platform must prove that Global Core -> Role Overlay -> Country Overlay -> Exam Overlay -> Language Overlay inheritance is insufficient.

## International Readiness Dashboard

| Market | Readiness | Required Next Action |
| --- | --- | --- |
| United Kingdom | 0% | recover_classify_reuse_then_generate |
| Australia | 0% | recover_classify_reuse_then_generate |
| New Zealand | 0% | recover_classify_reuse_then_generate |

## Governance Rule

No content should be generated unless it has a measurable blueprint gap, business value, adaptive-learning value, and a documented reuse-first evaluation.
