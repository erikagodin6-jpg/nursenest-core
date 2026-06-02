# Learner dashboard ecosystem — Figma-first redesign spec (Phase 1)

**Status:** Design / documentation only — **no implementation** until explicit product/design sign-off.  
**Scope:** Learner emotional UX, visual hierarchy, semantic tokens, and component mapping to **existing** routes and React modules.  
**Explicit non-scope:** Routes, auth, entitlements, APIs, schema, billing, middleware, calculation logic, architecture, copy churn, and i18n key changes.

---

## 1. Purpose

Align the **learner dashboard ecosystem** (study hub home, account performance surfaces, onboarding entry, exam-plan readiness hub, staff learner QA chrome) around a **premium, calm, clinically intelligent** presentation—using multi-hue semantics (not brand-only gray grids), strong narrative hierarchy, and obvious next actions—without changing backend behavior.

---

## 2. Emotional UX & hierarchy (production governance lens)

Answered for the primary surface (**`/app` study hub**); other surfaces inherit the same principles scaled to task.

| Question | Direction |
|----------|-----------|
| **1. Immediate goal?** | Resume momentum: one dominant "what to do next" path + visible exam timeline context. |
| **2. What dominates visually?** | Primary study CTA + countdown/readiness band + pathway identity—not dense metric walls. |
| **3. Secondary?** | Weak areas / adaptive signals, coach insights (when enabled), continue-learning row. |
| **4. Remove / de-emphasize?** | Redundant utility grids, duplicate "status" bands, inventory-first layouts that feel like admin tools. |
| **5. Emotional motivation?** | Progress narrative ("you are closing gaps"), streak protection copy, strengths alongside gaps—optimistic but honest. |
| **6. Cognitive overload?** | Too many equal-weight cards; competing CTAs; monochrome charts that flatten meaning. |
| **7. Immersive vs administrative?** | **Immersive study cockpit** on `/app`; administrative density acceptable under `/app/account/*` but still learner-toned. |
| **8. Premium modern product?** | Soft elevation, semantic color bands, breathing room, purposeful motion only where it aids scan (e.g. skeleton → content). |
| **9. Hours-long sessions?** | Comfortable typography rhythm, reduced visual noise between sessions, predictable anchor regions (hero / actions / insights). |
| **10. Study momentum?** | Next-best-actions list always scannable within first viewport on desktop; thumb reach on mobile. |

---

## 3. Token & theme strategy

**Source of truth:** `nursenest-core/src/app/semantic-status-tokens.css` plus `[data-theme]` palettes (identity) — see also `.cursor/rules/semantic-color-guardrails.mdc`.

**Spec-level rules (implementation must follow these, without introducing ad-hoc hex in TSX/CSS):**

- **Surfaces:** `--semantic-surface`, `--semantic-surface-elevated`, `--semantic-bg-soft`, `--semantic-border-soft`, `--semantic-shadow-soft`.
- **Text:** `--semantic-text-primary`, `--semantic-text-secondary`, `--semantic-text-muted`.
- **Status / data bands:** `--semantic-success`, `--semantic-info`, `--semantic-warning`, `--semantic-danger`, `--semantic-chart-1` … `--semantic-chart-5` for **distinct series**—avoid painting every bar with `--semantic-brand` alone.
- **Panels:** `--semantic-panel-cool`, `--semantic-panel-warm`, `--semantic-panel-positive`, `--semantic-panel-muted`.
- **Interactive:** `--semantic-brand`, `--semantic-brand-soft`, `color-mix(in srgb, var(--semantic-brand) …)` for rings/hover—not raw RGB literals.
- **Themes:** Aurora / Ocean / Garden / Midnight remain **`[data-theme]`-driven**; mockup `10-themes-four-panel-aurora-ocean-garden-midnight.png` illustrates perceived tint shifts while preserving semantic layers on top.

---

## 4. Readonly audit — routes & component map

Paths below are relative to the Next.js app under `nursenest-core/src/app/`.

### 4.1 Core learner hub — `/app`

| Concern | Route module | Primary UI building blocks |
|---------|----------------|---------------------------|
| Entry | `(student)/app/(learner)/page.tsx` | `LearnerDashboardDeferredContent`, `LearnerDashboardHeavyContent`, Suspense fallbacks |
| Shell / chrome | Same | `LearnerDashboardPageShell`, `LearnerDashboardShellFallback`, `LearnerDashboardBodyFallback` (skeletons: `nn-skeleton-block`) |
| Locked / paywall | Same | `PremiumEmptyState`, `ReadinessLockedCard`, `BenchmarkLockedCard`, `LockedStudyNextPreview`, `LockedDashboardOverlay` |
| Degraded | Same | `LearnerStudyHomeDurabilityMinimal` |
| Main rich layout | Same → `LearnerStudyHome` | `PrimaryActionCard`, `ExamCountdownCard`, `ReadinessScoreCard`, `LearnerDailyMomentumCard`, `EngagementNudgeStrip`, `LearnerDashboardCommandCenter`, `LearnerDashboardInsightPanels`, `BenchmarkCard`, `WeaknessHeatmap`, `LearnerDashboardUserPanelBand`, `LearnerStudyModesBand`, `LearnerAdaptiveFocusCard`, `WeakAreasDashboardClient`, `LearnerContinueLearningCard`, `PremiumLearnerHub`, `DashboardCoachCard`, `CoachWeakSummary`, `CoachReadinessCard`, `CoachPriorityList`, `CoachPatternInsights`, `CoachInterventionBanner`, `FocusTodayStrip`, `LearnerReportCard`, `LearnerAdaptiveRecommendationsSection`, `LearnerDashboardHubLayout`, `LearnerDashboardMobileFold`, `LearnerStudySurfaceSection` / `LearnerSurface` |

### 4.2 Report card — canonical `/app/account/report`

| Concern | Route module | Primary UI building blocks |
|---------|----------------|---------------------------|
| Page | `(student)/app/(learner)/account/report/page.tsx` | Delegates to `LearnerReportCardRouteBody` |
| Legacy redirect | `(student)/app/(learner)/account/report-card/page.tsx` | `permanentRedirect` → `/app/account/report` |
| Shared body | `(student)/app/(learner)/account/_lib/learner-report-card-route.tsx` | `LearnerReportCardPremium`, `LearnerReportCardHero`, `LearnerCategoryProgressGrid`, `LearnerProfileSummaryCard`, `LearnerPerformanceWorkspaceNav`, `MedCalcReportCardInset`, `StudyToolsReportCardInset`, `VerifiedStudyReportCardDigest`, `LearnerStudyQuickLinksCard`, `SubscriptionPaywall`, `PremiumEmptyState`, `LearnerSilentSectionDegradedFallback`, `LearnerAccountCrossLinks` |

### 4.3 Settings / account center — `/app/account/settings`

| Concern | Route module | Primary UI building blocks |
|---------|----------------|---------------------------|
| Hub | `(student)/app/(learner)/account/settings/page.tsx` | `LearnerAccountShell`, `LearnerAccountPageHero`, destination cards (Study preferences, Personal, Security) |
| Account chrome | `(student)/app/(learner)/account/layout.tsx` | `LearnerAccountShellHeader`, `LearnerAccountNav` wrapping `{children}` |

### 4.4 Readiness analytics — `/app/account/readiness`

| Concern | Route module | Primary UI building blocks |
|---------|----------------|---------------------------|
| Page | `(student)/app/(learner)/account/readiness/page.tsx` | `ReadinessHeroCard`, `ReadinessDimensionTabs`, `ReadinessStrengthGrid`, `ReadinessFocusPlan`, `LearnerPerformanceWorkspaceNav`, paywall / empty / degraded patterns |

### 4.5 Study progress — `/app/account/progress`

| Concern | Route module | Primary UI building blocks |
|---------|----------------|---------------------------|
| Page | `(student)/app/(learner)/account/progress/page.tsx` | `LearnerProgressPageContent`, `MedCalcReportCardInset`, `LearnerAccountCrossLinks`, `LockedStudyNextPreview`, `SubscriptionPaywall` |

### 4.6 Performance analytics — `/app/account/analytics`

| Concern | Route module | Primary UI building blocks |
|---------|----------------|---------------------------|
| Page | `(student)/app/(learner)/account/analytics/page.tsx` | `AnalyticsPerformanceReport`, `AnalyticsDetailClient`, paywall / empty states |

### 4.7 Exam readiness command center — `/app/exam-plan`

| Concern | Route module | Primary UI building blocks |
|---------|----------------|---------------------------|
| Page | `(student)/app/(learner)/exam-plan/page.tsx` | `MyExamPlanHero`, `ReadinessSummaryRow`, `ExamCountdownHero`, `TodaysPlanSection`, `WeakAreasImpactSection`, `ReviewDueNowCards`, `PerformanceForecastRow`, `WeeklyStudyPlanSection`, `BenchmarkPercentileCard`, `WeeklyPacingPanel`, `RecoveryPlanCard`, `ExamDateEditor`, `PlanRegenerateControl`, `PremiumExamPlanUpgradeCard`, `ExamPlanLazyClient`, etc. |

### 4.8 Onboarding — `/app/onboarding`

| Concern | Route module | Primary UI building blocks |
|---------|----------------|---------------------------|
| Page | `(student)/app/(learner)/onboarding/page.tsx` | `OnboardingPageClient` |
| Client | `onboarding/onboarding-page-client.tsx` | `TrialOnboardingFlow` |

### 4.9 Marketing-style UI previews — `/preview/[surface]`

| Concern | Route module | Primary UI building blocks |
|---------|----------------|---------------------------|
| Page | `(preview)/preview/[surface]/page.tsx` | `NurseNestPremiumPreview` with surfaces from `src/lib/ui-preview/preview-surfaces.ts` (`dashboard`, `report-cards`, `analytics`, pathway hubs, etc.) |

### 4.10 Staff / admin learner QA chrome

| Concern | Module | Notes |
|---------|--------|-------|
| User bar | `src/components/auth/learner-shell-user-bar.tsx` | `learnerQaOverlay` for simulated plan/scope line when staff exercises learner QA mode |
| Preview banner | *Design target only* | Mockup `09-staff-admin-preview-banner-midnight.png` — explicit Staff preview / simulated session band; implementation stays server-enforced |

---

## 5. Charting & visualization guidance (design-only)

- Prefer **SVG + CSS** (`stroke-dasharray` arcs, simple paths) or tiny inline sparklines for trends.
- Use **`semantic-chart-*` rotation** for multi-series readability; align accuracy bands with `semanticFillClassForAccuracyPct` (`src/lib/ui/semantic-progress-fill.ts`) where applicable.
- Avoid introducing **heavy chart libraries** in future implementation unless a spike proves bundle and accessibility wins.
- Loading: skeleton strips consistent with dashboard fallbacks (`nn-skeleton-block`) — see mockup `11-microstates-skeleton-hover-countdown-nba.png`.

---

## 6. Non-goals (frozen for Phase 1 sign-off)

- No URL changes (including `/app/account/report-card` redirect behavior).
- No auth/session/entitlement/paywall logic edits.
- No API, Prisma, metrics computation, or middleware changes.
- No billing or subscription rule changes.
- No mass copy or i18n key churn.
- No new analytics pipelines.

---

## 7. Approval gate

| Gate | Owner | Outcome |
|------|-------|---------|
| Visual direction | Product + Design | Approved mockup set + hierarchy notes |
| Token compliance | Design + Eng | Confirms semantic-token-only styling approach |
| Learner safety | Eng | Confirms no accidental logic coupling in a future Phase 2 |

**Phase 2 (implementation) starts only after written sign-off** referencing this document version and the asset manifest revision.

---

## 8. Asset manifest

**Deliverable folder:** `reports/learner-dashboard-redesign-mockups/` (relative to repository root `/root/nursenest-core`).

| File | Description |
|------|-------------|
| `01-desktop-dashboard-command-center-ocean.png` | Desktop study hub command center — Ocean/light clinical baseline, primary CTA, countdown, readiness, weak areas, NBA list |
| `02-desktop-report-card-readiness.png` | Desktop report card — domain bands, multi-hue bars, strengths/opportunities |
| `03-desktop-settings-account-hub.png` | Desktop account settings hub — sidebar + destination cards |
| `04-tablet-dashboard-analytics-split.png` | Tablet split — dashboard summary + analytics panel |
| `05-mobile-dashboard-rn-pathway.png` | Mobile dashboard — RN pathway badge, stacked hero + actions |
| `06-mobile-report-card.png` | Mobile report card — scrollable domain summary |
| `07-mobile-settings.png` | Mobile settings list pattern |
| `08-states-free-vs-premium-comparison.png` | Comparative states — locked/free vs full subscriber presentation |
| `09-staff-admin-preview-banner-midnight.png` | Staff QA / simulated learner — Midnight dark theme + preview banner concept |
| `10-themes-four-panel-aurora-ocean-garden-midnight.png` | Four-way theme comparison — Aurora / Ocean / Garden / Midnight |
| `11-microstates-skeleton-hover-countdown-nba.png` | Component sheet — skeleton, CTA hover, weak vs strong cards, countdown, next-best-actions |
| `12-pathway-badges-rn-rpn-np-allied-subtle.png` | Pathway flavor strip — RN, RPN, NP, Allied subtle badges |

**Reference inspiration (user-provided):** homepage/analytics PNGs under `.cursor/projects/root-nursenest-core/assets/` — mood/composition only.

---

## 9. Revision history

| Date | Rev | Notes |
|------|-----|-------|
| 2026-05-09 | 0.1 | Phase 1 audit + mockups + spec (documentation only) |
