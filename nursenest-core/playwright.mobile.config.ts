/**
 * Mobile viewport regression — Pixel + iPhone profiles, horizontal overflow guards.
 *
 *   cd nursenest-core && npm run test:e2e:mobile
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.example.com npm run test:e2e:mobile
 *
 * Paid authenticated specs require `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` (or QA / PLAYWRIGHT_TEST aliases)
 * and run in dedicated projects after `setup-paid-auth`.
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";
import { localNextDevWebServer } from "./playwright/helpers/local-next-webserver";
import { PAID_USER_AUTH_FILE } from "./tests/e2e/helpers/auth-state-paths";
import { hasPaidTestCredentials } from "./tests/e2e/helpers/paid-test-credentials";

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
    readyUrl: `${origin.origin}/api/auth/csrf`,
    timeoutMs: 300_000,
  });
}

const paidAuthEnabled = hasPaidTestCredentials();
const e2eWebServer = localDevWebServer();

const publicMobileMatch = /tests\/e2e\/mobile\/(mobile-regression|mobile-marketing-routes|mobile-learner-free-layout)\.spec\.ts$/;
const paidMobileMatch =
  /tests\/e2e\/mobile\/mobile-learner-(authenticated-layout|study-interactions)\.spec\.ts$/;

const publicProjects = [
  {
    name: "mobile-pixel",
    use: { ...devices["Pixel 7"] },
    testMatch: publicMobileMatch,
  },
  {
    /** Runs after Pixel so a single `next dev` webServer is less likely to be wedged mid-suite. */
    name: "mobile-iphone",
    dependencies: ["mobile-pixel" as const],
    use: { ...devices["iPhone 14"] },
    testMatch: publicMobileMatch,
  },
] as const;

const paidProjects = paidAuthEnabled
  ? ([
      {
        name: "setup-paid-auth",
        testMatch: /tests\/e2e\/setup\/auth\.setup\.ts$/,
      },
      {
        name: "mobile-paid-pixel",
        dependencies: ["setup-paid-auth" as const],
        use: {
          ...devices["Pixel 7"],
          storageState: PAID_USER_AUTH_FILE,
        },
        testMatch: paidMobileMatch,
      },
      {
        name: "mobile-paid-iphone",
        dependencies: ["setup-paid-auth" as const],
        use: {
          ...devices["iPhone 14"],
          storageState: PAID_USER_AUTH_FILE,
        },
        testMatch: paidMobileMatch,
      },
    ] as const)
  : [];

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: ".",
  testIgnore: [/^\.next[\\/]/, /[\\/]\.next[\\/]/, /[\\/]node_modules[\\/]/],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  /* Single worker avoids starving `next dev` when slow routes (e.g. /blog SSR) run in parallel with Pixel + WebKit. */
  workers: 1,
  /* Cold `next dev` + marketing SSR can exceed 3m on some routes; keep above slowest goto budget. */
  timeout: 300_000,
  expect: { timeout: 60_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
  },
  reporter: [["list"]],
  projects: [...publicProjects, ...paidProjects],
});
