# Homepage Runtime Isolation

Generated: 2026-06-01

## Finding

The homepage currently renders through the shared marketing layout. During production crawls, logs showed the marketing layout loading thousands of messages repeatedly:

```text
marketing layout after messages {"locale":"en","messageCount":8937}
```

The homepage was not failing because of blog queries or sitemap generation. `/blog` and sitemap routes returned 200 and were cache-backed. The homepage risk came from shared public route rendering pressure, especially repeated marketing i18n shard work.

## Isolation Applied

Updated `src/lib/marketing-i18n/load-marketing-message-shards.ts`.

Changes:

- Added an in-process cache for individual shard reads.
- Added an in-process cache for merged locale bundles.
- Cached empty shard results for missing/invalid files to avoid repeated filesystem misses.
- Preserved fallback behavior and response shape.

This removes repeated synchronous filesystem reads and JSON parsing from public marketing route renders after the first request in a process.

## Why This Is Safe

- No route behavior changed.
- No copy changed.
- No locale fallback changed.
- No cache persists across deploys or processes.
- If a shard is missing, the existing empty fallback behavior remains.

## Current Production Probe

The live homepage returned:

```text
/ status=200 time=0.656s x-do-orig-status=200
```

## Remaining Risk

This branch has not yet been deployed, so the caching improvement has not been validated under a full 7,918 URL production crawl.

