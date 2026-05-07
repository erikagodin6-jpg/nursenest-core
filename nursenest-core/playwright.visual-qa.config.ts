/**
 * Authenticated visual QA — route pack PNGs + optional pixel-diff regression.
 *
 * @see docs/visual-qa.md
 */
import "./playwright.env";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { VISUAL_QA_LEARNER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";

const baseURL =
  process.env.PLAYWRIGHT_BASE_URL?.trim() ||
  process.env.BASE_URL?.trim() ||
  "http://127.0.0.1:3000";

const paidAuthEnabled = hasPaidTestCredentials();
const visualQaStoragePath = path.resolve(VISUAL_QA_LEARNER_AUTH_FILE);

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
  const secret =
    process.env.NEXTAUTH_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim() ||
    "playwright-e2e-local-secret";
  const dbUrl = process.env.DATABASE_URL?.trim();
  return {
    /** Next.js learner app — same as `playwright.mobile.config.ts` (not `npm run dev` / `server/index.ts`). */
    command: `npx next dev --hostname ${host} --port ${port}`,
    url: `${origin.origin}/api/auth/csrf`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: {
      RUN_HEAVY_BUILD_TASKS: "false",
      NEXTAUTH_SECRET: secret,
      AUTH_SECRET: process.env.AUTH_SECRET?.trim() || secret,
      AUTH_URL: origin.origin,
      NEXTAUTH_URL: origin.origin,
      ...(dbUrl ? { DATABASE_URL: dbUrl } : {}),
    },
  } as const;
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
