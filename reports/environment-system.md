# Environment system — NurseNest

Centralized validation reduces drift between **local**, **CI**, **Docker build**, and **production** for `DATABASE_URL`, auth, Stripe, PostHog, cron, reliability, i18n, and deployment-related variables.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run env:validate` | Default **dev** profile: parseable `DATABASE_URL` when set; conflict checks; Prisma `DIRECT_URL` hints; no hard fail when DB unset locally. |
| `npm run env:validate -- --ci` | **CI** profile: tolerates missing `DATABASE_URL`; validates shape when set; scans `NEXT_PUBLIC_*` for secret-shaped values. |
| `npm run env:validate:production` | **Production** profile: runs full `collectProductionEnvIssues()` (Stripe, Spaces, auth URL, etc.). |
| `npm run env:validate -- --strict` | Treat **warnings** as exit code 1. |
| `npm run env:validate -- --json` | Machine-readable report (masked hosts only). |
| `npm run prisma:health` | Read-only `SELECT 1` + `prisma migrate status` (set `NN_PRISMA_HEALTH_SKIP_MIGRATE_STATUS=1` to skip status). |

From monorepo root, the same scripts exist via `npm run env:validate` (delegates to `nursenest-core`).

## Startup (runtime)

Existing Node boot path (`register-node.ts`) already runs:

- `validateRuntimeEnvOrThrow` / database contract (`require-database-env`)
- `runProductionEnvGuard` (production issues, log-only unless `NN_STRICT_PRODUCTION_ENV=1`)
- `logDatabaseUrlDriftAuditOnce` (fingerprint + safe fields)

**Optional** compact boot line: set `NN_ENV_BOOT_DIAGNOSTICS=1` to emit `env_diagnostics_boot` fingerprint line from `env-diagnostics.ts`.

## Build-time

- `npm run db:validate-url-shape` remains the CI guard for parseable `DATABASE_URL` when present.
- `verify-build` workflow runs `env:validate --ci` after dependency install.

Optional local prebuild hook: run `npm run env:validate` before `next build` if you want stricter local parity (not enabled by default to avoid blocking marketing-only work).

## Docker

The root `Dockerfile` uses a **synthetic** `DATABASE_URL` for `prisma generate` only. Runtime images must inject real `DATABASE_URL` / `DIRECT_URL` via the platform env UI — never bake secrets into the image.

## Diagnostics rules (no secrets)

- Reports and CLI print **masked hosts**, `fingerprint_prefix10` from `database-url-drift-audit.ts`, and boolean “present” flags only.
- Never paste raw `DATABASE_URL`, API keys, or webhook secrets into tickets.

## Related files

| Path | Role |
|------|------|
| `nursenest-core/src/lib/env/env-diagnostics.ts` | Central diagnostic builder |
| `nursenest-core/scripts/validate-env.mjs` | CLI entry (tsx delegate) |
| `nursenest-core/scripts/validate-env-cli.mts` | Dotenv load + profile flags |
| `nursenest-core/scripts/check-prisma-health.mjs` | Prisma connectivity + migrate status |
| `nursenest-core/src/lib/env/production-env-guard.ts` | Production-required vars |
| `nursenest-core/src/lib/db/database-url-drift-audit.ts` | URL shape + fingerprint |
| `nursenest-core/scripts/lib/load-runtime-env.mjs` | DATABASE/DIRECT merge for Prisma scripts |
| `scripts/check-required-env.mjs` | Legacy minimal check (still available via `env:check`) |

## When validation fails

1. Read the `[env:validate] [error]` lines — each includes a stable `code`.
2. Compare `fingerprint_prefix10` across environments if DB behavior diverges.
3. For Prisma migrate errors, see `reports/prisma-drift-prevention.md`.
