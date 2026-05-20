# RN Coaching Intelligence — Fourth-Pass Integration

## Summary

The fourth pass unifies all major learner surfaces on `buildRnCoachingIntelligenceReport()` via `coaching-orchestration.ts`. Legacy `post-exam-coaching/build-coaching-report.ts` now delegates to the RN engine; UI, dashboard, study plan, remediation traversal, AI tutoring, telemetry, and CI governance consume the same learner-state snapshot.

## 1. Post-exam report (P0)

| Item | Location |
|------|----------|
| Unified builder | `coaching-orchestration.ts` → `buildOrchestratedPostExamReport()` |
| Legacy shim | `post-exam-coaching/build-coaching-report.ts` |
| UI panels | `post-exam-coaching-intelligence-panels.tsx` (competency clusters, trajectory, timing V2, reasoning, remediation ladder) |
| Shell | `post-exam-adaptive-report.tsx` |
| Context API | `GET /api/learner/post-exam-coaching-context` → `learner-coaching-context-loader.ts` |

## 2. Dashboard orchestration V3

| Item | Location |
|------|----------|
| Composer | `dashboard-orchestration-v3.ts` |
| UI | `learner-coaching-dashboard-panel.tsx` + `post-exam-dashboard-bridge.tsx` |
| Wired on | `learner-study-home.tsx` |

Surfaces: persistent weak areas, pacing/hesitation profiles, momentum, unstable competency alerts, remediation fatigue, next-best-study cards.

## 3. Study plan orchestration

| Item | Location |
|------|----------|
| Planner | `study-plan-orchestration.ts` → `buildGovernedRnStudyPlan()` |

Derives blocks from `RnLearnerStateSnapshot` + `planRemediationV3` with fatigue-aware spacing and deduplicated hrefs. Integrate into `/app/study-plan` via `PersonalizedWeakAreaStudyPlanPanel` when product wires the hook.

## 4. Remediation traversal

| Item | Location |
|------|----------|
| Unified hrefs | `remediation-traversal.ts` |
| Graph steps | `competency-graph-orchestration.ts` |
| Breadcrumbs | `remediation-navigation.ts` (default `linear_practice`, not `standard`) |

## 5. Timing intelligence UI

| Item | Location |
|------|----------|
| Safe cards | `timing-insights-ui.ts` |
| Engine | `timing-intelligence-v2.ts` |

Low-confidence inferences suppressed via `minSignals` and low-reliability gates.

## 6. Reasoning taxonomy UI

| Item | Location |
|------|----------|
| Ontology | `rn-reasoning-ontology.ts` |
| UI helpers | `reasoning-insights-ui.ts` |

Used in post-exam panels, dashboard copy, and AI tutor envelope.

## 7. Measurement + interpretation

Measurement weakness tags flow through `learner-state-types.measurementWeaknesses` into coaching reports and `buildAiTutorContextEnvelope()`. Educational cognition resolver (`resolve-educational-cognition-context.ts`) remains the cross-surface orchestrator.

## 8. AI tutor orchestration

| Item | Location |
|------|----------|
| Envelope | `ai-tutor-context-envelope.ts` |
| Session hook | `resolveEducationalCognitionFromSession()` sets `aiTutorEnvelope` |

Psychometric-safe: `softenPredictions`, governed copy, no guaranteed-pass language.

## 9. Longitudinal persistence

| Layer | Location |
|-------|----------|
| Client | `learner-state-store.ts` (localStorage) |
| Optional server | `POST/GET /api/learner/rn-coaching-state` + `learner-state-server-sync.ts` (in-memory until DB field approved) |

## 10. Telemetry

Extended events in `coaching-telemetry.ts`: study-plan completion, timing insight views, remediation fatigue, recommendation fatigue, AI tutor envelope, drift/volatility signals.

## 11. CI governance

```bash
node nursenest-core/scripts/audit-rn-coaching-governance.mjs
```

Checks: ontology size, remediation default model, psychometric copy scan, timing suppression, post-exam delegation, learner-state schema version.

## 12. Tests

`rn-coaching-intelligence.test.ts` — orchestration, timing suppression, AI envelope, study plan dedupe, dashboard V3 bounds.

## Remaining technical debt

1. **Server persistence** — `/api/learner/rn-coaching-state` is process-local; needs approved JSON column or KV before multi-device continuity.
2. **Study plan UI hook** — `buildGovernedRnStudyPlan()` not yet mounted on `study-plan/page.tsx` (server page uses `buildPersonalizedWeakAreaStudyPlan`).
3. **Measurement registry** — deepen links from interpretation engine into `measurementWeaknesses` tags (currently session-derived).
4. **Playwright** — extend `post-exam-coaching-report.spec.ts` for new intelligence panels.
5. **Figma parity** — intelligence panels need design frames per `figma-premium-ui-mandatory-process.md` before major visual iteration.

## Future architecture hooks

- Conversational tutoring: consume `AiTutorContextEnvelope` in AI routes.
- Educator/cohort dashboards: aggregate `stateFingerprint` + competency volatility (privacy-safe).
- Adaptive sequencing: `study-plan-orchestration` + `planRemediationV3` rotation.
- Semantic educational search: `EducationalOntologySlice` + reasoning ontology codes.
