# Production stability & build reliability — executive audit

**Date:** 2026-05-06  
**Scope:** Monorepo root, `nursenest-core/`, `apps/mobile`, `packages/*` (as touched by build/deploy paths).  
**Truthpack:** `.vibecheck/truthpack/` was **not present** in this workspace clone; env names and routes were taken from repository source only (no invented vars).

## Executive summary

The Next.js app under `nursenest-core/` already ships substantial **OOM mitigation**: fixed webpack parallelism (`1`), low static-generation concurrency, webpack cache disabled in production, integrated ESLint/typecheck skipped during `next build` (strict checks expected in CI), heap helpers (`ensure-node-memory.mjs`, `run-next-prod-build.mjs` RAM cap), and DigitalOcean-oriented env flags (`NN_APP_PLATFORM_BUILD`, `NN_FORCE_SINGLE_BUILD_WORKER`, `NN_LOW_MEMORY_BUILD`). Docker and `.do/app-nursenest-core-next.yaml` align on standalone output, build-time `DATABASE_URL` isolation for Prisma generate, and runtime-only DB secrets.

This pass adds **operator diagnostics** (`diagnostics:build-env`, `build:next:timed`), tightens **DATABASE_URL shape** validation at runtime (TypeScript + bootstrap `.mjs` parity), and documents **validation outcomes** from this environment.

## Validation outcomes (this sandbox)

| Command | Result | Notes |
|--------|--------|--------|
| `npm run check` (repo root `tsc`) | **Exit 134 (OOM)** | Default Node heap ~2 GiB exhausted during root `tsc`. Use `NODE_OPTIONS=--max-old-space-size=8192` or rely on `nursenest-core` typecheck for gatekeeping. |
| `npm --prefix nursenest-core run typecheck:critical` | **Pass** | Critical-path TS gate green. |
| `npm --prefix nursenest-core run diagnostics:build-env` | **Pass** | New script; JSON fingerprint, no secret values. |
| `node nursenest-core/scripts/verify-standalone-artifact.mjs` | **Fail (expected)** | No `.next/standalone` without a prior `next build`. |
| `npm --prefix nursenest-core run verify:lesson-indexes` | **Fail** | `ca-rpn-rex-pn` summary count mismatch (live normalize vs committed index). **Content/index drift** — fix by regenerating indexes or resolving catalog source, not ignored for production. |
| `npm --prefix nursenest-core run content:source-of-truth:check` | **Fail** | One subtest failed in `content-source-of-truth.contract.test.ts` (registry expectation). Treat as **pre-existing** until triaged. |
| `npm --prefix apps/mobile run lint` | **Pass** | ESLint clean. |
| `npm --prefix nursenest-core run build` (`next build` full pipeline) | **Not run to completion** | High risk of timeout/OOM in this agent sandbox; defer to CI/DO builder with documented env. |

## Findings (prioritized)

### P0 — production / CI correctness

1. **Lesson index verify failure** — `verify:lesson-indexes` reports `ca-rpn-rex-pn` live vs file mismatch. Gates `prebuild`/`build` will fail until indexes are regenerated or catalog normalization is aligned.
2. **Content source-of-truth check** — failing contract test; unblock release pipelines that depend on this script.

### P1 — memory & build stability

3. **Root `tsc` OOM** — legacy/root TypeScript project is heavy; prefer documented `NODE_OPTIONS` or scope checks to `nursenest-core` for routine PR validation.
4. **Heap vs cgroup** — DO YAML documents lowering `NODE_OPTIONS` / `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB` to **3072** if cgroup OOM persists after concurrency fixes (comment in `.do/app-nursenest-core-next.yaml`).

### P2 — observability & drift

5. **Env fingerprinting** — addressed via `npm run diagnostics:build-env` (root delegates to `nursenest-core`).
6. **Optional Next-only timing** — `npm --prefix nursenest-core run build:next:timed` isolates `next build` wall time (does not run lesson index gate or full `npm run build`).

### P3 — hydration / client payload

7. Large **client** surfaces (practice test runner, question bank, admin blog panel) dominate hydration-risk tooling — see `build-memory-hotspots.md` and `hydration-risk-hotspots.md`. Surgical lazy-loading should target **admin** and **optional** flows first to avoid learner/marketing regressions.

## Safe changes implemented (this PR)

- `nursenest-core/scripts/build-env-fingerprint.mjs` + npm scripts `diagnostics:build-env` (and root alias).
- `nursenest-core/scripts/report-build-timing.mjs` + `build:next:timed`.
- `assertPostgresConnectionStringShape` in `require-database-env.ts` (+ tests); mirrored in `runtime-env-guard-bootstrap.mjs`.
- `audit-build-stability.mjs` now points to this report set under repo `reports/`.

## Recommended next actions

1. Fix `verify:lesson-indexes` drift for `ca-rpn-rex-pn` (run `build:lesson-indexes`, commit artifacts, re-verify).
2. Triage `content:source-of-truth:check` failure and restore green or adjust contract with product sign-off.
3. In CI, run `npm run diagnostics:build-env` after checkout on failure to capture knob state (no secrets).
4. Keep **strict** `typecheck` / `lint` / i18n gates **before** `next build` per `next.config.mjs` contract.

## Related docs

- `nursenest-core/docs/deploy-deterministic-docker.md` (referenced from DO spec comments).
- `nursenest-core/scripts/audit-build-stability.mjs` (automated checklist).
