# RN Educational Cognition OS — Sixth-Pass Durability

## Objective

Transition from runtime-only orchestration to a **durable multi-device Educational Cognition Operating System** where:

- `resolveLearnerCognitionSubstrate()`
- `resolveEducationalCognitionContext()`
- `orchestrateEducationalGraph()`
- `RnLearnerStateSnapshot` / `DurableLearnerCognitionEnvelope`

are the semantic authorities for dashboards, study plans, remediation, adaptive recommendations, AI tutoring, readiness, timing, measurement reasoning, graph traversal, and telemetry.

## Delivered in this pass

### P0 — Durable persistence

- **`User.learnerCognitionEnvelope`** (Prisma JSON) stores versioned `DurableLearnerCognitionEnvelope`.
- **`learner-cognition-persistence-prisma.ts`** — read/write with migration on load.
- **`learner-cognition-persistence.ts`** — memory cache + async Prisma sync, `warmDurableLearnerCognitionCache`, longitudinal samples, graph continuity.
- **`/api/learner/rn-coaching-state`** — GET/POST uses envelope migrations + DB persist.

### P0 — Snapshot versioning

- **`cognition-snapshot-migrations.ts`** — `migrateCognitionEnvelopeFromStorage`, legacy v1 envelope upgrade, stale detection hooks.
- **`cognition-hydration-governance.ts`** — `ephemeral | inferred | persisted | validated` tiers, partial/degraded modes.

### P0 — Adaptive convergence

- **`adaptive-recommendation-cognition.ts`** — async `buildGovernedAdaptiveRecommendations`; primary/secondary from **graph steps + dashboard cards**; weak-topic ordering from **competency state** only; exam calendar shell from `buildAdaptiveRecommendations` with cognition-ordered weak rows.

### P1 — Graph next-step continuity

- **`graph-next-step-continuity.ts`** — persist `graphContinuity` on substrate save; exposed as `cognition.graphNextSteps` on adaptive output and report-card orchestration.

### P1 — Measurement cognition expansion

- **`measurement-catalog-defaults.ts`** — bounded catalog (ABG, electrolytes, hemodynamics, glucose) fed into `buildMeasurementCognitionSlice()` from resolver.

### P1 — Browser telemetry governance

- **`tests/e2e/learner/playwright-posthog-governance.spec.ts`** — LOFT public surfaces + CNPLE redirect leak checks.
- **`telemetry-e2e-governance.contract.test.ts`** — client capture normalization (existing, retained).

### API / surface wiring

- Study plan page + **`/api/learner/personalized-study-plan`** → `buildCognitionIntegratedStudyPlan`.
- Adaptive wire bundle → `projectAdaptiveWireBundleFromCognition` (async).

## Durability hardening pass (operational continuity)

### Durable envelope lifecycle

1. **Load** — Prisma `learnerCognitionEnvelope` → `migrateCognitionEnvelopeFromStorage`
2. **Integrity** — `assessCognitionEnvelopeIntegrity` (checksum, salvage, tier)
3. **Repair** — `repairDurableLearnerCognitionEnvelope` (non-destructive)
4. **Hydrate** — `governCognitionHydration` (stale / pathway drift)
5. **Persist** — memory cache + async DB write with observability

Orchestrator: `prepareDurableCognitionEnvelope`.

### Cognition repair and integrity governance

- **`repair-durable-learner-cognition-envelope.ts`** — graph href prune, competency normalize, reasoning pattern filter, ontology reconciliation.
- **`cognition-envelope-integrity.ts`** — tiers: `valid | repaired | degraded | corrupted`.
- Repair metadata on envelope: `repairReport { repaired, repairOperations, unrecoverableReferences, repairedAt }`.

### Versioned cognition telemetry

- **`cognition-version-governance.ts`** — `cognitionSchemaVersion`, `envelopeVersion`, `hydrationVersion`, `ontologyRevision`, `graphVersion`, `migrationPath`.
- Propagated through: telemetry V5, adaptive `cognition.version`, RN coaching API responses.

### Persistence degradation strategy

- **`cognition-persistence-observability.ts`** — probes DB column, emits `persistence_available | persistence_degraded | persistence_write_failed | persistence_recovered | cognition_cache_warmed`.
- **Never crashes learner flows** — falls back to in-memory cache with high-severity logs when column missing.

### Authenticated telemetry isolation

- Public Playwright: LOFT psychometric copy guards.
- Authenticated matrix (paid storage): study plan / dashboard HTML must not contain raw envelope fields.
- Contract: `telemetry-e2e-governance.contract.test.ts` + client `governClientTelemetryCapture`.

### Longitudinal cognition analytics

- **`educator-cognition-aggregation.ts`** — cohort-safe summaries (no raw envelopes, no learner IDs).
- Tracks repair frequency, persistence degradation proxy, graph depth, remediation velocity.

### Live measurement ingestion (prepared)

- **`resolve-measurement-cognition-input.ts`** — `default | inferred | device | clinician-validated` tiers; live vitals hook ready.

## Contract tests

```bash
cd nursenest-core
node --import tsx --test \
  src/lib/educational-cognition/cognition-governance.contract.test.ts \
  src/lib/educational-cognition/persistence-governance.contract.test.ts \
  src/lib/educational-cognition/adaptive-recommendation.contract.test.ts \
  src/lib/educational-cognition/telemetry-e2e-governance.contract.test.ts \
  src/lib/educational-cognition/dashboard-governance.contract.test.ts \
  src/lib/educational-cognition/cognition-repair.contract.test.ts \
  src/lib/educational-cognition/cognition-integrity.contract.test.ts \
  src/lib/educational-cognition/cognition-versioning.contract.test.ts \
  src/lib/educational-cognition/cognition-persistence-observability.contract.test.ts
npm run audit:rn-coaching-governance
```

## Production hardening pass (final)

### Production persistence lifecycle

- **`persistence-runtime-governance.ts`** — deploy gate (`assertPersistenceRuntimeReady`), bootstrap, write-read verification.
- **`cognition-persistence-observability.ts`** — schema probe, `persistence_cache_rehydrated`, non-silent memory fallback warnings.
- Production requires `learner_cognition_envelope` when `NODE_ENV=production` or `NN_ENFORCE_COGNITION_PERSISTENCE=1`.

### Ontology evolution governance

- **`ontology-migration-registry.ts`** + **`ontology-lifecycle-governance.ts`** — revision lineage, aliases, deprecated nodes, focus-area renames.
- Applied in `prepareDurableCognitionEnvelope` before persist.

### Replayable cognition runtime

- **`cognition-replay-runtime.ts`** + **`graph-continuity-replay.ts`** — hydration replay, continuity checkpoint restore, version diffs (diagnostics only).

### Explainability and auditability

- **`cognition-explainability.ts`** — `derivedFrom`, signals, `confidenceTier`, `recommendationReason` on adaptive outputs.
- Audit-safe telemetry via `serializeExplainabilityForAudit`.

### Telemetry isolation model

- **`telemetry-route-classification.ts`** — public marketing vs authenticated learner partitions.
- **`telemetry-isolation-governance.ts`** — PostHog allowlists, psychometric key stripping on public routes.

### Continuity recovery strategy

- Repair pipeline + graph continuity replay + ontology migration without destructive resets unless `corrupted`.

### Educator longitudinal analytics

- **`educator-cognition-aggregation.ts`** + **`cognition-longitudinal-observability.ts`** — cohort summaries only (no raw envelopes).

## Remaining semantic debt

| Item | Notes |
|------|--------|
| `buildPersonalizedWeakAreaStudyPlan` | Retained for admin weak-area debug only; learner API migrated to cognition study plan. |
| Full `buildAdaptiveRecommendations` removal | Exam-calendar shell still used for countdown/milestones; next action ordering is cognition-governed. |
| Prisma column deploy | Run `prisma/manual/learner-cognition-envelope.sql` on production before relying on cross-device DB continuity. |
| Playwright auth matrix | PostHog event capture under signed-in LOFT sessions (needs test user fixture). |
| Measurement live vitals | Catalog defaults are pedagogical placeholders until vitals API feeds real `valueSi` streams. |

## Figma / visual

No learner layout changes in this pass — orchestration and persistence only.
