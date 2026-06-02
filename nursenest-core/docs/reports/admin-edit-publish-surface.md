# Admin edit → publish → live public surface

This report maps **editable content types** to the **canonical storage** and **public loaders** enforced in production. It is maintained alongside `src/lib/admin/admin-edit-publish-surface-registry.ts`.

## Principles (non-negotiable)

- **Pathway lessons:** `PathwayLesson` + `PATCH /api/admin/pathway-lessons/[id]` is authoring source of truth (Option B). The legacy `ContentItem → PathwayLesson` sync is an **intentional no-op** (`sync-content-item-to-pathway-lesson.ts`).
- **Blogs:** `BlogPost` in Postgres; public routes use `getPublishedBlogPostBySlug` + `blogLiveWhere`; publish goes through `publishBlogPostCanonical` + `revalidateBlogPublishingSurfaces`.
- **Marketing copy:** staff-editable keys via `PATCH /api/admin/marketing-public-content`; compiled i18n shards for the rest.

## Machine-readable registry

- TypeScript: `src/lib/admin/admin-edit-publish-surface-registry.ts`
- Markdown table (stdout): `npm run audit:admin-edit-publish-surface`
- Optional file checks: `npm run audit:admin-edit-publish-surface:verify`

## Staff “Edit live page” affordance

Server component `StaffEditLivePageBanner` renders **only** when `getStaffSession()` succeeds. It is wired on:

- Public blog detail: `/blog/[slug]` → `/admin/blog?id=…`
- Marketing pathway lesson detail → `/admin/pathway-lessons/edit?pathwayId=…&slug=…`
- Learner pathway lesson → same stable pathway editor URL
- Learner `ContentItem` lesson → `/admin/lessons/[id]`

Public users and crawlers receive **no HTML** for the banner (no SEO leakage).

## Consistency tests

```bash
npm run test:admin-edit-publish-surface
```

## Related commands

```bash
npm run typecheck
npm run validate:marketing-production-surface
npm run test:internal-links-audit
npm run audit:paywall-security
```
