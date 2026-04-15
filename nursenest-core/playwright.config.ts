import { defineConfig, devices } from "@playwright/test";
import { PAID_USER_AUTH_FILE } from "./e2e/paid-auth-state-path";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

/** Paid E2E projects only when creds are present — avoids loading missing `storageState` when setup would skip. */
const paidAuthEnabled = Boolean(
  process.env.E2E_PAID_EMAIL?.trim() && process.env.E2E_PAID_PASSWORD,
);

const paidProjects = paidAuthEnabled
  ? ([
      {
        name: "setup-paid-auth",
        testMatch: /e2e\/auth-paid\.setup\.ts$/,
      },
      {
        name: "chromium-paid",
        testMatch: /paid-user-smoke\.spec\.ts$/,
        dependencies: ["setup-paid-auth"],
        use: {
          ...devices["Desktop Chrome"],
          storageState: PAID_USER_AUTH_FILE,
        },
      },
    ] as const)
  : [];

export default defineConfig({
  testDir: ".",
  testMatch: ["e2e/**/*.spec.ts", "tests/e2e/**/*.spec.ts"],
  testIgnore: ["**/.next/**", "**/node_modules/**", "**/dist/**"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  timeout: 180_000,
  expect: { timeout: 30_000 },
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    ...paidProjects,
    {
      name: "chromium",
      testIgnore: [/lesson-flows\.mobile\.spec\.ts$/, /paid-user-smoke\.spec\.ts$/],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      testMatch: /lesson-flows\.mobile\.spec\.ts$/,
      use: { ...devices["iPhone 12"] },
    },
  ],
});
