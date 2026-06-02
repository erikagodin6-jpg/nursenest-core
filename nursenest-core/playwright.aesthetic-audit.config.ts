/**
 * Aesthetic / layout regression audit — screenshot inventory + lightweight checks (Ocean / Blossom / Midnight).
 *
 *   cd nursenest-core && npx playwright test -c playwright.aesthetic-audit.config.ts
 *
 * Requires local dev when PLAYWRIGHT_BASE_URL points at localhost (auto-starts Next like visual-qa).
 *
 * @see docs/reports/aesthetic-visual-audit.md
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { localNextDevWebServer } from "./playwright/helpers/local-next-webserver";

const baseURL =
  process.env.PLAYWRIGHT_BASE_URL?.trim() ||
  process.env.BASE_URL?.trim() ||
  "http://127.0.0.1:3000";

function localDevWebServer() {
  let origin: URL;
  try {
    origin = new URL(baseURL);
  } catch {
    return undefined;
  }
  return localNextDevWebServer({
    baseURL,
    readyUrl: `${origin.origin}/`,
    timeoutMs: 300_000,
    reuseExistingServer: !process.env.CI,
    envExtra: {
      AI_ADMIN_GENERATION_ENABLED: process.env.AI_ADMIN_GENERATION_ENABLED?.trim() || "false",
      OPENAI_API_KEY:
        process.env.OPENAI_API_KEY?.trim() ||
        process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim() ||
        "playwright-placeholder-openai",
    },
  });
}

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: "tests/e2e/visual-qa",
  testIgnore: [/^\.next[\\/]/, /[\\/]\.next[\\/]/, /[\\/]node_modules[\\/]/, /[\\/]dist[\\/]/],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 300_000,
  expect: { timeout: 30_000 },
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "off",
    screenshot: "off",
  },
  projects: [
    {
      name: "aesthetic-audit",
      // Before/after captures use project `aesthetic-before-after` below.
      testMatch: /aesthetic-visual-audit\.(public|authenticated|learner-sessions)\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        reducedMotion: "reduce",
        // Avoid renderer "Page crashed" in Docker / low-shm CI when Next dev is heavy.
        launchOptions: {
          args: ["--disable-dev-shm-usage", "--no-sandbox"],
        },
      },
    },
    {
      name: "rn-cat-mockup-capture",
      testMatch: /rn-cat-exam-mockup-capture\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        reducedMotion: "reduce",
        launchOptions: {
          args: ["--disable-dev-shm-usage", "--no-sandbox"],
        },
      },
    },
    {
      name: "aesthetic-before-after",
      testMatch: /aesthetic-before-after\.capture\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        reducedMotion: "reduce",
        launchOptions: {
          args: ["--disable-dev-shm-usage", "--no-sandbox"],
        },
      },
    },
  ],
});
