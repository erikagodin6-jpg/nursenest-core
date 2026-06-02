# Health Sciences Foundations Academy — implementation roadmap

**Status:** Phase 1 foundation architecture implemented.

**Branch:** `feature/health-sciences-foundations-academy`

---

# Purpose

NurseNest is transitioning from isolated exam-prep surfaces into a unified healthcare education ecosystem.

The Health Sciences Foundations Academy is the canonical prerequisite layer for:

- HESI A2
- ATI TEAS
- RN / NCLEX-RN
- REx-PN / PN
- CNPLE / NP
- ECG
- Hemodynamics
- Respiratory Therapy
- Paramedic / EMT
- CNA / PSW
- Critical care

This architecture prevents duplicated educational content and establishes a shared competency graph for adaptive remediation, analytics, readiness prediction, and future simulations.

---

# Phase 1 — Implemented

## Canonical academy hierarchy

Implemented in:

- `src/lib/health-sciences-foundations/health-sciences-foundations-academy.ts`

Hierarchy:

```text
Academy
  Semester
    Unit
      Module
        Lesson
          Competencies
          Assessments
          Remediation
```

---

# Required lesson-authoring standard

Every lesson must contain:

- overview
- learningObjectives
- deepTeaching
- clinicalRelevance
- memoryAids
- commonMistakes
- examTraps
- practiceQuestions
- flashcards
- miniAssessment
- remediation

This is mandatory platform-wide.

---

# Current curriculum implemented

## Semester 1 — Human Biology Foundations

### Medical terminology
- prefixes/suffixes/root words
- directional terms
- body planes
- abbreviations/documentation

### Cell biology
- organelles
- membranes
- transport
- ATP
- mitosis/meiosis

### Chemistry
- atoms
- ions
- pH
- acids/bases
- electrolytes
- solutions

### Physiology principles
- homeostasis
- feedback loops
- perfusion
- oxygenation
- fluid balance

---

## Semester 2 — Body Systems

### Cardiovascular
- blood flow
- conduction
- cardiac output
- blood pressure
- shock basics

### Respiratory
- gas exchange
- ventilation
- oxygenation
- acid-base basics

### Renal
- nephron
- filtration
- electrolytes
- fluid regulation

### Neuro/endocrine/immune
- autonomic nervous system
- hormones
- inflammation
- infection
- immunity

---

## Semester 3 — Healthcare Practice Foundations

### Infection control
- PPE
- isolation
- sterilization
- transmission

### Pharmacology
- pharmacokinetics
- pharmacodynamics
- dosage calculations
- medication safety

### Communication and ethics
- SBAR
- documentation
- confidentiality
- informed consent
- advocacy

---

# Competency engine

Implemented:

- competency IDs
- remediation routing
- mastery thresholds
- downstream applicability mapping

Examples:

- `foundations.cardio.blood-flow`
- `foundations.resp.gas-exchange`
- `foundations.pharm.med-safety`
- `foundations.infection.transmission`

These competencies become the shared adaptive layer for all future academies.

---

# Current downstream architecture targets

The foundations academy now explicitly supports:

- HESI A2 Admissions Prep
- ATI TEAS Admissions Prep
- Nursing School Academy
- ECG Institute
- Respiratory Therapy Academy
- Paramedic / EMT Academy
- CNA / PSW Academy
- Critical Care Institute

---

# Phase 2 — Next required implementation

## HESI A2 Academy

Build:

- anatomy & physiology
- biology
- chemistry
- vocabulary
- grammar
- reading comprehension
- critical thinking
- math

Add:

- timed section simulations
- diagnostics
- adaptive remediation
- readiness scoring

---

## ATI TEAS Academy

Build:

- reading
- math
- science
- English & language usage

Integrate with foundation competencies rather than duplicating content.

---

# Phase 3 — Shared learner intelligence

Future work:

- readiness prediction
- weakness mapping
- spaced repetition
- remediation routing
- adaptive testing
- longitudinal learner analytics

---

# Phase 4 — Critical Care Institute

Future premium ecosystem:

- ECG
- hemodynamics
- shock
- ventilation
- ABGs
- ICU reasoning
- vasopressors
- waveforms

This is expected to become a flagship NurseNest specialty product.

---

# Governance requirements

## Never ship thin pathways

Every academy must include:

- deep lessons
- flashcards
- practice pools
- remediation
- analytics
- progression
- simulation hooks

No isolated quiz-bank-only launches.

---

# Testing

Contract tests added:

- `health-sciences-foundations-academy.contract.test.ts`

Guards:

- duplicate lesson IDs
- orphaned competency references
- missing lesson sections
- weak summaries
- invalid remediation routes
- thin curriculum regressions

---

# Strategic direction

NurseNest is evolving into:

> a unified healthcare education platform

rather than:

> a collection of exam question banks.
