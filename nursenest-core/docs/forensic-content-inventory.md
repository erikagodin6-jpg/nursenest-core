# NurseNest Forensic Content Inventory

Generated: 2026-05-31T20:45:24.890Z

## Executive Totals

- Total inventory records/artifacts counted by location: **8674**
- Database/CMS records counted: **0**
- File/static/generated records counted: **8674**
- Database available: **no** (source: app .env.local)
- Locations scanned: **618**

Important counting note: this is a forensic location inventory, not a deduplicated canonical-slug corpus. If one article exists in a generator manifest, import JSON, and BlogPost, it is counted in each location so recovery can find every copy.

Database/CMS blocking gap: the configured DATABASE_URL was present but unreachable from this workspace during the run, so BlogPost, LocalizedBlogArticle, ContentItem, schedule, generation-job, and automation-log counts are not included in the numeric total. Re-run this script in the production/runtime shell with a reachable DATABASE_URL for the exact database total.

## Source Breakdown

- database: 0
- markdown: 182
- json: 5178
- typescript: 3314

## Status Breakdown Across All Locations

- (record): 2508
- status:planned: 2400
- source_records: 345
- status:written: 140
- file:hidden_or_internal: 124
- status:sample: 90
- file: 58
- planned: 43
- draft: 21
- status:published_static_longtail: 20
- status:PUBLISHED: 20
- published: 18
- failed: 12
- live: 9
- hidden: 7
- FAILED: 6
- queued: 5
- PUBLISHED: 4
- SUCCEEDED: 4
- body: 4
- pending: 3
- skipped: 2
- ok: 2
- SKIPPED: 2
- seo_title: 2
- complete: 2
- database_unreachable: 1
- error: 1
- asc: 1
- skipped_duplicate: 1
- orphaned: 1
- generating_plan: 1
- persist: 1
- thrown: 1
- plan: 1
- validation: 1
- review: 1
- (missing): 1
- admin_blog_publish_visibility_failed: 1
- blog_index_empty_after_expand_timeout_retry: 1
- blog_index_return_static_build_phase: 1
- blog_index_return_static_no_database_url: 1
- blog_index_return_degraded_static_on_db_error: 1
- blog_index_return_db_error: 1
- blog_index_locale_fallback_db_error: 1
- blog_index_return_live_db_locale_fallback: 1
- blog_index_return_merged_cms_static: 1
- blog_index_return_live_db_merge_fetch_failed: 1
- blog_index_return_live_db_over_merge_cap: 1
- blog_index_return_live_db_scoped: 1
- blog_index_return_true_empty: 1
- SCHEDULED: 1
- active: 1
- public_flashcard_hub_payload: 1

## Inventory Table

| Location | Record Count | Status Breakdown | Public/Hidden | Indexable/Noindex | Last Modified | Evidence |
|---|---:|---|---|---|---|---|
| output/allied-content-batch.json | 400 | (record):400 | unknown | unknown | 2026-05-20T18:26:11.974Z | arrays: lessons, questions |
| reports/content-quality/question-flashcard-rationale-audit.json | 291 | (record):291 | hidden/internal | unknown | 2026-05-29T10:40:43.080Z | arrays: records |
| output/rn-content-batch.json | 250 | (record):250 | public | unknown | 2026-05-20T18:26:12.008Z | arrays: lessons, questions |
| scripts/blog/allied-longtail-250.ca-allied-core.manifest.json | 250 | (record):250 | unknown | indexable/public-surface | 2026-05-20T18:26:15.278Z | arrays: items |
| scripts/blog/allied-longtail-250.manifest.json | 250 | (record):250 | unknown | indexable/public-surface | 2026-05-20T18:26:15.279Z | arrays: items |
| output/pre-nursing-content-batch.json | 210 | (record):210 | unknown | unknown | 2026-05-20T18:26:12.004Z | arrays: lessons, questions |
| data/blog-manifest/australia-nursing-200.manifest.json | 200 | status:planned:200 | unknown | unknown | 2026-05-20T18:26:09.818Z | arrays: entries |
| data/blog-manifest/china-nursing-200.manifest.json | 200 | status:planned:200 | unknown | unknown | 2026-05-20T18:26:09.818Z | arrays: entries |
| data/blog-manifest/france-nursing-200.manifest.json | 200 | status:planned:200 | unknown | unknown | 2026-05-20T18:26:09.819Z | arrays: entries |
| data/blog-manifest/germany-nursing-200.manifest.json | 200 | status:planned:200 | unknown | unknown | 2026-05-20T18:26:09.819Z | arrays: entries |
| data/blog-manifest/hungary-nursing-200.manifest.json | 200 | status:planned:200 | unknown | unknown | 2026-05-20T18:26:09.820Z | arrays: entries |
| data/blog-manifest/india-nursing-200.manifest.json | 200 | status:planned:200 | unknown | unknown | 2026-05-20T18:26:09.820Z | arrays: entries |
| data/blog-manifest/italy-nursing-200.manifest.json | 200 | status:planned:200 | unknown | unknown | 2026-05-20T18:26:09.821Z | arrays: entries |
| data/blog-manifest/japan-nursing-200.manifest.json | 200 | status:planned:200 | unknown | unknown | 2026-05-20T18:26:09.821Z | arrays: entries |
| data/blog-manifest/korea-nursing-200.manifest.json | 200 | status:planned:200 | unknown | unknown | 2026-05-20T18:26:09.821Z | arrays: entries |
| data/blog-manifest/mexico-nursing-200.manifest.json | 200 | status:planned:200 | unknown | unknown | 2026-05-20T18:26:09.822Z | arrays: entries |
| data/blog-manifest/middle-east-nursing-200.manifest.json | 200 | status:planned:200 | unknown | unknown | 2026-05-20T18:26:09.822Z | arrays: entries |
| data/blog-manifest/portugal-nursing-200.manifest.json | 200 | status:planned:200 | unknown | unknown | 2026-05-20T18:26:09.823Z | arrays: entries |
| output/pn-content-batch.json | 190 | (record):190 | unknown | unknown | 2026-05-20T18:26:12.002Z | arrays: lessons, questions |
| output/new-grad-content-batch.json | 160 | (record):160 | unknown | unknown | 2026-05-20T18:26:11.977Z | arrays: lessons, questions |
| output/np-content-batch.json | 150 | (record):150 | unknown | unknown | 2026-05-20T18:26:12.001Z | arrays: lessons, questions |
| output/new-grad-transition-prisma-import.json | 146 | (record):146 | unknown | unknown | 2026-05-20T18:26:11.996Z | arrays: pathwayLessons, examQuestions |
| reports/international-licensing-longtail-batch-140.summary.json | 140 | status:written:140 | unknown | unknown | 2026-05-20T18:26:14.443Z | arrays: posts |
| src/lib/seo/blog-topic-clusters.ts | 117 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:17.047Z | source scan: slug keys=117, record hints=248 |
| src/lib/seo/global-expansion-seo-asia-en-topics.ts | 101 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.051Z | source scan: slug keys=101, record hints=303 |
| src/lib/seo/global-ultra-longtail-topics-100.ts | 101 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.052Z | source scan: slug keys=101, record hints=303 |
| src/lib/seo/nursing-glossary-competency-generated.ts | 89 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.060Z | source scan: slug keys=89, record hints=89 |
| src/lib/seo/long-form-seo-blog-posts.ts | 75 | source_records:1 | hidden/internal | unknown | 2026-05-27T20:50:14.304Z | source scan: slug keys=53, record hints=227 |
| scripts/blog/generate-ot-longtail-batch-50.mts | 70 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.290Z | source scan: slug keys=52, record hints=210 |
| scripts/blog/generate-us-np-cert-longtail-batch-50.mts | 70 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.293Z | source scan: slug keys=52, record hints=210 |
| src/lib/seo/long-tail-niche-blog-posts.ts | 62 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.057Z | source scan: slug keys=52, record hints=187 |
| src/lib/seo/long-form-seo-blog-posts-chunk3.ts | 61 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.056Z | source scan: slug keys=53, record hints=185 |
| reports/localized-seo-audit.json | 60 | (record):60 | unknown | indexable/public-surface | 2026-05-20T18:26:14.986Z | arrays: items |
| src/lib/seo/np-advanced-seo-topics.ts | 60 | source_records:1 | unknown | indexable/public-surface | 2026-05-20T18:26:17.060Z | source scan: slug keys=60, record hints=180 |
| src/lib/seo/long-form-seo-blog-posts-chunk2.ts | 59 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:17.055Z | source scan: slug keys=52, record hints=177 |
| src/lib/seo/tagalog-blog-posts-chunk2.ts | 59 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.070Z | source scan: slug keys=52, record hints=177 |
| src/lib/seo/hindi-blog-posts-chunk2.ts | 57 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.053Z | source scan: slug keys=52, record hints=171 |
| src/lib/seo/french-blog-posts-chunk2.ts | 56 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.049Z | source scan: slug keys=52, record hints=170 |
| scripts/blog/ecg-phase1-topics.ts | 54 | source_records:1 | unknown | indexable/public-surface | 2026-05-20T18:26:15.282Z | source scan: slug keys=41, record hints=164 |
| scripts/blog/uk-licensure-blog-seed-catalog.ts | 51 | source_records:1 | unknown | unknown | 2026-05-20T18:26:15.307Z | source scan: slug keys=51, record hints=103 |
| output/rn-topic-manifest.json | 50 | (record):50 | unknown | unknown | 2026-05-20T18:26:12.008Z | arrays: topics |
| scripts/blog/ems-longtail-topics.json | 50 | (record):50 | unknown | unknown | 2026-05-20T18:26:15.283Z | top-level array |
| src/lib/blog/safe-blog-queries.ts | 46 | blog_index_empty_after_expand_timeout_retry:1, blog_index_return_static_build_phase:1, blog_index_return_static_no_database_url:1, blog_index_return_degraded_static_on_db_error:1, blog_index_return_db_error:1, blog_index_locale_fallback_db_error:1, blog_index_return_live_db_locale_fallback:1, blog_index_return_merged_cms_static:1, blog_index_return_live_db_merge_fetch_failed:1, blog_index_return_live_db_over_merge_cap:1, blog_index_return_live_db_scoped:1, blog_index_return_true_empty:1 | mixed | indexable/public-surface | 2026-05-31T18:08:24.507Z | source scan: slug keys=46, record hints=78 |
| src/lib/seo/french-blog-posts.ts | 44 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.050Z | source scan: slug keys=33, record hints=132 |
| src/lib/seo/hindi-blog-posts.ts | 44 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.054Z | source scan: slug keys=33, record hints=132 |
| src/lib/seo/tagalog-blog-posts.ts | 44 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.071Z | source scan: slug keys=33, record hints=132 |
| src/lib/seo/hindi-blog-posts-chunk3.ts | 43 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:17.054Z | source scan: slug keys=32, record hints=130 |
| src/lib/seo/np-advanced-seo-posts.ts | 43 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:17.060Z | source scan: slug keys=16, record hints=129 |
| src/lib/seo/spanish-blog-posts.ts | 43 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.070Z | source scan: slug keys=32, record hints=129 |
| src/lib/seo/french-blog-posts-chunk3.ts | 42 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.050Z | source scan: slug keys=32, record hints=128 |
| scripts/blog/long-tail-seo-trio-topic-plan.ts | 41 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.301Z | source scan: slug keys=31, record hints=124 |
| src/lib/seo/global-expansion-seo-gcc-en-topics.ts | 41 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.052Z | source scan: slug keys=41, record hints=123 |
| scripts/blog/generate-nclex-rn-us-longtail-batch-40-data.mts | 38 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.289Z | source scan: slug keys=38, record hints=116 |
| src/lib/seo/nursing-glossary-registry.ts | 38 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:17.061Z | source scan: slug keys=38, record hints=38 |
| scripts/blog/generate-pharmacy-longtail-batch.mts | 37 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.291Z | source scan: slug keys=27, record hints=111 |
| src/lib/seo/nclex-commercial-landing-pages.ts | 36 | source_records:1 | mixed | indexable/public-surface | 2026-05-21T23:57:23.552Z | source scan: slug keys=15, record hints=110 |
| scripts/blog/generate-clinical-nursing-longtail-batch.mts | 34 | source_records:1 | mixed | unknown | 2026-05-20T18:26:15.286Z | source scan: slug keys=26, record hints=102 |
| src/lib/seo/market-blog-posts.ts | 31 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.058Z | source scan: slug keys=15, record hints=93 |
| src/lib/seo/market-landing-pages.ts | 31 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:17.058Z | source scan: slug keys=15, record hints=95 |
| src/lib/seo/nursing-glossary-expansion.ts | 31 | source_records:1 | public | unknown | 2026-05-20T18:26:17.060Z | source scan: slug keys=31, record hints=31 |
| scripts/blog/build-clinical-longtail-batch.mts | 30 | source_records:1 | mixed | unknown | 2026-05-20T18:26:15.281Z | source scan: slug keys=22, record hints=92 |
| src/lib/seo/conversion-blog-posts.ts | 28 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:17.049Z | source scan: slug keys=27, record hints=84 |
| scripts/blog/lib/new-grad-longtail-generate-core.ts | 27 | source_records:1 | unknown | unknown | 2026-05-20T18:26:15.298Z | source scan: slug keys=27, record hints=59 |
| scripts/blog/report-hidden-content-audit.mts | 27 | hidden:7, pending:3, orphaned:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.304Z | source scan: slug keys=20, record hints=83 |
| scripts/blog/generate-social-work-longtail-batch-100.mts | 24 | source_records:1 | public | unknown | 2026-05-20T18:26:15.292Z | source scan: slug keys=24, record hints=71 |
| src/lib/seo/blog-content-examples.ts | 23 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:17.047Z | source scan: slug keys=11, record hints=71 |
| src/lib/seo/nursing-mechanism-clusters.ts | 22 | published:6, draft:4, planned:10 | mixed | indexable/public-surface | 2026-05-20T18:26:17.061Z | source scan: slug keys=22, record hints=24 |
| src/lib/seo/programmatic-registry-pages-part-2.ts | 21 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.064Z | source scan: slug keys=19, record hints=64 |
| docs/reports/clinical-nursing-longtail-batch-2026-05-10.json | 20 | status:published_static_longtail:20 | public | indexable/public-surface | 2026-05-20T18:26:09.861Z | arrays: posts |
| docs/reports/clinical-nursing-longtail-batch-2026-05-10.posts.json | 20 | (record):20 | public | unknown | 2026-05-20T18:26:09.863Z | arrays: posts |
| docs/reports/clinical-nursing-longtail-public-verification-2026-05-10.json | 20 | status:PUBLISHED:20 | mixed | indexable/public-surface | 2026-05-20T18:26:09.863Z | arrays: posts |
| scripts/blog/lib/uk-acp-longtail-anchors.mts | 20 | source_records:1 | mixed | unknown | 2026-05-20T18:26:15.300Z | source scan: slug keys=20, record hints=60 |
| scripts/blog/rt-longtail/manifest.ts | 20 | source_records:1 | unknown | unknown | 2026-05-20T18:26:15.306Z | source scan: slug keys=20, record hints=60 |
| scripts/blog/seed-long-tail-seo-trio-blog-posts.mts | 19 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.306Z | source scan: slug keys=19, record hints=42 |
| src/lib/seo/authority-cluster-pages.ts | 19 | source_records:1 | public | indexable/public-surface | 2026-05-31T08:50:48.652Z | source scan: slug keys=19, record hints=45 |
| src/lib/seo/global-expansion-seo-asia-en-posts.ts | 19 | source_records:1 | public | unknown | 2026-05-20T18:26:17.051Z | source scan: slug keys=7, record hints=58 |
| src/lib/seo/global-expansion-seo-gcc-en-posts.ts | 19 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.051Z | source scan: slug keys=7, record hints=58 |
| src/lib/seo/public-flashcard-landing.ts | 19 | public_flashcard_hub_payload:1 | public | unknown | 2026-05-20T18:26:17.066Z | source scan: slug keys=19, record hints=35 |
| scripts/blog/verify-generated-blog-publication.mts | 18 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.308Z | source scan: slug keys=18, record hints=25 |
| scripts/blog/seed-long-tail-patho-blog-posts.mts | 17 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.306Z | source scan: slug keys=17, record hints=39 |
| scripts/blog/import-legacy-manifest.ts | 16 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:15.294Z | source scan: slug keys=16, record hints=33 |
| scripts/blog/generate-patho-pharm-longtail-posts.mts | 15 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.290Z | source scan: slug keys=15, record hints=33 |
| src/lib/seo/programmatic-registry-pages-part-1.ts | 15 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.064Z | source scan: slug keys=12, record hints=46 |
| scripts/audit/run-blog-corpus-audit.mts | 14 | PUBLISHED:1 | public | indexable/public-surface | 2026-05-20T18:26:15.274Z | source scan: slug keys=14, record hints=30 |
| src/lib/seo/allied-health-authority-program.ts | 14 | source_records:1 | hidden/internal | unknown | 2026-05-31T02:45:47.353Z | source scan: slug keys=6, record hints=43 |
| src/lib/seo/clinical-placement-survival-center.ts | 14 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-31T06:33:56.285Z | source scan: slug keys=14, record hints=28 |
| scripts/blog/pathophys-pharm-seo-batch.example.json | 13 | (record):13 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:15.302Z | arrays: items |
| scripts/blog/regenerate-poor-blog-posts.mts | 13 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.303Z | source scan: slug keys=13, record hints=36 |
| src/app/api/admin/blog/[id]/route.ts | 13 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.456Z | source scan: slug keys=13, record hints=34 |
| src/lib/blog/blog-control-panel-generation.ts | 13 | source_records:1 | mixed | indexable/public-surface | 2026-05-31T18:08:24.594Z | source scan: slug keys=7, record hints=40 |
| src/lib/seo/programmatic-seo-authority-batch.ts | 13 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.065Z | source scan: slug keys=8, record hints=40 |
| scripts/blog/international-licensing-longtail/spec-builders.ts | 12 | source_records:1 | public | unknown | 2026-05-20T18:26:15.295Z | source scan: slug keys=9, record hints=36 |
| src/lib/blog/blog-patho-pharm-generated-visibility.contract.test.ts | 12 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:16.767Z | source scan: slug keys=12, record hints=16 |
| src/lib/seo/authority-comparison-pages.ts | 12 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:17.046Z | source scan: slug keys=11, record hints=37 |
| src/lib/seo/healthcare-employer-workplace-intelligence.ts | 12 | source_records:1 | mixed | unknown | 2026-05-31T06:37:18.990Z | source scan: slug keys=12, record hints=22 |
| reports/content-source-of-truth-audit.json | 11 | (record):11 | mixed | indexable/public-surface | 2026-05-20T18:26:14.224Z | arrays: contentTypes |
| scripts/audit/reconcile-blog-live-corpus.mts | 11 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.273Z | source scan: slug keys=11, record hints=22 |
| scripts/blog/generate-au-np-acp-longtail-batch.mts | 11 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.284Z | source scan: slug keys=1, record hints=34 |
| src/app/api/admin/blog/generate-ai/route.ts | 11 | source_records:1 | mixed | unknown | 2026-05-31T18:08:24.573Z | source scan: slug keys=11, record hints=23 |
| data/blog-content/australia-nursing/sample-posts.json | 10 | status:sample:10 | mixed | indexable/public-surface | 2026-05-20T18:26:09.816Z | arrays: entries |
| data/blog-content/india-nursing/sample-posts.json | 10 | status:sample:10 | mixed | indexable/public-surface | 2026-05-20T18:26:09.817Z | arrays: entries |
| data/blog-content/middle-east-nursing/sample-posts.json | 10 | status:sample:10 | mixed | indexable/public-surface | 2026-05-20T18:26:09.818Z | arrays: entries |
| src/lib/blog/blog-automation-engine.ts | 10 | PUBLISHED:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.758Z | source scan: slug keys=8, record hints=32 |
| src/lib/blog/blog-seo-localized.ts | 10 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:16.772Z | source scan: slug keys=10, record hints=17 |
| scripts/blog/generate-nclex-rn-us-longtail-batch-40.mts | 9 | source_records:1 | mixed | unknown | 2026-05-20T18:26:15.289Z | source scan: slug keys=7, record hints=28 |
| scripts/blog/international-licensing-longtail/specs.ts | 9 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.295Z | source scan: slug keys=8, record hints=29 |
| src/app/api/admin/blog/upgrade-weak/route.ts | 9 | SKIPPED:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.460Z | source scan: slug keys=9, record hints=22 |
| src/lib/blog/blog-pre-publish-validation.ts | 9 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.768Z | source scan: slug keys=5, record hints=29 |
| src/lib/blog/publish-blog-post-canonical.ts | 9 | (missing):1, admin_blog_publish_visibility_failed:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.779Z | source scan: slug keys=9, record hints=22 |
| src/lib/seo/authority-resource-pages.ts | 9 | source_records:1 | mixed | unknown | 2026-05-20T18:26:17.046Z | source scan: slug keys=9, record hints=16 |
| src/lib/seo/healthcare-salary-workforce-authority-engine.ts | 9 | source_records:1 | hidden/internal | unknown | 2026-05-31T06:23:52.845Z | source scan: slug keys=9, record hints=18 |
| scripts/audit/run-blog-seo-readonly-audit.mts | 8 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.274Z | source scan: slug keys=7, record hints=25 |
| scripts/blog/blog-promote-control-panel-drafts.mts | 8 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.280Z | source scan: slug keys=8, record hints=10 |
| scripts/blog/verify-blog-publication-readiness.mts | 8 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.308Z | source scan: slug keys=8, record hints=10 |
| src/app/api/admin/blog/route.ts | 8 | source_records:1 | public | indexable/public-surface | 2026-05-28T02:28:59.290Z | source scan: slug keys=7, record hints=25 |
| src/lib/blog/blog-seo-automation.ts | 8 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:16.772Z | source scan: slug keys=8, record hints=12 |
| src/lib/seo/content-backed-study-resource-hub.ts | 8 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:17.049Z | source scan: slug keys=8, record hints=16 |
| src/lib/seo/pathway-topic-programmatic-registry.ts | 8 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:17.062Z | source scan: slug keys=5, record hints=24 |
| scripts/blog/generate-nclex-ngn-rn-pn-longtail-200.mts | 7 | source_records:1 | public | indexable/public-surface | 2026-05-27T17:22:51.152Z | source scan: slug keys=7, record hints=23 |
| scripts/blog/generate-rex-pn-canadian-pn-longtail-200.mts | 7 | source_records:1 | public | indexable/public-surface | 2026-05-27T17:11:22.104Z | source scan: slug keys=7, record hints=23 |
| scripts/blog/generate-rn-lesson-seo-blog-posts.mts | 7 | skipped_duplicate:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.291Z | source scan: slug keys=7, record hints=16 |
| scripts/blog/publish-generated-blog-post.mts | 7 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.303Z | source scan: slug keys=7, record hints=18 |
| src/app/(marketing)/(default)/blog/rn/[slug]/page.tsx | 7 | source_records:1 | mixed | mixed | 2026-05-20T18:26:15.400Z | source scan: slug keys=7, record hints=16 |
| src/lib/blog/blog-persistence-integrity.ts | 7 | published:3, failed:1 | mixed | unknown | 2026-05-28T02:28:41.174Z | source scan: slug keys=7, record hints=11 |
| src/lib/blog/generate-gemini-blog-draft.ts | 7 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:16.775Z | source scan: slug keys=7, record hints=14 |
| src/lib/blog/multilingual-blog-seo-registry.ts | 7 | draft:17, review:1, published:2 | mixed | indexable/public-surface | 2026-05-20T18:26:16.777Z | source scan: slug keys=0, record hints=21 |
| src/lib/blog/safe-localized-blog-queries.ts | 7 | PUBLISHED:1, SCHEDULED:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.781Z | source scan: slug keys=3, record hints=23 |
| src/lib/seo/healthcare-test-bank-pages.ts | 7 | source_records:1 | public | unknown | 2026-05-25T20:08:17.839Z | source scan: slug keys=0, record hints=22 |
| src/lib/seo/programmatic-practice-config.ts | 7 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.063Z | source scan: slug keys=2, record hints=22 |
| src/lib/seo/seo-duplicate-guard.ts | 7 | source_records:1 | unknown | indexable/public-surface | 2026-05-20T18:26:17.066Z | source scan: slug keys=7, record hints=11 |
| data/blog-content/china-nursing/sample-posts.json | 6 | status:sample:6 | mixed | unknown | 2026-05-20T18:26:09.817Z | arrays: entries |
| data/blog-content/france-nursing/sample-posts.json | 6 | status:sample:6 | mixed | unknown | 2026-05-20T18:26:09.817Z | arrays: entries |
| data/blog-content/germany-nursing/sample-posts.json | 6 | status:sample:6 | mixed | unknown | 2026-05-20T18:26:09.817Z | arrays: entries |
| data/blog-content/hungary-nursing/sample-posts.json | 6 | status:sample:6 | mixed | unknown | 2026-05-20T18:26:09.817Z | arrays: entries |
| data/blog-content/italy-nursing/sample-posts.json | 6 | status:sample:6 | mixed | unknown | 2026-05-20T18:26:09.817Z | arrays: entries |
| data/blog-content/japan-nursing/sample-posts.json | 6 | status:sample:6 | mixed | unknown | 2026-05-20T18:26:09.817Z | arrays: entries |
| data/blog-content/korea-nursing/sample-posts.json | 6 | status:sample:6 | mixed | unknown | 2026-05-20T18:26:09.817Z | arrays: entries |
| data/blog-content/mexico-nursing/sample-posts.json | 6 | status:sample:6 | mixed | unknown | 2026-05-20T18:26:09.817Z | arrays: entries |
| data/blog-content/philippines-nursing/sample-posts.json | 6 | status:sample:6 | mixed | unknown | 2026-05-20T18:26:09.818Z | arrays: entries |
| data/blog-content/portugal-nursing/sample-posts.json | 6 | status:sample:6 | mixed | unknown | 2026-05-20T18:26:09.818Z | arrays: entries |
| scripts/audit/run-blog-prisma-readonly-export.mts | 6 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.274Z | source scan: slug keys=5, record hints=18 |
| scripts/blog/generate-multilingual-ecg-phase1.mts | 6 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.288Z | source scan: slug keys=5, record hints=19 |
| scripts/blog/lib/long-tail-seo-trio-blog-post-builder.ts | 6 | source_records:1 | unknown | indexable/public-surface | 2026-05-20T18:26:15.298Z | source scan: slug keys=5, record hints=20 |
| scripts/blog/lib/pathophysiology-long-tail-blog-post-builder.ts | 6 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.300Z | source scan: slug keys=4, record hints=19 |
| src/app/(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/[postSlug]/page.tsx | 6 | source_records:1 | public | indexable/public-surface | 2026-05-25T14:46:14.684Z | source scan: slug keys=6, record hints=17 |
| src/app/api/blog/import/route.ts | 6 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.479Z | source scan: slug keys=6, record hints=14 |
| src/lib/blog/blog-publish-scheduler.ts | 6 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.769Z | source scan: slug keys=6, record hints=6 |
| src/lib/blog/blog-refresh-existing-posts.ts | 6 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.770Z | source scan: slug keys=5, record hints=20 |
| src/lib/blog/gsc-opportunity-upgrades-apply.test.ts | 6 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.776Z | source scan: slug keys=6, record hints=7 |
| src/lib/blog/gsc-opportunity-upgrades-apply.ts | 6 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.776Z | source scan: slug keys=6, record hints=18 |
| src/lib/blog/hybrid-blog-static-longtail.contract.test.ts | 6 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:16.776Z | source scan: slug keys=6, record hints=10 |
| src/lib/blog/recover-blog-visibility.test.ts | 6 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.780Z | source scan: slug keys=6, record hints=11 |
| scripts/blog/admin-control-panel-generator-harness.mts | 5 | source_records:1 | public | unknown | 2026-05-20T18:26:15.278Z | source scan: slug keys=5, record hints=7 |
| scripts/blog/generate-200-clinical-longtail.mts | 5 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.283Z | source scan: slug keys=5, record hints=5 |
| scripts/blog/generate-cpnre-cnple-longtail-200.mts | 5 | source_records:1 | public | indexable/public-surface | 2026-05-27T16:56:49.194Z | source scan: slug keys=5, record hints=8 |
| scripts/blog/import-hidden-blog-content.mts | 5 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.293Z | source scan: slug keys=1, record hints=16 |
| scripts/blog/lib/patho-pharm-longtail-post-builder.ts | 5 | source_records:1 | unknown | indexable/public-surface | 2026-05-20T18:26:15.299Z | source scan: slug keys=3, record hints=15 |
| scripts/blog/rex-pn-rpn-longtail/generate-batch.mts | 5 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.305Z | source scan: slug keys=5, record hints=15 |
| scripts/blog/seed-year-long-seo-blog-schedule-v2.mts | 5 | source_records:1 | unknown | unknown | 2026-05-20T18:26:15.307Z | source scan: slug keys=5, record hints=10 |
| src/app/(marketing)/(default)/allied-health/[slug]/blog/[postSlug]/page.tsx | 5 | source_records:1 | mixed | mixed | 2026-05-20T18:26:15.395Z | source scan: slug keys=5, record hints=14 |
| src/app/api/admin/blog/control-panel/persist-draft/route.ts | 5 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.458Z | source scan: slug keys=5, record hints=11 |
| src/lib/blog/blog-generation-jobs.ts | 5 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-31T18:08:24.652Z | source scan: slug keys=5, record hints=10 |
| src/lib/blog/blog-post-seo-regenerate-by-id.ts | 5 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.767Z | source scan: slug keys=5, record hints=12 |
| src/lib/blog/blog-public-merge.test.ts | 5 | source_records:1 | public | indexable/public-surface | 2026-05-21T20:54:25.489Z | source scan: slug keys=5, record hints=16 |
| src/lib/blog/blog-public-seo-helpers.ts | 5 | source_records:1 | public | unknown | 2026-05-20T18:26:16.769Z | source scan: slug keys=2, record hints=15 |
| src/lib/blog/blog-related-published-posts.ts | 5 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:16.771Z | source scan: slug keys=5, record hints=15 |
| src/lib/blog/blog-scoped-career-hubs.test.ts | 5 | source_records:1 | public | unknown | 2026-05-20T18:26:16.771Z | source scan: slug keys=5, record hints=5 |
| src/lib/blog/generate-localized-blog.ts | 5 | complete:2, validation:1 | unknown | indexable/public-surface | 2026-05-20T18:26:16.775Z | source scan: slug keys=2, record hints=16 |
| src/lib/blog/generated-blog-post-publish.test.ts | 5 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.776Z | source scan: slug keys=4, record hints=17 |
| src/lib/blog/hidden-blog-content-import-plan.test.ts | 5 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.776Z | source scan: slug keys=4, record hints=17 |
| src/lib/blog/patho-pharm-longtail-topic-registry.ts | 5 | source_records:1 | mixed | unknown | 2026-05-20T18:26:16.779Z | source scan: slug keys=2, record hints=17 |
| src/lib/blog/regional-blog-cluster-page.tsx | 5 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.780Z | source scan: slug keys=4, record hints=15 |
| src/lib/blog/rn-lesson-seo-blog-generator.ts | 5 | source_records:1 | public | unknown | 2026-05-20T18:26:16.780Z | source scan: slug keys=3, record hints=16 |
| src/lib/seo/healthcare-exam-authority-architecture.ts | 5 | live:9, planned:8 | mixed | indexable/public-surface | 2026-05-25T20:20:38.261Z | source scan: slug keys=0, record hints=16 |
| src/lib/seo/load-programmatic-question-topic-page.ts | 5 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:17.055Z | source scan: slug keys=5, record hints=8 |
| src/lib/seo/resolve-programmatic-seo.ts | 5 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.066Z | source scan: slug keys=5, record hints=7 |
| src/lib/seo/visitor-growth-acquisition-engine.ts | 5 | source_records:1 | public | unknown | 2026-05-31T06:03:16.281Z | source scan: slug keys=0, record hints=16 |
| scripts/audit/emit-recovery-import-reports.mts | 4 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.271Z | source scan: slug keys=4, record hints=9 |
| scripts/blog/audit-blog-quality.mts | 4 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.279Z | source scan: slug keys=4, record hints=11 |
| scripts/blog/audit-published-blog-quality.mts | 4 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.279Z | source scan: slug keys=4, record hints=11 |
| scripts/blog/generate-ems-longtail-batch.mts | 4 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.287Z | source scan: slug keys=3, record hints=13 |
| scripts/blog/generate-mlt-static-longtail-batch.mts | 4 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.288Z | source scan: slug keys=3, record hints=12 |
| scripts/blog/lib/china-korea-content-validate.ts | 4 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.296Z | source scan: slug keys=4, record hints=7 |
| scripts/blog/lib/regional-manifest-integrity.ts | 4 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.300Z | source scan: slug keys=4, record hints=5 |
| scripts/blog/verify-clinical-nursing-longtail-batch.mts | 4 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.308Z | source scan: slug keys=4, record hints=6 |
| src/app/(marketing)/(default)/nursing/[careerSlug]/blog/[postSlug]/page.tsx | 4 | source_records:1 | mixed | mixed | 2026-05-20T18:26:15.422Z | source scan: slug keys=4, record hints=13 |
| src/app/api/admin/blog/localized/generate/route.ts | 4 | FAILED:5, SUCCEEDED:4, SKIPPED:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.460Z | source scan: slug keys=2, record hints=13 |
| src/lib/blog/blog-batch-localized-followup.ts | 4 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:16.759Z | source scan: slug keys=2, record hints=12 |
| src/lib/blog/blog-content-quality-gate.ts | 4 | source_records:1 | mixed | unknown | 2026-05-20T18:26:16.760Z | source scan: slug keys=0, record hints=14 |
| src/lib/blog/blog-draft-generation-batch.ts | 4 | thrown:1 | mixed | indexable/public-surface | 2026-05-31T18:08:24.652Z | source scan: slug keys=4, record hints=8 |
| src/lib/blog/blog-generation-output-gate.test.ts | 4 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.763Z | source scan: slug keys=4, record hints=12 |
| src/lib/blog/blog-public-merge.ts | 4 | source_records:1 | public | indexable/public-surface | 2026-05-21T20:53:58.346Z | source scan: slug keys=4, record hints=10 |
| src/lib/blog/blog-recover-missed-posts.ts | 4 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.770Z | source scan: slug keys=4, record hints=6 |
| src/lib/blog/blog-related-reading-public.test.ts | 4 | source_records:1 | public | unknown | 2026-05-20T18:26:16.771Z | source scan: slug keys=4, record hints=12 |
| src/lib/blog/blog-scoped-career-hubs.ts | 4 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:16.771Z | source scan: slug keys=4, record hints=4 |
| src/lib/blog/blog-seo-package.ts | 4 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:16.772Z | source scan: slug keys=4, record hints=13 |
| src/lib/blog/generate-blog-ai-draft.ts | 4 | plan:1, seo_title:2, body:3 | mixed | indexable/public-surface | 2026-05-20T18:26:16.774Z | source scan: slug keys=3, record hints=14 |
| src/lib/blog/generated-blog-post-publish.ts | 4 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.776Z | source scan: slug keys=2, record hints=12 |
| src/lib/blog/normalize-blog-generation-input.test.ts | 4 | source_records:1 | unknown | indexable/public-surface | 2026-05-20T18:26:16.778Z | source scan: slug keys=1, record hints=14 |
| src/lib/blog/pathophysiology-long-tail-blog-seed.contract.test.ts | 4 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.779Z | source scan: slug keys=3, record hints=12 |
| src/lib/blog/publish-generated-blog-article.test.ts | 4 | source_records:1 | mixed | unknown | 2026-05-20T18:26:16.780Z | source scan: slug keys=0, record hints=14 |
| src/lib/blog/static-blog-posts.ts | 4 | source_records:1 | mixed | indexable/public-surface | 2026-05-31T18:08:24.546Z | source scan: slug keys=3, record hints=14 |
| src/lib/blog/validate-localized-blog.ts | 4 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.782Z | source scan: slug keys=1, record hints=12 |
| src/lib/seo/healthcare-interview-authority-engine.ts | 4 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-31T06:31:26.455Z | source scan: slug keys=4, record hints=8 |
| src/lib/seo/programmatic-question-topic-registry-pages.ts | 4 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:17.063Z | source scan: slug keys=4, record hints=8 |
| src/lib/seo/topic-hub-educational-intros.ts | 4 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.071Z | source scan: slug keys=0, record hints=12 |
| scripts/audit/run-eeat-content-audit.mts | 3 | skipped:2, ok:1, error:1 | hidden/internal | unknown | 2026-05-20T18:26:15.274Z | source scan: slug keys=3, record hints=6 |
| scripts/blog/blog-public-patho-pharm-counts.mts | 3 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.280Z | source scan: slug keys=3, record hints=8 |
| scripts/blog/blog-quality-audit.mts | 3 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.280Z | source scan: slug keys=3, record hints=9 |
| scripts/blog/diagnose-blog-slug-collisions.mts | 3 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.282Z | source scan: slug keys=3, record hints=3 |
| scripts/blog/import-pathophysiology-nursing-blog-seeds.mts | 3 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.294Z | source scan: slug keys=3, record hints=6 |
| scripts/blog/lib/patho-pharm-longtail-content.ts | 3 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.299Z | source scan: slug keys=2, record hints=10 |
| scripts/blog/recover-all-publishable-blog-posts.mts | 3 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.303Z | source scan: slug keys=3, record hints=6 |
| scripts/blog/repair-patho-pharm-blog-classification.mts | 3 | source_records:1 | public | unknown | 2026-05-20T18:26:15.303Z | source scan: slug keys=2, record hints=11 |
| scripts/blog/rex-pn-rpn-longtail/body-build.ts | 3 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.305Z | source scan: slug keys=3, record hints=5 |
| scripts/blog/seed-year-long-seo-blog-schedule.mts | 3 | source_records:1 | public | unknown | 2026-05-20T18:26:15.307Z | source scan: slug keys=3, record hints=8 |
| scripts/seo/audit-clinical-serp-quality.mts | 3 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.358Z | source scan: slug keys=3, record hints=3 |
| scripts/seo/seo-recovery-phase3-content-quality.ts | 3 | source_records:1 | mixed | indexable/public-surface | 2026-05-30T18:51:03.660Z | source scan: slug keys=0, record hints=10 |
| src/app/(admin)/admin/blog/page.tsx | 3 | FAILED:1 | mixed | indexable/public-surface | 2026-05-24T12:38:27.887Z | source scan: slug keys=3, record hints=6 |
| src/app/(marketing)/(default)/blog/category/[category]/page.tsx | 3 | source_records:1 | public | mixed | 2026-05-20T18:26:15.400Z | source scan: slug keys=3, record hints=7 |
| src/app/(marketing)/(default)/blog/page.tsx | 3 | source_records:1 | mixed | indexable/public-surface | 2026-05-25T12:32:36.332Z | source scan: slug keys=3, record hints=11 |
| src/app/(marketing)/(default)/blog/tag/[tag]/page.tsx | 3 | source_records:1 | public | mixed | 2026-05-20T18:26:15.401Z | source scan: slug keys=3, record hints=7 |
| src/app/api/admin/blog/[id]/duplicate/route.ts | 3 | source_records:1 | hidden/internal | noindex/hidden | 2026-05-20T18:26:15.456Z | source scan: slug keys=3, record hints=5 |
| src/app/api/admin/blog/campaigns/[id]/run-chunk/route.ts | 3 | failed:3, ok:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.457Z | source scan: slug keys=3, record hints=8 |
| src/lib/blog/blog-generate-seo.ts | 3 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:16.762Z | source scan: slug keys=3, record hints=9 |
| src/lib/blog/blog-governance.test.ts | 3 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.764Z | source scan: slug keys=3, record hints=9 |
| src/lib/blog/blog-intent-dedupe.ts | 3 | source_records:1 | unknown | indexable/public-surface | 2026-05-20T18:26:16.764Z | source scan: slug keys=3, record hints=3 |
| src/lib/blog/blog-public-article-html.ts | 3 | source_records:1 | public | unknown | 2026-05-20T18:26:16.768Z | source scan: slug keys=0, record hints=10 |
| src/lib/blog/blog-publish-quality-validator.test.ts | 3 | source_records:1 | unknown | unknown | 2026-05-31T18:08:24.675Z | source scan: slug keys=0, record hints=9 |
| src/lib/blog/blog-quality-score.ts | 3 | source_records:1 | mixed | unknown | 2026-05-20T18:26:16.770Z | source scan: slug keys=3, record hints=9 |
| src/lib/blog/blog-visibility.ts | 3 | source_records:1 | mixed | indexable/public-surface | 2026-05-31T18:08:24.632Z | source scan: slug keys=3, record hints=7 |
| src/lib/blog/generate-blog-posts-pipeline.ts | 3 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.774Z | source scan: slug keys=3, record hints=8 |
| src/lib/blog/long-tail-seo-trio-blog-seed.contract.test.ts | 3 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.776Z | source scan: slug keys=2, record hints=9 |
| src/lib/blog/patho-pharm-longtail-topic-registry.test.ts | 3 | source_records:1 | public | unknown | 2026-05-20T18:26:16.779Z | source scan: slug keys=3, record hints=7 |
| src/lib/blog/rn-lesson-seo-blog-generator.test.ts | 3 | source_records:1 | mixed | unknown | 2026-05-20T18:26:16.780Z | source scan: slug keys=1, record hints=10 |
| src/lib/seo/healthcare-school-directory-authority-engine.ts | 3 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-31T06:20:30.941Z | source scan: slug keys=2, record hints=10 |
| src/lib/seo/internal-links.ts | 3 | source_records:1 | mixed | unknown | 2026-05-20T18:26:17.054Z | source scan: slug keys=3, record hints=8 |
| src/lib/seo/pathway-breadcrumbs.ts | 3 | source_records:1 | public | indexable/public-surface | 2026-05-26T15:03:01.779Z | source scan: slug keys=3, record hints=5 |
| src/lib/seo/programmatic-practice-hub.ts | 3 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.063Z | source scan: slug keys=3, record hints=3 |
| src/lib/seo/programmatic-registry.ts | 3 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:17.064Z | source scan: slug keys=3, record hints=3 |
| scripts/blog/blog-full-inventory-diagnostics.mts | 2 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.279Z | source scan: slug keys=2, record hints=4 |
| scripts/blog/blog-visibility-diagnostics.mts | 2 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.280Z | source scan: slug keys=2, record hints=4 |
| scripts/blog/ecg-phase1-i18n-meta.ts | 2 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.282Z | source scan: slug keys=0, record hints=6 |
| scripts/blog/generate-australia-nursing-manifest.mts | 2 | planned:2 | unknown | unknown | 2026-05-20T18:26:15.285Z | source scan: slug keys=2, record hints=4 |
| scripts/blog/generate-blogs-reliable.mts | 2 | source_records:1 | mixed | unknown | 2026-05-20T18:26:15.285Z | source scan: slug keys=2, record hints=2 |
| scripts/blog/generate-india-nursing-manifest.mts | 2 | planned:2 | unknown | unknown | 2026-05-20T18:26:15.287Z | source scan: slug keys=2, record hints=4 |
| scripts/blog/generate-international-licensing-longtail-140.mts | 2 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.287Z | source scan: slug keys=2, record hints=6 |
| scripts/blog/generate-middle-east-nursing-manifest.mts | 2 | planned:2 | unknown | unknown | 2026-05-20T18:26:15.287Z | source scan: slug keys=2, record hints=4 |
| scripts/blog/generate-uk-acp-longtail-batch-145.mts | 2 | source_records:1 | mixed | unknown | 2026-05-20T18:26:15.292Z | source scan: slug keys=1, record hints=7 |
| scripts/blog/import-philippines-nle-blog-seeds.mts | 2 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.294Z | source scan: slug keys=2, record hints=4 |
| scripts/blog/import-uk-licensure-blog-seeds.mts | 2 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.294Z | source scan: slug keys=2, record hints=4 |
| scripts/blog/longtail-inventory-render-md.mts | 2 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:15.301Z | source scan: slug keys=2, record hints=3 |
| scripts/blog/longtail-inventory-slugs-db-check.mts | 2 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.301Z | source scan: slug keys=2, record hints=2 |
| scripts/blog/materialize-regional-blog-batches.mts | 2 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.301Z | source scan: slug keys=2, record hints=3 |
| scripts/blog/pathophysiology-nursing-blog-seed-catalog.ts | 2 | source_records:1 | public | unknown | 2026-05-20T18:26:15.302Z | source scan: slug keys=2, record hints=5 |
| scripts/blog/regional-manifest-blog-body.ts | 2 | planned:1 | mixed | unknown | 2026-05-20T18:26:15.303Z | source scan: slug keys=2, record hints=4 |
| scripts/blog/verify-year-long-seo-blog-schedule.mts | 2 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.308Z | source scan: slug keys=2, record hints=4 |
| src/app/(marketing)/(default)/seo/[slug]/page.tsx | 2 | source_records:1 | unknown | unknown | 2026-05-20T18:26:15.426Z | source scan: slug keys=2, record hints=2 |
| src/app/api/admin/blog/[id]/auto-related/route.ts | 2 | source_records:1 | mixed | unknown | 2026-05-20T18:26:15.456Z | source scan: slug keys=2, record hints=3 |
| src/app/api/admin/blog/[id]/body/regenerate/route.ts | 2 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.456Z | source scan: slug keys=2, record hints=8 |
| src/app/api/admin/blog/batch-chunk/route.ts | 2 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:15.456Z | source scan: slug keys=2, record hints=6 |
| src/app/api/admin/blog/localized/queue/route.ts | 2 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:15.460Z | source scan: slug keys=2, record hints=4 |
| src/lib/blog/blog-article-generation-job.ts | 2 | queued:5, generating_plan:1, failed:8, published:4, persist:1 | mixed | indexable/public-surface | 2026-05-28T02:16:20.042Z | source scan: slug keys=2, record hints=7 |
| src/lib/blog/blog-batch-schedule.ts | 2 | body:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:16.759Z | source scan: slug keys=2, record hints=2 |
| src/lib/blog/blog-citation-recency.test.ts | 2 | source_records:1 | public | unknown | 2026-05-20T18:26:16.759Z | source scan: slug keys=0, record hints=7 |
| src/lib/blog/blog-citation-safety.test.ts | 2 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.759Z | source scan: slug keys=0, record hints=6 |
| src/lib/blog/blog-content-quality-gate.test.ts | 2 | source_records:1 | public | unknown | 2026-05-20T18:26:16.760Z | source scan: slug keys=0, record hints=7 |
| src/lib/blog/blog-generation-log.ts | 2 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:16.763Z | source scan: slug keys=2, record hints=2 |
| src/lib/blog/blog-localized-analytics.ts | 2 | PUBLISHED:1 | public | indexable/public-surface | 2026-05-20T18:26:16.765Z | source scan: slug keys=2, record hints=3 |
| src/lib/blog/blog-pre-publish-validation.test.ts | 2 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:16.767Z | source scan: slug keys=1, record hints=8 |
| src/lib/blog/blog-reconstruct-plan-from-post.test.ts | 2 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.770Z | source scan: slug keys=2, record hints=8 |
| src/lib/blog/blog-recovery-audit.ts | 2 | source_records:1 | mixed | unknown | 2026-05-20T18:26:16.770Z | source scan: slug keys=2, record hints=7 |
| src/lib/blog/blog-seo-package.test.ts | 2 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:16.772Z | source scan: slug keys=2, record hints=8 |
| src/lib/blog/blog-slug-localized.ts | 2 | source_records:1 | unknown | indexable/public-surface | 2026-05-20T18:26:16.773Z | source scan: slug keys=2, record hints=3 |
| src/lib/blog/generate-blog-posts-pipeline.test.ts | 2 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.774Z | source scan: slug keys=2, record hints=8 |
| src/lib/blog/normalize-blog-generation-input.ts | 2 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:16.778Z | source scan: slug keys=1, record hints=7 |
| src/lib/blog/patho-pharm-longtail-topic-coherence.ts | 2 | source_records:1 | unknown | unknown | 2026-05-20T18:26:16.778Z | source scan: slug keys=1, record hints=6 |
| src/lib/blog/publish-blog-post-canonical.test.ts | 2 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.779Z | source scan: slug keys=0, record hints=6 |
| src/lib/blog/publish-generated-blog-article.ts | 2 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.780Z | source scan: slug keys=2, record hints=4 |
| src/lib/seo/breadcrumb-resolver.ts | 2 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:17.048Z | source scan: slug keys=2, record hints=2 |
| src/lib/seo/clinical-serp-patterns.contract.test.ts | 2 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.048Z | source scan: slug keys=2, record hints=5 |
| src/lib/seo/clinical-serp-quality-audit.ts | 2 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.048Z | source scan: slug keys=2, record hints=3 |
| src/lib/seo/eeat-entity-authority-architecture.ts | 2 | source_records:1 | mixed | indexable/public-surface | 2026-05-31T06:40:23.934Z | source scan: slug keys=2, record hints=2 |
| src/lib/seo/healthcare-glossary-authority-engine.ts | 2 | source_records:1 | mixed | indexable/public-surface | 2026-05-31T06:14:18.523Z | source scan: slug keys=2, record hints=4 |
| src/lib/seo/programmatic-seo-engine/server-blog-continuation.ts | 2 | source_records:1 | mixed | unknown | 2026-05-20T18:26:17.065Z | source scan: slug keys=2, record hints=2 |
| src/lib/seo/seo-generator.ts | 2 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.067Z | source scan: slug keys=2, record hints=7 |
| content/legal/acceptable-use-policy.md | 1 | file:1 | unknown | unknown | 2026-05-20T18:26:09.815Z | markdown/mdx file |
| content/legal/contact.md | 1 | file:1 | unknown | unknown | 2026-05-20T18:26:09.815Z | markdown/mdx file |
| content/legal/content-review-policy.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.815Z | markdown/mdx file |
| content/legal/editorial-policy.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-20T18:26:09.815Z | markdown/mdx file |
| content/legal/educational-disclaimer.md | 1 | file:1 | unknown | unknown | 2026-05-20T18:26:09.815Z | markdown/mdx file |
| content/legal/faq.md | 1 | file:1 | public | unknown | 2026-05-29T10:44:50.738Z | markdown/mdx file |
| content/legal/privacy-policy.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-20T18:26:09.815Z | markdown/mdx file |
| content/legal/subscription-refund-policy.md | 1 | file:1 | hidden/internal | unknown | 2026-05-20T18:26:09.816Z | markdown/mdx file |
| content/legal/terms-of-service-part2.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-20T18:26:09.816Z | markdown/mdx file |
| content/legal/terms-of-service.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-20T18:26:09.816Z | markdown/mdx file |
| data/blog-content/gsc-opportunity-upgrades.json | 1 | (record):1 | unknown | unknown | 2026-05-20T18:26:09.817Z | top-level object |
| data/seo/README.md | 1 | file:1 | unknown | unknown | 2026-05-20T18:26:09.823Z | markdown/mdx file |
| docs/advanced-pharmacology-academy-content-blueprint.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T01:45:56.120Z | markdown/mdx file |
| docs/allied-health-seo-authority-program.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T02:45:28.308Z | markdown/mdx file |
| docs/blog-content-overhaul-report-2026-05-07.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.826Z | markdown/mdx file |
| docs/blog-governance-system.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.826Z | markdown/mdx file |
| docs/blog-quality-thresholds.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.827Z | markdown/mdx file |
| docs/ccrn-content-blueprint.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T01:45:56.119Z | markdown/mdx file |
| docs/cen-content-blueprint.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T01:45:56.119Z | markdown/mdx file |
| docs/clinical-authority-content-standard.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-31T03:34:59.086Z | markdown/mdx file |
| docs/clinical-skills-academy-content-blueprint.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T01:45:56.120Z | markdown/mdx file |
| docs/CONTENT_IMPORT_PIPELINE.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.824Z | markdown/mdx file |
| docs/CONTENT_STORAGE_ARCHITECTURE.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.824Z | markdown/mdx file |
| docs/CONTENT_VERSIONING.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.824Z | markdown/mdx file |
| docs/CONTENT_WORKFLOWS.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.824Z | markdown/mdx file |
| docs/content-authority-dashboard.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T04:02:35.471Z | markdown/mdx file |
| docs/content-factory-dashboard.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-31T00:34:06.240Z | markdown/mdx file |
| docs/content-maturity-dashboard.md | 1 | file:1 | public | indexable/public-surface | 2026-05-31T01:50:53.485Z | markdown/mdx file |
| docs/content-parity-audit.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T01:50:53.481Z | markdown/mdx file |
| docs/content-quality/clinical-pearl-audit.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-31T04:53:42.101Z | markdown/mdx file |
| docs/content-quality/clinical-pearl-rewrite-queue.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-31T04:53:42.102Z | markdown/mdx file |
| docs/content-quality/clinical-pearl-rubric.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T04:50:11.457Z | markdown/mdx file |
| docs/content-quality/distractor-quality-audit.md | 1 | file:1 | hidden/internal | unknown | 2026-05-31T04:58:45.205Z | markdown/mdx file |
| docs/content-quality/distractor-taxonomy.md | 1 | file:1 | public | unknown | 2026-05-31T04:58:03.444Z | markdown/mdx file |
| docs/content-quality/question-realism-dashboard.md | 1 | file:1 | hidden/internal | unknown | 2026-05-31T04:58:45.207Z | markdown/mdx file |
| docs/content-quality/rationale-contract-v2.md | 1 | file:1 | mixed | indexable/public-surface | 2026-05-31T04:38:17.962Z | markdown/mdx file |
| docs/content-quality/rationale-quality-dashboard.md | 1 | file:1 | unknown | unknown | 2026-05-31T04:42:06.484Z | markdown/mdx file |
| docs/content-quality/rationale-repetition-audit.md | 1 | file:1 | unknown | unknown | 2026-05-31T04:42:06.489Z | markdown/mdx file |
| docs/content-source-of-truth-audit.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.827Z | markdown/mdx file |
| docs/content-source-of-truth-final.md | 1 | file:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.828Z | markdown/mdx file |
| docs/design-system/nursenest-blog-premium-figma-spec.md | 1 | file:1 | unknown | indexable/public-surface | 2026-05-20T18:26:09.829Z | markdown/mdx file |
| docs/duplicate-content-opportunity-report.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-31T00:20:34.016Z | markdown/mdx file |
| docs/ecg-certification-academy-content-blueprint.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T01:45:56.119Z | markdown/mdx file |
| docs/flashcard-platform-parity-audit.generated.md | 1 | file:1 | public | indexable/public-surface | 2026-05-31T10:06:20.182Z | markdown/mdx file |
| docs/future-content-roadmap.md | 1 | file:1 | public | indexable/public-surface | 2026-05-31T01:50:53.484Z | markdown/mdx file |
| docs/global-content-migration-engine.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-31T00:21:16.671Z | markdown/mdx file |
| docs/global-content-prioritization.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T01:45:56.120Z | markdown/mdx file |
| docs/global-content-quality-governance-system.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T18:52:05.691Z | markdown/mdx file |
| docs/global-content-reuse-map.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-31T00:20:34.016Z | markdown/mdx file |
| docs/governance/clinical-content-quality-governance.md | 1 | file:1 | public | indexable/public-surface | 2026-05-31T18:51:36.287Z | markdown/mdx file |
| docs/healthcare-authority-content-engine.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-31T03:41:30.321Z | markdown/mdx file |
| docs/hidden-international-content-library.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T00:21:16.672Z | markdown/mdx file |
| docs/high-priority-content-gaps.md | 1 | file:1 | mixed | indexable/public-surface | 2026-05-31T01:50:53.484Z | markdown/mdx file |
| docs/imports/nurse-nest-legacy-format.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-20T18:26:09.831Z | markdown/mdx file |
| docs/imports/nurse-nest-legacy-manifest.example.json | 1 | (record):1 | hidden/internal | unknown | 2026-05-20T18:26:09.831Z | top-level object |
| docs/international-content-gap-analysis.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-30T23:55:00.929Z | markdown/mdx file |
| docs/international-content-recovery-report.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-31T00:20:34.013Z | markdown/mdx file |
| docs/lab-interpretation-academy-content-blueprint.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T01:45:56.119Z | markdown/mdx file |
| docs/legacy-image-replacement-report.md | 1 | file:1 | mixed | indexable/public-surface | 2026-05-30T08:19:45.120Z | markdown/mdx file |
| docs/multi-country-content-audit.md | 1 | file:1 | unknown | unknown | 2026-05-30T22:49:39.571Z | markdown/mdx file |
| docs/nclex-rn-canada-longtail-batch-40.md | 1 | file:1 | unknown | unknown | 2026-05-20T18:26:09.853Z | markdown/mdx file |
| docs/new-grad-residency-content-roadmap.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T01:45:56.119Z | markdown/mdx file |
| docs/next-generation-global-content-prioritization.md | 1 | file:1 | public | indexable/public-surface | 2026-05-31T01:42:00.217Z | markdown/mdx file |
| docs/next-generation-product-content-development-program.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T01:45:56.119Z | markdown/mdx file |
| docs/next-generation-product-content-program.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T01:42:00.217Z | markdown/mdx file |
| docs/np-content-reuse-engine.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T00:25:21.235Z | markdown/mdx file |
| docs/nursing-leadership-management-content-blueprint.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T01:45:56.120Z | markdown/mdx file |
| docs/physiology-monitor-import-trace.md | 1 | file:1 | public | unknown | 2026-05-30T03:54:16.242Z | markdown/mdx file |
| docs/post-audit-execution-roadmap.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-31T01:11:32.470Z | markdown/mdx file |
| docs/preceptor-clinical-educator-academy-content-blueprint.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T01:45:56.120Z | markdown/mdx file |
| docs/programmatic-content-production-pipeline.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T03:49:28.799Z | markdown/mdx file |
| docs/reports/blog-batch1-import-publish.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.858Z | markdown/mdx file |
| docs/reports/blog-indexing-final-cleanup.md | 1 | file:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.858Z | markdown/mdx file |
| docs/reports/blog-indexing-forensic-audit.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-20T18:26:09.859Z | markdown/mdx file |
| docs/reports/blog-indexing-live-production-verification.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.859Z | markdown/mdx file |
| docs/reports/breadcrumb-and-internal-link-seo-audit.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.860Z | markdown/mdx file |
| docs/reports/clinical-content-quality/content-quality-dashboard.md | 1 | file:1 | public | unknown | 2026-05-30T20:00:12.290Z | markdown/mdx file |
| docs/reports/clinical-interpretation-seo-ecosystem.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-20T18:26:09.861Z | markdown/mdx file |
| docs/reports/clinical-longtail-batch-validation.md | 1 | file:1 | public | indexable/public-surface | 2026-05-20T18:26:09.861Z | markdown/mdx file |
| docs/reports/clinical-longtail-surface-verification.md | 1 | file:1 | unknown | indexable/public-surface | 2026-05-20T18:26:09.861Z | markdown/mdx file |
| docs/reports/cnple-content-wiring-p0-fix.md | 1 | file:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.863Z | markdown/mdx file |
| docs/reports/duplicate-content-audit.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-30T17:07:39.847Z | markdown/mdx file |
| docs/reports/ecg-phase3/marketing-screenshot-manifest.json | 1 | (record):1 | public | unknown | 2026-05-30T19:16:24.490Z | top-level object |
| docs/reports/french-nursing-seo-expansion.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-20T18:26:09.866Z | markdown/mdx file |
| docs/reports/global-content-quality/blueprint-coverage-report.md | 1 | file:1 | public | unknown | 2026-05-31T18:53:48.179Z | markdown/mdx file |
| docs/reports/global-content-quality/duplicate-content-report.md | 1 | file:hidden_or_internal:1 | hidden/internal | noindex/hidden | 2026-05-31T18:53:47.952Z | markdown/mdx file |
| docs/reports/global-content-quality/monetization-readiness-report.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-31T18:53:48.666Z | markdown/mdx file |
| docs/reports/global-content-quality/publication-readiness-report.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T18:53:48.423Z | markdown/mdx file |
| docs/reports/global-content-quality/quality-audit-scorecards.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-31T18:53:47.349Z | markdown/mdx file |
| docs/reports/global-content-quality/weak-content-report.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-31T18:53:47.631Z | markdown/mdx file |
| docs/reports/healthcare-content-freshness-evergreen-authority-engine.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-31T06:46:17.887Z | markdown/mdx file |
| docs/reports/hybrid-blog-merge-readiness.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-20T18:26:09.869Z | markdown/mdx file |
| docs/reports/hybrid-blog-static-db-implementation-report.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.869Z | markdown/mdx file |
| docs/reports/lighthouse-post-css-ownership-refactor.md | 1 | file:1 | public | unknown | 2026-05-20T18:26:09.878Z | markdown/mdx file |
| docs/reports/locale-seo-leakage-remediation.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-20T18:26:09.878Z | markdown/mdx file |
| docs/reports/long-tail-batch1-part1-import.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.879Z | markdown/mdx file |
| docs/reports/marketing-showcase-content-system.md | 1 | file:1 | unknown | unknown | 2026-05-31T05:19:28.952Z | markdown/mdx file |
| docs/reports/mlt-tier-readiness-counts.generated.md | 1 | file:1 | public | indexable/public-surface | 2026-05-20T18:26:09.879Z | markdown/mdx file |
| docs/reports/multilingual-blog-seo-implementation.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-20T18:26:09.880Z | markdown/mdx file |
| docs/reports/new-zealand-rn-longtail-batch-35.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.880Z | markdown/mdx file |
| docs/reports/nursing-mechanism-seo-expansion.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.881Z | markdown/mdx file |
| docs/reports/seo-5xx-audit.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-30T17:07:34.489Z | markdown/mdx file |
| docs/reports/seo-5xx-inventory.md | 1 | file:1 | public | indexable/public-surface | 2026-05-30T17:07:34.486Z | markdown/mdx file |
| docs/reports/seo-5xx-root-cause-analysis.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-30T17:07:34.488Z | markdown/mdx file |
| docs/reports/seo-authority-cluster-rollout.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.884Z | markdown/mdx file |
| docs/reports/seo-recovery-phase3/blog-quality-pass.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-30T18:51:30.824Z | markdown/mdx file |
| docs/reports/seo-recovery-phase3/content-quality-dashboard.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-30T18:51:30.891Z | markdown/mdx file |
| docs/reports/seo-recovery-phase3/eeat-improvements.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-30T18:51:30.847Z | markdown/mdx file |
| docs/reports/seo-recovery-phase3/indexation-quality-audit.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-30T18:51:30.813Z | markdown/mdx file |
| docs/reports/seo-recovery-phase3/internal-linking-expansion.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-30T18:51:30.826Z | markdown/mdx file |
| docs/reports/seo-recovery-phase3/lesson-quality-upgrade.md | 1 | file:1 | unknown | unknown | 2026-05-30T18:51:30.820Z | markdown/mdx file |
| docs/reports/seo-recovery-phase3/question-page-authority-pass.md | 1 | file:1 | unknown | unknown | 2026-05-30T18:51:30.821Z | markdown/mdx file |
| docs/reports/seo-recovery-phase3/reindex-priority-list.md | 1 | file:hidden_or_internal:1 | hidden/internal | indexable/public-surface | 2026-05-30T18:51:30.853Z | markdown/mdx file |
| docs/reports/seo-recovery-phase3/thin-content-report.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-30T18:51:30.817Z | markdown/mdx file |
| docs/reports/seo-recovery-phase3/topical-authority-map.md | 1 | file:1 | unknown | unknown | 2026-05-30T18:51:30.845Z | markdown/mdx file |
| docs/reports/seo-regression-guardrails.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.885Z | markdown/mdx file |
| docs/reports/seo-remediation-final.md | 1 | file:hidden_or_internal:1 | hidden/internal | mixed | 2026-05-20T18:26:09.885Z | markdown/mdx file |
| docs/reports/seo-traffic-acquisition-master-sprint.md | 1 | file:1 | unknown | unknown | 2026-05-31T06:04:43.278Z | markdown/mdx file |
| docs/reports/simulation-seo-ecosystem.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-20T18:26:09.885Z | markdown/mdx file |
| docs/reports/sitemap-segmentation-final-seo-evidence.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-20T18:26:09.885Z | markdown/mdx file |
| docs/reports/sitemap-seo-final-merge-readiness.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.886Z | markdown/mdx file |
| docs/reports/sitemap-seo-post-merge-production-verification.md | 1 | file:1 | public | indexable/public-surface | 2026-05-20T18:26:09.886Z | markdown/mdx file |
| docs/reports/sitemap-seo-release-checklist.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:09.886Z | markdown/mdx file |
| docs/reports/spanish-blog-seo-rollout.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-20T18:26:09.886Z | markdown/mdx file |
| docs/reports/thin-content-eradication-authority-expansion.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-31T05:53:30.575Z | markdown/mdx file |
| docs/seo-monetization-guardrails.md | 1 | file:1 | mixed | unknown | 2026-05-31T03:41:43.435Z | markdown/mdx file |
| docs/simulation-content-audit.md | 1 | file:1 | unknown | unknown | 2026-05-30T03:26:35.507Z | markdown/mdx file |
| docs/unified-blog-restoration-report-2026-04-13.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:11.950Z | markdown/mdx file |
| docs/us-rn-content-expansion-roadmap.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-31T00:13:59.104Z | markdown/mdx file |
| reports/2026-05-09-homepage-hydration-dynamic-import.md | 1 | file:1 | public | unknown | 2026-05-20T18:26:14.029Z | markdown/mdx file |
| reports/2026-blog-premium-figma-handoff.md | 1 | file:1 | public | unknown | 2026-05-20T18:26:14.029Z | markdown/mdx file |
| reports/academic-content-graph-migration-report.md | 1 | file:1 | unknown | indexable/public-surface | 2026-05-30T09:05:45.824Z | markdown/mdx file |
| reports/admin-blog-generator-publisher-fix-report.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:14.031Z | markdown/mdx file |
| reports/allied-hub-content-audit.md | 1 | file:1 | unknown | indexable/public-surface | 2026-05-20T18:26:14.031Z | markdown/mdx file |
| reports/allied-seo-differentiation.md | 1 | file:1 | public | unknown | 2026-05-20T18:26:14.033Z | markdown/mdx file |
| reports/australia-np-acp-longtail-batch-145.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:14.033Z | markdown/mdx file |
| reports/australia-rn-longtail-batch-40.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:14.033Z | markdown/mdx file |
| reports/blog-quality-thresholds.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-20T18:26:14.033Z | markdown/mdx file |
| reports/blog-source-of-truth-audit.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:14.033Z | markdown/mdx file |
| reports/canadian-np-longtail-batch-550-part-01.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-20T18:26:14.041Z | markdown/mdx file |
| reports/canadian-np-longtail-batch-550-README.md | 1 | file:1 | unknown | unknown | 2026-05-20T18:26:14.037Z | markdown/mdx file |
| reports/content-completeness-audit-2026-05-29.json | 1 | (record):1 | public | unknown | 2026-05-29T21:06:04.879Z | top-level object |
| reports/content-completeness-audit-2026-05-29.md | 1 | file:1 | unknown | unknown | 2026-05-29T21:06:04.881Z | markdown/mdx file |
| reports/content-migration-gap-report.md | 1 | file:1 | public | indexable/public-surface | 2026-05-20T18:26:14.224Z | markdown/mdx file |
| reports/content-orphan-audit.md | 1 | file:1 | unknown | unknown | 2026-05-20T18:26:14.224Z | markdown/mdx file |
| reports/content-source-of-truth-audit.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:14.224Z | markdown/mdx file |
| reports/duplicate-content-audit.md | 1 | file:hidden_or_internal:1 | hidden/internal | mixed | 2026-05-31T08:02:16.400Z | markdown/mdx file |
| reports/duplicate-content-opportunity-report.md | 1 | file:1 | unknown | unknown | 2026-05-30T21:51:58.638Z | markdown/mdx file |
| reports/ems-longtail-batch-125.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:14.226Z | markdown/mdx file |
| reports/ems-longtail-batch-50.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-20T18:26:14.226Z | markdown/mdx file |
| reports/global-content-reuse-map.md | 1 | file:1 | public | unknown | 2026-05-30T21:50:48.952Z | markdown/mdx file |
| reports/healthcare-exam-seo-authority-architecture.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:14.437Z | markdown/mdx file |
| reports/healthcare-exam-seo-authority-inventory.json | 1 | (record):1 | public | indexable/public-surface | 2026-05-20T18:26:14.438Z | top-level object |
| reports/healthcare-exam-seo-implementation-roadmap.json | 1 | (record):1 | mixed | indexable/public-surface | 2026-05-20T18:26:14.439Z | top-level object |
| reports/healthcare-exam-seo-implementation-roadmap.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-20T18:26:14.439Z | markdown/mdx file |
| reports/hidden-international-content-library.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-30T21:54:55.923Z | markdown/mdx file |
| reports/i18n-seo-verification.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-20T18:26:14.441Z | markdown/mdx file |
| reports/international-content-recovery-report.md | 1 | file:1 | public | indexable/public-surface | 2026-05-30T21:50:19.407Z | markdown/mdx file |
| reports/international-licensing-longtail-batch-140.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-20T18:26:14.442Z | markdown/mdx file |
| reports/legacy-compatibility-layer-map.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:14.624Z | markdown/mdx file |
| reports/localized-seo-audit.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-20T18:26:14.986Z | markdown/mdx file |
| reports/longtail-seo-blog-generation-plan.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:14.986Z | markdown/mdx file |
| reports/meaningful-clinical-content-audit.json | 1 | (record):1 | unknown | unknown | 2026-05-20T18:26:14.987Z | top-level object |
| reports/middle-east-licensing-longtail-batch-40.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:14.987Z | markdown/mdx file |
| reports/mlt-longtail-batch-50.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-20T18:26:14.987Z | markdown/mdx file |
| reports/multilingual-ecg-seo-phase1.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:14.989Z | markdown/mdx file |
| reports/multilingual-longtail-batch-part-01.md | 1 | file:1 | public | unknown | 2026-05-20T18:26:14.989Z | markdown/mdx file |
| reports/multilingual-longtail-batch-README.md | 1 | file:1 | unknown | unknown | 2026-05-20T18:26:14.989Z | markdown/mdx file |
| reports/nclex-rn-canada-longtail-batch-40.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.000Z | markdown/mdx file |
| reports/nclex-rn-us-longtail-batch-40.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-20T18:26:15.000Z | markdown/mdx file |
| reports/new-grad-nursing-longtail-batch-325.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.001Z | markdown/mdx file |
| reports/new-zealand-rn-longtail-batch-35.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.001Z | markdown/mdx file |
| reports/openrouter-blog-model-fix-2026-05-09.md | 1 | file:1 | unknown | unknown | 2026-05-20T18:26:15.002Z | markdown/mdx file |
| reports/ot-longtail-batch-50.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-20T18:26:15.002Z | markdown/mdx file |
| reports/pharmacy-longtail-batch-25.md | 1 | file:1 | public | indexable/public-surface | 2026-05-20T18:26:15.002Z | markdown/mdx file |
| reports/retry-failed-longtail-batches-2026-05-09.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-20T18:26:15.139Z | markdown/mdx file |
| reports/rex-pn-rpn-longtail-batch-330.md | 1 | file:1 | public | unknown | 2026-05-20T18:26:15.139Z | markdown/mdx file |
| reports/rt-longtail-batch-300-part-01.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-20T18:26:15.194Z | markdown/mdx file |
| reports/rt-longtail-batch-300-part-02.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-20T18:26:15.195Z | markdown/mdx file |
| reports/rt-longtail-batch-300-part-03.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-20T18:26:15.195Z | markdown/mdx file |
| reports/rt-longtail-batch-300-README.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-20T18:26:15.194Z | markdown/mdx file |
| reports/seo-execution-roadmap-ranked.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-31T08:32:40.399Z | markdown/mdx file |
| reports/seo-surface-validation-audit.md | 1 | file:hidden_or_internal:1 | mixed | mixed | 2026-05-20T18:26:15.195Z | markdown/mdx file |
| reports/social-work-longtail-batch-100.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-20T18:26:15.196Z | markdown/mdx file |
| reports/ui-redesign-preview/BLOG_REDESIGN_SUMMARY.md | 1 | file:hidden_or_internal:1 | mixed | unknown | 2026-05-20T18:26:15.239Z | markdown/mdx file |
| reports/ui-redesign-preview/BLOGS_TOOLS_PREMIUM_MODERNIZATION_REPORT.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-20T18:26:15.239Z | markdown/mdx file |
| reports/uk-acp-longtail-batch-145.md | 1 | file:hidden_or_internal:1 | hidden/internal | unknown | 2026-05-20T18:26:15.252Z | markdown/mdx file |
| reports/uk-nmc-longtail-batch-40.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.252Z | markdown/mdx file |
| reports/us-np-cert-longtail-batch-50.md | 1 | file:hidden_or_internal:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.252Z | markdown/mdx file |
| scripts/blog/export-admin-blog-queue-tsv.mts | 1 | asc:1 | mixed | unknown | 2026-05-20T18:26:15.283Z | source scan: slug keys=1, record hints=1 |
| scripts/blog/generate-blogs-legacy-compatible.mts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.285Z | source scan: slug keys=1, record hints=1 |
| scripts/blog/generate-china-nursing-manifest.mts | 1 | planned:2 | unknown | unknown | 2026-05-20T18:26:15.285Z | source scan: slug keys=1, record hints=3 |
| scripts/blog/generate-france-nursing-manifest.mts | 1 | planned:2 | unknown | unknown | 2026-05-20T18:26:15.287Z | source scan: slug keys=1, record hints=3 |
| scripts/blog/generate-germany-nursing-manifest.mts | 1 | planned:2 | unknown | unknown | 2026-05-20T18:26:15.287Z | source scan: slug keys=1, record hints=3 |
| scripts/blog/generate-hungary-nursing-manifest.mts | 1 | planned:2 | unknown | unknown | 2026-05-20T18:26:15.287Z | source scan: slug keys=1, record hints=3 |
| scripts/blog/generate-intl-nursing-longtail-batch.mts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:15.287Z | source scan: slug keys=1, record hints=4 |
| scripts/blog/generate-italy-nursing-manifest.mts | 1 | planned:2 | unknown | unknown | 2026-05-20T18:26:15.287Z | source scan: slug keys=1, record hints=3 |
| scripts/blog/generate-japan-nursing-manifest.mts | 1 | planned:2 | unknown | unknown | 2026-05-20T18:26:15.287Z | source scan: slug keys=1, record hints=3 |
| scripts/blog/generate-korea-nursing-manifest.mts | 1 | planned:2 | unknown | unknown | 2026-05-20T18:26:15.287Z | source scan: slug keys=1, record hints=3 |
| scripts/blog/generate-mexico-nursing-manifest.mts | 1 | planned:2 | unknown | unknown | 2026-05-20T18:26:15.287Z | source scan: slug keys=1, record hints=3 |
| scripts/blog/generate-portugal-nursing-manifest.mts | 1 | planned:2 | unknown | unknown | 2026-05-20T18:26:15.291Z | source scan: slug keys=1, record hints=3 |
| scripts/blog/generate-rt-longtail-files.mts | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.291Z | source scan: slug keys=1, record hints=4 |
| scripts/blog/import-recoverable-blog-manifests-runner.mts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.294Z | source scan: slug keys=1, record hints=1 |
| scripts/blog/international-licensing-longtail/render-article.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.294Z | source scan: slug keys=1, record hints=1 |
| scripts/blog/international-licensing-longtail/types.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:15.296Z | source scan: slug keys=1, record hints=4 |
| scripts/blog/lib/intl-nursing-longtail-body.mts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.297Z | source scan: slug keys=1, record hints=1 |
| scripts/blog/lib/patho-pharm-longtail-topic-catalog.ts | 1 | source_records:1 | public | unknown | 2026-05-20T18:26:15.299Z | source scan: slug keys=0, record hints=2 |
| scripts/blog/lib/uk-acp-longtail-types.mts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:15.300Z | source scan: slug keys=1, record hints=3 |
| scripts/blog/materialize-china-korea-blog-content.mts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:15.301Z | source scan: slug keys=1, record hints=2 |
| scripts/blog/pathophysiology-long-tail-200-topic-plan.ts | 1 | source_records:1 | public | unknown | 2026-05-20T18:26:15.302Z | source scan: slug keys=1, record hints=4 |
| scripts/blog/philippines-nle-blog-build-body.ts | 1 | source_records:1 | public | unknown | 2026-05-20T18:26:15.302Z | source scan: slug keys=1, record hints=3 |
| scripts/blog/philippines-nle-blog-seed-catalog.ts | 1 | source_records:1 | public | unknown | 2026-05-20T18:26:15.302Z | source scan: slug keys=1, record hints=2 |
| scripts/blog/philippines-nle-blog-seed-types.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:15.302Z | source scan: slug keys=1, record hints=2 |
| scripts/blog/rt-longtail/body-builder.ts | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.306Z | source scan: slug keys=1, record hints=3 |
| scripts/blog/rt-longtail/types.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:15.306Z | source scan: slug keys=1, record hints=3 |
| scripts/blog/validate-clinical-longtail-batch.mts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.307Z | source scan: slug keys=0, record hints=1 |
| scripts/blog/validate-philippines-nle-blog-seeds.mts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.308Z | source scan: slug keys=0, record hints=1 |
| scripts/blog/verify-admin-publish-path.mts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.308Z | source scan: slug keys=0, record hints=2 |
| scripts/seo/google-indexing-emergency-audit.ts | 1 | source_records:1 | mixed | mixed | 2026-05-30T17:06:22.564Z | source scan: slug keys=0, record hints=2 |
| scripts/seo/verify-public-marketing-links.ts | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.358Z | source scan: slug keys=0, record hints=1 |
| scripts/seo/verify-sitemap-urls.ts | 1 | source_records:1 | hidden/internal | mixed | 2026-05-20T18:26:15.359Z | source scan: slug keys=0, record hints=2 |
| src/app/(marketing)/(default)/allied-health/[slug]/blog/page.tsx | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.395Z | source scan: slug keys=1, record hints=3 |
| src/app/(marketing)/(default)/blog/[slug]/page.tsx | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.399Z | source scan: slug keys=1, record hints=4 |
| src/app/(marketing)/(default)/blog/canada-rn/[slug]/page.tsx | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:15.399Z | source scan: slug keys=1, record hints=1 |
| src/app/(marketing)/(default)/blog/nclex-pn/[slug]/page.tsx | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:15.400Z | source scan: slug keys=1, record hints=1 |
| src/app/(marketing)/(default)/blog/rex-pn/[slug]/page.tsx | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:15.400Z | source scan: slug keys=1, record hints=1 |
| src/app/(marketing)/(default)/blog/rn/page.tsx | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.400Z | source scan: slug keys=0, record hints=2 |
| src/app/(marketing)/(default)/blog/us-rn/[slug]/page.tsx | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:15.401Z | source scan: slug keys=1, record hints=1 |
| src/app/(marketing)/(default)/content-review-policy/page.tsx | 1 | source_records:1 | unknown | indexable/public-surface | 2026-05-25T11:35:45.489Z | source scan: slug keys=0, record hints=2 |
| src/app/(marketing)/(default)/nursing/[careerSlug]/blog/page.tsx | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.422Z | source scan: slug keys=0, record hints=2 |
| src/app/(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/page.tsx | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.428Z | source scan: slug keys=0, record hints=1 |
| src/app/(marketing)/[locale]/blog/[slug]/page.tsx | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:15.429Z | source scan: slug keys=1, record hints=4 |
| src/app/(marketing)/[locale]/content-review-policy/page.tsx | 1 | source_records:1 | unknown | indexable/public-surface | 2026-05-20T18:26:15.429Z | source scan: slug keys=0, record hints=2 |
| src/app/api/admin/blog/[id]/image-generate/route.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.456Z | source scan: slug keys=0, record hints=1 |
| src/app/api/admin/blog/[id]/seo/regenerate/route.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.456Z | source scan: slug keys=1, record hints=4 |
| src/app/api/admin/blog/batch-schedule/[id]/route.ts | 1 | source_records:1 | unknown | indexable/public-surface | 2026-05-20T18:26:15.457Z | source scan: slug keys=1, record hints=2 |
| src/app/api/admin/blog/control-panel/regenerate/route.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.458Z | source scan: slug keys=0, record hints=1 |
| src/app/api/admin/blog/draft-batch/[id]/route.ts | 1 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:15.458Z | source scan: slug keys=1, record hints=2 |
| src/app/api/admin/blog/generate-gemini-draft/route.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:15.459Z | source scan: slug keys=1, record hints=1 |
| src/app/api/admin/blog/localized/[id]/route.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:15.460Z | source scan: slug keys=0, record hints=5 |
| src/app/api/admin/blog/localized/route.ts | 1 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:15.460Z | source scan: slug keys=0, record hints=4 |
| src/lib/blog/admin-blog-generation-service.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.756Z | source scan: slug keys=1, record hints=4 |
| src/lib/blog/apa7.ts | 1 | source_records:1 | public | unknown | 2026-05-20T18:26:16.757Z | source scan: slug keys=0, record hints=2 |
| src/lib/blog/blog-admin-library-query.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:16.757Z | source scan: slug keys=1, record hints=2 |
| src/lib/blog/blog-article-bounds.ts | 1 | source_records:1 | mixed | unknown | 2026-05-20T18:26:16.757Z | source scan: slug keys=0, record hints=2 |
| src/lib/blog/blog-article-pipeline-prompts.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.758Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/blog-auto-link-html.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.758Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/blog-auto-link.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.758Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/blog-cli-publish-sniff.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:16.760Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/blog-control-panel-plan-fallback.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.761Z | source scan: slug keys=0, record hints=4 |
| src/lib/blog/blog-control-panel-plan-normalize.test.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:16.761Z | source scan: slug keys=0, record hints=4 |
| src/lib/blog/blog-control-panel-plan-normalize.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:16.761Z | source scan: slug keys=1, record hints=2 |
| src/lib/blog/blog-control-panel-schema.ts | 1 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:16.761Z | source scan: slug keys=0, record hints=2 |
| src/lib/blog/blog-diabetes-editorial-json-smoke.integration.test.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.762Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/blog-exam-routes.ts | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:16.762Z | source scan: slug keys=1, record hints=1 |
| src/lib/blog/blog-generate-seo.test.ts | 1 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:16.762Z | source scan: slug keys=1, record hints=3 |
| src/lib/blog/blog-generated-draft-quality.test.ts | 1 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:16.762Z | source scan: slug keys=0, record hints=5 |
| src/lib/blog/blog-generated-draft-quality.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.763Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/blog-generated-publish-gates.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.763Z | source scan: slug keys=0, record hints=5 |
| src/lib/blog/blog-generation-output-gate.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.763Z | source scan: slug keys=1, record hints=5 |
| src/lib/blog/blog-generation-repair-ai.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.763Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/blog-image-workflow.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.764Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/blog-index-hero-copy.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:16.764Z | source scan: slug keys=0, record hints=4 |
| src/lib/blog/blog-internal-link-verify.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.765Z | source scan: slug keys=1, record hints=1 |
| src/lib/blog/blog-localization-types.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.765Z | source scan: slug keys=0, record hints=3 |
| src/lib/blog/blog-longform-body-enforcement.test.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.765Z | source scan: slug keys=0, record hints=4 |
| src/lib/blog/blog-longform-body-enforcement.ts | 1 | source_records:1 | mixed | unknown | 2026-05-20T18:26:16.765Z | source scan: slug keys=0, record hints=2 |
| src/lib/blog/blog-longform-nursing-contract.test.ts | 1 | source_records:1 | mixed | unknown | 2026-05-20T18:26:16.765Z | source scan: slug keys=0, record hints=4 |
| src/lib/blog/blog-optional-slug.server.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:16.766Z | source scan: slug keys=1, record hints=1 |
| src/lib/blog/blog-optional-slug.ts | 1 | source_records:1 | hidden/internal | noindex/hidden | 2026-05-20T18:26:16.766Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/blog-patho-pharm-detection.ts | 1 | source_records:1 | public | unknown | 2026-05-20T18:26:16.766Z | source scan: slug keys=1, record hints=3 |
| src/lib/blog/blog-public-body-strip.ts | 1 | source_records:1 | public | unknown | 2026-05-20T18:26:16.768Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/blog-publish-quality-validator.ts | 1 | source_records:1 | hidden/internal | indexable/public-surface | 2026-05-20T18:26:16.769Z | source scan: slug keys=0, record hints=4 |
| src/lib/blog/blog-publishing-package.ts | 1 | source_records:1 | mixed | unknown | 2026-05-20T18:26:16.769Z | source scan: slug keys=1, record hints=3 |
| src/lib/blog/blog-reconstruct-plan-from-post.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.770Z | source scan: slug keys=1, record hints=4 |
| src/lib/blog/blog-recovery-audit.test.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.770Z | source scan: slug keys=1, record hints=5 |
| src/lib/blog/blog-related-published-posts.test.ts | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:16.770Z | source scan: slug keys=1, record hints=3 |
| src/lib/blog/blog-reliable-draft-smoke.integration.test.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.771Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/blog-review-flags.ts | 1 | source_records:1 | public | unknown | 2026-05-20T18:26:16.771Z | source scan: slug keys=0, record hints=3 |
| src/lib/blog/blog-section-isolated-body-generation.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.771Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/blog-static-longtail-load.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-31T18:08:24.561Z | source scan: slug keys=1, record hints=4 |
| src/lib/blog/blog-static-longtail-types.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-23T04:04:31.049Z | source scan: slug keys=1, record hints=4 |
| src/lib/blog/blog-static-supplement.ts | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:16.773Z | source scan: slug keys=1, record hints=1 |
| src/lib/blog/blog-word-count.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.774Z | source scan: slug keys=0, record hints=3 |
| src/lib/blog/hidden-blog-content-import-plan.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.776Z | source scan: slug keys=1, record hints=5 |
| src/lib/blog/localized-blog-route-params.ts | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:16.776Z | source scan: slug keys=1, record hints=1 |
| src/lib/blog/multilingual-blog-seo-links.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.777Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/multilingual-blog-seo-resolve.ts | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:16.778Z | source scan: slug keys=1, record hints=2 |
| src/lib/blog/multilingual-blog-seo-types.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.778Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/multilingual-blog-seo.contract.test.ts | 1 | published:3 | mixed | indexable/public-surface | 2026-05-20T18:26:16.778Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/patho-pharm-longtail-topic-patterns.ts | 1 | source_records:1 | public | unknown | 2026-05-20T18:26:16.779Z | source scan: slug keys=0, record hints=5 |
| src/lib/blog/recover-blog-visibility.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.780Z | source scan: slug keys=1, record hints=2 |
| src/lib/blog/safe-blog-queries.get-published-blog-post-by-slug.test.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-20T18:26:16.780Z | source scan: slug keys=1, record hints=4 |
| src/lib/blog/safe-localized-blog-queries.test.ts | 1 | source_records:1 | unknown | indexable/public-surface | 2026-05-20T18:26:16.781Z | source scan: slug keys=1, record hints=3 |
| src/lib/blog/seo-campaign-engine.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:16.781Z | source scan: slug keys=0, record hints=2 |
| src/lib/blog/serialize-content.ts | 1 | source_records:1 | public | unknown | 2026-05-20T18:26:16.781Z | source scan: slug keys=0, record hints=1 |
| src/lib/blog/serialize-paramedic.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:16.782Z | source scan: slug keys=1, record hints=4 |
| src/lib/seo/ai-search-llm-citation-optimization-engine.test.ts | 1 | source_records:1 | unknown | unknown | 2026-05-31T06:49:01.334Z | source scan: slug keys=0, record hints=1 |
| src/lib/seo/ai-search-llm-citation-optimization-engine.ts | 1 | source_records:1 | unknown | unknown | 2026-05-31T06:50:09.523Z | source scan: slug keys=0, record hints=2 |
| src/lib/seo/clinical-title-patterns.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.048Z | source scan: slug keys=0, record hints=4 |
| src/lib/seo/healthcare-search-intent-domination-engine.ts | 1 | source_records:1 | mixed | indexable/public-surface | 2026-05-31T06:07:49.007Z | source scan: slug keys=0, record hints=2 |
| src/lib/seo/load-programmatic-overlay.ts | 1 | source_records:1 | mixed | unknown | 2026-05-20T18:26:17.054Z | source scan: slug keys=1, record hints=1 |
| src/lib/seo/marketing-metadata.ts | 1 | source_records:1 | unknown | indexable/public-surface | 2026-05-21T23:57:16.177Z | source scan: slug keys=0, record hints=1 |
| src/lib/seo/marketing-webpage-jsonld.test.ts | 1 | source_records:1 | unknown | indexable/public-surface | 2026-05-20T18:26:17.059Z | source scan: slug keys=0, record hints=3 |
| src/lib/seo/marketing-webpage-jsonld.ts | 1 | source_records:1 | unknown | indexable/public-surface | 2026-05-20T18:26:17.059Z | source scan: slug keys=0, record hints=3 |
| src/lib/seo/merge-programmatic-page.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.059Z | source scan: slug keys=0, record hints=3 |
| src/lib/seo/normalize-page-title.ts | 1 | source_records:1 | unknown | unknown | 2026-05-21T23:55:57.537Z | source scan: slug keys=0, record hints=1 |
| src/lib/seo/pathway-breadcrumbs.test.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:17.061Z | source scan: slug keys=1, record hints=1 |
| src/lib/seo/pathway-lesson-content-dates.ts | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:17.061Z | source scan: slug keys=1, record hints=1 |
| src/lib/seo/pathway-topic-programmatic-metadata.ts | 1 | source_records:1 | unknown | indexable/public-surface | 2026-05-20T18:26:17.062Z | source scan: slug keys=0, record hints=2 |
| src/lib/seo/programmatic-page-links.ts | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:17.063Z | source scan: slug keys=1, record hints=1 |
| src/lib/seo/programmatic-question-topic-registry-slugs.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.063Z | source scan: slug keys=1, record hints=1 |
| src/lib/seo/programmatic-question-topic-registry.ts | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:17.063Z | source scan: slug keys=1, record hints=1 |
| src/lib/seo/programmatic-registry-slugs.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.064Z | source scan: slug keys=1, record hints=1 |
| src/lib/seo/programmatic-seo-definitions.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.065Z | source scan: slug keys=1, record hints=3 |
| src/lib/seo/programmatic-seo-engine/lesson-public-metadata.ts | 1 | source_records:1 | public | unknown | 2026-05-20T18:26:17.065Z | source scan: slug keys=0, record hints=5 |
| src/lib/seo/programmatic-seo-engine/programmatic-seo-engine.test.ts | 1 | active:1 | mixed | indexable/public-surface | 2026-05-20T18:26:17.065Z | source scan: slug keys=0, record hints=5 |
| src/lib/seo/programmatic-seo-engine/types.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:17.065Z | source scan: slug keys=0, record hints=1 |
| src/lib/seo/programmatic-study-modes.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.065Z | source scan: slug keys=1, record hints=1 |
| src/lib/seo/programmatic-study-seo-load.ts | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:17.065Z | source scan: slug keys=1, record hints=2 |
| src/lib/seo/programmatic-taxonomy-topic-page.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-20T18:26:17.065Z | source scan: slug keys=0, record hints=1 |
| src/lib/seo/safe-marketing-metadata.test.ts | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:17.066Z | source scan: slug keys=0, record hints=2 |
| src/lib/seo/safe-marketing-metadata.ts | 1 | source_records:1 | mixed | mixed | 2026-05-31T18:25:14.862Z | source scan: slug keys=0, record hints=3 |
| src/lib/seo/search-console-optimization-engine.test.ts | 1 | source_records:1 | unknown | unknown | 2026-05-31T05:07:03.469Z | source scan: slug keys=0, record hints=1 |
| src/lib/seo/search-console-optimization-engine.ts | 1 | source_records:1 | hidden/internal | unknown | 2026-05-31T05:07:03.468Z | source scan: slug keys=0, record hints=1 |
| src/lib/seo/seo-generator.test.ts | 1 | source_records:1 | unknown | unknown | 2026-05-20T18:26:17.067Z | source scan: slug keys=0, record hints=2 |
| src/lib/seo/sitemap-localized-blog-xml.ts | 1 | source_records:1 | mixed | mixed | 2026-05-20T18:26:17.068Z | source scan: slug keys=1, record hints=1 |
| src/lib/seo/sitemap-multilingual-blog-xml.ts | 1 | source_records:1 | public | indexable/public-surface | 2026-05-20T18:26:17.068Z | source scan: slug keys=1, record hints=1 |
| src/lib/seo/sitemap-phase2-segmentation.contract.test.ts | 1 | source_records:1 | unknown | indexable/public-surface | 2026-05-31T18:19:48.554Z | source scan: slug keys=0, record hints=1 |
| src/lib/seo/thin-content-eradication-engine.test.ts | 1 | source_records:1 | mixed | mixed | 2026-05-31T05:52:44.750Z | source scan: slug keys=0, record hints=3 |
| src/lib/seo/thin-content-eradication-engine.ts | 1 | source_records:1 | mixed | mixed | 2026-05-31T05:52:06.272Z | source scan: slug keys=0, record hints=1 |
| db:* | 0 | database_unreachable:1 | unknown | unknown | n/a | Database/CMS inventory failed:  |
