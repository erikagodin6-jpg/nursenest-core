# Authenticated runtime hardening — 2026-05-10

Executive summary: readiness probing defaults to **guest** semantics (`APP_READY_MODE=guest`) so `/app` may **302/307** to login without failing `wait-for-app-ready`. **Authenticated** mode adds cookie/storageState injection, **`GET /api/auth/session`** user validation (stale-session signal), optional **`APP_READY_ENTITLEMENT_URL`**, and optional redirect-chain tracing for loops. Playwright pre-nursing config and **git-root** `docs/runtime/playwright-local-workflow.md` document **exit 143** (`SIGTERM`), port collision, and clarify **`PLAYWRIGHT_SKIP_WEB_SERVER`** vs **`PLAYWRIGHT_NO_REUSE_WEB_SERVER`**. Authenticated visual baseline adds **CAT practice** (desktop × Ocean/Blossom/Midnight) plus **mobile** dashboard (Blossom/Midnight) and CAT (Ocean); first-time capture still needs local `--update-snapshots` when credentials exist.

## Architecture (readiness)

| Layer | Behavior |
|--------|----------|
| `scripts/qa/wait-for-app-ready.mjs` | **guest**: public paths → **200**; prefixes in `APP_READY_PROTECTED_PREFIXES` (default `/app`) → **200** or auth **3xx** with sign-in `Location`. **authenticated**: all probed paths → **200** + headers from `APP_READY_AUTH_COOKIE` / `APP_READY_STORAGE_STATE`; optional `/api/auth/session` JSON `user` check. |
| `tests/e2e/pre-nursing-hub.global-setup.ts` | Logs `APP_READY_MODE` (default **guest**) before spawning the wait script. |
| `tests/e2e/helpers/spawn-wait-for-app-ready.ts` | Sets `APP_READY_MODE=guest` when unset; default paths include `/app/practice-tests` (guest-safe under `/app`). |

## Seed coverage (deterministic QA)

| Asset | Command / entry | Covers |
|--------|-------------------|--------|
| Exam + deck smoke | `npm run seed:local-verify` → `../scripts/seed-local-verify-data.mjs` | Template `local-rn-template-01`, RN published `exam_questions`, deck `nursenest-verify-smoke-deck` |
| Paid learner surfaces | `qa-paid-test-account-reset.mts` (with allow flag) → `npm run seed:auth-qa` | Tagged rows (`nn_auth_qa` / `nnAuthQaSeed`), deck `nn-auth-qa-e2e-deck`, weak-area stats — aligns with `E2E_PAID_*` / `QA_PAID_*` |

**Gap (smallest follow-up):** `seed:local-verify` does **not** create a signed-in browser session. For strict **authenticated** readiness on `/app`, run paid reset + `seed:auth-qa`, then `npm run visual-qa:auth` (or export `APP_READY_STORAGE_STATE`).

## Exit 143 and Playwright lifecycle

| Cause | Mitigation |
|--------|------------|
| CI / OOM / timeout **SIGTERM** on `webServer` or child | Treat **143** as lifecycle, not app logic; use `PLAYWRIGHT_SKIP_WEB_SERVER=1` + one `npm run dev:next:3000` with logs tee’d |
| Duplicate `next dev` / **EADDRINUSE** | Free `:3000` (`ss` / `lsof`); avoid reuse confusion with `PLAYWRIGHT_NO_REUSE_WEB_SERVER=1` |
| Wrong listener reused | `PLAYWRIGHT_NO_REUSE_WEB_SERVER=1` or stop stale PID before suite |

## Screenshot matrix (authenticated visual QA)

| Area | Status |
|------|--------|
| **Credentials** | `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` (or `QA_PAID_*` / `PLAYWRIGHT_TEST_*`) per `tests/e2e/helpers/paid-test-credentials.ts` and `scripts/validate-visual-qa-env.mjs` |
| **CI without creds** | `setup-visual-qa-auth` uses `visual-qa-auth-required.setup.ts`; authenticated baseline **skips** when storage JSON missing — no false failures |
| **New captures** | Added: `auth-cat-practice-{ocean,blossom,midnight}-desktop.png`, `auth-dashboard-{blossom,midnight}-mobile.png`, `auth-cat-practice-ocean-mobile.png` under `docs/screenshots/authenticated-qa-matrix/` (requires first `npx playwright test -c playwright.visual-qa.config.ts --project=visual-qa-authenticated-baseline --update-snapshots` with paid env) |

## Validation (app root `nursenest-core/`)

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | **Pass** (exit 0) |
| `npm run test:homepage` | **Pass** (78 pass, 1 skip) |
| Targeted auth E2E | **Not run** here — no `DATABASE_URL` / paid credentials in this environment |

## Reproducibility verdict

**Guest** pre-nursing + `wait:app:ready` is reproducible without a DB session as long as Next boots and marketing routes return 200. **Authenticated** gates and new visual baselines require the documented env + seed path above.

---

## Git snapshot (`/root/nursenest-core`)

```
pwd
/root/nursenest-core

git branch --show-current
main

git status --short
 M docs/runtime/playwright-local-workflow.md
 M nursenest-core/docs/runtime/local-runtime-modes.md
 M nursenest-core/playwright.release-gate.config.ts
 M nursenest-core/src/components/marketing/nursing-tier-hub-page.test.tsx
 M nursenest-core/tests/e2e/helpers/spawn-wait-for-app-ready.ts
 M nursenest-core/tests/e2e/public/allied-health-hubs.spec.ts
 M nursenest-core/tests/e2e/public/hub-figma-implementation-smoke.spec.ts
 M nursenest-core/tests/e2e/public/marketing-header-layout-responsive.spec.ts
 M nursenest-core/tests/e2e/public/new-grad-hubs.spec.ts
 M nursenest-core/tests/e2e/setup/auth.setup.ts
 M nursenest-core/tests/e2e/visual-qa/authenticated-learner-visual-baseline.spec.ts
 M nursenest-core/tests/e2e/visual-qa/visual-qa-critical-regression.spec.ts
?? docs/reports/_write_test.md
?? docs/reports/release-candidate-cleanup-plan.md
?? docs/screenshots/footer-figma-implementation/
?? docs/screenshots/rc-theme-matrix-2026/
?? nursenest-core/docs/screenshots/hub-figma-implementation/allied-respiratory-desktop-midnight.png
?? nursenest-core/docs/screenshots/hub-figma-implementation/hub-figma-smoke-us-rn-desktop.png
?? nursenest-core/src/lib/marketing/is-new-grad-transition-pathway.test.ts
?? nursenest-core/tests/e2e/helpers/redirect-loop-guard.ts
?? nursenest-core/tests/e2e/navigation/footer-marketing-premium.spec.ts

git log --oneline -15
721158e41 chore: marketing header screenshot and QA learner seed updates
fd4d2a34c chore: premium hub, playwright, and marketing runtime updates
b4df39e63 test(qa): deterministic auth learner seeds and paid playwright readiness
b0401ca40 docs(reports): allied health ship FINAL evidence
75f45a0be feat(marketing): polish allied health hubs and premium module matrix
6e6d32ad7 feat(marketing): refine nav header framework
a3b8b187f docs(nursing-hubs): rewrite ship FINAL for accurate git + QA matrix
194bdb5e2 docs(nursing-hubs): correct ship FINAL git section
94791dadb fix(hub): exclude new-grad pathways from ECG marketing tiles
bec9a04c6 feat(marketing): complete nursing pathway premium hub modules
aa9105ec9 docs(governance): expand Figma post-completion summary template
970eea876 docs(governance): add post-completion delivery checklist and Figma summary template
b2e51244a test(e2e): fix marketing header layout spec for locale routing
f487d15e7 fix(marketing): lg+ header grid, utility band, nav stretch
cd47cee21 fix(header): align marketing nav layout and brand with design
```

*Note: `git status` includes unrelated local modifications in this workspace; hardening touchpoints include `wait-for-app-ready.mjs`, pre-nursing global setup, `spawn-wait-for-app-ready.ts`, `playwright.pre-nursing-hub.config.ts`, authenticated visual baseline spec, and the two runtime docs.*
