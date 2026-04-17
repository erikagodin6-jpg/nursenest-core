import { expect, test } from "@playwright/test";
import { runPublicCachingScenario } from "../helpers/public-marketing-caching";

test.describe("Public — blog caching", () => {
  test("blog index reloads stay cached, clean, and within budget", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(120_000);
    await runPublicCachingScenario({
      label: "public-blog-caching-index",
      path: "/blog",
      page,
      baseURL,
      testInfo,
    });
  });

  test("first blog post reload stays cached when a post is published", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(120_000);
    const response = await page.goto("/blog", { waitUntil: "domcontentloaded", timeout: 60_000 });
    expect(response?.status(), "HTTP status for /blog").toBeLessThan(400);

    const firstPostHref = await page
      .locator('a[href^="/blog/"]')
      .evaluateAll((anchors) =>
        anchors
          .map((anchor) => anchor.getAttribute("href"))
          .find((href) => typeof href === "string" && href !== "/blog"),
      );

    test.skip(!firstPostHref, "No published blog post href found on /blog.");

    await runPublicCachingScenario({
      label: "public-blog-caching-post",
      path: firstPostHref!,
      page,
      baseURL,
      testInfo,
    });
  });
});
