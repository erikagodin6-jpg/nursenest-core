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
      readyUrl: `${parsedBaseURL.origin}/api/auth/csrf`,
      timeoutMs: 300_000,
      reuseExistingServer: false,
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
  testMatch: /tests\/e2e\/navigation\/navigation-auth-environment-verification\.spec\.ts$/,
  fullyParallel: false,
  workers: 1,
  timeout: 600_000,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  projects: [
    {
      name: "chromium-auth-verification",
      use: {
        ...devices["Desktop Chrome"],
        storageState: { cookies: [], origins: [] },
      },
    },
  ],
});
