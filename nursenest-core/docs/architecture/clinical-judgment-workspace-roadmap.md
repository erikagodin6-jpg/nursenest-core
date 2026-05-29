# Clinical Judgment Workspace Roadmap

Date: 2026-05-29

## Objective

After ECG and Ventilator, NurseNest should sequence clinical simulation development around reusable patient-care workspaces rather than isolated question layouts. The goal is to make the platform feel clinically sophisticated while preserving one shared NurseNest ecosystem across RN, RPN/PN, NP, RT, Allied, New Grad, ECG, Pharmacology, Clinical Skills, CAT, LOFT, and simulations.

## Recommended Development Sequence

| Order | Workspace | Why This Comes Next |
| --- | --- | --- |
| 1 | Clinical Judgment Engine | Foundation for every future workspace: cue recognition, prioritization, intervention, evaluation, escalation, and documentation. |
| 2 | Multi-Patient Assignment Workspace | Highest perceived realism for nursing and New Grad because learners manage competing patients rather than isolated items. |
| 3 | Chart Review Workspace | Core prerequisite for medication decisions, deterioration recognition, SBAR, LOFT, simulations, and case studies. |
| 4 | Timeline Deterioration Engine | Turns vitals, labs, ECG, and ventilator data into time-based clinical judgment. |
| 5 | Medication Administration Workspace | Reusable across pharmacology, clinical skills, med math, new grad, RN, RPN/PN, NP, and paramedicine. |

These five should be treated as the next flagship sophistication layer because they are reusable across nearly every profession and learning product.

## High-Priority Workspace Contracts

### Medication Administration Workspace

Learner task: use MAR, allergies, labs, vitals, and provider orders to decide whether to hold, administer, or clarify a medication.

Required data surfaces:

- MAR
- Allergies
- Labs
- Provider orders
- Vital signs
- Medication profile

Required decisions:

- Administer
- Hold
- Clarify order
- Monitor
- Teach
- Document

### Timeline Deterioration Engine

Learner task: follow patient data over time and identify the deterioration point and escalation threshold.

Required data surfaces:

- Vitals over time
- Lab trends
- ECG progression
- Ventilator progression
- Clinical notes

Required decisions:

- Recognize trend
- Name deterioration
- Choose escalation threshold
- Evaluate response

### Shift Management Simulator

Learner task: manage new admissions, critical labs, family concerns, staffing issues, and provider requests throughout a shift.

Required data surfaces:

- Assignment timeline
- New admissions
- Critical labs
- Family concerns
- Staffing
- Provider requests

Required decisions:

- Prioritize
- Delegate
- Delay
- Escalate
- Handoff

### Handoff & SBAR Engine

Learner task: correct poor handoffs, identify missing information, build complete SBAR reports, and grade communication quality.

Required data surfaces:

- Situation
- Background
- Assessment
- Recommendation
- Pending items
- Safety concerns

Required decisions:

- Include
- Omit
- Clarify
- Escalate
- Grade communication quality

### Clinical Skills Decision Trees

Learner task: turn skills into clinical decisions, not static procedures.

Required flow:

Assessment -> Preparation -> Procedure -> Complication -> Intervention -> Documentation

Initial skill families:

- Foley insertion
- NG tubes
- Wound care
- Tracheostomy care
- Central line care
- IV insertion

### Fetal Monitoring Workspace

Learner task: interpret contraction tracing, fetal heart rate tracing, variability, accelerations, decelerations, and escalation needs.

Required decisions:

- Classify tracing
- Reposition
- Stop oxytocin when clinically indicated
- Notify provider
- Prepare escalation

### EMS Scene Assessment Workspace

Learner task: assess scene safety, mechanism of injury, available resources, triage, and transport priorities.

Required decisions:

- Enter scene
- Request resources
- Triage
- Treat
- Transport

## Shared Platform Rules

- Do not create separate RN, RPN, NP, RT, Allied, or New Grad workspace shells.
- The learner shell, theme tokens, accessibility behavior, activity analytics, remediation routing, and screenshot pipeline must remain shared.
- Content and competency maps differ by profession; interaction architecture does not.
- Every workspace must support adaptive routing into lessons, flashcards, questions, clinical skills, pharmacology, ECG, and simulations when those destinations exist.
- Every workspace must support documentation and communication scoring when clinically relevant.

## Governance

Machine-checkable roadmap contract:

- `src/lib/governance/clinical-judgment-workspace-roadmap.ts`

Contract tests:

```bash
node --import tsx --test src/lib/governance/clinical-judgment-workspace-roadmap.test.ts
```

The contract verifies:

- all requested high-priority workspace prompts are represented
- the recommended post-ECG/Ventilator sequence is preserved
- every workspace reuses the shared learner shell
- every workspace has realistic patient data surfaces
- every workspace requires active learner decisions
- medication administration includes administer, hold, and clarify states
- deterioration includes vitals, labs, ECG, ventilator progression, and escalation thresholds

