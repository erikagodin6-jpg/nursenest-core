# UI surface inventory

**Generated:** 2026-05-11T04:26:12.374Z
**Total audited routes (from shards):** 1
**Expected routes (catalog):** 26

Coverage matrix — `✓` indicates a capture exists for this slice; `—` means the matrix slice has no recorded shard (either the route was skipped or the audit hasn't run for it). **Baseline** / **Figma** use shard metadata when present, else fall back to a filename heuristic under `baselines/` / `figma/`.

| Route | Mobile | Authenticated | Ocean | Blossom | Midnight | Sunset | Aurora | Baseline | Figma |
|-------|--------|---------------|-------|---------|----------|--------|--------|----------|-------|
| public-home | — | — | ✓ | — | — | — | — | — | — |

## Catalog coverage

### Missing routes (in catalog, no shard in this run)

- `auth-account`
- `auth-account-settings`
- `auth-cat-hub`
- `auth-cat-launch`
- `auth-dashboard`
- `auth-flashcards-hub`
- `auth-lesson-detail`
- `auth-lessons-hub`
- `auth-practice-hub`
- `learner-allied-premium-preview`
- `learner-cat-results`
- `learner-cat-session`
- `learner-flashcard-session`
- `learner-labs-ventilator-preview`
- `learner-practice-session`
- `learner-report-card`
- `public-allied-hub`
- `public-allied-mlt`
- `public-allied-respiratory`
- `public-blog`
- `public-blog-article`
- `public-marketing-lesson`
- `public-np-hub`
- `public-rn-hub`
- `public-rpn-hub`


## Routes captured by category

### public (1)

- `public-home`

### authenticated (0)


### learner (0)


## Known gaps

- Routes with **no Figma baseline** rely on the implementation as source of truth — populate `FIGMA_FRAME_MAP` in `tests/e2e/helpers/aesthetic-audit-config.ts` once frames are approved.
- Routes with **no pixel baseline** under `docs/screenshots/aesthetic-audit-2026/baselines/` cannot fail the diff gate; promote a clean capture to baseline with `cp docs/screenshots/aesthetic-audit-2026/<surface>/<name>.png docs/screenshots/aesthetic-audit-2026/baselines/<name>.png`.
- Learner session routes are flagged `optional` and skip gracefully when seeded fixtures are missing; refresh seeds via `npm run seed:auth-qa`.
