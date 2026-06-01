# Blog Timeout Root Cause

Generated: 2026-06-01

## Incident

The public `/blog` route could render:

```text
Blog list could not load
Details: blog_posts_page db_timeout
```

That failure blocked the blog hub and exposed internal loader diagnostics to public visitors.

## Root Cause

The route `src/app/(marketing)/(default)/blog/page.tsx` loaded the blog list through `getPublishedBlogPostsPage()`. The timeout label came from `src/lib/blog/safe-blog-queries.ts`:

- `loadBlogIndexPageFromDb(..., "blog_posts_page")`
- `blogPublicDbReadAttempt()` returning `database_timeout`
- `blogIndexListLoadFromAttempts()` composing public `reasonFailed` values such as `blog_posts_page:db_timeout:database_timeout`

The hot path was heavier than a public index page should be. It could execute:

1. A paged `findMany()` query.
2. A `count()` query for the same public filter.
3. A static supplement merge path.
4. A live DB slug overlap query against a large static URL set.
5. A full live DB fetch up to the merge cap when static supplement merging was enabled.
6. A separate pathophysiology hub query from the same `/blog` request.

On a large article corpus this created avoidable DB pressure and made the route vulnerable to Prisma request timeouts.

## Failing Query Shape

The public list should only need index-card data. The database query now remains bounded to selected fields:

```ts
select: {
  slug: true,
  title: true,
  excerpt: true,
  category: true,
  coverImage: true,
  createdAt: true,
  updatedAt: true,
  publishAt: true,
  postStatus: true,
}
```

The approximate SQL shape is:

```sql
SELECT slug, title, excerpt, category, coverImage, createdAt, updatedAt, publishAt, postStatus
FROM "BlogPost"
WHERE public publication predicates
ORDER BY updatedAt DESC, createdAt DESC, slug ASC
OFFSET $pageOffset
LIMIT 25;
```

The route renders 24 posts and fetches one extra row only to infer whether another page exists.

## Fix Applied

- Reduced public blog page size from 50 to 24 in `src/lib/blog/safe-blog-queries.ts`.
- Added bounded `page` and `pageSize` normalization in `getPublishedBlogPostsPage()`.
- Changed `/blog` to call `getPublishedBlogPostsPage(..., { includeTotal: false })`.
- Removed per-request total counts from the `/blog` hot path.
- Disabled large static/full-corpus merge on DB success by default. The old path is now opt-in through `BLOG_INDEX_MERGE_STATIC_ON_DB_SUCCESS=1`.
- Removed the pathophysiology hub secondary query from the `/blog` hot path.
- Added public route validation for abusive page numbers.
- Replaced public diagnostic leakage with neutral end-user copy.
- Added server-side timing metadata to blog DB attempts.

## Indexes Added

Migration:

```text
prisma/migrations/20260709120000_blog_public_index_performance/migration.sql
```

Indexes:

- `BlogPost_public_status_workflow_publish_sort_idx`
- `BlogPost_public_locale_status_workflow_publish_sort_idx`
- `BlogPost_public_career_locale_status_workflow_sort_idx`
- `BlogPost_public_category_status_workflow_sort_idx`
- `BlogPost_tags_gin_idx`

The first four are mirrored in `prisma/schema.prisma`; the GIN tag index remains SQL-only.

## Production Readiness Verdict

The request path is now bounded for a 5,000+ article corpus: no body fields, no markdown/html blocks, no author/tag/category joins, no total count on `/blog`, and no full-corpus merge unless explicitly re-enabled.

