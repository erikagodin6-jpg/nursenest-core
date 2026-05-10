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
        /** Satisfy `validateRuntimeEnvOrThrow` when host `.env` omits AI keys (see hub-modules Playwright config). */
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
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Single worker: paired heavy marketing E2Es + low-memory dev can kill Next when parallelized.
  workers: 1,
  timeout: 180_000,
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});