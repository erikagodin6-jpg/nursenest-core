/**
 * Pre-Nursing marketing hub — module grid, breadcrumbs, quick study modes.
 *
 * Run:
 *   cd nursenest-core && npm run test:e2e:pre-nursing-hub
 *
 * Most reproducible local flow:
 *   npm run dev:next:3000
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run test:e2e:pre-nursing-hub
 *
 * Remote / staging:
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=https://preview.example.com npm run test:e2e:pre-nursing-hub
 *
 * Reliability notes:
 * - Integrated `webServer` uses `npm run dev:next:3000` (auth-secret assert + node memory shim + fixed port).
 * - If the dev server OOMs, compile hangs, or env validation fails in the **server terminal**, set
 *   `PLAYWRIGHT_SKIP_WEB_SERVER=1`, start the app yourself, then tee logs for triage, e.g.:
 *     `npm run dev:next:3000 2>&1 | tee /tmp/nn-next-dev.log`
 * - Global setup runs `scripts/qa/wait-for-app-ready.mjs` (default **guest** mode: `/app` may **302/307** to login) after the dev server is listening.
 * - `PLAYWRIGHT_NO_REUSE_WEB_SERVER=1`: never reuse an existing listener locally (default reuses when not CI).
 * - **Exit 143 (`SIGTERM`):** CI runners, OOM killers, or duplicate `next dev` port fights often end the child with 143.
 *   Prefer `PLAYWRIGHT_SKIP_WEB_SERVER=1` + one manual `npm run dev:next:3000`, confirm `ss -ltnp 'sport = :3000'`, then rerun tests.
 * - **Port collision:** `dev:next:3000` exits if `:3000` is taken unless `DEV_NEXT_ALLOW_PORT_CLASH=1` (last resort).
 */
import "./playwright.env";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const configDir = path.dirname(fileURLToPath(import.meta.url));

const baseURL =
  process.env.PLAYWRIGHT_BASE_URL?.trim() ||
  process.env.SCREENSHOT_BASE_URL?.trim() ||
  process.env.BASE_URL?.trim() ||
  "http://127.0.0.1:3000";

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
  const devHost = host === "localhost" ? "127.0.0.1" : host;
  const readyUrl = `${origin.origin}/login`;
  return {
    command: "npm run dev:next:3000",
    cwd: configDir,
    url: readyUrl,
    reuseExistingServer: process.env.PLAYWRIGHT_NO_REUSE_WEB_SERVER === "1" ? false : !process.env.CI,
    timeout: 900_000,
    env: {
      RUN_HEAVY_BUILD_TASKS: "false",
      DEV_NEXT_PORT: port,
      DEV_NEXT_HOST: devHost,
      AUTH_URL: origin.origin,
      NEXTAUTH_URL: origin.origin,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL?.trim() || origin.origin,
    },
  } as const;
}

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  globalSetup: "./tests/e2e/pre-nursing-hub.global-setup.ts",
  testDir: "tests/e2e",
  testMatch: /(?:public\/pre-nursing-hub-complete|marketing\/pre-nursing-hub-premium-modules)\.spec\.ts$/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 900_000,
  expect: { timeout: 120_000 },
  reporter: [["list"]],
  projects: [
    {
      name: "chromium",
      use: {
        baseURL,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "off",
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
