# New Grad (transition-to-practice) E2E QA — REPORT

**Run id:** `new-grad-journey-1778174002`  
**Date:** 2026-05-07  
**Environment:** Local Next.js dev (`npm` / Turbopack per repo). Truthpack (`.vibecheck/truthpack/`) **not present** in this clone — findings grounded in **live browser snapshot**, **Playwright capture metadata** (partial), **curl title probe** (partial; server unstable), and **source inspection**.

---

## 1. Executive summary

**Verdict:** The New Grad marketing IA is **work-area-first** on `/us/new-grad` and `/canada/new-grad` with **22** clinical unit cards, strong transition-to-practice vocabulary in hero and sections, and clear separation from generic NCLEX-RN framing in copy. **SEO / routing polish** and **capitalization consistency** need tightening. **Authenticated study surfaces (Phase 8)** were **not exercised** because signup remains **Turnstile-gated** when both `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are set (`isTurnstileEnforced()` in `src/lib/captcha/verify-turnstile.ts`); no dev bypass was found beyond unsetting those keys.

**Top 5 must-fix**

1. **P0 — `/new-grad` is a dead end (404)** while locale shortcuts use `/[locale]/new-grad` and country hubs use `/us/new-grad` and `/canada/new-grad`. Add redirect or canonical UX (see §7).
2. **P1 — Canada New Grad landing `<title>` duplicates the brand** (`… | NurseNest | NurseNest`) — static `metadata.title` in `canada/new-grad/page.tsx` likely stacks with root layout title template (see §9, §20).
3. **P1 — Verify `/en/new-grad` server redirect** — source uses `redirect("/us/new-grad")`, but an automated capture once landed on `/en/new-grad` with the **generic** marketing title; re-verify with stable `curl -I` when the dev server is healthy (see §7).
4. **P2 — Canada work-area hub loads `US_NEW_GRAD_TRANSITION_PATHWAY_ID` for live inventory** while study links are CA RN-hub-aligned — risk of **US-skewed counts** on Canadian shells (`canada/new-grad/[workArea]/page.tsx` + `NewGradWorkAreaHub`).
5. **P2 — Copy / CTA capitalization drift** on hub StudyCards: e.g. title **Practice questions** vs CTA **Practice Questions**; **Practice exams** vs **Open Practice Exams** (`new-grad-work-area-hub.tsx`).

**Totals**

- **Routes enumerated / intended for matrix:** 51 (4 landings + `/new-grad` + 22×2 work-area hubs + 3 public US transition study URLs + signup base) — full HTTP matrix **not completed** due to dev process instability under load.
- **Screenshots verified in workspace:** **6** (`ls -1 …/screenshots | wc -l` → 6).

---

## 2. Test method & auth state

| Item | Result |
|------|--------|
| **Browser MCP** | Used for `/us/new-grad` — full accessibility snapshot captured (work-area list, nav, study mode links). Subsequent navigation to a hub hit `chrome-error://chromewebdata/` when **no dev listener** was reachable from the automation host. |
| **Playwright** | `capture-screenshots.mjs` wrote **6** PNGs (landings + `/en/new-grad` observation + `/new-grad` 404) then the **local dev server stopped responding** (timeouts / `ECONNREFUSED` in `capture-meta.json`). A follow-up batch against port **3010** also ended with connection loss. |
| **curl title sweep** | `curl-titles.tsv` started while port 3000 flapped; many rows show `000ERR` / timeouts — **not used** as authoritative HTTP results. |
| **Turnstile bypass** | **None in code** beyond env: client disables submit when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set; API enforces when **both** site + secret keys are set. Unset keys → no client gate; secret absent → server `verifyTurnstileToken` fail-open. **No `QA_BYPASS` / `DISABLE_CAPTCHA` flag** found in signup paths. |
| **Signup completed** | **No** (by design: do not defeat Turnstile). |
| **Blocked** | **Phase 8** (authenticated lessons/flashcards/practice tests in app) — **Blocked — Turnstile** (and no paid E2E credentials used in this pass). |

---

## 3. Work areas tested (source of truth = rendered `/us/new-grad` snapshot)

All **22** cards appeared in the live browser snapshot under **“Choose your clinical work area”** (each with **“Open unit hub”** link text — generic for assistive tech).

| # | Work area (rendered title) | US hub path | Canada hub path |
|---|---------------------------|-------------|-----------------|
| 1 | Medical–Surgical | `/us/new-grad/med-surg` | `/canada/new-grad/med-surg` |
| 2 | Emergency Department | `/us/new-grad/emergency-department` | `/canada/new-grad/emergency-department` |
| 3 | ICU | `/us/new-grad/icu` | `/canada/new-grad/icu` |
| 4 | Pediatric ICU | `/us/new-grad/pediatric-icu` | `/canada/new-grad/pediatric-icu` |
| 5 | Neonatal ICU | `/us/new-grad/neonatal-icu` | `/canada/new-grad/neonatal-icu` |
| 6 | Cardiac ICU | `/us/new-grad/cardiac-icu` | `/canada/new-grad/cardiac-icu` |
| 7 | Neuro ICU | `/us/new-grad/neuro-icu` | `/canada/new-grad/neuro-icu` |
| 8 | Trauma | `/us/new-grad/trauma` | `/canada/new-grad/trauma` |
| 9 | Long-Term Care | `/us/new-grad/long-term-care` | `/canada/new-grad/long-term-care` |
| 10 | Rehabilitation | `/us/new-grad/rehabilitation` | `/canada/new-grad/rehabilitation` |
| 11 | Mental Health | `/us/new-grad/mental-health` | `/canada/new-grad/mental-health` |
| 12 | Pediatrics | `/us/new-grad/pediatrics` | `/canada/new-grad/pediatrics` |
| 13 | Maternal–Newborn | `/us/new-grad/maternal-newborn` | `/canada/new-grad/maternal-newborn` |
| 14 | Labour & Delivery | `/us/new-grad/labour-delivery` | `/canada/new-grad/labour-delivery` |
| 15 | Oncology / Hematology | `/us/new-grad/oncology-hematology` | `/canada/new-grad/oncology-hematology` |
| 16 | Renal / Dialysis | `/us/new-grad/renal-dialysis` | `/canada/new-grad/renal-dialysis` |
| 17 | Operating Room | `/us/new-grad/operating-room` | `/canada/new-grad/operating-room` |
| 18 | PACU | `/us/new-grad/pacu` | `/canada/new-grad/pacu` |
| 19 | Community / Public Health | `/us/new-grad/community-public-health` | `/canada/new-grad/community-public-health` |
| 20 | Primary Care / Clinics | `/us/new-grad/primary-care-clinics` | `/canada/new-grad/primary-care-clinics` |
| 21 | Home Care | `/us/new-grad/home-care` | `/canada/new-grad/home-care` |
| 22 | Hospice / Palliative Care | `/us/new-grad/hospice-palliative-care` | `/canada/new-grad/hospice-palliative-care` |

---

## 4. Routes tested (intended matrix + observed evidence)

| Route | Final URL (observed when available) | `document.title` / metadata (observed or from code) | Pass/Fail | Notes |
|-------|--------------------------------------|-----------------------------------------------------|-----------|-------|
| `/us/new-grad` | `/us/new-grad` | **New Grad nursing \| Clinical work areas \| NurseNest** (Playwright + browser) | **Pass** | Work-area-first IA; footer still exposes RN/NP/Canada exam ecosystem (expected marketing shell). |
| `/canada/new-grad` | `/canada/new-grad` | **New graduate nurses \| Canada \| NurseNest \| NurseNest** (Playwright) | **Pass** / **SEO defect** | Duplicate brand suffix (§9). |
| `/en/new-grad` | *Inconsistent in automation* | Playwright once: generic **Canada-First…** title while URL stayed `/en/new-grad` | **Needs retest** | Code: `redirect("/us/new-grad")` in `[locale]/new-grad/page.tsx`. |
| `/new-grad` | `/new-grad` | **Page Not Found \| NurseNest** (Playwright) | **Fail** | No route; users/bookmarks may 404. |
| `/us/new-grad/{slug}` (22×) | *Expected* `/us/new-grad/{slug}` | From `generateMetadata`: `{title} \| New Grad \| NurseNest` | **Not fully retested live** | Hub screenshots lost to server instability; **static params** exist (`generateStaticParams`). |
| `/canada/new-grad/{slug}` (22×) | *Expected* `/canada/new-grad/{slug}` | From `generateMetadata`: `{title} \| New Grad \| Canada \| NurseNest` | **Not fully retested live** | Same as above. |
| `/us/rn/new-grad-transition/lessons` | — | (not reliably captured this run) | **Unknown** | Public marketing lessons for transition pathway — verify title vs generic RN hub when server stable. |
| `/us/rn/new-grad-transition/questions` | — | (unknown) | **Unknown** | |
| `/us/rn/new-grad-transition/cat` | — | (unknown) | **Unknown** | Prior NP QA noted empty `<title>` on some CAT marketing routes — **apply same audit** here when stable. |
| `/signup` | — | Signup metadata keys via `pages.signup.*` | **Blocked submit** | Turnstile gate when keys set; default `learnerPath` select is **`experienced`**, not `new_grad` (`signup-form.tsx`). |

---

## 5. Screenshots saved (workspace paths)

**Directory:** `/root/nursenest-core/qa-reports/new-grad-journey-1778174002/screenshots/`

**`ls -1` listing (6 files):**

1. `01-newgrad-us-landing-desktop.png`
2. `02-newgrad-us-landing-mobile.png`
3. `03-newgrad-canada-landing-desktop.png`
4. `04-newgrad-canada-landing-mobile.png`
5. `05-newgrad-en-locale-redirect-desktop.png` *(see §7 — redirect/title anomaly)*
6. `06-newgrad-root-path-desktop.png` *(404)*

**Auxiliary artifacts:** `capture-meta.json` (partial run log), `capture-hubs-meta.json` (mostly connection errors), `capture-screenshots.mjs`, `capture-hubs-batch.mjs`, `curl-titles.tsv` (unreliable).

**Note:** `cursor-ide-browser` screenshots with absolute paths were observed to map to an IDE-host temp mirror in this environment; **workspace truth** is the six files above from Playwright.

---

## 6. Working routes

- **`/us/new-grad`** — 200; strong New Grad positioning.
- **`/canada/new-grad`** — 200; same card grid with Canada shell.
- **Expected (code + route contract test):** all **`/us/new-grad/[workArea]`** and **`/canada/new-grad/[workArea]`** for the 22 slugs in `listNewGradWorkAreaSlugs()` (`new-grad-work-areas.route-contract.test.ts`).

---

## 7. Broken routes

| Route | Symptom | Severity |
|-------|---------|----------|
| **`/new-grad`** | **404** “Page Not Found” (confirmed via Playwright screenshot `06-…`) | **P0** |
| **`/en/new-grad`** | Automation saw **non–New Grad title** once; **requires** stable `curl -I` / browser retest to confirm redirect vs layout fallback | **P1** investigation |

---

## 8. RN / RPN / NP / Allied fallback issues

| Issue | Where | Severity |
|-------|-------|----------|
| **Canada study links** use **CA RN hub** URLs for lessons/questions/CAT while inventory strip pathway is **`us-rn-new-grad-transition`** | `publicNewGradStudyDestinations("CA", …)` + `canada/new-grad/[workArea]/page.tsx` | **P2** — intentional per comments, but inventory vs CTA geography may confuse Canadian learners. |
| **Mega menu / footer** still surface RN, RPN, NP, Allied, regional hubs on New Grad pages | Marketing shell | **Info** — not incorrect, but reinforces **exam-prep ecosystem** around a **transition** surface; consider IA emphasis for New Grad-only sessions. |
| Hub StudyCard **Practice questions** description: “**NCLEX-style** judgment items…” | `new-grad-work-area-hub.tsx` | **P2** wording — may read as exam-prep-only for first-year nurses. |

---

## 9. Placeholder / i18n leaks

| Route | Literal | Screenshot |
|-------|---------|------------|
| **All hubs (a11y)** | Every work-area CTA link name is **“Open unit hub”** (not the destination title) | `01-newgrad-us-landing-desktop.png` |
| **Signup** | Prior NP QA: **Placeholder First Name / Last Name** when i18n missing — **not re-screenshotted** this run; default `learnerPath` is **not** New Grad | n/a |

---

## 10. Capitalization inconsistencies

| Route | Current | Recommended |
|-------|---------|----------------|
| Hub StudyCards | Title **Practice questions** vs CTA **Practice Questions** | Pick **sentence case** or **title case** consistently (product style guide). |
| Hub StudyCards | Title **Practice exams** vs CTA **Open Practice Exams** | Align CTA casing with title. |
| Landing quick links | Snapshot: **Practice questions** (section link) vs footer **Practice Questions** | Unify. |
| Landing | **Readiness exams** (label) vs common product term “Practice Tests” elsewhere | Decide canonical term (“Readiness exams” vs “Practice tests”) and align with learner app. |

---

## 11. Work-area naming inconsistencies

- **En dash usage** is consistent in titles (e.g. **Medical–Surgical**, **Maternal–Newborn**) — good.
- **“Readiness exams”** on landing vs **“Readiness exams”** / CAT hub naming — ensure CAT SEO titles are not empty (carry-forward from NP QA).

---

## 12. New Grad terminology gaps

**Present (good):** “First-year nurses”, “transition-to-practice”, “unit readiness”, “shift priorities”, “safety edges”, “SBAR”, “escalate”, “delegation”, “deterioration”, “handoff” themes appear in hero and data-driven bullets in `new-grad-work-areas.ts` / hub sections.

**Gaps / soften:**

- **Report Card / Study Planner** not surfaced on public New Grad marketing cards (may live only in app — OK).
- **Shift Priorities** as a labeled surface appears in prose but not as a dedicated nav label — optional enhancement.

---

## 13. Regional-fragmentation issues

- **US vs Canada** landings are **duplicated card grids** with different metadata and breadcrumbs — clinically similar work areas; split is **jurisdictional/marketing** rather than clinical. **Risk:** Canada hub pathway inventory uses **US** transition pathway id (§8).
- **Study destinations:** US uses **`/us/rn/new-grad-transition/*`**; Canada uses **canonical CA RN hub** paths for lessons/questions — **documented split** in `marketing-pathway-nav-destinations.ts`.

---

## 14. Design-quality issues

| Route | Severity | Issue | Suggested fix |
|-------|----------|-------|----------------|
| `/us/new-grad` | **P2** | Footer + mega ecosystem creates **dense exam-prep framing** below the fold | For New Grad sessions, test a **quieter footer** or elevated **transition CTA band** per `nursenest-production-governance.mdc`. |
| Hub (code review) | **P2** | Strong semantic colors in hub header — good; ensure **StudyCard** grid avoids “wall of same hue” on xl breakpoints | Already uses mixed chart tokens — keep monitoring contrast. |

---

## 15. Mobile issues

- **Landing mobile screenshot** captured at **375×812** (`02-…-mobile.png`) — no breakage detected in static image review; **hamburger + region** controls present in snapshot.
- **Sticky CTA / overflow** — not systematically re-tested after server instability; recommend re-run **Phase 6** when dev is stable.

---

## 16. Auth / onboarding issues

- **Turnstile:** Submit stays disabled until token when site key is set (`signup-form.tsx`). **No bypass** found.
- **`learnerPath` default:** **`experienced`** — New Grad is **not** pre-selected for “New Grad CTA” flows unless UX adds URL param support.
- **Name placeholders:** carry-forward from NP QA — not re-validated in browser this run.

---

## 17. Navigation / nav-state issues

- **Breadcrumb** on landing: **Home / United States / New Grad** (browser snapshot) — coherent.
- **“Start free account”** uses `guestMarketingSignupHref` → `/signup?callbackUrl=…` (not `signupWithCallback(HUB.tools)` on non-home — header lines **523–531**). **Misroute to `/blog`** was **not reproduced** on New Grad in this run; still watch **stacking / overlay** issues called out in NP QA.

---

## 18. Console errors per route

- **Playwright:** repeated **`webpack-hmr` WebSocket** errors (expected mismatch for headless vs dev WS).
- **Automation host → local dev:** **`ECONNREFUSED` / timeouts** after extended navigation — environmental, not product JS errors.

---

## 19. Highest-priority fixes (P0 / P1 / P2)

| Rank | ID | Title |
|------|----|-------|
| P0 | NG-001 | Add **redirect or rewrite** for bare **`/new-grad`** to **`/us/new-grad`** (or locale-aware resolver). |
| P1 | NG-002 | Fix **duplicate `| NurseNest`** in Canada New Grad `<title>` / OG title pipeline. |
| P1 | NG-003 | Re-verify **`/en/new-grad`** returns **307/308** to **`/us/new-grad`** and title matches New Grad landing. |
| P2 | NG-004 | Reconcile **Canada hub inventory pathway** (`US_NEW_GRAD_TRANSITION_PATHWAY_ID`) with **CA study URLs** or document why counts are US-scoped. |
| P2 | NG-005 | Normalize **StudyCard** title vs CTA capitalization; soften **NCLEX-style** phrasing on New Grad hubs. |

---

## 20. Likely responsible files (grep / glob)

| Area | Files |
|------|-------|
| Landing & cards | `nursenest-core/src/components/marketing/new-grad-marketing-landing.tsx` |
| Work-area data | `nursenest-core/src/lib/new-grad/new-grad-work-areas.ts` |
| Hub UI | `nursenest-core/src/components/marketing/new-grad-work-area-hub.tsx` |
| US / CA pages | `nursenest-core/src/app/(marketing)/(default)/us/new-grad/page.tsx`, `…/us/new-grad/[workArea]/page.tsx`, `…/canada/new-grad/page.tsx`, `…/canada/new-grad/[workArea]/page.tsx` |
| Locale shortcut | `nursenest-core/src/app/(marketing)/(default)/[locale]/new-grad/page.tsx` |
| Nav / signup hrefs | `nursenest-core/src/components/layout/site-header.tsx`, `nursenest-core/src/lib/marketing/marketing-entry-routes.ts`, `nursenest-core/src/lib/navigation/marketing-mega-menu.ts` |
| Study URL matrix | `nursenest-core/src/lib/navigation/marketing-pathway-nav-destinations.ts` |
| SEO guard | `nursenest-core/src/lib/seo/safe-marketing-metadata.ts` |
| Signup + Turnstile | `nursenest-core/src/components/auth/signup-form.tsx`, `nursenest-core/src/components/auth/turnstile-signup.tsx`, `nursenest-core/src/app/api/signup/route.ts`, `nursenest-core/src/lib/captcha/verify-turnstile.ts` |
| i18n keys | `nursenest-core/src/lib/i18n/marketing-message-keys.generated.ts` (search `nav.mega.newGrad`, `pages.signup.*`) |

---

## 21. Recommended next implementation prompts

1. **Routing:** “Add a **permanent redirect** from `/new-grad` to `/us/new-grad` (or to locale-detection first), and add a **smoke test** so the bare path never 404s again.”
2. **SEO:** “Fix **Canada New Grad landing** title duplication (`| NurseNest | NurseNest`) by aligning `metadata.title` with `safeGenerateMetadata` / root `title.template` behavior.”
3. **Locale QA:** “Prove **`/en/new-grad`** issues a **single redirect** to **`/us/new-grad`**; add a **Playwright** or **route test** asserting status and final `Location`.”
4. **Canada data fidelity:** “Either load **Canada-appropriate pathway** for `PathwayLiveInventoryStrip` on `/canada/new-grad/*`, or add explicit copy: ‘Counts reflect the US transition pathway inventory’ — pick one and test.”
5. **Copy consistency:** “Unify **Practice questions / Practice Questions** and **Practice exams / Practice tests** language across `new-grad-work-area-hub.tsx` and the learner app surfaces.”
6. **Auth QA harness:** “For internal QA only, document **`NEXT_PUBLIC_TURNSTILE_SITE_KEY` unset** for local signup automation — never ship to prod without captcha.”

---

## Appendix — Dev server stability (QA environment)

Multiple `next dev` instances competed for ports (**3000**, **3005**, **3010**) during this session; long Playwright loops correlated with **`ECONNREFUSED` / empty responses**. **Recommendation:** single dev instance + rerun `capture-hubs-batch.mjs` with `BASE_URL` pinned to the live port once stable.

---

*End of report.*
