# UI standardization opportunities — NurseNest (audit only)

Opportunities to reduce drift **without** mandating immediate refactors. Each row: area | current state | target standard | notes | SAFE_FOR_AI / DEV_ONLY

---

## 1. Card vocabulary

| Area | Current state | Target standard | Notes | Tag |
|------|---------------|-----------------|-------|-----|
| Pathway lesson lists | `StudyCard`, `LessonCard`, `LessonRow`, `LessonSystemCard`, plus **inline** `nn-study-card` in `pathway-lessons-grouped-hub` | **`StudyCard`** with `surface="list"` / `surface="hub"` + small composition slots | `study-card.tsx` already documents intended surfaces | SAFE_FOR_AI |
| Learner app sections | `LearnerSurface`, `LearnerStudyCard`, `LearnerSurfaceCard` | **`LearnerSurface`** for sections; **one** `lv-card` wrapper (`LearnerStudyCard` OR merged `LearnerSurfaceCard`) | Remove duplicate variant maps | SAFE_FOR_AI |
| Metrics | `LearnerStatCard` → `AnalyticsMetricTile` | Keep **single** metric tile implementation | Re-export pattern is healthy | SAFE_FOR_AI |

---

## 2. Lesson layout contracts

| Area | Current state | Target standard | Notes | Tag |
|------|---------------|-----------------|-------|-----|
| Marketing vs learner lesson | Separate trees (`PathwayLessonDetail*` vs `PremiumLessonShell`) | **Two documented product contracts**: “public SEO lesson” vs “subscriber lesson shell” | Share lower-level blocks (quiz embed, sound libs) where types match | SAFE_FOR_AI |
| Vertical templates | Pre-nursing, labs, med-calc each own page component | **Optional** `LessonPageFrame` (width, paywall region, title) if 4+ copies emerge | Audit before abstracting | SAFE_FOR_AI |

---

## 3. Buttons and links

| Area | Current state | Target standard | Notes | Tag |
|------|---------------|-----------------|-------|-----|
| Primary/secondary actions | Copy-pasted `nn-btn-primary` / `nn-btn-secondary` class bundles | **Thin components** or design-system tokens: `NnButton` + `asChild` for `Link` | Preserves semantic colors (project guardrails) | SAFE_FOR_AI |
| Learner CTAs | Mix of `Link` + classes vs `LearnerCtaLink` | Prefer **`LearnerCtaLink`** on `/app` | Expand barrel docs in `learner-ui/index.ts` | SAFE_FOR_AI |

---

## 4. Loading UX

| Area | Current state | Target standard | Notes | Tag |
|------|---------------|-----------------|-------|-----|
| Hub-scale | `hub-page-skeleton.tsx` | Extend **named skeleton exports** per surface | Keeps one folder | SAFE_FOR_AI |
| Lesson detail | Multiple skeleton components | **One barrel** `components/lessons/loading.tsx` re-exporting fallbacks | Reduces import confusion | SAFE_FOR_AI |
| Inline spinners | Text + boolean state scattered | Optional **`LearnerSpinner`** + i18n keys under `learner.*.loading` | Low priority unless a11y audit flags | SAFE_FOR_AI |

---

## 5. Drawers and mobile overlays

| Area | Current state | Target standard | Notes | Tag |
|------|---------------|-----------------|-------|-----|
| Motion / geometry | Duplicated `animate-[nn-drawer-slide-*]` strings | **`NnDrawerFrame`** props: `placement: "top" \| "bottom"` | site-header vs mobile-context-drawer vs onboarding | SAFE_FOR_AI |
| Focus management | Inline in large components | Document **focus-return** contract once extracted | Reduces keyboard traps | SAFE_FOR_AI |

---

## 6. Modals

| Area | Current state | Target standard | Notes | Tag |
|------|---------------|-----------------|-------|-----|
| Native dialog usage | Several one-off `dialog` implementations | Either stay native with **shared hook** (`useNnDialog`) or adopt one Radix Dialog wrapper | Trade-off: bundle size vs consistency | SAFE_FOR_AI |

---

## 7. Paywall and entitlement UX

| Area | Current state | Target standard | Notes | Tag |
|------|---------------|-----------------|-------|-----|
| Full-page block | `SubscriptionPaywall` + `PaywallContext` | **Canonical** for route-level “you need a plan” | Used across many `app/(learner)` pages | SAFE_FOR_AI |
| Inline / partial lock | `premium-gate.tsx` family | **Canonical** for in-flow upgrade prompts | Align primary CTA copy with `SubscriptionPaywall` / brand tier messaging | SAFE_FOR_AI |
| Analytics | `usePremiumGateImpression` vs `trackClientEvent` in subscription paywall | Document **single event naming table** (PostHog) | Avoid double-counting impressions | DEV_ONLY |

---

## 8. Admin vs learner styling

| Area | Current state | Target standard | Notes | Tag |
|------|---------------|-----------------|-------|-----|
| Admin metrics | Local `StatCard` in SEO hub client | Reuse learner **`AnalyticsMetricTile`** if visually acceptable, or **`AdminStatCard`** in `components/admin/ui/` | Prevents N copies of “label/value tile” | DEV_ONLY |

---

## Cross-cutting principles (already partially encoded in code)

1. **`StudyCard`** header comment is the clearest **marketing/list/hub** standard — extend adoption instead of new `nn-study-card` strings.
2. **`learner-ui` barrel** is the stated import path for `/app` primitives — expand it (`LearnerSurfaceCard` export or merge) to prevent parallel `lv-card` APIs.
3. **Semantic tokens** (`premium-gate` doc, `semantic-status-tokens.css`) should remain the color source; standardization must **not** reintroduce raw hex in wrappers.

---

## Out of scope for standardization (unless product asks)

- Rewriting `site-header.tsx` mobile drawer in one pass (high regression risk).
- Forcing shadcn `Dialog` everywhere while native dialog works.
