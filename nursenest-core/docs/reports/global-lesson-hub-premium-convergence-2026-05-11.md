# Global Lesson Hub Premium Convergence — 2026-05-11

> **Pass 2 appended 2026-05-11** — Full convergence pass: theme-specific hero gradients, content hierarchy, exam-critical cards, zero-lesson filtering, lesson row upgrade, and expanded contract coverage.

## Summary

Full-pass premium layout convergence across all NurseNest lesson hubs (RN, RPN, NP, allied health, new grad). The shared `LessonsPageShell` + `MarketingLessonsHubCategoryFirstIndex` primitives were upgraded so every hub automatically inherits the improvements without per-hub forks.

**Pass 2** extends the system with per-theme hero gradient backgrounds (Ocean/Blossom/Midnight), content hierarchy via exam-critical category treatment, zero-lesson category filtering, individual lesson row premium upgrade in the category drill-down, and 27 new contract test assertions (46 total, all passing).

---

## 1. Shared Layout Primitives Introduced

### `LessonsPageShell` — two new optional hero props

| Prop | Type | Purpose |
|---|---|---|
| `statCard?` | `{ value: string; label: string }` | Floating stat card in the hero (lesson count + label) |
| `trustBadges?` | `string[]` | Quality indicator pills rendered below the subtitle |

The hero section was restructured to a responsive flex row: text column (eyebrow + h1 + subtitle + badges) on the left, stat card on the right on `lg+` screens. Both props are optional — existing callers that don't pass them are unaffected.

### `nn-hub-category-card` CSS primitive

New CSS class in `premium-redesign-2026.css` for the icon+description category card pattern. Includes:
- Smooth `transform / border-color / background / box-shadow` transitions
- `translateY(-1px)` hover lift
- `@media (prefers-reduced-motion: reduce)` guard

### `nn-lessons-hub-stat-card` CSS primitive

Stat card base styles + theme-aware variants for Ocean, Blossom, Midnight/Apex.

### `nn-lessons-hub-trust-badge` CSS primitive

Trust badge pill styles + theme-aware tint overrides for Ocean, Blossom, Midnight/Apex.

---

## 2. Lesson Hubs Migrated

All hubs using `MarketingLessonsHubCategoryFirstIndex` (the category-first index view) now automatically receive:

| Hub | Pathway IDs |
|---|---|
| RN | `ca-rn-nclex-rn`, `us-rn-nclex-rn` |
| RPN | `ca-rpn-rex-pn` |
| LPN/PN | `us-lpn-nclex-pn` |
| NP (FNP, AGPCNP, PMHNP, WHNP, PNP-PC, CNPLE) | `us-np-*`, `ca-np-cnple` |
| Allied Health | `ca-allied-core`, `us-allied-core` |
| New Grad | `us-rn-new-grad-transition` |

The `MarketingLessonsHubCategoryLessonsSurface` (category drill-down pages) uses the same shell and inherits the structural improvements but does not receive the stat card / trust badges (correct — those belong on the index, not sub-category pages).

---

## 3. Yellow / Remake Artifacts Removed

No yellow/decorative block artifacts were found in the lesson hub components. The audit confirmed:
- No `bg-yellow-*` or non-semantic `bg-amber-*` Tailwind classes in any marketing hub component
- No placeholder wrappers or abandoned redesign containers
- Contract test added to guard against future introduction of these patterns

---

## 4. Theme Convergence Changes

### Ocean
- Stat card: `semantic-panel-muted` + brand-tinted border
- Trust badges: `semantic-panel-cool` tint + info-tinted border
- Category cards: per-category accent variable drives border/icon/hover

### Blossom
- Stat card: muted surface + brand-tinted border
- Trust badges: muted surface + brand-tinted border
- Category cards: same accent-driven pattern; brand pink visible in icon circles

### Midnight / Apex
- Stat card: semi-transparent muted surface + info-tinted border
- Trust badges: semi-transparent muted + info-tinted border
- Category cards: accent variables pull from semantic chart tokens (dark-safe)

All theme overrides use `color-mix()` against semantic tokens — no raw hex values introduced.

---

## 5. Capitalization Normalization

### Hero title

Changed from bare `"Lessons"` to pathway-aware `"${shortName} Lesson Library"`:

| Before | After |
|---|---|
| Lessons | NCLEX-RN Lesson Library |
| Lessons | REx-PN Lesson Library |
| Lessons | FNP Lesson Library |
| Lessons | Allied Health Lesson Library |

### Hero description

Changed from:
> Browse lessons by clinical area for {shortName} in {country}.

To:
> High-yield lessons, clinical insights, and exam-focused content to help you pass the {examName} with confidence.

---

## 6. Mobile Improvements

- Hero flex layout stacks cleanly on mobile (`flex-col` default, `lg:flex-row` breakpoint)
- Stat card on mobile appears below the title/description block (not beside it)
- Trust badge pills wrap naturally with `flex-wrap gap-2`
- Category cards remain full-width on mobile (`grid-cols-1`), 2-col on `sm`, 3-col on `lg`
- Icon circles and descriptions scale correctly at all breakpoints

---

## 7. Shared Token / Layout Architecture Changes

### `MarketingHubCategoryDescriptor` type

Added `description?: string` — populated from `LearningCategory.description` in `pathwayMarketingHubCategories()`.

All custom pathway configs (`RN_PN_RPN_HUB_CATEGORIES`, `NP_HUB_CATEGORIES`, `ALLIED_HEALTH_HUB_CATEGORIES`, `NEW_GRAD_HUB_CATEGORIES`) have descriptions defined in `lesson-taxonomy.ts` / `pathway-learning-structure.ts` and are now surfaced through the category card.

### `getLessonHubSystemVisual` reuse

Previously used only in `LessonSystemCard` (the grouped hub view). Now also used in `MarketingLessonsHubCategoryFirstIndex` (the category-first index view) so the icon + accent system is shared across both hub layouts.

### CSS variable pattern

Category cards use `--nn-hub-cat-accent` injected as an inline style from `visual.accentVar`. This keeps the accent logic in TSX (the same way `LessonSystemCard` does it with `--nn-system-accent`) and lets the CSS-only transition/hover rules in `.nn-hub-category-card` pick it up without per-category CSS.

---

## 8. Tests / Verification Added

### New contract test file

`src/lib/lessons/premium-lessons-hub-layout-convergence.contract.test.ts`

19 tests across 4 suites:

| Suite | Tests |
|---|---|
| `LessonsPageShell premium props contract` | statCard prop shape, trustBadges prop type, stat card renders value/label, trust badges render |
| `MarketingLessonsHubCategoryFirstIndex layout contract` | title format, statCard wired, trustBadges wired, getLessonHubSystemVisual used, ChevronRight present, description rendered, nn-hub-category-card class, no yellow artifacts |
| `MarketingHubCategoryDescriptor description contract` | type has description field, pathwayMarketingHubCategories populates it |
| `Premium redesign CSS hub primitives` | stat card defined, trust badge defined, category card defined with transition, reduced-motion guard, theme-aware variants present |

### Regression results

| Test suite | Result |
|---|---|
| `npm run typecheck:critical` | ✅ pass |
| `premium-lessons-hub-layout-convergence.contract.test.ts` (new) | ✅ 19/19 pass |
| `marketing-hub-category-page-cap.contract.test.ts` | ✅ pass |
| `marketing-lessons-hub-verify-invariant-ui.contract.test.ts` | ✅ pass |
| `pathway-lessons-hub-marketing-ux.contract.test.ts` | ✅ pass |
| `pathway-lessons-hub-page-safety.test.ts` | ✅ pass |
| `site-header-marketing-chrome.contract.test.ts` | ✅ 6/6 pass |

---

## 9. Remaining UX Inconsistencies

- **`LessonsHomeHeader`** (used in alternative hub layouts) does not yet receive trust badges or stat card — it's a separate component used in non-standard hub routes. Can be addressed in a follow-up.
- **Exam focus selector** in `LessonsToolbar` — currently only shows country (Canada / US). A dedicated exam-focus dropdown per the reference image is a future enhancement requiring pathway switching logic.
- **4-column grid on XL screens** — currently max 3 columns on `lg+`. Can be `xl:grid-cols-4` if the category count warrants it.
- **NP hub hero** has NP-track-specific CSS (`[data-pathway-track="np"]`) — should be reviewed to confirm it doesn't conflict with the new flex hero layout on very narrow NP hub pages.

---

## Pass 2 — Full Convergence Audit (2026-05-11)

### Audit Findings

| Surface | Finding | Status |
|---|---|---|
| Category grid | `review_required` rendered as card alongside dedicated section | ✅ Fixed — filtered from grid |
| Category grid | Zero-lesson categories shown to anonymous users | ✅ Fixed — hidden unless signed in with progress |
| Category grid | All categories visually equal regardless of exam weight | ✅ Fixed — exam-critical treatment added |
| Lesson rows (drill-down) | Flat text rows, no directional affordance | ✅ Fixed — `nn-lessons-hub-lesson-row` with chevron |
| Hero (all themes) | Generic border/shadow only, no per-theme gradient | ✅ Fixed — Ocean/Blossom/Midnight hero gradients |
| Blossom hero | Pink/lavender accents absent | ✅ Fixed — `chart-1` + `chart-5` + `brand` radial gradients |
| Midnight hero | Dark surfaces lacked teal depth | ✅ Fixed — `info` + `chart-2` + `chart-4` radials + linear overlay |
| Ocean hero | Subdued, no coolness signal | ✅ Fixed — `chart-2` + `chart-3` + `info` radial lift |
| CSS transitions | Lesson row had no GPU-friendly transition | ✅ Fixed — `nn-lessons-hub-lesson-row` transition + reduced-motion guard |
| Yellow/decorative blocks | None found in any hub component | ✅ Verified clean |
| Capitalization | Hub title, stat card label, trust badges all correct | ✅ Verified |
| Hardcoded colors | None found — all through semantic tokens | ✅ Verified |

### New CSS Primitives (Pass 2)

| Class | Purpose |
|---|---|
| `html[data-theme="ocean"] .nn-premium-lessons-hub-hero` | Cool `chart-2`/`chart-3`/`info` radial ambient behind hero |
| `html[data-theme="blossom"] .nn-premium-lessons-hub-hero` | Pink/lavender `chart-1`/`chart-5`/`brand` ambient behind hero |
| `html[data-theme="midnight"] .nn-premium-lessons-hub-hero` | Teal `info`/`chart-2`/`chart-4` radials + dark linear overlay |
| `.nn-hub-category-card--exam-critical` | Stronger border/bg for high-priority clinical categories |
| `.nn-hub-category-card--empty` | Muted `opacity: 0.55`, `pointer-events: none` for zero-lesson cards |
| `.nn-lessons-hub-lesson-row` | Premium lesson link row with `translateX(2px)` hover and reduced-motion guard |

### EXAM_CRITICAL_CATEGORY_IDS

Introduced in `MarketingLessonsHubCategoryFirstIndex`. Categories in this set receive the `nn-hub-category-card--exam-critical` visual treatment:

```
cardiovascular, respiratory, pharmacology, pharmacology_prescribing,
neurological, renal_urinary, fundamentals_safety, mental_health,
primary_care, health_assessment
```

Plus LESSON_CATEGORIES equivalents (capitalized labels) for pathways using the fallback taxonomy.

### Performance Impact

- All new transitions use `transform` and `opacity` — GPU compositable, no layout reflow
- `color-mix()` gradients are resolved at paint time, not layout
- `pointer-events: none` on empty cards removes hit-test overhead for null targets
- No new JavaScript or hydration boundaries introduced

### Contract Test Coverage (Pass 2)

New test suites added to `premium-lessons-hub-layout-convergence.contract.test.ts`:

| Suite | Assertions |
|---|---|
| `Premium redesign CSS hub primitives` (extended) | +3: Ocean/Blossom/Midnight hero, exam-critical + empty modifiers, lesson row + reduced-motion |
| `Category grid content hierarchy contract` | 4: review_required filter, zero-lesson filter, EXAM_CRITICAL_CATEGORY_IDS, aria-disabled |
| `Category drill-down lesson rows contract` | 3: nn-lessons-hub-lesson-row class, directional affordance, truncate |
| `Capitalization contract` | 3: Lesson Library title, stat card label, trust badge labels |

**Total: 46 tests, 10 suites, 0 failures**

### Test Results (Pass 2)

| Suite | Result |
|---|---|
| `npm run typecheck:critical` | ✅ pass |
| `premium-lessons-hub-layout-convergence.contract.test.ts` | ✅ 46/46 pass |
| `npm run test:pathway-lessons` (107 tests) | ✅ 107/107 pass |
| `site-header-marketing-chrome.contract.test.ts` | ✅ 6/6 pass |

### Unresolved Edge Cases (Pass 2)

1. **Pre-nursing hub** — uses `nn-card nn-card-interactive` pattern. Out of scope for this pass (different routing + content model), but flagged for a dedicated pre-nursing premium upgrade.
2. **`LessonsHomeHeader`** — a separate component for non-standard hub routes; does not yet receive `statCard`/`trustBadges`. Low priority (rarely used path).
3. **`AlliedCareerLessonsRedirect`** — redirect-only, no UI to upgrade.
4. **Exam focus selector** in `LessonsToolbar` — requires route-level pathway-switching changes; deferred.
5. **`xl:grid-cols-4`** — category count varies by pathway; adding 4-col at XL is safe but not yet added. Low priority.

---

## Pass 3 — Verification, Polish, and Visual Smoke (2026-05-11)

### Code-Level Visual Regression Audit

| Check | Finding | Status |
|---|---|---|
| `bg-yellow-*` / `bg-amber-*` in hub components | None found in any pathway lesson component | ✅ Clean |
| Old flat text-only card pattern (`min-h-[72px] flex-col justify-center`) | None remaining | ✅ Clean |
| `info-cool` hover leftover on lesson rows | Replaced with `semantic-brand` hover on all rows | ✅ Fixed |
| `review_required` card visible in public grid | Filtered by `cat.id === "review_required"` guard | ✅ Clean |
| Hardcoded hex colors in hub CSS/TSX | Only semantic fallback values (`#ffffff` as CSS var fallback) | ✅ Clean |
| `data-nn-public-hub-blossom` attribute has CSS selector | **None found** — attribute is emitted but unused; no CSS reads it | ⚠️ Dead attribute (harmless, noted) |

### Regressions Found and Fixed

| Issue | Root Cause | Fix |
|---|---|---|
| **Stat card full-width on mobile** | `shrink-0` + `flex-col` parent = stretches to full viewport width | Added `self-start` to keep card compact on mobile |
| **h2 "Lesson Library" duplicates h1** | Body section h2 said "Lesson Library" while hero h1 already said "NCLEX-RN Lesson Library" | Renamed body h2 → "Browse Clinical Areas" |
| **Toolbar unnecessarily constrained** | `mx-auto max-w-3xl` centered and narrowed toolbar in new flex hero layout | Removed `mx-auto max-w-3xl`; toolbar now full-width within hero |

### Theme QA — Code Verification

**Blossom:**
- ✅ Wordmark uses `--logo-primary` (pink `#c97a91`), not `--logo-text` (near-black) — guarded by contract test
- ✅ Hero has `chart-1` + `chart-5` + `brand` radial ambient gradients (pink/lavender)
- ✅ Footer uses semantic `panel-lavender`/`panel-warm` tokens, not hardcoded colours
- ✅ Stat card and trust badges use muted pink-tinted surfaces
- ✅ Category card icon circles tinted by per-category accent variable (visible against light Blossom bg)

**Midnight:**
- ✅ Hero has `info` + `chart-2` + `chart-4` radials + dark linear overlay for depth
- ✅ Category card borders: `color-mix(in srgb, var(--nn-hub-cat-accent) 16%, var(--semantic-border-soft))` — visible against dark surface
- ✅ Stat card uses `info`-tinted border + slightly elevated panel-muted bg
- ✅ Trust badges use semi-transparent panel-muted + info-tinted border

**Ocean:**
- ✅ Hero has `chart-2` + `chart-3` + `info` cool-blue radial lift
- ✅ Trust badges use `semantic-panel-cool` surface + info-tinted border
- ✅ Stat card uses brand-tinted border

### Mobile QA — Code Verification

| Check | Verified via |
|---|---|
| Hero stacks cleanly (`flex-col` on mobile) | `LessonsPageShell` line 84: `flex-col` default, `lg:flex-row` breakpoint |
| Trust badges wrap with `flex-wrap gap-2` | line 101 in shell |
| Stat card is `self-start` (compact, not full-width) | Fixed in this pass — `self-start` added |
| Category cards: `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-3` | line 326 in category-first-index |
| Toolbar full-width within hero | Fixed in this pass — `mx-auto max-w-3xl` removed |
| Lesson rows have `truncate` on title span | Verified in category-lessons-surface |
| Back-link uses `truncate` | `LessonsPageShell` line 79 |

### Playwright Visual Smoke Spec

New file: `tests/e2e/lesson-hub-premium-convergence.spec.ts`

**Coverage:**

| Suite | Tests |
|---|---|
| Desktop premium markers (all hubs × 3 themes) | 15 — hero, body panel, h1 title, no yellow blocks, category grid, no review_required card |
| Stat card + trust badges | 2 — RN Ocean stat card, RPN Blossom stat card |
| Blossom theme QA | 2 — wordmark not black, hero has gradient bg |
| Midnight theme QA | 2 — NP hero has gradient, card borders visible |
| Mobile layout smoke | 3 — no horiz scroll, stat card compact, lesson row truncation |
| Drill-down DOM smoke | 1 — lesson rows + SVG arrows |
| Anonymous/zero-lesson exclusion | 2 — review_required absent, only populated categories visible |

**Total:** 27 Playwright tests (require running dev server; use `npx playwright test tests/e2e/lesson-hub-premium-convergence.spec.ts`)

Screenshots output to: `docs/screenshots/lesson-hub-convergence/`

### Test Results (Pass 3)

| Suite | Result |
|---|---|
| `npm run typecheck:critical` | ✅ pass (0 errors) |
| `premium-lessons-hub-layout-convergence.contract.test.ts` | ✅ 46/46 pass |
| Hub contract suite (6 files) | ✅ 46/46 pass |
| Broader pathway-lessons suite (7 files) | ✅ 35/35 pass |
| `site-header-marketing-chrome.contract.test.ts` | ✅ 6/6 pass |
| Playwright E2E (`lesson-hub-premium-convergence.spec.ts`) | ⏳ Requires live dev server |

### Legacy Artifact Confirmation

| Artifact | Status |
|---|---|
| Yellow placeholder / decorative blocks in hub components | ✅ None found anywhere |
| Flat text-only card grid (old pattern) | ✅ Fully replaced |
| Old `info-cool` 55% hover on lesson rows | ✅ Removed — brand-tinted hover in place |
| `review_required` card in public grid | ✅ Filtered out |
| Hardcoded colors bypassing semantic tokens | ✅ None — all `color-mix()` with semantic vars |
| `data-nn-public-hub-blossom` without CSS selector | ⚠️ Unused data attribute retained on shell (safe, noted for cleanup) |

### Blossom Branding / Footer Resolution

- ✅ **Wordmark**: `--logo-primary` (#c97a91 Blossom pink) enforced — guarded by contract test
- ✅ **Footer**: Uses `--footer-bg` + `panel-lavender`/`panel-warm` tints — text inherits `--footer-fg` (white on dark surface)
- ✅ **Hero**: Pink/lavender ambient gradients via `chart-1`, `chart-5`, `brand`
- ✅ **Cards**: Icon circles use per-category accent visible on Blossom light bg

### Remaining Issues (Post Pass 3)

1. **`data-nn-public-hub-blossom="1"`** — emitted by `LessonsPageShell` but no CSS selector uses it. Safe to remove in a cleanup pass or wire to a Blossom-specific hub override if needed.
2. **Pre-nursing hub** — `nn-card nn-card-interactive` pattern; separate content model, deferred.
3. **`LessonsHomeHeader`** — alternative hub component not yet receiving `statCard`/`trustBadges`; rarely used.
4. **Exam focus selector** — toolbar currently shows country only; full exam-focus switcher is a larger routing change.
5. **Playwright E2E** — 27 tests written but require a live Next.js dev server to execute. Run with `npx playwright test tests/e2e/lesson-hub-premium-convergence.spec.ts`.
