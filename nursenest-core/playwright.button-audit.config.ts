/**
 * Button / control audit suite (inventory + safe interaction + pathway integrity).
 *
 * Excluded from default `playwright.config.ts` — run explicitly:
 *
 *   cd nursenest-core && npm run qa:button-audit
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.example.com npm run qa:button-audit:guest
 *
 * @see tests/e2e/audit/README-button-audit.md
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { FREE_USER_AUTH_FILE, PAID_USER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";

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
  const bindHost = host;
  return {
    command: `npm run dev -- --hostname ${bindHost} --port ${port}`,
    url: origin.origin,
    reuseExistingServer: !process.env.CI,
    timeout: 420_000,
    env: {
      RUN_HEAVY_BUILD_TASKS: "false",
      NEXTAUTH_SECRET: secret,
      AUTH_URL: origin.origin,
      NEXTAUTH_URL: origin.origin,
      ...(process.env.DATABASE_URL?.trim() ? { DATABASE_URL: process.env.DATABASE_URL.trim() } : {}),
      ...(process.env.DATABASE_DIRECT_URL?.trim()
        ? { DATABASE_DIRECT_URL: process.env.DATABASE_DIRECT_URL.trim() }
        : {}),
    },
  } as const;
}

const paidAuthEnabled = hasPaidTestCredentials();
const freeAuthEnabled = Boolean(process.env.E2E_FREE_EMAIL?.trim() && process.env.E2E_FREE_PASSWORD);

const e2eWebServer = localDevWebServer();

const freeProject = freeAuthEnabled
  ? [
      {
        name: "audit-setup-free-auth",
        testMatch: /tests\/e2e\/setup\/auth-free\.setup\.ts$/,
      },
      {
        name: "audit-free",
        testMatch: /button-audit\.free\.spec\.ts$/,
        dependencies: ["audit-setup-free-auth"],
        use: {
          ...devices["Desktop Chrome"],
          storageState: FREE_USER_AUTH_FILE,
        },
      },
    ]
  : [];

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: "tests/e2e/audit",
  testMatch: /button-audit.*\.spec\.ts$/,
  fullyParallel: false,
  workers: 1,
  timeout: 900_000,
  forbidOnly: !!process.env.CI,
  retries: 0,
  expect: { timeout: 45_000 },
  reporter: [["list"], ["./tests/e2e/reporters/paid-user-summary-reporter.ts"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
  },
  projects: [
    {
      name: "audit-guest",
      testMatch: /button-audit\.guest\.spec\.ts$/,
    },
    {
      name: "audit-setup-paid-auth",
      testMatch: paidAuthEnabled
        ? /tests\/e2e\/setup\/auth\.setup\.ts$/
        : /tests\/e2e\/setup\/paid-auth-stub\.setup\.ts$/,
    },
    {
      name: "audit-paid",
      testMatch: /button-audit\.subscriber\.spec\.ts$/,
      dependencies: ["audit-setup-paid-auth"],
      use: {
        ...(paidAuthEnabled ? { storageState: PAID_USER_AUTH_FILE } : {}),
      },
    },
    {
      name: "audit-admin",
      testMatch: /button-audit\.admin\.spec\.ts$/,
    },
    ...freeProject,
  ],
});
