import { test } from "@playwright/test";
import { runPublicCachingScenario } from "../helpers/public-marketing-caching";

const EXAM_HUB_PATH = process.env.E2E_PUBLIC_EXAM_HUB_PATH?.trim() || "/exams/india";

test.describe("Public — guest exam hub caching", () => {
  test("hub reloads stay cached, clean, and within budget", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(120_000);
    await runPublicCachingScenario({
      label: "public-hub-caching",
      path: EXAM_HUB_PATH,
      page,
      baseURL,
      testInfo,
    });
  });
});
