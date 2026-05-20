# Educational cognition convergence pass

## Summary

This pass completes the transition from governed feature silos to a single **educational cognition orchestration substrate** centered on `resolveEducationalCognitionContext()`.

## Dashboard orchestration consolidation (P0)

- `loadLearnerDashboard` now calls `resolveDashboardEducationalCognition()` after `computeReadiness`.
- `LearnerDashboardModel` and `PremiumDashboardSnapshot` expose `cognition: LearnerDashboardCognitionSurface`.
- `learner-study-home` uses `snapshot.cognition.showAdaptivePlan` when present (falls back to study settings).
- Server emits `cognition_context_resolved` via `captureCognitionOrchestratedEvent` on dashboard load.

## Readiness semantic centralization (P0)

- `applyReadinessPresentationPolicy()` in `policies/readiness-policy.ts` is the presentation authority.
- `computeReadiness({ pathwayId })` applies policy at the end of scoring.
- Pass-outlook factors and precision language are stripped on LOFT/CNPLE semantics.

## Client telemetry hardening (P0)

- `client-telemetry-governance.ts` blocks/renames `cat_*` and forbidden psychometric props on LOFT.
- `practice-test-runner-client` governs dev session logs and captures `learner_practice_test_session_completed` through governed client capture.

## Measurement intelligence (P1)

- `measurement-cognition-bridge.ts` integrates prioritization into cognition context (`measurement` slice).
- Ontology registry expanded with `telemetryNamespaces` and `remediationPathwayIds`.

## Telemetry V5

Canonical events in `COGNITION_TELEMETRY_EVENTS`:

- `cognition_context_resolved`
- `dashboard_widget_rendered`
- `remediation_sequence_started`
- `readiness_surface_opened`
- `measurement_interpretation_started`
- `ai_governance_blocked`
- `psychometric_violation_detected`

Envelope adds: `competency_id`, `remediation_pathway`, `learner_state_reason`, `measurement_priority`, `ontology_namespace`, `source_surface`.

## Remaining semantic debt

| ID | Item | Priority |
|----|------|----------|
| TD-C01 | Wire `load-report-card-data` and `adaptive-recommendations` through cognition resolver | P1 |
| TD-C02 | `recordCognitionContextResolved` server capture when entitlement is available in resolver | P2 |
| TD-C03 | E2E PostHog payload audit in CI (browser contract) | P1 |
| TD-C04 | `cnple-readiness-scoring.ts` delegate presentation to readiness-policy | P1 |
| TD-C05 | Global marketing copy governance on study hubs | P2 |

## Verification

```bash
cd nursenest-core
node --import tsx --test src/lib/testing/psychometric-orchestration.contract.test.ts
node --import tsx --test src/lib/educational-cognition/dashboard-governance.contract.test.ts
node --import tsx --test src/lib/educational-cognition/telemetry-v5.contract.test.ts
node --import tsx --test src/lib/educational-cognition/client-telemetry-governance.test.ts
npx tsx scripts/audit-educational-cognition-governance.ts
```
