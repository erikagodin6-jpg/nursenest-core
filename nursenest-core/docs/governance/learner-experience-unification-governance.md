# Learner Experience Unification Governance

Date: 2026-05-28

## Rule

NurseNest has one learner ecosystem with multiple learner journeys. RN is the reference implementation, but RN, RPN/PN, NP, Allied Health, New Grad, Pre-Nursing, ECG, Clinical Skills, Pharmacology, and future specialty products must inherit the same shared learning architecture.

Content may differ. The experience must not fork.

## Mandatory Shared Experiences

Every pathway must resolve through the shared platform for:

- Questions
- Flashcards
- Lessons
- CAT
- LOFT
- Simulations
- Clinical Skills
- Pharmacology
- Analytics
- Readiness
- Profile
- Progress
- Study Plans

## Canonical Surfaces

| Experience | Canonical learner route | Shared owner |
| --- | --- | --- |
| Questions | `/app/practice-tests` | `components/student/practice-question-session-client.tsx` |
| Flashcards | `/app/flashcards` | `components/flashcards/*` |
| Lessons | `/app/lessons` | `components/pathway-lessons/*` |
| CAT | `/app/practice-tests` | `components/student/practice-test-runner-client.tsx` |
| LOFT | `/app/cases/cnple` | `components/cases/cnple-longitudinal-case-shell.tsx` |
| Simulations | `/app/clinical-scenarios` | `components/cases/*` and `components/clinical-scenarios/*` |
| Clinical Skills | `/app/clinical-skills` | `components/clinical-skills/*` |
| Pharmacology | `/app/pharmacology` | `components/pharmacology/pharmacology-hub-client.tsx` |
| Analytics | `/app/account/progress` | `components/student/dashboard/*` and `components/study/*` |
| Readiness | `/app/account/readiness` | `components/study/*` |
| Profile | `/app/profile` | `components/learner-account-ui/*` |
| Progress | `/app/account/progress` | `components/student/learner-progress-page-content.tsx` |
| Study Plans | `/app/study-coach` | `components/study/*` and `components/student/study-planner-shell.tsx` |

## Pathway Rules

RN, RPN/PN, NP, Allied Health, New Grad, Pre-Nursing, ECG, Clinical Skills, Pharmacology, and future specialty products inherit the same experiences. Pathway-specific differences belong in:

- content catalogs
- exam engines
- profession-specific scope rules
- specialty tracks
- adaptive recommendations
- entitlement rules

They do not belong in duplicate learner shells, duplicate flashcard players, duplicate lesson frameworks, duplicate question renderers, or duplicate analytics dashboards.

## New Grad Rule

New Grad is a flagship product and must inherit Questions, Flashcards, Lessons, Analytics, Clinical Skills, Pharmacology, Simulations, Readiness, Profile, Progress, and Study Plans from the shared ecosystem.

Allowed New Grad differentiation:

- Telemetry
- ICU
- Emergency
- Maternal
- Pediatrics
- Mental Health
- Leadership
- Transition-to-practice
- Residency preparation
- Orientation readiness

## Allied Health Rule

Allied Health pathways must inherit Questions, Flashcards, Lessons, Analytics, Clinical Skills, Readiness, Profile, Progress, and Study Plans from the shared ecosystem.

Allowed Allied differentiation:

- profession-specific competencies
- scope-specific scenarios
- profession-specific readiness criteria
- profession-specific catalogs

## Design Decision Rule

Before creating a new learner-facing feature, ask:

Can RN already do this?

If yes, extend the shared platform. Do not create a second interface.

## Enforcement

The canonical policy lives in:

- `src/lib/governance/learner-experience-unification.ts`

The contract test lives in:

- `src/lib/governance/learner-experience-unification.test.ts`

Run:

```bash
node --import tsx --test src/lib/governance/learner-experience-unification.test.ts
```

This test verifies:

- every pathway inherits every mandatory experience
- Allied Health and New Grad inherit the shared ecosystem
- flashcards, lessons, questions, analytics, readiness, profile, progress, study plans, clinical skills, and pharmacology resolve to one canonical surface
- CAT and LOFT can vary by engine while preserving shared shells
- every shared surface declares forbidden duplicate-interface patterns

