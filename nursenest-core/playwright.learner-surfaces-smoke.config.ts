/**
 * Canonical learner + marketing surface smoke (one file).
 *
 *   cd nursenest-core && npm run test:e2e:learner-surfaces-smoke
 *
 * Remote: `PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://… npm run test:e2e:learner-surfaces-smoke`
 *
 * Optional env: `QA_PAID_*` / `E2E_PAID_*`, `E2E_ADMIN_*` for subscriber/staff sections (skipped when unset).
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
  const secret = process.env.NEXTAUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim() || "playwright-e2e-local-secret";
  const dbUrl = process.env.DATABASE_URL?.trim();
  const readyUrl = `${origin.origin}/api/auth/csrf`;
  return {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: readyUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
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
  testDir: ".",
  testMatch: [/tests\/e2e\/learner-surfaces\/.*\.spec\.ts$/],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 180_000,
  expect: { timeout: 60_000 },
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
  },
});
