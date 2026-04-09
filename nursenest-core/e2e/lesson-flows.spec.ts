import { test, expect, type Page } from "@playwright/test";
import {
  LESSON_FLOW_PATHWAY_QA,
  throwIfUrlNotAllowedForPathway,
} from "../src/lib/qa/lesson-flow-pathways";
import { MARKETING_REGION_COOKIE } from "../src/lib/region/marketing-region-cookie";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

function assertPathwayNav(url: string, cfg: (typeof LESSON_FLOW_PATHWAY_QA)[number]) {
  throwIfUrlNotAllowedForPathway(url, cfg);
}

function lessonsBreadcrumbLocator(page: Page, lessonsPath: string) {
  const p = lessonsPath.replace(/\/$/, "");
  return page.locator(`nav[aria-label="Breadcrumb"] a[href="${p}"], nav[aria-label="Breadcrumb"] a[href="${p}/"]`);
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try {
      localStorage.removeItem("nursenest-region");
    } catch {
      /* ignore */
    }
  });
});

test.describe("Homepage exam cards (cookie, first paint)", () => {
  for (const [cookie, expectRn] of [
    ["US", /\/us\/rn\/nclex-rn/],
    ["CA", /\/canada\/rn\/nclex-rn/],
  ] as const) {
    test(`RN card matches ${cookie} (href + data-nn-marketing-region)`, async ({ page, context }) => {
      await context.addCookies([{ name: MARKETING_REGION_COOKIE, value: cookie, url: baseURL }]);
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const card = page.locator('[data-nn-exam-card-id="rn"]');
      await expect(card).toBeVisible();
      await expect(card).toHaveAttribute("data-nn-marketing-region", cookie);
      const href = await card.getAttribute("href");
      expect(href ?? "").toMatch(expectRn);
    });
  }
});

for (const cfg of LESSON_FLOW_PATHWAY_QA) {
  test.describe(cfg.pathwayId, () => {
    test("marketing homepage → hub → lessons → lesson → CTAs → study loop → breadcrumb to lessons hub", async ({
      page,
      context,
    }) => {
      await context.addCookies([
        { name: MARKETING_REGION_COOKIE, value: cfg.marketingRegionCookie, url: baseURL },
      ]);

      await page.goto("/", { waitUntil: "domcontentloaded" });
      assertPathwayNav(page.url(), cfg);

      await page.locator(`a[data-nn-exam-card-id="${cfg.homeCardExamId}"]`).click();
      await page.waitForLoadState("domcontentloaded");
      assertPathwayNav(page.url(), cfg);
      expect(page.url()).toContain(cfg.hubPath.replace(/\/$/, ""));

      await page
        .locator(`a[href="${cfg.lessonsPath}"], a[href="${cfg.lessonsPath}/"]`)
        .first()
        .click();
      await page.waitForLoadState("domcontentloaded");
      assertPathwayNav(page.url(), cfg);
      expect(page.url()).toContain(cfg.lessonsPath.replace(/\/$/, ""));

      const primary = page.locator('[data-nn-qa-primary-lesson="true"]').first();
      await expect(primary).toBeVisible({ timeout: 120_000 });
      await primary.click();
      await page.waitForLoadState("domcontentloaded");
      assertPathwayNav(page.url(), cfg);

      const lessonPageUrl = page.url();

      const header = page.locator(`header[data-nn-pathway-id="${cfg.pathwayId}"]`);
      await expect(header).toBeVisible();
      await expect(header).toHaveAttribute("data-nn-exam-short", cfg.pathway.shortName);

      if (cfg.pathwayId === "ca-rpn-rex-pn") {
        await expect(header).not.toContainText("NCLEX-PN");
      }
      if (cfg.pathwayId === "us-lpn-nclex-pn") {
        await expect(header).not.toContainText("REx");
      }

      await expect(lessonsBreadcrumbLocator(page, cfg.lessonsPath).first()).toBeVisible();

      const practice = page.getByTestId("pathway-lesson-cta-practice-topic");
      await expect(practice).toBeVisible();
      const qbHref = await practice.getAttribute("href");
      expect(qbHref).toBeTruthy();
      expect(qbHref).toContain(cfg.pathwayId);
      assertPathwayNav(new URL(qbHref!, page.url()).href, cfg);

      const catWeak = page.getByTestId("pathway-lesson-cta-cat-practice");
      await expect(catWeak).toBeVisible();
      const catHref = await catWeak.getAttribute("href");
      expect(catHref).toBeTruthy();
      expect(catHref).toContain("pathwayId=");
      assertPathwayNav(new URL(catHref!, page.url()).href, cfg);

      await practice.click();
      await page.waitForLoadState("domcontentloaded");
      assertPathwayNav(page.url(), cfg);

      await page.goto(lessonPageUrl, { waitUntil: "domcontentloaded" });
      assertPathwayNav(page.url(), cfg);

      await page.getByText("After this lesson", { exact: true }).waitFor({ state: "visible", timeout: 120_000 });
      await expect(page.locator('[data-nn-qa-study-loop="true"]')).toBeVisible();

      const related = page.locator('[data-nn-qa-related-lesson="true"]').first();
      const topicHub = page.getByRole("link", { name: /All lessons in this topic|Back to lesson hub/ });

      if (await related.isVisible().catch(() => false)) {
        await related.click();
        await page.waitForLoadState("domcontentloaded");
        assertPathwayNav(page.url(), cfg);
        await page.goto(lessonPageUrl, { waitUntil: "domcontentloaded" });
      } else if (await topicHub.isVisible().catch(() => false)) {
        await topicHub.click();
        await page.waitForLoadState("domcontentloaded");
        assertPathwayNav(page.url(), cfg);
        await page.goto(lessonPageUrl, { waitUntil: "domcontentloaded" });
      }

      const catPrep = page.getByRole("link", { name: /CAT prep · this pathway/ });
      await expect(catPrep).toBeVisible();
      const catPrepHref = await catPrep.getAttribute("href");
      expect(catPrepHref).toBeTruthy();
      assertPathwayNav(new URL(catPrepHref!, page.url()).href, cfg);
      await catPrep.click();
      await page.waitForLoadState("domcontentloaded");
      assertPathwayNav(page.url(), cfg);

      await page.goto(lessonPageUrl, { waitUntil: "domcontentloaded" });

      await lessonsBreadcrumbLocator(page, cfg.lessonsPath).first().click();
      await page.waitForLoadState("domcontentloaded");
      assertPathwayNav(page.url(), cfg);
      expect(page.url()).toContain(cfg.lessonsPath.replace(/\/$/, ""));
    });
  });
}
