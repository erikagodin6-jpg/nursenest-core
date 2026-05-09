import { expect, test, type Page } from "@playwright/test";

/**
 * When set (comma / semicolon / whitespace separated), each slug is treated as a **published**
 * first-batch post: tests **fail** on 404 or missing `/blog` list link within the first
 * `BLOG_FIRST_BATCH_INDEX_MAX_PAGES` pages (default 5, max 10).
 *
 * @example BLOG_FIRST_BATCH_SLUGS=slug-one,slug-two npx playwright test …/blog-patho-pharm-smoke.spec.ts
 */
function slugsFromFirstBatchEnv(): string[] {
  const raw = process.env.BLOG_FIRST_BATCH_SLUGS?.trim();
  if (!raw) return [];
  return Array.from(new Set(raw.split(/[\s,;]+/g).map((s) => s.trim()).filter(Boolean)));
}

async function expectRequiredPublishedArticle(page: Page, slug: string): Promise<void> {
  const path = `/blog/${encodeURIComponent(slug)}`;
  const res = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 120_000 });
  const status = res?.status() ?? 0;
  expect(status, `${path} must not 404 when BLOG_FIRST_BATCH_SLUGS is set (got ${status})`).not.toBe(404);
  expect(res?.ok(), `${path} status ${status}`).toBeTruthy();
  await expect(page.locator("article")).toBeVisible({ timeout: 30_000 });
}

const FIRST_BATCH_INDEX_LINK_MAX_PAGES = Math.min(
  10,
  Math.max(1, Math.floor(Number(process.env.BLOG_FIRST_BATCH_INDEX_MAX_PAGES ?? "5")) || 5),
);

async function expectIndexLinkWithinPages(page: Page, slug: string): Promise<void> {
  const href = `/blog/${slug}`;
  const link = page.locator(`a[href="${href}"]`).first();
  for (let p = 1; p <= FIRST_BATCH_INDEX_LINK_MAX_PAGES; p += 1) {
    const listPath = p <= 1 ? "/blog" : `/blog?page=${p}`;
    const res = await page.goto(listPath, { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(res?.ok(), `${listPath} ${res?.status()}`).toBeTruthy();
    if ((await link.count()) > 0) {
      await expect(link).toBeVisible({ timeout: 15_000 });
      return;
    }
  }
  throw new Error(
    `No index link for ${href} in first ${FIRST_BATCH_INDEX_LINK_MAX_PAGES} /blog list pages (raise BLOG_FIRST_BATCH_INDEX_MAX_PAGES if needed)`,
  );
}

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
  test.describe.configure({ mode: "serial" });

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

  test("ECG + acid-base cues on AKI article when static-corpus phrases present", async ({ page }) => {
    await expectArticleOrSkip404(page, "/blog/lab-trends-and-acute-kidney-injury");
    const art = page.locator("article");
    const body = (await art.innerText()).toLowerCase();
    if (!/(ecg|hyperkalem|potassium)/i.test(body)) {
      test.skip(
        true,
        "Live DB body for lab-trends slug may replace static corpus (no ECG/hyperkalem cue in rendered HTML)",
      );
    }
    await expect(art.getByText(/ECG|hyperkalem|potassium/i).first()).toBeVisible({ timeout: 15_000 });
    if (!/(acid-base|metabolic acidosis|acid.base status)/i.test(body)) {
      test.skip(true, "Live DB body for lab-trends slug omits static acid-base teaching phrases");
    }
    await expect(art.getByText(/Acid-base|metabolic acidosis|acid–base|acid-base status/i).first()).toBeVisible({
      timeout: 15_000,
    });
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
    await expect(page.getByRole("heading", { name: /pathophysiology/i })).toBeVisible({ timeout: 15_000 });
  });

  /** Category hubs always resolve (may list 0 posts if DB has no rows in that category). */
  for (const category of ["Pharmacology", "Labs & Pathophysiology", "Exam Strategy"] as const) {
    test(`category hub ${category}`, async ({ page }) => {
      const path = `/blog/category/${encodeURIComponent(category)}`;
      const res = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 180_000 });
      expect(res?.ok(), `${path} ${res?.status()}`).toBeTruthy();
      await expect(page.getByRole("heading", { name: category, exact: true })).toBeVisible({ timeout: 30_000 });
    });
  }
});

const FIRST_BATCH_SLUGS = slugsFromFirstBatchEnv();

if (FIRST_BATCH_SLUGS.length > 0) {
  test.describe("Blog first-batch publish (BLOG_FIRST_BATCH_SLUGS)", () => {
    for (const slug of FIRST_BATCH_SLUGS) {
      test(`required live /blog/${slug} + index list link`, async ({ page }) => {
        await expectRequiredPublishedArticle(page, slug);
        await expectIndexLinkWithinPages(page, slug);
      });
    }
  });
}
