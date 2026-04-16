# Database operations, safety, and incidents

This document is for operators and on-call. It does **not** contain credentials or connection strings.

## Roles and least privilege

- **Application runtime** should use a dedicated Postgres role limited to `CONNECT` on the app database and `SELECT`/`INSERT`/`UPDATE`/`DELETE` on application tables — not `SUPERUSER`, not broad `DDL` in production.
- **Migrations** (`prisma migrate deploy`, one-off schema fixes) should use a separate credential with `CREATE`/`ALTER` privileges, ideally from a locked-down CI job or bastion — not from the same secret as the web tier when avoidable.
- **Backups and restores** are usually performed by the managed provider (e.g. DigitalOcean Managed Postgres) or `pg_dump` with a backup role; restore operations often need elevated privileges — perform them in maintenance windows and validate in staging first.

Prisma uses a single `DATABASE_URL` in `schema.prisma`. If you sit behind PgBouncer (transaction pooling), follow [Prisma’s guidance](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections) on pooler vs direct URLs for migrations.

## Connection handling (this codebase)

- `src/lib/db/env-bootstrap.ts` normalizes `DATABASE_URL` and injects conservative `connection_limit` / `pool_timeout` defaults when not set explicitly (`PROD_DATABASE_URL` is not used).
- `src/lib/db.ts` wraps Prisma with a **concurrency semaphore** (`NN_DB_MAX_CONCURRENT_QUERIES`, default 22) and slow-query logging.
- Prefer **server-side** `statement_timeout` on the connection string (e.g. `?statement_timeout=30000`) so runaway SQL fails predictably; `validateProductionDatabaseEnv` warns at startup if it is missing.
- Tune `max_connections` on Postgres vs app `connection_limit` × instance count × platform.

## Query timeouts and bounded reads

- Marketing and optional paths may use `withDatabaseFallbackTimeout` in `src/lib/db/safe-database.ts` to avoid hanging on slow DBs.
- Entitlement and core reads may use durability timeouts (`with-core-read-timeout`, feature flags in `production-safety-flags.ts`).
- API list routes should use pagination caps (`src/lib/api/api-pagination-limits.ts`) and route-specific protections (`src/lib/http/api-protection.ts`).

## Indexes and scans

- Hot paths (subscriptions by `userId`, exam question filters, etc.) are indexed in `schema.prisma` and historical migrations under `prisma/migrations/`.
- Avoid unbounded `findMany` without `take` in handlers; admin diagnostics should cap raw SQL (`LIMIT`).

## Backup and restore readiness (checklist)

**Before you need a restore**

- [ ] Confirm automated backups are enabled in the database provider (retention meets compliance).
- [ ] Know the **RPO** (max acceptable data loss) and **RTO** (max downtime) targets.
- [ ] Store infrastructure runbooks (this file + host docs) where on-call can reach them without prod shell access.
- [ ] Verify `DATABASE_URL` (and migration URL if separate) are in the **secrets store**, not in git.
- [ ] Periodically test **restore to a non-production** cluster from a recent backup (table count smoke test, Prisma `migrate status`).

**During an incident (data corruption or bad deploy)**

- [ ] Stop or scale down writers if necessary to prevent further damage (platform-specific).
- [ ] Snapshot current state if possible before destructive fixes (provider snapshot or logical dump).
- [ ] Restore from backup to a **new** instance or database first; validate read-only, then cut over or apply targeted repair.
- [ ] Re-run `prisma migrate deploy` if schema version after restore is behind application code.
- [ ] Invalidate caches and verify Stripe/subscription consistency if billing tables were affected.

**After restore**

- [ ] Verify application health (`/api/health`), auth, checkout, and webhook processing in staging/production as appropriate.
- [ ] Post-incident: document root cause, backup gap, and follow-up tasks.

## Secrets and logging

- Never commit `DATABASE_URL`, API keys, or JWT secrets. Use environment variables or the host secret manager.
- `logDatabaseEnvOnce` and startup logs use **masked** URLs only (`maskDatabaseUrl`).
- Application code must not log raw SQL parameters containing PII; use structured logging with truncation where needed.

## Related code

- `src/lib/db.ts` — Prisma client, semaphore, slow-query logging  
- `src/lib/db/env-bootstrap.ts` — URL resolution and pool defaults  
- `src/lib/db/validate-production-db-env.ts` — production startup validation  
- `src/instrumentation.ts` — invokes DB validation on Node runtime startup  
