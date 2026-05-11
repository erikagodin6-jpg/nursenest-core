# UI surface inventory

**Generated:** 2026-05-11T02:21:07.659Z
**Total audited routes:** 1

Coverage matrix — `✓` indicates a capture exists for this slice; `—` means the matrix slice has no recorded shard (either the route was skipped or the audit hasn't run for it).

| Route | Mobile | Authenticated | Ocean | Blossom | Midnight | Baseline | Figma |
|-------|--------|---------------|-------|---------|----------|----------|-------|
| public-home | — | — | ✓ | — | — | — | — |

## Routes captured by category

### public (1)

- `public-home`

### authenticated (0)


### learner (0)


## Known gaps

- Routes with **no Figma baseline** rely on the implementation as source of truth — populate `FIGMA_FRAME_MAP` in `tests/e2e/helpers/aesthetic-audit-config.ts` once frames are approved.
- Routes with **no pixel baseline** under `docs/screenshots/aesthetic-audit-2026/baselines/` cannot fail the diff gate; promote a clean capture to baseline with `cp docs/screenshots/aesthetic-audit-2026/<surface>/<name>.png docs/screenshots/aesthetic-audit-2026/baselines/<name>.png`.
- Learner session routes are flagged `optional` and skip gracefully when seeded fixtures are missing; refresh seeds via `npm run seed:auth-qa`.
