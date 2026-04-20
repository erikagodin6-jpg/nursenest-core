import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

function marketingOrigin(baseURL: string | undefined): string {
  try {
    return new URL(baseURL ?? "http://127.0.0.1:3000").origin;
  } catch {
    return "http://127.0.0.1:3000";
  }
}

async function expectHeaderLoginCallbackResumesPath(page: import("@playwright/test").Page, origin: string, pathHint: RegExp) {
  const loginLink = page.locator(`header a[href*="/login"][href*="callbackUrl"]`).first();
  await expect(loginLink).toBeVisible({ timeout: 30_000 });
  const href = await loginLink.getAttribute("href");
  expect(href).toBeTruthy();
  const abs = href!.startsWith("http") ? href! : `${origin}${href!.startsWith("/") ? "" : "/"}${href}`;
  const u = new URL(abs);
  const cb = u.searchParams.get("callbackUrl");
  expect(cb).toBeTruthy();
  const decoded = decodeURIComponent(cb!);
  expect(decoded).toMatch(pathHint);
  expect(decoded).not.toMatch(/^\/app\/?(\?|$)/);
}

test.describe("Post-login marketing continuity", () => {
  test("FAQ marketing page login link callback resumes FAQ not app root", async ({ page, baseURL }) => {
    const origin = marketingOrigin(baseURL);
    await page.goto(`${origin}/faq`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await expectHeaderLoginCallbackResumesPath(page, origin, /faq/i);
  });

  test("homepage header login preserves marketing shell (not bare /app)", async ({ page, baseURL }) => {
    const origin = marketingOrigin(baseURL);
    await page.goto(`${origin}/`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await expectHeaderLoginCallbackResumesPath(page, origin, /^\/(\?|$)/);
  });

  test("pricing header login preserves pricing path", async ({ page, baseURL }) => {
    const origin = marketingOrigin(baseURL);
    await page.goto(`${origin}/pricing`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await expectHeaderLoginCallbackResumesPath(page, origin, /pricing/i);
  });

  test("blog index header login preserves blog path", async ({ page, baseURL }) => {
    const origin = marketingOrigin(baseURL);
    await page.goto(`${origin}/blog`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await expectHeaderLoginCallbackResumesPath(page, origin, /blog/i);
  });

  test("public lessons hub keeps explicit study signup callback to /app/lessons", async ({ page, baseURL }) => {
    const origin = marketingOrigin(baseURL);
    await page.goto(`${origin}/lessons`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    const signup = page.locator(`a[href*="/signup"][href*="callbackUrl=%2Fapp%2Flessons"]`).first();
    await expect(signup).toBeVisible({ timeout: 30_000 });
    const href = await signup.getAttribute("href");
    expect(href).toBeTruthy();
    const abs = href!.startsWith("http") ? href! : `${origin}${href!.startsWith("/") ? "" : "/"}${href}`;
    const u = new URL(abs);
    const cb = u.searchParams.get("callbackUrl");
    expect(cb).toBeTruthy();
    expect(decodeURIComponent(cb!)).toBe("/app/lessons");
  });
});
