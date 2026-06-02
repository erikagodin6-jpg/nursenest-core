# Marketing homepage footer — premium redesign (Figma-first brief)

**Scope:** Footer only (`SiteFooter` in [`src/components/layout/site-footer.tsx`](../../nursenest-core/src/components/layout/site-footer.tsx)).  
**Out of scope:** Homepage body, hero, navigation chrome, layout shell, `SiteHeader`. Do not change marketing route structure beyond footer-internal composition.

**Governance (mandatory order):**

1. Premium footer mockups in Figma (Ocean structure canonical).
2. Export screenshots → review in chat / PR → **approval**.
3. Implement in codebase (tokens + components; preserve SEO/i18n/auth patterns).
4. Capture **live** screenshots (Ocean/Blossom/Midnight desktop + Ocean mobile).
5. Theme parity pass (same DOM structure; token variance only).

---

## Design goals

The footer should read as the **final premium chapter** of the homepage: clinically credible, warm-modern, ecosystem-forward—not a dense utility sitemap.

| Fix | Intent |
|-----|--------|
| Too utility-heavy | Lead with narrative + CTA; group links as **scannable columns/cards**, not one flat grid |
| Weak hierarchy | Clear **Section 1 → 2 → 3 → 4** vertical rhythm; primary CTA band visually strongest |
| Weak ending | Layered surfaces, spacing rhythm, subtle elevation tied to [`premium-redesign-2026.css`](../../nursenest-core/src/app/premium-redesign-2026.css) footer tokens |
| Ecosystem underplayed | Exams + Study tools columns mirror RN/RPN/NP premium hubs and module strategy |
| Mobile rhythm | Section 1 full-width CTA; accordion or stacked cards for nav groups (links stay in DOM for SEO—match current `<details>` pattern on mobile if possible) |

**Themes:** One **Ocean** layout grid. **Blossom** / **Midnight** = variable swaps (`--footer-*`, semantic surfaces)—**no** column reorder or breakpoint changes per theme.

---

## Figma frame checklist (export before implementation)

| Frame ID (suggested) | Viewport | Theme | Notes |
|---------------------|----------|-------|--------|
| `Marketing / Footer / Desktop / Ocean` | 1440 | Ocean | Full four sections |
| `Marketing / Footer / Desktop / Blossom` | 1440 | Blossom | Same auto-layout; swap color styles |
| `Marketing / Footer / Desktop / Midnight` | 1440 | Midnight | Contrast check for CTA + links |
| `Marketing / Footer / Mobile / Ocean` | 390 | Ocean | Stacked sections; thumb-friendly CTAs |

Designer: attach **component notes** (spacing tokens intent, heading levels for a11y parity).

---

## Section 1 — Premium CTA band (new block **above** current main footer panel)

**Placement:** First child inside `<footer>`, **before** the existing `nn-footer-panel--main` cluster (implementation detail—design as visually continuous with homepage lower edge).

**Content:**

- **Headline:** Strong, confidence-oriented (examples—final copy via i18n):  
  “Built for nurses who want to pass.” / “Structured prep. Real readiness.” / “Know what to study next.”
- **Subcopy:** Trust + reassurance (exam-safe tone; no guarantees mis-framed as promises).
- **Primary / secondary actions:** Align with existing CTAs—`PRIMARY_CTA`, signup to question bank, trial/start flows (`signupWithCallback(HUB.questionBank)` pattern). Pathway-aware **microcopy** only (session-aware variants implemented later; design desktop + anonymous default).
- **Trust strip:** Small text—response expectations, region depth, or “Canada-first depth · global nursing prep” (echo Section 3).

**Visual:** Premium spacing (`--nn-rhythm-footer-y`, section shell padding), layered card or soft gradient **using** `--semantic-*` / `--footer-*` mixes—**no** arbitrary hex in specs.

---

## Section 2 — Ecosystem navigation

Re-group links into **four visual groups** (columns or raised “cards” with shared radius). Link targets must remain **canonical** (see implementation mapping below)—design labels may say “Practice exams” vs “Practice Exams” but routes stay stable.

### Column A — Exams

| Label | Code source / route |
|-------|---------------------|
| RN | `publicExamPrepHubDestinations(region).rn` |
| RPN / PN (locale label) | `examHubs.pn` + `getNursingRoleLabel` |
| NP | `examHubs.np` |
| Allied | `examHubs.allied` |
| Pre-Nursing | **Add in implementation:** public hub root e.g. `/pre-nursing` (verify with `marketingExamHubPath` / pre-nursing marketing routes—must match header IA) |

*Note:* Today footer lists “New Grad” under pathways; user brief lists Pre-Nursing under Exams. **Design both rows**; engineering preserves **all** important hubs—either sub-line under Exams or a fifth link row—without dropping New Grad if still required for SEO.

### Column B — Study tools

| Label | Route pattern |
|-------|----------------|
| Lessons | `explore.lessons` |
| Flashcards | `explore.flashcards` |
| Practice exams | `explore.practiceExams` |
| CAT | `footerStudyTools.cat` |
| ECG | `footerStudyTools.ecg` (guest → login callback) |
| Labs | `footerStudyTools.labs` (guest → login callback) |
| Clinical Skills | `STUDY_TOOL_ROUTES.clinicalSkills` (`/app/clinical-skills`, guest wrap) |
| OSCE Scenarios | `footerStudyTools.osce` (guest wrap) |

*Existing footer also includes Medication math + Pharmacology—fold into Study tools or “More tools” row so links are not dropped.*

### Column C — Resources

| Label | Route |
|-------|-------|
| Blog | `explore.blog` |
| Pricing | `explore.pricing` |
| FAQ | `/faq` |
| Institutions | `/for-institutions` |

### Column D — Company

| Label | Route |
|-------|-------|
| About | `/about` |
| Support / Contact | `/contact` + support email pattern |
| Policies | Split or cluster: `/privacy`, `/terms` (keep crawlable `<a>`) |

**Regional hubs:** Preserve `countryNav.footerFeatured` as a **compact** row or tertiary list—do not remove internal links.

---

## Section 3 — Premium brand block

**Retain:** Leaf mark + NurseNest wordmark (`SiteBrandLogoMark`, `brand.nurseNest`).

**Copy lanes (i18n keys exist or extend):**

- `footer.brandTagline`, `footer.supportingNursesGlobally`
- Add line matching brief: **“Canada-first depth, global nursing prep”** → new key under `footer.*` (implementation phase).

**Social:** Only if product has official URLs—otherwise omit or “future” placeholder in Figma **disabled**. Do not invent handles.

**Theme / language:** Footer already exposes language chips + theme picker in bottom meta—design should **visually relate** brand block to meta strip (continuity), not duplicate controls.

---

## Section 4 — Bottom legal / meta strip

**Keep legally dominant content crawlable:**

- © year + `footer.rights`
- Region label (US / Canada)
- `footer.legalDisclaimer`
- Policy links as visible text links

**Language + theme:** Keep `MarketingLanguagePreferenceList` + `ThemePicker` accessible; avoid shrinking touch targets on mobile (min height ≥ 44px where interactive).

---

## HTML / SEO / accessibility constraints (implementation phase)

- Outer wrapper stays `<footer>` with existing `data-nn-footer-*` hooks where tests rely on them.
- **All** marketing destinations remain crawlable anchor tags (no `button`-only navigation for primary SEO routes).
- Preserve `resolveMarketingHref` / `withMarketingLocale` behavior.
- Do not remove `EmailSignupBanner` without product sign-off—either integrate into Section 1 rhythm or keep as distinct band with premium styling.
- Country/language: no regression to `MarketingCountryChromeProvider` / region toggles.

---

## CSS / token anchors

Footer styling is scoped to `[data-nn-footer-layout="marketing"]` in [`premium-redesign-2026.css`](../../nursenest-core/src/app/premium-redesign-2026.css). Extend with **semantic** surfaces (`--semantic-panel-*`, `--semantic-brand`, borders via `color-mix` with `--semantic-border-soft`)—aligned with [semantic-color-guardrails](../../.cursor/rules/semantic-color-guardrails.mdc).

---

## Verification after implementation

```bash
npm run typecheck:critical
npm run test:homepage   # footer/header contracts
# Targeted Playwright if footer selectors change: marketing chrome / screenshot registry tests
```

Screenshots required: Ocean desktop, Blossom desktop, Midnight desktop, Ocean mobile (actual browser captures).

---

## Designer deliverable before engineering

1. Figma link + frame IDs listed above.  
2. Exported PNGs posted for approval.  
3. Short note confirming **no layout drift** between Ocean/Blossom/Midnight frames.

**Engineering starts only after step 2–3 sign-off.**
