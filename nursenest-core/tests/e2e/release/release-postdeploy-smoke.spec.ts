/**
 * Post-deploy smoke: no paid credentials. Validates public surface + health only.
 * @see docs/RELEASE_QA.md
 */
import { expect, test } from "@playwright/test";

test.describe("Post-deploy — minimal smoke", () => {
  test("health APIs", async ({ request, baseURL }) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";
    const h = await request.get(`${origin}/api/health`);
    expect(h.status(), `Post-deploy: /api/health must be 200. url=${origin}/api/health category=health`).toBe(200);
    const r = await request.get(`${origin}/api/health/ready`);
    const st = r.status();
    expect([200, 503], `Post-deploy: /api/health/ready unexpected status. url=${origin}/api/health/ready status=${st} category=health`).toContain(st);
  });

  test("marketing home loads", async ({ page, baseURL }) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    expect(
      page.url().startsWith(origin),
      `Post-deploy: home navigation landed off-origin. url=${page.url()} expected origin=${origin} category=routing`,
    ).toBeTruthy();
  });
});
