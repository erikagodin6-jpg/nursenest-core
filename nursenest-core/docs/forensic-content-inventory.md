# Forensic Content Inventory

Generated: 2026-05-31

Scope: live database tables, CMS-like `content_items`, article generation jobs, draft and schedule queues, static blog supplements, static long-tail markdown, SEO/blog registries, manifests, JSON records, Markdown/MDX files, import/generator/admin tooling, and repository storage locations.

This inventory is intentionally forensic: totals include active article rows, source files, generator queue rows, schedule rows, manifest records, and repository artifacts. It is not the same as unique public URLs.

## Executive Totals

| Metric | Count |
| --- | ---: |
| Total content assets found | 19,007 |
| Active `BlogPost` database rows | 4,366 |
| Published/indexable public URLs | 4,627 |
| Sitemap URLs | 4,627 |
| Localized published article rows | 2 |
| Static/repo supplemental article records | 4,598 |
| Repository article/content files found | 5,209 |
| Article-like `ContentItem` rows | 52 |
| AI article generation jobs | 51 |
| Draft generation batch items | 248 |
| Blog schedule items | 4,481 |
| Human-review article rows | 169 |

## Reconciliation

| Reconciliation Item | Count | Finding |
| --- | ---: | --- |
| Database total | 4,366 | Active `BlogPost` table after recovery/materialization. |
| Visible total | 4,627 | Unique public URL inventory after de-duplicating DB rows and static supplements. |
| Indexable total | 4,629 | Visible total plus 2 localized published article rows. |
| Sitemap total | 4,627 | Matches visible total; no visible/sitemap discrepancy. |
| Published missing from sitemap | 0 | No publishable visible article is currently excluded from sitemap coverage. |
| Scheduled overdue | 0 | No overdue scheduled article rows found. |
| Orphaned published posts | 0 | No published post lacks all category/tag/career/exam anchors. |

## Location Inventory

| Location | Record Count | Status Breakdown | Public / Hidden | Indexable / Noindex | Last Modified |
| --- | ---: | --- | --- | --- | --- |
| `BlogPost` database table | 4,366 | Published 4,220; pending review 142; draft 3; failed/hidden 1 | 4,217 public content rows; 149 hidden/noindex rows including review/draft/failed/test-artifact exclusions | 4,217 indexable DB rows; 149 noindex/blocked | 2026-05-27T12:00:00.000Z |
| `LocalizedBlogArticle` database table | 2 | Published 2 | 2 public; 0 hidden | 2 indexable | 2026-04-14T02:03:47.854Z |
| Article-like `ContentItem` rows | 52 | Quarantined 52 | 0 public; 52 hidden | 0 indexable; 52 noindex | 2026-04-13T20:29:14.528Z |
| `BlogArticleGenerationJob` rows | 51 | Queued 47; failed 4 | 0 public; 51 pipeline-only | 0 indexable; 51 noindex | 2026-05-21T23:25:11.011Z |
| `BlogDraftGenerationBatchItem` rows | 248 | Completed 2; failed 12; pending 234 | 0 public; 248 pipeline-only | 0 indexable; 248 noindex | 2026-05-09T21:50:34.793Z |
| `BlogBatchScheduleItem` rows | 4,481 | Published/completed 7; pending 4,474 | 0 direct public routes; 4,481 schedule metadata rows | 0 direct indexable routes; 4,481 noindex as schedule records | 2026-04-29T09:47:22.450Z |
| Static/repo supplemental article corpus | 4,598 | 4,189 have matching DB slugs; 409 remain static-only quality-skipped supplements | 410 unshadowed static public fallbacks; remainder shadowed by DB or not separate public records | 410 static fallback URLs remain indexable through public routing; DB rows win on slug overlap | Latest long-tail file: 2026-05-27T21:33:20Z |
| Repository forensic content files | 5,209 | Markdown 4,595; JSON 18; registry/generator files 560; manifest files 36 | Mixed: source/provenance/generator artifacts, not all public routes | Mixed: content sources are not independently indexable unless routed | Latest matching repo file: 2026-05-31T21:52:02Z |

## Database Status Breakdown

| Status | Count |
| --- | ---: |
| Published | 4,220 |
| Pending review | 142 |
| Draft | 3 |
| Hidden/failed | 1 |
| Scheduled | 0 |
| Archived | 0 |

## Locale Breakdown

| Locale Bucket | Count |
| --- | ---: |
| English | 3,466 |
| French | 150 |
| Spanish | 150 |
| Other | 600 |

## Pathway Breakdown

| Pathway | Count |
| --- | ---: |
| RN | 1,980 |
| PN/RPN | 796 |
| NP | 879 |
| Allied | 711 |
| Pre-Nursing | 0 |

## Quality Classification

| Grade | Count |
| --- | ---: |
| A+ | 1,306 |
| A | 1,990 |
| B | 902 |
| C | 150 |
| D | 18 |

Publishable content is now either active in `BlogPost` or available through the public static fallback route. C/D rows and review-required records are intentionally not force-published.

## Repository File Inventory

| File Type | Count |
| --- | ---: |
| Markdown / MDX source files | 4,597 |
| JSON source files | 83 |
| Forensic blog/content-related files matched by source scan | 5,274 |
| Blog recovery report file | 1 |

Primary article storage locations found:

- `src/content/blog-static-longtail`
- `src/content/blog-static-posts.ts`
- `src/lib/blog`
- `src/lib/seo`
- `scripts/blog`
- `data`
- `reports/blog-recovery`

## Publication And Indexing Findings

| Finding | Result |
| --- | --- |
| Published content missing sitemap | None found |
| Visible URL count vs sitemap count | 4,627 vs 4,627 |
| Overdue scheduled content | None found |
| Orphaned published content | None found |
| Hidden article-like CMS rows | 52 quarantined `ContentItem` rows |
| AI generation backlog | 47 queued generation jobs; 4 failed jobs |
| Draft backlog | 234 pending draft batch items; 12 failed |
| Schedule backlog | 4,474 pending schedule rows |

## Exact Inventory Interpretation

`19,007` is the total forensic asset count across database rows, localized records, article-like CMS rows, generation jobs, draft queues, schedule queues, static supplements, and repository content files.

`4,627` is the current exact public URL inventory after de-duplication and route/sitemap reconciliation.

`4,168` previously static long-tail/static articles have been recovered into the active `BlogPost` pipeline. The remaining non-DB static rows are either shadowed by DB slugs, static fallback records, or quality-skipped/static-only records requiring editorial review before materialization.

## Remaining Review Queue

| Queue | Count | Action |
| --- | ---: | --- |
| C/D quality DB rows | 168 | Clinical/editorial rewrite or discard decision required. |
| Human-review total | 169 | Do not auto-publish without review. |
| Static quality-skipped records | 409 | Review for thin, placeholder, duplicate, or metadata issues before DB materialization. |
| Quarantined `ContentItem` rows | 52 | Keep hidden unless manually promoted into canonical blog pipeline. |
| Failed generation jobs | 4 | Retry or archive after inspecting failure cause. |
| Failed draft batch items | 12 | Retry only if source topic remains useful. |

## Conclusion

The content exists in multiple layers, not only the blog table. The active public corpus is reconciled: visible URLs and sitemap URLs match, and no published/indexable article is currently missing from sitemap coverage. The largest hidden pools are generation/schedule pipeline metadata, quarantined `ContentItem` rows, and static quality-skipped records that should remain out of the active publication pipeline until reviewed.
