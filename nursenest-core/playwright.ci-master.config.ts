/**
 * Deploy gate: one Playwright project that runs the curated paid-learner E2E slice in order (workers: 1).
 * Does not register `chromium-paid`, so `npx playwright test` (default config) never double-runs these files.
 *
 * Requires paid auth env vars used by `setup-paid-auth` (same as main Playwright config).
 *
 * Usage:
 *   cd nursenest-core && npm run test:e2e:ci-master
 *
 * Outputs:
 *   test-results/ci-master-summary.md
 *   test-results/ci-master-report.json (from json reporter)
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { PAID_USER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";

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

const paidAuthEnabled = hasPaidTestCredentials();

/** Lean gate: fast sanity + canonical journey + entitlements + nav + API monitor (no i18n/session/mobile by default). */
const masterSpecs =
  /paid-user-(00-fast-sanity|journey|entitlements|navigation|api-health)\.spec\.ts$/;

const ciMasterProjects = paidAuthEnabled
  ? [
      {
        name: "setup-paid-auth",
        testMatch: /tests\/e2e\/setup\/auth\.setup\.ts$/,
      },
      {
        name: "chromium-ci-master",
        testMatch: masterSpecs,
        dependencies: ["setup-paid-auth"],
        use: {
          ...devices["Desktop Chrome"],
          storageState: PAID_USER_AUTH_FILE,
        },
      },
    ]
  : [];

const e2eWebServer = localDevWebServer();

if (process.env.CI === "1" && !paidAuthEnabled) {
  throw new Error(
    "CI master E2E requires paid test credentials (E2E_PAID_EMAIL + E2E_PAID_PASSWORD or PLAYWRIGHT_TEST_*). See tests/e2e/helpers/paid-test-credentials.ts",
  );
}

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: ".",
  testMatch: ["tests/e2e/**/*.spec.ts"],
  testIgnore: [/^\.next[\\/]/, /[\\/]\.next[\\/]/, /[\\/]node_modules[\\/]/, /[\\/]dist[\\/]/],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 180_000,
  expect: { timeout: 30_000 },
  reporter: [
    ["list"],
    ["./tests/e2e/reporters/paid-user-summary-reporter.ts"],
    ["./tests/e2e/reporters/ci-master-reporter.ts"],
    ["json", { outputFile: "test-results/ci-master-report.json" }],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: paidAuthEnabled ? ciMasterProjects : [],
});
