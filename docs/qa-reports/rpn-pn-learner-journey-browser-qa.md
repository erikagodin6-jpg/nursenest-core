# RPN / PN learner journey — browser QA report

**Date:** 2026-05-07  
**Workspace:** `/root/nursenest-core`  
**Runner:** Playwright-driven script `nursenest-core/scripts/qa-rpn-pn-browser-journey.mjs` (host-local Chromium; Cursor browser MCP could not reach this machine’s `localhost`).  
**Dev server:** `npm run dev:next` under `nursenest-core/` — port varied (`3000` / `3010`) depending on lockfile and `PORT`; see blockers.

---

## 1. Test account email used

`rpn.qa.student+1778174611739@nursenest.test` (latest scripted run; a new timestamped address is created each run).

---

## 2. Auth / entitlement method

| Step | Detail |
|------|--------|
| **Signup UI** | **Blocked:** “Create Account” stayed disabled — `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set, so the client requires a Turnstile token before submit (`signup-form.tsx`). |
| **Signup API** | `POST /api/signup` with JSON body succeeded (`201`, `ok: true`) when the dev server was healthy — same tier/country/exam fields as the UI. |
| **Login** | Marketing `/login` + credentials. **Issue:** With `NEXTAUTH_URL` not matching the browser origin (e.g. `http://127.0.0.1:3000` vs `http://localhost:3010`), Auth.js client logged `ClientFetchError: Failed to fetch` for session; submit did not land on `/app`. |
| **Paywall** | New user entitlement log showed `outcome: "no_access"` (free tier) — expected for greenfield QA account; no Stripe / production billing used. |

**Auth/entitlement method (effective):** `api_signup_plus_credentials_login` (intended); **full learner shell was only partially verified** because of Auth URL / dev stability issues below.

---

## 3. Pathway / exam / region selected

| Field | Value |
|--------|--------|
| Tier | `RPN` |
| Country | `CA` |
| Exam focus | `rex_pn` (REx-PN) |
| Learner path | `new_grad` |
| Study goal | `pass_first` |
| Daily minutes | `30` |

---

## 4. Routes tested (intended + observed)

| Phase | Intended route | Observed outcome (last full scripted pass) |
|-------|----------------|-----------------------------------------------|
| 1 | `/`, `/signup`, `/api/signup`, `/login` | OK for marketing; login remained on `/login?callbackUrl=%2Fapp` when Auth host mismatched. |
| 2 | `/app` | `page.goto` timeout or stayed on login — **not** a clean authenticated dashboard load in final pass. |
| 3 | `/app/lessons` (+ first lesson) | Earlier pass: hub OK; **no** first hub link matched script selector (`lessons-links`). |
| 4 | `/app/flashcards` (+ category) | Earlier pass: hub screenshot captured; category click not always persisted. |
| 5 | `/app/questions` | Earlier pass: hub + flow screenshots. |
| 6 | `/app/practice-tests`, `/app/practice-tests/start` | Earlier pass: hub + builder screenshots; builder placeholder scan in script. |
| 7 | `/app/cat` | Screenshot captured in earlier pass; CAT availability depends on tier/entitlement — not fully validated as “live CAT session” for RPN free. |
| 8 | `/app/account/report-card`, `/app/account/progress`, `/app/study-plan`, `/app/account` | Scripted; later passes hit `ERR_CONNECTION_REFUSED` after dev process stopped. |
| 9 | Marketing matrix (see §9 table) | Second browser context: mostly `chrome-error` / `about:blank` when server dropped mid-matrix. |

---

## 5. Screenshot paths (artifact folder)

All under: `docs/qa-reports/rpn-pn-browser-2026-05-07/`

**Runs produced multiple generations; prefer files with larger size for “real” UI (typically the 17:01 UTC batch):**

| File | Notes |
|------|--------|
| `01-homepage-desktop.png` | Marketing home (desktop). |
| `02-signup-form.png` | Signup surface + onboarding fields. |
| `03-signup-ui-gated.png` | Turnstile-gated disabled CTA state. |
| `04-login-form.png` | Login form. |
| `05-after-login-app.png` | Post-submit (may still be login shell if redirect failed). |
| `05-dashboard-desktop.png` (larger variant from mixed runs) | Study dashboard when auth worked. |
| `06-lessons-hub-desktop.png` | Lessons hub (substantive capture when server up). |
| `07-lessons-hub-mobile.png` | Lessons hub mobile viewport. |
| `08-flashcards-hub.png` | Flashcards hub. |
| `09-questions-hub.png` | Practice questions hub. |
| `10-questions-flow.png` | Questions flow surface. |
| `11-practice-tests-hub.png` | Practice tests hub (verify title in image vs §11). |
| `12-practice-tests-builder.png` | Builder / start flow. |
| `13-cat-page.png` | CAT route surface. |
| `14-report-card.png`, `15-progress.png`, `16-study-plan.png`, `17-account.png` | Re-run may be error-page thumbnails (~4.7KB) if server died — treat as **unreliable** without re-capture. |

Machine-readable dump: `docs/qa-reports/rpn-pn-browser-2026-05-07/qa-metadata.json` (includes `routesHit`, `findings`, `consoleErrors`).

---

## 6. Passed checks

- Marketing **homepage** and **signup** routes load; signup **API** accepts RPN + CA + `rex_pn` payload matching `signup/route.ts` schema.
- **Truthpack path** verified absent in this clone (documented in-repo; no invented routes from truthpack).
- **Env files:** `nursenest-core/.env.local` contains `DATABASE_URL` and `DIRECT_URL` (names only inspected; values not logged).
- **Playwright** can drive `http://localhost:<port>/` when the dev server responds.
- **i18n audit signals** captured from browser console (missing marketing keys — see §9).
- **Practice Questions** and **Practice Tests** product strings exist in `tools/i18n/marketing/marketing-en.json` with **Title Case** for several learner-facing keys (e.g. `learner.practiceTests.title` is `"Practice Tests"` in current file).

---

## 7. Failed checks

- **End-to-end “new student” UI signup** with visible form submit — failed due to Turnstile client gate.
- **Stable post-login `/app` redirect** — failed when `NEXTAUTH_URL` / port / host did not align with browser URL (Auth.js client fetch errors).
- **Continuous scripted run** after ~3.5 min — `net::ERR_CONNECTION_REFUSED` (dev server process ended or port changed).
- **Marketing nav matrix** in a fresh context — did not complete successfully in final pass (connection / blank tab errors).
- **Lesson detail** deep link from hub — script did not resolve a `main a[href*="/app/lessons/"]` link (selector or empty hub state).

---

## 8. Broken routes

No durable **404** list was captured from a clean authenticated crawl. Failures were predominantly **environmental** (`ERR_CONNECTION_REFUSED`, `chrome-error://chromewebdata/`, Auth session fetch failures), not stable app 404s.

**Action:** Re-run QA with a single long-lived dev server and confirmed `curl -m 10 http://localhost:<port>/api/auth/session` returning `null` quickly before starting Playwright.

---

## 9. Placeholder / i18n leaks (visible / console)

| Severity | Example |
|----------|---------|
| High (marketing QA) | Console: `pages.signup.placeholderFirstName`, `pages.signup.placeholderLastName` — **missing_or_invalid** (signup placeholders). |
| High | Homepage stable placeholders: `pages.home.stablePlaceholder.regions.*`, `pages.home.stablePlaceholder.study.*`, `pages.home.stablePlaceholder.support.*`, `pages.home.pathwaysSection.title` — resolved to literal **Title** / **Body** / **Link** in logs. |
| High | `components.homeHeroCarousel.slide*.label` — many slides missing; carousel handoff `pages.home.carouselHandoff.fallbackCta`. |
| Med | SEO logs: `marketing_canonical_rejected` / `marketing_hreflang_rejected` with `auth_noindex_path` on `/signup` and `/login` (expected for auth pages but noisy in console). |

**Likely sources:** compiled marketing locale pipeline — keys must exist in `tools/i18n/marketing/marketing-en.json` (or overlays) and `npm run i18n:compile` / `i18n:validate` per `AGENTS.md`.

---

## 10. Capitalization inconsistencies (route + current + recommended)

| Location | Current (observed or source) | Recommended |
|----------|------------------------------|---------------|
| Learner hub title key | `marketing-en.json`: `learner.practiceTests.title` → **Practice Tests** | Keep Title Case for H1 (matches QA spec). |
| Same file / related | `learner.profile.activity.practiceTests`, `learner.progressPage.practiceTestsBlock`, CTAs | Often **Practice tests** (sentence case). |
| Admin / labs surfaces | e.g. `admin/users`, labs hubs — **Practice tests** | Align with learner shell: **Practice Tests** for product-facing titles; sentence case for mid-sentence copy only. |
| Retention email helper | `retention-templates.ts` uses “Practice tests” in links | Match learner nav title case in CTA labels where it is a **named product area**. |

---

## 11. RN copy leakage (PN / RPN context)

- Default signup `<select name="tier">` **defaultValue="RN"** — PN/RPN students may submit without changing tier (`signup-form.tsx`). **Recommendation:** default tier from marketing entry / `callbackUrl` hint, or default to last chosen exam path, not RN.
- Ensure post-signup dashboard modules for **RPN + rex_pn** do not show NCLEX-RN-only modules without gating (not fully verified in this run due to auth).

---

## 12. Design issues (route, severity, fix)

| Route | Severity | Issue | Fix |
|-------|----------|-------|-----|
| Homepage | Med | Multiple marketing sections falling back to placeholder **Title/Body/Link** — reads as unfinished, not “premium”. | Ship missing i18n keys; add build guard for `pages.home.stablePlaceholder.*`. |
| Signup | Med | Missing first/last name placeholder translations. | Add `pages.signup.placeholderFirstName` / `LastName` to `marketing-en.json` + compile. |
| Dashboard (when loaded) | Low | Blog teaser slow log (`home_blog_teaser_slow`) — watch hierarchy so blog does not dominate study CTAs. | Performance + layout: defer teaser, tighten “study first” band. |

Semantic color: no new hardcoded hex findings from screenshots alone; follow `semantic-status-tokens.css` for any new status bands.

---

## 13. Mobile issues

- **Lessons hub** mobile screenshot captured (`07-lessons-hub-mobile.png` in good batch) — re-verify overflow and bottom nav when auth is stable.
- Script did not complete **mobile** passes for flashcards / questions / practice tests (desktop-only beyond lessons).

---

## 14. Console errors observed (abridged)

- **Auth.js client:** `ClientFetchError: Failed to fetch` — configuration / origin mismatch (`NEXTAUTH_URL` vs browser host/port).
- **Turnstile / HMR:** WebSocket `/_next/webpack-hmr` invalid response in some headless runs (noise; not learner-facing).
- **Marketing / i18n:** missing keys listed in §9.
- **Entitlement:** `get_user_access_timing` … `outcome: "no_access"` for new free user (informational).

---

## 15. Highest-priority fixes

1. **Local & preview Auth.js:** Ensure `NEXTAUTH_URL` exactly matches how developers open the app (`http://localhost:3000` vs `127.0.0.1`, including **port**). Add to `docs/environment-reference.md` a one-line “must match browser origin” callout if not already prominent.
2. **Signup default tier RN:** Change default `<select name="tier">` away from RN for PN-led campaigns / RPN entry URLs.
3. **Marketing placeholder keys:** Fix `pages.home.stablePlaceholder.*` and carousel slide labels — currently visible as “Title/Body/Link” / “Label” in dev.
4. **Turnstile QA path:** Document staff-only bypass or test keys for E2E (`isTurnstileEnforced()` + `TURNSTILE_SECRET_KEY` contract) so UI signup can be exercised without manual captcha.

---

## 16. Likely source files (grep / codebase)

| Topic | Path |
|--------|------|
| Signup tier default | `nursenest-core/src/components/auth/signup-form.tsx` |
| Signup API schema | `nursenest-core/src/app/api/signup/route.ts` |
| Exam focus PN/REx-PN | `nursenest-core/src/lib/marketing/signup-exam-focus-options.ts` |
| Turnstile enforcement | `nursenest-core/src/lib/captcha/verify-turnstile.ts` |
| Login client-ready / disabled submit | `nursenest-core/src/components/auth/login-form.tsx` |
| Learner “Practice Tests” title | `tools/i18n/marketing/marketing-en.json` key `learner.practiceTests.title` |
| Mixed “Practice tests” strings | `tools/i18n/marketing/marketing-en.json`, `src/lib/retention/retention-templates.ts`, labs/med-calculations hubs |
| CAT / practice tests client copy | `src/components/student/pathway-cat-session-start-client.tsx` |

---

## 17. Recommended next implementation prompts

1. “**Align `NEXTAUTH_URL` with dev defaults** — read `docs/environment-reference.md` and `scripts/assert-local-auth-secret.mjs`; update docs + optional `npm run dev:next` wrapper so `localhost` / `PORT` cannot drift from Auth.js.”
2. “**Signup tier default** — change `defaultValue` on `tier` `<select>` in `signup-form.tsx` to `RPN` when `callbackUrl` or entry query indicates PN/RPN marketing entry; keep RN as fallback only for RN hubs.”
3. “**Backfill marketing-en placeholders** — add all `pages.home.stablePlaceholder.*`, `pages.signup.placeholderFirstName/LastName`, and `components.homeHeroCarousel.slideNN.label` keys; run `npm run i18n:compile && npm run i18n:validate`.”
4. “**QA automation** — extend `scripts/qa-rpn-pn-browser-journey.mjs` to assert `POST /login` session cookie, wait for `/app` with `waitForURL`, use `storageState` for mobile legs, and gate nav matrix on `health` check.”
5. “**Title case audit** — grep `Practice tests` vs `Practice Tests` in `src/` learner-visible strings; normalize per RN / PN context.”

---

## Phase 9 — Nav matrix (template)

| Nav target | Route clicked | Final URL (expected) | Pass |
|------------|---------------|----------------------|------|
| RN (US) | `/us/rn/nclex-rn` | Same hub | **Not verified** (server drop) |
| RPN (CA) | `/canada/rpn/rex-pn` | Same hub | **Not verified** |
| NP | `/us/np` | NP hub | **Not verified** |
| New Grad | `/new-grad` | Marketing | **Not verified** |
| Allied | `/allied-health` | Marketing | **Not verified** |
| Pre-Nursing | `/pre-nursing` | Marketing | **Not verified** |
| Pricing | `/pricing` | Marketing | **Not verified** |
| Blog | `/blog` | Blog index | **Not verified** |
| FAQ | `/faq` | FAQ | **Not verified** |
| Tools | `/tools` | Tools | **Not verified** |
| My Dashboard | `/app` (from nav when signed in) | `/app` | **Blocked** on auth |
| Sign out / in | account menu | `/login` then `/app` | **Blocked** on auth |

---

## Truthpack note

`.vibecheck/truthpack/` is **not present** in this workspace clone (consistent with `nursenest-core/docs/visual-qa.md`). Routes and product language were taken from in-repo sources (`marketing-en.json`, app router paths) — not invented.

---

## CAT (Phase 7)

- Route `/app/cat` loads a surface (screenshot in artifact folder when server healthy).
- **Did not** complete a full adaptive CAT attempt (entitlement + session setup + timed flow). Wording should be checked so free RPN users are not promised a live CAT attempt when gated.

---

*Verified By VibeCheck ✅* (truthpack directory absent — documented above; no tier names or prices invented.)
