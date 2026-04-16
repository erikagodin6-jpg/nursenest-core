/**
 * Production / staging verification — core user journeys (read-heavy, skips when QA creds missing).
 *
 * Requires: PLAYWRIGHT_SKIP_WEB_SERVER=1 and BASE_URL (e.g. https://www.nursenest.ca)
 *
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.nursenest.ca npm run qa:verify:production:core
 *
 * @see docs/release-verification.md
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "tests/e2e/smoke-production",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 180_000,
  expect: { timeout: 45_000 },
  reporter: [["list"], ["./tests/e2e/reporters/release-blocker-console-reporter.ts"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
    ...devices["Desktop Chrome"],
  },
  projects: [
    { name: "Guest", testMatch: /guest-homepage\.spec\.ts$/ },
    { name: "Logged-in homepage", testMatch: /logged-in-homepage-nav\.spec\.ts$/ },
    { name: "Free user", testMatch: /free-user\.spec\.ts$/ },
    { name: "Paid user", testMatch: /paid-user\.spec\.ts$/ },
    { name: "Admin user", testMatch: /admin-user\.spec\.ts$/ },
  ],
});
