# Deployment hardening checklist (Docker / DigitalOcean / Prisma / env / startup)

## Docker (`Dockerfile` at repo root)

- [x] **Builder** uses `node:20-alpine`, `npm ci --ignore-scripts`, then copies app sources.
- [x] **Build env:** `NEXT_TELEMETRY_DISABLED=1`, `NN_APP_PLATFORM_BUILD=true`, `NN_LOW_MEMORY_BUILD=1`, `SKIP_I18N_PREBUILD=1`, `RUN_HEAVY_BUILD_TASKS=false`, `NODE_OPTIONS=--max-old-space-size=4096`, `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB=4096` (image ENV block).
- [x] **Prisma generate** uses **non-production** stub URL on `127.0.0.1:65432/nn_prisma_codegen` — matches `isAllowedPrismaCodegenStubDatabaseUrl` / `prisma-safe.mjs` build-safe path; **never** bakes real `DATABASE_URL` into image layers for compile.
- [x] **Post-build:** `heroku-postbuild` → `build:deploy` prunes dev deps and strips `.next/cache` / `node_modules/.cache` to shrink runtime image.
- [x] **Runner** exposes `8080`, `CMD node scripts/start-standalone.mjs`, runtime heap hint `NODE_MAX_OLD_SPACE_SIZE_MB=768`.

## DigitalOcean App Platform

- **Active spec:** `.do/app-nursenest-core-next.yaml` (explicit `github.repo: erikagodin6-jpg/nursenest-core`, `branch: main`).
- **Legacy spec:** `.do/app.yaml` marked **not active** — different health path (`/healthz` vs `/readyz`); do not confuse operators.
- [x] **Readiness:** `/readyz` for deploy health; `/healthz` for liveness (bootstrap design in `start-standalone.mjs`).
- [x] **`DATABASE_URL`:** `RUN_TIME` + `SECRET` only — YAML comments warn against `BUILD_TIME` visibility.
- [x] **Node pin:** `NODE_VERSION` 22.x at build/run for cache determinism (align with `engines` where applicable).
- [x] **Bundler env:** Comments forbid accidental `TURBOPACK` / `NEXT_RSPACK` at build time; `run-next-prod-build.mjs` strips these keys.

## Prisma

- [x] **Wrapper:** `nursenest-core/scripts/prisma-safe.mjs` — loads env via `load-runtime-env.mjs`, masks targets, build-time generate skips strict `DIRECT_URL` when `NN_APP_PLATFORM_BUILD` / `NN_LOW_MEMORY_BUILD`.
- [x] **postinstall:** `node scripts/prisma-safe.mjs generate` (nested package).
- [x] **Logs:** `maskedPostgresTarget` / `[nn-db-contract]` / `[nn-db-startup]` patterns avoid printing passwords.

## Env validation & startup

- [x] **`start-standalone.mjs`:** `validateRuntimeEnvOrThrow` + `logRuntimeEnvSnapshot` (bootstrap `.mjs` duplicate of TS guard).
- [x] **DATABASE_URL shape:** `assertPostgresConnectionStringShape` enforced in `require-database-env.ts` and `runtime-env-guard-bootstrap.mjs` when URL is present (non–build-skip phases).
- [x] **Optional CI guard:** `npm run db:validate-url-shape` (`NN_DATABASE_URL_SHAPE_GUARD=1` or CI with `DATABASE_URL` set).
- [x] **Production preflight:** `npm --prefix nursenest-core run production:preflight` (DB + migrate status + columns) — migrate stderr scrubbed via `scrubSecrets`.

## Operator commands (quick reference)

```bash
# Secret-safe env fingerprint (JSON)
npm run diagnostics:build-env

# Build stability checklist (no next build)
npm --prefix nursenest-core run audit:build-stability

# Optional: time `next build` only (does not run lesson index gate)
npm --prefix nursenest-core run build:next:timed

# Standalone artifact (after a successful build)
node nursenest-core/scripts/verify-standalone-artifact.mjs
```

## Mobile (`apps/mobile`)

- EAS / Expo scripts in `package.json`; `lint` and `typecheck` should stay green before shipping native builds.
- Shared contracts: `packages/nursenest-mobile-shared` (workspace) — avoid breaking types between mobile and server.

## Gaps / follow-ups

1. Align **local** Node major with DO (`engines` / `.nvmrc` if present) to reduce drift.
2. Ensure CI copies **fresh** normalized lesson indexes or runs generator before `verify:lesson-indexes` (currently failing on `ca-rpn-rex-pn` drift in this clone).
3. Re-run **`npm --prefix nursenest-core run build`** on a builder with ≥8 GiB RAM to confirm post-audit stability; capture `diagnostics:build-env` output in CI logs on failure.
