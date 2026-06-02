# RN & RPN/PN public pathway surfaces — premium alignment plan

**Date:** 2026-05-08  
**Scope:** Marketing **public** exam pathway surfaces under `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/` plus related locale hubs (`[locale]/rn`, `[locale]/pn`, blog RN). **Out of scope:** `/app/*` learner shells, Prisma/loaders, SEO canonical contracts, i18n key renames, analytics event names.

---

## 1. Figma & design references

| Source | Finding |
|--------|---------|
| Repo `figma.com` URLs | **No embedded file keys** in tracked TS/CSS (verification doc notes only “Figma-aligned” spacing in `globals.css`). |
| `reports/ui-redesign-preview/` (package) | Existing PNG snapshots (`rn-hub-ocean-desktop.png`, `rpn-hub-garden-desktop.png`) — useful for before/after once slices ship. |
| **Primary inference** | Homepage premium stack: `premium-redesign-2026.css`, `.nn-premium-home-eyebrow`, `.nn-marketing-h1` / `.nn-marketing-body`, `theme-palettes.css` + semantic tokens (`--palette-heading`, `--semantic-info`, hub study cards under `[data-nn-nursing-tier-hub="surface"]` in `globals.css`). |

**Gap:** No authoritative Figma node IDs in-repo; parity is **homepage + token docs + existing hub card system**.

---

## 2. Route map — public RN vs PN/RPN

All core pathway URLs follow **`/[locale]/[slug]/[examCode]`** (see `exam-product-registry.ts` for normalization: Canada `pn` + `rex-pn` → **rpn** segment in URLs).

### 2.1 Shared pathway segment (all nursing tiers)

| Route file | Purpose |
|------------|---------|
| `[locale]/[slug]/[examCode]/page.tsx` | Pathway **overview hub** (nursing tier hub, intl RN sections, allied hub) |
| `[locale]/[slug]/[examCode]/layout.tsx` | Shell + progress listener |
| `[locale]/[slug]/[examCode]/lessons/page.tsx` | Lessons index |
| `[locale]/[slug]/[examCode]/lessons/[lessonSlug]/page.tsx` | Lesson detail + category listing |
| `[locale]/[slug]/[examCode]/lessons/topics/[topicSlug]/page.tsx` | Topic hub |
| `[locale]/[slug]/[examCode]/questions/page.tsx` | Question bank marketing hub |
| `[locale]/[slug]/[examCode]/cat/page.tsx` | CAT marketing |
| `[locale]/[slug]/[examCode]/pricing/page.tsx` | Pricing |
| `[locale]/[slug]/[examCode]/study/[topicSlug]/page.tsx` | Study topic |
| `[locale]/[slug]/[examCode]/study-resources/[bodyKey]/page.tsx` | Study resources |
| `[locale]/[slug]/[examCode]/clinical-scenarios/page.tsx` | Clinical scenarios |
| `[locale]/[slug]/[examCode]/osce/page.tsx`, `osce/[stationId]/page.tsx` | OSCE |
| `[locale]/[slug]/[examCode]/[exam]/page.tsx` | NP alias / special exam segment |

**Representative URLs**

- **US RN:** `/us/rn/nclex-rn`
- **US PN (NCLEX-PN):** `/us/pn/nclex-pn` (role track `lpn` in data)
- **CA RPN (REx-PN):** `/ca/rpn/rex-pn`

### 2.2 Extra marketing routes

- `(marketing)/(default)/[locale]/rn/page.tsx` — RN locale landing
- `(marketing)/(default)/[locale]/pn/page.tsx` — PN locale landing
- `(marketing)/(default)/blog/rn/*` — blog RN index + slug

---

## 3. Component inventory (by slice)

| Slice | Heroes | Cards | Breadcrumbs | CTAs | Filters / chrome |
|-------|--------|-------|-------------|------|-------------------|
| **Tier overview hub** | `NursingTierHubPage` (+ intl `InternationalRnHubSections`) | `StudyCard` + `nn-exam-hub-study-card--*` | `BreadcrumbBar` in page | Tiles link to lessons / flashcards / questions / exams | — |
| **Lessons** | Marketing lessons surfaces (`MarketingLessonsHub*`) | Lesson cards | Category rails | Resume CTAs | Category filters |
| **Questions / CAT** | Pathway-specific marketing layouts | Cards, inventory strips | Breadcrumb helpers | App deep links | — |

---

## 4. Typography / spacing gaps (pre-redesign)

| Area | Issue | Target |
|------|--------|--------|
| Tier hub hero | Raw `<h1>` / `<p>` without palette classes | `.nn-marketing-h1`, `.nn-marketing-body`, `.nn-premium-home-eyebrow`, existing `.nn-nursing-tier-hub-hero-band` |
| Section rhythm | Default margins vs homepage `nn-section-shell` sections | Match gap scale (`mt-8` / `lg:gap-5`) and hero elevation in `premium-redesign-2026.css` |
| Dark mode | Hub cards already tokenized; hero band could flatten on midnight/apex | Scoped dark overrides on `.nn-premium-pathway-hub .nn-nursing-tier-hub-hero-band` |

---

## 5. Implementation order (lowest risk first)

1. **Tier overview hub shell** (`NursingTierHubPage`) — shared by RN, PN, RPN, NP tier hubs; single component, high visibility.
2. **US RN hub spot-check** (`/us/rn/nclex-rn`) — Playwright already references this URL.
3. **Parallel PN/RPN** — same component; validate `/us/pn/nclex-pn`, `/ca/rpn/rex-pn`.
4. **Lessons marketing index + category** — larger surface; reuse pathway card tokens.
5. **Questions hub + CAT** — ensure tabs/buttons wrap at 320px.

---

## 6. Shared extraction candidates (avoid duplication)

- **Pathway hero block:** eyebrow + title + intro using premium typography (implemented on tier hub first).
- **Section wrapper:** optional `.nn-premium-pathway-hub` + future `.nn-premium-pathway-section` for subpages.
- **Category colour chips:** map lesson categories to semantic tokens (below), not one-off hex.

---

## 7. Semantic colour mapping (lesson / topic categories)

Use **`semantic-status-tokens.css`** / chart tokens — **no ad-hoc hex** in TSX.

| Category theme | Suggested token emphasis |
|----------------|---------------------------|
| Pathophysiology | `--semantic-chart-1` / `--semantic-info` |
| Clinical pearls | `--semantic-chart-2` or `--semantic-brand` |
| Labs | `--semantic-chart-3` |
| Pharm | `--semantic-chart-4` or `--semantic-warning` (use sparingly) |
| Interventions | `--semantic-success` |
| Safety | `--semantic-danger` |
| Case studies | `--semantic-panel-warm` or `--semantic-chart-5` |

---

## 8. Mobile (320–390px) + dark mode checklist (per slice)

- [ ] No horizontal overflow on hub tiles; CTA labels wrap (`min-w-0` on flex children where needed).
- [ ] Touch targets ≥ 44px where components use compact links (study cards already full-card link).
- [ ] Headings use `text-balance` / `text-pretty` where specified.
- [ ] Dark: headings `var(--palette-heading)`, body `var(--palette-text-muted)`, no pure `#000` fills on Apex/Midnight.
- [ ] `prefers-reduced-motion`: rely on existing global motion rules.

---

## 9. Validation commands (after each slice)

From package root `nursenest-core/nursenest-core`:

```bash
npm run typecheck:critical
npm run test:homepage
```

Optional pathway smoke (when env running):

```bash
npx playwright test tests/e2e/tier-matrix/tier-matrix-public-marketing-smoke.spec.ts --config=playwright.smoke.config.ts
```

---

## 10. Blockers

- **No in-repo Figma file IDs** — visual QA remains homepage parity + screenshots + manual theme sweep.
