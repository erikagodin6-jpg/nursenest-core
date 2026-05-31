# NurseNest Clinical Authority Content Standard

## Purpose

This standard governs public healthcare education pages across disease guides, medication guides, care plans, clinical
skills, lab interpretation, allied health content, career content, certification guides, and study guides.

The objective is clinical authority, not keyword volume. A page should teach the learner enough to understand the topic,
recognize it clinically, apply it during placement, and answer exam questions with better reasoning.

## Core Rule

Never create a page simply to target a keyword. Every authority page must genuinely teach.

## Minimum Depth

| Content Type | Target Depth |
| --- | ---: |
| Disease Pages | 3,000-5,000 words |
| Medication Pages | 2,500-4,000 words |
| Care Plans | 2,000-3,500 words |
| Clinical Skills | 2,500-4,000 words |
| Lab Interpretation | 2,000-3,000 words |
| Career Guides | 3,000-5,000 words |
| Certification Guides | 4,000-8,000 words |

No thin pages. No short summaries. No filler.

## Required Audit Dimensions

Every page is scored across:

- Clinical Depth
- Educational Value
- Practical Utility
- Exam Relevance
- Clinical Accuracy
- Internal Linking
- EEAT Readiness
- Content Completeness

Minimum publication score: `90/100`.

Pages below 90 remain under review.

## Disease Page Requirements

Every disease page must include definition, why it matters clinically, pathophysiology, disease progression, risk factors,
causes, assessment findings, signs and symptoms, differential diagnoses, diagnostics, laboratory findings, imaging findings,
medical management, pharmacology, nursing management, RT considerations, OT considerations, PT considerations, MLT
considerations, patient education, complications, clinical pearls, common student mistakes, common new graduate mistakes,
NCLEX considerations, REx-PN considerations, NP considerations, a case study, practice questions, related conditions, and
references.

## Medication Page Requirements

Every medication page must include why patients receive the medication, mechanism of action, how the drug works
physiologically, indications, contraindications, side effects, serious adverse effects, monitoring, laboratory monitoring,
administration considerations, patient teaching, nursing considerations, safety alerts, medication errors, clinical pearls,
a case example, exam considerations, related medications, and references.

## Care Plan Requirements

Every care plan must include patient scenario, priority diagnoses, clinical reasoning, goals, interventions, rationales,
evaluation, patient education, complication monitoring, escalation triggers, clinical pearls, exam tips, case progression,
and documentation examples.

## Clinical Skills Requirements

Every skill page must include purpose, indications, contraindications, preparation, equipment, procedure, safety checks,
clinical decision points, common errors, complications, documentation, patient teaching, case examples, clinical pearls, and
knowledge check questions.

## Allied Health Requirement

Do not create generic nursing content with an allied-health label attached. Allied pages must be profession-specific,
role-specific, competency-specific, and educationally authentic.

## Experience Signals

Every page should include realistic clinical scenarios, patient cases, clinical judgment discussion, common errors,
practical tips, and decision-making examples. The page should feel like it was written by clinicians and educators, not an
encyclopedia.

## Internal Linking

Every page must connect to related diseases, medications, labs, skills, questions, lessons, simulations, and care plans
where relevant. No isolated pages.

## Implementation

The executable standard lives in `src/lib/authority/healthcare-authority-content-engine.ts` as:

- `CLINICAL_AUTHORITY_STANDARD`
- `CLINICAL_AUTHORITY_MINIMUM_PUBLICATION_SCORE`
- `validateClinicalAuthorityStandard()`

The dashboard generator surfaces clinical authority coverage in `docs/content-authority-dashboard.md`.
