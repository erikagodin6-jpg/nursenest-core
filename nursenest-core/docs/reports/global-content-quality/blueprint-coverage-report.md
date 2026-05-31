# Global Blueprint Coverage Report

## Purpose

Blueprint coverage prevents NurseNest from reaching large content counts while leaving major domains underdeveloped.

## Required Audit Dimensions

Every pathway should report:

- Total lessons
- Total questions
- Total flashcards
- Total NGN cases
- Total simulations
- Domain distribution
- Body system distribution
- Specialty distribution
- Question type distribution
- Difficulty distribution
- CAT eligibility
- Adaptive remediation mapping

## Existing Engine

Blueprint compliance currently exists at:

`src/lib/blueprints/blueprint-compliance-engine.ts`

The global governance program requires this engine to be used after every content generation cycle.

## Minimum Reporting

| Report Field | Requirement |
| --- | --- |
| Blueprint coverage score | Must be `95%+` before mature pathway claims |
| Underrepresented domains | Must produce remediation tasks |
| Overrepresented domains | Must pause broad generation |
| Missing objectives | Must be listed explicitly |
| Weakest specialty | Must be prioritized next cycle |
| Weakest body system | Must be prioritized next cycle |
| Weakest question format | Must be prioritized next cycle |
| Weakest lesson category | Must be prioritized next cycle |

## Publication Rule

No pathway may be marked complete if major specialty, body-system, question-type, or clinical-judgment gaps remain.
