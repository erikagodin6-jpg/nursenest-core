# Pre-nursing Figma-style redesign — summary

**Date:** 2026-05-08  
**Deliverable type:** Static HTML previews (open via `npx serve` from app root) + design rationale.  
**Themes demonstrated:** Blossom, Ocean, Sage Garden (`sage-garden`), Midnight — via `[data-theme]` on `<html>` aligned with `src/app/theme-palettes.css`.

## Asset locations

| Location | Contents |
|----------|----------|
| `preview-screenshots/prenursing/` | Canonical HTML mocks + `preview-wire.css` |
| `reports/ui-redesign-preview/prenursing/` | **Mirror** of the same files for reporting |

Stylesheets (relative from `preview-screenshots/prenursing/*.html`):

- `../../src/app/theme-palettes.css`
- `../../src/app/semantic-status-tokens.css`
- `./preview-wire.css` (bridge for `--bg-page` / surfaces under `[data-theme]`)

## Surfaces mapped (original request vs repo)

| Requested preview | HTML file | Repo truth |
|-------------------|-----------|------------|
| Hub | `hub.html` | Maps to `/pre-nursing` hub structure (StudyCard-style grid). |
| TEAS prep | `teas-prep.html` | **No** `/pre-nursing/teas` route — preview is a **science-readiness framing** (terminology + chemistry + study strategies cues). |
| HESI prep | `hesi-prep.html` | **No** `/pre-nursing/hesi` route — preview frames **A&P + pathophysiology + assessment** modules as HESI-aligned study emphasis. |
| Anatomy | `anatomy.html` | Canonical module slug `anatomy-physiology`. |
| Chemistry | `chemistry.html` | Module slug `chemistry`. |
| Math | `math.html` | No dedicated `math` slug — preview uses **science-foundations** + quantitative skill framing. |
| Biology | `biology.html` | **Cell biology + microbiology** module slugs as biology cluster. |
| Quiz / practice | `quiz-practice.html` | `/pre-nursing/practice/[slug]` pattern; sample option + rationale band. |
| Flashcards | `flashcards.html` | Hub links to `/flashcards`; preview shows recall stack + semantic progress hues. |
| Mobile | `mobile-hub.html` | Narrow viewport hub variant (`meta viewport`). |

## Design principles (premium clinical academic SaaS)

- **Typography:** system UI stack in previews; production uses app font tokens from root layout.
- **Color:** layout uses `var(--semantic-*)` after theme + semantic load; preview markup avoids ad hoc product hex (bridge CSS uses neutral fallbacks only where theme tokens omit optional keys).
- **Hierarchy:** one dominant headline, secondary muted body, elevated cards on `var(--semantic-surface-elevated)`.
- **Momentum:** primary CTA pattern (Continue / Start) on quiz + hub mocks.

## Phase 3 (live theme implementation)

**Deferred** in this recovery slice: applying redesigned JSX/CSS across production pre-nursing routes requires visual QA against full `globals.css` + learner governance rules. This delivery completes **Phase 1 audit** + **Phase 2 static previews**; Phase 3 should follow as a focused PR with before/after screenshots from the running app.

## QA notes

- Prefer `npx serve` from `nursenest-core/` so `../../src/app/*.css` resolves reliably.
- Targeted Playwright for pathways remains `pathway-prenursing-allied-access.spec.ts` (credentials-dependent).

---

*Documentation only.*
