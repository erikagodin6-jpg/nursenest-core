# Legacy importer validation (narrow pass)

Automated checklist results are summarized in `legacy-importer-validation.json`.

## Scope

Importer only: `scripts/import-nurse-nest-legacy.ts`, `scripts/lib/stream-json-array.ts`, `scripts/lib/legacy-import-lesson-collision.ts`. No Prisma schema, homepage, or product routes changed in this pass.

## Fixes applied in this pass

1. **`--only` validation** — unknown values (e.g. `foo`) fail fast with `invalid_only`.
2. **Batch size transparency** — values `> 50` clamp to `50`; stderr JSON `notice: batch_size_capped`; final summary includes `batchSize.requested`, `applied`, `cappedToMax`.
3. **Activity pool `stemHash`** — pool rows now use `stemHash(stem)` (fixes undefined `hash` reference at runtime).
4. **Lesson title collision** — secondary detection + quarantine reason codes; see `legacy-importer-collision-rules.json`.

## Manual smoke tests

```bash
# Expect exit 1 + missing_or_invalid_source
npx tsx scripts/import-nurse-nest-legacy.ts --source=/nonexistent/path

# Expect exit 1 + invalid_only
npx tsx scripts/import-nurse-nest-legacy.ts --source=. --only=lessons,nope

# Expect stderr batch_size_capped + applied batchSize 50
npx tsx scripts/import-nurse-nest-legacy.ts --source=. --batch-size=200
```

Dry-run against a real folder still requires a valid `--source` tree with optional subfolders.
