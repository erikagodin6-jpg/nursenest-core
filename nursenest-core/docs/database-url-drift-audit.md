# DATABASE_URL drift audit (production-safe)

## Purpose

Operators need to confirm **which** Postgres endpoint an app instance uses **without** ever logging passwords. When a secret is rotated or the wrong connection string is deployed, logs and diagnostics should make that visible through a **stable fingerprint** and redacted connection fields.

## What is logged (never the password)

At **Node boot** (`instrumentation` → `register-node`) and when running **`npm run db:connectivity-check`**, the app emits a single structured line and `safeServerLog` event `database_url_drift_audit` with:

| Field | Meaning |
|--------|--------|
| `host` | URL hostname |
| `port` | URL port (default `5432` if omitted) |
| `database` | Path segment (database name), URL-decoded |
| `username` | URL user, URL-decoded (not a password) |
| `sslmode_require` | `1` if `sslmode=require` (or equivalent in `options`) is present |
| `connection_mode` | Heuristic: `likely_pooler`, `likely_direct`, or `unknown` (e.g. PgBouncer flag, common pooler ports, DigitalOcean pooler port) |
| `fingerprint_prefix10` | First **10 hex characters** of `SHA-256(UTF-8 full DATABASE_URL string)` |

The **full** `DATABASE_URL` (including password) is hashed so that **any** change to user, password, host, port, database, or query options produces a new prefix (with overwhelming probability). The hash prefix is **not** a secret in the same class as the password, but it uniquely identifies the exact connection string variant in use.

## Interpreting fingerprint changes

- If **`fingerprint_prefix10` changes** between deploys or instances while you expected the same database user, **the effective connection string changed** — typical causes: password rotation, pooler vs direct URL swap, database name change, or `sslmode`/options edits.
- If **`fingerprint_prefix10` is stable** but the app still fails to connect, the problem is likely **network**, **Postgres availability**, or **authorization at the server** — not a swapped env string in the app.

## Where to read it

| Surface | Content |
|---------|--------|
| Platform / container logs | `[nursenest-core] database_url_drift_audit …` boot line; `database_url_drift_audit` structured log |
| `npm run db:connectivity-check` | JSON field `databaseUrlDrift` plus the same stderr audit line |
| `GET /api/health` | Public JSON may include **`dbUrlFingerprintPrefix10`** only (no host/user) for quick correlation |
| `GET /api/admin/diagnostics` (admin session) | Full `databaseUrlDrift` object on `diagnostics.databaseUrlDrift` |

## CI / guard: missing or malformed only

`npm run db:validate-url-shape` uses **`runDatabaseUrlShapeGuardForProcess`**:

- **`NN_DATABASE_URL_SHAPE_GUARD=1`**: fail if `DATABASE_URL` is **missing** or **not a parseable** Postgres URL.
- **`CI=true`** (e.g. GitHub Actions): if `DATABASE_URL` is **set** in that job, it must be parseable; if **unset**, the check **passes** (forks and build jobs without DB secrets are not blocked).

The guard does **not** compare `DATABASE_URL` to a local file or a second env var — it only validates presence + URL shape.

## Implementation

- `src/lib/db/database-url-drift-audit.ts` — parse, fingerprint, boot logging, shape guard
- `src/lib/instrumentation/register-node.ts` — calls `logDatabaseUrlDriftAuditOnce` after `logDatabaseEnvOnce`

## Related

- `docs/database-environment.md` — `DATABASE_URL` source of truth and pooler/direct notes
- `docs/environment-reference.md` — env var overview
