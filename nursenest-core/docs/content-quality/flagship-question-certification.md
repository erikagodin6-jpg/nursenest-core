# Flagship Question Certification Program

Date: 2026-06-01
Status: Certification standard and current repository-evidenced baseline

Source of truth: `src/lib/questions/question-quality-score.ts`

This is a governance and reporting document only. It creates no public routes, navigation, learner-facing UI, sitemap entries, or publication changes.

## Purpose

The Flagship Question Certification Program identifies the top 5% of NurseNest questions. A flagship question is not merely complete. It must teach clinical judgment, reveal learner thinking through strong distractors, provide high-value remediation, and map directly to readiness domains.

Flagship questions should become the platform's gold-standard examples for:

- Premium question-bank calibration
- Clinical judgment instruction
- Faculty and institutional demonstrations
- CAT and practice-exam anchor items
- Editorial training examples
- Future marketing screenshots only after clinical and product approval

## Certification Requirements

A question may be certified only when all requirements below are met.

| Requirement | Minimum |
| --- | ---: |
| Overall Question Quality V2 score | 95 |
| Clinical Accuracy | 95 |
| Reasoning Quality | 95 |
| Distractor Quality | 95 |
| Rationale Quality | 95 |
| Hint Quality | 95 |
| Clinical Pearl Quality | 95 |
| Distractor Intelligence | 95 |
| Remediation Value | 90 |
| Readiness Integration | 90 |

## Required Evidence

Every certified question must include:

- Clinical realism with a patient-specific scenario
- Competing priorities or clinically meaningful decision pressure
- Strong distractors that are plausible and misconception-based
- High-quality rationale explaining why correct and why incorrect
- High-quality non-revealing hint
- Clinical pearl that transfers beyond the item
- Readiness mapping
- Remediation mapping
- Related lessons, flashcards, simulations, or specialty assets where applicable

## Automatic Exclusions

Do not certify a question when any of the following are present:

- Any warning, error, or critical issue in `scoreQuestionQuality`
- Answer-revealing hint
- Generic rationale
- Weak or obvious distractors
- Missing misconception mapping
- Missing safety risk analysis
- Missing remediation mapping
- Missing readiness-domain mapping
- Missing clinical pearl
- Unresolved high-risk clinical review
- Duplicate or near-duplicate item

## Current Repository-Evidenced Baseline

Audit scope: static repository-authored question banks that can be scored locally.

DB-backed live `exam_questions` pools were not queried for this baseline.

| Source | Questions Scored | Average V2 Score | Certified Flagship |
| --- | ---: | ---: | ---: |
| `nclex-tier1-foundational-questions.ts` | 27 | 81.0 | 0 |
| `nclex-tier2-clinical-judgment-questions.ts` | 16 | 87.8 | 0 |
| `nclex-tier3-advanced-review-questions.ts` | 19 | 91.1 | 0 |
| `cnple-practical-nursing-ngn-expansion.ts` | 75 | 81.3 | 0 |
| `allied-pharmacy-technician.ts` | 13 | 62.5 | 0 |
| `pre-nursing-question-bank.ts` | 80 | 54.1 | 0 |
| **Total** | **230** | **72.0 weighted average** | **0** |

## Current Flagship Count

| Metric | Count |
| --- | ---: |
| Total static questions scored | 230 |
| Target flagship count, top 5% | 12 |
| Current certified flagship count | 0 |
| Certification gap | 12 |
| Current certified percentage | 0% |
| Target certified percentage | 5% |

## Dimension Gap Analysis

| Required Dimension | Average Score | Questions Below 95 | Gap Meaning |
| --- | ---: | ---: | --- |
| Clinical Accuracy | 96.2 | 72 | Most items are clinically adequate, but some lack enough clinical cue integrity for flagship certification. |
| Reasoning Quality | 71.5 | 171 | Many items need deeper cue interpretation, patient-safety reasoning, or explicit clinical judgment logic. |
| Distractor Quality | 74.9 | 153 | Wrong-answer explanations often need stronger misconception, consequence, and clinical trap framing. |
| Rationale Quality | 76.5 | 195 | Most items require richer why-correct, why-incorrect, safety, and bedside application teaching. |
| Hint Quality | 39.0 | 215 | Hints are the largest certification blocker; many are missing, generic, or too revealing under the Hint Quality Enforcement System. |
| Clinical Pearl Quality | 72.7 | 192 | Pearls need to become more memorable, clinically transferable, and practice-ready. |

## Nearest Certification Candidates

These items had the highest current V2 scores but still failed certification because at least one required dimension was below 95 or the gate was not `flagship_ready`.

| Question ID | Source | Score | Gate | Topic | Lowest Required Dimension |
| --- | --- | ---: | --- | --- | ---: |
| `nclex-tier3-01-ventilated-high-pressure-alarm` | `nclex-tier3-advanced-review-questions.ts` | 95 | publish_eligible | Ventilated patient deterioration | 60 |
| `nclex-tier2-14-sodium-confusion` | `nclex-tier2-clinical-judgment-questions.ts` | 94 | publish_eligible | Fluid and electrolyte imbalance | 80 |
| `nclex-tier2-16-priority-four-clients` | `nclex-tier2-clinical-judgment-questions.ts` | 94 | publish_eligible | Prioritization | 88 |
| `nclex-tier3-04-wide-complex-tachycardia-unstable` | `nclex-tier3-advanced-review-questions.ts` | 94 | publish_eligible | Telemetry deterioration | 70 |
| `nclex-tier3-06-increased-icp-cushing-cues` | `nclex-tier3-advanced-review-questions.ts` | 94 | publish_eligible | Increased intracranial pressure | 60 |
| `nclex-tier3-10-complex-icu-delegation` | `nclex-tier3-advanced-review-questions.ts` | 94 | publish_eligible | High-acuity assignment safety | 55 |
| `nclex-tier3-02-septic-shock-progression` | `nclex-tier3-advanced-review-questions.ts` | 93 | publish_eligible | Sepsis progression | 40 |
| `nclex-tier3-05-postop-hemorrhage-abdominal` | `nclex-tier3-advanced-review-questions.ts` | 93 | publish_eligible | Postoperative hemorrhage | 60 |
| `nclex-tier3-08-ards-worsening-on-high-flow` | `nclex-tier3-advanced-review-questions.ts` | 93 | publish_eligible | Acute respiratory compromise | 60 |
| `nclex-tier3-03-norepinephrine-extravasation` | `nclex-tier3-advanced-review-questions.ts` | 92 | publish_eligible | Vasoactive medication safety | 60 |

## Topic Coverage Rule

Every major topic should eventually contain flagship questions.

Minimum targets:

| Topic Type | Flagship Requirement |
| --- | ---: |
| High-risk clinical topics | 3+ flagship questions per topic |
| Core RN/RPN/PN topics | 2+ flagship questions per topic |
| NP diagnostic or prescribing topics | 3+ flagship questions per topic |
| ECG, labs, pharmacology, clinical skills | 2+ flagship questions per major subdomain |
| Pre-nursing/admissions | 1+ flagship exemplar per module, using pathway-appropriate standards |

Priority high-risk topics:

- Sepsis
- Shock
- ACS
- Stroke
- Respiratory failure
- DKA
- Hyperkalemia
- GI bleed
- Maternal emergencies
- Pediatric emergencies
- Medication safety
- Delegation and escalation

## Gap Closure Plan

1. Start with the 10 nearest certification candidates.
2. Rewrite hints using `docs/content-quality/hint-quality-contract.md`.
3. Enrich distractors using `docs/content-quality/distractor-psychology-model.md`.
4. Add explicit misconception, safety risk, remediation, and readiness-domain metadata.
5. Strengthen rationales to include cue interpretation, why-correct, why-incorrect, patient safety, exam strategy, and bedside application.
6. Add clinical pearls that are memorable and reusable.
7. Link each candidate to lessons, flashcards, simulations, labs, ECG, pharmacology, or clinical skills.
8. Re-score with `scoreQuestionQuality`.
9. Certify only when all required dimensions meet threshold and the gate is `flagship_ready`.

## Launch Control

Flagship certification does not publish content by itself.

Certification marks quality status only. Content must still pass clinical review, editorial review, SEO review when applicable, accessibility review, and product launch gates before learner-facing use.
