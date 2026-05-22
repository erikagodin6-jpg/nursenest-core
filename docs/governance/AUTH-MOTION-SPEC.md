# Auth transition motion governance

**Scope:** Blossom premium auth transitions (`AuthTransitionShell`, loading strips, full-page verified, OAuth continuation).  
**Authority:** `src/lib/auth/auth-transition-presentation.ts`, `src/app/styles/marketing/auth-tokens.css`.

## Principles

- **Calm healthcare premium** — motion supports continuity and reassurance, not theatrics.
- **Performance** — opacity/transform only; no layout-thrashing animations on auth hot paths.
- **Accessibility** — `prefers-reduced-motion: reduce` disables non-essential motion; focus rings unchanged.

## Duration tokens (CSS variables)

| Token | Value | Use |
|-------|-------|-----|
| `--nn-auth-motion-fade` | `350ms` | Banner/shell enter |
| `--nn-auth-motion-loading-pulse` | `1200ms` | Progress shimmer |
| `--nn-auth-motion-watermark-breathe` | `20s` / `26s` | Hero / ambient leaf opacity |
| `--nn-auth-motion-celebration` | `500ms` | Verified success ring |

## Easing

- Enter: `ease-out`
- Loading pulse: `ease-in-out`
- Watermark breathe: `ease-in-out` (infinite, low amplitude)

## Preset mapping (`motionPreset`)

| Preset | Kinds | Behavior |
|--------|-------|----------|
| `celebration` | email-verified, password-reset-success | Fade-in success ring + panel |
| `loading-strip` | sign-in-success, sign-up-completion, loading, oauth-continuation | Loading strip fade + progress pulse |
| `calm-recovery` | session-expired, authentication-error, magic-link-* | Soft fade-in banner |
| `fade-in` | default | Standard enter |
| `none` | — | Reserved for static embeds |

## Reduced motion

When `prefers-reduced-motion: reduce`:

- Disable `nn-auth-continuation-pulse`, watermark breathe, `nn-auth-transition-fade-in`
- Progress bar shows static 55% fill (existing continuation card rule)

## Focus

- Do not animate `outline` / `box-shadow` on focus-visible
- Sticky mobile CTA on login retains gradient backdrop (no motion)

## Verification

- Playwright: `tests/e2e/preview/blossom-auth.capture.spec.ts` (`animations: "disabled"` for stable PNG baselines)
- Manual: toggle OS reduced motion and confirm loading strip + leaf drift stop
