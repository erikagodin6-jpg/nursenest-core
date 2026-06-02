# Multilingual international nursing long-tail batch

## Interpretation of contradictory counts (user request)

- The user asked for **1110–1115 posts per language** across **8 languages** while also citing **1180–1120 total posts**; these are **mutually inconsistent** (1110×8 far exceeds 1180).
- **Adopted plan:** **140 posts per language × 8 languages = 1120 total**, aligning with the **1120–1180 total** band when **1110–1115 per language** is treated as a typo for **~110–115** or superseded by a **total-first** reading.

## Schema

- Extended `BlogStaticLongtailRecord` and loader with optional **locale**, **languageCode**, **translationGroupId** (frontmatter-driven).

## Output

- Markdown files under `src/content/blog-static-longtail/` with UTF-8, kebab-case ASCII slugs, bilingual disclaimer containing required English markers for validators.

## Validation commands (run from `nursenest-core/`)

1. `npm run validate:blog-static-longtail`
2. `npm run diagnose:blog-slug-collisions -- --write-report`
3. `npm run typecheck:critical`
4. `npm run test:blog-recovery`
5. `npm run test:homepage`

See `multilingual-longtail-batch-part-01.md` for the per-post index table (may be large).

Generator: `scripts/blog/generate-intl-nursing-longtail-batch.mts`
