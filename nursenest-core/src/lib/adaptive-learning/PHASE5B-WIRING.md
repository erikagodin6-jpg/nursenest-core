# Phase 5B — Adaptive learning wiring

## Feature flag

| Variable | Default | Meaning |
|----------|---------|--------|
| `ADAPTIVE_LEARNING_ENABLED` | **false** (unset or any value other than literal `true`) | Enables Phase 5B API, dashboard adaptive section, and practice linear **post-miss** adaptive payload. |

Set in the learner app environment (server). Not a `NEXT_PUBLIC_*` flag.

## Surfaces

- **API:** `GET /api/learner/adaptive-recommendations` — `requireSubscriberSession`, `dynamic = "force-dynamic"`, `Cache-Control: private, no-store` via `mergeSubscriberPrivateCacheHeaders`. Returns `{ featureEnabled: false }` when the flag is off (still requires auth + paid/staff for other branches).
- **Dashboard:** `/app` study hub renders `LearnerAdaptiveRecommendationsSection` when the flag is on (single `loadLearnerAdaptiveWireBundle` call per dashboard load).
- **Practice tests:** `PATCH` `linear_commit` in **linear practice** mode only — on an incorrect answer and flag on, response may include `adaptivePostMiss` from `buildPracticeAdaptivePostMissPayload`. **CAT** `cat_advance` and exam-simulation paths are unchanged.

## Foundation

Recommendation logic remains in `src/lib/adaptive-learning/*` (export-only pure engine). Wiring reuses `loadLearnerAdaptiveWireBundle` / `buildPracticeAdaptivePostMissPayload` in `src/lib/learner/build-learner-adaptive-wire-bundle.ts`.

## Reports

If `reports/` is unavailable in the workspace, this file is the canonical Phase 5B wiring note.

## Validation note

This repo’s `package.json` does **not** define `npm run test:unit:linked-learning-assets` (npm exits with “Missing script”). Use pathway linked-learning tests under `src/lib/lessons/` when that script exists upstream.

*Verified By VibeCheck ✅*
