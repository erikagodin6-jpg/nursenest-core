# RN Educational Cognition — Fifth-Pass Convergence

## Target state

**Canonical substrate:**

```
RnLearnerStateSnapshot
  + resolveEducationalCognitionContext()
  + orchestrateEducationalGraph()
```

All learner surfaces are **presentation adapters** over this substrate.

## P0 — Study-plan convergence

| Before | After |
|--------|-------|
| `buildPersonalizedWeakAreaStudyPlan()` + parallel `recommendNextActions` | `buildCognitionIntegratedStudyPlan()` → `resolveLearnerCognitionSubstrate()` |

- Route: `/app/study-plan` uses `study-plan-cognition.ts`
- UI: `PersonalizedWeakAreaStudyPlanPanel` unchanged (receives `publicPlan` adapter)
- Sequencing: `buildGovernedRnStudyPlan()` + `planRemediationV3()` → `orchestrateEducationalGraph()`

## P0 — Dashboard semantic unification

- `composeDashboardOrchestrationFromContext(ctx)` — context-first (preferred)
- `resolveDashboardEducationalCognition()` — server dashboard loads
- Shared prioritization from `ctx.learnerState` + `ctx.remediation`

## P0 — Learner-state centralization

- `hydratePriorLearnerState()` / `saveDurableLearnerCognition()` — server durable store (process-local, shared with API)
- `resolveEducationalCognitionContext()` accepts `topicTrends`, `weakTopics`, `timing`, `persistLearnerState`
- Optional `timingCognition` on `RnLearnerStateSnapshot`

## P1 — Measurement cognition

- `measurement-cognition-bridge.ts` → `ctx.measurement`
- Remediation planner `measurementBoostForTopic()`
- Graph: `orchestrateMeasurementEducationalGraph()`

## Timing as cognition signal

- `timing-cognition.ts` — `deriveTimingCognitionSignals()`, `studyPlanDensityFromTiming()`
- Hydration attaches `timingCognition` when timing signals ≥ 4

## P1 — Durable persistence

- `learner-cognition-persistence.ts` + `GET/POST /api/learner/rn-coaching-state`
- **Next:** approved Prisma JSON column for multi-device continuity (no migration in this pass)

## AI tutor governance

- `buildAiTutorContextFromCognition(ctx, graphSteps)` — replaces report-only path for session flows
- Consumes `EduGraphStep[]` + psychometric governance

## Telemetry V5

- `cognition-telemetry-v5.ts` — canonical payload + events
- Events: `cognition_context_resolved`, `study_plan_generated`, `ai_tutoring_context_generated`, etc.

## Entry points

```typescript
import {
  resolveLearnerCognitionSubstrate,
  buildCognitionIntegratedStudyPlan,
  resolveEducationalCognitionContext,
} from "@/lib/educational-cognition";
```

## Tests

```bash
node --import tsx --test src/lib/educational-cognition/cognition-governance.contract.test.ts
node --import tsx --test src/lib/learner/rn-coaching-intelligence/rn-coaching-intelligence.test.ts
npm run audit:rn-coaching-governance
```

## Remaining semantic debt

1. **Prisma-backed learner cognition column** — required for true multi-device durability
2. **Adaptive study overview** — still uses `buildAdaptiveRecommendations`; should read `ctx.dashboard` only
3. **Legacy `buildPersonalizedWeakAreaStudyPlan`** — kept for admin/debug; study-plan route migrated
4. **Client dashboard panel** — session-scoped; server paths use full substrate
5. **Measurement catalog hydration** — pass real lab catalog items into `buildMeasurementCognitionSlice` on study-plan load
