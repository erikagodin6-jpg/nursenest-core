# RPN/PN learner journey — browser QA report

**Run ID:** `rpn-learner-journey-20260507-1659` (UTC folder timestamp)  
**App root:** `nursenest-core/` · **Dev URL:** `http://127.0.0.1:3000` (`npm run dev:next` — default port **3000** per Next.js; `package.json` also documents `dev:client` on **5000** for legacy Vite client only)  
**Method:** Cursor IDE Browser MCP (live navigation + snapshots + viewport screenshots). Linux workspace screenshot files were **not** materialized under this folder (MCP saved captures to the IDE host screenshot cache); **intended** artifact paths are listed in §5 for re-export from the IDE if needed.

---

## Executive summary

Canada **REx-PN** (`/canada/pn/rex-pn`) and US **NCLEX-PN** (`/us/pn/nclex-pn`) marketing hubs render correct pathway titles, breadcrumbs, and PN-specific exam language. **Authenticated** learner surfaces (`/app/*`, practice-test builder, flashcard sessions, locked paywall states) were **not** fully exercised: `/app` and `/app/practice-tests` show the sign-in gate without a completed signup. **`.env.local`** on the audit host was missing **`AUTH_SECRET` / `NEXTAUTH_SECRET` / `AUTH_URL` / `NEXTAUTH_URL`** while **`DATABASE_URL`** and **`DIRECT_URL`** were present; a running dev server implies secrets were supplied elsewhere for that process. **Truthpack** paths `.vibecheck/truthpack/ui-pages.json` and `routes.json` are **not present** in this clone; routes below are grounded in `marketing-hub-study-surfaces-scoping.test.ts` and `exam-pathways-data-segment-a.ts` (code contracts), not invented URLs.

---

## 1. Test account used

- **Planned (not completed):** `rpn.qa.student+1778173950@nursenest.test`  
- **Reason:** Sign-up form was inspected in the browser, but account creation and post-signup onboarding were **not** finished (auth env gap on audit host + tier `select` uses `defaultValue="RN"` — see §7 / §11). No password or session was persisted for this run.

---

## 2. Auth / entitlement method

- **Observed:** Unauthenticated marketing browsing; learner routes hit **session gate** (`Sign in` / `Sign in to access the learner app.`).  
- **No** staff bypass, Stripe checkout, or DB entitlement mutation was performed.  
- **Env note:** `nursenest-core/.env.local` contained `DATABASE_URL` + `DIRECT_URL` only; **`AUTH_SECRET`**, **`NEXTAUTH_SECRET`**, **`NEXTAUTH_URL`**, and **`AUTH_URL`** were **absent** at inspection time. Local `npm run dev:next` would normally **exit** without `AUTH_SECRET` or `NEXTAUTH_SECRET` (`scripts/assert-local-auth-secret.mjs`). The live server used for MCP was assumed started with secrets injected in its parent shell.

---

## 3. RPN/PN pathway / exam selected

| Variant | Region | Pathway id (catalog) | Marketing base URL | Notes |
|--------|--------|---------------------|----------------------|-------|
| **A — Canada RPN** | Canada (CA) | `ca-rpn-rex-pn` | `http://127.0.0.1:3000/canada/pn/rex-pn` | Breadcrumb: Home → Canada → RPN → REx-PN. Hero: “REx-PN practice questions for Canada”. |
| **B — US PN** | United States (US) | `us-lpn-nclex-pn` | `http://127.0.0.1:3000/us/pn/nclex-pn` | Breadcrumb: Home → United States → LPN / LVN → NCLEX-PN. |

**Not run as a second full signed-in journey:** US variant was validated at the **marketing hub** level only (terminology and routing). Canada variant received deeper page visits (lessons hub URL).

---

## 4. Routes tested

| Route | Result |
|-------|--------|
| `/` | 200 — marketing home |
| `/signup` | 200 — signup; findings below |
| `/canada/pn/rex-pn` | 200 — REx-PN hub |
| `/canada/pn/rex-pn/lessons` | 200 — lessons hub (slow / skeleton in early viewport) |
| `/us/pn/nclex-pn` | 200 — NCLEX-PN hub |
| `/app` | 200 — learner shell, **unauthenticated** |
| `/app/practice-tests?pathwayId=ca-rpn-rex-pn` | 200 — **gate**; document title fell back to generic marketing title |
| `/faq` | 200 — FAQ |
| `/en` | **404** — not a valid default locale root in this build |

**Nav matrix spot-checks (curl, 15s timeout sample):** `/`, `/us/rn/nclex-rn`, `/us/np/fnp`, `/allied/allied-health`, `/us/new-grad`, `/pre-nursing`, `/blog`, `/tools`, `/app`, `/signin`, `/canada/rn/nclex-rn/pricing` → **200** when allowed to complete.

---

## 5. Screenshot paths (intended)

> MCP `browser_take_screenshot` with `filename` under `/root/nursenest-core/docs/qa-reports/rpn-learner-journey-20260507-1659/` was invoked; binaries landed in the **Cursor IDE screenshot cache** on the host running the browser, not in the Linux workspace copy of this repo. Re-capture or copy from IDE artifacts if files are required in git.

| Intended path (repo-relative) | Subject |
|------------------------------|---------|
| `docs/qa-reports/rpn-learner-journey-20260507-1659/00-homepage-desktop.png` | Marketing homepage |
| `docs/qa-reports/rpn-learner-journey-20260507-1659/01-signup-desktop.png` | Signup (pre-form scroll / hero card) |
| `docs/qa-reports/rpn-learner-journey-20260507-1659/02-canada-rex-pn-hub.png` | Canada REx-PN hub |
| `docs/qa-reports/rpn-learner-journey-20260507-1659/03-canada-rex-pn-lessons-hub.png` | Canada REx-PN lessons hub (header/skeleton phase) |

---

## 6. Passed checks

- **Canada REx-PN hub** exposes pathway-correct H1 and subtitle; nav includes Lessons, Flashcards, Practice Questions, **Practice Exam** (marketing label), REx-PN articles.  
- **US NCLEX-PN hub** uses **LPN / LVN** and **NCLEX-PN** naming (not Canadian REx-PN).  
- **Breadcrumb** segments match `buildExamPathwayPath` expectations (`marketing-hub-study-surfaces-scoping.test.ts`).  
- **Footer “Exam Pathways”** lists RN / RPN / NP / Allied as separate links (RPN is not an RN-only funnel).  
- **Allied occupation hub** `/allied/allied-health` returns 200.  
- **New Grad** `/us/new-grad` returns 200.  
- **Pre-Nursing** `/pre-nursing` returns 200.  
- **FAQ** `/faq` loads substantive content.  
- **Adaptive CAT policy (code):** `pathwayAllowsCatAdaptiveStart` returns true for active `subscribe` pathways such as `ca-rpn-rex-pn` (`pathway-entitlements-policy.ts`) — marketing copy references “adaptive CAT-style exams” consistently on PN hubs.

---

## 7. Failed checks / gaps

- **End-to-end signup → onboarding → dashboard:** not completed (no verified account).  
- **Learner app:** practice tests hub title, builder, flashcard session, question session, report card, planner — **not** observed behind auth.  
- **Signup tier `<select>`** uses `defaultValue="RN"` in `signup-form.tsx` — **RPN is not the default**; combined with full page reloads, **RPN selection appeared to reset** in snapshots.  
- **Exam `<select>`** while country = CA still lists **RN entry-to-practice** and **CNPLE / NP** options even when tier = RPN — confusing **RN/NP leakage** in the same control group.  
- **`/en`:** 404 (invalid shortcut for locale home in this deployment).  
- **Gated `/app/practice-tests`:** browser **document title** did not reflect pathway-specific learner title (generic marketing home title observed).

---

## 8. Broken routes

- **`http://127.0.0.1:3000/en`** — **404** (`Page Not Found | NurseNest`).  
- No other intentional navigation returned 5xx; one **batch curl** to `/canada/rn/nclex-rn/pricing` showed `000` under an **8s** cap (transient slow SSR); **15s** HEAD returned **200**.

---

## 9. Placeholder / i18n leaks

| Location | Observation |
|----------|-------------|
| `/signup` first/last name fields | Accessibility tree: accessible **name** and placeholder show **“Placeholder First Name”** / **“Placeholder Last Name”** — indicates **`t("pages.signup.placeholderFirstName")` / `placeholderLastName` are not resolving** to `marketing-en.json` values (“First name”, “Last name”) in the runtime bundle used by dev. |
| FAQ breadcrumb | Segment rendered as **`/FAQ`** (raw path styling) in the snapshot list item. |

---

## 10. Capitalization inconsistencies

| Surface | Screenshot / route | Current | Recommended |
|---------|-------------------|---------|-------------|
| Footer regional hub | Multiple pages | **“Rex-PN Prep”** | **“REx-PN Prep”** (match exam brand casing) |
| Learner i18n (EN) | `tools/i18n/marketing/marketing-en.json` | **`learner.practiceTests.title`:** `"Practice tests"` | **`"Practice Tests"`** (product request) |
| Marketing hub nav | PN hubs | **“Practice Exam”** | Clarify vs in-app **“Practice Tests”** to reduce terminology drift (optional copy pass). |

---

## 11. RN copy leakage into RPN/PN

| Severity | Where | Description |
|----------|-------|---------------|
| **High** | `/signup` exam dropdown (CA) | Options still titled **“RN entry-to-practice (Canada)”** and include **NP** track when the learner picked **RPN** — reads as RN/NP-first framing. |
| **Medium** | Global footer blurb | “NCLEX and global licensing prep for **RN**, PN/LVN, NP…” — acceptable for global site, but **dominates** footer on PN-specific pages; consider pathway-aware footer copy. |
| **Low** | Marketing hub subnav | **“Practice Exam”** vs PN “Practice Tests” wording in-app — not strictly RN, but adds cross-surface vocabulary drift. |

**RPN hub** itself correctly centers **REx-PN** / **RPN**; no NCLEX-RN hub title was observed on `/canada/pn/rex-pn`.

---

## 12. Design-quality issues (vs semantic guardrails)

- **Homepage / hubs:** Generally clean hierarchy, blue-forward brand, cards readable.  
- **Semantic variety:** Large regions skew **single-hue / muted** in hero areas; data/status bands on hubs were not deeply visible in snapshots (limited scroll capture).  
- **Lessons hub first paint:** Visible **skeleton / thin placeholder** band under header before main grid — risk of “empty” perception on slower SSR (study momentum).  
- **Signup:** “Quick answers” accordion is helpful but **dense** relative to the form (admin-adjacent feel vs pure conversion).

---

## 13. Mobile issues

- Browser resized to **390×844** for hub checks; **hamburger** + **Log In / Start Free** pattern present.  
- **Not fully verified:** tap targets on all footer columns, horizontal overflow on long blog titles, and full mobile signup keyboard overlap — **needs device pass** with screenshots in IDE cache.

---

## 14. Console errors (representative)

- **Chrome preload warnings** on `/signup`: multiple `link preload` entries **not used within a few seconds** (`_next/static/chunks/...`). Noise level: medium; does not break UX but clutters QA console.  
- No uncaught **red** JS exception surfaced in the sampled console export for the navigations performed; no scary error overlays observed on inspected transitions.

---

## 15. Highest-priority fixes

1. **Fix signup marketing bundle resolution** so `pages.signup.placeholderFirstName` / `LastName` render real copy (and accessible names are not “Placeholder …”).  
2. **Signup exam options:** filter or regroup exam choices by **tier + country** so RPN/PN never sees RN-first labels or NP options in the same control without explicit intent.  
3. **Default tier on signup:** change `defaultValue="RN"` to a neutral prompt or last-mile validation so **RPN/PN is not silently RN**.  
4. **`learner.practiceTests.title` English string:** `"Practice tests"` → **`"Practice Tests"`** per product standardization.  
5. **Footer “Rex-PN Prep”** → **`REx-PN Prep`**.  
6. **Gated learner route metadata:** ensure `/app/practice-tests` sets a pathway-aware or learner-shell title when unauthenticated, or a dedicated “Sign in to continue” title — avoid generic marketing home title.

---

## 16. Likely responsible files (grep-backed)

| Area | Files |
|------|-------|
| Signup fields / tier default / selects | `nursenest-core/src/components/auth/signup-form.tsx` |
| Signup page wrapper | `nursenest-core/src/components/marketing/marketing-signup-page.tsx`, `src/app/(marketing)/(default)/signup/page.tsx` |
| EN learner “Practice tests” title | `tools/i18n/marketing/marketing-en.json` (`learner.practiceTests.title`) |
| Practice tests page shell | `nursenest-core/src/app/(student)/app/(learner)/practice-tests/page.tsx` |
| Footer regional labels | Marketing layout / footer components under `src/components/layout/` (search **Rex-PN** / `rex-pn` link labels) |
| Pathway URLs | `src/lib/exam-pathways/build-exam-pathway-path.ts`, `exam-pathways-data-segment-*.ts` |
| FAQ breadcrumb | FAQ page under `src/app/(marketing)/(default)/faq/page.tsx` + breadcrumb builder |

---

## 17. Recommended next implementation prompts

1. “**Audit `getLearnerMarketingBundle` / signup locale shard** so `pages.signup.placeholderFirstName` resolves in dev after `i18n:compile`; add a Playwright assertion on accessible name not containing `Placeholder`.”  
2. “**Refactor signup exam `<select>` options** to be derived from `{ country, tier }` with no cross-tier noise; add unit tests for option lists for `RPN+CA`, `LVN_LPN+US`, `RN+CA`.”  
3. “**Change signup tier select** from `defaultValue=\"RN\"` to explicit blank / `required` prompt; ensure server rejects missing tier.”  
4. “**Normalize casing:** `REx-PN` in footer + marketing nav; update snapshots.”  
5. “**Set metadata for gated `/app/*` routes** when `session` is null so `document.title` is learner-appropriate.”  
6. “**Mobile QA pass:** capture 390-wide screenshots for `/signup`, `/canada/pn/rex-pn/lessons`, `/app/practice-tests` (signed-in) once test account exists.”

---

## Nav matrix (label → final URL)

Assumption: primary nav/footer links on default marketing layout resolve to **default-locale paths** (no `/en` prefix). **“My Dashboard”** mapped to **`/app`**.

| Clicked label (as shown in UI) | Final URL | Expected | Pass? | Notes |
|--------------------------------|-----------|----------|-------|-------|
| RN (footer / pathways) | `/us/rn/nclex-rn` (canonical US RN hub) | US RN hub | **Pass** | 200 |
| RPN | `/canada/pn/rex-pn` (from REx-PN regional link context) | CA PN / REx-PN | **Pass** | Must not redirect to RN hub — **Pass** (spot-check) |
| NP | `/us/np/fnp` | US NP hub | **Pass** | 200 |
| Allied Health | `/allied/allied-health` | Allied hub | **Pass** | 200 |
| New Grad (US) | `/us/new-grad` | New grad ecosystem | **Pass** | 200 |
| Pre-Nursing | `/pre-nursing` | Pre-nursing hub | **Pass** | 200 |
| Pricing | `/canada/rn/nclex-rn/pricing` (example deep pricing) | Tier-scoped pricing page | **Pass** | 200 (slow OK) |
| Blog | `/blog` | Blog index | **Pass** | 200 |
| FAQ | `/faq` | FAQ | **Pass** | 200 |
| Tools | `/tools` | Tools index | **Pass** | 200 |
| My Dashboard | `/app` | Learner entry | **Pass** | 200 (auth gate inside) |
| Log in / Sign in | `/signin` (header) | Auth | **Pass** | 200 |
| **Locale `/en` shortcut** | `/en` | Often locale home in i18n apps | **Fail** | **404** |

*Screenshot on fail:* `/en` — capture in IDE (not synced to Linux workspace).

---

## Truthpack note

Requested files **`.vibecheck/truthpack/ui-pages.json`** and **`routes.json`** were **not found** under `/root/nursenest-core` (only other `.vibecheck` metadata existed). Route list for PN/RN hubs is aligned with **`marketing-hub-study-surfaces-scoping.test.ts`** in-repo.

---

**Truthpack:** `.vibecheck/truthpack/ui-pages.json` and `routes.json` were not present in this workspace; routes and copy findings were cross-checked against in-repo tests (`marketing-hub-study-surfaces-scoping.test.ts`), pathway catalog (`exam-pathways-data-segment-a.ts`), and `tools/i18n/marketing/marketing-en.json`.
