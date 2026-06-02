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

Frames on page **Blossom Auth Premium** (desktop 1440×900 unless noted). Names follow `docs/planning/auth-blossom-figma-program.md`; PNG-backed frames match `auth-mockups/design-png/blossom-auth/`.

**Canvas layout (2026-05-21):**

- **Row 1 (y=0):** sign-in → sign-up → forgot → reset → session-expired → oauth → error (reference)
- **Row 2 (y=980):** sign-in mobile → verify success → verify pending → magic-link sent → invalid → expired
- **Variables:** `NN / Blossom Auth` (sakura, blush, warm-white, charcoal, mint)

| Program ID | Figma frame name | Node ID | Route / notes |
|------------|------------------|---------|----------------|
| `auth/sign-in` | `auth/sign-in · Desktop / Blossom` | `87:2` | `/login` — PNG 01 |
| `auth/sign-in` | `auth/sign-in · Mobile / Blossom` | `88:8` | `/login` mobile — PNG 04 |
| `auth/sign-up` | `auth/sign-up · Desktop / Blossom` | `87:15` | `/signup` — PNG 02 |
| `auth/forgot-password` | `auth/forgot-password · Desktop / Blossom` | `88:2` | `/forgot-password` — PNG 03 |
| `auth/verify-email` | `auth/verify-email · Pending · Desktop / Blossom` | `102:2` | `/verify-email` inbox + resend (Figma build; primary CTA **Continue**) |
| `auth/verify-email` | `auth/verify-email · Success · Desktop` | `88:14` | Post-verify — PNG 05 |
| `auth/reset-password` | `auth/reset-password · Desktop / Blossom` | `88:20` | `/reset-password` — PNG 06 |
| `auth/session-expired` | `auth/session-expired · Desktop / Blossom` | `88:22` | Session timeout — PNG 07 |
| `auth/magic-link` | `auth/magic-link · Sent · Desktop` | `102:14` | Link sent — CTA **Continue** |
| `auth/magic-link` | `auth/magic-link · Invalid · Desktop` | `102:24` | Invalid link — CTA **Retry** |
| `auth/magic-link` | `auth/magic-link · Expired · Desktop` | `102:34` | Expired link — CTA **Retry** |
| `auth/oauth-continue` | `auth/oauth-continue · Desktop / Blossom` | `88:24` | OAuth redirect — PNG 08 |

Reference (not in program eight): `auth/error · Desktop (reference)` `88:26` (PNG 09), `auth/loading · Desktop (reference)` `88:28`.

**Next (per program):** Ocean / Midnight + light/dark variants on separate frames or variable modes — Blossom desktop/light is the approval baseline.  
**Report:** `auth-mockups/auth-blossom-figma-FINAL.md`

## Implementation alignment

Live auth shell: `nursenest-core/src/components/auth/premium-auth-shell.tsx`  
Styles: `nursenest-core/src/app/styles/marketing/hub-system.css` (`.nn-premium-auth-*`)  
Theme: `html[data-theme="blossom"]` in `theme-palettes.css`

Design tokens in mockups use brief sakura `#E86C9A` for CTAs; production Blossom may use `#ffa9cc` — bind Figma variables to semantic tokens when implementing.
