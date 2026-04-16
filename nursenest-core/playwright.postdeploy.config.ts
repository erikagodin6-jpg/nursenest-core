/**
 * Post-deploy smoke (no paid credentials): health + public home.
 *
 *   BASE_URL=https://www.example.com npm run qa:postdeploy
 *
 * @see docs/RELEASE_QA.md
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "tests/e2e/release",
  testMatch: /release-postdeploy-smoke\.spec\.ts$/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  timeout: 120_000,
  reporter: [["list"], ["./tests/e2e/reporters/release-blocker-console-reporter.ts"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
