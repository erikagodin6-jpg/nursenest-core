# RT long-tail batch (300 posts) — report index

Generated: 2026-05-10

## Aggregate

| Metric | Value |
| --- | ---: |
| Posts (manifest) | 300 |
| Word band pass (1200–1800 body words) | 300 |
| Word band fail | 0 |
| Slug prefix | rt- |

## Part files

- [rt-longtail-batch-300-part-01.md](./rt-longtail-batch-300-part-01.md)
- [rt-longtail-batch-300-part-02.md](./rt-longtail-batch-300-part-02.md)
- [rt-longtail-batch-300-part-03.md](./rt-longtail-batch-300-part-03.md)

## Validation (run from nursenest-core/)

- npm run validate:blog-static-longtail — required
- npm run diagnose:blog-slug-collisions -- --write-report
- npm run typecheck:critical
- npm run test:blog-recovery
- npm run test:homepage

## Generator

- npx tsx scripts/blog/generate-rt-longtail-files.mts --dry-run — word count audit
- npx tsx scripts/blog/generate-rt-longtail-files.mts --force — regenerate all RT files

## Notes

Content is deterministic from scripts/blog/rt-longtail/manifest.ts and body-builder.ts (seeded pools). Internal links include other /blog/rt-* posts and selected nursing long-tail hubs where present.
