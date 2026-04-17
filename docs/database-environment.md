# Database environment (`DATABASE_URL`)

**Single source of truth:** `DATABASE_URL` is the only Postgres connection string the app and Prisma use.

- **`DATABASE_URL`** — required. Pooled URI is normal for the running app on DigitalOcean.
- **`DIRECT_URL`** — optional. Same cluster, **direct** (non-pooler) URI for `prisma migrate` / introspection. If unset, `src/lib/db/env-bootstrap.ts` derives one by stripping `pgbouncer=true` from `DATABASE_URL` when possible. Legacy alias **`DATABASE_DIRECT_URL`** is still read when `DIRECT_URL` is unset.
- **`PROD_DATABASE_URL`** — **not supported**. It is never merged into `DATABASE_URL`. Remove it from env files and secret stores to avoid confusion.

`schema.prisma` uses `url = env("DATABASE_URL")` and `directUrl = env("DIRECT_URL")`.

There is **no** `NEXT_PUBLIC_*` database secret.

## Where values come from

| Context | Source |
|--------|--------|
| **DigitalOcean App Platform** | Set **`DATABASE_URL`** in the app’s environment / component. Runtime injects it for the web process. |
| **Local / Cursor** | `nursenest-core/.env.local` (gitignored), then `.env.playwright.local`, then `.env`. Resolution is anchored to the **package directory** (`scripts/load-dotenv-for-cli.mts`), not arbitrary `cwd`. |
| **GitHub Actions** | Repository secret **`DATABASE_URL`** (e.g. `.github/workflows/prisma-migrate.yml`). Same **name** as production. |
| **Prisma CLI** | Use **`npm run db:*`** in `nursenest-core/package.json` (`scripts/run-prisma-with-env.mts` loads env + asserts `DATABASE_URL` before invoking Prisma). |

## Shared preflight

- **`npm run db:preflight`** — verifies `DATABASE_URL` is set after loading env files; prints **host / port / database name only** (no credentials).
- **`scripts/lib/database-env-assert.mts`** — `assertDatabaseUrlPresentOrExit()` used by Prisma wrapper, `db:preflight`, `prisma/seed.ts`, and `admin:qa-paid-test-reset`.

## Commands (from `nursenest-core/`)

```bash
npm run db:preflight
npm run db:migrate:status
npm run db:deploy
npm run db:generate
npm run db:seed
```

Do **not** rely on raw `npx prisma` from the monorepo root without the wrapper — env loading may not match the app.

## Logging safety

Code must never log full connection strings. Use `maskDatabaseUrl` in `src/lib/db/database-env.ts` for operator logs. CLI tools print host/port/db only.

## Related files

- `nursenest-core/prisma/schema.prisma`
- `nursenest-core/src/lib/db/env-bootstrap.ts`
- `nursenest-core/src/lib/db.ts`
- `nursenest-core/.env.example`

## After credential rotation (Phase 2)

Update **`DATABASE_URL`** in DigitalOcean, GitHub **`DATABASE_URL`** secret, and local **`.env.local`** to the new URI. No code changes; no variable rename.
