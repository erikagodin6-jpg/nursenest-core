# New Graduate Nurse Residency Academy

## Objective

Create a dedicated New Graduate Nurse pathway for nurses who have already passed NCLEX or REx-PN and need structured support transitioning into practice.

This product is positioned as a retention and institutional growth pathway: learners can stay with NurseNest after licensure, while hospitals and academic partners can recommend a practical first-year support ecosystem.

## Positioning

**Pass The Exam. Thrive In Practice.**

Primary audiences:

- New graduate nurses
- Nurse residency programs
- Hospitals and health systems
- Academic institutions

## Core Modules

The canonical module list now lives in `NEW_GRAD_RESIDENCY_CORE_MODULES`:

- Professional Transition
- Time Management
- Prioritization
- Delegation
- Documentation
- Clinical Judgment
- Communication
- Shift Organization
- Patient Safety
- Code Blue Readiness
- Medication Safety
- Interprofessional Collaboration
- Workplace Resilience

## Learning Activities

The academy supports the expected transition-to-practice activity set:

- Lessons
- Flashcards
- Practice Questions
- Case Studies
- NGN-style Scenarios
- Clinical Simulations
- Documentation Exercises
- Shift Management Simulators
- Prioritization Challenges

## Readiness Domains

Practice readiness is represented by `NEW_GRAD_PRACTICE_READINESS_DOMAINS`:

- Patient Safety
- Delegation
- Communication
- Clinical Judgment
- Documentation
- Professional Development
- Medication Administration
- Emergency Response

## Implementation Notes

- Product model: `src/lib/new-grad/new-grad-residency-program.ts`
- Marketing landing surface: `src/components/marketing/new-grad-marketing-landing.tsx`
- Contract coverage: `src/lib/new-grad/new-grad-residency-program.contract.test.ts`
- Public hubs: `/us/new-grad` and `/canada/new-grad`

The academy extends the existing New Grad pathway rather than creating a disconnected product shell.
