# RN Educational Graph — Fifth Convergence Pass

**Date:** 2026-05-20  
**Status:** Substantial convergence; thin-adapter target partially met with documented residual debt.

## Executive summary

This pass hardens the transition from centralized orchestration with partial legacy consumers to a **single governed Educational Graph + Educational Cognition OS**. The three semantic authorities remain:

- `resolveUnifiedEducationalSubstrate()`
- `resolveEducationalCognitionContext()`
- `orchestrateEducationalGraph()`

Downstream surfaces should be presentation adapters only. Fifth-pass work focused on **dashboard feed substrate**, **graph telemetry at interaction boundaries**, **AI prompt graph ordering**, **glossary scale-up**, **CI orchestration enforcement**, and **observability metric codes**.

---

## 1. Graph telemetry convergence

### Wired (client)

| Surface | Mechanism |
|---------|-----------|
| Lesson remediation ladders | `GovernedRemediationCTA`, pathway chain client |
| Topic hub pills | `topic-hub-learning-graph-client` |
| Glossary traversal | `GovernedGlossaryTraversal` |
| Interpretation entry | `GovernedInterpretationLink` |
| Adaptive / dashboard next actions | `GovernedNextActionLink` |
| Post-exam coaching | `GovernedCoachingRemediationLink`, dashboard bridge |
| Learner coaching dashboard cards | `LearnerCoachingDashboardPanel` + graph actions |

### Server bridge

- `captureGovernedGraphTelemetryServer()` → `captureGovernedLearnerProductEvent()` for authenticated `/app` surfaces.

### Payload normalization

- `governed-graph-telemetry-props.ts` — `competency_id`, `graph_depth`, `ontology_namespace`, `remediation_pathway`, `testing_model`, `cognition_capabilities`, `source_surface`, `learner_state_reason`.

### Residual telemetry debt

- Study-plan and some coaching paths still use `recordCoachingTelemetry` alongside governed graph events (dual envelope until unified).
- Interpretation **compact panels** without graph steps still need step materialization at click time.
- AI tutor **launch UI** should call `captureGovernedGraphTelemetry` with `graph_step_clicked` when session starts (provider layer ready; entry routes need props).

---

## 2. Dashboard feed orchestration audit

### Before

`composeDashboardOrchestrationV3()` built cards from session feed + local weak-area heuristics.

### After

- `resolveDashboardSubstrateOrchestration()` → `composeDashboardOrchestrationFromSubstrate()` → `buildDashboardGraphActions()`.
- `composeDashboardOrchestrationV3()` **prefers substrate** when `pathwayId` is present in session learner state; exposes optional `graphActions` on the V3 shape.
- `LearnerCoachingDashboardPanel` maps `graph-{stepId}` cards to `GovernedNextActionLink` with full `EduGraphStep` telemetry.

### Divergence guard

- `dashboard_graph.divergence` metric code registered in `graph-governance-observability.ts`.

---

## 3. AI prompt graph-ordering migration

- `composeTutoringPromptFromGraphSteps()` — `REMEDIATION_GRAPH_ORDER` block from `EduGraphStep[]` only.
- `StubTutoringProvider` uses graph-ordered composition when `graphSteps` present on `TutoringPromptContext`.
- `tutoringPromptContextFromAiEnvelope()` bridges cognition envelope → tutoring provider input.
- `buildAiTutorContextFromCognition()` supplies graph steps to envelope (not legacy recommendation rows).

### Residual

- Production tutor entry routes must pass `graphSteps` on every `TutoringPromptContext` build (helper exported; not all call sites audited).

---

## 4. Authenticated telemetry governance

- Server capture path: `capture-governed-graph-telemetry-server.ts`.
- Cognition V5: `emitCognitionTelemetryV5` on study plan / AI context generation.
- **Next:** Wire server capture on RSC dashboard load, study-plan save, remediation review completion.

---

## 5. Route canonicalization audit

- `scripts/audit-route-canonicalization.mjs` — expanded to `.markdown` in content/blog/scripts/longtail seeds.
- **CI:** `OK — no legacy /canada/rpn/rex-pn` (allowlisted redirects/tests only).
- Canonical Canada PN: `/canada/pn/rex-pn`.

---

## 6. Glossary graph expansion audit

- `nursing-glossary-competency-generated.ts` — competency-linked + supplemental batch.
- Registry merge: core + expansion + competency-generated.
- `GlossaryGraphMetadata` extended: `telemetryNamespace`, `interpretationTopicSlug`, `remediationTopicSlug`.
- **Contract:** `glossary-governance.contract.test.ts` — ≥150 terms (phased toward 200+ target), zero audit issues on sample metadata.

---

## 7. Graph-only orchestration enforcement (CI)

New: `graph-orchestration-enforcement.contract.test.ts`

- Blocks new `TOPIC_INTERPRETATION_SLUG` maps outside `graph-href-builders.ts`.
- Asserts governed telemetry modules do not call `posthog.capture` directly.
- Asserts prompt composition and dashboard substrate modules reference graph authorities.

---

## 8. Educational Graph OS architecture (target)

```mermaid
flowchart TB
  subgraph authorities [Semantic authorities]
    CTX[resolveEducationalCognitionContext]
    SUB[resolveUnifiedEducationalSubstrate]
    ORCH[orchestrateEducationalGraph]
  end
  subgraph adapters [Thin presentation adapters]
    DASH[Dashboard feed cards]
    REM[Remediation ladders]
    TUT[AI tutoring prompts]
    GLO[Glossary traversal]
    INT[Interpretation pathways]
    TEL[Governed telemetry]
  end
  CTX --> SUB
  SUB --> ORCH
  ORCH --> DASH
  ORCH --> REM
  ORCH --> TUT
  ORCH --> GLO
  ORCH --> INT
  ORCH --> TEL
```

---

## 9. Tests run (fifth pass)

```bash
node --import tsx --test \
  nursenest-core/src/lib/educational-graph/*.contract.test.ts \
  nursenest-core/src/lib/educational-cognition/*-governance.contract.test.ts \
  nursenest-core/src/lib/educational-cognition/adaptive-recommendation.contract.test.ts \
  nursenest-core/src/lib/linking/seo-graph-hardening.contract.test.ts \
  nursenest-core/src/lib/ai-tutor/prompt-composition.test.ts

node nursenest-core/scripts/audit-route-canonicalization.mjs
```

---

## 10. Remaining semantic debt inventory

| Priority | Item |
|----------|------|
| P0 | Plumb `graphSteps` on all AI tutor API/session entry points |
| P0 | Interpretation marketing/hub cards without `EduGraphStep` — materialize step at render |
| P1 | Server `captureGovernedGraphTelemetryServer` on dashboard RSC + study-plan |
| P1 | Unify coaching `recordCoachingTelemetry` with governed graph events |
| P1 | Glossary entities as first-class orchestrator traversal nodes (not only metadata) |
| P2 | Deprecate `buildDashboardCards` local heuristics when session always has pathwayId |
| P2 | Expand glossary audit threshold from 150 → 200 in contract when registry count confirmed |

---

## Files touched (representative)

- `dashboard-substrate-orchestration.ts`, `dashboard-orchestration-v3.ts`
- `learner-coaching-dashboard-panel.tsx`
- `graph-step-next-action.ts`, `capture-governed-graph-telemetry-server.ts`
- `ai-tutor-cognition-envelope.ts`, `prompt-composition.ts`, `tutoring-provider.ts`
- `nursing-glossary-competency-generated.ts`, `nursing-glossary-governance.ts`
- `graph-orchestration-enforcement.contract.test.ts`, `glossary-governance.contract.test.ts`
- `graph-governance-observability.ts`, `audit-route-canonicalization.mjs`
