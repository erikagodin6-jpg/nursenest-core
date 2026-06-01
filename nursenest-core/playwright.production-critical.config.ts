/**
 * Production-Critical Playwright Config — Phase 7
 *
 * Unified gate that runs ALL critical smoke tests.
 * Production deployment is BLOCKED when any of these fail.
 *
 * Covers:
 *   Phase 1: Homepage, Auth, Tier Hubs, Lessons, Flashcards, Practice Tests, CAT, Blog
 *   Phase 2: Revenue Pipeline (pricing, subscription persistence)
 *   Phase 3: Navigation Crawl
 *   Phase 4: Performance Budget
 *   Phase 6: Console Error Detection (via attach-observers in every spec)
 *
 * Usage:
 *   # Local (starts dev server):
 *   npx playwright test --config playwright.production-critical.config.ts
 *
 *   # Remote / CI against staging:
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://staging.nursenest.ca \
 *     npx playwright test --config playwright.production-critical.config.ts
 *
 *   # CI with paid auth:
 *   E2E_PAID_EMAIL=... E2E_PAID_PASSWORD=... \
 *     npx playwright test --config playwright.production-critical.config.ts
 *
 * CI environment variables:
 *   BASE_URL                          Target URL (required in remote mode)
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1      Skip local server (use when hitting remote)
 *   QA_PAID_EMAIL / QA_PAID_PASSWORD  Paid learner account for subscriber smoke
 *   E2E_PAID_EMAIL / E2E_PAID_PASSWORD (alias)
 *   STRIPE_SECRET_KEY                 sk_test_* for revenue pipeline tests
 *   ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE=1  Include test-mode Stripe notifications
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { localNextDevWebServer } from "./playwright/helpers/local-next-webserver";
import { getE2eBaseURL } from "./tests/e2e/helpers/e2e-env";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";
import { PAID_USER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";

const baseURL = getE2eBaseURL();
const parsedBaseURL = new URL(baseURL);
const isLocal = parsedBaseURL.hostname === "127.0.0.1" || parsedBaseURL.hostname === "localhost";

const e2eWebServer = isLocal
  ? localNextDevWebServer({
      baseURL,
      readyUrl: `${parsedBaseURL.origin}/api/auth/csrf`,
      timeoutMs: 300_000,
      reuseExistingServer: !process.env.CI,
    })
  : undefined;

const paidAuthEnabled = hasPaidTestCredentials();

/**
 * Phase 1 — Public smoke tests (no auth required)
 * Run against every deployment.
 */
const publicSmokeSpecs = [
  "tests/e2e/smoke/homepage-comprehensive.spec.ts",
  "tests/e2e/smoke/tier-hubs-smoke.spec.ts",
  "tests/e2e/smoke/blog-smoke.spec.ts",
  "tests/e2e/smoke/guest-homepage.spec.ts",
  "tests/e2e/smoke/auth-login.spec.ts",
  "tests/e2e/smoke/auth-logout.spec.ts",
];

/**
 * Phase 2 — Revenue pipeline (public, no auth required for basic pricing checks)
 */
const revenuePublicSpecs = [
  "tests/e2e/revenue/subscription-purchase-flow.spec.ts",
];

/**
 * Phase 3 — Navigation crawl (public, generates navigation-health.md)
 */
const navigationSpecs = [
  "tests/e2e/navigation/navigation-crawl.spec.ts",
];

/**
 * Phase 4 — Performance budget (public surfaces)
 */
const performanceSpecs = [
  "tests/e2e/performance/performance-budget-comprehensive.spec.ts",
];

/**
 * Authenticated smoke (paid learner account required)
 */
const paidSmokeSpecs = paidAuthEnabled
  ? [
      "tests/e2e/smoke/flashcards-smoke.spec.ts",
      "tests/e2e/smoke/cat-smoke.spec.ts",
      "tests/e2e/smoke/practice-tests-smoke.spec.ts",
      "tests/e2e/smoke/lessons-smoke.spec.ts",
      "tests/e2e/revenue/subscription-persistence.spec.ts",
    ]
  : [];

const allSpecs = [
  ...publicSmokeSpecs,
  ...revenuePublicSpecs,
  ...navigationSpecs,
  ...performanceSpecs,
  ...paidSmokeSpecs,
];

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: ".",
  testMatch: allSpecs,
  testIgnore: [/node_modules/, /\.next/],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 30_000 },
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/production-critical-report.json" }],
    ["html", { outputFolder: "test-results/production-critical-html", open: "never" }],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  projects: [
    // Phase 1+2+3+4: Public surfaces — chromium only for speed
    {
      name: "chromium-public",
      testMatch: [
        ...publicSmokeSpecs,
        ...revenuePublicSpecs,
        ...navigationSpecs,
        ...performanceSpecs,
      ],
      use: { ...devices["Desktop Chrome"] },
    },
    // Paid auth setup (runs before paid smoke)
    ...(paidAuthEnabled
      ? [
          {
            name: "setup-paid",
            testMatch: /tests\/e2e\/setup\/auth\.setup\.ts$/,
          },
          {
            name: "chromium-paid",
            testMatch: paidSmokeSpecs,
            dependencies: ["setup-paid"],
            use: {
              ...devices["Desktop Chrome"],
              storageState: PAID_USER_AUTH_FILE,
            },
          },
        ]
      : []),
  ],
});
