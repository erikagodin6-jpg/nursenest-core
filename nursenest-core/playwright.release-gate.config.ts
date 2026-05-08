/**
 * **Production release gate** — curated blockers only (health → paid auth seed → paid surfaces).
 *
 * **Target URL:** `use.baseURL` matches `tests/e2e/helpers/e2e-env.ts` (`getE2eBaseURL`):
 * `BASE_URL` → `PLAYWRIGHT_BASE_URL` → `NURSENEST_PRODUCTION_BASE_URL` → `http://localhost:3000`.
 * Specs should use relative `page.goto('/path')` where possible; use `resolveE2eAppBaseUrl` from `e2e-env.ts` for absolute URLs.
 *
 * Does not replace full `chromium-paid`; it is the minimum revenue-critical slice.
 *
 * Run: `npm run qa:release-gate`
 * @see docs/RELEASE_QA.md
 * @see reports/release-gate-checklist.md
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { getE2eBaseURL } from "./tests/e2e/helpers/e2e-env";
import { PAID_USER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";

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
  const secret = process.env.NEXTAUTH_SECRET?.trim() || "playwright-e2e-local-secret";
  const dbUrl = process.env.DATABASE_URL?.trim();
  return {
    /* `npm run dev` targets monolith `server/index.ts` (not in this package); E2E uses Next — see `playwright.mobile.config.ts`. */
    command: `npx next dev --hostname ${host} --port ${port}`,
    url: `${origin.origin}/api/auth/csrf`,
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

const paidAuthEnabled = hasPaidTestCredentials();

/** Paid specs that must pass before production promote (order preserved with workers=1). */
const releaseBlockingPaidMatch =
  /tests\/e2e\/(paid-user\/(paid-user-00-fast-sanity|paid-user-entitlements|paid-user-api-health|paid-user-cat-smoke|phase-1-paid-learner-workflows)\.spec\.ts|release\/release-account-billing-smoke\.spec\.ts)$/;

/**
 * Same visibility rule as `playwright.config.ts`: `setup-paid-auth` and the paid slice always
 * exist in `--list`. Without credentials, setup is a no-op stub and the paid project only runs
 * `paid-e2e-requires-env.spec.ts` (skipped) so CI/docs can reference stable project names.
 */
const releasePaidProjects = [
  {
    name: "setup-paid-auth",
    testMatch: paidAuthEnabled
      ? /tests\/e2e\/setup\/auth\.setup\.ts$/
      : /tests\/e2e\/setup\/paid-auth-stub\.setup\.ts$/,
  },
  {
    name: "release-blocking-paid",
    testMatch: paidAuthEnabled
      ? releaseBlockingPaidMatch
      : /tests\/e2e\/paid-user\/paid-e2e-requires-env\.spec\.ts$/,
    dependencies: ["setup-paid-auth"],
    use: {
      ...devices["Desktop Chrome"],
      ...(paidAuthEnabled ? { storageState: PAID_USER_AUTH_FILE } : {}),
    },
  },
];

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: ".",
  testMatch: ["tests/e2e/**/*.spec.ts"],
  testIgnore: [/^\.next[\\/]/, /[\\/]\.next[\\/]/, /[\\/]node_modules[\\/]/, /[\\/]dist[\\/]/],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 300_000,
  expect: { timeout: 30_000 },
  outputDir: "test-results/release-gate/artifacts",
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/release-gate/release-gate-report.json" }],
    ["./tests/e2e/reporters/release-blocker-console-reporter.ts"],
    ["./tests/e2e/reporters/paid-user-summary-reporter.ts"],
    ["./tests/e2e/reporters/release-gate-summary-reporter.ts"],
    ...(process.env.RELEASE_GATE_HTML_REPORT === "1"
      ? ([
          [
            "html",
            {
              outputFolder: "test-results/release-gate/playwright-report",
              open: "never",
            },
          ],
        ] as const)
      : []),
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "release-health",
      testMatch:
        /tests\/e2e\/release\/(release-health-apis|healthz-liveness-burst)\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "release-phase-1-guest",
      testMatch: /tests\/e2e\/release\/phase-1-release-qa-guest\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "release-mobile",
      dependencies: ["release-phase-1-guest"],
      testMatch: /tests\/e2e\/release\/phase-3-release-mobile-smoke\.spec\.ts$/,
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "release-free-user",
      testMatch: /tests\/e2e\/smoke-production\/free-user\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "release-admin-user",
      testMatch: /tests\/e2e\/smoke-production\/admin-user\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    ...releasePaidProjects,
    {
      name: "release-synthetic-paid-smoke",
      dependencies: ["release-blocking-paid"],
      testMatch: /tests\/e2e\/release\/phase-3-synthetic-paid-learner-smoke\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        ...(paidAuthEnabled ? { storageState: PAID_USER_AUTH_FILE } : {}),
      },
    },
  ],
});
