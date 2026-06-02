import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

function localWebServer() {
  if (process.env.PLAYWRIGHT_SKIP_WEB_SERVER === "1") return undefined;
  const u = new URL(baseURL);
  if (!["127.0.0.1", "localhost"].includes(u.hostname)) return undefined;
  return {
    command: `npx next dev --webpack --hostname ${u.hostname} --port ${u.port || "3000"}`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 180_000,
    env: {
      ...process.env,
      NEXT_PUBLIC_ENABLE_MARKETING_LOCALES: "true",
      AUTH_SECRET: process.env.AUTH_SECRET ?? "i18n-route-test-secret-do-not-use",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "i18n-route-test-secret-do-not-use",
      AI_ADMIN_GENERATION_ENABLED: process.env.AI_ADMIN_GENERATION_ENABLED ?? "false",
      AI_INTEGRATIONS_OPENAI_API_KEY: process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "not-used-in-i18n-route-tests",
    },
  };
}

export default defineConfig({
  testDir: "tests/e2e/i18n",
  testMatch: /i18n-route-readiness\.spec\.ts$/,
  fullyParallel: false,
  workers: 1,
  timeout: 240_000,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
  },
  ...(localWebServer() ? { webServer: localWebServer() } : {}),
});
