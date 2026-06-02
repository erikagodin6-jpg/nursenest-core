# Phase 12 — Autonomous operations & platform intelligence foundations

**Status:** planning contracts in `src/lib/platform/phase12/` + this report. **No** autonomous production writes, **no** new public learner analytics APIs, **no** change to entitlement gates.

**Related:** Phase 11 (`reports/phase-11-developer-platform.md`), Phase 10 (`reports/phase-10-ecosystem-platform.md`), adaptive learning (`src/lib/adaptive-learning/`).

---

## 1. Observability & diagnostics audit (summary)

| Area | Strengths | Blind spots / noise risks |
|------|-------------|---------------------------|
| Release QA / gates | Structured failures in CI | Flaky tests masking regressions; need **clustering** by failure signature |
| Mobile E2E | Layout health helpers | Overflow **hotspots** need aggregation, not per-pixel noise |
| Flashcards inventory | Aggregate counts, diagnostics | Mismatch vs CAT pool — correlate with pathway + build phase |
| Lesson normalization | Coverage reports | Drift between index and runtime cards |
| Entitlements | `getUserAccess`, subscriber gates | Spike detection on `entitlement_resolve_failed` without blaming users |
| Stripe / subscriptions | Webhooks, reconciliation | Lag between webhook and UI — alert on **lag**, not every retry |
| Adaptive learning | Deterministic engine + types | Empty-fallback **spikes** — distinguish “no weak signals” vs config errors |
| Admin analytics | Staff-only surfaces | Ensure QA overlays never pollute learner BI |

**Recurring regressions:** hydration / client bundle size, inventory parity, i18n placeholder drift.

**Manual bottlenecks:** triaging release gate logs, content publish QA, subscription edge cases.

---

## 2. Platform intelligence layer (contracts)

**Files:** `observability-intelligence.ts` — `OperationalSignalKind`, `AnomalySeverity`, `OperationalAnomalyExplanation` (explainable, no PII).

**Principles:** aggregate before paging; deterministic thresholds first; ML as optional layer with fallback.

---

## 3. Predictive learner analytics (direction)

**File:** `predictive-learner-analytics.ts` — `LearnerPredictionFamily`, `PredictionExplainabilityArtifact`.

**Rules:**
- Pathway-scoped only; **no** unverifiable clinical or exam-pass guarantees.
- `structuredReasons` + `topFeatureKeys` for audit; confidence bounded 0–1.
- **Always** retain deterministic adaptive output when confidence low or data sparse.

---

## 4. Automated content quality (direction)

**File:** `content-quality-automation.ts` — `ContentQualityCheckKind`, `ContentQualityFinding`.

**Workflow:** scanners → findings → **admin review** → optional publish block (`block_publish`) — never silent auto-edit in prod.

---

## 5. AI-assisted operational diagnostics (direction)

**File:** `operational-diagnostics.ts` — `OperationalDiagnosticReportKind`, `OperationalDiagnosticSummary`.

**Scope:** summaries and suggested next steps for humans; **no** auto-rollback, no secret/env echo.

---

## 6. Intelligent remediation orchestration (direction)

**File:** `remediation-orchestration.ts` — `RemediationOrchestrationIntent`, `RemediationEscalationLevel`.

**Alignment:** extends adaptive direction; cross-surface handoffs (lesson ↔ flashcards ↔ practice) stay entitlement-aware.

---

## 7. Governance & safety

**File:** `governance-safety.ts` — `AiRecommendationAuditRecord`, `AnalyticsRetentionClass`, `OperationalHumanReviewAction`.

**Requirements:** log AI serve/accept/dismiss/override; human review for operational incidents; retention classes for privacy-by-design.

---

## 8. Remaining risks

- Over-alerting erodes trust — use `AnomalySeverity` + rollups.
- Explainability drift if LLM prose enters critical path — keep structured reasons for high-stakes surfaces.
- Cohort analytics re-identification — minimum cell sizes / suppression (product).

---

## 9. Code map

| Path | Role |
|------|------|
| `src/lib/platform/phase12/*.ts` | Phase 12 contracts |
| `src/lib/adaptive-learning/*` | Deterministic fallback engine |
| `src/lib/entitlements/get-user-access.ts` | Access source of truth |

---

## 10. Validation

```bash
cd nursenest-core
npm run test:unit:phase12-platform-intelligence
npm run typecheck
npm run build
```

Release / mobile smoke: unchanged unless routes touched (they are not in this phase).

---

## 11. Constraints checklist

- [x] No auto-modify production content without review.
- [x] No entitlement or moderation bypass.
- [x] No public unsafe learner analytics.
- [x] No unverifiable clinical advice in contracts.
- [x] Deterministic adaptive fallback preserved by design docs + types.
- [x] Low-noise telemetry via severity + aggregation guidance.

**See also:** [Phase 13 strategic intelligence](./phase-13-strategic-intelligence.md) — benchmarking, workforce readiness, federation, privacy.

