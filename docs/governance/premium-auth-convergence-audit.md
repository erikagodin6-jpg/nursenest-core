# Premium Auth Convergence Audit

**Date:** 2026-05-29  
**Scope:** Figma ↔ implementation parity, token discipline, motion, accessibility, mobile  
**Baseline Figma:** [Blossom Auth Premium](https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU/) — frames `87:2`–`102:34`  
**Implementation:** `AuthExperienceShell`, `auth-tokens.css`, `auth-primitives.tsx`

This is a **convergence pass** — not a redesign. Layout families and hierarchy are frozen.

---

## Phase 1 — Figma ↔ implementation parity

| Area | Figma spec | Implementation | Status | Notes |
|------|------------|----------------|--------|-------|
| Sign In layout | Split editorial `87:2` | `split-editorial` via `authLayoutForMode("login")` | ✅ Match | Story + card grid |
| Sign Up layout | Aspirational `87:15` | `signup-aspirational` | ✅ Match | Pathway panel + form |
| Forgot Password | Centered glass `88:2` | `centered-glass` | ✅ Match | Max 32rem |
| Reset Password | Split `88:20` | `split-editorial` | ✅ Match | |
| Verify pending | Centered `102:2` | `centered-glass` + `AuthVerifyEmailPending` | ✅ Match | |
| Card radius | ~1.55rem | `--auth-radius-card` | ✅ Match | |
| Input height | 52px | `--auth-input-min-height` (3.25rem) | ✅ Match | |
| Input radius | 14px | `--auth-radius-input` (0.875rem) | ✅ Match | |
| Focus ring | 3px soft | `--auth-focus` box-shadow | ✅ Match | |
| OAuth stack | Glass secondary | `.nn-premium-auth-oauth-button` | ✅ Match | |
| Legal footer | Disclaimer + links | `AuthSupportFooter` | ✅ Match | |
| Mobile sign-in | Stack `88:8` | Story hidden ≤980px; mobile brand | ✅ Match | |
| Ocean / Midnight frames | Program next wave | `auth-ocean-premium.css`, `auth-midnight-premium.css` | ⚠️ Partial | Blossom Figma is approval baseline; Ocean/Midnight token skins implemented in code |

### Mismatch inventory (resolved this pass)

| ID | Issue | File(s) | Resolution |
|----|-------|---------|------------|
| M1 | Signup inputs used `--border-medium` / `--bg-card` inline Tailwind | `signup-form.tsx` | → `nn-premium-auth-input--block` only |
| M2 | Forgot dev notice used `amber-*` utilities | `forgot-password-form.tsx` | → `nn-premium-auth-dev-notice` (warning tokens) |
| M3 | Forms duplicated `rounded-xl px-* py-*` on inputs/buttons | login, reset, verify | → `auth-primitives.tsx` |
| M4 | Transition panel used semantic inline Tailwind | `auth-transition-shell.tsx` | → `nn-auth-transition-panel__*` classes |
| M5 | Success check icon hex fallback | `auth-transition-shell.tsx` | → `var(--auth-success)` |
| M6 | Mint blossom success accent hardcoded hex | `auth-mint-blossom.css` | → `var(--semantic-success)` |

### Deferred (not blocking convergence)

| ID | Item | Reason |
|----|------|--------|
| D1 | Ocean/Midnight Figma duplicate frames | Design program wave 2 per `auth-blossom-figma-program.md` |
| D2 | Blossom theme pill copy ("Mint Blossom") on verified full-page | Copy/i18n pass — visual only |
| D3 | `auth-mint-blossom.css` atmosphere hex in color-mix | Theme-layer CSS; not TSX — migrate to semantic panel tokens in follow-up |

---

## Phase 2 — Token enforcement

**Authority:** `src/app/styles/marketing/auth-tokens.css` on `.nn-premium-auth-system`

**TSX rule:** Auth forms use `auth-primitives.tsx` or `nn-premium-auth-*` classes only — no product hex, no rogue Tailwind color utilities.

**Guard:** `tests/contracts/premium-auth-token-enforcement.contract.test.ts`

---

## Phase 3 — Interaction consistency

| Interaction | Token / rule |
|-------------|--------------|
| Primary hover | 160ms ease, translateY(-1px) |
| Input focus | 160ms border/box-shadow |
| Shell enter | `--nn-auth-motion-fade` 350ms ease-out |
| Loading pulse | `--nn-auth-motion-loading-pulse` 1.2s |
| Celebration | `--nn-auth-motion-celebration` 500ms |
| Reduced motion | Disables hover lift, leaf breathe, fade-in |

**Authority:** `docs/governance/AUTH-MOTION-SPEC.md`

---

## Phase 4 — Accessibility

| Requirement | Implementation |
|-------------|----------------|
| WCAG AA | `--auth-heading` on `--auth-surface`; Midnight verified in QA matrix |
| Focus visible | 3px `--auth-focus` on inputs, links, checkbox |
| Tab order | Natural DOM order; sticky CTA after fields |
| Errors | `AuthMessageBanner` role=`alert` for danger; `AuthInput` `aria-invalid` |
| Loading | `aria-live="polite"`, `aria-busy` on forms and loading strip |
| Touch targets | Min 44px via `--auth-input-min-height` + checkbox row |

---

## Phase 5 — Mobile hardening

| Check | Status |
|-------|--------|
| Safe-area bottom on sticky CTA | ✅ `env(safe-area-inset-bottom)` in auth-tokens |
| Horizontal overflow | ✅ E2E `expectNoHorizontalOverflow` |
| Story column hidden on mobile signup | ✅ E2E |
| Keyboard overlap | Manual QA recommended on iOS Safari |
| Autofill | `autoComplete` on all credential fields |

---

## Phase 6 — Auth states

All states render inside `AuthExperienceShell` with layout-stable banners/transitions:

- Sign In: idle, loading (`AuthTransitionShell`), invalid credentials, session expired, OAuth pending
- Sign Up: validation, pending, success redirect to verify
- Forgot: sent (`account-recovery` panel), dev notice
- Reset: invalid token, success, validation errors
- Verify: pending, resend, error alert

---

## Phase 8 — Regression protection

| Layer | Path |
|-------|------|
| Static convergence | `tests/contracts/premium-auth-convergence.contract.test.ts` |
| Token enforcement | `tests/contracts/premium-auth-token-enforcement.contract.test.ts` |
| E2E shell + a11y | `tests/e2e/auth/premium-auth-convergence.spec.ts` |
| Transition routes | `tests/e2e/auth/auth-transition-live-routes.spec.ts` |
| Visual PNG archive | `docs/screenshots/premium-auth-system/` |

---

## Verification commands

```bash
cd nursenest-core
node --import tsx --test tests/contracts/premium-auth-convergence.contract.test.ts
node --import tsx --test tests/contracts/premium-auth-token-enforcement.contract.test.ts
```

E2E (requires running app):

```bash
npm run test:e2e -- tests/e2e/auth/premium-auth-convergence.spec.ts
```
