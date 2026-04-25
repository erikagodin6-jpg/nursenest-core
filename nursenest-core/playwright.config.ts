/**
 * Playwright E2E — authenticated session reuse
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";

const FREE_USER_AUTH_FILE = "tests/e2e/.auth/free-user.json";
const PAID_USER_AUTH_FILE = "tests/e2e/.auth/paid-user.json";

const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

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

  const env: Record<string, string> = {
    RUN_HEAVY_BUILD_TASKS: "false",
    NN_ENV_VALIDATION_MODE: process.env.NN_ENV_VALIDATION_MODE?.trim() || "warn",
    NEXTAUTH_SECRET: secret,
    AUTH_URL: process.env.AUTH_URL ?? origin.origin,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? origin.origin,
    DIRECT_URL: process.env.DIRECT_URL ?? process.env.DATABASE_DIRECT_URL ?? "",
    DATABASE_URL: process.env.DATABASE_URL ?? "",
  };

  if (process.env.E2E_LEARNER_DEGRADED === "1") {
    env.NN_DEGRADED_MODE = "1";
    env.NEXT_PUBLIC_NN_DEGRADED_MODE = "1";
  }

  if (process.env.PRISMA_QUERY_AUDIT !== "0") {
    env.PRISMA_QUERY_AUDIT = "1";
  }

  return {
    command: `npm run dev -- --hostname ${host} --port ${port}`,
    url: origin.origin,
    reuseExistingServer: !process.env.CI,
    timeout: 420_000,
    env,
  };
}

const paidAuthEnabled = hasPaidTestCredentials();

const freeAuthEnabled = Boolean(
  process.env.E2E_FREE_EMAIL?.trim() && process.env.E2E_FREE_PASSWORD,
);

const CHROMIUM_PAID_SPEC_MATCH =
  /paid-user-(00-fast-sanity|dashboard-shell-first|dashboard-fail-soft|dashboard-multi-fail-soft|degraded-mode|data-load|performance|stress|db-stability-burst|db-connection-burst|env-bootstrap-order|login-flow|login-reliability|journey|entitlements|navigation-paths|navigation|i18n|api-health|session-persistence|key-pages-performance|visual-regression|adaptive-question-flow|mobile|cat-smoke|cat-focused-viewport|duplicate-heavy-requests|prisma-client-singleton|prisma-query-bounds|accessibility)\.spec\.ts$|site-paid-access-contract\.spec\.ts$|paid-subscriber-audit\.spec\.ts$|production-i18n-bundle\.spec\.ts$/;

const freeProjects = freeAuthEnabled
  ? [
      {
        name: "setup-free-auth",
        testMatch: /tests\/e2e\/setup\/auth-free\.setup\.ts$/,
      },
      {
        name: "chromium-free",
        testMatch: /tests\/e2e\/auth\/(freemium-paywall|site-guest-paywall-contract)\.spec\.ts$/,
        dependencies: ["setup-free-auth"],
        use: {
          ...devices["Desktop Chrome"],
          storageState: FREE_USER_AUTH_FILE,
        },
      },
    ]
  : [];

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: ".",
  testMatch: ["tests/e2e/**/*.spec.ts", "tests/marketing/**/*.spec.ts", "tests/env/**/*.spec.ts"],
  testIgnore: [
    /^\.next[\\/]/,
    /[\\/]\.next[\\/]/,
    /[\\/]node_modules[\\/]/,
    /[\\/]dist[\\/]/,
    /[\\/]tests[\\/]e2e[\\/]smoke[\\/]/,
    /[\\/]tests[\\/]e2e[\\/]audit[\\/]/,
  ],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  timeout: 180_000,
  expect: { timeout: 30_000 },
  reporter: [["list"], ["./tests/e2e/reporters/paid-user-summary-reporter.ts"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "setup-paid-auth",
      testMatch: paidAuthEnabled
        ? /tests\/e2e\/setup\/auth\.setup\.ts$/
        : /tests\/e2e\/setup\/paid-auth-stub\.setup\.ts$/,
    },
    {
      name: "chromium-paid",
      testMatch: paidAuthEnabled
        ? CHROMIUM_PAID_SPEC_MATCH
        : /tests\/e2e\/paid-user\/paid-e2e-requires-env\.spec\.ts$/,
      dependencies: ["setup-paid-auth"],
      use: {
        ...devices["Desktop Chrome"],
        ...(paidAuthEnabled ? { storageState: PAID_USER_AUTH_FILE } : {}),
      },
    },
    ...freeProjects,
    {
      name: "chromium-stripe-journey",
      testMatch: /stripe-subscriber-journey\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium",
      testIgnore: [
        /lesson-flows\.mobile\.spec\.ts$/,
        /paid-user-(00-fast-sanity|dashboard-shell-first|dashboard-fail-soft|dashboard-multi-fail-soft|degraded-mode|data-load|performance|stress|db-stability-burst|db-connection-burst|env-bootstrap-order|login-flow|login-reliability|journey|entitlements|navigation-paths|navigation|i18n|api-health|session-persistence|key-pages-performance|visual-regression|adaptive-question-flow|mobile|cat-smoke|cat-focused-viewport|duplicate-heavy-requests|prisma-client-singleton|prisma-query-bounds|accessibility)\.spec\.ts$/,
        /site-paid-access-contract\.spec\.ts$/,
        /paid-subscriber-audit\.spec\.ts$/,
        /paid-e2e-requires-env\.spec\.ts$/,
        /stripe-subscriber-journey\.spec\.ts$/,
        /freemium-paywall\.spec\.ts$/,
        /[\\/]tests[\\/]e2e[\\/]smoke[\\/]/,
        /[\\/]tests[\\/]e2e[\\/]audit[\\/]/,
        /[\\/]tests[\\/]e2e[\\/]i18n[\\/]/,
        /^\.next[\\/]/,
        /[\\/]\.next[\\/]/,
        /[\\/]node_modules[\\/]/,
        /[\\/]dist[\\/]/,
      ],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      testMatch: /lesson-flows\.mobile\.spec\.ts$/,
      use: { ...devices["iPhone 12"] },
    },
  ],
});