import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";

import { getE2eBaseURL } from "./tests/e2e/helpers/e2e-env";

const baseURL = getE2eBaseURL();
const parsedBaseURL = new URL(baseURL);
const shouldStartLocalWebServer = parsedBaseURL.hostname === "127.0.0.1" || parsedBaseURL.hostname === "localhost";
const localWebServerPort = parsedBaseURL.port || (parsedBaseURL.protocol === "https:" ? "443" : "3000");

export default defineConfig({
  testDir: ".",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  timeout: 180_000,
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: shouldStartLocalWebServer
    ? {
        command: `AUTH_SECRET='playwright-local-validation-secret-min-32-chars!!' NEXTAUTH_SECRET='playwright-local-validation-secret-min-32-chars!!' NEXTAUTH_URL='${baseURL}' AUTH_URL='${baseURL}' npm run dev:next -- --hostname ${parsedBaseURL.hostname} --port ${localWebServerPort}`,
        url: baseURL,
        timeout: 180_000,
        reuseExistingServer: !process.env.CI,
      }
    : undefined,
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