/**
 * Curated ecosystem smoke — homepage premium quality + learner surfaces + hub + visual guard.
 * Broader than CI master (no paid auth required); narrower than full default Playwright config.
 *
 *   cd nursenest-core && npm run test:e2e:ecosystem-audit
 *
 * Remote:
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://… npm run test:e2e:ecosystem-audit
 *
 * @see docs/governance/ecosystem-qa-master-program.md
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
    command: `npx next dev --hostname 127.0.0.1 --port ${port}`,
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
  testDir: "tests/e2e",
  testMatch: [
    "public/homepage-premium-quality.spec.ts",
    "public/homepage-production-smoke.spec.ts",
    "learner-surfaces/learner-surfaces.smoke.spec.ts",
    "public/pathway-lessons-hub-premium.spec.ts",
    "public/marketing-visual-qa-guard.spec.ts",
  ],
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
