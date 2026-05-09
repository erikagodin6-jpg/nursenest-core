# Figma-first lesson hub redesign (visual only) — Phase 1

**Workspace folder (link in chat):** `/root/nursenest-core/nursenest-core/reports/lesson-hub-figma-first-2026-05-08/`

This Phase 1 deliverable collects reference inspiration and defines what must exist in **Figma before any implementation**. No application code changes are part of this phase.

---

## Reference files (`reference-inspiration/`)

Copied from `/root/.cursor/projects/root-nursenest-core/assets/` (patterns `1homepage-mockup-*.png`, `lesson-06a70573-*.png`). **28 files** total.

| Relative path |
| --- |
| `reference-inspiration/1homepage-mockup-canvas-31c1b202-b4d5-4c28-b872-3c8506a71360.png` |
| `reference-inspiration/1homepage-mockup-canvas-39b8645d-34c6-4624-9f58-8dbda4f29855.png` |
| `reference-inspiration/1homepage-mockup-canvas-72df71d2-9757-41d6-a8e3-675f25cbadff.png` |
| `reference-inspiration/1homepage-mockup-canvas-9677c2b7-34e2-450d-b81c-21e9ca6b402f.png` |
| `reference-inspiration/1homepage-mockup-canvas-e6d56c41-aa13-4e9c-99e1-63f989fd6bc2.png` |
| `reference-inspiration/1homepage-mockup-desktop-234ed51c-7cfe-48e0-9898-173a598f0d14.png` |
| `reference-inspiration/1homepage-mockup-desktop-33adef63-a028-453f-b483-42aa3edae48d.png` |
| `reference-inspiration/1homepage-mockup-desktop-36a6ffcd-d627-4ab1-bb7e-28df516aca5e.png` |
| `reference-inspiration/1homepage-mockup-desktop-63ca62e6-c268-49f2-b7b1-cb43a5aa749d.png` |
| `reference-inspiration/1homepage-mockup-desktop-ef8cc39a-4f71-47c3-817a-a9bb42bed77f.png` |
| `reference-inspiration/1homepage-mockup-hero-638ff06b-e461-4e22-8310-b289ca206d49.png` |
| `reference-inspiration/1homepage-mockup-hero-6457197e-7082-4af3-81a8-61bafefb989d.png` |
| `reference-inspiration/1homepage-mockup-hero-6660efbf-0788-44f0-826a-ea1b7c00fab1.png` |
| `reference-inspiration/1homepage-mockup-hero-70b6ad03-7ca6-48ab-9ae4-3288b8525e8b.png` |
| `reference-inspiration/1homepage-mockup-hero-85801349-44c5-4105-87c4-d5b9b0b16fb5.png` |
| `reference-inspiration/1homepage-mockup-hero-a3a323f2-c631-4397-a55e-9c1ce9339e5f.png` |
| `reference-inspiration/1homepage-mockup-mobile-2a58d04e-3f2a-4ebe-966a-de1f22e8eb8f.png` |
| `reference-inspiration/1homepage-mockup-mobile-cb02b1ab-5a93-450c-9a1d-e3329f763272.png` |
| `reference-inspiration/1homepage-mockup-mobile-e2874d85-5594-4613-9b3f-153ab524263b.png` |
| `reference-inspiration/1homepage-mockup-mobile-e4dfe92b-dea6-4105-a772-243296493744.png` |
| `reference-inspiration/1homepage-mockup-mobile-ee3b5c6b-17ea-485a-abaa-236fa761db48.png` |
| `reference-inspiration/1homepage-mockup-mobile-fed145c5-6343-404c-a316-fc6bfc21e818.png` |
| `reference-inspiration/1homepage-mockup-mobile_2-40d5a106-ce27-4787-9a42-7fcdd34fa7c4.png` |
| `reference-inspiration/1homepage-mockup-mobile_2-47fda860-811e-4596-80ac-6e9dc80cbc7c.png` |
| `reference-inspiration/1homepage-mockup-mobile_2-8d8c2700-1cc1-4db1-96af-61c632e7d41f.png` |
| `reference-inspiration/1homepage-mockup-mobile_2-a12afffe-d2a8-484d-92bb-b188cc744c2a.png` |
| `reference-inspiration/1homepage-mockup-mobile_2-cd44254d-2d01-4506-b06e-e24e18122255.png` |
| `reference-inspiration/lesson-06a70573-bf93-4140-9a4e-3aed411265e4.png` |

---

## Design direction summary

- **Positioning:** Premium SaaS study product — calm, motivating, clinically intelligent; learner-first hierarchy (not dashboard-first grids).
- **Themes:** Visual exploration across **Aurora**, **Ocean**, **Garden**, and **Midnight** (`[data-theme]`); designs should validate readability, semantic status colors, and panel variety without collapsing the UI to a single brand hue.
- **Architecture:** **No URL, routing, entitlement, or information-architecture changes** in Phase 1 — this phase is visual alignment and mockups only; implementation must preserve existing lesson hub behavior.

---

## Figma mockups still required before implementation

Produce frames that cover the matrix below (not every literal combination needs a unique full-page if components + variants are used — but reviewers must be able to **see** each pathway × breakpoint × theme × state combination clearly).

### Surfaces (lesson hub scope)

- [ ] **Lesson hub landing / overview** — hero, pathway context, primary next steps.
- [ ] **Lesson list / library** — filters or sections as currently scoped (cards, density, pagination affordances).
- [ ] **Lesson detail** — reading layout, CTAs, adjacent navigation.

### Viewports

- [ ] Desktop
- [ ] Tablet
- [ ] Mobile

### Pathways (identity / badges / copy tone)

- [ ] RN
- [ ] RPN
- [ ] NP
- [ ] Allied

### Themes

- [ ] Aurora
- [ ] Ocean
- [ ] Garden
- [ ] Midnight

### States (apply across key surfaces)

- [ ] Default / populated
- [ ] Loading / skeleton
- [ ] Empty (no lessons / no results)
- [ ] Error / retry
- [ ] Entitlement / paywall or locked lesson (server-enforced messaging — visual only in Figma)

### Cross-cutting

- [ ] **Component kit** in Figma tied to semantic roles (success / info / warning / danger / chart hues) — aligned with app tokens below.
- [ ] **Responsive behavior notes** (what stacks, what hides, scroll regions).

---

## Implementation gate

**Implementation waits for explicit approval** per project governance: design sign-off and Phase 2 scope agreement before any TSX/CSS changes to learner lesson hubs.

---

## Semantic tokens and theme palettes (code references)

Use these as the source of truth for color semantics when designing; do not invent one-off hex outside documented exceptions.

| Asset | Path (from app root `nursenest-core/`) |
| --- | --- |
| Semantic status tokens & progress/badge utilities | `src/app/semantic-status-tokens.css` |
| Theme palettes (`[data-theme]`) | `src/app/theme-palettes.css` |

Absolute paths for quick open:

- `/root/nursenest-core/nursenest-core/src/app/semantic-status-tokens.css`
- `/root/nursenest-core/nursenest-core/src/app/theme-palettes.css`

Related: global theme commentary — `src/app/globals.css` (do not override `[data-theme]` tokens ad hoc on `:root`).

---

## Source asset note

Copies succeeded from `/root/.cursor/projects/root-nursenest-core/assets/`. If future syncs fail due to permissions, re-copy using the same patterns or document any unmigrated paths here.
