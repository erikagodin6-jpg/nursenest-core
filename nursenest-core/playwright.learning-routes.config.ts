/**
 * Focused Playwright config: paid learner flashcards hub + practice-tests builder smoke.
 *
 *   npx playwright test -c playwright.learning-routes.config.ts
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { PAID_USER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

function localDevWebServer() {
  if (process.env.PLAYWRIGHT_SKIP_WEB_SERVER === "1") return undefined;
  let origin: URL;
  try {
    origin = new URL(baseURL);
  } catch {
    return undefined;
  }
  const host = origin.hostname;
  if (host !== "127.0.0.1" && host !== "localhost") return undefined;
  const port = origin.port || "3000";
  const secret = process.env.NEXTAUTH_SECRET?.trim() || "playwright-e2e-local-secret";
  return {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: origin.origin,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      RUN_HEAVY_BUILD_TASKS: "false",
      NEXTAUTH_SECRET: secret,
      AUTH_URL: origin.origin,
      NEXTAUTH_URL: origin.origin,
    },
  } as const;
}

const paidAuthEnabled = hasPaidTestCredentials();
const e2eWebServer = localDevWebServer();

if (!paidAuthEnabled) {
  throw new Error(
    "playwright.learning-routes.config.ts requires E2E_PAID_EMAIL and E2E_PAID_PASSWORD (same as other paid E2E).",
  );
}

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: ".",
  testMatch: [/tests\/e2e\/paid-user\/learning-routes-live-surfaces\.spec\.ts$/],
  fullyParallel: false,
  workers: 1,
  timeout: 180_000,
  expect: { timeout: 45_000 },
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
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
  ],
});
