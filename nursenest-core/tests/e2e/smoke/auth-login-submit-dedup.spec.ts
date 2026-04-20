import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

function isCredentialsPost(req: { method: string; url: string }): boolean {
  return req.method === "POST" && req.url().includes("/api/auth/callback/credentials");
}

test.describe("Smoke — login submit dedup", () => {
  test("rapid sequential submits send only one credentials POST", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /log in|sign in/i })).toBeVisible({ timeout: 30_000 });

    let credentialPosts = 0;
    page.on("request", (req) => {
      if (isCredentialsPost(req)) credentialPosts += 1;
    });

    await page.locator("#login-identifier").fill("not-a-real-user@example.invalid");
    await page.locator("#login-password").fill("wrong-password");

    const submit = page
      .locator("form")
      .filter({ has: page.locator("#login-identifier") })
      .locator('button[type="submit"]')
      .first();

    await submit.click({ delay: 0 });
    await submit.click({ delay: 0 });

    await expect(page.getByRole("alert")).toBeVisible({ timeout: 20_000 });
    await expect.poll(() => credentialPosts, { timeout: 15_000 }).toBe(1);

    const body = await page.locator("body").innerText().catch(() => "");
    expect(body, "login must not surface raw API rate-limit JSON").not.toContain("rate_limit_exceeded");
    expect(body, "login must not surface raw JSON error bodies").not.toMatch(/\{\s*"error"\s*:\s*"Too many requests"/);
  });
});
