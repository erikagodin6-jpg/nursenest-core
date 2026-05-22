# Blossom Premium Auth — Design Spec

**Program:** NurseNest authentication & onboarding (Blossom theme)  
**Date:** 2026-05-21  
**Figma:** https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU/ — page `Blossom Auth Premium`

## Emotional target (3-second read)

Premium, intelligent, trustworthy, adaptive, calming under stress, academically focused — *not* generic Tailwind/Firebase auth.

## Visual language

| Token | Hex | Use |
|-------|-----|-----|
| Sakura | `#E86C9A` | CTA, focus, progress, active pathway |
| Blush | `#F7D6E3` | Surfaces, borders, panels |
| Warm white | `#FFFCFA` | Page canvas |
| Charcoal | `#2F2A33` | Headlines |
| Muted charcoal | `#5C5563` | Body |
| Mint | `#B8E8D4` / `#6BC9A8` | Success, trust chips |

Typography: **DM Sans** (product standard). Editorial hierarchy — large calm headlines, medium subheads, restrained bold.

## Screen inventory

| Screen | Layout concept | Desktop | Mobile |
|--------|----------------|---------|--------|
| Sign in | Split editorial + readiness tiles | ✓ PNG 01 | ✓ PNG 04 |
| Sign up | Pathway grid + preview strip + form column | ✓ PNG 02 | Extend from 02 |
| Forgot password | Centered glass card | ✓ PNG 03 | Stack single column |
| Reset password | Split trust panel + strength meter | ✓ PNG 06 | — |
| Email verification | Celebrate left + steps right | ✓ PNG 05 | — |
| Session expired | Centered calm alert | ✓ PNG 07 | — |
| OAuth continuation | Centered loader + provider label | ✓ PNG 08 | — |
| Loading transition | Skeleton + blossom pulse (Figma shell 10) | Figma | — |
| Error | Inline field error, non-threatening copy | ✓ PNG 09 | — |
| Success | Shared with verification / reset complete | ✓ PNG 05 | — |

## Form & interaction

- Inputs: 52px min height, 14px radius, blush border, sakura focus ring (3px soft)
- Primary CTA: full-width gradient sakura, 52px height
- OAuth: glass secondary buttons, Google + Apple
- Micro-motion: restrained fades, blossom accent on success only

## Trust copy (examples)

- Adaptive NCLEX preparation
- Built for nursing students
- Personalized readiness tracking
- Study smarter with adaptive learning

## Footer

Use global NurseNest marketing footer: blossom leaf logo, multi-column links, soft contrast, responsive stack. Shown on desktop sign-in mockup (PNG 01).

## Accessibility

- WCAG AA contrast on charcoal on warm white
- Visible focus rings (sakura mix)
- 44px+ touch targets on mobile
- Clear error text adjacent to fields

## Files in repo

- `auth-mockups/blossom-auth-premium-gallery.html` — source of truth for PNG export
- `auth-mockups/design-png/blossom-auth/*.png` — captured mockups
- `nursenest-core/tests/e2e/preview/blossom-auth.capture.spec.ts` — Playwright capture

## Auth transition governance (code)

Implementation copy, pathway-aware “What’s next” steps, watermark opacity bands, loading messages, and recovery-first error tone live in:

`nursenest-core/src/lib/auth/auth-transition-governance.ts`

Callback safety and resume paths remain in `auth-flow-governance.ts`; study continuation hints in `auth-study-continuation-context.ts`.

| Transition | UI surface |
|------------|------------|
| Email verified | `AuthEmailVerifiedSuccess`, `VerifyStatusBanner` |
| Session expired | `AuthSessionExpiredBanner` |
| OAuth continuation | `AuthContinuationCard` |
| Sign-in success / loading | `AuthTransitionLoading` on `LoginForm` |
| Auth errors | `AuthOAuthErrorBanner`, login validation banner (info tone) |

**Watermark bands:** hero 6–10% (`panel-hero`), ambient 3–6% (`page-ambient`), card corner ~5.5%; opacity via `authLeafOpacityForPlacement()` — never above primary content (`z-0` leaf, `z-[1]` copy).

## PR checklist (when implementing)

- [ ] Before/after screenshots (same states as PNG 01–05)
- [ ] Emotional UX: calmer, more premium, pathway-clear
- [ ] Hierarchy: headline → form → secondary OAuth
- [ ] Simplification: removed dashboard-style clutter from auth
- [ ] Studying: pathway + readiness preview supports momentum
