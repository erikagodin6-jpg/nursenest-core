# Educational Cognition OS — Production Continuity & Governance Pass

## Objective

The **Educational Cognition OS** is the single authoritative runtime for learner continuity, adaptive recommendations, graph traversal, dashboard intelligence, study plans, remediation, report-card cognition, and adaptive wire projections.

```txt
RnLearnerStateSnapshot
  → resolveEducationalCognitionContext()
  → orchestrateEducationalGraph()
  → DurableLearnerCognitionEnvelope
  → governed adaptive projections
```

Learner-facing surfaces are **thin adapters** over this substrate. No parallel learner-state systems, recommendation planners, or graph continuity stores may be introduced.

### Platform closure alignment

| Concern | Module |
|---------|--------|
| Psychometric lineage | `psychometric-lineage-validation.ts` |
| Replayable telemetry | `graph-telemetry-replay.ts`, `semantic-lineage-replay.ts` |
| Org enforcement | `org-semantic-governance-policy.md`, `semantic-navigation-release-gate.ts` |
| Educator aggregates | `educator-graph-insights.ts`, `graph-os-aggregation.ts` |
| Runtime resilience | `ontology-runtime-integrity.ts` (incl. `replay-divergent`) |
| Dashboard substrate | `composeDashboardOrchestrationFromContext` → `resolveDashboardSubstrateOrchestration` |

---

## Production Persistence Lifecycle

### Infrastructure

| Layer | Module | Role |
|-------|--------|------|
| Column | `User.learnerCognitionEnvelope` (JSONB) | Cross-device authoritative store |
| SQL | `prisma/manual/learner-cognition-envelope.sql` | Migration artifact |
| Runtime | `learner-cognition-persistence.ts` | Memory cache + async DB persist |
| Prisma | `learner-cognition-persistence-prisma.ts` | Column capability detection |
| Observability | `cognition-persistence-observability.ts` | Events + serialization validation |
| Governance | `persistence-runtime-governance.ts` | Deploy gates + write-read verification |

### Observability events

- `persistence_available`
- `persistence_degraded`
- `persistence_write_failed`
- `persistence_recovered`
- `persistence_cache_warmed`
- `persistence_schema_missing`

### Degradation rules

| Environment | Schema missing | Learner impact |
|-------------|----------------|----------------|
| Production / CI (`NN_ENFORCE_COGNITION_PERSISTENCE`, `NN_DEPLOY_GATE`) | **Deploy blocked** | N/A |
| Non-production | Memory cache fallback | Flows continue; no hard-crash |
| All | Write failure | Structured telemetry + learner-safe fallback |

Warm entry points: `load-learner-dashboard.ts`, `load-report-card-data.ts`, `build-learner-adaptive-wire-bundle.ts`.

---

## Durable Envelope Integrity

Every persisted envelope carries governance metadata:

```ts
{
  cognitionSchemaVersion,
  envelopeVersion,
  ontologyRevision,
  graphVersion,
  migrationPath,
  hydrationState,
  reliabilityTier
}
```

Modules: `cognition-snapshot-types.ts`, `cognition-snapshot-migrations.ts`, `cognition-hydration-governance.ts`, `prepare-durable-cognition-envelope.ts`.

### Integrity tiers

| Tier | Meaning |
|------|---------|
| `valid` | No repair required |
| `repaired` | Salvaged with `repairOperations` |
| `degraded` | Partial continuity; warnings emitted |
| `corrupted` | Unrecoverable sections only |

Repair pipeline: `cognition-envelope-integrity.ts` → `repair-durable-learner-cognition-envelope.ts`.

Repair metadata:

```ts
{
  repaired,
  repairOperations,
  unrecoverableReferences,
  integrityTier,
  repairedAt
}
```

Rules: preserve recoverable continuity; avoid destructive resets unless unrecoverable; never crash cognition resolution.

---

## Continuity Recovery Strategy

`graph-next-step-continuity.ts` persists:

- Graph momentum
- Remediation return points
- Continuity checkpoints
- Interrupted traversal recovery
- Recommendation continuity anchors

Stale continuity is pruned; ontology-aware checkpoint migration runs on hydrate. Replay validation: `validateGraphContinuityReplay()`.

UI propagation:

- Report card — `EducGraphNextStepsPanel`
- Study plan / adaptive overview — `AdaptiveStudyOverview` graph panel
- Dashboard substrate — `composeDashboardOrchestrationFromSubstrate` + `buildDashboardGraphActions`
- Adaptive wire — `projectAdaptiveWireBundleFromCognition()`

Restoration helper: `graph-continuity-replay.ts` (`replayGraphContinuityCheckpoint`).

---

## Replayable Cognition Runtime

| Module | Capability |
|--------|------------|
| `cognition-replay-runtime.ts` | Envelope → migrate → repair → hydrate → context → governed adaptive diff |
| `graph-continuity-replay.ts` | Checkpoint href restoration |

Developer uses:

- Replay envelope against ontology revision
- `diffReplayPrimaryNext()` for recommendation drift
- Inspect `migrationPath` / repair operations deterministically

---

## Explainability & Recommendation Provenance

`cognition-explainability.ts` — all governed adaptive outputs expose:

```ts
{
  derivedFrom,
  competencySignals,
  remediationSignals,
  graphSignals,
  confidenceTier,
  ontologyRevision,
  recommendationReason
}
```

Wired through: `adaptive-recommendation-cognition.ts`, `cognition-telemetry-v5.ts` (audit props only — no raw psychometric internals on public surfaces).

---

## Authenticated Telemetry Isolation

| Module | Role |
|--------|------|
| `telemetry-isolation-governance.ts` | Public/private partitions, allowlists, `cognitionSafePostHogProps` |
| `cognition-telemetry-lineage.ts` | Version + explainability lineage with isolation filter |
| `cognition-telemetry-v5.ts` | Merges lineage into coaching telemetry |

Public marketing routes must not emit `cat_*` events, competency state, envelope bodies, or remediation paths.

E2E: `tests/e2e/governance/playwright-posthog-governance.spec.ts` (public LOFT) and `tests/e2e/learner/playwright-posthog-governance.spec.ts` (authenticated matrix).

---

## Graph Continuity Semantics

Graph steps are produced only via `orchestrateEducationalGraph()` and presented via `graphNextStepsFromSteps()`. Continuity blobs are saved on cognition persist (`cognition-substrate.ts`) and merged on hydration.

Fatigue caps and reliability tiers influence step count — not surface-local ranking.

---

## Persistence Degradation Governance

1. `assertCognitionPersistenceReadiness()` — schema probe at readiness assert
2. `bootstrapCognitionPersistenceRuntime()` — startup verification
3. `validateEnvelopeSerialization()` — pre-write bounds check
4. Prisma failures → observability (not silent swallow)

---

## CI / contract suites

```bash
cd nursenest-core
node scripts/audit-rn-coaching-governance.mjs
node --import tsx --test src/lib/educational-cognition/persistence-governance.contract.test.ts
node --import tsx --test src/lib/educational-cognition/cognition-governance.contract.test.ts
node --import tsx --test src/lib/educational-cognition/persistence-runtime.contract.test.ts
node --import tsx --test src/lib/educational-cognition/cognition-replay.contract.test.ts
node --import tsx --test src/lib/educational-cognition/telemetry-isolation.contract.test.ts
node --import tsx --test src/lib/educational-cognition/graph-continuity.contract.test.ts
node --import tsx --test src/lib/educational-cognition/explainability-governance.contract.test.ts
node --import tsx --test src/lib/educational-cognition/cognition-integrity.contract.test.ts
node --import tsx --test src/lib/educational-cognition/cognition-repair.contract.test.ts
```

---

## Adaptive convergence (authority)

All adaptation must derive from:

- `buildGovernedAdaptiveRecommendations()`
- `resolveEducationalCognitionContext()`
- `orchestrateEducationalGraph()`

Do not add surface-local weak-area ranking, dashboard-only planners, or duplicate continuity state.

---

## Deployment note

Apply `prisma/manual/learner-cognition-envelope.sql` (or equivalent migration) before relying on multi-device cognition continuity in production. Set `NN_ENFORCE_COGNITION_PERSISTENCE=1` in CI/deploy pipelines.
