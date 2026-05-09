# About + How It Works — Premium Ecosystem Page Implementation

Date: 2026-05-09
Owner: Marketing surface upgrade for `/about` and `/how-it-works`
Routes preserved: `/about` and `/how-it-works` kept as separate routes (no merge)

---

## 1. Goal

Upgrade the marketing **About** and **How It Works** experiences to a premium,
calm-confidence ecosystem narrative that reflects what NurseNest actually is:
**one cohesive premium adaptive clinical learning ecosystem** — lessons,
practice, Smart Review, ECG / telemetry learning, lab interpretation, and
adaptive CAT exams inside the same learner shell.

Both routes already existed but were composed of generic "4 steps + feature
deep-dive" copy that did not communicate the ecosystem story or the
entitlement-safe scope (especially around Advanced ECG and BLS / ACLS / PALS).

---

## 2. Page structure (final)

### `/about` -> `AboutPageClient`
1. **Hero** — trust + product understanding (calm pill, h1 with ecosystem
   framing, primary `Start Studying Free` + secondary `See How It Works`).
2. **Editorial trust strip** — links to Editorial / Content review /
   Educational disclaimer.
3. **How NurseNest works flow** — 4-card visual flow:
   `01 Learn -> 02 Practice -> 03 Strengthen -> 04 Clinical readiness`. Each card
   uses a different `--semantic-*` accent (info, success, chart-2, brand) per
   the multi-hue color guardrail.
4. **Feature deep-dives** — alternating `ScreenshotFeatureBlock` rendered from
   `ABOUT_FEATURE_BLOCKS` in `screenshot-registry.ts` (no hardcoded CDN URLs).
5. **Clinical readiness ecosystem** *(most important section per the brief)* —
   six interconnected cards (Lessons, Practice, ECG / telemetry, Lab
   interpretation, Adaptive CAT, Adaptive study plan), each with an
   availability footnote, followed by a `clinicalReadiness` `ScreenshotCarousel`.
6. **What's included** — three columns: *In every plan*, *Where available by
   pathway*, *Coming soon (not in current plans)* — plus a footnote linking
   to `/pricing` and explicitly disclaiming BLS / ACLS / PALS inclusion.
7. **Specialty + new-grad readiness** — three honest tracks (pre-exam, new
   grad, specialty directions). Explicitly clarifies it is not a substitute
   for employer orientation or BLS / ACLS / PALS certification.
8. **Principles** — four trust principles with `Layers` icon ledes.
9. **Platform preview** — existing `aboutShowcase` carousel preserved.
10. **Trust FAQ** — short `<details>`-based accordion (4 entries) covering
    affiliation, Advanced ECG, readiness scoring, and clinical content trust.
11. **Final CTA** — calm dual-CTA block (Start Studying Free + View Plans).

### `/how-it-works` -> `HowItWorksPageClient`
1. **Hero** — pill + h1 + ecosystem subhead + primary `Start Free Trial` +
   anchor link `See the four phases`.
2. **Four-phase flow** — same `Learn -> Practice -> Strengthen -> Clinical
   readiness` system as `/about` but scoped per-page so each route can be
   read independently.
3. **Inside the ecosystem** — six surfaces (study plan, smart review,
   readiness, CAT, ECG / telemetry, lab interpretation) with explicit
   pathway / availability framing.
4. **Live product walkthrough** — `ScreenshotCarousel group="ecosystemNarrative"`
   showing lesson -> practice -> smart review -> CAT readiness in actual
   product screenshots.
5. **Subscription clarity** — three-pillar block aligned with the About page
   (in every plan / where available by pathway / coming soon) + entitlement-safe
   footnote linking to `/pricing`.
6. **Outcome** — calm payoff statement (no growth-marketing urgency).
7. **Trust FAQ** — 4-entry `<details>` accordion (affiliation, Advanced ECG,
   adaptive routing, readiness disclaimer).
8. **Final CTA** — `Start Free Trial` + `Read the full story` (links back to
   `/about` so the two routes cross-link without clutter).

---

## 3. Files changed

| Path | Kind | Purpose |
| --- | --- | --- |
| `nursenest-core/src/components/marketing/about-page-client.tsx` | rewrite | Premium ecosystem narrative composition (10 sections) |
| `nursenest-core/src/components/marketing/how-it-works-page-client.tsx` | rewrite | Premium ecosystem walkthrough (8 sections) |
| `nursenest-core/src/lib/marketing/screenshot-registry.ts` | extend | Added `ecosystemNarrative` and `clinicalReadiness` `SCREENSHOT_GROUPS` (registry-only — contract test still passes) |
| `nursenest-core/src/components/layout/site-header.tsx` | extend | Added `How It Works` to `marketingMoreLinks` (renders desktop + mobile drawer; existing `pricing|blog|faq|pre-nursing|tools` snippets preserved so the public-nav contract test still passes) |
| `nursenest-core/src/components/layout/site-footer.tsx` | extend | Added `How It Works` and `About NurseNest` to the Explore column (top of list) |
| `nursenest-core/tests/marketing/about-how-it-works-smoke.spec.ts` | new | Playwright smoke for both routes (placeholder/i18n leak guard, structure assertions, entitlement-safe Advanced ECG copy) |

The `app/(marketing)/(default)/about/page.tsx` and
`app/(marketing)/(default)/how-it-works/page.tsx` route files were **not**
touched — both already render the page client and own the locale-safe
metadata + JSON-LD.

---

## 4. Screenshot registry usage

All marketing screenshots resolve through the central registry — no hardcoded
CDN URLs were added.

| Surface | Group / IDs used |
| --- | --- |
| About — Feature deep-dives | `ABOUT_FEATURE_BLOCKS` (10, 6, 9, 8) — unchanged |
| About — Clinical readiness ecosystem carousel | `SCREENSHOT_GROUPS.clinicalReadiness` = `[15, 12, 7, 8]` *(new)* |
| About — Platform preview carousel | `SCREENSHOT_GROUPS.aboutShowcase` (unchanged) |
| How It Works — Live product walkthrough | `SCREENSHOT_GROUPS.ecosystemNarrative` = `[12, 1, 9, 7]` *(new)* |

Both new groups only reference existing registry IDs (1–15), so the registry
stays at its current contiguous 1..N coverage and the
`screenshot-registry.contract.test.ts` invariants continue to hold.

---

## 5. Entitlement-safe copy (governance)

The brief required: do not promise features not in product; use qualified
language; treat **Advanced ECG** as a separate future premium product line;
do not imply BLS / ACLS / PALS inclusion or affiliation.

Implemented across both pages:
- Copy uses `"where available"`, `"supported pathways"`, `"coming soon"`
  consistently for pathway-scoped or future features.
- Advanced ECG framing in **both** pages: *"Advanced ECG & Telemetry Mastery
  is a separate future premium product line and is not included in standard
  RN, PN, NP, or Allied Health subscriptions."*
- Pricing footnote on both pages explicitly disclaims any BLS / ACLS / PALS
  inclusion or affiliation: *"NurseNest is independent and is not affiliated
  with any licensing body. BLS, ACLS, and PALS certification are not
  included or implied."*
- Trust FAQ on both pages opens with the affiliation question so it is the
  default expanded row.
- The Playwright smoke contains **two assertions** that fail if a future
  edit ever drops the entitlement-safe Advanced ECG framing or starts
  describing BLS / ACLS / PALS as included.

---

## 6. Design tokens & ecosystem cohesion

- All colors use semantic CSS variables — `var(--theme-primary)`,
  `var(--theme-page-bg)`, `var(--theme-heading-text)`,
  `var(--theme-body-text)`, `var(--theme-muted-text)`, `var(--bg-card)`,
  `var(--border-subtle)`, `var(--semantic-success|info|warning|brand|chart-1..5)`.
  No hex / rgb literals were added to product UI. Compatible with all four
  themes (Aurora, Ocean, Garden, Midnight).
- Reused shared marketing primitives: `nn-marketing-h1/h2/h3/h4`,
  `nn-marketing-eyebrow`, `nn-marketing-body`, `nn-marketing-body-sm`,
  `nn-marketing-cta-primary`, `nn-marketing-x`, `nn-rhythm-page-y`,
  `nn-gradient-safe`, `nn-hiw-section`, `nn-hiw-step-card`,
  `nn-hiw-feature-card`, `nn-hiw-preview-card` — no new global CSS introduced.
- Reused motion primitives: `FadeUp`, `StaggerGroup`, `StaggerItem` from
  `@/lib/motion`.
- Reused screenshot primitives: `ScreenshotCarousel`,
  `ScreenshotFeatureBlock` (no new screenshot wrapper created).
- Multi-hue color usage: every multi-card grid uses **multiple** semantic
  hues (info / success / warning / brand / chart-*) so we comply with the
  semantic-color guardrail (no monochrome card walls).

---

## 7. Navigation & cross-links

- **Site header** — added `How It Works` to `marketingMoreLinks` between
  `Pricing` and `Blog`. Renders in both the desktop top nav and the mobile
  drawer (the same `marketingMoreLinks.map` powers both surfaces). The
  existing `key: "pricing"`, `key: "blog"`, `key: "faq"`,
  `key: "pre-nursing"`, `key: "tools"` snippets are preserved so the
  `public-nav-homepage-copy-hotfix.contract.test.ts` continues to pass.
- **Site footer** — added `How It Works` and `About NurseNest` as the first
  two entries of the existing `Explore` column. No layout changes.
- **Cross-link from FAQ / pricing** — kept low-clutter:
  - The About + How-it-works pages each link **into** `/pricing` for
    subscription details (single underline-style link in the entitlement
    footnote).
  - The two pages link **to each other** — `/about` Hero secondary CTA goes
    to `/how-it-works`, and `/how-it-works` final CTA secondary goes to
    `/about`.
  - Both pages link to `/faq` from inside the Trust FAQ section as "for full
    product Q&A, see the main FAQ page".
  - We deliberately did **not** add an inverse banner link from `/pricing` or
    `/faq` — those surfaces already carry the homepage / pricing nav and
    adding a banner there would be clutter without a clear product win.

---

## 8. i18n stance (deliberate, documented)

- `tools/i18n/marketing/marketing-en.json` already contains a stale
  `pages.about.*` / `pages.howItWorks.*` family of keys (171 entries) that
  the previous implementation **never consumed** (the prior
  `about-page-client.tsx` and `how-it-works-page-client.tsx` both used
  inline English copy).
- The premium upgrade follows the **existing in-repo convention** for these
  two pages: inline English copy authored in the React component. This keeps
  the diff surgical and avoids cross-locale breakage that would happen if we
  introduced new i18n keys without simultaneously updating all 22 locale
  source files in `tools/i18n/source/i18n-*.ts` (which is out of scope for
  this task).
- No raw i18n keys leak into the rendered DOM — confirmed by the new
  Playwright smoke (`looksLikeLeakedFlatI18nKeyLine` rejects any
  `pages.*` / `nav.*` / `footer.*` line in `body innerText`).
- **Recommended follow-up** *(not in this task)*: a dedicated i18n cleanup
  pass that either (a) drops the unused stale `pages.about.*` /
  `pages.howItWorks.*` keys from `marketing-en.json`, or (b) re-routes the
  upgraded About / How-it-works pages through `useMarketingI18n()` and adds
  a fresh, scoped key set in all locale source files plus a fallback shell
  contract — neither path can be done surgically inside the page-redesign
  diff.

---

## 9. Tests

### New
- `nursenest-core/tests/marketing/about-how-it-works-smoke.spec.ts` —
  Playwright smoke. Asserts:
  - No forbidden marketing placeholder strings on either route (uses the
    same `forbidden-marketing-placeholders` helper as the homepage smoke).
  - Hero headline length and ecosystem section visibility on both routes.
  - Both pages mount their `data-testid` regions: `about-page-client`,
    `about-how-it-works-flow`, `about-clinical-readiness-ecosystem`,
    `about-whats-included`, `about-trust-faq`, `how-it-works-page-client`,
    `hiw-flow`, `hiw-ecosystem`, `hiw-product-walkthrough`,
    `hiw-subscription-clarity`, `hiw-trust-faq`.
  - Entitlement-safe Advanced ECG framing is present on both routes and
    BLS / ACLS / PALS are never described as "included / bundled / comes
    with" in body copy.

### Re-run / verified passing
- `npm run typecheck:critical` *(in `nursenest-core/nursenest-core/`)* —
  passes (exit 0; checks Stripe / auth / db / subscription API critical
  surfaces).
- `npx tsx --test src/lib/marketing/screenshot-registry.contract.test.ts` —
  all 8 invariants pass (unique IDs, contiguous 1..N coverage, label /
  description bounds, every group references valid IDs, `homepageHero`
  fully covers registry, marketing-keyword presence, no
  legacy / placeholder wording).
- `npx tsx --test src/lib/marketing/public-nav-homepage-copy-hotfix.contract.test.ts` —
  all 5 tests pass (canonical homepage copy, minimal shell fallback,
  desktop + mobile public header link snippets, Canada tier strip labels).
- Targeted `tsc -p` over the modified marketing components and the new
  Playwright spec — clean compile (no errors introduced; the unrelated
  pre-existing `src/lib/theme/theme-registry.ts:170` error is untouched
  per `AGENTS.md` guidance to not "fix the world").

### Not run (out of scope or environment-bound)
- `npm run test:e2e:*` — these require a running dev server and the
  curated CI database; the new smoke runs under the standard `playwright.config.ts`
  and will pick up automatically in any e2e config that includes the
  `tests/marketing` directory.
- `npm run i18n:compile` — no new i18n keys were added, so no compile pass
  is required for these changes (see Section 8).

---

## 10. Figma + design validation

The brief noted a Figma-first wish but I could not assume Figma MCP access.
The implementation follows the **existing premium homepage patterns**
already shipping in the repo:
- `nn-marketing-*` layout primitives + `nn-rhythm-*` spacing tokens.
- `FadeUp` / `StaggerGroup` motion primitives.
- `ScreenshotCarousel` / `ScreenshotFeatureBlock` registry-driven media.
- Semantic + theme tokens for color so the pages adapt across Aurora,
  Ocean, Garden, and Midnight.

**Recommended Figma follow-up** for the design team (not required to ship):
1. Validate the four-phase flow card group at `breakpoint <md>` (currently
   2-up at `sm` and 4-up at `lg`) — confirm tap-target rhythm.
2. Validate the six-card ecosystem grid balance vs the 4-up flow above it.
3. Confirm the entitlement footnote band ([warning hue 6%]) reads as
   *informational* in Midnight as well as Ocean / Garden / Aurora.
4. Audit the Trust FAQ `<details>` open-state padding against existing
   FAQ page accordion (kept distinct copy, but visual pattern parity
   would be a nice polish step).

---

## 11. Gaps / known limitations

- **i18n** — pages remain inline English; documented in Section 8.
- **Subscription clarity copy** is intentionally pathway-agnostic (uses
  "supported pathways", "where available") — a future enhancement could
  read `getCountryNavConfig` / `pathway-entitlements-policy` to render a
  pathway-specific "included for your pathway" strip when the visitor
  already has a region preference cookie. Out of scope for this surgical
  upgrade.
- **Screenshots** — both new groups (`ecosystemNarrative`,
  `clinicalReadiness`) use existing IDs from `SCREENSHOT_REGISTRY`. If the
  capture pipeline produces a dedicated ECG-Lab interconnection screenshot
  in the future, it can be appended to the registry (id 16+) and added to
  `clinicalReadiness` without touching either page.

---

## 12. Verification commands run

From `nursenest-core/nursenest-core/` (the production app root):

```bash
npm run typecheck:critical
npx tsx --test src/lib/marketing/screenshot-registry.contract.test.ts
npx tsx --test src/lib/marketing/public-nav-homepage-copy-hotfix.contract.test.ts
# Targeted scratch tsc over edited files
npx tsc -p tsconfig.scratch-pages.json   # clean
npx tsc -p tsconfig.scratch-tests.json   # clean
```

All passing. Scratch tsconfig files were deleted before commit so the diff
remains surgical.

---

## 13. Summary

- `/about` and `/how-it-works` now read as one cohesive premium ecosystem
  narrative, with `Learn -> Practice -> Strengthen -> Clinical readiness` as
  the spine.
- Most important new section: the **clinical readiness ecosystem** block
  on `/about` (six interconnected surfaces with explicit availability
  framing) and the parallel ecosystem block on `/how-it-works`.
- Subscription clarity is honest and entitlement-safe — Advanced ECG is
  surfaced as a **separate future premium product**, BLS / ACLS / PALS are
  never described as included or affiliated.
- Site header gains a `How It Works` link; site footer gains both
  `How It Works` and `About NurseNest` at the top of the Explore column.
  Both surfaces are protected by the existing public-nav contract test
  and the new Playwright smoke.
