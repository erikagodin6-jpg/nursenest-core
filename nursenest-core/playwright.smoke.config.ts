/**
 * Minimal deploy smoke — four groups: Guest, Free user, Paid user, Admin user.
 *
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.example.com npm run qa:smoke
 *
 * Credentials: `tests/e2e/helpers/smoke-credentials.ts`, `admin-e2e-credentials.ts`
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";

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

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: "tests/e2e/smoke-production",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 180_000,
  expect: { timeout: 45_000 },
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
    ...devices["Desktop Chrome"],
  },
  projects: [
    { name: "Guest", testMatch: /guest-homepage\.spec\.ts$/ },
    { name: "Logged-in homepage", testMatch: /logged-in-homepage-nav\.spec\.ts$/ },
    { name: "Free user", testMatch: /free-user\.spec\.ts$/ },
    { name: "Paid user", testMatch: /paid-user\.spec\.ts$/ },
    { name: "Admin user", testMatch: /admin-user\.spec\.ts$/ },
  ],
});
