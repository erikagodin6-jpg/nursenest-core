/**
 * Local **emergency** smoke: health APIs + paid fast sanity only (faster than full `qa:predeploy`).
 *
 *   npm run qa:smoke:emergency
 *
 * @see docs/RELEASE_QA.md
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { PAID_USER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

const EMERGENCY_RE =
  /tests\/e2e\/(release\/release-health-apis\.spec\.ts|paid-user\/paid-user-00-fast-sanity\.spec\.ts)$/;

const paidAuthEnabled = hasPaidTestCredentials();

const projects = paidAuthEnabled
  ? [
      { name: "setup-paid-auth", testMatch: /tests\/e2e\/setup\/auth\.setup\.ts$/ },
      {
        name: "emergency-smoke",
        testMatch: EMERGENCY_RE,
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
  workers: 1,
  timeout: 120_000,
  reporter: [["list"], ["./tests/e2e/reporters/release-blocker-console-reporter.ts"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects,
});
