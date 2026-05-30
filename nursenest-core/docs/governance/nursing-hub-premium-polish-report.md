# Nursing Hub Premium Polish Report

## Scope

This pass refines the existing RN, RPN/PN, NP, and New Grad nursing hub surfaces without changing the information architecture, routes, card order, content model, or learner workflow.

The implementation is an additive CSS convergence layer scoped to:

`[data-nn-nursing-tier-hub="surface"]`

## Desktop Frame Direction

The desktop frame keeps the existing flow:

1. Breadcrumb / overview return
2. Pathway hero band
3. Product preview / readiness context
4. Guided path where present
5. Dense quick-action study cards
6. Premium modules / supporting calls to action

Refinements:

- Hero and quick-action sections share a calmer 78rem maximum measure.
- Study cards retain educational density but use a softer border, quieter shadow, and consistent radius.
- CTA buttons use a 44px-plus target rhythm.
- Metadata and body copy use slightly more consistent line-height for scanning.
- Mobile cards shift from centered tile posture to left-aligned clinical action cards for faster thumb scanning.

## Mobile Frame Direction

The mobile frame preserves the same sections in the same order.

Refinements:

- Section padding compresses without hiding information.
- Cards become natural-height and left-aligned.
- Icons align to the action title instead of floating as decorative badges.
- CTAs expand to full width for reliable touch targets.
- No sticky, hidden, or alternate mobile IA was introduced.

## Theme Variants

The polish layer uses semantic tokens only and inherits existing Blossom, Ocean, and Midnight skins.

- Blossom: warmer surface tint through existing semantic panel tokens.
- Ocean: cooler clinical surface tint through existing brand and info tokens.
- Midnight: darker panel and border mixes with the same structure and spacing.

No theme-specific component forks were introduced.

## Interaction Notes

- Hover lift is intentionally restrained: `translateY(-1px)`.
- Motion uses a 160ms token-like rhythm.
- Reduced motion disables hover transform and transitions.
- Focus-visible states use semantic brand rings.

## Accessibility Notes

- CTA targets are at least 2.75rem.
- Focus states are visible on cards, links, and CTAs.
- Mobile cards use left-aligned text for clearer scan order.
- Typography line-height is normalized for dense educational copy.

## Component Recommendations

Future hub work should converge additional repeated panels into shared primitives:

- Hub section shell
- Hub action card
- Hub metric tile
- Hub clinical callout

Do not create new nursing-only primitives unless the shared primitive cannot represent the clinical density required by these hubs.
