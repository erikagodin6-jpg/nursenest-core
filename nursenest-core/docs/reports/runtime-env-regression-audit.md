# Runtime env regression audit — `DATABASE_URL` / standalone bootstrap

**Date:** 2026-05-10  
**Scope:** DigitalOcean App Platform + Next.js standalone (`scripts/start-standalone.mjs`, `runtime-env-guard-bootstrap.mjs`, Prisma env-bootstrap).

## Observed failure

```
DATABASE_URL is missing in runtime environment (not build ARG)
```

Thrown from `validateRuntimeEnvOrThrow()` → `assertRuntimeDatabaseEnvContract` during production standalone startup.

## Root cause (composite)

1. **Bootstrap validation ran before filesystem env hydration**  
   Platform secrets normally inject into `process.env` before `node` starts, but local parity and some deployment layouts rely on `.env.production` / `.env.local` merged by `scripts/lib/load-runtime-env.mjs`. Calling `validateRuntimeEnvOrThrow()` first caused **false negatives** whenever only on-disk env contained `DATABASE_URL`.

2. **`isDatabaseContractSkippedPhase()` was too broad**  
   `NN_APP_PLATFORM_BUILD === "true"` alone skipped the entire DATABASE_URL contract. That flag is meant for **compile/codegen** contexts. After spec/UI merges or mis-scoped env (`RUN_AND_BUILD_TIME`), it can appear at **runtime**, silently disabling checks while the app still requires `DATABASE_URL` — masking misconfiguration until deeper failures.

3. **Prisma-safe Docker argv did not match `prisma generate` regex**  
   `node scripts/prisma-safe.mjs generate` does not contain the substring `prisma generate`. The broad `NN_APP_PLATFORM_BUILD` skip masked the gap; replacing it required an explicit `/prisma-safe\.mjs\s+generate\b/` branch plus `NEXT_PHASE` alignment.

4. **No alias promotion**  
   Some stacks expose `POSTGRES_URL` only. Ignoring aliases increased apparent "missing DATABASE_URL" incidents.

## Startup sequence (after fix)

1. Container/App Platform sets `WORKDIR` → `/app/nursenest-core`, runs `node scripts/start-standalone.mjs`.
2. **Hydrate:** `loadRuntimeEnv({ validate: false })` merges `.env`, `.env.local`, `.env.production` without overwriting non-empty injected vars.
3. **Alias promotion:** If `DATABASE_URL` still empty, copy from `POSTGRES_URL` / `POSTGRESQL_URL` when they look like Postgres URLs.
4. **Diagnostics:** `[nn-bootstrap]` JSON line (no secrets): cwd, `DATABASE_URL_present`, `POSTGRES_URL_present`, `DIGITALOCEAN_APP_ID_present`, `NEXT_PHASE`, `npm_lifecycle_event`.
5. **`[ENV SNAPSHOT]`** → **`validateRuntimeEnvOrThrow()`** (DATABASE_URL + AI/auth contract).
6. Git meta refresh, `NODE_ENV`, bootstrap mode resolution, HTTP proxy + child standalone (`DATABASE_URL` inherited via `...process.env`).

Child Next process imports `@/lib/db` → `env-bootstrap.ts` → `assertRuntimeDatabaseEnvContract()` with the same skip-phase rules (`NEXT_PHASE`, `next build`, `prisma-safe.mjs generate`, etc.).

## Why regressions recur after "major restructures"

- **Deploy spec drift:** `run_command`, `source_dir`, or env scopes change; teams re-add `NN_APP_PLATFORM_BUILD` at runtime or merge YAML/UI env without `value:` lines.
- **Path/cwd assumptions:** Scripts move under `nursenest-core/`; hydration paths depend on `pkgRoot` next to `start-standalone.mjs` — wrong entrypoints skip hydration.
- **Duplicate guard implementations:** `runtime-env-guard-bootstrap.mjs` must stay aligned with `require-database-env.ts`; skew causes inconsistent skip behavior.

## Permanent architecture recommendations

1. **Single source of truth for skip phases** — Keep TS authoritative; mirror in bootstrap MJS when TS cannot load (already documented in file headers).
2. **Always hydrate before validate** on standalone entry — matches Next dotenv ordering expectations.
3. **Never use build markers (`NN_APP_PLATFORM_BUILD`) as the only runtime skip** — Tie skips to `NEXT_PHASE`, argv, or explicit prisma entrypoints.
4. **Contract tests** — `tests/contracts/runtime-env-contract.test.ts` encodes ordering + skip-phase expectations.

## Verification commands

```bash
cd nursenest-core
npm run typecheck:critical
node --import tsx --test tests/contracts/runtime-env-contract.test.ts
```

DigitalOcean: deploy with existing `DATABASE_URL` RUN_TIME secret; confirm `[nn-bootstrap]` shows `DATABASE_URL_present:true`, homepage loads, Prisma connects.

## Compile-phase skips (replacement for blanket `NN_APP_PLATFORM_BUILD`)

Instead of `NN_APP_PLATFORM_BUILD === "true"` alone, contract skips now include **`npm_lifecycle_event === "heroku-postbuild"`** (Docker compile entry), **`run-next-prod-build.mjs`**, **`run-buildpack-build.mjs`**, **`NEXT_PHASE`**, **`prisma-safe.mjs generate`**, and existing **`next build` / `prisma generate`** patterns. Standalone CMD (`node scripts/start-standalone.mjs`) uses lifecycle **`start`** (via `npm start`) or no npm lifecycle — never `heroku-postbuild`.
