/**
 * RN learner routing consolidation — staging regression.
 *
 *   cd nursenest-core
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://staging.nursenest.ca \
 *     E2E_SKIP_APP_READY=1 \
 *     npx playwright test -c playwright.rn-routing-staging.config.ts --workers=1
 *
 * Paid projects: `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` (or QA_/PLAYWRIGHT_TEST_* aliases).
 * Canada RN: `E2E_CA_PAID_EMAIL` + `E2E_CA_PAID_PASSWORD` (setup-ca-paid-auth), or
 * `E2E_CA_RN_PATHWAY_ENABLED=1` when the US paid account is also entitled for `ca-rn-nclex-rn`.
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { CA_PAID_USER_AUTH_FILE, PAID_USER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
import { hasCaPaidTestCredentials, hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";

const baseURL =
  process.env.BASE_URL?.trim() ||
  process.env.PLAYWRIGHT_BASE_URL?.trim() ||
  "https://staging.nursenest.ca";

const paidAuthEnabled = hasPaidTestCredentials();
const caPaidAuthEnabled = hasCaPaidTestCredentials();
const spec = /tests\/e2e\/tier-matrix\/rn-routing-consolidation-staging\.spec\.ts$/;

const paidProjects = paidAuthEnabled
  ? [
      { name: "setup-paid-auth", testMatch: /tests\/e2e\/setup\/auth\.setup\.ts$/ },
      {
        name: "rn-routing-staging-paid",
        dependencies: ["setup-paid-auth"],
        testMatch: spec,
        grep: /@authenticated/,
        grepInvert: /@mobile|@ca-only/,
        use: { ...devices["Desktop Chrome"], storageState: PAID_USER_AUTH_FILE },
      },
      {
        name: "rn-routing-staging-paid-mobile-pixel",
        dependencies: ["setup-paid-auth"],
        testMatch: spec,
        grep: /@authenticated.*@mobile.*@pixel/,
        use: { ...devices["Pixel 7"], storageState: PAID_USER_AUTH_FILE },
      },
      {
        name: "rn-routing-staging-paid-mobile-iphone",
        dependencies: ["setup-paid-auth"],
        testMatch: spec,
        grep: /@authenticated.*@mobile.*@iphone/,
        use: { ...devices["iPhone 14"], storageState: PAID_USER_AUTH_FILE },
      },
      {
        name: "rn-routing-staging-http",
        dependencies: ["setup-paid-auth"],
        testMatch: spec,
        grep: /@http/,
        use: { storageState: PAID_USER_AUTH_FILE },
      },
    ]
  : [];

const caPaidProjects = caPaidAuthEnabled
  ? [
      { name: "setup-ca-paid-auth", testMatch: /tests\/e2e\/setup\/auth-ca\.setup\.ts$/ },
      {
        name: "rn-routing-staging-ca-paid",
        dependencies: ["setup-ca-paid-auth"],
        testMatch: spec,
        grep: /@ca-only/,
        use: { ...devices["Desktop Chrome"], storageState: CA_PAID_USER_AUTH_FILE },
      },
    ]
  : [];

const anonProjects = [
  {
    name: "rn-routing-staging-anon",
    testMatch: spec,
    grep: /@anonymous/,
    grepInvert: /@mobile|@post-auth/,
    use: { ...devices["Desktop Chrome"], storageState: { cookies: [], origins: [] } },
  },
  {
    name: "rn-routing-staging-anon-mobile",
    testMatch: spec,
    grep: /@anonymous.*@mobile/,
    use: { ...devices["Pixel 7"], storageState: { cookies: [], origins: [] } },
  },
  ...(paidAuthEnabled
    ? [
        {
          name: "rn-routing-staging-anon-post-auth",
          dependencies: ["setup-paid-auth"],
          testMatch: spec,
          grep: /@anonymous.*@post-auth/,
          use: { ...devices["Desktop Chrome"], storageState: { cookies: [], origins: [] } },
        },
      ]
    : []),
];

const projects = [...paidProjects, ...caPaidProjects, ...anonProjects];

export default defineConfig({
  testDir: ".",
  testMatch: [
    /tests\/e2e\/(tier-matrix\/rn-routing-consolidation-staging\.spec|setup\/auth\.setup|setup\/auth-ca\.setup)\.ts$/,
  ],
  fullyParallel: false,
  workers: 1,
  timeout: 240_000,
  expect: { timeout: 45_000 },
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report/rn-routing-staging" }],
    ["json", { outputFile: "test-results/rn-routing-staging/results.json" }],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects,
});
