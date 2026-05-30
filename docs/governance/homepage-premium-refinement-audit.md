# Homepage Premium Refinement Audit

**Date:** 2026-05-29  
**Scope:** Targeted UX/UI polish — not a redesign  
**Implementation:** `homepage-premium-polish-pass.css`, `homepage-branding-revamp.css`, marketing section components  
**Hook:** `.nn-home-marketing-root[data-nn-homepage-branding-revamp][data-nn-homepage-premium-polish]`

Section order, layout grids, copy, and navigation are **frozen**. This pass adjusts rhythm, typography weight, surfaces, CTAs, motion, and theme parity only.

---

## 1. Visual hierarchy refinement

| Area | Before | After | Rationale |
|------|--------|-------|-----------|
| Section intro stack | Mixed `mt-4` / `mt-3` utilities | Tokenized `--nn-home-header-stack`, `--nn-home-section-intro-gap` | Consistent eyebrow → headline → lead rhythm |
| Lead line length | Ad hoc `max-w-2xl` / `max-w-3xl` | Capped at `--nn-home-lead-max` (38rem) | Calmer reading measure; academic credibility |
| Card grouping | Static elevation | Subtle hover lift + shadow deepen (1px) | Premium depth without dashboard chrome |
| CTA row spacing | Tailwind gap utilities only | `--nn-home-cta-gap` on hero + final CTA rows | Confident but not aggressive action bands |

**Eye flow preserved:** Hero → product screenshots → ECG → pathways → clinical depth → study ecosystem → social → readiness → trust → hub strip → final CTA.

---

## 2. Typography polish

| Element | Weight / rhythm | Notes |
|---------|-----------------|-------|
| Section `h2` | 650 (was 700 on revamp layer) | Calmer, clinically credible; Blossom parity |
| Hero `h1` | Letter-spacing −0.028em | Tighter premium headline without size change |
| Eyebrows | 650, 0.075em tracking, brand-tinted muted | Label hierarchy reads as clinical metadata |
| Card titles | 650 | Less “marketing bold,” more instructional |
| Final CTA assurances | 500 / 0.875rem via `.nn-premium-cta-assurance` | Trust copy secondary to primary action |

**Line length:** Body/leads target ~65ch via `--nn-home-prose-max` / `--nn-home-lead-max`.

---

## 3. Spacing & layout rhythm

| Token | Value | Usage |
|-------|-------|-------|
| `--nn-home-header-stack` | clamp(0.625rem → 0.875rem) | Eyebrow → H2 |
| `--nn-home-section-intro-gap` | clamp(0.75rem → 1rem) | H2 → body |
| `--nn-home-cta-gap` | clamp(0.75rem → 1rem) | Primary/secondary button rows |
| Section padding | Unchanged (`--nn-rhythm-section-y` via `theme-overrides.css`) | No structural padding fork |

Mobile: safe-area aware `padding-inline` on `.nn-section-shell` at ≤640px.

---

## 4. Theme-aware refinement

| Theme | Adjustments |
|-------|-------------|
| **Ocean** | Slightly softened section ambient (`::before` opacity 0.92) — calmer bands |
| **Blossom / Mint Blossom** | H2 weight 650 (not heavy 700); eyebrow brand tint |
| **Midnight** | Card borders + shadows use info/chart-5 mix; final CTA panel uses elevated cool surface |

All colors derive from `--semantic-*` and `--palette-*` tokens — no product hex in the polish layer.

**Figma frames:** Duplicate desktop/mobile frames for Blossom/Ocean/Midnight remain a design-program follow-up per `docs/governance/figma-premium-ui-mandatory-process.md`. Code skins ship first for parity validation via Playwright (`marketing-screenshot-governance.spec.ts`).

---

## 5. Card & surface polish

- **Border:** `color-mix` with `--semantic-border-soft` + brand/info tint
- **Elevation:** Single-pixel top highlight + soft chart-tinted shadow (not heavy drop shadow)
- **Hover:** 160ms ease, 1px translateY (2px reduced on CTA tiles vs prior pathway-reading default)
- **Final CTA band:** Warmer border mix + deeper ambient shadow

---

## 6. CTA improvements

| Control | Treatment |
|---------|-----------|
| Primary (`nn-marketing-cta-primary`) | 160ms filter/transform; hover −1px; focus ring 3px brand mix |
| Secondary | Same interaction family; visually lighter via existing secondary styles |
| CTA tiles | 44px min touch target; semantic elevated surface |
| Assurance list | Muted 500 weight — de-emphasized vs buttons |

---

## 7. Motion & interaction

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Card hover | 160ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| CTA hover/focus | 160ms | ease / same bezier |
| Section enter | Unchanged (`nn-section-enter` in marketing-global) | No new animations added |

**Reduced motion:** Hover transforms disabled; border/shadow transitions only.

---

## 8. Homepage narrative flow

No copy changes. Visual hierarchy reinforces existing story:

1. **Hero** — clinical readiness + immediate study paths  
2. **ECG band** — telemetry/clinical intelligence cue (subtle grid overlay)  
3. **Pathways & depth** — platform breadth for serious learners  
4. **Adaptive loop** — integrated workflow (not feature list)  
5. **Trust + CTA** — credible assurances, calm conversion

---

## 9. Clinical identity

**Applied sparingly:**

- Faint 48px telemetry grid on `.nn-premium-home-section--ecg` only (masked radial fade)
- Existing ECG strip, readiness stats, and clinical panel in hero unchanged

**Not added:** clipart, stethoscope art, emergency red, hospital dashboard grids.

---

## 10. Accessibility & responsiveness

| Check | Status |
|-------|--------|
| Focus visible on CTAs | ✅ 3px semantic brand ring |
| Touch targets | ✅ 44px+ on primary CTAs and tiles |
| Reduced motion | ✅ Transforms suppressed |
| Mobile overflow | ✅ Existing E2E guard (`homepage-premium-quality.spec.ts`) |
| Contrast | ✅ Headings/body use `--palette-heading` / `--palette-text-muted` |
| Keyboard | ✅ No pointer-only affordances added |

**Recommended manual QA:** Ocean / Blossom / Midnight at 375px, 768px, 1280px — run `npm run test:e2e:marketing-screenshot-governance` when server available.

---

## Files changed (this pass)

| File | Change |
|------|--------|
| `src/app/styles/marketing/homepage-premium-polish-pass.css` | New refinement layer |
| `src/app/styles/marketing/index.css` | Import polish pass after branding revamp |
| `src/components/marketing/home-restored-client.tsx` | `data-nn-homepage-premium-polish` hook |
| `src/components/marketing/home/premium-homepage-cta.tsx` | Assurance list class |
| `tests/contracts/homepage-premium-polish-pass.contract.test.ts` | Regression guard |

**Explicitly not enabled:** `src/app/homepage-visual-refinement.css` (global hex + `!important` — conflicts with semantic guardrails).

---

## Verification

```bash
cd nursenest-core
node --import tsx --test tests/contracts/homepage-premium-polish-pass.contract.test.ts
node --import tsx --test src/lib/marketing/homepage-premium-home-order.contract.test.ts
```

Optional E2E (requires running app):

```bash
npx playwright test tests/e2e/public/homepage-premium-quality.spec.ts --project=chromium
npx playwright test tests/e2e/marketing/marketing-screenshot-governance.spec.ts --grep homepage
```
