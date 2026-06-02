/**
 * Paid-auth Playwright config for CAT question-type matrix specs.
 *
 *   npm run test:e2e:cat-question-types
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { localNextDevWebServer } from "./playwright/helpers/local-next-webserver";
import { PAID_USER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";
import { getE2eBaseURL } from "./tests/e2e/helpers/e2e-env";

const baseURL = getE2eBaseURL();
const paidAuthEnabled = hasPaidTestCredentials();

function localDevWebServer() {
  let origin: URL;
  try {
    origin = new URL(baseURL.trim());
  } catch {
    return undefined;
  }
  return localNextDevWebServer({
    baseURL,
    readyUrl: `${origin.origin}/`,
    timeoutMs: 300_000,
  });
}

const e2eWebServer = localDevWebServer();

const catQuestionTypeMatch =
  /tests\/e2e\/cat\/(cat-question-type-positive-matrix|cat-question-type-unsupported-fallback)\.spec\.ts$/;

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: ".",
  testMatch: [catQuestionTypeMatch],
  fullyParallel: false,
  workers: 1,
  timeout: 300_000,
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
      testMatch: paidAuthEnabled ? /tests\/e2e\/setup\/auth\.setup\.ts$/ : /tests\/e2e\/setup\/paid-auth-stub\.setup\.ts$/,
    },
    {
      name: "chromium-cat-question-types",
      dependencies: ["setup-paid-auth"],
      testMatch: [catQuestionTypeMatch],
      use: {
        ...devices["Desktop Chrome"],
        ...(paidAuthEnabled ? { storageState: PAID_USER_AUTH_FILE } : {}),
      },
    },
  ],
});
