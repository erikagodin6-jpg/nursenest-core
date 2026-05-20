# NurseNest Core Salvage Audit

## Safe to Reuse Directly

- Brand palette and visual identity tokens from `client/src/theme/nursenestTheme.ts`.
- Existing Stripe price ID pattern from `stripe-price-map.json` (normalized to tier/country/duration mapping).
- Country/tier naming conventions: CA/US with RPN, LVN/LPN, RN, NP.

## Safe to Rewrite Using Old Logic

- Authentication flow reimplemented with clean NextAuth + Prisma.
- Entitlement and paywall logic rewritten as centralized server resolver.
- Plan mapping and pathway selection rebuilt in typed domain modules.

## Explicitly Not Reused

- Legacy monolithic route files and mixed-responsibility server modules.
- Service worker and custom asset caching patterns.
- Legacy compile-time heavy scripts and runtime startup hacks.
- Any client-only paywall checks.
