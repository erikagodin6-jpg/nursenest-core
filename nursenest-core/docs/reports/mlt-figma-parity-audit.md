# MLT / MLS — Figma-first expansion: parity audit & execution plan

**Status:** Pre-implementation — structural audit against codebase + RN/RT allied patterns  
**Product intent:** Expand **Medical Laboratory Technologist (MLT / MLS)** into a premium allied-health ecosystem that feels **native to NurseNest**, not a parallel UI.  
**Authority:** [`docs/governance/figma-premium-ui-mandatory-process.md`](../governance/figma-premium-ui-mandatory-process.md), [`docs/governance/learner-surface-delivery-sequence.md`](../governance/learner-surface-delivery-sequence.md), [`docs/design-system/nursenest-premium-ecosystem-master-spec.md`](../design-system/nursenest-premium-ecosystem-master-spec.md), `.cursor/rules/ecosystem-platform-guardrails.mdc`, `.cursor/rules/semantic-color-guardrails.mdc`.

---

## Supported premium themes (canonical — none secondary)

MLT must achieve **full visual parity** across **all** supported premium NurseNest themes. **Sunset** and **Aurora** are **first-class** themes — not optional, degraded, or “accent-only” passes.

| UX label | `html[data-theme]` | Notes |
|----------|-------------------|--------|
| **Ocean** | `ocean` | Structural baseline; default calm study mode |
| **Blossom** | `blossom` | Warm/supportive expression; token-driven only |
| **Midnight** | `midnight` | Dark / high-focus; immersive workstation readability |
| **Sunset** | `sunset` | Warm premium dusk; defined in `theme-palettes.css` |
| **Aurora** | `aurora` | Vibrant atmospheric accents; defined in `theme-palettes.css` |

**CSS / token sources:** `src/app/premium-redesign-2026.css`, `src/app/marketing-brand-atmosphere.css`, `src/app/semantic-status-tokens.css`, `src/app/theme-palettes.css`. Theme registry: `src/lib/theme/theme-registry.ts`.

**Hard rule:** No product UI colors outside semantic + theme token systems (see `.cursor/rules/semantic-color-guardrails.mdc`).

---

## 1. Canonical URL & registry alignment (do not fork IA)

Ground truth from `src/lib/allied/allied-professions-registry.ts` and `src/lib/allied/allied-mastery-modules.ts`:

| Concept | Value |
|--------|--------|
| `professionKey` | `mlt` |
| Route slug aliases | `medical-lab-technology` → `mlt` (see `ALLIED_ROUTE_PROFESSION_KEY_ALIASES`) |
| Hero segment | `mlt-exam-prep` |
| Pathway | `US_ALLIED` (`us-allied-core`) |
| Marketing hub (dynamic) | `/allied/[career]` — e.g. `/allied/mlt`, `/allied/medical-lab-technology`, `/allied/mlt-exam-prep` |
| Global allied index | `/allied/allied-health`, `/[locale]/allied` |
| Lessons/modules (dynamic) | `/allied/[career]/lessons`, `/allied/[career]/modules`, `/allied/[career]/modules/[moduleSlug]` |

**Registered premium mastery module today (code):** `advanced-lab-interpretation` → `/allied/medical-lab-technology/modules/advanced-lab-interpretation`.

**Design-program modules (Figma):** Hematology, Blood Bank / Transfusion Medicine, Clinical Chemistry, Microbiology, Urinalysis, Histology/Pathology, Molecular Diagnostics, QA / Instrumentation — map to registry slugs + entitlements **after** design sign-off.

**Reference ecosystems:** RN/NP (premium rhythm); **Respiratory therapy** allied `[career]` templates (structural comparator); Allied global hub (category cards).

---

## 2. Phase 1 — Figma frame requirements (full theme matrix)

**Minimum frames per screen template:** **5 themes × 2 viewports (desktop + mobile) = 10 frames** per template.

Annotate every frame with `data-theme` matching the table above. **Ocean** defines structure; **Blossom, Midnight, Sunset, Aurora** change **tokens / atmosphere only** — **no alternate grids, nav IA, or card anatomy forks** unless product explicitly approves.

### 2.1 Public (marketing)

For **each** row, deliver **10 frames** (or grouped variant sets in Figma with theme modes — equivalent coverage).

| Surface | Scope |
|---------|--------|
| MLT landing / career hub | `AlliedHealthPathwayHub` family — hero, breadcrumbs, lab category |
| MLT hub vs allied index | Hierarchy clarity — **no new nav topology** |
| **Premium module previews** | **All 5 themes** × desktop + mobile — lock, unlocked teaser, upgrade CTA |
| Category / topic cards | `hubCategory: lab` rhythm |
| SEO / article integration | Canonical/metadata-safe teaser bands |

### 2.2 Learner (`/app/*`)

Same **10-frame minimum per template** (5 themes × 2 viewports).

| Surface | Scope |
|---------|--------|
| MLT-oriented dashboard | Learner shell, report bands — **dashboard + lesson ecosystem parity across all 5 themes** |
| Lessons hub | Paginated list density aligned with allied/RN |
| Lesson detail | Shared lesson chrome |
| Flashcards hub + session | Shell patterns |
| Practice hub + session + results | Semantic multi-hue feedback |
| CAT hub + results | Midnight-friendly density; **also** validate Sunset/Aurora/Ocean/Blossom for streak/readability |
| Premium module entry cards | Lock states **per theme** |
| Analytics / report card | Charts/bands readable on **every** theme |

### 2.3 Frame accounting (planning)

For N distinct page templates in scope, plan **N × 10** frames minimum before optional states (empty, error, reduced motion). Module previews for **eight** specialties × **10** theme/viewport frames each if each module has a distinct preview layout — adjust in Figma with **variables/components** so token swaps do not multiply manual drift.

---

## 3. Phase 2 — Premium module visuals (eight specialties)

Per module (hero, dashboard card, lesson cards, progress, lock, practice/CAT tiles, weak-area, remediation): repeat **full theme matrix** for **hero + module card + lock state** at minimum; nested surfaces may use **approved component variants** tied to tokens if engineering parity is proven.

---

## 4. Phase 3 — MLT-specific visual components

Design as **variants** of existing premium cards (`LearnerSurfaceCard`, clinical panels, semantic charts). **Every** listed component must include **Midnight + Sunset + Aurora** frames — not only Ocean/Blossom.

| Component | Theme-sensitive risks |
|-----------|------------------------|
| Microscopy / lab panel cards | Chart/table contrast on Aurora (avoid neon); Sunset (warm bg vs label contrast) |
| Blood compatibility tables | Border clarity (`color-mix` + semantic borders); mobile scroll |
| QC chart cards | `--semantic-chart-1`…`5` readability on dark + warm |
| Critical-value blocks | Danger semantics legible on all five |

---

## 5. Theme-specific design requirements

### 5.1 Sunset (first-class)

- Warm premium gradients and dusk atmosphere **without** muddy orange/brown body text pairings.
- **Strong CTA contrast** — primary buttons remain visually dominant on warm backgrounds.
- Maintain **clinical / professional** tone (no novelty sunset clipart).
- Validate **gradient readability** behind headings and stats (text on gradient passes contrast intent).

### 5.2 Aurora (first-class)

- Vibrant atmospheric accents **without** neon oversaturation on charts, badges, or CTAs.
- Preserve **premium polish** — restrained glow; semantic hues for data, not rainbow brand bars.
- **Analytics / cards / charts:** verify legend, axis, and fill colors remain distinguishable and calm.

### 5.3 Ocean / Blossom / Midnight

- Ocean: structural reference; Blossom: token-only warmth; Midnight: body text, borders, and semantic danger/warning **must** remain readable on dark surfaces.

---

## 6. Explicit theme QA checks (mandatory per release)

Use for **design review** and **implementation QA**:

- [ ] **Dark/light contrast** — body, headings, captions on real content (not placeholder gray).
- [ ] **Gradient readability** — hero and band backgrounds do not swallow text or CTAs.
- [ ] **Button visibility** — primary/secondary/destructive states distinct on all five themes.
- [ ] **Card border clarity** — borders/dividers visible without harsh hex; token-based soft borders.
- [ ] **Chart readability** — multi-hue semantics; no single-hue wall; Midnight/Sunset/Aurora spot-check.
- [ ] **Premium lock-state readability** — upgrade copy + iconography on warm and vibrant themes.
- [ ] **Mobile nav readability** — tap targets, label contrast, no clipped chrome (390×844 baseline).

---

## 7. Playwright aesthetic audit coverage (all five themes)

The shared theme list used by aesthetic screenshot specs is **`AESTHETIC_THEMES`** in `tests/e2e/helpers/aesthetic-audit-shared.ts` — **Ocean, Blossom, Midnight, Sunset, Aurora**.

Run (from `nursenest-core/`):

```bash
npx playwright test -c playwright.aesthetic-audit.config.ts --project=aesthetic-audit tests/e2e/visual-qa/aesthetic-visual-audit.public.spec.ts
npx playwright test -c playwright.aesthetic-audit.config.ts --project=aesthetic-audit tests/e2e/visual-qa/aesthetic-visual-audit.authenticated.spec.ts
```

**MLT program requirement:** When MLT routes are added to the audit route map, they **must** iterate **all five** themes (same bar as `premium-shell-navigation` / convergence contracts). Extend baseline captures under `docs/screenshots/aesthetic-audit-2026/` per existing conventions.

---

## 8. Phase 4 — Structural parity checklist (all themes)

Complete before implementation. Compare MLT frames to RT/RN references **per theme**, not only Ocean.

| Dimension | All themes | Evidence |
|-----------|------------|----------|
| Navigation + learner chrome | ☐ | |
| Card spacing / hierarchy | ☐ | |
| Dashboard density (not “analytics warehouse”) | ☐ | |
| Premium module placement | ☐ | |
| Report-card / telemetry strips | ☐ | |
| CTA placement & capitalization | ☐ | |
| Recommendation rails | ☐ | |
| Mobile stacking / overflow | ☐ | |
| Sunset / Aurora parity (non-degraded) | ☐ | |

---

## 9. Per-theme parity matrix (living document)

Fill **parity status** during Figma review and again after implementation. **Unsupported patterns** = approaches rejected for NurseNest (e.g. raw hex UI, one-off card systems, neumorphism stacks).

| Theme | Parity status | Primary risks | Token / consistency watch | Unsupported patterns |
|-------|----------------|---------------|---------------------------|----------------------|
| Ocean | ☐ Not started | Baseline drift vs homepage | `--theme-*` vs semantic charts | Flat gray metric walls |
| Blossom | ☐ Not started | Over-soft backgrounds vs contrast | Blossom warm surfaces + semantic accents | All-brand CTAs |
| Midnight | ☐ Not started | Body text too dim; borders invisible | Dark surfaces + `--semantic-*` text/border | Pure black pills |
| Sunset | ☐ Not started | Muddy warm neutrals; CTA washout | `sunset` tokens + `color-mix` borders | Decorative orange noise |
| Aurora | ☐ Not started | Neon charts; oversaturated badges | Chart tokens `--semantic-chart-*` | Rainbow primaries on data |

---

## 10. Per-theme screenshot inventory

Archive under [`docs/screenshots/mlt-figma-parity/`](../screenshots/mlt-figma-parity/README.md):

**Required naming:** `mlt-<surface>-<theme>-<width>x<height>-<variant>.png` with `<theme>` ∈ `ocean` | `blossom` | `midnight` | `sunset` | `aurora`.

**Minimum capture set per major surface:**

- Desktop + mobile  
- **All five themes**  
- States: default, loading/skeleton, premium lock, critical-value / alert sample (where applicable)

---

## 11. Phases 5–7 (summary)

- **Implementation:** Token-first only; reuse shells/primitives; server-enforced entitlements; **no SEO regressions**.  
- **QA:** `npm run typecheck:critical`, `npm run test:homepage`, `npm run test:e2e:aesthetic-audit`, focused MLT Playwright once routes are wired.  
- **Governance:** Post-completion summary per [`figma-post-completion-summary-template.md`](../governance/figma-post-completion-summary-template.md).

---

## 12. Acceptance criteria (program gate)

- [ ] MLT feels native to NurseNest on **Ocean, Blossom, Midnight, Sunset, and Aurora**.  
- [ ] **Sunset and Aurora** meet the **same** quality bar as Ocean/Blossom/Midnight — **no** visual degradation.  
- [ ] **No theme-specific readability regressions** (CTAs, cards, charts, locks, mobile nav).  
- [ ] **No hardcoded product colors** outside semantic + theme token systems.  
- [ ] Figma file URL + frame/node IDs recorded; **per-theme** screenshots attached for major surfaces.  
- [ ] Playwright aesthetic / convergence coverage includes **all five** themes for MLT surfaces in scope.

---

## 13. Open items

| Item | Owner |
|------|--------|
| Figma variables for 5 themes | Design |
| Map 8 specialties → registry slugs | Product + eng |
| MLT routes in aesthetic audit route list | Eng |
| Baseline PNG regeneration after theme matrix expansion | QA |

*Update parity table (§9) as frames ship; keep risks honest when tokens need adjustment.*

