# Deployment Blocker Resolution

Generated: 2026-06-01T02:30:00Z

## Blocker

Production build failed with:

```text
Module not found: @/lib/seo/sitemap-response-cache
```

Affected localized sitemap routes:

- `sitemap-ar.xml`
- `sitemap-de.xml`
- `sitemap-hi.xml`
- `sitemap-it.xml`
- `sitemap-jp.xml`
- `sitemap-ko.xml`
- `sitemap-pt.xml`
- `sitemap-tl.xml`
- `sitemap-zh.xml`
- `sitemap-zh-tw.xml`

## Root Cause

The localized sitemap route handlers imported `etagForXml` and `xmlResponseHeaders` from `@/lib/seo/sitemap-response-cache`, but that module did not exist.

The offline sitemap segment validator also listed localized sitemap children in the sitemap index without route getters for those children, so validation failed with `missing_route_getter` after the missing module was restored.

## Fixes Applied

1. Added `src/lib/seo/sitemap-response-cache.ts`.
   - `etagForXml(xml)` delegates to the existing public response ETag helper.
   - `xmlResponseHeaders(etag)` reuses the shared sitemap XML cache headers and adds `ETag`.

2. Added localized route getters in `src/lib/seo/sitemap-segment-validator.ts`.
   - `sitemap-en.xml`
   - `sitemap-fr.xml`
   - `sitemap-es.xml`
   - `sitemap-hi.xml`
   - `sitemap-pt.xml`
   - `sitemap-ar.xml`
   - `sitemap-de.xml`
   - `sitemap-jp.xml`
   - `sitemap-ko.xml`
   - `sitemap-zh.xml`
   - `sitemap-zh-tw.xml`
   - `sitemap-it.xml`
   - `sitemap-tl.xml`

3. Corrected `sitemap-en.xml` scope.
   - The English language sitemap had been duplicating core/blog/allied URLs.
   - It now emits only the canonical English apex, leaving core/blog/allied/pathway ownership to their dedicated child sitemaps.

## Validation

Command:

```bash
env NN_APPLY_NEXT_BUILD_HEAP_LIMIT=1 npm run build:production
```

Result:

```text
[sitemap:validate] OK
[build:production] OK
```

The build required the repo's heap guard locally. Without it, the Next compile step was killed by `SIGKILL`, consistent with the build script's OOM warning. With the heap guard enabled, content prep, sitemap validation, Next compile, standalone static copy, standalone artifact verification, and dist verification all completed.

## Verdict

Deployment blocker resolved locally. The fixed build is ready to deploy.

