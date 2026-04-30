/**
 * Clinical scenario monetization E2E (free stage-1 / paid full / staff QA / cross-tier).
 *
 *   cd nursenest-core && npm run test:e2e:clinical-scenarios
 *
 * Requires `DATABASE_URL`, `NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS=true` (injected via webServer env),
 * scenario ids (`E2E_CLINICAL_*`), and credential envs documented in `clinical-scenario-monetization-env.ts`.
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
  const secret = process.env.NEXTAUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim() || "playwright-e2e-local-secret";
  const dbUrl = process.env.DATABASE_URL?.trim();
  const readyUrl = `${origin.origin}/api/auth/csrf`;
  return {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: readyUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      RUN_HEAVY_BUILD_TASKS: "false",
      NEXT_PUBLIC_ENABLE_CLINICAL_SCENARIOS: "true",
      NEXTAUTH_SECRET: secret,
      AUTH_SECRET: process.env.AUTH_SECRET?.trim() || secret,
      AUTH_URL: origin.origin,
      NEXTAUTH_URL: origin.origin,
      ...(dbUrl ? { DATABASE_URL: dbUrl } : {}),
    },
  } as const;
}

const paidAuthEnabled = hasPaidTestCredentials();
const e2eWebServer = localDevWebServer();
const clinicalSpec = /tests\/e2e\/clinical-scenarios\/clinical-scenario-monetization\.spec\.ts$/;
const rootTestMatch = /tests\/e2e\/(clinical-scenarios\/.*\.spec|setup\/auth\.setup)\.ts$/;

const projects = paidAuthEnabled
  ? [
      { name: "setup-paid-auth", testMatch: /tests\/e2e\/setup\/auth\.setup\.ts$/ },
      {
        name: "chromium-clinical-monetization",
        dependencies: ["setup-paid-auth"],
        testMatch: clinicalSpec,
        use: {
          ...devices["Desktop Chrome"],
          storageState: PAID_USER_AUTH_FILE,
        },
      },
    ]
  : [
      {
        name: "chromium-clinical-monetization",
        testMatch: clinicalSpec,
        use: { ...devices["Desktop Chrome"] },
      },
    ];

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: ".",
  testMatch: rootTestMatch,
  fullyParallel: false,
  workers: 1,
  timeout: 240_000,
  expect: { timeout: 45_000 },
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects,
});
