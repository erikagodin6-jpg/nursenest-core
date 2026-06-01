# Content Publication Root Cause Analysis
**Generated:** 2026-06-01  
**Severity:** P0 — all NP content publication pipelines blocked  
**Status:** RESOLVED

---

## 1. Exact Root Cause

**`.env.local` contained the placeholder DATABASE_URL template at the time the scripts were run.**

At the time of the failed runs (~21:00), `.env.local` line 5 contained:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
DIRECT_URL=postgresql://USER:PASSWORD@HOST_DIRECT:PORT/DATABASE?sslmode=require
```

The literal string `PORT` is not a valid port number. Prisma's Rust-based connection engine (v6.19.3) parses the connection string before opening the socket and rejects the non-numeric port with:

```
The provided database string is invalid. Error parsing connection string:
invalid port number in database URL.
```

**Secondary contributing factor:** `generate-fnp-question-flashcard-pipeline.mts` was the only generation script that did NOT use `@/lib/db/script-env-bootstrap`. It loaded dotenv inside `main()` instead of at module import time. This meant:
1. No early URL validation via `requireDatabaseEnv()` — no helpful error before the script invested time generating content
2. Inconsistent env loading pattern across the script family
3. When Prisma finally tried to connect, the full error was buried in a catch block and written to the report rather than surfaced immediately to the console

---

## 2. Why Generation Succeeded But Writes Failed

| Script | Dry-run DB access | Apply DB access |
|---|---|---|
| `generate-fnp-launch-readiness-content.mts` | **None** — content built from catalog JSON + domains | PrismaClient created at line 704, first query is `category.upsert()` |
| `generate-agpcnp-launch-readiness-content.mts` | **None** | Same pattern |
| `generate-whnp-launch-readiness-content.mts` | **None** | Same pattern |
| `generate-fnp-question-flashcard-pipeline.mts` | **Yes** — `loadDbLessons()` at line 667, before the `!APPLY` gate | Continues past lesson load if DB succeeds |

The three launch-readiness scripts use `if (!APPLY) { ... return; }` BEFORE creating a PrismaClient. Their dry runs never touched the database — they succeeded because generation is purely computational (domain-based question construction, no Prisma). When `--apply` was passed, PrismaClient was created and the placeholder URL immediately failed.

The FNP pipeline script was designed to fall back to catalog lessons on DB failure (catch block at line 669), write a failure report, and exit silently rather than abort loudly. This masked the root cause: the report said "invalid port number" but the script exited zero and required reading the markdown file to diagnose.

---

## 3. Why It Persisted Across All Pipelines

All scripts share the same `.env.local` file. A single unconfigured credential file blocked every pipeline simultaneously.

The validation bypass `NN_SKIP_DATABASE_ENV_CONTRACT=1` in `.env.local` caused `requireDatabaseEnv()` to return the raw URL without shape validation, allowing the invalid URL to reach Prisma instead of failing with a diagnostic error at bootstrap.

Timeline:
- Placeholder credentials in `.env.local` (before ~21:58)
- FNP pipeline run with `--apply` at ~21:00 → fails, writes report
- Real credentials added to `.env.local` at ~21:58
- All subsequent tests pass

---

## 4. Affected Scripts

| Script | Pathway | Status at failure time |
|---|---|---|
| `scripts/generate-fnp-launch-readiness-content.mts` | `us-np-fnp` | Dry-run: ✓ Apply: ✗ |
| `scripts/generate-agpcnp-launch-readiness-content.mts` | `us-np-agpcnp` | Dry-run: ✓ Apply: ✗ |
| `scripts/generate-whnp-launch-readiness-content.mts` | `us-np-whnp` (inferred) | Dry-run: ✓ Apply: ✗ |
| `scripts/generate-fnp-question-flashcard-pipeline.mts` | `us-np-fnp` | Dry-run: ✗ (fail→static fallback) Apply: ✗ |

**Not affected:**
- `scripts/gap-batch-wave-final.py` — Python, writes directly to catalog JSON, no Prisma/DB
- `scripts/generate-pnp-pc-launch-readiness-content.mts` — not yet attempted

---

## 5. Permanent Fix

### Fix 1 — Credentials (applied at ~21:58): `.env.local`

Real DigitalOcean managed database credentials are now set:
```
DATABASE_URL=postgresql://doadmin:[REDACTED]@nursenestdatabase-do-user-35062022-0.g.db.ondigitalocean.com:25060/defaultdb?sslmode=require
DIRECT_URL=postgresql://doadmin:[REDACTED]@nursenestdatabase-do-user-35062022-0.g.db.ondigitalocean.com:25060/defaultdb?sslmode=require
```

Port 25060 is DigitalOcean's direct (non-pooled) Postgres port. Both URLs parse correctly and Prisma connects successfully.

### Fix 2 — Script consistency (applied now): `generate-fnp-question-flashcard-pipeline.mts`

Added `import "@/lib/db/script-env-bootstrap"` as the first import and removed the in-`main()` dotenv call. This script now matches the pattern used by all other generation scripts:

```typescript
// Before:
import { config as loadDotenv } from "dotenv";
// ... inside main():
loadDotenv({ path: resolve(process.cwd(), ".env.local"), override: false });

// After:
import "@/lib/db/script-env-bootstrap";
// No loadDotenv call
```

**Effect:**
- `requireDatabaseEnv()` validates the URL at module load time, before any content is generated
- If credentials are missing, the script fails immediately with a clear error rather than generating content that cannot be saved
- URL tuning (`connection_limit`, `pool_timeout`, `connect_timeout`) is applied consistently

---

## 6. Verification

```bash
# Confirm all scripts load credentials and report presence
npx tsx --tsconfig tsconfig.json scripts/generate-fnp-launch-readiness-content.mts
# Expected: [script-env-bootstrap] DATABASE_URL present: true
# Expected: Dry run: NNNN questions, NNN adaptive/CAT-eligible questions, NNN source lessons.

npx tsx --tsconfig tsconfig.json scripts/generate-agpcnp-launch-readiness-content.mts
# Expected: [script-env-bootstrap] DATABASE_URL present: true

npx tsx --tsconfig tsconfig.json scripts/generate-whnp-launch-readiness-content.mts
# Expected: [script-env-bootstrap] DATABASE_URL present: true

npx tsx --tsconfig tsconfig.json scripts/generate-fnp-question-flashcard-pipeline.mts
# Expected: [script-env-bootstrap] DATABASE_URL present: true
# Expected: "ok": true, "selectedLessons": 200 (DB-backed, not static fallback)
```

All four verified locally as of 2026-06-01. Each returns `DATABASE_URL present: true` and completes dry-runs successfully.

### To publish (run from `nursenest-core/` directory):

```bash
npx tsx --tsconfig tsconfig.json scripts/generate-fnp-launch-readiness-content.mts --apply
npx tsx --tsconfig tsconfig.json scripts/generate-agpcnp-launch-readiness-content.mts --apply
npx tsx --tsconfig tsconfig.json scripts/generate-whnp-launch-readiness-content.mts --apply
npx tsx --tsconfig tsconfig.json scripts/generate-fnp-question-flashcard-pipeline.mts --apply
```

---

## 7. Prevention

1. **Never set `NN_SKIP_DATABASE_ENV_CONTRACT=1` in `.env.local`** — this was masking the placeholder URL and allowing it through to Prisma. Remove this flag; the contract check provides the first line of defense against misconfigured credentials.

2. **All generation scripts must use `@/lib/db/script-env-bootstrap`** — this is now enforced for all four NP content scripts. The bootstrap provides early URL validation, URL tuning, and consistent dotenv loading.

3. **`.env.local` must be populated from the DigitalOcean App Platform secrets before running any `--apply` pipeline.** The secrets are available via: DigitalOcean Console → Apps → nursenest-core-next → Settings → App-Level Environment Variables.
