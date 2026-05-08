/**
 * Tier matrix E2E: multi-tier signup (anonymous) + cross-tier gating + paid owned-pathway depth.
 *
 *   cd nursenest-core && npm run test:e2e:tier-matrix
 *   npm run test:e2e:tier-matrix -- --grep "cross-tier|signup"
 *
 * Paid projects require `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` (see `paid-test-credentials.ts`).
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

const paidAuthEnabled = hasPaidTestCredentials();
const e2eWebServer = localDevWebServer();

const paidTierSpecs =
  /tests\/e2e\/tier-matrix\/tier-matrix-(cross-tier-gating|paid-owned-pathway)\.spec\.ts$/;
const anonTierSpecs =
  /tests\/e2e\/tier-matrix\/tier-matrix-(signup-multi-tier|public-marketing-smoke)\.spec\.ts$/;

/** Include paid-auth setup so `dependencies` resolves when `chromium-tier-paid` runs. */
const rootTestMatch = /tests\/e2e\/(tier-matrix\/.*\.spec|setup\/auth\.setup)\.ts$/;

const projects = paidAuthEnabled
  ? [
      { name: "setup-paid-auth", testMatch: /tests\/e2e\/setup\/auth\.setup\.ts$/ },
      {
        name: "chromium-tier-paid",
        dependencies: ["setup-paid-auth"],
        testMatch: paidTierSpecs,
        use: {
          ...devices["Desktop Chrome"],
          storageState: PAID_USER_AUTH_FILE,
        },
      },
      {
        name: "chromium-tier-anon",
        testMatch: anonTierSpecs,
        use: { ...devices["Desktop Chrome"] },
      },
    ]
  : [
      {
        name: "chromium-tier-anon",
        testMatch: anonTierSpecs,
        use: { ...devices["Desktop Chrome"] },
      },
    ];

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: ".",
  testMatch: rootTestMatch,
  fullyParallel: false,
  workers: paidAuthEnabled ? 2 : 1,
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
