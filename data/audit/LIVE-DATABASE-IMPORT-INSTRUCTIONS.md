# Live database: legacy import and validation

This document is the **operator runbook** for running legacy flashcard and question-bank imports against a **real** Postgres database, then validating results. It is safe to commit; it does not contain secrets.

## Prerequisites

- Working directory: **`nursenest-core/`** (the Next.js app package).
- **`DATABASE_URL`** set to the target database (production, staging, or a disposable clone). The import scripts **exit with a clear error** if this variable is missing on a **non–dry-run** run.
- Node **22+** and npm **10+** per `package.json` engines.

## What gets written under `data/audit/`

| Artifact | Produced by | Purpose |
| --- | --- | --- |
| `legacy-full-content-import-report.json` | `npm run import:legacy-full-content` | Pre/post counts from the combined import orchestrator |
| `post-import-db-validation.json` | `npm run validate:legacy-post-import` | Totals and group-bys after import |
| `post-import-db-validation.md` | same | Human-readable summary + pointers |
| `legacy-question-mapping-quality.json` | `npm run audit:legacy-question-mapping` | Tier/exam/source heuristics, rationale gaps, stem_hash collision sample |

Commit these JSON/MD files **after** a real run if you want the repo to record evidence; otherwise they are generated on the target machine only.

## Recommended order (production-safe, idempotent)

Imports are designed to be **re-runnable**: they upsert or skip in ways that do not duplicate primary keys. Always take a **backup or use a staging DB** before first production use.

1. **Dry run (no `DATABASE_URL` required for parsing phases)** — validates extractors and writes reports without writing:

   ```bash
   cd nursenest-core
   npm run import:legacy-full-content:dry-run
   ```

2. **Live combined import** (flashcards + question-bank path used by the orchestrator):

   ```bash
   export DATABASE_URL='postgresql://...'
   cd nursenest-core
   npm run import:legacy-full-content
   ```

   Equivalent individual commands (if you must run phases separately):

   ```bash
   npm run import:legacy-client-flashcards
   npm run import:legacy-question-bank
   ```

3. **Post-import DB validation** (requires `DATABASE_URL`):

   ```bash
   npm run validate:legacy-post-import
   ```

4. **Mapping quality audit** (requires `DATABASE_URL`):

   ```bash
   npm run audit:legacy-question-mapping
   ```

## CI usage

Use the same commands with `DATABASE_URL` injected from your secret store. Prefer **dry-run** on pull requests and **live import + validation** on a protected branch or manual workflow against a non-production database first.

## Proof tiers (do not confuse)

| Tier | Meaning |
| --- | --- |
| **Implemented** | Scripts and npm entries exist in the repo; dry-run can run without a database. |
| **Dry-run proof** | `*:dry-run` completed locally or in CI; JSON reports show parse/normalize counts. |
| **Live DB proof** | `DATABASE_URL` pointed at a real DB; import + `validate:legacy-post-import` + `audit:legacy-question-mapping` completed; artifacts under `data/audit/` reflect that run. |

Sandbox environments without `DATABASE_URL` can only demonstrate **implemented** and **dry-run** tiers unless you attach a database.
