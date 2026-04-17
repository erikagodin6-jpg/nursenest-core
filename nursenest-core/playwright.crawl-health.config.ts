/**
 * Public crawl-health regression — unauthenticated HTTP audit (sitemap + seeds).
 *
 * Local (starts dev server unless PLAYWRIGHT_SKIP_WEB_SERVER=1):
 *   npm run qa:crawl-health
 *
 * Production / staging (read-only, bounded):
 *   PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.nursenest.ca npm run qa:crawl-health:remote
 *
 * Env tuning: CRAWL_MAX_SITEMAP_URLS, CRAWL_MAX_REDIRECT_HOPS, CRAWL_MAX_INTERNAL_LINK_CHECKS,
 * CRAWL_LINK_SAMPLE_HTML_PAGES, CRAWL_CONCURRENCY (see tests/e2e/crawl-health/helpers/crawl-limits.ts)
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
  const bindHost = host;
  return {
    command: `npm run dev -- --hostname ${bindHost} --port ${port}`,
    url: origin.origin,
    reuseExistingServer: !process.env.CI,
    timeout: 420_000,
    env: {
      RUN_HEAVY_BUILD_TASKS: "false",
      NEXTAUTH_SECRET: secret,
      AUTH_URL: origin.origin,
      NEXTAUTH_URL: origin.origin,
    },
  } as const;
}

export default defineConfig({
  testDir: "tests/e2e/crawl-health",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 600_000,
  expect: { timeout: 30_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "off",
    video: "off",
    ...devices["Desktop Chrome"],
  },
  webServer: localDevWebServer(),
});
