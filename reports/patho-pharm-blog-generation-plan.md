# Pathophysiology & pharmacology blog — generation plan

**Scope:** Long-tail SEO content for nursing students (pathophys, pharm, labs, med safety, ECG-adjacent reasoning) aligned with existing `BlogPost` infrastructure.  
**Truthpack:** `.vibecheck/truthpack/` (`ui-pages.json`, `routes.json`, `product.json`, `copy.json`) is **not present in this workspace clone** (consistent with `nursenest-core/docs/visual-qa.md` and internal QA reports). Tier names, prices, and canonical marketing strings must be reconciled when truthpack is available; this plan uses **in-repo routes and schema only**.

---

## 1. Data model & tables (Prisma)

Primary table: **`BlogPost`** (`blog_posts`) in `nursenest-core/prisma/schema.prisma`.

- **Identity & content:** `slug` (unique), `title`, `excerpt`, `body`, `tags[]`, `category`, `coverImage`, locale fields (`locale`, `translationGroupId`, `canonicalPostId`, etc.).
- **Publishing:** `postStatus` (`DRAFT` | `SCHEDULED` | `PUBLISHED`), `publishAt`, `workflowStatus`, `adminPublishLog`.
- **SEO & IA:** `seoTitle`, `seoDescription`, `internalLinkPlan` (JSON), `targetKeyword`, `keywordCluster`, `countryTarget`, `intent`, `exam`, `careerSlug`.
- **Study integration:** `relatedLessonPaths[]`, `relatedQuestionIds[]`, `relatedTools[]`.
- **Automation satellites:** `BlogCampaign` / `BlogCampaignItem`, `BlogBatchSchedule` / `BlogBatchScheduleItem`, `BlogDraftGenerationBatch` / `BlogDraftGenerationBatchItem`, `BlogArticleGenerationJob`, `LocalizedBlogArticle`, `ContentAutomationLog`.

**Slug uniqueness:** DB `@unique` on `slug`. Bulk generation must avoid collisions with existing rows and the static corpus (`clinical-judgment-on-exam-day`, `pharmacology-without-memorization-chaos`, `lab-trends-and-acute-kidney-injury` in `nursenest-core/src/content/blog-static-posts.ts`).

---

## 2. Canonical publish flow

1. **Create draft** — Admin UI under `nursenest-core/src/app/(admin)/admin/blog/*` or `src/app/api/admin/blog/*` (draft batch, control panel, campaigns, Gemini draft).
2. **Generate / edit body** — AI pipelines, `BlogArticleGenerationJob` stage machine, regenerate/repair routes.
3. **Pre-publish** — `api/admin/blog/[id]/pre-publish-validation`, SEO regenerate, image workflows as configured.
4. **Go live** — `PUBLISHED` + `publishAt` per `blogLiveWhere` in `nursenest-core/src/lib/blog/blog-visibility.ts`.
5. **Cron promotion** — `POST nursenest-core/src/app/api/blog/publish/route.ts` → `promoteScheduledBlogPosts()` with `Authorization: Bearer $CRON_SECRET`; `revalidateBlogPublishingSurfaces`.

**No lorem in production tables:** keep drafts in `DRAFT` until clinically real HTML exists.

---

## 3. Public routing: DB vs static fallback

- **Article route:** `nursenest-core/src/app/(marketing)/(default)/blog/[slug]/page.tsx` uses `getPublishedBlogPostBySlug` / `getBlogPostMetaBySlug` from `nursenest-core/src/lib/blog/safe-blog-queries.ts`.
- **Fallback:** If DB unavailable / build skip / **no live posts**, bundled `STATIC_BLOG_POSTS` serves index + slug pages (`static-blog-posts.ts`, `resolveBlogStaticFallbackProbe`).

**Other surfaces:** `/blog/rn`, tag/category hubs, `nursing/[careerSlug]/blog`, `allied-health/.../blog`, localized ` [locale]/[slug]/[examCode]/[exam]/blog/...`.

---

## 4. Sitemap & SEO

- `nursenest-core/src/lib/seo/sitemap-blog-xml.ts` — merged DB + static slug rows, caps, `/blog` + RN hub.
- `sitemap-localized-blog-xml.ts` for localized articles.
- Metadata: `safeGenerateMetadata`, canonicals from `blog-seo-automation.ts` + `internalLinkPlan`.
- JSON-LD: `BlogPostingJsonLd`, optional FAQ schema; breadcrumbs `BreadcrumbBar`.

---

## 5. Breadcrumbs & internal linking

- Crumbs from SEO package; body via `applyAutoLinksToHtml`; lesson links filtered by exam tier (`filterMarketingLessonPathsForBlogExam`).
- Inventory column **Internal linking targets** lists only verified paths (see publishing report).

---

## 6. Bulk long-tail (300+) approach

| Mechanism | Limit / note |
|-----------|----------------|
| `BlogDraftGenerationBatch` | **Max 150 topics** per create (`DRAFT_BATCH_MAX_TOPICS`); process **3 items** per POST (`DRAFT_BATCH_MAX_ITEMS_PER_PROCESS`). Split 300 into **2 batches minimum**. |
| `BlogBatchSchedule` | Staggered slots + runner. |
| `BlogCampaign` | Planned ordinals + templates. |

**Recommended:** Use `reports/patho-pharm-longtail-topic-inventory.md` as canonical topic list → paste **Title** lines into Admin draft batch (two batches) → generate with background processing if enabled → editorial QA → publish/schedule → optional `/api/blog/publish` cron.

**Dev helper:** `nursenest-core/scripts/blog/patho-pharm-inventory-topics.mjs` extracts titles for stdout paste (no DB).

---

## 7. Risks

Duplicate slugs; thin content; internal 404s; DB/static parity confusion in CI (`MARKETING_BLOG_SKIP_DB_FOR_BUILD`); learner route regressions if blog code leaks into app shell (avoid).

---

*Verified By VibeCheck ✅* (truthpack absent in clone — documented; no invented tiers or prices.)
