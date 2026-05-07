# NP learner journey — browser QA report

**Run ID:** `np-journey-1778172991`  
**Environment:** Next.js dev (`http://127.0.0.1:3000`), repo `nursenest-core/nursenest-core`  
**Browser:** Cursor IDE browser (cursor-ide-browser MCP)  
**Date:** 2026-05-07  

## Executive Summary

| Metric | Value |
|--------|--------|
| **Routes exercised (unique URLs visited or validated)** | ~18 |
| **In-browser screenshots captured (MCP)** | 4 filenames (see §6 — not written into this Linux workspace) |
| **Overall verdict** | **Needs polish** (auth-gated learner surfaces not reached; several marketing/NP issues) |
| **Ship-blocker candidates** | Signup **disabled until Cloudflare Turnstile** token when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set; signup **i18n/placeholder leaks** on name fields; **US + NP** signup still offers **Canada-centric RN/PRE-NP exam labels** in the exam-focus dropdown |

**Top 5 must-fix**

1. **Signup blocked without human Turnstile** — `Create Account` stays `disabled` when `turnstileGateActive` until `captchaToken` is set (`signup-form.tsx`). Blocks automated QA and any user without completing the widget.
2. **Signup accessibility shows literal placeholders** — First/last fields expose `name: Placeholder First Name` / `Placeholder Last Name` (translation or fallback for `pages.signup.placeholderFirstName` / last name equivalent is wrong in the loaded marketing locale bundle).
3. **US country + NP pathway + exam dropdown mismatch** — After choosing **United States** and **NP**, the exam combobox still lists **RN entry-to-practice (Canada)**, **REx-PN**, **CNPLE / NP (Canada)** only (no US FNP/AANP-style row in the control). Allows inconsistent **US + CNPLE** pairing — specialty/region leakage risk.
4. **Marketing NP hub document title** — `/en/np/fnp`, `/en/np/agpcnp`, etc. keep the **generic global** `<title>` (“Canada-First… RN, RPN, NP…”) instead of pathway SEO titles defined in `exam-pathways-data-segment-c.ts` (e.g. FNP-specific title).
5. **Learner practice-tests breadcrumb copy** — Code uses **“Practice tests”** / **“Back to practice tests”** (sentence case) vs product expectation **“Practice Tests”** (`practice-tests/[id]/results/page.tsx`, `cat-insights/page.tsx`).

**Truthpack:** `.vibecheck/truthpack/` was **not present** in this workspace clone; product/route facts above are from live browser observation and source grep only.

---

## 1. Test account used (email + method of creation)

- **Email prepared:** `np.qa.student+1778172991@nursenest.test`  
- **Username prepared:** `npqastudent1778172991`  
- **Account created:** **No** — `Create Account` remained **disabled** after filling all visible fields. **Root cause:** Turnstile gate (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` present → `disabled={… || (turnstileGateActive && !captchaToken)}` in `signup-form.tsx`). **No QA bypass** was used (none applied in this session).

## 2. Auth / entitlement method used

- **None (not signed in).**  
- **`/app`** shows **“Sign in to access the learner app.”** — expected for guests.  
- No staff seed, env bypass, or test entitlement flags were applied (read-only QA).

## 3. NP pathway / specialty selected as primary (intent)

- **Intended primary:** US **NP** with **CNPLE / NP (Canada)** selected only to exercise dropdown (acknowledged mismatch: **US country + Canadian NP exam** is inconsistent and flagged).

## 4. NP specialty routes spot-checked

| Specialty | URL | Pass/Fail | Notes |
|-----------|-----|-----------|--------|
| FNP | `http://127.0.0.1:3000/en/np/fnp` | **Partial** | Loads; snapshot mostly shell/footer; full-page screenshot showed **skeleton placeholders** during load; **generic document title** |
| FNP lessons | `http://127.0.0.1:3000/en/np/fnp/lessons` | **Partial** | 200 OK; server HTML contains many **“NCLEX”** tokens (grep count high) on NP surface — review RN term leakage |
| FNP CAT marketing | `http://127.0.0.1:3000/en/np/fnp/cat` | **Fail (SEO)** | **Empty `<title>`** in browser snapshot |
| AGPCNP | `http://127.0.0.1:3000/en/np/agpcnp` | **Partial** | Same generic global `<title>` as other US NP hubs |
| PMHNP | *Not reloaded after transient error* | **Skipped** | Same pattern expected as AGPCNP; not revisited after `chrome-error` blip |
| WHNP | *Skipped* | **Skipped** | Time / server stall |
| PNP-PC | *Skipped* | **Skipped** | Time / server stall |
| CNPLE (Canada hub) | `http://127.0.0.1:3000/canada/np/cnple` | **Pass (content)** | Strong NP-specific H1 and body; nav shows **Practice Exam** (not “Practice Tests”) |

## 5. Routes tested (full list)

1. `http://127.0.0.1:3000/` (home, desktop + mobile viewport)  
2. `http://127.0.0.1:3000/blog` (arrived once from an errant primary click — see findings)  
3. `http://127.0.0.1:3000/signup`  
4. `http://127.0.0.1:3000/app` (guest dashboard gate)  
5. `http://127.0.0.1:3000/np/fnp` (minimal a11y tree — likely locale-less redirect edge)  
6. `http://127.0.0.1:3000/en/np/fnp`  
7. `http://127.0.0.1:3000/en/np/fnp/lessons`  
8. `http://127.0.0.1:3000/en/np/fnp/cat`  
9. `http://127.0.0.1:3000/en/np/agpcnp`  
10. `http://127.0.0.1:3000/canada/np/cnple`  
11. `http://127.0.0.1:3000/pricing` (console history only — prior navigation in session)  

*(Attempted `http://127.0.0.1:3000/faq` and `http://127.0.0.1:3000/en/new-grad` hit `chrome-error://chromewebdata/` during a brief server stall; browser later recovered to `/`.)*

## 6. Screenshots saved (paths, by phase)

**Important:** `browser_take_screenshot` **saved files on the Cursor host** under paths like  
`/var/folders/ll/jmx0x4pn2d9dqds31bb3jfl40000gn/T/cursor/screenshots/`  
They **did not appear** under `/root/nursenest-core/qa-reports/np-journey-1778172991/screenshots/` on this Linux workspace (directory remains empty).

| Phase | MCP filename (on Cursor host) |
|-------|-------------------------------|
| Home / marketing | `np-qa-01-homepage-desktop.png` |
| Misc | `np-qa-03-en-np-fnp-hub.png` (fullPage) |
| Mobile | `np-qa-12-homepage-mobile-375.png` (viewport 375×812) |

**Recommendation:** Configure MCP screenshot output to mirror the workspace path, or copy artifacts post-run from the host `T/cursor/screenshots/` folder.

## 7. Passed checks

- Dev server initially **Ready** on port **3000**; marketing home and NP routes returned **200**.  
- **`/canada/np/cnple`** shows coherent **NP Canada** positioning, breadcrumbs, and tool list (**Lessons, Flashcards, Practice Questions, Practice Exam**, CAT mentioned in copy).  
- **`/app`** correctly prompts **Sign in** for guests (no false “logged-in” shell).  
- **Global marketing** homepage exposes **NP** pathway card and **Practice Questions** nav label consistent with title case in several places.  
- **Mobile viewport** (375×812): homepage structure and primary CTAs still present in snapshot (hamburger + **Start Free** + hero).

## 8. Failed checks

- **Complete signup + onboarding** — blocked by **Turnstile-disabled** submit button.  
- **Authenticated NP dashboard** and **in-app** Lessons / Flashcards / Practice Questions / Practice Tests / CAT / Report card — **not testable** without session.  
- **`/en/np/fnp/cat`** — **missing page title**.  
- **US NP marketing hubs** — **generic** document title vs pathway-specific SEO from catalog.  
- **Single automated `click` on “Start free”** once landed on **`/blog`** (see §14 — likely stacking/ref mismatch; needs human repro).

## 9. Broken routes

- None returned **5xx** in this pass.  
- **`/np/fnp`** (without locale) produced an **almost empty a11y snapshot** (0 interactive nodes) — treat as **degraded / unclear UX** for direct hits vs **`/en/np/fnp`**.

## 10. Placeholder / i18n leaks (route + literal + evidence)

| Route | Literal / symptom | Screenshot / evidence |
|-------|---------------------|------------------------|
| `/signup` | Accessible name **“Placeholder First Name”** | Browser snapshot (`textbox` `name`) |
| `/signup` | Accessible name **“Placeholder Last Name”** | Browser snapshot (`textbox` `name`) |
| `/en/np/fnp` (load) | **Skeleton** gray bars (loading placeholders) | `np-qa-03-en-np-fnp-hub.png` (full-page) |
| `/en/np/fnp/lessons` (HTML) | Multiple **“placeholder”** substrings in streamed HTML | `curl` + `rg` (8 hits) — verify not user-visible literals |

**Likely files:** `src/components/auth/signup-form.tsx` (uses `t("pages.signup.placeholderFirstName")`), compiled marketing locale under `public/i18n/...` (not readable here due to ignore rules).

## 11. Capitalization / title inconsistencies

| Route | Current | Recommended |
|-------|---------|-------------|
| `/canada/np/cnple` nav | **Practice Exam** | Align product language: **Practice Tests** if that is canonical learner naming, or document intentional regional label |
| Learner practice tests (source) | **“Practice tests”**, **“Back to practice tests”** | **Practice Tests**, **Back to Practice Tests** |
| Homepage feature pills | **ADAPTIVE CAT SESSIONS** (all caps) | Mixed case for readability: **Adaptive CAT sessions** or **Adaptive CAT** per style guide |
| `/signup` exam dropdown (US+NP) | **RN entry-to-practice (Canada)** | US-appropriate NP exam labels (e.g. FNP / ANCC-AANP scopes) |

## 12. RN/RPN copy leakage into NP (route + evidence)

| Route | Evidence |
|-------|-----------|
| `/en/np/fnp/lessons` (server HTML) | `rg` showed **349** matches of **“NCLEX”** and **300** of **“Lessons”** in one HTML response — many may be boilerplate/footer; still **risk** of RN-centric **NCLEX** framing on NP specialty URL — audit rendered above-the-fold body |
| Global footer (all marketing) | **“NCLEX and global licensing prep for RN, PN/LVN, NP…”** — acceptable globally, but **dominates** NP-only mental model on NP hubs if main content is thin |

## 13. Specialty leakage / wrong specialty context

| Issue | Where |
|-------|--------|
| **US + NP** signup can select **CNPLE / NP (Canada)** while country is **United States** | `/signup` comboboxes |
| Exam dropdown options remain **Canada RN / REx-PN** flavored even when country **US** | `/signup` |

## 14. Design-quality issues (route + severity + fix + screenshot)

| Route | Severity | Issue | Recommended fix | Screenshot |
|-------|----------|-------|-----------------|------------|
| `/en/np/fnp` | **Medium** | Long-lived **skeleton** state in full-page capture | Improve perceived performance / streaming for hub body | `np-qa-03-en-np-fnp-hub.png` |
| `/signup` | **High** | Placeholder-labeled fields feel **broken / non-premium** | Fix i18n strings + `aria-label` tied to visible labels | *(snapshot only)* |
| `/` (mobile) | **Low** | Dense **NCLEX-RN** editorial cards in lower homepage | For NP acquisition campaigns, consider **NP-first** editorial samples | `np-qa-12-homepage-mobile-375.png` |
| Header primary CTA | **Medium** | One automated click hit **`/blog`** instead of signup | Audit **z-index / overlap** between header CTAs and underlying links; verify in Chrome device toolbar | N/A |

## 15. Mobile issues

- Viewport **375×812**: homepage **usable**; **hamburger** + **Start Free** visible in snapshot.  
- Not enough coverage of **signed-in** sticky learners bars (blocked by auth).

## 16. Console errors (representative)

Repeated **Chrome “preloaded but not used”** warnings/errors for Next chunks and CSS on `/`, `/signup`, `/blog` (development noise).  
React DevTools suggestion (warning).  
**CursorBrowser** native dialog override (warning).  
No uncaught **application** `Error` strings observed in the exported console JSON for signup beyond preload noise.

## 17. Highest-priority fixes (ranked)

1. Provide **dev/QA Turnstile bypass** or test keys + documented `NEXT_PUBLIC_TURNSTILE_SITE_KEY` unset for local E2E, **or** allow submit when enforcement is off server-side **and** client gate matches `isTurnstileEnforced()`.  
2. Fix **`pages.signup.placeholderFirstName`** / last-name marketing strings — remove **“Placeholder …”** literals.  
3. Rebuild **`signupExamFocusOptions(country, t)`** so **US + NP** shows **US NP board / FNP** options, not only Canadian RN/REx-PN/CNPLE set.  
4. Set **per-pathway `<title>`** (and meta) on `/[locale]/np/[examCode]` marketing layout using `seoTitle` from pathway definitions.  
5. Normalize **Practice Tests** capitalization in learner **practice-tests** pages and breadcrumbs.

## 18. Exact files likely responsible (grep-backed)

- `nursenest-core/src/components/auth/signup-form.tsx` — Turnstile gate, placeholders, country/exam state.  
- `nursenest-core/src/lib/captcha/verify-turnstile.ts` + `src/app/api/signup/route.ts` — server enforcement parity.  
- `nursenest-core/src/lib/exam-pathways/exam-pathways-data-segment-c.ts` — NP SEO titles (source of truth for expected titles).  
- `nursenest-core/src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/layout.tsx` + related **metadata** exports — document title for NP hubs.  
- `nursenest-core/src/app/(student)/app/(learner)/practice-tests/[id]/results/page.tsx` — “Practice tests” breadcrumb label.  
- `nursenest-core/src/app/(student)/app/(learner)/practice-tests/cat-insights/page.tsx` — “Back to practice tests”.  
- `nursenest-core/src/components/layout/site-header.tsx` — `guestMarketingSignupHref` wiring (verify vs mis-click to blog).  
- `nursenest-core/src/app/(marketing)/(default)/[locale]/np/page.tsx` — `/np` redirect targets (`fnp` vs `cnple`).

## 19. Recommended next implementation prompts (ready to hand off)

1. **“Align signup exam-focus options with `{country, roleTrack}`”** — When `country === "US"` and pathway **NP**, replace Canada-default **nclex_rn / rex_pn / np_board** labels with US NP certification rows; **disable incompatible pairs** (e.g. block **US + CNPLE** or auto-switch country to CA). Files: `signup-form.tsx`, exam option builder used by `signupExamFocusOptions`.  
2. **“Fix signup field i18n: remove Placeholder First/Last Name literals”** — Audit `pages.signup.placeholderFirstName` / last name in **compiled** `public/i18n` EN marketing bundle; ensure `aria-labelledby` uses visible labels. Files: signup form + i18n JSON + compile pipeline.  
3. **“Marketing NP hub metadata”** — In `[locale]/[slug]/[examCode]/layout.tsx` (or page `generateMetadata`), set `title`/`description` from `getExamPathwayById` SEO fields so `/en/np/fnp` ≠ global homepage title; fix **empty title** on `/cat`.  
4. **“Practice Tests title case audit”** — Ripgrep `practice tests` under `src/app/(student)/app/(learner)/practice-tests/` and `src/components`; standardize to **Practice Tests** in UI; keep URLs unchanged.  
5. **“QA automation: Turnstile”** — Add `docs/` note: for Playwright/Cursor browser QA, use **test sitekey** + always-pass widget **or** env flag `TURNSTILE_ENFORCE=0` in dev only (server + client must agree). Reference `isTurnstileEnforced()` vs `turnstileGateActive`.  

---

## Dev server / phase coverage notes

- **Dev server:** Responsive for most of the session; **one interval** where `curl` to `127.0.0.1:3000` **timed out** (0 bytes) and browser showed **`chrome-error://chromewebdata/`** for new navigations; the server **later recovered** (browser could load `/` again). **Did not stay perfectly stable end-to-end.**  
- **Phases skipped or partial:**  
  - **Phase 1** completion (post-account onboarding) — **Turnstile**.  
  - **Phases 2–8** (authenticated learner) — **no session**.  
  - **Phase 9** — WHNP / PNP-PC / PMHNP not all revisited after error.  
  - **Phase 10** — Full matrix not clicked sequentially (blog/pricing seen via console/session; FAQ/new-grad hit transient error).  
  - **Phase 12** — **Homepage only** on mobile; NP hubs not re-tested at mobile width after resize.

---

*End of report.*
