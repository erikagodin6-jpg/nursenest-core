/**
 * **Emergency** smoke: health APIs (no auth) + paid fast sanity when credentials exist.
 *
 *   npm run qa:smoke:emergency
 *
 * @see docs/RELEASE_QA.md
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

const paidSlice =
  paidAuthEnabled
    ? [
        {
          name: "setup-paid-auth",
          testMatch: /tests\/e2e\/setup\/auth\.setup\.ts$/,
        },
        {
          name: "emergency-paid",
          testMatch: /tests\/e2e\/paid-user\/paid-user-00-fast-sanity\.spec\.ts$/,
          dependencies: ["setup-paid-auth"],
          use: {
            ...devices["Desktop Chrome"],
            storageState: PAID_USER_AUTH_FILE,
          },
        },
      ]
    : [];

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: ".",
  testMatch: ["tests/e2e/**/*.spec.ts"],
  testIgnore: [/^\.next[\\/]/, /[\\/]\.next[\\/]/, /[\\/]node_modules[\\/]/, /[\\/]dist[\\/]/],
  fullyParallel: false,
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 30_000 },
  reporter: [["list"], ["./tests/e2e/reporters/release-blocker-console-reporter.ts"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "release-health",
      testMatch: /tests\/e2e\/release\/release-health-apis\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    ...paidSlice,
  ],
});
