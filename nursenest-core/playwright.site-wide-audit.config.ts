/**
 * Broad site audit — production or staging (read-only navigation + optional auth when env creds exist).
 *
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.nursenest.ca npm run test:e2e:site-wide-audit
 *
 * Report: `test-results/site-wide-production-audit-report.md` (+ `.json`)
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";

const baseURL = (process.env.BASE_URL ?? "https://www.nursenest.ca").replace(/\/$/, "");

export default defineConfig({
  testDir: "tests/e2e/audit",
  testMatch: /site-wide-production-audit\.spec\.ts$/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 180_000,
  expect: { timeout: 45_000 },
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report-site-wide-audit" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
    ...devices["Desktop Chrome"],
  },
});
