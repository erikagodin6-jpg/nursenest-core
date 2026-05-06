# Component consolidation priority — NurseNest (audit only)

Ranked by **impact / risk ratio**. Effort is relative (S/M/L). **No implementation** in this audit.

Columns: Priority | Consolidation target | Component paths | Duplication severity | Runtime risk | Maintenance cost | Bundle impact | Tag | Suggested canonical

---

## P0 — Quick win, low behavioral risk

| Priority | Target | Paths | Severity | Runtime | Maint. | Bundle | Tag | Canonical |
|----------|--------|-------|----------|---------|--------|--------|-----|-------------|
| P0 | Merge duplicate `lv-card` wrappers | `learner-ui/learner-study-card.tsx`, `ui/learner-surface-card.tsx` | **High** | Low | **High** | Small duplicate | SAFE_FOR_AI | Single **`LearnerStudyCard`** (keep `...rest` passthrough) + export from `learner-ui/index.ts`; delete or alias the other. |

**Rationale:** Same variant keys and class maps; zero visual strategy change if merged carefully.

---

## P1 — High maintenance, medium regression risk

| Priority | Target | Paths | Severity | Runtime | Maint. | Bundle | Tag | Canonical |
|----------|--------|-------|----------|---------|--------|--------|-----|-------------|
| P1 | Paywall UX matrix + shared CTA constants | `student/subscription-paywall.tsx`, `study/premium-gate.tsx` | **High** | **Medium** | **High** | Both client-heavy | SAFE_FOR_AI | **Keep two components** but extract **`paywall-cta-config.ts`** (href, labels, analytics event names) + single tier copy source. |
| P1 | NP / hub inline cards → `StudyCard` | `pathway-lessons/pathway-lessons-grouped-hub.tsx` | **High** | Low | **High** | Reduces long class strings in hot pathway | SAFE_FOR_AI | **`StudyCard`** + optional children for “related lessons”. |
| P1 | Button class deduplication | `practice-test-runner-client.tsx`, `question-bank-practice-client.tsx`, `practice-question-session-client.tsx`, `study/analytics-*.tsx`, `signup-form.tsx`, onboarding, admin dashboards | **High** | Low | **High** | Many duplicated string literals | SAFE_FOR_AI | **`NnLearnerButton`** + **`NnLearnerButtonLink`** (or extend shadcn Button with `nn` variants in `globals`/CSS). |

---

## P2 — Structural / layout extractions (plan carefully)

| Priority | Target | Paths | Severity | Runtime | Maint. | Bundle | Tag | Canonical |
|----------|--------|-------|----------|---------|--------|--------|-----|-------------|
| P2 | Extract mobile nav drawer shell | `layout/site-header.tsx` | **High** (size) | **Medium** | **High** | May slightly help code-split | SAFE_FOR_AI | **`SiteHeaderMobileDrawer`** + shared **`NnDrawerFrame`**. |
| P2 | Drawer animation primitive | `layout/mobile-context-drawer.tsx`, `onboarding/exam-selector.tsx`, parts of `lesson-notes-drawer.tsx` | Medium | Medium | Medium | Small shared primitive | SAFE_FOR_AI | **`NnDrawerFrame`** shared module. |
| P2 | Lesson loading fallbacks barrel | `lessons/pathway-lesson-detail-loading-fallback.tsx`, `pathway-lesson-detail-header.tsx` (skeleton), deferred skeleton | Medium | Low | Medium | Cleaner imports | SAFE_FOR_AI | **`components/lessons/loading.ts`** re-exports. |

---

## P3 — Longer-term or admin-only

| Priority | Target | Paths | Severity | Runtime | Maint. | Bundle | Tag | Canonical |
|----------|--------|-------|----------|---------|--------|--------|-----|-------------|
| P3 | Admin metric tile dedupe | `admin/seo/admin-seo-hub-client.tsx` (`StatCard` inner) | Medium | Low | Medium | Low | DEV_ONLY | **`AdminMetricCard`** or reuse **`AnalyticsMetricTile`**. |
| P3 | Native dialog wrapper | `practice-test-runner-client.tsx`, `admin-command-palette-client.tsx`, `editable-inline-client.tsx` | Medium | Medium | Medium | Low | SAFE_FOR_AI | **`useNnDialog` hook** before adding Radix. |
| P3 | Form validation stack | scattered admin clients, `auth/signup-form.tsx` | Medium | Medium | High | N/A | DEV_ONLY | Choose **one** form stack in a tech note first (Zod + RHF optional). |

---

## Explicitly defer (cost >> benefit today)

- Unifying **marketing `PathwayLessonDetail*`** with **`PremiumLessonShell`** into one component — different auth, SEO, and streaming model; **document** instead of merge.
- Replacing all native dialogs with Radix without an a11y/product driver.

---

## Suggested sequencing (opinionated)

1. **P0** `LearnerStudyCard` / `LearnerSurfaceCard` merge (1–2 PRs, easy review).
2. **P1** shared **`nn-btn`** wrappers (incremental: start with `study/` + `practice-*` only).
3. **P1** `StudyCard` adoption in **`pathway-lessons-grouped-hub`** (visual QA on NP hub).
4. **P1** paywall **copy + analytics** constants shared between `subscription-paywall` and `premium-gate`.
5. **P2** drawer shell extraction behind feature flag or snapshot tests.

---

## Verification checklist (when any consolidation ships)

- [ ] Pathway hub lesson grid (including NP) — visual + keyboard.
- [ ] `/app` practice test runner — primary/secondary buttons and dialogs.
- [ ] Paywall surfaces — PostHog events unchanged or migrated with dashboard note.
- [ ] Mobile header — drawer open/close + `Link` navigation (regression called out in `site-header` comments).
