import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { localNextDevWebServer } from "./playwright/helpers/local-next-webserver";
import { PAID_USER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
import { getE2eBaseURL } from "./tests/e2e/helpers/e2e-env";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";

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

const paidAuthEnabled = hasPaidTestCredentials();

export default defineConfig({
  testDir: ".",
  testMatch: /tests\/e2e\/navigation\/premium-(shell-navigation-consistency-audit|learner-shell-navigation-audit)\.spec\.ts$/,
  fullyParallel: false,
  workers: 1,
  timeout: 180_000,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  projects: [
    {
      name: "chromium-public",
      use: { ...devices["Desktop Chrome"], storageState: { cookies: [], origins: [] } },
    },
    ...(paidAuthEnabled
      ? [
          {
            name: "setup-paid-auth",
            testMatch: /tests\/e2e\/setup\/auth\.setup\.ts$/,
          },
          {
            name: "chromium-paid",
            dependencies: ["setup-paid-auth"],
            use: {
              ...devices["Desktop Chrome"],
              storageState: PAID_USER_AUTH_FILE,
            },
          },
        ]
      : []),
  ],
});
