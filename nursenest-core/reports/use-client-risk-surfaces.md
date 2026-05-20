# `use client` risk surfaces — NurseNest (audit only)

**Scope:** `"use client"` prevalence, **necessary vs questionable** boundaries, and **SAFE_FOR_AI / DEV_REVIEW / DEVELOPER_ONLY** tagging for triage. **~200+** component files match `"use client"` under `src/` (grep count from audit pass — exact count fluctuates).

**No removals** recommended here — classification only.

---

## Category definitions

| Tag | Use |
|-----|-----|
| **SAFE_FOR_AI** | Clear necessity (hooks, browser APIs, providers); low risk of wrong automated “optimization”. |
| **DEV_REVIEW** | May be valid but **large**, **duplicative**, or **borderline** — human should approve any `"use client"` removal or split. |
| **DEVELOPER_ONLY** | Admin, QA, internal tools — payload matters for staff machines, not learner SLA. |

---

## A. Necessary `use client` (SAFE_FOR_AI)

| Surface | Examples | Why client is required |
|---------|----------|------------------------|
| **React context providers** | `MarketingI18nProvider`, `PaywallHomeStatsProvider`, `AppThemeProvider`, `AuthSessionProvider` | Context + hooks. |
| **Browser-only APIs** | `fetch` loops in `cat-insights/page.tsx`, `localStorage`, `matchMedia`, `window` | Cannot run on server. |
| **Forms with client state** | `signup-form.tsx`, large admin editors | Controlled inputs / optimistic UI. |
| **Motion / reduced-motion** | `MarketingMobileMotionShell`, `PageTransitionShell`, `motion-wrapper` | Animation + gesture. |
| **Radix / interactive primitives** | `accordion`, theme picker | Event + layout reflow. |
| **Observability** | `SentryLearnerShell`, PostHog client helpers | Client SDKs. |

---

## B. Large but justified (DEV_REVIEW)

| Surface | Path | Risk |
|---------|------|------|
| **Practice session runner** | `practice-test-runner-client.tsx` | Entire exam UX is inherently client-heavy; **risk is size**, not wrong directive. |
| **Question bank** | `question-bank-practice-client.tsx` | Same. |
| **Practice tests hub** | `practice-tests-hub-client.tsx` | Filters + drawers — client OK; **split** could shrink first paint. |
| **Study plan** | `study/study-plan.tsx` | Rich interactions; depends on entitlement flags from parent. |
| **Site header** | `layout/site-header.tsx` | Mobile drawer + region UX — client justified; **size** is the issue. |
| **`StudyCard`** | `components/ui/study-card.tsx` | **Marketing + list surfaces** need interactivity; pulls client into many routes — **watch** accidental imports from tiny pages. |
| **Whole route client page** | `app/(learner)/practice-tests/cat-insights/page.tsx` | **Top-of-file `use client`** — entire route hydrates; **candidate** for RSC shell + client table only. |

---

## C. Admin / staff (DEVELOPER_ONLY)

| Path | Note |
|------|------|
| `admin-blog-control-panel-client.tsx` | Largest admin island. |
| `admin-pathway-lesson-form-client.tsx`, `admin-nav-client.tsx`, theme QA, observability rosters | Staff-only; still worth code-splitting for **DX**, not learner Core Web Vitals. |

---

## D. Questionable / review when touched (DEV_REVIEW)

| Pattern | Example | Question |
|---------|---------|----------|
| **`use client` on content modules** | `src/content/pre-nursing/modules/*.tsx` | Could any be **server components** with a thin interactive wrapper? (Only if hooks unused.) |
| **Legacy marketing** | `src/legacy/marketing/*.tsx` | Still client — are all still routed on hot paths? |
| **Lab / med-calc pages** | `lab-lesson-page.tsx`, `med-calculations-*` | Full `use client` pages — verify only interactive subregions need client. |

---

## E. `app/` directory `use client` (special)

**Mostly:** `error.tsx`, `global-error.tsx`, and a few leaf clients (`onboarding-page-client`, `analytics-detail-client`, `printables-learner-hub`, **`practice-tests/cat-insights/page.tsx`**).

**Risk:** `error.tsx` **must** stay client — **SAFE_FOR_AI**.  
**CAT insights page** — **DEV_REVIEW** (whole route client).

---

## F. Guards already protecting against bad `use client` + content

| Guard | File |
|-------|------|
| Hub must not import `lesson-library.json` | `src/lib/lessons/lessons-hub-import-guard.test.ts` |
| `src/app` must not reference `generated-indexes` path; no catalog-sync in client routes; no `@/content` in client `src/app` | `scripts/audit-runtime-payloads.mjs` |

Treat failing these as **P0 regression**.

---

## G. Marketing lesson serialization (cross-cutting)

`src/lib/lessons/marketing-pathway-lesson-client-contract.ts` documents the **only** approved wide shapes for marketing client props. **Violations belong to DEV_REVIEW** (security + perf), not SAFE_FOR_AI auto-fixes.

---

## Summary table

| Tag | Meaning in this audit |
|-----|-------------------------|
| **SAFE_FOR_AI** | Provider, error boundary, theme, standard hooks — keep `use client`. |
| **DEV_REVIEW** | Monoliths and whole-route clients — optimize only with profiling + QA. |
| **DEVELOPER_ONLY** | Admin islands — optimize for maintainability, not learner LCP. |
