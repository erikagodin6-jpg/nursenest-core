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
import { localNextDevWebServer } from "./playwright/helpers/local-next-webserver";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

function localDevWebServer() {
  let origin: URL;
  try {
    origin = new URL(baseURL);
  } catch {
    return undefined;
  }
  /** Root `/` can be empty during Turbopack warmup; CSRF is a lightweight auth stack probe. */
  return localNextDevWebServer({
    baseURL,
    readyUrl: `${origin.origin}/api/auth/csrf`,
    timeoutMs: 180_000,
  });
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
