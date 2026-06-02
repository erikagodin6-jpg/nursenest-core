# Prisma drift prevention — NurseNest

## Goals

- Catch **connection** failures early (wrong URL, TLS, pooler).
- Surface **migration drift** (`prisma migrate status` non-diverged history) without applying migrations in validation paths.

## Commands

```bash
cd nursenest-core
npm run prisma:health
```

This runs:

1. `prisma db execute --stdin` with `SELECT 1` against `DATABASE_URL` from env (same `.env*` merge as `prisma-safe.mjs` via `loadRuntimeEnv`).
2. `prisma migrate status` (read-only) unless `NN_PRISMA_HEALTH_SKIP_MIGRATE_STATUS=1`.

## DATABASE_URL vs DIRECT_URL

- **Pooled** URLs (`pgbouncer=true`, port `6432`, Supabase pooler hosts) require a separate **`DIRECT_URL`** for migrations and some introspection.
- `env:validate` warns when the pooler pattern is detected and `DIRECT_URL` is missing.

## Drift signals

| Signal | Meaning |
|--------|---------|
| `fingerprint_prefix10` changed | Any URL component (including password) changed — compare masked hosts and credentials out-of-band. |
| `migrate status` non-zero | Pending migrations or history mismatch — run `prisma migrate deploy` in a controlled release window (not part of this read-only script). |
| `db execute` fails | Network, auth, SSL mode, or pooler incompatibility — fix URL before debugging app code. |

## CI / production safety

- `prisma:health` does **not** run `migrate deploy`, `db push`, or destructive SQL.
- Do not point health checks at production from unauthenticated developer machines without approval.

## Related

- `nursenest-core/scripts/prisma-safe.mjs` — migrate deploy / generate with env validation.
- `nursenest-core/src/lib/db/database-url-drift-audit.ts` — fingerprint + parse audit.
