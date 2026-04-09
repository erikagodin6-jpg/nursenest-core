# Pathway hub architecture — shared system, pathway-specific UX

This document audits how **marketing pathway hubs** share infrastructure while keeping **paywall, entitlement framing, exam naming, and upgrade paths** pathway-specific. It reflects the codebase as of the last update to this file.

## Goals (constraints we preserve)

- **Do not** collapse RN / PN / FNP / NP / allied / generic pathways into one identical hub layout.
- **Do not** centralize pathway-specific paywall or subscription messaging into a single generic component.
- **Do** reuse safe, presentation-agnostic helpers (URLs, breadcrumbs, inventory strips) via **composition**.

---

## 1. Where lesson hubs live

| Surface | Route / entry | Role |
|--------|----------------|------|
| **Lesson library hub** | `[locale]/[slug]/[examCode]/lessons` | Paginated lesson list + pathway-specific body |
| **Exam overview hub** | `[locale]/[slug]/[examCode]` (`ExamPathwayHub`) | Pricing-adjacent overview, CAT emphasis, waitlist — not the lesson list |
| **Question bank hub** | `[locale]/[slug]/[examCode]/questions` | Question bank marketing + related lessons block |
| **App learner surfaces** | `/app/lessons`, `/app/questions`, etc. | Entitlement-gated; separate from marketing hubs |

The **shared shell** for the lesson library page loads data once (`getPathwayLessonsPage`, `listTopicClusters`, `loadPathwayQuestionBankSnapshot`, subscriber resume/progress when allowed). The **body** branches on `pathway.id` / exam family — see below.

---

## 2. Hubs that remain bespoke — and why

### NCLEX-RN (US + Canada)

- **Component:** `NclexRnLessonsHub`
- **Why bespoke:** Client Needs sectioning (`buildNclexRnUsLessonSections`), US vs Canada copy (`region`), NGN / adaptive language (US), SI units / Canadian acute care (CA), RN-level “clinical judgment” framing.
- **Paywall / product:** Marketing copy states subscription gates full depth; **enforcement** is on lesson detail (`canViewFullPathwayLesson`, app layout), not inlined paywall UI in the hub list.

### NCLEX-PN (US) + REx-PN (Canada)

- **Component:** `NclexPnLessonsHub` with `framing: "nclex-pn-us" | "rex-pn-ca"`
- **Why bespoke:** Single component, **explicit exam labels** (`pnExamLabels`) — regulator tone, candidate wording, and Client Needs grouping differ from RN and from each other.
- **Paywall / product:** Same pattern as RN: disclosure in copy; gating on detail/app.

### FNP (US NP)

- **Component:** `FnpLessonsHub` + lazy `FnpLessonExplorer`
- **Why bespoke:** NP-level scope (provider judgment), lifespan/domain explorer, different mistake blocks and previews (`fnp-us-lesson-enrichment`).
- **Paywall / product:** NP subscription scope may differ from RN; hub does not implement checkout — overview hub and app entitlements handle products.

### All other pathways (incl. allied health, additional NP tracks)

- **Component:** `PathwayLessonsGroupedHub` (`visualTone`: `default` | `np`)
- **Why bespoke fallback:** Topic-grouped cards and tone without forcing NCLEX Client Needs or FNP explorer when the pathway is not RN/PN/FNP-shaped.
- **Paywall / product:** Same copy pattern; optional NP visual tone only affects styling, not entitlement logic.

### Exam overview (not the lesson list)

- **Component:** `ExamPathwayHub` + `ExamPathwayHubBody`
- **Why bespoke:** Per-pathway hero, FAQ schema, waitlist banner, NP inventory/alias SEO, CAT emphasis — **different upgrade and acquisition stories** per pathway.

---

## 3. Shared infrastructure already in place (no behavior change)

These are **composition layers** used across pathways:

| Piece | Purpose |
|-------|---------|
| `pathwayLessonsHubBreadcrumbs`, `pathwayLessonHubMetaTitle` / `Description` | SEO + crumbs |
| `PathwayLiveInventoryStrip` | Question + lesson counts for the pathway |
| `PathwayLessonsHubSearch` | Server-paginated search |
| `PathwayLessonPagination` | Page links preserving `q` |
| `PathwayLaunchEssentials` | First-page “start here” bundle |
| `PathwayLessonsResumeHub` + `loadPathwayHubSubscriberData` | Subscriber resume (only when `canViewFullPathwayLesson` allows) |
| `PathwayTopicClusterGroupedNav` | Topic cluster navigation (shared across RN/PN/FNP where used) |
| `PathwayNclexScalableLessonSection` | NCLEX RN/PN lesson row cards + scalable disclosure |
| `PathwayHubSupplementaryDisclosure` | Supplementary disclosure |
| `buildExamPathwayPath` | Marketing links to questions / exam / lessons |
| `MarketingStudyCrossLinks` | Cross-links at bottom |

---

## 4. Shared helpers introduced (aligned)

| Helper | Path | Notes |
|--------|------|--------|
| `pathwayHubAppQuestionsHref(pathwayId, topic?)` | `src/lib/marketing/pathway-hub-app-questions-href.ts` | Single canonical `/app/questions?pathwayId=…&topic=…` used by RN/PN/FNP lesson hubs and NCLEX scalable lesson rows. **Does not** wrap `loginWithCallback`; `PathwayLessonsGroupedHub` keeps its own login-wrapped URLs where needed. |
| `PathwayHubSection` | `src/components/pathway-lessons/pathway-hub-section.tsx` | Presentational **section/nav** shells (`card`, `cardWash`, `callout`, `calloutEmphasis`, `navWash`, `featuredCard`). Used in **NCLEX-RN** and **NCLEX-PN/REx-PN** hubs for repeated `nn-study-card` / `nn-study-callout` surfaces — **no copy or paywall logic** inside the wrapper. |

The app-questions helper removes duplicated local `appQuestionsHref` implementations **without** changing generated URLs (same query string as before).

---

## 5. Paywall and entitlement differences — remain intact

- **Marketing lesson hubs** do not render subscription checkout; they use **disclosure copy** (“Subscription gates full lesson depth; previews remain discoverable”).
- **Lesson detail access** is enforced server-side (`canViewFullPathwayLesson`, app shell) — unchanged by hub refactors.
- **Subscriber-only blocks** on the lessons hub page (`PathwayLessonsResumeHub`, progress badges) only render when `resolveEntitlementForPage` + `canViewFullPathwayLesson` succeed — logic lives in the **page**, not inside bespoke hub components.
- **PathwayLessonsGroupedHub** continues to use `loginWithCallback` for app question links where that path was already chosen for logged-out users.

---

## 6. Regression checklist (manual)

After hub changes, verify:

- [ ] `/us/rn/nclex-rn/lessons` (and CA RN) render `NclexRnLessonsHub`
- [ ] `/us/lpn/nclex-pn/lessons` and Canada REx-PN use `NclexPnLessonsHub` with correct framing
- [ ] FNP hub loads explorer + “How to use” FNP copy
- [ ] A non-NCLEX pathway still uses `PathwayLessonsGroupedHub`
- [ ] `/app/questions?pathwayId=…` links from hub CTAs still resolve (same query shape)
- [ ] Signed-in subscriber still sees resume strip when entitled; others do not

---

## 7. Summary

| Question | Answer |
|----------|--------|
| Which hubs stay bespoke? | NCLEX-RN, NCLEX-PN/REx-PN, FNP, grouped fallback, and exam overview hubs — each keeps exam-specific copy, structure, and product emphasis. |
| What was shared/aligned? | Existing shared shell + `pathwayHubAppQuestionsHref` for app question deep links. |
| Are paywall differences preserved? | Yes — gating remains on entitlement + lesson detail; marketing hubs only disclose. |
| DB / auth / question loading? | **Not modified** by the helper extraction; lesson data loading unchanged on `lessons/page.tsx`. |
