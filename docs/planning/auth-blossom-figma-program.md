# Auth experience — Blossom Figma program

**Status:** Design program (implementation tracks `PremiumAuthShell` + marketing auth routes).  
**Governance:** `docs/governance/figma-premium-ui-mandatory-process.md`, `docs/governance/learner-surface-delivery-sequence.md`.

## Goal

Replace template-style sign-in/sign-up with a **calm, premium, trustworthy** Blossom auth experience that feels like one product with the learner shell—not a bolt-on SaaS login.

**References (tone, not copy):** Linear, Notion, Stripe, Headspace, Apple Health, modern telehealth onboarding.

## Frames to produce (Figma)

For **each screen**, ship **desktop + mobile**, **light + dark**, themes **Ocean / Blossom / Midnight** where auth uses marketing theme tokens.

| Frame ID (suggested) | Route / state | Notes |
|---------------------|---------------|--------|
| `auth/sign-in` | `/login` | Primary entry; callbackUrl preserved in spec |
| `auth/sign-up` | `/signup` | Pathway rail; fewer fields above fold on mobile |
| `auth/forgot-password` | `/forgot-password` | Reassurance + support link |
| `auth/verify-email` | `/verify-email` | Inbox guidance; resend CTA |
| `auth/reset-password` | `/reset-password` | Strength + match validation states |
| `auth/session-expired` | session timeout surface | Return-to-study CTA |
| `auth/magic-link` | magic link sent / invalid / expired | Three micro-states |
| `auth/oauth-continue` | OAuth redirect / account picker | Provider icons minimal |

## Layout system (must match implementation tokens)

- **Shell:** `nn-premium-auth-system` — two-column desktop (story + card), single card mobile with `nn-premium-auth-mobile-brand`.
- **Logo:** NurseNest leaf + wordmark (`SiteBrandLogoMark` variant `auth`).
- **Story column:** eyebrow, H2, supporting copy, ecosystem chips, disclaimer (hidden on mobile).
- **Card:** `nn-premium-auth-card` + `AuthLeafWatermark` — form, trust strip, legal footer.
- **Spacing:** generous vertical rhythm; mobile min touch 44px; sticky primary CTA optional on mobile signup.

## Visual direction

1. **No template card** — soft borders, semantic surfaces, blossom radial atmosphere (not stock purple gradients).
2. **Hierarchy** — headline communicates NCLEX/adaptive readiness in &lt;3 seconds.
3. **Trust** — “Trusted by nursing students”, readiness language, optional single testimonial or pass-rate chip (subtle).
4. **Accessibility** — input/placeholder contrast, focus rings, error banners using `--semantic-danger` tints.
5. **Continuity** — after auth, learner returns to **same study URL** (practice hub with `catLaunch=1`, flashcards `pathwayId`, etc.).

## Copy pillars (for designers + i18n)

- Calm professionalism, academically confident, emotionally reassuring.
- Avoid: “Welcome to our platform”, crowded bullet walls, generic startup CTAs.

## Implementation mapping (code)

| Area | Path |
|------|------|
| Shell | `nursenest-core/src/components/auth/premium-auth-shell.tsx` |
| Login | `nursenest-core/src/components/auth/login-form.tsx` |
| Marketing pages | `nursenest-core/src/components/marketing/marketing-login-page.tsx` (+ signup/recovery) |
| Styles | `nursenest-core/src/app/styles/marketing/hub-system.css`, `pathway-reading.css` |
| Trust strip | `nursenest-core/src/components/auth/auth-flow-trust-reassurance.tsx` |

## Figma delivery (2026-05-21)

**File:** https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU/ — page **`Blossom Auth Premium`**

| Deliverable | Status |
|-------------|--------|
| Eight program frames (`auth/*`) | **On canvas** — row 1 desktop + row 2 mobile / verify / magic-link |
| PNG-backed Blossom baselines | **Imported** into frames `87:2`–`88:24` from `auth-mockups/design-png/blossom-auth/` |
| Verify-email pending + magic-link (3) | **Built in Figma** `102:2`, `102:14`, `102:24`, `102:34` (centered glass cards) |
| Variables `NN / Blossom Auth` | **Created** — sakura, blush, warm-white, charcoal, mint (+ deep variants) |
| Reference frames | `88:26` error, `88:28` loading (off main grid) |

Full node ID table and PNG index: `auth-mockups/VIEW-BLOSSOM-AUTH.md`.  
Program report: `auth-mockups/auth-blossom-figma-FINAL.md`.

**Next wave (not blocking auth code):** Ocean / Midnight + light/dark duplicate frames; sign-up / forgot / verify **mobile** variants.

## Acceptance (PR / program report)

- [x] Figma file link + frame IDs listed in PR or `reports/*-FINAL.md` (see `auth-mockups/VIEW-BLOSSOM-AUTH.md`, `auth-mockups/auth-blossom-figma-FINAL.md`)
- [x] Blossom desktop + mobile sign-in PNGs placed in Figma (Ocean/Midnight variants deferred)
- [ ] Side-by-side Figma vs implementation for sign-in and sign-up (after auth route polish)
- [ ] Post-login resume verified for tier-scoped study callbacks (`parseTierScopedAppStudyCallbackPath`)

## Related product work

- Practice exam inline CAT launch: hub `?catLaunch=1` (no separate launch chrome).
- Unified study entry: **Select → Configure → Start** on flashcards and practice exams hubs.
