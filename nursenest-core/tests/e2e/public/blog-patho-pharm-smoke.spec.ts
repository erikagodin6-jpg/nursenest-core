import { expect, test, type Page } from "@playwright/test";

/**
 * Smoke: blog index + representative static/marketing article slugs.
 * Static corpus slugs: nursenest-core/src/content/blog-static-posts.ts
 * (used when DB has no live posts or build skips DB reads).
 */
const STATIC_BLOG_SLUGS = [
  "clinical-judgment-on-exam-day",
  "pharmacology-without-memorization-chaos",
  "lab-trends-and-acute-kidney-injury",
] as const;

/** Long-tail SEO trio plan slugs — live only when seeded in DB; skip on 404. */
const OPTIONAL_LT_SEO_SLUGS = {
  pharm: "lt-seo-pharm-ace-inhibitors-nclex-practice",
  /** ACS / coronary pathophysiology plan slug (ECG-adjacent when seeded). */
  coronary: "lt-seo-patho-acs-coronary-pathophysiology-nclex",
} as const;

async function expectArticleOrSkip404(page: Page, url: string): Promise<void> {
  const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 });
  const status = res?.status() ?? 0;
  if (status === 404) {
    test.skip(true, `${url} not in active corpus (DB may override static fallback)`);
  }
  expect(res?.ok(), `${url} status ${status}`).toBeTruthy();
  await expect(page.locator("article")).toBeVisible();
}

test.describe("Blog patho/pharm smoke (static slugs)", () => {
  test("blog index loads", async ({ page }) => {
    const res = await page.goto("/blog", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(res?.ok(), `/blog status ${res?.status()}`).toBeTruthy();
    await expect(page.locator("main")).toBeVisible();
  });

  for (const slug of STATIC_BLOG_SLUGS) {
    test(`article /blog/${slug}`, async ({ page }) => {
      await expectArticleOrSkip404(page, `/blog/${slug}`);
    });
  }

  test("pathophysiology article (static AKI labs corpus)", async ({ page }) => {
    await expectArticleOrSkip404(page, "/blog/lab-trends-and-acute-kidney-injury");
  });

  test("pharmacology article (static pharm study corpus)", async ({ page }) => {
    await expectArticleOrSkip404(page, "/blog/pharmacology-without-memorization-chaos");
  });

  test("ECG reasoning cues surface on static AKI corpus (hyperkalemia ECG)", async ({ page }) => {
    await expectArticleOrSkip404(page, "/blog/lab-trends-and-acute-kidney-injury");
    await expect(page.getByText(/ECG|hyperkalem|potassium/i).first()).toBeVisible();
  });

  test("acid-base / ABG reasoning surface on static AKI corpus", async ({ page }) => {
    await expectArticleOrSkip404(page, "/blog/lab-trends-and-acute-kidney-injury");
    await expect(
      page.locator("article").getByText(/Acid-base|metabolic acidosis|acid–base|acid-base status/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("localized blog index (US RN) — country-specific blog shell", async ({ page }) => {
    const url = "/en/us/rn/nclex-rn/blog";
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 });
    if ((res?.status() ?? 0) === 404) {
      test.skip(true, `${url} not routable in this build (locale gating)`);
    }
    expect(res?.ok(), `${url} ${res?.status()}`).toBeTruthy();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15_000 });
  });

  test("REx-PN blog index (Canada PN pathway)", async ({ page }) => {
    const url = "/en/canada/pn/rex-pn/blog";
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 });
    if ((res?.status() ?? 0) === 404) {
      test.skip(true, `${url} not routable in this build (locale gating)`);
    }
    expect(res?.ok(), `${url} ${res?.status()}`).toBeTruthy();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15_000 });
  });

  test("NCLEX-PN marketing hub (US PN) loads for PN cohort smoke", async ({ page }) => {
    const url = "/us/pn/nclex-pn";
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(res?.ok(), `${url} ${res?.status()}`).toBeTruthy();
    await expect(page.locator("main")).toBeVisible();
  });

  test("optional seeded pharm long-tail article", async ({ page }) => {
    await expectArticleOrSkip404(page, `/blog/${OPTIONAL_LT_SEO_SLUGS.pharm}`);
  });

  test("optional seeded ACS / coronary long-tail article", async ({ page }) => {
    await expectArticleOrSkip404(page, `/blog/${OPTIONAL_LT_SEO_SLUGS.coronary}`);
  });

  test("tag hub pathophysiology", async ({ page }) => {
    const res = await page.goto("/blog/tag/pathophysiology", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(res?.ok(), `/blog/tag/pathophysiology ${res?.status()}`).toBeTruthy();
    await expect(page.locator("main")).toBeVisible();
  });
});
