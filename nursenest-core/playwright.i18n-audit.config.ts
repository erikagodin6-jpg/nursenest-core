/**
 * Optional browser heuristic audit for visible English on localized marketing routes.
 *
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.nursenest.ca npm run qa:i18n:visible-audit
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "tests/e2e/i18n",
  testMatch: /visible-english-heuristic\.spec\.ts$/,
  fullyParallel: false,
  workers: 1,
  timeout: 300_000,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
  },
});
