# Crawled Not Indexed Remediation

Generated: 2026-06-01T01:26:47.645Z

## Search Console Signal

- Reported Crawled - Currently Not Indexed URLs: 718
- URL export status: No local GSC export rows loaded for crawled-not-indexed; affected URL-level findings remain Unable To Verify from this workspace.

## Top Templates

_No Search Console URL export rows were available for this issue._

## Required Per-URL Measurements

| Measurement | Why It Matters |
| --- | --- |
| Word count | Identifies thin pages. |
| Unique paragraph count | Detects duplicate or boilerplate pages. |
| Schema present | Helps Google understand page purpose. |
| Canonical | Prevents duplicate or conflicting index signals. |
| Internal links in/out | Determines whether page is contextually important. |
| Breadcrumbs | Reinforces hierarchy and crawl discovery. |
| Educational depth | Distinguishes real learning content from generated snippets. |

## Next Step

Place the 718 affected URLs at `data/gsc-indexing/crawled-not-indexed.csv` and rerun `npm run audit:gsc-indexing`. Until then, URL-level word count, uniqueness, schema, and link density remain Unable To Verify.
