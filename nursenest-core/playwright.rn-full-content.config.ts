/**
 * Full RN lesson crawl + flashcards + question bank + CAT — long-running, paid credentials.
 *
 * Kept out of `playwright.smoke-extended.config.ts` so the extended smoke lane stays bounded.
 *
 *   cd nursenest-core && npm run qa:rn-full-content
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";

/** Keep in sync with `tests/e2e/helpers/rn-full-content-environment.ts` (tests excluded from root tsconfig). */
const RN_FULL_CONTENT_DEFAULT_BASE_URL = "http://127.0.0.1:3000";

function normalizeRnFullContentBaseUrlEnv(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return RN_FULL_CONTENT_DEFAULT_BASE_URL;
  try {
    const u = new URL(trimmed.includes("://") ? trimmed : `http://${trimmed}`);
    if (u.hostname === "localhost" || u.hostname === "[::1]") {
      u.hostname = "127.0.0.1";
    }
    return u.origin;
  } catch {
    return RN_FULL_CONTENT_DEFAULT_BASE_URL;
  }
}

const baseURL = normalizeRnFullContentBaseUrlEnv(process.env.BASE_URL ?? RN_FULL_CONTENT_DEFAULT_BASE_URL);

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
    /** Cold Turbopack + large app: 3m is often insufficient on network/slow disks — align with probe budgets. */
    timeout: 420_000,
    env: {
      RUN_HEAVY_BUILD_TASKS: "false",
      NEXTAUTH_SECRET: secret,
      /** Overrides dotenv `localhost` so Auth.js callbacks match `--hostname 127.0.0.1` and Playwright `use.baseURL`. */
      BASE_URL: origin.origin,
      AUTH_URL: origin.origin,
      NEXTAUTH_URL: origin.origin,
      /** Enables opaque `code=` on credentials callback redirects for RN full-content triage (non-production default in auth). */
      PLAYWRIGHT_DIAGNOSTIC_AUTH_CODES: "1",
      /** POST /api/health/e2e-account-probe — distinguishes missing QA user vs lockout vs subscription (no secrets). */
      NN_E2E_ACCOUNT_PROBE: "1",
    },
  } as const;
}

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: "tests/e2e/smoke",
  testMatch: /rn-full-content-access\.spec\.ts$/,
  testIgnore: [],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  /** Full RN library crawl can run 30–60+ minutes against production-like data — isolated to this config only. */
  timeout: 3_600_000,
  expect: { timeout: 45_000 },
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
