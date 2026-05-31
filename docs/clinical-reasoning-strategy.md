# Clinical Reasoning Strategy

Date: 2026-05-31

## External Context

The 2026 NCSBN RN Test Plan states that clinical judgment is highly relevant to safe entry-level practice and that the exam includes clinical judgment through case studies and stand-alone items. It describes the NCJMM steps: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, and evaluate outcomes.

Competitors have moved toward case studies, NGN items, readiness tests, CAT, and simulation claims. The next defensible frontier is not just item format. It is consequence-aware clinical reasoning practice.

## Current NurseNest Assets

| Area | Evidence | Status |
|---|---|---|
| NGN/question rendering | Practice runners, advanced renderers, question formats | Implemented |
| CAT/exam shell | Practice-test runner, CAT launch/results, exam session shell | Implemented |
| Clinical scenarios | `ClinicalNursingScenario`, stages, learner scenario components | Implemented foundation |
| Simulation telemetry | `ClinicalScenarioSimulationRun`, longitudinal case sessions | Implemented foundation |
| OSCE/skills | `/app/osce`, `/app/clinical-skills`, scenario shells | Implemented |
| Documentation/handoff | Scenario architecture and new-grad/simulation-center surfaces | Partial |
| Labs/ECG correlation | `/app/labs`, ECG modules, semantic clinical widgets | Implemented foundation |
| Prioritization/delegation | `/app/prioritization-delegation`, premium-success dimensions | Implemented foundation |

## Strategic Thesis

NurseNest can become the strongest clinical reasoning platform by building a single reasoning loop:

`case signal -> learner decision -> consequence -> debrief -> targeted remediation -> verification in a new context`

This is more defensible than static rationales because it requires scenario design, telemetry, content graph routing, adaptive remediation, and clinical review.

## Clinical Reasoning Product Model

### Layer 1: NGN Item Mastery

Purpose: ensure item-format competence.

Includes:

- Bow-tie, matrix, SATA, ordered response, drop-down, exhibit-based items.
- Rationale and distractor explanation.
- Topic and NCJMM step tagging.

### Layer 2: Unfolding Case Studies

Purpose: connect cues over time.

Includes:

- Multi-stage patient updates.
- Vitals, labs, ECG, medication list, nursing notes.
- Decision points mapped to NCJMM.
- Consequence text after choices.

### Layer 3: Branching Simulations

Purpose: make judgment visible.

Includes:

- Multiple clinically plausible paths.
- Delayed recognition, escalation, stabilization, and deterioration outcomes.
- Documentation and SBAR prompts.
- Debrief with decision trace.

### Layer 4: Transition-To-Practice Scenarios

Purpose: prepare for the shift, not just the exam.

Includes:

- New-grad prioritization under staffing constraints.
- Handoffs, escalation, safety checks, patient teaching.
- Specialty overlays: ICU, ER, telemetry, med-surg, peds, LTC, oncology, dialysis.

## Build Priorities

### Immediate

| Initiative | Evidence basis | Impact |
|---|---|---:|
| Standardize scenario tagging by NCJMM step, body system, risk, scope, and pathway | Existing scenario models and educational graph | High |
| Add debrief schema for every scenario decision | `ClinicalScenarioSimulationRun.summary` can store structured traces | High |
| Route scenario misses into the same remediation queue as questions | `UserRemediationQueue` already exists | Very high |
| Publish clinical reasoning methodology | Trust gap vs competitor claims | High |

### Near-Term

| Initiative | Evidence basis | Impact |
|---|---|---:|
| Build graph-based branching engine | `docs/planning/adaptive-case-study-ecosystem.md` | Very high |
| Add documentation and SBAR scoring | OSCE/scenario shells | High |
| Add labs and ECG exhibits inside cases using shared widgets | Labs/ECG modules exist | High |
| Add safety-critical flags for unsafe decisions | Clinical scenario consequences and premium-success safety dimensions | Very high |

### Strategic

| Initiative | Evidence basis | Impact |
|---|---|---:|
| Specialty simulation library | New-grad and simulation center routes | Very high |
| Faculty-assigned cases and cohort debrief | Institutional models exist | High |
| Outcome-validated reasoning scores | Readiness and scenario telemetry | Very high |
| International scope overlays | Global architecture and content inheritance | High |

## Differentiation

Most competitors teach answers. NurseNest should teach clinical consequences.

The product should show:

- What the learner noticed.
- What they missed.
- What they prioritized.
- What they did.
- What happened because of it.
- What to study next.
- Whether they can transfer the repaired skill to a new patient.

## Conclusion

NurseNest's clinical reasoning moat is built by connecting NGN items, labs, ECG, medications, skills, OSCE, documentation, handoff, and simulation debriefs into one adaptive platform. This is a better long-term advantage than competing on question count.
