# Premium Auth — Design System Primitives (Platform Reference)

**Purpose:** Auth is the reference-quality UI standard for NurseNest. Other modules should inherit these primitives and tokens — not fork parallel patterns.

**Do not redesign** when consuming these — extend via tokens only.

---

## Shell & layout

| Primitive | Class / component | Use |
|-----------|-------------------|-----|
| Auth system root | `.nn-premium-auth-system` | Page wrapper; defines all `--auth-*` tokens |
| Auth card | `.nn-premium-auth-card` | Form surface |
| Experience shell | `AuthExperienceShell` | Route layouts: split, aspirational, centered, verified |
| Story panel | `AuthStoryPanel` | Desktop sign-in editorial column |
| Pathway panel | `AuthSignupPathwayPanel` | Desktop sign-up aspiration column |
| Legal footer | `AuthSupportFooter` | Disclaimer + Terms/Privacy/Support |
| Leaf watermark | `AuthLeafWatermark` | Subtle brand atmosphere (z-0) |

---

## Form primitives (TSX)

**Module:** `src/components/auth/auth-experience/auth-primitives.tsx`

| Component | CSS base | States |
|-----------|----------|--------|
| `AuthField` | `.nn-premium-auth-field` | label + hint rhythm |
| `AuthInput` | `.nn-premium-auth-input--block` | focus, `aria-invalid`, disabled |
| `AuthPrimaryButton` | `.nn-premium-auth-primary-button--block` | hover, focus, disabled, loading (preserve min-height) |
| `AuthCheckbox` | `.nn-premium-auth-checkbox-row` | 44px row, focus ring |
| `AuthTextLink` | `.nn-premium-auth-link` | inline secondary actions |
| `AuthInlineLink` | `.nn-premium-auth-link--center` | centered route switches |

---

## Status & transitions

| Primitive | Component | Tones |
|-----------|-----------|-------|
| Message banner | `AuthMessageBanner` | default, info, success, warning, danger |
| Transition shell | `AuthTransitionShell` | loading strip, inline banner, full-page verified, OAuth continuation |
| Continuation card | `AuthContinuationCard` | OAuth / resume study |
| Form layout | `AuthFormLayout` | `data-nn-auth-pending` guard |

---

## Token map (required)

Defined on `.nn-premium-auth-system` in `auth-tokens.css`:

```
--auth-bg, --auth-surface, --auth-border, --auth-heading, --auth-subtext
--auth-primary, --auth-focus, --auth-input-bg, --auth-input-border
--auth-button-primary, --auth-success, --auth-warning, --auth-danger, --auth-info
--auth-radius-card, --auth-radius-input, --auth-input-min-height
--nn-auth-motion-fade, --nn-auth-motion-loading-pulse, --nn-auth-motion-celebration
```

Theme skins (swap only — no layout fork):

- Blossom: `auth-mint-blossom.css`, `auth-branding-revamp.css`
- Ocean: `auth-ocean-premium.css`
- Midnight: `auth-midnight-premium.css`

---

## Elevation & spacing

| Rule | Value |
|------|-------|
| Card shadow | `--auth-shadow` / `--auth-shadow-md` |
| Field stack gap | 1rem (`space-y-4` on form) |
| Field internal gap | 0.375rem (label → input) |
| Card padding | `clamp(1.25rem, 2.5vw, 2.15rem)` |
| Reading width | 28rem form max inside card |

---

## Motion language (platform benchmark)

- **Calm, premium, subtle** — opacity/transform only on hot paths
- **160ms** interaction feedback (hover/focus on inputs and primary CTA)
- **350ms** enter fades for banners and transition shells
- **`prefers-reduced-motion: reduce`** disables non-essential animation

See `docs/governance/AUTH-MOTION-SPEC.md`.

---

## Accessibility contract

- Danger banners: `role="alert"`, `aria-live="assertive"`
- Loading: `role="status"`, `aria-live="polite"`, `aria-busy`
- Invalid fields: `aria-invalid="true"`
- Focus: visible 3px ring via `--auth-focus` — never removed without replacement

---

## Adoption targets (Phase 9)

Future surfaces should align to auth quality bar:

| Surface | Adopt |
|---------|-------|
| Flashcards / practice setup | Field rhythm, primary CTA height, semantic banners |
| ECG / telemetry workstation | Panel elevation, calm motion, token borders |
| Simulation reports | Status banner tones, reading width |
| Onboarding | Centered glass card pattern, progress rail |
| Dashboards | Multi-hue semantic chips (not single brand bar) |

**Reference implementation spec:** `docs/planning/premium-auth-experience-design-spec.md`
