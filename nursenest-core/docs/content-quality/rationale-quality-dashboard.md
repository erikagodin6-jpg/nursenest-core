# Rationale Quality Dashboard

Generated: 2026-05-31T04:42:06.484Z

This dashboard is a static source audit of rationale-like fields found in NurseNest content and learning modules. It uses the V2 rationale scoring engine as a governance signal; it does not replace clinical review.

## Executive Summary

- Items scored: 645
- Average score: 26
- Fail (<70): 645
- Review (70-84): 0
- Publish eligible (85-94): 0
- Flagship (95+): 0

## Pathway And Module Summary

| Pool | Items | Average Score | Fail | Review | Publish Eligible | Flagship |
| --- | --- | --- | --- | --- | --- | --- |
| Other | 2 | 1 | 2 | 0 | 0 | 0 |
| Labs | 27 | 11 | 27 | 0 | 0 | 0 |
| Clinical Skills | 86 | 22 | 86 | 0 | 0 | 0 |
| ECG | 331 | 24 | 331 | 0 | 0 | 0 |
| Pharmacology | 11 | 28 | 11 | 0 | 0 | 0 |
| RPN/PN | 3 | 31 | 3 | 0 | 0 | 0 |
| RN | 104 | 33 | 104 | 0 | 0 | 0 |
| NP | 81 | 35 | 81 | 0 | 0 | 0 |

## Lowest-Quality Pools

| Pool | Average Score | Lowest Source |
| --- | --- | --- |
| Other | 1 | src/lib/practice-tests/cat-question-type-hardening.contract.test.ts:48 |
| Labs | 11 | src/lib/labs/labs-engine.ts:286 |
| Clinical Skills | 22 | src/lib/clinical-skills/clinical-skills-enrichment.ts:93 |
| ECG | 24 | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:68 |
| Pharmacology | 28 | src/content/questions/nclex-tier1-foundational-questions.ts:1175 |
| RPN/PN | 31 | src/lib/ecg-module/ecg-simulation-expansions.ts:825 |
| RN | 33 | src/content/questions/nclex-tier1-foundational-questions.ts:307 |
| NP | 35 | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:400 |

## Highest-Quality Pools

| Pool | Average Score | Representative Source |
| --- | --- | --- |
| NP | 35 | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:976 |
| RN | 33 | src/content/questions/nclex-tier3-advanced-review-questions.ts:531 |
| RPN/PN | 31 | src/lib/ecg-module/ecg-simulation-expansions.ts:825 |
| Pharmacology | 28 | src/content/questions/nclex-tier3-advanced-review-questions.ts:574 |
| ECG | 24 | src/lib/ecg-module/ecg-simulation-catalog.ts:269 |
| Clinical Skills | 22 | src/content/questions/nclex-tier2-clinical-judgment-questions.ts:346 |
| Labs | 11 | src/content/questions/nclex-tier2-clinical-judgment-questions.ts:336 |
| Other | 1 | src/lib/practice-tests/cat-question-type-hardening.contract.test.ts:48 |

## Rewrite Backlog

| Score | Gate | Pool | Field | Source | Top Recommendation |
| --- | --- | --- | --- | --- | --- |
| 1 | Fail | Clinical Skills | rationale | src/lib/clinical-skills/clinical-skills-enrichment.ts:93 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | Clinical Skills | rationale | src/lib/clinical-skills/clinical-skills-enrichment.ts:163 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | Clinical Skills | rationale | src/lib/clinical-skills/clinical-skills-enrichment.ts:219 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | Clinical Skills | rationale | src/lib/clinical-skills/clinical-skills-enrichment.ts:234 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | Clinical Skills | rationale | src/lib/clinical-skills/clinical-skills-enrichment.ts:275 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | Clinical Skills | rationale | src/lib/clinical-skills/clinical-skills-enrichment.ts:289 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | Clinical Skills | rationale | src/lib/clinical-skills/clinical-skills-enrichment.ts:399 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | Clinical Skills | rationale | src/lib/clinical-skills/clinical-skills-enrichment.ts:509 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | Clinical Skills | rationale | src/lib/clinical-skills/clinical-skills-enrichment.ts:523 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | Clinical Skills | rationale | src/lib/clinical-skills/clinical-skills-enrichment.ts:531 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | Clinical Skills | rationale | src/lib/clinical-skills/clinical-skills-enrichment.ts:677 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | Clinical Skills | rationale | src/lib/clinical-skills/clinical-skills-checkpoints.ts:420 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | Clinical Skills | rationale | src/lib/clinical-skills/clinical-skills-checkpoints.ts:727 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:68 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:69 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:70 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:71 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:72 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | rationale | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:115 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:131 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:132 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:133 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:134 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | rationale | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:173 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:189 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:190 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:191 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:192 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:193 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | rationale | src/lib/ecg-module/ecg-premium-lesson-blueprint.ts:233 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | rationale | src/lib/ecg-module/ecg-premium-curated-pack.ts:932 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-pediatric-rsa-unit.ts:430 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-pediatric-rsa-unit.ts:494 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | teachingPoint | src/lib/ecg-module/ecg-pediatric-rsa-unit.ts:514 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | rationale | src/lib/ecg-module/ecg-pediatric-questions-seed.ts:341 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | Pharmacology | safetyPrinciple | src/content/questions/nclex-tier1-foundational-questions.ts:1175 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | Pharmacology | prioritization | src/content/questions/nclex-tier1-foundational-questions.ts:1176 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | Pharmacology | teachingPoint | src/content/questions/nclex-tier1-foundational-questions.ts:1189 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | NP | prioritizationLogic | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:400 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | NP | rationale | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:469 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | rationale | src/lib/ecg-module/ecg-clinical-reasoning-registry.ts:242 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | rationale | src/lib/ecg-module/ecg-clinical-reasoning-registry.ts:247 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | rationale | src/lib/ecg-module/ecg-clinical-reasoning-registry.ts:407 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | rationale | src/lib/ecg-module/ecg-clinical-reasoning-registry.ts:412 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | rationale | src/lib/ecg-module/ecg-clinical-reasoning-registry.ts:929 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | rationale | src/lib/ecg-module/ecg-clinical-reasoning-registry.ts:934 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | rationale | src/lib/ecg-module/ecg-clinical-reasoning-registry.ts:939 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | rationale | src/lib/ecg-module/ecg-clinical-reasoning-registry.ts:1096 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | rationale | src/lib/ecg-module/ecg-clinical-reasoning-registry.ts:1101 | Expand rationale depth to at least 120 words of meaningful teaching. |
| 1 | Fail | ECG | rationale | src/lib/ecg-module/ecg-clinical-reasoning-registry.ts:1255 | Expand rationale depth to at least 120 words of meaningful teaching. |

## Publish Gate Policy

| Score | Gate | Action |
| --- | --- | --- |
| <70 | Fail | Do not publish. Rewrite required. |
| 70-84 | Review | Human review and enrichment required. |
| 85-94 | Publish Eligible | Can publish after clinical review. |
| 95+ | Flagship | Premium exemplar. |
