import { test } from "@playwright/test";
import { runPublicCachingScenario } from "../helpers/public-marketing-caching";

const BLOG_PATH = process.env.E2E_PUBLIC_BLOG_PATH?.trim() || "/blog";

test.describe("Public — guest blog caching", () => {
  test("blog reloads stay cached, clean, and within budget", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(120_000);
    await runPublicCachingScenario({
      label: "public-blog-caching",
      path: BLOG_PATH,
      page,
      baseURL,
      testInfo,
    });
  });
});
