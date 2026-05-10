/**
 * Authenticated visual QA — route pack PNGs + optional pixel-diff regression.
 *
 * @see docs/visual-qa.md
 */
import "./playwright.env";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { localNextDevWebServer } from "./playwright/helpers/local-next-webserver";
import { VISUAL_QA_LEARNER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";

const baseURL =
  process.env.PLAYWRIGHT_BASE_URL?.trim() ||
  process.env.BASE_URL?.trim() ||
  "http://127.0.0.1:3000";

const paidAuthEnabled = hasPaidTestCredentials();
const visualQaStoragePath = path.resolve(VISUAL_QA_LEARNER_AUTH_FILE);

function localDevWebServer() {
  let origin: URL;
  try {
    origin = new URL(baseURL);
  } catch {
    return undefined;
  }
  /**
   * Root `/` readiness: avoids `/api/auth/csrf` 5xx when AUTH_URL disagrees with an already-running shell
   * (which would make Playwright spawn a second dev server → EADDRINUSE / dead listener).
   * For stricter probes after boot, run `npm run wait:app:ready` in CI or manually.
   */
  return localNextDevWebServer({
    baseURL,
    readyUrl: `${origin.origin}/`,
    timeoutMs: 300_000,
  });
}

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  globalSetup: "./tests/e2e/visual-qa/visual-qa-global-setup.ts",
  testDir: "tests/e2e",
  testIgnore: [/^\.next[\\/]/, /[\\/]\.next[\\/]/, /[\\/]node_modules[\\/]/, /[\\/]dist[\\/]/],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 300_000,
  expect: { timeout: 30_000 },
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "off",
    screenshot: "off",
  },
  projects: [
    {
      name: "visual-qa-guest-baseline",
      testMatch: /qa\/guest-marketing-visual-baseline\.spec\.ts$/,
      /** Git-root `docs/screenshots/` — does not affect paid `visual-qa-critical-regression` snapshots. */
      snapshotPathTemplate: "{testDir}/../../../docs/screenshots/visual-regression-baseline/{arg}{ext}",
      use: {
        ...devices["Desktop Chrome"],
        reducedMotion: "reduce",
      },
    },
    {
      name: "visual-qa-authenticated-baseline",
      dependencies: ["setup-visual-qa-auth"],
      testMatch: /visual-qa\/authenticated-learner-visual-baseline\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        reducedMotion: "reduce",
        ...(paidAuthEnabled ? { storageState: visualQaStoragePath } : {}),
      },
    },
    {
      name: "setup-visual-qa-auth",
      testMatch: paidAuthEnabled
        ? /setup\/auth\.setup\.ts$/
        : /setup\/visual-qa-auth-required\.setup\.ts$/,
      use: { ...devices["Desktop Chrome"] },
      ...(paidAuthEnabled
        ? {
            env: {
              PLAYWRIGHT_PAID_AUTH_STATE: visualQaStoragePath,
            },
          }
        : {}),
    },
    {
      name: "visual-qa-route-pack",
      dependencies: ["setup-visual-qa-auth"],
      testMatch: /visual-qa\/visual-qa-route-pack\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: visualQaStoragePath,
      },
    },
    {
      name: "visual-qa-critical-regression",
      dependencies: ["setup-visual-qa-auth"],
      testMatch: /visual-qa\/visual-qa-critical-regression\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: visualQaStoragePath,
      },
    },
  ],
});
