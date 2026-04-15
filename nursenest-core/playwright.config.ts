/**
 * Playwright E2E — authenticated session reuse
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
    },
  } as const;
}

/** Paid projects: require credentials so we never point `storageState` at a missing file. */
const paidAuthEnabled = hasPaidTestCredentials();

const freeAuthEnabled = Boolean(
  process.env.E2E_FREE_EMAIL?.trim() && process.env.E2E_FREE_PASSWORD,
);

const paidProjects = paidAuthEnabled
  ? [
      {
        name: "setup-paid-auth",
        testMatch: /tests\/e2e\/setup\/auth\.setup\.ts$/,
      },
      {
        name: "chromium-paid",
        testMatch: /paid-user-(login-flow|smoke)\.spec\.ts$|paid-subscriber-audit\.spec\.ts$/,
        dependencies: ["setup-paid-auth"],
        use: {
          ...devices["Desktop Chrome"],
          storageState: PAID_USER_AUTH_FILE,
        },
      },
    ]
  : [];

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
  testIgnore: [/^\.next[\\/]/, /[\\/]\.next[\\/]/, /[\\/]node_modules[\\/]/, /[\\/]dist[\\/]/],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  timeout: 180_000,
  expect: { timeout: 30_000 },
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    ...paidProjects,
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
        /paid-user-(login-flow|smoke)\.spec\.ts$/,
        /paid-subscriber-audit\.spec\.ts$/,
        /stripe-subscriber-journey\.spec\.ts$/,
        /freemium-paywall\.spec\.ts$/,
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
