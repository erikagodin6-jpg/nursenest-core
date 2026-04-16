/**
 * Pre-nursing + allied pathway access (`pathway-prenursing-allied-access.spec.ts`).
 *
 * ## Base URL
 * - `use.baseURL` defaults to `process.env.BASE_URL ?? "http://127.0.0.1:3000"`.
 * - For **remote/staging**, set `BASE_URL` to the full origin (e.g. `https://preview.example.com`).
 *
 * ## Local dev server (webServer)
 * - When `BASE_URL` points at **127.0.0.1** or **localhost**, Playwright can start `npm run dev` automatically
 *   (see `localDevWebServer()` below), unless you opt out.
 * - **`PLAYWRIGHT_SKIP_WEB_SERVER=1`**: never start `webServer`. You must have an app listening at `BASE_URL`
 *   (or the default `http://127.0.0.1:3000`) **before** tests run. The spec’s HTTP preflight fails fast with
 *   `prenursing-allied-environment-check.json` when `/login` is unreachable (e.g. connection refused).
 *
 * ## CI
 * - Either let Playwright start the dev server (localhost `BASE_URL`, do not set `PLAYWRIGHT_SKIP_WEB_SERVER`), or
 * - Build/start the app in a prior step and use `PLAYWRIGHT_SKIP_WEB_SERVER=1` + reachable `BASE_URL`.
 *
 * Run: `npm run qa:pathways:prenursing-allied`
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";

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
  const secret = process.env.NEXTAUTH_SECRET?.trim() || "playwright-e2e-local-secret";
  return {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: origin.origin,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      RUN_HEAVY_BUILD_TASKS: "false",
      NEXTAUTH_SECRET: secret,
      AUTH_URL: origin.origin,
      NEXTAUTH_URL: origin.origin,
    },
  } as const;
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
