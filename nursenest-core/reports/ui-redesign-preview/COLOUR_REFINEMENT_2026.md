# Colour refinement pass — 2026

## Intent

Slightly brighter, cleaner, more energizing semantic and theme tokens while staying premium clinical SaaS: richer gradients and interactive states, clearer surface separation, cooler-neutral greys (less muddy), fresher berry/teal/azure accents. No route, i18n, analytics, or logic changes.

## Files touched

| File | Changes |
|------|---------|
| `src/app/semantic-status-tokens.css` | `:root` first-paint semantics (brand, info, chart hues, surfaces, muted text); `:where([data-theme])` default chart-5 and semantic-info; ocean/clinical-light overrides; learner hero / glow opacities |
| `src/app/color-roles.css` | First-paint CTA mix, premium glow, progress track, info surfaces (aligned to `#1aaee0`) |
| `src/app/globals.css` | `:root` palette seeds (`--palette-background`, surfaces, text, border, primary) |
| `src/app/theme-palettes.css` | Compact identity themes (mint, blush, ocean, forest, clinical-light, berry, indigo, teal); shared light `:is()` catch-all (section alt, nav, menu hover/active, borders); `dark-clinical`, `midnight`, `apex` (borders, hover/active — Apex `--theme-primary` unchanged for logo parity) |
| `src/app/premium-redesign-2026.css` | Marketing hero radials, premium panel glows, stat-card gradients, section `::before` washes, Apex hero bridge |

## Token groups adjusted

- **Neutrals:** Page/card ladder and `--theme-surface-strong` shifted toward cool `#f4f7fb`; nav/muted text toward blue-gray (`#586574`, `#5f6e82`).
- **Brand / clinical blue:** Ocean-first paint `#1aaee0`; clinical-light primary `#3d8efc`; semantic info sky-azure (`#0ea5dc` themed default, `#5ab8d4` ocean pair).
- **Accents:** Berry orchid `#ae63f5`, indigo `#5f6af5`, teal `#14c4b0`, mint/blush refreshed.
- **Dark:** `dark-clinical` cyan accent `#22d3ee` with lifted borders `#3d4f63`; `midnight` borders `#314466`; `apex` stronger violet rgba borders and menu hover/active (primary hue unchanged).
- **Marketing:** Hero and section ambient gradients + stat tiles slightly higher chroma (opacity stops), no new hard-coded product hex outside existing fallbacks.

## Themes verified (manual / spot-check)

- Default / ocean pipeline: semantic `:root` + `html[data-theme]` bridge.
- Named spot themes edited directly: mint, blush, ocean, forest, clinical-light, berry, indigo, teal, dark-clinical, midnight, apex (border-only on apex primary).

## Screenshots

`preview-screenshots/` contains `.gitkeep` only — add before/after captures when validating visually.

## Validation

Run locally from `nursenest-core/`:

```bash
npm run typecheck:critical
npm run test:homepage
npx tsx --test src/lib/theme/theme-palettes-order.test.ts
```

**Executed in this workspace:** `npx tsc --noEmit -p tsconfig.typecheck-critical.json` (pass), `npm run test:homepage` (pass), `npx tsx --test src/lib/theme/theme-palettes-order.test.ts` (pass).

## Contrast caveats

- **Dark-clinical:** Brighter cyan (`#22d3ee`) on `#1e293b` — confirm focus rings and small text on teal (`#67e8f9`) hover labels remain readable (designed for UI chrome, not body copy).
- **Teal / berry primaries:** WCAG checks recommended on `--theme-primary-foreground: #ffffff` buttons after theme picker QA.
- **Catch-all light themes:** Stronger `--theme-menu-active-bg` (15%) — ensure nav pills stay calm on pastel primaries.
