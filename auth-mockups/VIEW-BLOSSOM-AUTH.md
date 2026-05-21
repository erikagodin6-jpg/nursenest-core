# Blossom Premium Auth — View Mockups

## Quick view (PNG gallery)

Open in browser:

- **Index:** `auth-mockups/design-png/blossom-auth/index.html`
- **Source HTML (all states):** `auth-mockups/blossom-auth-premium-gallery.html`

## Five flagship unique layouts (minimum deliverable)

| # | File | Concept |
|---|------|---------|
| 1 | `01-sign-in-split-editorial-desktop.png` | Split editorial — readiness preview + calm form |
| 2 | `02-sign-up-pathway-aspirational-desktop.png` | Pathway picker (RN/RPN/NP/Allied) + study previews |
| 3 | `03-forgot-password-centered-glass-desktop.png` | Centered glass recovery card |
| 4 | `04-sign-in-mobile-native.png` | Mobile-native stack + sticky CTA |
| 5 | `05-email-verification-success-desktop.png` | Verification success + next steps |

## Full screen set (9 PNGs)

Also exported: reset password, session expired, OAuth continuation, auth error.

## Re-capture PNGs

From repo root:

```bash
cd nursenest-core
npx playwright test tests/e2e/preview/blossom-auth.capture.spec.ts --project=chromium
```

Or:

```bash
node auth-mockups/capture-blossom-auth.mjs
```

## Figma

- **File:** [NurseNest ecosystem Figma](https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU/)
- **Page:** `Blossom Auth Premium`
- **Variables:** `NN / Blossom Auth` (sakura, blush, warm white, charcoal, mint)

Frames on canvas (desktop 1440×900 unless noted):

1. `Desktop / 01 Sign In — Split Editorial`
2. `Desktop / 02 Sign Up — Pathway`
3. `Desktop / 03 Forgot Password — Centered`
4. `Mobile / 04 Sign In — Native` (390×844)
5. `Desktop / 05 Email Verified — Success`
6. `Desktop / 06 Reset Password` … `10 Loading Transition` (labeled shells — refine against PNGs)

## Implementation alignment

Live auth shell: `nursenest-core/src/components/auth/premium-auth-shell.tsx`  
Styles: `nursenest-core/src/app/styles/marketing/hub-system.css` (`.nn-premium-auth-*`)  
Theme: `html[data-theme="blossom"]` in `theme-palettes.css`

Design tokens in mockups use brief sakura `#E86C9A` for CTAs; production Blossom may use `#ffa9cc` — bind Figma variables to semantic tokens when implementing.
