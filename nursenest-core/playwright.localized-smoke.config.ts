/**
 * Marketing locale smoke (guest + optional logged-in) — public homepage, nav, auth links.
 *
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.nursenest.ca npm run qa:smoke:localized
 *
 * Logged-in tests run only when paid QA credentials are set (same as `chromium-paid`).
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { PAID_USER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const paidAuthEnabled = hasPaidTestCredentials();

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

const e2eWebServer = localDevWebServer();

const guestSpecs = /tests\/e2e\/smoke\/localized-(guest-homepage|auth-entrypoints)\.spec\.ts$/;
const loggedInSpec = /tests\/e2e\/smoke\/localized-logged-in-homepage-nav\.spec\.ts$/;

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: ".",
  testMatch: paidAuthEnabled
    ? [guestSpecs, loggedInSpec, /tests\/e2e\/setup\/auth\.setup\.ts$/]
    : [guestSpecs],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 180_000,
  expect: { timeout: 30_000 },
  reporter: [["list"], ["./tests/e2e/reporters/release-blocker-console-reporter.ts"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: paidAuthEnabled
    ? [
        {
          name: "setup-paid-auth",
          testMatch: /tests\/e2e\/setup\/auth\.setup\.ts$/,
        },
        {
          name: "localized-guest",
          testMatch: guestSpecs,
          use: { ...devices["Desktop Chrome"] },
        },
        {
          name: "localized-logged-in",
          testMatch: loggedInSpec,
          dependencies: ["setup-paid-auth"],
          use: {
            ...devices["Desktop Chrome"],
            storageState: PAID_USER_AUTH_FILE,
          },
        },
      ]
    : [
        {
          name: "localized-guest",
          testMatch: guestSpecs,
          use: { ...devices["Desktop Chrome"] },
        },
      ],
});
