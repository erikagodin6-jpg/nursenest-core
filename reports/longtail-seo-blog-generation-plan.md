# Long-tail nursing pathophysiology / pharmacology SEO blog — generation plan

**Scope:** Architecture audit and rollout plan for scaling toward ~300 long-form SEO posts.
**This document does not publish content** and assumes editorial + clinical QA before production.

---

## Truthpack note

The path \`.vibecheck/truthpack/\` was **not present** in this workspace clone (no \`ui-pages.json\`, \`routes.json\`, or \`copy.json\` to skim). Route and naming references below come from **code inspection** under \`nursenest-core/\`.

---

## Current stack summary

| Layer | Implementation |
|--------|----------------|
| **Primary store** | PostgreSQL via Prisma — \`BlogPost\` and related models in \`nursenest-core/prisma/schema.prisma\` |
| **Static fallback** | Bundled corpus \`nursenest-core/src/content/blog-static-posts.ts\` → \`STATIC_BLOG_POSTS\`; loaded through \`src/lib/blog/static-blog-posts.ts\` when DB is skipped or empty |
| **Public rendering** | Next.js App Router under \`src/app/(marketing)/(default)/\` — global \`/blog\`, RN hub \`/blog/rn\`, nursing career hubs \`/nursing/{rn|pn|np}/blog\`, allied \`/allied-health/[slug]/blog\`, localized exam tree \`src/app/(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/\` |
| **Admin / generation** | \`src/app/(admin)/admin/blog/*\` — control panel, library, campaigns, batch schedules, \`BlogArticleGenerationJob\`, etc. |
| **SEO automation** | \`src/lib/blog/blog-seo-automation.ts\`, \`blog-auto-link-html.ts\`, related reading + lesson tier filters |

---

## Prisma models (blog-related)

**Path:** \`nursenest-core/prisma/schema.prisma\`

- **\`BlogPost\`** — unique \`slug\`, HTML body, tags, category, \`postStatus\`, \`publishAt\`, \`exam\`, \`careerSlug\`, locale/translation fields, SEO fields, **\`relatedLessonPaths\`**, **\`relatedQuestionIds\`**, **\`relatedTools\`**, \`internalLinkPlan\`, workflow + review metadata.
- **\`BlogCampaign\`**, **\`BlogCampaignItem\`**, **\`BlogBatchSchedule\`**, **\`BlogBatchScheduleItem\`**, **\`BlogDraftGenerationBatch\`**, **\`BlogDraftGenerationBatchItem\`**, **\`BlogArticleGenerationJob\`**
- **Localized blog** models (see schema) + \`sitemap-localized-blog-xml.ts\`

---

## Marketing / blog routes (high level)

| URL pattern | Code entry |
|-------------|------------|
| \`/blog\` | \`(marketing)/(default)/blog/page.tsx\` |
| \`/blog/[slug]\` | \`blog/[slug]/page.tsx\` |
| \`/blog/tag/[tag]\`, \`/blog/category/[category]\` | tag/category pages |
| \`/blog/rn\`, \`/blog/rn/[slug]\` | RN scoped hub |
| \`/nursing/{rn|pn|np}/blog\` | \`nursing/[careerSlug]/blog/...\` (\`NURSING_SCOPED_CAREER_SLUGS\`) |
| Allied blog | \`allied-health/[slug]/blog/...\` |
| Canonical nav | \`canonical-destinations.ts\` → \`blog: "/blog"\` |

**Sanity / external CMS:** Not identified for blog; content is Prisma + bundled static TS.

---

## Publishing flow (dev vs prod)

1. Drafts created in admin / jobs; visibility gated by \`blog-visibility\` / \`blogLiveWhere\`.
2. Public reads via \`safe-blog-queries.ts\` — merges DB + **static corpus** when DB skipped or timeouts (see \`MARKETING_BLOG_SKIP_DB_FOR_BUILD\`, \`NEXT_PHASE\` production build).
3. **Cron / revalidate:** \`blog-revalidate-publishing.ts\`, \`/api/cron/blog-publish\` (referenced in codebase) refresh listing + sitemap-related caches.

---

## Sitemap, robots, metadata, canonical

- **\`/sitemap.xml\`:** \`src/app/sitemap.xml/route.ts\` merges core URLs + \`sitemap-blog-xml.ts\` (capped blog URLs, merged slug rows from \`safe-blog-queries.ts\`).
- **Robots:** \`src/app/robots.txt/route.ts\` — static; \`Sitemap:\` lines; disallow \`/app/\`, \`/admin/\`, \`/api/\`, etc.
- **Metadata / canonical:** \`generateMetadata\` + \`absoluteUrl\` on blog pages; article schema + breadcrumbs via \`blog-seo-automation.ts\` and \`pathway-breadcrumbs.ts\`.

---

## Internal linking helpers

- **Curated:** \`relatedLessonPaths\` validated by \`isAllowedBlogInternalHref\` (\`blog-internal-lesson-links\`).
- **Auto phrases:** \`buildAutoLinkRules\` → lessons/questions/CAT/flashcards hubs from \`marketingStudyHubsForBlogExam\`.
- **Related modules:** \`BlogRelatedReadingSection\`, \`filterMarketingLessonPathsForBlogExam\`.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Clinical accuracy | Editorial + clinician QA; citations where \`requiresReferences\` |
| Slug collision | Enforce uniqueness pre-insert; DB \`@unique\` on \`slug\` |
| Wrong hub for PN/NP | Set \`careerSlug\`; use \`expectedGeneratedBlogPaths\` |
| Build vs prod URL counts | Know static fallback; verify on deployed env |
| Broken internal links | Staging crawl + lesson index registry |

---

## Phased rollout

1. **Inventory** — 300 topics, clusters, tiers (see \`longtail-patho-pharm-topic-inventory.md\`).
2. **Content pipeline** — Drafts only; populate \`internalLinkPlan\`, \`relatedLessonPaths\`.
3. **Review** — **300 posts require editorial/clinical QA**; no bulk unreviewed publish.
4. **Staging** — Link checker, sitemap sample, schema validation.
5. **Production** — Staggered publishes; **no broken links policy** on curated hrefs.

---

## SEO / schema checklist (per post)

Unique title/meta; canonical; Article JSON-LD; verified internal links; alt text; \`exam\`/\`careerSlug\`/\`countryTarget\` aligned; index only when live.

---

## Verifying internal links

- Code registry: \`canonical-destinations.ts\`, exam pathway builders, \`expectedGeneratedBlogPaths\`.
- Lesson indexes: \`npm run build:lesson-indexes\` / \`npm run verify:lesson-indexes\` (see \`package.json\`).
- Automate: export \`BlogPost.relatedLessonPaths\` and HTTP-check on staging.

---

## Mandatory policy statement

**~300 long-tail pathophysiology/pharmacology posts require editorial and clinical QA before production.** Bulk publishing unreviewed medical content is out of scope. **No broken links policy** applies to curated internal links—verify against a lesson/route registry on staging before go-live.
