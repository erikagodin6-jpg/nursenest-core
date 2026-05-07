# Allied Health — Occupation Journey QA Report

**Run ID:** `allied-occupation-journey-20260507-1710`  
**Date:** 2026-05-07  
**Primary surfaces:** Production `https://www.nursenest.ca` (stable for full matrix + PNGs). Local dev (`next dev`, ports 3000/3010) was started for early checks but **crashed or conflicted** under load; **Network** URL from dev (`http://165.245.235.115:3000`) was intermittently reachable from this VM.

---

## Summary

The global Allied hub at `/allied/allied-health` loads with **19 visible occupation tracks** (canonical list taken from **rendered hub HTML** + browser accessibility snapshot). Each `/allied/{professionKey}` returns **200** with **no redirect to RN/PN/NP** routes (verified via `curl -sL -o /dev/null -w '%{url_effective}'` on production). Per-occupation marketing hubs expose **study-mode cards** (Lessons, Practice questions, Flashcards, Practice exams, Adaptive readiness) when the full hub layout is enabled. **Nursing-oriented global chrome** remains visible (header CTA aria-label, footer “Study Nursing…”, NCLEX mentions in global/footer payloads), which **dilutes allied-only identity** on otherwise strong occupation-specific content. **Capitalization** is inconsistent between nav/footer (“Practice Questions”) and hub study cards (“Practice questions”, “Practice exams”). Cursor **browser MCP** was used for **navigate + snapshot** on production; **Playwright `screenshot`** captured PNGs into this folder. A **single MCP click** on a Next.js `<Link>` did not surface a URL change in the post-click snapshot (likely client-navigation timing); routing was therefore **cross-checked with HTTP + Playwright navigates**.

---

## 1. Occupations tested

**Source of truth:** Hub quick-scan links on `https://www.nursenest.ca/allied/allied-health` (same 19 paths as `curl` grep of `href="/allied/…"`).

| # | Card label (UI) | `professionKey` / path |
|---|-----------------|-------------------------|
| 1 | Community health worker | `community-health-worker` |
| 2 | Dental assistant | `dental-assistant` |
| 3 | Dental hygiene | `dental-hygiene` |
| 4 | Dietetic technician | `dietetic-technician` |
| 5 | EMT certification | `emt` |
| 6 | Medical imaging | `imaging` |
| 7 | Medical laboratory assistant | `lab-assistant` |
| 8 | Medical assistant | `medical-assistant` |
| 9 | Mental health and addictions worker | `mental-health-addictions` |
| 10 | Medical laboratory | `mlt` |
| 11 | Occupational therapy assistant | `ota` |
| 12 | Paramedic certification | `paramedic` |
| 13 | Pharmacy technician | `pharmacy-tech` |
| 14 | PSW, HCA, and CCA | `psw-hca` |
| 15 | Physical therapist assistant | `pta` |
| 16 | Radiography and medical imaging | `radiography` |
| 17 | Respiratory therapy (RRT) | `respiratory` |
| 18 | Social work | `social-work` |
| 19 | Ultrasound and sonography | `sonography` |

---

## 2. Routes tested

| Route | Result |
|-------|--------|
| `/allied` | 200 (marketing shell; screenshot `prod-allied-root-desktop.png`) |
| `/allied/allied-health` | 200 global hub |
| `/es/allied/allied-health` | 200 localized hub (screenshot `prod-hub-es-mobile.png`) |
| `/allied/{slug}` ×19 | Each 200, final URL equals requested marketing hub |
| `/allied/{slug}/lessons` ×19 | 200; final URL remained on same path (no host change); screenshots per occupation |
| `/us/allied/allied-health/flashcards` | 200 (sample study surface `prod-pta-flashcards-sample.png`) |
| `/signup` | 200 (auth entry snapshot `prod-signup-desktop.png`) |

**Truthpack:** `.vibecheck/truthpack/ui-pages.json` and `routes.json` were **not present** in this clone (only other `.vibecheck/*` metadata). Routes were derived from **live app + registry** (`nursenest-core/src/lib/allied/allied-global-hub-path.ts`, `allied-professions-registry.ts`).

### Occupation routing matrix (production)

**Method:** `curl -sL -o /dev/null -w '%{url_effective}' https://www.nursenest.ca/allied/{slug}` from this environment. **Expected:** final URL `https://www.nursenest.ca/allied/{slug}` with no RN/PN/NP host or path takeover.

| Label clicked (hub card) | Initial route | Final URL | Expected | Pass/Fail | Screenshot on fail |
|--------------------------|---------------|-----------|----------|-----------|---------------------|
| Community health worker | `/allied/community-health-worker` | `https://www.nursenest.ca/allied/community-health-worker` | Same path | **Pass** | — |
| Dental assistant | `/allied/dental-assistant` | `https://www.nursenest.ca/allied/dental-assistant` | Same path | **Pass** | — |
| Dental hygiene | `/allied/dental-hygiene` | `https://www.nursenest.ca/allied/dental-hygiene` | Same path | **Pass** | — |
| Dietetic technician | `/allied/dietetic-technician` | `https://www.nursenest.ca/allied/dietetic-technician` | Same path | **Pass** | — |
| EMT certification | `/allied/emt` | `https://www.nursenest.ca/allied/emt` | Same path | **Pass** | — |
| Medical imaging | `/allied/imaging` | `https://www.nursenest.ca/allied/imaging` | Same path | **Pass** | — |
| Medical laboratory assistant | `/allied/lab-assistant` | `https://www.nursenest.ca/allied/lab-assistant` | Same path | **Pass** | — |
| Medical assistant | `/allied/medical-assistant` | `https://www.nursenest.ca/allied/medical-assistant` | Same path | **Pass** | — |
| Mental health and addictions worker | `/allied/mental-health-addictions` | `https://www.nursenest.ca/allied/mental-health-addictions` | Same path | **Pass** | — |
| Medical laboratory | `/allied/mlt` | `https://www.nursenest.ca/allied/mlt` | Same path | **Pass** | — |
| Occupational therapy assistant | `/allied/ota` | `https://www.nursenest.ca/allied/ota` | Same path | **Pass** | — |
| Paramedic certification | `/allied/paramedic` | `https://www.nursenest.ca/allied/paramedic` | Same path | **Pass** | — |
| Pharmacy technician | `/allied/pharmacy-tech` | `https://www.nursenest.ca/allied/pharmacy-tech` | Same path | **Pass** | — |
| PSW, HCA, and CCA | `/allied/psw-hca` | `https://www.nursenest.ca/allied/psw-hca` | Same path | **Pass** | — |
| Physical therapist assistant | `/allied/pta` | `https://www.nursenest.ca/allied/pta` | Same path | **Pass** | — |
| Radiography and medical imaging | `/allied/radiography` | `https://www.nursenest.ca/allied/radiography` | Same path | **Pass** | — |
| Respiratory therapy (RRT) | `/allied/respiratory` | `https://www.nursenest.ca/allied/respiratory` | Same path | **Pass** | — |
| Social work | `/allied/social-work` | `https://www.nursenest.ca/allied/social-work` | Same path | **Pass** | — |
| Ultrasound and sonography | `/allied/sonography` | `https://www.nursenest.ca/allied/sonography` | Same path | **Pass** | — |

**Note:** Cursor browser MCP **click** on a hub occupation `Link` did not show navigation in the immediate snapshot (see §13); HTTP checks above **confirm** routing server-side / full navigation.

---

## 3. Screenshots captured (paths)

All under: `docs/qa-reports/allied-occupation-journey-20260507-1710/`

**Production (primary set, `prod-*`):**

- `prod-hub-global-desktop.png`, `prod-hub-global-mobile.png`
- `prod-allied-root-desktop.png`
- `prod-hub-es-mobile.png`
- `prod-signup-desktop.png`
- `prod-pta-flashcards-sample.png`
- Per occupation (`{slug}` as above):  
  `prod-occ-{slug}-hub-desktop.png`, `prod-occ-{slug}-hub-mobile.png`, `prod-occ-{slug}-lessons-desktop.png`

**Local partial (early run before dev instability):**

- `hub-global-desktop.png`, `hub-global-mobile.png`
- `allied-root-desktop.png`, `allied-root-mobile.png`
- `occ-community-health-worker-*.png`, `occ-dental-assistant-*.png` (hub + mobile + lessons)

---

## 4. Working routes

- All **19** `/allied/{slug}` marketing occupation hubs on production (**200**, stable final URL).
- `/allied/allied-health`, `/allied`, `/es/allied/allied-health`.
- `/allied/{slug}/lessons` — **200** for tested slugs (see §2).
- Sample in-app style URL `/us/allied/allied-health/flashcards` — **200**.

---

## 5. Broken routes

- **None observed on production** for the Allied matrix above.
- **Local dev:** intermittent `ECONNREFUSED` / `ERR_EMPTY_RESPONSE` when hammering sequential Playwright loads; **second `next dev` instance** attempted exit with “Another next dev server is already running” — **environment/process** issue, not an app route bug.

---

## 6. RN fallback issues

- **No automatic redirect** from `/allied/{slug}` to RN/NCLEX marketing routes (curl effective URL matches `/allied/{slug}`).
- **Global chrome / cross-links:** Hub snapshot and HTML still surface **RN / NCLEX / Rex-PN** in footer and “Browse RN, PN, and NP hubs” (expected cross-sell but **high salience** on an “Allied health” page). Footer snapshot includes **“Study Nursing in Your Language”** — **nursing-default framing** on Allied surfaces.
- **Severity:** Medium for learner emotional goal (“this is my allied home”), Low for functional correctness.

---

## 7. Placeholder copy leaks

- **No visible** `Builder Title`, `Selection Label`, or `Pool Preset` strings detected in **PTA** HTML text scan.
- **Script/i18n payloads** contain many `common.*` key fragments (normal for Next RSC payload); **not flagged** as user-visible leaks without DOM-level confirmation.
- **Français (partial)** language control on hub suggests **incomplete locale** (product-level, not strictly placeholder).

---

## 8. Capitalization inconsistencies

| Location | Example | Notes |
|----------|---------|--------|
| Header / footer nav | “Practice Questions” (title case) | Snapshot refs `e78`, `e186` |
| Occupation hub study cards | “Practice questions”, “Practice exams” | `allied-health-pathway-hub.tsx` StudyCard titles |
| CAT wording | “Adaptive readiness” + “CAT-style practice” | “CAT” not spelled out as “Adaptive CAT Exam” |

**Severity:** Low — polish/readability for allied learners and QA doc consistency.

---

## 9. Occupation naming inconsistencies

- **Card vs slug:** Labels like “EMT certification”, “Paramedic certification”, “Physical therapist assistant” map to short slugs `emt`, `paramedic`, `pta` — **intentional** marketing vs URL.
- **Potential learner confusion:** “Medical imaging” (`imaging`) vs “Radiography and medical imaging” (`radiography`) vs “Ultrasound and sonography” (`sonography`) — **three imaging-adjacent** tracks; copy tries to differentiate but **visual scan** may still feel crowded.
- **Body copy casing:** Mixed sentence-case in blurbs (“pathway-scoped allied” vs “Allied pathway scope.”) — minor editorial inconsistency.

---

## 10. Design-quality issues

| Severity | Route / surface | Observation | Suggestion |
|----------|-----------------|---------------|------------|
| Medium | `/allied/allied-health` + footers | Strong semantic cards and multi-hue accents on hub; **footer reverts to nursing-global** (“Study Nursing…”, NCLEX block) | Add **allied-specific footer variant** or soften nursing block below the fold for `/allied/*`. |
| Low | Global header | Premium layout; **“Start free account — nursing and healthcare exam prep”** aria-label on Allied | Allied-aware aria-label when `pathname` starts with `/allied`. |
| Low | Study modes row | Good use of study-card pattern; **5 columns** on `xl` may feel dense on smaller laptops | Responsive test at 1280px (done via 1440 desktop shots). |
| Info | `/signup` | Clean, trustworthy **Create Account** shell | Copy says “exam path” — OK; ensure **Allied** feels first-class in **step copy** after hub CTA. |

---

## 11. Mobile issues

- **Hub + occupation hubs:** Full-page mobile screenshots captured (`prod-hub-global-mobile.png`, `prod-occ-*-hub-mobile.png`). No **automation-detected** overflow failures; manual spot-check: **long occupation titles** (e.g. “Mental health and addictions worker”) — watch line breaks in cards.
- **Nav:** Standard header **Log In / Start Free** + hamburger — acceptable; **footer height** on mobile is large (marketing site pattern).
- **CTAs:** “Open study hub” / “Lessons for this track” duplicate per card — **clear** but repetitive on small screens.

---

## 12. Auth / onboarding issues

- **Signup** (`/signup`): Screenshot `prod-signup-desktop.png` — **“Pick your country and exam path to personalize content.”** Generic, not allied-specific; acceptable entry from hub **Create account** (`e69`).
- **QA account:** Per spec, use e.g. `allied.qa.student+202605071710@nursenest.test` — **not executed** on production (avoid real signup noise); **method:** email+password flow on `/signup` then verify email if enabled in env.
- **Persistence:** Not verified end-to-end (no session secret on local dev without `.env`).

---

## 13. Navigation issues

- **Client-side Next.js links:** One **MCP `browser_click`** on “Physical therapist assistant” (`ref: e25`) left the snapshot URL on `/allied/allied-health` (focus state only). **Remediation for QA automation:** prefer **`browser_navigate`** to target URLs after href extraction, or wait for `networkidle` / URL assertion.
- **Lessons URL:** `/allied/{slug}/lessons` stays on marketing **allied** path (not `/us/...` in curl effective URL on prod) — **document behavior** for testers expecting country segment.

---

## 14. Highest-priority fixes

1. **Footer / global language band:** Replace or contextualize **“Study Nursing in Your Language”** on `/allied/*` with **healthcare / allied-inclusive** wording (Medium, learner emotional impact).
2. **Header aria-label:** Stop defaulting **“nursing and healthcare exam prep”** on Allied-only journeys (Low–Medium, accessibility + first impression).
3. **Capitalization pass:** Align **Practice Questions / Practice questions** and **Practice Tests vs Practice exams** vocabulary across nav, hubs, and app shells (Low).
4. **Stabilize local QA:** Document single **`next dev`** instance + `AUTH_SECRET` or `NN_SKIP_DEV_AUTH_SECRET=1` for Allied QA (ops).

---

## 15. Likely responsible files (grep-identified)

| Area | File(s) |
|------|---------|
| Allied hub + study cards | `nursenest-core/src/components/marketing/allied-health-pathway-hub.tsx`, `allied-health-hub-content.tsx` |
| Global hub path | `nursenest-core/src/lib/allied/allied-global-hub-path.ts` (`ALLIED_GLOBAL_HUB_PATH = /allied/allied-health`) |
| Profession registry | `nursenest-core/src/lib/allied/allied-professions-registry.ts` |
| Marketing route | `nursenest-core/src/app/(marketing)/(default)/allied/[career]/page.tsx`, `allied/allied-health/page.tsx` |
| Allied lessons redirect doc | `nursenest-core/src/app/(marketing)/(default)/allied/[career]/lessons/page.tsx` |
| Header CTA aria-label | `nursenest-core/src/components/layout/site-header.tsx`, `components/auth/marketing-header-auth.tsx` |

---

## 16. Recommended implementation prompts

1. “On `pathname` matching `/allied` or `/es/allied` (and other locale prefixes), **replace footer heading** that says ‘Study Nursing in Your Language’ with a **neutral healthcare** variant; keep RN hubs unchanged.”
2. “Add `usePathname()`-aware **aria-label** for ‘Start free’ CTA: if allied marketing route, say **healthcare exam prep** without centering ‘nursing’.”
3. “Audit **Practice questions / Practice Questions / Practice exams / Practice Tests** across `allied-health-pathway-hub`, marketing nav, and learner shells; pick **one title-case product lexicon** and update i18n keys.”
4. “Add **Playwright marketing smoke** for `/allied/allied-health`: assert 19 occupation `href`s, click-through via `page.goto` href, assert **no** redirect to `/nclex` (or RN default), and snapshot **study modes** section present.”
5. “Optional: **separate imaging** hub copy to reduce perceived duplication between Medical imaging, Radiography and medical imaging, and Ultrasound and sonography cards.”

---

## Metrics

| Metric | Value |
|--------|-------|
| Occupation cards on hub | **19** |
| Production HTTP checks (`/allied/{slug}`) | **19 / 19** pass (200, URL stable) |
| Production screenshots (`prod-*`) | **63** PNGs (hub 2 + root 1 + ES 1 + signup 1 + flashcards sample 1 + 19×3) |
| Local partial screenshots | **8** PNGs |
| Browser MCP sessions | Production hub **navigate + snapshot**; **1** click attempt documented |
| Blockers | Local dev instability; truthpack JSON missing in clone |

---

## Environment notes

- **Dev:** `npm run dev:next` from `nursenest-core/` requires **`AUTH_SECRET`** or `NN_SKIP_DEV_AUTH_SECRET=1`. Logged **MissingSecret** warnings when secret absent.
- **Production base for this report:** `https://www.nursenest.ca`
- **Browser MCP:** `http://127.0.0.1:*` **not reachable** from remote IDE browser; **`https://www.nursenest.ca`** used successfully.

---

## QA account (spec)

- **Email pattern:** `allied.qa.student+202605071710@nursenest.test`  
- **Method:** `/signup` → complete country/exam path → avoid real billing (use free tier / cancel before payment if flow requires card). **Not run** against production in this pass.
