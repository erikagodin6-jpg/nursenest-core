/**
 * Post-deploy smoke (no paid credentials): health + public home.
 *
 *   BASE_URL=https://www.example.com npm run qa:postdeploy
 *
 * @see docs/RELEASE_QA.md
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
  testDir: "tests/e2e/release",
  testMatch: /release-postdeploy-smoke\.spec\.ts$/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  timeout: 120_000,
  reporter: [["list"], ["./tests/e2e/reporters/release-blocker-console-reporter.ts"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
