# Database Hardening Complete
**Generated:** 2026-06-01  
**Addresses:** Content publication failure post-mortem action items

---

## Safeguards Implemented

### 1. Template Placeholder Detection (Always-On)
**File:** `src/lib/env/require-database-env.ts`

Added `isEnvTemplatePlaceholderDatabaseUrl()` which scans for eight token patterns that appear only in `.env.example` templates, never in real credentials:

```
:PORT/     @HOST:     //USER:    :PASSWORD@
:port/     @host:     //user:    :password@
```

This check runs **regardless of `NN_SKIP_DATABASE_ENV_CONTRACT`** — the bypass flag could not previously prevent template URLs from silently reaching Prisma's Rust engine.

**Before (broken path):**
```
NN_SKIP_DATABASE_ENV_CONTRACT=1
→ requireDatabaseEnv() returns raw template URL with no validation
→ env-bootstrap.ts silently fails URL parsing (new URL throws for :PORT)
→ Prisma receives postgresql://USER:PASSWORD@HOST:PORT/DATABASE
→ Rust engine: "invalid port number in database URL"
```

**After (fixed path):**
```
NN_SKIP_DATABASE_ENV_CONTRACT=1
→ requireDatabaseEnv() checks isEnvTemplatePlaceholderDatabaseUrl()
→ Throws: "DATABASE_URL contains .env.example template placeholders (:PORT/ or @HOST:).
          Copy real credentials from your database provider into .env.local."
→ Clear actionable error, no cryptic Prisma message
```

**New function added:**
```typescript
export function isEnvTemplatePlaceholderDatabaseUrl(url: string): boolean
```

**Modified functions:**
- `requireDatabaseEnv()` — checks template markers even when contract is skipped
- `isRejectedRuntimePlaceholderDatabaseUrl()` — delegates to template check

---

### 2. Consistent Env Loading Across All Publication Scripts
**File:** `scripts/generate-fnp-question-flashcard-pipeline.mts`

Added `import "@/lib/db/script-env-bootstrap"` as the first import, matching all other generation scripts. Removed the deferred `loadDotenv()` call from inside `main()`.

**Effect:** URL validation, placeholder detection, and URL tuning now happen at module load time — before any AI generation begins. If credentials are wrong, the script fails immediately with a diagnostic error rather than spending time generating content that cannot be saved.

---

### 3. Comprehensive Publication Preflight Script
**File:** `scripts/db-publication-preflight.mts`

New script that must be run before any publication pipeline. Performs 9 checks:

| Check | What it verifies |
|---|---|
| `DATABASE_URL` | Present, no placeholder tokens, valid postgresql:// URL, numeric port |
| `DIRECT_URL` | Same as above |
| `prisma_connect` | Prisma can open a connection |
| `read:ExamQuestion` | Table is accessible and returns row count |
| `read:Flashcard` | Table is accessible and returns row count |
| `read:PathwayLesson` | Table is accessible and returns row count |
| `read:FlashcardDeck` | Table is accessible and returns row count |
| `read:Category` | Table is accessible and returns row count |
| `write_probe` | Insert + immediate transaction rollback — confirms write path works |

```bash
npx tsx --tsconfig tsconfig.json scripts/db-publication-preflight.mts
```

Exit code `0` = all clear. Exit code `1` = publication must not proceed.

---

### 4. Per-Pathway Count Script
**File:** `scripts/count-np-pathways.mts`

Lightweight script for before/after publication audits:
```bash
npx tsx --tsconfig tsconfig.json scripts/count-np-pathways.mts
```

Outputs `questions`, `flashcards`, and `lessons` counts for all six NP/PN pathways.

---

## What Was NOT Changed

- **`NN_SKIP_DATABASE_ENV_CONTRACT` flag is still supported** but no longer provides a bypass for template placeholders. Its remaining purpose is skipping missing-URL checks in isolated unit test environments where DATABASE_URL is intentionally unset.

- **`.env.local` `NN_SKIP_DATABASE_ENV_CONTRACT=1` line**: This should be removed from `.env.local`. It was added as a workaround when the placeholder URL was incorrectly set. With real credentials now in `.env.local` and the template detection implemented at the code level, this flag is unnecessary and reduces protection.

- **Prisma schema** (`directUrl = env("DIRECT_URL")`): Not changed. DIRECT_URL derives from DATABASE_URL when unset via `applyDirectDatabaseUrlFromEnv()` in scripts using `script-env-bootstrap`.

---

## Recommended `.env.local` Change

Remove the bypass flag:

```diff
-NN_SKIP_DATABASE_ENV_CONTRACT=1
```

With real credentials and the new template guard in place, this flag is not needed and suppresses helpful validation.

---

## Prevention Summary

| Failure Mode | Old Behavior | New Behavior |
|---|---|---|
| Template URL in `.env.local` with skip flag | Silently reaches Prisma → "invalid port number" | Fails at bootstrap with clear message |
| Template URL in `.env.local` without skip flag | Fails at `assertPostgresConnectionStringShape` | Same + also caught by template marker check |
| Missing DATABASE_URL in script process | Silent failure at first DB query | Fails at `script-env-bootstrap` import |
| DB unreachable before publication | Script starts, fails mid-generation | `db-publication-preflight.mts` blocks before start |
| Content generated without DB write path verified | Write silently fails | Preflight `write_probe` catches it |

---

## CI Integration (Recommended Next Step)

Add to CI pipeline before any DB-touching job:

```yaml
- name: Database preflight
  run: |
    cd nursenest-core
    npx tsx --tsconfig tsconfig.json scripts/db-publication-preflight.mts --json
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    DIRECT_URL: ${{ secrets.DIRECT_URL }}
```

This ensures DB environment is valid before content generation jobs are scheduled, and provides a clear exit code for job gating.
