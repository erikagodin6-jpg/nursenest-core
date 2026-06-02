# Hydration boundary audit — NurseNest (audit only)

**Goal:** Map where **client JavaScript** attaches and where **large props** could cross the server/client seam. **No fixes** in this pass.

**Legend:** **R** = React Server Component default · **C** = `"use client"` subtree

---

## 1. App root (`src/app/layout.tsx`)

| Layer | Type | Hydration note |
|-------|------|----------------|
| `AuthSessionProvider`, `AppThemeProvider` | **C** (typical) | Whole app pays theme + session context cost once. |
| Global CSS | R | N/A |

**Risk:** Low structural risk; standard Next pattern.

---

## 2. Marketing (`(marketing)/(default)/layout.tsx`, `[locale]/layout.tsx`)

| Layer | Type | Hydration note |
|-------|------|----------------|
| Default + locale layouts | **R** with `dynamic = "force-dynamic"` | No static HTML cache — TTFB depends on layout data. |
| `MarketingI18nProvider` / shards (`marketing-main-i18n-shards.tsx`, `MarketingI18nShardLayer`) | **C** | Nested providers merge message records on the client (`useMemo` in `MarketingI18nShardLayer`). **Every marketing page** under provider pays hydration for i18n context. |
| `SiteHeader`, `SiteFooter` | **C** | Header ~1.1k lines — mobile drawer + deferred chunks still hydrate shell chrome. |
| Motion (`MarketingMobileMotionShell`, etc.) | **C** | Adds hydration + `prefers-reduced-motion` handling. |

**Highest marketing risk:** Header + i18n provider wrapping large `{children}` — **wide boundary**.

---

## 3. Learner app (`(student)/app/(learner)/layout.tsx`)

| Layer | Type | Hydration note |
|-------|------|----------------|
| Layout overall | **R** | Fetches session, entitlement, paywall stats, pathway metadata, optional study-next, tutor. |
| `SentryLearnerShell` | **C** | Observability wrapper around entire shell. |
| `PaywallHomeStatsProvider` | **C** | Context for paywall surfaces. |
| `LearnerExamStudyProviders` + `LearnerExamChromeGate` | **C** | Exam chrome context. |
| Sticky chrome stack: `LearnerShellBrandHomeLink`, `LearnerShellUserBar`, `LearnerShellLanguageControl`, `LearnerThemeControl`, `LearnerShellDesktopStudyLinks`, `LearnerShellMobileBottomNav`, `LearnerStudyPathStrip`, … | **C** | **Large fixed hydration** on **every** `/app` navigation regardless of leaf page. |
| `PageTransitionShell` | **C** | Motion wrapper around `<main>`. |
| `MarketingI18nShardLayer` (paywalled body path) | **C** | Nested provider again for route body when paywalled. |
| `{children}` (route body) | Mixed | Heavy pages add **second** client layer (e.g. runner) **below** already-heavy shell. |

**Highest learner risk:** **Shell stacks client providers + nav + motion** then mounts **monolithic** pages (practice runner, question bank). **Waterfall:** shell hydrates before inner interactive surfaces become responsive.

---

## 4. High-risk leaf boundaries (lesson + exam)

| Surface | Boundary | Contract |
|---------|----------|----------|
| Marketing pathway lesson detail | RSC body → selective client islands (quiz embed, figures, etc.) | `marketing-pathway-lesson-client-contract.ts` — **do not pass** full `PathwayLessonRecord` with `sections` to client. |
| `PremiumLessonShell` | **C** | In-app lesson; ensure server passes **trimmed** props only. |
| `practice-test-runner-client` | **C** | Imports `StudyPlan`, `SmartReviewLayout`, `EcgVideoQuestionMedia`, `ConfidenceAnalyticsBlock`, … — **deep client subgraph** from one entry. |

---

## 5. Generated indexes / catalog leakage (hydration angle)

| Concern | Status |
|---------|--------|
| `generated-indexes/*.json` imported from `src/app` | **None found** (`audit-runtime-payloads.mjs` ok) |
| Full `lesson-library.json` on hub routes | **Guarded** by tests |
| Client importing `@/content/*.json` | **Not in `src/app` client files** per script |

Leakage risk is primarily **accidental future import** or passing **parsed catalog** as props into a client component — **DEV_REVIEW** on any PR touching lesson/marketing clients.

---

## 6. Suspense usage (positive)

| Pattern | Example | Benefit |
|---------|---------|---------|
| `Suspense` around deferred lesson lanes | `pathway-lesson-detail-page-body.tsx` | Limits blocking serialization. |
| `Suspense` around `LearnerStudyNextBlock` | `(learner)/layout.tsx` | Optional block does not block first paint shell. |

**Gap:** Largest clients (`practice-test-runner`, question bank) often **self-manage** loading state instead of streaming smaller RSC shells — **medium** structural hydration cost.

---

## Summary

- **Widest boundaries:** marketing **header + i18n**, learner **shell provider stack**, **practice test runner** leaf.  
- **Contract-critical:** marketing lesson **client props** must stay aligned with `marketing-pathway-lesson-client-contract.ts`.  
- **Indexes / giant JSON:** on-disk size is huge for catalogs; **runtime hydration** safe only while imports stay server-only (current checks pass).
