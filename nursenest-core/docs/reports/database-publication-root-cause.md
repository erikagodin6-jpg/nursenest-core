# Database Publication Root Cause

Date: 2026-06-01

## Executive Summary

The current database publication blocker is cleared for local publisher execution.

The active `DATABASE_URL` and `DIRECT_URL` now parse correctly and Prisma can connect. A publisher-equivalent Prisma write path was verified with `Category.upsert -> findUnique -> delete`, which is the first write operation used by the affected launch-readiness publishers.

No additional content was generated or published during this investigation.

## Affected Generators

These existing generators were affected by the same Prisma publication path:

- FNP: `scripts/generate-fnp-launch-readiness-content.mts`
- AGPCNP: `scripts/generate-agpcnp-launch-readiness-content.mts`
- WHNP: `scripts/generate-whnp-launch-readiness-content.mts`
- PMHNP: existing PMHNP launch-readiness publisher path, if run through the same Prisma bootstrap pattern
- PNP-PC: `scripts/generate-pnp-pc-launch-readiness-content.mts`

The observed failure occurred before content rows were written, at the first Prisma write surface (`prisma.category.upsert`).

## Prisma Datasource

`prisma/schema.prisma` uses:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## Current Parsed Connection Components

Source: `/root/nursenest-core/nursenest-core/.env.local`

`DATABASE_URL`:

- Protocol: `postgresql:`
- Hostname: `nursenestdatabase-do-user-35062022-0.g.db.ondigitalocean.com`
- Port: `25060`
- Database: `defaultdb`
- Search keys before bootstrap: `sslmode`
- Search keys after bootstrap: `sslmode`, `connection_limit`, `pool_timeout`, `connect_timeout`
- Hidden/control characters: none detected
- Leading/trailing whitespace: none detected
- Username length: `7`
- Password length: `24`

`DIRECT_URL`:

- Protocol: `postgresql:`
- Hostname: `nursenestdatabase-do-user-35062022-0.g.db.ondigitalocean.com`
- Port: `25060`
- Database: `defaultdb`
- Search keys before bootstrap: `sslmode`
- Search keys after bootstrap: `sslmode`, `connection_limit`, `pool_timeout`, `connect_timeout`
- Hidden/control characters: none detected
- Leading/trailing whitespace: none detected
- Username length: `7`
- Password length: `24`

No password or full connection string was printed.

## Env Loading Findings

Runtime shell before dotenv:

- `DATABASE_URL`: unset
- `DIRECT_URL`: unset

Loaded files:

- `.env.local`: found, declares both `DATABASE_URL` and `DIRECT_URL`
- `.env.playwright.local`: missing
- `.env`: missing

Script env loading:

- `scripts/load-dotenv-for-cli.mts` loads `.env.local` from the package root.
- `src/lib/db/script-env-bootstrap.ts` loads `.env.local` from `process.cwd()` and then applies `env-bootstrap`.
- Both use `override: false`, so a shell/runtime `DATABASE_URL` wins over `.env.local`.

Prisma CLI loading:

- Raw `npx prisma ...` does not load `.env.local`.
- Raw `npx prisma db execute --schema prisma/schema.prisma` failed with missing `DIRECT_URL`.
- The repo wrapper `npx tsx scripts/run-prisma-with-env.mts ...` loads `.env.local` and succeeds.

Deployment env loading:

- `live-app-spec.yaml` is explicitly a redacted snapshot, not deployable.
- `.do/app.yaml` is explicitly marked stale and missing secrets.
- Droplet deployment scripts load an external env file via `NURSE_NEST_ENV_FILE`.
- DigitalOcean App Platform secrets are not readable from this local shell; deployment verification must run `scripts/debug-db-url.mts` or equivalent in the target runtime.

## Root Cause

The content generators themselves were not the root cause.

The failure was caused by environment-source drift: Prisma was previously receiving a malformed database URL from the active runtime/env source, producing `invalid port number in database URL`. The current canonical local source, `.env.local`, no longer contains that malformed value and now parses cleanly.

The investigation also identified an operational footgun:

- Raw Prisma CLI commands do not load `.env.local`.
- CLI scripts and publishers do load `.env.local`.
- Because dotenv is loaded with `override: false`, any malformed shell `DATABASE_URL` overrides the valid `.env.local` value.

Therefore a stale exported shell variable, stale deployment secret, or previously malformed `.env.local` value can make publishers fail even when the file later looks correct.

## Verification Evidence

Debug script created:

```bash
npx tsx scripts/debug-db-url.mts
```

Connection and write/read/delete probe:

```bash
npx tsx scripts/debug-db-url.mts --connect --write-test
```

Result:

```text
[debug-db-url] prisma_connect=ok
[debug-db-url] prisma_write_read_delete=ok
```

Raw Prisma CLI without env wrapper:

```bash
npx prisma db execute --schema prisma/schema.prisma --stdin
```

Result:

```text
Environment variable not found: DIRECT_URL.
```

Prisma CLI with repo env wrapper:

```bash
npx tsx scripts/run-prisma-with-env.mts db execute --schema prisma/schema.prisma --stdin
```

Result:

```text
Script executed successfully.
```

Publisher-equivalent first write path:

```text
Category.upsert -> Category.findUnique -> Category.delete
```

Result:

```json
{"ok":true,"model":"Category","operation":"upsert-find-delete"}
```

## Permanent Fix

Use `scripts/debug-db-url.mts` before any launch-readiness `--apply` run.

Required policy:

- Do not run raw `npx prisma ...` for this project unless `DATABASE_URL` and `DIRECT_URL` are exported in the shell.
- Prefer `npx tsx scripts/run-prisma-with-env.mts ...` for Prisma CLI commands.
- Before publishing, run:

```bash
npx tsx scripts/debug-db-url.mts --connect --write-test
```

If it reports any URL parse issue, hidden character, missing host, missing port, non-numeric port, or failed write test, stop publication.

If a publisher fails again with `invalid port number`, immediately compare:

- `scripts/debug-db-url.mts` output
- shell `DATABASE_URL` presence
- `.env.local` timestamp
- deployment runtime secret value
- whether the command was launched through a wrapper that loads `.env.local`

## Final Status

Current status: GO for database publication path.

The database URL is parseable, Prisma connects, raw SQL write/read/delete succeeds, and the first publisher model write (`Category.upsert`) succeeds.

No further content generation should continue until this same probe passes in the environment where the publisher will be run.
