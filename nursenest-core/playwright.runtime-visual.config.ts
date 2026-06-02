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
      },
    })
  : undefined;

export default defineConfig({
  testDir: ".",
  testMatch: /tests\/e2e\/runtime\/runtime-visual-regression\.spec\.ts$/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 180_000,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report/runtime-visual", open: "never" }],
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  ...(webServer ? { webServer } : {}),
  projects: [
    {
      name: "runtime-visual-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1100 } },
    },
    {
      name: "runtime-visual-mobile-webkit",
      use: { ...devices["iPhone 14"] },
    },
  ],
});
