/**
 * Full platform regression — guest/marketing + learner entry (no parallel chromium+webkit blast).
 *
 *   cd nursenest-core && npm run test:e2e:full-regression
 *
 * Staging/production-like:
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=https://example.com npm run test:e2e:full-regression
 *
 * Optional shard for the orchestrating spec only:
 *   E2E_REGRESSION_SHARD=1|2 npm run test:e2e:full-regression
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";

import { getE2eBaseURL } from "./tests/e2e/helpers/e2e-env";

const baseURL = getE2eBaseURL();

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
    timeout: 240_000,
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
  testMatch: [
    "tests/e2e/regression/regression.full-platform.spec.ts",
    "tests/e2e/public/pathway-hub-premium-modules-interaction.spec.ts",
    "tests/e2e/public/tools-faq-marketing.spec.ts",
    "tests/e2e/pricing/pricing-smoke.spec.ts",
    "tests/e2e/public/public-site-smoke.spec.ts",
    "tests/e2e/learner-surfaces/learner-surfaces.smoke.spec.ts",
  ],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 420_000,
  expect: { timeout: 90_000 },
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report-full-regression" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
    ...devices["Desktop Chrome"],
  },
});
