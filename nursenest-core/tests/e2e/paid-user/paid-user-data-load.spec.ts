/**
 * Data-load safety: API caps, no oversized list payloads, i18n asset route.
 */
import { expect, test } from "@playwright/test";
import { expectPaidLearnerShellReady } from "../helpers/paid-learner-shell";
import { expectNotLoginUrl } from "../helpers/paid-user-suite";

test.describe("Paid user — data load limits", () => {
  test("APIs reject excessive page sizes; lessons hub renders", async ({ page, baseURL }) => {
    const origin = baseURL ?? "";
    await page.goto(`${origin}/app`, { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectPaidLearnerShellReady(page, "data-load /app");

    const lessonsRes = await page.request.get(`${origin}/api/lessons?pageSize=500&page=1`);
    expect(lessonsRes.status()).toBe(400);
    const lessonsJson = (await lessonsRes.json()) as { code?: string; maxPageSize?: number };
    expect(lessonsJson.code).toBe("page_size_limit");
    expect(lessonsJson.maxPageSize).toBe(100);

    const questionsRes = await page.request.get(`${origin}/api/questions?page=1&pageSize=99`);
    expect(questionsRes.status()).toBe(400);
    const questionsJson = (await questionsRes.json()) as { code?: string };
    expect(questionsJson.code).toBe("page_size_limit");

    const i18nRes = await page.request.get(`${origin}/api/assets/i18n/en.json`);
    expect(i18nRes.ok()).toBeTruthy();
    const ct = i18nRes.headers()["content-type"] ?? "";
    expect(ct).toMatch(/json/i);

    await page.goto(`${origin}/app/lessons`, { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectPaidLearnerShellReady(page, "data-load /app/lessons");
    const main = page.locator("main");
    await expect(main).toBeVisible({ timeout: 60_000 });
    const t = await main.innerText();
    expect(t.trim().length).toBeGreaterThan(30);
  });
});
