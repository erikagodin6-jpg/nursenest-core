# Auth Transition Architecture QA

**Scope:** Blossom Auth Transition System hardening pass (May 2026).  
**North star:** One emotional-state system via `resolveAuthTransitionPresentation()` + `AuthTransitionShell` — no parallel auth UX architectures.

---

## 1. Remaining inconsistencies (tracked)

| Area | Status | Notes |
|------|--------|-------|
| Reset-password success | **Resolved** | Success + invalid token now use `AuthTransitionShell` (`password-reset-success`, `magic-link-confirmation` invalid). |
| Forgot-password duplicate CTA | **Resolved** | Removed duplicate back-to-login link below shell; copy only from `auth.transition.accountRecovery.*`. |
| OAuth provider labels in shell | **Resolved** | Provider display name flows through presentation `oauthProviderLabel`. |
| Form field validation errors | **Accepted** | `ResetPasswordForm` / `ForgotPasswordForm` keep inline alerts for field/API errors (not transition moments). |
| `pages.*.successMessage` keys | **Legacy** | Still in `marketing-en.json` for non-transition surfaces; forms no longer consume them. |
| Transient URL params (`oauth`, `session`) | **By design** | `AuthStateSurface` strips params after view telemetry; live E2E uses `expect.poll` for brief mount. |
| Verify-email duplicate “Back to sign in” | **Open (low)** | `verify-email-experience-client` still adds a link under panel shell — not duplicate CTA inside shell. |

---

## 2. Resolved fragmentation points

- **`reset-password-form.tsx`**: `done` → `password-reset-success` panel; invalid token → `magic-link-confirmation` invalid panel.
- **`forgot-password-form.tsx`**: success → `account-recovery` panel only; removed unused `successMessage` / `successDetail` props.
- **`marketing-forgot-password-page.tsx` / `marketing-reset-password-page.tsx`**: stopped passing legacy success strings into forms.
- **Telemetry**: `auth-transition-telemetry.ts` adds canonical `data-auth-transition-{kind,tone,layout,motion}` (+ legacy `data-nn-auth-transition*`).
- **Localization guard**: `createAuthTransitionTranslate()` wraps marketing `t()` with EN fixture fallback — no blank or raw-key leakage.
- **Locale contract**: `auth-transition-locale.contract.test.ts` validates EN + FR/ES overlay completeness.

---

## 3. SSR / hydration findings

| Finding | Risk | Mitigation |
|---------|------|------------|
| Transition copy resolves client-side via `useMarketingI18n` | Low | Marketing pages preload shards (`loadMarketingMessageShards`); shell is `"use client"` by design. |
| URL-param banners (`session`, `oauth`) | Low | Render after `useSearchParams`; param strip via `router.replace` post-view — no full navigation loop. |
| `useAuthTransitionPresentation` memo | Low | Stable deps including serialized `studyHint` key. |
| Initial paint without transition | Low | Param-driven banners appear on first client paint; acceptable for auth recovery UX. |

**No hydration mismatch** expected: shells do not SSR different HTML than client for the same param state (client-only subtree).

---

## 4. Localization findings

- **EN:** Complete — 125+ `auth.transition.*` keys in `tools/i18n/marketing/marketing-en.json`.
- **FR / ES:** Overlay files include `auth.transition.*` keys; contract test enforces non-empty values (fallback merge with EN).
- **Runtime:** `createAuthTransitionTranslate()` prevents empty / raw-key display when a shard is missing.
- **FR polish:** Account recovery eyebrow localized; broader FR/ES emotional copy pass remains a content task (not architecture).

---

## 5. Accessibility findings

| Check | Result |
|-------|--------|
| Duplicate `sr-only` + `aria-live` | **Reduced** — panel/loading/oauth use single live region (`aria-label` or `role="status"`); inline banners rely on `AuthMessageBanner` live region only. |
| Heading hierarchy | Full-page email verified: `h1` + `h2` for “what’s next”; panel: `h2` + body. |
| Reduced motion | CSS presets + `prefers-reduced-motion` in `AUTH-MOTION-SPEC.md`; E2E project uses `reducedMotion: "reduce"`. |
| OAuth continuation | `AuthContinuationCard` retains `role="status"`; provider label localized. |
| Keyboard | Panel/full-page CTAs are standard links/buttons inside premium auth shell. |

---

## 6. Telemetry findings

Standard attributes on all shell roots:

- `data-auth-transition-kind`
- `data-auth-transition-tone`
- `data-auth-transition-layout`
- `data-auth-transition-motion`

Legacy hooks preserved: `data-nn-auth-transition`, `data-nn-auth-transition-layout`, `data-nn-premium-auth-session-expired` (via `AuthMessageBanner`).

No duplicate product-analytics hooks added on shell — existing `AuthStateSurface` PostHog events unchanged.

---

## 7. Motion governance findings

- All kinds map to presets in `motionPresetForKind()` (`fade-in`, `celebration`, `continuation-pulse`, `loading-strip`, `calm-recovery`, `none`).
- Shell applies `nn-auth-transition-shell--{preset}` class.
- Watermark breathe uses opacity-only animation (no transform conflict).
- Reduced-motion: decorative motion disabled per `AUTH-MOTION-SPEC.md`; loading strip remains functional (progress indicator).

---

## 8. Continuity-regression findings

`auth-transition-callback-continuity.test.ts` + existing `auth-flow-governance.test.ts` cover:

- Flashcards, CAT, questions, analytics, lessons callbacks through `buildSessionExpiredLoginHref`
- `resolveMarketingAuthRedirectTarget` post-login
- `shouldSkipSessionExpiredRedirect` loop guard

**Governance unchanged:** `auth-flow-governance.ts`, `auth-study-continuation-context.ts`.

---

## 9. Playwright route coverage summary

| Spec | Type | Routes / flows |
|------|------|----------------|
| `tests/e2e/auth/auth-transition-live-routes.spec.ts` | **Live app** | session expired + callback, OAuth continuing, login registered, verify success (login + verify-email), magic-link expired, reset invalid/success (mocked API), mobile, reduced-motion |
| `tests/e2e/auth/premium-auth-convergence.spec.ts` | Live | Updated session-expired copy + `data-auth-transition-kind` |
| `tests/e2e/preview/blossom-auth.capture.spec.ts` | Static mock gallery | Visual baselines (unchanged) |

Run live suite:

```bash
cd nursenest-core && npm run test:e2e -- tests/e2e/auth/auth-transition-live-routes.spec.ts --project=chromium
```

---

## 10. Recommended future improvements

1. **Content:** Complete FR/ES emotional copy review (not just key presence) for `auth.transition.*`.
2. **Verify-email:** Remove redundant outer “Back to sign in” when panel shell primary CTA is sufficient.
3. **SSR snapshot tests:** Optional RSC test that marketing pages preload auth.transition shard IDs.
4. **OAuth E2E:** Optional delay-free assertion via test-only `?oauth=continuing&nn_e2e=1` guard that skips param strip (only if flakiness appears in CI).
5. **Account recovery dev URL:** Keep dev-only reset link block; consider `data-auth-transition-kind` on wrapper for QA selectors.

---

## Verification commands

```bash
cd nursenest-core
npm run test -- src/lib/auth/auth-transition-presentation.test.ts src/lib/auth/auth-transition-governance.test.ts src/lib/auth/auth-transition-locale.contract.test.ts src/lib/auth/auth-transition-callback-continuity.test.ts
npm run test:e2e -- tests/e2e/auth/auth-transition-live-routes.spec.ts tests/e2e/auth/premium-auth-convergence.spec.ts --project=chromium
```

---

*Architecture owners:* `auth-transition-presentation.ts`, `auth-transition-shell.tsx`, `auth-flow-governance.ts`, `docs/governance/AUTH-MOTION-SPEC.md`.
