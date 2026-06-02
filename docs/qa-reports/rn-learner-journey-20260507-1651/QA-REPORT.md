# RN learner journey — browser QA report

**Run ID:** `rn-learner-journey-20260507-1651`  
**When:** 2026-05-07 (UTC folder timestamp)  
**App:** Next.js dev server at `http://127.0.0.1:3000` (`npm run dev:next` from `nursenest-core/`, Next 16.2.1 Turbopack)  
**QA method:** Cursor IDE browser MCP (navigate, snapshot, screenshot) + `curl` spot-checks + codebase grep for copy/routes.

---

## 1. Test account used

| Field | Value |
|--------|--------|
| **Email** | `rn.qa.student+1746635600@nursenest.test` |
| **Username** | `rnaqa1746635600` |
| **Password** | *(not stored in repo; session-only test string used in browser)* |

**Account creation:** **Not completed.** After filling all required signup fields, the **Create Account** control remained **`disabled`** in the accessibility snapshot (see §6 / §12). No learner session was established for Phases 2–8 inside `/app/*`.

---

## 2. Auth / entitlement method

- **Intended:** Public marketing signup at `/signup` → credentials → onboarding → `/app` (per Playwright docs: `tests/e2e/rn-student-signup-flow.spec.ts`).
- **Actual:** **Blocked at signup submit affordance** (button stayed disabled with a complete valid form). Per `signup-form.tsx`, the button is disabled when `pending || !clientReady || (turnstileGateActive && !captchaToken)`. E2E docs note the same gate when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set (`rn-student-signup-flow.spec.ts`).
- **No staff bypass** was used (none documented for this run beyond normal signup).

---

## 3. Routes tested

| Route | Method | Result |
|--------|--------|--------|
| `/` | Browser | 200; homepage hero, pathway region, marketing nav |
| `/signup` | Browser | 200; form visible; Create Account stayed disabled after full fill |
| `/pricing` | Browser + curl | 200 |
| `/blog` | Browser + curl | 200 |
| `/faq` | curl | 200 |
| `/tools` | curl | 200 |
| `/lessons` | curl | 200 |
| `/questions` | curl | 200 |
| `/login` | curl | 200 |
| `/app` | curl `-m 8` | **Timeout** (no HTTP code within 8s; likely heavy SSR/auth redirect chain) |
| `/app/lessons` | curl `-m 8` | **Timeout** |
| `/app/flashcards` | curl `-m 8` | **200** |
| `/app/practice-tests` | curl `-m 8` | **200** |
| `/us/new-grad` | curl `-m 8` | **Timeout** (slow SSR or redirect) |
| `/allied/mlt` | curl `-m 8` | **Timeout** |
| `/pre-nursing` | curl `-m 8` | **Timeout** (route exists under marketing; treat as **slow TTFB** under 8s cap) |

**Truthpack:** `.vibecheck/truthpack/ui-pages.json` and `routes.json` were **not present** in this workspace clone (consistent with `docs/SECURITY_AND_PRIVACY_AUDIT.md` and other internal docs). Routes above were taken from **in-repo app structure** (`src/app/...`) and verified with live HTTP/browser where noted—not from truthpack.

---

## 4. Screenshot paths list

| Intended path (repo) | On-disk in this workspace | Notes |
|----------------------|---------------------------|--------|
| `docs/qa-reports/rn-learner-journey-20260507-1651/homepage-pre-signup.png` | **Not present** on Linux workspace | MCP tool reported save under IDE host path (`/var/folders/.../cursor/screenshots/...`) |
| `docs/qa-reports/rn-learner-journey-20260507-1651/signup.png` | **Not present** | Same |
| `docs/qa-reports/rn-learner-journey-20260507-1651/pricing.png` | **Not present** | Same |
| `docs/qa-reports/rn-learner-journey-20260507-1651/homepage-pre-signup-reference.png` | **Yes** | Copied from prior report for evidence |
| `docs/qa-reports/rn-learner-journey-20260507-1651/signup-form-reference.png` | **Yes** | Copied from prior report for evidence |
| `docs/qa-reports/rn-learner-journey-20260507-1651/dev-server.log` | **Yes** | Next dev server stdout |

**Recommendation:** Re-run screenshots from an environment where MCP writes into the repo filesystem, or manually copy from the Cursor screenshots directory.

---

## 5. Passed checks

- **Env (with dev session exports):** `DATABASE_URL`, `DIRECT_URL` present in `nursenest-core/.env.local`; `AUTH_SECRET` / `NEXTAUTH_SECRET` / `NEXTAUTH_URL` supplied for the `dev:next` process so `scripts/check-required-env.mjs` passed (see `dev-server.log`).
- **Dev server:** Next listens on **port 3000** (PID visible in log as `next-server`).
- **Marketing shell:** Homepage, signup, pricing, blog load without 5xx in sampled navigation.
- **Public marketing routes (curl):** `/`, `/signup`, `/pricing`, `/blog`, `/faq`, `/tools`, `/lessons`, `/questions`, `/login` returned **200**.
- **Semantic / visual (homepage):** Hero uses brand blues, checklist green trust line, pathway section—not a flat gray-only layout (see reference screenshot).

---

## 6. Failed checks

| Phase | Severity | What failed |
|-------|----------|--------------|
| **Phase 1** (signup → onboarding → dashboard) | **Blocker** | Could not submit signup; **Create Account** remained **disabled** with all fields filled (Canada, RN, NCLEX-RN Canada track). |
| **Phases 2–8** (authenticated learner) | **Blocker** | No session; `/app` and `/app/lessons` **timed out** under 8s `curl` (may be slow SSR or redirect—still a QA risk). |
| **Phase 6** (Practice Tests builder copy) | **Not executed in-browser** | Requires authenticated `/app/practice-tests` session. |
| **Phase 7** (CAT) | **Not executed in-browser** | Requires authenticated session + entitlement path. |
| **Phase 9** (full nav matrix) | **Partial** | Only subset verified in browser + curl; see §9 table. |

---

## 7. Broken routes

- None of the **sampled marketing URLs** returned 4xx/5xx.
- **`/app` and `/app/lessons`:** Not “broken” status-code-wise in this check—they **did not complete** within **8s** from this host (`curl` timeout). Treat as **performance / SSR / redirect risk** pending investigation with longer timeout and `curl -L -w`.

---

## 8. Placeholder / i18n leaks

| Location | Evidence | Likely cause |
|----------|----------|--------------|
| `/signup` — first/last name fields | A11y name and placeholder: **“Placeholder First Name”**, **“Placeholder Last Name”** | `t("pages.signup.placeholderFirstName")` / `placeholderLastName` resolving to **missing marketing message** (falls through to key-like text). See `signup-form.tsx` placeholders. |
| Country **US** + exam dropdown | After selecting **United States**, exam focus options still showed **Canadian** labels (e.g. “RN entry-to-practice (Canada)”) | **Country/exam option reconciliation** bug or stale labels (`signup-exam-focus-options` / `reconcileExamFocusForCountry`)—flag for product/engineering. |

---

## 9. Capitalization inconsistencies

| Route / file | Screenshot / source | Current text | Recommended fix |
|--------------|---------------------|--------------|-----------------|
| Learner CAT / practice flows | `practice-test-results-static.tsx` | **“Practice tests home”** | Use **“Practice Tests”** for product noun consistency (title case, plural Tests). |
| CAT / pathway clients | `pathway-cat-session-start-client.tsx`, `cat-direct-launch-client.tsx` | Mix of **“Practice Tests”**, **“Practice Tests Hub”**, **“Return to Practice Tests”** | Keep **“Practice Tests”** as canonical; avoid lowercase **“tests”** in user-visible strings. |
| Marketing / RN hub | Homepage snapshot | **“WRITTEN FOR YOUR PATHWAY”** etc. (all-caps chips) | Decide design system: sentence case vs all-caps; align with editorial guidelines. |
| Footer / support (homepage snapshot) | `Email supportPlease allow…` (missing space in a11y name) | Tight concatenation in nav/footer markup | Add space or punctuation for screen readers. |

---

## 10. Design issues (semantic / hierarchy)

| Severity | Surface | Issue | Suggestion |
|----------|---------|-------|------------|
| Low | Homepage | Strong hierarchy (H1, dual CTAs, pathway band) | Keep; ensure secondary actions stay visually secondary on mobile. |
| Medium | Homepage / pricing | **Developer-ish overlay** in snapshot (e.g. `.min-h-0div`, `.nn-marketing-captionp`) | Ensure dev-only overlays never ship in production builds; guard with `NODE_ENV` or remove class-name debug badges. |
| Medium | Signup | **Placeholder strings as visible labels** | Fix i18n (§8); improves trust and “premium” feel. |
| Low | Pricing | Tier switcher complexity | OK for pricing; confirm mobile tap targets (not fully screenshot-tested this run). |

---

## 11. Mobile issues

- **Not systematically tested** (browser resize to mobile viewport was not completed after signup blocker).
- **Risk:** Marketing header uses **Log In / Start Free + region + hamburger**—needs explicit 320px snapshot pass (Phase 11 follow-up).

---

## 12. Console errors (browser)

From **cursor-ide-browser** `browser_console_messages` on `/signup`:

- **Warnings:** Cursor native dialog override message; React DevTools promo.
- **Errors (noise):** Multiple **“preloaded using link preload but not used within a few seconds”** messages for Next chunks/CSS. Typical dev-mode preload warnings; monitor if present in production.

No uncaught **application** JS errors were surfaced in the sampled console output.

---

## 13. Highest-priority fixes

1. **Unblock signup for QA and users:** Verify `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` pairing in local and CI; document unset for Playwright (`rn-student-signup-flow.spec.ts`). If gate is off but button still disabled, debug **`clientReady`** / hydration.
2. **Fix signup placeholder i18n** for `pages.signup.placeholderFirstName` / `placeholderLastName` in marketing message bundles so UI never shows “Placeholder …”.
3. **US signup exam labels:** Reconcile `signupExamFocusOptions` when `country === "US"` so labels match selected country.
4. **Standardize “Practice Tests”** vs **“Practice tests”** in learner UI (`practice-test-results-static.tsx` and related).
5. **`/app` cold-load latency:** Profile why `curl` exceeds 8s; ensure auth redirect does not spin.

---

## 14. Likely responsible files

| Topic | Files |
|--------|--------|
| Signup gate / Turnstile | `src/components/auth/signup-form.tsx`, `src/components/auth/turnstile-signup.tsx`, `src/lib/captcha/verify-turnstile.ts`, `src/app/api/signup/route.ts` |
| Signup placeholders | Marketing shards for `pages.signup.*` (search under `messages/` / marketing i18n pipeline per `docs/i18n-architecture.md`) + `loadMarketingMessages` |
| US/CA exam labels | `src/lib/marketing/signup-exam-focus-options.ts` |
| Practice Tests copy | `src/components/student/practice-test-results-static.tsx`, `src/components/student/pathway-cat-session-start-client.tsx`, `src/components/student/cat-direct-launch-client.tsx` |
| Learner routes | `src/app/(student)/app/(learner)/**` |

---

## 15. Recommended next implementation prompts

1. **“Fix marketing i18n keys `pages.signup.placeholderFirstName` and `pages.signup.placeholderLastName` so signup placeholders show human copy in EN (and fallbacks never leak).”**
2. **“Reproduce `SignupForm` Create Account disabled state with Turnstile off; if still broken, fix `clientReady` / Suspense interaction.”**
3. **“When signup country is US, `signupExamFocusOptions` must show US-appropriate NCLEX labels; add unit tests for label/value pairs.”**
4. **“Audit learner strings for ‘Practice tests’ vs ‘Practice Tests’; align to title case ‘Practice Tests’ and add a lint or `audit:ui-copy` rule.”**
5. **“Profile `/app` and `/app/lessons` TTFB under anonymous vs authed session; fix redirect chain or data fetching that exceeds N seconds.”**

---

## Metrics (this run)

| Metric | Value |
|--------|--------|
| Marketing pages loaded in browser | 4+ (`/`, `/signup`, `/pricing`, `/blog`) |
| Successful signup completions | **0** |
| Authenticated learner deep dives | **0** |
| `curl` 200 samples (public) | 10 routes |
| `curl` timeouts (`-m 8`) | `/app`, `/app/lessons` |

---

## Environment precheck (hard requirement)

| Variable | In-shell / file check | Notes |
|----------|------------------------|--------|
| `DATABASE_URL` | **Present** (`nursenest-core/.env.local`) | Per `grep` of keys only |
| `DIRECT_URL` | **Present** (same) | |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | **Absent** in `.env.local`; **set for dev process** when starting `dev:next` | Required for `npm run dev:next` per `scripts/assert-local-auth-secret.mjs` |
| `NEXTAUTH_URL` | **Unset** in `.env.local`; **set** for dev session to `http://localhost:3000` | Also documented as `AUTH_URL` alias in `docs/environment-reference.md` |
| E2E / learner QA extras | See `playwright.env.ts`, `tests/e2e/TEST_LAYERS.md` (`E2E_PAID_*`, `BASE_URL`, etc.) | Not all required for smoke |

Canonical learner QA env guidance: `nursenest-core/docs/environment-reference.md`.

---

*End of report.*
