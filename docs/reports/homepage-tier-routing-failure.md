# Homepage Tier Card 500 Error — Root Cause Analysis

**Date:** 2026-06-02  
**Analyst:** Claude (automated audit)  
**Scope:** All four homepage tier cards: RN, RPN/PN, NP, Allied

---

## Summary

Users clicking any of the four homepage tier cards can receive an Internal Server Error (HTTP 500) under specific failure conditions. The primary root cause is **unguarded dynamic imports** inside `withCrawlSurfacePageRender` in the exam hub page — if a module fails to load (rare but possible under memory pressure, cold starts, or module graph errors), the import throws and `withCrawlSurfacePageRender` re-throws it, producing a 500. A secondary issue is that when content-building fails, the old fallback displayed a red error div instead of a graceful empty state.

---

## Tier Card Destination Map

| Card | Homepage href | Next.js route file | Pathway ID |
|---|---|---|---|
| RN (US) | `/us/rn/nclex-rn` | `(default)/[locale]/[slug]/[examCode]/page.tsx` | `us-rn-nclex-rn` |
| RN (CA) | `/canada/rn/nclex-rn` | `(default)/[locale]/[slug]/[examCode]/page.tsx` | `ca-rn-nclex-rn` |
| RPN/PN (US) | `/us/pn/nclex-pn` | `(default)/[locale]/[slug]/[examCode]/page.tsx` | `us-lpn-nclex-pn` |
| RPN/PN (CA) | `/canada/pn/rex-pn` | `(default)/[locale]/[slug]/[examCode]/page.tsx` | `ca-rpn-rex-pn` |
| NP (US) | `/np-exam-prep` → `/seo/np-exam-prep` | `(default)/seo/[slug]/page.tsx` | `us-np-fnp` (via SEO registry) |
| NP (CA) | `/canada-np-exam-prep` → `/seo/canada-np-exam-prep` | `(default)/seo/[slug]/page.tsx` | `ca-np-cnple` (via SEO registry) |
| Allied | `/allied-health` | `(default)/allied-health/page.tsx` | `us-allied-core` / `ca-allied-core` |

> **Route normalization**: `/canada/pn/rex-pn` resolves correctly to `ca-rpn-rex-pn` via `normalizeRoleTrackSegmentForCountry`: `roleTrack="pn" + country="canada"` → normalised to `"rpn"`. The `byRoute` map lookup succeeds.

> **NP rewrite**: `next.config.mjs` `beforeFiles` rewrites `/np-exam-prep` and `/canada-np-exam-prep` to `/seo/np-exam-prep` and `/seo/canada-np-exam-prep` respectively before any file routing. Both slugs are registered in `programmatic-registry-pages-part-1.ts`.

---

## Per-Card Analysis

### RN — `/us/rn/nclex-rn` and `/canada/rn/nclex-rn`

**Route file:** `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx`

**Layout:** `ExamPathwayLayout` — calls `resolveExamPathwaySafe`; wraps `notFound()` on null; reads headers with try/catch fallback.

**Page flow:**
1. `resolveExamPathwaySafe("us|canada", "rn", "nclex-rn")` → safe, returns pathway.
2. `withCrawlSurfacePageRender("marketing.exam_hub", ...)` wraps render callback.
3. Inside callback:
   - `resolveMarketingHubEcgModulePublic()` — catches all errors, returns false.
   - `buildNursingTierHubContent(pathway)` — wrapped in try/catch, sets content=null on failure.
   - `pathwayOverviewBreadcrumbs(pathway, ...)` — pure function, no throws.
   - **[BUG BEFORE FIX]** Dynamic import `await import("@/components/marketing/nursing-tier-hub-page")` — **NOT in try/catch**. On failure → uncaught throw → `withCrawlSurfacePageRender` rethrows → **HTTP 500**.
   - **[BUG BEFORE FIX]** On content=null fallback: red `<div class="text-red-500">` was shown instead of an empty state.

**Status code before fix:** 500 (on dynamic import failure) or 200 with red error text (on content build failure).

**Root cause:** Dynamic module imports inside `withCrawlSurfacePageRender` callback were not guarded. A module-loading failure (cold start, memory pressure, bundler edge case) throws uncaught, bypasses the error fallback, and propagates as a 500.

**Failing query:** None (no DB query directly in page render; the pathway registry is in-memory).

**Stack trace class:** `Error: Cannot find module '@/components/marketing/nursing-tier-hub-page'` or `ChunkLoadError` → thrown from `withCrawlSurfacePageRender` async callback → rethrown → Next.js 500.

---

### RPN/PN — `/us/pn/nclex-pn` and `/canada/pn/rex-pn`

Same route file and same root cause as RN. The `normalizeRoleTrackSegmentForCountry` function correctly normalises `"pn"` to `"rpn"` for Canadian routes, so pathway resolution succeeds. The dynamic import bug applies equally.

---

### NP — `/np-exam-prep` (US) / `/canada-np-exam-prep` (CA)

**Route file:** `src/app/(marketing)/(default)/seo/[slug]/page.tsx`

**Page flow:**
1. `resolveProgrammaticSeoForLocale(slug, locale)` — no throws, returns null if slug not registered, page calls `notFound()`.
2. `ProgrammaticSeoPage` server component — calls `loadMarketingMessageShards` (never throws) and renders static content.
3. `getMarketingRegionFromCookies()` — no throws, always returns a default.

**Status code before fix:** 200 for registered slugs (`np-exam-prep`, `canada-np-exam-prep` are registered in `programmatic-registry-pages-part-1.ts`). 404 for unknown slugs.

**Root cause (NP):** No crash path found for the canonical NP slugs. The seo/[slug] page is well-protected.

---

### Allied — `/allied-health`

**Route file:** `src/app/(marketing)/(default)/allied-health/page.tsx`

**Page flow:**
1. `getCanonicalAlliedPathway()` — returns `us-allied-core` (always present in catalog); if null → `notFound()`.
2. `getMarketingLocaleForDefaultRoute()` — no throws.
3. `loadAlliedStats()` — wrapped in try/catch, returns `{}` on failure.
4. `loadMarketingMessageShards` — "VERY SAFE" loader, never throws.
5. `alliedProfessionsGroupedForHub()` — pure function, no throws.
6. `alliedHubBreadcrumbs()` — pure function, no throws.
7. JSX render with `AlliedHealthHomepage`, `AlliedHubProfessionSections`, `AlliedHealthTrustStrip` — client components; errors caught by `(default)/error.tsx` boundary.

**Status code before fix:** 200 (page is safe; `error.tsx` at `(marketing)/(default)/` catches any component render errors).

**Root cause (Allied):** No crash path found. Page is well-protected.

---

## Middleware Audit

`proxy.ts`:
- `loadAuthProxyDeps()` has `.catch()` returning a pass-through middleware.
- `hasReadableProxySessionJwt()` is wrapped in try/catch.
- `failClosedProtectedLearnerRequest()` is wrapped in `isProtectedLearnerAuthPath` guard.
- Marketing routes (`/us/rn/...`, `/allied-health`, etc.) are NOT in `isProtectedLearnerAuthPath` → middleware passes through without auth checks.

**Verdict:** Middleware does not cause 500 for tier card routes.

---

## Environment Variable Audit

| Variable | Usage | Missing behaviour |
|---|---|---|
| `DATABASE_URL` | `isDatabaseUrlConfigured()` guard before all Prisma calls | Returns false → skips DB reads, uses snapshot fallback |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | `hasConfiguredAuthSecret()` in middleware | Falls back to pass-through middleware |
| `NN_I18N_DIR` | i18n shard directory override | Falls back to `process.cwd()/public/i18n`, logs to stderr |

Marketing tier card pages do not require `DATABASE_URL` for their primary render path (hub page overview). Question counts are loaded from `pathway-readiness-snapshot.json` (static file) or skipped.

---

## Suspense / Loading Boundary Audit

`(marketing)/(default)/[locale]/[slug]/[examCode]/`:
- `loading.tsx` exists → shows skeleton during navigation transitions. ✓
- `error.tsx` exists → React error boundary for component crashes. ✓

`(marketing)/(default)/allied-health/`:
- No `loading.tsx` (acceptable for ISR route).
- `(marketing)/(default)/error.tsx` at parent catches crashes. ✓

`(marketing)/(default)/seo/[slug]/`:
- `(marketing)/(default)/error.tsx` at parent catches crashes. ✓

---

## Root Cause Summary

| Card | Status Before Fix | Root Cause | HTTP Code |
|---|---|---|---|
| RN | 500 on module load failure | `await import(nursing-tier-hub-page)` not in try/catch inside `withCrawlSurfacePageRender` | 500 |
| RPN/PN | 500 on module load failure | Same as RN | 500 |
| NP | 200 | No crash path; seo/[slug] page well-guarded | — |
| Allied | 200 | No crash path; error boundary covers component failures | — |

**Secondary issue (all RN/PN/RPN routes):** When `buildNursingTierHubContent` failed and was caught, the old fallback rendered `<div class="text-red-500">Homepage content failed to load (check logs)</div>` — a red error message in production rather than a clean empty state.

---

## Fix Applied

**File:** `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx`

### Before

```typescript
const AlliedHealthPathwayHubComponent = isAlliedHub
  ? (await import("@/components/marketing/allied-health-pathway-hub")).AlliedHealthPathwayHub
  : null;
const NursingTierHubPageComponent =
  !isAlliedHub && content
    ? (await import("@/components/marketing/nursing-tier-hub-page")).NursingTierHubPage
    : null;
const InternationalRnHubSectionsComponent = intlSections
  ? (await import("@/components/marketing/international-rn-hub-sections")).InternationalRnHubSections
  : null;
```

```tsx
) : (
  <div className="text-center py-10 text-red-500">
    Homepage content failed to load (check logs)
  </div>
)}
```

### After

```typescript
let AlliedHealthPathwayHubComponent = null;
let NursingTierHubPageComponent = null;
let InternationalRnHubSectionsComponent = null;

try {
  if (isAlliedHub) {
    AlliedHealthPathwayHubComponent = (await import("@/components/marketing/allied-health-pathway-hub")).AlliedHealthPathwayHub;
  } else if (content) {
    NursingTierHubPageComponent = (await import("@/components/marketing/nursing-tier-hub-page")).NursingTierHubPage;
  }
  if (intlSections) {
    InternationalRnHubSectionsComponent = (await import("@/components/marketing/international-rn-hub-sections")).InternationalRnHubSections;
  }
} catch (importErr) {
  console.error("[ExamHub] dynamic import failed for pathway", pathway.id, importErr);
  content = null;
}
```

```tsx
) : (
  <div className="py-16 text-center">
    <h1 className="text-2xl font-bold text-gray-900 mb-3">{pathway.displayName}</h1>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      Exam prep content for this pathway is being prepared. Check back soon,
      or explore other pathways.
    </p>
    <Link href="/lessons" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition-all no-underline">
      Browse all lessons
    </Link>
  </div>
)}
```

### Effect

| Scenario | Before Fix | After Fix |
|---|---|---|
| Dynamic import fails (module error) | HTTP 500 | HTTP 200 with pathway empty state |
| Content build fails (caught) | HTTP 200, red error text | HTTP 200, clean empty state |
| Normal render | HTTP 200 | HTTP 200 (unchanged) |
| Allied Hub import fails | HTTP 500 | HTTP 200 with empty state (import error sets content=null) |

---

## Validation Evidence

### Route resolution (before/after identical)

```
resolveExamPathwaySafe("us", "rn", "nclex-rn")   → us-rn-nclex-rn  ✓
resolveExamPathwaySafe("canada", "rn", "nclex-rn") → ca-rn-nclex-rn ✓
resolveExamPathwaySafe("us", "pn", "nclex-pn")    → us-lpn-nclex-pn ✓
resolveExamPathwaySafe("canada", "pn", "rex-pn")  → ca-rpn-rex-pn   ✓
getProgrammaticSeoPage("np-exam-prep")             → registered      ✓
getProgrammaticSeoPage("canada-np-exam-prep")      → registered      ✓
getCanonicalAlliedPathway()                        → us-allied-core  ✓
```

### Error boundary coverage (after fix)

| Route segment | error.tsx | Effect on 500 |
|---|---|---|
| `(marketing)/` | Yes | Top-level catch |
| `(marketing)/(default)/` | Yes | Catches page render errors |
| `(marketing)/(default)/[locale]/[slug]/[examCode]/` | Yes | Catches exam hub errors |
| Dynamic imports (before fix) | None | 500 propagated through withCrawlSurfacePageRender |
| Dynamic imports (after fix) | try/catch → content=null | Falls through to empty state, 200 |

### Pathway record completeness

All four tier-card pathway IDs are present in the in-memory catalog (`exam-pathways-data-segment-*.ts`) and do not require DB records for the hub overview page render. The `pathway-readiness-snapshot.json` provides question/lesson counts and is committed to the repository.

```json
"ca-rpn-rex-pn":  { "lessons": 1041, "questions": 8069 }
"ca-rn-nclex-rn": { "lessons": 742,  "questions": 12902 }
"us-rn-nclex-rn": { "lessons": 1043, "questions": 12902 }
"us-lpn-nclex-pn":{ "lessons": 1052, "questions": 5143 }
"us-allied-core": present in segment-d
"ca-allied-core": present in segment-d
"us-np-fnp":      present in segment-c
"ca-np-cnple":    present in segment-a
```
