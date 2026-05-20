# Stabilization — build & typecheck audit

**Date:** 2026-05-07  
**Repo:** `nursenest-core` (DigitalOcean `source_dir` = `nursenest-core/`)  
**Baseline context:** `reports/typecheck-baseline-audit.md`, `reports/build-instability-audit.md`, `reports/build-memory-hotspots.md`

## Executive summary

This pass focused on **bounded, CI-friendly checks** (avoid duplicate full `next build` / full `tsc` when memory is tight). The **critical TypeScript slice** and **paywall security unit suite** were executed successfully in this environment.

## Commands executed (this session)

| Command | Working dir | Result | Notes |
|--------|-------------|--------|-------|
| `npm run typecheck:critical` | `nursenest-core/` | **PASS** (exit 0) | Wall time ~356s; `tsconfig.typecheck-critical.json` |
| `npm run audit:paywall-security` | `nursenest-core/` | **PASS** | 12 tests, 0 failures |

## Deferred / not re-run (documented)

| Command | Reason |
|---------|--------|
| `npm run typecheck` (full tree) | High wall time + OOM risk on constrained agents; last documented baseline in `typecheck-baseline-audit.md` was green on 2026-05-06 — **re-run on CI or staging runner before promote**. |
| `npm run build` / `production:build` | Same constraint; production build remains the authoritative artifact gate. |
| `npm run qa:release-gate` | Requires Playwright webServer + creds per `docs/RELEASE_QA.md` — see `final-launch-blockers.md`. |

## Stability signals (existing automation)

- `npm run audit:build-stability` — listed as passing in `final-launch-blockers.md` (prior sweep).
- `npm run test:learner-shell-imports` — listed as passing (prior sweep).

## Recommendations (no code changes in this doc)

1. Keep **`typecheck:critical`** on every PR touching Stripe, auth, DB access, or subscription APIs.
2. After large refactors, run **`npm run typecheck`** on a machine with ≥8 GB Node heap (see `scripts/ensure-node-memory.mjs` patterns).
3. Treat **`audit:paywall-security`** as a merge gate for any entitlement, cache header, or marketing-lesson preview edits.

## Git reference (audit time)

`main` at `51f7c2e02` (synced with `origin/main` per preflight `git status`).
