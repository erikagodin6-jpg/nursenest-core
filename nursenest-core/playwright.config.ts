import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";

/**
 * 🔥 FIX: inline replacement for missing helper
 */
function hasPaidTestCredentials(): boolean {
  return Boolean(
    process.env.E2E_PAID_EMAIL?.trim() &&
      process.env.E2E_PAID_PASSWORD?.trim(),
  );
}

const FREE_USER_AUTH_FILE = "tests/e2e/.auth/free-user.json";
const PAID_USER_AUTH_FILE = "tests/e2e/.auth/paid-user.json";

const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: ".",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  timeout: 180_000,
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});