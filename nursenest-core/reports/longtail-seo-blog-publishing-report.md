# Long-tail SEO blog publishing pipeline (admin batch) — as implemented

**Scope:** This document maps the **existing** NurseNest admin blog batch / cron / publish stack. **No new CMS** is introduced here; everything references current Next.js routes, Prisma-backed `BlogPost` / batch tables, and in-repo libraries.

**Runtime caveat:** End-to-end “we published a new row and it appeared on `/blog`” can only be asserted with a running app, valid `DATABASE_URL`, admin session, and (for AI drafts) enabled admin AI gates. This report is **code-anchored**; live publish smoke was **not** executed in this agent pass.

---

## 1. Draft batch creation (topic list → persisted batch)

| Step | Where |
| --- | --- |
| Admin UI | `src/components/admin/admin-blog-draft-batch-client.tsx` — loads recent batches via `GET /api/admin/blog/draft-batch?limit=15`, creates batches from pasted topics, drives processing/retry. |
| API: create + list | `src/app/api/admin/blog/draft-batch/route.ts` — `POST` validates JSON with `blogDraftGenerationBatchCreateBodySchema`, parses newline topics (`parseDraftBatchTopicLines`), creates `BlogDraftGenerationBatch` + line items via Prisma. `GET` lists recent batches (admin-gated). |

Supporting modules: `src/lib/blog/blog-draft-generation-batch-create-body.ts`, `src/lib/blog/blog-draft-generation-batch-parse.ts`, `src/lib/blog/blog-intent-dedupe.ts` (`normalizeBlogTopicKey` on items).

---

## 2. Draft batch processing (“tick” / chunk process)

| Path | Role |
| --- | --- |
| `POST /api/admin/blog/draft-batch/[id]/process` | `src/app/api/admin/blog/draft-batch/[id]/process/route.ts` — processes up to `limit` pending items (default 4), calls `processDraftGenerationBatchItems` from `src/lib/blog/blog-draft-generation-batch.ts`. Respects `adminAiGenerationHttpBlock` when AI is disabled. |
| `POST /api/admin/blog/generation-jobs/[id]/tick` | `src/app/api/admin/blog/generation-jobs/[id]/tick/route.ts` — same processing primitive for **background** batches (`backgroundProcessing`); returns 400 if used for foreground batches (directs caller to `/draft-batch/:id/process`). |

Core processor: `src/lib/blog/blog-draft-generation-batch.ts` (provider calls, throttling, shell/topic-map batch branches). Constants: `src/lib/blog/blog-draft-generation-batch-constants.ts` (`DRAFT_BATCH_MAX_ITEMS_PER_PROCESS`).

Background pump orchestration: `src/lib/blog/blog-generation-jobs.ts` (`pumpBackgroundBlogDraftBatches`, cron logging).

---

## 3. Separate cron: article generation jobs (control-panel / legacy job pump)

| Route | Role |
| --- | --- |
| `POST /api/cron/blog-article-generation-jobs` | `src/app/api/cron/blog-article-generation-jobs/route.ts` — `enforceCronSecretOrResponse`, then `pumpBlogArticleGenerationJobs()` from `src/lib/blog/blog-article-generation-job.ts` (distinct from draft-batch rows; capped `maxDuration`). |

---

## 4. Scheduled topic batches (cadence / “batch schedule” pipeline)

| Area | Files |
| --- | --- |
| Admin UI | `src/components/admin/admin-blog-topic-batch-client.tsx` — previews/runs batch schedules; references cron `POST /api/cron/blog-batch-schedule`. |
| APIs | `src/app/api/admin/blog/batch-schedule/route.ts`, `batch-schedule/preview/route.ts`, `batch-schedule/run/route.ts`, `batch-schedule/[id]/route.ts`, `batch-schedule/items/[itemId]/retry-repair/route.ts`. |
| Business logic | `src/lib/blog/blog-batch-schedule.ts` — topic parsing, cadence, `processDueBlogBatchScheduleItems`, `ensureDailyBlogQueue`, localized follow-up hooks (`runBlogBatchLocalizedFollowup`). |

---

## 5. Master cron: queue + schedule processor + scheduled publish promotion + draft pump

| Route | Role |
| --- | --- |
| `POST /api/cron/blog-batch-schedule` | `src/app/api/cron/blog-batch-schedule/route.ts` — under advisory lock: `verifyBlogPublishSchemaColumns()`, then **parallel** `ensureDailyBlogQueue()`, `processDueBlogBatchScheduleItems()`, `promoteScheduledBlogPosts()`, `pumpBackgroundBlogDraftBatches()`. On success, `revalidateBlogPublishingSurfaces({ promotedSlugs })`. |

---

## 6. Lighter cron: promote only + ISR

| Route | Role |
| --- | --- |
| `POST /api/cron/blog-publish` | `src/app/api/cron/blog-publish/route.ts` — `promoteScheduledBlogPosts()` then `revalidateBlogPublishingSurfaces({ promotedSlugs: result.promotedSlugs })`. |

Scheduler implementation: `src/lib/blog/blog-publish-scheduler.ts` (`promoteScheduledBlogPosts` — reads candidates with `publishAt` / `scheduledAt`, runs pre-publish + canonical publish, retries capped via `adminPublishLog`).

---

## 7. Pre-publish validation

| Surface | Role |
| --- | --- |
| Dedicated GET | `src/app/api/admin/blog/[id]/pre-publish-validation/route.ts` — loads post with `blogPrePublishValidationSelect`, returns `validateBlogPrePublish` JSON. |
| PATCH gate | `src/app/api/admin/blog/[id]/route.ts` — for `publish_now` (and schedule paths that require it), `runPrePublishGate()` merges patch, calls `validateBlogPrePublish`; **422** on blocking issues; warnings require `acknowledgePrePublishWarnings`. |

Rules engine: `src/lib/blog/blog-pre-publish-validation.ts`.

---

## 8. `publish_now` vs draft vs schedule (admin PATCH)

| Mechanism | Where |
| --- | --- |
| Admin PATCH | `src/app/api/admin/blog/[id]/route.ts` — `publish_now` runs taxonomy checks, pre-publish, then canonical publish (`publishBlogPostCanonical` / workflow alignment). Errors logged via `blog_publish_now_failed` / publish log appenders. |
| AI generate path publish flag | `src/app/api/admin/blog/generate-ai/route.ts` — `publishMode: publishNow ? "publish_now" : "draft"` (generation-time intent). |

Canonical path helper: `src/lib/blog/generated-blog-post-publish.ts` (`expectedCanonicalBlogPath` for RN hub vs global `/blog/{slug}` vs nursing/allied scoped paths).

---

## 9. Public blog surfaces (marketing)

| Route pattern | File |
| --- | --- |
| `/blog` | `src/app/(marketing)/(default)/blog/page.tsx` |
| `/blog/[slug]` | `src/app/(marketing)/(default)/blog/[slug]/page.tsx` |
| `/blog/rn`, `/blog/rn/[slug]` | `src/app/(marketing)/(default)/blog/rn/page.tsx`, `blog/rn/[slug]/page.tsx` |
| Tag / category | `src/app/(marketing)/(default)/blog/tag/[tag]/page.tsx`, `blog/category/[category]/page.tsx` |
| Career hubs | `src/app/(marketing)/(default)/nursing/[careerSlug]/blog/...` |
| Allied | `src/app/(marketing)/(default)/allied-health/[slug]/blog/...` |

---

## 10. Localized blog (locale + pathway segments)

| Route pattern | File |
| --- | --- |
| `/[locale]/[slug]/[examCode]/[exam]/blog`, `/.../blog/[postSlug]` | `src/app/(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/page.tsx`, `[postSlug]/page.tsx` — uses `getPublishedLocalizedBlogBySlug`, `buildLocalizedBlogSeoMeta`, `blog-revalidate` tags as documented in module headers. |

Queries: `src/lib/blog/safe-localized-blog-queries.ts`.

---

## 11. Sitemap merge (DB + static corpus)

| Piece | Role |
| --- | --- |
| `/sitemap.xml` route | `src/app/sitemap.xml/route.ts` — `collectCoreUrls` + `listBlogSitemapEntriesSafe()` → `mergeCoreUrlsWithBlogEntries` → `filterPublicSitemapEntries` → dedupe → XML. |
| Blog URL emission | `src/lib/seo/sitemap-blog-xml.ts` — `getMergedBlogSitemapSlugRows` / `expectedCanonicalBlogPath` for scoped URLs. |
| Data access | `src/lib/blog/safe-blog-queries.ts` — exports `getMergedBlogSitemapSlugRows` (merged DB + static longtail) alongside strict helpers. |

Contract tests: `src/lib/blog/blog-sitemap-merge.contract.test.ts`, `src/lib/seo/sitemap-merged-route.test.ts`, `npm run test:seo-sitemap` (see `package.json`).

---

## 12. Post-publish cache invalidation

| Module | Role |
| --- | --- |
| `src/lib/blog/blog-revalidate-publishing.ts` | `revalidateBlogPublishingSurfaces` — `revalidatePath` for `/blog`, `/blog/rn/{slug}`, `/nursing/{career}/blog/...`, `/sitemap.xml`, home, lessons index, etc.; tag-based revalidation hooks for pathway + marketing blog caches. |

Cron `blog-batch-schedule` and `blog-publish` both call this after promotions.

---

## 13. NPM scripts useful for publication readiness (non-exhaustive)

From `nursenest-core/package.json`:

- `npm run blog:verify-publication-readiness` → `scripts/blog/verify-blog-publication-readiness.mts`
- `npm run blog:verify-public` → `scripts/verify-blog-publication-surface.mjs`
- `npm run test:blog-recovery` — unit/integration bundle for recovery + publish gates
- `npm run test:seo-sitemap` — sitemap + blog merge contracts

---

## 14. Truthpack note

`.vibecheck/truthpack/ui-pages.json` and `routes.json` were **not found** in this workspace clone. Route statements above cite **application source** and cron route files only.

