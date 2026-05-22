# Auth motion spec (Blossom Auth Premium)

Canonical motion for marketing auth routes. Prevents animation drift as new states ship.

## Principles

- Motion supports **continuation** and calm recovery — never “loading forever” anxiety.
- Prefer **opacity + translateY** under 8px; avoid layout-affecting scale on form controls.
- All looping motion respects `prefers-reduced-motion: reduce`.
- Focus rings use token `--auth-focus`; do not animate border on every keystroke.

## Durations

| Token | Value | Use |
|-------|-------|-----|
| `--auth-motion-fast` | `150ms` | Focus ring, chip selection |
| `--auth-motion-base` | `280ms` | Banners, inline errors |
| `--auth-motion-slow` | `420ms` | Page enter, success ring |
| `--auth-motion-loading` | `1.2s` | Continuation progress pulse (loop) |

## Easing

| Token | Curve | Use |
|-------|-------|-----|
| `--auth-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Enter, reveal |
| `--auth-ease-in-out` | `cubic-bezier(0.45, 0, 0.55, 1)` | State cross-fade |
| `--auth-ease-spring` | `cubic-bezier(0.34, 1.2, 0.64, 1)` | Success celebration (subtle) |

## State transitions

### Default → loading (submit / OAuth)

- Form: `data-nn-auth-pending="true"` — inputs `opacity: 0.92`, `pointer-events: none` (no height change).
- Primary CTA: `aria-busy="true"`; label swap only — **no** width change on button.
- Optional: `AuthTransitionShell` loading strip — `nn-auth-transition-fade-in` 280ms.

### Validation error

- `AuthMessageBanner`: fade-in 280ms `--auth-ease-out`; `role="alert"` + `aria-live="polite"`.
- No shake animation (screen-reader hostile).

### Session expired / OAuth error

- Banner tone `info` or `warning`; same fade-in as validation.
- Continuation card: progress pulse on `.nn-auth-continuation-card__progress::after` (1.2s loop).

### Verify email pending → success

- Pending: panel layout, no loop except optional leaf breathe (20s opacity).
- Success full-page: success ring `nn-auth-transition-fade-in` 500ms; steps list static.

### Magic link variants

- **Sent**: calm info banner, no pulse.
- **Invalid**: fade-in only; copy change — no red flash.
- **Expired**: same as invalid with recovery CTA emphasis (primary link, not alarm).

## Leaf watermark

- Classes: `nn-auth-leaf-watermark--drift` / `--drift-slow`
- Animation: `nn-auth-leaf-opacity-breathe` — opacity only (preserves placement transform).
- Reduced motion: animation `none`.

## Mobile

- Sticky login CTA: background gradient fade, not position animation.
- Signup pathway panel hidden ≤980px — **display** toggle, not height collapse (avoid CLS).

## Implementation map

| CSS | File |
|-----|------|
| Banners, loading, continuation | `nursenest-core/src/app/styles/marketing/auth-tokens.css` |
| Shell layout | `hub-system.css`, `pathway-reading.css` |
| Motion presets (TS) | `auth-transition-presentation.ts` → `motionPresetForKind` |

## Analytics

- Fire `verification_email_resent` on resend success (`verify-email` surface).
- Existing signup/login PostHog events unchanged.

## QA checklist

- [ ] No CLS on signup submit (pending state)
- [ ] Reduced motion disables pulse and leaf breathe
- [ ] Focus visible on pathway cards and OAuth buttons
- [ ] Verify success page does not double-animate shell + celebration
