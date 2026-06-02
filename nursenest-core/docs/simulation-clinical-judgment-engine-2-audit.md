# Simulation & Clinical Judgment Engine 2.0 Audit

Date: 2026-05-28

## Scope

This pass strengthens the existing longitudinal case system so simulations are framed as patient-care experiences instead of isolated questions. It does not create a parallel simulation product, add schema, or generate hundreds of new cases. It builds on the current CNPLE LOFT case shell, patient evolution engine, consequence engine, analytics, and remediation surfaces.

## Implemented

| Requirement | Evidence | Status |
| --- | --- | --- |
| Assessment → recognition → prioritization → intervention → evaluation → escalation → documentation | `CLINICAL_JUDGMENT_CARE_CYCLE` and `buildSimulationPracticeFrame()` make the nursing practice loop explicit for each case step. | Implemented |
| Patient evolution cues | `buildSimulationPracticeFrame()` derives visible evolution signals from clinical update, vitals, labs/diagnostics/ECG, medication changes, and scenario context. | Implemented |
| Multi-duration cases | `timeHorizonForMinutes()` classifies authored cases as 15-minute, 30-minute, 60-minute, or multi-shift based on existing `estimatedMinutes`. | Implemented |
| NGN integration contract | Bowtie, Matrix, Extended SATA, Trend Recognition, Cloze, and Case Study formats are declared in `NGN_SIMULATION_FORMATS`. | Implemented as engine contract |
| CNPLE LOFT integration | The existing CNPLE longitudinal shell now renders the virtual clinical experience frame inside the current LOFT case flow. | Implemented |
| Decision consequences | `consequenceNarrativeForDecision()` standardizes optimal, acceptable, suboptimal, and harmful patient outcome language. Existing case consequences remain source-of-truth. | Implemented |
| Documentation | The case shell now surfaces charting requirements including focused assessment, decision rationale, reassessment, medication documentation, and SBAR when needed. | Implemented |
| Team communication | The case shell now surfaces SBAR, provider/team reporting, pharmacy/prescriber clarification, and interprofessional coordination prompts. | Implemented |
| Handoff training | The case shell now surfaces current status, priority risk, pending diagnostics, response, and escalation threshold prompts. | Implemented |
| Simulation analytics dimensions | Recognition, Prioritization, Intervention, Safety, Communication, Documentation, Clinical Judgment, and Decision Quality scores are computed by `scoreSimulationJudgmentDimensions()`. | Implemented |
| Adaptive integration | The engine maps missed simulation patterns toward lessons, flashcards, questions, pharmacology, ECG, and clinical skills remediation based on case family/domain. | Implemented as deterministic routing contract |
| Specialty libraries | Emergency, Critical Care, Telemetry, Maternal, Pediatrics, Mental Health, Community, Long-Term Care, Leadership, Home Care, Perioperative, Dialysis, Primary Care, and NP Practice are declared. | Implemented as content-library contract |
| Content targets | RN 250+, PN 200+, NP 200+, Allied and New Grad targets are declared for planning/governance. | Implemented as target contract |

## User-Facing Change

The CNPLE longitudinal case shell now includes:

- A "Virtual clinical experience" panel.
- Required nursing actions for the current patient state.
- Patient evolution cues from vitals, diagnostics, ECG, medications, and scenario changes.
- Adaptive remediation destinations if the learner misses the step.
- Documentation requirements.
- Team communication prompts.
- Handoff prompts.
- Patient-care consequence language after decisions.

## Reused Existing Infrastructure

- `src/lib/cases/longitudinal-case-engine.ts`
- `src/lib/cases/clinical-trajectory-engine.ts`
- `src/lib/cases/longitudinal-state-mutation.ts`
- `src/lib/cases/case-session-analytics.ts`
- `src/lib/cases/domain-remediation-engine.ts`
- `src/components/cases/cnple-longitudinal-case-shell.tsx`

## Not Implemented In This Pass

| Gap | Reason |
| --- | --- |
| 250+ RN / 200+ PN / 200+ NP authored simulations | This requires content production and clinical review, not just engine code. |
| New schema/persistence for expanded simulation analytics | Avoided to keep this pass surgical and preserve current session persistence. |
| Standalone admin dashboard | Out of scope; analytics dimensions are ready for future dashboards. |
| Marketing screenshots and positioning pages | Out of scope for this engine pass. |
| Full RN/RPN/Allied simulation route libraries | Engine contracts are tier-aware, but existing learner-facing implementation remains CNPLE LOFT-focused. |

## Verification

- Added `src/lib/cases/simulation-clinical-judgment-engine.test.ts`.
- Tests verify patient evolution, required clinical judgment cycle, adaptive remediation routing, decision consequence framing, simulation analytics dimensions, specialty library coverage, and content target contracts.

