/**
 * Optional production (or staging) checks for blog list, public flashcard JSON, flashcards hub, and Canada RN lessons hub.
 *
 * Skipped unless `MARKETING_STUDY_SMOKE_BASE_URL` is set (no trailing slash), e.g.:
 *   MARKETING_STUDY_SMOKE_BASE_URL=https://www.nursenest.ca npx playwright test tests/e2e/public/marketing-study-surfaces-production-gate.spec.ts --project=chromium
 */
import { expect, test } from "@playwright/test";

const base = process.env.MARKETING_STUDY_SMOKE_BASE_URL?.trim().replace(/\/$/, "") ?? "";

test.describe("Marketing study surfaces (env-gated)", () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.skip(!base, "Set MARKETING_STUDY_SMOKE_BASE_URL (e.g. https://www.nursenest.ca)");
  });

  test("blog index returns article links", async ({ request }) => {
    const res = await request.get(`${base}/blog`, { timeout: 60_000 });
    expect(res.ok(), `GET /blog ${res.status()}`).toBeTruthy();
    const html = await res.text();
    expect(html.length, "blog HTML body").toBeGreaterThan(10_000);
    const articleHrefs = html.match(/href="(\/blog\/[a-z0-9-]{8,200})"/g) ?? [];
    const unique = new Set(articleHrefs.map((h) => h.replace(/^href="|"$/g, "")));
    expect(unique.size, "distinct /blog/{slug} hrefs in HTML").toBeGreaterThanOrEqual(8);
  });

  test("public flashcard tags API returns JSON array (may be empty if cache cold)", async ({ request }) => {
    const res = await request.get(`${base}/api/public/flashcard-tags`, { timeout: 45_000 });
    expect(res.ok(), `GET flashcard-tags ${res.status()}`).toBeTruthy();
    const ct = res.headers()["content-type"] ?? "";
    expect(ct, "content-type should be JSON").toMatch(/application\/json/i);
    const body = (await res.json()) as { tags?: unknown };
    expect(Array.isArray(body.tags), "`tags` must be an array").toBe(true);
  });

  test("flashcards marketing hub loads", async ({ page }) => {
    const r = await page.goto(`${base}/flashcards`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    expect(r?.ok(), `HTTP ${r?.status()}`).toBeTruthy();
    await expect(page.locator("main")).toBeVisible({ timeout: 30_000 });
    const text = (await page.locator("main").innerText()).toLowerCase();
    expect(text.length).toBeGreaterThan(200);
  });

  test("Canada RN lessons hub shows library and lesson links resolve", async ({ page }) => {
    const r = await page.goto(`${base}/canada/rn/nclex-rn/lessons`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    expect(r?.ok(), `HTTP ${r?.status()}`).toBeTruthy();
    await expect(page.locator("#pathway-lesson-library")).toBeVisible({ timeout: 90_000 });
    await expect(page.getByText("Lessons temporarily unavailable")).toHaveCount(0);
    const lessonLinks = page.locator('#pathway-lesson-library a[href*="/lessons/"]');
    await expect(lessonLinks.first()).toBeVisible({ timeout: 60_000 });
    const n = await lessonLinks.count();
    expect(n, "at least 8 lesson links on hub").toBeGreaterThanOrEqual(8);
    const href = (await lessonLinks.first().getAttribute("href"))?.trim();
    expect(href).toBeTruthy();
    const detail = await page.goto(href!.startsWith("http") ? href! : `${base}${href}`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    expect(detail?.ok(), `lesson detail ${href}`).toBeTruthy();
    expect(detail?.status() ?? 0).toBeLessThan(400);
  });
});
