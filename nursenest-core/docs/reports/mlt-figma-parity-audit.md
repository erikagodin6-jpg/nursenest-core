# MLT / MLS — Figma-first expansion: parity audit & execution plan

**Status:** Pre-implementation — structural audit against codebase + RN/RT allied patterns  
**Product intent:** Expand **Medical Laboratory Technologist (MLT / MLS)** into a premium allied-health ecosystem that feels **native to NurseNest**, not a parallel UI.  
**Authority:** [`docs/governance/figma-premium-ui-mandatory-process.md`](../governance/figma-premium-ui-mandatory-process.md), [`docs/governance/learner-surface-delivery-sequence.md`](../governance/learner-surface-delivery-sequence.md), [`docs/design-system/nursenest-premium-ecosystem-master-spec.md`](../design-system/nursenest-premium-ecosystem-master-spec.md), `.cursor/rules/ecosystem-platform-guardrails.mdc`, `.cursor/rules/semantic-color-guardrails.mdc`.

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

**Registered premium mastery module today (code):** `advanced-lab-interpretation` → route `/allied/medical-lab-technology/modules/advanced-lab-interpretation` (tests assert this shape).

**Design-program modules (Figma phases 2–3):** Hematology, Blood Bank / Transfusion Medicine, Clinical Chemistry, Microbiology, Urinalysis, Histology/Pathology, Molecular Diagnostics, QA / Instrumentation — **product + registry mapping must follow Figma sign-off** (no invented URLs in implementation until mirrored in `allied-mastery-modules` / content contracts).

**Reference ecosystems for visual parity**

| Reference | Role |
|-----------|------|
| **RN / RPN / NP** marketing + learner shells | Premium rhythm, hero density, report-card patterns |
| **Respiratory therapy (allied)** | Same allied `[career]` templates — primary **structural** comparator for hub/lesson/module chrome |
| **Allied global hub** | Category cards, routing into career hubs |

---

## 2. Phase 1 — Figma design system alignment (frame list)

**Rules:** Reuse NurseNest spacing rhythm; **Ocean = structural baseline**; **Blossom + Midnight = token-only variants** (no alternate grids). Annotate each frame with `data-theme`: `ocean` | Blossom family per master spec | Midnight family.

### Public (marketing)

| Frame | Notes |
|-------|--------|
| MLT landing / career hub | Same component family as `AlliedHealthPathwayHub` — hero, breadcrumbs, category signals |
| MLT hub overview | `/allied/mlt` vs `/allied/allied-health` — clarify hierarchy in Figma; **no new nav topology** |
| Premium module previews | Align with existing mastery module cards + lock states |
| Category / topic cards | Match allied hub card hierarchy (`hubCategory: lab`) |
| SEO / article integration | Blog/teaser bands consistent with existing marketing article sections — **preserve canonical + metadata patterns** |

### Learner (`/app/*`)

| Frame | Notes |
|-------|--------|
| MLT dashboard | Learner shell: `nn-learner-*`, report bands, **no generic dashboard tables** |
| Lessons hub | Paginated list visual rhythm — match RN/allied lesson hub density |
| Lesson detail | Single-lesson layout — shared lesson chrome |
| Flashcards hub + session | Existing flashcard shell patterns |
| Practice hub + session + results | Question runner + results — semantic multi-hue feedback |
| CAT hub + results | Midnight-forward density; same shells as other pathways |
| Premium module entry cards | Entitlement / lock / upgrade — server-truth framing only in copy |
| Analytics / report card | Weak-area + momentum — align with dashboard telemetry strips |

**Mobile:** Every row in both tables — duplicate frame at ~390×844 (or project mobile breakpoint).

---

## 3. Phase 2 — Premium module visuals (eight specialties)

For **each** module, design:

- Hero  
- Module dashboard card  
- Lesson cards  
- Analytics / progress band  
- Premium lock / upgrade state  
- Practice + CAT integration tiles  
- Weak-area recommendations  
- Adaptive remediation strip  

**Implementation coupling:** Each module must map to **one** mastery-module slug + entitlement key before dev — schedule a **registry row** update after design freeze.

---

## 4. Phase 3 — MLT-specific visual components (library items)

Design as **variants of existing premium cards**, not a second design system:

| Component | Figma intent |
|-----------|----------------|
| Microscopy viewer cards | Clinical media panel inside `LearnerSurfaceCard` / clinical panel pattern |
| Lab panel / exhibit cards | Exhibit schema consistent with labs-engine placement rules |
| Blood compatibility tables | Table inside semantic bordered panel — mobile horizontal scroll safe |
| QC chart cards | Chart tokens `--semantic-chart-1`…`5`, not brand-only |
| Analyzer / troubleshooting panels | SignalCard / checklist pattern |
| Specimen workflow diagrams | Timeline / step rail — reuse scenario timeline vocabulary where applicable |
| Instrumentation alert cards | Semantic warning/danger + calm hierarchy |
| Critical-value notification blocks | Danger semantics + escalation copy tone |

**Dark mode:** All components — Midnight frames required.

---

## 5. Phase 4 — Structural parity audit (checklist)

Complete **before** implementation PRs. Compare **MLT frames** to **RT + RN reference frames** (or live screenshots).

| Dimension | RN / RT reference | MLT match? | Evidence / notes |
|-----------|---------------------|------------|------------------|
| Navigation hierarchy (marketing + learner) | Canonical allied + app nav | ☐ | |
| Header / learner top-nav pattern | Same chrome as sibling tiers | ☐ | |
| Card spacing & grid rhythm | Shared scale | ☐ | |
| Dashboard density | Not "analytics warehouse" | ☐ | |
| Premium module placement | Modules row matches allied mastery patterns | ☐ | |
| Progress / mastery placement | Report bands + rails | ☐ | |
| Report-card structure | Same card anatomy | ☐ | |
| Lesson ecosystem layout | Hub → detail momentum | ☐ | |
| CTA placement & capitalization | Match RN/allied CTAs | ☐ | |
| Recommendation rails | AdaptiveRecommendationRail / study-loop patterns | ☐ | |
| Mobile stacking | Single column; no horizontal doc overflow | ☐ | |
| Theme parity | Ocean structure = Blossom = Midnight | ☐ | |
| Semantic multi-hue status | No single-hue dashboards | ☐ | |

**CSS sources (code anchors):**

- `src/app/premium-redesign-2026.css`
- `src/app/marketing-brand-atmosphere.css`
- `src/app/semantic-status-tokens.css`
- `src/app/theme-palettes.css` (`[data-theme]`)

---

## 6. Phase 5 — Playwright screenshot baselines

After Figma approval:

1. Capture **current** MLT routes (before) — store under [`docs/screenshots/mlt-figma-parity/`](../screenshots/mlt-figma-parity/README.md).  
2. Archive **Figma exports** (target).  
3. Post-implementation: **after** shots + diff narrative in PR.

Naming: follow sibling programs — `mlt-<surface>-<theme>-<wxh>-full.png`.

---

## 7. Phase 6 — Implementation rules (summary)

- Token-first CSS only; **no** hardcoded product hex/rgb (guardrails).  
- Reuse **LearnerSurfaceCard**, learner shells, `nn-marketing-*`, existing allied pathway hub composition.  
- **No route changes** unless product explicitly approves (stable deep links).  
- Server-enforced entitlements — gated UI mirrors truth only.  
- No SEO regressions (canonical, metadata, indexability per route group).

---

## 8. Phase 7 — QA & governance

Target commands (adjust if package scripts differ):

- `npm run typecheck:critical`
- `npm run test:homepage`
- `npm run test:e2e:aesthetic-audit`
- Focused Playwright: extend allied / pathway specs for MLT routes + theme matrix

Add MLT surfaces to:

- Aesthetic audit suite  
- Visual regression / screenshot inventory  
- Mobile overflow helpers (`tests/e2e/helpers/visual-layout-assertions.ts` patterns)  
- Contrast / readability spot checks on Midnight  

---

## 9. Acceptance criteria (program gate)

- [ ] MLT feels **native** — same premium intelligence + emotion as RN/RT allied.  
- [ ] **Figma file URL + frame IDs** recorded (`figma.com/design/...`).  
- [ ] Ocean / Blossom / Midnight parity — **one** layout; token differences only.  
- [ ] Mobile polished; no generic SaaS drift.  
- [ ] Post-completion summary per [`figma-post-completion-summary-template.md`](../governance/figma-post-completion-summary-template.md).

---

## 10. Open items for design / product

| Item | Owner |
|------|--------|
| Figma file link + component library location | Design |
| Map 8 specialty modules → slugs + entitlement keys | Product + eng |
| Blog/SEO article list for MLT hub | Content |
| Playwright spec paths for MLT matrix | QA |

*Last updated: program charter — fill §5 checklist during design review; update §10 with Figma links when available.*
