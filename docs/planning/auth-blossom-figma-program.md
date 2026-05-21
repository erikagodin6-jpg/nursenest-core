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

## Acceptance (PR / program report)

- [ ] Figma file link + frame IDs listed in PR or `reports/*-FINAL.md`
- [ ] Before/after screenshots (desktop + mobile, Blossom + one dark theme)
- [ ] Side-by-side Figma vs implementation for sign-in and sign-up
- [ ] Post-login resume verified for tier-scoped study callbacks (`parseTierScopedAppStudyCallbackPath`)

## Related product work

- Practice exam inline CAT launch: hub `?catLaunch=1` (no separate launch chrome).
- Unified study entry: **Select → Configure → Start** on flashcards and practice exams hubs.
