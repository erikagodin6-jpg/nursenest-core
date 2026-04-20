import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Post-login marketing continuity", () => {
  test("FAQ marketing page login link callback resumes FAQ not app root", async ({ page, baseURL }) => {
    const origin = (() => {
      try {
        return new URL(baseURL ?? "http://127.0.0.1:3000").origin;
      } catch {
        return "http://127.0.0.1:3000";
      }
    })();

    await page.goto(`${origin}/faq`, { waitUntil: "domcontentloaded", timeout: 60_000 });

    const loginLink = page.locator(`a[href*="/login"][href*="callbackUrl"]`).first();
    await expect(loginLink).toBeVisible({ timeout: 30_000 });
    const href = await loginLink.getAttribute("href");
    expect(href).toBeTruthy();
    const abs = href!.startsWith("http") ? href! : `${origin}${href!.startsWith("/") ? "" : "/"}${href}`;
    const u = new URL(abs);
    const cb = u.searchParams.get("callbackUrl");
    expect(cb).toBeTruthy();
    const decoded = decodeURIComponent(cb!);
    expect(decoded).toMatch(/faq/i);
    expect(decoded).not.toMatch(/^\/app\/?$/);
  });
});
