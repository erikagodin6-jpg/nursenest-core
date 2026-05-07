import path from "node:path";

/**
 * Paths for Playwright `storageState` JSON (cookies + per-origin localStorage).
 *
 * **Reuse flow (login once per `playwright test` run)**
 * 1. Setup projects run first (`setup-paid-auth`, `setup-free-auth` in `playwright.config.ts`).
 * 2. Each setup logs in via `loginWithCredentials`, then `saveStorageStateToFile` writes these paths.
 * 3. Projects that declare `dependencies: ["setup-paid-auth"]` and `storageState: PAID_USER_AUTH_FILE`
 *    load the saved session — tests do not call `/login` again unless a spec opts out.
 *
 * **Env overrides:** `PLAYWRIGHT_PAID_AUTH_STATE`, `PLAYWRIGHT_FREE_AUTH_STATE`.
 *
 * **Opt out in one spec:** `test.use({ storageState: { cookies: [], origins: [] } })` — see `paid-user-login-flow.spec.ts`.
 */
export const PAID_USER_AUTH_FILE =
  process.env.PLAYWRIGHT_PAID_AUTH_STATE ??
  path.join(process.cwd(), "tests", "e2e", ".auth", "paid-user.json");

export const FREE_USER_AUTH_FILE =
  process.env.PLAYWRIGHT_FREE_AUTH_STATE ??
  path.join(process.cwd(), "tests", "e2e", ".auth", "free-user.json");

/**
 * Visual QA / route-pack auth file (separate from default E2E `paid-user.json` so capture runs never
 * overwrite release-gate storage). Override: `PLAYWRIGHT_VISUAL_QA_AUTH_STATE`.
 *
 * The `setup-visual-qa-auth` project sets `PLAYWRIGHT_PAID_AUTH_STATE` to this path so
 * `tests/e2e/setup/auth.setup.ts` writes here without forking login logic.
 */
export const VISUAL_QA_LEARNER_AUTH_FILE =
  process.env.PLAYWRIGHT_VISUAL_QA_AUTH_STATE ??
  path.join(process.cwd(), "playwright", ".auth", "learner-paid.json");
