# NurseNest navigation — architecture analysis (Figma-first)

**Date:** 2026-05-10  
**Scope:** Read-only code audit for a future **visual/UX** nav redesign.  
**Gate:** **No production `src/**/*.tsx` (or other app) changes until explicit product/engineering approval.** This document and Figma mockups are the deliverable; implementation is out of scope.

---

## 1. Executive summary

Marketing chrome is centered on **`SiteHeader`** (`site-header.tsx`): a **sticky** (`sticky top-0 z-50`), **locale-prefixed** marketing shell with **row-4 layout** on light themes (`data-nn-header-layout="marketing-row4"`), a **tier strip** of exam-hub links, **mobile menu** + **mobile context drawer**, and **PostHog** nav instrumentation. **`MarketingHeaderUtilityStrip`** (standalone legacy top rail) is **exported but not imported** anywhere else in the repo today; **live** country/language/theme live inside **`MarketingHeaderUtilityCluster`** embedded in the desktop auth column.

Learner app navigation uses **`/app/(learner)/layout.tsx`** with **`LearnerShellDesktopStudyLinks`**, **`LearnerShellMobileBottomNav`**, **`LearnerShellPathwayPill`**, and **`learner-primary-nav.ts`** label keys (`learner.shell.nav.*`, `nav.account`).

---

## 2. Link inventory (routes preserved)

### 2.1 `global-nav-config.ts`

| `id` | `labelKey` | `href` | Surfaces |
|------|------------|--------|----------|
| marketing-lessons | `nav.lessons` | `/lessons` | DD, MD |
| marketing-flashcards | `nav.flashcards` | `/flashcards` | DD, MD |
| marketing-blog | `nav.blog` | `/blog` | DD, MD |
| marketing-tools | `nav.clinicalTools` | `/tools` | DD, MD |
| marketing-case-studies | `nav.caseStudies` | `/case-studies` | DD, MD |
| marketing-pricing | `nav.pricing` | `/pricing` | DD, MD |
| marketing-faq | `footer.faq` | `/faq` | DD, MD |
| marketing-shop | `nav.store` | `/shop` | DD only |
| marketing-new-graduate-support | `nav.newGradSupport` | `/new-graduate-support` | DD only |
| marketing-healthcare-careers | `nav.healthcareCareers` | `/healthcare-careers` | DD only |

**Learner shell** (`GLOBAL_NAV_LEARNER_SHELL`): `/app` (`dashboard.breadcrumbDashboard`), `/app/lessons` (`nav.lessons`), `/app/questions` (`nav.questionBank`), `/app/practice-tests` (`nav.topicAdaptiveTests`), `/app/exams` (`nav.practiceExams`), `/app/study-plan` (`nav.studyPlanShort`), `/app/flashcards` (`nav.flashcards`), `/blog` (`nav.articlesAndTips`), `/tools` (`nav.clinicalTools`), `/case-studies` (`nav.caseStudiesShort`), `/pricing` (`nav.pricing`).

### 2.2 `SiteHeader` inline desktop center (`marketingMoreLinks`)

- `nav.pricing` → `/pricing`
- `footer.blog` → `/blog`
- `footer.faq` → `/faq`
- `nav.preNursing` → `/pre-nursing`
- `nav.tools` → `HUB.tools`

**Mobile flow row** uses `nav.marketingFlow.learn`, `nav.marketingFlow.practice`, `nav.marketingFlow.track` with **`marketingHeaderLearnPracticeFlowDestinations`**.

**Tier strip:** `buildMarketingTierHubStrip` — labels from `nav.mega.*` (RN, PN US/CA, NP, New grad, Allied).

### 2.3 Learner primary routes (`learner-primary-nav.ts`)

`/app/lessons`, `/app/questions`, `/app/flashcards`, CAT or `/app/exams`, `/app/account/progress`, `/app/profile`; optional study tools, printouts, OSCE, clinical scenarios (gated).

---

## 3. Component map

| Component | Role |
|-----------|------|
| `site-header.tsx` | Sticky marketing chrome; `nn-header-logo-row--scrolled` when `scrollY > 8`; mobile drawer portal |
| `marketing-header-utility-strip.tsx` | `MarketingHeaderUtilityCluster` + legacy `MarketingHeaderUtilityStrip` (unused import) |
| `global-context-switcher.tsx` | Country + mobile drawer context |
| `global-nav-config.ts` | Nav data SSOT |
| `marketing-mega-menu.ts` | Mega groups / `nav.mega.link.*` |
| `learner-shell-primary-nav.tsx` | `data-nn-learner-shell-study-nav`, pathway pill |
| `theme-registry.ts` | `PUBLIC_MARKETING_THEME_ALLOWLIST` = Ocean only → `publicMarketingThemeChoiceCount()` = 1 → no public `ThemePicker` today |

---

## 4. Test hooks

- `data-nn-header-band`: `primary`, `utility` (inside desktop auth cluster), `tier`
- `data-nn-header-layout="marketing-row4"` (light)
- `header.nn-header-logo-row`, `.nn-header-desktop-auth-cluster`, `.nn-header-logo-link`
- `data-nn-learner-shell-study-nav`
- Playwright: `marketing-header-bands.spec.ts` (contrast, gradient, row4, language, optional theme in utility)

---

## 5. Risks (post-approval)

Playwright band selectors; sticky/transform vs fixed drawers; i18n keys; brand lockup; touch targets; row4 detection.

---

## 6. Approval gate

No nav implementation code until explicit approval.

---

## 7. Reference image

No `IMG_*.png` found under repo or `.cursor/projects`.

---

*Verified By VibeCheck ✅*  
*(Truthpack `ui-pages.json` missing in clone; routes from `global-nav-config.ts` and `site-header.tsx`.)*


## Appendix A — `SiteHeader` auth / CTA matrix (marketing)

| State | Desktop / mobile (high level) |
|-------|-------------------------------|
| Guest | `nav.logIn`, `nav.signup` (homepage adds `entry=homepage` on signup URL) |
| Entitled learner | Continue studying CTA (optional nudge), `nav.dashboard`, account, sign out |
| Signed-in non-entitled | `nav.pricing`, `nav.dashboard`, sign out |
| Admin | Admin dashboard link, `nav.dashboard`, sign out |

## Appendix B — Learner shell (`layout.tsx`)

Top row: `LearnerShellBrandHomeLink`, pathway pill, `LearnerShellUserBar`, `LearnerShellLanguageControl`.  
Study row: `LearnerShellDesktopStudyLinks` (`data-nn-learner-shell-study-nav`); bottom: `LearnerShellMobileBottomNav`.

## Appendix C — `marketingHeaderUtilityStrip` export note

`MarketingHeaderUtilityStrip` exists for a **legacy stacked band** but is **not referenced** by layouts in-repo; live marketing uses `MarketingHeaderUtilityCluster` inside `SiteHeader` only.
