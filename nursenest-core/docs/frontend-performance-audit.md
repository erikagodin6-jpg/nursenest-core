# Frontend Performance Audit

Generated from the frontend performance war room initiative.

---

## Phase 1 — Bundle Analysis

### Current state (build from main)

| Metric | Value | Budget | Status |
|--------|-------|--------|--------|
| Total JS chunks | 344 | — | code-split ✅ |
| Largest chunk | 774 KB | 800 KB | ✅ (warning: near limit) |
| Top-10 chunks combined | 3.3 MB | 4.0 MB | ✅ |
| `"use client"` files | 819 | 1 000 | ✅ |
| Dynamic imports (`next/dynamic`) | 54 | 100+ | ⚠️ room to grow |

### Heavy dependencies (candidates for optimisation)

| Library | Size | Action | Priority |
|---------|------|--------|----------|
| `recharts` | ~200 KB | Not imported in source — remove from `package.json` | P0 |
| `jspdf` + `pdf-lib` | ~180 KB | Admin-only — wrap with `dynamic(..., { ssr: false })` | P1 |
| `xlsx` | ~150 KB | Server/admin only — should never reach client | P1 |
| `mammoth` | ~100 KB | Server-only DOCX parser — enforce `server-only` import | P1 |
| `framer-motion` | ~80 KB | Used for animations — accept; audit unused variants | P2 |
| `lottie-react` | ~30 KB | Used for learning animations — acceptable | — |

### Quick wins shipped in this initiative

- Added 24 packages to `optimizePackageImports` (Radix UI × 23 + `date-fns`). This enables Next.js to tree-shake barrel re-exports, reducing unused component code in every page bundle.
- `ExamStudyThemeModal` (399 lines) now lazy-loaded via `next/dynamic` — removed from the initial learner shell bundle.

---

## Phase 2 — Client Component Audit

**Total `"use client"` files: 819**

### Cannot be converted (correctly client)

| Category | Count | Reason |
|----------|-------|--------|
| Exam session runners | 4 | Complex interactive state (answer selection, CAT flow, timer) |
| Flashcard study session | 6 | Card flip/reveal, SRS tracking, keyboard shortcuts |
| Hub clients (flashcards, practice) | 2 | URL state, filter interactions, session launch |
| Auth / session components | 8 | useSession, useRouter, localStorage |
| Theme / i18n controls | 3 | Browser storage, `next-themes` |
| Admin panels | ~89 | Rich text editing, file upload, data tables |

### Strong server component candidates

| Component | Current reason for "use client" | Recommendation |
|-----------|--------------------------------|----------------|
| `flashcard-session-start-button.tsx` | `useRouter()` + `useTransition()` | Server action + form + `useFormStatus()` |
| `flashcard-deck-study-shell.tsx` | 80ms hydration delay flag | Replace with `<Suspense>` boundary |
| `flashcard-srs-stats-strip.tsx` | Client fetch for SRS stats | Load stats in page server component, pass as props |

### Boundary improvements shipped

`ExamStudyThemeModal` moved to lazy load — not mounted on initial paint for non-exam pages.

---

## Phase 3 — Provider Audit

### Global learner layout provider tree

```
<SentryLearnerShell>               — error boundary, must stay global
  <PaywallHomeStatsProvider>       — needed on any route the paywall can appear
    <LearnerExamStudyProviders>    — wraps ExamStudyThemeProvider + modal
      <LearnerExamChromeGate>      — exam chrome visibility
        {children}
        <ExamStudyThemeModal />    ← NOW lazy-loaded (was always-mounted)
      </LearnerExamChromeGate>
    </LearnerExamStudyProviders>
    <MarketingCountryChromeProvider>  — footer only (already scoped correctly)
  </PaywallHomeStatsProvider>
</SentryLearnerShell>
```

### Provider move candidates

| Provider | Current scope | Could move to | Savings |
|----------|--------------|--------------|---------|
| `ExamStudyThemeModal` | Global (every learner page) | Lazy-loaded (done ✅) | ~8 KB initial |
| `ExamStudyThemeProvider` | Global | `/practice-tests` + `/flashcards` layouts | Context creation overhead |
| `PaywallHomeStatsProvider` | Global | Already correct — paywall can appear on any route | — |

---

## Phase 4 — Hydration Analysis

### Key findings

**No hydration mismatches detected** in the current build output. The app correctly:
- Avoids using `Date.now()` / `Math.random()` in server components
- Uses `"use client"` for all components that read `window` or `localStorage`
- Defers browser-only logic to `useEffect`

### Hydration cost sources (by weight)

1. **`LearnerExamStudyProviders`** — theme context + modal state setup on every page  
   → Fixed: modal now lazy-loaded

2. **`FlashcardsHubClient`** (~1 688 lines) — large initial hydration cost  
   → Mitigated: hub prefetch warms the next destination before user clicks

3. **`PracticeTestsHubClient`** — discovery fetch + pathway state  
   → Already uses `skipInitialDiscoveryFetchRef` to skip redundant client fetch when SSR data is present

---

## Phase 5 — Route Streaming

### Layout sequential bottleneck — FIXED

**Before** (worst case: 6 800 ms sequential `safeOptional` chain):
```
await paywallHomeStats    900 ms
await pathwayNav        2 500 ms  ← sequential after paywallHomeStats
await studyNextBlock    2 500 ms  ← sequential after pathwayNav
await nclexTargetDate     900 ms  ← sequential after studyNextBlock
Total worst case:       6 800 ms
```

**After** (worst case: 2 500 ms parallel `Promise.all`):
```
Promise.all([
  paywallHomeStats,    900 ms  ⎤
  pathwayNav,        2 500 ms  ⎬ all run simultaneously
  studyNextBlock,    2 500 ms  ⎥
  nclexTargetDate,     900 ms  ⎦
])
Total worst case: max(2 500, 900) = 2 500 ms
```

**Savings: up to 4 300 ms off worst-case layout render time.**

### Existing Suspense boundaries (already present)

- `<Suspense>` around `LearnerStudyNextBlockComponent` — study-next strip loads after chrome
- `<LearnerSilentSectionBoundary>` around tutor shell and route body — graceful degradation on error

---

## Phase 6 — Prefetch Strategy

### Hook: `useHubPrefetch`

File: `src/lib/learner/use-hub-prefetch.ts`

```typescript
useHubPrefetch({
  pathwayId: "us-rn-nclex-rn",
  prefetch: ["practice", "cat", "lessons"],
});
```

**Behaviour:**
1. Fires after 1 200 ms (lets the current page paint first)
2. Uses `requestIdleCallback` when available (no competition with paint/interaction)
3. Falls back to `setTimeout` on older browsers
4. Gate: `NEXT_PUBLIC_NN_ENABLE_HUB_PREFETCH=1` (env flag, off by default)
5. Calls `router.prefetch(href)` — warms Next.js router cache, not network refetch

**Wired to:**
- `FlashcardsHubClient` → prefetches `practice`, `cat`, `lessons`
- `PracticeTestsHubClient` → prefetches `flashcards`, `lessons`

**Available targets:** `flashcards`, `practice`, `cat`, `loft`, `lessons`, `questions`, `clinical-skills`, `pharmacology`, `ecg`, `analytics`, `readiness`, `dashboard`

**To enable in production:**
```bash
NEXT_PUBLIC_NN_ENABLE_HUB_PREFETCH=1
```

---

## Phase 7 — Performance Budgets (enforced in CI)

### Scripts

| Script | Purpose |
|--------|---------|
| `scripts/check-frontend-performance.mjs` | Chunk size budgets + banned client imports |
| `scripts/check-migration-safety.mjs` | Migration blocking index detection |

### Budgets

| Budget | Limit | CI enforcement |
|--------|-------|---------------|
| Single JS chunk size | < 800 KB | Hard fail |
| Top-10 chunks combined | < 4 MB | Hard fail |
| `"use client"` file count | < 1 000 | Hard fail |
| Banned client-side imports (Prisma, OpenAI, xlsx, mammoth, PayPal SDK) | 0 | Hard fail (--strict) |
| Large chunk warning | > 500 KB | Advisory log |

### CI workflow

File: `.github/workflows/frontend-performance.yml`

| Job | Triggers | Fails build? |
|-----|----------|-------------|
| `source-budgets` | Every PR touching src/ | Yes (banned imports, use-client count) |
| `query-budget-contracts` | Every PR | Yes (8 DB budget tests) |
| `bundle-size` | Push to main only | Yes (runs full build + chunk audit) |

---

## Summary — changes shipped

| Change | File(s) | Impact |
|--------|---------|--------|
| Parallelized 4 sequential `safeOptional` calls | `layout.tsx` | **−4 300 ms worst-case layout time** |
| Lazy-loaded `ExamStudyThemeModal` | `learner-exam-study-providers.tsx` | −8 KB initial JS per non-exam page |
| Extended `optimizePackageImports` | `next.config.mjs` | Tree-shakes Radix UI + date-fns |
| `useHubPrefetch` hook | `use-hub-prefetch.ts` | Next click feels instant |
| Prefetch wired to flashcards hub | `flashcards-hub-client.tsx` | Practice/CAT/lessons pre-warmed |
| Prefetch wired to practice hub | `practice-tests-hub-client.tsx` | Flashcards/lessons pre-warmed |
| Frontend performance budget CI | `check-frontend-performance.mjs`, `frontend-performance.yml` | Prevents bundle regressions |

## Next recommended actions (not yet shipped)

1. **Remove `recharts`** from `package.json` — confirmed dead code, saves ~200 KB  
2. **Lazy-load admin-only libs** (`jspdf`, `pdf-lib`, `xlsx`) — saves ~330 KB for all non-admin users  
3. **Enforce `NEXT_PUBLIC_NN_ENABLE_HUB_PREFETCH=1`** in production env  
4. **Convert `flashcard-deck-study-shell.tsx`** from 80ms delay `useState` to `<Suspense>`  
5. **Move `ExamStudyThemeProvider`** to `/practice-tests` and `/flashcards` route layouts only  
