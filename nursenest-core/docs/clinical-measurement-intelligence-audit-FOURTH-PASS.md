# Clinical Measurement Intelligence — Fourth-Pass Audit

**Date:** 2026-05-20  
**Scope:** Governance and orchestration layer — bedside clinical cognition substrate shared across labs, ECG, coaching, AI tutoring, dashboards, and educational graph traversal.

## Executive summary

Fourth pass elevates measurement intelligence from a governed interpretation subsystem to a **canonical orchestration layer**. All new consumers should route through `orchestrateClinicalMeasurement()` in `clinical-measurement-orchestrator.ts`. Trend V3, learner-state prioritization, educational graph nodes, AI boundaries, and expanded telemetry are wired with CI audits.

## 1. Measurement orchestration layer (P0)

| Module | Role |
|--------|------|
| `clinical-measurement-orchestrator.ts` | Single entry: interpretation panel, trend V3, competency links, remediation bundle, priority, governed display text, telemetry |
| `resolveGovernedMeasurementText()` | Token resolution for stems, rationales, LOFT-safe case copy |
| `governAiNarrativeForMeasurement()` | AI narrative enforcement + optional escalation telemetry |
| `orchestrateAndTrack()` | Orchestration + client telemetry emit |

**Consumer rule:** Prefer orchestrator over ad-hoc `buildInterpretationPanel()` at product boundaries.

## 2. Educational graph integration (P0)

| Module | Role |
|--------|------|
| `measurement-graph-integration.ts` | `buildMeasurementGraphNode()`, `orchestrateMeasurementEducationalGraph()` |
| Shared ontology | competency topic keys, interpretation guide IDs, glossary keys, `ClinicalReasoningRelation` chains |

Example traversal intent: hyperkalemia → ECG changes → instability → calcium gluconate (educational) → monitoring → reassessment.

## 3. Learner-state prioritization

| Module | Role |
|--------|------|
| `measurement-learner-prioritization.ts` | Authenticated ordering from measurement weaknesses, hesitation, reasoning patterns |
| `orderMeasurementsEditorial()` | Public/marketing bounded depth |

## 4. Trend intelligence V3

`analyzeTrendSeriesV3()` extends V2 with:

- trajectory confidence
- deterioration acceleration
- rebound instability
- oscillation detection
- intervention response cues
- monitoring urgency score
- reassessment interval semantics
- clinical context bands (ICU, renal, sepsis, hemodynamic, insulin, electrolyte)

## 5. Clinical reasoning expansion

`measurement-reasoning-expansion.ts` — `expandBedsideCognitionPathway()` composes prioritization, escalation, intervention sequencing, SATA/delegation/pharm monitoring via `rn-reasoning-ontology.ts` and `measurement-semantic-layer.ts`.

## 6. Remediation + coaching orchestration

| Module | Role |
|--------|------|
| `measurement-coaching-bridge.ts` | `deriveMeasurementRemediationBundle()`, fatigue suppression, dedupe, stabilization scores |
| `remediation-planner-v3.ts` | Measurement weakness boost in topic ordering |
| `post-exam-coaching/coaching-semantics.ts` | `enforceGovernedAiMeasurementCopy` at narrative boundary |
| `ai-coaching-governance.ts` | Double boundary on RN coaching AI copy |

## 7. AI governance hardening (P0)

| Surface | Guard |
|---------|--------|
| AI tutor prompts | `aiPromptWithMeasurementGuardrails()` in `prompt-composition.ts` |
| Coaching / LOFT | `enforceGovernedAiMeasurementCopy()` + psychometric sanitization |
| Orchestrator | `governAiNarrativeForMeasurement()` |

Registry status: `post_exam_coaching`, `rn_coaching_v3` → **governed**; scattered `ai_tutor` routes remain **partial** until each generation handler calls the boundary.

## 8. LOFT + case integration

- LOFT-safe copy: `loftSafeCopy` on orchestrator; `loftSafeTrendLabel` in coaching semantics.
- Registry: `loft_cases` **partial** — wire `resolveGovernedMeasurementText(..., loftSafe: true)` in case step render paths.
- CNPLE psychometric stack remains isolated (`testing-model`, `coaching-semantics` LOFT branch).

## 9. Labs + ECG surface expansion

- `MeasurementInterpretationPanel` mounted on labs hub critical watchlist (potassium / hyperkalemia rows).
- ECG drill / academy surfaces: **partial** — reuse panel with `sourceSurface: "labs"` or `"practice"`.

## 10. Governance registry expansion

`measurement-governance-registry.ts` now tracks:

- `usesOrchestrator`, `graphIntegration`, `remediationIntegrated`, `telemetryComplete`, `learnerStateSupport`
- Statuses: `governed`, `partial`, `ungoverned`, `deprecated`, `blocked`
- Canonical consumer: `clinical_measurement_orchestrator`

## 11. Telemetry + analytics

Canonical orchestration events in `measurement-analytics.ts`:

- `interpretation_viewed`, `interpretation_completed`, `trend_path_opened`, `remediation_triggered`
- `bedside_escalation_reviewed`, `ai_measurement_guardrail_blocked`
- `monitoring_sequence_started`, `reassessment_path_started`

Metadata: competencyId, interpretationId, trendSeverity, learnerStateReason, monitoringPriority, remediationPriority, sourceSurface.

## 12. Structured data + semantic graph

`measurement-structured-data.ts` — schema.org helpers (`LearningResource`, `Article`, `FAQPage`, `MedicalWebPage`, `DefinedTerm`) for interpretation guides and monitoring pathways.

## 13. UI/UX governance

- `MeasurementInterpretationPanel` — compact, semantic-token borders, low density.
- Avoid duplicate remediation CTAs via `shouldEmitMeasurementRemediation()` and exposure dedupe.

## 14. Tests + CI

| Command | Purpose |
|---------|---------|
| `npm run test:measurement-architecture` | Architecture + orchestration contract tests |
| `npm run audit:measurement-intelligence` | Core modules + coaching AI boundary |
| `npm run audit:measurement-orchestration` | Orchestrator, graph, labs panel, tutor guardrails |
| `npm run audit:measurement-ai-governance` | All AI boundary files |

## 15. LOFT + ECG convergence follow-up (completed)

| Surface | Mechanism | Registry status |
|---------|-----------|-----------------|
| LOFT cases | `governLoftCaseCopy`, `loftSafeVitalTrendDisplay`, step telemetry | `loft_cases` governed |
| ECG drills | `governEcgDrillCopy` on stems/options/rationale/priority | `ecg_drill_surfaces` governed |
| Study plans | `governStudyPlanCopy` on headlines and block copy | `study_plan_governed` governed |
| Dashboard AI | `governDashboardAiCopy` on feed headline | `dashboard_ai_coaching` governed |
| PDF / print | `governPdfExportCopy` on CAT results narrative | `pdf_export` governed |
| CAT / practice | `governMeasurementSurfaceCopy` on stems and options | exam runners |

Adapter: `measurement-surface-convergence.ts` — composes `resolveGovernedMeasurementText` + `governAiNarrativeForMeasurement` only (no new orchestration authority).

## 16. Remaining technical debt

| Item | Priority | Notes |
|------|----------|-------|
| LOFT inline interpretation panels | P2 | Copy governed; optional `orchestrateClinicalMeasurement` panels per critical lab |
| ECG hub lesson pages | P2 | Drill client governed; static lesson SEO bodies unchanged |
| Lesson body → orchestrator panels | P2 | Optional upgrade from token-only SSR |
| `ai_tutor` scattered routes | P1 | Registry `ai_tutor` still partial until every handler audited |

## Verification (this pass)

- `npm run test:measurement-architecture` — architecture + orchestration tests
- `npm run audit:measurement-intelligence`
- `npm run audit:measurement-orchestration`
- `npm run audit:measurement-ai-governance`
