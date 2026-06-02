/**
 * Public marketing homepage — caching guard for guest traffic.
 *
 * ```
 * npx playwright test tests/e2e/public/public-homepage-caching.spec.ts
 * PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://www.nursenest.ca E2E_PUBLIC_NAV_SLA_MS=2000 npx playwright test tests/e2e/public/public-homepage-caching.spec.ts
 * ```
 */
import { test } from "@playwright/test";
import { runPublicCachingScenario } from "../helpers/public-marketing-caching";

test.describe("Public — guest homepage caching", () => {
  test("reloads stay cached, clean, and within budget", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(120_000);
    await runPublicCachingScenario({
      label: "public-homepage-caching",
      path: "/",
      page,
      baseURL,
      testInfo,
    });
  });
});
