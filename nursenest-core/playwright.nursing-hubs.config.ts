/**
 * Nursing pathway hub smoke + screenshot capture — starts local Next dev when BASE_URL is localhost.
 *
 *   cd nursenest-core && npx playwright test -c playwright.nursing-hubs.config.ts
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=http://127.0.0.1:3000 npx playwright test -c playwright.nursing-hubs.config.ts
 *
 * Reuse: by default reuses a healthy listener on the same port when not CI (avoids duplicate `next dev` / EADDRINUSE).
 * Force a fresh spawned server: `PLAYWRIGHT_NO_REUSE_WEB_SERVER=1`.
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
  /** Root `/` can be empty during Turbopack warmup; CSRF probes the auth stack. */
  return localNextDevWebServer({
    baseURL,
    readyUrl: `${origin.origin}/api/auth/csrf`,
    timeoutMs: 300_000,
    envExtra: {
      /** Allow `next dev` boot in CI/dev clones without full AI key wiring — marketing hub routes do not require AI. */
      NN_ENV_VALIDATION_MODE: "off",
    },
  });
}

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: "tests/e2e/public",
  testMatch: /(nursing-pathway-hubs-smoke|practical-nursing-hub-convergence-screenshots)\.spec\.ts$/,
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
