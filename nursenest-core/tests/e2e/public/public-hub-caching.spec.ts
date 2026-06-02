import { test } from "@playwright/test";
import { runPublicCachingScenario } from "../helpers/public-marketing-caching";

const HUB_PATHS = ["/exams/india", "/exams/japan", "/exams/germany"] as const;

test.describe("Public — exam hub caching", () => {
  for (const path of HUB_PATHS) {
    test(`${path} reloads stay cached, clean, and within budget`, async ({ page, baseURL }, testInfo) => {
      test.setTimeout(120_000);
      await runPublicCachingScenario({
        label: `public-hub-caching-${path.replace(/\//g, "-").replace(/^-+/, "")}`,
        path,
        page,
        baseURL,
        testInfo,
      });
    });
  }
});
