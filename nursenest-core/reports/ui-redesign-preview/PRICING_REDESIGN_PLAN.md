# Pricing Redesign Plan

## Audit

- Routes: `/pricing`, `/{locale}/pricing`, pathway pricing pages under `/{locale}/{slug}/{examCode}/pricing`, and Allied pricing under `/allied/allied-health/pricing`.
- Shared UI: `PricingHero`, `PricingPageClient`, `pricing-sections`, pricing FAQ bands, and `SubscriptionPaywall`.
- Billing/auth surface: checkout requests, policy acknowledgement, North America billing acknowledgement, Stripe plan payloads, analytics event names, entitlements, route metadata, and localized pricing routes stay behaviorally unchanged.
- Design source: homepage premium language is discoverable in `premium-redesign-2026.css`, `premium-homepage-hero`, `premium-homepage-cta`, semantic tokens, and shared marketing CTA classes. No repo-local Figma spec or Code Connect pricing mapping was found in the searched docs/source set.

## Visual Thesis

Pricing should feel like the premium homepage moved into a checkout decision moment: calm clinical gradients, glassy semantic cards, strong plan hierarchy, reassuring proof, and clear mobile-first CTAs.

## Slice Order

1. Add a pricing-scoped CSS bridge in `premium-redesign-2026.css` using existing semantic/theme tokens only.
2. Restyle the pricing hero and plan selector/card shell to align with premium homepage spacing, gradients, cards, badges, and dark-mode-safe foreground tokens.
3. Restyle FAQ/value/paywall surfaces with the shared premium card and pill language while preserving current copy/i18n calls.
4. Extend Playwright pricing smoke coverage for desktop/mobile, localized route, FAQ accordion behavior, CTAs, and console error capture.
5. Capture screenshots and write the completion summary with validation results, blockers, and regression smoke recommendations.

## Guardrails

- Do not touch logo assets, Stripe pricing math, API payloads, checkout request shape, auth flow, entitlement checks, analytics event names, SEO metadata, slugs, canonicals, or localized route behavior.
- Do not add placeholder copy or raw i18n keys; keep existing resolved copy and server/client fallback behavior.
- Do not add hardcoded product UI colors; use semantic/theme variables and `color-mix`.
- Keep edits incremental and scoped to shared pricing/paywall presentation.
