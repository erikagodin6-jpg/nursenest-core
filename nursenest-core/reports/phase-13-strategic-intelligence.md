# Phase 13 — Strategic intelligence & global clinical-education ecosystem foundations

**Status:** planning contracts in `src/lib/platform/phase13/` + this report. **No** identifiable learner exports, **no** cross-institution row-level analytics, **no** entitlement changes.

**Related:** Phase 12 (`reports/phase-12-platform-intelligence.md`), Phase 11 (`reports/phase-11-developer-platform.md`), `getUserAccess`, `@/lib/adaptive-learning`.

---

## 1. Analytics & learner data audit (summary)

| System | Strengths | Boundaries / privacy |
|--------|-------------|----------------------|
| Adaptive learning | Deterministic engine, pathway-scoped | Signals aggregated before any population benchmark |
| Cohort analytics | RBAC institutional capabilities (future routes) | Must enforce `institutionKey` + minimum cell size |
| Remediation / progress | Server-side study surfaces | No stable learner ids in public benchmark tiles |
| Institutional foundations | Capability matrix documented | Federation compares **aggregates** only |
| Engagement / recommendations | Explainability types (Phase 12) | Opt-in for research-grade pipelines |
| Admin analytics | Staff-gated | QA overlays excluded from learner BI |
| Content quality | Finding kinds (Phase 12) | Human review before publish impact |

**Gaps:** longitudinal cohort studies need explicit retention classes; cross-campus rollups need shared `orgRoot` without mixing learners.

**Benchmarkable metrics:** pathway completion velocity, weak-topic rates (aggregated), remediation cycles per topic bucket, blueprint domain error rates (aggregated).

---

## 2. Benchmarking architecture (contracts)

**File:** `benchmarking-architecture.ts` — `BenchmarkingDomain`, `BenchmarkAggregateBucket` (institution + pathway + period + cell policy; **no** learner ids).

**Strategy:** publish only buckets passing k-anonymity; national tiles = differential privacy or hierarchical Bayesian (implementation deferred).

---

## 3. Workforce-readiness intelligence (direction)

**File:** `workforce-readiness-intelligence.ts` — `WorkforceReadinessSignalFamily`, `WorkforceReadinessExplanation` with `nonDiagnosticDisclaimer: true`.

**Rules:** confidence-bounded; structured reasons; deterministic adaptive fallback when sparse.

---

## 4. Institutional analytics federation (direction)

**File:** `institutional-analytics-federation.ts` — `FederationAnalyticsSurface`, `InstitutionAnalyticsQueryScope`.

**Rules:** cohort comparison **same institution** only unless using anonymized public tiles; `actorStaffSubjectId` resolved server-side.

---

## 5. Governance & privacy (strategic)

**File:** `governance-privacy-strategic.ts` — `AnonymizationStrategyId`, `ResearchParticipationClass`, `StrategicAuditEventKind`.

**Strengthening:** audit export start/complete, cross-scope denials, benchmark tile publication.

---

## 6. Strategic reporting infrastructure (direction)

**File:** `strategic-reporting.ts` — `StrategicReportKind`, `StrategicReportEnvelope` (template version + title slug for logs; full body in secure store).

---

## 7. Institutional gaps & research network (future)

- Accreditation packs: export job + human sign-off.
- Research collaboration: federated learning or aggregate-only sharing — **opt-in** with `ResearchParticipationClass`.
- Network effects: pathway health **across** institutions only via pre-approved benchmark repository.

---

## 8. Risks

- Re-identification via small cohorts — enforce cell floors.
- Overcollection — default to aggregate-only; expand only with consent artifacts.
- Compliance — map retention ids to legal review; this doc is not legal advice.

---

## 9. Code map

| Path | Role |
|------|------|
| `src/lib/platform/phase13/*.ts` | Phase 13 contracts |
| `src/lib/entitlements/get-user-access.ts` | Entitlement isolation |
| `src/lib/platform/phase12/*` | Operational / predictive foundations |

---

## 10. Validation

```bash
cd nursenest-core
npm run test:unit:phase13-strategic-intelligence
npm run typecheck
npm run build
```

Release / mobile smoke: unchanged (no routes touched).

---

## 11. Constraints checklist

- [x] No identifiable learner analytics in public contracts.
- [x] Institutional isolation preserved in federation types.
- [x] No unsafe predictive medical/academic claims in identifiers.
- [x] No entitlement bypass.
- [x] Deterministic fallback reporting preserved by architecture notes.
- [x] Avoid overcollection — research classes explicit.
