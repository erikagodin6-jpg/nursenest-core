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

const cfg = LESSON_FLOW_PATHWAY_QA[0]!;

test("mobile: homepage → hub → lessons → primary lesson header", async ({ page, context }) => {
  await context.addCookies([{ name: MARKETING_REGION_COOKIE, value: cfg.marketingRegionCookie, url: baseURL }]);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  assertPathwayNav(page.url(), cfg);

  await page.locator(`a[data-nn-exam-card-id="${cfg.homeCardExamId}"]`).click();
  await page.waitForLoadState("domcontentloaded");
  assertPathwayNav(page.url(), cfg);

  await page.locator(`a[href="${cfg.lessonsPath}"], a[href="${cfg.lessonsPath}/"]`).first().click();
  await page.waitForLoadState("domcontentloaded");
  assertPathwayNav(page.url(), cfg);

  const primary = page.locator('[data-nn-qa-primary-lesson="true"]').first();
  await expect(primary).toBeVisible({ timeout: 120_000 });
  await primary.click();
  await page.waitForLoadState("domcontentloaded");
  assertPathwayNav(page.url(), cfg);

  const header = page.locator(`header[data-nn-pathway-id="${cfg.pathwayId}"]`);
  await expect(header).toBeVisible();
  await expect(lessonsBreadcrumbLocator(page, cfg.lessonsPath).first()).toBeVisible();
});
