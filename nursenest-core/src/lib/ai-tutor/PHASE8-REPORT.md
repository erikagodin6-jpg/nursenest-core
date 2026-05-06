# Phase 8 — AI tutor and clinical intelligence foundations

**Deliverable path:** Cursor `.cursorignore` blocks agent writes under `reports/`. Copy this file to `nursenest-core/reports/phase-8-ai-clinical-intelligence.md` in your checkout when syncing docs.

**Scope:** contracts, types, observability hooks only. No full tutor UI, no simulation product surface, no DB migrations, no new API routes.

## 1. Audit — existing learner intelligence touchpoints

### Adaptive engine (Phase 5 / study coach)

- `src/lib/study/adaptive-engine/adaptive-engine-data.ts` — `loadAdaptiveEngineData(userId, entitlement)`; returns `null` when `!entitlement.hasAccess`. Deterministic composites (time budget, weak dimensions, uplift).

### Adaptive recommendations + teaching loop

- `src/lib/learner/adaptive-recommendations.ts` — exam plan, next actions, recovery; consumes `AdaptiveTeachingLoopRecommendation`. Weak topics scoped upstream.
- `src/lib/learner/adaptive-teaching-loop.ts` — performance events → bounded Prisma loads → deterministic ranking. Natural seam for `ExplanationTrace` + tutor provider.

### CAT / questions / flashcards

- `src/lib/exams/cat-adaptive-policy.ts`, `src/lib/questions/adaptive-question-selection.ts`, flashcard SQL (`EXAM_QUESTION_NON_ECG_TAG_SQL`).

### Linked learning

- `PathwayLessonLinkedLearningSignals` in `pathway-lesson-types.ts`; href + gate assets.

### ECG / video

- Reset progress touches `ecgVideoQuestionPracticeAnswerAttempt`; bank metrics tag ECG/video modalities.

## 2. New modules (code)

| Path | Purpose |
|------|---------|
| `src/lib/ai-tutor/types.ts` | `TutoringEntitlementSnapshot`, `TutoringPromptContext`, `TutoringRecommendation`, `TutoringProvider` |
| `src/lib/ai-tutor/entitlement-guard.ts` | Pathway + access guards |
| `src/lib/ai-tutor/prompt-composition.ts` | Structured-only envelopes |
| `src/lib/ai-tutor/deterministic-fallback.ts` | Fallback chain |
| `src/lib/ai-tutor/tutoring-provider.ts` | `StubTutoringProvider` |
| `src/lib/ai-tutor/tutoring-provider-factory.ts` | `createTutoringProvider` |
| `src/lib/ai-tutor/audit-hooks.ts` | Metadata-only audit types |
| `src/lib/ai-tutor/explainable-remediation.ts` | `ExplanationTrace` |
| `src/lib/ai-tutor/safety-copy.ts` | Static disclaimers |
| `src/lib/ai-tutor/index.ts` | Barrel |
| `src/lib/clinical-simulation/contracts.ts` | Simulation state/events/hooks |
| `src/lib/clinical-media/ecg-video-session-types.ts` | Playback + rhythm contracts (gating comments) |
| `src/lib/observability/ai-clinical-telemetry.ts` | `safeServerLog` wrappers |

## 3. Safety and observability

- **Entitlement:** never run recommendations without `hasAccess` and non-empty `pathwayId`.
- **Medical advice:** educational framing only in composed prompts; no treatment generation in this layer.
- **PHI:** audit + telemetry carry counts, ids, timing, pathway — not stems or user narrative.
- **Events:** `ai_tutor_recommendation_ms`, `ai_tutor_fallback_used`, `simulation_tick_ms` (scope `ai_clinical_intelligence`).

## 4. Roadmap / risks

- Wire `ExplanationTrace` from adaptive teaching loop without logging stems.
- Real provider adapter: timeouts, redaction, cost caps, tier/pathway parity.
- Simulation: bound `events[]` before persistence.

## 5. Truthpack

`.vibecheck/truthpack/` was not found in this clone; tiers align with Prisma `TierCode` and `AccessScope`.
