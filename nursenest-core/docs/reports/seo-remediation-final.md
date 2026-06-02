# SEO remediation — workbook + tooling (2026-05-11)

## Status summary

| Area | Status |
| --- | --- |
| **`npm run seo:coverage:ingest`** | Script **`seo:coverage:ingest`** added to `package.json`. Ingest resolves `data/seo/nursenest.ca-Coverage-2026-05-10.xlsx` from cwd, parent folder, or `nursenest-core/` subfolder; explicit path still supported. |
| **Workbook file on disk** | **`nursenest.ca-Coverage-2026-05-10.xlsx` was not present** under `data/seo/` in this workspace (only `README.md`). **Row-level fixes from the export could not be applied from source rows.** Place the file at `nursenest-core/data/seo/nursenest.ca-Coverage-2026-05-10.xlsx` and re-run ingest → classify → URL trace → code fixes. |
| **`docs/reports/seo-coverage-inventory.generated.json`** | Not generated until ingest runs with the workbook present. |

## Row-level issue inventory (workbook-derived)

**Not available** until the Coverage `.xlsx` is ingested.

Pipeline:

1. `npm run seo:coverage:ingest -- --out=docs/reports/seo-coverage-inventory.generated.json`
2. Review bucket counts per sheet in the generated JSON.
3. Extend `src/lib/seo/seo-coverage-classifier.ts` for remaining `unclassified` patterns.

## Fixes completed in this pass

1. **Long-tail SEO trio blog builder** (`scripts/blog/lib/long-tail-seo-trio-blog-post-builder.ts`): Meets **≥1500 words** and publish/content quality gates (partial vs full keyword anchors, distinct section prose, **Stem-to-priority drill** section).
2. **`seo-coverage-classifier.ts`**: **`weak_open_graph`** rule bucket name corrected (was invalid `poor_open_graph`).
3. **`ingest-nursenest-coverage-xlsx.mts`**: Default path tries multiple repo layouts.
4. **`package.json`**: **`seo:coverage:ingest`** script added.

## URLs intentionally excluded / non-goals this pass

- No workbook-driven route or metadata edits (file missing).
- No blind `noindex` changes.

## URLs requiring manual Google Search Console validation

- After workbook fixes: validate Coverage, Sitemaps, Hreflang, and Enhancements for touched URLs.

## Commands run (2026-05-11)

| Command | Result |
| --- | --- |
| `npm run typecheck:critical` | Pass |
| `npm run test:seo-sitemap` | Pass (44 tests) |
| `npm run sitemap:validate` | Pass — duplicate loc 0, invalid locs 0 |
| `npm run sitemap:report` | OK |
| `npm run seo:coverage:ingest` | Requires `.xlsx` at resolved path |

## Residual risks

1. Workbook rows not processed until file is added.
2. Classifier may need more `RULES` once real export text is ingested.
3. Blog builder thresholds may need tuning if editorial gates tighten.

## Next steps

1. Add `nursenest.ca-Coverage-2026-05-10.xlsx` under `data/seo/`.
2. Run ingest; remediate URLs per buckets; re-verify commands above.
