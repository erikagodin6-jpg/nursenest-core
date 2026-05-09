/**
 * Pre-Nursing marketing hub — module grid, breadcrumbs, quick study modes.
 *
 * Run:
 *   cd nursenest-core && npm run test:e2e:pre-nursing-hub
 *
 * Remote / staging:
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=https://preview.example.com npm run test:e2e:pre-nursing-hub
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";

const baseURL =
  process.env.PLAYWRIGHT_BASE_URL?.trim() ||
  process.env.BASE_URL?.trim() ||
  "http://127.0.0.1:3000";

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
    command: `npx next dev --hostname 127.0.0.1 --port ${port}`,
    url: readyUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 600_000,
    env: {
      RUN_HEAVY_BUILD_TASKS: "false",
      NEXTAUTH_SECRET: secret,
      AUTH_SECRET: process.env.AUTH_SECRET?.trim() || secret,
      AUTH_URL: origin.origin,
      NEXTAUTH_URL: origin.origin,
      AI_ADMIN_GENERATION_ENABLED: process.env.AI_ADMIN_GENERATION_ENABLED?.trim() || "false",
      OPENAI_API_KEY:
        process.env.OPENAI_API_KEY?.trim() || process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim() || "playwright-placeholder-openai",
      ...(dbUrl ? { DATABASE_URL: dbUrl } : {}),
    },
  } as const;
}

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: "tests/e2e/public",
  testMatch: /pre-nursing-hub-complete\.spec\.ts$/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 900_000,
  expect: { timeout: 120_000 },
  reporter: [["list"]],
  projects: [
    {
      name: "webkit",
      use: {
        baseURL,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "off",
        ...devices["Desktop Safari"],
      },
    },
  ],
});
