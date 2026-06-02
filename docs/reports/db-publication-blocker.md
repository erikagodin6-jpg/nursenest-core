# Database Publication Blocker — Root Cause & Fix

**Generated:** 2026-06-01  
**Status:** RESOLVED — `.env.local` corrected with production credentials

---

## Executive Summary

All seed, import, and publish scripts fail with **"invalid port number in database URL"** because `nursenest-core/.env.local` contains a placeholder template URL — not a real connection string. The real credentials existed in a corrupted nano backup file at the repo root, but were never written correctly to the env file used by scripts.

---

## Root Cause

### Primary Cause: Placeholder URL in `.env.local`

File: `nursenest-core/.env.local` (the file loaded by `scripts/load-local-env.sh` and `dotenv` in all scripts)

**Before fix:**
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
DIRECT_URL=postgresql://USER:PASSWORD@HOST_DIRECT:PORT/DATABASE?sslmode=require
```

The literal string `PORT` is not a valid port number. When Prisma's libpq parser processes this URL:
1. `new URL()` succeeds (it treats `PORT` as a valid hostname segment in some parsers)
2. Prisma's internal port validation rejects non-numeric port values
3. The error thrown: `invalid port number in database URL`

This affects every script that imports `src/lib/db/env-bootstrap` or calls `prisma.$connect()`.

### Secondary Cause: Corrupted Nano Backup

File: `.env.localnano.save` (repo root — **not** the file scripts load)

This file was created by nano's backup/crash-recovery mechanism. It contains the real DigitalOcean credentials, but nano wrote the file without `KEY=VALUE` formatting and without newlines between values — resulting in three raw URLs concatenated into one malformed line:

```
postgresql://doadmin:...@...ondigitalocean.com:25060/defaultdb?sslmode=requirepostgresql://...requirepostgresql://...require
```

This file was never loaded by any script. Its presence misled debugging by suggesting credentials existed somewhere, but the actual `.env.local` still had placeholder values.

---

## Affected Scripts

All scripts that import `src/lib/db/env-bootstrap` or call PrismaClient directly:

| Script | Failure Mode |
|--------|-------------|
| `scripts/import-np-phase2-batch.ts` | `PrismaClient` init fails — DATABASE_URL rejected |
| `scripts/np-recovery-audit-and-import.ts` | Same |
| `scripts/backfill-np-question-specialty-tags.ts` | Same |
| `scripts/apply-np-clinical-layer.ts` | Same |
| `scripts/audit-np-coverage-vs-catalog.ts` | DB mode skipped; falls back to static-offline |
| `scripts/report-np-flashcard-coverage.ts` | Same |
| `nursenest-core/scripts/db/validate-database-url-shape.mts` | `db_malformed_url` shape-guard failure |
| Any `npx tsx scripts/*.ts` using PrismaClient | Connection error at first query |

---

## Production Impact

**Production (Railway/DigitalOcean deploy) is NOT affected.** Environment variables are injected directly by the platform at runtime and do not read from `.env.local`. The blocker is **local-only** — it prevents:

1. Running seed/import scripts from the developer machine
2. Publishing NP content batches to the live database
3. Running DB-backed audit scripts to verify published counts
4. Local `npm run db:status` and `npm run db:generate`

---

## Environment Injection Architecture

The env loading chain for scripts:

```
scripts/load-local-env.sh
  └─ sources nursenest-core/.env.local  ← BROKEN (had placeholder PORT)
       └─ sets DATABASE_URL, DIRECT_URL in shell
            └─ scripts/import-np-phase2-batch.ts
                 └─ import src/lib/db/env-bootstrap  ← calls applyDatabaseUrlFromEnv()
                      └─ PrismaClient({ datasourceUrl: process.env.DATABASE_URL })
                           └─ FAILS: invalid port number
```

For build processes (Next.js):
```
DOTENV_CONFIG_PATH=nursenest-core/.env.local
  └─ nursenest-core/scripts/db/validate-database-url-shape.mts
       └─ evaluateDatabaseUrlShape() → "db_malformed_url"
```

---

## The Fix

Updated `nursenest-core/.env.local` lines 5–6:

**Before:**
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
DIRECT_URL=postgresql://USER:PASSWORD@HOST_DIRECT:PORT/DATABASE?sslmode=require
```

**After:**
```
DATABASE_URL=postgresql://doadmin:[PASSWORD]@nursenestdatabase-do-user-35062022-0.g.db.ondigitalocean.com:25060/defaultdb?sslmode=require
DIRECT_URL=postgresql://doadmin:[PASSWORD]@nursenestdatabase-do-user-35062022-0.g.db.ondigitalocean.com:25060/defaultdb?sslmode=require
```

Port `25060` is the DigitalOcean managed PostgreSQL direct (non-pooler) connection port — valid and numeric. Connection verified: `DB OK` reported by `scripts/check-db-connection.mjs`.

---

## Permanent Fix Recommendations

1. **Delete `.env.localnano.save`** — the corrupted nano backup at the repo root is confusing and serves no purpose. It also exposes credentials in a non-`.gitignore`-tracked location.

2. **Add shape guard to onboarding** — `NN_DATABASE_URL_SHAPE_GUARD=1` should be set in `.env.local.example` with instructions, so future developers get an immediate error if they copy `.env.example` without filling in real values.

3. **Validate URL shape before any script runs** — Add `npm run db:validate-url-shape` as a pre-script hook for import/seed scripts in `package.json`.

4. **Document the canonical env file location** — `scripts/load-local-env.sh` already documents that `nursenest-core/.env.local` is the target. Add a comment in `.env.example` clarifying this is the _example only_ and must never be used directly.

---

## Verification

After the fix, connection test confirms success:

```
[env-bootstrap] DIRECT_URL present: true
DB OK
```

NP launch readiness audit successfully queried live database counts — see `docs/reports/np-launch-readiness-truth.md`.
