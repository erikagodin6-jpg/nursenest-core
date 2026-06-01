# Database Environment Validation Report
**Generated:** 2026-06-01  
**Scope:** All environment loading paths for content publication scripts

---

## Summary

| Check | Result |
|---|---|
| DATABASE_URL present | ✓ PASS |
| DATABASE_URL placeholder-free | ✓ PASS |
| DATABASE_URL parseable URL | ✓ PASS |
| DATABASE_URL port numeric | ✓ PASS |
| DIRECT_URL present | ✓ PASS |
| DIRECT_URL placeholder-free | ✓ PASS |
| DIRECT_URL parseable URL | ✓ PASS |
| DIRECT_URL port numeric | ✓ PASS |
| NN_SKIP_DATABASE_ENV_CONTRACT bypass active | ⚠ WARNING |

**Overall: PASS (1 warning)**

---

## Variables Checked

### DATABASE_URL

| Attribute | Value |
|---|---|
| Present | Yes |
| Protocol | `postgresql:` |
| Host | `nursenestdatabase-do-user-35062022-0.g.db.ondigitalocean.com` |
| Port | `25060` (numeric, direct Postgres connection) |
| Database | `defaultdb` |
| SSL | `sslmode=require` |
| Placeholder tokens scanned | USER, PASSWORD, HOST, PORT, DATABASE, localhost, 127.0.0.1, example, changeme |
| Placeholder hits | **None** |
| URL parses | Yes (`new URL(...)` succeeds) |
| Source | `.env.local` line 5 (first-matching declaration, `override: false`) |

### DIRECT_URL

| Attribute | Value |
|---|---|
| Present | Yes |
| Protocol | `postgresql:` |
| Host | `nursenestdatabase-do-user-35062022-0.g.db.ondigitalocean.com` |
| Port | `25060` (matches DATABASE_URL — direct non-pooled connection) |
| SSL | `sslmode=require` |
| Placeholder hits | **None** |
| Source | `.env.local` line 6 |

### NN_SKIP_DATABASE_ENV_CONTRACT

| Attribute | Value |
|---|---|
| Value | `1` (active) |
| Effect | Bypasses `requireDatabaseEnv()` URL shape validation |
| Risk | If DATABASE_URL were the placeholder template, validation would not throw before Prisma receives the invalid URL |
| Action | Remove this flag from `.env.local` — not needed when credentials are correct |

---

## Env Loading Paths

### Path A — `script-env-bootstrap.ts` (used by launch-readiness scripts)

1. `load-dotenv-for-cli.mts` resolves package root and loads:
   - `.env.local` (found, supplies DATABASE_URL and DIRECT_URL)
   - `.env.playwright.local` (missing, skipped)
   - `.env` (missing, skipped)
2. `require-database-env.ts` → `requireDatabaseEnv()` validates URL shape
3. `env-bootstrap.ts` → `applyDatabaseUrlFromEnv()` tunes URL (adds connection_limit=2, pool_timeout=15, connect_timeout=10)
4. `applyDirectDatabaseUrlFromEnv()` tunes DIRECT_URL

**Status: Correctly configured.**

### Path B — Manual `loadDotenv` inside `main()` (was used by pipeline script, now fixed)

Before fix: `import { config as loadDotenv } from "dotenv"` called inside `main()` at line 651. No URL validation before Prisma construction.

After fix: `import "@/lib/db/script-env-bootstrap"` at module top. Validation runs at import time before any content generation begins.

**Status: Fixed.**

### Path C — `env-bootstrap.ts` direct (Next.js server runtime)

Next.js loads environment variables via its own pipeline. DATABASE_URL and DIRECT_URL are set as `RUN_TIME` secrets in the DigitalOcean App Platform spec (`.do/app-nursenest-core-next.yaml`). Never stored in repository.

**Status: Correctly configured.**

---

## Env File Audit

| File | Present | DATABASE_URL | DIRECT_URL |
|---|---|---|---|
| `.env.local` | Yes | Real DigitalOcean credentials | Real DigitalOcean credentials |
| `.env` | No | — | — |
| `.env.playwright.local` | No | — | — |
| `.env.example` | Yes | `postgresql://USER:PASSWORD@HOST:PORT/DATABASE` (template) | `postgresql://USER:PASSWORD@HOST_DIRECT:PORT/DATABASE` (template) |

The `.env.example` template is correct — placeholder values are intentional there. `.env.local` correctly contains real credentials.

---

## Root Cause Confirmation

Before 2026-06-01T21:58 (`.env.local` modification timestamp), the file contained template placeholders. The literal `PORT` string caused Prisma's Rust engine to throw `"invalid port number in database URL"` because:

1. `NN_SKIP_DATABASE_ENV_CONTRACT=1` bypassed `requireDatabaseEnv()` URL validation
2. `tuneDatabaseUrlForProcess()` silently failed to parse the URL (`new URL(...)` throws for non-numeric ports) and returned the raw template string unchanged
3. Prisma received the raw `postgresql://USER:PASSWORD@HOST:PORT/DATABASE` string and rejected it at connection time

**Fix applied:** Real credentials written to `.env.local`. The bypass flag `NN_SKIP_DATABASE_ENV_CONTRACT=1` should be removed (Phase 6 action).
