# Pharmacy long-tail batch (25 posts)

**Generated:** 2026-05-10  
**Directory:** `src/content/blog-static-longtail/`  
**Generator:** `scripts/blog/generate-pharmacy-longtail-batch.mts` (re-runnable; enforces **≥1400** body words before writing)

## Aggregate validation

| Command | Result | Exit code |
|---------|--------|-----------|
| `npm run validate:blog-static-longtail` | OK (all long-tail records passed schema/disclaimer/canonical checks) | 0 |
| `npm run diagnose:blog-slug-collisions -- --write-report` | Completed; report `docs/reports/blog-slug-collision-diagnostic.txt` | 0 |
| `npm run typecheck:critical` | Pass | 0 |
| `npm run test:blog-recovery` | 62/62 tests pass | 0 |
| `npm run test:homepage` | 78 pass, 1 skipped | 0 |

**DB ∩ supplement collision note:** The diagnostic lists **20** live `BlogPost` rows whose slugs overlap the supplement union. **None of the 25 new pharmacy slugs appear in that overlap list.**

## Per-post summary (word counts from generator)

See table in parent agent notes: all 25 slugs 1608–1781 words; minimum gate 1400.

## Files touched

- 25 markdown files under `src/content/blog-static-longtail/` (slugs ending in `-pharmacy-*` or `pharmacology-explained` / `clinical-guide` as listed in generator).
- `scripts/blog/generate-pharmacy-longtail-batch.mts`
- This file: `reports/pharmacy-longtail-batch-25.md`

## Citation note

References use FDA, ACC/AHA, ADA (URL), CHEST, IDSA/ATS, NEJM (serotonin syndrome), GOLD/GINA URLs, ACC cholesterol guideline, ASHP pages—no fabricated DOIs.
