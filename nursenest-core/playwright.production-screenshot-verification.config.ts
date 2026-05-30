/**
 * Production marketing screenshot verification — LIVE SITE ONLY.
 *
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://nursenest.ca \
 *     npm run test:e2e:production-screenshot-verification
 */
import { defineConfig } from "@playwright/test";

const baseURL = (process.env.BASE_URL ?? "https://nursenest.ca").replace(/\/$/, "");

export default defineConfig({
  testDir: "./tests/e2e/marketing",
  testMatch: "production-screenshot-verification.spec.ts",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["json", { outputFile: "reports/production-screenshot-verification/playwright-results.json" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  webServer: undefined,
});
