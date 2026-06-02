# CSS Bundle Audit

**Generated:** 2026-06-01  
**Codebase:** nursenest-core  
**CSS engine:** Tailwind CSS v4 (PostCSS) + hand-authored CSS custom properties  

---

## Executive Summary

| Metric | Size |
|---|---|
| Total source CSS (all `.css` files in `src/` + `styles/`) | **1,995 KB** |
| `globals.css` chain — loaded on **every page** | **562 KB** |
| Learner layout chain — loaded on **every `/app/*` route** | **359 KB** |
| Marketing styles chain — loaded on **every marketing page** | **469 KB** |
| Public `/public/` preview CSS — **never loaded by the app** | **52 KB** |
| Confirmed duplicate token definitions (`--semantic-*`) | **70 variables** |
| Confirmed duplicate CSS imports (same file, same layout) | **1** |

**Three removals with zero UI/UX/logic risk save ~116 KB from the global bundle.**

---

## Section 1 — `globals.css` Chain (Loaded on Every Page)

`src/app/layout.tsx` imports `globals.css`, which pulls 17 additional files via `@import`. This bundle is served on **every route** — marketing, learner, admin, and preview.

| # | File | Size | Loaded On | Problem |
|---|---|---|---|---|
| 1 | `styles/exam/nclex-exam.css` | **93.7 KB** | Every page | Exam-specific styles on marketing + learner dashboard. Should be route-scoped. |
| 2 | `theme-palettes.css` | **80.1 KB** | Every page | 1,841 CSS custom properties. Many are palette definitions for themes that may not be active. |
| 3 | `semantic-status-tokens.css` | **56.6 KB** | Every page | 715 token definitions. Contains 70 confirmed duplicates with `globals.css` and `color-roles.css`. |
| 4 | `learner-advanced-questions.css` | **35.2 KB** | Every page | Question-surface styles loaded globally. Should be scoped to `/app/questions/` layout. |
| 5 | `globals.css` core | **198.4 KB** | Every page | Root file; contains Tailwind base + ~537 inline token definitions. |
| 6 | `marketing-brand-atmosphere.css` | **11.9 KB** | Every page | Marketing atmosphere gradients loaded on learner routes. |
| 7 | `premium-atmospheric-ecosystem-convergence.css` | **12.3 KB** | Every page | Homepage atmosphere tokens loaded globally. Used only on learner/homepage surfaces. |
| 8 | `premium-color-depth-convergence.css` | **10.6 KB** | Every page | Additive colour depth tokens. Could be scoped to surfaces that use them. |
| 9 | `admin-happy-dashboard.css` | **5.8 KB** | Every page | **Admin-only CSS loaded on marketing and learner routes.** |
| 10 | `admin-responsive-containment.css` | **4.2 KB** | Every page | **Admin-only CSS loaded on marketing and learner routes.** |
| 11 | `feature-discovery.css` | **7.8 KB** | Every page | Feature discovery overlays. Could be code-split. |
| 12 | `learner-prioritization-system.css` | **6.7 KB** | Every page | Prioritization surface styles — should be route-scoped. |
| 13 | `learner-pharmacology-system.css` | **3.0 KB** | Every page | Pharmacology surface styles — should be route-scoped. |
| 14 | `platform-ui-governance.css` | **6.6 KB** | Every page | Governance primitives. Necessary globally. |
| 15 | `color-roles.css` | **11.5 KB** | Every page | Semantic colour roles. Necessary globally. |
| 16 | `full-platform-convergence.css` | **5.3 KB** | Every page | Cross-surface shared utilities. Likely necessary. |
| 17 | `mobile-ux-standards.css` | **2.1 KB** | Every page | Mobile UX resets. Necessary globally. |
| 18 | `premium-mobile-study-experience-audit.css` | **10.8 KB** | Every page | Mobile study audit styles — may be partially redundant with `mobile-ux-standards.css`. |

**Chain total: 562 KB**

---

## Section 2 — Learner Layout Chain (`/app/*` routes)

`src/app/(app)/app/(learner)/layout.tsx` imports 9 additional files on top of `globals.css`.

| File | Size | Loaded On |
|---|---|---|
| `styles/learner/learner-global.css` | **263 KB** | All learner routes |
| `learner-premium-ds.css` | **29.6 KB** | All learner routes |
| `styles/learner-ds.css` (`styles/`) | **22.6 KB** | All learner routes |
| `learner-surface-primitives.css` | **12.0 KB** | All learner routes |
| `styles/tokens.css` (`styles/`) | **3.6 KB** | All learner routes |
| `learner-cockpit-premium.css` | **13.6 KB** | All learner routes |
| `learner-dashboard-report.css` | **10.3 KB** | All learner routes |
| `learner-dashboard-performance.css` | **3.7 KB** | All learner routes |
| `learning-module-shell.css` | **2.0 KB** | All learner routes |

**Chain total: ~359 KB** (on top of the 562 KB globals chain)

> **Note:** `styles/learner-ds.css` and `styles/tokens.css` live outside `src/` in a `styles/` root directory — separate from the primary `src/app/styles/` tree. This split adds ambiguity about canonical token authority.

---

## Section 3 — Marketing Layout Chain (marketing routes only)

`src/app/(marketing)/layout.tsx` imports `marketing-styles.css`, which chains into:

| File | Size | Loaded On |
|---|---|---|
| `styles/marketing/marketing-global.css` | **51.8 KB** | All marketing pages |
| `styles/marketing/hub-tiers.css` | **54.7 KB** | All marketing pages |
| `styles/marketing/hub-system.css` | **36.0 KB** | All marketing pages |
| `styles/marketing/pathway-reading.css` | **33.2 KB** | All marketing pages |
| `styles/marketing/footer-seo.css` | **31.4 KB** | All marketing pages |
| `styles/marketing/header-nav.css` | **27.8 KB** | All marketing pages |
| `styles/marketing/lesson-readability-hotfix.css` | **38.5 KB** | All marketing pages |
| `styles/marketing/theme-overrides.css` | **24.9 KB** | All marketing pages |
| `styles/marketing/hero.css` | **22.4 KB** | All marketing pages |
| `styles/marketing/auth-tokens.css` | **22.1 KB** | All marketing pages |
| `homepage-ecosystem-overhaul.css` | **24.8 KB** | All marketing pages |
| `premium-redesign-2026.css` | **3.9 KB** | All marketing pages |
| `premium-allied-newgrad-convergence.css` | **5.7 KB** | All marketing pages |
| *(remaining marketing styles)* | **~67 KB** | All marketing pages |

**Chain total: ~469 KB** (on top of 562 KB globals chain — marketing pages load **1,031 KB** of CSS)

---

## Section 4 — Route-Scoped CSS (loaded only on specific routes)

| File | Size | Route | Notes |
|---|---|---|---|
| `learner-flashcard-premium.css` | **259 KB** | `/flashcards`, `/questions`, `/practice-tests`, preview | ✅ Correctly scoped |
| `learner-flashcard-layout-refinement-pass.css` | **63.9 KB** | `/flashcards`, `/questions`, `/practice-tests`, `/exams`, preview | ✅ Correctly scoped |
| `learner-flashcard-branding-revamp.css` | **54.3 KB** | `/flashcards`, `/questions`, `/practice-tests`, preview | ✅ Correctly scoped |
| `learner-exam-session-premium.css` | **56.8 KB** | `/questions`, `/exams`, `/practice-tests`, preview | ✅ Correctly scoped |
| `styles/learner/learner-global.css` | **263 KB** | All learner routes | ✅ Correct scope |
| `styles/exam/nclex-exam.css` | **93.7 KB** | **Every page** (in globals.css) | ❌ Should be `/exams` layout only |
| `clinical-scenarios-workstation.css` | **7.7 KB** | `/clinical-scenarios` | ✅ Correctly scoped — but **imported twice** (lines 4+5 same layout) |
| `clinical-skills-workstation.css` | **21.1 KB** | `/clinical-skills` | ✅ Correctly scoped |
| `ecg-workstation.css` | **7.0 KB** | `/modules/ecg` | ✅ Correctly scoped |
| `labs-workstation.css` | **12.2 KB** | `/labs` | ✅ Correctly scoped |
| `med-calc-workstation.css` | **12.2 KB** | `/med-calculations` | ✅ Correctly scoped |
| `learner-loft-simulation.css` | **2.2 KB** | `/exams`, `/practice-tests`, `/clinical-scenarios` | ✅ Scoped — but loaded on 3 routes redundantly |
| `patient-monitor-display.css` | **12.0 KB** | Physiology Monitor component | ✅ Component-scoped |

---

## Section 5 — Duplicate Token Definitions

**70 `--semantic-*` CSS custom properties are defined in more than one file** in the globals.css chain.

Files with confirmed overlap:

| File A | File B | Overlap Category |
|---|---|---|
| `globals.css` | `semantic-status-tokens.css` | `--semantic-accent-*`, `--semantic-bg-*`, `--semantic-border-*`, `--semantic-brand-*` |
| `globals.css` | `color-roles.css` | Colour role aliases |
| `theme-palettes.css` | `semantic-status-tokens.css` | Theme-scoped semantic overrides |

**Duplicate variables confirmed (sample):**
```
--semantic-accent-gold
--semantic-accent-indigo
--semantic-accent-lavender
--semantic-accent-mint
--semantic-accent-peach
--semantic-accent-periwinkle
--semantic-accent-plum
--semantic-accent-seafoam
--semantic-accent-turquoise
--semantic-bg-base
--semantic-bg-soft
--semantic-border-soft
--semantic-brand-contrast
--semantic-brand-soft
--semantic-brand-strong
... (70 total)
```

The last definition wins in CSS cascade — earlier definitions in the chain are wasted bytes.

---

## Section 6 — Public Preview CSS (Never Loaded by App)

These files live in `/public/` and are served as static assets. **No application route imports them.** They were created for design previews and have not been cleaned up.

| File | Size | Status |
|---|---|---|
| `public/landing-polish-preview/multi-tone-system.css` | 8.4 KB | Preview artifact — not imported |
| `public/landing-polish-preview/homepage-layout.css` | 5.6 KB | Preview artifact |
| `public/landing-polish-preview/token-homepage-themes.css` | 4.8 KB | Preview artifact |
| `public/landing-polish-preview/token-homepage-bridge.css` | 4.6 KB | Preview artifact |
| `public/landing-polish-preview/pastel-themes.css` | 4.4 KB | Preview artifact |
| `public/prioritization-delegation-preview/…` | 5.9 KB | Preview artifact |
| `public/activity-depth-preview/…` | 5.8 KB | Preview artifact |
| `public/feature-discovery-preview/…` | 5.6 KB | Preview artifact |
| `public/pharmacology-preview/…` | 4.2 KB | Preview artifact |
| `public/leaf-branding-preview/…` | 2.6 KB | Preview artifact |
| **Total** | **52 KB** | Served from CDN on every deploy; never used |

---

## Section 7 — Confirmed Duplicate Import

| File | Layout | Lines |
|---|---|---|
| `clinical-scenarios-workstation.css` | `src/app/(app)/app/(learner)/clinical-scenarios/layout.tsx` | 4 **and** 5 |

This file is imported **twice on the same line** of the same layout file. Next.js / bundlers deduplicate this at runtime, but the source is misleading and should be cleaned up.

---

## Section 8 — Ranked Opportunities (No UI / Logic / Redesign Required)

### Priority 1 — Zero-risk removals (~116 KB global savings)

| Opportunity | Files Affected | Estimated Saving | Risk |
|---|---|---|---|
| **Move `styles/exam/nclex-exam.css` (93.7 KB) out of `globals.css` into the `/exams` layout** | `globals.css` (remove `@import`), `exams/layout.tsx` (add import) | **~93 KB off every non-exam page** | Zero — exam selectors only active on exam routes |
| **Move `admin-happy-dashboard.css` + `admin-responsive-containment.css` (10.3 KB) out of `globals.css`** | `globals.css` (remove 2 `@import`s); add to admin layout | **~10 KB off all non-admin pages** | Zero — admin selectors only active on admin routes |
| **Remove duplicate import of `clinical-scenarios-workstation.css`** | `clinical-scenarios/layout.tsx` line 5 | **~7.7 KB saved per load** | Zero — removing exact duplicate |
| **Delete `/public/` preview CSS (52 KB total)** | 10 files in `public/` subdirs | **52 KB off CDN/deploy artifact** | Zero — no app route references them |

**Total Priority 1 saving: ~163 KB** across routes, **~116 KB** off every non-exam/non-admin page.

---

### Priority 2 — Route-scope mismatches (~78 KB from global bundle)

| Opportunity | Files Affected | Estimated Saving | Risk |
|---|---|---|---|
| **Move `learner-advanced-questions.css` (35.2 KB) from `globals.css` → `/questions` layout** | `globals.css` remove; `questions/layout.tsx` add | **~35 KB off every non-question page** | Low — question selectors are scoped to question surfaces |
| **Move `learner-prioritization-system.css` (6.7 KB) from `globals.css` → prioritization route layout** | `globals.css` remove; relevant layout add | **~7 KB** | Low |
| **Move `learner-pharmacology-system.css` (3.0 KB) from `globals.css` → pharmacology route layout** | `globals.css` remove; relevant layout add | **~3 KB** | Low |
| **Move `feature-discovery.css` (7.8 KB) from `globals.css` → only routes using feature discovery** | Audit usage; scope accordingly | **~8 KB** | Low — needs usage audit first |
| **Consolidate duplicate `learner-loft-simulation.css` import** (3 layouts import it separately) | Move to shared learner layout if used universally, or keep but document | Style only | Low |

**Total Priority 2 saving: ~60 KB** off global bundle.

---

### Priority 3 — Token deduplication (~15–30 KB)

| Opportunity | Effort | Saving |
|---|---|---|
| **Audit and deduplicate the 70 `--semantic-*` custom properties** defined in both `globals.css` and `semantic-status-tokens.css` | Medium — requires verifying which file is canonical | ~10–15 KB |
| **Consolidate `styles/tokens.css` and `styles/learner-ds.css` (root `styles/` dir)** with `src/app/styles/global/tokens.css` — two parallel token trees exist | Medium | ~5 KB + reduced authoring confusion |
| **Audit `premium-mobile-study-experience-audit.css` (10.8 KB) vs `mobile-ux-standards.css` (2.1 KB)** for overlap | Low | ~5–8 KB |

---

### Priority 4 — Architecture (no immediate size saving, prevents future growth)

| Opportunity | Notes |
|---|---|
| **Establish a CSS layer budget** — `globals.css` should contain only Tailwind base, semantic tokens, and colour roles. All surface-specific CSS must live in route layouts. | Currently ~7 surface-specific files are imported globally |
| **Consolidate the hotfix files** — `lesson-readability-hotfix.css` exists in both `styles/marketing/` (38.5 KB) and `styles/learner/` (9.9 KB). These should be absorbed into canonical surface files after the fix is verified stable. | Two hotfix files = 48.4 KB of technical debt |
| **Remove `rollback-snapshots/` CSS** — `rollback-snapshots/homepage-live-2026-05-11/src/app/premium-redesign-2026.css` is a rollback snapshot in the source tree. Should live outside the package or be deleted. | ~4 KB + clarity |

---

## Summary Table

| Category | Source Size | Immediate Saving Available | Requires UI Change |
|---|---|---|---|
| Globally loaded exam CSS | 93.7 KB | ✅ ~93 KB (route-scope) | No |
| Globally loaded admin CSS | 10.3 KB | ✅ ~10 KB (route-scope) | No |
| Duplicate CSS import | 7.7 KB | ✅ ~7.7 KB (remove line) | No |
| Public preview artifacts | 52 KB | ✅ 52 KB (delete files) | No |
| Globally loaded question CSS | 35.2 KB | ✅ ~35 KB (route-scope) | No |
| Globally loaded prioritization + pharmacology CSS | 9.7 KB | ✅ ~10 KB (route-scope) | No |
| Duplicate token definitions (70 vars) | ~10–15 KB | ⬜ ~15 KB (dedup) | No |
| Hotfix file consolidation | 48.4 KB | ⬜ ~20 KB (absorb) | No |
| **Total no-UI-change savings** | | **~222 KB** | **None** |
