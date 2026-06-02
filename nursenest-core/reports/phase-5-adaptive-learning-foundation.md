# Phase 5 — Adaptive learning & clinical differentiation foundations

**Scope:** Surgical library under `src/lib/adaptive-learning/` (no learner route rewrites, no new public HTTP APIs, no Prisma migrations). Pathway and entitlement isolation are **caller-enforced**; engine output is deterministic and fail-closed.

## 1. Audit — CAT, flashcards, practice, linked learning, progress

### CAT / practice tests

- **`PracticeTest`** (`prisma/schema.prisma`): `config`, `questionIds`, `answers`, `results`, `adaptiveState` — NP CAT persistence and completion snapshots (`src/lib/cat/session-persistence.ts`).
- **Engine & scoring:** `src/lib/cat/types.ts` (`AnswerRecord`, `PerformanceProfile`, `CatQuestion`), `readiness-scorer.ts`, `performance-tracker.ts` (`identifyWeakDimensions`, `WEAK_AREA_THRESHOLD` / `STRONG_AREA_THRESHOLD`, `MIN_RELIABLE_SAMPLE`).
- **Advance / entitlement:** `src/lib/practice-tests/cat-session.ts` — `advanceCatPracticeTest` takes `AccessScope`; pathway + bank gates must stay server-side.

### Flashcards

- **`FlashcardProgress`**: SM-2 fields (`ease_factor`, `interval_days`, `last_quality`, `next_review_at`) — good per-card signals; **topic-level weakness** for the engine requires upstream aggregation keyed to `bidirectionalTopicKey` / deck taxonomy.
- **`FlashcardStudySession`**, **`FlashcardUserStats`**: session queue + streak aggregates.

### Linear exam sessions

- **`ExamSession`**: `adaptiveState`, `examMode` — parallel to practice CAT but exam-scoped.

### Linked learning (cross-surface)

- **`pathway-lesson-linked-learning-assets.ts`**: `computePathwayLessonLinkedLearningSignals`, `deriveCanonicalStudyTopicSlug`, `pathwayCatPoolSurfaceAvailable`, gates for `adaptiveLearningReadiness`.
- **`pathway-lesson-types.ts`**: `PathwayLessonLinkedLearningSignals` — canonical `bidirectionalTopicKey` + booleans for flashcards, questions, CAT pool.

### Lesson progress

- **`Progress`**: per-lesson `completed`, `engagedAt` — not topic accuracy; use for “resume lesson” not weak-topic ranking.

### Remediation

- **No dedicated remediation queue table** in schema slice reviewed; remediation is **derived** from answer history + `PerformanceProfile` dimensions today.

### Gaps

- No single server helper yet builds `TopicWeaknessSignalInput[]` from DB — Phase 5 engine expects **caller-supplied** aggregates.
- **Cross-topic links** beyond shared `topicSlug` / `bidirectionalTopicKey` are not modeled centrally.
- **Confidence:** CAT readiness object exists in cat stack; recommendation bundle uses optional `masteryEstimate` from caller instead of recomputing readiness here.

### Truthpack / product tiers

- `.vibecheck/truthpack/product.json` was **not present** in this workspace clone. RN/RPN/NP/allied branching uses existing **`ExamPathwayDefinition.roleTrack`** and catalog metadata (`examKey`, `stripeTier`) via `getExamPathwayById` — no invented tier names.

## 2. Canonical service (`src/lib/adaptive-learning/`)

| File | Responsibility |
|------|----------------|
| `adaptive-recommendation-engine.ts` | `rankWeakTopics`, lesson/flash/CAT hints, `pathwayMetadataForAdaptive`, `adaptiveRoleTrackStudyNotes`. |
| `adaptive-learning-types.ts` | Input/output DTOs (only existing pathway + lesson types). |
| `post-miss-orchestration.ts` | `composePostMissStudyPlan` — thin composition + surface order by trigger. |
| `learner-analytics-summary.ts` | `buildLearnerFacingProgressSummary` — bounded system summaries from `PerformanceProfile`. |
| `clinical-scenario-contracts.ts` | OSCE/ECG **future** branching + timed step + analytics **stubs**. |
| `ai-recommendation-guardrails.ts` | Policy comments + optional AI planner input types. |
| `index.ts` | Barrel exports for **server** consumers. |

## 3. Cross-surface orchestration

- **`composePostMissStudyPlan`** — optional adapter for post–CAT miss / practice miss / flashcard struggle. **Not wired** to pages or APIs in this phase (no dedicated feature flag found).

## 4. Clinical scenario foundation

- TypeScript interfaces only (`ClinicalBranchingScenarioContract`, `ClinicalTimedStepHookContract`, `ClinicalRationaleProgression`, `ClinicalScenarioAnalyticsEventStub`). **No** OSCE/ECG runtime or migrations.

## 5. Learner analytics (structured, non-sensitive)

- **`buildLearnerFacingProgressSummary`**: strongest/weakest **systems** + trend placeholders; empty-safe when profile null. **Do not** import on marketing/public SEO routes.

## 6. AI guardrails

- Documented in `ai-recommendation-guardrails.ts`: pathway scope, entitlement before any suggestion surface, deterministic fallback chain, no fabricated progress, optional AI only as constrained planner input.

## 7. Flows

1. Server aggregates misses → `TopicWeaknessSignalInput[]` within one `pathwayId`.
2. Optional anchor `PathwayLessonLinkedLearningSignals` for the lesson/topic that triggered the miss.
3. `composePostMissStudyPlan` / `buildAdaptiveRecommendationBundleWithLessons` returns ranked topics + surface hints.
4. **Routes** re-validate paywall/entitlements before emitting links to `/app` premium surfaces.

## 8. Validation

| Command | Result |
|---------|--------|
| `node --import tsx --test src/lib/adaptive-learning/adaptive-recommendation-engine.test.ts` | **Pass** (9 tests) |
| `npm run test:unit:flashcards` | **Pass** (5 tests) |
| `npm run test:unit:practice` | **Pass** (1 test) |

`npm run typecheck` / `npm run build`: run in CI (full `tsc` exceeded comfortable agent wall time when attempted).

**Release / mobile configs:** not modified.

## 9. Public API surface (library only)

**Exports from `@/lib/adaptive-learning`:** `computeTopicUrgencyScore`, `rankWeakTopics`, `recommendLessonsForWeakTopics`, `recommendFlashcardsForTopics`, `buildPracticeCatHints`, `adaptiveRoleTrackStudyNotes`, `pathwayMetadataForAdaptive`, `buildAdaptiveRecommendationBundle`, `buildAdaptiveRecommendationBundleWithLessons`, `composePostMissStudyPlan`, `buildLearnerFacingProgressSummary`, `ADAPTIVE_MASTERED_TOPIC_THRESHOLD`, and type re-exports per `index.ts`.

**No new public HTTP APIs** and no hidden analytics payloads.
