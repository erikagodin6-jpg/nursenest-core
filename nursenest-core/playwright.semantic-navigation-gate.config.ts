/**
 * Semantic navigation release gate — Playwright runtime against preview/production URL.
 *
 *   npm run qa:semantic-navigation-gate
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { getE2eBaseURL } from "./tests/e2e/helpers/e2e-env";

const baseURL = getE2eBaseURL();

export default defineConfig({
  testDir: "tests/e2e/seo",
  testMatch: ["playwright-breadcrumb-governance.spec.ts"],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 30_000 },
  outputDir: "test-results/semantic-navigation-gate/artifacts",
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/semantic-navigation-gate/report.json" }],
    ...(process.env.SEMANTIC_GATE_HTML === "1"
      ? ([["html", { outputFolder: "test-results/semantic-navigation-gate/html", open: "never" }]] as const)
      : []),
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "semantic-navigation-governance",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
