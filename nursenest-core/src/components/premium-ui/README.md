# NurseNest Premium UI — design system foundation

This folder is the reusable UI primitive layer that the upcoming premium
homepage + nav redesign will compose on top of. Production components today
should keep using their existing locations; this is **additive scaffolding**.

## Goals

- Centralize gradients, shadows, glow rings, glass surfaces, premium buttons,
  pill badges, semantic cards, and section shells.
- Drive everything from CSS variables already defined in:
  - `src/app/theme-palettes.css` (theme tokens like `--theme-primary`)
  - `src/app/semantic-status-tokens.css` (semantic clinical tokens)
- **No hardcoded hex / rgb** in product UI. Use `var(--…)` and
  `color-mix(in srgb, var(--…), …)`.

## Contents

- `tokens.css` — premium-only motion / shadow / radius / spacing variables.
  Layered **on top of** existing tokens (does not redefine them).
- `glass-panel.tsx` — frosted surface used by the floating navigation, hero
  side panels, and modal dialogs.
- `gradient-button.tsx` — CTA-grade button that resolves its gradient from
  theme tokens (so it adapts per palette automatically).
- `section-shell.tsx` — outer responsive container + breathing-room rules
  shared by every premium section (homepage, marketing, study hubs).
- `pill-badge.tsx` — small semantic-aware badge, mapped to
  `semantic-status-tokens.css` color slots.

## Non-goals (for this scaffold)

- Replacing existing production header/nav components. Those swaps belong to
  Phase 3 of the redesign and require staged sub-component analysis.
- Replacing the live homepage hero. That is Phase 4 and must preserve all
  existing SEO/i18n/region/breadcrumb/JSONLD wiring already in
  `src/app/(marketing)/(default)/page.tsx` and
  `src/app/(marketing)/[locale]/page.tsx`.

## How to consume safely

```tsx
import { GlassPanel } from "@/components/premium-ui/glass-panel";
import { GradientButton } from "@/components/premium-ui/gradient-button";
import { PillBadge } from "@/components/premium-ui/pill-badge";
import { SectionShell } from "@/components/premium-ui/section-shell";
```

Treat these as additive primitives. Any new homepage/nav section should
compose them — do not duplicate gradients, shadows, or pill colors inline.
