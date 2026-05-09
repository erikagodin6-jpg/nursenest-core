# Admin blog queue audit

**Generated:** 2026-05-09 (workspace `main` after `efe9e9560`).  
**Database:** `DATABASE_URL` was available in the agent environment; Prisma queries succeeded against the configured Postgres host (masked bootstrap logs showed a DigitalOcean-managed URL — treat as **production or production-equivalent** data).

## Storage model

| Layer | Path / artifact |
|--------|------------------|
| ORM model | `BlogPost` in `nursenest-core/prisma/schema.prisma` (table **`BlogPost`**) |
| Primary visibility enum | `BlogPostStatus`: `DRAFT`, `SCHEDULED`, `PUBLISHED`, `NEEDS_REVIEW`, `APPROVED`, `FAILED` |
| Workflow | `BlogWorkflowStatus` on same model (must align with `blogLiveWhere` / `blogPostIsLive` — see `nursenest-core/src/lib/blog/blog-visibility.ts`) |
| Admin UI | `nursenest-core/src/app/(admin)/admin/blog/*` |
| Admin APIs | `nursenest-core/src/app/api/admin/blog/**` (notably `[id]/route.ts` for `publish_now`, `schedule`, `approve`, etc.) |
| Canonical publish | `publishBlogPostCanonical` — `nursenest-core/src/lib/blog/publish-blog-post-canonical.ts` |
| ISR after publish | `revalidateBlogPublishingSurfaces` — `nursenest-core/src/lib/blog/blog-revalidate-publishing.ts` |

## Queue counts (postStatus)

Snapshot **after** marking the Gemini verify stub **FAILED**:

| postStatus | Count |
|------------|------:|
| DRAFT | 3 |
| NEEDS_REVIEW | 142 |
| FAILED | 1 |
| SCHEDULED | 0 |
| APPROVED | 0 |
| PUBLISHED | 27 |

There is **no separate “queued” table** — the editorial queue is **`BlogPost` rows** not yet live under `blogLiveWhere`. **`SCHEDULED`/`APPROVED` were empty** in this snapshot.

## Pre-publish gate (strict)

All **146** rows in `{ DRAFT, NEEDS_REVIEW, APPROVED, SCHEDULED, FAILED }` were evaluated with **`validateBlogPrePublish`** (`nursenest-core/src/lib/blog/blog-pre-publish-validation.ts`) using `blogPrePublishValidationSelect`.

**Result:** **`okToPublish: 0`** for every queued row.

Aggregated **blocking check ids** (sums exceed row count because each post can fail multiple checks):

| Check id | Approx. occurrences |
|----------|--------------------:|
| `blog_publish_quality_gate` | 477 |
| `blog_content_quality_gate` | 323 |
| `content_nursing_implications` | 146 |
| `content_clinical_mechanism` | 93 |
| `internal_link_recommendations` | 51 |
| `educational_stub_language` | 50 |
| `faq_content_when_required` | 50 |
| `body_word_count` | 44 |
| `internal_links` | 26 |
| `taxonomy_classifier` | 9 |

### Cohort summary

| Cohort | Approx. rows | Dominant blockers | Repair action |
|--------|-------------:|-------------------|----------------|
| `lt-reg-cs-*` | 50 | stubs, FAQ required, internal-link plan, quality gates | Clinician review + regenerate/repair via admin pipelines |
| `newgrad-nursing-*` | 85 | nursing implications, clinical mechanism, publish/content quality (some `body_word_count`) | Expand substantive sections; meet ~1500-word target (`BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH` in `blog-word-count.ts`) |
| Other NEEDS_REVIEW | ~7 | word count, internal links, taxonomy, gates | Expand body; fix `internalLinkPlan` / lesson paths in studio |
| DRAFT | 3 | thin body, taxonomy/internal links, gates | Same — **do not publish** until gates clear |
| Former stub → **FAILED** | 1 | N/A (removed from draft queue) | Optional cleanup — see final report |

## Duplicate / collision notes

- **Near-duplicate topic:** `burn-injuries-depth-classification-fluid-resuscitation-and-wound-care` (NEEDS_REVIEW) vs `burn-injuries-depth-classification-fluid-resuscitation-and-wound-care-1` (DRAFT) — distinct slugs; resolve editorially before publishing either.

## Per-post detail export

- `reports/admin-blog-queue-detail.tsv` — ids, slugs, titles, status, blocking ids, message snippets.

Regenerate (from `nursenest-core/` app directory):

```bash
npx tsx scripts/blog/export-admin-blog-queue-tsv.mts
```

## Related validation artifacts

- `nursenest-core/scripts/blog/verify-blog-publication-readiness.mts` → `reports/blog-publication-readiness.md`
- SEO merge: `nursenest-core/src/lib/seo/sitemap-blog-xml.ts`, `nursenest-core/src/lib/seo/sitemap-localized-blog-xml.ts`, `nursenest-core/src/app/sitemap.xml/route.ts`
