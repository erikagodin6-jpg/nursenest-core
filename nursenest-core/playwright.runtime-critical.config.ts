import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";

import { localNextDevWebServer } from "./playwright/helpers/local-next-webserver";
import { getE2eBaseURL } from "./tests/e2e/helpers/e2e-env";

const baseURL = getE2eBaseURL();
const parsedBaseURL = new URL(baseURL);
const shouldStartLocalWebServer =
  parsedBaseURL.hostname === "127.0.0.1" || parsedBaseURL.hostname === "localhost";

const webServer = shouldStartLocalWebServer
  ? localNextDevWebServer({
      baseURL,
      readyUrl: parsedBaseURL.origin,
      timeoutMs: 300_000,
      reuseExistingServer: !process.env.CI,
      envExtra: {
        AI_ADMIN_GENERATION_ENABLED: process.env.AI_ADMIN_GENERATION_ENABLED?.trim() || "false",
        OPENAI_API_KEY:
          process.env.OPENAI_API_KEY?.trim() ||
          process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim() ||
          "playwright-placeholder-openai",
        NN_E2E_RUNTIME_CRITICAL: "1",
      },
    })
  : undefined;

const commonUse = {
  baseURL,
  actionTimeout: 30_000,
  navigationTimeout: 60_000,
  trace: "retain-on-failure" as const,
  screenshot: "only-on-failure" as const,
  video: "retain-on-failure" as const,
};

export default defineConfig({
  testDir: ".",
  testMatch: /tests\/e2e\/runtime\/runtime-critical\.spec\.ts$/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 180_000,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report/runtime-critical", open: "never" }],
    ["json", { outputFile: "test-results/runtime-critical/results.json" }],
  ],
  use: commonUse,
  ...(webServer ? { webServer } : {}),
  projects: [
    {
      name: "runtime-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "runtime-firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "runtime-webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
