# Educational Cognition OS — convergence pass (report card + adaptive + authority)

## Summary

This pass completes the transition from governed integrations to a **unified Educational Cognition Operating System** substrate:

`resolveEducationalCognitionContext()` + `orchestrateEducationalGraph()` + `RnLearnerStateSnapshot`

## P0 — Report card orchestration

- `report-card-cognition.ts` — `resolveReportCardCognitionOrchestration()` wires readiness, graph steps, remediation caps, telemetry V5.
- `load-report-card-data.ts` returns `cognition: ReportCardCognitionOrchestration` on full and degraded paths.
- Readiness uses `pathwayId` + `applyReadinessPresentationPolicy()` on degraded loads.

## P0 — Adaptive recommendation convergence

- `adaptive-recommendation-cognition.ts` — `buildGovernedAdaptiveRecommendations()` uses `resolveLearnerCognitionSubstrate()`, graph-primary overlay, fatigue caps, pass-outlook suppression.
- Wired: `learner-insight-engine`, `coach-page-data`, study-plan page, account overview.

## P0 — Readiness semantic finalization

- `presentCnpleReadinessForPathway()` + `presentGovernedCnpleReadinessReport()` delegate CNPLE presentation to `readiness-policy.ts`.
- Domain scoring remains in `cnple-readiness-scoring.ts`; presentation is policy-governed.

## P1 — Server telemetry normalization

- `recordCognitionContextResolvedWithEntitlement()` — PostHog + coaching telemetry on dashboard, report card, resolver surfaces.

## P1 — E2E telemetry governance

- `telemetry-e2e-governance.contract.test.ts` — LOFT `cat_*` rename, forbidden props, V5 envelope fields.

## P1 — Measurement cognition deepening

- `buildMeasurementCognitionSlice()` — graph node linkage, interpretation guides, bedside escalation kinds.

## Semantic authority enforcement

- `scripts/audit-semantic-authority.ts` — CI checks for report card + adaptive + CNPLE policy wiring.

## Cognition persistence

- `learner-cognition-persistence.ts` — in-memory durable store with fingerprint reconciliation (Prisma JSON column planned).

## Verification

```bash
cd nursenest-core
node --import tsx --test src/lib/educational-cognition/*.contract.test.ts
node --import tsx --test src/lib/testing/psychometric-orchestration.contract.test.ts
npx tsx scripts/audit-educational-cognition-governance.ts
npx tsx scripts/audit-semantic-authority.ts
```

## Remaining semantic debt

| ID | Item | Priority |
|----|------|----------|
| TD-OS01 | Prisma-backed `RnLearnerStateSnapshot` persistence | P1 |
| TD-OS02 | Report card UI consume `cognition.graphNextSteps` | P2 |
| TD-OS03 | `build-learner-adaptive-wire-bundle` → cognition substrate | P1 |
| TD-OS04 | Browser PostHog capture audit in Playwright CI | P1 |
| TD-OS05 | `build-study-plan` API use `presentGovernedCnpleReadinessReport` | P2 |
