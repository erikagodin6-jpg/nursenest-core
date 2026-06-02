# Database Preflight Check Report
**Generated:** 2026-06-01  
**Script:** `scripts/db-publication-preflight.mts`

---

## Summary

All 9 preflight checks passed. Database is ready for content publication.

```
[preflight] PASS  DATABASE_URL                        valid postgresql URL · port 25060 · host nursenestdatabase-do-user-35062022-0.g.d
[preflight] PASS  DIRECT_URL                          valid postgresql URL · port 25060 · host nursenestdatabase-do-user-35062022-0.g.d
[preflight] PASS  prisma_connect                      connected
[preflight] PASS  read:ExamQuestion                   88256 rows
[preflight] PASS  read:Flashcard                      15266 rows
[preflight] PASS  read:PathwayLesson                  13040 rows
[preflight] PASS  read:FlashcardDeck                  179 rows
[preflight] PASS  read:Category                       40 rows
[preflight] PASS  write_probe                         write + rollback OK

[preflight] ALL CHECKS PASSED (6300ms)
{"pass":true,"checks":9,"failed":0,"elapsedMs":6300}
```

---

## Checks Performed

### 1. Environment Validation
- Scans DATABASE_URL and DIRECT_URL for placeholder tokens: `USER PASSWORD HOST PORT DATABASE localhost 127.0.0.1 example changeme`
- Verifies URL protocol is `postgresql:` or `postgres:`
- Verifies port is numeric
- Verifies hostname is present

### 2. Prisma Connection (`prisma.$connect()`)
- Creates PrismaClient and calls `$connect()`
- Aborts all further checks if connection fails

### 3. Read Probes — Five Core Tables
- `prisma.examQuestion.count()` — questions table accessible
- `prisma.flashcard.count()` — flashcards table accessible
- `prisma.pathwayLesson.count()` — lessons table accessible
- `prisma.flashcardDeck.count()` — decks table accessible
- `prisma.category.count()` — categories table accessible

### 4. Write Probe (Transaction Rollback)
- Attempts to upsert a canary category row (`__preflight_canary__`)
- Throws an intentional error inside the transaction to force rollback
- Confirms write capability without permanently modifying the database

---

## Database Connection Details

| Property | Value |
|---|---|
| Host | `nursenestdatabase-do-user-35062022-0.g.db.ondigitalocean.com` |
| Port | `25060` (direct non-pooled Postgres) |
| Provider | DigitalOcean Managed PostgreSQL |
| SSL | `sslmode=require` |
| Connection source | `.env.local` via `script-env-bootstrap` |
| Prisma version | `6.19.3` |

---

## How to Run

```bash
# From nursenest-core/ directory
npx tsx --tsconfig tsconfig.json scripts/db-publication-preflight.mts

# Machine-readable JSON output
npx tsx --tsconfig tsconfig.json scripts/db-publication-preflight.mts --json
```

Exit code `0` = all checks pass. Exit code `1` = one or more checks failed.

**Run this before every content publication script.**

---

## Integration with Publication Scripts

The preflight is referenced at the start of all publication scripts via `@/lib/db/script-env-bootstrap`, which performs URL validation. For full write-path verification before running `--apply`, run the preflight explicitly first:

```bash
npx tsx --tsconfig tsconfig.json scripts/db-publication-preflight.mts && \
npx tsx --tsconfig tsconfig.json scripts/generate-fnp-launch-readiness-content.mts --apply
```
