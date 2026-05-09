# Figma — mandatory premium UI / UX process

This document is **binding** for any work that touches **aesthetics, layout, hierarchy, spacing, navigation structure, card systems, responsiveness, or visual design** on NurseNest marketing or learner shells. It complements `.cursor/rules/ecosystem-platform-guardrails.mdc`, `semantic-color-guardrails.mdc`, and `nursenest-production-governance.mdc`.

## When Figma is required

Use Figma **before** merging substantial UI changes when the task involves any of:

- Card layouts, section hierarchy, spacing scale, typography hierarchy  
- Responsive layouts and mobile breakpoints  
- Navigation chrome (header, mega-menu, hub strips) — **structure** may not change URLs; visuals may evolve in Figma first  
- Dashboard / readiness / progress / weak–strong-area / study-plan **presentation**  
- Module grouping, chip/badge systems, gradients/background systems  
- Dark-mode layouts and theme variants (Ocean, Midnight, Blossom)  
- Empty / loading states, locked/gated card states, hover/focus interactions  

**Code-only refactors** (types, APIs, no visual delta) do not require Figma.

## Before implementation (mandatory sequence)

1. **Audit live UI** against the current **premium homepage** and sibling hubs (RN / RPN / NP / New Grad / Pre-Nursing / Allied) so changes **converge**, not fork.  
2. **Create or update Figma frames** for the affected surfaces (desktop **and** mobile; light **and** dark).  
3. **Explore in Figma** — card grids, section rhythm, token use, and interaction states — then freeze an **approved** direction.  
4. **Implement** to match approved Figma as closely as feasible using **semantic tokens** and shared primitives (`LearnerSurfaceCard`, `StudyCard`, `nn-marketing-*`, etc.).  
5. **Playwright visual QA** (see below) + attach **evidence** to the PR / final report.

## Figma tool usage (Cursor / agents)

- For **read** (design context, screenshots, metadata): use the official **Figma MCP** (`get_design_context`, `get_screenshot`, `get_metadata`, …).  
- For **write** (variables, components, layout): load the **`figma-use`** skill, then `use_figma` — never call `use_figma` blind.  
- For **diagrams only**: `figma-generate-diagram` + `figma-generate-diagram` skill when applicable.

## Figma file requirements

| Requirement | Detail |
|-------------|--------|
| Variants | Desktop + mobile frames for each changed template |
| Themes | Ocean, Midnight, Blossom — document `data-theme` values on frames |
| Baseline | Current NurseNest premium marketing / learner aesthetic |
| Routing | **No** URL or IA changes unless the product task explicitly allows |
| Branding | Logo, wordmark, DM Sans, canonical nav — preserved |
| Palette | Bright, optimistic pastels; **no** hot pink, neon, muddy gradients, or flat grey slabs |
| Contrast | WCAG-minded; readable in dark mode |
| Feel | Premium, clinical, modern, polished — not generic SaaS |

## Implementation rules

- Match **approved** Figma; if engineering must deviate, document **why** in the PR.  
- Do **not** introduce one-off card systems or spacing ladders in TSX.  
- Remove clutter and **duplicated sections** when Figma shows a single hierarchy.  
- Mobile and dark mode must match Figma breakpoints and theme intent.

## Playwright visual QA (mandatory checks where automated)

Run on affected routes (extend shared specs or hub-specific specs):

- Desktop + mobile viewports  
- Light + dark (`data-theme` / theme toggle if present)  
- No **layout collapse** (premium grid visible; single premium root where applicable)  
- No **horizontal document overflow** (see `tests/e2e/helpers/visual-layout-assertions.ts`)  
- No **NGN** copy on Allied; no **ECG** tiles where product forbids; no **`/admin`** leakage in public chrome  
- **5s** stability after load (existing hub patterns)  
- Screenshots archived under `nursenest-core/docs/screenshots/…` per hub program  

Pixel-perfect “Figma diff” in CI is optional; **side-by-side screenshots** (Figma export + implemented UI) are required evidence for major visual PRs.

## Evidence — final reports & PRs must include

| Evidence item | Notes |
|---------------|--------|
| Figma file URL + key frame / node IDs | Link `figma.com/design/...` |
| Screenshots of major Figma directions | Exported PNG or Figma `get_screenshot` |
| Components / layouts redesigned | Bullet list mapping Figma → code paths |
| Routes / pages visually updated | Exact paths |
| Implemented UI vs Figma | Side-by-side screenshots or short Loom; note intentional deltas |
| Playwright | Spec paths + screenshot directory listing |

Use `reports/*-hub-FINAL.md` (or PR description) as the checklist carrier for hub programs.

## Related

- `docs/governance/figma-post-completion-summary-template.md` — post-ship summary template (see below)  
- `docs/ecosystem-design-system-convergence.md`  
- `reports/allied-health-figma-ui-plan.md` (Allied-specific frame list — update with real file links)  
- `docs/planning/transfusion-ecosystem-figma-brief.md` (example domain Figma brief)  

## Post-completion artifact (mandatory)

After ship, every hub or UI program that used this Figma-first workflow must complete **`docs/governance/figma-post-completion-summary-template.md`** (copy the template into the program’s final report or a dedicated summary doc and fill every section). That summary captures sign-off frames, baseline convergence, theme matrix, Figma-to-code mapping, routes, screenshots, intentional deltas, Playwright evidence, and open design debt so audits and handoffs stay traceable without re-opening Figma or the PR thread.
