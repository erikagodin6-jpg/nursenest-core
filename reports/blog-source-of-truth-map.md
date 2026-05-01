# Blog source of truth map

This document traces how marketing blog content flows through the NurseNest codebase. **Canonical English marketing blog persistence and `/blog` public routes use the `BlogPost` Prisma model.** Regional **locale+exam** marketing surfaces may use `LocalizedBlogArticle` (see `src/app/(marketing)/[locale]/.../blog/*` and `getPublishedLocalizedBlog*` in `safe-blog-queries` / related modules). Do not treat `ContentItem` rows with `type: "blog"` as the live public body source for canonical `/blog` unless an explicit bridge is documented.

## 1. Where blog content is generated

| Area | Path / mechanism | Notes |
|------|------------------|-------|
| Admin control panel / AI longform | `src/lib/blog/blog-article-generation-pipeline.ts`, `src/lib/blog/blog-control-panel-generation.ts` | Persists drafts to `BlogPost` via pipeline; terminal publish uses `publishBlogPostCanonical`. |
| Background jobs | `src/lib/blog/blog-article-generation-job.ts` | `BlogArticleGenerationJob` queue; `runClaimedBlogArticleGenerationJob` runs pipeline; deferred retry via `scheduleDeferredBlogArticleGenerationJobRetry` + `pumpBlogArticleGenerationJobs`. |
| Batch / scheduler / recovery scripts | `src/lib/blog/blog-publish-scheduler.ts`, `src/lib/blog/blog-recover-missed-posts.ts`, `scripts/*blog*`, `scripts/recover-blog-visibility.mjs` | Full go-live should use `publishBlogPostCanonical`. **Visibility-only** recovery (workflow → `PUBLISHED`, `publishAt` when null) is `recover-blog-visibility` — see `src/lib/blog/recover-blog-visibility.ts`; it does **not** edit `body`. |
| Static marketing corpus | `src/content/blog-static-posts.ts`, `STATIC_BLOG_POSTS` | Bundled fallback when DB is skipped at build; merged into sitemap and some list paths per env flags. |

## 2. Where generated content is stored

- **Primary:** `BlogPost` row in Postgres (`title`, `slug`, `body`, `excerpt`, SEO fields, `postStatus`, `workflowStatus`, `publishAt`, `scheduledAt`, `exam`, `category`, `locale`, `careerSlug`, etc.).
- **Generation queue / diagnostics:** `BlogArticleGenerationJob` (`stage`, `repairable`, `retryCount`, `lastError`, `failureCode`, `nextAttemptAt`, snapshots).
- **Legacy / secondary surfaces:** `ContentItem` with `type: "blog"` may exist for historical imports; **public Next.js blog routes read `BlogPost` via `safe-blog-queries`**, not `ContentItem`. Treat `ContentItem` blog rows as migration / audit only unless a route explicitly bridges them.

## 3. Admin blog editor read/write

- **List / create:** `src/app/api/admin/blog/route.ts` — `GET`/`POST` on `BlogPost`.
- **Patch / publish / unpublish:** `src/app/api/admin/blog/[id]/route.ts` — updates `BlogPost`; **publish-now** path calls `publishBlogPostCanonical` with context `admin_patch_publish_now` (visibility + pre-publish + persistence in one place).
- **UI:** `src/app/(admin)/admin/blog/**` pages (studio, library, control panel, scheduler, etc.) consume those APIs.

## 4. Where public blog detail reads from

- **Default marketing:** `src/app/(marketing)/(default)/blog/[slug]/page.tsx` — `getPublishedBlogPostBySlug`, `getBlogPostMetaBySlug`, `isBlogPostMetaVisible` from `src/lib/blog/safe-blog-queries.ts`.
- **Scoped hubs:** `.../nursing/[careerSlug]/blog/[postSlug]/page.tsx`, `.../allied-health/...`, locale+exam scoped blog routes — same helpers with scope parameters where applicable.
- **Visibility:** `blogPostIsLive` / `blogLiveWhere` in `src/lib/blog/blog-visibility.ts` (combines `postStatus`, `workflowStatus`, `publishAt`, `scheduledAt`, failed workflow exclusions).

## 5. Blog index / category / tag pages

- **Global index:** `src/app/(marketing)/(default)/blog/page.tsx` — list helpers from `safe-blog-queries` using `buildBlogPublicListWhere` + pagination.
- **Tag index:** `src/app/(marketing)/(default)/blog/tag/[tag]/page.tsx` — same stack, filtered by tag.
- **Career / exam hubs:** under `src/app/(marketing)/.../blog/page.tsx` — scoped `buildBlogPublicListWhere` with `careerSlug` / `exam` / `locale` as appropriate.

## 6. Sitemap (and RSS if present)

- **Blog URL merge:** `src/lib/seo/sitemap-blog-xml.ts` uses **`getMergedBlogSitemapSlugRows`** from `safe-blog-queries.ts` so DB live posts and static corpus stay consistent.
- **Strict diagnostics:** `getSitemapPublishedBlogSlugsStrict` remains for scripts; merged path is what production sitemap generation should use.
- **RSS:** Search `rss` + `blog` in `src/app` if your branch adds a feed; wire it to the same `blogLiveWhere` / `getPublishedBlogPostBySlug` pattern when added.

## 7. Fields controlling visibility (checklist)

| Field / concept | Role |
|-----------------|------|
| `postStatus` (`BlogPostStatus`) | `DRAFT`, `NEEDS_REVIEW`, `FAILED` → not public. `APPROVED` can be public-ready when workflow not failed. `PUBLISHED` requires workflow + publish time rules. `SCHEDULED` uses `publishAt` / `scheduledAt`. |
| `workflowStatus` (`BlogWorkflowStatus`) | Pipeline states (`GENERATED`, `NEEDS_*_REVIEW`, …) **block** public live for `PUBLISHED` until `PUBLISHED`. Failures (`FAILED_GENERATION`, `FAILED_IMAGE`) block. |
| `publishAt` | Embargo / schedule: for `PUBLISHED`, future `publishAt` hides post until time passes (`blogPostIsLive`). |
| `scheduledAt` | Used with scheduled posts; aligned with `normalizeBlogPostStatusWriteFields`. |
| *(no separate `isPublished` / `isPublic` flags on canonical `BlogPost`)* | Use `postStatus` + `workflowStatus` + timestamps instead. |
| `seoTitle` / `seoDescription` / excerpt | SEO and pre-publish gates (`validateBlogPrePublish`); meta visibility helpers (`isBlogPostMarketingMetaVisible`). |
| `locale` | Scoping for localized hubs and list filters. |
| `exam` | Exam scoping on posts and public list filters. |
| `careerSlug` | Nursing career hub scoping; optional global index exclusion via `BLOG_MAIN_INDEX_EXCLUDE_SCOPED_POSTS`. |
| `slug` | URL key `/blog/[slug]`; uniqueness enforced at admin create + `ensureUniqueBlogPostSlug`. |
| `category` / `tags` | Taxonomy + filters; classifier enforced on admin create/patch. |
| `robots` / `noindex` (if stored on row or in SEO JSON) | Respect `internalLinkPlan` / schema summary in pre-publish and metadata builders — verify per-branch column names in Prisma. |

## Phase 4 alignment (no second system)

- **Public read path** = `BlogPost` + `safe-blog-queries` + `blog-visibility`.
- **Admin publish path** = `publishBlogPostCanonical` (used from `PATCH` `action: "publish"` in `admin/blog/[id]`).
- **Recovery audit** = `scripts/audit-hidden-blogs-runner.mts` classifies `BlogPost` rows and only applies **`publishBlogPostCanonical`** with context `audit_hidden_blogs_apply` for `READY_TO_PUBLISH` when `--apply` is passed.

If you discover an admin UI still writing only `ContentItem` for longform, treat that as **legacy**: migrate content into `BlogPost` or add a one-way import — do not add a second public renderer.

## Regenerating machine-readable inventory

From the app package directory (`nursenest-core/`):

```bash
npm run audit:hidden-blogs -- --write-reports
```

Requires `DATABASE_URL` for full rows. Without DB, the script writes a placeholder `reports/blog-hidden-content-inventory.json` when `--write-reports` is used from a no-DB environment (see script behavior).
