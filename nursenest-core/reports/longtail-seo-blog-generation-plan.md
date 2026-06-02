# Long-tail SEO blog — architecture-aligned plan

**Scope:** Verify and extend **existing** NurseNest admin batch tooling, canonical `BlogPost` / `LocalizedBlogArticle` persistence, pre-publish validators, and sitemap emission. This is **not** a greenfield CMS or parallel ingestion layer.

**Constraints (confirmed):** No new parallel blog DB layer; no schema migrations unless explicitly requested; no production publish from this document.

---

## Reuse map (no parallel systems)

| Route / surface | Primary file(s) | Responsibility | How long-tail program plugs in |
|----------------|-----------------|----------------|--------------------------------|
| `/admin/blog` | `nursenest-core/src/app/(admin)/admin/blog/page.tsx` | Blog console: drafts, scheduled/queued posts, links to library, draft-batch, batch-schedule repair entry points | Same admin shell; add topic lines / batches via existing **topic batch** + **draft batch** + **generation jobs** APIs; monitor queue sections already on this page |
| `/admin/blog/generate` | `nursenest-core/src/app/(admin)/admin/blog/generate/page.tsx` | **Redirects** to `/admin/blog#generate-blog-draft` (legacy entry preserved) | Deep links can keep using `/admin/blog#…` |
| `/admin/blog/topic-batch` | `nursenest-core/src/app/(admin)/admin/blog/topic-batch/page.tsx`, `nursenest-core/src/components/admin/admin-blog-topic-batch-client.tsx` | **`BlogBatchSchedule`**: preview/run via `/api/admin/blog/batch-schedule`*, cron `nursenest-core/src/app/api/cron/blog-batch-schedule/route.ts` | Schedule long-tail topics into existing `batch-schedule` rows; no second scheduler |
| `/admin/blog/draft-batch` | `nursenest-core/src/app/(admin)/admin/blog/draft-batch/page.tsx`, `nursenest-core/src/components/admin/admin-blog-draft-batch-client.tsx` | **`BlogDraftGenerationBatch`**: `POST/GET /api/admin/blog/draft-batch`, process `…/draft-batch/[id]/process`, background tick `…/generation-jobs/[id]/tick`, repair `…/draft-batch/items/[itemId]/retry-repair` | Bulk draft generation/repair for patho/pharm long-tail lines uses this pipeline + `nursenest-core/src/lib/blog/blog-draft-generation-batch.ts` |
| `/admin/blog/library` | `nursenest-core/src/app/(admin)/admin/blog/library/page.tsx`, `nursenest-core/src/components/admin/blog/admin-blog-library-client.tsx` | Filterable inventory of posts/drafts | Operational visibility for long-tail inventory without new DB |
| `/admin/blog/scheduler` | `nursenest-core/src/app/(admin)/admin/blog/scheduler/page.tsx` | **Redirects** to `/admin/blog#scheduled-queued-posts` | Same anchor; no duplicate scheduler UI |
| `/admin/blog/studio` | `nursenest-core/src/app/(admin)/admin/blog/studio/page.tsx` | **Redirects** to `/admin/blog#generate-blog-draft` | Same as “generate” |
| `/admin/blog/control-panel` | `nursenest-core/src/app/(admin)/admin/blog/control-panel/page.tsx` | Full article plan + section regen: `…/api/admin/blog/control-panel/*` | Long-tail one-off authoring and section repair |
| `/admin/hub/publishing` | `nursenest-core/src/app/(admin)/admin/hub/publishing/page.tsx` | **Hub shell**: cards → `/admin/blog`, `/admin/blog/draft-batch`, `/admin/seo` | Entry point only; reuses the same blog subsystems |
| **Admin APIs (bulkhead)** | `nursenest-core/src/app/api/admin/blog/**` | CRUD, publish gates, SEO regen, localized queue, campaigns, generation-jobs | Extend inputs/metadata only as needed — still `BlogPost` / existing batch tables |
| **Publish canonical** | `nursenest-core/src/lib/blog/publish-blog-post-canonical.ts`, `nursenest-core/src/app/api/admin/blog/[id]/route.ts` | Server-side publish + revalidation hooks | All long-tail posts must pass existing gates before `published` |
| **Pre-publish validation** | `nursenest-core/src/lib/blog/blog-pre-publish-validation.ts`, `nursenest-core/src/app/api/admin/blog/[id]/pre-publish-validation/route.ts` | Checklist: slug, SEO bundle, FAQ schema, internal links, taxonomy, quality gates | Run (or automate) before any bulk publish promotion |
| **SEO automation bundle** | `nursenest-core/src/lib/blog/blog-seo-automation.ts`, `nursenest-core/src/app/api/admin/blog/[id]/seo/regenerate/route.ts` | JSON SEO bundle + schema notes | Refresh after content edits for long-tail tiers |
| **Content SSOT registry** | `nursenest-core/src/lib/content-source-of-truth/content-registry.ts` | Documents admin + public patterns per content type | Align internal links with registry `publicReadRoutePattern` / `learnerReadRoutePattern` (marketing-safe paths only in HTML) |

---

## Public blog & pathway routing (verified App Router)

| Pattern | File | Notes |
|---------|------|--------|
| **Default locale canonical blog** | `nursenest-core/src/app/(marketing)/(default)/blog/page.tsx`, `…/blog/[slug]/page.tsx`, `…/blog/tag/[tag]/page.tsx`, `…/blog/rn/*`, `…/nursing/[careerSlug]/blog/*`, `…/allied-health/[slug]/blog/*` | English marketing tree; JSON-LD via `BlogPostingJsonLd`, `BlogFaqPageJsonLd` in `blog/[slug]/page.tsx` |
| **`/[locale]/[slug]/[examCode]/[exam]/blog`** | `nursenest-core/src/app/(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/page.tsx` | **Localized index**; params overloaded per `localized-blog-route-params.ts` (`slug`→region, `examCode`→profession, `exam`→exam code) |
| **`/[locale]/[slug]/[examCode]/[exam]/blog/[postSlug]`** | `nursenest-core/src/app/(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/[postSlug]/page.tsx` | **Localized post**; uses `safe-localized-blog-queries`, `blog-seo-localized`, FAQ JSON-LD |
| **Href builder** | `nursenest-core/src/lib/blog/localized-blog-route-params.ts` — `buildLocalizedBlogHref` | Canonical builder for localized blog URLs |
| **Sitemap: canonical posts** | `nursenest-core/src/lib/seo/sitemap-blog-xml.ts` → `getMergedBlogSitemapSlugRows` in `nursenest-core/src/lib/blog/safe-blog-queries.ts` | Merged DB + static parity per contract tests |
| **Sitemap: localized posts** | `nursenest-core/src/lib/seo/sitemap-localized-blog-xml.ts` | Uses `localizedBlogPath` / `getSitemapLocalizedBlogRowsStrict`; respects `isLocaleSitemapIncluded` |
| **Merged root sitemap** | `nursenest-core/src/app/sitemap.xml/route.ts` | `collectCoreUrls` + `listBlogSitemapEntriesSafe` via `mergeCoreUrlsWithBlogEntries` |

---

## SEO verification scripts (repo)

| Script / command | Path | Role |
|------------------|------|------|
| SEO indexability orchestrator | `nursenest-core/scripts/seo/verify-seo-indexability.ts` | Runs robots + sitemap URL + public marketing links checks |
| Sitemap URL fetch verify | `nursenest-core/scripts/seo/verify-sitemap-urls.ts` | HTTP 200 + `<loc>` parsing |
| Robots | `nursenest-core/scripts/seo/verify-robots.ts` (called from indexability script) | Robots rules |
| GSC CSV checker | `nursenest-core/scripts/seo/verify-gsc-csv.ts` | Optional 404 triage from exports |
| Blog publication readiness | `nursenest-core/scripts/blog/verify-blog-publication-readiness.mts` | Status, canonical route, admin link, sitemap membership |
| Blog publication surface (legacy runner) | `nursenest-core/scripts/verify-blog-publication-surface.mjs` | HTTP checks incl. `/sitemap.xml` |
| Admin publish path smoke | `nursenest-core/scripts/blog/verify-admin-publish-path.mts` | Admin publish flow validation |
| **Tests** | `nursenest-core/package.json` — `test:seo-sitemap`, `test:blog-recovery`, `blog:quality:test` | Contracts: `sitemap-merged-route.test.ts`, `blog-sitemap-merge.contract.test.ts`, publish gates, etc. |

---

## Lesson indexing pipelines (build / verify)

| Command | Path / entry | Role |
|---------|--------------|------|
| `verify:lesson-indexes` | `nursenest-core/package.json` → `nursenest-core/scripts/verify-normalized-lesson-indexes.mjs` | Marketing hub lesson index verification |
| `build:lesson-indexes` / `content:lesson-coverage` | `nursenest-core/scripts/build-normalized-lesson-indexes.mjs` | Generated indexes for build |
| Build hook | `nursenest-core/package.json` `build` → `scripts/run-lesson-indexes-for-build.mjs` | Indexes before `next build` |
| Loader / sync | `nursenest-core/src/lib/lessons/pathway-lesson-catalog-sync.ts`, `pathway-lesson-loader.ts` | Runtime catalog + generated index trust paths |

Internal blog ↔ lesson linking must respect real slugs (`blog-internal-lesson-links`, `blog-marketing-lesson-detail-path` in pre-publish validation).

---

## Country / exam route context

- **Pathway marketing URLs:** `nursenest-core/src/lib/marketing/marketing-entry-routes.ts` (`RN`, `PN`, `NP`, `ALLIED`, `HUB`) and `nursenest-core/src/lib/exam-pathways/build-exam-pathway-path.ts`.
- **Localized blog:** `nursenest-core/src/lib/i18n/global-regions.ts` / `REGION_CONFIG`, `nursenest-core/src/lib/i18n/marketing-locale-policy.ts` (`isCoreHostedNonDefaultLocale`).
- **Exam framing:** `nursenest-core/src/lib/blog/blog-public-seo-helpers.ts`, `nursenest-core/src/lib/blog/blog-study-cta.ts`.

---

## i18n for blog

- **Localized articles:** `nursenest-core/src/lib/blog/safe-localized-blog-queries.ts`; admin `nursenest-core/src/app/api/admin/blog/localized/*`.
- **Localized index copy:** `nursenest-core/src/lib/blog/blog-index-hero-copy.ts` — `localizedMarketingBlogIndexCopy`.
- **Robots / sitemap gating:** `nursenest-core/src/lib/i18n/language-readiness.ts` — `isLocaleSitemapIncluded`.

---

## Schema-ready metadata patterns (existing)

- **Article + FAQ JSON-LD:** `nursenest-core/src/components/seo/seo-json-ld.tsx` (`BlogPostingJsonLd`, `BlogFaqPageJsonLd`) on `blog/[slug]` and localized post page.
- **Breadcrumbs:** `BreadcrumbJsonLd` + `BreadcrumbTrail` on localized blog pages.
- **SEO meta builders:** `nursenest-core/src/lib/blog/blog-generate-seo.ts`, `blog-seo-localized.ts`, `safe-marketing-metadata.ts`.
- **Persisted SEO / schema hints:** `internalLinkPlan.seo` / `schemaSummary` in `blog-seo-automation.ts`; pre-publish checks (`faq_schema`, `schema_summary_json`, …) in `blog-pre-publish-validation.ts`.

---

## Internal linking targets — **existing helpers only**

| Concern | Existing helper / module |
|---------|---------------------------|
| Content-type route patterns (lessons, flashcards, OSCE, etc.) | `nursenest-core/src/lib/content-source-of-truth/content-registry.ts` |
| Canonical marketing entry URLs | `nursenest-core/src/lib/marketing/marketing-entry-routes.ts`, `buildExamPathwayPath` |
| Blog CTAs by exam + country | `nursenest-core/src/lib/blog/blog-study-cta.ts` — `marketingStudyHubsForBlogExam`, `blogPrimaryStudyCta` |
| Allowlisted internal paths + lesson rows | `nursenest-core/src/lib/blog/blog-internal-lesson-links.ts` — `isAllowedBlogInternalHref`, `lessonRowsToRelatedPaths`, `getBlogInternalLinkPathHintsForPrompt` |
| Study anchor strip (practice, CAT, flashcards) | `nursenest-core/src/lib/blog/blog-public-seo-helpers.ts` — `blogStudyAnchorTargets`, `blogStudyAnchorTargetsForLocalizedRegion`; UI: `nursenest-core/src/components/blog/blog-study-anchor-strip.tsx` |
| Region alignment | `alignLessonPathForAudienceCountry`, `equivalentExamHubUrlAfterRegionToggle` (same file as internal lesson links) |

**Note:** Labs, med calc, ECG, and OSCE surfaces are documented in `content-registry.ts` public patterns; blog prompts and allowlists prioritize pathway lessons, questions, `/tools/*`, `/practice-exams`, etc. The visible **BlogStudyAnchorStrip** is questions + adaptive CAT entry + flashcards — not a separate labs pipeline.

---

## Operational cron / background

- **Batch schedule + draft batch pump:** `nursenest-core/src/app/api/cron/blog-batch-schedule/route.ts` — `processDueBlogBatchScheduleItems`, `pumpBackgroundBlogDraftBatches`, `promoteScheduledBlogPosts`, `revalidateBlogPublishingSurfaces`.

---

## Related inventory reports

If `reports/longtail-patho-pharm-topic-inventory.md` or `reports/longtail-seo-blog-publishing-report.md` are added later, append **Integration constraints** (short): extend existing admin batch + publishing + validators per this plan — no parallel CMS/DB layer; see **Reuse map** above.
