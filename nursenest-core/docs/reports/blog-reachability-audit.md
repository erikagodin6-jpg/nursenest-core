# Blog Reachability Audit
Generated: 2026-06-01

## Data Source Note
Database unavailable (placeholder credentials). All analysis uses static file corpus only. Route and query behavior is inferred from reading the actual source code:
- Blog post page: `src/app/(marketing)/(default)/blog/[slug]/page.tsx`
- Sitemap logic: `src/lib/seo/sitemap-blog-xml.ts` → `src/lib/blog/safe-blog-queries.ts`
- Blog index query: `getPublishedBlogPostsPage` in `src/lib/blog/safe-blog-queries.ts`
- Static loader: `src/lib/blog/blog-static-longtail-load.ts` (uses frontmatter `slug:` field)
- Live criteria: `blogLiveWhere` in `src/lib/blog/blog-visibility.ts`

---

## Summary
| Check | Passing | Failing |
|-------|---------|---------|
| Route match (slug accessible at /blog/{slug}) | 4,598 | 0 |
| Sitemap inclusion | 4,598 | 0 |
| Index page inclusion | 4,598 | 0 |
| Canonical tag present | 4,598 | 0 |
| JSON-LD (structured data) present | 4,598 | 0 |
| noIndex gate (noIndex=false or absent) | 4,598 | 0 |

**All static posts pass all 6 reachability checks.** No posts are blocked from indexing, sitemap, or route access.

---

## How Each Check Works

### Route Match
The route `/blog/[slug]` uses `dynamicParams = true`, so any slug that resolves through the data layer is accessible. The static longtail loader (`getBlogStaticLongtailRecord`) finds posts by their **frontmatter `slug:` field**, not by filename. All 4,595 longtail posts have a valid frontmatter slug that the loader can resolve.

### Sitemap
`listBlogSitemapEntriesSafe()` → `getMergedBlogSitemapSlugRows()` → falls back to `buildSupplementBlogIndexRowsExcludingLiveSlugs()` → includes all static longtail records where `isBlogStaticLongtailRecordPublished(record)` returns true. Since no longtail file has `draft: true` and all `publishedAt` values are in the past (max: 2026-05-27), all 4,595 pass. The 3 static TS posts are also included.

### Index Page
`getPublishedBlogPostsPage()` uses the same fallback chain. Same criteria as sitemap.

### Canonical Tag
`page.tsx` always calls `resolvePublicCanonicalUrl(slug, seo)` and sets `alternates: { canonical }` in Next.js metadata. All posts pass.

### JSON-LD (Structured Data)
`page.tsx` unconditionally renders `<BlogPostingJsonLd>` (lines 195–221). Additionally, `<BlogFaqPageJsonLd>` is conditionally emitted when `faqItems.length >= 2`. All posts pass the BlogPosting check. FAQ schema is post-specific.

### noIndex Gate
The `BlogPost` Prisma schema has no `noIndex` column. The static `StaticBlogPostRecord` type has no `noIndex` field. The `BlogStaticLongtailRecord` type has no `noIndex` field. No mechanism exists to programmatically set noindex at the post level in the static corpus. All posts pass.

---

## Important Finding: Slug Mismatch in Pipeline Pointer Files

55 files in `src/content/blog-static-longtail/` have a **filename-frontmatter slug mismatch**:

- **Filename slug**: `something-long-title-pipeline` (includes `-pipeline` suffix)
- **Frontmatter slug**: `something-long-title` (without `-pipeline`)

The static loader uses the **frontmatter slug**. This means:
- Visiting `/blog/something-long-title-pipeline` → **404** (not found)
- Visiting `/blog/something-long-title` → **serves the pipeline stub** (minimal body content)

These 55 files are correctly loaded under their frontmatter slug but the filename is misleading for developers. The `-pipeline` suffix in the filename is a development naming convention, not part of the public URL.

### Pipeline Slug Mismatch Examples
| Filename (inaccessible path) | Frontmatter Slug (actual URL) |
|-----------------------------|-------------------------------|
| newgrad-nursing-missed-assessment-on-psychiatry-a-practical-pipeline | newgrad-nursing-missed-assessment-on-psychiatry-a-practical |
| nclex-patho-abg-post-arrest-pipeline | nclex-patho-abg-post-arrest |
| nclex-patho-ards-prone-pipeline | nclex-patho-ards-prone |
| nclex-patho-qsofa-sirs-pipeline | nclex-patho-qsofa-sirs |
| nclex-patho-sglt2-hf-pipeline | nclex-patho-sglt2-hf |
| nclex-patho-siadh-csw-pipeline | nclex-patho-siadh-csw |
| newgrad-nursing-unsafe-staffing-on-icu-a-practical-checklist-pipeline | newgrad-nursing-unsafe-staffing-on-icu-a-practical-checklist |
| newgrad-nursing-handling-charting-backlog-on-pediatrics-as-a-pipeline | newgrad-nursing-handling-charting-backlog-on-pediatrics-as-a |
| newgrad-nursing-new-grads-on-ltc-staying-organized-around-pr-pipeline | newgrad-nursing-new-grads-on-ltc-staying-organized-around-pr |
| newgrad-nursing-after-preceptor-conflict-on-icu-rebuilding-m-pipeline | newgrad-nursing-after-preceptor-conflict-on-icu-rebuilding-m |

**Note:** The 5 `nclex-patho-*-pipeline` files and the `newgrad-nursing-*-pipeline` files are all pipeline stubs — placeholder files pointing to external HTML content that is not present in the repository. Even though the frontmatter slug resolves correctly, the body content is just a stub ("Production HTML for this topic lives in `data/blog-content/...`").

---

## Per-Article Reachability (Representative Sample)

All 4,598 static posts share the same reachability profile. The table below shows representative posts including all failure categories:

| Slug | Route | Sitemap | Index | Canonical | JSON-LD | Not-noIndex | Result |
|------|-------|---------|-------|-----------|---------|-------------|--------|
| clinical-judgment-on-exam-day | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| pharmacology-without-memorization-chaos | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| lab-trends-and-acute-kidney-injury | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| abg-interpretation-advanced-review-np-certification | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| fr-intl-hospital-delirium-nonpharm-intl-topic-040 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| nclex-patho-abg-post-arrest (pipeline stub) | ✅* | ✅* | ✅* | ✅ | ✅ | ✅ | PASS* |
| newgrad-nursing-missed-assessment-on-psychiatry-a-practical (pipeline stub) | ✅* | ✅* | ✅* | ✅ | ✅ | ✅ | PASS* |
| rex-pn-canadian-pn-shift-organization-rpn-rex-pn-clinical-judgment-breakdown | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| es-intl-sepsis-early-care-intl-topic-057 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |
| uk-acp-rapid-tranquilisation-governance-nursing-observations-post-administration-study-themes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | PASS |

*Pipeline stubs pass reachability checks but serve thin/stub body content. Technically accessible but SEO-harmful.

---

## Failing Articles
**No articles fail any reachability check** based on static analysis.

However, the following categories represent **functional failures** that pass technical checks but serve poor content:

### Pipeline Stubs (50 posts — technically reachable, body is placeholder text)
These posts resolve at `/blog/{frontmatter-slug}` but the body is:
> "Production HTML for this topic lives in `data/blog-content/newgrad-prod-batch-0X/body-XX.html.html`."

The canonical body HTML file path references files that do not exist in this repository. These posts are technically indexed and reachable but serve no educational value and may harm SEO.

Top 10 pipeline stubs:
- `/blog/newgrad-nursing-missed-assessment-on-psychiatry-a-practical`
- `/blog/nclex-patho-abg-post-arrest`
- `/blog/nclex-patho-ards-prone`
- `/blog/nclex-patho-qsofa-sirs`
- `/blog/nclex-patho-sglt2-hf`
- `/blog/nclex-patho-siadh-csw`
- `/blog/nclex-prioritization-questions-rationales`
- `/blog/newgrad-nursing-unsafe-staffing-on-icu-a-practical-checklist`
- `/blog/newgrad-nursing-handling-charting-backlog-on-pediatrics-as-a`
- `/blog/newgrad-nursing-new-grads-on-ltc-staying-organized-around-pr`

**Recommended action:** Remove these from the static corpus or mark as `draft: true` until the production HTML body is available. Alternatively, add canonical redirect to the production version of these articles.

### Thin Content (288 non-stub posts <300 words)
Technically reachable and indexed, but content may not satisfy quality thresholds:
- Primarily `ja-intl-*` and `zh-hans-intl-*` posts at ~224-231 words
- Some English posts (RT study guides, electrolyte exam posts) at 168-190 words

---

## DB-Specific Reachability Notes

When the database is available, additional reachability criteria apply:
- `postStatus = PUBLISHED` AND `workflowStatus = PUBLISHED` AND `publishAt <= now` → live
- `postStatus = APPROVED` AND workflow not failed → live
- `postStatus = SCHEDULED` AND `publishAt <= now` AND workflow released → live
- `postStatus = DRAFT`, `NEEDS_REVIEW`, `FAILED` → never public

Without DB access, these criteria cannot be verified for any posts stored in the database.
