# Public Route Cache Conversion Plan

Date: 2026-06-01

## Executive Summary

The public marketing route tree is mostly compatible with static or ISR delivery, but several high-value route families still perform database-backed content assembly on cache misses. The priority is not broad UI work; it is moving public content into static snapshots, ISR artifacts, and request-independent cached loaders so crawlers and anonymous visitors can be served without waking Prisma whenever possible.

Primary finding: most public content should be `static` or `ISR`; only auth, checkout, reset, verification, diagnostics, and truly request-specific routes should remain `force-dynamic`.

Expected platform-wide effect after the recommended conversions:

| Metric | Current Observed Risk | Target After Conversion | Estimated Reduction |
| --- | ---: | ---: | ---: |
| Public-route DB reads during crawl | High on ISR misses and dynamic localized routes | Near-zero on cache hits; bounded on misses | 70-95% |
| Expensive public route response time | 6-10s samples on homepage/localized/lesson cold paths | <500ms cache hit; <2s ISR miss | 60-95% |
| Per-request memory allocation | High where full page data/large payloads are assembled | Snapshot reads and slim payloads | 30-60% |
| Crawl-origin pressure | Route misses can converge on Prisma and content loaders | CDN/ISR/static response first | 70-90% |

## Evidence Reviewed

- `src/app/(marketing)` contains 318 `page.tsx` / `layout.tsx` files.
- Route config scan across 322 public page/layout/route files:
  - `dynamic = "force-dynamic"`: 17
  - `dynamic = "force-static"`: 3
  - no explicit dynamic mode: 302
  - `revalidate = 180`: 1
  - `revalidate = 300`: 2
  - `revalidate = 600`: 6
  - `revalidate = 1800`: 10
  - `revalidate = 3600`: 81
  - `revalidate = 86400`: 138
  - `revalidate = false`: 2
- Existing cached loaders:
  - `src/lib/marketing/public-home-stats.ts`
  - `src/lib/marketing/public-flashcard-tags.ts`
  - `src/lib/marketing/load-marketing-public-content-overrides.ts`
  - `src/lib/marketing/feature-inventory-metrics.ts`
  - `src/lib/seo/load-programmatic-question-topic-page.ts`
- DB-backed public loaders requiring conversion or snapshotting:
  - `src/lib/blog/safe-blog-queries.ts`
  - `src/lib/blog/safe-localized-blog-queries.ts`
  - `src/lib/seo/public-flashcard-landing.ts`
  - `src/lib/seo/load-programmatic-question-topic-page.ts`
  - `src/lib/seo/content-backed-study-resource-hub.ts`
  - `src/lib/seo/internal-links.ts`
  - `src/lib/marketing/allied-pathway-hub-overview.ts`
  - `src/lib/marketing/public-home-stats.ts`

Route-cost samples from the current production investigation:

| Route | Status | Time | Payload | Notes |
| --- | ---: | ---: | ---: | --- |
| `/` | 200 | 6.44s | 0.89MB | Homepage should be static shell first. |
| `/fr` | 200 | 6.80s | 3.21MB | Locale homepage is currently `force-dynamic`. |
| `/canada/np/cnple/lessons/antibiotic-selection-resp-np` | 200 | 9.74s | 3.22MB | Lesson pages need DB-free content snapshots and payload slimming. |
| `/blog` | 200 in direct probe | 126ms median in successful crawl rows | 1.69MB | Blog list has ISR but DB-backed list fallback remains heavy. |
| `/questions/nclex-next-gen-question-types` | 200 | 0.59s | 1.56MB | Question topic loader is cached but still DB-backed on misses. |
| `/flashcards` | 200 | 0.39s | 1.58MB | Public flashcard hub still performs tag/deck/card reads on misses. |

Historical crawl 504s are origin availability failures, not reliable per-route render timings. They still matter because DB-backed cache misses and dynamic pages increase origin pressure during large crawls.

## Route Classification

### Static

Use static generation or `force-static` when output is fully registry/file-backed and does not depend on cookies, session, user state, checkout state, live DB counts, or request headers.

Candidates:

- Legal and trust pages: privacy, terms, acceptable use, editorial policy.
- Static clinical marketing pages: ECG, labs, hemodynamics, telemetry, ACLS/PALS rhythm pages.
- Static exam guides and evergreen SEO pages.
- Static comparison and resource pages backed by registries.
- Static glossary term pages when backed by local glossary registries.

Implementation target:

- Prefer `generateStaticParams` for finite registries.
- Use `dynamicParams = false` where the route set is known.
- Keep `revalidate = false` only for content that changes exclusively through deployments.

### ISR

Use ISR when content is public and shared by all anonymous visitors but may change through publishing workflows.

Candidates:

- Blog index, category, tag, and article pages.
- Lesson hubs and lesson detail pages.
- Question topic pages.
- Flashcard hubs and deck pages.
- RN/RPN/NP/allied public hubs.
- Localized country/exam/topic pages.
- Sitemap route segments.

Implementation target:

- Use `revalidate = 3600` for blog/article/public topic content.
- Use `revalidate = 86400` for stable evergreen route families.
- Use shorter windows only for publishing surfaces that must update quickly.
- Avoid DB reads during request render by loading from snapshots first.

### Cached

Use `unstable_cache` or Next cache wrappers for public aggregate data that is shared across users.

Candidates:

- Blog list pages and category/tag counts.
- Flashcard deck/tag summaries.
- Question counts by topic/pathway.
- Lesson manifest and related lesson lookups.
- Internal link suggestions.
- Public home stats and feature inventory metrics.
- Sitemap URL family manifests.

Implementation target:

- Cache with explicit keys by locale, pathway, route family, page, and slug.
- Cache only public, request-independent data.
- Never cache active learner sessions, entitlement decisions, private progress, or checkout state.

### Memoized

Use request/module memoization where repeated synchronous registry work or repeated static JSON loads occur during one render.

Candidates:

- Locale shard overlays.
- Route registry lookups.
- Exam pathway registry lookups.
- Content taxonomy mappings.
- Lesson slug to pathway lookups.
- Static article manifests.

Implementation target:

- Use module-level maps for immutable local files.
- Use `cache()` only when scoped to server render and request-safe.
- Preserve locale and route parameters in cache keys.

### Force Dynamic

Keep dynamic only where request-specific data is required.

Routes that should remain dynamic:

- Login, signup, forgot password, reset password, verify email.
- Checkout, trial, subscription, and account flows.
- Diagnostics, debug, admin, preview, and staff-only routes.
- Active learner sessions and app routes with user state.

## Route Family Conversion Plan

| Priority | Family | Current Behavior | Conversion Target | DB Avoidance Strategy | Estimated Response Reduction | Estimated DB Load Reduction | Estimated Memory Reduction |
| ---: | --- | --- | --- | --- | ---: | ---: | ---: |
| 1 | Localized homepages | `src/app/(marketing)/[locale]/page.tsx` is `force-dynamic`; loads cookies, stats, region cards, locale shards. `/fr` sample was 6.80s and 3.21MB. | ISR or static default per locale. | Move region personalization to client/default static region. Serve static locale shell; cache locale shards and region-card manifest. | 70-95% | 80-100% | 40-65% |
| 2 | Lesson detail pages | Many lesson routes use ISR, but cold paths can assemble large lesson payloads. Sample lesson was 9.74s and 3.22MB. | ISR backed by lesson snapshot bundle. | Prebuild lesson manifest by pathway/slug; include only render fields. Precompute related tools/counts daily. | 80-95% | 90-100% | 50-70% |
| 3 | Blog index/articles | Blog pages have ISR, but `safe-blog-queries.ts` can query DB, count, merge DB/static rows, and probe fallbacks. | ISR from public blog snapshot with DB fallback only during regeneration. | Export public article index and article bodies into build/runtime cache snapshot. Cache category/tag/count pages. | 40-80% on misses | 80-95% | 25-50% |
| 4 | Question topic pages | `load-programmatic-question-topic-page.ts` uses cached loaders but cold misses perform counts/findMany and related lesson DB checks. | ISR from question-topic snapshot. | Precompute topic counts, preview rows, and related lesson links per slug/pathway. | 50-80% | 80-95% | 25-45% |
| 5 | Flashcard public pages | `public-flashcard-landing.ts` performs tag/deck/card reads and lesson-source reads. | ISR from public flashcard deck/tag snapshot. | Precompute deck summaries, sample cards, categories, and lesson links. Load card bodies only on deck/detail pages. | 40-75% | 80-95% | 25-50% |
| 6 | RN/RPN/NP/allied public hubs | Mostly ISR, but allied overview/career pages still use Prisma/cookies in public surfaces. | ISR, cookie-free static default. | Snapshot pathway inventory, counts, and hub cards. Move preferences to client where needed. | 40-75% | 70-95% | 25-50% |
| 7 | Sitemaps | Many sitemap segments are ISR/cached; root sitemap should not perform live route discovery under load. | Static/cached sitemap index plus segmented ISR. | Generate URL manifests and cache XML responses with ETag. Quarantine only route families that fail renderability gate. | 50-90% | 90-100% | 30-60% |
| 8 | Homepage | Default homepage now has safer optional DB behavior and `revalidate = 300`, but sample was still 6.44s. | Static shell with ISR optional modules. | Keep public stats synchronous/fallback-first; defer any dynamic proof modules. | 50-85% | 90-100% | 20-40% |

## Specific Conversion Recommendations

### Lessons

Current posture:

- Marketing lesson hubs and detail pages are generally ISR.
- The slow sample lesson shows the page can still produce a multi-megabyte response and high cold latency.

Convert to:

- Static/ISR lesson snapshot per `pathwayId + lessonSlug + locale`.
- Route manifest generated from the canonical lesson registry/database publish pipeline.
- DB-free render path for all published lesson URLs.

Cache/memoize:

- Lesson metadata.
- Lesson content body.
- Related lesson links.
- Activity counts for flashcards, questions, case studies, CAT availability.
- Blueprint/category/system mappings.

Do not cache:

- Learner completion state.
- Entitlement-specific app lesson access.
- Active study-session state.

Estimated savings:

- Response time: 9.74s sampled cold lesson to <500ms cache hit, <2s ISR miss.
- DB load: 90-100% reduction on public lesson traffic.
- Memory: 50-70% reduction if the HTML/data payload is reduced from ~3.2MB to <1.2MB.

### Blog Articles And Hubs

Current posture:

- `/blog` uses `revalidate = 180`.
- Blog articles and category/tag pages generally use `revalidate = 3600`.
- `safe-blog-queries.ts` already has pagination, selected fields, timeouts, static fallback, and concurrency limiting, but still contains DB probes, counts, merge logic, and fallback paths.

Convert to:

- Public blog snapshot generated by publish workflow.
- DB-free list pages for `/blog`, `/blog?page=N`, category, tag, locale, and article pages.
- Cached count manifest for categories/tags/locales.

Cache/memoize:

- `slug -> article summary`.
- `slug -> article body`.
- `category/tag/page -> article summaries`.
- sitemap article URL list.
- related article network.

Estimated savings:

- Response time: 40-80% on cold/miss paths; cache hits should remain sub-500ms.
- DB load: 80-95% reduction for anonymous blog and crawler traffic.
- Memory: 25-50% reduction by avoiding merge of static and DB rows at request time.

### Questions

Current posture:

- Public question topic pages use ISR (`revalidate = 86400` for some routes) and `unstable_cache`.
- Cold cache path in `load-programmatic-question-topic-page.ts` still performs:
  - pathway question count,
  - fallback broad count,
  - page total count,
  - `findMany` for preview rows,
  - related lesson DB lookup and cross-link verification.

Convert to:

- Daily/hourly question-topic snapshot keyed by topic slug and pathway.
- Precomputed preview rows with only id, truncated stem, option preview, and public route metadata.
- Precomputed related lesson links.

Estimated savings:

- Response time: 50-80% on cache misses.
- DB load: 80-95% reduction.
- Memory: 25-45% reduction.

### Flashcards

Current posture:

- `/flashcards` uses `revalidate = 1800`.
- Deck pages use `revalidate = 86400`.
- `public-flashcard-landing.ts` performs `flashcardTag.findMany`, `flashcardDeck.findMany`, and `flashcard.findMany` for lesson-source rows.

Convert to:

- Public flashcard snapshot with deck summaries, categories, topic tags, sample front text, and lesson-source links.
- Use ISR for hub/deck pages with snapshot lookup only.

Estimated savings:

- Response time: 40-75%.
- DB load: 80-95% for public flashcard pages.
- Memory: 25-50% by avoiding deck/tag/card joins at render time.

### Localized Pages

Current posture:

- Localized homepage is `force-dynamic`.
- Locale pages load marketing shards, region cookies, home stats, and global region card IDs.
- Locale content routes generally use ISR.

Convert to:

- Static or ISR locale homepages with default region output.
- Client-side region personalization after first paint.
- Module-level memoized marketing message shards.
- Precomputed published-region-card manifest.

Estimated savings:

- Response time: `/fr` 6.80s sample to <500ms cache hit.
- DB load: 80-100%.
- Memory: 40-65%, especially by reducing 3MB+ route payloads.

### Public Hubs

Current posture:

- RN/RPN/NP/allied hubs are mostly ISR.
- Some allied pages use direct Prisma and cookies on public paths.

Convert to:

- ISR hub pages from pathway inventory snapshots.
- Shared count snapshots for lessons/questions/flashcards/case studies.
- Request-independent default public view.

Estimated savings:

- Response time: 40-75%.
- DB load: 70-95%.
- Memory: 25-50%.

### Sitemaps

Current posture:

- Most sitemap segments use ISR/cached responses.
- Root sitemap and large family manifests should not discover live URLs synchronously during high crawl load.

Convert to:

- Static sitemap index generated from route manifests.
- Segmented sitemap XML cached with ETag and explicit TTL.
- Renderability gate before including route families in production sitemaps.

Estimated savings:

- Response time: 50-90%.
- DB load: 90-100%.
- Memory: 30-60%.

## Conversion Priority Backlog

1. Convert localized homepage (`src/app/(marketing)/[locale]/page.tsx`) from `force-dynamic` to ISR/static-safe output.
2. Build lesson snapshot manifest and route all public lesson detail pages through DB-free snapshot reads.
3. Build blog public snapshot for list/article/category/tag/locale pages and use DB only in publish/revalidation jobs.
4. Build question-topic snapshot for programmatic question pages.
5. Build flashcard public deck/tag snapshot for `/flashcards` and deck pages.
6. Remove direct public Prisma/cookie dependency from allied public hub and career surfaces.
7. Convert root sitemap discovery to cached/static URL-family manifests.
8. Add payload budget checks for public content pages over 1MB.
9. Add instrumentation separating cache HIT, ISR MISS, and DB fallback paths.
10. Add a production crawl mode that logs DB reads per route family and fails if public cached routes hit Prisma unexpectedly.

## Public DB Loader Remediation List

| File | Current Risk | Recommended Change |
| --- | --- | --- |
| `src/lib/blog/safe-blog-queries.ts` | DB counts, list reads, merge/fallback probes during public blog rendering. | Replace request-time list/body reads with public blog snapshot. Keep DB fallback only for regeneration/publish diagnostics. |
| `src/lib/blog/safe-localized-blog-queries.ts` | Localized blog list/detail can hit DB on cache miss. | Localized article snapshot keyed by locale and slug. |
| `src/lib/seo/public-flashcard-landing.ts` | Public flashcard hub performs deck/tag/card reads. | Precompute public deck/tag/category snapshot. |
| `src/lib/seo/load-programmatic-question-topic-page.ts` | Cached wrapper still performs multiple counts/findMany on misses. | Precompute topic question summaries and related lesson links. |
| `src/lib/seo/content-backed-study-resource-hub.ts` | Content-backed hubs use lesson/question/deck queries. | Precompute hub inventory snapshots by pathway and topic. |
| `src/lib/seo/internal-links.ts` | Internal link suggestions can load blog/lesson rows. | Generate related-link graph during publish/index jobs. |
| `src/lib/marketing/allied-pathway-hub-overview.ts` | Allied public hub overview reads deck data. | Snapshot allied overview counts/cards. |
| `src/lib/marketing/public-home-stats.ts` | Cached but still contains several Prisma counts/groupBy calls. | Prefer static memory stats for critical path; refresh full stats out of band. |

## Guardrails

- Do not cache learner-specific routes, active CAT sessions, flashcard sessions, practice sessions, entitlement checks, checkout state, or account state.
- Do not use cookie/header reads in public pages that should be static or ISR unless the route is intentionally dynamic.
- Do not let failed DB reads produce false empty content states; public static snapshots should be the fallback for known published URLs.
- Preserve canonical URLs, sitemap inclusion, locale routing, and pathway scoping.
- Keep cache keys explicit: locale, route family, pathway, slug, page, and version.

## Target Architecture

Public route request path:

1. CDN/Next route cache serves static or ISR response.
2. If ISR miss, route reads a local/public content snapshot.
3. Snapshot render returns public HTML without Prisma.
4. Publish/admin jobs refresh snapshots and trigger revalidation.
5. DB fallback is reserved for controlled regeneration paths, not ordinary anonymous traffic.

This shifts public content from request-time database assembly to publish-time materialization.

## Acceptance Criteria For Implementation

- Public lesson, blog, question, flashcard, and localized pages return 200 without `DATABASE_URL` for known snapshot-backed URLs.
- Cached public pages emit no Prisma queries on cache HIT.
- ISR MISS path performs zero or bounded DB queries, depending on route family, and never loads full corpora.
- Public page payloads are under 1MB for common pages and under 1.5MB for rich lesson/article pages.
- `/fr`, representative lesson detail pages, `/blog`, `/questions/nclex-next-gen-question-types`, and `/flashcards` all respond in <500ms on cache HIT.
- Large sitemap crawls do not increase Prisma connection pressure for already cached public route families.

## Recommendation

Proceed with implementation in this order:

1. Localized homepage static/ISR conversion.
2. Lesson snapshot bundle.
3. Blog snapshot bundle.
4. Question-topic snapshot bundle.
5. Flashcard public snapshot bundle.

This produces the largest crawler and anonymous-visitor stability gain while preserving learner behavior and avoiding risky scoring, entitlement, or session changes.
