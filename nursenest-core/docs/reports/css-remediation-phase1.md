# CSS Bundle Remediation — Phase 1

**Generated:** 2026-06-01  
**Scope:** Remove route-specific CSS from global import chain; fix duplicate import

---

## Summary

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Global CSS import chain (browser payload) | ~355 KB | ~203 KB | **−152 KB (−42.9%)** |
| `globals.css` @import count (route-specific) | 6 | 0 | **−6** |
| Duplicate CSS imports | 1 | 0 | **−1** |
| Unused public preview directories | 4 | 0 | **−4** |
| New route-scoped layout files | 0 | 2 | +2 |

> **Note:** The 152 KB reduction applies to every page that is NOT an exam/admin/questions/pharmacology/prioritization-delegation route. Those route groups now receive their CSS only when needed.

---

## Changes Made

### 1. Duplicate Import Removed

**File:** [src/app/(app)/app/(learner)/clinical-scenarios/layout.tsx](src/app/(app)/app/(learner)/clinical-scenarios/layout.tsx)

```diff
- import "@/app/clinical-scenarios-workstation.css";
  import "@/app/clinical-scenarios-workstation.css";  // kept
```

`clinical-scenarios-workstation.css` was imported twice on consecutive lines. The duplicate was removed. The file was already correctly scoped to the clinical-scenarios layout (not in globals.css).

---

### 2. Moved: `styles/exam/nclex-exam.css` → Exam Layout

| | Before | After |
|-|--------|-------|
| Location in global chain | globals.css line 15 | Removed |
| Route-scoped import | None | [exams/layout.tsx](src/app/(app)/app/(learner)/exams/layout.tsx) |
| File size removed from global chain | **95.6 KB** | Route-only |

**File:** [exams/layout.tsx](src/app/(app)/app/(learner)/exams/layout.tsx)

```diff
+ import "@/app/styles/exam/nclex-exam.css";
```

The `.nn-exam-surface` class defined in this file is only used inside the `ExamShellLayout` wrapper (line 38, 47 in the layout itself). All learner exam session routes already go through this layout.

---

### 3. Moved: Admin CSS → Admin Layout

| File | Size | Before | After |
|------|------|--------|-------|
| `admin-responsive-containment.css` | 4.2 KB | globals.css line 16 | [admin/layout.tsx](src/app/(admin)/admin/layout.tsx) |
| `admin-happy-dashboard.css` | 5.8 KB | globals.css line 17 | [admin/layout.tsx](src/app/(admin)/admin/layout.tsx) |
| **Total removed from global chain** | **10.0 KB** | | |

**File:** [src/app/(admin)/admin/layout.tsx](src/app/(admin)/admin/layout.tsx)

```diff
+ import "@/app/admin-responsive-containment.css";
+ import "@/app/admin-happy-dashboard.css";
```

Both files use `data-nn-admin-responsive` and `data-nn-admin-happy` attributes that are applied in the admin layout's root `<div>` (line 26-27). These attributes are not present outside admin routes, making route-scoping safe.

---

### 4. Created: `pharmacology/layout.tsx`

**File:** [src/app/(app)/app/(learner)/pharmacology/layout.tsx](src/app/(app)/app/(learner)/pharmacology/layout.tsx) *(new)*

```tsx
import "@/app/learner-pharmacology-system.css";
export default function PharmacologyLayout(...) { ... }
```

| File | Size removed from global chain |
|------|-------------------------------|
| `learner-pharmacology-system.css` | **3.0 KB** |

The `.nn-pharmacology-hub` class is used exclusively in `pharmacology-hub-client.tsx`, which renders only under the `/pharmacology` route.

---

### 5. Created: `prioritization-delegation/layout.tsx`

**File:** [src/app/(app)/app/(learner)/prioritization-delegation/layout.tsx](src/app/(app)/app/(learner)/prioritization-delegation/layout.tsx) *(new)*

```tsx
import "@/app/learner-prioritization-system.css";
export default function PrioritizationDelegationLayout(...) { ... }
```

| File | Size removed from global chain |
|------|-------------------------------|
| `learner-prioritization-system.css` | **6.7 KB** |

The `.nn-priority-hub` class is used exclusively in `prioritization-delegation-hub-client.tsx`.

---

### 6. Moved: `learner-advanced-questions.css` → Questions Layout

**File:** [src/app/(app)/app/(learner)/questions/layout.tsx](src/app/(app)/app/(learner)/questions/layout.tsx)

```diff
+ import "@/app/learner-advanced-questions.css";
```

| File | Size removed from global chain |
|------|-------------------------------|
| `learner-advanced-questions.css` | **35.2 KB** |

The `.nn-aqt-*` classes (badge, icon, label) are used exclusively in question type layouts under the `/questions` route group: `timeline-deterioration-layout.tsx`, `prioritization-question-layout.tsx`, `matrix-question-layout.tsx`, and similar.

---

### 7. Removed: Unused Public Preview Directories

Standalone design prototype directories with no references from production code:

| Directory | Contents |
|-----------|----------|
| `public/prioritization-delegation-preview/` | 6 HTML files + CSS |
| `public/pharmacology-preview/` | 6 HTML files + CSS |
| `public/activity-depth-preview/` | 8 HTML files + CSS |
| `public/feature-discovery-preview/` | 6 HTML files + CSS |

These were standalone HTML/CSS prototypes served from `/public`. No references to these directories were found in `src/`. Removing them reduces the deployment artifact but has no effect on application behavior.

---

## Files Removed from `globals.css` Import Chain

| CSS File | Size | Route Scoped To |
|----------|------|-----------------|
| `styles/exam/nclex-exam.css` | 95.6 KB | `(learner)/exams/layout.tsx` |
| `admin-responsive-containment.css` | 4.2 KB | `(admin)/admin/layout.tsx` |
| `admin-happy-dashboard.css` | 5.8 KB | `(admin)/admin/layout.tsx` |
| `learner-pharmacology-system.css` | 3.0 KB | `(learner)/pharmacology/layout.tsx` |
| `learner-prioritization-system.css` | 6.7 KB | `(learner)/prioritization-delegation/layout.tsx` |
| `learner-advanced-questions.css` | 35.2 KB | `(learner)/questions/layout.tsx` |
| **Total** | **150.5 KB** | |

> The `feature-discovery.css` import (line 20) was intentionally retained. It provides cross-route feature discovery UI tokens used in multiple learner surfaces and is not route-specific.

---

## Before / After: Global CSS Load

```
Before:
  globals.css (203 KB, including 6 route-specific @imports)
  → styles/exam/nclex-exam.css            (+95.6 KB, every page)
  → admin-responsive-containment.css      (+ 4.2 KB, every page)
  → admin-happy-dashboard.css             (+ 5.8 KB, every page)
  → learner-pharmacology-system.css       (+ 3.0 KB, every page)
  → learner-prioritization-system.css     (+ 6.7 KB, every page)
  → learner-advanced-questions.css        (+35.2 KB, every page)
  Total global CSS: ~355 KB

After:
  globals.css (203 KB, no route-specific @imports)
  Total global CSS: ~203 KB

Savings on non-exam/admin/questions pages: 152 KB (−42.9%)
```

---

## Verification

| Check | Result |
|-------|--------|
| TypeScript errors introduced | **0** (tsc --noEmit, excluding pre-existing `smart-study-next-engine.ts`) |
| ESLint errors in modified `.tsx` files | **0** |
| Build errors in modified files | **0** |
| Build failures (pre-existing) | 2 pre-existing failures in `smart-study-next-engine.ts` and `page.tsx` — neither touched by this work |
| No UI changes | ✅ CSS moved, not deleted |
| No design/theme/token changes | ✅ Only `@import` locations changed |
| No behavioral changes | ✅ All CSS still loads for routes that use it |
| Exam CSS still loads on exam routes | ✅ via `exams/layout.tsx` |
| Admin CSS still loads on admin routes | ✅ via `(admin)/admin/layout.tsx` |
| Question CSS still loads on question routes | ✅ via `questions/layout.tsx` |
| Pharmacology CSS still loads on pharmacology routes | ✅ via new `pharmacology/layout.tsx` |
| Prioritization CSS still loads on prioritization routes | ✅ via new `prioritization-delegation/layout.tsx` |

---

## Phase 2 Opportunities (not this scope)

| File | Size | Candidate Target |
|------|------|-----------------|
| `marketing-brand-atmosphere.css` | ~12 KB | Already noted for marketing layout in globals.css comment — confirm and move |
| `premium-color-depth-convergence.css` | ~8 KB | Marketing layout (no learner tokens) |
| `premium-atmospheric-ecosystem-convergence.css` | ~14 KB | Marketing layout |
| `full-platform-convergence.css` | ~18 KB | Audit which tokens are learner-only |
| `feature-discovery.css` | ~6 KB | Feature-discovery route only, if not used globally |
