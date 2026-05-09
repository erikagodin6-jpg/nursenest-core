/**
 * Pathway hub premium module grids — guest interactivity, tier gates (ECG/NP cases), HTTP sanity, screenshots.
 *
 * Base URL resolution (first match wins):
 * - `PLAYWRIGHT_BASE_URL`
 * - `BASE_URL`
 * - `http://127.0.0.1:3000`
 *
 * Local dev server starts automatically when base URL is localhost/127.0.0.1 unless `PLAYWRIGHT_SKIP_WEB_SERVER=1`.
 *
 * Run:
 *   cd nursenest-core && npm run test:e2e:hub-modules
 *
 * Remote / staging:
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=https://preview.example.com npm run test:e2e:hub-modules
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
    readyUrl: origin.origin,
    timeoutMs: 300_000,
    envExtra: {
      /** Satisfy `validateRuntimeEnvOrThrow` for local `next dev` when host `.env` omits AI keys. */
      AI_ADMIN_GENERATION_ENABLED: process.env.AI_ADMIN_GENERATION_ENABLED?.trim() || "false",
      OPENAI_API_KEY:
        process.env.OPENAI_API_KEY?.trim() || process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim() || "playwright-placeholder-openai",
    },
  });
}

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: "tests/e2e/public",
  testMatch: /pathway-hub-premium-modules-interaction\.spec\.ts$/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 420_000,
  expect: { timeout: 90_000 },
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
    launchOptions: {
      args: ["--disable-dev-shm-usage"],
    },
    ...devices["Desktop Chrome"],
  },
});
