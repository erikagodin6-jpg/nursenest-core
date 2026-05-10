/**
 * Pre-nursing + allied pathway access (`pathway-prenursing-allied-access.spec.ts`).
 *
 * ## Base URL
 * - `use.baseURL` defaults to `process.env.BASE_URL ?? "http://127.0.0.1:3000"`.
 * - For **remote/staging**, set `BASE_URL` to the full origin (e.g. `https://preview.example.com`).
 *
 * ## Local dev server (webServer)
 * - When `BASE_URL` is **127.0.0.1** or **localhost**, Playwright starts **`npm run dev:next`** (App Router).
 *   Do **not** use `npm run dev` for this suite — that is `server/index.ts`, not Next dev.
 * - **`PLAYWRIGHT_SKIP_WEB_SERVER=1`**: never start `webServer`. You must have an app listening at `BASE_URL`
 *   **before** tests run. The spec’s HTTP preflight fails fast with `prenursing-allied-environment-check.json`
 *   when `/login` is unreachable (e.g. connection refused).
 * - **`PLAYWRIGHT_NO_REUSE_WEB_SERVER=1`**: force a fresh `webServer` process locally (default reuses a healthy listener).
 *
 * ## CI
 * - Either let Playwright start the dev server (localhost `BASE_URL`, do not set `PLAYWRIGHT_SKIP_WEB_SERVER`), or
 * - Build/start the app in a prior step and use `PLAYWRIGHT_SKIP_WEB_SERVER=1` + reachable `BASE_URL`.
 *
 * Run:
 *   `npx playwright test -c playwright.pathways-prenursing-allied.config.ts`
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { localNextDevWebServer } from "./playwright/helpers/local-next-webserver";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

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
    timeoutMs: 180_000,
  });
}

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: "tests/e2e/smoke",
  testMatch: /pathway-prenursing-allied-access\.spec\.ts$/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 900_000,
  expect: { timeout: 45_000 },
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
    ...devices["Desktop Chrome"],
  },
});
