/**
 * Nursing pathway hub smoke + screenshot capture — starts local Next dev when BASE_URL is localhost.
 *
 *   cd nursenest-core && npx playwright test -c playwright.nursing-hubs.config.ts
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=http://127.0.0.1:3000 npx playwright test -c playwright.nursing-hubs.config.ts
 *   PLAYWRIGHT_REUSE_WEB_SERVER=1 — reuse existing dev on same port (default: always start fresh).
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
  /** Wait until Next responds — root `/` can yield empty responses during Turbopack warmup. */
  const readyUrl = `${origin.origin}/api/auth/csrf`;
  return {
    command: `npm run dev:next -- --hostname 127.0.0.1 --port ${port}`,
    url: readyUrl,
    /** Avoid reusing a stale/broken process on :3000 (causes ERR_EMPTY_RESPONSE / connection refused). */
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_WEB_SERVER === "1",
    timeout: 300_000,
    env: {
      RUN_HEAVY_BUILD_TASKS: "false",
      NEXTAUTH_SECRET: secret,
      AUTH_SECRET: process.env.AUTH_SECRET?.trim() || secret,
      AUTH_URL: origin.origin,
      NEXTAUTH_URL: origin.origin,
      /** Allow `next dev` boot in CI/dev clones without full AI key wiring — marketing hub routes do not require AI. */
      NN_ENV_VALIDATION_MODE: "off",
      ...(dbUrl ? { DATABASE_URL: dbUrl } : {}),
    },
  } as const;
}

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: "tests/e2e/public",
  testMatch: /nursing-pathway-hubs-smoke\.spec\.ts$/,
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
