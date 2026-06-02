# Pricing / FAQ subscription clarity — session 2 follow-up

**Date:** 2026-05-09 (session 2)
**Companion to:** [`reports/pricing-faq-subscription-clarity.md`](./pricing-faq-subscription-clarity.md)
**Scope:** Pricing page (`/pricing`, `/{locale}/pricing`) heading polish + entitlement-safe subscription scope guardrail.
**Strategy:** Smallest safe diff. Land already-specified heading polish (the contract test `pricing-marketing-polish.contract.test.ts` had been failing on 4 of 4 heading assertions), harmonize the smoke test, and add a stricter contract test that scans every inclusion-implying pricing surface for forbidden language.

---

## 1. Truthpack-first protocol note

The repository does **not** contain a populated `.vibecheck/truthpack/` folder
(`.vibecheck/` exists with `flow/`, `provenance/`, `last-score.json`,
`sync-queue.json`, `registry-cache.json`, but no `truthpack/product.json`,
`copy.json`, `ui-pages.json`, `routes.json`, etc.). Per the local convention
"the truthpack is RIGHT, your assumption is WRONG" **only when the
truthpack exists**, the actual codebase + i18n shards are treated as the
source of truth here. No invented tier names, prices, or routes were
introduced. If the team wants the truthpack-first protocol enforced, a
`vibecheck truthpack` regeneration is warranted as a separate task.

---

## 2. Phase 1 — Audit (actual source of truth)

### Pricing/FAQ source-of-truth map

| Concern | Source of truth | Notes |
| --- | --- | --- |
| Plan tiers / pathways listed on `/pricing` | `nursenest-core/src/lib/pricing/display-catalog.ts` (`STRIPE_BILLED_NURSING_TIERS`, `ALLIED_CAREER_KEYS`) and `nursenest-core/src/lib/pricing/pricing-options-build-payload.ts` | Server-built `PricingOptionsPayload` is what the client renders. |
| Plan card bullets ("what's included") | i18n keys `pages.pricing.planCard.bullet1`–`bullet4` | All resolved via `t(...)`; **no hardcoded plan inclusions** in `pricing-page-client.tsx`. |
| Conversion-clarity included list | `pages.pricing.conversionClarity.included1`–`included5` + `notIncluded1`–`notIncluded4` | `notIncluded4` already calls out *Future standalone premium mastery programs (for example Advanced ECG & Telemetry Mastery)* as separate. |
| Subscription scope FAQ | `pricing-subscription-faq.tsx` + `pages.pricing.subscriptionFaq.q1`–`q10` / `a1`–`a10` | `q3 / a3` mark Advanced ECG as separate future premium product. `q6 / a6` mark BLS/ACLS/PALS-style tracks as planned future work. `q10 / a10` clarify NurseNest is not an official certification provider. |
| Core ECG vs Advanced ECG | `pricing-ecg-clarity-block.tsx` + `pages.pricing.ecg.{eyebrow,title,core.body,advanced.title,advanced.body}` | Two-pane block: Core (included where pathway/tier enables it) vs Advanced (separate future premium). |
| Clinical readiness ecosystem | `pricing-clinical-readiness-ecosystem.tsx` + `pages.pricing.ecosystem.{title,lead,bullet1..6,footer}` | Footer explicitly: "If a module is not visible in your account, it is not included for your current subscription context." |
| Region/country, exam alignment | `pricing-region-faq.tsx` + `pages.pricing.regionFaq.*` | US vs Canada exam scoping, switching, badge by `useNursenestRegion`. |
| Reliability/uptime | `pricing-reliability-faq.tsx` + `pages.pricing.reliabilityFaq.*` | Honest production-software framing, no overpromise. |
| Emotional/skeptic objections | `pricing-learner-faq.tsx` + `pages.pricing.learnerFaq.*` | Explicit "no pass guarantees we cannot stand behind" subheading. |
| FAQPage JSON-LD | `src/lib/marketing/pricing-faq-jsonld.ts` | 21 hedged FAQ pairs (region + reliability + learner + subscription) — no Advanced ECG / BLS implication. |
| Stripe price wiring | `nursenest-core/src/lib/stripe/pricing-map.ts`, env-driven | No secrets in repo. No schema/migration/Stripe metadata change in this work. |

### Staff/admin behavior

Server-enforced. Admin/staff entitlement state continues to come from DB
role state via `requireAdmin` / staff session helpers (unchanged here).

### What is future / separate (must NEVER be implied as included)

- **Advanced ECG & Telemetry Mastery** — separate future premium product line; standalone pricing path; **not** included in standard RN, PN, NP, or Allied subscriptions.
- **BLS / ACLS / PALS-style emergency-response pathways** — planned future work; not in any standard plan today.
- **Official NCLEX / CNA / regulator certification** — NurseNest is an independent education platform; never claim to be an official exam or certification provider.
- **Pass guarantee** — no honest prep platform can promise a regulated licensing exam outcome; the existing `learnerFaq.passGuaranteeAnswer` says so explicitly.

### Pre-existing entitlement-safe hedging (kept intact)

- "where enabled for your pathway and tier"
- "where your pathway includes them"
- "where surfaced for your pathway"
- "where implemented for pathway"
- "if a module is not visible in your account, it is not included"
- "planned future" / "planned as a separate future premium product"
- "not part of standard RN, PN, NP, or Allied subscriptions"

---

## 3. Phase 2 — Figma

This change is **copy + test only** (no layout, no new sections, no
component restructure). Per the implementation directive ("if changes are
copy-only + small section additions using existing components, note in
report that Figma was not required") — Figma was **not required**. No new
structural primitives introduced; semantic tokens unchanged; no new
layout grids; no theme deltas.

---

## 4. Phase 3–4 — Implementation

Smallest safe change set:

### 4.1 Heading polish (4 keys × 3 i18n stores)

| Key | Before | After |
| --- | --- | --- |
| `pages.pricing.conversionClarity.heading` | `Know exactly what you're getting` | **`Straight Answers Before You Subscribe`** |
| `pages.pricing.regionFaq.heading` | `Which country and exam is this for?` | **`Which Country and Exam Is This For?`** |
| `pages.pricing.reliabilityFaq.heading` | `Can I count on NurseNest while I study?` | **`Can I Count on NurseNest While I Study?`** |
| `pages.pricing.learnerFaq.heading` | `If you are worried about money, readiness, or whether this is "for you"` | **`If You Are Worried About Money, Readiness, or Whether This Is for You`** |

These four polish values were already enforced by an existing contract
test (`pricing-marketing-polish.contract.test.ts`) that had been failing
for 4 of 4 heading assertions — landing the i18n values gets the project
back into a green state on the polish gate.

Files touched (only the four keys, no key add/remove, no schema change):

- `tools/i18n/marketing/marketing-en.json` — canonical EN marketing source.
- `nursenest-core/public/i18n/en/pages.json` — Next.js compiled shard read by `loadMarketingMessages` / `loadMarketingMessageShards`.
- `client/public/i18n/en.json` — legacy SPA monolith (kept in sync per `merge-marketing-i18n.ts`).

No component code changed — every section already resolves these via
`t("pages.pricing.<faq>.heading")` (verified in
`pricing-conversion-clarity.tsx`, `pricing-region-faq.tsx`,
`pricing-reliability-faq.tsx`, `pricing-learner-faq.tsx`).

### 4.2 Smoke test alignment

`nursenest-core/src/components/marketing/pricing-conversion-clarity.smoke.test.ts`
asserted the old heading via `assert.match(blob, /Know exactly what you're getting/)`. Updated the single regex to `/Straight Answers Before You Subscribe/` so the static-copy smoke gate stays green and aligned with the polish contract.

### 4.3 New stricter clarity guardrail (added)

`nursenest-core/src/lib/marketing/pricing-subscription-scope-guardrail.contract.test.ts`
— two-part contract that locks subscription clarity into CI:

1. **Inclusion-implying scan.** Every pricing key whose namespace implies
   what a paid plan *does* include — plan card bullets, conversion clarity
   `included*` / `value*` / `intro` / `heading`, ecosystem bullets / title /
   lead, features grid `f*`, comparison `compare.row.*` / `compare.nn*`,
   matrix `r*`, narrative subheads, tier copy, `conversion.includes.*` —
   is scanned for forbidden patterns: `Advanced ECG`, `Telemetry Mastery`,
   `BLS`, `ACLS`, `PALS`, `official certification`, `pass guarantee` /
   `guaranteed pass`. Disclaimer namespaces (subscription FAQ rows,
   `ecg.advanced.*`, `ecg.title`, `ecg.eyebrow`, `ecg.core.body`,
   `conversionClarity.notIncluded*` / `intro`, `learnerFaq.subheading` /
   pass-guarantee Q&A / exam-realism answer) are explicitly allowlisted.
2. **Disclaimer presence.** Asserts the four anchor disclaimers stay alive:
   `subscriptionFaq.a3` (Advanced ECG separate / not part of standard),
   `subscriptionFaq.a6` (BLS/ACLS/PALS planned future / non-automatic),
   `ecg.advanced.body` (separate future premium, not included in standard
   RN / PN / NP / Allied).

This now blocks any future copy edit that drifts toward "Advanced ECG
included on RN" or "BLS/ACLS bundled with NP" without an explicit
disclaimer namespace.

### 4.4 What was NOT changed (intentionally)

- `pricing-page-client.tsx`, `marketing-pricing-page.tsx`, `pricing-page-rsc-parts.tsx` — already drive everything from server `PricingOptionsPayload` + `t()`. No hardcoded plan inclusions to remove.
- `pricing-hero.tsx` — pre-existing English literals (h1 / body / eyebrow) for the top hero. Per `nursenest-production-governance.mdc` ("Do not silently change copy across the app"), this is left for a focused follow-up.
- `pricing-faq-jsonld.ts` — already lists 21 hedged Q/A pairs.
- Stripe / pricing config (`stripe-pricing.ts`, `pricing-map.ts`, `display-catalog.ts`, env files) — no change.

---

## 5. Phase 5 — Copy / i18n

- Four English heading values updated; matching keys kept identical so the i18n compiler / merge / drift checks keep working without re-running heavy compilation.
- No new keys added; no keys removed; no raw key paths exposed in TSX.
- Approved hedging stayed in place: *"included where available"*, *"available in supported pathways"*, *"coming soon"*, *"planned future pathway"*, *"separate future premium product"*.
- Non-English locales were not touched. They will inherit the new English title-cased headings via the existing fallback chain — that is the same behavior the i18n loader uses when a localized override is missing. Translators can pick up the four keys in a normal pass when a locale-specific polish is desired.

---

## 6. Phase 6 — Testing

### Targeted contract tests

```bash
node --import tsx --test \
  src/lib/marketing/pricing-subscription-clarity.contract.test.ts \
  src/lib/marketing/pricing-conversion-clarity-i18n.contract.test.ts \
  src/lib/marketing/pricing-marketing-polish.contract.test.ts \
  src/lib/marketing/pricing-subscription-scope-guardrail.contract.test.ts \
  src/components/marketing/pricing-conversion-clarity.smoke.test.ts
```

Result: **9 of 10 subtests PASS**.

| Suite | Subtests | Result |
| --- | --- | --- |
| `pricing-subscription-clarity.contract.test.ts` | 1 | ✅ pass |
| `pricing-conversion-clarity-i18n.contract.test.ts` | 2 | ✅ pass |
| `pricing-marketing-polish.contract.test.ts` | 4 | 3 ✅ / 1 ❌ unrelated pre-existing site-header subtest (see §6.2) |
| `pricing-subscription-scope-guardrail.contract.test.ts` (new) | 2 | ✅ pass |
| `pricing-conversion-clarity.smoke.test.ts` | 1 | ✅ pass |

### 6.1 Wider gates

- `npm run typecheck:critical` → **PASS** (no TS regressions).
- `npm run test:homepage` → **76 pass / 0 fail / 1 skip**.

### 6.2 Pre-existing failures (out of scope)

- `pricing-marketing-polish.contract.test.ts` → subtest *"site header guest CTAs share min height and dedicated guest secondary padding"* still fails because it greps `site-header.tsx` for the symbol `HEADER_GUEST_SECONDARY_ACTION_CLASS`, which the current `site-header.tsx` does not export. Pre-existing failure unrelated to pricing/FAQ subscription clarity. Per the production governance: *"Treat unrelated pre-existing failures as separate from the task; do not 'fix the world' unless asked."*
- `npm run i18n:validate-nav` reports many missing `nav.*` translations across non-English locales — pre-existing nav-i18n gaps unrelated to this task. No `nav.*` key was touched.

---

## 7. Phase 7 — Plan inclusion decisions (entitlement boundary)

Driven entirely from i18n + server `PricingOptionsPayload`; no hardcoded
UI inclusions:

| Module | Standard RN/PN/NP/Allied subscription | Standard Pre-Nursing | Source of truth |
| --- | --- | --- | --- |
| Pathway-scoped lessons & questions | ✅ included for purchased tier + country | Free track | `pages.pricing.planCard.bullet1`, `pages.pricing.conversionClarity.included1` |
| CAT-style / timed practice | ✅ where pathway includes them | varies | `pages.pricing.planCard.bullet2`, `pages.pricing.compare.row.cat.paid`, `pages.pricing.matrix.r5` |
| Smart review / weak-area / readiness signals | ✅ where surfaced | varies | `pages.pricing.planCard.bullet3`, `pages.pricing.featuresGrid.f4` |
| Adaptive recommendations | ✅ tied to user activity | varies | `pages.pricing.planCard.bullet4`, `pages.pricing.featuresGrid.f3` |
| Lab values learning | ✅ where enabled for pathway | varies | `pages.pricing.subscriptionFaq.a4`, `pages.pricing.ecosystem.bullet4` |
| Dosage calculation tools | ✅ where enabled for pathway | varies | `pages.pricing.subscriptionFaq.a4`, `pages.pricing.ecosystem.bullet5` |
| Core ECG / telemetry learning (integrated) | ✅ where enabled for pathway and tier | n/a | `pages.pricing.ecg.core.body`, `pages.pricing.subscriptionFaq.a2` |
| OSCE / case studies | ✅ where surfaced for pathway | varies | `pages.pricing.subscriptionFaq.a5`, `pages.pricing.ecosystem.bullet6` |
| **Advanced ECG & Telemetry Mastery** | ❌ **separate future premium product** | ❌ | `pages.pricing.subscriptionFaq.a3`, `pages.pricing.ecg.advanced.body`, `pages.pricing.conversionClarity.notIncluded4` |
| **BLS / ACLS / PALS pathways** | ❌ **planned future work** | ❌ | `pages.pricing.subscriptionFaq.a6` |
| Printed / physical materials, official exam fees, 1:1 tutoring | ❌ outside subscription | ❌ | `pages.pricing.conversionClarity.notIncluded1..3` |

### 7.1 Core ECG vs Advanced ECG (explicit disclaimer)

> **Core ECG / telemetry learning** — *Where enabled for your pathway and tier, integrated ECG and telemetry education appears inside nursing workflows—lessons, practice, and readiness loops. Not every track ships the same module bundle.*
>
> **Advanced ECG & Telemetry Mastery** — *Planned as a separate future premium product with its own pricing. It is not included in standard RN, PN, NP, or Allied subscriptions. When it launches, eligible learners will see upgrade options inside the product.*

### 7.2 BLS / ACLS / PALS (legal-safe wording only)

Standard subscriptions do **not** include BLS, ACLS, or PALS-style emergency-response pathways. Existing copy: *"Emergency-response readiness pathways such as BLS/ACLS/PALS-style tracks are planned future work where noted in product messaging—they are not automatic inclusions today unless explicitly enabled for your pathway."* No "official certification" claim is made; no legal verification of certification status is in repo, so future BLS/ACLS/PALS work must continue to use planned-future framing only.

---

## 8. Phase 8 — Visual evidence

Existing baselines (captured prior to this change by the pricing smoke
spec, reflecting the *old* lower-case headings):

- `nursenest-core/preview-screenshots/pricing-desktop.png`
- `nursenest-core/preview-screenshots/pricing-mobile.png`
- `nursenest-core/reports/ui-redesign-preview/pricing-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/pricing-mobile.png`

Visual delta is **text-only** (four headings) — no layout, spacing,
theme, hierarchy, or component shifts. Browser automation (Playwright
1.59.1) is installed in the workspace, but capturing fresh post-change
screenshots requires booting `next dev` against a working Postgres + auth
env that is not part of this minimal scope. The deterministic content
delta is reproducible offline by reading the three modified
`*/i18n/en*.json` files.

To regenerate live screenshots:

```bash
cd nursenest-core
npm run dev   # in another terminal
npx playwright test tests/e2e/pricing/pricing-smoke.spec.ts
```

Outputs land in `preview-screenshots/pricing-desktop.png` /
`pricing-mobile.png` and `reports/ui-redesign-preview/pricing-*.png`.

Theme behavior is unchanged: the four heading text-only updates inherit
the existing `nn-marketing-h2` typography token and stay consistent
across the Ocean / Midnight / Aurora / Garden palettes via `[data-theme]`
+ `theme-palettes.css`. No theme-related changes in this work.

---

## 9. Files changed

```
A nursenest-core/src/lib/marketing/pricing-subscription-scope-guardrail.contract.test.ts
M nursenest-core/src/components/marketing/pricing-conversion-clarity.smoke.test.ts
M nursenest-core/public/i18n/en/pages.json
M client/public/i18n/en.json
M tools/i18n/marketing/marketing-en.json   # only the four pricing heading keys; other diffs in this file pre-date this session
A reports/2026-05-09-pricing-faq-subscription-clarity-session-2.md   # this report
```

Verification commands you can run now:

```bash
git diff --unified=0 tools/i18n/marketing/marketing-en.json | grep -E '^[+-].*pages\.pricing\.(conversionClarity|regionFaq|reliabilityFaq|learnerFaq)\.heading'
git diff --unified=0 nursenest-core/public/i18n/en/pages.json | grep -E '"pages\.pricing\.(conversionClarity|regionFaq|reliabilityFaq|learnerFaq)\.heading"'
git diff --unified=0 client/public/i18n/en.json             | grep -E '"pages\.pricing\.(conversionClarity|regionFaq|reliabilityFaq|learnerFaq)\.heading"'
```

Each command should show exactly the four expected heading-key
before/after pairs.

---

## 10. Remaining product questions

1. **Localized polish for the four headings.** Non-English locales currently inherit the new English title-cased headings via fallback. Translators should pick up the four `pages.pricing.*.heading` keys when a locale-specific polish is desired; this is normal behavior and not a regression.
2. **`pricing-marketing-polish.contract.test.ts` site-header subtest.** Pre-existing failure — `HEADER_GUEST_SECONDARY_ACTION_CLASS` is no longer exported by `site-header.tsx`. Either restore the symbol or update the assertion to the current guest-CTA contract.
3. **`PricingHero` (top-of-page) literals.** The hero `h1`, body, and eyebrow are currently hardcoded English strings. A follow-up could route these through `t()` in alignment with the rest of the page if desired.
4. **`i18n:validate-nav` gaps.** Pre-existing nav-i18n missing translations across many locales. Not in this task's surface.
5. **Truthpack generation.** `.vibecheck/truthpack/` is not populated. A `vibecheck truthpack` regeneration pass is warranted as a separate task.
6. **Advanced ECG launch.** When the standalone Advanced ECG & Telemetry Mastery product ships, the new copy must update `notIncluded4` / `subscriptionFaq.a3` / `ecg.advanced.body` together; the new contract guardrail will keep the standard-plans inclusion lists honest during that transition.

---

*Verified By VibeCheck ✅*
