# NurseNest Premium Auth Experience — Design Specification

**Status:** Design authority (Figma-first; implementation via `AuthExperienceShell`)  
**Audience:** Design, engineering, QA  
**Governance:** `docs/governance/figma-premium-ui-mandatory-process.md`, `.cursor/rules/semantic-color-guardrails.mdc`  
**Figma:** [Blossom Auth Premium](https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU/) — extend with Ocean + Midnight frames  
**Code mapping:** `nursenest-core/src/components/auth/auth-experience/`, `src/app/styles/marketing/auth-*.css`

---

## 1. Design intent

### Emotional target (3-second read)

A **premium clinical education platform** — calm, professional, trustworthy, academically credible. Nursing students and healthcare professionals should feel **emotionally safe**, **focused**, and **supported**, not marketed at.

**Not:** generic SaaS auth, Firebase template, gaming UI, EMR dashboard, cartoon medical art, neon gradients, oversized logos.

**Blend (tone only, do not copy):** Linear clarity · Notion restraint · Headspace warmth · modern healthcare dashboards · premium medical education software.

### Mandatory hierarchy (every screen)

1. Welcome / title — what am I doing?
2. Primary auth action — lowest friction path forward
3. Input clarity — labels, validation, errors inline
4. Trust / safety — educational disclaimer, privacy, study continuity
5. Secondary actions — OAuth, switch route, support

---

## 2. Layout families

Four layout families only — **no per-route shell forks**.

| Layout | `data-nn-auth-layout` | Routes / states | Desktop | Mobile |
|--------|----------------------|-----------------|---------|--------|
| **Split editorial** | `split-editorial` | Sign In, Reset Password | 58% story / 42% card (max 72rem) | Single card; story hidden; leaf mark + eyebrow in card header |
| **Signup aspirational** | `signup-aspirational` | Sign Up | Pathway story left + form card right | Story hidden; progress rail + pathway grid in card |
| **Centered glass** | `centered-glass` | Forgot Password, Verify Email, OAuth wait, Magic link | Single card max 32rem, vertically centered | Full-width card, safe-area padding |
| **Verified split** | `verified-split` | Email verified success (full page) | Celebration panel + next-step column | Stacked; primary CTA sticky bottom |

### Desktop grid

```
┌─────────────────────────────────────────────────────────────┐
│  nn-marketing-x · nn-rhythm-page · min-height 88vh          │
│  ┌──────────────────────┬─────────────────────────────────┐ │
│  │  Story panel         │  Auth card (nn-premium-auth-card)│ │
│  │  · leaf + wordmark   │  · AuthLeafWatermark (z-0)       │ │
│  │  · eyebrow + H2      │  · header (eyebrow, H1, sub)     │ │
│  │  · trust chips       │  · state surface (optional)      │ │
│  │  · readiness tiles   │  · form region                   │ │
│  │  · disclaimer        │  · AuthSupportFooter             │ │
│  └──────────────────────┴─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Mobile grid (≤640px)

```
┌─────────────────────┐
│ nn-premium-auth-    │
│ mobile-brand        │
│ (leaf 44px + eyebrow)│
├─────────────────────┤
│ H1 + subtitle       │
│ state banner        │
│ form fields         │
│ sticky primary CTA  │  ← login only
│ OAuth stack         │
│ legal footer        │
└─────────────────────┘
```

**Breakpoints:** 390 (mobile), 768 (tablet stack), 980 (signup story hide), 1440 (desktop reference).

---

## 3. Screen inventory

### 3.1 Sign In (`/login`)

| Attribute | Spec |
|-----------|------|
| Layout | Split editorial |
| Eyebrow | "Welcome back" |
| Title | "Sign in to continue studying" |
| Subtitle | One calm line — adaptive readiness, not marketing fluff |
| Fields | Email, Password (show/hide), Remember me |
| Primary | "Sign in" — full width |
| Secondary | Forgot password link; "Create account" switch |
| OAuth | Google, Apple — glass secondary buttons |
| Story panel | Readiness preview tiles (decorative, non-live data) + trust chips |

### 3.2 Sign Up (`/signup`)

| Attribute | Spec |
|-----------|------|
| Layout | Signup aspirational |
| Progress rail | Step dots: Account → Verify (inactive until post-submit) |
| Story | Pathway grid (RN, RPN, NP, Allied…), preview strip (3 module cards) |
| Form | Name, Email, Password, Pathway (if not pre-selected), Terms checkbox |
| Primary | "Continue" |
| OAuth | Below divider "or continue with" |
| Switch | "Already have an account? Sign in" |

### 3.3 Forgot Password (`/forgot-password`)

| Attribute | Spec |
|-----------|------|
| Layout | Centered glass |
| Eyebrow | "Account recovery" |
| Title | "Reset your password" |
| Subtitle | Reassurance — link expires, check spam |
| Fields | Email only |
| Primary | "Send reset link" |
| Secondary | Back to sign in; Contact support |

### 3.4 Email Verification

| State | Layout | Copy tone |
|-------|--------|-----------|
| **Pending** | Centered glass | "Check your inbox" — show masked email, resend CTA (cooldown) |
| **Verified success** | Verified split | Soft celebration — "You're verified" + continue to study |
| **Expired / invalid** | Inline banner on login | Warning tone — request new link |

### 3.5 Loading & auth transitions

| State | Component | Visual |
|-------|-----------|--------|
| Sign-in pending | `AuthTransitionShell` + loading strip | Leaf mark + "Signing you in…" + progress pulse |
| Sign-up completion | Same | "Setting up your study space…" |
| OAuth redirect | Inline panel | Provider icon + "Continuing with Google…" |
| Session expired | Inline banner | Info/warning — "Session paused" + study progress saved |
| Magic link sent | Panel | Success info — check email |
| Post-login continuation | `AuthContinuationCard` | Resume study URL hint |

### 3.6 Error & validation states

| Type | Presentation |
|------|----------------|
| Field validation | Inline below field; `--auth-danger` border tint; icon optional |
| Auth failure | `AuthMessageBanner` danger tone — title + help line |
| Rate limit | Warning banner — calm, no alarmist red fill |
| Network | Info banner — retry guidance |
| OAuth error | Dedicated oauth-error state surface |

---

## 4. Theme variants

**Rule:** Same layout across themes — **token swap only** (`html[data-theme]`). No structural forks.

| Theme | `data-theme` | Character | Accent mapping |
|-------|--------------|-----------|----------------|
| **Blossom** | `blossom`, `mint-blossom` | Warm, supportive, optimistic | `--semantic-brand`, `--semantic-chart-4`, `--semantic-panel-mint` |
| **Ocean** | `ocean` | Calm educational default | `--semantic-chart-2`, `--semantic-panel-aqua`, `--semantic-panel-cool` |
| **Dark / Midnight** | `midnight` | Immersive workstation, low glare | `--semantic-chart-2/5`, elevated surfaces on `--semantic-bg-base` |

### Per-theme atmosphere (subtle)

- **Page bg:** soft radial gradients at 8–12% opacity using `--semantic-chart-*` + `--semantic-panel-*` — never full-bleed loud gradients
- **Card:** `--auth-surface` + `--auth-border` + `--auth-shadow-md`
- **Leaf watermark:** 5–9% opacity via `AuthLeafWatermark`; breathe animation 20s (disabled under reduced motion)
- **Clinical motif (optional):** faint horizontal "monitor line" divider (1px, `--auth-divider`) between OAuth and credentials — no ECG clipart

### Figma frame matrix (required)

For each screen in §3, produce:

| | Desktop 1440 | Mobile 390 |
|---|-------------|------------|
| Blossom light | ✓ | ✓ |
| Ocean light | ✓ | ✓ |
| Midnight dark | ✓ | ✓ |

Frame naming: `Auth / {Screen} / {Breakpoint} / {Theme}`

---

## 5. Design system tokens

All tokens live on `.nn-premium-auth-system` — see `auth-tokens.css`. **Do not hardcode hex in TSX.**

### 5.1 Core auth tokens

| Token | Source | Use |
|-------|--------|-----|
| `--auth-bg` | `--theme-page-bg`, `--semantic-surface` | Page canvas |
| `--auth-surface` | color-mix semantic surface + panel | Card fill |
| `--auth-surface-elevated` | Lighter mix | OAuth buttons, elevated inputs |
| `--auth-border` | `--semantic-border-soft` + accent mix | Card, dividers |
| `--auth-border-soft` | Soft border | Input rest state |
| `--auth-heading` | `--theme-heading-text` | H1, labels emphasis |
| `--auth-subtext` | `--semantic-text-secondary` | Subtitles, help |
| `--auth-primary` | `--nn-auth-accent-primary`, `--semantic-brand` | Eyebrow, focus, links |
| `--auth-primary-foreground` | `--role-cta-foreground` | Primary button text |
| `--auth-focus` | primary + `--semantic-info` mix | Focus ring fill |
| `--auth-input-bg` | surface mix | Input background |
| `--auth-input-border` | border-soft + primary mix | Input border |
| `--auth-button-primary` | `--role-cta` | Primary CTA |
| `--auth-button-secondary` | elevated surface mix | OAuth, ghost |
| `--auth-success` | `--semantic-success` | Verified, sent states |
| `--auth-warning` | `--semantic-warning` | Session expired |
| `--auth-danger` | `--semantic-danger` | Errors (tinted, not solid red slabs) |
| `--auth-info` | `--semantic-info` | Continuation, magic link |
| `--auth-shadow` | `--semantic-shadow-soft` | Card elevation |
| `--auth-divider` | `--auth-border-soft` | "or continue with" |

### 5.2 Geometry tokens

| Token | Value | Use |
|-------|-------|-----|
| `--auth-radius-card` | `1.55rem` (override via `--nn-auth-radius-card`) | Card, transition panels |
| `--auth-radius-input` | `0.875rem` | Inputs, buttons |
| `--auth-input-min-height` | `3.25rem` (52px) | Inputs, primary button |
| `--nn-auth-input-height` | optional override | Touch-friendly mobile |

### 5.3 Motion tokens

| Token | Value | Use |
|-------|-------|-----|
| `--nn-auth-motion-fade` | `350ms` | Shell enter |
| `--nn-auth-motion-loading-pulse` | `1.2s` | Progress shimmer |
| `--nn-auth-motion-celebration` | `500ms` | Verified ring |

See `docs/governance/AUTH-MOTION-SPEC.md` for preset → kind mapping.

---

## 6. Spacing system

Base unit: **4px**. Auth rhythm uses Tailwind-compatible steps on the card interior.

| Step | Size | Application |
|------|------|-------------|
| xs | 4px | Icon-text gap in chips |
| sm | 8px | Label → input |
| md | 16px | Field stack gap (`space-y-4` in form) |
| lg | 24px | Header → form region |
| xl | 32px | Card padding (mobile min) |
| 2xl | 48px | Card padding (desktop) |
| 3xl | 64px | Split column gap at 1440 |

### Card padding

- Desktop: `clamp(1.35rem, 3vw, 2.2rem)` horizontal; `clamp(1.5rem, 4vh, 2.5rem)` vertical
- Mobile: `1.25rem` horizontal; respect `env(safe-area-inset-*)`

### Reading width

- Form column max: **28rem** inside card
- Centered glass card: **32rem** outer max
- Story copy max: **31rem**

---

## 7. Typography

**Family:** DM Sans (product standard)

| Role | Size | Weight | Tracking | Color |
|------|------|--------|----------|-------|
| Eyebrow | 0.72rem | 800 | 0.08–0.1em uppercase | `--auth-primary` |
| H1 (card) | clamp(1.65rem, 3.5vw, 2rem) | 650 | -0.032em | `--auth-heading` |
| H2 (story) | clamp(1.85rem, 4vw, 3.1rem) | 600 | -0.03em | `--auth-heading` |
| Subtitle | 0.92–0.98rem | 400 | normal | `--auth-subtext` |
| Label | 0.8rem | 650 | normal | `--auth-subtext` |
| Input | 0.95rem | 500 | normal | `--auth-heading` |
| Button | 0.95rem | 650 | normal | `--auth-primary-foreground` |
| Legal / help | 0.72–0.78rem | 500–600 | normal | `--auth-subtext` |

**Copy tone:** Calm instructional. Prefer "Continue studying" over "Get started free". Avoid exclamation marks in errors.

---

## 8. Component specifications

### 8.1 Text input

```
Class: nn-premium-auth-input
Min-height: var(--auth-input-min-height)
Padding: 0 1rem
Border: 1px solid var(--auth-input-border)
Background: var(--auth-input-bg)
Radius: var(--auth-radius-input)
Placeholder: color-mix(auth-subtext 88%, text-muted)

Focus-visible:
  border-color: color-mix(primary 42%, input-border)
  box-shadow: 0 0 0 3px color-mix(focus 55%, transparent)
  outline: none

Error:
  border-color: color-mix(danger 40%, input-border)
  aria-invalid="true" + aria-describedby → error id

Disabled / pending:
  opacity: 0.92; pointer-events: none (form data-nn-auth-pending)
```

### 8.2 Password input

- Trailing toggle: "Show" / "Hide" text button or icon
- Min touch target 44×44px for toggle
- `autocomplete="current-password"` / `new-password` as appropriate

### 8.3 Remember me

- Custom checkbox: `.nn-premium-auth-checkbox`
- Label clickable; 44px row height on mobile

### 8.4 Primary button

```
Class: nn-premium-auth-primary-button
Min-height: var(--auth-input-min-height)
Width: 100%
Background: var(--auth-button-primary)
Color: var(--auth-primary-foreground)
Border: 1px solid color-mix(primary 22%, transparent)
Shadow: var(--auth-shadow)
Radius: var(--auth-radius-input)

Hover: translateY(-1px) — disabled when pending
Focus-visible: same ring as inputs
Loading: label → spinner + "Signing in…"; min-height preserved (no layout shift)
```

### 8.5 OAuth buttons

```
Region: [data-nn-premium-auth-oauth]
Class: nn-premium-auth-oauth-button
Style: auth-button-secondary + provider icon left
Height: 48px min
Divider above: "or continue with" — 0.72rem uppercase optional
```

### 8.6 Message banner

```
Class: nn-auth-message-banner
data-nn-auth-message-tone: default | info | success | warning | danger
Padding: 0.85rem 1rem
Radius: 0.95rem
Title: 0.92rem / 700
Body: 0.88rem / 1.5 line-height
```

### 8.7 Trust chips & readiness tiles

- Decorative only on auth — not live metrics
- Multi-hue per `semantic-color-guardrails` (not all brand-colored)
- Chips: pill, 0.72rem, semantic panel backgrounds

### 8.8 Footer

- `AuthSupportFooter`: Terms · Privacy · Contact
- Educational disclaimer: `AUTH_EDUCATIONAL_DISCLAIMER` — always visible
- Hook: `[data-nn-premium-auth-legal]`

---

## 9. Motion & interaction

### Principles

- **Calm healthcare premium** — motion supports continuity, not delight theater
- **opacity + transform only** on hot paths
- **`prefers-reduced-motion: reduce`** disables pulse, breathe, fade-in

### Interaction catalog

| Interaction | Duration | Easing | Notes |
|-------------|----------|--------|-------|
| Card / banner enter | 350ms | ease-out | `nn-auth-transition-fade-in` |
| Input focus ring | instant | — | no animated outline |
| Primary hover | 150ms | ease | translateY(-1px) max |
| Pathway card hover | 200ms | ease | border + 1px lift |
| Loading pulse | 1200ms | ease-in-out | progress bar only |
| Leaf watermark breathe | 20s | ease-in-out | opacity ±12% |
| Verified celebration | 500ms | ease-out | success ring once |

### Pending form behavior

- `data-nn-auth-pending="true"` on form
- Inputs disabled; primary shows spinner
- No double-submit (sync ref + disabled state)

---

## 10. Accessibility annotations

| Requirement | Implementation |
|-------------|----------------|
| **Contrast** | WCAG AA: `--auth-heading` on `--auth-surface`; verify Midnight separately |
| **Focus** | Visible 3px ring via `--auth-focus`; never `outline: none` without replacement |
| **Landmarks** | `<main>`, card `aria-labelledby="premium-auth-heading"`, story `aria-label` |
| **Errors** | `role="alert"` on banners; fields `aria-invalid` + `aria-describedby` |
| **Keyboard** | Tab order: logo skip → fields → primary → OAuth → footer links |
| **Touch** | Min 44px targets (buttons, checkbox row, password toggle) |
| **Motion** | `@media (prefers-reduced-motion: reduce)` — see AUTH-MOTION-SPEC |
| **Screen readers** | Loading transitions: `aria-live="polite"` on transition shell |
| **Language** | i18n via marketing keys — no hardcoded English in shared components |

---

## 11. Subtle healthcare identity

Use **at most one** motif per screen:

| Motif | Treatment |
|-------|-----------|
| Monitor-line divider | 1px horizontal rule, 48% width centered, `--auth-divider` |
| Telemetry grid | Story panel bg: 4% opacity dot grid (CSS only, no image) |
| Soft waveform | SVG stroke 1px, `--semantic-chart-2` at 6% opacity in card corner |
| Care shape | Rounded superellipse behind leaf watermark only |

**Never:** stethoscope hero art, red cross, pulse ox animation, hospital hallway photos.

---

## 12. Brand restraint

| Element | Spec |
|---------|------|
| Logo | Leaf mark **44–48px** in card header mobile; story desktop row — **no giant hero logo** |
| Wordmark | Adjacent to leaf in story only; optional on mobile |
| Theme pill | Small badge "Ocean · Premium study" — not a promo banner |
| Color | Accents from semantic tokens; CTA uses `--role-cta` not neon gradient (Midnight: subtle dual chart gradient only) |

---

## 13. Figma & repo deliverables

### Existing assets

| Asset | Location |
|-------|----------|
| Blossom HTML gallery | `auth-mockups/blossom-auth-premium-gallery.html` |
| PNG baselines | `auth-mockups/design-png/blossom-auth/` |
| Blossom spec (legacy hex) | `auth-mockups/BLOSSOM-AUTH-DESIGN-SPEC.md` — superseded by §5 tokens |
| Figma program | `docs/planning/auth-blossom-figma-program.md` |
| Live previews | `nursenest-core/src/components/ui-preview/auth-*-live-preview.tsx` |
| E2E | `tests/e2e/auth/premium-auth-convergence.spec.ts` |

### Frame checklist (design team)

- [ ] Sign In — desktop + mobile × Blossom, Ocean, Midnight
- [ ] Sign Up — desktop + mobile × 3 themes
- [ ] Forgot Password — centered × 3 themes
- [ ] Verify pending / verified / expired — × 3 themes
- [ ] Component sheet: input states (default, focus, error, disabled)
- [ ] Component sheet: buttons (primary, oauth, loading)
- [ ] Transition sheet: loading, session expired, OAuth, magic link

### Implementation hooks (do not break)

| Hook | Purpose |
|------|---------|
| `data-nn-premium-auth-system` | Route mode: login, signup, recovery, reset, verify |
| `data-nn-premium-auth-card` | Card region |
| `data-nn-auth-experience-shell` | Shell root |
| `data-nn-auth-layout` | Layout family |
| `data-nn-auth-state` | UI state for QA |
| `data-nn-auth-theme` | Theme annotation |
| `data-nn-premium-auth-oauth` | OAuth region |
| `data-nn-premium-auth-legal` | Disclaimer block |
| `data-auth-transition-kind` | Transition type |

---

## 14. PR acceptance (when implementing)

1. **Before/after** screenshots — same states, same viewports
2. **Emotional UX** — calmer, more trustworthy, less SaaS-template
3. **Hierarchy** — title → primary action → inputs → trust
4. **Simplification** — removed clutter, no duplicate legal blocks
5. **Studying** — callbackUrl preserved; continuation card on resume paths
6. **Themes** — Ocean / Blossom / Midnight parity without layout fork
7. **A11y** — focus rings, contrast spot-check, reduced motion
8. **Tests** — `premium-auth-convergence.spec.ts` green

---

## 15. Copy reference (English baseline)

| Screen | Title | Subtitle (example) |
|--------|-------|-------------------|
| Sign In | Sign in to continue studying | Pick up where you left off — lessons, flashcards, and practice stay in sync. |
| Sign Up | Create your study account | Choose your pathway and we'll personalize your NCLEX readiness plan. |
| Forgot | Reset your password | We'll email a secure link. It expires in 24 hours. |
| Verify pending | Check your inbox | We sent a verification link to **{email}**. |
| Session expired | Session paused | Your study progress is saved. Sign in again to continue. |

All production copy flows through i18n marketing keys — designers annotate Figma; engineers wire keys.
