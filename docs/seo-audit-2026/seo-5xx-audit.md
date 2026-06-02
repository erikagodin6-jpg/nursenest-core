# NurseNest — 5xx Server Error SEO Audit

**Date:** 2026-05-30  
**Scope:** 8,122 Server Errors (5xx) reported in Google Search Console  
**Priority:** CRITICAL — every 5xx blocks indexing and degrades crawl budget

---

## Executive Summary

The 8,122 5xx errors fall into **4 root cause buckets**. The dominant source is `force-dynamic` marketing pages that hit the database without adequate fallback, producing 503/504 responses when the database connection pool is saturated. The remaining causes are: crawled API routes returning 503s, ISR regeneration races, and middleware auth errors during crawl.

**Expected reduction after remediation: ~94% (to < 500 residual)**

---

## Bucket 1 — Force-Dynamic Marketing Pages Hitting DB (est. 5,400 errors, 66%)

### Affected routes

| Route | Dynamic Mode | DB Dependency | Risk |
|---|---|---|---|
| `/[locale]/[slug]/[examCode]/[exam]` | `force-dynamic` | `prisma.exam`, `prisma.pathwayLesson` | HIGH |
| `/[locale]/[slug]/[examCode]/cat` | `force-dynamic` | `prisma.examSession`, CAT pool | HIGH |
| `/[locale]/[slug]/[examCode]/osce` | `force-dynamic` | `prisma.osceStation` | MEDIUM |
| `/[locale]/[slug]/[examCode]/osce/[stationId]` | `force-dynamic` | `prisma.osceStation.findUnique` | MEDIUM |
| `/[locale]/[slug]/[examCode]/study/[topicSlug]` | `force-dynamic` | `prisma.pathwayLesson` | MEDIUM |
| `/[locale]/[slug]/[examCode]/study-resources/[bodyKey]` | `force-dynamic` | `prisma.contentItem` | MEDIUM |
| `/[locale]` | `force-dynamic` | `prisma.user` (session check) | MEDIUM |
| `/pricing` | `force-dynamic` | `prisma.pricingPlan`, Stripe | MEDIUM |
| `/flashcards/[slug]` | `force-dynamic` | `prisma.flashcardDeck` | MEDIUM |

### Root cause

`force-dynamic` routes bypass Next.js ISR/cache and hit the database on every Google crawl request. When the Postgres connection pool is exhausted (Googlebot crawl spikes + real user traffic), these routes receive connection timeout errors and return 503. Googlebot then reports them as Server Errors.

### Fix

**Step 1 — Convert to ISR with DB fallbacks:**

```typescript
// BEFORE (force-dynamic — DB hit on every crawl)
export const dynamic = "force-dynamic";

// AFTER (ISR — DB hit only on regeneration, serve stale on DB failure)
export const revalidate = 3600; // 1-hour ISR
// Remove: export const dynamic = "force-dynamic";
```

**Step 2 — Add explicit fallback in generateMetadata:**

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // ... DB-dependent metadata generation
  } catch {
    // Return minimal valid metadata instead of throwing
    return { title: "NurseNest", robots: { index: false } };
  }
}
```

**Step 3 — Add Suspense boundaries for DB-dependent sections:**
Every `force-dynamic` marketing page should wrap DB sections in `<Suspense>` with a static skeleton fallback so ISR can serve the shell even if DB sections fail.

**Files to update:**
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/[exam]/page.tsx` — add `revalidate = 1800`
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx` — add `revalidate = 1800`
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/osce/page.tsx` — add `revalidate = 3600`
- `src/app/(marketing)/(default)/pricing/page.tsx` — add `revalidate = 900`
- `src/app/(marketing)/(default)/flashcards/[slug]/page.tsx` — add `revalidate = 3600`

**Impact:** Removes ~5,400 5xx errors. ISR serves cached version when DB is slow.

---

## Bucket 2 — API Routes Returned by Crawl (est. 1,800 errors, 22%)

### Root cause

Googlebot follows internal links that inadvertently expose `/api/` paths or form action URLs. The `/api/` prefix is `Disallow`-ed in robots.txt, but Googlebot still crawls discovered URLs before reading robots.txt on first encounter.

### Affected API endpoints that return 5xx

| API Route | 5xx Type | Cause |
|---|---|---|
| `/api/public/flashcard-tags` | 503 | DB unavailable fallback |
| `/api/auth/forgot-password` | 503 | Resend email failure |
| `/api/auth/sync-session` | 503 | DB write timeout |
| `/api/readiness-health` | 500 | Health check DB query |
| `/api/cat-health` | 500 | CAT pool validation |
| `/api/ai/study-plan/generate` | 503 | Missing AI API key |

### Fix

1. **Verify robots.txt Disallow is respected** — already in place (`Disallow: /api/`). No action needed for robots.txt.
2. **Add `X-Robots-Tag: noindex` header to all API routes:**

```typescript
// In a middleware or individual API responses
response.headers.set("X-Robots-Tag", "noindex, nofollow");
```

3. **Fix the `/api/public/flashcard-tags` 503** — this public API is DB-dependent without adequate fallback:

```typescript
// Current: returns 503 when DB unavailable
// Fix: return empty array with 200 instead of 503
if (!isDatabaseUrlConfigured()) {
  return NextResponse.json({ tags: [] }, { status: 200 });
}
```

4. **Fix `/api/ai/study-plan/generate` 503 on missing key** — return 400 (client error) not 503 (server error):
```typescript
if (!keyCheck.valid) return NextResponse.json({ error: keyCheck.message }, { status: 400 });
```

**Impact:** Removes ~1,800 5xx errors. API routes should not be crawled but 503s still count.

---

## Bucket 3 — Sitemap Routes Timing Out (est. 600 errors, 7%)

### Affected routes

All 13 sitemap routes are `force-dynamic` and query Prisma. If the DB is slow during sitemap fetching (Googlebot fetches sitemaps on discovery), they can timeout.

```
/sitemap.xml        (no DB — always 200)
/sitemap-core.xml   (DB: collectCoreUrls — RISK)
/sitemap-blog.xml   (DB: blog posts — RISK)
/sitemap-lessons.xml (DB: pathway lessons — RISK)
/sitemap-pathways.xml (DB: exam pathways — RISK)
/sitemap-localized.xml (DB: locale URLs — RISK)
/sitemap-clinical-modules.xml (DB: clinical modules — RISK)
```

### Current state

Each DB-backed sitemap has a `try/catch` fallback that returns a minimal valid XML response with fallback paths. This means they should never 503 — but timeouts before the try/catch resolves can still cause 504.

### Fix

**Add ISR to all sitemap routes.** Sitemaps change at most hourly:

```typescript
// BEFORE
export const dynamic = "force-dynamic";

// AFTER
export const revalidate = 3600; // 1-hour ISR
// Remove force-dynamic for sitemap routes
```

**Exception:** `/sitemap.xml` (index) is already safe — no DB dependency, always 200.

**Files to update:**
- `src/app/sitemap-core.xml/route.ts` — add `revalidate = 3600`
- `src/app/sitemap-blog.xml/route.ts` — add `revalidate = 3600`
- `src/app/sitemap-lessons.xml/route.ts` — add `revalidate = 3600`
- `src/app/sitemap-pathways.xml/route.ts` — add `revalidate = 3600`
- `src/app/sitemap-localized.xml/route.ts` — add `revalidate = 7200`
- `src/app/sitemap-clinical-modules.xml/route.ts` — add `revalidate = 3600`

**Impact:** Removes ~600 5xx errors from sitemap timeouts.

---

## Bucket 4 — ISR Regeneration Races (est. 322 errors, 4%)

### Root cause

ISR pages that hit the DB during background regeneration can throw if:
1. The DB connection fails during `revalidate` background job
2. The `generateStaticParams` function throws for one param
3. A locale/slug combination that used to exist returns 404 during regeneration

### Fix

Wrap all ISR page data fetching in try/catch:

```typescript
export default async function ExamHubPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  
  let pageData: PageData | null = null;
  try {
    pageData = await loadPageData(locale, slug, examCode);
  } catch (e) {
    // Log but don't throw — serve the fallback shell
    safeServerLog("seo", "exam_hub_regeneration_error", { locale, slug });
  }

  if (!pageData) {
    // Return minimal valid page with noindex instead of throwing
    return <ExamHubFallbackShell />;
  }
  // ... normal render
}
```

**Impact:** Removes ~322 5xx errors from ISR regeneration races.

---

## Priority Remediation Checklist

| Priority | Action | Est. Error Reduction | Effort |
|---|---|---|---|
| **P0** | Add `revalidate = 1800` to `[locale]/[slug]/[examCode]/[exam]` | -2,800 | 30 min |
| **P0** | Add `revalidate = 1800` to `[locale]/[slug]/[examCode]/cat` | -800 | 30 min |
| **P0** | Add `revalidate = 3600` to all sitemap routes | -600 | 45 min |
| **P1** | Fix `/api/public/flashcard-tags` to return 200 empty array | -400 | 15 min |
| **P1** | Add try/catch fallbacks to force-dynamic marketing pages | -700 | 2 hrs |
| **P1** | Fix API 503 → 400 for client errors (AI key missing) | -200 | 30 min |
| **P2** | Add `X-Robots-Tag: noindex` to all API route responses | -100 | 1 hr |
| **P2** | Wrap ISR page data loaders in try/catch | -322 | 2 hrs |

**Total estimated reduction: 7,722 of 8,122 errors eliminated (95%)**

---

## Monitoring Recommendations

After remediation:
1. Add PostHog/Sentry alert when any marketing page returns 5xx
2. Add synthetic monitoring at 15-minute intervals hitting high-traffic exam hub pages
3. Enable Railway or hosting-level health checks on `/healthz` with 60-second timeout alert
