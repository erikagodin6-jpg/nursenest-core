# Shared component duplication audit — NurseNest

**Method:** Static search of `nursenest-core/src/components`, learner/marketing/study surfaces, and representative `src/app` consumers. **No refactors** in this pass.

**Columns:** Component paths | Duplication severity | Runtime risk | Maintenance cost | Bundle impact | SAFE_FOR_AI / DEV_ONLY | Suggested canonical

**Severity:** High (parallel systems / copy-paste shells) · Medium (overlap but documented) · Low (thin wrappers)

---

## 1. Card systems (marketing + learner + pathway)

| Component paths | Severity | Runtime risk | Maintenance cost | Bundle impact | Tag | Suggested canonical |
|-----------------|----------|--------------|------------------|----------------|-----|---------------------|
| `src/components/ui/study-card.tsx` (`StudyCard`, hub/list/app surfaces) | **Medium** (intended unifier; not universally adopted) | Low | Medium | Single large module; consumers pull one entry | SAFE_FOR_AI | **`StudyCard`** for pathway/marketing list + hub cards; document where *not* to hand-roll `nn-study-card`. |
| `src/components/student/product/lesson-card.tsx` (`LessonCard`) | Low | Low | Low | Small | SAFE_FOR_AI | Keep as thin wrapper over shared chips/meta (`MetaRow`, `StatusBadge` per file comment); prefer **`StudyCard`** for new list rows if parity achieved. |
| `src/components/pathway-lessons/lesson-system-card.tsx`, `lesson-row.tsx` | Medium | Low | Medium | Medium | SAFE_FOR_AI | Converge list rows toward **`StudyCard` surface=`list`** or **`LessonCard`**; avoid third bespoke row pattern. |
| `src/components/pathway-lessons/pathway-lessons-grouped-hub.tsx` (inline `nn-study-card` / NP-specific markup) | **High** | Low | **High** | Duplicates class strings alongside `StudyCard` | SAFE_FOR_AI | **`StudyCard`** + composition slots for “related lessons” NP block. |
| `src/components/learner-ui/learner-study-card.tsx` vs `src/components/ui/learner-surface-card.tsx` | **High** (near-identical `lv-card` variant maps) | Low | **High** (two APIs, same CSS) | Small duplicate logic | SAFE_FOR_AI | **One** `LvCard` (or extend `LearnerStudyCard` with `...rest` like `LearnerSurfaceCard`) in `learner-ui/`; deprecate the other. |
| `src/components/learner-ui/learner-surface.tsx` + stat/report patterns | Medium | Low | Medium | Learner bundle | SAFE_FOR_AI | Keep **`LearnerSurface`** for section chrome; avoid new bordered `div` shells on dashboard. |
| `src/components/ui/card` usage (`@/components/ui/card`) | Low (sparse) | Low | Low | shadcn Card rarely used vs custom | SAFE_FOR_AI | Either adopt shadcn **`Card`** for admin/marketing only, or document “no shadcn Card on learner study”. |
| Admin `StatCard` inline in `src/components/admin/seo/admin-seo-hub-client.tsx` | Medium | Low | Medium | Local to file | DEV_ONLY | Extract shared **`AdminMetricCard`** or reuse learner analytics tile if styles align. |

---

## 2. Lesson layouts and lesson detail shells

| Component paths | Severity | Runtime risk | Maintenance cost | Bundle impact | Tag | Suggested canonical |
|-----------------|----------|--------------|------------------|----------------|-----|---------------------|
| Marketing: `.../lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx` + `pathway-lesson-detail-header.tsx` + `pathway-lesson-detail-deferred.tsx` + `pathway-lesson-detail-loading-fallback.tsx` | **Medium** (split across many files; intentional streaming) | Medium — Suspense boundaries must stay correct | High surface area | RSC splits help bundle | SAFE_FOR_AI | Treat **`PathwayLessonDetailPageBody`** tree as canonical **marketing** lesson detail; avoid parallel “second detail” page bodies. |
| Learner: `src/components/student/premium-lesson-shell.tsx` + `src/app/(student)/app/(learner)/lessons/[id]/page.tsx` | **Medium** (separate product shell vs marketing) | Medium — entitlement + paywall | High | Learner chunk | SAFE_FOR_AI | Document **two canonicals**: marketing detail vs **in-app `PremiumLessonShell`**; share *content* components only where types align. |
| `src/components/pre-nursing/pre-nursing-lesson-template-v2.tsx` | Medium | Low | Medium | Separate template | SAFE_FOR_AI | Keep vertical-specific template; extract shared **lesson prose / media** primitives if duplication with pathway detail grows. |
| `src/components/labs/lab-lesson-page.tsx`, `src/components/med-calculations/med-calculations-lesson-page.tsx` | Medium | Low | Medium | Per-feature pages | SAFE_FOR_AI | Shared **`LessonPageFrame`** (title, paywall slot, content width) if markup diverges further. |

---

## 3. Buttons and CTA patterns

| Component paths | Severity | Runtime risk | Maintenance cost | Bundle impact | Tag | Suggested canonical |
|-----------------|----------|--------------|------------------|----------------|-----|---------------------|
| Repeated `className="nn-btn-primary inline-flex min-h-[2.5rem]..."` across `practice-test-runner-client.tsx`, `practice-tests-hub-client.tsx`, `question-bank-practice-client.tsx`, `practice-question-session-client.tsx`, `study/*`, `admin/*`, `signup-form.tsx`, `onboarding/trial-onboarding-flow.tsx`, etc. | **High** | Low (mostly styling drift) | **High** | Many long class strings inlined | SAFE_FOR_AI | **`Button`** variant tokens or small wrappers: `LearnerPrimaryButton`, `LearnerSecondaryButton`, `MarketingPrimaryLink` built on one base. |
| `src/components/learner-ui/learner-cta-link.tsx` | Low | Low | Low | Small | SAFE_FOR_AI | Expand use for learner CTAs instead of raw `Link`+`nn-btn-*`. |

---

## 4. Loaders and loading fallbacks

| Component paths | Severity | Runtime risk | Maintenance cost | Bundle impact | Tag | Suggested canonical |
|-----------------|----------|--------------|------------------|----------------|-----|---------------------|
| `src/components/skeletons/hub-page-skeleton.tsx` (`PracticeTestRunPageSkeleton`, etc.) | Low (centralized skeleton file) | Low | Low | Single module | SAFE_FOR_AI | Extend this file or sibling **`skeletons/*`** for new hub-sized loads. |
| `pathway-lesson-detail-loading-fallback.tsx` vs `PathwayLessonDetailHeaderSkeleton` / deferred skeleton | Medium | Low | Medium | Multiple fallbacks | SAFE_FOR_AI | One **lesson detail skeleton family** re-exported from `components/lessons/skeletons.ts` pattern. |
| Ad-hoc `"Loading…"` / `setLoading` in large clients: `practice-tests-hub-client.tsx`, `flashcard-custom-study-client.tsx`, `admin-observability-learner-roster.client.tsx`, `pricing-page-client.tsx` (`PricingPlanGridSkeleton` local), etc. | **Medium** | Low | Medium | Inline text not i18n-unified everywhere | SAFE_FOR_AI | **`LearnerLoadingInline`** + **`useAsyncStatus`** hook or reuse skeleton components. |

---

## 5. Mobile nav and drawers

| Component paths | Severity | Runtime risk | Maintenance cost | Bundle impact | Tag | Suggested canonical |
|-----------------|----------|--------------|------------------|----------------|-----|---------------------|
| `src/components/layout/site-header.tsx` — full-screen mobile nav drawer (`nn-drawer-slide-in`) | **High** (large inline tree) | **Medium** — focus trap, scroll, z-index | **High** | Header chunk heavy | SAFE_FOR_AI | Extract **`SiteHeaderMobileDrawer`** presentational component; keep data in header. |
| `src/components/layout/mobile-context-drawer.tsx` (`nn-drawer-slide-up`) | Medium | Medium | Medium | Dynamic import from header | SAFE_FOR_AI | Shared **`NnDrawerShell`** (animation + positioning) for slide-up vs slide-in variants. |
| `src/components/onboarding/exam-selector.tsx` (drawer-like mobile sheet classes) | Medium | Low | Medium | Duplicates animation tokens | SAFE_FOR_AI | Reuse **`NnDrawerShell`** or shared bottom-sheet primitive. |
| `src/components/admin/admin-nav-client.tsx` (admin drawer) | Medium | Low | Medium | Admin-only | DEV_ONLY | Optional alignment with marketing drawer shell for consistency only. |
| `src/components/lessons/lesson-notes-drawer.tsx` (desktop side + mobile) | Medium | Low | Medium | Learner | SAFE_FOR_AI | Keep domain-specific; share only **motion + overlay** primitives if extracted. |

---

## 6. Modals and dialogs

| Component paths | Severity | Runtime risk | Maintenance cost | Bundle impact | Tag | Suggested canonical |
|-----------------|----------|--------------|------------------|----------------|-----|---------------------|
| Native `<dialog>` + `HTMLDialogElement` in `practice-test-runner-client.tsx`, `admin-command-palette-client.tsx`, `editable-inline-client.tsx` | **Medium** (no shared `@/components/ui/dialog`) | Medium — accessibility consistency | Medium | Per-feature | SAFE_FOR_AI | Optional **`NnDialog`** wrapper (open/close, backdrop, focus) *if* product wants one pattern; audit a11y per surface. |
| `src/components/exam/exam-study-theme-modal.tsx` | Low | Low | Low | Exam feature | SAFE_FOR_AI | Keep feature-owned until 3+ modals need same shell. |

---

## 7. Dashboard widgets and stats

| Component paths | Severity | Runtime risk | Maintenance cost | Bundle impact | Tag | Suggested canonical |
|-----------------|----------|--------------|------------------|----------------|-----|---------------------|
| `src/components/student/progress/progress-cards.tsx` (`ResponsiveStatRow`) | Medium | Low | Medium | Progress dashboard | SAFE_FOR_AI | **`ResponsiveStatRow`** as layout primitive; pair with **`LearnerStatCard`** (alias of `AnalyticsMetricTile`). |
| `src/components/student/product/analytics-metric-tile.tsx` ← `learner-stat-card.tsx` re-export | Low (good indirection) | Low | Low | Single implementation | SAFE_FOR_AI | **`AnalyticsMetricTile`** / **`LearnerStatCard`** stays canonical metric tile. |
| `src/components/student/learner-study-home.tsx` — multiple `LearnerSurface` sections | Low | Low | Medium | Dashboard | SAFE_FOR_AI | **`LearnerSurface`** + **`LearnerStudySurfaceSection`** per barrel exports. |

---

## 8. Entitlement and paywall wrappers

| Component paths | Severity | Runtime risk | Maintenance cost | Bundle impact | Tag | Suggested canonical |
|-----------------|----------|--------------|------------------|----------------|-----|---------------------|
| `src/components/student/subscription-paywall.tsx` — full-route paywall for learner pages | **High** (many page-level imports) | **High** — wrong context string affects messaging | Medium | Shared client chunk | SAFE_FOR_AI | Keep as **canonical full-page paywall** for `/app` routes; centralize context enum + tests. |
| `src/components/study/premium-gate.tsx` — `PremiumLockCard`, `LockedPreviewCard`, `EntitledSection`, `ContextualPaywallCard`, impressions | **High** (second paywall *language*) | **Medium** — two analytics patterns (`posthog` vs other) | **High** | Large module | SAFE_FOR_AI | **`premium-gate`** for *inline* locks / previews inside study surfaces; **`SubscriptionPaywall`** for *route-level* block; document matrix; align CTA labels with `subscription-paywall` where they compete. |
| `resolveEntitlementForPage` (server) + page-level checks vs gate components | Medium | **High** if client assumes access | High | N/A | SAFE_FOR_AI | Server resolution remains source of truth; gates are **presentation only**. |

---

## 9. Forms

| Component paths | Severity | Runtime risk | Maintenance cost | Bundle impact | Tag | Suggested canonical |
|-----------------|----------|--------------|------------------|----------------|-----|---------------------|
| Large admin clients (`admin-*-client.tsx`) with local `useState` field batches vs `src/components/auth/signup-form.tsx` patterns | Medium | Medium validation drift | High | Admin bundles large | DEV_ONLY (admin-heavy) | When adding forms, prefer one **Zod + shared field components** convention (documented); no single `react-hook-form` baseline detected in components grep. |

---

## Summary counts (indicative, not exhaustive)

- **`StudyCard` / lesson list family:** 1 canonical `StudyCard` + several pathway/learner variants and **one large inline hub** (NP) — **highest card duplication risk**.
- **`LearnerStudyCard` vs `LearnerSurfaceCard`:** **highest trivial duplication** (duplicate variant maps).
- **`nn-btn-*` inline:** widespread — **highest CTA maintenance cost**.
- **Paywall:** **two major systems** (`subscription-paywall` vs `premium-gate`) — **highest product-risk duplication** for messaging and analytics.
