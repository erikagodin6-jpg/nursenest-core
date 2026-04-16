/**
 * Pre-deploy **release gate**: paid auth setup + revenue-critical E2E + health APIs.
 *
 * Usage:
 *   BASE_URL=https://candidate.example npm run qa:predeploy
 *
 * @see docs/RELEASE_QA.md
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { PAID_USER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

/** Excludes `release-postdeploy-smoke` (anonymous post-deploy only). */
const RELEASE_GATE_TEST_RE =
  /tests\/e2e\/(release\/release-health-apis\.spec\.ts|release\/release-account-billing-smoke\.spec\.ts|paid-user\/paid-user-00-fast-sanity\.spec\.ts|paid-user\/paid-user-api-health\.spec\.ts)$/;

const paidAuthEnabled = hasPaidTestCredentials();

const paidProjects = paidAuthEnabled
  ? [
      {
        name: "setup-paid-auth",
        testMatch: /tests\/e2e\/setup\/auth\.setup\.ts$/,
      },
      {
        name: "release-gate",
        testMatch: RELEASE_GATE_TEST_RE,
        dependencies: ["setup-paid-auth"],
        use: {
          ...devices["Desktop Chrome"],
          storageState: PAID_USER_AUTH_FILE,
        },
      },
    ]
  : [];

export default defineConfig({
  testDir: ".",
  testMatch: ["tests/e2e/**/*.spec.ts"],
  testIgnore: [/^\.next[\\/]/, /[\\/]\.next[\\/]/, /[\\/]node_modules[\\/]/, /[\\/]dist[\\/]/],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 300_000,
  expect: { timeout: 30_000 },
  reporter: [
    ["list"],
    ["./tests/e2e/reporters/release-blocker-console-reporter.ts"],
    ["./tests/e2e/reporters/paid-user-summary-reporter.ts"],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: paidProjects,
});
