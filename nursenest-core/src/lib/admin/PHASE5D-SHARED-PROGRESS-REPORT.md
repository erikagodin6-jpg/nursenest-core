# Phase 5D — Shared learner progress & adaptive state

> `reports/` may be `.cursorignore`d — this file lives under `src/lib/admin/` for version control.

## Goal

One **canonical DB-backed** source for bounded progress aggregates consumed by admin adaptive summary, `/app` RSC, and `GET /api/learner/adaptive-recommendations` (same `userId` / session → same Prisma rows). No parallel “mobile-only” progress tables.

## Adapter surface (`src/lib/learner/shared-learner-progress.server.ts`)

| Export | Role |
|--------|------|
| `loadSharedLearnerProgressBundle(userId)` | Single bounded `Promise.all` over `UserTopicStat`, latest `PracticeTest`/`ExamSession` `adaptiveState` (JSON), and recent slices of `Progress`, `PracticeTest`, `ExamSession`, `ExamAttempt`, `FlashcardStudySession` for **activity labels only** (no stems). |
| `mergedPerformanceFromLatestAdaptiveRows({ practiceAdaptiveState, examAdaptiveState })` | Pure merge of `_v:1` `performance` blobs; prefers the side with more `bySystem` attempts (same rule as pre-5D admin). |
| `mergePerformanceProfilesPreferringMoreAttempts(a, b)` | Pure helper for tests / reuse. |
| `extractPerformanceProfileFromAdaptiveJson(raw)` | Safe extract; re-exported from `adaptive-learner-summary.server.ts` for existing imports. |
| `buildSharedRecentActivityRows({ progActs, ptActs, … })` | Pure merge/sort/cap for recent-activity cards (used by the bundle loader; exported for deterministic tests). |
| `SharedLearnerProgressBundle` | `topicRows`, `mergedPerformanceProfile`, `adaptiveSnapshot`, `recentActivity` — **counts/metadata only**. |

**Callers**

- `loadAdaptiveLearnerAdminSummary` — uses full bundle; `resolveEntitlement` unchanged (server-only).
- `loadLearnerAdaptiveWireBundle` — when `catOrPracticeProfile` is **not** explicitly passed in `options`, loads bundle and sets `mergedPerformanceProfile` for weak-signal math + `buildLearnerFacingProgressSummary` (aligns learner API with admin).
- `buildPracticeAdaptivePostMissPayload` — injects merged profile into adaptive wire context.

## Audit — progress-writing surfaces (client vs DB)

| Surface | Write location | Prisma / persistence | Client-only? |
|--------|----------------|----------------------|--------------|
| **Pathway / content lessons** | `POST` `/api/lessons/progress`, `/api/lessons/pathway-progress` | `progress.upsert` | DB |
| **Pre-nursing lessons** | `POST` `/api/learner/pre-nursing-progress` | `progress.upsert` | DB |
| **Flashcards** | `POST` `/api/flashcards/decks/[deckRef]/study` (upsert), `review` | `flashcardStudySession` | DB |
| **Practice / bank / lesson-linked loops** | `practice-tests` routes, `lesson-bank-study-loop-store`, `lesson-assessment-store` | `practiceTest.create` / `update` | DB |
| **NP-CAT / adaptive JSON** | `session-persistence` (`practiceTest` rows), practice routes | `practiceTest` `adaptiveState` JSON | DB |
| **Exam mocks / CAT sessions** | `exams/start`, `exams/session`, `exams/submit` | `examSession` + `examAttempt` | DB |
| **Topic ledger** | `recordTopicOutcomesSequential` (`topic-performance.ts`) | `userTopicStat` create/update | DB |
| **Demo / ops** | `create-demo-user` | `progress.createMany` (seed-style) | DB |
| **ECG / labs / allied** | No separate progress tables found in audit; allied uses pathway/topic filters on existing `UserTopicStat` / dashboard loaders — same canonical tables when writes occur via practice/lessons above. | Uses shared reads where applicable | N/A (no isolated mobile store) |

**Conclusion:** All high-volume learner progress paths audited here persist to **existing** models (`Progress`, `PracticeTest`, `ExamSession`, `ExamAttempt`, `FlashcardStudySession`, `UserTopicStat`). Phase 5D **documents only** — no new tables.

## Constraints honored

- No stems/rationales/full question text in admin output (unchanged Phase 5C contract).
- Entitlements: `resolveEntitlement` / subscriber gates unchanged; no duplicate subscription logic in the adapter.
- Bounded queries (`take` caps exported as `SHARED_LEARNER_PROGRESS_*`).

## Validation (runner should execute)

```bash
npm run test:unit:practice
npm run test:unit:flashcards
node --import tsx --test src/lib/admin/adaptive-learner-summary-admin.test.ts
node --import tsx --test src/lib/admin/adaptive-summary-api-route.contract.test.ts
node --import tsx --test src/lib/learner/shared-learner-progress.server.test.ts
node --import tsx --test src/lib/learner/build-learner-adaptive-wire-bundle.test.ts
npm run typecheck:critical
```

Full repo `typecheck` / build **137** — not claimed green here; document only.
