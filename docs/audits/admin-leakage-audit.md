# Admin Leakage Audit
**Generated:** 2026-05-30  
**Status:** Pre-implementation analysis — no changes made

---

## Summary

Admin controls are present in lesson pages but are **server-gated** — they only render for staff sessions. The current implementation is not a security leak; it is a DX problem. Staff see edit controls during normal browsing because `getStaffSession()` returns truthy for any admin account, with no "View as User" toggle.

**Verdict: No security issue. Three UX fixes required.**

---

## Admin Controls Found

### Control 1 — Staff Edit Live Page Banner (2 instances)
**File:** `src/app/(app)/app/(learner)/lessons/[id]/page.tsx` lines 1202, 1321  
**Component:** `StaffEditLivePageBanner`  
**Behaviour:** Fixed-position banner (bottom-right corner) with "Edit in admin" link. Renders only when `getStaffSession()` is non-null.

**Current gate:**
```typescript
// In StaffEditLivePageBanner component:
const staff = await getStaffSession().catch(() => null);
if (!staff) return null;  // ← only staff see this
```

**Problem:** This renders for ALL staff during normal browsing. Admin users reviewing content as learners always see the edit banner, even when they want to experience the learner view.

**Fix:** Add a "View As User" mode flag (see below).

---

### Control 2 — Inline Section Editor (conditional `canEdit`)
**File:** `src/components/lessons/admin-inline-pathway-lesson-section-editor.tsx`  
**Used in:** `lessons/[id]/page.tsx` lines 1000, 1113  
**Behaviour:** When `canEdit={staffSession}` is true, inline edit controls appear within lesson content sections. Staff see pencil/edit icons embedded in the lesson body.

**Current gate:**
```typescript
// In page.tsx:
const staffSession = staffDbSessionGrantsFullLessonCatalogAccess(staff);
// ...
<PathwayLessonPremiumSectionCard
  canEdit={staffSession}   // ← edit UI shown to all staff
/>
```

**Fix:** Same "View As User" toggle as above. When `viewAsUser=true`, pass `canEdit={false}` regardless of staffSession.

---

### Control 3 — Lesson Quality Notice (`staff_qa` visibility)
**File:** `src/components/lessons/lesson-quality-notice.tsx`  
**Used in:** `lessons/[id]/page.tsx` lines 965, 1361  
**Behaviour:** A diagnostic notice about content quality that renders in `staff_qa` mode (visible to staff in development). In production, it renders as `hidden`.

**Current gate:**
```typescript
process.env.NODE_ENV === "development" ? "staff_qa" : "hidden"
```

**Status:** This is CORRECT — it's already hidden in production. No fix needed here.

---

## Root Cause

There is no "View as User" toggle that allows admin/staff to browse the platform from a learner perspective. The `admin-view-as-user.ts` library exists (`src/lib/admin/admin-view-as-user.ts`) but it is not connected to the lesson shell.

---

## Required Fix — View As User Mode

### Mechanism

Add a persisted staff preference: `viewAsUser: boolean`

When `viewAsUser = true`:
- `StaffEditLivePageBanner` returns null
- `canEdit` is forced to `false` for all lesson sections
- Admin visual indicators are hidden
- The staff sees exactly what a learner with their access tier would see

### Implementation

```typescript
// src/lib/staff/staff-view-mode.ts (new)
export type StaffViewMode = "admin" | "user";

export async function getStaffViewMode(): Promise<StaffViewMode> {
  // Read from cookie or DB preference
  const pref = await getStaffPreference("viewMode");
  return pref === "user" ? "user" : "admin";
}

export function isAdminViewMode(mode: StaffViewMode): boolean {
  return mode === "admin";
}
```

```typescript
// In lessons/[id]/page.tsx:
const [staff, viewMode] = await Promise.all([
  getStaffSession(),
  getStaffViewMode(),
]);
const staffSession = staffDbSessionGrantsFullLessonCatalogAccess(staff) 
  && isAdminViewMode(viewMode);  // ← gates all admin controls

// canEdit: false when viewAsUser is active
// StaffEditLivePageBanner: not rendered when viewAsUser is active
```

### Toggle UI

A persistent toggle in the learner shell header (visible only to staff):

```
[👤 View as User] ← staff-only chip in header
```

When active:
- Chip shows "🔧 Admin View" to toggle back
- All admin controls hidden
- Persisted in cookie for the session

---

## Admin Controls by Page

| Page | Admin Control | Current Gate | Problem |
|---|---|---|---|
| `/app/lessons/[id]` | `StaffEditLivePageBanner` × 2 | `getStaffSession()` | Staff see during normal browsing |
| `/app/lessons/[id]` | Inline section edit icons | `canEdit={staffSession}` | Staff see during normal browsing |
| `/app/lessons/[id]` | Quality diagnostic notice | `NODE_ENV === development` | ✅ Correct — hidden in prod |
| `/app/lessons` hub | `getStaffSession()` call | Used for catalog access | ✅ No UI leak |
| All pages | `StaffEditLivePageBanner` | `getStaffSession()` | Pattern repeated across routes |

---

## Priority

| Fix | Effort | Priority |
|---|---|---|
| "View as User" toggle (cookie-based) | Small | P0 |
| Gate `canEdit` on view mode | Trivial (pass `false`) | P0 |
| Gate `StaffEditLivePageBanner` on view mode | Trivial (pass null) | P0 |
| UI chip in learner shell for toggle | Small | P1 |

---

## Default Behaviour

**Proposed default:** `viewAsUser = ON` for all staff when browsing `/app/*`

Rationale: The primary reason staff browse the learner app is to check learner experience quality. Defaulting to user view means they always see what learners see, without having to remember to toggle.

Staff who need to edit can switch to Admin View for their editing session.
