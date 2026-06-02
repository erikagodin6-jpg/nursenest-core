# Blog Query Audit

Generated: 2026-06-01

## Routes Audited

- `/blog`
- `/blog?page=*`
- `/blog/rn`
- `/nursing/[careerSlug]/blog`
- `/allied-health/[slug]/blog`
- Regional blog cluster pages

## Findings

The public blog index architecture had several scalable pieces already in place, including a safe DB wrapper, static fallback support, and a selected-field index shape. The high-risk issue was that public index routes still requested total counts and could trigger extra merge/hub queries that are not required to render a first-page article list.

## Before

Public blog list routes could execute:

- `findMany()` for visible posts.
- `count()` for total pages.
- Static supplement merge queries.
- Full live DB fetches for merge reconciliation.
- Additional hub-specific article fetches.

Those extra queries increase the chance of timeout during high traffic, cold starts, or DB latency.

## After

The blog index now uses a lightweight, bounded page query:

- Maximum rendered posts: 24.
- Maximum DB rows requested for no-count pages: 25.
- No article body fields.
- No markdown.
- No HTML.
- No content blocks.
- No embeddings.
- No author joins.
- No category joins.
- No tag joins.
- No per-request total count on `/blog`.

## Pagination Contract

`/blog` validates the requested page before querying:

- `page < 1`: rejected with 404.
- non-numeric page: rejected with 404.
- `page > 250`: rejected with 404.
- normal pages: `skip/take` pagination, max 24 rendered posts.

Shared loader protection also normalizes non-finite page and page-size values.

## Count Optimization

For public index routes, `includeTotal: false` prevents expensive `count()` queries. The loader infers a conservative total from the current page and an extra fetched row.

This avoids turning every anonymous page view into two database operations.

## Static Merge Policy

Static supplement merging on successful DB reads is now disabled by default for public index traffic. If a future recovery project needs to compare DB and static supplement content live, it must explicitly set:

```text
BLOG_INDEX_MERGE_STATIC_ON_DB_SUCCESS=1
```

That keeps the high-cost reconciliation path out of the normal request lifecycle.

## Error Handling

Public users now see:

```text
We're updating our article library. Please try again in a moment.
```

The UI no longer exposes Prisma, Turbopack, loader labels, timeout reasons, file paths, or stack traces.

Server diagnostics remain available through existing logging and the blog DB read attempt wrapper.

