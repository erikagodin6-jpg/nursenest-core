# Blog source-of-truth audit

## Canonical surface

- **Primary persistence**: Prisma `BlogPost` (or equivalent CMS-backed model) for published posts consumed by public `/blog` routes.
- **Marketing routes**: `/blog`, `/blog/[slug]`, tag pages — must read the same canonical store used in admin publish handlers.
- **Sitemap**: must list only **published**, indexable posts from the canonical source.

## Hidden / generated inventory

- Run `npm run content:report-hidden-blogs` to list markdown/json files under `src/content/blog` (non-canonical file sources).
- Merge candidates require human review for slug conflicts and duplicate titles.

## Gaps / follow-ups

- Wire `report-hidden-blog-posts.mjs` to Prisma when `DATABASE_URL` is available for DB-vs-filesystem diffing.
- Ensure admin blog generator writes drafts to canonical tables with explicit `draft` status.
