# Clinical Content Quality Governance

NurseNest prioritizes clinical accuracy, learner outcomes, and professional credibility over content volume. Content generated only to increase counts is not publication-ready.

## Zero-Tolerance Rejections

Reject placeholder content, generic AI filler, repetitive explanations, surface-level teaching, hallucinated clinical information, outdated recommendations, low-value flashcards, weak rationales, circular explanations, and any content that would not stand up to clinician review.

## Required Depth

Lessons must teach why, how, when, what happens if the cue is missed, how it appears clinically, exam relevance, patient safety, and professional context. A publishable lesson includes learning objectives, overview, core concepts, pathophysiology, assessment, diagnostics, interventions, patient safety, clinical judgment, clinical pearls, exam relevance, knowledge checks, related lessons, further reading, and summary.

Questions must function as teaching resources, not answer checks. A publishable question includes a reasoning hint, correct answer, why-correct explanation, why-incorrect explanation, clinical application, clinical pearl, exam strategy, and links to related lessons and flashcards.

Flashcards must reinforce high-yield clinical recognition and retention. Definition-only, redundant, trivial, or duplicate cards are not publication-ready.

## Scoring Bands

| Score | Band | Publication meaning |
| ---: | --- | --- |
| 90-100 | Excellent | Strong candidate after normal review |
| 80-89 | Good | May still require remediation; must reach 90+ to publish |
| 70-79 | Needs Review | Do not publish |
| < 70 | Do Not Publish | Quarantine or rewrite |

## Publication Gate

Content may be marked `published=true` only when all are true:

- Quality Score >= 90
- Clinical Accuracy Pass
- No placeholder content
- No duplicate content
- Required sections complete
- Rationale complete
- Hint complete where applicable
- Clinical pearl complete where applicable

High-risk pharmacology, labs, ECG, critical care, pediatric specialty, advanced NP, and allied specialty content routes to expert review before publication.

## Implementation

- Validator: `src/lib/content-quality/clinical-content-validator.ts`
- Dashboard runner: `npm run content:clinical-quality:governance`
- Test gate: `npm run test:clinical-content-quality`
- Dashboard output: `docs/reports/clinical-content-quality/content-quality-dashboard.md`

The validator is intentionally deterministic and DB-agnostic so generation pipelines, import scripts, admin publish surfaces, and CI can all use the same standard.
