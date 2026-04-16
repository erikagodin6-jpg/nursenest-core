/**
 * **Production release gate** — curated blockers only (health → paid auth seed → paid surfaces).
 *
 * Does not replace full `chromium-paid`; it is the minimum revenue-critical slice.
 *
 * Run: `npm run qa:release-gate`
 * @see docs/RELEASE_QA.md
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { PAID_USER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
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
      AUTH_URL: origin.origin,
      NEXTAUTH_URL: origin.origin,
    },
  } as const;
}

const paidAuthEnabled = hasPaidTestCredentials();

/** Paid specs that must pass before production promote (order preserved with workers=1). */
const releaseBlockingPaidMatch =
  /tests\/e2e\/(paid-user\/(paid-user-00-fast-sanity|paid-user-entitlements|paid-user-api-health|paid-user-cat-smoke)\.spec\.ts|release\/release-account-billing-smoke\.spec\.ts)$/;

/**
 * Same visibility rule as `playwright.config.ts`: `setup-paid-auth` and the paid slice always
 * exist in `--list`. Without credentials, setup is a no-op stub and the paid project only runs
 * `paid-e2e-requires-env.spec.ts` (skipped) so CI/docs can reference stable project names.
 */
const releasePaidProjects = [
  {
    name: "setup-paid-auth",
    testMatch: paidAuthEnabled
      ? /tests\/e2e\/setup\/auth\.setup\.ts$/
      : /tests\/e2e\/setup\/paid-auth-stub\.setup\.ts$/,
  },
  {
    name: "release-blocking-paid",
    testMatch: paidAuthEnabled
      ? releaseBlockingPaidMatch
      : /tests\/e2e\/paid-user\/paid-e2e-requires-env\.spec\.ts$/,
    dependencies: ["setup-paid-auth"],
    use: {
      ...devices["Desktop Chrome"],
      ...(paidAuthEnabled ? { storageState: PAID_USER_AUTH_FILE } : {}),
    },
  },
];

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: ".",
  testMatch: ["tests/e2e/**/*.spec.ts"],
  testIgnore: [/^\.next[\\/]/, /[\\/]\.next[\\/]/, /[\\/]node_modules[\\/]/, /[\\/]dist[\\/]/],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 300_000,
  expect: { timeout: 30_000 },
  reporter: [["list"], ["./tests/e2e/reporters/paid-user-summary-reporter.ts"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "release-health",
      testMatch: /tests\/e2e\/release\/release-health-apis\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    ...releasePaidProjects,
  ],
});
