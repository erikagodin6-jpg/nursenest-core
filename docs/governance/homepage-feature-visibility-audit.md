# Homepage Feature Visibility Audit — Phase 2

**Date:** 2026-05-29  
**Scope:** Narrative clarity and platform capability surfacing — not a redesign  
**Prior pass:** `homepage-premium-polish-pass.css` (visual refinement)  
**This pass:** `homepage-feature-visibility-pass.css`, `PremiumPlatformCapabilityStrip`, copy + clinical depth expansion

---

## Phase 1 — Feature visibility audit

| Capability | Before | After | Surface |
|------------|--------|-------|---------|
| ECG & telemetry | ECG section + hero panel | Capability strip + clinical depth card | Strong |
| NGN / NCJMM | Mentioned in ecosystem step (en only) | Hero subheading, capability strip, clinical depth card, RN pathway | Strong |
| Simulations / LOFT | Weak / implicit in scenarios card | Capability strip, clinical depth card, ecosystem copy | Moderate → strong |
| Live physiology / monitors | Hero panel stats only | Capability strip “Physiology monitoring” | Moderate |
| Adaptive remediation | Ecosystem flow step | Capability strip + ecosystem copy | Strong |
| Competency tracking | Readiness preview bars | Capability strip + readiness intelligence callout | Strong |
| Session reports | Not surfaced | Readiness intelligence callout | New |
| Harm Index | Not surfaced | Readiness intelligence + detect-weakness step | New |
| Replay / timeline | Not surfaced | Readiness intelligence callout | New |
| Deterioration recognition | ECG advanced teaser | Clinical depth simulations card + ECG section | Moderate → strong |
| Ventilator waveforms | Not on homepage | Deferred — mention only when product route exists | — |
| RT / NP / New Grad | Pathway cards | Unchanged (pathway band) | Adequate |
| Institutional readiness | Schools CTA + international band | Unchanged | Adequate |

**Low-value before:** Carousel lead copy (“study tools”) read generic NCLEX-prep.  
**Resolved:** Carousel + hero subheading now name NGN, simulations, telemetry, competency.

---

## Phase 2 — Narrative enhancement (copy only)

| Message | Implementation |
|---------|----------------|
| What NurseNest is | Capability strip heading: “More than flashcards and question banks.” |
| Who it is for | Hero subheading pathways unchanged; RN card mentions NGN + simulations |
| Why different | Clinical depth heading → “A full clinical reasoning ecosystem.” |
| Clinical sophistication | 8-item capability grid + 8 clinical depth cards |
| Premium tone | Calm editorial band — no banners, no hype adjectives |

**Tone guardrails:** No pass-rate claims, no “#1”, no startup superlatives. Conservative sample-data disclaimer preserved on readiness preview.

---

## Phase 3 — Feature surfacing components

### New: `PremiumPlatformCapabilityStrip`

- **Placement:** After product screenshot carousel, before ECG section  
- **Layout:** Centered intro + 4×2 responsive grid (8 chips)  
- **Style:** `.nn-home-platform-capability-band` — slim band, not full `nn-premium-home-section` height  
- **Hook:** `data-testid="section-platform-capability-strip"`

### Expanded: `PremiumClinicalDepth`

- Added **NGN Clinical Judgment** and **Simulations & Deterioration** cards (8 total)

### Expanded: `PremiumReadinessPreview`

- **Platform intelligence** callout: session reports, Harm Index, replay, longitudinal intelligence

---

## Phase 4 — Clinical differentiation

Emphasized vs generic NCLEX apps:

- NCJMM-aligned reasoning (capability chip + readiness body)
- Harm Index (readiness intelligence)
- Branching simulations (not static vignettes)
- Telemetry + ECG integrated loop
- Longitudinal learner intelligence

---

## Phase 5 — Visual polish for advanced features

- Capability chips: semantic tone borders, 160ms hover, icon wells  
- Readiness intelligence: cool panel with 2×2 metadata grid  
- ECG section unchanged structurally — still primary telemetry workstation  
- Midnight/Ocean/Blossom: token-based parity in `homepage-feature-visibility-pass.css`

---

## Phase 6 — Information hierarchy

**Progressive reveal order (unchanged section count +1 slim band):**

1. Hero — clinical readiness + panel  
2. Product screenshots  
3. **Capability strip — platform breadth (NEW)**  
4. ECG — deep telemetry narrative  
5. Pathways — role entry  
6. Clinical depth — ecosystem cards (+ NGN, simulations)  
7. Adaptive loop — workflow  
8. Social study  
9. Readiness — analytics + intelligence callout  
10. Trust  
11. Hub strip (children)  
12. Final CTA  

---

## Phase 7 — Theme consistency

All new surfaces use `--semantic-*`, `--palette-*`, `--capability-tone` via semantic chart/brand/info tokens. No hex in TSX or visibility CSS.

---

## Phase 8 — Accessibility & responsiveness

| Check | Status |
|-------|--------|
| Capability list `aria-label` | ✅ |
| Chip touch targets (mobile min-height) | ✅ 44px |
| Reduced motion | ✅ hover transform disabled |
| Heading hierarchy | ✅ H2 in strip, H3 in cards unchanged |
| Keyboard | ✅ no pointer-only interactions added |

---

## Phase 9 — Screenshot governance

When server available:

```bash
cd nursenest-core
npx playwright test tests/e2e/marketing/marketing-screenshot-governance.spec.ts --grep homepage
npx playwright test tests/e2e/public/homepage-premium-quality.spec.ts
```

Capture: desktop + mobile, Ocean / Blossom / Midnight, before/after capability strip visibility.

---

## Files changed

| File | Change |
|------|--------|
| `premium-platform-capability-strip.tsx` | New capability band |
| `homepage-feature-visibility-pass.css` | Strip + intelligence styling |
| `home-restored-client.tsx` | Wire strip + `data-nn-homepage-feature-visibility` |
| `premium-clinical-depth.tsx` | +2 cards, narrative copy |
| `premium-readiness-preview.tsx` | Intelligence callout |
| `premium-study-ecosystem.tsx` | Workflow copy |
| `premium-homepage-hero.tsx` | Subheading |
| `home-hero-screenshot-section.tsx` | Carousel lead |
| `premium-homepage-routes.ts` | RN pathway body |
| `public/i18n/en/pages.json` | EN copy (42 keys) |
| `tests/contracts/homepage-feature-visibility-pass.contract.test.ts` | Regression guard |

---

## Verification

```bash
cd nursenest-core
node --import tsx --test tests/contracts/homepage-feature-visibility-pass.contract.test.ts
node --import tsx --test tests/contracts/homepage-premium-polish-pass.contract.test.ts
node --import tsx --test src/lib/marketing/homepage-premium-home-order.contract.test.ts
node --import tsx --test src/lib/marketing/homepage-premium-en-pages.contract.test.ts
```
