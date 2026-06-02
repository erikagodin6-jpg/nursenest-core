# CAT Entry Point Validation Report

**Generated:** 2026-06-01  
**Status:** ALL ENTRY POINTS VERIFIED — routing is correct

---

## Summary

Every CAT entry point in the application correctly routes to `/app/practice-tests?catLaunch=1` (with optional `pathwayId` parameter). No broken redirects or missing aliases found.

---

## Entry Points Audited

### 1. `/app/cat` — Direct CAT Alias

**File:** `src/app/(app)/app/(learner)/cat/page.tsx`  
**Status:** ✅ Correct

Accepts all query params except `catLaunch` (stripped to prevent duplication), then injects `catLaunch=1` and redirects to `/app/practice-tests`.

```
/app/cat                          → /app/practice-tests?catLaunch=1
/app/cat?pathwayId=us-np-fnp      → /app/practice-tests?pathwayId=us-np-fnp&catLaunch=1
/app/cat?pathwayId=us-np-pmhnp    → /app/practice-tests?pathwayId=us-np-pmhnp&catLaunch=1
```

### 2. `/app/practice-tests?catLaunch=1` — Canonical CAT Hub

**File:** `src/app/(app)/app/(learner)/practice-tests/page.tsx`  
**Status:** ✅ Correct

The `catLaunch` param is read by `isTruthyParam()` and passed as `catRequested=true` to the practice tests hub client. This activates the CAT launcher overlay within the hub rather than the question-bank mode.

### 3. `/app/practice-tests/cat-launch` — Legacy Direct Launch

**File:** `src/app/(app)/app/(learner)/practice-tests/cat-launch/page.tsx`  
**Status:** ✅ Correct (deprecated but functional)

Marked `@deprecated` — all new flows should use `/app/practice-tests?pathwayId=...`. Validates `pathwayId` (alphanumeric, 3–80 chars) before redirecting. CNPLE routes to `/app/cases/cnple` instead.

```
/app/practice-tests/cat-launch?pathwayId=us-np-fnp  → /app/practice-tests?pathwayId=us-np-fnp&catLaunch=1
/app/practice-tests/cat-launch?pathwayId=ca-np-cnple → /app/cases/cnple  (LOFT bypass)
```

### 4. `/app/practice-exams` — Legacy Practice Alias

**File:** `src/app/(app)/app/(learner)/practice-exams/page.tsx`  
**Status:** ✅ Correct

Forwards all query params to `/app/practice-tests`. Does NOT inject `catLaunch=1` — this is by design, since `practice-exams` is a generic hub alias, not a CAT-specific entry.

### 5. Dashboard / Command Center (Personalized)

**File:** `src/lib/learner/personalized-command-center.ts:192`  
**Status:** ✅ Correct

When a learner's readiness score reaches ≥ 70, the command center adds a "Mini CAT" activity:

```typescript
href: pathwayHref("/app/cat", preferredPathwayId)
// expands to: /app/cat?pathwayId=us-np-fnp (or user's current pathway)
// redirects to: /app/practice-tests?pathwayId=us-np-fnp&catLaunch=1
```

### 6. Study Plan Page

**File:** `src/app/(app)/app/(learner)/study-plan/page.tsx`  
**Status:** ✅ Database-gated, correct

The study plan page uses `isDatabaseUrlConfigured()` guard before any DB queries. Components rendered (`StudyPlanToolGateway`, `AdaptiveStudyOverview`, etc.) surface CAT links through the same `pathwayHref("/app/cat", id)` pattern from the command center logic.

### 7. Marketing CAT Pages

**Files:** `src/lib/exam-pathways/practice-exams-cat-start.ts`  
**Status:** ✅ Correctly scoped per pathway

Marketing CAT pages (`/us/np/fnp/cat`, `/us/np/pmhnp/cat`, etc.) use `marketingCatPathForPathway()` to generate correct URLs. After sign-in, the callback returns to the marketing CAT page (not directly to `/app/practice-tests`), which then drives the user into the app via `appPathwayCatSessionStartPath`.

---

## NP-Specific CAT Routing

All five US NP specialties and the Canadian NP track have full CAT routing configured:

| Pathway | Catalog Status | Uses CAT Engine | acquisitionMode | CAT Routing |
|---------|---------------|-----------------|-----------------|-------------|
| `us-np-fnp` | active | ✅ | subscribe | ✅ `/us/np/fnp/cat` |
| `us-np-agpcnp` | active | ✅ | subscribe | ✅ `/us/np/agpcnp/cat` |
| `us-np-pmhnp` | active | ✅ | subscribe | ✅ `/us/np/pmhnp/cat` |
| `us-np-whnp` | active | ✅ | subscribe | ✅ `/us/np/whnp/cat` |
| `us-np-pnp-pc` | active | ✅ | subscribe | ✅ `/us/np/pnp-pc/cat` |
| `ca-np-cnple` | active | ❌ (LOFT) | subscribe | `/canada/np/cnple/cat` → simulation redirect |

CNPLE uses the LOFT engine (linear case simulation), not CAT. The `/canada/np/cnple/cat` route redirects to `/canada/np/cnple/simulation`.

---

## E2E Test Classification

The e2e test at `tests/e2e/cat/cat-entrypoints.spec.ts` classifies NP pathways as `unavailableButPathwayScopedCatPathwayIds` for `us-np-fnp` and `us-np-pmhnp`. This is a test-time label meaning "may or may not show sign-in CTA depending on pool status" — not a routing bug. The test verifies:

- The page stays pathway-scoped (shows lessons + questions links)
- If a sign-in button exists, its `callbackUrl` is correct
- No "tampered pathway" behavior

---

## Sidebar / Navigation

No direct CAT link exists in the sidebar nav (`src/components/layout/`). CAT is surfaced through:
- Dashboard command center
- Practice Tests hub (`/app/practice-tests`)
- Study plan components

This is intentional — CAT is not a primary nav item but a contextual action based on readiness.

---

## URL Map (All Routes That Launch CAT)

```
/app/cat                                         → /app/practice-tests?catLaunch=1
/app/cat?pathwayId={id}                          → /app/practice-tests?pathwayId={id}&catLaunch=1
/app/practice-tests?catLaunch=1                  → CAT hub (canonical)
/app/practice-tests?pathwayId={id}&catLaunch=1   → CAT hub (pathway-scoped)
/app/practice-tests/cat-launch?pathwayId={id}    → /app/practice-tests?pathwayId={id}&catLaunch=1
/app/practice-exams?catLaunch=1                  → /app/practice-tests?catLaunch=1
```

All routes resolve correctly. No missing or broken CAT entry points detected.
