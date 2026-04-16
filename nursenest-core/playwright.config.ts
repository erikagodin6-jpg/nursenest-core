/**
 * Playwright E2E — authenticated session reuse
 *
 * **CWD:** Run Playwright from this package directory (where this file lives). A parent monorepo folder
 * without `playwright.config.ts` will not load these projects — `setup-paid-auth` / `chromium-paid`
 * will appear missing in `--list`.
 *
 * **Test layering (deploy blockers vs extended):** see `tests/e2e/TEST_LAYERS.md` and `docs/RELEASE_QA.md`.
 *
 * Login happens **once** in setup projects, not per test:
 * - `setup-paid-auth` → `tests/e2e/.auth/paid-user.json` → `chromium-paid` (`storageState` + `dependencies`)
 * - `setup-free-auth` → `tests/e2e/.auth/free-user.json` → `chromium-free`
 *
 * Default `chromium` / `mobile` projects use **no** saved auth (marketing, public, anonymous flows).
 * To force a fresh login inside a paid project, use `test.use({ storageState: { cookies: [], origins: [] } })`.
 *
 * See `tests/e2e/helpers/auth-state-paths.ts` for path overrides and opt-out details.
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { FREE_USER_AUTH_FILE, PAID_USER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

function localDevWebServer() {
  if (process.env.PLAYWRIGHT_SKIP_WEB_SERVER === "1") return undefined;
  let origin: URL;
  try {
    origin = new URL(baseURL);
  } catch {
    return undefined;
  }
  const host = origin.hostname;
  if (host !== "127.0.0.1" && host !== "localhost") return undefined;
  const port = origin.port || "3000";
  const secret = process.env.NEXTAUTH_SECRET?.trim() || "playwright-e2e-local-secret";
  return {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: origin.origin,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      RUN_HEAVY_BUILD_TASKS: "false",
      NEXTAUTH_SECRET: secret,
      /** Client session fetch uses absolute origin; unset values cause ClientFetchError in Playwright. */
      AUTH_URL: origin.origin,
      NEXTAUTH_URL: origin.origin,
      /** When `E2E_LEARNER_DEGRADED=1`, start Next with learner degraded mode (paid degraded-mode spec). */
      ...(process.env.E2E_LEARNER_DEGRADED === "1"
        ? { NN_DEGRADED_MODE: "1", NEXT_PUBLIC_NN_DEGRADED_MODE: "1" }
        : {}),
    },
  } as const;
}

/**
 * When `E2E_PAID_*` / `PLAYWRIGHT_TEST_*` are set: real `auth.setup.ts` + full paid spec set + `storageState`.
 * Otherwise: no-op stub setup + skipped placeholder spec — projects **still appear** in `--list`.
 */
const paidAuthEnabled = hasPaidTestCredentials();

const freeAuthEnabled = Boolean(
  process.env.E2E_FREE_EMAIL?.trim() && process.env.E2E_FREE_PASSWORD,
);

/** Full paid-user slice (must stay aligned with `chromium` testIgnore below). */
const CHROMIUM_PAID_SPEC_MATCH =
  /paid-user-(00-fast-sanity|degraded-mode|data-load|performance|stress|login-flow|journey|entitlements|navigation|i18n|api-health|session-persistence|key-pages-performance|visual-regression|adaptive-question-flow|mobile|cat-smoke)\.spec\.ts$|paid-subscriber-audit\.spec\.ts$|production-i18n-bundle\.spec\.ts$/;

const freeProjects = freeAuthEnabled
  ? [
      {
        name: "setup-free-auth",
        testMatch: /tests\/e2e\/setup\/auth-free\.setup\.ts$/,
      },
      {
        name: "chromium-free",
        testMatch: /freemium-paywall\.spec\.ts$/,
        dependencies: ["setup-free-auth"],
        use: {
          ...devices["Desktop Chrome"],
          storageState: FREE_USER_AUTH_FILE,
        },
      },
    ]
  : [];

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: ".",
  testMatch: ["tests/e2e/**/*.spec.ts"],
  // Exclude Next build output (would duplicate every spec under `.next/standalone/.../tests/e2e/`).
  testIgnore: [
    /^\.next[\\/]/,
    /[\\/]\.next[\\/]/,
    /[\\/]node_modules[\\/]/,
    /[\\/]dist[\\/]/,
    /** Dedicated `playwright.smoke.config.ts` + `npm run qa:smoke` — keep out of default E2E projects. */
    /[\\/]tests[\\/]e2e[\\/]smoke[\\/]/,
  ],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  timeout: 180_000,
  expect: { timeout: 30_000 },
  reporter: [["list"], ["./tests/e2e/reporters/paid-user-summary-reporter.ts"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    // --- Paid (always defined; do not remove — VM/CI expect these project names in `npx playwright test --list`)
    {
      name: "setup-paid-auth",
      testMatch: paidAuthEnabled
        ? /tests\/e2e\/setup\/auth\.setup\.ts$/
        : /tests\/e2e\/setup\/paid-auth-stub\.setup\.ts$/,
    },
    {
      name: "chromium-paid",
      testMatch: paidAuthEnabled
        ? CHROMIUM_PAID_SPEC_MATCH
        : /tests\/e2e\/paid-user\/paid-e2e-requires-env\.spec\.ts$/,
      dependencies: ["setup-paid-auth"],
      use: {
        ...devices["Desktop Chrome"],
        ...(paidAuthEnabled ? { storageState: PAID_USER_AUTH_FILE } : {}),
      },
    },
    // --- Free (optional env)
    ...freeProjects,
    {
      name: "chromium-stripe-journey",
      testMatch: /stripe-subscriber-journey\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium",
      // Project-level testIgnore replaces the root list — keep `.next` + build dirs here too.
      testIgnore: [
        /lesson-flows\.mobile\.spec\.ts$/,
        /paid-user-(00-fast-sanity|degraded-mode|data-load|login-flow|journey|entitlements|navigation|i18n|api-health|session-persistence|key-pages-performance|visual-regression|adaptive-question-flow|mobile|cat-smoke)\.spec\.ts$/,
        /paid-subscriber-audit\.spec\.ts$/,
        /** Only `chromium-paid` should run this placeholder (or it duplicates when creds are missing). */
        /paid-e2e-requires-env\.spec\.ts$/,
        /stripe-subscriber-journey\.spec\.ts$/,
        /freemium-paywall\.spec\.ts$/,
        /[\\/]tests[\\/]e2e[\\/]smoke[\\/]/,
        /[\\/]tests[\\/]e2e[\\/]i18n[\\/]/,
        /^\.next[\\/]/,
        /[\\/]\.next[\\/]/,
        /[\\/]node_modules[\\/]/,
        /[\\/]dist[\\/]/,
      ],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      testMatch: /lesson-flows\.mobile\.spec\.ts$/,
      use: { ...devices["iPhone 12"] },
    },
  ],
});
