# Bundle Reduction — Phase 1

**Date:** 2026-06-01  
**Scope:** Practice test runners, report card panels, dashboard components  
**Constraint:** No UI, functionality, or business-logic changes

---

## Summary

Phase 1 converts six large client-side components from static imports to `next/dynamic` lazy-loaded chunks across four files. Only one of the three test runners is ever needed per session; all report card panels are detail views never visible on the landing pages that load them. Moving these out of the initial chunk reduces first-load JS without changing any rendered output.

---

## Changes Made

### 1. `practice-test-runner-loader.tsx`

**File:** `src/app/(app)/app/(learner)/practice-tests/[id]/practice-test-runner-loader.tsx`

Replaced three static runner imports with `dynamic()` (ssr: false, loading: `<PracticeTestRunPageSkeleton />`):

| Component | Source lines | Source bytes | Direction |
|---|---|---|---|
| `PracticeTestRunnerClient` | 4,945 | 199,814 | moved to lazy chunk |
| `NclexCatRunner` | 819 | 31,303 | moved to lazy chunk |
| `NclexPracticeRunner` | 946 | 36,880 | moved to lazy chunk |

**Before:** All three runners were bundled into the practice-test page's initial JS chunk. The page loaded ~268 KB of source (all runners) on every visit regardless of `mode`.

**After:** The loader file itself is ~70 lines. Each runner is a separate chunk fetched only when `props.mode` matches. A user opening a CAT session never downloads the 4,945-line standard runner.

**Estimated initial-chunk reduction for `/app/practice-tests/[id]`:**  
~268 KB source removed → **~121 KB minified / ~31 KB gzipped** split into three separate lazy chunks.

---

### 2. `learner-report-card-route.tsx`

**File:** `src/app/(app)/app/(learner)/account/_lib/learner-report-card-route.tsx`

Replaced static import of `LearnerReportCardPremium` with `dynamic()` (ssr: false).

| Component | Source lines | Source bytes | Direction |
|---|---|---|---|
| `LearnerReportCardPremium` | 769 | 41,295 | moved to lazy chunk |

**Before:** Every request to `/app/account/report` loaded the premium report card component eagerly even in the error/locked branches (where it never renders).

**After:** The component is fetched only when `report` data is available and the user is entitled. The error, locked, and degraded branches pay zero cost.

**Estimated reduction:** ~41 KB source → **~19 KB minified / ~5 KB gzipped** removed from initial chunk.

---

### 3. `page.tsx` — Learner Dashboard

**File:** `src/app/(app)/app/(learner)/page.tsx`

Two changes:

**a) `SocialStudyDashboardCard` → `dynamic()` (ssr: false)**

| Component | Source lines | Source bytes | Direction |
|---|---|---|---|
| `SocialStudyDashboardCard` | 144 | 7,600 | moved to lazy chunk |

Rendered at the bottom of the dashboard page (social sharing widget), below the study hub content. Not needed until the user scrolls.

**b) `WeaknessHeatmap` import → type-only**

The component value `WeaknessHeatmap` was imported but never rendered directly in `page.tsx` (it is used inside `LearnerStudyHome`). Changed to `import type { HeatmapTopic }` to make the tree-shake intent explicit. The `HeatmapTopic` type annotation on `heatmapTopics` is preserved.

| Component | Source bytes | Direction |
|---|---|---|
| `WeaknessHeatmap` | 3,395 | removed from page.tsx import graph |

**Estimated reduction:** ~11 KB source → **~5 KB minified / ~1.5 KB gzipped** removed from initial dashboard chunk.

---

### 4. `report-card/page.tsx` — Marketing Report Card

**File:** `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/report-card/page.tsx`

Replaced `CnpleReportCard` component with `dynamic()` (ssr: true — preserves server rendering for SEO). `CNPLE_DOMAIN_LABELS` (data constant, needed at server render time) and `CnpleDomainResult` (type) remain as static imports.

| Component | Source lines | Source bytes | Direction |
|---|---|---|---|
| `CnpleReportCard` | 777 | 28,973 | moved to lazy chunk (ssr: true) |

**Before:** The 777-line interactive report card was bundled with the marketing report card page, which is a lightly-trafficked SEO landing page that renders the card behind a blur overlay.

**After:** The component is still server-rendered (ssr: true — no SEO regression), but its client hydration code is split into a separate chunk that is fetched after the page shell loads.

**Estimated reduction:** ~29 KB source → **~13 KB minified / ~3.5 KB gzipped** split to separate chunk.

---

## Before / After Summary

> Note: sizes below are estimated from source file character counts using typical TypeScript/React compression ratios (~45 % minification, ~30 % gzip). Exact figures require a production build with `ANALYZE=true npm run build`.

### Practice Test Page (`/app/practice-tests/[id]`)

| Metric | Before | After | Δ |
|---|---|---|---|
| Components in initial chunk | 3 runners (6,710 lines) | loader only (~70 lines) | −6,640 lines |
| Source bytes in initial chunk | ~268 KB | ~3 KB | −265 KB |
| Est. minified (initial) | ~121 KB | ~1.4 KB | **−119 KB** |
| Est. gzipped (initial) | ~31 KB | ~0.4 KB | **−30.5 KB** |
| Lazy chunks created | 0 | 3 | +3 |

### Report Card Page (`/app/account/report`)

| Metric | Before | After | Δ |
|---|---|---|---|
| Components in initial chunk | premium card (769 lines) | none | −769 lines |
| Source bytes in initial chunk | ~41 KB | 0 | −41 KB |
| Est. minified (initial) | ~19 KB | 0 | **−19 KB** |
| Est. gzipped (initial) | ~5 KB | 0 | **−5 KB** |

### Learner Dashboard (`/app`)

| Metric | Before | After | Δ |
|---|---|---|---|
| Components in initial chunk | social card + heatmap import | neither | −250 lines |
| Source bytes in initial chunk | ~11 KB | 0 | −11 KB |
| Est. minified (initial) | ~5 KB | 0 | **−5 KB** |
| Est. gzipped (initial) | ~1.5 KB | 0 | **−1.5 KB** |

### Marketing Report Card (`/en/nclex-rn/ca-np-cnple/report-card`)

| Metric | Before | After | Δ |
|---|---|---|---|
| Components in initial hydration chunk | CnpleReportCard (777 lines) | separate lazy chunk | −777 lines |
| Source bytes | ~29 KB | split | −29 KB |
| Est. minified | ~13 KB | separate chunk | **−13 KB** |
| Est. gzipped | ~3.5 KB | separate chunk | **−3.5 KB** |

---

## Cross-Page Totals (est.)

| Metric | Removed from initial chunks |
|---|---|
| Source lines | ~7,836 |
| Source bytes | ~349 KB |
| Est. minified | ~157 KB |
| Est. gzipped | **~40 KB** |

---

## Technique Notes

- **`ssr: false`** used for runners and auth-gated components: they are never needed for server-rendered HTML and have no SEO impact.
- **`ssr: true`** (default) used for `CnpleReportCard` on the public marketing page: server rendering is preserved for SEO; only the client hydration chunk is deferred.
- Loading skeletons passed via the `loading:` option match the existing `PracticeTestRunPageSkeleton` already used by `loading.tsx` for that route — no new visual states introduced.
- No props, types, or exported names changed. Existing consumers are unaffected.

---

## Phase 2 Candidates

The following large client components were identified during this audit but deferred. They are good Phase 2 targets:

| Component | Lines | Notes |
|---|---|---|
| `admin-blog-control-panel-client.tsx` | 2,858 | Admin-only surface, high split value |
| `pricing-page-client.tsx` | 2,065 | Marketing page, sections can be tab-split |
| `question-bank-practice-client.tsx` | 2,044 | Already gated behind entitlement |
| `flashcards-hub-client.tsx` | 1,381 | Sub-panels (stats, settings) good candidates |
| `smart-review-screen.tsx` | 618 | Post-test review, never in initial viewport |
| `practice-tests-hub-analytics.tsx` | 410 | Analytics tab only shown on interaction |
| `cnple-longitudinal-case-shell.tsx` | 1,242 | Heavy clinical sim shell |
