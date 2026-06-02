# Blog publication readiness

- Generated: 2026-05-09T21:57:37.464Z
- Hidden import result file: missing
- Admin/public SSOT report: /root/nursenest-core/reports/blog-admin-public-ssot.md

## Global canonical checks

- Live BlogPost rows (blogLiveWhere): **27**
- Merged sitemap slug rows: **27**
- Live slugs missing from merged sitemap list: **0**
- Draft/needs-review slugs present in merged sitemap list: **0**
- PUBLISHED rows not public by visibility (sample cap 500): **0**

## Hidden-content import checks

- Imported/apply slugs from last result file: **0**
- Imported BlogPost rows found in DB: **0**
- Imported slugs missing BlogPost rows: **0**
- Imported draft/needs-review rows visible to admin list source (`prisma.blogPost`): **0**
- Imported rows with locale != en: **0**
- Imported live rows missing merged sitemap entry: **0**
- Imported draft rows leaking into sitemap: **0**
- Imported rows hidden in unreachable silo: **0**

## Rules checked

- `BlogPostStatus.PUBLISHED` + `workflowStatus=PUBLISHED` + `publishAt <= now` must resolve as live and appear in the merged blog sitemap source.
- Draft / needs-review rows must not appear in the merged blog sitemap source.
- Imported draft rows stay in `BlogPost`, so the admin library and editor continue to read the same rows as the public canonical blog system.
- Imported rows must remain canonical `BlogPost` rows, not `ContentItem` or localized-only silos.
