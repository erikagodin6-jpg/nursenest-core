import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";

import { localNextDevWebServer } from "./playwright/helpers/local-next-webserver";
import { getE2eBaseURL } from "./tests/e2e/helpers/e2e-env";

const baseURL = getE2eBaseURL();
const parsedBaseURL = new URL(baseURL);
const shouldStartLocalWebServer =
  parsedBaseURL.hostname === "127.0.0.1" || parsedBaseURL.hostname === "localhost";

const e2eWebServer = shouldStartLocalWebServer
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
  testMatch: /tests\/e2e\/(?:rn|pn|np)\/.*-learner-journey\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 3 : 1,
  timeout: 240_000,
  outputDir: "test-results/learner-journeys",
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report/learner-journeys", open: "never" }],
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  projects: [
    {
      name: "learner-journeys-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
