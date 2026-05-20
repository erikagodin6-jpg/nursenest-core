# Phase 5 — Adaptive learning (foundation + 5B wiring)

## Status: wired (5B)

Phase 5B connects the deterministic adaptive engine to authenticated `/app` surfaces behind **`ADAPTIVE_LEARNING_ENABLED`** (default **off** unless set to `true` or `1`).

### Flag

| Name | Default | Purpose |
|------|---------|---------|
| `ADAPTIVE_LEARNING_ENABLED` | **false** | Gates `GET/POST` learner adaptive APIs, dashboard adaptive section, and linear practice post-miss fetch. |

### Endpoints (subscriber-only)

- `GET /api/learner/adaptive-recommendations` — bounded JSON: recommendations + `buildLearnerFacingProgressSummary` slice + rationale lines.
- `POST /api/learner/adaptive-post-miss` — body `{ pathwayId, missedTopicKey? }`; returns narrowed `composePostMissStudyPlan` output.

Both use `requireSubscriberSession()` (paid + staff/admin bypass). Unpaid → **403** `not_subscribed` (existing gate). Feature off → **403** `{ locked: true, code: "adaptive_learning_disabled" }`.

### Server adapter

- `src/lib/learner/learner-performance-to-weakness-signals.ts` maps existing **`TopicPerformanceSnapshot`**, **`WeakTopicRow`**, optional **`PerformanceProfile.byTopic`** only — no invented topic metrics; merges keys; `bumpTopicWeaknessSignal` for the active miss.

### UI

- Dashboard: `LearnerAdaptiveRecommendationsSection` (RSC) below `LearnerStudyHome` when flag on and non-durability skip; uses existing learner i18n keys for labels.
- Practice (linear, rationale after each): after an incorrect `linear_commit`, client `POST`s post-miss plan and shows `PracticeAdaptivePostMissPanel` in the rationale column. **CAT / exam-style paths unchanged** (no new hooks in `cat-advance-contract`).

### Validation commands (run locally)

1. `node --import tsx --test src/lib/adaptive-learning/adaptive-recommendation-engine.test.ts`
2. `npm run test:unit:practice`
3. `npm run test:unit:flashcards`
4. `npm run typecheck:critical`

Record exit codes in PR notes after CI/local runs.
