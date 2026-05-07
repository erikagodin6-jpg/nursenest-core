# Signup / onboarding layout fix — QA report

**Timestamp:** `20260507T170054Z`  
**Branch:** working tree (not committed)  
**Dev server:** `http://127.0.0.1:3000` (existing `next dev`)

## 1. Files changed (rationale)

| File | Rationale |
|------|-----------|
| `nursenest-core/src/components/marketing/marketing-signup-page.tsx` | Raised auth card max width from `max-w-md` (~28rem) to `max-w-2xl` (~42rem), added `min-w-0`, increased card padding for calmer spacing. |
| `nursenest-core/src/components/auth/signup-form.tsx` | Root cause of clipped native `<select>` labels: two-column `sm:grid` inside a narrow card. Onboarding block is now **single-column** with `gap-4`, all selects `w-full min-w-0`, taller tap targets (`py-2.5`), name/country/tier grids stack until **`md`** (`md:grid-cols-2`) so tablet keeps full-width rows longer. |
| `nursenest-core/src/components/onboarding/trial-onboarding-flow.tsx` | Post-login wizard: `min-w-0` / `flex-1` / `text-wrap break-words` on option rows so labels and descriptions wrap instead of crowding; Step CTA primary button no longer capped at `max-w-xs` on narrow screens (`w-full` / `max-w-md` centered on `sm+`). |

**Not changed:** Marketing JSON / option strings (per requirement). No schema, env, routes, or submit payload changes.

## 2. Routes tested

| Route | URL used |
|-------|----------|
| Default marketing signup | `http://127.0.0.1:3000/signup` |
| Locale signup (pattern) | `http://127.0.0.1:3000/{locale}/signup` (e.g. `/en/signup`) — same `MarketingSignupPage` component |

**Not exercised in browser this run:** `/app/onboarding` (requires authenticated session). Trial flow layout was adjusted defensively for the same flex/min-width wrapping class of issues.

## 3. Screenshots (saved paths)

Directory: `qa-reports/onboarding-fix-20260507T170054Z/screenshots/`

### Desktop (~1440×900)

- `desktop-1440x900-signup-default-fullpage.png` — full page, default CA / RN exam focus.
- `desktop-1440x900-exam-rex-pn-selected.png` — viewport after selecting **REx-PN / practical nursing (Canada)** (long PN string).
- `desktop-1440x900-path-working-clinician.png` — viewport after **Working clinician** learner path (with exam focus still REx-PN).

### Tablet (~768×1024)

- `tablet-768x1024-signup-default-fullpage.png`
- `tablet-768x1024-exam-rex-pn-selected.png`
- `tablet-768x1024-path-working-clinician.png`

### Mobile (~375×812)

- `mobile-375x812-signup-default-fullpage.png` — includes full form + onboarding selects in scrollable document.
- `mobile-375x812-exam-rex-pn-selected.png` — viewport capture (top of page; form may be below fold — rely on full-page + `scrollWidth` check).
- `mobile-375x812-path-working-clinician.png` — same note as above.

**Capture method:** Playwright headless Chromium from `nursenest-core` package context (same machine as `next dev`). **cursor-ide-browser** was used for an initial live navigation to `/signup`; MCP screenshot files landed outside this workspace, so Playwright artifacts are the canonical attachments here.

**Before baseline:** Not reverted to pre-change code; “before” is described in the problem statement (ellipsis in native selects inside `max-w-md` + `sm:grid-cols-2`).

## 4. Before / after (observations)

- **Before:** Four onboarding `<select>`s in two columns inside `max-w-md` forced each control to roughly half the card width, so long i18n strings (e.g. `RN entry-to-practice (Canada)`, `Working clinician`) were ellipsized in the closed native control on common desktop widths.
- **After:** Card is wider (`max-w-2xl`); onboarding selects are **stacked full-width**; name and country/tier rows only go two-column from **`md`**, improving tablet width per field. Native selects still use OS rendering for the **open** list; closed-state readability is what this change targets.

## 5. Truncation cases verified

| String (EN marketing) | Verification |
|----------------------|--------------|
| `Working clinician` (`pages.signup.pathExperienced`) | `selectOption('experienced')` + screenshot per viewport; layout no longer splits onboarding row at `sm`. |
| `RN entry-to-practice (Canada)` / `REx-PN / practical nursing (Canada)` | `selectOption('rex_pn')` + screenshots; full-width select in onboarding stack. |

## 6. Responsive notes

- **Signup card:** `max-w-2xl`, `min-w-0`, increased padding `p-6 sm:p-9 lg:p-10`.
- **Onboarding selects:** `grid-cols-1 gap-4` only (no `sm:grid-cols-2`).
- **Name row & country/tier:** `grid-cols-1 md:grid-cols-2` (single column below the `768px` breakpoint, two columns from `md` up).
- **Trial wizard:** text columns `min-w-0 flex-1` + `text-wrap break-words`; CTA `w-full` on small screens.

## 7. Copy / capitalization

- **None changed.** Existing `pages.signup.onboardingTitle` (“Quick onboarding (improves recommendations)”) left as-is per i18n rules.

## 8. Console / diagnostics

- **Playwright sample (desktop load):** see `playwright-capture-meta.json` — React DevTools info line; repeated **webpack HMR WebSocket** errors in headless Chromium (environment / proxy handshake), not introduced by this layout diff.
- **Layout overflow probe:** `document.documentElement.scrollWidth === clientWidth` for all three viewports (no horizontal document scroll).

## 9. Edge cases / follow-ups

- **Native `<select>` closed state** is still ultimately OS/browser-drawn; extreme zoom or system fonts could still clip before our layout does. A future enhancement would be a token-aligned **custom** listbox (e.g. Radix) if product needs wrapped “pill” labels inside the trigger—out of scope here.
- **`/app/onboarding`** not visually re-captured in this run (auth required). Code changes there are low-risk flex/word-wrap only.

## 10. Signup flow correctness

- **Unchanged:** `name` attributes (`learnerPath`, `examFocus`, `tier`, `country`, etc.), `examFocus` / country reconciliation in `signupExamFocusOptions` + `reconcileExamFocusForCountry`, and `onSubmit` payload shape.
- **Spot-check:** Programmatic `selectOption` for `rex_pn` and `experienced` against live `/signup` succeeded for CA default country.

---

## Reproduce captures (optional)

Screenshots were taken with **Playwright** (`chromium.launch` from the `nursenest-core` package so `@playwright/test` resolves). Flow: open `/signup`, wait for `select[name="examFocus"]`, full-page capture per viewport, then `selectOption` for `rex_pn` and `experienced` with additional captures. Metadata written to `playwright-capture-meta.json` in this folder.
