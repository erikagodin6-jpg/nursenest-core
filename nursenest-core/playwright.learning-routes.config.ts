/**
 * Focused Playwright config: paid learner flashcards hub + premium interaction + practice-tests builder smoke.
 *
 *   npx playwright test -c playwright.learning-routes.config.ts
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { localNextDevWebServer } from "./playwright/helpers/local-next-webserver";
import { PAID_USER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";
import { getE2eBaseURL } from "./tests/e2e/helpers/e2e-env";

const baseURL = getE2eBaseURL();

function localDevWebServer() {
  let origin: URL;
  try {
    origin = new URL(baseURL.trim());
  } catch {
    return undefined;
  }
  /**
   * Root `/` readiness: matches release-gate + visual-qa (avoids spawning a second dev server when
   * an existing listener is healthy but `/api/auth/csrf` is temporarily 5xx).
   */
  return localNextDevWebServer({
    baseURL,
    readyUrl: `${origin.origin}/`,
    timeoutMs: 300_000,
  });
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
  testMatch: [
    /tests\/e2e\/paid-user\/learning-routes-live-surfaces\.spec\.ts$/,
    /tests\/e2e\/paid-user\/flashcards-live-route-tiers\.spec\.ts$/,
    /tests\/e2e\/paid-user\/flashcards-premium-interaction\.spec\.ts$/,
  ],
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
