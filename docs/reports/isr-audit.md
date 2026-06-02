# ISR Audit — Marketing Hub Routes

**Date:** 2026-06-02  
**Scope:** `src/app/(marketing)/` — all pages, layouts, and server components  
**Pattern searched:** `cookies()`, `headers()`, `cache: 'no-store'`, `unstable_noStore()`, `dynamic = 'force-dynamic'`, `getMarketingLocaleForDefaultRoute()`

---

## Summary

| Category | Count | ISR impact |
|---|---|---|
| `force-dynamic` (intentional: auth/reset pages) | 8 | No ISR — correct |
| `force-static` (correct) | 2 | Always ISR — correct |
| `cookies()` reads (layout/measurement) | 5 | Prevents HTTP CDN caching for affected routes |
| `getMarketingLocaleForDefaultRoute()` remaining | 5 marketing routes | Forces dynamic rendering |
| **Fixed this phase** | 3 hub routes | ISR-eligible after fix |

---

## Force-Dynamic Routes (Intentionally Dynamic — No Fix Needed)

These pages require per-request rendering because they serve auth flows or admin tooling. `force-dynamic` is correct.

| File | Route | Reason | ISR? | Recommendation |
|---|---|---|---|---|
| `src/app/(marketing)/(default)/login/page.tsx` | `/login` | Auth form + CSRF; unique per request | ❌ intentional | Keep |
| `src/app/(marketing)/(default)/forgot-password/page.tsx` | `/forgot-password` | Auth token flow | ❌ intentional | Keep |
| `src/app/(marketing)/(default)/reset-password/page.tsx` | `/reset-password` | Token-based reset | ❌ intentional | Keep |
| `src/app/(marketing)/[locale]/login/page.tsx` | `/[locale]/login` | Localized auth | ❌ intentional | Keep |
| `src/app/(marketing)/[locale]/signup/page.tsx` | `/[locale]/signup` | Registration form | ❌ intentional | Keep |
| `src/app/(marketing)/[locale]/forgot-password/page.tsx` | `/[locale]/forgot-password` | Auth token flow | ❌ intentional | Keep |
| `src/app/(marketing)/[locale]/reset-password/page.tsx` | `/[locale]/reset-password` | Token-based reset | ❌ intentional | Keep |
| `src/app/(marketing)/[locale]/verify-email/page.tsx` | `/[locale]/verify-email` | Token verification | ❌ intentional | Keep |
| `src/app/(marketing)/(default)/debug/lessons/page.tsx` | `/debug/lessons` | Staff debug | ❌ intentional | Keep |
| `src/app/(marketing)/(default)/pre-nursing/practice/[slug]/page.tsx` | `/pre-nursing/practice/[slug]` | Interactive assessment | ❌ intentional | Keep |

---

## Force-Static Routes (Correct)

| File | Route | Reason | ISR? |
|---|---|---|---|
| `src/app/(marketing)/(default)/advanced-hemodynamics/page.tsx` | `/advanced-hemodynamics` | Fully static content | ✅ static |
| `src/app/(marketing)/(default)/exam-lessons/page.tsx` | `/exam-lessons` | Fully static | ✅ static |

---

## `cookies()` Reads — Structural Issues (Partial Fix Required)

### L1 — Marketing root layout reads `cookies()` for auth chrome

**File:** `src/app/(marketing)/layout.tsx:18`  
**Code:** `const jar = await cookies();`  
**Purpose:** Reads auth session cookie to determine header CTA state (logged-in vs guest).  
**ISR impact:** The layout renders dynamically on every request. While Next.js can still ISR-cache individual page RSC payloads, the HTTP response envelope is marked `Cache-Control: private` because the layout is dynamic. **CDN edge caching is not possible for any marketing page while the root layout reads cookies.**  
**Recommendation:** Move auth-state detection to a client component using `useSession()`. The header can optimistically render the guest state (statically) and update client-side after hydration. This is the standard pattern for Next.js App Router with auth.  
**Risk:** Medium — requires header component refactor. Do not change without dedicated auth-chrome sprint.

---

### L2 — Exam hub page reads `cookies()` for measurement preference

**File:** `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx:134`  
**Code:** `const fromCookie = readMeasurementPreferenceFromCookieStore(await cookies());`  
**Purpose:** Reads SI/conventional units preference to render lesson table values.  
**ISR impact:** All exam hub pages (ca-rn-nclex-rn, ca-rpn-rex-pn, etc.) are dynamically rendered.  
**Recommendation:** Move measurement preference to a client `useEffect` that reads from cookie/localStorage and updates the display after hydration. The server renders SI values (safe default); client switches if preference differs.

---

### L3 — Lesson detail page reads `cookies()` for measurement preference

**File:** `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx:476`  
**Code:** `const cookieStore = await cookies();`  
**Purpose:** Same measurement preference for lesson content rendering.  
**ISR impact:** Every lesson detail page is dynamically rendered.  
**Recommendation:** Same client-side hydration approach as L2.

---

### L4 — Allied career hubs read `cookies()` for measurement preference

**Files:**
- `src/app/(marketing)/(default)/allied/[career]/page.tsx:75`
- `src/app/(marketing)/(default)/allied/allied-health/page.tsx:62`

**Recommendation:** Same client-side hydration approach.

---

## `getMarketingLocaleForDefaultRoute()` — Remaining Dynamic Callers

These pages still call `getMarketingLocaleForDefaultRoute()` which invokes `cookies()`. They are not hub pages targeted by this phase but should be fixed in a subsequent pass.

| File | Route | Usage | ISR impact | Priority |
|---|---|---|---|---|
| `src/app/(marketing)/(default)/seo/[slug]/page.tsx` | `/seo/[slug]` | Locale for content | Forces dynamic | Medium |
| `src/app/(marketing)/(default)/blog/rn/page.tsx` | `/blog/rn` | Locale for content rendering | Forces dynamic | Medium |
| `src/app/(marketing)/(default)/blog/rn/[slug]/page.tsx` | `/blog/rn/[slug]` | Locale for content rendering | Forces dynamic | Medium |
| `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/[exam]/page.tsx` | Exam-specific sub-hubs | Locale | Forces dynamic | Low |
| `src/app/(marketing)/(default)/lessons/page.tsx` | `/lessons` (global hub) | Locale | Forces dynamic | Low |

---

## Fixed This Phase — ISR-Eligible After Fixes

| File | Route | Change | ISR status |
|---|---|---|---|
| `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx` | `/*/questions` | Replaced `getMarketingLocaleForDefaultRoute()` with `DEFAULT_MARKETING_LOCALE` | ✅ ISR-eligible |
| `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx` | `/*/cat` | Removed `getAuthSessionWithJwtCookieFallback()` | ✅ ISR-eligible |
| `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx` | `/*/lessons` | Replaced both `getMarketingLocaleForDefaultRoute()` calls | ✅ ISR-eligible |

**Caveat:** ISR-eligible at the page level means the page RSC payload can be cached independently. HTTP-level CDN edge caching requires the root layout (L1 above) to also stop reading cookies.

---

## Verified ISR-Safe Hub Pages (No Cookies)

| Route | Revalidate | ISR? |
|---|---|---|
| `/canada/rn/nclex-rn/flashcards` | 86400s | ✅ ISR-eligible |
| `/canada/rn/nclex-rn` (hub home) | 3600s | ✅ ISR-eligible |
| `/canada/np/cnple` | 3600s | ✅ ISR-eligible |
| `/canada/pn/rex-pn` | 3600s | ✅ ISR-eligible |
