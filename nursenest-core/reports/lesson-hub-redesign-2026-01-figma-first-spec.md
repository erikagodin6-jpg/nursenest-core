# Lesson hub visual redesign — Figma-first spec (Phase 1)

**Scope:** Marketing / category-first **lesson hubs** only (exam pathway lesson index surfaces).  
**Phase:** Discovery + visual direction via mockups — **no implementation in this document.**

**Approval checkpoint:** **Implementation is blocked until stakeholders approve these mockups** (layout hierarchy, theme treatments, empty/loading/hover chrome). Approved frames become the single reference for a future Phase 2 (TSX/CSS) implementation pass.

---

## Emotional UX goals (learner governance lens)

Aligned with `nursenest-production-governance.mdc` mandatory questions:

| Question | Direction for lesson hubs |
|----------|---------------------------|
| What is the learner trying to accomplish **immediately**? | Orient to their exam pathway, **pick a clinical area (category)**, or search — then open the next lesson with minimal friction. |
| What should **visually dominate**? | Pathway identity (eyebrow + H1), then **category tiles** as the primary map into the library; hero/toolbar reads as one supportive "control strip," not a wall of metrics. |
| What should feel **secondary**? | Breadcrumbs, surface chips (Lessons / Questions / CAT / etc.), lesson counts, bottom compact study nav — visible but not competing with category choice. |
| What can be **removed** (visually de-emphasized vs dense dashboards)? | Internal-facing diagnostic framing; redundant competing headings; flat gray "inventory" vibes — replaced by breathable spacing and semantic color cues. |
| Emotional motivation | Calm confidence ("this library is complete and intelligent"), **study momentum** (clear counts + progress micro-feedback without shame). |
| Cognitive overload | Avoid duplicate CTAs, competing progress widgets per tile, or monochrome rows that all read as the same priority. |
| Immersive vs administrative | **Immersive study-first** — gateway into clinical worlds (categories), not an ops dashboard. |
| Premium modern product | Glass-aligned nav, soft elevated surfaces, multi-hue semantics — brand + clarity without gimmicks. |
| Hours-long session appeal | Low glare, stable hierarchy, gentle gradients — **no video backgrounds** (performance + calm per guardrails). |

---

## Visual hierarchy

1. **Dominant:** Hero band (`LessonsPageShell`) — eyebrow (pathway short name), **page title**, subtitle, optional CTAs; visually anchored by `nn-nursing-tier-hub-hero-band` styling intent (premium pathway hub parity).
2. **Strong secondary:** **Lesson library** section header + **category tile grid** — the learner's primary navigation model on the hub index.
3. **Supportive:** `LessonsToolbar` cluster — country switch + search + total lesson indicator — reads as a single **dashboard strip** below the title block (matches current placement under hero in code).
4. **Peripheral:** `BreadcrumbBar`, `LessonHubSurfaceChips`, optional "Review required" callout, `StudyBottomNav`.

---

## Colour / gradient strategy by theme (mockup names ↔ implementation hint)

Mockups use four **named themes** for stakeholder discussion. Map to existing `[data-theme]` tokens during Phase 2 (`theme-palettes.css`, layered with `semantic-status-tokens.css` — multi-hue semantics preserved).

| Theme (mockup label) | Intended mood | Contrast / accessibility notes |
|---------------------|---------------|-------------------------------|
| **Aurora** | Soft dawn iridescence (lavender / teal / warm peach wash) | Keep body text on light surfaces ≥ WCAG-friendly contrast; reserve iridescence for **background wash** and decorative gradients, not body copy. |
| **Ocean** | Clinical cyan-teal (`ocean` family — aligns with default semantic ocean/clinical cues in tokens) | Strong blue-green brand rail + varied semantic chart hues on tiles/bars — avoid "everything primary." |
| **Garden** | Sage / botanical calm (`sage-garden` direction) | Green-forward but **not** single-hue: pair mint panels with amber/sky progress accents per semantic guardrails. |
| **Midnight** | Dark slate study mode (`midnight` / dark-clinical adjacent) | Elevated dark panels + light text; use **semantic-chart / role colors** on dark for progress (emerald, amber, sky) — never monochrome tiles on charcoal. |

**Global guardrails:** No muddy flat gray grids; no hot pink dominance; no childish rainbow gamification; **no video backgrounds** in hero or body.

---

## Component mapping (mockup regions → existing implementation targets)

Future Phase 2 should prefer **evolving** these components rather than inventing parallel shells.

| Mockup region | Existing component / surface | Source file(s) |
|---------------|------------------------------|----------------|
| Page chrome + hero band | `LessonsPageShell` — `nn-premium-pathway-hub`, `nn-nursing-tier-hub-hero-band`, optional `toolbar` slot | `src/components/pathway-lessons/lessons-page-shell.tsx` |
| Hero dashboard strip (search, country, counts) | `LessonsToolbar` + `CountrySwitcher` | `src/components/pathway-lessons/lessons-toolbar.tsx`, `country-switcher` |
| Category-first hub body | `MarketingLessonsHubCategoryFirstIndex` — section `#pathway-lesson-library`, grid of category `Link` tiles | `src/components/pathway-lessons/marketing-lessons-hub-category-first-index.tsx` |
| Category tile progress | `CategoryProgressBar` + `buildLessonCategoryProgress` when paid progress chrome is on | `category-progress-bar.tsx`, `build-lesson-category-progress.ts` |
| Lesson row/list chrome | `MarketingLessonsHubCategoryLessonsSurface` — paginated lesson rows, badges | `marketing-lessons-hub-category-lessons-surface.tsx` |
| Progress badges on rows | `PathwayLessonProgressBadge` | `pathway-lesson-progress-badge` |
| Wayfinding | `BreadcrumbBar`, `LessonHubSurfaceChips` | `breadcrumb-bar.tsx`, `lesson-hub-surface-chips.tsx` |
| Bottom related study links | `StudyBottomNav` | `study-bottom-nav` |
| Semantic colors / multi-hue bars | CSS variables + helpers (`--semantic-*`, chart hues, panel mixes) | `src/app/semantic-status-tokens.css`, `src/app/theme-palettes.css`, `globals.css` |

**Skeleton / loading (mockup panel B):** No dedicated standalone component today — Phase 2 would add **localized skeleton** variants for `LessonsToolbar` + category grid placeholders only (no route or data contract changes required beyond presentational props if approved).

**Anonymous vs Premium chrome (mockup panel C):** Reflects `showPaidProgressChrome` / `canShowPaidPathwayLessonProgress` behavior — **badges, resume CTAs, progress bars** — without changing entitlement logic.

---

## Explicit non-goals (Phase 1 & locked for Phase 2 unless separately approved)

- No URL, route, or redirect changes.
- No Prisma/schema, API response shape, or entitlement/paywall logic changes.
- No SEO metadata, canonical, sitemap, or i18n loader changes.
- No changes to lesson catalog loading, pagination size, or DB verify behavior.
- No new heavy client libraries or video backgrounds.

---

## Generated mockup assets

All files live under:

`nursenest-core/reports/lesson-hub-redesign-mockups/`

| Filename | Caption |
|----------|---------|
| `rn-hub-desktop-aurora.png` | RN category-first hub — desktop, Aurora theme; hero + frosted toolbar strip + multi-hue category grid. |
| `rn-hub-mobile-aurora.png` | RN hub — mobile Aurora; stacked hero, toolbar, and category tiles with glass nav alignment. |
| `rn-hub-desktop-ocean.png` | RN hub — desktop Ocean/clinical cyan theme; same IA, cooler sea-sky wash. |
| `rn-hub-mobile-ocean.png` | RN hub — mobile Ocean; retained hierarchy with teal-forward accents. |
| `rn-hub-desktop-garden.png` | RN hub — desktop Garden/sage botanical theme; cream surfaces + varied green-family semantics on tiles. |
| `rn-hub-mobile-garden.png` | RN hub — mobile Garden; mint/calm category browsing. |
| `rn-hub-desktop-midnight.png` | RN hub — desktop Midnight dark study shell; elevated dark cards + colored progress semantics. |
| `rn-hub-mobile-midnight.png` | RN hub — mobile Midnight; compact dark-mode pathway gateway. |
| `rpn-hub-desktop-ocean.png` | **RPN** pathway — same layout language as RN; Ocean theme; eyebrow/title tuned for practical nursing positioning. |
| `np-hub-desktop-garden.png` | **NP** pathway — Garden theme; advanced-practice verbal identity in hero only. |
| `allied-hub-desktop-midnight.png` | **Allied Health** pathway — Midnight theme; category labels skew allied/clinical foundations while preserving hub structure. |
| `rn-hub-tablet-composite.png` | RN hub — single composite tablet-width layout (Aurora hints), responsive midpoint between desktop grid and mobile stack. |
| `mobile-01-hub-overview-aurora.png` | Mobile **landing** emphasis — hero + toolbar dominate viewport (momentum into library). |
| `mobile-02-category-drill-aurora.png` | Mobile **category drill** — breadcrumb + lesson rows with semantic status badges (maps to category lesson surface). |
| `mobile-03-lesson-cards-aurora.png` | Mobile **card browse** — denser 2-column lesson cards for scanning alternate to list rows. |
| `rn-hub-states-multi-panel.png` | **Three-panel reference:** (A) category tile hover elevation, (B) toolbar + grid skeleton loading, (C) anonymous vs premium chrome contrast (badges/CTA only). |

**Reference inspiration (user-provided, not generated):** Homepage / canvas mockups under `.cursor/projects/root-nursenest-core/assets/` informed glass nav, hero rhythm, and dashboard-strip metaphors — **lesson hub mockups above are the authoritative targets for hub work.**

---

## Summary for stakeholders

- **16** PNG mockups generated for pathways (RN/RPN/NP/Allied), breakpoints (desktop/tablet/mobile), themes (Aurora/Ocean/Garden/Midnight), and key interaction states (multi-panel).
- Implementation teams should treat this file + PNG folder as the **Phase 2 visual contract** once approved.

---

## Sign-off

**Implementation blocked until stakeholder approves mockups.**  
Approver: _________________  Date: _________________
