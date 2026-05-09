/**
 * Targeted hub shell + premium visibility smoke (convergent hero, no admin leakage).
 *
 *   cd nursenest-core && npm run test:e2e:hub-figma
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=http://127.0.0.1:3000 npm run test:e2e:hub-figma
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { localNextDevWebServer } from "./playwright/helpers/local-next-webserver";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

function localDevWebServer() {
  let origin: URL;
  try {
    origin = new URL(baseURL);
  } catch {
    return undefined;
  }
  return localNextDevWebServer({
    baseURL,
    readyUrl: `${origin.origin}/api/auth/csrf`,
    timeoutMs: 300_000,
    envExtra: {
      NN_ENV_VALIDATION_MODE: "off",
    },
  });
}

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: "tests/e2e/public",
  testMatch: /hub-figma-implementation-smoke\.spec\.ts$/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 300_000,
  expect: { timeout: 90_000 },
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
